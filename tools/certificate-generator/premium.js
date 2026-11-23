/* =========================================================
   مولّد الشهادات — قوالب Premium (10 شهادات علمية وثقافية)
   window.CERT_PREMIUM = { templates, deco, ui }
   - deco[id](W, H, p, h) → محتوى SVG (ألوان حرفية، بلا نصوص ولا clip-path ولا filter)، يُعرض صورةً
     (img) ليظهر كما هو في PDF. h = أدوات app.js: nid, rng, shade, starPts, star8, corners.
   - قالب = إدخال في templates (نفس بنية app.js) + دالة رسم + كتلة CSS في premium.css.
   ========================================================= */
(function () {
'use strict';

const PI = Math.PI, cos = Math.cos, sin = Math.sin;
const r1 = n => +n.toFixed(1);
const rad2 = d => d * PI / 180;
const stops = a => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op != null ? ` stop-opacity="${op}"` : ''}/>`).join('');
const lin = (id, x1, y1, x2, y2, a) => `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops(a)}</linearGradient>`;
const rad = (id, cx, cy, r, a) => `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r}">${stops(a)}</radialGradient>`;
const linB = (id, x1, y1, x2, y2, a) => `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops(a)}</linearGradient>`;
const radB = (id, cx, cy, r, a) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops(a)}</radialGradient>`;
const poly = pts => pts.map(q => r1(q[0]) + ',' + r1(q[1])).join(' ');
const line = (x1, y1, x2, y2, st) => `<path d="M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}" ${st}/>`;
/* chamfered rectangle path */
const chamfer = (W, H, i, c) => `M${i + c} ${i}H${W - i - c}L${W - i} ${i + c}V${H - i - c}L${W - i - c} ${H - i}H${i + c}L${i} ${H - i - c}V${i + c}Z`;
/* points of a regular polygon */
const ngon = (cx, cy, r, n, rot = -90) => { const a = []; for (let i = 0; i < n; i++) a.push([cx + r * cos(rad2(rot + i * 360 / n)), cy + r * sin(rad2(rot + i * 360 / n))]); return a; };

/* Greek key (meander) strip: horizontal, from x0 to x1, top y, unit u */
function meander(x0, x1, y, u, st) {
  let d = '';
  const n = Math.floor((x1 - x0) / (u * 1.5));
  for (let i = 0; i < n; i++) {
    const x = x0 + i * u * 1.5;
    d += `M${r1(x)} ${r1(y + u)}V${r1(y)}H${r1(x + u)}V${r1(y + u * .75)}H${r1(x + u * .25)}V${r1(y + u * .25)}H${r1(x + u * .75)}V${r1(y + u * .5)}M${r1(x + u)} ${r1(y + u)}H${r1(x + u * 1.5)}`;
  }
  return `<path d="${d}" fill="none" ${st}/>`;
}
/* spiral (volute) as a polyline */
function spiral(cx, cy, r0, r1_, turns, dir = 1, rot = 0) {
  const pts = [], n = Math.round(turns * 28);
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = rad2(rot) + dir * t * turns * 2 * PI, r = r0 + (r1_ - r0) * t;
    pts.push([cx + r * cos(a), cy + r * sin(a)]);
  }
  return 'M' + poly(pts).replace(/ /g, 'L');
}
/* sine path from x0 to x1 */
function wave(x0, x1, y, amp, wl, ph, step = 4) {
  let d = '';
  for (let x = x0; x <= x1; x += step) d += (d ? 'L' : 'M') + r1(x) + ' ' + r1(y + amp * sin((x - x0) / wl * 2 * PI + ph));
  return d;
}
/* gear outline (polygon teeth) */
function gearPath(cx, cy, ro, ri, n, rot) {
  const st = 2 * PI / n, pts = [];
  for (let i = 0; i < n; i++) {
    const a = rot + i * st;
    [[-.3, ri], [-.17, ro], [.17, ro], [.3, ri]].forEach(([k, r]) => pts.push([cx + r * cos(a + k * st), cy + r * sin(a + k * st)]));
  }
  return 'M' + poly(pts).replace(/ /g, 'L') + 'Z';
}

const D = {};

/* ───────────── 1 · الفيزياء الذرية ───────────── */
D.atom = function (W, H, p, h) {
  const R = h.rng(7), g1 = h.nid('a'), g2 = h.nid('a'), dt = h.nid('a');
  const cx = W / 2, cy = H / 2, Ro = Math.min(W, H) * .5;
  let s = `<defs>${rad(g1, cx, cy, Math.max(W, H) * .78, [[0, h.shade(p.c1, .3)], [.55, p.c1], [1, h.shade(p.c1, -.6)]])}${rad(g2, cx, cy, 120, [[0, p.c2, .45], [1, p.c2, 0]])}
    <pattern id="${dt}" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="15" cy="15" r="1.1" fill="${p.c2}" fill-opacity=".18"/></pattern></defs>`;
  s += `<rect width="${W}" height="${H}" fill="url(#${g1})"/><rect width="${W}" height="${H}" fill="url(#${dt})"/>`;
  /* giant orbitals + nucleus behind the text */
  s += `<circle cx="${cx}" cy="${cy}" r="120" fill="url(#${g2})"/>`;
  [0, 60, 120].forEach((a, i) => {
    const rx = Ro * 1.08, ry = Ro * .37;
    s += `<ellipse cx="${cx}" cy="${cy}" rx="${r1(rx)}" ry="${r1(ry)}" transform="rotate(${a} ${cx} ${cy})" fill="none" stroke="${p.c2}" stroke-opacity=".17" stroke-width="1.6"/>`;
    [[.7 + i, 1], [3.4 + i * 1.3, .7]].forEach(([t, k]) => {
      const x = rx * cos(t), y = ry * sin(t), ar = rad2(a);
      const ex = cx + x * cos(ar) - y * sin(ar), ey = cy + x * sin(ar) + y * cos(ar);
      s += `<circle cx="${r1(ex)}" cy="${r1(ey)}" r="11" fill="${p.c2}" fill-opacity=".14"/><circle cx="${r1(ex)}" cy="${r1(ey)}" r="${3.6 * k}" fill="${p.c2}" fill-opacity=".85"/>`;
    });
  });
  s += `<circle cx="${cx}" cy="${cy}" r="7" fill="${p.c2}" fill-opacity=".5"/>`;
  /* energy levels in the corners */
  const lv = [60, 98, 138, 182, 230].map((r, i) => `<circle r="${r}" fill="none" stroke="${p.c2}" stroke-opacity="${.34 - i * .045}" stroke-width="${i % 2 ? 1 : 1.6}"${i % 2 ? ' stroke-dasharray="2 7"' : ''}/>`).join('') +
    [[60, 38], [98, 71], [138, 20], [182, 52], [230, 80]].map(([r, a]) => `<circle cx="${r1(r * cos(rad2(a)))}" cy="${r1(r * sin(rad2(a)))}" r="4.2" fill="${p.c2}"/>`).join('');
  s += h.corners(W, H, 0, lv);
  /* particle tracks (bubble chamber) */
  const track = (x, y, ang, len, curv, dec, col, op) => {
    let d = `M${r1(x)} ${r1(y)}`, a = ang, c = curv;
    for (let i = 0; i < len; i += 3) { a += c; c *= dec; x += 3 * cos(a); y += 3 * sin(a); d += `L${r1(x)} ${r1(y)}`; }
    return `<path d="${d}" fill="none" stroke="${col}" stroke-opacity="${op}" stroke-width="1.5" stroke-linecap="round"/>`;
  };
  [[48, H * .66, 1], [W - 48, H * .34, -1]].forEach(([vx, vy, m]) => {
    s += `<circle cx="${vx}" cy="${vy}" r="4" fill="${p.c3}"/>`;
    for (let i = 0; i < 7; i++) {
      const base = m > 0 ? -50 + i * 16 : 130 + i * 16;
      s += track(vx, vy, rad2(base + (R() - .5) * 10), 90 + R() * 150, (R() > .5 ? 1 : -1) * (.03 + R() * .05), .992, i % 3 ? p.c2 : p.c3, (.32 + R() * .3).toFixed(2));
    }
  });
  /* wave function strips */
  s += `<path d="${wave(70, W - 70, H - 46, 9, 120, 0)}" fill="none" stroke="${p.c2}" stroke-opacity=".5" stroke-width="1.6"/><path d="${wave(70, W - 70, H - 46, 5, 40, 1)}" fill="none" stroke="${p.c3}" stroke-opacity=".32" stroke-width="1.2"/>`;
  s += `<path d="${wave(70, W - 70, 46, 9, 120, PI)}" fill="none" stroke="${p.c2}" stroke-opacity=".5" stroke-width="1.6"/>`;
  for (let i = 0; i < 60; i++) s += `<circle cx="${r1(R() * W)}" cy="${r1(R() * H)}" r="${(.6 + R() * 1.3).toFixed(1)}" fill="#FFFFFF" fill-opacity="${(.2 + R() * .55).toFixed(2)}"/>`;
  /* frame */
  s += `<rect x="28" y="28" width="${W - 56}" height="${H - 56}" fill="none" stroke="${p.c2}" stroke-opacity=".4" stroke-width="1"/><rect x="38" y="38" width="${W - 76}" height="${H - 76}" fill="none" stroke="${p.c2}" stroke-opacity=".18" stroke-width="1"/>`;
  s += h.corners(W, H, 28, `<path d="M0 64V0H64" fill="none" stroke="${p.c2}" stroke-width="4" stroke-linecap="square"/><rect x="9" y="9" width="9" height="9" fill="${p.c3}"/>`);
  return s;
};

/* ───────────── 2 · الهندسة الميكانيكية ───────────── */
D.gears = function (W, H, p, h) {
  const R = h.rng(21), mm = h.nid('m'), mj = h.nid('m'), hc = h.nid('m'), gs = h.nid('m');
  let s = `<defs><pattern id="${mm}" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M12 0V12H0" fill="none" stroke="${p.c1}" stroke-opacity=".07" stroke-width=".7"/></pattern>
    <pattern id="${mj}" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0V60H0" fill="none" stroke="${p.c1}" stroke-opacity=".12" stroke-width="1"/></pattern>
    <pattern id="${hc}" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V9" stroke="${p.c1}" stroke-opacity=".25" stroke-width="1"/></pattern>
    ${linB(gs, 0, 0, 1, 1, [[0, '#FFFFFF', .55], [1, h.shade(p.c1, .55), .35]])}</defs>`;
  s += `<rect width="${W}" height="${H}" fill="${p.c3}"/><rect width="${W}" height="${H}" fill="url(#${mm})"/><rect width="${W}" height="${H}" fill="url(#${mj})"/>`;
  s += `<rect x="16" y="${H - 220}" width="150" height="150" fill="url(#${hc})"/><rect x="${W - 166}" y="70" width="150" height="150" fill="url(#${hc})"/>`;
  const gear = (cx, cy, ro, n, rot, hub) => {
    const ri = ro * .86, rp = (ro + ri) / 2;
    let g = `<path d="${gearPath(cx, cy, ro, ri, n, rot)}" fill="url(#${gs})" fill-opacity="1" stroke="${p.c1}" stroke-width="2" stroke-linejoin="round"/>`;
    g += `<circle cx="${cx}" cy="${cy}" r="${r1(ri * .86)}" fill="none" stroke="${p.c1}" stroke-opacity=".5" stroke-width="1"/>`;
    g += `<circle cx="${cx}" cy="${cy}" r="${r1(rp)}" fill="none" stroke="${p.c2}" stroke-opacity=".75" stroke-width=".9" stroke-dasharray="14 3 3 3"/>`;
    if (ro > 80) for (let i = 0; i < 6; i++) { const a = rot + i * PI / 3 + PI / 6; g += `<circle cx="${r1(cx + ro * .52 * cos(a))}" cy="${r1(cy + ro * .52 * sin(a))}" r="${r1(ro * .13)}" fill="${p.c3}" stroke="${p.c1}" stroke-width="1.5"/>`; }
    g += `<circle cx="${cx}" cy="${cy}" r="${r1(ro * .22)}" fill="${hub ? p.c2 : p.c3}" fill-opacity="${hub ? .9 : 1}" stroke="${p.c1}" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="${r1(ro * .08)}" fill="${p.c1}"/>`;
    g += `<path d="M${r1(cx - ro * 1.08)} ${cy}H${r1(cx + ro * 1.08)}M${cx} ${r1(cy - ro * 1.08)}V${r1(cy + ro * 1.08)}" stroke="${p.c2}" stroke-opacity=".5" stroke-width=".8" stroke-dasharray="16 4 3 4"/>`;
    return g;
  };
  /* two meshing pairs + two single gears */
  const mesh = (cx, cy, ro1, n1, th, ro2) => {
    const n2 = Math.round(n1 * ro2 / ro1), d = (ro1 + ro2) * .93, t = rad2(th);
    const x2 = cx + d * cos(t), y2 = cy + d * sin(t);
    return gear(cx, cy, ro1, n1, t, false) + gear(x2, y2, ro2, n2, t + PI + PI / n2, true);
  };
  s += mesh(18, 22, 150, 26, 40, 56) + mesh(W - 12, H - 10, 124, 22, 252, 46);
  s += gear(W - 30, 56, 78, 16, .2, true) + gear(34, H - 56, 64, 14, .5, false);
  /* dimension lines */
  const dim = (x1, y1, x2, y2, gap) => {
    const hz = y1 === y2, L = hz ? x2 - x1 : y2 - y1, m = L / 2;
    const seg = (a, b) => hz ? `M${r1(x1 + a)} ${y1}H${r1(x1 + b)}` : `M${x1} ${r1(y1 + a)}V${r1(y1 + b)}`;
    const ar = (pos, sg) => hz ? `M${r1(x1 + pos)} ${y1}l${sg * 9} -3.5v7Z` : `M${x1} ${r1(y1 + pos)}l-3.5 ${sg * 9}h7Z`;
    const ext = pos => hz ? `M${r1(x1 + pos)} ${y1 - 8}V${y1 + 8}` : `M${x1 - 8} ${r1(y1 + pos)}H${x1 + 8}`;
    return `<path d="${seg(0, m - gap)}${seg(m + gap, L)}${ext(0)}${ext(L)}" fill="none" stroke="${p.c1}" stroke-opacity=".6" stroke-width="1"/><path d="${ar(0, 1)}${ar(L, -1)}" fill="${p.c1}" fill-opacity=".6"/>`;
  };
  s += dim(300, 54, W - 300, 54, 22) + dim(54, 280, 54, H - 280, 22) + dim(W - 54, 280, W - 54, H - 280, 22);
  /* drawing frame with zone ticks */
  s += `<rect x="20" y="20" width="${W - 40}" height="${H - 40}" fill="none" stroke="${p.c1}" stroke-width="2.6"/><rect x="27" y="27" width="${W - 54}" height="${H - 54}" fill="none" stroke="${p.c1}" stroke-width=".8"/>`;
  let tk = '';
  for (let x = 160; x < W - 150; x += 80) tk += `M${x} 20V27M${x} ${H - 27}V${H - 20}`;
  for (let y = 170; y < H - 150; y += 80) tk += `M20 ${y}H27M${W - 27} ${y}H${W - 20}`;
  s += `<path d="${tk}" stroke="${p.c1}" stroke-width="1.4"/>`;
  [[20, 20], [W - 20, 20], [20, H - 20], [W - 20, H - 20]].forEach(([x, y]) => {
    s += `<polygon points="${poly(ngon(x, y, 12, 6, 0))}" fill="${p.c3}" stroke="${p.c1}" stroke-width="1.8"/><circle cx="${x}" cy="${y}" r="4.6" fill="none" stroke="${p.c2}" stroke-width="1.6"/>`;
  });
  return s;
};

/* ───────────── 3 · الرياضيات ───────────── */
D.math = function (W, H, p, h) {
  const g1 = h.nid('t'), g2 = h.nid('t');
  let s = `<defs><pattern id="${g1}" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0V20H0" fill="none" stroke="${p.c1}" stroke-opacity=".08" stroke-width=".8"/></pattern>
    <pattern id="${g2}" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M100 0V100H0" fill="none" stroke="${p.c1}" stroke-opacity=".16" stroke-width="1.2"/></pattern></defs>`;
  s += `<rect width="${W}" height="${H}" fill="${p.c3}"/><rect width="${W}" height="${H}" fill="url(#${g1})"/><rect width="${W}" height="${H}" fill="url(#${g2})"/>`;
  const cx = W / 2, cy = H / 2 + 20;
  /* axes */
  s += `<path d="M64 ${cy}H${W - 64}M${cx} 64V${H - 64}" stroke="${p.c1}" stroke-opacity=".2" stroke-width="1.4"/><path d="M${W - 64} ${cy}l-10 -4v8ZM${cx} 64l-4 10h8Z" fill="${p.c1}" fill-opacity=".25"/>`;
  /* curves */
  const curve = (fn, x0, x1, st, ymin = 70, ymax = H - 70) => {
    let d = '', pen = false;
    for (let x = x0; x <= x1; x += 4) { const y = fn(x); if (y < ymin || y > ymax) { pen = false; continue; } d += (pen ? 'L' : 'M') + r1(x) + ' ' + r1(y); pen = true; }
    return `<path d="${d}" fill="none" ${st}/>`;
  };
  s += curve(x => cy - 90 * sin((x - cx) / 62), 70, W - 70, `stroke="${p.c1}" stroke-opacity=".17" stroke-width="2.2"`);
  s += curve(x => cy - 90 * cos((x - cx) / 62), 70, W - 70, `stroke="${p.c2}" stroke-opacity=".17" stroke-width="2.2"`);
  s += curve(x => cy + 210 - (x - cx) * (x - cx) / 520, 70, W - 70, `stroke="${p.c1}" stroke-opacity=".12" stroke-width="2" stroke-dasharray="7 5"`);
  /* geometric construction (left): circle, inscribed triangle, hexagon */
  const gx = W * .22, gy = H * .52, gr = 140;
  s += `<circle cx="${gx}" cy="${gy}" r="${gr}" fill="none" stroke="${p.c1}" stroke-opacity=".24" stroke-width="1.6"/><circle cx="${gx}" cy="${gy}" r="${gr / 2}" fill="none" stroke="${p.c1}" stroke-opacity=".18" stroke-width="1.2"/>`;
  s += `<polygon points="${poly(ngon(gx, gy, gr, 3))}" fill="${p.c2}" fill-opacity=".05" stroke="${p.c2}" stroke-opacity=".4" stroke-width="1.6"/><polygon points="${poly(ngon(gx, gy, gr, 6, 0))}" fill="none" stroke="${p.c1}" stroke-opacity=".26" stroke-width="1.4"/>`;
  const pent = ngon(gx, gy, gr, 5);
  s += `<path d="M${poly([pent[0], pent[2], pent[4], pent[1], pent[3]]).replace(/ /g, 'L')}Z" fill="none" stroke="${p.c1}" stroke-opacity=".2" stroke-width="1.2"/>`;
  /* golden rectangles and spiral (right) */
  const fib = [1, 1, 2, 3, 5, 8, 13, 21], u = 8.6;
  let x0 = 0, y0 = 0, x1 = u, y1 = u;
  const sq = [{ x: 0, y: 0, s: u, a: '' }];
  for (let i = 1; i < fib.length; i++) {
    const d = (i - 1) % 4, w = x1 - x0, hh = y1 - y0; let x, y, sz, arc;
    if (d === 0) { sz = hh; x = x1; y = y0; arc = [[x, y], [x + sz, y + sz], sz, 1]; x1 += sz; }
    else if (d === 1) { sz = w; x = x0; y = y1; arc = [[x + sz, y], [x, y + sz], sz, 1]; y1 += sz; }
    else if (d === 2) { sz = hh; x = x0 - sz; y = y0; arc = [[x + sz, y + sz], [x, y], sz, 1]; x0 -= sz; }
    else { sz = w; x = x0; y = y0 - sz; arc = [[x, y + sz], [x + sz, y], sz, 1]; y0 -= sz; }
    sq.push({ x, y, s: sz, arc });
  }
  const ox = W * .74 - (x0 + x1) / 2, oy = H * .53 - (y0 + y1) / 2;
  sq.forEach(q => {
    s += `<rect x="${r1(q.x + ox)}" y="${r1(q.y + oy)}" width="${r1(q.s)}" height="${r1(q.s)}" fill="${p.c1}" fill-opacity=".03" stroke="${p.c1}" stroke-opacity=".2" stroke-width="1.2"/>`;
    if (q.arc) { const [a, b, r] = q.arc; s += `<path d="M${r1(a[0] + ox)} ${r1(a[1] + oy)}A${r1(r)} ${r1(r)} 0 0 1 ${r1(b[0] + ox)} ${r1(b[1] + oy)}" fill="none" stroke="${p.c2}" stroke-opacity=".5" stroke-width="2.4" stroke-linecap="round"/>`; }
  });
  /* hand-drawn symbols in the margins */
  const sym = {
    pi: 'M-26 -18Q0 -26 26 -18M-13 -20L-16 26M12 -21Q9 8 20 26',
    sigma: 'M22 -26H-20L4 0L-20 26H24M22 -26V-14M24 26V14',
    delta: 'M0 -26L26 22H-26Z',
    sqrt: 'M-26 4L-16 0L-4 26L18 -26H46',
    inf: 'M0 0C-12 -24 -46 -24 -46 0C-46 24 -12 24 0 0C12 -24 46 -24 46 0C46 24 12 24 0 0Z',
    integral: 'M10 -32C20 -38 22 -26 17 -10L7 14C2 30 -8 36 -15 29',
    theta: 'M0 -26C-22 -26 -22 26 0 26C22 26 22 -26 0 -26ZM-14 0H14',
  };
  const place = (k, x, y, c, sc = 1, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})"><path d="${sym[k]}" fill="none" stroke="${c}" stroke-width="4" stroke-opacity=".62" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  s += place('pi', 84, 150, p.c2, 1.15, -6) + place('sigma', 82, 340, p.c1, 1.1, 5) + place('delta', 84, 530, p.c2, 1, -4) + place('theta', 90, 650, p.c1, .9, 6);
  s += place('sqrt', W - 92, 150, p.c1, 1.05, 4) + place('inf', W - 92, 340, p.c2, 1.1, -5) + place('integral', W - 84, 530, p.c1, 1.2, 4) + place('pi', W - 90, 650, p.c2, .9, -6);
  /* ruler frame */
  s += `<rect x="18" y="18" width="${W - 36}" height="${H - 36}" fill="none" stroke="${p.c1}" stroke-width="2.4"/><rect x="34" y="34" width="${W - 68}" height="${H - 68}" fill="none" stroke="${p.c1}" stroke-opacity=".5" stroke-width=".9"/>`;
  let tk = '';
  for (let x = 40, i = 0; x < W - 38; x += 8, i++) { const L = i % 5 === 0 ? 11 : 5; tk += `M${x} 34v${L}M${x} ${H - 34}v${-L}`; }
  for (let y = 40, i = 0; y < H - 38; y += 8, i++) { const L = i % 5 === 0 ? 11 : 5; tk += `M34 ${y}h${L}M${W - 34} ${y}h${-L}`; }
  s += `<path d="${tk}" stroke="${p.c1}" stroke-opacity=".6" stroke-width="1"/>`;
  s += h.corners(W, H, 18, `<path d="M0 54V0H54" fill="none" stroke="${p.c2}" stroke-width="5" stroke-linecap="square"/>`);
  return s;
};

