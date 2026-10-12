// =====================================================================
// Lesson rating (TRIAL) — stars + "did the file work?" + Windows version
//
// Self-contained: everything lives in shared/lesson-rating/ (this file,
// lesson-rating.css, firestore-lesson-ratings.rules).
// A page uses it by:
//   1) loading lesson-rating.css + this file (after the Firebase compat SDK
//      app/auth/firestore and firebase-init.js),
//   2) rendering one element where the section goes:
//        <div class="lr-slot" data-rating="pc-solutions-1"></div>
//      (the value is the lesson id stored in Firestore).
//
// Firestore: collection "lesson_ratings", one document per visitor and lesson:
//   lesson_ratings/{lessonId}_{uid} = { lessonId, uid, stars 1-5, worked true/false,
//                                       windows '7'|'10'|'11', createdAt }
// "uid" comes from Firebase anonymous sign-in in a SEPARATE Firebase app
// ("lessonRatings"), so the site's real sign-in is never touched. The visitor
// gets that id only when pressing "Send". Rules: create once, never update/delete.
// =====================================================================
(function () {
  'use strict';

  const COLLECTION = 'lesson_ratings';
  const APP_NAME = 'lessonRatings';

  const TXT = {
    ar: {
      title: 'قيّم هذا الدرس', first: 'كن أول من يقيّم هذا الدرس',
      of5: 'من 5', worked: 'اشتغل مع {p}% من المستخدمين',
      pick: 'اختر عدد النجوم', star: '{n} من 5',
      qWorked: 'هل اشتغل الملف معك؟', yes: 'نعم', no: 'لا',
      qWindows: 'نسخة الويندوز:', send: 'إرسال', sending: 'جارٍ الإرسال...',
      need: 'اختر إجابة لكل سؤال.', thanks: 'شكرًا لتقييمك!', yours: 'تقييمك:',
      err: 'تعذّر الإرسال، حاول مرة أخرى.', errAuth: 'التقييم غير متاح حاليًا.',
      'auth/operation-not-allowed': 'الدخول المجهول (Anonymous) غير مفعّل في Firebase.',
      'auth/unauthorized-domain': 'هذا النطاق غير مضاف في Firebase (Authorized domains).',
      'auth/admin-restricted-operation': 'إنشاء الحسابات المجهولة ممنوع في إعدادات Firebase.',
      'permission-denied': 'قواعد Firestore لا تسمح بالإرسال (أضف قاعدة lesson_ratings).',
    },
    en: {
      title: 'Rate this lesson', first: 'Be the first to rate this lesson',
      of5: 'out of 5', worked: 'Worked for {p}% of users',
      pick: 'Choose a number of stars', star: '{n} out of 5',
      qWorked: 'Did the file work for you?', yes: 'Yes', no: 'No',
      qWindows: 'Windows version:', send: 'Send', sending: 'Sending...',
      need: 'Please answer both questions.', thanks: 'Thanks for your rating!', yours: 'Your rating:',
      err: 'Could not send, please try again.', errAuth: 'Rating is not available right now.',
      'auth/operation-not-allowed': 'Anonymous sign-in is not enabled in Firebase.',
      'auth/unauthorized-domain': 'This domain is not in Firebase Authorized domains.',
      'auth/admin-restricted-operation': 'Anonymous sign-up is blocked in the Firebase settings.',
      'permission-denied': 'The Firestore rules refuse the rating (add the lesson_ratings rule).',
    },
  };
  const lang = () => (document.documentElement.lang === 'en' ? 'en' : 'ar');
  const t = (k, v) => String(TXT[lang()][k] ?? TXT.ar[k] ?? k).replace(/\{(\w+)\}/g, (_, x) => (v && x in v ? v[x] : ''));
  const dir = () => (lang() === 'ar' ? 'rtl' : 'ltr');
  const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.85 5.78 6.38.93-4.62 4.5 1.09 6.35L12 17.36 6.3 20.36l1.09-6.35-4.62-4.5 6.38-.93z"/></svg>';

  // "128 تقييماً" — Arabic count agreement; Western digits everywhere
  function countText(n) {
    if (lang() === 'en') return n === 1 ? '1 rating' : `${n} ratings`;
    if (n === 1) return 'تقييم واحد';
    if (n === 2) return 'تقييمان';
    if (n % 100 >= 3 && n % 100 <= 10) return `${n} تقييمات`;
    return `${n} تقييماً`;
  }

  /* ----------------------------- Firebase ---------------------------- */
  let app = null;
  function ratingApp() {
    if (app) return app;
    if (!window.firebase || !firebase.apps || !firebase.apps.length || !firebase.firestore || !firebase.auth) return null;
    try { app = firebase.app(APP_NAME); }
    catch (e) { app = firebase.initializeApp(firebase.app().options, APP_NAME); }
    return app;
  }
  const db = () => ratingApp().firestore();
  const docId = (lessonId, uid) => `${lessonId}_${uid}`;

  // The anonymous id saved from an earlier rating in this browser (null if none)
  let authReady = null;
  function savedUser() {
    if (!authReady) {
      authReady = new Promise(resolve => {
        const unsub = ratingApp().auth().onAuthStateChanged(u => { unsub(); resolve(u || null); });
      });
    }
    return authReady;
  }

  const stats = {};   // lessonId → { count, avg, workedPct } (cached between re-renders)
  async function loadStats(lessonId, force) {
    if (stats[lessonId] && !force) return stats[lessonId];
    const snap = await db().collection(COLLECTION).where('lessonId', '==', lessonId).get();
    let sum = 0, count = 0, worked = 0;
    snap.forEach(d => { const r = d.data(); sum += r.stars; count++; if (r.worked === true) worked++; });
    stats[lessonId] = { count, avg: count ? sum / count : 0, workedPct: count ? Math.round(worked * 100 / count) : 0 };
    return stats[lessonId];
  }

  const mine = {};    // lessonId → my rating document (or null)
  async function loadMine(lessonId) {
    if (lessonId in mine) return mine[lessonId];
    const u = await savedUser();
    if (!u) return (mine[lessonId] = null);
    const d = await db().collection(COLLECTION).doc(docId(lessonId, u.uid)).get();
    return (mine[lessonId] = d.exists ? d.data() : null);
  }

  /* -------------------------------- UI ------------------------------- */
  function starsRow(value, cls) {
    let h = '';
    for (let i = 1; i <= 5; i++) {
      const fill = Math.max(0, Math.min(1, value - (i - 1)));
      h += `<span class="lr-s${cls ? ' ' + cls : ''}" style="--f:${Math.round(fill * 100)}%">${STAR}</span>`;
    }
    return `<span class="lr-stars-ro" dir="ltr" aria-hidden="true">${h}</span>`;
  }

  function summaryHTML(s) {
    if (!s || !s.count) return `<div class="lr-sum"><span class="lr-first">${t('first')}</span></div>`;
    const avg = (Math.round(s.avg * 10) / 10).toFixed(1);
    return `<div class="lr-sum">
        ${starsRow(s.avg)}
        <span class="lr-avg"><b dir="ltr">${avg}</b> ${t('of5')} <span class="lr-count">(${countText(s.count)})</span></span>
      </div>
      <div class="lr-worked">✓ ${t('worked', { p: s.workedPct })}</div>`;
  }

  function render(slot, state) {
    const lessonId = slot.dataset.rating;
    const s = stats[lessonId];
    const my = mine[lessonId];
    let body;
    if (my) {
      body = `<div class="lr-thanks">
          <div class="lr-thanks-t">${t('thanks')}</div>
          <div class="lr-thanks-s"><span>${t('yours')}</span>${starsRow(my.stars, 'mine')}</div>
        </div>`;
    } else {
      const picked = state.stars || 0;
      let btns = '';
      for (let i = 1; i <= 5; i++) {
        btns += `<button type="button" class="lr-star${i <= picked ? ' on' : ''}" data-star="${i}" aria-label="${t('star', { n: i })}" aria-pressed="${i === picked}">${STAR}</button>`;
      }
      const seg = (name, opts) => opts.map(([v, label]) =>
        `<button type="button" class="lr-opt${state[name] === v ? ' on' : ''}" data-q="${name}" data-v="${v}" aria-pressed="${state[name] === v}">${label}</button>`).join('');
      body = `<div class="lr-pick" dir="ltr" role="group" aria-label="${t('pick')}">${btns}</div>
        ${picked ? `<div class="lr-q">
          <div class="lr-q-row"><span class="lr-q-t">${t('qWorked')}</span><span class="lr-seg">${seg('worked', [['yes', t('yes')], ['no', t('no')]])}</span></div>
          <div class="lr-q-row"><span class="lr-q-t">${t('qWindows')}</span><span class="lr-seg" dir="ltr">${seg('windows', [['7', '7'], ['10', '10'], ['11', '11']])}</span></div>
          <button type="button" class="lr-send"${state.busy ? ' disabled' : ''}>${t(state.busy ? 'sending' : 'send')}</button>
        </div>` : ''}
        <div class="lr-msg" role="status" aria-live="polite">${state.msg || ''}</div>`;
    }
    slot.innerHTML = `<section class="lr-card" dir="${dir()}">
        <h3 class="lr-title">${STAR}<span>${t('title')}</span></h3>
        ${summaryHTML(s)}
        ${body}
      </section>`;
  }

  async function submit(slot, state) {
    const lessonId = slot.dataset.rating;
    if (!state.stars || !state.worked || !state.windows) { state.msg = t('need'); render(slot, state); return; }
    state.busy = true; state.msg = ''; render(slot, state);
    try {
      const a = ratingApp().auth();
      const u = a.currentUser || (await a.signInAnonymously()).user;
      authReady = Promise.resolve(u);
      const data = {
        lessonId, uid: u.uid, stars: state.stars, worked: state.worked === 'yes', windows: state.windows,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
      await db().collection(COLLECTION).doc(docId(lessonId, u.uid)).set(data);   // create only (rules)
      mine[lessonId] = data;
      await loadStats(lessonId, true).catch(() => {});
    } catch (e) {
      console.error('[lesson-rating]', e && e.code, e && e.message);
      state.busy = false;
      // already rated from this browser (create refused) → show the thank-you
      if (e && e.code === 'permission-denied') { delete mine[lessonId]; await loadMine(lessonId).catch(() => {}); }
      // show the exact Firebase error code (trial) so the cause is visible on the page
      if (!mine[lessonId]) {
        const code = (e && e.code) || 'unknown';
        const base = t(/^auth\//.test(code) ? 'errAuth' : 'err');
        const hint = TXT[lang()][code] || TXT.ar[code];
        state.msg = `${base}${hint ? ' ' + hint : ''} (${code})`;
      }
    }
    render(slot, state);
  }

  async function mount(slot) {
    slot.dataset.lr = '1';
    if (!ratingApp()) { slot.hidden = true; return; }
    const state = { stars: 0, worked: null, windows: null, busy: false, msg: '' };
    slot.addEventListener('click', e => {
      const star = e.target.closest('[data-star]');
      const opt = e.target.closest('[data-q]');
      if (star) { state.stars = +star.dataset.star; state.msg = ''; render(slot, state); return; }
      if (opt) { state[opt.dataset.q] = opt.dataset.v; state.msg = ''; render(slot, state); return; }
      if (e.target.closest('.lr-send') && !state.busy) submit(slot, state);
    });
    render(slot, state);
    const lessonId = slot.dataset.rating;
    await Promise.all([loadStats(lessonId).catch(() => {}), loadMine(lessonId).catch(() => {})]);
    if (slot.isConnected) render(slot, state);
  }

  // The lesson page re-renders its content (lesson change, language switch):
  // mount every new slot as it appears.
  function scan() { document.querySelectorAll('.lr-slot:not([data-lr])').forEach(mount); }
  function start() {
    scan();
    new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
