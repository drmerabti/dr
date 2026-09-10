(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  let currentThreadUid = null, currentThreadLessonId = null;

  function showScreen(name) {
    ['loadingScreen', 'deniedScreen', 'panelScreen'].forEach((s) => $(s).classList.add('hidden'));
    $(name).classList.remove('hidden');
  }

  async function isAdminUser(uid) {
    try {
      const doc = await firebase.firestore().collection('users').doc(uid).get();
      return !!(doc.exists && doc.data().isAdmin === true);
    } catch (e) { return false; }
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  async function loadThreads() {
    // Collection-group query: reads the "wordCourseQuestions" subcollection
    // across every user, ordered by most recently active thread first.
    const snap = await firebase.firestore()
      .collectionGroup('wordCourseQuestions')
      .orderBy('lastMessageAt', 'desc')
      .get();

    const threads = snap.docs.map((d) => ({ id: d.id, ref: d.ref, ...d.data() }));

    $('threadList').innerHTML = threads.map((t) => `
      <div class="thread-card" data-uid="${t.studentUid}" data-lesson="${t.lessonId}">
        <div class="meta">
          <span>الدرس ${t.lessonId}</span>
          <span>${t.studentUid.slice(0, 8)}...</span>
        </div>
        <div class="preview">محادثة الطالب</div>
      </div>
    `).join('');

    $('threadList').querySelectorAll('.thread-card').forEach((card) => {
      card.addEventListener('click', () => openThread(card.getAttribute('data-uid'), parseInt(card.getAttribute('data-lesson'), 10), card));
    });

    if (threads.length === 0) {
      $('threadList').innerHTML = `<p style="color:var(--ink-soft); text-align:center;">لا توجد أسئلة بعد.</p>`;
    }
  }

  async function openThread(uid, lessonId, cardEl) {
    currentThreadUid = uid;
    currentThreadLessonId = lessonId;

    document.querySelectorAll('.thread-card').forEach((c) => c.classList.remove('active'));
    if (cardEl) cardEl.classList.add('active');

    $('threadDetail').classList.remove('hidden');
    $('threadDetailHeader').textContent = `الدرس ${lessonId} — ${uid.slice(0, 10)}...`;

    const ref = firebase.firestore()
      .collection('users').doc(uid)
      .collection('wordCourseQuestions').doc('lesson-' + lessonId)
      .collection('messages').orderBy('createdAt', 'asc');

    ref.onSnapshot((snap) => {
      const msgs = snap.docs.map((d) => d.data());
      $('threadDetailBody').innerHTML = msgs.map((m) => `
        <div class="msg ${m.from === 'teacher' ? 'teacher' : 'student'}">${escapeHtml(m.text)}</div>
      `).join('');
      $('threadDetailBody').scrollTop = $('threadDetailBody').scrollHeight;
    });
  }

  $('replySendBtn').addEventListener('click', async () => {
    if (!currentThreadUid) return;
    const input = $('replyInput');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';

    await firebase.firestore()
      .collection('users').doc(currentThreadUid)
      .collection('wordCourseQuestions').doc('lesson-' + currentThreadLessonId)
      .collection('messages').add({
        text, from: 'teacher', lessonId: currentThreadLessonId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
  });
  $('replyInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') $('replySendBtn').click();
  });

  if (window.fbAuth) {
    window.fbAuth.onAuthStateChanged(async (user) => {
      if (!user) { showScreen('deniedScreen'); return; }
      const admin = await isAdminUser(user.uid);
      if (!admin) { showScreen('deniedScreen'); return; }
      showScreen('panelScreen');
      loadThreads();
    });
  } else {
    showScreen('deniedScreen');
  }
})();
