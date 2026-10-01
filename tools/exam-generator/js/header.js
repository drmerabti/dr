/* ================= Exam header templates + page design styles ================= */

/* Editable header field (single line, auto width). In read-only/static mode it is plain text. */
function hf(h, field, ph, cls, editable){
  const v = escapeHtml(h[field] || '');
  if(!editable) return `<span class="hf ${cls || ''} ${v ? '' : 'hf-empty'}">${v || '&nbsp;'.repeat(12)}</span>`;
  return `<span class="hf ${cls || ''}" contenteditable="true" data-h="${field}" data-ph="${escAttr(ph)}">${v}</span>`;
}
function hLogo(h, editable){
  if(h.logo) return `<img class="h-logo" src="${h.logo}" ${editable ? `data-logo title="${escAttr(L('تغيير الشعار','Change logo','Changer le logo'))}"` : ''}>`;
  return editable ? `<span class="h-logo-ph" data-logo>🏫<small>${L('الشعار','Logo','Logo')}</small></span>` : '';
}
const HL = {
  rep1: () => t('repLine1'), rep2: () => t('repLine2'),
  inst: () => L('المؤسسة:','School:','Établissement :'), teacher: () => L('الأستاذ(ة):','Teacher:','Enseignant(e) :'),
  subject: () => t('subjectLabel'), grade: () => t('gradeLabel'), duration: () => t('durationLabel'),
  year: () => L('السنة الدراسية:','School year:','Année scolaire :'), dir: () => L('مديرية التربية لولاية','Directorate of Education —','Direction de l’Éducation —'),
  student: () => L('الاسم واللقب:','Name:','Nom et prénom :'), cls: () => L('القسم:','Class:','Classe :'), mark: () => L('العلامة:','Mark:','Note :'),
};
const PH = {
  institution: () => L('اسم المؤسسة','School name','Nom de l’établissement'),
  teacher: () => L('اسم الأستاذ','Teacher name','Nom de l’enseignant'),
  title: () => L('عنوان الامتحان','Exam title','Titre de l’examen'),
  subject: () => '...', grade: () => '...', duration: () => '...', year: () => '..../....', directorate: () => '........'
};

