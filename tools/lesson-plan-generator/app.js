/* =====================================================================
   مولّد مذكرة تحضير الدرس — أكاديمية مرابطي
   تخزين النص: محلي دائمًا (حفظ تلقائي) + Firestore عند الضغط على "حفظ" فقط
   تخزين الصور (الشعار/الإطار): محلي فقط، لا تتزامن مع الحساب
   الواجهة: على نمط أداة المطويات (حيّز ملء يمينًا 40% + معاينة A4 60%)
===================================================================== */

const LOCAL_PLANS_KEY = 'lesson_plans_local_v1';
const LOCAL_ASSETS_KEY = 'lesson_plan_assets_v1';
const LAST_PLAN_KEY = 'lesson_plan_last_v1';
const UI_LANG_KEY = 'lesson_plan_ui_lang';
const ZOOM_KEY = 'lesson_plan_zoom_v1';
const DEFAULT_COLOR = '#1A8A72';

/* ---------- قوالب المستويات (محتوى تجريبي كامل قابل للتعديل) ---------- */
const LEVEL_TEMPLATES = {
  'ابتدائي': {
    school: 'مدرسة الأمير عبد القادر الابتدائية',
    subject: 'اللغة العربية',
    klass: 'السنة الرابعة ابتدائي',
    teacher: 'فاطمة الزهراء',
    title: 'حروف الجر',
    unit: 'القواعد اللغوية',
    session: '2',
    duration: '45',
    objectives: [
      'يتعرف التلميذ على حروف الجر الأساسية',
      'يوظف حروف الجر في جمل مفيدة',
      'يميز موقع حرف الجر داخل الجملة',
    ],
    materials: ['السبورة', 'الكتاب المدرسي', 'بطاقات ملونة'],
    stages: [
      { title: 'التمهيد / الوضعية الانطلاقية', time: '5', teacher: 'يطرح أسئلة حول نص مقروء سابقًا', student: 'يجيب شفهيًا عن الأسئلة' },
      { title: 'بناء التعلمات', time: '20', teacher: 'يقدّم أمثلة عن حروف الجر ويشرح استعمالها', student: 'يستخرج حروف الجر من نص ويوظفها' },
      { title: 'التطبيق', time: '10', teacher: 'يوزّع بطاقات تدريبية', student: 'ينجز التمارين فرديًا' },
      { title: 'التقويم والتلخيص', time: '10', teacher: 'يطرح أسئلة ختامية', student: 'يلخص الدرس شفهيًا' },
    ],
    eval: 'إنجاز تمرين صفحة 30 من الكتاب المدرسي',
  },
  'متوسط': {
    school: 'متوسطة الأمير عبد القادر — ورقلة',
    subject: 'الرياضيات',
    klass: 'الأولى متوسط 1',
    teacher: 'محمد بن علي',
    title: 'الأعداد النسبية',
    unit: 'الأعداد والحساب',
    session: '3',
    duration: '45',
    objectives: [
      'يتعرف التلميذ على مفهوم العدد النسبي وكتابته الرمزية',
      'يقارن بين عددين نسبيين ويرتبهما تصاعديًا وتنازليًا',
      'يجري العمليات الأساسية (الجمع والطرح) على الأعداد النسبية',
    ],
    materials: ['السبورة', 'الكتاب المدرسي', 'بطاقات تعليمية', 'المسطرة المدرجة'],
    stages: [
      { title: 'الوضعية الانطلاقية', time: '5', teacher: 'يطرح إشكالية درجة الحرارة تحت الصفر', student: 'يقترح حلولًا أولية شفهيًا' },
      { title: 'بناء التعلمات (نشاط 1)', time: '15', teacher: 'يقدّم تعريف العدد النسبي بأمثلة', student: 'يدوّن التعريف وينجز أمثلة مماثلة' },
      { title: 'بناء التعلمات (نشاط 2)', time: '15', teacher: 'يشرح مقارنة الأعداد النسبية على المستقيم', student: 'يرتّب مجموعة أعداد على المستقيم' },
      { title: 'التقويم', time: '10', teacher: 'يوزّع تمارين تطبيقية قصيرة', student: 'يحل التمارين فرديًا على الدفتر' },
    ],
    eval: 'حل تمارين الصفحة 42 من الكتاب المدرسي (التمارين من 1 إلى 5)',
  },
  'ثانوي': {
    school: 'ثانوية الإخوة أحمد',
    subject: 'الفيزياء',
    klass: 'الثانية علوم تجريبية',
    teacher: 'كريم شريف',
    title: 'قوانين نيوتن',
    unit: 'الميكانيك',
    session: '4',
    duration: '55',
    objectives: [
      'يتعرف التلميذ على قوانين نيوتن الثلاثة',
      'يوظف القانون الثاني لنيوتن في حل تمارين تطبيقية',
      'يحلل حركة جسم خاضع لقوى متعددة',
    ],
    materials: ['السبورة', 'جهاز تجريبي', 'حاسبة علمية'],
    stages: [
      { title: 'وضعية الانطلاق', time: '5', teacher: 'يعرض تجربة استهلالية عن حركة جسم', student: 'يلاحظ ويسجل ملاحظاته' },
      { title: 'بناء التعلمات', time: '25', teacher: 'يشرح قوانين نيوتن الثلاثة بالتفصيل', student: 'يدوّن القوانين وينجز تمارين تطبيقية' },
      { title: 'التطبيق والتقويم', time: '10', teacher: 'يوزّع تمارين حل مسائل', student: 'يحل المسائل باستعمال القوانين' },
      { title: 'التركيب / الخلاصة', time: '5', teacher: 'يلخص أهم النقاط', student: 'يدوّن خلاصة الدرس' },
    ],
    eval: 'حل تمارين الصفحة 58 من الكتاب المدرسي',
  },
};

