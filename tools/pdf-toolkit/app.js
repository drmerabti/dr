/* =====================================================================
   أدوات PDF — أكاديمية مرابطي
   يعمل بالكامل داخل المتصفح (تسجيل الدخول اختياري، لا يُرفع أي ملف لخادم)
===================================================================== */

const $ = (id) => document.getElementById(id);

/* ---------- i18n ---------- */
const STR = {
  ar: {
    dir: 'rtl', title: 'أدوات PDF — أكاديمية مرابطي', back: 'رجوع إلى الأدوات', sidebarTitle: 'أدوات PDF',
    tabs: { word2pdf: 'وورد → PDF', mergepdf: 'دمج PDF', splitpdf: 'تقسيم PDF', pdf2img: 'PDF → صورة', img2pdf: 'صورة → PDF' },
    panelTitle: {
      word2pdf: 'تحويل وورد إلى PDF', mergepdf: 'دمج ملفات PDF', splitpdf: 'تقسيم ملف PDF',
      pdf2img: 'تحويل PDF إلى صور', img2pdf: 'تحويل الصور إلى PDF',
    },
    panelHint: {
      word2pdf: 'اختر ملف Word (‎.docx) وسيتحول إلى PDF بنفس التنسيق تقريبًا.',
      mergepdf: 'ارفع ملفين أو أكثر — رتّبهم بالسحب حسب ترتيب الدمج.',
      splitpdf: 'ارفع ملف PDF واحد، ثم اضغط على الصفحات لتحديد كل مجموعة تصير ملفًا مستقلًا.',
      pdf2img: 'تُحوَّل كل صفحة إلى صورة مستقلة بالصيغة التي تختارها.',
      img2pdf: 'ارفع صورة واحدة أو أكثر — رتّبها بالسحب، كل صورة تصبح صفحة.',
    },
    dzTitle: {
      word2pdf: 'اسحب ملف Word هنا', mergepdf: 'اسحب ملفات PDF هنا', splitpdf: 'اسحب ملف PDF هنا',
      pdf2img: 'اسحب ملف PDF هنا', img2pdf: 'اسحب الصور هنا',
    },
    dzSub: {
      word2pdf: 'أو اضغط للاختيار — صيغة ‎.docx فقط', mergepdf: 'أو اضغط للاختيار — يمكن اختيار أكثر من ملف',
      splitpdf: 'أو اضغط للاختيار — ملف واحد فقط', pdf2img: 'أو اضغط للاختيار — ملف واحد فقط',
      img2pdf: 'أو اضغط للاختيار — JPG أو PNG، أكثر من صورة',
    },
    addMore: 'إضافة المزيد',
    runLabel: {
      word2pdf: 'تحويل إلى PDF', mergepdf: 'دمج الملفات', splitpdf: 'تقسيم الملف',
      pdf2img: 'تحويل إلى صور', img2pdf: 'تحويل إلى PDF',
    },
    working: 'جارٍ المعالجة…',
    selCount: (n) => `${n} صفحة محددة`, clearSel: 'إلغاء التحديد', addGroup: '➕ اجعلها ملفًا مستقلًا',
    groupLabel: (i, pages) => `ملف ${i}: صفحات ${pages}`,
    splitHint: 'حدّد الصفحات بالضغط عليها ثم "اجعلها ملفًا مستقلًا"، أو استخدم خانتَي "من" و"إلى" لملف كبير — كرّر لبقية المجموعات. أي صفحة ما تدخل ضمن أي مجموعة لن تظهر بالنتيجة.',
    splitNeedGroup: 'حدّد الصفحات وكوّن ملفًا واحدًا على الأقل قبل التقسيم.',
    rangeFromLabel: 'من صفحة', rangeToLabel: 'إلى صفحة', addRangeLabel: '➕ إضافة نطاق',
    rangeInvalid: 'أدخل نطاق صفحات صحيح ضمن عدد صفحات الملف.',
    imgFormatLabel: 'صيغة الصورة:', imgQualityLabel: 'الجودة',
    resultOkSingle: 'تم التحويل بنجاح', resultOkMulti: (n) => `تم إنشاء ${n} ملفات بنجاح`,
    downloadFile: 'تنزيل الملف', downloadZip: 'تنزيل الملف المضغوط (ZIP)', preparingZip: 'جارٍ تجهيز الملف المضغوط…',
    resetBtn: 'تحويل ملف آخر',
    errGeneric: 'حدث خطأ أثناء التحويل، تأكد من صحة الملف وحاول مجددًا.',
    footer: '© 2026 د. سفيان مرابطي',
    authModalTitle: 'تسجيل الدخول', authModalSub: 'تسجيل الدخول اختياري — الأدوات تعمل بدونه أيضًا',
    authNameLabel: 'الاسم', authEmailLabel: 'البريد الإلكتروني', authPasswordLabel: 'كلمة المرور',
    authSubmitLogin: 'دخول', authSubmitSignup: 'إنشاء الحساب', authModalTitleSignup: 'إنشاء حساب',
    authOrDivider: 'أو', googleAuthLabel: 'المتابعة عبر Google',
    authSwitchToSignup: 'إنشاء حساب', authSwitchToLogin: 'تسجيل الدخول',
    authNoAccount: 'ليس لديك حساب؟', authHasAccount: 'لديك حساب بالفعل؟',
    authErr: {
      'auth/email-already-in-use': 'هذا البريد مستخدم مسبقًا.', 'auth/invalid-email': 'صيغة البريد غير صحيحة.',
      'auth/weak-password': 'كلمة المرور ضعيفة (6 أحرف على الأقل).', 'auth/wrong-password': 'كلمة المرور غير صحيحة.',
      'auth/user-not-found': 'لا يوجد حساب بهذا البريد.', 'auth/invalid-credential': 'البريد أو كلمة المرور غير صحيحة.',
      'auth/popup-closed-by-user': 'تم إغلاق نافذة الدخول.', default: 'حدث خطأ، حاول مرة أخرى.',
    },
    logout: 'تسجيل الخروج', login: 'تسجيل الدخول',
  },
  en: {
    dir: 'ltr', title: 'PDF Tools — Merabti Academy', back: 'Back to tools', sidebarTitle: 'PDF Tools',
    tabs: { word2pdf: 'Word → PDF', mergepdf: 'Merge PDF', splitpdf: 'Split PDF', pdf2img: 'PDF → Image', img2pdf: 'Image → PDF' },
    panelTitle: {
      word2pdf: 'Convert Word to PDF', mergepdf: 'Merge PDF files', splitpdf: 'Split a PDF file',
      pdf2img: 'Convert PDF to images', img2pdf: 'Convert images to PDF',
    },
    panelHint: {
      word2pdf: 'Pick a Word (.docx) file — it will be converted to PDF with roughly the same formatting.',
      mergepdf: 'Upload two or more files — drag to reorder them before merging.',
      splitpdf: 'Upload a single PDF, then click pages to build each group into its own file.',
      pdf2img: 'Each page becomes a separate image in the format you choose.',
      img2pdf: 'Upload one or more images — drag to reorder, each image becomes a page.',
    },
    dzTitle: {
      word2pdf: 'Drop a Word file here', mergepdf: 'Drop PDF files here', splitpdf: 'Drop a PDF file here',
      pdf2img: 'Drop a PDF file here', img2pdf: 'Drop images here',
    },
    dzSub: {
      word2pdf: 'or click to choose — .docx only', mergepdf: 'or click to choose — multiple files allowed',
      splitpdf: 'or click to choose — one file only', pdf2img: 'or click to choose — one file only',
      img2pdf: 'or click to choose — JPG or PNG, multiple allowed',
    },
    addMore: 'Add more',
    runLabel: {
      word2pdf: 'Convert to PDF', mergepdf: 'Merge files', splitpdf: 'Split file',
      pdf2img: 'Convert to images', img2pdf: 'Convert to PDF',
    },
    working: 'Processing…',
    selCount: (n) => `${n} pages selected`, clearSel: 'Clear selection', addGroup: '➕ Make separate file',
    groupLabel: (i, pages) => `File ${i}: pages ${pages}`,
    splitHint: 'Click pages to select them, then "Make separate file" — or use the "from"/"to" boxes for a large file. Repeat for other groups. Pages not included in any group are dropped from the result.',
    splitNeedGroup: 'Select pages and create at least one file before splitting.',
    rangeFromLabel: 'From page', rangeToLabel: 'To page', addRangeLabel: '➕ Add range',
    rangeInvalid: 'Enter a valid page range within the file\'s page count.',
    imgFormatLabel: 'Image format:', imgQualityLabel: 'Quality',
    resultOkSingle: 'Converted successfully', resultOkMulti: (n) => `${n} files created successfully`,
    downloadFile: 'Download file', downloadZip: 'Download ZIP', preparingZip: 'Preparing ZIP…',
    resetBtn: 'Convert another file',
    errGeneric: 'Something went wrong during conversion. Check the file and try again.',
    footer: '© 2026 Dr. Sofiane Merabti',
    authModalTitle: 'Sign in', authModalSub: 'Signing in is optional — the tools also work without it',
    authNameLabel: 'Name', authEmailLabel: 'Email', authPasswordLabel: 'Password',
    authSubmitLogin: 'Sign in', authSubmitSignup: 'Create account', authModalTitleSignup: 'Create account',
    authOrDivider: 'or', googleAuthLabel: 'Continue with Google',
    authSwitchToSignup: 'Create account', authSwitchToLogin: 'Sign in',
    authNoAccount: "Don't have an account?", authHasAccount: 'Already have an account?',
    authErr: {
      'auth/email-already-in-use': 'This email is already in use.', 'auth/invalid-email': 'Invalid email format.',
      'auth/weak-password': 'Password too weak (min 6 characters).', 'auth/wrong-password': 'Incorrect password.',
      'auth/user-not-found': 'No account found with this email.', 'auth/invalid-credential': 'Incorrect email or password.',
      'auth/popup-closed-by-user': 'Sign-in window was closed.', default: 'Something went wrong, please try again.',
    },
    logout: 'Sign out', login: 'Sign in',
  },
  fr: {
    dir: 'ltr', title: 'Outils PDF — Académie Merabti', back: 'Retour aux outils', sidebarTitle: 'Outils PDF',
    tabs: { word2pdf: 'Word → PDF', mergepdf: 'Fusionner', splitpdf: 'Diviser', pdf2img: 'PDF → Image', img2pdf: 'Image → PDF' },
    panelTitle: {
      word2pdf: 'Convertir Word en PDF', mergepdf: 'Fusionner des PDF', splitpdf: 'Diviser un PDF',
      pdf2img: 'Convertir un PDF en images', img2pdf: 'Convertir des images en PDF',
    },
    panelHint: {
      word2pdf: 'Choisissez un fichier Word (.docx) — il sera converti en PDF avec une mise en forme proche.',
      mergepdf: 'Importez deux fichiers ou plus — glissez pour les réordonner avant fusion.',
      splitpdf: 'Importez un seul PDF, puis cliquez sur les pages pour créer chaque groupe en fichier séparé.',
      pdf2img: 'Chaque page devient une image séparée dans le format choisi.',
      img2pdf: 'Importez une ou plusieurs images — glissez pour réordonner, chaque image devient une page.',
    },
    dzTitle: {
      word2pdf: 'Déposez un fichier Word ici', mergepdf: 'Déposez des fichiers PDF ici', splitpdf: 'Déposez un fichier PDF ici',
      pdf2img: 'Déposez un fichier PDF ici', img2pdf: 'Déposez des images ici',
    },
    dzSub: {
      word2pdf: 'ou cliquez pour choisir — .docx uniquement', mergepdf: 'ou cliquez pour choisir — plusieurs fichiers possibles',
      splitpdf: 'ou cliquez pour choisir — un seul fichier', pdf2img: 'ou cliquez pour choisir — un seul fichier',
      img2pdf: 'ou cliquez pour choisir — JPG ou PNG, plusieurs possibles',
    },
    addMore: 'Ajouter',
    runLabel: {
      word2pdf: 'Convertir en PDF', mergepdf: 'Fusionner', splitpdf: 'Diviser',
      pdf2img: 'Convertir en images', img2pdf: 'Convertir en PDF',
    },
    working: 'Traitement en cours…',
    selCount: (n) => `${n} pages sélectionnées`, clearSel: 'Annuler la sélection', addGroup: '➕ Fichier séparé',
    groupLabel: (i, pages) => `Fichier ${i} : pages ${pages}`,
    splitHint: "Cliquez sur des pages pour les sélectionner, puis « Fichier séparé » — ou utilisez les champs « de »/« à » pour un fichier volumineux. Répétez pour les autres groupes. Les pages non incluses dans un groupe seront exclues du résultat.",
    splitNeedGroup: 'Sélectionnez des pages et créez au moins un fichier avant de diviser.',
    rangeFromLabel: 'De la page', rangeToLabel: 'À la page', addRangeLabel: '➕ Ajouter une plage',
    rangeInvalid: 'Saisissez une plage de pages valide selon le nombre de pages du fichier.',
    imgFormatLabel: "Format d'image :", imgQualityLabel: 'Qualité',
    resultOkSingle: 'Conversion réussie', resultOkMulti: (n) => `${n} fichiers créés avec succès`,
    downloadFile: 'Télécharger le fichier', downloadZip: 'Télécharger le ZIP', preparingZip: 'Préparation du ZIP…',
    resetBtn: 'Convertir un autre fichier',
    errGeneric: 'Une erreur est survenue. Vérifiez le fichier et réessayez.',
    footer: '© 2026 Académie Merabti',
    authModalTitle: 'Connexion', authModalSub: 'La connexion est facultative — les outils fonctionnent aussi sans elle',
    authNameLabel: 'Nom', authEmailLabel: 'E-mail', authPasswordLabel: 'Mot de passe',
    authSubmitLogin: 'Connexion', authSubmitSignup: 'Créer un compte', authModalTitleSignup: 'Créer un compte',
    authOrDivider: 'ou', googleAuthLabel: 'Continuer avec Google',
    authSwitchToSignup: 'Créer un compte', authSwitchToLogin: 'Connexion',
    authNoAccount: 'Pas de compte ?', authHasAccount: 'Déjà un compte ?',
    authErr: {
      'auth/email-already-in-use': 'Cet e-mail est déjà utilisé.', 'auth/invalid-email': "Format d'e-mail invalide.",
      'auth/weak-password': 'Mot de passe trop faible (6 caractères min).', 'auth/wrong-password': 'Mot de passe incorrect.',
      'auth/user-not-found': 'Aucun compte trouvé avec cet e-mail.', 'auth/invalid-credential': 'E-mail ou mot de passe incorrect.',
      'auth/popup-closed-by-user': 'Fenêtre de connexion fermée.', default: 'Une erreur est survenue, réessayez.',
    },
    logout: 'Déconnexion', login: 'Connexion',
  },
};

