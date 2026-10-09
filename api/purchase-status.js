// =====================================================================
// GET /api/purchase-status?products=id1,id2   (Authorization: Bearer <Firebase ID token>)
// → { admin, owned: { id1: true|false, ... } }
// The page uses it to show "Download" instead of the purchase window.
// =====================================================================
const { productById, send, authUser, isAdmin, hasPurchase, log } = require('./_lib/server');

const FN = 'status';

module.exports = async (req, res) => {
  if (req.method !== 'GET') return send(res, 405, { error: 'method_not_allowed' });

  const auth = await authUser(req, FN);
  if (!auth.user) return send(res, auth.status, { error: auth.error });
  const user = auth.user;

  const url = new URL(req.url, 'http://localhost');
  const ids = String(url.searchParams.get('products') || '')
    .split(',').map(s => s.trim()).filter(id => productById(id)).slice(0, 20);

  try {
    const adminUser = await isAdmin(user.uid);
    const owned = {};
    await Promise.all(ids.map(async id => { owned[id] = adminUser || await hasPurchase(user.uid, id); }));
    return send(res, 200, { admin: adminUser, owned });
  } catch (e) {
    log(FN, 'firestore_error', { uid: user.uid, message: e.message });
    return send(res, 500, { error: 'firestore_error' });
  }
};
