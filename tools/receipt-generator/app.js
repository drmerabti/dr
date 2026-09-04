/* =====================================================================
   مولّد بيان الإرسال — app.js
   Requires login (Firebase Auth). Saved records live in Firestore at
   users/{uid}/bordereaux/{id}. Continuous typing autosaves locally only;
   Firestore is written only when the user presses "حفظ".
===================================================================== */

/* ---------------- i18n ---------------- */
const I18N = {
  ar: {
    pageTitle: 'مولّد بيان الإرسال',
    lockedTitle: 'سجّل دخولك لاستخدام مولّد بيان الإرسال',
    lockedSub: 'هذه الأداة، ومحفظتك الخاصة بها، متاحة للمستخدمين المسجّلين فقط.',
    tabLogin: 'تسجيل الدخول', tabSignup: 'إنشاء حساب',
    nameLabel: 'الاسم الكامل', emailLabel: 'البريد الإلكتروني', passwordLabel: 'كلمة المرور',
    orDivider: 'أو', googleBtn: 'المتابعة عبر Google',
    portfolioTitle: 'محفظتي', newBtn: 'بيان إرسال جديد',
    portfolioEmpty: 'لا توجد بيانات إرسال محفوظة بعد. أنشئ أول واحدة الآن.',
    openBtn: 'فتح', downloadBtn: 'تنزيل PDF', deleteBtn: 'حذف', saveBtn: 'حفظ',
    confirmDelete: 'حذف هذا البيان نهائيًا؟',
    formatCombined: 'مدمج بصفحة واحدة', formatBordereau: 'بيان الإرسال فقط', formatAck: 'إشعار الاستلام فقط',
    letterheadCard: 'ترويسة الجهة المرسلة', issuerName: 'اسم الجهة أو الشخص', issuerContact: 'العنوان / الهاتف / البريد',
    refCard: 'المرجع والوجهة', refNo: 'المرجع', refDate: 'التاريخ',
    destinataire: 'المرسل إليه', objet: 'الموضوع',
    docsCard: 'الوثائق المرفقة', docType: 'نوع الوثيقة', docQty: 'العدد', addDocRow: 'إضافة وثيقة',
    signCard: 'توقيع وختم المرسل',
    ackCard: 'إشعار الاستلام', ackTextLabel: 'نص الإقرار', receiverName: 'اسم المستلم', receiverRole: 'الصفة',
    fontCard: 'الخط', fontModern: 'عصري', fontClassic: 'كلاسيكي', fontFormal: 'رسمي تقليدي', fontHand: 'خط اليد',
    bordereauTitle: 'بيان إرسال', ackTitle: 'إشعار استلام',
    refLabel: 'المرجع', dateLabel: 'التاريخ',
    toLabel: 'إلى', subjectLabel: 'الموضوع',
    tableNo: 'الرقم', tableType: 'نوع الوثيقة', tableQty: 'العدد',
    signSenderLabel: 'توقيع وختم المرسل', signReceiverLabel: 'التوقيع والختم',
    relatedTo: 'متعلق ببيان الإرسال رقم', datedOn: 'بتاريخ',
    nameFull: 'الاسم واللقب', roleLabel: 'الصفة',
    savedMsg: 'تم الحفظ بمحفظتك.', notLoggedInAlert: 'سجّل الدخول أولاً.',
    defaultAckText: 'أقر أنا الموقّع أدناه باستلام كامل الوثائق المذكورة في بيان الإرسال المشار إليه أعلاه، وذلك بتاريخ استلام:',
    exDestinataire: 'مديرية التربية — ولاية بشار', exObjet: 'إرسال ملفات تلاميذ',
    exDoc1: 'شهادة ميلاد', exDoc2: 'كشف نقاط',
  },
  en: {
    pageTitle: 'Transmittal Note Generator',
    lockedTitle: 'Sign in to use the Transmittal Note Generator',
    lockedSub: 'This tool, and your saved portfolio, are available to signed-in users only.',
    tabLogin: 'Sign In', tabSignup: 'Sign Up',
    nameLabel: 'Full name', emailLabel: 'Email', passwordLabel: 'Password',
    orDivider: 'OR', googleBtn: 'Continue with Google',
    portfolioTitle: 'My Portfolio', newBtn: 'New Transmittal Note',
    portfolioEmpty: 'No saved transmittal notes yet. Create your first one now.',
    openBtn: 'Open', downloadBtn: 'Download PDF', deleteBtn: 'Delete', saveBtn: 'Save',
    confirmDelete: 'Permanently delete this note?',
    formatCombined: 'Combined, one page', formatBordereau: 'Transmittal note only', formatAck: 'Acknowledgment only',
    letterheadCard: 'Sender letterhead', issuerName: 'Business or individual name', issuerContact: 'Address / phone / email',
    refCard: 'Reference & destination', refNo: 'Reference', refDate: 'Date',
    destinataire: 'Addressed to', objet: 'Subject',
    docsCard: 'Enclosed documents', docType: 'Document type', docQty: 'Qty', addDocRow: 'Add document',
    signCard: "Sender's signature & stamp",
    ackCard: 'Acknowledgment of receipt', ackTextLabel: 'Declaration text', receiverName: "Receiver's name", receiverRole: 'Role',
    fontCard: 'Font', fontModern: 'Modern', fontClassic: 'Classic', fontFormal: 'Formal traditional', fontHand: 'Handwriting',
    bordereauTitle: 'Transmittal Note', ackTitle: 'Acknowledgment of Receipt',
    refLabel: 'Reference', dateLabel: 'Date',
    toLabel: 'To', subjectLabel: 'Subject',
    tableNo: 'No.', tableType: 'Document type', tableQty: 'Qty',
    signSenderLabel: "Sender's signature & stamp", signReceiverLabel: 'Signature & stamp',
    relatedTo: 'Regarding transmittal note No.', datedOn: 'dated',
    nameFull: 'Full name', roleLabel: 'Role',
    savedMsg: 'Saved to your portfolio.', notLoggedInAlert: 'Please sign in first.',
    defaultAckText: 'I, the undersigned, acknowledge receipt of all the documents mentioned in the above-referenced transmittal note, on the date of receipt:',
    exDestinataire: 'Regional Education Office — Béchar', exObjet: "Sending students' files",
    exDoc1: 'Birth certificate', exDoc2: 'Grade transcript',
  },
  fr: {
    pageTitle: "Générateur de bordereau d'envoi",
    lockedTitle: "Connectez-vous pour utiliser le générateur de bordereau d'envoi",
    lockedSub: 'Cet outil, et votre portefeuille personnel, sont réservés aux utilisateurs connectés.',
    tabLogin: 'Se connecter', tabSignup: 'Créer un compte',
    nameLabel: 'Nom complet', emailLabel: 'E-mail', passwordLabel: 'Mot de passe',
    orDivider: 'OU', googleBtn: 'Continuer avec Google',
    portfolioTitle: 'Mon portefeuille', newBtn: "Nouveau bordereau d'envoi",
    portfolioEmpty: "Aucun bordereau enregistré. Créez le premier maintenant.",
    openBtn: 'Ouvrir', downloadBtn: 'Télécharger le PDF', deleteBtn: 'Supprimer', saveBtn: 'Enregistrer',
    confirmDelete: 'Supprimer définitivement ce bordereau ?',
    formatCombined: 'Combiné, une page', formatBordereau: "Bordereau d'envoi seul", formatAck: 'Accusé de réception seul',
    letterheadCard: "En-tête de l'expéditeur", issuerName: "Nom de l'entreprise ou de la personne", issuerContact: 'Adresse / téléphone / e-mail',
    refCard: 'Référence et destinataire', refNo: 'Référence', refDate: 'Date',
    destinataire: 'Destinataire', objet: 'Objet',
    docsCard: 'Documents joints', docType: 'Type de document', docQty: 'Qté', addDocRow: 'Ajouter un document',
    signCard: "Signature et cachet de l'expéditeur",
    ackCard: 'Accusé de réception', ackTextLabel: 'Texte de déclaration', receiverName: 'Nom du destinataire', receiverRole: 'Fonction',
    fontCard: 'Police', fontModern: 'Moderne', fontClassic: 'Classique', fontFormal: 'Officielle traditionnelle', fontHand: 'Manuscrite',
    bordereauTitle: "Bordereau d'Envoi", ackTitle: 'Accusé de Réception',
    refLabel: 'Référence', dateLabel: 'Date',
    toLabel: 'À', subjectLabel: 'Objet',
    tableNo: 'N°', tableType: 'Type de document', tableQty: 'Qté',
    signSenderLabel: "Signature et cachet de l'expéditeur", signReceiverLabel: 'Signature et cachet',
    relatedTo: "Relatif au bordereau d'envoi n°", datedOn: 'daté du',
    nameFull: 'Nom complet', roleLabel: 'Fonction',
    savedMsg: 'Enregistré dans votre portefeuille.', notLoggedInAlert: "Veuillez vous connecter d'abord.",
    defaultAckText: "Je soussigné(e) reconnais avoir reçu l'ensemble des documents mentionnés dans le bordereau d'envoi référencé ci-dessus, à la date de réception :",
    exDestinataire: 'Direction régionale de l\'éducation — Béchar', exObjet: 'Envoi des dossiers des élèves',
    exDoc1: 'Acte de naissance', exDoc2: 'Relevé de notes',
  },
};