/* =====================================================================
   نصوص الواجهة (العربية / الفرنسية / الإنجليزية)
   محتوى المذكرة نفسه لا يتغيّر باللغة، الواجهة فقط.
===================================================================== */
const UI = {
  ar: {
    tool_name:'مولّد مذكرة تحضير الدرس', back_tools:'رجوع إلى الأدوات', fullscreen:'ملء الشاشة', mine:'مذكراتي',
    save:'حفظ في حسابي', print:'طباعة', pdf:'تحميل PDF', account:'الحساب', toggle_panel:'إظهار / إخفاء حيّز الملء',
    zoom_in:'تكبير', zoom_out:'تصغير', fit:'ملاءمة الشاشة',
    gallery:'معرض القوالب', search:'ابحث عن قالب...', cat_all:'الكل', cat_classic:'كلاسيكية', cat_modern:'عصرية', cat_print:'مناسبة للطباعة', cat_new:'جديدة', new_tag:'جديد', no_results:'لا توجد قوالب مطابقة',
    sec_level:'المستوى التعليمي', sec_header:'الترويسة', sec_lesson:'بيانات الدرس', sec_objectives:'الأهداف / الكفاءة المستهدفة',
    sec_materials:'الوسائل التعليمية', sec_stages:'سير الدرس', sec_eval:'التقويم / الواجب المنزلي', sec_frame:'إطار خلفية المذكرة (اختياري)', sec_color:'لون المذكرة',
    f_level:'المستوى', lv_primary:'الابتدائي', lv_middle:'المتوسط', lv_secondary:'الثانوي',
    load_preset:'تحميل مثال جاهز لهذا المستوى', load_preset_h:'يملأ كل الخانات بمثال كامل يمكنك تعديله.', confirm_preset:'سيتم استبدال محتوى المذكرة الحالي بالمثال الجاهز. متابعة؟',
    f_logo:'شعار المؤسسة', f_logo_h:'اختياري، يبقى محفوظًا في جهازك فقط', f_school:'المؤسسة', f_year:'السنة الدراسية', f_year_manual:'السنة (يدويًا)', year_manual_opt:'إدخال يدوي…',
    f_subject:'المادة', f_class:'القسم', f_date:'التاريخ', f_teacher:'الأستاذ(ة)',
    f_title:'عنوان الدرس', f_unit:'الوحدة / المحور', f_session:'رقم الحصة', f_duration:'المدة الزمنية (د)',
    ph_objective:'اكتب هدفًا واضغط إضافة', ph_material:'اكتب وسيلة واضغط إضافة', add:'إضافة', empty_list:'لا توجد عناصر بعد، أضف أول عنصر بالأسفل.',
    add_stage:'إضافة مرحلة', stage_name:'اسم المرحلة', min:'د', act_teacher:'نشاط الأستاذ', act_student:'نشاط التلميذ',
    ph_teacher:'ماذا يفعل الأستاذ في هذه المرحلة؟', ph_student:'ماذا يفعل التلميذ؟', move_up:'تحريك للأعلى', move_down:'تحريك للأسفل', del:'حذف',
    eval_show:'إظهار في المذكرة', f_eval:'نص التقويم أو الواجب', frame_drop:'اسحب صورة هنا أو اضغط للرفع — تظهر خلف الكتابة', frame_remove:'إزالة الإطار',
    custom_color:'لون مخصّص', color_reset:'استعادة الأخضر الافتراضي', color_hint:'يظهر اللون في القوالب: {list}.',
    next:'التالي', done:'تم',
    sum_empty:'لم يُملأ بعد', sum_items:'{n} عناصر', sum_stages:'{n} مراحل · {m} د', sum_hidden:'مخفي في المذكرة', sum_frame_on:'صورة إطار مضافة', sum_frame_off:'بدون إطار',
    guest_note:'مذكراتك محفوظة في هذا الجهاز. سجّل الدخول لحفظها في حسابك والوصول إليها من أي جهاز.', login:'تسجيل الدخول',
    login_text:'سجّل دخولك لحفظ مذكراتك في حسابك', login_google:'المتابعة عبر Google', or:'أو', f_name:'الاسم', f_email:'البريد الإلكتروني', f_password:'كلمة المرور',
    cancel:'إلغاء', login_title:'تسجيل الدخول', signup_title:'إنشاء حساب', login_btn:'دخول', signup_btn:'إنشاء الحساب', no_account:'ليس لديك حساب؟', have_account:'لديك حساب بالفعل؟', create_account:'إنشاء حساب', logout:'تسجيل الخروج',
    new_b:'إنشاء مذكرة جديدة', open_b:'فتح', dup_b:'نسخ', del_b:'حذف', current:'مفتوحة الآن', untitled:'مذكرة بدون عنوان', copy_suffix:' (نسخة)',
    confirm_del:'سيتم حذف هذه المذكرة نهائيًا. متابعة؟', last_edit:'آخر تعديل: {d}', today:'اليوم', yesterday:'أمس', days_ago:'قبل {n} أيام', plan_no:'رقم المذكرة',
    saving:'جارٍ الحفظ…', t_saved_cloud:'✓ تم الحفظ في حسابك', t_save_err:'تعذّر الحفظ، حاول مجددًا', t_pdf:'جارٍ تجهيز ملف PDF…', t_pdf_ok:'✓ تم تحميل ملف PDF', t_pdf_err:'تعذّر إنشاء ملف PDF، حاول مجددًا.',
    t_print:'جارٍ تجهيز الطباعة…', t_new:'تم إنشاء مذكرة جديدة', t_opened:'تم فتح المذكرة', t_dup:'تم نسخ المذكرة', t_deleted:'تم حذف المذكرة', t_preset:'تم تحميل المثال الجاهز', t_tpl:'القالب: {name}', t_no_fb:'خدمة الحساب غير متاحة حاليًا',
    auth_email_in_use:'هذا البريد مستخدم مسبقًا.', auth_invalid_email:'صيغة البريد الإلكتروني غير صحيحة.', auth_weak:'كلمة المرور ضعيفة (6 أحرف على الأقل).',
    auth_wrong:'كلمة المرور غير صحيحة.', auth_nouser:'لا يوجد حساب بهذا البريد.', auth_invalid:'البريد أو كلمة المرور غير صحيحة.', auth_popup:'تم إغلاق نافذة تسجيل الدخول.', auth_default:'حدث خطأ، حاول مرة أخرى.',
  },
  fr: {
    tool_name:'Générateur de fiche de préparation', back_tools:'Retour aux outils', fullscreen:'Plein écran', mine:'Mes fiches',
    save:'Enregistrer dans mon compte', print:'Imprimer', pdf:'Télécharger PDF', account:'Compte', toggle_panel:'Afficher / masquer le panneau',
    zoom_in:'Agrandir', zoom_out:'Réduire', fit:'Ajuster à l’écran',
    gallery:'Galerie de modèles', search:'Rechercher un modèle...', cat_all:'Tous', cat_classic:'Classiques', cat_modern:'Modernes', cat_print:'Pour impression', cat_new:'Nouveaux', new_tag:'Nouveau', no_results:'Aucun modèle trouvé',
    sec_level:'Niveau scolaire', sec_header:'En-tête', sec_lesson:'Informations du cours', sec_objectives:'Objectifs / compétence visée',
    sec_materials:'Supports pédagogiques', sec_stages:'Déroulement du cours', sec_eval:'Évaluation / devoir', sec_frame:'Cadre de fond (optionnel)', sec_color:'Couleur de la fiche',
    f_level:'Niveau', lv_primary:'Primaire', lv_middle:'Moyen', lv_secondary:'Secondaire',
    load_preset:'Charger un exemple pour ce niveau', load_preset_h:'Remplit tous les champs avec un exemple modifiable.', confirm_preset:'Le contenu actuel sera remplacé par l’exemple. Continuer ?',
    f_logo:'Logo de l’établissement', f_logo_h:'Optionnel, conservé sur cet appareil uniquement', f_school:'Établissement', f_year:'Année scolaire', f_year_manual:'Année (manuelle)', year_manual_opt:'Saisie manuelle…',
    f_subject:'Matière', f_class:'Classe', f_date:'Date', f_teacher:'Enseignant(e)',
    f_title:'Titre du cours', f_unit:'Unité / axe', f_session:'N° de séance', f_duration:'Durée (min)',
    ph_objective:'Saisissez un objectif puis Ajouter', ph_material:'Saisissez un support puis Ajouter', add:'Ajouter', empty_list:'Aucun élément, ajoutez-en un ci-dessous.',
    add_stage:'Ajouter une étape', stage_name:'Nom de l’étape', min:'min', act_teacher:'Activité de l’enseignant', act_student:'Activité de l’élève',
    ph_teacher:'Que fait l’enseignant ?', ph_student:'Que fait l’élève ?', move_up:'Monter', move_down:'Descendre', del:'Supprimer',
    eval_show:'Afficher dans la fiche', f_eval:'Texte de l’évaluation ou du devoir', frame_drop:'Glissez une image ici ou cliquez — elle apparaît derrière le texte', frame_remove:'Retirer le cadre',
    custom_color:'Couleur personnalisée', color_reset:'Rétablir le vert par défaut', color_hint:'La couleur s’applique aux modèles : {list}.',
    next:'Suivant', done:'Terminé',
    sum_empty:'Pas encore rempli', sum_items:'{n} éléments', sum_stages:'{n} étapes · {m} min', sum_hidden:'Masqué dans la fiche', sum_frame_on:'Image de cadre ajoutée', sum_frame_off:'Sans cadre',
    guest_note:'Vos fiches sont conservées sur cet appareil. Connectez-vous pour les enregistrer dans votre compte.', login:'Se connecter',
    login_text:'Connectez-vous pour enregistrer vos fiches dans votre compte', login_google:'Continuer avec Google', or:'ou', f_name:'Nom', f_email:'E-mail', f_password:'Mot de passe',
    cancel:'Annuler', login_title:'Connexion', signup_title:'Créer un compte', login_btn:'Se connecter', signup_btn:'Créer le compte', no_account:'Pas de compte ?', have_account:'Déjà un compte ?', create_account:'Créer un compte', logout:'Se déconnecter',
    new_b:'Nouvelle fiche', open_b:'Ouvrir', dup_b:'Dupliquer', del_b:'Supprimer', current:'Ouverte', untitled:'Fiche sans titre', copy_suffix:' (copie)',
    confirm_del:'Cette fiche sera supprimée définitivement. Continuer ?', last_edit:'Modifiée : {d}', today:'aujourd’hui', yesterday:'hier', days_ago:'il y a {n} jours', plan_no:'Numéro de la fiche',
    saving:'Enregistrement…', t_saved_cloud:'✓ Enregistrée dans votre compte', t_save_err:'Échec de l’enregistrement, réessayez', t_pdf:'Préparation du PDF…', t_pdf_ok:'✓ PDF téléchargé', t_pdf_err:'Impossible de créer le PDF, réessayez.',
    t_print:'Préparation de l’impression…', t_new:'Nouvelle fiche créée', t_opened:'Fiche ouverte', t_dup:'Fiche dupliquée', t_deleted:'Fiche supprimée', t_preset:'Exemple chargé', t_tpl:'Modèle : {name}', t_no_fb:'Service de compte indisponible',
    auth_email_in_use:'Cet e-mail est déjà utilisé.', auth_invalid_email:'Adresse e-mail invalide.', auth_weak:'Mot de passe trop faible (6 caractères minimum).',
    auth_wrong:'Mot de passe incorrect.', auth_nouser:'Aucun compte avec cet e-mail.', auth_invalid:'E-mail ou mot de passe incorrect.', auth_popup:'Fenêtre de connexion fermée.', auth_default:'Une erreur est survenue, réessayez.',
  },
  en: {
    tool_name:'Lesson Plan Generator', back_tools:'Back to tools', fullscreen:'Full screen', mine:'My plans',
    save:'Save to my account', print:'Print', pdf:'Download PDF', account:'Account', toggle_panel:'Show / hide the form panel',
    zoom_in:'Zoom in', zoom_out:'Zoom out', fit:'Fit to screen',
    gallery:'Template gallery', search:'Search templates...', cat_all:'All', cat_classic:'Classic', cat_modern:'Modern', cat_print:'Print friendly', cat_new:'New', new_tag:'New', no_results:'No matching templates',
    sec_level:'School level', sec_header:'Header', sec_lesson:'Lesson details', sec_objectives:'Objectives / target competency',
    sec_materials:'Teaching materials', sec_stages:'Lesson flow', sec_eval:'Assessment / homework', sec_frame:'Background frame (optional)', sec_color:'Plan colour',
    f_level:'Level', lv_primary:'Primary', lv_middle:'Middle school', lv_secondary:'Secondary',
    load_preset:'Load a ready example for this level', load_preset_h:'Fills every field with a complete, editable example.', confirm_preset:'The current content will be replaced by the example. Continue?',
    f_logo:'School logo', f_logo_h:'Optional, stored on this device only', f_school:'School', f_year:'School year', f_year_manual:'Year (manual)', year_manual_opt:'Manual entry…',
    f_subject:'Subject', f_class:'Class', f_date:'Date', f_teacher:'Teacher',
    f_title:'Lesson title', f_unit:'Unit / theme', f_session:'Session no.', f_duration:'Duration (min)',
    ph_objective:'Type an objective and press Add', ph_material:'Type a material and press Add', add:'Add', empty_list:'No items yet, add the first one below.',
    add_stage:'Add a stage', stage_name:'Stage name', min:'min', act_teacher:'Teacher activity', act_student:'Student activity',
    ph_teacher:'What does the teacher do?', ph_student:'What do students do?', move_up:'Move up', move_down:'Move down', del:'Delete',
    eval_show:'Show in the plan', f_eval:'Assessment or homework text', frame_drop:'Drop an image here or click to upload — it appears behind the text', frame_remove:'Remove frame',
    custom_color:'Custom colour', color_reset:'Restore default green', color_hint:'The colour applies to templates: {list}.',
    next:'Next', done:'Done',
    sum_empty:'Not filled yet', sum_items:'{n} items', sum_stages:'{n} stages · {m} min', sum_hidden:'Hidden in the plan', sum_frame_on:'Frame image added', sum_frame_off:'No frame',
    guest_note:'Your plans are kept on this device. Sign in to save them to your account and reach them anywhere.', login:'Sign in',
    login_text:'Sign in to save your plans to your account', login_google:'Continue with Google', or:'or', f_name:'Name', f_email:'Email', f_password:'Password',
    cancel:'Cancel', login_title:'Sign in', signup_title:'Create account', login_btn:'Sign in', signup_btn:'Create account', no_account:'No account?', have_account:'Already have an account?', create_account:'Create account', logout:'Sign out',
    new_b:'New plan', open_b:'Open', dup_b:'Duplicate', del_b:'Delete', current:'Open now', untitled:'Untitled plan', copy_suffix:' (copy)',
    confirm_del:'This plan will be deleted permanently. Continue?', last_edit:'Edited: {d}', today:'today', yesterday:'yesterday', days_ago:'{n} days ago', plan_no:'Plan number',
    saving:'Saving…', t_saved_cloud:'✓ Saved to your account', t_save_err:'Could not save, please try again', t_pdf:'Preparing PDF…', t_pdf_ok:'✓ PDF downloaded', t_pdf_err:'Could not create the PDF, please try again.',
    t_print:'Preparing to print…', t_new:'New plan created', t_opened:'Plan opened', t_dup:'Plan duplicated', t_deleted:'Plan deleted', t_preset:'Example loaded', t_tpl:'Template: {name}', t_no_fb:'Account service unavailable',
    auth_email_in_use:'This email is already in use.', auth_invalid_email:'Invalid email address.', auth_weak:'Weak password (6 characters minimum).',
    auth_wrong:'Wrong password.', auth_nouser:'No account with this email.', auth_invalid:'Wrong email or password.', auth_popup:'The sign-in window was closed.', auth_default:'Something went wrong, please try again.',
  },
};
let uiLang = (() => { try { const l = localStorage.getItem(UI_LANG_KEY); return UI[l] ? l : 'ar'; } catch(e){ return 'ar'; } })();
function t(key, vars){
  let s = (UI[uiLang] && UI[uiLang][key]) || UI.ar[key] || key;
  if (vars) Object.keys(vars).forEach(k => { s = s.replace('{' + k + '}', vars[k]); });
  return s;
}
const LEVEL_KEYS = { 'ابتدائي':'lv_primary', 'متوسط':'lv_middle', 'ثانوي':'lv_secondary' };

/* ---------- تخزين محلي ---------- */
function loadLocalPlans(){
  try { return JSON.parse(localStorage.getItem(LOCAL_PLANS_KEY)) || {}; }
  catch(e){ return {}; }
}
function saveLocalPlans(plans){
  try { localStorage.setItem(LOCAL_PLANS_KEY, JSON.stringify(plans)); } catch(e){}
}
function loadLocalAssets(){
  try { return JSON.parse(localStorage.getItem(LOCAL_ASSETS_KEY)) || {}; }
  catch(e){ return {}; }
}
function saveLocalAssets(assets){
  try { localStorage.setItem(LOCAL_ASSETS_KEY, JSON.stringify(assets)); }
  catch(e){ /* قد تمتلئ المساحة المحلية بصور كبيرة؛ نتجاهل بصمت */ }
}

let plansCache = loadLocalPlans();
let assetsCache = loadLocalAssets();

