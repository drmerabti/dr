/* =====================================================================
   مولّد الامتحانات بالذكاء الاصطناعي — AI Exam Generator (merabti.com)
   ===================================================================== */
'use strict';
(() => {

/* اجعلها false عندما تقرر فتح الأداة للجميع (وغيّر أيضًا EXAM_REQUIRE_ADMIN في الدالة) */
const TOOL_LOCKED = true;

const MAX_PAGES = 15;
const MIN_CHARS_PER_PAGE = 60;
const MAX_SOURCE = 12000;
const MAX_EX = 8;
const A4_W = 794;
const LIBS = {
  pdfjs: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  pdfWorker: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  h2c: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  jspdf: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  docx: 'https://cdn.jsdelivr.net/npm/html-docx-js@0.3.1/dist/html-docx.js'
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const uid = () => Math.random().toString(36).slice(2, 10);
const clone = o => JSON.parse(JSON.stringify(o));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const txt = s => esc(s).replace(/\n/g, '<br>');
const svgI = (d, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24">${d}</svg>`;

/* ---------------- UI texts ---------------- */
const UI = {
  ar: {
    app_title: 'مولّد الامتحانات الذكي', new: 'امتحان جديد', open: 'امتحاناتي المحفوظة', save: 'حفظ',
    print: 'طباعة', pdf: 'تحميل PDF', word: 'تحميل Word', tab_settings: 'الإعدادات', tab_preview: 'المعاينة',
    s1: 'الكتاب', drop_title: 'ارفع الدرس أو الكتاب بصيغة PDF', drop_sub: '15 صفحة كحد أقصى، مكتوب وليس ممسوحًا ضوئيًا',
    change_book: 'تغيير الملف', pages: 'صفحة', reading: 'جاري قراءة الملف…',
    s2: 'الوحدات', units_empty: 'ارفع الكتاب أولًا، وستظهر وحداته هنا تلقائيًا.', detecting: 'جاري اكتشاف الوحدات…',
    add_unit: 'إضافة وحدة', unit: 'الوحدة', from: 'من ص', to: 'إلى', whole_book: 'كل الكتاب',
    s3: 'معلومات الامتحان', school: 'المؤسسة', year: 'السنة الدراسية', stage: 'الطور', grade: 'السنة',
    subject: 'المادة', duration: 'المدة', teacher: 'الأستاذ(ة)', exam_title: 'عنوان الامتحان',
    exam_lang: 'لغة الامتحان', logo: 'الشعار (اختياري)', logo_add: 'إضافة شعار', remove: 'حذف',
    s4: 'التمارين', difficulty_all: 'صعوبة الامتحان', count: 'عدد التمارين', ex_n: 'التمرين', ex_unit: 'من',
    points_short: 'ن', total: 'المجموع', balance: 'توزيع تلقائي على 20', all_units: 'كل الوحدات المختارة',
    generate: 'ولّد الامتحان', generate_more: 'ولّد التمارين الجديدة', generating: 'جاري كتابة التمرين {i} من {n}…',
    easy: 'سهل', medium: 'متوسط', hard: 'صعب',
    d_easy: 'تذكّر وتطبيق مباشر', d_medium: 'فهم وتطبيق', d_hard: 'تحليل واستدلال',
    t_qcm: 'اختيار من متعدد (QCM)', t_tf: 'صح أو خطأ', t_fill: 'املأ الفراغ', t_match: 'صِل بين العمودين',
    t_direct: 'أسئلة مباشرة', t_problem: 'تمرين تطبيقي / مسألة', t_situation: 'وضعية إدماجية', t_document: 'تحليل وثيقة أو نص',
    st_pri: 'ابتدائي', st_mid: 'متوسط', st_sec: 'ثانوي',
    zoom_fit: 'ملاءمة العرض', show_corr: 'التصحيح النموذجي',
    empty_title: 'امتحانك سيظهر هنا', empty_sub: 'ارفع الدرس، اختر الوحدات وأنواع التمارين، ثم اضغط «ولّد الامتحان» وشاهد التمارين تُكتب أمامك.',
    e1: 'ارفع الكتاب', e2: 'اختر الوحدات', e3: 'اختر التمارين', e4: 'ولّد',
    writing: 'جاري كتابة التمرين…', waiting: 'في الانتظار…', retry: 'أعد المحاولة',
    regen: 'تمرين آخر', regen_title: 'توليد تمرين آخر', regen_go: 'ولّد تمرينًا جديدًا', note_ph: 'طلب اختياري: أسهل، أضف منحنى، ركّز على…',
    undo: 'تراجع', edit: 'تعديل', image: 'صورة', curve: 'منحنى', up: 'إلى الأعلى', down: 'إلى الأسفل', del: 'حذف التمرين',
    ed_title: 'تعديل التمرين', f_title: 'موضوع التمرين', f_ins: 'التعليمة', f_intro: 'النص أو السند', f_points: 'النقاط',
    f_text: 'النص', f_answer: 'الإجابة', f_corr: 'التصحيح أو التبرير', f_true: 'صحيحة', f_false: 'خاطئة',
    f_answers: 'إجابات الفراغات (افصل بينها بـ ؛)', f_left: 'العمود أ', f_right: 'العمود ب', f_opt: 'اقتراح',
    add_item: 'إضافة سؤال', images: 'الصور', graph: 'المنحنى', g_expr: 'الدالة بدلالة x، مثل x^2-2*x+1',
    g_from: 'x من', g_to: 'إلى', g_caption: 'تعليق المنحنى', g_hint: 'مسموح: + - * / ^ sin cos tan exp log sqrt abs pi',
    save_edit: 'حفظ التعديلات', cancel: 'إلغاء', close: 'إغلاق', insert: 'إدراج',
    img_title: 'إضافة صورة للتمرين', img_device: 'من جهازي', img_book: 'من صفحات الكتاب', crop_hint: 'اسحب لتحديد جزء من الصفحة، ثم اضغط «إدراج».',
    no_pdf_pages: 'صفحات الكتاب غير متوفرة في امتحان محفوظ، ارفع الكتاب من جديد لاستعمالها.',
    size: 'الحجم', saved_title: 'امتحاناتي المحفوظة', no_saved: 'لا توجد امتحانات محفوظة بعد.', open_it: 'فتح',
    saved_ok: 'تم حفظ الامتحان', loaded_ok: 'تم فتح الامتحان', deleted: 'تم الحذف',
    confirm: 'تأكيد', confirm_replace: 'سيتم استبدال كل التمارين الحالية بتمارين جديدة. هل تريد المتابعة؟',
    confirm_new: 'سيتم مسح الامتحان الحالي غير المحفوظ. هل تريد البدء من جديد؟', confirm_del: 'هل تريد حذف هذا الامتحان نهائيًا؟',
    err_pages: 'الملف يحتوي على {n} صفحة، والحد الأقصى 15 صفحة.', err_scanned: 'هذا الملف ممسوح ضوئيًا (صور). ارفع ملفًا مكتوبًا يمكن تحديد نصه.',
    err_pdf: 'تعذّرت قراءة الملف. تأكد أنه PDF سليم.', err_nobook: 'ارفع الكتاب أولًا.', err_nounits: 'اختر وحدة واحدة على الأقل.',
    err_short: 'نص الوحدة المختارة قصير جدًا لتوليد تمرين.', err_gen: 'تعذّر توليد التمرين.', err_net: 'تعذّر الاتصال، تحقق من الإنترنت.',
    err_limit: 'تم بلوغ حد الاستعمال مؤقتًا، انتظر دقيقة ثم أعد المحاولة.', err_perm: 'هذه الأداة غير متاحة لحسابك بعد.',
    err_export: 'تعذّر إنشاء الملف، أعد المحاولة.', err_empty: 'ولّد الامتحان أولًا.', err_save: 'تعذّر الحفظ.',
    err_big: 'الامتحان كبير جدًا للحفظ بسبب الصور. صغّر الصور أو احذف بعضها.', units_fail: 'لم نتمكن من اكتشاف الوحدات، يمكنك تحديدها يدويًا.',
    exporting: 'جاري تجهيز الملف…', pdf_ok: 'تم تحميل ملف PDF', word_ok: 'تم تحميل ملف Word',
    gate_check: 'جاري التحقق…', gate_login: 'سجّل الدخول أولًا', gate_login_t: 'هذه الأداة تتطلب تسجيل الدخول من الصفحة الرئيسية للموقع.',
    gate_login_b: 'الذهاب إلى الصفحة الرئيسية', gate_soon: 'قريبًا ✨', gate_soon_t: 'نعمل على تجهيز هذه الأداة بعناية، وستكون متاحة قريبًا.',
    gate_err: 'تعذّر تحميل الأداة، أعد تحميل الصفحة.', in_exam: 'التصحيح ضمن التصدير'
  },
  en: {
    app_title: 'Smart Exam Generator', new: 'New exam', open: 'My saved exams', save: 'Save',
    print: 'Print', pdf: 'Download PDF', word: 'Download Word', tab_settings: 'Settings', tab_preview: 'Preview',
    s1: 'Book', drop_title: 'Upload the lesson or book as PDF', drop_sub: 'Up to 15 pages, typed text (not scanned)',
    change_book: 'Change file', pages: 'pages', reading: 'Reading the file…',
    s2: 'Units', units_empty: 'Upload the book first; its units will appear here automatically.', detecting: 'Detecting units…',
    add_unit: 'Add unit', unit: 'Unit', from: 'p.', to: 'to', whole_book: 'Whole book',
    s3: 'Exam details', school: 'School', year: 'School year', stage: 'Stage', grade: 'Year',
    subject: 'Subject', duration: 'Duration', teacher: 'Teacher', exam_title: 'Exam title',
    exam_lang: 'Exam language', logo: 'Logo (optional)', logo_add: 'Add logo', remove: 'Remove',
    s4: 'Exercises', difficulty_all: 'Exam difficulty', count: 'Exercises', ex_n: 'Exercise', ex_unit: 'From',
    points_short: 'pts', total: 'Total', balance: 'Split 20 points evenly', all_units: 'All selected units',
    generate: 'Generate exam', generate_more: 'Generate new exercises', generating: 'Writing exercise {i} of {n}…',
    easy: 'Easy', medium: 'Medium', hard: 'Hard',
    d_easy: 'Recall and direct use', d_medium: 'Understanding and application', d_hard: 'Analysis and reasoning',
    t_qcm: 'Multiple choice (QCM)', t_tf: 'True or false', t_fill: 'Fill in the blanks', t_match: 'Match the columns',
    t_direct: 'Direct questions', t_problem: 'Applied exercise / problem', t_situation: 'Integration situation', t_document: 'Document or text analysis',
    st_pri: 'Primary', st_mid: 'Middle', st_sec: 'Secondary',
    zoom_fit: 'Fit width', show_corr: 'Answer key',
    empty_title: 'Your exam will appear here', empty_sub: 'Upload the lesson, choose units and exercise types, then press “Generate exam” and watch the exercises being written.',
    e1: 'Upload', e2: 'Units', e3: 'Exercises', e4: 'Generate',
    writing: 'Writing the exercise…', waiting: 'Waiting…', retry: 'Try again',
    regen: 'Another exercise', regen_title: 'Generate another exercise', regen_go: 'Generate a new exercise', note_ph: 'Optional request: easier, add a curve, focus on…',
    undo: 'Undo', edit: 'Edit', image: 'Image', curve: 'Curve', up: 'Move up', down: 'Move down', del: 'Delete exercise',
    ed_title: 'Edit exercise', f_title: 'Topic', f_ins: 'Instruction', f_intro: 'Text or context', f_points: 'Points',
    f_text: 'Text', f_answer: 'Answer', f_corr: 'Correction or justification', f_true: 'True', f_false: 'False',
    f_answers: 'Blank answers (separate with ;)', f_left: 'Column A', f_right: 'Column B', f_opt: 'Option',
    add_item: 'Add question', images: 'Images', graph: 'Curve', g_expr: 'Function of x, e.g. x^2-2*x+1',
    g_from: 'x from', g_to: 'to', g_caption: 'Caption', g_hint: 'Allowed: + - * / ^ sin cos tan exp log sqrt abs pi',
    save_edit: 'Save changes', cancel: 'Cancel', close: 'Close', insert: 'Insert',
    img_title: 'Add an image', img_device: 'From my device', img_book: 'From the book pages', crop_hint: 'Drag to select part of the page, then press “Insert”.',
    no_pdf_pages: 'Book pages are not available for a saved exam; upload the book again to use them.',
    size: 'Size', saved_title: 'My saved exams', no_saved: 'No saved exams yet.', open_it: 'Open',
    saved_ok: 'Exam saved', loaded_ok: 'Exam opened', deleted: 'Deleted',
    confirm: 'Confirm', confirm_replace: 'All current exercises will be replaced with new ones. Continue?',
    confirm_new: 'The current unsaved exam will be cleared. Start over?', confirm_del: 'Delete this exam permanently?',
    err_pages: 'The file has {n} pages; the limit is 15.', err_scanned: 'This file is scanned (images). Upload a typed file whose text can be selected.',
    err_pdf: 'Could not read the file. Make sure it is a valid PDF.', err_nobook: 'Upload the book first.', err_nounits: 'Select at least one unit.',
    err_short: 'The selected unit text is too short to build an exercise.', err_gen: 'Could not generate the exercise.', err_net: 'Connection failed, check your internet.',
    err_limit: 'Usage limit reached for now; wait a minute and try again.', err_perm: 'This tool is not available for your account yet.',
    err_export: 'Could not create the file, try again.', err_empty: 'Generate the exam first.', err_save: 'Saving failed.',
    err_big: 'The exam is too large to save because of its images. Make them smaller or remove some.', units_fail: 'Could not detect the units; you can set them manually.',
    exporting: 'Preparing the file…', pdf_ok: 'PDF downloaded', word_ok: 'Word file downloaded',
    gate_check: 'Checking…', gate_login: 'Please sign in', gate_login_t: 'This tool requires signing in from the site home page.',
    gate_login_b: 'Go to the home page', gate_soon: 'Coming soon ✨', gate_soon_t: 'We are carefully preparing this tool; it will be available soon.',
    gate_err: 'The tool could not load; reload the page.', in_exam: 'Answer key in exports'
  }
};

/* ---------------- Exam-paper texts (exam language) ---------------- */
const ORD_AR = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن'];
const ORD_AR_F = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة'];
const fmtNum = n => (Math.round(n * 100) / 100).toString();
const EL = {
  ar: {
    dir: 'rtl', school: 'المؤسسة', year: 'السنة الدراسية', level: 'المستوى', subject: 'المادة', duration: 'المدة', teacher: 'الأستاذ(ة)',
    ex: i => `التمرين ${ORD_AR[i] || (i + 1)}`, situation: 'الوضعية الإدماجية',
    pts: n => n === 1 ? '(نقطة واحدة)' : n === 2 ? '(نقطتان)' : (Number.isInteger(n) && n >= 3 && n <= 10) ? `(${n} نقاط)` : `(${fmtNum(n)} ن)`,
    ptsCell: n => `${fmtNum(n)} ن`,
    tru: 'صحيحة', fal: 'خاطئة', statement: 'العبارة', colA: 'العمود (أ)', colB: 'العمود (ب)', letters: ['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح'],
    doc: 'السند', corr: 'التصحيح النموذجي وسلّم التنقيط', q: 'السؤال', ans: 'الإجابة', mark: 'العلامة',
    total: 'المجموع', luck: 'بالتوفيق', page: (a, b) => `الصفحة ${a} من ${b}`, cpage: (a, b) => `التصحيح — ${a} / ${b}`,
    level_of: (st, g) => `السنة ${({ pri: ORD_AR_F, mid: ORD_AR_F, sec: ORD_AR_F }[st][g - 1] || g)} ${({ pri: 'ابتدائي', mid: 'متوسط', sec: 'ثانوي' })[st]}`
  },
  fr: {
    dir: 'ltr', school: 'Établissement', year: 'Année scolaire', level: 'Niveau', subject: 'Matière', duration: 'Durée', teacher: 'Enseignant(e)',
    ex: i => `Exercice ${i + 1}`, situation: "Situation d'intégration",
    pts: n => `(${fmtNum(n)} pt${n > 1 ? 's' : ''})`, ptsCell: n => `${fmtNum(n)} pt${n > 1 ? 's' : ''}`,
    tru: 'Vrai', fal: 'Faux', statement: 'Affirmation', colA: 'Colonne A', colB: 'Colonne B', letters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
    doc: 'Document', corr: 'Corrigé type et barème', q: 'Question', ans: 'Réponse', mark: 'Note',
    total: 'Total', luck: 'Bon courage', page: (a, b) => `Page ${a} / ${b}`, cpage: (a, b) => `Corrigé — ${a} / ${b}`,
    level_of: (st, g) => `${g}${g === 1 ? 're' : 'e'} année ${({ pri: 'primaire', mid: 'moyenne', sec: 'secondaire' })[st]}`
  },
  en: {
    dir: 'ltr', school: 'School', year: 'School year', level: 'Level', subject: 'Subject', duration: 'Duration', teacher: 'Teacher',
    ex: i => `Exercise ${i + 1}`, situation: 'Integration situation',
    pts: n => `(${fmtNum(n)} point${n === 1 ? '' : 's'})`, ptsCell: n => `${fmtNum(n)} pt${n === 1 ? '' : 's'}`,
    tru: 'True', fal: 'False', statement: 'Statement', colA: 'Column A', colB: 'Column B', letters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
    doc: 'Document', corr: 'Answer key and marking scheme', q: 'Question', ans: 'Answer', mark: 'Mark',
    total: 'Total', luck: 'Good luck', page: (a, b) => `Page ${a} of ${b}`, cpage: (a, b) => `Answer key — ${a} / ${b}`,
    level_of: (st, g) => `Year ${g} — ${({ pri: 'Primary', mid: 'Middle school', sec: 'Secondary' })[st]}`
  }
};
const DEFAULTS = {
  ar: { title: 'اختبار الفصل الأول', duration: 'ساعة واحدة', titles: ['فرض الفصل الأول', 'اختبار الفصل الأول', 'اختبار الفصل الثاني', 'اختبار الفصل الثالث', 'امتحان تجريبي'], durations: ['ساعة واحدة', 'ساعة ونصف', 'ساعتان', '3 ساعات'], subjects: ['الرياضيات', 'العلوم الفيزيائية والتكنولوجيا', 'علوم الطبيعة والحياة', 'اللغة العربية', 'التاريخ والجغرافيا', 'التربية الإسلامية', 'التربية المدنية', 'الإعلام الآلي', 'التكنولوجيا', 'الفلسفة'] },
  fr: { title: 'Composition du premier trimestre', duration: '1 heure', titles: ['Devoir du premier trimestre', 'Composition du premier trimestre', 'Composition du deuxième trimestre', 'Examen blanc'], durations: ['1 heure', '1 h 30', '2 heures', '3 heures'], subjects: ['Mathématiques', 'Physique-chimie', 'Sciences naturelles', 'Français', 'Informatique'] },
  en: { title: 'First term exam', duration: '1 hour', titles: ['First term test', 'First term exam', 'Second term exam', 'Mock exam'], durations: ['1 hour', '1.5 hours', '2 hours', '3 hours'], subjects: ['Mathematics', 'Physics', 'Natural sciences', 'English', 'Computer science'] }
};

/* ---------------- Exercise types ---------------- */
const TYPES = {
  qcm: { c: 'var(--t-qcm)', i: '<circle cx="6" cy="6.5" r="2"/><path d="M11 6.5h9"/><circle cx="6" cy="12" r="2" fill="currentColor"/><path d="M11 12h9"/><circle cx="6" cy="17.5" r="2"/><path d="M11 17.5h9"/>' },
  tf: { c: 'var(--t-tf)', i: '<path d="M3.5 12.5l3 3 5.5-7"/><path d="M14.5 8.5l6 6M20.5 8.5l-6 6"/>' },
  fill: { c: 'var(--t-fill)', i: '<path d="M3 7h6"/><path d="M12 7h9" stroke-dasharray="2.2 2.2"/><path d="M3 12h5" stroke-dasharray="2.2 2.2"/><path d="M11 12h10"/><path d="M3 17h11"/>' },
  match: { c: 'var(--t-match)', i: '<circle cx="5" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6.8l10 10.4M7 17.2L17 6.8"/>' },
  direct: { c: 'var(--t-direct)', i: '<path d="M4 5h16v11H10l-5 4v-4H4z"/><path d="M10 9.2a2 2 0 1 1 2.9 1.8c-.6.3-.9.7-.9 1.2"/><path d="M12 14.3h.01"/>' },
  problem: { c: 'var(--t-problem)', i: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8.5 7.5h7"/><path d="M8.5 12h1M11.5 12h1M14.5 12h1M8.5 16h1M11.5 16h1M14.5 16h1"/>' },
  situation: { c: 'var(--t-situation)', i: '<path d="M9 4h6v3.5a2 2 0 1 0 0 4V15h-3.5a2 2 0 1 1-4 0H4V9.5h3.5a2 2 0 1 0 0-4H9z"/><path d="M15 15h5v5h-5z"/>' },
  document: { c: 'var(--t-document)', i: '<path d="M6 3h8.5L19 7.5V21H6z"/><path d="M14 3v5h5"/><path d="M9 12.5h7M9 15.5h7M9 18.5h4"/>' }
};
const TYPE_KEYS = Object.keys(TYPES);
const DIFFS = { easy: '#16A34A', medium: '#E08A00', hard: '#DC2626' };

/* ---------------- State ---------------- */
const S = {
  uiLang: (() => { try { return localStorage.getItem('site_lang') === 'en' ? 'en' : 'ar'; } catch (e) { return 'ar'; } })(),
  user: null,
  book: null,           // { name, pages:[text] }
  pdf: null,            // pdf.js document (not saved)
  units: [],            // { id, title, from, to, on }
  header: { school: '', title: '', year: '2026/2027', stage: 'mid', grade: 4, subject: '', duration: '', teacher: '', logo: '' },
  examLang: 'ar',
  difficulty: 'medium',
  rows: [],             // { type, unit, diff, points }
  exercises: [],        // { id, type, diff, unit, points, data, history, images, status, err, perm }
  showCorr: true,
  zoom: 1, zoomAuto: true,
  examId: null, dirty: false, busy: false, detecting: false
};
const T = (k, vars) => {
  let s = (UI[S.uiLang] && UI[S.uiLang][k]) || UI.ar[k] || k;
  if (vars) for (const v in vars) s = s.replace(`{${v}}`, vars[v]);
  return s;
};
const tLabel = t => T('t_' + t);
const L = () => EL[S.examLang] || EL.ar;

/* ---------------- Small helpers ---------------- */
function loadScript(src) {
  loadScript.p = loadScript.p || {};
  if (loadScript.p[src]) return loadScript.p[src];
  return (loadScript.p[src] = new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.onload = res;
    s.onerror = () => { delete loadScript.p[src]; rej(new Error('load ' + src)); };
    document.head.appendChild(s);
  }));
}
let toastTimer;
function toast(msg, kind = '') {
  const el = $('#toast');
  el.textContent = msg; el.className = 'toast show ' + kind;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.className = 'toast'; }, 3200);
}
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
function markDirty() { S.dirty = true; }
function splitPoints(total, n) {
  if (n <= 0) return [];
  const base = Math.floor((total / n) * 4) / 4;
  const out = Array(n).fill(base);
  out[n - 1] = Math.round((total - base * (n - 1)) * 100) / 100;
  return out;
}
function seededPerm(n, seed) {
  let h = 0; for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const a = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) { h = (h * 1103515245 + 12345) >>> 0; const j = h % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  if (n > 2 && a.every((v, i) => v === i)) a.push(a.shift());
  return a;
}
async function compressImage(file, maxW, q = 0.85) {
  const url = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); });
  return compressDataUrl(url, maxW, q);
}
function compressDataUrl(url, maxW, q = 0.85, png = false) {
  return new Promise(res => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, maxW / img.naturalWidth);
      const c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
      const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
      res({ src: c.toDataURL(png ? 'image/png' : 'image/jpeg', q), ratio: c.height / c.width });
    };
    img.onerror = () => res({ src: url, ratio: 0.75 });
    img.src = url;
  });
}

