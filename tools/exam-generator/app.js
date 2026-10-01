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
  if(lang !== 'ar') return t('exerciseWord') + ' ' + (i+1);
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

/* ================= State ================= */
function uid(p){ return (p||'exam_') + Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

function freshExam(){
  const s = (typeof getSettings === 'function') ? getSettings() : {};
  const ex = {
    id: uid(),
    header: {
      institution: s.institution || '', teacher: s.teacher || '', title: t('defaultTitle'),
      subject: s.subject || '', grade: (s.levels && s.levels[0]) || '', duration: s.duration || '',
      year: s.year || defaultSchoolYear(), directorate: s.directorate || '', logo: s.logo || ''
    },
    tpl: { header: s.headerTpl || 'classic', style: s.styleTpl || 'classic', fontSize: s.fontSize || 'md' },
    lang: s.examLang || lang,
    questions: [],
    objects: {},
    maxPoints: s.maxPoints || 20,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    savedToCloud: false
  };
  return ex;
}
function defaultSchoolYear(){
  const d = new Date(); const y = d.getFullYear();
  return d.getMonth() >= 7 ? `${y}/${y+1}` : `${y-1}/${y}`;
}
/* Bring any stored exam (old or new format) up to the current shape */
function normalizeExam(ex){
  if(!ex) return ex;
  ex.header = Object.assign({ institution:'', teacher:'', title:'', subject:'', grade:'', duration:'', year:'', directorate:'', logo:'' }, ex.header || {});
  ex.tpl = Object.assign({ header:'classic', style:'classic', fontSize:'md' }, ex.tpl || {});
  if(!LANG_ORDER.includes(ex.lang)) ex.lang = lang;
  ex.objects = ex.objects || {};
  ex.questions = ex.questions || [];
  ex.createdAt = ex.createdAt || ex.updatedAt || Date.now();
  ex.questions.forEach(q => {
    if(q.html == null) q.html = textToHtml(q.text);
    if(q.type === 'mcq' && q.options && !q.optHtml){ q.options = q.options.map(o => textToHtml(o)); q.optHtml = true; }
    if(q.type === 'tf' && q.statements) q.statements.forEach(s => { if(s.html == null) s.html = textToHtml(s.text); });
    q.images = q.images || [];
  });
  // drop objects that are no longer referenced anywhere
  const used = new Set();
  ex.questions.forEach(q => {
    richObjIds(q.html).forEach(id => used.add(id));
    (q.options || []).forEach(o => richObjIds(o).forEach(id => used.add(id)));
    (q.statements || []).forEach(s => richObjIds(s.html).forEach(id => used.add(id)));
  });
  Object.keys(ex.objects).forEach(id => { if(!used.has(id)) delete ex.objects[id]; });
  return ex;
}

function emptyCell(){ return { value:'', rowspan:1, colspan:1, merged:false }; }
function makeGrid(r,c){ return Array.from({length:r},()=>Array.from({length:c},()=>emptyCell())); }

let examsCache = [];   // all saved exams (full objects), newest first
async function loadAllExams(){
  examsCache = (await Store.all('exams')).map(normalizeExam).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0));
  return examsCache;
}
function persistExam(){
  if(isReadonly) return Promise.resolve();
  exam.updatedAt = Date.now();
  exam.questions.forEach(q => { q.text = richToPlain(q.html); });
  const snapshot = JSON.parse(JSON.stringify(exam));
  examsCache = [snapshot].concat(examsCache.filter(e => e.id !== exam.id));
  return Store.put('exams', snapshot);
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

/* Run fn with the global language switched to the exam's own language (page labels follow the exam) */
function withExamLang(ex, fn){
  const saved = lang;
  lang = (ex && ex.lang) || lang;
  try{ return fn(); } finally { lang = saved; }
}
function escapeHtml(s){ const d=document.createElement('div'); d.textContent=s||''; return d.innerHTML; }

/* ================= Views ================= */
const VIEWS = ['listView','editorView','libraryView','settingsView','templatesView'];
function showView(id){
  VIEWS.forEach(v => { const el = $(v); if(el) el.classList.toggle('hidden', v !== id); });
  deselectObject && deselectObject();
  updateHero();
  window.scrollTo(0, 0);
}
function updateHero(){
  const heroTitle = $('heroTitle'), heroSub = $('heroSub');
  if(isReadonly || !$('editorView').classList.contains('hidden')){
    heroTitle.textContent = exam.header.title || t('defaultTitle');
    heroSub.textContent = [exam.header.subject, exam.header.grade].filter(Boolean).join(' — ');
  } else if(!$('libraryView').classList.contains('hidden')){
    heroTitle.textContent = L('مكتبتي','My library','Ma bibliothèque');
    heroSub.textContent = L('كل ما أنشأته محفوظ هنا تلقائيًا، أدرجه في أي امتحان بضغطة واحدة','Everything you create is saved here automatically','Tout ce que vous créez est enregistré ici automatiquement');
  } else if(!$('settingsView').classList.contains('hidden')){
    heroTitle.textContent = L('الإعدادات','Settings','Paramètres');
    heroSub.textContent = L('املأ معلوماتك مرة واحدة، وستظهر تلقائيًا في كل امتحان جديد','Fill your info once — it appears in every new exam','Remplissez vos informations une seule fois');
  } else if(!$('templatesView').classList.contains('hidden')){
    heroTitle.textContent = L('القوالب','Templates','Modèles');
    heroSub.textContent = L('اختر شكلًا جاهزًا أو امتحانًا كاملًا وابدأ منه','Pick a ready design or a complete exam to start from','Choisissez un modèle prêt à l’emploi');
  } else {
    heroTitle.textContent = t('title');
    heroSub.textContent = t('subtitleList');
  }
}
function showEditor(){ showView('editorView'); }
function showList(){ showView('listView'); renderListView(); }

function openExam(ex){
  exam = normalizeExam(JSON.parse(JSON.stringify(ex)));
  selectedId = null; isReadonly = false;
  showEditor(); render();
}
function startNewExam(){
  exam = freshExam(); selectedId=null; isReadonly=false;
  persistExam();
  showEditor(); render();
}
$('newExamCard').addEventListener('click', () => {
  const m = openModal({ size:'medium', icon:'📝', title: L('كيف تريد أن تبدأ؟','How do you want to start?','Comment commencer ?'),
    body: `<div class="tool-tiles">
      <button class="tool-tile" data-st="blank" style="--c:#1F6F63"><span class="tt-ic">📄</span><span class="tt-name">${L('صفحة فارغة','Blank page','Page vierge')}</span><span class="tt-desc">${L('ترويسة جاهزة بمعلوماتك، وتضيف التمارين بنفسك','Header with your info; you add the exercises','En-tête prêt, vous ajoutez les exercices')}</span></button>
      <button class="tool-tile" data-st="tpl" style="--c:#E08E3E"><span class="tt-ic">✨</span><span class="tt-name">${L('من قالب جاهز','From a ready template','Depuis un modèle')}</span><span class="tt-desc">${L('امتحان كامل حسب المادة والمستوى، تعدّل فيه ما تريد فقط','A complete exam by subject and level','Un examen complet par matière et niveau')}</span></button>
    </div>` });
  m.body.querySelector('[data-st="blank"]').onclick = () => { m.close(); startNewExam(); };
  m.body.querySelector('[data-st="tpl"]').onclick = () => { m.close(); tplTab = 'exams'; goTemplates(); };
});
$('backToListBtn').addEventListener('click', () => { persistExam(); showList(); });

/* ================= Editor logic ================= */
function addQuestion(type){
  const q = {
    id: uid('q_'), type, text:'', html:'', points:2, frameOff:false,
    options: type==='mcq' ? ['','',''] : undefined, optHtml: type==='mcq' ? true : undefined,
    statements: type==='tf' ? [ {id:uid('s_'), text:'', html:'', correction:'', showCorrection:false} ] : undefined,
    grid: type==='table' ? makeGrid(3,3) : undefined,
    images: []
  };
  exam.questions.push(q);
  selectedId = q.id;
  render(); scheduleSave();
  return q;
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
      <div class="prop-row"><label>${t('propsPoints')}</label><input type="number" min="0" step="0.25" value="${q.points}" id="propPoints"></div>
      <div class="prop-row"><label>${L('عنوان خاص (اختياري)','Custom title (optional)','Titre personnalisé')}</label><input id="propTitle" value="${escAttr(q.title || '')}" placeholder="${escAttr(questionLabel(numberIndex(q)))}"></div>
    </div>
    <div class="props-card props-insert">
      <h4>➕ ${L('أضف داخل هذا التمرين','Add inside this exercise','Ajouter dans cet exercice')}</h4>
      <button class="pi-btn" data-kind="eq"><span style="background:#2563EB">∑</span>${L('معادلة','Equation','Équation')}</button>
      <button class="pi-btn" data-kind="plot"><span style="background:#059669">📈</span>${L('منحنى','Curve','Courbe')}</button>
      <button class="pi-btn" data-kind="draw"><span style="background:#D97706">📐</span>${L('رسم','Drawing','Dessin')}</button>
      <button class="pi-btn" data-kind="table"><span style="background:#7C3AED">▦</span>${L('جدول','Table','Tableau')}</button>
    </div>`;
  $('propPoints').addEventListener('input', e=>{ q.points = parseFloat(e.target.value)||0; renderTotals(); scheduleSave();
    const pe = document.querySelector(`.question[data-id="${q.id}"] .q-points`); if(pe) pe.textContent = `${t('propsPoints')}: ${q.points}`; });
  $('propTitle').addEventListener('change', e=>{ q.title = e.target.value.trim(); render(); scheduleSave(); });
  panel.querySelectorAll('.pi-btn').forEach(b => b.addEventListener('click', () => {
    if(!activeEditable || activeEditable.type !== 'rich' || !activeEditable.el.closest(`.question[data-id="${q.id}"]`)){
      const el = document.querySelector(`.question[data-id="${q.id}"] .rich[data-rich="text"]`);
      if(el){ const r = document.createRange(); r.selectNodeContents(el); r.collapse(false); activeEditable = { type:'rich', el, range:r }; }
    }
    openObjTool(b.dataset.kind);
  }));
}

function mcqHTML(q){
  const ro = isReadonly;
  return `<div class="mcq-options">` + q.options.map((opt,i)=>`
    <div class="mcq-opt">
      <span class="bullet"></span>
      <span class="opt-field">${richFieldHTML(opt, `data-rich="opt" data-oi="${i}"`, '…', 'rich-line')}</span>
      ${ro?'':`<button class="opt-del" data-act="delopt" data-oi="${i}" title="${t('delOpt')}">🗑️</button>`}
    </div>`).join('') + (ro?'':`<button class="add-opt-btn" data-act="addopt">${t('addOpt')}</button>`) + `</div>`;
}
function tfHTML(q){
  const ro = isReadonly;
  const head = `<div class="tf-head"><span>&nbsp;</span><span>${t('trueLabel')}</span><span>${t('falseLabel')}</span><span>&nbsp;</span></div>`;
  return `<div class="tf-wrap">` + head + q.statements.map(s=>`
    <div class="tf-row" data-sid="${s.id}">
      ${richFieldHTML(s.html, `data-rich="stmt"`, '…', 'rich-line tf-text')}
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
/* Exercise number, skipping items that have their own title (e.g. "Text", "Part II") */
function numberIndex(q, ex){
  let n = 0;
  for(const x of (ex || exam).questions){ if(x === q) return n; if(!x.title) n++; }
  return n;
}
function questionHTML(q, index){
  let body = '';
  if(q.type==='mcq') body = mcqHTML(q);
  else if(q.type==='tf') body = tfHTML(q);
  else if(q.type==='table') body = tableHTML(q);
  else if(q.type==='blank') body = isReadonly?'':`<div class="blank-hint">${L('ضع ..... داخل النص لتحديد مكان الفراغ','Type ..... in the text to mark a blank','Tapez ..... pour marquer un trou')}</div>`;

  const controls = isReadonly ? '' : `
    <div class="q-controls">
      <button class="qc-btn" data-act="up" title="${t('moveUp')}">↑</button>
      <button class="qc-btn" data-act="down" title="${t('moveDown')}">↓</button>
      <button class="qc-btn frame-toggle ${q.frameOff?'is-off':''}" data-act="frame" title="${q.frameOff?t('frameShow'):t('frameHide')}">▢</button>
      <button class="qc-btn danger" data-act="del" title="${t('delQuestion')}">🗑️</button>
    </div>`;
  const tstyle = (q.textH ? `min-height:${q.textH};` : '');
  return `
    <div class="question ${q.id===selectedId?'selected':''} ${q.frameOff?'frame-off':''}" data-id="${q.id}" style="position:relative;">
      <div class="q-head">
        <div class="q-title">
          <span class="q-dot q-${q.type}"></span>
          <span class="q-num">${escapeHtml(q.title || '') || questionLabel(numberIndex(q))}</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          ${q.points || !isReadonly ? `<span class="q-points ${q.points ? '' : 'zero'}">${t('propsPoints')}: ${q.points}</span>` : ''}
          ${controls}
        </div>
      </div>
      ${richFieldHTML(q.html, `data-rich="text" style="${tstyle}"`, isReadonly ? '' : L('اكتب نص السؤال هنا… (يمكنك إدراج معادلة أو رسم أو منحنى من الأزرار)','Type the question here… (you can insert equations, drawings or curves)','Écrivez l’énoncé ici…'), 'q-text')}
      ${body}
      <div class="q-clear"></div>
      ${imagesHTML(q)}
    </div>`;
}

function render(){
  const wrap = $('questionsWrap');
  const page = $('examPage');
  page.setAttribute('dir', (exam.lang || lang) === 'ar' ? 'rtl' : 'ltr');
  page.setAttribute('lang', exam.lang || lang);
  if(exam.questions.length===0){ wrap.innerHTML=''; $('emptyHint').style.display = isReadonly?'none':'block'; }
  else{
    $('emptyHint').style.display='none';
    wrap.innerHTML = withExamLang(exam, () => exam.questions.map((q,i)=>questionHTML(q,i)).join(''));
    hydrateObjects(wrap, exam.objects);
    attachQuestionEvents();
  }
  renderTotals(); renderProps();
  if(typeof renderHeader === 'function') withExamLang(exam, renderHeader);
  $('maxPoints').value = exam.maxPoints; $('maxPoints').disabled = isReadonly;
  updateHero();
}
function renderTotals(){
  $('qCount').textContent = exam.questions.length;
  const total = exam.questions.reduce((s,q)=>s+(q.points||0),0);
  const el = $('totalPoints'); el.textContent = total; el.classList.toggle('over', total > exam.maxPoints);
}

function attachQuestionEvents(){
  document.querySelectorAll('#questionsWrap .question').forEach(el=>{
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
      if(!e.target.closest('.rich, input, td, button, .eobj')) selectQuestion(id);
    });

    if(isReadonly) return;

    const main = el.querySelector('.rich[data-rich="text"]');
    bindRich(main, html => { q.html = html; scheduleSave(); }, () => selectQuestionLight(id));

    el.querySelectorAll('.rich[data-rich="opt"]').forEach(r => {
      bindRich(r, html => { q.options[+r.dataset.oi] = html; scheduleSave(); }, () => selectQuestionLight(id));
    });
    el.querySelectorAll('.tf-row').forEach(row=>{
      const s = q.statements.find(s=>s.id===row.dataset.sid);
      const r = row.querySelector('.rich[data-rich="stmt"]');
      bindRich(r, html => { s.html = html; s.text = richToPlain(html); scheduleSave(); }, () => selectQuestionLight(id));
      row.querySelectorAll('input[data-field]').forEach(inp=>{
        inp.addEventListener('input', e=>{ s[inp.dataset.field] = e.target.value; scheduleSave(); });
        inp.addEventListener('focus', ()=> selectQuestionLight(id));
      });
    });

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
        else if(act==='addstmt'){ q.statements.push({id:uid('s_'),text:'',html:'',correction:'',showCorrection:false}); render(); scheduleSave(); }
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
    btn.addEventListener('mousedown', e => e.preventDefault());
    btn.addEventListener('click', ()=>{
      body.querySelectorAll('.sym-btn').forEach(b=> b.classList.remove('sym-selected'));
      btn.classList.add('sym-selected');
      selectedSymbol = btn.dataset.sym;
      $('symPreview').textContent = selectedSymbol;
    });
    btn.addEventListener('dblclick', ()=>{ selectedSymbol = btn.dataset.sym; insertAtActiveEditable(selectedSymbol); });
  });
}
$('symbolsToolBtn').addEventListener('click', ()=>{
  const panel = $('symbolsPanel');
  const opening = panel.classList.contains('hidden');
  panel.classList.toggle('hidden');
  if(opening) buildSymbolsPanel();
});
$('closeSymbolsBtn').addEventListener('click', ()=> $('symbolsPanel').classList.add('hidden'));
$('insertSymbolBtn').addEventListener('mousedown', e => e.preventDefault());
$('insertSymbolBtn').addEventListener('click', ()=>{
  if(!selectedSymbol || !activeEditable) return;
  insertAtActiveEditable(selectedSymbol);
});
function insertAtActiveEditable(text){
  const ae = activeEditable;
  if(!ae || !document.body.contains(ae.el)) return;
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
  } else if(ae.type==='td' || ae.type==='rich'){
    const el = ae.el;
    el.focus();
    const sel = window.getSelection();
    sel.removeAllRanges();
    if(ae.range && el.contains(ae.range.startContainer)){ try{ sel.addRange(ae.range); }catch(e){} }
    else { const r = document.createRange(); r.selectNodeContents(el); r.collapse(false); sel.addRange(r); }
    document.execCommand('insertText', false, text);
    if(sel.rangeCount) ae.range = sel.getRangeAt(0).cloneRange();
  }
}

