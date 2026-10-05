/* ================= Editor shell: side panel (accordion), stage zoom, top bar extras =================
   Layout follows the brochure tool: fixed 60px top bar, panel always on the right (40%),
   dotted preview stage (60%) with a small floating bar. */

let openSec = null;

/* ---------- Accordion ---------- */
function toggleSec(id, force){
  openSec = (force === undefined ? openSec !== id : force) ? id : null;
  document.querySelectorAll('#accordion .acc').forEach(a => a.classList.toggle('open', a.dataset.sec === openSec));
  if(openSec) refreshPanel();
}
$('accordion').addEventListener('click', e => {
  const head = e.target.closest('.acc-head');
  if(head){ toggleSec(head.closest('.acc').dataset.sec); return; }
  const nx = e.target.closest('[data-next]');
  if(nx){
    const secs = [...document.querySelectorAll('#accordion .acc')].map(a => a.dataset.sec);
    const next = secs[secs.indexOf(nx.dataset.next) + 1];
    toggleSec(next || null, !!next);
    if(next) setTimeout(() => document.querySelector(`.acc[data-sec="${next}"]`).scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 280);
  }
});
function openQuestionEditor(){
  // keep "insert tools" open while the teacher is placing equations/curves/drawings/tables
  if(isReadonly || openSec === 'questions' || openSec === 'insert'){ return; }
  toggleSec('questions', true);
  setTimeout(() => { const pp = $('propsPanel'); if(pp && pp.firstElementChild) pp.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 300);
}

/* ---------- Section 1: header fields ---------- */
document.querySelectorAll('[data-hfield]').forEach(inp => inp.addEventListener('input', () => {
  exam.header[inp.dataset.hfield] = inp.value;
  withExamLang(exam, renderHeader);
  updateHero(); scheduleSave(); refreshPanelSummaries();
}));
function fillHeaderFields(){
  document.querySelectorAll('[data-hfield]').forEach(inp => { if(document.activeElement !== inp) inp.value = exam.header[inp.dataset.hfield] || ''; inp.disabled = isReadonly; });
  const subs = $('panelSubs'), lv = $('panelLevels');
  if(subs && !subs.children.length && typeof SUBJECTS !== 'undefined') subs.innerHTML = SUBJECTS.map(x => `<option value="${escAttr(x)}">`).join('');
  if(lv && !lv.children.length && typeof LEVEL_GROUPS !== 'undefined') lv.innerHTML = LEVEL_GROUPS.flatMap(g => g.items).map(x => `<option value="${escAttr(x)}">`).join('');
}

/* ---------- Section 4: question list + question editor ---------- */
const Q_COLORS = { normal: 'var(--normal)', mcq: 'var(--mcq)', tf: 'var(--tf)', blank: 'var(--blank)', table: 'var(--table)' };
function qLabelOf(q){ return withExamLang(exam, () => q.title || questionLabel(numberIndex(q))); }
function renderQuestionList(){
  const box = $('qList'); if(!box) return;
  if(!exam.questions.length){ box.innerHTML = `<div class="q-empty">${L('لا توجد أسئلة بعد. أضف سؤالًا من القسم 2.','No questions yet. Add one from section 2.','Aucune question. Ajoutez-en depuis la section 2.')}</div>`; return; }
  box.innerHTML = exam.questions.map((q, i) => {
    const txt = richToPlain(q.html).replace(/\s+/g, ' ').trim();
    return `<button class="q-item ${q.id === selectedId ? 'on' : ''}" data-qid="${q.id}" style="--qc:${Q_COLORS[q.type] || 'var(--normal)'}">
      <span class="q-ic">${typeMeta[q.type].icon}</span>
      <span class="q-txt"><b>${escapeHtml(qLabelOf(q))}</b><small>${escapeHtml(txt.slice(0, 60) || L('(بدون نص)','(no text)','(sans texte)'))}</small></span>
      <span class="q-pts">${q.points}</span></button>`;
  }).join('');
  box.querySelectorAll('.q-item').forEach(b => b.onclick = () => {
    selectQuestion(b.dataset.qid);
    const el = document.querySelector(`#questionsWrap .question[data-id="${b.dataset.qid}"]`);
    if(el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}
function renderProps(){
  const panel = $('propsPanel'); if(!panel) return;
  const q = findQ(selectedId);
  document.querySelectorAll('#qList .q-item').forEach(b => b.classList.toggle('on', b.dataset.qid === selectedId));
  if(!q || isReadonly){ panel.innerHTML = exam.questions.length ? `<div class="props-empty">${L('اختر سؤالًا من القائمة أو اضغط عليه في الورقة لفتح محرّره هنا.','Pick a question in the list or click it on the paper to edit it here.','Choisissez une question pour la modifier ici.')}</div>` : ''; return; }
  const idx = exam.questions.indexOf(q);
  panel.innerHTML = `
    <div class="q-editor" style="--qc:${Q_COLORS[q.type] || 'var(--normal)'}">
      <div class="qe-head"><span class="q-ic">${typeMeta[q.type].icon}</span><b>${escapeHtml(qLabelOf(q))}</b>
        <span class="qe-type">${{ normal: t('toolNormal'), mcq: t('toolMcq'), tf: t('toolTf'), blank: t('toolBlank'), table: t('toolTable') }[q.type]}</span></div>
      <div class="field-row">
        <div class="field"><label>${t('propsPoints')}</label><input type="number" min="0" step="0.25" value="${q.points}" id="propPoints"></div>
        <div class="field"><label>${L('عنوان خاص (اختياري)','Custom title (optional)','Titre personnalisé')}</label><input type="text" id="propTitle" value="${escAttr(q.title || '')}" placeholder="${escAttr(withExamLang(exam, () => questionLabel(numberIndex(q))))}"></div>
      </div>
      <p class="acc-hint">✍️ ${L('اكتب نص السؤال وخياراته مباشرة على الورقة في المعاينة.','Type the question text and options directly on the paper.','Écrivez l’énoncé directement sur la feuille.')}</p>
      <div class="qe-label">➕ ${L('أضف داخل هذا التمرين','Add inside this exercise','Ajouter dans cet exercice')}</div>
      <div class="qe-insert">
        <button class="pi-btn" data-kind="eq"><span style="background:#2563EB">∑</span>${L('معادلة','Equation','Équation')}</button>
        <button class="pi-btn" data-kind="plot"><span style="background:#059669">📈</span>${L('منحنى','Curve','Courbe')}</button>
        <button class="pi-btn" data-kind="draw"><span style="background:#D97706">📐</span>${L('رسم','Drawing','Dessin')}</button>
        <button class="pi-btn" data-kind="table"><span style="background:#7C3AED">▦</span>${L('جدول','Table','Tableau')}</button>
      </div>
      <div class="qe-actions">
        <button class="mini-btn" data-qa="up" ${idx === 0 ? 'disabled' : ''}>↑ ${t('moveUp')}</button>
        <button class="mini-btn" data-qa="down" ${idx === exam.questions.length - 1 ? 'disabled' : ''}>↓ ${t('moveDown')}</button>
        <button class="mini-btn" data-qa="frame">▢ ${q.frameOff ? t('frameShow') : t('frameHide')}</button>
        <button class="mini-btn danger-btn" data-qa="del">🗑️ ${t('delQuestion')}</button>
      </div>
    </div>`;
  $('propPoints').addEventListener('input', e => {
    q.points = parseFloat(e.target.value) || 0; renderTotals(); scheduleSave();
    const pe = document.querySelector(`#questionsWrap .question[data-id="${q.id}"] .q-points`); if(pe) pe.textContent = `${t('propsPoints')}: ${q.points}`;
    const li = document.querySelector(`#qList .q-item[data-qid="${q.id}"] .q-pts`); if(li) li.textContent = q.points;
  });
  $('propTitle').addEventListener('change', e => { q.title = e.target.value.trim(); render(); scheduleSave(); });
  panel.querySelectorAll('.pi-btn').forEach(b => {
    b.addEventListener('mousedown', e => e.preventDefault());
    b.addEventListener('click', () => {
      if(!activeEditable || activeEditable.type !== 'rich' || !activeEditable.el.closest(`.question[data-id="${q.id}"]`)){
        const el = document.querySelector(`#questionsWrap .question[data-id="${q.id}"] .rich[data-rich="text"]`);
        if(el){ const r = document.createRange(); r.selectNodeContents(el); r.collapse(false); activeEditable = { type: 'rich', el, range: r }; }
      }
      openObjTool(b.dataset.kind);
    });
  });
  panel.querySelectorAll('[data-qa]').forEach(b => b.onclick = () => {
    const a = b.dataset.qa;
    if(a === 'up') moveQuestion(q.id, -1);
    if(a === 'down') moveQuestion(q.id, 1);
    if(a === 'frame'){ q.frameOff = !q.frameOff; render(); scheduleSave(); }
    if(a === 'del') removeQuestion(q.id);
  });
}

/* ---------- Section 5: scoring ---------- */
function refreshPointsList(){
  const box = $('ptsList'); if(!box) return;
  const total = exam.questions.reduce((s, q) => s + (q.points || 0), 0);
  if(!exam.questions.length){ box.innerHTML = ''; return; }
  box.innerHTML = exam.questions.map(q => `<label class="pts-row" style="--qc:${Q_COLORS[q.type] || 'var(--normal)'}"><span class="q-ic">${typeMeta[q.type].icon}</span><span class="pts-name">${escapeHtml(qLabelOf(q))}</span>
      <input type="number" min="0" step="0.25" value="${q.points}" data-pq="${q.id}" ${isReadonly ? 'disabled' : ''}></label>`).join('') +
    `<div class="pts-total ${total > exam.maxPoints ? 'over' : total === exam.maxPoints ? 'ok' : ''}">${t('totalLabel')} <b>${total}</b> / ${exam.maxPoints}
      ${total > exam.maxPoints ? ' — ' + L('المجموع أكبر من العلامة الكاملة','Total exceeds the full mark','Total supérieur au maximum') : total < exam.maxPoints ? ' — ' + L('ينقص','missing','manque') + ' ' + (exam.maxPoints - total) : ' ✓'}</div>`;
  box.querySelectorAll('[data-pq]').forEach(inp => inp.addEventListener('change', () => {
    const q = findQ(inp.dataset.pq); q.points = parseFloat(inp.value) || 0;
    render(); scheduleSave();
  }));
}

/* ---------- Section 6: formatting ---------- */
function renderFormatBox(){
  const box = $('formatBox'); if(!box) return;
  const sample = Object.assign({}, exam, { questions: sampleExamForThumb().questions, objects: {} });
  box.innerHTML = `
    <div class="fmt-label">${L('الترويسة','Header','En-tête')}</div>
    <div class="fmt-grid">${HEADER_TPLS.map(tp => tplThumbCard(Object.assign({}, sample, { tpl: Object.assign({}, exam.tpl, { header: tp.id }) }), tp.name(), exam.tpl.header === tp.id, `data-fh="${tp.id}"`, true)).join('')}</div>
    <div class="fmt-label">${L('التصميم','Design','Style')}</div>
    <div class="fmt-grid">${STYLE_TPLS.map(st => tplThumbCard(Object.assign({}, sample, { tpl: Object.assign({}, exam.tpl, { style: st.id }) }), st.name(), exam.tpl.style === st.id, `data-fs="${st.id}"`, false)).join('')}</div>
    <div class="fmt-label">${L('لغة ورقة الامتحان','Exam paper language','Langue de la copie')}</div>
    <div class="seg-ui">${['ar','fr','en'].map(l => `<button type="button" data-fl="${l}" class="${exam.lang === l ? 'on' : ''}">${{ ar: 'العربية', fr: 'Français', en: 'English' }[l]}</button>`).join('')}</div>
    <div class="fmt-label">${L('حجم الخط','Font size','Taille du texte')}</div>
    <div class="seg-ui">${['sm','md','lg'].map(f => `<button type="button" data-ff="${f}" class="${exam.tpl.fontSize === f ? 'on' : ''}">${{ sm: L('صغير','Small','Petit'), md: L('متوسط','Medium','Moyen'), lg: L('كبير','Large','Grand') }[f]}</button>`).join('')}</div>
    <button type="button" class="acc-next" data-next="format"><span>${L('تم','Done','Terminé')}</span></button>`;
  hydrateThumbs(box);
  box.querySelectorAll('[data-fh]').forEach(c => c.onclick = () => { exam.tpl.header = c.dataset.fh; render(); scheduleSave(); });
  box.querySelectorAll('[data-fs]').forEach(c => c.onclick = () => { exam.tpl.style = c.dataset.fs; render(); scheduleSave(); });
  box.querySelectorAll('[data-fl]').forEach(c => c.onclick = () => { exam.lang = c.dataset.fl; render(); scheduleSave(); });
  box.querySelectorAll('[data-ff]').forEach(c => c.onclick = () => { exam.tpl.fontSize = c.dataset.ff; render(); scheduleSave(); });
}

/* ---------- Summaries under each section title ---------- */
function refreshPanelSummaries(){
  const set = (k, v) => { const el = document.querySelector(`[data-sum="${k}"]`); if(el) el.textContent = v; };
  const h = exam.header, n = exam.questions.length;
  const total = exam.questions.reduce((s, q) => s + (q.points || 0), 0);
  const cut = x => x.length > 50 ? x.slice(0, 48) + '…' : x;
  set('header', cut([h.title, h.subject, h.grade].filter(Boolean).join(' · ') || L('المؤسسة، السنة، المادة، المستوى، المدة، العنوان','School, year, subject, level, duration, title','Établissement, année, matière…')));
  set('add', L('سؤال عادي، اختيار من متعدد، صح/خطأ، أكمل الفراغ، صورة، رموز','Regular, multiple choice, true/false, blanks, image, symbols','Simple, QCM, vrai/faux, trous, image, symboles'));
  set('insert', L('معادلة، منحنى، رسم، جدول','Equation, curve, drawing, table','Équation, courbe, dessin, tableau'));
  const sel = findQ(selectedId);
  set('questions', n ? (sel ? `✎ ${qLabelOf(sel)} · ` : '') + n + ' ' + L('تمارين','exercises','exercices') : L('لا توجد أسئلة بعد','No questions yet','Aucune question'));
  set('points', `${total} / ${exam.maxPoints}`);
  const ht = HEADER_TPLS.find(x => x.id === exam.tpl.header), stl = STYLE_TPLS.find(x => x.id === exam.tpl.style);
  set('format', [ht && ht.name(), stl && stl.name(), { ar: 'العربية', fr: 'Français', en: 'English' }[exam.lang]].filter(Boolean).join(' · '));
}
function refreshPanel(){
  if($('editorView').classList.contains('hidden')) return;
  fillHeaderFields();
  renderQuestionList();
  renderProps();
  refreshPointsList();
  if(openSec === 'format') renderFormatBox();
  refreshPanelSummaries();
}
function onEditorShown(){
  openSec = null;
  document.querySelectorAll('#accordion .acc').forEach(a => a.classList.remove('open'));
  $('editorView').classList.toggle('collapsed', isReadonly);
  setTimeout(applyZoom, 0);
}

/* ---------- Panel toggle (on the panel edge) ---------- */
$('panelToggle').addEventListener('click', () => {
  $('editorView').classList.toggle('collapsed');
});

/* ---------- Stage zoom ---------- */
let zoomState = 'fit';
const PAGE_W = 794;
function fitScale(){
  const st = $('stage'); if(!st) return 1;
  return Math.max(0.3, Math.min(1.25, (st.clientWidth - 60) / PAGE_W));
}
function pageZoom(){ return zoomState === 'fit' ? fitScale() : zoomState; }
function applyZoom(){
  const s = pageZoom();
  $('pageHolder').style.zoom = s;
  $('zoomVal').textContent = Math.round(s * 100) + '%';
  if(typeof selectedObj !== 'undefined' && selectedObj && document.body.contains(selectedObj)) showObjToolbar(selectedObj);
}
function stepZoom(dir){
  let s = pageZoom();
  s = Math.round((s + dir * 0.1) * 10) / 10;
  zoomState = Math.max(0.3, Math.min(2, s));
  applyZoom();
}
$('zoomIn').addEventListener('click', () => stepZoom(1));
$('zoomOut').addEventListener('click', () => stepZoom(-1));
$('zoomFit').addEventListener('click', () => { zoomState = 'fit'; applyZoom(); });
if(window.ResizeObserver) new ResizeObserver(() => { if(zoomState === 'fit' && !matchMedia('print').matches) applyZoom(); }).observe($('stage'));
else window.addEventListener('resize', () => { if(zoomState === 'fit') applyZoom(); });
window.addEventListener('beforeprint', () => { $('pageHolder').style.zoom = 1; });
window.addEventListener('afterprint', () => applyZoom());

/* ---------- Full screen ---------- */
$('btnFullscreen').addEventListener('click', () => {
  if(document.fullscreenElement) document.exitFullscreen && document.exitFullscreen();
  else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen().catch(() => {});
});
