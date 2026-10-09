// =====================================================================
// POST /api/chargily-webhook   (called by Chargily Pay V2)
// Verifies the "signature" header (HMAC-SHA256 of the raw body with the
// secret key), then on checkout.paid records the purchase in Firestore:
//   purchases/{uid}/items/{productId}
// This is the only place a DZD purchase is recorded.
// =====================================================================
const crypto = require('crypto');
const { firebase, productById, send, readRaw, purchaseRef } = require('./_lib/server');

function validSignature(raw, signature, secret) {
  if (!signature || !secret) return false;
  const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(String(signature).trim(), 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Chargily returns metadata as an object (or, in some payloads, an array of objects).
function readMetadata(m) {
  if (Array.isArray(m)) return Object.assign({}, ...m.filter(x => x && typeof x === 'object'));
  return m && typeof m === 'object' ? m : {};
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' });

  const raw = await readRaw(req);
  if (!validSignature(raw, req.headers.signature, process.env.CHARGILY_SECRET_KEY)) {
    return send(res, 403, { error: 'invalid_signature' });
  }

  let event;
  try { event = JSON.parse(raw.toString('utf8')); } catch (e) { return send(res, 400, { error: 'invalid_json' }); }

  const checkout = event && event.data;
  if (!event || event.type !== 'checkout.paid' || !checkout || checkout.status !== 'paid') {
    return send(res, 200, { ok: true, ignored: true });
  }

  const meta = readMetadata(checkout.metadata);
  const product = productById(meta.productId);
  const uid = typeof meta.uid === 'string' ? meta.uid : '';
  if (!product || !uid) {
    console.error('checkout.paid without a known product/uid', checkout.id, meta);
    return send(res, 200, { ok: true, ignored: true });
  }

  try {
    const ref = purchaseRef(uid, product.id);
    const admin = firebase();
    await admin.firestore().runTransaction(async tx => {
      const snap = await tx.get(ref);
      if (snap.exists) return;                      // already recorded (Chargily may retry)
      tx.set(ref, {
        productId: product.id,
        uid,
        provider: 'chargily',
        checkoutId: checkout.id || null,
        eventId: event.id || null,
        amount: checkout.amount ?? null,
        currency: checkout.currency || null,
        livemode: event.livemode ?? checkout.livemode ?? null,
        paidAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
    return send(res, 200, { ok: true });
  } catch (e) {
    console.error('recording purchase failed', e);
    return send(res, 500, { error: 'server_error' });   // non-2xx → Chargily retries
  }
};