/* =====================================================================
   Dropdown (list with big icons)
   ===================================================================== */
const DD = [];
let menuEl = null, menuCleanup = null;
const CHEV = '<svg class="dd-chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>';
function optHtml(o, desc = false) {
  const ic = o.icon ? `<span class="dd-ic" style="--c:${o.color}">${svgI(o.icon)}</span>` : (o.dot ? `<span class="dd-dot" style="--c:${o.dot}"></span>` : '');
  return `${ic}<span class="dd-l">${esc(o.label)}${desc && o.desc ? `<span class="dd-desc">${esc(o.desc)}</span>` : ''}</span>`;
}
function makeDD(host, getOpts, value, onChange) {
  host.innerHTML = ''; host.classList.add('dd');
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'dd-btn'; btn.setAttribute('aria-haspopup', 'listbox');
  host.appendChild(btn);
  const api = {
    value, host,
    paint() { const opts = getOpts(); const o = opts.find(x => x.v === api.value) || opts[0]; if (o) btn.innerHTML = optHtml(o) + CHEV; },
    set(v) { api.value = v; api.paint(); }
  };
  btn.addEventListener('click', e => {
    e.stopPropagation();
    if (menuEl && menuEl._owner === api) { closeMenu(); return; }
    openMenu(btn, getOpts(), api.value, v => { api.value = v; api.paint(); onChange(v); }, api);
  });
  api.paint(); DD.push(api);
  return api;
}
function openMenu(anchor, opts, cur, pick, owner) {
  closeMenu();
  const m = document.createElement('div');
  m.className = 'dd-menu'; m.setAttribute('role', 'listbox'); m._owner = owner;
  m.style.direction = S.uiLang === 'en' ? 'ltr' : 'rtl';
  opts.forEach(o => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'dd-opt' + (o.v === cur ? ' on' : ''); b.setAttribute('role', 'option');
    b.innerHTML = optHtml(o, true);
    b.addEventListener('click', () => { closeMenu(); pick(o.v); });
    m.appendChild(b);
  });
  document.body.appendChild(m);
  const r = anchor.getBoundingClientRect();
  const w = Math.max(r.width, 250);
  m.style.width = w + 'px';
  let left = S.uiLang === 'en' ? r.left : r.right - w;
  left = Math.max(8, Math.min(left, innerWidth - w - 8));
  m.style.left = left + 'px';
  const h = m.offsetHeight;
  m.style.top = (r.bottom + 6 + h > innerHeight - 8 ? Math.max(8, r.top - h - 6) : r.bottom + 6) + 'px';
  menuEl = m;
  const onDown = e => { if (!m.contains(e.target) && !anchor.contains(e.target)) closeMenu(); };
  const onKey = e => {
    const items = $$('.dd-opt', m); const i = items.indexOf(document.activeElement);
    if (e.key === 'Escape') { closeMenu(); anchor.focus(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); items[Math.min(items.length - 1, i + 1)].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[Math.max(0, i - 1)].focus(); }
  };
  const onScroll = e => { if (!m.contains(e.target)) closeMenu(); };
  setTimeout(() => {
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    document.addEventListener('scroll', onScroll, true);
  }, 0);
  menuCleanup = () => {
    document.removeEventListener('pointerdown', onDown);
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('scroll', onScroll, true);
  };
  (m.querySelector('.on') || m.firstChild).focus({ preventScroll: true });
}
function closeMenu() { if (menuEl) { menuEl.remove(); menuEl = null; } if (menuCleanup) { menuCleanup(); menuCleanup = null; } }