/* ───────────── 4 · اللغة العربية ───────────── */
D.arabic = function (W, H, p, h) {
  const pt = h.nid('r'), cx = W / 2;
  const arch = (i) => `M${44 + i} ${H - 44 - i}L${44 + i} ${230 + i * .4}C${44 + i} 140 ${cx - 190} ${70 + i} ${cx} ${38 + i}C${cx + 190} ${70 + i} ${W - 44 - i} 140 ${W - 44 - i} ${230 + i * .4}L${W - 44 - i} ${H - 44 - i}Z`;
  let s = `<defs><pattern id="${pt}" width="60" height="60" patternUnits="userSpaceOnUse">
    <polygon points="${h.starPts(30, 30, 24, 18.4, 8, -90)}" fill="${p.c2}" fill-opacity=".14" stroke="${p.c2}" stroke-opacity=".75" stroke-width="1"/>
    <circle cx="30" cy="30" r="9" fill="none" stroke="${p.c2}" stroke-opacity=".6" stroke-width=".9"/><circle cx="30" cy="30" r="3" fill="${p.c2}" fill-opacity=".8"/>
    ${[[0, 0], [60, 0], [0, 60], [60, 60]].map(([x, y]) => `<path d="M${x} ${y - 11}L${x + 11} ${y}L${x} ${y + 11}L${x - 11} ${y}Z" fill="none" stroke="${p.c2}" stroke-opacity=".7" stroke-width="1"/>`).join('')}
    <path d="M30 6V0M30 54V60M6 30H0M54 30H60" stroke="${p.c2}" stroke-opacity=".5" stroke-width="1"/></pattern></defs>`;
  s += `<rect width="${W}" height="${H}" fill="${p.c1}"/><rect width="${W}" height="${H}" fill="url(#${pt})"/>`;
  s += `<path d="${arch(0)}" fill="${p.c3}"/>`;
  /* soft paper shading inside */
  s += `<path d="${arch(14)}" fill="none" stroke="${p.c2}" stroke-width="2.2"/><path d="${arch(22)}" fill="none" stroke="${p.c1}" stroke-opacity=".5" stroke-width=".9"/>`;
  s += `<path d="${arch(0)}" fill="none" stroke="${p.c2}" stroke-width="3.4"/>`;
  /* finial */
  s += `<polygon points="${h.starPts(cx, 26, 19, 14.5, 8, -90)}" fill="${p.c2}" stroke="${p.c1}" stroke-width="2"/><circle cx="${cx}" cy="26" r="5.4" fill="${p.c1}"/>`;
  /* arabesque scrolls climbing the sides of the arch */
  const vine = (m) => {
    let d = '';
    for (let i = 0; i < 5; i++) {
      const y = 280 + i * 92, x = 78;
      d += `<path d="${spiral(x + 6, y, 3, 20, 1.6, m, i * 40)}" fill="none" stroke="${p.c2}" stroke-width="2" stroke-linecap="round"/>`;
      d += `<path d="M${x + 6} ${y + 40}C${x - 10} ${y + 18} ${x + 30} ${y + 8} ${x + 22} ${y - 14}" fill="none" stroke="${p.c2}" stroke-opacity=".6" stroke-width="1.4"/>`;
      d += `<ellipse cx="${x + 34}" cy="${y + 32}" rx="9" ry="3.8" transform="rotate(-38 ${x + 34} ${y + 32})" fill="${p.c2}" fill-opacity=".55"/>`;
    }
    return d;
  };
  s += `<g>${vine(1)}</g><g transform="translate(${W} 0) scale(-1 1)">${vine(1)}</g>`;
  /* bottom band: diamonds and stars */
  let bd = '';
  for (let x = 130; x <= W - 130; x += 36) bd += `<path d="M${x} ${H - 78}l7 7l-7 7l-7 -7Z" fill="${p.c2}" fill-opacity="${(x / 36) % 2 ? .85 : .35}"/>`;
  s += `<path d="M120 ${H - 98}H${W - 120}" stroke="${p.c2}" stroke-width="1.4"/>${bd}`;
  s += `<polygon points="${h.starPts(cx, H - 71, 12, 9.2, 8, -90)}" fill="${p.c1}" stroke="${p.c2}" stroke-width="1.6"/>`;
  /* inner corners of the panel */
  s += h.corners(W, H, 44, `<circle cx="0" cy="0" r="0"/>`);
  [[44, H - 44], [W - 44, H - 44]].forEach(([x, y]) => { s += `<polygon points="${h.starPts(x, y, 16, 12.2, 8, -90)}" fill="${p.c2}" stroke="${p.c1}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="4.4" fill="${p.c1}"/>`; });
  return s;
};

