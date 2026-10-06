// ============================================================
// app.js — Professional Email Assistant (مساعد البريد المهني)
// Shell (topbar, right-hand panel, accordion, gallery, "My messages",
// login, toasts) mirrors tools/admin-request. The preview is a mail window.
// AI drafting calls the existing Cloud Function "draftEmail" (callable),
// with the same payload as before plus optional extra fields.
// Saved messages: on the device (localStorage) and, on "Save",
// in Firestore at users/{uid}/mailDrafts/{id}.
// ============================================================

(function () {
  "use strict";

  const I18N = window.MAIL_I18N;
  const TPLS = window.MAIL_TEMPLATES;
  const EXAMPLES = window.MAIL_EXAMPLES;
  const EX_SENDER = window.MAIL_EXAMPLE_SENDER;
  const TPL_BY_ID = Object.fromEntries(TPLS.map((x) => [x.id, x]));
  const LANGS = ['ar', 'fr', 'en'];
  const TONES = ['formal_high', 'formal', 'friendly', 'firm', 'concise'];
  const LENGTHS = ['short', 'medium', 'long'];

  let lang = localStorage.getItem('mailassist:lang') || localStorage.getItem('site_lang') || 'ar';
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
  const TEXT_FIELDS = ['sName', 'sJob', 'sOrg', 'sEmail', 'sPhone', 'sExtra', 'toName', 'toTitle', 'toOrg', 'toEmail', 'subject', 'points'];
  function blankState(emailLang) {
    const s = { tplId: 'info', sigOn: true, body: '', bodyOwned: false, tone: 'formal', length: 'medium', emailLang: emailLang || lang };
    TEXT_FIELDS.forEach((k) => { s[k] = ''; });
    return s;
  }
  let R = blankState();
  let localId = null;
  let cloudId = null;

  function normalize(src) {
    const s = Object.assign({}, src || {});
    const out = blankState(LANGS.includes(s.emailLang) ? s.emailLang : lang);
    TEXT_FIELDS.forEach((k) => { if (s[k] != null) out[k] = String(s[k]); });
    out.tplId = TPL_BY_ID[s.tplId] ? s.tplId : 'info';
    out.sigOn = s.sigOn !== false;
    out.body = String(s.body || '');
    out.bodyOwned = !!s.bodyOwned && !!out.body.trim();
    out.tone = TONES.includes(s.tone) ? s.tone : 'formal';
    out.length = LENGTHS.includes(s.length) ? s.length : 'medium';
    return out;
  }
  // The previous version kept one form draft under "mail_assist_draft_v1".
  const PURPOSE_TO_TPL = { request: 'info', complaint: 'complaint', followup: 'followup', apology: 'apology', thanks: 'thanks', intro: 'intro', other: 'free' };
  function migrateOld(d) {
    return { tplId: PURPOSE_TO_TPL[d.purpose] || 'info', toName: d.recipient || '', subject: d.subject || '', points: d.points || '', tone: d.tone, emailLang: d.emailLang };
  }

  /* ================= DOM refs ================= */
  const els = {
    htmlRoot: $('htmlRoot'), langBtns: $$('.lang-btn'), typeGrid: $('typeGrid'),
    mwText: $('mwText'), mwTextEx: $('mwTextEx'), mwTextWrap: $('mwTextWrap'), mwBody: $('mwBody'), mwSig: $('mwSig'),
    fBody: $('f_body'), sigOn: $('f_sigOn'), saveBtn: $('saveBtn'), aiError: $('aiError'),
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
  // The example follows the message language (not the interface language).
  function exampleFor(tplId, l) {
    l = l || R.emailLang;
    const x = (EXAMPLES[tplId] || EXAMPLES.info)[l];
    const s = EX_SENDER[l];
    return { sName: s.name, sJob: s.job, sOrg: s.org, sEmail: s.email, sPhone: s.phone, sExtra: s.extra,
      toName: x.to[0], toTitle: x.to[1], toOrg: x.to[2], toEmail: x.to[3], subject: x.subject, points: x.points, body: x.body };
  }
  const ex = () => exampleFor(R.tplId);
  // what the window shows (and what is copied / sent): the user's value, else the example
  // Sender and recipient show the example only while the whole group is empty, so a real
  // name is never printed next to the example's job or organization.
  const GROUPS = { sender: ['sName', 'sJob', 'sOrg', 'sEmail', 'sPhone', 'sExtra'], to: ['toName', 'toTitle', 'toOrg', 'toEmail'] };
  const GROUP_OF = {};
  Object.entries(GROUPS).forEach(([g, ks]) => ks.forEach((k) => { GROUP_OF[k] = g; }));
  const groupTouched = (g) => GROUPS[g].some((k) => (R[k] || '').trim());
  function view(tplId) {
    const e = exampleFor(tplId || R.tplId);
    const V = {};
    TEXT_FIELDS.forEach((k) => {
      const v = (R[k] || '').trim();
      const g = GROUP_OF[k];
      V[k] = v || (g && groupTouched(g) ? '' : e[k] || '');
      V[k + '_ph'] = !v;
    });
    V.body = R.body.trim() ? R.body : e.body;
    V.body_ph = !R.body.trim();
    return V;
  }
  const isExampleBody = (text) => { const v = (text || '').trim(); return !!v && TPLS.some((x) => LANGS.some((l) => EXAMPLES[x.id][l].body.trim() === v)); };

  /* ================= Message text helpers ================= */
  function sigLines(V) {
    if (!R.sigOn) return [];
    return [V.sName, V.sJob, V.sOrg, [V.sPhone, V.sEmail].filter(Boolean).join(' · '), V.sExtra].filter((x) => (x || '').trim());
  }
  function fullText(V) {
    V = V || view();
    const sig = sigLines(V);
    return V.body.replace(/\s+$/, '') + (sig.length ? '\n\n' + sig.join('\n') : '');
  }
  const toLine = (V) => [V.toName, V.toTitle, V.toOrg].filter((x) => (x || '').trim()).join(' — ');
  const initial = (s) => { const m = /[\p{L}\p{N}]/u.exec(s || ''); return m ? m[0].toUpperCase() : '@'; };

  /* ================= Mail window ================= */
  function setText(el, value, ph) { el.textContent = value; el.classList.toggle('ph', !!ph); }
  function renderWindow() {
    const V = view();
    const tp = TPL_BY_ID[R.tplId];
    $('mwTag').textContent = `${tp.name[lang]} · ${t('tones')[R.tone]} · ${t('langs')[R.emailLang]}`;
    setText($('mwFromName'), V.sName, V.sName_ph);
    $('mwFromEmail').textContent = V.sEmail ? `<${V.sEmail}>` : '';
    $('mwFromAv').textContent = initial(V.sName);
    setText($('mwToName'), toLine(V), V.toName_ph && V.toTitle_ph && V.toOrg_ph);
    $('mwToEmail').textContent = V.toEmail ? `<${V.toEmail}>` : '';
    $('mwToAv').textContent = initial(V.toName || V.toTitle || V.toOrg);
    setText($('mwSubject'), V.subject, V.subject_ph);
    const dir = R.emailLang === 'ar' ? 'rtl' : 'ltr';
    els.mwBody.setAttribute('dir', dir);
    els.mwBody.setAttribute('lang', R.emailLang);
    els.mwTextEx.textContent = ex().body;
    syncBodyExample();
    const sig = sigLines(V);
    els.mwSig.innerHTML = sig.length ? `<b>${escapeHtml(sig[0])}</b>` + sig.slice(1).map((l, i) => {
      const cls = l === V.sJob ? 'sig-job' : l === V.sOrg ? 'sig-org' : (/@|\d{3}/.test(l) && i < 3 ? 'sig-contact' : '');
      return `<div class="${cls}">${escapeHtml(l)}</div>`;
    }).join('') : '';
    syncExamplePlaceholders();
  }
  function syncBodyExample() {
    const empty = !els.mwText.innerText.trim();
    els.mwTextWrap.classList.toggle('is-ex', empty);
    if (empty && els.mwText.innerHTML) els.mwText.innerHTML = '';
  }
  function getBody() { return els.mwText.innerText.replace(/\n$/, ''); }
  function setBody(text) {
    els.mwText.innerText = text || '';
    els.fBody.value = text || '';
    R.body = text || '';
    syncBodyExample();
  }
  els.fBody.addEventListener('input', () => {
    els.mwText.innerText = els.fBody.value;
    R.body = els.fBody.value; R.bodyOwned = !!R.body.trim();
    syncBodyExample(); refreshLight(); saveDraft();
  });
  els.mwText.addEventListener('input', () => {
    R.body = getBody(); R.bodyOwned = !!R.body.trim();
    els.fBody.value = R.body;
    els.mwTextWrap.classList.toggle('is-ex', !els.mwText.innerText.trim()); // keep the caret
    refreshLight(); saveDraft();
  });
  $('useExampleBtn').addEventListener('click', () => {
    const e = ex();
    if (!R.subject.trim()) { R.subject = e.subject; $('f_subject').value = e.subject; }
    setBody(e.body); R.bodyOwned = true;
    refresh(); saveDraft(); els.fBody.focus();
  });

  function syncExamplePlaceholders() {
    const e = ex();
    TEXT_FIELDS.forEach((k) => { const el = $('f_' + k); if (el && k !== 'sExtra') el.placeholder = e[k] || ''; });
    els.fBody.placeholder = e.body;
  }

  /* refresh = window + summaries + highlight + thumbs */
  let thumbTimer = null;
  function refresh() {
    renderWindow();
    updateSummaries();
    highlight();
    clearTimeout(thumbTimer);
    thumbTimer = setTimeout(renderThumbs, 350);
  }
  function refreshLight() { renderWindow(); updateSummaries(); highlight(); }

  /* ================= Form <-> state ================= */
  function fillForm() {
    $$('[data-f]').forEach((el) => { el.value = R[el.dataset.f] == null ? '' : R[el.dataset.f]; });
    els.sigOn.checked = R.sigOn;
    setBody(R.body);
    renderTypeGrid(); renderStyleControls();
  }
  document.addEventListener('input', (e) => {
    const el = e.target.closest('[data-f]'); if (!el) return;
    R[el.dataset.f] = el.value;
    refreshLight(); saveDraft();
    clearTimeout(thumbTimer); thumbTimer = setTimeout(renderThumbs, 600);
  });
  els.sigOn.addEventListener('change', () => { R.sigOn = els.sigOn.checked; refresh(); saveDraft(); });

  /* ================= Style: tone, length, message language ================= */
  function renderStyleControls() {
    $('toneChips').innerHTML = TONES.map((k) => `<button type="button" class="chip ${k === R.tone ? 'on' : ''}" data-tone="${k}">${escapeHtml(t('tones')[k])}</button>`).join('');
    $('lengthSeg').innerHTML = LENGTHS.map((k) => `<button type="button" class="${k === R.length ? 'on' : ''}" data-length="${k}">${escapeHtml(t('lengths')[k])}</button>`).join('');
    $('langSeg').innerHTML = LANGS.map((k) => `<button type="button" class="${k === R.emailLang ? 'on' : ''}" data-elang="${k}">${escapeHtml(t('langs')[k])}</button>`).join('');
    $('trMenu').innerHTML = LANGS.map((k) => `<button type="button" data-tr="${k}">${escapeHtml(t('translate_to'))} ${escapeHtml(t('langs')[k])}</button>`).join('');
  }
  $('toneChips').addEventListener('click', (e) => { const b = e.target.closest('[data-tone]'); if (!b) return; R.tone = b.dataset.tone; renderStyleControls(); refresh(); saveDraft(); });
  $('lengthSeg').addEventListener('click', (e) => { const b = e.target.closest('[data-length]'); if (!b) return; R.length = b.dataset.length; renderStyleControls(); refresh(); saveDraft(); });
  $('langSeg').addEventListener('click', (e) => {
    const b = e.target.closest('[data-elang]'); if (!b) return;
    const old = R.emailLang; R.emailLang = b.dataset.elang;
    // an untouched example text follows the message language
    if (R.body.trim() && R.body.trim() === exampleFor(R.tplId, old).body.trim()) setBody(ex().body);
    if (R.subject.trim() === exampleFor(R.tplId, old).subject) { R.subject = ex().subject; $('f_subject').value = R.subject; }
    renderStyleControls(); refresh(); saveDraft();
  });

  /* ================= Templates ================= */
  function renderTypeGrid() {
    els.typeGrid.innerHTML = TPLS.map((x) => `
      <button type="button" class="type-card ${x.id === R.tplId ? 'on' : ''}" data-type="${x.id}" style="--c:${x.color}">
        <span class="t-ico"><svg viewBox="0 0 24 24">${x.icon}</svg></span><span>${escapeHtml(x.name[lang])}</span>
      </button>`).join('');
  }
  els.typeGrid.addEventListener('click', (e) => { const b = e.target.closest('[data-type]'); if (b) applyTemplate(b.dataset.type); });
  // Choosing a template swaps in its example. Text the user wrote stays; an untouched example gives way.
  function applyTemplate(id, fromGallery) {
    if (!TPL_BY_ID[id]) return;
    if (!R.body.trim() || isExampleBody(R.body)) { setBody(''); R.bodyOwned = false; }
    const isExSubject = (v) => TPLS.some((x) => LANGS.some((l) => EXAMPLES[x.id][l].subject === (v || '').trim()));
    if (isExSubject(R.subject)) { R.subject = ''; $('f_subject').value = ''; }
    R.tplId = id;
    renderTypeGrid();
    if (fromGallery) closeGallery();
    refresh(); saveDraft();
    toast(t('t_tpl'));
  }

  /* ================= Thumbnails (miniature mail windows) ================= */
  function miniHtml(tplId) {
    const V = view(tplId);
    const tp = TPL_BY_ID[tplId];
    const dir = R.emailLang === 'ar' ? 'rtl' : 'ltr';
    const sig = sigLines(V);
    return `<div class="mail-win">
      <div class="mw-top"><span class="mw-dots"><i></i><i></i><i></i></span><b>${escapeHtml(t('w_new'))}</b><span class="mw-tag">${escapeHtml(tp.name[lang])}</span></div>
      <div class="mw-row"><span class="mw-lbl">${escapeHtml(t('w_from'))}</span><span class="mw-addr"><span class="mw-av">${escapeHtml(initial(V.sName))}</span><b>${escapeHtml(V.sName)}</b></span></div>
      <div class="mw-row"><span class="mw-lbl">${escapeHtml(t('w_to'))}</span><span class="mw-addr"><span class="mw-av alt">${escapeHtml(initial(V.toName || V.toTitle))}</span><b>${escapeHtml(toLine(V))}</b></span></div>
      <div class="mw-row mw-subj"><span class="mw-lbl">${escapeHtml(t('w_subject'))}</span><b>${escapeHtml(V.subject)}</b></div>
      <div class="mw-body" dir="${dir}"><div class="mw-text">${escapeHtml(R.body.trim() && !isExampleBody(R.body) ? R.body : exampleFor(tplId).body)}</div>
      ${sig.length ? `<div class="mw-sig"><b>${escapeHtml(sig[0])}</b>${sig.slice(1).map((l) => `<div>${escapeHtml(l)}</div>`).join('')}</div>` : ''}</div></div>`;
  }
  function mountMini(box, tplId) {
    box.innerHTML = '';
    const w = box.clientWidth; if (!w) return;
    const m = document.createElement('div');
    m.className = 'mini-mail';
    m.innerHTML = miniHtml(tplId);
    m.style.transform = `scale(${w / 760})`;
    box.appendChild(m);
  }
  function renderThumbs() {
    mountMini($('currentThumb'), R.tplId);
    $('currentTplName').textContent = TPL_BY_ID[R.tplId].name[lang];
  }

  /* ================= Gallery ================= */
  let gCat = 'all';
  function openGallery() { show($('gallery')); buildGallery(); setTimeout(() => $('gSearch').focus(), 50); }
  function closeGallery() { hide($('gallery')); }
  function buildGallery() {
    const q = $('gSearch').value.trim().toLowerCase();
    const list = TPLS.filter((x) => (gCat === 'all' || x.cat === gCat) && (!q || Object.values(x.name).some((n) => n.toLowerCase().includes(q))));
    $('gGrid').innerHTML = list.map((x) => `
      <button type="button" class="g-card ${x.id === R.tplId ? 'on' : ''}" data-type="${x.id}">
        <div class="g-thumb"></div>
        <div class="g-meta"><span class="g-ico" style="--c:${x.color}"><svg viewBox="0 0 24 24">${x.icon}</svg></span><b>${escapeHtml(x.name[lang])}</b></div>
      </button>`).join('') || `<div class="g-empty">${t('g_empty')}</div>`;
    $$('.g-card', $('gGrid')).forEach((c) => mountMini(c.querySelector('.g-thumb'), c.dataset.type));
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
    const c = e.target.closest('.g-card'); if (c) applyTemplate(c.dataset.type, true);
  });

  /* ================= Click-to-edit & accordion ================= */
  function secColor(id) { const a = document.querySelector(`.acc[data-sec="${id}"]`); return a ? a.style.getPropertyValue('--sc') : '#2F5770'; }
  function highlight() {
    $$('[data-sec]', $('mailWin')).forEach((p) => {
      const on = !!openSec && p.dataset.sec === openSec;
      p.classList.toggle('hl', on);
      if (on) p.style.setProperty('--hl', secColor(openSec));
    });
  }
  $('mailWin').addEventListener('click', (e) => {
    const part = e.target.closest('[data-sec]'); if (!part) return;
    const k = part.dataset.sec;
    $('workspace').classList.remove('collapsed');
    if (openSec !== k) toggleSec(k, true);
    setTimeout(() => { const a = document.querySelector(`.acc[data-sec="${k}"]`); if (a) a.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 300);
  });
  let openSec = null;
  function toggleSec(id, force) {
    openSec = (force === undefined ? openSec !== id : force) ? id : null;
    $$('.acc').forEach((a) => a.classList.toggle('open', a.dataset.sec === openSec));
    $('accordion').classList.toggle('has-open', !!openSec);
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
      } else toggleSec(null);
    }
  });
  function cut(x, n) { x = String(x || '').replace(/\s+/g, ' ').trim(); n = n || 54; return x.length > n ? x.slice(0, n - 1) + '…' : x; }
  function updateSummaries() {
    const set = (k, v) => { const el = document.querySelector(`[data-sum="${k}"]`); if (el) el.textContent = v; };
    set('type', TPL_BY_ID[R.tplId].name[lang]);
    set('sender', cut([R.sName, R.sJob, R.sOrg].map((s) => s.trim()).filter(Boolean).join(' · ')) || t('d_sender'));
    set('to', cut([R.toName, R.toTitle, R.toOrg].map((s) => s.trim()).filter(Boolean).join(' · ')) || t('d_to'));
    set('details', cut(R.subject.trim() || R.points.trim() || R.body.trim()) || t('d_details'));
    set('style', [t('tones')[R.tone], t('lengths')[R.length], t('langs')[R.emailLang]].join(' · '));
  }

  /* ================= Copy / Gmail / Outlook / mailto / Word ================= */
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); toast(t('t_copied')); }
    catch (e) {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      const ok = document.execCommand && document.execCommand('copy'); ta.remove();
      toast(ok ? t('t_copied') : t('t_copy_err'));
    }
  }
  $('copyBtn').addEventListener('click', () => copy(fullText()));
  $('copySubjectBtn').addEventListener('click', () => copy(view().subject));
  const enc = encodeURIComponent;
  function openUrl(url) { window.open(url, '_blank', 'noopener'); }
  $('gmailBtn').addEventListener('click', () => { const V = view(); openUrl(`https://mail.google.com/mail/?view=cm&fs=1&to=${enc(V.toEmail)}&su=${enc(V.subject)}&body=${enc(fullText(V))}`); });
  $('outlookBtn').addEventListener('click', () => { const V = view(); openUrl(`https://outlook.office.com/mail/deeplink/compose?to=${enc(V.toEmail)}&subject=${enc(V.subject)}&body=${enc(fullText(V))}`); });
  $('mailtoBtn').addEventListener('click', () => { const V = view(); window.location.href = `mailto:${enc(V.toEmail).replace(/%40/g, '@')}?subject=${enc(V.subject)}&body=${enc(fullText(V))}`; });
  $('wordBtn').addEventListener('click', () => {
    const V = view();
    const rtl = R.emailLang === 'ar', dir = rtl ? 'rtl' : 'ltr', align = rtl ? 'right' : 'left';
    const font = rtl ? "'Traditional Arabic', 'Simplified Arabic', Arial" : "Calibri, Arial, sans-serif";
    const p = (html, st) => `<p dir=${dir} style="margin:0 0 6pt;text-align:${align};${st || ''}">${html}</p>`;
    const row = (k, v) => `<tr><td style="padding:3pt 8pt;color:#64768A;width:80pt;font-weight:bold">${escapeHtml(k)}</td><td style="padding:3pt 8pt">${escapeHtml(v)}</td></tr>`;
    const head = `<table dir=${lang === 'ar' ? 'rtl' : 'ltr'} style="border-collapse:collapse;width:100%;border-bottom:1pt solid #D5DCE4;margin-bottom:14pt;font-family:${font}">
      ${row(t('w_from'), [V.sName, V.sEmail ? `<${V.sEmail}>` : ''].filter(Boolean).join(' '))}${row(t('w_to'), [toLine(V), V.toEmail ? `<${V.toEmail}>` : ''].filter(Boolean).join(' '))}${row(t('w_subject'), V.subject)}</table>`;
    const body = V.body.split('\n').map((l) => p(l.trim() ? escapeHtml(l) : '&nbsp;', 'line-height:150%')).join('');
    const sig = sigLines(V);
    const sigHtml = sig.length ? `<div style="margin-top:14pt;border-top:1pt dashed #C9D2DA;padding-top:8pt">${p(`<b>${escapeHtml(sig[0])}</b>`)}${sig.slice(1).map((l) => p(escapeHtml(l), 'color:#475569')).join('')}</div>` : '';
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${escapeHtml(V.subject)}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>@page{size:21cm 29.7cm;margin:2cm;} body{font-family:${font};font-size:12pt;color:#1F2A37;}</style></head>
<body dir=${dir}>${head}${body}${sigHtml}</body></html>`;
    const blob = new Blob(['﻿', html], { type: 'application/msword' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = ((V.subject || 'email').replace(/[\\/:*?"<>|]+/g, '').trim().slice(0, 60) || 'email') + '.doc';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast(t('t_word'));
  });

  /* ================= AI (Cloud Function: draftEmail) ================= */
  const hasFb = () => typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length && firebase.auth && firebase.firestore;
  let currentUser = null;
  function showAiError(msg) { els.aiError.textContent = msg; show(els.aiError); toast(msg); }
  function hideAiError() { hide(els.aiError); }
  async function callDraftEmail(payload) {
    const fns = window.fbFunctions || (firebase.functions && firebase.functions());
    const fn = fns.httpsCallable('draftEmail');
    const res = await fn(payload);
    return res.data.text;
  }
  // a "Subject: …" first line in the answer goes to the subject field
  function takeSubject(text) {
    const m = /^\s*(?:الموضوع|Subject|Objet)\s*[:：]\s*(.+)\n+/i.exec(text || '');
    if (!m) return text;
    if (!R.subject.trim()) { R.subject = m[1].trim(); $('f_subject').value = R.subject; }
    return text.slice(m[0].length);
  }
  function setAiBusy(busy, label) {
    ['writeBtn', 'writeBtn2'].forEach((id) => { const b = $(id); b.disabled = busy; b.querySelector('span').textContent = busy && label ? label : t('write'); });
    $$('.quick-chip').forEach((c) => { c.disabled = busy; });
  }
  async function generate() {
    hideAiError();
    const points = R.points.trim();
    if (!points) {
      toggleSec('details', true);
      setTimeout(() => $('f_points').focus(), 300);
      showAiError(t('errNoPoints')); return;
    }
    if (!hasFb()) { showAiError(t('errGeneric')); return; }
    if (!currentUser) { openLogin(generate, true); return; }
    setAiBusy(true, t('generating'));
    try {
      const text = await callDraftEmail({
        // same fields as before
        mode: 'generate', recipient: [R.toName, R.toTitle, R.toOrg].map((x) => x.trim()).filter(Boolean).join(' — '),
        subject: R.subject.trim(), purpose: TPL_BY_ID[R.tplId].purpose, points, tone: R.tone, language: R.emailLang,
        // optional extras (a function that does not use them simply ignores them)
        template: R.tplId, length: R.length,
        senderName: R.sName.trim(), senderJob: R.sJob.trim(), senderOrg: R.sOrg.trim(),
        recipientName: R.toName.trim(), recipientTitle: R.toTitle.trim(), recipientOrg: R.toOrg.trim(),
      });
      if (!text) throw new Error('empty');
      setBody(takeSubject(text)); R.bodyOwned = true;
      refresh(); saveDraft(); toast(t('t_generated'));
    } catch (e) {
      console.error('[mail] generate failed:', e);
      showAiError(t('errGeneric'));
    } finally { setAiBusy(false); }
  }
  async function revise(action, targetLang) {
    hideAiError();
    const current = R.body.trim();
    if (!current) { showAiError(t('errNoText')); return; }
    if (!hasFb()) { showAiError(t('errGeneric')); return; }
    if (!currentUser) { openLogin(() => revise(action, targetLang), true); return; }
    setAiBusy(true);
    try {
      const payload = { mode: 'revise', action, currentDraft: current, language: targetLang || R.emailLang };
      if (targetLang) payload.targetLanguage = targetLang;
      const text = await callDraftEmail(payload);
      if (!text) throw new Error('empty');
      setBody(takeSubject(text)); R.bodyOwned = true;
      if (targetLang) { R.emailLang = targetLang; renderStyleControls(); }
      refresh(); saveDraft(); toast(t('t_generated'));
    } catch (e) {
      console.error('[mail] revise failed:', e);
      showAiError(t('errGeneric'));
    } finally { setAiBusy(false); }
  }
  $('writeBtn').addEventListener('click', generate);
  $('writeBtn2').addEventListener('click', generate);
  $('aiChips').addEventListener('click', (e) => {
    const c = e.target.closest('.quick-chip[data-action]'); if (c) { revise(c.dataset.action); return; }
    if (e.target.closest('#translateBtn')) { e.stopPropagation(); $('trMenu').classList.toggle('hidden'); return; }
    const tr = e.target.closest('[data-tr]'); if (tr) { hide($('trMenu')); revise('translate', tr.dataset.tr); }
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.tr-wrap')) hide($('trMenu')); });

  /* ================= Persistence (device) ================= */
  const STORAGE_KEY = 'mailassist:draft';
  const OLD_KEY = 'mail_assist_draft_v1';
  const HISTORY_KEY = 'mailassist:history';
  const MAX_HISTORY = 40;
  let draftTimer = null;
  function collectFullState() { return Object.assign(JSON.parse(JSON.stringify(R)), { lang }); }
  function hasContent(s) { return TEXT_FIELDS.some((k) => (s[k] || '').trim()) || (s.body || '').trim(); }
  function getHistory() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch (e) { return []; } }
  function setHistory(h) { try { localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); return true; } catch (e) { return false; } }
  function deriveTitle() { const s = R.subject.trim() || R.points.trim() || R.body.trim().split('\n')[0]; return s ? s.slice(0, 80) : t('untitled'); }
  function commitLocal() {
    const s = collectFullState();
    let ok = true;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.assign({}, s, { localId, cloudId }))); } catch (e) { ok = false; }
    if (!hasContent(s)) return ok;
    if (!localId) localId = newLocalId();
    const h = getHistory().filter((x) => x.localId !== localId);
    h.unshift(Object.assign({}, s, { localId, cloudId, title: deriveTitle(), archivedAt: new Date().toISOString() }));
    if (h.length > MAX_HISTORY) h.length = MAX_HISTORY;
    return setHistory(h) && ok;
  }
  function saveDraft() { clearTimeout(draftTimer); draftTimer = setTimeout(commitLocal, 500); }
  window.addEventListener('pagehide', () => { clearTimeout(draftTimer); commitLocal(); });
  function loadDraft() {
    try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch (e) { /* ignore */ }
    try { const old = localStorage.getItem(OLD_KEY); if (old) return migrateOld(JSON.parse(old)); } catch (e) { /* ignore */ }
    return null;
  }
  function applyState(state) { R = normalize(state); fillForm(); }
  $('clearAllBtn').addEventListener('click', async () => {
    if (!(await askConfirm(t('confirmClear')))) return;
    applyState({ tplId: R.tplId, tone: R.tone, length: R.length, emailLang: R.emailLang });
    localId = null; cloudId = null;
    refresh(); commitLocal(); toast(t('t_cleared'));
  });

  /* ================= Account (Firebase): users/{uid}/mailDrafts ================= */
  const draftsCol = (uid) => firebase.firestore().collection('users').doc(uid).collection('mailDrafts');
  let pendingAfterLogin = null;
  if (hasFb()) {
    firebase.auth().onAuthStateChanged((user) => {
      currentUser = user;
      $('aiHint').classList.toggle('hidden', !!user);
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
    closeLogin(); toast(t('t_welcome'));
    $('aiHint').classList.add('hidden');
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
  $('logoutBtn').addEventListener('click', async () => {
    if (!hasFb()) return;
    try { await firebase.auth().signOut(); } catch (e) { /* ignore */ }
    currentUser = null; cloudId = null; toast(t('t_logout')); loadMine();
  });

  async function saveToAccount() {
    clearTimeout(draftTimer);
    const localOk = commitLocal();
    if (!currentUser) {
      toast(localOk ? t('t_saved_local') : t('t_cloud_err'));
      if (hasFb()) openLogin(saveToAccount);
      return;
    }
    const payload = Object.assign({}, collectFullState(), { title: deriveTitle(), updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
    els.saveBtn.disabled = true;
    try {
      const col = draftsCol(currentUser.uid);
      if (cloudId) await col.doc(cloudId).set(payload, { merge: true });
      else { const ref = await col.add(Object.assign({ createdAt: firebase.firestore.FieldValue.serverTimestamp() }, payload)); cloudId = ref.id; }
      commitLocal();
      toast(t('t_saved_cloud'));
    } catch (e) {
      console.error('[mail] save to account failed:', e);
      toast(t('t_cloud_err'));
    }
    els.saveBtn.disabled = false;
  }
  els.saveBtn.addEventListener('click', saveToAccount);

  /* ================= My messages ================= */
  const IC_OPEN = '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';
  const IC_DUP = '<svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>';
  const IC_DEL = '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>';
  const IC_PLUS = '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';
  let mineList = [];
  let mineSrc = 'all';
  let cloudLoading = false;
  function openMine() { show($('mine')); loadMine(); }
  function closeMine() { hide($('mine')); }
  function renderAccount() {
    const u = currentUser;
    $('mineAccount').classList.toggle('hidden', !u);
    if (!u) return;
    const name = u.displayName || u.email || '';
    $('acctName').textContent = name;
    $('acctAv').innerHTML = u.photoURL ? `<img src="${escapeAttr(u.photoURL)}" alt="">` : escapeHtml(initial(name));
  }
  async function fetchCloud() {
    if (!currentUser || !hasFb()) return [];
    try {
      const snap = await draftsCol(currentUser.uid).get();
      return snap.docs.map((d) => { const data = d.data(); return Object.assign({}, data, { _source: 'cloud', _cloudId: d.id, _ts: data.updatedAt && data.updatedAt.toMillis ? data.updatedAt.toMillis() : 0 }); });
    } catch (e) { console.error('[mail] loading saved messages failed:', e); toast(t('t_cloud_err')); return []; }
  }
  async function loadMine() {
    const loggedIn = !!currentUser;
    renderAccount();
    $('mineLogin').classList.toggle('hidden', loggedIn || !hasFb());
    let cloud = [];
    if (loggedIn) { cloudLoading = true; renderMine(); cloud = await fetchCloud(); cloudLoading = false; }
    const cloudIds = new Set(cloud.map((c) => c._cloudId));
    const local = getHistory().filter((x) => !(x.cloudId && cloudIds.has(x.cloudId)))
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
        const tp = TPL_BY_ID[n.tplId];
        const isCurrent = (r._source === 'local' && r.localId && r.localId === localId) || (r._source === 'cloud' && r._cloudId === cloudId);
        const sub = [n.toName || n.toTitle || n.toOrg, tp.name[lang]].filter(Boolean).join(' · ');
        return `<div class="g-card m-card" data-idx="${idx}">
          ${isCurrent ? `<span class="m-tag">${t('current')}</span>` : ''}
          <div class="m-top"><span class="m-ico" style="--c:${tp.color}"><svg viewBox="0 0 24 24">${tp.icon}</svg></span>
            <div class="m-info"><b>${escapeHtml(r.title || t('untitled'))}</b><small>${escapeHtml(sub)}</small></div></div>
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
      applyState({ tplId: R.tplId, tone: R.tone, length: R.length, emailLang: R.emailLang,
        sName: R.sName, sJob: R.sJob, sOrg: R.sOrg, sEmail: R.sEmail, sPhone: R.sPhone, sExtra: R.sExtra, sigOn: R.sigOn });
      localId = null; cloudId = null; toggleSec(null);
      closeMine(); refresh(); toast(t('t_new'));
      return;
    }
    const card = btn.closest('[data-idx]'); if (!card) return;
    const r = mineList[+card.dataset.idx]; if (!r) return;
    try {
      if (action === 'open') { commitLocal(); openEntry(r); closeMine(); toast(t('t_opened')); }
      else if (action === 'dup') {
        const h = getHistory();
        h.unshift(Object.assign({}, normalize(r), { lang: r.lang || lang, title: r.title, localId: newLocalId(), cloudId: null, archivedAt: new Date().toISOString() }));
        setHistory(h); toast(t('t_dup')); loadMine();
      } else if (action === 'delete') {
        if (!(await askConfirm(t('confirmDelete')))) return;
        if (r._source === 'cloud') {
          await draftsCol(currentUser.uid).doc(r._cloudId).delete();
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
    try { localStorage.setItem('mailassist:lang', lang); localStorage.setItem('site_lang', lang); } catch (e) { /* ignore */ }
    updateAuthFormMode(authMode);
    renderTypeGrid(); renderStyleControls();
    refresh();
    if (!$('mine').classList.contains('hidden')) renderMine();
    if (!$('gallery').classList.contains('hidden')) buildGallery();
  }
  $('langToggle').addEventListener('click', (e) => { e.stopPropagation(); $('langMenu').classList.toggle('hidden'); });
  els.langBtns.forEach((btn) => btn.addEventListener('click', () => {
    hide($('langMenu'));
    const old = lang;
    lang = btn.getAttribute('data-lang');
    // while the message itself is untouched, its language follows the interface
    if (R.emailLang === old && !R.body.trim() && !R.subject.trim()) R.emailLang = lang;
    applyLanguage(); saveDraft();
  }));
  document.addEventListener('click', (e) => { if (!e.target.closest('.lang-wrap')) hide($('langMenu')); });

  /* ================= Toolbar ================= */
  $('btnFullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) (document.documentElement.requestFullscreen || function () {}).call(document.documentElement);
    else if (document.exitFullscreen) document.exitFullscreen();
  });
  $('panelToggle').addEventListener('click', () => { $('workspace').classList.toggle('collapsed'); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeGallery(); closeMine(); closeConfirm(false); hide($('trMenu'));
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
    } else applyState({ emailLang: lang });
    applyLanguage();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(renderThumbs);
  }
  init();
})();
