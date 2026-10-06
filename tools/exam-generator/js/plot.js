/* ================= Curves tool: function plots, tables of values, bar and pie charts =================
   Pure SVG output (sharp in print/PDF). Expressions are parsed with math.js. */

const PLOT_COLORS = ['#1D4ED8', '#DC2626', '#059669', '#D97706', '#7C3AED', '#DB2777', '#0891B2', '#111827'];
const PLOT_W = 640;

function plotDefaults(){
  return {
    type: 'func',
    xmin: -5, xmax: 5, ymin: -4, ymax: 6, xstep: 1, ystep: 1,
    grid: 'main', equal: false, height: 420, numbers: true, arrows: true,
    xlabel: 'x', ylabel: 'y', origin: 'O', title: '',
    curves: [{ id: uid('c_'), kind: 'fx', expr: 'x^2-3x+2', color: PLOT_COLORS[0], width: 2.2, dash: false, label: '(C_f)', from: '', to: '', pts: [], connect: 'smooth' }],
    points: [], tangents: [], areas: [], lines: [],
    bars: { labels: ['A', 'B', 'C', 'D'], series: [{ name: '', color: PLOT_COLORS[0], values: [4, 7, 5, 9] }], ylabel: '', showValues: true },
    pie: { items: [{ label: 'A', value: 40, color: PLOT_COLORS[0] }, { label: 'B', value: 35, color: PLOT_COLORS[1] }, { label: 'C', value: 25, color: PLOT_COLORS[2] }], percent: true },
  };
}

