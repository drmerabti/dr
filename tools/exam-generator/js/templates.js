/* ================= Templates page: complete exams, headers, designs ================= */

let tplTab = 'exams', tplSubject = '', tplCycle = '';
const _tplCache = {};
async function getMaterialized(tp){
  const key = tp.id + '|' + lang + '|' + JSON.stringify(getSettings());
  if(!_tplCache[key]) _tplCache[key] = await materializeTemplate(tp);
  return _tplCache[key];
}

function renderTemplatesView(){
  const v = $('templatesView');
  v.innerHTML = backHomeBar() + `
    <div class="tpl-tabs">
      <button data-tt="exams" class="${tplTab === 'exams' ? 'on' : ''}">📄 ${L('امتحانات كاملة جاهزة','Complete ready exams','Examens complets')}</button>
      <button data-tt="headers" class="${tplTab === 'headers' ? 'on' : ''}">🧾 ${L('الترويسات','Headers','En-têtes')}</button>
      <button data-tt="styles" class="${tplTab === 'styles' ? 'on' : ''}">🎨 ${L('التصاميم','Designs','Styles')}</button>
    </div>
    <div id="tplBody"></div>`;
  v.querySelectorAll('[data-tt]').forEach(b => b.onclick = () => { tplTab = b.dataset.tt; renderTemplatesView(); });
  const body = v.querySelector('#tplBody');
  if(tplTab === 'exams') return renderExamTemplates(body);
  const s = getSettings();
  const sample = Object.assign(freshExam(), { questions: sampleExamForThumb().questions });
  if(tplTab === 'headers'){
    body.innerHTML = `<p class="hub-note">${L('اضغط على ترويسة لجعلها الترويسة الافتراضية لامتحاناتك الجديدة. يمكنك أيضًا تغيير ترويسة أي امتحان من زر «🎨 الشكل والقالب» داخل المحرر.','Click a header to make it the default for new exams. You can also change it per exam with “🎨 Look & template”.','Cliquez pour définir l’en-tête par défaut.')}</p>
      <div class="tpl-grid big">${HEADER_TPLS.map(tp => tplThumbCard(Object.assign({}, sample, { tpl: Object.assign({}, sample.tpl, { header: tp.id }) }), tp.name(), (s.headerTpl || 'classic') === tp.id, `data-ht="${tp.id}"`, false)).join('')}</div>`;
    body.querySelectorAll('[data-ht]').forEach(c => c.onclick = () => { s.headerTpl = c.dataset.ht; saveSettings(); renderTemplatesView(); offerNewExam(); });
  } else {
    body.innerHTML = `<p class="hub-note">${L('اختر التصميم الافتراضي لامتحاناتك الجديدة (شكل عناوين التمارين والإطارات والألوان).','Choose the default design for new exams.','Choisissez le style par défaut.')}</p>
      <div class="tpl-grid big">${STYLE_TPLS.map(st => tplThumbCard(Object.assign({}, sample, { tpl: Object.assign({}, sample.tpl, { style: st.id }) }), st.name(), (s.styleTpl || 'classic') === st.id, `data-stl="${st.id}"`, false)).join('')}</div>`;
    body.querySelectorAll('[data-stl]').forEach(c => c.onclick = () => { s.styleTpl = c.dataset.stl; saveSettings(); renderTemplatesView(); offerNewExam(); });
  }
}
function offerNewExam(){ toast(L('تم الحفظ ✓ — سيُستعمل في امتحاناتك الجديدة','Saved ✓ — used for your new exams','Enregistré ✓'), 'ok'); }