function newPlanId(){
  return 'plan_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}

function makeNewPlan(level){
  const tpl = LEVEL_TEMPLATES[level];
  const now = new Date();
  const iso = now.toISOString();
  const dateStr = now.toISOString().slice(0, 10);
  return {
    id: newPlanId(),
    level: level,
    template: 't1',
    color: DEFAULT_COLOR,
    school: tpl.school,
    yearSelect: currentAcademicYears()[0],
    yearManual: '',
    subject: tpl.subject,
    klass: tpl.klass,
    date: dateStr,
    teacher: tpl.teacher,
    title: tpl.title,
    unit: tpl.unit,
    session: tpl.session,
    duration: tpl.duration,
    objectives: tpl.objectives.slice(),
    materials: tpl.materials.slice(),
    stages: tpl.stages.map(s => ({...s})),
    evalEnabled: true,
    eval: tpl.eval,
    createdAt: iso,
    updatedAt: iso,
  };
}

function currentAcademicYears(){
  const base = new Date().getFullYear();
  const list = [];
  for (let i = 0; i < 5; i++){ list.push(`${base + i}/${base + i + 1}`); }
  return list;
}

/* ---------- حالة عامة ---------- */
let currentUser = null; // { uid, name, email, picture } | null
let currentPlanId = null;
let pendingSaveAfterLogin = false;
let openSec = null;

const $ = (id) => document.getElementById(id);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
const hasFb = () => !!(window.fbAuth && window.fbDb);

/* =====================================================================
   القوالب — كلها تقرأ نفس بيانات المذكرة (الشكل فقط يختلف)
   data-sec على أجزاء الورقة: الضغط عليها يفتح القسم الخاص بها.
===================================================================== */
/* ---------- أدوات مساعدة للقوالب ---------- */
const grow = p => p.stages.map(s => Math.max(parseInt(s.time) || 5, 5));
const objText = p => p.objectives.join('، ');
const act = s => `${s.teacher ? `<div><b>الأستاذ:</b> ${esc(s.teacher)}</div>` : ''}${s.student ? `<div><b>التلميذ:</b> ${esc(s.student)}</div>` : ''}`;
const evalTxt = p => (p.evalEnabled && p.eval) ? esc(p.eval) : '';
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const V = s => s ? `<span class="v">${esc(s)}</span>` : '';
const tm = t => t ? esc(t) + ' د' : '—';
const dur = d => d ? esc(d) + ' د' : '—';
const lg = (p, c) => p.logo ? `<img class="lg ${c}" src="${p.logo}" alt="">` : '';
const dt = p => p.date ? p.date.split('-').reverse().join('-') : '';
const lis = a => a.map(x => `<li>${esc(x)}</li>`).join('');
const S = s => ` data-sec="${s}"`;

function safeHex(c){ return /^#[0-9a-f]{6}$/i.test(c || '') ? c : DEFAULT_COLOR; }
function hexRgb(c){ const h = safeHex(c).slice(1); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); }
const toHex = a => '#' + a.map(x => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');
const tint = (c, a) => toHex(hexRgb(c).map(x => x * a + 255 * (1 - a)));   // لون فاتح (حرفي)
const shade = (c, a) => toHex(hexRgb(c).map(x => x * (1 - a)));            // لون داكن (حرفي)

function cv(c){
  const h = c.replace('#',''), r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
  const mix = a => '#' + [r,g,b].map(x => Math.round(x * a + 255 * (1 - a)).toString(16).padStart(2,'0')).join('');
  return `--c:${c};` + [5,7,10,12,14,30].map(k => `--t${k}:${mix(k/100)}`).join(';');
}

/* ---------- أسماء القوالب وتصنيفاتها ---------- */
const NAMES = {t1:'أسود كلاسيكي',t2:'أزرق مؤطّر',t3:'أخضر بالمقاطع',t4:'أحمر أنيق',t5:'الافتراضي',t6:'بسيط رسمي',t7:'شريط ملوّن',t8:'خط زمني',
  t9:'رسمي بإطار مزدوج',t10:'عصري بشريط جانبي',t11:'أشكال هندسية ناعمة',t12:'جداول ملوّنة أنيقة',t13:'بسيط أنيق',t14:'ترويسة مزخرفة',t15:'هادئ للأبيض والأسود',t16:'اقتصادي في الحبر'};
const NAMES_I18N = {
  fr: {t1:'Noir classique',t2:'Bleu encadré',t3:'Vert par séquences',t4:'Rouge élégant',t5:'Par défaut',t6:'Sobre officiel',t7:'Bandeau coloré',t8:'Frise chronologique',
    t9:'Officiel double cadre',t10:'Moderne à bande latérale',t11:'Formes géométriques douces',t12:'Tableaux colorés élégants',t13:'Simple et élégant',t14:'En-tête ornementé',t15:'Doux pour noir et blanc',t16:'Économique en encre'},
  en: {t1:'Classic black',t2:'Framed blue',t3:'Green sequences',t4:'Elegant red',t5:'Default',t6:'Plain formal',t7:'Colour band',t8:'Timeline',
    t9:'Formal double frame',t10:'Modern sidebar',t11:'Soft geometric shapes',t12:'Elegant coloured tables',t13:'Simple elegant',t14:'Ornate header',t15:'Calm black & white',t16:'Ink saver'},
};
const tplName = k => (NAMES_I18N[uiLang] && NAMES_I18N[uiLang][k]) || NAMES[k];
const TPL_CATS = {
  t1:['classic','print'], t2:['classic'], t3:['classic'], t4:['classic'], t5:['modern'], t6:['classic','print'], t7:['modern'], t8:['modern'],
  t9:['classic','new'], t10:['modern','new'], t11:['modern','new'], t12:['modern','new'], t13:['modern','print','new'], t14:['classic','new'], t15:['print','new'], t16:['print','new'],
};
const COLOR_TPLS = ['t5','t7','t8','t10','t11','t12'];

/* ---------- زخارف SVG (ألوان حرفية لتظهر كما هي في PDF) ---------- */
function corner9(fx, fy){
  const g = `translate(${fx ? 60 : 0},${fy ? 60 : 0}) scale(${fx ? -1 : 1},${fy ? -1 : 1})`;
  return `<svg class="cr9 ${fy ? 'b' : 't'}${fx ? 'l' : 'r'}" viewBox="0 0 60 60" width="46" height="46"><g transform="${g}">` +
    `<path d="M2 2H40V5H5V40H2Z" fill="#B08D3C"/><path d="M11 11H30V13.5H13.5V30H11Z" fill="#1D2B53"/>` +
    `<rect x="17" y="17" width="9" height="9" transform="rotate(45 21.5 21.5)" fill="#B08D3C"/></g></svg>`;
}
const seal9 = `<svg class="seal9" viewBox="0 0 80 80" width="74" height="74"><circle cx="40" cy="40" r="37" fill="none" stroke="#B08D3C" stroke-width="2"/><circle cx="40" cy="40" r="31" fill="none" stroke="#1D2B53" stroke-width="1.2"/>` +
  Array.from({length: 12}, (_, i) => `<ellipse cx="40" cy="20" rx="4.5" ry="10" fill="#B08D3C" opacity=".85" transform="rotate(${i * 30} 40 40)"/>`).join('') +
  `<circle cx="40" cy="40" r="7" fill="#1D2B53"/></svg>`;
const rule9 = `<svg class="rule9" viewBox="0 0 300 16" width="300" height="16"><path d="M0 8H128M172 8H300" stroke="#B08D3C" stroke-width="1.5"/><rect x="143" y="1" width="14" height="14" transform="rotate(45 150 8)" fill="#1D2B53"/><rect x="146" y="4" width="8" height="8" transform="rotate(45 150 8)" fill="#B08D3C"/><circle cx="132" cy="8" r="2.5" fill="#B08D3C"/><circle cx="168" cy="8" r="2.5" fill="#B08D3C"/></svg>`;

function blob11(c, pos){
  const a = tint(c, .16), b = tint(c, .30), d = '#FDE8D7';
  return pos === 'a'
    ? `<svg class="bg11 a" viewBox="0 0 320 260" width="320" height="260"><circle cx="40" cy="30" r="130" fill="${a}"/><circle cx="210" cy="36" r="46" fill="${d}"/><circle cx="72" cy="196" r="22" fill="${b}"/><rect x="250" y="120" width="34" height="34" rx="10" transform="rotate(20 267 137)" fill="${a}"/></svg>`
    : `<svg class="bg11 b" viewBox="0 0 300 240" width="300" height="240"><circle cx="280" cy="230" r="120" fill="${a}"/><circle cx="90" cy="200" r="40" fill="${d}"/><circle cx="200" cy="80" r="16" fill="${b}"/></svg>`;
}

function star8(cx, cy, r, color, op){
  return `<g opacity="${op}"><rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}" fill="none" stroke="${color}" stroke-width="1.6"/>` +
    `<rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}" fill="none" stroke="${color}" stroke-width="1.6" transform="rotate(45 ${cx} ${cy})"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r * .32}" fill="${color}"/></g>`;
}
function band14(){
  let s = '';
  for (let x = 22; x < 794; x += 50) s += star8(x, 30, 12, '#C9A24A', .55);
  for (let x = 47; x < 794; x += 50) s += star8(x, 86, 12, '#C9A24A', .55);
  return `<svg class="bnd14" viewBox="0 0 794 116" width="794" height="116" preserveAspectRatio="xMidYMid slice"><rect width="794" height="116" fill="#0F5C4D"/>${s}` +
    `<rect y="108" width="794" height="3" fill="#C9A24A"/></svg>`;
}
function strip14(){
  let s = '';
  for (let x = 8; x < 794; x += 16) s += `<rect x="${x - 3.5}" y="3.5" width="7" height="7" transform="rotate(45 ${x} 7)" fill="${(x / 16 | 0) % 2 ? '#0F5C4D' : '#C9A24A'}"/>`;
  return `<svg class="strip14" viewBox="0 0 794 14" width="794" height="14" preserveAspectRatio="none"><path d="M0 7H794" stroke="#C9A24A" stroke-width="1"/>${s}</svg>`;
}
const orn14 = `<svg class="orn14" viewBox="0 0 26 14" width="26" height="14"><rect x="8" y="2" width="10" height="10" transform="rotate(45 13 7)" fill="#C9A24A"/><rect x="10.5" y="4.5" width="5" height="5" transform="rotate(45 13 7)" fill="#0F5C4D"/><circle cx="2" cy="7" r="1.8" fill="#C9A24A"/><circle cx="24" cy="7" r="1.8" fill="#C9A24A"/></svg>`;
const flour14 = `<svg class="fl14" viewBox="0 0 360 18" width="360" height="18"><path d="M0 9H150M210 9H360" stroke="#C9A24A" stroke-width="1.4"/><path d="M150 9Q165 0 180 9Q195 18 210 9Q195 0 180 9Q165 18 150 9Z" fill="#0F5C4D"/><circle cx="180" cy="9" r="3" fill="#C9A24A"/></svg>`;

const STAGE_PAL = [['#2563EB','#E8F0FE','#1E3A8A'],['#059669','#E4F5EE','#065F46'],['#D97706','#FDF1DD','#92400E'],['#7C3AED','#F0E8FE','#4C1D95'],['#DB2777','#FCE7F1','#9D174D'],['#0891B2','#E1F4F9','#155E75']];

/* ---------- القوالب ---------- */
const T = {
t1: p => { const g = grow(p), n = p.stages.length;
 return `<div class="paper t1">
  <div class="box r1"><span${S('header')}><b>المادة:</b> ${V(p.subject)}</span><span><b>المقطع:</b> <i class="blank"></i></span><span${S('lesson')}><b>المحور:</b> ${V(p.unit)}</span>${lg(p,'lg-s')}</div>
  <div class="box b2"><div><b>النشاط:</b> <i class="blank"></i></div><div${S('lesson')}><b>الموضوع:</b> ${V(p.title)}</div><div${S('objectives')}><b>الهدف التعلمي:</b> ${V(objText(p))}</div></div>
  <div class="tbl"${S('stages')}><div class="hd"><div>المراحل</div><div>الوضعية التعلمية التعليمية</div><div>التقويم</div></div>
  ${p.stages.map((s,i) => `<div class="rw" style="--g:${g[i]}"><div class="st">${esc(s.title)}</div><div class="sit ruled">${act(s)}</div><div class="ev ruled"${i === n-1 ? S('eval') : ''}>${i === n-1 ? evalTxt(p) : ''}</div></div>`).join('')}
  </div></div>`; },

t2: p => { const g = grow(p);
 return `<div class="paper t2"><div class="fr">
  <div class="top">
   <div class="cd"${S('header')}><div><span class="lb">الأستاذ:</span> ${V(p.teacher)}</div><div><span class="lb">المستوى:</span> ${V(p.klass)}</div><div><span class="lb">السنة الدراسية:</span> ${V(p.year)}</div><div${S('lesson')}><span class="lb">المدة:</span> ${V(p.duration ? p.duration + ' د' : '')}</div></div>
   <div class="mid"${S('lesson')}><div class="pl"><b>نموذج مذكرة رقم:</b> ${V(p.session)}</div><div class="pl"><span class="lb">المحور:</span> ${V(p.unit)}</div><div class="pl"><span class="lb">الموضوع:</span> ${V(p.title)}</div></div>
   <div class="cd"${S('materials')}><h4>الوسائل التعليمية</h4>${p.materials.map(m => `<div>• ${esc(m)}</div>`).join('')}</div>
  </div>
  <div class="band"${S('objectives')}><span class="lb">الكفاءات المستهدفة:</span> ${V(objText(p))}</div>
  <div class="tbl"${S('stages')}><div class="hd"><div>المراحل</div><div>المحتوى المعرفي</div><div>المدة</div></div>
  ${p.stages.map((s,i) => `<div class="rw" style="--g:${g[i]}"><div class="st">${esc(s.title)}</div><div>${act(s)}</div><div class="tm">${tm(s.time)}</div></div>`).join('')}</div>
  ${evalTxt(p) ? `<div class="ftr"${S('eval')}><span class="lb">التقويم / الواجب:</span> ${V(p.eval)}</div>` : ''}
 </div></div>`; },

t3: p => { const g = grow(p), n = p.stages.length;
 const it = (l, v, cls, w, sec) => `<div class="it${w ? ' w' : ''}"${sec ? S(sec) : ''}><b class="${cls}">${l}:</b> ${v ? V(v) : ''}</div>`;
 return `<div class="paper t3">
  <div class="top">
   ${it('الميدان', p.subject, 'g', 0, 'header')}${it('المقطع التعلمي', '', 'r')}
   ${it('المحتوى', p.title, 'r', 0, 'lesson')}${it('النشاط', '', 'r')}
   ${it('الأسبوع', dt(p), 'p', 0, 'header')}${it('الحصة / المدة', [p.session, p.duration ? p.duration + ' د' : ''].filter(Boolean).join(' / '), 'p', 0, 'lesson')}
   ${it('مؤشرات الكفاءة', objText(p), 'r', 1, 'objectives')}
   ${it('القيم والمواقف', '', 'g', 1)}
   ${it('الوسائل', p.materials.join('، '), 'r', 1, 'materials')}
  </div>
  <div class="tbl"${S('stages')}><div class="hd"><div>المراحل</div><div>الوضعية التعلمية والنشاط المقترح</div><div>مؤشرات التقويم</div></div>
  ${p.stages.map((s,i) => `<div class="rw" style="--g:${g[i]}"><div class="st">${esc(s.title)}</div><div class="sit ruled">${act(s)}</div><div class="ev ruled"${i === n-1 ? S('eval') : ''}>${i === n-1 ? evalTxt(p) : ''}</div></div>`).join('')}
  </div></div>`; },

t4: p => { const g = grow(p), n = p.stages.length;
 return `<div class="paper t4"><div class="fr"><div class="pill"${S('lesson')}>مذكرة رقم ${esc(p.session)}</div>${lg(p,'lg-c')}
  <div class="info">
   <div${S('header')}><b>المؤسسة:</b> ${V(p.school)}</div><div${S('header')}><b>المستوى:</b> ${V(p.klass)}</div>
   <div${S('header')}><b>ميدان التعلم:</b> ${V(p.subject)}</div><div${S('header')}><b>المادة:</b> ${V(p.subject)}</div>
   <div${S('lesson')}><b>الوحدة التعلمية:</b> ${V(p.unit)}</div><div${S('lesson')}><b>المدة:</b> ${V(p.duration ? p.duration + ' د' : '')}</div>
   <div${S('lesson')}><b>المحتوى المعرفي:</b> ${V(p.title)}</div><div${S('header')}><b>الأستاذ:</b> ${V(p.teacher)}</div>
  </div>
  <div class="cmp"><div><h5>الكفاءات القبلية:</h5></div><div${S('objectives')}><h5>الكفاءات المستهدفة:</h5>${V(objText(p))}</div></div>
  <div class="tbl"${S('stages')}><div class="hd"><div>مراحل الحصة</div><div>سير الحصة</div><div>المدة</div><div>توجيهات وتعاليق</div></div>
  ${p.stages.map((s,i) => `<div class="rw" style="--g:${g[i]}"><div class="st">${esc(s.title)}</div><div class="sit">${act(s)}</div><div class="tm">${esc(s.time)}</div><div class="nt"${i === n-1 ? S('eval') : ''}>${i === n-1 ? V(evalTxt(p) ? p.eval : '') : ''}</div></div>`).join('')}
  </div></div></div>`; },

t5: p => `<div class="paper t5" style="${cv(p.color)}">
  <div class="h"${S('header')}>${lg(p,'lg-h')}<div><div class="sc">${esc(p.school)}</div><div class="sb">${esc(p.year)} · ${esc(p.subject)} · ${esc(p.klass)}</div></div></div>
  <div class="ti"${S('lesson')}>${esc(p.title)}</div>
  <div class="meta"><span${S('lesson')}><b>الوحدة:</b> ${esc(p.unit)}</span><span${S('lesson')}><b>الحصة:</b> ${esc(p.session)}</span><span${S('lesson')}><b>المدة:</b> ${dur(p.duration)}</span><span${S('header')}><b>التاريخ:</b> ${esc(dt(p))}</span><span${S('header')}><b>الأستاذ:</b> ${esc(p.teacher)}</span></div>
  <div class="bt"${S('objectives')}>الأهداف / الكفاءة المستهدفة</div><ul${S('objectives')}>${lis(p.objectives)}</ul>
  <div class="bt"${S('materials')}>الوسائل التعليمية</div><div class="tags"${S('materials')}>${p.materials.map(m => `<span>${esc(m)}</span>`).join('')}</div>
  <div class="bt"${S('stages')}>سير الدرس</div>
  <table${S('stages')}><thead><tr><th>المرحلة</th><th>الزمن</th><th>نشاط الأستاذ</th><th>نشاط التلميذ</th></tr></thead><tbody>
  ${p.stages.map(s => `<tr><td><b>${esc(s.title)}</b></td><td>${tm(s.time)}</td><td>${esc(s.teacher)}</td><td>${esc(s.student)}</td></tr>`).join('')}</tbody></table>
  ${evalTxt(p) ? `<div class="bt"${S('eval')}>التقويم / الواجب المنزلي</div><p${S('eval')}>${evalTxt(p)}</p>` : ''}
 </div>`,

t6: p => `<div class="paper t6">
  <div class="hd6"${S('header')}>${lg(p,'lg-m')}<b>${esc(p.school)}</b><span>السنة الدراسية ${esc(p.year)}</span></div>
  <div class="tl">مذكرة تحضير درس</div>
  <div class="kv"><div${S('header')}><b>المادة:</b> ${esc(p.subject)}</div><div${S('header')}><b>القسم:</b> ${esc(p.klass)}</div><div${S('lesson')}><b>عنوان الدرس:</b> ${esc(p.title)}</div><div${S('lesson')}><b>الوحدة:</b> ${esc(p.unit)}</div><div${S('lesson')}><b>الحصة / المدة:</b> ${esc(p.session)} / ${dur(p.duration)}</div><div${S('header')}><b>الأستاذ:</b> ${esc(p.teacher)}</div></div>
  <div class="sec"${S('objectives')}><h5>الأهداف / الكفاءة المستهدفة</h5><div class="bd">${p.objectives.map(o => `<div>— ${esc(o)}</div>`).join('')}</div></div>
  <div class="sec"${S('materials')}><h5>الوسائل التعليمية</h5><div class="bd">${esc(p.materials.join('، '))}</div></div>
  <div class="tbw"${S('stages')}><table><thead><tr><th style="width:150px">المراحل</th><th>نشاط الأستاذ</th><th>نشاط التلميذ</th></tr></thead><tbody>
  ${p.stages.map(s => `<tr><td><b>${esc(s.title)}</b><br><small>${tm(s.time)}</small></td><td>${esc(s.teacher)}</td><td>${esc(s.student)}</td></tr>`).join('')}</tbody></table></div>
  ${evalTxt(p) ? `<div class="sec"${S('eval')}><h5>التقويم / الواجب المنزلي</h5><div class="bd">${evalTxt(p)}</div></div>` : ''}
 </div>`,

t7: p => `<div class="paper t7" style="${cv(p.color)}">
  <div class="band7">${lg(p,'lg-b')}<small${S('header')}>${esc(p.school)} · ${esc(p.year)}</small><h1${S('lesson')}>${esc(p.title)}</h1>
   <div class="chips7"><span${S('header')}>${esc(p.subject)}</span><span${S('header')}>${esc(p.klass)}</span><span${S('lesson')}>الوحدة: ${esc(p.unit)}</span><span${S('lesson')}>الحصة ${esc(p.session)}</span><span${S('lesson')}>${dur(p.duration)}</span><span${S('header')}>${esc(p.teacher)}</span></div></div>
  <div class="bd7">
   <div class="two"><div class="cd7"${S('objectives')}><h5>الأهداف / الكفاءة المستهدفة</h5><ul>${lis(p.objectives)}</ul></div><div class="cd7"${S('materials')}><h5>الوسائل التعليمية</h5><ul>${lis(p.materials)}</ul></div></div>
   <table${S('stages')}><thead><tr><th style="width:170px">المرحلة</th><th style="width:70px">الزمن</th><th>نشاط الأستاذ</th><th>نشاط التلميذ</th></tr></thead><tbody>
   ${p.stages.map(s => `<tr><td><b>${esc(s.title)}</b></td><td>${tm(s.time)}</td><td>${esc(s.teacher)}</td><td>${esc(s.student)}</td></tr>`).join('')}</tbody></table>
   ${evalTxt(p) ? `<div class="ft7"${S('eval')}><b>التقويم / الواجب:</b> ${evalTxt(p)}</div>` : ''}
  </div></div>`,

t8: p => `<div class="paper t8" style="${cv(p.color)}">
  <div class="side">${lg(p,'lg-s2')}
   <div class="kv8"${S('header')}><h5>المعلومات</h5><div>${esc(p.school)}</div><div>${esc(p.year)}</div><div><b>المادة:</b> ${esc(p.subject)}</div><div><b>القسم:</b> ${esc(p.klass)}</div><div><b>الأستاذ:</b> ${esc(p.teacher)}</div><div${S('lesson')}><b>الحصة:</b> ${esc(p.session)} · ${dur(p.duration)}</div></div>
   <div${S('objectives')}><h5>الأهداف</h5><ul>${lis(p.objectives)}</ul></div>
   <div${S('materials')}><h5>الوسائل</h5><ul>${lis(p.materials)}</ul></div>
  </div>
  <div class="main"><small${S('lesson')}>${esc(p.unit)} · ${esc(dt(p))}</small><h1${S('lesson')}>${esc(p.title)}</h1>
   <div class="tlw"${S('stages')}>${p.stages.map((s,i) => `<div class="stp"><div class="nm">${i+1}</div><h6><span>${esc(s.title)}</span><em>${tm(s.time)}</em></h6><div><b>الأستاذ:</b> ${esc(s.teacher)}</div><div><b>التلميذ:</b> ${esc(s.student)}</div></div>`).join('')}</div>
   ${evalTxt(p) ? `<div class="ev8"${S('eval')}><b>التقويم / الواجب:</b> ${evalTxt(p)}</div>` : ''}
  </div></div>`,

/* ===== القوالب الجديدة (9 إلى 16) ===== */

/* 9 — رسمي بإطار مزدوج */
t9: p => { const g = grow(p);
 const c9 = (l, v, sec) => `<div${S(sec)}><small>${l}</small><span>${v ? esc(v) : '—'}</span></div>`;
 return `<div class="paper t9"><div class="o9"><div class="i9">
  ${corner9(0,0)}${corner9(1,0)}${corner9(0,1)}${corner9(1,1)}
  <div class="h9">
   <div class="h9a"${S('header')}><b>${esc(p.school)}</b><span>السنة الدراسية: ${esc(p.year)}</span></div>
   <div class="h9m"${S('header')}>${p.logo ? `<img class="lg9" src="${p.logo}" alt="">` : seal9}</div>
   <div class="h9a h9l"${S('header')}><span><b>المادة:</b> ${esc(p.subject)}</span><span><b>القسم:</b> ${esc(p.klass)}</span></div>
  </div>
  <div class="tt9"${S('lesson')}><div class="lb9">مذكرة تحضير درس</div><h1>${esc(p.title)}</h1>${rule9}</div>
  <div class="kv9">${c9('الوحدة / المحور', p.unit, 'lesson')}${c9('رقم الحصة', p.session, 'lesson')}${c9('المدة', p.duration ? p.duration + ' د' : '', 'lesson')}${c9('التاريخ', dt(p), 'header')}${c9('الأستاذ(ة)', p.teacher, 'header')}</div>
  <div class="two9">
   <div class="bx9"${S('objectives')}><h5>الأهداف / الكفاءة المستهدفة</h5><ol>${lis(p.objectives)}</ol></div>
   <div class="bx9"${S('materials')}><h5>الوسائل التعليمية</h5><ul>${lis(p.materials)}</ul></div>
  </div>
  <div class="tb9"${S('stages')}><div class="hd"><div>المرحلة</div><div>الزمن</div><div>نشاط الأستاذ</div><div>نشاط التلميذ</div></div>
  ${p.stages.map((s,i) => `<div class="rw" style="--g:${g[i]}"><div class="st">${esc(s.title)}</div><div class="tm">${tm(s.time)}</div><div>${esc(s.teacher)}</div><div>${esc(s.student)}</div></div>`).join('')}
  </div>
  ${evalTxt(p) ? `<div class="ev9"${S('eval')}><b>التقويم / الواجب المنزلي:</b> ${evalTxt(p)}</div>` : ''}
 </div></div></div>`; },

/* 10 — عصري بشريط جانبي */
t10: p => { const g = grow(p), c = safeHex(p.color), dk = shade(c, .38);
 const f = (l, v) => `<div class="fact"><small>${l}</small><span>${v ? esc(v) : '—'}</span></div>`;
 let no = 0; const num = () => String(++no).padStart(2, '0');
 return `<div class="paper t10" style="${cv(c)}">
  <aside class="sd" style="background:${dk}">
   <svg class="dec10" viewBox="0 0 240 240" width="240" height="240"><circle cx="190" cy="200" r="120" fill="${shade(c, .22)}"/><circle cx="40" cy="220" r="60" fill="${shade(c, .5)}"/><circle cx="200" cy="60" r="18" fill="${tint(c, .55)}" opacity=".35"/></svg>
   <div class="sd-top"${S('header')}>${p.logo ? `<img class="lg10" src="${p.logo}" alt="">` : ''}<b>${esc(p.school)}</b><span>${esc(p.year)}</span></div>
   <div class="facts"${S('header')}>${f('المادة', p.subject)}${f('القسم', p.klass)}${f('الأستاذ(ة)', p.teacher)}${f('التاريخ', dt(p))}</div>
   <div class="facts"${S('lesson')}>${f('الوحدة / المحور', p.unit)}${f('رقم الحصة', p.session)}${f('المدة', p.duration ? p.duration + ' د' : '')}</div>
   <div class="mat"${S('materials')}><h5>الوسائل التعليمية</h5><ul>${lis(p.materials)}</ul></div>
  </aside>
  <main class="mn">
   <div class="hero"${S('lesson')}><span class="kick">مذكرة تحضير درس</span><h1>${esc(p.title)}</h1><i class="bar"></i></div>
   <section${S('objectives')}><h4><em>${num()}</em>الأهداف / الكفاءة المستهدفة</h4><div class="objs">${p.objectives.map((o, i) => `<div class="ob"><span>${i + 1}</span><p>${esc(o)}</p></div>`).join('')}</div></section>
   <section class="stg"${S('stages')}><h4><em>${num()}</em>سير الدرس</h4><div class="rows">
    ${p.stages.map((s,i) => `<div class="r" style="--g:${g[i]}"><div class="nm"><b>${esc(s.title)}</b><span class="pill">${tm(s.time)}</span></div><div class="ac"><div><i>الأستاذ:</i> ${esc(s.teacher)}</div><div><i>التلميذ:</i> ${esc(s.student)}</div></div></div>`).join('')}
   </div></section>
   ${evalTxt(p) ? `<section class="ev"${S('eval')}><h4><em>${num()}</em>التقويم / الواجب المنزلي</h4><p>${evalTxt(p)}</p></section>` : ''}
  </main></div>`; },

/* 11 — أشكال هندسية ناعمة */
t11: p => { const g = grow(p), c = safeHex(p.color);
 return `<div class="paper t11" style="${cv(c)}">${blob11(c, 'a')}${blob11(c, 'b')}
  <div class="h11"${S('header')}>${p.logo ? `<img class="lg11" src="${p.logo}" alt="">` : ''}<div class="sn"><b>${esc(p.school)}</b><span>السنة الدراسية ${esc(p.year)}</span></div><div class="tg11"><span>${esc(p.subject)}</span><span>${esc(p.klass)}</span></div></div>
  <div class="card11 hero"${S('lesson')}><small>مذكرة تحضير درس · ${esc(p.unit)}</small><h1>${esc(p.title)}</h1>
   <div class="meta11"><span>الحصة ${esc(p.session)}</span><span>${dur(p.duration)}</span><span${S('header')}>الأستاذ(ة): ${esc(p.teacher)}</span><span${S('header')}>${esc(dt(p))}</span></div></div>
  <div class="two11">
   <div class="card11"${S('objectives')}><h5>الأهداف / الكفاءة المستهدفة</h5><ul>${lis(p.objectives)}</ul></div>
   <div class="card11"${S('materials')}><h5>الوسائل التعليمية</h5><div class="pills">${p.materials.map(m => `<span>${esc(m)}</span>`).join('')}</div></div>
  </div>
  <div class="stg11"${S('stages')}><h5>سير الدرس</h5>
   ${p.stages.map((s,i) => `<div class="s11" style="--g:${g[i]}"><div class="n11">${i + 1}</div><div class="b11"><div class="tt"><b>${esc(s.title)}</b><em>${tm(s.time)}</em></div><div class="ac11"><div><i>نشاط الأستاذ</i><p>${esc(s.teacher)}</p></div><div><i>نشاط التلميذ</i><p>${esc(s.student)}</p></div></div></div></div>`).join('')}
  </div>
  ${evalTxt(p) ? `<div class="card11 ev"${S('eval')}><h5>التقويم / الواجب المنزلي</h5><p>${evalTxt(p)}</p></div>` : ''}
 </div>`; },

/* 12 — جداول ملوّنة أنيقة */
t12: p => { const g = grow(p), c = safeHex(p.color);
 const k = (l, v, sec, w) => `<div class="k"${S(sec)}>${l}</div><div class="${w ? 'w' : ''}"${S(sec)}>${v ? esc(v) : '—'}</div>`;
 return `<div class="paper t12" style="${cv(c)}">
  <div class="hdr">
   <div class="a"${S('header')}>${p.logo ? `<img class="lg12" src="${p.logo}" alt="">` : ''}<div><b>${esc(p.school)}</b><span>السنة الدراسية: ${esc(p.year)}</span></div></div>
   <div class="b"${S('lesson')}><small>مذكرة تحضير درس · الحصة ${esc(p.session)}</small><h1>${esc(p.title)}</h1></div>
  </div>
  <div class="tb12 inf">${k('المادة', p.subject, 'header')}${k('القسم', p.klass, 'header')}${k('الوحدة / المحور', p.unit, 'lesson')}${k('المدة', p.duration ? p.duration + ' د' : '', 'lesson')}${k('التاريخ', dt(p), 'header')}${k('رقم الحصة', p.session, 'lesson')}${k('الأستاذ(ة)', p.teacher, 'header', 1)}</div>
  <div class="tb12 obj"${S('objectives')}><div class="hh">الأهداف / الكفاءة المستهدفة</div>${p.objectives.map((o, i) => `<div class="no">${i + 1}</div><div>${esc(o)}</div>`).join('')}</div>
  <div class="tb12 mat"${S('materials')}><div class="k">الوسائل التعليمية</div><div class="ml">${p.materials.map(m => `<span>${esc(m)}</span>`).join('')}</div></div>
  <div class="stg12"${S('stages')}>
   <div class="r h"><div>المرحلة</div><div>الزمن</div><div>نشاط الأستاذ</div><div>نشاط التلميذ</div></div>
   ${p.stages.map((s,i) => { const pl = STAGE_PAL[i % STAGE_PAL.length];
     return `<div class="r b" style="--g:${g[i]}"><div class="st" style="background:${pl[1]};border-right:5px solid ${pl[0]};color:${pl[2]}">${esc(s.title)}</div><div class="tm" style="color:${pl[0]}">${tm(s.time)}</div><div>${esc(s.teacher)}</div><div>${esc(s.student)}</div></div>`; }).join('')}
  </div>
  ${evalTxt(p) ? `<div class="tb12 ev"${S('eval')}><div class="k">التقويم / الواجب المنزلي</div><div>${evalTxt(p)}</div></div>` : ''}
 </div>`; },

/* 13 — بسيط أنيق */
t13: p => { const g = grow(p);
 const m = (l, v, sec) => `<div${S(sec)}><small>${l}</small><span>${v ? esc(v) : '—'}</span></div>`;
 return `<div class="paper t13">
  <div class="h13"${S('header')}><div><b>${esc(p.school)}</b><span>السنة الدراسية ${esc(p.year)}</span></div>${p.logo ? `<img class="lg13" src="${p.logo}" alt="">` : ''}</div>
  <div class="tt13"${S('lesson')}><small>مذكرة تحضير درس</small><h1>${esc(p.title)}</h1></div>
  <div class="mt13">${m('المادة', p.subject, 'header')}${m('القسم', p.klass, 'header')}${m('الوحدة / المحور', p.unit, 'lesson')}${m('الأستاذ(ة)', p.teacher, 'header')}${m('رقم الحصة', p.session, 'lesson')}${m('المدة', p.duration ? p.duration + ' د' : '', 'lesson')}${m('التاريخ', dt(p), 'header')}</div>
  <div class="sc13"${S('objectives')}><h6>الأهداف</h6><div><ol>${lis(p.objectives)}</ol></div></div>
  <div class="sc13"${S('materials')}><h6>الوسائل</h6><div class="ml13">${p.materials.map(esc).join('<i>/</i>')}</div></div>
  <div class="sc13 fl"${S('stages')}><h6>سير الدرس</h6><div class="st13">
   ${p.stages.map((s,i) => `<div class="it" style="--g:${g[i]}"><div class="nm"><b>${esc(s.title)}</b><em>${tm(s.time)}</em></div><div class="ac"><p><i>الأستاذ</i>${esc(s.teacher)}</p><p><i>التلميذ</i>${esc(s.student)}</p></div></div>`).join('')}
  </div></div>
  ${evalTxt(p) ? `<div class="sc13"${S('eval')}><h6>التقويم</h6><div class="evt">${evalTxt(p)}</div></div>` : ''}
 </div>`; },

/* 14 — ترويسة مزخرفة */
t14: p => { const g = grow(p);
 const it = (l, v, sec, w) => `<div class="${w ? 'w' : ''}"${S(sec)}><small>${l}</small><span>${v ? esc(v) : '—'}</span></div>`;
 return `<div class="paper t14">
  <div class="top14"${S('header')}>${band14()}<div class="car14">${p.logo ? `<img class="lg14" src="${p.logo}" alt="">` : ''}<div><b>${esc(p.school)}</b><span>السنة الدراسية ${esc(p.year)}</span></div></div></div>
  <div class="bd14">
   <div class="tt14"${S('lesson')}><small>مذكرة تحضير درس</small><h1>${esc(p.title)}</h1>${flour14}</div>
   <div class="inf14">${it('المادة', p.subject, 'header')}${it('القسم', p.klass, 'header')}${it('الأستاذ(ة)', p.teacher, 'header')}${it('التاريخ', dt(p), 'header')}${it('الوحدة / المحور', p.unit, 'lesson', 1)}${it('رقم الحصة', p.session, 'lesson')}${it('المدة', p.duration ? p.duration + ' د' : '', 'lesson')}</div>
   <div class="two14">
    <div class="bx14"${S('objectives')}><h5>${orn14}<span>الأهداف / الكفاءة المستهدفة</span></h5><ul>${lis(p.objectives)}</ul></div>
    <div class="bx14"${S('materials')}><h5>${orn14}<span>الوسائل التعليمية</span></h5><ul>${lis(p.materials)}</ul></div>
   </div>
   <div class="tb14"${S('stages')}><div class="hd"><div>المرحلة</div><div>الزمن</div><div>نشاط الأستاذ</div><div>نشاط التلميذ</div></div>
   ${p.stages.map((s,i) => `<div class="rw" style="--g:${g[i]}"><div class="st">${esc(s.title)}</div><div class="tm">${tm(s.time)}</div><div>${esc(s.teacher)}</div><div>${esc(s.student)}</div></div>`).join('')}
   </div>
   ${evalTxt(p) ? `<div class="ev14"${S('eval')}><h5>${orn14}<span>التقويم / الواجب المنزلي</span></h5><p>${evalTxt(p)}</p></div>` : ''}
  </div>
  ${strip14()}
 </div>`; },

/* 15 — هادئ للطباعة بالأبيض والأسود */
t15: p => { const g = grow(p);
 const b = (l, v, sec) => `<div class="c"${S(sec)}><small>${l}</small><span>${v ? esc(v) : '—'}</span></div>`;
 let no = 0; const num = () => ++no;
 return `<div class="paper t15">
  <div class="h15"${S('header')}>${p.logo ? `<img class="lg15" src="${p.logo}" alt="">` : ''}<div class="s"><b>${esc(p.school)}</b><span>السنة الدراسية: ${esc(p.year)}</span></div><div class="y"><span>المادة: <b>${esc(p.subject)}</b></span><span>القسم: <b>${esc(p.klass)}</b></span></div></div>
  <div class="tt15"${S('lesson')}><span class="k">مذكرة تحضير درس</span><h1>${esc(p.title)}</h1></div>
  <div class="inf15">${b('الوحدة / المحور', p.unit, 'lesson')}${b('رقم الحصة', p.session, 'lesson')}${b('المدة', p.duration ? p.duration + ' د' : '', 'lesson')}${b('التاريخ', dt(p), 'header')}${b('الأستاذ(ة)', p.teacher, 'header')}</div>
  <div class="two15">
   <div class="bx"${S('objectives')}><h5><i>${num()}</i>الأهداف / الكفاءة المستهدفة</h5><ul>${lis(p.objectives)}</ul></div>
   <div class="bx"${S('materials')}><h5><i>${num()}</i>الوسائل التعليمية</h5><ul>${lis(p.materials)}</ul></div>
  </div>
  <div class="stg15"${S('stages')}><h5><i>${num()}</i>سير الدرس</h5><div class="tb">
   <div class="hd"><div>المرحلة</div><div>الزمن</div><div>نشاط الأستاذ</div><div>نشاط التلميذ</div></div>
   ${p.stages.map((s,i) => `<div class="rw" style="--g:${g[i]}"><div class="st"><em>${i + 1}</em><span>${esc(s.title)}</span></div><div class="tm">${tm(s.time)}</div><div>${esc(s.teacher)}</div><div>${esc(s.student)}</div></div>`).join('')}
  </div></div>
  ${evalTxt(p) ? `<div class="bx ev"${S('eval')}><h5><i>${num()}</i>التقويم / الواجب المنزلي</h5><p>${evalTxt(p)}</p></div>` : ''}
 </div>`; },

/* 16 — اقتصادي في الحبر */
t16: p => { const g = grow(p);
 const f = (l, v, sec) => `<span${S(sec)}><i>${l}:</i> <bdi>${v ? esc(v) : ''}</bdi></span>`;
 return `<div class="paper t16">
  <div class="h16"${S('header')}><div><span>${esc(p.school)}</span><span>السنة الدراسية ${esc(p.year)}</span></div>${p.logo ? `<img class="lg16" src="${p.logo}" alt="">` : ''}</div>
  <div class="tt16"${S('lesson')}><small>مذكرة تحضير درس</small><h1>${esc(p.title)}</h1></div>
  <div class="ln16">${f('المادة', p.subject, 'header')}${f('القسم', p.klass, 'header')}${f('الأستاذ(ة)', p.teacher, 'header')}${f('التاريخ', dt(p), 'header')}${f('الوحدة / المحور', p.unit, 'lesson')}${f('رقم الحصة', p.session, 'lesson')}${f('المدة', p.duration ? p.duration + ' د' : '', 'lesson')}</div>
  <div class="sec16"${S('objectives')}><h5>الأهداف / الكفاءة المستهدفة</h5><ul>${lis(p.objectives)}</ul></div>
  <div class="sec16"${S('materials')}><h5>الوسائل التعليمية</h5><p>${esc(p.materials.join('، '))}</p></div>
  <div class="tb16"${S('stages')}><h5>سير الدرس</h5>
   <div class="hd"><div>المرحلة</div><div>الزمن</div><div>نشاط الأستاذ</div><div>نشاط التلميذ</div></div>
   ${p.stages.map((s,i) => `<div class="rw" style="--g:${g[i]}"><div class="st">${esc(s.title)}</div><div>${tm(s.time)}</div><div>${esc(s.teacher)}</div><div>${esc(s.student)}</div></div>`).join('')}
  </div>
  ${evalTxt(p) ? `<div class="sec16"${S('eval')}><h5>التقويم / الواجب المنزلي</h5><p>${evalTxt(p)}</p></div>` : ''}
 </div>`; },
};
const TPL_KEYS = Object.keys(T);

/* =====================================================================
   المحرر
===================================================================== */
const els = {
  levelSelect: $('levelSelect'), loadPresetBtn: $('loadPresetBtn'),
  fSchool: $('fSchool'), fYearSelect: $('fYearSelect'), fYearManualWrap: $('fYearManualWrap'), fYearManual: $('fYearManual'),
  fSubject: $('fSubject'), fClass: $('fClass'), fDate: $('fDate'), fTeacher: $('fTeacher'),
  fTitle: $('fTitle'), fUnit: $('fUnit'), fSession: $('fSession'), fDuration: $('fDuration'),
  objectivesList: $('objectivesList'), objectiveInput: $('objectiveInput'), addObjectiveBtn: $('addObjectiveBtn'),
  materialsList: $('materialsList'), materialInput: $('materialInput'), addMaterialBtn: $('addMaterialBtn'),
  stagesList: $('stagesList'), addStageBtn: $('addStageBtn'),
  evalToggle: $('evalToggle'), fEval: $('fEval'),
  logoInput: $('logoInput'), logoBox: $('logoBox'), logoPreview: $('logoPreview'),
  logoPlaceholderIcon: $('logoPlaceholderIcon'), logoRemoveBtn: $('logoRemoveBtn'),
  frameDrop: $('frameDrop'), frameInput: $('frameInput'), frameRemoveBtn: $('frameRemoveBtn'),
  colorPicker: $('colorPicker'), colorResetBtn: $('colorResetBtn'),
  saveBtn: $('saveBtn'), exportPdfBtn: $('exportPdfBtn'), printBtn: $('printBtn'),
};

function currentPlan(){ return plansCache[currentPlanId]; }

function populateYearSelect(plan){
  const years = currentAcademicYears();
  const opts = years.slice();
  if (plan.yearSelect && plan.yearSelect !== '__manual__' && !opts.includes(plan.yearSelect) && !plan.yearManual) opts.unshift(plan.yearSelect);
  els.fYearSelect.innerHTML = opts.map(y => `<option value="${esc(y)}">${esc(y)}</option>`).join('') + `<option value="__manual__">${esc(t('year_manual_opt'))}</option>`;
  const isManual = plan.yearSelect === '__manual__' || (plan.yearManual && !opts.includes(plan.yearSelect));
  if (isManual){
    els.fYearSelect.value = '__manual__';
    els.fYearManualWrap.classList.remove('hidden');
    els.fYearManual.value = plan.yearManual || '';
  } else {
    els.fYearSelect.value = opts.includes(plan.yearSelect) ? plan.yearSelect : years[0];
    els.fYearManualWrap.classList.add('hidden');
  }
}

function effectiveYear(plan){
  return plan.yearSelect === '__manual__' ? (plan.yearManual || '') : plan.yearSelect;
}

/* ---------- تحميل مذكرة في المحرر ---------- */
function loadPlanIntoEditor(id){
  const plan = plansCache[id];
  if (!plan) return;
  currentPlanId = id;
  try { localStorage.setItem(LAST_PLAN_KEY, id); } catch(e){}
  if (!Array.isArray(plan.objectives)) plan.objectives = [];
  if (!Array.isArray(plan.materials)) plan.materials = [];
  if (!Array.isArray(plan.stages)) plan.stages = [];
  els.levelSelect.value = LEVEL_TEMPLATES[plan.level] ? plan.level : 'ابتدائي';
  els.fSchool.value = plan.school || '';
  populateYearSelect(plan);
  els.fSubject.value = plan.subject || '';
  els.fClass.value = plan.klass || '';
  els.fDate.value = plan.date || '';
  els.fTeacher.value = plan.teacher || '';
  els.fTitle.value = plan.title || '';
  els.fUnit.value = plan.unit || '';
  els.fSession.value = plan.session || '';
  els.fDuration.value = plan.duration || '';
  els.evalToggle.checked = plan.evalEnabled !== false;
  els.fEval.value = plan.eval || '';
  els.colorPicker.value = safeHex(plan.color);

  renderLists();
  renderStages();
  renderLogo();
  renderFrame();
  applyColor();
  renderPreviewNow();
}

function touchPlan(){
  const plan = currentPlan();
  if (!plan) return;
  plan.updatedAt = new Date().toISOString();
  saveLocalPlans(plansCache);
}

/* ---------- ربط الحقول البسيطة ---------- */
function bindSimple(el, key, transform){
  el.addEventListener('input', () => {
    const plan = currentPlan();
    plan[key] = transform ? transform(el.value) : el.value;
    touchPlan();
    renderPreview();
  });
}
bindSimple(els.fSchool, 'school');
bindSimple(els.fSubject, 'subject');
bindSimple(els.fClass, 'klass');
bindSimple(els.fDate, 'date');
bindSimple(els.fTeacher, 'teacher');
bindSimple(els.fTitle, 'title');
bindSimple(els.fUnit, 'unit');
bindSimple(els.fSession, 'session');
bindSimple(els.fDuration, 'duration');
bindSimple(els.fEval, 'eval');
bindSimple(els.fYearManual, 'yearManual');

els.fYearSelect.addEventListener('change', () => {
  const plan = currentPlan();
  plan.yearSelect = els.fYearSelect.value;
  els.fYearManualWrap.classList.toggle('hidden', plan.yearSelect !== '__manual__');
  touchPlan();
  renderPreview();
});

els.levelSelect.addEventListener('change', () => {
  const plan = currentPlan();
  plan.level = els.levelSelect.value;
  touchPlan();
  renderPreview();
});
els.loadPresetBtn.addEventListener('click', () => {
  if (!confirm(t('confirm_preset'))) return;
  const plan = currentPlan();
  const tpl = LEVEL_TEMPLATES[plan.level];
  Object.assign(plan, {
    school: tpl.school, subject: tpl.subject, klass: tpl.klass, teacher: tpl.teacher,
    title: tpl.title, unit: tpl.unit, session: tpl.session, duration: tpl.duration,
    objectives: tpl.objectives.slice(), materials: tpl.materials.slice(),
    stages: tpl.stages.map(s => ({...s})), eval: tpl.eval,
  });
  touchPlan();
  loadPlanIntoEditor(currentPlanId);
  toast(t('t_preset'));
});

els.evalToggle.addEventListener('change', () => {
  const plan = currentPlan();
  plan.evalEnabled = els.evalToggle.checked;
  touchPlan();
  renderPreview();
});

/* ---------- الأهداف / الوسائل (قوائم قابلة للإضافة والتعديل) ---------- */
const IC = {
  del: '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  up: '<svg viewBox="0 0 24 24"><path d="M6 15l6-6 6 6"/></svg>',
  down: '<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>',
  open: '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
  dup: '<svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
};

function renderLists(){
  renderOneList(els.objectivesList, 'objectives');
  renderOneList(els.materialsList, 'materials');
}
function renderOneList(listEl, key){
  const items = currentPlan()[key];
  listEl.innerHTML = '';
  listEl.dataset.empty = t('empty_list');
  items.forEach((text, idx) => {
    const row = document.createElement('div');
    row.className = 'item-row';
    const dot = document.createElement('span');
    dot.className = 'dot'; dot.textContent = idx + 1;
    const inp = document.createElement('input');
    inp.type = 'text'; inp.className = 'inp'; inp.value = text;
    inp.addEventListener('input', () => { currentPlan()[key][idx] = inp.value; touchPlan(); renderPreview(); });
    const del = document.createElement('button');
    del.type = 'button'; del.className = 'icon-sq del'; del.title = t('del'); del.setAttribute('aria-label', t('del'));
    del.innerHTML = IC.del;
    del.addEventListener('click', () => {
      currentPlan()[key].splice(idx, 1);
      touchPlan();
      renderOneList(listEl, key);
      renderPreview();
    });
    row.append(dot, inp, del);
    listEl.appendChild(row);
  });
}
function bindAddItem(inputEl, btnEl, key, listEl){
  const add = () => {
    const val = inputEl.value.trim();
    if (!val) return;
    currentPlan()[key].push(val);
    inputEl.value = '';
    touchPlan();
    renderOneList(listEl, key);
    renderPreview();
  };
  btnEl.addEventListener('click', add);
  inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter'){ e.preventDefault(); add(); } });
}
bindAddItem(els.objectiveInput, els.addObjectiveBtn, 'objectives', els.objectivesList);
bindAddItem(els.materialInput, els.addMaterialBtn, 'materials', els.materialsList);

/* ---------- سير الدرس ---------- */
function renderStages(){
  const plan = currentPlan();
  els.stagesList.innerHTML = '';
  plan.stages.forEach((stage, idx) => {
    const item = document.createElement('div');
    item.className = 'stage-item';
    item.innerHTML = `
      <div class="stage-top">
        <span class="stage-no">${idx + 1}</span>
        <input type="text" class="inp stage-title" placeholder="${esc(t('stage_name'))}" aria-label="${esc(t('stage_name'))}">
        <div class="time-wrap"><input type="number" min="0" class="inp stage-time" aria-label="${esc(t('min'))}"><span>${esc(t('min'))}</span></div>
        <div class="stage-tools">
          <button type="button" class="icon-sq" data-a="up" title="${esc(t('move_up'))}" aria-label="${esc(t('move_up'))}"${idx === 0 ? ' disabled' : ''}>${IC.up}</button>
          <button type="button" class="icon-sq" data-a="down" title="${esc(t('move_down'))}" aria-label="${esc(t('move_down'))}"${idx === plan.stages.length - 1 ? ' disabled' : ''}>${IC.down}</button>
          <button type="button" class="icon-sq del" data-a="del" title="${esc(t('del'))}" aria-label="${esc(t('del'))}">${IC.del}</button>
        </div>
      </div>
      <div class="stage-grid">
        <div class="field"><label>${esc(t('act_teacher'))}</label><textarea class="inp stage-teacher" placeholder="${esc(t('ph_teacher'))}"></textarea></div>
        <div class="field stu"><label>${esc(t('act_student'))}</label><textarea class="inp stage-student" placeholder="${esc(t('ph_student'))}"></textarea></div>
      </div>`;
    const bind = (sel, key) => {
      const el = item.querySelector(sel);
      el.value = stage[key] || '';
      el.addEventListener('input', () => { stage[key] = el.value; touchPlan(); renderPreview(); });
    };
    bind('.stage-title', 'title'); bind('.stage-time', 'time'); bind('.stage-teacher', 'teacher'); bind('.stage-student', 'student');
    item.querySelector('.stage-tools').addEventListener('click', (e) => {
      const b = e.target.closest('[data-a]'); if (!b) return;
      const a = b.dataset.a;
      if (a === 'del') plan.stages.splice(idx, 1);
      else {
        const j = a === 'up' ? idx - 1 : idx + 1;
        if (j < 0 || j >= plan.stages.length) return;
        [plan.stages[idx], plan.stages[j]] = [plan.stages[j], plan.stages[idx]];
      }
      touchPlan();
      renderStages();
      renderPreview();
    });
    els.stagesList.appendChild(item);
  });
}
els.addStageBtn.addEventListener('click', () => {
  currentPlan().stages.push({ title: '', time: '', teacher: '', student: '' });
  touchPlan();
  renderStages();
  renderPreview();
  const last = els.stagesList.lastElementChild;
  if (last){ last.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); last.querySelector('.stage-title').focus({ preventScroll: true }); }
});

/* ---------- الشعار (محلي فقط) ---------- */
function renderLogo(){
  const asset = assetsCache[currentPlanId];
  const logo = asset && asset.logo;
  els.logoPreview.classList.toggle('hidden', !logo);
  els.logoPlaceholderIcon.classList.toggle('hidden', !!logo);
  els.logoRemoveBtn.classList.toggle('hidden', !logo);
  if (logo) els.logoPreview.src = logo;
}
els.logoBox.addEventListener('click', (e) => { if (e.target !== els.logoRemoveBtn) els.logoInput.click(); });
els.logoBox.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); els.logoInput.click(); } });
els.logoInput.addEventListener('change', () => {
  const file = els.logoInput.files[0];
  if (!file) return;
  readImageResized(file, 240, (dataUrl) => {
    assetsCache[currentPlanId] = assetsCache[currentPlanId] || {};
    assetsCache[currentPlanId].logo = dataUrl;
    saveLocalAssets(assetsCache);
    renderLogo();
    renderPreview();
  }, true);
});
els.logoRemoveBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (assetsCache[currentPlanId]) delete assetsCache[currentPlanId].logo;
  saveLocalAssets(assetsCache);
  els.logoInput.value = '';
  renderLogo();
  renderPreview();
});

