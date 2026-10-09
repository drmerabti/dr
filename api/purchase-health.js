// =====================================================================
// GET /api/purchase-health  → is the purchase system configured?
// Shows only yes/no and the key type (live/test) — never a secret value.
// Open https://merabti.com/api/purchase-health after changing the
// Vercel environment variables (and redeploying).
// =====================================================================
const { firebase, chargilyConfig, productById, send } = require('./_lib/server');

module.exports = async (req, res) => {
  const cfg = chargilyConfig();
  const product = productById('grades-manager');
  const out = {
    ok: false,
    chargily: {
      secretKey: cfg.key ? `set (${cfg.keyType})` : 'MISSING',
      mode: cfg.mode,
      CHARGILY_MODE: cfg.envMode || 'not set (taken from the key)',
      modeMatchesKey: !cfg.mismatch,
      priceId: product && product.chargilyPriceId,
    },
    firebase: { serviceAccount: process.env.FIREBASE_SERVICE_ACCOUNT ? 'set' : 'MISSING', init: null },
    storage: { path: product && product.storagePath, fileUploaded: null },
    siteUrl: process.env.SITE_URL || null,
  };
  try {
    const app = firebase();
    out.firebase.init = 'ok';
    try {
      const [exists] = await app.storage().bucket().file(product.storagePath).exists();
      out.storage.fileUploaded = exists;
    } catch (e) { out.storage.fileUploaded = 'error: ' + e.message; }
  } catch (e) {
    out.firebase.init = 'error: ' + e.message;
  }
  out.ok = !!cfg.key && !cfg.mismatch && out.firebase.init === 'ok' && out.storage.fileUploaded === true;
  return send(res, 200, out);
};