let lang = localStorage.getItem('site_lang') || 'ar';
let currentUser = null;
let authMode = 'login';
let activeTool = 'word2pdf';

const TOOLS = ['word2pdf', 'mergepdf', 'splitpdf', 'pdf2img', 'img2pdf'];

/* ---------- تطبيق اللغة ---------- */
function applyLanguage(){
  const s = STR[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = s.dir;
  document.title = s.title;

  $('backLabel').textContent = s.back;
  $('sidebarTitle').textContent = s.sidebarTitle;
  $('footerText').textContent = s.footer;

  TOOLS.forEach((id) => {
    const tabLabel = document.querySelector(`.side-btn[data-tool="${id}"] .tab-label`);
    if (tabLabel) tabLabel.textContent = s.tabs[id];
    const panel = document.querySelector(`.panel[data-panel="${id}"]`);
    if (!panel) return;
    panel.querySelector('.panel-title').textContent = s.panelTitle[id];
    panel.querySelector('.panel-hint').textContent = s.panelHint[id];
    const dzTitle = panel.querySelector('.dz-title'); if (dzTitle) dzTitle.textContent = s.dzTitle[id];
    const dzSub = panel.querySelector('.dz-sub'); if (dzSub) dzSub.textContent = s.dzSub[id];
    const runLabel = panel.querySelector('.run-btn-label'); if (runLabel) runLabel.textContent = s.runLabel[id];
    const addMore = panel.querySelector('.add-more-btn'); if (addMore) addMore.textContent = s.addMore;
  });

  $('clearSelBtn').textContent = s.clearSel;
  $('addGroupBtn').textContent = s.addGroup;
  $('splitHint').textContent = s.splitHint;
  $('rangeFromLabel').textContent = s.rangeFromLabel;
  $('rangeToLabel').textContent = s.rangeToLabel;
  $('addRangeBtn').textContent = s.addRangeLabel;

  const imgFormatLabel = document.querySelector('.img-format-label'); if (imgFormatLabel) imgFormatLabel.textContent = s.imgFormatLabel;
  const imgQualityLabel = document.querySelector('.img-quality-label'); if (imgQualityLabel) imgQualityLabel.textContent = s.imgQualityLabel;

  $('authModalTitle').textContent = authMode === 'login' ? s.authModalTitle : s.authModalTitleSignup;
  $('authModalSub').textContent = s.authModalSub;
  $('authNameLabel').textContent = s.authNameLabel;
  $('authEmailLabel').textContent = s.authEmailLabel;
  $('authPasswordLabel').textContent = s.authPasswordLabel;
  $('authSubmitBtn').textContent = authMode === 'login' ? s.authSubmitLogin : s.authSubmitSignup;
  $('authOrDivider').textContent = s.authOrDivider;
  $('googleAuthLabel').textContent = s.googleAuthLabel;
  $('authSwitchText').textContent = authMode === 'login' ? s.authNoAccount : s.authHasAccount;
  $('authSwitchBtn').textContent = authMode === 'login' ? s.authSwitchToSignup : s.authSwitchToLogin;

  $('uiLangSelect').value = lang;
  localStorage.setItem('site_lang', lang);
  renderAuthUI();
  updateSelectionBar();
  renderGroups();
}

/* ---------- تسجيل الدخول (اختياري) ---------- */
function openAuthModal(){ $('authOverlay').classList.remove('hidden'); $('authError').classList.add('hidden'); setAuthMode('login'); }
function closeAuthModal(){ $('authOverlay').classList.add('hidden'); }
function setAuthMode(mode){ authMode = mode; applyLanguage(); $('authNameField').classList.toggle('hidden', mode === 'login'); }

function initAuthModal(){
  $('authCloseBtn').addEventListener('click', closeAuthModal);
  $('authOverlay').addEventListener('click', (e) => { if (e.target === $('authOverlay')) closeAuthModal(); });
  $('authSwitchBtn').addEventListener('click', () => setAuthMode(authMode === 'login' ? 'signup' : 'login'));

  $('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const s = STR[lang];
    const email = $('authEmail').value.trim();
    const password = $('authPassword').value;
    const name = $('authName').value.trim();
    const btn = $('authSubmitBtn');
    btn.disabled = true;
    const original = btn.textContent;
    btn.textContent = '…';
    try {
      if (authMode === 'login'){
        await window.fbAuth.signInWithEmailAndPassword(email, password);
      } else {
        const cred = await window.fbAuth.createUserWithEmailAndPassword(email, password);
        if (name) await cred.user.updateProfile({ displayName: name });
      }
      closeAuthModal();
    } catch(err){
      $('authError').textContent = s.authErr[err.code] || s.authErr.default;
      $('authError').classList.remove('hidden');
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  });

  $('googleAuthBtn').addEventListener('click', async () => {
    const s = STR[lang];
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await window.fbAuth.signInWithPopup(provider);
      closeAuthModal();
    } catch(err){
      if (err.code !== 'auth/popup-closed-by-user'){
        $('authError').textContent = s.authErr[err.code] || s.authErr.default;
        $('authError').classList.remove('hidden');
      }
    }
  });
}

