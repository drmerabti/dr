// ============================================================
// core.js — مشترك بين صفحة المتدرب وصفحة المدرّب
// الاتصال بـ Firebase · توقيت الخادم · النصوص · الأصوات · النقاط
// ============================================================

// رابط Realtime Database — يُؤخذ من firebaseConfig.databaseURL إن أضيف هناك،
// وإلا فهذا رابط قاعدة المشروع (المنطقة europe-west1).
var LR_DB_URL = 'https://word-shortcuts-default-rtdb.europe-west1.firebasedatabase.app';

var LR = (function () {
  var LR = {};

  /* ---------------- النصوص (عربي الآن، fr/en لاحقاً بنفس المفاتيح) ---------------- */
  var STR = {
    ar: {
      title: 'غرفة التدريب المباشر',
      admin_title: 'لوحة المدرّب — الغرفة المباشرة',
      back: 'رجوع', mute: 'كتم الصوت', unmute: 'تشغيل الصوت', fullscreen: 'ملء الشاشة',
      loading: 'جاري التحميل…',
      login_title: 'سجّل الدخول للدخول إلى الغرفة',
      login_sub: 'استعمل حسابك في الموقع.',
      login_google: 'المتابعة عبر Google',
      email: 'البريد الإلكتروني', password: 'كلمة المرور', login_btn: 'دخول',
      login_err: 'تعذّر تسجيل الدخول. تحقّق من البيانات.',
      code_title: 'أدخل رمز الغرفة',
      code_sub: 'الرمز من 6 أرقام يعطيك إياه المدرّب.',
      enter: 'دخول',
      name_title: 'ما الاسم الذي سيظهر لزملائك؟',
      name_ph: 'اكتب اسمك',
      enter_hall: 'ادخل القاعة',
      err_code: 'رمز غير صحيح. تأكّد من الأرقام.',
      err_ended: 'انتهت هذه الجلسة، والرمز لم يعد صالحاً.',
      err_locked: 'الغرفة مقفلة، لا يمكن الدخول الآن.',
      err_join: 'تعذّر الدخول إلى الغرفة.',
      err_db: 'تعذّر الاتصال بقاعدة البيانات المباشرة.',
      try_other: 'رمز آخر',
      waiting: 'بانتظار المدرّب…',
      host_off: 'المدرّب غير متصل حالياً',
      in_room: 'متدرب في الغرفة',
      question: 'السؤال',
      sent: 'تم إرسال إجابتك',
      sent_in: 'خلال',
      sec: 'ث',
      wait_end: 'بانتظار انتهاء الوقت…',
      time_up: 'انتهى الوقت!',
      computing: 'جاري احتساب النتائج…',
      send_fail: 'لم تُقبل الإجابة (انتهى الوقت).',
      correct: 'إجابة صحيحة', wrong: 'إجابة خاطئة', no_answer: 'لم تُجب',
      correct_was: 'الإجابة الصحيحة:',
      top5: 'الخمسة الأوائل',
      your_rank: 'ترتيبك', of: 'من', your_points: 'نقاطك', points: 'نقطة',
      final_title: 'انتهت المسابقة!',
      final_rank: 'ترتيبك النهائي',
      session_over: 'انتهت الجلسة. شكراً لمشاركتك!',
      ranking: 'الترتيب المباشر',
      rank_hint: 'الترتيب على الشاشة اليمنى، والأوائل في الصف الأمامي',
      my_seat: 'مقعدك محاط بإطار أبيض',
      hall_wait_sub: 'ستبدأ المسابقة بعد قليل',
      pick_answer: 'اختر الإجابة',
      on_device: 'أجب في اللوحة أسفل القاعة',
      winner: 'الفائز:',
      tf_true: 'صح', tf_false: 'خطأ',
      confirm: 'تأكيد',
      typing_send: 'إرسال',
      rc_hint_mouse: 'استعمل الزر الأيمن للفأرة 🖱️',
      rc_hint_touch: 'اضغط مطوّلاً على العنصر ✋',
      dbl_hint_mouse: 'نقرتين سريعتين!',
      dbl_hint_touch: 'لمستين سريعتين!',
      enc_ok: ['أحسنت! 👏', 'رائع، استمر! 💪', 'ممتاز! 🌟', 'سرعة وذكاء! ⚡'],
      enc_bad: ['لا بأس، السؤال القادم لك! 💪', 'قريب جداً، ركّز أكثر 🎯', 'كل خطأ درس جديد 📘'],
      enc_none: ['كن أسرع في السؤال القادم! ⏱️']
    }
  };
  LR.lang = 'ar';
  LR.t = function (k) { var s = STR[LR.lang][k]; return s == null ? (STR.ar[k] == null ? k : STR.ar[k]) : s; };
  LR.applyStatic = function (root) {
    (root || document).querySelectorAll('[data-t]').forEach(function (el) { el.textContent = LR.t(el.getAttribute('data-t')); });
    (root || document).querySelectorAll('[data-t-ph]').forEach(function (el) { el.placeholder = LR.t(el.getAttribute('data-t-ph')); });
    (root || document).querySelectorAll('[data-t-title]').forEach(function (el) { el.title = LR.t(el.getAttribute('data-t-title')); el.setAttribute('aria-label', el.title); });
  };

  /* ---------------- الجهاز ---------------- */
  LR.touch = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  LR.devText = function (s) {
    var touch = LR.touch;
    return String(s || '')
      .replace(/\{CLICK\}/g, touch ? 'المس' : 'انقر')
      .replace(/\{DBL\}/g, touch ? 'المس لمستين' : 'انقر نقرتين')
      .replace(/\{RC\}/g, touch ? 'اضغط مطوّلاً' : 'انقر بالزر الأيمن');
  };
  LR.deskText = function (s) { var t = LR.touch; LR.touch = false; var r = LR.devText(s); LR.touch = t; return r; };

  /* ---------------- Firebase ---------------- */
  LR.emu = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && /[?&]emu=1/.test(location.search);
  LR.SERVER_TS = function () { return firebase.database.ServerValue.TIMESTAMP; };
  LR.offset = 0;
  LR.initFirebase = function () {
    var app = firebase.app();
    if (LR.emu) {
      try { window.fbAuth.useEmulator('http://127.0.0.1:9099'); } catch (e) {}
      LR.db = app.database('http://127.0.0.1:9000?ns=word-shortcuts-default-rtdb');
      try { if (window.fbDb && LR.wantFirestore) window.fbDb.useEmulator('127.0.0.1', 8080); } catch (e) {}
    } else {
      LR.db = app.database(app.options.databaseURL || LR_DB_URL);
    }
    LR.db.ref('.info/serverTimeOffset').on('value', function (s) { LR.offset = s.val() || 0; });
    return LR.db;
  };
  LR.serverNow = function () { return Date.now() + LR.offset; };
  LR.roomRef = function (code, path) { return LR.db.ref('rooms/' + code + (path ? '/' + path : '')); };

  /* ---------------- أدوات ---------------- */
  LR.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  };
  LR.initials = function (name) {
    var w = String(name || '?').trim().split(/\s+/).filter(Boolean);
    if (!w.length) return '?';
    return (w[0].charAt(0) + (w[1] ? w[1].charAt(0) : '')).toUpperCase();
  };
  LR.firstName = function (name) { return String(name || '').trim().split(/\s+/)[0] || '؟'; };
  // صورة الحساب (Google وغيره): https فقط
  LR.photoOf = function (user) {
    var u = user && (user.photoURL || (user.providerData || []).map(function (p) { return p && p.photoURL; }).filter(Boolean)[0]);
    return u && /^https:\/\//.test(u) && u.length <= 600 ? u : null;
  };
  LR.REACTIONS = { clap: '👏', fire: '🔥', wow: '😮' };
  LR.hue = function (s) { var h = 0; s = String(s || ''); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360; return h; };
  LR.pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
  LR.shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  LR.rng = function (seed) { // mulberry32 — نفس المواقع عند الجميع
    var a = seed >>> 0;
    return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  };
  LR.fmtSec = function (ms) { return (Math.max(0, ms) / 1000).toFixed(1); };
  LR.norm = function (s) {
    return String(s || '')
      .replace(/[ً-ْٰـ]/g, '')
      .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي')
      .replace(/\s+/g, ' ').trim();
  };

  /* ---------------- النقاط والتصحيح ---------------- */
  // صحيحة: من 1000 (فورية) تنقص خطياً حتى 500 (آخر لحظة). خاطئة/بدون إجابة: 0
  LR.points = function (ms, durMs) {
    var r = Math.min(1, Math.max(0, ms / durMs));
    return Math.round(1000 - 500 * r);
  };
  LR.grade = function (type, v, secret) {
    if (v == null) return false;
    switch (type) {
      case 'click': case 'dblclick': return Number(v) >= Number(secret);
      case 'typing': return LR.norm(v) === LR.norm(secret);
      default: return String(v) === String(secret);
    }
  };
  // ترتيب: المجموع ↓ ثم مجموع زمن الإجابات الصحيحة ↑ ثم الاسم
  LR.standings = function (scores) {
    return Object.keys(scores || {}).map(function (uid) {
      var s = scores[uid] || {};
      return { uid: uid, name: s.name || '؟', total: s.total || 0, time: s.time || 0, correct: s.correct || 0, answered: s.answered || 0, last: s.last || null };
    }).sort(function (a, b) {
      return (b.total - a.total) || (a.time - b.time) || String(a.name).localeCompare(String(b.name), 'ar');
    });
  };

  // تحويل سؤال من البنك إلى: ما يُنشر للجميع (payload) + الإجابة السرية (secret)
  LR.buildPublish = function (q) {
    var P = window.LR_PARTS, payload = { type: q.type, text: q.text }, secret, correctText;
    switch (q.type) {
      case 'mcq': {
        var perm = LR.shuffle(q.options.map(function (_, i) { return i; }));
        payload.options = perm.map(function (i) { return q.options[i]; });
        if (q.img) payload.svg = P.svg(q.img);
        secret = String(perm.indexOf(Number(q.answer)));
        correctText = q.options[q.answer];
        break;
      }
      case 'tf':
        secret = q.answer ? 'true' : 'false';
        correctText = q.answer ? LR.t('tf_true') : LR.t('tf_false');
        break;
      case 'click': case 'dblclick':
        payload.count = Number(q.count) || 5;
        payload.seed = Math.floor(Math.random() * 1e9);
        secret = String(payload.count);
        correctText = q.type === 'click' ? 'إصابة كل الأهداف' : 'فتح كل الصناديق';
        break;
      case 'drag': {
        var items = LR.shuffle(q.items), labels = LR.shuffle(q.items);
        payload.svgs = items.map(function (id) { return P.svg(id); });
        payload.labels = labels.map(function (id) { return P.names[id]; });
        secret = JSON.stringify(items.map(function (id) { return labels.indexOf(id); }));
        correctText = items.map(function (id) { return P.names[id]; }).join('، ');
        break;
      }
      case 'rightclick':
        payload.target = q.target;
        payload.options = q.options.slice();
        secret = String(q.answer);
        correctText = q.options[q.answer];
        break;
      case 'typing':
        payload.phrase = q.phrase;
        secret = q.phrase;
        correctText = q.phrase;
        break;
    }
    return { payload: payload, secret: secret, correctText: correctText };
  };
  LR.qTitle = function (q) {
    var t = LR.deskText(q.text);
    if (q.type === 'mcq' && q.img) t += ' (' + window.LR_PARTS.names[q.img] + ')';
    if (q.type === 'typing') t += ' «' + q.phrase + '»';
    return t;
  };

  /* ---------------- الأصوات ---------------- */
  // يبحث عن sounds/<name>.mp3؛ إن لم يوجد يستعمل صوتاً مولّداً بـ Web Audio أو الصمت.
  var Sound = { muted: false, ctx: null, files: {}, unlocked: false, amb: null };
  var NAMES = ['ambience', 'bell', 'tick', 'heartbeat', 'correct', 'wrong', 'applause', 'cheer'];
  Sound.base = 'sounds/';
  Sound.init = function (base) {
    if (base) Sound.base = base;
    try { Sound.muted = localStorage.getItem('lr_muted') === '1'; } catch (e) {}
    NAMES.forEach(function (n) {
      var a = new Audio();
      a.preload = 'auto';
      Sound.files[n] = { el: a, ok: false };
      a.addEventListener('canplaythrough', function () { Sound.files[n].ok = true; }, { once: true });
      a.addEventListener('error', function () { Sound.files[n].ok = false; }, { once: true });
      a.src = Sound.base + n + '.mp3';
    });
    var unlock = function () {
      if (Sound.unlocked) return;
      Sound.unlocked = true;
      try { Sound.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
      if (Sound.ctx) { if (Sound.muted) Sound.ctx.suspend(); else if (Sound.ctx.state === 'suspended') Sound.ctx.resume(); }
      if (Sound._wantAmb) Sound.ambience(true);
      applyHum();
    };
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) { window.addEventListener(ev, unlock, { capture: true, passive: true }); });
  };
  Sound.setMuted = function (m) {
    Sound.muted = m;
    try { localStorage.setItem('lr_muted', m ? '1' : '0'); } catch (e) {}
    // الكتم فوري: إيقاف محرك الصوت كله (الهمهمة والنغمات الجارية) لا خفضه تدريجياً
    if (Sound.ctx) { if (m) Sound.ctx.suspend(); else Sound.ctx.resume(); }
    if (m && Sound.amb) Sound.amb.pause();
    if (!m && Sound._wantAmb) Sound.ambience(true);
    applyHum();
  };
  function tone(freq, dur, type, vol, when, slideTo) {
    var c = Sound.ctx; if (!c) return;
    var t0 = c.currentTime + (when || 0);
    var o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.2, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }
  var SYNTH = {
    bell: function () { tone(880, 1.6, 'sine', 0.22); tone(1320, 1.2, 'sine', 0.08); tone(1760, 0.8, 'sine', 0.04); },
    tick: function () { tone(1500, 0.035, 'square', 0.05); },
    heartbeat: function () { tone(70, 0.16, 'sine', 0.5, 0, 45); tone(62, 0.18, 'sine', 0.4, 0.2, 40); },
    correct: function () { tone(660, 0.14, 'triangle', 0.2); tone(990, 0.28, 'triangle', 0.2, 0.12); },
    wrong: function () { tone(180, 0.35, 'sawtooth', 0.09, 0, 120); }
  };
  Sound.play = function (name, vol) {
    if (Sound.muted || !Sound.unlocked) return;
    var f = Sound.files[name];
    if (f && f.ok) {
      try { var a = f.el.cloneNode(); a.volume = vol == null ? 1 : vol; a.play().catch(function () {}); } catch (e) {}
    } else if (SYNTH[name]) {
      if (Sound.ctx && Sound.ctx.state === 'suspended') Sound.ctx.resume();
      SYNTH[name]();
    }
  };
  Sound.ambience = function (on) {
    Sound._wantAmb = on;
    var f = Sound.files.ambience;
    if (!f || !f.ok) return; // لا بديل: صمت
    if (!Sound.amb) { Sound.amb = f.el; Sound.amb.loop = true; Sound.amb.volume = 0.18; }
    if (on && !Sound.muted && Sound.unlocked) Sound.amb.play().catch(function () {});
    else Sound.amb.pause();
  };
  // همهمة القاعة: ترتفع قليلاً كلما زاد عدد الحاضرين (حتى 100) وتنخفض أثناء السؤال.
  // تستعمل ambience.mp3 إن وُجد، وإلا ضجيجاً مولّداً مُرشَّحاً يشبه همس جمهور بعيد.
  Sound.hum = function (n, live) { Sound._hum = { n: Math.max(0, n || 0), live: !!live }; applyHum(); };
  function humLevel() {
    var h = Sound._hum;
    if (!h || !h.n || Sound.muted) return 0;
    return (0.25 + 0.75 * Math.min(h.n, 100) / 100) * (h.live ? 0.45 : 1);
  }
  function applyHum() {
    var lvl = humLevel(), f = Sound.files.ambience;
    if (f && f.ok) {
      if (!Sound.amb) { Sound.amb = f.el; Sound.amb.loop = true; }
      Sound.amb.volume = Math.min(1, 0.06 + 0.3 * lvl);
      if (lvl > 0 && Sound.unlocked) Sound.amb.play().catch(function () {});
      else if (!Sound._wantAmb || Sound.muted) Sound.amb.pause();
      return;
    }
    var c = Sound.ctx;
    if (!c) return;
    if (!Sound.humGain) {
      try {
        var len = c.sampleRate * 3, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0), b0 = 0, b1 = 0, b2 = 0;
        for (var i = 0; i < len; i++) { // ضجيج وردي تقريبي
          var w = Math.random() * 2 - 1;
          b0 = 0.99765 * b0 + w * 0.0990460; b1 = 0.96300 * b1 + w * 0.2965164; b2 = 0.57000 * b2 + w * 1.0526913;
          d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.18;
        }
        var src = c.createBufferSource(); src.buffer = buf; src.loop = true;
        var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 420; bp.Q.value = 0.7;
        var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
        var mod = c.createGain(); mod.gain.value = 0.8;
        var lfo = c.createOscillator(), lfoG = c.createGain(); lfo.frequency.value = 0.23; lfoG.gain.value = 0.2;
        lfo.connect(lfoG); lfoG.connect(mod.gain);
        Sound.humGain = c.createGain(); Sound.humGain.gain.value = 0;
        src.connect(bp); bp.connect(lp); lp.connect(mod); mod.connect(Sound.humGain); Sound.humGain.connect(c.destination);
        src.start(); lfo.start();
      } catch (e) { Sound.humGain = null; return; }
    }
    if (Sound.muted) { Sound.humGain.gain.cancelScheduledValues(c.currentTime); Sound.humGain.gain.setValueAtTime(0, c.currentTime); return; }
    if (c.state === 'suspended') c.resume();
    Sound.humGain.gain.setTargetAtTime(0.09 * lvl, c.currentTime, 0.8);
  }
  LR.Sound = Sound;

  // زر الكتم (مشترك)
  LR.bindMute = function (btn) {
    function paint() {
      btn.classList.toggle('muted', Sound.muted);
      btn.title = Sound.muted ? LR.t('unmute') : LR.t('mute');
      btn.setAttribute('aria-label', btn.title);
    }
    btn.addEventListener('click', function () { Sound.setMuted(!Sound.muted); paint(); });
    paint();
  };
  LR.bindFullscreen = function (btn) {
    btn.addEventListener('click', function () {
      var d = document, el = d.documentElement;
      if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
      else if (el.requestFullscreen || el.webkitRequestFullscreen) (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
    });
  };

  /* ---------------- احتفال (قصاصات ملونة) ---------------- */
  LR.confetti = function (ms) {
    var cv = document.createElement('canvas');
    cv.className = 'confetti';
    document.body.appendChild(cv);
    var ctx = cv.getContext('2d'), W, H, parts = [], colors = ['#F5C044', '#3B82F6', '#22C55E', '#EF4444', '#A855F7', '#F97316', '#fff'];
    function size() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
    size();
    for (var i = 0; i < 160; i++) parts.push({ x: Math.random() * W, y: -20 - Math.random() * H * 0.6, w: 6 + Math.random() * 6, h: 8 + Math.random() * 8, vy: 2 + Math.random() * 3.5, vx: -1.5 + Math.random() * 3, r: Math.random() * 6, vr: -0.2 + Math.random() * 0.4, c: LR.pick(colors) });
    var end = Date.now() + (ms || 3500);
    (function frame() {
      ctx.clearRect(0, 0, W, H);
      parts.forEach(function (p) {
        p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
      });
      if (Date.now() < end) requestAnimationFrame(frame);
      else { cv.style.transition = 'opacity .6s'; cv.style.opacity = '0'; setTimeout(function () { cv.remove(); }, 700); }
    })();
  };

  // الخلفية: إن وُجدت room-bg.jpg تظهر ضبابية خلف المؤثرات
  LR.loadHallImage = function (el) {
    var img = new Image();
    img.onload = function () { el.style.backgroundImage = 'url(room-bg.jpg)'; el.classList.add('on'); };
    img.src = 'room-bg.jpg';
  };

  return LR;
})();
