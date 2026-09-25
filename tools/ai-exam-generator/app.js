/* =====================================================================
   مولّد الامتحانات بالذكاء الاصطناعي — AI Exam Generator (merabti.com)
   ===================================================================== */
'use strict';
(() => {

/* اجعلها false عندما تقرر فتح الأداة للجميع (وغيّر أيضًا EXAM_REQUIRE_ADMIN في الدالة) */
const TOOL_LOCKED = true;

const MAX_PASTE = 3500;
const MAX_EX = 8;
const MAX_WAITS = 3;
const A4_W = 794;
const LIBS = {
  h2c: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  jspdf: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  docx: 'https://cdn.jsdelivr.net/npm/html-docx-js@0.3.1/dist/html-docx.js'
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const uid = () => Math.random().toString(36).slice(2, 10);
const clone = o => JSON.parse(JSON.stringify(o));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const txt = s => esc(s).replace(/\n/g, '<br>');
const svgI = (d, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24">${d}</svg>`;

/* ---------------- UI texts ---------------- */
const UI = {
  ar: {
    app_title: 'مولّد الامتحانات الذكي', new: 'امتحان جديد', open: 'امتحاناتي المحفوظة', save: 'حفظ',
    print: 'طباعة', pdf: 'تحميل PDF', word: 'تحميل Word', admin: 'إدارة وحدات المنهاج',
    tab_settings: 'الإعدادات', tab_preview: 'المعاينة',
    s1: 'المنهاج والمستوى', curriculum: 'المنهاج', cur_dz: 'الجزائري', stage: 'الطور', grade: 'السنة', stream: 'الشعبة', subject: 'المادة',
    st_pri: 'ابتدائي', st_mid: 'متوسط', st_sec: 'ثانوي',
    s2: 'الوحدات', units_none: 'لا توجد وحدات جاهزة لهذه المادة بعد. اكتب عنوان الوحدة أو الدرس أدناه.',
    unit_ph: 'أضف وحدة أو درسًا غير موجود في القائمة', custom: 'مضافة',
    paste_t: 'لصق نص الدرس (اختياري)', paste_hint: 'إذا ألصقت نص درسك، تُبنى التمارين منه مباشرة بدل المنهاج العام.',
    chars: '{n} / 3500 حرف', paste_on: 'مفعّل',
    s3: 'معلومات الامتحان', school: 'المؤسسة', year: 'السنة الدراسية', duration: 'المدة', teacher: 'الأستاذ(ة)',
    exam_title: 'عنوان الامتحان', exam_lang: 'لغة الامتحان', logo: 'الشعار (اختياري)', logo_add: 'إضافة شعار', remove: 'حذف',
    s4: 'التمارين', difficulty_all: 'صعوبة الامتحان', add_ex: 'إضافة تمرين', ex_n: 'التمرين',
    ex_type: 'نوع التمرين', ex_unit: 'الوحدة', ex_diff: 'الصعوبة', f_points: 'النقاط', note: 'ملاحظة (اختياري)',
    note_ph: 'مثال: أسئلة متدرجة، أمثلة من الحياة اليومية، أضف منحنى…',
    gen_one: 'ولّد هذا التمرين', regen_one: 'أعد توليد التمرين', all_units: 'كل الوحدات المختارة',
    points_short: 'ن', total: 'المجموع', balance: 'توزيع تلقائي على 20',
    chip_ready: 'جاهز', chip_loading: 'جاري الكتابة', chip_waiting: 'انتظار {s} ث', chip_error: 'خطأ', chip_idle: 'لم يُولَّد',
    easy: 'سهل', medium: 'متوسط', hard: 'صعب',
    d_easy: 'تذكّر وتطبيق مباشر', d_medium: 'فهم وتطبيق', d_hard: 'تحليل واستدلال',
    t_qcm: 'اختيار من متعدد (QCM)', t_tf: 'صح أو خطأ', t_fill: 'املأ الفراغ', t_match: 'صِل بين العمودين',
    t_direct: 'أسئلة مباشرة', t_problem: 'تمرين تطبيقي / مسألة', t_situation: 'وضعية إدماجية', t_document: 'تحليل وثيقة أو نص',
    t_ar_comp: 'فهم النص', t_ar_lang: 'الأسئلة اللغوية والإعراب', t_ar_rhet: 'البلاغة', t_ar_dict: 'الإملاء', t_ar_write: 'الإنتاج الكتابي',
    t_fr_comp: "Compréhension de l'écrit", t_fr_vocab: 'Vocabulaire', t_fr_gram: 'Grammaire et conjugaison', t_fr_ortho: 'Orthographe', t_fr_prod: 'Production écrite',
    t_en_read: 'Reading comprehension', t_en_vocab: 'Vocabulary', t_en_gram: 'Grammar', t_en_phon: 'Phonetics', t_en_write: 'Written expression',
    country: 'الدولة', other_country: 'اسم الدولة', spec: 'التخصص', module: 'المقياس', spec_ph: 'مثال: إلكتروتقني', module_ph: 'مثال: إلكترونيك الاستطاعة',
    st_uni: 'الجامعة', lic: 'ليسانس', mas: 'ماستر', n_units: '{n} وحدات مختارة', no_units_sel: 'لم تُختر وحدة بعد', pasted: 'نص ملصق',
    n_ex: '{n} تمارين', word_prog: 'جاري تجهيز ملف Word… {i} من {n}', hint_title: 'رأس امتحانك جاهز', hint_sub: 'أكمل معلومات الامتحان وسترى التغييرات هنا مباشرة، ثم ولّد أول تمرين من بطاقة التمرين.',
    zoom_fit: 'ملاءمة العرض', show_corr: 'التصحيح النموذجي',
    empty_title: 'امتحانك سيظهر هنا', empty_sub: 'اختر المستوى والمادة والوحدات، ثم اضغط «ولّد هذا التمرين» في بطاقة التمرين، وشاهده يُكتب أمامك.',
    e1: 'المستوى', e2: 'الوحدات', e3: 'التمرين', e4: 'ولّد',
    writing: 'جاري كتابة التمرين…', waiting_q: 'حصة Groq ممتلئة لهذه الدقيقة، ستُعاد المحاولة تلقائيًا بعد {s} ث…', retry: 'أعد المحاولة',
    regen: 'تمرين آخر', regen_title: 'توليد تمرين آخر', regen_go: 'ولّد تمرينًا جديدًا', regen_note_ph: 'طلب اختياري: أسهل، أضف منحنى، ركّز على…',
    undo: 'تراجع', edit: 'تعديل', image: 'إضافة صورة', up: 'إلى الأعلى', down: 'إلى الأسفل', del: 'حذف التمرين',
    ed_title: 'تعديل التمرين', f_title: 'موضوع التمرين', f_ins: 'التعليمة', f_intro: 'النص أو السند',
    f_text: 'النص', f_answer: 'الإجابة', f_corr: 'التصحيح أو التبرير', f_true: 'صحيحة', f_false: 'خاطئة',
    f_answers: 'إجابات الفراغات (افصل بينها بـ ؛)', f_left: 'العمود أ', f_right: 'العمود ب', f_opt: 'اقتراح',
    add_item: 'إضافة سؤال', images: 'الصور', graph: 'المنحنى', g_expr: 'الدالة بدلالة x، مثل x^2-2*x+1',
    g_from: 'x من', g_to: 'إلى', g_caption: 'تعليق المنحنى', g_hint: 'مسموح: + - * / ^ sin cos tan exp log sqrt abs pi',
    save_edit: 'حفظ التعديلات', cancel: 'إلغاء', close: 'إغلاق', size: 'الحجم',
    saved_title: 'امتحاناتي المحفوظة', no_saved: 'لا توجد امتحانات محفوظة بعد.', open_it: 'فتح',
    saved_ok: 'تم حفظ الامتحان', loaded_ok: 'تم فتح الامتحان', deleted: 'تم الحذف',
    confirm: 'تأكيد', confirm_new: 'سيتم مسح الامتحان الحالي غير المحفوظ. هل تريد البدء من جديد؟',
    confirm_del: 'هل تريد حذف هذا الامتحان نهائيًا؟', confirm_del_ex: 'هل تريد حذف هذا التمرين؟',
    err_nounits: 'اختر وحدة واحدة على الأقل أو ألصق نص الدرس.', err_gen: 'تعذّر توليد التمرين.', err_net: 'تعذّر الاتصال بالخادم، تحقق من الإنترنت.',
    err_limit: 'حصة Groq ممتلئة حاليًا، أعد المحاولة بعد دقيقة.', err_perm: 'هذه الأداة غير متاحة لحسابك بعد.',
    err_export: 'تعذّر إنشاء الملف، أعد المحاولة.', err_empty: 'ولّد تمرينًا واحدًا على الأقل، وانتظر اكتمال التوليد.', err_save: 'تعذّر الحفظ.',
    err_big: 'الامتحان كبير جدًا للحفظ بسبب الصور. صغّر الصور أو احذف بعضها.', err_busy: 'انتظر حتى ينتهي التمرين الجاري.', max_ex: 'الحد الأقصى 8 تمارين.',
    exporting: 'جاري تجهيز الملف…', pdf_ok: 'تم تحميل ملف PDF', word_ok: 'تم تحميل ملف Word',
    gate_check: 'جاري التحقق…', gate_login: 'سجّل الدخول أولًا', gate_login_t: 'هذه الأداة تتطلب تسجيل الدخول من الصفحة الرئيسية للموقع.',
    gate_login_b: 'الذهاب إلى الصفحة الرئيسية', gate_soon: 'قريبًا ✨', gate_soon_t: 'نعمل على تجهيز هذه الأداة بعناية، وستكون متاحة قريبًا.',
    gate_err: 'تعذّر تحميل الأداة، أعد تحميل الصفحة.',
    adm_title: 'إدارة وحدات المنهاج', adm_hint: 'اكتب كل وحدة في سطر مستقل. تُحفظ في Firebase وتظهر لكل الأساتذة.',
    adm_all_streams: 'كل الشعب', adm_src_def: 'القائمة الافتراضية المدمجة في الأداة', adm_src_fb: 'قائمة معدّلة محفوظة في Firebase', adm_src_none: 'لا توجد قائمة بعد',
    adm_reset: 'استرجاع الافتراضي', adm_save: 'حفظ الوحدات', adm_saved: 'تم حفظ الوحدات'
  },
  en: {
    app_title: 'Smart Exam Generator', new: 'New exam', open: 'My saved exams', save: 'Save',
    print: 'Print', pdf: 'Download PDF', word: 'Download Word', admin: 'Manage curriculum units',
    tab_settings: 'Settings', tab_preview: 'Preview',
    s1: 'Curriculum and level', curriculum: 'Curriculum', cur_dz: 'Algerian', stage: 'Stage', grade: 'Year', stream: 'Stream', subject: 'Subject',
    st_pri: 'Primary', st_mid: 'Middle', st_sec: 'Secondary',
    s2: 'Units', units_none: 'No ready-made units for this subject yet. Type the unit or lesson title below.',
    unit_ph: 'Add a unit or lesson not in the list', custom: 'added',
    paste_t: 'Paste the lesson text (optional)', paste_hint: 'If you paste your lesson, exercises are built from it instead of the general curriculum.',
    chars: '{n} / 3500 characters', paste_on: 'on',
    s3: 'Exam details', school: 'School', year: 'School year', duration: 'Duration', teacher: 'Teacher',
    exam_title: 'Exam title', exam_lang: 'Exam language', logo: 'Logo (optional)', logo_add: 'Add logo', remove: 'Remove',
    s4: 'Exercises', difficulty_all: 'Exam difficulty', add_ex: 'Add exercise', ex_n: 'Exercise',
    ex_type: 'Exercise type', ex_unit: 'Unit', ex_diff: 'Difficulty', f_points: 'Points', note: 'Note (optional)',
    note_ph: 'e.g. progressive questions, everyday examples, add a curve…',
    gen_one: 'Generate this exercise', regen_one: 'Regenerate exercise', all_units: 'All selected units',
    points_short: 'pts', total: 'Total', balance: 'Split 20 points evenly',
    chip_ready: 'Ready', chip_loading: 'Writing', chip_waiting: 'Wait {s}s', chip_error: 'Error', chip_idle: 'Not generated',
    easy: 'Easy', medium: 'Medium', hard: 'Hard',
    d_easy: 'Recall and direct use', d_medium: 'Understanding and application', d_hard: 'Analysis and reasoning',
    t_qcm: 'Multiple choice (QCM)', t_tf: 'True or false', t_fill: 'Fill in the blanks', t_match: 'Match the columns',
    t_direct: 'Direct questions', t_problem: 'Applied exercise / problem', t_situation: 'Integration situation', t_document: 'Document or text analysis',
    t_ar_comp: 'Arabic: text comprehension', t_ar_lang: 'Arabic: grammar and parsing', t_ar_rhet: 'Arabic: rhetoric', t_ar_dict: 'Arabic: spelling', t_ar_write: 'Arabic: written production',
    t_fr_comp: "Compréhension de l'écrit", t_fr_vocab: 'Vocabulaire', t_fr_gram: 'Grammaire et conjugaison', t_fr_ortho: 'Orthographe', t_fr_prod: 'Production écrite',
    t_en_read: 'Reading comprehension', t_en_vocab: 'Vocabulary', t_en_gram: 'Grammar', t_en_phon: 'Phonetics', t_en_write: 'Written expression',
    country: 'Country', other_country: 'Country name', spec: 'Specialty', module: 'Module', spec_ph: 'e.g. Electrical engineering', module_ph: 'e.g. Power electronics',
    st_uni: 'University', lic: 'Licence', mas: 'Master', n_units: '{n} units selected', no_units_sel: 'No unit selected yet', pasted: 'pasted text',
    n_ex: '{n} exercises', word_prog: 'Preparing the Word file… {i} of {n}', hint_title: 'Your exam header is ready', hint_sub: 'Fill in the exam details and see the changes here instantly, then generate the first exercise from its card.',
    zoom_fit: 'Fit width', show_corr: 'Answer key',
    empty_title: 'Your exam will appear here', empty_sub: 'Choose the level, subject and units, then press “Generate this exercise” on the exercise card and watch it being written.',
    e1: 'Level', e2: 'Units', e3: 'Exercise', e4: 'Generate',
    writing: 'Writing the exercise…', waiting_q: 'Groq quota is full for this minute; retrying automatically in {s}s…', retry: 'Try again',
    regen: 'Another exercise', regen_title: 'Generate another exercise', regen_go: 'Generate a new exercise', regen_note_ph: 'Optional request: easier, add a curve, focus on…',
    undo: 'Undo', edit: 'Edit', image: 'Add image', up: 'Move up', down: 'Move down', del: 'Delete exercise',
    ed_title: 'Edit exercise', f_title: 'Topic', f_ins: 'Instruction', f_intro: 'Text or context',
    f_text: 'Text', f_answer: 'Answer', f_corr: 'Correction or justification', f_true: 'True', f_false: 'False',
    f_answers: 'Blank answers (separate with ;)', f_left: 'Column A', f_right: 'Column B', f_opt: 'Option',
    add_item: 'Add question', images: 'Images', graph: 'Curve', g_expr: 'Function of x, e.g. x^2-2*x+1',
    g_from: 'x from', g_to: 'to', g_caption: 'Caption', g_hint: 'Allowed: + - * / ^ sin cos tan exp log sqrt abs pi',
    save_edit: 'Save changes', cancel: 'Cancel', close: 'Close', size: 'Size',
    saved_title: 'My saved exams', no_saved: 'No saved exams yet.', open_it: 'Open',
    saved_ok: 'Exam saved', loaded_ok: 'Exam opened', deleted: 'Deleted',
    confirm: 'Confirm', confirm_new: 'The current unsaved exam will be cleared. Start over?',
    confirm_del: 'Delete this exam permanently?', confirm_del_ex: 'Delete this exercise?',
    err_nounits: 'Select at least one unit or paste the lesson text.', err_gen: 'Could not generate the exercise.', err_net: 'Could not reach the server, check your internet.',
    err_limit: 'Groq quota is full right now; try again in a minute.', err_perm: 'This tool is not available for your account yet.',
    err_export: 'Could not create the file, try again.', err_empty: 'Generate at least one exercise and wait until it finishes.', err_save: 'Saving failed.',
    err_big: 'The exam is too large to save because of its images. Make them smaller or remove some.', err_busy: 'Wait until the current exercise finishes.', max_ex: 'The limit is 8 exercises.',
    exporting: 'Preparing the file…', pdf_ok: 'PDF downloaded', word_ok: 'Word file downloaded',
    gate_check: 'Checking…', gate_login: 'Please sign in', gate_login_t: 'This tool requires signing in from the site home page.',
    gate_login_b: 'Go to the home page', gate_soon: 'Coming soon ✨', gate_soon_t: 'We are carefully preparing this tool; it will be available soon.',
    gate_err: 'The tool could not load; reload the page.',
    adm_title: 'Manage curriculum units', adm_hint: 'One unit per line. Saved in Firebase and shown to every teacher.',
    adm_all_streams: 'All streams', adm_src_def: 'Built-in default list', adm_src_fb: 'Edited list saved in Firebase', adm_src_none: 'No list yet',
    adm_reset: 'Restore default', adm_save: 'Save units', adm_saved: 'Units saved'
  }
};

/* ---------------- Algerian curriculum ---------------- */
const STREAMS = {
  1: [{ v: 'cst', ar: 'جذع مشترك علوم وتكنولوجيا', fr: 'Tronc commun sciences et technologie', en: 'Common core: science and technology' },
      { v: 'cla', ar: 'جذع مشترك آداب', fr: 'Tronc commun lettres', en: 'Common core: letters' }],
  2: [{ v: 'se', ar: 'علوم تجريبية', fr: 'Sciences expérimentales', en: 'Experimental sciences' },
      { v: 'm', ar: 'رياضيات', fr: 'Mathématiques', en: 'Mathematics' },
      { v: 'tm', ar: 'تقني رياضي', fr: 'Technique mathématique', en: 'Technical mathematics' },
      { v: 'ge', ar: 'تسيير واقتصاد', fr: 'Gestion et économie', en: 'Management and economics' },
      { v: 'lp', ar: 'آداب وفلسفة', fr: 'Lettres et philosophie', en: 'Letters and philosophy' },
      { v: 'le', ar: 'لغات أجنبية', fr: 'Langues étrangères', en: 'Foreign languages' }]
};
STREAMS[3] = STREAMS[2];
const SUBJ = {
  math: { ar: 'الرياضيات', fr: 'Mathématiques', en: 'Mathematics' },
  phys: { ar: 'العلوم الفيزيائية', fr: 'Sciences physiques', en: 'Physical sciences', mid_ar: 'العلوم الفيزيائية والتكنولوجيا', mid_fr: 'Sciences physiques et technologie', mid_en: 'Physics and technology' },
  svt: { ar: 'علوم الطبيعة والحياة', fr: 'Sciences de la nature et de la vie', en: 'Natural and life sciences' },
  sci: { ar: 'التربية العلمية والتكنولوجية', fr: 'Éducation scientifique et technologique', en: 'Science and technology' },
  arab: { ar: 'اللغة العربية', fr: 'Langue arabe', en: 'Arabic' },
  fren: { ar: 'اللغة الفرنسية', fr: 'Langue française', en: 'French' },
  engl: { ar: 'اللغة الإنجليزية', fr: 'Langue anglaise', en: 'English' },
  hg: { ar: 'التاريخ والجغرافيا', fr: 'Histoire et géographie', en: 'History and geography' },
  isl: { ar: 'التربية الإسلامية', fr: 'Éducation islamique', en: 'Islamic education' },
  civ: { ar: 'التربية المدنية', fr: 'Éducation civique', en: 'Civic education' },
  info: { ar: 'الإعلام الآلي', fr: 'Informatique', en: 'Computer science' },
  philo: { ar: 'الفلسفة', fr: 'Philosophie', en: 'Philosophy' }
};
const SUBJ_BY_STAGE = {
  pri: ['math', 'arab', 'sci', 'fren', 'engl', 'isl', 'civ', 'hg'],
  mid: ['math', 'phys', 'svt', 'arab', 'fren', 'engl', 'hg', 'isl', 'civ', 'info'],
  sec: ['math', 'phys', 'svt', 'arab', 'fren', 'engl', 'hg', 'isl', 'philo', 'info']
};
/* Built-in units — the admin can correct any list from the tool (saved in Firestore). */
const M3AS = ['النهايات والاستمرارية', 'الاشتقاقية ودراسة الدوال', 'الدالة الأسية', 'الدالة اللوغاريتمية', 'المتتاليات العددية', 'الدوال الأصلية والحساب التكاملي', 'الأعداد المركبة والتحويلات النقطية', 'الاحتمالات', 'الهندسة في الفضاء'];
const CATALOG = {
  'mid-1-math': ['الأعداد الطبيعية والأعداد العشرية', 'العمليات على الأعداد الطبيعية والعشرية', 'القسمة الإقليدية والقسمة العشرية', 'الكسور', 'الأعداد النسبية', 'الحساب الحرفي والمعادلات', 'التناسبية', 'تنظيم معطيات', 'المستقيمات المتوازية والمتعامدة', 'الزوايا', 'التناظر المحوري', 'المثلثات والدائرة', 'المحيطات والمساحات', 'متوازي المستطيلات والمكعب'],
  'mid-2-math': ['العمليات على الأعداد الطبيعية والعشرية', 'الكسور', 'الأعداد النسبية', 'الحساب الحرفي', 'المعادلات من الدرجة الأولى', 'التناسبية', 'تنظيم معطيات والإحصاء', 'التناظر المركزي', 'الزوايا', 'المثلثات', 'متوازي الأضلاع', 'الموشور القائم وأسطوانة الدوران'],
  'mid-3-math': ['العمليات على الأعداد النسبية', 'الأعداد الناطقة (الكسور)', 'القوى ذات الأسس الصحيحة', 'الحساب الحرفي والنشر', 'المعادلات من الدرجة الأولى', 'التناسبية والدالة الخطية', 'الإحصاء', 'المثلث القائم والدائرة', 'خاصية فيثاغورس', 'جيب تمام زاوية حادة', 'مستقيم المنتصفين في مثلث', 'الانسحاب', 'الهرم ومخروط الدوران'],
  'mid-4-math': ['الأعداد الطبيعية والأعداد الناطقة (القاسم المشترك الأكبر)', 'الجذور التربيعية', 'الحساب الحرفي (النشر والتحليل والمتطابقات الشهيرة)', 'المعادلات والمتراجحات من الدرجة الأولى', 'جملة معادلتين من الدرجة الأولى بمجهولين', 'الدالة الخطية والدالة التآلفية', 'الإحصاء', 'خاصية طالس', 'حساب المثلثات في المثلث القائم', 'الأشعة والانسحاب', 'المعالم في المستوي', 'الدوران والزوايا والمضلعات المنتظمة', 'الهندسة في الفضاء (الكرة والجلة)'],
  'mid-1-phys': ['المادة وتحولاتها: حالات المادة وخصائصها', 'المادة وتحولاتها: الكتلة والحجم', 'الظواهر الميكانيكية: مقاربة أولية للقوة', 'الظواهر الكهربائية: الدارة الكهربائية البسيطة', 'الظواهر الكهربائية: النواقل والعوازل', 'الظواهر الضوئية: الضوء ومصادره وانتشاره', 'الظواهر الفلكية: الظل والكسوف والخسوف'],
  'mid-2-phys': ['المادة وتحولاتها: الخلائط والأجسام النقية', 'المادة وتحولاتها: الماء في الطبيعة', 'المادة وتحولاتها: التحول الكيميائي (الاحتراق)', 'الظواهر الميكانيكية: الحركة والسكون', 'الظواهر الكهربائية: الدارة الكهربائية والتيار', 'الظواهر الكهربائية: الأخطار الكهربائية', 'الظواهر الضوئية: الرؤية والألوان'],
  'mid-3-phys': ['المادة وتحولاتها: النموذج الجزيئي والذري', 'المادة وتحولاتها: التحول الكيميائي والمعادلة الكيميائية', 'الظواهر الميكانيكية: القوة والثقل والكتلة', 'الظواهر الميكانيكية: الأفعال المتبادلة', 'الظواهر الكهربائية: قانون أوم', 'الظواهر الكهربائية: التيار المتناوب', 'الظواهر الكهربائية: الاستطاعة والطاقة الكهربائية', 'الظواهر الضوئية: انعكاس الضوء وانكساره'],
  'mid-4-phys': ['المادة وتحولاتها: المحاليل الشاردية', 'المادة وتحولاتها: التحليل الكهربائي البسيط', 'المادة وتحولاتها: الأحماض والأسس (pH)', 'الظواهر الميكانيكية: القوة والحركة', 'الظواهر الميكانيكية: مبدأ العطالة', 'الظواهر الكهربائية: الكهرباء الساكنة', 'الظواهر الكهربائية: التحريض الكهرومغناطيسي والمنوبة', 'الظواهر الضوئية: العدسات والرؤية', 'الظواهر الفلكية: الحركات في النظام الشمسي'],
  'mid-1-svt': ['التغذية عند الإنسان', 'التنفس عند الإنسان', 'الإطراح عند الإنسان', 'التنوع الحيوي في المحيط', 'تصنيف الكائنات الحية', 'الإنسان والمحيط'],
  'mid-2-svt': ['التغذية عند النبات الأخضر', 'التكاثر عند النبات', 'التكاثر عند الحيوان', 'التوازن الطبيعي وتأثير الإنسان', 'الظواهر الجيولوجية الخارجية (الحت والترسيب)'],
  'mid-3-svt': ['الهضم والامتصاص', 'الدوران الدموي', 'التنفس الخلوي والطاقة', 'الاتصال العصبي والحركة', 'التكاثر عند الإنسان', 'تشكل الصخور'],
  'mid-4-svt': ['الاستجابة المناعية', 'الوراثة وانتقال الصفات', 'التحولات الطاقوية في الخلية', 'الظواهر الجيولوجية الداخلية (الزلازل والبراكين)', 'تكتونية الصفائح'],
  'sec-1-math': ['الأعداد والحساب', 'الدوال (عموميات)', 'الدوال المرجعية', 'المعادلات والمتراجحات', 'الإحصاء', 'الحساب الشعاعي والمعالم', 'معادلات المستقيمات', 'الهندسة في الفضاء'],
  'sec-1-math@cla': ['الأعداد والحساب', 'الدوال (عموميات)', 'المعادلات والمتراجحات', 'الإحصاء'],
  'sec-2-math': ['كثيرات الحدود والمعادلات من الدرجة الثانية', 'الدوال المرجعية وتحويلاتها', 'الاشتقاقية', 'دراسة الدوال', 'المتتاليات العددية', 'الزوايا الموجهة وحساب المثلثات', 'الجداء السلمي', 'الإحصاء والاحتمالات', 'الهندسة في الفضاء'],
  'sec-3-math': M3AS,
  'sec-3-math@m': M3AS.concat(['القسمة في Z والموافقات', 'الأعداد الأولية والقاسم المشترك الأكبر']),
  'sec-3-math@tm': M3AS.concat(['القسمة في Z والموافقات', 'الأعداد الأولية والقاسم المشترك الأكبر']),
  'sec-3-math@ge': ['النهايات والاستمرارية', 'الاشتقاقية ودراسة الدوال', 'الدالة الأسية', 'الدالة اللوغاريتمية', 'المتتاليات العددية', 'الدوال الأصلية والحساب التكاملي', 'الإحصاء', 'الاحتمالات'],
  'sec-3-math@lp': ['المتتاليات العددية', 'الدوال (دراسة وتمثيل)', 'الموافقات والحساب في Z', 'الإحصاء'],
  'sec-3-math@le': ['المتتاليات العددية', 'الدوال (دراسة وتمثيل)', 'الموافقات والحساب في Z', 'الإحصاء'],
  'sec-1-phys': ['الحركة والقوة', 'مقاربة أولية للمادة (البنية الذرية)', 'الجدول الدوري للعناصر', 'المقادير المولية', 'التحول الكيميائي وتقدم التفاعل', 'الضوء والتحليل الطيفي', 'الظواهر الكهربائية'],
  'sec-2-phys': ['العمل والطاقة الحركية', 'الطاقة الكامنة وانحفاظ الطاقة', 'الطاقة الداخلية', 'الطاقة الكهربائية', 'الناقلية الكهربائية للمحاليل الشاردية', 'المعايرة (الأحماض والأسس)', 'الأكسدة والإرجاع', 'الكيمياء العضوية'],
  'sec-3-phys': ['المتابعة الزمنية لتحول كيميائي', 'التحولات النووية', 'الظواهر الكهربائية (RC ،RL ،RLC)', 'تطور جملة كيميائية نحو حالة التوازن', 'تطور جملة ميكانيكية (قوانين نيوتن)', 'الاهتزازات الميكانيكية الحرة', 'مراقبة تطور جملة كيميائية (الأسترة والأعمدة)'],
  'sec-1-svt': ['التغذية والنمو عند الكائنات الحية', 'التنفس والتخمر', 'الخلية ونشاطها', 'النشاط التكاثري', 'الديناميكية الداخلية للكرة الأرضية'],
  'sec-2-svt': ['انتقال الصفات الوراثية', 'التكاثر عند الكائنات الحية', 'التحكم في التكاثر', 'الاستقلاب والطاقة', 'تكتونية الصفائح'],
  'sec-3-svt': ['تركيب البروتين', 'العلاقة بين بنية ووظيفة البروتين', 'النشاط الإنزيمي للبروتينات', 'دور البروتينات في الدفاع عن الذات (المناعة)', 'دور البروتينات في الاتصال العصبي', 'التركيب الضوئي (تحويل الطاقة الضوئية)', 'التنفس والتخمر (إنتاج ATP)', 'التكتونية العامة']
};


/* ---------------- Countries and their school stages ---------------- */
const STAGE_NAMES = {
  pri: { ar: 'ابتدائي', fr: 'primaire', en: 'Primary' },
  mid: { ar: 'متوسط', fr: 'moyen', en: 'Middle school' },
  sec: { ar: 'ثانوي', fr: 'secondaire', en: 'Secondary' },
  uni: { ar: 'الجامعة', fr: 'université', en: 'University' }
};
// [stage, years, Arabic name when different from the default]
const COUNTRIES = [
  { v: 'dz', ar: 'الجزائر', en: 'Algeria', st: [['pri', 5], ['mid', 4], ['sec', 3]] },
  { v: 'ma', ar: 'المغرب', en: 'Morocco', st: [['pri', 6], ['mid', 3, 'الثانوي الإعدادي'], ['sec', 3, 'الثانوي التأهيلي']] },
  { v: 'tn', ar: 'تونس', en: 'Tunisia', st: [['pri', 6], ['mid', 3, 'الإعدادي'], ['sec', 4]] },
  { v: 'ly', ar: 'ليبيا', en: 'Libya', st: [['pri', 6], ['mid', 3, 'الإعدادي'], ['sec', 3]] },
  { v: 'mr', ar: 'موريتانيا', en: 'Mauritania', st: [['pri', 6], ['mid', 4, 'الإعدادي'], ['sec', 3]] },
  { v: 'eg', ar: 'مصر', en: 'Egypt', st: [['pri', 6], ['mid', 3, 'الإعدادي'], ['sec', 3]] },
  { v: 'sd', ar: 'السودان', en: 'Sudan', st: [['pri', 6], ['mid', 3], ['sec', 3]] },
  { v: 'sa', ar: 'السعودية', en: 'Saudi Arabia', st: [['pri', 6], ['mid', 3], ['sec', 3]] },
  { v: 'ae', ar: 'الإمارات', en: 'United Arab Emirates', st: [['pri', 6], ['mid', 3, 'الإعدادي'], ['sec', 3]] },
  { v: 'kw', ar: 'الكويت', en: 'Kuwait', st: [['pri', 5], ['mid', 4], ['sec', 3]] },
  { v: 'qa', ar: 'قطر', en: 'Qatar', st: [['pri', 6], ['mid', 3, 'الإعدادي'], ['sec', 3]] },
  { v: 'bh', ar: 'البحرين', en: 'Bahrain', st: [['pri', 6], ['mid', 3, 'الإعدادي'], ['sec', 3]] },
  { v: 'om', ar: 'عُمان', en: 'Oman', st: [['pri', 4, 'الحلقة الأولى'], ['mid', 6, 'الحلقة الثانية'], ['sec', 2, 'ما بعد الأساسي']] },
  { v: 'ye', ar: 'اليمن', en: 'Yemen', st: [['pri', 9, 'الأساسي'], ['sec', 3]] },
  { v: 'iq', ar: 'العراق', en: 'Iraq', st: [['pri', 6], ['mid', 3], ['sec', 3, 'الإعدادي']] },
  { v: 'sy', ar: 'سوريا', en: 'Syria', st: [['pri', 6, 'الأساسي، الحلقة الأولى'], ['mid', 3, 'الأساسي، الحلقة الثانية'], ['sec', 3]] },
  { v: 'jo', ar: 'الأردن', en: 'Jordan', st: [['pri', 10, 'الأساسي'], ['sec', 2]] },
  { v: 'lb', ar: 'لبنان', en: 'Lebanon', st: [['pri', 6, 'الأساسي'], ['mid', 3], ['sec', 3]] },
  { v: 'ps', ar: 'فلسطين', en: 'Palestine', st: [['pri', 10, 'الأساسي'], ['sec', 2]] },
  { v: 'so', ar: 'الصومال', en: 'Somalia', st: [['pri', 6], ['mid', 3], ['sec', 3]] },
  { v: 'dj', ar: 'جيبوتي', en: 'Djibouti', st: [['pri', 5], ['mid', 4], ['sec', 3]] },
  { v: 'km', ar: 'جزر القمر', en: 'Comoros', st: [['pri', 6], ['mid', 4], ['sec', 3]] },
  { v: 'other', ar: 'دولة أخرى', en: 'Other country', st: [['pri', 6], ['mid', 3], ['sec', 3]] }
];
COUNTRIES.forEach(c => c.st.push(['uni', 5]));

/* ---------------- Exercise types reserved for language subjects ---------------- */
const GENERAL_TYPES = ['qcm', 'tf', 'fill', 'match', 'direct', 'problem', 'situation', 'document'];
const LANG_TYPES = {
  arab: ['ar_comp', 'ar_lang', 'ar_rhet', 'ar_dict', 'ar_write'],
  fren: ['fr_comp', 'fr_vocab', 'fr_gram', 'fr_ortho', 'fr_prod'],
  engl: ['en_read', 'en_vocab', 'en_gram', 'en_phon', 'en_write']
};
const DOC_TYPES = ['document', 'ar_comp', 'ar_lang', 'ar_rhet', 'fr_comp', 'en_read'];
const I_READ = '<path d="M4 5.5A2 2 0 0 1 6 4h5v15H6a2 2 0 0 0-2 1.5z"/><path d="M20 5.5A2 2 0 0 0 18 4h-5v15h5a2 2 0 0 1 2 1.5z"/>';
const I_GRAM = '<path d="M5 19l5-14 5 14"/><path d="M7 14h6"/><path d="M16 9h4M16 13h4M16 17h4"/>';
const I_PEN = '<path d="M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10z"/><path d="M13.5 7.5l3 3"/>';
const I_WORD = '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10v4M10 10l1.5 4 1.5-4M17 10h-2.5v4H17M14.5 12H16.5"/>';
const I_EAR = '<path d="M7 10a5 5 0 1 1 10 0c0 3-3 3.5-3 6.5a2.5 2.5 0 0 1-5 0"/><path d="M10 10a2 2 0 1 1 4 0"/>';
const I_STAR = '<path d="M12 4l2.2 5 5.3.5-4 3.6 1.2 5.2L12 15.6 7.3 18.3l1.2-5.2-4-3.6 5.3-.5z"/>';
const I_SPELL = '<path d="M4 17l3-10 3 10M5 14h4"/><path d="M13 12l3 3 5-6"/>';
const LANG_TYPE_META = {
  ar_comp: ['#0D9488', I_READ], ar_lang: ['#7C4DFF', I_GRAM], ar_rhet: ['#DB2777', I_STAR], ar_dict: ['#E08A00', I_SPELL], ar_write: ['#DC2626', I_PEN],
  fr_comp: ['#0D9488', I_READ], fr_vocab: ['#0891B2', I_WORD], fr_gram: ['#7C4DFF', I_GRAM], fr_ortho: ['#E08A00', I_SPELL], fr_prod: ['#DC2626', I_PEN],
  en_read: ['#0D9488', I_READ], en_vocab: ['#0891B2', I_WORD], en_gram: ['#7C4DFF', I_GRAM], en_phon: ['#2563EB', I_EAR], en_write: ['#DC2626', I_PEN]
};

/* ---------------- More built-in units (Algeria) ---------------- */
const U_ISL = extra => ['القرآن الكريم (السور والآيات المقررة)', 'العقيدة الإسلامية', 'العبادات', 'السيرة النبوية', 'الأخلاق والآداب'].concat(extra);
const U_INFO = ['مكونات الحاسوب', 'نظام التشغيل (الملفات والمجلدات)', 'معالجة النصوص', 'الجداول الإلكترونية', 'العروض التقديمية', 'الإنترنت والبريد الإلكتروني', 'الخوارزميات والبرمجة (Scratch)', 'أمن المعلومات والاستعمال الآمن'];
const U_AR_THEMES = ['القيم الإنسانية', 'الحياة الاجتماعية', 'الهوية الوطنية', 'الطبيعة والبيئة', 'الصحة والرياضة', 'العلم والتكنولوجيا', 'الحياة الثقافية والفنون'];
Object.assign(CATALOG, {
  'pri-1-math': ['الأعداد من 0 إلى 9', 'الأعداد إلى 99', 'الجمع', 'الطرح', 'المقارنة والترتيب', 'الأشكال الهندسية', 'التموضع في الفضاء', 'قياس الأطوال', 'تنظيم معطيات'],
  'pri-2-math': ['الأعداد إلى 999', 'الجمع والطرح', 'الضرب', 'الأعداد الزوجية والفردية', 'الأشكال الهندسية (المربع، المستطيل، المثلث)', 'قياس الأطوال', 'الكتل والسعات', 'النقود', 'الزمن والساعة', 'تنظيم معطيات'],
  'pri-3-math': ['الأعداد إلى 9999', 'العمليات الأربع', 'الضرب في عدد من رقمين', 'القسمة', 'الأطوال والكتل والسعات', 'المحيط', 'الأشكال المستوية والمجسمات', 'الاستقامية والتوازي والتعامد', 'حل المشكلات', 'تنظيم معطيات'],
  'pri-4-math': ['الأعداد إلى 999999', 'العمليات على الأعداد الطبيعية', 'الكسور', 'الأعداد العشرية', 'قياس الأطوال والكتل والسعات', 'المحيط والمساحة', 'الزوايا', 'التناظر المحوري', 'المجسمات', 'التناسبية', 'تنظيم معطيات'],
  'pri-5-math': ['الأعداد الطبيعية الكبيرة', 'العمليات على الأعداد الطبيعية', 'الكسور', 'الأعداد العشرية والعمليات عليها', 'التناسبية والنسبة المئوية', 'السرعة المتوسطة والمقياس', 'المحيطات والمساحات', 'الحجوم', 'الزوايا والمثلثات', 'الدائرة', 'التناظر المحوري', 'تنظيم معطيات'],
  'pri-1-arab': ['الحروف والأصوات', 'المدرسة', 'العائلة', 'الحي', 'الألعاب والتسلية', 'الصحة والتغذية', 'البيئة', 'الأعياد'],
  'pri-2-arab': ['الحياة المدرسية', 'العائلة', 'الحي والقرية', 'الرياضة والتسلية', 'الصحة والتغذية', 'الطبيعة', 'الأسفار والرحلات', 'الأعياد والمناسبات'],
  'pri-3-arab': U_AR_THEMES.concat(['الرحلات والأسفار', 'الجملة الاسمية والجملة الفعلية', 'المفرد والمثنى والجمع']),
  'pri-4-arab': U_AR_THEMES.concat(['الرحلات والأسفار', 'الفاعل والمفعول به', 'المبتدأ والخبر', 'الإملاء: التاء المربوطة والمفتوحة']),
  'pri-5-arab': U_AR_THEMES.concat(['عالم الابتكار والاكتشاف', 'كان وأخواتها', 'إن وأخواتها', 'الأفعال الخمسة', 'الإملاء: الهمزة المتوسطة والمتطرفة']),
  'pri-1-sci': ['جسم الإنسان', 'الحواس', 'النظافة والصحة', 'الحيوانات', 'النباتات', 'الماء', 'الزمن والفصول'],
  'pri-2-sci': ['الإنسان والصحة', 'الحيوانات وأوساط عيشها', 'النبات', 'المادة وعالم الأشياء', 'الماء', 'الزمن'],
  'pri-3-sci': ['التغذية عند الإنسان', 'الحركة والأعضاء', 'الكائنات الحية ومحيطها', 'حالات المادة', 'الماء في الطبيعة', 'التموقع في الفضاء والزمن', 'الدارة الكهربائية البسيطة'],
  'pri-4-sci': ['التغذية عند الإنسان', 'التنفس', 'الكائنات الحية ومحيطها', 'التكاثر عند النبات', 'المادة والطاقة', 'الكهرباء', 'الضوء والظل', 'التحكم التكنولوجي'],
  'pri-5-sci': ['التغذية والهضم', 'الدوران والتنفس', 'التكاثر', 'التوازن البيئي', 'المادة وتحولاتها', 'الطاقة ومصادرها', 'الكهرباء', 'الضوء والظلال', 'الآلات البسيطة'],
  'pri-3-fren': ['Projet 1 : Je me présente, ma famille et mon école', 'Projet 2 : Les jeux et les loisirs', 'Projet 3 : Mon environnement', 'Les lettres et les sons', 'Les articles et les noms', 'Être et avoir au présent'],
  'pri-4-fren': ['Projet 1 : Les règles de vie', 'Projet 2 : Les métiers', 'Projet 3 : La nature', 'Le présent de l\'indicatif', 'Le futur simple', 'Les adjectifs qualificatifs'],
  'pri-5-fren': ['Projet 1 : Les textes documentaires', 'Projet 2 : Le conte', 'Projet 3 : La lettre', 'Le passé composé et l\'imparfait', 'Les types de phrases', 'Le groupe nominal'],
  'pri-3-engl': ['Sequence 1: Me, my family and friends', 'Sequence 2: My school', 'Sequence 3: My home', 'Sequence 4: My playtime', 'Numbers and colours', 'Greetings'],
  'pri-4-engl': ['Sequence 1: Me and my friends', 'Sequence 2: My family', 'Sequence 3: My body', 'Sequence 4: My food', 'Sequence 5: My time'],
  'pri-5-engl': ['Sequence 1: Me and my family', 'Sequence 2: My daily routine', 'Sequence 3: My town', 'Sequence 4: My hobbies', 'Sequence 5: Jobs and places'],
  'pri-1-isl': ['السور القصيرة', 'أركان الإسلام', 'الوضوء', 'قصص الأنبياء', 'آداب الأكل والسلام'],
  'pri-2-isl': ['السور المقررة', 'أركان الإيمان', 'الصلاة', 'مولد الرسول ﷺ', 'الأخلاق الحميدة'],
  'pri-3-isl': U_ISL(['الطهارة والصلاة', 'الصيام']),
  'pri-4-isl': U_ISL(['صلاة الجماعة', 'الزكاة', 'الهجرة النبوية']),
  'pri-5-isl': U_ISL(['الحج', 'الزكاة والصدقة', 'الخلفاء الراشدون']),
  'pri-1-civ': ['الحياة في الأسرة', 'الحياة في المدرسة', 'النظافة والصحة', 'قواعد المرور'],
  'pri-2-civ': ['الأسرة', 'المدرسة', 'الحي', 'الرموز الوطنية', 'السلامة المرورية'],
  'pri-3-civ': ['الحياة الجماعية', 'الحقوق والواجبات', 'الرموز الوطنية', 'حماية البيئة', 'المؤسسات المحلية'],
  'pri-4-civ': ['الحياة المدنية', 'البلدية', 'الحقوق والواجبات', 'الرموز الوطنية', 'الأمن والسلامة'],
  'pri-5-civ': ['الولاية ومؤسساتها', 'الدستور والحقوق', 'الجمعيات والعمل التطوعي', 'المواطنة', 'التضامن'],
  'pri-3-hg': ['التاريخ: الزمن والتسلسل الزمني', 'التاريخ: التاريخ الشخصي والعائلي', 'الجغرافيا: التموقع في الفضاء', 'الجغرافيا: الحي والبلدية'],
  'pri-4-hg': ['التاريخ: أدوات المادة (الزمن والمصادر)', 'التاريخ: شخصيات تاريخية', 'الجغرافيا: المخطط والخريطة', 'الجغرافيا: موقع الجزائر وتضاريسها', 'الجغرافيا: المناخ والسكان'],
  'pri-5-hg': ['التاريخ: الجزائر عبر العصور', 'التاريخ: الثورة التحريرية', 'التاريخ: شخصيات وطنية', 'الجغرافيا: الجزائر (الموقع والتضاريس)', 'الجغرافيا: السكان والنشاطات الاقتصادية', 'الجغرافيا: الموارد والبيئة'],
  'mid-1-arab': U_AR_THEMES.concat(['الجملة الاسمية والجملة الفعلية', 'الفاعل والمفعول به', 'المبتدأ والخبر', 'الإملاء: الهمزات']),
  'mid-2-arab': U_AR_THEMES.concat(['الحال والتمييز', 'المفعول لأجله والمفعول المطلق', 'الأفعال الخمسة', 'النعت والعطف']),
  'mid-3-arab': U_AR_THEMES.concat(['الممنوع من الصرف', 'أسلوب الشرط', 'اسم الفاعل واسم المفعول', 'البلاغة: التشبيه']),
  'mid-4-arab': ['الأخلاق والمجتمع', 'العلم والاكتشافات', 'الإعلام والاتصال', 'الهجرة', 'الصناعات التقليدية', 'الهوية الوطنية', 'الجمل التي لها محل من الإعراب', 'الأساليب (التعجب، المدح والذم، الاستفهام)', 'البلاغة (التشبيه، الاستعارة، الكناية)', 'العروض'],
  'mid-1-fren': ['Projet 1 : Le conte', 'Projet 2 : La fable', 'Projet 3 : Le récit', 'La phrase simple', 'Présent et passé composé', 'Le vocabulaire du conte'],
  'mid-2-fren': ['Projet 1 : Le texte explicatif', 'Projet 2 : Le texte prescriptif', 'Projet 3 : La description', 'Les expansions du nom', "L'impératif et le futur"],
  'mid-3-fren': ['Projet 1 : Le récit (fait divers, biographie)', 'Projet 2 : Le récit historique', 'Projet 3 : La description', 'Les propositions subordonnées', 'Le passé simple et l\'imparfait'],
  'mid-4-fren': ['Projet 1 : Le texte argumentatif', 'Projet 2 : Argumenter pour défendre une cause', "Projet 3 : L'appel", 'Les connecteurs logiques', "La concession et l'opposition", 'Le subjonctif'],
  'mid-1-engl': ['Sequence 1: Me and my friends', 'Sequence 2: Me and my family', 'Sequence 3: Me and my daily activities', 'Sequence 4: Me and my school', 'Sequence 5: Me and my environment', 'Grammar: present simple, to be, have got'],
  'mid-2-engl': ['Sequence 1: Me and my friends', 'Sequence 2: Me and my environment', 'Sequence 3: Me and my health', 'Sequence 4: Me and my customs', 'Sequence 5: Me and the scientific world', 'Grammar: past simple, comparatives'],
  'mid-3-engl': ['Sequence 1: Me, my personality and life experiences', 'Sequence 2: Me and my heritage', 'Sequence 3: Me and the scientific world', 'Sequence 4: Me and the environment', 'Grammar: present perfect, passive voice'],
  'mid-4-engl': ['Sequence 1: Me, my personality and life experiences', 'Sequence 2: Me and my heritage', 'Sequence 3: Me and the scientific world', 'Sequence 4: Me and the environment', 'Grammar: conditionals, reported speech'],
  'mid-1-hg': ['التاريخ: مصادر التاريخ وأدوات المؤرخ', 'التاريخ: الحضارات القديمة (مصر، بلاد الرافدين)', 'التاريخ: الحضارتان الإغريقية والرومانية', 'التاريخ: نوميديا والمغرب القديم', 'الجغرافيا: الأرض في النظام الشمسي', 'الجغرافيا: الخرائط وخطوط الطول والعرض', 'الجغرافيا: التضاريس والمناخ'],
  'mid-2-hg': ['التاريخ: الحضارة الإسلامية', 'التاريخ: الدول الإسلامية في المغرب', 'التاريخ: أوروبا في العصور الوسطى', 'الجغرافيا: السكان والتنمية', 'الجغرافيا: الموارد الطبيعية', 'الجغرافيا: الأقاليم الكبرى في العالم'],
  'mid-3-hg': ['التاريخ: الجزائر في العهد العثماني', 'التاريخ: الاحتلال الفرنسي والمقاومات الشعبية', 'التاريخ: النهضة الأوروبية والثورات', 'الجغرافيا: القارات (إفريقيا، آسيا، أوروبا)', 'الجغرافيا: التحديات الكبرى (المياه، الطاقة)'],
  'mid-4-hg': ['التاريخ: الحركة الوطنية الجزائرية', 'التاريخ: الثورة التحريرية 1954–1962', 'التاريخ: الجزائر المستقلة', 'الجغرافيا: الجزائر (الموقع والسكان)', 'الجغرافيا: الاقتصاد الجزائري', 'الجغرافيا: التنمية المستدامة في الجزائر'],
  'mid-1-isl': U_ISL(['الطهارة والصلاة']), 'mid-2-isl': U_ISL(['الصيام والزكاة']),
  'mid-3-isl': U_ISL(['الحج والعمرة', 'الحديث الشريف']), 'mid-4-isl': U_ISL(['المعاملات (البيع والربا)', 'الحديث الشريف']),
  'mid-1-civ': ['الحياة الجماعية', 'الحقوق والواجبات في المدرسة', 'الرموز الوطنية', 'حماية البيئة', 'التضامن'],
  'mid-2-civ': ['الجماعات المحلية (البلدية والولاية)', 'الحياة الجمعوية', 'المواطنة', 'السلامة المرورية', 'حقوق الطفل'],
  'mid-3-civ': ['الدولة ومؤسساتها', 'الدستور', 'الانتخابات', 'الحقوق والحريات', 'الإعلام'],
  'mid-4-civ': ['حقوق الإنسان', 'المنظمات الدولية', 'التنمية المستدامة', 'المواطنة والمسؤولية', 'الأمن والسلم'],
  'mid-1-info': U_INFO, 'mid-2-info': U_INFO, 'mid-3-info': U_INFO, 'mid-4-info': U_INFO,
  'sec-1-arab': ['الشعر الجاهلي', 'أدب صدر الإسلام', 'الأدب الأموي', 'الخطابة', 'القواعد: المبني والمعرب وأنواع الجمل', 'البلاغة: التشبيه والاستعارة', 'العروض: الطويل والبسيط والكامل'],
  'sec-2-arab': ['الأدب العباسي', 'الأدب الأندلسي', 'أدب عصر الضعف', 'القواعد: الأساليب والإعراب', 'البلاغة: المجاز والكناية والمحسنات البديعية', 'العروض'],
  'sec-3-arab': ['أدب النهضة (الإحياء)', 'الشعر التعليمي', 'الشعر الوجداني', 'الشعر الحر', 'الالتزام في الأدب', 'القصة والمسرحية', 'المقال', 'القواعد: الإعراب المحلي والتقديري', 'البلاغة', 'العروض'],
  'sec-1-fren': ["Projet 1 : L'exposé (vulgarisation scientifique)", "Projet 2 : L'argumentation", 'Projet 3 : La relation d\'événements (le fait divers)', 'Projet 4 : La nouvelle'],
  'sec-2-fren': ['Projet 1 : Le discours objectivé', 'Projet 2 : Le plaidoyer et le réquisitoire', 'Projet 3 : Le reportage touristique', 'Projet 4 : La nouvelle', 'Projet 5 : Le poème'],
  'sec-3-fren': ["Projet 1 : Le texte et le document d'histoire", "Projet 2 : Le débat d'idées", "Projet 3 : L'appel", 'Projet 4 : La nouvelle fantastique'],
  'sec-1-engl': ['Unit 1: Getting through', 'Unit 2: Once upon a time', 'Unit 3: Our findings show', 'Unit 4: Eureka!', 'Unit 5: Back to nature'],
  'sec-2-engl': ['Unit 1: Signs of the time', 'Unit 2: Make peace', 'Unit 3: Waste not, want not', 'Unit 4: Budding scientist', 'Unit 5: News and tales', 'Unit 6: No man is an island'],
  'sec-3-engl': ['Unit 1: Ancient civilizations', 'Unit 2: Ethics in business', 'Unit 3: Education in the world', 'Unit 4: Advertising, consumers and safety', 'Unit 5: Astronomy and the solar system', 'Unit 6: Feelings, emotions and humour'],
  'sec-1-hg': ['التاريخ: العالم الإسلامي من القرن 7 إلى القرن 13', 'التاريخ: التحولات الكبرى في أوروبا', 'التاريخ: الدولة العثمانية', 'الجغرافيا: الوسط الطبيعي والإنسان', 'الجغرافيا: الموارد والتنمية', 'الجغرافيا: الخرائط ووسائل التحليل'],
  'sec-2-hg': ['التاريخ: الحركات الاستعمارية', 'التاريخ: المقاومات والحركة الوطنية', 'التاريخ: العالم بين الحربين', 'الجغرافيا: المبادلات والتنقلات', 'الجغرافيا: الاقتصاد العالمي', 'الجغرافيا: الجزائر في المجال المتوسطي'],
  'sec-3-hg': ['التاريخ: العالم في ظل الثنائية القطبية (1945–1989)', 'التاريخ: من الثنائية إلى الأحادية القطبية', 'التاريخ: الثورة الجزائرية وبناء الدولة', 'الجغرافيا: الاقتصاد العالمي بين التكامل والتنافس', 'الجغرافيا: الولايات المتحدة الأمريكية', 'الجغرافيا: الاتحاد الأوروبي', 'الجغرافيا: جنوب شرق آسيا والصين والهند', 'الجغرافيا: الجزائر والمجال المتوسطي'],
  'sec-1-isl': ['القرآن الكريم وعلومه', 'العقيدة: أركان الإيمان وأدلتها', 'الحديث الشريف', 'العبادات', 'الأخلاق والمعاملات', 'السيرة النبوية'],
  'sec-2-isl': ['القرآن الكريم وعلومه', 'العقيدة', 'الفقه: المعاملات المالية', 'الأسرة في الإسلام', 'الأخلاق', 'القيم الإسلامية'],
  'sec-3-isl': ['وسائل القرآن الكريم في تثبيت العقيدة', 'العقل في القرآن الكريم', 'القيم في القرآن الكريم', 'الصحة النفسية والجسمية في القرآن', 'مقاصد الشريعة الإسلامية', 'المعاملات المالية', 'العلاقات الاجتماعية وحقوق الإنسان', 'الأسرة في الإسلام'],
  'sec-2-philo': ['الفلسفة ومجالاتها', 'المنطق', 'المعرفة', 'الإنسان والطبيعة', 'الأخلاق والسياسة'],
  'sec-3-philo': ['السؤال والمشكلة', 'الإحساس والإدراك', 'اللغة والفكر', 'الذاكرة والخيال', 'الشعور واللاشعور', 'الحرية والمسؤولية', 'العدل والمساواة', 'الأخلاق', 'الرياضيات والمطلق', 'المنطق الصوري', 'الحقيقة'],
  'sec-1-info': ['مفاهيم أساسية في الإعلام الآلي', 'أنظمة التشغيل', 'معالجة النصوص', 'المجدول', 'الإنترنت والشبكات', 'الخوارزميات والبرمجة'],
  'sec-2-info': ['الخوارزميات والبرمجة', 'قواعد البيانات', 'الشبكات', 'الوسائط المتعددة'],
  'sec-3-info': ['الخوارزميات والبرمجة', 'قواعد البيانات', 'الشبكات والإنترنت', 'أمن المعلومات']
});

/* ---------------- Exam-paper texts (exam language) ---------------- */
const ORD_AR = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن'];
const ORD_AR_F = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة', 'السادسة', 'السابعة', 'الثامنة', 'التاسعة', 'العاشرة'];
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
for (const k in LANG_TYPE_META) TYPES[k] = { c: LANG_TYPE_META[k][0], i: LANG_TYPE_META[k][1] };
const TYPE_KEYS = Object.keys(TYPES);
const DIFFS = { easy: '#16A34A', medium: '#E08A00', hard: '#DC2626' };


/* ---------------- State ---------------- */
const S = {
  uiLang: (() => { try { return localStorage.getItem('site_lang') === 'en' ? 'en' : 'ar'; } catch (e) { return 'ar'; } })(),
  user: null, isAdmin: false, overrides: {},
  cur: { sys: 'dz', other: '', stage: 'mid', grade: 4, stream: 'se', subject: 'math', spec: '', module: '' },
  fold: { s1: true, s2: true, s3: true, s4: true },
  units: [],            // { id, title, on, custom }
  paste: '',
  header: { school: '', title: '', year: '2026/2027', duration: '', teacher: '', logo: '' },
  examLang: 'ar',
  difficulty: 'medium',
  exercises: [],        // cards: { id, type, unit, diff, points, note, open, data, history, images, status, err, wait, perm }
  showCorr: true,
  zoom: 1, zoomAuto: true,
  examId: null, dirty: false, busy: false
};
const T = (k, vars) => {
  let s = (UI[S.uiLang] && UI[S.uiLang][k]) || UI.ar[k] || k;
  if (vars) for (const v in vars) s = s.replace(`{${v}}`, vars[v]);
  return s;
};
const tLabel = t => T('t_' + t);
const L = () => EL[S.examLang] || EL.ar;
const shown = () => S.exercises.filter(e => e.status !== 'idle');


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
function toast(msg, kind = '', sticky = false) {
  const el = $('#toast');
  el.textContent = msg; el.className = 'toast show ' + kind + (sticky ? ' sticky' : '');
  clearTimeout(toastTimer);
  if (!sticky) toastTimer = setTimeout(() => { el.className = 'toast'; }, kind === 'err' ? 7000 : 3200);
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
async function compressImage(file, maxW, q = 0.85, png = false) {
  const url = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); });
  return compressDataUrl(url, maxW, q, png);
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
    btn.setAttribute('aria-expanded', 'true');
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
function closeMenu() { $$('.dd-btn[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false')); if (menuEl) { menuEl.remove(); menuEl = null; } if (menuCleanup) { menuCleanup(); menuCleanup = null; } }

const allowedTypes = () => (S.cur.stage !== 'uni' && LANG_TYPES[S.cur.subject]) ? LANG_TYPES[S.cur.subject].concat(GENERAL_TYPES) : GENERAL_TYPES;
const typeOpts = () => allowedTypes().map(k => ({ v: k, label: tLabel(k), icon: TYPES[k].i, color: TYPES[k].c }));
const diffOpts = () => Object.keys(DIFFS).map(k => ({ v: k, label: T(k), desc: T('d_' + k), dot: DIFFS[k] }));
const unitOpts = () => [{ v: 'all', label: T('all_units'), dot: 'var(--accent)' }]
  .concat(S.units.filter(u => u.on).map(u => ({ v: u.id, label: u.title, dot: '#A9C2D3' })));

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
  $$('[data-ph]').forEach(el => { el.placeholder = T(el.dataset.ph); });
  $$('[data-tip]').forEach(el => { el.dataset.tipText = T(el.dataset.tip); el.setAttribute('aria-label', T(el.dataset.tip)); });
  $('#langBtn').textContent = S.uiLang === 'ar' ? 'EN' : 'ع';
  document.title = `${T('app_title')} — Merabti Academy`;
  DD.forEach(d => d.paint());
  renderUnits(); renderCards(); paintPaste(); paintFold();
  if (!shown().length) renderPaper();
}
function fillDatalists() {
  const D = DEFAULTS[S.examLang];
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
    S.user = user; S.isAdmin = isAdmin;
    $('#adminBtn').classList.toggle('hidden', !isAdmin);
    gate('open'); fitZoom();
    await loadOverrides(); rebuildUnits();
  });
}

