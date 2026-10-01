/* ================= My library: everything the teacher creates is saved here automatically ================= */

let libraryItems = [];
const LIB_KINDS = [
  { k: 'all', ic: '🗂️', n: () => L('الكل','All','Tout') },
  { k: 'eq', ic: '∑', n: () => L('معادلات','Equations','Équations') },
  { k: 'plot', ic: '📈', n: () => L('منحنيات','Curves','Courbes') },
  { k: 'draw', ic: '📐', n: () => L('رسومات','Drawings','Dessins') },
  { k: 'table', ic: '▦', n: () => L('جداول','Tables','Tableaux') },
  { k: 'image', ic: '🖼️', n: () => L('صور','Images','Images') },
];
const libKindOf = it => it.kind === 'vartab' ? 'table' : it.kind;

async function initLibrary(){
  try{ libraryItems = (await Store.all('library')).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)); }catch(e){ libraryItems = []; }
}

/* ---------- image objects ---------- */
registerKind('image', {
  label: () => L('صورة','Image','Image'), icon: '🖼️', color: '#D6558C',
  render: (obj) => `<span class="g-box"><img src="${obj.data.src}" alt=""></span>`,
  edit: (obj, done) => {
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = () => { const f = inp.files[0]; if(!f) return; const r = new FileReader();
      r.onload = ev => shrinkImage(ev.target.result, 1400).then(src => done({ kind: 'image', data: { src, name: f.name } })); r.readAsDataURL(f); };
    inp.click();
  },
});

function autoTitle(obj){
  const d = obj.data || {};
  if(obj.kind === 'eq') return (d.latex || '').replace(/\\(mathrm|left|right|displaystyle)/g, '').replace(/[{}\\]/g, '').slice(0, 40) || L('معادلة','Equation','Équation');
  if(obj.kind === 'plot'){
    if(d.type === 'bar') return L('أعمدة بيانية','Bar chart','Diagramme en barres');
    if(d.type === 'pie') return L('دائرة نسبية','Pie chart','Diagramme circulaire');
    const c = (d.curves || [])[0];
    return c ? (c.kind === 'fx' ? 'f(x) = ' + c.expr : L('منحنى من جدول','Curve from table','Courbe (tableau)')) : L('منحنى','Curve','Courbe');
  }
  if(obj.kind === 'draw'){
    const shapes = ((d.json && d.json.objects) || []).filter(o => o.egType === 'shape').map(o => o.egShape);
    const names = SHAPE_LIB.flatMap(c => c.items).filter(it => shapes.includes(it.k)).map(it => it.n());
    const pts = ((d.json && d.json.objects) || []).filter(o => o.egType === 'point').map(o => o.name).join('');
    return names.length ? names.slice(0, 2).join(' + ') : (pts ? L('شكل هندسي ','Figure ','Figure ') + pts.slice(0, 8) : L('رسم','Drawing','Dessin'));
  }
  if(obj.kind === 'table') return L('جدول ','Table ','Tableau ') + d.rows.length + '×' + d.rows[0].length;
  if(obj.kind === 'vartab') return d.mode === 'sign' ? L('جدول إشارة','Sign table','Tableau de signes') : L('جدول تغيرات','Variation table','Tableau de variations');
  if(obj.kind === 'image') return d.name || L('صورة','Image','Image');
  return '';
}
function currentSubject(){
  if(!$('editorView').classList.contains('hidden') && exam.header.subject) return exam.header.subject;
  return (typeof getSettings === 'function' && getSettings().subject) || '';
}
/* Save (or update) an object in the library. Called automatically after every create/edit. */
async function libraryAutoSave(obj, explicit){
  try{
    const now = Date.now();
    let item = obj.libId && libraryItems.find(x => x.id === obj.libId);
    if(!item){
      item = { id: uid('lib_'), createdAt: now, subject: currentSubject(), title: autoTitle(obj) };
      obj.libId = item.id;
      libraryItems.unshift(item);
    }
    Object.assign(item, { kind: obj.kind, data: JSON.parse(JSON.stringify(obj.data || {})), svg: obj.svg || '', html: obj.html || '', w: obj.w, updatedAt: now });
    if(!item.titleEdited) item.title = autoTitle(obj);
    await Store.put('library', item);
    if(explicit) toast(L('تم الحفظ في مكتبتي ✓','Saved to my library ✓','Enregistré ✓'), 'ok');
    if(!$('libraryView').classList.contains('hidden')) renderLibraryView();
  }catch(e){ console.warn('library save failed', e); }
}

