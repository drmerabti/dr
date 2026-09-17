/* ================= I18N (ar / en / fr) ================= */
const I18N = {
  ar: {
    backHome: 'الرئيسية', title: 'مولّد الامتحانات',
    subtitleList: 'أنشئ ورقة امتحان احترافية دون الحاجة لإتقان Word',
    newExamBtn: '📝 امتحان جديد', emptyNote: 'لا توجد امتحانات محفوظة بعد. أنشئ أول امتحان من الأعلى.',
    backToList: 'امتحاناتي', shareBtn: 'مشاركة', printBtn: 'طباعة / تصدير',
    toolsTitle: 'الأدوات', toolNormal: 'سؤال عادي', toolMcq: 'اختيار من متعدد', toolTf: 'صح / خطأ',
    toolBlank: 'أكمل الفراغ', toolTable: 'جدول', toolImage: 'صورة', toolSymbols: 'رموز', libBtn: '📚 إدراج من مكتبتي',
    symbolsTitle: 'الرموز والأسهم', insertBtn: 'إدراج',
    qCountLabel: 'عدد التمارين:', totalLabel: 'المجموع:',
    repLine1: 'الجمهورية الجزائرية الديمقراطية الشعبية', repLine2: 'وزارة التربية الوطنية',
    institutionPh: 'اسم المؤسسة', teacherPh: 'أستاذ: ..............',
    subjectLabel: 'المادة:', gradeLabel: 'المستوى:', durationLabel: 'المدة:',
    emptyPageHint: 'اختر أداة من القائمة على اليمين لبدء إنشاء الامتحان',
    propsEmpty: 'اختر سؤالاً لعرض خصائصه هنا (النقاط...)', propsPoints: 'النقاط',
    shareTitle: 'رابط المشاركة', shareNote: 'من يفتح هذا الرابط يشاهد الامتحان فقط ولا يستطيع تعديله.',
    closeBtn: 'إغلاق', copyBtn: 'نسخ الرابط', copiedBtn: 'تم النسخ ✓',
    savedLocal: 'تم الحفظ', savingLocal: 'جارٍ الحفظ...', saveFailed: 'تعذر الحفظ محليًا',
    saveCloudBtn: 'حفظ في حسابي', savingCloudBtn: 'جارِ الحفظ...', savedCloudBtn: 'تم الحفظ ✓',
    signInBtn: 'تسجيل الدخول بقوقل',
    newExamTitle: 'إنشاء امتحان جديد', newExamDesc: 'ابدأ من صفحة فارغة أو من قالب جاهز، وأضف الأسئلة بسهولة.', newExamGo: 'ابدأ الآن ←',
    toolsCardTitle: 'أدواتي', toolsCardDesc: 'أداة المعادلات، الرسومات والمنحنيات.',
    libraryCardTitle: 'مكتبتي', libraryCardDesc: 'المعادلات، الرسومات والجداول المحفوظة.',
    settingsCardTitle: 'الإعدادات', settingsCardDesc: 'تخصيص التطبيق حسب حاجتك.',
    templatesCardTitle: 'القوالب', templatesCardDesc: 'قوالب جاهزة لرأس الامتحان والتنسيق.',
    myExamsTitle: 'امتحاناتي',
    trueLabel: 'صح', falseLabel: 'خطأ',
    addOpt: '+ إضافة خيار', delOpt: 'حذف الخيار', addStmt: '+ إضافة عبارة', delStmt: 'حذف العبارة',
    addCorr: 'إضافة تصحيح', hideCorr: 'إخفاء التصحيح', correctionLabel: 'التصحيح:',
    moveUp: 'نقل لأعلى', moveDown: 'نقل لأسفل', delQuestion: 'حذف التمرين',
    frameHide: 'إخفاء الإطار عند الطباعة', frameShow: 'إظهار الإطار عند الطباعة',
    frameOffTag: 'إطار مخفي عند الطباعة',
    addRow: '+ صف', delRow: '− صف', addCol: '+ عمود', delCol: '− عمود', mergeCells: '🔗 دمج الخلايا',
    imagePlaceHint: 'اضغط داخل أي تمرين لتحديد مكان الصورة', delImage: 'حذف الصورة',
    libSoon: 'هذه الميزة ستتوفر في مرحلة لاحقة من التطوير.',
    ordWords: ['الأول','الثاني','الثالث','الرابع','الخامس','السادس','السابع','الثامن','التاسع','العاشر'],
    exerciseWord: 'التمرين', untitledExam: 'امتحان بدون عنوان', defaultTitle: 'اختبار الفصل الأول',
    readonlyNote: 'عرض فقط — بدون تعديل',
  },
  en: {
    backHome: 'Home', title: 'Exam Generator',
    subtitleList: 'Create a professional exam paper without needing Word skills',
    newExamBtn: '📝 New exam', emptyNote: 'No saved exams yet. Create your first one above.',
    newExamTitle: 'Create a new exam', newExamDesc: 'Start from a blank page or a template, and add questions easily.', newExamGo: 'Start now ←',
    toolsCardTitle: 'My tools', toolsCardDesc: 'Equation, drawing and curve tools.',
    libraryCardTitle: 'My library', libraryCardDesc: 'Saved equations, drawings and tables.',
    settingsCardTitle: 'Settings', settingsCardDesc: 'Customize the app to your needs.',
    templatesCardTitle: 'Templates', templatesCardDesc: 'Ready-made header and layout templates.',
    myExamsTitle: 'My exams',
    trueLabel: 'True', falseLabel: 'False',
    backToList: 'My exams', shareBtn: 'Share', printBtn: 'Print / Export',
    toolsTitle: 'Tools', toolNormal: 'Regular question', toolMcq: 'Multiple choice', toolTf: 'True / False',
    toolBlank: 'Fill in the blank', toolTable: 'Table', toolImage: 'Image', toolSymbols: 'Symbols', libBtn: '📚 Insert from library',
    symbolsTitle: 'Symbols & arrows', insertBtn: 'Insert',
    qCountLabel: 'Exercises:', totalLabel: 'Total:',
    repLine1: 'People\u2019s Democratic Republic of Algeria', repLine2: 'Ministry of National Education',
    institutionPh: 'Institution name', teacherPh: 'Teacher: ..............',
    subjectLabel: 'Subject:', gradeLabel: 'Grade:', durationLabel: 'Duration:',
    emptyPageHint: 'Pick a tool from the panel to start building the exam',
    propsEmpty: 'Select a question to see its properties (points...)', propsPoints: 'Points',
    shareTitle: 'Share link', shareNote: 'Anyone with this link can only view the exam, not edit it.',
    closeBtn: 'Close', copyBtn: 'Copy link', copiedBtn: 'Copied ✓',
    savedLocal: 'Saved', savingLocal: 'Saving...', saveFailed: 'Could not save locally',
    saveCloudBtn: 'Save to my account', savingCloudBtn: 'Saving...', savedCloudBtn: 'Saved ✓',
    signInBtn: 'Sign in with Google',
    addOpt: '+ Add option', delOpt: 'Delete option', addStmt: '+ Add statement', delStmt: 'Delete statement',
    addCorr: 'Add correction', hideCorr: 'Hide correction', correctionLabel: 'Correction:',
    moveUp: 'Move up', moveDown: 'Move down', delQuestion: 'Delete exercise',
    frameHide: 'Hide frame when printing', frameShow: 'Show frame when printing',
    frameOffTag: 'Frame hidden when printing',
    addRow: '+ Row', delRow: '− Row', addCol: '+ Column', delCol: '− Column', mergeCells: '🔗 Merge cells',
    imagePlaceHint: 'Click inside any exercise to place the image', delImage: 'Delete image',
    libSoon: 'This feature will be available in a later stage.',
    ordWords: ['1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th'],
    exerciseWord: 'Exercise', untitledExam: 'Untitled exam', defaultTitle: 'Term 1 Exam',
    readonlyNote: 'View only — no editing',
  },
  fr: {
    backHome: 'Accueil', title: 'Générateur d\u2019examens',
    subtitleList: 'Créez un sujet d\u2019examen professionnel sans maîtriser Word',
    newExamBtn: '📝 Nouvel examen', emptyNote: 'Aucun examen enregistré. Créez le premier ci-dessus.',
    newExamTitle: 'Créer un nouvel examen', newExamDesc: 'Partez d\u2019une page vierge ou d\u2019un modèle, et ajoutez des questions facilement.', newExamGo: 'Commencer ←',
    toolsCardTitle: 'Mes outils', toolsCardDesc: 'Outils d\u2019équations, de dessins et de courbes.',
    libraryCardTitle: 'Ma bibliothèque', libraryCardDesc: 'Équations, dessins et tableaux enregistrés.',
    settingsCardTitle: 'Paramètres', settingsCardDesc: 'Personnalisez l\u2019application selon vos besoins.',
    templatesCardTitle: 'Modèles', templatesCardDesc: 'Modèles prêts pour l\u2019en-tête et la mise en page.',
    myExamsTitle: 'Mes examens',
    trueLabel: 'Vrai', falseLabel: 'Faux',
    backToList: 'Mes examens', shareBtn: 'Partager', printBtn: 'Imprimer / Exporter',
    toolsTitle: 'Outils', toolNormal: 'Question simple', toolMcq: 'Choix multiple', toolTf: 'Vrai / Faux',
    toolBlank: 'Texte à trous', toolTable: 'Tableau', toolImage: 'Image', toolSymbols: 'Symboles', libBtn: '📚 Insérer depuis la bibliothèque',
    symbolsTitle: 'Symboles et flèches', insertBtn: 'Insérer',
    qCountLabel: 'Exercices :', totalLabel: 'Total :',
    repLine1: 'République Algérienne Démocratique et Populaire', repLine2: 'Ministère de l\u2019Éducation Nationale',
    institutionPh: 'Nom de l\u2019établissement', teacherPh: 'Enseignant : ..............',
    subjectLabel: 'Matière :', gradeLabel: 'Niveau :', durationLabel: 'Durée :',
    emptyPageHint: 'Choisissez un outil dans le panneau pour commencer',
    propsEmpty: 'Sélectionnez une question pour voir ses propriétés (points...)', propsPoints: 'Points',
    shareTitle: 'Lien de partage', shareNote: 'Quiconque ouvre ce lien peut seulement consulter l\u2019examen.',
    closeBtn: 'Fermer', copyBtn: 'Copier le lien', copiedBtn: 'Copié ✓',
    savedLocal: 'Enregistré', savingLocal: 'Enregistrement...', saveFailed: 'Échec de l\u2019enregistrement local',
    saveCloudBtn: 'Enregistrer sur mon compte', savingCloudBtn: 'Enregistrement...', savedCloudBtn: 'Enregistré ✓',
    signInBtn: 'Se connecter avec Google',
    addOpt: '+ Ajouter une option', delOpt: 'Supprimer l\u2019option', addStmt: '+ Ajouter un énoncé', delStmt: 'Supprimer l\u2019énoncé',
    addCorr: 'Ajouter une correction', hideCorr: 'Masquer la correction', correctionLabel: 'Correction :',
    moveUp: 'Monter', moveDown: 'Descendre', delQuestion: 'Supprimer l\u2019exercice',
    frameHide: 'Masquer le cadre à l\u2019impression', frameShow: 'Afficher le cadre à l\u2019impression',
    frameOffTag: 'Cadre masqué à l\u2019impression',
    addRow: '+ Ligne', delRow: '− Ligne', addCol: '+ Colonne', delCol: '− Colonne', mergeCells: '🔗 Fusionner',
    imagePlaceHint: 'Cliquez dans un exercice pour placer l\u2019image', delImage: 'Supprimer l\u2019image',
    libSoon: 'Cette fonctionnalité arrivera dans une prochaine étape.',
    ordWords: ['1er','2e','3e','4e','5e','6e','7e','8e','9e','10e'],
    exerciseWord: 'Exercice', untitledExam: 'Examen sans titre', defaultTitle: 'Examen du 1er trimestre',
    readonlyNote: 'Lecture seule — sans modification',
  }
};
const LANG_ORDER = ['ar', 'en', 'fr'];
let lang = localStorage.getItem('examgen_lang') || 'ar';
if (!LANG_ORDER.includes(lang)) lang = 'ar';
function t(k){ return I18N[lang][k]; }
function questionLabel(i){
  const words = t('ordWords');
  return i < 10 ? (t('exerciseWord') + ' ' + words[i]) : (t('exerciseWord') + ' ' + (i+1));
}