/* =====================================================================
   Step 1 — country, stage, year, stream / specialty, subject / module
   ===================================================================== */
const lab = (o, lang) => o[lang] || o.ar;
const uil = () => (S.uiLang === 'en' ? 'en' : 'ar');
const country = () => COUNTRIES.find(c => c.v === S.cur.sys) || COUNTRIES[0];
const countryStages = (c = country()) => c.st;
const stageInfo = (st = S.cur.stage, c = country()) => c.st.find(x => x[0] === st) || c.st[0];
const yearsOf = (st, c) => stageInfo(st, c)[1];
const isUni = () => S.cur.stage === 'uni';
function stageName(st, lang, c = country()) {
  const info = stageInfo(st, c);
  if (lang === 'ar' && info[2]) return info[2];
  if (c.v === 'dz' && st === 'mid' && lang === 'fr') return 'moyenne';
  return STAGE_NAMES[st][lang] || STAGE_NAMES[st].ar;
}
function countryName(lang) {
  const c = country();
  if (c.v === 'other') return S.cur.other.trim() || (lang === 'ar' ? 'دولة أخرى' : 'another country');
  return lang === 'ar' ? c.ar : c.en;
}
function subjListFor(st, c = country()) {
  if (st === 'pri' && yearsOf('pri', c) > 6) return SUBJ_BY_STAGE.mid;
  return SUBJ_BY_STAGE[st] || SUBJ_BY_STAGE.mid;
}
function subjLabel(key, lang) {
  if (isUni()) return S.cur.module.trim();
  const s = SUBJ[key]; if (!s) return '';
  return (S.cur.stage === 'mid' && S.cur.sys === 'dz' && s['mid_' + lang]) || s[lang] || s.ar;
}
function streamObj() {
  if (S.cur.sys !== 'dz' || S.cur.stage !== 'sec') return null;
  return (STREAMS[S.cur.grade] || []).find(x => x.v === S.cur.stream) || null;
}
function gradeLabel(g, lang, st = S.cur.stage) {
  if (st === 'uni') {
    const lic = g <= 3, n = lic ? g : g - 3;
    if (lang === 'ar') return `السنة ${ORD_AR_F[n - 1]} ${lic ? 'ليسانس' : 'ماستر'}`;
    if (lang === 'fr') return `${lic ? 'Licence' : 'Master'} ${n}`;
    return `${lic ? 'Bachelor' : 'Master'}, year ${n}`;
  }
  const name = stageName(st, lang);
  if (lang === 'ar') return `السنة ${ORD_AR_F[g - 1] || g} ${name.startsWith('ال') ? 'من ' : ''}${name}`;
  if (S.cur.sys === 'dz' && lang !== 'ar') return EL[lang].level_of(st, g);
  if (lang === 'fr') return `${g}${g === 1 ? 're' : 'e'} année ${name}`;
  return `Year ${g}, ${name}`;
}
const levelBase = lang => gradeLabel(S.cur.grade, lang);
const levelText = () => {
  const st = streamObj();
  if (isUni()) return levelBase(S.examLang) + (S.cur.spec.trim() ? ` — ${S.cur.spec.trim()}` : '');
  return levelBase(S.examLang) + (st ? ` — ${lab(st, S.examLang)}` : '');
};
function catalogKey(withStream) {
  const pre = S.cur.sys === 'dz' ? '' : S.cur.sys + ':';
  const k = `${pre}${S.cur.stage}-${S.cur.grade}-${S.cur.subject}`;
  return withStream && streamObj() ? `${k}@${S.cur.stream}` : k;
}
function catalogUnits() {
  if (isUni() || S.cur.sys === 'other') return [];
  const a = catalogKey(true), b = catalogKey(false);
  return S.overrides[a] || CATALOG[a] || S.overrides[b] || CATALOG[b] || [];
}
function rebuildUnits() {
  const was = new Set(S.units.filter(u => u.on).map(u => u.title));
  const custom = S.units.filter(u => u.custom);
  const cat = catalogUnits();
  S.units = cat.map(t => ({ id: uid(), title: t, on: was.has(t), custom: false }))
    .concat(custom.filter(c => !cat.includes(c.title)));
  S.exercises.forEach(e => { if (e.unit !== 'all' && !S.units.some(u => u.id === e.unit)) e.unit = 'all'; });
  renderUnits(); renderCards(); paintFold();
}
const gradeOpts = () => [...Array(yearsOf(S.cur.stage))].map((_, i) => ({
  v: i + 1,
  label: isUni() ? `${i < 3 ? T('lic') : T('mas')} ${i < 3 ? i + 1 : i - 2}` : (S.uiLang === 'en' ? `Year ${i + 1}` : `السنة ${ORD_AR_F[i] || i + 1}`)
}));
const streamOpts = () => (STREAMS[S.cur.grade] || []).map(x => ({ v: x.v, label: lab(x, uil()) }));
const subjOpts = () => subjListFor(S.cur.stage).map(k => ({ v: k, label: subjLabel(k, uil()) }));
const stageOpts = () => countryStages().map(x => ({ v: x[0], label: x[0] === 'uni' ? T('st_uni') : (S.uiLang === 'en' ? STAGE_NAMES[x[0]].en : stageName(x[0], 'ar')) }));
let ddStage, ddGrade, ddStream, ddSubject;
function fixCur() {
  const c = country();
  if (!c.st.some(x => x[0] === S.cur.stage)) S.cur.stage = c.st[0][0];
  const n = yearsOf(S.cur.stage);
  if (S.cur.grade > n) S.cur.grade = n;
  if (!isUni() && !subjListFor(S.cur.stage).includes(S.cur.subject)) S.cur.subject = subjListFor(S.cur.stage)[0];
  const list = STREAMS[S.cur.grade] || [];
  if (!list.some(x => x.v === S.cur.stream)) S.cur.stream = list[0] ? list[0].v : '';
  $('#otherField').classList.toggle('hidden', c.v !== 'other');
  $('#streamField').classList.toggle('hidden', !(c.v === 'dz' && S.cur.stage === 'sec'));
  $('#subjectField').classList.toggle('hidden', isUni());
  $('#specField').classList.toggle('hidden', !isUni());
  $('#moduleField').classList.toggle('hidden', !isUni());
  if (ddStage) { ddStage.set(S.cur.stage); ddGrade.set(S.cur.grade); ddStream.set(S.cur.stream); ddSubject.set(S.cur.subject); }
}
function fixCardTypes() {
  const ok = allowedTypes();
  S.exercises.forEach(e => { if (e.status === 'idle' && !ok.includes(e.type)) e.type = ok[0]; });
}
function autoExamLang() {
  const want = isUni() ? null : { fren: 'fr', engl: 'en', arab: 'ar' }[S.cur.subject];
  if (want && want !== S.examLang) setExamLang(want);
}
function initCurriculum() {
  makeDD($('#ddCur'), () => COUNTRIES.map(c => ({ v: c.v, label: S.uiLang === 'en' ? c.en : c.ar, dot: c.v === 'other' ? '#A9C2D3' : '#16A34A' })), S.cur.sys, v => { S.cur.sys = v; curChanged(); });
  ddStage = makeDD($('#ddStage'), stageOpts, S.cur.stage, v => { S.cur.stage = v; curChanged(); });
  ddGrade = makeDD($('#ddGrade'), gradeOpts, S.cur.grade, v => { S.cur.grade = v; curChanged(); });
  ddStream = makeDD($('#ddStream'), streamOpts, S.cur.stream, v => { S.cur.stream = v; curChanged(); });
  ddSubject = makeDD($('#ddSubject'), subjOpts, S.cur.subject, v => { S.cur.subject = v; curChanged(); });
  const bindTxt = (id, k) => { const e = $(id); e.value = S.cur[k] || ''; e.oninput = () => { S.cur[k] = e.value; markDirty(); paintFold(); rerender(); }; };
  bindTxt('#curOther', 'other'); bindTxt('#curSpec', 'spec'); bindTxt('#curModule', 'module');
  fixCur();
}
function curChanged() { fixCur(); fixCardTypes(); autoExamLang(); markDirty(); rebuildUnits(); rerender(); }
function syncCurriculum() {
  DD.forEach(d => { if (d.host.id === 'ddCur') d.set(S.cur.sys); });
  $('#curOther').value = S.cur.other || ''; $('#curSpec').value = S.cur.spec || ''; $('#curModule').value = S.cur.module || '';
  fixCur();
}

