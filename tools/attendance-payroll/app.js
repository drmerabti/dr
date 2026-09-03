// ============================================================
// app.js — Attendance & Payroll Manager (Phase 1: Departments, Positions, Employees)
// ============================================================

(function () {
  "use strict";

  /* ================= i18n ================= */
  const I18N = {
    ar: {
      dir: 'rtl', pageTitleTag: 'إدارة الحضور والرواتب — أكاديمية مرابطي', topbarTitle: 'إدارة الحضور والرواتب',
      lockedTitle: 'سجّل دخولك لاستخدام إدارة الحضور والرواتب', lockedSub: 'هذه الأداة متاحة للمستخدمين المسجّلين فقط.',
      tabLogin: 'تسجيل الدخول', tabSignup: 'إنشاء حساب', namePh: 'الاسم الكامل', emailPh: 'البريد الإلكتروني', passwordPh: 'كلمة المرور',
      loginBtn: 'تسجيل الدخول', signupBtn: 'إنشاء حساب', googleBtn: 'المتابعة عبر Google',
      sidebarBrand: 'مؤسستي',
      navDepartments: 'المصالح', navPositions: 'المناصب', navEmployees: 'الموظفون', navAttendance: 'الحضور', navPayroll: 'الرواتب',
      deptTitle: 'المصالح', posTitle: 'المناصب', empTitle: 'الموظفون',
      importText: 'استيراد Excel', addDeptText: 'إضافة مصلحة', addPosText: 'إضافة منصب', addEmpText: 'إضافة موظف',
      deptEmptyHint: 'ما فيه مصالح بعد.', posEmptyHint: 'ما فيه مناصب بعد.', empEmptyHint: 'ما فيه موظفون بعد.',
      deptModalTitle: 'إضافة مصلحة', deptModalHint: 'أدخل اسم المصلحة، مثال: مصلحة الموارد البشرية',
      deptNameLabel: 'اسم المصلحة', deptNamePh: 'مصلحة الموارد البشرية',
      deptDescLabel: 'وصف مختصر (اختياري)', deptDescPh: 'تسيير شؤون الموظفين والتوظيف',
      posModalTitle: 'إضافة منصب', posModalHint: 'حدّد اسم المنصب وأجره القاعدي',
      posNameLabel: 'اسم المنصب', posNamePh: 'مهندس دولة',
      posSalaryLabel: 'الأجر القاعدي (دج)', posSalaryPh: '45000',
      empModalTitle: 'إضافة موظف', empModalHint: 'اسم الموظف، ثم اربطه بمصلحة ومنصب',
      empNameLabel: 'اسم الموظف', empNamePh: 'أحمد بن علي',
      empDeptLabel: 'المصلحة', empPosLabel: 'المنصب',
      cancelBtn: 'إلغاء', saveDeptBtn: 'حفظ المصلحة', savePosBtn: 'حفظ المنصب', saveEmpBtn: 'حفظ الموظف',
      confirmDelete: 'هل تريد حذف هذا العنصر نهائيًا؟',
      importModalTitle: 'استيراد من Excel', importDropText: 'اضغط لاختيار ملف Excel', importBtn: 'استيراد',
      importHintDept: 'يجب أن يحتوي الملف على عمودين: "الاسم" و"الوصف" (اختياري).',
      importHintPos: 'يجب أن يحتوي الملف على عمودين: "الاسم" و"الأجر القاعدي".',
      importHintEmp: 'يجب أن يحتوي الملف على 3 أعمدة: "الاسم"، "المصلحة"، "المنصب" (بنفس الأسماء المسجّلة مسبقًا).',
      importSuccess: (n) => `تم استيراد ${n} عنصر بنجاح.`,
      importError: 'حدث خطأ أثناء قراءة الملف، تأكد من الصيغة.',
      needName: 'الرجاء إدخال الاسم.', needSalary: 'الرجاء إدخال أجر قاعدي صحيح.',
      salaryUnit: 'دج', employeesCount: (n) => `${n} موظف`,
      soonAttTitle: 'قسم الحضور — قريبًا', soonAttDesc: 'جدول الحضور الشهري بنظام الفرشاة السريعة قيد الإنشاء بجلسة قادمة.',
      soonPayTitle: 'قسم الرواتب — قريبًا', soonPayDesc: 'حساب الرواتب التلقائي وقانون الضريبة القابل للتعديل قيد الإنشاء بجلسة قادمة.',
    },
    en: {
      dir: 'ltr', pageTitleTag: 'Attendance & Payroll Manager — Merabti Academy', topbarTitle: 'Attendance & Payroll Manager',
      lockedTitle: 'Sign in to use the Attendance & Payroll Manager', lockedSub: 'This tool is available to registered users only.',
      tabLogin: 'Log In', tabSignup: 'Sign Up', namePh: 'Full name', emailPh: 'Email', passwordPh: 'Password',
      loginBtn: 'Log In', signupBtn: 'Sign Up', googleBtn: 'Continue with Google',
      sidebarBrand: 'My organization',
      navDepartments: 'Departments', navPositions: 'Positions', navEmployees: 'Employees', navAttendance: 'Attendance', navPayroll: 'Payroll',
      deptTitle: 'Departments', posTitle: 'Positions', empTitle: 'Employees',
      importText: 'Import Excel', addDeptText: 'Add department', addPosText: 'Add position', addEmpText: 'Add employee',
      deptEmptyHint: 'No departments yet.', posEmptyHint: 'No positions yet.', empEmptyHint: 'No employees yet.',
      deptModalTitle: 'Add department', deptModalHint: 'Enter the department name, e.g. Human Resources',
      deptNameLabel: 'Department name', deptNamePh: 'Human Resources',
      deptDescLabel: 'Short description (optional)', deptDescPh: 'Manages staff affairs and recruitment',
      posModalTitle: 'Add position', posModalHint: 'Set the position name and its base salary',
      posNameLabel: 'Position name', posNamePh: 'State Engineer',
      posSalaryLabel: 'Base salary', posSalaryPh: '45000',
      empModalTitle: 'Add employee', empModalHint: 'Employee name, then link to a department and position',
      empNameLabel: 'Employee name', empNamePh: 'Ahmed Benali',
      empDeptLabel: 'Department', empPosLabel: 'Position',
      cancelBtn: 'Cancel', saveDeptBtn: 'Save department', savePosBtn: 'Save position', saveEmpBtn: 'Save employee',
      confirmDelete: 'Delete this item permanently?',
      importModalTitle: 'Import from Excel', importDropText: 'Click to choose an Excel file', importBtn: 'Import',
      importHintDept: 'The file must have two columns: "Name" and "Description" (optional).',
      importHintPos: 'The file must have two columns: "Name" and "Base salary".',
      importHintEmp: 'The file must have 3 columns: "Name", "Department", "Position" (matching already-registered names).',
      importSuccess: (n) => `${n} item(s) imported successfully.`,
      importError: 'Error reading the file, check the format.',
      needName: 'Please enter a name.', needSalary: 'Please enter a valid base salary.',
      salaryUnit: '', employeesCount: (n) => `${n} employee${n === 1 ? '' : 's'}`,
      soonAttTitle: 'Attendance — coming soon', soonAttDesc: 'The monthly attendance grid with quick-paint mode is being built in an upcoming session.',
      soonPayTitle: 'Payroll — coming soon', soonPayDesc: 'Automatic payroll calculation with editable tax rules is being built in an upcoming session.',
    },
    fr: {
      dir: 'ltr', pageTitleTag: 'Gestion des présences et paie — Académie Merabti', topbarTitle: 'Gestion des présences et paie',
      lockedTitle: 'Connectez-vous pour utiliser la gestion des présences et paie', lockedSub: 'Cet outil est réservé aux utilisateurs inscrits.',
      tabLogin: 'Connexion', tabSignup: 'Inscription', namePh: 'Nom complet', emailPh: 'E-mail', passwordPh: 'Mot de passe',
      loginBtn: 'Connexion', signupBtn: "S'inscrire", googleBtn: 'Continuer avec Google',
      sidebarBrand: 'Mon organisation',
      navDepartments: 'Services', navPositions: 'Postes', navEmployees: 'Employés', navAttendance: 'Présences', navPayroll: 'Paie',
      deptTitle: 'Services', posTitle: 'Postes', empTitle: 'Employés',
      importText: 'Importer Excel', addDeptText: 'Ajouter un service', addPosText: 'Ajouter un poste', addEmpText: 'Ajouter un employé',
      deptEmptyHint: 'Aucun service pour le moment.', posEmptyHint: 'Aucun poste pour le moment.', empEmptyHint: 'Aucun employé pour le moment.',
      deptModalTitle: 'Ajouter un service', deptModalHint: 'Saisissez le nom du service, ex : Ressources Humaines',
      deptNameLabel: 'Nom du service', deptNamePh: 'Ressources Humaines',
      deptDescLabel: 'Description courte (optionnel)', deptDescPh: 'Gère les affaires du personnel et le recrutement',
      posModalTitle: 'Ajouter un poste', posModalHint: 'Définissez le nom du poste et son salaire de base',
      posNameLabel: 'Nom du poste', posNamePh: "Ingénieur d'État",
      posSalaryLabel: 'Salaire de base', posSalaryPh: '45000',
      empModalTitle: 'Ajouter un employé', empModalHint: "Nom de l'employé, puis liez-le à un service et un poste",
      empNameLabel: "Nom de l'employé", empNamePh: 'Ahmed Benali',
      empDeptLabel: 'Service', empPosLabel: 'Poste',
      cancelBtn: 'Annuler', saveDeptBtn: 'Enregistrer le service', savePosBtn: 'Enregistrer le poste', saveEmpBtn: "Enregistrer l'employé",
      confirmDelete: 'Supprimer définitivement cet élément ?',
      importModalTitle: 'Importer depuis Excel', importDropText: 'Cliquez pour choisir un fichier Excel', importBtn: 'Importer',
      importHintDept: 'Le fichier doit contenir deux colonnes : « Nom » et « Description » (optionnel).',
      importHintPos: 'Le fichier doit contenir deux colonnes : « Nom » et « Salaire de base ».',
      importHintEmp: 'Le fichier doit contenir 3 colonnes : « Nom », « Service », « Poste » (correspondant aux noms déjà enregistrés).',
      importSuccess: (n) => `${n} élément(s) importé(s) avec succès.`,
      importError: 'Erreur lors de la lecture du fichier, vérifiez le format.',
      needName: 'Veuillez saisir un nom.', needSalary: 'Veuillez saisir un salaire de base valide.',
      salaryUnit: '', employeesCount: (n) => `${n} employé${n === 1 ? '' : 's'}`,
      soonAttTitle: 'Présences — bientôt disponible', soonAttDesc: 'Le tableau mensuel de présence avec mode peinture rapide est en cours de création lors d\'une prochaine session.',
      soonPayTitle: 'Paie — bientôt disponible', soonPayDesc: 'Le calcul automatique de la paie avec règles fiscales modifiables est en cours de création lors d\'une prochaine session.',
    },
  };

  let lang = localStorage.getItem('ap:lang') || 'ar';
  const t = (key) => I18N[lang][key];

  /* ================= Data ================= */
  let departments = [];
  let positions = [];
  let employees = [];
  let activeSection = 'departments';
  let importTarget = null; // 'departments' | 'positions' | 'employees'
  let importParsedRows = null;

  const DEPT_COLORS = ['#2F5CA8', '#1E8A52', '#7A3FA8', '#C9A227', '#B1345A', '#17879E'];
  function colorForId(id) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    return DEPT_COLORS[hash % DEPT_COLORS.length];
  }

  /* ================= DOM refs ================= */
  const $ = (id) => document.getElementById(id);
  const els = {
    htmlRoot: $('htmlRoot'), pageTitleTag: $('pageTitleTag'), topbarTitle: $('topbarTitle'),
    langBtns: document.querySelectorAll('.lang-btn'),
    loadingScreen: $('loadingScreen'), lockedScreen: $('lockedScreen'), dashboardScreen: $('dashboardScreen'),
    lockedTitle: $('lockedTitle'), lockedSub: $('lockedSub'),
    tabLogin: $('tabLogin'), tabSignup: $('tabSignup'), authCardForm: $('authCardForm'), authCardError: $('authCardError'),
    acName: $('acName'), acEmail: $('acEmail'), acPassword: $('acPassword'), acSubmitBtn: $('acSubmitBtn'), acGoogleBtn: $('acGoogleBtn'),
    sidebarBrand: $('sidebarBrand'), apNav: $('apNav'),
    navDepartments: $('navDepartments'), navPositions: $('navPositions'), navEmployees: $('navEmployees'), navAttendance: $('navAttendance'), navPayroll: $('navPayroll'),
    sectionDepartments: $('sectionDepartments'), sectionPositions: $('sectionPositions'), sectionEmployees: $('sectionEmployees'),
    sectionAttendance: $('sectionAttendance'), sectionPayroll: $('sectionPayroll'),
    deptTitle: $('deptTitle'), posTitle: $('posTitle'), empTitle: $('empTitle'),
    importDeptText: $('importDeptText'), importPosText: $('importPosText'), importEmpText: $('importEmpText'),
    addDeptText: $('addDeptText'), addPosText: $('addPosText'), addEmpText: $('addEmpText'),
    departmentsList: $('departmentsList'), positionsList: $('positionsList'), employeesList: $('employeesList'),
    deptEmptyHint: $('deptEmptyHint'), posEmptyHint: $('posEmptyHint'), empEmptyHint: $('empEmptyHint'),
    importDeptBtn: $('importDeptBtn'), importPosBtn: $('importPosBtn'), importEmpBtn: $('importEmpBtn'),
    addDeptBtn: $('addDeptBtn'), addPosBtn: $('addPosBtn'), addEmpBtn: $('addEmpBtn'),
    deptModalOverlay: $('deptModalOverlay'), deptModalTitle: $('deptModalTitle'), deptModalHint: $('deptModalHint'),
    deptNameLabel: $('deptNameLabel'), deptNameInput: $('deptNameInput'), deptDescLabel: $('deptDescLabel'), deptDescInput: $('deptDescInput'),
    deptCancelBtn: $('deptCancelBtn'), deptSaveBtn: $('deptSaveBtn'),
    posModalOverlay: $('posModalOverlay'), posModalTitle: $('posModalTitle'), posModalHint: $('posModalHint'),
    posNameLabel: $('posNameLabel'), posNameInput: $('posNameInput'), posSalaryLabel: $('posSalaryLabel'), posSalaryInput: $('posSalaryInput'),
    posCancelBtn: $('posCancelBtn'), posSaveBtn: $('posSaveBtn'),
    empModalOverlay: $('empModalOverlay'), empModalTitle: $('empModalTitle'), empModalHint: $('empModalHint'),
    empNameLabel: $('empNameLabel'), empNameInput: $('empNameInput'),
    empDeptLabel: $('empDeptLabel'), empDeptSelect: $('empDeptSelect'), empPosLabel: $('empPosLabel'), empPosSelect: $('empPosSelect'),
    empCancelBtn: $('empCancelBtn'), empSaveBtn: $('empSaveBtn'),
    importModalOverlay: $('importModalOverlay'), importModalTitle: $('importModalTitle'), importModalHint: $('importModalHint'),
    importDropZone: $('importDropZone'), importDropText: $('importDropText'), importFileInput: $('importFileInput'),
    importStatus: $('importStatus'), importCancelBtn: $('importCancelBtn'), importConfirmBtn: $('importConfirmBtn'),
    soonAttTitle: $('attSoonTitle'), soonAttDesc: $('attSoonDesc'), soonPayTitle: $('paySoonTitle'), soonPayDesc: $('paySoonDesc'),
  };

  function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  function showScreen(name) {
    [els.loadingScreen, els.lockedScreen, els.dashboardScreen].forEach((s) => s.classList.add('hidden'));
    els[name].classList.remove('hidden');
  }

  /* ================= Auth ================= */
  const AUTH_ERR = {
    'auth/email-already-in-use': 'هذا البريد مستخدم مسبقًا.', 'auth/invalid-email': 'صيغة البريد غير صحيحة.',
    'auth/weak-password': 'كلمة المرور ضعيفة (6 أحرف على الأقل).', 'auth/wrong-password': 'كلمة المرور غير صحيحة.',
    'auth/user-not-found': 'لا يوجد حساب بهذا البريد.', 'auth/invalid-credential': 'البريد أو كلمة المرور غير صحيحة.',
    'auth/popup-closed-by-user': '', default: 'حدث خطأ، حاول مرة أخرى.',
  };
  function authErrMsg(code) { return AUTH_ERR[code] || AUTH_ERR.default; }
  function showAuthError(msg) { if (!msg) return; els.authCardError.textContent = msg; els.authCardError.classList.remove('hidden'); }
  function updateAuthFormMode(mode) {
    const isLogin = mode === 'login';
    els.tabLogin.classList.toggle('active', isLogin);
    els.tabSignup.classList.toggle('active', !isLogin);
    els.acName.classList.toggle('hidden', isLogin);
    els.acSubmitBtn.textContent = isLogin ? t('loginBtn') : t('signupBtn');
    els.authCardError.classList.add('hidden');
  }
  els.tabLogin.addEventListener('click', () => updateAuthFormMode('login'));
  els.tabSignup.addEventListener('click', () => updateAuthFormMode('signup'));
  els.authCardForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const isLogin = els.tabLogin.classList.contains('active');
    const email = els.acEmail.value.trim(); const password = els.acPassword.value;
    els.acSubmitBtn.disabled = true;
    try {
      if (isLogin) await window.fbAuth.signInWithEmailAndPassword(email, password);
      else {
        const cred = await window.fbAuth.createUserWithEmailAndPassword(email, password);
        if (els.acName.value.trim()) await cred.user.updateProfile({ displayName: els.acName.value.trim() });
      }
    } catch (err) { showAuthError(authErrMsg(err.code)); }
    els.acSubmitBtn.disabled = false;
  });
  els.acGoogleBtn.addEventListener('click', async () => {
    try { await window.fbAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()); }
    catch (err) { showAuthError(authErrMsg(err.code)); }
  });

  /* ================= Firestore ================= */
  function col(name) {
    const user = window.fbAuth && window.fbAuth.currentUser;
    if (!user || !window.firebase || !firebase.firestore) return null;
    return firebase.firestore().collection('users').doc(user.uid).collection(name);
  }

  async function loadAllData() {
    const [dSnap, pSnap, eSnap] = await Promise.all([
      col('departments') ? col('departments').get() : Promise.resolve({ docs: [] }),
      col('positions') ? col('positions').get() : Promise.resolve({ docs: [] }),
      col('employees') ? col('employees').get() : Promise.resolve({ docs: [] }),
    ]);
    departments = dSnap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
    positions = pSnap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
    employees = eSnap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
    renderActiveSection();
  }

  /* ================= Navigation ================= */
  els.apNav.querySelectorAll('.ap-nav-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeSection = btn.getAttribute('data-section');
      els.apNav.querySelectorAll('.ap-nav-item').forEach((b) => b.classList.toggle('active', b === btn));
      [els.sectionDepartments, els.sectionPositions, els.sectionEmployees, els.sectionAttendance, els.sectionPayroll].forEach((s) => s.classList.add('hidden'));
      const map = { departments: els.sectionDepartments, positions: els.sectionPositions, employees: els.sectionEmployees, attendance: els.sectionAttendance, payroll: els.sectionPayroll };
      map[activeSection].classList.remove('hidden');
    });
  });

  function renderActiveSection() {
    renderDepartments();
    renderPositions();
    renderEmployees();
  }

  /* ================= Departments ================= */
  function departmentIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1"/></svg>`;
  }
  function renderDepartments() {
    els.departmentsList.innerHTML = departments.map((d) => {
      const empCount = employees.filter((e) => e.departmentId === d.id).length;
      return `
      <div class="ap-list-card" data-id="${d.id}">
        <div class="ap-list-card-left">
          <span class="ap-list-card-icon" style="background:${colorForId(d.id)};">${departmentIcon()}</span>
          <div>
            <p class="ap-list-card-name">${escapeHtml(d.name)}</p>
            ${d.description ? `<p class="ap-list-card-sub">${escapeHtml(d.description)}</p>` : ''}
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
          <span class="ap-list-card-meta">${t('employeesCount')(empCount)}</span>
          <button type="button" class="ap-list-card-delete" data-action="delete-dept" data-id="${d.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          </button>
        </div>
      </div>`;
    }).join('');
    els.deptEmptyHint.classList.toggle('hidden', departments.length > 0);
    els.departmentsList.querySelectorAll('[data-action="delete-dept"]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm(t('confirmDelete'))) return;
        const c = col('departments'); if (!c) return;
        await c.doc(btn.getAttribute('data-id')).delete();
        departments = departments.filter((d) => d.id !== btn.getAttribute('data-id'));
        renderDepartments();
      });
    });
  }

  function openDeptModal() {
    els.deptNameInput.value = ''; els.deptDescInput.value = '';
    els.deptModalOverlay.classList.remove('hidden');
    els.deptNameInput.focus();
  }
  function closeDeptModal() { els.deptModalOverlay.classList.add('hidden'); }
  els.addDeptBtn.addEventListener('click', openDeptModal);
  els.deptCancelBtn.addEventListener('click', closeDeptModal);
  els.deptModalOverlay.addEventListener('click', (e) => { if (e.target === els.deptModalOverlay) closeDeptModal(); });
  els.deptSaveBtn.addEventListener('click', async () => {
    const name = els.deptNameInput.value.trim();
    if (!name) { alert(t('needName')); return; }
    const c = col('departments'); if (!c) return;
    const docRef = await c.add({ name, description: els.deptDescInput.value.trim() });
    departments.push({ id: docRef.id, name, description: els.deptDescInput.value.trim() });
    renderDepartments();
    closeDeptModal();
  });

  /* ================= Positions ================= */
  function positionIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;
  }
  function renderPositions() {
    els.positionsList.innerHTML = positions.map((p) => `
      <div class="ap-list-card" data-id="${p.id}">
        <div class="ap-list-card-left">
          <span class="ap-list-card-icon" style="background:${colorForId(p.id)};">${positionIcon()}</span>
          <div><p class="ap-list-card-name">${escapeHtml(p.name)}</p></div>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
          <span class="ap-list-card-meta">${Number(p.baseSalary || 0).toLocaleString()} ${t('salaryUnit')}</span>
          <button type="button" class="ap-list-card-delete" data-action="delete-pos" data-id="${p.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          </button>
        </div>
      </div>`).join('');
    els.posEmptyHint.classList.toggle('hidden', positions.length > 0);
    els.positionsList.querySelectorAll('[data-action="delete-pos"]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm(t('confirmDelete'))) return;
        const c = col('positions'); if (!c) return;
        await c.doc(btn.getAttribute('data-id')).delete();
        positions = positions.filter((p) => p.id !== btn.getAttribute('data-id'));
        renderPositions();
      });
    });
  }

  function openPosModal() {
    els.posNameInput.value = ''; els.posSalaryInput.value = '';
    els.posModalOverlay.classList.remove('hidden');
    els.posNameInput.focus();
  }
  function closePosModal() { els.posModalOverlay.classList.add('hidden'); }
  els.addPosBtn.addEventListener('click', openPosModal);
  els.posCancelBtn.addEventListener('click', closePosModal);
  els.posModalOverlay.addEventListener('click', (e) => { if (e.target === els.posModalOverlay) closePosModal(); });
  els.posSaveBtn.addEventListener('click', async () => {
    const name = els.posNameInput.value.trim();
    const salary = parseFloat(els.posSalaryInput.value);
    if (!name) { alert(t('needName')); return; }
    if (isNaN(salary) || salary < 0) { alert(t('needSalary')); return; }
    const c = col('positions'); if (!c) return;
    const docRef = await c.add({ name, baseSalary: salary });
    positions.push({ id: docRef.id, name, baseSalary: salary });
    renderPositions();
    closePosModal();
  });

  /* ================= Employees ================= */
  function employeeIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5"/></svg>`;
  }
  function deptName(id) { const d = departments.find((x) => x.id === id); return d ? d.name : '—'; }
  function posName(id) { const p = positions.find((x) => x.id === id); return p ? p.name : '—'; }

  function renderEmployees() {
    els.employeesList.innerHTML = employees.map((emp) => `
      <div class="ap-list-card" data-id="${emp.id}">
        <div class="ap-list-card-left">
          <span class="ap-list-card-icon" style="background:${colorForId(emp.id)};">${employeeIcon()}</span>
          <div>
            <p class="ap-list-card-name">${escapeHtml(emp.name)}</p>
            <p class="ap-list-card-sub">${escapeHtml(deptName(emp.departmentId))} · ${escapeHtml(posName(emp.positionId))}</p>
          </div>
        </div>
        <button type="button" class="ap-list-card-delete" data-action="delete-emp" data-id="${emp.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
        </button>
      </div>`).join('');
    els.empEmptyHint.classList.toggle('hidden', employees.length > 0);
    els.employeesList.querySelectorAll('[data-action="delete-emp"]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm(t('confirmDelete'))) return;
        const c = col('employees'); if (!c) return;
        await c.doc(btn.getAttribute('data-id')).delete();
        employees = employees.filter((e) => e.id !== btn.getAttribute('data-id'));
        renderEmployees();
        renderDepartments();
      });
    });
  }

  function populateEmpSelects() {
    els.empDeptSelect.innerHTML = departments.map((d) => `<option value="${d.id}">${escapeHtml(d.name)}</option>`).join('');
    els.empPosSelect.innerHTML = positions.map((p) => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join('');
  }

  function openEmpModal() {
    els.empNameInput.value = '';
    populateEmpSelects();
    els.empModalOverlay.classList.remove('hidden');
    els.empNameInput.focus();
  }
  function closeEmpModal() { els.empModalOverlay.classList.add('hidden'); }
  els.addEmpBtn.addEventListener('click', openEmpModal);
  els.empCancelBtn.addEventListener('click', closeEmpModal);
  els.empModalOverlay.addEventListener('click', (e) => { if (e.target === els.empModalOverlay) closeEmpModal(); });
  els.empSaveBtn.addEventListener('click', async () => {
    const name = els.empNameInput.value.trim();
    if (!name) { alert(t('needName')); return; }
    if (!departments.length || !positions.length) { alert(t('needName')); return; }
    const departmentId = els.empDeptSelect.value;
    const positionId = els.empPosSelect.value;
    const c = col('employees'); if (!c) return;
    const docRef = await c.add({ name, departmentId, positionId });
    employees.push({ id: docRef.id, name, departmentId, positionId });
    renderEmployees();
    renderDepartments();
    closeEmpModal();
  });

  /* ================= Excel Import ================= */
  function openImportModal(target) {
    importTarget = target;
    importParsedRows = null;
    els.importFileInput.value = '';
    els.importStatus.textContent = '';
    els.importConfirmBtn.disabled = true;
    const hints = { departments: 'importHintDept', positions: 'importHintPos', employees: 'importHintEmp' };
    els.importModalHint.textContent = t(hints[target]);
    els.importModalOverlay.classList.remove('hidden');
  }
  function closeImportModal() { els.importModalOverlay.classList.add('hidden'); }
  els.importDeptBtn.addEventListener('click', () => openImportModal('departments'));
  els.importPosBtn.addEventListener('click', () => openImportModal('positions'));
  els.importEmpBtn.addEventListener('click', () => openImportModal('employees'));
  els.importCancelBtn.addEventListener('click', closeImportModal);
  els.importModalOverlay.addEventListener('click', (e) => { if (e.target === els.importModalOverlay) closeImportModal(); });
  els.importDropZone.addEventListener('click', () => els.importFileInput.click());

  function normalizeKey(k) { return String(k || '').trim().toLowerCase(); }

  els.importFileInput.addEventListener('change', () => {
    const file = els.importFileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        importParsedRows = rows;
        els.importStatus.textContent = `${rows.length} ${lang === 'ar' ? 'صف جاهز للاستيراد' : lang === 'fr' ? 'ligne(s) prête(s)' : 'row(s) ready'}`;
        els.importConfirmBtn.disabled = rows.length === 0;
      } catch (err) {
        els.importStatus.textContent = t('importError');
        importParsedRows = null;
        els.importConfirmBtn.disabled = true;
      }
    };
    reader.readAsArrayBuffer(file);
  });

  els.importConfirmBtn.addEventListener('click', async () => {
    if (!importParsedRows || !importParsedRows.length) return;
    els.importConfirmBtn.disabled = true;
    try {
      if (importTarget === 'departments') {
        const c = col('departments');
        for (const row of importParsedRows) {
          const keys = Object.keys(row).reduce((acc, k) => { acc[normalizeKey(k)] = row[k]; return acc; }, {});
          const name = String(keys['الاسم'] || keys['name'] || keys['nom'] || '').trim();
          if (!name) continue;
          const description = String(keys['الوصف'] || keys['description'] || '').trim();
          const docRef = await c.add({ name, description });
          departments.push({ id: docRef.id, name, description });
        }
        renderDepartments();
      } else if (importTarget === 'positions') {
        const c = col('positions');
        for (const row of importParsedRows) {
          const keys = Object.keys(row).reduce((acc, k) => { acc[normalizeKey(k)] = row[k]; return acc; }, {});
          const name = String(keys['الاسم'] || keys['name'] || keys['nom'] || '').trim();
          const salary = parseFloat(keys['الأجر القاعدي'] || keys['base salary'] || keys['salaire de base'] || keys['salary'] || 0);
          if (!name) continue;
          const docRef = await c.add({ name, baseSalary: isNaN(salary) ? 0 : salary });
          positions.push({ id: docRef.id, name, baseSalary: isNaN(salary) ? 0 : salary });
        }
        renderPositions();
      } else if (importTarget === 'employees') {
        const c = col('employees');
        for (const row of importParsedRows) {
          const keys = Object.keys(row).reduce((acc, k) => { acc[normalizeKey(k)] = row[k]; return acc; }, {});
          const name = String(keys['الاسم'] || keys['name'] || keys['nom'] || '').trim();
          const deptNameVal = String(keys['المصلحة'] || keys['department'] || keys['service'] || '').trim();
          const posNameVal = String(keys['المنصب'] || keys['position'] || keys['poste'] || '').trim();
          if (!name) continue;
          const dept = departments.find((d) => d.name === deptNameVal);
          const pos = positions.find((p) => p.name === posNameVal);
          const docRef = await c.add({ name, departmentId: dept ? dept.id : '', positionId: pos ? pos.id : '' });
          employees.push({ id: docRef.id, name, departmentId: dept ? dept.id : '', positionId: pos ? pos.id : '' });
        }
        renderEmployees();
        renderDepartments();
      }
      closeImportModal();
    } catch (err) {
      els.importStatus.textContent = t('importError');
    }
    els.importConfirmBtn.disabled = false;
  });

  /* ================= i18n apply ================= */
  function applyLanguage() {
    const dict = I18N[lang];
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dict.dir);
    els.pageTitleTag.textContent = dict.pageTitleTag; document.title = dict.pageTitleTag;
    els.topbarTitle.textContent = dict.topbarTitle;
    els.lockedTitle.textContent = dict.lockedTitle; els.lockedSub.textContent = dict.lockedSub;
    els.tabLogin.textContent = dict.tabLogin; els.tabSignup.textContent = dict.tabSignup;
    els.acName.placeholder = dict.namePh; els.acEmail.placeholder = dict.emailPh; els.acPassword.placeholder = dict.passwordPh;
    els.acGoogleBtn.querySelector('span').textContent = dict.googleBtn;
    els.sidebarBrand.textContent = dict.sidebarBrand;
    els.navDepartments.textContent = dict.navDepartments; els.navPositions.textContent = dict.navPositions;
    els.navEmployees.textContent = dict.navEmployees; els.navAttendance.textContent = dict.navAttendance; els.navPayroll.textContent = dict.navPayroll;
    els.deptTitle.textContent = dict.deptTitle; els.posTitle.textContent = dict.posTitle; els.empTitle.textContent = dict.empTitle;
    els.importDeptText.textContent = dict.importText; els.importPosText.textContent = dict.importText; els.importEmpText.textContent = dict.importText;
    els.addDeptText.textContent = dict.addDeptText; els.addPosText.textContent = dict.addPosText; els.addEmpText.textContent = dict.addEmpText;
    els.deptEmptyHint.textContent = dict.deptEmptyHint; els.posEmptyHint.textContent = dict.posEmptyHint; els.empEmptyHint.textContent = dict.empEmptyHint;

    els.deptModalTitle.textContent = dict.deptModalTitle; els.deptModalHint.textContent = dict.deptModalHint;
    els.deptNameLabel.textContent = dict.deptNameLabel; els.deptNameInput.placeholder = dict.deptNamePh;
    els.deptDescLabel.textContent = dict.deptDescLabel; els.deptDescInput.placeholder = dict.deptDescPh;
    els.deptCancelBtn.textContent = dict.cancelBtn; els.deptSaveBtn.textContent = dict.saveDeptBtn;

    els.posModalTitle.textContent = dict.posModalTitle; els.posModalHint.textContent = dict.posModalHint;
    els.posNameLabel.textContent = dict.posNameLabel; els.posNameInput.placeholder = dict.posNamePh;
    els.posSalaryLabel.textContent = dict.posSalaryLabel; els.posSalaryInput.placeholder = dict.posSalaryPh;
    els.posCancelBtn.textContent = dict.cancelBtn; els.posSaveBtn.textContent = dict.savePosBtn;

    els.empModalTitle.textContent = dict.empModalTitle; els.empModalHint.textContent = dict.empModalHint;
    els.empNameLabel.textContent = dict.empNameLabel; els.empNameInput.placeholder = dict.empNamePh;
    els.empDeptLabel.textContent = dict.empDeptLabel; els.empPosLabel.textContent = dict.empPosLabel;
    els.empCancelBtn.textContent = dict.cancelBtn; els.empSaveBtn.textContent = dict.saveEmpBtn;

    els.importModalTitle.textContent = dict.importModalTitle; els.importDropText.textContent = dict.importDropText;
    els.importCancelBtn.textContent = dict.cancelBtn; els.importConfirmBtn.textContent = dict.importBtn;

    els.soonAttTitle.textContent = dict.soonAttTitle; els.soonAttDesc.textContent = dict.soonAttDesc;
    els.soonPayTitle.textContent = dict.soonPayTitle; els.soonPayDesc.textContent = dict.soonPayDesc;

    els.langBtns.forEach((b) => b.classList.toggle('active', b.getAttribute('data-lang') === lang));
    localStorage.setItem('ap:lang', lang);
    updateAuthFormMode(els.tabLogin.classList.contains('active') ? 'login' : 'signup');
    renderActiveSection();
  }
  els.langBtns.forEach((btn) => btn.addEventListener('click', () => { lang = btn.getAttribute('data-lang'); applyLanguage(); }));

  /* ================= Init ================= */
  applyLanguage();

  if (window.fbAuth) {
    window.fbAuth.onAuthStateChanged(async (fbUser) => {
      if (fbUser) {
        showScreen('dashboardScreen');
        await loadAllData();
      } else {
        showScreen('lockedScreen');
      }
    });
  } else {
    showScreen('lockedScreen');
  }
})();
