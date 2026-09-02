/* =====================================================================
   مولّد مذكرة تحضير الدرس
===================================================================== */

/* ---------- i18n ---------- */
const STR = {
  ar: {
    title: 'مولّد مذكرة تحضير الدرس — د. سفيان مرابطي',
    back: 'رجوع إلى الأدوات',
    heroTitle: 'مولّد مذكرة تحضير الدرس',
    heroSub: 'اختر المستوى، عبّئ بيانات الدرس، وشاهد المذكرة تتكوّن أمامك جاهزة للطباعة أو التصدير.',
    sec_level: 'المستوى التعليمي',
    btn_load_preset: 'تحميل مراحل افتراضية لهذا المستوى',
    sec_header: 'الترويسة',
    f_school: 'المؤسسة', f_year: 'السنة الدراسية', f_subject: 'المادة',
    f_class: 'القسم', f_date: 'التاريخ', f_teacher: 'الأستاذ(ة)',
    sec_lesson: 'بيانات الدرس',
    f_title: 'عنوان الدرس', f_unit: 'الوحدة / المحور', f_session: 'رقم الحصة', f_duration: 'المدة الزمنية (د)',
    sec_objectives: 'الأهداف / الكفاءة المستهدفة',
    ph_add_objective: 'اكتب هدفًا واضغط إضافة',
    sec_materials: 'الوسائل التعليمية',
    ph_add_material: 'اكتب وسيلة واضغط إضافة',
    btn_add: 'إضافة',
    sec_stages: 'سير الدرس',
    btn_add_stage: '+ إضافة مرحلة',
    ph_stage_title: 'اسم المرحلة', ph_stage_time: 'الزمن',
    ph_teacher_act: 'نشاط الأستاذ', ph_student_act: 'نشاط التلميذ',
    sec_eval: 'التقويم / الواجب المنزلي',
    btn_pdf: 'تصدير PDF', btn_print: 'طباعة مباشرة', btn_clear: 'مسح كل البيانات',
    pm_unit: 'الوحدة:', pm_session: 'الحصة:', pm_duration: 'المدة:', pm_date: 'التاريخ:', pm_teacher: 'الأستاذ:',
    th_stage: 'المرحلة', th_time: 'الزمن', th_teacher_act: 'نشاط الأستاذ', th_student_act: 'نشاط التلميذ',
    footer: '© 2026 د. سفيان مرابطي',
    confirm_clear: 'سيتم مسح كل البيانات التي أدخلتها. متابعة؟',
    dash: '—', min_suffix: 'د',
    level_options: { 'ابتدائي': 'الابتدائي', 'متوسط': 'المتوسط', 'ثانوي': 'الثانوي' },
  },
  en: {
    title: 'Lesson Plan Generator — Dr. Sofiane Merabti',
    back: 'Back to tools',
    heroTitle: 'Lesson Plan Generator',
    heroSub: 'Choose the level, fill in the lesson details, and watch the plan take shape — ready to print or export.',
    sec_level: 'Education level',
    btn_load_preset: 'Load default stages for this level',
    sec_header: 'Header',
    f_school: 'School', f_year: 'School year', f_subject: 'Subject',
    f_class: 'Class', f_date: 'Date', f_teacher: 'Teacher',
    sec_lesson: 'Lesson details',
    f_title: 'Lesson title', f_unit: 'Unit', f_session: 'Session #', f_duration: 'Duration (min)',
    sec_objectives: 'Objectives / target competencies',
    ph_add_objective: 'Type an objective, then Add',
    sec_materials: 'Teaching materials',
    ph_add_material: 'Type a material, then Add',
    btn_add: 'Add',
    sec_stages: 'Lesson stages',
    btn_add_stage: '+ Add stage',
    ph_stage_title: 'Stage name', ph_stage_time: 'Time',
    ph_teacher_act: 'Teacher activity', ph_student_act: 'Student activity',
    sec_eval: 'Evaluation / homework',
    btn_pdf: 'Export PDF', btn_print: 'Print', btn_clear: 'Clear all data',
    pm_unit: 'Unit:', pm_session: 'Session:', pm_duration: 'Duration:', pm_date: 'Date:', pm_teacher: 'Teacher:',
    th_stage: 'Stage', th_time: 'Time', th_teacher_act: 'Teacher activity', th_student_act: 'Student activity',
    footer: '© 2026 Dr. Sofiane Merabti',
    confirm_clear: 'All entered data will be cleared. Continue?',
    dash: '—', min_suffix: 'min',
    level_options: { 'ابتدائي': 'Primary', 'متوسط': 'Middle', 'ثانوي': 'Secondary' },
  }
};
let lang = localStorage.getItem('site_lang') || 'ar';

