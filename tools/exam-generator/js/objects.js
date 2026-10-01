/* ================= Embedded objects (equations, drawings, curves, tables, images) =================
   An object lives in exam.objects[oid] and is referenced from rich text by
   <span class="eobj" contenteditable="false" data-oid="..."></span>.
   Each kind registers { label, icon, color, render(obj) -> html, edit(obj|null, done(obj)) }. */

const ObjKinds = {};
function registerKind(kind, def){ ObjKinds[kind] = def; }

const DISPLAY_MODES = ['inline', 'block', 'float-left', 'float-right'];
function displayLabel(d){
  return {
    inline: L('داخل السطر','Inline','Dans la ligne'),
    block: L('سطر مستقل','Own line','Ligne seule'),
    'float-left': L('بجانب النص (يسار)','Beside text (left)','À côté (gauche)'),
    'float-right': L('بجانب النص (يمين)','Beside text (right)','À côté (droite)')
  }[d];
}
const DEFAULT_W = { plot: 400, draw: 340, image: 220, vartab: 520 };

function newObjId(){ return uid('o_'); }

/* ---------- Markup ---------- */
function objInnerHTML(obj){
  const k = ObjKinds[obj.kind];
  if(!k) return `<span class="eobj-missing">?</span>`;
  try{ return k.render(obj); }catch(e){ console.error(e); return `<span class="eobj-missing">⚠</span>`; }
}
function objStyle(obj){
  const parts = [];
  if(obj.kind === 'eq'){ const s = (obj.data && obj.data.size) || 1; if(s !== 1) parts.push(`font-size:${s}em`); }
  else if(obj.kind !== 'table' && obj.w) parts.push(`--ow:${obj.w}px`);
  if(obj.display === 'block' && obj.align) parts.push(`text-align:${obj.align}`);
  return parts.join(';');
}
function objClass(obj){
  return `eobj eobj-${obj.kind} d-${obj.display || 'inline'}`;
}
/* Fill all object placeholders inside a container from the given objects map */
function hydrateObjects(container, objects){
  container.querySelectorAll('.eobj[data-oid]').forEach(span => {
    const obj = objects && objects[span.dataset.oid];
    if(!obj){ span.className = 'eobj eobj-missing-wrap'; span.innerHTML = ''; return; }
    span.className = objClass(obj);
    span.setAttribute('contenteditable', 'false');
    span.setAttribute('style', objStyle(obj));
    if(obj.kind !== 'table') span.setAttribute('dir', 'ltr'); else span.removeAttribute('dir');
    span.innerHTML = objInnerHTML(obj);
  });
}

/* ---------- Rich text sanitize / serialize ---------- */
const RICH_KEEP = new Set(['B','STRONG','I','EM','U','BR','SUB','SUP','DIV','P','SPAN']);
function sanitizeRich(html){
  const tpl = document.createElement('template');
  tpl.innerHTML = html || '';
  (function walk(node){
    [...node.childNodes].forEach(ch => {
      if(ch.nodeType === 3) return;
      if(ch.nodeType !== 1){ ch.remove(); return; }
      if(ch.classList && ch.classList.contains('eobj') && ch.dataset.oid){
        const oid = ch.dataset.oid;
        const clean = document.createElement('span');
        clean.className = 'eobj'; clean.setAttribute('data-oid', oid); clean.setAttribute('contenteditable','false');
        ch.replaceWith(clean); return;
      }
      if(!RICH_KEEP.has(ch.tagName)){
        walk(ch);
        ch.replaceWith(...ch.childNodes); return;
      }
      [...ch.attributes].forEach(a => ch.removeAttribute(a.name));
      walk(ch);
      if(ch.tagName === 'SPAN') ch.replaceWith(...ch.childNodes);
    });
  })(tpl.content);
  return tpl.innerHTML;
}
function textToHtml(s){ return escapeHtml(s || '').replace(/\n/g, '<br>'); }
function richToPlain(html){
  const d = document.createElement('div');
  d.innerHTML = (html || '').replace(/<br\s*\/?>/gi, '\n');
  d.querySelectorAll('.eobj').forEach(e => e.replaceWith('▢'));
  return d.textContent;
}
function richHasContent(html){ return /\S/.test(richToPlain(html)) || /class="eobj"/.test(html || ''); }
/* Object ids referenced from a rich html string */
function richObjIds(html){
  const ids = []; const re = /data-oid="([^"]+)"/g; let m;
  while((m = re.exec(html || ''))) ids.push(m[1]);
  return ids;
}