const FONTS = [
  { id: 'modern', label: 'fontModern', family: "'Tajawal', sans-serif" },
  { id: 'classic', label: 'fontClassic', family: "'Cairo', sans-serif" },
  { id: 'formal', label: 'fontFormal', family: "'Noto Naskh Arabic', serif" },
  { id: 'hand', label: 'fontHand', family: "'Aref Ruqaa', serif" },
];

const FORMATS = ['combined', 'bordereau', 'acknowledgment'];

let lang = localStorage.getItem('be_lang') || 'ar';
let currentUser = null;
let portfolioItems = [];
let currentRecordId = null; // null = unsaved new record

function t(key){ return I18N[lang][key] || key; }
function $(id){ return document.getElementById(id); }

function defaultRecord(){
  const today = new Date().toISOString().slice(0, 10);
  return {
    ref: 'BE-' + new Date().getFullYear() + '-001',
    date: today,
    destinataire: t('exDestinataire'), objet: t('exObjet'),
    documents: [{ type: t('exDoc1'), qty: 1 }, { type: t('exDoc2'), qty: 1 }],
    issuerName: '', issuerContact: '',
    logoDataUrl: null, signDataUrl: null,
    format: 'combined',
    ackText: t('defaultAckText'),
    receiverName: '', receiverRole: '',
    fontId: 'modern',
  };
}
let record = defaultRecord();

