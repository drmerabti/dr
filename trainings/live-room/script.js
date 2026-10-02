// ============================================================
// script.js — صفحة المتدرب (غرفة التدريب المباشر)
// ============================================================
(function () {
  var t = LR.t, esc = LR.esc, Sound = LR.Sound;
  var $ = function (id) { return document.getElementById(id); };

  var S = {
    user: null, code: null, name: '',
    meta: null, members: {}, presence: {}, scores: {}, current: null, final: null, host: false,
    joined: false, answered: {}, myAnswer: null,
    screen: null, qid: null, revealQid: null, timerId: null, lastSec: null, listeners: []
  };

  /* ---------------- الشاشات ---------------- */
  function show(id) {
    if (S.screen === id) return;
    S.screen = id;
    document.querySelectorAll('.scr').forEach(function (el) { el.classList.toggle('hidden', el.id !== id); });
    var lit = id === 'scrReveal' || id === 'scrFinal';
    $('hall').classList.toggle('lit', lit);
    $('hall').classList.toggle('live', id === 'scrQuestion');
    Sound.ambience(id === 'scrLobby');
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
    LR.roomRef(S.code, 'members/' + S.user.uid).set({ name: name, joinedAt: LR.SERVER_TS() }).then(function () {
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

    // الحضور: يختفي تلقائياً عند إغلاق الصفحة أو انقطاع الاتصال
    var presRef = LR.roomRef(code, 'presence/' + uid);
    on(LR.db.ref('.info/connected'), function (s) {
      if (s.val() !== true) return;
      presRef.onDisconnect().remove().then(function () { presRef.set(true); });
    });

    on(LR.roomRef(code, 'meta'), function (s) { S.meta = s.val(); render(); });
    on(LR.roomRef(code, 'members'), function (s) { S.members = s.val() || {}; renderLobby(); });
    on(LR.roomRef(code, 'presence'), function (s) { S.presence = s.val() || {}; renderLobby(); });
    on(LR.roomRef(code, 'scores'), function (s) { S.scores = s.val() || {}; renderLobby(); });
    on(LR.roomRef(code, 'host'), function (s) { S.host = !!s.val(); renderLobby(); });
    on(LR.roomRef(code, 'final'), function (s) { S.final = s.val(); render(); });
    on(LR.roomRef(code, 'current'), function (s) { S.current = s.val(); render(); });
    // انتهاء الصلاحية بعد 3 ساعات حتى لو لم يضغط المدرّب "إنهاء"
    setInterval(function () { if (S.meta && roomDead(S.meta) && S.screen !== 'scrFinal' && S.screen !== 'scrMsg') render(); }, 5000);
  }
  function on(ref, cb) { ref.on('value', cb, function () {}); S.listeners.push(ref); }

  function render() {
    if (!S.joined) return;
    if (roomDead(S.meta)) { stopTimer(); renderFinal(); return; }
    var c = S.current;
    if (c && c.qid && c.state === 'live') { renderQuestion(c); return; }
    stopTimer();
    if (c && c.qid && c.state === 'reveal') { renderReveal(c); return; }
    S.qid = null;
    show('scrLobby');
    renderLobby();
  }

  /* ---------- الانتظار: دوائر الحاضرين ثم ترتيب حي بعد السؤال الأول ---------- */
  function renderLobby() {
    if (!S.joined) return;
    var present = Object.keys(S.presence).filter(function (u) { return S.members[u]; });
    $('presentCount').textContent = present.length;
    $('lobbyStatus').textContent = S.host ? t('waiting') : t('host_off');
    var started = Object.keys(S.scores).length > 0;
    $('people').classList.toggle('hidden', started);
    $('rankList').classList.toggle('hidden', !started);
    if (!started) {
      // ترتيب ثابت حسب وقت الدخول حتى لا تقفز الدوائر
      present.sort(function (a, b) { return (S.members[a].joinedAt || 0) - (S.members[b].joinedAt || 0); });
      var html = present.map(function (u) {
        var n = S.members[u].name, me = u === S.user.uid;
        return '<div class="pp' + (me ? ' me' : '') + '" title="' + esc(n) + '" style="--h:' + LR.hue(n) + '"><span>' + esc(LR.initials(n)) + '</span><i></i></div>';
      }).join('');
      if ($('people').getAttribute('data-h') !== html) { $('people').innerHTML = html; $('people').setAttribute('data-h', html); }
      return;
    }
    var st = LR.standings(S.scores);
    // من دخل ولم يُحتسب بعد يظهر في آخر القائمة
    present.forEach(function (u) { if (!S.scores[u]) st.push({ uid: u, name: S.members[u].name, total: 0 }); });
    $('rankList').innerHTML = '<div class="rl-h">' + t('ranking') + '</div>' + st.map(function (r, i) {
      var on = !!S.presence[r.uid], me = r.uid === S.user.uid;
      return '<div class="rl-row' + (me ? ' me' : '') + (on ? '' : ' off') + '">' + medal(i) +
        '<span class="av" style="--h:' + LR.hue(r.name) + '">' + esc(LR.initials(r.name)) + '<i></i></span>' +
        '<span class="nm">' + esc(r.name) + '</span><b class="pt">' + r.total + '</b></div>';
    }).join('');
  }
  function medal(i) {
    if (i === 0) return '<span class="md crown">👑</span>';
    if (i === 1) return '<span class="md">🥈</span>';
    if (i === 2) return '<span class="md">🥉</span>';
    return '<span class="md num">' + (i + 1) + '</span>';
  }

  /* ---------- السؤال ---------- */
  var TYPE_LBL = function (ty) { var x = window.LR_TYPES[ty]; return x ? x.icon + ' ' + x.name : ''; };
  function renderQuestion(c) {
    if (S.qid === c.qid && S.screen === 'scrQuestion') return; // مرسوم بالفعل
    S.qid = c.qid;
    S.myAnswer = null;
    var p = c.payload || {};
    $('qNum').textContent = t('question') + ' ' + (c.n || '');
    $('qType').textContent = TYPE_LBL(p.type);
    $('qText').textContent = LR.devText(p.text);
    $('qState').className = 'q-state hidden';
    show('scrQuestion');
    Sound.play('bell');
    var box = $('qBody');
    LR_CH.render(box, p, function (v) { submit(c, v); });
    // هل أجبت سابقاً (إعادة تحميل الصفحة أثناء السؤال)؟
    LR.roomRef(S.code, 'answers/' + c.qid + '/' + S.user.uid).once('value').then(function (s) {
      if (s.exists() && S.qid === c.qid) { S.answered[c.qid] = true; LR_CH.lock(box); sentState(c, s.val()); }
    }).catch(function () {});
    startTimer(c);
  }

  function submit(c, v) {
    if (S.answered[c.qid]) return;
    S.answered[c.qid] = true;
    LR_CH.lock($('qBody'));
    var ref = LR.roomRef(S.code, 'answers/' + c.qid + '/' + S.user.uid);
    ref.set({ v: String(v), ts: LR.SERVER_TS() }).then(function () {
      return ref.once('value');
    }).then(function (s) {
      if (S.qid === c.qid) sentState(c, s.val());
    }).catch(function () {
      if (S.qid !== c.qid) return;
      $('qState').className = 'q-state bad';
      $('qState').textContent = t('send_fail');
    });
  }
  function sentState(c, a) {
    var ms = a && a.ts ? a.ts - c.publishedAt : null;
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
        LR_CH.lock($('qBody'));
        if (!S.answered[c.qid]) { $('qState').className = 'q-state bad'; $('qState').innerHTML = t('time_up') + '<small>' + t('computing') + '</small>'; }
        else { var st = $('qState'); if (st.querySelector('small')) st.querySelector('small').textContent = t('computing'); }
      }
    }
    step();
    S.timerId = setInterval(step, 100);
  }
  function stopTimer() { if (S.timerId) { clearInterval(S.timerId); S.timerId = null; } }

  /* ---------- النتيجة بعد السؤال ---------- */
  function renderReveal(c) {
    if (S.revealQid === c.qid && S.screen === 'scrReveal') return;
    LR.roomRef(S.code, 'reveal/' + c.qid).once('value').then(function (s) {
      var rv = s.val();
      if (!rv || !S.current || S.current.qid !== c.qid || S.current.state !== 'reveal') return;
      S.revealQid = c.qid;
      var me = S.scores[S.user.uid] || {}, last = me.last && me.last.qid === c.qid ? me.last : null;
      var ok = last && last.ok, answered = last && last.answered;
      $('rvMe').className = 'rv-me ' + (ok ? 'ok' : answered ? 'bad' : 'none');
      $('rvMe').innerHTML = (ok ? '<span class="big">✓</span>' + t('correct') + ' <b>+' + last.pts + '</b>' :
        answered ? '<span class="big">✗</span>' + t('wrong') : '<span class="big">⏱</span>' + t('no_answer')) +
        '<small>' + LR.pick(ok ? t('enc_ok') : answered ? t('enc_bad') : t('enc_none')) + '</small>';
      $('rvCorrect').innerHTML = rv.correctText ? t('correct_was') + ' <b>' + esc(rv.correctText) + '</b>' : '';
      $('top5').innerHTML = (rv.top || []).map(function (r, i) {
        return '<li class="t5 p' + (i + 1) + (r.uid === S.user.uid ? ' me' : '') + '" style="--d:' + (i * 0.18 + 0.3) + 's">' + medal(i) +
          '<span class="nm">' + esc(r.name) + '</span>' + (r.gain ? '<span class="gain">+' + r.gain + '</span>' : '') + '<b class="pt">' + r.total + '</b></li>';
      }).join('');
      var st = LR.standings(S.scores), rank = 0;
      st.forEach(function (r, i) { if (r.uid === S.user.uid) rank = i + 1; });
      $('rvRank').innerHTML = rank ? t('your_rank') + ' <b>' + rank + '</b> ' + t('of') + ' ' + st.length + ' · ' + t('your_points') + ' <b>' + (me.total || 0) + '</b>' : '';
      show('scrReveal');
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
    if (!podium.length) { message(t('session_over'), '👋'); return; }
    var order = [1, 0, 2]; // ترتيب المنصة المعتاد: الثاني يساراً، الأول وسطاً، الثالث يميناً
    $('podium').innerHTML = order.map(function (i) {
      var r = podium[i];
      if (!r) return '<div class="pd pd' + (i + 1) + ' empty"></div>';
      return '<div class="pd pd' + (i + 1) + (r.uid === S.user.uid ? ' me' : '') + '">' +
        '<div class="pd-who">' + (i === 0 ? '<span class="pd-crown">👑</span>' : '') +
        '<span class="av" style="--h:' + LR.hue(r.name) + '">' + esc(LR.initials(r.name)) + '</span>' +
        '<span class="nm">' + esc(r.name) + '</span><b class="pt">' + r.total + ' ' + t('points') + '</b></div>' +
        '<div class="pd-block"><span>' + (i + 1) + '</span></div></div>';
    }).join('');
    $('podium').setAttribute('data-done', '1');
    var st = LR.standings(S.scores), rank = 0;
    st.forEach(function (r, i) { if (r.uid === S.user.uid) rank = i + 1; });
    $('finalRank').innerHTML = rank ? t('final_rank') + ' <b>' + rank + '</b> ' + t('of') + ' ' + st.length + ' · ' + t('your_points') + ' <b>' + ((S.scores[S.user.uid] || {}).total || 0) + '</b>' : t('session_over');
    show('scrFinal');
    Sound.play('applause');
    setTimeout(function () { Sound.play('cheer'); }, 600);
    LR.confetti(6000);
  }

  // منع قائمة المتصفح أثناء الأسئلة (الزر الأيمن له استعمال داخل التحدي)
  document.addEventListener('contextmenu', function (e) { if (S.screen === 'scrQuestion') e.preventDefault(); });

  boot();
})();
