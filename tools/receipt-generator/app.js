// ============================================================
// app.js — Receipt Generator (وصل الاستلام / بيان الإرسال)
// Shell (topbar, right-hand panel, accordion, gallery, "My receipts",
// login, toasts) mirrors tools/admin-request.
// Saved receipts: on the device (localStorage) and, on "Save",
// in Firestore at users/{uid}/bordereaux/{id} (same path as before).
// ============================================================

(function () {
  "use strict";

  const I18N = window.RCPT_I18N;
  const TYPES = window.RCPT_TYPES;
  const DESIGNS = window.RCPT_DESIGNS;
  const FONTS = window.RCPT_FONTS;
  const EXAMPLES = window.RCPT_EXAMPLES;
  const EXAMPLE_ORG = window.RCPT_EXAMPLE_ORG;
  const CURRENCIES = window.RCPT_CURRENCIES;
  const amountWords = window.RCPT_AMOUNT_WORDS;
  const formatAmount = window.RCPT_FORMAT_AMOUNT;
  const parseAmount = window.RCPT_PARSE_AMOUNT;
  const TYPE_BY_ID = Object.fromEntries(TYPES.map((x) => [x.id, x]));
  const DESIGN_BY_ID = Object.fromEntries(DESIGNS.map((x) => [x.id, x]));

  let lang = localStorage.getItem('rcpt:lang') || localStorage.getItem('be_lang') || 'ar';
  if (!I18N[lang]) lang = 'ar';
  const t = (key) => I18N[lang][key];

  const $ = (id) => document.getElementById(id);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const show = (el) => el.classList.remove('hidden');
  const hide = (el) => el.classList.add('hidden');

  function escapeAttr(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
  function escapeHtml(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function todayISO() { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); }
  function newLocalId() { return 'L' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function mixHex(hex, other, w) {
    const a = parseInt(hex.slice(1), 16), b = parseInt(other.slice(1), 16);
    const ch = (x, s) => (x >> s) & 255;
    const m = (s) => Math.round(ch(a, s) * (1 - w) + ch(b, s) * w);
    return '#' + [16, 8, 0].map((s) => m(s).toString(16).padStart(2, '0')).join('');
  }

  /* ================= State ================= */
  const TEXT_FIELDS = ['issuerName', 'issuerContact', 'ref', 'date', 'place', 'giverName', 'giverRole', 'destinataire',
    'receiverName', 'receiverRole', 'ackText', 'objet', 'amount', 'currency', 'payMethod', 'notes'];
  function blankState() {
    return {
      tplId: 'combined', designId: 'classic', twoCopies: false,
      headerMode: 'simple', logoDataUrl: null, headerImgDataUrl: null, signDataUrl: null, receiverSignDataUrl: null,
      issuerName: '', issuerContact: '', ref: '', date: todayISO(), place: '',
      giverName: '', giverRole: '', destinataire: '', receiverName: '', receiverRole: '', ackText: '',
      objet: '', items: [], amount: '', currency: 'DZD', payMethod: '', notes: '',
      fontId: 1, fontScale: FS_DEFAULT,
    };
  }
  const FS_MIN = 80, FS_MAX = 150, FS_STEP = 5, FS_DEFAULT = 100;
  let R = blankState();
  let localId = null;
  let cloudId = null;

  // Old saves (users/{uid}/bordereaux and the "be_draft_*" drafts) used a flatter shape.
  const OLD_FONTS = { modern: 1, classic: 2, formal: 3, hand: 4 };
  function normalize(src) {
    const s = Object.assign({}, src || {});
    const out = blankState();
    if (!s.tplId && s.format) s.tplId = s.format === 'acknowledgment' ? 'ack' : s.format;
    if (!s.items && Array.isArray(s.documents)) s.items = s.documents.map((d) => ({ d: d.type || '', q: d.qty != null ? String(d.qty) : '', s: '', r: '' }));
    if (typeof s.fontId === 'string') s.fontId = OLD_FONTS[s.fontId] || 1;
    TEXT_FIELDS.forEach((k) => { if (s[k] != null) out[k] = String(s[k]); });
    out.tplId = TYPE_BY_ID[s.tplId] ? s.tplId : 'combined';
    out.designId = DESIGN_BY_ID[s.designId] ? s.designId : 'classic';
    out.twoCopies = !!s.twoCopies;
    out.headerMode = s.headerMode === 'image' ? 'image' : 'simple';
    ['logoDataUrl', 'headerImgDataUrl', 'signDataUrl', 'receiverSignDataUrl'].forEach((k) => { out[k] = s[k] || null; });
    out.items = Array.isArray(s.items) ? s.items.map((x) => ({ d: x.d || '', q: x.q != null ? String(x.q) : '', s: x.s || '', r: x.r || '' })) : [];
    out.fontId = FONTS.some((f) => f.id === s.fontId) ? s.fontId : 1;
    out.fontScale = clampScale(s.fontScale);
    if (!CURRENCIES[out.currency]) out.currency = 'DZD';
    if (!out.date) out.date = todayISO();
    return out;
  }

  /* ================= DOM refs ================= */
  const els = {
    htmlRoot: $('htmlRoot'), langBtns: $$('.lang-btn'), page: $('rcPage'), sheetHolder: $('sheetHolder'),
    typeGrid: $('typeGrid'), designStrip: $('designStrip'), fontFilter: $('fontFilter'), itemsList: $('itemsList'),
    saveBtn: $('saveBtn'), printBtn: $('printBtn'), wordBtn: $('wordBtn'), downloadPdfBtn: $('downloadPdfBtn'), clearAllBtn: $('clearAllBtn'),
    twoCopies: $('f_twoCopies'), currency: $('f_currency'), amountWords: $('amountWords'),
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

  /* ================= Receipt number (auto, editable) ================= */
  const CNT_KEY = 'rcpt:counter';
  function getCounter() { try { return JSON.parse(localStorage.getItem(CNT_KEY)) || {}; } catch (e) { return {}; } }
  function setCounter(c) { try { localStorage.setItem(CNT_KEY, JSON.stringify(c)); } catch (e) { /* ignore */ } }
  function nextRef() {
    const y = new Date().getFullYear();
    const c = getCounter();
    const n = (c[y] || 0) + 1;
    c[y] = n; setCounter(c);
    return `REC-${y}-${String(n).padStart(4, '0')}`;
  }
  // A number typed by hand moves the counter forward, so the next receipt follows it.
  function noteRef(ref) {
    const m = /(20\d\d)\D+(\d{1,6})\s*$/.exec(ref || '');
    if (!m) return;
    const y = +m[1], n = +m[2];
    const c = getCounter();
    if (n > (c[y] || 0)) { c[y] = n; setCounter(c); }
  }

  /* ================= Example receipt (shown in place of every empty field) ================= */
  function exampleFor(id, l) {
    l = l || lang;
    const x = (EXAMPLES[id] || EXAMPLES.combined)[l];
    return Object.assign({ amount: '', payMethod: '', notes: '', items: [] }, EXAMPLE_ORG[l], x);
  }

  // The values printed on the sheet: the user's value, or the example while the field is empty.
  function view(typeId, l) {
    l = l || lang;
    const e = exampleFor(typeId, l);
    const V = {};
    ['issuerName', 'issuerContact', 'place', 'giverName', 'giverRole', 'destinataire', 'receiverName', 'receiverRole', 'objet', 'ackText', 'payMethod', 'notes']
      .forEach((k) => { const v = (R[k] || '').trim(); V[k] = v || e[k] || ''; V[k + '_ph'] = !v; });
    const real = realItems();
    V.items = real.length ? real : e.items.map(([d, q, s, r]) => ({ d, q: String(q), s, r }));
    V.items_ph = !real.length;
    const amt = parseAmount(R.amount) != null ? R.amount : e.amount;
    V.amount = parseAmount(amt) != null ? amt : '';
    V.amount_ph = parseAmount(R.amount) == null;
    V.ref = (R.ref || '').trim();
    V.date = R.date;
    return V;
  }
  const realItems = () => R.items.filter((x) => [x.d, x.q, x.s, x.r].some((v) => String(v || '').trim()));

  /* ================= Fonts & size ================= */
  const activeFont = () => FONTS.find((f) => f.id === R.fontId) || FONTS[0];
  function renderFontFilter() {
    els.fontFilter.innerHTML = FONTS.map((f) => `
      <button type="button" class="font-btn ${f.id === R.fontId ? 'on' : ''}" data-id="${f.id}">
        <b style="font-family:${lang === 'ar' ? f.ar : f.en}">${lang === 'ar' ? 'وصل استلام' : lang === 'fr' ? 'Reçu' : 'Receipt'}</b>
        <small>${escapeHtml(f.name[lang])}</small>
      </button>`).join('');
  }
  els.fontFilter.addEventListener('click', (e) => {
    const b = e.target.closest('.font-btn'); if (!b) return;
    R.fontId = parseInt(b.dataset.id, 10) || 1;
    renderFontFilter(); refresh(); saveDraft();
  });
  // Single-document layouts have room for larger text than the two-part combined one.
  const LAYOUT_K = { combined: 1, bordereau: 1.25, ack: 1.25, receipt: 1.22 };
  function applyLook(el, designId, typeId) {
    const f = activeFont();
    const ty = TYPE_BY_ID[typeId || R.tplId] || TYPES[0];
    el.style.setProperty('--rq-font-ar', f.ar);
    el.style.setProperty('--rq-font-en', f.en);
    el.style.setProperty('--fs', String((R.fontScale / 100) * LAYOUT_K[ty.layout]));
    TYPES.forEach((x) => el.classList.remove('l-' + x.layout));
    el.classList.add('l-' + ty.layout);
    const d = DESIGN_BY_ID[designId || R.designId] || DESIGNS[0];
    DESIGNS.forEach((x) => el.classList.remove('d-' + x.id));
    el.classList.add('d-' + d.id);
    el.style.setProperty('--ac', d.color);
    el.style.setProperty('--ac-soft', mixHex(d.color, '#ffffff', 0.9)); // html2canvas cannot parse color-mix
    el.setAttribute('dir', I18N[lang].dir);
  }

  function clampScale(v) {
    v = Math.round((parseInt(v, 10) || FS_DEFAULT) / FS_STEP) * FS_STEP;
    return Math.max(FS_MIN, Math.min(FS_MAX, v));
  }
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

  /* ================= Sheet HTML ================= */
  function formatDate(iso, l) {
    if (!iso) return '';
    const d = new Date(iso + 'T12:00:00');
    if (isNaN(d)) return iso;
    const loc = { ar: 'ar-DZ', en: 'en-GB', fr: 'fr-FR' }[l || lang];
    try { return d.toLocaleDateString(loc, { year: 'numeric', month: 'long', day: 'numeric', numberingSystem: 'latn' }); }
    catch (e) { return d.toLocaleDateString(loc, { year: 'numeric', month: 'long', day: 'numeric' }); }
  }
  function placeDate(place, date) {
    if (!place) return date;
    if (lang === 'ar') return `${place} في ${date}`;
    if (lang === 'fr') return `${place}, le ${date}`;
    return `${place}, ${date}`;
  }
  const H = escapeHtml;
  const DOTS = '……………………';
  const SCISSORS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.1 15.9M14.5 14.5L20 20M8.1 8.1L12 12"/></svg>';

  function letterheadHtml(V, withNoBox) {
    const dateTxt = placeDate(V.place, formatDate(V.date));
    if (R.headerMode === 'image' && R.headerImgDataUrl) {
      return `<div class="rc-head-img" data-sec="org"><img src="${R.headerImgDataUrl}" alt=""></div>
        <div class="rc-meta" data-sec="org"><span>${H(t('l_no'))}<b class="ltr">${H(V.ref || DOTS)}</b></span><span>${H(dateTxt)}</span></div>`;
    }
    return `<div class="rc-head" data-sec="org">
        <div class="rc-org">${R.logoDataUrl ? `<img class="rc-logo" src="${R.logoDataUrl}" alt="">` : ''}
          <div><p class="rc-org-name">${H(V.issuerName)}</p><p class="rc-org-contact">${H(V.issuerContact)}</p></div></div>
        ${withNoBox ? `<div class="rc-nobox"><p>${H(t('l_no'))}<b class="ltr">${H(V.ref || DOTS)}</b></p><p>${H(dateTxt)}</p></div>` : ''}
      </div>`;
  }

  function itemsTableHtml(V) {
    if (!V.items.length) return '';
    const hasState = V.items.some((x) => (x.s || '').trim());
    const hasRef = V.items.some((x) => (x.r || '').trim());
    const qtys = V.items.map((x) => parseFloat(String(x.q).replace(',', '.')));
    const allNum = qtys.every((q) => isFinite(q));
    const total = allNum ? qtys.reduce((a, b) => a + b, 0) : null;
    const rows = V.items.map((x, i) => `<tr><td class="c num">${i + 1}</td><td>${H(x.d) || '—'}</td><td class="c num">${H(x.q) || '—'}</td>${hasState ? `<td class="c">${H(x.s) || '—'}</td>` : ''}${hasRef ? `<td class="c num">${H(x.r) || '—'}</td>` : ''}</tr>`).join('');
    const foot = V.items.length > 1 && total != null
      ? `<tfoot><tr><td></td><td>${H(t('th_total'))}</td><td class="c num">${Math.round(total * 100) / 100}</td>${hasState ? '<td></td>' : ''}${hasRef ? '<td></td>' : ''}</tr></tfoot>` : '';
    return `<table class="rc-table" data-sec="items"><thead><tr><th class="c" style="width:44px">${H(t('th_no'))}</th><th>${H(t('th_designation'))}</th><th class="c" style="width:70px">${H(t('th_qty'))}</th>${hasState ? `<th class="c" style="width:110px">${H(t('th_state'))}</th>` : ''}${hasRef ? `<th class="c" style="width:110px">${H(t('th_ref'))}</th>` : ''}</tr></thead><tbody>${rows}</tbody>${foot}</table>`;
  }

  function amountHtml(V) {
    if (!V.amount) return '';
    return `<div class="rc-amount" data-sec="amount">
        <div class="rc-amount-row"><span>${H(t('l_amount'))}<b class="rc-amount-val">${H(formatAmount(V.amount, R.currency, lang))}</b></span>${V.payMethod ? `<span>${H(t('l_pay'))}<b>${H(V.payMethod)}</b></span>` : ''}</div>
        <p>${H(t('l_amount_words'))}<span class="rc-amount-words">${H(amountWords(V.amount, R.currency, lang))}</span></p>
      </div>`;
  }
  const notesHtml = (V) => (V.notes ? `<p class="rc-notes" data-sec="notes"><b>${H(t('l_notes'))}</b>${H(V.notes)}</p>` : '');
  function signBox(img) { return `<div class="rc-sign-box">${img ? `<img src="${img}" alt="">` : ''}</div>`; }

  function bordereauHtml(V, ty) {
    return `${letterheadHtml(V, true)}
      <p class="rc-to" data-sec="receiver">${H(t('l_to'))}${H(V.destinataire)}</p>
      <div class="rc-title" data-sec="type"><h1>${H(ty.title[lang])}</h1></div>
      <p class="rc-line" data-sec="items"><b>${H(t('l_subject'))}</b>${H(V.objet)}</p>
      ${itemsTableHtml(V)}${amountHtml(V)}${notesHtml(V)}
      <div class="rc-signs one" data-sec="sign"><div class="rc-sign"><p class="rc-sign-h">${H(t('l_sign_sender'))}</p><p class="rc-sign-n" data-sec="giver">${H(V.giverName)}${V.giverRole ? ' — ' + H(V.giverRole) : ''}</p>${signBox(R.signDataUrl)}</div></div>`;
  }
  function ackHtml(V, inBox) {
    const ack = TYPE_BY_ID.ack;
    return `<div class="rc-title" data-sec="type"><h1>${H(ack.title[lang])}</h1></div>
      <p class="rc-ackref" data-sec="org">${H(t('l_related'))} <b class="ltr">${H(V.ref || DOTS)}</b> ${H(t('l_dated'))} <b>${H(formatDate(V.date))}</b></p>
      <p class="rc-ack" data-sec="receiver">${H(V.ackText)}</p>
      <div class="rc-fields" data-sec="receiver">
        <p>${H(t('l_name'))}<b>${H(V.receiverName)}</b></p>
        <p>${H(t('l_role'))}${H(V.receiverRole)}${inBox ? '' : ` · ${H(t('l_entity'))}${H(V.destinataire)}`}</p>
        <p>${H(t('l_received_on'))}${DOTS}</p>
      </div>
      <div class="rc-signs one ${inBox ? '' : 'center'}" data-sec="sign"><div class="rc-sign"><p class="rc-sign-h">${H(t('l_sign_ack'))}</p>${signBox(R.receiverSignDataUrl)}</div></div>`;
  }
  function receiptHtml(V, ty) {
    return `${letterheadHtml(V, true)}
      <div class="rc-title" data-sec="type"><h1>${H(ty.title[lang])}</h1></div>
      <div class="rc-parties">
        <div class="rc-party" data-sec="giver"><p class="rc-party-h">${H(t('l_giver'))}</p><p class="rc-party-n">${H(V.giverName)}</p><p class="rc-party-r">${H(V.giverRole)}</p></div>
        <div class="rc-party" data-sec="receiver"><p class="rc-party-h">${H(t('l_receiver'))}</p><p class="rc-party-n">${H(V.receiverName)}</p><p class="rc-party-r">${H(V.receiverRole)}${V.destinataire ? ' · ' + H(V.destinataire) : ''}</p></div>
      </div>
      <p class="rc-line" data-sec="items"><b>${H(t('l_subject'))}</b>${H(V.objet)}</p>
      ${itemsTableHtml(V)}${amountHtml(V)}
      <p class="rc-ack" data-sec="receiver">${H(V.ackText)}</p>
      ${notesHtml(V)}
      <div class="rc-signs" data-sec="sign">
        <div class="rc-sign"><p class="rc-sign-h">${H(t('l_sign_giver'))}</p><p class="rc-sign-n">${H(V.giverName)}</p>${signBox(R.signDataUrl)}</div>
        <div class="rc-sign"><p class="rc-sign-h">${H(t('l_sign_receiver'))}</p><p class="rc-sign-n">${H(V.receiverName)}</p>${signBox(R.receiverSignDataUrl)}</div>
      </div>`;
  }
  function contentHtml(typeId) {
    const ty = TYPE_BY_ID[typeId] || TYPES[0];
    const V = view(ty.id);
    if (ty.layout === 'bordereau') return bordereauHtml(V, ty);
    if (ty.layout === 'ack') return `${letterheadHtml(V, false)}${ackHtml(V, false)}`;
    if (ty.layout === 'combined') return `${bordereauHtml(V, ty)}<div class="rc-scissor">${SCISSORS}</div><div class="rc-ackbox">${ackHtml(V, true)}</div>`;
    return receiptHtml(V, ty);
  }
  function sheetHtml(typeId) {
    const inner = contentHtml(typeId);
    if (!R.twoCopies) return `<div class="rc-copy-inner single">${inner}</div>`;
    return `<div class="rc-copy"><div class="rc-copy-inner"><span class="rc-copy-tag">${H(t('copy_original'))}</span>${inner}</div></div>
      <div class="rc-cut"><span>${SCISSORS}${H(t('cut_here'))}</span></div>
      <div class="rc-copy"><div class="rc-copy-inner"><span class="rc-copy-tag">${H(t('copy_copy'))}</span>${inner}</div></div>`;
  }
  // Two copies: each half page holds a full receipt, scaled down uniformly to fit.
  const COPY_H = 549;
  function fitCopies(page) {
    $$('.rc-copy > .rc-copy-inner', page).forEach((inner) => {
      inner.style.transform = ''; inner.style.minHeight = '0';
      let s = 1;
      for (let i = 0; i < 4; i++) {
        inner.style.width = (794 / s) + 'px';
        const ns = Math.min(1, COPY_H / inner.scrollHeight); // narrower text wraps less as it shrinks: refine
        if (Math.abs(ns - s) < 0.003) { s = Math.min(s, ns); break; }
        s = ns;
      }
      inner.style.width = (794 / s) + 'px';
      if (inner.scrollHeight * s > COPY_H) s = COPY_H / inner.scrollHeight;
      inner.style.width = (794 / s) + 'px';
      inner.style.minHeight = (COPY_H / s) + 'px';
      inner.style.transform = s < 1 ? `scale(${s})` : '';
    });
  }
  function renderPage(el, typeId, designId) {
    applyLook(el, designId, typeId);
    el.classList.toggle('two', !!R.twoCopies);
    el.innerHTML = sheetHtml(typeId);
    fitCopies(el);
  }

  /* ================= Preview ================= */
  function renderPreview() {
    renderPage(els.page, R.tplId);
    syncExamplePlaceholders();
    syncAmountWords();
  }
  // The panel's empty fields show the same example, in light grey.
  function syncExamplePlaceholders() {
    const e = exampleFor(R.tplId);
    ['issuerName', 'issuerContact', 'place', 'giverName', 'giverRole', 'destinataire', 'receiverName', 'receiverRole', 'objet', 'ackText', 'payMethod', 'notes']
      .forEach((k) => { const el = $('f_' + k); if (el) el.placeholder = e[k] || (k === 'notes' ? t('notesPh') : ''); });
    $('f_amount').placeholder = e.amount ? formatAmount(e.amount, R.currency, lang) : '0,00';
    $('f_ref').placeholder = 'REC-' + new Date().getFullYear() + '-0001';
    $$('.item-card', els.itemsList).forEach((card, i) => {
      const x = e.items[i] || e.items[0] || ['', '', '', ''];
      card.querySelector('.it-d').placeholder = x[0] || t('itemDesignation');
      card.querySelector('.it-q').placeholder = x[1] != null && x[1] !== '' ? String(x[1]) : t('itemQty');
      card.querySelector('.it-s').placeholder = x[2] || t('itemState');
      card.querySelector('.it-r').placeholder = x[3] || t('itemRef');
    });
  }
  function syncAmountWords() {
    const own = parseAmount(R.amount) != null;
    const e = exampleFor(R.tplId);
    const v = own ? R.amount : e.amount;
    const w = v ? amountWords(v, R.currency, lang) : '';
    els.amountWords.textContent = w || '—';
    els.amountWords.classList.toggle('ph', !own);
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

  /* ================= Form <-> state ================= */
  function fillForm() {
    $$('[data-f]').forEach((el) => { el.value = R[el.dataset.f] == null ? '' : R[el.dataset.f]; });
    els.twoCopies.checked = !!R.twoCopies;
    setHeaderModeUi();
    syncUploadPreviews(); renderItems(); renderFontFilter(); renderTypeGrid(); applyFontScaleUi();
  }
  document.addEventListener('input', (e) => {
    const el = e.target.closest('[data-f]'); if (!el) return;
    R[el.dataset.f] = el.value;
    refresh(); saveDraft();
  });
  $('f_currency').addEventListener('change', () => { R.currency = els.currency.value; refresh(); saveDraft(); });
  $('f_ref').addEventListener('change', () => noteRef(R.ref));
  $('newRefBtn').addEventListener('click', () => {
    R.ref = nextRef(); $('f_ref').value = R.ref;
    refresh(); saveDraft(); toast(t('t_new_ref'));
  });
  els.twoCopies.addEventListener('change', () => { R.twoCopies = els.twoCopies.checked; refresh(); saveDraft(); });

  function renderCurrencyOptions() {
    els.currency.innerHTML = Object.keys(CURRENCIES).map((c) => `<option value="${c}">${escapeHtml(t('cur_' + c))}</option>`).join('');
    els.currency.value = R.currency;
    $('payList').innerHTML = t('paySuggestions').map((s) => `<option value="${escapeAttr(s)}">`).join('');
    $('stateList').innerHTML = t('stateSuggestions').map((s) => `<option value="${escapeAttr(s)}">`).join('');
  }

  /* ================= Header mode ================= */
  function setHeaderModeUi() {
    $$('#headerModeSeg button').forEach((b) => b.classList.toggle('on', b.dataset.mode === R.headerMode));
    $('headerSimpleFields').classList.toggle('hidden', R.headerMode !== 'simple');
    $('headerImageField').classList.toggle('hidden', R.headerMode !== 'image');
  }
  $('headerModeSeg').addEventListener('click', (e) => {
    const b = e.target.closest('[data-mode]'); if (!b) return;
    R.headerMode = b.dataset.mode; setHeaderModeUi(); refresh(); saveDraft();
  });

  /* ================= Items table ================= */
  const IC_X = '<svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>';
  function renderItems() {
    els.itemsList.innerHTML = R.items.map((x, i) => `
      <div class="item-card" data-i="${i}">
        <span class="n">${i + 1}</span>
        <input type="text" class="it-d" data-k="d" value="${escapeAttr(x.d)}" aria-label="${escapeAttr(t('itemDesignation'))}">
        <button type="button" class="dyn-remove" aria-label="${escapeAttr(t('remove'))}">${IC_X}</button>
        <input type="text" class="it-q" data-k="q" inputmode="decimal" value="${escapeAttr(x.q)}" aria-label="${escapeAttr(t('itemQty'))}">
        <input type="text" class="it-s" data-k="s" list="stateList" value="${escapeAttr(x.s)}" aria-label="${escapeAttr(t('itemState'))}">
        <input type="text" class="it-r ltr-input" data-k="r" value="${escapeAttr(x.r)}" aria-label="${escapeAttr(t('itemRef'))}">
      </div>`).join('');
    syncExamplePlaceholders();
  }
  els.itemsList.addEventListener('input', (e) => {
    const card = e.target.closest('.item-card'); const k = e.target.dataset.k;
    if (!card || !k) return;
    e.stopPropagation();
    R.items[+card.dataset.i][k] = e.target.value;
    refresh(); saveDraft();
  });
  els.itemsList.addEventListener('click', (e) => {
    const b = e.target.closest('.dyn-remove'); if (!b) return;
    R.items.splice(+b.closest('.item-card').dataset.i, 1);
    renderItems(); refresh(); saveDraft();
  });
  $('addItemBtn').addEventListener('click', () => {
    R.items.push({ d: '', q: '1', s: '', r: '' });
    renderItems(); refresh(); saveDraft();
    const rows = $$('.it-d', els.itemsList); if (rows.length) rows[rows.length - 1].focus();
  });

  /* ================= Uploads (logo, letterhead image, stamps) ================= */
  const UPLOADS = { logo: ['logoDataUrl', 360], headerImg: ['headerImgDataUrl', 1200], sign: ['signDataUrl', 420], rsign: ['receiverSignDataUrl', 420] };
  // keeps Firestore documents well under 1 MB
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
          const png = /png|gif|webp/.test(file.type);
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

  /* ================= Receipt types & designs ================= */
  function renderTypeGrid() {
    els.typeGrid.innerHTML = TYPES.map((x) => `
      <button type="button" class="type-card ${x.id === R.tplId ? 'on' : ''}" data-type="${x.id}" style="--c:${x.color}">
        <span class="t-ico"><svg viewBox="0 0 24 24">${x.icon}</svg></span><span>${escapeHtml(x.name[lang])}</span>
      </button>`).join('');
  }
  els.typeGrid.addEventListener('click', (e) => { const b = e.target.closest('[data-type]'); if (b) applyType(b.dataset.type); });
  function applyType(id, fromGallery) {
    if (!TYPE_BY_ID[id]) return;
    R.tplId = id;
    renderTypeGrid();
    if (fromGallery) closeGallery();
    refresh(); saveDraft();
    toast(t('t_tpl'));
  }
  function setDesign(id, fromGallery) {
    if (!DESIGN_BY_ID[id]) return;
    R.designId = id;
    if (fromGallery) closeGallery();
    refresh(); saveDraft();
    toast(t('t_design'));
  }
  els.designStrip.addEventListener('click', (e) => { const b = e.target.closest('[data-design]'); if (b) setDesign(b.dataset.design); });

  /* ================= Mini sheets (thumbnails) ================= */
  function mountMini(box, opts) {
    box.innerHTML = '';
    const w = box.clientWidth; if (!w) return;
    const m = document.createElement('div');
    m.className = 'rc-page mini';
    box.appendChild(m);
    if (opts && opts.type) renderPage(m, opts.type);
    else if (opts && opts.design) renderPage(m, R.tplId, opts.design);
    else renderPage(m, R.tplId);
    m.style.transform = `scale(${w / 794})`;
  }
  function renderThumbs() {
    mountMini($('currentThumb'), null);
    const tn = TYPE_BY_ID[R.tplId], dn = DESIGN_BY_ID[R.designId];
    $('currentTplName').textContent = `${tn ? tn.name[lang] : ''} · ${dn ? dn.name[lang] : ''}`;
    if (openSec === 'type') renderDesignStrip();
  }
  function renderDesignStrip() {
    els.designStrip.innerHTML = DESIGNS.map((d) => `
      <button type="button" class="tpl-chip ${d.id === R.designId ? 'on' : ''}" data-design="${d.id}">
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
        <button type="button" class="g-card ${x.id === R.tplId ? 'on' : ''}" data-type="${x.id}">
          <div class="g-thumb"></div>
          <div class="g-meta"><span class="g-ico" style="--c:${x.color}"><svg viewBox="0 0 24 24">${x.icon}</svg></span><b>${escapeHtml(x.name[lang])}</b></div>
        </button>`).join('');
    } else {
      cards = DESIGNS.filter((d) => match(d.name)).map((d) => `
        <button type="button" class="g-card ${d.id === R.designId ? 'on' : ''}" data-design="${d.id}">
          <div class="g-thumb"></div>
          <div class="g-meta"><span class="g-ico" style="--c:${d.color}"><svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/></svg></span><b>${escapeHtml(d.name[lang])}</b></div>
        </button>`).join('');
    }
    $('gGrid').innerHTML = cards || `<div class="g-empty">${t('g_empty')}</div>`;
    $$('.g-card', $('gGrid')).forEach((c) => {
      const box = c.querySelector('.g-thumb');
      if (c.dataset.type) mountMini(box, { type: c.dataset.type });
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
    els.page.style.transform = `scale(${s})`;
    els.sheetHolder.style.width = (SHEET_W * s) + 'px';
    els.sheetHolder.style.height = (els.page.offsetHeight * s) + 'px';
    $('zoomVal').textContent = Math.round(s * 100) + '%';
    const over = els.page.offsetHeight > SHEET_H + 2; // taller than one A4 page
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
  // clicking a part of the receipt opens its section
  els.page.addEventListener('click', (e) => {
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
    $('accordion').classList.toggle('has-open', !!openSec);
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
    const tn = TYPE_BY_ID[R.tplId], dn = DESIGN_BY_ID[R.designId];
    set('type', [tn ? tn.name[lang] : '', dn ? dn.name[lang] : '', R.twoCopies ? t('two_copies') : ''].filter(Boolean).join(' · '));
    set('org', cut([R.issuerName.trim(), R.ref.trim()].filter(Boolean).join(' · ')) || t('d_org'));
    set('giver', cut([R.giverName, R.giverRole].map((s) => s.trim()).filter(Boolean).join(' · ')) || t('d_giver'));
    set('receiver', cut([R.receiverName, R.destinataire].map((s) => s.trim()).filter(Boolean).join(' · ')) || t('d_receiver'));
    const n = realItems().length;
    set('items', cut([R.objet.trim(), n ? t('n_items')(n) : ''].filter(Boolean).join(' · ')) || t('d_items'));
    set('amount', parseAmount(R.amount) != null ? formatAmount(R.amount, R.currency, lang) : t('d_amount'));
    set('notes', cut(R.notes) || t('d_notes'));
    set('sign', [R.signDataUrl || R.receiverSignDataUrl ? t('with_stamp') : t('no_stamp')].join(' · '));
    set('style', [activeFont().name[lang], R.fontScale !== FS_DEFAULT ? t('size_lbl')(R.fontScale) : ''].filter(Boolean).join(' · '));
  }

  /* ================= Persistence (device) ================= */
  const STORAGE_KEY = 'rcpt:draft';
  const HISTORY_KEY = 'rcpt:history';
  const MAX_HISTORY = 30;
  let draftTimer = null;

  function collectFullState() { return Object.assign(JSON.parse(JSON.stringify(R)), { lang }); }
  function hasContent(s) {
    return ['issuerName', 'giverName', 'receiverName', 'destinataire', 'objet', 'notes', 'amount', 'ackText'].some((k) => (s[k] || '').trim())
      || (s.items || []).some((x) => (x.d || '').trim());
  }
  function getHistory() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch (e) { return []; } }
  function setHistory(h) { try { localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); return true; } catch (e) { return false; } }
  // Writes the draft and keeps the receipt in the on-device "My receipts" list.
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
      h.forEach((x, i) => { if (i > 0) { x.logoDataUrl = null; x.headerImgDataUrl = null; x.signDataUrl = null; x.receiverSignDataUrl = null; } });
      ok = setHistory(h) && ok;
    }
    return ok;
  }
  function saveDraft() { clearTimeout(draftTimer); draftTimer = setTimeout(commitLocal, 500); }
  window.addEventListener('pagehide', () => { clearTimeout(draftTimer); commitLocal(); });
  function loadDraft() {
    try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch (e) { /* ignore */ }
    // first visit after the redesign: pick up the old tool's unsaved draft
    try { const old = localStorage.getItem('be_draft_new'); if (old) return Object.assign(JSON.parse(old), { _old: true }); } catch (e) { /* ignore */ }
    return null;
  }

  function applyState(state) {
    R = normalize(state);
    fillForm();
  }
  function deriveTitle() {
    const ty = TYPE_BY_ID[R.tplId];
    const what = R.objet.trim() || R.destinataire.trim() || R.receiverName.trim() || (ty ? ty.name[lang] : t('untitled'));
    return [R.ref.trim(), what].filter(Boolean).join(' — ').slice(0, 80);
  }
  function startNew() {
    applyState({ tplId: R.tplId, designId: R.designId, fontId: R.fontId, fontScale: R.fontScale, currency: R.currency });
    R.ref = nextRef(); $('f_ref').value = R.ref;
    localId = null; cloudId = null;
  }

  els.clearAllBtn.addEventListener('click', async () => {
    if (!(await askConfirm(t('confirmClear')))) return;
    const keepRef = R.ref;
    applyState({ tplId: R.tplId, designId: R.designId, ref: keepRef });
    localId = null; cloudId = null;
    refresh(); commitLocal();
    toast(t('t_cleared'));
  });

  /* ================= Account (Firebase): users/{uid}/bordereaux ================= */
  const hasFb = () => typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length && firebase.auth && firebase.firestore;
  let currentUser = null;
  const receiptsCol = (uid) => firebase.firestore().collection('users').doc(uid).collection('bordereaux');
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
      const col = receiptsCol(currentUser.uid);
      if (cloudId) {
        await col.doc(cloudId).set(payload, { merge: true });
      } else {
        const ref = await col.add(Object.assign({ createdAt: firebase.firestore.FieldValue.serverTimestamp() }, payload));
        cloudId = ref.id;
      }
      commitLocal();
      toast(t('t_saved_cloud'));
    } catch (e) {
      console.error('[receipt] save to account failed:', e);
      toast(t('t_cloud_err'));
    }
    els.saveBtn.disabled = false;
  }
  els.saveBtn.addEventListener('click', saveToAccount);

  /* ================= My receipts ================= */
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
      const snap = await receiptsCol(currentUser.uid).get();
      return snap.docs.map((d) => {
        const data = d.data();
        return Object.assign({}, data, { _source: 'cloud', _cloudId: d.id, _ts: data.updatedAt && data.updatedAt.toMillis ? data.updatedAt.toMillis() : 0 });
      });
    } catch (e) {
      console.error('[receipt] loading saved receipts failed:', e);
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
        const isCurrent = (r._source === 'local' && r.localId && r.localId === localId) || (r._source === 'cloud' && r._cloudId === cloudId);
        const ty = TYPE_BY_ID[n.tplId];
        const title = r.title || [n.ref, n.objet || n.destinataire].filter(Boolean).join(' — ') || t('untitled');
        const sub = n.receiverName || n.destinataire || ty.name[lang];
        const amt = parseAmount(n.amount) != null ? `<span class="m-amount">${escapeHtml(formatAmount(n.amount, n.currency, lang))}</span>` : '';
        return `<div class="g-card m-card" data-idx="${idx}">
          ${isCurrent ? `<span class="m-tag">${t('current')}</span>` : ''}
          <div class="m-top">
            <span class="m-ico" style="--c:${ty.color}"><svg viewBox="0 0 24 24">${ty.icon}</svg></span>
            <div class="m-info"><b>${escapeHtml(title)}</b><small>${escapeHtml(sub)}</small></div>
          </div>
          <div class="m-row"><span class="m-date">${fmt(r._ts)}</span>${amt}<span class="m-src ${r._source === 'cloud' ? 'cloud' : ''}">${r._source === 'cloud' ? t('src_cloud') : t('src_local')}</span></div>
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
    noteRef(R.ref);
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
      startNew(); toggleSec(null);
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
        const copy = Object.assign({}, normalize(r), { lang: r.lang || lang, ref: nextRef(), localId: newLocalId(), cloudId: null, archivedAt: new Date().toISOString() });
        copy.title = [copy.ref, copy.objet || copy.destinataire].filter(Boolean).join(' — ');
        h.unshift(copy); setHistory(h);
        toast(t('t_dup')); loadMine();
      } else if (action === 'delete') {
        if (!(await askConfirm(t('confirmDelete')))) return;
        if (r._source === 'cloud') {
          await receiptsCol(currentUser.uid).doc(r._cloudId).delete();
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

  /* ================= Print / PDF ================= */
  // A clean, unscaled copy of the sheet for printing and PDF capture (what the preview shows).
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
  function fileBase() { return (R.ref || 'receipt').replace(/[^\w.-]+/g, '_'); }
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
      pdf.save(fileBase() + '.pdf');
      toast(t('t_pdf_ok'));
    } catch (e) {
      console.error('[receipt] PDF export failed:', e);
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
    const end = rtl ? 'left' : 'right';
    const f = activeFont();
    const fam = (lang === 'ar' ? f.ar : f.en).split(',')[0].replace(/'/g, '');
    const font = `'${fam}', ${rtl ? "'Traditional Arabic', 'Simplified Arabic', Arial" : "'Times New Roman', Georgia, serif"}`;
    const d = DESIGN_BY_ID[R.designId] || DESIGNS[0];
    const ac = d.color, acSoft = mixHex(d.color, '#ffffff', 0.88);
    const ty = TYPE_BY_ID[R.tplId];
    const V = view(R.tplId);
    const two = R.twoCopies;
    const k = two ? 0.72 : 1; // two copies on one page: smaller text
    const pt = (n) => (Math.round(n * k * R.fontScale / 50) / 2) + 'pt';
    const images = [];
    const imgCache = {};
    function imgPart(dataUrl, name) {
      if (imgCache[name]) return imgCache[name];
      const m = /^data:(image\/[\w+.-]+);base64,(.*)$/.exec(dataUrl || '');
      if (!m) return null;
      const loc = 'file:///C:/receipt/' + name + '.' + (m[1].split('/')[1].replace('jpeg', 'jpg').replace('svg+xml', 'svg'));
      images.push({ type: m[1], data: m[2], loc });
      return (imgCache[name] = loc);
    }
    const p = (html, style) => `<p class=MsoNormal dir=${dir} style="${style || ''}">${html}</p>`;
    const b = (s, color) => `<b${color ? ` style="color:${ac}"` : ''}>${H(s)}</b>`;
    const dateTxt = placeDate(V.place, formatDate(V.date));
    const cell = 'border:solid #AEB9C4 1.0pt;padding:3pt 6pt';

    function letterhead(noBox) {
      if (R.headerMode === 'image' && R.headerImgDataUrl) {
        const src = imgPart(R.headerImgDataUrl, 'header');
        return `<p class=MsoNormal align=center style="text-align:center"><img src="${src}" width=604 style="width:16cm"></p>
          <table dir=${dir} width="100%" style="width:100%;border-collapse:collapse;border-bottom:solid ${ac} 1.5pt;margin-bottom:10pt"><tr><td style="padding:0 0 4pt">${p(`${H(t('l_no'))}<b>${H(V.ref || DOTS)}</b>`)}</td><td align=${end} style="padding:0 0 4pt;text-align:${end}">${p(H(dateTxt), `text-align:${end}`)}</td></tr></table>`;
      }
      const logo = R.logoDataUrl ? `<img src="${imgPart(R.logoDataUrl, 'logo')}" width=64 style="width:1.7cm">` : '';
      const box = noBox ? '' : `<td width=200 valign=top style="width:5.3cm;border:solid ${ac} 1.0pt;padding:4pt 8pt">${p(`${H(t('l_no'))}<b>${H(V.ref || DOTS)}</b>`)}${p(H(dateTxt))}</td>`;
      return `<table dir=${dir} width="100%" style="width:100%;border-collapse:collapse;border-bottom:solid ${ac} 1.5pt;margin-bottom:12pt"><tr>
        ${logo ? `<td width=70 valign=middle style="width:1.9cm;padding:0 0 6pt">${logo}</td>` : ''}
        <td valign=middle style="padding:0 6pt 6pt">${p(b(V.issuerName), `font-size:${pt(15)}`)}${p(H(V.issuerContact), `font-size:${pt(10)};color:#55606E`)}</td>${box}</tr></table>`;
    }
    const title = (s, size) => p(`<b style="color:${ac}">${H(s)}</b>`, `text-align:center;font-size:${pt(size || 20)};margin:6pt 0 10pt 0`);
    function table() {
      if (!V.items.length) return '';
      const hasState = V.items.some((x) => (x.s || '').trim()), hasRef = V.items.some((x) => (x.r || '').trim());
      const th = (s, w) => `<td ${w ? `width=${w}` : ''} style="${cell};background:${acSoft}">${p(b(s), 'text-align:center')}</td>`;
      const td = (s, c) => `<td style="${cell}">${p(H(s) || '—', c ? 'text-align:center' : '')}</td>`;
      return `<table dir=${dir} width="100%" style="width:100%;border-collapse:collapse;margin:4pt 0 10pt"><tr>${th(t('th_no'), 40)}${th(t('th_designation'))}${th(t('th_qty'), 60)}${hasState ? th(t('th_state'), 100) : ''}${hasRef ? th(t('th_ref'), 100) : ''}</tr>
        ${V.items.map((x, i) => `<tr>${td(String(i + 1), 1)}${td(x.d)}${td(x.q, 1)}${hasState ? td(x.s, 1) : ''}${hasRef ? td(x.r, 1) : ''}</tr>`).join('')}</table>`;
    }
    function amount() {
      if (!V.amount) return '';
      return `<table dir=${dir} width="100%" style="width:100%;border-collapse:collapse;margin-bottom:10pt"><tr><td style="border:solid ${ac} 1.0pt;padding:5pt 8pt">
        ${p(`${H(t('l_amount'))}<b>${H(formatAmount(V.amount, R.currency, lang))}</b>${V.payMethod ? ` &nbsp; · &nbsp; ${H(t('l_pay'))}<b>${H(V.payMethod)}</b>` : ''}`)}
        ${p(`${H(t('l_amount_words'))}<b>${H(amountWords(V.amount, R.currency, lang))}</b>`)}</td></tr></table>`;
    }
    const notes = () => (V.notes ? p(`${b(t('l_notes'))}${H(V.notes)}`, 'margin-bottom:8pt') : '');
    function signCell(head, name, img, nm) {
      const src = img && imgPart(img, nm);
      return `<td valign=top align=center style="padding:0 6pt;text-align:center">${p(b(head), 'text-align:center')}${name ? p(H(name), 'text-align:center;color:#55606E') : ''}
        ${src ? `<p class=MsoNormal align=center style="text-align:center"><img src="${src}" width=150 style="width:4cm"></p>` : p('&nbsp;') + p('&nbsp;') + p('&nbsp;')}</td>`;
    }
    const signs = (cells, single) => `<table dir=${dir} width="100%" style="width:100%;border-collapse:collapse;margin-top:14pt"><tr>${single ? '<td width="50%"></td>' : ''}${cells}</tr></table>`;
    function bordereau() {
      return letterhead() + `<table dir=${dir} width="100%" style="width:100%;border-collapse:collapse;margin-bottom:8pt"><tr><td width="44%"></td><td>${p(`<b>${H(t('l_to'))}${H(V.destinataire)}</b>`)}</td></tr></table>`
        + title(ty.title[lang]) + p(`${b(t('l_subject'))}${H(V.objet)}`, 'margin-bottom:6pt') + table() + amount() + notes()
        + signs(signCell(t('l_sign_sender'), [V.giverName, V.giverRole].filter(Boolean).join(' — '), R.signDataUrl, 'sign'), true);
    }
    function ack(inBox) {
      return title(TYPE_BY_ID.ack.title[lang], inBox ? 16 : 20)
        + p(`${H(t('l_related'))} <b>${H(V.ref || DOTS)}</b> ${H(t('l_dated'))} <b>${H(formatDate(V.date))}</b>`, 'text-align:center;margin-bottom:8pt')
        + p(H(V.ackText), 'text-align:justify;line-height:160%;margin-bottom:8pt')
        + p(`${H(t('l_name'))}<b>${H(V.receiverName)}</b>`) + p(`${H(t('l_role'))}${H(V.receiverRole)}`) + p(`${H(t('l_received_on'))}${DOTS}`)
        + signs(signCell(t('l_sign_ack'), '', R.receiverSignDataUrl, 'rsign'), true);
    }
    function receipt() {
      const party = (h, n, r) => `<td valign=top style="border:solid #C9D2DA 1.0pt;padding:5pt 8pt">${p(b(h, 1), `font-size:${pt(10)}`)}${p(b(n), `font-size:${pt(13)}`)}${p(H(r), 'color:#55606E')}</td>`;
      return letterhead() + title(ty.title[lang])
        + `<table dir=${dir} width="100%" style="width:100%;border-collapse:collapse;margin-bottom:10pt"><tr>${party(t('l_giver'), V.giverName, V.giverRole)}<td width=14></td>${party(t('l_receiver'), V.receiverName, [V.receiverRole, V.destinataire].filter(Boolean).join(' · '))}</tr></table>`
        + p(`${b(t('l_subject'))}${H(V.objet)}`, 'margin-bottom:6pt') + table() + amount()
        + p(H(V.ackText), 'text-align:justify;line-height:160%;margin-bottom:8pt') + notes()
        + signs(signCell(t('l_sign_giver'), V.giverName, R.signDataUrl, 'sign') + signCell(t('l_sign_receiver'), V.receiverName, R.receiverSignDataUrl, 'rsign'));
    }
    let one;
    if (ty.layout === 'bordereau') one = bordereau();
    else if (ty.layout === 'ack') one = letterhead(true) + ack(false);
    else if (ty.layout === 'combined') one = bordereau() + p('&#9986; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -', 'text-align:center;color:#8C99A6;margin:8pt 0')
      + `<table dir=${dir} width="100%" style="width:100%;border-collapse:collapse"><tr><td style="border:solid ${ac} 1.0pt;padding:6pt 10pt">${ack(true)}</td></tr></table>`;
    else one = receipt();
    let body = one;
    if (two) {
      const tag = (s) => p(`<b style="color:${ac}">[ ${H(s)} ]</b>`, `text-align:${end};font-size:${pt(9)}`);
      body = tag(t('copy_original')) + one
        + p(`&#9986; - - - - - - - - - - - - ${H(t('cut_here'))} - - - - - - - - - - - - - - - - - - - - -`, 'text-align:center;color:#8C99A6;margin:10pt 0')
        + tag(t('copy_copy')) + one;
    }

    const html = `<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta http-equiv=Content-Type content="text/html; charset=utf-8"><title>${H(deriveTitle())}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>
@page WordSection1{size:21.0cm 29.7cm;margin:${two ? '1.0cm 1.6cm 1.0cm 1.6cm' : '1.6cm 1.8cm 1.6cm 1.8cm'};}
div.WordSection1{page:WordSection1;}
p.MsoNormal, li.MsoNormal{margin:0;font-family:${font};font-size:${pt(11.5)};color:#1E2F40;direction:${dir};text-align:${rtl ? 'right' : 'left'};}
body{font-family:${font};font-size:${pt(11.5)};}
</style></head>
<body lang=${lang === 'ar' ? 'AR-DZ' : lang === 'fr' ? 'FR' : 'EN-GB'} dir=${dir}><div class=WordSection1 dir=${dir}>${body}</div></body></html>`;

    const boundary = '----=_NextPart_receipt_' + Date.now().toString(36);
    const b64 = (s) => btoa(unescape(encodeURIComponent(s))).replace(/.{76}/g, '$&\r\n');
    let mhtml = `MIME-Version: 1.0\r\nContent-Type: multipart/related; boundary="${boundary}"; type="text/html"\r\n\r\n`;
    mhtml += `--${boundary}\r\nContent-Type: text/html; charset="utf-8"\r\nContent-Transfer-Encoding: base64\r\nContent-Location: file:///C:/receipt/receipt.htm\r\n\r\n${b64(html)}\r\n`;
    images.forEach((im) => {
      mhtml += `--${boundary}\r\nContent-Type: ${im.type}\r\nContent-Transfer-Encoding: base64\r\nContent-Location: ${im.loc}\r\n\r\n${im.data.replace(/.{76}/g, '$&\r\n')}\r\n`;
    });
    mhtml += `--${boundary}--\r\n`;
    return mhtml;
  }
  els.wordBtn.addEventListener('click', () => {
    try {
      const blob = new Blob([buildWordFile()], { type: 'application/msword' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = fileBase() + '.doc';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      toast(t('t_word'));
    } catch (e) {
      console.error('[receipt] Word export failed:', e);
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
    try { localStorage.setItem('rcpt:lang', lang); } catch (e) { /* ignore */ }

    updateAuthFormMode(authMode);
    renderCurrencyOptions(); renderItems(); renderFontFilter(); renderTypeGrid();
    refresh();
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
      if (R.ref) noteRef(R.ref); else { R.ref = nextRef(); fillForm(); }
    } else {
      applyState({});
      R.ref = nextRef(); fillForm();
    }
    applyLanguage();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { refresh(); renderThumbs(); });
  }
  init();
})();
