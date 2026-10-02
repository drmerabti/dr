// ============================================================
// hall.js — القاعة المشتركة بين صفحة المتدرب وصفحة المدرّب
// طراز قاعة الجمعية العامة: قبة بحلقات أضواء، جداران، جدار مضيء
// للسؤال، شاشتان جانبيتان، ومقاعد منحنية حتى 100 متدرب.
// لا يعرف شيئاً عن Firebase: الصفحة تمرّر الحالة وهو يرسم.
// ============================================================
var LR_HALL = (function () {
  var NS = 'http://www.w3.org/2000/svg';
  var CX = 800, CY = 592, QX = 800, QY = 400, MAX = 100, NAMES_MAX = 30;
  var MEDALS = ['👑', '🥈', '🥉', '4', '5'];
  var seq = 0;

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function esc(s) { return LR.esc(s); }
  function firstName(n) { return String(n || '').trim().split(/\s+/)[0] || '؟'; }

  // مواقع المقاعد: الصف الأمامي (5) ثم 5 صفوف منحنية تمتلئ من الوسط
  var FRONT = [90, 72, 108, 56, 124].map(function (d) { var a = d * Math.PI / 180; return { x: CX + 235 * Math.cos(a), y: CY + 58 * Math.sin(a), r: 19 }; });
  var SLOTS = (function () {
    var out = [];
    for (var k = 1; k <= 5; k++) {
      var rx = 300 + k * 150, ry = 96 + k * 52, r = 12 + k * 2.4, gap = 2 * r + 12, row = [], px = null, py = null, acc = gap;
      for (var d = 20; d <= 160; d += 0.2) {
        var a = d * Math.PI / 180, x = CX + rx * Math.cos(a), y = CY + ry * Math.sin(a);
        if (px !== null) acc += Math.hypot(x - px, y - py);
        px = x; py = y;
        if (acc >= gap) { acc = 0; if (x > 30 && x < 1570 && y < 885) row.push({ x: x, y: y, r: r, d: d }); }
      }
      row.sort(function (p, q) { return Math.abs(p.d - 90) - Math.abs(q.d - 90); });
      out = out.concat(row);
    }
    return out;
  })();

  var SVG =
    '<svg class="lrh-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
    '<defs>' +
    '<radialGradient id="lrhCeil{N}" cx="50%" cy="10%" r="80%"><stop offset="0" stop-color="#14305a"/><stop offset="1" stop-color="#040b19"/></radialGradient>' +
    '<pattern id="lrhSlats{N}" width="9" height="10" patternUnits="userSpaceOnUse"><rect width="9" height="10" fill="#0b1c38"/><rect width="2" height="10" fill="#183663"/></pattern>' +
    '<linearGradient id="lrhWall{N}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5aa0ff" stop-opacity=".18"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient>' +
    '<radialGradient id="lrhBack{N}" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#3a7fcc"/><stop offset=".55" stop-color="#174276"/><stop offset="1" stop-color="#0a2140"/></radialGradient>' +
    '<pattern id="lrhDots{N}" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="1" fill="#9fd0ff" opacity=".25"/></pattern>' +
    '<linearGradient id="lrhFloor{N}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1830"/><stop offset="1" stop-color="#02050d"/></linearGradient>' +
    '<linearGradient id="lrhBeam{N}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe6ff" stop-opacity=".1"/><stop offset="1" stop-color="#cfe6ff" stop-opacity="0"/></linearGradient>' +
    '<filter id="lrhGlow{N}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18"/></filter>' +
    '<filter id="lrhSoft{N}"><feGaussianBlur stdDeviation="1.6"/></filter>' +
    '<clipPath id="lrhClip{N}"><circle r="14"/></clipPath>' +
    '</defs>' +
    '<rect width="1600" height="900" fill="#03081a"/>' +
    '<ellipse cx="800" cy="60" rx="820" ry="360" fill="url(#lrhCeil{N})"/>' +
    '<ellipse cx="800" cy="150" rx="430" ry="128" fill="#050d1f" stroke="#21416f" stroke-width="2"/>' +
    '<ellipse cx="800" cy="146" rx="310" ry="86" fill="#020611"/>' +
    '<ellipse cx="800" cy="118" rx="70" ry="22" fill="#0f2547"/>' +
    '<g class="lrh-lamps"></g>' +
    '<path d="M60 340 Q300 255 560 300 L560 612 Q300 600 30 655 Z" fill="url(#lrhSlats{N})"/>' +
    '<path d="M60 340 Q300 255 560 300 L560 612 Q300 600 30 655 Z" fill="url(#lrhWall{N})"/>' +
    '<path d="M1540 340 Q1300 255 1040 300 L1040 612 Q1300 600 1570 655 Z" fill="url(#lrhSlats{N})"/>' +
    '<path d="M1540 340 Q1300 255 1040 300 L1040 612 Q1300 600 1570 655 Z" fill="url(#lrhWall{N})"/>' +
    '<path d="M70 448 Q300 410 560 432 L560 462 Q300 444 64 482 Z" fill="#040b18" opacity=".9"/>' +
    '<path d="M1530 448 Q1300 410 1040 432 L1040 462 Q1300 444 1536 482 Z" fill="#040b18" opacity=".9"/>' +
    '<ellipse class="lrh-wallglow" cx="800" cy="420" rx="300" ry="220" fill="#2f74c4" opacity=".35" filter="url(#lrhGlow{N})"/>' +
    '<rect x="575" y="255" width="450" height="330" fill="url(#lrhBack{N})"/>' +
    '<rect x="575" y="255" width="450" height="330" fill="url(#lrhDots{N})"/>' +
    '<rect x="575" y="255" width="450" height="330" fill="none" stroke="#7fbaff" stroke-opacity=".35"/>' +
    '<rect x="360" y="480" width="180" height="105" rx="4" fill="#050f20" stroke="#356aa8" stroke-width="2"/>' +
    '<rect x="1060" y="480" width="180" height="105" rx="4" fill="#050f20" stroke="#356aa8" stroke-width="2"/>' +
    '<rect x="0" y="600" width="1600" height="300" fill="url(#lrhFloor{N})"/>' +
    '<polygon points="760,0 840,0 1010,610 590,610" fill="url(#lrhBeam{N})"/>' +
    '<rect x="690" y="590" width="220" height="16" rx="3" fill="#0d2241"/>' +
    '<rect x="735" y="570" width="130" height="22" rx="3" fill="#15345f" stroke="#3b6aa6"/>' +
    '<g class="lrh-rays"></g><g class="lrh-slots"></g><g class="lrh-ghosts"></g><g class="lrh-seats"></g>' +
    '</svg>';

  function create(host, opts) {
    opts = opts || {};
    var N = ++seq;
    var root = document.createElement('div');
    root.className = 'lrh' + (opts.admin ? ' lrh-admin verdicts' : '');
    root.innerHTML = SVG.replace(/\{N\}/g, N) +
      '<div class="lrh-board">' +
      '<img class="lrh-logo" src="' + esc(opts.logo || '../../apple-touch-icon.png') + '" alt="">' +
      '<div class="lrh-img"></div><div class="lrh-q"></div><div class="lrh-sub"></div><div class="lrh-opts"></div><div class="lrh-timer"></div></div>' +
      '<div class="lrh-screen lrh-scrL"></div><div class="lrh-screen lrh-scrR"></div>' +
      '<div class="lrh-hud"><span class="lrh-chip lrh-codechip hidden"></span><span class="lrh-chip lrh-simchip hidden">🧪 محاكاة</span>' +
      '<span class="lrh-fill"></span><span class="lrh-chip"><b class="lrh-cnt">0</b> في القاعة<span class="dot"></span></span></div>' +
      '<div class="lrh-toasts"></div>';
    host.appendChild(root);
    var q = function (s) { return root.querySelector(s); };
    var svg = q('.lrh-svg'), G = { lamps: q('.lrh-lamps'), rays: q('.lrh-rays'), slots: q('.lrh-slots'), ghosts: q('.lrh-ghosts'), seats: q('.lrh-seats') };

    // أضواء القبة
    function ring(rx, ry, cy, n, r) {
      for (var i = 0; i < n; i++) {
        var t = Math.PI * 2 * i / n;
        var c = el('circle', { cx: 800 + rx * Math.cos(t), cy: cy + ry * Math.sin(t), r: r, 'class': 'lamp' }, G.lamps);
        c.style.animationDelay = (Math.random() * 4).toFixed(2) + 's';
      }
    }
    ring(405, 118, 150, 74, 2.7); ring(350, 98, 150, 60, 2.2); ring(480, 148, 150, 42, 1.6);
    for (var i = 0; i < 34; i++) {
      var x = 120 + Math.random() * 1360, y = 30 + Math.random() * 250;
      if (Math.abs(x - 800) < 480 && y < 290) continue;
      el('circle', { cx: x, cy: y, r: 1.6, 'class': 'lamp' }, G.lamps).style.animationDelay = (Math.random() * 4).toFixed(2) + 's';
    }
    // الصف الأمامي المحجوز (منقط ذهبي حتى أول ترتيب)
    FRONT.forEach(function (s, i) {
      el('circle', { cx: s.x, cy: s.y, r: s.r, 'class': 'slot', 'data-i': i }, G.slots);
      el('text', { x: s.x, y: s.y, 'class': 'slotn' }, G.slots).textContent = i + 1;
    });

    var H = {
      root: root, me: opts.me || null, seats: {}, order: [], ranking: null, phase: 'wait',
      answered: {}, armAt: Date.now() + 2500, top5: null
    };

    /* ---------------- المقاعد ---------------- */
    function makeSeat(p) {
      var g = el('g', { 'class': 'seat new' + (p.uid === H.me ? ' me' : ''), 'data-uid': p.uid }, G.seats);
      var title = el('title', {}, g);
      el('circle', { 'class': 'halo', r: 16 }, g);
      el('circle', { 'class': 'chair', r: 16 }, g);
      var ini = el('text', { 'class': 'ini' }, g);
      var tint = el('circle', { 'class': 'tint', r: 14 }, g);
      el('circle', { 'class': 'rim', r: 16 }, g);
      el('text', { 'class': 'hand', y: -22 }, g).textContent = '✋';
      var medal = el('text', { 'class': 'medal', y: -25 }, g);
      var fn = el('text', { 'class': 'fn', y: 31 }, g);
      var full = el('text', { 'class': 'full', y: 31 }, g);
      var s = { uid: p.uid, g: g, title: title, ini: ini, tint: tint, medal: medal, fn: fn, full: full, img: null, photo: null, name: null };
      // التمرير: المقعد يُرفع فوق جيرانه حتى لا يُغطّى اسمه الكامل
      g.addEventListener('pointerenter', function () { if (g.nextSibling) G.seats.appendChild(g); });
      // اللمس: الاسم الكامل يظهر لثانيتين
      g.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'mouse') return;
        if (g.nextSibling) G.seats.appendChild(g);
        g.classList.add('peek');
        clearTimeout(s.peekT);
        s.peekT = setTimeout(function () { g.classList.remove('peek'); }, 2000);
      });
      g.style.transition = 'none';
      requestAnimationFrame(function () { requestAnimationFrame(function () { g.style.transition = ''; g.classList.remove('new'); }); });
      return s;
    }
    function paintSeat(s, p) {
      var me = p.uid === H.me, name = p.name || '؟';
      if (s.name !== name) {
        s.name = name;
        s.title.textContent = name;
        s.ini.textContent = LR.initials(name);
        s.fn.textContent = me ? 'أنت' : firstName(name);
        s.full.textContent = me ? 'أنت' : name;
      }
      var photo = p.photo && /^https:\/\//.test(p.photo) ? p.photo : null;
      if (s.photo !== photo) {
        s.photo = photo;
        if (s.img) { s.img.remove(); s.img = null; }
        s.g.classList.remove('has-ph');
        if (photo) {
          var im = el('image', { 'class': 'ph', x: -14, y: -14, width: 28, height: 28, preserveAspectRatio: 'xMidYMid slice', 'clip-path': 'url(#lrhClip' + N + ')' });
          im.addEventListener('load', function () { s.g.classList.add('has-ph'); });
          im.addEventListener('error', function () { im.remove(); if (s.img === im) s.img = null; s.g.classList.remove('has-ph'); });
          im.setAttribute('href', photo);
          s.g.insertBefore(im, s.tint);
          s.img = im;
        }
      }
    }
    function place(s, pos) {
      s.pos = pos;
      s.g.style.transform = 'translate(' + pos.x.toFixed(1) + 'px,' + pos.y.toFixed(1) + 'px) scale(' + (pos.r / 16).toFixed(3) + ')';
    }

    // people: [{uid,name,photo,joinedAt}] — الحاضرون فقط
    // ranking: [uid…] الترتيب العام أو null قبل السؤال الأول
    // top5: [{uid,name,total}] للشاشة اليمنى
    H.update = function (st) {
      if (st.phase) H.phase = st.phase;
      if ('ranking' in st) H.ranking = st.ranking && st.ranking.length ? st.ranking : null;
      if ('top5' in st) H.top5 = st.top5;
      if (st.people) {
        var list = st.people.slice(0, MAX), seen = {}, arm = Date.now() >= H.armAt;
        list.forEach(function (p) {
          seen[p.uid] = true;
          var s = H.seats[p.uid];
          if (!s) {
            s = H.seats[p.uid] = makeSeat(p);
            if (arm && p.uid !== H.me) H.toast((p.name || '؟') + ' دخل القاعة');
          }
          s.joinedAt = p.joinedAt || 0;
          paintSeat(s, p);
        });
        Object.keys(H.seats).forEach(function (u) {
          if (seen[u]) return;
          var s = H.seats[u];
          delete H.seats[u];
          s.g.classList.add('gone');
          setTimeout(function () { s.g.remove(); }, 600);
        });
        H.people = list;
      }
      layout();
      screens();
    };
    function layout() {
      var uids = Object.keys(H.seats), i = 0;
      uids.forEach(function (u) { var g = H.seats[u].g; g.classList.remove('top', 'r1', 'r2', 'r3', 'r4', 'r5'); H.seats[u].medal.textContent = ''; });
      var rest;
      if (H.ranking) {
        var pos = {};
        H.ranking.forEach(function (u, k) { pos[u] = k; });
        var ranked = uids.slice().sort(function (a, b) {
          var pa = a in pos ? pos[a] : 1e6, pb = b in pos ? pos[b] : 1e6;
          return (pa - pb) || (H.seats[a].joinedAt - H.seats[b].joinedAt);
        });
        // الصف الأمامي: الخمسة الأوائل في الترتيب العام (إن كانوا حاضرين)
        var front = {};
        H.ranking.slice(0, 5).forEach(function (u, k) {
          var s = H.seats[u];
          if (!s) return;
          front[u] = true;
          place(s, FRONT[k]);
          s.g.classList.add('top', 'r' + (k + 1));
          s.medal.textContent = MEDALS[k];
          s.medal.classList.toggle('num', k >= 3);
        });
        rest = ranked.filter(function (u) { return !front[u]; });
      } else {
        rest = uids.sort(function (a, b) {
          return ((b === H.me) - (a === H.me)) || (H.seats[a].joinedAt - H.seats[b].joinedAt) || (a < b ? -1 : 1);
        });
      }
      rest.forEach(function (u) { place(H.seats[u], SLOTS[i] || SLOTS[SLOTS.length - 1]); i++; });
      G.ghosts.innerHTML = '';
      if (H.phase === 'wait') {
        for (var j = i; j < Math.min(i + 8, SLOTS.length); j++) el('circle', { cx: SLOTS[j].x, cy: SLOTS[j].y, r: SLOTS[j].r, 'class': 'ghost' }, G.ghosts);
      }
      G.slots.style.display = H.ranking ? 'none' : '';
      var n = uids.length;
      root.classList.toggle('names', n <= NAMES_MAX);
      q('.lrh-cnt').textContent = n;
    }
    function screens() {
      var n = Object.keys(H.seats).length, a = 0;
      Object.keys(H.answered).forEach(function (u) { if (H.seats[u]) a++; });
      q('.lrh-scrL').innerHTML = H.phase === 'live'
        ? '<span>أجابوا</span><b>' + a + ' / ' + n + '</b><div class="bar"><i style="width:' + (n ? Math.round(a / n * 100) : 0) + '%"></i></div>'
        : '<span>في القاعة</span><b>' + n + '</b><span>متدرب</span>';
      var top = H.top5 || [];
      q('.lrh-scrR').innerHTML = !top.length
        ? '<span>الخمسة الأوائل</span><span class="lrh-dim">يظهرون بعد السؤال الأول</span>'
        : '<span>الخمسة الأوائل</span><ul class="lrh-top5">' + top.map(function (r, k) {
          return '<li' + (r.uid === H.me ? ' class="me"' : '') + '><span>' + MEDALS[k] + ' ' + esc(r.uid === H.me ? 'أنت' : r.name) + '</span><span>' + r.total + '</span></li>';
        }).join('') + '</ul>';
    }

    /* ---------------- الإجابات ---------------- */
    // map: uid → true (أجاب) أو 'ok' / 'bad' (للمدرّب فقط)
    H.setAnswered = function (map) {
      map = map || {};
      Object.keys(H.seats).forEach(function (u) {
        var s = H.seats[u], v = map[u];
        var was = !!H.answered[u];
        s.g.classList.toggle('answered', !!v);
        s.g.classList.toggle('ok', v === 'ok');
        s.g.classList.toggle('bad', v === 'bad');
        if (v && !was && H.phase === 'live') { replay(s.g); ray(s); }
      });
      H.answered = {};
      Object.keys(map).forEach(function (u) { if (map[u]) H.answered[u] = map[u]; });
      screens();
    };
    function replay(g) { g.classList.add('wave'); setTimeout(function () { g.classList.remove('wave'); }, 1100); }
    function ray(s) {
      if (!s.pos) return;
      var p = s.pos;
      var l = el('path', { d: 'M' + p.x + ' ' + p.y + ' Q' + ((p.x + QX) / 2) + ' ' + (Math.min(p.y, QY) - 60) + ' ' + QX + ' ' + (QY + 150), 'class': 'ray', filter: 'url(#lrhSoft' + N + ')' }, G.rays);
      if (!l.animate || !l.getTotalLength) { setTimeout(function () { l.remove(); }, 1300); return; }
      var len = l.getTotalLength();
      l.style.strokeDasharray = len;
      l.style.strokeDashoffset = len;
      l.animate([{ strokeDashoffset: len, opacity: .9 }, { strokeDashoffset: 0, opacity: .9 }, { strokeDashoffset: 0, opacity: 0 }], { duration: 1300, easing: 'ease-out' }).onfinish = function () { l.remove(); };
    }

    /* ---------------- جدار السؤال ---------------- */
    // b: {q, sub, img (svg), opts:[{label, cls}], onPick(i), timer}
    H.setBoard = function (b) {
      b = b || {};
      var qt = q('.lrh-q');
      qt.textContent = b.q || '';
      qt.classList.toggle('long', String(b.q || '').length > 70);
      q('.lrh-sub').textContent = b.sub || '';
      q('.lrh-img').innerHTML = b.img || '';
      q('.lrh-img').classList.toggle('hidden', !b.img);
      q('.lrh-board').classList.toggle('has-img', !!b.img);
      var box = q('.lrh-opts');
      box.innerHTML = '';
      box.classList.toggle('one', !!(b.opts && b.opts.length > 4));
      (b.opts || []).forEach(function (o, i) {
        var e = document.createElement(b.onPick ? 'button' : 'span');
        if (b.onPick) e.type = 'button';
        e.className = 'lrh-opt ' + (o.cls || '');
        e.textContent = o.label;
        if (b.onPick) e.addEventListener('click', function () {
          if (box.classList.contains('locked')) return;
          box.classList.add('locked');
          e.classList.add('pick');
          Array.prototype.forEach.call(box.children, function (x) { x.disabled = true; });
          b.onPick(i);
        });
        box.appendChild(e);
      });
      H.setTimer('');
    };
    H.lockOpts = function () {
      var box = q('.lrh-opts');
      box.classList.add('locked');
      Array.prototype.forEach.call(box.children, function (x) { x.disabled = true; });
    };
    H.markOpt = function (i, cls) { var x = q('.lrh-opts').children[i]; if (x) x.classList.add(cls); };
    H.setTimer = function (txt, hot) {
      var t = q('.lrh-timer');
      if (t.textContent !== String(txt)) t.textContent = txt;
      t.classList.toggle('hot', !!hot);
    };

    /* ---------------- متفرقات ---------------- */
    H.toast = function (msg) {
      var box = q('.lrh-toasts'), d = document.createElement('div');
      d.className = 'lrh-toast';
      d.textContent = msg;
      box.prepend(d);
      while (box.children.length > 3) box.lastChild.remove();
      setTimeout(function () { d.remove(); }, 2600);
    };
    H.fly = function (uid, emo) {
      var s = H.seats[uid];
      if (!s || !s.pos) return;
      var d = document.createElement('div');
      d.className = 'lrh-fly';
      d.textContent = emo;
      d.style.left = (s.pos.x / 16) + '%';
      d.style.top = ((s.pos.y - 30) / 9) + '%';
      root.appendChild(d);
      setTimeout(function () { d.remove(); }, 2000);
    };
    H.setCode = function (code) {
      var c = q('.lrh-codechip');
      c.classList.toggle('hidden', !code);
      c.textContent = code ? 'رمز الغرفة ' + String(code).slice(0, 3) + ' ' + String(code).slice(3) : '';
    };
    H.setSim = function (on) { q('.lrh-simchip').classList.toggle('hidden', !on); };
    H.setVerdicts = function (on) { root.classList.toggle('verdicts', !!on); };
    H.count = function () { return Object.keys(H.seats).length; };
    H.arm = function (ms) { H.armAt = Date.now() + (ms == null ? 2500 : ms); };
    H.reset = function () {
      Object.keys(H.seats).forEach(function (u) { H.seats[u].g.remove(); });
      H.seats = {}; H.answered = {}; H.ranking = null; H.top5 = null; H.phase = 'wait';
      G.rays.innerHTML = '';
      H.arm();
      layout(); screens();
    };
    layout(); screens();
    return H;
  }

  return { create: create, firstName: firstName, MEDALS: MEDALS, capacity: Math.min(MAX, SLOTS.length) };
})();
