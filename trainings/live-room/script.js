// ============================================================
// script.js — صفحة المتدرب (غرفة التدريب المباشر)
// بعد الدخول يجري كل شيء داخل القاعة (hall.js): الانتظار والسؤال والنتيجة.
// ============================================================
(function () {
  var t = LR.t, esc = LR.esc, Sound = LR.Sound;
  var $ = function (id) { return document.getElementById(id); };
  // نفس شرط CSS: على الشاشات الضيقة أو العمودية تكون الإجابة في اللوحة تحت القاعة
  var NARROW = window.matchMedia ? window.matchMedia('(max-width: 760px), (max-aspect-ratio: 4/3)') : { matches: false };

  var S = {
    user: null, code: null, name: '',
    meta: null, members: {}, presence: {}, scores: {}, current: null, final: null, host: false,
    mine: null, answeredLive: {}, ansQid: null, ansRef: null,
    joined: false, answered: {}, myAnswer: null, boardMode: false,
    screen: null, qid: null, revealQid: null, timerId: null, lastSec: null, listeners: [],
    hall: null, loadedAt: 0, reactAt: 0, rvTimer: null
  };

  /* ---------------- الشاشات ---------------- */
  // الشاشات: بطاقات الدخول (scrLoading/Auth/Code/Name/Msg) و scrFinal فوق القاعة، و 'hall' = لا بطاقة
  function show(id) {
    if (S.screen === id) return;
    S.screen = id;
    document.querySelectorAll('.scr').forEach(function (el) { el.classList.toggle('hidden', el.id !== id); });
    document.body.classList.toggle('in-hall', id === 'hall' || id === 'scrFinal');
    var lit = id === 'scrFinal';
    $('hall').classList.toggle('lit', lit);
  }
  function message(txt, ico) {
    $('msgText').textContent = txt;
    $('msgIco').textContent = ico || '🔒';
    show('scrMsg');
  }

  /* ---------------- البداية ---------------- */
  function boot() {
    LR.applyStatic();
    Sound.init('sounds/');
    LR.bindMute($('muteBtn'));
    LR.bindFullscreen($('fsBtn'));
    LR.loadHallImage($('hallImg'));
    S.hall = LR_HALL.create($('hallWrap'), { me: null });
    board({ q: t('waiting'), sub: t('hall_wait_sub') });
    try { LR.initFirebase(); } catch (e) { message(t('err_db'), '⚠️'); return; }

    // رمز من الرابط المباشر ?room=123456
    var m = /[?&]room=(\d{6})/.exec(location.search);
    if (m) S.code = m[1];

    bindForms();
    window.fbAuth.onAuthStateChanged(function (u) {
      S.user = u || null;
      if (!u) { show('scrAuth'); return; }
      if (S.joined) return;
      if (S.code) checkRoom(S.code); else show('scrCode');
    });
    window.fbAuth.getRedirectResult().catch(function () {});
  }

  function bindForms() {
    $('googleBtn').addEventListener('click', function () {
      var prov = new firebase.auth.GoogleAuthProvider();
      window.fbAuth.signInWithPopup(prov).catch(function (err) {
        if (/popup-blocked|operation-not-supported|web-storage/.test(err.code || '')) window.fbAuth.signInWithRedirect(prov);
        else if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') $('authErr').textContent = t('login_err');
      });
    });
    $('emailForm').addEventListener('submit', function (e) {
      e.preventDefault();
      $('authErr').textContent = '';
      window.fbAuth.signInWithEmailAndPassword($('emailIn').value.trim(), $('passIn').value).catch(function () { $('authErr').textContent = t('login_err'); });
    });
    $('codeIn').addEventListener('input', function () { this.value = this.value.replace(/\D/g, '').slice(0, 6); });
    $('codeForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var c = $('codeIn').value.trim();
      $('codeErr').textContent = '';
      if (!/^\d{6}$/.test(c)) { $('codeErr').textContent = t('err_code'); return; }
      checkRoom(c);
    });
    $('nameForm').addEventListener('submit', function (e) { e.preventDefault(); join(); });
    $('msgBtn').addEventListener('click', function () {
      S.code = null;
      history.replaceState(null, '', location.pathname + (LR.emu ? '?emu=1' : ''));
      $('codeIn').value = '';
      show('scrCode');
    });
    // التفاعلات 👏 🔥 😮: تطير فوق مقعدي ويراها الجميع
    document.querySelectorAll('#mine .react').forEach(function (b) {
      b.addEventListener('click', function () { react(b.getAttribute('data-r'), b); });
    });
  }

  function roomDead(meta) {
    return !meta || meta.status === 'ended' || (meta.expiresAt && LR.serverNow() > meta.expiresAt);
  }

  function checkRoom(code) {
    show('scrLoading');
    Promise.all([
      LR.roomRef(code, 'meta').once('value'),
      LR.roomRef(code, 'members/' + S.user.uid).once('value')
    ]).then(function (r) {
      var meta = r[0].val(), mine = r[1].val();
      if (!meta) { S.code = null; show('scrCode'); $('codeErr').textContent = t('err_code'); return; }
      if (roomDead(meta)) { message(t('err_ended'), '⏹️'); return; }
      if (meta.locked && !mine) { message(t('err_locked'), '🔒'); return; }
      S.code = code;
      var saved = '';
      try { saved = localStorage.getItem('lr_name') || ''; } catch (e) {}
      $('nameIn').value = (mine && mine.name) || saved || (S.user.displayName || '').slice(0, 30);
      $('nameRoomTag').textContent = code.slice(0, 3) + ' ' + code.slice(3);
      show('scrName');
      setTimeout(function () { $('nameIn').focus(); }, 50);
    }).catch(function () { message(t('err_db'), '⚠️'); });
  }

  function join() {
    var name = $('nameIn').value.replace(/\s+/g, ' ').trim().slice(0, 30);
    if (!name) return;
    $('nameErr').textContent = '';
    try { localStorage.setItem('lr_name', name); } catch (e) {}
    S.name = name;
    var rec = { name: name, joinedAt: LR.SERVER_TS() }, photo = LR.photoOf(S.user);
    if (photo) rec.photo = photo;
    LR.roomRef(S.code, 'members/' + S.user.uid).set(rec).then(function () {
      S.joined = true;
      enterHall();
    }).catch(function () {
      // ربما أُقفلت الغرفة أو انتهت بين الخطوتين
      LR.roomRef(S.code, 'meta').once('value').then(function (s) {
        var meta = s.val();
        if (roomDead(meta)) message(t('err_ended'), '⏹️');
        else if (meta && meta.locked) message(t('err_locked'), '🔒');
        else $('nameErr').textContent = t('err_join');
      });
    });
  }

  /* ---------------- داخل القاعة ---------------- */
  function enterHall() {
    var code = S.code, uid = S.user.uid;
    if (!/[?&]room=/.test(location.search)) history.replaceState(null, '', '?room=' + code + (LR.emu ? '&emu=1' : ''));
    $('roomPill').classList.remove('hidden');
    $('roomPillText').textContent = code.slice(0, 3) + ' ' + code.slice(3);
    S.hall.me = uid;
    S.hall.setCode(code);
    S.hall.arm(3000); // لا إشعارات «دخل القاعة» لمن كانوا قبلي
    S.loadedAt = LR.serverNow();
    $('mine').classList.remove('hidden');
    show('hall');

    // الحضور: يختفي تلقائياً عند إغلاق الصفحة أو انقطاع الاتصال
    var presRef = LR.roomRef(code, 'presence/' + uid);
    on(LR.db.ref('.info/connected'), function (s) {
      if (s.val() !== true) return;
      presRef.onDisconnect().remove().then(function () { presRef.set(true); });
    });

    on(LR.roomRef(code, 'meta'), function (s) { S.meta = s.val(); S.hall.setSim(!!(S.meta && S.meta.sim)); render(); });
    on(LR.roomRef(code, 'members'), function (s) { S.members = s.val() || {}; paintHall(); });
    on(LR.roomRef(code, 'presence'), function (s) { S.presence = s.val() || {}; paintHall(); });
    on(LR.roomRef(code, 'scores'), function (s) { S.scores = s.val() || {}; paintHall(); });
    on(LR.roomRef(code, 'mine/' + uid), function (s) { S.mine = s.val(); });
    on(LR.roomRef(code, 'host'), function (s) { S.host = !!s.val(); render(); });
    on(LR.roomRef(code, 'final'), function (s) { S.final = s.val(); render(); });
    on(LR.roomRef(code, 'current'), function (s) { S.current = s.val(); watchAnswered(); render(); });
    // التفاعلات: كل تغيير جديد يطير فوق مقعد صاحبه
    var rref = LR.roomRef(code, 'reactions');
    var onReact = function (s) {
      var r = s.val();
      if (!r || !LR.REACTIONS[r.e] || r.ts < S.loadedAt - 4000 || LR.serverNow() - r.ts > 6000) return;
      S.hall.fly(s.key, LR.REACTIONS[r.e]);
    };
    rref.on('child_added', onReact, function () {});
    rref.on('child_changed', onReact, function () {});
    S.listeners.push(rref);
    // انتهاء الصلاحية بعد 3 ساعات حتى لو لم يضغط المدرّب "إنهاء"
    setInterval(function () { if (S.meta && roomDead(S.meta) && S.screen !== 'scrFinal' && S.screen !== 'scrMsg') render(); }, 5000);
  }
  function on(ref, cb) { ref.on('value', cb, function () {}); S.listeners.push(ref); }

  // من أجاب على السؤال الحالي (بدون كشف الإجابة): يضيء المقعد
  function watchAnswered() {
    var c = S.current, want = c && c.qid ? c.qid : null;
    if (S.ansQid === want) return;
    if (S.ansRef) { S.ansRef.off(); S.ansRef = null; }
    S.ansQid = want; S.answeredLive = {};
    S.hall.setAnswered({});
    if (!want) return;
    S.ansRef = LR.roomRef(S.code, 'answered/' + want);
    S.ansRef.on('value', function (s) { S.answeredLive = s.val() || {}; S.hall.setAnswered(S.answeredLive); }, function () {});
  }

  function phase() {
    if (roomDead(S.meta)) return 'final';
    var c = S.current;
    if (c && c.qid && c.state === 'live') return 'live';
    if (c && c.qid && c.state === 'reveal') return 'reveal';
    return 'wait';
  }

  // الحاضرون + الترتيب → القاعة
  function paintHall() {
    if (!S.joined) return;
    var present = Object.keys(S.presence).filter(function (u) { return S.members[u]; });
    var people = present.map(function (u) { var m = S.members[u]; return { uid: u, name: m.name, photo: m.photo, joinedAt: m.joinedAt }; });
    var st = LR.standings(S.scores), started = st.length > 0, ph = phase();
    S.hall.update({
      phase: ph === 'final' ? 'reveal' : ph,
      people: people,
      ranking: started ? st.map(function (r) { return r.uid; }) : null,
      top5: started ? st.slice(0, 5) : null
    });
    Sound.hum(present.length, ph === 'live');
    paintMyScore();
    $('piTopBox').classList.toggle('hidden', !started);
    $('piTop').innerHTML = st.slice(0, 5).map(function (r, i) {
      return '<li' + (r.uid === S.user.uid ? ' class="me"' : '') + '><span>' + LR_HALL.MEDALS[i] + '</span><span class="nm">' + esc(r.uid === S.user.uid ? 'أنت' : r.name) + '</span><b>' + r.total + '</b></li>';
    }).join('');
  }
  function myRank() {
    var st = LR.standings(S.scores), rank = 0;
    st.forEach(function (r, i) { if (r.uid === S.user.uid) rank = i + 1; });
    return { rank: rank, of: st.length, total: ((S.scores[S.user.uid] || {}).total || 0) };
  }
  function paintMyScore() {
    var r = myRank();
    $('myScore').innerHTML = r.rank
      ? t('your_rank') + ' <b>' + r.rank + '</b> ' + t('of') + ' ' + r.of + ' · ' + t('your_points') + ' <b>' + r.total + '</b>'
      : esc(t('my_seat'));
  }

  function render() {
    if (!S.joined) return;
    var ph = phase();
    if (ph === 'final') { stopTimer(); hideDesk(); renderFinal(); paintHall(); return; }
    var c = S.current;
    if (ph === 'live') { renderQuestion(c); paintHall(); return; }
    stopTimer();
    if (ph === 'reveal') { renderReveal(c); paintHall(); return; }
    S.qid = null; S.qRendered = false;
    hideDesk();
    board({ q: S.host ? t('waiting') : t('host_off'), sub: t('hall_wait_sub') });
    paintHall();
  }

  // جدار السؤال (+ نسخة مقروءة على الهاتف)
  function board(b) {
    S.hall.setBoard(b);
    $('piQ').textContent = b.q || '';
    $('piSub').textContent = b.sub || '';
  }

  /* ---------- لوحة الإجابة ---------- */
  function setDesk(mode) { // 'q' | 'compact' | 'rv'
    var d = $('desk');
    d.classList.remove('hidden', 'is-q', 'is-compact', 'is-rv');
    d.classList.add('is-' + mode);
    $('rv').classList.toggle('hidden', mode !== 'rv');
    document.body.classList.toggle('desk-open', true);
  }
  function hideDesk() {
    $('desk').classList.add('hidden');
    document.body.classList.remove('desk-open');
    clearTimeout(S.rvTimer);
  }

  /* ---------- السؤال ---------- */
  var TYPE_LBL = function (ty) { var x = window.LR_TYPES[ty]; return x ? x.icon + ' ' + x.name : ''; };
  function renderQuestion(c) {
    if (S.qid === c.qid && S.qRendered) return; // مرسوم بالفعل
    S.qid = c.qid;
    S.qRendered = true;
    S.myAnswer = null;
    clearTimeout(S.rvTimer);
    var p = c.payload || {};
    $('qNum').textContent = t('question') + ' ' + (c.n || '');
    $('qType').textContent = TYPE_LBL(p.type);
    $('qText').textContent = LR.devText(p.text);
    $('qState').className = 'q-state hidden';
    show('hall');
    Sound.play('bell');
    // على الشاشة العريضة: الاختيار من متعدد وصح/خطأ على الجدار نفسه
    S.boardMode = !NARROW.matches && (p.type === 'mcq' || p.type === 'tf');
    var bd = { q: LR.devText(p.text), sub: TYPE_LBL(p.type) };
    var box = $('qBody');
    box.innerHTML = '';
    box.classList.remove('locked');
    if (S.boardMode) {
      bd.sub = t('pick_answer');
      if (p.svg) bd.img = p.svg;
      bd.opts = p.type === 'tf'
        ? [{ label: '✓ ' + t('tf_true') }, { label: '✗ ' + t('tf_false') }]
        : p.options.map(function (o) { return { label: o }; });
      bd.onPick = function (i) { submit(c, p.type === 'tf' ? (i === 0 ? 'true' : 'false') : String(i)); };
      $('desk').classList.add('hidden');
      document.body.classList.remove('desk-open');
    } else {
      bd.sub = NARROW.matches ? TYPE_LBL(p.type) : t('on_device');
      setDesk('q');
      LR_CH.render(box, p, function (v) { submit(c, v); });
    }
    board(bd);
    // هل أجبت سابقاً (إعادة تحميل الصفحة أثناء السؤال)؟
    LR.roomRef(S.code, 'answers/' + c.qid + '/' + S.user.uid).once('value').then(function (s) {
      if (s.exists() && S.qid === c.qid) { S.answered[c.qid] = true; lockAnswer(); sentState(c, s.val()); }
    }).catch(function () {});
    startTimer(c);
  }
  function lockAnswer() {
    LR_CH.lock($('qBody'));
    S.hall.lockOpts();
  }

  function submit(c, v) {
    if (S.answered[c.qid]) return;
    S.answered[c.qid] = true;
    lockAnswer();
    var uid = S.user.uid, up = {};
    up['answers/' + c.qid + '/' + uid] = { v: String(v), ts: LR.SERVER_TS() };
    up['answered/' + c.qid + '/' + uid] = true;
    LR.roomRef(S.code).update(up).then(function () {
      return LR.roomRef(S.code, 'answers/' + c.qid + '/' + uid).once('value');
    }).then(function (s) {
      if (S.qid === c.qid) sentState(c, s.val());
    }).catch(function () {
      if (S.qid !== c.qid) return;
      if (S.boardMode) setDesk('compact');
      $('qState').className = 'q-state bad';
      $('qState').textContent = t('send_fail');
    });
  }
  function sentState(c, a) {
    var ms = a && a.ts ? a.ts - c.publishedAt : null;
    if (S.boardMode) setDesk('compact');
    $('qState').className = 'q-state ok';
    $('qState').innerHTML = '✓ ' + t('sent') + (ms != null ? ' ' + t('sent_in') + ' <b>' + LR.fmtSec(ms) + '</b> ' + t('sec') : '') + '<small>' + t('wait_end') + '</small>';
  }

  /* ---------- العدّاد (من توقيت الخادم) ---------- */
  var RING = 2 * Math.PI * 52;
  function startTimer(c) {
    stopTimer();
    var endAt = c.publishedAt + c.duration * 1000, half = null;
    S.lastSec = null;
    $('timerRing').style.strokeDasharray = RING;
    function step() {
      var left = endAt - LR.serverNow();
      var sec = Math.max(0, Math.ceil(left / 1000));
      var frac = Math.max(0, Math.min(1, left / (c.duration * 1000)));
      $('timerRing').style.strokeDashoffset = RING * (1 - frac);
      $('timer').classList.toggle('hot', sec <= 5 && left > 0);
      S.hall.setTimer(left > 0 ? sec : '', sec <= 5 && left > 0);
      if (sec !== S.lastSec) {
        $('timerNum').textContent = sec;
        if (S.lastSec != null && left > 0) {
          if (sec <= 5) { Sound.play('heartbeat'); Sound.play('tick', 0.8); }
          else Sound.play('tick', 0.5);
        }
        S.lastSec = sec;
        half = sec <= 5 ? Date.now() + 500 : null;
      } else if (half && Date.now() >= half && left > 0) { // التكّات تتسارع في آخر 5 ثوانٍ
        half = null; Sound.play('tick', 0.8);
      }
      if (left <= 0) {
        stopTimer();
        $('timer').classList.remove('hot');
        lockAnswer();
        if (!S.answered[c.qid]) {
          if (S.boardMode) setDesk('compact');
          $('qState').className = 'q-state bad'; $('qState').innerHTML = t('time_up') + '<small>' + t('computing') + '</small>';
        } else { var st = $('qState'); if (st.querySelector('small')) st.querySelector('small').textContent = t('computing'); }
      }
    }
    step();
    S.timerId = setInterval(step, 100);
  }
  function stopTimer() { if (S.timerId) { clearInterval(S.timerId); S.timerId = null; } S.hall && S.hall.setTimer(''); }

  /* ---------- النتيجة بعد السؤال: نتيجتي فقط ---------- */
  function renderReveal(c) {
    if (S.revealQid === c.qid) return;
    S.qRendered = false;
    LR.roomRef(S.code, 'reveal/' + c.qid).once('value').then(function (s) {
      var rv = s.val();
      if (!rv || !S.current || S.current.qid !== c.qid || S.current.state !== 'reveal') return;
      S.revealQid = c.qid;
      // نتيجتي من المسار الخاص mine/{uid} (القديم: scores/{uid}/last)
      var me = S.scores[S.user.uid] || {};
      var last = S.mine && S.mine.qid === c.qid ? S.mine : (me.last && me.last.qid === c.qid ? me.last : null);
      var ok = last && last.ok, answered = last && last.answered;
      $('rvMe').className = 'rv-me ' + (ok ? 'ok' : answered ? 'bad' : 'none');
      $('rvMe').innerHTML = (ok ? '<span class="big">✓</span>' + t('correct') + ' <b>+' + last.pts + '</b>' :
        answered ? '<span class="big">✗</span>' + t('wrong') : '<span class="big">⏱</span>' + t('no_answer')) +
        '<small>' + LR.pick(ok ? t('enc_ok') : answered ? t('enc_bad') : t('enc_none')) + '</small>';
      $('rvCorrect').innerHTML = rv.correctText ? t('correct_was') + ' <b>' + esc(rv.correctText) + '</b>' : '';
      board({ q: rv.correctText ? t('correct_was') + ' ' + rv.correctText : t('time_up'), sub: t('rank_hint') });
      setDesk('rv');
      clearTimeout(S.rvTimer);
      S.rvTimer = setTimeout(function () { if (S.revealQid === c.qid && phase() === 'reveal') hideDesk(); }, 7000);
      paintHall();
      var rank = myRank().rank;
      show('hall');
      Sound.play(ok ? 'correct' : 'wrong');
      setTimeout(function () { Sound.play('applause'); }, 700);
      if (rank === 1) { setTimeout(function () { Sound.play('cheer'); }, 1200); LR.confetti(4000); }
      else if (ok) LR.confetti(1800);
    }).catch(function () {});
  }

  /* ---------- النهاية: المنصة ---------- */
  function renderFinal() {
    if (S.screen === 'scrFinal' && $('podium').getAttribute('data-done') === '1') return;
    var podium = (S.final && S.final.podium) || LR.standings(S.scores).slice(0, 3);
    board({ q: podium.length ? '👑 ' + t('winner') + ' ' + podium[0].name : t('session_over'), sub: t('final_title') });
    if (!podium.length) { message(t('session_over'), '👋'); return; }
    var order = [1, 0, 2]; // ترتيب المنصة المعتاد: الثاني يساراً، الأول وسطاً، الثالث يميناً
    $('podium').innerHTML = order.map(function (i) {
      var r = podium[i];
      if (!r) return '<div class="pd pd' + (i + 1) + ' empty"></div>';
      var m = S.members[r.uid] || {};
      var av = m.photo ? '<span class="av ph"><img src="' + esc(m.photo) + '" alt="" referrerpolicy="no-referrer"></span>' : '<span class="av" style="--h:' + LR.hue(r.name) + '">' + esc(LR.initials(r.name)) + '</span>';
      return '<div class="pd pd' + (i + 1) + (r.uid === S.user.uid ? ' me' : '') + '">' +
        '<div class="pd-who">' + (i === 0 ? '<span class="pd-crown">👑</span>' : '') + av +
        '<span class="nm">' + esc(r.name) + '</span><b class="pt">' + r.total + ' ' + t('points') + '</b></div>' +
        '<div class="pd-block"><span>' + (i + 1) + '</span></div></div>';
    }).join('');
    $('podium').setAttribute('data-done', '1');
    var r2 = myRank();
    $('finalRank').innerHTML = r2.rank ? t('final_rank') + ' <b>' + r2.rank + '</b> ' + t('of') + ' ' + r2.of + ' · ' + t('your_points') + ' <b>' + r2.total + '</b>' : t('session_over');
    show('scrFinal');
    Sound.play('applause');
    setTimeout(function () { Sound.play('cheer'); }, 600);
    LR.confetti(6000);
  }

  /* ---------- التفاعلات ---------- */
  function react(key, btn) {
    if (!S.joined || !LR.REACTIONS[key]) return;
    var now = Date.now();
    if (now - S.reactAt < 1000) return; // تفاعل واحد كل ثانية
    S.reactAt = now;
    btn.classList.add('sent'); setTimeout(function () { btn.classList.remove('sent'); }, 300);
    LR.roomRef(S.code, 'reactions/' + S.user.uid).set({ e: key, ts: LR.SERVER_TS() }).catch(function () {});
  }

  // منع قائمة المتصفح أثناء الأسئلة (الزر الأيمن له استعمال داخل التحدي)
  document.addEventListener('contextmenu', function (e) { if (phase() === 'live' && S.joined) e.preventDefault(); });

  boot();
})();