const HEADER_TPLS = [
  { id:'classic', name:()=>L('كلاسيكي','Classic','Classique'), render:(h,e)=>`
    <div class="hd hd-classic">
      <div class="top-line">${HL.rep1()}</div>
      <div class="top-line">${HL.rep2()}</div>
      <div class="school-fields">
        <span>${hf(h,'institution',PH.institution(),'',e)}</span>
        <span>${HL.year()} ${hf(h,'year',PH.year(),'',e)}</span>
      </div>
      <div class="title-line">${hf(h,'title',PH.title(),'hf-title',e)}</div>
      <div class="meta-row">
        <span><b>${HL.subject()}</b> ${hf(h,'subject',PH.subject(),'',e)}</span>
        <span><b>${HL.grade()}</b> ${hf(h,'grade',PH.grade(),'',e)}</span>
        <span><b>${HL.duration()}</b> ${hf(h,'duration',PH.duration(),'',e)}</span>
      </div>
    </div>` },
  { id:'official', name:()=>L('رسمي (يمين ويسار)','Official','Officiel'), render:(h,e)=>`
    <div class="hd hd-official">
      <div class="top-line strong">${HL.rep1()}</div>
      <div class="hd-cols">
        <div class="hd-col">
          <div>${t('repLine2')}</div>
          <div>${HL.dir()} ${hf(h,'directorate',PH.directorate(),'',e)}</div>
          <div>${hf(h,'institution',PH.institution(),'',e)}</div>
          <div><b>${HL.grade()}</b> ${hf(h,'grade',PH.grade(),'',e)}</div>
        </div>
        <div class="hd-col hd-col-end">
          <div><b>${HL.year()}</b> ${hf(h,'year',PH.year(),'',e)}</div>
          <div><b>${HL.subject()}</b> ${hf(h,'subject',PH.subject(),'',e)}</div>
          <div><b>${HL.duration()}</b> ${hf(h,'duration',PH.duration(),'',e)}</div>
        </div>
      </div>
      <div class="title-box">${hf(h,'title',PH.title(),'hf-title',e)}</div>
    </div>` },
  { id:'table', name:()=>L('جدول','Table','Tableau'), render:(h,e)=>`
    <div class="hd hd-table">
      <div class="top-line">${HL.rep1()} — ${HL.rep2()}</div>
      <table class="hd-tab">
        <tr><td>${hf(h,'institution',PH.institution(),'',e)}</td><td rowspan="2" class="hd-tab-title">${hf(h,'title',PH.title(),'hf-title',e)}</td><td><b>${HL.year()}</b> ${hf(h,'year',PH.year(),'',e)}</td></tr>
        <tr><td><b>${HL.grade()}</b> ${hf(h,'grade',PH.grade(),'',e)}</td><td><b>${HL.duration()}</b> ${hf(h,'duration',PH.duration(),'',e)}</td></tr>
        <tr><td colspan="3"><b>${HL.subject()}</b> ${hf(h,'subject',PH.subject(),'',e)} &nbsp;&nbsp; <b>${HL.teacher()}</b> ${hf(h,'teacher',PH.teacher(),'',e)}</td></tr>
      </table>
    </div>` },
  { id:'band', name:()=>L('شريط ملوّن','Colour band','Bandeau'), render:(h,e)=>`
    <div class="hd hd-band">
      <div class="band-top"><span>${hf(h,'institution',PH.institution(),'',e)}</span><span>${hf(h,'year',PH.year(),'',e)}</span></div>
      <div class="band">${hf(h,'title',PH.title(),'hf-title',e)}</div>
      <div class="meta-row">
        <span><b>${HL.subject()}</b> ${hf(h,'subject',PH.subject(),'',e)}</span>
        <span><b>${HL.grade()}</b> ${hf(h,'grade',PH.grade(),'',e)}</span>
        <span><b>${HL.duration()}</b> ${hf(h,'duration',PH.duration(),'',e)}</span>
        <span><b>${HL.teacher()}</b> ${hf(h,'teacher',PH.teacher(),'',e)}</span>
      </div>
    </div>` },
  { id:'student', name:()=>L('مع خانة التلميذ','With student box','Avec cadre élève'), render:(h,e)=>`
    <div class="hd hd-student">
      <div class="top-line">${HL.rep1()}</div>
      <div class="school-fields">
        <span>${hf(h,'institution',PH.institution(),'',e)}</span>
        <span><b>${HL.year()}</b> ${hf(h,'year',PH.year(),'',e)}</span>
      </div>
      <div class="title-line">${hf(h,'title',PH.title(),'hf-title',e)}</div>
      <div class="meta-row">
        <span><b>${HL.subject()}</b> ${hf(h,'subject',PH.subject(),'',e)}</span>
        <span><b>${HL.grade()}</b> ${hf(h,'grade',PH.grade(),'',e)}</span>
        <span><b>${HL.duration()}</b> ${hf(h,'duration',PH.duration(),'',e)}</span>
      </div>
      <div class="student-box">
        <span>${HL.student()} <i class="dots"></i></span>
        <span>${HL.cls()} <i class="dots short"></i></span>
        <span class="mark-box">${HL.mark()} <i></i> / ${escapeHtml(String(exam && exam.maxPoints || 20))}</span>
      </div>
    </div>` },
  { id:'logo', name:()=>L('مع الشعار','With logo','Avec logo'), render:(h,e)=>`
    <div class="hd hd-logo">
      <div class="logo-row">
        <div class="logo-side">${hLogo(h,e)}</div>
        <div class="logo-mid">
          <div class="top-line">${HL.rep1()}</div>
          <div class="top-line">${HL.rep2()}</div>
          <div>${hf(h,'institution',PH.institution(),'strong',e)}</div>
        </div>
        <div class="logo-side logo-info">
          <div><b>${HL.year()}</b> ${hf(h,'year',PH.year(),'',e)}</div>
          <div><b>${HL.duration()}</b> ${hf(h,'duration',PH.duration(),'',e)}</div>
        </div>
      </div>
      <div class="title-line">${hf(h,'title',PH.title(),'hf-title',e)}</div>
      <div class="meta-row">
        <span><b>${HL.subject()}</b> ${hf(h,'subject',PH.subject(),'',e)}</span>
        <span><b>${HL.grade()}</b> ${hf(h,'grade',PH.grade(),'',e)}</span>
        <span><b>${HL.teacher()}</b> ${hf(h,'teacher',PH.teacher(),'',e)}</span>
      </div>
    </div>` },
  { id:'minimal', name:()=>L('بسيط (سطر واحد)','Minimal','Minimal'), render:(h,e)=>`
    <div class="hd hd-minimal">
      <div class="min-row">
        <span>${hf(h,'institution',PH.institution(),'',e)}</span>
        <span>${hf(h,'subject',PH.subject(),'',e)}</span>
        <span>${hf(h,'grade',PH.grade(),'',e)}</span>
        <span>${HL.duration()} ${hf(h,'duration',PH.duration(),'',e)}</span>
      </div>
      <div class="title-line">${hf(h,'title',PH.title(),'hf-title',e)}</div>
    </div>` },
];

