// =====================================================================
// Shared helpers for the purchase API functions (Vercel, Node runtime).
// Files under api/_lib are not routes (the "_" prefix keeps Vercel from
// turning them into functions).
//
// Environment variables (Vercel → Project → Settings → Environment Variables):
//   FIREBASE_SERVICE_ACCOUNT  service-account JSON (raw JSON or base64 of it)
//   FIREBASE_STORAGE_BUCKET   optional, default word-shortcuts.firebasestorage.app
//   CHARGILY_SECRET_KEY       Chargily Pay V2 secret key (same account as Pro)
//   CHARGILY_MODE             optional: "live" or "test" (default: read from the key prefix)
//   SITE_URL                  optional, e.g. https://merabti.com (default: request host)
//
// Every failure is logged as  [purchase:<function>] <code> {details}
// (Vercel → Project → Logs, filter "purchase:").
// =====================================================================
const admin = require('firebase-admin');
const PRODUCTS = require('../../products.json').products;

const DEFAULT_BUCKET = 'word-shortcuts.firebasestorage.app';

function log(fn, code, details) {
  console.error(`[purchase:${fn}] ${code}`, details === undefined ? '' : JSON.stringify(details));
}

function readServiceAccount() {
  const raw = (process.env.FIREBASE_SERVICE_ACCOUNT || '').trim();
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT is not set');
  let sa;
  try {
    const text = raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
    sa = JSON.parse(text);
  } catch (e) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT is not valid JSON (paste the whole downloaded .json file)');
  }
  if (!sa.client_email || !sa.private_key) throw new Error('FIREBASE_SERVICE_ACCOUNT has no client_email/private_key');
  sa.private_key = sa.private_key.replace(/\\n/g, '\n');
  return sa;
}

function firebase() {
  if (!admin.apps.length) {
    const sa = readServiceAccount();
    admin.initializeApp({
      credential: admin.credential.cert(sa),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || DEFAULT_BUCKET,
    });
  }
  return admin;
}

// Chargily mode: CHARGILY_MODE if set, otherwise from the key prefix (test_sk_… / live_sk_…).
function chargilyConfig() {
  const key = (process.env.CHARGILY_SECRET_KEY || '').trim();
  const keyType = key.startsWith('test_') ? 'test' : key.startsWith('live_') ? 'live' : (key ? 'unknown' : 'missing');
  const envMode = (process.env.CHARGILY_MODE || '').trim().toLowerCase();
  const mode = envMode === 'test' || envMode === 'live' ? envMode : (keyType === 'test' ? 'test' : 'live');
  const mismatch = (keyType === 'test' || keyType === 'live') && keyType !== mode;
  return { key, keyType, mode, envMode: envMode || null, mismatch };
}

function productById(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

// Raw request body as a Buffer (the webhook signature is computed on it).
// On Vercel the helpers have already read the stream and replay it only through
// req.on('data'/'end') — "for await (const chunk of req)" would get 0 bytes there.
function readRaw(req) {
  if (Buffer.isBuffer(req.rawBody)) return Promise.resolve(req.rawBody);
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function readJson(req) {
  const raw = await readRaw(req);
  if (raw.length) {
    try { return JSON.parse(raw.toString('utf8')); } catch (e) { return null; }
  }
  // fallback: body already parsed by the platform
  try { if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body; } catch (e) {}
  return {};
}

// Firebase ID token from "Authorization: Bearer <token>".
// → { user } or { status, error } (and the reason is logged).
async function authUser(req, fn) {
  const m = /^Bearer\s+(.+)$/i.exec(req.headers.authorization || '');
  if (!m) { log(fn, 'login_required', { reason: 'no Authorization header' }); return { status: 401, error: 'login_required' }; }
  let app;
  try { app = firebase(); } catch (e) {
    log(fn, 'firebase_not_configured', { message: e.message });
    return { status: 500, error: 'firebase_not_configured' };
  }
  try {
    return { user: await app.auth().verifyIdToken(m[1]) };
  } catch (e) {
    log(fn, 'login_required', { reason: 'invalid ID token', code: e.code, message: e.message });
    return { status: 401, error: 'login_required' };
  }
}

async function isAdmin(uid) {
  const d = await firebase().firestore().collection('users').doc(uid).get();
  return !!(d.exists && d.data().isAdmin === true);
}

function purchaseRef(uid, productId) {
  return firebase().firestore().collection('purchases').doc(uid).collection('items').doc(productId);
}

async function hasPurchase(uid, productId) {
  return (await purchaseRef(uid, productId).get()).exists;
}

// Site the buyer returns to after paying (also the base of the webhook URL sent to Chargily).
// merabti.com is served by the Cloudflare Worker (worker.js), which forwards the purchase
// calls here and says where they came from in x-merabti-origin (only merabti.com is accepted).
const SITE_ORIGINS = /^https:\/\/(www\.)?merabti\.com$/;
function siteUrl(req) {
  const env = (process.env.SITE_URL || '').trim().replace(/\/+$/, '');
  if (env) return env;
  const fwd = String(req.headers['x-merabti-origin'] || '').trim();
  if (SITE_ORIGINS.test(fwd)) return fwd;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `https://${host}`;
}

module.exports = {
  firebase, chargilyConfig, productById, send, readRaw, readJson, authUser, isAdmin, purchaseRef, hasPurchase, siteUrl, log,
};