/* ───────────── 5 · التاريخ (عمودية) ───────────── */
D.history = function (W, H, p, h) {
  const R = h.rng(33), vg = h.nid('h'), cg = h.nid('h'), cx = W / 2;
  let s = `<defs>${rad(vg, cx, H / 2, Math.hypot(W, H) * .55, [[0, '#8B5A1F', 0], [.6, '#8B5A1F', .1], [1, '#3F2208', .62]])}
    ${linB(cg, 0, 0, 1, 0, [[0, '#A8884C'], [.35, '#F1E2B6'], [.65, '#F1E2B6'], [1, '#A8884C']])}</defs>`;
  s += `<rect width="${W}" height="${H}" fill="${p.c3}"/>`;
  for (let i = 0; i < 16; i++) s += `<ellipse cx="${r1(R() * W)}" cy="${r1(R() * H)}" rx="${r1(40 + R() * 120)}" ry="${r1(30 + R() * 90)}" fill="#8B5A1F" fill-opacity="${(.03 + R() * .06).toFixed(3)}"/>`;
  for (let i = 0; i < 150; i++) { const x = R() * W, y = R() * H, a = R() * PI, l = 4 + R() * 14; s += line(x, y, x + l * cos(a), y + l * sin(a), `stroke="#6B4A1F" stroke-opacity="${(.06 + R() * .1).toFixed(2)}" stroke-width=".8"`); }
  s += `<rect width="${W}" height="${H}" fill="url(#${vg})"/>`;
  /* compass rose watermark */
  const rx = cx, ry = H * .6;
  for (let i = 0; i < 16; i++) {
    const len = i % 4 === 0 ? 270 : i % 2 === 0 ? 205 : 140, a = rad2(i * 22.5 - 90), w = rad2(i % 2 ? 5 : 8);
    s += `<polygon points="${poly([[rx, ry], [rx + len * .22 * cos(a - w * 3), ry + len * .22 * sin(a - w * 3)], [rx + len * cos(a), ry + len * sin(a)], [rx + len * .22 * cos(a + w * 3), ry + len * .22 * sin(a + w * 3)]])}" fill="${p.c1}" fill-opacity="${i % 4 === 0 ? .1 : .06}" stroke="${p.c1}" stroke-opacity=".12" stroke-width="1"/>`;
  }
  [100, 150, 215, 270].forEach((r, i) => s += `<circle cx="${rx}" cy="${ry}" r="${r}" fill="none" stroke="${p.c1}" stroke-opacity="${i % 2 ? .08 : .13}" stroke-width="${i % 2 ? 1 : 1.8}"/>`);
  /* frame */
  s += `<rect x="22" y="22" width="${W - 44}" height="${H - 44}" fill="none" stroke="${p.c1}" stroke-width="6"/><rect x="34" y="34" width="${W - 68}" height="${H - 68}" fill="none" stroke="${p.c2}" stroke-width="1.6"/><rect x="40" y="40" width="${W - 80}" height="${H - 80}" fill="none" stroke="${p.c1}" stroke-width=".8"/>`;
  /* frieze bands with Greek key */
  [46, H - 82].forEach(y => { s += `<rect x="46" y="${y}" width="${W - 92}" height="36" fill="${p.c1}"/>` + meander(60, W - 60, y + 7, 22, `stroke="${h.shade(p.c2, .35)}" stroke-width="2.4" stroke-linejoin="miter"`); });
  s += h.corners(W, H, 22, `<rect width="52" height="52" fill="${p.c1}"/><rect x="7" y="7" width="38" height="38" fill="none" stroke="${p.c2}" stroke-width="1.6"/><circle cx="26" cy="26" r="9" fill="${p.c2}"/><circle cx="26" cy="26" r="4" fill="${p.c1}"/>`);
  /* columns */
  const col = x => {
    const w = 44, top = 100, bot = H - 100;
    let c = `<rect x="${x - 6}" y="${top}" width="${w + 12}" height="9" fill="#DCC48E" stroke="${p.c1}" stroke-width="1.4"/>`;
    c += `<path d="M${x - 2} ${top + 9}H${x + w + 2}L${x + w - 3} ${top + 24}H${x + 3}Z" fill="#CBB074" stroke="${p.c1}" stroke-width="1.2"/>`;
    c += `<rect x="${x}" y="${top + 24}" width="${w}" height="${bot - top - 48}" fill="url(#${cg})" stroke="${p.c1}" stroke-width="1.4"/>`;
    for (let k = 1; k < 5; k++) c += `<path d="M${x + w * k / 5} ${top + 28}V${bot - 28}" stroke="${p.c1}" stroke-opacity=".38" stroke-width="1.2"/>`;
    c += `<rect x="${x - 3}" y="${bot - 24}" width="${w + 6}" height="9" fill="#CBB074" stroke="${p.c1}" stroke-width="1.2"/><rect x="${x - 7}" y="${bot - 15}" width="${w + 14}" height="9" fill="#DCC48E" stroke="${p.c1}" stroke-width="1.4"/>`;
    return c;
  };
  s += col(54) + col(W - 54 - 44);
  /* laurel wreath + hourglass */
  const wy = 214, WR = 82;
  const branch = (m) => {
    let b = '';
    const n = 15;
    b += `<path d="M${r1(cx + m * WR * cos(rad2(100)))} ${r1(wy + WR * sin(rad2(100)))}A${WR} ${WR} 0 0 ${m > 0 ? 0 : 1} ${r1(cx + m * WR * cos(rad2(262)))} ${r1(wy + WR * sin(rad2(262)))}" fill="none" stroke="#6D5A1E" stroke-width="2"/>`;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1), a = rad2(100 + 162 * t), px = cx + m * WR * cos(a), py = wy + WR * sin(a), tg = m * (a + PI / 2) * 180 / PI - (m < 0 ? 180 : 0);
      const sz = 1 - .32 * t;
      [-1, 1].forEach(sd => {
        const ang = tg + sd * 38, lx = px + sd * 9 * cos(rad2(tg + 90)) * m, ly = py + sd * 9 * sin(rad2(tg + 90)) * m;
        b += `<ellipse cx="${r1(lx)}" cy="${r1(ly)}" rx="${r1(14 * sz)}" ry="${r1(5.4 * sz)}" transform="rotate(${r1(ang)} ${r1(lx)} ${r1(ly)})" fill="${i % 2 ? '#8A7A2A' : '#6D6A24'}" stroke="${p.c1}" stroke-opacity=".5" stroke-width=".8"/>`;
      });
    }
    return b;
  };
  s += branch(1) + branch(-1);
  s += `<circle cx="${cx}" cy="${wy - WR - 2}" r="0"/>`;
  s += `<g transform="translate(${cx} ${wy})"><circle r="60" fill="${p.c3}" fill-opacity=".7" stroke="${p.c2}" stroke-width="1.6"/>
    <path d="M-20 -38H20C20 -16 6 -5 3 0C6 5 20 16 20 38H-20C-20 16 -6 5 -3 0C-6 -5 -20 -16 -20 -38Z" fill="#FBF3DC" stroke="${p.c1}" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M-15 -34H15C13 -20 6 -12 0 -7C-6 -12 -13 -20 -15 -34Z" fill="${p.c2}" fill-opacity=".7"/><path d="M-17 36C-15 26 -8 22 0 14C8 22 15 26 17 36Z" fill="${p.c2}" fill-opacity=".85"/>
    <path d="M0 -6V12" stroke="${p.c2}" stroke-width="1.4"/>
    <rect x="-26" y="-46" width="52" height="8" rx="2" fill="${p.c1}"/><rect x="-26" y="38" width="52" height="8" rx="2" fill="${p.c1}"/></g>`;
  /* pediment line under the wreath */
  s += `<path d="M${cx - 150} 316H${cx + 150}" stroke="${p.c2}" stroke-width="1.2"/><path d="M${cx} 308L${cx + 8} 316L${cx} 324L${cx - 8} 316Z" fill="${p.c2}"/>`;
  return s;
};

