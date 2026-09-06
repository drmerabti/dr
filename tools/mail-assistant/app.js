/* =====================================================================
   مساعد البريد المهني — أكاديمية مرابطي
   يتطلب تسجيل دخول، يستدعي Cloud Function باسم draftEmail (Groq)
===================================================================== */

const $ = (id) => document.getElementById(id);
const DRAFT_DRAFT_KEY = 'mail_assist_draft_v1';

/* ---------- i18n ---------- */
const STR = {
  ar: {
    dir: 'rtl', title: 'مساعد البريد المهني — أكاديمية مرابطي',
    back: 'رجوع إلى الأدوات',
    heroTitle: 'مساعد البريد المهني',
    heroSub: 'اكتب نقاطك، واختر درجة الرسمية ولغة الإيميل، ودع الذكاء الاصطناعي يصيغ لك المسودة كاملة.',
    secEmailInfo: 'بيانات الإيميل', lRecipient: 'المستلم (اختياري)', lSubject: 'الموضوع', lPurpose: 'الغرض من الإيميل',
    secPoints: 'النقاط الرئيسية',
    secSettings: 'الإعدادات', lTone: 'درجة الرسمية', lEmailLang: 'لغة الإيميل',
    generateBtnLabel: 'صياغة الإيميل بالذكاء الاصطناعي',
    authHintNote: 'تحتاج تسجيل الدخول لاستخدام هذه الميزة.',
    secDraft: 'المسودة (قابلة للتعديل المباشر)',
    qaRewrite: 'أعد الصياغة', qaShorten: 'اختصار', qaFormal: 'أكثر رسمية', qaFriendly: 'أكثر ودية',
    copyBtnLabel: 'نسخ الإيميل', copiedNote: 'تم النسخ ✓',
    footer: '© 2026 أكاديمية مرابطي',
    purposes: { request: 'طلب', complaint: 'شكوى إدارية', followup: 'متابعة', apology: 'اعتذار', thanks: 'شكر', intro: 'تقديم نفسك', other: 'أخرى' },
    tones: { formal_high: 'رسمي جدًا', formal: 'رسمي', friendly: 'ودّي' },
    langs: { ar: 'العربية', en: 'الإنجليزية', fr: 'الفرنسية' },
    authModalTitle: 'تسجيل الدخول', authModalSub: 'سجّل دخولك لاستخدام مساعد البريد',
    authNameLabel: 'الاسم', authEmailLabel: 'البريد الإلكتروني', authPasswordLabel: 'كلمة المرور',
    authSubmitLogin: 'دخول', authSubmitSignup: 'إنشاء الحساب',
    authOrDivider: 'أو', googleAuthLabel: 'المتابعة عبر Google',
    authSwitchToSignup: 'إنشاء حساب', authSwitchToLogin: 'تسجيل الدخول',
    authNoAccount: 'ليس لديك حساب؟', authHasAccount: 'لديك حساب بالفعل؟',
    pointsPlaceholder: 'اكتب النقاط اللي تبي يتضمنها الإيميل...',
    recipientPlaceholder: 'مثال: مدير الموارد البشرية',
    subjectPlaceholder: 'مثال: طلب إجازة سنوية',
    errNoPoints: 'اكتب النقاط الرئيسية أولاً.',
    errGeneric: 'تعذّر التوليد، حاول مرة أخرى.',
    generating: 'جارٍ الصياغة…',
    authErr: {
      'auth/email-already-in-use': 'هذا البريد مستخدم مسبقًا.', 'auth/invalid-email': 'صيغة البريد غير صحيحة.',
      'auth/weak-password': 'كلمة المرور ضعيفة (6 أحرف على الأقل).', 'auth/wrong-password': 'كلمة المرور غير صحيحة.',
      'auth/user-not-found': 'لا يوجد حساب بهذا البريد.', 'auth/invalid-credential': 'البريد أو كلمة المرور غير صحيحة.',
      'auth/popup-closed-by-user': 'تم إغلاق نافذة الدخول.', default: 'حدث خطأ، حاول مرة أخرى.',
    },
    logout: 'تسجيل الخروج', login: 'تسجيل الدخول',
  },
  en: {
    dir: 'ltr', title: 'Professional Email Assistant — Merabti Academy',
    back: 'Back to tools',
    heroTitle: 'Professional Email Assistant',
    heroSub: 'Write your key points, pick a tone and a language, and let AI draft the full email for you.',
    secEmailInfo: 'Email details', lRecipient: 'Recipient (optional)', lSubject: 'Subject', lPurpose: 'Purpose',
    secPoints: 'Key points',
    secSettings: 'Settings', lTone: 'Tone', lEmailLang: 'Email language',
    generateBtnLabel: 'Draft with AI',
    authHintNote: 'You need to sign in to use this feature.',
    secDraft: 'Draft (directly editable)',
    qaRewrite: 'Rewrite', qaShorten: 'Shorten', qaFormal: 'More formal', qaFriendly: 'More friendly',
    copyBtnLabel: 'Copy email', copiedNote: 'Copied ✓',
    footer: '© 2026 Merabti Academy',
    purposes: { request: 'Request', complaint: 'Complaint', followup: 'Follow-up', apology: 'Apology', thanks: 'Thanks', intro: 'Introduction', other: 'Other' },
    tones: { formal_high: 'Very formal', formal: 'Formal', friendly: 'Friendly' },
    langs: { ar: 'Arabic', en: 'English', fr: 'French' },
    authModalTitle: 'Sign in', authModalSub: 'Sign in to use the email assistant',
    authNameLabel: 'Name', authEmailLabel: 'Email', authPasswordLabel: 'Password',
    authSubmitLogin: 'Sign in', authSubmitSignup: 'Create account',
    authOrDivider: 'or', googleAuthLabel: 'Continue with Google',
    authSwitchToSignup: 'Create account', authSwitchToLogin: 'Sign in',
    authNoAccount: "Don't have an account?", authHasAccount: 'Already have an account?',
    pointsPlaceholder: 'Write the points you want the email to cover...',
    recipientPlaceholder: 'e.g. HR manager',
    subjectPlaceholder: 'e.g. Annual leave request',
    errNoPoints: 'Write the key points first.',
    errGeneric: 'Could not generate, please try again.',
    generating: 'Drafting…',
    authErr: {
      'auth/email-already-in-use': 'This email is already in use.', 'auth/invalid-email': 'Invalid email format.',
      'auth/weak-password': 'Password too weak (min 6 characters).', 'auth/wrong-password': 'Incorrect password.',
      'auth/user-not-found': 'No account found with this email.', 'auth/invalid-credential': 'Incorrect email or password.',
      'auth/popup-closed-by-user': 'Sign-in window was closed.', default: 'Something went wrong, please try again.',
    },
    logout: 'Sign out', login: 'Sign in',
  },
  fr: {
    dir: 'ltr', title: 'Assistant e-mail professionnel — Académie Merabti',
    back: 'Retour aux outils',
    heroTitle: 'Assistant e-mail professionnel',
    heroSub: "Notez vos points clés, choisissez un ton et une langue, et laissez l'IA rédiger l'e-mail complet.",
    secEmailInfo: "Détails de l'e-mail", lRecipient: 'Destinataire (optionnel)', lSubject: 'Objet', lPurpose: 'Objectif',
    secPoints: 'Points clés',
    secSettings: 'Paramètres', lTone: 'Ton', lEmailLang: "Langue de l'e-mail",
    generateBtnLabel: "Rédiger avec l'IA",
    authHintNote: 'Connexion requise pour utiliser cette fonctionnalité.',
    secDraft: 'Brouillon (modifiable directement)',
    qaRewrite: 'Reformuler', qaShorten: 'Raccourcir', qaFormal: 'Plus formel', qaFriendly: 'Plus amical',
    copyBtnLabel: "Copier l'e-mail", copiedNote: 'Copié ✓',
    footer: '© 2026 Académie Merabti',
    purposes: { request: 'Demande', complaint: 'Réclamation', followup: 'Relance', apology: 'Excuse', thanks: 'Remerciement', intro: 'Présentation', other: 'Autre' },
    tones: { formal_high: 'Très formel', formal: 'Formel', friendly: 'Amical' },
    langs: { ar: 'Arabe', en: 'Anglais', fr: 'Français' },
    authModalTitle: 'Connexion', authModalSub: "Connectez-vous pour utiliser l'assistant",
    authNameLabel: 'Nom', authEmailLabel: 'E-mail', authPasswordLabel: 'Mot de passe',
    authSubmitLogin: 'Connexion', authSubmitSignup: 'Créer un compte',
    authOrDivider: 'ou', googleAuthLabel: 'Continuer avec Google',
    authSwitchToSignup: 'Créer un compte', authSwitchToLogin: 'Connexion',
    authNoAccount: "Pas de compte ?", authHasAccount: 'Déjà un compte ?',
    pointsPlaceholder: "Notez les points que l'e-mail doit couvrir...",
    recipientPlaceholder: 'ex : responsable RH',
    subjectPlaceholder: 'ex : demande de congé annuel',
    errNoPoints: "Écrivez d'abord les points clés.",
    errGeneric: 'Échec de la génération, réessayez.',
    generating: 'Rédaction en cours…',
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
let tone = 'formal';
let currentUser = null;
let authMode = 'login';

/* ---------- تطبيق اللغة ---------- */
function applyLanguage(){
  const s = STR[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = s.dir;
  document.title = s.title;

  $('backLabel').textContent = s.back;
  $('heroTitle').textContent = s.heroTitle;
  $('heroSub').textContent = s.heroSub;
  $('secEmailInfo').textContent = s.secEmailInfo;
  $('lRecipient').textContent = s.lRecipient;
  $('lSubject').textContent = s.lSubject;
  $('lPurpose').textContent = s.lPurpose;
  $('secPoints').textContent = s.secPoints;
  $('secSettings').textContent = s.secSettings;
  $('lTone').textContent = s.lTone;
  $('lEmailLang').textContent = s.lEmailLang;
  $('generateBtnLabel').textContent = s.generateBtnLabel;
  $('authHintNote').textContent = s.authHintNote;
  $('secDraft').textContent = s.secDraft;
  $('qaRewrite').textContent = s.qaRewrite;
  $('qaShorten').textContent = s.qaShorten;
  $('qaFormal').textContent = s.qaFormal;
  $('qaFriendly').textContent = s.qaFriendly;
  $('copyBtnLabel').textContent = s.copyBtnLabel;
  $('copiedNote').textContent = s.copiedNote;
  $('footerText').textContent = s.footer;

  $('fRecipient').placeholder = s.recipientPlaceholder;
  $('fSubject').placeholder = s.subjectPlaceholder;
  $('fPoints').placeholder = s.pointsPlaceholder;

  populatePurposeSelect();
  populateToneSegmented();
  populateEmailLangSelect();

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

$('uiLangSelect').addEventListener('change', () => {
  lang = $('uiLangSelect').value;
  applyLanguage();
});

/* ---------- الغرض / درجة الرسمية / لغة الإيميل ---------- */
function populatePurposeSelect(){
  const s = STR[lang];
  const sel = $('fPurpose');
  const prevValue = sel.value || 'request';
  sel.innerHTML = Object.keys(s.purposes).map(k => `<option value="${k}">${s.purposes[k]}</option>`).join('');
  sel.value = prevValue;
}
function populateEmailLangSelect(){
  const s = STR[lang];
  const sel = $('fEmailLang');
  const prevValue = sel.value || lang;
  sel.innerHTML = Object.keys(s.langs).map(k => `<option value="${k}">${s.langs[k]}</option>`).join('');
  sel.value = prevValue;
}
function populateToneSegmented(){
  const s = STR[lang];
  const wrap = $('toneSegmented');
  wrap.innerHTML = Object.keys(s.tones).map(k =>
    `<button type="button" data-tone="${k}" class="${k === tone ? 'active' : ''}">${s.tones[k]}</button>`
  ).join('');
  wrap.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      tone = btn.dataset.tone;
      wrap.querySelectorAll('button').forEach(b => b.classList.toggle('active', b === btn));
    });
  });
}

