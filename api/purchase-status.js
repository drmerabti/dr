// =====================================================================
// GET /api/purchase-status?products=id1,id2   (Authorization: Bearer <Firebase ID token>)
// → { admin, owned: { id1: true|false, ... } }
// The page uses it to show "Download" instead of the purchase window.
// =====================================================================
const { productById, send, currentUser, isAdmin, hasPurchase } = require('./_lib/server');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return send(res, 405, { error: 'method_not_allowed' });

  const user = await currentUser(req);
  if (!user) return send(res, 401, { error: 'login_required' });

  const url = new URL(req.url, 'http://localhost');
  const ids = String(url.searchParams.get('products') || '')
    .split(',').map(s => s.trim()).filter(id => productById(id)).slice(0, 20);

  try {
    const adminUser = await isAdmin(user.uid);
    const owned = {};
    await Promise.all(ids.map(async id => { owned[id] = adminUser || await hasPurchase(user.uid, id); }));
    return send(res, 200, { admin: adminUser, owned });
  } catch (e) {
    console.error('purchase status failed', e);
    return send(res, 500, { error: 'server_error' });
  }
};