/* ================= Image insertion (free placement inside an exercise) ================= */
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
      if(typeof libraryAutoSave === 'function') libraryAutoSave({ kind:'image', data:{ src: ev.target.result, name: file.name } });
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

$('maxPoints').addEventListener('input', e=>{ exam.maxPoints = parseFloat(e.target.value)||20; renderTotals(); scheduleSave(); });

document.querySelectorAll('.tool-btn[data-type]').forEach(btn=>{
  btn.addEventListener('click', ()=> addQuestion(btn.dataset.type));
});
document.querySelectorAll('[data-obj]').forEach(btn=>{
  btn.addEventListener('mousedown', e => e.preventDefault());
  btn.addEventListener('click', ()=> openObjTool(btn.dataset.obj));
});
function openObjTool(kind){
  if(!ObjKinds[kind]){ toast(L('هذه الأداة قيد الإنجاز','This tool is coming soon','Outil bientôt disponible')); return; }
  startObjectTool(kind);
}

/* ================= Autosave (local) ================= */
let saveTimer=null;
function scheduleSave(){
  if(isReadonly) return;
  const dot=$('saveDot'), text=$('saveText');
  dot.classList.add('saving'); text.textContent=t('savingLocal');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(()=>{
    persistExam().then(()=>{ dot.classList.remove('saving'); text.textContent=t('savedLocal'); })
      .catch(()=>{ text.textContent=t('saveFailed'); });
  }, 500);
}