function renderAuthUI(){
  const s = STR[lang];
  const btn = $('authBtn');
  const menu = $('authMenu');
  if (currentUser){
    const initial = (currentUser.name || currentUser.email || '؟')[0].toUpperCase();
    btn.innerHTML = currentUser.picture
      ? `<img class="auth-avatar-img" src="${currentUser.picture}" alt=""><span>${currentUser.name || currentUser.email}</span>`
      : `<span class="auth-avatar">${initial}</span><span>${currentUser.name || currentUser.email}</span>`;
    menu.innerHTML = `<button type="button" class="auth-menu-item" id="logoutBtn">${s.logout}</button>`;
    $('logoutBtn').addEventListener('click', () => window.fbAuth.signOut());
  } else {
    btn.innerHTML = `<span class="auth-avatar">؟</span><span>${s.login}</span>`;
    menu.innerHTML = '';
  }
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

/* ---------- أدوات مساعدة ---------- */
function formatBytes(bytes){
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
function fileBaseName(name){ return name.replace(/\.[^.]+$/, ''); }

function triggerDownloadAnchor(a, blob, filename){
  const url = URL.createObjectURL(blob);
  a.href = url; a.download = filename;
}

function showRunError(panelId, message){
  const el = document.querySelector(`.panel[data-panel="${panelId}"] .result`);
  el.classList.remove('hidden');
  el.innerHTML = `<div class="result-error">${message}</div>`;
}

function showRunSuccess(panelId, outputs, resetFn){
  const s = STR[lang];
  const el = document.querySelector(`.panel[data-panel="${panelId}"] .result`);
  el.classList.remove('hidden');
  el.innerHTML = '';

  const ok = document.createElement('div');
  ok.className = 'result-ok';
  ok.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
    (outputs.length > 1 ? s.resultOkMulti(outputs.length) : s.resultOkSingle);
  el.appendChild(ok);

  const actions = document.createElement('div');
  actions.className = 'result-actions';

  if (outputs.length === 1) {
    const a = document.createElement('a');
    a.className = 'secondary-btn';
    a.textContent = s.downloadFile;
    triggerDownloadAnchor(a, outputs[0].blob, outputs[0].name);
    actions.appendChild(a);
  } else {
    const zipBtn = document.createElement('a');
    zipBtn.className = 'secondary-btn';
    zipBtn.textContent = s.preparingZip;
    actions.appendChild(zipBtn);
    const zip = new JSZip();
    outputs.forEach((o) => zip.file(o.name, o.blob));
    zip.generateAsync({ type: 'blob' }).then((zipBlob) => {
      zipBtn.textContent = s.downloadZip;
      triggerDownloadAnchor(zipBtn, zipBlob, 'output.zip');
    });
  }

  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'secondary-btn';
  resetBtn.textContent = s.resetBtn;
  resetBtn.addEventListener('click', () => { el.classList.add('hidden'); el.innerHTML = ''; resetFn(); });
  actions.appendChild(resetBtn);

  el.appendChild(actions);
}

async function runWithProgress(panelId, runBtn, task){
  const s = STR[lang];
  const label = runBtn.querySelector('.run-btn-label');
  const original = label.textContent;
  const progressWrap = document.querySelector(`.panel[data-panel="${panelId}"] .progress-wrap`);
  runBtn.disabled = true;
  label.textContent = s.working;
  progressWrap.classList.remove('hidden');
  document.querySelector(`.panel[data-panel="${panelId}"] .result`).classList.add('hidden');
  try {
    await task();
  } catch(err){
    showRunError(panelId, (err && err.message) || s.errGeneric);
  } finally {
    progressWrap.classList.add('hidden');
    label.textContent = original;
    runBtn.disabled = false;
  }
}

/* ---------- سحب وإعادة ترتيب البطاقات ---------- */
function wireDragReorder(grid, onReorder){
  let dragEl = null;
  grid.querySelectorAll('.thumb-card').forEach((card) => {
    card.addEventListener('dragstart', () => { dragEl = card; card.classList.add('dragging'); });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
    card.addEventListener('dragover', (e) => e.preventDefault());
    card.addEventListener('drop', (e) => {
      e.preventDefault();
      if (!dragEl || dragEl === card) return;
      const rect = card.getBoundingClientRect();
      const before = (e.clientX - rect.left) > rect.width / 2;
      grid.insertBefore(dragEl, before ? card.nextSibling : card);
      onReorder && onReorder();
    });
  });
}

/* =====================================================================
   وورد → PDF
===================================================================== */
let word2pdfFile = null;
function setupWord2Pdf(){
  const panel = document.querySelector('.panel[data-panel="word2pdf"]');
  const dz = panel.querySelector('.dropzone');
  const input = panel.querySelector('input[type="file"]');
  const grid = panel.querySelector('.thumb-grid');
  const runBtn = panel.querySelector('.run-btn');

  function setFile(f){
    word2pdfFile = f;
    grid.innerHTML = '';
    if (f){
      const card = document.createElement('div');
      card.className = 'thumb-card';
      card.innerHTML = `<div class="thumb-page generic"><div class="word-ic"><svg viewBox="0 0 48 48"><use href="#ic-word2pdf"/></svg></div></div><button class="thumb-del" type="button">×</button><div class="thumb-name">${f.name}</div>`;
      card.querySelector('.thumb-del').addEventListener('click', () => setFile(null));
      grid.appendChild(card);
    }
    runBtn.disabled = !f;
  }

  dz.addEventListener('click', () => input.click());
  dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('dragover'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
  dz.addEventListener('drop', (e) => { e.preventDefault(); dz.classList.remove('dragover'); if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); });
  input.addEventListener('change', () => { if (input.files[0]) setFile(input.files[0]); input.value = ''; });

  runBtn.addEventListener('click', () => runWithProgress('word2pdf', runBtn, async () => {
    const file = word2pdfFile;
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const container = document.createElement('div');
    container.innerHTML = result.value;
    Object.assign(container.style, {
      position: 'absolute', left: '0', top: '0', width: '780px', padding: '36px',
      background: '#ffffff', color: '#1a1a1a', fontFamily: "'Tajawal','Arial',sans-serif",
      lineHeight: '1.7', fontSize: '14px', zIndex: '-1', pointerEvents: 'none',
    });
    document.body.appendChild(container);
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch(e){} }
    try {
      const opt = {
        margin: 10, filename: fileBaseName(file.name) + '.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };
      const worker = html2pdf().set(opt).from(container).toPdf();
      const blob = await worker.output('blob');
      showRunSuccess('word2pdf', [{ blob, name: fileBaseName(file.name) + '.pdf' }], () => setFile(null));
    } finally {
      document.body.removeChild(container);
    }
  }));
}

/* =====================================================================
   دمج PDF
===================================================================== */
let mergeFiles = [];
async function renderPdfFirstPageCanvas(file, scale){
  const bytes = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: scale || 0.5 });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width; canvas.height = viewport.height;
  await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
  return { canvas, numPages: pdf.numPages };
}

