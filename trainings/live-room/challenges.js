// ============================================================
// challenges.js — محرّك أنواع الأسئلة (حاسوب + لمس)
// LR_CH.render(box, payload, done) يرسم السؤال داخل box
// ويستدعي done(value) مرة واحدة عند الإجابة. يُرجع دالة تنظيف.
// لإضافة نوع جديد: أضف دالة باسم النوع في R بنفس التوقيع.
// ============================================================
var LR_CH = (function () {
  var t = LR.t, esc = LR.esc;

  function once(done) { var used = false; return function (v) { if (used) return; used = true; done(v); }; }
  function hint(box, txt) {
    var h = box.querySelector('.ch-hint');
    if (!h) { h = document.createElement('div'); h.className = 'ch-hint'; box.appendChild(h); }
    h.textContent = txt;
    h.classList.remove('show'); void h.offsetWidth; h.classList.add('show');
  }

  var SHAPES = ['▲', '◆', '●', '■'];
  var R = {};

  /* 1) تعرّف على القطعة / اختيار من متعدد */
  R.mcq = function (box, p, done) {
    box.innerHTML =
      (p.svg ? '<div class="ch-img">' + p.svg + '</div>' : '') +
      '<div class="ch-opts">' + p.options.map(function (o, i) {
        return '<button type="button" class="opt c' + i + '" data-i="' + i + '"><span class="shape">' + SHAPES[i % 4] + '</span><span class="lbl">' + esc(o) + '</span></button>';
      }).join('') + '</div>';
    box.querySelectorAll('.opt').forEach(function (b) {
      b.addEventListener('click', function () {
        box.querySelectorAll('.opt').forEach(function (x) { x.disabled = true; x.classList.add(x === b ? 'chosen' : 'dim'); });
        done(b.getAttribute('data-i'));
      });
    });
  };

  /* 2) صح أم خطأ */
  R.tf = function (box, p, done) {
    box.innerHTML = '<div class="ch-opts tf">' +
      '<button type="button" class="opt tf-yes" data-v="true"><span class="shape">✓</span><span class="lbl">' + t('tf_true') + '</span></button>' +
      '<button type="button" class="opt tf-no" data-v="false"><span class="shape">✗</span><span class="lbl">' + t('tf_false') + '</span></button></div>';
    box.querySelectorAll('.opt').forEach(function (b) {
      b.addEventListener('click', function () {
        box.querySelectorAll('.opt').forEach(function (x) { x.disabled = true; x.classList.add(x === b ? 'chosen' : 'dim'); });
        done(b.getAttribute('data-v'));
      });
    });
  };

  /* 3) تحدي النقر: الأهداف تظهر واحداً بعد الآخر في أماكن مختلفة (نفس الأماكن عند الجميع) */
  R.click = function (box, p, done) {
    var rnd = LR.rng(p.seed), n = p.count, i = 0, pts = [];
    for (var k = 0; k < n; k++) {
      var x, y, tries = 0;
      do { x = 8 + rnd() * 84; y = 10 + rnd() * 80; tries++; }
      while (tries < 20 && pts.length && Math.hypot(x - pts[pts.length - 1][0], y - pts[pts.length - 1][1]) < 25);
      pts.push([x, y]);
    }
    box.innerHTML = '<div class="arena"><div class="arena-count"><b>0</b> / ' + n + '</div></div>';
    var arena = box.querySelector('.arena'), cnt = arena.querySelector('b');
    function next() {
      if (i >= n) { arena.classList.add('done'); done(String(n)); return; }
      var tg = document.createElement('button');
      tg.type = 'button';
      tg.className = 'target';
      tg.style.left = pts[i][0] + '%';
      tg.style.top = pts[i][1] + '%';
      tg.innerHTML = '<span></span>';
      tg.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        if (tg.classList.contains('hit')) return;
        tg.classList.add('hit');
        LR.Sound.play('tick', 0.6);
        i++; cnt.textContent = i;
        setTimeout(function () { tg.remove(); }, 260);
        next();
      });
      arena.appendChild(tg);
    }
    next();
  };

  /* 4) النقر المزدوج: صناديق تُفتح بنقرتين/لمستين سريعتين فقط */
  var BOX_SVG = '<svg viewBox="0 0 100 100"><g class="lid"><rect x="12" y="22" width="76" height="18" rx="3" fill="#D9473A"/><rect x="45" y="22" width="10" height="18" fill="#F5C044"/><path d="M50 22c-8-14-24-12-18-2 4 5 18 2 18 2zm0 0c8-14 24-12 18-2-4 5-18 2-18 2z" fill="#F5C044"/></g>' +
    '<rect x="17" y="40" width="66" height="48" rx="3" fill="#B83A2E"/><rect x="45" y="40" width="10" height="48" fill="#E0AE36"/><g class="star"><path d="M50 30l6 12 13 2-9.5 9 2.5 13L50 60l-12 6 2.5-13L31 44l13-2z" fill="#FFE27A"/></g></svg>';
  R.dblclick = function (box, p, done) {
    var n = p.count, opened = 0;
    box.innerHTML = '<div class="boxes n' + Math.min(n, 5) + '">' + Array.apply(null, Array(n)).map(function () {
      return '<button type="button" class="gbox">' + BOX_SVG + '</button>';
    }).join('') + '</div><div class="arena-count"><b>0</b> / ' + n + '</div>';
    var cnt = box.querySelector('.arena-count b');
    box.querySelectorAll('.gbox').forEach(function (b) {
      // نقرتان سريعتان: المهلة بين رفع النقرة الأولى وبدء الثانية (500ms كمهلة ويندوز الافتراضية)
      var lastUp = 0, gapOk = false;
      b.addEventListener('pointerdown', function () { gapOk = lastUp > 0 && Date.now() - lastUp < 500; });
      b.addEventListener('pointerup', function (e) {
        e.preventDefault();
        if (b.classList.contains('open')) return;
        if (gapOk) {
          lastUp = 0; gapOk = false;
          b.classList.add('open');
          LR.Sound.play('tick', 0.7);
          opened++; cnt.textContent = opened;
          if (opened >= n) done(String(n));
        } else {
          var me = lastUp = Date.now();
          setTimeout(function () {
            if (lastUp === me && !b.classList.contains('open')) {
              lastUp = 0;
              b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake');
              hint(box, LR.touch ? t('dbl_hint_touch') : t('dbl_hint_mouse'));
            }
          }, 520);
        }
      });
      b.addEventListener('dblclick', function (e) { e.preventDefault(); });
    });
  };

  /* 5) السحب والإفلات: كل صورة إلى اسمها (Pointer Events تعمل بالفأرة والإصبع) */
  R.drag = function (box, p, done) {
    var n = p.svgs.length, place = Array(n).fill(-1); // place[item] = zone
    box.innerHTML =
      '<div class="dd">' +
      '<div class="dd-tray">' + p.svgs.map(function (s, i) { return '<div class="dd-item" data-i="' + i + '">' + s + '</div>'; }).join('') + '</div>' +
      '<div class="dd-zones">' + p.labels.map(function (l, j) { return '<div class="dd-zone" data-j="' + j + '"><div class="dd-slot"></div><div class="dd-name">' + esc(l) + '</div></div>'; }).join('') + '</div>' +
      '</div><button type="button" class="btn btn-gold dd-ok hidden">' + t('confirm') + ' ✓</button>';
    var tray = box.querySelector('.dd-tray'), okBtn = box.querySelector('.dd-ok');
    function zoneEl(j) { return box.querySelector('.dd-zone[data-j="' + j + '"]'); }
    function refresh() {
      var all = place.every(function (z) { return z >= 0; });
      okBtn.classList.toggle('hidden', !all);
    }
    box.querySelectorAll('.dd-item').forEach(function (it) {
      it.addEventListener('pointerdown', function (e) {
        if (box.classList.contains('locked')) return;
        e.preventDefault();
        var i = +it.getAttribute('data-i'), r = it.getBoundingClientRect();
        var ghost = it.cloneNode(true);
        ghost.className = 'dd-item dd-ghost';
        ghost.style.width = r.width + 'px'; ghost.style.height = r.height + 'px';
        document.body.appendChild(ghost);
        var dx = e.clientX - r.left, dy = e.clientY - r.top;
        function mv(ev) { ghost.style.left = (ev.clientX - dx) + 'px'; ghost.style.top = (ev.clientY - dy) + 'px'; hover(ev); }
        var over = null;
        function hover(ev) {
          ghost.style.display = 'none';
          var el = document.elementFromPoint(ev.clientX, ev.clientY);
          ghost.style.display = '';
          var z = el && el.closest ? el.closest('.dd-zone') : null;
          if (z && !box.contains(z)) z = null;
          if (over && over !== z) over.classList.remove('over');
          over = z; if (z) z.classList.add('over');
        }
        mv(e);
        it.classList.add('lifting');
        function up(ev) {
          document.removeEventListener('pointermove', mv);
          document.removeEventListener('pointerup', up);
          document.removeEventListener('pointercancel', up);
          hover(ev);
          ghost.remove(); it.classList.remove('lifting');
          if (over) {
            over.classList.remove('over');
            var j = +over.getAttribute('data-j');
            var prev = place.indexOf(j);
            if (prev >= 0 && prev !== i) { place[prev] = -1; tray.appendChild(box.querySelector('.dd-item[data-i="' + prev + '"]')); }
            place[i] = j;
            over.querySelector('.dd-slot').appendChild(it);
            LR.Sound.play('tick', 0.6);
          } else if (place[i] >= 0) {
            place[i] = -1; tray.appendChild(it);
          }
          refresh();
        }
        document.addEventListener('pointermove', mv);
        document.addEventListener('pointerup', up);
        document.addEventListener('pointercancel', up);
      });
    });
    okBtn.addEventListener('click', function () {
      box.classList.add('locked'); okBtn.disabled = true;
      done(JSON.stringify(place));
    });
  };

  /* 6) الزر الأيمن: قائمة الأوامر لا تظهر إلا بالنقر الأيمن (أو الضغط المطوّل على الهاتف) */
  R.rightclick = function (box, p, done) {
    box.innerHTML = '<div class="desk"><div class="desk-obj" tabindex="0">' + window.LR_PARTS.obj(p.target) + '</div>' +
      '<div class="ctx hidden">' + p.options.map(function (o, i) { return '<button type="button" data-i="' + i + '">' + esc(o) + '</button>'; }).join('') + '</div></div>';
    var desk = box.querySelector('.desk'), obj = box.querySelector('.desk-obj'), menu = box.querySelector('.ctx');
    function openAt(x, y) {
      var r = desk.getBoundingClientRect();
      menu.classList.remove('hidden');
      var mw = menu.offsetWidth, mh = menu.offsetHeight;
      var lx = Math.min(Math.max(4, x - r.left), r.width - mw - 4), ly = Math.min(Math.max(4, y - r.top), r.height - mh - 4);
      menu.style.left = lx + 'px'; menu.style.top = ly + 'px';
      obj.classList.add('sel');
    }
    obj.addEventListener('contextmenu', function (e) { e.preventDefault(); openAt(e.clientX, e.clientY); });
    desk.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    var timer = null, sx = 0, sy = 0, longDone = false;
    obj.addEventListener('pointerdown', function (e) {
      longDone = false;
      if (e.pointerType === 'mouse') { if (e.button === 0) setTimeout(function () { if (menu.classList.contains('hidden')) hint(box, t('rc_hint_mouse')); }, 50); return; }
      sx = e.clientX; sy = e.clientY;
      timer = setTimeout(function () { longDone = true; if (navigator.vibrate) navigator.vibrate(30); openAt(sx, sy); }, 550);
    });
    obj.addEventListener('pointermove', function (e) { if (timer && Math.hypot(e.clientX - sx, e.clientY - sy) > 12) { clearTimeout(timer); timer = null; } });
    obj.addEventListener('pointerup', function (e) {
      if (timer) { clearTimeout(timer); timer = null; }
      if (e.pointerType !== 'mouse' && !longDone && menu.classList.contains('hidden')) hint(box, t('rc_hint_touch'));
    });
    menu.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        menu.querySelectorAll('button').forEach(function (x) { x.disabled = true; });
        b.classList.add('chosen');
        done(b.getAttribute('data-i'));
      });
    });
  };

  /* 7) سباق الكتابة */
  R.typing = function (box, p, done) {
    var target = p.phrase;
    box.innerHTML = '<div class="type-target">' + target.split('').map(function (c) { return '<span>' + esc(c) + '</span>'; }).join('') + '</div>' +
      '<div class="type-row"><input type="text" class="type-in" dir="rtl" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" inputmode="text" enterkeyhint="send">' +
      '<button type="button" class="btn btn-gold type-send">' + t('typing_send') + '</button></div>';
    var inp = box.querySelector('.type-in'), spans = box.querySelectorAll('.type-target span'), send = box.querySelector('.type-send');
    function paint() {
      var v = inp.value;
      spans.forEach(function (s, k) {
        s.className = k < v.length ? (LR.norm(v[k]) === LR.norm(target[k]) || (v[k] === ' ' && target[k] === ' ') ? 'ok' : 'bad') : (k === v.length ? 'cur' : '');
      });
      if (LR.norm(v) === LR.norm(target)) submit();
    }
    function submit() {
      if (inp.disabled) return;
      inp.disabled = true; send.disabled = true;
      done(inp.value);
    }
    inp.addEventListener('input', paint);
    inp.addEventListener('paste', function (e) { e.preventDefault(); });
    inp.addEventListener('drop', function (e) { e.preventDefault(); });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); if (inp.value.trim()) submit(); } });
    send.addEventListener('click', function () { if (inp.value.trim()) submit(); });
    paint();
    setTimeout(function () { try { inp.focus(); } catch (e) {} }, 60);
  };

  return {
    render: function (box, payload, done) {
      box.className = 'q-body t-' + payload.type;
      box.innerHTML = '';
      var fn = R[payload.type];
      if (!fn) { box.textContent = '?'; return; }
      fn(box, payload, once(done));
    },
    // تعطيل التفاعل بعد انتهاء الوقت
    lock: function (box) {
      box.classList.add('locked');
      box.querySelectorAll('button, input').forEach(function (el) { el.disabled = true; });
    }
  };
})();
