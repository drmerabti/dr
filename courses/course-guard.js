/* =====================================================================
   course-guard.js — access gate for every page inside courses/
   ---------------------------------------------------------------------
   Load it in <head> (a plain, non-deferred script) on every course page:

     <script src="../course-guard.js" data-course="word"></script>
     <script src="../course-guard.js" data-admin-only></script>

   - data-course     : course id (else read from ?course= in the URL)
   - data-admin-only : only admins may see the page

   The page stays hidden until Firebase Auth answers. Anyone who is not an
   admin (or an active member of that course) is sent back to the home page,
   so typing a course URL directly no longer works.

   Needs firebase-*-compat.js + firebase-init.js loaded synchronously at the
   end of <body> (they have run by the time DOMContentLoaded fires).

   NOTE: a static site cannot hide its own HTML from a determined visitor —
   the real protection is the Firestore Security Rules on course content.
   This gate keeps the UI closed; the rules keep the data closed.
===================================================================== */
(function () {
  "use strict";

  var script = document.currentScript;
  var params = new URLSearchParams(window.location.search);
  var cfg = {
    course: (script && script.dataset.course) || params.get('course') || '',
    adminOnly: !!(script && script.hasAttribute('data-admin-only')),
  };
  var HOME = new URL('../index.html', script ? script.src : window.location.href).href;

  // Hide the whole page until access is confirmed.
  var hideStyle = document.createElement('style');
  hideStyle.textContent = 'html{visibility:hidden !important;}';
  document.head.appendChild(hideStyle);

  function reveal() { if (hideStyle.parentNode) hideStyle.parentNode.removeChild(hideStyle); }
  function deny() { window.location.replace(HOME); }

  function isActive(sub) {
    if (!sub || sub.active !== true) return false;
    if (!sub.expiresAt) return true;
    var ms = typeof sub.expiresAt.toMillis === 'function' ? sub.expiresAt.toMillis() : Number(sub.expiresAt);
    return ms > Date.now();
  }

  async function checkAdmin(uid) {
    try {
      var doc = await firebase.firestore().collection('users').doc(uid).get();
      return { admin: !!(doc.exists && doc.data().isAdmin === true), data: doc.exists ? doc.data() : {} };
    } catch (e) {
      return { admin: false, data: {} };
    }
  }

  // Member of a course = courses/{course}/members/{uid} with active:true
  // (written by the admin / payment backend), or the legacy per-course field
  // on the user doc (e.g. users/{uid}.wordCourseSubscription).
  async function checkMember(uid, course, userData) {
    if (!course) return false;
    if (isActive(userData[course + 'CourseSubscription'])) return true;
    try {
      var doc = await firebase.firestore()
        .collection('courses').doc(course)
        .collection('members').doc(uid).get();
      return doc.exists && isActive(doc.data());
    } catch (e) {
      return false;
    }
  }

  window.courseGuard = new Promise(function (resolve) {
    function start() {
      if (!window.fbAuth || !window.firebase || !firebase.firestore) { deny(); return; }
      var verified = false;
      window.fbAuth.onAuthStateChanged(async function (user) {
        if (!user) { deny(); return; }        // signed out (now or later)
        if (verified) return;
        var res = await checkAdmin(user.uid);
        var ok = res.admin || (!cfg.adminOnly && await checkMember(user.uid, cfg.course, res.data));
        if (!ok) { deny(); return; }
        verified = true;
        reveal();
        resolve({ user: user, isAdmin: res.admin, course: cfg.course });
      });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
  });
})();