/* ---------------- Collapsible sections (each one independent) ---------------- */
function initFold() {
  $$('.step').forEach(sec => {
    const k = sec.dataset.step;
    $('.step-h', sec).addEventListener('click', () => { S.fold[k] = !S.fold[k]; paintFold(); });
  });
  paintFold();
}
function paintFold() {
  $$('.step').forEach(sec => {
    const k = sec.dataset.step, f = !!S.fold[k];
    sec.classList.toggle('folded', f);
    $('.step-h', sec).setAttribute('aria-expanded', String(!f));
  });
  const set = (id, t) => { const e = $(id); if (e) e.textContent = t; };
  set('#sum1', [countryName(uil()), gradeLabel(S.cur.grade, uil()), isUni() ? S.cur.module.trim() : subjLabel(S.cur.subject, uil())].filter(Boolean).join(' · '));
  const n = S.units.filter(u => u.on).length;
  set('#sum2', [n ? T('n_units', { n }) : T('no_units_sel'), S.paste.trim() ? T('pasted') : ''].filter(Boolean).join(' · '));
  set('#sum3', [S.header.title, S.header.school, S.header.duration].filter(x => x && x.trim()).join(' · '));
  const tot = S.exercises.reduce((a, e) => a + Number(e.points || 0), 0);
  set('#sum4', `${T('n_ex', { n: S.exercises.length })} · ${fmtNum(tot)} / 20`);
}

