// ============================================================
// parts-svg.js — رسومات قطع الحاسوب (SVG مسطّح بأسلوب موحّد)
// كل رسمة داخل viewBox 0 0 120 120 مع ظل أرضي، ونفس لوحة الألوان.
// لا تحتوي الرسومات على أي نص حتى لا تكشف الإجابة.
// ============================================================
(function () {
  var D = '#2E3B4E', D2 = '#1B2433', M = '#516378', L = '#EEF3F8', L2 = '#C3D0DD',
      B = '#3B82F6', B2 = '#7DB3FF', SCR = '#1F4FBF', G = '#22B07D', G2 = '#0F5A43', Y = '#F2B640', R = '#EF4444';

  function shadow(rx) { return '<ellipse cx="60" cy="109" rx="' + (rx || 40) + '" ry="5" fill="#000" opacity=".22"/>'; }
  function shine(x, y, w, h, r) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (r || 0) + '" fill="#fff" opacity=".08"/>'; }
  function keys(x0, y0, cols, rows, kw, kh, gap, color) {
    var s = '';
    for (var r = 0; r < rows; r++)
      for (var c = 0; c < cols; c++)
        s += '<rect x="' + (x0 + c * (kw + gap)) + '" y="' + (y0 + r * (kh + gap)) + '" width="' + kw + '" height="' + kh + '" rx="1.4" fill="' + color + '"/>';
    return s;
  }
  function pins(x0, y, n, step, w, h, color, skip) {
    var s = '';
    for (var i = 0; i < n; i++) { if (skip && skip.indexOf(i) >= 0) continue; s += '<rect x="' + (x0 + i * step) + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + color + '"/>'; }
    return s;
  }
  function fan(cx, cy, r) {
    var s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + D2 + '"/>';
    for (var i = 0; i < 5; i++) {
      var a = i * 72;
      s += '<path transform="rotate(' + a + ' ' + cx + ' ' + cy + ')" d="M' + cx + ' ' + cy + ' q' + (r * 0.15) + ' ' + (-r * 0.85) + ' ' + (r * 0.6) + ' ' + (-r * 0.75) + ' q' + (-r * 0.05) + ' ' + (r * 0.45) + ' ' + (-r * 0.6) + ' ' + (r * 0.75) + 'z" fill="' + M + '"/>';
    }
    return s + '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.22) + '" fill="' + L2 + '"/>';
  }

  var ART = {
    monitor: shadow(34) +
      '<rect x="12" y="14" width="96" height="66" rx="6" fill="' + D + '"/>' +
      '<rect x="18" y="20" width="84" height="53" rx="2" fill="' + SCR + '"/>' +
      '<path d="M18 20h52L42 73H18z" fill="#fff" opacity=".1"/>' +
      '<circle cx="60" cy="76.5" r="1.6" fill="' + B2 + '"/>' +
      '<path d="M52 80h16l3 15H49z" fill="' + M + '"/>' +
      '<rect x="34" y="94" width="52" height="8" rx="4" fill="' + D + '"/>',

    case: shadow(30) +
      '<rect x="33" y="8" width="54" height="98" rx="6" fill="' + D + '"/>' + shine(33, 8, 10, 98, 6) +
      '<rect x="40" y="17" width="40" height="9" rx="2" fill="' + M + '"/><rect x="66" y="20.5" width="10" height="2" rx="1" fill="' + D2 + '"/>' +
      '<rect x="40" y="30" width="40" height="9" rx="2" fill="' + M + '"/>' +
      '<circle cx="60" cy="56" r="7" fill="' + M + '"/><circle cx="60" cy="56" r="3.2" fill="none" stroke="' + B2 + '" stroke-width="1.8"/><path d="M60 51.5v4" stroke="' + B2 + '" stroke-width="1.8" stroke-linecap="round"/>' +
      '<rect x="44" y="72" width="32" height="2.6" rx="1.3" fill="' + M + '"/><rect x="44" y="78" width="32" height="2.6" rx="1.3" fill="' + M + '"/><rect x="44" y="84" width="32" height="2.6" rx="1.3" fill="' + M + '"/><rect x="44" y="90" width="32" height="2.6" rx="1.3" fill="' + M + '"/>',

    keyboard: shadow(50) +
      '<rect x="6" y="38" width="108" height="50" rx="7" fill="' + D + '"/>' + shine(6, 38, 108, 8, 7) +
      keys(12, 45, 11, 3, 7.4, 8, 1.9, L2) +
      '<rect x="12" y="75.6" width="14" height="7" rx="1.4" fill="' + L2 + '"/><rect x="28" y="75.6" width="62" height="7" rx="1.4" fill="' + L2 + '"/><rect x="92" y="75.6" width="16" height="7" rx="1.4" fill="' + L2 + '"/>' +
      '<rect x="31.2" y="54.4" width="7.4" height="8" rx="1.4" fill="' + B2 + '"/>',

    mouse: shadow(26) +
      '<path d="M60 22c0-9 8-14 18-16" stroke="' + M + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
      '<rect x="36" y="22" width="48" height="80" rx="24" fill="' + L + '"/>' +
      '<path d="M36 52h48" stroke="' + L2 + '" stroke-width="2"/><path d="M60 22v30" stroke="' + L2 + '" stroke-width="2"/>' +
      '<rect x="56.5" y="30" width="7" height="14" rx="3.5" fill="' + M + '"/>' +
      '<path d="M38 70a22 22 0 0 0 44 0v8a22 22 0 0 1-44 0z" fill="' + L2 + '" opacity=".6"/>',

    printer: shadow(46) +
      '<rect x="32" y="10" width="56" height="30" fill="' + L + '"/><path d="M38 18h40M38 24h32" stroke="' + L2 + '" stroke-width="2"/>' +
      '<rect x="12" y="34" width="96" height="42" rx="7" fill="' + D + '"/>' + shine(12, 34, 96, 9, 7) +
      '<rect x="20" y="64" width="80" height="6" rx="3" fill="' + D2 + '"/>' +
      '<circle cx="94" cy="46" r="3.2" fill="' + G + '"/><rect x="72" y="44" width="14" height="4" rx="2" fill="' + M + '"/>' +
      '<path d="M26 76h68l4 22H22z" fill="' + M + '"/>' +
      '<rect x="32" y="67" width="56" height="27" fill="#fff"/><path d="M38 75h44M38 81h36M38 87h40" stroke="' + L2 + '" stroke-width="2"/>',

    scanner: shadow(48) +
      '<path d="M14 58L26 22h80l2 36z" fill="' + M + '"/><path d="M26 22h80l1 8H24z" fill="#fff" opacity=".1"/>' +
      '<rect x="10" y="56" width="100" height="34" rx="6" fill="' + D + '"/>' +
      '<rect x="16" y="60" width="88" height="10" rx="2" fill="' + D2 + '"/>' +
      '<rect x="18" y="62" width="84" height="5" rx="2" fill="' + B2 + '"/><rect x="18" y="62" width="84" height="5" rx="2" fill="#fff" opacity=".35"/>' +
      '<rect x="18" y="78" width="22" height="4" rx="2" fill="' + M + '"/><circle cx="100" cy="80" r="3.2" fill="' + G + '"/>',

    speaker: shadow(30) +
      '<rect x="34" y="8" width="52" height="96" rx="7" fill="' + D + '"/>' + shine(34, 8, 10, 96, 7) +
      '<circle cx="60" cy="33" r="12" fill="' + M + '"/><circle cx="60" cy="33" r="6" fill="' + D2 + '"/>' +
      '<circle cx="60" cy="72" r="20" fill="' + M + '"/><circle cx="60" cy="72" r="13" fill="' + D2 + '"/><circle cx="60" cy="72" r="5" fill="' + M + '"/>',

    headphones: shadow(38) +
      '<path d="M24 70V56a36 36 0 0 1 72 0v14" stroke="' + D + '" stroke-width="8" fill="none" stroke-linecap="round"/>' +
      '<path d="M30 52a30 30 0 0 1 60 0" stroke="' + M + '" stroke-width="2" fill="none" opacity=".7"/>' +
      '<rect x="12" y="60" width="24" height="40" rx="11" fill="' + D + '"/><rect x="84" y="60" width="24" height="40" rx="11" fill="' + D + '"/>' +
      '<rect x="30" y="65" width="10" height="30" rx="5" fill="' + M + '"/><rect x="80" y="65" width="10" height="30" rx="5" fill="' + M + '"/>' +
      '<rect x="17" y="70" width="4" height="20" rx="2" fill="' + B + '"/><rect x="99" y="70" width="4" height="20" rx="2" fill="' + B + '"/>',

    microphone: shadow(26) +
      '<rect x="45" y="8" width="30" height="52" rx="15" fill="' + M + '"/>' +
      '<path d="M48 24h24M47 32h26M47 40h26M48 48h24" stroke="' + D2 + '" stroke-width="2.2" stroke-linecap="round"/>' + shine(45, 8, 9, 52, 15) +
      '<path d="M36 44a24 24 0 0 0 48 0" stroke="' + D + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<rect x="57.5" y="68" width="5" height="24" fill="' + D + '"/>' +
      '<rect x="38" y="92" width="44" height="9" rx="4.5" fill="' + D + '"/>',

    webcam: shadow(30) +
      '<circle cx="60" cy="46" r="32" fill="' + D + '"/><circle cx="60" cy="46" r="32" fill="#fff" opacity=".04"/>' +
      '<circle cx="60" cy="46" r="19" fill="' + D2 + '"/><circle cx="60" cy="46" r="12.5" fill="' + SCR + '"/><circle cx="60" cy="46" r="6" fill="' + D2 + '"/>' +
      '<circle cx="54" cy="40" r="4" fill="#fff" opacity=".55"/>' +
      '<circle cx="83" cy="28" r="2.8" fill="' + G + '"/>' +
      '<path d="M52 77h16l6 16H46z" fill="' + M + '"/>' +
      '<rect x="36" y="92" width="48" height="8" rx="4" fill="' + D + '"/>',

    usb: shadow(22) +
      '<rect x="47" y="10" width="26" height="28" rx="2" fill="' + L2 + '"/><rect x="47" y="10" width="26" height="6" rx="2" fill="#fff" opacity=".35"/>' +
      '<rect x="52" y="20" width="6" height="6" fill="' + M + '"/><rect x="62" y="20" width="6" height="6" fill="' + M + '"/>' +
      '<rect x="41" y="36" width="38" height="66" rx="9" fill="' + B + '"/>' + shine(41, 36, 12, 66, 9) +
      '<rect x="41" y="36" width="38" height="12" fill="#1D4ED8"/>' +
      '<circle cx="60" cy="90" r="4.5" fill="' + D2 + '" opacity=".55"/>',

    motherboard: shadow(46) +
      '<rect x="12" y="12" width="96" height="94" rx="4" fill="' + G2 + '"/>' +
      '<path d="M20 64h28v-20M86 66v10h-16M48 96h40" stroke="' + G + '" stroke-width="1.6" fill="none" opacity=".7"/>' +
      '<rect x="18" y="18" width="13" height="38" rx="1.5" fill="' + M + '"/>' +
      '<rect x="44" y="20" width="32" height="32" rx="2" fill="' + L2 + '"/><rect x="51" y="27" width="18" height="18" rx="1" fill="' + M + '"/>' +
      '<rect x="86" y="18" width="5" height="44" fill="' + D2 + '"/><rect x="95" y="18" width="5" height="44" fill="' + D2 + '"/>' +
      '<rect x="20" y="72" width="58" height="5" fill="' + D2 + '"/><rect x="20" y="84" width="58" height="5" fill="' + D2 + '"/>' +
      '<rect x="84" y="76" width="16" height="16" rx="1" fill="' + D + '"/>' +
      '<circle cx="38" cy="62" r="2.8" fill="' + L2 + '"/><circle cx="80" cy="60" r="2.8" fill="' + L2 + '"/><circle cx="38" cy="98" r="2.8" fill="' + L2 + '"/>' +
      '<rect x="22" y="94" width="10" height="6" fill="' + Y + '"/>',

    cpu: shadow(40) +
      '<rect x="20" y="18" width="80" height="80" rx="4" fill="' + G2 + '"/>' +
      pins(26, 14, 12, 6.2, 3, 4, Y) + pins(26, 98, 12, 6.2, 3, 4, Y) +
      '<g transform="rotate(90 60 58)">' + pins(26, 14, 12, 6.2, 3, 4, Y) + pins(26, 98, 12, 6.2, 3, 4, Y) + '</g>' +
      '<rect x="31" y="29" width="58" height="58" rx="5" fill="' + L2 + '"/><rect x="31" y="29" width="58" height="14" rx="5" fill="#fff" opacity=".35"/>' +
      '<path d="M24 22l7 0-7 7z" fill="' + Y + '"/>' +
      '<rect x="44" y="64" width="32" height="3" rx="1.5" fill="' + M + '" opacity=".5"/><rect x="48" y="71" width="24" height="3" rx="1.5" fill="' + M + '" opacity=".4"/>',

    ram: shadow(50) +
      '<rect x="6" y="38" width="108" height="36" rx="2" fill="' + G + '"/><rect x="6" y="38" width="108" height="6" fill="#fff" opacity=".15"/>' +
      '<rect x="12" y="46" width="13" height="18" rx="1" fill="' + D2 + '"/><rect x="29" y="46" width="13" height="18" rx="1" fill="' + D2 + '"/><rect x="46" y="46" width="13" height="18" rx="1" fill="' + D2 + '"/>' +
      '<rect x="63" y="46" width="13" height="18" rx="1" fill="' + D2 + '"/><rect x="80" y="46" width="13" height="18" rx="1" fill="' + D2 + '"/><rect x="97" y="46" width="13" height="18" rx="1" fill="' + D2 + '"/>' +
      pins(9, 74, 26, 4, 2.4, 7, Y, [15]) +
      '<rect x="4" y="52" width="4" height="8" fill="#0B0F17"/><rect x="112" y="52" width="4" height="8" fill="#0B0F17"/>',

    hdd: shadow(40) +
      '<rect x="20" y="8" width="80" height="100" rx="6" fill="' + L2 + '"/>' + shine(20, 8, 80, 12, 6) +
      '<circle cx="60" cy="48" r="32" fill="' + L + '"/><circle cx="60" cy="48" r="32" fill="none" stroke="' + M + '" stroke-width="1.2" opacity=".35"/>' +
      '<circle cx="60" cy="48" r="22" fill="none" stroke="' + M + '" stroke-width="1" opacity=".2"/>' +
      '<circle cx="60" cy="48" r="7" fill="' + M + '"/><circle cx="60" cy="48" r="2.5" fill="' + L + '"/>' +
      '<path d="M86 94L64 58" stroke="' + D + '" stroke-width="5.5" stroke-linecap="round"/><circle cx="86" cy="94" r="7" fill="' + D + '"/>' +
      '<circle cx="27" cy="15" r="2.2" fill="' + M + '"/><circle cx="93" cy="15" r="2.2" fill="' + M + '"/><circle cx="27" cy="101" r="2.2" fill="' + M + '"/>' +
      '<rect x="28" y="88" width="34" height="12" rx="2" fill="' + D2 + '" opacity=".8"/>',

    ssd: shadow(44) +
      '<rect x="14" y="22" width="92" height="70" rx="7" fill="' + D + '"/>' + shine(14, 22, 92, 10, 7) +
      '<rect x="22" y="32" width="76" height="40" rx="3" fill="' + B + '"/>' +
      '<path d="M64 38l-12 16h9l-4 13 13-18h-9z" fill="#fff" opacity=".9"/>' +
      '<rect x="28" y="40" width="20" height="4" rx="2" fill="#fff" opacity=".6"/><rect x="28" y="60" width="20" height="4" rx="2" fill="#fff" opacity=".4"/>' +
      '<rect x="28" y="80" width="30" height="7" rx="1" fill="' + D2 + '"/>' + pins(30, 82, 7, 4, 2, 3, Y) +
      '<rect x="64" y="80" width="18" height="7" rx="1" fill="' + D2 + '"/>',

    psu: shadow(46) +
      '<path d="M80 92c0 8 6 10 14 12M86 92c0 6 8 8 18 8M74 92c0 9 4 12 10 14" stroke="' + Y + '" stroke-width="2.6" fill="none"/>' +
      '<path d="M83 92c2 7 10 8 16 6" stroke="' + R + '" stroke-width="2.6" fill="none"/>' +
      '<rect x="12" y="22" width="96" height="72" rx="5" fill="' + M + '"/>' + shine(12, 22, 96, 10, 5) +
      '<circle cx="48" cy="58" r="27" fill="' + D + '"/>' + fan(48, 58, 22) +
      '<circle cx="48" cy="58" r="22" fill="none" stroke="' + L2 + '" stroke-width="1.4" opacity=".5"/><path d="M26 58h44M48 36v44" stroke="' + L2 + '" stroke-width="1.2" opacity=".45"/>' +
      '<rect x="84" y="32" width="16" height="20" rx="2" fill="' + D + '"/><rect x="88" y="37" width="3" height="10" fill="' + L2 + '"/><rect x="93" y="37" width="3" height="10" fill="' + L2 + '"/>' +
      '<rect x="86" y="60" width="12" height="10" rx="1.5" fill="' + R + '"/>',

    gpu: shadow(50) +
      '<rect x="4" y="28" width="6" height="58" rx="1" fill="' + L2 + '"/>' +
      '<rect x="10" y="32" width="104" height="48" rx="6" fill="' + D + '"/>' + shine(10, 32, 104, 8, 6) +
      fan(38, 56, 17) + fan(84, 56, 17) +
      '<rect x="60" y="34" width="2" height="44" fill="' + B + '" opacity=".8"/>' +
      '<rect x="22" y="80" width="68" height="8" fill="' + G2 + '"/>' + pins(24, 81, 16, 4.1, 2.4, 7, Y, [4]),

    laptop: shadow(52) +
      '<rect x="22" y="16" width="76" height="54" rx="5" fill="' + D + '"/>' +
      '<rect x="27" y="21" width="66" height="44" rx="1.5" fill="' + SCR + '"/><path d="M27 21h42L46 65H27z" fill="#fff" opacity=".1"/>' +
      '<path d="M14 70h92l8 18H6z" fill="' + L2 + '"/>' +
      '<path d="M24 73h72l3 6H21z" fill="' + M + '" opacity=".45"/>' +
      '<rect x="50" y="81" width="20" height="4" rx="2" fill="' + M + '" opacity=".6"/>' +
      '<rect x="6" y="88" width="108" height="6" rx="3" fill="' + M + '"/>',

    router: shadow(48) +
      '<rect x="27" y="18" width="6" height="50" rx="3" fill="' + M + '" transform="rotate(-14 30 66)"/>' +
      '<rect x="87" y="18" width="6" height="50" rx="3" fill="' + M + '" transform="rotate(14 90 66)"/>' +
      '<path d="M48 34a17 17 0 0 1 24 0M53 40a10 10 0 0 1 14 0" stroke="' + B2 + '" stroke-width="3.2" fill="none" stroke-linecap="round"/><circle cx="60" cy="46" r="2.8" fill="' + B2 + '"/>' +
      '<rect x="12" y="62" width="96" height="30" rx="9" fill="' + D + '"/>' + shine(12, 62, 96, 8, 9) +
      '<circle cx="32" cy="78" r="2.8" fill="' + G + '"/><circle cx="44" cy="78" r="2.8" fill="' + G + '"/><circle cx="56" cy="78" r="2.8" fill="' + B2 + '"/><circle cx="68" cy="78" r="2.8" fill="' + B2 + '"/>' +
      '<rect x="80" y="75" width="18" height="6" rx="3" fill="' + M + '"/>'
  };

  // أهداف تحدي الزر الأيمن (ليست قطعاً)
  var OBJ = {
    file: '<path d="M30 10h42l22 22v72a6 6 0 0 1-6 6H30a6 6 0 0 1-6-6V16a6 6 0 0 1 6-6z" fill="' + L + '"/><path d="M72 10v16a6 6 0 0 0 6 6h16z" fill="' + L2 + '"/>' +
      '<path d="M38 52h44M38 62h44M38 72h34M38 82h40" stroke="' + B + '" stroke-width="4" stroke-linecap="round" opacity=".7"/>',
    folder: '<path d="M10 30a6 6 0 0 1 6-6h28l10 10h50a6 6 0 0 1 6 6v54a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6z" fill="#E0A82E"/>' +
      '<path d="M10 44a6 6 0 0 1 6-6h88a6 6 0 0 1 6 6v50a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6z" fill="' + Y + '"/><rect x="10" y="38" width="100" height="8" fill="#fff" opacity=".15"/>',
    image: '<rect x="12" y="18" width="96" height="84" rx="8" fill="' + L + '"/><rect x="20" y="26" width="80" height="60" rx="3" fill="' + B2 + '"/>' +
      '<circle cx="80" cy="42" r="8" fill="' + Y + '"/><path d="M20 86l24-28 18 20 12-12 26 20z" fill="' + G + '"/>',
    trash: '<rect x="30" y="30" width="60" height="74" rx="6" fill="' + L2 + '"/><rect x="24" y="22" width="72" height="10" rx="4" fill="' + M + '"/><rect x="48" y="14" width="24" height="10" rx="3" fill="' + M + '"/>' +
      '<path d="M46 44v48M60 44v48M74 44v48" stroke="' + M + '" stroke-width="4" stroke-linecap="round"/>'
  };

  var NAMES = {
    monitor: 'الشاشة', case: 'الوحدة المركزية', keyboard: 'لوحة المفاتيح', mouse: 'الفأرة',
    printer: 'الطابعة', scanner: 'الماسح الضوئي', speaker: 'مكبّر الصوت', headphones: 'السماعة',
    microphone: 'الميكروفون', webcam: 'الكاميرا', usb: 'الفلاشة', motherboard: 'اللوحة الأم',
    cpu: 'المعالج', ram: 'الذاكرة RAM', hdd: 'القرص الصلب HDD', ssd: 'قرص SSD',
    psu: 'مزوّد الطاقة', gpu: 'بطاقة الشاشة', laptop: 'الحاسوب المحمول', router: 'الموجّه Router'
  };

  function wrap(inner) {
    return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + inner + '</svg>';
  }

  window.LR_PARTS = {
    ids: Object.keys(ART),
    names: NAMES,
    svg: function (id) { return ART[id] ? wrap(ART[id]) : ''; },
    obj: function (id) { return OBJ[id] ? wrap(OBJ[id]) : ''; }
  };
})();