const STYLE_TPLS = [
  { id:'classic', name:()=>L('كلاسيكي','Classic','Classique'), accent:'#1F2937' },
  { id:'boxed', name:()=>L('عناوين في إطار','Boxed titles','Titres encadrés'), accent:'#1F2937' },
  { id:'modern', name:()=>L('عصري ملوّن','Modern colour','Moderne'), accent:'#1F6F63' },
  { id:'blue', name:()=>L('أزرق رسمي','Official blue','Bleu officiel'), accent:'#1D4ED8' },
  { id:'underline', name:()=>L('عناوين مسطّرة','Underlined','Soulignés'), accent:'#111827' },
  { id:'elegant', name:()=>L('أنيق بإطار الصفحة','Elegant + page border','Élégant'), accent:'#7C2D12' },
  { id:'compact', name:()=>L('مضغوط بدون إطارات','Compact, no frames','Compact'), accent:'#111827' },
];

function headerTpl(id){ return HEADER_TPLS.find(x => x.id === id) || HEADER_TPLS[0]; }
function headerHTML(ex, editable){
  return headerTpl(ex.tpl && ex.tpl.header).render(ex.header, editable);
}
function pageClasses(ex){
  const tp = ex.tpl || {};
  return `a4-page st-${tp.style || 'classic'} fs-${tp.fontSize || 'md'}`;
}

function renderHeader(){
  const page = $('examPage');
  page.className = pageClasses(exam);
  const box = $('examHeader');
  box.innerHTML = headerHTML(exam, !isReadonly);
  if(isReadonly) return;
  box.querySelectorAll('.hf[data-h]').forEach(el => {
    el.addEventListener('input', () => {
      exam.header[el.dataset.h] = el.textContent.replace(/\s+/g, ' ').trim();
      if(el.dataset.h === 'title' || el.dataset.h === 'subject' || el.dataset.h === 'grade') updateHero();
      scheduleSave();
    });
    el.addEventListener('keydown', e => { if(e.key === 'Enter'){ e.preventDefault(); el.blur(); } });
    el.addEventListener('paste', e => { e.preventDefault(); document.execCommand('insertText', false, (e.clipboardData.getData('text/plain') || '').replace(/\s+/g,' ')); });
  });
  box.querySelectorAll('[data-logo]').forEach(el => el.addEventListener('click', () => pickLogo(src => { exam.header.logo = src; renderHeader(); scheduleSave(); })));
}

/* Pick an image file and shrink it for use as a logo (max 360px) */
function pickLogo(cb){
  const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*';
  inp.onchange = () => {
    const f = inp.files[0]; if(!f) return;
    const r = new FileReader();
    r.onload = ev => shrinkImage(ev.target.result, 360).then(cb);
    r.readAsDataURL(f);
  };
  inp.click();
}
function shrinkImage(src, max){
  return new Promise(res => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL('image/png'));
    };
    img.onerror = () => res(src);
    img.src = src;
  });
}