/* ---------- level presets for "سير الدرس" ---------- */
const LEVEL_PRESETS = {
  'ابتدائي': [
    { title: 'التمهيد / الوضعية الانطلاقية', time: 5, teacher: '', student: '' },
    { title: 'بناء التعلمات', time: 20, teacher: '', student: '' },
    { title: 'التطبيق', time: 10, teacher: '', student: '' },
    { title: 'التقويم والتلخيص', time: 10, teacher: '', student: '' },
  ],
  'متوسط': [
    { title: 'الوضعية الانطلاقية', time: 5, teacher: '', student: '' },
    { title: 'بناء التعلمات (نشاط 1)', time: 15, teacher: '', student: '' },
    { title: 'بناء التعلمات (نشاط 2)', time: 15, teacher: '', student: '' },
    { title: 'استثمار المكتسبات', time: 10, teacher: '', student: '' },
    { title: 'التقويم', time: 5, teacher: '', student: '' },
  ],
  'ثانوي': [
    { title: 'وضعية الانطلاق', time: 5, teacher: '', student: '' },
    { title: 'بناء التعلمات', time: 25, teacher: '', student: '' },
    { title: 'التطبيق والتقويم', time: 10, teacher: '', student: '' },
    { title: 'التركيب / الخلاصة', time: 5, teacher: '', student: '' },
  ],
};

/* ---------- state ---------- */
const STORAGE_KEY = 'lesson_plan_state_v1';
let state = {
  level: 'ابتدائي',
  school: '', year: '', subject: '', klass: '', date: '', teacher: '',
  title: '', unit: '', session: '', duration: '',
  objectives: [],
  materials: [],
  stages: [],
  eval: '',
};

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw){
      const saved = JSON.parse(raw);
      state = Object.assign(state, saved);
    }
  } catch(e){ /* ignore corrupt storage */ }
  if (!state.stages || state.stages.length === 0){
    state.stages = LEVEL_PRESETS[state.level].map(s => ({...s}));
  }
}
function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ---------- element refs ---------- */
const el = (id) => document.getElementById(id);
const refs = {
  levelSelect: el('levelSelect'), loadPresetBtn: el('loadPresetBtn'),
  fSchool: el('fSchool'), fYear: el('fYear'), fSubject: el('fSubject'),
  fClass: el('fClass'), fDate: el('fDate'), fTeacher: el('fTeacher'),
  fTitle: el('fTitle'), fUnit: el('fUnit'), fSession: el('fSession'), fDuration: el('fDuration'),
  objectivesList: el('objectivesList'), objectiveInput: el('objectiveInput'), addObjectiveBtn: el('addObjectiveBtn'),
  materialsList: el('materialsList'), materialInput: el('materialInput'), addMaterialBtn: el('addMaterialBtn'),
  stagesList: el('stagesList'), addStageBtn: el('addStageBtn'),
  fEval: el('fEval'),
  exportPdfBtn: el('exportPdfBtn'), printBtn: el('printBtn'), clearBtn: el('clearBtn'),
  previewSheet: el('previewSheet'),
};

/* ---------- bind simple fields (state <-> input) ---------- */
const SIMPLE_FIELD_MAP = [
  ['fSchool','school'], ['fYear','year'], ['fSubject','subject'], ['fClass','klass'],
  ['fDate','date'], ['fTeacher','teacher'], ['fTitle','title'], ['fUnit','unit'],
  ['fSession','session'], ['fDuration','duration'], ['fEval','eval'],
];

function syncSimpleFields(){
  SIMPLE_FIELD_MAP.forEach(([refId, key]) => { refs[refId].value = state[key] || ''; });
  refs.levelSelect.value = state.level;
}

function bindSimpleFields(){
  SIMPLE_FIELD_MAP.forEach(([refId, key]) => {
    const node = refs[refId];
    node.addEventListener('input', () => {
      state[key] = node.value;
      saveState();
      renderPreview();
    });
  });
  refs.levelSelect.addEventListener('change', () => {
    state.level = refs.levelSelect.value;
    saveState();
    renderPreview();
  });
  refs.loadPresetBtn.addEventListener('click', () => {
    state.stages = LEVEL_PRESETS[state.level].map(s => ({...s}));
    saveState();
    renderStages();
    renderPreview();
  });
  syncSimpleFields();
}

