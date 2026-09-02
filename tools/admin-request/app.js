// ============================================================
// app.js — Admin Request Generator
// ============================================================

(function () {
  "use strict";

  /* ================= i18n ================= */
  const I18N = {
    ar: {
      dir: 'rtl', pageTitleTag: 'مولّد الطلب الإداري — أكاديمية مرابطي', topbarTitle: 'مولّد الطلب الإداري', toolTitle: 'مولّد الطلب الإداري',
      lockedTitle: 'سجّل دخولك لاستخدام مولّد الطلب الإداري', lockedSub: 'هذه الأداة متاحة للمستخدمين المسجّلين فقط.',
      tabLogin: 'تسجيل الدخول', tabSignup: 'إنشاء حساب', namePh: 'الاسم الكامل', emailPh: 'البريد الإلكتروني', passwordPh: 'كلمة المرور',
      loginBtn: 'تسجيل الدخول', signupBtn: 'إنشاء حساب', googleBtn: 'المتابعة عبر Google',
      usageIndicator: (used, max) => `الاستخدام اليوم: ${used} من ${max}`,
      companyCardTitle: 'شعار الشركة (اختياري)', companyNamePh: 'اسم الشركة (اختياري)',
      personalCardTitle: 'بياناتك', firstNamePh: 'الاسم', lastNamePh: 'اللقب', phonePh: 'رقم الهاتف', emailPh2: 'البريد الإلكتروني',
      addressedToPh: 'موجّه إلى (السيد المدير...)',
      extraCardTitle: 'معلومات إضافية', extraKeyPh: 'العنوان (مثال: الرتبة)', extraValPh: 'القيمة',
      requestCardTitle: 'موضوع الطلب', requestPh: 'اكتب فكرة طلبك بإيجاز (مثال: أطلب إجازة سنوية من 10 إلى 20 أوت)',
      generateBtnText: 'توليد الطلب', generating: 'جارٍ التوليد…',
      rephraseBtnLabel: 'تغيير الصيغة', shortenBtnLabel: 'اختصار الطلب',
      stampCardTitle: 'الختم والتوقيع (اختياري)',
      download: 'تحميل PDF', downloading: '…',
      errNeedSubject: 'اكتب فكرة الطلب أولًا.', errNeedText: 'لا يوجد نص لتعديله بعد.',
      errLimit: 'وصلت للحد الأقصى المسموح اليوم (مرتين كل 24 ساعة). حاول لاحقًا.',
      errGeneric: 'حدث خطأ أثناء التوليد، حاول مرة أخرى.',
      bodyPlaceholder: 'سيظهر نص طلبك هنا بعد الضغط على "توليد الطلب"...',
      defaultAddressed: 'السيد المدير المحترم',
      listTitle: 'طلباتي', newRequestBtnText: 'إنشاء طلب', backToListText: 'طلباتي',
      clearAllText: 'تفريغ الخانات', emptyListHint: 'ما عندك طلبات محفوظة بعد.',
      untitledRequest: 'طلب بدون عنوان', savingStatus: 'جارٍ الحفظ…', savedStatus: 'تم الحفظ',
      confirmClear: 'هل تريد تفريغ كل الخانات؟ لن يتأثر الطلب المحفوظ سابقًا.',
      confirmDelete: 'هل تريد حذف هذا الطلب نهائيًا؟',
    },
    en: {
      dir: 'ltr', pageTitleTag: 'Administrative Request Generator — Merabti Academy', topbarTitle: 'Admin Request Generator', toolTitle: 'Admin Request Generator',
      lockedTitle: 'Sign in to use the Admin Request Generator', lockedSub: 'This tool is available to registered users only.',
      tabLogin: 'Log In', tabSignup: 'Sign Up', namePh: 'Full name', emailPh: 'Email', passwordPh: 'Password',
      loginBtn: 'Log In', signupBtn: 'Sign Up', googleBtn: 'Continue with Google',
      usageIndicator: (used, max) => `Today's usage: ${used} of ${max}`,
      companyCardTitle: 'Company logo (optional)', companyNamePh: 'Company name (optional)',
      personalCardTitle: 'Your details', firstNamePh: 'First name', lastNamePh: 'Last name', phonePh: 'Phone number', emailPh2: 'Email',
      addressedToPh: 'Addressed to (Dear Director...)',
      extraCardTitle: 'Additional info', extraKeyPh: 'Label (e.g. Rank)', extraValPh: 'Value',
      requestCardTitle: 'Request topic', requestPh: 'Briefly describe your request (e.g. Requesting annual leave from Aug 10 to 20)',
      generateBtnText: 'Generate request', generating: 'Generating…',
      rephraseBtnLabel: 'Rephrase', shortenBtnLabel: 'Shorten',
      stampCardTitle: 'Stamp and signature (optional)',
      download: 'Download PDF', downloading: '…',
      errNeedSubject: 'Please write your request topic first.', errNeedText: 'No text to edit yet.',
      errLimit: "You've reached today's limit (2 per 24 hours). Try again later.",
      errGeneric: 'Something went wrong while generating, please try again.',
      bodyPlaceholder: 'Your request text will appear here after pressing "Generate request"...',
      defaultAddressed: 'Dear Director',
      listTitle: 'My Requests', newRequestBtnText: 'New request', backToListText: 'My requests',
      clearAllText: 'Clear fields', emptyListHint: "You don't have any saved requests yet.",
      untitledRequest: 'Untitled request', savingStatus: 'Saving…', savedStatus: 'Saved',
      confirmClear: 'Clear all fields? Previously saved requests are not affected.',
      confirmDelete: 'Delete this request permanently?',
    },
    fr: {
      dir: 'ltr', pageTitleTag: 'Générateur de demande administrative — Académie Merabti', topbarTitle: 'Générateur de demande', toolTitle: 'Générateur de demande administrative',
      lockedTitle: 'Connectez-vous pour utiliser le générateur de demande', lockedSub: 'Cet outil est réservé aux utilisateurs inscrits.',
      tabLogin: 'Connexion', tabSignup: 'Inscription', namePh: 'Nom complet', emailPh: 'E-mail', passwordPh: 'Mot de passe',
      loginBtn: 'Connexion', signupBtn: "S'inscrire", googleBtn: 'Continuer avec Google',
      usageIndicator: (used, max) => `Utilisation aujourd'hui : ${used} sur ${max}`,
      companyCardTitle: "Logo de l'entreprise (optionnel)", companyNamePh: "Nom de l'entreprise (optionnel)",
      personalCardTitle: 'Vos informations', firstNamePh: 'Prénom', lastNamePh: 'Nom', phonePh: 'Téléphone', emailPh2: 'E-mail',
      addressedToPh: 'Adressée à (Monsieur le Directeur...)',
      extraCardTitle: 'Informations supplémentaires', extraKeyPh: 'Libellé (ex: Grade)', extraValPh: 'Valeur',
      requestCardTitle: 'Objet de la demande', requestPh: 'Décrivez brièvement votre demande (ex: congé annuel du 10 au 20 août)',
      generateBtnText: 'Générer la demande', generating: 'Génération…',
      rephraseBtnLabel: 'Reformuler', shortenBtnLabel: 'Raccourcir',
      stampCardTitle: 'Cachet et signature (optionnel)',
      download: 'Télécharger le PDF', downloading: '…',
      errNeedSubject: "Veuillez d'abord décrire l'objet de votre demande.", errNeedText: 'Aucun texte à modifier pour le moment.',
      errLimit: "Vous avez atteint la limite du jour (2 fois par 24h). Réessayez plus tard.",
      errGeneric: 'Une erreur est survenue, veuillez réessayer.',
      bodyPlaceholder: 'Le texte de votre demande apparaîtra ici après avoir cliqué sur « Générer la demande »...',
      defaultAddressed: 'Monsieur le Directeur',
      listTitle: 'Mes demandes', newRequestBtnText: 'Créer une demande', backToListText: 'Mes demandes',
      clearAllText: 'Vider les champs', emptyListHint: "Vous n'avez pas encore de demandes enregistrées.",
      untitledRequest: 'Demande sans titre', savingStatus: 'Enregistrement…', savedStatus: 'Enregistré',
      confirmClear: 'Vider tous les champs ? Les demandes déjà enregistrées ne seront pas affectées.',
      confirmDelete: 'Supprimer définitivement cette demande ?',
    },
  };

  let lang = localStorage.getItem('adminreq:lang') || 'ar';
  const t = (key) => I18N[lang][key];

  let extraFields = [];
  let companyLogoDataUrl = null;
  let stampDataUrl = null;
  let dailyUsage = { used: 0, max: 2 };

  /* ================= DOM refs ================= */
  const $ = (id) => document.getElementById(id);
  const els = {
    htmlRoot: $('htmlRoot'), pageTitleTag: $('pageTitleTag'), topbarTitle: $('topbarTitle'), toolTitle: $('toolTitle'),
    langBtns: document.querySelectorAll('.lang-btn'), usageIndicator: $('usageIndicator'),
    fontSectionLabel: $('fontSectionLabel'), fontFilter: $('fontFilter'),
    loadingScreen: $('loadingScreen'), lockedScreen: $('lockedScreen'), listScreen: $('listScreen'), editorScreen: $('editorScreen'),
    listTitle: $('listTitle'), newRequestBtn: $('newRequestBtn'), newRequestBtnText: $('newRequestBtnText'),
    savedRequestsList: $('savedRequestsList'), emptyListHint: $('emptyListHint'),
    backToListBtn: $('backToListBtn'), backToListText: $('backToListText'),
    clearAllBtn: $('clearAllBtn'), clearAllText: $('clearAllText'), saveStatusIndicator: $('saveStatusIndicator'),
    lockedTitle: $('lockedTitle'), lockedSub: $('lockedSub'),
    tabLogin: $('tabLogin'), tabSignup: $('tabSignup'), authCardForm: $('authCardForm'), authCardError: $('authCardError'),
    acName: $('acName'), acEmail: $('acEmail'), acPassword: $('acPassword'), acSubmitBtn: $('acSubmitBtn'), acGoogleBtn: $('acGoogleBtn'),
    companyCardTitle: $('companyCardTitle'), companyLogoBox: $('companyLogoBox'), companyLogoPreview: $('companyLogoPreview'),
    companyLogoInput: $('companyLogoInput'), companyLogoPlaceholder: $('companyLogoPlaceholder'),
    personalCardTitle: $('personalCardTitle'), fFirstName: $('fFirstName'), fLastName: $('fLastName'),
    fPhone: $('fPhone'), fEmail: $('fEmail'), fAddressedTo: $('fAddressedTo'), fDate: $('fDate'),
    extraCardTitle: $('extraCardTitle'), addExtraBtn: $('addExtraBtn'), extraFieldsList: $('extraFieldsList'),
    requestCardTitle: $('requestCardTitle'), fRequestSubject: $('fRequestSubject'),
    generateBtn: $('generateBtn'), generateBtnText: $('generateBtnText'),
    rephraseBtn: $('rephraseBtn'), rephraseBtnText: $('rephraseBtnText'),
    shortenBtn: $('shortenBtn'), shortenBtnText: $('shortenBtnText'),
    aiError: $('aiError'),
    stampCardTitle: $('stampCardTitle'), stampBox: $('stampBox'), stampPreview: $('stampPreview'), stampInput: $('stampInput'), stampPlaceholder: $('stampPlaceholder'),
    downloadPdfBtn: $('downloadPdfBtn'), downloadBtnText: $('downloadBtnText'),
    requestPage: $('requestPage'), reqHeader: $('reqHeader'), reqCompanyLogo: $('reqCompanyLogo'),
    reqDate: $('reqDate'),
    reqSenderFirst: $('reqSenderFirst'), reqSenderLast: $('reqSenderLast'), reqSenderPhone: $('reqSenderPhone'), reqSenderEmail: $('reqSenderEmail'),
    reqAddressed: $('reqAddressed'), reqSubjectValue: $('reqSubjectValue'), reqBody: $('reqBody'),
    reqStamp: $('reqStamp'), reqSignatureCaption: $('reqSignatureCaption'),
  };

  /* ================= Fonts (4, matching cover-page) ================= */
  const FONTS = [
    { id: 1, name: 'عصري', ar: "'Tajawal'", en: "'Inter'" },
    { id: 2, name: 'كلاسيكي', ar: "'Amiri'", en: "'Georgia'" },
    { id: 3, name: 'رسمي تقليدي', ar: "'Noto Naskh Arabic'", en: "'Georgia'" },
    { id: 4, name: 'خط اليد', ar: "'Aref Ruqaa', cursive", en: "'Caveat', cursive" },
  ];
  let activeFont = FONTS[0];
  function renderFontFilter() {
    els.fontFilter.innerHTML = FONTS.map((f) => `
      <button type="button" class="theme-swatch-btn ${f.id === activeFont.id ? 'active' : ''}" data-id="${f.id}" style="font-family:${f.ar};">${f.name}</button>
    `).join('');
    els.fontFilter.querySelectorAll('.theme-swatch-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeFont = FONTS.find((f) => f.id === parseInt(btn.getAttribute('data-id'), 10));
        renderFontFilter();
        applyFont();
        saveDraft();
      });
    });
  }
  function applyFont() {
    els.requestPage.style.setProperty('--rq-font-ar', activeFont.ar);
    els.requestPage.style.setProperty('--rq-font-en', activeFont.en);
  }

  function showScreen(name) {
    [els.loadingScreen, els.lockedScreen, els.listScreen, els.editorScreen].forEach((s) => s.classList.add('hidden'));
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

  function escapeAttr(s) { return String(s || '').replace(/"/g, '&quot;'); }

  /* ================= Persistence ================= */
  const STORAGE_KEY = 'adminreq:draft';
  function saveDraft() {
    const draft = {
      lang, activeFontId: activeFont.id, companyLogoDataUrl, stampDataUrl, extraFields,
      fFirstName: els.fFirstName.value, fLastName: els.fLastName.value,
      fPhone: els.fPhone.value, fEmail: els.fEmail.value, fAddressedTo: els.fAddressedTo.value, fDate: els.fDate.value,
      fRequestSubject: els.fRequestSubject.value, bodyText: els.reqBody.innerText, bodyIsOwned,
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)); } catch (e) { /* ignore */ }
    if (!els.editorScreen.classList.contains('hidden')) scheduleCloudSave();
  }
  function loadDraft() {
    try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; }
    catch (e) { return null; }
  }

  /* ================= Cloud persistence (multiple saved requests) ================= */
  let currentRequestId = null;
  let cloudSaveTimer = null;

  function requestsCollectionRef() {
    const user = window.fbAuth && window.fbAuth.currentUser;
    if (!user || !window.firebase || !firebase.firestore) return null;
    return firebase.firestore().collection('users').doc(user.uid).collection('adminRequests');
  }

  function collectFullState() {
    return {
      activeFontId: activeFont.id, companyLogoDataUrl, stampDataUrl, extraFields,
      fFirstName: els.fFirstName.value, fLastName: els.fLastName.value,
      fPhone: els.fPhone.value, fEmail: els.fEmail.value, fAddressedTo: els.fAddressedTo.value, fDate: els.fDate.value,
      fRequestSubject: els.fRequestSubject.value, bodyText: els.reqBody.innerText, bodyIsOwned,
    };
  }

  function applyState(state) {
    activeFont = FONTS.find((f) => f.id === state.activeFontId) || FONTS[0];
    companyLogoDataUrl = state.companyLogoDataUrl || null;
    stampDataUrl = state.stampDataUrl || null;
    extraFields = state.extraFields || [];
    els.fFirstName.value = state.fFirstName || ''; els.fLastName.value = state.fLastName || '';
    els.fPhone.value = state.fPhone || ''; els.fEmail.value = state.fEmail || '';
    els.fAddressedTo.value = state.fAddressedTo || ''; els.fDate.value = state.fDate || els.fDate.value;
    els.fRequestSubject.value = state.fRequestSubject || '';
    els.reqBody.innerText = state.bodyText || '';
    bodyIsOwned = !!state.bodyIsOwned;
    if (companyLogoDataUrl) { els.companyLogoPreview.src = companyLogoDataUrl; els.companyLogoPreview.classList.remove('hidden'); }
    else { els.companyLogoPreview.classList.add('hidden'); }
    if (stampDataUrl) { els.stampPreview.src = stampDataUrl; els.stampPreview.classList.remove('hidden'); }
    else { els.stampPreview.classList.add('hidden'); }
    renderExtraFields(); renderFontFilter(); applyFont(); renderPreview(); syncAiButtons();
  }

  function deriveTitle() {
    const subject = els.fRequestSubject.value.trim();
    if (subject) return subject.slice(0, 60);
    return t('untitledRequest');
  }

  function scheduleCloudSave() {
    if (cloudSaveTimer) clearTimeout(cloudSaveTimer);
    els.saveStatusIndicator.textContent = t('savingStatus');
    cloudSaveTimer = setTimeout(saveToCloud, 1200);
  }

  async function saveToCloud() {
    const col = requestsCollectionRef();
    if (!col) return;
    const state = collectFullState();
    const payload = Object.assign({}, state, {
      title: deriveTitle(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    try {
      if (currentRequestId) {
        await col.doc(currentRequestId).set(payload, { merge: true });
      } else {
        const docRef = await col.add(Object.assign({ createdAt: firebase.firestore.FieldValue.serverTimestamp() }, payload));
        currentRequestId = docRef.id;
      }
      els.saveStatusIndicator.textContent = t('savedStatus');
    } catch (e) {
      els.saveStatusIndicator.textContent = '';
    }
  }

  function clearFormFields() {
    activeFont = FONTS[0];
    companyLogoDataUrl = null; stampDataUrl = null; extraFields = [];
    els.fFirstName.value = ''; els.fLastName.value = '';
    els.fPhone.value = ''; els.fEmail.value = ''; els.fAddressedTo.value = '';
    const today = new Date(); els.fDate.value = today.toISOString().slice(0, 10);
    els.fRequestSubject.value = ''; els.reqBody.innerText = '';
    bodyIsOwned = false;
    els.companyLogoPreview.classList.add('hidden'); els.stampPreview.classList.add('hidden');
    renderExtraFields(); renderFontFilter(); applyFont(); renderPreview(); syncAiButtons();
  }

  function openNewRequest() {
    currentRequestId = null;
    clearFormFields();
    els.saveStatusIndicator.textContent = '';
    saveDraft();
    showScreen('editorScreen');
  }
  els.newRequestBtn.addEventListener('click', openNewRequest);

  els.backToListBtn.addEventListener('click', () => {
    showScreen('listScreen');
    renderSavedRequestsList();
  });

  els.clearAllBtn.addEventListener('click', () => {
    if (!confirm(t('confirmClear'))) return;
    currentRequestId = null;
    clearFormFields();
    saveDraft();
  });

  function formatRelativeDate(ts) {
    if (!ts || !ts.toDate) return '';
    const d = ts.toDate();
    const fmt = { ar: 'ar', en: 'en', fr: 'fr' }[lang];
    return d.toLocaleDateString(fmt, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  async function renderSavedRequestsList() {
    const col = requestsCollectionRef();
    els.savedRequestsList.innerHTML = '';
    if (!col) { els.emptyListHint.classList.remove('hidden'); return; }
    try {
      const snap = await col.orderBy('updatedAt', 'desc').get();
      if (snap.empty) { els.emptyListHint.classList.remove('hidden'); return; }
      els.emptyListHint.classList.add('hidden');
      snap.forEach((doc) => {
        const data = doc.data();
        const card = document.createElement('div');
        card.className = 'saved-request-card';
        card.innerHTML = `
          <div>
            <p class="saved-request-title">${escapeHtml(data.title || t('untitledRequest'))}</p>
            <p class="saved-request-date">${formatRelativeDate(data.updatedAt)}</p>
          </div>
          <button type="button" class="saved-request-delete" data-id="${doc.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          </button>
        `;
        card.addEventListener('click', (e) => {
          if (e.target.closest('.saved-request-delete')) return;
          currentRequestId = doc.id;
          applyState(data);
          els.saveStatusIndicator.textContent = '';
          showScreen('editorScreen');
        });
        card.querySelector('.saved-request-delete').addEventListener('click', async (e) => {
          e.stopPropagation();
          if (!confirm(t('confirmDelete'))) return;
          await col.doc(doc.id).delete();
          renderSavedRequestsList();
        });
        els.savedRequestsList.appendChild(card);
      });
    } catch (e) {
      els.emptyListHint.classList.remove('hidden');
    }
  }

  /* ================= Logo / stamp uploads ================= */
  function setupUpload(box, input, preview, placeholder, setUrl) {
    box.addEventListener('click', () => input.click());
    input.addEventListener('change', () => {
      const file = input.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        setUrl(e.target.result);
        preview.src = e.target.result; preview.classList.remove('hidden');
        if (placeholder) placeholder.classList.add('hidden');
        renderPreview(); saveDraft();
      };
      reader.readAsDataURL(file);
    });
  }
  setupUpload(els.companyLogoBox, els.companyLogoInput, els.companyLogoPreview, els.companyLogoPlaceholder, (u) => { companyLogoDataUrl = u; });
  setupUpload(els.stampBox, els.stampInput, els.stampPreview, els.stampPlaceholder, (u) => { stampDataUrl = u; });

  /* ================= Extra fields ================= */
  function renderExtraFields() {
    els.extraFieldsList.innerHTML = extraFields.map((f, i) => `
      <div class="dyn-row">
        <input type="text" class="cv-input extra-key" data-i="${i}" placeholder="${t('extraKeyPh')}" value="${escapeAttr(f.key)}" style="flex:1;">
        <input type="text" class="cv-input extra-val" data-i="${i}" placeholder="${t('extraValPh')}" value="${escapeAttr(f.val)}" style="flex:1.4;">
        <button type="button" class="dyn-row-remove" data-i="${i}">×</button>
      </div>`).join('');
    els.extraFieldsList.querySelectorAll('.extra-key').forEach((inp) => inp.addEventListener('input', () => { extraFields[+inp.dataset.i].key = inp.value; saveDraft(); }));
    els.extraFieldsList.querySelectorAll('.extra-val').forEach((inp) => inp.addEventListener('input', () => { extraFields[+inp.dataset.i].val = inp.value; saveDraft(); }));
    els.extraFieldsList.querySelectorAll('.dyn-row-remove').forEach((btn) => btn.addEventListener('click', () => {
      extraFields.splice(parseInt(btn.getAttribute('data-i'), 10), 1); renderExtraFields(); saveDraft();
    }));
  }
  els.addExtraBtn.addEventListener('click', () => { extraFields.push({ key: '', val: '' }); renderExtraFields(); saveDraft(); });

  /* ================= Default example values (shown as real placeholders) ================= */
  const DEFAULTS = {
    firstName: 'سفيان', lastName: 'مرابطي', phone: '0555 12 34 56', email: 'sofiane@email.com',
    addressedTo: 'السيد المدير المحترم', subject: 'أطلب إجازة سنوية من 10 إلى 20 أوت',
  };

  /* ================= Live preview ================= */
  let bodyIsOwned = false; // true once AI-generated or manually edited — stops auto-mirroring the subject draft

  function renderPreview() {
    if (companyLogoDataUrl) {
      els.reqCompanyLogo.src = companyLogoDataUrl; els.reqCompanyLogo.classList.remove('hidden');
      els.reqHeader.classList.remove('hidden');
    } else {
      els.reqCompanyLogo.classList.add('hidden');
      els.reqHeader.classList.add('hidden');
    }

    const d = els.fDate.value ? new Date(els.fDate.value + 'T12:00:00') : new Date();
    const dateFmt = { ar: 'ar', en: 'en', fr: 'fr' }[lang];
    els.reqDate.textContent = d.toLocaleDateString(dateFmt, { year: 'numeric', month: 'long', day: 'numeric' });

    els.reqSenderFirst.textContent = els.fFirstName.value.trim() || DEFAULTS.firstName;
    els.reqSenderLast.textContent = els.fLastName.value.trim() || DEFAULTS.lastName;
    els.reqSenderPhone.textContent = els.fPhone.value.trim() || DEFAULTS.phone;
    els.reqSenderEmail.textContent = els.fEmail.value.trim() || DEFAULTS.email;

    els.reqAddressed.textContent = els.fAddressedTo.value.trim() || DEFAULTS.addressedTo;
    els.reqSubjectValue.textContent = els.fRequestSubject.value.trim() || DEFAULTS.subject;

    if (stampDataUrl) { els.reqStamp.src = stampDataUrl; els.reqStamp.classList.remove('hidden'); }
    else { els.reqStamp.classList.add('hidden'); }

    els.reqBody.setAttribute('data-placeholder', t('bodyPlaceholder'));
  }
  [els.fFirstName, els.fLastName, els.fPhone, els.fEmail, els.fAddressedTo, els.fDate].forEach((inp) => {
    inp.addEventListener('input', () => { renderPreview(); saveDraft(); });
  });

  // Live-mirror the subject textarea into the body preview as a draft, until the body becomes "owned"
  els.fRequestSubject.addEventListener('input', () => {
    if (!bodyIsOwned) {
      els.reqBody.innerText = els.fRequestSubject.value;
      syncAiButtons();
    }
    saveDraft();
  });

  els.reqBody.addEventListener('input', () => { bodyIsOwned = els.reqBody.innerText.trim().length > 0; saveDraft(); syncAiButtons(); });

  function syncAiButtons() {
    const hasText = els.reqBody.innerText.trim().length > 0;
    els.rephraseBtn.disabled = !hasText;
    els.shortenBtn.disabled = !hasText;
  }

  /* ================= AI generation ================= */
  function showAiError(msg) { els.aiError.textContent = msg; els.aiError.classList.remove('hidden'); }
  function hideAiError() { els.aiError.classList.add('hidden'); }

  async function callAi(mode) {
    hideAiError();
    if (mode === 'generate' && !els.fRequestSubject.value.trim()) { showAiError(t('errNeedSubject')); return; }
    if (mode !== 'generate' && !els.reqBody.innerText.trim()) { showAiError(t('errNeedText')); return; }

    const btn = mode === 'generate' ? els.generateBtn : mode === 'rephrase' ? els.rephraseBtn : els.shortenBtn;
    btn.disabled = true;
    if (mode === 'generate') els.generateBtnText.textContent = t('generating');
    else btn.style.opacity = '.5';

    try {
      const user = window.fbAuth && window.fbAuth.currentUser;
      if (!user) throw new Error('not-authed');

      const payload = {
        mode, lang,
        firstName: els.fFirstName.value.trim(), lastName: els.fLastName.value.trim(),
        phone: els.fPhone.value.trim(), email: els.fEmail.value.trim(),
        addressedTo: els.fAddressedTo.value.trim(),
        requestSubject: els.fRequestSubject.value.trim(),
        extraFields: extraFields.filter((f) => f.key.trim() || f.val.trim()),
        currentText: els.reqBody.innerText.trim(),
      };

      const callable = firebase.functions().httpsCallable('generateAdminRequest');
      const result = await callable(payload);
      const data = result.data;
      if (!data || !data.text) throw new Error('no-text');

      els.reqBody.innerText = data.text;
      bodyIsOwned = true;
      if (typeof data.usedToday === 'number') { dailyUsage.used = data.usedToday; updateUsageIndicator(); }
      syncAiButtons();
      saveDraft();
    } catch (e) {
      if (e && e.code === 'functions/resource-exhausted') { showAiError(t('errLimit')); }
      else { showAiError(t('errGeneric')); }
    } finally {
      btn.disabled = false;
      btn.style.opacity = '';
      if (mode === 'generate') els.generateBtnText.textContent = t('generateBtnText');
    }
  }
  els.generateBtn.addEventListener('click', () => callAi('generate'));
  els.rephraseBtn.addEventListener('click', () => callAi('rephrase'));
  els.shortenBtn.addEventListener('click', () => callAi('shorten'));

  function updateUsageIndicator() {
    els.usageIndicator.textContent = t('usageIndicator')(dailyUsage.used, dailyUsage.max);
  }

  /* ================= PDF export ================= */
  els.downloadPdfBtn.addEventListener('click', async () => {
    const original = els.downloadBtnText.textContent;
    els.downloadPdfBtn.disabled = true; els.downloadBtnText.textContent = t('downloading');
    try {
      const canvas = await html2canvas(els.requestPage, { scale: 3, backgroundColor: '#ffffff', useCORS: true });
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgProps = pdf.getImageProperties(canvas.toDataURL('image/png'));
      const pdfW = 210;
      const pdfH = (imgProps.height * pdfW) / imgProps.width;
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfW, Math.min(pdfH, 297));
      pdf.save('admin-request.pdf');
    } catch (e) { alert('---'); }
    els.downloadPdfBtn.disabled = false; els.downloadBtnText.textContent = original;
  });

  /* ================= i18n apply ================= */
  function applyLanguage() {
    const dict = I18N[lang];
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dict.dir);
    els.pageTitleTag.textContent = dict.pageTitleTag; document.title = dict.pageTitleTag;
    els.topbarTitle.textContent = dict.topbarTitle; els.toolTitle.textContent = dict.toolTitle;
    els.lockedTitle.textContent = dict.lockedTitle; els.lockedSub.textContent = dict.lockedSub;
    els.tabLogin.textContent = dict.tabLogin; els.tabSignup.textContent = dict.tabSignup;
    els.acName.placeholder = dict.namePh; els.acEmail.placeholder = dict.emailPh; els.acPassword.placeholder = dict.passwordPh;
    els.acGoogleBtn.querySelector('span').textContent = dict.googleBtn;
    els.companyCardTitle.textContent = dict.companyCardTitle;
    els.personalCardTitle.textContent = dict.personalCardTitle;
    els.fFirstName.placeholder = dict.firstNamePh; els.fLastName.placeholder = dict.lastNamePh;
    els.fPhone.placeholder = dict.phonePh; els.fEmail.placeholder = dict.emailPh2;
    els.fAddressedTo.placeholder = dict.addressedToPh;
    els.extraCardTitle.textContent = dict.extraCardTitle;
    els.requestCardTitle.textContent = dict.requestCardTitle; els.fRequestSubject.placeholder = dict.requestPh;
    els.generateBtnText.textContent = dict.generateBtnText;
    els.rephraseBtnText.textContent = dict.rephraseBtnLabel;
    els.shortenBtnText.textContent = dict.shortenBtnLabel;
    els.stampCardTitle.textContent = dict.stampCardTitle;
    els.downloadBtnText.textContent = dict.download;
    els.listTitle.textContent = dict.listTitle;
    els.newRequestBtnText.textContent = dict.newRequestBtnText;
    els.backToListText.textContent = dict.backToListText;
    els.clearAllText.textContent = dict.clearAllText;
    els.emptyListHint.textContent = dict.emptyListHint;
    els.langBtns.forEach((b) => b.classList.toggle('active', b.getAttribute('data-lang') === lang));
    localStorage.setItem('adminreq:lang', lang);

    updateAuthFormMode(els.tabLogin.classList.contains('active') ? 'login' : 'signup');
    renderExtraFields(); renderFontFilter(); renderPreview(); updateUsageIndicator();
  }
  els.langBtns.forEach((btn) => btn.addEventListener('click', () => { lang = btn.getAttribute('data-lang'); applyLanguage(); saveDraft(); }));

  /* ================= Init ================= */
  function init() {
    const draft = loadDraft();
    if (!els.fDate.value) {
      const today = new Date();
      els.fDate.value = today.toISOString().slice(0, 10);
    }
    if (draft) {
      lang = draft.lang || lang;
      activeFont = FONTS.find((f) => f.id === draft.activeFontId) || FONTS[0];
      companyLogoDataUrl = draft.companyLogoDataUrl || null;
      stampDataUrl = draft.stampDataUrl || null;
      extraFields = draft.extraFields || [];
      els.fFirstName.value = draft.fFirstName || ''; els.fLastName.value = draft.fLastName || '';
      els.fPhone.value = draft.fPhone || ''; els.fEmail.value = draft.fEmail || '';
      els.fAddressedTo.value = draft.fAddressedTo || ''; els.fDate.value = draft.fDate || els.fDate.value;
      els.fRequestSubject.value = draft.fRequestSubject || '';
      els.reqBody.innerText = draft.bodyText || '';
      bodyIsOwned = !!draft.bodyIsOwned;
      if (companyLogoDataUrl) { els.companyLogoPreview.src = companyLogoDataUrl; els.companyLogoPreview.classList.remove('hidden'); }
      if (stampDataUrl) { els.stampPreview.src = stampDataUrl; els.stampPreview.classList.remove('hidden'); }
    }
    applyLanguage();
    applyFont();
    syncAiButtons();
  }

  init();

  if (window.fbAuth) {
    window.fbAuth.onAuthStateChanged((fbUser) => {
      if (fbUser) {
        showScreen('listScreen');
        renderSavedRequestsList();
      } else {
        showScreen('lockedScreen');
      }
    });
  } else {
    showScreen('lockedScreen');
  }
})();