function libPreview(it){
  if(it.kind === 'eq') return `<span class="lib-eq" dir="ltr">${it.svg}</span>`;
  if(it.kind === 'table') return `<div class="lib-tbl">${it.html}</div>`;
  if(it.kind === 'image') return `<img src="${it.data.src}" alt="">`;
  return it.svg || '';
}
function libSubjects(){
  const s = new Set(libraryItems.map(i => i.subject).filter(Boolean));
  const st = typeof getSettings === 'function' ? getSettings() : {};
  if(st.subject) s.add(st.subject);
  return [...s];
}

let libFilter = { kind: 'all', q: '', subject: '' };
function libFiltered(){
  const q = libFilter.q.trim().toLowerCase();
  return libraryItems.filter(it => (libFilter.kind === 'all' || libKindOf(it) === libFilter.kind)
    && (!libFilter.subject || it.subject === libFilter.subject)
    && (!q || (it.title || '').toLowerCase().includes(q) || (it.subject || '').toLowerCase().includes(q)));
}
function libToolbarHTML(){
  const counts = {}; libraryItems.forEach(it => { const k = libKindOf(it); counts[k] = (counts[k] || 0) + 1; });
  return `<div class="lib-bar">
    <input class="search-input" data-libq value="${escAttr(libFilter.q)}" placeholder="${L('ابحث في مكتبتي...','Search my library...','Rechercher...')}">
    <select class="pinp lib-subj" data-libs><option value="">${L('كل المواد','All subjects','Toutes matières')}</option>${libSubjects().map(s => `<option ${s === libFilter.subject ? 'selected' : ''}>${escapeHtml(s)}</option>`).join('')}</select>
  </div>
  <div class="lib-chips">${LIB_KINDS.map(k => `<button data-libk="${k.k}" class="${libFilter.kind === k.k ? 'on' : ''}">${k.ic} ${k.n()} <b>${k.k === 'all' ? libraryItems.length : (counts[k.k] || 0)}</b></button>`).join('')}</div>`;
}
function libCardHTML(it, picker){
  return `<div class="lib-card" data-id="${it.id}">
    <div class="lib-prev">${libPreview(it)}</div>
    <div class="lib-info">
      <div class="lib-title" title="${escAttr(it.title)}">${escapeHtml(it.title || '')}</div>
      <div class="lib-meta"><span class="chip" style="background:${subjectColor(it.subject)}1A;color:${subjectColor(it.subject)}">${escapeHtml(it.subject || L('بدون مادة','No subject','Sans matière'))}</span><span class="lib-date">${fmtDate(it.updatedAt)}</span></div>
    </div>
    <div class="lib-actions">
      ${picker ? `<button class="ec-btn ec-open" data-la="insert">⬇ ${L('إدراج','Insert','Insérer')}</button>` : `<button class="ec-btn ec-open" data-la="use" title="${L('إدراج في امتحان','Use in an exam','Utiliser dans un examen')}">⬇ ${L('إدراج','Insert','Insérer')}</button>`}
      <button class="ec-btn" data-la="edit" title="${L('تعديل','Edit','Modifier')}">✏️</button>
      ${picker ? '' : `<button class="ec-btn" data-la="rename" title="${L('إعادة التسمية والمادة','Rename / subject','Renommer')}">🏷️</button><button class="ec-btn" data-la="dup" title="${L('نسخ','Duplicate','Dupliquer')}">📋</button>`}
      <button class="ec-btn ec-del" data-la="del" title="${L('حذف','Delete','Supprimer')}">🗑️</button>
    </div>
  </div>`;
}
function bindLibGrid(container, picker, onInsert, rerender){
  container.querySelector('[data-libq]').oninput = e => { libFilter.q = e.target.value; rerender(true); };
  container.querySelector('[data-libs]').onchange = e => { libFilter.subject = e.target.value; rerender(); };
  container.querySelectorAll('[data-libk]').forEach(b => b.onclick = () => { libFilter.kind = b.dataset.libk; rerender(); });
  container.querySelectorAll('.lib-card').forEach(card => {
    const it = libraryItems.find(x => x.id === card.dataset.id);
    card.querySelectorAll('[data-la]').forEach(b => b.onclick = async e => {
      e.stopPropagation();
      const a = b.dataset.la;
      if(a === 'insert') return onInsert(it);
      if(a === 'use'){ pickExamForItem(it); return; }
      if(a === 'edit'){
        ObjKinds[it.kind].edit(JSON.parse(JSON.stringify({ kind: it.kind, data: it.data, svg: it.svg || 'x', html: it.html || 'x', w: it.w })), res => {
          libraryAutoSave(Object.assign(res, { kind: res.kind || it.kind, libId: it.id }), true); rerender();
        }, { mode: 'library' });
        return;
      }
      if(a === 'rename'){ openLibItemProps(it, rerender); return; }
      if(a === 'dup'){ const c = JSON.parse(JSON.stringify(it)); c.id = uid('lib_'); c.createdAt = c.updatedAt = Date.now(); c.title += ' (2)'; libraryItems.unshift(c); await Store.put('library', c); rerender(); return; }
      if(a === 'del'){
        if(!(await askConfirm(L('حذف هذا العنصر من مكتبتي؟ (لن يُحذف من الامتحانات التي أدرج فيها)','Delete this item from the library? (Exams keep their copy)','Supprimer de la bibliothèque ?'), L('نعم، احذف','Yes, delete','Oui'), true))) return;
        await Store.del('library', it.id); libraryItems = libraryItems.filter(x => x.id !== it.id); rerender();
      }
    });
    if(picker) card.querySelector('.lib-prev').onclick = () => onInsert(it);
  });
}
function openLibItemProps(it, after){
  const subs = ['الرياضيات','العلوم الفيزيائية','علوم الطبيعة والحياة','اللغة العربية','اللغة الفرنسية','اللغة الإنجليزية','التاريخ والجغرافيا','التربية الإسلامية','التربية المدنية','الإعلام الآلي'].concat(libSubjects());
  const m = openModal({ size: 'small', icon: '🏷️', title: L('الاسم والمادة','Name & subject','Nom et matière'),
    body: `<label class="lbl-col">${L('الاسم','Name','Nom')}<input class="big-input" id="liT" value="${escAttr(it.title)}"></label>
      <label class="lbl-col">${L('المادة','Subject','Matière')}<input class="big-input" id="liS" list="liSubs" value="${escAttr(it.subject || '')}"><datalist id="liSubs">${[...new Set(subs)].map(s => `<option value="${escAttr(s)}">`).join('')}</datalist></label>`,
    footer: `<button class="big-btn ghost" data-close>${L('إلغاء','Cancel','Annuler')}</button><button class="big-btn primary" id="liOk">${L('حفظ','Save','Enregistrer')}</button>` });
  m.foot.querySelector('#liOk').onclick = async () => {
    it.title = m.body.querySelector('#liT').value; it.titleEdited = true; it.subject = m.body.querySelector('#liS').value;
    await Store.put('library', it); m.close(); after();
  };
}
/* Copy a library item into the exam as an independent object */
function libItemToObj(it){
  const o = { kind: it.kind, data: JSON.parse(JSON.stringify(it.data || {})), svg: it.svg, html: it.html, w: it.w || DEFAULT_W[it.kind] };
  o.display = it.kind === 'eq' ? 'inline' : 'block';
  if(o.display === 'block') o.align = 'center';
  return o;
}
function insertLibItem(it){
  insertObjectIntoExam(libItemToObj(it));
  toast(L('تم الإدراج ✓ (نسخة مستقلة يمكنك تعديلها)','Inserted ✓ (independent copy)','Inséré ✓'), 'ok');
}
function pickExamForItem(it){
  const m = openModal({ size: 'medium', icon: '⬇', title: L('في أي امتحان تريد إدراجه؟','Which exam?','Dans quel examen ?'),
    body: `<button class="big-btn primary" id="peNew" style="width:100%;justify-content:center;margin-bottom:12px">📝 ${L('في امتحان جديد','In a new exam','Dans un nouvel examen')}</button>
      <div class="pe-list">${examsCache.map(e => `<button class="pe-item" data-id="${e.id}"><b>${escapeHtml(e.header.title || t('untitledExam'))}</b><span>${escapeHtml([e.header.subject, e.header.grade].filter(Boolean).join(' — '))} · ${fmtDate(e.updatedAt)}</span></button>`).join('')}</div>` });
  const go = () => { m.close(); setTimeout(() => {
    let qEl = document.querySelector('#questionsWrap .question:last-child');
    if(!qEl){ addQuestion('normal'); qEl = document.querySelector('#questionsWrap .question:last-child'); }
    const el = qEl.querySelector('.rich[data-rich="text"]'); const r = document.createRange(); r.selectNodeContents(el); r.collapse(false);
    activeEditable = { type: 'rich', el, range: r }; selectedId = qEl.dataset.id;
    insertLibItem(it);
  }, 60); };
  m.body.querySelector('#peNew').onclick = () => { startNewExam(); go(); };
  m.body.querySelectorAll('.pe-item').forEach(b => b.onclick = () => { openExam(examsCache.find(e => e.id === b.dataset.id)); go(); });
}

