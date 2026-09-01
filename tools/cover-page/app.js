// ============================================================
// app.js — Cover Page Generator
// ============================================================

(function () {
  "use strict";

  /* ================= Templates (10) ================= */
  const TEMPLATES = [
    { id: 1, name: 'مذكرة تخرج', cat: 'academic', layout: 'l2', decor: 'deco-corners', accent: '#1B3A6B' },
    { id: 2, name: 'رسالة دكتوراه', cat: 'academic', layout: 'l1', decor: 'deco-double', accent: '#5A3FA0' },
    { id: 3, name: 'مشروع/بحث', cat: 'academic', layout: 'l1', decor: 'deco-none', accent: '#1E8A52' },
    { id: 4, name: 'عرض تقديمي/مناقشة', cat: 'academic', layout: 'l1', decor: 'deco-thin', accent: '#0F6FC5' },
    { id: 5, name: 'تقرير تربص', cat: 'academic', layout: 'l2', decor: 'deco-none', accent: '#C9A227' },
    { id: 6, name: 'التقرير السنوي', cat: 'institutional', layout: 'l3', decor: 'deco-none', accent: '#222222' },
    { id: 7, name: 'عرض سعر/مقترح', cat: 'institutional', layout: 'l2', decor: 'deco-thin', accent: '#B1345A' },
    { id: 8, name: 'محضر اجتماع', cat: 'institutional', layout: 'l3', decor: 'deco-none', accent: '#4A5568' },
    { id: 9, name: 'خطة عمل/دراسة جدوى', cat: 'institutional', layout: 'l3', decor: 'deco-thin', accent: '#17879E' },
    { id: 10, name: 'دليل/كتيب داخلي', cat: 'institutional', layout: 'l3', decor: 'deco-none', accent: '#E8621A' },
  ];

  const FRAMES = [
    { id: 0, type: 'none' },
    { id: 1, type: 'ready', colors: ['#1B3A6B', '#1B3A6B'], style: 'thin' },
    { id: 2, type: 'ready', colors: ['#C9A227', '#C9A227'], style: 'double' },
    { id: 3, type: 'ready', colors: ['#1E8A52', '#1E8A52'], style: 'corners' },
    { id: 4, type: 'ready', colors: ['#5A3FA0', '#5A3FA0'], style: 'dots' },
    { id: 5, type: 'ready', colors: ['#B1345A', '#B1345A'], style: 'thin' },
    { id: 6, type: 'ready', colors: ['#0F6FC5', '#0F6FC5'], style: 'double' },
    { id: 7, type: 'ready', colors: ['#222222', '#222222'], style: 'corners' },
    { id: 8, type: 'upload' },
  ];

  let activeCategory = 'all';
  let activeTemplate = TEMPLATES[0];
  let activeFrame = FRAMES[0];
  let customFrameDataUrl = null;
  let logo1DataUrl = null;
  let logo2DataUrl = null;

  /* ================= DOM refs ================= */
  const $ = (id) => document.getElementById(id);
  const els = {
    loadingScreen: $('loadingScreen'), lockedScreen: $('lockedScreen'), editorScreen: $('editorScreen'),
    tabLogin: $('tabLogin'), tabSignup: $('tabSignup'),
    authCardForm: $('authCardForm'), authCardError: $('authCardError'),
    acName: $('acName'), acEmail: $('acEmail'), acPassword: $('acPassword'), acSubmitBtn: $('acSubmitBtn'),
    acGoogleBtn: $('acGoogleBtn'),
    categoryFilter: $('categoryFilter'), templateFilter: $('templateFilter'),
    frameFilter: $('frameFilter'), customFrameInput: $('customFrameInput'),
    logo1Box: $('logo1Box'), logo1Preview: $('logo1Preview'), logo1Placeholder: $('logo1Placeholder'), logo1Input: $('logo1Input'),
    logo2Box: $('logo2Box'), logo2Preview: $('logo2Preview'), logo2Placeholder: $('logo2Placeholder'), logo2Input: $('logo2Input'),
    fOrg1: $('fOrg1'), fOrg2: $('fOrg2'), fMainTitle: $('fMainTitle'), fSubtitle: $('fSubtitle'),
    fPresenter: $('fPresenter'), fSecondPerson: $('fSecondPerson'), fDate: $('fDate'),
    coverPage: $('coverPage'), frameImg: $('frameImg'), coverBorder: $('coverBorder'),
    coverLogosRow: $('coverLogosRow'), coverLogo1: $('coverLogo1'), coverLogo2: $('coverLogo2'),
    coverOrg1: $('coverOrg1'), coverOrg2: $('coverOrg2'),
    coverMainTitle: $('coverMainTitle'), coverSubtitle: $('coverSubtitle'),
    coverPresenter: $('coverPresenter'), coverSecond: $('coverSecond'), coverDate: $('coverDate'),
    downloadPdfBtn: $('downloadPdfBtn'), downloadBtnText: $('downloadBtnText'),
  };

  /* ================= Screens ================= */
  function showScreen(name) {
    [els.loadingScreen, els.lockedScreen, els.editorScreen].forEach((s) => s.classList.add('hidden'));
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
  function showAuthError(msg) {
    if (!msg) return;
    els.authCardError.textContent = msg;
    els.authCardError.classList.remove('hidden');
  }
  function updateAuthFormMode(mode) {
    const isLogin = mode === 'login';
    els.tabLogin.classList.toggle('active', isLogin);
    els.tabSignup.classList.toggle('active', !isLogin);
    els.acName.classList.toggle('hidden', isLogin);
    els.acSubmitBtn.textContent = isLogin ? 'تسجيل الدخول' : 'إنشاء حساب';
    els.authCardError.classList.add('hidden');
  }
  els.tabLogin.addEventListener('click', () => updateAuthFormMode('login'));
  els.tabSignup.addEventListener('click', () => updateAuthFormMode('signup'));

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
    try { await window.fbAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()); }
    catch (err) { showAuthError(authErrMsg(err.code)); }
  });

  /* ================= Category + Template filter ================= */
  function renderCategoryFilter() {
    const cats = [
      { key: 'all', label: 'الكل' },
      { key: 'academic', label: 'أكاديمي' },
      { key: 'institutional', label: 'مؤسسي' },
    ];
    els.categoryFilter.innerHTML = cats.map((c) =>
      `<button type="button" class="category-btn ${c.key === activeCategory ? 'active' : ''}" data-cat="${c.key}">${c.label}</button>`
    ).join('');
    els.categoryFilter.querySelectorAll('.category-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeCategory = btn.getAttribute('data-cat');
        renderCategoryFilter();
        renderTemplateFilter();
      });
    });
  }

  function renderTemplateFilter() {
    const list = activeCategory === 'all' ? TEMPLATES : TEMPLATES.filter((t) => t.cat === activeCategory);
    els.templateFilter.innerHTML = list.map((tpl) => `
      <button type="button" class="theme-swatch-btn ${tpl.id === activeTemplate.id ? 'active' : ''}" data-id="${tpl.id}"
        style="background:#fff; border-color:${tpl.accent};" title="${tpl.name}">
        <span style="position:absolute; inset:6px; border:2px solid ${tpl.accent}; border-radius:6px; opacity:.7;"></span>
        <span style="position:relative; font-size:9px; font-weight:800; color:${tpl.accent};">${tpl.id}</span>
      </button>
    `).join('');
    els.templateFilter.querySelectorAll('.theme-swatch-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeTemplate = TEMPLATES.find((t) => t.id === parseInt(btn.getAttribute('data-id'), 10));
        renderTemplateFilter();
        renderCover();
      });
    });
  }

  /* ================= Frame filter ================= */
  function frameSwatchSvg(frame) {
    if (frame.type === 'none') return `<span class="none-swatch">بدون</span>`;
    if (frame.type === 'upload') return `<span class="upload-swatch">📁</span>`;
    const c = frame.colors[0];
    if (frame.style === 'thin') return `<span style="position:absolute; inset:8px; border:2px solid ${c}; border-radius:4px;"></span>`;
    if (frame.style === 'double') return `<span style="position:absolute; inset:6px; border:3px double ${c}; border-radius:4px;"></span>`;
    if (frame.style === 'dots') return `<span style="position:absolute; inset:8px; border:2px dotted ${c}; border-radius:4px;"></span>`;
    return `<span style="position:absolute; inset:8px; border:2px solid ${c}; border-radius:4px; clip-path: polygon(0 0,30% 0,30% 15%,15% 15%,15% 30%,0 30%);"></span>`;
  }

  function renderFrameFilter() {
    els.frameFilter.innerHTML = FRAMES.map((f) => `
      <button type="button" class="theme-swatch-btn ${f.id === activeFrame.id ? 'active' : ''} ${f.type === 'none' ? 'none-swatch' : ''} ${f.type === 'upload' ? 'upload-swatch' : ''}"
        data-id="${f.id}" style="background:#fff;">
        ${frameSwatchSvg(f)}
      </button>
    `).join('');
    els.frameFilter.querySelectorAll('.theme-swatch-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const f = FRAMES.find((fr) => fr.id === parseInt(btn.getAttribute('data-id'), 10));
        if (f.type === 'upload') {
          els.customFrameInput.click();
          return;
        }
        activeFrame = f;
        renderFrameFilter();
        renderCover();
      });
    });
  }

  els.customFrameInput.addEventListener('change', () => {
    const file = els.customFrameInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      customFrameDataUrl = e.target.result;
      activeFrame = FRAMES.find((f) => f.type === 'upload');
      renderFrameFilter();
      renderCover();
    };
    reader.readAsDataURL(file);
  });

  /* ================= Logo uploads ================= */
  function setupLogoUpload(box, input, preview, placeholder, setUrl) {
    box.addEventListener('click', () => input.click());
    input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        setUrl(e.target.result);
        preview.src = e.target.result;
        preview.classList.remove('hidden');
        placeholder.classList.add('hidden');
        renderCover();
      };
      reader.readAsDataURL(file);
    });
  }
  setupLogoUpload(els.logo1Box, els.logo1Input, els.logo1Preview, els.logo1Placeholder, (url) => { logo1DataUrl = url; });
  setupLogoUpload(els.logo2Box, els.logo2Input, els.logo2Preview, els.logo2Placeholder, (url) => { logo2DataUrl = url; });

  /* ================= Live preview ================= */
  function renderCover() {
    const tpl = activeTemplate;
    els.coverPage.setAttribute('data-layout', tpl.layout);
    els.coverPage.style.setProperty('--cv-accent', tpl.accent);

    // Border/decor
    els.coverBorder.className = 'cover-border ' + tpl.decor;
    if (tpl.decor !== 'deco-none') {
      els.coverBorder.style.borderColor = tpl.accent;
    }

    // Frame (background layer)
    if (activeFrame.type === 'none') {
      els.frameImg.classList.add('hidden');
    } else if (activeFrame.type === 'upload' && customFrameDataUrl) {
      els.frameImg.src = customFrameDataUrl;
      els.frameImg.classList.remove('hidden');
    } else if (activeFrame.type === 'ready') {
      els.frameImg.classList.add('hidden'); // ready frames are drawn via border style below instead of raster image
    }

    // Logos
    if (logo1DataUrl) { els.coverLogo1.src = logo1DataUrl; els.coverLogo1.hidden = false; } else { els.coverLogo1.hidden = true; }
    if (logo2DataUrl && tpl.layout === 'l2') { els.coverLogo2.src = logo2DataUrl; els.coverLogo2.hidden = false; } else { els.coverLogo2.hidden = true; }

    // Text
    els.coverOrg1.textContent = els.fOrg1.value.trim();
    els.coverOrg2.textContent = tpl.layout === 'l2' ? els.fOrg2.value.trim() : '';
    els.coverMainTitle.textContent = els.fMainTitle.value.trim() || tpl.name;
    els.coverSubtitle.textContent = els.fSubtitle.value.trim();
    els.coverPresenter.textContent = els.fPresenter.value.trim();
    els.coverSecond.textContent = els.fSecondPerson.value.trim();
    els.coverDate.textContent = els.fDate.value.trim();
  }

  [els.fOrg1, els.fOrg2, els.fMainTitle, els.fSubtitle, els.fPresenter, els.fSecondPerson, els.fDate].forEach((input) => {
    input.addEventListener('input', renderCover);
  });

  /* ================= PDF export ================= */
  els.downloadPdfBtn.addEventListener('click', async () => {
    const original = els.downloadBtnText.textContent;
    els.downloadPdfBtn.disabled = true;
    els.downloadBtnText.textContent = '…';
    try {
      const canvas = await html2canvas(els.coverPage, { scale: 3, backgroundColor: '#ffffff', useCORS: true });
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
      pdf.save('cover-page.pdf');
    } catch (e) {
      alert('حدث خطأ أثناء التصدير، حاول مرة أخرى.');
    }
    els.downloadPdfBtn.disabled = false;
    els.downloadBtnText.textContent = original;
  });

  /* ================= Auth state / Init ================= */
  renderCategoryFilter();
  renderTemplateFilter();
  renderFrameFilter();
  renderCover();

  if (window.fbAuth) {
    window.fbAuth.onAuthStateChanged((fbUser) => {
      showScreen(fbUser ? 'editorScreen' : 'lockedScreen');
    });
  } else {
    showScreen('lockedScreen');
  }
})();