const $ = id => document.getElementById(id);

/* ================= Unicode-safe base64 ================= */
function b64Encode(str){
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (m, p1) => String.fromCharCode('0x' + p1)));
}
function b64Decode(str){
  return decodeURIComponent(atob(str).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
}

/* ================= Storage ================= */
const LIST_KEY = 'examgen_list_v1';
const EXAM_KEY_PREFIX = 'examgen_exam_';

function uid(p){ return (p||'exam_') + Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

function freshExam(){
  return {
    id: uid(),
    header: { institution:'', teacher:'', title: t('defaultTitle'), subject:'', grade:'', duration:'' },
    questions: [],
    maxPoints: 20,
    updatedAt: Date.now(),
    savedToCloud: false
  };
}
function emptyCell(){ return { value:'', rowspan:1, colspan:1, merged:false }; }
function makeGrid(r,c){ return Array.from({length:r},()=>Array.from({length:c},()=>emptyCell())); }

function loadList(){
  try{ return JSON.parse(localStorage.getItem(LIST_KEY) || '[]'); }catch(e){ return []; }
}
function saveList(list){ localStorage.setItem(LIST_KEY, JSON.stringify(list)); }
function loadExam(id){
  try{ return JSON.parse(localStorage.getItem(EXAM_KEY_PREFIX + id)); }catch(e){ return null; }
}
function persistExam(){
  exam.updatedAt = Date.now();
  localStorage.setItem(EXAM_KEY_PREFIX + exam.id, JSON.stringify(exam));
  let list = loadList().filter(e=>e.id!==exam.id);
  list.unshift({ id: exam.id, title: exam.header.title || t('untitledExam'), updatedAt: exam.updatedAt });
  saveList(list.slice(0,50));
}

let exam = freshExam();
let selectedId = null;
let placingImage = false;
let tableSelection = null;
let tableAnchor = null;
let activeEditable = null;
let selectedSymbol = null;
let isReadonly = false;
let currentUser = null;
let cloudSaveBusy = false;

const typeMeta = { normal:{icon:'✏️'}, mcq:{icon:'✅'}, tf:{icon:'☑️'}, blank:{icon:'🧩'}, table:{icon:'📊'} };

/* ================= List view ================= */
function renderListView(){
  const grid = $('examGrid');
  const list = loadList();
  $('emptyNote').classList.toggle('hidden', list.length>0);
  grid.innerHTML = list.map(e=>`
    <div class="exam-card" data-id="${e.id}">
      <div class="name">${escapeHtml(e.title)}</div>
      <div class="meta">${new Date(e.updatedAt).toLocaleString(lang==='ar'?'ar-DZ':(lang==='fr'?'fr-FR':'en-US'))}</div>
    </div>`).join('');
  grid.querySelectorAll('.exam-card').forEach(card=>{
    card.addEventListener('click', ()=>{
      const loaded = loadExam(card.dataset.id);
      if(loaded){ exam = loaded; selectedId = null; showEditor(); render(); }
    });
  });
}
function escapeHtml(s){ const d=document.createElement('div'); d.textContent=s||''; return d.innerHTML; }

function updateHero(){
  if(isReadonly || !$('editorView').classList.contains('hidden')){
    $('heroTitle').textContent = exam.header.title || t('defaultTitle');
    $('heroSub').textContent = exam.header.subject || '';
  } else {
    $('heroTitle').textContent = t('title');
    $('heroSub').textContent = t('subtitleList');
  }
}
function showEditor(){ $('listView').classList.add('hidden'); $('editorView').classList.remove('hidden'); updateHero(); }
function showList(){ $('editorView').classList.add('hidden'); $('listView').classList.remove('hidden'); updateHero(); renderListView(); }

$('newExamBtn') && $('newExamBtn').addEventListener('click', startNewExam);
function startNewExam(){
  exam = freshExam(); selectedId=null; isReadonly=false;
  persistExam();
  showEditor(); render();
}
$('newExamCard').addEventListener('click', startNewExam);
$('backToListBtn').addEventListener('click', showList);
['goTools','goLibrary','goSettings','goTemplates'].forEach(id=>{
  $(id).addEventListener('click', ()=> alert(t('libSoon')));
});

/* ================= Editor logic ================= */
function addQuestion(type){
  const q = {
    id: uid('q_'), type, text:'', points:2, frameOff:false,
    options: type==='mcq' ? ['','',''] : undefined,
    statements: type==='tf' ? [ {id:uid('s_'), text:'', correction:'', showCorrection:false} ] : undefined,
    grid: type==='table' ? makeGrid(3,3) : undefined,
    images: []
  };
  exam.questions.push(q);
  render(); scheduleSave();
}
function removeQuestion(id){
  exam.questions = exam.questions.filter(q=>q.id!==id);
  if(selectedId===id) selectedId=null;
  render(); scheduleSave();
}
function moveQuestion(id, dir){
  const i = exam.questions.findIndex(q=>q.id===id);
  const j = i+dir;
  if(j<0 || j>=exam.questions.length) return;
  [exam.questions[i], exam.questions[j]] = [exam.questions[j], exam.questions[i]];
  render(); scheduleSave();
}
function selectQuestion(id){ selectedId = id; render(); }
function selectQuestionLight(id){
  if(selectedId === id) return;
  selectedId = id;
  document.querySelectorAll('.question').forEach(el=> el.classList.toggle('selected', el.dataset.id===id));
  renderProps();
}
function findQ(id){ return exam.questions.find(q=>q.id===id); }

function renderProps(){
  const panel = $('propsPanel');
  const q = findQ(selectedId);
  if(!q || isReadonly){ panel.innerHTML = `<div class="props-empty">${t('propsEmpty')}</div>`; return; }
  panel.innerHTML = `
    <div class="props-card">
      <h4>${typeMeta[q.type].icon} ${t('propsPoints')}</h4>
      <div class="prop-row"><label>${t('propsPoints')}</label><input type="number" min="0" step="0.5" value="${q.points}" id="propPoints"></div>
    </div>`;
  $('propPoints').addEventListener('input', e=>{ q.points = parseFloat(e.target.value)||0; renderTotals(); scheduleSave(); });
}

function mcqHTML(q){
  const ro = isReadonly;
  return `<div class="mcq-options">` + q.options.map((opt,i)=>`
    <div class="mcq-opt">
      <span class="bullet"></span>
      <span class="opt-field"><input data-oi="${i}" value="${escapeHtml(opt)}" placeholder="…" ${ro?'disabled':''}></span>
      ${ro?'':`<button class="opt-del" data-act="delopt" data-oi="${i}" title="${t('delOpt')}">🗑️</button>`}
    </div>`).join('') + (ro?'':`<button class="add-opt-btn" data-act="addopt">${t('addOpt')}</button>`) + `</div>`;
}
function tfHTML(q){
  const ro = isReadonly;
  const head = `<div class="tf-head"><span>&nbsp;</span><span>${t('trueLabel')}</span><span>${t('falseLabel')}</span><span>&nbsp;</span></div>`;
  return `<div class="tf-wrap">` + head + q.statements.map(s=>`
    <div class="tf-row" data-sid="${s.id}">
      <input class="tf-text" data-field="text" value="${escapeHtml(s.text)}" placeholder="…" ${ro?'disabled':''}>
      <span class="tf-box"></span>
      <span class="tf-box"></span>
      ${ro?'<span></span>':`
      <div class="tf-row-actions">
        <button class="tf-mini" data-act="togglecorr" title="${s.showCorrection?t('hideCorr'):t('addCorr')}">${s.showCorrection?'✖️':'✎'}</button>
        <button class="tf-mini" data-act="delstmt" title="${t('delStmt')}">🗑️</button>
      </div>`}
      ${s.showCorrection ? `
      <div class="tf-correction">
        <span class="lbl">${t('correctionLabel')}</span>
        <input data-field="correction" value="${escapeHtml(s.correction)}" placeholder="..." ${ro?'disabled':''}>
      </div>` : ''}
    </div>`).join('') + (ro?'':`<button class="add-stmt-btn" data-act="addstmt">${t('addStmt')}</button>`) + `</div>`;
}
function tableHTML(q){
  let rows = '';
  for(let r=0;r<q.grid.length;r++){
    let cells='';
    for(let c=0;c<q.grid[r].length;c++){
      const cell = q.grid[r][c];
      if(cell.merged) continue;
      const attrs = (cell.rowspan>1?` rowspan="${cell.rowspan}"`:'') + (cell.colspan>1?` colspan="${cell.colspan}"`:'');
      cells += `<td ${isReadonly?'':'contenteditable="true"'} data-r="${r}" data-c="${c}"${attrs}>${escapeHtml(cell.value)}</td>`;
    }
    rows += `<tr>${cells}</tr>`;
  }
  if(isReadonly) return `<div class="table-wrap"><table class="exam-table">${rows}</table></div>`;
  return `<div class="table-wrap">
    <table class="exam-table">${rows}</table>
    <div class="table-tools">
      <button data-act="addrow">${t('addRow')}</button>
      <button data-act="delrow">${t('delRow')}</button>
      <button data-act="addcol">${t('addCol')}</button>
      <button data-act="delcol">${t('delCol')}</button>
      <button data-act="merge" class="merge-btn" ${tableSelection && tableSelection.qid===q.id ? '' : 'disabled'}>${t('mergeCells')}</button>
    </div>
  </div>`;
}
function imagesHTML(q){
  if(!q.images.length) return '<div class="img-layer"></div>';
  return `<div class="img-layer">` + q.images.map(im=>`
    <div class="img-item" data-iid="${im.id}" style="left:${im.x}px; top:${im.y}px; width:${im.w}px; height:${im.h}px;">
      <img src="${im.src}" draggable="false">
      ${isReadonly?'':`<button class="img-del" data-act="delimg" title="${t('delImage')}">✕</button>
      <div class="img-resize" data-act="resizeimg"></div>`}
    </div>`).join('') + `</div>`;
}
function questionHTML(q, index){
  let body = '';
  if(q.type==='mcq') body = mcqHTML(q);
  else if(q.type==='tf') body = tfHTML(q);
  else if(q.type==='table') body = tableHTML(q);
  else if(q.type==='blank') body = isReadonly?'':`<div class="blank-hint">ضع ..... داخل النص لتحديد مكان الفراغ</div>`;

  const controls = isReadonly ? '' : `
    <div class="q-controls">
      <button class="qc-btn" data-act="up" title="${t('moveUp')}">↑</button>
      <button class="qc-btn" data-act="down" title="${t('moveDown')}">↓</button>
      <button class="qc-btn frame-toggle ${q.frameOff?'is-off':''}" data-act="frame" title="${q.frameOff?t('frameShow'):t('frameHide')}">▢</button>
      <button class="qc-btn danger" data-act="del" title="${t('delQuestion')}">🗑️</button>
    </div>`;

  return `
    <div class="question ${q.id===selectedId?'selected':''} ${q.frameOff?'frame-off':''}" data-id="${q.id}" style="position:relative;">
      <div class="q-head">
        <div class="q-title">
          <span class="q-dot q-${q.type}"></span>
          <span class="q-num">${questionLabel(index)}</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <span class="q-points">${t('propsPoints')}: ${q.points}</span>
          ${controls}
        </div>
      </div>
      <textarea class="q-text" placeholder="…" ${isReadonly?'disabled':''} style="${q.textW?`width:${q.textW};`:''}${q.textH?`height:${q.textH};`:''}">${escapeHtml(q.text)}</textarea>
      ${body}
      ${imagesHTML(q)}
    </div>`;
}

function render(){
  const wrap = $('questionsWrap');
  if(exam.questions.length===0){ wrap.innerHTML=''; $('emptyHint').style.display = isReadonly?'none':'block'; }
  else{ $('emptyHint').style.display='none'; wrap.innerHTML = exam.questions.map((q,i)=>questionHTML(q,i)).join(''); attachQuestionEvents(); }
  renderTotals(); renderProps();
  $('hInstitution').value = exam.header.institution; $('hInstitution').disabled = isReadonly;
  $('hTeacher').value = exam.header.teacher; $('hTeacher').disabled = isReadonly;
  $('hTitle').value = exam.header.title; $('hTitle').disabled = isReadonly;
  $('hSubject').value = exam.header.subject; $('hSubject').disabled = isReadonly;
  $('hGrade').value = exam.header.grade; $('hGrade').disabled = isReadonly;
  $('hDuration').value = exam.header.duration; $('hDuration').disabled = isReadonly;
  $('maxPoints').value = exam.maxPoints; $('maxPoints').disabled = isReadonly;
  updateHero();
}
function renderTotals(){
  $('qCount').textContent = exam.questions.length;
  const total = exam.questions.reduce((s,q)=>s+(q.points||0),0);
  const el = $('totalPoints'); el.textContent = total; el.classList.toggle('over', total > exam.maxPoints);
}

function attachQuestionEvents(){
  document.querySelectorAll('.question').forEach(el=>{
    const id = el.dataset.id; const q = findQ(id);

    el.addEventListener('click', (e)=>{
      if(isReadonly) return;
      if(placingImage){
        e.stopPropagation();
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        triggerImagePlacement(q, x, y);
        return;
      }
      if(!['TEXTAREA','INPUT','TD','BUTTON'].includes(e.target.tagName)) selectQuestion(id);
    });

    const ta = el.querySelector('.q-text');
    if(ta){
      ta.addEventListener('input', e=>{ q.text = e.target.value; scheduleSave(); });
      ta.addEventListener('focus', ()=> selectQuestionLight(id));
      const captureTa = ()=>{ activeEditable = { type:'textarea', el:ta, start:ta.selectionStart, end:ta.selectionEnd }; };
      ta.addEventListener('focus', captureTa);
      ta.addEventListener('click', captureTa);
      ta.addEventListener('keyup', captureTa);
      if(!isReadonly && window.ResizeObserver){
        const robs = new ResizeObserver(()=>{
          q.textW = ta.style.width || q.textW;
          q.textH = ta.style.height || q.textH;
          scheduleSave();
        });
        robs.observe(ta);
      }
    }

    if(isReadonly) return;

    el.querySelectorAll('[data-act]').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        e.stopPropagation();
        const act = btn.dataset.act;
        if(act==='up') moveQuestion(id,-1);
        else if(act==='down') moveQuestion(id,1);
        else if(act==='del') removeQuestion(id);
        else if(act==='frame'){ q.frameOff = !q.frameOff; render(); scheduleSave(); }
        else if(act==='addopt'){ q.options.push(''); render(); scheduleSave(); }
        else if(act==='delopt'){ q.options.splice(+btn.dataset.oi,1); render(); scheduleSave(); }
        else if(act==='addstmt'){ q.statements.push({id:uid('s_'),text:'',correction:'',showCorrection:false}); render(); scheduleSave(); }
        else if(act==='delstmt'){ const row = btn.closest('.tf-row'); q.statements = q.statements.filter(s=>s.id!==row.dataset.sid); render(); scheduleSave(); }
        else if(act==='togglecorr'){ const row = btn.closest('.tf-row'); const s = q.statements.find(s=>s.id===row.dataset.sid); s.showCorrection=!s.showCorrection; render(); scheduleSave(); }
        else if(act==='addrow'){ q.grid.push(Array.from({length:q.grid[0].length},()=>emptyCell())); render(); scheduleSave(); }
        else if(act==='delrow'){ if(q.grid.length>1){ q.grid.pop(); render(); scheduleSave(); } }
        else if(act==='addcol'){ q.grid.forEach(r=>r.push(emptyCell())); render(); scheduleSave(); }
        else if(act==='delcol'){ if(q.grid[0].length>1){ q.grid.forEach(r=>r.pop()); render(); scheduleSave(); } }
        else if(act==='merge'){ mergeSelection(); }
        else if(act==='delimg'){ const item = btn.closest('.img-item'); q.images = q.images.filter(im=>im.id!==item.dataset.iid); render(); scheduleSave(); }
      });
    });

    el.querySelectorAll('.opt-field input').forEach(inp=>{
      inp.addEventListener('input', e=>{ q.options[+inp.dataset.oi] = e.target.value; scheduleSave(); });
      inp.addEventListener('focus', ()=> selectQuestionLight(id));
    });

    el.querySelectorAll('.tf-row').forEach(row=>{
      const s = q.statements.find(s=>s.id===row.dataset.sid);
      row.querySelectorAll('[data-field]').forEach(inp=>{
        inp.addEventListener('input', e=>{ s[inp.dataset.field] = e.target.value; scheduleSave(); });
        inp.addEventListener('focus', ()=> selectQuestionLight(id));
      });
    });

    el.querySelectorAll('td[contenteditable]').forEach(td=>{
      td.addEventListener('input', ()=>{ q.grid[+td.dataset.r][+td.dataset.c].value = td.textContent; scheduleSave(); });
      td.addEventListener('focus', ()=> selectQuestionLight(id));
      const captureTd = ()=>{
        const sel = window.getSelection();
        activeEditable = { type:'td', el:td, range: sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null };
      };
      td.addEventListener('focus', captureTd);
      td.addEventListener('keyup', captureTd);
      td.addEventListener('click', (e)=>{
        const r = +td.dataset.r, c = +td.dataset.c;
        if(e.shiftKey && tableAnchor && tableAnchor.qid===q.id){
          e.preventDefault();
          tableSelection = { qid:q.id, r1:tableAnchor.r, c1:tableAnchor.c, r2:r, c2:c };
          paintSelection(el, q);
        } else {
          tableAnchor = { qid:q.id, r, c };
          tableSelection = null;
          el.querySelectorAll('td').forEach(cell=> cell.classList.remove('cell-selected'));
          const mergeBtn = el.querySelector('.merge-btn');
          if(mergeBtn) mergeBtn.disabled = true;
          captureTd();
        }
      });
    });

    el.querySelectorAll('.img-item').forEach(item=>{
      const im = q.images.find(x=>x.id===item.dataset.iid);
      item.addEventListener('mousedown', (e)=>{
        if(e.target.dataset.act==='resizeimg' || e.target.dataset.act==='delimg') return;
        e.preventDefault(); e.stopPropagation();
        const parentRect = el.getBoundingClientRect();
        const startX = e.clientX, startY = e.clientY, ox = im.x, oy = im.y;
        function onMove(ev){
          let nx = ox + (ev.clientX-startX), ny = oy + (ev.clientY-startY);
          nx = Math.max(0, Math.min(nx, parentRect.width-im.w));
          ny = Math.max(0, Math.min(ny, parentRect.height-im.h));
          im.x=nx; im.y=ny; item.style.left=nx+'px'; item.style.top=ny+'px';
        }
        function onUp(){ document.removeEventListener('mousemove',onMove); document.removeEventListener('mouseup',onUp); scheduleSave(); }
        document.addEventListener('mousemove',onMove); document.addEventListener('mouseup',onUp);
      });
      const rh = item.querySelector('[data-act="resizeimg"]');
      if(rh) rh.addEventListener('mousedown', (e)=>{
        e.preventDefault(); e.stopPropagation();
        const parentRect = el.getBoundingClientRect();
        const startX=e.clientX, startY=e.clientY, ow=im.w, oh=im.h;
        function onMove(ev){
          let nw = Math.max(30, ow + (ev.clientX-startX));
          let nh = Math.max(30, oh + (ev.clientY-startY));
          nw = Math.min(nw, parentRect.width-im.x); nh = Math.min(nh, parentRect.height-im.y);
          im.w=nw; im.h=nh; item.style.width=nw+'px'; item.style.height=nh+'px';
        }
        function onUp(){ document.removeEventListener('mousemove',onMove); document.removeEventListener('mouseup',onUp); scheduleSave(); }
        document.addEventListener('mousemove',onMove); document.addEventListener('mouseup',onUp);
      });
    });
  });
}