/* ───────────── 6 · الفلسفة ───────────── */
D.philosophy = function (W, H, p, h) {
  const R = h.rng(45), cg = h.nid('p'), cx = W / 2;
  let s = `<defs>${linB(cg, 0, 0, 1, 0, [[0, '#BFC3C9'], [.3, '#F6F5F1'], [.7, '#F6F5F1'], [1, '#B3B8C0']])}</defs>`;
  s += `<rect width="${W}" height="${H}" fill="${p.c3}"/>`;
  /* marble veins */
  for (let i = 0; i < 18; i++) {
    let x = R() * W, y = R() * H, d = `M${r1(x)} ${r1(y)}`;
    for (let k = 0; k < 3; k++) { const dx = (R() - .35) * 240, dy = (R() - .5) * 200; d += `C${r1(x + dx * .3)} ${r1(y + dy * .1)} ${r1(x + dx * .7)} ${r1(y + dy * .9)} ${r1(x + dx)} ${r1(y + dy)}`; x += dx; y += dy; }
    s += `<path d="${d}" fill="none" stroke="#7D8696" stroke-opacity="${(.05 + R() * .1).toFixed(2)}" stroke-width="${(.6 + R() * 1.8).toFixed(1)}"/>`;
  }
  /* owl of Athena (line art watermark) */
  const owl = `<g transform="translate(${cx} ${H * .5}) scale(1.55)" fill="none" stroke="${p.c1}" stroke-opacity=".13" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M-78 -8C-92 70 -60 150 0 160C60 150 92 70 78 -8"/><path d="M-78 -62L-92 -114L-48 -88C-24 -98 24 -98 48 -88L92 -114L78 -62C88 -20 40 8 0 8C-40 8 -88 -20 -78 -62Z"/>
    <circle cx="-38" cy="-50" r="30"/><circle cx="38" cy="-50" r="30"/><circle cx="-38" cy="-50" r="19"/><circle cx="38" cy="-50" r="19"/><circle cx="-38" cy="-50" r="8"/><circle cx="38" cy="-50" r="8"/>
    <path d="M0 -34L-10 -12L0 4L10 -12Z"/><path d="M-78 0C-112 54 -100 122 -50 152M78 0C112 54 100 122 50 152"/>
    ${[0, 1, 2, 3, 4].map(j => [0, 1, 2].map(k => `<path d="M${-26 + k * 26 - (j % 2) * 13} ${34 + j * 22}a13 13 0 0 0 26 0"/>`).join('')).join('')}
    <path d="M-34 156L-34 168M-24 158L-24 170M-14 158L-14 170M14 158L14 170M24 158L24 170M34 156L34 168"/><path d="M-130 170H130"/></g>`;
  s += owl;
  /* frame */
  s += `<rect x="16" y="16" width="${W - 32}" height="${H - 32}" fill="none" stroke="${p.c1}" stroke-width="8"/><rect x="30" y="30" width="${W - 60}" height="${H - 60}" fill="none" stroke="${p.c2}" stroke-width="1.6"/>`;
  [38, H - 66].forEach(y => { s += `<rect x="30" y="${y}" width="${W - 60}" height="28" fill="${p.c1}"/>` + meander(110, W - 110, y + 5, 18, `stroke="${p.c2}" stroke-width="2.2"`); });
  /* Ionic columns */
  const col = x => {
    const w = 42, top = 176, bot = H - 100;
    let c = `<rect x="${x - 4}" y="${top - 26}" width="${w + 8}" height="8" fill="#E8E4D8" stroke="${p.c1}" stroke-width="1.4"/>`;
    c += `<rect x="${x - 10}" y="${top - 18}" width="${w + 20}" height="14" rx="7" fill="#F2EFE6" stroke="${p.c1}" stroke-width="1.4"/>`;
    c += `<path d="${spiral(x - 6, top - 11, 1.5, 7, 2, 1, 0)}" fill="none" stroke="${p.c2}" stroke-width="1.6"/><path d="${spiral(x + w + 6, top - 11, 1.5, 7, 2, -1, 180)}" fill="none" stroke="${p.c2}" stroke-width="1.6"/>`;
    c += `<path d="M${x} ${top - 4}H${x + w}L${x + w - 3} ${top + 6}H${x + 3}Z" fill="#DAD5C6" stroke="${p.c1}" stroke-width="1.2"/>`;
    c += `<rect x="${x}" y="${top + 6}" width="${w}" height="${bot - top - 24}" fill="url(#${cg})" stroke="${p.c1}" stroke-width="1.4"/>`;
    for (let k = 1; k < 6; k++) c += `<path d="M${x + w * k / 6} ${top + 10}V${bot - 22}" stroke="${p.c1}" stroke-opacity=".3" stroke-width="1.1"/>`;
    c += `<rect x="${x - 4}" y="${bot - 18}" width="${w + 8}" height="8" rx="3" fill="#DAD5C6" stroke="${p.c1}" stroke-width="1.2"/><rect x="${x - 9}" y="${bot - 10}" width="${w + 18}" height="10" fill="#E8E4D8" stroke="${p.c1}" stroke-width="1.4"/>`;
    return c;
  };
  s += col(50) + col(W - 50 - 42);
  /* gold garland between the columns at the top */
  s += `<path d="M${cx - 180} 104H${cx + 180}" stroke="${p.c2}" stroke-width="1.2"/>` + [-1, 1].map(m => `<path d="M${cx} 104L${cx + m * 170} 104" stroke="${p.c2}" stroke-width="0"/>`).join('') + `<path d="M${cx} 96L${cx + 9} 104L${cx} 112L${cx - 9} 104Z" fill="${p.c2}"/><circle cx="${cx - 24}" cy="104" r="3" fill="${p.c2}"/><circle cx="${cx + 24}" cy="104" r="3" fill="${p.c2}"/>`;
  s += `<path d="M${cx - 180} ${H - 106}H${cx + 180}" stroke="${p.c2}" stroke-width="1.2"/><path d="M${cx} ${H - 114}L${cx + 9} ${H - 106}L${cx} ${H - 98}L${cx - 9} ${H - 106}Z" fill="${p.c2}"/>`;
  s += h.corners(W, H, 16, `<rect x="2" y="2" width="22" height="22" fill="${p.c2}" stroke="${p.c1}" stroke-width="2"/><circle cx="13" cy="13" r="4" fill="${p.c1}"/>`);
  return s;
};

