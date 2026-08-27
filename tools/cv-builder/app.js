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

  /* ================= DOM refs ================= */
  const $ = (id) => document.getElementById(id);
  const els = {
    htmlRoot: $('htmlRoot'), pageTitleTag: $('pageTitleTag'), topbarTitle: $('topbarTitle'),
    langBtns: document.querySelectorAll('.lang-btn'),
    saveIndicator: $('saveIndicator'),
    userChip: $('userChip'), userChipName: $('userChipName'), logoutBtn: $('logoutBtn'),
    lockedScreen: $('lockedScreen'), dashboardScreen: $('dashboardScreen'), editorScreen: $('editorScreen'),
    lockedTitle: $('lockedTitle'), lockedSub: $('lockedSub'),
    tabLogin: $('tabLogin'), tabSignup: $('tabSignup'),
    authCardForm: $('authCardForm'), authCardError: $('authCardError'),
    acName: $('acName'), acEmail: $('acEmail'), acPassword: $('acPassword'), acSubmitBtn: $('acSubmitBtn'),
    forgotPwBtn: $('forgotPwBtn'), orDivider: $('orDivider'), acGoogleBtn: $('acGoogleBtn'), acGoogleText: $('acGoogleText'),
    dashTitle: $('dashTitle'), newCvBtn: $('newCvBtn'), newCvText: $('newCvText'), cvGrid: $('cvGrid'), dashEmpty: $('dashEmpty'),
    editorBackBtn: $('editorBackBtn'), cvTitleInput: $('cvTitleInput'), downloadPdfBtn: $('downloadPdfBtn'), downloadPdfText: $('downloadPdfText'),
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

  function newCvData(title) {
    return {
      title: title || t('untitled'),
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

    if (activeCv) { renderSectionsList(); renderPreview(); }
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
    [els.lockedScreen, els.dashboardScreen, els.editorScreen].forEach((s) => s.classList.add('hidden'));
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
    els.dashEmpty.classList.toggle('hidden', cvList.length > 0);
    els.cvGrid.innerHTML = cvList.map((cv) => `
      <div class="cv-card" data-id="${cv.id}">
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

    els.cvGrid.querySelectorAll('.cv-card').forEach((card) => {
      const id = card.getAttribute('data-id');
      card.addEventListener('click', (e) => {
        const actBtn = e.target.closest('button');
        if (!actBtn) { openEditor(id); return; }
        e.stopPropagation();
        const act = actBtn.getAttribute('data-act');
        if (act === 'edit') openEditor(id);
        else if (act === 'duplicate') duplicateCv(id);
        else if (act === 'delete') deleteCv(id);
        else if (act === 'pdf') openEditorThenExport(id);
      });
    });
  }

  function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function formatDate(ts) {
    if (!ts) return '—';
    const d = new Date(ts);
    return d.toLocaleDateString(lang === 'ar' ? 'ar' : lang === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  els.newCvBtn.addEventListener('click', async () => {
    if (!currentUser) return;
    const data = newCvData();
    data.owner = currentUser.uid;
    try {
      const ref = await window.fbDb.collection('cvs').add(data);
      cvList.unshift({ id: ref.id, ...data });
      openEditor(ref.id);
    } catch (e) { /* ignore */ }
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
    if (!activeCv.personal) activeCv.personal = newCvData().personal;
    if (!activeCv.sections) activeCv.sections = [];

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
    showSaveIndicator('saving');
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      try {
        await window.fbDb.collection('cvs').doc(activeCvId).set(activeCv, { merge: true });
        showSaveIndicator('saved');
      } catch (e) {
        els.saveIndicator.classList.add('hidden');
      }
    }, 700);
  }
  function showSaveIndicator(state) {
    els.saveIndicator.classList.remove('hidden', 'saving', 'saved');
    els.saveIndicator.classList.add(state);
    els.saveIndicator.textContent = state === 'saving' ? t('saving') : t('saved');
    if (state === 'saved') setTimeout(() => els.saveIndicator.classList.add('hidden'), 2000);
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
            <input type="text" class="cv-input" data-f="start" placeholder="${t('startDate')}" value="${escapeHtml(entry.start || '')}">
            <input type="text" class="cv-input" data-f="end" placeholder="${t('endDate')}" value="${escapeHtml(entry.end || '')}" ${entry.current ? 'disabled' : ''}>
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
    const heading = escapeHtml(t('sectionTypes')[sec.type]);
    if (sec.type === 'skills') {
      return `<div class="cv-side-section"><h4>${heading}</h4>${(sec.entries || []).map((s) => `<span class="cv-side-tag">${escapeHtml(s)}</span>`).join('')}</div>`;
    }
    if (sec.type === 'languages') {
      return `<div class="cv-side-section"><h4>${heading}</h4>${(sec.entries || []).map((e) => `<p>${escapeHtml(e.language || '')}${e.level ? ' — ' + escapeHtml(e.level) : ''}</p>`).join('')}</div>`;
    }
    return `<div class="cv-side-section"><h4>${heading}</h4><p>${escapeHtml(sec.content || '')}</p></div>`;
  }

  function sectionMainHtml(sec) {
    const heading = escapeHtml(t('sectionTypes')[sec.type]);
    const structured = STRUCTURED_TYPES[sec.type];
    if (structured === 'experience' || structured === 'education') {
      const isExp = structured === 'experience';
      const entriesHtml = (sec.entries || []).map((e) => {
        const titleLine = isExp
          ? [e.title, e.company].filter(Boolean).join(' — ')
          : [e.degree, e.institution].filter(Boolean).join(' — ');
        const metaLine = [e.location, [e.start, e.current ? (I18N[lang].currentlyHere) : e.end].filter(Boolean).join(' - ')].filter(Boolean).join(' · ');
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