/* Header + design picker shown from the editor ("🎨 الشكل") */
function openDesignPicker(){
  const m = openModal({ size:'full', icon:'🎨', color:'#E08E3E', title:L('شكل الامتحان: الترويسة والتصميم','Exam look: header & design','Apparence : en-tête et style'),
    body:`<div class="design-picker">
      <h3 class="dp-h">1. ${L('اختر الترويسة','Choose the header','Choisissez l’en-tête')}</h3>
      <div class="tpl-grid" id="dpHeaders"></div>
      <h3 class="dp-h">2. ${L('اختر التصميم','Choose the design','Choisissez le style')}</h3>
      <div class="tpl-grid" id="dpStyles"></div>
      <h3 class="dp-h">3. ${L('حجم الخط','Font size','Taille du texte')}</h3>
      <div class="seg-big" id="dpFont">
        <button data-f="sm">${L('صغير','Small','Petit')}</button><button data-f="md">${L('متوسط','Medium','Moyen')}</button><button data-f="lg">${L('كبير','Large','Grand')}</button>
      </div></div>`,
    footer:`<button class="big-btn primary" data-close>✔ ${L('تم','Done','Terminé')}</button>` });
  const fill = () => {
    m.body.querySelector('#dpHeaders').innerHTML = HEADER_TPLS.map(tp => tplThumbCard({ ...exam, tpl:{ ...exam.tpl, header: tp.id } }, tp.name(), exam.tpl.header === tp.id, `data-h="${tp.id}"`, true)).join('');
    m.body.querySelector('#dpStyles').innerHTML = STYLE_TPLS.map(st => tplThumbCard({ ...sampleExamForThumb(), header: exam.header, tpl:{ ...exam.tpl, style: st.id } }, st.name(), exam.tpl.style === st.id, `data-s="${st.id}"`, false)).join('');
    m.body.querySelectorAll('#dpFont button').forEach(b => b.classList.toggle('on', b.dataset.f === exam.tpl.fontSize));
    hydrateThumbs(m.body);
    m.body.querySelectorAll('[data-h]').forEach(c => c.onclick = () => { exam.tpl.header = c.dataset.h; render(); scheduleSave(); fill(); });
    m.body.querySelectorAll('[data-s]').forEach(c => c.onclick = () => { exam.tpl.style = c.dataset.s; render(); scheduleSave(); fill(); });
    m.body.querySelectorAll('#dpFont button').forEach(b => b.onclick = () => { exam.tpl.fontSize = b.dataset.f; render(); scheduleSave(); fill(); });
  };
  fill();
}

/* ---------- Static page rendering (thumbnails, previews) ---------- */
function staticPageHTML(ex, opts){
  opts = opts || {};
  const saved = { exam, isReadonly, selectedId };
  exam = ex; isReadonly = true; selectedId = null;
  let html;
  try{
    const qs = (opts.maxQuestions ? ex.questions.slice(0, opts.maxQuestions) : ex.questions);
    html = `<div class="${pageClasses(ex)} static-page">
      <div class="exam-header">${headerHTML(ex, false)}</div>
      <div class="questions-static">${qs.map((q,i) => questionHTML(q,i)).join('')}</div>
    </div>`;
  } finally { exam = saved.exam; isReadonly = saved.isReadonly; selectedId = saved.selectedId; }
  return html;
}
/* A small thumbnail card holding a scaled-down live page */
function tplThumbCard(ex, label, on, attrs, headerOnly){
  return `<div class="tpl-card ${on ? 'on' : ''}" ${attrs || ''}>
    <div class="thumb ${headerOnly ? 'thumb-header' : ''}"><div class="thumb-inner" data-thumb='${escAttr(JSON.stringify({ id: ex.id || '' }))}'>${staticPageHTML(ex, { maxQuestions: headerOnly ? 0 : 3 })}</div></div>
    <div class="tpl-name">${on ? '✔ ' : ''}${label}</div>
  </div>`;
}
function hydrateThumbs(container, objectsMapFor){
  container.querySelectorAll('.thumb-inner').forEach(ti => {
    const objs = objectsMapFor ? objectsMapFor(ti) : (exam && exam.objects);
    hydrateObjects(ti, objs || {});
  });
}
function sampleExamForThumb(){
  return {
    id: 'sample', header: exam.header, tpl: exam.tpl, objects: {}, maxPoints: 20,
    questions: [
      { id:'s1', type:'normal', points:4, html: L('أجب عن الأسئلة التالية بدقة ووضوح.','Answer the following questions.','Répondez aux questions suivantes.'), images:[] },
      { id:'s2', type:'mcq', points:3, html: L('اختر الإجابة الصحيحة:','Choose the right answer:','Choisissez la bonne réponse :'), options:['أ','ب','ج'], optHtml:true, images:[] },
      { id:'s3', type:'tf', points:3, html: L('صح أم خطأ؟','True or false?','Vrai ou faux ?'), statements:[{id:'x',html:'....',showCorrection:false}], images:[] },
    ]
  };
}