function paintSelection(qEl, q){
  const {r1,c1,r2,c2} = tableSelection;
  const rmin=Math.min(r1,r2), rmax=Math.max(r1,r2), cmin=Math.min(c1,c2), cmax=Math.max(c1,c2);
  qEl.querySelectorAll('td').forEach(td=>{
    const r=+td.dataset.r, c=+td.dataset.c;
    td.classList.toggle('cell-selected', r>=rmin&&r<=rmax&&c>=cmin&&c<=cmax);
  });
  const mergeBtn = qEl.querySelector('.merge-btn');
  if(mergeBtn) mergeBtn.disabled = (rmin===rmax && cmin===cmax);
}
function mergeSelection(){
  if(!tableSelection) return;
  const q = findQ(tableSelection.qid); if(!q) return;
  const {r1,c1,r2,c2} = tableSelection;
  const rmin=Math.min(r1,r2), rmax=Math.max(r1,r2), cmin=Math.min(c1,c2), cmax=Math.max(c1,c2);
  if(rmin===rmax && cmin===cmax){ tableSelection=null; return; }
  let combined = '';
  for(let r=rmin;r<=rmax;r++) for(let c=cmin;c<=cmax;c++){
    if(q.grid[r][c].value) combined += (combined?' ':'') + q.grid[r][c].value;
  }
  for(let r=rmin;r<=rmax;r++) for(let c=cmin;c<=cmax;c++){
    q.grid[r][c].merged = true; q.grid[r][c].rowspan=1; q.grid[r][c].colspan=1; q.grid[r][c].value='';
  }
  q.grid[rmin][cmin].merged = false;
  q.grid[rmin][cmin].rowspan = rmax-rmin+1;
  q.grid[rmin][cmin].colspan = cmax-cmin+1;
  q.grid[rmin][cmin].value = combined;
  tableSelection = null;
  tableAnchor = null;
  render(); scheduleSave();
}

