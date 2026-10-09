// =====================================================================
// POST /api/checkout   { productId, returnPath }   (Authorization: Bearer <Firebase ID token>)
// Creates a Chargily Pay V2 checkout for a product paid in DZD and returns
// { checkoutUrl }. The purchase itself is recorded only by the webhook
// (api/chargily-webhook.js), never by the success page.
// =====================================================================
const { productById, send, readJson, currentUser, hasPurchase, siteUrl } = require('./_lib/server');

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

  const secret = process.env.CHARGILY_SECRET_KEY;
  if (!secret) return send(res, 500, { error: 'not_configured' });

  const user = await currentUser(req);
  if (!user) return send(res, 401, { error: 'login_required' });

  const body = await readJson(req);
  const product = body && productById(body.productId);
  if (!product || !product.chargilyPriceId) return send(res, 404, { error: 'unknown_product' });

  try {
    if (await hasPurchase(user.uid, product.id)) return send(res, 409, { error: 'already_owned' });
  } catch (e) {
    console.error('purchase lookup failed', e);
    return send(res, 500, { error: 'server_error' });
  }

  const base = siteUrl(req);
  const mode = process.env.CHARGILY_MODE === 'test' ? 'test' : 'live';
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

  try {
    const r = await fetch(`${CHARGILY_API[mode]}/checkouts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok || !data.checkout_url) {
      console.error('chargily checkout failed', r.status, data);
      return send(res, 502, { error: 'payment_provider_error' });
    }
    return send(res, 200, { checkoutUrl: data.checkout_url });
  } catch (e) {
    console.error('chargily request failed', e);
    return send(res, 502, { error: 'payment_provider_error' });
  }
};
