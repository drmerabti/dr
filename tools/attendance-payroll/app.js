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
    apNav: $('apNav'),
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
    let dSnap = { docs: [] }, pSnap = { docs: [] }, eSnap = { docs: [] }, piSnap = { docs: [] };
    try {
      [dSnap, pSnap, eSnap, piSnap] = await Promise.all([
        col('departments') ? col('departments').get() : Promise.resolve({ docs: [] }),
        col('positions') ? col('positions').get() : Promise.resolve({ docs: [] }),
        col('employees') ? col('employees').get() : Promise.resolve({ docs: [] }),
        col('payrollItems') ? col('payrollItems').get() : Promise.resolve({ docs: [] }),
      ]);
    } catch (e) {
      console.error('[ap] loadAllData initial fetch failed:', e);
    }
    departments = dSnap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
    positions = pSnap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
    employees = eSnap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
    payItems = piSnap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
    renderActiveSection();

    await loadOrgSettings();
    await ensureDefaultStatuses();
    await loadSalaryLaw();
    populateMonthYearSelects();
    populateDeptFilter();
    renderStatusRow();
    renderPayItemsChips();
    await loadAttendanceForMonth();
    await loadPayrollForMonth();
    await loadAcknowledged();
    renderNotifications();
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
    if (els.attDeptFilter) populateDeptFilter();
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
        if (typeof renderAttendanceTable === 'function') renderAttendanceTable();
        if (typeof renderPayrollTable === 'function') renderPayrollTable();
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
    if (typeof renderAttendanceTable === 'function') renderAttendanceTable();
    if (typeof renderPayrollTable === 'function') renderPayrollTable();
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

  /* ================= Org branding ================= */
  const els2 = {
    orgLogoBox: $('orgLogoBox'), orgLogoImg: $('orgLogoImg'), orgLogoIcon: $('orgLogoIcon'), orgLogoInput: $('orgLogoInput'),
    orgNameInput: $('orgNameInput'),
    attTitle: $('attTitle'), attMonthSelect: $('attMonthSelect'), attYearSelect: $('attYearSelect'), attDeptFilter: $('attDeptFilter'),
    attStatusRow: $('attStatusRow'), addStatusBtn: $('addStatusBtn'), addStatusText: $('addStatusText'),
    eraserChip: $('eraserChip'), eraserText: $('eraserText'),
    notifBellBtn: $('notifBellBtn'), notifBadge: $('notifBadge'), notifPanel: $('notifPanel'),
    notifPanelTitle: $('notifPanelTitle'), notifList: $('notifList'), notifEmpty: $('notifEmpty'),
    attTable: $('attTable'), attEmptyHint: $('attEmptyHint'),
    statusModalOverlay: $('statusModalOverlay'), statusModalTitle: $('statusModalTitle'), statusModalHint: $('statusModalHint'),
    statusNameLabel: $('statusNameLabel'), statusNameInput: $('statusNameInput'),
    statusCodeLabel: $('statusCodeLabel'), statusCodeInput: $('statusCodeInput'),
    statusDeductLabel: $('statusDeductLabel'), statusDeductSelect: $('statusDeductSelect'),
    statusCancelBtn: $('statusCancelBtn'), statusSaveBtn: $('statusSaveBtn'),
    payTitle: $('payTitle'), payMonthSelect: $('payMonthSelect'), payYearSelect: $('payYearSelect'),
    salaryLawBtn: $('salaryLawBtn'), salaryLawBtnText: $('salaryLawBtnText'), printPayrollBtn: $('printPayrollBtn'), printPayrollText: $('printPayrollText'),
    paySummaryCards: $('paySummaryCards'), payItemsLabel: $('payItemsLabel'), payItemsChips: $('payItemsChips'),
    addPayItemBtn: $('addPayItemBtn'), addPayItemText: $('addPayItemText'),
    payTable: $('payTable'), payEmptyHint: $('payEmptyHint'),
    payItemModalOverlay: $('payItemModalOverlay'), payItemModalTitle: $('payItemModalTitle'), payItemModalHint: $('payItemModalHint'),
    payItemNameLabel: $('payItemNameLabel'), payItemNameInput: $('payItemNameInput'),
    payItemTypeLabel: $('payItemTypeLabel'), payItemTypeSelect: $('payItemTypeSelect'),
    payItemAmountLabel: $('payItemAmountLabel'), payItemAmountInput: $('payItemAmountInput'),
    payItemCancelBtn: $('payItemCancelBtn'), payItemSaveBtn: $('payItemSaveBtn'),
    salaryLawModalOverlay: $('salaryLawModalOverlay'), salaryLawModalTitle: $('salaryLawModalTitle'), salaryLawModalHint: $('salaryLawModalHint'),
    cnasLabel: $('cnasLabel'), cnasInput: $('cnasInput'),
    bracketsLabel: $('bracketsLabel'), addBracketBtn: $('addBracketBtn'), addBracketText: $('addBracketText'), bracketsList: $('bracketsList'),
    familyAllowanceLabel: $('familyAllowanceLabel'), familyAllowanceInput: $('familyAllowanceInput'),
    salaryLawCancelBtn: $('salaryLawCancelBtn'), salaryLawSaveBtn: $('salaryLawSaveBtn'),
    empPayDetailOverlay: $('empPayDetailOverlay'), empPayDetailTitle: $('empPayDetailTitle'), empPayDetailBreakdown: $('empPayDetailBreakdown'),
    correctionLabel: $('correctionLabel'), correctionAmountInput: $('correctionAmountInput'), correctionReasonInput: $('correctionReasonInput'),
    empPayDetailCloseBtn: $('empPayDetailCloseBtn'), correctionSaveBtn: $('correctionSaveBtn'),
    downloadTemplateBtn: $('downloadTemplateBtn'), downloadTemplateText: $('downloadTemplateText'),
  };
  Object.assign(els, els2);

  const MONTH_NAMES = {
    ar: ['جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  };

  let orgSettings = { name: 'مؤسستي', logoDataUrl: null };
  let attStatuses = [];
  let payItems = [];
  let salaryLaw = { cnasRate: 9, brackets: [{ from: 0, to: 30000, rate: 0 }, { from: 30001, to: 60000, rate: 20 }, { from: 60001, to: null, rate: 30 }], familyAllowance: 600 };
  let attMonth = new Date().getMonth() + 1;
  let attYear = new Date().getFullYear();
  let payMonth = attMonth;
  let payYear = attYear;
  let armedStatusId = null;
  let isPainting = false;
  let attendanceCache = {};
  let payrollCorrections = {};

  const STATUS_COLORS = ['#1E8A52', '#C9A227', '#2F5CA8', '#7A3FA8', '#B1345A', '#17879E', '#D85A30', '#4A5568'];
  function nextStatusColor() {
    const used = attStatuses.map((s) => s.color);
    return STATUS_COLORS.find((c) => !used.includes(c)) || STATUS_COLORS[attStatuses.length % STATUS_COLORS.length];
  }

  function docKey(empId, y, m) { return `${empId}_${y}-${String(m).padStart(2, '0')}`; }
  function daysInMonth(y, m) { return new Date(y, m, 0).getDate(); }
  function isWeekend(y, m, day) { const dow = new Date(y, m - 1, day).getDay(); return dow === 5 || dow === 6; }

  async function loadOrgSettings() {
    const user = window.fbAuth && window.fbAuth.currentUser;
    if (!user) return;
    try {
      const doc = await firebase.firestore().collection('users').doc(user.uid).collection('settings').doc('org').get();
      if (doc.exists) orgSettings = Object.assign(orgSettings, doc.data());
    } catch (e) { /* ignore */ }
    els.orgNameInput.value = orgSettings.name || 'مؤسستي';
    if (orgSettings.logoDataUrl) { els.orgLogoImg.src = orgSettings.logoDataUrl; els.orgLogoImg.classList.remove('hidden'); els.orgLogoIcon.classList.add('hidden'); }
  }
  async function saveOrgSettings() {
    const user = window.fbAuth && window.fbAuth.currentUser;
    if (!user) return;
    try { await firebase.firestore().collection('users').doc(user.uid).collection('settings').doc('org').set(orgSettings, { merge: true }); } catch (e) { /* ignore */ }
  }
  els.orgNameInput.addEventListener('input', () => { orgSettings.name = els.orgNameInput.value; saveOrgSettings(); });
  els.orgLogoBox.addEventListener('click', () => els.orgLogoInput.click());
  els.orgLogoInput.addEventListener('change', () => {
    const file = els.orgLogoInput.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      orgSettings.logoDataUrl = e.target.result;
      els.orgLogoImg.src = e.target.result; els.orgLogoImg.classList.remove('hidden'); els.orgLogoIcon.classList.add('hidden');
      saveOrgSettings();
    };
    reader.readAsDataURL(file);
  });

  function populateMonthYearSelects() {
    const yearsNow = new Date().getFullYear();
    [els.attMonthSelect, els.payMonthSelect].forEach((sel) => {
      sel.innerHTML = MONTH_NAMES[lang].map((m, i) => `<option value="${i + 1}">${m}</option>`).join('');
    });
    [els.attYearSelect, els.payYearSelect].forEach((sel) => {
      let opts = '';
      for (let y = yearsNow - 5; y <= yearsNow + 1; y++) opts += `<option value="${y}">${y}</option>`;
      sel.innerHTML = opts;
    });
    els.attMonthSelect.value = attMonth; els.attYearSelect.value = attYear;
    els.payMonthSelect.value = payMonth; els.payYearSelect.value = payYear;
  }
  els.attMonthSelect.addEventListener('change', () => { attMonth = parseInt(els.attMonthSelect.value, 10); loadAttendanceForMonth(); });
  els.attYearSelect.addEventListener('change', () => { attYear = parseInt(els.attYearSelect.value, 10); loadAttendanceForMonth(); });
  els.payMonthSelect.addEventListener('change', () => { payMonth = parseInt(els.payMonthSelect.value, 10); loadPayrollForMonth(); });
  els.payYearSelect.addEventListener('change', () => { payYear = parseInt(els.payYearSelect.value, 10); loadPayrollForMonth(); });

  function populateDeptFilter() {
    els.attDeptFilter.innerHTML = `<option value="">${lang === 'ar' ? 'كل المصالح' : lang === 'fr' ? 'Tous les services' : 'All departments'}</option>` +
      departments.map((d) => `<option value="${d.id}">${escapeHtml(d.name)}</option>`).join('');
  }
  els.attDeptFilter.addEventListener('change', renderAttendanceTable);

  const DEFAULT_STATUSES = [
    { name: 'حاضر', code: 'ح', color: '#1E8A52', deductType: 'none' },
    { name: 'مرضية', code: 'م', color: '#C9A227', deductType: 'full' },
    { name: 'سنوية', code: 'س', color: '#2F5CA8', deductType: 'none' },
    { name: 'استرجاع', code: 'ر', color: '#7A3FA8', deductType: 'none' },
    { name: 'غير مبرر', code: 'غ', color: '#B1345A', deductType: 'full' },
  ];
  async function ensureDefaultStatuses() {
    const c = col('attendanceStatuses'); if (!c) return;
    try {
      const snap = await c.get();
      if (snap.empty) {
        for (const s of DEFAULT_STATUSES) {
          const docRef = await c.add(s);
          attStatuses.push(Object.assign({ id: docRef.id }, s));
        }
      } else {
        attStatuses = snap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
      }
    } catch (e) {
      console.error('[ap] ensureDefaultStatuses failed:', e);
      // Fall back to in-memory defaults so the UI still works even if Firestore denies access
      attStatuses = DEFAULT_STATUSES.map((s, i) => Object.assign({ id: 'local-' + i }, s));
    }
  }
  function renderStatusRow() {
    els.attStatusRow.innerHTML = attStatuses.map((s) => `
      <button type="button" class="ap-status-chip ${armedStatusId === s.id ? 'armed' : ''}" data-id="${s.id}"
        style="background:${s.color}22; color:${s.color};">${escapeHtml(s.code)} ${escapeHtml(s.name)}</button>
    `).join('');
    els.attStatusRow.querySelectorAll('.ap-status-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        armedStatusId = armedStatusId === chip.getAttribute('data-id') ? null : chip.getAttribute('data-id');
        renderStatusRow();
        renderEraserChip();
      });
    });
  }
  function renderEraserChip() {
    if (!els.eraserChip) return;
    els.eraserChip.classList.toggle('armed', armedStatusId === 'ERASER');
  }
  if (els.eraserChip) {
    els.eraserChip.addEventListener('click', () => {
      armedStatusId = armedStatusId === 'ERASER' ? null : 'ERASER';
      renderEraserChip();
      renderStatusRow();
    });
  }
  function openStatusModal() {
    els.statusNameInput.value = ''; els.statusCodeInput.value = ''; els.statusDeductSelect.value = 'full';
    els.statusModalOverlay.classList.remove('hidden');
  }
  els.addStatusBtn.addEventListener('click', openStatusModal);
  els.statusCancelBtn.addEventListener('click', () => els.statusModalOverlay.classList.add('hidden'));
  els.statusModalOverlay.addEventListener('click', (e) => { if (e.target === els.statusModalOverlay) els.statusModalOverlay.classList.add('hidden'); });
  els.statusSaveBtn.addEventListener('click', async () => {
    const name = els.statusNameInput.value.trim();
    const code = els.statusCodeInput.value.trim() || name.slice(0, 1);
    if (!name) { alert(t('needName')); return; }
    const c = col('attendanceStatuses'); if (!c) return;
    const status = { name, code, color: nextStatusColor(), deductType: els.statusDeductSelect.value };
    const docRef = await c.add(status);
    attStatuses.push(Object.assign({ id: docRef.id }, status));
    renderStatusRow();
    els.statusModalOverlay.classList.add('hidden');
  });

  async function loadAttendanceForMonth() {
    const c = col('attendance'); if (!c) return;
    attendanceCache = {};
    for (const emp of employees) {
      try {
        const doc = await c.doc(docKey(emp.id, attYear, attMonth)).get();
        attendanceCache[emp.id] = doc.exists ? doc.data() : { days: {} };
      } catch (e) { attendanceCache[emp.id] = { days: {} }; }
    }
    renderAttendanceTable();
  }

  function renderAttendanceTable() {
    const nDays = daysInMonth(attYear, attMonth);
    const deptFilterVal = els.attDeptFilter.value;
    const list = employees.filter((e) => !deptFilterVal || e.departmentId === deptFilterVal);

    let head = `<tr><th></th>`;
    for (let d = 1; d <= nDays; d++) head += `<th class="${isWeekend(attYear, attMonth, d) ? 'weekend' : ''}">${d}</th>`;
    head += `</tr>`;

    let rows = list.map((emp) => {
      const data = attendanceCache[emp.id] || { days: {} };
      let cells = `<td class="emp-name">${escapeHtml(emp.name)}</td>`;
      for (let d = 1; d <= nDays; d++) {
        const statusId = data.days && data.days[d];
        const status = attStatuses.find((s) => s.id === statusId);
        const weekendClass = isWeekend(attYear, attMonth, d) ? 'weekend' : '';
        const cellStyle = status ? `background:${status.color}22; color:${status.color};` : '';
        cells += `<td class="${weekendClass}"><span class="ap-day-cell" data-emp="${emp.id}" data-day="${d}" style="${cellStyle}">${status ? escapeHtml(status.code) : ''}</span></td>`;
      }
      return `<tr>${cells}</tr>`;
    }).join('');

    els.attTable.innerHTML = `<thead>${head}</thead><tbody>${rows}</tbody>`;
    els.attEmptyHint.classList.toggle('hidden', list.length > 0);
    attachDayCellEvents();
  }

  function attachDayCellEvents() {
    let paintValue = null;
    els.attTable.querySelectorAll('.ap-day-cell').forEach((cell) => {
      cell.addEventListener('mousedown', (e) => {
        if (!armedStatusId) return;
        isPainting = true;
        paintValue = armedStatusId;
        applyDayStatus(cell, paintValue);
        e.preventDefault();
      });
      cell.addEventListener('mouseenter', () => {
        if (isPainting && paintValue) applyDayStatus(cell, paintValue);
      });
    });
  }
  document.addEventListener('mouseup', () => { isPainting = false; });

  function applyDayStatus(cell, statusId) {
    const empId = cell.getAttribute('data-emp');
    const day = cell.getAttribute('data-day');
    if (!attendanceCache[empId]) attendanceCache[empId] = { days: {} };
    if (!attendanceCache[empId].days) attendanceCache[empId].days = {};
    if (statusId === 'ERASER') {
      attendanceCache[empId].days[day] = firebase.firestore.FieldValue.delete();
      cell.textContent = '';
      cell.style.background = '';
      cell.style.color = '';
    } else {
      attendanceCache[empId].days[day] = statusId;
      const status = attStatuses.find((s) => s.id === statusId);
      cell.textContent = status ? status.code : '';
      cell.style.background = status ? status.color + '22' : '';
      cell.style.color = status ? status.color : '';
    }
    scheduleAttendanceSave(empId);
  }

  const attSaveTimers = {};
  function scheduleAttendanceSave(empId) {
    if (attSaveTimers[empId]) clearTimeout(attSaveTimers[empId]);
    attSaveTimers[empId] = setTimeout(async () => {
      const c = col('attendance'); if (!c) return;
      try { await c.doc(docKey(empId, attYear, attMonth)).set(attendanceCache[empId], { merge: true }); } catch (e) { /* ignore */ }
    }, 800);
  }

  function renderPayItemsChips() {
    els.payItemsChips.innerHTML = payItems.map((it) => `
      <span class="ap-status-chip" style="background:${it.type === 'addition' ? '#1E8A5222' : '#B1345A22'}; color:${it.type === 'addition' ? '#1E8A52' : '#B1345A'};">
        ${it.type === 'addition' ? '+' : '−'} ${escapeHtml(it.name)} (${Number(it.amount).toLocaleString()})
        <button type="button" data-action="del-item" data-id="${it.id}" style="border:none; background:none; color:inherit; cursor:pointer; padding:0 0 0 4px;">×</button>
      </span>
    `).join('');
    els.payItemsChips.querySelectorAll('[data-action="del-item"]').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const c = col('payrollItems'); if (!c) return;
        await c.doc(btn.getAttribute('data-id')).delete();
        payItems = payItems.filter((it) => it.id !== btn.getAttribute('data-id'));
        renderPayItemsChips();
        renderPayrollTable();
      });
    });
  }
  els.addPayItemBtn.addEventListener('click', () => {
    els.payItemNameInput.value = ''; els.payItemAmountInput.value = ''; els.payItemTypeSelect.value = 'addition';
    els.payItemModalOverlay.classList.remove('hidden');
  });
  els.payItemCancelBtn.addEventListener('click', () => els.payItemModalOverlay.classList.add('hidden'));
  els.payItemModalOverlay.addEventListener('click', (e) => { if (e.target === els.payItemModalOverlay) els.payItemModalOverlay.classList.add('hidden'); });
  els.payItemSaveBtn.addEventListener('click', async () => {
    const name = els.payItemNameInput.value.trim();
    const amount = parseFloat(els.payItemAmountInput.value) || 0;
    if (!name) { alert(t('needName')); return; }
    const c = col('payrollItems'); if (!c) return;
    const item = { name, type: els.payItemTypeSelect.value, amount };
    const docRef = await c.add(item);
    payItems.push(Object.assign({ id: docRef.id }, item));
    renderPayItemsChips();
    renderPayrollTable();
    els.payItemModalOverlay.classList.add('hidden');
  });

  async function loadSalaryLaw() {
    const user = window.fbAuth && window.fbAuth.currentUser;
    if (!user) return;
    try {
      const doc = await firebase.firestore().collection('users').doc(user.uid).collection('settings').doc('salaryLaw').get();
      if (doc.exists) salaryLaw = Object.assign(salaryLaw, doc.data());
    } catch (e) { /* ignore */ }
  }
  async function saveSalaryLaw() {
    const user = window.fbAuth && window.fbAuth.currentUser;
    if (!user) return;
    try { await firebase.firestore().collection('users').doc(user.uid).collection('settings').doc('salaryLaw').set(salaryLaw, { merge: true }); } catch (e) { /* ignore */ }
  }
  function renderBracketsList() {
    els.bracketsList.innerHTML = salaryLaw.brackets.map((b, i) => `
      <div class="ap-bracket-row" data-i="${i}">
        <input type="number" class="bracket-from" value="${b.from}" placeholder="من">
        <input type="number" class="bracket-to" value="${b.to === null ? '' : b.to}" placeholder="إلى">
        <input type="number" class="bracket-rate" value="${b.rate}" placeholder="%">
        <button type="button" class="ap-bracket-remove" data-i="${i}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
        </button>
      </div>`).join('');
    els.bracketsList.querySelectorAll('.bracket-from').forEach((inp) => inp.addEventListener('input', () => { salaryLaw.brackets[+inp.closest('.ap-bracket-row').dataset.i].from = parseFloat(inp.value) || 0; }));
    els.bracketsList.querySelectorAll('.bracket-to').forEach((inp) => inp.addEventListener('input', () => { salaryLaw.brackets[+inp.closest('.ap-bracket-row').dataset.i].to = inp.value === '' ? null : parseFloat(inp.value); }));
    els.bracketsList.querySelectorAll('.bracket-rate').forEach((inp) => inp.addEventListener('input', () => { salaryLaw.brackets[+inp.closest('.ap-bracket-row').dataset.i].rate = parseFloat(inp.value) || 0; }));
    els.bracketsList.querySelectorAll('.ap-bracket-remove').forEach((btn) => btn.addEventListener('click', () => {
      salaryLaw.brackets.splice(parseInt(btn.getAttribute('data-i'), 10), 1);
      renderBracketsList();
    }));
  }
  els.addBracketBtn.addEventListener('click', () => {
    salaryLaw.brackets.push({ from: 0, to: null, rate: 0 });
    renderBracketsList();
  });
  els.salaryLawBtn.addEventListener('click', () => {
    els.cnasInput.value = salaryLaw.cnasRate;
    els.familyAllowanceInput.value = salaryLaw.familyAllowance;
    renderBracketsList();
    els.salaryLawModalOverlay.classList.remove('hidden');
  });
  els.salaryLawCancelBtn.addEventListener('click', () => els.salaryLawModalOverlay.classList.add('hidden'));
  els.salaryLawModalOverlay.addEventListener('click', (e) => { if (e.target === els.salaryLawModalOverlay) els.salaryLawModalOverlay.classList.add('hidden'); });
  els.salaryLawSaveBtn.addEventListener('click', async () => {
    salaryLaw.cnasRate = parseFloat(els.cnasInput.value) || 0;
    salaryLaw.familyAllowance = parseFloat(els.familyAllowanceInput.value) || 0;
    await saveSalaryLaw();
    els.salaryLawModalOverlay.classList.add('hidden');
    renderPayrollTable();
  });

  function computeIRG(taxable) {
    let tax = 0;
    for (const b of salaryLaw.brackets) {
      const upper = b.to === null ? Infinity : b.to;
      if (taxable > b.from) {
        const amountInBracket = Math.min(taxable, upper) - b.from + 1;
        if (amountInBracket > 0) tax += amountInBracket * (b.rate / 100);
      }
    }
    return Math.max(0, tax);
  }

  function computeEmployeePayroll(emp) {
    const pos = positions.find((p) => p.id === emp.positionId);
    const base = pos ? Number(pos.baseSalary) || 0 : 0;
    const dailyRate = base / 30;

    const attData = attendanceCache[emp.id] || { days: {} };
    let absenceDeductionDays = 0;
    Object.values(attData.days || {}).forEach((statusId) => {
      const status = attStatuses.find((s) => s.id === statusId);
      if (!status) return;
      if (status.deductType === 'full') absenceDeductionDays += 1;
      else if (status.deductType === 'half') absenceDeductionDays += 0.5;
    });
    const absenceDeduction = absenceDeductionDays * dailyRate;

    let additions = 0, deductions = 0;
    payItems.forEach((it) => { if (it.type === 'addition') additions += Number(it.amount) || 0; else deductions += Number(it.amount) || 0; });

    const grossBeforeStatutory = base + additions - deductions - absenceDeduction;
    const cnas = grossBeforeStatutory * (salaryLaw.cnasRate / 100);
    const taxable = grossBeforeStatutory - cnas;
    const irg = computeIRG(taxable);

    const correction = payrollCorrections[emp.id];
    const correctionAmount = correction ? Number(correction.amount) || 0 : 0;

    const net = grossBeforeStatutory - cnas - irg + correctionAmount;

    return { base, additions, deductions, absenceDeductionDays, absenceDeduction, cnas, irg, correctionAmount, net };
  }

  async function loadPayrollForMonth() {
    const c = col('payrollCorrections'); if (!c) return;
    payrollCorrections = {};
    for (const emp of employees) {
      try {
        const doc = await c.doc(docKey(emp.id, payYear, payMonth)).get();
        if (doc.exists) payrollCorrections[emp.id] = doc.data();
      } catch (e) { /* ignore */ }
    }
    if (payMonth !== attMonth || payYear !== attYear) {
      const attC = col('attendance');
      if (attC) {
        attendanceCache = {};
        for (const emp of employees) {
          try {
            const doc = await attC.doc(docKey(emp.id, payYear, payMonth)).get();
            attendanceCache[emp.id] = doc.exists ? doc.data() : { days: {} };
          } catch (e) { attendanceCache[emp.id] = { days: {} }; }
        }
      }
    }
    renderPayrollTable();
  }

  function renderPayrollTable() {
    const results = employees.map((emp) => ({ emp, calc: computeEmployeePayroll(emp) }));
    const totalBase = results.reduce((s, r) => s + r.calc.base, 0);
    const totalNet = results.reduce((s, r) => s + r.calc.net, 0);

    els.paySummaryCards.innerHTML = `
      <div class="ap-summary-card">
        <p class="ap-summary-card-label">${lang === 'ar' ? 'عدد الموظفين' : lang === 'fr' ? 'Employés' : 'Employees'}</p>
        <p class="ap-summary-card-value">${employees.length}</p>
      </div>
      <div class="ap-summary-card">
        <p class="ap-summary-card-label">${lang === 'ar' ? 'إجمالي الأجور القاعدية' : lang === 'fr' ? 'Total salaires de base' : 'Total base salaries'}</p>
        <p class="ap-summary-card-value">${totalBase.toLocaleString()}</p>
      </div>
      <div class="ap-summary-card highlight">
        <p class="ap-summary-card-label">${lang === 'ar' ? 'إجمالي الصافي' : lang === 'fr' ? 'Total net' : 'Total net'}</p>
        <p class="ap-summary-card-value">${totalNet.toLocaleString()}</p>
      </div>`;

    const headLabels = lang === 'ar'
      ? ['الموظف', 'الأجر القاعدي', 'أيام الخصم', 'CNAS', 'IRG', 'الصافي']
      : lang === 'fr' ? ['Employé', 'Salaire de base', 'Jours déduits', 'CNAS', 'IRG', 'Net']
      : ['Employee', 'Base salary', 'Deducted days', 'CNAS', 'IRG', 'Net'];

    let head = `<tr>${headLabels.map((h) => `<th>${h}</th>`).join('')}</tr>`;
    let rows = results.map(({ emp, calc }) => `
      <tr data-emp="${emp.id}">
        <td class="emp-name">${escapeHtml(emp.name)}</td>
        <td>${calc.base.toLocaleString()}</td>
        <td>${calc.absenceDeductionDays}</td>
        <td>${calc.cnas.toFixed(0)}</td>
        <td>${calc.irg.toFixed(0)}</td>
        <td class="ap-pay-net">${calc.net.toFixed(0)}</td>
      </tr>`).join('');

    els.payTable.innerHTML = `<thead>${head}</thead><tbody>${rows}</tbody>`;
    els.payEmptyHint.classList.toggle('hidden', employees.length > 0);

    els.payTable.querySelectorAll('tr[data-emp]').forEach((row) => {
      row.addEventListener('click', () => openPayDetail(row.getAttribute('data-emp')));
    });
  }

  function openPayDetail(empId) {
    const emp = employees.find((e) => e.id === empId);
    if (!emp) return;
    const calc = computeEmployeePayroll(emp);
    els.empPayDetailTitle.textContent = emp.name;
    const rows = [
      [lang === 'ar' ? 'الأجر القاعدي' : lang === 'fr' ? 'Salaire de base' : 'Base salary', calc.base],
      [lang === 'ar' ? 'الإضافات' : lang === 'fr' ? 'Ajouts' : 'Additions', calc.additions],
      [lang === 'ar' ? 'الخصومات' : lang === 'fr' ? 'Déductions' : 'Deductions', -calc.deductions],
      [lang === 'ar' ? 'خصم الغياب' : lang === 'fr' ? 'Déduction absences' : 'Absence deduction', -calc.absenceDeduction],
      ['CNAS', -calc.cnas],
      ['IRG', -calc.irg],
      [lang === 'ar' ? 'تعديل يدوي' : lang === 'fr' ? 'Correction manuelle' : 'Manual correction', calc.correctionAmount],
    ];
    els.empPayDetailBreakdown.innerHTML = rows.map(([label, val]) =>
      `<div class="ap-pay-breakdown-row"><span>${label}</span><span>${val.toLocaleString()}</span></div>`
    ).join('') + `<div class="ap-pay-breakdown-row total"><span>${lang === 'ar' ? 'الصافي' : lang === 'fr' ? 'Net' : 'Net'}</span><span>${calc.net.toFixed(0)}</span></div>`;

    const correction = payrollCorrections[empId];
    els.correctionAmountInput.value = correction ? correction.amount : '';
    els.correctionReasonInput.value = correction ? correction.reason : '';
    els.correctionSaveBtn.setAttribute('data-emp', empId);
    els.empPayDetailOverlay.classList.remove('hidden');
  }
  els.empPayDetailCloseBtn.addEventListener('click', () => els.empPayDetailOverlay.classList.add('hidden'));
  els.empPayDetailOverlay.addEventListener('click', (e) => { if (e.target === els.empPayDetailOverlay) els.empPayDetailOverlay.classList.add('hidden'); });
  els.correctionSaveBtn.addEventListener('click', async () => {
    const empId = els.correctionSaveBtn.getAttribute('data-emp');
    const amount = parseFloat(els.correctionAmountInput.value) || 0;
    const reason = els.correctionReasonInput.value.trim();
    const c = col('payrollCorrections'); if (!c) return;
    await c.doc(docKey(empId, payYear, payMonth)).set({ amount, reason }, { merge: true });
    payrollCorrections[empId] = { amount, reason };
    renderPayrollTable();
    els.empPayDetailOverlay.classList.add('hidden');
  });

  els.printPayrollBtn.addEventListener('click', () => { window.print(); });

  /* ================= Notifications ================= */
  let notifAcknowledged = [];
  async function loadAcknowledged() {
    const user = window.fbAuth && window.fbAuth.currentUser;
    if (!user) return;
    try {
      const doc = await firebase.firestore().collection('users').doc(user.uid).collection('settings').doc('notifications').get();
      if (doc.exists) notifAcknowledged = doc.data().acknowledged || [];
    } catch (e) { /* ignore */ }
  }
  async function saveAcknowledged() {
    const user = window.fbAuth && window.fbAuth.currentUser;
    if (!user) return;
    try { await firebase.firestore().collection('users').doc(user.uid).collection('settings').doc('notifications').set({ acknowledged: notifAcknowledged }, { merge: true }); } catch (e) { /* ignore */ }
  }

  function computeNotifications() {
    const list = [];
    const nDays = daysInMonth(attYear, attMonth);
    const monthKey = `${attYear}-${attMonth}`;

    // 1. Repeated absence (+3 deducted days this month)
    employees.forEach((emp) => {
      const data = attendanceCache[emp.id] || { days: {} };
      const absentDays = [];
      Object.keys(data.days || {}).forEach((day) => {
        const statusId = data.days[day];
        const status = attStatuses.find((s) => s.id === statusId);
        if (status && status.deductType !== 'none') absentDays.push(day);
      });
      if (absentDays.length >= 3) {
        list.push({
          key: `absence_${emp.id}_${monthKey}`,
          text: lang === 'ar' ? `${emp.name} غائب ${absentDays.length} أيام هذا الشهر (أيام: ${absentDays.join('، ')})`
            : lang === 'fr' ? `${emp.name} absent ${absentDays.length} jours ce mois (jours : ${absentDays.join(', ')})`
            : `${emp.name} was absent ${absentDays.length} days this month (days: ${absentDays.join(', ')})`,
        });
      }
    });

    // 2. Missing department or position
    employees.forEach((emp) => {
      if (!emp.departmentId || !emp.positionId) {
        list.push({
          key: `missing_${emp.id}`,
          text: lang === 'ar' ? `الموظف ${emp.name} ناقصه مصلحة أو منصب`
            : lang === 'fr' ? `${emp.name} : service ou poste manquant`
            : `${emp.name} is missing a department or position`,
        });
      }
    });

    // 3 & 4. Weird net salary / large manual correction
    employees.forEach((emp) => {
      const calc = computeEmployeePayroll(emp);
      if (calc.net < 0) {
        list.push({
          key: `negnet_${emp.id}_${payYear}-${payMonth}`,
          text: lang === 'ar' ? `صافي راتب ${emp.name} سالب (${calc.net.toFixed(0)}) — راجع الحساب`
            : lang === 'fr' ? `Salaire net négatif pour ${emp.name} (${calc.net.toFixed(0)})`
            : `${emp.name}'s net salary is negative (${calc.net.toFixed(0)})`,
        });
      }
      if (calc.base > 0 && Math.abs(calc.correctionAmount) > calc.base * 0.2) {
        list.push({
          key: `bigcorr_${emp.id}_${payYear}-${payMonth}`,
          text: lang === 'ar' ? `تعديل يدوي كبير على راتب ${emp.name} (${calc.correctionAmount.toFixed(0)})`
            : lang === 'fr' ? `Correction manuelle importante pour ${emp.name} (${calc.correctionAmount.toFixed(0)})`
            : `Large manual correction for ${emp.name} (${calc.correctionAmount.toFixed(0)})`,
        });
      }
    });

    // 5. End of month approaching with incomplete attendance
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === attYear && (today.getMonth() + 1) === attMonth;
    if (isCurrentMonth && (nDays - today.getDate()) <= 3) {
      employees.forEach((emp) => {
        const data = attendanceCache[emp.id] || { days: {} };
        const filled = Object.keys(data.days || {}).length;
        if (filled < today.getDate() - 2) {
          list.push({
            key: `incomplete_${emp.id}_${monthKey}`,
            text: lang === 'ar' ? `جدول حضور ${emp.name} غير مكتمل والشهر يقترب من نهايته`
              : lang === 'fr' ? `Le tableau de présence de ${emp.name} est incomplet, fin de mois proche`
              : `${emp.name}'s attendance sheet is incomplete, month-end approaching`,
          });
        }
      });
    }

    return list.filter((n) => !notifAcknowledged.includes(n.key));
  }

  function renderNotifications() {
    const list = computeNotifications();
    els.notifBadge.textContent = list.length;
    els.notifBadge.classList.toggle('hidden', list.length === 0);
    els.notifList.innerHTML = list.map((n) => `
      <div class="ap-notif-item" data-key="${escapeHtml(n.key)}">
        <p class="ap-notif-item-text">${escapeHtml(n.text)}</p>
        <button type="button" class="ap-notif-ack-btn" data-key="${escapeHtml(n.key)}">${lang === 'ar' ? 'تم الاطلاع' : lang === 'fr' ? 'Vu' : 'Acknowledge'}</button>
      </div>`).join('');
    els.notifEmpty.classList.toggle('hidden', list.length > 0);
    els.notifList.querySelectorAll('.ap-notif-ack-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        notifAcknowledged.push(btn.getAttribute('data-key'));
        await saveAcknowledged();
        renderNotifications();
      });
    });
  }
  els.notifBellBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    els.notifPanel.classList.toggle('hidden');
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.ap-notif-wrap')) els.notifPanel.classList.add('hidden');
  });

  const TEMPLATE_HEADERS = {
    departments: { ar: ['الاسم', 'الوصف'], en: ['Name', 'Description'], fr: ['Nom', 'Description'] },
    positions: { ar: ['الاسم', 'الأجر القاعدي'], en: ['Name', 'Base salary'], fr: ['Nom', 'Salaire de base'] },
    employees: { ar: ['الاسم', 'المصلحة', 'المنصب'], en: ['Name', 'Department', 'Position'], fr: ['Nom', 'Service', 'Poste'] },
  };
  els.downloadTemplateBtn.addEventListener('click', () => {
    if (!importTarget) return;
    const headers = TEMPLATE_HEADERS[importTarget][lang] || TEMPLATE_HEADERS[importTarget].ar;
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, `${importTarget}-template.xlsx`);
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