/* ---------- chip lists (objectives / materials) ---------- */
function renderChipList(listEl, items, onRemove){
  listEl.innerHTML = '';
  items.forEach((text, idx) => {
    const chip = document.createElement('div');
    chip.className = 'chip';
    const span = document.createElement('span');
    span.textContent = text;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = '×';
    btn.addEventListener('click', () => onRemove(idx));
    chip.appendChild(span);
    chip.appendChild(btn);
    listEl.appendChild(chip);
  });
}

const chipRefreshers = {};

function bindChipInput(inputEl, addBtn, arrayKey, listEl){
  function refresh(){
    renderChipList(listEl, state[arrayKey], (idx) => {
      state[arrayKey].splice(idx, 1);
      saveState();
      refresh();
      renderPreview();
    });
  }
  chipRefreshers[arrayKey] = refresh;
  const add = () => {
    const val = inputEl.value.trim();
    if (!val) return;
    state[arrayKey].push(val);
    inputEl.value = '';
    saveState();
    refresh();
    renderPreview();
  };
  addBtn.addEventListener('click', add);
  inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter'){ e.preventDefault(); add(); } });
  refresh();
}

/* ---------- stages (سير الدرس) ---------- */
function renderStages(){
  refs.stagesList.innerHTML = '';
  const s = STR[lang];
  state.stages.forEach((stage, idx) => {
    const item = document.createElement('div');
    item.className = 'stage-item';

    const top = document.createElement('div');
    top.className = 'stage-row-top';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'field-input stage-title';
    titleInput.placeholder = s.ph_stage_title;
    titleInput.value = stage.title || '';
    titleInput.addEventListener('input', () => { stage.title = titleInput.value; saveState(); renderPreview(); });

    const timeInput = document.createElement('input');
    timeInput.type = 'number';
    timeInput.min = '0';
    timeInput.className = 'field-input stage-time';
    timeInput.placeholder = s.ph_stage_time;
    timeInput.value = stage.time || '';
    timeInput.addEventListener('input', () => { stage.time = timeInput.value; saveState(); renderPreview(); });

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'stage-remove';
    removeBtn.textContent = '✕';
    removeBtn.addEventListener('click', () => {
      state.stages.splice(idx, 1);
      saveState();
      renderStages();
      renderPreview();
    });

    top.appendChild(titleInput);
    top.appendChild(timeInput);
    top.appendChild(removeBtn);

    const grid = document.createElement('div');
    grid.className = 'stage-grid';

    const teacherArea = document.createElement('textarea');
    teacherArea.className = 'field-input';
    teacherArea.placeholder = s.ph_teacher_act;
    teacherArea.value = stage.teacher || '';
    teacherArea.addEventListener('input', () => { stage.teacher = teacherArea.value; saveState(); renderPreview(); });

    const studentArea = document.createElement('textarea');
    studentArea.className = 'field-input';
    studentArea.placeholder = s.ph_student_act;
    studentArea.value = stage.student || '';
    studentArea.addEventListener('input', () => { stage.student = studentArea.value; saveState(); renderPreview(); });

    grid.appendChild(teacherArea);
    grid.appendChild(studentArea);

    item.appendChild(top);
    item.appendChild(grid);
    refs.stagesList.appendChild(item);
  });
}

refs.addStageBtn.addEventListener('click', () => {
  state.stages.push({ title: '', time: '', teacher: '', student: '' });
  saveState();
  renderStages();
  renderPreview();
});

