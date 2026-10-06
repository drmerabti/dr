/* ================= Storage (IndexedDB with localStorage fallback) =================
   Stores: exams (full exam objects), library (saved objects), kv (misc / caches). */
const Store = (() => {
  const DB_NAME = 'examgen', DB_VER = 1, STORES = ['exams', 'library', 'kv'];
  let dbp = null, useLS = false;

  function open(){
    if(dbp) return dbp;
    dbp = new Promise(resolve => {
      if(!window.indexedDB){ useLS = true; return resolve(null); }
      let req;
      try{ req = indexedDB.open(DB_NAME, DB_VER); }catch(e){ useLS = true; return resolve(null); }
      req.onupgradeneeded = () => {
        const db = req.result;
        STORES.forEach(s => { if(!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: 'id' }); });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => { useLS = true; resolve(null); };
      req.onblocked = () => { useLS = true; resolve(null); };
    });
    return dbp;
  }
  const lsKey = (store, id) => `examgen_store_${store}_${id}`;
  function lsAll(store){
    const out = [], pre = `examgen_store_${store}_`;
    for(let i=0;i<localStorage.length;i++){
      const k = localStorage.key(i);
      if(k && k.startsWith(pre)){ try{ out.push(JSON.parse(localStorage.getItem(k))); }catch(e){} }
    }
    return out;
  }
  function tx(db, store, mode, fn){
    return new Promise((resolve, reject) => {
      const t = db.transaction(store, mode);
      const s = t.objectStore(store);
      let result;
      const r = fn(s);
      if(r) r.onsuccess = () => { result = r.result; };
      t.oncomplete = () => resolve(result);
      t.onerror = () => reject(t.error);
      t.onabort = () => reject(t.error);
    });
  }
  async function get(store, id){
    const db = await open();
    if(!db) { try{ return JSON.parse(localStorage.getItem(lsKey(store,id))); }catch(e){ return null; } }
    return tx(db, store, 'readonly', s => s.get(id)).then(v => v || null);
  }
  async function put(store, obj){
    const db = await open();
    if(!db){ localStorage.setItem(lsKey(store, obj.id), JSON.stringify(obj)); return obj; }
    await tx(db, store, 'readwrite', s => s.put(obj));
    return obj;
  }
  async function del(store, id){
    const db = await open();
    if(!db){ localStorage.removeItem(lsKey(store,id)); return; }
    return tx(db, store, 'readwrite', s => s.delete(id));
  }
  async function all(store){
    const db = await open();
    if(!db) return lsAll(store);
    return tx(db, store, 'readonly', s => s.getAll()).then(v => v || []);
  }
  async function kvGet(key, def){ const r = await get('kv', key); return r ? r.v : def; }
  async function kvSet(key, v){ return put('kv', { id: key, v }); }

  /* One-time migration of the original localStorage exams (examgen_list_v1 + examgen_exam_<id>). */
  async function migrateLegacy(){
    if(await kvGet('legacy_migrated', false)) return;
    let list = [];
    try{ list = JSON.parse(localStorage.getItem('examgen_list_v1') || '[]'); }catch(e){}
    for(const item of list){
      try{
        const ex = JSON.parse(localStorage.getItem('examgen_exam_' + item.id));
        if(ex && !(await get('exams', ex.id))) await put('exams', ex);
      }catch(e){}
    }
    await kvSet('legacy_migrated', true);
  }
  return { open, get, put, del, all, kvGet, kvSet, migrateLegacy, get usingFallback(){ return useLS; } };
})();