/* ---------- Rich field ---------- */
function richFieldHTML(html, attrs, placeholder, cls){
  return `<div class="rich ${cls || ''}" ${isReadonly ? '' : 'contenteditable="true"'} ${attrs || ''} data-ph="${escAttr(placeholder || '…')}">${html || ''}</div>`;
}
function captureRich(el){
  const sel = window.getSelection();
  let range = null;
  if(sel.rangeCount){
    const r = sel.getRangeAt(0);
    if(el.contains(r.startContainer)) range = r.cloneRange();
  }
  activeEditable = { type: 'rich', el, range };
}
/* Wire a rich field: onChange(html) is called with sanitized html */
function bindRich(el, onChange, onFocus){
  if(isReadonly) return;
  el.addEventListener('input', () => { onChange(sanitizeRich(el.innerHTML)); captureRich(el); });
  el.addEventListener('focus', () => { captureRich(el); onFocus && onFocus(); });
  el.addEventListener('keyup', () => captureRich(el));
  el.addEventListener('mouseup', () => captureRich(el));
  el.addEventListener('paste', e => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
  });
  el.addEventListener('keydown', e => {
    if((e.ctrlKey || e.metaKey) && ['b','i','u'].includes(e.key.toLowerCase())){
      e.preventDefault();
      document.execCommand({ b:'bold', i:'italic', u:'underline' }[e.key.toLowerCase()]);
    }
  });
  el.addEventListener('click', e => {
    const o = e.target.closest('.eobj[data-oid]');
    if(o && el.contains(o)){ e.preventDefault(); e.stopPropagation(); selectObject(o); }
  });
  el.addEventListener('dblclick', e => {
    const o = e.target.closest('.eobj[data-oid]');
    if(o && el.contains(o)){ e.preventDefault(); editObjectEl(o); }
  });
}

/* ---------- Inserting objects into the exam ---------- */
/* Put a node at the saved caret of the active rich field; returns the rich element used. */
function insertNodeAtCaret(node){
  const ae = activeEditable;
  let el = ae && ae.type === 'rich' && document.body.contains(ae.el) ? ae.el : null;
  if(!el){
    let qEl = selectedId && document.querySelector(`.question[data-id="${selectedId}"]`);
    if(!qEl){
      addQuestion('normal');
      qEl = document.querySelector('.question:last-child');
    }
    el = qEl.querySelector('.rich[data-rich="text"]');
    const r = document.createRange(); r.selectNodeContents(el); r.collapse(false);
    activeEditable = { type: 'rich', el, range: r };
  }
  let range = activeEditable.range;
  el.focus();
  const sel = window.getSelection();
  sel.removeAllRanges();
  if(!range || !el.contains(range.startContainer)){ range = document.createRange(); range.selectNodeContents(el); range.collapse(false); }
  sel.addRange(range);
  range.deleteContents();
  range.insertNode(node);
  const spacer = document.createTextNode(' ');
  node.after(spacer);
  const after = document.createRange();
  after.setStartAfter(spacer); after.collapse(true);
  sel.removeAllRanges(); sel.addRange(after);
  activeEditable = { type: 'rich', el, range: after.cloneRange() };
  return el;
}

function insertObjectIntoExam(obj){
  if(isReadonly) return;
  exam.objects = exam.objects || {};
  obj.id = obj.id || newObjId();
  exam.objects[obj.id] = obj;
  const span = document.createElement('span');
  span.className = 'eobj'; span.dataset.oid = obj.id; span.setAttribute('contenteditable', 'false');
  const el = insertNodeAtCaret(span);
  hydrateObjects(el, exam.objects);
  el.dispatchEvent(new Event('input', { bubbles: true }));
  scheduleSave();
  setTimeout(() => { const s = document.querySelector(`.eobj[data-oid="${obj.id}"]`); if(s){ selectObject(s); s.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } }, 30);
}