/* ---------- إطار الخلفية (محلي فقط) ---------- */
function renderFrame(){
  const asset = assetsCache[currentPlanId];
  const frame = asset && asset.frame;
  els.frameRemoveBtn.classList.toggle('hidden', !frame);
  els.frameDrop.classList.toggle('has', !!frame);
  els.frameDrop.style.backgroundImage = frame ? `linear-gradient(rgba(0,0,0,.25),rgba(0,0,0,.25)),url("${frame}")` : '';
  document.documentElement.style.setProperty('--frame', frame ? `url("${frame}")` : 'none');
  updateSummaries();
}
function setFrameFile(file){
  if (!file || !/^image\//.test(file.type)) return;
  readImageResized(file, 1400, (dataUrl) => {
    assetsCache[currentPlanId] = assetsCache[currentPlanId] || {};
    assetsCache[currentPlanId].frame = dataUrl;
    saveLocalAssets(assetsCache);
    renderFrame();
  });
}
els.frameDrop.addEventListener('click', () => els.frameInput.click());
els.frameDrop.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); els.frameInput.click(); } });
els.frameDrop.addEventListener('dragover', (e) => { e.preventDefault(); els.frameDrop.classList.add('over'); });
els.frameDrop.addEventListener('dragleave', () => els.frameDrop.classList.remove('over'));
els.frameDrop.addEventListener('drop', (e) => {
  e.preventDefault(); els.frameDrop.classList.remove('over');
  setFrameFile(e.dataTransfer.files && e.dataTransfer.files[0]);
});
els.frameInput.addEventListener('change', () => setFrameFile(els.frameInput.files[0]));
els.frameRemoveBtn.addEventListener('click', () => {
  if (assetsCache[currentPlanId]) delete assetsCache[currentPlanId].frame;
  saveLocalAssets(assetsCache);
  els.frameInput.value = '';
  renderFrame();
});