/* ---------------- Image compression (keep Firestore docs well under 1MB) ---------------- */
function readAndCompressImage(file, maxDim, quality){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > h && w > maxDim){ h = Math.round(h * maxDim / w); w = maxDim; }
        else if (h > maxDim){ w = Math.round(w * maxDim / h); h = maxDim; }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ---------------- Local autosave (draft only, unlimited & free) ---------------- */
function localAutosave(){
  try { localStorage.setItem('be_draft_' + (currentRecordId || 'new'), JSON.stringify(record)); } catch (e) {}
}
function loadLocalDraft(id){
  try {
    const raw = localStorage.getItem('be_draft_' + (id || 'new'));
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

/* ---------------- Language ---------------- */
function applyLanguage(){
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.title = t('pageTitle');
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.getAttribute('data-i18n')); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.getAttribute('data-i18n-placeholder')); });
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  localStorage.setItem('be_lang', lang);
  renderFontFilter();
  renderFormatSelector();
  renderDocRows();
  renderPreview();
}

/* ---------------- Screens ---------------- */
function showScreen(name){
  ['loadingScreen','lockedScreen','portfolioScreen','editorScreen'].forEach(id => {
    $(id).classList.toggle('hidden', id !== name);
  });
}

/* ---------------- Auth ---------------- */
const AUTH_ERR = {
  ar: { 'auth/email-already-in-use': 'هذا البريد مستخدم مسبقًا.', 'auth/invalid-email': 'صيغة البريد غير صحيحة.',
    'auth/weak-password': 'كلمة المرور ضعيفة (6 أحرف على الأقل).', 'auth/wrong-password': 'كلمة المرور غير صحيحة.',
    'auth/user-not-found': 'لا يوجد حساب بهذا البريد.', 'auth/invalid-credential': 'البريد أو كلمة المرور غير صحيحة.',
    default: 'حدث خطأ، حاول مرة أخرى.' },
  en: { 'auth/email-already-in-use': 'This email is already in use.', 'auth/invalid-email': 'Invalid email.',
    'auth/weak-password': 'Weak password (min 6 characters).', 'auth/wrong-password': 'Incorrect password.',
    'auth/user-not-found': 'No account with this email.', 'auth/invalid-credential': 'Incorrect email or password.',
    default: 'Something went wrong, try again.' },
  fr: { 'auth/email-already-in-use': 'Cet e-mail est déjà utilisé.', 'auth/invalid-email': 'E-mail invalide.',
    'auth/weak-password': 'Mot de passe trop faible (6 caractères min).', 'auth/wrong-password': 'Mot de passe incorrect.',
    'auth/user-not-found': 'Aucun compte avec cet e-mail.', 'auth/invalid-credential': 'E-mail ou mot de passe incorrect.',
    default: 'Une erreur est survenue, réessayez.' },
};
function authErrMsg(code){ const d = AUTH_ERR[lang] || AUTH_ERR.en; return d[code] || d.default; }