/* Open the editor for a kind and insert the result (used by the tool buttons) */
function startObjectTool(kind, presetData){
  if(isReadonly) return;
  const saved = activeEditable ? { ...activeEditable } : null;
  ObjKinds[kind].edit(presetData ? { kind, data: presetData } : null, (obj) => {
    activeEditable = saved;
    obj.kind = obj.kind || kind;
    kind = obj.kind;
    if(!obj.display) obj.display = (kind === 'eq') ? (obj._wantBlock ? 'block' : 'inline') : 'block';
    if(!obj.w && DEFAULT_W[kind]) obj.w = DEFAULT_W[kind];
    if(obj.display === 'block' && !obj.align) obj.align = 'center';
    delete obj._wantBlock;
    insertObjectIntoExam(obj);
    if(typeof libraryAutoSave === 'function') libraryAutoSave(obj);
  });
}

/* ---------- Selection + floating toolbar ---------- */
let selectedObj = null;
function selectObject(span){
  if(isReadonly) return;
  document.querySelectorAll('.eobj.obj-selected').forEach(e => e.classList.remove('obj-selected'));
  span.classList.add('obj-selected');
  selectedObj = span;
  const q = span.closest('.question'); if(q) selectQuestionLight(q.dataset.id);
  showObjToolbar(span);
}
function deselectObject(){
  document.querySelectorAll('.eobj.obj-selected').forEach(e => e.classList.remove('obj-selected'));
  selectedObj = null;
  const tb = document.getElementById('objToolbar'); if(tb) tb.classList.add('hidden');
}
document.addEventListener('mousedown', e => {
  if(!selectedObj) return;
  if(e.target.closest('#objToolbar') || e.target.closest('.eobj.obj-selected') || e.target.closest('.eg-modal-backdrop')) return;
  deselectObject();
});
window.addEventListener('scroll', () => { if(selectedObj && document.body.contains(selectedObj)) showObjToolbar(selectedObj); }, true);

