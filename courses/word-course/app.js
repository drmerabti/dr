(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const els = {
    loadingScreen: $('loadingScreen'), lockedScreen: $('lockedScreen'),
    paywallScreen: $('paywallScreen'), lessonsScreen: $('lessonsScreen'),
    lessonDetailScreen: $('lessonDetailScreen'),
    authForm: $('authForm'), acEmail: $('acEmail'), acPassword: $('acPassword'),
    subscribeBtn: $('subscribeBtn'), lessonsList: $('lessonsList'),
  };

  function showScreen(name) {
    ['loadingScreen', 'lockedScreen', 'paywallScreen', 'lessonsScreen', 'lessonDetailScreen'].forEach((s) => {
      if (els[s]) els[s].classList.add('hidden');
    });
    els[name].classList.remove('hidden');
  }

  /* ================= Lesson data — all 30, from day one ================= */
  const LESSONS = [
    { id: 1, icon: '🖥️', title: 'التعرف على برنامج Word وواجهة البرنامج' },
    { id: 2, icon: '💾', title: 'إنشاء المستندات وفتحها وحفظها' },
    { id: 3, icon: '✍️', title: 'الكتابة والتحرير في Word' },
    { id: 4, icon: '📋', title: 'تحديد النص ونسخه وقصه ولصقه' },
    { id: 5, icon: '🔤', title: 'تنسيق النصوص والخطوط' },
    { id: 6, icon: '📐', title: 'تنسيق الفقرات والمحاذاة والمسافات' },
    { id: 7, icon: '🔢', title: 'التعداد النقطي والرقمي' },
    { id: 8, icon: '🔍', title: 'البحث والاستبدال والتنقل داخل المستند' },
    { id: 9, icon: 'Ω', title: 'الرموز والأحرف الخاصة والمعادلات' },
    { id: 10, icon: '⌨️', title: 'أهم اختصارات لوحة المفاتيح في Word' },
    { id: 11, icon: '🖼️', title: 'إدراج الصور وتنسيقها' },
    { id: 12, icon: '🔷', title: 'إدراج الأشكال ومربع النص وWordArt' },
    { id: 13, icon: '📊', title: 'إنشاء الجداول' },
    { id: 14, icon: '🗂️', title: 'تنسيق الجداول وإدارتها' },
    { id: 15, icon: '📏', title: 'إعداد الصفحة والهوامش وحجم واتجاه الورق' },
    { id: 16, icon: '📑', title: 'الرؤوس والتذييلات وأرقام الصفحات' },
    { id: 17, icon: '✂️', title: 'فواصل الصفحات والأقسام' },
    { id: 18, icon: '📰', title: 'الأعمدة وحدود الصفحة والعلامة المائية' },
    { id: 19, icon: '🔗', title: 'الروابط التشعبية والربط داخل مستند Word' },
    { id: 20, icon: '🎨', title: 'استخدام الأنماط Styles وتنسيق المستند باحتراف' },
    { id: 21, icon: '🗒️', title: 'إنشاء فهرس المحتويات تلقائيًا' },
    { id: 22, icon: '📚', title: 'المراجع والاقتباسات وإدارة المصادر' },
    { id: 23, icon: '💬', title: 'الحواشي السفلية والتعليقات التوضيحية' },
    { id: 24, icon: '✅', title: 'التدقيق الإملائي والنحوي واللغوي' },
    { id: 25, icon: '🔄', title: 'المراجعة وتتبع التغييرات والتعليقات' },
    { id: 26, icon: '📧', title: 'دمج المراسلات Mail Merge' },
    { id: 27, icon: '🧩', title: 'القوالب والنماذج في Word' },
    { id: 28, icon: '🔒', title: 'حماية المستند والتحكم في صلاحياته' },
    { id: 29, icon: '🖨️', title: 'الطباعة وتحويل المستند إلى PDF' },
    { id: 30, icon: '🏆', title: 'مشروع تطبيقي شامل: إنشاء مستند Word احترافي من البداية إلى النهاية' },
  ];
  // Only lesson 1 has a built memory game so far — others show "قريبًا" until content is ready.
  const MEMORY_GAME_URLS = { 1: 'games/word-lesson1-memory.html' };
  // Add an entry here once a lesson's video is ready — supports YouTube or
  // Cloudflare Stream embed URLs. Leave a lesson out and it shows the placeholder.
  const VIDEO_URLS = {
    // 1: 'https://www.youtube.com/embed/VIDEO_ID',
    // 1: 'https://customer-XXXX.cloudflarestream.com/VIDEO_ID/iframe',
  };

  let currentLessonId = null;

  function renderLessons() {
    els.lessonsList.innerHTML = LESSONS.map((lesson) => `
      <div class="item-card" data-lesson="${lesson.id}" style="cursor:pointer;">
        <span class="lesson-num-badge">الدرس ${lesson.id}</span>
        <span class="icon-badge" style="display:flex; align-items:center; justify-content:center; font-size:60px;">${lesson.icon}</span>
        <h3>${lesson.title}</h3>
      </div>
    `).join('');

    els.lessonsList.querySelectorAll('[data-lesson]').forEach((card) => {
      card.addEventListener('click', () => openLesson(parseInt(card.getAttribute('data-lesson'), 10)));
    });
  }

  /* ================= Lesson detail (video + chat + notebook) ================= */
  // Add an entry here once a lesson's downloadable file is uploaded.
  const FILE_URLS = {
    // 1: 'files/lesson-1-file.pdf',
  };

  function renderVideo(lessonId) {
    const box = $('videoBox');
    const url = VIDEO_URLS[lessonId];
    if (url) {
      box.classList.add('has-video');
      box.innerHTML = `<iframe src="${url}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    } else {
      box.classList.remove('has-video');
      box.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
        <span id="lessonDetailNum">الدرس ${lessonId}</span>`;
    }
  }

  function renderFileBox(lessonId) {
    const box = $('lessonFileBox');
    const url = FILE_URLS[lessonId];
    if (url) {
      box.style.visibility = 'visible';
      box.querySelector('.file-download-btn').href = url;
      box.querySelector('.file-download-btn').setAttribute('download', '');
    } else {
      box.style.visibility = 'hidden'; // keeps its grid slot reserved, unlike display:none
    }
  }

  function renderLessonNav(lessonId) {
    const prevBtn = $('prevLessonBtn'), nextBtn = $('nextLessonBtn');
    const hasPrev = LESSONS.some((l) => l.id === lessonId - 1);
    const hasNext = LESSONS.some((l) => l.id === lessonId + 1);
    prevBtn.disabled = !hasPrev;
    prevBtn.style.opacity = hasPrev ? '1' : '.4';
    nextBtn.disabled = !hasNext;
    nextBtn.style.opacity = hasNext ? '1' : '.4';
    prevBtn.onclick = hasPrev ? () => openLesson(lessonId - 1) : null;
    nextBtn.onclick = hasNext ? () => openLesson(lessonId + 1) : null;
  }

  function fitLessonLayoutToScreen(){
    const layout = document.querySelector('.lesson-layout');
    const extras = document.querySelector('.lesson-extras');
    const gamesRow = document.querySelector('.games-row');
    if (!layout) return;

    layout.style.maxWidth = '';
    layout.style.height = '';
    const layoutTop = layout.getBoundingClientRect().top;
    const extrasHeight = extras ? extras.getBoundingClientRect().height + 24 : 0;
    const gamesRowHeight = gamesRow ? gamesRow.getBoundingClientRect().height + 16 : 0; // +margin-bottom on video-box
    const bottomMargin = 90; // matches <main>'s own bottom padding in the site's real style.css
    const availableHeight = Math.max(360, window.innerHeight - layoutTop - extrasHeight - bottomMargin);

    layout.style.height = availableHeight + 'px';

    // Video only gets the row's height minus the space games-row takes below it.
    const videoHeightBudget = Math.max(160, availableHeight - gamesRowHeight);
    const CENTER_FR_SHARE = 2.3 / 3.8;
    const maxCenterWidth = videoHeightBudget * (16 / 9);
    const maxLayoutWidth = maxCenterWidth / CENTER_FR_SHARE;
    layout.style.maxWidth = maxLayoutWidth + 'px';
    layout.style.marginInline = 'auto';
  }
  window.addEventListener('resize', () => {
    if (!document.getElementById('lessonDetailScreen').classList.contains('hidden')) fitLessonLayoutToScreen();
  });

  function openLesson(lessonId) {
    currentLessonId = lessonId;
    const lesson = LESSONS.find((l) => l.id === lessonId);
    if (!lesson) return;

    $('lessonDetailTitle').textContent = `الدرس ${lesson.id} — ${lesson.title}`;

    const memoryUrl = MEMORY_GAME_URLS[lessonId];
    $('gameMemoryBtn').classList.toggle('disabled', !memoryUrl);
    $('gameMemoryBtn').onclick = memoryUrl ? () => window.open(memoryUrl, '_blank') : null;

    renderVideo(lessonId);
    renderFileBox(lessonId);
    renderLessonNav(lessonId);
    loadNotebook(lessonId);
    loadChat(lessonId);
    showScreen('lessonDetailScreen');
    setTimeout(fitLessonLayoutToScreen, 0); // after layout paints, so measurements are accurate
    window.scrollTo(0, 0);
  }

  $('backToLessonsBtn').addEventListener('click', () => showScreen('lessonsScreen'));

  /* ---- Notebook: auto-numbered notes, local-first + explicit cloud save ---- */
  function notebookLocalKey(lessonId) {
    const user = window.fbAuth.currentUser;
    return `wordCourseNotebook:${user ? user.uid : 'anon'}:${lessonId}`;
  }

  function getLocalNotes(lessonId) {
    try { return JSON.parse(localStorage.getItem(notebookLocalKey(lessonId)) || '[]'); }
    catch (e) { return []; }
  }
  function setLocalNotes(lessonId, notes) {
    localStorage.setItem(notebookLocalKey(lessonId), JSON.stringify(notes));
  }

  function renderNotebook(notes) {
    $('notebookBody').innerHTML = notes.map((note, i) => `
      <div class="note-line">
        <span class="note-num">${i + 1}.</span>
        <span class="note-text">${escapeHtml(note)}</span>
        <button type="button" class="note-delete" data-idx="${i}" title="حذف">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
        </button>
      </div>
    `).join('');
    $('notebookBody').querySelectorAll('.note-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        const notes = getLocalNotes(currentLessonId);
        notes.splice(idx, 1);
        setLocalNotes(currentLessonId, notes);
        renderNotebook(notes);
      });
    });
  }

  function loadNotebook(lessonId) {
    renderNotebook(getLocalNotes(lessonId));
  }

  $('notebookAddBtn').addEventListener('click', () => {
    const input = $('notebookInput');
    const text = input.value.trim();
    if (!text) return;
    const notes = getLocalNotes(currentLessonId);
    notes.push(text);
    setLocalNotes(currentLessonId, notes);
    renderNotebook(notes);
    input.value = '';
  });
  $('notebookInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') $('notebookAddBtn').click();
  });

  $('notebookSaveBtn').addEventListener('click', async () => {
    const user = window.fbAuth.currentUser;
    if (!user) return;
    const notes = getLocalNotes(currentLessonId);
    const btn = $('notebookSaveBtn');
    btn.disabled = true;
    btn.textContent = 'جارٍ الحفظ...';
    try {
      await firebase.firestore()
        .collection('users').doc(user.uid)
        .collection('wordCourseNotebooks').doc('lesson-' + currentLessonId)
        .set({ notes, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
      btn.textContent = 'تم الحفظ ✓';
      setTimeout(() => { btn.textContent = 'حفظ'; btn.disabled = false; }, 1800);
    } catch (e) {
      btn.textContent = 'فشل الحفظ';
      setTimeout(() => { btn.textContent = 'حفظ'; btn.disabled = false; }, 1800);
    }
  });

  /* ---- Chat: private thread per (user, lesson) — teacher replies from the admin panel ---- */
  function loadChat(lessonId) {
    const user = window.fbAuth.currentUser;
    if (!user) return;
    const ref = firebase.firestore()
      .collection('users').doc(user.uid)
      .collection('wordCourseQuestions').doc('lesson-' + lessonId)
      .collection('messages').orderBy('createdAt', 'asc');

    ref.onSnapshot((snap) => {
      const msgs = snap.docs.map((d) => d.data());
      $('chatBody').innerHTML = msgs.map((m) => `
        <div class="msg ${m.from === 'teacher' ? 'teacher' : 'mine'}">${escapeHtml(m.text)}</div>
      `).join('');
      $('chatBody').scrollTop = $('chatBody').scrollHeight;
    });
  }

  $('chatSendBtn').addEventListener('click', async () => {
    const user = window.fbAuth.currentUser;
    if (!user) return;
    const input = $('chatInput');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    await firebase.firestore()
      .collection('users').doc(user.uid)
      .collection('wordCourseQuestions').doc('lesson-' + currentLessonId)
      .collection('messages').add({
        text, from: 'student', lessonId: currentLessonId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    // Flag this thread so it surfaces in the teacher's admin panel.
    await firebase.firestore()
      .collection('users').doc(user.uid)
      .collection('wordCourseQuestions').doc('lesson-' + currentLessonId)
      .set({ lessonId: currentLessonId, lastMessageAt: firebase.firestore.FieldValue.serverTimestamp(), studentUid: user.uid }, { merge: true });
  });
  $('chatInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') $('chatSendBtn').click();
  });

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
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
      // Minimal topbar wiring — this page only needs to show sign-in state,
      // not the full Pro-tier logic that lives in the main site's app.js.
      const authBtn = $('authBtn');
      if (authBtn) {
        authBtn.innerHTML = user
          ? `<span class="auth-avatar">${(user.displayName || user.email || '?')[0].toUpperCase()}</span>`
          : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>`;
      }
      const proBtn = $('proBtn');
      if (proBtn) proBtn.addEventListener('click', () => { window.location.href = '../../index.html'; });

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
