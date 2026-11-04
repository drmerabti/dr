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
    file: 'Thmoud-Book.pdf',
  },
};
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
  if (!res.ok) throw new Error('PayPal auth failed: ' + res.status);
  return (await res.json()).access_token;
}

async function paypalCall(env, method, apiPath, body, extraHeaders) {
  const token = await paypalAccessToken(env);
  const res = await fetch(paypalApi(env) + apiPath, {
    method,
    headers: Object.assign({ Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, extraHeaders || {}),
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = {};
  try { data = await res.json(); } catch (e) {}
  return { ok: res.ok, status: res.status, data };
}

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
    downloads INTEGER NOT NULL DEFAULT 0
  )`).run();
}

function orderReply(row) {
  return json({
    ok: true,
    orderId: row.order_id,
    bookId: row.book_id,
    downloadUrl: '/api/download/' + row.token,
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
<a href="mailto:contact@merabti.com" style="color:#1D5C78;font-weight:700">contact@merabti.com</a></div></body></html>`;
  return new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
  });
}

async function handlePaypal(request, env, path) {
  // ============ إعدادات الواجهة: client ID العام والسعر من الكتالوج ============
  if (path === '/api/paypal/config' && request.method === 'GET') {
    const bookId = new URL(request.url).searchParams.get('bookId') || '';
    const book = BOOK_CATALOG[bookId];
    if (!book) return json({ error: 'UNKNOWN_BOOK' }, 404);
    if (!env.PAYPAL_CLIENT_ID) return json({ error: 'PAYPAL_NOT_CONFIGURED' }, 503);
    return json({ clientId: env.PAYPAL_CLIENT_ID, env: env.PAYPAL_ENV || 'sandbox', price: book.price, currency: book.currency });
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
    if (!r.ok || !r.data.id) {
      console.log('create-order failed', r.status, JSON.stringify(r.data));
      return json({ error: 'CREATE_FAILED', message: 'تعذّر إنشاء الطلب، حاول مرة أخرى.' }, 502);
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
    if (saved) return orderReply(saved);   // طلب مؤكَّد من قبل (إعادة محاولة أو نقرة مزدوجة)

    let r = await paypalCall(env, 'POST', '/v2/checkout/orders/' + orderId + '/capture', null,
      { 'PayPal-Request-Id': 'capture-' + orderId });
    const issue = r.data && r.data.details && r.data.details[0] && r.data.details[0].issue;
    if (!r.ok && issue === 'ORDER_ALREADY_CAPTURED') {
      r = await paypalCall(env, 'GET', '/v2/checkout/orders/' + orderId);
    } else if (!r.ok) {
      console.log('capture failed', r.status, JSON.stringify(r.data));
      if (issue === 'INSTRUMENT_DECLINED') {
        return json({ error: 'INSTRUMENT_DECLINED', message: 'رُفضت وسيلة الدفع، اختر وسيلة أخرى.' }, 402);
      }
      return json({ error: 'CAPTURE_FAILED', message: 'لم يكتمل الدفع، لم يُخصم أي مبلغ. حاول مرة أخرى.' }, 502);
    }

    const order = r.data || {};
    const unit = (order.purchase_units || [])[0] || {};
    const capture = ((unit.payments || {}).captures || [])[0] || {};
    const bookId = unit.reference_id || unit.custom_id || capture.custom_id || '';
    const book = BOOK_CATALOG[bookId];
    const amount = capture.amount || {};

    if (order.status !== 'COMPLETED' || capture.status !== 'COMPLETED') {
      console.log('capture not completed', orderId, order.status, capture.status);
      return json({
        error: 'NOT_COMPLETED',
        message: capture.status === 'PENDING'
          ? 'الدفع قيد المراجعة لدى PayPal. سيصلك الكتاب بعد اكتماله، راسلنا برقم الطلب: ' + orderId
          : 'لم يكتمل الدفع. حاول مرة أخرى.',
      }, 402);
    }
    if (!book || amount.currency_code !== book.currency || toCents(amount.value) !== toCents(book.price)) {
      console.log('amount mismatch', orderId, bookId, JSON.stringify(amount));
      return json({ error: 'AMOUNT_MISMATCH', message: 'المبلغ المدفوع لا يطابق سعر الكتاب. راسلنا برقم الطلب: ' + orderId }, 400);
    }

    const now = new Date();
    const expires = new Date(now.getTime() + DOWNLOAD_DAYS * 24 * 3600 * 1000);
    const email = (order.payer && order.payer.email_address) || '';
    await env.DB.prepare(
      `INSERT OR IGNORE INTO paypal_orders (order_id, book_id, buyer_email, amount, currency, capture_id, created_at, token, expires_at, downloads)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`
    ).bind(orderId, bookId, email, amount.value, amount.currency_code, capture.id || '',
      now.toISOString(), randomToken(), expires.toISOString()).run();
    const row = await env.DB.prepare(`SELECT * FROM paypal_orders WHERE order_id = ?`).bind(orderId).first();
    return orderReply(row);
  }

  // ============ تحميل الكتاب من R2 برمز التحميل ============
  const dl = path.match(/^\/api\/download\/([a-f0-9]{64})$/);
  if (dl && (request.method === 'GET' || request.method === 'HEAD')) {
    await ensurePaypalTables(env.DB);
    const row = await env.DB.prepare(`SELECT * FROM paypal_orders WHERE token = ?`).bind(dl[1]).first();
    if (!row) return downloadError(404, 'رابط التحميل غير صحيح', 'تأكّد من الرابط، أو راسلنا برقم الطلب.');
    const nowIso = new Date().toISOString();
    if (row.expires_at <= nowIso) {
      return downloadError(410, 'انتهت صلاحية الرابط', 'رابط التحميل صالح ' + DOWNLOAD_DAYS + ' أيام فقط. راسلنا برقم الطلب ' + row.order_id + ' لنرسل لك رابطًا جديدًا.');
    }
    if (row.downloads >= MAX_DOWNLOADS) {
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
      if (!head) return downloadError(500, 'الملف غير متاح مؤقتًا', 'حدث خطأ من جهتنا، راسلنا برقم الطلب ' + row.order_id + '.');
      return new Response(null, { headers: Object.assign({ 'Content-Length': String(head.size) }, headers) });
    }
    const obj = await env.BOOKS.get(book.file);
    if (!obj) {
      console.log('R2 object missing', book.file);
      return downloadError(500, 'الملف غير متاح مؤقتًا', 'حدث خطأ من جهتنا، راسلنا برقم الطلب ' + row.order_id + '.');
    }
    // العدّ ذرّي: لا يتجاوز الحد حتى مع طلبات متزامنة
    const upd = await env.DB.prepare(
      `UPDATE paypal_orders SET downloads = downloads + 1 WHERE token = ? AND downloads < ? AND expires_at > ?`
    ).bind(dl[1], MAX_DOWNLOADS, nowIso).run();
    if (!upd.meta || upd.meta.changes !== 1) {
      try { await obj.body.cancel(); } catch (e) {}
      return downloadError(410, 'استُنفد عدد التحميلات', 'راسلنا برقم الطلب ' + row.order_id + '.');
    }
    return new Response(obj.body, { headers: Object.assign({ 'Content-Length': String(obj.size) }, headers) });
  }

  return null;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // ============ PayPal + تحميل الكتب ============
    if (path.startsWith('/api/paypal/') || path.startsWith('/api/download/')) {
      try {
        const res = await handlePaypal(request, env, path);
        if (res) return res;
      } catch (e) {
        console.log('paypal route error', e && e.stack || e);
        return json({ error: 'SERVER_ERROR', message: 'حدث خطأ في الخادم، حاول مرة أخرى.' }, 500);
      }
      return json({ error: 'NOT_FOUND' }, 404);
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