function setupMergePdf(){
  const panel = document.querySelector('.panel[data-panel="mergepdf"]');
  const dz = panel.querySelector('.dropzone');
  const input = panel.querySelector('input[type="file"]');
  const grid = panel.querySelector('.thumb-grid');
  const runBtn = panel.querySelector('.run-btn');

  function refreshOrder(){
    mergeFiles = Array.from(grid.querySelectorAll('.thumb-card')).map((c) => mergeFiles[Number(c.dataset.fid)]);
    grid.querySelectorAll('.thumb-card').forEach((c, i) => { c.dataset.fid = i; });
    runBtn.disabled = mergeFiles.length < 2;
  }

  async function addFiles(files){
    for (const f of files){
      if (!f.name.toLowerCase().endsWith('.pdf')) continue;
      try {
        const { canvas, numPages } = await renderPdfFirstPageCanvas(f);
        const idx = mergeFiles.length;
        mergeFiles.push(f);
        const card = document.createElement('div');
        card.className = 'thumb-card';
        card.draggable = true;
        card.dataset.fid = idx;
        card.innerHTML = `<div class="thumb-page"><span class="thumb-pagecount">${numPages}</span></div><button class="thumb-del" type="button">×</button><div class="thumb-name">${f.name}</div>`;
        card.querySelector('.thumb-page').insertBefore(canvas, card.querySelector('.thumb-page').firstChild);
        card.querySelector('.thumb-del').addEventListener('click', () => { card.remove(); refreshOrder(); });
        grid.appendChild(card);
        wireDragReorder(grid, refreshOrder);
      } catch(e){ console.error(e); }
    }
    refreshOrder();
  }

  dz.addEventListener('click', () => input.click());
  dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('dragover'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
  dz.addEventListener('drop', (e) => { e.preventDefault(); dz.classList.remove('dragover'); addFiles(Array.from(e.dataTransfer.files)); });
  input.addEventListener('change', () => { addFiles(Array.from(input.files)); input.value = ''; });

  runBtn.addEventListener('click', () => runWithProgress('mergepdf', runBtn, async () => {
    const { PDFDocument } = PDFLib;
    const mergedPdf = await PDFDocument.create();
    for (const file of mergeFiles) {
      const bytes = await file.arrayBuffer();
      const donor = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = await mergedPdf.copyPages(donor, donor.getPageIndices());
      pages.forEach((p) => mergedPdf.addPage(p));
    }
    const outBytes = await mergedPdf.save();
    showRunSuccess('mergepdf', [{ blob: new Blob([outBytes], { type: 'application/pdf' }), name: 'merged.pdf' }], () => {
      mergeFiles = []; grid.innerHTML = ''; runBtn.disabled = true;
    });
  }));
}

/* =====================================================================
   تقسيم PDF (اختيار صفحات → مجموعات)
===================================================================== */
let splitFile = null;
let splitTotalPages = 0;
let splitSelection = [];
let splitGroups = [];

function updateSelectionBar(){
  const s = STR[lang];
  const bar = $('selectionBar');
  if (!bar) return;
  bar.style.display = splitSelection.length ? 'flex' : 'none';
  $('selCount').textContent = s.selCount(splitSelection.length);
}
function markGroupedPages(){
  document.querySelectorAll('#gridSplitpdf .thumb-page').forEach((el) => {
    el.classList.remove('grouped');
    const badge = el.querySelector('.group-badge');
    if (badge) badge.remove();
  });
  splitGroups.forEach((g, gi) => {
    g.forEach((pageNum) => {
      const el = document.querySelector(`#gridSplitpdf .thumb-page[data-page="${pageNum}"]`);
      if (!el) return;
      el.classList.add('grouped');
      const badge = document.createElement('span');
      badge.className = 'group-badge';
      badge.textContent = gi + 1;
      el.appendChild(badge);
    });
  });
}
function renderGroups(){
  const s = STR[lang];
  const panel = $('groupsPanel');
  if (!panel) return;
  panel.innerHTML = '';
  splitGroups.forEach((g, i) => {
    const row = document.createElement('div');
    row.className = 'group-row';
    row.innerHTML = `<span class="gnum">${i + 1}</span><span class="gpages">${s.groupLabel(i + 1, g.join(', '))}</span><button type="button" class="gdel">×</button>`;
    row.querySelector('.gdel').addEventListener('click', () => { splitGroups.splice(i, 1); renderGroups(); updateSplitRunState(); });
    panel.appendChild(row);
  });
  markGroupedPages();
  updateSplitRunState();
}
function updateSplitRunState(){
  const runBtn = document.querySelector('.panel[data-panel="splitpdf"] .run-btn');
  if (runBtn) runBtn.disabled = splitGroups.length === 0;
}

function setupSplitPdf(){
  const panel = document.querySelector('.panel[data-panel="splitpdf"]');
  const dz = panel.querySelector('.dropzone');
  const input = panel.querySelector('input[type="file"]');
  const grid = panel.querySelector('.thumb-grid');
  const runBtn = panel.querySelector('.run-btn');

  async function loadFile(f){
    splitFile = f; splitSelection = []; splitGroups = [];
    grid.innerHTML = '';
    const bytes = await f.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
    splitTotalPages = pdf.numPages;
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 0.42 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width; canvas.height = viewport.height;
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      const card = document.createElement('div');
      card.className = 'thumb-card';
      card.innerHTML = `<div class="thumb-page selectable" data-page="${i}"><span class="select-check">✓</span><span class="pnum">${i}</span></div><div class="thumb-name"></div>`;
      const pageDiv = card.querySelector('.thumb-page');
      pageDiv.insertBefore(canvas, pageDiv.firstChild);
      pageDiv.addEventListener('click', () => toggleSelect(i, pageDiv));
      grid.appendChild(card);
    }
    updateSelectionBar();
    renderGroups();
  }
  function toggleSelect(pageNum, el){
    const idx = splitSelection.indexOf(pageNum);
    if (idx > -1){ splitSelection.splice(idx, 1); el.classList.remove('selected'); }
    else { splitSelection.push(pageNum); el.classList.add('selected'); }
    updateSelectionBar();
  }

  dz.addEventListener('click', () => input.click());
  dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('dragover'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
  dz.addEventListener('drop', (e) => { e.preventDefault(); dz.classList.remove('dragover'); if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]); });
  input.addEventListener('change', () => { if (input.files[0]) loadFile(input.files[0]); input.value = ''; });

  $('clearSelBtn').addEventListener('click', () => {
    document.querySelectorAll('#gridSplitpdf .thumb-page.selected').forEach((el) => el.classList.remove('selected'));
    splitSelection = []; updateSelectionBar();
  });
  $('addGroupBtn').addEventListener('click', () => {
    if (!splitSelection.length) return;
    splitGroups.push([...splitSelection].sort((a, b) => a - b));
    document.querySelectorAll('#gridSplitpdf .thumb-page.selected').forEach((el) => el.classList.remove('selected'));
    splitSelection = []; updateSelectionBar(); renderGroups();
  });

  $('addRangeBtn').addEventListener('click', () => {
    const s = STR[lang];
    const fromEl = panel.querySelector('.range-from');
    const toEl = panel.querySelector('.range-to');
    let from = parseInt(fromEl.value, 10);
    let to = parseInt(toEl.value, 10);
    if (!from || !to){ showRunError('splitpdf', s.rangeInvalid); return; }
    if (from > to) { const t = from; from = to; to = t; }
    from = Math.max(1, from);
    to = Math.min(splitTotalPages, to);
    if (from > splitTotalPages || to < 1){ showRunError('splitpdf', s.rangeInvalid); return; }
    const pages = [];
    for (let p = from; p <= to; p++) pages.push(p);
    splitGroups.push(pages);
    fromEl.value = ''; toEl.value = '';
    renderGroups();
  });

  runBtn.addEventListener('click', () => runWithProgress('splitpdf', runBtn, async () => {
    const s = STR[lang];
    if (!splitGroups.length) throw new Error(s.splitNeedGroup);
    const { PDFDocument } = PDFLib;
    const bytes = await splitFile.arrayBuffer();
    const srcPdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const base = fileBaseName(splitFile.name);
    const outputs = [];
    for (let gi = 0; gi < splitGroups.length; gi++) {
      const pages = splitGroups[gi];
      const newPdf = await PDFDocument.create();
      const idxs = pages.map((p) => p - 1);
      const copied = await newPdf.copyPages(srcPdf, idxs);
      copied.forEach((p) => newPdf.addPage(p));
      const outBytes = await newPdf.save();
      outputs.push({ blob: new Blob([outBytes], { type: 'application/pdf' }), name: `${base}-part-${gi + 1}.pdf` });
    }
    showRunSuccess('splitpdf', outputs, () => {
      splitFile = null; splitGroups = []; splitSelection = []; grid.innerHTML = '';
      updateSelectionBar(); renderGroups();
    });
  }));
}