/* =====================================================================
   Step 2 — units + pasted lesson
   ===================================================================== */
function renderUnits() {
  const host = $('#unitsList');
  host.innerHTML = '';
  if (!S.units.length) { host.innerHTML = `<div class="units-empty">${esc(T('units_none'))}</div>`; return; }
  S.units.forEach(u => {
    const b = el('div', 'u-item' + (u.on ? ' on' : ''));
    b.setAttribute('role', 'checkbox'); b.setAttribute('aria-checked', u.on); b.tabIndex = 0;
    b.innerHTML = `<span class="check ${u.on ? 'on' : ''}">${svgI('<path d="M5 12l5 5 9-10"/>')}</span><span class="u-t">${esc(u.title)}</span>${u.custom ? `<span class="u-custom">${esc(T('custom'))}</span><button type="button" class="u-del" aria-label="${esc(T('remove'))}">${svgI('<path d="M6 6l12 12M18 6L6 18"/>')}</button>` : ''}`;
    const toggle = () => { u.on = !u.on; markDirty(); renderUnits(); renderCards(); paintFold(); };
    b.addEventListener('click', e => { if (e.target.closest('.u-del')) return; toggle(); });
    b.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); } });
    const del = $('.u-del', b);
    if (del) del.onclick = () => { S.units = S.units.filter(x => x !== u); S.exercises.forEach(x => { if (x.unit === u.id) x.unit = 'all'; }); markDirty(); renderUnits(); renderCards(); };
    host.appendChild(b);
  });
}
function addCustomUnit() {
  const inp = $('#unitInput'), t = inp.value.trim();
  if (!t) return;
  if (!S.units.some(u => u.title === t)) S.units.push({ id: uid(), title: t, on: true, custom: true });
  else S.units.find(u => u.title === t).on = true;
  inp.value = ''; markDirty(); renderUnits(); renderCards(); paintFold();
}
function paintPaste() {
  const n = S.paste.length;
  $('#pasteCount').textContent = T('chars', { n });
  const pill = $('#pastePill'); pill.textContent = T('paste_on'); pill.classList.toggle('hidden', !S.paste.trim());
  $('#pasteClear').classList.toggle('hidden', !n);
  paintFold();
}