/* ---------- مسودة النموذج المحلية (اختياري، حتى لا تضيع كتابته) ---------- */
function saveFormDraft(){
  const draft = {
    recipient: $('fRecipient').value, subject: $('fSubject').value,
    purpose: $('fPurpose').value, points: $('fPoints').value,
    tone: tone, emailLang: $('fEmailLang').value,
  };
  localStorage.setItem(DRAFT_DRAFT_KEY, JSON.stringify(draft));
}
function restoreFormDraft(){
  try {
    const draft = JSON.parse(localStorage.getItem(DRAFT_DRAFT_KEY));
    if (!draft) return;
    $('fRecipient').value = draft.recipient || '';
    $('fSubject').value = draft.subject || '';
    if (draft.purpose) $('fPurpose').value = draft.purpose;
    $('fPoints').value = draft.points || '';
    if (draft.tone) tone = draft.tone;
    if (draft.emailLang) $('fEmailLang').value = draft.emailLang;
  } catch(e){ /* ignore */ }
}
['fRecipient', 'fSubject', 'fPurpose', 'fPoints', 'fEmailLang'].forEach(id => {
  $(id).addEventListener('input', saveFormDraft);
  $(id).addEventListener('change', saveFormDraft);
});

/* ---------- المصادقة ---------- */
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

