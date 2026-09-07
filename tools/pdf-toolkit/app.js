/* =====================================================================
   أدوات PDF — أكاديمية مرابطي
   يعمل بالكامل داخل المتصفح (لا يحتاج تسجيل دخول ولا يرفع أي ملف لخادم)
===================================================================== */

const $ = (id) => document.getElementById(id);

/* ---------- i18n ---------- */
const STR = {
  ar: {
    dir: 'rtl', title: 'أدوات PDF — أكاديمية مرابطي',
    back: 'رجوع إلى الأدوات',
    heroTitle: 'أدوات PDF',
    heroSub: 'تحويل، دمج، وتقسيم ملفات PDF وصور — كل شيء يتم داخل متصفحك دون رفع ملفاتك لأي خادم.',
    tabs: { word2pdf: 'وورد → PDF', mergepdf: 'دمج PDF', splitpdf: 'تقسيم PDF', pdf2img: 'PDF → صورة', img2pdf: 'صورة → PDF' },
    panelTitle: {
      word2pdf: 'تحويل وورد إلى PDF', mergepdf: 'دمج ملفات PDF', splitpdf: 'تقسيم ملف PDF',
      pdf2img: 'تحويل PDF إلى صور', img2pdf: 'تحويل الصور إلى PDF',
    },
    panelHint: {
      word2pdf: 'اختر ملف Word (‎.docx) وسيتحول إلى PDF بنفس التنسيق تقريبًا.',
      mergepdf: 'اختر ملفين أو أكثر، ورتّبهم بالسحب حسب ترتيب الدمج.',
      splitpdf: 'اختر ملف PDF واحد، ثم حدّد طريقة التقسيم.',
      pdf2img: 'تُحوَّل كل صفحة إلى صورة مستقلة بالصيغة التي تختارها.',
      img2pdf: 'اختر صورة واحدة أو أكثر، ورتّبها بالسحب — كل صورة تصبح صفحة.',
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
    runLabel: {
      word2pdf: 'تحويل إلى PDF', mergepdf: 'دمج الملفات', splitpdf: 'تقسيم الملف',
      pdf2img: 'تحويل إلى صور', img2pdf: 'تحويل إلى PDF',
    },
    working: 'جارٍ المعالجة…',
    splitEach: 'كل صفحة في ملف مستقل', splitRange: 'نطاق صفحات محدد', splitRangePh: 'مثال: 1-3,5,7-9',
    zipNote: 'إن نتج أكثر من ملف، سيتم تنزيلهم داخل ملف مضغوط (ZIP).',
    imgFormatLabel: 'صيغة الصورة:', imgQualityLabel: 'الجودة',
    resultOkSingle: 'تم التحويل بنجاح', resultOkMulti: (n) => `تم إنشاء ${n} ملفات بنجاح`,
    downloadFile: 'تنزيل الملف', downloadZip: 'تنزيل الملف المضغوط (ZIP)', preparingZip: 'جارٍ تجهيز الملف المضغوط…',
    resetBtn: 'تحويل ملف آخر',
    errGeneric: 'حدث خطأ أثناء التحويل، تأكد من صحة الملف وحاول مجددًا.',
    errRange: 'الرجاء إدخال نطاق صفحات صحيح، مثل 1-3,5',
    footer: '© 2026 د. سفيان مرابطي',
    authModalTitle: 'تسجيل الدخول', authModalSub: 'تسجيل الدخول اختياري — الأدوات تعمل بدونه أيضًا',
    authNameLabel: 'الاسم', authEmailLabel: 'البريد الإلكتروني', authPasswordLabel: 'كلمة المرور',
    authSubmitLogin: 'دخول', authSubmitSignup: 'إنشاء الحساب',
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
    dir: 'ltr', title: 'PDF Tools — Merabti Academy',
    back: 'Back to tools',
    heroTitle: 'PDF Tools',
    heroSub: 'Convert, merge and split PDF files and images — everything runs in your browser, nothing is uploaded to a server.',
    tabs: { word2pdf: 'Word → PDF', mergepdf: 'Merge PDF', splitpdf: 'Split PDF', pdf2img: 'PDF → Image', img2pdf: 'Image → PDF' },
    panelTitle: {
      word2pdf: 'Convert Word to PDF', mergepdf: 'Merge PDF files', splitpdf: 'Split a PDF file',
      pdf2img: 'Convert PDF to images', img2pdf: 'Convert images to PDF',
    },
    panelHint: {
      word2pdf: 'Pick a Word (.docx) file and it will be converted to PDF with roughly the same formatting.',
      mergepdf: 'Pick two or more files, then drag to reorder them before merging.',
      splitpdf: 'Pick a single PDF file, then choose how to split it.',
      pdf2img: 'Each page becomes a separate image in the format you choose.',
      img2pdf: 'Pick one or more images, drag to reorder — each image becomes a page.',
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
    runLabel: {
      word2pdf: 'Convert to PDF', mergepdf: 'Merge files', splitpdf: 'Split file',
      pdf2img: 'Convert to images', img2pdf: 'Convert to PDF',
    },
    working: 'Processing…',
    splitEach: 'Each page as a separate file', splitRange: 'Custom page range', splitRangePh: 'e.g. 1-3,5,7-9',
    zipNote: 'If more than one file is produced, they will be downloaded as a ZIP.',
    imgFormatLabel: 'Image format:', imgQualityLabel: 'Quality',
    resultOkSingle: 'Converted successfully', resultOkMulti: (n) => `${n} files created successfully`,
    downloadFile: 'Download file', downloadZip: 'Download ZIP', preparingZip: 'Preparing ZIP…',
    resetBtn: 'Convert another file',
    errGeneric: 'Something went wrong during conversion. Check the file and try again.',
    errRange: 'Please enter a valid page range, e.g. 1-3,5',
    footer: '© 2026 Dr. Sofiane Merabti',
    authModalTitle: 'Sign in', authModalSub: 'Signing in is optional — the tools also work without it',
    authNameLabel: 'Name', authEmailLabel: 'Email', authPasswordLabel: 'Password',
    authSubmitLogin: 'Sign in', authSubmitSignup: 'Create account',
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
    dir: 'ltr', title: 'Outils PDF — Académie Merabti',
    back: 'Retour aux outils',
    heroTitle: 'Outils PDF',
    heroSub: "Convertir, fusionner et diviser des PDF et des images — tout se passe dans votre navigateur, rien n'est envoyé à un serveur.",
    tabs: { word2pdf: 'Word → PDF', mergepdf: 'Fusionner', splitpdf: 'Diviser', pdf2img: 'PDF → Image', img2pdf: 'Image → PDF' },
    panelTitle: {
      word2pdf: 'Convertir Word en PDF', mergepdf: 'Fusionner des PDF', splitpdf: 'Diviser un PDF',
      pdf2img: 'Convertir un PDF en images', img2pdf: 'Convertir des images en PDF',
    },
    panelHint: {
      word2pdf: 'Choisissez un fichier Word (.docx), il sera converti en PDF avec une mise en forme proche.',
      mergepdf: 'Choisissez deux fichiers ou plus, puis glissez pour les réordonner avant fusion.',
      splitpdf: 'Choisissez un seul fichier PDF, puis choisissez le mode de division.',
      pdf2img: 'Chaque page devient une image séparée dans le format choisi.',
      img2pdf: 'Choisissez une ou plusieurs images, glissez pour réordonner — chaque image devient une page.',
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
    runLabel: {
      word2pdf: 'Convertir en PDF', mergepdf: 'Fusionner', splitpdf: 'Diviser',
      pdf2img: 'Convertir en images', img2pdf: 'Convertir en PDF',
    },
    working: 'Traitement en cours…',
    splitEach: 'Chaque page dans un fichier séparé', splitRange: 'Plage de pages personnalisée', splitRangePh: 'ex : 1-3,5,7-9',
    zipNote: "Si plusieurs fichiers sont produits, ils seront téléchargés dans un ZIP.",
    imgFormatLabel: "Format d'image :", imgQualityLabel: 'Qualité',
    resultOkSingle: 'Conversion réussie', resultOkMulti: (n) => `${n} fichiers créés avec succès`,
    downloadFile: 'Télécharger le fichier', downloadZip: 'Télécharger le ZIP', preparingZip: 'Préparation du ZIP…',
    resetBtn: 'Convertir un autre fichier',
    errGeneric: 'Une erreur est survenue. Vérifiez le fichier et réessayez.',
    errRange: 'Veuillez saisir une plage de pages valide, ex : 1-3,5',
    footer: '© 2026 Académie Merabti',
    authModalTitle: 'Connexion', authModalSub: 'La connexion est facultative — les outils fonctionnent aussi sans elle',
    authNameLabel: 'Nom', authEmailLabel: 'E-mail', authPasswordLabel: 'Mot de passe',
    authSubmitLogin: 'Connexion', authSubmitSignup: 'Créer un compte',
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

/* ---------- تعريف الأدوات الخمس ---------- */
const TOOLS = [
  { id: 'word2pdf', accept: ['.docx'], multiple: false, minFiles: 1, reorder: false, kind: 'docx', hasOptions: false,
    run: (files) => convertWordToPdf(files) },
  { id: 'mergepdf', accept: ['.pdf'], multiple: true, minFiles: 2, reorder: true, kind: 'pdf', hasOptions: false,
    run: (files) => convertMergePdf(files) },
  { id: 'splitpdf', accept: ['.pdf'], multiple: false, minFiles: 1, reorder: false, kind: 'pdf', hasOptions: true,
    run: (files, opts) => convertSplitPdf(files, opts) },
  { id: 'pdf2img', accept: ['.pdf'], multiple: false, minFiles: 1, reorder: false, kind: 'pdf', hasOptions: true,
    run: (files, opts) => convertPdfToImages(files, opts) },
  { id: 'img2pdf', accept: ['image/png', 'image/jpeg', 'image/webp'], multiple: true, minFiles: 1, reorder: true, kind: 'img', hasOptions: false,
    run: (files) => convertImagesToPdf(files) },
];

/* ---------- تطبيق اللغة على واجهة أدوات PDF ---------- */
function applyLanguage(){
  const s = STR[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = s.dir;
  document.title = s.title;

  $('backLabel').textContent = s.back;
  $('heroTitle').textContent = s.heroTitle;
  $('heroSub').textContent = s.heroSub;
  $('footerText').textContent = s.footer;

  TOOLS.forEach((t) => {
    const tabLabel = document.querySelector(`.tool-switch [data-tool="${t.id}"] .tab-label`);
    if (tabLabel) tabLabel.textContent = s.tabs[t.id];

    const panel = document.querySelector(`.tool-panel[data-panel="${t.id}"]`);
    if (!panel) return;
    panel.querySelector('.panel-title').textContent = s.panelTitle[t.id];
    panel.querySelector('.panel-hint').textContent = s.panelHint[t.id];
    panel.querySelector('.dz-title').textContent = s.dzTitle[t.id];
    panel.querySelector('.dz-sub').textContent = s.dzSub[t.id];
    panel.querySelector('.run-btn-label').textContent = s.runLabel[t.id];
  });

  const splitEachLabel = document.querySelector('#splitOptions .split-each-label');
  const splitRangeLabel = document.querySelector('#splitOptions .split-range-label');
  const splitRangeInput = document.querySelector('#splitOptions .split-range');
  const zipNoteSplit = document.querySelector('#splitOptions .opt-note');
  if (splitEachLabel) splitEachLabel.textContent = s.splitEach;
  if (splitRangeLabel) splitRangeLabel.textContent = s.splitRange;
  if (splitRangeInput) splitRangeInput.placeholder = s.splitRangePh;
  if (zipNoteSplit) zipNoteSplit.textContent = s.zipNote;

  const imgFormatLabel = document.querySelector('#pdf2imgOptions .img-format-label');
  const imgQualityLabel = document.querySelector('#pdf2imgOptions .img-quality-label');
  const zipNoteImg = document.querySelector('#pdf2imgOptions .opt-note');
  if (imgFormatLabel) imgFormatLabel.textContent = s.imgFormatLabel;
  if (imgQualityLabel) imgQualityLabel.textContent = s.imgQualityLabel;
  if (zipNoteImg) zipNoteImg.textContent = s.zipNote;

  $('authModalTitle').textContent = authMode === 'login' ? s.authModalTitle : (lang === 'ar' ? 'إنشاء حساب' : lang === 'fr' ? 'Créer un compte' : 'Create account');
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
}

/* ---------- نافذة تسجيل الدخول (اختياري — منطق مطابق لباقي أدوات الموقع) ---------- */
function openAuthModal(){
  $('authOverlay').classList.remove('hidden');
  $('authError').classList.add('hidden');
  setAuthMode('login');
}
function closeAuthModal(){ $('authOverlay').classList.add('hidden'); }
function setAuthMode(mode){
  authMode = mode;
  applyLanguage();
  $('authNameField').classList.toggle('hidden', mode === 'login');
}

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

/* ---------- منطق التحويل (pdf-lib / pdf.js / mammoth / html2pdf / JSZip) ---------- */
async function convertWordToPdf(files){
  const file = files[0];
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });

  const container = document.createElement('div');
  container.innerHTML = result.value;
  Object.assign(container.style, {
    position: 'fixed', left: '-99999px', top: '0', width: '780px', padding: '36px',
    background: '#ffffff', color: '#1a1a1a', fontFamily: "'Tajawal','Arial',sans-serif",
    lineHeight: '1.7', fontSize: '14px',
  });
  document.body.appendChild(container);
  try {
    const opt = {
      margin: 10, filename: fileBaseName(file.name) + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };
    const worker = html2pdf().set(opt).from(container).toPdf();
    const blob = await worker.output('blob');
    return [{ blob, name: fileBaseName(file.name) + '.pdf' }];
  } finally {
    document.body.removeChild(container);
  }
}

async function convertMergePdf(files){
  const { PDFDocument } = PDFLib;
  const mergedPdf = await PDFDocument.create();
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const donor = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = await mergedPdf.copyPages(donor, donor.getPageIndices());
    pages.forEach((p) => mergedPdf.addPage(p));
  }
  const outBytes = await mergedPdf.save();
  return [{ blob: new Blob([outBytes], { type: 'application/pdf' }), name: 'merged.pdf' }];
}

function parseRangeString(str, totalPages){
  const s = STR[lang];
  const ranges = [];
  const parts = str.split(',').map((x) => x.trim()).filter(Boolean);
  if (!parts.length) throw new Error(s.errRange);
  for (const part of parts) {
    const m = part.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) throw new Error(s.errRange);
    let start = parseInt(m[1], 10) - 1;
    let end = m[2] ? parseInt(m[2], 10) - 1 : start;
    if (start > end) { const t = start; start = end; end = t; }
    start = Math.max(0, start);
    end = Math.min(totalPages - 1, end);
    if (start > totalPages - 1) continue;
    ranges.push([start, end]);
  }
  if (!ranges.length) throw new Error(s.errRange);
  return ranges;
}

async function convertSplitPdf(files, options){
  const { PDFDocument } = PDFLib;
  const file = files[0];
  const bytes = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const totalPages = srcPdf.getPageCount();

  let ranges;
  if (options.splitMode === 'each') {
    ranges = [];
    for (let i = 0; i < totalPages; i++) ranges.push([i, i]);
  } else {
    ranges = parseRangeString(options.splitRange || '', totalPages);
  }

  const base = fileBaseName(file.name);
  const outputs = [];
  for (const [s2, e] of ranges) {
    const newPdf = await PDFDocument.create();
    const idxs = [];
    for (let p = s2; p <= e; p++) idxs.push(p);
    const pages = await newPdf.copyPages(srcPdf, idxs);
    pages.forEach((p) => newPdf.addPage(p));
    const outBytes = await newPdf.save();
    const label = s2 === e ? `page-${s2 + 1}` : `pages-${s2 + 1}-${e + 1}`;
    outputs.push({ blob: new Blob([outBytes], { type: 'application/pdf' }), name: `${base}-${label}.pdf` });
  }
  return outputs;
}

async function convertPdfToImages(files, options){
  const file = files[0];
  const bytes = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
  const format = options.imgFormat === 'jpg' ? 'jpg' : 'png';
  const mime = format === 'jpg' ? 'image/jpeg' : 'image/png';
  const quality = options.imgQuality || 0.85;
  const base = fileBaseName(file.name);
  const outputs = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport }).promise;
    const dataUrl = format === 'jpg' ? canvas.toDataURL(mime, quality) : canvas.toDataURL(mime);
    const blob = await (await fetch(dataUrl)).blob();
    const name = pdf.numPages === 1 ? `${base}.${format}` : `${base}-page-${i}.${format}`;
    outputs.push({ blob, name });
  }
  return outputs;
}

