// ============================================================
// designs.js — the 10 QR designs of the QR Code tool.
//   QRDesigns.list                         → [{ id, premium, name: {ar,en,fr} }]
//   QRDesigns.render(id, text, opts)       → Promise<{ svg, w, h }>
//        opts.branded  : true = free version of a Premium design: the site (merabti.com) is added to the contact data
//                        inside the code (a website line of the vCard), nothing is printed on the frame
//        opts.logo     : Premium only — { type: 'text', text } (1–2 letters) or { type: 'image', src: dataURL }
//   QRDesigns.toPngBlob(svg, w, h, scale)  → Promise<Blob>
//
// The code itself is drawn by qr-code-styling (vendor/, v1.9.2), always with error correction "H";
// each design adds its frame around it in one SVG (frame, light plate behind the code, text, logo).
// Rules that keep every design scannable (checked with jsQR, see the commit notes):
//   - the code always sits on a LIGHT plate with a clear margin (quiet zone), never on the dark frame;
//   - dark modules stay dark (luminance well below the plate), gradients only between dark tones;
//   - the centre logo hides whole modules (library's hideBackgroundDots) and stays small (H = 30 % recovery).
// The frame text uses system fonts only (an SVG drawn as an image cannot load web fonts):
// what the preview shows is exactly what the PNG / SVG files contain.
// ============================================================
(function () {
  "use strict";

  const Q = 1000;   // the library draws the code on a 1000 × 1000 box, scaled into each frame

  const SANS = "Inter, 'Helvetica Neue', 'Segoe UI', Roboto, Arial, sans-serif";
  const SERIF = "'Playfair Display', Didot, 'Bodoni 72', Georgia, 'Times New Roman', serif";
  const AR = "Tajawal, 'Geeza Pro', 'Segoe UI', 'Noto Sans Arabic', Tahoma, Arial, sans-serif";
  const SITE_URL = 'https://merabti.com';

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const isAr = (s) => /[؀-ۿ]/.test(s);
  const r2 = (n) => Math.round(n * 100) / 100;

  /* one line of text; Arabic gets its own font stack and is never letter-spaced */
  function text(x, y, str, o) {
    o = o || {};
    const ar = isAr(str);
    const fam = ar ? AR : (o.family || SANS);
    const ls = ar ? 0 : (o.ls || 0);
    return `<text x="${x}" y="${y}" text-anchor="middle" font-family="${esc(fam)}" font-size="${o.size || 24}"` +
      ` font-weight="${ar ? Math.max(700, o.weight || 700) : (o.weight || 700)}"` +
      (o.italic && !ar ? ' font-style="italic"' : '') +
      (ls ? ` letter-spacing="${ls}"` : '') +
      (ar ? ' direction="rtl"' : '') +
      ` fill="${o.fill || '#000'}"` + (o.opacity != null ? ` fill-opacity="${o.opacity}"` : '') +
      (o.filter ? ` filter="${o.filter}"` : '') + `>${esc(str)}</text>`;
  }

  const lin = (id, stops, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 == null ? 0 : x1}" y1="${y1 == null ? 0 : y1}" x2="${x2 == null ? 1 : x2}" y2="${y2 == null ? 1 : y2}">` +
    stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ''}/>`).join('') + '</linearGradient>';
  const rad = (id, stops, cx, cy, r) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">` +
    stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ''}/>`).join('') + '</radialGradient>';
  const linU = (id, stops, x1, x2) => `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="0" x2="${x2}" y2="0">` +
    stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('') + '</linearGradient>';
  const grad = (type, stops, rotation) => ({ type, rotation: rotation || 0, colorStops: stops.map(([offset, color]) => ({ offset, color })) });

  const diamond = (cx, cy, r, fill, stroke, sw) => `<path d="M${cx} ${cy - r}L${cx + r} ${cy}L${cx} ${cy + r}L${cx - r} ${cy}Z" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw || 1.5}"` : ''}/>`;

  /* leaf = square with two big round corners (top-left / bottom-right) and two small ones */
  function leaf(x, y, s, R, r) {
    return `M${r2(x + R)} ${r2(y)}H${r2(x + s - r)}A${r2(r)} ${r2(r)} 0 0 1 ${r2(x + s)} ${r2(y + r)}V${r2(y + s - R)}` +
      `A${r2(R)} ${r2(R)} 0 0 1 ${r2(x + s - R)} ${r2(y + s)}H${r2(x + r)}A${r2(r)} ${r2(r)} 0 0 1 ${r2(x)} ${r2(y + s - r)}` +
      `V${r2(y + R)}A${r2(R)} ${r2(R)} 0 0 1 ${r2(x + R)} ${r2(y)}Z`;
  }

  /* wave band: from y0 to the bottom of the frame */
  function wave(W, H, y0, amp, len, phase) {
    const n = Math.ceil(W / len) + 1;
    let x = -phase;
    let d = `M${-phase} ${H}V${y0}`;
    for (let i = 0; i < n; i++) {
      d += `Q${r2(x + len / 4)} ${r2(y0 - amp)} ${r2(x + len / 2)} ${y0}T${r2(x + len)} ${y0}`;
      x += len;
    }
    return d + `V${H}Z`;
  }

  /* ---------------- centre logos (viewBox 0 0 100 100, ids prefixed per design) ---------------- */
  const LOGOS = {
    violet: `<defs>${lin('lgv', [[0, '#0C447C'], [1, '#7F77DD']])}</defs><circle cx="50" cy="50" r="50" fill="#fff"/>` +
      `<circle cx="50" cy="50" r="43" fill="url(#lgv)"/><circle cx="50" cy="50" r="38" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.5"/>` +
      `<path d="M31 66V35l19 22 19-22v31" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`,
    rose: `<defs>${lin('lgr', [[0, '#E0457B'], [1, '#8B5CF6']])}</defs><circle cx="50" cy="50" r="50" fill="#fff"/>` +
      `<circle cx="50" cy="50" r="43" fill="#FFF1F6" stroke="#F3C4D8" stroke-width="2"/>` +
      `<path d="M50 74C30 60 25 50 25 41c0-8 6-14 13-14 5 0 9 3 12 7 3-4 7-7 12-7 7 0 13 6 13 14 0 9-5 19-25 33z" fill="url(#lgr)"/>`,
    islamic: `<defs>${lin('lgi', [[0, '#8C6A1C'], [0.5, '#D9B65E'], [1, '#8C6A1C']])}</defs><circle cx="50" cy="50" r="50" fill="#FFFDF4"/>` +
      `<circle cx="50" cy="50" r="44" fill="none" stroke="url(#lgi)" stroke-width="3"/>` +
      `<rect x="27" y="27" width="46" height="46" fill="url(#lgi)"/><rect x="27" y="27" width="46" height="46" fill="url(#lgi)" transform="rotate(45 50 50)"/>` +
      `<circle cx="50" cy="50" r="12" fill="#0E5A3A"/>`,
  };
  /* the visitor's own logo (Premium designs): one or two letters on the design's accent, or an image */
  function customLogo(logo, accent) {
    if (logo.type === 'image') {
      return `<rect width="100" height="100" rx="24" fill="#fff"/>` +
        `<image href="${logo.src}" xlink:href="${logo.src}" x="9" y="9" width="82" height="82" preserveAspectRatio="xMidYMid meet"/>`;
    }
    const t = String(logo.text || '').trim().slice(0, 2);
    const ar = isAr(t);
    const size = [...t].length > 1 ? 40 : 54;
    return `<circle cx="50" cy="50" r="50" fill="#fff"/><circle cx="50" cy="50" r="43" fill="${accent}"/>` +
      `<text x="50" y="50" dy="${ar ? '0.1em' : '0.35em'}" text-anchor="middle" font-family="${esc(ar ? AR : SANS)}" font-size="${size}" font-weight="800" fill="#fff"` +
      (ar ? ' direction="rtl"' : '') + `>${esc(t)}</text>`;
  }
  /* what the library measures to clear the centre (square): the real logo replaces its <image> */
  const LOGO_PROBE = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#fff"/></svg>');

  /* ---------------- the 10 designs ----------------
     w, h      frame size (SVG units)
     qr        where the code goes (x, y, size)
     accent    colour of the visitor's letter logo
     lib       qr-code-styling options (dots / corners); background is always transparent: the plate is in the frame
     finder    optional custom finder patterns (drawn on top, the library's are made transparent)
     frame()   → { defs, under, over } */
  const dots3 = (y, fill, gap) => [-1, 0, 1].map((k) => `<circle cx="${300 + k * (gap || 15)}" cy="${y}" r="3.5" fill="${fill}"/>`).join('');
  const DESIGNS = [
    {
      id: 'classic', premium: false,
      name: { ar: 'كلاسيكي', en: 'Classic', fr: 'Classique' },
      w: 560, h: 560, qr: { x: 60, y: 60, size: 440 }, crisp: true,
      lib: { dotsOptions: { type: 'square', color: '#1E2F40' }, cornersSquareOptions: { type: 'square', color: '#1E2F40' }, cornersDotOptions: { type: 'square', color: '#1E2F40' } },
      frame: () => ({ under: '<rect width="560" height="560" rx="48" fill="#fff"/>' }),
    },

    {
      id: 'violet', premium: true, accent: '#3C3489',
      name: { ar: 'بنفسجي أنيق', en: 'Elegant violet', fr: 'Violet élégant' },
      w: 600, h: 660, qr: { x: 76, y: 76, size: 448 }, logo: 'violet', logoSize: 0.3,
      lib: {
        dotsOptions: { type: 'rounded', gradient: grad('linear', [[0, '#0C447C'], [1, '#7F77DD']], Math.PI / 4) },
        cornersSquareOptions: { type: 'extra-rounded', color: '#D4537E' },
        cornersDotOptions: { type: 'dot', color: '#3C3489' },
      },
      frame() {
        return {
          under: `<rect width="600" height="660" rx="56" fill="#2E3488"/>` +
            `<rect x="14" y="14" width="572" height="632" rx="44" fill="none" stroke="#7F77DD" stroke-width="1.5" stroke-opacity=".7"/>` +
            `<rect x="36" y="36" width="528" height="528" rx="42" fill="#fff"/>`,
          over: dots3(612, '#D4537E'),
        };
      },
    },

    {
      id: 'ticket', premium: true, accent: '#993C1D',
      name: { ar: 'تذكرة الغروب', en: 'Sunset ticket', fr: 'Ticket coucher de soleil' },
      w: 600, h: 820, qr: { x: 84, y: 186, size: 432 },
      lib: {
        dotsOptions: { type: 'classy-rounded', gradient: grad('radial', [[0, '#993C1D'], [0.55, '#D85A30'], [1, '#854F0B']]) },
        cornersSquareOptions: { type: 'classy-rounded', color: '#7A2E12' },
        cornersDotOptions: { type: 'rounded', color: '#9C3A1A' },
      },
      frame() {
        return {
          defs: lin('tbh', [[0, '#4A2412'], [1, '#2B140A']], 0, 0, 0, 1) + lin('tsun', [[0, '#F7B27A'], [1, '#D85A30']], 0, 0, 0, 1) +
            `<mask id="tmask"><rect width="600" height="820" fill="#fff"/><circle cx="0" cy="652" r="24" fill="#000"/><circle cx="600" cy="652" r="24" fill="#000"/>` +
            `<circle cx="0" cy="150" r="16" fill="#000"/><circle cx="600" cy="150" r="16" fill="#000"/></mask>`,
          under: `<g mask="url(#tmask)"><rect width="600" height="820" rx="34" fill="#FFF6EC"/>` +
            `<path d="M34 0H566A34 34 0 0 1 600 34V150H0V34A34 34 0 0 1 34 0Z" fill="url(#tbh)"/>` +
            `<path d="M0 652H600V786A34 34 0 0 1 566 820H34A34 34 0 0 1 0 786Z" fill="url(#tbh)"/></g>` +
            `<path d="M232 150A68 68 0 0 1 368 150Z" fill="url(#tsun)" fill-opacity=".92"/>` +
            `<g stroke="#F7B27A" stroke-opacity=".6" stroke-width="2.5" stroke-linecap="round"><path d="M300 62V46M252 80l-10-10M348 80l10-10M220 112h-14M380 112h14"/></g>` +
            `<line x1="30" y1="168" x2="30" y2="634" stroke="#D85A30" stroke-width="3" stroke-dasharray="12 10" stroke-linecap="round" stroke-opacity=".8"/>` +
            `<line x1="570" y1="168" x2="570" y2="634" stroke="#D85A30" stroke-width="3" stroke-dasharray="12 10" stroke-linecap="round" stroke-opacity=".8"/>` +
            `<line x1="40" y1="652" x2="560" y2="652" stroke="#D85A30" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"/>`,
          over: dots3(736, '#D85A30', 30),
        };
      },
    },

    {
      id: 'gold', premium: true, accent: '#6B4E12',
      name: { ar: 'ذهبي فاخر', en: 'Luxury gold', fr: 'Or de luxe' },
      w: 600, h: 700, qr: { x: 100, y: 110, size: 400 },
      lib: {
        dotsOptions: { type: 'classy', gradient: grad('linear', [[0, '#5C430E'], [0.5, '#93701F'], [1, '#5A410C']], Math.PI / 4) },
        cornersSquareOptions: { type: 'rounded', color: '#4D380A' },
        cornersDotOptions: { type: 'square', color: '#5C430E' },
      },
      frame() {
        const oy = 620;
        return {
          defs: rad('gbg', [[0, '#26225E'], [0.55, '#151340'], [1, '#090820']], 0.5, 0.32, 0.85) +
            lin('gold', [[0, '#8C6A1C'], [0.25, '#E9CB7A'], [0.5, '#B8912F'], [0.75, '#F6E2A1'], [1, '#94701F']]) +
            linU('goldl', [[0, '#8C6A1C'], [0.5, '#F3D98B'], [1, '#8C6A1C']], 150, 450) +
            `<pattern id="gpat" width="34" height="34" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">` +
            `<path d="M0 0H34M0 0V34" stroke="#E9CB7A" stroke-opacity=".07" stroke-width="1.2"/></pattern>`,
          under: `<rect width="600" height="700" rx="44" fill="url(#gbg)"/><rect width="600" height="700" rx="44" fill="url(#gpat)"/>` +
            `<rect x="16" y="16" width="568" height="668" rx="32" fill="none" stroke="url(#gold)" stroke-width="2.5"/>` +
            `<rect x="27" y="27" width="546" height="646" rx="23" fill="none" stroke="url(#gold)" stroke-width="1" stroke-opacity=".55"/>` +
            diamond(300, 16, 9, '#151340', '#E9CB7A', 2) + diamond(300, 684, 9, '#151340', '#E9CB7A', 2) +
            diamond(16, 350, 7, '#151340', '#E9CB7A', 1.6) + diamond(584, 350, 7, '#151340', '#E9CB7A', 1.6) +
            `<rect x="56" y="66" width="488" height="488" rx="24" fill="none" stroke="url(#gold)" stroke-width="1.6"/>` +
            `<rect x="64" y="74" width="472" height="472" rx="18" fill="#FFFCF2"/>`,
          over: `<path d="M150 ${oy}H270M330 ${oy}H450" stroke="url(#goldl)" stroke-width="1.4"/>` +
            diamond(300, oy, 7, 'url(#gold)') + diamond(280, oy, 3, '#E9CB7A') + diamond(320, oy, 3, '#E9CB7A'),
        };
      },
    },

    {
      id: 'emerald', premium: true, accent: '#065F46',
      name: { ar: 'زمردي', en: 'Emerald', fr: 'Émeraude' },
      w: 600, h: 680, qr: { x: 80, y: 80, size: 440 },
      lib: {
        dotsOptions: { type: 'rounded', gradient: grad('linear', [[0, '#065F46'], [0.5, '#047857'], [1, '#064E3B']], Math.PI / 4) },
        cornersSquareOptions: { type: 'square', color: 'transparent' },
        cornersDotOptions: { type: 'square', color: 'transparent' },
      },
      finder(m) {   // leaf-shaped corners, mirrored so that each leaf points outwards
        const one = (x, y) => `<path fill-rule="evenodd" fill="#064E3B" d="${leaf(x, y, 7 * m, 3.1 * m, 0.55 * m)}${leaf(x + m, y + m, 5 * m, 2.2 * m, 0.35 * m)}"/>` +
          `<path fill="#0E9F6E" d="${leaf(x + 2 * m, y + 2 * m, 3 * m, 1.35 * m, 0.25 * m)}"/>`;
        return one;
      },
      frame() {
        const sprig = (cx, cy) => `<g transform="translate(${cx} ${cy})"><path d="M-34 0H34" stroke="#A7F3D0" stroke-opacity=".7" stroke-width="1.6" stroke-linecap="round"/>` +
          `<path d="M0 0C-6-12-2-22 0-26C2-22 6-12 0 0Z" fill="#6EE7B7"/><path d="M0 0C-14-4-20-14-21-19C-15-18-5-13 0 0Z" fill="#34D399"/><path d="M0 0C14-4 20-14 21-19C15-18 5-13 0 0Z" fill="#34D399"/></g>`;
        const bigLeaf = (tr) => `<g transform="${tr}"><path d="M0 0C60-70 170-80 240-60C220 10 140 90 0 0Z" fill="#fff" fill-opacity=".06"/>` +
          `<path d="M0 0C80-30 150-45 240-60" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="2"/></g>`;
        return {
          defs: lin('ebg', [[0, '#0B7A57'], [1, '#04301F']], 0, 0, 0.4, 1) + `<clipPath id="eclip"><rect width="600" height="680" rx="48"/></clipPath>`,
          under: `<rect width="600" height="680" rx="48" fill="url(#ebg)"/>` +
            `<g clip-path="url(#eclip)">${bigLeaf('translate(-10 690) rotate(-18)')}${bigLeaf('translate(610 700) scale(-1 1) rotate(-24)')}</g>` +
            `<rect x="40" y="40" width="520" height="520" rx="46" fill="#F5FFF9"/>`,
          over: sprig(300, 622),
        };
      },
    },

    {
      id: 'ocean', premium: true, accent: '#0E5A8A',
      name: { ar: 'المحيط', en: 'Ocean', fr: 'Océan' },
      w: 600, h: 700, qr: { x: 80, y: 80, size: 440 },
      lib: {
        dotsOptions: { type: 'dots', gradient: grad('linear', [[0, '#0891B2'], [1, '#1E3A8A']], Math.PI / 2) },
        cornersSquareOptions: { type: 'rounded', color: '#0E7490' },
        cornersDotOptions: { type: 'rounded', color: '#1E3A8A' },
      },
      frame() {
        return {
          defs: lin('obg', [[0, '#1BC6C9'], [0.55, '#0A6DB8'], [1, '#0B2A6F']], 0, 0, 0, 1) +
            `<clipPath id="oclip"><rect width="600" height="700" rx="50"/></clipPath>`,
          under: `<g clip-path="url(#oclip)"><rect width="600" height="700" fill="url(#obg)"/>` +
            `<path d="${wave(600, 700, 34, 10, 300, 40)}" fill="#fff" fill-opacity=".07" transform="scale(1 -1) translate(0 -700)"/>` +
            `<path d="${wave(600, 700, 586, 16, 300, 0)}" fill="#fff" fill-opacity=".10"/>` +
            `<path d="${wave(600, 700, 612, 14, 240, 70)}" fill="#fff" fill-opacity=".10"/>` +
            `<path d="${wave(600, 700, 640, 12, 200, 30)}" fill="#0B2A6F" fill-opacity=".45"/>` +
            `<circle cx="540" cy="582" r="7" fill="#fff" fill-opacity=".22"/><circle cx="560" cy="566" r="4" fill="#fff" fill-opacity=".22"/><circle cx="62" cy="590" r="5" fill="#fff" fill-opacity=".18"/></g>` +
            `<rect x="44" y="44" width="512" height="512" rx="42" fill="#fff"/>`,
          over: '',
        };
      },
    },

    {
      id: 'rose', premium: true, accent: '#BE185D',
      name: { ar: 'وردي ناعم', en: 'Soft rose', fr: 'Rose poudré' },
      w: 600, h: 700, qr: { x: 98, y: 112, size: 404 }, logo: 'rose', logoSize: 0.26,
      lib: {
        dotsOptions: { type: 'rounded', gradient: grad('linear', [[0, '#BE185D'], [1, '#7C3AED']], Math.PI / 4) },
        cornersSquareOptions: { type: 'rounded', color: '#9D174D' },
        cornersDotOptions: { type: 'rounded', color: '#6D28D9' },
      },
      frame() {
        const flower = (cx, cy, r, col) => {
          let p = '';
          for (let i = 0; i < 5; i++) p += `<ellipse cx="${cx}" cy="${r2(cy - r * 0.62)}" rx="${r2(r * 0.42)}" ry="${r2(r * 0.62)}" fill="${col}" transform="rotate(${i * 72} ${cx} ${cy})"/>`;
          return p + `<circle cx="${cx}" cy="${cy}" r="${r2(r * 0.26)}" fill="#F7D58B"/>`;
        };
        const leafy = (x, y, rot) => `<path d="M0 0C8-10 22-12 30-8C24 2 10 6 0 0Z" fill="#D8C4F5" transform="translate(${x} ${y}) rotate(${rot})"/>`;
        const corner = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s} 1)">${leafy(10, 18, 10)}${leafy(16, 6, -60)}${flower(0, 0, 24, '#F9A8D4')}${flower(34, 30, 13, '#C4B5FD')}</g>`;
        const y = 618;
        return {
          defs: lin('rbg', [[0, '#FFF1F5'], [1, '#F3EBFF']]) + lin('rln', [[0, '#E879A6'], [1, '#A78BFA']]) +
            linU('rlnu', [[0, '#E879A6'], [1, '#A78BFA']], 170, 430),
          under: `<rect width="600" height="700" rx="52" fill="url(#rbg)"/>` +
            `<rect x="18" y="18" width="564" height="664" rx="38" fill="none" stroke="url(#rln)" stroke-width="2"/>` +
            `<rect x="29" y="29" width="542" height="642" rx="29" fill="none" stroke="#E9B8CF" stroke-width="1.6" stroke-dasharray="0.1 7" stroke-linecap="round"/>` +
            corner(58, 58, 1) + corner(542, 58, -1) +
            `<rect x="64" y="78" width="472" height="472" rx="38" fill="#fff" stroke="#F3D1E0" stroke-width="1.5"/>`,
          over: `<path d="M178 ${y}H278M322 ${y}H422" stroke="url(#rlnu)" stroke-width="1.5" stroke-linecap="round"/>` +
            `<circle cx="170" cy="${y}" r="3" fill="#E879A6"/><circle cx="430" cy="${y}" r="3" fill="#A78BFA"/>` +
            `<path d="M300 ${y + 9}c-8-6.5-12-10.5-12-14.5 0-3.2 2.4-5.5 5.3-5.5 2.7 0 4.8 1.4 6.7 4 1.9-2.6 4-4 6.7-4 2.9 0 5.3 2.3 5.3 5.5 0 4-4 8-12 14.5z" fill="#E879A6"/>`,
        };
      },
    },

    {
      id: 'minimal', premium: true, accent: '#111111',
      name: { ar: 'عصري بسيط', en: 'Modern minimal', fr: 'Minimal moderne' },
      w: 600, h: 650, qr: { x: 84, y: 84, size: 432 },
      lib: {
        dotsOptions: { type: 'dots', color: '#111111' },
        cornersSquareOptions: { type: 'rounded', color: '#111111' },
        cornersDotOptions: { type: 'rounded', color: '#111111' },
      },
      frame() {
        return {
          defs: `<filter id="msh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#1B1B18" flood-opacity=".09"/></filter>`,
          under: `<rect x=".75" y=".75" width="598.5" height="648.5" rx="44" fill="#F6F5F2" stroke="#E2E0D9" stroke-width="1.5"/>` +
            `<rect x="48" y="48" width="504" height="504" rx="32" fill="#fff" filter="url(#msh)"/>`,
          over: `<path d="M270 600H330" stroke="#111" stroke-width="1.3"/>`,
        };
      },
    },

    {
      id: 'neon', premium: true, accent: '#6D28D9',
      name: { ar: 'نيون ليلي', en: 'Night neon', fr: 'Néon de nuit' },
      w: 600, h: 670, qr: { x: 76, y: 76, size: 448 },
      lib: {
        dotsOptions: { type: 'rounded', gradient: grad('linear', [[0, '#A3159A'], [0.5, '#5B21B6'], [1, '#0369A1']], Math.PI / 4) },
        cornersSquareOptions: { type: 'rounded', color: '#86198F' },
        cornersDotOptions: { type: 'rounded', color: '#0369A1' },
      },
      frame() {
        const y = 616;
        const cup = `<g transform="translate(222 ${y - 22})" fill="none" stroke="#22D3EE" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#nglc)">` +
          `<path d="M4 14h26v10a12 12 0 0 1-12 12h-2A12 12 0 0 1 4 24z"/><path d="M30 17h3a5 5 0 0 1 0 10h-3"/><path d="M11 8c0-3 3-3 3-6M19 8c0-3 3-3 3-6"/></g>`;
        const fork = `<g transform="translate(342 ${y - 24})" fill="none" stroke="#FF4FD8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#nglm)">` +
          `<path d="M8 2v12a5 5 0 0 0 10 0V2M13 2v36"/><path d="M30 38V2c-5 3-7 9-7 16h7"/></g>`;
        return {
          defs: rad('nbg', [[0, '#1E1050'], [0.6, '#0D0826'], [1, '#05040D']], 0.5, 0.35, 0.85) +
            lin('nring', [[0, '#FF2BD6'], [0.5, '#8B5CF6'], [1, '#22D3EE']]) +
            `<filter id="nglow" x="-15%" y="-15%" width="130%" height="130%"><feGaussianBlur stdDeviation="9"/></filter>` +
            `<filter id="nglm" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>` +
            `<filter id="nglc" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>` +
            `<pattern id="npat" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="#22D3EE" fill-opacity=".10"/></pattern>`,
          under: `<rect width="600" height="670" rx="48" fill="url(#nbg)"/><rect width="600" height="670" rx="48" fill="url(#npat)"/>` +
            `<rect x="40" y="40" width="520" height="520" rx="42" fill="none" stroke="url(#nring)" stroke-width="10" filter="url(#nglow)"/>` +
            `<rect x="40" y="40" width="520" height="520" rx="42" fill="none" stroke="url(#nring)" stroke-width="4"/>` +
            `<rect x="42" y="42" width="516" height="516" rx="40" fill="#FBF9FF"/>`,
          over: cup + fork,
        };
      },
    },

    {
      id: 'islamic', premium: true, accent: '#0E5A3A',
      name: { ar: 'زخرفة إسلامية', en: 'Islamic', fr: 'Islamique' },
      w: 600, h: 800, qr: { x: 100, y: 262, size: 400 }, logo: 'islamic', logoSize: 0.28,
      lib: {
        dotsOptions: { type: 'classy', gradient: grad('linear', [[0, '#0F6B45'], [1, '#0A4A30']], Math.PI / 4) },
        cornersSquareOptions: { type: 'square', color: '#7A5A14' },
        cornersDotOptions: { type: 'square', color: '#0B4F33' },
      },
      frame() {
        const star = (cx, cy, s, attrs) => `<rect x="${cx - s}" y="${cy - s}" width="${2 * s}" height="${2 * s}" ${attrs}/>` +
          `<rect x="${cx - s}" y="${cy - s}" width="${2 * s}" height="${2 * s}" ${attrs} transform="rotate(45 ${cx} ${cy})"/>`;
        const arch = 'M60 230V700Q60 724 84 724H516Q540 724 540 700V230C540 156 430 104 300 58C170 104 60 156 60 230Z';
        return {
          defs: lin('ibg', [[0, '#0F5E3D'], [1, '#062F1E']], 0, 0, 0.3, 1) +
            lin('igold', [[0, '#8C6A1C'], [0.3, '#E8CB7C'], [0.6, '#B8912F'], [1, '#F2DC98']]) +
            `<pattern id="ipat" width="60" height="60" patternUnits="userSpaceOnUse"><g fill="none" stroke="#E3C77B" stroke-opacity=".11" stroke-width="1.2">` +
            star(30, 30, 11, '') + `<path d="M30 0V15M30 45V60M0 30H15M45 30H60M0 0L19 19M60 0L41 19M0 60L19 41M60 60L41 41"/></g></pattern>`,
          under: `<rect width="600" height="800" rx="40" fill="url(#ibg)"/><rect width="600" height="800" rx="40" fill="url(#ipat)"/>` +
            `<rect x="14" y="14" width="572" height="772" rx="30" fill="none" stroke="url(#igold)" stroke-width="2.5"/>` +
            `<rect x="24" y="24" width="552" height="752" rx="22" fill="none" stroke="url(#igold)" stroke-width="1" stroke-opacity=".6"/>` +
            `<path d="${arch}" fill="none" stroke="url(#igold)" stroke-width="10" stroke-opacity=".25"/>` +
            `<path d="${arch}" fill="#FFFDF4" stroke="url(#igold)" stroke-width="3"/>` +
            `<path d="M84 238C96 182 180 140 300 96C420 140 504 182 516 238" fill="none" stroke="#C9A54A" stroke-width="1.4" stroke-opacity=".7"/>` +
            `<g fill="#C9A54A">${star(300, 172, 17, '')}</g>` +
            `<path d="M150 172H268M332 172H450" stroke="#C9A54A" stroke-width="1.4"/>` +
            diamond(144, 172, 4, '#B8912F') + diamond(456, 172, 4, '#B8912F'),
          over: diamond(300, 756, 6, '#C9A54A') + diamond(278, 756, 3, '#C9A54A') + diamond(322, 756, 3, '#C9A54A'),
        };
      },
    },
  ];

  const BY_ID = Object.fromEntries(DESIGNS.map((d) => [d.id, d]));

  /* ---------------- the code (qr-code-styling) ---------------- */
  // UTF-8 bytes as a "binary" string: the library writes each char code as one byte, so Arabic
  // and accented text are encoded as real UTF-8 (what phones expect in a vCard).
  function utf8(str) {
    try { return unescape(encodeURIComponent(str)); } catch (e) { return str; }
  }

  async function drawCode(d, data, withLogo) {
    const opts = {
      type: 'svg', width: Q, height: Q, margin: 0, data: utf8(data),
      qrOptions: { errorCorrectionLevel: 'H', mode: 'Byte' },
      backgroundOptions: { color: 'transparent' },
      dotsOptions: Object.assign({ roundSize: false }, d.lib.dotsOptions),
      cornersSquareOptions: d.lib.cornersSquareOptions,
      cornersDotOptions: d.lib.cornersDotOptions,
    };
    if (withLogo) {
      opts.image = LOGO_PROBE;
      opts.imageOptions = { hideBackgroundDots: true, imageSize: d.logoSize || 0.26, margin: 10, saveAsBlob: false };
    }
    const qr = new window.QRCodeStyling(opts);
    const blob = await qr.getRawData('svg');
    const raw = typeof blob === 'string' ? blob : await blob.text();
    const count = qr._qr ? qr._qr.getModuleCount() : 0;
    const open = raw.indexOf('<svg');
    const start = raw.indexOf('>', open) + 1;
    const end = raw.lastIndexOf('</svg>');
    let inner = raw.slice(start, end);
    // The library fills each colour through a clip path made of one shape per module; neighbouring shapes are
    // anti-aliased separately and leave faint seams. Draw the shapes directly instead (same paint: the gradients
    // are in user space), with a hairline stroke of the same paint that closes the seams.
    const clips = {};
    inner = inner.replace(/<clipPath id="([^"]+)">([\s\S]*?)<\/clipPath>/g, (m, id, body) => {
      if (id.indexOf('clip-path-background') === 0) return '';
      clips[id] = body.replace(/clip-rule=/g, 'fill-rule=');
      return '';
    });
    inner = inner.replace(/<rect\b[^>]*clip-path="url\('#([^']+)'\)"[^>]*fill="([^"]+)"[^>]*\/>/g, (m, id, fill) => {
      if (!(id in clips)) return '';   // background (transparent)
      if (fill === 'transparent') return '';
      return d.crisp ? `<g fill="${fill}">${clips[id]}</g>`
        : `<g fill="${fill}" stroke="${fill}" stroke-width="0.6" vector-effect="non-scaling-stroke">${clips[id]}</g>`;
    });
    let logoBox = null;
    inner = inner.replace(/<image\b[^>]*>/, (tag) => {
      const a = (n) => parseFloat((tag.match(new RegExp('\\s' + n + '="([\\d.]+)')) || [])[1]);
      logoBox = { x: a('x'), y: a('y'), w: a('width'), h: a('height') };
      return '';
    });
    return { inner, count, logoBox };
  }

  /* free version of a Premium design: the site goes into the contact itself (vCard website line),
     so whoever scans the code saves the contact with merabti.com; the paid version leaves it out */
  function withSite(data) {
    if (/^BEGIN:VCARD/.test(data)) return data.replace(/\nEND:VCARD\s*$/, '\nURL:' + SITE_URL + '\nEND:VCARD');
    return data;
  }

  async function render(id, data, opts) {
    opts = opts || {};
    const d = BY_ID[id] || DESIGNS[0];
    const branded = !!(d.premium && opts.branded);
    if (branded) data = withSite(data);
    const own = d.premium && opts.logo && (opts.logo.type === 'image' ? opts.logo.src : String(opts.logo.text || '').trim()) ? opts.logo : null;
    const code = await drawCode(d, data, !!(own || d.logo));
    const f = d.frame() || {};
    const { x, y, size } = d.qr;
    const k = size / Q;

    let logo = '';
    if (code.logoBox && (own || LOGOS[d.logo])) {
      const b = code.logoBox;
      logo = `<svg x="${r2(x + b.x * k)}" y="${r2(y + b.y * k)}" width="${r2(b.w * k)}" height="${r2(b.h * k)}" viewBox="0 0 100 100">${own ? customLogo(own, d.accent || '#1E2F40') : LOGOS[d.logo]}</svg>`;
    }
    // where the centre logo is (frame units): the page puts its "change the logo" button there
    const hs = size * 0.3;
    const hot = { x: x + size / 2 - hs / 2, y: y + size / 2 - hs / 2, w: hs, h: hs };
    let finders = '';
    if (d.finder && code.count) {
      const m = size / code.count;
      const one = d.finder(m);
      const n7 = (code.count - 7) * m;
      const at = (fx, fy, sx, sy) => {
        const cx = x + fx + 3.5 * m, cy = y + fy + 3.5 * m;
        return `<g transform="translate(${r2(cx)} ${r2(cy)}) scale(${sx} ${sy}) translate(${r2(-cx)} ${r2(-cy)})">${one(x + fx, y + fy)}</g>`;
      };
      finders = at(0, 0, 1, 1) + at(n7, 0, -1, 1) + at(0, n7, 1, -1);
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${d.w}" height="${d.h}" viewBox="0 0 ${d.w} ${d.h}">` +
      `<defs>${f.defs || ''}</defs>${f.under || ''}` +
      `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 ${Q} ${Q}" shape-rendering="${d.crisp ? 'crispEdges' : 'geometricPrecision'}">${code.inner}</svg>` +
      finders + logo + (f.over || '') + '</svg>';
    return { svg, w: d.w, h: d.h, id: d.id, hot };
  }

  const svgUrl = (svg) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

  function loadImage(src) {
    return new Promise((ok, no) => {
      const img = new Image();
      img.onload = () => ok(img);
      img.onerror = () => no(new Error('image'));
      img.src = src;
    });
  }

  /* SVG → PNG (scale × the frame size), transparent outside the frame */
  async function toCanvas(svg, w, h, scale) {
    const img = await loadImage(svgUrl(svg));
    const c = document.createElement('canvas');
    c.width = Math.round(w * scale);
    c.height = Math.round(h * scale);
    const ctx = c.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, c.width, c.height);
    return c;
  }
  async function toPngBlob(svg, w, h, scale) {
    const c = await toCanvas(svg, w, h, scale);
    return new Promise((ok, no) => c.toBlob((b) => (b ? ok(b) : no(new Error('png'))), 'image/png'));
  }

  window.QRDesigns = {
    list: DESIGNS.map((d) => ({ id: d.id, premium: d.premium, name: d.name, w: d.w, h: d.h })),
    render, toCanvas, toPngBlob, svgUrl, withSite,
    _designs: DESIGNS,   // for the scan tests only
  };
})();
