/* =====================================================================
   Keyboard typing trainer — logic
   Depends on data.js (window.TT_DATA)
   ===================================================================== */
(function () {
  'use strict';

  var D = window.TT_DATA;
  var $ = function (id) { return document.getElementById(id); };

  /* ---------------- storage ---------------- */
  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  var state = {
    lang: LS.get('tt_lang', 'ar'),
    layout: null,
    sound: LS.get('tt_sound', true),
    showKb: LS.get('tt_kb', true),
    showHands: LS.get('tt_hands', true),
    progress: LS.get('tt_progress', {}),
    history: LS.get('tt_history', []),
    progFilter: { stage: 'all', days: 30 },
    user: null, db: null,
    screen: 'stagesScreen',
    stageIdx: 0
  };
  if (!D.I18N[state.lang]) state.lang = 'ar';
  state.layout = LS.get('tt_layout', state.lang);
  if (!D.LAYOUTS[state.layout]) state.layout = 'ar';

  function T() { return D.I18N[state.lang]; }
  function fmt(s, o) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return o[k] != null ? o[k] : m; }); }

  /* ---------------- layouts ---------------- */
  function prepLayout(L) {
    L.byCode = {}; L.map = {};
    L.rows.forEach(function (r) { r.forEach(function (k) { L.byCode[k.code] = k; }); });
    var dead = L.dead || [];
    L.rows.forEach(function (r) { r.forEach(function (k) {
      if (k.special || dead.indexOf(k.code) >= 0) return;
      if (k.base && Array.from(k.base).length === 1 && !L.map[k.base]) L.map[k.base] = { key: k, shift: false };
    }); });
    L.rows.forEach(function (r) { r.forEach(function (k) {
      if (k.special || dead.indexOf(k.code) >= 0) return;
      if (k.shift && Array.from(k.shift).length === 1 && !L.map[k.shift]) L.map[k.shift] = { key: k, shift: true };
    }); });
  }
  Object.keys(D.LAYOUTS).forEach(function (id) { prepLayout(D.LAYOUTS[id]); });
  function LAY() { return D.LAYOUTS[state.layout]; }

  /* ---------------- helpers ---------------- */
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }
  function typeable(L, s) { return Array.from(s).every(function (c) { return c === ' ' || !!L.map[c]; }); }

  /* ---------------- exercise generators ---------------- */
  function drill(newK, pool, len) {
    len = len || 34;
    var out = [], total = 0;
    while (total < len) {
      var g = rnd(2, 4), s = '';
      for (var i = 0; i < g; i++) s += (newK.length && Math.random() < 0.6) ? pick(newK) : pick(pool);
      out.push(s); total += s.length + 1;
    }
    return out.join(' ');
  }
  function wordsFrom(list, n) { return shuffle(list).slice(0, n).join(' '); }
  function textsFrom(list, n) { return shuffle(list).slice(0, n).join(' '); }

  var HOME = ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon'];
  var TOP = ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP'];
  var BOT = ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash'];
  var TARGET_WPM = [8, 10, 10, 12, 12, 10, 18, 22];

  function buildStages(L) {
    var lid = L.id;
    function chs(codes) {
      return codes.map(function (c) { return L.byCode[c]; }).filter(function (k) {
        return k && !k.special && Array.from(k.base).length === 1 && (L.dead || []).indexOf(k.code) < 0;
      }).map(function (k) { return k.base; });
    }
    function wordsWith(allowed) {
      return uniq(D.WORDS[lid]).filter(function (w) { return Array.from(w).every(function (c) { return allowed.indexOf(c) >= 0; }); });
    }
    function rowStage(pairs, prev, rowCodes) {
      var ex = [], learned = prev.slice();
      pairs.forEach(function (p) {
        var nk = chs(p);
        if (!nk.length) return;
        learned = uniq(learned.concat(nk));
        var pool = learned.slice(), first = ex.length === 0 && !prev.length;
        ex.push({ kind: 'keys', keys: nk, mode: 'tiles', intro: true, gen: function () { return drill(nk, first ? nk : pool, 30); } });
      });
      var rowChars = chs(rowCodes), all = learned.slice();
      ex.push({ kind: 'review', mode: 'tiles', gen: function () { return drill(rowChars, all, 36); } });
      var list = wordsWith(all);
      ex.push({ kind: 'words', mode: 'text', gen: function () { return list.length >= 6 ? wordsFrom(list, 8) : drill(rowChars, all, 40); } });
      return { ex: ex, learned: learned };
    }

    var stages = [];
    var s1 = rowStage([['KeyF', 'KeyJ'], ['KeyD', 'KeyK'], ['KeyS', 'KeyL'], ['KeyA', 'Semicolon'], ['KeyG', 'KeyH']], [], HOME);
    stages.push(s1.ex);
    var s2 = rowStage([['KeyR', 'KeyU'], ['KeyE', 'KeyI'], ['KeyW', 'KeyO'], ['KeyQ', 'KeyP'], ['KeyT', 'KeyY']], s1.learned, TOP);
    stages.push(s2.ex);
    var s3 = rowStage([['KeyV', 'KeyM'], ['KeyC', 'Comma'], ['KeyX', 'Period'], ['KeyZ', 'Slash'], ['KeyB', 'KeyN']], s2.learned, BOT);
    stages.push(s3.ex);
    var letters = s3.learned.filter(function (c) { return /\p{L}/u.test(c); });

    /* stage 4: words */
    var wl = wordsWith(letters.concat(chs(['BracketLeft', 'BracketRight', 'Quote'])).concat(['ء', 'ة']));
    var s4 = [];
    for (var i = 0; i < 6; i++) s4.push({ kind: 'words', mode: 'text', intro: i === 0, gen: function () { return wordsFrom(wl, 9); } });
    stages.push(s4);

    /* stage 5: shift */
    var s5 = [], homeLow = chs(HOME).filter(function (c) { return /\p{L}/u.test(c); });
    var shiftList = D.SHIFT_TEXT[lid].filter(function (t) { return typeable(L, t); });
    if (lid === 'ar') {
      var sh = ['أ', 'إ', 'آ', 'ـ', '،', '؟'].filter(function (c) { return L.map[c]; });
      s5.push({ kind: 'keys', keys: sh.slice(0, 3), mode: 'tiles', intro: true, gen: function () {
        var out = []; for (var n = 0; n < 9; n++) out.push(pick(sh.slice(0, 3)) + pick(homeLow) + (Math.random() < .5 ? pick(homeLow) : '')); return out.join(' ');
      } });
    } else {
      var up = homeLow.concat(chs(TOP)).filter(function (c) { return /\p{L}/u.test(c); });
      s5.push({ kind: 'keys', keys: ['⇧'], mode: 'tiles', intro: true, gen: function () {
        var out = []; for (var n = 0; n < 9; n++) { var c = pick(up); out.push(c.toUpperCase() + pick(homeLow) + (Math.random() < .5 ? pick(homeLow) : '')); } return out.join(' ');
      } });
    }
    for (var j = 0; j < 4; j++) s5.push({ kind: 'capitals', mode: 'text', gen: function () { return textsFrom(shiftList, 2); } });
    stages.push(s5);

    /* stage 6: numbers & symbols */
    var d1 = ['1', '2', '3', '4', '5'], d2 = ['6', '7', '8', '9', '0'], dAll = d1.concat(d2);
    var sym = ['-', '+', '=', '(', ')', '!', '?', '%', '/', ':', '@', '#', '*', '؟'].filter(function (c) { return L.map[c]; });
    var numList = D.NUM_TEXT[lid].filter(function (t) { return typeable(L, t); });
    var s6 = [
      { kind: 'keys', keys: d1, mode: 'tiles', intro: true, gen: function () { return drill(d1, d1, 30); } },
      { kind: 'keys', keys: d2, mode: 'tiles', intro: true, gen: function () { return drill(d2, dAll, 30); } },
      { kind: 'numbers', mode: 'tiles', gen: function () { var o = []; for (var n = 0; n < 8; n++) o.push(String(rnd(10, 9999))); return o.join(' '); } },
      { kind: 'symbols', keys: sym.slice(0, 6), mode: 'tiles', intro: true, gen: function () { return drill(sym, sym.concat(dAll), 30); } },
      { kind: 'numbers', mode: 'text', gen: function () { return textsFrom(numList, 2); } }
    ];
    stages.push(s6);

    /* stage 7: sentences */
    var sent = D.SENTENCES[lid].filter(function (t) { return typeable(L, t); });
    var s7 = [];
    for (var k = 0; k < 6; k++) s7.push({ kind: 'sentences', mode: 'text', intro: k === 0, gen: function () { return textsFrom(sent, 2); } });
    stages.push(s7);

    /* stage 8: speed + blind */
    var s8 = [];
    for (var m = 0; m < 3; m++) s8.push({ kind: 'paragraph', mode: 'text', intro: m === 0, gen: function () { return textsFrom(sent, 4); } });
    for (var q = 0; q < 2; q++) s8.push({ kind: 'blind', mode: 'text', blind: true, intro: q === 0, gen: function () { return textsFrom(sent, 3); } });
    stages.push(s8);

    return stages;
  }

  var STAGES = {};
  Object.keys(D.LAYOUTS).forEach(function (id) { STAGES[id] = buildStages(D.LAYOUTS[id]); });
  function ST() { return STAGES[state.layout]; }

  function exLabel(ex) {
    var t = T();
    if (ex.kind === 'keys') return ex.keys.join(' ');
    return { review: t.review, words: t.words, capitals: t.capitals, numbers: t.numbers, symbols: t.symbols, sentences: t.sentences, paragraph: t.paragraph, blind: t.blind }[ex.kind] || t.practiceText;
  }
  function stageName(i, lang) {
    var t = D.I18N[lang || state.lang];
    return (state.layout === 'ar' ? t.stageNames : t.stageNamesLatin)[i];
  }

  /* ---------------- progress ---------------- */
  function prog() { if (!state.progress[state.layout]) state.progress[state.layout] = {}; return state.progress[state.layout]; }
  function rec(si, ei) { return prog()[si + '-' + ei]; }
  function passed(si, ei) { var r = rec(si, ei); return !!(r && r.s >= 1); }
  function exUnlocked(si, ei) {
    if (si === 0 && ei === 0) return true;
    if (ei > 0) return passed(si, ei - 1);
    return stageQualified(si - 1);
  }
  /* a stage is complete when every exercise has at least 2 stars */
  function stageQualified(si) { return ST()[si].every(function (e, ei) { var r = rec(si, ei); return !!(r && r.s >= 2); }); }
  function needsLogin(si) { return si >= 2 && !state.user; }

  function saveProgress() {
    LS.set('tt_progress', state.progress);
    LS.set('tt_history', state.history);
    if (state.user && state.db) {
      try {
        state.db.collection('typingProgress').doc(state.user.uid)
          .set({ progress: state.progress, history: state.history, updatedAt: Date.now() }, { merge: true }).catch(function () {});
      } catch (e) {}
    }
  }
  function mergeProgress(remote) {
    Object.keys(remote || {}).forEach(function (lay) {
      if (!state.progress[lay]) state.progress[lay] = {};
      Object.keys(remote[lay] || {}).forEach(function (k) {
        var a = state.progress[lay][k], b = remote[lay][k];
        if (!a || (b && (b.s > a.s || (b.s === a.s && b.w > a.w)))) state.progress[lay][k] = b;
      });
    });
  }

  function mergeHistory(remote) {
    if (!Array.isArray(remote)) return;
    var seen = {};
    state.history.forEach(function (h) { seen[h.t + h.l] = 1; });
    remote.forEach(function (h) { if (h && !seen[h.t + h.l]) { state.history.push(h); seen[h.t + h.l] = 1; } });
    state.history.sort(function (a, b) { return a.t - b.t; });
    if (state.history.length > HISTORY_MAX) state.history = state.history.slice(-HISTORY_MAX);
  }
  var HISTORY_MAX = 1500;

  function initFirebase() {
    try {
      if (typeof firebase === 'undefined' || !firebase.apps || !firebase.apps.length) return;
      state.db = firebase.firestore();
      firebase.auth().onAuthStateChanged(function (u) {
        state.user = u || null;
        if (u) {
          state.db.collection('typingProgress').doc(u.uid).get().then(function (doc) {
            if (doc.exists) { mergeProgress((doc.data() || {}).progress); mergeHistory((doc.data() || {}).history); }
            saveProgress(); refreshScreen();
          }).catch(function () {});
        }
        refreshScreen();
      });
    } catch (e) {}
  }

  /* ---------------- sound ---------------- */
  var actx = null;
  function beep(freq, dur, type, vol) {
    if (!state.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      var o = actx.createOscillator(), g = actx.createGain();
      o.type = type || 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(vol || .05, actx.currentTime);
      g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + dur);
      o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime + dur);
    } catch (e) {}
  }

  /* ---------------- screens ---------------- */
  var SCREENS = ['stagesScreen', 'exercisesScreen', 'practiceScreen', 'resultScreen', 'lockedScreen', 'progressScreen'];
  function show(id) {
    state.screen = id;
    SCREENS.forEach(function (s) { $(s).classList.toggle('hidden', s !== id); });
    document.body.classList.toggle('is-practice', id === 'practiceScreen');
    if (id !== 'practiceScreen') stopTimer();
    if (id === 'practiceScreen') fit();
    window.scrollTo(0, 0);
  }
  function refreshScreen() {
    if (state.screen === 'stagesScreen') renderStages();
    else if (state.screen === 'exercisesScreen') renderExercises();
    else if (state.screen === 'progressScreen') renderProgress();
  }

  /* ---------------- i18n ---------------- */
  function applyLang() {
    var t = T(), html = document.documentElement;
    html.lang = state.lang; html.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    document.title = t.pageTitle;
    $('topbarTitle').textContent = t.title;
    $('backBtn').title = t.back; $('backBtn').setAttribute('aria-label', t.back);
    $('stagesTitle').textContent = t.stagesTitle;
    $('stagesSub').textContent = t.stagesSub;
    $('layoutHint').textContent = t.layoutHint;
    $('mobileNote').textContent = t.mobileNote;
    $('exBackBtn').textContent = t.backToStages;
    $('liveWpmLbl').textContent = t.wpm; $('liveAccLbl').textContent = t.accuracy;
    $('resWpmLbl').textContent = t.wpm; $('resAccLbl').textContent = t.accuracy; $('resTimeLbl').textContent = t.time;
    $('retryBtn').textContent = t.retry; $('resBackBtn').textContent = t.backToExercises;
    $('kbdTip').textContent = t.kbdTip; $('shareLabel').textContent = t.shareLabel;
    $('getCertText').textContent = t.getCert;
    $('progressBtnText').textContent = t.myProgress; $('seeProgressBtn').textContent = t.seeProgress;
    $('progTitle').textContent = t.myProgress; $('progBackBtn').textContent = t.backToStages;
    $('lockedTitle').textContent = t.lockedTitle; $('lockedMsg').textContent = t.lockedMsg;
    $('goLoginBtn').textContent = t.goLogin; $('lockedBackBtn').textContent = t.backToStages;
    $('introStartBtn').textContent = t.start; $('introPress').textContent = t.pressToStart;
    $('certNameTitle').textContent = t.certNameTitle; $('certNameHint').textContent = t.certNameHint;
    $('certFirstName').placeholder = t.firstName; $('certLastName').placeholder = t.lastName;
    $('certNameContinueBtn').textContent = t.cont; $('certPreviewTitle').textContent = t.certReady;
    $('certCloseBtn').textContent = t.close; $('certShareText').textContent = t.share; $('certDownloadText').textContent = t.download;
    [['kbToggle', 'tKeyboard'], ['handsToggle', 'tHands'], ['soundToggle', 'tSound'], ['fsToggle', 'tFull']].forEach(function (p) {
      $(p[0]).title = t[p[1]]; $(p[0]).setAttribute('aria-label', t[p[1]]);
    });
    document.querySelectorAll('.lang-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.lang === state.lang); });
    refreshScreen();
    if (state.screen === 'practiceScreen' && P) { renderPracticeHead(); updateTargets(); }
  }

  /* ---------------- stages screen ---------------- */
  function renderStages() {
    var t = T(), grid = $('stagesGrid'), st = ST();
    grid.innerHTML = '';
    document.querySelectorAll('.layout-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.layout === state.layout); });
    var currentSet = false;
    st.forEach(function (exs, si) {
      var unlocked = exUnlocked(si, 0), login = needsLogin(si), done = stageQualified(si);
      var stars = 0; exs.forEach(function (e, ei) { var r = rec(si, ei); if (r) stars += r.s; });
      var card = document.createElement('div');
      card.className = 'level-card';
      if (!unlocked || login) card.classList.add('locked');
      if (done) card.classList.add('done');
      if (!done && unlocked && !login && !currentSet) { card.classList.add('current'); currentSet = true; }
      card.innerHTML =
        ((!unlocked || login) ? '<span class="level-lock">🔒</span>' : '') +
        '<div class="level-num">' + (si + 1) + '</div>' +
        '<p class="level-label"></p>' +
        '<p class="level-meta">' + exs.length + ' ' + t.exercises + '</p>' +
        (login ? '<p class="level-locked-text">' + t.loginToOpen + '</p>' :
          '<p class="stage-stars" dir="ltr">★ ' + stars + ' / ' + (exs.length * 3) + '</p>' +
          (!unlocked ? '<p class="level-locked-text">' + t.needTwoShort + '</p>' : ''));
      card.querySelector('.level-label').textContent = stageName(si);
      card.addEventListener('click', function () {
        if (login) { show('lockedScreen'); return; }
        if (!unlocked) { toast(t.needTwoStars); return; }
        state.stageIdx = si; renderExercises(); show('exercisesScreen');
      });
      grid.appendChild(card);
    });
  }

  /* ---------------- exercises screen ---------------- */
  function starsHtml(n) { var h = ''; for (var i = 0; i < 3; i++) h += '<span class="' + (i < n ? 'on' : '') + '">★</span>'; return h; }
  function renderExercises() {
    var t = T(), si = state.stageIdx, exs = ST()[si], grid = $('exGrid');
    $('exTitle').textContent = t.stage + ' ' + (si + 1) + ' — ' + stageName(si);
    $('exSub').textContent = t.stageIntro[si];
    grid.innerHTML = '';
    var nextSet = false;
    exs.forEach(function (ex, ei) {
      var r = rec(si, ei), un = exUnlocked(si, ei);
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'ex-card';
      if (!un) b.classList.add('locked');
      if (r && r.s >= 1) b.classList.add('passed');
      if (un && !(r && r.s >= 1) && !nextSet) { b.classList.add('next'); nextSet = true; }
      b.innerHTML = (!un ? '<span class="ex-lock">🔒</span>' : '') +
        '<div class="ex-num">' + (ei + 1) + '</div><p class="ex-label"></p>' +
        '<div class="ex-stars">' + starsHtml(r ? r.s : 0) + '</div>';
      var lbl = b.querySelector('.ex-label');
      lbl.textContent = exLabel(ex);
      lbl.dir = ex.kind === 'keys' ? LAY().dir : 'auto';
      b.addEventListener('click', function () { if (!un) { toast(t.finishPrev); return; } startExercise(si, ei); });
      grid.appendChild(b);
    });
  }

  /* ---------------- keyboard + hands rendering ---------------- */
  var keyEls = {};
  function fingerClass(f) { return f === 'T' ? 'f1' : (f ? 'f' + f.charAt(1) : ''); }
  function renderKeyboard() {
    var L = LAY(), kb = $('keyboard');
    kb.innerHTML = ''; keyEls = {};
    L.rows.forEach(function (row) {
      var r = document.createElement('div'); r.className = 'kb-row';
      row.forEach(function (k) {
        var el = document.createElement('div');
        el.className = 'key';
        if (k.w) el.style.setProperty('--w', k.w);
        if (k.special) { el.classList.add('special'); el.textContent = k.label; }
        else if (k.space) { el.classList.add('f1'); }
        else {
          el.classList.add(fingerClass(k.finger));
          var main = document.createElement('span'); main.textContent = k.base; el.appendChild(main);
          if (k.shift && k.shift !== k.base.toUpperCase()) {
            var s = document.createElement('span'); s.className = 'sh';
            s.textContent = /[\u064B-\u0652]/.test(k.shift) ? 'ـ' + k.shift : k.shift;
            el.appendChild(s);
          }
        }
        if (k.code === 'KeyF' || k.code === 'KeyJ') el.classList.add('bump');
        keyEls[k.code] = el;
        r.appendChild(el);
      });
      kb.appendChild(r);
    });
  }

  var fingerEls = {};
  function renderHands() {
    var svg = $('hands'), NS = 'http://www.w3.org/2000/svg';
    svg.innerHTML = ''; fingerEls = {};
    function el(tag, attrs) { var e = document.createElementNS(NS, tag); for (var a in attrs) e.setAttribute(a, attrs[a]); return e; }
    // left hand: pinky → index (x centers), heights
    var F = [{ f: '5', x: 44, h: 60 }, { f: '4', x: 84, h: 80 }, { f: '3', x: 124, h: 88 }, { f: '2', x: 164, h: 78 }];
    [['L', false], ['R', true]].forEach(function (side) {
      var s = side[0], mirror = side[1];
      var X = function (x) { return mirror ? 560 - x : x; };
      var g = el('g', {});
      var palmX = mirror ? 560 - 190 : 24;
      g.appendChild(el('rect', { class: 'palm', x: palmX, y: 74, width: 166, height: 72, rx: 30 }));
      F.forEach(function (fd) {
        var id = s + fd.f;
        var r = el('rect', { class: 'fg f' + fd.f, x: X(fd.x) - 16, y: 88 - fd.h, width: 32, height: fd.h + 10, rx: 16 });
        g.appendChild(r); fingerEls[id] = r;
      });
      var tx = X(206), rot = mirror ? 38 : -38;
      var th = el('rect', { class: 'fg f1', x: tx - 15, y: 70, width: 30, height: 62, rx: 15, transform: 'rotate(' + rot + ' ' + tx + ' 100)' });
      g.appendChild(th);
      fingerEls['T' + s] = th;
      svg.appendChild(g);
    });
  }

  function fit() {
    var W = window.innerWidth, H = window.innerHeight;
    var textMode = P && P.ex.mode === 'text';
    var rowsU = 1.6 + (textMode ? 1.5 : 0) + (state.showKb ? 5.96 + 0.3 : 0) + (state.showHands ? 2.6 : 0);
    var byH = (H * 0.9 - 190) / rowsU;
    var byW = (W - 60) / 17.2;
    var u = Math.max(24, Math.min(62, byH, byW));
    var root = document.documentElement;
    root.style.setProperty('--u', u.toFixed(1) + 'px');
    if (state.screen !== 'practiceScreen') return;
    // shrink until the whole practice view fits the window without scrolling
    var wrap = $('practiceScreen');
    for (var i = 0; i < 16 && u > 24; i++) {
      var over = wrap.scrollHeight > wrap.clientHeight + 1 || document.body.scrollHeight > H + 1;
      if (!over) break;
      u = u * 0.95; root.style.setProperty('--u', u.toFixed(1) + 'px');
    }
  }

  /* ---------------- practice engine ---------------- */
  var P = null;

  function startExercise(si, ei) {
    var ex = ST()[si][ei];
    state.stageIdx = si;
    P = { si: si, ei: ei, ex: ex, text: Array.from(ex.gen()), pos: 0, errors: 0, errAt: {}, errChars: {}, start: 0, streak: 0, mismatch: 0, done: false };
    renderKeyboard(); renderHands();
    $('keyboard').classList.toggle('plain', !!ex.blind);
    renderText();
    renderPracticeHead();
    $('hintLine').textContent = ''; $('hintLine').classList.remove('warn');
    show('practiceScreen');
    markCurrent(); updateTargets(); updateLive();
    if (ex.intro) openIntro(); else maybeTutorial();
  }

  function renderPracticeHead() {
    var t = T();
    $('practiceName').innerHTML = '';
    var a = document.createElement('span'); a.textContent = stageName(P.si);
    var b = document.createElement('small'); b.textContent = t.exercise + ' ' + (P.ei + 1) + ' / ' + ST()[P.si].length + ' · ' + exLabel(P.ex);
    $('practiceName').appendChild(a); $('practiceName').appendChild(b);
  }

  function renderText() {
    var L = LAY(), tiles = P.ex.mode === 'tiles';
    $('tilesView').classList.toggle('hidden', !tiles);
    $('textView').classList.toggle('hidden', tiles);
    P.els = [];
    if (tiles) {
      var track = $('tilesTrack'); track.innerHTML = ''; track.dir = L.dir;
      P.text.forEach(function (c) {
        var d = document.createElement('div'); d.className = 'tile' + (c === ' ' ? ' sp' : '');
        d.textContent = c === ' ' ? '' : c; track.appendChild(d); P.els.push(d);
      });
    } else {
      var view = $('textView'), inner = $('textInner'); inner.innerHTML = ''; view.dir = L.dir;
      inner.style.transform = 'translateY(0)';
      var word = null;
      P.text.forEach(function (c) {
        if (!word) { word = document.createElement('span'); word.className = 'w'; inner.appendChild(word); }
        var s = document.createElement('span'); s.className = 'c' + (c === ' ' ? ' spc' : ''); s.textContent = c;
        word.appendChild(s); P.els.push(s);
        if (c === ' ') { word = null; inner.appendChild(document.createTextNode('\u200B')); }
      });
    }
    markCurrent();
  }

  function markCurrent() {
    P.els.forEach(function (e) { e.classList.remove('cur'); });
    var cur = P.els[P.pos];
    if (!cur) return;
    cur.classList.add('cur');
    if (P.ex.mode === 'tiles') {
      var view = $('tilesView'), track = $('tilesTrack');
      var cx = cur.offsetLeft + cur.offsetWidth / 2;
      track.style.transform = 'translateX(' + (view.clientWidth / 2 - cx) + 'px)';
    } else {
      var v = $('textView'), lh = parseFloat(getComputedStyle(v).lineHeight) || 40;
      var line = Math.round(cur.offsetTop / lh);
      $('textInner').style.transform = 'translateY(' + (-Math.max(0, line - 1) * lh) + 'px)';
    }
  }

  function clearTargets() {
    Object.keys(keyEls).forEach(function (k) { keyEls[k].classList.remove('target', 'shift-target'); });
    Object.keys(fingerEls).forEach(function (k) { fingerEls[k].classList.remove('active'); });
  }
  function entryFor(c) {
    var L = LAY();
    if (c === ' ') return { key: L.byCode.Space, shift: false };
    return L.map[c] || null;
  }
  function updateTargets() {
    clearTargets();
    if (!P || P.pos >= P.text.length) { $('fingerName').textContent = ''; return; }
    var e = entryFor(P.text[P.pos]);
    if (!e || P.ex.blind) { $('fingerName').textContent = ''; return; }
    var f = e.key.finger, t = T();
    if (keyEls[e.key.code]) keyEls[e.key.code].classList.add('target');
    lightFinger(f);
    var name = t.fingers[f] || '';
    if (e.shift) {
      var left = f.charAt(0) === 'L';
      var sc = left ? 'ShiftRight' : 'ShiftLeft';
      if (keyEls[sc]) keyEls[sc].classList.add('shift-target');
      lightFinger(left ? 'R5' : 'L5');
      name += ' ' + t.withShift;
    }
    $('fingerName').textContent = name;
  }
  function lightFinger(f) {
    if (f === 'T') { ['TL', 'TR'].forEach(function (k) { if (fingerEls[k]) fingerEls[k].classList.add('active'); }); return; }
    if (fingerEls[f]) fingerEls[f].classList.add('active');
  }

  function stopTimer() { if (P && P.tick) { clearInterval(P.tick); P.tick = null; } }
  function elapsedMin() { return P && P.start ? (performance.now() - P.start) / 60000 : 0; }
  function calcWpm() { var m = elapsedMin(); return m > 0 ? Math.round((P.pos / 5) / m) : 0; }
  function calcAcc() { var tot = P.pos + P.errors; return tot ? Math.round(P.pos / tot * 100) : 100; }
  function updateLive() {
    if (!P) return;
    $('liveWpm').textContent = calcWpm();
    $('liveAcc').textContent = calcAcc() + '%';
    $('barFill').style.width = (P.pos / P.text.length * 100) + '%';
  }

  function setHint(msg, warn) { var h = $('hintLine'); h.textContent = msg || ''; h.classList.toggle('warn', !!warn); }

  function flashKey(code, cls) {
    var el = keyEls[code]; if (!el) return;
    el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
    setTimeout(function () { el.classList.remove(cls); }, cls === 'pressed' ? 110 : 320);
  }

  function handleTyping(e) {
    var k = e.key;
    if (k === 'Escape') { e.preventDefault(); P = null; renderExercises(); show('exercisesScreen'); return; }
    if (e.ctrlKey || e.metaKey) return;
    if (e.altKey && !(e.getModifierState && e.getModifierState('AltGraph'))) return;
    if (k === 'Dead') { e.preventDefault(); return; }
    var chars = Array.from(k);
    if (chars.length > 1 && !/[\u0600-\u06FF]/.test(k)) { if (k === 'Backspace' || k === 'Tab' || k === 'Enter') e.preventDefault(); return; }
    e.preventDefault();
    if (P.done) return;

    flashKey(e.code, 'pressed');
    if (!P.start) { P.start = performance.now(); P.tick = setInterval(updateLive, 400); }

    var L = LAY(), t = T(), target = P.text[P.pos], ok = false, adv = 1;
    if (k === target) ok = true;
    else if (chars.length > 1 && P.text.slice(P.pos, P.pos + chars.length).join('') === k) { ok = true; adv = chars.length; }

    var caps = e.getModifierState && e.getModifierState('CapsLock') && L.id !== 'ar';

    if (ok) {
      for (var i = 0; i < adv; i++) {
        var el = P.els[P.pos];
        el.classList.remove('bad');
        el.classList.add(P.errAt[P.pos] ? 'fixed' : 'ok');
        P.pos++;
      }
      P.streak = 0; P.mismatch = 0;
      if (!caps) setHint('');
      beep(1400, .03, 'sine', .025);
    } else {
      P.errors++; P.errAt[P.pos] = true; P.streak++;
      P.errChars[target] = (P.errChars[target] || 0) + 1;
      var cur = P.els[P.pos];
      cur.classList.remove('bad'); void cur.offsetWidth; cur.classList.add('bad');
      flashKey(e.code, 'wrong');
      var entry = entryFor(target);
      if (entry && keyEls[entry.key.code] && !P.ex.blind) flashKey(entry.key.code, 'hint');
      beep(170, .09, 'square', .03);

      var otherScript = L.id === 'ar' ? /[A-Za-z]/.test(k) : /[\u0600-\u06FF]/.test(k);
      if (otherScript || (entry && e.code === entry.key.code && !caps)) P.mismatch++;

      if (P.mismatch >= 2) setHint(t.wrongLayout, true);
      else if (caps) setHint(t.capsOn, true);
      else if (P.streak >= 3) setHint(t.lookScreen, true);
      else if (entry && !P.ex.blind) setHint(fmt(t.useFinger, { f: t.fingers[entry.key.finger] + (entry.shift ? ' ' + t.withShift : '') }));
    }
    if (caps && ok) setHint(t.capsOn, true);

    markCurrent(); updateTargets(); updateLive();
    if (P.pos >= P.text.length) finish();
  }

  function finish() {
    P.done = true; stopTimer();
    var mins = elapsedMin(), wpm = calcWpm(), acc = calcAcc();
    var target = TARGET_WPM[P.si];
    var stars = acc >= 90 ? 1 : 0;
    if (acc >= 95) stars = 2;
    if (acc >= 97 && wpm >= target) stars = 3;
    state.history.push({ t: Date.now(), l: state.layout, si: P.si, ei: P.ei, w: wpm, a: acc, e: P.errors, d: Math.max(1, Math.round(mins * 60)), s: stars, k: P.errChars });
    if (state.history.length > HISTORY_MAX) state.history = state.history.slice(-HISTORY_MAX);
    var key = P.si + '-' + P.ei, old = prog()[key];
    if (!old || stars > old.s || (stars === old.s && wpm > old.w)) prog()[key] = { s: stars, w: wpm, a: acc };
    saveProgress();
    P.result = { wpm: wpm, acc: acc, stars: stars, secs: Math.round(mins * 60) };
    if (stars) beep(880, .12, 'sine', .05);
    setTimeout(showResult, 250);
  }

  function showResult() {
    var t = T(), r = P.result, si = P.si, ei = P.ei, exs = ST()[si];
    $('resultEmoji').textContent = r.stars === 3 ? '🏆' : r.stars ? '🎉' : '💪';
    $('resultTitle').textContent = r.stars === 3 ? t.resGreat : r.stars ? t.resGood : t.resRetry;
    $('resultStars').innerHTML = starsHtml(r.stars);
    var sdone = stageQualified(si), last = ei === exs.length - 1;
    $('resultMsg').textContent = !r.stars ? t.resMsgFail : (last ? (sdone ? t.resMsgStage : t.needTwoStarsLong) : t.resMsgPass);
    $('resWpm').textContent = r.wpm; $('resAcc').textContent = r.acc + '%';
    $('resTime').textContent = Math.floor(r.secs / 60) + ':' + String(r.secs % 60).padStart(2, '0');

    var next = null;
    if (r.stars) {
      if (ei + 1 < exs.length) next = { si: si, ei: ei + 1, label: t.next };
      else if (si + 1 < ST().length && sdone) next = { si: si + 1, ei: 0, label: t.nextStage };
    }
    P.next = next;
    $('nextBtn').classList.toggle('hidden', !next);
    if (next) $('nextBtn').textContent = next.label;
    $('retryBtn').className = next ? 'btn btn-secondary' : 'btn btn-primary';
    $('getCertBtn').classList.toggle('hidden', !sdone);

    var text = fmt(t.shareText, { w: r.wpm, a: r.acc });
    $('shareWhatsapp').href = 'https://wa.me/?text=' + encodeURIComponent(text + ' ' + location.href);
    $('shareTelegram').href = 'https://t.me/share/url?url=' + encodeURIComponent(location.href) + '&text=' + encodeURIComponent(text);
    show('resultScreen');
  }

  function goNext() {
    if (!P || !P.next) return;
    var n = P.next;
    if (needsLogin(n.si)) { show('lockedScreen'); return; }
    startExercise(n.si, n.ei);
  }

  /* ---------------- intro overlay ---------------- */
  var introOpen = false;
  function openIntro() {
    var t = T(), ex = P.ex, L = LAY();
    $('introTitle').textContent = ex.kind === 'keys' || ex.kind === 'symbols' ? t.newKeys : stageName(P.si);
    var box = $('introKeys'); box.innerHTML = '';
    var lines = [];
    if (ex.keys) {
      ex.keys.forEach(function (c) {
        var d = document.createElement('div'); d.className = 'intro-key'; d.textContent = c; box.appendChild(d);
        var en = entryFor(c);
        if (en) lines.push(c + ' ← ' + t.fingers[en.key.finger]);
      });
    }
    var txt = (P.ei === 0 || !ex.keys) ? t.stageIntro[P.si] : '';
    if (lines.length && ex.kind === 'keys' && ex.keys[0] !== '⇧') txt = (txt ? txt + '\n' : '') + lines.join(state.lang === 'ar' ? '، ' : ', ');
    $('introText').textContent = txt;
    $('introText').style.whiteSpace = 'pre-line';
    $('introOverlay').classList.remove('hidden');
    introOpen = true;
  }
  function closeIntro() {
    $('introOverlay').classList.add('hidden'); introOpen = false;
    maybeTutorial();
  }

  /* ---------------- first-time tutorial ---------------- */
  var tut = null;
  function maybeTutorial() {
    if (LS.get('tt_tut_done', false)) return;
    tut = { step: 0, dim: document.createElement('div'), tip: document.createElement('div') };
    tut.dim.className = 'tut-dim'; tut.tip.className = 'tut-tip';
    document.body.appendChild(tut.dim); document.body.appendChild(tut.tip);
    tutStep();
  }
  function tutTarget(i) { return [$('typeArea'), state.showKb ? $('keyboard') : $('kbWrap'), $('liveStats')][i]; }
  function tutStep() {
    var t = T();
    document.querySelectorAll('.tut-focus').forEach(function (e) { e.classList.remove('tut-focus'); });
    if (tut.step > 2) { tut.dim.remove(); tut.tip.remove(); tut = null; LS.set('tt_tut_done', true); return; }
    var target = tutTarget(tut.step);
    target.classList.add('tut-focus');
    tut.tip.innerHTML = '<p></p><button type="button" class="btn btn-primary"></button>';
    tut.tip.querySelector('p').textContent = t.tut[tut.step];
    var btn = tut.tip.querySelector('button');
    btn.textContent = tut.step === 2 ? t.tutDone : t.tutNext;
    btn.addEventListener('click', function () { tut.step++; tutStep(); });
    var r = target.getBoundingClientRect(), tipH = 130;
    var top = r.bottom + 14 + tipH < window.innerHeight ? r.bottom + 14 : Math.max(10, r.top - tipH - 14);
    tut.tip.style.top = top + 'px';
    tut.tip.style.left = Math.max(10, Math.min(window.innerWidth - 320, r.left + r.width / 2 - 150)) + 'px';
  }

  /* ---------------- certificate ---------------- */
  var cert = { lang: LS.get('tt_cert_lang', 'ar'), dataUrl: null };
  function openCertName() {
    var saved = LS.get('tt_cert_name', { f: '', l: '' });
    $('certFirstName').value = saved.f; $('certLastName').value = saved.l;
    document.querySelectorAll('.cert-lang-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.clang === cert.lang); });
    $('certNameOverlay').classList.remove('hidden');
    $('certFirstName').focus();
  }
  function stageAvg(si) {
    var exs = ST()[si], w = 0, a = 0, n = 0;
    exs.forEach(function (e, ei) { var r = rec(si, ei); if (r) { w += r.w; a += r.a; n++; } });
    return { w: n ? Math.round(w / n) : 0, a: n ? Math.round(a / n) : 0 };
  }
  function drawCert(name, clang, si) {
    var t = D.I18N[clang], rtl = clang === 'ar';
    var c = document.createElement('canvas'); c.width = 1600; c.height = 1130;
    var x = c.getContext('2d'), W = c.width, H = c.height;
    var font = rtl ? 'Tajawal' : 'Inter';
    x.fillStyle = '#ffffff'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#E3EEF4'; x.fillRect(0, 0, W, 16); x.fillRect(0, H - 16, W, 16);
    x.strokeStyle = '#2F5770'; x.lineWidth = 10; x.strokeRect(40, 40, W - 80, H - 80);
    x.strokeStyle = '#C97D0E'; x.lineWidth = 2; x.strokeRect(62, 62, W - 124, H - 124);
    x.direction = rtl ? 'rtl' : 'ltr'; x.textAlign = 'center';
    x.fillStyle = '#1E2F40'; x.font = '900 72px ' + font; x.fillText(t.certHeading, W / 2, 250);
    x.fillStyle = '#64768A'; x.font = '500 34px ' + font; x.fillText(t.certCertifies, W / 2, 340);
    x.fillStyle = '#22415A'; x.font = '800 78px ' + font; x.fillText(name, W / 2, 460);
    x.strokeStyle = '#C97D0E'; x.lineWidth = 2; x.beginPath(); x.moveTo(W / 2 - 330, 495); x.lineTo(W / 2 + 330, 495); x.stroke();
    var sn = (state.layout === 'ar' ? t.stageNames : t.stageNamesLatin)[si];
    x.fillStyle = '#1E2F40'; x.font = '700 38px ' + font;
    x.fillText(fmt(t.certBody, { n: si + 1, s: sn }), W / 2, 590);
    x.fillText(fmt(t.certBody2, { l: t.layoutNames[state.layout] }), W / 2, 645);
    var avg = stageAvg(si);
    x.fillStyle = '#2E8A5B'; x.font = '800 36px ' + font;
    x.fillText(fmt(t.certStats, { w: avg.w, a: avg.a }), W / 2, 730);
    var d = new Date(), ds = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
    x.fillStyle = '#64768A'; x.font = '500 28px ' + font;
    x.fillText(t.certDate + ': ' + ds, rtl ? W - 330 : 330, 930);
    x.fillStyle = '#1E2F40'; x.font = '700 32px ' + font;
    x.fillText(t.certSign, rtl ? 330 : W - 330, 930);
    x.strokeStyle = '#A9B6C1'; x.lineWidth = 1.5; x.beginPath(); x.moveTo((rtl ? 330 : W - 330) - 170, 880); x.lineTo((rtl ? 330 : W - 330) + 170, 880); x.stroke();
    return new Promise(function (res) {
      var img = new Image();
      img.onload = function () { x.save(); x.beginPath(); x.arc(W / 2, 140, 58, 0, Math.PI * 2); x.clip(); x.drawImage(img, W / 2 - 58, 82, 116, 116); x.restore(); res(c.toDataURL('image/png')); };
      img.onerror = function () { res(c.toDataURL('image/png')); };
      img.src = '../../apple-touch-icon.png';
    });
  }
  function makeCert() {
    var f = $('certFirstName').value.trim(), l = $('certLastName').value.trim();
    if (!f || !l) { ($('certFirstName').value.trim() ? $('certLastName') : $('certFirstName')).focus(); return; }
    LS.set('tt_cert_name', { f: f, l: l }); LS.set('tt_cert_lang', cert.lang);
    $('certNameOverlay').classList.add('hidden');
    var fontsReady = document.fonts && document.fonts.load ? Promise.all([
      document.fonts.load('900 72px Tajawal'), document.fonts.load('800 72px Inter')
    ]).catch(function () {}) : Promise.resolve();
    fontsReady.then(function () { return drawCert(f + ' ' + l, cert.lang, state.stageIdx); }).then(function (url) {
      cert.dataUrl = url; $('certPreviewImg').src = url;
      $('certPreviewOverlay').classList.remove('hidden');
    });
  }
  function downloadCert() {
    var a = document.createElement('a'); a.href = cert.dataUrl; a.download = 'certificate-typing-stage-' + (state.stageIdx + 1) + '.png';
    document.body.appendChild(a); a.click(); a.remove();
  }
  function shareCert() {
    try {
      fetch(cert.dataUrl).then(function (r) { return r.blob(); }).then(function (b) {
        var file = new File([b], 'certificate.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file], title: T().title }).catch(function () {});
        else downloadCert();
      });
    } catch (e) { downloadCert(); }
  }

  /* ---------------- progress page ---------------- */
  var SVGNS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs, text) {
    var e = document.createElementNS(SVGNS, tag);
    for (var a in attrs) e.setAttribute(a, attrs[a]);
    if (text != null) e.textContent = text;
    return e;
  }
  function fmtDuration(sec) {
    var t = T(), m = Math.round(sec / 60);
    if (m < 60) return m + ' ' + t.minShort;
    return Math.floor(m / 60) + ' ' + t.hourShort + ' ' + (m % 60) + ' ' + t.minShort;
  }
  function pad2(n) { return String(n).padStart(2, '0'); }
  function dayKey(ts) { var d = new Date(ts); return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }

  function filteredHistory() {
    var f = state.progFilter, since = f.days ? Date.now() - f.days * 86400000 : 0;
    return state.history.filter(function (h) {
      return h.l === state.layout && h.t >= since && (f.stage === 'all' || String(h.si) === f.stage);
    });
  }

  function renderProgress() {
    var t = T(), H = filteredHistory();
    $('progSub').textContent = t.layoutNames[state.layout];

    // filters
    var sel = $('progStage'), cur = state.progFilter.stage;
    sel.innerHTML = '';
    var o = document.createElement('option'); o.value = 'all'; o.textContent = t.allStages; sel.appendChild(o);
    ST().forEach(function (s, si) { var op = document.createElement('option'); op.value = String(si); op.textContent = t.stage + ' ' + (si + 1) + ' — ' + stageName(si); sel.appendChild(op); });
    sel.value = cur;
    document.querySelectorAll('.period-btn').forEach(function (b) {
      b.classList.toggle('active', +b.dataset.days === state.progFilter.days);
      b.textContent = { 7: t.last7, 30: t.last30, 0: t.allTime }[b.dataset.days];
    });

    var empty = !H.length;
    $('progEmpty').classList.toggle('hidden', !empty);
    $('progEmpty').textContent = t.noData;
    $('progBody').classList.toggle('hidden', empty);
    if (empty) return;

    // summary
    var best = 0, accSum = 0, secs = 0;
    H.forEach(function (h) { best = Math.max(best, h.w); accSum += h.a; secs += h.d; });
    var cards = [[best, t.bestWpm], [Math.round(accSum / H.length) + '%', t.avgAcc], [fmtDuration(secs), t.totalTime], [H.length, t.attempts]];
    $('progCards').innerHTML = '';
    cards.forEach(function (c) {
      var d = document.createElement('div'); d.className = 'prog-card';
      var b = document.createElement('b'); b.textContent = c[0];
      var s = document.createElement('span'); s.textContent = c[1];
      d.appendChild(b); d.appendChild(s); $('progCards').appendChild(d);
    });

    $('chart1Title').textContent = t.chartSpeedErrors;
    $('legendSpeed').textContent = t.wpm; $('legendErr').textContent = t.errorsLbl;
    drawLineChart($('chart1'), H.slice(-60));
    $('chart2Title').textContent = t.chartDaily;
    drawDailyChart($('chart2'), H);
    $('weakTitle').textContent = t.weakKeys; $('weakHint').textContent = t.weakHint;
    drawWeakKeys(H);
    $('histTitle').textContent = t.history;
    drawHistory(H);
  }

  function drawLineChart(svg, H) {
    svg.innerHTML = '';
    var W = 800, Ht = 260, pl = 44, pr = 44, pt = 16, pb = 30;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + Ht);
    var maxW = Math.max(10, Math.ceil(Math.max.apply(null, H.map(function (h) { return h.w; })) / 10) * 10);
    var maxE = Math.max(5, Math.ceil(Math.max.apply(null, H.map(function (h) { return h.e; })) / 5) * 5);
    var n = H.length, iw = W - pl - pr, ih = Ht - pt - pb;
    var X = function (i) { return pl + (n === 1 ? iw / 2 : i * iw / (n - 1)); };
    var YW = function (v) { return pt + ih - v / maxW * ih; };
    var YE = function (v) { return pt + ih - v / maxE * ih; };
    for (var g = 0; g <= 4; g++) {
      var y = pt + ih * g / 4;
      svg.appendChild(svgEl('line', { x1: pl, x2: W - pr, y1: y, y2: y, class: 'grid' }));
      svg.appendChild(svgEl('text', { x: pl - 8, y: y + 4, class: 'ax ax-w', 'text-anchor': 'end' }, Math.round(maxW * (4 - g) / 4)));
      svg.appendChild(svgEl('text', { x: W - pr + 8, y: y + 4, class: 'ax ax-e', 'text-anchor': 'start' }, Math.round(maxE * (4 - g) / 4)));
    }
    var step = Math.max(1, Math.ceil(n / 10));
    H.forEach(function (h, i) {
      if (i % step === 0 || i === n - 1) svg.appendChild(svgEl('text', { x: X(i), y: Ht - 8, class: 'ax', 'text-anchor': 'middle' }, i + 1));
    });
    function line(Y, key, cls) {
      if (n > 1) svg.appendChild(svgEl('polyline', { points: H.map(function (h, i) { return X(i) + ',' + Y(h[key]); }).join(' '), class: 'ln ' + cls }));
      H.forEach(function (h, i) {
        var c = svgEl('circle', { cx: X(i), cy: Y(h[key]), r: 4, class: 'dot ' + cls });
        c.appendChild(svgEl('title', {}, dateStr(h.t) + ' — ' + h.w + ' ' + T().wpm + ', ' + h.e + ' ' + T().errorsLbl));
        svg.appendChild(c);
      });
    }
    line(YE, 'e', 'err');
    line(YW, 'w', 'spd');
  }

  function drawDailyChart(svg, H) {
    svg.innerHTML = '';
    var W = 800, Ht = 220, pl = 44, pr = 16, pt = 16, pb = 30;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + Ht);
    var byDay = {};
    H.forEach(function (h) { var k = dayKey(h.t); byDay[k] = (byDay[k] || 0) + h.d; });
    var nDays = state.progFilter.days || Math.min(60, Math.max(7, Math.ceil((Date.now() - H[0].t) / 86400000) + 1));
    var days = [];
    for (var i = nDays - 1; i >= 0; i--) { var ts = Date.now() - i * 86400000; days.push({ k: dayKey(ts), ts: ts, m: (byDay[dayKey(ts)] || 0) / 60 }); }
    var maxM = Math.max(5, Math.ceil(Math.max.apply(null, days.map(function (d) { return d.m; })) / 5) * 5);
    var iw = W - pl - pr, ih = Ht - pt - pb, bw = iw / days.length;
    for (var g = 0; g <= 4; g++) {
      var y = pt + ih * g / 4;
      svg.appendChild(svgEl('line', { x1: pl, x2: W - pr, y1: y, y2: y, class: 'grid' }));
      svg.appendChild(svgEl('text', { x: pl - 8, y: y + 4, class: 'ax', 'text-anchor': 'end' }, Math.round(maxM * (4 - g) / 4)));
    }
    var step = Math.max(1, Math.ceil(days.length / 10));
    days.forEach(function (d, i) {
      var h = d.m / maxM * ih, x = pl + i * bw + bw * 0.18;
      var r = svgEl('rect', { x: x, y: pt + ih - h, width: bw * 0.64, height: Math.max(h, d.m ? 2 : 0), rx: 3, class: 'bar-day' });
      r.appendChild(svgEl('title', {}, dateStr(d.ts, true) + ' — ' + Math.round(d.m * 10) / 10 + ' ' + T().minShort));
      svg.appendChild(r);
      if (i % step === 0 || i === days.length - 1) {
        var dt = new Date(d.ts);
        svg.appendChild(svgEl('text', { x: pl + i * bw + bw / 2, y: Ht - 8, class: 'ax', 'text-anchor': 'middle' }, pad2(dt.getDate()) + '/' + pad2(dt.getMonth() + 1)));
      }
    });
  }

  function drawWeakKeys(H) {
    var L = LAY(), counts = {};
    H.forEach(function (h) { Object.keys(h.k || {}).forEach(function (c) { counts[c] = (counts[c] || 0) + h.k[c]; }); });
    var byCode = {};
    Object.keys(counts).forEach(function (c) {
      var en = c === ' ' ? { key: L.byCode.Space } : L.map[c];
      if (en) byCode[en.key.code] = (byCode[en.key.code] || 0) + counts[c];
    });
    var max = Math.max.apply(null, [1].concat(Object.keys(byCode).map(function (k) { return byCode[k]; })));
    var box = $('weakKb'); box.innerHTML = '';
    L.rows.forEach(function (row) {
      var r = document.createElement('div'); r.className = 'mk-row';
      row.forEach(function (k) {
        var d = document.createElement('div'); d.className = 'mk' + (k.special ? ' sp' : '');
        d.style.setProperty('--w', k.w || 1);
        if (!k.special) d.textContent = k.space ? '' : k.base;
        var n = byCode[k.code] || 0;
        if (n) { d.style.background = 'rgba(192,57,43,' + (0.12 + 0.78 * n / max).toFixed(2) + ')'; if (n / max > .45) d.style.color = '#fff'; d.title = n; }
        r.appendChild(d);
      });
      box.appendChild(r);
    });
    var top = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; }).slice(0, 6);
    $('weakTop').innerHTML = '';
    top.forEach(function (c) {
      var s = document.createElement('span'); s.className = 'weak-chip';
      s.textContent = (c === ' ' ? '␣' : c) + '  ' + counts[c];
      $('weakTop').appendChild(s);
    });
  }

  function dateStr(ts, dayOnly) {
    var d = new Date(ts);
    var s = pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1) + '/' + d.getFullYear();
    return dayOnly ? s : s + ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes());
  }
  function drawHistory(H) {
    var t = T(), tb = $('histTable');
    tb.innerHTML = '';
    var head = document.createElement('tr');
    [t.date, t.stage, t.wpm, t.accuracy, t.errorsLbl, t.time].forEach(function (h) { var th = document.createElement('th'); th.textContent = h; head.appendChild(th); });
    tb.appendChild(head);
    H.slice(-20).reverse().forEach(function (h) {
      var tr = document.createElement('tr');
      [dateStr(h.t), (h.si + 1) + ' · ' + t.exercise + ' ' + (h.ei + 1), h.w, h.a + '%', h.e, Math.floor(h.d / 60) + ':' + pad2(h.d % 60)].forEach(function (v) {
        var td = document.createElement('td'); td.textContent = v; tr.appendChild(td);
      });
      tb.appendChild(tr);
    });
  }

  /* ---------------- toast ---------------- */
  var toastTimer = null;
  function toast(msg) {
    var el = $('ttToast');
    if (!el) { el = document.createElement('div'); el.id = 'ttToast'; el.className = 'toast'; document.body.appendChild(el); }
    el.textContent = msg; el.classList.remove('hidden');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.classList.add('hidden'); }, 2600);
  }

  /* ---------------- toggles ---------------- */
  function applyToggles() {
    document.body.classList.toggle('hide-kb', !state.showKb);
    document.body.classList.toggle('hide-hands', !state.showHands);
    $('kbToggle').classList.toggle('off', !state.showKb);
    $('handsToggle').classList.toggle('off', !state.showHands);
    $('soundToggle').classList.toggle('off', !state.sound);
    fit();
    if (P && state.screen === 'practiceScreen') markCurrent();
  }

  /* ---------------- events ---------------- */
  function bind() {
    document.querySelectorAll('.lang-btn').forEach(function (b) {
      b.addEventListener('click', function () { state.lang = b.dataset.lang; LS.set('tt_lang', state.lang); applyLang(); });
    });
    document.querySelectorAll('.layout-btn').forEach(function (b) {
      b.addEventListener('click', function () { state.layout = b.dataset.layout; LS.set('tt_layout', state.layout); renderStages(); });
    });
    $('kbToggle').addEventListener('click', function () { state.showKb = !state.showKb; LS.set('tt_kb', state.showKb); applyToggles(); this.blur(); });
    $('handsToggle').addEventListener('click', function () { state.showHands = !state.showHands; LS.set('tt_hands', state.showHands); applyToggles(); this.blur(); });
    $('soundToggle').addEventListener('click', function () { state.sound = !state.sound; LS.set('tt_sound', state.sound); applyToggles(); this.blur(); });
    $('fsToggle').addEventListener('click', function () {
      this.blur();
      try {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
      } catch (e) {}
    });
    $('exBackBtn').addEventListener('click', function () { renderStages(); show('stagesScreen'); });
    $('lockedBackBtn').addEventListener('click', function () { renderStages(); show('stagesScreen'); });
    $('nextBtn').addEventListener('click', goNext);
    $('retryBtn').addEventListener('click', function () { startExercise(P.si, P.ei); });
    $('resBackBtn').addEventListener('click', function () { renderExercises(); show('exercisesScreen'); });
    $('introStartBtn').addEventListener('click', closeIntro);
    $('progressBtn').addEventListener('click', function () { renderProgress(); show('progressScreen'); });
    $('seeProgressBtn').addEventListener('click', function () { renderProgress(); show('progressScreen'); });
    $('progBackBtn').addEventListener('click', function () { renderStages(); show('stagesScreen'); });
    $('progStage').addEventListener('change', function () { state.progFilter.stage = this.value; renderProgress(); });
    document.querySelectorAll('.period-btn').forEach(function (b) {
      b.addEventListener('click', function () { state.progFilter.days = +b.dataset.days; renderProgress(); });
    });
    $('getCertBtn').addEventListener('click', openCertName);
    document.querySelectorAll('.cert-lang-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        cert.lang = b.dataset.clang;
        document.querySelectorAll('.cert-lang-btn').forEach(function (x) { x.classList.toggle('active', x === b); });
      });
    });
    $('certNameContinueBtn').addEventListener('click', makeCert);
    $('certCloseBtn').addEventListener('click', function () { $('certPreviewOverlay').classList.add('hidden'); });
    $('certDownloadBtn').addEventListener('click', downloadCert);
    $('certShareBtn').addEventListener('click', shareCert);
    $('certNameOverlay').addEventListener('click', function (e) { if (e.target === this) this.classList.add('hidden'); });

    document.addEventListener('keydown', function (e) {
      var inInput = e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA');
      if (inInput) { if (e.key === 'Enter') makeCert(); return; }
      if (!$('certPreviewOverlay').classList.contains('hidden') || !$('certNameOverlay').classList.contains('hidden')) {
        if (e.key === 'Escape') { $('certPreviewOverlay').classList.add('hidden'); $('certNameOverlay').classList.add('hidden'); }
        return;
      }
      if (state.screen === 'practiceScreen' && P) {
        if (introOpen) {
          if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); closeIntro(); }
          else if (e.key === 'Escape') { $('introOverlay').classList.add('hidden'); introOpen = false; renderExercises(); show('exercisesScreen'); }
          return;
        }
        if (tut) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tut.step++; tutStep(); } return; }
        handleTyping(e);
        return;
      }
      if (state.screen === 'resultScreen') {
        if (e.key === 'Enter') { e.preventDefault(); if (P && P.next) goNext(); else if (P) startExercise(P.si, P.ei); }
        else if (e.key === 'Escape') { renderExercises(); show('exercisesScreen'); }
      }
    });

    var rz = null;
    window.addEventListener('resize', function () {
      clearTimeout(rz);
      rz = setTimeout(function () { fit(); if (P && state.screen === 'practiceScreen') markCurrent(); if (tut) tutStep(); }, 120);
    });
  }

  /* ---------------- init ---------------- */
  function init() {
    bind();
    applyToggles();
    applyLang();
    renderStages();
    show('stagesScreen');
    if (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches) $('mobileNote').classList.remove('hidden');
    initFirebase();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
