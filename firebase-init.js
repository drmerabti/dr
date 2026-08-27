// ============================================================
// firebase-init.js — shared Firebase setup for the whole site
// Loaded after the firebase-*-compat.js SDK scripts, before app.js
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyBDUq4_thyfuKu97ifO4gN9FSyFZ1Ttwu4",
  authDomain: "word-shortcuts.firebaseapp.com",
  projectId: "word-shortcuts",
  storageBucket: "word-shortcuts.firebasestorage.app",
  messagingSenderId: "268473124363",
  appId: "1:268473124363:web:d386935309bd2fea67690e",
  measurementId: "G-6PKBD7XR0M",
};

firebase.initializeApp(firebaseConfig);

// Exposed globally for app.js / page scripts to use
window.fbAuth = firebase.auth();
window.fbDb = firebase.firestore();

// Explicitly force LOCAL persistence (survives tab/browser close) instead of
// relying on the SDK default — protects against the session being lost
// across page navigations.
window.fbAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(() => {
  // Some browsers (private mode, storage restrictions) may reject this —
  // the SDK will fall back to in-memory persistence for that session.
});
