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
    user: null, code: null, meta: null, members: {}, presence: {}, scores: {}, mine: {}, current: null, qlog: {}, answersLive: {},
    custom: [], stage: 1, type: 'all', search: '', showAnswers: false, revealing: {}, refs: [], ansRef: null, ending: false,
    hall: null, secret: null, secretQid: null, share: false, loadedAt: 0
  };
  try { A.share = localStorage.getItem('lr_share') === '1'; } catch (e) {}
  try { var v0 = parseInt(localStorage.getItem('lr_vol'), 10); A.volume = isNaN(v0) ? 100 : Math.min(100, Math.max(0, v0)); } catch (e) { A.volume = 100; }
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
    A.hall = LR_HALL.create($('hallWrap'), { admin: true });
    bindUi();
    setShare(A.share);
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
        if (m && m.owner === A.user.uid && (m.status === 'open' || m.sim) && LR.serverNow() < m.expiresAt) openRoom(saved);
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

  function createRoom(opts) {
    opts = opts || {};
    var btn = $('createBtn');
    btn.disabled = true; $('createErr').textContent = '';
    var tries = 0;
    return new Promise(function (resolve, reject) {
    (function attempt() {
      tries++;
      var code = String(100000 + Math.floor(Math.random() * 900000));
      var ref = LR.roomRef(code, 'meta');
      ref.once('value').then(function (s) {
        if (s.exists()) throw { retry: true };
        var meta = { owner: A.user.uid, createdAt: LR.SERVER_TS(), expiresAt: LR.serverNow() + H3 - 5000, status: 'open', locked: !!opts.sim };
        if (opts.sim) meta.sim = true; // غرفة المحاكاة: مقفلة ومميّزة ولا تُحفظ في التقارير
        return ref.set(meta);
      }).then(function () {
        btn.disabled = false;
        openRoom(code);
        resolve(code);
      }).catch(function (e) {
        if (tries < 8) { attempt(); return; }
        btn.disabled = false;
        $('createErr').textContent = 'تعذّر إنشاء الغرفة' + (e && e.code ? ' (' + e.code + ')' : '') + '.';
        reject(e);
      });
    })();
    });
  }

  /* ================= الغرفة ================= */
  function openRoom(code) {
    detach();
    A.code = code; A.revealing = {}; A.ending = false; A.saved = undefined; A.lastReport = null;
    A.meta = null; A.current = null; A.scores = {}; A.mine = {}; A.qlog = {}; A.members = {}; A.presence = {}; A.secret = null; A.secretQid = null;
    A.loadedAt = LR.serverNow();
    A.hall.reset();
    A.hall.setCode(code);
    $('lockBtn').disabled = false; $('endBtn').disabled = false;
    try { localStorage.setItem('lr_admin_room', code); } catch (e) {}
    $('home').classList.add('hidden'); $('room').classList.remove('hidden');
    var url = roomUrl(code);
    $('codeBig').textContent = fmtCode(code);
    $('linkIn').value = url;
    $('bcCode').textContent = fmtCode(code);
    $('bcUrl').textContent = url.replace(/^https?:\/\//, '');
    drawQr($('qr'), url, 5); drawQr($('bcQr'), url, 8);

    var hostRef = LR.roomRef(code, 'host/on');
    listen(LR.db.ref('.info/connected'), function (s) { if (s.val() === true) hostRef.onDisconnect().remove().then(function () { hostRef.set(true); }); });
    // مستوى صوت القاعة: يبقى بعد انقطاع المدرّب، ويقرؤه المتدربون لحظياً
    listen(LR.roomRef(code, 'host/volume'), function (s) {
      var v = s.val();
      if (typeof v !== 'number') { if (A.code === code) LR.roomRef(code, 'host/volume').set(A.volume); return; }
      A.volume = v; paintVolume(); Sound.setLevel(v);
    });
    listen(LR.roomRef(code, 'meta'), function (s) { A.meta = s.val(); paintRoom(); paintSim(); paintHall(); });
    listen(LR.roomRef(code, 'members'), function (s) { A.members = s.val() || {}; paintAttendees(); paintStandings(); paintLive(); paintHall(); });
    listen(LR.roomRef(code, 'presence'), function (s) { A.presence = s.val() || {}; paintAttendees(); paintLive(); paintHall(); });
    listen(LR.roomRef(code, 'scores'), function (s) { A.scores = s.val() || {}; paintStandings(); paintLive(); paintHall(); });
    listen(LR.roomRef(code, 'mine'), function (s) { A.mine = s.val() || {}; paintStandings(); paintLive(); });
    listen(LR.roomRef(code, 'qlog'), function (s) { A.qlog = s.val() || {}; paintBank(); paintHall(); });
    listen(LR.roomRef(code, 'current'), function (s) { A.current = s.val(); loadSecret(); watchAnswers(); paintLive(); paintBank(); paintHall(); Sim.onCurrent(); });
    // التفاعلات 👏 🔥 😮 تطير فوق مقعد صاحبها
    var rref = LR.roomRef(code, 'reactions');
    var onReact = function (s) {
      var r = s.val();
      if (!r || !LR.REACTIONS[r.e] || r.ts < A.loadedAt - 4000 || LR.serverNow() - r.ts > 6000) return;
      A.hall.fly(s.key, LR.REACTIONS[r.e]);
    };
    rref.on('child_added', onReact, function () {});
    rref.on('child_changed', onReact, function () {});
    A.refs.push(rref);
    paintBank();
    paintSim();
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
    $('lockBtn').textContent = m.locked ? '🔒 مقفلة — فتح' : '🔓 قفل الغرفة';
    $('lockBtn').classList.toggle('on', !!m.locked);
    $('lockState').textContent = m.status === 'ended' ? 'منتهية' : m.locked ? 'مقفلة' : 'مفتوحة';
    $('lockState').className = 'status' + (m.status === 'ended' ? ' ended' : m.locked ? ' locked' : '');
    A.hall.setSim(!!m.sim);
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
      var nm = A.members[u].name, ph = A.members[u].photo;
      var av = ph ? '<span class="av ph"><img src="' + esc(ph) + '" alt="" referrerpolicy="no-referrer"><i></i></span>' : '<span class="av" style="--h:' + LR.hue(nm) + '">' + esc(LR.initials(nm)) + '<i></i></span>';
      return '<div class="att' + (pres[u] ? '' : ' off') + '">' + av + '<span class="nm">' + esc(nm) + '</span></div>';
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
    var needle = LR.norm(A.search).toLowerCase();
    var list = allQuestions().filter(function (q) {
      return Number(q.stage) === A.stage && (A.type === 'all' || q.type === A.type) &&
        (!needle || LR.norm(LR.deskText(q.text) + ' ' + LR.qTitle(q) + ' ' + (q.options || []).join(' ')).toLowerCase().indexOf(needle) >= 0);
    });
    $('stopQBtn').disabled = !isLive();
    var sent = sentMap(), live = isLive(), ok = A.meta && A.meta.status === 'open';
    $('bankCount').textContent = list.length + ' سؤال';
    if (!list.length) {
      $('bankList').innerHTML = '<div class="empty">' + (needle ? 'لا توجد أسئلة تطابق البحث.' : stage && stage.soon ? '⏳ بنك مرحلة «' + esc(stage.name) + '» قريباً.<br>يمكنك إضافة أسئلتك الخاصة لها الآن.' : 'لا توجد أسئلة بهذا النوع.') + '</div>';
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
    var c = A.current, want = c && c.qid ? c.qid : null;
    if (A.ansQid === want) return;
    if (A.ansRef) { A.ansRef.off(); A.ansRef = null; }
    A.ansQid = want; A.answersLive = {};
    paintVerdicts();
    if (!want) return;
    A.ansRef = LR.roomRef(A.code, 'answers/' + want);
    A.ansRef.on('value', function (s) { A.answersLive = s.val() || {}; paintLive(); paintVerdicts(); paintStandings(); });
  }
  // مفتاح السؤال الحالي (المدرّب وحده يقرؤه) لتلوين المقاعد لحظياً
  function loadSecret() {
    var c = A.current, qid = c && c.qid;
    if (!qid) { A.secret = null; A.secretQid = null; return; }
    if (A.secretQid === qid) return;
    A.secretQid = qid; A.secret = null;
    LR.db.ref('secrets/' + A.code + '/' + qid).once('value').then(function (s) {
      if (A.secretQid !== qid) return;
      A.secret = s.val();
      paintVerdicts(); paintBoard(); paintStandings();
    }).catch(function () {});
  }
  function verdict(uid) {
    var a = A.answersLive[uid];
    if (!a) return null;
    if (!A.secret) return true;
    return LR.grade(A.secret.type, a.v, A.secret.s) ? 'ok' : 'bad';
  }
  function paintVerdicts() {
    var map = {};
    Object.keys(A.answersLive).forEach(function (u) { map[u] = verdict(u); });
    A.hall.setAnswered(map);
  }

  // التصحيح التلقائي عند انتهاء الوقت (+ هامش 1.2 ث لوصول آخر الإجابات)
  setInterval(function () {
    var c = A.current;
    if (!A.code || !c || c.state !== 'live' || !c.publishedAt) return;
    var left = c.publishedAt + c.duration * 1000 - LR.serverNow();
    var el = $('liveTimer'), sec = Math.max(0, Math.ceil(left / 1000));
    if (el) { if (el.textContent !== String(sec)) el.textContent = sec; el.classList.toggle('hot', left <= 5000); }
    A.hall.setTimer(left > 0 ? sec : '', left > 0 && left <= 5000);
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
        // صح/خطأ يبقى خاصاً: mine/{uid} يقرؤه صاحبه فقط، و scores للمجموع والزمن
        var pub = {}; Object.keys(s).forEach(function (k) { if (k !== 'last') pub[k] = s[k]; });
        up['rooms/' + code + '/scores/' + u] = pub;
        up['rooms/' + code + '/mine/' + u] = last;
      });
      var top = LR.standings(next).slice(0, 5).map(function (x) { return { uid: x.uid, name: x.name, total: x.total, gain: gains[x.uid] || 0 }; });
      up['rooms/' + code + '/reveal/' + qid] = { correctText: (A.qlog[qid] && A.qlog[qid].correctText) || '', top: top, answered: nAns, correct: nOk, participants: uids.length };
      up['rooms/' + code + '/qlog/' + qid + '/answered'] = nAns;
      up['rooms/' + code + '/qlog/' + qid + '/correct'] = nOk;
      up['rooms/' + code + '/qlog/' + qid + '/participants'] = uids.length;
      up['rooms/' + code + '/current/state'] = 'reveal';
      return LR.db.ref().update(up);
    }).then(function () {
      A.hall.setTimer('');
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
        var l = lastOf(r.uid, c.qid);
        var res = !l || !l.answered ? '<span class="na">—</span>' : l.ok ? '<span class="yes">✓</span>' : '<span class="no">✗</span>';
        return '<tr><td>' + (i + 1) + '</td><td>' + esc(r.name) + '</td><td>' + res + '</td><td>' + (l && l.ms != null ? LR.fmtSec(l.ms) + ' ث' : '—') + '</td><td>' + (l ? '+' + l.pts : '0') + '</td><td><b>' + r.total + '</b></td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<button type="button" class="btn btn-sm btn-gold btn-block" id="lobbyBtn">↩ العودة إلى القاعة (الترتيب الحي)</button>';
    $('lobbyBtn').addEventListener('click', backToLobby);
  }

  function lastOf(uid, qid) {
    var l = A.mine[uid] || (A.scores[uid] && A.scores[uid].last);
    return l && (!qid || l.qid === qid) ? l : null;
  }
  // الترتيب الكامل لحظياً: آخر سؤال يُلوَّن فور وصول الإجابة أثناء السؤال
  function paintStandings() {
    var st = LR.standings(A.scores);
    var asked = Object.keys(A.qlog).filter(function (k) { return A.qlog[k].answered != null; }).length;
    var c = A.current, live = isLive();
    // من دخل ولم يُحتسب بعد يظهر في آخر الجدول
    var seen = {};
    st.forEach(function (r) { seen[r.uid] = true; });
    Object.keys(A.members).forEach(function (u) { if (!seen[u]) st.push({ uid: u, name: A.members[u].name, total: 0, correct: 0, time: 0 }); });
    $('standTbl').innerHTML = '<thead><tr><th>#</th><th>الاسم</th><th>آخر سؤال</th><th>الزمن</th><th>المجموع</th><th>صحيحة</th></tr></thead><tbody>' +
      (st.length ? st.map(function (r, i) {
        var a = (A.scores[r.uid] && A.scores[r.uid].asked) || asked || 0, res = '—', tm = '—';
        if (live && A.answersLive[r.uid]) {
          var v = verdict(r.uid), ms = Math.max(0, A.answersLive[r.uid].ts - c.publishedAt);
          res = v === 'ok' ? '<span class="yes">✓</span>' : v === 'bad' ? '<span class="no">✗</span>' : '<span class="na">…</span>';
          tm = LR.fmtSec(ms) + ' ث';
        } else {
          var l = lastOf(r.uid);
          if (l) { res = !l.answered ? '<span class="na">—</span>' : l.ok ? '<span class="yes">✓</span>' : '<span class="no">✗</span>'; tm = l.ms != null ? LR.fmtSec(l.ms) + ' ث' : '—'; }
        }
        return '<tr class="' + (i < 3 && r.total ? 'top' + (i + 1) : '') + (A.presence[r.uid] ? '' : ' off') + '"><td>' + (!r.total && !A.scores[r.uid] ? '' : i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1) + '</td><td>' + esc(r.name) + '</td><td>' + res + '</td><td>' + tm + '</td><td><b>' + r.total + '</b></td><td>' + r.correct + ' / ' + a + '</td></tr>';
      }).join('') : '<tr><td colspan="6" class="muted">لم يدخل أحد بعد.</td></tr>') + '</tbody>';
  }

  /* ================= القاعة ================= */
  function paintHall() {
    if (!A.code || !A.hall) return;
    var present = presentUids();
    var people = present.map(function (u) { var m = A.members[u]; return { uid: u, name: m.name, photo: m.photo, joinedAt: m.joinedAt }; });
    var st = LR.standings(A.scores), started = st.length > 0;
    var ended = A.meta && A.meta.status === 'ended', c = A.current;
    var ph = ended ? 'reveal' : !c || !c.qid ? 'wait' : c.state === 'live' ? 'live' : 'reveal';
    A.hall.update({
      phase: ph, people: people,
      ranking: started ? st.map(function (r) { return r.uid; }) : null,
      top5: started ? st.slice(0, 5) : null
    });
    Sound.hum(present.length, ph === 'live');
    paintBoard();
  }
  // جدار السؤال: المدرّب يرى الإجابة الصحيحة بالأخضر (إلا في وضع المشاركة قبل التصحيح)
  function paintBoard() {
    if (!A.hall) return;
    var c = A.current, m = A.meta, b;
    if (m && m.status === 'ended') {
      var w = LR.standings(A.scores)[0];
      b = { q: w ? '👑 ' + LR.t('winner') + ' ' + w.name : LR.t('session_over'), sub: 'انتهت الجلسة' };
    } else if (!c || !c.qid) {
      b = { q: A.share ? LR.t('waiting') : 'اختر سؤالاً من البنك وأرسله', sub: LR.t('hall_wait_sub') };
    } else {
      var p = c.payload || {}, log = A.qlog[c.qid] || {}, sec = A.secret && A.secretQid === c.qid ? A.secret : null;
      var revealed = c.state === 'reveal', mark = revealed || !A.share, ty = window.LR_TYPES[p.type], okIdx = null;
      b = { q: LR.deskText(p.text), sub: ty ? ty.icon + ' ' + ty.name : '' };
      if (p.svg) b.img = p.svg;
      if (sec && p.type === 'mcq') okIdx = Number(sec.s);
      if (sec && p.type === 'tf') okIdx = sec.s === 'true' ? 0 : 1;
      if (p.type === 'mcq') b.opts = p.options.map(function (o, i) { return { label: o, cls: mark && i === okIdx ? 'ok' : '' }; });
      else if (p.type === 'tf') b.opts = [{ label: '✓ ' + LR.t('tf_true'), cls: mark && okIdx === 0 ? 'ok' : '' }, { label: '✗ ' + LR.t('tf_false'), cls: mark && okIdx === 1 ? 'ok' : '' }];
      else {
        b.sub += ' — يُنجزه المتدربون على أجهزتهم';
        if (mark && log.correctText) b.opts = [{ label: '✓ ' + log.correctText, cls: 'ok' }];
      }
      if (revealed) {
        if (log.correctText) b.q = LR.t('correct_was') + ' ' + log.correctText;
        b.sub = 'أجاب صح ' + (log.correct || 0) + ' من ' + (log.participants || presentUids().length);
      }
    }
    var key = JSON.stringify(b);
    if (key === A.boardKey) return;
    A.boardKey = key;
    A.hall.setBoard(b);
  }

  /* ================= وضع المشاركة ================= */
  // يخفي الشريط وألوان الصح والخطأ لمشاركة القاعة على زووم
  function setShare(on) {
    A.share = !!on;
    document.body.classList.toggle('share', A.share);
    if (A.hall) A.hall.setVerdicts(!A.share);
    try { localStorage.setItem('lr_share', A.share ? '1' : '0'); } catch (e) {}
    A.boardKey = null;
    paintBoard();
  }

  /* ================= المحاكاة ================= */
  // متدربون وهميون في غرفة تجريبية منفصلة ومقفلة (meta/sim)، يكتبهم متصفح المدرّب.
  // لا تُحفظ في Firestore، و«إنهاء المحاكاة» يحذف الغرفة بالكامل.
  var Sim = (function () {
    var FIRST = ['أحمد', 'سارة', 'يوسف', 'مريم', 'خالد', 'أمينة', 'رياض', 'نور', 'سمير', 'ليلى', 'كريم', 'هاجر', 'عمر', 'إيمان', 'بلال', 'خديجة', 'وليد', 'سلمى', 'نبيل', 'رانيا', 'إسحاق', 'ياسمين', 'حمزة', 'فاطمة', 'زكرياء', 'دنيا', 'أيوب', 'شيماء', 'عادل', 'حنان'];
    var LAST = ['بن علي', 'بوزيد', 'حداد', 'قاسمي', 'سعدي', 'عيساوي', 'بلقاسم', 'زروقي', 'منصوري', 'شريف'];
    var X = { timers: [], joins: [], reactT: null, qid: null, pending: 0, idx: 0 };
    function isSim() { return !!(A.meta && A.meta.sim); }
    function bots() { return Object.keys(A.members).filter(function (u) { return u.indexOf('sim-') === 0; }); }
    function botsPresent() { return presentUids().filter(function (u) { return u.indexOf('sim-') === 0; }); }
    function pad(n) { return ('00' + n).slice(-3); }

    function start(n) {
      if (isSim() && A.meta.status === 'open') { add(n); return; }
      if (isLive()) { alert('أنهِ السؤال الحالي أولاً، ثم ابدأ المحاكاة.'); return; }
      if (A.code && A.meta && A.meta.status === 'open' && !A.meta.sim) {
        if (!confirm('ستنتقل إلى غرفة تجريبية منفصلة. غرفتك الحالية تبقى مفتوحة وتعود إليها عند «إنهاء المحاكاة». متابعة؟')) return;
        try { localStorage.setItem('lr_admin_real', A.code); } catch (e) {}
      } else { try { localStorage.removeItem('lr_admin_real'); } catch (e) {} }
      createRoom({ sim: true }).then(function () {
        $('simSec').open = true;
        setTimeout(function () { add(n); }, 400);
      }).catch(function () { alert('تعذّر إنشاء غرفة المحاكاة.'); });
    }
    // دخول تدريجي حتى 100 متدرب
    function add(n) {
      var code = A.code, idx = Math.max(X.idx || 0, bots().length), added = 0;
      var toAdd = Math.max(0, Math.min(LR_HALL.capacity - presentUids().length - X.pending, n));
      (function step() {
        if (A.code !== code || !isSim() || added >= toAdd) return;
        idx++; added++; X.idx = idx;
        var uid = 'sim-' + pad(idx), name = FIRST[(idx - 1) % FIRST.length] + ' ' + LAST[Math.floor((idx - 1) / FIRST.length) % LAST.length];
        var pres = LR.roomRef(code, 'presence/' + uid);
        X.pending++;
        LR.roomRef(code, 'members/' + uid).set({ name: name, joinedAt: LR.SERVER_TS() }).then(function () {
          pres.onDisconnect().remove(); // إغلاق صفحة المدرّب يُخرج الوهميين
          return pres.set(true);
        }).catch(function () {}).then(function () { X.pending--; });
        X.joins.push(setTimeout(step, 80 + Math.random() * 90));
      })();
      startReactions();
    }
    function wrong(sec, p) {
      switch (sec.type) {
        case 'mcq': case 'rightclick': {
          var n = (p.options || []).length || 4, k = Number(sec.s);
          return String((k + 1 + Math.floor(Math.random() * (n - 1))) % n);
        }
        case 'tf': return sec.s === 'true' ? 'false' : 'true';
        case 'click': case 'dblclick': return String(Math.max(0, Number(sec.s) - 1 - Math.floor(Math.random() * 2)));
        case 'drag': { try { var a = JSON.parse(sec.s); if (a.length > 1) { var t = a[0]; a[0] = a[1]; a[1] = t; } return JSON.stringify(a); } catch (e) { return '[]'; } }
        case 'typing': return String(sec.s).slice(0, -1) + 'خ';
      }
      return 'x';
    }
    // عند كل سؤال جديد: كل وهمي يجيب عشوائياً (≈90% يجيبون، ≈70% صواب)
    function onCurrent() {
      if (!isSim()) return;
      var c = A.current;
      if (!c || c.state !== 'live' || X.qid === c.qid) return;
      X.qid = c.qid;
      clearAnswers();
      var code = A.code, qid = c.qid, durMs = c.duration * 1000;
      LR.db.ref('secrets/' + code + '/' + qid).once('value').then(function (s) {
        var sec = s.val();
        if (!sec) return;
        botsPresent().forEach(function (u) {
          if (Math.random() > 0.9) return;
          var at = 800 + Math.random() * Math.max(500, durMs - 2200);
          X.timers.push(setTimeout(function () {
            if (A.code !== code || !A.current || A.current.qid !== qid || A.current.state !== 'live' || !A.presence[u]) return;
            var up = {};
            up['answers/' + qid + '/' + u] = { v: Math.random() < 0.7 ? String(sec.s) : wrong(sec, c.payload || {}), ts: LR.SERVER_TS() };
            up['answered/' + qid + '/' + u] = true;
            LR.roomRef(code).update(up).catch(function () {});
          }, at));
        });
      });
    }
    function startReactions() {
      if (X.reactT) return;
      var keys = Object.keys(LR.REACTIONS);
      X.reactT = setInterval(function () {
        if (!isSim() || A.meta.status !== 'open' || isLive()) return;
        var b = botsPresent();
        if (b.length < 3) return;
        var u = b[Math.floor(Math.random() * b.length)];
        LR.roomRef(A.code, 'reactions/' + u).set({ e: keys[Math.floor(Math.random() * keys.length)], ts: LR.SERVER_TS() }).catch(function () {});
      }, 1800);
    }
    function clearAnswers() { X.timers.forEach(clearTimeout); X.timers = []; }
    function stop() { X.joins.forEach(clearTimeout); X.joins = []; clearAnswers(); clearInterval(X.reactT); X.reactT = null; X.qid = null; X.idx = 0; }
    // «إنهاء المحاكاة»: حذف غرفة المحاكاة بالكامل ثم العودة إلى الغرفة الحقيقية إن كانت مفتوحة
    function end() {
      if (!isSim() || !A.code) return;
      if (!confirm('إنهاء المحاكاة وحذف الغرفة التجريبية وكل بياناتها؟')) return;
      var code = A.code;
      stop();
      bots().forEach(function (u) { LR.roomRef(code, 'presence/' + u).onDisconnect().cancel(); });
      LR.roomRef(code, 'host/on').onDisconnect().cancel();
      detach();
      var up = {};
      up['rooms/' + code] = null;
      up['secrets/' + code] = null;
      LR.db.ref().update(up).then(function () {
        var real = null;
        try { real = localStorage.getItem('lr_admin_real'); localStorage.removeItem('lr_admin_real'); localStorage.removeItem('lr_admin_room'); } catch (e) {}
        A.code = null; A.meta = null; A.current = null; A.scores = {}; A.mine = {}; A.qlog = {}; A.members = {}; A.presence = {};
        A.hall.reset(); A.boardKey = null;
        if (!real) { showHome(); return; }
        return LR.roomRef(real, 'meta').once('value').then(function (s) {
          var m = s.val();
          if (m && m.owner === A.user.uid && m.status === 'open' && LR.serverNow() < m.expiresAt) openRoom(real);
          else showHome();
        });
      }).then(function () {
        if (A.hall) A.hall.toast('انتهت المحاكاة وحُذفت الغرفة التجريبية');
      }).catch(function (e) { alert('تعذّر حذف غرفة المحاكاة: ' + (e.code || e.message)); });
    }
    return { start: start, end: end, stop: stop, onCurrent: onCurrent, isSim: isSim };
  })();
  function paintSim() {
    var sim = Sim.isSim();
    $('simEnd').classList.toggle('hidden', !sim);
    $('simNote').textContent = sim
      ? 'أنت في غرفة المحاكاة. أضف متدربين وهميين، أرسل الأسئلة كالمعتاد، ثم احذفها بـ«إنهاء المحاكاة».'
      : 'متدربون وهميون يجيبون عشوائياً في غرفة تجريبية منفصلة ومقفلة. لا تُحفظ في التقارير.';
    document.body.classList.toggle('sim', sim);
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
      LR.roomRef(code, 'host/on').onDisconnect().cancel();
      LR.roomRef(code, 'host').remove();
      // حفظ السجل النهائي في Firestore ثم حذف الإجابات الخام
      // غرفة المحاكاة لا تُحفظ في التقارير أبداً
      var rec = A.lastReport;
      if (A.meta && A.meta.sim) { A.saved = null; return; }
      return window.fbDb.collection('liveSessions').doc(code + '-' + rec.createdAt).set(rec).then(function () { A.saved = true; }, function (e) { A.saved = false; console.warn('Firestore save failed', e); });
    }).then(function () {
      LR.db.ref().update(pathNull(['rooms/' + code + '/answers', 'rooms/' + code + '/results', 'rooms/' + code + '/answered', 'rooms/' + code + '/reactions'])).catch(function () {});
      if (!(A.meta && A.meta.sim)) { try { localStorage.removeItem('lr_admin_room'); } catch (e) {} }
      Sim.stop();
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
      (A.meta && A.meta.sim ? '<p class="muted">جلسة محاكاة: لم تُحفظ في التقارير. اضغط «إنهاء المحاكاة» لحذفها.</p>' : '') +
      '<button type="button" class="btn btn-gold btn-block" id="endPdf">⬇ تحميل تقرير الجلسة PDF</button>' +
      '<button type="button" class="btn btn-ghost btn-block" id="newRoom">＋ غرفة جديدة</button></div>';
    $('endPdf').addEventListener('click', function () { downloadReport(this); });
    $('newRoom').addEventListener('click', function () { detach(); A.code = null; A.meta = null; A.current = null; A.scores = {}; A.mine = {}; A.qlog = {}; A.members = {}; A.presence = {}; showHome(); });
    $('lockBtn').disabled = true; $('endBtn').disabled = true;
    $('expText').textContent = 'انتهت الجلسة';
    paintBank();
    paintHall();
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
    $('createBtn').addEventListener('click', function () { try { localStorage.removeItem('lr_admin_real'); } catch (e) {} createRoom().catch(function () {}); });
    $('shareBtn').addEventListener('click', function () { setShare(true); });
    $('showTools').addEventListener('click', function () { setShare(false); });
    $('bankSearch').addEventListener('input', function () { A.search = this.value; paintBank(); });
    $('stopQBtn').addEventListener('click', function () { if (isLive()) reveal(A.current.qid); });
    document.querySelectorAll('[data-sim]').forEach(function (b) { b.addEventListener('click', function () { Sim.start(Number(b.getAttribute('data-sim'))); }); });
    $('simEnd').addEventListener('click', function () { Sim.end(); });
    $('copyBtn').addEventListener('click', function () { copy($('linkIn').value); var b = this; b.textContent = 'تم النسخ ✓'; setTimeout(function () { b.textContent = 'نسخ الرابط'; }, 1600); });
    $('bigCodeBtn').addEventListener('click', function () { $('bigCode').classList.remove('hidden'); });
    $('bcClose').addEventListener('click', function () { $('bigCode').classList.add('hidden'); });
    $('lockBtn').addEventListener('click', function () { if (A.meta) LR.roomRef(A.code, 'meta/locked').set(!A.meta.locked); });
    $('endBtn').addEventListener('click', function () { endSession(false); });
    $('pdfBtn').addEventListener('click', function () { downloadReport(this); });
    $('answersToggle').addEventListener('click', function () { A.showAnswers = !A.showAnswers; this.classList.toggle('on', A.showAnswers); paintBank(); });
    paintVolume();
    $('volIn').addEventListener('input', function () { setVolume(parseInt(this.value, 10)); });
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
  // شريط «مستوى صوت القاعة»: يُكتب في rooms/{code}/host/volume (كتابة مخففة كل 120 مللي ثانية أثناء السحب)
  function paintVolume() {
    var v = Math.round(A.volume);
    if (document.activeElement !== $('volIn')) $('volIn').value = v;
    $('volOut').textContent = v;
    $('volIn').style.setProperty('--p', v + '%');
  }
  function setVolume(v) {
    A.volume = Math.min(100, Math.max(0, isNaN(v) ? 100 : v));
    try { localStorage.setItem('lr_vol', A.volume); } catch (e) {}
    $('volOut').textContent = A.volume;
    $('volIn').style.setProperty('--p', A.volume + '%');
    Sound.setLevel(A.volume);
    if (!A.code) return;
    var code = A.code;
    clearTimeout(A.volT);
    var now = Date.now(), wait = Math.max(0, (A.volAt || 0) + 120 - now);
    A.volT = setTimeout(function () { A.volAt = Date.now(); if (A.code === code) LR.roomRef(code, 'host/volume').set(A.volume).catch(function () {}); }, wait);
  }
  function setDur(v) {
    A.duration = Math.min(180, Math.max(5, v || 20));
    $('durIn').value = A.duration;
    try { localStorage.setItem('lr_dur', A.duration); } catch (e) {}
  }

  boot();
})();