function showObjToolbar(span){
  let tb = document.getElementById('objToolbar');
  if(!tb){ tb = document.createElement('div'); tb.id = 'objToolbar'; document.body.appendChild(tb); }
  const obj = exam.objects[span.dataset.oid]; if(!obj) return;
  const k = ObjKinds[obj.kind];
  const sizeable = obj.kind !== 'table';
  tb.innerHTML = `
    <span class="otb-kind" style="background:${k.color}">${k.icon} ${k.label()}</span>
    <button data-o="edit" class="otb-main">✏️ ${L('تعديل','Edit','Modifier')}</button>
    ${sizeable ? `<button data-o="smaller" title="${L('تصغير','Smaller','Réduire')}">➖</button><button data-o="bigger" title="${L('تكبير','Bigger','Agrandir')}">➕</button>` : ''}
    <select data-o="display">${DISPLAY_MODES.filter(d => obj.kind === 'eq' ? (d === 'inline' || d === 'block') : true)
      .map(d => `<option value="${d}" ${obj.display === d ? 'selected' : ''}>${displayLabel(d)}</option>`).join('')}</select>
    ${obj.display === 'block' ? `<span class="otb-align">
      <button data-o="al-right" class="${obj.align==='right'?'on':''}" title="${L('يمين','Right','Droite')}">⇥</button>
      <button data-o="al-center" class="${(obj.align||'center')==='center'?'on':''}" title="${L('وسط','Center','Centre')}">↔</button>
      <button data-o="al-left" class="${obj.align==='left'?'on':''}" title="${L('يسار','Left','Gauche')}">⇤</button></span>` : ''}
    <button data-o="lib" title="${L('حفظ في مكتبتي','Save to library','Enregistrer')}">📚</button>
    <button data-o="del" class="otb-del" title="${L('حذف','Delete','Supprimer')}">🗑️</button>`;
  tb.classList.remove('hidden');
  const r = span.getBoundingClientRect();
  const tbw = tb.offsetWidth || 420;
  let left = r.left + r.width / 2 - tbw / 2 + window.scrollX;
  left = Math.max(8, Math.min(left, window.scrollX + document.documentElement.clientWidth - tbw - 8));
  let top = r.top + window.scrollY - tb.offsetHeight - 10;
  if(r.top < 70) top = r.bottom + window.scrollY + 10;
  tb.style.left = left + 'px'; tb.style.top = top + 'px';
  tb.querySelectorAll('button[data-o]').forEach(b => b.onclick = (e) => { e.stopPropagation(); objAction(span, b.dataset.o); });
  tb.querySelector('select').onchange = (e) => {
    obj.display = e.target.value;
    if(obj.display === 'block' && !obj.align) obj.align = 'center';
    refreshObjectEverywhere(obj.id); scheduleSave();
  };
}
function objAction(span, act){
  const obj = exam.objects[span.dataset.oid]; if(!obj) return;
  if(act === 'edit') return editObjectEl(span);
  if(act === 'del'){
    const rich = span.closest('.rich');
    span.remove(); deselectObject();
    if(rich) rich.dispatchEvent(new Event('input', { bubbles: true }));
    return;
  }
  if(act === 'lib'){ if(typeof libraryAutoSave === 'function') libraryAutoSave(obj, true); return; }
  if(act === 'smaller' || act === 'bigger'){
    const f = act === 'bigger' ? 1.15 : 1 / 1.15;
    if(obj.kind === 'eq'){ obj.data.size = Math.round(Math.max(0.6, Math.min(3, ((obj.data.size || 1) * f))) * 100) / 100; }
    else { obj.w = Math.round(Math.max(60, Math.min(660, (obj.w || DEFAULT_W[obj.kind] || 300) * f))); }
  }
  if(act.startsWith('al-')) obj.align = act.slice(3);
  refreshObjectEverywhere(obj.id); scheduleSave();
}
function refreshObjectEverywhere(oid){
  document.querySelectorAll(`#examPage .eobj[data-oid="${oid}"]`).forEach(s => {
    const holder = document.createElement('div');
    s.parentNode.insertBefore(holder, s); holder.appendChild(s);
    hydrateObjects(holder, exam.objects);
    holder.replaceWith(s);
    if(selectedObj && selectedObj.dataset.oid === oid){ s.classList.add('obj-selected'); selectedObj = s; showObjToolbar(s); }
  });
}
function editObjectEl(span){
  const obj = exam.objects[span.dataset.oid]; if(!obj || isReadonly) return;
  ObjKinds[obj.kind].edit(JSON.parse(JSON.stringify(obj)), (res) => {
    Object.assign(obj, res, { id: obj.id, kind: obj.kind, display: obj.display, align: obj.align, w: res.w || obj.w });
    refreshObjectEverywhere(obj.id); scheduleSave();
    if(typeof libraryAutoSave === 'function') libraryAutoSave(obj);
  });
}
document.addEventListener('keydown', e => {
  if(!selectedObj || _modalStack.length) return;
  if(e.key === 'Delete' || e.key === 'Backspace'){
    const a = document.activeElement;
    if(a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.tagName === 'SELECT')) return;
    e.preventDefault(); objAction(selectedObj, 'del');
  }
});

/* ---------- SVG helpers: measuring and rasterizing (for Word export) ---------- */
function ensureSvgNs(svg){
  if(!/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/.test(svg)) svg = svg.replace(/<svg\b/, '<svg xmlns="http://www.w3.org/2000/svg"');
  if(/xlink:/.test(svg) && !/xmlns:xlink=/.test(svg)) svg = svg.replace(/<svg\b/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  return svg;
}
/* Rasterize an svg string to PNG bytes at given CSS-pixel size × scale */
function svgToPng(svg, w, h, scale){
  scale = scale || 3;
  return new Promise((resolve, reject) => {
    let s = ensureSvgNs(svg)
      .replace(/<svg\b([^>]*?)\swidth="[^"]*"/, '<svg$1')
      .replace(/<svg\b([^>]*?)\sheight="[^"]*"/, '<svg$1')
      .replace(/<svg\b/, `<svg width="${w}" height="${h}"`)
      .replace(/currentColor/g, '#000');
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(w * scale)); c.height = Math.max(1, Math.round(h * scale));
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      c.toBlob(b => b.arrayBuffer().then(buf => resolve(new Uint8Array(buf))), 'image/png');
    };
    img.onerror = reject;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
  });
}
function dataUrlToBytes(url){
  const b = atob(url.split(',')[1]); const a = new Uint8Array(b.length);
  for(let i=0;i<b.length;i++) a[i] = b.charCodeAt(i);
  return a;
}