function readImageResized(file, maxDim, cb, keepPng){
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim){
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      // الشعار قد يحتوي على شفافية: نحافظ عليها بصيغة PNG
      cb(keepPng && /png|svg|webp|gif/.test(file.type) ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.82));
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

/* ---------- لون المذكرة ---------- */
const SWATCHES = ['#1A8A72','#2F6FB0','#C0392B','#7C3AED','#D97706','#0F766E','#DB2777','#334155'];
function renderSwatches(){
  const cur = safeHex(currentPlan() && currentPlan().color).toLowerCase();
  $('swatches').innerHTML = SWATCHES.map(c => `<button type="button" class="sw${c.toLowerCase() === cur ? ' on' : ''}" data-color="${c}" style="background:${c}" aria-label="${c}"></button>`).join('');
}
$('swatches').addEventListener('click', (e) => {
  const b = e.target.closest('[data-color]'); if (!b) return;
  setPlanColor(b.dataset.color);
});
function setPlanColor(c){
  currentPlan().color = c;
  els.colorPicker.value = c;
  touchPlan();
  applyColor();
  renderPreview();
}
function applyColor(){
  const color = safeHex(currentPlan().color);
  document.documentElement.style.setProperty('--tool', color);
  document.documentElement.style.setProperty('--tool-soft', hexToSoft(color));
  renderSwatches();
}
function hexToSoft(hex){
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 0.14)`;
}
els.colorPicker.addEventListener('input', () => setPlanColor(els.colorPicker.value));
els.colorResetBtn.addEventListener('click', () => setPlanColor(DEFAULT_COLOR));

/* ---------- المعاينة الحيّة ---------- */
function planView(plan){
  const a = assetsCache[plan.id] || {};
  return Object.assign({}, plan, {
    objectives: plan.objectives || [], materials: plan.materials || [], stages: plan.stages || [],
    color: safeHex(plan.color),
    year: effectiveYear(plan),
    logo: a.logo || '',
    template: T[plan.template] ? plan.template : 't5', // المذكرات القديمة تبقى بتصميمها الأصلي
  });
}

let pvRaf = null;
function renderPreview(){
  cancelAnimationFrame(pvRaf);
  pvRaf = requestAnimationFrame(renderPreviewNow);
}
function renderPreviewNow(){
  const plan = currentPlan();
  if (!plan) return;
  const vm = planView(plan);
  $('pvScale').innerHTML = T[vm.template](vm);
  highlight();
  applyZoom();
  renderCurrentThumb(vm);
  updateSummaries();
}

/* ---------- صورة مصغّرة حقيقية لقالب ---------- */
function miniHTML(vm, tplKey){
  return `<div class="mini" dir="rtl">${T[tplKey || vm.template](vm)}</div>`;
}
function fitMinis(root){
  $$('.mini', root).forEach(m => {
    const box = m.parentElement;
    if (box.clientWidth) m.style.transform = `scale(${box.clientWidth / 794})`;
  });
}
function renderCurrentThumb(vm){
  vm = vm || planView(currentPlan());
  $('currentThumb').innerHTML = miniHTML(vm);
  $('currentTplName').textContent = `${vm.template.slice(1)}. ${tplName(vm.template)}`;
  fitMinis($('currentThumb'));
}

/* ---------- معرض القوالب ---------- */
let gCat = 'all';
const G_CATS = ['all', 'classic', 'modern', 'print', 'new'];
function openGallery(){
  $('gallery').classList.remove('hidden');
  $('gSearch').value = '';
  renderGalleryCats();
  renderThumbs();
  setTimeout(() => $('gSearch').focus(), 50);
}
function closeGallery(){ $('gallery').classList.add('hidden'); }
function renderGalleryCats(){
  $('gCats').innerHTML = G_CATS.map(c => `<button type="button" class="chip${c === gCat ? ' on' : ''}" data-cat="${c}">${esc(t('cat_' + c))}</button>`).join('');
}
function renderThumbs(){
  const vm = planView(currentPlan());
  const q = $('gSearch').value.trim().toLowerCase();
  const keys = TPL_KEYS.filter(k => {
    if (gCat !== 'all' && !TPL_CATS[k].includes(gCat)) return false;
    if (!q) return true;
    const hay = [k.slice(1), NAMES[k], NAMES_I18N.fr[k], NAMES_I18N.en[k]].join(' ').toLowerCase();
    return hay.includes(q);
  });
  $('thumbs').innerHTML = keys.length ? keys.map(k =>
    `<button type="button" class="g-card thumb${k === vm.template ? ' on' : ''}" data-t="${k}" aria-label="${esc(tplName(k))}">` +
    (TPL_CATS[k].includes('new') ? `<span class="g-new-tag">${esc(t('new_tag'))}</span>` : '') +
    `<div class="g-thumb">${miniHTML(vm, k)}</div>` +
    `<div class="g-meta"><b>${k.slice(1)}. ${esc(tplName(k))}</b>${COLOR_TPLS.includes(k) ? `<span style="background:${tint(vm.color, .15)};color:${shade(vm.color, .2)}">●</span>` : ''}</div></button>`).join('')
    : `<div class="g-empty">${esc(t('no_results'))}</div>`;
  requestAnimationFrame(() => fitMinis($('thumbs')));
}
function initTemplates(){
  $('btnGallery').addEventListener('click', openGallery);
  $('gClose').addEventListener('click', closeGallery);
  $('gSearch').addEventListener('input', renderThumbs);
  $('gCats').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]'); if (!b) return;
    gCat = b.dataset.cat; renderGalleryCats(); renderThumbs();
  });
  $('gallery').addEventListener('click', (e) => {
    if (e.target.id === 'gallery'){ closeGallery(); return; }
    const b = e.target.closest('.thumb');
    if (!b || !currentPlanId) return;
    currentPlan().template = b.dataset.t;
    touchPlan();
    renderPreviewNow();
    closeGallery();
    toast(t('t_tpl', { name: tplName(b.dataset.t) }));
  });
}

/* ---------- التكبير والتصغير وملاءمة الشاشة ---------- */
let zoom = 'fit';
function initZoom(){
  try {
    const z = localStorage.getItem(ZOOM_KEY);
    const n = parseFloat(z);
    if (z && z !== 'fit' && n >= 0.2 && n <= 2) zoom = n;
  } catch(e){}
  $('zoomOut').addEventListener('click', () => setZoom(-1));
  $('zoomIn').addEventListener('click', () => setZoom(1));
  $('zoomFit').addEventListener('click', () => { zoom = 'fit'; saveZoom(); applyZoom(); });
  window.addEventListener('resize', () => { applyZoom(); fitMinis($('currentThumb')); if (!$('gallery').classList.contains('hidden')) fitMinis($('thumbs')); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { applyZoom(); });
}
function saveZoom(){ try { localStorage.setItem(ZOOM_KEY, String(zoom)); } catch(e){} }
function fitScale(){
  const box = $('pvBox');
  const w = box.clientWidth - 56, h = box.clientHeight - 28 - 84;
  return Math.max(0.2, Math.min(w / 794, h / 1123, 1.5));
}
function setZoom(dir){
  let s = zoom === 'fit' ? fitScale() : zoom;
  s = Math.round((s + dir * 0.1) * 10) / 10;
  zoom = Math.max(0.2, Math.min(2, s));
  saveZoom();
  applyZoom();
}
function applyZoom(){
  const wrap = $('pvWrap'), sc = $('pvScale');
  const paper = sc.firstElementChild;
  if (!paper || !$('pvBox').clientWidth) return;
  const s = zoom === 'fit' ? fitScale() : zoom;
  sc.style.transform = `scale(${s})`;
  wrap.style.width = Math.round(794 * s) + 'px';
  wrap.style.height = Math.round(paper.offsetHeight * s) + 'px';
  $('zoomPct').textContent = Math.round(s * 100) + '%';
  $('zoomFit').classList.toggle('on', zoom === 'fit');
}

/* ---------- الأقسام القابلة للطيّ (كلها مطويّة عند الفتح) ---------- */
const SEC_ORDER = ['level','header','lesson','objectives','materials','stages','eval','frame','color'];
const SEC_COLORS = { level:'#64748B', header:'#16A34A', lesson:'#0891B2', objectives:'#7C3AED', materials:'#D97706', stages:'#2563EB', eval:'#0D9488', frame:'#9333EA', color:'#DB2777' };

function toggleSec(id, force){
  const on = force === undefined ? openSec !== id : force;
  openSec = on ? id : null;
  $$('.acc').forEach(a => a.classList.toggle('open', a.dataset.sec === openSec));
  highlight();
}
function highlight(){
  $$('#pvScale [data-sec]').forEach(el => {
    const on = !!openSec && el.dataset.sec === openSec;
    el.classList.toggle('hl', on);
    if (on) el.style.setProperty('--hl', SEC_COLORS[openSec]);
  });
}
function initAccordion(){
  $('accordion').addEventListener('click', (e) => {
    const head = e.target.closest('.acc-head');
    if (head){ toggleSec(head.closest('.acc').dataset.sec); return; }
    const nx = e.target.closest('.acc-next');
    if (nx){
      const i = SEC_ORDER.indexOf(nx.closest('.acc').dataset.sec);
      const nextSec = SEC_ORDER[i + 1];
      toggleSec(nextSec || null, !!nextSec);
      if (nextSec) setTimeout(() => document.querySelector(`.acc[data-sec="${nextSec}"]`).scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    }
  });
  // الضغط على جزء من المذكرة يفتح القسم الخاص به
  $('pvScale').addEventListener('click', (e) => {
    const part = e.target.closest('[data-sec]');
    if (!part) return;
    const id = part.dataset.sec;
    if ($('workspace').classList.contains('collapsed')) togglePanel();
    toggleSec(id, true);
    setTimeout(() => {
      const acc = document.querySelector(`.acc[data-sec="${id}"]`);
      if (acc) acc.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  });
}

/* ملخص ما كُتب في كل قسم (تحت عنوانه) */
/* يعيد أجزاء الملخص؛ كل جزء يُعرض معزولًا (bdi) حتى لا يختلط اتجاه النص العربي باللاتيني */
function secSummary(id, p){
  const parts = a => a.map(v => String(v || '').replace(/\s+/g, ' ').trim()).filter(Boolean);
  switch (id){
    case 'level': return [t(LEVEL_KEYS[p.level] || 'lv_primary')];
    case 'header': return parts([p.school, p.subject, p.klass, p.teacher]);
    case 'lesson': return parts([p.title, p.unit, p.duration ? p.duration + ' ' + t('min') : '']);
    case 'objectives': return p.objectives.length ? parts([t('sum_items', { n: p.objectives.length }), p.objectives[0]]) : [];
    case 'materials': return parts(p.materials);
    case 'stages': {
      const m = p.stages.reduce((s, x) => s + (parseInt(x.time) || 0), 0);
      return p.stages.length ? [t('sum_stages', { n: p.stages.length, m })] : [];
    }
    case 'eval': return p.evalEnabled === false ? [t('sum_hidden')] : parts([p.eval]);
    case 'frame': { const a = assetsCache[currentPlanId]; return [a && a.frame ? t('sum_frame_on') : t('sum_frame_off')]; }
    case 'color': return [safeHex(p.color).toUpperCase()];
  }
  return [];
}
function updateSummaries(){
  const p = currentPlan(); if (!p) return;
  SEC_ORDER.forEach(id => {
    const el = document.querySelector(`.acc[data-sec="${id}"] .acc-sum`);
    if (!el) return;
    const ps = secSummary(id, p);
    el.innerHTML = ps.length ? ps.map(x => `<bdi>${esc(x.length > 60 ? x.slice(0, 58) + '…' : x)}</bdi>`).join(' · ') : esc(t('sum_empty'));
  });
}

/* ---------- إظهار / إخفاء حيّز الملء ---------- */
function togglePanel(){
  $('workspace').classList.toggle('collapsed');
  setTimeout(applyZoom, 320);
}

/* =====================================================================
   المصادقة (نافذة تسجيل الدخول عند الحاجة، مثل أداة المطويات)
===================================================================== */
const AUTH_ERR = {
  'auth/email-already-in-use': 'auth_email_in_use',
  'auth/invalid-email': 'auth_invalid_email',
  'auth/weak-password': 'auth_weak',
  'auth/wrong-password': 'auth_wrong',
  'auth/user-not-found': 'auth_nouser',
  'auth/invalid-credential': 'auth_invalid',
  'auth/popup-closed-by-user': 'auth_popup',
};
function authErrMsg(code){ return t(AUTH_ERR[code] || 'auth_default'); }

let authMode = 'login';

function openAuthModal(){
  $('authOverlay').classList.remove('hidden');
  $('authError').classList.add('hidden');
  setAuthMode('login');
}
function closeAuthModal(){
  $('authOverlay').classList.add('hidden');
  pendingSaveAfterLogin = false;
}
function setAuthMode(mode){
  authMode = mode;
  const isLogin = mode === 'login';
  $('authModalTitle').textContent = isLogin ? t('login_title') : t('signup_title');
  $('authSubmitBtn').textContent = isLogin ? t('login_btn') : t('signup_btn');
  $('authNameField').classList.toggle('hidden', isLogin);
  $('authSwitchText').textContent = isLogin ? t('no_account') : t('have_account');
  $('authSwitchBtn').textContent = isLogin ? t('create_account') : t('login_title');
  $('authError').classList.add('hidden');
}
function showAuthError(msg){ $('authError').textContent = msg; $('authError').classList.remove('hidden'); }

function initAuthModal(){
  $('authCloseBtn').addEventListener('click', closeAuthModal);
  $('authCancelBtn').addEventListener('click', closeAuthModal);
  $('authOverlay').addEventListener('click', (e) => { if (e.target === $('authOverlay')) closeAuthModal(); });
  $('authSwitchBtn').addEventListener('click', () => setAuthMode(authMode === 'login' ? 'signup' : 'login'));

  $('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!hasFb()){ showAuthError(t('t_no_fb')); return; }
    const email = $('authEmail').value.trim();
    const password = $('authPassword').value;
    const name = $('authName').value.trim();
    const btn = $('authSubmitBtn');
    btn.disabled = true;
    const originalLabel = btn.textContent;
    btn.textContent = '…';
    try {
      if (authMode === 'login'){
        await window.fbAuth.signInWithEmailAndPassword(email, password);
      } else {
        const cred = await window.fbAuth.createUserWithEmailAndPassword(email, password);
        if (name) await cred.user.updateProfile({ displayName: name });
      }
      $('authOverlay').classList.add('hidden');
    } catch(err){
      showAuthError(authErrMsg(err.code));
    } finally {
      btn.disabled = false;
      btn.textContent = originalLabel;
    }
  });

  $('googleAuthBtn').addEventListener('click', async () => {
    if (!hasFb()){ showAuthError(t('t_no_fb')); return; }
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await window.fbAuth.signInWithPopup(provider);
      $('authOverlay').classList.add('hidden');
    } catch(err){
      if (err.code !== 'auth/popup-closed-by-user') showAuthError(authErrMsg(err.code));
    }
  });
}

function renderAuthUI(){
  const btn = $('authBtn');
  const menu = $('authMenu');
  if (currentUser){
    const nm = currentUser.name || currentUser.email || '';
    const initial = (nm || '؟')[0].toUpperCase();
    btn.classList.add('in');
    btn.innerHTML = currentUser.picture ? `<img src="${esc(currentUser.picture)}" alt="" referrerpolicy="no-referrer">` : `<span class="ini">${esc(initial)}</span>`;
    menu.innerHTML = `<div class="who"><b>${esc(nm)}</b><small>${esc(currentUser.email || '')}</small></div><button type="button" id="logoutBtn">${esc(t('logout'))}</button>`;
    $('logoutBtn').addEventListener('click', () => { menu.classList.add('hidden'); window.fbAuth.signOut(); });
  } else {
    btn.classList.remove('in');
    btn.innerHTML = IC.user;
    menu.innerHTML = '';
  }
  $('guestNote').classList.toggle('hidden', !!currentUser);
}

function initAuthMenu(){
  const wrap = $('authWrap');
  const btn = $('authBtn');
  const menu = $('authMenu');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentUser){ menu.classList.toggle('hidden'); }
    else { openAuthModal(); }
  });
  document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) menu.classList.add('hidden'); });
}

/* =====================================================================
   مذكراتي — بطاقات مرقّمة (الترقيم هنا فقط)
===================================================================== */
function relativeDate(iso){
  if (!iso) return '';
  const d = new Date(iso);
  const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diffDays <= 0) return t('today');
  if (diffDays === 1) return t('yesterday');
  if (diffDays < 7) return t('days_ago', { n: diffDays });
  return d.toLocaleDateString(uiLang === 'ar' ? 'ar-DZ' : uiLang);
}
function sortedPlanIds(){
  return Object.keys(plansCache).sort((a, b) => {
    const ta = new Date(plansCache[a].updatedAt || 0).getTime();
    const tb = new Date(plansCache[b].updatedAt || 0).getTime();
    return tb - ta;
  });
}
function openMine(){
  $('mine').classList.remove('hidden');
  renderGallery();
}
function closeMine(){ $('mine').classList.add('hidden'); }

function renderGallery(){
  $('guestNote').classList.toggle('hidden', !!currentUser);
  const grid = $('plansGrid');
  const ids = sortedPlanIds();
  const cards = ids.map((id, idx) => {
    const plan = plansCache[id];
    const vm = planView(plan);
    const a = assetsCache[id] || {};
    return `<div class="g-card m-card plan-card" data-mid="${esc(id)}">
      <span class="plan-index" title="${esc(t('plan_no'))}">${idx + 1}</span>
      ${id === currentPlanId ? `<span class="m-tag">${esc(t('current'))}</span>` : ''}
      <div class="g-thumb" data-act="open" style="--frame:${a.frame ? `url('${a.frame}')` : 'none'}">${miniHTML(vm)}</div>
      <div class="g-meta"><b>${esc(plan.title || t('untitled'))}</b><span class="plan-level-badge">${esc(t(LEVEL_KEYS[plan.level] || 'lv_primary'))}</span></div>
      <div class="m-sub">${esc(plan.subject || '')}${plan.klass ? ' · ' + esc(plan.klass) : ''}</div>
      <div class="m-date">${esc(t('last_edit', { d: relativeDate(plan.updatedAt) }))}</div>
      <div class="m-actions">
        <button type="button" class="primary" data-act="open">${IC.open}${esc(t('open_b'))}</button>
        <button type="button" data-act="dup">${IC.dup}${esc(t('dup_b'))}</button>
        <button type="button" class="danger icon plan-delete-btn" data-act="del" title="${esc(t('del_b'))}" aria-label="${esc(t('del_b'))}">${IC.del}</button>
      </div></div>`;
  }).join('');
  grid.innerHTML = `<button type="button" class="g-card m-new" data-act="new" id="newPlanBtn">${IC.plus}<span>${esc(t('new_b'))}</span></button>` + cards;
  requestAnimationFrame(() => fitMinis(grid));
}

function createNewPlan(){
  const plan = makeNewPlan('ابتدائي');
  plansCache[plan.id] = plan;
  saveLocalPlans(plansCache);
  openSec = null;
  toggleSec(null, false);
  loadPlanIntoEditor(plan.id);
  return plan;
}
function duplicatePlan(id){
  const src = plansCache[id]; if (!src) return;
  const now = new Date().toISOString();
  const copy = JSON.parse(JSON.stringify(src));
  copy.id = newPlanId();
  copy.title = (src.title || t('untitled')) + t('copy_suffix');
  copy.createdAt = now; copy.updatedAt = now;
  plansCache[copy.id] = copy;
  saveLocalPlans(plansCache);
  if (assetsCache[id]){ assetsCache[copy.id] = Object.assign({}, assetsCache[id]); saveLocalAssets(assetsCache); }
}
function deletePlan(id){
  if (!confirm(t('confirm_del'))) return false;
  delete plansCache[id];
  saveLocalPlans(plansCache);
  delete assetsCache[id];
  saveLocalAssets(assetsCache);
  if (currentUser && hasFb()){
    window.fbDb.collection('users').doc(currentUser.uid).collection('lessonPlans').doc(id).delete().catch(() => {});
  }
  if (id === currentPlanId){
    const next = sortedPlanIds()[0];
    if (next) loadPlanIntoEditor(next); else createNewPlan();
  }
  return true;
}

function initMine(){
  $('btnMine').addEventListener('click', openMine);
  $('mClose').addEventListener('click', closeMine);
  $('guestLoginBtn').addEventListener('click', openAuthModal);
  $('mine').addEventListener('click', (e) => {
    if (e.target.id === 'mine'){ closeMine(); return; }
    const btn = e.target.closest('[data-act]'); if (!btn) return;
    const act = btn.dataset.act;
    if (act === 'new'){ createNewPlan(); closeMine(); toast(t('t_new')); return; }
    const card = btn.closest('[data-mid]'); if (!card) return;
    const id = card.dataset.mid;
    if (act === 'open'){ toggleSec(null, false); loadPlanIntoEditor(id); closeMine(); toast(t('t_opened')); }
    else if (act === 'dup'){ duplicatePlan(id); renderGallery(); toast(t('t_dup')); }
    else if (act === 'del'){ if (deletePlan(id)){ renderGallery(); toast(t('t_deleted')); } }
  });
}

/* =====================================================================
   الحفظ في الحساب (Firestore، نص فقط) — users/{uid}/lessonPlans
===================================================================== */
function sanitizedForFirestore(plan){
  const { id, level, template, color, school, yearSelect, yearManual, subject, klass, date, teacher,
    title, unit, session, duration, objectives, materials, stages, evalEnabled, eval: evalText,
    createdAt, updatedAt } = plan;
  const out = { id, level, template, color, school, yearSelect, yearManual, subject, klass, date, teacher,
    title, unit, session, duration, objectives, materials, stages, evalEnabled, eval: evalText,
    createdAt, updatedAt };
  Object.keys(out).forEach(k => { if (out[k] === undefined) delete out[k]; });
  return out;
}

let saving = false;
async function performSave(){
  if (!hasFb()){ toast(t('t_no_fb')); return; }
  if (!currentUser){ pendingSaveAfterLogin = true; openAuthModal(); pendingSaveAfterLogin = true; return; }
  if (saving) return;
  const plan = currentPlan();
  touchPlan();
  saving = true;
  els.saveBtn.disabled = true;
  toast(t('saving'));
  try {
    await window.fbDb.collection('users').doc(currentUser.uid).collection('lessonPlans').doc(plan.id)
      .set(sanitizedForFirestore(plan), { merge: true });
    toast(t('t_saved_cloud'));
  } catch(err){
    console.error(err);
    toast(t('t_save_err'));
  } finally {
    saving = false;
    els.saveBtn.disabled = false;
  }
}

/* ---------- مزامنة Firestore عند تسجيل الدخول ---------- */
function mergeRemotePlans(remotePlans){
  remotePlans.forEach(remote => {
    if (!remote || !remote.id) return;
    const local = plansCache[remote.id];
    if (!local || new Date(remote.updatedAt || 0) >= new Date(local.updatedAt || 0)){
      plansCache[remote.id] = Object.assign({}, local, remote);
    }
  });
  saveLocalPlans(plansCache);
}

async function fetchRemotePlans(){
  if (!currentUser || !hasFb()) return;
  try {
    const snap = await window.fbDb.collection('users').doc(currentUser.uid).collection('lessonPlans').get();
    const remote = [];
    snap.forEach(doc => remote.push(doc.data()));
    mergeRemotePlans(remote);
    if (!$('mine').classList.contains('hidden')) renderGallery();
  } catch(err){ /* تجاهل بصمت لو ما فيه اتصال */ }
}

/* =====================================================================
   الطباعة و PDF — من ورقة بحجمها الحقيقي (بدون إطارات التحديد)
===================================================================== */
function buildPrintPaper(){
  const root = $('printRoot');
  root.innerHTML = T[planView(currentPlan()).template](planView(currentPlan()));
  return root.firstElementChild;
}
function doPrint(){
  buildPrintPaper();
  toast(t('t_print'));
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  fonts.then(() => setTimeout(() => window.print(), 250));
}
window.addEventListener('afterprint', () => { $('printRoot').innerHTML = ''; });

async function doPdf(){
  if (typeof html2canvas === 'undefined' || !window.jspdf){ toast(t('t_pdf_err')); return; }
  const btn = els.exportPdfBtn;
  btn.disabled = true;
  toast(t('t_pdf'));
  try {
    if (document.fonts) await document.fonts.ready;
    const paper = buildPrintPaper();
    await new Promise(r => setTimeout(r, 60));
    const canvas = await html2canvas(paper, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false, scrollX: 0, scrollY: 0 });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight, position = 0;
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 1){
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    const plan = currentPlan();
    const fileName = (plan.title || 'مذكرة-درس').replace(/[\\/:*?"<>|]/g, '').trim() || 'مذكرة-درس';
    pdf.save(`${fileName}.pdf`);
    toast(t('t_pdf_ok'));
  } catch(err){
    console.error(err);
    toast(t('t_pdf_err'));
  } finally {
    $('printRoot').innerHTML = '';
    btn.disabled = false;
  }
}

/* ---------- تنبيه ---------- */
let toastTimer = null;
function toast(msg){
  const el = $('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

/* =====================================================================
   لغة الواجهة — مواقع الأزرار لا تتغيّر، يتغيّر اتجاه محتوى حيّز الملء فقط
===================================================================== */
function applyUiLang(){
  document.documentElement.lang = uiLang;
  document.documentElement.dir = uiLang === 'ar' ? 'rtl' : 'ltr';
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  $$('[data-tip]').forEach(el => { el.setAttribute('data-tiptext', t(el.dataset.tip)); el.setAttribute('aria-label', t(el.dataset.tip)); });
  $('langToggle').textContent = uiLang.toUpperCase();
  $$('#langMenu button').forEach(b => b.classList.toggle('on', b.dataset.lang === uiLang));
  document.title = uiLang === 'ar' ? 'مولد مذكرة تحضير الدروس للأساتذة — أكاديمية مرابطي' : t('tool_name') + (uiLang === 'ar' ? ' — أكاديمية مرابطي' : ' — Merabti Academy');
  $('colorHint').textContent = t('color_hint', { list: COLOR_TPLS.map(k => k.slice(1)).join('، ').replace(/، /g, uiLang === 'ar' ? '، ' : ', ') });
  setAuthMode(authMode);
  renderAuthUI();
  if (currentPlan()){
    populateYearSelect(currentPlan());
    renderLists();
    renderStages();
    renderCurrentThumb();
    updateSummaries();
  }
  if (!$('gallery').classList.contains('hidden')){ renderGalleryCats(); renderThumbs(); }
  if (!$('mine').classList.contains('hidden')) renderGallery();
}
function initLang(){
  $('langToggle').addEventListener('click', (e) => { e.stopPropagation(); $('langMenu').classList.toggle('hidden'); });
  $('langMenu').addEventListener('click', (e) => {
    const b = e.target.closest('[data-lang]'); if (!b) return;
    uiLang = b.dataset.lang;
    try { localStorage.setItem(UI_LANG_KEY, uiLang); } catch(err){}
    $('langMenu').classList.add('hidden');
    applyUiLang();
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.lang-wrap')) $('langMenu').classList.add('hidden'); });
}

/* ---------- تهيئة ---------- */
function init(){
  initAuthModal();
  initAuthMenu();
  initAccordion();
  initZoom();
  initTemplates();
  initMine();
  initLang();

  els.saveBtn.addEventListener('click', performSave);
  els.printBtn.addEventListener('click', doPrint);
  els.exportPdfBtn.addEventListener('click', doPdf);
  $('btnFullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) (document.documentElement.requestFullscreen || function(){}).call(document.documentElement);
    else if (document.exitFullscreen) document.exitFullscreen();
  });
  $('panelToggle').addEventListener('click', togglePanel);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape'){ closeGallery(); closeMine(); if (!$('authOverlay').classList.contains('hidden')) closeAuthModal(); }
  });

  // فتح آخر مذكرة، أو إنشاء مذكرة جديدة إن لم توجد
  let last = null;
  try { last = localStorage.getItem(LAST_PLAN_KEY); } catch(e){}
  const startId = (last && plansCache[last]) ? last : sortedPlanIds()[0];
  applyUiLang();
  if (startId) loadPlanIntoEditor(startId); else createNewPlan();

  if (window.fbAuth){
    window.fbAuth.onAuthStateChanged((fbUser) => {
      currentUser = fbUser ? {
        uid: fbUser.uid,
        name: fbUser.displayName || fbUser.email,
        email: fbUser.email,
        picture: fbUser.photoURL || null,
      } : null;
      renderAuthUI();
      if (currentUser){
        fetchRemotePlans();
        if (pendingSaveAfterLogin){
          pendingSaveAfterLogin = false;
          if (currentPlanId) performSave();
        }
      }
    });
  } else {
    renderAuthUI();
  }
}

init();