async function renderExamTemplates(body){
  const subjects = [...new Set(EXAM_TEMPLATES.map(t => t.subject))];
  const list = EXAM_TEMPLATES.filter(t => (!tplSubject || t.subject === tplSubject) && (!tplCycle || t.cycle === tplCycle));
  body.innerHTML = `
    <p class="hub-note">${L('ابدأ من امتحان كامل جاهز ثم عدّل ما تريد فقط. معلومات مؤسستك واسمك تُملأ تلقائيًا من الإعدادات.','Start from a complete exam and only change what you need. Your school info is filled in from Settings.','Partez d’un examen complet et modifiez seulement ce qu’il faut.')}</p>
    <div class="lib-chips">
      <button data-cy="" class="${!tplCycle ? 'on' : ''}">🎓 ${L('كل الأطوار','All levels','Tous niveaux')}</button>
      <button data-cy="p" class="${tplCycle === 'p' ? 'on' : ''}">${L('ابتدائي','Primary','Primaire')}</button>
      <button data-cy="m" class="${tplCycle === 'm' ? 'on' : ''}">${L('متوسط','Middle','Collège')}</button>
      <button data-cy="s" class="${tplCycle === 's' ? 'on' : ''}">${L('ثانوي','Secondary','Lycée')}</button>
    </div>
    <div class="lib-chips">
      <button data-sj="" class="${!tplSubject ? 'on' : ''}">📚 ${L('كل المواد','All subjects','Toutes matières')}</button>
      ${subjects.map(s => `<button data-sj="${escAttr(s)}" class="${tplSubject === s ? 'on' : ''}" style="${tplSubject === s ? '' : `color:${subjectColor(s)}`}">${escapeHtml(s)}</button>`).join('')}
    </div>
    <div class="etpl-grid">${list.map(t => `
      <div class="etpl-card" data-id="${t.id}">
        <div class="ec-thumb etpl-thumb" data-preview><div class="thumb-inner"><div class="thumb-loading">⏳</div></div>
          <span class="ec-subject" style="background:${subjectColor(t.subject)}">${escapeHtml(t.subject)}</span></div>
        <div class="ec-info">
          <div class="ec-title">${escapeHtml(t.title)}</div>
          <div class="ec-meta"><span class="chip">🎓 ${escapeHtml(t.level)}</span><span class="chip">⏱ ${escapeHtml(t.duration)}</span></div>
        </div>
        <div class="ec-actions">
          <button class="ec-btn ec-open" data-use>✨ ${L('ابدأ من هذا القالب','Start from this template','Utiliser ce modèle')}</button>
          <button class="ec-btn" data-preview title="${L('معاينة','Preview','Aperçu')}">👁️</button>
        </div>
      </div>`).join('')}</div>`;
  body.querySelectorAll('[data-cy]').forEach(b => b.onclick = () => { tplCycle = b.dataset.cy; renderExamTemplates(body); });
  body.querySelectorAll('[data-sj]').forEach(b => b.onclick = () => { tplSubject = b.dataset.sj; renderExamTemplates(body); });
  for(const card of body.querySelectorAll('.etpl-card')){
    const tp = EXAM_TEMPLATES.find(x => x.id === card.dataset.id);
    card.querySelector('[data-use]').onclick = () => useTemplate(tp);
    card.querySelectorAll('[data-preview]').forEach(el => el.onclick = () => previewTemplate(tp));
  }
  for(const card of body.querySelectorAll('.etpl-card')){
    const tp = EXAM_TEMPLATES.find(x => x.id === card.dataset.id);
    try{
      const ex = await getMaterialized(tp);
      if(!document.body.contains(card)) return;
      const ti = card.querySelector('.thumb-inner');
      ti.innerHTML = staticPageHTML(ex, { maxQuestions: 3 });
      hydrateObjects(ti, ex.objects);
    }catch(e){ console.warn(e); }
  }
}
async function useTemplate(tp){
  const ex = JSON.parse(JSON.stringify(await getMaterialized(tp)));
  const fresh = freshExam();
  ex.id = fresh.id; ex.createdAt = ex.updatedAt = Date.now(); ex.savedToCloud = false;
  exam = normalizeExam(ex); selectedId = null; isReadonly = false;
  await persistExam();
  showEditor(); render();
  toast(L('تم إنشاء الامتحان من القالب ✓ — عدّل ما تريد','Exam created from the template ✓','Examen créé ✓'), 'ok');
}
async function previewTemplate(tp){
  const m = openModal({ icon: '👁️', color: subjectColor(tp.subject), title: tp.title + ' — ' + tp.level,
    footer: `<button class="big-btn ghost" data-close>${L('إغلاق','Close','Fermer')}</button><button class="big-btn primary" data-use>✨ ${L('ابدأ من هذا القالب','Start from this template','Utiliser')}</button>` });
  const stop = showLoading(m.body);
  const ex = await getMaterialized(tp);
  stop();
  m.body.innerHTML = `<div class="tpl-preview-page">${staticPageHTML(ex)}</div>`;
  hydrateObjects(m.body, ex.objects);
  m.foot.querySelector('[data-use]').onclick = () => { m.close(); useTemplate(tp); };
}
