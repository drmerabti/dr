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
      fullName: 'سفيان بلعباس', title: 'مهندس سلامة صناعية',
      phone: '0555 12 34 56', email: 'sofiane.example@mail.com', address: 'ورقلة، الجزائر',
      summary: 'مهندس بخبرة 6 سنوات في مجال السلامة الصناعية بقطاع المناجم، متخصص في تدريب الفرق الميدانية وتطبيق معايير السلامة الدولية.',
      exp1Title: 'مسؤول السلامة والصحة المهنية', exp1Company: 'شركة GICA', exp1Desc: 'إشراف ميداني على تطبيق بروتوكولات السلامة في مواقع استخراج المعادن، وتنظيم دورات تدريبية دورية للعمال.',
      exp2Title: 'مهندس ميداني', exp2Company: 'S.S.C', exp2Desc: 'متابعة معدات الاستخراج الثقيلة والتأكد من مطابقتها لمعايير السلامة قبل التشغيل.',
      eduDegree: 'ليسانس في هندسة السلامة الصناعية', eduInst: 'جامعة ورقلة',
      skills: ['إدارة المخاطر', 'ISO 45001', 'تدريب الفرق', 'التدقيق الميداني'],
      languages: [['العربية', 'اللغة الأم'], ['الفرنسية', 'جيد جدًا'], ['الإنجليزية', 'جيد']],
    },
    en: {
      fullName: 'Sofiane Belabbas', title: 'Industrial Safety Engineer',
      phone: '+213 555 12 34 56', email: 'sofiane.example@mail.com', address: 'Ouargla, Algeria',
      summary: 'Safety engineer with 6 years of experience in the mining industry, specialized in field team training and international safety standards.',
      exp1Title: 'Health & Safety Officer', exp1Company: 'GICA Company', exp1Desc: 'Field supervision of safety protocol implementation at mineral extraction sites, and regular worker training sessions.',
      exp2Title: 'Field Engineer', exp2Company: 'S.S.C', exp2Desc: 'Monitoring heavy extraction equipment and ensuring safety compliance before operation.',
      eduDegree: 'B.Sc. in Industrial Safety Engineering', eduInst: 'University of Ouargla',
      skills: ['Risk Management', 'ISO 45001', 'Team Training', 'Field Auditing'],
      languages: [['Arabic', 'Native'], ['French', 'Very good'], ['English', 'Good']],
    },
    fr: {
      fullName: 'Sofiane Belabbas', title: 'Ingénieur en sécurité industrielle',
      phone: '+213 555 12 34 56', email: 'sofiane.example@mail.com', address: 'Ouargla, Algérie',
      summary: "Ingénieur avec 6 ans d'expérience en sécurité industrielle dans le secteur minier, spécialisé dans la formation des équipes de terrain et les normes internationales de sécurité.",
      exp1Title: 'Responsable Santé & Sécurité', exp1Company: 'Société GICA', exp1Desc: "Supervision de terrain de l'application des protocoles de sécurité sur les sites d'extraction, et sessions de formation régulières.",
      exp2Title: 'Ingénieur de terrain', exp2Company: 'S.S.C', exp2Desc: "Suivi des équipements lourds d'extraction et vérification de leur conformité sécuritaire avant utilisation.",
      eduDegree: 'Licence en ingénierie de sécurité industrielle', eduInst: 'Université de Ouargla',
      skills: ['Gestion des risques', 'ISO 45001', 'Formation d\'équipe', 'Audit de terrain'],
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
  const els = {
    htmlRoot: $('htmlRoot'), pageTitleTag: $('pageTitleTag'), topbarTitle: $('topbarTitle'),
    langBtns: document.querySelectorAll('.lang-btn'),
    saveIndicator: $('saveIndicator'),
    userChip: $('userChip'), userChipName: $('userChipName'), logoutBtn: $('logoutBtn'),
    lockedScreen: $('lockedScreen'), dashboardScreen: $('dashboardScreen'), editorScreen: $('editorScreen'), loadingScreen: $('loadingScreen'),
    lockedTitle: $('lockedTitle'), lockedSub: $('lockedSub'),
    tabLogin: $('tabLogin'), tabSignup: $('tabSignup'),
    authCardForm: $('authCardForm'), authCardError: $('authCardError'),
    acName: $('acName'), acEmail: $('acEmail'), acPassword: $('acPassword'), acSubmitBtn: $('acSubmitBtn'),
    forgotPwBtn: $('forgotPwBtn'), orDivider: $('orDivider'), acGoogleBtn: $('acGoogleBtn'), acGoogleText: $('acGoogleText'),
    dashTitle: $('dashTitle'), newCvBtn: $('newCvBtn'), newCvText: $('newCvText'), cvGrid: $('cvGrid'), dashEmpty: $('dashEmpty'),
    editorBackBtn: $('editorBackBtn'), cvTitleInput: $('cvTitleInput'), downloadPdfBtn: $('downloadPdfBtn'), downloadPdfText: $('downloadPdfText'),
    saveCvBtn: $('saveCvBtn'), saveCvText: $('saveCvText'), clearCvBtn: $('clearCvBtn'), clearCvText: $('clearCvText'),
    templateTitle: $('templateTitle'), templateSwatches: $('templateSwatches'), colorCard: $('colorCard'),
    photoUploadBox: $('photoUploadBox'), photoPreview: $('photoPreview'), photoPlaceholder: $('photoPlaceholder'), photoInput: $('photoInput'), removePhotoBtn: $('removePhotoBtn'),
    personalInfoTitle: $('personalInfoTitle'),
    pFullName: $('pFullName'), pTitle: $('pTitle'), pPhone: $('pPhone'), pEmail: $('pEmail'),
    pAddress: $('pAddress'), pLinkedin: $('pLinkedin'), pWebsite: $('pWebsite'), pPassport: $('pPassport'),
    pShowPassport: $('pShowPassport'), showPassportLabel: $('showPassportLabel'),
    colorTitle: $('colorTitle'), colorSwatches: $('colorSwatches'),
    sectionsTitle: $('sectionsTitle'), sectionsList: $('sectionsList'), addSectionBtn: $('addSectionBtn'), addSectionText: $('addSectionText'),
    cvSheet: $('cvSheet'), cvSidebar: $('cvSidebar'), cvPreviewPhoto: $('cvPreviewPhoto'), cvPhotoPlaceholder: $('cvPhotoPlaceholder'),
    cvContact: $('cvContact'), cvSidebarSections: $('cvSidebarSections'), cvName: $('cvName'), cvRole: $('cvRole'), cvMainSections: $('cvMainSections'),
  };

  /* ================= State ================= */
  let currentUser = null;
  let cvList = [];
  let activeCv = null; // full CV object being edited
  let activeCvId = null;
  let saveTimeout = null;

  /* ================= Local drafts (unsaved-to-account CVs) ================= */
  const LOCAL_DRAFTS_KEY = 'cvbuilder:localDrafts';
  function loadLocalDrafts() { try { return JSON.parse(localStorage.getItem(LOCAL_DRAFTS_KEY)) || []; } catch (e) { return []; } }
  function saveLocalDraftsList(list) { localStorage.setItem(LOCAL_DRAFTS_KEY, JSON.stringify(list)); }
  function upsertLocalDraft(rec) {
    const list = loadLocalDrafts();
    const i = list.findIndex((d) => d.localId === rec.localId);
    if (i >= 0) list[i] = rec; else list.unshift(rec);
    saveLocalDraftsList(list);
  }
  function deleteLocalDraft(localId) { saveLocalDraftsList(loadLocalDrafts().filter((d) => d.localId !== localId)); }

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

  /* ================= Language ================= */
  function applyLanguage() {
    const dict = I18N[lang];
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dict.dir);
    els.pageTitleTag.textContent = dict.pageTitleTag;
    document.title = dict.pageTitleTag;
    els.topbarTitle.textContent = dict.topbarTitle;
    els.lockedTitle.textContent = dict.lockedTitle;
    els.lockedSub.textContent = dict.lockedSub;
    els.tabLogin.textContent = dict.tabLogin;
    els.tabSignup.textContent = dict.tabSignup;
    els.acName.placeholder = dict.namePh;
    els.acEmail.placeholder = dict.emailPh;
    els.acPassword.placeholder = dict.passwordPh;
    els.forgotPwBtn.textContent = dict.forgotPw;
    els.orDivider.textContent = dict.or;
    els.acGoogleText.textContent = dict.googleBtn;
    els.logoutBtn.textContent = '⎋';
    els.logoutBtn.title = dict.logout;
    els.dashTitle.textContent = dict.dashTitle;
    els.newCvText.textContent = dict.newCv;
    els.dashEmpty.textContent = dict.dashEmpty;
    els.downloadPdfText.textContent = dict.downloadPdf;
    els.saveCvText.textContent = dict.saveCv;
    els.clearCvText.textContent = dict.clearCv;
    els.templateTitle.textContent = dict.templateTitle;
    els.removePhotoBtn.textContent = dict.removePhoto;
    els.personalInfoTitle.textContent = dict.personalInfo;
    els.pFullName.placeholder = dict.fullName;
    els.pTitle.placeholder = dict.professionalTitle;
    els.pPhone.placeholder = dict.phone;
    els.pEmail.placeholder = dict.email;
    els.pAddress.placeholder = dict.address;
    els.pLinkedin.placeholder = dict.linkedin;
    els.pWebsite.placeholder = dict.website;
    els.pPassport.placeholder = dict.passport;
    els.showPassportLabel.textContent = dict.showPassport;
    els.colorTitle.textContent = dict.colorTitle;
    els.sectionsTitle.textContent = dict.sectionsTitle;
    els.addSectionText.textContent = dict.addSection;

    const authMode = els.tabLogin.classList.contains('active') ? 'login' : 'signup';
    updateAuthFormMode(authMode);

    els.langBtns.forEach((b) => b.classList.toggle('active', b.getAttribute('data-lang') === lang));
    localStorage.setItem('cvbuilder:lang', lang);

    if (activeCv) { renderSectionsList(); renderPreview(); renderTemplateSwatches(); }
    if (cvList.length) renderDashboard();
  }
  els.langBtns.forEach((btn) => btn.addEventListener('click', () => { lang = btn.getAttribute('data-lang'); applyLanguage(); }));

  function updateAuthFormMode(mode) {
    const isLogin = mode === 'login';
    els.tabLogin.classList.toggle('active', isLogin);
    els.tabSignup.classList.toggle('active', !isLogin);
    els.acName.classList.toggle('hidden', isLogin);
    els.acSubmitBtn.textContent = isLogin ? t('loginBtn') : t('signupBtn');
    els.forgotPwBtn.classList.toggle('hidden', !isLogin);
    els.authCardError.classList.add('hidden');
  }
  els.tabLogin.addEventListener('click', () => updateAuthFormMode('login'));
  els.tabSignup.addEventListener('click', () => updateAuthFormMode('signup'));

  /* ================= Screens ================= */
  function showScreen(name) {
    [els.loadingScreen, els.lockedScreen, els.dashboardScreen, els.editorScreen].forEach((s) => s.classList.add('hidden'));
    els[name].classList.remove('hidden');
  }

  /* ================= Auth ================= */
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
    const isLogin = els.tabLogin.classList.contains('active');
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
    } catch (err) {
      showAuthError(authErrMsg(err.code));
    }
    els.acSubmitBtn.disabled = false;
  });

  els.acGoogleBtn.addEventListener('click', async () => {
    try {
      await window.fbAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
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

  els.logoutBtn.addEventListener('click', () => window.fbAuth.signOut());

  /* ================= Dashboard (Firestore CRUD) ================= */
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

  function renderDashboard() {
    const localDrafts = loadLocalDrafts();
    const totalCount = cvList.length + localDrafts.length;
    els.dashEmpty.classList.toggle('hidden', totalCount > 0);

    const savedHtml = cvList.map((cv) => `
      <div class="cv-card" data-id="${cv.id}" data-kind="saved">
        <div class="cv-card-swatch" style="background:${cv.sidebarColor || SIDEBAR_COLORS[0]}"></div>
        <h3>${escapeHtml(cv.title || t('untitled'))}</h3>
        <p>${t('lastUpdated')}: ${formatDate(cv.updatedAt)}</p>
        <div class="cv-card-actions">
          <button type="button" data-act="edit">${t('edit')}</button>
          <button type="button" data-act="duplicate">${t('duplicate')}</button>
          <button type="button" data-act="pdf">PDF</button>
          <button type="button" data-act="delete" class="danger">${t('deleteCv')}</button>
        </div>
      </div>`).join('');

    const draftHtml = localDrafts.map((d) => `
      <div class="cv-card" data-id="${d.localId}" data-kind="draft">
        <div class="cv-card-swatch" style="background:${(d.data && d.data.sidebarColor) || SIDEBAR_COLORS[0]}"></div>
        <span class="unsaved-badge">${t('unsavedBadge')}</span>
        <h3>${escapeHtml(d.title || t('untitled'))}</h3>
        <p>${t('lastUpdated')}: ${formatDate(d.updatedAt)}</p>
        <div class="cv-card-actions">
          <button type="button" data-act="edit">${t('edit')}</button>
          <button type="button" data-act="delete" class="danger">${t('deleteCv')}</button>
        </div>
      </div>`).join('');

    els.cvGrid.innerHTML = savedHtml + draftHtml;

    els.cvGrid.querySelectorAll('.cv-card').forEach((card) => {
      const id = card.getAttribute('data-id');
      const kind = card.getAttribute('data-kind');
      card.addEventListener('click', (e) => {
        const actBtn = e.target.closest('button');
        if (!actBtn) { openEditor(id); return; }
        e.stopPropagation();
        const act = actBtn.getAttribute('data-act');
        if (act === 'edit') openEditor(id);
        else if (act === 'duplicate') duplicateCv(id);
        else if (act === 'delete') {
          if (kind === 'draft') { if (confirm(t('deleteConfirm'))) { deleteLocalDraft(id); renderDashboard(); } }
          else deleteCv(id);
        }
        else if (act === 'pdf') openEditorThenExport(id);
      });
    });
  }

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

  els.newCvBtn.addEventListener('click', () => {
    if (!currentUser) return;
    const data = sampleCvData(lang);
    const localId = 'local_' + Date.now();
    activeCv = data;
    activeCvId = localId;
    upsertLocalDraft({ localId, title: data.title, updatedAt: data.updatedAt, data });
    openEditorWithActiveCv();
  });

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
      renderDashboard();
    } catch (e) { /* ignore */ }
  }

  async function deleteCv(id) {
    if (!confirm(t('deleteConfirm'))) return;
    try {
      await window.fbDb.collection('cvs').doc(id).delete();
      cvList = cvList.filter((c) => c.id !== id);
      renderDashboard();
    } catch (e) { /* ignore */ }
  }

  async function openEditorThenExport(id) {
    await openEditor(id);
    setTimeout(() => exportPdf(), 400);
  }

  /* ================= Editor: open / bind / autosave ================= */
  async function openEditor(id) {
    if (String(id).startsWith('local_')) {
      const draft = loadLocalDrafts().find((d) => d.localId === id);
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
    if (!cv) return;
    activeCvId = id;
    activeCv = JSON.parse(JSON.stringify(cv));
    populateEditorFromActiveCv();
  }

  function openEditorWithActiveCv() { populateEditorFromActiveCv(); }

  function populateEditorFromActiveCv() {
    if (!activeCv.personal) activeCv.personal = newCvData().personal;
    if (!activeCv.sections) activeCv.sections = [];
    if (!activeCv.template) activeCv.template = 'navy';

    els.cvTitleInput.value = activeCv.title || '';
    els.pFullName.value = activeCv.personal.fullName || '';
    els.pTitle.value = activeCv.personal.title || '';
    els.pPhone.value = activeCv.personal.phone || '';
    els.pEmail.value = activeCv.personal.email || '';
    els.pAddress.value = activeCv.personal.address || '';
    els.pLinkedin.value = activeCv.personal.linkedin || '';
    els.pWebsite.value = activeCv.personal.website || '';
    els.pPassport.value = activeCv.personal.passport || '';
    els.pShowPassport.checked = !!activeCv.personal.showPassport;

    if (activeCv.personal.photo) {
      els.photoPreview.src = activeCv.personal.photo;
      els.photoPreview.classList.remove('hidden');
      els.photoPlaceholder.classList.add('hidden');
    } else {
      els.photoPreview.classList.add('hidden');
      els.photoPlaceholder.classList.remove('hidden');
    }

    renderTemplateSwatches();
    renderColorSwatches();
    renderSectionsList();
    renderPreview();
    showScreen('editorScreen');
  }

  els.editorBackBtn.addEventListener('click', async () => {
    if (activeCvId) {
      const idx = cvList.findIndex((c) => c.id === activeCvId);
      if (idx >= 0) cvList[idx] = { id: activeCvId, ...activeCv };
    }
    activeCv = null; activeCvId = null;
    await loadCvList();
    renderDashboard();
    showScreen('dashboardScreen');
  });

  function scheduleSave() {
    if (!activeCv || !activeCvId) return;
    activeCv.updatedAt = Date.now();
    activeCv.isSample = false;
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      if (String(activeCvId).startsWith('local_')) {
        upsertLocalDraft({ localId: activeCvId, title: activeCv.title, updatedAt: activeCv.updatedAt, data: activeCv });
      } else {
        upsertLocalDraft({ localId: activeCvId, title: activeCv.title, updatedAt: activeCv.updatedAt, data: activeCv });
      }
      showSaveIndicator('saving');
    }, 500);
  }
  function showSaveIndicator(state) {
    els.saveIndicator.classList.remove('hidden', 'saving', 'saved');
    els.saveIndicator.classList.add(state);
    els.saveIndicator.textContent = state === 'saving' ? t('savedLocal') : t('saved');
    setTimeout(() => els.saveIndicator.classList.add('hidden'), 1500);
  }

  async function saveCvToAccount() {
    if (!activeCv || !currentUser) return;
    const btn = els.saveCvBtn, txt = els.saveCvText;
    const original = txt.textContent;
    btn.disabled = true;
    try {
      activeCv.updatedAt = Date.now();
      activeCv.owner = currentUser.uid;
      activeCv.isSample = false;
      if (String(activeCvId).startsWith('local_')) {
        const oldLocalId = activeCvId;
        const ref = await window.fbDb.collection('cvs').add(activeCv);
        activeCvId = ref.id;
        cvList.unshift({ id: ref.id, ...activeCv });
        deleteLocalDraft(oldLocalId);
      } else {
        await window.fbDb.collection('cvs').doc(activeCvId).set(activeCv, { merge: true });
        const idx = cvList.findIndex((c) => c.id === activeCvId);
        if (idx >= 0) cvList[idx] = { id: activeCvId, ...activeCv };
      }
      txt.textContent = t('savedRemote');
      setTimeout(() => { txt.textContent = original; }, 1500);
    } catch (e) {
      txt.textContent = original;
    }
    btn.disabled = false;
  }
  els.saveCvBtn.addEventListener('click', saveCvToAccount);

  function clearCvFields() {
    if (!activeCv) return;
    if (!confirm(t('clearConfirm'))) return;
    const blank = newCvData(activeCv.title);
    activeCv.personal = blank.personal;
    activeCv.sections = [];
    activeCv.isSample = false;
    populateEditorFromActiveCv();
    scheduleSave();
  }
  els.clearCvBtn.addEventListener('click', clearCvFields);

  /* ================= Template picker ================= */
  function renderTemplateSwatches() {
    if (!activeCv) return;
    els.templateSwatches.innerHTML = TEMPLATES.map((tpl) => `
      <button type="button" class="template-swatch template-swatch-${tpl} ${activeCv.template === tpl ? 'active' : ''}" data-tpl="${tpl}">
        <span class="template-swatch-preview"></span>
        <span class="template-swatch-label">${t('templateNames')[tpl]}</span>
      </button>`).join('');
    els.templateSwatches.querySelectorAll('.template-swatch').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeCv.template = btn.getAttribute('data-tpl');
        renderTemplateSwatches();
        els.colorCard.classList.toggle('hidden', FIXED_PALETTE_TEMPLATES.includes(activeCv.template));
        renderPreview(); scheduleSave();
      });
    });
    els.colorCard.classList.toggle('hidden', FIXED_PALETTE_TEMPLATES.includes(activeCv.template));
  }

  els.cvTitleInput.addEventListener('input', () => { if (activeCv) { activeCv.title = els.cvTitleInput.value; scheduleSave(); } });

  function bindPersonal(el, field) {
    el.addEventListener('input', () => { activeCv.personal[field] = el.value; renderPreview(); scheduleSave(); });
  }
  bindPersonal(els.pFullName, 'fullName');
  bindPersonal(els.pTitle, 'title');
  bindPersonal(els.pPhone, 'phone');
  bindPersonal(els.pEmail, 'email');
  bindPersonal(els.pAddress, 'address');
  bindPersonal(els.pLinkedin, 'linkedin');
  bindPersonal(els.pWebsite, 'website');
  bindPersonal(els.pPassport, 'passport');
  els.pShowPassport.addEventListener('change', () => { activeCv.personal.showPassport = els.pShowPassport.checked; renderPreview(); scheduleSave(); });

  /* ---- Photo upload (compressed to base64, stored directly in Firestore) ---- */
  els.photoUploadBox.addEventListener('click', () => els.photoInput.click());
  els.photoInput.addEventListener('change', () => {
    const file = els.photoInput.files[0];
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
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        activeCv.personal.photo = dataUrl;
        els.photoPreview.src = dataUrl;
        els.photoPreview.classList.remove('hidden');
        els.photoPlaceholder.classList.add('hidden');
        renderPreview();
        scheduleSave();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
  els.removePhotoBtn.addEventListener('click', () => {
    activeCv.personal.photo = null;
    els.photoPreview.classList.add('hidden');
    els.photoPlaceholder.classList.remove('hidden');
    els.photoInput.value = '';
    renderPreview();
    scheduleSave();
  });

  /* ---- Sidebar color ---- */
  function renderColorSwatches() {
    els.colorSwatches.innerHTML = SIDEBAR_COLORS.map((c) => `
      <div class="color-swatch ${activeCv.sidebarColor === c ? 'active' : ''}" style="background:${c}" data-color="${c}"></div>
    `).join('') + `
      <div class="color-swatch color-swatch-custom" title="custom">
        🎨<input type="color" id="customColorInput" value="${activeCv.sidebarColor || '#22415A'}">
      </div>`;
    els.colorSwatches.querySelectorAll('.color-swatch[data-color]').forEach((sw) => {
      sw.addEventListener('click', () => {
        activeCv.sidebarColor = sw.getAttribute('data-color');
        renderColorSwatches(); renderPreview(); scheduleSave();
      });
    });
    const customInput = document.getElementById('customColorInput');
    if (customInput) {
      customInput.addEventListener('input', () => {
        activeCv.sidebarColor = customInput.value;
        renderPreview(); scheduleSave();
      });
    }
  }

  /* ================= Dynamic Sections ================= */
  const SIDEBAR_SECTION_TYPES = ['skills', 'languages', 'interests', 'certifications'];
  function uid() { return 's' + Math.random().toString(36).slice(2, 10); }

  function blankSection(type) {
    const base = { id: uid(), type: type || 'summary', subtitle: '', dateInfo: '', content: '' };
    if (type === 'experience' || type === 'education') base.entries = [];
    if (type === 'skills') base.entries = [];
    if (type === 'languages') base.entries = [];
    return base;
  }

  els.addSectionBtn.addEventListener('click', () => {
    activeCv.sections.push(blankSection('summary'));
    renderSectionsList(); renderPreview(); scheduleSave();
  });

  function moveSection(idx, dir) {
    const j = idx + dir;
    if (j < 0 || j >= activeCv.sections.length) return;
    [activeCv.sections[idx], activeCv.sections[j]] = [activeCv.sections[j], activeCv.sections[idx]];
    renderSectionsList(); renderPreview(); scheduleSave();
  }
  function removeSection(idx) {
    activeCv.sections.splice(idx, 1);
    renderSectionsList(); renderPreview(); scheduleSave();
  }

  function sectionTypeOptionsHtml(selected) {
    return `<option value="" disabled ${!selected ? 'selected' : ''}>${t('chooseSection')}</option>` +
      SECTION_TYPE_ORDER.map((typ) => `<option value="${typ}" ${selected === typ ? 'selected' : ''}>${t('sectionTypes')[typ]}</option>`).join('');
  }

  function renderSectionsList() {
    els.sectionsList.innerHTML = activeCv.sections.map((sec, idx) => {
      const structured = STRUCTURED_TYPES[sec.type];
      return `
      <div class="section-row" data-idx="${idx}">
        <div class="section-row-head">
          <select class="section-select" data-role="type">${sectionTypeOptionsHtml(sec.type)}</select>
          <div class="section-reorder">
            <button type="button" class="section-icon-btn" data-role="up" title="up">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
            </button>
            <button type="button" class="section-icon-btn" data-role="down" title="down">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
            </button>
            <button type="button" class="section-icon-btn danger" data-role="delete" title="delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
        <div class="section-body" data-role="body"></div>
      </div>`;
    }).join('');

    els.sectionsList.querySelectorAll('.section-row').forEach((row) => {
      const idx = parseInt(row.getAttribute('data-idx'), 10);
      const sec = activeCv.sections[idx];

      row.querySelector('[data-role="type"]').addEventListener('change', (e) => {
        activeCv.sections[idx] = blankSection(e.target.value);
        renderSectionsList(); renderPreview(); scheduleSave();
      });
      row.querySelector('[data-role="up"]').addEventListener('click', () => moveSection(idx, -1));
      row.querySelector('[data-role="down"]').addEventListener('click', () => moveSection(idx, 1));
      row.querySelector('[data-role="delete"]').addEventListener('click', () => removeSection(idx));

      renderSectionBody(row.querySelector('[data-role="body"]'), sec, idx);
    });
  }

  function renderSectionBody(container, sec, idx) {
    const structured = STRUCTURED_TYPES[sec.type];

    if (structured === 'experience' || structured === 'education') {
      const isExp = structured === 'experience';
      container.innerHTML = (sec.entries || []).map((entry, ei) => `
        <div class="entry-block" data-ei="${ei}">
          <div class="entry-block-head">
            <button type="button" class="section-icon-btn danger" data-role="del-entry">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="section-subrow">
            <input type="text" class="cv-input" data-f="${isExp ? 'title' : 'degree'}" placeholder="${isExp ? t('jobTitle') : t('degree')}" value="${escapeHtml(entry[isExp ? 'title' : 'degree'] || '')}">
            <input type="text" class="cv-input" data-f="${isExp ? 'company' : 'institution'}" placeholder="${isExp ? t('company') : t('institution')}" value="${escapeHtml(entry[isExp ? 'company' : 'institution'] || '')}">
          </div>
          <div class="section-subrow">
            <input type="text" class="cv-input" data-f="location" placeholder="${t('location')}" value="${escapeHtml(entry.location || '')}">
            <input type="month" class="cv-input" data-f="start" title="${t('startDate')}" value="${escapeHtml(entry.start || '')}">
            <input type="month" class="cv-input" data-f="end" title="${t('endDate')}" value="${escapeHtml(entry.end || '')}" ${entry.current ? 'disabled' : ''}>
          </div>
          ${isExp ? `<label class="toggle-row" style="margin-bottom:8px;"><span>${t('currentlyHere')}</span><input type="checkbox" data-f="current" ${entry.current ? 'checked' : ''}><span class="toggle-switch"></span></label>` : ''}
          <textarea class="section-textarea" data-f="description" placeholder="${t('description')}">${escapeHtml(entry.description || '')}</textarea>
        </div>
      `).join('') + `<button type="button" class="btn btn-add" data-role="add-entry">${isExp ? t('addExperience') : t('addEducation')}</button>`;

      container.querySelector('[data-role="add-entry"]').addEventListener('click', () => {
        sec.entries.push({});
        renderSectionsList(); renderPreview(); scheduleSave();
      });
      container.querySelectorAll('.entry-block').forEach((block) => {
        const ei = parseInt(block.getAttribute('data-ei'), 10);
        block.querySelector('[data-role="del-entry"]').addEventListener('click', () => {
          sec.entries.splice(ei, 1);
          renderSectionsList(); renderPreview(); scheduleSave();
        });
        block.querySelectorAll('[data-f]').forEach((input) => {
          const field = input.getAttribute('data-f');
          const evt = input.type === 'checkbox' ? 'change' : 'input';
          input.addEventListener(evt, () => {
            sec.entries[ei][field] = input.type === 'checkbox' ? input.checked : input.value;
            renderPreview(); scheduleSave();
            if (field === 'current') renderSectionsList();
          });
        });
      });

    } else if (structured === 'skills') {
      container.innerHTML = `
        <input type="text" class="cv-input" data-role="skill-input" placeholder="${t('skillPh')}">
        <div class="tag-list">
          ${(sec.entries || []).map((s, si) => `<span class="tag-chip">${escapeHtml(s)}<button type="button" data-si="${si}">×</button></span>`).join('')}
        </div>`;
      const input = container.querySelector('[data-role="skill-input"]');
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value.trim()) {
          e.preventDefault();
          sec.entries.push(input.value.trim());
          input.value = '';
          renderSectionsList(); renderPreview(); scheduleSave();
        }
      });
      container.querySelectorAll('.tag-chip button').forEach((btn) => {
        btn.addEventListener('click', () => {
          sec.entries.splice(parseInt(btn.getAttribute('data-si'), 10), 1);
          renderSectionsList(); renderPreview(); scheduleSave();
        });
      });

    } else if (structured === 'languages') {
      container.innerHTML = (sec.entries || []).map((entry, ei) => `
        <div class="section-subrow" data-ei="${ei}">
          <input type="text" class="cv-input" data-f="language" placeholder="${t('langNamePh')}" value="${escapeHtml(entry.language || '')}">
          <input type="text" class="cv-input" data-f="level" placeholder="${t('langLevelPh')}" value="${escapeHtml(entry.level || '')}">
          <button type="button" class="section-icon-btn danger" data-role="del-entry">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>`).join('') + `<button type="button" class="btn btn-add" data-role="add-entry">${t('addLanguage')}</button>`;
      container.querySelector('[data-role="add-entry"]').addEventListener('click', () => {
        sec.entries.push({});
        renderSectionsList(); renderPreview(); scheduleSave();
      });
      container.querySelectorAll('[data-ei]').forEach((row) => {
        const ei = parseInt(row.getAttribute('data-ei'), 10);
        row.querySelector('[data-role="del-entry"]').addEventListener('click', () => {
          sec.entries.splice(ei, 1);
          renderSectionsList(); renderPreview(); scheduleSave();
        });
        row.querySelectorAll('[data-f]').forEach((input) => {
          const field = input.getAttribute('data-f');
          input.addEventListener('input', () => {
            sec.entries[ei][field] = input.value;
            renderPreview(); scheduleSave();
          });
        });
      });

    } else {
      // generic: subtitle + date + textarea
      container.innerHTML = `
        <div class="section-subrow">
          <input type="text" class="cv-input" data-f="subtitle" placeholder="${t('subtitlePh')}" value="${escapeHtml(sec.subtitle || '')}">
          <input type="text" class="cv-input" data-f="dateInfo" placeholder="${t('datePh')}" value="${escapeHtml(sec.dateInfo || '')}">
        </div>
        <textarea class="section-textarea" data-f="content" placeholder="${t('contentPh')}">${escapeHtml(sec.content || '')}</textarea>`;
      container.querySelectorAll('[data-f]').forEach((input) => {
        const field = input.getAttribute('data-f');
        input.addEventListener('input', () => {
          sec[field] = input.value;
          renderPreview(); scheduleSave();
        });
      });
    }
  }

  /* ================= Live Preview ================= */
  function renderPreview() {
    if (!activeCv) return;
    const p = activeCv.personal;

    els.cvSheet.className = 'cv-sheet template-' + (activeCv.template || 'navy');
    els.cvSidebar.style.setProperty('--sidebar-color', activeCv.sidebarColor || SIDEBAR_COLORS[0]);
    els.cvSheet.style.setProperty('--sidebar-color', activeCv.sidebarColor || SIDEBAR_COLORS[0]);

    if (p.photo) {
      els.cvPreviewPhoto.src = p.photo;
      els.cvPreviewPhoto.hidden = false;
      els.cvPhotoPlaceholder.textContent = '';
    } else {
      els.cvPreviewPhoto.hidden = true;
      els.cvPhotoPlaceholder.textContent = (p.fullName || '').slice(0, 1).toUpperCase();
    }

    els.cvName.textContent = p.fullName || '—';
    els.cvRole.textContent = p.title || '';

    const contactLines = [];
    if (p.phone) contactLines.push(p.phone);
    if (p.email) contactLines.push(p.email);
    if (p.address) contactLines.push(p.address);
    if (p.linkedin) contactLines.push(p.linkedin);
    if (p.website) contactLines.push(p.website);
    if (p.showPassport && p.passport) contactLines.push(p.passport);
    els.cvContact.innerHTML = contactLines.map((l) => `<div>${escapeHtml(l)}</div>`).join('');

    const sidebarSecs = activeCv.sections.filter((s) => SIDEBAR_SECTION_TYPES.includes(s.type));
    const mainSecs = activeCv.sections.filter((s) => !SIDEBAR_SECTION_TYPES.includes(s.type));

    els.cvSidebarSections.innerHTML = sidebarSecs.map((sec) => sectionSidebarHtml(sec)).join('');
    els.cvMainSections.innerHTML = mainSecs.map((sec) => sectionMainHtml(sec)).join('');
  }

  function sectionSidebarHtml(sec) {
    const heading = `<span class="sec-icon">${SECTION_ICONS[sec.type] || ''}</span>${escapeHtml(t('sectionTypes')[sec.type])}`;
    if (sec.type === 'skills') {
      return `<div class="cv-side-section"><h4>${heading}</h4>${(sec.entries || []).map((s) => `<span class="cv-side-tag">${escapeHtml(s)}</span>`).join('')}</div>`;
    }
    if (sec.type === 'languages') {
      return `<div class="cv-side-section"><h4>${heading}</h4>${(sec.entries || []).map((e) => `<p>${escapeHtml(e.language || '')}${e.level ? ' — ' + escapeHtml(e.level) : ''}</p>`).join('')}</div>`;
    }
    return `<div class="cv-side-section"><h4>${heading}</h4><p>${escapeHtml(sec.content || '')}</p></div>`;
  }

  function sectionMainHtml(sec) {
    const heading = `<span class="sec-icon">${SECTION_ICONS[sec.type] || ''}</span>${escapeHtml(t('sectionTypes')[sec.type])}`;
    const structured = STRUCTURED_TYPES[sec.type];
    if (structured === 'experience' || structured === 'education') {
      const isExp = structured === 'experience';
      const entriesHtml = (sec.entries || []).map((e) => {
        const titleLine = isExp
          ? [e.title, e.company].filter(Boolean).join(' — ')
          : [e.degree, e.institution].filter(Boolean).join(' — ');
        const metaLine = [e.location, [formatMonthYear(e.start), e.current ? (I18N[lang].currentlyHere) : formatMonthYear(e.end)].filter(Boolean).join(' - ')].filter(Boolean).join(' · ');
        return `<div class="entry">
          <p class="entry-title">${escapeHtml(titleLine)}</p>
          ${metaLine ? `<p class="entry-meta">${escapeHtml(metaLine)}</p>` : ''}
          ${e.description ? `<p>${escapeHtml(e.description)}</p>` : ''}
        </div>`;
      }).join('');
      return `<div class="cv-block"><h4>${heading}</h4>${entriesHtml}</div>`;
    }
    const metaLine = [sec.subtitle, sec.dateInfo].filter(Boolean).join(' · ');
    return `<div class="cv-block"><h4>${heading}</h4>${metaLine ? `<p class="entry-meta">${escapeHtml(metaLine)}</p>` : ''}${sec.content ? `<p>${escapeHtml(sec.content)}</p>` : ''}</div>`;
  }

  /* ================= PDF Export ================= */
  async function exportPdf() {
    if (!activeCv) return;
    const original = els.downloadPdfText.textContent;
    els.downloadPdfBtn.disabled = true;
    els.downloadPdfText.textContent = '…';
    try {
      const canvas = await html2canvas(els.cvSheet, { scale: 2.5, backgroundColor: '#ffffff', useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let heightLeft = imgHeight, position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`${(activeCv.title || 'CV').replace(/[^\w\- ]/g, '')}.pdf`);
    } catch (e) {
      alert('PDF export failed. Please try again.');
    }
    els.downloadPdfBtn.disabled = false;
    els.downloadPdfText.textContent = original;
  }
  els.downloadPdfBtn.addEventListener('click', exportPdf);

  /* ================= Auth state / Init ================= */
  applyLanguage();

  if (window.fbAuth) {
    window.fbAuth.onAuthStateChanged(async (fbUser) => {
      if (fbUser) {
        currentUser = { uid: fbUser.uid, name: fbUser.displayName || fbUser.email, email: fbUser.email, picture: fbUser.photoURL || null };
        els.userChip.classList.remove('hidden');
        els.userChipName.textContent = currentUser.name;
        await loadCvList();
        renderDashboard();
        showScreen('dashboardScreen');
      } else {
        currentUser = null;
        els.userChip.classList.add('hidden');
        activeCv = null; activeCvId = null;
        showScreen('lockedScreen');
      }
    });
  } else {
    showScreen('lockedScreen');
  }
})();
