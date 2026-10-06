/* =====================================================================
   player.js — shared course player (courses/player.html?course=word)
   ---------------------------------------------------------------------
   Firestore layout (see firestore-courses.rules):
     courses/{courseId}                      title_ar, title_en
     courses/{courseId}/chapters/{chapterId} title_ar, title_en, order
     courses/{courseId}/lessons/{lessonId}   chapterId, title_ar, title_en, order, videoId
     users/{uid}/courseProgress/{courseId}   watched{lessonId:true}, lastLessonId, percent
   The YouTube video id only ever arrives from Firestore (rules-protected);
   nothing about the videos is hard-coded in this page.
===================================================================== */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(window.location.search);
  const COURSE = params.get('course') || '';

  /* ================= Language (same "site_lang" key as the main site) ================= */
  let lang = localStorage.getItem('site_lang') || 'ar';
  const I18N = {
    ar: {
      loading: 'جارٍ التحميل...', back_courses: 'الدورات', toggle_list: 'قائمة الدروس',
      no_lessons_title: 'لا توجد دروس بعد', no_lessons_desc: 'ستُضاف دروس هذه الدورة قريبًا.',
      load_error: 'تعذّر تحميل الدورة. حاول مرة أخرى.',
      soon: 'قريبًا ✨', soon_desc: 'فيديو هذا الدرس قيد الإعداد.',
      prev: 'الدرس السابق', next: 'الدرس التالي',
      mark_watched: 'تحديد كمُشاهَد', watched: 'تمت المشاهدة',
      lesson: 'الدرس', other_chapter: 'دروس أخرى', complete: 'مكتمل',
    },
    en: {
      loading: 'Loading...', back_courses: 'Courses', toggle_list: 'Lessons list',
      no_lessons_title: 'No lessons yet', no_lessons_desc: 'Lessons for this course are coming soon.',
      load_error: 'Could not load the course. Please try again.',
      soon: 'Coming soon ✨', soon_desc: 'This lesson video is being prepared.',
      prev: 'Previous lesson', next: 'Next lesson',
      mark_watched: 'Mark as watched', watched: 'Watched',
      lesson: 'Lesson', other_chapter: 'Other lessons', complete: 'complete',
    },
  };
  const t = (k) => (I18N[lang] && I18N[lang][k]) || I18N.ar[k] || k;
  const pick = (obj, base) => (lang === 'en' && obj[base + '_en']) ? obj[base + '_en'] : (obj[base + '_ar'] || obj[base + '_en'] || '');

  function applyLanguage() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    const toggle = $('langToggle');
    if (toggle) toggle.textContent = lang === 'ar' ? 'EN' : 'AR';
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.getAttribute('data-i18n')); });
    localStorage.setItem('site_lang', lang);
  }

  /* ================= Icons ================= */
  const ICON = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
    vol: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg>',
    mute: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor"/><path d="M23 9l-6 6"/><path d="M17 9l6 6"/></svg>',
    fs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9V4h5"/><path d="M20 9V4h-5"/><path d="M4 15v5h5"/><path d="M20 15v5h-5"/></svg>',
    fsExit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 4v5H4"/><path d="M15 4v5h5"/><path d="M9 20v-5H4"/><path d="M15 20v-5h5"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    arrowL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>',
    arrowR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>',
  };

  /* ================= State ================= */
  const state = {
    user: null,
    course: {},
    groups: [],      // [{ chapter, lessons: [] }] in display order
    lessons: [],     // flat list in display order
    watched: {},     // lessonId -> true
    index: -1,       // current lesson index in state.lessons
  };
  const current = () => state.lessons[state.index] || null;

  function progressRef() {
    return firebase.firestore().collection('users').doc(state.user.uid)
      .collection('courseProgress').doc(COURSE);
  }

  /* ================= Basic page protection ================= */
  function isEditable(el) {
    return el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
  }
  function installProtection() {
    ['contextmenu', 'copy', 'cut', 'dragstart', 'selectstart'].forEach((type) => {
      document.addEventListener(type, (e) => {
        if (type === 'selectstart' && isEditable(e.target)) return;
        e.preventDefault();
      });
    });
    document.addEventListener('keydown', (e) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const code = e.code;
      const blocked =
        e.key === 'F12' ||
        (ctrl && ['KeyU', 'KeyS', 'KeyP'].includes(code)) ||
        (ctrl && e.shiftKey && ['KeyI', 'KeyJ', 'KeyC'].includes(code)) ||
        (e.metaKey && e.altKey && ['KeyI', 'KeyJ', 'KeyC', 'KeyU'].includes(code));
      if (blocked) { e.preventDefault(); e.stopPropagation(); }
    }, true);
  }

  /* ================= Data ================= */
  async function loadCourse() {
    const db = firebase.firestore();
    const cref = db.collection('courses').doc(COURSE);
    const [courseDoc, chSnap, lsSnap, progDoc] = await Promise.all([
      cref.get().catch(() => null),
      cref.collection('chapters').orderBy('order').get(),
      cref.collection('lessons').orderBy('order').get(),
      progressRef().get().catch(() => null),
    ]);

    state.course = courseDoc && courseDoc.exists ? courseDoc.data() : {};
    const chapters = chSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const lessons = lsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const known = new Set(chapters.map((c) => c.id));
    state.groups = chapters.map((c) => ({ chapter: c, lessons: lessons.filter((l) => l.chapterId === c.id) }));
    const orphans = lessons.filter((l) => !known.has(l.chapterId));
    if (orphans.length) state.groups.push({ chapter: null, lessons: orphans });
    state.groups = state.groups.filter((g) => g.lessons.length);
    state.lessons = state.groups.flatMap((g) => g.lessons);

    const prog = progDoc && progDoc.exists ? progDoc.data() : {};
    state.watched = Object.assign({}, prog.watched || {});
    return prog;
  }

  /* ================= Sidebar + progress ================= */
  function percentDone() {
    if (!state.lessons.length) return 0;
    const done = state.lessons.filter((l) => state.watched[l.id]).length;
    return Math.round((done / state.lessons.length) * 100);
  }

  function renderProgress() {
    const pct = percentDone();
    $('cpProgressFill').style.width = pct + '%';
    $('cpProgressText').textContent = pct + '% ' + t('complete');
  }

  function renderSidebar() {
    $('cpCourseTitle').textContent = pick(state.course, 'title') || COURSE;
    document.title = ($('cpCourseTitle').textContent || '') + ' — أكاديمية مرابطي';
    const list = $('cpSideList');
    list.innerHTML = '';
    let n = 0;
    state.groups.forEach((g) => {
      const box = document.createElement('div');
      box.className = 'cp-chapter';
      const head = document.createElement('div');
      head.className = 'cp-chapter-title';
      head.textContent = g.chapter ? pick(g.chapter, 'title') : t('other_chapter');
      box.appendChild(head);
      g.lessons.forEach((lesson) => {
        const idx = n++;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cp-lesson-item';
        btn.dataset.index = String(idx);
        btn.innerHTML = '<span class="cp-check"></span><span class="cp-lesson-name"></span>';
        btn.querySelector('.cp-lesson-name').textContent = pick(lesson, 'title');
        if (!lesson.videoId) {
          const soon = document.createElement('span');
          soon.className = 'cp-soon-tag';
          soon.textContent = lang === 'ar' ? 'قريبًا' : 'Soon';
          btn.appendChild(soon);
        }
        btn.addEventListener('click', () => {
          openLesson(idx);
          if (window.matchMedia('(max-width: 980px)').matches) $('cpSidebar').classList.add('collapsed');
        });
        box.appendChild(btn);
      });
      list.appendChild(box);
    });
    renderSidebarMarks();
    renderProgress();
  }

  function renderSidebarMarks() {
    document.querySelectorAll('.cp-lesson-item').forEach((btn) => {
      const idx = parseInt(btn.dataset.index, 10);
      const lesson = state.lessons[idx];
      const done = !!state.watched[lesson.id];
      btn.classList.toggle('watched', done);
      btn.classList.toggle('active', idx === state.index);
      btn.querySelector('.cp-check').innerHTML = done ? ICON.check : String(idx + 1);
    });
  }

  /* ================= Lesson view ================= */
  function renderHead() {
    const lesson = current();
    if (!lesson) return;
    const group = state.groups.find((g) => g.lessons.includes(lesson));
    $('cpChapterLabel').textContent = group && group.chapter ? pick(group.chapter, 'title') : '';
    $('cpLessonTitle').textContent = `${t('lesson')} ${state.index + 1} — ${pick(lesson, 'title')}`;
    renderWatchedBtn();
    renderNav();
  }

  function renderWatchedBtn() {
    const lesson = current();
    const btn = $('cpWatchedBtn');
    const done = !!(lesson && state.watched[lesson.id]);
    btn.className = 'cp-btn ' + (done ? 'cp-btn-done' : 'cp-btn-light');
    btn.innerHTML = (done ? ICON.check : '') + `<span>${done ? t('watched') : t('mark_watched')}</span>`;
  }

  function renderNav() {
    const rtl = lang === 'ar';
    const prev = $('cpPrevBtn'), next = $('cpNextBtn');
    prev.innerHTML = (rtl ? ICON.arrowR : ICON.arrowL) + `<span>${t('prev')}</span>`;
    next.innerHTML = `<span>${t('next')}</span>` + (rtl ? ICON.arrowL : ICON.arrowR);
    prev.disabled = state.index <= 0;
    next.disabled = state.index >= state.lessons.length - 1;
  }

  function openLesson(idx) {
    if (idx < 0 || idx >= state.lessons.length) return;
    state.index = idx;
    autoMarked = false;
    const lesson = current();
    renderHead();
    renderSidebarMarks();

    const url = new URL(window.location.href);
    url.searchParams.set('lesson', lesson.id);
    window.history.replaceState(null, '', url.toString());
    progressRef().set({
      lastLessonId: lesson.id,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true }).catch(() => { /* progress is best-effort */ });

    showVideo(lesson.videoId || '');
  }

  async function setWatched(lessonId, value) {
    if (!!state.watched[lessonId] === value) return;
    if (value) state.watched[lessonId] = true; else delete state.watched[lessonId];
    renderSidebarMarks();
    renderProgress();
    renderWatchedBtn();
    try {
      await progressRef().set({
        watched: { [lessonId]: value ? true : firebase.firestore.FieldValue.delete() },
        percent: percentDone(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    } catch (e) { /* keep local state; next change retries */ }
  }

  /* ================= Protected YouTube player ================= */
  let ytApi = null, player = null, playerReady = false, wantedId = '', loadedId = '';
  let tickTimer = null, idleTimer = null, isPlaying = false, autoMarked = false, dragging = false;
  const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  function loadYtApi() {
    if (ytApi) return ytApi;
    ytApi = new Promise((resolve) => {
      if (window.YT && window.YT.Player) { resolve(); return; }
      const prevCb = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { if (prevCb) prevCb(); resolve(); };
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    });
    return ytApi;
  }

  async function showVideo(videoId) {
    wantedId = videoId;
    const hasVideo = !!videoId;
    $('cpSoon').classList.toggle('hidden', hasVideo);
    $('cpControls').classList.toggle('hidden', !hasVideo);
    $('cpWatermark').classList.toggle('hidden', !hasVideo);
    setCover(true);
    resetBar();
    if (!hasVideo) { if (playerReady) player.stopVideo(); return; }

    await loadYtApi();
    if (wantedId !== videoId) return; // user switched lesson meanwhile
    if (!player) {
      const vars = {
        controls: 0, rel: 0, modestbranding: 1, disablekb: 1, fs: 0,
        iv_load_policy: 3, playsinline: 1, cc_load_policy: 0, enablejsapi: 1,
      };
      if (window.location.origin && window.location.origin !== 'null') vars.origin = window.location.origin;
      loadedId = videoId;
      player = new YT.Player('cpYt', {
        host: 'https://www.youtube-nocookie.com',
        videoId,
        width: '100%', height: '100%',
        playerVars: vars,
        events: { onReady: onPlayerReady, onStateChange: onPlayerState },
      });
      return;
    }
    if (playerReady && loadedId !== videoId) { loadedId = videoId; player.cueVideoById(videoId); }
  }

  function onPlayerReady() {
    playerReady = true;
    const iframe = player.getIframe();
    iframe.setAttribute('tabindex', '-1');
    iframe.removeAttribute('allowfullscreen');
    player.setVolume(parseInt($('cpVolume').value, 10));
    if (wantedId && wantedId !== loadedId) { loadedId = wantedId; player.cueVideoById(wantedId); }
    if (!wantedId) player.stopVideo();
  }

  function onPlayerState(e) {
    const S = YT.PlayerState;
    isPlaying = e.data === S.PLAYING || e.data === S.BUFFERING;
    $('cpPlayBtn').innerHTML = isPlaying ? ICON.pause : ICON.play;
    setCover(!isPlaying);
    if (isPlaying) startTick(); else { stopTick(); tick(); }
    if (e.data === S.ENDED) {
      const lesson = current();
      if (lesson) setWatched(lesson.id, true);
    }
    pokeIdle();
  }

  function setCover(show) { $('cpCover').classList.toggle('hidden-soft', !show); }

  function play() { if (playerReady && wantedId) player.playVideo(); }
  function pause() { if (playerReady && isPlaying) player.pauseVideo(); }
  function togglePlay() { if (isPlaying) pause(); else play(); }

  function fmt(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    const ss = String(s).padStart(2, '0');
    return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
  }

  function resetBar() {
    $('cpBarFill').style.width = '0%';
    $('cpBarBuffer').style.width = '0%';
    $('cpBarKnob').style.left = '0%';
    $('cpTime').textContent = '0:00 / 0:00';
  }

  function paintBar(frac) {
    const pct = (Math.min(1, Math.max(0, frac)) * 100) + '%';
    $('cpBarFill').style.width = pct;
    $('cpBarKnob').style.left = pct;
  }

  function tick() {
    if (!playerReady || !wantedId) return;
    const dur = player.getDuration() || 0;
    const cur = player.getCurrentTime() || 0;
    if (!dragging) paintBar(dur ? cur / dur : 0);
    $('cpBarBuffer').style.width = ((player.getVideoLoadedFraction() || 0) * 100) + '%';
    $('cpTime').textContent = `${fmt(cur)} / ${fmt(dur)}`;
    // Watching 90% of a lesson counts as watched.
    const lesson = current();
    if (!autoMarked && lesson && dur > 0 && cur / dur >= 0.9) {
      autoMarked = true;
      setWatched(lesson.id, true);
    }
  }
  function startTick() { if (!tickTimer) tickTimer = setInterval(tick, 250); }
  function stopTick() { clearInterval(tickTimer); tickTimer = null; }

  function seekFromEvent(e) {
    const rect = $('cpBar').getBoundingClientRect();
    return Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
  }

  function setupBar() {
    const bar = $('cpBar');
    bar.addEventListener('pointerdown', (e) => {
      if (!playerReady) return;
      dragging = true;
      bar.setPointerCapture(e.pointerId);
      paintBar(seekFromEvent(e));
    });
    bar.addEventListener('pointermove', (e) => { if (dragging) paintBar(seekFromEvent(e)); });
    const finish = (e) => {
      if (!dragging) return;
      dragging = false;
      const dur = player.getDuration() || 0;
      if (dur) player.seekTo(seekFromEvent(e) * dur, true);
      tick();
    };
    bar.addEventListener('pointerup', finish);
    bar.addEventListener('pointercancel', () => { dragging = false; });
  }

  function renderVolumeIcon() {
    const muted = playerReady && (player.isMuted() || player.getVolume() === 0);
    $('cpMuteBtn').innerHTML = muted ? ICON.mute : ICON.vol;
  }

  function setupVolume() {
    $('cpVolume').addEventListener('input', (e) => {
      if (!playerReady) return;
      const v = parseInt(e.target.value, 10);
      player.setVolume(v);
      if (v > 0 && player.isMuted()) player.unMute();
      setTimeout(renderVolumeIcon, 50);
    });
    $('cpMuteBtn').addEventListener('click', () => {
      if (!playerReady) return;
      if (player.isMuted()) player.unMute(); else player.mute();
      setTimeout(renderVolumeIcon, 50);
    });
  }

  function setupSpeed() {
    const menu = $('cpSpeedMenu');
    menu.innerHTML = SPEEDS.map((r) => `<button type="button" data-rate="${r}">${r}x</button>`).join('');
    $('cpSpeedBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      menu.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.rate === $('cpSpeedBtn').dataset.rate || (!$('cpSpeedBtn').dataset.rate && b.dataset.rate === '1')));
      menu.classList.toggle('hidden');
    });
    menu.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-rate]');
      if (!b || !playerReady) return;
      const rate = parseFloat(b.dataset.rate);
      player.setPlaybackRate(rate);
      $('cpSpeedBtn').dataset.rate = b.dataset.rate;
      $('cpSpeedBtn').textContent = rate + 'x';
      menu.classList.add('hidden');
    });
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target)) menu.classList.add('hidden');
    });
  }

  /* ---- Fullscreen on the player container (never on the iframe) ---- */
  const fsElement = () => document.fullscreenElement || document.webkitFullscreenElement;
  function renderFsIcon() {
    const on = !!fsElement() || $('cpWrap').classList.contains('cp-pseudo-fs');
    $('cpFsBtn').innerHTML = on ? ICON.fsExit : ICON.fs;
  }
  function toggleFullscreen() {
    const wrap = $('cpWrap');
    if (fsElement()) {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      return;
    }
    if (wrap.classList.contains('cp-pseudo-fs')) {
      wrap.classList.remove('cp-pseudo-fs');
      renderFsIcon();
      return;
    }
    const req = wrap.requestFullscreen || wrap.webkitRequestFullscreen;
    const fallback = () => { wrap.classList.add('cp-pseudo-fs'); renderFsIcon(); };
    if (!req) { fallback(); return; }
    try {
      const p = req.call(wrap);
      if (p && p.catch) p.catch(fallback);
    } catch (e) { fallback(); }
  }

  /* ---- Auto-hide controls while playing ---- */
  function pokeIdle() {
    const wrap = $('cpWrap');
    wrap.classList.remove('idle');
    clearTimeout(idleTimer);
    if (isPlaying) idleTimer = setTimeout(() => wrap.classList.add('idle'), 2600);
  }

  /* ---- Moving watermark with the signed-in user's email ---- */
  function startWatermark() {
    const wm = $('cpWatermark');
    wm.textContent = state.user.email || state.user.uid;
    const move = () => {
      wm.style.top = (6 + Math.random() * 74) + '%';
      wm.style.left = (4 + Math.random() * 56) + '%';
    };
    move();
    setInterval(move, 4000);
  }

  function setupPlayerUi() {
    $('cpPlayBtn').innerHTML = ICON.play;
    $('cpMuteBtn').innerHTML = ICON.vol;
    $('cpFsBtn').innerHTML = ICON.fs;

    $('cpShield').addEventListener('click', togglePlay);
    $('cpShield').addEventListener('dblclick', toggleFullscreen);
    $('cpCover').addEventListener('click', play);
    $('cpPlayBtn').addEventListener('click', togglePlay);
    $('cpFsBtn').addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', renderFsIcon);
    document.addEventListener('webkitfullscreenchange', renderFsIcon);

    const wrap = $('cpWrap');
    ['mousemove', 'touchstart', 'pointerdown'].forEach((ev) => wrap.addEventListener(ev, pokeIdle, { passive: true }));
    wrap.addEventListener('contextmenu', (e) => e.preventDefault());

    setupBar();
    setupVolume();
    setupSpeed();

    // Our own keyboard shortcuts (YouTube's are disabled with disablekb=1).
    document.addEventListener('keydown', (e) => {
      if (isEditable(e.target) || e.ctrlKey || e.metaKey || e.altKey || !playerReady || !wantedId) return;
      const k = e.key.toLowerCase();
      if (k === ' ' || k === 'k') { e.preventDefault(); togglePlay(); }
      else if (k === 'f') { toggleFullscreen(); }
      else if (k === 'm') { $('cpMuteBtn').click(); }
      else if (k === 'arrowright' || k === 'arrowleft') {
        e.preventDefault();
        const delta = k === 'arrowright' ? 5 : -5;
        player.seekTo(Math.max(0, (player.getCurrentTime() || 0) + delta), true);
        tick();
      }
      else if (k === 'escape' && wrap.classList.contains('cp-pseudo-fs')) { toggleFullscreen(); }
    });

    // Leaving the tab / minimizing the window pauses the lesson.
    document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
    window.addEventListener('pagehide', pause);
  }

  /* ================= Init ================= */
  function setupChrome() {
    $('langToggle').addEventListener('click', () => {
      lang = lang === 'ar' ? 'en' : 'ar';
      applyLanguage();
      if (state.lessons.length) { renderSidebar(); renderHead(); }
    });
    $('cpPrevBtn').addEventListener('click', () => openLesson(state.index - 1));
    $('cpNextBtn').addEventListener('click', () => openLesson(state.index + 1));
    $('cpWatchedBtn').addEventListener('click', () => {
      const lesson = current();
      if (lesson) setWatched(lesson.id, !state.watched[lesson.id]);
    });
    $('cpSidebarToggle').addEventListener('click', () => $('cpSidebar').classList.toggle('collapsed'));
    if (window.matchMedia('(max-width: 980px)').matches) $('cpSidebar').classList.add('collapsed');
  }

  applyLanguage();
  installProtection();

  window.courseGuard.then(async ({ user }) => {
    state.user = user;
    setupChrome();
    setupPlayerUi();
    let prog = {};
    try {
      prog = await loadCourse();
    } catch (e) {
      $('cpLoading').textContent = t('load_error');
      return;
    }
    $('cpLoading').classList.add('hidden');
    if (!state.lessons.length) { $('cpEmpty').classList.remove('hidden'); return; }

    $('cpLayout').classList.remove('hidden');
    renderSidebar();
    startWatermark();
    const wanted = params.get('lesson') || prog.lastLessonId;
    const startIdx = Math.max(0, state.lessons.findIndex((l) => l.id === wanted));
    openLesson(startIdx);
  });
})();
