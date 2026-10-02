// ============================================================
// admin.js — صفحة المدرّب: الغرفة، البنك، النشر، التصحيح، الترتيب، التقرير
// التصحيح يتم هنا (المدرّب وحده يقرأ الإجابة الصحيحة)، ثم تُكتب النقاط
// والترتيب في القاعدة ليراها المتدربون.
// ============================================================
(function () {
  var esc = LR.esc, Sound = LR.Sound, P = window.LR_PARTS;
  var $ = function (id) { return document.getElementById(id); };
  var H3 = 3 * 3600 * 1000;

  var A = {
    user: null, code: null, meta: null, members: {}, presence: {}, scores: {}, current: null, qlog: {}, answersLive: {},
    custom: [], stage: 1, type: 'all', showAnswers: false, revealing: {}, refs: [], ansRef: null, ending: false
  };
  try { A.duration = Math.min(180, Math.max(5, parseInt(localStorage.getItem('lr_dur'), 10) || 20)); } catch (e) { A.duration = 20; }

  /* ================= البوابة ================= */
  function gate(title, html, opts) {
    opts = opts || {};
    $('gate').classList.remove('hidden'); $('home').classList.add('hidden'); $('room').classList.add('hidden');
    $('gateSpin').classList.toggle('hidden', !opts.spin);
    $('gateTitle').textContent = title || '';
    $('gateBody').innerHTML = html || '';
    $('gateLogin').classList.toggle('hidden', !opts.login);
  }

  function boot() {
    LR.applyStatic();
    LR.wantFirestore = true;
    Sound.init('sounds/');
    LR.bindMute($('muteBtn'));
    LR.bindFullscreen($('fsBtn'));
    gate(LR.t('loading'), '', { spin: true });
    try { LR.initFirebase(); } catch (e) { gate('تعذّر تهيئة قاعدة البيانات', esc(e.message)); return; }
    $('gateLogin').addEventListener('click', function () {
      var prov = new firebase.auth.GoogleAuthProvider();
      window.fbAuth.signInWithPopup(prov).catch(function (err) {
        if (/popup-blocked|operation-not-supported/.test(err.code || '')) window.fbAuth.signInWithRedirect(prov);
      });
    });
    bindUi();
    window.fbAuth.onAuthStateChanged(function (u) {
      A.user = u || null;
      if (!u) { gate('سجّل الدخول بحساب المدرّب', '', { login: true }); return; }
      checkAdmin();
    });
  }

  function checkAdmin() {
    gate(LR.t('loading'), '', { spin: true });
    var uid = A.user.uid;
    var fs = window.fbDb.collection('users').doc(uid).get().then(function (d) { return !!(d.exists && d.data().isAdmin === true); }).catch(function () { return false; });
    var rt = LR.db.ref('admins/' + uid).once('value').then(function (s) { return { ok: s.val() === true }; }).catch(function (e) { return { ok: false, err: e }; });
    var timeout = new Promise(function (res) { setTimeout(function () { res({ ok: false, err: { code: 'timeout' } }); }, 12000); });
    Promise.all([fs, Promise.race([rt, timeout])]).then(function (r) {
      var fsAdmin = r[0], rtd = r[1];
      if (rtd.ok) { start(); return; }
      if (!fsAdmin) { gate('هذه الصفحة للمدرّب فقط', '<p class="muted">حسابك ليس حساب مدرّب.</p><a class="btn btn-gold" href="./">صفحة المتدرب</a>'); return; }
      gate('خطوة إعداد واحدة', setupHtml(uid, rtd.err));
      var cp = $('uidCopy');
      if (cp) cp.addEventListener('click', function () { copy(uid); cp.textContent = 'تم النسخ ✓'; });
    });
  }
  function setupHtml(uid, err) {
    var timeout = err && err.code === 'timeout';
    return '<div class="setup">' +
      (timeout ? '<p><b>قاعدة Realtime Database لا تستجيب.</b> تأكد أنها مفعّلة في Firebase Console وأن الرابط صحيح في core.js (LR_DB_URL).</p>' : '') +
      '<p>حسابك مدرّب في الموقع، لكن قاعدة البيانات المباشرة لا تعرفه بعد. في <b>Firebase Console ← Realtime Database ← Data</b> أضف:</p>' +
      '<pre dir="ltr">admins\n  └─ ' + esc(uid) + ' : true</pre>' +
      '<button type="button" class="btn btn-sm btn-gold" id="uidCopy">نسخ المعرّف UID</button>' +
      '<p class="muted">ثم الصق القواعد من الملف database.rules.json في تبويب Rules، وأعد تحميل الصفحة.</p></div>';
  }

  function start() {
    $('gate').classList.add('hidden');
    loadCustom();
    var saved = null;
    try { saved = localStorage.getItem('lr_admin_room'); } catch (e) {}
    if (saved) {
      LR.roomRef(saved, 'meta').once('value').then(function (s) {
        var m = s.val();
        if (m && m.owner === A.user.uid && m.status === 'open' && LR.serverNow() < m.expiresAt) openRoom(saved);
        else { try { localStorage.removeItem('lr_admin_room'); } catch (e) {} showHome(); }
      }).catch(showHome);
    } else showHome();
  }

  /* ================= الصفحة الرئيسية ================= */
  function showHome() {
    $('home').classList.remove('hidden'); $('room').classList.add('hidden');
    loadPast();
  }
  function loadPast() {
    window.fbDb.collection('liveSessions').orderBy('endedAt', 'desc').limit(12).get().then(function (qs) {
      if (qs.empty) { $('pastList').innerHTML = '<p class="muted">لا توجد جلسات محفوظة بعد.</p>'; return; }
      var rows = [];
      qs.forEach(function (d) { rows.push(d); });
      $('pastList').innerHTML = rows.map(function (d, i) {
        var x = d.data();
        return '<div class="past-row"><div><b dir="ltr">' + esc(fmtCode(x.code)) + '</b><span>' + esc(fmtDate(x.createdAt)) + '</span></div>' +
          '<div class="past-meta">' + (x.participants || 0) + ' مشارك · ' + ((x.questions || []).length) + ' سؤال</div>' +
          '<button type="button" class="btn btn-sm btn-ghost" data-i="' + i + '">⬇ PDF</button></div>';
      }).join('');
      $('pastList').querySelectorAll('button').forEach(function (b) {
        b.addEventListener('click', function () { makeReport(rows[+b.getAttribute('data-i')].data(), b); });
      });
    }).catch(function () {
      $('pastList').innerHTML = '<p class="muted">تعذّر تحميل السجل (تحقق من قواعد Firestore لـ liveSessions).</p>';
    });
  }

  function createRoom() {
    var btn = $('createBtn');
    btn.disabled = true; $('createErr').textContent = '';
    var tries = 0;
    (function attempt() {
      tries++;
      var code = String(100000 + Math.floor(Math.random() * 900000));
      var ref = LR.roomRef(code, 'meta');
      ref.once('value').then(function (s) {
        if (s.exists()) throw { retry: true };
        return ref.set({ owner: A.user.uid, createdAt: LR.SERVER_TS(), expiresAt: LR.serverNow() + H3 - 5000, status: 'open', locked: false });
      }).then(function () {
        btn.disabled = false;
        openRoom(code);
      }).catch(function (e) {
        if (tries < 8) { attempt(); return; }
        btn.disabled = false;
        $('createErr').textContent = 'تعذّر إنشاء الغرفة' + (e && e.code ? ' (' + e.code + ')' : '') + '.';
      });
    })();
  }

  /* ================= الغرفة ================= */
  function openRoom(code) {
    detach();
    A.code = code; A.revealing = {}; A.ending = false;
    try { localStorage.setItem('lr_admin_room', code); } catch (e) {}
    $('home').classList.add('hidden'); $('room').classList.remove('hidden');
    var url = roomUrl(code);
    $('codeBig').textContent = fmtCode(code);
    $('linkIn').value = url;
    $('bcCode').textContent = fmtCode(code);
    $('bcUrl').textContent = url.replace(/^https?:\/\//, '');
    drawQr($('qr'), url, 5); drawQr($('bcQr'), url, 8);

    var hostRef = LR.roomRef(code, 'host');
    listen(LR.db.ref('.info/connected'), function (s) { if (s.val() === true) hostRef.onDisconnect().remove().then(function () { hostRef.set(true); }); });
    listen(LR.roomRef(code, 'meta'), function (s) { A.meta = s.val(); paintRoom(); });
    listen(LR.roomRef(code, 'members'), function (s) { A.members = s.val() || {}; paintAttendees(); paintStandings(); paintLive(); });
    listen(LR.roomRef(code, 'presence'), function (s) { A.presence = s.val() || {}; paintAttendees(); paintLive(); });
    listen(LR.roomRef(code, 'scores'), function (s) { A.scores = s.val() || {}; paintStandings(); paintLive(); });
    listen(LR.roomRef(code, 'qlog'), function (s) { A.qlog = s.val() || {}; paintBank(); });
    listen(LR.roomRef(code, 'current'), function (s) { A.current = s.val(); watchAnswers(); paintLive(); paintBank(); });
    paintBank();
  }
  function listen(ref, cb) { ref.on('value', cb, function () {}); A.refs.push(ref); }
  function detach() {
    A.refs.forEach(function (r) { r.off(); }); A.refs = [];
    if (A.ansRef) { A.ansRef.off(); A.ansRef = null; }
  }
  function roomUrl(code) {
    var u = new URL('./', location.href);
    u.search = '?room=' + code + (LR.emu ? '&emu=1' : '');
    return u.toString();
  }
  function fmtCode(c) { c = String(c || ''); return c.slice(0, 3) + ' ' + c.slice(3); }
  function fmtDate(ms) { if (!ms) return ''; var d = new Date(ms); return d.toLocaleDateString('ar-DZ-u-nu-latn') + ' ' + d.toLocaleTimeString('ar-DZ-u-nu-latn', { hour: '2-digit', minute: '2-digit' }); }
  function drawQr(el, url, cell) {
    try {
      var qr = qrcode(0, 'M'); qr.addData(url); qr.make();
      el.innerHTML = '<img alt="QR" src="' + qr.createDataURL(cell, 2) + '">';
    } catch (e) { el.innerHTML = ''; }
  }
  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).catch(function () { legacyCopy(text); });
    legacyCopy(text);
  }
  function legacyCopy(text) { var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} ta.remove(); }

  function paintRoom() {
    var m = A.meta;
    if (!m) return;
    $('lockBtn').textContent = m.locked ? '🔒 الغرفة مقفلة — فتح' : '🔓 قفل الغرفة';
    $('lockBtn').classList.toggle('on', !!m.locked);
    if (m.status === 'ended') showEnded();
  }
  // عدّاد انتهاء الصلاحية + الإنهاء التلقائي بعد 3 ساعات
  setInterval(function () {
    if (!A.meta || !A.code || A.meta.status !== 'open') return;
    var left = A.meta.expiresAt - LR.serverNow();
    if (left <= 0) { endSession(true); return; }
    var h = Math.floor(left / 3600000), mi = Math.floor(left % 3600000 / 60000), se = Math.floor(left % 60000 / 1000);
    $('expText').textContent = 'ينتهي الرمز تلقائياً بعد ' + h + ':' + (mi < 10 ? '0' : '') + mi + ':' + (se < 10 ? '0' : '') + se;
  }, 1000);

  function presentUids() { return Object.keys(A.presence).filter(function (u) { return A.members[u]; }); }
  function paintAttendees() {
    var uids = Object.keys(A.members), pres = A.presence;
    uids.sort(function (a, b) { return (pres[b] ? 1 : 0) - (pres[a] ? 1 : 0) || (A.members[a].joinedAt || 0) - (A.members[b].joinedAt || 0); });
    var n = presentUids().length;
    $('attCount').textContent = n + (uids.length > n ? ' / ' + uids.length : '');
    $('bcCount').textContent = n;
    $('attList').innerHTML = uids.length ? uids.map(function (u) {
      var nm = A.members[u].name;
      return '<div class="att' + (pres[u] ? '' : ' off') + '"><span class="av" style="--h:' + LR.hue(nm) + '">' + esc(LR.initials(nm)) + '<i></i></span><span class="nm">' + esc(nm) + '</span></div>';
    }).join('') : '<p class="muted">لم يدخل أحد بعد. شارك الرابط أو الرمز في دردشة زووم.</p>';
  }

  /* ================= بنك الأسئلة ================= */
  function allQuestions() { return window.LR_BANK.concat(A.custom); }
  function sentMap() { var m = {}; Object.keys(A.qlog).forEach(function (k) { m[A.qlog[k].bankId] = true; }); return m; }
  function isLive() { return A.current && A.current.state === 'live'; }

  function paintTabs() {
    $('stageTabs').innerHTML = window.LR_STAGES.map(function (s) {
      return '<button type="button" class="stab' + (s.id === A.stage ? ' on' : '') + '" data-s="' + s.id + '"><span class="sn">' + s.id + '</span>' + esc(s.name) + (s.soon ? '<em>قريباً</em>' : '') + '</button>';
    }).join('');
    var types = [['all', 'الكل']].concat(Object.keys(window.LR_TYPES).map(function (k) { return [k, window.LR_TYPES[k].icon + ' ' + window.LR_TYPES[k].name]; }));
    $('typeChips').innerHTML = types.map(function (x) { return '<button type="button" class="chip' + (A.type === x[0] ? ' on' : '') + '" data-ty="' + x[0] + '">' + esc(x[1]) + '</button>'; }).join('');
  }
  function thumb(q) {
    if (q.type === 'mcq' && q.img) return P.svg(q.img);
    if (q.type === 'drag') return P.svg(q.items[0]);
    if (q.type === 'rightclick') return P.obj(q.target);
    return '<span class="ti">' + window.LR_TYPES[q.type].icon + '</span>';
  }
  function detail(q) {
    var sa = A.showAnswers;
    switch (q.type) {
      case 'mcq': return q.options.map(function (o, i) { return '<span class="o' + (sa && i === Number(q.answer) ? ' ok' : '') + '">' + esc(o) + '</span>'; }).join('');
      case 'tf': return sa ? '<span class="o ok">' + (q.answer ? 'صح' : 'خطأ') + '</span>' : '';
      case 'click': case 'dblclick': return '<span class="o">' + q.count + (q.type === 'click' ? ' أهداف' : ' صناديق') + '</span>';
      case 'drag': return q.items.map(function (id) { return '<span class="o">' + esc(P.names[id]) + '</span>'; }).join('');
      case 'rightclick': return q.options.map(function (o, i) { return '<span class="o' + (sa && i === Number(q.answer) ? ' ok' : '') + '">' + esc(o) + '</span>'; }).join('');
      case 'typing': return '<span class="o">«' + esc(q.phrase) + '»</span>';
    }
    return '';
  }
  function paintBank() {
    if (!$('stageTabs').children.length) paintTabs();
    var stage = window.LR_STAGES.filter(function (s) { return s.id === A.stage; })[0];
    var list = allQuestions().filter(function (q) { return Number(q.stage) === A.stage && (A.type === 'all' || q.type === A.type); });
    var sent = sentMap(), live = isLive(), ok = A.meta && A.meta.status === 'open';
    $('bankCount').textContent = list.length + ' سؤال';
    if (!list.length) {
      $('bankList').innerHTML = '<div class="empty">' + (stage && stage.soon ? '⏳ بنك مرحلة «' + esc(stage.name) + '» قريباً.<br>يمكنك إضافة أسئلتك الخاصة لها الآن.' : 'لا توجد أسئلة بهذا النوع.') + '</div>';
      return;
    }
    $('bankList').innerHTML = list.map(function (q) {
      var custom = q.id.indexOf('c-') === 0;
      return '<div class="qcard' + (sent[q.id] ? ' sent' : '') + '">' +
        '<div class="qthumb">' + thumb(q) + '</div>' +
        '<div class="qinfo"><div class="qtype">' + window.LR_TYPES[q.type].icon + ' ' + esc(window.LR_TYPES[q.type].name) + (custom ? ' · <b>خاص</b>' : '') + (sent[q.id] ? ' · ✓ أُرسل' : '') + '</div>' +
        '<div class="qtext">' + esc(LR.deskText(q.text)) + '</div><div class="qdet">' + detail(q) + '</div></div>' +
        '<div class="qact">' +
        '<button type="button" class="btn btn-sm btn-gold" data-send="' + esc(q.id) + '"' + (live || !ok ? ' disabled' : '') + '>إرسال ▶</button>' +
        (custom ? '<button type="button" class="mini" data-edit="' + esc(q.id) + '" title="تعديل">✎</button><button type="button" class="mini" data-del="' + esc(q.id) + '" title="حذف">🗑</button>' : '') +
        '</div></div>';
    }).join('');
  }
  function findQ(id) { return allQuestions().filter(function (q) { return q.id === id; })[0]; }

  /* ================= النشر ================= */
  function publish(q) {
    if (!q || isLive() || !A.meta || A.meta.status !== 'open') return;
    var n = Object.keys(A.qlog).length + 1, qid = 'q' + n;
    while (A.qlog[qid]) { n++; qid = 'q' + n; }
    var pub = LR.buildPublish(q), dur = A.duration, up = {};
    up['secrets/' + A.code + '/' + qid] = { s: pub.secret, type: q.type };
    up['rooms/' + A.code + '/current'] = { qid: qid, n: n, payload: pub.payload, duration: dur, publishedAt: LR.SERVER_TS(), state: 'live' };
    up['rooms/' + A.code + '/qlog/' + qid] = { n: n, bankId: q.id, title: LR.qTitle(q), type: q.type, correctText: pub.correctText || '', duration: dur, publishedAt: LR.SERVER_TS() };
    LR.db.ref().update(up).then(function () { Sound.play('bell'); }).catch(function (e) { alert('تعذّر الإرسال: ' + (e.code || e.message)); });
  }

  // متابعة الإجابات الواردة أثناء السؤال
  function watchAnswers() {
    var c = A.current, want = c && c.state === 'live' ? c.qid : null;
    if (A.ansQid === want) return;
    if (A.ansRef) { A.ansRef.off(); A.ansRef = null; }
    A.ansQid = want; A.answersLive = {};
    if (!want) return;
    A.ansRef = LR.roomRef(A.code, 'answers/' + want);
    A.ansRef.on('value', function (s) { A.answersLive = s.val() || {}; paintLive(); });
  }

  // التصحيح التلقائي عند انتهاء الوقت (+ هامش 1.2 ث لوصول آخر الإجابات)
  setInterval(function () {
    var c = A.current;
    if (!A.code || !c || c.state !== 'live' || !c.publishedAt) return;
    var left = c.publishedAt + c.duration * 1000 - LR.serverNow();
    var el = $('liveTimer');
    if (el) { var sec = Math.max(0, Math.ceil(left / 1000)); if (el.textContent !== String(sec)) el.textContent = sec; el.classList.toggle('hot', left <= 5000); }
    if (left <= -1200) reveal(c.qid);
  }, 200);

  function reveal(qid) {
    if (A.revealing[qid]) return A.revealing[qid];
    var c = A.current;
    if (!c || c.qid !== qid) return Promise.resolve();
    var code = A.code;
    A.revealing[qid] = Promise.all([
      LR.roomRef(code, 'answers/' + qid).once('value'),
      LR.db.ref('secrets/' + code + '/' + qid).once('value'),
      LR.roomRef(code, 'scores').once('value'),
      LR.roomRef(code, 'members').once('value')
    ]).then(function (r) {
      var answers = r[0].val() || {}, sec = r[1].val() || {}, scores = r[2].val() || {}, members = r[3].val() || {};
      var durMs = c.duration * 1000, up = {}, gains = {}, nAns = 0, nOk = 0;
      var uids = Object.keys(members);
      Object.keys(answers).forEach(function (u) { if (uids.indexOf(u) < 0) uids.push(u); });
      var next = {};
      Object.keys(scores).forEach(function (u) { next[u] = scores[u]; });
      uids.forEach(function (u) {
        var a = answers[u], prev = scores[u] || {};
        var answered = !!a, ms = answered ? Math.max(0, a.ts - c.publishedAt) : null;
        var ok = answered && LR.grade(sec.type, a.v, sec.s);
        var pts = ok ? LR.points(ms, durMs) : 0;
        if (answered) nAns++; if (ok) nOk++;
        gains[u] = pts;
        var last = { qid: qid, ok: !!ok, pts: pts, answered: answered };
        if (ms != null) last.ms = ms;
        var s = {
          name: (members[u] && members[u].name) || prev.name || '؟',
          total: (prev.total || 0) + pts, time: (prev.time || 0) + (ok ? ms : 0),
          correct: (prev.correct || 0) + (ok ? 1 : 0), answered: (prev.answered || 0) + (answered ? 1 : 0), asked: (prev.asked || 0) + 1,
          last: last
        };
        next[u] = s;
        up['rooms/' + code + '/scores/' + u] = s;
      });
      var top = LR.standings(next).slice(0, 5).map(function (x) { return { uid: x.uid, name: x.name, total: x.total, gain: gains[x.uid] || 0 }; });
      up['rooms/' + code + '/reveal/' + qid] = { correctText: (A.qlog[qid] && A.qlog[qid].correctText) || '', top: top, answered: nAns, correct: nOk, participants: uids.length };
      up['rooms/' + code + '/qlog/' + qid + '/answered'] = nAns;
      up['rooms/' + code + '/qlog/' + qid + '/correct'] = nOk;
      up['rooms/' + code + '/qlog/' + qid + '/participants'] = uids.length;
      up['rooms/' + code + '/current/state'] = 'reveal';
      return LR.db.ref().update(up);
    }).then(function () {
      Sound.play('applause');
    }).catch(function (e) {
      delete A.revealing[qid];
      console.error('reveal failed', e);
    });
    return A.revealing[qid];
  }

  function backToLobby() { LR.roomRef(A.code, 'current').remove(); }

  /* ================= لوحة المباشر ================= */
  function paintLive() {
    var c = A.current, box = $('liveBox');
    if (!A.code) return;
    if (A.meta && A.meta.status === 'ended') return;
    if (!c) {
      var n = Object.keys(A.qlog).length;
      box.innerHTML = '<div class="live-idle"><div class="big-ico">🎯</div><p>' + (n ? 'المتدربون في القاعة يرون الترتيب الحي.<br>اختر السؤال التالي من البنك واضغط «إرسال».' : 'المتدربون في غرفة الانتظار.<br>اختر سؤالاً من البنك واضغط «إرسال».') + '</p></div>';
      return;
    }
    var log = A.qlog[c.qid] || {};
    var head = '<div class="live-head"><span class="ln">السؤال ' + c.n + '</span><span class="lt">' + esc(log.title || '') + '</span></div>';
    if (c.state === 'live') {
      var nAns = Object.keys(A.answersLive).length, nPres = presentUids().length || 1;
      box.innerHTML = head + '<div class="live-run"><div class="live-timer" id="liveTimer">' + c.duration + '</div>' +
        '<div class="live-prog"><div class="lp-bar"><i style="width:' + Math.min(100, Math.round(nAns / nPres * 100)) + '%"></i></div><b>' + nAns + ' / ' + presentUids().length + '</b> أجابوا</div>' +
        '<button type="button" class="btn btn-sm btn-ghost" id="revealNow">⏭ إظهار النتيجة الآن</button></div>';
      $('revealNow').addEventListener('click', function () { reveal(c.qid); });
      return;
    }
    // بعد السؤال: جدول كامل (الاسم، صح/خطأ، الزمن، النقاط، المجموع)
    var st = LR.standings(A.scores);
    box.innerHTML = head +
      '<div class="live-sum">✓ ' + (log.correct || 0) + ' صحيحة · ' + (log.answered || 0) + ' أجابوا من ' + (log.participants || st.length) + (log.correctText ? ' · الإجابة: <b>' + esc(log.correctText) + '</b>' : '') + '</div>' +
      '<div class="tbl-wrap small"><table class="tbl"><thead><tr><th>#</th><th>الاسم</th><th>الإجابة</th><th>الزمن</th><th>النقاط</th><th>المجموع</th></tr></thead><tbody>' +
      st.map(function (r, i) {
        var l = r.last && r.last.qid === c.qid ? r.last : null;
        var res = !l || !l.answered ? '<span class="na">—</span>' : l.ok ? '<span class="yes">✓</span>' : '<span class="no">✗</span>';
        return '<tr><td>' + (i + 1) + '</td><td>' + esc(r.name) + '</td><td>' + res + '</td><td>' + (l && l.ms != null ? LR.fmtSec(l.ms) + ' ث' : '—') + '</td><td>' + (l ? '+' + l.pts : '0') + '</td><td><b>' + r.total + '</b></td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<button type="button" class="btn btn-sm btn-gold btn-block" id="lobbyBtn">↩ العودة إلى القاعة (الترتيب الحي)</button>';
    $('lobbyBtn').addEventListener('click', backToLobby);
  }

  function paintStandings() {
    var st = LR.standings(A.scores);
    var asked = Object.keys(A.qlog).filter(function (k) { return A.qlog[k].answered != null; }).length;
    $('standTbl').innerHTML = '<thead><tr><th>#</th><th>الاسم</th><th>النقاط</th><th>صحيحة</th><th>النسبة</th></tr></thead><tbody>' +
      (st.length ? st.map(function (r, i) {
        var a = (A.scores[r.uid] && A.scores[r.uid].asked) || asked || 0;
        return '<tr class="' + (i < 3 ? 'top' + (i + 1) : '') + '"><td>' + (i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1) + '</td><td>' + esc(r.name) + '</td><td><b>' + r.total + '</b></td><td>' + r.correct + ' / ' + a + '</td><td>' + (a ? Math.round(r.correct / a * 100) : 0) + '%</td></tr>';
      }).join('') : '<tr><td colspan="5" class="muted">يظهر الترتيب بعد السؤال الأول.</td></tr>') + '</tbody>';
  }

  /* ================= إنهاء الجلسة ================= */
  function endSession(auto) {
    if (A.ending || !A.code) return;
    if (!auto && !confirm('إنهاء الجلسة؟ سيصبح الرمز غير صالح نهائياً وتظهر المنصة النهائية للمتدربين.')) return;
    A.ending = true;
    var code = A.code;
    var pre = isLive() ? reveal(A.current.qid) : Promise.resolve();
    pre.then(function () {
      return Promise.all([LR.roomRef(code, 'scores').once('value'), LR.roomRef(code, 'qlog').once('value'), LR.roomRef(code, 'members').once('value'), LR.roomRef(code, 'meta').once('value')]);
    }).then(function (r) {
      var scores = r[0].val() || {}, qlog = r[1].val() || {}, members = r[2].val() || {}, meta = r[3].val() || {};
      var st = LR.standings(scores);
      var podium = st.slice(0, 3).map(function (x) { return { uid: x.uid, name: x.name, total: x.total }; });
      var up = {};
      up['rooms/' + code + '/meta/status'] = 'ended';
      up['rooms/' + code + '/meta/endedAt'] = LR.SERVER_TS();
      up['rooms/' + code + '/final'] = { podium: podium, at: LR.SERVER_TS() };
      up['rooms/' + code + '/current'] = null;
      up['secrets/' + code] = null;
      A.lastReport = sessionRecord(code, meta, members, qlog, scores);
      return LR.db.ref().update(up);
    }).then(function () {
      LR.roomRef(code, 'host').onDisconnect().cancel();
      LR.roomRef(code, 'host').remove();
      // حفظ السجل النهائي في Firestore ثم حذف الإجابات الخام
      var rec = A.lastReport;
      return window.fbDb.collection('liveSessions').doc(code + '-' + rec.createdAt).set(rec).then(function () { A.saved = true; }, function (e) { A.saved = false; console.warn('Firestore save failed', e); });
    }).then(function () {
      LR.db.ref().update(pathNull(['rooms/' + code + '/answers', 'rooms/' + code + '/results'])).catch(function () {});
      try { localStorage.removeItem('lr_admin_room'); } catch (e) {}
      Sound.play('applause'); setTimeout(function () { Sound.play('cheer'); }, 500);
      showEnded();
    }).catch(function (e) {
      A.ending = false;
      alert('تعذّر إنهاء الجلسة: ' + (e.code || e.message));
    });
  }
  function pathNull(paths) { var o = {}; paths.forEach(function (p) { o[p] = null; }); return o; }

  function sessionRecord(code, meta, members, qlog, scores) {
    var qs = Object.keys(qlog).map(function (k) { return qlog[k]; }).sort(function (a, b) { return a.n - b.n; });
    var asked = qs.filter(function (q) { return q.answered != null; }).length;
    var st = LR.standings(scores);
    return {
      code: code, owner: A.user.uid,
      createdAt: meta.createdAt || Date.now(), endedAt: LR.serverNow(),
      participants: Object.keys(members).length,
      questions: qs.map(function (q) { return { n: q.n, title: q.title || '', type: q.type, correctText: q.correctText || '', answered: q.answered || 0, correct: q.correct || 0, participants: q.participants || 0 }; }),
      ranking: st.map(function (r, i) {
        var a = (scores[r.uid] && scores[r.uid].asked) || asked;
        return { rank: i + 1, name: r.name, total: r.total, correct: r.correct, asked: a, pct: a ? Math.round(r.correct / a * 100) : 0 };
      })
    };
  }

  function showEnded() {
    if (!A.code) return;
    $('liveBox').innerHTML = '<div class="live-idle"><div class="big-ico">🏆</div><h3>انتهت الجلسة</h3><p>الرمز <b dir="ltr">' + fmtCode(A.code) + '</b> لم يعد صالحاً. المتدربون يرون المنصة النهائية.</p>' +
      (A.saved === false ? '<p class="err">لم يُحفظ السجل في Firestore (تحقق من القواعد)، لكن يمكنك تحميل التقرير الآن.</p>' : '') +
      '<button type="button" class="btn btn-gold btn-block" id="endPdf">⬇ تحميل تقرير الجلسة PDF</button>' +
      '<button type="button" class="btn btn-ghost btn-block" id="newRoom">＋ غرفة جديدة</button></div>';
    $('endPdf').addEventListener('click', function () { downloadReport(this); });
    $('newRoom').addEventListener('click', function () { detach(); A.code = null; A.meta = null; A.current = null; A.scores = {}; A.qlog = {}; A.members = {}; A.presence = {}; showHome(); });
    $('lockBtn').disabled = true; $('endBtn').disabled = true;
    $('expText').textContent = 'انتهت الجلسة';
    paintBank();
  }

  /* ================= تقرير PDF ================= */
  function downloadReport(btn) {
    if (A.lastReport) { makeReport(A.lastReport, btn); return; }
    var code = A.code;
    Promise.all([LR.roomRef(code, 'meta').once('value'), LR.roomRef(code, 'members').once('value'), LR.roomRef(code, 'qlog').once('value'), LR.roomRef(code, 'scores').once('value')]).then(function (r) {
      makeReport(sessionRecord(code, r[0].val() || {}, r[1].val() || {}, r[2].val() || {}, r[3].val() || {}), btn);
    });
  }
  function makeReport(rec, btn) {
    if (!window.jspdf || !window.html2canvas) { alert('مكتبة PDF لم تُحمّل.'); return; }
    var old = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = '… جاري التحضير'; }
    var host = $('reportHost'), pages = [];
    var avg = rec.ranking.length ? Math.round(rec.ranking.reduce(function (s, r) { return s + r.pct; }, 0) / rec.ranking.length) : 0;
    var head = '<div class="rp-head"><img src="../../apple-touch-icon.png" alt=""><div><h1>تقرير جلسة التدريب المباشر</h1><p>أكاديمية مرابطي — د. سفيان مرابطي</p></div></div>' +
      '<div class="rp-kpis"><div><b>' + esc(fmtDate(rec.createdAt)) + '</b><span>التاريخ</span></div><div><b dir="ltr">' + esc(fmtCode(rec.code)) + '</b><span>رمز الغرفة</span></div>' +
      '<div><b>' + rec.participants + '</b><span>عدد المشاركين</span></div><div><b>' + rec.questions.length + '</b><span>الأسئلة المطروحة</span></div><div><b>' + avg + '%</b><span>متوسط الإجابات الصحيحة</span></div></div>';
    var TN = function (ty) { return window.LR_TYPES[ty] ? window.LR_TYPES[ty].name : ty; };
    var qRows = rec.questions.map(function (q) {
      return '<tr><td>' + q.n + '</td><td class="l">' + esc(q.title) + '</td><td>' + esc(TN(q.type)) + '</td><td class="l">' + esc(q.correctText) + '</td><td>' + q.correct + ' / ' + q.answered + '</td><td>' + (q.participants ? Math.round(q.correct / q.participants * 100) : 0) + '%</td></tr>';
    });
    var rRows = rec.ranking.map(function (r) {
      return '<tr' + (r.rank <= 3 ? ' class="t' + r.rank + '"' : '') + '><td>' + r.rank + '</td><td class="l">' + esc(r.name) + '</td><td><b>' + r.total + '</b></td><td>' + r.correct + ' / ' + r.asked + '</td><td>' + r.pct + '%</td></tr>';
    });
    var qHead = '<h2>الأسئلة المطروحة</h2><table><thead><tr><th>#</th><th>السؤال</th><th>النوع</th><th>الإجابة الصحيحة</th><th>صحيحة / أجابوا</th><th>نسبة النجاح</th></tr></thead><tbody>';
    var rHead = '<h2>الترتيب الكامل</h2><table><thead><tr><th>الترتيب</th><th>المتدرب</th><th>النقاط</th><th>صحيحة / المطروحة</th><th>نسبة الإجابات الصحيحة</th></tr></thead><tbody>';
    // تقسيم الصفوف على صفحات A4
    var cur = head, room = 16;
    function flush() { pages.push(cur); cur = ''; room = 24; }
    function table(hdr, rows) {
      var i = 0;
      do {
        if (room < 6) flush();
        var take = rows.slice(i, i + room - 3);
        cur += hdr + (take.length ? take.join('') : '<tr><td colspan="6">—</td></tr>') + '</tbody></table>';
        room -= take.length + 3; i += take.length;
      } while (i < rows.length);
    }
    table(qHead, qRows);
    if (room < 8) flush();
    table(rHead, rRows);
    pages.push(cur);

    var jsPDF = window.jspdf.jsPDF, pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    var idx = 0;
    (function next() {
      if (idx >= pages.length) {
        pdf.save('live-room-' + rec.code + '-' + new Date(rec.createdAt).toISOString().slice(0, 10) + '.pdf');
        host.innerHTML = '';
        if (btn) { btn.disabled = false; btn.textContent = old; }
        return;
      }
      host.innerHTML = '<div class="rp-page">' + pages[idx] + '<div class="rp-foot">merabti.com — صفحة ' + (idx + 1) + ' / ' + pages.length + '</div></div>';
      var pageEl = host.firstChild;
      html2canvas(pageEl, { scale: 2, backgroundColor: '#ffffff', useCORS: true }).then(function (cv) {
        if (idx > 0) pdf.addPage();
        pdf.addImage(cv.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 210, 297);
        idx++; next();
      }).catch(function (e) {
        host.innerHTML = '';
        if (btn) { btn.disabled = false; btn.textContent = old; }
        alert('تعذّر إنشاء PDF: ' + e.message);
      });
    })();
  }

  /* ================= الأسئلة الخاصة (Firestore) ================= */
  function loadCustom() {
    window.fbDb.collection('liveQuestions').get().then(function (qs) {
      A.custom = [];
      qs.forEach(function (d) { var x = d.data(); x.id = 'c-' + d.id; x._doc = d.id; A.custom.push(x); });
      A.custom.sort(function (a, b) { return (a.updatedAt || 0) - (b.updatedAt || 0); });
      paintBank();
    }).catch(function () {});
  }
  var ED = { doc: null };
  function openEditor(q) {
    ED.doc = q ? q._doc : null;
    $('edTitle').textContent = q ? 'تعديل سؤال خاص' : 'سؤال خاص جديد';
    $('edStage').innerHTML = window.LR_STAGES.map(function (s) { return '<option value="' + s.id + '">' + s.id + ' — ' + esc(s.name) + '</option>'; }).join('');
    $('edType').innerHTML = Object.keys(window.LR_TYPES).map(function (k) { return '<option value="' + k + '">' + esc(window.LR_TYPES[k].name) + '</option>'; }).join('');
    $('edStage').value = q ? q.stage : A.stage;
    $('edType').value = q ? q.type : (A.type !== 'all' ? A.type : 'mcq');
    $('edText').value = q ? q.text : '';
    $('edErr').textContent = '';
    edFields(q);
    $('editor').classList.remove('hidden');
  }
  function partOptions(sel) { return '<option value="">— بدون —</option>' + P.ids.map(function (id) { return '<option value="' + id + '"' + (id === sel ? ' selected' : '') + '>' + esc(P.names[id]) + '</option>'; }).join(''); }
  function edFields(q) {
    var ty = $('edType').value, f = $('edFields'), h = '';
    q = q && q.type === ty ? q : null;
    if (ty === 'mcq') {
      h = '<label class="ed-full">صورة (اختياري) <select id="edImg">' + partOptions(q && q.img) + '</select></label><div class="ed-opts">' +
        [0, 1, 2, 3].map(function (i) { return '<label class="ed-opt"><input type="radio" name="edAns" value="' + i + '"' + ((q ? Number(q.answer) : 0) === i ? ' checked' : '') + '><input type="text" class="edO" maxlength="60" placeholder="اختيار ' + (i + 1) + '" value="' + esc(q ? q.options[i] || '' : '') + '"></label>'; }).join('') +
        '</div><p class="ed-note">حدّد الدائرة بجانب الإجابة الصحيحة.</p>';
      if (!$('edText').value) $('edText').value = 'ما اسم هذه القطعة؟';
    } else if (ty === 'tf') {
      h = '<div class="ed-row"><label><input type="radio" name="edAns" value="1"' + (!q || q.answer ? ' checked' : '') + '> صح</label><label><input type="radio" name="edAns" value="0"' + (q && !q.answer ? ' checked' : '') + '> خطأ</label></div>';
    } else if (ty === 'click' || ty === 'dblclick') {
      h = '<label class="ed-full">العدد <input type="number" id="edCount" min="1" max="' + (ty === 'click' ? 20 : 6) + '" value="' + (q ? q.count : (ty === 'click' ? 6 : 3)) + '"></label>';
      if (!$('edText').value) $('edText').value = ty === 'click' ? '{CLICK} على كل الأهداف بأسرع ما يمكن' : 'افتح الصناديق: {DBL} سريعتين على كل صندوق';
    } else if (ty === 'drag') {
      h = '<p class="ed-note">اختر من 2 إلى 5 قطع:</p><div class="ed-parts">' + P.ids.map(function (id) {
        return '<label class="ed-part"><input type="checkbox" value="' + id + '"' + (q && q.items.indexOf(id) >= 0 ? ' checked' : '') + '>' + P.svg(id) + '<span>' + esc(P.names[id]) + '</span></label>';
      }).join('') + '</div>';
      if (!$('edText').value) $('edText').value = 'اسحب كل صورة إلى اسمها';
    } else if (ty === 'rightclick') {
      h = '<label class="ed-full">العنصر <select id="edTarget">' + ['file', 'folder', 'image', 'trash'].map(function (k) { return '<option value="' + k + '"' + (q && q.target === k ? ' selected' : '') + '>' + { file: 'ملف', folder: 'مجلد', image: 'صورة', trash: 'سلة المحذوفات' }[k] + '</option>'; }).join('') + '</select></label>' +
        '<label class="ed-full">أوامر القائمة (سطر لكل أمر) <textarea id="edMenu" rows="5">' + esc(q ? q.options.join('\n') : 'فتح\nنسخ\nقص\nإعادة تسمية\nحذف\nخصائص') + '</textarea></label>' +
        '<label class="ed-full">رقم الأمر الصحيح (1 = الأول) <input type="number" id="edMenuAns" min="1" max="12" value="' + (q ? Number(q.answer) + 1 : 2) + '"></label>';
      if (!$('edText').value) $('edText').value = '{RC} على الملف ثم اختر «نسخ»';
    } else if (ty === 'typing') {
      h = '<label class="ed-full">العبارة المطلوب كتابتها <input type="text" id="edPhrase" maxlength="60" value="' + esc(q ? q.phrase : '') + '"></label>';
      if (!$('edText').value) $('edText').value = 'اكتب بسرعة وبدون أخطاء:';
    }
    f.innerHTML = h;
  }
  function saveEditor() {
    var ty = $('edType').value, q = { stage: Number($('edStage').value), type: ty, text: $('edText').value.trim(), owner: A.user.uid, updatedAt: Date.now() };
    var err = function (m) { $('edErr').textContent = m; };
    if (!q.text) return err('اكتب نص السؤال.');
    if (ty === 'mcq') {
      q.options = Array.prototype.map.call(document.querySelectorAll('.edO'), function (i) { return i.value.trim(); });
      if (q.options.some(function (o) { return !o; })) return err('املأ الاختيارات الأربعة.');
      q.answer = Number((document.querySelector('input[name="edAns"]:checked') || {}).value || 0);
      q.img = $('edImg').value || null;
    } else if (ty === 'tf') {
      q.answer = ((document.querySelector('input[name="edAns"]:checked') || {}).value || '1') === '1';
    } else if (ty === 'click' || ty === 'dblclick') {
      q.count = Math.max(1, Math.min(ty === 'click' ? 20 : 6, parseInt($('edCount').value, 10) || 1));
    } else if (ty === 'drag') {
      q.items = Array.prototype.map.call(document.querySelectorAll('.ed-part input:checked'), function (i) { return i.value; });
      if (q.items.length < 2 || q.items.length > 5) return err('اختر من 2 إلى 5 قطع.');
    } else if (ty === 'rightclick') {
      q.target = $('edTarget').value;
      q.options = $('edMenu').value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
      q.answer = (parseInt($('edMenuAns').value, 10) || 1) - 1;
      if (q.options.length < 2) return err('أضف أمرين على الأقل.');
      if (q.answer < 0 || q.answer >= q.options.length) return err('رقم الأمر الصحيح خارج القائمة.');
    } else if (ty === 'typing') {
      q.phrase = $('edPhrase').value.replace(/\s+/g, ' ').trim();
      if (!q.phrase) return err('اكتب العبارة.');
    }
    Object.keys(q).forEach(function (k) { if (q[k] == null) delete q[k]; });
    var col = window.fbDb.collection('liveQuestions');
    var p = ED.doc ? col.doc(ED.doc).set(q) : col.add(q);
    $('edSave').disabled = true;
    p.then(function () { $('editor').classList.add('hidden'); A.stage = q.stage; paintTabs(); loadCustom(); })
      .catch(function (e) { err('تعذّر الحفظ: ' + (e.code || e.message) + ' (تحقق من قواعد Firestore لـ liveQuestions)'); })
      .then(function () { $('edSave').disabled = false; });
  }

  /* ================= ربط الواجهة ================= */
  function bindUi() {
    $('createBtn').addEventListener('click', createRoom);
    $('copyBtn').addEventListener('click', function () { copy($('linkIn').value); var b = this; b.textContent = 'تم النسخ ✓'; setTimeout(function () { b.textContent = 'نسخ الرابط'; }, 1600); });
    $('bigCodeBtn').addEventListener('click', function () { $('bigCode').classList.remove('hidden'); });
    $('bcClose').addEventListener('click', function () { $('bigCode').classList.add('hidden'); });
    $('lockBtn').addEventListener('click', function () { if (A.meta) LR.roomRef(A.code, 'meta/locked').set(!A.meta.locked); });
    $('endBtn').addEventListener('click', function () { endSession(false); });
    $('pdfBtn').addEventListener('click', function () { downloadReport(this); });
    $('answersToggle').addEventListener('click', function () { A.showAnswers = !A.showAnswers; this.classList.toggle('on', A.showAnswers); paintBank(); });
    $('durIn').value = A.duration;
    $('durIn').addEventListener('change', function () { setDur(parseInt(this.value, 10)); });
    document.querySelectorAll('.dur-b').forEach(function (b) { b.addEventListener('click', function () { setDur(A.duration + Number(b.getAttribute('data-d'))); }); });
    $('stageTabs').addEventListener('click', function (e) { var b = e.target.closest('.stab'); if (!b) return; A.stage = Number(b.getAttribute('data-s')); paintTabs(); paintBank(); });
    $('typeChips').addEventListener('click', function (e) { var b = e.target.closest('.chip'); if (!b) return; A.type = b.getAttribute('data-ty'); paintTabs(); paintBank(); });
    $('bankList').addEventListener('click', function (e) {
      var s = e.target.closest('[data-send]'), ed = e.target.closest('[data-edit]'), del = e.target.closest('[data-del]');
      if (s) publish(findQ(s.getAttribute('data-send')));
      else if (ed) openEditor(findQ(ed.getAttribute('data-edit')));
      else if (del) {
        var q = findQ(del.getAttribute('data-del'));
        if (q && confirm('حذف هذا السؤال الخاص؟')) window.fbDb.collection('liveQuestions').doc(q._doc).delete().then(loadCustom);
      }
    });
    $('addQBtn').addEventListener('click', function () { openEditor(null); });
    $('edType').addEventListener('change', function () { $('edText').value = ''; edFields(null); });
    $('edCancel').addEventListener('click', function () { $('editor').classList.add('hidden'); });
    $('edSave').addEventListener('click', saveEditor);
  }
  function setDur(v) {
    A.duration = Math.min(180, Math.max(5, v || 20));
    $('durIn').value = A.duration;
    try { localStorage.setItem('lr_dur', A.duration); } catch (e) {}
  }

  boot();
})();