/* ---------- Expression handling ---------- */
function normalizeExpr(s){
  return String(s || '')
    .replace(/[−–]/g, '-').replace(/×|·/g, '*').replace(/÷/g, '/').replace(/²/g, '^2').replace(/³/g, '^3')
    .replace(/π/g, 'pi').replace(/√\s*\(/g, 'sqrt(').replace(/√\s*([a-z0-9.]+)/gi, 'sqrt($1)')
    .replace(/(\d),(\d)/g, '$1.$2')
    .replace(/\blog\s*\(/g, 'log10(').replace(/\bln\s*\(/g, 'log(')
    .replace(/\bLn\s*\(/g, 'log(')
    .replace(/\|([^|]+)\|/g, 'abs($1)')
    .replace(/^\s*[a-zA-Z]\s*\(\s*[xt]\s*\)\s*=/, '').replace(/^\s*y\s*=/, '');
}
function exprVar(s){ return /(^|[^a-z])t([^a-z]|$)/i.test(s) && !/(^|[^a-z])x([^a-z]|$)/i.test(s) ? 't' : 'x'; }
const _compiled = {};
function compileExpr(expr){
  const key = expr;
  if(_compiled[key] !== undefined) return _compiled[key];
  try{
    const norm = normalizeExpr(expr);
    const v = exprVar(norm);
    const code = math.compile(norm);
    const f = (x) => { try{ const r = code.evaluate({ [v]: x, x, t: x, e: Math.E, pi: Math.PI }); return typeof r === 'number' ? r : (r && r.re !== undefined && Math.abs(r.im) < 1e-12 ? r.re : NaN); }catch(e){ return NaN; } };
    f(1);
    _compiled[key] = f;
  }catch(e){ _compiled[key] = null; }
  return _compiled[key];
}
function curveFn(c){
  if(c.kind === 'fx') return compileExpr(c.expr);
  const pts = (c.pts || []).filter(p => isFinite(p[0]) && isFinite(p[1])).sort((a,b) => a[0]-b[0]);
  if(pts.length < 2) return null;
  return (x) => { // linear interpolation
    if(x < pts[0][0] || x > pts[pts.length-1][0]) return NaN;
    for(let i=1;i<pts.length;i++) if(x <= pts[i][0]){ const [x0,y0] = pts[i-1], [x1,y1] = pts[i]; return y0 + (y1-y0)*(x-x0)/((x1-x0)||1); }
    return NaN;
  };
}
function numStr(v){
  if(!isFinite(v)) return '';
  const r = Math.round(v * 1000) / 1000;
  let s = String(r);
  if(lang !== 'en') s = s.replace('.', ',');
  return s.replace('-', '−');
}
function xmlEsc(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
/* Label with simple subscripts: C_f -> C<sub>f</sub> */
function svgLabel(s){
  return xmlEsc(s).replace(/_\{([^}]*)\}|_(\S)/g, (m, a, b) => `<tspan baseline-shift="sub" font-size="75%">${a || b}</tspan>`);
}

/* ---------- Rendering ---------- */
function plotSvg(d){
  if(d.type === 'bar') return barSvg(d);
  if(d.type === 'pie') return pieSvg(d);
  const FONT = `font-family="Tajawal, Arial, sans-serif"`;
  const MFONT = `font-family="'Times New Roman', Times, serif" font-style="italic"`;
  let xmin = +d.xmin, xmax = +d.xmax, ymin = +d.ymin, ymax = +d.ymax;
  if(!(xmax > xmin)) xmax = xmin + 1;
  if(!(ymax > ymin)) ymax = ymin + 1;
  const ml = 34, mr = 26, mt = 20, mb = 30;
  const W = PLOT_W - ml - mr;
  let H = d.equal ? W * (ymax - ymin) / (xmax - xmin) : (+d.height || 420) - mt - mb;
  H = Math.max(120, Math.min(H, 1100));
  const TH = H + mt + mb;
  const X = x => ml + (x - xmin) / (xmax - xmin) * W;
  const Y = y => mt + (ymax - y) / (ymax - ymin) * H;
  const cid = 'clip' + Math.random().toString(36).slice(2, 8);
  let s = `<svg xmlns="http://www.w3.org/2000/svg" direction="ltr" style="direction:ltr" viewBox="0 0 ${PLOT_W} ${TH.toFixed(1)}" width="${PLOT_W}" height="${TH.toFixed(1)}">`;
  s += `<defs><clipPath id="${cid}"><rect x="${ml}" y="${mt}" width="${W}" height="${H}"/></clipPath>
    <marker id="${cid}a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#111"/></marker></defs>`;
  s += `<rect x="0" y="0" width="${PLOT_W}" height="${TH}" fill="#fff"/>`;
  const xs = Math.abs(+d.xstep) || 1, ys = Math.abs(+d.ystep) || 1;
  const ticks = (a, b, st) => { const out = []; const k0 = Math.ceil(a / st - 1e-9), k1 = Math.floor(b / st + 1e-9); if(k1 - k0 > 400) return out; for(let k=k0;k<=k1;k++) out.push(+(k * st).toFixed(10)); return out; };
  // grid
  if(d.grid === 'mm'){
    const mx = xs / 5, my = ys / 5;
    let g = '';
    ticks(xmin, xmax, mx).forEach(x => g += `M${X(x).toFixed(1)},${mt}V${mt+H}`);
    ticks(ymin, ymax, my).forEach(y => g += `M${ml},${Y(y).toFixed(1)}H${ml+W}`);
    s += `<path d="${g}" stroke="#F5B98A" stroke-width="0.35" fill="none"/>`;
  }
  if(d.grid === 'main' || d.grid === 'mm'){
    let g = '';
    ticks(xmin, xmax, xs).forEach(x => g += `M${X(x).toFixed(1)},${mt}V${mt+H}`);
    ticks(ymin, ymax, ys).forEach(y => g += `M${ml},${Y(y).toFixed(1)}H${ml+W}`);
    s += `<path d="${g}" stroke="${d.grid === 'mm' ? '#E8925A' : '#C9CED8'}" stroke-width="${d.grid === 'mm' ? 0.7 : 0.8}" fill="none"/>`;
  }
  // areas (under curves)
  const fns = {}; (d.curves || []).forEach(c => fns[c.id] = curveFn(c));
  (d.areas || []).forEach(a => {
    const f = fns[a.curve]; if(!f) return;
    const g = a.curve2 && fns[a.curve2] ? fns[a.curve2] : (() => 0);
    const lo = Math.max(Math.min(+a.a, +a.b), xmin), hi = Math.min(Math.max(+a.a, +a.b), xmax);
    if(!(hi > lo)) return;
    const N = 160; let top = [], bot = [];
    for(let i=0;i<=N;i++){ const x = lo + (hi-lo)*i/N; const y1 = f(x), y2 = g(x); if(isFinite(y1) && isFinite(y2)){ top.push(`${X(x).toFixed(1)},${Y(y1).toFixed(1)}`); bot.unshift(`${X(x).toFixed(1)},${Y(y2).toFixed(1)}`); } }
    if(top.length > 1) s += `<polygon clip-path="url(#${cid})" points="${top.concat(bot).join(' ')}" fill="${a.color || '#93C5FD'}" fill-opacity="0.45" stroke="none"/>`;
    if(a.label) s += `<text x="${X((lo+hi)/2)}" y="${Y((f((lo+hi)/2) + g((lo+hi)/2))/2)}" ${MFONT} font-size="15" text-anchor="middle" fill="#111">${svgLabel(a.label)}</text>`;
  });
  // axes
  const ax0 = (ymin <= 0 && ymax >= 0) ? Y(0) : (ymin > 0 ? mt + H : mt);
  const ay0 = (xmin <= 0 && xmax >= 0) ? X(0) : (xmin > 0 ? ml : ml + W);
  const mk = d.arrows !== false ? `marker-end="url(#${cid}a)"` : '';
  s += `<line x1="${ml - 6}" y1="${ax0}" x2="${ml + W + 14}" y2="${ax0}" stroke="#111" stroke-width="1.4" ${mk}/>`;
  s += `<line x1="${ay0}" y1="${mt + H + 6}" x2="${ay0}" y2="${mt - 14}" stroke="#111" stroke-width="1.4" ${mk}/>`;
  // ticks + numbers
  if(d.numbers !== false){
    ticks(xmin, xmax, xs).forEach(x => { if(Math.abs(x) < 1e-12) return; const px = X(x);
      s += `<line x1="${px}" y1="${ax0-3}" x2="${px}" y2="${ax0+3}" stroke="#111" stroke-width="1"/>`;
      s += `<text x="${px}" y="${ax0 + 15}" ${FONT} font-size="11.5" text-anchor="middle" fill="#111">${numStr(x)}</text>`; });
    ticks(ymin, ymax, ys).forEach(y => { if(Math.abs(y) < 1e-12) return; const py = Y(y);
      s += `<line x1="${ay0-3}" y1="${py}" x2="${ay0+3}" y2="${py}" stroke="#111" stroke-width="1"/>`;
      s += `<text x="${ay0 - 6}" y="${py + 4}" ${FONT} font-size="11.5" text-anchor="end" fill="#111">${numStr(y)}</text>`; });
  }
  if(d.origin && xmin <= 0 && xmax >= 0 && ymin <= 0 && ymax >= 0) s += `<text x="${X(0) - 6}" y="${Y(0) + 15}" ${MFONT} font-size="14" text-anchor="end" fill="#111">${xmlEsc(d.origin)}</text>`;
  if(d.xlabel) s += `<text x="${ml + W + 8}" y="${ax0 - 8}" ${MFONT} font-size="15" text-anchor="end" fill="#111">${svgLabel(d.xlabel)}</text>`;
  if(d.ylabel) s += `<text x="${ay0 + 8}" y="${mt - 4}" ${MFONT} font-size="15" text-anchor="start" fill="#111">${svgLabel(d.ylabel)}</text>`;
  // straight lines (asymptotes etc.)
  (d.lines || []).forEach(l => {
    const col = l.color || '#6B7280', da = l.dash !== false ? 'stroke-dasharray="6 4"' : '';
    let x1, y1, x2, y2;
    if(l.kind === 'v'){ x1 = x2 = X(+l.a); y1 = mt; y2 = mt + H; }
    else if(l.kind === 'h'){ y1 = y2 = Y(+l.a); x1 = ml; x2 = ml + W; }
    else { x1 = X(xmin); y1 = Y(+l.a * xmin + (+l.b || 0)); x2 = X(xmax); y2 = Y(+l.a * xmax + (+l.b || 0)); }
    s += `<line clip-path="url(#${cid})" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="1.5" ${da}/>`;
    if(l.label) s += `<text x="${l.kind === 'v' ? x1 + 4 : ml + W - 4}" y="${l.kind === 'v' ? mt + 14 : (l.kind === 'h' ? y1 - 5 : Math.max(mt + 12, Math.min(mt + H - 4, y2 - 6)))}" ${MFONT} font-size="13.5" text-anchor="${l.kind === 'v' ? 'start' : 'end'}" fill="${col}">${svgLabel(l.label)}</text>`;
  });
  // curves
  (d.curves || []).forEach(c => {
    const f = fns[c.id]; if(!f) return;
    const da = c.dash ? 'stroke-dasharray="7 5"' : '';
    if(c.kind === 'table'){
      const pts = (c.pts || []).filter(p => isFinite(p[0]) && isFinite(p[1])).sort((a,b) => a[0]-b[0]);
      if(c.connect !== 'none' && pts.length > 1){
        let path;
        if(c.connect === 'smooth' && pts.length > 2) path = smoothPath(pts.map(p => [X(p[0]), Y(p[1])]));
        else path = 'M' + pts.map(p => `${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join('L');
        s += `<path clip-path="url(#${cid})" d="${path}" fill="none" stroke="${c.color}" stroke-width="${c.width || 2}" ${da} stroke-linejoin="round"/>`;
      }
      pts.forEach(p => s += `<g clip-path="url(#${cid})"><path d="M${X(p[0])-4},${Y(p[1])-4}l8,8m0,-8l-8,8" stroke="${c.color}" stroke-width="1.8"/></g>`);
    } else {
      const lo = c.from !== '' && c.from != null && isFinite(+c.from) ? Math.max(+c.from, xmin) : xmin;
      const hi = c.to !== '' && c.to != null && isFinite(+c.to) ? Math.min(+c.to, xmax) : xmax;
      const N = 900; let path = '', pen = false, prev = null;
      const span = ymax - ymin;
      for(let i=0;i<=N;i++){
        const x = lo + (hi - lo) * i / N, y = f(x);
        if(!isFinite(y) || Math.abs(y) > 1e6 || (prev !== null && Math.abs(y - prev) > span * 2.5)){ pen = false; prev = isFinite(y) ? y : null; if(!isFinite(y)) continue; }
        const py = Math.max(mt - H, Math.min(mt + 2 * H, Y(y)));
        path += (pen ? 'L' : 'M') + X(x).toFixed(2) + ',' + py.toFixed(2);
        pen = true; prev = y;
      }
      s += `<path clip-path="url(#${cid})" d="${path}" fill="none" stroke="${c.color}" stroke-width="${c.width || 2.2}" ${da} stroke-linejoin="round" stroke-linecap="round"/>`;
    }
    if(c.label){
      // place label near 82% of the visible range, nudged inside
      let lx = null, ly = null;
      for(const frac of [0.85, 0.75, 0.92, 0.6, 0.4, 0.2]){
        const x = xmin + (xmax - xmin) * frac, y = f(x);
        if(isFinite(y) && y > ymin + span(ymax, ymin) * 0.06 && y < ymax - span(ymax, ymin) * 0.06){ lx = X(x); ly = Y(y); break; }
      }
      if(lx !== null) s += `<text x="${lx + 6}" y="${ly - 9}" ${MFONT} font-size="15" fill="${c.color}">${svgLabel(c.label)}</text>`;
    }
  });
  // tangents
  (d.tangents || []).forEach(tg => {
    const f = fns[tg.curve]; if(!f) return;
    const x0 = +tg.x0, y0 = f(x0); if(!isFinite(y0)) return;
    const h = 1e-4 * Math.max(1, Math.abs(x0)); const m = (f(x0 + h) - f(x0 - h)) / (2 * h); if(!isFinite(m)) return;
    const L = (xmax - xmin) * ((+tg.len || 0) > 0 ? +tg.len / 2 : 1);
    const xa = x0 - L, xb = x0 + L;
    s += `<line clip-path="url(#${cid})" x1="${X(xa)}" y1="${Y(y0 + m * (xa - x0))}" x2="${X(xb)}" y2="${Y(y0 + m * (xb - x0))}" stroke="${tg.color || '#DC2626'}" stroke-width="1.6" ${tg.dash ? 'stroke-dasharray="6 4"' : ''}/>`;
    if(tg.label) s += `<text x="${X(x0 + L * 0.35) + 4}" y="${Y(y0 + m * L * 0.35) - 6}" ${MFONT} font-size="14" fill="${tg.color || '#DC2626'}">${svgLabel(tg.label)}</text>`;
  });
  // points
  (d.points || []).forEach(p => {
    let x = +p.x, y = p.onCurve && fns[p.onCurve] ? fns[p.onCurve](x) : +p.y;
    if(!isFinite(x) || !isFinite(y)) return;
    const px = X(x), py = Y(y), col = p.color || '#111';
    if(p.proj){
      s += `<path d="M${px},${py}V${ax0}M${px},${py}H${ay0}" stroke="${col}" stroke-width="1" stroke-dasharray="4 3" fill="none"/>`;
      if(p.projLabels){
        s += `<text x="${px}" y="${ax0 + (y >= 0 ? (d.numbers !== false ? 28 : 15) : -6)}" ${FONT} font-size="11.5" text-anchor="middle" fill="${col}">${xmlEsc(p.xl || numStr(x))}</text>`;
        s += `<text x="${ay0 - 6}" y="${py + 4}" ${FONT} font-size="11.5" text-anchor="end" fill="${col}">${xmlEsc(p.yl || numStr(y))}</text>`;
      }
    }
    s += `<circle cx="${px}" cy="${py}" r="3.4" fill="${col}"/>`;
    if(p.label) s += `<text x="${px + 7}" y="${py - 7}" ${MFONT} font-size="15" fill="${col}">${svgLabel(p.label)}</text>`;
  });
  if(d.title) s += `<text x="${PLOT_W/2}" y="14" ${FONT} font-size="14" font-weight="700" text-anchor="middle" fill="#111">${xmlEsc(d.title)}</text>`;
  s += `</svg>`;
  return s;
}
function span(a, b){ return a - b; }
function smoothPath(p){
  let d = `M${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`;
  for(let i=0;i<p.length-1;i++){
    const p0 = p[i-1] || p[i], p1 = p[i], p2 = p[i+1], p3 = p[i+2] || p2;
    const c1x = p1[0] + (p2[0]-p0[0]) / 6, c1y = p1[1] + (p2[1]-p0[1]) / 6;
    const c2x = p2[0] - (p3[0]-p1[0]) / 6, c2y = p2[1] - (p3[1]-p1[1]) / 6;
    d += `C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}
function barSvg(d){
  const b = d.bars, FONT = `font-family="Tajawal, Arial, sans-serif"`;
  const n = b.labels.length, ns = b.series.length;
  const all = b.series.flatMap(s => s.values.map(Number)).filter(isFinite);
  const vmax = Math.max(1, ...all);
  const step = niceStep(vmax / 6), top = Math.ceil(vmax / step) * step;
  const ml = 46, mr = 16, mt = d.title ? 34 : 18, mb = 46 + (ns > 1 ? 24 : 0);
  const W = PLOT_W - ml - mr, H = (+d.height || 380) - mt - mb, TH = H + mt + mb;
  const Y = v => mt + H - v / top * H;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" direction="ltr" style="direction:ltr" viewBox="0 0 ${PLOT_W} ${TH}" width="${PLOT_W}" height="${TH}"><rect width="${PLOT_W}" height="${TH}" fill="#fff"/>`;
  for(let v = 0; v <= top + 1e-9; v += step){
    s += `<line x1="${ml}" x2="${ml + W}" y1="${Y(v)}" y2="${Y(v)}" stroke="${v === 0 ? '#111' : '#D7DCE5'}" stroke-width="${v === 0 ? 1.4 : 0.8}"/>`;
    s += `<text x="${ml - 6}" y="${Y(v) + 4}" ${FONT} font-size="12" text-anchor="end" fill="#111">${numStr(v)}</text>`;
  }
  s += `<line x1="${ml}" x2="${ml}" y1="${mt - 6}" y2="${mt + H}" stroke="#111" stroke-width="1.4"/>`;
  const gw = W / Math.max(1, n), bw = Math.min(60, gw * 0.7 / ns);
  b.labels.forEach((lab, i) => {
    const gx = ml + gw * i + gw / 2;
    b.series.forEach((se, k) => {
      const v = +se.values[i]; if(!isFinite(v)) return;
      const x = gx - (bw * ns) / 2 + bw * k;
      s += `<rect x="${x + 1}" y="${Y(v)}" width="${bw - 2}" height="${Math.max(0, mt + H - Y(v))}" fill="${se.color}" rx="2"/>`;
      if(b.showValues) s += `<text x="${x + bw / 2}" y="${Y(v) - 5}" ${FONT} font-size="12" font-weight="700" text-anchor="middle" fill="#111">${numStr(v)}</text>`;
    });
    s += `<text x="${gx}" y="${mt + H + 18}" ${FONT} font-size="12.5" text-anchor="middle" fill="#111">${xmlEsc(lab)}</text>`;
  });
  if(b.ylabel) s += `<text x="${ml - 36}" y="${mt - 6}" ${FONT} font-size="12.5" fill="#111">${xmlEsc(b.ylabel)}</text>`;
  if(b.xlabel) s += `<text x="${ml + W}" y="${mt + H + 36}" ${FONT} font-size="12.5" text-anchor="end" fill="#111">${xmlEsc(b.xlabel)}</text>`;
  if(ns > 1){
    let lx = ml; b.series.forEach(se => { s += `<rect x="${lx}" y="${TH - 18}" width="14" height="12" fill="${se.color}"/><text x="${lx + 18}" y="${TH - 8}" ${FONT} font-size="12.5" fill="#111">${xmlEsc(se.name)}</text>`; lx += 30 + (se.name || '').length * 8; });
  }
  if(d.title) s += `<text x="${PLOT_W/2}" y="20" ${FONT} font-size="15" font-weight="700" text-anchor="middle" fill="#111">${xmlEsc(d.title)}</text>`;
  return s + '</svg>';
}
function niceStep(raw){ const p = Math.pow(10, Math.floor(Math.log10(raw || 1))); const n = raw / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p; }
function pieSvg(d){
  const items = d.pie.items.filter(i => +i.value > 0), FONT = `font-family="Tajawal, Arial, sans-serif"`;
  const total = items.reduce((a, i) => a + +i.value, 0) || 1;
  const TH = 360, cx = 190, cy = TH / 2 + (d.title ? 10 : 0), r = 140;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" direction="ltr" style="direction:ltr" viewBox="0 0 ${PLOT_W} ${TH + 20}" width="${PLOT_W}" height="${TH + 20}"><rect width="${PLOT_W}" height="${TH + 20}" fill="#fff"/>`;
  let a0 = -Math.PI / 2;
  items.forEach(it => {
    const frac = +it.value / total, a1 = a0 + frac * 2 * Math.PI;
    const large = frac > 0.5 ? 1 : 0;
    const p = frac >= 0.9999 ? `M${cx - r},${cy}a${r},${r} 0 1,0 ${2*r},0a${r},${r} 0 1,0 ${-2*r},0` :
      `M${cx},${cy}L${cx + r*Math.cos(a0)},${cy + r*Math.sin(a0)}A${r},${r} 0 ${large} 1 ${cx + r*Math.cos(a1)},${cy + r*Math.sin(a1)}Z`;
    s += `<path d="${p}" fill="${it.color}" stroke="#fff" stroke-width="2"/>`;
    const am = (a0 + a1) / 2;
    if(d.pie.percent && frac > 0.03) s += `<text x="${cx + r*0.62*Math.cos(am)}" y="${cy + r*0.62*Math.sin(am) + 5}" ${FONT} font-size="14" font-weight="800" text-anchor="middle" fill="#fff">${numStr(Math.round(frac * 1000) / 10)}%</text>`;
    a0 = a1;
  });
  let ly = cy - items.length * 14;
  items.forEach(it => { s += `<rect x="380" y="${ly}" width="18" height="18" rx="3" fill="${it.color}"/><text x="406" y="${ly + 14}" ${FONT} font-size="14" fill="#111">${xmlEsc(it.label)} (${numStr(+it.value)})</text>`; ly += 28; });
  if(d.title) s += `<text x="${PLOT_W/2}" y="20" ${FONT} font-size="15" font-weight="700" text-anchor="middle" fill="#111">${xmlEsc(d.title)}</text>`;
  return s + '</svg>';
}

/* ---------- Ready-made curves ---------- */
function plotP(over){ return Object.assign(plotDefaults(), over); }
function plotC(expr, color, label, extra){ return Object.assign({ id: uid('c_'), kind: 'fx', expr, color: color || PLOT_COLORS[0], width: 2.2, dash: false, label: label || '', from: '', to: '', pts: [], connect: 'smooth' }, extra || {}); }
function plotT(pts, color, label, connect){ return { id: uid('c_'), kind: 'table', expr: '', color: color || PLOT_COLORS[0], width: 2, dash: false, label: label || '', from: '', to: '', pts, connect: connect || 'smooth' }; }
const PLOT_PRESETS = [
  { g: () => L('رياضيات','Maths','Maths'), items: [
    { n: () => L('دالة من الدرجة الثانية','Quadratic','Second degré'), d: () => plotP({ curves: [plotC('x^2-3x+2', PLOT_COLORS[0], '(C_f)')], xmin: -2, xmax: 5, ymin: -1, ymax: 6 }) },
    { n: () => L('دالة من الدرجة الثالثة','Cubic','Troisième degré'), d: () => plotP({ curves: [plotC('x^3-3x', PLOT_COLORS[0], '(C_f)')], xmin: -3, xmax: 3, ymin: -4, ymax: 4 }) },
    { n: () => L('دالة مقلوب','Reciprocal','Inverse'), d: () => plotP({ curves: [plotC('1/x', PLOT_COLORS[0], '(C_f)')], xmin: -5, xmax: 5, ymin: -5, ymax: 5, equal: true }) },
    { n: () => L('دالة تناظرية + مستقيمات مقاربة','Rational + asymptotes','Homographique + asymptotes'), d: () => { const c = plotC('(2x-1)/(x+1)', PLOT_COLORS[0], '(C_f)'); return plotP({ curves: [c], xmin: -6, xmax: 5, ymin: -4, ymax: 7, lines: [{ kind:'v', a:-1, color:'#6B7280', dash:true, label:'x=−1' }, { kind:'h', a:2, color:'#6B7280', dash:true, label:'y=2' }] }); } },
    { n: () => L('الدالة الأسية','Exponential','Exponentielle'), d: () => plotP({ curves: [plotC('e^x', PLOT_COLORS[0], '(C)')], xmin: -4, xmax: 3, ymin: -1, ymax: 7 }) },
    { n: () => L('الدالة اللوغاريتمية','Logarithm','Logarithme'), d: () => plotP({ curves: [plotC('ln(x)', PLOT_COLORS[0], '(C)')], xmin: -1, xmax: 8, ymin: -3, ymax: 3 }) },
    { n: () => L('الجذر التربيعي','Square root','Racine carrée'), d: () => plotP({ curves: [plotC('sqrt(x)', PLOT_COLORS[0], '(C)')], xmin: -1, xmax: 9, ymin: -1, ymax: 4, equal: true }) },
    { n: () => L('دالة جيبية','Sine','Sinus'), d: () => plotP({ curves: [plotC('sin(x)', PLOT_COLORS[0], '(C)')], xmin: -7, xmax: 7, ymin: -2, ymax: 2 }) },
    { n: () => L('دالتان تآلفيتان وتقاطعهما','Two lines & intersection','Deux droites'), d: () => { const a = plotC('2x+1', PLOT_COLORS[0], '(D_1)'), b = plotC('-x+4', PLOT_COLORS[1], '(D_2)'); return plotP({ curves: [a, b], xmin: -2, xmax: 5, ymin: -2, ymax: 7, points: [{ x:1, y:3, label:'A', proj:true, projLabels:true, color:'#111' }] }); } },
    { n: () => L('مماس ومساحة','Tangent & area','Tangente et aire'), d: () => { const c = plotC('x^2/2', PLOT_COLORS[0], '(C_f)'); return plotP({ curves: [c], xmin: -1, xmax: 4, ymin: -1, ymax: 6, tangents: [{ curve: c.id, x0: 2, color: '#DC2626', label: '(T)' }], areas: [{ curve: c.id, a: 0, b: 2, color: '#93C5FD' }], points: [{ x:2, onCurve: c.id, label:'A', proj:true }] }); } },
  ]},
  { g: () => L('فيزياء','Physics','Physique'), items: [
    { n: () => L('حركة مستقيمة منتظمة','Uniform motion','Mouvement uniforme'), d: () => plotP({ curves: [plotC('2t+1', PLOT_COLORS[0], '')], xmin: 0, xmax: 6, ymin: 0, ymax: 14, ystep: 2, xlabel: 't (s)', ylabel: 'x (m)', grid: 'mm' }) },
    { n: () => L('حركة متغيرة بانتظام','Accelerated motion','Mouvement accéléré'), d: () => plotP({ curves: [plotC('0.5*2*t^2', PLOT_COLORS[0], '')], xmin: 0, xmax: 5, ymin: 0, ymax: 26, ystep: 5, xlabel: 't (s)', ylabel: 'x (m)', grid: 'mm' }) },
    { n: () => L('السرعة بدلالة الزمن','Velocity vs time','Vitesse'), d: () => plotP({ curves: [plotC('3t+2', PLOT_COLORS[0], '')], xmin: 0, xmax: 6, ymin: 0, ymax: 22, ystep: 2, xlabel: 't (s)', ylabel: 'v (m/s)', grid: 'mm' }) },
    { n: () => L('شحن مكثفة','Capacitor charging','Charge du condensateur'), d: () => { const c = plotC('12(1-e^(-t/2))', PLOT_COLORS[0], ''); return plotP({ curves: [c], xmin: 0, xmax: 12, ymin: 0, ymax: 14, xstep: 1, ystep: 2, xlabel: 't (ms)', ylabel: 'u_C (V)', grid: 'mm', tangents: [{ curve: c.id, x0: 0, color: '#DC2626', len: 5 }], lines: [{ kind:'h', a:12, color:'#6B7280', dash:true, label:'E' }], points: [{ x:2, onCurve: c.id, label:'', proj:true, projLabels:true, xl:'τ', yl:'0,63E', color:'#059669' }] }); } },
    { n: () => L('تفريغ مكثفة','Capacitor discharge','Décharge du condensateur'), d: () => { const c = plotC('12e^(-t/2)', PLOT_COLORS[0], ''); return plotP({ curves: [c], xmin: 0, xmax: 12, ymin: 0, ymax: 14, ystep: 2, xlabel: 't (ms)', ylabel: 'u_C (V)', grid: 'mm', tangents: [{ curve: c.id, x0: 0, color: '#DC2626', len: 5 }], points: [{ x:2, onCurve: c.id, proj:true, projLabels:true, xl:'τ', yl:'0,37E', color:'#059669' }] }); } },
    { n: () => L('تيار في وشيعة (RL)','RL current','Courant RL'), d: () => plotP({ curves: [plotC('0.2(1-e^(-t/5))', PLOT_COLORS[0], '')], xmin: 0, xmax: 30, ymin: 0, ymax: 0.25, xstep: 5, ystep: 0.05, xlabel: 't (ms)', ylabel: 'i (A)', grid: 'mm', lines: [{ kind:'h', a:0.2, color:'#6B7280', dash:true, label:'I₀' }] }) },
    { n: () => L('التناقص الإشعاعي','Radioactive decay','Décroissance radioactive'), d: () => { const c = plotC('1000e^(-0.1386t)', PLOT_COLORS[0], ''); return plotP({ curves: [c], xmin: 0, xmax: 30, ymin: 0, ymax: 1100, xstep: 5, ystep: 100, xlabel: 't (j)', ylabel: 'N', grid: 'mm', points: [{ x:5, onCurve: c.id, proj:true, projLabels:true, xl:'t½', yl:'N₀/2', color:'#DC2626' }] }); } },
    { n: () => L('اهتزازات متخامدة','Damped oscillations','Oscillations amorties'), d: () => plotP({ curves: [plotC('5e^(-0.15t)cos(2t)', PLOT_COLORS[0], '')], xmin: 0, xmax: 20, ymin: -6, ymax: 6, xstep: 2, ystep: 1, xlabel: 't (s)', ylabel: 'x (cm)', grid: 'mm' }) },
    { n: () => L('توتر جيبي','Sinusoidal voltage','Tension sinusoïdale'), d: () => plotP({ curves: [plotC('5sin(2*pi*t/20)', PLOT_COLORS[0], '')], xmin: 0, xmax: 40, ymin: -6, ymax: 6, xstep: 5, ystep: 1, xlabel: 't (ms)', ylabel: 'u (V)', grid: 'mm' }) },
  ]},
  { g: () => L('كيمياء','Chemistry','Chimie'), items: [
    { n: () => L('تقدم التفاعل x(t)','Reaction progress','Avancement x(t)'), d: () => { const c = plotC('4(1-e^(-t/6))', PLOT_COLORS[0], ''); return plotP({ curves: [c], xmin: 0, xmax: 40, ymin: 0, ymax: 5, xstep: 5, ystep: 0.5, xlabel: 't (min)', ylabel: 'x (mmol)', grid: 'mm', lines: [{ kind:'h', a:4, color:'#6B7280', dash:true, label:'x_{max}' }], tangents: [{ curve: c.id, x0: 0, color: '#DC2626', len: 14 }] }); } },
    { n: () => L('منحنى المعايرة pH','Titration curve','Courbe de titrage'), d: () => plotP({ curves: [plotC('7+4.5*tanh(1.3(t-10))+0.08(t-10)', PLOT_COLORS[0], '')], xmin: 0, xmax: 20, ymin: 0, ymax: 14, xstep: 2, ystep: 1, xlabel: 'V_b (mL)', ylabel: 'pH', grid: 'mm', points: [{ x:10, y:7, label:'E', proj:true, projLabels:true, xl:'V_E', color:'#DC2626' }] }) },
  ]},
  { g: () => L('علوم طبيعية','Biology','SVT'), items: [
    { n: () => L('النشاط الإنزيمي والحرارة','Enzyme activity vs temperature','Activité enzymatique'), d: () => plotP({ curves: [plotC('100*e^(-((t-37)/11)^2)', PLOT_COLORS[0], '', { from: 0, to: 70 })], xmin: 0, xmax: 70, ymin: 0, ymax: 110, xstep: 10, ystep: 10, xlabel: 'T (°C)', ylabel: L('النشاط %','Activity %','Activité %'), grid: 'main' }) },
    { n: () => L('التركيب الضوئي وشدة الإضاءة','Photosynthesis vs light','Photosynthèse'), d: () => plotP({ curves: [plotC('20(1-e^(-t/300))-2', PLOT_COLORS[2], '')], xmin: 0, xmax: 1500, ymin: -4, ymax: 22, xstep: 250, ystep: 2, xlabel: 'lux', ylabel: 'O₂', grid: 'main' }) },
    { n: () => L('نمو مجتمع (منحنى لوجستي)','Logistic growth','Croissance logistique'), d: () => plotP({ curves: [plotC('1000/(1+99e^(-0.5t))', PLOT_COLORS[2], '')], xmin: 0, xmax: 24, ymin: 0, ymax: 1100, xstep: 2, ystep: 100, xlabel: 't (h)', ylabel: 'N', grid: 'main' }) },
    { n: () => L('تحليل نسبة السكر في الدم (من جدول)','Blood glucose (table)','Glycémie (tableau)'), d: () => plotP({ curves: [plotT([[0,0.9],[0.5,1.4],[1,1.6],[1.5,1.3],[2,1.0],[2.5,0.85],[3,0.9]], PLOT_COLORS[1], '')], xmin: 0, xmax: 3.5, ymin: 0, ymax: 2, xstep: 0.5, ystep: 0.2, xlabel: 't (h)', ylabel: 'g/L', grid: 'mm' }) },
  ]},
  { g: () => L('إحصاء','Statistics','Statistiques'), items: [
    { n: () => L('أعمدة بيانية','Bar chart','Diagramme en barres'), d: () => { const p = plotDefaults(); p.type = 'bar'; p.bars = { labels: ['[0-5[', '[5-10[', '[10-15[', '[15-20]'], series: [{ name: '', color: PLOT_COLORS[0], values: [3, 9, 12, 6] }], ylabel: L('عدد التلاميذ','Students','Élèves'), xlabel: L('العلامات','Marks','Notes'), showValues: true }; return p; } },
    { n: () => L('دائرة نسبية','Pie chart','Diagramme circulaire'), d: () => { const p = plotDefaults(); p.type = 'pie'; return p; } },
  ]},
];

registerKind('plot', {
  label: () => L('منحنى','Curve','Courbe'), icon: '📈', color: '#059669',
  render: (obj) => `<span class="g-box">${obj.svg || ''}</span>`,
  edit: openPlotEditor,
});

/* ---------- Editor modal ---------- */
function openPlotEditor(obj, done, opts){
  opts = opts || {};
  let d = JSON.parse(JSON.stringify((obj && obj.data) || plotDefaults()));
  d = Object.assign(plotDefaults(), d);
  const editing = !!(obj && obj.svg);
  const m = openModal({
    icon: '📈', color: '#059669', title: L('أداة المنحنيات','Curve tool','Outil courbes'), cls: 'plot-modal',
    footer: `<button class="big-btn ghost" data-close>${L('إلغاء','Cancel','Annuler')}</button>
      <button class="big-btn primary" data-save>${opts.mode === 'library' ? '📚 ' + L('حفظ في مكتبتي','Save to my library','Enregistrer') : editing ? '✔ ' + L('حفظ التعديل','Save changes','Enregistrer') : '⬇ ' + L('إدراج في الامتحان','Insert into the exam','Insérer dans l’examen')}</button>`,
    body: `<div class="plot-layout">
      <aside class="plot-presets"><div class="side-title">✨ ${L('منحنيات جاهزة — اضغط لاستعمالها','Ready curves — click to use','Courbes prêtes')}</div><div class="pp-list"></div></aside>
      <section class="plot-center">
        <div class="plot-types">
          <button data-type="func">📈 ${L('منحنى دالة','Function curve','Courbe de fonction')}</button>
          <button data-type="bar">📊 ${L('أعمدة بيانية','Bar chart','Diagramme en barres')}</button>
          <button data-type="pie">🥧 ${L('دائرة نسبية','Pie chart','Diagramme circulaire')}</button>
        </div>
        <div class="plot-preview"></div>
        <div class="plot-msg"></div>
      </section>
      <aside class="plot-settings"></aside>
    </div>`
  });
  const stop = showLoading(m.body, L('جارٍ تحضير أداة المنحنيات...','Preparing...','Préparation...'));
  const prev = m.body.querySelector('.plot-preview'), panel = m.body.querySelector('.plot-settings'), msg = m.body.querySelector('.plot-msg');
  let openSec = 'curves';

  loadMathjs().then(() => { stop(); drawPresets(); drawPanel(); update(); }).catch(e => { stop(); prev.textContent = e.message; });

  function update(){
    const bad = (d.type === 'func') ? d.curves.filter(c => c.kind === 'fx' && c.expr && !compileExpr(c.expr)) : [];
    msg.innerHTML = bad.length ? `⚠ ${L('لم أفهم كتابة الدالة','I could not read the function','Fonction illisible')}: <b dir="ltr">${escapeHtml(bad[0].expr)}</b> — ${L('مثال صحيح: x^2-3x+2 أو 2sin(x) أو e^(-t/2)','Valid example: x^2-3x+2, 2sin(x) or e^(-t/2)','Exemple : x^2-3x+2')}` : '';
    prev.innerHTML = plotSvg(d);
  }
  function drawPresets(){
    const list = m.body.querySelector('.pp-list');
    list.innerHTML = PLOT_PRESETS.map((g, gi) => `<div class="ex-group" style="color:#059669">${g.g()}</div>` + g.items.map((it, i) =>
      `<button class="pp-card" data-g="${gi}" data-i="${i}"><span class="pp-thumb">${plotSvg(it.d())}</span><span class="pp-name">${it.n()}</span></button>`).join('')).join('');
    list.querySelectorAll('.pp-card').forEach(b => b.addEventListener('click', () => {
      d = PLOT_PRESETS[+b.dataset.g].items[+b.dataset.i].d(); openSec = d.type === 'func' ? 'curves' : 'data'; drawPanel(); update();
    }));
  }
  function sec(id, title, icon, html){
    return `<div class="acc ${openSec === id ? 'open' : ''}" data-sec="${id}"><button class="acc-h"><span>${icon}</span>${title}<i>${openSec === id ? '▾' : '◂'}</i></button><div class="acc-b">${html}</div></div>`;
  }
  const curveOpts = (sel) => d.curves.map((c, i) => `<option value="${c.id}" ${c.id === sel ? 'selected' : ''}>${c.label || (c.kind === 'fx' ? c.expr : L('جدول','table','tableau') + ' ' + (i+1))}</option>`).join('');
  const colorSel = (val, attr) => `<span class="color-pick">${PLOT_COLORS.map(c => `<button class="cdot ${c === val ? 'on' : ''}" style="background:${c}" data-color="${c}" ${attr}></button>`).join('')}</span>`;
  function inp(attr, val, ph, cls, type){ return `<input class="pinp ${cls || ''}" ${attr} value="${escAttr(val == null ? '' : val)}" placeholder="${escAttr(ph || '')}" ${type ? `type="${type}"` : ''}>`; }

  function drawPanel(){
    m.body.querySelectorAll('.plot-types button').forEach(b => b.classList.toggle('on', b.dataset.type === d.type));
    let h = '';
    if(d.type === 'func'){
      h += sec('curves', L('الدوال والمنحنيات','Functions & curves','Fonctions et courbes'), '📈', d.curves.map((c, i) => `
        <div class="curve-row" data-ci="${i}">
          <div class="cr-top">
            ${colorSel(c.color, `data-f="color"`)}
            <button class="x-del" data-del="curve" title="${L('حذف','Delete','Supprimer')}">🗑️</button>
          </div>
          ${c.kind === 'fx' ? `<label class="fx-line"><b>f(x) =</b>${inp('data-f="expr" dir="ltr"', c.expr, 'x^2-3x+2', 'fx-inp')}</label>` : `
            <div class="tbl-pts"><table><tr><th>x</th><th>y</th><th></th></tr>${c.pts.map((p, k) => `<tr><td>${inp(`data-pt="${k}" data-xy="0" dir="ltr"`, p[0], '', 'pt')}</td><td>${inp(`data-pt="${k}" data-xy="1" dir="ltr"`, p[1], '', 'pt')}</td><td><button class="x-del" data-delpt="${k}">✕</button></td></tr>`).join('')}</table>
            <button class="mini-btn" data-addpt>+ ${L('سطر','Row','Ligne')}</button>
            <select class="pinp" data-f="connect"><option value="smooth" ${c.connect==='smooth'?'selected':''}>${L('منحنى أملس','Smooth curve','Courbe lisse')}</option><option value="line" ${c.connect==='line'?'selected':''}>${L('قطع مستقيمة','Straight segments','Segments')}</option><option value="none" ${c.connect==='none'?'selected':''}>${L('نقاط فقط','Points only','Points seuls')}</option></select></div>`}
          <div class="cr-grid">
            <label>${L('الاسم','Name','Nom')}${inp('data-f="label" dir="ltr"', c.label, '(C_f)')}</label>
            ${c.kind === 'fx' ? `<label>${L('من','From','De')}${inp('data-f="from" dir="ltr"', c.from, '')}</label><label>${L('إلى','To','À')}${inp('data-f="to" dir="ltr"', c.to, '')}</label>` : ''}
            <label class="chk"><input type="checkbox" data-f="dash" ${c.dash ? 'checked' : ''}> ${L('متقطع','Dashed','Pointillé')}</label>
          </div>
        </div>`).join('') + `<div class="add-row">
          <button class="add-btn" data-add="fx">➕ ${L('دالة جديدة','New function','Nouvelle fonction')}</button>
          <button class="add-btn" data-add="table">➕ ${L('من جدول قيم','From a table of values','Depuis un tableau')}</button></div>
          <div class="hint">💡 ${L('أمثلة للكتابة:','Examples:','Exemples :')} <code dir="ltr">x^2-3x+2</code> <code dir="ltr">2x+1</code> <code dir="ltr">sqrt(x)</code> <code dir="ltr">e^(-t/2)</code> <code dir="ltr">ln(x)</code> <code dir="ltr">sin(x)</code> <code dir="ltr">1/(x-1)</code></div>`);
      h += sec('axes', L('المعلم والمحاور','Axes & grid','Repère et axes'), '✛', `
        <div class="ax-grid">
          <label>${L('x من','x from','x de')}${inp('data-a="xmin" dir="ltr"', d.xmin, '', '', 'number')}</label>
          <label>${L('إلى','to','à')}${inp('data-a="xmax" dir="ltr"', d.xmax, '', '', 'number')}</label>
          <label>${L('التدريج','step','pas')}${inp('data-a="xstep" dir="ltr"', d.xstep, '', '', 'number')}</label>
          <label>${L('y من','y from','y de')}${inp('data-a="ymin" dir="ltr"', d.ymin, '', '', 'number')}</label>
          <label>${L('إلى','to','à')}${inp('data-a="ymax" dir="ltr"', d.ymax, '', '', 'number')}</label>
          <label>${L('التدريج','step','pas')}${inp('data-a="ystep" dir="ltr"', d.ystep, '', '', 'number')}</label>
          <label>${L('اسم محور الفواصل','x-axis name','Nom axe x')}${inp('data-a="xlabel" dir="ltr"', d.xlabel, 'x')}</label>
          <label>${L('اسم محور التراتيب','y-axis name','Nom axe y')}${inp('data-a="ylabel" dir="ltr"', d.ylabel, 'y')}</label>
          <label>${L('المبدأ','Origin','Origine')}${inp('data-a="origin" dir="ltr"', d.origin, 'O')}</label>
        </div>
        <div class="seg-row"><span>${L('الشبكة:','Grid:','Grille :')}</span>
          <div class="seg" style="--accent:#059669">
            <button data-grid="none" class="${d.grid==='none'?'on':''}">${L('بدون','None','Aucune')}</button>
            <button data-grid="main" class="${d.grid==='main'?'on':''}">${L('مربعات','Squares','Carreaux')}</button>
            <button data-grid="mm" class="${d.grid==='mm'?'on':''}">${L('ورق ميليمتري','Graph paper','Millimétré')}</button></div></div>
        <label class="chk"><input type="checkbox" data-a="equal" ${d.equal ? 'checked' : ''}> ${L('معلم متعامد ومتجانس (نفس الوحدة على المحورين)','Same unit on both axes','Repère orthonormé')}</label>
        <label class="chk"><input type="checkbox" data-a="numbers" ${d.numbers !== false ? 'checked' : ''}> ${L('كتابة الأعداد على المحورين','Show numbers on axes','Graduations chiffrées')}</label>
        ${d.equal ? '' : `<label class="range-l">${L('ارتفاع الرسم','Height','Hauteur')}<input type="range" min="220" max="800" step="10" data-a="height" value="${d.height}"></label>`}
        <button class="mini-btn" data-auto>🪄 ${L('ضبط المحاور تلقائيًا حسب المنحنى','Auto-fit axes to the curve','Ajuster automatiquement')}</button>`);
      h += sec('extras', L('نقاط، مماسات، مساحات، مستقيمات','Points, tangents, areas, lines','Points, tangentes, aires, droites'), '📍', `
        <div class="ex-sub">📍 ${L('النقاط','Points','Points')}</div>
        ${d.points.map((p, i) => `<div class="ex-row" data-pi="${i}">
          ${inp('data-p="label" dir="ltr"', p.label, 'A', 'sm')}
          <label>x${inp('data-p="x" dir="ltr"', p.x, '', 'sm', 'number')}</label>
          ${p.onCurve ? `<select class="pinp sm" data-p="onCurve">${curveOpts(p.onCurve)}<option value="">y=…</option></select>` : `<label>y${inp('data-p="y" dir="ltr"', p.y, '', 'sm', 'number')}</label>`}
          <label class="chk" title="${L('إسقاط على المحورين','Projections','Projections')}"><input type="checkbox" data-p="proj" ${p.proj ? 'checked' : ''}>┆</label>
          <button class="x-del" data-del="point">✕</button></div>`).join('')}
        <div class="add-row"><button class="add-btn sm" data-add="point">+ ${L('نقطة','Point','Point')}</button>${d.curves.length ? `<button class="add-btn sm" data-add="pointOn">+ ${L('نقطة على المنحنى','Point on curve','Point sur la courbe')}</button>` : ''}</div>
        <div class="ex-sub">📐 ${L('المماسات','Tangents','Tangentes')}</div>
        ${d.tangents.map((tg, i) => `<div class="ex-row" data-ti="${i}">
          <select class="pinp sm" data-t="curve">${curveOpts(tg.curve)}</select>
          <label>${L('عند x =','at x =','en x =')}${inp('data-t="x0" dir="ltr"', tg.x0, '', 'sm', 'number')}</label>
          ${inp('data-t="label" dir="ltr"', tg.label, '(T)', 'sm')}
          <button class="x-del" data-del="tangent">✕</button></div>`).join('')}
        ${d.curves.length ? `<button class="add-btn sm" data-add="tangent">+ ${L('مماس','Tangent','Tangente')}</button>` : ''}
        <div class="ex-sub">🎨 ${L('تظليل مساحة','Shaded area','Aire hachurée')}</div>
        ${d.areas.map((a, i) => `<div class="ex-row" data-ai="${i}">
          <select class="pinp sm" data-ar="curve">${curveOpts(a.curve)}</select>
          <label>${L('من','from','de')}${inp('data-ar="a" dir="ltr"', a.a, '', 'sm', 'number')}</label>
          <label>${L('إلى','to','à')}${inp('data-ar="b" dir="ltr"', a.b, '', 'sm', 'number')}</label>
          <select class="pinp sm" data-ar="curve2"><option value="">${L('ومحور الفواصل','and x-axis','et l’axe')}</option>${curveOpts(a.curve2)}</select>
          <button class="x-del" data-del="area">✕</button></div>`).join('')}
        ${d.curves.length ? `<button class="add-btn sm" data-add="area">+ ${L('مساحة','Area','Aire')}</button>` : ''}
        <div class="ex-sub">┊ ${L('مستقيمات (مقاربة...)','Lines (asymptotes…)','Droites (asymptotes…)')}</div>
        ${d.lines.map((l, i) => `<div class="ex-row" data-li="${i}">
          <select class="pinp sm" data-l="kind"><option value="v" ${l.kind==='v'?'selected':''}>x = a</option><option value="h" ${l.kind==='h'?'selected':''}>y = a</option><option value="o" ${l.kind==='o'?'selected':''}>y = ax+b</option></select>
          <label>a${inp('data-l="a" dir="ltr"', l.a, '', 'sm', 'number')}</label>
          ${l.kind === 'o' ? `<label>b${inp('data-l="b" dir="ltr"', l.b, '', 'sm', 'number')}</label>` : ''}
          ${inp('data-l="label" dir="ltr"', l.label, '(Δ)', 'sm')}
          <button class="x-del" data-del="line">✕</button></div>`).join('')}
        <button class="add-btn sm" data-add="line">+ ${L('مستقيم','Line','Droite')}</button>`);
      h += sec('title', L('عنوان الرسم','Chart title','Titre'), '🏷️', `<label class="full">${inp('data-a="title"', d.title, L('اختياري','optional','facultatif'))}</label>`);
    } else if(d.type === 'bar'){
      const b = d.bars;
      h += sec('data', L('البيانات','Data','Données'), '📊', `
        <table class="data-tab"><tr><th>${L('الفئة','Category','Catégorie')}</th>${b.series.map((se, k) => `<th>${inp(`data-sname="${k}"`, se.name, L('السلسلة','Series','Série') + ' ' + (k+1), 'sm')}${colorSel(se.color, `data-scolor="${k}"`)}</th>`).join('')}<th></th></tr>
        ${b.labels.map((lab, i) => `<tr><td>${inp(`data-blabel="${i}"`, lab, '', 'sm')}</td>${b.series.map((se, k) => `<td>${inp(`data-bval="${i}" data-bs="${k}" dir="ltr"`, se.values[i], '', 'sm', 'number')}</td>`).join('')}<td><button class="x-del" data-delbar="${i}">✕</button></td></tr>`).join('')}</table>
        <div class="add-row"><button class="add-btn sm" data-add="barrow">+ ${L('فئة','Category','Catégorie')}</button><button class="add-btn sm" data-add="series">+ ${L('سلسلة','Series','Série')}</button></div>
        <label class="chk"><input type="checkbox" data-bopt="showValues" ${b.showValues ? 'checked' : ''}> ${L('كتابة القيم فوق الأعمدة','Show values','Afficher les valeurs')}</label>
        <div class="ax-grid"><label>${L('اسم المحور العمودي','Vertical axis name','Axe vertical')}${inp('data-bopt="ylabel"', b.ylabel, '')}</label><label>${L('اسم المحور الأفقي','Horizontal axis name','Axe horizontal')}${inp('data-bopt="xlabel"', b.xlabel, '')}</label></div>
        <label class="full">${L('العنوان','Title','Titre')}${inp('data-a="title"', d.title, '')}</label>`);
    } else {
      const p = d.pie;
      h += sec('data', L('البيانات','Data','Données'), '🥧', `
        <table class="data-tab"><tr><th>${L('الجزء','Part','Partie')}</th><th>${L('القيمة','Value','Valeur')}</th><th>${L('اللون','Colour','Couleur')}</th><th></th></tr>
        ${p.items.map((it, i) => `<tr><td>${inp(`data-plabel="${i}"`, it.label, '', 'sm')}</td><td>${inp(`data-pval="${i}" dir="ltr"`, it.value, '', 'sm', 'number')}</td><td>${colorSel(it.color, `data-pcolor="${i}"`)}</td><td><button class="x-del" data-delpie="${i}">✕</button></td></tr>`).join('')}</table>
        <button class="add-btn sm" data-add="pierow">+ ${L('جزء','Part','Partie')}</button>
        <label class="chk"><input type="checkbox" data-popt="percent" ${p.percent ? 'checked' : ''}> ${L('كتابة النسب المئوية','Show percentages','Afficher les pourcentages')}</label>
        <label class="full">${L('العنوان','Title','Titre')}${inp('data-a="title"', d.title, '')}</label>`);
    }
    panel.innerHTML = h;
    bindPanel();
  }
  function bindPanel(){
    panel.querySelectorAll('.acc-h').forEach(b => b.onclick = () => { const s = b.parentElement.dataset.sec; openSec = openSec === s ? '' : s; drawPanel(); });
    const num = v => v === '' ? '' : +v;
    panel.querySelectorAll('.curve-row').forEach(row => {
      const c = d.curves[+row.dataset.ci];
      row.querySelectorAll('[data-f]').forEach(el => {
        const f = el.dataset.f;
        if(el.classList.contains('cdot')) el.onclick = () => { c.color = el.dataset.color; drawPanel(); update(); };
        else if(el.type === 'checkbox') el.onchange = () => { c[f] = el.checked; update(); };
        else el.oninput = () => { c[f] = (f === 'from' || f === 'to') ? el.value.replace(',', '.') : el.value; update(); };
      });
      row.querySelectorAll('[data-pt]').forEach(el => el.oninput = () => { c.pts[+el.dataset.pt][+el.dataset.xy] = parseFloat(el.value.replace(',', '.')); update(); });
      row.querySelectorAll('[data-delpt]').forEach(el => el.onclick = () => { c.pts.splice(+el.dataset.delpt, 1); drawPanel(); update(); });
      const ap = row.querySelector('[data-addpt]'); if(ap) ap.onclick = () => { const last = c.pts[c.pts.length - 1] || [0, 0]; c.pts.push([+(last[0] + 1), last[1]]); drawPanel(); update(); };
      row.querySelector('[data-del="curve"]').onclick = () => { d.curves.splice(+row.dataset.ci, 1); drawPanel(); update(); };
    });
    panel.querySelectorAll('[data-a]').forEach(el => {
      const a = el.dataset.a;
      if(el.type === 'checkbox') el.onchange = () => { d[a] = el.checked; if(a === 'equal') drawPanel(); update(); };
      else el.oninput = () => { d[a] = el.type === 'number' || el.type === 'range' ? (el.value === '' ? d[a] : +el.value) : el.value; update(); };
    });
    panel.querySelectorAll('[data-grid]').forEach(b => b.onclick = () => { d.grid = b.dataset.grid; drawPanel(); update(); });
    const auto = panel.querySelector('[data-auto]'); if(auto) auto.onclick = () => { autoFit(); drawPanel(); update(); };
    const rowBind = (sel, arr, key) => panel.querySelectorAll(sel).forEach(row => {
      const item = arr[+row.dataset[key]];
      row.querySelectorAll('input, select').forEach(el => {
        const f = el.dataset.p || el.dataset.t || el.dataset.ar || el.dataset.l;
        if(!f) return;
        if(el.type === 'checkbox') el.onchange = () => { item[f] = el.checked; if(f === 'proj') item.projLabels = el.checked; update(); };
        else el.oninput = el.onchange = () => { item[f] = el.type === 'number' ? (el.value === '' ? '' : +el.value) : el.value; if(f === 'kind' || f === 'onCurve') drawPanel(); update(); };
      });
    });
    rowBind('[data-pi]', d.points, 'pi'); rowBind('[data-ti]', d.tangents, 'ti'); rowBind('[data-ai]', d.areas, 'ai'); rowBind('[data-li]', d.lines, 'li');
    panel.querySelectorAll('[data-del]').forEach(b => {
      const t = b.dataset.del; if(t === 'curve') return;
      b.onclick = () => {
        const row = b.closest('.ex-row');
        if(t === 'point') d.points.splice(+row.dataset.pi, 1);
        if(t === 'tangent') d.tangents.splice(+row.dataset.ti, 1);
        if(t === 'area') d.areas.splice(+row.dataset.ai, 1);
        if(t === 'line') d.lines.splice(+row.dataset.li, 1);
        drawPanel(); update();
      };
    });
    panel.querySelectorAll('[data-add]').forEach(b => b.onclick = () => {
      const t = b.dataset.add, c0 = d.curves[0];
      if(t === 'fx') d.curves.push(plotC('', PLOT_COLORS[d.curves.length % PLOT_COLORS.length], ''));
      if(t === 'table') d.curves.push(plotT([[0, 0], [1, 1], [2, 4], [3, 9]], PLOT_COLORS[d.curves.length % PLOT_COLORS.length], '', 'line'));
      if(t === 'point') d.points.push({ x: 1, y: 1, label: String.fromCharCode(65 + d.points.length), proj: false, color: '#111' });
      if(t === 'pointOn' && c0) d.points.push({ x: 1, onCurve: c0.id, label: String.fromCharCode(65 + d.points.length), proj: true, projLabels: true, color: '#111' });
      if(t === 'tangent' && c0) d.tangents.push({ curve: c0.id, x0: 1, color: '#DC2626', label: '(T)' });
      if(t === 'area' && c0) d.areas.push({ curve: c0.id, a: 0, b: 1, color: '#93C5FD' });
      if(t === 'line') d.lines.push({ kind: 'v', a: 1, b: 0, color: '#6B7280', dash: true, label: '' });
      if(t === 'barrow'){ d.bars.labels.push(''); d.bars.series.forEach(s => s.values.push(0)); }
      if(t === 'series') d.bars.series.push({ name: '', color: PLOT_COLORS[d.bars.series.length % PLOT_COLORS.length], values: d.bars.labels.map(() => 0) });
      if(t === 'pierow') d.pie.items.push({ label: '', value: 10, color: PLOT_COLORS[d.pie.items.length % PLOT_COLORS.length] });
      drawPanel(); update();
    });
    // bars
    panel.querySelectorAll('[data-blabel]').forEach(el => el.oninput = () => { d.bars.labels[+el.dataset.blabel] = el.value; update(); });
    panel.querySelectorAll('[data-bval]').forEach(el => el.oninput = () => { d.bars.series[+el.dataset.bs].values[+el.dataset.bval] = +el.value; update(); });
    panel.querySelectorAll('[data-sname]').forEach(el => el.oninput = () => { d.bars.series[+el.dataset.sname].name = el.value; update(); });
    panel.querySelectorAll('[data-scolor]').forEach(el => el.onclick = () => { d.bars.series[+el.dataset.scolor].color = el.dataset.color; drawPanel(); update(); });
    panel.querySelectorAll('[data-delbar]').forEach(el => el.onclick = () => { const i = +el.dataset.delbar; d.bars.labels.splice(i, 1); d.bars.series.forEach(s => s.values.splice(i, 1)); drawPanel(); update(); });
    panel.querySelectorAll('[data-bopt]').forEach(el => { if(el.type === 'checkbox') el.onchange = () => { d.bars[el.dataset.bopt] = el.checked; update(); }; else el.oninput = () => { d.bars[el.dataset.bopt] = el.value; update(); }; });
    // pie
    panel.querySelectorAll('[data-plabel]').forEach(el => el.oninput = () => { d.pie.items[+el.dataset.plabel].label = el.value; update(); });
    panel.querySelectorAll('[data-pval]').forEach(el => el.oninput = () => { d.pie.items[+el.dataset.pval].value = +el.value; update(); });
    panel.querySelectorAll('[data-pcolor]').forEach(el => el.onclick = () => { d.pie.items[+el.dataset.pcolor].color = el.dataset.color; drawPanel(); update(); });
    panel.querySelectorAll('[data-delpie]').forEach(el => el.onclick = () => { d.pie.items.splice(+el.dataset.delpie, 1); drawPanel(); update(); });
    panel.querySelectorAll('[data-popt]').forEach(el => el.onchange = () => { d.pie[el.dataset.popt] = el.checked; update(); });
  }
  function autoFit(){
    let lo = Infinity, hi = -Infinity;
    d.curves.forEach(c => {
      const f = curveFn(c); if(!f) return;
      if(c.kind === 'table'){ c.pts.forEach(p => { lo = Math.min(lo, p[1]); hi = Math.max(hi, p[1]); }); return; }
      const ys = [];
      for(let i=0;i<=400;i++){ const y = f(+d.xmin + (d.xmax - d.xmin) * i / 400); if(isFinite(y)) ys.push(y); }
      ys.sort((a, b) => a - b);
      if(ys.length){ lo = Math.min(lo, ys[Math.floor(ys.length * 0.03)]); hi = Math.max(hi, ys[Math.ceil(ys.length * 0.97) - 1]); }
    });
    if(!isFinite(lo)) return;
    const pad = (hi - lo) * 0.12 || 1;
    const st = niceStep((hi - lo + 2 * pad) / 10);
    d.ymin = Math.floor((Math.min(lo - pad, 0)) / st) * st; d.ymax = Math.ceil((hi + pad) / st) * st; d.ystep = st;
    d.xstep = niceStep((d.xmax - d.xmin) / 10);
  }
  m.body.querySelectorAll('.plot-types button').forEach(b => b.onclick = () => { d.type = b.dataset.type; openSec = d.type === 'func' ? 'curves' : 'data'; drawPanel(); update(); });
  m.foot.querySelector('[data-save]').onclick = () => {
    const svg = plotSvg(d);
    m.close();
    done({ kind: 'plot', data: d, svg, w: (obj && obj.w) || (d.type === 'pie' ? 380 : 400) });
  };
}

/* regenerate svg from data (templates / library) */
async function ensurePlotSvg(obj){ if(obj.kind === 'plot' && !obj.svg){ await loadMathjs(); obj.svg = plotSvg(Object.assign(plotDefaults(), obj.data)); } return obj; }