const typeOpts = () => TYPE_KEYS.map(k => ({ v: k, label: tLabel(k), icon: TYPES[k].i, color: TYPES[k].c }));
const diffOpts = () => Object.keys(DIFFS).map(k => ({ v: k, label: T(k), desc: T('d_' + k), dot: DIFFS[k] }));
const unitOpts = () => [{ v: 'all', label: T('all_units'), dot: 'var(--accent)' }]
  .concat(S.units.filter(u => u.on).map(u => ({ v: u.id, label: u.title, desc: `${T('from')} ${u.from}–${u.to}`, dot: '#A9C2D3' })));

/* =====================================================================
   Curves (safe expression → SVG)
   ===================================================================== */
function compileExpr(expr) {
  let s = String(expr || '').toLowerCase().replace(/\s+/g, '').replace(/×/g, '*').replace(/,/g, '.').replace(/−/g, '-');
  if (!s || s.length > 120) return null;
  s = s.replace(/\bln\b/g, 'log');
  const words = s.match(/[a-z]+/g) || [];
  const ok = ['x', 'sin', 'cos', 'tan', 'exp', 'log', 'sqrt', 'abs', 'pi', 'e'];
  if (words.some(w => !ok.includes(w))) return null;
  if (/[^0-9x+\-*/^().a-z]/.test(s)) return null;
  s = s.replace(/(\d)(x|\()/g, '$1*$2').replace(/\)(x|\d|\()/g, ')*$1').replace(/x(\d|\()/g, 'x*$1');
  s = s.replace(/\^/g, '**').replace(/\bpi\b/g, 'PI').replace(/\be\b/g, 'E');
  try {
    // eslint-disable-next-line no-new-func
    const f = new Function('x', `const {sin,cos,tan,exp,log,sqrt,abs,PI,E}=Math;return (${s});`);
    f(1);
    return f;
  } catch (e) { return null; }
}
function niceStep(range) {
  const raw = range / 8, p = Math.pow(10, Math.floor(Math.log10(raw))), n = raw / p;
  return (n < 1.5 ? 1 : n < 3.5 ? 2 : n < 7.5 ? 5 : 10) * p;
}
function graphSvg(g) {
  const f = compileExpr(g && g.expr);
  if (!f) return '';
  let x0 = Number(g.xmin), x1 = Number(g.xmax);
  if (!isFinite(x0) || !isFinite(x1) || x1 <= x0) { x0 = -5; x1 = 5; }
  const N = 400, pts = [];
  for (let i = 0; i <= N; i++) { const x = x0 + (x1 - x0) * i / N; let y; try { y = f(x); } catch (e) { y = NaN; } pts.push([x, isFinite(y) ? y : NaN]); }
  const ys = pts.map(p => p[1]).filter(isFinite).sort((a, b) => a - b);
  if (!ys.length) return '';
  let y0 = ys[Math.floor(ys.length * 0.02)], y1 = ys[Math.ceil(ys.length * 0.98) - 1];
  if (Math.abs(y1 - y0) < 1e-9) { y0 -= 1; y1 += 1; }
  const pad = (y1 - y0) * 0.1; y0 -= pad; y1 += pad;
  if (y0 > 0) y0 = Math.min(0, y0 - pad); if (y1 < 0) y1 = Math.max(0, y1 + pad);
  const W = 460, H = 280, m = { l: 34, r: 16, t: 14, b: 26 };
  const X = x => m.l + (x - x0) / (x1 - x0) * (W - m.l - m.r);
  const Y = y => m.t + (y1 - y) / (y1 - y0) * (H - m.t - m.b);
  const sx = niceStep(x1 - x0), sy = niceStep(y1 - y0);
  let grid = '', labels = '';
  for (let v = Math.ceil(x0 / sx) * sx; v <= x1 + 1e-9; v += sx) {
    const px = X(v).toFixed(1);
    grid += `<line x1="${px}" y1="${m.t}" x2="${px}" y2="${H - m.b}"/>`;
    if (Math.abs(v) > 1e-9) labels += `<text x="${px}" y="${Math.min(H - m.b + 16, Math.max(m.t + 12, Y(0) + 15)).toFixed(1)}" text-anchor="middle">${fmtNum(v)}</text>`;
  }
  for (let v = Math.ceil(y0 / sy) * sy; v <= y1 + 1e-9; v += sy) {
    const py = Y(v).toFixed(1);
    grid += `<line x1="${m.l}" y1="${py}" x2="${W - m.r}" y2="${py}"/>`;
    if (Math.abs(v) > 1e-9) labels += `<text x="${Math.max(m.l - 4, Math.min(W - m.r - 4, X(0) - 5)).toFixed(1)}" y="${(+py + 4).toFixed(1)}" text-anchor="end">${fmtNum(v)}</text>`;
  }
  let d = '', pen = false;
  const yLim = (y1 - y0) * 3;
  for (const [x, y] of pts) {
    if (!isFinite(y) || y > y1 + yLim || y < y0 - yLim) { pen = false; continue; }
    d += (pen ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(Math.max(y0 - yLim, Math.min(y1 + yLim, y))).toFixed(1);
    pen = true;
  }
  const ax = (x0 <= 0 && x1 >= 0) ? X(0) : m.l, ay = (y0 <= 0 && y1 >= 0) ? Y(0) : H - m.b;
  const cid = 'c' + uid();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Times New Roman,serif" font-size="11" direction="ltr">
<defs><clipPath id="${cid}"><rect x="${m.l}" y="${m.t}" width="${W - m.l - m.r}" height="${H - m.t - m.b}"/></clipPath>
<marker id="${cid}a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#222"/></marker></defs>
<rect width="${W}" height="${H}" fill="#fff"/>
<g stroke="#D9DEE3" stroke-width="0.8">${grid}</g>
<line x1="${m.l}" y1="${ay.toFixed(1)}" x2="${W - m.r + 4}" y2="${ay.toFixed(1)}" stroke="#222" stroke-width="1.2" marker-end="url(#${cid}a)"/>
<line x1="${ax.toFixed(1)}" y1="${H - m.b}" x2="${ax.toFixed(1)}" y2="${m.t - 6}" stroke="#222" stroke-width="1.2" marker-end="url(#${cid}a)"/>
<g fill="#333">${labels}<text x="${(ax - 5).toFixed(1)}" y="${(ay + 14).toFixed(1)}" text-anchor="end">0</text></g>
<text x="${W - m.r}" y="${(ay - 6).toFixed(1)}" text-anchor="end" font-style="italic" font-size="13">${esc(g.xlabel || 'x')}</text>
<text x="${(ax + 6).toFixed(1)}" y="${m.t + 4}" font-style="italic" font-size="13">${esc(g.ylabel || 'y')}</text>
<path d="${d}" fill="none" stroke="#1D4ED8" stroke-width="2.1" stroke-linejoin="round" clip-path="url(#${cid})"/>
</svg>`;
}

/* =====================================================================
   i18n on the static UI
   ===================================================================== */
function applyUI() {
  document.documentElement.lang = S.uiLang;
  $$('[data-t]').forEach(el => { el.textContent = T(el.dataset.t); });
  $$('[data-tip]').forEach(el => { el.dataset.tipText = T(el.dataset.tip); el.setAttribute('aria-label', T(el.dataset.tip)); });
  $('#langBtn').textContent = S.uiLang === 'ar' ? 'EN' : 'ع';
  document.title = `${T('app_title')} — Merabti Academy`;
  DD.forEach(d => d.paint());
  renderBookInfo(); renderUnits(); renderRows(); updateGenBtn();
  if (!S.exercises.length) renderPaper();
}
function fillDatalists() {
  const D = DEFAULTS[S.examLang];
  $('#dlSubjects').innerHTML = D.subjects.map(s => `<option value="${esc(s)}">`).join('');
  $('#dlTitles').innerHTML = D.titles.map(s => `<option value="${esc(s)}">`).join('');
  $('#dlDurations').innerHTML = D.durations.map(s => `<option value="${esc(s)}">`).join('');
}

/* =====================================================================
   Access gate
   ===================================================================== */
function gate(state) {
  const g = $('#gate');
  S.gateState = state;
  if (state === 'open') { g.classList.add('hidden'); return; }
  g.classList.remove('hidden');
  $('#gateSpin').classList.toggle('hidden', state !== 'check');
  const map = { check: ['', T('gate_check')], login: [T('gate_login'), T('gate_login_t')], soon: [T('gate_soon'), T('gate_soon_t')], error: ['', T('gate_err')] };
  $('#gateTitle').textContent = map[state][0];
  $('#gateText').textContent = map[state][1];
  const b = $('#gateBtn');
  b.classList.toggle('hidden', !(state === 'login' || state === 'soon'));
  b.textContent = T('gate_login_b');
}
function startGate() {
  gate('check');
  if (!window.firebase || !firebase.apps || !firebase.apps.length) { gate('error'); return; }
  firebase.auth().onAuthStateChanged(async user => {
    if (!user) { S.user = null; gate('login'); return; }
    let isAdmin = false;
    try {
      const d = await firebase.firestore().collection('users').doc(user.uid).get();
      isAdmin = d.exists && d.data().isAdmin === true;
    } catch (e) { isAdmin = false; }
    if (TOOL_LOCKED && !isAdmin) { gate('soon'); return; }
    S.user = user; gate('open'); fitZoom();
  });
}
function callApi(payload) {
  const fn = firebase.app().functions('us-central1').httpsCallable('generateExam', { timeout: 150000 });
  return fn(payload).then(r => r.data);
}
function apiError(e) {
  const code = (e && e.code) || '';
  if (code.includes('resource-exhausted')) return T('err_limit');
  if (code.includes('permission-denied')) return T('err_perm');
  if (code.includes('unauthenticated')) return T('gate_login');
  if (code.includes('unavailable') || code.includes('deadline')) return T('err_net');
  return (e && e.message && S.uiLang === 'ar' && /[\u0600-\u06FF]/.test(e.message)) ? e.message : T('err_gen');
}

/* =====================================================================
   Step 1 — book
   ===================================================================== */
async function handleBook(file) {
  if (!file) return;
  if (!/pdf$/i.test(file.type) && !/\.pdf$/i.test(file.name)) { toast(T('err_pdf'), 'err'); return; }
  const info = $('#bookInfo');
  info.classList.remove('hidden');
  info.innerHTML = `<div class="detecting"><div class="spin"></div>${esc(T('reading'))}</div>`;
  try {
    await loadScript(LIBS.pdfjs);
    pdfjsLib.GlobalWorkerOptions.workerSrc = LIBS.pdfWorker;
    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    if (pdf.numPages > MAX_PAGES) { info.classList.add('hidden'); toast(T('err_pages', { n: pdf.numPages }), 'err'); renderBookInfo(); return; }
    const pages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const pg = await pdf.getPage(i);
      const tc = await pg.getTextContent();
      let s = '';
      for (const it of tc.items) { s += it.str; s += it.hasEOL ? '\n' : ' '; }
      pages.push(s.replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim());
    }
    const chars = pages.reduce((a, p) => a + p.replace(/\s/g, '').length, 0);
    if (chars / pages.length < MIN_CHARS_PER_PAGE) { toast(T('err_scanned'), 'err'); renderBookInfo(); return; }
    S.pdf = pdf; S.book = { name: file.name, pages };
    markDirty();
    renderBookInfo();
    detectUnits();
  } catch (e) {
    console.error(e); toast(T('err_pdf'), 'err'); renderBookInfo();
  }
}
function renderBookInfo() {
  const info = $('#bookInfo'), drop = $('#drop');
  if (!S.book) { info.classList.add('hidden'); drop.classList.remove('compact'); $('.drop-t', drop).textContent = T('drop_title'); return; }
  drop.classList.add('compact');
  $('.drop-t', drop).textContent = T('change_book');
  info.classList.remove('hidden');
  info.innerHTML = `<div class="book-name">${svgI('<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>', 'dd-chev')}<span>${esc(S.book.name)}</span><span class="pill">${S.book.pages.length} ${esc(T('pages'))}</span></div><div class="thumbs" id="thumbs"></div>`;
  if (S.pdf) renderThumbs($('#thumbs'), 0.22);
}
async function renderThumbs(host, scale, onPick) {
  const pdf = S.pdf; if (!pdf) return [];
  const out = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    if (pdf !== S.pdf) return out;
    const pg = await pdf.getPage(i);
    const vp = pg.getViewport({ scale });
    const c = document.createElement('canvas');
    c.width = vp.width; c.height = vp.height; c.title = `${i}`;
    host.appendChild(c); out.push(c);
    if (onPick) c.addEventListener('click', () => onPick(i, c));
    await pg.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
  }
  return out;
}

/* =====================================================================
   Step 2 — units
   ===================================================================== */
async function detectUnits() {
  const n = S.book.pages.length;
  S.units = []; S.detecting = true; renderUnits();
  try {
    const res = await callApi({ mode: 'units', pages: S.book.pages.map((t, i) => ({ n: i + 1, t: t.slice(0, 600) })) });
    S.units = (res.units || []).map(u => ({ id: uid(), title: u.title, from: u.from, to: u.to, on: true }));
  } catch (e) {
    console.error(e); toast(apiError(e) === T('err_gen') ? T('units_fail') : apiError(e), 'err');
  }
  if (!S.units.length) S.units = [{ id: uid(), title: T('whole_book'), from: 1, to: n, on: true }];
  S.detecting = false;
  S.rows.forEach(r => { if (r.unit !== 'all' && !S.units.some(u => u.id === r.unit)) r.unit = 'all'; });
  renderUnits(); renderRows();
}
function renderUnits() {
  const host = $('#unitsList');
  $('#addUnitBtn').classList.toggle('hidden', !S.book || S.detecting);
  if (S.detecting) { host.innerHTML = `<div class="detecting"><div class="spin"></div>${esc(T('detecting'))}</div>`; return; }
  if (!S.book) { host.innerHTML = `<div class="units-empty">${esc(T('units_empty'))}</div>`; return; }
  const max = S.book.pages.length;
  host.innerHTML = '';
  S.units.forEach(u => {
    const el = document.createElement('div');
    el.className = 'unit' + (u.on ? '' : ' off');
    el.innerHTML = `<button type="button" class="check ${u.on ? 'on' : ''}" aria-pressed="${u.on}">${svgI('<path d="M5 12l5 5 9-10"/>')}</button>
      <input class="u-title" type="text" value="${esc(u.title)}" aria-label="${esc(T('unit'))}">
      <button type="button" class="u-del" aria-label="${esc(T('remove'))}">${svgI('<path d="M6 6l12 12M18 6L6 18"/>')}</button>
      <div class="u-row2"><span class="u-range">${esc(T('from'))} <input type="number" min="1" max="${max}" value="${u.from}" data-k="from"> ${esc(T('to'))} <input type="number" min="1" max="${max}" value="${u.to}" data-k="to"></span></div>`;
    $('.check', el).onclick = () => { u.on = !u.on; markDirty(); renderUnits(); refreshUnitDDs(); };
    $('.u-title', el).oninput = e => { u.title = e.target.value; markDirty(); refreshUnitDDs(); };
    $('.u-del', el).onclick = () => { S.units = S.units.filter(x => x !== u); S.rows.forEach(r => { if (r.unit === u.id) r.unit = 'all'; }); markDirty(); renderUnits(); renderRows(); };
    $$('.u-range input', el).forEach(inp => inp.onchange = () => {
      let v = Math.max(1, Math.min(max, parseInt(inp.value, 10) || 1));
      u[inp.dataset.k] = v;
      if (u.from > u.to) { if (inp.dataset.k === 'from') u.to = u.from; else u.from = u.to; }
      markDirty(); renderUnits(); refreshUnitDDs();
    });
    host.appendChild(el);
  });
}
function refreshUnitDDs() { DD.forEach(d => { if (d.isUnit) { if (d.value !== 'all' && !S.units.some(u => u.id === d.value && u.on)) { d.value = 'all'; if (d.row) d.row.unit = 'all'; } d.paint(); } }); }

/* =====================================================================
   Step 3 — header
   ===================================================================== */
const gradeOpts = () => {
  const n = { pri: 5, mid: 4, sec: 3 }[S.header.stage];
  return [...Array(n)].map((_, i) => ({ v: i + 1, label: S.uiLang === 'en' ? `Year ${i + 1}` : `السنة ${ORD_AR_F[i]}` }));
};
let ddGrade;
function initHeader() {
  const H = S.header, D = DEFAULTS[S.examLang];
  if (!H.title) H.title = D.title;
  if (!H.duration) H.duration = D.duration;
  const bind = (id, k) => { const el = $(id); el.value = H[k] || ''; el.oninput = () => { H[k] = el.value; markDirty(); rerender(); }; };
  bind('#hSchool', 'school'); bind('#hTitle', 'title'); bind('#hYear', 'year');
  bind('#hSubject', 'subject'); bind('#hDuration', 'duration'); bind('#hTeacher', 'teacher');
  makeDD($('#ddStage'), () => ['pri', 'mid', 'sec'].map(k => ({ v: k, label: T('st_' + k) })), H.stage, v => {
    H.stage = v; const max = { pri: 5, mid: 4, sec: 3 }[v]; if (H.grade > max) H.grade = max; ddGrade.set(H.grade); markDirty(); rerender();
  });
  ddGrade = makeDD($('#ddGrade'), gradeOpts, H.grade, v => { H.grade = v; markDirty(); rerender(); });
  makeDD($('#ddExamLang'), () => [{ v: 'ar', label: 'العربية' }, { v: 'fr', label: 'Français' }, { v: 'en', label: 'English' }], S.examLang, v => {
    const old = DEFAULTS[S.examLang];
    S.examLang = v;
    if (H.title === old.title) { H.title = DEFAULTS[v].title; $('#hTitle').value = H.title; }
    if (H.duration === old.duration) { H.duration = DEFAULTS[v].duration; $('#hDuration').value = H.duration; }
    fillDatalists(); markDirty(); renderPaper();
  });
  $('#logoFile').onchange = async e => {
    const f = e.target.files[0]; e.target.value = ''; if (!f) return;
    H.logo = (await compressDataUrl(await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(f); }), 320, 0.9, true)).src;
    paintLogo(); markDirty(); rerender();
  };
  $('#logoDel').onclick = () => { H.logo = ''; paintLogo(); markDirty(); rerender(); };
  paintLogo();
}
function paintLogo() {
  const img = $('#logoPrev');
  img.classList.toggle('hidden', !S.header.logo); $('#logoDel').classList.toggle('hidden', !S.header.logo);
  if (S.header.logo) img.src = S.header.logo;
}
function syncHeaderInputs() {
  const H = S.header;
  $('#hSchool').value = H.school || ''; $('#hTitle').value = H.title || ''; $('#hYear').value = H.year || '';
  $('#hSubject').value = H.subject || ''; $('#hDuration').value = H.duration || ''; $('#hTeacher').value = H.teacher || '';
  DD.forEach(d => { if (d.host.id === 'ddStage') d.set(H.stage); if (d.host.id === 'ddExamLang') d.set(S.examLang); if (d.host.id === 'ddDiffAll') d.set(S.difficulty); });
  ddGrade.set(H.grade); paintLogo(); fillDatalists();
}
const levelText = () => L().level_of(S.header.stage, S.header.grade);

/* =====================================================================
   Step 4 — exercise rows
   ===================================================================== */
const DEFAULT_ROW_TYPES = ['qcm', 'tf', 'problem', 'situation', 'fill', 'direct', 'match', 'document'];
function setCount(n) {
  n = Math.max(1, Math.min(MAX_EX, n));
  while (S.rows.length < n) S.rows.push({ type: DEFAULT_ROW_TYPES[S.rows.length] || 'direct', unit: 'all', diff: S.difficulty, points: 0 });
  if (S.rows.length > n) {
    S.rows.length = n;
    if (S.exercises.length > n) { S.exercises.length = n; renderPaper(); }
  }
  const pts = splitPoints(20, n);
  S.rows.forEach((r, i) => { r.points = pts[i]; if (S.exercises[i]) S.exercises[i].points = pts[i]; });
  markDirty(); renderRows(); updateGenBtn(); if (S.exercises.length) rerender();
}
function renderRows() {
  const host = $('#rows');
  for (let i = DD.length - 1; i >= 0; i--) if (DD[i].isRow) DD.splice(i, 1);
  host.innerHTML = '';
  $('#cntVal').textContent = S.rows.length;
  S.rows.forEach((r, i) => {
    const el = document.createElement('div');
    el.className = 'row'; el.style.setProperty('--c', TYPES[r.type].c);
    el.innerHTML = `<div class="row-h"><span>${esc(T('ex_n'))} ${i + 1}</span>
      <label class="pts"><input type="number" min="0.5" max="20" step="0.25" value="${r.points}"> ${esc(T('points_short'))}</label></div>
      <div class="row-g"><div class="dd-type"></div><div class="dd-unit"></div><div class="dd-diff"></div></div>`;
    const a = makeDD($('.dd-type', el), typeOpts, r.type, v => { r.type = v; el.style.setProperty('--c', TYPES[v].c); markDirty(); });
    const b = makeDD($('.dd-unit', el), unitOpts, r.unit, v => { r.unit = v; markDirty(); });
    const c = makeDD($('.dd-diff', el), diffOpts, r.diff, v => { r.diff = v; markDirty(); });
    a.isRow = b.isRow = c.isRow = true; b.isUnit = true; b.row = r;
    $('.pts input', el).onchange = e => {
      r.points = Math.max(0.5, Math.min(20, Number(e.target.value) || 1)); e.target.value = r.points;
      if (S.exercises[i]) { S.exercises[i].points = r.points; rerender(); }
      markDirty(); paintTotal();
    };
    host.appendChild(el);
  });
  paintTotal();
}
function paintTotal() {
  const t = S.rows.reduce((a, r) => a + Number(r.points || 0), 0);
  const el = $('#ptsTotal');
  el.textContent = `${T('total')}: ${fmtNum(t)} / 20`;
  el.className = 'pts-total ' + (Math.abs(t - 20) < 0.01 ? 'good' : 'bad');
}
function updateGenBtn() {
  const btn = $('#genBtn'), lbl = $('#genLbl');
  if (S.busy) return;
  const ready = S.exercises.filter(e => e.status === 'ready').length;
  lbl.textContent = (ready && ready === S.exercises.length && S.rows.length > S.exercises.length) ? T('generate_more') : T('generate');
  btn.classList.remove('busy');
}

/* =====================================================================
   Generation
   ===================================================================== */
function unitPages(unitId) {
  const list = unitId === 'all' ? S.units.filter(u => u.on) : S.units.filter(u => u.id === unitId);
  const set = new Set();
  (list.length ? list : S.units.filter(u => u.on)).forEach(u => { for (let p = u.from; p <= u.to; p++) set.add(p); });
  return [...set].sort((a, b) => a - b);
}
function sourceFor(ex) {
  const pages = unitPages(ex.unit);
  let s = pages.map(p => `[${p}]\n${S.book.pages[p - 1] || ''}`).join('\n\n');
  if (s.length > MAX_SOURCE) {
    // keep a fair share of every page instead of only the first ones
    const per = Math.floor(MAX_SOURCE / pages.length);
    s = pages.map(p => `[${p}]\n${(S.book.pages[p - 1] || '').slice(0, per)}`).join('\n\n');
  }
  return s;
}
function summary(ex) {
  const d = ex.data; if (!d) return '';
  const parts = (d.items || []).map(it => it.text).concat((d.pairs || []).map(p => p.left));
  return `${d.title || ''}: ${(d.intro || '').slice(0, 200)} ${parts.join(' | ')}`.slice(0, 1400);
}
const rowToEx = r => ({ id: uid(), type: r.type, diff: r.diff, unit: r.unit, points: r.points, data: null, history: [], images: [], status: 'waiting' });

async function generate() {
  if (S.busy) return;
  if (!S.book) { toast(T('err_nobook'), 'err'); return; }
  if (!S.units.some(u => u.on)) { toast(T('err_nounits'), 'err'); return; }
  const allReady = S.exercises.length && S.exercises.every(e => e.status === 'ready');
  let targets;
  if (allReady && S.rows.length > S.exercises.length) {
    targets = S.rows.slice(S.exercises.length).map(rowToEx);
    S.exercises.push(...targets);
  } else {
    if (S.exercises.some(e => e.status === 'ready') && !(await confirmBox(T('confirm_replace')))) return;
    S.exercises = S.rows.map(rowToEx);
    targets = S.exercises.slice();
  }
  S.busy = true; markDirty();
  $('#genBtn').classList.add('busy');
  showPane('stage');
  renderPaper();
  let k = 0;
  for (const ex of targets) {
    k++;
    $('#genLbl').textContent = T('generating', { i: k, n: targets.length });
    if (!S.exercises.includes(ex)) continue;
    await genOne(ex, {});
  }
  S.busy = false; updateGenBtn(); renderPaper();
}

async function genOne(ex, { note = '', regen = false } = {}) {
  if (!S.book) { toast(T('err_nobook'), 'err'); return false; }
  const source = sourceFor(ex);
  if (source.replace(/\s|\[\d+\]/g, '').length < 80) {
    ex.status = regen ? 'ready' : 'error'; ex.err = T('err_short'); renderPaper(); toast(T('err_short'), 'err'); return false;
  }
  const prev = { type: ex.type, data: ex.data, perm: ex.perm, status: ex.status };
  const avoid = S.exercises.filter(e => e !== ex && e.status === 'ready').map(e => (e.data.title || '') + ' — ' + ((e.data.items && e.data.items[0] && e.data.items[0].text) || '')).slice(0, 8);
  ex.status = 'loading'; ex.err = '';
  renderPaper(); focusEx(ex, false);
  try {
    const res = await callApi({
      mode: 'exercise', type: ex.type, lang: S.examLang, source,
      level: levelText(), subject: S.header.subject, difficulty: ex.diff, points: ex.points,
      note, previous: regen && prev.data ? summary({ data: prev.data }) : '', avoid
    });
    if (!res || !res.exercise) throw new Error('empty');
    if (regen && prev.data) { ex.history.push({ type: prev.type, data: prev.data, perm: prev.perm }); if (ex.history.length > 10) ex.history.shift(); }
    ex.data = res.exercise; ex.perm = null; ex.status = 'ready';
    markDirty(); renderPaper(); focusEx(ex, true);
    return true;
  } catch (e) {
    console.error(e);
    if (regen && prev.data) { Object.assign(ex, prev); toast(apiError(e), 'err'); }
    else { ex.status = 'error'; ex.err = apiError(e); }
    renderPaper();
    return false;
  }
}
function focusEx(ex, flash) {
  const el = $(`.ex[data-id="${ex.id}"]`);
  if (!el) return;
  el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  if (flash) { el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
}

/* =====================================================================
   Paper rendering (A4 pages with pagination)
   ===================================================================== */
const rerender = debounce(() => renderPaper(), 140);
function typeset(node) {
  if (window.renderMathInElement) {
    try {
      renderMathInElement(node, { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }, { left: '\\(', right: '\\)', display: false }], throwOnError: false, ignoredClasses: ['ex-tools'] });
    } catch (e) { /* ignore */ }
  }
}
function newPage(paper, kind) {
  const el = document.createElement('div');
  el.className = 'page'; el.dir = L().dir; el.lang = S.examLang; el.dataset.kind = kind;
  el.innerHTML = '<div class="page-body"></div><div class="page-foot"></div>';
  paper.appendChild(el);
  return { el, body: el.firstChild, foot: el.lastChild };
}
function flow(paper, nodes, kind) {
  const pages = [newPage(paper, kind)];
  let pg = pages[0];
  for (const n of nodes) {
    pg.body.appendChild(n); typeset(n);
    if (pg.body.scrollHeight > pg.body.clientHeight + 2 && pg.body.children.length > 1) {
      pg.body.removeChild(n);
      pg = newPage(paper, kind); pages.push(pg);
      pg.body.appendChild(n);
    }
  }
  return pages;
}
function renderPaper() {
  closePop();
  const paper = $('#paper'), sc = $('#stageScroll'), top = sc.scrollTop;
  paper.innerHTML = '';
  paper.style.zoom = S.zoom;
  if (!S.exercises.length) { paper.appendChild(emptyPage()); return; }
  const Lx = L();
  const blocks = [headerBlock()];
  S.exercises.forEach((ex, i) => blocks.push(exBlock(ex, i)));
  if (S.exercises.every(e => e.status === 'ready')) blocks.push(el('div', 'good-luck', esc(Lx.luck)));
  const exam = flow(paper, blocks, 'exam');
  exam.forEach((p, i) => { p.foot.textContent = Lx.page(i + 1, exam.length); });
  const ready = S.exercises.filter(e => e.status === 'ready');
  if (S.showCorr && ready.length) {
    const cb = [el('h2', 'corr-title', esc(Lx.corr))];
    S.exercises.forEach((ex, i) => { if (ex.status === 'ready') cb.push(corrBlock(ex, i)); });
    const tot = S.exercises.reduce((a, e) => a + Number(e.points || 0), 0);
    cb.push(el('div', 'corr-total', `${esc(Lx.total)}: ${fmtNum(tot)} / 20`));
    const corr = flow(paper, cb, 'corr');
    corr.forEach((p, i) => { p.foot.textContent = Lx.cpage(i + 1, corr.length); });
  }
  sc.scrollTop = top;
}
function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
function emptyPage() {
  const p = el('div', 'page empty');
  p.innerHTML = `<div class="page-body">
    <svg class="empty-art" viewBox="0 0 190 150" fill="none">
      <rect x="44" y="14" width="92" height="120" rx="8" fill="#fff" stroke="#2F5770" stroke-width="2.5"/>
      <path d="M60 38h44M60 52h60M60 66h52" stroke="#C8DAE5" stroke-width="5" stroke-linecap="round"/>
      <rect x="58" y="82" width="11" height="11" rx="3" stroke="#7C4DFF" stroke-width="2.5"/><path d="M78 88h36" stroke="#C8DAE5" stroke-width="5" stroke-linecap="round"/>
      <rect x="58" y="102" width="11" height="11" rx="3" fill="#16A34A"/><path d="M60.5 107.5l2.5 2.5 4.5-5" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="M78 108h28" stroke="#C8DAE5" stroke-width="5" stroke-linecap="round"/>
      <g transform="translate(128 70) rotate(35)"><rect x="-6" y="-34" width="12" height="54" rx="3" fill="#2F6FB0"/><path d="M-6 20l6 12 6-12z" fill="#F4C27A"/><rect x="-6" y="-34" width="12" height="9" rx="2" fill="#DB2777"/></g>
      <path d="M150 26l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#E08A00"/><path d="M30 92l2 4.5 4.5 2-4.5 2-2 4.5-2-4.5-4.5-2 4.5-2z" fill="#7C4DFF"/>
    </svg>
    <h3>${esc(T('empty_title'))}</h3><p>${esc(T('empty_sub'))}</p>
    <div class="empty-steps"><span>1 · ${esc(T('e1'))}</span><span>2 · ${esc(T('e2'))}</span><span>3 · ${esc(T('e3'))}</span><span>4 · ${esc(T('e4'))}</span></div>
  </div>`;
  return p;
}
function headerBlock() {
  const H = S.header, Lx = L();
  const v = x => x ? esc(x) : '....................';
  const cell = (k, val) => `<span class="h-k">${esc(Lx[k])}:</span> ${v(val)}`;
  const t = el('table', 'h-table');
  t.innerHTML = `<tr><td>${cell('school', H.school)}</td><td class="h-mid" rowspan="1">${H.logo ? `<img class="h-logo" src="${H.logo}" alt="">` : ''}</td><td>${cell('year', H.year)}</td></tr>
    <tr><td>${cell('level', levelText())}</td><td class="h-mid h-title">${v(H.title)}</td><td>${cell('subject', H.subject)}</td></tr>
    <tr><td colspan="2">${cell('teacher', H.teacher)}</td><td>${cell('duration', H.duration)}</td></tr>`;
  return t;
}
function exHeading(ex, i) {
  const Lx = L();
  let label;
  if (ex.type === 'situation') label = Lx.situation;
  else label = Lx.ex(S.exercises.slice(0, i).filter(e => e.type !== 'situation').length);
  return `<h3 class="ex-h">${esc(label)}<span>${esc(Lx.pts(Number(ex.points)))}</span></h3>`;
}
const PEN = svgI('<path d="M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10z"/><path d="M13.5 7.5l3 3"/>');
function exBlock(ex, i) {
  const b = el('div', 'ex'); b.dataset.id = ex.id; b.style.setProperty('--tc', TYPES[ex.type].c);
  if (ex.status !== 'ready') {
    if (ex.status === 'error') {
      b.innerHTML = exHeading(ex, i) + `<div class="ex-error"><span>${esc(ex.err || T('err_gen'))}</span><button type="button" class="btn-main">${esc(T('retry'))}</button></div>`;
      $('.btn-main', b).onclick = async () => { if (S.busy) return; S.busy = true; await genOne(ex, {}); S.busy = false; updateGenBtn(); };
    } else {
      b.innerHTML = exHeading(ex, i) + `<div class="ex-writing ${ex.status === 'waiting' ? 'w-wait' : ''}"><div class="w-h"><span class="pen">${PEN}</span>${esc(ex.status === 'waiting' ? T('waiting') : T('writing'))} — ${esc(tLabel(ex.type))}</div><div class="w-lines"><i></i><i></i><i></i><i></i></div></div>`;
    }
    return b;
  }
  const d = ex.data, Lx = L();
  let h = exHeading(ex, i);
  if (d.instruction) h += `<p class="ex-ins">${txt(d.instruction)}</p>`;
  if (d.intro) h += ex.type === 'document' ? `<div class="ex-doc"><span class="ex-doc-l">${esc(Lx.doc)}:</span>${txt(d.intro)}</div>` : `<div class="ex-intro">${txt(d.intro)}</div>`;
  if (d.graph && d.graph.expr) { const g = graphSvg(d.graph); if (g) h += `<figure class="figure">${g}${d.graph.caption ? `<figcaption>${txt(d.graph.caption)}</figcaption>` : ''}</figure>`; }
  (ex.images || []).forEach(im => { h += `<img class="ex-img" src="${im.src}" alt="" style="width:${im.w || 60}%;aspect-ratio:1/${im.ratio || 0.75}">`; });
  h += itemsHtml(ex);
  b.innerHTML = h;
  b.appendChild(toolsBar(ex, i));
  return b;
}
function itemsHtml(ex) {
  const d = ex.data, Lx = L(), items = d.items || [];
  switch (ex.type) {
    case 'qcm':
      return `<ol>${items.map(it => {
        const o = (it.options || []).map((op, k) => `<td><span class="box"></span>${esc(Lx.letters[k])}) ${txt(op)}</td>`);
        let rows = ''; for (let k = 0; k < o.length; k += 2) rows += `<tr>${o[k]}${o[k + 1] || '<td></td>'}</tr>`;
        return `<li>${txt(it.text)}<table class="opts">${rows}</table></li>`;
      }).join('')}</ol>`;
    case 'tf':
      return `<table class="t-grid"><tr><th class="n">#</th><th>${esc(Lx.statement)}</th><th class="c">${esc(Lx.tru)}</th><th class="c">${esc(Lx.fal)}</th></tr>${items.map((it, k) => `<tr><td class="n">${k + 1}</td><td>${txt(it.text)}</td><td class="c"></td><td class="c"></td></tr>`).join('')}</table>`;
    case 'fill':
      return `<ol>${items.map(it => `<li>${txt(it.text).replace(/_{2,}/g, '<span class="blank"></span>')}</li>`).join('')}</ol>`;
    case 'match': {
      const pairs = d.pairs || [];
      if (!ex.perm || ex.perm.length !== pairs.length) ex.perm = seededPerm(pairs.length, ex.id);
      return `<table class="t-grid"><tr><th>${esc(Lx.colA)}</th><th>${esc(Lx.colB)}</th></tr>${pairs.map((p, k) => `<tr><td>${k + 1}. ${txt(p.left)}</td><td>${esc(Lx.letters[k] || k + 1)}) ${txt((pairs[ex.perm[k]] || {}).right)}</td></tr>`).join('')}</table>`;
    }
    default:
      return `<ol>${items.map(it => `<li>${txt(it.text)}</li>`).join('')}</ol>`;
  }
}
function corrBlock(ex, i) {
  const d = ex.data, Lx = L();
  const b = el('div', 'ex'); b.dataset.corr = ex.id; b.style.setProperty('--tc', TYPES[ex.type].c);
  let rows = [];
  if (ex.type === 'match') {
    const pairs = d.pairs || [];
    if (!ex.perm || ex.perm.length !== pairs.length) ex.perm = seededPerm(pairs.length, ex.id);
    rows = pairs.map((p, k) => `${k + 1} ← ${Lx.letters[ex.perm.indexOf(k)] || ''}`).map(esc);
  } else {
    rows = (d.items || []).map(it => {
      if (ex.type === 'qcm') { const a = Number(it.answer) || 0; return `${esc(Lx.letters[a])}) ${txt((it.options || [])[a])}`; }
      if (ex.type === 'tf') { const t = it.answer === true || it.answer === 'true'; return `<b>${esc(t ? Lx.tru : Lx.fal)}</b>${it.correction ? ' — ' + txt(it.correction) : ''}`; }
      if (ex.type === 'fill') return (it.answers || []).map(txt).join(' ؛ ');
      return txt(it.answer);
    });
  }
  const pts = splitPoints(Number(ex.points), rows.length);
  b.innerHTML = exHeading(ex, i) + `<table class="t-grid"><tr><th class="n">${esc(Lx.q)}</th><th>${esc(Lx.ans)}</th><th class="c">${esc(Lx.mark)}</th></tr>${rows.map((r, k) => `<tr><td class="n">${k + 1}</td><td>${r}</td><td class="c">${esc(Lx.ptsCell(pts[k]))}</td></tr>`).join('')}</table>`;
  return b;
}

/* =====================================================================
   Per-exercise tools
   ===================================================================== */
const XT = {
  regen: '<path d="M20 11a8 8 0 0 0-14.3-4.9L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16"/><path d="M20 20v-4h-4"/>',
  undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  edit: '<path d="M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10z"/><path d="M13.5 7.5l3 3"/>',
  image: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.6"/><path d="M21 16l-5-5-8 8"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>', down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  del: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'
};
function toolsBar(ex, i) {
  const bar = el('div', 'ex-tools');
  const n = S.exercises.length;
  const mk = (k, tip, fn, dis) => {
    const b = el('button', 'xt ' + k, svgI(XT[k])); b.type = 'button';
    b.dataset.tipText = T(tip); b.setAttribute('aria-label', T(tip)); b.disabled = !!dis;
    b.onclick = e => { e.stopPropagation(); fn(b); };
    bar.appendChild(b);
  };
  mk('regen', 'regen', b => openRegen(ex, b), S.busy);
  mk('undo', 'undo', () => { const h = ex.history.pop(); if (!h) return; Object.assign(ex, h, { status: 'ready' }); syncRowFromEx(ex); markDirty(); renderPaper(); }, !ex.history.length || S.busy);
  mk('edit', 'edit', () => openEditor(ex));
  mk('image', 'image', () => openImages(ex));
  mk('up', 'up', () => moveEx(i, -1), i === 0);
  mk('down', 'down', () => moveEx(i, 1), i === n - 1);
  mk('del', 'del', async () => { if (!(await confirmBox(T('del') + '؟'))) return; S.exercises.splice(i, 1); S.rows.splice(i, 1); markDirty(); renderRows(); renderPaper(); updateGenBtn(); }, S.busy);
  return bar;
}
function moveEx(i, dir) {
  const j = i + dir; if (j < 0 || j >= S.exercises.length) return;
  [S.exercises[i], S.exercises[j]] = [S.exercises[j], S.exercises[i]];
  if (S.rows[i] && S.rows[j]) [S.rows[i], S.rows[j]] = [S.rows[j], S.rows[i]];
  markDirty(); renderRows(); renderPaper(); focusEx(S.exercises[j], true);
}
function syncRowFromEx(ex) {
  const i = S.exercises.indexOf(ex); const r = S.rows[i]; if (!r) return;
  r.type = ex.type; r.diff = ex.diff; r.points = ex.points; renderRows();
}

/* popover */
let popEl = null, popOff = null;
function closePop() {
  if (!popEl) return;
  popEl.remove(); popEl = null; if (popOff) popOff();
  for (let i = DD.length - 1; i >= 0; i--) if (DD[i].isTemp) DD.splice(i, 1);
  $$('.ex.tools-open').forEach(e => e.classList.remove('tools-open'));
}
function openRegen(ex, anchor) {
  closePop(); closeMenu();
  const p = el('div', 'pop');
  p.innerHTML = `<h4>${esc(T('regen_title'))}</h4><div class="dd-a"></div><div class="dd-b"></div>
    <div class="f"><textarea rows="2" placeholder="${esc(T('note_ph'))}"></textarea></div>
    <button type="button" class="btn-main">${svgI(XT.regen, 'dd-chev')}<span>${esc(T('regen_go'))}</span></button>`;
  document.body.appendChild(p);
  let type = ex.type, diff = ex.diff;
  const a = makeDD($('.dd-a', p), typeOpts, type, v => { type = v; });
  const b = makeDD($('.dd-b', p), diffOpts, diff, v => { diff = v; });
  a.isTemp = b.isTemp = true;
  $('.btn-main svg', p).style.stroke = '#fff';
  const r = anchor.getBoundingClientRect();
  p.style.top = Math.min(innerHeight - p.offsetHeight - 10, r.bottom + 8) + 'px';
  p.style.left = Math.max(10, Math.min(innerWidth - 310, r.left + r.width / 2 - 150)) + 'px';
  const exEl = anchor.closest('.ex'); exEl && exEl.classList.add('tools-open');
  $('textarea', p).focus();
  $('.btn-main', p).onclick = async () => {
    const note = $('textarea', p).value.trim();
    closePop();
    if (S.busy) return;
    ex.type = type; ex.diff = diff; syncRowFromEx(ex);
    S.busy = true; $('#genBtn').classList.add('busy');
    await genOne(ex, { note, regen: true });
    S.busy = false; updateGenBtn(); renderPaper();
  };
  const onDown = e => { if (!p.contains(e.target) && !e.target.closest('.dd-menu')) closePop(); };
  const onKey = e => { if (e.key === 'Escape' && !menuEl) closePop(); };
  setTimeout(() => { document.addEventListener('pointerdown', onDown); document.addEventListener('keydown', onKey); }, 0);
  popEl = p; popOff = () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
}

/* =====================================================================
   Modals
   ===================================================================== */
const XICON = svgI('<path d="M6 6l12 12M18 6L6 18"/>');
function modal({ title, size = '', build, foot = [] }) {
  closeMenu(); closePop();
  const bg = el('div', 'modal-bg');
  const m = el('div', 'modal ' + size);
  m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
  m.innerHTML = `<div class="modal-h"><h3>${esc(title)}</h3><button type="button" class="modal-x" aria-label="${esc(T('close'))}">${XICON}</button></div><div class="modal-b"></div>${foot.length ? '<div class="modal-f"></div>' : ''}`;
  bg.appendChild(m); $('#modalRoot').appendChild(bg);
  let onClose = null;
  const close = () => { bg.remove(); document.removeEventListener('keydown', onKey); for (let i = DD.length - 1; i >= 0; i--) if (DD[i].isModal) DD.splice(i, 1); if (onClose) onClose(); };
  const onKey = e => { if (e.key === 'Escape' && !menuEl) close(); };
  document.addEventListener('keydown', onKey);
  $('.modal-x', m).onclick = close;
  bg.addEventListener('pointerdown', e => { if (e.target === bg) close(); });
  const api = { el: m, body: $('.modal-b', m), close, set onClose(f) { onClose = f; } };
  foot.forEach(f => {
    const b = el('button', f.cls || 'btn-soft', esc(f.label)); b.type = 'button';
    b.onclick = () => f.onClick(api);
    $('.modal-f', m).appendChild(b);
  });
  if (build) build(api.body, api);
  return api;
}
function confirmBox(msg, danger = false) {
  return new Promise(res => {
    let done = false;
    const m = modal({
      title: T('confirm'), size: 'sm',
      build: b => { b.innerHTML = `<p class="msg">${esc(msg)}</p>`; },
      foot: [{ label: T('cancel'), onClick: a => { done = true; a.close(); res(false); } },
        { label: T('confirm'), cls: 'btn-main' + (danger ? ' btn-danger' : ''), onClick: a => { done = true; a.close(); res(true); } }]
    });
    m.onClose = () => { if (!done) res(false); };
  });
}

/* ---------------- Exercise editor ---------------- */
function openEditor(ex) {
  const w = clone({ points: ex.points, data: ex.data, images: ex.images || [] });
  const d = w.data;
  if (ex.type === 'match') d.pairs = d.pairs || []; else d.items = d.items || [];
  const f = (label, html, wide = true) => `<label class="f ${wide ? 'f-wide' : ''}"><span>${esc(label)}</span>${html}</label>`;
  modal({
    title: `${T('ed_title')} — ${tLabel(ex.type)}`, size: 'lg',
    build: (b) => {
      b.innerHTML = `<div class="fields">
        ${f(T('f_title'), `<input type="text" data-k="title" value="${esc(d.title)}">`, false)}
        ${f(T('f_points'), `<input type="number" min="0.5" max="20" step="0.25" data-k="points" value="${w.points}">`, false)}
        ${f(T('f_ins'), `<input type="text" data-k="instruction" value="${esc(d.instruction)}">`)}
        ${f(T('f_intro'), `<textarea rows="4" data-k="intro">${esc(d.intro)}</textarea>`)}
      </div>
      <div class="ed-sec">${esc(tLabel(ex.type))}</div><div class="ed-items"></div>
      <button type="button" class="btn-ghost ed-add">${svgI('<path d="M12 5v14M5 12h14"/>')}<span>${esc(T('add_item'))}</span></button>
      <div class="ed-sec">${esc(T('graph'))}</div>
      <div class="fields">
        ${f(T('g_expr'), `<input type="text" dir="ltr" data-g="expr" value="${esc(d.graph && d.graph.expr)}">`)}
        ${f(T('g_from'), `<input type="number" dir="ltr" data-g="xmin" value="${d.graph && d.graph.xmin != null ? d.graph.xmin : -5}">`, false)}
        ${f(T('g_to'), `<input type="number" dir="ltr" data-g="xmax" value="${d.graph && d.graph.xmax != null ? d.graph.xmax : 5}">`, false)}
        ${f(T('g_caption'), `<input type="text" data-g="caption" value="${esc(d.graph && d.graph.caption)}">`)}
      </div>
      <div class="hint">${esc(T('g_hint'))}</div>
      <div class="ed-sec">${esc(T('images'))}</div><div class="ed-imgs"></div>
      <button type="button" class="btn-ghost ed-addimg">${svgI(XT.image)}<span>${esc(T('image'))}</span></button>`;
      $$('[data-k]', b).forEach(inp => inp.oninput = () => { if (inp.dataset.k === 'points') w.points = Math.max(0.5, Math.min(20, Number(inp.value) || 1)); else d[inp.dataset.k] = inp.value; });
      $$('[data-g]', b).forEach(inp => inp.oninput = () => {
        d.graph = d.graph || { expr: '', xmin: -5, xmax: 5 };
        d.graph[inp.dataset.g] = inp.dataset.g === 'expr' || inp.dataset.g === 'caption' ? inp.value : Number(inp.value);
        if (inp.dataset.g === 'expr') inp.style.borderColor = !inp.value || compileExpr(inp.value) ? '' : 'var(--bad)';
      });
      const itemsHost = $('.ed-items', b);
      const paintItems = () => {
        itemsHost.innerHTML = '';
        const list = ex.type === 'match' ? d.pairs : d.items;
        list.forEach((it, k) => {
          const box = el('div', 'ed-item');
          let inner = `<span class="ed-n">${k + 1}</span><button type="button" class="u-del" aria-label="${esc(T('remove'))}">${XICON}</button>`;
          if (ex.type === 'match') {
            inner += `<div class="ed-2">${f(T('f_left'), `<input type="text" data-p="left" value="${esc(it.left)}">`, false)}${f(T('f_right'), `<input type="text" data-p="right" value="${esc(it.right)}">`, false)}</div>`;
          } else {
            inner += f(T('f_text'), `<textarea rows="2" data-p="text">${esc(it.text)}</textarea>`);
            if (ex.type === 'qcm') {
              it.options = it.options || ['', '', '', ''];
              inner += `<div class="ed-2">${it.options.map((o, j) => `<div class="ed-opt"><input type="radio" name="c${k}" value="${j}" ${Number(it.answer) === j ? 'checked' : ''} aria-label="${esc(T('f_answer'))}"><input type="text" class="f-in" data-o="${j}" value="${esc(o)}" placeholder="${esc(T('f_opt'))} ${j + 1}"></div>`).join('')}</div>`;
            } else if (ex.type === 'tf') {
              inner += `<div class="ed-2"><div class="ed-opt"><input type="radio" name="c${k}" value="1" ${it.answer === true || it.answer === 'true' ? 'checked' : ''}> ${esc(T('f_true'))}</div><div class="ed-opt"><input type="radio" name="c${k}" value="0" ${!(it.answer === true || it.answer === 'true') ? 'checked' : ''}> ${esc(T('f_false'))}</div></div>`;
              inner += f(T('f_corr'), `<input type="text" data-p="correction" value="${esc(it.correction)}">`);
            } else if (ex.type === 'fill') {
              inner += f(T('f_answers'), `<input type="text" data-fa="1" value="${esc((it.answers || []).join(' ؛ '))}">`);
            } else {
              inner += f(T('f_answer'), `<textarea rows="2" data-p="answer">${esc(it.answer)}</textarea>`);
            }
          }
          box.innerHTML = inner;
          $$('[data-p]', box).forEach(inp => inp.oninput = () => { it[inp.dataset.p] = inp.value; });
          $$('[data-o]', box).forEach(inp => inp.oninput = () => { it.options[+inp.dataset.o] = inp.value; });
          $$('input[type="radio"]', box).forEach(r => r.onchange = () => { it.answer = ex.type === 'tf' ? r.value === '1' : Number(r.value); });
          const fa = $('[data-fa]', box); if (fa) fa.oninput = () => { it.answers = fa.value.split(/[;؛]/).map(s => s.trim()).filter(Boolean); };
          $('.u-del', box).onclick = () => { list.splice(k, 1); paintItems(); };
          $$('.f-in', box).forEach(x => { x.style.cssText = 'width:100%;border:1px solid transparent;background:var(--field);border-radius:10px;padding:8px 10px;font-size:.9rem'; });
          itemsHost.appendChild(box);
        });
      };
      paintItems();
      $('.ed-add', b).onclick = () => {
        if (ex.type === 'match') d.pairs.push({ left: '', right: '' });
        else if (ex.type === 'qcm') d.items.push({ text: '', options: ['', '', '', ''], answer: 0 });
        else if (ex.type === 'tf') d.items.push({ text: '', answer: true, correction: '' });
        else if (ex.type === 'fill') d.items.push({ text: '____', answers: [] });
        else d.items.push({ text: '', answer: '' });
        paintItems(); itemsHost.lastChild && itemsHost.lastChild.querySelector('textarea,input').focus();
      };
      const imgsHost = $('.ed-imgs', b);
      const paintImgs = () => {
        imgsHost.innerHTML = '';
        w.images.forEach((im, k) => {
          const box = el('div', 'ed-img');
          box.innerHTML = `<img src="${im.src}" alt=""><select aria-label="${esc(T('size'))}">${[30, 45, 60, 80, 100].map(s => `<option value="${s}" ${Number(im.w || 60) === s ? 'selected' : ''}>${esc(T('size'))} ${s}%</option>`).join('')}</select><button type="button" class="btn-ghost sm">${esc(T('remove'))}</button>`;
          $('select', box).onchange = e => { im.w = Number(e.target.value); };
          $('button', box).onclick = () => { w.images.splice(k, 1); paintImgs(); };
          imgsHost.appendChild(box);
        });
      };
      paintImgs();
      $('.ed-addimg', b).onclick = () => openImages(null, im => { w.images.push(im); paintImgs(); });
    },
    foot: [
      { label: T('cancel'), onClick: a => a.close() },
      { label: T('save_edit'), cls: 'btn-main', onClick: a => {
        if (d.graph && !String(d.graph.expr || '').trim()) d.graph = null;
        ex.points = w.points; ex.data = d; ex.images = w.images; ex.perm = null;
        syncRowFromEx(ex); markDirty(); a.close(); renderPaper(); focusEx(ex, true);
      } }
    ]
  });
}

/* ---------------- Images: device or crop from book ---------------- */
function openImages(ex, onAdd) {
  const add = im => {
    if (onAdd) { onAdd(im); return; }
    ex.images = ex.images || []; ex.images.push(im); markDirty(); renderPaper(); focusEx(ex, true);
  };
  modal({
    title: T('img_title'), size: 'lg',
    build: (b, api) => {
      b.innerHTML = `<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px">
          <label class="btn-main"><input type="file" accept="image/*" hidden>${svgI('<path d="M12 16V4M6 10l6-6 6 6"/><path d="M4 16v4h16v-4"/>', 'dd-chev')}<span>${esc(T('img_device'))}</span></label>
        </div>
        <div class="ed-sec">${esc(T('img_book'))}</div>
        ${S.pdf ? `<p class="hint">${esc(T('crop_hint'))}</p><div class="crop-wrap"><div class="crop-pages"></div><div class="crop-area"><div class="cv-wrap"><canvas></canvas><div class="crop-sel hidden"></div></div></div></div>` : `<p class="hint">${esc(T('no_pdf_pages'))}</p>`}`;
      $('label.btn-main svg', b).style.stroke = '#fff';
      $('input[type="file"]', b).onchange = async e => {
        const file = e.target.files[0]; if (!file) return;
        const im = await compressImage(file, 1100, 0.85);
        add({ src: im.src, ratio: im.ratio, w: 60 }); api.close();
      };
      if (!S.pdf) return;
      const cv = $('.crop-area canvas', b), wrap = $('.cv-wrap', b), sel = $('.crop-sel', b);
      let rect = null, cur = 0;
      const showPage = async (n, thumb) => {
        cur = n; rect = null; sel.classList.add('hidden'); insertBtn.disabled = true;
        $$('.crop-pages canvas', b).forEach(c => c.classList.toggle('on', c === thumb));
        const pg = await S.pdf.getPage(n); const vp = pg.getViewport({ scale: 2 });
        cv.width = vp.width; cv.height = vp.height;
        await pg.render({ canvasContext: cv.getContext('2d'), viewport: vp }).promise;
      };
      const insertBtn = el('button', 'btn-main', esc(T('insert'))); insertBtn.type = 'button'; insertBtn.disabled = true;
      const foot = el('div', 'modal-f'); foot.appendChild(insertBtn); api.el.appendChild(foot);
      renderThumbs($('.crop-pages', b), 0.25, (n, c) => showPage(n, c)).then(list => { if (list[0]) showPage(1, list[0]); });
      let start = null;
      const pos = e => { const r = cv.getBoundingClientRect(); return { x: Math.max(0, Math.min(r.width, e.clientX - r.left)), y: Math.max(0, Math.min(r.height, e.clientY - r.top)) }; };
      wrap.addEventListener('pointerdown', e => { if (!cur) return; start = pos(e); wrap.setPointerCapture(e.pointerId); });
      wrap.addEventListener('pointermove', e => {
        if (!start) return;
        const p = pos(e);
        rect = { x: Math.min(start.x, p.x), y: Math.min(start.y, p.y), w: Math.abs(p.x - start.x), h: Math.abs(p.y - start.y) };
        Object.assign(sel.style, { left: rect.x + 'px', top: rect.y + 'px', width: rect.w + 'px', height: rect.h + 'px' });
        sel.classList.remove('hidden');
      });
      wrap.addEventListener('pointerup', () => { start = null; insertBtn.disabled = !(rect && rect.w > 12 && rect.h > 12); });
      insertBtn.onclick = async () => {
        const r = cv.getBoundingClientRect(), k = cv.width / r.width;
        const c = document.createElement('canvas');
        c.width = Math.round(rect.w * k); c.height = Math.round(rect.h * k);
        c.getContext('2d').drawImage(cv, rect.x * k, rect.y * k, c.width, c.height, 0, 0, c.width, c.height);
        const im = await compressDataUrl(c.toDataURL('image/png'), 1100, 0.88);
        add({ src: im.src, ratio: im.ratio, w: 60 }); api.close();
      };
    }
  });
}

/* =====================================================================
   Zoom
   ===================================================================== */
function setZoom(z, auto = false) {
  S.zoom = Math.max(0.3, Math.min(2.5, Math.round(z * 100) / 100));
  S.zoomAuto = auto;
  $('#paper').style.zoom = S.zoom;
  $('#zVal').textContent = Math.round(S.zoom * 100) + '%';
}
function fitZoom() {
  const sc = $('#stageScroll'); if (!sc.clientWidth) return;
  setZoom(Math.min(1.1, (sc.clientWidth - 64) / A4_W), true);
}

/* =====================================================================
   Export: print, PDF, Word
   ===================================================================== */
function canExport() {
  if (S.busy) { toast(T('writing'), 'err'); return false; }
  if (!S.exercises.length || S.exercises.some(e => e.status !== 'ready')) { toast(T('err_empty'), 'err'); return false; }
  return true;
}
const fileName = () => (`${S.header.title || 'exam'} ${S.header.subject || ''}`).trim().replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, '_').slice(0, 80) || 'exam';
async function withExport(btnId, fn) {
  const btn = $(btnId); btn.classList.add('busy'); btn.disabled = true;
  closeMenu(); closePop();
  document.body.classList.add('exporting');
  const z = S.zoom; $('#paper').style.zoom = 1;
  try {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    await fn($$('#paper .page:not(.empty)'));
    return true;
  } catch (e) {
    console.error(e); toast(T('err_export'), 'err'); return false;
  } finally {
    document.body.classList.remove('exporting'); $('#paper').style.zoom = z;
    btn.classList.remove('busy'); btn.disabled = false;
  }
}
function download(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
async function exportPdf() {
  if (!canExport()) return;
  toast(T('exporting'));
  try { await Promise.all([loadScript(LIBS.h2c), loadScript(LIBS.jspdf)]); } catch (e) { toast(T('err_net'), 'err'); return; }
  const ok = await withExport('#pdfBtn', async pages => {
    const doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
    for (let i = 0; i < pages.length; i++) {
      const c = await html2canvas(pages[i], { scale: 2, backgroundColor: '#ffffff', logging: false, useCORS: true });
      if (i) doc.addPage();
      doc.addImage(c.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 210, 297);
    }
    doc.save(fileName() + '.pdf');
  });
  if (ok) toast(T('pdf_ok'), 'ok');
}
function svgToPng(svg) {
  return new Promise(res => {
    const xml = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = svg.width.baseVal.value * 2; c.height = svg.height.baseVal.value * 2;
      const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL('image/png'));
    };
    img.onerror = () => res('');
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
  });
}
const WORD_CSS = `body{font-family:'Times New Roman',serif;font-size:13pt;line-height:1.5}
table{border-collapse:collapse;width:100%}
.h-table td,.t-grid td,.t-grid th{border:1px solid #222;padding:4pt 6pt;vertical-align:top}
.t-grid th{background:#EEEEEE;font-weight:bold;text-align:center}
.h-mid,.c,.n{text-align:center}.h-title{font-weight:bold;font-size:15pt}.h-k{font-weight:bold}
.ex-h{font-size:14pt;font-weight:bold;text-decoration:underline;margin:10pt 0 2pt}
.ex-ins{font-weight:bold;margin:2pt 0 4pt}.ex-doc{border:1px solid #333;padding:6pt}
.opts td{border:none;padding:1pt 4pt}.figure,.good-luck{text-align:center}.good-luck{font-weight:bold}
.corr-title{text-align:center;font-size:16pt;border:1px solid #222;padding:4pt}.corr-total{font-weight:bold}`;
async function exportWord() {
  if (!canExport()) return;
  toast(T('exporting'));
  try { await Promise.all([loadScript(LIBS.h2c), loadScript(LIBS.docx)]); } catch (e) { toast(T('err_net'), 'err'); return; }
  const dir = L().dir, align = dir === 'rtl' ? 'right' : 'left';
  const ok = await withExport('#wordBtn', async pages => {
    const parts = [];
    for (const pg of pages) {
      const body = $('.page-body', pg), cl = body.cloneNode(true);
      $$('.ex-tools', cl).forEach(n => n.remove());
      const ok1 = $$('.katex', body), ck = $$('.katex', cl);
      for (let i = 0; i < ok1.length; i++) {
        const c = await html2canvas(ok1[i], { scale: 2, backgroundColor: null, logging: false });
        const img = document.createElement('img');
        img.src = c.toDataURL('image/png'); img.width = Math.round(c.width / 2); img.height = Math.round(c.height / 2);
        img.style.verticalAlign = 'middle';
        (ck[i].closest('.katex-display') || ck[i]).replaceWith(img);
      }
      const os = $$('.figure svg', body), cs = $$('.figure svg', cl);
      for (let i = 0; i < os.length; i++) {
        const src = await svgToPng(os[i]); const img = document.createElement('img');
        img.src = src; img.width = os[i].width.baseVal.value; img.height = os[i].height.baseVal.value; cs[i].replaceWith(img);
      }
      const oi = $$('img.ex-img, img.h-logo', body), ci = $$('img.ex-img, img.h-logo', cl);
      oi.forEach((im, i) => { ci[i].width = Math.round(im.offsetWidth * 0.75); ci[i].height = Math.round(im.offsetHeight * 0.75); ci[i].removeAttribute('style'); });
      $$('.blank', cl).forEach(n => n.replaceWith(document.createTextNode(' ……………… ')));
      $$('.box', cl).forEach(n => n.replaceWith(document.createTextNode('☐ ')));
      $$('table', cl).forEach(t => t.setAttribute('dir', dir));
      $$('p,div,li,h2,h3,td,th', cl).forEach(n => { n.setAttribute('dir', dir); if (!n.classList.contains('h-mid') && !n.classList.contains('c') && !n.classList.contains('n') && !/good-luck|corr-title|figure/.test(n.className)) n.style.textAlign = align; });
      parts.push(`<div dir="${dir}" style="direction:${dir};text-align:${align}">${cl.innerHTML}</div>`);
    }
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${WORD_CSS}</style></head><body dir="${dir}" style="direction:${dir}">${parts.join('<br clear="all" style="page-break-before:always">')}</body></html>`;
    const blob = window.htmlDocx.asBlob(html, { orientation: 'portrait', margins: { top: 850, right: 850, bottom: 850, left: 850 } });
    download(blob, fileName() + '.docx');
  });
  if (ok) toast(T('word_ok'), 'ok');
}
function doPrint() { if (!canExport()) return; closeMenu(); closePop(); window.print(); }

/* =====================================================================
   Save / open (Firestore: users/{uid}/aiExams)
   ===================================================================== */
const examsCol = () => firebase.firestore().collection('users').doc(S.user.uid).collection('aiExams');
async function saveExam() {
  if (!S.user) return;
  if (!S.exercises.some(e => e.status === 'ready')) { toast(T('err_empty'), 'err'); return; }
  const doc = clone({
    title: [S.header.title, S.header.subject].filter(Boolean).join(' — ') || T('app_title'),
    header: S.header, examLang: S.examLang, difficulty: S.difficulty, rows: S.rows, units: S.units, showCorr: S.showCorr,
    book: S.book ? { name: S.book.name, pages: S.book.pages } : null,
    exercises: S.exercises.filter(e => e.status === 'ready').map(e => ({ id: e.id, type: e.type, diff: e.diff, unit: e.unit, points: e.points, data: e.data, images: e.images || [], perm: e.perm || null }))
  });
  if (JSON.stringify(doc).length > 950000) {
    if (doc.book) doc.book.pages = doc.book.pages.map(p => p.slice(0, 2500));
    if (JSON.stringify(doc).length > 950000) { toast(T('err_big'), 'err'); return; }
  }
  doc.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
  const btn = $('#saveBtn'); btn.classList.add('busy');
  try {
    if (S.examId) await examsCol().doc(S.examId).set(doc);
    else S.examId = (await examsCol().add(doc)).id;
    S.dirty = false; toast(T('saved_ok'), 'ok');
  } catch (e) { console.error(e); toast(T('err_save'), 'err'); }
  btn.classList.remove('busy');
}
function openSaved() {
  if (!S.user) return;
  modal({
    title: T('saved_title'),
    build: async (b, api) => {
      b.innerHTML = '<div class="spin"></div>';
      try {
        const snap = await examsCol().orderBy('updatedAt', 'desc').limit(50).get();
        if (snap.empty) { b.innerHTML = `<p class="msg hint">${esc(T('no_saved'))}</p>`; return; }
        const list = el('div', 'saved-list'); b.innerHTML = ''; b.appendChild(list);
        snap.forEach(docSnap => {
          const x = docSnap.data();
          const dt = x.updatedAt && x.updatedAt.toDate ? x.updatedAt.toDate().toLocaleDateString(S.uiLang === 'ar' ? 'ar-DZ' : 'en-GB', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
          const it = el('div', 'saved-it');
          it.innerHTML = `<span class="dd-ic" style="--c:var(--accent)">${svgI('<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 12h6M9 15.5h6"/>')}</span>
            <div class="s-t"><b>${esc(x.title)}</b><small>${esc(dt)} · ${(x.exercises || []).length} ${esc(T('s4'))}</small></div>
            <button type="button" class="btn-main">${esc(T('open_it'))}</button>
            <button type="button" class="u-del" aria-label="${esc(T('remove'))}">${svgI(XT.del)}</button>`;
          $('.btn-main', it).onclick = async () => {
            if (S.dirty && S.exercises.length && !(await confirmBox(T('confirm_new')))) return;
            loadExam(docSnap.id, x); api.close();
          };
          $('.u-del', it).onclick = async () => {
            if (!(await confirmBox(T('confirm_del'), true))) return;
            try { await examsCol().doc(docSnap.id).delete(); it.remove(); if (S.examId === docSnap.id) S.examId = null; toast(T('deleted'), 'ok'); } catch (e) { toast(T('err_save'), 'err'); }
          };
          list.appendChild(it);
        });
      } catch (e) { console.error(e); b.innerHTML = `<p class="msg">${esc(T('err_net'))}</p>`; }
    }
  });
}
function loadExam(id, x) {
  S.examId = id;
  S.header = Object.assign({ school: '', title: '', year: '', stage: 'mid', grade: 4, subject: '', duration: '', teacher: '', logo: '' }, x.header || {});
  S.examLang = x.examLang || 'ar'; S.difficulty = x.difficulty || 'medium';
  S.units = x.units || []; S.book = x.book || null; S.pdf = null;
  S.showCorr = x.showCorr !== false; $('#corrToggle').checked = S.showCorr;
  S.exercises = (x.exercises || []).map(e => Object.assign({ history: [], images: [], status: 'ready' }, e));
  S.rows = x.rows && x.rows.length === S.exercises.length ? x.rows : S.exercises.map(e => ({ type: e.type, unit: e.unit || 'all', diff: e.diff || 'medium', points: e.points }));
  syncHeaderInputs(); renderBookInfo(); renderUnits(); renderRows(); updateGenBtn(); renderPaper();
  S.dirty = false; toast(T('loaded_ok'), 'ok'); showPane('stage');
}
async function newExam() {
  if (S.busy) return;
  if (S.exercises.length && S.dirty && !(await confirmBox(T('confirm_new')))) return;
  S.examId = null; S.book = null; S.pdf = null; S.units = []; S.exercises = []; S.rows = [];
  setCount(4); renderBookInfo(); renderUnits(); renderPaper(); updateGenBtn(); showPane('side');
  S.dirty = false;
}

/* =====================================================================
   Wiring
   ===================================================================== */
function showPane(p) {
  $('.shell').classList.toggle('show-stage', p === 'stage');
  $$('.mtab').forEach(t => t.classList.toggle('on', t.dataset.pane === p));
  if (p === 'stage' && S.zoomAuto) requestAnimationFrame(fitZoom);
}
function init() {
  fillDatalists();
  initHeader();
  makeDD($('#ddDiffAll'), diffOpts, S.difficulty, v => { S.difficulty = v; S.rows.forEach(r => { r.diff = v; }); markDirty(); renderRows(); });
  setCount(4); S.dirty = false;

  const drop = $('#drop');
  $('#bookFile').onchange = e => { const f = e.target.files[0]; e.target.value = ''; handleBook(f); };
  ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
  drop.addEventListener('drop', e => handleBook(e.dataTransfer.files[0]));
  $('#addUnitBtn').onclick = () => { S.units.push({ id: uid(), title: `${T('unit')} ${S.units.length + 1}`, from: 1, to: S.book.pages.length, on: true }); markDirty(); renderUnits(); refreshUnitDDs(); };
  $('#cntMinus').onclick = () => setCount(S.rows.length - 1);
  $('#cntPlus').onclick = () => setCount(S.rows.length + 1);
  $('#balanceBtn').onclick = () => { const p = splitPoints(20, S.rows.length); S.rows.forEach((r, i) => { r.points = p[i]; if (S.exercises[i]) S.exercises[i].points = p[i]; }); markDirty(); renderRows(); if (S.exercises.length) renderPaper(); };
  $('#genBtn').onclick = generate;

  $('#newBtn').onclick = newExam;
  $('#openBtn').onclick = openSaved;
  $('#saveBtn').onclick = saveExam;
  $('#printBtn').onclick = doPrint;
  $('#pdfBtn').onclick = exportPdf;
  $('#wordBtn').onclick = exportWord;
  $('#langBtn').onclick = () => {
    S.uiLang = S.uiLang === 'ar' ? 'en' : 'ar';
    try { localStorage.setItem('site_lang', S.uiLang); } catch (e) { /* ignore */ }
    applyUI(); if (S.gateState && S.gateState !== 'open') gate(S.gateState);
  };

  $('#zIn').onclick = () => setZoom(S.zoom + 0.1);
  $('#zOut').onclick = () => setZoom(S.zoom - 0.1);
  $('#zFit').onclick = fitZoom;
  $('#stageScroll').addEventListener('wheel', e => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); setZoom(S.zoom - Math.sign(e.deltaY) * 0.08); } }, { passive: false });
  $('#corrToggle').onchange = e => { S.showCorr = e.target.checked; markDirty(); renderPaper(); };
  $$('.mtab').forEach(t => t.onclick = () => showPane(t.dataset.pane));
  addEventListener('resize', debounce(() => { closeMenu(); if (S.zoomAuto) fitZoom(); }, 150));
  addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); saveExam(); }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') { e.preventDefault(); doPrint(); }
  });
  addEventListener('beforeunload', e => { if (S.dirty && S.exercises.some(x => x.status === 'ready')) { e.preventDefault(); e.returnValue = ''; } });

  applyUI();
  renderPaper();
  fitZoom();
  startGate();
}
init();
})();