/* ───────────── 7 · الفلك والفضاء (عمودية) ───────────── */
D.astro = function (W, H, p, h) {
  const R = h.rng(57), bg = h.nid('s'), n1 = h.nid('s'), n2 = h.nid('s'), n3 = h.nid('s'), pl = h.nid('s'), hz = h.nid('s'), sh = h.nid('s'), fr = h.nid('s');
  let s = `<defs>${lin(bg, 0, 0, 0, H, [[0, h.shade(p.c1, -.2)], [.5, h.shade(p.c1, .22)], [1, h.shade(p.c1, .05)]])}
    ${rad(n1, W * .22, H * .3, 420, [[0, '#C2409B', .42], [1, '#C2409B', 0]])}${rad(n2, W * .85, H * .52, 460, [[0, '#2F6BFF', .34], [1, '#2F6BFF', 0]])}${rad(n3, W * .4, H * .85, 400, [[0, '#2EC4B6', .2], [1, '#2EC4B6', 0]])}
    ${rad(pl, 0, 0, 1, [[0, '#FFE2B0'], [.45, '#E08A6A'], [1, '#6A2F7E']])}${rad(hz, W / 2, H + 620, 700, [[0, '#07061C'], [1, '#150F3D']])}
    ${lin(sh, W * .62 - 120, 112, W * .62, 52, [[0, '#FFFFFF', 0], [1, '#FFFFFF', .95]])}${lin(fr, 0, 0, W, H, [[0, p.c2], [.5, '#F7E3A8'], [1, p.c2]])}</defs>`;
  s += `<rect width="${W}" height="${H}" fill="url(#${bg})"/><rect width="${W}" height="${H}" fill="url(#${n1})"/><rect width="${W}" height="${H}" fill="url(#${n2})"/><rect width="${W}" height="${H}" fill="url(#${n3})"/>`;
  /* stars */
  for (let i = 0; i < 260; i++) s += `<circle cx="${r1(R() * W)}" cy="${r1(R() * H)}" r="${(.5 + R() * 1.3).toFixed(1)}" fill="#FFFFFF" fill-opacity="${(.25 + R() * .7).toFixed(2)}"/>`;
  for (let i = 0; i < 26; i++) {
    const x = R() * W, y = R() * H, l = 5 + R() * 9;
    s += `<path d="M${r1(x)} ${r1(y - l)}Q${r1(x)} ${r1(y)} ${r1(x + l)} ${r1(y)}Q${r1(x)} ${r1(y)} ${r1(x)} ${r1(y + l)}Q${r1(x)} ${r1(y)} ${r1(x - l)} ${r1(y)}Q${r1(x)} ${r1(y)} ${r1(x)} ${r1(y - l)}Z" fill="#FFFFFF" fill-opacity="${(.5 + R() * .45).toFixed(2)}"/>`;
  }
  /* orbits */
  const ox = W / 2, oy = H * .52;
  [190, 285, 380, 480].forEach((r, i) => {
    s += `<circle cx="${ox}" cy="${oy}" r="${r}" fill="none" stroke="#FFFFFF" stroke-opacity=".1" stroke-width="1.2" stroke-dasharray="${i % 2 ? '3 9' : '1 0'}"/>`;
    const a = rad2(30 + i * 83); s += `<circle cx="${r1(ox + r * cos(a))}" cy="${r1(oy + r * sin(a))}" r="${4 + i}" fill="${i % 2 ? '#9FD4FF' : p.c2}" fill-opacity=".85"/>`;
  });
  /* constellation (top left) */
  const cn = [[96, 330], [150, 292], [214, 318], [262, 270], [326, 296], [372, 244]];
  s += `<path d="M${poly(cn).replace(/ /g, 'L')}" fill="none" stroke="#FFFFFF" stroke-opacity=".38" stroke-width="1.2"/>` + cn.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="9" fill="${p.c2}" fill-opacity=".16"/><circle cx="${x}" cy="${y}" r="${i % 2 ? 3 : 4.2}" fill="#FFF6D8"/>`).join('');
  /* crescent moon */
  const mx = 118, my = 118, mr = 38;
  s += `<circle cx="${mx}" cy="${my}" r="62" fill="${p.c2}" fill-opacity=".1"/><path d="M${mx} ${my - mr}A${mr} ${mr} 0 1 0 ${mx} ${my + mr}A${mr * 1.32} ${mr * 1.32} 0 0 1 ${mx} ${my - mr}Z" fill="#FFE9B0"/>`;
  /* ringed planet */
  const px = W - 128, py = 138, pr = 62;
  s += `<g transform="translate(${px} ${py}) rotate(-18)"><ellipse rx="128" ry="26" fill="none" stroke="#F2C98A" stroke-opacity=".55" stroke-width="13"/><ellipse rx="128" ry="26" fill="none" stroke="#7A4A8A" stroke-opacity=".5" stroke-width="2"/></g>`;
  s += `<g transform="translate(${px} ${py}) scale(${pr})"><circle r="1" fill="url(#${pl})"/></g><path d="M${px - 40} ${py - 40}A${pr} ${pr} 0 0 1 ${px + 48} ${py - 28}" fill="none" stroke="#FFFFFF" stroke-opacity=".28" stroke-width="3" stroke-linecap="round"/>`;
  s += `<g transform="translate(${px} ${py}) rotate(-18)"><path d="M-128 0A128 26 0 0 0 128 0" fill="none" stroke="#F2C98A" stroke-opacity=".85" stroke-width="13"/><path d="M-128 0A128 26 0 0 0 128 0" fill="none" stroke="#7A4A8A" stroke-opacity=".6" stroke-width="2"/></g>`;
  /* shooting star */
  s += `<path d="M${r1(W * .62)} 52L${r1(W * .62 - 120)} 112" stroke="url(#${sh})" stroke-width="2.6" stroke-linecap="round"/><circle cx="${r1(W * .62)}" cy="52" r="3" fill="#FFFFFF"/>`;
  /* planet horizon */
  s += `<circle cx="${W / 2}" cy="${H + 620}" r="700" fill="url(#${hz})"/><circle cx="${W / 2}" cy="${H + 620}" r="700" fill="none" stroke="#7FD6FF" stroke-opacity=".16" stroke-width="22"/><circle cx="${W / 2}" cy="${H + 620}" r="700" fill="none" stroke="#9FE3FF" stroke-opacity=".7" stroke-width="3"/>`;
  /* frame */
  s += `<rect x="26" y="26" width="${W - 52}" height="${H - 52}" fill="none" stroke="url(#${fr})" stroke-width="1.8"/><rect x="34" y="34" width="${W - 68}" height="${H - 68}" fill="none" stroke="url(#${fr})" stroke-opacity=".4" stroke-width=".9"/>`;
  s += h.corners(W, H, 26, `<polygon points="${h.starPts(0, 0, 16, 5, 4, -90)}" fill="${p.c2}"/>`);
  return s;
};

/* ───────────── 8 · الكيمياء ───────────── */
D.chem = function (W, H, p, h) {
  const R = h.rng(61), lq = h.nid('c'), gl = h.nid('c'), bl = h.nid('c');
  let s = `<defs>${linB(lq, 0, 0, 0, 1, [[0, h.shade(p.c2, .25)], [1, p.c2]])}${linB(gl, 0, 0, 1, 0, [[0, '#FFFFFF', .7], [.5, '#FFFFFF', .15], [1, '#FFFFFF', .6]])}${radB(bl, .35, .3, .8, [[0, '#FFFFFF'], [.35, h.shade(p.c1, .45)], [1, p.c1]])}</defs>`;
  s += `<rect width="${W}" height="${H}" fill="${p.c3}"/>`;
  /* honeycomb bands */
  const hr = 19, dx = hr * Math.sqrt(3), dy = hr * 1.5;
  const hexAt = (x, y, k) => {
    const v = R(), w = 1 - k * .85;
    if (v > w) return '';
    const hp = poly(ngon(x, y, hr - 2, 6, -90));
    const t = R();
    if (t < .5) return `<polygon points="${hp}" fill="${p.c1}" fill-opacity="${(.06 + R() * .14).toFixed(2)}" stroke="${p.c1}" stroke-opacity=".3" stroke-width="1"/>`;
    if (t < .75) return `<polygon points="${hp}" fill="none" stroke="${p.c1}" stroke-opacity=".45" stroke-width="1.3"/>`;
    if (t < .9) return `<polygon points="${hp}" fill="${p.c2}" fill-opacity="${(.4 + R() * .35).toFixed(2)}" stroke="${p.c2}" stroke-width="1"/>`;
    return `<polygon points="${hp}" fill="${p.c1}" fill-opacity=".78"/>`;
  };
  for (let row = 0, y = 24; y < H - 20; row++, y += dy) for (let c = 0; c < 4; c++) {
    const xl = 28 + c * dx + (row % 2 ? dx / 2 : 0), k = c / 4;
    s += hexAt(xl, y, k * .8) + hexAt(W - xl, y, k * .8);
  }
  /* benzene ring (left band) */
  const bx = 78, by = H * .5, br = 44;
  const bp = ngon(bx, by, br, 6, -90);
  s += `<circle cx="${bx}" cy="${by}" r="${br + 26}" fill="${p.c3}" fill-opacity=".92"/><polygon points="${poly(bp)}" fill="none" stroke="${p.c1}" stroke-width="3.2" stroke-linejoin="round"/>`;
  s += `<polygon points="${poly(ngon(bx, by, br - 11, 6, -90))}" fill="none" stroke="${p.c1}" stroke-opacity=".0"/>`;
  [[0, 1], [2, 3], [4, 5]].forEach(([a, b]) => { const A = bp[a], B = bp[b], m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], c = [bx, by]; const k = .8; s += line(A[0] + (c[0] - A[0]) * (1 - k) * .5 - (A[0] - c[0]) * 0 + (c[0] - A[0]) * .17, A[1] + (c[1] - A[1]) * .17, B[0] + (c[0] - B[0]) * .17, B[1] + (c[1] - B[1]) * .17, `stroke="${p.c1}" stroke-width="2.6" stroke-linecap="round"`); });
  bp.forEach(([x, y], i) => { const a = rad2(-90 + i * 60), ex = x + 20 * cos(a), ey = y + 20 * sin(a); s += line(x, y, ex, ey, `stroke="${p.c1}" stroke-width="2.4"`) + `<circle cx="${r1(ex)}" cy="${r1(ey)}" r="${i % 2 ? 6.5 : 9}" fill="${i % 2 ? p.c2 : 'url(#' + bl + ')'}" stroke="${p.c1}" stroke-width="1.2"/>`; });
  /* Erlenmeyer flask + test tubes (right band) */
  const fx = W - 84, fy = 258;
  s += `<g transform="translate(${fx} ${fy}) scale(1.05)"><path d="M-15 -150H15V-100L55 -14Q58 0 44 0H-44Q-58 0 -55 -14L-15 -100Z" fill="#FFFFFF" fill-opacity=".85" stroke="${p.c1}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M-39 -48Q0 -40 39 -48L55 -14Q58 0 44 0H-44Q-58 0 -55 -14Z" fill="url(#${lq})" fill-opacity=".92"/><path d="M-39 -48Q0 -40 39 -48" fill="none" stroke="${p.c1}" stroke-opacity=".5" stroke-width="1.4"/>
    <rect x="-20" y="-156" width="40" height="8" rx="3" fill="${p.c1}"/><path d="M-9 -138V-104" stroke="url(#${gl})" stroke-width="5" stroke-linecap="round"/>
    ${[[-14, -62, 4.5], [10, -78, 3.2], [20, -100, 2.4], [-4, -94, 2]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFFFFF" fill-opacity=".85" stroke="${p.c1}" stroke-opacity=".6" stroke-width="1"/>`).join('')}</g>`;
  [[-34, p.c2, 40], [0, p.c1, 55], [34, '#3FB6A8', 30]].forEach(([dxx, col, lv]) => {
    const tx = W - 84 + dxx, ty = H * .5 + 190;
    s += `<g transform="translate(${tx} ${ty})"><path d="M-11 -92V-14A11 11 0 0 0 11 -14V-92" fill="#FFFFFF" fill-opacity=".85" stroke="${p.c1}" stroke-width="2.6" stroke-linecap="round"/><path d="M-9 ${-lv - 30}H9V-14A9 9 0 0 1 -9 -14Z" fill="${col}" fill-opacity=".88"/><rect x="-14" y="-96" width="28" height="6" rx="3" fill="${p.c1}"/></g>`;
  });
  s += `<path d="M${W - 138} ${H * .5 + 196}H${W - 30}" stroke="${p.c1}" stroke-width="3" stroke-linecap="round"/>`;
  /* element tiles strip */
  const tiles = 14, tw = 36, th = 40, sx = (W - tiles * (tw + 6)) / 2;
  for (let i = 0; i < tiles; i++) {
    const x = sx + i * (tw + 6), y = H - 66, c = [p.c1, p.c2, '#3FB6A8', '#6C8EBF'][i % 4];
    s += `<rect x="${r1(x)}" y="${y}" width="${tw}" height="${th}" rx="4" fill="${c}" fill-opacity=".14" stroke="${c}" stroke-width="1.4"/><path d="M${r1(x + 6)} ${y + 8}H${r1(x + 14)}M${r1(x + 6)} ${y + th - 8}H${r1(x + tw - 6)}" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/><circle cx="${r1(x + tw - 9)}" cy="${y + 11}" r="2.6" fill="${c}"/>`;
  }
  /* frame */
  s += `<rect x="18" y="18" width="${W - 36}" height="${H - 36}" rx="10" fill="none" stroke="${p.c1}" stroke-width="2.6"/><rect x="26" y="26" width="${W - 52}" height="${H - 52}" rx="6" fill="none" stroke="${p.c2}" stroke-width="1"/>`;
  return s;
};

/* ───────────── 9 · الطاقة والكهرباء ───────────── */
D.circuit = function (W, H, p, h) {
  const R = h.rng(73), bg = h.nid('e'), tr = '#36E0A8';
  let s = `<defs>${rad(bg, W / 2, H / 2, Math.max(W, H) * .7, [[0, h.shade(p.c1, .22)], [1, h.shade(p.c1, -.4)]])}</defs>`;
  s += `<rect width="${W}" height="${H}" fill="url(#${bg})"/>`;
  s += `<g transform="translate(${W / 2} ${H / 2}) scale(1.9)"><path d="M20 -150L-62 12H-6L-32 150L70 -34H12Z" fill="${p.c2}" fill-opacity=".05" stroke="${p.c2}" stroke-opacity=".12" stroke-width="2" stroke-linejoin="round"/></g>`;
  /* PCB traces in the margins (never inside the text area) */
  const inside = (x, y) => x > 152 && x < W - 152 && y > 96 && y < H - 96;
  const dirs = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  const trace = (x, y, d0, col) => {
    let pts = [[x, y]], d = d0, ok = true;
    const segs = 3 + Math.floor(R() * 4);
    for (let i = 0; i < segs && ok; i++) {
      const L = 14 * (2 + Math.floor(R() * 6)), v = dirs[d], nx = x + v[0] * L * (v[0] && v[1] ? .72 : 1), ny = y + v[1] * L * (v[0] && v[1] ? .72 : 1);
      if (nx < 40 || nx > W - 40 || ny < 40 || ny > H - 40 || inside(nx, ny)) { ok = false; break; }
      x = nx; y = ny; pts.push([x, y]);
      d = (d + (R() > .5 ? 1 : 7)) % 8;
    }
    if (pts.length < 2) return '';
    const e = pts[pts.length - 1];
    return `<path d="M${poly(pts).replace(/ /g, 'L')}" fill="none" stroke="${col}" stroke-opacity=".55" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${r1(e[0])}" cy="${r1(e[1])}" r="5.6" fill="${p.c1}" stroke="${col}" stroke-opacity=".9" stroke-width="2"/><circle cx="${r1(e[0])}" cy="${r1(e[1])}" r="1.8" fill="${col}"/>`;
  };
  for (let i = 0; i < 46; i++) {
    const side = i % 4, x = side < 2 ? 56 + Math.floor(R() * 7) * 14 : 56 + Math.floor(R() * 70) * 14, y = side < 2 ? 56 + Math.floor(R() * 48) * 14 : (side === 2 ? 52 + Math.floor(R() * 2) * 14 : H - 52 - Math.floor(R() * 2) * 14);
    const xx = side === 1 ? W - x : x;
    if (inside(xx, y)) continue;
    s += trace(xx, y, side === 1 ? [4, 3, 5][i % 3] : side === 0 ? [0, 1, 7][i % 3] : side === 2 ? [2, 1, 3][i % 3] : [6, 5, 7][i % 3], i % 5 === 0 ? p.c2 : tr);
  }
  /* chips */
  const chip = (x, y, w, hh) => {
    let c = `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="5" fill="${h.shade(p.c1, .14)}" stroke="${tr}" stroke-opacity=".85" stroke-width="2"/><circle cx="${x + 12}" cy="${y + 12}" r="3.6" fill="${tr}"/><rect x="${x + 14}" y="${y + 14}" width="${w - 28}" height="${hh - 28}" rx="3" fill="none" stroke="${tr}" stroke-opacity=".4" stroke-width="1"/>`;
    for (let i = 0; i < 6; i++) { const t = (i + .5) / 6; c += `<rect x="${r1(x + w * t - 3)}" y="${y - 9}" width="6" height="9" fill="${p.c2}" fill-opacity=".85"/><rect x="${r1(x + w * t - 3)}" y="${y + hh}" width="6" height="9" fill="${p.c2}" fill-opacity=".85"/>`; }
    for (let i = 0; i < 4; i++) { const t = (i + .5) / 4; c += `<rect x="${x - 9}" y="${r1(y + hh * t - 3)}" width="9" height="6" fill="${p.c2}" fill-opacity=".85"/><rect x="${x + w}" y="${r1(y + hh * t - 3)}" width="9" height="6" fill="${p.c2}" fill-opacity=".85"/>`; }
    return c;
  };
  s += chip(W - 190, 52, 110, 62) + chip(42, H - 124, 92, 56);
  /* three-phase sine waves */
  [[p.c2, 0], ['#36E0A8', 2 * PI / 3], ['#FF6B6B', 4 * PI / 3]].forEach(([c, ph]) => { s += `<path d="${wave(210, W - 210, H - 48, 11, 170, ph)}" fill="none" stroke="${c}" stroke-opacity=".8" stroke-width="2"/>`; });
  [[p.c2, 0], ['#36E0A8', 2 * PI / 3], ['#FF6B6B', 4 * PI / 3]].forEach(([c, ph]) => { s += `<path d="${wave(300, W - 300, 52, 7, 130, ph)}" fill="none" stroke="${c}" stroke-opacity=".55" stroke-width="1.6"/>`; });
  /* frame */
  s += `<path d="${chamfer(W, H, 20, 32)}" fill="none" stroke="${p.c2}" stroke-width="2.6"/><path d="${chamfer(W, H, 30, 26)}" fill="none" stroke="${tr}" stroke-opacity=".45" stroke-width="1"/>`;
  [[20 + 32, 20], [W - 20 - 32, 20], [20 + 32, H - 20], [W - 20 - 32, H - 20]].forEach(([x, y]) => { s += `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" fill="${p.c2}"/>`; });
  return s;
};

/* ───────────── 10 · علوم الحياة ───────────── */
D.bio = function (W, H, p, h) {
  const R = h.rng(89), cl = h.nid('b'), nu = h.nid('b');
  let s = `<defs>${radB(cl, .4, .35, .8, [[0, '#FFFFFF', .9], [1, p.c1, .22]])}${radB(nu, .4, .35, .8, [[0, '#FFE7B0'], [1, p.c2]])}</defs>`;
  s += `<rect width="${W}" height="${H}" fill="${p.c3}"/>`;
  /* giant cell watermark */
  const cx = W / 2, cy = H / 2;
  s += `<circle cx="${cx}" cy="${cy}" r="250" fill="${p.c1}" fill-opacity=".03" stroke="${p.c1}" stroke-opacity=".1" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="236" fill="none" stroke="${p.c1}" stroke-opacity=".06" stroke-width="1" stroke-dasharray="3 6"/><circle cx="${cx + 20}" cy="${cy - 10}" r="74" fill="${p.c2}" fill-opacity=".07" stroke="${p.c2}" stroke-opacity=".18" stroke-width="2"/>`;
  for (let i = 0; i < 26; i++) { const a = R() * 2 * PI, r = 100 + R() * 120; s += `<ellipse cx="${r1(cx + r * cos(a))}" cy="${r1(cy + r * sin(a))}" rx="${r1(8 + R() * 14)}" ry="${r1(5 + R() * 8)}" transform="rotate(${r1(R() * 180)} ${r1(cx + r * cos(a))} ${r1(cy + r * sin(a))})" fill="${p.c1}" fill-opacity=".05" stroke="${p.c1}" stroke-opacity=".1" stroke-width="1"/>`; }
  /* DNA double helix (left band) */
  const dnaX = 72, y0 = 56, y1 = H - 56, wl = 176, amp = 32, cols = [p.c1, p.c2, '#3B8EA5', '#C9503F'];
  const strand = (ph) => {
    const front = [], back = []; let cur = null, curF = null;
    for (let y = y0; y <= y1; y += 3) {
      const t = (y - y0) / wl * 2 * PI + ph, x = dnaX + amp * sin(t), f = cos(t) > 0;
      if (curF !== f) { if (cur) (curF ? front : back).push(cur); cur = []; curF = f; if (cur) { /* join */ } }
      cur.push([x, y]);
    }
    if (cur) (curF ? front : back).push(cur);
    return { front: front.map(a => 'M' + poly(a).replace(/ /g, 'L')).join(''), back: back.map(a => 'M' + poly(a).replace(/ /g, 'L')).join('') };
  };
  const A = strand(0), B = strand(PI);
  s += `<path d="${A.back}" fill="none" stroke="${p.c1}" stroke-opacity=".45" stroke-width="6" stroke-linecap="round"/><path d="${B.back}" fill="none" stroke="${p.c2}" stroke-opacity=".5" stroke-width="6" stroke-linecap="round"/>`;
  for (let y = y0 + 6, i = 0; y <= y1; y += 13, i++) {
    const t = (y - y0) / wl * 2 * PI, xa = dnaX + amp * sin(t), xb = dnaX - amp * sin(t), c = cols[i % 4];
    s += line(xa, y, xb, y, `stroke="${c}" stroke-opacity=".8" stroke-width="3.2" stroke-linecap="round"`);
  }
  s += `<path d="${B.front}" fill="none" stroke="${p.c2}" stroke-width="6" stroke-linecap="round"/><path d="${A.front}" fill="none" stroke="${p.c1}" stroke-width="6" stroke-linecap="round"/>`;
  /* fern branch (right band) */
  const stem = [[W - 56, H - 70], [W - 78, H * .62], [W - 60, H * .4], [W - 84, H * .2], [W - 70, 70]];
  s += `<path d="M${stem[0][0]} ${stem[0][1]}C${stem[1][0]} ${stem[1][1]} ${stem[1][0]} ${stem[2][1]} ${stem[2][0]} ${stem[2][1]}S${stem[3][0]} ${stem[3][1]} ${stem[4][0]} ${stem[4][1]}" fill="none" stroke="${p.c1}" stroke-width="3.4" stroke-linecap="round"/>`;
  for (let i = 0; i < 17; i++) {
    const t = i / 16, y = H - 92 - t * (H - 170), x = W - 66 - 12 * sin(t * 5.2), L = 58 - 34 * t;
    [-1, 1].forEach(sd => {
      const ang = sd * (58 - 14 * t) - 90, ex = x + L * cos(rad2(ang)) * 1, ey = y + L * sin(rad2(ang)) * 1;
      s += `<ellipse cx="${r1((x + ex) / 2)}" cy="${r1((y + ey) / 2)}" rx="${r1(L / 2)}" ry="${r1(8 - 3 * t)}" transform="rotate(${r1(ang)} ${r1((x + ex) / 2)} ${r1((y + ey) / 2)})" fill="${i % 2 ? p.c1 : h.shade(p.c1, .25)}" fill-opacity=".85"/>` + line(x, y, ex, ey, `stroke="${p.c3}" stroke-opacity=".7" stroke-width="1.2"`);
    });
  }
  /* cell cluster (top right and bottom left) */
  const cell = (x, y, r, k) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${cl})" stroke="${p.c1}" stroke-width="2.2"/><circle cx="${r1(x + r * .12)}" cy="${r1(y - r * .08)}" r="${r1(r * .38)}" fill="url(#${nu})" stroke="${p.c2}" stroke-width="1.6"/>` + [0, 1, 2, 3, 4].map(i => { const a = i * 1.3 + k; return `<circle cx="${r1(x + r * .62 * cos(a))}" cy="${r1(y + r * .62 * sin(a))}" r="${r1(r * .09)}" fill="${cols[i % 4]}" fill-opacity=".85"/>`; }).join('');
  s += cell(W - 200, 96, 34, 0) + cell(W - 148, 136, 22, 2) + cell(W - 238, 134, 16, 4) ;
  /* frame (rounded, organic) */
  s += `<rect x="20" y="20" width="${W - 40}" height="${H - 40}" rx="34" fill="none" stroke="${p.c1}" stroke-width="2.8"/><rect x="29" y="29" width="${W - 58}" height="${H - 58}" rx="26" fill="none" stroke="${p.c2}" stroke-width="1.1"/>`;
  s += h.corners(W, H, 20, `<path d="M6 6C34 8 56 26 62 56C32 54 10 36 6 6Z" fill="${p.c1}" fill-opacity=".9"/><path d="M8 8C30 20 44 34 54 52" fill="none" stroke="${p.c3}" stroke-width="1.4"/>`);
  return s;
};

/* =========================================================
   Template list (same shape as TEMPLATES in app.js)
   ========================================================= */
const templates = [
  { id:'atom', cat:'science', o:'l', premium:true, dark:true, caps:true, name:{ ar:'الفيزياء الذرية', fr:'Physique atomique', en:'Atomic Physics' },
    pal:{ c1:'#0A1236', c2:'#38D8F5', c3:'#F7C85A', bg:'#0A1236' }, f:{ ar:['Reem Kufi', 'Reem Kufi', 'Cairo'], lat:['Orbitron', 'Montserrat', 'Montserrat'] } },
  { id:'gears', cat:'science', o:'l', premium:true, caps:true, name:{ ar:'الهندسة الميكانيكية', fr:'Génie mécanique', en:'Mechanical Engineering' },
    pal:{ c1:'#2E3440', c2:'#E8742A', c3:'#F4F0E6' }, f:{ ar:['Reem Kufi', 'Cairo', 'Cairo'], lat:['Montserrat', 'Montserrat', 'Montserrat'] } },
  { id:'math', cat:'science', o:'l', premium:true, name:{ ar:'الرياضيات', fr:'Mathématiques', en:'Mathematics' },
    pal:{ c1:'#1F3A93', c2:'#D64541', c3:'#FDFBF4' }, f:{ ar:['El Messiri', 'Aref Ruqaa', 'Tajawal'], lat:['Playfair Display', 'Great Vibes', 'Montserrat'] } },
  { id:'arabic', cat:'science', o:'l', premium:true, name:{ ar:'اللغة العربية', fr:'Langue arabe', en:'Arabic Language' },
    pal:{ c1:'#12395B', c2:'#C79A3B', c3:'#FBF4E3' }, f:{ ar:['Aref Ruqaa', 'Aref Ruqaa', 'Amiri'], lat:['Cinzel', 'Pinyon Script', 'Cormorant Garamond'] } },
  { id:'history', cat:'science', o:'p', premium:true, caps:true, name:{ ar:'التاريخ', fr:'Histoire', en:'History' },
    pal:{ c1:'#5A1E1E', c2:'#9A6B1E', c3:'#EBDAB0' }, f:{ ar:['Aref Ruqaa', 'Amiri', 'Amiri'], lat:['Cinzel', 'Cormorant Garamond', 'Cormorant Garamond'] } },
  { id:'philosophy', cat:'science', o:'l', premium:true, caps:true, name:{ ar:'الفلسفة', fr:'Philosophie', en:'Philosophy' },
    pal:{ c1:'#1D2B53', c2:'#B8913A', c3:'#F5F2EA' }, f:{ ar:['Amiri', 'Aref Ruqaa', 'Amiri'], lat:['Marcellus', 'Cormorant Garamond', 'Cormorant Garamond'] } },
  { id:'astro', cat:'science', o:'p', premium:true, dark:true, caps:true, name:{ ar:'الفلك والفضاء', fr:'Astronomie', en:'Astronomy' },
    pal:{ c1:'#0B0A2A', c2:'#F3C969', c3:'#C9BBFF', bg:'#0B0A2A' }, f:{ ar:['El Messiri', 'Aref Ruqaa', 'Tajawal'], lat:['Cinzel', 'Great Vibes', 'Montserrat'] } },
  { id:'chem', cat:'science', o:'l', premium:true, name:{ ar:'الكيمياء', fr:'Chimie', en:'Chemistry' },
    pal:{ c1:'#0B4F5C', c2:'#F28C28', c3:'#F3FAF8' }, f:{ ar:['El Messiri', 'El Messiri', 'Tajawal'], lat:['Montserrat', 'Montserrat', 'Montserrat'] } },
  { id:'circuit', cat:'science', o:'l', premium:true, dark:true, caps:true, name:{ ar:'الطاقة والكهرباء', fr:'Énergie et électricité', en:'Electrical Energy' },
    pal:{ c1:'#06211D', c2:'#FFCB2E', c3:'#36E0A8', bg:'#06211D' }, f:{ ar:['Reem Kufi', 'Reem Kufi', 'Cairo'], lat:['Orbitron', 'Montserrat', 'Montserrat'] } },
  { id:'bio', cat:'science', o:'l', premium:true, name:{ ar:'علوم الحياة', fr:'Sciences de la vie', en:'Life Sciences' },
    pal:{ c1:'#1D6B46', c2:'#E8A33A', c3:'#F1F7EC' }, f:{ ar:['El Messiri', 'Aref Ruqaa', 'Tajawal'], lat:['Playfair Display', 'Great Vibes', 'Montserrat'] } }
];

/* =========================================================
   Sample content per template (shown until the user edits)
   ========================================================= */
const S = {
  atom: {
    ar: { org:'قسم الفيزياء — كلية العلوم', orgSub:'جامعة العلوم والتكنولوجيا', title:'شهادة تفوّق في الفيزياء الذرية', intro:'تُمنح هذه الشهادة إلى الطالب', detail:'ماستر فيزياء المادة — دفعة 2026',
      body:'تقديرًا لتفوّقه في مقياس الفيزياء الذرية والنووية، وحسن فهمه للنموذج الذري وتفسير الأطياف، مع خالص التمنيات بمزيد من الاكتشاف والإبداع العلمي.', signerTitle:'رئيس القسم' },
    fr: { org:'Département de physique — Faculté des sciences', orgSub:'Université des Sciences et de la Technologie', title:'Certificat d’excellence en physique atomique', intro:'Ce certificat est décerné à l’étudiant', detail:'Master physique de la matière — promotion 2026',
      body:'En reconnaissance de son excellence en physique atomique et nucléaire, de sa maîtrise du modèle atomique et de l’interprétation des spectres, avec nos vœux de nouvelles découvertes.', signerTitle:'Chef de département' },
    en: { org:'Department of Physics — Faculty of Sciences', orgSub:'University of Science and Technology', title:'Certificate of Excellence in Atomic Physics', intro:'This certificate is awarded to', detail:'MSc Condensed Matter Physics — Class of 2026',
      body:'In recognition of outstanding achievement in atomic and nuclear physics, a deep grasp of the atomic model and spectral analysis, with every wish for further discovery.', signerTitle:'Head of Department' }
  },
  gears: {
    ar: { org:'المدرسة الوطنية للهندسة الميكانيكية', orgSub:'قسم التصميم والإنتاج', title:'شهادة تميّز في الهندسة الميكانيكية', intro:'تشهد اللجنة العلمية بتميّز المهندس', detail:'تخصص: التصنيع الميكانيكي والصيانة الصناعية',
      body:'لإنجازه مشروع تصميم وتصنيع علبة سرعات بكفاءة عالية، وتفوّقه في مقاييس ميكانيك الموائع والتحكم الآلي، متمنّين له مسيرة مهنية حافلة بالنجاح.', signerTitle:'مدير المدرسة' },
    fr: { org:'École nationale de génie mécanique', orgSub:'Département conception et production', title:'Certificat d’excellence en génie mécanique', intro:'Le jury scientifique reconnaît l’excellence de l’ingénieur', detail:'Spécialité : fabrication mécanique et maintenance industrielle',
      body:'Pour la conception et la réalisation d’une boîte de vitesses à haut rendement et son excellence en mécanique des fluides et automatique, avec nos vœux de réussite.', signerTitle:'Directeur de l’école' },
    en: { org:'National School of Mechanical Engineering', orgSub:'Design and Production Department', title:'Certificate of Excellence in Mechanical Engineering', intro:'The scientific committee recognizes the excellence of engineer', detail:'Specialty: Mechanical Manufacturing and Industrial Maintenance',
      body:'For designing and building a high-efficiency gearbox and excelling in fluid mechanics and automation, with best wishes for a successful career.', signerTitle:'School Director' }
  },
  math: {
    ar: { org:'ثانوية الأمير عبد القادر', orgSub:'قسم الرياضيات', title:'شهادة تفوّق في الرياضيات', intro:'تُمنح هذه الشهادة للتلميذ المتفوّق', detail:'السنة الثالثة ثانوي — شعبة رياضيات',
      body:'لحصوله على المرتبة الأولى في أولمبياد الرياضيات الولائي، وبراعته في حلّ المسائل وإثبات المبرهنات، متمنّين له مزيدًا من التألّق في عالم الأرقام.', signerTitle:'أستاذ المادة' },
    fr: { org:'Lycée Émir Abdelkader', orgSub:'Département de mathématiques', title:'Certificat d’excellence en mathématiques', intro:'Ce certificat est décerné à l’élève brillant', detail:'Terminale — filière mathématiques',
      body:'Pour sa première place à l’olympiade départementale de mathématiques et son talent à résoudre des problèmes et démontrer des théorèmes, avec nos vœux de réussite.', signerTitle:'Professeur de la matière' },
    en: { org:'Emir Abdelkader High School', orgSub:'Mathematics Department', title:'Certificate of Excellence in Mathematics', intro:'This certificate is awarded to the outstanding student', detail:'Grade 12 — Mathematics track',
      body:'For winning first place in the regional mathematics olympiad and for remarkable skill in solving problems and proving theorems, with wishes for continued brilliance.', signerTitle:'Subject Teacher' }
  },
  arabic: {
    ar: { org:'المجمع الثقافي للغة العربية', orgSub:'لجنة المسابقات الأدبية', title:'شهادة تقدير في اللغة العربية', intro:'تتشرّف اللجنة بمنح هذه الشهادة إلى', detail:'الفائز بالمرتبة الأولى في مسابقة الخطابة والإلقاء',
      body:'اعترافًا بفصاحة لسانه وحسن بيانه وغيرته على لغة الضاد، سائلين المولى أن يزيده علمًا وأدبًا وأن ينفع به الأمة.', signerTitle:'رئيس المجمع' },
    fr: { org:'Académie de la langue arabe', orgSub:'Comité des concours littéraires', title:'Certificat de mérite en langue arabe', intro:'Le comité a l’honneur de décerner ce certificat à', detail:'Premier prix du concours d’éloquence et de déclamation',
      body:'En reconnaissance de son éloquence, de la beauté de son verbe et de son attachement à la langue arabe, avec nos vœux de science et de littérature toujours plus riches.', signerTitle:'Président de l’académie' },
    en: { org:'Academy of the Arabic Language', orgSub:'Literary Competitions Committee', title:'Certificate of Merit in the Arabic Language', intro:'The committee is honored to present this certificate to', detail:'First prize — Oratory and Recitation Competition',
      body:'In recognition of eloquence, beauty of expression and devotion to the Arabic language, with wishes for ever-growing knowledge and literature.', signerTitle:'President of the Academy' }
  },
  history: {
    ar: { org:'الجمعية الوطنية للتاريخ والتراث', orgSub:'لجنة البحث التاريخي', title:'شهادة تقدير في علم التاريخ', intro:'تُمنح هذه الشهادة إلى الباحث', detail:'مخبر الدراسات التاريخية والحضارية',
      body:'عرفانًا بجهوده في توثيق الذاكرة الوطنية وتحقيق المخطوطات، وبمساهمته القيّمة في قراءة أحداث الماضي واستخلاص عبره للأجيال القادمة.', signerTitle:'رئيس الجمعية' },
    fr: { org:'Société nationale d’histoire et du patrimoine', orgSub:'Commission de recherche historique', title:'Certificat de mérite en histoire', intro:'Ce certificat est décerné au chercheur', detail:'Laboratoire d’études historiques et civilisationnelles',
      body:'En hommage à son travail de documentation de la mémoire nationale, d’édition de manuscrits et à sa précieuse lecture du passé au service des générations futures.', signerTitle:'Président de la société' },
    en: { org:'National Society of History and Heritage', orgSub:'Historical Research Committee', title:'Certificate of Merit in History', intro:'This certificate is presented to researcher', detail:'Laboratory of Historical and Civilizational Studies',
      body:'In tribute to dedicated work documenting national memory, editing manuscripts, and valuable insight into the past for the generations to come.', signerTitle:'President of the Society' }
  },
  philosophy: {
    ar: { org:'قسم الفلسفة — كلية العلوم الإنسانية', orgSub:'جامعة الجزائر', title:'شهادة تفوّق في الفلسفة', intro:'تُمنح هذه الشهادة إلى الطالب المفكّر', detail:'ماستر الفلسفة العامة — دفعة 2026',
      body:'لعمق تحليله وجرأة طرحه في مناقشة قضايا المعرفة والوجود والأخلاق، وإسهامه في إحياء ثقافة الحوار والتفكير النقدي داخل الجامعة.', signerTitle:'رئيس القسم' },
    fr: { org:'Département de philosophie — Faculté des sciences humaines', orgSub:'Université d’Alger', title:'Certificat d’excellence en philosophie', intro:'Ce certificat est décerné à l’étudiant penseur', detail:'Master philosophie générale — promotion 2026',
      body:'Pour la profondeur de son analyse et l’audace de sa réflexion sur la connaissance, l’être et l’éthique, et pour sa contribution à la culture du débat et de la pensée critique.', signerTitle:'Chef de département' },
    en: { org:'Department of Philosophy — Faculty of Humanities', orgSub:'University of Algiers', title:'Certificate of Excellence in Philosophy', intro:'This certificate is awarded to the thoughtful student', detail:'MA General Philosophy — Class of 2026',
      body:'For depth of analysis and boldness in discussing knowledge, being and ethics, and for fostering a culture of dialogue and critical thinking on campus.', signerTitle:'Head of Department' }
  },
  astro: {
    ar: { org:'نادي الفلك والفضاء', orgSub:'المرصد الوطني للعلوم الفلكية', title:'شهادة مشاركة في علم الفلك', intro:'تشهد إدارة النادي بأن الهاوي', detail:'ليلة رصد النيازك وكوكبة العقرب',
      body:'قد شارك بنجاح في الدورة التدريبية في الرصد الفلكي واستعمال المقاريب، وأتقن تحديد الكواكب والكوكبات، متمنّين له رحلة موفّقة بين النجوم.', signerTitle:'رئيس النادي' },
    fr: { org:'Club d’astronomie et d’espace', orgSub:'Observatoire national des sciences astronomiques', title:'Attestation en astronomie', intro:'La direction du club atteste que l’amateur', detail:'Nuit d’observation des météores et du Scorpion',
      body:'a suivi avec succès la formation à l’observation astronomique et à l’usage des télescopes, et sait repérer planètes et constellations. Bon voyage parmi les étoiles.', signerTitle:'Président du club' },
    en: { org:'Astronomy and Space Club', orgSub:'National Observatory of Astronomical Sciences', title:'Certificate in Astronomy', intro:'The club management certifies that the amateur astronomer', detail:'Meteor and Scorpius Observation Night',
      body:'has successfully completed the training in astronomical observation and telescope use, and can identify planets and constellations. Clear skies ahead.', signerTitle:'Club President' }
  },
  chem: {
    ar: { org:'مخبر الكيمياء التطبيقية', orgSub:'كلية العلوم الدقيقة', title:'شهادة تميّز في الكيمياء', intro:'تُمنح هذه الشهادة إلى الباحث', detail:'تخصص: الكيمياء العضوية والتحليل الكيميائي',
      body:'لإتقانه الأعمال التطبيقية وتحضير المركّبات العضوية وتحليلها طيفيًا، وحرصه على قواعد الأمن والسلامة داخل المخبر، مع تمنياتنا بمزيد من الاكتشافات.', signerTitle:'مدير المخبر' },
    fr: { org:'Laboratoire de chimie appliquée', orgSub:'Faculté des sciences exactes', title:'Certificat d’excellence en chimie', intro:'Ce certificat est décerné au chercheur', detail:'Spécialité : chimie organique et analyse chimique',
      body:'Pour sa maîtrise des travaux pratiques, de la synthèse de composés organiques et de leur analyse spectrale, et son respect des règles de sécurité au laboratoire.', signerTitle:'Directeur du laboratoire' },
    en: { org:'Applied Chemistry Laboratory', orgSub:'Faculty of Exact Sciences', title:'Certificate of Excellence in Chemistry', intro:'This certificate is presented to researcher', detail:'Specialty: Organic Chemistry and Chemical Analysis',
      body:'For mastery of practical work, synthesis of organic compounds and their spectral analysis, and strict observance of laboratory safety rules.', signerTitle:'Laboratory Director' }
  },
  circuit: {
    ar: { org:'مركز البحث في الطاقات المتجددة', orgSub:'قسم الإلكترونيك الطاقوية', title:'شهادة خبرة في الطاقة والكهرباء', intro:'يشهد مدير المركز بأن المهندس', detail:'التحكم في المحوّلات والشبكات الكهربائية الذكية',
      body:'قد أنجز بنجاح مشروعًا في إلكترونيات القدرة وربط المنظومات الكهروضوئية بالشبكة، وأظهر كفاءة عالية في التصميم والمحاكاة والقياس الميداني.', signerTitle:'مدير المركز' },
    fr: { org:'Centre de recherche en énergies renouvelables', orgSub:'Département d’électronique de puissance', title:'Certificat d’expertise en énergie électrique', intro:'Le directeur du centre atteste que l’ingénieur', detail:'Commande des convertisseurs et réseaux intelligents',
      body:'a mené à bien un projet d’électronique de puissance et de raccordement de systèmes photovoltaïques au réseau, avec une grande compétence en conception, simulation et mesure.', signerTitle:'Directeur du centre' },
    en: { org:'Renewable Energy Research Center', orgSub:'Power Electronics Department', title:'Certificate of Expertise in Electrical Energy', intro:'The center director certifies that engineer', detail:'Converter Control and Smart Electrical Grids',
      body:'has successfully completed a power-electronics project connecting photovoltaic systems to the grid, showing high competence in design, simulation and field measurement.', signerTitle:'Center Director' }
  },
  bio: {
    ar: { org:'كلية علوم الطبيعة والحياة', orgSub:'قسم البيولوجيا الجزيئية', title:'شهادة تفوّق في علوم الحياة', intro:'تُمنح هذه الشهادة إلى الباحث', detail:'ماستر البيوتكنولوجيا — دفعة 2026',
      body:'تقديرًا لتفوّقه في الأعمال المخبرية وتقنيات الاستخلاص والتضخيم الجيني وتحليل الحمض النووي، وإسهامه في خدمة البحث العلمي والصحة العامة.', signerTitle:'عميد الكلية' },
    fr: { org:'Faculté des sciences de la nature et de la vie', orgSub:'Département de biologie moléculaire', title:'Certificat d’excellence en sciences de la vie', intro:'Ce certificat est décerné au chercheur', detail:'Master biotechnologie — promotion 2026',
      body:'En reconnaissance de son excellence en travaux de laboratoire, extraction, amplification génique et analyse de l’ADN, au service de la recherche et de la santé publique.', signerTitle:'Doyen de la faculté' },
    en: { org:'Faculty of Natural and Life Sciences', orgSub:'Department of Molecular Biology', title:'Certificate of Excellence in Life Sciences', intro:'This certificate is awarded to researcher', detail:'MSc Biotechnology — Class of 2026',
      body:'In recognition of outstanding laboratory work, DNA extraction, gene amplification and analysis, and a valuable contribution to research and public health.', signerTitle:'Dean of the Faculty' }
  }
};
templates.forEach(t => { t.sample = S[t.id]; });

/* =========================================================
   Interface strings (merged into UI by app.js)
   ========================================================= */
const ui = {
  ar: {
    cat_science:'علمية وثقافية', cat_premium:'Premium', cat_free:'مجانية', prem_own:'مملوك',
    prem_note:'Premium · {p} — المعاينة والتعديل مجانيان، التحميل بعد الشراء', prem_buy:'شراء القالب', prem_owned:'قالب Premium مملوك — تحميل PDF متاح',
    t_tpl_prem:'القالب Premium — المعاينة مجانية', login_prem:'سجّل الدخول بحساب Google لشراء قالب Premium وتحميله، ويبقى القالب في حسابك.',
    shop_title:'قالب «{n}»', shop_sub:'شهادة بتصميم فني فريد بجودة الطباعة، تليق بالجامعات والمخابر والمؤسسات وتمنح شهاداتك هيبة وقيمة.',
    shop_once:'شراء واحد · دائم', shop_b1:'تحميل PDF بلا حدود بهذا القالب', shop_b2:'يشمل الإصدار الجماعي لعشرات الشهادات برمز QR',
    shop_b3:'القالب في حسابك دائمًا، على أي جهاز', shop_secure:'دفع آمن عبر PayPal (بطاقة بنكية أو حساب PayPal)', shop_account:'الحساب',
    shop_restore:'استرجاع مشترياتي', shop_free:'اختيار قالب مجاني', shop_close:'إغلاق',
    shop_demo:'وضع تجريبي (رابط المعاينة): لا يُدفع أي مبلغ ولا يُحفظ أي شراء.', shop_demo_btn:'محاكاة الدفع',
    shop_sandbox:'وضع الاختبار (PayPal Sandbox): لا يُخصم أي مبلغ حقيقي.', shop_off:'شراء القوالب غير متاح حاليًا. المعاينة والتعديل متاحان، أو اختر قالبًا مجانيًا للتحميل.',
    shop_err:'تعذّر إتمام العملية، حاول مرة أخرى.', shop_paying:'جارٍ تأكيد الدفع…', shop_done:'تم الشراء', shop_done_t:'القالب لك الآن نهائيًا في هذا الحساب: حمّل شهاداتك وارجع إليه متى شئت.',
    shop_order:'رقم الطلب', shop_now_pdf:'تحميل PDF الآن', shop_check_err:'تعذّر التحقق من مشترياتك، تحقّق من الاتصال وحاول مجددًا.',
    shop_resumed:'✓ اكتمل شراؤك السابق وفُتح القالب', shop_restored:'✓ تم استرجاع {n} من القوالب', shop_restored0:'لا توجد قوالب مشتراة في هذا الحساب'
  },
  fr: {
    cat_science:'Scientifiques et culturels', cat_premium:'Premium', cat_free:'Gratuits', prem_own:'Acheté',
    prem_note:'Premium · {p} — aperçu et modification gratuits, téléchargement après achat', prem_buy:'Acheter le modèle', prem_owned:'Modèle Premium acheté — PDF disponible',
    t_tpl_prem:'Modèle Premium — aperçu gratuit', login_prem:'Connectez-vous avec Google pour acheter et télécharger un modèle Premium ; il reste dans votre compte.',
    shop_title:'Modèle « {n} »', shop_sub:'Un certificat au design artistique unique, qualité impression, digne des universités, laboratoires et institutions.',
    shop_once:'Achat unique · à vie', shop_b1:'PDF illimités avec ce modèle', shop_b2:'Inclut l’émission en lot de dizaines de certificats avec QR',
    shop_b3:'Le modèle reste dans votre compte, sur tout appareil', shop_secure:'Paiement sécurisé PayPal (carte bancaire ou compte PayPal)', shop_account:'Compte',
    shop_restore:'Restaurer mes achats', shop_free:'Choisir un modèle gratuit', shop_close:'Fermer',
    shop_demo:'Mode démo (lien d’aperçu) : aucun paiement, aucun achat enregistré.', shop_demo_btn:'Simuler le paiement',
    shop_sandbox:'Mode test (PayPal Sandbox) : aucun débit réel.', shop_off:'L’achat des modèles n’est pas disponible pour le moment. Aperçu et modification restent possibles, ou choisissez un modèle gratuit.',
    shop_err:'L’opération a échoué, réessayez.', shop_paying:'Confirmation du paiement…', shop_done:'Achat réussi', shop_done_t:'Le modèle est à vous pour toujours dans ce compte : téléchargez vos certificats quand vous voulez.',
    shop_order:'N° de commande', shop_now_pdf:'Télécharger le PDF', shop_check_err:'Impossible de vérifier vos achats, vérifiez la connexion et réessayez.',
    shop_resumed:'✓ Votre achat précédent est confirmé, le modèle est débloqué', shop_restored:'✓ {n} modèle(s) restauré(s)', shop_restored0:'Aucun modèle acheté dans ce compte'
  },
  en: {
    cat_science:'Science & culture', cat_premium:'Premium', cat_free:'Free', prem_own:'Owned',
    prem_note:'Premium · {p} — free preview and editing, download after purchase', prem_buy:'Buy template', prem_owned:'Premium template owned — PDF download available',
    t_tpl_prem:'Premium template — free preview', login_prem:'Sign in with Google to buy and download a Premium template; it stays in your account.',
    shop_title:'“{n}” template', shop_sub:'A certificate with a unique artistic, print-quality design worthy of universities, labs and institutions.',
    shop_once:'One-time · lifetime', shop_b1:'Unlimited PDF downloads with this template', shop_b2:'Includes batch issuing of dozens of certificates with QR',
    shop_b3:'The template stays in your account, on any device', shop_secure:'Secure PayPal payment (bank card or PayPal account)', shop_account:'Account',
    shop_restore:'Restore my purchases', shop_free:'Pick a free template', shop_close:'Close',
    shop_demo:'Demo mode (preview link): nothing is paid and nothing is saved.', shop_demo_btn:'Simulate the payment',
    shop_sandbox:'Test mode (PayPal Sandbox): no real money is charged.', shop_off:'Template purchases are unavailable right now. You can still preview and edit, or pick a free template to download.',
    shop_err:'The operation failed, please try again.', shop_paying:'Confirming payment…', shop_done:'Purchase complete', shop_done_t:'The template is yours for good in this account: download your certificates any time.',
    shop_order:'Order no.', shop_now_pdf:'Download PDF now', shop_check_err:'Could not verify your purchases; check your connection and try again.',
    shop_resumed:'✓ Your earlier purchase is confirmed and the template is unlocked', shop_restored:'✓ {n} template(s) restored', shop_restored0:'No purchased templates in this account'
  }
};

window.CERT_PREMIUM = { templates, deco: D, ui, price: '1.99' };
})();