/* ================= Symbols palette ================= */
const SYMBOL_GROUPS = [
  { title: { ar:'حروف يونانية', en:'Greek letters', fr:'Lettres grecques' },
    items: ['α','β','γ','δ','Δ','θ','λ','μ','π','Σ','Ω','φ'] },
  { title: { ar:'رياضيات', en:'Math', fr:'Mathématiques' },
    items: ['√','±','×','÷','≤','≥','≠','≈','∞','°','²','³','½','∫','∑'] },
  { title: { ar:'أسهم', en:'Arrows', fr:'Flèches' },
    items: ['→','←','↔','⇒','⇐','⇔','↑','↓','↦'] },
  { title: { ar:'مجموعات ومنطق', en:'Sets & logic', fr:'Ensembles et logique' },
    items: ['∈','∉','⊂','∪','∩','∀','∃','¬'] },
];

function buildSymbolsPanel(){
  const body = $('symbolsBody');
  body.innerHTML = SYMBOL_GROUPS.map(g=>`
    <div class="sym-group-title">${g.title[lang] || g.title.ar}</div>
    <div class="sym-grid">${g.items.map(s=>`<button class="sym-btn" data-sym="${s}">${s}</button>`).join('')}</div>
  `).join('');
  body.querySelectorAll('.sym-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      body.querySelectorAll('.sym-btn').forEach(b=> b.classList.remove('sym-selected'));
      btn.classList.add('sym-selected');
      selectedSymbol = btn.dataset.sym;
      $('symPreview').textContent = selectedSymbol;
    });
  });
}
$('symbolsToolBtn').addEventListener('click', ()=>{
  const panel = $('symbolsPanel');
  const opening = panel.classList.contains('hidden');
  panel.classList.toggle('hidden');
  if(opening) buildSymbolsPanel();
});
$('closeSymbolsBtn').addEventListener('click', ()=> $('symbolsPanel').classList.add('hidden'));
$('insertSymbolBtn').addEventListener('click', ()=>{
  if(!selectedSymbol || !activeEditable) return;
  insertAtActiveEditable(selectedSymbol);
});
function insertAtActiveEditable(text){
  const ae = activeEditable;
  if(!ae) return;
  if(ae.type==='textarea'){
    const el = ae.el;
    const val = el.value;
    const start = ae.start, end = ae.end;
    el.value = val.slice(0,start) + text + val.slice(end);
    const newPos = start + text.length;
    el.focus();
    el.selectionStart = el.selectionEnd = newPos;
    ae.start = ae.end = newPos;
    el.dispatchEvent(new Event('input', { bubbles:true }));
  } else if(ae.type==='td'){
    const el = ae.el;
    el.focus();
    const sel = window.getSelection();
    sel.removeAllRanges();
    if(ae.range){ try{ sel.addRange(ae.range); }catch(e){} }
    document.execCommand('insertText', false, text);
    if(sel.rangeCount) ae.range = sel.getRangeAt(0).cloneRange();
    el.dispatchEvent(new Event('input', { bubbles:true }));
  }
}