async function normalizeImageToPdfEmbed(pdfDoc, file){
  if (file.type === 'image/png') return pdfDoc.embedPng(await file.arrayBuffer());
  if (file.type === 'image/jpeg' || file.type === 'image/jpg') return pdfDoc.embedJpg(await file.arrayBuffer());
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext('2d').drawImage(bitmap, 0, 0);
  const pngBytes = await (await fetch(canvas.toDataURL('image/png'))).arrayBuffer();
  return pdfDoc.embedPng(pngBytes);
}

async function convertImagesToPdf(files){
  const { PDFDocument } = PDFLib;
  const pdfDoc = await PDFDocument.create();
  for (const file of files) {
    const img = await normalizeImageToPdfEmbed(pdfDoc, file);
    const { width, height } = img.scale(1);
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(img, { x: 0, y: 0, width, height });
  }
  const outBytes = await pdfDoc.save();
  return [{ blob: new Blob([outBytes], { type: 'application/pdf' }), name: 'images.pdf' }];
}

/* ---------- ربط كل لوحة أداة بالواجهة ---------- */
function iconFor(kind){
  if (kind === 'pdf') return '<svg viewBox="0 0 24 24"><rect x="3" y="2" width="18" height="20" rx="2" fill="#C0392B"/><text x="12" y="15" font-size="7" font-weight="800" fill="#fff" text-anchor="middle" font-family="Inter,sans-serif">PDF</text></svg>';
  if (kind === 'docx') return '<svg viewBox="0 0 24 24"><rect x="3" y="2" width="18" height="20" rx="2" fill="#2F5770"/><text x="12" y="15" font-size="6.5" font-weight="800" fill="#fff" text-anchor="middle" font-family="Inter,sans-serif">DOC</text></svg>';
  return '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" fill="#64768A"/><circle cx="8.5" cy="9" r="1.6" fill="#fff"/><path d="M4 18l5-5.5 3.5 4L17 12l3 6z" fill="#fff" opacity=".9"/></svg>';
}

