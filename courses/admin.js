/* =====================================================================
   admin.js — courses admin (courses/admin.html), admins only.
   Manages courses/{courseId}, its chapters and lessons in Firestore so
   new lessons and YouTube videos can be added without touching code.
===================================================================== */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const db = () => firebase.firestore();
  const ts = () => firebase.firestore.FieldValue.serverTimestamp();

  const state = { courses: [], courseId: '', chapters: [], lessons: [], editingLessonId: null };

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function status(id, msg, ok) {
    const el = $(id);
    el.textContent = msg || '';
    el.className = 'ad-status ' + (msg ? (ok ? 'ok' : 'err') : '');
    if (msg && ok) setTimeout(() => { if (el.textContent === msg) el.textContent = ''; }, 2500);
  }

  // Accepts a bare 11-char id or any common YouTube URL form.
  function parseYouTubeId(input) {
    const v = String(input || '').trim();
    if (!v) return '';
    if (/^[\w-]{11}$/.test(v)) return v;
    const m = v.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/|\/v\/)([\w-]{11})/);
    return m ? m[1] : null;
  }

  const courseRef = (id) => db().collection('courses').doc(id || state.courseId);
  const byOrder = (a, b) => (a.order || 0) - (b.order || 0);
  const lessonsOf = (chapterId) => state.lessons.filter((l) => l.chapterId === chapterId).sort(byOrder);
  const nextOrder = (list) => list.reduce((m, x) => Math.max(m, x.order || 0), 0) + 1;

  /* ================= Courses ================= */
  async function loadCourses(selectId) {
    const snap = await db().collection('courses').get();
    state.courses = snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => a.id.localeCompare(b.id));
    const sel = $('adCourseSelect');
    sel.innerHTML = '<option value="">— دورة جديدة —</option>' + state.courses.map((c) =>
      `<option value="${escapeHtml(c.id)}">${escapeHtml(c.title_ar || c.id)} (${escapeHtml(c.id)})</option>`).join('');
    let wanted = selectId;
    if (wanted === undefined) {
      try { wanted = localStorage.getItem('coursesAdmin:course') || ''; } catch (e) { wanted = ''; }
    }
    if (!state.courses.some((c) => c.id === wanted)) wanted = state.courses.length ? state.courses[0].id : '';
    sel.value = wanted;
    await selectCourse(wanted);
  }

  async function selectCourse(id) {
    state.courseId = id;
    try { localStorage.setItem('coursesAdmin:course', id); } catch (e) { /* ignore */ }
    const c = state.courses.find((x) => x.id === id) || {};
    $('adCourseId').value = id;
    $('adCourseId').disabled = !!id;
    $('adCourseIdEcho').textContent = id || 'word';
    $('adCourseTitleAr').value = c.title_ar || '';
    $('adCourseTitleEn').value = c.title_en || '';
    $('adCourseDelete').classList.toggle('hidden', !id);
    $('adPreviewLink').href = id ? 'player.html?course=' + encodeURIComponent(id) : '#';
    resetLessonForm();
    await loadStructure();
  }

  $('adCourseSelect').addEventListener('change', (e) => selectCourse(e.target.value));
  $('adCourseId').addEventListener('input', (e) => { $('adCourseIdEcho').textContent = e.target.value || 'word'; });
  $('adCourseNew').addEventListener('click', () => { $('adCourseSelect').value = ''; selectCourse(''); $('adCourseId').focus(); });

  $('adCourseForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = $('adCourseId').value.trim().toLowerCase();
    if (!/^[a-z0-9-]+$/.test(id)) { status('adCourseStatus', 'المعرّف: حروف إنجليزية صغيرة وأرقام و - فقط.'); return; }
    if (!state.courseId && state.courses.some((c) => c.id === id)) {
      status('adCourseStatus', 'هذا المعرّف مستعمل — اختره من القائمة لتعديله.');
      return;
    }
    try {
      await courseRef(id).set({
        title_ar: $('adCourseTitleAr').value.trim(),
        title_en: $('adCourseTitleEn').value.trim(),
        updatedAt: ts(),
      }, { merge: true });
      status('adCourseStatus', 'تم حفظ الدورة ✓', true);
      await loadCourses(id);
    } catch (err) {
      status('adCourseStatus', 'فشل الحفظ: ' + err.message);
    }
  });

  $('adCourseDelete').addEventListener('click', async () => {
    const id = state.courseId;
    if (!id) return;
    const typed = window.prompt(`سيتم حذف الدورة "${id}" وكل فصولها ودروسها نهائيًا.\nاكتب معرّف الدورة للتأكيد:`);
    if (typed !== id) return;
    try {
      const refs = [];
      (await courseRef(id).collection('lessons').get()).forEach((d) => refs.push(d.ref));
      (await courseRef(id).collection('chapters').get()).forEach((d) => refs.push(d.ref));
      refs.push(courseRef(id));
      await commitInChunks(refs.map((ref) => (b) => b.delete(ref)));
      status('adCourseStatus', 'تم حذف الدورة ✓', true);
      await loadCourses('');
    } catch (err) {
      status('adCourseStatus', 'فشل الحذف: ' + err.message);
    }
  });

  // Firestore batches are limited to 500 writes.
  async function commitInChunks(ops) {
    for (let i = 0; i < ops.length; i += 450) {
      const batch = db().batch();
      ops.slice(i, i + 450).forEach((op) => op(batch));
      await batch.commit();
    }
  }

  /* ================= Structure (chapters + lessons) ================= */
  async function loadStructure() {
    if (!state.courseId) {
      state.chapters = []; state.lessons = [];
      renderTree(); renderChapterSelect();
      return;
    }
    $('adTree').innerHTML = '<p class="cp-muted">جارٍ التحميل...</p>';
    try {
      const [ch, ls] = await Promise.all([
        courseRef().collection('chapters').get(),
        courseRef().collection('lessons').get(),
      ]);
      state.chapters = ch.docs.map((d) => ({ id: d.id, ...d.data() })).sort(byOrder);
      state.lessons = ls.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      $('adTree').innerHTML = `<p class="ad-status err">تعذّر التحميل: ${escapeHtml(err.message)}</p>`;
      return;
    }
    renderTree();
    renderChapterSelect();
  }

  function renderChapterSelect() {
    const sel = $('adLessonChapter');
    const keep = sel.value;
    sel.innerHTML = state.chapters.length
      ? state.chapters.map((c) => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.title_ar || c.title_en)}</option>`).join('')
      : '<option value="">أضف فصلًا أولًا</option>';
    if (state.chapters.some((c) => c.id === keep)) sel.value = keep;
  }

  const ARROW_UP = '▲', ARROW_DOWN = '▼';

  function lessonRow(l, i, list) {
    const preview = `player.html?course=${encodeURIComponent(state.courseId)}&lesson=${encodeURIComponent(l.id)}`;
    return `
      <div class="ad-lesson" data-lesson="${escapeHtml(l.id)}">
        <button type="button" class="cp-btn cp-btn-light cp-btn-sm" data-act="lesson-up" ${i === 0 ? 'disabled' : ''}>${ARROW_UP}</button>
        <button type="button" class="cp-btn cp-btn-light cp-btn-sm" data-act="lesson-down" ${i === list.length - 1 ? 'disabled' : ''}>${ARROW_DOWN}</button>
        <div class="ad-lesson-title">${i + 1}. ${escapeHtml(l.title_ar || l.title_en)}
          ${l.title_en ? `<small dir="ltr">${escapeHtml(l.title_en)}</small>` : ''}</div>
        ${l.videoId ? '<span class="ad-badge ok">فيديو ✓</span>' : '<span class="ad-badge soon">قريبًا</span>'}
        <a class="cp-btn cp-btn-light cp-btn-sm" href="${preview}" target="_blank" rel="noopener">معاينة</a>
        <button type="button" class="cp-btn cp-btn-light cp-btn-sm" data-act="lesson-edit">تعديل</button>
        <button type="button" class="cp-btn cp-btn-danger cp-btn-sm" data-act="lesson-del">حذف</button>
      </div>`;
  }

  function renderTree() {
    const tree = $('adTree');
    if (!state.courseId) { tree.innerHTML = '<p class="cp-muted">اختر دورة أو أنشئ واحدة.</p>'; return; }
    if (!state.chapters.length && !state.lessons.length) {
      tree.innerHTML = '<p class="cp-muted">لا توجد فصول بعد — أضف الفصل الأول من النموذج.</p>';
      return;
    }
    let html = state.chapters.map((c, ci) => {
      const list = lessonsOf(c.id);
      return `
        <div class="ad-chapter" data-chapter="${escapeHtml(c.id)}">
          <div class="ad-chapter-head">
            <button type="button" class="cp-btn cp-btn-light cp-btn-sm" data-act="ch-up" ${ci === 0 ? 'disabled' : ''}>${ARROW_UP}</button>
            <button type="button" class="cp-btn cp-btn-light cp-btn-sm" data-act="ch-down" ${ci === state.chapters.length - 1 ? 'disabled' : ''}>${ARROW_DOWN}</button>
            <strong>${escapeHtml(c.title_ar || c.title_en)}${c.title_en ? ` <small class="cp-muted" dir="ltr">— ${escapeHtml(c.title_en)}</small>` : ''}</strong>
            <button type="button" class="cp-btn cp-btn-sm" data-act="ch-add-lesson">+ درس</button>
            <button type="button" class="cp-btn cp-btn-light cp-btn-sm" data-act="ch-rename">تعديل</button>
            <button type="button" class="cp-btn cp-btn-danger cp-btn-sm" data-act="ch-del">حذف</button>
          </div>
          ${list.length ? list.map((l, i) => lessonRow(l, i, list)).join('') : '<div class="ad-lesson cp-muted">لا توجد دروس في هذا الفصل.</div>'}
        </div>`;
    }).join('');

    const known = new Set(state.chapters.map((c) => c.id));
    const orphans = state.lessons.filter((l) => !known.has(l.chapterId)).sort(byOrder);
    if (orphans.length) {
      html += `
        <div class="ad-chapter">
          <div class="ad-chapter-head"><strong>دروس بدون فصل — عدّلها لنقلها إلى فصل</strong></div>
          ${orphans.map((l, i) => lessonRow(l, i, orphans)).join('')}
        </div>`;
    }
    tree.innerHTML = html;
  }

  /* ---- Reordering: rewrite the "order" field of the whole list ---- */
  async function moveItem(list, id, delta, collection) {
    const i = list.findIndex((x) => x.id === id);
    const j = i + delta;
    if (i < 0 || j < 0 || j >= list.length) return;
    const arr = list.slice();
    [arr[i], arr[j]] = [arr[j], arr[i]];
    const batch = db().batch();
    arr.forEach((x, k) => batch.update(courseRef().collection(collection).doc(x.id), { order: k + 1 }));
    await batch.commit();
    await loadStructure();
  }

  $('adTree').addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const act = btn.dataset.act;
    const chEl = btn.closest('[data-chapter]');
    const lsEl = btn.closest('[data-lesson]');
    const chapterId = chEl ? chEl.dataset.chapter : null;
    const lessonId = lsEl ? lsEl.dataset.lesson : null;
    const lesson = state.lessons.find((l) => l.id === lessonId);
    const chapter = state.chapters.find((c) => c.id === chapterId);

    try {
      if (act === 'ch-up' || act === 'ch-down') {
        await moveItem(state.chapters, chapterId, act === 'ch-up' ? -1 : 1, 'chapters');
      } else if (act === 'ch-rename' && chapter) {
        const ar = window.prompt('عنوان الفصل بالعربية:', chapter.title_ar || '');
        if (ar === null) return;
        const en = window.prompt('عنوان الفصل بالإنجليزية:', chapter.title_en || '');
        if (en === null) return;
        await courseRef().collection('chapters').doc(chapterId).update({ title_ar: ar.trim(), title_en: en.trim(), updatedAt: ts() });
        await loadStructure();
      } else if (act === 'ch-del' && chapter) {
        const list = lessonsOf(chapterId);
        const msg = list.length
          ? `حذف الفصل "${chapter.title_ar}" مع ${list.length} درس/دروس؟ لا يمكن التراجع.`
          : `حذف الفصل "${chapter.title_ar}"؟`;
        if (!window.confirm(msg)) return;
        await commitInChunks([
          ...list.map((l) => (b) => b.delete(courseRef().collection('lessons').doc(l.id))),
          (b) => b.delete(courseRef().collection('chapters').doc(chapterId)),
        ]);
        await loadStructure();
      } else if (act === 'ch-add-lesson') {
        resetLessonForm();
        $('adLessonChapter').value = chapterId;
        $('adLessonTitleAr').focus();
        $('adLessonForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if ((act === 'lesson-up' || act === 'lesson-down') && lesson) {
        const known = state.chapters.some((c) => c.id === lesson.chapterId);
        const list = known ? lessonsOf(lesson.chapterId) : state.lessons.filter((l) => !state.chapters.some((c) => c.id === l.chapterId)).sort(byOrder);
        await moveItem(list, lessonId, act === 'lesson-up' ? -1 : 1, 'lessons');
      } else if (act === 'lesson-edit' && lesson) {
        startEditLesson(lesson);
      } else if (act === 'lesson-del' && lesson) {
        if (!window.confirm(`حذف الدرس "${lesson.title_ar || lesson.title_en}"؟`)) return;
        await courseRef().collection('lessons').doc(lessonId).delete();
        if (state.editingLessonId === lessonId) resetLessonForm();
        await loadStructure();
      }
    } catch (err) {
      window.alert('حدث خطأ: ' + err.message);
    }
  });

  /* ================= Chapter form ================= */
  $('adChapterForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!state.courseId) { status('adChapterStatus', 'احفظ الدورة أولًا.'); return; }
    try {
      const ref = await courseRef().collection('chapters').add({
        title_ar: $('adChapterTitleAr').value.trim(),
        title_en: $('adChapterTitleEn').value.trim(),
        order: nextOrder(state.chapters),
        createdAt: ts(),
      });
      $('adChapterForm').reset();
      status('adChapterStatus', 'تمت إضافة الفصل ✓', true);
      await loadStructure();
      $('adLessonChapter').value = ref.id;
    } catch (err) {
      status('adChapterStatus', 'فشل الحفظ: ' + err.message);
    }
  });

  /* ================= Lesson form (add / edit) ================= */
  function resetLessonForm() {
    state.editingLessonId = null;
    const keepChapter = $('adLessonChapter').value;
    $('adLessonForm').reset();
    if (keepChapter) $('adLessonChapter').value = keepChapter;
    $('adLessonFormTitle').textContent = 'إضافة درس';
    $('adLessonSave').textContent = 'إضافة الدرس';
    $('adLessonCancel').classList.add('hidden');
    status('adLessonStatus', '');
  }

  function startEditLesson(lesson) {
    state.editingLessonId = lesson.id;
    if (state.chapters.some((c) => c.id === lesson.chapterId)) $('adLessonChapter').value = lesson.chapterId;
    $('adLessonTitleAr').value = lesson.title_ar || '';
    $('adLessonTitleEn').value = lesson.title_en || '';
    $('adLessonVideo').value = lesson.videoId || '';
    $('adLessonFormTitle').textContent = 'تعديل الدرس';
    $('adLessonSave').textContent = 'حفظ التعديلات';
    $('adLessonCancel').classList.remove('hidden');
    $('adLessonForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  $('adLessonCancel').addEventListener('click', resetLessonForm);

  $('adLessonForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!state.courseId) { status('adLessonStatus', 'احفظ الدورة أولًا.'); return; }
    const chapterId = $('adLessonChapter').value;
    if (!chapterId) { status('adLessonStatus', 'أضف فصلًا أولًا.'); return; }
    const videoId = parseYouTubeId($('adLessonVideo').value);
    if (videoId === null) { status('adLessonStatus', 'رابط/معرّف YouTube غير صالح.'); return; }

    const data = {
      chapterId,
      title_ar: $('adLessonTitleAr').value.trim(),
      title_en: $('adLessonTitleEn').value.trim(),
      videoId,
      updatedAt: ts(),
    };
    try {
      const col = courseRef().collection('lessons');
      if (state.editingLessonId) {
        const old = state.lessons.find((l) => l.id === state.editingLessonId);
        if (!old || old.chapterId !== chapterId) data.order = nextOrder(lessonsOf(chapterId));
        await col.doc(state.editingLessonId).update(data);
        status('adLessonStatus', 'تم حفظ التعديلات ✓', true);
      } else {
        data.order = nextOrder(lessonsOf(chapterId));
        data.createdAt = ts();
        await col.add(data);
        status('adLessonStatus', 'تمت إضافة الدرس ✓', true);
      }
      const msg = $('adLessonStatus').textContent;
      resetLessonForm();
      status('adLessonStatus', msg, true);
      await loadStructure();
    } catch (err) {
      status('adLessonStatus', 'فشل الحفظ: ' + err.message);
    }
  });

  /* ================= Init ================= */
  window.courseGuard.then(() => {
    loadCourses().catch((err) => {
      $('adTree').innerHTML = `<p class="ad-status err">تعذّر تحميل الدورات: ${escapeHtml(err.message)}</p>`;
    });
  });
})();