/* ================= Image insertion ================= */
const imgFileInput = $('imgFileInput');
let pendingImagePlacement = null;
function triggerImagePlacement(q, x, y){
  pendingImagePlacement = { qid:q.id, x, y };
  imgFileInput.value = '';
  imgFileInput.click();
}
imgFileInput.addEventListener('change', (e)=>{
  const file = e.target.files[0];
  if(!file || !pendingImagePlacement) return;
  const reader = new FileReader();
  reader.onload = function(ev){
    const q = findQ(pendingImagePlacement.qid);
    if(q){
      const w=140,h=100;
      q.images.push({ id: uid('im_'), src: ev.target.result,
        x: Math.max(0, pendingImagePlacement.x - w/2), y: Math.max(0, pendingImagePlacement.y - h/2), w, h });
      render(); scheduleSave();
    }
    pendingImagePlacement = null;
    setImageTool(false);
  };
  reader.readAsDataURL(file);
});
function setImageTool(on){
  placingImage = on;
  $('imageToolBtn').classList.toggle('active-tool', on);
  $('imageHintWrap').innerHTML = on ? `<div class="image-hint">${t('imagePlaceHint')}</div>` : '';
}
$('imageToolBtn').addEventListener('click', ()=> setImageTool(!placingImage));

/* ================= Header inputs ================= */
const headerMap = { hInstitution:'institution', hTeacher:'teacher', hTitle:'title', hSubject:'subject', hGrade:'grade', hDuration:'duration' };
Object.keys(headerMap).forEach(id=>{
  $(id).addEventListener('input', e=>{ exam.header[headerMap[id]] = e.target.value; scheduleSave(); });
});
$('maxPoints').addEventListener('input', e=>{ exam.maxPoints = parseFloat(e.target.value)||20; renderTotals(); scheduleSave(); });