/* ================= Print / PDF / Word ================= */
function doPrint(){ deselectObject(); document.activeElement && document.activeElement.blur && document.activeElement.blur(); setTimeout(()=>window.print(), 50); }
$('printBtn').addEventListener('click', doPrint);
$('pdfBtn').addEventListener('click', ()=>{
  const m = openModal({ size:'small', icon:'📄', title:L('حفظ الامتحان PDF','Save as PDF','Enregistrer en PDF'),
    body:`<div class="pdf-help">
      <p>${L('ستفتح نافذة الطباعة. في خانة <b>الطابعة</b> اختر:','The print window will open. In <b>Destination</b> choose:','La fenêtre d’impression va s’ouvrir. Dans <b>Destination</b>, choisissez :')}</p>
      <div class="pdf-choice">📄 ${L('حفظ بتنسيق PDF','Save as PDF','Enregistrer au format PDF')}</div>
      <p>${L('ثم اضغط <b>حفظ</b>. المعادلات والرسومات تبقى واضحة جدًا عند التكبير.','Then press <b>Save</b>. Equations and drawings stay sharp at any zoom.','Puis cliquez sur <b>Enregistrer</b>.')}</p></div>`,
    footer:`<button class="big-btn ghost" data-close>${L('إلغاء','Cancel','Annuler')}</button><button class="big-btn primary" id="pdfGo">📄 ${L('متابعة','Continue','Continuer')}</button>` });
  m.foot.querySelector('#pdfGo').onclick = ()=>{ m.close(); doPrint(); };
});
$('wordBtn').addEventListener('click', ()=> exportWord(exam));