/* =====================================================================
   Step 3 — header
   ===================================================================== */
function initHeader() {
  const H = S.header, D = DEFAULTS[S.examLang];
  if (!H.title) H.title = D.title;
  if (!H.duration) H.duration = D.duration;
  const bind = (id, k) => { const e = $(id); e.value = H[k] || ''; e.oninput = () => { H[k] = e.value; markDirty(); paintFold(); rerender(); }; };
  bind('#hSchool', 'school'); bind('#hTitle', 'title'); bind('#hYear', 'year');
  bind('#hDuration', 'duration'); bind('#hTeacher', 'teacher');
  ddExamLang = makeDD($('#ddExamLang'), () => [{ v: 'ar', label: 'العربية' }, { v: 'fr', label: 'Français' }, { v: 'en', label: 'English' }], S.examLang, v => setExamLang(v));
  $('#logoFile').onchange = async e => {
    const f = e.target.files[0]; e.target.value = ''; if (!f) return;
    H.logo = (await compressImage(f, 320, 0.9, true)).src;
    paintLogo(); markDirty(); rerender();
  };
  $('#logoDel').onclick = () => { H.logo = ''; paintLogo(); markDirty(); rerender(); };
  paintLogo();
}
let ddExamLang;
function setExamLang(v) {
  const H = S.header, old = DEFAULTS[S.examLang];
  S.examLang = v;
  if (H.title === old.title) { H.title = DEFAULTS[v].title; $('#hTitle').value = H.title; }
  if (H.duration === old.duration) { H.duration = DEFAULTS[v].duration; $('#hDuration').value = H.duration; }
  if (ddExamLang) ddExamLang.set(v);
  fillDatalists(); markDirty(); renderPaper(); paintFold();
}
function paintLogo() {
  const img = $('#logoPrev');
  img.classList.toggle('hidden', !S.header.logo); $('#logoDel').classList.toggle('hidden', !S.header.logo);
  if (S.header.logo) img.src = S.header.logo;
}
function syncHeaderInputs() {
  const H = S.header;
  $('#hSchool').value = H.school || ''; $('#hTitle').value = H.title || ''; $('#hYear').value = H.year || '';
  $('#hDuration').value = H.duration || ''; $('#hTeacher').value = H.teacher || '';
  DD.forEach(d => { if (d.host.id === 'ddExamLang') d.set(S.examLang); if (d.host.id === 'ddDiffAll') d.set(S.difficulty); });
  paintLogo(); fillDatalists();
}