document.querySelectorAll('.tool-btn[data-type]').forEach(btn=>{
  btn.addEventListener('click', ()=> addQuestion(btn.dataset.type));
});
$('libBtn').addEventListener('click', ()=> alert(t('libSoon')));

/* ================= Autosave (local) ================= */
let saveTimer=null;
function scheduleSave(){
  if(isReadonly) return;
  const dot=$('saveDot'), text=$('saveText');
  dot.classList.add('saving'); text.textContent=t('savingLocal');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(()=>{
    try{ persistExam(); dot.classList.remove('saving'); text.textContent=t('savedLocal'); }
    catch(err){ text.textContent=t('saveFailed'); }
  }, 500);
}

/* ================= Print ================= */
$('printBtn').addEventListener('click', ()=> window.print());

/* ================= Share (read-only link) ================= */
$('shareBtn').addEventListener('click', ()=>{
  const payload = { h: exam.header, q: exam.questions, mp: exam.maxPoints, l: lang };
  const encoded = b64Encode(JSON.stringify(payload));
  const url = `${location.origin}${location.pathname}#shared=${encoded}`;
  $('shareLinkInput').value = url;
  $('copyShareBtn').textContent = t('copyBtn');
  $('shareBackdrop').classList.remove('hidden');
});
$('closeShareBtn').addEventListener('click', ()=> $('shareBackdrop').classList.add('hidden'));
$('shareBackdrop').addEventListener('click', (e)=>{ if(e.target.id==='shareBackdrop') $('shareBackdrop').classList.add('hidden'); });
$('copyShareBtn').addEventListener('click', ()=>{
  const input = $('shareLinkInput'); input.select();
  navigator.clipboard.writeText(input.value).then(()=>{ $('copyShareBtn').textContent = t('copiedBtn'); })
    .catch(()=>{ document.execCommand('copy'); $('copyShareBtn').textContent = t('copiedBtn'); });
});
function tryLoadSharedFromHash(){
  const hash = location.hash;
  if(hash.startsWith('#shared=')){
    try{
      const encoded = hash.slice('#shared='.length);
      const payload = JSON.parse(b64Decode(decodeURIComponent(encoded)));
      exam = freshExam();
      exam.header = payload.h || exam.header;
      exam.questions = payload.q || [];
      exam.maxPoints = payload.mp || 20;
      if(payload.l) lang = payload.l;
      isReadonly = true;
      return true;
    }catch(e){ return false; }
  }
  return false;
}