let authMode = 'login';
function setAuthMode(mode){
  authMode = mode;
  $('tabLogin').classList.toggle('active', mode === 'login');
  $('tabSignup').classList.toggle('active', mode === 'signup');
  $('acName').classList.toggle('hidden', mode === 'login');
  $('acSubmitBtn').textContent = mode === 'login' ? t('tabLogin') : t('tabSignup');
  $('authCardError').classList.add('hidden');
}

function initAuthCard(){
  $('tabLogin').addEventListener('click', () => setAuthMode('login'));
  $('tabSignup').addEventListener('click', () => setAuthMode('signup'));

  $('authCardForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = $('acEmail').value.trim();
    const password = $('acPassword').value;
    const btn = $('acSubmitBtn');
    btn.disabled = true;
    try {
      if (authMode === 'login'){
        await window.fbAuth.signInWithEmailAndPassword(email, password);
      } else {
        const cred = await window.fbAuth.createUserWithEmailAndPassword(email, password);
        const name = $('acName').value.trim();
        if (name) await cred.user.updateProfile({ displayName: name });
      }
    } catch (err){
      $('authCardError').textContent = authErrMsg(err.code);
      $('authCardError').classList.remove('hidden');
    } finally {
      btn.disabled = false;
    }
  });

  $('acGoogleBtn').addEventListener('click', async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await window.fbAuth.signInWithPopup(provider);
    } catch (err){
      if (err.code !== 'auth/popup-closed-by-user'){
        $('authCardError').textContent = authErrMsg(err.code);
        $('authCardError').classList.remove('hidden');
      }
    }
  });
}

/* ---------------- Firestore portfolio ---------------- */
function portfolioCollection(){
  return window.fbDb.collection('users').doc(currentUser.uid).collection('bordereaux');
}

async function loadPortfolio(){
  const snap = await portfolioCollection().orderBy('updatedAt', 'desc').get();
  portfolioItems = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  renderPortfolio();
}

function renderPortfolio(){
  const list = $('portfolioList');
  const empty = $('portfolioEmpty');
  if (portfolioItems.length === 0){
    list.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  list.innerHTML = portfolioItems.map(item => `
    <div class="portfolio-item">
      <div class="portfolio-item-main">
        <div class="portfolio-item-title">${escapeHtml(item.ref || '—')} — ${escapeHtml(item.destinataire || '')}</div>
        <div class="portfolio-item-sub">${escapeHtml(item.date || '')}</div>
      </div>
      <div class="portfolio-item-actions">
        <button class="btn-icon-sm" data-open="${item.id}" title="${t('openBtn')}" aria-label="${t('openBtn')}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
        </button>
        <button class="btn-icon-sm danger" data-delete="${item.id}" title="${t('deleteBtn')}" aria-label="${t('deleteBtn')}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
        </button>
      </div>
    </div>`).join('');

  list.querySelectorAll('[data-open]').forEach(btn => {
    btn.addEventListener('click', () => openRecord(btn.getAttribute('data-open')));
  });
  list.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm(t('confirmDelete'))) return;
      await portfolioCollection().doc(btn.getAttribute('data-delete')).delete();
      await loadPortfolio();
    });
  });
}

