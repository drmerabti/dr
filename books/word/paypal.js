/* =====================================================================
   PayPal for the Word book: pay in USD, then download straight away.
   Server side (worker.js): /api/paypal/config, /api/paypal/create-order,
   /api/paypal/capture-order, /api/download/:token. The price always comes
   from the server catalog; this file never sends a price.
   The block (#ppBox) sits in the "ادفع بالدولار" window (#usdModal, opened
   by buy.js). The SDK is loaded with the page; the buttons are drawn the
   first time the window opens. If PayPal is not available the window says
   so and points to the dinar order.
===================================================================== */
(function(){
  var box = document.getElementById('ppBox');
  if (!box) return;
  var BOOK = box.getAttribute('data-book');
  /* merabti.com is on GitHub Pages: the API is on the Worker (data-api on #ppBox).
     On the Worker itself (*.workers.dev, e.g. the claude-test preview) or locally: same origin. */
  var SAME = /\.workers\.dev$/.test(location.hostname) || /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  var API = SAME ? '' : (box.getAttribute('data-api') || 'https://dr.merabti.workers.dev').replace(/\/$/, '');
  function abs(u){ return /^\//.test(u || '') ? API + u : u; }   /* "/api/download/…" → on the Worker */
  var STORE = 'pp-order-' + BOOK;
  var msgEl = document.getElementById('ppMsg');
  var modal = document.getElementById('usdModal');
  var usdSub = document.getElementById('payUsdSub');
  var btnsEl = document.getElementById('ppButtons');
  var sdkReady = false, sdkFailed = false, wantRender = false, rendered = false;

  function track(name, extra){
    try { if (window.gtag) gtag('event', name, Object.assign({ book: 'word', method: 'paypal' }, extra || {})); } catch (e) { /* ignore */ }
  }

  function msg(text, isErr){
    msgEl.textContent = text || '';
    msgEl.classList.toggle('err', !!isErr);
  }

  /* PayPal off or unreachable: say so in the window (the dinar order still works) */
  function unavailable(){
    sdkFailed = true;
    btnsEl.innerHTML = '';
    msg('الدفع بالدولار غير متاح حاليًا. يمكنك الطلب بالدينار، أو مراسلتنا على contact@merabti.com', true);
  }

  /* ---------- after payment: order number + download button ---------- */
  function showDone(d){
    document.getElementById('ppPay').hidden = true;
    document.getElementById('ppDone').hidden = false;
    document.getElementById('ppOrder').textContent = d.orderId;
    document.getElementById('ppDl').href = abs(d.downloadUrl);
    if (d.expiresAt){
      var until = new Date(d.expiresAt);
      var txt = 'الرابط صالح حتى ' + until.toLocaleDateString('ar-DZ', { day: 'numeric', month: 'long', year: 'numeric' }) +
        '، ويمكن التحميل حتى ' + (d.maxDownloads || 5) + ' مرات. احتفظ برقم الطلب.';
      document.getElementById('ppNote').textContent = txt;
    }
    if (usdSub) usdSub.textContent = 'تم الدفع ✓ — حمّل الكتاب من هنا';
  }

  function remember(d){
    try { localStorage.setItem(STORE, JSON.stringify({ orderId: d.orderId, downloadUrl: d.downloadUrl, expiresAt: d.expiresAt, maxDownloads: d.maxDownloads })); } catch (e) { /* ignore */ }
  }

  function remembered(){
    try {
      var d = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (d && d.downloadUrl && new Date(d.expiresAt) > new Date()) return d;
      localStorage.removeItem(STORE);
    } catch (e) { /* ignore */ }
    return null;
  }

  function post(url, body){
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function(r){
      return r.json().catch(function(){ return {}; }).then(function(d){ d._status = r.status; return d; });
    });
  }

  var saved = remembered();
  if (saved){ showDone(saved); return; }

  /* ---------- PayPal buttons (drawn once, when the window is first opened) ---------- */
  function maybeRender(){
    if (rendered || !sdkReady || !wantRender) return;
    rendered = true;
    btnsEl.innerHTML = '';
    render();
  }

  function render(){
    paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'pay', height: 42 },

      createOrder: function(){
        msg('');
        track('begin_checkout');
        return post(API + '/api/paypal/create-order', { bookId: BOOK }).then(function(d){
          if (!d.id) throw new Error(d.message || 'create-order failed');
          return d.id;
        });
      },

      onApprove: function(data, actions){
        box.classList.add('busy');
        msg('جارٍ تأكيد الدفع… لا تغلق الصفحة.');
        return post(API + '/api/paypal/capture-order', { orderId: data.orderID }).then(function(d){
          box.classList.remove('busy');
          if (d.error === 'INSTRUMENT_DECLINED'){ msg(d.message, true); return actions.restart(); }
          if (!d.ok){ msg(d.message || 'لم يكتمل الدفع. حاول مرة أخرى.', true); return; }
          msg('');
          remember(d);
          showDone(d);
          track('purchase', { transaction_id: d.orderId, currency: 'USD' });
        }).catch(function(){
          box.classList.remove('busy');
          msg('انقطع الاتصال أثناء تأكيد الدفع. إذا خُصم المبلغ راسلنا برقم الطلب: ' + data.orderID, true);
        });
      },

      onCancel: function(){ msg('أُلغي الدفع، يمكنك المحاولة مرة أخرى متى شئت.'); },

      onError: function(err){
        box.classList.remove('busy');
        msg('تعذّر إتمام الدفع عبر PayPal، حاول مرة أخرى أو اطلب الكتاب عبر البريد أو واتساب.', true);
        try { console.warn('PayPal', err); } catch (e) { /* ignore */ }
      }
    }).render('#ppButtons').catch(unavailable);
  }

  function loadSdk(cfg){
    var s = document.createElement('script');
    s.src = 'https://www.paypal.com/sdk/js?client-id=' + encodeURIComponent(cfg.clientId) +
      '&currency=' + encodeURIComponent(cfg.currency || 'USD') +
      '&intent=capture&components=buttons&disable-funding=paylater,venmo';
    s.async = true;
    s.onload = function(){
      if (window.paypal && paypal.Buttons){ sdkReady = true; maybeRender(); } else unavailable();
    };
    s.onerror = unavailable;
    document.head.appendChild(s);
  }

  function start(){
    fetch(API + '/api/paypal/config?bookId=' + encodeURIComponent(BOOK))
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(cfg){
        if (!cfg || !cfg.clientId){ unavailable(); return; }   /* PayPal off */
        document.getElementById('ppPrice').textContent = cfg.price;
        loadSdk(cfg);
      })
      .catch(unavailable);   /* e.g. a static preview without the worker */
  }

  if (modal) modal.addEventListener('pm:open', function(){
    wantRender = true;
    if (!sdkFailed) maybeRender();
  });

  /* SDK fetched after the page (and the preview's first pages) had their turn,
     so the window opens with the buttons ready */
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
})();