function setupPanel(config){
  const panel = document.querySelector(`.tool-panel[data-panel="${config.id}"]`);
  const dropzone = panel.querySelector('.dropzone');
  const input = panel.querySelector('input[type="file"]');
  const listEl = panel.querySelector('.file-list');
  const runBtn = panel.querySelector('.run-btn');
  const progressWrap = panel.querySelector('.progress-wrap');
  const resultEl = panel.querySelector('.result');

  let files = [];

  function acceptsFile(file){
    return config.accept.some((rule) => rule.startsWith('.') ? file.name.toLowerCase().endsWith(rule) : file.type === rule);
  }

  function renderList(){
    listEl.innerHTML = '';
    files.forEach((file, idx) => {
      const li = document.createElement('li');
      li.className = 'file-item';
      li.draggable = config.reorder;
      li.dataset.idx = idx;
      li.innerHTML =
        (config.reorder ? '<span class="drag-handle">⠿</span>' : '') +
        `<span class="file-icon" style="width:20px;height:20px;flex:none;">${iconFor(config.kind)}</span>` +
        `<span class="file-name">${file.name}</span>` +
        `<span class="file-size">${formatBytes(file.size)}</span>` +
        '<button type="button" class="file-remove" aria-label="remove">×</button>';
      li.querySelector('.file-remove').addEventListener('click', () => {
        files.splice(idx, 1);
        renderList();
        updateRunState();
      });
      listEl.appendChild(li);
    });
    if (config.reorder) wireReorder();
  }

  function wireReorder(){
    let dragIdx = null;
    listEl.querySelectorAll('.file-item').forEach((li) => {
      li.addEventListener('dragstart', () => { dragIdx = Number(li.dataset.idx); li.classList.add('dragging'); });
      li.addEventListener('dragend', () => li.classList.remove('dragging'));
      li.addEventListener('dragover', (e) => e.preventDefault());
      li.addEventListener('drop', (e) => {
        e.preventDefault();
        const dropIdx = Number(li.dataset.idx);
        if (dragIdx === null || dragIdx === dropIdx) return;
        const moved = files.splice(dragIdx, 1)[0];
        files.splice(dropIdx, 0, moved);
        renderList();
      });
    });
  }

  function addFiles(fileListLike){
    const incoming = Array.from(fileListLike).filter(acceptsFile);
    if (!incoming.length) return;
    files = config.multiple ? files.concat(incoming) : [incoming[0]];
    renderList();
    updateRunState();
    resultEl.classList.add('hidden');
    resultEl.innerHTML = '';
  }

  dropzone.addEventListener('click', () => input.click());
  dropzone.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
  dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
  dropzone.addEventListener('drop', (e) => { e.preventDefault(); dropzone.classList.remove('dragover'); addFiles(e.dataTransfer.files); });
  input.addEventListener('change', () => { addFiles(input.files); input.value = ''; });

  function gatherOptions(){
    if (config.id === 'splitpdf') {
      const mode = panel.querySelector('input[name="splitMode"]:checked').value;
      return { splitMode: mode, splitRange: panel.querySelector('.split-range').value };
    }
    if (config.id === 'pdf2img') {
      return {
        imgFormat: panel.querySelector('.img-format').value,
        imgQuality: parseFloat(panel.querySelector('.img-quality').value),
      };
    }
    return {};
  }

  function updateRunState(){ runBtn.disabled = files.length < config.minFiles; }

  function showError(message){
    resultEl.classList.remove('hidden');
    resultEl.innerHTML = `<div class="result-error">${message}</div>`;
  }

  function showSuccess(outputs){
    const s = STR[lang];
    resultEl.classList.remove('hidden');
    resultEl.innerHTML = '';

    const ok = document.createElement('div');
    ok.className = 'result-ok';
    ok.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      (outputs.length > 1 ? s.resultOkMulti(outputs.length) : s.resultOkSingle);
    resultEl.appendChild(ok);

    const actions = document.createElement('div');
    actions.className = 'result-actions';

    if (outputs.length === 1) {
      const a = document.createElement('a');
      a.className = 'secondary-btn';
      a.textContent = s.downloadFile;
      const url = URL.createObjectURL(outputs[0].blob);
      a.href = url; a.download = outputs[0].name;
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
        const url = URL.createObjectURL(zipBlob);
        zipBtn.href = url; zipBtn.download = 'output.zip';
      });
    }

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'secondary-btn';
    resetBtn.textContent = s.resetBtn;
    resetBtn.addEventListener('click', () => {
      files = [];
      renderList();
      updateRunState();
      resultEl.classList.add('hidden');
      resultEl.innerHTML = '';
    });
    actions.appendChild(resetBtn);

    resultEl.appendChild(actions);
  }

  if (config.id === 'splitpdf') {
    panel.querySelectorAll('input[name="splitMode"]').forEach((r) => r.addEventListener('change', () => {
      panel.querySelector('.split-range').disabled = r.value !== 'range' || !r.checked;
    }));
  }
  if (config.id === 'pdf2img') {
    const formatSel = panel.querySelector('.img-format');
    const qualityRow = panel.querySelector('.img-quality-row');
    const qualityInput = panel.querySelector('.img-quality');
    const qualityVal = panel.querySelector('.img-quality-val');
    const sync = () => { qualityRow.hidden = formatSel.value !== 'jpg'; };
    formatSel.addEventListener('change', sync);
    qualityInput.addEventListener('input', () => { qualityVal.textContent = Math.round(qualityInput.value * 100) + '%'; });
    sync();
  }

  runBtn.addEventListener('click', async () => {
    const s = STR[lang];
    if (files.length < config.minFiles) return;
    const labelEl = runBtn.querySelector('.run-btn-label');
    const original = labelEl.textContent;
    runBtn.disabled = true;
    labelEl.textContent = s.working;
    progressWrap.classList.remove('hidden');
    resultEl.classList.add('hidden');
    resultEl.innerHTML = '';
    try {
      const outputs = await config.run(files, gatherOptions());
      showSuccess(outputs);
    } catch (err) {
      showError((err && err.message) || s.errGeneric);
    } finally {
      progressWrap.classList.add('hidden');
      labelEl.textContent = original;
      updateRunState();
    }
  });

  updateRunState();
}

function wireToolSwitch(){
  const buttons = document.querySelectorAll('.tool-switch button');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeTool = btn.dataset.tool;
      buttons.forEach((b) => b.classList.toggle('active', b === btn));
      document.querySelectorAll('.tool-panel').forEach((p) => p.classList.toggle('active', p.dataset.panel === activeTool));
    });
  });
}

/* ---------- تهيئة ---------- */
function init(){
  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  initAuthModal();
  initAuthMenu();
  wireToolSwitch();
  TOOLS.forEach(setupPanel);

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
