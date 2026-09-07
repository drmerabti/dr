// ============================================================
// app.js — Memo Organizer (upload docx, AI classify, review, export)
// ============================================================

(function () {
  "use strict";

  /* ================= i18n ================= */
  const I18N = {
    ar: {
      dir: 'rtl', pageTitleTag: 'تنظيم المذكرات — أكاديمية مرابطي', topbarTitle: 'تنظيم المذكرات',
      lockedTitle: 'سجّل دخولك لاستخدام أداة تنظيم المذكرات', lockedSub: 'هذه الأداة متاحة للمستخدمين المسجَّلين فقط.',
      tabLogin: 'تسجيل الدخول', tabSignup: 'إنشاء حساب', namePh: 'الاسم الكامل', emailPh: 'البريد الإلكتروني', passwordPh: 'كلمة المرور',
      loginBtn: 'تسجيل الدخول', signupBtn: 'إنشاء حساب', googleBtn: 'المتابعة عبر Google',
      uploadTitle: 'تنظيم المذكرات', uploadSubtitle: 'ارفع مذكرتك، لتُنظَّم تلقائيًا بمساعدة الذكاء الاصطناعي',
      dropZoneText: 'اسحب ملف Word هنا أو اضغط لاختياره', uploadHint: 'ملفات Word (.docx) فقط حاليًا',
      analyzingText: 'جارٍ تحليل المذكرة...', errNeedDocx: 'يجب أن يكون الملف بصيغة .docx.',
      errAnalyzeFailed: 'حدث خطأ أثناء التحليل، حاول مرة أخرى.', errEmptyDoc: 'لم يُعثر على أي نص في الملف.',
      reviewTitle: 'مراجعة التصنيف', newFileText: 'ملف جديد', styleLabel: 'قالب التنسيق',
      tocBtnText: 'إنشاء فهرس تلقائي', unlockBtnText: 'فتح النسخ والتحميل',
      typeH1: 'عنوان رئيسي', typeH2: 'عنوان فرعي', typeH3: 'عنوان فرعي ثانٍ', typeBody: 'فقرة', typeTable: 'جدول (محفوظ)', typeImage: 'صورة (محفوظة)',
      tocModalTitle: 'اختر نوع الفهرس', tocHeadingsText: 'فهرس العناوين', tocTablesText: 'فهرس الجداول', tocFiguresText: 'فهرس الأشكال',
      cancelBtn: 'إلغاء', paymentModalTitle: 'فتح النسخ والتحميل',
      paymentModalHint: 'دفعة واحدة لهذا الملف — تفتح النسخ والتحميل الكامل.',
      priceValue: '200 دج', payNowText: 'الدفع (قريبًا)',
      watermarkText: 'معاينة فقط', noHeadingsFound: 'لا يوجد أي عنوان في المستند.',
      noTablesFound: 'لا يوجد أي جدول في المستند.', noFiguresFound: 'لا يوجد أي صورة في المستند.',
      styleModern: 'عصري', styleClassic: 'كلاسيكي', styleFormal: 'رسمي',
      fontSizeLabel: 'حجم الخط', removeTocBtn: 'حذف الفهرس', downloadWordText: 'تحميل Word', downloadPdfText: 'تحميل PDF',
      pageNumBtnText: 'ترقيم الصفحات', pageNumModalTitle: 'ترقيم الصفحات',
      pageNumEnableLabel: 'تفعيل الترقيم', pageNumOnOpt: 'مفعَّل', pageNumOffOpt: 'معطَّل',
      pageNumStyleLabel: 'نمط الترقيم', pageNumStyleNumericOpt: 'أرقام عادية (1، 2، 3)',
      pageNumStyleRomanOpt: 'أرقام رومانية (I، II، III)', pageNumStyleLettersOpt: 'حروف عربية (أ، ب، ج)',
      pageNumRangeLabel: 'نطاق الترقيم (اختياري)', pageNumExcludeLabel: 'استثناء صفحات (اختياري، مفصولة بفاصلة)', saveBtn: 'حفظ',
    },
    en: {
      dir: 'ltr', pageTitleTag: 'Memo Organizer — Merabti Academy', topbarTitle: 'Memo Organizer',
      lockedTitle: 'Sign in to use the Memo Organizer', lockedSub: 'This tool is available to registered users only.',
      tabLogin: 'Log In', tabSignup: 'Sign Up', namePh: 'Full name', emailPh: 'Email', passwordPh: 'Password',
      loginBtn: 'Log In', signupBtn: 'Sign Up', googleBtn: 'Continue with Google',
      uploadTitle: 'Memo Organizer', uploadSubtitle: 'Upload your memo, and let AI organize it automatically',
      dropZoneText: 'Drag a Word file here or click to choose', uploadHint: 'Word files (.docx) only for now',
      analyzingText: 'Analyzing the memo...', errNeedDocx: 'The file must be a .docx.',
      errAnalyzeFailed: 'Something went wrong analyzing it, try again.', errEmptyDoc: "Couldn't find any text in the file.",
      reviewTitle: 'Review classification', newFileText: 'New file', styleLabel: 'Format template',
      tocBtnText: 'Generate table of contents', unlockBtnText: 'Unlock copy & download',
      typeH1: 'Heading 1', typeH2: 'Heading 2', typeH3: 'Heading 3', typeBody: 'Body text', typeTable: 'Table (kept)', typeImage: 'Image (kept)',
      tocModalTitle: 'Choose a list type', tocHeadingsText: 'Table of contents', tocTablesText: 'List of tables', tocFiguresText: 'List of figures',
      cancelBtn: 'Cancel', paymentModalTitle: 'Unlock copy & download',
      paymentModalHint: 'A one-time payment for this file — unlocks full copy and download as a formatted PDF.',
      priceValue: '$1.50', payNowText: 'Pay (coming soon)',
      watermarkText: 'Preview only', noHeadingsFound: 'No headings found in the document.',
      noTablesFound: 'No tables found in the document.', noFiguresFound: 'No images found in the document.',
      styleModern: 'Modern', styleClassic: 'Classic', styleFormal: 'Formal',
      fontSizeLabel: 'Font size', removeTocBtn: 'Remove list', downloadWordText: 'Download Word', downloadPdfText: 'Download PDF',
      pageNumBtnText: 'Page numbering', pageNumModalTitle: 'Page numbering',
      pageNumEnableLabel: 'Enable numbering', pageNumOnOpt: 'On', pageNumOffOpt: 'Off',
      pageNumStyleLabel: 'Numbering style', pageNumStyleNumericOpt: 'Numeric (1, 2, 3)',
      pageNumStyleRomanOpt: 'Roman numerals (I, II, III)', pageNumStyleLettersOpt: 'Arabic letters (أ, ب, ج)',
      pageNumRangeLabel: 'Numbering range (optional)', pageNumExcludeLabel: 'Exclude pages (optional, comma-separated)', saveBtn: 'Save',
    },
    fr: {
      dir: 'ltr', pageTitleTag: 'Organisateur de mémoire — Académie Merabti', topbarTitle: 'Organisateur de mémoire',
      lockedTitle: "Connectez-vous pour utiliser l'organisateur de mémoire", lockedSub: 'Cet outil est réservé aux utilisateurs inscrits.',
      tabLogin: 'Connexion', tabSignup: 'Inscription', namePh: 'Nom complet', emailPh: 'E-mail', passwordPh: 'Mot de passe',
      loginBtn: 'Connexion', signupBtn: "S'inscrire", googleBtn: 'Continuer avec Google',
      uploadTitle: 'Organisateur de mémoire', uploadSubtitle: 'Téléversez votre mémoire, et laissez l\'IA l\'organiser automatiquement',
      dropZoneText: 'Glissez un fichier Word ici ou cliquez pour choisir', uploadHint: 'Fichiers Word (.docx) uniquement pour le moment',
      analyzingText: 'Analyse du mémoire...', errNeedDocx: 'Le fichier doit être au format .docx.',
      errAnalyzeFailed: "Une erreur s'est produite pendant l'analyse, réessayez.", errEmptyDoc: "Aucun texte trouvé dans le fichier.",
      reviewTitle: 'Vérifier la classification', newFileText: 'Nouveau fichier', styleLabel: 'Modèle de mise en forme',
      tocBtnText: 'Générer une table des matières', unlockBtnText: 'Débloquer copie et téléchargement',
      typeH1: 'Titre 1', typeH2: 'Titre 2', typeH3: 'Titre 3', typeBody: 'Texte', typeTable: 'Tableau (conservé)', typeImage: 'Image (conservée)',
      tocModalTitle: 'Choisissez un type de liste', tocHeadingsText: 'Table des matières', tocTablesText: 'Liste des tableaux', tocFiguresText: 'Liste des figures',
      cancelBtn: 'Annuler', paymentModalTitle: 'Débloquer copie et téléchargement',
      paymentModalHint: 'Un paiement unique pour ce fichier — débloque la copie et le téléchargement complet en PDF formaté.',
      priceValue: '200 DA', payNowText: 'Payer (bientôt)',
      watermarkText: 'Aperçu seulement', noHeadingsFound: 'Aucun titre trouvé dans le document.',
      noTablesFound: 'Aucun tableau trouvé dans le document.', noFiguresFound: 'Aucune image trouvée dans le document.',
      styleModern: 'Moderne', styleClassic: 'Classique', styleFormal: 'Formel',
      fontSizeLabel: 'Taille de police', removeTocBtn: 'Supprimer la liste', downloadWordText: 'Télécharger Word', downloadPdfText: 'Télécharger PDF',
      pageNumBtnText: 'Numérotation des pages', pageNumModalTitle: 'Numérotation des pages',
      pageNumEnableLabel: 'Activer la numérotation', pageNumOnOpt: 'Activée', pageNumOffOpt: 'Désactivée',
      pageNumStyleLabel: 'Style de numérotation', pageNumStyleNumericOpt: 'Numérique (1, 2, 3)',
      pageNumStyleRomanOpt: 'Chiffres romains (I, II, III)', pageNumStyleLettersOpt: 'Lettres arabes (أ, ب, ج)',
      pageNumRangeLabel: 'Plage de numérotation (optionnel)', pageNumExcludeLabel: 'Exclure des pages (optionnel, séparées par des virgules)', saveBtn: 'Enregistrer',
    },
  };

  let lang = localStorage.getItem('mo:lang') || 'ar';
  const t = (key) => I18N[lang][key];

  const STYLE_PRESETS = [
    { id: 'modern', font: "'Tajawal', sans-serif", headingColor: '#2F5CA8' },
    { id: 'classic', font: "'Amiri', serif", headingColor: '#3C2E1E' },
    { id: 'formal', font: "'Noto Naskh Arabic', serif", headingColor: '#1E2F40' },
  ];
  let activeStyle = STYLE_PRESETS[0];

  /* ================= DOM refs ================= */
  const $ = (id) => document.getElementById(id);
  const els = {
    htmlRoot: $('htmlRoot'), pageTitleTag: $('pageTitleTag'), topbarTitle: $('topbarTitle'),
    langBtns: document.querySelectorAll('.lang-btn'),
    loadingScreen: $('loadingScreen'), lockedScreen: $('lockedScreen'), uploadScreen: $('uploadScreen'), reviewScreen: $('reviewScreen'),
    lockedTitle: $('lockedTitle'), lockedSub: $('lockedSub'),
    tabLogin: $('tabLogin'), tabSignup: $('tabSignup'), authCardForm: $('authCardForm'), authCardError: $('authCardError'),
    acName: $('acName'), acEmail: $('acEmail'), acPassword: $('acPassword'), acSubmitBtn: $('acSubmitBtn'), acGoogleBtn: $('acGoogleBtn'),
    uploadTitle: $('uploadTitle'), uploadSubtitle: $('uploadSubtitle'),
    dropZone: $('dropZone'), dropZoneText: $('dropZoneText'), fileInput: $('fileInput'),
    uploadHint: $('uploadHint'), uploadError: $('uploadError'), analyzingBox: $('analyzingBox'), analyzingText: $('analyzingText'),
    reviewTitle: $('reviewTitle'), newFileBtn: $('newFileBtn'), newFileText: $('newFileText'),
    styleLabel: $('styleLabel'), styleRow: $('styleRow'), blocksList: $('blocksList'),
    tocBtn: $('tocBtn'), tocBtnText: $('tocBtnText'),
    fontSizeLabel: $('fontSizeLabel'), fontSizeDownBtn: $('fontSizeDownBtn'), fontSizeValue: $('fontSizeValue'), fontSizeUpBtn: $('fontSizeUpBtn'),
    downloadWordBtn: $('downloadWordBtn'), downloadWordText: $('downloadWordText'),
    downloadPdfBtn: $('downloadPdfBtn'), downloadPdfText: $('downloadPdfText'),
    bookSpread: $('bookSpread'),
    pageSheetLeft: $('pageSheetLeft'), docPreviewLeft: $('docPreviewLeft'), watermarkTextLeft: $('watermarkTextLeft'), pageNumberLeft: $('pageNumberLeft'),
    pageSheetRight: $('pageSheetRight'), docPreviewRight: $('docPreviewRight'), watermarkTextRight: $('watermarkTextRight'), pageNumberRight: $('pageNumberRight'),
    pageNav: $('pageNav'), measureBox: $('measureBox'),
    pageNumBtn: $('pageNumBtn'), pageNumBtnText: $('pageNumBtnText'),
    pageNumModalOverlay: $('pageNumModalOverlay'), pageNumModalTitle: $('pageNumModalTitle'),
    pageNumEnableLabel: $('pageNumEnableLabel'), pageNumEnableSelect: $('pageNumEnableSelect'),
    pageNumOnOpt: $('pageNumOnOpt'), pageNumOffOpt: $('pageNumOffOpt'),
    pageNumStyleLabel: $('pageNumStyleLabel'), pageNumStyleSelect: $('pageNumStyleSelect'),
    pageNumStyleNumericOpt: $('pageNumStyleNumericOpt'), pageNumStyleRomanOpt: $('pageNumStyleRomanOpt'), pageNumStyleLettersOpt: $('pageNumStyleLettersOpt'),
    pageNumRangeLabel: $('pageNumRangeLabel'), pageNumFromInput: $('pageNumFromInput'), pageNumToInput: $('pageNumToInput'),
    pageNumExcludeLabel: $('pageNumExcludeLabel'), pageNumExcludeInput: $('pageNumExcludeInput'),
    pageNumCancelBtn: $('pageNumCancelBtn'), pageNumSaveBtn: $('pageNumSaveBtn'),
    tocModalOverlay: $('tocModalOverlay'), tocModalTitle: $('tocModalTitle'),
    tocHeadingsBtn: $('tocHeadingsBtn'), tocHeadingsText: $('tocHeadingsText'),
    tocTablesBtn: $('tocTablesBtn'), tocTablesText: $('tocTablesText'),
    tocFiguresBtn: $('tocFiguresBtn'), tocFiguresText: $('tocFiguresText'), tocCancelBtn: $('tocCancelBtn'),
    paymentModalOverlay: $('paymentModalOverlay'), paymentModalTitle: $('paymentModalTitle'), paymentModalHint: $('paymentModalHint'),
    priceValue: $('priceValue'), payNowBtn: $('payNowBtn'), payNowText: $('payNowText'), paymentCancelBtn: $('paymentCancelBtn'),
  };

  function showScreen(name) {
    [els.loadingScreen, els.lockedScreen, els.uploadScreen, els.reviewScreen].forEach((s) => s.classList.add('hidden'));
    els[name].classList.remove('hidden');
  }
  function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

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

  /* ================= DOCX parsing ================= */
  let blocks = []; // { id, type: 'h1'|'h2'|'h3'|'body'|'table'|'image'|'toc', text, rows, dataUrl }
  let unlocked = false;
  let fontSizePt = 12;

  async function parseDocx(file) {
    const zip = await JSZip.loadAsync(file);
    const docXmlStr = await zip.file('word/document.xml').async('string');
    const parser = new DOMParser();
    const doc = parser.parseFromString(docXmlStr, 'application/xml');
    const W_NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

    // Load relationships to resolve image references
    let rels = {};
    try {
      const relsStr = await zip.file('word/_rels/document.xml.rels').async('string');
      const relsDoc = parser.parseFromString(relsStr, 'application/xml');
      Array.from(relsDoc.getElementsByTagName('Relationship')).forEach((r) => {
        rels[r.getAttribute('Id')] = r.getAttribute('Target');
      });
    } catch (e) { /* no rels file */ }

    const body = doc.getElementsByTagNameNS(W_NS, 'body')[0] || doc.documentElement;
    const topLevel = Array.from(body.childNodes).filter((n) => n.nodeType === 1);

    const result = [];
    let blockIdCounter = 0;

    for (const node of topLevel) {
      const tag = node.localName;
      if (tag === 'p') {
        // Check for a drawing (image) inside this paragraph
        const blips = node.getElementsByTagNameNS('http://schemas.openxmlformats.org/drawingml/2006/main', 'blip');
        if (blips.length > 0) {
          const embedId = blips[0].getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'embed');
          const target = rels[embedId];
          if (target) {
            try {
              const mediaPath = 'word/' + target.replace(/^\.?\//, '').replace(/^word\//, '');
              const imgFile = zip.file(mediaPath) || zip.file('word/' + target);
              if (imgFile) {
                const base64 = await imgFile.async('base64');
                const ext = mediaPath.split('.').pop().toLowerCase();
                const mime = ext === 'png' ? 'image/png' : ext === 'gif' ? 'image/gif' : 'image/jpeg';
                result.push({ id: 'b' + (blockIdCounter++), type: 'image', dataUrl: `data:${mime};base64,${base64}` });
                continue;
              }
            } catch (e) { /* skip broken image */ }
          }
        }

        // Extract text + formatting hints
        const texts = Array.from(node.getElementsByTagNameNS(W_NS, 't')).map((tNode) => tNode.textContent);
        const text = texts.join('').trim();
        if (!text) continue;

        let maxSize = 22; // default ~11pt in half-points
        let isBold = false;
        const rPrs = node.getElementsByTagNameNS(W_NS, 'rPr');
        Array.from(rPrs).forEach((rPr) => {
          const szEl = rPr.getElementsByTagNameNS(W_NS, 'sz')[0];
          if (szEl) { const v = parseInt(szEl.getAttributeNS(W_NS, 'val'), 10); if (v > maxSize) maxSize = v; }
          const bEl = rPr.getElementsByTagNameNS(W_NS, 'b')[0];
          if (bEl) { const v = bEl.getAttributeNS(W_NS, 'val'); if (v === undefined || v === null || v === '1' || v === 'true') isBold = true; }
        });

        result.push({ id: 'b' + (blockIdCounter++), type: null, text, fontSize: maxSize / 2, bold: isBold });
      } else if (tag === 'tbl') {
        const rows = [];
        Array.from(node.getElementsByTagNameNS(W_NS, 'tr')).forEach((tr) => {
          const cells = Array.from(tr.getElementsByTagNameNS(W_NS, 'tc')).map((tc) => {
            const cellTexts = Array.from(tc.getElementsByTagNameNS(W_NS, 't')).map((tNode) => tNode.textContent);
            return cellTexts.join('');
          });
          rows.push(cells);
        });
        result.push({ id: 'b' + (blockIdCounter++), type: 'table', rows });
      }
    }
    return result;
  }

  /* ================= AI classification ================= */
  async function classifyBlocks(rawBlocks) {
    // Only send text paragraphs (tables/images already have a fixed type)
    const textBlocks = rawBlocks.filter((b) => b.type === null);
    if (textBlocks.length === 0) return rawBlocks;

    const payload = textBlocks.map((b) => ({ id: b.id, text: b.text.slice(0, 200), fontSize: b.fontSize, bold: b.bold }));

    try {
      const fn = firebase.functions().httpsCallable('classifyMemoBlocks');
      const res = await fn({ blocks: payload, lang });
      const classifications = res.data && res.data.classifications ? res.data.classifications : {};
      rawBlocks.forEach((b) => {
        if (b.type === null) b.type = classifications[b.id] || 'body';
      });
    } catch (e) {
      console.error('[memo] classification failed, falling back to heuristic:', e);
      // Fallback heuristic if the Cloud Function isn't deployed yet or fails
      rawBlocks.forEach((b) => {
        if (b.type === null) {
          if (b.bold && b.fontSize >= 15) b.type = 'h1';
          else if (b.bold && b.fontSize >= 13) b.type = 'h2';
          else b.type = 'body';
        }
      });
    }
    return rawBlocks;
  }

  /* ================= Upload handling ================= */
  els.dropZone.addEventListener('click', () => els.fileInput.click());
  els.dropZone.addEventListener('dragover', (e) => { e.preventDefault(); els.dropZone.style.borderColor = 'var(--accent)'; });
  els.dropZone.addEventListener('dragleave', () => { els.dropZone.style.borderColor = ''; });
  els.dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    els.dropZone.style.borderColor = '';
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  });
  els.fileInput.addEventListener('change', () => { if (els.fileInput.files[0]) handleFile(els.fileInput.files[0]); });

  async function handleFile(file) {
    els.uploadError.classList.add('hidden');
    if (!file.name.toLowerCase().endsWith('.docx')) {
      els.uploadError.textContent = t('errNeedDocx');
      els.uploadError.classList.remove('hidden');
      return;
    }
    els.analyzingBox.classList.remove('hidden');
    els.dropZone.style.pointerEvents = 'none';
    try {
      const rawBlocks = await parseDocx(file);
      if (rawBlocks.length === 0) {
        els.uploadError.textContent = t('errEmptyDoc');
        els.uploadError.classList.remove('hidden');
        els.analyzingBox.classList.add('hidden');
        els.dropZone.style.pointerEvents = '';
        return;
      }
      blocks = await classifyBlocks(rawBlocks);
      unlocked = false;
      renderStyleRow();
      renderBlocksList();
      renderPreview();
      showScreen('reviewScreen');
    } catch (e) {
      console.error('[memo] parse/classify failed:', e);
      els.uploadError.textContent = t('errAnalyzeFailed');
      els.uploadError.classList.remove('hidden');
    }
    els.analyzingBox.classList.add('hidden');
    els.dropZone.style.pointerEvents = '';
  }

  els.newFileBtn.addEventListener('click', () => {
    blocks = []; unlocked = false; currentPageIndex = 0;
    els.fileInput.value = '';
    showScreen('uploadScreen');
  });

  /* ================= Style presets ================= */
  function renderStyleRow() {
    els.styleRow.innerHTML = STYLE_PRESETS.map((s) => `
      <button type="button" class="mo-style-chip ${activeStyle.id === s.id ? 'active' : ''}" data-id="${s.id}">${t('style' + s.id.charAt(0).toUpperCase() + s.id.slice(1))}</button>
    `).join('');
    els.styleRow.querySelectorAll('.mo-style-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        activeStyle = STYLE_PRESETS.find((s) => s.id === chip.getAttribute('data-id'));
        renderStyleRow();
        renderPreview();
      });
    });
  }

  /* ================= Blocks list (correction column) ================= */
  const TYPE_ICONS = {
    h1: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h10M4 18h7"/></svg>`,
    h2: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10h16M4 16h10"/></svg>`,
    h3: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16M4 17h7"/></svg>`,
    body: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h10"/></svg>`,
    table: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 10h18M9 4v16"/></svg>`,
    image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="1"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-4 4-3-3-6 6"/></svg>`,
  };

  function renderBlocksList() {
    els.blocksList.innerHTML = blocks.map((b) => {
      if (b.type === 'toc') {
        return `
        <div class="mo-block-row type-toc" data-id="${b.id}">
          <span class="mo-block-row-icon">${TYPE_ICONS.h1}</span>
          <span class="mo-block-row-text">${escapeHtml(b.tocTitle)}</span>
          <button type="button" class="mo-block-remove-toc" data-id="${b.id}" title="${t('removeTocBtn')}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
          </button>
        </div>`;
      }
      const icon = TYPE_ICONS[b.type] || TYPE_ICONS.body;
      const label = b.type === 'table' ? t('typeTable') : b.type === 'image' ? t('typeImage')
        : (b.type === 'h1' || b.type === 'h2' || b.type === 'h3') ? escapeHtml(b.text) : escapeHtml((b.text || '').slice(0, 40));
      const canEditType = b.type !== 'table' && b.type !== 'image';
      return `
        <div class="mo-block-row type-${b.type}" data-id="${b.id}">
          <span class="mo-block-row-icon">${icon}</span>
          <span class="mo-block-row-text">${label}</span>
          ${canEditType ? `<select data-id="${b.id}">
            <option value="h1" ${b.type === 'h1' ? 'selected' : ''}>${t('typeH1')}</option>
            <option value="h2" ${b.type === 'h2' ? 'selected' : ''}>${t('typeH2')}</option>
            <option value="h3" ${b.type === 'h3' ? 'selected' : ''}>${t('typeH3')}</option>
            <option value="body" ${b.type === 'body' ? 'selected' : ''}>${t('typeBody')}</option>
          </select>` : ''}
        </div>`;
    }).join('');

    els.blocksList.querySelectorAll('.mo-block-remove-toc').forEach((btn) => {
      btn.addEventListener('click', () => removeTocBlock(btn.getAttribute('data-id')));
    });
    els.blocksList.querySelectorAll('select').forEach((sel) => {
      sel.addEventListener('change', () => {
        const b = blocks.find((x) => x.id === sel.getAttribute('data-id'));
        if (b) b.type = sel.value;
        renderBlocksList();
        renderPreview();
      });
    });
  }

  /* ================= Live preview ================= */
  function blockToHtml(b) {
    if (b.type === 'h1') return `<p class="mo-h1">${escapeHtml(b.text)}</p>`;
    if (b.type === 'h2') return `<p class="mo-h2">${escapeHtml(b.text)}</p>`;
    if (b.type === 'h3') return `<p class="mo-h3">${escapeHtml(b.text)}</p>`;
    if (b.type === 'body') return `<p class="mo-body">${escapeHtml(b.text)}</p>`;
    if (b.type === 'table') {
      const rows = b.rows.map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('');
      return `<table>${rows}</table>`;
    }
    if (b.type === 'image') return `<img src="${b.dataUrl}" alt="">`;
    if (b.type === 'toc') {
      const listHtml = b.items.map((it) => `<p class="mo-body mo-toc-item" style="${it.indent ? `margin-inline-start:${it.indent * 20}px;` : ''}">${escapeHtml(it.text)}</p>`).join('');
      return `<div class="mo-toc-block"><p class="mo-h1">${escapeHtml(b.tocTitle)}</p>${listHtml}</div>`;
    }
    return '';
  }

  /* ================= Pagination ================= */
  const PAGE_CONTENT_HEIGHT = 535; // safe content budget inside a .mo-page-sheet (650h - padding - room for page number)
  let pages = [[]];
  let currentPageIndex = 0;

  function paginateBlocks() {
    const box = els.measureBox;
    box.style.setProperty('--mo-body-font', activeStyle.font);
    box.style.setProperty('--mo-body-size', fontSizePt + 'pt');

    const newPages = [];
    let currentPageBlocks = [];
    let currentHeight = 0;

    blocks.forEach((b) => {
      box.innerHTML = blockToHtml(b);
      const h = box.offsetHeight;
      if (currentHeight + h > PAGE_CONTENT_HEIGHT && currentPageBlocks.length > 0) {
        newPages.push(currentPageBlocks);
        currentPageBlocks = [];
        currentHeight = 0;
      }
      currentPageBlocks.push(b);
      currentHeight += h;
    });
    if (currentPageBlocks.length > 0 || newPages.length === 0) newPages.push(currentPageBlocks);
    pages = newPages;
    if (currentPageIndex >= pages.length) currentPageIndex = Math.max(0, pages.length - (pages.length % 2 === 0 ? 2 : 1));
  }

  function renderPreview() {
    els.docPreviewLeft.style.setProperty('--mo-body-font', activeStyle.font);
    els.docPreviewLeft.style.setProperty('--mo-heading-color', activeStyle.headingColor);
    els.docPreviewLeft.style.setProperty('--mo-body-size', fontSizePt + 'pt');
    els.docPreviewRight.style.setProperty('--mo-body-font', activeStyle.font);
    els.docPreviewRight.style.setProperty('--mo-heading-color', activeStyle.headingColor);
    els.docPreviewRight.style.setProperty('--mo-body-size', fontSizePt + 'pt');

    paginateBlocks();
    renderCurrentSpread();
  }

  function renderCurrentSpread() {
    const leftBlocks = pages[currentPageIndex] || [];
    const rightBlocks = pages[currentPageIndex + 1] || [];
    const rightExists = currentPageIndex + 1 < pages.length;

    els.docPreviewLeft.innerHTML = leftBlocks.map(blockToHtml).join('');
    els.docPreviewRight.innerHTML = rightBlocks.map(blockToHtml).join('');
    els.pageSheetRight.classList.toggle('empty', !rightExists);

    els.watermarkTextLeft.textContent = unlocked ? '' : t('watermarkText');
    els.watermarkTextRight.textContent = (unlocked || !rightExists) ? '' : t('watermarkText');

    els.pageNumberLeft.textContent = formatPageNumber(currentPageIndex + 1);
    els.pageNumberRight.textContent = rightExists ? formatPageNumber(currentPageIndex + 2) : '';

    renderPageNav();
  }

  function renderPageNav() {
    let html = `<button type="button" class="mo-page-nav-btn" id="prevPageBtn" ${currentPageIndex <= 0 ? 'disabled' : ''}>‹</button>`;
    for (let i = 0; i < pages.length; i++) {
      const isActive = i === currentPageIndex || i === currentPageIndex + 1;
      html += `<button type="button" class="mo-page-nav-btn ${isActive ? 'active' : ''}" data-page="${i}">${i + 1}</button>`;
    }
    html += `<button type="button" class="mo-page-nav-btn" id="nextPageBtn" ${currentPageIndex + 2 >= pages.length ? 'disabled' : ''}>›</button>`;
    els.pageNav.innerHTML = html;

    els.pageNav.querySelectorAll('[data-page]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-page'), 10);
        currentPageIndex = idx % 2 === 0 ? idx : idx - 1;
        renderCurrentSpread();
      });
    });
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    if (prevBtn) prevBtn.addEventListener('click', () => { currentPageIndex = Math.max(0, currentPageIndex - 2); renderCurrentSpread(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { if (currentPageIndex + 2 < pages.length) { currentPageIndex += 2; renderCurrentSpread(); } });
  }

  /* ================= Page numbering ================= */
  let pageNumSettings = { enabled: false, style: 'numeric', from: null, to: null, exclude: [] };

  function toRoman(num) {
    const romanMap = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
    let result = '';
    for (const [val, sym] of romanMap) { while (num >= val) { result += sym; num -= val; } }
    return result;
  }
  function toArabicLetters(num) {
    const letters = ['أ', 'ب', 'ج', 'د', 'ه', 'و', 'ز', 'ح', 'ط', 'ي', 'ك', 'ل', 'م', 'ن', 'س', 'ع', 'ف', 'ص', 'ق', 'ر', 'ش', 'ت', 'ث', 'خ', 'ذ', 'ض', 'ظ', 'غ'];
    if (num <= letters.length) return letters[num - 1];
    const first = Math.floor((num - 1) / letters.length) - 1;
    const second = (num - 1) % letters.length;
    return (first >= 0 ? letters[first] : '') + letters[second];
  }
  function formatPageNumber(pageNum) {
    if (!pageNumSettings.enabled) return '';
    if (pageNumSettings.exclude.includes(pageNum)) return '';
    if (pageNumSettings.from && pageNum < pageNumSettings.from) return '';
    if (pageNumSettings.to && pageNum > pageNumSettings.to) return '';
    const rangeStart = pageNumSettings.from || 1;
    const displayNum = pageNum - rangeStart + 1;
    if (displayNum < 1) return '';
    if (pageNumSettings.style === 'roman') return toRoman(displayNum);
    if (pageNumSettings.style === 'arabicLetters') return toArabicLetters(displayNum);
    return String(displayNum);
  }

  els.pageNumBtn.addEventListener('click', () => {
    els.pageNumEnableSelect.value = pageNumSettings.enabled ? 'on' : 'off';
    els.pageNumStyleSelect.value = pageNumSettings.style;
    els.pageNumFromInput.value = pageNumSettings.from || '';
    els.pageNumToInput.value = pageNumSettings.to || '';
    els.pageNumExcludeInput.value = pageNumSettings.exclude.join(', ');
    els.pageNumModalOverlay.classList.remove('hidden');
  });
  els.pageNumCancelBtn.addEventListener('click', () => els.pageNumModalOverlay.classList.add('hidden'));
  els.pageNumModalOverlay.addEventListener('click', (e) => { if (e.target === els.pageNumModalOverlay) els.pageNumModalOverlay.classList.add('hidden'); });
  els.pageNumSaveBtn.addEventListener('click', () => {
    pageNumSettings.enabled = els.pageNumEnableSelect.value === 'on';
    pageNumSettings.style = els.pageNumStyleSelect.value;
    pageNumSettings.from = els.pageNumFromInput.value ? parseInt(els.pageNumFromInput.value, 10) : null;
    pageNumSettings.to = els.pageNumToInput.value ? parseInt(els.pageNumToInput.value, 10) : null;
    pageNumSettings.exclude = els.pageNumExcludeInput.value
      .split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
    els.pageNumModalOverlay.classList.add('hidden');
    renderCurrentSpread();
  });

  /* ================= TOC generation ================= */
  els.tocBtn.addEventListener('click', () => els.tocModalOverlay.classList.remove('hidden'));
  els.tocCancelBtn.addEventListener('click', () => els.tocModalOverlay.classList.add('hidden'));
  els.tocModalOverlay.addEventListener('click', (e) => { if (e.target === els.tocModalOverlay) els.tocModalOverlay.classList.add('hidden'); });

  function insertTocBlock(type) {
    let items = [];
    if (type === 'headings') {
      const counters = [0, 0, 0]; // h1, h2, h3
      items = blocks.filter((b) => b.type === 'h1' || b.type === 'h2' || b.type === 'h3').map((b) => {
        let number;
        if (b.type === 'h1') { counters[0]++; counters[1] = 0; counters[2] = 0; number = `${counters[0]}`; }
        else if (b.type === 'h2') { counters[1]++; counters[2] = 0; number = `${counters[0]}.${counters[1]}`; }
        else { counters[2]++; number = `${counters[0]}.${counters[1]}.${counters[2]}`; }
        return { text: `${number}. ${b.text}`, indent: b.type === 'h2' ? 1 : b.type === 'h3' ? 2 : 0 };
      });
    }
    else if (type === 'tables') items = blocks.filter((b) => b.type === 'table').map((b, i) => ({ text: `${lang === 'ar' ? 'جدول' : lang === 'fr' ? 'Tableau' : 'Table'} ${i + 1}`, indent: 0 }));
    else if (type === 'figures') items = blocks.filter((b) => b.type === 'image').map((b, i) => ({ text: `${lang === 'ar' ? 'شكل' : lang === 'fr' ? 'Figure' : 'Figure'} ${i + 1}`, indent: 0 }));

    if (items.length === 0) {
      const emptyMsg = type === 'headings' ? t('noHeadingsFound') : type === 'tables' ? t('noTablesFound') : t('noFiguresFound');
      alert(emptyMsg);
      return;
    }

    const title = type === 'headings' ? (lang === 'ar' ? 'الفهرس' : lang === 'fr' ? 'Table des matières' : 'Table of contents')
      : type === 'tables' ? t('tocTablesText') : t('tocFiguresText');

    // Only one TOC block of this type may exist at a time — replace it if already present.
    blocks = blocks.filter((b) => !(b.type === 'toc' && b.tocType === type));
    blocks.unshift({ id: 'toc-' + type, type: 'toc', tocType: type, tocTitle: title, items });

    renderBlocksList();
    renderPreview();
    els.tocModalOverlay.classList.add('hidden');
  }
  function removeTocBlock(blockId) {
    blocks = blocks.filter((b) => b.id !== blockId);
    renderBlocksList();
    renderPreview();
  }
  els.tocHeadingsBtn.addEventListener('click', () => insertTocBlock('headings'));
  els.tocTablesBtn.addEventListener('click', () => insertTocBlock('tables'));
  els.tocFiguresBtn.addEventListener('click', () => insertTocBlock('figures'));

  /* ================= Payment (placeholder) ================= */
  let requestedFormat = null; // 'word' | 'pdf' — set when a download button is clicked, used after payment
  [els.downloadWordBtn, els.downloadPdfBtn].forEach((btn) => {
    btn.addEventListener('click', () => {
      requestedFormat = btn.getAttribute('data-format');
      els.paymentModalOverlay.classList.remove('hidden');
    });
  });

  /* ---- Font size control ---- */
  els.fontSizeDownBtn.addEventListener('click', () => {
    fontSizePt = Math.max(9, fontSizePt - 1);
    els.fontSizeValue.textContent = fontSizePt;
    renderPreview();
  });
  els.fontSizeUpBtn.addEventListener('click', () => {
    fontSizePt = Math.min(20, fontSizePt + 1);
    els.fontSizeValue.textContent = fontSizePt;
    renderPreview();
  });
  els.paymentCancelBtn.addEventListener('click', () => els.paymentModalOverlay.classList.add('hidden'));
  els.paymentModalOverlay.addEventListener('click', (e) => { if (e.target === els.paymentModalOverlay) els.paymentModalOverlay.classList.add('hidden'); });
  els.payNowBtn.addEventListener('click', () => {
    // Placeholder: real Chargily checkout will be wired here later.
    // Once payment succeeds, call exportPdf() when requestedFormat === 'pdf',
    // or the future exportWord() when requestedFormat === 'word', then set unlocked = true.
    alert(lang === 'ar' ? 'لم تُفعَّل بوابة الدفع بعد — قريبًا.' : lang === 'fr' ? 'Le paiement sera bientôt disponible.' : 'Payment is coming soon.');
  });

  async function exportPdf() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pdfPageWidth = pdf.internal.pageSize.getWidth();
    const pdfPageHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < pages.length; i++) {
      els.docPreviewLeft.innerHTML = pages[i].map(blockToHtml).join('');
      els.pageNumberLeft.textContent = formatPageNumber(i + 1);
      els.watermarkTextLeft.textContent = '';
      els.docPreviewLeft.style.userSelect = 'text';

      const canvas = await html2canvas(els.pageSheetLeft, { scale: 2, useCORS: true });
      const ratio = Math.min(pdfPageWidth / canvas.width, pdfPageHeight / canvas.height);
      const imgW = canvas.width * ratio;
      const imgH = canvas.height * ratio;

      if (i > 0) pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', (pdfPageWidth - imgW) / 2, (pdfPageHeight - imgH) / 2, imgW, imgH);

      els.docPreviewLeft.style.userSelect = '';
    }

    pdf.save('memo-organized.pdf');
    renderCurrentSpread(); // restore the on-screen spread after using the left sheet for export rendering
  }
  // NOTE: exportPdf() is intentionally not yet wired to a button — it will
  // be called after a successful Chargily payment confirmation (next phase).

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
    els.uploadTitle.textContent = dict.uploadTitle; els.uploadSubtitle.textContent = dict.uploadSubtitle;
    els.dropZoneText.textContent = dict.dropZoneText; els.uploadHint.textContent = dict.uploadHint;
    els.analyzingText.textContent = dict.analyzingText;
    els.reviewTitle.textContent = dict.reviewTitle; els.newFileText.textContent = dict.newFileText;
    els.styleLabel.textContent = dict.styleLabel; els.tocBtnText.textContent = dict.tocBtnText;
    els.fontSizeLabel.textContent = dict.fontSizeLabel;
    els.downloadWordText.textContent = dict.downloadWordText; els.downloadPdfText.textContent = dict.downloadPdfText;
    els.pageNumBtnText.textContent = dict.pageNumBtnText; els.pageNumModalTitle.textContent = dict.pageNumModalTitle;
    els.pageNumEnableLabel.textContent = dict.pageNumEnableLabel;
    els.pageNumOnOpt.textContent = dict.pageNumOnOpt; els.pageNumOffOpt.textContent = dict.pageNumOffOpt;
    els.pageNumStyleLabel.textContent = dict.pageNumStyleLabel;
    els.pageNumStyleNumericOpt.textContent = dict.pageNumStyleNumericOpt;
    els.pageNumStyleRomanOpt.textContent = dict.pageNumStyleRomanOpt;
    els.pageNumStyleLettersOpt.textContent = dict.pageNumStyleLettersOpt;
    els.pageNumRangeLabel.textContent = dict.pageNumRangeLabel; els.pageNumExcludeLabel.textContent = dict.pageNumExcludeLabel;
    els.pageNumCancelBtn.textContent = dict.cancelBtn;
    els.pageNumSaveBtn.textContent = dict.saveBtn;
    els.tocModalTitle.textContent = dict.tocModalTitle;
    els.tocHeadingsText.textContent = dict.tocHeadingsText; els.tocTablesText.textContent = dict.tocTablesText; els.tocFiguresText.textContent = dict.tocFiguresText;
    els.tocCancelBtn.textContent = dict.cancelBtn;
    els.paymentModalTitle.textContent = dict.paymentModalTitle; els.paymentModalHint.textContent = dict.paymentModalHint;
    els.priceValue.textContent = dict.priceValue; els.payNowText.textContent = dict.payNowText;
    els.paymentCancelBtn.textContent = dict.cancelBtn;
    els.langBtns.forEach((b) => b.classList.toggle('active', b.getAttribute('data-lang') === lang));
    localStorage.setItem('mo:lang', lang);
    updateAuthFormMode(els.tabLogin.classList.contains('active') ? 'login' : 'signup');
    if (blocks.length) { renderStyleRow(); renderBlocksList(); renderPreview(); }
  }
  els.langBtns.forEach((btn) => btn.addEventListener('click', () => { lang = btn.getAttribute('data-lang'); applyLanguage(); }));

  /* ================= Init ================= */
  applyLanguage();

  if (window.fbAuth) {
    window.fbAuth.onAuthStateChanged((fbUser) => {
      showScreen(fbUser ? 'uploadScreen' : 'lockedScreen');
    });
  } else {
    showScreen('lockedScreen');
  }
})();