/* ---------- live preview ---------- */
function renderPreview(){
  const s = STR[lang];
  const dash = s.dash;

  el('pSchool').textContent = state.school || dash;
  el('pYear').textContent = state.year || dash;
  el('pSubject').textContent = state.subject || dash;
  el('pClass').textContent = state.klass || dash;
  el('pTitle').textContent = state.title || (lang === 'ar' ? 'عنوان الدرس' : 'Lesson title');
  el('pUnit').textContent = state.unit || dash;
  el('pSession').textContent = state.session || dash;
  el('pDuration').textContent = state.duration ? `${state.duration} ${s.min_suffix}` : dash;
  el('pDate').textContent = state.date || dash;
  el('pTeacher').textContent = state.teacher || dash;

  const objList = el('pObjectives');
  objList.innerHTML = '';
  state.objectives.forEach(o => {
    const li = document.createElement('li');
    li.textContent = o;
    objList.appendChild(li);
  });

  const matWrap = el('pMaterials');
  matWrap.innerHTML = '';
  state.materials.forEach(m => {
    const tag = document.createElement('span');
    tag.className = 'ps-tag';
    tag.textContent = m;
    matWrap.appendChild(tag);
  });

  const stagesBody = el('pStagesBody');
  stagesBody.innerHTML = '';
  state.stages.forEach(stage => {
    const tr = document.createElement('tr');
    const tdTitle = document.createElement('td');
    tdTitle.textContent = stage.title || dash;
    const tdTime = document.createElement('td');
    tdTime.className = 'time-cell';
    tdTime.textContent = stage.time ? `${stage.time} ${s.min_suffix}` : dash;
    const tdTeacher = document.createElement('td');
    tdTeacher.textContent = stage.teacher || dash;
    const tdStudent = document.createElement('td');
    tdStudent.textContent = stage.student || dash;
    tr.appendChild(tdTitle); tr.appendChild(tdTime); tr.appendChild(tdTeacher); tr.appendChild(tdStudent);
    stagesBody.appendChild(tr);
  });

  el('pEval').textContent = state.eval || dash;
}

/* ---------- export PDF ---------- */
refs.exportPdfBtn.addEventListener('click', async () => {
  const btn = refs.exportPdfBtn;
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = lang === 'ar' ? 'جارٍ التجهيز…' : 'Preparing…';
  try{
    const target = refs.previewSheet;
    const canvas = await html2canvas(target, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0){
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const fileName = (state.title ? state.title : (lang === 'ar' ? 'مذكرة-درس' : 'lesson-plan')).replace(/[\\/:*?"<>|]/g, '').trim() || 'lesson-plan';
    pdf.save(`${fileName}.pdf`);
  } catch(err){
    alert(lang === 'ar' ? 'تعذّر إنشاء ملف PDF، حاول مجددًا.' : 'Could not generate the PDF, please try again.');
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
});

/* ---------- print ---------- */
refs.printBtn.addEventListener('click', () => window.print());

/* ---------- clear all ---------- */
refs.clearBtn.addEventListener('click', () => {
  const s = STR[lang];
  if (!confirm(s.confirm_clear)) return;
  localStorage.removeItem(STORAGE_KEY);
  state = {
    level: 'ابتدائي',
    school: '', year: '', subject: '', klass: '', date: '', teacher: '',
    title: '', unit: '', session: '', duration: '',
    objectives: [], materials: [],
    stages: LEVEL_PRESETS['ابتدائي'].map(st => ({...st})),
    eval: '',
  };
  saveState();
  syncSimpleFields();
  renderStages();
  renderPreview();
  if (chipRefreshers.objectives) chipRefreshers.objectives();
  if (chipRefreshers.materials) chipRefreshers.materials();
});

/* ---------- language ---------- */
function applyLanguage(){
  const s = STR[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.title = s.title;
  el('backLabel').textContent = s.back;
  el('heroTitle').textContent = s.heroTitle;
  el('heroSub').textContent = s.heroSub;
  el('footerText').textContent = s.footer;

  document.querySelectorAll('[data-i18n]').forEach(node => {
    const key = node.getAttribute('data-i18n');
    if (s[key]) node.textContent = s[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(node => {
    const key = node.getAttribute('data-i18n-placeholder');
    if (s[key]) node.placeholder = s[key];
  });

  // خيارات المستوى
  Array.from(refs.levelSelect.options).forEach(opt => {
    opt.textContent = s.level_options[opt.value] || opt.value;
  });

  document.getElementById('langToggle').textContent = lang === 'ar' ? 'EN' : 'AR';
  localStorage.setItem('site_lang', lang);
  renderStages();
  renderPreview();
}

document.getElementById('langToggle').addEventListener('click', () => {
  lang = lang === 'ar' ? 'en' : 'ar';
  applyLanguage();
});

/* ---------- init ---------- */
(function init(){
  loadState();
  bindSimpleFields();
  renderStages();
  bindChipInput(refs.objectiveInput, refs.addObjectiveBtn, 'objectives', refs.objectivesList);
  bindChipInput(refs.materialInput, refs.addMaterialBtn, 'materials', refs.materialsList);
  applyLanguage();
})();