/* ---------- استدعاء الذكاء الاصطناعي (Cloud Function: draftEmail) ---------- */
async function callDraftEmail(payload){
  const fn = window.fbFunctions.httpsCallable('draftEmail');
  const res = await fn(payload);
  return res.data.text;
}

$('generateBtn').addEventListener('click', async () => {
  const s = STR[lang];
  if (!currentUser){ openAuthModal(); return; }
  const points = $('fPoints').value.trim();
  if (!points){ alert(s.errNoPoints); return; }

  const btn = $('generateBtn');
  const labelEl = $('generateBtnLabel');
  const original = labelEl.textContent;
  btn.disabled = true;
  labelEl.textContent = s.generating;

  try {
    const text = await callDraftEmail({
      mode: 'generate',
      recipient: $('fRecipient').value.trim(),
      subject: $('fSubject').value.trim(),
      purpose: $('fPurpose').value,
      points: points,
      tone: tone,
      language: $('fEmailLang').value,
    });
    $('draftOutput').value = text;
  } catch(err){
    alert(s.errGeneric);
  } finally {
    btn.disabled = false;
    labelEl.textContent = original;
  }
});

document.querySelectorAll('.quick-chip').forEach(chip => {
  chip.addEventListener('click', async () => {
    const s = STR[lang];
    if (!currentUser){ openAuthModal(); return; }
    const currentDraft = $('draftOutput').value.trim();
    if (!currentDraft) return;
    const action = chip.dataset.action;
    document.querySelectorAll('.quick-chip').forEach(c => c.disabled = true);
    try {
      const text = await callDraftEmail({
        mode: 'revise',
        action: action,
        currentDraft: currentDraft,
        language: $('fEmailLang').value,
      });
      $('draftOutput').value = text;
    } catch(err){
      alert(s.errGeneric);
    } finally {
      document.querySelectorAll('.quick-chip').forEach(c => c.disabled = false);
    }
  });
});

$('copyBtn').addEventListener('click', async () => {
  const text = $('draftOutput').value;
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    $('copiedNote').classList.remove('hidden');
    setTimeout(() => $('copiedNote').classList.add('hidden'), 2000);
  } catch(e){ /* clipboard API may be unavailable */ }
});

/* ---------- تهيئة ---------- */
function init(){
  initAuthModal();
  initAuthMenu();
  restoreFormDraft();

  if (window.fbAuth){
    window.fbAuth.onAuthStateChanged((fbUser) => {
      currentUser = fbUser ? {
        uid: fbUser.uid,
        name: fbUser.displayName || fbUser.email,
        email: fbUser.email,
        picture: fbUser.photoURL || null,
      } : null;
      renderAuthUI();
    });
  }

  applyLanguage();
}

document.addEventListener('DOMContentLoaded', init);
