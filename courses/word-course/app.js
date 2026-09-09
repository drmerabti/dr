(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const els = {
    loadingScreen: $('loadingScreen'), lockedScreen: $('lockedScreen'),
    paywallScreen: $('paywallScreen'), lessonsScreen: $('lessonsScreen'),
    authForm: $('authForm'), acEmail: $('acEmail'), acPassword: $('acPassword'),
    subscribeBtn: $('subscribeBtn'), lessonsList: $('lessonsList'),
  };

  function showScreen(name) {
    ['loadingScreen', 'lockedScreen', 'paywallScreen', 'lessonsScreen'].forEach((s) => els[s].classList.add('hidden'));
    els[name].classList.remove('hidden');
  }

  /* ================= Lesson data =================
     Each lesson lists its games. "memory" is built and linked to a real page;
     "sequence" and "path" are not built yet, so their buttons render disabled. */
  const LESSONS = [
    {
      id: 'lesson-1',
      title: 'الدرس الأول — مقدمة عن برنامج Word',
      videoUrl: null, // set this once the real video is ready
      memoryGameUrl: 'games/word-lesson1-memory.html',
    },
    // Add more lessons here as content becomes ready — same shape as above.
  ];

  function renderLessons() {
    els.lessonsList.innerHTML = LESSONS.map((lesson, i) => `
      <div class="lesson-card">
        <h2><span class="lesson-num">${i + 1}</span> ${lesson.title}</h2>
        <div class="video-slot">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
          <span>${lesson.videoUrl ? '' : 'الفيديو غير متاح بعد'}</span>
        </div>
        <div class="games-row">
          ${lesson.memoryGameUrl
            ? `<a class="game-btn" href="${lesson.memoryGameUrl}" target="_blank" rel="noopener">
                <span class="game-icon g1">🧠</span>
                <span>لعبة الذاكرة<span class="lbl-sub">طابق بين البطاقات</span></span>
              </a>`
            : `<span class="game-btn disabled"><span class="game-icon g1">🧠</span><span>لعبة الذاكرة<span class="lbl-sub">قريبًا</span></span></span>`}
          <span class="game-btn disabled"><span class="game-icon g2">🔢</span><span>ترتيب الخطوات<span class="lbl-sub">قريبًا</span></span></span>
          <span class="game-btn disabled"><span class="game-icon g3">🎯</span><span>مسار التقدّم<span class="lbl-sub">قريبًا</span></span></span>
        </div>
      </div>
    `).join('');
  }

  /* ================= Auth ================= */
  els.authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await window.fbAuth.signInWithEmailAndPassword(els.acEmail.value.trim(), els.acPassword.value);
    } catch (err) {
      alert('تعذّر تسجيل الدخول — تأكد من البريد وكلمة المرور.');
    }
  });

  /* ================= Access check ================= */
  async function isAdminUser(uid) {
    try {
      const doc = await firebase.firestore().collection('users').doc(uid).get();
      return !!(doc.exists && doc.data().isAdmin === true);
    } catch (e) { return false; }
  }

  async function hasCourseAccess(uid) {
    if (await isAdminUser(uid)) return true;
    try {
      const doc = await firebase.firestore().collection('users').doc(uid).get();
      const sub = doc.exists ? doc.data().wordCourseSubscription : null;
      return !!(sub && sub.active && sub.expiresAt && sub.expiresAt.toMillis() > Date.now());
    } catch (e) { return false; }
  }

  els.subscribeBtn.addEventListener('click', async () => {
    const user = window.fbAuth.currentUser;
    if (!user) return;
    els.subscribeBtn.disabled = true;
    els.subscribeBtn.textContent = 'جارٍ التحويل...';
    try {
      const fn = firebase.functions().httpsCallable('createSubscriptionCheckout');
      const res = await fn({ product: 'wordCourse' });
      if (res.data && res.data.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      } else {
        throw new Error('no checkout url');
      }
    } catch (e) {
      alert('حدث خطأ، حاول مرة أخرى.');
      els.subscribeBtn.disabled = false;
      els.subscribeBtn.textContent = 'اشترك الآن';
    }
  });

  /* ================= Init ================= */
  if (window.fbAuth) {
    window.fbAuth.onAuthStateChanged(async (user) => {
      if (!user) {
        showScreen('lockedScreen');
        return;
      }
      const access = await hasCourseAccess(user.uid);
      if (access) {
        renderLessons();
        showScreen('lessonsScreen');
      } else {
        showScreen('paywallScreen');
      }
    });
  } else {
    showScreen('lockedScreen');
  }
})();
