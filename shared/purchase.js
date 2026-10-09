// =====================================================================
// Purchase window + paid downloads (shared by every page that sells a file)
//
// Products come from /products.json. A page uses:
//   MPurchase.canDownload(id)  → true when bought (or admin)
//   MPurchase.act(id)          → downloads if bought, otherwise opens the window
//   MPurchase.onChange(fn)     → called when the bought/admin state changes
// Needs firebase-init.js (window.fbAuth) loaded before this file, plus
// shared/purchase.css. Server side: api/checkout.js, api/chargily-webhook.js,
// api/purchase-status.js, api/download.js.
// =====================================================================
(function () {
  'use strict';

  const TXT = {
    ar: {
      close: 'إغلاق',
      dzdT: 'الدفع بالدينار', dzdS: 'البطاقة الذهبية أو CIB', dzdCur: 'دج',
      usdT: 'الدفع بالدولار', usdS: 'بطاقة دولية أو PayPal',
      payNow: 'ادفع الآن', loginPay: 'سجّل الدخول ثم ادفع', loginNote: 'يلزم تسجيل الدخول قبل الدفع بالدينار.',
      redirect: 'جارٍ التحويل...', usdNote: 'يتم الدفع في نافذة آمنة دون مغادرة الموقع.',
      warnT: '⚠ خطوات مهمة بعد التحميل',
      warn1: 'زر الفأرة الأيمن على الملف ← خصائص ← حدد "إلغاء الحظر" ← موافق',
      warn2: 'افتح الملف واضغط "تمكين المحتوى"',
      err: 'حدث خطأ، حاول مرة أخرى.', loginErr: 'تعذّر تسجيل الدخول، حاول مرة أخرى.',
      paidWait: 'تم الدفع ✓ جارٍ تأكيد الشراء...', paidOk: 'تم تأكيد الشراء ✓ يمكنك الآن تحميل الملف.',
      paidLate: 'تم الدفع، وسيُفعَّل التحميل خلال لحظات. حدّث الصفحة بعد قليل.',
      failed: 'لم تكتمل عملية الدفع.', preparing: 'جارٍ تجهيز رابط التحميل...',
      missing: 'الملف غير متوفر حاليًا، تواصل معنا.', notOwned: 'لم نجد عملية شراء لهذا الملف في حسابك.',
      owned: 'لقد اشتريت هذا الملف سابقًا ✓',
    },
    en: {
      close: 'Close',
      dzdT: 'Pay in Dinar', dzdS: 'Edahabia or CIB card', dzdCur: 'DZD',
      usdT: 'Pay in Dollars', usdS: 'International card or PayPal',
      payNow: 'Pay now', loginPay: 'Sign in, then pay', loginNote: 'You need to sign in before paying in Dinar.',
      redirect: 'Redirecting...', usdNote: 'Secure checkout in a window, without leaving the site.',
      warnT: '⚠ Important steps after downloading',
      warn1: 'Right-click the file → Properties → tick "Unblock" → OK',
      warn2: 'Open the file and click "Enable Content"',
      err: 'Something went wrong, please try again.', loginErr: 'Sign-in failed, please try again.',
      paidWait: 'Payment received ✓ Confirming your purchase...', paidOk: 'Purchase confirmed ✓ You can now download the file.',
      paidLate: 'Payment received; the download will be ready in a moment. Refresh the page shortly.',
      failed: 'The payment was not completed.', preparing: 'Preparing the download link...',
      missing: 'The file is not available right now, please contact us.', notOwned: 'No purchase of this file was found on your account.',
      owned: 'You already bought this file ✓',
    },
  };

  const ICONS = {
    dzd: `<svg viewBox="0 0 86 58" aria-hidden="true">
      <defs><linearGradient id="pmGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FCE38A"/><stop offset=".5" stop-color="#F2C94C"/><stop offset="1" stop-color="#C99A06"/></linearGradient>
      <linearGradient id="pmCib" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2E7D5B"/><stop offset="1" stop-color="#14532D"/></linearGradient></defs>
      <rect x="22" y="2" width="60" height="38" rx="6" fill="url(#pmCib)"/>
      <text x="70" y="15" fill="#fff" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="8" text-anchor="middle">CIB</text>
      <rect x="4" y="16" width="62" height="40" rx="6" fill="url(#pmGold)" stroke="#B8860B" stroke-width=".8"/>
      <rect x="12" y="26" width="13" height="10" rx="2" fill="#E9D8A6" stroke="#8A6D00" stroke-width=".7"/>
      <path d="M12 31h13M18.5 26v10" stroke="#8A6D00" stroke-width=".6"/>
      <rect x="12" y="44" width="34" height="3.5" rx="1.75" fill="#8A6D00" opacity=".55"/>
      <text x="57" y="51" fill="#6B4E00" font-family="Inter,Arial,sans-serif" font-weight="900" font-size="7.5" text-anchor="middle">DZD</text>
    </svg>`,
    usd: `<svg viewBox="0 0 86 58" aria-hidden="true">
      <defs><linearGradient id="pmIntl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3B82F6"/><stop offset="1" stop-color="#1E3A8A"/></linearGradient></defs>
      <rect x="6" y="6" width="74" height="46" rx="7" fill="url(#pmIntl)"/>
      <rect x="6" y="15" width="74" height="8" fill="#0F1F4D" opacity=".55"/>
      <rect x="14" y="33" width="26" height="4" rx="2" fill="#fff" opacity=".75"/>
      <rect x="14" y="41" width="16" height="4" rx="2" fill="#fff" opacity=".5"/>
      <circle cx="64" cy="38" r="9" fill="none" stroke="#fff" stroke-width="1.6"/>
      <path d="M55 38h18M64 29c-3.4 3-3.4 15 0 18M64 29c3.4 3 3.4 15 0 18" fill="none" stroke="#fff" stroke-width="1.3"/>
    </svg>`,
    lock: '<svg viewBox="0 0 24 24"><rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>',
  };

  const S = {
    products: {},
    admin: false,
    owned: {},
    user: undefined,          // undefined = not known yet, null = signed out
    listeners: [],
    openId: null,
    opener: null,
    gumroadLoaded: false,
  };
  let readyResolve;
  const ready = new Promise(r => { readyResolve = r; });

  const lang = () => (document.documentElement.lang === 'en' ? 'en' : 'ar');
  const t = k => (TXT[lang()][k] ?? TXT.ar[k] ?? k);
  const pf = (p, k) => (lang() === 'en' && p[k + '_en']) ? p[k + '_en'] : (p[k] || '');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtUSD = n => '$' + Number(n).toFixed(2);
  const auth = () => window.fbAuth || null;

  /* ------------------------------ state ------------------------------ */
  function canDownload(id) { return !!(S.admin || S.owned[id]); }
  function onChange(fn) { S.listeners.push(fn); }
  function emit() { S.listeners.forEach(fn => { try { fn(); } catch (e) {} }); }

  async function api(path, opts = {}) {
    const user = auth() && auth().currentUser;
    if (!user) { const e = new Error('login_required'); e.code = 'login_required'; throw e; }
    const token = await user.getIdToken();
    const r = await fetch(path, {
      ...opts,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(opts.headers || {}) },
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) { const e = new Error(data.error || 'http_' + r.status); e.code = data.error || 'http_' + r.status; throw e; }
    return data;
  }

  async function refresh() {
    const ids = Object.keys(S.products);
    const before = JSON.stringify([S.admin, S.owned]);
    if (!S.user || !ids.length) {
      S.admin = false; S.owned = {};
    } else {
      try {
        const d = await api('/api/purchase-status?products=' + encodeURIComponent(ids.join(',')));
        S.admin = !!d.admin; S.owned = d.owned || {};
      } catch (e) { /* keep the previous state */ }
    }
    if (JSON.stringify([S.admin, S.owned]) !== before) emit();
    renderAuthBits();
  }

  /* ------------------------------ window ----------------------------- */
  function buildModal(p) {
    const el = document.createElement('div');
    el.className = 'pm-overlay';
    el.id = 'pm-' + p.id;
    el.setAttribute('dir', 'rtl');            // fixed layout: positions never move with the language
    el.innerHTML = `
      <div class="pm-modal" role="dialog" aria-modal="true" aria-labelledby="pm-${esc(p.id)}-title">
        <button type="button" class="pm-close" data-pm-close data-pk-label="close">✕</button>
        <header class="pm-head">
          <img class="pm-img" src="${esc(p.image || '')}" alt="">
          <div class="pm-head-tx">
            <h2 class="pm-title pm-tx" id="pm-${esc(p.id)}-title" data-pf="title"></h2>
            <p class="pm-desc pm-tx" data-pf="description"></p>
          </div>
        </header>
        <div class="pm-cards">
          <section class="pm-card pm-dzd">
            <div class="pm-card-ic">${ICONS.dzd}</div>
            <div class="pm-card-t pm-tx" data-pk="dzdT"></div>
            <div class="pm-card-s pm-tx" data-pk="dzdS"></div>
            <div class="pm-price pm-tx"><b>${esc(p.priceDZD)}</b><span data-pk="dzdCur"></span></div>
            <button type="button" class="pm-pay pm-pay-dzd" data-pm-dzd><span data-pm-dzd-label></span></button>
            <div class="pm-note pm-tx" data-pm-dzd-note></div>
          </section>
          <section class="pm-card pm-usd">
            <div class="pm-card-ic">${ICONS.usd}</div>
            <div class="pm-card-t pm-tx" data-pk="usdT"></div>
            <div class="pm-card-s pm-tx" data-pk="usdS"></div>
            <div class="pm-price"><b>${esc(fmtUSD(p.priceUSD))}</b></div>
            <a class="gumroad-button pm-pay pm-pay-usd" href="${esc(p.gumroadUrl || '#')}" target="_blank" rel="noopener" data-gumroad-overlay-checkout="true"><span data-pk="payNow"></span></a>
            <div class="pm-note pm-tx" data-pk="usdNote"></div>
          </section>
        </div>
        <div class="pm-warn pm-tx">
          <div class="pm-warn-t" data-pk="warnT"></div>
          <ol><li data-pk="warn1"></li><li data-pk="warn2"></li></ol>
        </div>
        <div class="pm-msg pm-tx" role="status" aria-live="polite"></div>
      </div>`;
    el.addEventListener('click', e => { if (e.target === el || e.target.closest('[data-pm-close]')) close(); });
    el.querySelector('[data-pm-dzd]').addEventListener('click', () => payDZD(p.id));
    document.body.appendChild(el);
    relabel(el, p);
    return el;
  }

  function relabel(el, p) {
    const d = lang() === 'ar' ? 'rtl' : 'ltr';
    el.querySelectorAll('.pm-tx').forEach(n => n.setAttribute('dir', d));
    el.querySelectorAll('[data-pk]').forEach(n => { n.textContent = t(n.dataset.pk); });
    el.querySelectorAll('[data-pf]').forEach(n => { n.textContent = pf(p, n.dataset.pf); });
    el.querySelectorAll('[data-pk-label]').forEach(n => { n.setAttribute('aria-label', t(n.dataset.pkLabel)); n.title = t(n.dataset.pkLabel); });
    const img = el.querySelector('.pm-img');
    if (img) img.alt = pf(p, 'title');
    renderAuthBits();
  }

  // DZD button label + note depend on the sign-in state
  function renderAuthBits() {
    document.querySelectorAll('.pm-overlay').forEach(el => {
      const btn = el.querySelector('[data-pm-dzd]');
      if (!btn || btn.disabled) return;
      const signedIn = !!S.user;
      el.querySelector('[data-pm-dzd-label]').textContent = t(signedIn ? 'payNow' : 'loginPay');
      el.querySelector('[data-pm-dzd-note]').textContent = signedIn ? '' : t('loginNote');
    });
  }

  function overlay(id) { return document.getElementById('pm-' + id); }
  function setMsg(id, text) { const el = overlay(id); if (el) el.querySelector('.pm-msg').textContent = text || ''; }

  function open(id) {
    const p = S.products[id];
    if (!p) return;
    const el = overlay(id) || buildModal(p);
    if (S.openId && S.openId !== id) close();
    setMsg(id, '');
    S.opener = document.activeElement;
    S.openId = id;
    document.documentElement.classList.add('pm-lock');
    el.classList.add('open');
    setTimeout(() => { const c = el.querySelector('.pm-close'); if (c) c.focus(); }, 30);
  }

  function close() {
    if (!S.openId) return;
    const el = overlay(S.openId);
    if (el) el.classList.remove('open');
    S.openId = null;
    document.documentElement.classList.remove('pm-lock');
    if (S.opener && S.opener.focus) { try { S.opener.focus(); } catch (e) {} }
    S.opener = null;
  }

  /* ------------------------------ paying ----------------------------- */
  async function signIn() {
    const a = auth();
    if (!a || !window.firebase || !firebase.auth) throw new Error('no_auth');
    await a.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  async function payDZD(id) {
    const el = overlay(id);
    const btn = el.querySelector('[data-pm-dzd]');
    const label = el.querySelector('[data-pm-dzd-label]');
    setMsg(id, '');
    if (!auth() || !auth().currentUser) {
      try { await signIn(); } catch (e) {
        if (e && e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') setMsg(id, t('loginErr'));
        return;
      }
      S.user = auth().currentUser;
      await refresh();
      if (canDownload(id)) { close(); toast(t('owned'), true); return; }
    }
    btn.disabled = true;
    label.textContent = t('redirect');
    try {
      const d = await api('/api/checkout', {
        method: 'POST',
        body: JSON.stringify({ productId: id, returnPath: location.pathname + location.hash, lang: lang() }),
      });
      window.location.href = d.checkoutUrl;
    } catch (e) {
      btn.disabled = false;
      renderAuthBits();
      if (e.code === 'already_owned') { await refresh(); close(); toast(t('owned'), true); return; }
      setMsg(id, t('err'));
    }
  }

  /* ----------------------------- download ---------------------------- */
  async function download(id) {
    toast(t('preparing'));
    try {
      const d = await api('/api/download', { method: 'POST', body: JSON.stringify({ productId: id }) });
      window.location.href = d.url;
    } catch (e) {
      toast(t(e.code === 'file_missing' ? 'missing' : e.code === 'not_purchased' ? 'notOwned' : 'err'));
      if (e.code === 'not_purchased') { await refresh(); }
    }
  }

  function act(id) { if (canDownload(id)) download(id); else open(id); }

  /* ------------------------------ notices ---------------------------- */
  let toastTimer;
  function toast(msg, ok) {
    let el = document.getElementById('pm-toast');
    if (!el) { el = document.createElement('div'); el.id = 'pm-toast'; el.className = 'pm-toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg;
    el.setAttribute('dir', lang() === 'ar' ? 'rtl' : 'ltr');
    el.classList.toggle('ok', !!ok);
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 4200);
  }

  // Back from Chargily: ?purchase=success|failed&product=<id>
  async function handleReturn() {
    const u = new URL(location.href);
    const state = u.searchParams.get('purchase');
    const id = u.searchParams.get('product');
    if (!state) return;
    u.searchParams.delete('purchase'); u.searchParams.delete('product');
    try { history.replaceState(history.state, '', u.pathname + u.search + u.hash); } catch (e) {}
    if (state !== 'success') { toast(t('failed')); return; }
    toast(t('paidWait'));
    await ready;
    // the webhook records the purchase; wait for it (up to ~30 s)
    for (let i = 0; i < 10; i++) {
      await refresh();
      if (canDownload(id)) { toast(t('paidOk'), true); return; }
      await new Promise(r => setTimeout(r, 3000));
    }
    toast(t('paidLate'));
  }

  /* ------------------------------- start ----------------------------- */
  function loadGumroad() {
    if (S.gumroadLoaded) return;
    S.gumroadLoaded = true;
    const s = document.createElement('script');
    s.src = 'https://gumroad.com/js/gumroad.js';
    s.async = true;
    document.body.appendChild(s);
  }

  async function init() {
    try {
      const r = await fetch('/products.json', { cache: 'no-cache' });
      const d = await r.json();
      (d.products || []).forEach(p => { S.products[p.id] = p; });
    } catch (e) { /* no products → nothing to sell on this page */ }

    // The windows exist before gumroad.js loads, so its overlay can attach to the buttons.
    Object.values(S.products).forEach(p => { if (!overlay(p.id)) buildModal(p); });
    if (Object.values(S.products).some(p => p.gumroadUrl)) loadGumroad();

    document.addEventListener('keydown', e => { if (e.key === 'Escape' && S.openId) close(); });
    new MutationObserver(() => {
      Object.values(S.products).forEach(p => { const el = overlay(p.id); if (el) relabel(el, p); });
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

    const a = auth();
    if (a) {
      a.onAuthStateChanged(async user => {
        S.user = user || null;
        await refresh();
        readyResolve();
      });
    } else {
      S.user = null;
      readyResolve();
    }
    emit();
    handleReturn();
  }

  window.MPurchase = { canDownload, act, open, close, download, onChange, refresh, ready };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
