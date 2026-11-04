/* =====================================================================
   PayPal for the Word book: pay in USD, then download straight away.
   Server side (worker.js): /api/paypal/config, /api/paypal/create-order,
   /api/paypal/capture-order, /api/download/:token. The price always comes
   from the server catalog; this file never sends a price.
   The block (#ppBox) stays hidden if PayPal is not available, so the
   e-mail / WhatsApp ordering keeps working as before.
===================================================================== */
(function(){
  var box = document.getElementById('ppBox');
  if (!box) return;
  var BOOK = box.getAttribute('data-book');
  var STORE = 'pp-order-' + BOOK;
  var msgEl = document.getElementById('ppMsg');
  var toPp = document.getElementById('toPp');

  function track(name, extra){
    try { if (window.gtag) gtag('event', name, Object.assign({ book: 'word', method: 'paypal' }, extra || {})); } catch (e) { /* ignore */ }
  }

  function msg(text, isErr){
    msgEl.textContent = text || '';
    msgEl.classList.toggle('err', !!isErr);
  }

  function show(){
    box.hidden = false;
    if (toPp) toPp.hidden = false;
  }

  /* ---------- after payment: order number + download button ---------- */
  function showDone(d){
    box.querySelector('.pp-info').hidden = true;
    document.getElementById('ppPay').hidden = true;
    document.getElementById('ppDone').hidden = false;
    document.getElementById('ppOrder').textContent = d.orderId;
    document.getElementById('ppDl').href = d.downloadUrl;
    if (d.expiresAt){
      var until = new Date(d.expiresAt);
      var txt = 'الرابط صالح حتى ' + until.toLocaleDateString('ar-DZ', { day: 'numeric', month: 'long', year: 'numeric' }) +
        '، ويمكن التحميل حتى ' + (d.maxDownloads || 5) + ' مرات. احتفظ برقم الطلب.';
      document.getElementById('ppNote').textContent = txt;
    }
    if (toPp) toPp.textContent = 'تم الدفع ✓ — حمّل الكتاب من هنا';
    show();
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

  /* link in the order box → the PayPal block */
  if (toPp) toPp.addEventListener('click', function(e){
    e.preventDefault();
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    box.classList.remove('flash');
    void box.offsetWidth;
    box.classList.add('flash');
    track('book_order_click');
  });

  var saved = remembered();
  if (saved){ showDone(saved); return; }

  /* ---------- PayPal buttons ---------- */
  function render(){
    paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'pay', height: 42 },

      createOrder: function(){
        msg('');
        track('begin_checkout');
        return post('/api/paypal/create-order', { bookId: BOOK }).then(function(d){
          if (!d.id) throw new Error(d.message || 'create-order failed');
          return d.id;
        });
      },

      onApprove: function(data, actions){
        box.classList.add('busy');
        msg('جارٍ تأكيد الدفع… لا تغلق الصفحة.');
        return post('/api/paypal/capture-order', { orderId: data.orderID }).then(function(d){
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
    }).render('#ppButtons').catch(function(){ box.hidden = true; if (toPp) toPp.hidden = true; });
  }

  function loadSdk(cfg){
    var s = document.createElement('script');
    s.src = 'https://www.paypal.com/sdk/js?client-id=' + encodeURIComponent(cfg.clientId) +
      '&currency=' + encodeURIComponent(cfg.currency || 'USD') +
      '&intent=capture&components=buttons&disable-funding=paylater,venmo';
    s.async = true;
    s.onload = function(){ if (window.paypal && paypal.Buttons) render(); };
    s.onerror = function(){ box.hidden = true; if (toPp) toPp.hidden = true; };
    document.head.appendChild(s);
  }

  function start(){
    fetch('/api/paypal/config?bookId=' + encodeURIComponent(BOOK))
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(cfg){
        if (!cfg || !cfg.clientId) return;          /* PayPal off: page stays as before */
        document.getElementById('ppPrice').textContent = cfg.price;
        show();
        loadSdk(cfg);
      })
      .catch(function(){ /* static preview without the worker: keep the block hidden */ });
  }

  /* after the page (and the preview's first pages) had their turn */
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
})();