function escapeHtml(s){
  return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function openRecord(id){
  const item = portfolioItems.find(i => i.id === id);
  if (!item) return;
  currentRecordId = id;
  record = Object.assign(defaultRecord(), item);
  delete record.id; delete record.updatedAt;
  enterEditor();
}

function newRecord(){
  currentRecordId = null;
  record = defaultRecord();
  record.destinataire = record.destinataire; // keep example-free; fields start blank except ref/date
  enterEditor();
}

async function saveRecord(){
  if (!currentUser){ alert(t('notLoggedInAlert')); return; }
  const payload = Object.assign({}, record, { updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
  const btn = $('saveBtn');
  btn.disabled = true;
  try {
    if (currentRecordId){
      await portfolioCollection().doc(currentRecordId).set(payload, { merge: true });
    } else {
      const ref = await portfolioCollection().add(payload);
      currentRecordId = ref.id;
    }
    await loadPortfolio();
    alert(t('savedMsg'));
  } finally {
    btn.disabled = false;
  }
}

/* ---------------- Editor ---------------- */
function enterEditor(){
  showScreen('editorScreen');
  fillFormFromRecord();
  renderFontFilter();
  renderFormatSelector();
  renderDocRows();
  renderPreview();
}

function fillFormFromRecord(){
  $('issuerName').value = record.issuerName || '';
  $('issuerContact').value = record.issuerContact || '';
  $('refNo').value = record.ref || '';
  $('refDate').value = record.date || '';
  $('destinataire').value = record.destinataire || '';
  $('objet').value = record.objet || '';
  $('ackText').value = record.ackText || t('defaultAckText');
  $('receiverName').value = record.receiverName || '';
  $('receiverRole').value = record.receiverRole || '';
  renderUploadBox('logoBox', record.logoDataUrl);
  renderUploadBox('signBox', record.signDataUrl);
}

function renderUploadBox(boxId, dataUrl){
  const box = $(boxId);
  box.innerHTML = dataUrl
    ? `<img src="${dataUrl}" alt=""><span class="upload-remove" data-remove="${boxId}">&times;</span>`
    : `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" style="color:var(--ink-soft)"><path d="M12 5v14M5 12h14"/></svg>`;
  const rm = box.querySelector('[data-remove]');
  if (rm) rm.addEventListener('click', (e) => {
    e.stopPropagation();
    if (boxId === 'logoBox') record.logoDataUrl = null; else record.signDataUrl = null;
    renderUploadBox(boxId, null);
    localAutosave(); renderPreview();
  });
}

function initUploadBox(boxId, inputId, field){
  const box = $(boxId), input = $(inputId);
  box.addEventListener('click', (e) => { if (!e.target.closest('[data-remove]')) input.click(); });
  input.addEventListener('change', async function(){
    const file = this.files[0]; if (!file) return;
    const dataUrl = await readAndCompressImage(file, 360, 0.75);
    record[field] = dataUrl;
    renderUploadBox(boxId, dataUrl);
    localAutosave(); renderPreview();
  });
}

function renderFontFilter(){
  $('fontFilter').innerHTML = FONTS.map(f => `<button type="button" class="chip-btn ${record.fontId === f.id ? 'active' : ''}" data-font="${f.id}">${t(f.label)}</button>`).join('');
  $('fontFilter').querySelectorAll('[data-font]').forEach(btn => {
    btn.addEventListener('click', () => { record.fontId = btn.getAttribute('data-font'); renderFontFilter(); localAutosave(); renderPreview(); });
  });
}

const FORMAT_ICONS = {
  combined: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M5 13h14" stroke-dasharray="2 2"/></svg>',
  bordereau: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
  acknowledgment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="m9 13 2 2 4-4"/></svg>',
};
function renderFormatSelector(){
  const labels = { combined: 'formatCombined', bordereau: 'formatBordereau', acknowledgment: 'formatAck' };
  $('formatSelectRow').innerHTML = FORMATS.map(f => `
    <div class="format-card ${record.format === f ? 'active' : ''}" data-format="${f}">
      ${FORMAT_ICONS[f]}
      <div class="format-card-label">${t(labels[f])}</div>
    </div>`).join('');
  $('formatSelectRow').querySelectorAll('[data-format]').forEach(el => {
    el.addEventListener('click', () => {
      record.format = el.getAttribute('data-format');
      renderFormatSelector();
      $('ackFormCard').classList.toggle('hidden', record.format === 'bordereau');
      $('docsFormCard').classList.toggle('hidden', record.format === 'acknowledgment');
      $('letterheadFormCard').classList.toggle('hidden', false);
      localAutosave(); renderPreview();
    });
  });
  $('ackFormCard').classList.toggle('hidden', record.format === 'bordereau');
  $('docsFormCard').classList.toggle('hidden', record.format === 'acknowledgment');
}

function renderDocRows(){
  const wrap = $('docRowsList');
  wrap.innerHTML = record.documents.map((d, i) => `
    <div class="doc-row">
      <input type="text" class="cv-input doc-type" data-i="${i}" value="${escapeHtml(d.type)}" placeholder="${t('docType')}">
      <input type="number" min="1" class="cv-input doc-qty" data-i="${i}" value="${d.qty}">
      <button type="button" class="remove-row-btn" data-remove-doc="${i}" aria-label="${t('deleteBtn')}">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </div>`).join('');

  wrap.querySelectorAll('.doc-type').forEach(el => el.addEventListener('input', () => {
    record.documents[+el.dataset.i].type = el.value; localAutosave(); renderPreview();
  }));
  wrap.querySelectorAll('.doc-qty').forEach(el => el.addEventListener('input', () => {
    record.documents[+el.dataset.i].qty = parseInt(el.value, 10) || 1; localAutosave(); renderPreview();
  }));
  wrap.querySelectorAll('[data-remove-doc]').forEach(el => el.addEventListener('click', () => {
    record.documents.splice(+el.getAttribute('data-remove-doc'), 1);
    if (record.documents.length === 0) record.documents.push({ type: '', qty: 1 });
    renderDocRows(); localAutosave(); renderPreview();
  }));
}

/* ---------------- Live A4 preview ---------------- */
function fontFamilyFor(id){ const f = FONTS.find(x => x.id === id); return f ? f.family : FONTS[0].family; }

function bordereauPageHtml(){
  const rows = record.documents.map((d, i) => `<tr><td style="text-align:center">${i+1}</td><td>${escapeHtml(d.type) || '—'}</td><td style="text-align:center">${d.qty}</td></tr>`).join('');
  return `
    <div class="pv-letterhead">
      <div class="pv-logo-box">${record.logoDataUrl ? `<img src="${record.logoDataUrl}" alt="">` : ''}</div>
      <div><div class="pv-issuer-name">${escapeHtml(record.issuerName) || '—'}</div><div class="pv-issuer-contact">${escapeHtml(record.issuerContact)}</div></div>
    </div>
    <div class="pv-divider"></div>
    <div class="pv-refdate"><span>${t('refLabel')}: <b>${escapeHtml(record.ref)}</b></span><span>${t('dateLabel')}: <b>${escapeHtml(record.date)}</b></span></div>
    <div class="pv-line"><span class="lbl">${t('toLabel')}: </span>${escapeHtml(record.destinataire) || '—'}</div>
    <div class="pv-line" style="margin-bottom:16px;"><span class="lbl">${t('subjectLabel')}: </span>${escapeHtml(record.objet) || '—'}</div>
    <div class="pv-title-row"><span>${t('bordereauTitle')}</span></div>
    <table class="pv-table"><thead><tr><th>${t('tableNo')}</th><th>${t('tableType')}</th><th>${t('tableQty')}</th></tr></thead><tbody>${rows}</tbody></table>
    <div class="pv-sign-block"><div><div class="pv-sign-label">${t('signSenderLabel')}</div><div class="pv-sign-img-box">${record.signDataUrl ? `<img src="${record.signDataUrl}" alt="">` : ''}</div></div></div>
  `;
}

function ackPageHtml(withLetterhead){
  return `
    ${withLetterhead ? `
    <div class="pv-letterhead">
      <div class="pv-logo-box">${record.logoDataUrl ? `<img src="${record.logoDataUrl}" alt="">` : ''}</div>
      <div><div class="pv-issuer-name">${escapeHtml(record.issuerName) || '—'}</div><div class="pv-issuer-contact">${escapeHtml(record.issuerContact)}</div></div>
    </div>
    <div class="pv-divider"></div>` : ''}
    <div class="pv-title-row" style="margin-top:${withLetterhead ? '10px' : '0'};"><span>${t('ackTitle')}</span></div>
    <div class="pv-ack-ref">${t('relatedTo')} <b>${escapeHtml(record.ref)}</b> ${t('datedOn')} <b>${escapeHtml(record.date)}</b></div>
    <div class="pv-ack-text">${escapeHtml(record.ackText)}</div>
    <div class="pv-ack-fields">
      <div style="flex:1;">
        <div style="margin-bottom:10px;">${t('nameFull')}: ${escapeHtml(record.receiverName) || '.......................'}</div>
        <div>${t('roleLabel')}: ${escapeHtml(record.receiverRole) || '.......................'}</div>
      </div>
    </div>
    <div class="pv-sign-block" style="justify-content:center;"><div><div class="pv-sign-label">${t('signReceiverLabel')}</div><div class="pv-sign-img-box">${record.signDataUrl ? `<img src="${record.signDataUrl}" alt="">` : ''}</div></div></div>
  `;
}

function renderPreview(){
  const container = $('previewContainer');
  const fontFamily = fontFamilyFor(record.fontId);
  let pagesHtml = '';
  if (record.format === 'bordereau'){
    pagesHtml = `<div class="page-a4" id="pdfTarget" style="font-family:${fontFamily}">${bordereauPageHtml()}</div>`;
  } else if (record.format === 'acknowledgment'){
    pagesHtml = `<div class="page-a4" id="pdfTarget" style="font-family:${fontFamily}">${ackPageHtml(true)}</div>`;
  } else {
    pagesHtml = `<div class="page-a4" id="pdfTarget" style="font-family:${fontFamily}">
        ${bordereauPageHtml()}
        <div class="pv-cut"></div>
        <div class="pv-ack-box">${ackPageHtml(false)}</div>
      </div>`;
  }
  container.innerHTML = pagesHtml;
}

/* ---------------- PDF / print ---------------- */
async function downloadPdf(){
  const node = $('pdfTarget');
  const canvas = await html2canvas(node, { scale: 3, backgroundColor: '#ffffff', useCORS: true });
  const img = canvas.toDataURL('image/png');
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const w = pdf.internal.pageSize.getWidth(), h = pdf.internal.pageSize.getHeight();
  pdf.addImage(img, 'PNG', 0, 0, w, h);
  pdf.save((record.ref || 'bordereau') + '.pdf');
}

/* ---------------- Init ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  showScreen('loadingScreen');
  setAuthMode('login');
  initAuthCard();

  document.querySelectorAll('.lang-btn').forEach(btn => btn.addEventListener('click', () => { lang = btn.dataset.lang; applyLanguage(); }));

  $('backBtn').addEventListener('click', (e) => {
    e.preventDefault();
    if (!$('editorScreen').classList.contains('hidden')){ showScreen('portfolioScreen'); }
    else { window.location.href = '../../tools.html'; }
  });

  $('newBordereauBtn').addEventListener('click', newRecord);
  $('saveBtn').addEventListener('click', saveRecord);
  $('downloadPdfBtn').addEventListener('click', downloadPdf);
  $('printBtn').addEventListener('click', () => window.print());

  ['issuerName','issuerContact'].forEach(id => $(id).addEventListener('input', (e) => { record[id] = e.target.value; localAutosave(); renderPreview(); }));
  $('refNo').addEventListener('input', (e) => { record.ref = e.target.value; localAutosave(); renderPreview(); });
  $('refDate').addEventListener('input', (e) => { record.date = e.target.value; localAutosave(); renderPreview(); });
  $('destinataire').addEventListener('input', (e) => { record.destinataire = e.target.value; localAutosave(); renderPreview(); });
  $('objet').addEventListener('input', (e) => { record.objet = e.target.value; localAutosave(); renderPreview(); });
  $('ackText').addEventListener('input', (e) => { record.ackText = e.target.value; localAutosave(); renderPreview(); });
  $('receiverName').addEventListener('input', (e) => { record.receiverName = e.target.value; localAutosave(); renderPreview(); });
  $('receiverRole').addEventListener('input', (e) => { record.receiverRole = e.target.value; localAutosave(); renderPreview(); });

  $('addDocRowBtn').addEventListener('click', () => { record.documents.push({ type: '', qty: 1 }); renderDocRows(); localAutosave(); renderPreview(); });

  initUploadBox('logoBox', 'logoInput', 'logoDataUrl');
  initUploadBox('signBox', 'signInput', 'signDataUrl');

  if (window.fbAuth){
    window.fbAuth.onAuthStateChanged(async (user) => {
      currentUser = user;
      if (user){
        applyLanguage();
        showScreen('portfolioScreen');
        $('portfolioTitleEl').textContent = t('portfolioTitle');
        await loadPortfolio();
      } else {
        applyLanguage();
        showScreen('lockedScreen');
      }
    });
  } else {
    showScreen('lockedScreen');
  }
});