/* ---------- Library page ---------- */
function renderLibraryView(keepFocus){
  const v = $('libraryView');
  const items = libFiltered();
  const focusPos = keepFocus && document.activeElement && document.activeElement.matches('[data-libq]') ? document.activeElement.selectionStart : null;
  v.innerHTML = backHomeBar() + `
    <div class="lib-create">
      <span class="lc-title">➕ ${L('أنشئ جديدًا:','Create new:','Créer :')}</span>
      ${TOOL_TILES.map(tl => `<button class="lc-btn" data-k="${tl.kind}" style="--c:${tl.color}"><span>${tl.icon}</span>${tl.name()}</button>`).join('')}
      <button class="lc-btn" data-k="image" style="--c:#D6558C"><span>🖼️</span>${L('صورة','Image','Image')}</button>
    </div>
    ${libToolbarHTML()}
    ${items.length ? `<div class="lib-grid">${items.map(it => libCardHTML(it, false)).join('')}</div>` :
      `<div class="lib-empty">📭 ${libraryItems.length ? L('لا توجد نتائج','No results','Aucun résultat') : L('مكتبتك فارغة. كل معادلة أو رسم أو منحنى أو جدول تنشئه سيظهر هنا تلقائيًا.','Your library is empty. Every equation, drawing, curve or table you create appears here automatically.','Votre bibliothèque est vide.')}</div>`}`;
  v.querySelectorAll('.lc-btn').forEach(b => b.onclick = () => {
    const k = b.dataset.k;
    ObjKinds[k].edit(null, obj => { obj.kind = obj.kind || k; libraryAutoSave(obj, true); }, { mode: 'library' });
  });
  bindLibGrid(v, false, null, (kf) => renderLibraryView(kf));
  if(focusPos != null){ const i = v.querySelector('[data-libq]'); i.focus(); i.setSelectionRange(focusPos, focusPos); }
}

/* ---------- Picker inside the exam editor ---------- */
function openLibraryPicker(){
  const saved = activeEditable ? { ...activeEditable } : null;
  const m = openModal({ icon: '📚', color: '#3B82C4', title: L('إدراج من مكتبتي','Insert from my library','Insérer depuis la bibliothèque') });
  const draw = (kf) => {
    const items = libFiltered();
    const pos = kf && document.activeElement && document.activeElement.matches('[data-libq]') ? document.activeElement.selectionStart : null;
    m.body.innerHTML = libToolbarHTML() + (items.length ? `<div class="lib-grid">${items.map(it => libCardHTML(it, true)).join('')}</div>` :
      `<div class="lib-empty">📭 ${L('لا توجد عناصر بعد. استعمل أدوات المعادلات والرسومات والمنحنيات والجداول وستُحفظ هنا تلقائيًا.','Nothing yet. Items you create are saved here automatically.','Rien pour l’instant.')}</div>`);
    bindLibGrid(m.body, true, it => { m.close(); activeEditable = saved; insertLibItem(it); }, draw);
    if(pos != null){ const i = m.body.querySelector('[data-libq]'); i.focus(); i.setSelectionRange(pos, pos); }
  };
  draw();
}
