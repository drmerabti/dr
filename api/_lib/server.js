// =====================================================================
// Shared helpers for the purchase API functions (Vercel, Node runtime).
// Files under api/_lib are not routes (the "_" prefix keeps Vercel from
// turning them into functions).
//
// Environment variables (Vercel → Project → Settings → Environment Variables):
//   FIREBASE_SERVICE_ACCOUNT  service-account JSON (raw JSON or base64 of it)
//   FIREBASE_STORAGE_BUCKET   optional, default word-shortcuts.firebasestorage.app
//   CHARGILY_SECRET_KEY       Chargily Pay V2 secret key (same account as Pro)
//   CHARGILY_MODE             "live" (default) or "test"
//   SITE_URL                  optional, e.g. https://merabti.com (default: request host)
// =====================================================================
const admin = require('firebase-admin');
const PRODUCTS = require('../../products.json').products;

const DEFAULT_BUCKET = 'word-shortcuts.firebasestorage.app';

function readServiceAccount() {
  const raw = (process.env.FIREBASE_SERVICE_ACCOUNT || '').trim();
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT is not set');
  const text = raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
  const sa = JSON.parse(text);
  if (sa.private_key) sa.private_key = sa.private_key.replace(/\\n/g, '\n');
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

function productById(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

// Raw request body as a Buffer (needed for the webhook signature).
async function readRaw(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

async function readJson(req) {
  const raw = await readRaw(req);
  if (!raw.length) return {};
  try { return JSON.parse(raw.toString('utf8')); } catch (e) { return null; }
}

// Firebase ID token from "Authorization: Bearer <token>" → decoded token, or null.
async function currentUser(req) {
  const m = /^Bearer\s+(.+)$/i.exec(req.headers.authorization || '');
  if (!m) return null;
  try { return await firebase().auth().verifyIdToken(m[1]); } catch (e) { return null; }
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

function siteUrl(req) {
  const env = (process.env.SITE_URL || '').trim().replace(/\/+$/, '');
  if (env) return env;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `https://${host}`;
}

module.exports = {
  firebase, productById, send, readRaw, readJson, currentUser, isAdmin, purchaseRef, hasPurchase, siteUrl,
};