/* =====================================================================
   PDF → صورة
===================================================================== */
let pdf2imgFile = null;
function setupPdf2Img(){
  const panel = document.querySelector('.panel[data-panel="pdf2img"]');
  const dz = panel.querySelector('.dropzone');
  const input = panel.querySelector('input[type="file"]');
  const grid = panel.querySelector('.thumb-grid');
  const runBtn = panel.querySelector('.run-btn');
  const formatSel = panel.querySelector('.img-format');
  const qualityRow = panel.querySelector('.img-quality-row');
  const qualityInput = panel.querySelector('.img-quality');
  const qualityVal = panel.querySelector('.img-quality-val');

  formatSel.addEventListener('change', () => { qualityRow.hidden = formatSel.value !== 'jpg'; });
  qualityInput.addEventListener('input', () => { qualityVal.textContent = Math.round(qualityInput.value * 100) + '%'; });

  async function loadFile(f){
    pdf2imgFile = f;
    grid.innerHTML = '';
    const bytes = await f.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 0.5 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width; canvas.height = viewport.height;
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      const card = document.createElement('div');
      card.className = 'thumb-card';
      card.innerHTML = `<div class="thumb-page"><span class="pnum">${i}</span></div><div class="thumb-name"></div>`;
      card.querySelector('.thumb-page').appendChild(canvas);
      grid.appendChild(card);
    }
    runBtn.disabled = false;
  }

  dz.addEventListener('click', () => input.click());
  dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('dragover'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
  dz.addEventListener('drop', (e) => { e.preventDefault(); dz.classList.remove('dragover'); if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]); });
  input.addEventListener('change', () => { if (input.files[0]) loadFile(input.files[0]); input.value = ''; });

  runBtn.addEventListener('click', () => runWithProgress('pdf2img', runBtn, async () => {
    const file = pdf2imgFile;
    const bytes = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
    const format = formatSel.value === 'jpg' ? 'jpg' : 'png';
    const mime = format === 'jpg' ? 'image/jpeg' : 'image/png';
    const quality = parseFloat(qualityInput.value) || 0.85;
    const base = fileBaseName(file.name);
    const outputs = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width; canvas.height = viewport.height;
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      const dataUrl = format === 'jpg' ? canvas.toDataURL(mime, quality) : canvas.toDataURL(mime);
      const blob = await (await fetch(dataUrl)).blob();
      const name = pdf.numPages === 1 ? `${base}.${format}` : `${base}-page-${i}.${format}`;
      outputs.push({ blob, name });
    }
    showRunSuccess('pdf2img', outputs, () => { pdf2imgFile = null; grid.innerHTML = ''; runBtn.disabled = true; });
  }));
}

