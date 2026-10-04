// ============================================================
// bank-stage1.js — المراحل وأنواع الأسئلة وبنك المرحلة الأولى
// لإضافة مرحلة جديدة: غيّر soon إلى false وأضف أسئلتها في LR_BANK
// بنفس الشكل (stage: رقم المرحلة). الأنواع نفسها تعمل لكل المراحل.
//
// رموز داخل النصوص تتحوّل حسب الجهاز (حاسوب / هاتف):
//   {CLICK} انقر / المس      {DBL} انقر نقرتين / المس لمستين
//   {RC} انقر بالزر الأيمن / اضغط مطوّلاً
// ============================================================
(function () {
  window.LR_STAGES = [
    { id: 1, name: 'التعرف على الحاسوب', soon: false },
    { id: 2, name: 'ويندوز', soon: true },
    { id: 3, name: 'Word', soon: true },
    { id: 4, name: 'Excel', soon: true },
    { id: 5, name: 'PowerPoint', soon: true },
    { id: 6, name: 'الإنترنت والبريد', soon: true }
  ];

  window.LR_TYPES = {
    mcq:        { name: 'تعرّف على القطعة', icon: '🖼️' },
    tf:         { name: 'صح أم خطأ', icon: '⚖️' },
    click:      { name: 'تحدي النقر', icon: '🎯' },
    dblclick:   { name: 'النقر المزدوج', icon: '📦' },
    drag:       { name: 'السحب والإفلات', icon: '✋' },
    rightclick: { name: 'الزر الأيمن', icon: '🖱️' },
    typing:     { name: 'سباق الكتابة', icon: '⌨️' }
  };

  var N = function (id) { return window.LR_PARTS.names[id]; };
  var B = [];
  var n = 0;
  function add(q) { n++; q.id = 's1-' + (n < 10 ? '0' : '') + n; q.stage = 1; B.push(q); }

  // ---------- 1) تعرّف على القطعة: صورة + 4 اختيارات (الصحيح دائماً أولاً هنا ويُخلط عند الإرسال) ----------
  var ident = [
    ['monitor', 'laptop', 'printer', 'scanner'],
    ['case', 'speaker', 'psu', 'router'],
    ['keyboard', 'mouse', 'laptop', 'scanner'],
    ['mouse', 'microphone', 'usb', 'webcam'],
    ['printer', 'scanner', 'monitor', 'case'],
    ['scanner', 'printer', 'keyboard', 'router'],
    ['speaker', 'case', 'headphones', 'microphone'],
    ['headphones', 'speaker', 'microphone', 'webcam'],
    ['microphone', 'speaker', 'webcam', 'mouse'],
    ['webcam', 'microphone', 'monitor', 'speaker'],
    ['usb', 'ssd', 'ram', 'mouse'],
    ['motherboard', 'gpu', 'cpu', 'ram'],
    ['cpu', 'ram', 'motherboard', 'ssd'],
    ['ram', 'gpu', 'cpu', 'usb'],
    ['hdd', 'ssd', 'psu', 'cpu'],
    ['ssd', 'hdd', 'usb', 'ram'],
    ['psu', 'gpu', 'case', 'hdd'],
    ['gpu', 'motherboard', 'ram', 'psu'],
    ['laptop', 'monitor', 'keyboard', 'case'],
    ['router', 'speaker', 'webcam', 'scanner']
  ];
  ident.forEach(function (row) {
    add({ type: 'mcq', text: 'ما اسم هذه القطعة؟', img: row[0], options: row.map(N), answer: 0 });
  });

  // أسئلة معرفية باختيار من متعدد (بدون صورة)
  add({ type: 'mcq', text: 'أيّ قطعة نستعملها لكتابة النصوص والأرقام؟', options: [N('keyboard'), N('mouse'), N('monitor'), N('speaker')], answer: 0 });
  add({ type: 'mcq', text: 'أين تُحفظ الملفات بشكل دائم داخل الحاسوب؟', options: [N('hdd'), N('ram'), N('cpu'), N('gpu')], answer: 0 });
  add({ type: 'mcq', text: 'أيّ جهاز يطبع المستندات على الورق؟', options: [N('printer'), N('scanner'), N('monitor'), N('router')], answer: 0 });
  add({ type: 'mcq', text: 'أيّ جهاز يوزّع الإنترنت على أجهزة البيت؟', options: [N('router'), N('usb'), N('webcam'), N('psu')], answer: 0 });
  add({ type: 'mcq', text: 'أيّ هذه الأجهزة جهاز إدخال؟', options: [N('microphone'), N('printer'), N('speaker'), N('monitor')], answer: 0 });

  // ---------- 2) صح أم خطأ ----------
  [
    ['الفأرة جهاز إدخال.', true],
    ['الطابعة جهاز إدخال.', false],
    ['الشاشة جهاز إخراج.', true],
    ['المعالج هو «عقل» الحاسوب الذي ينفّذ العمليات.', true],
    ['تُمحى محتويات الذاكرة RAM عند إطفاء الحاسوب.', true],
    ['قرص SSD أبطأ عادةً من القرص الصلب HDD.', false],
    ['الميكروفون جهاز إخراج للصوت.', false],
    ['الموجّه Router يوزّع الإنترنت على الأجهزة.', true],
    ['الفلاشة تحتفظ بالملفات حتى بعد نزعها من الحاسوب.', true],
    ['لوحة المفاتيح جهاز إخراج.', false],
    ['مزوّد الطاقة يغذّي مكوّنات الحاسوب بالكهرباء.', true],
    ['الماسح الضوئي يحوّل الورقة إلى صورة على الحاسوب.', true]
  ].forEach(function (r) { add({ type: 'tf', text: r[0], answer: r[1] }); });

  // ---------- 3) تحدي النقر ----------
  [5, 6, 8, 10].forEach(function (c) {
    add({ type: 'click', text: '{CLICK} على كل الأهداف بأسرع ما يمكن (' + c + ' أهداف)', count: c });
  });

  // ---------- 4) تحدي النقر المزدوج ----------
  [1, 3, 5].forEach(function (c) {
    add({ type: 'dblclick', text: c === 1 ? 'افتح الصندوق: {DBL} سريعتين' : 'افتح الصناديق ال' + c + ': {DBL} سريعتين على كل صندوق', count: c });
  });

  // ---------- 5) السحب والإفلات ----------
  [
    ['mouse', 'keyboard', 'monitor'],
    ['printer', 'scanner', 'webcam'],
    ['cpu', 'ram', 'hdd', 'gpu'],
    ['usb', 'router', 'headphones', 'psu']
  ].forEach(function (items) {
    add({ type: 'drag', text: 'اسحب كل صورة إلى اسمها', items: items });
  });

  // ---------- 6) الزر الأيمن ----------
  var FILE_MENU = ['فتح', 'نسخ', 'قص', 'إعادة تسمية', 'حذف', 'خصائص'];
  add({ type: 'rightclick', text: '{RC} على المجلد ثم اختر «إعادة تسمية»', target: 'folder', options: FILE_MENU, answer: 3 });
  add({ type: 'rightclick', text: '{RC} على الملف ثم اختر «حذف»', target: 'file', options: FILE_MENU, answer: 4 });
  add({ type: 'rightclick', text: '{RC} على الصورة ثم اختر «نسخ»', target: 'image', options: FILE_MENU, answer: 1 });
  add({ type: 'rightclick', text: '{RC} على سلة المحذوفات ثم اختر «إفراغ سلة المحذوفات»', target: 'trash', options: ['فتح', 'إفراغ سلة المحذوفات', 'إنشاء اختصار', 'خصائص'], answer: 1 });

  // ---------- 7) سباق الكتابة ----------
  ['الحاسوب', 'لوحة المفاتيح', 'الفأرة اللاسلكية', 'أحب تعلم الحاسوب', 'الشاشة جهاز إخراج', 'المعالج عقل الحاسوب'].forEach(function (p) {
    add({ type: 'typing', text: 'اكتب بسرعة وبدون أخطاء:', phrase: p });
  });

  window.LR_BANK = B;
})();