/* ================= Share (read-only link) ================= */
$('shareBtn').addEventListener('click', ()=>{
  const payload = { h: exam.header, q: exam.questions, o: exam.objects, tp: exam.tpl, mp: exam.maxPoints, l: lang };
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
      exam.objects = payload.o || {};
      if(payload.tp) exam.tpl = payload.tp;
      exam.maxPoints = payload.mp || 20;
      if(payload.l) lang = payload.l;
      normalizeExam(exam);
      isReadonly = true;
      document.body.classList.add('readonly');
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
  document.querySelectorAll('[data-l]').forEach(el=>{ const p = el.getAttribute('data-l').split('|'); el.textContent = L(p[0], p[1], p[2]); });
  document.querySelectorAll('[data-l-ph]').forEach(el=>{ const p = el.getAttribute('data-l-ph').split('|'); el.placeholder = L(p[0], p[1], p[2]); });
  updateCloudButtons();
  localStorage.setItem('examgen_lang', lang);
}
$('langToggle').addEventListener('click', ()=>{
  lang = LANG_ORDER[(LANG_ORDER.indexOf(lang) + 1) % LANG_ORDER.length];
  applyLanguage();
  refreshCurrentView();
});
function refreshCurrentView(){
  if(!$('editorView').classList.contains('hidden')) render();
  else if(!$('libraryView').classList.contains('hidden')) renderLibraryView && renderLibraryView();
  else if(!$('settingsView').classList.contains('hidden')) renderSettingsView && renderSettingsView();
  else if(!$('templatesView').classList.contains('hidden')) renderTemplatesView && renderTemplatesView();
  else renderListView();
  updateHero();
}

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
  const payload = { owner: currentUser.uid, header: exam.header, tpl: exam.tpl, questions: exam.questions, objects: exam.objects, maxPoints: exam.maxPoints, updatedAt: new Date().toISOString() };
  window.fbDb.collection('exams').doc(exam.id).set(JSON.parse(JSON.stringify(payload)), { merge:true })
    .then(()=>{ exam.savedToCloud = true; persistExam(); btnSpan.textContent = t('savedCloudBtn');
      setTimeout(()=>{ cloudSaveBusy=false; btnSpan.textContent = t('saveCloudBtn'); }, 2000); })
    .catch(()=>{ cloudSaveBusy=false; btnSpan.textContent = t('saveCloudBtn'); });
});
if(window.fbAuth){
  window.fbAuth.onAuthStateChanged(user=>{ currentUser = user; updateCloudButtons(); });
}

/* ================= Boot (called after all modules are loaded) ================= */
async function bootApp(){
  if(typeof loadSettings === 'function') await loadSettings();
  if(typeof getSettings === 'function' && getSettings().lang && !localStorage.getItem('examgen_lang')) lang = getSettings().lang;
  applyLanguage();
  if(tryLoadSharedFromHash()){
    applyLanguage();
    showEditor(); render();
    return;
  }
  try{ await Store.migrateLegacy(); }catch(e){ console.warn(e); }
  await loadAllExams();
  if(typeof initLibrary === 'function') await initLibrary();
  renderListView();
  updateHero();
  window.__egReady = true;
}
