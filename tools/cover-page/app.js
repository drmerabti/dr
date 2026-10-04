// ============================================================
// app.js — Cover Page Generator
// Shell (topbar, right-hand panel, accordion, gallery, "My covers",
// login, toasts) mirrors tools/admin-request.
// Saved covers: on the device (localStorage) and, on "Save",
// in Firestore at users/{uid}/coverPages/{id}.
// ============================================================

(function () {
  "use strict";

  const I18N = window.COVER_I18N;
  const DESIGNS = window.COVER_DESIGNS;
  const FONTS = window.COVER_FONTS;
  const PALETTE = window.COVER_PALETTE;
  const EXAMPLES = window.COVER_EXAMPLES;
  const renderCover = window.COVER_RENDER;
  const shades = window.COVER_SHADES;
  const DESIGN_BY_ID = Object.fromEntries(DESIGNS.map((x) => [x.id, x]));
  const FONT_BY_ID = Object.fromEntries(FONTS.map((x) => [x.id, x]));

  let lang = localStorage.getItem('coverpage:lang') || 'ar';
  if (!I18N[lang]) lang = 'ar';
  const t = (key) => I18N[lang][key];

  const $ = (id) => document.getElementById(id);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const show = (el) => el.classList.remove('hidden');
  const hide = (el) => el.classList.add('hidden');
  function escapeAttr(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
  function escapeHtml(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function newLocalId() { return 'L' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  /* ================= State ================= */
  const TEXT_FIELDS = ['country', 'ministry', 'uni', 'faculty', 'dept', 'host', 'website', 'workType', 'title', 'subtitle',
    'supervisor', 'coSup', 'level', 'specialty', 'year', 'place', 'date'];
  // Each empty field shows its example. Optional fields (department, subtitle, co-supervisor, place, date,
  // host, website) show theirs only while their whole section is still empty, so they can be left out.
  const OPTIONAL = new Set(['dept', 'host', 'website', 'subtitle', 'coSup', 'place', 'date']);
  const SEC_FIELDS = {
    inst: ['country', 'ministry', 'uni', 'faculty', 'dept', 'host', 'website'],
    work: ['workType', 'subtitle'], sup: ['supervisor', 'coSup'], level: ['level', 'specialty'], year: ['year', 'place', 'date'],
  };
  const FS_MIN = 80, FS_MAX = 130, FS_STEP = 5, FS_DEFAULT = 100;
  function blankState() {
    const s = { designId: 'thesis', colors: {}, fonts: {}, fontScale: FS_DEFAULT, bgDataUrl: null, logo1: null, logo2: null,
      students: [], juryOn: null, jury: [] };
    TEXT_FIELDS.forEach((k) => { s[k] = ''; });
    return s;
  }
  let R = blankState();
  let localId = null;
  let cloudId = null;

  function clampScale(v) {
    v = Math.round((parseInt(v, 10) || FS_DEFAULT) / FS_STEP) * FS_STEP;
    return Math.max(FS_MIN, Math.min(FS_MAX, v));
  }
  function normalize(src) {
    const s = Object.assign({}, src || {});
    const out = blankState();
    TEXT_FIELDS.forEach((k) => { if (s[k] != null) out[k] = String(s[k]); });
    out.designId = DESIGN_BY_ID[s.designId] ? s.designId : 'thesis';
    out.colors = s.colors && typeof s.colors === 'object' ? Object.assign({}, s.colors) : {};
    out.fonts = s.fonts && typeof s.fonts === 'object' ? Object.assign({}, s.fonts) : {};
    out.fontScale = clampScale(s.fontScale);
    ['bgDataUrl', 'logo1', 'logo2'].forEach((k) => { out[k] = s[k] || null; });
    out.students = Array.isArray(s.students) ? s.students.map((x) => String(x || '')) : [];
    out.juryOn = s.juryOn === true || s.juryOn === false ? s.juryOn : null;
    out.jury = Array.isArray(s.jury) ? s.jury.map((r) => ({ name: r.name || '', rank: r.rank || '', uni: r.uni || '', role: parseInt(r.role, 10) || 0 })) : [];
    return out;
  }
  // The previous version kept one draft under "coverpage:draft:v3" (4 templates, image frames).
  function migrateOld(d) {
    const tpl = { 1: 'phd', 2: 'grad', 3: 'project', 4: 'corporate' }[d.activeTemplateId] || 'phd';
    const inst = tpl === 'corporate';
    const s = {
      designId: tpl, fonts: d.activeFontId ? { [tpl]: d.activeFontId } : {},
      logo1: d.logo1DataUrl || d.instLogoDataUrl || null, logo2: d.logo2DataUrl || null,
      bgDataUrl: d.activeFrameId === 'custom' ? d.customFrameDataUrl || null : null,
      students: (d.students || []).filter((x) => (x || '').trim()), jury: (d.jury || []).filter((r) => (r.name || '').trim()),
      supervisor: d.fSupervisor || '', specialty: d.fSpecialty || '',
    };
    if (inst) {
      Object.assign(s, { uni: d.fCompany || '', workType: d.fCategoryLabel || '', title: d.fInstTitle || '', website: d.fWebsite || '', place: d.fCountrySimple || '' });
      if ((d.fPreparedBy || '').trim()) s.students = [d.fPreparedBy.replace(/^\s*(إعداد|Préparé par|Prepared by)\s*:\s*/i, '')];
    } else {
      Object.assign(s, { country: d.fCountry || '', ministry: d.fMinistry || '', uni: d.fUni || '', faculty: d.fFaculty || '',
        workType: d.fDegreeType || '', title: d.fMainTitle || '', year: d.fDate || '' });
    }
    if (d.lang) s.lang = d.lang;
    return s;
  }

  /* ================= DOM refs ================= */
  const els = {
    htmlRoot: $('htmlRoot'), langBtns: $$('.lang-btn'), page: $('cvPage'), sheetHolder: $('sheetHolder'),
    designStrip: $('designStrip'), fontFilter: $('fontFilter'), swatches: $('colorSwatches'),
    studentsList: $('studentsList'), juryList: $('juryList'), juryOn: $('f_juryOn'),
    saveBtn: $('saveBtn'), printBtn: $('printBtn'), wordBtn: $('wordBtn'), downloadPdfBtn: $('downloadPdfBtn'), pngBtn: $('pngBtn'), clearAllBtn: $('clearAllBtn'),
  };

  /* ================= Toast & confirm ================= */
  let toastTimer = null;
  function toast(msg) {
    const el = $('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }
  let confirmResolve = null;
  function askConfirm(msg) {
    $('confirmText').textContent = msg;
    show($('confirmDlg'));
    return new Promise((resolve) => { confirmResolve = resolve; });
  }
  function closeConfirm(v) { hide($('confirmDlg')); if (confirmResolve) { confirmResolve(v); confirmResolve = null; } }
  $('confirmYes').addEventListener('click', () => closeConfirm(true));
  $('confirmNo').addEventListener('click', () => closeConfirm(false));
  $('confirmDlg').addEventListener('click', (e) => { if (e.target.id === 'confirmDlg') closeConfirm(false); });

  /* ================= Example & view ================= */
  function exampleFor(designId, l) {
    l = l || lang;
    const d = DESIGN_BY_ID[designId] || DESIGNS[0];
    return Object.assign({}, EXAMPLES.base[l], d.ex && EXAMPLES[d.ex] ? EXAMPLES[d.ex][l] : {});
  }
  const realStudents = () => R.students.map((x) => x.trim()).filter(Boolean);
  const realJury = () => R.jury.filter((r) => (r.name || '').trim());
  const touched = (sec) => SEC_FIELDS[sec].some((k) => (R[k] || '').trim());
  function view(designId) {
    const d = DESIGN_BY_ID[designId] || DESIGNS[0];
    const e = exampleFor(d.id);
    const V = {};
    Object.keys(SEC_FIELDS).forEach((sec) => {
      const own = touched(sec);
      SEC_FIELDS[sec].forEach((k) => { V[k] = (R[k] || '').trim() || (own && OPTIONAL.has(k) ? '' : (e[k] || '')); });
    });
    V.title = (R.title || '').trim() || e.title;
    const st = realStudents();
    V.students = st.length ? st : e.students.slice();
    const jr = realJury();
    V.jury = jr.length ? jr.map((r) => ({ name: r.name.trim(), rank: (r.rank || '').trim(), uni: (r.uni || '').trim(), role: r.role })) : e.jury.map(([name, rank, uni, role]) => ({ name, rank, uni, role }));
    V.juryOn = R.juryOn == null ? !!d.jury : R.juryOn;
    return V;
  }

  /* ================= Colours, fonts & size ================= */
  const colorOf = (id) => R.colors[id] || (DESIGN_BY_ID[id] || DESIGNS[0]).color;
  const fontOf = (id) => FONT_BY_ID[R.fonts[id]] || FONT_BY_ID[(DESIGN_BY_ID[id] || DESIGNS[0]).font] || FONTS[0];
  // The default logo is drawn as SVG, then turned into a PNG once per colour:
  // html2canvas does not paint SVG <img> sources into PDF / PNG / Word exports.
  const logoCache = {};
  function defaultLogo(c) {
    if (logoCache[c]) return logoCache[c];
    const svgUrl = window.COVER_DEFAULT_LOGO(c);
    logoCache[c] = svgUrl;
    const img = new Image();
    img.onload = () => {
      const cv = document.createElement('canvas');
      cv.width = cv.height = 288;
      cv.getContext('2d').drawImage(img, 0, 0, 288, 288);
      try { logoCache[c] = cv.toDataURL('image/png'); } catch (e) { return; }
      $$('img.cv-logo').forEach((n) => { if (n.getAttribute('src') === svgUrl) n.src = logoCache[c]; });
    };
    img.src = svgUrl;
    return svgUrl;
  }

  function renderSwatches() {
    const cur = colorOf(R.designId), orig = DESIGN_BY_ID[R.designId].color;
    els.swatches.innerHTML = PALETTE.map((c) => `<button type="button" class="sw ${c.toLowerCase() === cur.toLowerCase() ? 'on' : ''}" data-color="${c}" style="--c:${c}" aria-label="${c}"></button>`).join('')
      + `<label class="sw custom" title="${escapeAttr(t('colorLbl'))}"><input type="color" id="customColor" value="${cur}"></label>`
      + `<button type="button" class="sw reset ${R.colors[R.designId] ? '' : 'on'}" data-color="" style="--c:${orig}"><i></i>${escapeHtml(t('colorReset'))}</button>`;
  }
  function setColor(c) {
    if (c) R.colors[R.designId] = c; else delete R.colors[R.designId];
    renderSwatches(); refresh(); saveDraft();
  }
  els.swatches.addEventListener('click', (e) => { const b = e.target.closest('button[data-color]'); if (b) setColor(b.dataset.color); });
  els.swatches.addEventListener('input', (e) => { if (e.target.id === 'customColor') { R.colors[R.designId] = e.target.value; refresh(); saveDraft(); } });
  els.swatches.addEventListener('change', (e) => { if (e.target.id === 'customColor') renderSwatches(); });

  function renderFontFilter() {
    const cur = fontOf(R.designId).id;
    els.fontFilter.innerHTML = FONTS.map((f) => `
      <button type="button" class="font-btn ${f.id === cur ? 'on' : ''}" data-id="${f.id}">
        <b style="font-family:${lang === 'ar' ? f.ar : f.en}">${lang === 'ar' ? 'صفحة الغلاف' : lang === 'fr' ? 'Page de garde' : 'Cover page'}</b>
        <small>${escapeHtml(f.name[lang])}</small>
      </button>`).join('');
  }
  els.fontFilter.addEventListener('click', (e) => {
    const b = e.target.closest('.font-btn'); if (!b) return;
    R.fonts[R.designId] = parseInt(b.dataset.id, 10) || 1;
    renderFontFilter(); refresh(); saveDraft();
  });

  function applyFontScaleUi() {
    $('fsVal').textContent = R.fontScale + '%';
    $('fsDown').disabled = R.fontScale <= FS_MIN;
    $('fsUp').disabled = R.fontScale >= FS_MAX;
    $('fsReset').disabled = R.fontScale === FS_DEFAULT;
  }
  function setFontScale(v) {
    const nv = clampScale(v);
    if (nv === R.fontScale) return;
    R.fontScale = nv;
    applyFontScaleUi(); refresh(); saveDraft();
  }
  $('fsDown').addEventListener('click', () => setFontScale(R.fontScale - FS_STEP));
  $('fsUp').addEventListener('click', () => setFontScale(R.fontScale + FS_STEP));
  $('fsReset').addEventListener('click', () => setFontScale(FS_DEFAULT));

  /* ================= Page rendering ================= */
  function renderPage(el, designId) {
    const d = DESIGN_BY_ID[designId] || DESIGNS[0];
    const color = colorOf(d.id), f = fontOf(d.id), s = shades(color);
    el.className = 'cv-page d-' + d.id + (el.classList.contains('mini') ? ' mini' : '');
    el.setAttribute('dir', I18N[lang].dir);
    el.setAttribute('lang', lang);
    const st = el.style;
    st.setProperty('--f-ar', f.ar); st.setProperty('--f-en', f.en); st.setProperty('--fs', String(R.fontScale / 100));
    st.setProperty('--c', s.c); st.setProperty('--cd', s.d); st.setProperty('--cm', s.m); st.setProperty('--cl', s.l); st.setProperty('--cxl', s.xl);
    const logo1 = R.logo1 || defaultLogo(color);
    const logo2 = R.logo2 || (d.dual ? defaultLogo(color) : null);
    el.innerHTML = renderCover(view(d.id), { design: d, color, L: I18N[lang], logo1, logo2 })
      + (R.bgDataUrl ? `<img class="cv-bg" src="${R.bgDataUrl}" alt="">` : '');
  }
  // true when some text does not fit inside the page
  function overflows(el) {
    const body = el.querySelector('.cv-body'); if (!body) return false;
    if (body.scrollHeight > body.clientHeight + 2) return true;
    const pr = el.getBoundingClientRect(), k = pr.width / 794 || 1;
    return $$('.cv-body p, .cv-body h1, .cv-body table', el).some((n) => {
      const r = n.getBoundingClientRect();
      return r.width && (r.left < pr.left - 1 || r.right > pr.right + 1 || r.top < pr.top - 1 || r.bottom > pr.bottom + 1 * k);
    }) || $$('.mid', el).some((m) => m.scrollHeight > m.clientHeight + 2);
  }

  function renderPreview() {
    renderPage(els.page, R.designId);
    syncExamplePlaceholders();
  }
  function syncExamplePlaceholders() {
    const e = exampleFor(R.designId);
    TEXT_FIELDS.forEach((k) => { const el = $('f_' + k); if (el) el.placeholder = e[k] || ''; });
    $$('.st-input', els.studentsList).forEach((inp, i) => { inp.placeholder = e.students[i] || t('studentPh'); });
    $$('.item-card', els.juryList).forEach((card, i) => {
      const x = e.jury[i] || e.jury[0] || ['', '', '', 0];
      card.querySelector('.it-d').placeholder = x[0] || t('jurorNamePh');
      card.querySelector('.it-r').placeholder = x[1] || t('jurorRankPh');
      card.querySelector('.it-u').placeholder = x[2] || t('jurorUniPh');
    });
  }

  let thumbTimer = null;
  function refresh() {
    renderPreview();
    updateSummaries();
    applyZoom();
    highlight();
    clearTimeout(thumbTimer);
    thumbTimer = setTimeout(renderThumbs, 350);
  }

  /* ================= Form <-> state ================= */
  function fillForm() {
    $$('[data-f]').forEach((el) => { el.value = R[el.dataset.f] == null ? '' : R[el.dataset.f]; });
    syncUploadPreviews(); renderStudents(); renderJury(); renderFontFilter(); renderSwatches(); applyFontScaleUi(); syncJuryToggle();
  }
  document.addEventListener('input', (e) => {
    const el = e.target.closest('[data-f]'); if (!el) return;
    R[el.dataset.f] = el.value;
    refresh(); saveDraft();
  });

  function renderTypeSuggest() {
    $('typeSuggest').innerHTML = t('workTypes').map((s) => `<button type="button" class="chip">${escapeHtml(s)}</button>`).join('');
  }
  $('typeSuggest').addEventListener('click', (e) => {
    const b = e.target.closest('.chip'); if (!b) return;
    R.workType = b.textContent; $('f_workType').value = R.workType; refresh(); saveDraft();
  });

  /* ================= Students ================= */
  const IC_X = '<svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>';
  function renderStudents() {
    els.studentsList.innerHTML = R.students.map((v, i) => `
      <div class="dyn-row"><span class="n">${i + 1}</span>
        <input type="text" class="st-input" data-i="${i}" value="${escapeAttr(v)}" aria-label="${escapeAttr(t('studentPh'))}">
        <button type="button" class="dyn-remove" data-i="${i}" aria-label="${escapeAttr(t('remove'))}">${IC_X}</button></div>`).join('');
    syncExamplePlaceholders();
  }
  els.studentsList.addEventListener('input', (e) => {
    if (!e.target.classList.contains('st-input')) return;
    e.stopPropagation();
    R.students[+e.target.dataset.i] = e.target.value; refresh(); saveDraft();
  });
  els.studentsList.addEventListener('click', (e) => {
    const b = e.target.closest('.dyn-remove'); if (!b) return;
    R.students.splice(+b.dataset.i, 1); renderStudents(); refresh(); saveDraft();
  });
  $('addStudentBtn').addEventListener('click', () => {
    R.students.push(''); renderStudents(); saveDraft();
    const rows = $$('.st-input', els.studentsList); if (rows.length) rows[rows.length - 1].focus();
  });

  /* ================= Jury ================= */
  function renderJury() {
    els.juryList.innerHTML = R.jury.map((r, i) => `
      <div class="item-card" data-i="${i}">
        <span class="n">${i + 1}</span>
        <input type="text" class="it-d" data-k="name" value="${escapeAttr(r.name)}" aria-label="${escapeAttr(t('jurorNamePh'))}">
        <button type="button" class="dyn-remove" aria-label="${escapeAttr(t('remove'))}">${IC_X}</button>
        <input type="text" class="it-r" data-k="rank" value="${escapeAttr(r.rank)}" aria-label="${escapeAttr(t('jurorRankPh'))}">
        <input type="text" class="it-u" data-k="uni" value="${escapeAttr(r.uni)}" aria-label="${escapeAttr(t('jurorUniPh'))}">
        <select class="it-role" data-k="role">${t('roles').map((x, ri) => `<option value="${ri}" ${r.role === ri ? 'selected' : ''}>${escapeHtml(x)}</option>`).join('')}</select>
      </div>`).join('');
    syncExamplePlaceholders();
  }
  function onJuryEdit(e) {
    const card = e.target.closest('.item-card'); const k = e.target.dataset.k;
    if (!card || !k) return;
    e.stopPropagation();
    R.jury[+card.dataset.i][k] = k === 'role' ? parseInt(e.target.value, 10) || 0 : e.target.value;
    refresh(); saveDraft();
  }
  els.juryList.addEventListener('input', onJuryEdit);
  els.juryList.addEventListener('change', (e) => { if (e.target.dataset.k === 'role') onJuryEdit(e); });
  els.juryList.addEventListener('click', (e) => {
    const b = e.target.closest('.dyn-remove'); if (!b) return;
    R.jury.splice(+b.closest('.item-card').dataset.i, 1); renderJury(); refresh(); saveDraft();
  });
  $('addJurorBtn').addEventListener('click', () => {
    R.jury.push({ name: '', rank: '', uni: '', role: R.jury.length ? 2 : 1 });
    if (R.juryOn == null) R.juryOn = true;
    renderJury(); syncJuryToggle(); refresh(); saveDraft();
    const rows = $$('.it-d', els.juryList); if (rows.length) rows[rows.length - 1].focus();
  });
  const juryShown = () => (R.juryOn == null ? !!DESIGN_BY_ID[R.designId].jury : R.juryOn);
  function syncJuryToggle() { els.juryOn.checked = juryShown(); $('juryField').classList.toggle('off', !juryShown()); }
  els.juryOn.addEventListener('change', () => { R.juryOn = els.juryOn.checked; syncJuryToggle(); refresh(); saveDraft(); });

  /* ================= Uploads ================= */
  const UPLOADS = { logo1: ['logo1', 360], logo2: ['logo2', 360], bg: ['bgDataUrl', 1400] };
  function readAndCompressImage(file, maxDim) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let w = img.width, h = img.height;
          if (w > h && w > maxDim) { h = Math.round(h * maxDim / w); w = maxDim; } else if (h > maxDim) { w = Math.round(w * maxDim / h); h = maxDim; }
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          const png = /png|gif|webp|svg/.test(file.type);
          resolve(canvas.toDataURL(png ? 'image/png' : 'image/jpeg', 0.85));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  function syncUploadPreviews() {
    Object.entries(UPLOADS).forEach(([id, [key]]) => {
      const url = R[key];
      const img = $(id + 'Preview');
      img.classList.toggle('hidden', !url); $(id + 'Placeholder').classList.toggle('hidden', !!url); $(id + 'Remove').classList.toggle('hidden', !url);
      if (url) img.src = url; else img.removeAttribute('src');
    });
  }
  Object.entries(UPLOADS).forEach(([id, [key, maxDim]]) => {
    const box = $(id + 'Box'), input = $(id + 'Input');
    box.addEventListener('click', (e) => { if (!e.target.closest('.upload-remove')) input.click(); });
    input.addEventListener('change', async () => {
      const file = input.files[0]; if (!file) return;
      try { R[key] = await readAndCompressImage(file, maxDim); } catch (err) { console.error(err); }
      input.value = ''; syncUploadPreviews(); refresh(); saveDraft();
    });
    $(id + 'Remove').addEventListener('click', (e) => { e.stopPropagation(); R[key] = null; syncUploadPreviews(); refresh(); saveDraft(); });
  });

  /* ================= Designs ================= */
  function setDesign(id, fromGallery) {
    if (!DESIGN_BY_ID[id]) return;
    R.designId = id;
    if (fromGallery) closeGallery();
    renderFontFilter(); renderSwatches(); syncJuryToggle();
    refresh(); saveDraft();
    if (openSec === 'design') renderDesignStrip();
    toast(t('t_design'));
  }
  els.designStrip.addEventListener('click', (e) => { const b = e.target.closest('[data-design]'); if (b) setDesign(b.dataset.design); });

  /* ================= Mini sheets (thumbnails) ================= */
  function mountMini(box, designId) {
    box.innerHTML = '';
    const w = box.clientWidth; if (!w) return;
    const m = document.createElement('div');
    m.className = 'cv-page mini';
    box.appendChild(m);
    renderPage(m, designId);
    m.style.transform = `scale(${w / 794})`;
  }
  function renderThumbs() {
    mountMini($('currentThumb'), R.designId);
    $('currentTplName').textContent = DESIGN_BY_ID[R.designId].name[lang];
  }
  function renderDesignStrip() {
    els.designStrip.innerHTML = DESIGNS.map((d) => `
      <button type="button" class="tpl-chip ${d.id === R.designId ? 'on' : ''}" data-design="${d.id}">
        <span class="t-thumb"></span><span>${escapeHtml(d.name[lang])}</span>
      </button>`).join('');
    $$('.tpl-chip', els.designStrip).forEach((c) => mountMini(c.querySelector('.t-thumb'), c.dataset.design));
  }

  /* ================= Gallery ================= */
  let gCat = 'all';
  function openGallery() { show($('gallery')); buildGallery(); setTimeout(() => $('gSearch').focus(), 50); }
  function closeGallery() { hide($('gallery')); }
  function buildGallery() {
    const q = $('gSearch').value.trim().toLowerCase();
    const list = DESIGNS.filter((d) => (gCat === 'all' || d.cat.includes(gCat)) && (!q || Object.values(d.name).some((n) => n.toLowerCase().includes(q))));
    $('gGrid').innerHTML = list.map((d) => `
      <button type="button" class="g-card ${d.id === R.designId ? 'on' : ''}" data-design="${d.id}">
        <div class="g-thumb"></div>
        <div class="g-meta"><span class="g-ico" style="--c:${colorOf(d.id)}"><svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/></svg></span><b>${escapeHtml(d.name[lang])}</b></div>
      </button>`).join('') || `<div class="g-empty">${t('g_empty')}</div>`;
    $$('.g-card', $('gGrid')).forEach((c) => mountMini(c.querySelector('.g-thumb'), c.dataset.design));
  }
  $('btnGallery').addEventListener('click', openGallery);
  $('gClose').addEventListener('click', closeGallery);
  $('gSearch').addEventListener('input', buildGallery);
  $('gCats').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]'); if (!b) return;
    gCat = b.dataset.cat;
    $$('#gCats .chip').forEach((x) => x.classList.toggle('on', x === b));
    buildGallery();
  });
  $('gallery').addEventListener('click', (e) => {
    if (e.target.id === 'gallery') { closeGallery(); return; }
    const c = e.target.closest('.g-card'); if (c) setDesign(c.dataset.design, true);
  });

  /* ================= Stage: zoom & highlight ================= */
  const SHEET_W = 794, SHEET_H = 1123;
  let zoom = 'fit';
  function stageFitScale() {
    const stage = $('stage');
    const w = (stage.clientWidth - 60) / SHEET_W;
    const h = (stage.clientHeight - 100) / SHEET_H;
    return Math.max(0.2, Math.min(w, h, 1.5));
  }
  function applyZoom() {
    const s = zoom === 'fit' ? stageFitScale() : zoom;
    els.page.style.transform = `scale(${s})`;
    els.sheetHolder.style.width = (SHEET_W * s) + 'px';
    els.sheetHolder.style.height = (SHEET_H * s) + 'px';
    $('zoomVal').textContent = Math.round(s * 100) + '%';
    const over = overflows(els.page);
    $('pageWarn').classList.toggle('hidden', !over);
    $('fsWarn').classList.toggle('hidden', !over);
  }
  function setZoom(dir) {
    let s = zoom === 'fit' ? stageFitScale() : zoom;
    s = Math.round((s + dir * 0.1) * 10) / 10;
    zoom = Math.max(0.2, Math.min(2, s));
    applyZoom();
  }
  $('zoomIn').addEventListener('click', () => setZoom(1));
  $('zoomOut').addEventListener('click', () => setZoom(-1));
  $('zoomFit').addEventListener('click', () => { zoom = 'fit'; applyZoom(); });
  window.addEventListener('resize', () => applyZoom());

  function secColor(id) { const a = document.querySelector(`.acc[data-sec="${id}"]`); return a ? a.style.getPropertyValue('--sc') : '#2F5770'; }
  function highlight() {
    $$('[data-sec]', els.page).forEach((p) => {
      const on = !!openSec && p.dataset.sec === openSec;
      p.classList.toggle('hl', on);
      if (on) p.style.setProperty('--hl', secColor(openSec));
    });
  }
  // clicking a part of the cover opens its section
  els.page.addEventListener('click', (e) => {
    const part = e.target.closest('[data-sec]');
    const k = part ? part.dataset.sec : 'design';
    const wasCollapsed = $('workspace').classList.contains('collapsed');
    $('workspace').classList.remove('collapsed');
    if (openSec !== k) toggleSec(k, true);
    setTimeout(() => {
      const a = document.querySelector(`.acc[data-sec="${k}"]`); if (a) a.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      if (wasCollapsed) applyZoom();
    }, 300);
  });

  /* ================= Accordion ================= */
  let openSec = null;
  function toggleSec(id, force) {
    openSec = (force === undefined ? openSec !== id : force) ? id : null;
    $$('.acc').forEach((a) => a.classList.toggle('open', a.dataset.sec === openSec));
    $('accordion').classList.toggle('has-open', !!openSec);
    if (openSec === 'design') setTimeout(renderDesignStrip, 30);
    highlight();
  }
  $('accordion').addEventListener('click', (e) => {
    const head = e.target.closest('.acc-head');
    if (head) { toggleSec(head.closest('.acc').dataset.sec); return; }
    const nx = e.target.closest('[data-next]');
    if (nx) {
      const next = nx.closest('.acc').nextElementSibling;
      if (next && next.classList.contains('acc')) {
        toggleSec(next.dataset.sec, true);
        setTimeout(() => next.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
      } else {
        toggleSec(null);
      }
    }
  });

  function cut(x, n) { x = String(x || '').replace(/\s+/g, ' ').trim(); n = n || 54; return x.length > n ? x.slice(0, n - 1) + '…' : x; }
  function updateSummaries() {
    const set = (k, v) => { const el = document.querySelector(`[data-sum="${k}"]`); if (el) el.textContent = v; };
    const d = DESIGN_BY_ID[R.designId];
    set('design', [d.name[lang], fontOf(d.id).name[lang], R.fontScale !== FS_DEFAULT ? t('size_lbl')(R.fontScale) : ''].filter(Boolean).join(' · '));
    set('inst', cut([R.uni, R.faculty, R.dept].map((s) => s.trim()).filter(Boolean).join(' · ')) || t('d_inst'));
    set('work', cut([R.workType, R.title].map((s) => s.trim()).filter(Boolean).join(' · ')) || t('d_work'));
    const st = realStudents();
    set('team', st.length ? cut(st.join('، ')) : t('d_team'));
    const nj = realJury().length;
    set('sup', cut([R.supervisor.trim(), nj ? t('n_jury')(nj) : ''].filter(Boolean).join(' · ')) || t('d_sup'));
    set('level', cut([R.level, R.specialty].map((s) => s.trim()).filter(Boolean).join(' · ')) || t('d_level'));
    set('year', cut([R.year, R.place].map((s) => s.trim()).filter(Boolean).join(' · ')) || t('d_year'));
  }

  /* ================= Persistence (device) ================= */
  const STORAGE_KEY = 'coverpage:draft:v4';
  const OLD_KEY = 'coverpage:draft:v3';
  const HISTORY_KEY = 'coverpage:history';
  const MAX_HISTORY = 30;
  let draftTimer = null;

  function collectFullState() { return Object.assign(JSON.parse(JSON.stringify(R)), { lang }); }
  function hasContent(s) {
    return TEXT_FIELDS.some((k) => (s[k] || '').trim()) || (s.students || []).some((x) => (x || '').trim()) || (s.jury || []).some((r) => (r.name || '').trim());
  }
  function getHistory() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch (e) { return []; } }
  function setHistory(h) { try { localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); return true; } catch (e) { return false; } }
  // Writes the draft and keeps the cover in the on-device "My covers" list.
  function commitLocal() {
    const s = collectFullState();
    let ok = true;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.assign({}, s, { localId, cloudId }))); } catch (e) { ok = false; }
    if (!hasContent(s)) return ok;
    if (!localId) localId = newLocalId();
    const h = getHistory().filter((x) => x.localId !== localId);
    h.unshift(Object.assign({}, s, { localId, cloudId, title: deriveTitle(), archivedAt: new Date().toISOString() }));
    if (h.length > MAX_HISTORY) h.length = MAX_HISTORY;
    if (!setHistory(h)) {
      // storage full: keep the list, drop images from older entries
      h.forEach((x, i) => { if (i > 0) { x.logo1 = null; x.logo2 = null; x.bgDataUrl = null; } });
      ok = setHistory(h) && ok;
    }
    return ok;
  }
  function saveDraft() { clearTimeout(draftTimer); draftTimer = setTimeout(commitLocal, 500); }
  window.addEventListener('pagehide', () => { clearTimeout(draftTimer); commitLocal(); });
  function loadDraft() {
    try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch (e) { /* ignore */ }
    try { const old = localStorage.getItem(OLD_KEY); if (old) return migrateOld(JSON.parse(old)); } catch (e) { /* ignore */ }
    return null;
  }
  function applyState(state) { R = normalize(state); fillForm(); }
  function deriveTitle() {
    const s = (R.title || '').trim() || (R.workType || '').trim();
    return s ? s.slice(0, 70) : t('untitled');
  }
  els.clearAllBtn.addEventListener('click', async () => {
    if (!(await askConfirm(t('confirmClear')))) return;
    applyState({ designId: R.designId, colors: R.colors, fonts: R.fonts });
    localId = null; cloudId = null;
    refresh(); commitLocal();
    toast(t('t_cleared'));
  });

  /* ================= Account (Firebase): users/{uid}/coverPages ================= */
  const hasFb = () => typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length && firebase.auth && firebase.firestore;
  let currentUser = null;
  const coversCol = (uid) => firebase.firestore().collection('users').doc(uid).collection('coverPages');
  let pendingAfterLogin = null;

  if (hasFb()) {
    firebase.auth().onAuthStateChanged((user) => {
      currentUser = user;
      if (!$('mine').classList.contains('hidden')) loadMine();
    });
  }
  function openLogin(after) {
    pendingAfterLogin = after || null;
    $('loginTitle').textContent = t('login_title');
    $('loginText').textContent = t('login_text');
    hide($('authCardError'));
    show($('login'));
  }
  function closeLogin() { hide($('login')); }
  function afterLogin() {
    currentUser = firebase.auth().currentUser;
    closeLogin();
    toast(t('t_welcome'));
    const fn = pendingAfterLogin; pendingAfterLogin = null;
    if (fn) fn();
  }
  function showAuthError(code) {
    const map = t('authErr'); const msg = code in map ? map[code] : map.default;
    if (!msg) return;
    $('authCardError').textContent = msg; show($('authCardError'));
  }
  let authMode = 'login';
  function updateAuthFormMode(mode) {
    authMode = mode;
    $('tabLogin').classList.toggle('on', mode === 'login');
    $('tabSignup').classList.toggle('on', mode !== 'login');
    $('acName').classList.toggle('hidden', mode === 'login');
    $('acSubmitBtn').textContent = mode === 'login' ? t('loginBtn') : t('signupBtn');
    hide($('authCardError'));
  }
  $('tabLogin').addEventListener('click', () => updateAuthFormMode('login'));
  $('tabSignup').addEventListener('click', () => updateAuthFormMode('signup'));
  $('loginCancel').addEventListener('click', () => { pendingAfterLogin = null; closeLogin(); });
  $('login').addEventListener('click', (e) => { if (e.target.id === 'login') { pendingAfterLogin = null; closeLogin(); } });
  $('loginGoogle').addEventListener('click', async () => {
    if (!hasFb()) { toast(t('t_cloud_err')); return; }
    try { await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()); afterLogin(); }
    catch (err) { console.error(err); showAuthError(err.code); }
  });
  $('authCardForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!hasFb()) { toast(t('t_cloud_err')); return; }
    const email = $('acEmail').value.trim(), password = $('acPassword').value;
    $('acSubmitBtn').disabled = true;
    try {
      if (authMode === 'login') await firebase.auth().signInWithEmailAndPassword(email, password);
      else {
        const cred = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const name = $('acName').value.trim();
        if (name) await cred.user.updateProfile({ displayName: name });
      }
      afterLogin();
    } catch (err) { showAuthError(err.code); }
    $('acSubmitBtn').disabled = false;
  });

  async function saveToAccount() {
    clearTimeout(draftTimer);
    const localOk = commitLocal();
    if (!currentUser) {
      toast(localOk ? t('t_saved_local') : t('t_too_big'));
      if (hasFb()) openLogin(saveToAccount);
      return;
    }
    const payload = Object.assign({}, collectFullState(), {
      title: deriveTitle(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    if (JSON.stringify(payload).length > 950000) { toast(t('t_too_big')); return; }
    els.saveBtn.disabled = true;
    try {
      const col = coversCol(currentUser.uid);
      if (cloudId) {
        await col.doc(cloudId).set(payload, { merge: true });
      } else {
        const ref = await col.add(Object.assign({ createdAt: firebase.firestore.FieldValue.serverTimestamp() }, payload));
        cloudId = ref.id;
      }
      commitLocal();
      toast(t('t_saved_cloud'));
    } catch (e) {
      console.error('[cover] save to account failed:', e);
      toast(t('t_cloud_err'));
    }
    els.saveBtn.disabled = false;
  }
  els.saveBtn.addEventListener('click', saveToAccount);

  /* ================= My covers ================= */
  const IC_OPEN = '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';
  const IC_DUP = '<svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>';
  const IC_DEL = '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>';
  const IC_PLUS = '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';
  const IC_DOC = '<svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>';

  let mineList = [];
  let mineSrc = 'all';
  let cloudLoading = false;
  function openMine() { show($('mine')); loadMine(); }
  function closeMine() { hide($('mine')); }
  async function fetchCloud() {
    if (!currentUser || !hasFb()) return [];
    try {
      const snap = await coversCol(currentUser.uid).get();
      return snap.docs.map((d) => {
        const data = d.data();
        return Object.assign({}, data, { _source: 'cloud', _cloudId: d.id, _ts: data.updatedAt && data.updatedAt.toMillis ? data.updatedAt.toMillis() : 0 });
      });
    } catch (e) {
      console.error('[cover] loading saved covers failed:', e);
      toast(t('t_cloud_err'));
      return [];
    }
  }
  async function loadMine() {
    const loggedIn = !!currentUser;
    $('mineLogin').classList.toggle('hidden', loggedIn || !hasFb());
    let cloud = [];
    if (loggedIn) { cloudLoading = true; renderMine(); cloud = await fetchCloud(); cloudLoading = false; }
    const cloudIds = new Set(cloud.map((c) => c._cloudId));
    const local = getHistory()
      .filter((x) => !(x.cloudId && cloudIds.has(x.cloudId)))
      .map((x) => Object.assign({}, x, { _source: 'local', _ts: new Date(x.archivedAt || 0).getTime() }));
    mineList = local.concat(cloud).sort((a, b) => b._ts - a._ts);
    renderMine();
  }
  function renderMine() {
    const fmt = (ms) => { try { return ms ? new Date(ms).toLocaleDateString(lang === 'ar' ? 'ar-DZ' : lang, { year: 'numeric', month: 'short', day: 'numeric' }) : ''; } catch (e) { return ''; } };
    const cards = mineList.map((r, idx) => ({ r, idx }))
      .filter(({ r }) => mineSrc === 'all' || (mineSrc === 'local' ? r._source === 'local' : r._source === 'cloud'))
      .map(({ r, idx }) => {
        const n = normalize(r);
        const d = DESIGN_BY_ID[n.designId];
        const isCurrent = (r._source === 'local' && r.localId && r.localId === localId) || (r._source === 'cloud' && r._cloudId === cloudId);
        const sub = [n.uni, d.name[lang]].filter(Boolean).join(' · ');
        return `<div class="g-card m-card" data-idx="${idx}">
          ${isCurrent ? `<span class="m-tag">${t('current')}</span>` : ''}
          <div class="m-top">
            <span class="m-ico" style="--c:${n.colors[n.designId] || d.color}">${IC_DOC}</span>
            <div class="m-info"><b>${escapeHtml(r.title || t('untitled'))}</b><small>${escapeHtml(sub)}</small></div>
          </div>
          <div class="m-row"><span class="m-date">${fmt(r._ts)}</span><span class="m-src ${r._source === 'cloud' ? 'cloud' : ''}">${r._source === 'cloud' ? t('src_cloud') : t('src_local')}</span></div>
          <div class="m-actions">
            <button type="button" class="primary" data-action="open">${IC_OPEN}${t('open_b')}</button>
            <button type="button" data-action="dup">${IC_DUP}${t('dup_b')}</button>
            <button type="button" class="danger icon" data-action="delete" title="${escapeAttr(t('del_b'))}" aria-label="${escapeAttr(t('del_b'))}">${IC_DEL}</button>
          </div></div>`;
      }).join('');
    const tail = cloudLoading ? `<div class="g-empty">${t('loading')}</div>` : (cards ? '' : `<div class="g-empty">${t('mine_empty')}</div>`);
    $('mGrid').innerHTML = `<button type="button" class="g-card m-new" data-action="new">${IC_PLUS}<span>${t('new_b')}</span></button>` + cards + tail;
  }
  function openEntry(r) {
    const prevLang = lang;
    applyState(r);
    if (r._source === 'cloud') {
      cloudId = r._cloudId;
      const match = getHistory().find((h) => h.cloudId === r._cloudId);
      localId = match ? match.localId : newLocalId();
    } else { localId = r.localId || newLocalId(); cloudId = r.cloudId || null; }
    if (r.lang && I18N[r.lang] && r.lang !== prevLang) { lang = r.lang; applyLanguage(); }
    refresh(); commitLocal();
  }
  $('btnMine').addEventListener('click', openMine);
  $('mClose').addEventListener('click', closeMine);
  $('mineLoginBtn').addEventListener('click', () => openLogin(loadMine));
  $('mineTabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-src]'); if (!b) return;
    mineSrc = b.dataset.src;
    $$('#mineTabs .chip').forEach((x) => x.classList.toggle('on', x === b));
    renderMine();
  });
  $('mine').addEventListener('click', async (e) => {
    if (e.target.id === 'mine') { closeMine(); return; }
    const btn = e.target.closest('[data-action]'); if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'new') {
      commitLocal();
      applyState({ designId: R.designId, colors: R.colors, fonts: R.fonts });
      localId = null; cloudId = null; toggleSec(null);
      closeMine(); refresh(); toast(t('t_new'));
      return;
    }
    const card = btn.closest('[data-idx]'); if (!card) return;
    const r = mineList[+card.dataset.idx]; if (!r) return;
    try {
      if (action === 'open') {
        commitLocal(); openEntry(r); closeMine(); toast(t('t_opened'));
      } else if (action === 'dup') {
        const h = getHistory();
        const copy = Object.assign({}, normalize(r), { lang: r.lang || lang, title: r.title, localId: newLocalId(), cloudId: null, archivedAt: new Date().toISOString() });
        h.unshift(copy); setHistory(h);
        toast(t('t_dup')); loadMine();
      } else if (action === 'delete') {
        if (!(await askConfirm(t('confirmDelete')))) return;
        if (r._source === 'cloud') {
          await coversCol(currentUser.uid).doc(r._cloudId).delete();
          setHistory(getHistory().map((x) => (x.cloudId === r._cloudId ? Object.assign({}, x, { cloudId: null }) : x)));
          if (cloudId === r._cloudId) cloudId = null;
        } else {
          setHistory(getHistory().filter((x) => x.localId !== r.localId));
          if (localId === r.localId) localId = null;
        }
        toast(t('t_deleted')); loadMine();
      }
    } catch (err) { console.error(err); toast(t('t_cloud_err')); }
  });

  /* ================= Print / PDF / PNG / Word ================= */
  // A clean, unscaled copy of the page for printing and image capture (what the preview shows).
  function buildPrintCopy() {
    const root = $('printRoot');
    const clone = els.page.cloneNode(true);
    clone.removeAttribute('id');
    clone.style.transform = '';
    $$('[id]', clone).forEach((n) => n.removeAttribute('id'));
    $$('.hl', clone).forEach((n) => n.classList.remove('hl'));
    root.innerHTML = '';
    root.appendChild(clone);
    return clone;
  }
  function fileBase() {
    const s = (R.title || exampleFor(R.designId).title || 'cover').trim().slice(0, 50);
    return s.replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, '-') || 'cover';
  }
  async function captureCanvas(scale) {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const copy = buildPrintCopy();
    $('printRoot').classList.add('capturing');
    await new Promise((r) => setTimeout(r, 80));
    try {
      return await html2canvas(copy, {
        scale, backgroundColor: '#ffffff', useCORS: true, logging: false,
        width: SHEET_W, height: SHEET_H, windowWidth: SHEET_W, scrollX: 0, scrollY: 0,
      });
    } finally {
      $('printRoot').classList.remove('capturing');
      $('printRoot').innerHTML = '';
    }
  }
  function download(blob, name) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  const canExport = () => typeof html2canvas !== 'undefined';

  els.printBtn.addEventListener('click', () => {
    buildPrintCopy();
    toast(t('t_print'));
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    fonts.then(() => setTimeout(() => window.print(), 250));
  });
  window.addEventListener('afterprint', () => { $('printRoot').innerHTML = ''; });

  els.downloadPdfBtn.addEventListener('click', async () => {
    if (!canExport() || !window.jspdf) { toast(t('t_pdf_err')); return; }
    els.downloadPdfBtn.disabled = true; toast(t('t_pdf'));
    try {
      const canvas = await captureCanvas(2.5);
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.94), 'JPEG', 0, 0, 210, 297);
      pdf.save(fileBase() + '.pdf');
      toast(t('t_pdf_ok'));
    } catch (e) { console.error('[cover] PDF export failed:', e); toast(t('t_pdf_err')); }
    els.downloadPdfBtn.disabled = false;
  });

  els.pngBtn.addEventListener('click', async () => {
    if (!canExport()) { toast(t('t_png_err')); return; }
    els.pngBtn.disabled = true; toast(t('t_wait'));
    try {
      const canvas = await captureCanvas(3);
      const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
      download(blob, fileBase() + '.png');
      toast(t('t_png'));
    } catch (e) { console.error('[cover] PNG export failed:', e); toast(t('t_png_err')); }
    els.pngBtn.disabled = false;
  });

  // Word: the cover as one full-page image, so the design stays exactly as previewed.
  els.wordBtn.addEventListener('click', async () => {
    if (!canExport()) { toast(t('t_word_err')); return; }
    els.wordBtn.disabled = true; toast(t('t_wait'));
    try {
      const canvas = await captureCanvas(2.5);
      const data = canvas.toDataURL('image/jpeg', 0.92).split(',')[1];
      const loc = 'file:///C:/cover/cover.jpg';
      const html = `<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta http-equiv=Content-Type content="text/html; charset=utf-8"><title>${escapeHtml(deriveTitle())}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>@page WordSection1{size:21.0cm 29.7cm;margin:0cm 0cm 0cm 0cm;mso-header-margin:0cm;mso-footer-margin:0cm;}
div.WordSection1{page:WordSection1;} p.MsoNormal{margin:0;line-height:normal;font-size:1pt;}</style></head>
<body><div class=WordSection1><p class=MsoNormal><img src="${loc}" width=794 height=1123 style="width:21cm;height:29.7cm"></p></div></body></html>`;
      const boundary = '----=_NextPart_cover_' + Date.now().toString(36);
      const b64 = (s) => btoa(unescape(encodeURIComponent(s))).replace(/.{76}/g, '$&\r\n');
      const mhtml = `MIME-Version: 1.0\r\nContent-Type: multipart/related; boundary="${boundary}"; type="text/html"\r\n\r\n`
        + `--${boundary}\r\nContent-Type: text/html; charset="utf-8"\r\nContent-Transfer-Encoding: base64\r\nContent-Location: file:///C:/cover/cover.htm\r\n\r\n${b64(html)}\r\n`
        + `--${boundary}\r\nContent-Type: image/jpeg\r\nContent-Transfer-Encoding: base64\r\nContent-Location: ${loc}\r\n\r\n${data.replace(/.{76}/g, '$&\r\n')}\r\n`
        + `--${boundary}--\r\n`;
      download(new Blob([mhtml], { type: 'application/msword' }), fileBase() + '.doc');
      toast(t('t_word'));
    } catch (e) { console.error('[cover] Word export failed:', e); toast(t('t_word_err')); }
    els.wordBtn.disabled = false;
  });

  /* ================= Language ================= */
  function applyLanguage() {
    const dict = I18N[lang];
    els.htmlRoot.setAttribute('lang', lang);
    els.htmlRoot.setAttribute('dir', dict.dir);
    document.title = dict.pageTitleTag;
    $$('[data-i18n]').forEach((n) => { const v = dict[n.getAttribute('data-i18n')]; if (typeof v === 'string') n.textContent = v; });
    $$('[data-i18n-placeholder]').forEach((n) => { const v = dict[n.getAttribute('data-i18n-placeholder')]; if (typeof v === 'string') n.setAttribute('placeholder', v); });
    $$('[data-tip]').forEach((n) => { n.setAttribute('data-tiptext', dict[n.getAttribute('data-tip')]); n.setAttribute('aria-label', dict[n.getAttribute('data-tip')]); });
    els.langBtns.forEach((b) => b.classList.toggle('on', b.getAttribute('data-lang') === lang));
    $('langToggle').textContent = lang.toUpperCase();
    try { localStorage.setItem('coverpage:lang', lang); } catch (e) { /* ignore */ }

    updateAuthFormMode(authMode);
    renderTypeSuggest(); renderStudents(); renderJury(); renderFontFilter(); renderSwatches();
    refresh();
    if (openSec === 'design') renderDesignStrip();
    if (!$('mine').classList.contains('hidden')) renderMine();
    if (!$('gallery').classList.contains('hidden')) buildGallery();
  }
  $('langToggle').addEventListener('click', (e) => { e.stopPropagation(); $('langMenu').classList.toggle('hidden'); });
  els.langBtns.forEach((btn) => btn.addEventListener('click', () => {
    hide($('langMenu'));
    lang = btn.getAttribute('data-lang');
    applyLanguage(); saveDraft();
  }));
  document.addEventListener('click', (e) => { if (!e.target.closest('.lang-wrap')) hide($('langMenu')); });

  /* ================= Toolbar ================= */
  $('btnFullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) (document.documentElement.requestFullscreen || function () {}).call(document.documentElement);
    else if (document.exitFullscreen) document.exitFullscreen();
  });
  $('panelToggle').addEventListener('click', () => {
    $('workspace').classList.toggle('collapsed');
    setTimeout(applyZoom, 320);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeGallery(); closeMine(); closeConfirm(false);
    if (!$('login').classList.contains('hidden')) { pendingAfterLogin = null; closeLogin(); }
  });

  /* ================= Init ================= */
  function init() {
    const draft = loadDraft();
    if (draft) {
      if (draft.lang && I18N[draft.lang]) lang = draft.lang;
      applyState(draft);
      localId = draft.localId || null;
      cloudId = draft.cloudId || null;
    } else {
      applyState({});
    }
    applyLanguage();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { refresh(); renderThumbs(); });
  }
  init();
})();