/* =====================================================================
   صورة → PDF
===================================================================== */
let imgFiles = [];
function setupImg2Pdf(){
  const panel = document.querySelector('.panel[data-panel="img2pdf"]');
  const dz = panel.querySelector('.dropzone');
  const input = panel.querySelector('input[type="file"]');
  const grid = panel.querySelector('.thumb-grid');
  const runBtn = panel.querySelector('.run-btn');

  function refreshOrder(){
    imgFiles = Array.from(grid.querySelectorAll('.thumb-card')).map((c) => imgFiles[Number(c.dataset.fid)]);
    grid.querySelectorAll('.thumb-card').forEach((c, i) => { c.dataset.fid = i; });
    runBtn.disabled = imgFiles.length < 1;
  }

  function addFiles(files){
    files.filter((f) => f.type.startsWith('image/')).forEach((f) => {
      const idx = imgFiles.length;
      imgFiles.push(f);
      const url = URL.createObjectURL(f);
      const card = document.createElement('div');
      card.className = 'thumb-card';
      card.draggable = true;
      card.dataset.fid = idx;
      card.innerHTML = `<div class="thumb-page"></div><button class="thumb-del" type="button">×</button><div class="thumb-name">${f.name}</div>`;
      const img = document.createElement('img'); img.src = url;
      card.querySelector('.thumb-page').insertBefore(img, card.querySelector('.thumb-page').firstChild);
      card.querySelector('.thumb-del').addEventListener('click', () => { card.remove(); refreshOrder(); });
      grid.appendChild(card);
      wireDragReorder(grid, refreshOrder);
    });
    refreshOrder();
  }

  dz.addEventListener('click', () => input.click());
  dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('dragover'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
  dz.addEventListener('drop', (e) => { e.preventDefault(); dz.classList.remove('dragover'); addFiles(Array.from(e.dataTransfer.files)); });
  input.addEventListener('change', () => { addFiles(Array.from(input.files)); input.value = ''; });

  async function normalizeImageToPdfEmbed(pdfDoc, file){
    if (file.type === 'image/png') return pdfDoc.embedPng(await file.arrayBuffer());
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') return pdfDoc.embedJpg(await file.arrayBuffer());
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width; canvas.height = bitmap.height;
    canvas.getContext('2d').drawImage(bitmap, 0, 0);
    const pngBytes = await (await fetch(canvas.toDataURL('image/png'))).arrayBuffer();
    return pdfDoc.embedPng(pngBytes);
  }

  runBtn.addEventListener('click', () => runWithProgress('img2pdf', runBtn, async () => {
    const { PDFDocument } = PDFLib;
    const pdfDoc = await PDFDocument.create();
    for (const file of imgFiles) {
      const img = await normalizeImageToPdfEmbed(pdfDoc, file);
      const { width, height } = img.scale(1);
      const page = pdfDoc.addPage([width, height]);
      page.drawImage(img, { x: 0, y: 0, width, height });
    }
    const outBytes = await pdfDoc.save();
    showRunSuccess('img2pdf', [{ blob: new Blob([outBytes], { type: 'application/pdf' }), name: 'images.pdf' }], () => {
      imgFiles = []; grid.innerHTML = ''; runBtn.disabled = true;
    });
  }));
}

/* ---------- تبديل الأدوات (الشريط الجانبي) ---------- */
function wireSidebar(){
  const buttons = document.querySelectorAll('.side-btn');
  function selectTool(id){
    activeTool = id;
    buttons.forEach((b) => b.classList.toggle('active', b.dataset.tool === id));
    document.querySelectorAll('.panel').forEach((p) => { p.style.display = (p.dataset.panel === id) ? 'flex' : 'none'; });
  }
  buttons.forEach((btn) => btn.addEventListener('click', () => selectTool(btn.dataset.tool)));

  // دعم فتح أداة محددة مباشرة عبر ?tool=word2pdf (تُستخدم من بطاقات tools.html)
  const requested = new URLSearchParams(window.location.search).get('tool');
  selectTool(requested && TOOLS.includes(requested) ? requested : 'word2pdf');
}

/* ---------- تهيئة ---------- */
function init(){
  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  // ربط اختيار اللغة — هذا كان مفقودًا بالنسخة السابقة
  $('uiLangSelect').addEventListener('change', (e) => { lang = e.target.value; applyLanguage(); });

  initAuthModal();
  initAuthMenu();
  wireSidebar();
  setupWord2Pdf();
  setupMergePdf();
  setupSplitPdf();
  setupPdf2Img();
  setupImg2Pdf();

  if (window.fbAuth){
    window.fbAuth.onAuthStateChanged((fbUser) => {
      currentUser = fbUser ? {
        uid: fbUser.uid, name: fbUser.displayName || fbUser.email, email: fbUser.email, picture: fbUser.photoURL || null,
      } : null;
      renderAuthUI();
    });
  }

  applyLanguage();
}

document.addEventListener('DOMContentLoaded', init);