/* ================= Language ================= */
function applyLanguage(){
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  const nextLang = LANG_ORDER[(LANG_ORDER.indexOf(lang) + 1) % LANG_ORDER.length];
  $('langToggle').textContent = nextLang.toUpperCase();
  document.querySelectorAll('[data-i18n]').forEach(el=>{ el.textContent = t(el.getAttribute('data-i18n')); });
  document.querySelectorAll('[data-i18n-inline]').forEach(el=>{ el.textContent = t(el.getAttribute('data-i18n-inline')); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{ el.placeholder = t(el.getAttribute('data-i18n-placeholder')); });
  updateCloudButtons();
  localStorage.setItem('examgen_lang', lang);
}
$('langToggle').addEventListener('click', ()=>{
  lang = LANG_ORDER[(LANG_ORDER.indexOf(lang) + 1) % LANG_ORDER.length];
  applyLanguage();
  if(!$('editorView').classList.contains('hidden')) render(); else renderListView();
});

/* ================= Firebase auth + cloud save (activates once configured) ================= */
function updateCloudButtons(){
  const saveCloudBtn = $('saveCloudBtn'), signInBtn = $('signInBtn');
  if(isReadonly){ saveCloudBtn.classList.add('hidden'); signInBtn.classList.add('hidden'); return; }
  saveCloudBtn.classList.toggle('hidden', !currentUser);
  signInBtn.classList.toggle('hidden', !!currentUser);
  if(!cloudSaveBusy){ const span = saveCloudBtn.querySelector('span'); if(span) span.textContent = t('saveCloudBtn'); }
  const signSpan = signInBtn.querySelector('span'); if(signSpan) signSpan.textContent = t('signInBtn');
}
$('signInBtn').addEventListener('click', ()=>{
  if(!window.fbAuth) return;
  window.fbAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(()=>{});
});
$('saveCloudBtn').addEventListener('click', ()=>{
  if(!currentUser || !window.fbDb) return;
  const btnSpan = $('saveCloudBtn').querySelector('span');
  cloudSaveBusy = true; btnSpan.textContent = t('savingCloudBtn');
  const payload = { owner: currentUser.uid, header: exam.header, questions: exam.questions, maxPoints: exam.maxPoints, updatedAt: new Date().toISOString() };
  window.fbDb.collection('exams').doc(exam.id).set(payload, { merge:true })
    .then(()=>{ exam.savedToCloud = true; persistExam(); btnSpan.textContent = t('savedCloudBtn');
      setTimeout(()=>{ cloudSaveBusy=false; btnSpan.textContent = t('saveCloudBtn'); }, 2000); })
    .catch(()=>{ cloudSaveBusy=false; btnSpan.textContent = t('saveCloudBtn'); });
});
if(window.fbAuth){
  window.fbAuth.onAuthStateChanged(user=>{ currentUser = user; updateCloudButtons(); });
}

/* ================= Init ================= */
applyLanguage();
if(tryLoadSharedFromHash()){
  showEditor(); render();
} else {
  renderListView();
}