/* =====================================================================
   Step 4 — exercise cards
   ===================================================================== */
const CARD_TYPES = ['qcm', 'tf', 'problem', 'situation', 'fill', 'direct', 'match', 'document'];
const GEN_ICON = '<svg viewBox="0 0 24 24"><path d="M12 3l1.8 4.7L18.5 9l-4.7 1.8L12 15.5l-1.8-4.7L5.5 9l4.7-1.3z"/><path d="M18.5 14.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"/></svg>';
function newCard() {
  const total = S.exercises.reduce((a, e) => a + Number(e.points || 0), 0);
  const rem = Math.round((20 - total) * 100) / 100;
  return {
    id: uid(), type: (LANG_TYPES[S.cur.subject] && !isUni() ? LANG_TYPES[S.cur.subject] : CARD_TYPES)[S.exercises.length] || allowedTypes()[0], unit: 'all', diff: S.difficulty,
    points: rem > 0 && rem < 5 ? rem : 5, note: '', open: true,
    data: null, history: [], images: [], status: 'idle', err: '', wait: 0, perm: null
  };
}
function addCard() {
  if (S.exercises.length >= MAX_EX) { toast(T('max_ex'), 'err'); return; }
  S.exercises.forEach(e => { e.open = false; });
  S.exercises.push(newCard()); markDirty(); renderCards();
  const last = $('#cards').lastElementChild; if (last) last.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
const unitTitle = ex => ex.unit === 'all' ? T('all_units') : ((S.units.find(u => u.id === ex.unit) || {}).title || T('all_units'));
function chipHtml(ex) {
  const k = ex.status;
  const label = k === 'waiting' ? T('chip_waiting', { s: ex.wait || '' }) : T('chip_' + k);
  return `<span class="chip ${k}" data-chip="${ex.id}">${esc(label)}</span>`;
}
let dragId = null;
function renderCards() {
  const host = $('#cards');
  for (let i = DD.length - 1; i >= 0; i--) if (DD[i].isCard) DD.splice(i, 1);
  host.innerHTML = '';
  S.exercises.forEach((ex, i) => {
    const c = el('div', 'card' + (ex.open ? ' open' : ''));
    c.dataset.id = ex.id; c.style.setProperty('--c', TYPES[ex.type].c);
    c.innerHTML = `<div class="card-h">
        <button type="button" class="card-btn grip" aria-label="drag">${svgI('<circle cx="9" cy="6" r="1.3"/><circle cx="15" cy="6" r="1.3"/><circle cx="9" cy="12" r="1.3"/><circle cx="15" cy="12" r="1.3"/><circle cx="9" cy="18" r="1.3"/><circle cx="15" cy="18" r="1.3"/>')}</button>
        <span class="dd-ic" style="--c:${TYPES[ex.type].c}">${svgI(TYPES[ex.type].i)}</span>
        <div class="card-sum"><b>${esc(T('ex_n'))} ${i + 1}</b><small>${esc(tLabel(ex.type))} · ${esc(unitTitle(ex))} · ${fmtNum(ex.points)} ${esc(T('points_short'))}</small></div>
        ${chipHtml(ex)}
        <button type="button" class="card-btn del" aria-label="${esc(T('del'))}">${svgI(XT.del)}</button>
        <button type="button" class="card-btn chev" aria-label="toggle">${svgI('<path d="M6 9l6 6 6-6"/>')}</button>
      </div>
      <div class="card-b">
        <div class="card-g">
          <div class="f f-wide"><span>${esc(T('ex_type'))}</span><div class="dd-t"></div></div>
          <div class="f f-wide"><span>${esc(T('ex_unit'))}</span><div class="dd-u"></div></div>
          <div class="f"><span>${esc(T('ex_diff'))}</span><div class="dd-d"></div></div>
          <div class="f"><span>${esc(T('f_points'))}</span><div class="pts-in"><input type="number" min="0.5" max="20" step="0.25" value="${ex.points}"><span>${esc(T('points_short'))}</span></div></div>
          <label class="f f-wide"><span>${esc(T('note'))}</span><textarea rows="2" maxlength="600" placeholder="${esc(T('note_ph'))}">${esc(ex.note)}</textarea></label>
        </div>
        ${ex.status === 'ready' && ex.data && ex.data.note_applied ? `<div class="note-ok">${svgI('<path d="M5 12l5 5 9-10"/>')}<span>${esc(ex.data.note_applied)}</span></div>` : ''}
        <button type="button" class="card-gen ${ex.status === 'loading' || ex.status === 'waiting' ? 'busy' : ''}" ${S.busy ? 'disabled' : ''}>${GEN_ICON}<span>${esc(ex.status === 'ready' ? T('regen_one') : T('gen_one'))}</span></button>
      </div>`;
    const a = makeDD($('.dd-t', c), typeOpts, ex.type, v => { ex.type = v; markDirty(); renderCards(); });
    const b = makeDD($('.dd-u', c), unitOpts, ex.unit, v => { ex.unit = v; markDirty(); renderCards(); });
    const d = makeDD($('.dd-d', c), diffOpts, ex.diff, v => { ex.diff = v; markDirty(); });
    a.isCard = b.isCard = d.isCard = true;
    $('.card-h', c).addEventListener('click', e => {
      if (e.target.closest('.del') || e.target.closest('.grip')) return;
      ex.open = !ex.open; renderCards();
    });
    $('.del', c).onclick = async () => {
      if (S.busy && (ex.status === 'loading' || ex.status === 'waiting')) { toast(T('err_busy'), 'err'); return; }
      if (ex.status === 'ready' && !(await confirmBox(T('confirm_del_ex'), true))) return;
      S.exercises = S.exercises.filter(x => x !== ex); markDirty(); renderCards(); renderPaper();
    };
    $('.pts-in input', c).onchange = e => {
      ex.points = Math.max(0.5, Math.min(20, Number(e.target.value) || 1)); e.target.value = ex.points;
      markDirty(); paintTotal(); renderCardSummary(c, ex, i); if (ex.status !== 'idle') rerender();
    };
    $('textarea', c).oninput = e => { ex.note = e.target.value; markDirty(); };
    $('.card-gen', c).onclick = () => generateCard(ex);
    // drag to reorder (handle only)
    const grip = $('.grip', c);
    grip.addEventListener('pointerdown', () => { c.draggable = true; });
    c.addEventListener('dragstart', e => { dragId = ex.id; c.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
    c.addEventListener('dragend', () => { c.draggable = false; c.classList.remove('dragging'); $$('.card.drag-over').forEach(x => x.classList.remove('drag-over')); });
    c.addEventListener('dragover', e => { if (dragId && dragId !== ex.id) { e.preventDefault(); c.classList.add('drag-over'); } });
    c.addEventListener('dragleave', () => c.classList.remove('drag-over'));
    c.addEventListener('drop', e => {
      e.preventDefault(); c.classList.remove('drag-over');
      const from = S.exercises.findIndex(x => x.id === dragId), to = S.exercises.indexOf(ex);
      dragId = null; if (from < 0 || to < 0 || from === to) return;
      const [m] = S.exercises.splice(from, 1); S.exercises.splice(to, 0, m);
      markDirty(); renderCards(); renderPaper();
    });
    host.appendChild(c);
  });
  $('#addCardBtn').disabled = S.exercises.length >= MAX_EX;
  paintTotal(); paintFold();
}
function renderCardSummary(c, ex, i) {
  $('.card-sum small', c).textContent = `${tLabel(ex.type)} · ${unitTitle(ex)} · ${fmtNum(ex.points)} ${T('points_short')}`;
}
function paintTotal() {
  const t = S.exercises.reduce((a, e) => a + Number(e.points || 0), 0);
  const e = $('#ptsTotal');
  e.textContent = `${T('total')}: ${fmtNum(t)} / 20`;
  e.className = 'pts-total ' + (Math.abs(t - 20) < 0.01 ? 'good' : 'bad');
  paintFold();
}
function paintBusy() {
  $$('.card-gen').forEach(b => { b.disabled = S.busy; });
}


/* =====================================================================
   Generation (one card at a time)
   ===================================================================== */
function chosenUnits(ex) {
  const on = S.units.filter(u => u.on);
  if (ex.unit !== 'all') { const u = S.units.find(x => x.id === ex.unit); if (u) return [u.title]; }
  return on.map(u => u.title);
}
function summary(data) {
  if (!data) return '';
  const parts = (data.items || []).map(it => it.text).concat((data.pairs || []).map(p => p.left));
  return `${data.title || ''}: ${(data.intro || '').slice(0, 200)} ${parts.join(' | ')}`.slice(0, 1100);
}
function callApi(payload) {
  const fn = firebase.app().functions('us-central1').httpsCallable('generateExam', { timeout: 150000 });
  return fn(payload).then(r => r.data);
}
function apiError(e) {
  const code = (e && e.code) || '';
  const msg = e && e.message && /[\u0600-\u06FF]/.test(e.message) ? e.message : '';
  if (S.uiLang === 'ar' && msg && !code.includes('internal')) return msg;
  if (code.includes('resource-exhausted')) return T('err_limit');
  if (code.includes('permission-denied')) return T('err_perm');
  if (code.includes('unauthenticated')) return T('gate_login');
  if (code.includes('unavailable') || code.includes('deadline')) return msg || T('err_net');
  return msg || T('err_gen');
}
function paintWait(ex) {
  const chip = $(`[data-chip="${ex.id}"]`);
  if (chip) { chip.className = 'chip ' + ex.status; chip.textContent = ex.status === 'waiting' ? T('chip_waiting', { s: ex.wait }) : T('chip_' + ex.status); }
  const w = $(`[data-wait="${ex.id}"]`);
  if (w) w.textContent = ex.status === 'waiting' ? T('waiting_q', { s: ex.wait }) : `${T('writing')} — ${tLabel(ex.type)}`;
}
async function callWithWait(ex, payload) {
  for (let attempt = 0; ; attempt++) {
    try { return await callApi(payload); } catch (e) {
      const code = (e && e.code) || '';
      if (code.includes('resource-exhausted') && attempt < MAX_WAITS) {
        let s = Math.max(5, Math.min(60, Number(e.details && e.details.retryAfter) || 20));
        ex.status = 'waiting';
        while (s > 0) { ex.wait = s; paintWait(ex); await sleep(1000); s--; }
        ex.status = 'loading'; paintWait(ex);
        continue;
      }
      throw e;
    }
  }
}
function generateCard(ex) {
  if (S.busy) { toast(T('err_busy'), 'err'); return; }
  if (!chosenUnits(ex).length && !S.paste.trim()) { toast(T('err_nounits'), 'err'); return; }
  return runGen(ex, { note: ex.note, regen: ex.status === 'ready' });
}
async function runGen(ex, opts) {
  S.busy = true; paintBusy();
  showPane('stage');
  const ok = await genOne(ex, opts);
  S.busy = false;
  if (ok) ex.open = false;
  renderCards(); renderPaper(); if (ok) focusEx(ex, true);
}
async function genOne(ex, { note = '', regen = false } = {}) {
  const prev = { type: ex.type, data: ex.data, perm: ex.perm, status: ex.status };
  const avoid = S.exercises.filter(e => e !== ex && e.status === 'ready' && e.data)
    .map(e => (e.data.title || '') + ' — ' + ((e.data.items && e.data.items[0] && e.data.items[0].text) || '')).slice(0, 8);
  ex.status = 'loading'; ex.err = '';
  renderCards(); renderPaper(); focusEx(ex, false);
  const st = streamObj();
  try {
    const res = await callWithWait(ex, {
      mode: 'exercise', country: countryName('en'), university: isUni(), type: ex.type, lang: S.examLang,
      level: levelBase(S.examLang), stream: isUni() ? S.cur.spec.trim() : (st ? lab(st, S.examLang) : ''),
      subject: subjLabel(S.cur.subject, S.examLang), units: chosenUnits(ex), source: S.paste.trim().slice(0, MAX_PASTE),
      difficulty: ex.diff, points: ex.points, note, uiLang: S.uiLang,
      previous: regen && prev.data ? summary(prev.data) : '', avoid
    });
    if (!res || !res.exercise) throw new Error('empty');
    if (regen && prev.data) { ex.history.push({ type: prev.type, data: prev.data, perm: prev.perm }); if (ex.history.length > 10) ex.history.shift(); }
    ex.data = normalizeData(res.exercise); ex.perm = null; ex.status = 'ready';
    markDirty();
    return true;
  } catch (e) {
    console.error(e);
    if (regen && prev.data) { Object.assign(ex, prev); toast(apiError(e), 'err'); }
    else { ex.status = 'error'; ex.err = apiError(e); }
    return false;
  }
}
function cleanText(str) {
  if (typeof str !== 'string') return str;
  return str.split(/(\$[^$]*\$)/g).map((seg, i) => i % 2 ? seg.replace(/\\n(?=[\d\s.)]|$)/g, ' ')
    : seg.replace(/\\n/g, '\n').replace(/\\t/g, ' ')).join('').replace(/\n{3,}/g, '\n\n').trim();
}
function cleanDeep(v) {
  if (typeof v === 'string') return cleanText(v);
  if (Array.isArray(v)) return v.map(cleanDeep);
  if (v && typeof v === 'object') { const o = {}; for (const k in v) o[k] = cleanDeep(v[k]); return o; }
  return v;
}
function normalizeData(d) {
  d = cleanDeep(d || {});
  if (typeof d.intro === 'string' && Array.isArray(d.items) && d.items.length) {
    const lines = d.intro.split('\n');
    const k = lines.findIndex(l => /^\s*(\d+|[٠-٩]+)\s*[.)\-–:]/.test(l));
    if (k > 0) d.intro = lines.slice(0, k).join('\n').trim();
  }
  return d;
}
function focusEx(ex, flash) {
  const b = $(`.ex[data-id="${ex.id}"]`);
  if (!b) return;
  b.scrollIntoView({ block: 'center', behavior: 'smooth' });
  if (flash) { b.classList.remove('flash'); void b.offsetWidth; b.classList.add('flash'); }
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
  const list = shown();
  const Lx = L();
  if (!list.length) {
    const pg = newPage(paper, 'exam');
    pg.body.appendChild(headerBlock());
    const hint = el('div', 'paper-hint', emptyPage().querySelector('svg').outerHTML + `<h3>${esc(T('hint_title'))}</h3><p>${esc(T('hint_sub'))}</p>`);
    pg.body.appendChild(hint);
    pg.foot.textContent = Lx.page(1, 1);
    sc.scrollTop = top;
    return;
  }
  const blocks = [headerBlock()];
  list.forEach((ex, i) => blocks.push(exBlock(ex, i)));
  if (list.every(e => e.status === 'ready')) blocks.push(el('div', 'good-luck', esc(Lx.luck)));
  const exam = flow(paper, blocks, 'exam');
  exam.forEach((p, i) => { p.foot.textContent = Lx.page(i + 1, exam.length); });
  const ready = list.filter(e => e.status === 'ready');
  if (S.showCorr && ready.length) {
    const cb = [el('h2', 'corr-title', esc(Lx.corr))];
    list.forEach((ex, i) => { if (ex.status === 'ready') cb.push(corrBlock(ex, i)); });
    const tot = list.reduce((a, e) => a + Number(e.points || 0), 0);
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
    <tr><td>${cell('level', levelText())}</td><td class="h-mid h-title">${v(H.title)}</td><td>${cell('subject', subjLabel(S.cur.subject, S.examLang))}</td></tr>
    <tr><td colspan="2">${cell('teacher', H.teacher)}</td><td>${cell('duration', H.duration)}</td></tr>`;
  return t;
}
function exHeading(ex, i) {
  const Lx = L();
  let label;
  if (ex.type === 'situation') label = Lx.situation;
  else label = Lx.ex(shown().slice(0, i).filter(e => e.type !== 'situation').length);
  return `<h3 class="ex-h">${esc(label)}<span>${esc(Lx.pts(Number(ex.points)))}</span></h3>`;
}
const PEN = svgI('<path d="M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10z"/><path d="M13.5 7.5l3 3"/>');
function exBlock(ex, i) {
  const b = el('div', 'ex'); b.dataset.id = ex.id; b.style.setProperty('--tc', TYPES[ex.type].c);
  if (ex.status !== 'ready') {
    if (ex.status === 'error') {
      b.innerHTML = exHeading(ex, i) + `<div class="ex-error"><span>${esc(ex.err || T('err_gen'))}</span><button type="button" class="btn-main">${esc(T('retry'))}</button></div>`;
      $('.btn-main', b).onclick = () => generateCard(ex);
    } else {
      const wt = ex.status === 'waiting' ? T('waiting_q', { s: ex.wait }) : `${T('writing')} — ${tLabel(ex.type)}`;
      b.innerHTML = exHeading(ex, i) + `<div class="ex-writing"><div class="w-h"><span class="pen">${PEN}</span><span data-wait="${ex.id}">${esc(wt)}</span></div><div class="w-lines"><i></i><i></i><i></i><i></i></div></div>`;
    }
    return b;
  }
  const d = ex.data, Lx = L();
  let h = exHeading(ex, i);
  if (d.instruction) h += `<p class="ex-ins">${txt(d.instruction)}</p>`;
  if (d.intro) h += DOC_TYPES.includes(ex.type) ? `<div class="ex-doc"><span class="ex-doc-l">${esc(Lx.doc)}:</span>${txt(d.intro)}</div>` : `<div class="ex-intro">${txt(d.intro)}</div>`;
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
  const n = shown().length;
  const mk = (k, tip, fn, dis) => {
    const b = el('button', 'xt ' + k, svgI(XT[k])); b.type = 'button';
    b.dataset.tipText = T(tip); b.setAttribute('aria-label', T(tip)); b.disabled = !!dis;
    b.onclick = e => { e.stopPropagation(); fn(b); };
    bar.appendChild(b);
  };
  mk('regen', 'regen', b => openRegen(ex, b), S.busy);
  mk('undo', 'undo', () => { const h = ex.history.pop(); if (!h) return; Object.assign(ex, h, { status: 'ready' }); markDirty(); renderCards(); renderPaper(); }, !ex.history.length || S.busy);
  mk('edit', 'edit', () => openEditor(ex));
  mk('image', 'image', () => openImages(ex));
  mk('up', 'up', () => moveEx(i, -1), i === 0);
  mk('down', 'down', () => moveEx(i, 1), i === n - 1);
  mk('del', 'del', async () => { if (!(await confirmBox(T('confirm_del_ex'), true))) return; S.exercises = S.exercises.filter(x => x !== ex); markDirty(); renderCards(); renderPaper(); }, S.busy);
  return bar;
}
function moveEx(i, dir) {
  const list = shown(), a = list[i], b = list[i + dir];
  if (!a || !b) return;
  const ia = S.exercises.indexOf(a), ib = S.exercises.indexOf(b);
  [S.exercises[ia], S.exercises[ib]] = [S.exercises[ib], S.exercises[ia]];
  markDirty(); renderCards(); renderPaper(); focusEx(a, true);
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
    <div class="f"><textarea rows="2" placeholder="${esc(T('regen_note_ph'))}"></textarea></div>
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
    if (S.busy) { toast(T('err_busy'), 'err'); return; }
    ex.type = type; ex.diff = diff;
    await runGen(ex, { note: [ex.note, note].filter(Boolean).join(' — '), regen: true });
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
      $('.ed-addimg', b).onclick = () => pickImage(im => { w.images.push(im); paintImgs(); });
    },
    foot: [
      { label: T('cancel'), onClick: a => a.close() },
      { label: T('save_edit'), cls: 'btn-main', onClick: a => {
        if (d.graph && !String(d.graph.expr || '').trim()) d.graph = null;
        ex.points = w.points; ex.data = d; ex.images = w.images; ex.perm = null;
        markDirty(); a.close(); renderCards(); renderPaper(); focusEx(ex, true);
      } }
    ]
  });
}


/* ---------------- Images from the device ---------------- */
function pickImage(onAdd) {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'image/*';
  inp.onchange = async () => {
    const f = inp.files[0]; if (!f) return;
    const im = await compressImage(f, 1100, 0.85);
    onAdd({ src: im.src, ratio: im.ratio, w: 60 });
  };
  inp.click();
}
function openImages(ex) {
  pickImage(im => { ex.images = ex.images || []; ex.images.push(im); markDirty(); renderPaper(); focusEx(ex, true); });
}

/* ---------------- Admin: edit curriculum units (Firestore: aiExamCatalog/dz) ---------------- */
const catalogDoc = () => firebase.firestore().collection('aiExamCatalog').doc('dz');
async function loadOverrides() {
  try { const d = await catalogDoc().get(); S.overrides = (d.exists && d.data().units) || {}; } catch (e) { S.overrides = {}; }
}
function openAdmin() {
  if (!S.isAdmin) return;
  const c = S.cur.sys === 'other' || isUni() ? COUNTRIES[0] : country();
  const stages = c.st.filter(x => x[0] !== 'uni').map(x => x[0]);
  const k = { stage: stages.includes(S.cur.stage) ? S.cur.stage : stages[0], grade: S.cur.grade, stream: S.cur.stage === 'sec' && c.v === 'dz' ? S.cur.stream : '', subject: S.cur.subject };
  if (k.grade > yearsOf(k.stage, c)) k.grade = yearsOf(k.stage, c);
  const pre = c.v === 'dz' ? '' : c.v + ':';
  const keyOf = () => `${pre}${k.stage}-${k.grade}-${k.subject}` + (c.v === 'dz' && k.stage === 'sec' && k.stream ? `@${k.stream}` : '');
  let ta, src;
  const load = () => {
    const key = keyOf();
    const list = S.overrides[key] || CATALOG[key];
    ta.value = (list || []).join('\n');
    src.textContent = S.overrides[key] ? T('adm_src_fb') : CATALOG[key] ? T('adm_src_def') : T('adm_src_none');
    src.style.color = S.overrides[key] ? 'var(--ok)' : 'var(--ink-soft)';
  };
  modal({
    title: `${T('adm_title')} — ${S.uiLang === 'en' ? c.en : c.ar}`, size: 'lg',
    build: b => {
      b.innerHTML = `<div class="adm-g">
          <div class="f"><span>${esc(T('stage'))}</span><div class="a1"></div></div>
          <div class="f"><span>${esc(T('grade'))}</span><div class="a2"></div></div>
          <div class="f a3w"><span>${esc(T('stream'))}</span><div class="a3"></div></div>
          <div class="f"><span>${esc(T('subject'))}</span><div class="a4"></div></div>
        </div>
        <p class="hint">${esc(T('adm_hint'))}</p>
        <textarea class="adm-ta"></textarea>
        <div class="adm-src"></div>`;
      ta = $('.adm-ta', b); src = $('.adm-src', b);
      const years = () => [...Array(yearsOf(k.stage, c))].map((_, i) => ({ v: i + 1, label: S.uiLang === 'en' ? `Year ${i + 1}` : `السنة ${ORD_AR_F[i] || i + 1}` }));
      const streams = () => [{ v: '', label: T('adm_all_streams') }].concat((STREAMS[k.grade] || []).map(x => ({ v: x.v, label: lab(x, uil()) })));
      const subjects = () => subjListFor(k.stage, c).map(sk => ({ v: sk, label: SUBJ[sk][uil()] || SUBJ[sk].ar }));
      const showStream = () => { $('.a3w', b).style.visibility = c.v === 'dz' && k.stage === 'sec' ? 'visible' : 'hidden'; };
      let d2, d3, d4;
      const d1 = makeDD($('.a1', b), () => stages.map(st => ({ v: st, label: S.uiLang === 'en' ? STAGE_NAMES[st].en : stageName(st, 'ar', c) })), k.stage, v => {
        k.stage = v; if (k.grade > yearsOf(v, c)) k.grade = yearsOf(v, c);
        if (!subjListFor(v, c).includes(k.subject)) k.subject = subjListFor(v, c)[0];
        if (v !== 'sec') k.stream = '';
        d2.set(k.grade); d3.set(k.stream); d4.set(k.subject); showStream(); load();
      });
      d2 = makeDD($('.a2', b), years, k.grade, v => { k.grade = v; if (!(STREAMS[v] || []).some(x => x.v === k.stream)) k.stream = ''; d3.set(k.stream); load(); });
      d3 = makeDD($('.a3', b), streams, k.stream, v => { k.stream = v; load(); });
      d4 = makeDD($('.a4', b), subjects, k.subject, v => { k.subject = v; load(); });
      [d1, d2, d3, d4].forEach(x => { x.isModal = true; });
      showStream(); load();
    },
    foot: [
      { label: T('adm_reset'), onClick: async () => {
        const key = keyOf();
        try {
          await catalogDoc().set({ units: { [key]: firebase.firestore.FieldValue.delete() } }, { merge: true });
          delete S.overrides[key]; load(); rebuildUnits(); toast(T('adm_saved'), 'ok');
        } catch (e) { console.error(e); toast(T('err_save'), 'err'); }
      } },
      { label: T('adm_save'), cls: 'btn-main', onClick: async () => {
        const key = keyOf();
        const list = ta.value.split('\n').map(x => x.trim()).filter(Boolean).slice(0, 60);
        try {
          await catalogDoc().set({ units: { [key]: list } }, { merge: true });
          S.overrides[key] = list; load(); rebuildUnits(); toast(T('adm_saved'), 'ok');
        } catch (e) { console.error(e); toast(T('err_save'), 'err'); }
      } }
    ]
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
  if (!shown().length || shown().some(e => e.status !== 'ready')) { toast(T('err_empty'), 'err'); return false; }
  return true;
}
const fileName = () => (`${S.header.title || 'exam'} ${subjLabel(S.cur.subject, S.examLang) || ''}`).trim().replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, '_').slice(0, 80) || 'exam';
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
const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
async function exportWord() {
  if (!canExport()) return;
  toast(T('exporting'), '', true);
  try { await Promise.all([loadScript(LIBS.h2c), loadScript(LIBS.docx)]); } catch (e) { toast(T('err_net'), 'err'); return; }
  const dir = L().dir, align = dir === 'rtl' ? 'right' : 'left';
  const ok = await withExport('#wordBtn', async pages => {
    const all = pages.flatMap(pg => $$('.katex', $('.page-body', pg)));
    const total = all.length + $$('.figure svg', $('#paper')).length;
    const cache = new Map();
    let done = 0;
    const tick = () => { done++; if (total) toast(T('word_prog', { i: done, n: total }), '', true); };
    const mathImg = async node => {
      const ann = node.querySelector('annotation');
      const key = (ann ? ann.textContent : node.textContent) + '|' + (node.closest('.katex-display') ? 'd' : 'i');
      if (!cache.has(key)) {
        try {
          const c = await withTimeout(html2canvas(node, { scale: 1.6, backgroundColor: null, logging: false }), 8000);
          cache.set(key, { src: c.toDataURL('image/png'), w: Math.round(c.width / 1.6), h: Math.round(c.height / 1.6) });
        } catch (e) { cache.set(key, { text: ann ? ann.textContent : node.textContent }); }
      }
      return cache.get(key);
    };
    const parts = [];
    for (const pg of pages) {
      const body = $('.page-body', pg), cl = body.cloneNode(true);
      $$('.ex-tools, .paper-hint', cl).forEach(n => n.remove());
      const ok1 = $$('.katex', body), ck = $$('.katex', cl);
      for (let i = 0; i < ok1.length; i++) {
        const r = await mathImg(ok1[i]); tick();
        let node;
        if (r.src) { node = document.createElement('img'); node.src = r.src; node.width = r.w; node.height = r.h; node.style.verticalAlign = 'middle'; }
        else node = document.createTextNode(r.text);
        (ck[i].closest('.katex-display') || ck[i]).replaceWith(node);
      }
      const os = $$('.figure svg', body), cs = $$('.figure svg', cl);
      for (let i = 0; i < os.length; i++) {
        const src = await svgToPng(os[i]); tick();
        const img = document.createElement('img');
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
    if (!window.htmlDocx || !window.htmlDocx.asBlob) throw new Error('html-docx not loaded');
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
    v: 2,
    title: [S.header.title, subjLabel(S.cur.subject, 'ar'), gradeLabel(S.cur.grade, 'ar')].filter(Boolean).join(' — ') || T('app_title'),
    header: S.header, cur: S.cur, units: S.units, paste: S.paste,
    examLang: S.examLang, difficulty: S.difficulty, showCorr: S.showCorr,
    exercises: S.exercises.map(e => ({
      id: e.id, type: e.type, unit: e.unit, diff: e.diff, points: e.points, note: e.note || '',
      data: e.status === 'ready' ? e.data : null, images: e.images || [], perm: e.perm || null,
      status: e.status === 'ready' ? 'ready' : 'idle'
    }))
  });
  if (JSON.stringify(doc).length > 950000) { toast(T('err_big'), 'err'); return; }
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
          const n = (x.exercises || []).filter(e => e.data).length;
          const it = el('div', 'saved-it');
          it.innerHTML = `<span class="dd-ic" style="--c:var(--accent)">${svgI('<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 12h6M9 15.5h6"/>')}</span>
            <div class="s-t"><b>${esc(x.title)}</b><small>${esc(dt)} · ${n} ${esc(T('s4'))}</small></div>
            <button type="button" class="btn-main">${esc(T('open_it'))}</button>
            <button type="button" class="u-del" aria-label="${esc(T('remove'))}">${svgI(XT.del)}</button>`;
          $('.btn-main', it).onclick = async () => {
            if (S.dirty && S.exercises.some(e => e.status === 'ready') && !(await confirmBox(T('confirm_new')))) return;
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
  S.header = Object.assign({ school: '', title: '', year: '', duration: '', teacher: '', logo: '' }, x.header || {});
  S.cur = Object.assign({ sys: 'dz', other: '', stage: 'mid', grade: 4, stream: 'se', subject: 'math', spec: '', module: '' }, x.cur || {});
  if (!x.cur && x.header && x.header.stage) { S.cur.stage = x.header.stage; S.cur.grade = x.header.grade || 1; }
  S.examLang = x.examLang || 'ar'; S.difficulty = x.difficulty || 'medium';
  S.units = (x.units || []).map(u => ({ id: u.id || uid(), title: u.title, on: !!u.on, custom: !!u.custom }));
  S.paste = x.paste || ''; $('#pasteText').value = S.paste; paintPaste();
  S.showCorr = x.showCorr !== false; $('#corrToggle').checked = S.showCorr;
  S.exercises = (x.exercises || []).map(e => Object.assign({ unit: 'all', diff: 'medium', note: '', images: [], perm: null }, e, {
    data: e.data ? normalizeData(e.data) : null, history: [], open: false, err: '', wait: 0, status: e.data ? 'ready' : 'idle'
  }));
  if (!S.exercises.length) S.exercises.push(newCard());
  syncHeaderInputs(); syncCurriculum();
  if (!S.units.length) rebuildUnits(); else { renderUnits(); renderCards(); }
  renderPaper();
  S.dirty = false; toast(T('loaded_ok'), 'ok'); showPane('stage');
}
async function newExam() {
  if (S.busy) { toast(T('err_busy'), 'err'); return; }
  if (S.dirty && S.exercises.some(e => e.status === 'ready') && !(await confirmBox(T('confirm_new')))) return;
  S.examId = null; S.exercises = [newCard()];
  S.units.forEach(u => { u.on = false; }); S.units = S.units.filter(u => !u.custom);
  S.paste = ''; $('#pasteText').value = ''; paintPaste();
  renderUnits(); renderCards(); renderPaper(); showPane('side');
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
  initCurriculum();
  initHeader();
  makeDD($('#ddDiffAll'), diffOpts, S.difficulty, v => {
    S.difficulty = v;
    S.exercises.forEach(e => { if (e.status !== 'ready') e.diff = v; });
    markDirty(); renderCards();
  });
  rebuildUnits();
  S.exercises = [Object.assign(newCard(), { open: false })];

  $('#unitAddBtn').onclick = addCustomUnit;
  $('#unitInput').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addCustomUnit(); } });
  $('#pasteText').oninput = e => { S.paste = e.target.value.slice(0, MAX_PASTE); markDirty(); paintPaste(); };
  $('#pasteClear').onclick = () => { S.paste = ''; $('#pasteText').value = ''; markDirty(); paintPaste(); };
  $('#addCardBtn').onclick = addCard;
  $('#balanceBtn').onclick = () => {
    const p = splitPoints(20, S.exercises.length);
    S.exercises.forEach((e, i) => { e.points = p[i]; });
    markDirty(); renderCards(); if (shown().length) renderPaper();
  };

  $('#newBtn').onclick = newExam;
  $('#openBtn').onclick = openSaved;
  $('#saveBtn').onclick = saveExam;
  $('#printBtn').onclick = doPrint;
  $('#pdfBtn').onclick = exportPdf;
  $('#wordBtn').onclick = exportWord;
  $('#adminBtn').onclick = openAdmin;
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

  initFold();
  applyUI();
  renderPaper();
  fitZoom();
  S.dirty = false;
  startGate();
}
init();
})();
