// =====================================================================
// POST /api/checkout   { productId, returnPath }   (Authorization: Bearer <Firebase ID token>)
// Creates a Chargily Pay V2 checkout for a product paid in DZD and returns
// { checkoutUrl }. The purchase itself is recorded only by the webhook
// (api/chargily-webhook.js), never by the success page.
// Errors → { error: <code>, ... } and a "[purchase:checkout] <code>" log line.
// =====================================================================
const { chargilyConfig, productById, send, readJson, authUser, hasPurchase, siteUrl, log } = require('./_lib/server');

const FN = 'checkout';
const CHARGILY_API = {
  live: 'https://pay.chargily.net/api/v2',
  test: 'https://pay.chargily.net/test/api/v2',
};

// Back to the page the buyer came from, with ?purchase=<state>&product=<id>
function backUrl(base, returnPath, state, productId) {
  const path = typeof returnPath === 'string' && /^\/(?!\/)/.test(returnPath) ? returnPath : '/';
  const u = new URL(path, base);
  u.searchParams.set('purchase', state);
  u.searchParams.set('product', productId);
  return u.toString();
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' });

  const cfg = chargilyConfig();
  if (!cfg.key) {
    log(FN, 'chargily_key_missing', { hint: 'set CHARGILY_SECRET_KEY in Vercel (Production and Preview), then redeploy' });
    return send(res, 500, { error: 'chargily_key_missing' });
  }
  if (cfg.mismatch) {
    log(FN, 'chargily_mode_mismatch', { keyType: cfg.keyType, CHARGILY_MODE: cfg.envMode, hint: 'a test_sk_ key needs CHARGILY_MODE=test, a live_sk_ key needs live (or remove CHARGILY_MODE)' });
    return send(res, 500, { error: 'chargily_mode_mismatch' });
  }

  const auth = await authUser(req, FN);
  if (!auth.user) return send(res, auth.status, { error: auth.error });
  const user = auth.user;

  const body = await readJson(req);
  const product = body && productById(body.productId);
  if (!product || !product.chargilyPriceId) {
    log(FN, 'unknown_product', { productId: body && body.productId, bodyType: body === null ? 'invalid JSON' : typeof body });
    return send(res, 404, { error: 'unknown_product' });
  }

  try {
    if (await hasPurchase(user.uid, product.id)) return send(res, 409, { error: 'already_owned' });
  } catch (e) {
    log(FN, 'firestore_error', { uid: user.uid, message: e.message });
    return send(res, 500, { error: 'firestore_error' });
  }

  const base = siteUrl(req);
  const payload = {
    items: [{ price: product.chargilyPriceId, quantity: 1 }],
    success_url: backUrl(base, body.returnPath, 'success', product.id),
    failure_url: backUrl(base, body.returnPath, 'failed', product.id),
    // Sent with every checkout so the Pro subscription's webhook setting in
    // the Chargily dashboard stays untouched.
    webhook_endpoint: `${base}/api/chargily-webhook`,
    locale: body.lang === 'en' ? 'en' : 'ar',
    metadata: { productId: product.id, uid: user.uid },
  };

  let r, data, text = '';
  try {
    r = await fetch(`${CHARGILY_API[cfg.mode]}/checkouts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${cfg.key}`, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    text = await r.text();
    try { data = JSON.parse(text); } catch (e) { data = null; }
  } catch (e) {
    log(FN, 'chargily_unreachable', { mode: cfg.mode, message: e.message });
    return send(res, 502, { error: 'chargily_unreachable' });
  }

  if (!r.ok || !data || !data.checkout_url) {
    // 401 → wrong/revoked key or key of the other mode; 422 → e.g. price_id unknown in this mode
    const code = r.status === 401 || r.status === 403 ? 'chargily_auth_failed'
      : r.status === 422 ? 'chargily_rejected_request' : 'chargily_error';
    log(FN, code, {
      httpStatus: r.status, mode: cfg.mode, keyType: cfg.keyType, priceId: product.chargilyPriceId,
      chargily: data || text.slice(0, 500),
      hint: r.status === 422 ? 'check that the price_id exists in the same mode (live/test) as the key' : undefined,
    });
    return send(res, 502, { error: code, httpStatus: r.status, message: (data && data.message) || null });
  }
  return send(res, 200, { checkoutUrl: data.checkout_url });
};
