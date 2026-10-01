// ============================================================
// app.js — CV Builder (ar / en / fr)
// ============================================================

(function () {
  "use strict";

  /* ================= i18n ================= */
  const I18N = {
    ar: {
      dir: 'rtl', pageTitleTag: 'منشئ السيرة الذاتية — أكاديمية مرابطي', topbarTitle: 'منشئ السيرة الذاتية',
      lockedTitle: 'أنشئ حسابك لتبدأ في بناء سيرتك الذاتية', lockedSub: 'سجّل دخولك أو أنشئ حساب مجاني للوصول لمنشئ السيرة الذاتية.',
      tabLogin: 'تسجيل الدخول', tabSignup: 'إنشاء حساب',
      namePh: 'الاسم الكامل', emailPh: 'البريد الإلكتروني', passwordPh: 'كلمة المرور',
      loginBtn: 'تسجيل الدخول', signupBtn: 'إنشاء حساب', forgotPw: 'نسيت كلمة المرور؟',
      or: 'أو', googleBtn: 'المتابعة عبر Google',
      resetSent: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك.',
      logout: 'خروج',
      dashTitle: 'سيري الذاتية', newCv: 'إنشاء سيرة جديدة',
      untitled: 'سيرة ذاتية بدون عنوان', lastUpdated: 'آخر تحديث',
      edit: 'تعديل', duplicate: 'نسخ', deleteCv: 'حذف', downloadPdf: 'تحميل PDF',
      deleteConfirm: 'هل تريد حذف هذه السيرة نهائيًا؟',
      dashEmpty: 'لا توجد سير ذاتية بعد. اضغط "إنشاء سيرة جديدة" للبدء.',
      personalInfo: 'المعلومات الشخصية',
      fullName: 'الاسم الكامل', professionalTitle: 'اللقب الوظيفي', phone: 'رقم الهاتف',
      email: 'البريد الإلكتروني', address: 'العنوان (اختياري)', linkedin: 'لينكدإن (اختياري)',
      website: 'الموقع الشخصي (اختياري)', passport: 'رقم جواز السفر (اختياري)',
      showPassport: 'إظهار رقم جواز السفر بالسيرة', removePhoto: 'إزالة الصورة',
      colorTitle: 'لون الشريط الجانبي',
      sectionsTitle: 'أقسام السيرة', chooseSection: 'اختر قسمًا',
      addSection: '+ إضافة قسم آخر', addExperience: '+ إضافة تجربة', addEducation: '+ إضافة تعليم',
      subtitlePh: 'عنوان فرعي (اختياري)', datePh: 'التاريخ / معلومة (اختياري)', contentPh: 'اكتب المحتوى هنا...',
      jobTitle: 'المسمى الوظيفي', company: 'الشركة', location: 'الموقع', startDate: 'تاريخ البداية',
      endDate: 'تاريخ النهاية', currentlyHere: 'أعمل هنا حاليًا', description: 'الوصف',
      degree: 'الدرجة / الشهادة', institution: 'المؤسسة التعليمية',
      skillPh: 'اكتب مهارة واضغط Enter', langNamePh: 'اللغة', langLevelPh: 'المستوى',
      addLanguage: '+ إضافة لغة',
      saving: 'جارِ الحفظ...', saved: 'تم الحفظ',
      saveCv: 'حفظ', clearCv: 'تفريغ', clearConfirm: 'سيتم حذف كل محتوى هذه السيرة نهائيًا. متأكد؟',
      savedLocal: 'محفوظ في جهازك', savedRemote: '✅ تم الحفظ', unsavedBadge: 'غير محفوظة',
      templateTitle: 'شكل السيرة الذاتية',
      templateNames: { navy: 'الاحترافي', classic: 'الكلاسيكي', gold: 'الذهبي', rose: 'الوردي' },
      fixedPaletteNote: 'هذا الشكل بألوان ثابتة',
      sectionTypes: {
        summary: 'ملخص مهني', experience: 'الخبرة المهنية', education: 'التعليم', skills: 'المهارات',
        certifications: 'الشهادات', achievements: 'الإنجازات', languages: 'اللغات', interests: 'الاهتمامات',
        projects: 'المشاريع', courses: 'الدورات التدريبية', publications: 'المنشورات',
        volunteer: 'العمل التطوعي', references: 'المراجع', other: 'أخرى',
      },
    },
    en: {
      dir: 'ltr', pageTitleTag: 'CV Builder — Merabti Academy', topbarTitle: 'CV Builder',
      lockedTitle: 'Create your account to start building your CV', lockedSub: 'Sign in or create a free account to access the CV builder.',
      tabLogin: 'Log In', tabSignup: 'Sign Up',
      namePh: 'Full name', emailPh: 'Email', passwordPh: 'Password',
      loginBtn: 'Log In', signupBtn: 'Sign Up', forgotPw: 'Forgot password?',
      or: 'or', googleBtn: 'Continue with Google',
      resetSent: 'A password reset link has been sent to your email.',
      logout: 'Log out',
      dashTitle: 'My CVs', newCv: 'Create New CV',
      untitled: 'Untitled CV', lastUpdated: 'Last updated',
      edit: 'Edit', duplicate: 'Duplicate', deleteCv: 'Delete', downloadPdf: 'Download PDF',
      deleteConfirm: 'Delete this CV permanently?',
      dashEmpty: 'No CVs yet. Click "Create New CV" to get started.',
      personalInfo: 'Personal Information',
      fullName: 'Full name', professionalTitle: 'Professional title', phone: 'Phone number',
      email: 'Email address', address: 'Address (optional)', linkedin: 'LinkedIn (optional)',
      website: 'Website / portfolio (optional)', passport: 'Passport number (optional)',
      showPassport: 'Show passport number on CV', removePhoto: 'Remove photo',
      colorTitle: 'Sidebar color',
      sectionsTitle: 'CV Sections', chooseSection: 'Choose section',
      addSection: '+ Add another section', addExperience: '+ Add experience', addEducation: '+ Add education',
      subtitlePh: 'Optional subtitle', datePh: 'Date / info (optional)', contentPh: 'Write content here...',
      jobTitle: 'Job title', company: 'Company', location: 'Location', startDate: 'Start date',
      endDate: 'End date', currentlyHere: 'Currently working here', description: 'Description',
      degree: 'Degree / Diploma', institution: 'Institution',
      skillPh: 'Type a skill and press Enter', langNamePh: 'Language', langLevelPh: 'Level',
      addLanguage: '+ Add language',
      saving: 'Saving...', saved: 'Saved',
      saveCv: 'Save', clearCv: 'Clear', clearConfirm: 'This will permanently erase all content in this CV. Continue?',
      savedLocal: 'Saved on this device', savedRemote: '✅ Saved', unsavedBadge: 'Unsaved',
      templateTitle: 'CV Template',
      templateNames: { navy: 'Professional', classic: 'Classic', gold: 'Gold', rose: 'Rose' },
      fixedPaletteNote: 'This template has fixed colors',
      sectionTypes: {
        summary: 'Professional Summary', experience: 'Professional Experience', education: 'Education', skills: 'Skills',
        certifications: 'Certifications', achievements: 'Achievements', languages: 'Languages', interests: 'Interests',
        projects: 'Projects', courses: 'Courses', publications: 'Publications',
        volunteer: 'Volunteer Experience', references: 'References', other: 'Other',
      },
    },
    fr: {
      dir: 'ltr', pageTitleTag: 'Créateur de CV — Académie Merabti', topbarTitle: 'Créateur de CV',
      lockedTitle: 'Créez votre compte pour commencer à créer votre CV', lockedSub: "Connectez-vous ou créez un compte gratuit pour accéder au créateur de CV.",
      tabLogin: 'Connexion', tabSignup: 'Inscription',
      namePh: 'Nom complet', emailPh: 'E-mail', passwordPh: 'Mot de passe',
      loginBtn: 'Connexion', signupBtn: "S'inscrire", forgotPw: 'Mot de passe oublié ?',
      or: 'ou', googleBtn: 'Continuer avec Google',
      resetSent: 'Un lien de réinitialisation a été envoyé à votre e-mail.',
      logout: 'Déconnexion',
      dashTitle: 'Mes CV', newCv: 'Créer un nouveau CV',
      untitled: 'CV sans titre', lastUpdated: 'Dernière mise à jour',
      edit: 'Modifier', duplicate: 'Dupliquer', deleteCv: 'Supprimer', downloadPdf: 'Télécharger en PDF',
      deleteConfirm: 'Supprimer ce CV définitivement ?',
      dashEmpty: 'Aucun CV pour le moment. Cliquez sur "Créer un nouveau CV" pour commencer.',
      personalInfo: 'Informations personnelles',
      fullName: 'Nom complet', professionalTitle: 'Titre professionnel', phone: 'Téléphone',
      email: 'E-mail', address: 'Adresse (optionnel)', linkedin: 'LinkedIn (optionnel)',
      website: 'Site web / portfolio (optionnel)', passport: 'Numéro de passeport (optionnel)',
      showPassport: 'Afficher le numéro de passeport sur le CV', removePhoto: 'Supprimer la photo',
      colorTitle: 'Couleur de la barre latérale',
      sectionsTitle: 'Sections du CV', chooseSection: 'Choisir une section',
      addSection: '+ Ajouter une autre section', addExperience: '+ Ajouter une expérience', addEducation: '+ Ajouter une formation',
      subtitlePh: 'Sous-titre (optionnel)', datePh: 'Date / info (optionnel)', contentPh: 'Écrivez le contenu ici...',
      jobTitle: 'Intitulé du poste', company: 'Entreprise', location: 'Lieu', startDate: 'Date de début',
      endDate: 'Date de fin', currentlyHere: "J'y travaille actuellement", description: 'Description',
      degree: 'Diplôme', institution: 'Établissement',
      skillPh: 'Tapez une compétence et appuyez sur Entrée', langNamePh: 'Langue', langLevelPh: 'Niveau',
      addLanguage: '+ Ajouter une langue',
      saving: 'Enregistrement...', saved: 'Enregistré',
      saveCv: 'Enregistrer', clearCv: 'Vider', clearConfirm: 'Tout le contenu de ce CV sera définitivement effacé. Continuer ?',
      savedLocal: 'Enregistré sur cet appareil', savedRemote: '✅ Enregistré', unsavedBadge: 'Non enregistré',
      templateTitle: 'Modèle de CV',
      templateNames: { navy: 'Professionnel', classic: 'Classique', gold: 'Doré', rose: 'Rose' },
      fixedPaletteNote: 'Ce modèle a des couleurs fixes',
      sectionTypes: {
        summary: 'Résumé professionnel', experience: 'Expérience professionnelle', education: 'Formation', skills: 'Compétences',
        certifications: 'Certifications', achievements: 'Réalisations', languages: 'Langues', interests: "Centres d'intérêt",
        projects: 'Projets', courses: 'Cours', publications: 'Publications',
        volunteer: 'Bénévolat', references: 'Références', other: 'Autre',
      },
    },
  };


  /* ================= Extra UI strings (redesigned interface) ================= */
  const I18N_X = {
    ar: {
      back_tools: 'العودة إلى الأدوات', fullscreen: 'ملء الشاشة', mine: 'سيري الذاتية', save: 'حفظ في حسابي',
      print: 'طباعة', pdf: 'تحميل PDF', toggle_panel: 'إظهار / إخفاء حيّز الملء', fit: 'ملاءمة الشاشة',
      gallery: 'معرض القوالب', search: 'ابحث عن قالب...', no_results: 'لا توجد قوالب مطابقة',
      cats: { all: 'الكل', professional: 'احترافي', modern: 'عصري', minimal: 'بسيط', creative: 'إبداعي', academic: 'أكاديمي', ats: 'ATS' },
      sec_style: 'التنسيق والقالب', sec_personal: 'المعلومات الشخصية والصورة',
      f_template: 'القالب', f_color: 'اللون الرئيسي', f_font: 'الخط', font_auto: 'خط القالب', f_fontsize: 'حجم الخط',
      f_reset: 'إرجاع إلى 100%', f_cvtitle: 'اسم السيرة (للحفظ)', all_templates: 'عرض كل القوالب',
      photo: 'الصورة الشخصية', upload_photo: 'رفع صورة', change_photo: 'تغيير الصورة', photo_hint: 'صورة واضحة بخلفية هادئة',
      next: 'التالي', done: 'تم', add_section: 'إضافة قسم', section_type: 'نوع القسم',
      move_up: 'تحريك للأعلى', move_down: 'تحريك للأسفل', remove: 'حذف', add_btn: 'إضافة',
      entries_n: 'عناصر', empty_sec: 'فارغ — اضغط للتعبئة', d_personal: 'الاسم واللقب ووسائل التواصل والصورة',
      del_section_confirm: 'حذف هذا القسم بكل محتواه؟', present: 'حتى الآن', contact_info: 'وسائل التواصل',
      login_title: 'سجّل دخولك لحفظ سيرك الذاتية', login_text: 'تُحفظ سيرتك تلقائيًا في هذا الجهاز. بتسجيل الدخول تُحفظ في حسابك وتصل إليها من أي جهاز.',
      cancel: 'إلغاء', confirm_yes: 'تأكيد', sign_in: 'تسجيل الدخول',
      mine_login_hint: 'المعروض هنا محفوظ في هذا الجهاز فقط. سجّل دخولك لرؤية السير المحفوظة في حسابك.',
      cloud_badge: 'في حسابي', local_badge: 'على الجهاز فقط', open: 'فتح', current_badge: 'المفتوحة الآن',
      t_saved_cloud: '✅ تم الحفظ في حسابك', t_cloud_err: 'تعذّر الحفظ في الحساب، حاول مرة أخرى',
      t_print: 'جارِ تجهيز الطباعة...', t_pdf: 'جارِ إنشاء PDF...', t_cleared: 'تم تفريغ السيرة', t_no_fb: 'خدمة الحساب غير متاحة حاليًا',
      pages_n: 'عدد الصفحات', loading: 'جارِ التحميل...', untitled_sec: 'قسم',
    },
    en: {
      back_tools: 'Back to tools', fullscreen: 'Full screen', mine: 'My CVs', save: 'Save to my account',
      print: 'Print', pdf: 'Download PDF', toggle_panel: 'Show / hide the form', fit: 'Fit to screen',
      gallery: 'Template gallery', search: 'Search templates...', no_results: 'No matching templates',
      cats: { all: 'All', professional: 'Professional', modern: 'Modern', minimal: 'Minimal', creative: 'Creative', academic: 'Academic', ats: 'ATS' },
      sec_style: 'Layout & template', sec_personal: 'Personal info & photo',
      f_template: 'Template', f_color: 'Main colour', f_font: 'Font', font_auto: 'Template font', f_fontsize: 'Text size',
      f_reset: 'Reset to 100%', f_cvtitle: 'CV name (for saving)', all_templates: 'Show all templates',
      photo: 'Profile photo', upload_photo: 'Upload photo', change_photo: 'Change photo', photo_hint: 'A clear photo with a calm background',
      next: 'Next', done: 'Done', add_section: 'Add section', section_type: 'Section type',
      move_up: 'Move up', move_down: 'Move down', remove: 'Delete', add_btn: 'Add',
      entries_n: 'items', empty_sec: 'Empty — click to fill', d_personal: 'Name, title, contact details and photo',
      del_section_confirm: 'Delete this section and all its content?', present: 'Present', contact_info: 'Contact details',
      login_title: 'Sign in to save your CVs', login_text: 'Your CV is saved automatically on this device. Sign in to keep it in your account and open it anywhere.',
      cancel: 'Cancel', confirm_yes: 'Confirm', sign_in: 'Sign in',
      mine_login_hint: 'These CVs are stored on this device only. Sign in to see the CVs saved in your account.',
      cloud_badge: 'In my account', local_badge: 'This device only', open: 'Open', current_badge: 'Open now',
      t_saved_cloud: '✅ Saved to your account', t_cloud_err: 'Could not save to your account, please try again',
      t_print: 'Preparing print...', t_pdf: 'Creating PDF...', t_cleared: 'CV cleared', t_no_fb: 'Account service is unavailable right now',
      pages_n: 'Pages', loading: 'Loading...', untitled_sec: 'Section',
    },
    fr: {
      back_tools: 'Retour aux outils', fullscreen: 'Plein écran', mine: 'Mes CV', save: 'Enregistrer dans mon compte',
      print: 'Imprimer', pdf: 'Télécharger en PDF', toggle_panel: 'Afficher / masquer le formulaire', fit: "Ajuster à l'écran",
      gallery: 'Galerie de modèles', search: 'Rechercher un modèle...', no_results: 'Aucun modèle correspondant',
      cats: { all: 'Tous', professional: 'Professionnel', modern: 'Moderne', minimal: 'Épuré', creative: 'Créatif', academic: 'Académique', ats: 'ATS' },
      sec_style: 'Mise en forme & modèle', sec_personal: 'Informations personnelles & photo',
      f_template: 'Modèle', f_color: 'Couleur principale', f_font: 'Police', font_auto: 'Police du modèle', f_fontsize: 'Taille du texte',
      f_reset: 'Revenir à 100 %', f_cvtitle: 'Nom du CV (pour l’enregistrement)', all_templates: 'Voir tous les modèles',
      photo: 'Photo de profil', upload_photo: 'Ajouter une photo', change_photo: 'Changer la photo', photo_hint: 'Une photo nette sur fond neutre',
      next: 'Suivant', done: 'Terminé', add_section: 'Ajouter une section', section_type: 'Type de section',
      move_up: 'Monter', move_down: 'Descendre', remove: 'Supprimer', add_btn: 'Ajouter',
      entries_n: 'éléments', empty_sec: 'Vide — cliquez pour remplir', d_personal: 'Nom, titre, coordonnées et photo',
      del_section_confirm: 'Supprimer cette section et tout son contenu ?', present: "Aujourd'hui", contact_info: 'Coordonnées',
      login_title: 'Connectez-vous pour enregistrer vos CV', login_text: 'Votre CV est enregistré automatiquement sur cet appareil. Connectez-vous pour le garder dans votre compte et l’ouvrir partout.',
      cancel: 'Annuler', confirm_yes: 'Confirmer', sign_in: 'Se connecter',
      mine_login_hint: 'Ces CV sont stockés sur cet appareil uniquement. Connectez-vous pour voir les CV de votre compte.',
      cloud_badge: 'Dans mon compte', local_badge: 'Cet appareil uniquement', open: 'Ouvrir', current_badge: 'Ouvert',
      t_saved_cloud: '✅ Enregistré dans votre compte', t_cloud_err: "Impossible d'enregistrer dans votre compte, réessayez",
      t_print: "Préparation de l'impression...", t_pdf: 'Création du PDF...', t_cleared: 'CV vidé', t_no_fb: 'Le service de compte est indisponible',
      pages_n: 'Pages', loading: 'Chargement...', untitled_sec: 'Section',
    },
  };
  const TEMPLATE_NAMES_X = {
    ar: { onyx: 'الأونيكس الداكن', geo: 'هندسي عصري', hairline: 'الخط الرفيع', executive: 'التنفيذي الفاخر', tech: 'الهندسي التقني', academic: 'الأكاديمي', creative: 'الإبداعي الملوّن', timeline: 'الخط الزمني', banner: 'الترويسة العريضة', ats: 'متوافق مع ATS' },
    en: { onyx: 'Onyx Sidebar', geo: 'Geometric', hairline: 'Hairline', executive: 'Executive', tech: 'Engineer', academic: 'Academic', creative: 'Creative', timeline: 'Timeline', banner: 'Banner', ats: 'ATS Friendly' },
    fr: { onyx: 'Onyx', geo: 'Géométrique', hairline: 'Trait fin', executive: 'Exécutif', tech: 'Ingénieur', academic: 'Académique', creative: 'Créatif', timeline: 'Chronologie', banner: 'Bandeau', ats: 'Compatible ATS' },
  };
  Object.keys(I18N_X).forEach((l) => {
    Object.keys(I18N_X[l]).forEach((k) => { if (!(k in I18N[l])) I18N[l][k] = I18N_X[l][k]; });
    Object.assign(I18N[l].templateNames, TEMPLATE_NAMES_X[l]);
  });
  let lang = localStorage.getItem('cvbuilder:lang') || 'ar';
  const t = (key) => I18N[lang][key];

  const STRUCTURED_TYPES = { experience: 'experience', education: 'education', skills: 'skills', languages: 'languages' };
  const SECTION_TYPE_ORDER = ['summary', 'experience', 'education', 'skills', 'certifications', 'achievements', 'languages', 'interests', 'projects', 'courses', 'publications', 'volunteer', 'references', 'other'];

  const SIDEBAR_COLORS = ['#22415A', '#0D1B2A', '#374151', '#1B4332', '#4A235A', '#6B1E2F', '#111111'];

const SAMPLE_PHOTO = 'data:image/jpeg;base64,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';
  const TEMPLATES = ['navy', 'classic', 'gold', 'rose'];
  const FIXED_PALETTE_TEMPLATES = ['gold', 'rose'];
  const SECTION_ICONS = {
    summary: '📝', experience: '💼', education: '🎓', skills: '🛠️',
    certifications: '📜', achievements: '🏆', languages: '🌐', interests: '❤️',
    projects: '📁', courses: '📚', publications: '📰', volunteer: '🤝',
    references: '✉️', other: '📌',
  };

  const SAMPLE_DATA = {
    ar: {
      fullName: 'Soufiane Merabti', title: 'دكتوراه في هندسة الطاقة الصناعية',
      phone: '0663708148', email: 'contact@merabti.com', address: 'الجزائر',
      summary: 'دكتور في هندسة الطاقة الصناعية، متخصص في أنظمة إدارة الجودة والسلامة والبيئة والطاقة وفق المعايير الدولية (ISO)، بخبرة في الإشراف الميداني وتدريب الفرق التقنية.',
      exp1Title: 'مهندس أول — أنظمة الجودة والسلامة', exp1Company: 'اسم الشركة', exp1Desc: 'الإشراف على تطبيق أنظمة إدارة الجودة والسلامة والبيئة والطاقة وفق معايير ISO، وقيادة عمليات التدقيق الداخلي.',
      exp2Title: 'مهندس طاقة صناعية', exp2Company: 'اسم الشركة', exp2Desc: 'تحليل كفاءة استهلاك الطاقة في المنشآت الصناعية واقتراح حلول التحسين المطابقة لمعيار ISO 50001.',
      eduDegree: 'دكتوراه في هندسة الطاقة الصناعية', eduInst: 'اسم الجامعة',
      skills: ['ISO 9001', 'ISO 14001', 'ISO 45001', 'ISO 50001'],
      languages: [['العربية', 'اللغة الأم'], ['الفرنسية', 'جيد جدًا'], ['الإنجليزية', 'جيد']],
    },
    en: {
      fullName: 'Soufiane Merabti', title: 'PhD, Industrial Energy Engineering',
      phone: '0663708148', email: 'contact@merabti.com', address: 'Algeria',
      summary: 'PhD holder in Industrial Energy Engineering, specialized in Quality, Safety, Environment and Energy management systems (ISO standards), with field supervision and technical team training experience.',
      exp1Title: 'Senior Engineer — Quality & Safety Systems', exp1Company: 'Company name', exp1Desc: 'Oversaw the implementation of Quality, Safety, Environmental and Energy management systems per ISO standards, and led internal audits.',
      exp2Title: 'Industrial Energy Engineer', exp2Company: 'Company name', exp2Desc: 'Analyzed energy consumption efficiency across industrial facilities and proposed ISO 50001-compliant improvements.',
      eduDegree: 'PhD in Industrial Energy Engineering', eduInst: 'University name',
      skills: ['ISO 9001', 'ISO 14001', 'ISO 45001', 'ISO 50001'],
      languages: [['Arabic', 'Native'], ['French', 'Very good'], ['English', 'Good']],
    },
    fr: {
      fullName: 'Soufiane Merabti', title: 'Doctorat en Génie Énergétique Industriel',
      phone: '0663708148', email: 'contact@merabti.com', address: 'Algérie',
      summary: "Docteur en génie énergétique industriel, spécialisé dans les systèmes de management Qualité, Sécurité, Environnement et Énergie (normes ISO), avec une expérience en supervision de terrain et formation d'équipes techniques.",
      exp1Title: 'Ingénieur senior — Systèmes Qualité & Sécurité', exp1Company: "Nom de l'entreprise", exp1Desc: "Supervision de la mise en œuvre des systèmes de management Qualité, Sécurité, Environnement et Énergie selon les normes ISO, et pilotage des audits internes.",
      exp2Title: 'Ingénieur en énergie industrielle', exp2Company: "Nom de l'entreprise", exp2Desc: "Analyse de l'efficacité énergétique des installations industrielles et proposition d'améliorations conformes à l'ISO 50001.",
      eduDegree: 'Doctorat en génie énergétique industriel', eduInst: "Nom de l'université",
      skills: ['ISO 9001', 'ISO 14001', 'ISO 45001', 'ISO 50001'],
      languages: [['Arabe', 'Langue maternelle'], ['Français', 'Très bien'], ['Anglais', 'Bien']],
    },
  };

  function sampleCvData(currentLang) {
    const s = SAMPLE_DATA[currentLang] || SAMPLE_DATA.ar;
    return {
      title: t('untitled'),
      template: 'navy',
      sidebarColor: SIDEBAR_COLORS[0],
      updatedAt: Date.now(),
      isSample: true,
      personal: {
        fullName: s.fullName, title: s.title, phone: s.phone, email: s.email, address: s.address,
        linkedin: '', website: '', passport: '', showPassport: false, photo: SAMPLE_PHOTO,
      },
      sections: [
        { id: uid(), type: 'summary', subtitle: '', dateInfo: '', content: s.summary },
        { id: uid(), type: 'experience', entries: [
          { title: s.exp1Title, company: s.exp1Company, location: s.address, start: '2019-01', end: '', current: true, description: s.exp1Desc },
          { title: s.exp2Title, company: s.exp2Company, location: s.address, start: '2017-03', end: '2019-01', current: false, description: s.exp2Desc },
        ] },
        { id: uid(), type: 'education', entries: [
          { degree: s.eduDegree, institution: s.eduInst, location: s.address, start: '2013-09', end: '2016-06', current: false, description: '' },
        ] },
        { id: uid(), type: 'skills', entries: s.skills.slice() },
        { id: uid(), type: 'languages', entries: s.languages.map(([language, level]) => ({ language, level })) },
      ],
    };
  }


  /* ================= DOM refs ================= */
  const $ = (id) => document.getElementById(id);
  const qsa = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const els = {
    pageTitleTag: $('pageTitleTag'), topbarTitle: $('topbarTitle'),
    langToggle: $('langToggle'), langMenu: $('langMenu'),
    saveIndicator: $('saveIndicator'),
    workspace: $('workspace'), panel: $('panel'), accordion: $('accordion'), stage: $('stage'),
    pages: $('cvPages'), pagesHolder: $('pagesHolder'), pageCount: $('pageCount'), zoomVal: $('zoomVal'),
    currentThumb: $('currentThumb'), currentTplName: $('currentTplName'),
    addSectionBtn: $('addSectionBtn'), addSectionText: $('addSectionText'), addSecMenu: $('addSecMenu'),
    saveCvBtn: $('saveCvBtn'), downloadPdfBtn: $('downloadPdfBtn'), downloadPdfText: $('downloadPdfText'),
    gallery: $('gallery'), gSearch: $('gSearch'), gCats: $('gCats'), gGrid: $('gGrid'),
    mine: $('mine'), cvGrid: $('cvGrid'), mineLogin: $('mineLogin'), dashTitle: $('dashTitle'),
    userChip: $('userChip'), userChipName: $('userChipName'), logoutBtn: $('logoutBtn'),
    login: $('login'), lockedTitle: $('lockedTitle'), lockedSub: $('lockedSub'),
    tabLogin: $('tabLogin'), tabSignup: $('tabSignup'),
    authCardForm: $('authCardForm'), authCardError: $('authCardError'),
    acName: $('acName'), acEmail: $('acEmail'), acPassword: $('acPassword'), acSubmitBtn: $('acSubmitBtn'),
    forgotPwBtn: $('forgotPwBtn'), orDivider: $('orDivider'), acGoogleBtn: $('acGoogleBtn'), acGoogleText: $('acGoogleText'),
    confirmOverlay: $('confirmOverlay'), confirmMessage: $('confirmMessage'),
    printRoot: $('printRoot'), measure: $('measure'), toast: $('toast'),
  };

  /* ================= State ================= */
  let currentUser = null;
  let cvList = [];
  let activeCv = null; // full CV object being edited
  let activeCvId = null;
  let saveTimeout = null;

  /* ================= Local drafts (unsaved-to-account CVs) ================= */
  const LOCAL_DRAFTS_KEY = 'cvbuilder:localDrafts';
  const LAST_OPEN_KEY = 'cvbuilder:lastOpen';
  function loadLocalDrafts() { try { return JSON.parse(localStorage.getItem(LOCAL_DRAFTS_KEY)) || []; } catch (e) { return []; } }
  function saveLocalDraftsList(list) { try { localStorage.setItem(LOCAL_DRAFTS_KEY, JSON.stringify(list)); } catch (e) { /* storage full */ } }
  function upsertLocalDraft(rec) {
    const list = loadLocalDrafts();
    const i = list.findIndex((d) => d.localId === rec.localId);
    if (i >= 0) list[i] = rec; else list.unshift(rec);
    saveLocalDraftsList(list);
  }
  function deleteLocalDraft(localId) { saveLocalDraftsList(loadLocalDrafts().filter((d) => d.localId !== localId)); }
  function rememberOpen() { try { localStorage.setItem(LAST_OPEN_KEY, activeCvId || ''); } catch (e) { /* ignore */ } }

  function newCvData(title) {
    return {
      title: title || t('untitled'),
      template: 'navy',
      sidebarColor: SIDEBAR_COLORS[0],
      updatedAt: Date.now(),
      personal: {
        fullName: '', title: '', phone: '', email: '', address: '', linkedin: '', website: '',
        passport: '', showPassport: false, photo: null,
      },
      sections: [],
    };
  }

  function uid() { return 's' + Math.random().toString(36).slice(2, 10); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function formatMonthYear(val) {
    if (!val) return '';
    const [y, m] = val.split('-');
    if (!y || !m) return val;
    const d = new Date(Number(y), Number(m) - 1, 1);
    const locale = lang === 'ar' ? 'ar' : lang === 'fr' ? 'fr-FR' : 'en-US';
    return d.toLocaleDateString(locale, { month: 'short', year: 'numeric' });
  }
  function formatDate(ts) {
    if (!ts) return '—';
    const d = new Date(ts);
    return d.toLocaleDateString(lang === 'ar' ? 'ar' : lang === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  function cut(x, n) { x = String(x || '').replace(/\s+/g, ' ').trim(); n = n || 60; return x.length > n ? x.slice(0, n - 1) + '…' : x; }

  /* ================= Templates ================= */
  // Existing four (navy, classic, gold, rose) keep their original design; ten new ones follow.
  const TPL = {
    navy:      { cat: 'professional', legacy: true, color: SIDEBAR_COLORS[0] },
    classic:   { cat: 'professional', legacy: true, color: SIDEBAR_COLORS[0] },
    gold:      { cat: 'professional', legacy: true, fixed: true, color: '#C9A24B' },
    rose:      { cat: 'creative', legacy: true, fixed: true, color: '#C27D74' },
    onyx:      { cat: 'professional', color: '#E0A33A', ar: 'Cairo', lat: 'Poppins', side: true },
    geo:       { cat: 'modern', color: '#0E7C86', ar: 'Tajawal', lat: 'Poppins', side: true },
    hairline:  { cat: 'minimal', color: '#8C6A4F', ar: 'Almarai', lat: 'Lato', optPhoto: true },
    executive: { cat: 'professional', color: '#B08D57', ar: 'Tajawal', lat: 'Lato', side: true },
    tech:      { cat: 'modern', color: '#2563EB', ar: 'IBM Plex Sans Arabic', lat: 'Inter', side: true },
    academic:  { cat: 'academic', color: '#7A1F2B', ar: 'Amiri', lat: 'Lora', optPhoto: true },
    creative:  { cat: 'creative', color: '#F2545B', ar: 'Cairo', lat: 'Poppins', side: true },
    timeline:  { cat: 'modern', color: '#4F46E5', ar: 'Tajawal', lat: 'Inter', side: true },
    banner:    { cat: 'modern', color: '#1E5AA8', ar: 'Almarai', lat: 'Lato', side: true },
    ats:       { cat: 'ats', color: '#1F2937', ar: 'Tajawal', lat: 'Inter', optPhoto: true },
  };
  const TPL_IDS = Object.keys(TPL);
  const CATS = ['all', 'professional', 'modern', 'minimal', 'creative', 'academic', 'ats'];
  const FONTS = [
    { id: 'Tajawal', ar: true }, { id: 'Cairo', ar: true }, { id: 'Almarai', ar: true }, { id: 'IBM Plex Sans Arabic', ar: true },
    { id: 'Amiri', ar: true }, { id: 'El Messiri', ar: true }, { id: 'Inter' }, { id: 'Poppins' }, { id: 'Lato' },
    { id: 'Merriweather' }, { id: 'Playfair Display' }, { id: 'Lora' },
  ];
  const FS_MIN = 0.8, FS_MAX = 1.3, FS_STEP = 0.05;
  const SIDEBAR_SECTION_TYPES = ['skills', 'languages', 'interests', 'certifications'];
  const PALETTE_SWATCHES = ['#22415A', '#0D1B2A', '#374151', '#1B4332', '#4A235A', '#6B1E2F', '#111111', '#2563EB', '#0E7C86', '#4F46E5', '#B08D57', '#E0A33A', '#F2545B', '#7A1F2B'];
  const SEC_COLORS = {
    style: '#475569', personal: '#0F766E',
    summary: '#0891B2', experience: '#D97706', education: '#7C3AED', skills: '#16A34A', certifications: '#DB2777',
    achievements: '#EA580C', languages: '#2563EB', interests: '#E11D48', projects: '#0D9488', courses: '#9333EA',
    publications: '#4F46E5', volunteer: '#65A30D', references: '#64748B', other: '#78716C',
  };
  const secColor = (key) => SEC_COLORS[key] || '#64748B';

  /* ---- colours (literal hex everywhere so html2canvas / PDF render them) ---- */
  function hexToRgb(hex) {
    let h = String(hex || '#22415A').replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const n = parseInt(h, 16) || 0;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgbToHex(r, g, b) { return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join(''); }
  function mix(hex, other, w) { const a = hexToRgb(hex), b = hexToRgb(other); return rgbToHex(a[0] + (b[0] - a[0]) * w, a[1] + (b[1] - a[1]) * w, a[2] + (b[2] - a[2]) * w); }
  function lum(hex) { const [r, g, b] = hexToRgb(hex).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
  function hueShift(hex, deg) {
    let [r, g, b] = hexToRgb(hex).map((v) => v / 255);
    const max = Math.max(r, g, b), min = Math.min(r, g, b); let h = 0, s = 0; const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6;
    }
    h = (h + deg / 360) % 1; if (h < 0) h += 1;
    const s2 = Math.max(0.45, s), l2 = Math.min(0.55, Math.max(0.42, l));
    const q = l2 < 0.5 ? l2 * (1 + s2) : l2 + s2 - l2 * s2, p = 2 * l2 - q;
    const f = (t2) => { if (t2 < 0) t2 += 1; if (t2 > 1) t2 -= 1; if (t2 < 1 / 6) return p + (q - p) * 6 * t2; if (t2 < 1 / 2) return q; if (t2 < 2 / 3) return p + (q - p) * (2 / 3 - t2) * 6; return p; };
    return rgbToHex(f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255);
  }
  function palette(ac) {
    return { ac, d: mix(ac, '#000000', 0.35), s: mix(ac, '#ffffff', 0.88), l: mix(ac, '#ffffff', 0.55), on: lum(ac) > 0.45 ? '#1F2A37' : '#ffffff' };
  }

  /* ---- SVG icons (inline, literal colours) ---- */
  const ICON_PATHS = {
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    address: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>',
    website: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    passport: '<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M9 16h6"/>',
    summary: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    experience: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
    education: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    skills: '<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/>',
    certifications: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14 7 22l5-3 5 3-1.5-8"/>',
    achievements: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4a3 3 0 0 0 4 4M16 6h4a3 3 0 0 1-4 4M12 13v4M8 21h8M10 17h4"/>',
    languages: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
    interests: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    projects: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    courses: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 1 2-2h13"/>',
    publications: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 12h7M9 16h7"/>',
    volunteer: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/><path d="M9 11h6M12 8v6"/>',
    references: '<path d="M7 7h4v4c0 3-2 5-4 6M14 7h4v4c0 3-2 5-4 6"/>',
    other: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>',
  };
  function ico(name, color, size) {
    const s = size || 16;
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><g fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[name] || ICON_PATHS.other}</g></svg>`;
  }

  /* ---- render context ---- */
  function tplOf(cv) { return TPL[cv.template] ? cv.template : 'navy'; }
  function fontStack(cv, id, dir) {
    const def = TPL[id];
    const arDef = def.legacy ? 'Tajawal' : def.ar;
    if (cv.fontFamily) return dir === 'rtl' ? `'${cv.fontFamily}', '${arDef}', 'Tajawal', sans-serif` : `'${cv.fontFamily}', 'Inter', 'Tajawal', sans-serif`;
    if (def.legacy) return dir === 'rtl' ? "'Tajawal', sans-serif" : "'Inter', sans-serif";
    return dir === 'rtl' ? `'${def.ar}', 'Tajawal', sans-serif` : `'${def.lat}', '${def.ar}', 'Tajawal', sans-serif`;
  }
  function contactItems(p) {
    const out = [];
    if (p.phone) out.push({ k: 'phone', v: p.phone, ltr: true });
    if (p.email) out.push({ k: 'email', v: p.email, ltr: true });
    if (p.address) out.push({ k: 'address', v: p.address, ltr: false });
    if (p.linkedin) out.push({ k: 'linkedin', v: p.linkedin, ltr: true });
    if (p.website) out.push({ k: 'website', v: p.website, ltr: true });
    if (p.showPassport && p.passport) out.push({ k: 'passport', v: p.passport, ltr: true });
    return out;
  }
  function buildCtx(cv, id) {
    const def = TPL[id];
    const dir = I18N[lang].dir;
    const ac = def.fixed ? def.color : (cv.sidebarColor || def.color);
    const pal = palette(ac);
    const p = cv.personal || {};
    return {
      cv, id, def, dir, rtl: dir === 'rtl', p, pal,
      fs: Math.min(FS_MAX, Math.max(FS_MIN, Number(cv.fontScale) || 1)),
      font: fontStack(cv, id, dir),
      head: cv.fontFamily ? fontStack(cv, id, dir) : null,
      c1: ac, c2: hueShift(ac, 150), c3: hueShift(ac, 215),
      contacts: contactItems(p),
      name: escapeHtml(p.fullName || '—'),
      role: escapeHtml(p.title || ''),
      initial: escapeHtml((p.fullName || '').trim().slice(0, 1).toUpperCase()),
    };
  }
  function photoHtml(ctx, cls) {
    const ph = ctx.p.photo;
    if (ph) return `<div class="ph ${cls || ''}" data-sec="personal" style="background-image:url('${ph}')"></div>`;
    if (ctx.def.optPhoto) return '';
    return `<div class="ph ${cls || ''}" data-sec="personal">${ctx.initial}</div>`;
  }
  function contactsHtml(ctx, iconColor, size) {
    return ctx.contacts.map((c) => `<div class="ct">${iconColor ? `<span class="ct-i">${ico(c.k, iconColor, size || 14)}</span>` : ''}<bdi ${c.ltr ? 'dir="ltr"' : ''}>${escapeHtml(c.v)}</bdi></div>`).join('');
  }
  const nameHtml = (ctx) => `<div class="nm">${ctx.name}</div>`;
  const roleHtml = (ctx) => (ctx.role ? `<div class="rl">${ctx.role}</div>` : '');
  const flow = (f, extra) => `<div class="flow ${extra || ''}" data-flow="${f}"></div>`;

  /* ---- decorations (SVG, literal colours, mirrored for RTL) ---- */
  function svgWrap(w, h, inner, style) { return `<svg class="deco" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="${style}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`; }
  function poly(ctx, W, pts, fill, op) {
    const p = pts.map(([x, y]) => `${ctx.rtl ? W - x : x},${y}`).join(' ');
    return `<polygon points="${p}" fill="${fill}"${op ? ` fill-opacity="${op}"` : ''}/>`;
  }
  function decoGeo(ctx, first) {
    const W = 794, { pal } = ctx;
    let s = '';
    if (first) {
      s += poly(ctx, W, [[560, 0], [794, 0], [794, 210]], pal.ac);
      s += poly(ctx, W, [[650, 0], [794, 0], [794, 120]], pal.d);
      s += poly(ctx, W, [[470, 0], [600, 0], [530, 90]], pal.l);
      s += poly(ctx, W, [[720, 150], [794, 110], [794, 250]], pal.s);
      s += poly(ctx, W, [[0, 0], [90, 0], [0, 70]], pal.s);
    } else {
      s += poly(ctx, W, [[700, 0], [794, 0], [794, 80]], pal.ac);
      s += poly(ctx, W, [[640, 0], [720, 0], [690, 40]], pal.l);
    }
    s += poly(ctx, W, [[0, 1123], [0, 1033], [110, 1123]], pal.ac);
    s += poly(ctx, W, [[0, 1123], [0, 1073], [190, 1123]], pal.l, 0.6);
    return svgWrap(W, 1123, s, 'left:0;top:0;');
  }
  function decoExecutive(ctx) {
    const c = ctx.pal.ac;
    const corner = (x, y, sx, sy) => `<path d="M${x} ${y + sy * 46}V${y}H${x + sx * 46}" fill="none" stroke="${c}" stroke-width="1.5"/><path d="M${x + sx * 7} ${y + sy * 30}V${y + sy * 7}H${x + sx * 30}" fill="none" stroke="${c}" stroke-width="1"/>`;
    const s = `<rect x="12" y="12" width="770" height="1099" fill="none" stroke="${c}" stroke-width="0.8" stroke-opacity="0.55"/>` +
      corner(22, 22, 1, 1) + corner(772, 22, -1, 1) + corner(22, 1101, 1, -1) + corner(772, 1101, -1, -1);
    return svgWrap(794, 1123, s, 'left:0;top:0;');
  }
  function decoTech(ctx) {
    const c = ctx.pal.ac, g = '#94A3B8';
    const mark = (x, y) => `<path d="M${x - 9} ${y}H${x + 9}M${x} ${y - 9}V${y + 9}" stroke="${g}" stroke-width="1"/><circle cx="${x}" cy="${y}" r="3.5" fill="none" stroke="${c}" stroke-width="1.2"/>`;
    let ticks = '';
    for (let i = 0; i <= 794; i += 20) ticks += `<path d="M${i} 0V${i % 100 === 0 ? 9 : 5}" stroke="${g}" stroke-width="0.8"/>`;
    return svgWrap(794, 1123, ticks + mark(22, 22) + mark(772, 22) + mark(22, 1101) + mark(772, 1101), 'left:0;top:0;');
  }
  function decoCreative(ctx, first) {
    const W = 794, x = (v) => (ctx.rtl ? W - v : v);
    const { c1, c2, c3 } = ctx;
    let s = `<circle cx="${x(40)}" cy="40" r="120" fill="${mix(c1, '#ffffff', 0.78)}"/>` +
      `<circle cx="${x(250)}" cy="-30" r="70" fill="${mix(c2, '#ffffff', 0.8)}"/>` +
      `<circle cx="${x(30)}" cy="1120" r="120" fill="${mix(c3, '#ffffff', 0.8)}"/>` +
      `<circle cx="${x(200)}" cy="1150" r="62" fill="${mix(c1, '#ffffff', 0.82)}"/>` +
      (first ? `<circle cx="${x(780)}" cy="70" r="36" fill="${mix(c2, '#ffffff', 0.7)}"/>` : '');
    if (first) for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) s += `<circle cx="${x(660 + i * 14)}" cy="${150 + j * 14}" r="2.4" fill="${mix(c3, '#ffffff', 0.35)}"/>`;
    return svgWrap(W, 1123, s, 'left:0;top:0;z-index:0;');
  }
  function decoBanner(ctx) {
    const { pal } = ctx;
    const s = `<path d="M0 50 C 200 0, 360 70, 540 30 S 760 10, 794 22 V 64 H 0 Z" fill="${pal.l}" fill-opacity="0.55"/>` +
      `<path d="M0 64 C 210 18, 380 78, 560 44 S 770 30, 794 40 V 64 H 0 Z" fill="#ffffff"/>`;
    return svgWrap(794, 64, s, 'left:0;bottom:-1px;');
  }
  function decoOnyx(ctx) {
    const W = 794, x = (v) => (ctx.rtl ? W - v : v);
    let s = '';
    for (let i = 0; i < 6; i++) for (let j = 0; j < 5; j++) s += `<circle cx="${x(700 + i * 14)}" cy="${30 + j * 14}" r="2.2" fill="#D9DEE6"/>`;
    s += `<rect x="${ctx.rtl ? W - 278 : 0}" y="0" width="278" height="8" fill="${ctx.pal.ac}"/>`;
    return svgWrap(W, 1123, s, 'left:0;top:0;');
  }
  function decoTimeline(ctx) {
    const W = 794, x = (v) => (ctx.rtl ? W - v : v);
    const s = `<circle cx="${x(794)}" cy="0" r="150" fill="${ctx.pal.s}"/><circle cx="${x(794)}" cy="0" r="92" fill="none" stroke="${ctx.pal.l}" stroke-width="2"/>`;
    return svgWrap(W, 220, s, 'left:0;top:0;');
  }

  /* ---- page skeletons (one function per template; `first` = page 1) ---- */
  const PAGES = {
    legacy(ctx, first) {
      const p = ctx.p;
      const photo = p.photo
        ? `<div class="cv-photo-wrap" data-sec="personal"><div class="cv-photo ph" style="background-image:url('${p.photo}')"></div></div>`
        : `<div class="cv-photo-wrap" data-sec="personal"><div class="cv-photo-placeholder">${ctx.initial}</div></div>`;
      const contact = `<div class="cv-contact" data-sec="personal">${ctx.contacts.map((l) => `<div><bdi ${l.ltr ? 'dir="ltr"' : ''}>${escapeHtml(l.v)}</bdi></div>`).join('')}</div>`;
      return `<div class="cv-page legacy template-${ctx.id}">
        <div class="cv-sidebar pg-col">${first ? photo + contact : ''}${flow('side', 'cv-sidebar-sections')}</div>
        <div class="cv-main pg-col">${first ? `<div class="cv-header-block" data-sec="personal"><h1 class="cv-name">${ctx.name}</h1><p class="cv-role">${ctx.role}</p></div>` : ''}${flow('main', 'cv-main-sections')}</div>
      </div>`;
    },
    onyx(ctx, first) {
      return `<div class="cv-page m tpl-onyx">${decoOnyx(ctx)}
        <div class="pg-col side">${first ? `${photoHtml(ctx)}<div class="contacts" data-sec="personal">${contactsHtml(ctx, '#ffffff', 14)}</div>` : ''}${flow('side')}</div>
        <div class="pg-col main">${first ? `<div class="head" data-sec="personal">${nameHtml(ctx)}${roleHtml(ctx)}<div class="bar"></div></div>` : ''}${flow('main')}</div>
      </div>`;
    },
    geo(ctx, first) {
      return `<div class="cv-page m tpl-geo">${decoGeo(ctx, first)}
        ${first ? `<div class="head" data-sec="personal">${photoHtml(ctx)}<div class="who">${nameHtml(ctx)}${roleHtml(ctx)}<div class="ctrow">${contactsHtml(ctx, ctx.pal.ac, 14)}</div></div></div>` : ''}
        <div class="pg-body"><div class="pg-col main">${flow('main')}</div><div class="pg-col side">${flow('side')}</div></div>
      </div>`;
    },
    hairline(ctx, first) {
      return `<div class="cv-page m tpl-hairline">
        ${first ? `<div class="head" data-sec="personal">${photoHtml(ctx)}${nameHtml(ctx)}${roleHtml(ctx)}<div class="ctrow">${contactsHtml(ctx, null)}</div></div>` : ''}
        <div class="pg-body col"><div class="pg-col main">${flow('main')}</div></div>
      </div>`;
    },
    executive(ctx, first) {
      return `<div class="cv-page m tpl-executive">
        ${first ? `<div class="head" data-sec="personal">${photoHtml(ctx)}<div class="who">${nameHtml(ctx)}${roleHtml(ctx)}</div></div>
        ${ctx.contacts.length ? `<div class="ctstrip" data-sec="personal">${contactsHtml(ctx, ctx.pal.d, 14)}</div>` : ''}` : ''}
        <div class="pg-body"><div class="pg-col main">${flow('main')}</div><div class="pg-col side">${flow('side')}</div></div>
        ${decoExecutive(ctx)}
      </div>`;
    },
    tech(ctx, first) {
      return `<div class="cv-page m tpl-tech">${decoTech(ctx)}
        ${first ? `<div class="head" data-sec="personal">${photoHtml(ctx)}<div class="who">${nameHtml(ctx)}${roleHtml(ctx)}<div class="ctgrid">${contactsHtml(ctx, ctx.pal.ac, 13)}</div></div></div>` : ''}
        <div class="pg-body"><div class="pg-col main">${flow('main')}</div><div class="pg-col side">${flow('side')}</div></div>
      </div>`;
    },
    academic(ctx, first) {
      return `<div class="cv-page m tpl-academic${ctx.p.photo ? ' has-ph' : ''}">
        ${first ? `<div class="head" data-sec="personal">${photoHtml(ctx)}<div class="who">${nameHtml(ctx)}${roleHtml(ctx)}<div class="ctrow">${contactsHtml(ctx, null)}</div></div></div>` : ''}
        <div class="pg-body col"><div class="pg-col main">${flow('main')}</div></div>
      </div>`;
    },
    creative(ctx, first) {
      return `<div class="cv-page m tpl-creative">${decoCreative(ctx, first)}
        <div class="pg-col side">${first ? `${photoHtml(ctx)}<div class="contacts" data-sec="personal">${contactsHtml(ctx, '#ffffff', 14)}</div>` : ''}${flow('side')}</div>
        <div class="pg-col main">${first ? `<div class="head" data-sec="personal">${nameHtml(ctx)}${roleHtml(ctx)}</div>` : ''}${flow('main')}</div>
      </div>`;
    },
    timeline(ctx, first) {
      return `<div class="cv-page m tpl-timeline">${decoTimeline(ctx)}
        ${first ? `<div class="head" data-sec="personal">${photoHtml(ctx)}<div class="who">${nameHtml(ctx)}${roleHtml(ctx)}<div class="ctrow">${contactsHtml(ctx, ctx.pal.ac, 14)}</div></div></div>` : ''}
        <div class="pg-body"><div class="pg-col main">${flow('main')}</div><div class="pg-col side">${flow('side')}</div></div>
      </div>`;
    },
    banner(ctx, first) {
      return `<div class="cv-page m tpl-banner">
        ${first ? `<div class="head" data-sec="personal"><div class="who">${nameHtml(ctx)}${roleHtml(ctx)}<div class="ctrow">${contactsHtml(ctx, ctx.pal.on, 14)}</div></div>${photoHtml(ctx)}${decoBanner(ctx)}</div>` : ''}
        <div class="pg-body"><div class="pg-col main">${flow('main')}</div><div class="pg-col side">${flow('side')}</div></div>
      </div>`;
    },
    ats(ctx, first) {
      const line = ctx.contacts.map((c) => `<bdi ${c.ltr ? 'dir="ltr"' : ''}>${escapeHtml(c.v)}</bdi>`).join('<span class="sep">|</span>');
      return `<div class="cv-page m tpl-ats">
        ${first ? `<div class="head" data-sec="personal"><div class="who">${nameHtml(ctx)}${roleHtml(ctx)}${line ? `<div class="ctline">${line}</div>` : ''}</div>${photoHtml(ctx)}</div>` : ''}
        <div class="pg-body col"><div class="pg-col main">${flow('main')}</div></div>
      </div>`;
    },
  };

  /* ---- content blocks: each section is split into pieces that can move to the next page ---- */
  function splitLines(txt) { return String(txt || '').split('\n'); }
  function datesText(e) {
    return [formatMonthYear(e.start), e.current ? t('present') : formatMonthYear(e.end)].filter(Boolean).join(' – ');
  }
  function sectionTitle(sec) { return t('sectionTypes')[sec.type] || t('untitled_sec'); }

  function legacyBlocks(ctx, sec) {
    const heading = `<span class="sec-icon">${SECTION_ICONS[sec.type] || ''}</span>${escapeHtml(sectionTitle(sec))}`;
    const ds = `data-sec="${sec.id}"`;
    if (SIDEBAR_SECTION_TYPES.includes(sec.type)) {
      let inner;
      if (sec.type === 'skills') inner = (sec.entries || []).map((s) => `<span class="cv-side-tag">${escapeHtml(s)}</span>`).join('');
      else if (sec.type === 'languages') inner = (sec.entries || []).map((e) => `<p>${escapeHtml(e.language || '')}${e.level ? ' — ' + escapeHtml(e.level) : ''}</p>`).join('');
      else inner = `<p style="white-space:pre-line">${escapeHtml(sec.content || '')}</p>`;
      return [{ flow: 'side', html: `<div class="cv-side-section blk" ${ds}><h4>${heading}</h4>${inner}</div>` }];
    }
    const pieces = [];
    const st = STRUCTURED_TYPES[sec.type];
    if (st === 'experience' || st === 'education') {
      const isExp = st === 'experience';
      (sec.entries || []).forEach((e) => {
        const titleLine = isExp ? [e.title, e.company].filter(Boolean).join(' — ') : [e.degree, e.institution].filter(Boolean).join(' — ');
        const metaLine = [e.location, [formatMonthYear(e.start), e.current ? (I18N[lang].currentlyHere) : formatMonthYear(e.end)].filter(Boolean).join(' - ')].filter(Boolean).join(' · ');
        pieces.push(`<div class="entry"><p class="entry-title">${escapeHtml(titleLine)}</p>${metaLine ? `<p class="entry-meta">${escapeHtml(metaLine)}</p>` : ''}${e.description ? `<p>${escapeHtml(e.description)}</p>` : ''}</div>`);
      });
    } else if (sec.type === 'skills' || sec.type === 'languages') {
      pieces.push(`<p>${(sec.entries || []).map((e) => escapeHtml(typeof e === 'string' ? e : [e.language, e.level].filter(Boolean).join(' — '))).join(' · ')}</p>`);
    } else {
      const metaLine = [sec.subtitle, sec.dateInfo].filter(Boolean).join(' · ');
      const lines = sec.content ? splitLines(sec.content) : [];
      if (metaLine) pieces.push(`<p class="entry-meta">${escapeHtml(metaLine)}</p>`);
      lines.forEach((l) => pieces.push(`<p>${l.trim() ? escapeHtml(l) : '&#8203;'}</p>`));
      if (metaLine && lines.length) { pieces[1] = pieces[0] + pieces[1]; pieces.shift(); }
    }
    if (!pieces.length) pieces.push('');
    return pieces.map((inner, i) => ({
      flow: 'main',
      html: `<div class="cv-block blk${i < pieces.length - 1 ? ' nl' : ''}" ${ds}>${i === 0 ? `<h4>${heading}</h4>` : ''}${inner}</div>`,
    }));
  }

  function headingHtml(ctx, sec, n) {
    const title = `<span class="sh-t">${escapeHtml(sectionTitle(sec))}</span>`;
    const id = ctx.id;
    if (id === 'tech') return `<div class="sh"><span class="sh-n">${String(n).padStart(2, '0')}</span>${title}</div>`;
    if (id === 'onyx') {
      const inSide = ctx.def.side && SIDEBAR_SECTION_TYPES.includes(sec.type);
      return inSide ? `<div class="sh">${title}</div>` : `<div class="sh"><span class="sh-ic">${ico(sec.type, '#ffffff', 17)}</span>${title}</div>`;
    }
    if (id === 'geo' || id === 'timeline') return `<div class="sh"><span class="sh-ic">${ico(sec.type, '#ffffff', 15)}</span>${title}</div>`;
    if (id === 'creative') return `<div class="sh"><span class="sh-ic">${ico(sec.type, '#ffffff', 17)}</span>${title}</div>`;
    return `<div class="sh">${title}</div>`;
  }

  function modernBlocks(ctx, sec, n) {
    const fl = ctx.def.side && SIDEBAR_SECTION_TYPES.includes(sec.type) ? 'side' : 'main';
    const pieces = [];
    const st = STRUCTURED_TYPES[sec.type];
    if (st === 'experience' || st === 'education') {
      const isExp = st === 'experience';
      (sec.entries || []).forEach((e) => {
        const title = escapeHtml((isExp ? e.title : e.degree) || '');
        const sub = [isExp ? e.company : e.institution, e.location].filter(Boolean).map(escapeHtml).join(' · ');
        const dates = datesText(e);
        const lines = e.description ? splitLines(e.description) : [];
        const head = `<span class="en-dot"></span><div class="en-top"><div class="en-t">${title}</div>${dates ? `<div class="en-d"><bdi>${escapeHtml(dates)}</bdi></div>` : ''}</div>${sub ? `<div class="en-s">${sub}</div>` : ''}`;
        const line = (l) => `<div class="en-p">${l.trim() ? escapeHtml(l) : '&#8203;'}</div>`;
        if (lines.length <= 1) pieces.push(`<div class="en">${head}${lines.length ? line(lines[0]) : ''}</div>`);
        else lines.forEach((l, i) => pieces.push(`<div class="en${i ? ' en-c' : ''}${i < lines.length - 1 ? ' ec' : ''}">${i ? '' : head}${line(l)}</div>`));
      });
    } else if (sec.type === 'skills') {
      if ((sec.entries || []).length) pieces.push(`<div class="sk-list">${sec.entries.map((s) => `<span class="sk">${escapeHtml(s)}</span>`).join('')}</div>`);
    } else if (sec.type === 'languages') {
      (sec.entries || []).forEach((e) => pieces.push(`<div class="lg"><span class="lg-n">${escapeHtml(e.language || '')}</span>${e.level ? `<span class="lg-l">${escapeHtml(e.level)}</span>` : ''}</div>`));
      if (pieces.length > 1) { const all = pieces.join(''); pieces.length = 0; pieces.push(all); }
    } else {
      const meta = [sec.subtitle, sec.dateInfo].filter(Boolean).map(escapeHtml).join(' · ');
      const lines = sec.content ? splitLines(sec.content) : [];
      lines.forEach((l) => pieces.push(`<p class="gp">${l.trim() ? escapeHtml(l) : '&#8203;'}</p>`));
      if (meta) { if (pieces.length) pieces[0] = `<div class="gm">${meta}</div>` + pieces[0]; else pieces.push(`<div class="gm">${meta}</div>`); }
    }
    if (!pieces.length) pieces.push('');
    const pal = [ctx.c1, ctx.c2, ctx.c3];
    const sc = ctx.id === 'creative' ? ` style="--sc:${pal[(n - 1) % 3]}"` : '';
    return pieces.map((inner, i) => ({
      flow: fl,
      html: `<div class="blk${i === 0 ? ' first' : ''}${i < pieces.length - 1 ? ' nl' : ''}" data-sec="${sec.id}" data-type="${sec.type}"${sc}>${i === 0 ? headingHtml(ctx, sec, n) : ''}${inner}</div>`,
    }));
  }

  function buildBlocks(ctx) {
    const out = [];
    (ctx.cv.sections || []).forEach((sec, i) => {
      (ctx.def.legacy ? legacyBlocks(ctx, sec) : modernBlocks(ctx, sec, i + 1)).forEach((b) => out.push(b));
    });
    return out;
  }

  function applyPageVars(pg, ctx) {
    pg.setAttribute('dir', ctx.dir);
    pg.setAttribute('lang', lang);
    const s = pg.style;
    s.setProperty('--fs', ctx.fs);
    s.setProperty('--cvf', ctx.font);
    if (ctx.head) s.setProperty('--cvh', ctx.head);
    s.setProperty('--ac', ctx.pal.ac); s.setProperty('--ac-d', ctx.pal.d); s.setProperty('--ac-s', ctx.pal.s);
    s.setProperty('--ac-l', ctx.pal.l); s.setProperty('--on-ac', ctx.pal.on);
    s.setProperty('--c1', ctx.c1); s.setProperty('--c2', ctx.c2); s.setProperty('--c3', ctx.c3);
    s.setProperty('--sidebar-color', ctx.pal.ac);
  }

  // Lays the CV out on as many A4 pages as needed. Returns the page elements.
  function renderPages(cv, id, target, opts) {
    opts = opts || {};
    const ctx = buildCtx(cv, id);
    const page = ctx.def.legacy ? PAGES.legacy : PAGES[id];
    target.innerHTML = '';
    const pages = [];
    const addPage = () => {
      const wrap = document.createElement('div');
      wrap.innerHTML = page(ctx, pages.length === 0).trim();
      const pg = wrap.firstElementChild;
      if (pages.length) pg.classList.add('cont');
      applyPageVars(pg, ctx);
      target.appendChild(pg);
      pages.push(pg);
    };
    addPage();
    const cursor = { main: 0, side: 0 };
    const tmp = document.createElement('div');
    for (const b of buildBlocks(ctx)) {
      const fl = pages[0].querySelector(`[data-flow="${b.flow}"]`) ? b.flow : 'main';
      let pi = cursor[fl];
      for (;;) {
        if (pi >= pages.length) {
          if (opts.maxPages && pages.length >= opts.maxPages) break;
          addPage();
        }
        const slot = pages[pi].querySelector(`[data-flow="${fl}"]`);
        tmp.innerHTML = b.html;
        const node = tmp.firstElementChild;
        const empty = !slot.firstElementChild;
        if (empty) node.classList.add('top');
        slot.appendChild(node);
        const over = node.getBoundingClientRect().bottom - slot.getBoundingClientRect().bottom;
        if (over <= 1 || empty) { cursor[fl] = pi; break; }
        slot.removeChild(node);
        pi++;
      }
    }
    pages.forEach((pg) => qsa('.flow', pg).forEach((f) => f.parentElement.classList.toggle('is-empty', !f.firstElementChild)));
    return pages;
  }

  /* ================= Live preview ================= */
  let zoom = 'fit';
  let previewPages = [];
  let renderQueued = false;
  function renderPreview() {
    if (!activeCv) return;
    previewPages = renderPages(activeCv, tplOf(activeCv), els.pages);
    const n = previewPages.length;
    els.pageCount.textContent = n > 1 ? `${t('pages_n')}: ${n}` : '';
    applyZoom();
    highlight();
    scheduleThumbs();
  }
  function renderPreviewSoon() {
    if (renderQueued) return;
    renderQueued = true;
    requestAnimationFrame(() => { renderQueued = false; renderPreview(); });
  }
  function stageFitScale() {
    const w = (els.stage.clientWidth - 60) / 794;
    const h = (els.stage.clientHeight - 100) / 1123;
    return Math.max(0.2, Math.min(w, h, 1.5));
  }
  function applyZoom() {
    const s = zoom === 'fit' ? stageFitScale() : zoom;
    els.pages.style.transform = `scale(${s})`;
    els.pagesHolder.style.width = (794 * s) + 'px';
    els.pagesHolder.style.height = (els.pages.offsetHeight * s) + 'px';
    els.zoomVal.textContent = Math.round(s * 100) + '%';
  }
  function setZoom(dir) {
    let s = zoom === 'fit' ? stageFitScale() : zoom;
    s = Math.round((s + dir * 0.1) * 10) / 10;
    zoom = Math.max(0.2, Math.min(2, s));
    applyZoom();
  }
  $('zoomIn').addEventListener('click', () => setZoom(1));
  $('zoomOut').addEventListener('click', () => setZoom(-1));
  $('zoomFit').addEventListener('click', () => { zoom = 'fit'; applyZoom(); });
  window.addEventListener('resize', () => applyZoom());

  function secColorOf(key) {
    if (key === 'style' || key === 'personal') return secColor(key);
    const sec = activeCv && activeCv.sections.find((s) => s.id === key);
    return secColor(sec ? sec.type : '');
  }
  function highlight() {
    qsa('[data-sec]', els.pages).forEach((n) => {
      const on = !!openSec && n.dataset.sec === openSec;
      n.classList.toggle('hl', on);
      if (on) n.style.setProperty('--hl', secColorOf(openSec));
    });
  }
  // clicking a part of the CV opens its section in the form
  els.pages.addEventListener('click', (e) => {
    const part = e.target.closest('[data-sec]');
    if (!part) return;
    const k = part.dataset.sec;
    els.workspace.classList.remove('collapsed');
    toggleSec(k, true);
    setTimeout(() => { const a = els.accordion.querySelector(`.acc[data-sec="${k}"]`); if (a) a.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); applyZoom(); }, 320);
  });

  /* ================= Thumbnails (real filled CVs) ================= */
  function thumbSource() {
    const cv = activeCv;
    const filled = cv && cv.personal && cv.personal.fullName && (cv.sections || []).filter((s) => (s.entries && s.entries.length) || s.content).length >= 3;
    if (filled) return cv;
    const s = sampleCvData(lang);
    const extra = { ar: ['شهادة مدقق داخلي ISO 9001\nشهادة إدارة الطاقة ISO 50001', 'البحث العلمي، القراءة، الشطرنج'], fr: ['Auditeur interne ISO 9001\nManagement de l’énergie ISO 50001', 'Recherche scientifique, lecture, échecs'], en: ['ISO 9001 Internal Auditor\nISO 50001 Energy Management', 'Scientific research, reading, chess'] }[lang];
    s.sections.push({ id: uid(), type: 'certifications', subtitle: '', dateInfo: '', content: extra[0] });
    s.sections.push({ id: uid(), type: 'interests', subtitle: '', dateInfo: '', content: extra[1] });
    if (cv) s.fontScale = cv.fontScale;
    return s;
  }
  function cvForTemplate(src, id) {
    const c = clone(src);
    const st = (activeCv && activeCv.tplStyles && activeCv.tplStyles[id]) || {};
    if (activeCv && id === tplOf(activeCv)) { c.sidebarColor = activeCv.sidebarColor; c.fontFamily = activeCv.fontFamily || ''; }
    else { c.sidebarColor = st.color || TPL[id].color; c.fontFamily = st.font || ''; }
    c.template = id;
    return c;
  }
  function thumbInto(box, cv, id, width) {
    const pg = renderPages(cv, id, els.measure, { maxPages: 1 })[0];
    els.measure.innerHTML = '';
    const holder = document.createElement('div');
    holder.className = 'thumb-box';
    holder.style.transform = `scale(${width / 794})`;
    holder.appendChild(pg);
    box.innerHTML = '';
    box.appendChild(holder);
  }
  let thumbTimer = null;
  function scheduleThumbs() {
    clearTimeout(thumbTimer);
    thumbTimer = setTimeout(() => {
      if (!activeCv) return;
      thumbInto(els.currentThumb, activeCv, tplOf(activeCv), 52);
      els.currentTplName.textContent = t('templateNames')[tplOf(activeCv)];
      if (openSec === 'style') renderTplStrip();
    }, 380);
  }
  function renderTplStrip() {
    const strip = $('tplStrip');
    if (!strip || !activeCv) return;
    const src = thumbSource();
    const cur = tplOf(activeCv);
    strip.innerHTML = TPL_IDS.map((id) => `<button type="button" class="tpl-chip${id === cur ? ' on' : ''}" data-tpl="${id}"><span class="t-thumb"></span><span>${escapeHtml(t('templateNames')[id])}</span></button>`).join('');
    qsa('.tpl-chip', strip).forEach((b) => {
      const box = b.querySelector('.t-thumb');
      thumbInto(box, cvForTemplate(src, b.dataset.tpl), b.dataset.tpl, box.clientWidth || 78);
    });
  }

  /* ================= Gallery ================= */
  let gCat = 'all';
  function openGallery() { els.gallery.classList.remove('hidden'); buildGallery(); setTimeout(() => els.gSearch.focus(), 50); }
  function closeGallery() { els.gallery.classList.add('hidden'); }
  function buildGallery() {
    els.gCats.innerHTML = CATS.map((c) => `<button type="button" class="chip${c === gCat ? ' on' : ''}" data-cat="${c}">${escapeHtml(t('cats')[c])}</button>`).join('');
    renderGalleryGrid();
  }
  function renderGalleryGrid() {
    const q = els.gSearch.value.trim().toLowerCase();
    const ids = TPL_IDS.filter((id) => (gCat === 'all' || TPL[id].cat === gCat) &&
      (!q || [id, I18N.ar.templateNames[id], I18N.en.templateNames[id], I18N.fr.templateNames[id], t('cats')[TPL[id].cat]].join(' ').toLowerCase().includes(q)));
    const cur = tplOf(activeCv);
    if (!ids.length) { els.gGrid.innerHTML = `<div class="g-empty">${escapeHtml(t('no_results'))}</div>`; return; }
    els.gGrid.innerHTML = ids.map((id) => `<button type="button" class="g-card${id === cur ? ' on' : ''}" data-tpl="${id}"><div class="g-thumb"></div><div class="g-meta"><b>${escapeHtml(t('templateNames')[id])}</b><span>${escapeHtml(t('cats')[TPL[id].cat])}</span></div></button>`).join('');
    const src = thumbSource();
    const cards = qsa('.g-card', els.gGrid);
    let i = 0;
    const step = () => { // render progressively so the dialog opens instantly
      const end = Math.min(cards.length, i + 3);
      for (; i < end; i++) { const box = cards[i].querySelector('.g-thumb'); thumbInto(box, cvForTemplate(src, cards[i].dataset.tpl), cards[i].dataset.tpl, box.clientWidth || 200); }
      if (i < cards.length && !els.gallery.classList.contains('hidden')) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  $('btnGallery').addEventListener('click', openGallery);
  $('gClose').addEventListener('click', closeGallery);
  els.gallery.addEventListener('click', (e) => {
    if (e.target === els.gallery) { closeGallery(); return; }
    const chip = e.target.closest('[data-cat]');
    if (chip) { gCat = chip.dataset.cat; buildGallery(); return; }
    const card = e.target.closest('.g-card');
    if (card) { setTemplate(card.dataset.tpl); closeGallery(); }
  });
  els.gSearch.addEventListener('input', renderGalleryGrid);

  function setTemplate(id) {
    if (!activeCv || !TPL[id]) return;
    const old = tplOf(activeCv);
    activeCv.tplStyles = activeCv.tplStyles || {};
    activeCv.tplStyles[old] = { color: activeCv.sidebarColor || TPL[old].color, font: activeCv.fontFamily || '' };
    const st = activeCv.tplStyles[id] || {};
    activeCv.template = id;
    activeCv.sidebarColor = st.color || TPL[id].color;
    activeCv.fontFamily = st.font || '';
    rebuildKeepOpen();
    renderPreview();
    scheduleSave();
  }

  /* ================= Accordion (form panel) ================= */
  let openSec = null;
  const chev = '<svg class="acc-chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>';
  const IC = {
    up: '<svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
    down: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7"/></svg>',
    del: '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    next: '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
    reset: '<svg viewBox="0 0 24 24"><path d="M4 4v6h6M4 10a8 8 0 1 1 2 6"/></svg>',
    cam: '<svg viewBox="0 0 24 24"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
    grid: '<svg viewBox="0 0 24 24"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/></svg>',
  };
  const field = (label, input) => `<div class="field"><label>${escapeHtml(label)}</label>${input}</div>`;
  const attr = (v) => escapeHtml(v == null ? '' : v);

  function accShell(key, num, title, body, isLast) {
    return `<section class="acc${openSec === key ? ' open' : ''}" data-sec="${key}" style="--sc:${secColorOf(key)}">
      <button type="button" class="acc-head"><span class="acc-num">${num}</span><span class="acc-title"><b>${escapeHtml(title)}</b><small data-sum="${key}"></small></span>${chev}</button>
      <div class="acc-body"><div class="acc-inner"><div class="acc-content">${body}
        <button type="button" class="acc-next" data-next>${isLast ? `<span>${escapeHtml(t('done'))}</span>` : `<span>${escapeHtml(t('next'))}</span>${IC.next}`}</button>
      </div></div></div></section>`;
  }

  function styleBody() {
    const id = tplOf(activeCv);
    const def = TPL[id];
    const color = activeCv.sidebarColor || def.color;
    const fsPct = Math.round((Number(activeCv.fontScale) || 1) * 100);
    const colorField = def.fixed
      ? `<div class="fixed-note">${escapeHtml(t('fixedPaletteNote'))}</div>`
      : `<div class="swatches">${PALETTE_SWATCHES.map((c) => `<button type="button" class="sw${c.toLowerCase() === String(color).toLowerCase() ? ' on' : ''}" style="background:${c}" data-color="${c}"></button>`).join('')}
         <label class="sw custom" title="custom"><input type="color" data-act-input="color" value="${attr(color)}"></label></div>`;
    const fonts = `<select data-act-change="font"><option value="">${escapeHtml(t('font_auto'))}</option>${FONTS.map((f) => `<option value="${f.id}"${activeCv.fontFamily === f.id ? ' selected' : ''} style="font-family:'${f.id}'">${f.id}${f.ar ? ' — عربي' : ''}</option>`).join('')}</select>`;
    return `
      <div class="field"><label>${escapeHtml(t('f_template'))}</label><div class="tpl-strip" id="tplStrip"></div>
        <button type="button" class="soft-btn block" data-act="gallery" style="margin-top:10px">${IC.grid}<span>${escapeHtml(t('all_templates'))}</span></button></div>
      ${field(t('f_color'), colorField)}
      ${field(t('f_font'), fonts)}
      <div class="field"><label>${escapeHtml(t('f_fontsize'))}</label><div class="fs-ctl">
        <button type="button" class="fs-btn" data-act="fs-" ${fsPct <= FS_MIN * 100 ? 'disabled' : ''}>A−</button>
        <span class="fs-val" id="fsVal">${fsPct}%</span>
        <button type="button" class="fs-btn" data-act="fs+" ${fsPct >= FS_MAX * 100 ? 'disabled' : ''}>A+</button>
        <button type="button" class="fs-reset" data-act="fs0" title="${attr(t('f_reset'))}" aria-label="${attr(t('f_reset'))}">${IC.reset}</button>
      </div></div>
      ${field(t('f_cvtitle'), `<input type="text" data-bind="title" value="${attr(activeCv.title)}" placeholder="${attr(t('untitled'))}">`)}
      <button type="button" class="soft-btn danger block" data-act="clear">${IC.del}<span>${escapeHtml(t('clearCv'))}</span></button>`;
  }

  function personalBody() {
    const p = activeCv.personal;
    const inp = (f, label, type, ltr) => field(label, `<input type="${type || 'text'}" data-bind="personal.${f}" value="${attr(p[f])}" ${ltr ? 'dir="ltr"' : ''} placeholder="${attr(label)}">`);
    return `
      <div class="field"><label>${escapeHtml(t('photo'))}</label><div class="photo-row">
        <div class="photo-upload" data-act="photo">${p.photo ? `<img src="${attr(p.photo)}" alt="">` : `<span class="ph-ico">${IC.cam}<span>${escapeHtml(t('upload_photo'))}</span></span>`}</div>
        <div class="photo-side"><button type="button" class="soft-btn" data-act="photo">${IC.cam}<span>${escapeHtml(p.photo ? t('change_photo') : t('upload_photo'))}</span></button>
          ${p.photo ? `<button type="button" class="link-btn danger" data-act="photo-del">${escapeHtml(t('removePhoto'))}</button>` : `<span class="hint" style="font-size:.78rem;color:var(--ink-soft)">${escapeHtml(t('photo_hint'))}</span>`}</div>
        <input type="file" id="photoInput" accept="image/*" hidden>
      </div></div>
      ${inp('fullName', t('fullName'))}
      ${inp('title', t('professionalTitle'))}
      <div class="field-row2">${inp('phone', t('phone'), 'text', true)}${inp('email', t('email'), 'email', true)}</div>
      ${inp('address', t('address'))}
      <div class="field-row2">${inp('linkedin', t('linkedin'), 'text', true)}${inp('website', t('website'), 'text', true)}</div>
      ${inp('passport', t('passport'))}
      <label class="toggle-row"><span>${escapeHtml(t('showPassport'))}</span><input type="checkbox" data-bind="personal.showPassport" ${p.showPassport ? 'checked' : ''}><span class="toggle-switch"></span></label>`;
  }

  function sectionTypeOptionsHtml(selected) {
    return `<option value="" disabled ${!selected ? 'selected' : ''}>${t('chooseSection')}</option>` +
      SECTION_TYPE_ORDER.map((typ) => `<option value="${typ}" ${selected === typ ? 'selected' : ''}>${t('sectionTypes')[typ]}</option>`).join('');
  }

  function itemTools(n, len, role) {
    return `<button type="button" class="mini-btn" data-act="${role}-up" title="${attr(t('move_up'))}" ${n === 0 ? 'disabled' : ''}>${IC.up}</button>
      <button type="button" class="mini-btn" data-act="${role}-down" title="${attr(t('move_down'))}" ${n === len - 1 ? 'disabled' : ''}>${IC.down}</button>
      <button type="button" class="mini-btn danger" data-act="${role}-del" title="${attr(t('remove'))}">${IC.x}</button>`;
  }

  function sectionBody(sec, idx) {
    const len = activeCv.sections.length;
    const tools = `<div class="sec-tools"><select data-act-change="sec-type" aria-label="${attr(t('section_type'))}">${sectionTypeOptionsHtml(sec.type)}</select>
      <button type="button" class="mini-btn" data-act="sec-up" title="${attr(t('move_up'))}" ${idx === 0 ? 'disabled' : ''}>${IC.up}</button>
      <button type="button" class="mini-btn" data-act="sec-down" title="${attr(t('move_down'))}" ${idx === len - 1 ? 'disabled' : ''}>${IC.down}</button>
      <button type="button" class="mini-btn danger" data-act="sec-del" title="${attr(t('remove'))}">${IC.del}</button></div>`;
    const st = STRUCTURED_TYPES[sec.type];
    let body = '';
    if (st === 'experience' || st === 'education') {
      const isExp = st === 'experience';
      const entries = sec.entries || [];
      body = `<div class="entries">${entries.map((e, ei) => {
        const tf = isExp ? 'title' : 'degree', of = isExp ? 'company' : 'institution';
        const inp = (f, label, type, extra) => field(label, `<input type="${type || 'text'}" data-ei="${ei}" data-f="${f}" value="${attr(e[f])}" placeholder="${attr(label)}" ${extra || ''}>`);
        return `<div class="entry-card" data-ei="${ei}">
          <div class="entry-head"><span class="en-num">${ei + 1}</span><b data-etitle="${ei}">${escapeHtml(e[tf] || e[of] || (isExp ? t('jobTitle') : t('degree')))}</b>${itemTools(ei, entries.length, 'entry')}</div>
          <div class="entry-body">
            ${inp(tf, isExp ? t('jobTitle') : t('degree'))}
            <div class="field-row2">${inp(of, isExp ? t('company') : t('institution'))}${inp('location', t('location'))}</div>
            <div class="field-row2">${inp('start', t('startDate'), 'month')}${inp('end', t('endDate'), 'month', e.current ? 'disabled' : '')}</div>
            ${isExp ? `<label class="toggle-row"><span>${escapeHtml(t('currentlyHere'))}</span><input type="checkbox" data-ei="${ei}" data-f="current" ${e.current ? 'checked' : ''}><span class="toggle-switch"></span></label>` : ''}
            ${field(t('description'), `<textarea data-ei="${ei}" data-f="description" placeholder="${attr(t('description'))}">${escapeHtml(e.description || '')}</textarea>`)}
          </div></div>`;
      }).join('')}</div>
      <button type="button" class="add-btn wide" data-act="entry-add">${IC.plus}<span>${escapeHtml(String(isExp ? t('addExperience') : t('addEducation')).replace(/^\+\s*/, ''))}</span></button>`;
    } else if (st === 'skills') {
      const entries = sec.entries || [];
      body = `<div class="entries">${entries.map((s, si) => `<div class="row-item" data-ei="${si}"><input class="row-input" type="text" data-ei="${si}" data-f="skill" value="${attr(s)}">${itemTools(si, entries.length, 'entry')}</div>`).join('')}</div>
        <div class="add-row"><input class="row-input" type="text" data-role="skill-input" placeholder="${attr(t('skillPh'))}"><button type="button" class="soft-btn primary" data-act="skill-add" style="background:var(--sc);border-color:var(--sc)">${IC.plus}<span>${escapeHtml(t('add_btn'))}</span></button></div>`;
    } else if (st === 'languages') {
      const entries = sec.entries || [];
      body = `<div class="entries">${entries.map((e, ei) => `<div class="row-item" data-ei="${ei}"><input class="row-input" type="text" data-ei="${ei}" data-f="language" value="${attr(e.language)}" placeholder="${attr(t('langNamePh'))}"><input class="row-input small" type="text" data-ei="${ei}" data-f="level" value="${attr(e.level)}" placeholder="${attr(t('langLevelPh'))}">${itemTools(ei, entries.length, 'entry')}</div>`).join('')}</div>
        <button type="button" class="add-btn wide" data-act="entry-add">${IC.plus}<span>${escapeHtml(String(t('addLanguage')).replace(/^\+\s*/, ''))}</span></button>`;
    } else {
      body = `<div class="field-row2">${field(t('subtitlePh'), `<input type="text" data-f="subtitle" value="${attr(sec.subtitle)}" placeholder="${attr(t('subtitlePh'))}">`)}${field(t('datePh'), `<input type="text" data-f="dateInfo" value="${attr(sec.dateInfo)}" placeholder="${attr(t('datePh'))}">`)}</div>
        ${field(sectionTitle(sec), `<textarea data-f="content" placeholder="${attr(t('contentPh'))}" style="min-height:140px">${escapeHtml(sec.content || '')}</textarea>`)}`;
    }
    return tools + body;
  }

  function buildAccordion() {
    if (!activeCv) return;
    const secs = activeCv.sections;
    let html = accShell('style', 1, t('sec_style'), styleBody(), false);
    html += accShell('personal', 2, t('sec_personal'), personalBody(), secs.length === 0);
    secs.forEach((sec, i) => { html += accShell(sec.id, i + 3, sectionTitle(sec), sectionBody(sec, i), i === secs.length - 1); });
    els.accordion.innerHTML = html;
    bindPhotoInput();
    updateSummaries();
    if (openSec === 'style') setTimeout(renderTplStrip, 30);
  }
  function rebuildKeepOpen() {
    const y = els.panel.scrollTop;
    const focusSel = document.activeElement && els.accordion.contains(document.activeElement) ? document.activeElement : null;
    buildAccordion();
    els.panel.scrollTop = y;
    if (focusSel && focusSel.dataset.role === 'skill-input') {
      const acc = els.accordion.querySelector(`.acc[data-sec="${openSec}"] [data-role="skill-input"]`);
      if (acc) acc.focus();
    }
  }

  function toggleSec(id, force) {
    openSec = (force === undefined ? openSec !== id : force) ? id : null;
    qsa('.acc', els.accordion).forEach((a) => a.classList.toggle('open', a.dataset.sec === openSec));
    if (openSec === 'style') renderTplStrip();
    highlight();
  }

  function updateSummaries() {
    if (!activeCv) return;
    const set = (k, v) => { const el = els.accordion.querySelector(`[data-sum="${k}"]`); if (el) el.textContent = v; };
    const fsPct = Math.round((Number(activeCv.fontScale) || 1) * 100);
    set('style', [t('templateNames')[tplOf(activeCv)], activeCv.fontFamily || t('font_auto'), fsPct + '%'].join(' · '));
    const p = activeCv.personal;
    set('personal', cut([p.fullName, p.title, p.phone || p.email].filter(Boolean).join(' · ')) || t('d_personal'));
    activeCv.sections.forEach((sec) => {
      let s = '';
      const st = STRUCTURED_TYPES[sec.type];
      if (st === 'experience' || st === 'education') {
        const n = (sec.entries || []).length;
        const first = (sec.entries || []).map((e) => (st === 'experience' ? e.title || e.company : e.degree || e.institution)).filter(Boolean).slice(0, 2).join('، ');
        s = n ? `${n} ${t('entries_n')}${first ? ' · ' + first : ''}` : '';
      } else if (st === 'skills') s = (sec.entries || []).slice(0, 5).join(' · ');
      else if (st === 'languages') s = (sec.entries || []).map((e) => e.language).filter(Boolean).join(' · ');
      else s = [sec.subtitle, sec.content].filter(Boolean).join(' · ');
      set(sec.id, cut(s) || t('empty_sec'));
    });
    const fv = $('fsVal'); if (fv) fv.textContent = fsPct + '%';
  }

  function findSec(el) {
    const acc = el.closest('.acc');
    if (!acc) return null;
    const id = acc.dataset.sec;
    return { id, sec: activeCv.sections.find((s) => s.id === id), idx: activeCv.sections.findIndex((s) => s.id === id) };
  }
  function changed(rebuild) {
    if (rebuild) rebuildKeepOpen(); else updateSummaries();
    renderPreviewSoon();
    scheduleSave();
  }
  function blankSection(type) {
    const base = { id: uid(), type: type || 'summary', subtitle: '', dateInfo: '', content: '' };
    if (type === 'experience' || type === 'education') base.entries = [];
    if (type === 'skills') base.entries = [];
    if (type === 'languages') base.entries = [];
    return base;
  }
  function setFontScale(v) {
    activeCv.fontScale = Math.round(Math.min(FS_MAX, Math.max(FS_MIN, v)) * 100) / 100;
    changed(true);
  }

  // typing in fields
  els.accordion.addEventListener('input', (e) => {
    const el = e.target;
    if (!activeCv) return;
    if (el.dataset.bind) {
      const path = el.dataset.bind.split('.');
      const val = el.type === 'checkbox' ? el.checked : el.value;
      if (path.length === 1) activeCv[path[0]] = val; else activeCv[path[0]][path[1]] = val;
      changed(false);
      return;
    }
    if (el.dataset.actInput === 'color') { activeCv.sidebarColor = el.value; qsa('.sw.on', els.accordion).forEach((s) => s.classList.remove('on')); changed(false); return; }
    const info = findSec(el);
    if (!info || !info.sec || !el.dataset.f) return;
    const { sec } = info;
    const f = el.dataset.f;
    if (el.dataset.ei !== undefined) {
      const ei = Number(el.dataset.ei);
      if (f === 'skill') sec.entries[ei] = el.value;
      else {
        sec.entries[ei][f] = el.type === 'checkbox' ? el.checked : el.value;
        const tEl = els.accordion.querySelector(`.acc[data-sec="${sec.id}"] [data-etitle="${ei}"]`);
        if (tEl && (f === 'title' || f === 'degree' || f === 'company' || f === 'institution')) {
          const e2 = sec.entries[ei];
          tEl.textContent = e2.title || e2.degree || e2.company || e2.institution || '';
        }
      }
      changed(f === 'current');
    } else {
      sec[f] = el.value;
      changed(false);
    }
  });
  els.accordion.addEventListener('change', (e) => {
    const el = e.target;
    if (!activeCv) return;
    if (el.dataset.bind && el.type === 'checkbox') return; // handled by input
    if (el.dataset.actChange === 'font') { activeCv.fontFamily = el.value; changed(false); return; }
    if (el.dataset.actChange === 'sec-type') {
      const info = findSec(el);
      if (!info || !info.sec) return;
      const ns = blankSection(el.value);
      ns.id = info.sec.id;
      activeCv.sections[info.idx] = ns;
      changed(true);
    }
  });
  els.accordion.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.dataset.role === 'skill-input') { e.preventDefault(); addSkill(e.target); }
  });
  function addSkill(input) {
    const info = findSec(input);
    if (!info || !info.sec || !input.value.trim()) return;
    info.sec.entries = info.sec.entries || [];
    info.sec.entries.push(input.value.trim());
    input.value = '';
    changed(true);
  }

  els.accordion.addEventListener('click', async (e) => {
    if (!activeCv) return;
    const head = e.target.closest('.acc-head');
    if (head) { toggleSec(head.closest('.acc').dataset.sec); return; }
    const nx = e.target.closest('[data-next]');
    if (nx) {
      const next = nx.closest('.acc').nextElementSibling;
      if (next && next.classList.contains('acc')) {
        toggleSec(next.dataset.sec, true);
        setTimeout(() => next.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
      } else toggleSec(null);
      return;
    }
    const sw = e.target.closest('.sw[data-color]');
    if (sw) { activeCv.sidebarColor = sw.dataset.color; changed(true); return; }
    const chip = e.target.closest('.tpl-chip');
    if (chip) { setTemplate(chip.dataset.tpl); return; }
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const act = btn.dataset.act;
    const fs = Number(activeCv.fontScale) || 1;
    if (act === 'gallery') return openGallery();
    if (act === 'fs-') return setFontScale(fs - FS_STEP);
    if (act === 'fs+') return setFontScale(fs + FS_STEP);
    if (act === 'fs0') return setFontScale(1);
    if (act === 'clear') return clearCvFields();
    if (act === 'photo') { const pi = $('photoInput'); if (pi) pi.click(); return; }
    if (act === 'photo-del') {
      activeCv.personal.photo = null;
      return changed(true);
    }
    const info = findSec(btn);
    if (!info || !info.sec) return;
    const { sec, idx } = info;
    const arr = activeCv.sections;
    if (act === 'sec-up' || act === 'sec-down') {
      const j = idx + (act === 'sec-up' ? -1 : 1);
      if (j < 0 || j >= arr.length) return;
      [arr[idx], arr[j]] = [arr[j], arr[idx]];
      return changed(true);
    }
    if (act === 'sec-del') {
      if (!(await askConfirm(t('del_section_confirm')))) return;
      arr.splice(idx, 1);
      if (openSec === sec.id) openSec = null;
      return changed(true);
    }
    if (act === 'entry-add') {
      sec.entries = sec.entries || [];
      sec.entries.push({});
      return changed(true);
    }
    if (act === 'skill-add') { const inp = btn.parentElement.querySelector('[data-role="skill-input"]'); if (inp) addSkill(inp); return; }
    const holder = btn.closest('[data-ei]');
    if (!holder) return;
    const ei = Number(holder.dataset.ei);
    if (act === 'entry-del') { sec.entries.splice(ei, 1); return changed(true); }
    if (act === 'entry-up' || act === 'entry-down') {
      const j = ei + (act === 'entry-up' ? -1 : 1);
      if (j < 0 || j >= sec.entries.length) return;
      [sec.entries[ei], sec.entries[j]] = [sec.entries[j], sec.entries[ei]];
      return changed(true);
    }
  });

  /* ---- Photo upload (compressed to base64, stored directly in Firestore) ---- */
  function bindPhotoInput() {
    const input = $('photoInput');
    if (!input) return;
    input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxSize = 300;
          let w = img.width, h = img.height;
          if (w > h && w > maxSize) { h = Math.round(h * maxSize / w); w = maxSize; }
          else if (h > maxSize) { w = Math.round(w * maxSize / h); h = maxSize; }
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          activeCv.personal.photo = canvas.toDataURL('image/jpeg', 0.8);
          changed(true);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  /* ---- Add section menu ---- */
  els.addSectionBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    els.addSecMenu.innerHTML = SECTION_TYPE_ORDER.map((typ) => `<button type="button" data-type="${typ}"><i style="background:${secColor(typ)}"></i>${escapeHtml(t('sectionTypes')[typ])}</button>`).join('');
    els.addSecMenu.classList.toggle('hidden');
  });
  els.addSecMenu.addEventListener('click', (e) => {
    const b = e.target.closest('[data-type]');
    if (!b || !activeCv) return;
    const sec = blankSection(b.dataset.type);
    activeCv.sections.push(sec);
    els.addSecMenu.classList.add('hidden');
    openSec = sec.id;
    changed(true);
    setTimeout(() => { const a = els.accordion.querySelector(`.acc[data-sec="${sec.id}"]`); if (a) a.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 300);
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#addSecWrap')) els.addSecMenu.classList.add('hidden');
    if (!e.target.closest('.lang-wrap')) els.langMenu.classList.add('hidden');
  });

  /* ================= Dialog helpers ================= */
  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => els.toast.classList.remove('show'), 2400);
  }
  let confirmResolve = null;
  function askConfirm(msg) {
    els.confirmMessage.textContent = msg;
    els.confirmOverlay.classList.remove('hidden');
    return new Promise((res) => { confirmResolve = res; });
  }
  function closeConfirm(v) { els.confirmOverlay.classList.add('hidden'); if (confirmResolve) { confirmResolve(v); confirmResolve = null; } }
  $('confirmOk').addEventListener('click', () => closeConfirm(true));
  $('confirmCancel').addEventListener('click', () => closeConfirm(false));
  els.confirmOverlay.addEventListener('click', (e) => { if (e.target === els.confirmOverlay) closeConfirm(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!els.confirmOverlay.classList.contains('hidden')) closeConfirm(false);
    else if (!els.gallery.classList.contains('hidden')) closeGallery();
    else if (!els.mine.classList.contains('hidden')) closeMine();
    else if (!els.login.classList.contains('hidden')) closeLogin();
  });

  /* ================= Language ================= */
  function applyLanguage() {
    const dict = I18N[lang];
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dict.dir);
    els.pageTitleTag.textContent = dict.pageTitleTag;
    document.title = dict.pageTitleTag;
    els.topbarTitle.textContent = dict.topbarTitle;
    els.langToggle.textContent = lang.toUpperCase();
    qsa('.lang-btn').forEach((b) => b.classList.toggle('on', b.dataset.lang === lang));
    qsa('[data-tip]').forEach((n) => { n.setAttribute('data-tiptext', t(n.dataset.tip)); n.setAttribute('aria-label', t(n.dataset.tip)); });
    qsa('[data-i18n]').forEach((n) => { n.textContent = t(n.dataset.i18n); });
    qsa('[data-i18n-ph]').forEach((n) => { n.placeholder = t(n.dataset.i18nPh); });
    els.addSectionText.textContent = t('add_section');
    els.dashTitle.textContent = dict.dashTitle;
    els.lockedTitle.textContent = t('login_title');
    els.lockedSub.textContent = t('login_text');
    els.tabLogin.textContent = dict.tabLogin;
    els.tabSignup.textContent = dict.tabSignup;
    els.acName.placeholder = dict.namePh;
    els.acEmail.placeholder = dict.emailPh;
    els.acPassword.placeholder = dict.passwordPh;
    els.forgotPwBtn.textContent = dict.forgotPw;
    els.orDivider.textContent = dict.or;
    els.acGoogleText.textContent = dict.googleBtn;
    els.logoutBtn.textContent = dict.logout;
    updateAuthFormMode(els.tabLogin.classList.contains('on') ? 'login' : 'signup');
    try { localStorage.setItem('cvbuilder:lang', lang); } catch (e) { /* ignore */ }

    if (activeCv) {
      // An untouched example CV follows the interface language.
      if (activeCv.isSample) { const keep = activeCv.template; activeCv = sampleCvData(lang); activeCv.template = keep; activeCv.sidebarColor = TPL[keep].color; }
      buildAccordion(); renderPreview();
    }
    if (!els.mine.classList.contains('hidden')) renderMine();
    if (!els.gallery.classList.contains('hidden')) buildGallery();
  }
  els.langToggle.addEventListener('click', (e) => { e.stopPropagation(); els.langMenu.classList.toggle('hidden'); });
  qsa('.lang-btn').forEach((btn) => btn.addEventListener('click', () => { lang = btn.dataset.lang; els.langMenu.classList.add('hidden'); applyLanguage(); }));

  /* ================= Auth (login dialog, opened only when needed) ================= */
  let pendingAfterLogin = null;
  const hasFb = () => !!(window.fbAuth && window.fbDb);
  function openLogin(after) {
    pendingAfterLogin = after || null;
    els.authCardError.classList.add('hidden');
    els.login.classList.remove('hidden');
  }
  function closeLogin() { els.login.classList.add('hidden'); }
  function afterLogin() {
    closeLogin();
    const fn = pendingAfterLogin; pendingAfterLogin = null;
    if (fn) fn();
  }
  $('loginCancel').addEventListener('click', () => { pendingAfterLogin = null; closeLogin(); });
  els.login.addEventListener('click', (e) => { if (e.target === els.login) { pendingAfterLogin = null; closeLogin(); } });

  function updateAuthFormMode(mode) {
    const isLogin = mode === 'login';
    els.tabLogin.classList.toggle('on', isLogin);
    els.tabSignup.classList.toggle('on', !isLogin);
    els.acName.classList.toggle('hidden', isLogin);
    els.acSubmitBtn.textContent = isLogin ? t('loginBtn') : t('signupBtn');
    els.forgotPwBtn.classList.toggle('hidden', !isLogin);
    els.authCardError.classList.add('hidden');
  }
  els.tabLogin.addEventListener('click', () => updateAuthFormMode('login'));
  els.tabSignup.addEventListener('click', () => updateAuthFormMode('signup'));
  const AUTH_ERR = {
    ar: {
      'auth/email-already-in-use': 'هذا البريد مستخدم مسبقًا.', 'auth/invalid-email': 'صيغة البريد غير صحيحة.',
      'auth/weak-password': 'كلمة المرور ضعيفة (6 أحرف على الأقل).', 'auth/wrong-password': 'كلمة المرور غير صحيحة.',
      'auth/user-not-found': 'لا يوجد حساب بهذا البريد.', 'auth/invalid-credential': 'البريد أو كلمة المرور غير صحيحة.',
      'auth/popup-closed-by-user': '', default: 'حدث خطأ، حاول مرة أخرى.',
    },
    en: {
      'auth/email-already-in-use': 'This email is already in use.', 'auth/invalid-email': 'Invalid email format.',
      'auth/weak-password': 'Password too weak (min 6 characters).', 'auth/wrong-password': 'Incorrect password.',
      'auth/user-not-found': 'No account found with this email.', 'auth/invalid-credential': 'Incorrect email or password.',
      'auth/popup-closed-by-user': '', default: 'Something went wrong, please try again.',
    },
    fr: {
      'auth/email-already-in-use': 'Cet e-mail est déjà utilisé.', 'auth/invalid-email': 'Format e-mail invalide.',
      'auth/weak-password': 'Mot de passe trop faible (6 caractères min).', 'auth/wrong-password': 'Mot de passe incorrect.',
      'auth/user-not-found': 'Aucun compte trouvé avec cet e-mail.', 'auth/invalid-credential': 'E-mail ou mot de passe incorrect.',
      'auth/popup-closed-by-user': '', default: 'Une erreur est survenue, réessayez.',
    },
  };
  function authErrMsg(code) { return (AUTH_ERR[lang] && AUTH_ERR[lang][code]) || AUTH_ERR[lang].default; }
  function showAuthError(msg) {
    if (!msg) return;
    els.authCardError.textContent = msg;
    els.authCardError.classList.remove('hidden');
  }

  els.authCardForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!hasFb()) { showAuthError(t('t_no_fb')); return; }
    const isLogin = els.tabLogin.classList.contains('on');
    const email = els.acEmail.value.trim();
    const password = els.acPassword.value;
    els.acSubmitBtn.disabled = true;
    try {
      if (isLogin) {
        await window.fbAuth.signInWithEmailAndPassword(email, password);
      } else {
        const cred = await window.fbAuth.createUserWithEmailAndPassword(email, password);
        if (els.acName.value.trim()) await cred.user.updateProfile({ displayName: els.acName.value.trim() });
      }
      await onSignedIn(window.fbAuth.currentUser);
      afterLogin();
    } catch (err) {
      showAuthError(authErrMsg(err.code));
    }
    els.acSubmitBtn.disabled = false;
  });

  els.acGoogleBtn.addEventListener('click', async () => {
    if (!hasFb()) { showAuthError(t('t_no_fb')); return; }
    try {
      await window.fbAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      await onSignedIn(window.fbAuth.currentUser);
      afterLogin();
    } catch (err) {
      showAuthError(authErrMsg(err.code));
    }
  });

  els.forgotPwBtn.addEventListener('click', async () => {
    const email = els.acEmail.value.trim();
    if (!email) { showAuthError(authErrMsg('auth/invalid-email')); return; }
    try {
      await window.fbAuth.sendPasswordResetEmail(email);
      els.authCardError.textContent = t('resetSent');
      els.authCardError.classList.remove('hidden');
    } catch (err) {
      showAuthError(authErrMsg(err.code));
    }
  });

  els.logoutBtn.addEventListener('click', () => { if (hasFb()) window.fbAuth.signOut(); });

  async function onSignedIn(fbUser) {
    if (!fbUser) return;
    if (currentUser && currentUser.uid === fbUser.uid && cvList.length) return;
    currentUser = { uid: fbUser.uid, name: fbUser.displayName || fbUser.email, email: fbUser.email, picture: fbUser.photoURL || null };
    await loadCvList();
    updateUserChip();
    if (!els.mine.classList.contains('hidden')) renderMine();
  }
  function updateUserChip() {
    els.userChip.classList.toggle('hidden', !currentUser);
    els.mineLogin.classList.toggle('hidden', !!currentUser || !hasFb());
    if (currentUser) els.userChipName.textContent = currentUser.name;
  }

  /* ================= "My CVs" (Firestore collection `cvs` + local drafts) ================= */
  async function loadCvList() {
    if (!currentUser) { cvList = []; return; }
    try {
      const snap = await window.fbDb.collection('cvs').where('owner', '==', currentUser.uid).get();
      cvList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      cvList.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    } catch (e) {
      cvList = [];
    }
  }

  function openMine() { els.mine.classList.remove('hidden'); updateUserChip(); renderMine(); if (currentUser) loadCvList().then(renderMine); }
  function closeMine() { els.mine.classList.add('hidden'); }
  $('btnMine').addEventListener('click', openMine);
  $('mClose').addEventListener('click', closeMine);
  els.mine.addEventListener('click', (e) => { if (e.target === els.mine) closeMine(); });
  $('mineLoginBtn').addEventListener('click', () => openLogin(() => openMine()));

  function miniIcon(color) { return `<span class="m-ico"><i style="background:${escapeHtml(color || SIDEBAR_COLORS[0])}"></i></span>`; }
  function renderMine() {
    const drafts = loadLocalDrafts();
    const cloudIds = new Set(cvList.map((c) => c.id));
    const cards = [];
    cards.push(`<button type="button" class="g-card m-new" data-act="new">${IC.plus}<span>${escapeHtml(t('newCv'))}</span></button>`);
    cvList.forEach((cv) => {
      const d = drafts.find((x) => x.localId === cv.id);
      const unsaved = d && (d.updatedAt || 0) > (cv.updatedAt || 0);
      cards.push(`<div class="g-card m-card" data-id="${escapeHtml(cv.id)}" data-kind="saved">
        ${cv.id === activeCvId ? `<span class="m-tag">${escapeHtml(t('current_badge'))}</span>` : ''}
        <div class="m-top">${miniIcon(cv.sidebarColor)}<div class="m-info"><b>${escapeHtml(cv.title || t('untitled'))}</b><small>${t('lastUpdated')}: ${formatDate(unsaved ? d.updatedAt : cv.updatedAt)}</small></div></div>
        <span class="m-src cloud">${escapeHtml(t('cloud_badge'))}${unsaved ? ' · ' + escapeHtml(t('unsavedBadge')) : ''}</span>
        <div class="m-actions">
          <button type="button" class="primary" data-act="edit">${escapeHtml(t('open'))}</button>
          <button type="button" data-act="duplicate">${escapeHtml(t('duplicate'))}</button>
          <button type="button" data-act="pdf">PDF</button>
          <button type="button" class="danger" data-act="delete">${escapeHtml(t('deleteCv'))}</button>
        </div></div>`);
    });
    drafts.filter((d) => !cloudIds.has(d.localId)).forEach((d) => {
      cards.push(`<div class="g-card m-card" data-id="${escapeHtml(d.localId)}" data-kind="draft">
        ${d.localId === activeCvId ? `<span class="m-tag">${escapeHtml(t('current_badge'))}</span>` : ''}
        <div class="m-top">${miniIcon(d.data && d.data.sidebarColor)}<div class="m-info"><b>${escapeHtml(d.title || t('untitled'))}</b><small>${t('lastUpdated')}: ${formatDate(d.updatedAt)}</small></div></div>
        <span class="m-src">${escapeHtml(t('unsavedBadge'))} · ${escapeHtml(t('local_badge'))}</span>
        <div class="m-actions">
          <button type="button" class="primary" data-act="edit">${escapeHtml(t('open'))}</button>
          <button type="button" data-act="pdf">PDF</button>
          <button type="button" class="danger" data-act="delete">${escapeHtml(t('deleteCv'))}</button>
        </div></div>`);
    });
    els.cvGrid.innerHTML = cards.join('');
  }
  els.cvGrid.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const act = btn.dataset.act;
    if (act === 'new') { createNewCv(); closeMine(); return; }
    const card = btn.closest('[data-id]');
    const id = card.dataset.id, kind = card.dataset.kind;
    if (act === 'edit') { await openEditor(id); closeMine(); }
    else if (act === 'duplicate') duplicateCv(id);
    else if (act === 'pdf') { closeMine(); openEditorThenExport(id); }
    else if (act === 'delete') {
      if (kind === 'draft') { if (await askConfirm(t('deleteConfirm'))) { deleteLocalDraft(id); if (id === activeCvId) startFresh(); renderMine(); } }
      else deleteCv(id);
    }
  });

  function createNewCv() {
    const data = sampleCvData(lang);
    const localId = 'local_' + Date.now();
    activeCv = data;
    activeCvId = localId;
    upsertLocalDraft({ localId, title: data.title, updatedAt: data.updatedAt, data });
    populateEditorFromActiveCv();
  }

  async function duplicateCv(id) {
    const src = cvList.find((c) => c.id === id);
    if (!src || !currentUser) return;
    const copy = JSON.parse(JSON.stringify(src));
    delete copy.id;
    copy.title = (src.title || t('untitled')) + ' (copy)';
    copy.updatedAt = Date.now();
    copy.owner = currentUser.uid;
    try {
      const ref = await window.fbDb.collection('cvs').add(copy);
      cvList.unshift({ id: ref.id, ...copy });
      renderMine();
    } catch (e) { /* ignore */ }
  }

  async function deleteCv(id) {
    if (!(await askConfirm(t('deleteConfirm')))) return;
    try {
      await window.fbDb.collection('cvs').doc(id).delete();
      cvList = cvList.filter((c) => c.id !== id);
      deleteLocalDraft(id);
      if (id === activeCvId) startFresh();
      renderMine();
    } catch (e) { /* ignore */ }
  }

  async function openEditorThenExport(id) {
    await openEditor(id);
    setTimeout(() => els.downloadPdfBtn.click(), 400);
  }

  /* ================= Editor: open / autosave ================= */
  async function openEditor(id) {
    const draft = loadLocalDrafts().find((d) => d.localId === id);
    if (String(id).startsWith('local_')) {
      if (!draft) return;
      activeCvId = id;
      activeCv = JSON.parse(JSON.stringify(draft.data));
      populateEditorFromActiveCv();
      return;
    }
    let cv = cvList.find((c) => c.id === id);
    if (!cv) {
      try {
        const doc = await window.fbDb.collection('cvs').doc(id).get();
        if (doc.exists) cv = { id: doc.id, ...doc.data() };
      } catch (e) { /* ignore */ }
    }
    if (!cv && !draft) return;
    activeCvId = id;
    // Autosave mirrors edits on this device: prefer them if they are newer than the account copy.
    activeCv = JSON.parse(JSON.stringify(draft && (!cv || (draft.updatedAt || 0) > (cv.updatedAt || 0)) ? draft.data : cv));
    if (!draft) upsertLocalDraft({ localId: id, title: activeCv.title, updatedAt: activeCv.updatedAt, data: activeCv }); // reopens after a reload
    populateEditorFromActiveCv();
  }

  function populateEditorFromActiveCv() {
    if (!activeCv.personal) activeCv.personal = newCvData().personal;
    if (!activeCv.sections) activeCv.sections = [];
    if (!activeCv.template) activeCv.template = 'navy';
    rememberOpen();
    openSec = null;
    buildAccordion();
    renderPreview();
    els.panel.scrollTop = 0;
  }

  function startFresh() {
    activeCv = sampleCvData(lang);
    activeCvId = 'local_' + Date.now();
    populateEditorFromActiveCv();
  }

  function scheduleSave() {
    if (!activeCv || !activeCvId) return;
    activeCv.updatedAt = Date.now();
    activeCv.isSample = false;
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(flushLocal, 500);
  }
  function flushLocal() {
    clearTimeout(saveTimeout);
    if (!activeCv || !activeCvId || activeCv.isSample) return;
    upsertLocalDraft({ localId: activeCvId, title: activeCv.title, updatedAt: activeCv.updatedAt, data: activeCv });
    rememberOpen();
    showSaveIndicator();
  }
  function showSaveIndicator() {
    els.saveIndicator.textContent = t('savedLocal');
    els.saveIndicator.classList.add('on');
  }

  async function saveCvToAccount() {
    if (!activeCv) return;
    activeCv.isSample = false;
    flushLocal();
    if (!currentUser) {
      if (!hasFb()) { toast(t('savedLocal')); return; }
      toast(t('savedLocal'));
      openLogin(saveCvToAccount);
      return;
    }
    els.saveCvBtn.disabled = true;
    try {
      activeCv.updatedAt = Date.now();
      activeCv.owner = currentUser.uid;
      activeCv.isSample = false;
      if (!cvList.some((c) => c.id === activeCvId) && String(activeCvId).startsWith('local_')) {
        const oldLocalId = activeCvId;
        const ref = await window.fbDb.collection('cvs').add(activeCv);
        activeCvId = ref.id;
        cvList.unshift({ id: ref.id, ...activeCv });
        deleteLocalDraft(oldLocalId);
      } else {
        await window.fbDb.collection('cvs').doc(activeCvId).set(activeCv, { merge: true });
        const idx = cvList.findIndex((c) => c.id === activeCvId);
        if (idx >= 0) cvList[idx] = { id: activeCvId, ...activeCv }; else cvList.unshift({ id: activeCvId, ...activeCv });
      }
      flushLocal();
      toast(t('t_saved_cloud'));
    } catch (e) {
      console.error('Cloud save failed:', e);
      toast(t('t_cloud_err'));
    }
    els.saveCvBtn.disabled = false;
  }
  els.saveCvBtn.addEventListener('click', saveCvToAccount);

  async function clearCvFields() {
    if (!activeCv) return;
    if (!(await askConfirm(t('clearConfirm')))) return;
    const blank = newCvData(activeCv.title);
    activeCv.personal = blank.personal;
    activeCv.sections = [];
    activeCv.isSample = false;
    openSec = null;
    buildAccordion();
    renderPreview();
    scheduleSave();
    toast(t('t_cleared'));
  }

  /* ================= Print ================= */
  // Clean, unscaled copies of every page for printing and PDF capture.
  function buildPrintCopy() {
    const pages = renderPages(activeCv, tplOf(activeCv), els.printRoot);
    pages.forEach((pg) => {
      qsa('.hl', pg).forEach((n) => n.classList.remove('hl'));
      qsa('[data-sec]', pg).forEach((n) => n.removeAttribute('data-sec'));
    });
    return pages;
  }
  $('btnPrint').addEventListener('click', () => {
    if (!activeCv) return;
    toast(t('t_print'));
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    fonts.then(() => { buildPrintCopy(); setTimeout(() => window.print(), 250); });
  });
  window.addEventListener('afterprint', () => { els.printRoot.innerHTML = ''; });

  /* ================= Toolbar ================= */
  $('btnFullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) (document.documentElement.requestFullscreen || function () {}).call(document.documentElement);
    else if (document.exitFullscreen) document.exitFullscreen();
  });
  $('panelToggle').addEventListener('click', () => {
    els.workspace.classList.toggle('collapsed');
    setTimeout(applyZoom, 320);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (activeCv) renderPreview(); });

  /* ================= PDF Export (paid per download via Paddle) ================= */
  const PADDLE_CLIENT_TOKEN = 'live_11f89f5307b65bb7f8a4c484e40';
  const PADDLE_CV_PRICE_ID = 'pri_01m35kb514t1p7fve8fze6ct5e';
  let paddleReady = false;

  function initPaddle() {
    if (!window.Paddle) return;
    window.Paddle.Initialize({
      token: PADDLE_CLIENT_TOKEN,
      eventCallback: function (event) {
        if (event.name === 'checkout.completed') {
          onPaddleCheckoutCompleted();
        }
      },
    });
    paddleReady = true;
  }
  // Paddle.js loads async (see index.html); poll briefly until it's available.
  (function waitForPaddle() {
    if (window.Paddle) { initPaddle(); return; }
    let tries = 0;
    const iv = setInterval(() => {
      tries++;
      if (window.Paddle) { clearInterval(iv); initPaddle(); }
      else if (tries > 40) { clearInterval(iv); } // ~10s, give up quietly — button still works, checkout just won't open
    }, 250);
  })();

  function startPaidDownload() {
    if (!currentUser) {
      alert('سجّل دخولك أولاً لتتمكن من تحميل السيرة الذاتية.');
      return;
    }
    if (!activeCvId) return;
    if (!paddleReady || !window.Paddle) {
      alert('نظام الدفع لم يجهز بعد، أعد المحاولة بعد لحظات.');
      return;
    }
    // The overlay checkout stays on this same page — no redirect, so no need to
    // persist which CV to reopen the way a full-page redirect would've required.
    window.Paddle.Checkout.open({
      items: [{ priceId: PADDLE_CV_PRICE_ID, quantity: 1 }],
      customData: { user_id: currentUser.uid },
    });
  }

  async function onPaddleCheckoutCompleted() {
    if (!activeCvId) return;
    const original = els.downloadPdfText.textContent;
    els.downloadPdfText.textContent = 'جارٍ التحقق من الدفع...';
    els.downloadPdfBtn.disabled = true;
    const paid = await checkForRecentPaidDownload();
    els.downloadPdfBtn.disabled = false;
    els.downloadPdfText.textContent = original;
    if (paid) {
      await exportPdf();
    } else {
      alert('تم تأكيد الدفع، لكن التحقق تأخّر — انتظر دقيقة واضغط تحميل مرة أخرى.');
    }
  }

  async function checkForRecentPaidDownload() {
    if (!currentUser || !window.fbDb) return false;
    try {
      // Payment confirmation (webhook) can lag a few seconds behind the checkout —
      // poll briefly rather than giving up on the first empty check.
      for (let attempt = 0; attempt < 6; attempt++) {
        const snap = await window.fbDb
          .collection('users').doc(currentUser.uid)
          .collection('cvPurchases')
          .orderBy('createdAt', 'desc')
          .limit(1)
          .get();
        if (!snap.empty) {
          const purchase = snap.docs[0].data();
          const purchasedAt = purchase.createdAt && purchase.createdAt.toMillis ? purchase.createdAt.toMillis() : 0;
          // Only treat it as "just paid" if the purchase happened in the last 10 minutes —
          // avoids re-triggering a free download from an old purchase record.
          if (Date.now() - purchasedAt < 10 * 60 * 1000) return true;
        }
        await new Promise((r) => setTimeout(r, 1500));
      }
    } catch (e) {
      console.error('checkForRecentPaidDownload failed:', e);
    }
    return false;
  }

  async function exportPdf() {
    if (!activeCv) return;
    const original = els.downloadPdfText.textContent;
    els.downloadPdfBtn.disabled = true;
    els.downloadPdfText.textContent = '…';
    toast(t('t_pdf'));
    try {
      // Wait for web fonts so Arabic glyphs are joined correctly in the capture.
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      els.printRoot.classList.add('capturing');
      const pages = buildPrintCopy();
      await new Promise((r) => setTimeout(r, 60));
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], {
          scale: 2.5, backgroundColor: '#ffffff', useCORS: true, logging: false,
          width: 794, height: 1123, windowWidth: 794, scrollX: 0, scrollY: 0,
        });
        if (i) pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pageWidth, pageHeight);
      }
      const ascii = (v) => String(v || '').replace(/[^\w\- ]/g, '').replace(/\s+/g, ' ').trim();
      const base = ascii(activeCv.title) || ascii(activeCv.personal && activeCv.personal.fullName) || 'CV';
      pdf.save(`${base}.pdf`);
    } catch (e) {
      console.error(e);
      alert('PDF export failed. Please try again.');
    }
    els.printRoot.classList.remove('capturing');
    els.printRoot.innerHTML = '';
    els.downloadPdfBtn.disabled = false;
    els.downloadPdfText.textContent = original;
  }
  // TEMPORARY: payment is bypassed while the Paddle account is still pending
  // approval, so downloads stay free for everyone. To re-enable payment,
  // change this back to: els.downloadPdfBtn.addEventListener('click', startPaidDownload);
  els.downloadPdfBtn.addEventListener('click', exportPdf);

  /* ================= Init ================= */
  applyLanguage();
  (function openInitial() {
    const drafts = loadLocalDrafts();
    let last = null;
    try { last = localStorage.getItem(LAST_OPEN_KEY); } catch (e) { /* ignore */ }
    const d = drafts.find((x) => x.localId === last) || drafts.slice().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))[0];
    if (d && d.data) { activeCvId = d.localId; activeCv = clone(d.data); populateEditorFromActiveCv(); }
    else startFresh();
  })();

  if (window.fbAuth) {
    window.fbAuth.onAuthStateChanged(async (fbUser) => {
      if (fbUser) {
        await onSignedIn(fbUser);
      } else {
        currentUser = null;
        cvList = [];
        updateUserChip();
        if (!els.mine.classList.contains('hidden')) renderMine();
      }
    });
  }
  updateUserChip();
})();
