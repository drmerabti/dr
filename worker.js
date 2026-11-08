import { EmailMessage } from 'cloudflare:email';

/* =====================================================================
   الخادم الخلفي: يخدم ملفات الموقع كما هي، ويضيف مسارات API
   لأداة مولّد الاستبيان (إنشاء / جلب / إرسال إجابة / نتائج / بيانات خام).
===================================================================== */

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function uid() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 12);
}

async function ensureTables(db) {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS surveys (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      color TEXT,
      thanks_message TEXT,
      questions TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS responses (
      id TEXT PRIMARY KEY,
      survey_id TEXT NOT NULL,
      answers TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`),
  ]);
  // ترقية جداول قديمة أُنشئت قبل إضافة عمودي color و thanks_message
  try { await db.prepare(`ALTER TABLE surveys ADD COLUMN color TEXT`).run(); } catch (e) {}
  try { await db.prepare(`ALTER TABLE surveys ADD COLUMN thanks_message TEXT`).run(); } catch (e) {}
}

/* =====================================================================
   بيع الكتب عبر PayPal (الدولار) + التحميل من R2
   - السعر يأتي من BOOK_CATALOG هنا فقط، ولا يُقبل أي سعر من المتصفح.
   - PAYPAL_CLIENT_ID و PAYPAL_ENV في wrangler.jsonc، و PAYPAL_SECRET سرّ في لوحة Cloudflare.
   - الطلبات المدفوعة تُحفظ في D1 (paypal_orders) مع رمز تحميل عشوائي:
     صالح 7 أيام، و5 تحميلات كحد أقصى.
===================================================================== */
const BOOK_CATALOG = {
  'word-book': {
    title: 'حتى لو كنت من قوم ثمود ستفهم برنامج وورد',
    price: '6.00',
    currency: 'USD',
    file: 'Thamoud-Book.pdf',   // object at the root of the R2 bucket merabtibooks
  },
  // id = the book page's folder (books/<id>/), data-book on its #ppBox
  'bac-math-100': {
    title: 'بكالوريا — 100 تمرين نحو العشرين',
    price: '6.99',
    currency: 'USD',
    file: 'Bac-Math-100.pdf',
  },
  'excel-vba': {
    title: 'الإبداع مع Excel VBA',
    price: '7.99',
    currency: 'USD',
    file: 'Ibdaa-VBA.pdf',
  },
  'research': {
    title: 'من الفكرة إلى النشر',
    price: '7.99',
    currency: 'USD',
    file: 'IdeaToPub.pdf',
  },
  'excel-kingdom-1': {
    title: 'مملكة الخلايا — الجزء الأول',
    price: '6.99',
    currency: 'USD',
    file: 'Mamlaka-Excel.pdf',
  },
  'excel-kingdom-2': {
    title: 'مملكة الخلايا — الجزء الثاني',
    price: '6.99',
    currency: 'USD',
    file: 'Mamlaka-Excel-2.pdf',
  },
  'excel-shortcuts': {
    title: 'الفأرة أكلها القط',
    price: '4.99',
    currency: 'USD',
    file: 'Mouse-Excel.pdf',
  },
  'shortcuts-wiki': {
    title: 'موسوعة الاختصارات',
    price: '4.99',
    currency: 'USD',
    file: 'Wiki-Shortcuts.pdf',
  },
  'macbook-shortcuts': {
    title: 'كل اختصارات ماكبوك في مكان واحد',
    price: '7.99',
    currency: 'USD',
    file: 'mac-shortcuts.pdf',
  },
};
const CONTACT_EMAIL = 'contact@merabti.com';

/* merabti.com is served by GitHub Pages; its book pages call this Worker
   (https://dr.merabti.workers.dev) from the browser. CORS: only these origins. */
const CORS_ORIGINS = ['https://merabti.com', 'https://www.merabti.com', 'https://claude-test-dr.merabti.workers.dev'];

function corsHeaders(request) {
  const origin = request.headers.get('Origin');
  const h = { Vary: 'Origin' };
  if (origin && CORS_ORIGINS.includes(origin)) h['Access-Control-Allow-Origin'] = origin;
  return h;
}

function withCors(request, res) {
  const h = new Headers(res.headers);
  for (const [k, v] of Object.entries(corsHeaders(request))) h.set(k, v);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}

function corsPreflight(request) {
  const h = corsHeaders(request);
  if (!h['Access-Control-Allow-Origin']) return new Response(null, { status: 403, headers: h });
  return new Response(null, { status: 204, headers: Object.assign(h, {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }) });
}
const DOWNLOAD_DAYS = 7;
const MAX_DOWNLOADS = 5;

function paypalApi(env) {
  return env.PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
}

function toCents(v) {
  return Math.round(parseFloat(v) * 100);
}

function randomToken() {
  const b = new Uint8Array(32);
  crypto.getRandomValues(b);
  return Array.from(b, x => x.toString(16).padStart(2, '0')).join('');
}

async function readJson(request) {
  try { return await request.json(); } catch (e) { return {}; }
}

async function paypalAccessToken(env) {
  const res = await fetch(paypalApi(env) + '/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + btoa(env.PAYPAL_CLIENT_ID + ':' + env.PAYPAL_SECRET),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) {
    // e.g. 401 invalid_client = wrong PAYPAL_SECRET / client ID, or sandbox vs live mismatch
    const text = await res.text().catch(() => '');
    let err = {};
    try { err = JSON.parse(text); } catch (e) {}
    logPaypal('oauth-token FAILED', { status: res.status, debugId: res.headers.get('paypal-debug-id'),
      error: err.error || null, description: err.error_description || null });
    throw new Error('PayPal auth failed: ' + res.status);
  }
  return (await res.json()).access_token;
}

/* One JSON line per PayPal call: step, order ID, status and, on failure, PayPal's error
   fields only. Never the payer (name, e-mail, address) nor the full response.
   Read them in Cloudflare: Workers & Pages → dr → Observability (search "[paypal]"). */
function logPaypal(step, info) {
  console.log('[paypal] ' + step + ' ' + JSON.stringify(Object.assign({ step }, info)));
}

/* PayPal error body → its error fields (name, message, issue, description, debug_id) */
function paypalError(data) {
  data = data || {};
  return {
    name: data.name || data.error || null,
    message: data.message || data.error_description || null,
    debug_id: data.debug_id || null,
    details: (data.details || []).map(d => ({ issue: d.issue || null, description: d.description || null, field: d.field || null })),
  };
}

/* order → what is needed to follow a payment, nothing about the buyer */
function orderSummary(order) {
  order = order || {};
  const unit = (order.purchase_units || [])[0] || {};
  const capture = ((unit.payments || {}).captures || [])[0] || {};
  return {
    orderId: order.id || null,
    orderStatus: order.status || null,
    bookId: unit.reference_id || null,
    captureId: capture.id || null,
    captureStatus: capture.status || null,
    captureReason: (capture.status_details && capture.status_details.reason) || null,
    amount: capture.amount ? capture.amount.value + ' ' + capture.amount.currency_code : null,
  };
}

async function paypalCall(env, method, apiPath, body, extraHeaders) {
  const token = await paypalAccessToken(env);
  const res = await fetch(paypalApi(env) + apiPath, {
    method,
    headers: Object.assign({ Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, extraHeaders || {}),
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text().catch(() => '');
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch (e) { data = { raw: text }; }
  const debugId = res.headers.get('paypal-debug-id');
  return { ok: res.ok, status: res.status, data, debugId, method, path: apiPath };
}

let paypalEnvColumnChecked = false;

async function ensurePaypalTables(db) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS paypal_orders (
    order_id TEXT PRIMARY KEY,
    book_id TEXT NOT NULL,
    buyer_email TEXT,
    amount TEXT NOT NULL,
    currency TEXT NOT NULL,
    capture_id TEXT,
    created_at TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    downloads INTEGER NOT NULL DEFAULT 0,
    env TEXT
  )`).run();
  // tables made before the "env" column (sandbox / live) existed: add it once per isolate
  if (!paypalEnvColumnChecked) {
    paypalEnvColumnChecked = true;
    try { await db.prepare(`ALTER TABLE paypal_orders ADD COLUMN env TEXT`).run(); } catch (e) { /* already there */ }
  }
}

function orderReply(row, origin) {
  return json({
    ok: true,
    orderId: row.order_id,
    bookId: row.book_id,
    // full URL on the Worker: the page itself may be on GitHub Pages (merabti.com)
    downloadUrl: origin + '/api/download/' + row.token,
    expiresAt: row.expires_at,
    maxDownloads: MAX_DOWNLOADS,
    downloadsLeft: Math.max(0, MAX_DOWNLOADS - row.downloads),
  });
}

/* صفحة عربية بسيطة لأخطاء رابط التحميل (يفتحه المشتري في المتصفح) */
function downloadError(status, title, text) {
  const html = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>${title}</title></head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#F2F6F9;font-family:Tahoma,Arial,sans-serif;color:#13283A">
<div style="max-width:440px;margin:16px;padding:28px 24px;background:#fff;border-radius:18px;box-shadow:0 10px 28px rgba(19,40,58,.1);text-align:center;line-height:1.8">
<h1 style="font-size:1.25rem;margin:0 0 8px">${title}</h1><p style="margin:0 0 16px;color:#5A6C7E">${text}</p>
<a href="mailto:${CONTACT_EMAIL}" dir="ltr" style="color:#1D5C78;font-weight:700;white-space:nowrap;unicode-bidi:isolate">${CONTACT_EMAIL}</a></div></body></html>`;
  return new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
  });
}

/* =====================================================================
   E-mail alert when a payment or a download fails (Cloudflare Email Routing,
   send_email binding ALERT_EMAIL in wrangler.jsonc). One e-mail per key, kept in
   D1 (paypal_alerts): the PayPal order ID, or — when there is no order yet
   (create-order / server error) — book + error + hour. Never blocks the reply.
===================================================================== */
const ALERT_FROM = 'alerts@merabti.com';
const ALERT_TO = 'merabti.soufiane1@gmail.com';   // = destination_address of ALERT_EMAIL
const ALERT_SUBJECT = '⚠️ فشل دفع على موقع merabti.com';

function b64utf8(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function hourKey() {
  return new Date().toISOString().slice(0, 13);   // 2026-11-05T14
}

function alertBody(a) {
  const now = new Date();
  const dz = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Algiers', dateStyle: 'short', timeStyle: 'medium' }).format(now);
  const book = BOOK_CATALOG[a.bookId];
  return [
    ALERT_SUBJECT,
    '',
    'ما الذي فشل: ' + a.what,
    'الكتاب: ' + (book ? book.title + ' (' + a.bookId + ')' : (a.bookId || 'غير معروف')),
    'السعر: ' + (book ? book.price + ' ' + book.currency : 'غير معروف'),
    'رقم طلب PayPal: ' + (a.orderId || 'لا يوجد (لم يُنشأ الطلب)'),
    'الخطأ (issue): ' + (a.issue || 'غير معروف'),
    'debugId: ' + (a.debugId || 'غير معروف'),
    'رمز HTTP: ' + (a.status || '-'),
    'التاريخ والوقت: ' + dz + ' (توقيت الجزائر) — ' + now.toISOString() + ' UTC',
    'بريد المشتري: ' + (a.buyerEmail || 'غير معروف'),
    'البيئة: ' + (a.env || 'sandbox'),
    '',
    '—',
    'رسالة تلقائية من الـ Worker «dr». رسالة واحدة فقط لكل طلب' + (a.orderId ? '.' : ' (وبدون رقم طلب: رسالة واحدة في الساعة لكل كتاب ونوع خطأ).'),
    'التفاصيل في Cloudflare → Workers & Pages → dr → Observability (ابحث عن [paypal]).',
  ].join('\r\n');
}

async function sendAlert(env, key, a) {
  try {
    if (!env.ALERT_EMAIL) { logPaypal('alert SKIPPED (no ALERT_EMAIL binding)', { key }); return; }
    await env.DB.prepare(`CREATE TABLE IF NOT EXISTS paypal_alerts (alert_key TEXT PRIMARY KEY, created_at TEXT NOT NULL)`).run();
    const ins = await env.DB.prepare(`INSERT OR IGNORE INTO paypal_alerts (alert_key, created_at) VALUES (?, ?)`)
      .bind(key, new Date().toISOString()).run();
    if (!ins.meta || ins.meta.changes !== 1) { logPaypal('alert already sent', { key }); return; }

    // a failed capture says nothing about the book or the buyer: ask PayPal once (only for the first alert)
    if (a.lookupOrder && a.orderId && (!a.bookId || !a.buyerEmail)) {
      try {
        const g = await paypalCall(env, 'GET', '/v2/checkout/orders/' + a.orderId);
        if (g.ok) {
          const unit = (g.data.purchase_units || [])[0] || {};
          a.bookId = a.bookId || unit.reference_id || '';
          a.buyerEmail = a.buyerEmail || (g.data.payer && g.data.payer.email_address) || '';
        }
      } catch (e) { /* keep what we have */ }
    }

    const raw = [
      'From: "merabti.com" <' + ALERT_FROM + '>',
      'To: <' + ALERT_TO + '>',
      'Subject: =?UTF-8?B?' + b64utf8(ALERT_SUBJECT) + '?=',
      'Date: ' + new Date().toUTCString(),
      'Message-ID: <' + crypto.randomUUID() + '@merabti.com>',
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: base64',
      '',
      b64utf8(alertBody(a)).replace(/.{76}/g, '$&\r\n'),
    ].join('\r\n');
    try {
      await env.ALERT_EMAIL.send(new EmailMessage(ALERT_FROM, ALERT_TO, raw));
      logPaypal('alert SENT', { key, orderId: a.orderId || null });
    } catch (e) {
      // not sent: forget the key so the next failure can try again
      await env.DB.prepare(`DELETE FROM paypal_alerts WHERE alert_key = ?`).bind(key).run();
      logPaypal('alert FAILED to send', { key, error: String(e && e.message || e) });
    }
  } catch (e) {
    logPaypal('alert error', { key, error: String(e && e.message || e) });
  }
}

function alertLater(ctx, env, key, a) {
  const job = sendAlert(env, key, Object.assign({ env: env.PAYPAL_ENV }, a));
  if (ctx && ctx.waitUntil) ctx.waitUntil(job);
}

async function handlePaypal(request, env, path, ctx) {
  // ============ إعدادات الواجهة: client ID العام والسعر من الكتالوج ============
  if (path === '/api/paypal/config' && request.method === 'GET') {
    const bookId = new URL(request.url).searchParams.get('bookId') || '';
    const book = BOOK_CATALOG[bookId];
    if (!book) return json({ error: 'UNKNOWN_BOOK' }, 404);
    if (!env.PAYPAL_CLIENT_ID) return json({ error: 'PAYPAL_NOT_CONFIGURED' }, 503);
    // never take a payment for a file that is not in R2: no file → no PayPal buttons
    const file = env.BOOKS ? await env.BOOKS.head(book.file) : null;
    if (!file) {
      logPaypal('config FILE MISSING', { bookId, file: book.file, bucketBound: !!env.BOOKS });
      return json({ error: 'FILE_MISSING', file: book.file }, 503);
    }
    return json({ clientId: env.PAYPAL_CLIENT_ID, env: env.PAYPAL_ENV || 'sandbox', price: book.price, currency: book.currency,
      file: book.file, fileFound: true, fileSize: file.size });
  }

  if (path.startsWith('/api/paypal/') && (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_SECRET)) {
    return json({ error: 'PAYPAL_NOT_CONFIGURED', message: 'الدفع عبر PayPal غير مُفعّل حاليًا.' }, 503);
  }

  // ============ إنشاء طلب PayPal (السعر من الكتالوج فقط) ============
  if (path === '/api/paypal/create-order' && request.method === 'POST') {
    const body = await readJson(request);
    const bookId = String(body.bookId || '');
    const book = BOOK_CATALOG[bookId];
    if (!book) return json({ error: 'UNKNOWN_BOOK', message: 'الكتاب غير موجود.' }, 400);
    const r = await paypalCall(env, 'POST', '/v2/checkout/orders', {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: bookId,
        custom_id: bookId,
        description: book.title.slice(0, 120),
        amount: { currency_code: book.currency, value: book.price },
      }],
      application_context: { shipping_preference: 'NO_SHIPPING', user_action: 'PAY_NOW', brand_name: 'merabti.com' },
    });
    logPaypal(r.ok && r.data.id ? 'create-order ok' : 'create-order FAILED', {
      env: env.PAYPAL_ENV, bookId, method: r.method, path: r.path, status: r.status, debugId: r.debugId,
      orderId: r.data.id || null, orderStatus: r.data.status || null,
      error: r.ok && r.data.id ? null : paypalError(r.data),
    });
    if (!r.ok || !r.data.id) {
      const cIssue = (r.data.details && r.data.details[0] && r.data.details[0].issue) || r.data.name || null;
      alertLater(ctx, env, 'create:' + bookId + ':' + (cIssue || r.status) + ':' + hourKey(), {
        what: 'إنشاء الطلب (create-order)', bookId, issue: cIssue, debugId: r.debugId, status: r.status,
      });
      return json({ error: 'CREATE_FAILED', message: 'تعذّر إنشاء الطلب، حاول مرة أخرى.',
        paypalStatus: r.status, issue: (r.data.details && r.data.details[0] && r.data.details[0].issue) || r.data.name || null,
        debugId: r.debugId || null }, 502);
    }
    return json({ id: r.data.id });
  }

  // ============ تأكيد الدفع (capture) + الحفظ في D1 + رمز التحميل ============
  if (path === '/api/paypal/capture-order' && request.method === 'POST') {
    const body = await readJson(request);
    const orderId = String(body.orderId || '');
    if (!/^[A-Z0-9]{8,32}$/.test(orderId)) return json({ error: 'BAD_ORDER', message: 'رقم الطلب غير صالح.' }, 400);

    await ensurePaypalTables(env.DB);
    const saved = await env.DB.prepare(`SELECT * FROM paypal_orders WHERE order_id = ?`).bind(orderId).first();
    if (saved) return orderReply(saved, new URL(request.url).origin);   // طلب مؤكَّد من قبل (إعادة محاولة أو نقرة مزدوجة)

    let r = await paypalCall(env, 'POST', '/v2/checkout/orders/' + orderId + '/capture', null,
      { 'PayPal-Request-Id': 'capture-' + orderId });
    const issue = r.data && r.data.details && r.data.details[0] && r.data.details[0].issue;
    // order ID + status; on failure PayPal's error fields (name, message, details[].issue, debug_id)
    logPaypal(r.ok ? 'capture-order ok' : 'capture-order FAILED', {
      env: env.PAYPAL_ENV, orderId, status: r.status, debugId: r.debugId,
      issue: issue || null, order: r.ok ? orderSummary(r.data) : null, error: r.ok ? null : paypalError(r.data),
    });
    if (!r.ok && issue === 'ORDER_ALREADY_CAPTURED') {
      r = await paypalCall(env, 'GET', '/v2/checkout/orders/' + orderId);
      logPaypal('get-order (already captured)', {
        env: env.PAYPAL_ENV, orderId, status: r.status, debugId: r.debugId,
        order: r.ok ? orderSummary(r.data) : null, error: r.ok ? null : paypalError(r.data),
      });
    } else if (!r.ok) {
      alertLater(ctx, env, 'order:' + orderId, {
        what: issue === 'INSTRUMENT_DECLINED' ? 'تأكيد الدفع (capture-order): رُفضت وسيلة الدفع' : 'تأكيد الدفع (capture-order)',
        orderId, issue: issue || (r.data && r.data.name) || null, debugId: r.debugId, status: r.status, lookupOrder: true,
      });
      if (issue === 'INSTRUMENT_DECLINED') {
        return json({ error: 'INSTRUMENT_DECLINED', message: 'رُفضت وسيلة الدفع، اختر وسيلة أخرى.' }, 402);
      }
      return json({ error: 'CAPTURE_FAILED', message: 'لم يكتمل الدفع، لم يُخصم أي مبلغ. حاول مرة أخرى.',
        paypalStatus: r.status, issue: issue || null, debugId: r.debugId || null }, 502);
    }

    const order = r.data || {};
    const unit = (order.purchase_units || [])[0] || {};
    const capture = ((unit.payments || {}).captures || [])[0] || {};
    const bookId = unit.reference_id || unit.custom_id || capture.custom_id || '';
    const book = BOOK_CATALOG[bookId];
    const amount = capture.amount || {};

    if (order.status !== 'COMPLETED' || capture.status !== 'COMPLETED') {
      logPaypal('capture-order NOT COMPLETED', { env: env.PAYPAL_ENV, orderId, order: orderSummary(order) });
      alertLater(ctx, env, 'order:' + orderId, {
        what: 'تأكيد الدفع (capture-order): الدفع لم يكتمل — order ' + (order.status || '?') + ' / capture ' + (capture.status || '?'),
        orderId, bookId, issue: (capture.status_details && capture.status_details.reason) || capture.status || order.status || null,
        debugId: r.debugId, status: r.status, buyerEmail: (order.payer && order.payer.email_address) || '',
      });
      return json({
        error: 'NOT_COMPLETED',
        message: capture.status === 'PENDING'
          ? 'الدفع قيد المراجعة لدى PayPal. سيصلك الكتاب بعد اكتماله، راسلنا برقم الطلب: ' + orderId
          : 'لم يكتمل الدفع. حاول مرة أخرى.',
      }, 402);
    }
    if (!book || amount.currency_code !== book.currency || toCents(amount.value) !== toCents(book.price)) {
      logPaypal('capture-order AMOUNT MISMATCH', { env: env.PAYPAL_ENV, orderId, bookId, amount, expected: book ? book.price + ' ' + book.currency : null });
      alertLater(ctx, env, 'order:' + orderId, {
        what: 'تأكيد الدفع (capture-order): المبلغ المدفوع ' + (amount.value || '?') + ' ' + (amount.currency_code || '') + ' لا يطابق السعر',
        orderId, bookId, issue: 'AMOUNT_MISMATCH', debugId: r.debugId, status: r.status,
        buyerEmail: (order.payer && order.payer.email_address) || '',
      });
      return json({ error: 'AMOUNT_MISMATCH', message: 'المبلغ المدفوع لا يطابق سعر الكتاب. راسلنا برقم الطلب: ' + orderId }, 400);
    }

    const now = new Date();
    const expires = new Date(now.getTime() + DOWNLOAD_DAYS * 24 * 3600 * 1000);
    const email = (order.payer && order.payer.email_address) || '';
    await env.DB.prepare(
      `INSERT OR IGNORE INTO paypal_orders (order_id, book_id, buyer_email, amount, currency, capture_id, created_at, token, expires_at, downloads, env)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`
    ).bind(orderId, bookId, email, amount.value, amount.currency_code, capture.id || '',
      now.toISOString(), randomToken(), expires.toISOString(), env.PAYPAL_ENV === 'live' ? 'live' : 'sandbox').run();
    const row = await env.DB.prepare(`SELECT * FROM paypal_orders WHERE order_id = ?`).bind(orderId).first();
    return orderReply(row, new URL(request.url).origin);
  }

  // ============ تحميل الكتاب من R2 برمز التحميل ============
  const dl = path.match(/^\/api\/download\/([a-f0-9]{64})$/);
  if (dl && (request.method === 'GET' || request.method === 'HEAD')) {
    await ensurePaypalTables(env.DB);
    const row = await env.DB.prepare(`SELECT * FROM paypal_orders WHERE token = ?`).bind(dl[1]).first();
    if (!row) return downloadError(404, 'رابط التحميل غير صحيح', 'تأكّد من الرابط، أو راسلنا برقم الطلب.');
    const nowIso = new Date().toISOString();
    if (row.expires_at <= nowIso) {
      alertLater(ctx, env, 'download:' + row.order_id, { what: 'تحميل الكتاب: انتهت صلاحية الرابط (' + DOWNLOAD_DAYS + ' أيام)', orderId: row.order_id, bookId: row.book_id, issue: 'LINK_EXPIRED', buyerEmail: row.buyer_email || '' });
      return downloadError(410, 'انتهت صلاحية الرابط', 'رابط التحميل صالح ' + DOWNLOAD_DAYS + ' أيام فقط. راسلنا برقم الطلب ' + row.order_id + ' لنرسل لك رابطًا جديدًا.');
    }
    if (row.downloads >= MAX_DOWNLOADS) {
      alertLater(ctx, env, 'download:' + row.order_id, { what: 'تحميل الكتاب: استُنفد عدد التحميلات (' + MAX_DOWNLOADS + ')', orderId: row.order_id, bookId: row.book_id, issue: 'DOWNLOAD_LIMIT_REACHED', buyerEmail: row.buyer_email || '' });
      return downloadError(410, 'استُنفد عدد التحميلات', 'يمكن تحميل الكتاب ' + MAX_DOWNLOADS + ' مرات فقط. راسلنا برقم الطلب ' + row.order_id + '.');
    }
    const book = BOOK_CATALOG[row.book_id];
    const headers = {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${book.file}"`,
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex',
    };
    if (request.method === 'HEAD') {   // لا يُحتسب تحميلًا
      const head = await env.BOOKS.head(book.file);
      if (!head) {
        alertLater(ctx, env, 'download:' + row.order_id, { what: 'تحميل الكتاب: الملف غير موجود في R2 (' + book.file + ')', orderId: row.order_id, bookId: row.book_id, issue: 'R2_FILE_MISSING', buyerEmail: row.buyer_email || '' });
        return downloadError(500, 'الملف غير متاح مؤقتًا', 'حدث خطأ من جهتنا، راسلنا برقم الطلب ' + row.order_id + '.');
      }
      return new Response(null, { headers: Object.assign({ 'Content-Length': String(head.size) }, headers) });
    }
    const obj = await env.BOOKS.get(book.file);
    if (!obj) {
      console.log('R2 object missing', book.file);
      alertLater(ctx, env, 'download:' + row.order_id, { what: 'تحميل الكتاب: الملف غير موجود في R2 (' + book.file + ')', orderId: row.order_id, bookId: row.book_id, issue: 'R2_FILE_MISSING', buyerEmail: row.buyer_email || '' });
      return downloadError(500, 'الملف غير متاح مؤقتًا', 'حدث خطأ من جهتنا، راسلنا برقم الطلب ' + row.order_id + '.');
    }
    // العدّ ذرّي: لا يتجاوز الحد حتى مع طلبات متزامنة
    const upd = await env.DB.prepare(
      `UPDATE paypal_orders SET downloads = downloads + 1 WHERE token = ? AND downloads < ? AND expires_at > ?`
    ).bind(dl[1], MAX_DOWNLOADS, nowIso).run();
    if (!upd.meta || upd.meta.changes !== 1) {
      try { await obj.body.cancel(); } catch (e) {}
      alertLater(ctx, env, 'download:' + row.order_id, { what: 'تحميل الكتاب: استُنفد عدد التحميلات (' + MAX_DOWNLOADS + ')', orderId: row.order_id, bookId: row.book_id, issue: 'DOWNLOAD_LIMIT_REACHED', buyerEmail: row.buyer_email || '' });
      return downloadError(410, 'استُنفد عدد التحميلات', 'راسلنا برقم الطلب ' + row.order_id + '.');
    }
    return new Response(obj.body, { headers: Object.assign({ 'Content-Length': String(obj.size) }, headers) });
  }

  return null;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // ============ PayPal + تحميل الكتب ============
    if (path.startsWith('/api/paypal/') || path.startsWith('/api/download/')) {
      if (request.method === 'OPTIONS') return corsPreflight(request);
      const reqCopy = request.method === 'POST' ? request.clone() : null;   // for the alert if something throws
      let res;
      try {
        res = await handlePaypal(request, env, path, ctx);
      } catch (e) {
        console.log('[paypal] route error ' + path + ' ' + (e && e.stack || e));
        if (path === '/api/paypal/create-order' || path === '/api/paypal/capture-order' || path.startsWith('/api/download/')) {
          const sent = reqCopy ? await readJson(reqCopy) : {};
          const errOrder = /^[A-Z0-9]{8,32}$/.test(String(sent.orderId || '')) ? String(sent.orderId) : '';
          const errBook = BOOK_CATALOG[sent.bookId] ? String(sent.bookId) : '';
          // one per order; without an order, one per route + book and hour (the message can differ every time)
          alertLater(ctx, env, errOrder ? 'order:' + errOrder
            : 'server:' + path.replace(/[a-f0-9]{64}$/, 'token') + ':' + errBook + ':' + hourKey(), {
            what: 'خطأ في الخادم (' + path.replace(/[a-f0-9]{64}$/, '…') + ')', orderId: errOrder, bookId: errBook,
            issue: String(e && e.message || e).slice(0, 200),
          });
        }
        res = json({ error: 'SERVER_ERROR', message: 'حدث خطأ في الخادم، حاول مرة أخرى.' }, 500);
      }
      return withCors(request, res || json({ error: 'NOT_FOUND' }, 404));
    }

    // ============ إنشاء استبيان ============
    if (path === '/api/surveys' && request.method === 'POST') {
      await ensureTables(env.DB);
      const body = await request.json();
      if (!body.title || !Array.isArray(body.questions) || body.questions.length === 0) {
        return json({ error: 'بيانات ناقصة' }, 400);
      }
      const id = uid();
      await env.DB.prepare(
        `INSERT INTO surveys (id, title, description, color, thanks_message, questions, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        id, body.title, body.description || '', body.color || '#2F5770',
        body.thanksMessage || '', JSON.stringify(body.questions), new Date().toISOString()
      ).run();
      return json({ id });
    }

    // ============ تحديث استبيان موجود ============
    const updMatch = path.match(/^\/api\/surveys\/([a-zA-Z0-9]+)$/);
    if (updMatch && request.method === 'PUT') {
      await ensureTables(env.DB);
      const body = await request.json();
      await env.DB.prepare(
        `UPDATE surveys SET title=?, description=?, color=?, thanks_message=?, questions=? WHERE id=?`
      ).bind(
        body.title, body.description || '', body.color || '#2F5770',
        body.thanksMessage || '', JSON.stringify(body.questions), updMatch[1]
      ).run();
      return json({ ok: true });
    }

    // ============ جلب استبيان ============
    if (updMatch && request.method === 'GET') {
      await ensureTables(env.DB);
      const row = await env.DB.prepare(`SELECT * FROM surveys WHERE id = ?`).bind(updMatch[1]).first();
      if (!row) return json({ error: 'غير موجود' }, 404);
      return json({
        id: row.id, title: row.title, description: row.description,
        color: row.color || '#2F5770', thanksMessage: row.thanks_message || '',
        questions: JSON.parse(row.questions),
      });
    }

    // ============ حذف استبيان ============
    if (updMatch && request.method === 'DELETE') {
      await ensureTables(env.DB);
      await env.DB.prepare(`DELETE FROM surveys WHERE id = ?`).bind(updMatch[1]).run();
      await env.DB.prepare(`DELETE FROM responses WHERE survey_id = ?`).bind(updMatch[1]).run();
      return json({ ok: true });
    }

    // ============ إرسال إجابة (يرجع رقم المستجيب) ============
    const respMatch = path.match(/^\/api\/surveys\/([a-zA-Z0-9]+)\/responses$/);
    if (respMatch && request.method === 'POST') {
      await ensureTables(env.DB);
      const body = await request.json();
      const survey = await env.DB.prepare(`SELECT id FROM surveys WHERE id = ?`).bind(respMatch[1]).first();
      if (!survey) return json({ error: 'الاستبيان غير موجود' }, 404);
      await env.DB.prepare(
        `INSERT INTO responses (id, survey_id, answers, created_at) VALUES (?, ?, ?, ?)`
      ).bind(uid(), respMatch[1], JSON.stringify(body.answers || {}), new Date().toISOString()).run();
      const countRow = await env.DB.prepare(
        `SELECT COUNT(*) as c FROM responses WHERE survey_id = ?`
      ).bind(respMatch[1]).first();
      return json({ ok: true, respondentNumber: countRow.c });
    }

    // ============ ملخص النتائج (تكرارات جاهزة) ============
    const resultsMatch = path.match(/^\/api\/surveys\/([a-zA-Z0-9]+)\/results$/);
    if (resultsMatch && request.method === 'GET') {
      await ensureTables(env.DB);
      const survey = await env.DB.prepare(`SELECT * FROM surveys WHERE id = ?`).bind(resultsMatch[1]).first();
      if (!survey) return json({ error: 'غير موجود' }, 404);
      const questions = JSON.parse(survey.questions);
      const { results: rows } = await env.DB.prepare(
        `SELECT answers FROM responses WHERE survey_id = ?`
      ).bind(resultsMatch[1]).all();

      const totalResponses = rows.length;
      const tally = {};
      questions.forEach(q => { tally[q.id] = {}; });
      const textAnswers = {};

      rows.forEach(r => {
        const answers = JSON.parse(r.answers);
        questions.forEach(q => {
          const val = answers[q.id];
          if (val === undefined || val === null || val === '') return;
          if (q.type === 'checkbox' && Array.isArray(val)) {
            val.forEach(v => { tally[q.id][v] = (tally[q.id][v] || 0) + 1; });
          } else if (['radio', 'dropdown', 'yesno', 'rating'].includes(q.type)) {
            tally[q.id][val] = (tally[q.id][val] || 0) + 1;
          } else {
            (textAnswers[q.id] = textAnswers[q.id] || []).push(val);
          }
        });
      });

      return json({
        title: survey.title, description: survey.description,
        color: survey.color || '#2F5770', totalResponses,
        questions: questions.map(q => ({
          id: q.id, title: q.title, type: q.type, section: q.section || null,
          tally: tally[q.id], textAnswers: textAnswers[q.id] || [],
        })),
      });
    }

    // ============ بيانات خام (للتصدير والإحصاء المتقدم) ============
    const rawMatch = path.match(/^\/api\/surveys\/([a-zA-Z0-9]+)\/raw$/);
    if (rawMatch && request.method === 'GET') {
      await ensureTables(env.DB);
      const survey = await env.DB.prepare(`SELECT * FROM surveys WHERE id = ?`).bind(rawMatch[1]).first();
      if (!survey) return json({ error: 'غير موجود' }, 404);
      const { results: rows } = await env.DB.prepare(
        `SELECT answers, created_at FROM responses WHERE survey_id = ? ORDER BY created_at ASC`
      ).bind(rawMatch[1]).all();
      return json({
        title: survey.title,
        questions: JSON.parse(survey.questions),
        responses: rows.map(r => ({ answers: JSON.parse(r.answers), created_at: r.created_at })),
      });
    }

    // ============ الرابط القديم لصفحة الكتب (services) ← /books ============
    if (path === '/services' || path === '/services/' || path === '/services.html') {
      return Response.redirect(url.origin + '/books' + url.search, 301);
    }

    // ============ خلاف ذلك: خدمة ملفات الموقع كما هي ============
    return env.ASSETS.fetch(request);
  },
};
