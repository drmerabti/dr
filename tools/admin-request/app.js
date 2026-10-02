// ============================================================
// app.js — Admin Request Generator
// Shell (topbar, right-hand panel, accordion, gallery, "My requests",
// login, toasts) mirrors tools/brochure-generator.
// ============================================================

(function () {
  "use strict";

  const I18N = window.ADMINREQ_I18N;
  const TYPES = window.ADMINREQ_TYPES;
  const DESIGNS = window.ADMINREQ_DESIGNS;
  const FONTS = window.ADMINREQ_FONTS;
  const TYPE_BY_ID = Object.fromEntries(TYPES.map((x) => [x.id, x]));
  const DESIGN_BY_ID = Object.fromEntries(DESIGNS.map((x) => [x.id, x]));

  let lang = localStorage.getItem('adminreq:lang') || 'ar';
  if (!I18N[lang]) lang = 'ar';
  const t = (key) => I18N[lang][key];

  const $ = (id) => document.getElementById(id);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const show = (el) => el.classList.remove('hidden');
  const hide = (el) => el.classList.add('hidden');

  function escapeAttr(s) { return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
  function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function todayISO() { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); }
  function newLocalId() { return 'L' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function mixHex(hex, other, w) {
    const a = parseInt(hex.slice(1), 16), b = parseInt(other.slice(1), 16);
    const ch = (x, s) => (x >> s) & 255;
    const m = (s) => Math.round(ch(a, s) * (1 - w) + ch(b, s) * w);
    return '#' + [16, 8, 0].map((s) => m(s).toString(16).padStart(2, '0')).join('');
  }

  /* ================= State ================= */
  let extraFields = [];
  let attachments = [];
  let companyLogoDataUrl = null;
  let stampDataUrl = null;
  let activeFont = FONTS[0];
  let tplId = 'free';
  let designId = 'classic';
  let fontScale = 130; // % of the base text size, 80–150 (default 130)
  let bodyIsOwned = false; // true once AI-generated or manually edited — stops auto-mirroring the idea draft
  let localId = null;
  let cloudId = null;
  let dailyUsage = { used: 0, max: 2 };

  /* ================= DOM refs ================= */
  const els = {
    htmlRoot: $('htmlRoot'), langBtns: $$('.lang-btn'),
    fFirstName: $('fFirstName'), fLastName: $('fLastName'), fPhone: $('fPhone'), fEmail: $('fEmail'),
    fAddressedTo: $('fAddressedTo'), fSubjectTitle: $('fSubjectTitle'), fDate: $('fDate'), fPlace: $('fPlace'),
    fRequestSubject: $('fRequestSubject'), fBody: $('fBody'),
    extraFieldsList: $('extraFieldsList'), attachList: $('attachList'),
    generateBtn: $('generateBtn'), generateBtnText: $('generateBtnText'), rephraseBtn: $('rephraseBtn'), shortenBtn: $('shortenBtn'),
    aiError: $('aiError'), usageIndicator: $('usageIndicator'),
    companyLogoBox: $('companyLogoBox'), companyLogoInput: $('companyLogoInput'), companyLogoPreview: $('companyLogoPreview'),
    companyLogoPlaceholder: $('companyLogoPlaceholder'), companyLogoRemove: $('companyLogoRemove'),
    stampBox: $('stampBox'), stampInput: $('stampInput'), stampPreview: $('stampPreview'), stampPlaceholder: $('stampPlaceholder'), stampRemove: $('stampRemove'),
    fontFilter: $('fontFilter'), typeGrid: $('typeGrid'), designStrip: $('designStrip'), toSuggest: $('toSuggest'),
    requestPage: $('requestPage'), sheetHolder: $('sheetHolder'),
    reqHeader: $('reqHeader'), reqCompanyLogo: $('reqCompanyLogo'), removeHeaderBtn: $('removeHeaderBtn'), removeStampBtn: $('removeStampBtn'),
    reqDate: $('reqDate'), reqLabelName: $('reqLabelName'), reqLabelLastName: $('reqLabelLastName'), reqLabelPhone: $('reqLabelPhone'),
    reqLabelEmail: $('reqLabelEmail'), reqLabelSubject: $('reqLabelSubject'), reqLabelAttach: $('reqLabelAttach'),
    reqSenderFirst: $('reqSenderFirst'), reqSenderLast: $('reqSenderLast'), reqSenderPhone: $('reqSenderPhone'), reqSenderEmail: $('reqSenderEmail'),
    reqExtraInfo: $('reqExtraInfo'), reqAddressed: $('reqAddressed'), reqSubjectValue: $('reqSubjectValue'), reqBody: $('reqBody'),
    reqAttach: $('reqAttach'), reqAttachList: $('reqAttachList'), reqStamp: $('reqStamp'), reqSignatureCaption: $('reqSignatureCaption'),
    saveBtn: $('saveBtn'), printBtn: $('printBtn'), wordBtn: $('wordBtn'), downloadPdfBtn: $('downloadPdfBtn'), clearAllBtn: $('clearAllBtn'),
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

  /* ================= Example values (shown greyed until filled) ================= */
  const DEFAULTS = {
    ar: { firstName: 'سفيان', lastName: 'مرابطي', subject: 'طلب إجازة سنوية' },
    fr: { firstName: 'Sofiane', lastName: 'Merabti', subject: 'Demande de congé annuel' },
    en: { firstName: 'Sofiane', lastName: 'Merabti', subject: 'Annual leave request' },
  };
  const DEFAULT_PHONE = '0555 12 34 56', DEFAULT_EMAIL = 'sofiane@email.com';

  /* ================= Fonts ================= */
  function renderFontFilter() {
    els.fontFilter.innerHTML = FONTS.map((f) => `
      <button type="button" class="font-btn ${f.id === activeFont.id ? 'on' : ''}" data-id="${f.id}">
        <b style="font-family:${lang === 'ar' ? f.ar : f.en}">${lang === 'ar' ? 'طلب إداري' : 'Demande'}</b>
        <small>${escapeHtml(f.name[lang])}</small>
      </button>`).join('');
  }
  els.fontFilter.addEventListener('click', (e) => {
    const b = e.target.closest('.font-btn'); if (!b) return;
    activeFont = FONTS.find((f) => f.id === parseInt(b.dataset.id, 10)) || FONTS[0];
    renderFontFilter(); applyFont(); saveDraft(); refresh();
  });
  function applyFont() {
    els.requestPage.style.setProperty('--rq-font-ar', activeFont.ar);
    els.requestPage.style.setProperty('--rq-font-en', activeFont.en);
  }

  /* ================= Text size ================= */
  const FS_MIN = 80, FS_MAX = 150, FS_STEP = 5, FS_DEFAULT = 130;
  const FS_VERSION = 2; // requests saved before the 130% default start at the new default
  function clampScale(v) {
    v = Math.round((parseInt(v, 10) || FS_DEFAULT) / FS_STEP) * FS_STEP;
    return Math.max(FS_MIN, Math.min(FS_MAX, v));
  }
  function applyFontScale() {
    els.requestPage.style.setProperty('--fs', String(fontScale / 100));
    $('fsVal').textContent = fontScale + '%';
    $('fsDown').disabled = fontScale <= FS_MIN;
    $('fsUp').disabled = fontScale >= FS_MAX;
    $('fsReset').disabled = fontScale === FS_DEFAULT;
  }
  function setFontScale(v) {
    const nv = clampScale(v);
    if (nv === fontScale) return;
    fontScale = nv;
    applyFontScale(); refresh(); saveDraft();
  }
  $('fsDown').addEventListener('click', () => setFontScale(fontScale - FS_STEP));
  $('fsUp').addEventListener('click', () => setFontScale(fontScale + FS_STEP));
  $('fsReset').addEventListener('click', () => setFontScale(FS_DEFAULT));

  /* ================= Design ================= */
  function applyDesign() {
    const d = DESIGN_BY_ID[designId] || DESIGNS[0];
    DESIGNS.forEach((x) => els.requestPage.classList.remove('d-' + x.id));
    els.requestPage.classList.add('d-' + d.id);
    setAccent(els.requestPage, d.color);
  }
  function setAccent(el, color) {
    el.style.setProperty('--ac', color);
    el.style.setProperty('--ac-soft', mixHex(color, '#ffffff', 0.9)); // html2canvas cannot parse color-mix
  }

  /* ================= Body (textarea <-> sheet) ================= */
  function getBody() { return els.reqBody.innerText.replace(/\n$/, ''); }
  function setBody(text) {
    els.reqBody.innerText = text || '';
    els.fBody.value = text || '';
    syncAiButtons();
  }
  els.fBody.addEventListener('input', () => {
    els.reqBody.innerText = els.fBody.value;
    bodyIsOwned = els.fBody.value.trim().length > 0;
    syncAiButtons(); saveDraft(); refreshLight();
  });
  els.reqBody.addEventListener('input', () => {
    bodyIsOwned = els.reqBody.innerText.trim().length > 0;
    els.fBody.value = getBody();
    syncAiButtons(); saveDraft(); refreshLight();
  });
  // Live-mirror the idea textarea into the body as a draft, until the body becomes "owned"
  els.fRequestSubject.addEventListener('input', () => {
    if (!bodyIsOwned) setBody(els.fRequestSubject.value);
    saveDraft(); refreshLight();
  });
  function syncAiButtons() {
    const hasText = els.reqBody.innerText.trim().length > 0;
    els.rephraseBtn.disabled = !hasText;
    els.shortenBtn.disabled = !hasText;
  }

  /* ================= Preview ================= */
  function setVal(el, value, fallback) {
    const v = (value || '').trim();
    el.textContent = v || fallback;
    el.classList.toggle('ph', !v);
  }
  function formatDate(iso, l) {
    const d = iso ? new Date(iso + 'T12:00:00') : new Date();
    const loc = { ar: 'ar-DZ', en: 'en-GB', fr: 'fr-FR' }[l || lang];
    try { return d.toLocaleDateString(loc, { year: 'numeric', month: 'long', day: 'numeric', numberingSystem: 'latn' }); }
    catch (e) { return d.toLocaleDateString(loc, { year: 'numeric', month: 'long', day: 'numeric' }); }
  }
  function dateLine() {
    const place = els.fPlace.value.trim();
    const date = formatDate(els.fDate.value);
    if (!place) return date;
    if (lang === 'ar') return `${place} في ${date}`;
    if (lang === 'fr') return `${place}, le ${date}`;
    return `${place}, ${date}`;
  }

  function renderPreview() {
    const def = DEFAULTS[lang];
    const hasHeader = !!companyLogoDataUrl;
    els.reqHeader.classList.toggle('hidden', !hasHeader);
    els.reqCompanyLogo.classList.toggle('hidden', !hasHeader);
    if (hasHeader) els.reqCompanyLogo.src = companyLogoDataUrl;

    els.reqDate.textContent = dateLine();
    setVal(els.reqSenderFirst, els.fFirstName.value, def.firstName);
    setVal(els.reqSenderLast, els.fLastName.value, def.lastName);
    setVal(els.reqSenderPhone, els.fPhone.value, DEFAULT_PHONE);
    setVal(els.reqSenderEmail, els.fEmail.value, DEFAULT_EMAIL);

    els.reqExtraInfo.innerHTML = extraFields
      .filter((f) => (f.key || '').trim() || (f.val || '').trim())
      .map((f) => `<p><span class="req-label">${escapeHtml(f.key)}${f.key.trim() ? ': ' : ''}</span><span class="req-value">${escapeHtml(f.val)}</span></p>`)
      .join('');

    setVal(els.reqAddressed, els.fAddressedTo.value, t('defaultAddressed'));
    const typeSubject = (TYPE_BY_ID[tplId] && TYPE_BY_ID[tplId].subject[lang]) || def.subject;
    setVal(els.reqSubjectValue, els.fSubjectTitle.value, typeSubject);

    const att = attachments.filter((a) => (a || '').trim());
    els.reqAttach.classList.toggle('hidden', !att.length);
    els.reqAttachList.innerHTML = att.map((a, i) => `<p><span class="req-att-n">${i + 1}.</span> ${escapeHtml(a)}</p>`).join('');

    els.reqStamp.classList.toggle('hidden', !stampDataUrl);
    els.removeStampBtn.classList.toggle('hidden', !stampDataUrl);
    if (stampDataUrl) els.reqStamp.src = stampDataUrl;

    els.reqBody.setAttribute('data-placeholder', t('bodyPlaceholder'));
  }

  /* refresh = preview + summaries + zoom + thumbs */
  let thumbTimer = null;
  function refresh() {
    renderPreview();
    updateSummaries();
    applyZoom();
    highlight();
    clearTimeout(thumbTimer);
    thumbTimer = setTimeout(renderThumbs, 350);
  }
  function refreshLight() { updateSummaries(); applyZoom(); clearTimeout(thumbTimer); thumbTimer = setTimeout(renderThumbs, 500); }

  [els.fFirstName, els.fLastName, els.fPhone, els.fEmail, els.fAddressedTo, els.fSubjectTitle, els.fDate, els.fPlace].forEach((inp) => {
    inp.addEventListener('input', () => { refresh(); saveDraft(); });
  });

  /* ================= Recipient suggestions ================= */
  function renderToSuggest() {
    els.toSuggest.innerHTML = t('toSuggestions').map((s) => `<button type="button" class="chip">${escapeHtml(s)}</button>`).join('');
  }
  els.toSuggest.addEventListener('click', (e) => {
    const b = e.target.closest('.chip'); if (!b) return;
    els.fAddressedTo.value = b.textContent; refresh(); saveDraft();
  });

  /* ================= Extra fields & attachments ================= */
  const IC_X = '<svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>';
  function renderExtraFields() {
    els.extraFieldsList.innerHTML = extraFields.map((f, i) => `
      <div class="dyn-row">
        <input type="text" class="k extra-key" data-i="${i}" placeholder="${escapeAttr(t('extraKeyPh'))}" value="${escapeAttr(f.key)}">
        <input type="text" class="extra-val" data-i="${i}" placeholder="${escapeAttr(t('extraValPh'))}" value="${escapeAttr(f.val)}">
        <button type="button" class="dyn-remove" data-i="${i}" aria-label="${escapeAttr(t('remove'))}">${IC_X}</button>
      </div>`).join('');
  }
  els.extraFieldsList.addEventListener('input', (e) => {
    const i = +e.target.dataset.i; if (!extraFields[i]) return;
    if (e.target.classList.contains('extra-key')) extraFields[i].key = e.target.value;
    else extraFields[i].val = e.target.value;
    refresh(); saveDraft();
  });
  els.extraFieldsList.addEventListener('click', (e) => {
    const b = e.target.closest('.dyn-remove'); if (!b) return;
    extraFields.splice(+b.dataset.i, 1); renderExtraFields(); refresh(); saveDraft();
  });
  $('addExtraBtn').addEventListener('click', () => {
    extraFields.push({ key: '', val: '' }); renderExtraFields(); saveDraft();
    const rows = $$('.extra-key', els.extraFieldsList); if (rows.length) rows[rows.length - 1].focus();
  });

  function renderAttachments() {
    els.attachList.innerHTML = attachments.map((a, i) => `
      <div class="dyn-row">
        <span class="n">${i + 1}</span>
        <input type="text" class="att" data-i="${i}" placeholder="${escapeAttr(t('attachPh'))}" value="${escapeAttr(a)}">
        <button type="button" class="dyn-remove" data-i="${i}" aria-label="${escapeAttr(t('remove'))}">${IC_X}</button>
      </div>`).join('');
  }
  els.attachList.addEventListener('input', (e) => {
    const i = +e.target.dataset.i; if (!e.target.classList.contains('att')) return;
    attachments[i] = e.target.value; refresh(); saveDraft();
  });
  els.attachList.addEventListener('click', (e) => {
    const b = e.target.closest('.dyn-remove'); if (!b) return;
    attachments.splice(+b.dataset.i, 1); renderAttachments(); refresh(); saveDraft();
  });
  $('addAttachBtn').addEventListener('click', () => {
    attachments.push(''); renderAttachments(); saveDraft();
    const rows = $$('.att', els.attachList); if (rows.length) rows[rows.length - 1].focus();
  });

  /* ================= Letterhead / stamp uploads ================= */
  function syncUploadPreviews() {
    const set = (img, ph, rm, url) => {
      img.classList.toggle('hidden', !url); ph.classList.toggle('hidden', !!url); rm.classList.toggle('hidden', !url);
      if (url) img.src = url; else img.removeAttribute('src');
    };
    set(els.companyLogoPreview, els.companyLogoPlaceholder, els.companyLogoRemove, companyLogoDataUrl);
    set(els.stampPreview, els.stampPlaceholder, els.stampRemove, stampDataUrl);
  }
  function setupUpload(box, input, setUrl) {
    box.addEventListener('click', (e) => { if (!e.target.closest('.upload-remove')) input.click(); });
    input.addEventListener('change', () => {
      const file = input.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => { setUrl(e.target.result); input.value = ''; syncUploadPreviews(); refresh(); saveDraft(); };
      reader.readAsDataURL(file);
    });
  }
  setupUpload(els.companyLogoBox, els.companyLogoInput, (u) => { companyLogoDataUrl = u; });
  setupUpload(els.stampBox, els.stampInput, (u) => { stampDataUrl = u; });
  function removeHeader() { companyLogoDataUrl = null; syncUploadPreviews(); refresh(); saveDraft(); }
  function removeStamp() { stampDataUrl = null; syncUploadPreviews(); refresh(); saveDraft(); }
  els.companyLogoRemove.addEventListener('click', removeHeader);
  els.stampRemove.addEventListener('click', removeStamp);
  els.removeHeaderBtn.addEventListener('click', (e) => { e.stopPropagation(); removeHeader(); });
  els.removeStampBtn.addEventListener('click', (e) => { e.stopPropagation(); removeStamp(); });

  /* ================= Request types & designs ================= */
  function renderTypeGrid() {
    els.typeGrid.innerHTML = TYPES.map((x) => `
      <button type="button" class="type-card ${x.id === tplId ? 'on' : ''}" data-type="${x.id}" style="--c:${x.color}">
        <span class="t-ico"><svg viewBox="0 0 24 24">${x.icon}</svg></span><span>${escapeHtml(x.name[lang])}</span>
      </button>`).join('');
  }
  els.typeGrid.addEventListener('click', (e) => {
    const b = e.target.closest('[data-type]'); if (b) applyType(b.dataset.type);
  });

  function isTemplateText(text) {
    const v = (text || '').trim();
    if (!v) return true;
    return TYPES.some((x) => ['ar', 'fr', 'en'].some((l) => x.body[l].trim() === v));
  }
  async function applyType(id, fromGallery) {
    const x = TYPE_BY_ID[id]; if (!x) return;
    if (x.id !== 'free' && x.body[lang]) {
      const cur = getBody();
      if (!isTemplateText(cur) && cur.trim() !== x.body[lang].trim()) {
        if (!(await askConfirm(t('confirmTpl')))) return;
      }
      els.fSubjectTitle.value = x.subject[lang];
      setBody(x.body[lang]);
      bodyIsOwned = true;
    }
    tplId = x.id;
    renderTypeGrid();
    if (fromGallery) closeGallery();
    refresh(); saveDraft();
    toast(t('t_tpl'));
  }

  // When the language changes, an untouched template follows it.
  function translateUntouchedTemplate(oldLang) {
    const x = TYPE_BY_ID[tplId];
    if (!x || x.id === 'free') return;
    if (getBody().trim() === x.body[oldLang].trim()) setBody(x.body[lang]);
    if (els.fSubjectTitle.value.trim() === x.subject[oldLang]) els.fSubjectTitle.value = x.subject[lang];
  }

  function setDesign(id, fromGallery) {
    if (!DESIGN_BY_ID[id]) return;
    designId = id;
    applyDesign();
    if (fromGallery) closeGallery();
    refresh(); saveDraft();
    toast(t('t_design'));
  }
  els.designStrip.addEventListener('click', (e) => {
    const b = e.target.closest('[data-design]'); if (b) setDesign(b.dataset.design);
  });

  /* ================= Mini sheets (thumbnails) ================= */
  function miniSheet(opts) {
    const clone = els.requestPage.cloneNode(true);
    clone.removeAttribute('id');
    clone.style.transform = '';
    $$('[id]', clone).forEach((n) => n.removeAttribute('id'));
    $$('.hl', clone).forEach((n) => n.classList.remove('hl'));
    $$('.req-remove-btn', clone).forEach((n) => n.remove());
    $$('[contenteditable]', clone).forEach((n) => n.removeAttribute('contenteditable'));
    if (opts && opts.design) {
      DESIGNS.forEach((x) => clone.classList.remove('d-' + x.id));
      clone.classList.add('d-' + opts.design);
      setAccent(clone, DESIGN_BY_ID[opts.design].color);
    }
    if (opts && opts.type && opts.type.id !== 'free') {
      const sv = clone.querySelector('.req-subject .req-value'); if (sv) { sv.textContent = opts.type.subject[lang]; sv.classList.remove('ph'); }
      const b = clone.querySelector('.req-body'); if (b) b.textContent = opts.type.body[lang];
    }
    clone.classList.add('mini');
    return clone;
  }
  function mountMini(box, opts) {
    box.innerHTML = '';
    const w = box.clientWidth; if (!w) return;
    const m = miniSheet(opts);
    m.style.transform = `scale(${w / 794})`;
    box.appendChild(m);
  }
  function renderThumbs() {
    mountMini($('currentThumb'), null);
    const tn = TYPE_BY_ID[tplId], dn = DESIGN_BY_ID[designId];
    $('currentTplName').textContent = `${tn ? tn.name[lang] : ''} · ${dn ? dn.name[lang] : ''}`;
    if (openSec === 'type') renderDesignStrip();
  }
  function renderDesignStrip() {
    els.designStrip.innerHTML = DESIGNS.map((d) => `
      <button type="button" class="tpl-chip ${d.id === designId ? 'on' : ''}" data-design="${d.id}">
        <span class="t-thumb"></span><span>${escapeHtml(d.name[lang])}</span>
      </button>`).join('');
    $$('.tpl-chip', els.designStrip).forEach((c) => mountMini(c.querySelector('.t-thumb'), { design: c.dataset.design }));
  }

  /* ================= Gallery ================= */
  let gTab = 'types';
  function openGallery() { show($('gallery')); buildGallery(); setTimeout(() => $('gSearch').focus(), 50); }
  function closeGallery() { hide($('gallery')); }
  function buildGallery() {
    const q = $('gSearch').value.trim().toLowerCase();
    const match = (names) => !q || Object.values(names).some((n) => n.toLowerCase().includes(q));
    let cards = '';
    if (gTab === 'types') {
      cards = TYPES.filter((x) => match(x.name)).map((x) => `
        <button type="button" class="g-card ${x.id === tplId ? 'on' : ''}" data-type="${x.id}">
          <div class="g-thumb"></div>
          <div class="g-meta"><span class="g-ico" style="--c:${x.color}"><svg viewBox="0 0 24 24">${x.icon}</svg></span><b>${escapeHtml(x.name[lang])}</b></div>
        </button>`).join('');
    } else {
      cards = DESIGNS.filter((d) => match(d.name)).map((d) => `
        <button type="button" class="g-card ${d.id === designId ? 'on' : ''}" data-design="${d.id}">
          <div class="g-thumb"></div>
          <div class="g-meta"><span class="g-ico" style="--c:${d.color}"><svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/></svg></span><b>${escapeHtml(d.name[lang])}</b></div>
        </button>`).join('');
    }
    $('gGrid').innerHTML = cards || `<div class="g-empty">${t('g_empty')}</div>`;
    $$('.g-card', $('gGrid')).forEach((c) => {
      const box = c.querySelector('.g-thumb');
      if (c.dataset.type) mountMini(box, { type: TYPE_BY_ID[c.dataset.type] });
      else mountMini(box, { design: c.dataset.design });
    });
  }
  $('btnGallery').addEventListener('click', openGallery);
  $('gClose').addEventListener('click', closeGallery);
  $('gSearch').addEventListener('input', buildGallery);
  $('gTabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-tab]'); if (!b) return;
    gTab = b.dataset.tab;
    $$('#gTabs .chip').forEach((x) => x.classList.toggle('on', x === b));
    buildGallery();
  });
  $('gallery').addEventListener('click', (e) => {
    if (e.target.id === 'gallery') { closeGallery(); return; }
    const c = e.target.closest('.g-card'); if (!c) return;
    if (c.dataset.type) applyType(c.dataset.type, true);
    else if (c.dataset.design) setDesign(c.dataset.design, true);
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
    els.requestPage.style.transform = `scale(${s})`;
    els.sheetHolder.style.width = (SHEET_W * s) + 'px';
    els.sheetHolder.style.height = (els.requestPage.offsetHeight * s) + 'px';
    $('zoomVal').textContent = Math.round(s * 100) + '%';
    const over = els.requestPage.offsetHeight > SHEET_H + 2; // taller than one A4 page
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
    $$('[data-sec]', els.requestPage).forEach((p) => {
      const on = !!openSec && p.dataset.sec === openSec;
      p.classList.toggle('hl', on);
      if (on) p.style.setProperty('--hl', secColor(openSec));
    });
  }

  // clicking a part of the request opens its section
  els.requestPage.addEventListener('click', (e) => {
    if (e.target.closest('.req-remove-btn')) return;
    const part = e.target.closest('[data-sec]'); if (!part) return;
    const k = part.dataset.sec;
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
    if (openSec === 'type') setTimeout(renderDesignStrip, 30);
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
    const tn = TYPE_BY_ID[tplId], dn = DESIGN_BY_ID[designId];
    set('type', `${tn ? tn.name[lang] : ''} · ${dn ? dn.name[lang] : ''}`);
    const name = [els.fFirstName.value, els.fLastName.value].map((s) => s.trim()).filter(Boolean).join(' ');
    const nExtra = extraFields.filter((f) => (f.key || '').trim() || (f.val || '').trim()).length;
    const senderBits = [name, els.fPhone.value.trim() || els.fEmail.value.trim(), nExtra ? t('n_extra')(nExtra) : ''].filter(Boolean);
    set('sender', senderBits.length ? cut(senderBits.join(' · ')) : t('d_sender'));
    set('to', cut(els.fAddressedTo.value) || t('d_to'));
    set('subject', cut(els.fSubjectTitle.value || getBody()) || t('d_subject'));
    const nAtt = attachments.filter((a) => (a || '').trim()).length;
    set('attach', nAtt ? t('n_attach')(nAtt) : t('d_attach'));
    set('sign', `${dateLine()} · ${stampDataUrl ? t('with_stamp') : t('no_stamp')}`);
    set('style', [activeFont.name[lang], fontScale !== FS_DEFAULT ? t('size_lbl')(fontScale) : '', companyLogoDataUrl ? t('with_header') : ''].filter(Boolean).join(' · '));
  }

  /* ================= Persistence (device) ================= */
  const STORAGE_KEY = 'adminreq:draft';
  const HISTORY_KEY = 'adminreq:history';
  const MAX_HISTORY = 30;
  let draftTimer = null;

  function collectFullState() {
    return {
      activeFontId: activeFont.id, companyLogoDataUrl, stampDataUrl, extraFields, attachments,
      fFirstName: els.fFirstName.value, fLastName: els.fLastName.value,
      fPhone: els.fPhone.value, fEmail: els.fEmail.value, fAddressedTo: els.fAddressedTo.value, fSubjectTitle: els.fSubjectTitle.value,
      fDate: els.fDate.value, fPlace: els.fPlace.value,
      fRequestSubject: els.fRequestSubject.value, bodyText: getBody(), bodyIsOwned,
      tplId, designId, fontScale, fontScaleV: FS_VERSION, lang,
    };
  }
  function hasContent(s) {
    return !!['fFirstName', 'fLastName', 'fAddressedTo', 'fSubjectTitle', 'fRequestSubject', 'bodyText'].some((k) => (s[k] || '').trim());
  }
  function getHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch (e) { return []; }
  }
  function setHistory(h) {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); return true; } catch (e) { return false; }
  }
  // Writes the draft and keeps the request in the on-device "My requests" list.
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
      h.forEach((x, i) => { if (i > 0) { x.companyLogoDataUrl = null; x.stampDataUrl = null; } });
      ok = setHistory(h) && ok;
    }
    return ok;
  }
  function saveDraft() { clearTimeout(draftTimer); draftTimer = setTimeout(commitLocal, 500); }
  window.addEventListener('pagehide', () => { clearTimeout(draftTimer); commitLocal(); });

  function loadDraft() {
    try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; }
    catch (e) { return null; }
  }

  function applyState(state) {
    activeFont = FONTS.find((f) => f.id === state.activeFontId) || FONTS[0];
    companyLogoDataUrl = state.companyLogoDataUrl || null;
    stampDataUrl = state.stampDataUrl || null;
    extraFields = Array.isArray(state.extraFields) ? state.extraFields.map((f) => ({ key: f.key || '', val: f.val || '' })) : [];
    attachments = Array.isArray(state.attachments) ? state.attachments.slice() : [];
    els.fFirstName.value = state.fFirstName || ''; els.fLastName.value = state.fLastName || '';
    els.fPhone.value = state.fPhone || ''; els.fEmail.value = state.fEmail || '';
    els.fAddressedTo.value = state.fAddressedTo || ''; els.fSubjectTitle.value = state.fSubjectTitle || '';
    els.fDate.value = state.fDate || todayISO(); els.fPlace.value = state.fPlace || '';
    els.fRequestSubject.value = state.fRequestSubject || '';
    setBody(state.bodyText || '');
    bodyIsOwned = !!state.bodyIsOwned;
    tplId = TYPE_BY_ID[state.tplId] ? state.tplId : 'free';
    designId = DESIGN_BY_ID[state.designId] ? state.designId : 'classic';
    fontScale = state.fontScaleV === FS_VERSION ? clampScale(state.fontScale) : FS_DEFAULT;
    syncUploadPreviews(); renderExtraFields(); renderAttachments(); renderFontFilter(); renderTypeGrid();
    applyFont(); applyDesign(); applyFontScale(); syncAiButtons();
  }

  function deriveTitle() {
    const s = els.fSubjectTitle.value.trim() || els.fRequestSubject.value.trim() || getBody().trim().split('\n')[0];
    return s ? s.slice(0, 60) : t('untitledRequest');
  }

  function clearFormFields() {
    applyState({ fDate: todayISO() });
    localId = null; cloudId = null;
  }

  els.clearAllBtn.addEventListener('click', async () => {
    if (!(await askConfirm(t('confirmClear')))) return;
    clearFormFields();
    refresh(); commitLocal();
    toast(t('t_cleared'));
  });

  /* ================= Account (Firebase): users/{uid}/adminRequests ================= */
  const hasFb = () => typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length && firebase.auth && firebase.firestore;
  let currentUser = null;
  const requestsCol = (uid) => firebase.firestore().collection('users').doc(uid).collection('adminRequests');
  let pendingAfterLogin = null;

  if (hasFb()) {
    firebase.auth().onAuthStateChanged((user) => {
      currentUser = user;
      if (!$('mine').classList.contains('hidden')) loadMine();
    });
  }

  function openLogin(after, forAi) {
    pendingAfterLogin = after || null;
    $('loginTitle').textContent = forAi ? t('login_ai_title') : t('login_title');
    $('loginText').textContent = forAi ? t('login_ai_text') : t('login_text');
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
      const col = requestsCol(currentUser.uid);
      if (cloudId) {
        await col.doc(cloudId).set(payload, { merge: true });
      } else {
        const ref = await col.add(Object.assign({ createdAt: firebase.firestore.FieldValue.serverTimestamp() }, payload));
        cloudId = ref.id;
      }
      commitLocal();
      toast(t('t_saved_cloud'));
    } catch (e) {
      console.error('[adminreq] saveToCloud failed:', e);
      toast(t('t_cloud_err'));
    }
    els.saveBtn.disabled = false;
  }
  els.saveBtn.addEventListener('click', saveToAccount);

  /* ================= My requests ================= */
  const IC_OPEN = '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';
  const IC_DUP = '<svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>';
  const IC_DEL = '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>';
  const IC_PLUS = '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';

  let mineList = [];
  let mineSrc = 'all';
  let cloudLoading = false;

  function openMine() { show($('mine')); loadMine(); }
  function closeMine() { hide($('mine')); }

  async function fetchCloud() {
    if (!currentUser || !hasFb()) return [];
    try {
      const snap = await requestsCol(currentUser.uid).get();
      return snap.docs.map((d) => {
        const data = d.data();
        return Object.assign({}, data, { _source: 'cloud', _cloudId: d.id, _ts: data.updatedAt && data.updatedAt.toMillis ? data.updatedAt.toMillis() : 0 });
      });
    } catch (e) {
      console.error('[adminreq] loading saved requests failed:', e);
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
        const isCurrent = (r._source === 'local' && r.localId && r.localId === localId) || (r._source === 'cloud' && r._cloudId === cloudId);
        const ty = TYPE_BY_ID[r.tplId] || TYPE_BY_ID.free;
        const to = (r.fAddressedTo || '').trim();
        return `<div class="g-card m-card" data-idx="${idx}">
          ${isCurrent ? `<span class="m-tag">${t('current')}</span>` : ''}
          <div class="m-top">
            <span class="m-ico" style="--c:${ty.color}"><svg viewBox="0 0 24 24">${ty.icon}</svg></span>
            <div class="m-info"><b>${escapeHtml(r.title || t('untitledRequest'))}</b><small>${escapeHtml(to || ty.name[lang])}</small></div>
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
      clearFormFields(); openSec = null; toggleSec(null);
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
        const copy = Object.assign({}, r, { localId: newLocalId(), cloudId: null, archivedAt: new Date().toISOString() });
        delete copy._source; delete copy._cloudId; delete copy._ts; delete copy.updatedAt; delete copy.createdAt;
        h.unshift(copy); setHistory(h);
        toast(t('t_dup')); loadMine();
      } else if (action === 'delete') {
        if (!(await askConfirm(t('confirmDelete')))) return;
        if (r._source === 'cloud') {
          await requestsCol(currentUser.uid).doc(r._cloudId).delete();
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

  /* ================= AI generation ================= */
  function showAiError(msg) { els.aiError.textContent = msg; show(els.aiError); }
  function hideAiError() { hide(els.aiError); }

  async function callAi(mode) {
    hideAiError();
    if (mode === 'generate' && !els.fRequestSubject.value.trim()) { showAiError(t('errNeedSubject')); return; }
    if (mode !== 'generate' && !els.reqBody.innerText.trim()) { showAiError(t('errNeedText')); return; }
    if (!hasFb() || !firebase.functions) { showAiError(t('errGeneric')); return; }
    if (!currentUser) { openLogin(() => callAi(mode), true); return; }

    const btn = mode === 'generate' ? els.generateBtn : mode === 'rephrase' ? els.rephraseBtn : els.shortenBtn;
    btn.disabled = true;
    if (mode === 'generate') els.generateBtnText.textContent = t('generating');
    else btn.style.opacity = '.5';

    try {
      const payload = {
        mode, lang,
        firstName: els.fFirstName.value.trim(), lastName: els.fLastName.value.trim(),
        phone: els.fPhone.value.trim(), email: els.fEmail.value.trim(),
        addressedTo: els.fAddressedTo.value.trim(),
        requestSubject: els.fRequestSubject.value.trim(),
        extraFields: extraFields.filter((f) => (f.key || '').trim() || (f.val || '').trim()),
        currentText: els.reqBody.innerText.trim(),
      };
      const callable = firebase.functions().httpsCallable('generateAdminRequest');
      const result = await callable(payload);
      const data = result.data;
      if (!data || !data.text) throw new Error('no-text');
      setBody(data.text);
      bodyIsOwned = true;
      if (typeof data.usedToday === 'number') { dailyUsage.used = data.usedToday; updateUsageIndicator(); }
      saveDraft(); refreshLight();
      toast(t('t_generated'));
    } catch (e) {
      if (e && e.code === 'functions/resource-exhausted') showAiError(t('errLimit'));
      else showAiError(t('errGeneric'));
    } finally {
      btn.disabled = false;
      btn.style.opacity = '';
      if (mode === 'generate') els.generateBtnText.textContent = t('generateBtnText');
      syncAiButtons();
    }
  }
  els.generateBtn.addEventListener('click', () => callAi('generate'));
  els.rephraseBtn.addEventListener('click', () => callAi('rephrase'));
  els.shortenBtn.addEventListener('click', () => callAi('shorten'));
  function updateUsageIndicator() { els.usageIndicator.textContent = t('usageIndicator')(dailyUsage.used, dailyUsage.max); }

  /* ================= Print / PDF ================= */
  // A clean, unscaled copy of the sheet for printing and PDF capture (example values are left blank).
  function buildPrintCopy() {
    const root = $('printRoot');
    const clone = els.requestPage.cloneNode(true);
    clone.removeAttribute('id');
    clone.style.transform = '';
    $$('[id]', clone).forEach((n) => n.removeAttribute('id'));
    $$('.hl', clone).forEach((n) => n.classList.remove('hl'));
    $$('.req-remove-btn', clone).forEach((n) => n.remove());
    $$('.ph', clone).forEach((n) => { n.textContent = ''; });
    $$('[contenteditable]', clone).forEach((n) => { n.removeAttribute('contenteditable'); n.removeAttribute('data-placeholder'); });
    root.innerHTML = '';
    root.appendChild(clone);
    return clone;
  }
  els.printBtn.addEventListener('click', () => {
    buildPrintCopy();
    toast(t('t_print'));
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    fonts.then(() => setTimeout(() => window.print(), 250));
  });
  window.addEventListener('afterprint', () => { $('printRoot').innerHTML = ''; });

  els.downloadPdfBtn.addEventListener('click', async () => {
    if (typeof html2canvas === 'undefined' || !window.jspdf) { toast(t('t_pdf_err')); return; }
    els.downloadPdfBtn.disabled = true;
    toast(t('t_pdf'));
    try {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      const copy = buildPrintCopy();
      await new Promise((r) => setTimeout(r, 60));
      const canvas = await html2canvas(copy, {
        scale: 2.5, backgroundColor: '#ffffff', useCORS: true, logging: false,
        width: SHEET_W, height: copy.offsetHeight, windowWidth: SHEET_W, scrollX: 0, scrollY: 0,
      });
      const img = canvas.toDataURL('image/jpeg', 0.94);
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pw = pdf.internal.pageSize.getWidth(), ph = pdf.internal.pageSize.getHeight();
      const ih = (canvas.height * pw) / canvas.width;
      let left = ih, pos = 0;
      pdf.addImage(img, 'JPEG', 0, pos, pw, ih);
      left -= ph;
      while (left > 0.5) { pos = left - ih; pdf.addPage(); pdf.addImage(img, 'JPEG', 0, pos, pw, ih); left -= ph; }
      pdf.save('admin-request.pdf');
      toast(t('t_pdf_ok'));
    } catch (e) {
      console.error('[adminreq] PDF export failed:', e);
      toast(t('t_pdf_err'));
    } finally {
      $('printRoot').innerHTML = '';
      els.downloadPdfBtn.disabled = false;
    }
  });

  /* ================= Word (.doc, MHTML with embedded images) ================= */
  function buildWordFile() {
    const rtl = lang === 'ar';
    const dir = rtl ? 'rtl' : 'ltr';
    const start = rtl ? 'right' : 'left', end = rtl ? 'left' : 'right';
    const fam = (lang === 'ar' ? activeFont.ar : activeFont.en).split(',')[0].replace(/'/g, '');
    const font = `'${fam}', ${rtl ? "'Traditional Arabic', 'Simplified Arabic', Arial" : "'Times New Roman', Georgia, serif"}`;
    const d = DESIGN_BY_ID[designId] || DESIGNS[0];
    const ac = designId === 'classic' ? '#1E2F40' : d.color;
    const images = [];
    const pt = (n) => (Math.round(n * fontScale / 50) / 2) + 'pt'; // scaled, rounded to 0.5pt
    function imgPart(dataUrl, name) {
      const m = /^data:(image\/[\w+.-]+);base64,(.*)$/.exec(dataUrl || '');
      if (!m) return null;
      const loc = 'file:///C:/adminreq/' + name + '.' + (m[1].split('/')[1].replace('jpeg', 'jpg').replace('svg+xml', 'svg'));
      images.push({ type: m[1], data: m[2], loc });
      return loc;
    }
    const v = (el) => (el.classList.contains('ph') ? '' : el.textContent);
    const p = (html, style) => `<p class=MsoNormal dir=${dir} style="${style || ''}">${html}</p>`;
    const lbl = (s) => `<b style="color:${ac}">${escapeHtml(s)}</b>`;

    let body = '';
    const head = companyLogoDataUrl && imgPart(companyLogoDataUrl, 'header');
    if (head) body += `<p class=MsoNormal align=center style="text-align:center;margin-bottom:16pt"><img src="${head}" width=604 style="width:16cm"></p>`;
    const senderRows = [
      [t('labelName'), v(els.reqSenderFirst)], [t('labelLastName'), v(els.reqSenderLast)],
      [t('labelPhone'), v(els.reqSenderPhone)], [t('labelEmail'), v(els.reqSenderEmail)],
    ].concat(extraFields.filter((f) => (f.key || '').trim() || (f.val || '').trim()).map((f) => [f.key ? f.key + ': ' : '', f.val]));
    const sender = senderRows.map(([k, val]) => p(`${lbl(k)}${escapeHtml(val)}`, 'margin:0 0 3pt 0')).join('');
    body += `<table dir=${dir} width="100%" style="width:100%;border-collapse:collapse;margin-bottom:22pt"><tr>
      <td valign=top style="padding:0">${sender}</td>
      <td valign=top align=${end} style="padding:0;text-align:${end};white-space:nowrap">${p(`<b>${escapeHtml(els.reqDate.textContent)}</b>`, `text-align:${end}`)}</td></tr></table>`;
    body += `<table dir=${dir} width="100%" style="width:100%;border-collapse:collapse;margin-bottom:20pt"><tr><td width="46%" style="width:46%;padding:0"></td>
      <td style="padding:0">${p(`<b>${escapeHtml(v(els.reqAddressed)).replace(/\n/g, '<br>')}</b>`, `font-size:${pt(13)}`)}</td></tr></table>`;
    body += p(`${lbl(t('labelSubject'))}<b>${escapeHtml(v(els.reqSubjectValue))}</b>`, `text-align:center;font-size:${pt(13.5)};margin:0 0 18pt 0`);
    getBody().split('\n').forEach((line) => {
      body += p(line.trim() ? escapeHtml(line) : '&nbsp;', 'text-align:justify;line-height:180%;margin:0');
    });
    const att = attachments.filter((a) => (a || '').trim());
    if (att.length) {
      body += p(lbl(t('labelAttach')), 'margin:18pt 0 4pt 0');
      att.forEach((a, i) => { body += p(`${i + 1}. ${escapeHtml(a)}`, `margin:0 0 2pt 0;padding-${start}:14pt`); });
    }
    const stamp = stampDataUrl && imgPart(stampDataUrl, 'stamp');
    body += `<table dir=${dir} width="100%" style="width:100%;border-collapse:collapse;margin-top:24pt"><tr><td style="padding:0"></td>
      <td width=230 align=center style="width:6cm;padding:0;text-align:center">${p(`<b>${escapeHtml(t('signatureCaption'))}</b>`, 'text-align:center')}
      ${stamp ? `<p class=MsoNormal align=center style="text-align:center"><img src="${stamp}" width=160 style="width:4.2cm"></p>` : ''}</td></tr></table>`;

    const html = `<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta http-equiv=Content-Type content="text/html; charset=utf-8"><title>${escapeHtml(deriveTitle())}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>
@page WordSection1{size:21.0cm 29.7cm;margin:1.8cm 2.0cm 1.8cm 2.0cm;}
div.WordSection1{page:WordSection1;}
p.MsoNormal, li.MsoNormal{margin:0;font-family:${font};font-size:${pt(12)};color:#1E2F40;direction:${dir};text-align:${start};}
body{font-family:${font};font-size:${pt(12)};}
</style></head>
<body lang=${lang === 'ar' ? 'AR-DZ' : lang === 'fr' ? 'FR' : 'EN-GB'} dir=${dir}><div class=WordSection1 dir=${dir}>${body}</div></body></html>`;

    const boundary = '----=_NextPart_adminreq_' + Date.now().toString(36);
    const b64 = (s) => btoa(unescape(encodeURIComponent(s))).replace(/.{76}/g, '$&\r\n');
    let mhtml = `MIME-Version: 1.0\r\nContent-Type: multipart/related; boundary="${boundary}"; type="text/html"\r\n\r\n`;
    mhtml += `--${boundary}\r\nContent-Type: text/html; charset="utf-8"\r\nContent-Transfer-Encoding: base64\r\nContent-Location: file:///C:/adminreq/request.htm\r\n\r\n${b64(html)}\r\n`;
    images.forEach((im) => {
      mhtml += `--${boundary}\r\nContent-Type: ${im.type}\r\nContent-Transfer-Encoding: base64\r\nContent-Location: ${im.loc}\r\n\r\n${im.data.replace(/.{76}/g, '$&\r\n')}\r\n`;
    });
    mhtml += `--${boundary}--\r\n`;
    return mhtml;
  }
  els.wordBtn.addEventListener('click', () => {
    try {
      renderPreview();
      const blob = new Blob([buildWordFile()], { type: 'application/msword' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'admin-request.doc';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      toast(t('t_word'));
    } catch (e) {
      console.error('[adminreq] Word export failed:', e);
      toast(t('t_word_err'));
    }
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

    els.requestPage.setAttribute('dir', dict.dir);
    els.reqLabelName.textContent = dict.labelName;
    els.reqLabelLastName.textContent = dict.labelLastName;
    els.reqLabelPhone.textContent = dict.labelPhone;
    els.reqLabelEmail.textContent = dict.labelEmail;
    els.reqLabelSubject.textContent = dict.labelSubject;
    els.reqLabelAttach.textContent = dict.labelAttach;
    els.reqSignatureCaption.textContent = dict.signatureCaption;
    try { localStorage.setItem('adminreq:lang', lang); } catch (e) { /* ignore */ }

    updateAuthFormMode(authMode);
    renderExtraFields(); renderAttachments(); renderFontFilter(); renderTypeGrid(); renderToSuggest(); updateUsageIndicator();
    refresh();
    if (!$('mine').classList.contains('hidden')) renderMine();
    if (!$('gallery').classList.contains('hidden')) buildGallery();
  }
  $('langToggle').addEventListener('click', (e) => { e.stopPropagation(); $('langMenu').classList.toggle('hidden'); });
  els.langBtns.forEach((btn) => btn.addEventListener('click', () => {
    hide($('langMenu'));
    const old = lang;
    lang = btn.getAttribute('data-lang');
    translateUntouchedTemplate(old);
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
      applyState({ fDate: todayISO() });
    }
    applyLanguage();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { applyZoom(); renderThumbs(); });
  }
  init();
})();
