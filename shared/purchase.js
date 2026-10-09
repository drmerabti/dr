// =====================================================================
// Purchase window + paid downloads (shared by every page that sells a file)
//
// Products come from /products.json. A page uses:
//   MPurchase.canDownload(id)  → true when bought (or admin)
//   MPurchase.act(id)          → downloads if bought, otherwise opens the window
//   MPurchase.onChange(fn)     → called when the bought/admin state changes
// Needs the Firebase compat SDK (app, auth, firestore, functions) + firebase-init.js
// loaded before this file, plus shared/purchase.css.
// Server side = Firebase Functions (us-central1), each product has a "serverId":
//   createSubscriptionCheckout({ product })  → { checkoutUrl }        (Chargily, DZD)
//   getProductDownload({ product })          → { fileName, base64 }   (bought or admin)
//   Firestore users/{uid}/purchases/{serverId}.paid === true          (written by the backend)
// Chargily brings the buyer back with ?paid=<serverId> or ?payfail=1.
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
      err: 'حدث خطأ، حاول مرة أخرى.', errCode: 'رمز الخطأ', loginErr: 'تعذّر تسجيل الدخول، حاول مرة أخرى.',
      paidWait: 'جارٍ تأكيد الدفع...', paidOk: '✓ تم الدفع بنجاح', downloadNow: 'تحميل الآن',
      paidLate: 'لم يصل تأكيد الدفع بعد. إن خُصم المبلغ فسيظهر زر التحميل خلال دقائق، حدّث الصفحة لاحقًا.',
      failed: 'لم تكتمل عملية الدفع', preparing: 'جارٍ تجهيز الملف...',
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
      err: 'Something went wrong, please try again.', errCode: 'error code', loginErr: 'Sign-in failed, please try again.',
      paidWait: 'Confirming your payment...', paidOk: '✓ Payment successful', downloadNow: 'Download now',
      paidLate: 'The payment confirmation has not arrived yet. If you were charged, the download will appear within minutes; refresh the page later.',
      failed: 'The payment was not completed', preparing: 'Preparing the file...',
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

  const db = () => (window.fbDb || (window.firebase && firebase.firestore && firebase.firestore()) || null);
  const serverId = id => (S.products[id] && S.products[id].serverId) || id;
  const purchaseDoc = (uid, id) => db().collection('users').doc(uid).collection('purchases').doc(serverId(id));
  // "functions/permission-denied" (compat SDK) → "permission-denied"
  const errCode = e => String((e && e.code) || 'unknown').replace(/^functions\//, '');

  // Firebase callable function, same way as the other tools of the site
  function callable(name) {
    if (!window.firebase || !firebase.functions) throw Object.assign(new Error('functions_sdk_missing'), { code: 'functions_sdk_missing' });
    return firebase.functions().httpsCallable(name);
  }

  // Bought (users/{uid}/purchases/{serverId}.paid) and admin (users/{uid}.isAdmin), read from Firestore
  async function refresh() {
    const ids = Object.keys(S.products);
    const before = JSON.stringify([S.admin, S.owned]);
    const user = auth() && auth().currentUser;
    if (!user || !db()) {
      S.admin = false; S.owned = {};
    } else {
      try {
        const u = await db().collection('users').doc(user.uid).get();
        S.admin = !!(u.exists && u.data().isAdmin === true);
      } catch (e) { S.admin = false; }
      await Promise.all(ids.map(async id => {
        try { const d = await purchaseDoc(user.uid, id).get(); S.owned[id] = !!(d.exists && d.data().paid === true); }
        catch (e) { /* keep the previous value */ }
      }));
    }
    if (JSON.stringify([S.admin, S.owned]) !== before) emit();
    renderAuthBits();
  }

  // Resolves true as soon as purchases/{serverId}.paid becomes true (false after the timeout)
  function waitForPaid(id, timeoutMs) {
    return new Promise(resolve => {
      const user = auth() && auth().currentUser;
      if (!user || !db()) return resolve(false);
      let done = false, unsub = () => {};
      const finish = v => { if (done) return; done = true; clearTimeout(timer); try { unsub(); } catch (e) {} resolve(v); };
      const timer = setTimeout(() => finish(false), timeoutMs);
      unsub = purchaseDoc(user.uid, id).onSnapshot(snap => {
        if (snap.exists && snap.data().paid === true) {
          const changed = !S.owned[id];
          S.owned[id] = true;
          if (changed) emit();
          finish(true);
        }
      }, () => {});
    });
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
      const res = await callable('createSubscriptionCheckout')({ product: serverId(id) });
      const url = res && res.data && res.data.checkoutUrl;
      if (!url) throw Object.assign(new Error('no checkoutUrl'), { code: 'no_checkout_url' });
      window.location.href = url;
    } catch (e) {
      btn.disabled = false;
      renderAuthBits();
      console.error('[purchase] createSubscriptionCheckout failed:', e && e.code, e && e.message, e && e.details);
      setMsg(id, `${t('err')} (${t('errCode')}: ${errCode(e)})`);
    }
  }

  /* ----------------------------- download ---------------------------- */
  // getProductDownload → { fileName, base64 } → Blob → saved under the same name
  function saveBase64(fileName, base64) {
    const bin = atob(base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'application/vnd.ms-excel.sheet.macroEnabled.12' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.style.display = 'none';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  async function download(id) {
    if (!auth() || !auth().currentUser) { open(id); return; }
    toast(t('preparing'));
    try {
      const res = await callable('getProductDownload')({ product: serverId(id) });
      const d = (res && res.data) || {};
      if (!d.base64) throw Object.assign(new Error('empty file'), { code: 'empty_file' });
      saveBase64(d.fileName || (serverId(id) + '.xlsm'), d.base64);
      hideToast();
    } catch (e) {
      const code = errCode(e);
      console.error('[purchase] getProductDownload failed:', e && e.code, e && e.message, e && e.details);
      if (code === 'permission-denied' || code === 'unauthenticated') {     // not bought yet → purchase window
        hideToast();
        if (S.owned[id]) { S.owned[id] = false; emit(); }
        open(id);
        return;
      }
      toast(`${t('err')} (${t('errCode')}: ${code})`);
    }
  }

  // Download button: signed-in buyers (paid = true) and admins download, everyone else gets the window
  async function act(id) {
    if (!auth() || !auth().currentUser) { open(id); return; }
    if (!canDownload(id)) await refresh();
    if (canDownload(id)) download(id); else open(id);
  }

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
  function hideToast() { const el = document.getElementById('pm-toast'); if (el) el.classList.remove('show'); clearTimeout(toastTimer); }

  // Notice that stays on screen (payment confirmation), with an optional button
  function notice(msg, { ok = false, busy = false, button = null } = {}) {
    let el = document.getElementById('pm-notice');
    if (!el) {
      el = document.createElement('div');
      el.id = 'pm-notice'; el.className = 'pm-notice'; el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite');
      el.innerHTML = '<span class="pm-notice-spin" aria-hidden="true"></span><span class="pm-notice-tx"></span><button type="button" class="pm-notice-btn"></button><button type="button" class="pm-notice-x" aria-label="✕">✕</button>';
      el.querySelector('.pm-notice-x').addEventListener('click', () => el.classList.remove('show'));
      document.body.appendChild(el);
    }
    el.setAttribute('dir', lang() === 'ar' ? 'rtl' : 'ltr');
    el.classList.toggle('ok', ok);
    el.classList.toggle('busy', busy);
    el.querySelector('.pm-notice-tx').textContent = msg;
    const b = el.querySelector('.pm-notice-btn');
    b.hidden = !button;
    if (button) { b.textContent = button.label; b.onclick = button.onClick; }
    el.classList.add('show');
  }

  // Back from Chargily: ?paid=<serverId>  or  ?payfail=1
  async function handleReturn() {
    const u = new URL(location.href);
    const paid = u.searchParams.get('paid');
    const fail = u.searchParams.get('payfail');
    if (!paid && !fail) return;
    u.searchParams.delete('paid'); u.searchParams.delete('payfail');
    try { history.replaceState(history.state, '', u.pathname + u.search + u.hash); } catch (e) {}
    if (!paid) { notice(t('failed')); return; }
    const p = Object.values(S.products).find(x => x.serverId === paid || x.id === paid);
    if (!p) return;
    notice(t('paidWait'), { busy: true });
    await ready;
    // the backend marks the purchase paid when Chargily confirms it (may take a few seconds)
    const ok = (S.owned[p.id] === true) || await waitForPaid(p.id, 90000);
    if (ok) notice(t('paidOk'), { ok: true, button: { label: t('downloadNow'), onClick: () => download(p.id) } });
    else notice(t('paidLate'));
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
