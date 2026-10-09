// =====================================================================
// POST /api/download   { productId }   (Authorization: Bearer <Firebase ID token>)
// Checks the purchase (or admin), then returns a signed Firebase Storage
// URL for the product file, valid for 10 minutes → { url }.
// =====================================================================
const { firebase, productById, send, readJson, authUser, isAdmin, hasPurchase, log } = require('./_lib/server');

const FN = 'download';

const TEN_MINUTES = 10 * 60 * 1000;

module.exports = async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' });

  const auth = await authUser(req, FN);
  if (!auth.user) return send(res, auth.status, { error: auth.error });
  const user = auth.user;

  const body = await readJson(req);
  const product = body && productById(body.productId);
  if (!product || !product.storagePath) {
    log(FN, 'unknown_product', { productId: body && body.productId });
    return send(res, 404, { error: 'unknown_product' });
  }

  try {
    const allowed = (await isAdmin(user.uid)) || (await hasPurchase(user.uid, product.id));
    if (!allowed) { log(FN, 'not_purchased', { uid: user.uid, productId: product.id }); return send(res, 403, { error: 'not_purchased' }); }

    const file = firebase().storage().bucket().file(product.storagePath);
    const [exists] = await file.exists();
    if (!exists) {
      log(FN, 'file_missing', { storagePath: product.storagePath, hint: 'upload the file to Firebase Storage at this path' });
      return send(res, 404, { error: 'file_missing' });
    }

    const fileName = product.fileName || product.storagePath.split('/').pop();
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + TEN_MINUTES,
      responseDisposition: `attachment; filename="${fileName}"`,
    });
    return send(res, 200, { url });
  } catch (e) {
    log(FN, 'server_error', { uid: user.uid, productId: product.id, message: e.message });
    return send(res, 500, { error: 'server_error' });
  }
};
