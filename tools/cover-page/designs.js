// ============================================================
// designs.js — the cover designs.
// Each design builds the page HTML from the same data (V).
// Decorations are inline SVG with literal colours (computed from
// the chosen main colour) so they render the same in PDF and PNG.
// No living beings are drawn. Decorations are drawn left-to-right;
// those marked "flipx" are mirrored on right-to-left pages.
// ============================================================
(function () {
  "use strict";

  const E = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function mix(hex, other, w) {
    const a = parseInt(hex.slice(1), 16), b = parseInt(other.slice(1), 16);
    const ch = (x, s) => (x >> s) & 255;
    const m = (s) => Math.round(ch(a, s) * (1 - w) + ch(b, s) * w);
    return '#' + [16, 8, 0].map((s) => m(s).toString(16).padStart(2, '0')).join('');
  }
  function shades(c) {
    return { c, d: mix(c, '#000000', 0.35), dd: mix(c, '#000000', 0.6), m: mix(c, '#ffffff', 0.45), l: mix(c, '#ffffff', 0.78), xl: mix(c, '#ffffff', 0.92), xxl: mix(c, '#ffffff', 0.965) };
  }

  // cat: uni | school | pro | theme ; font: id in COVER_FONTS ; ex: example set
  const DESIGNS = [
    // --- the four existing layouts ---
    { id: 'phd', cat: ['uni'], color: '#1F3A5F', font: 3, jury: true, ex: 'phd', name: { ar: 'أطروحة دكتوراه', fr: 'Thèse de doctorat', en: 'PhD dissertation' } },
    { id: 'grad', cat: ['uni'], color: '#2F5770', font: 1, jury: true, dual: true, name: { ar: 'مذكرة تخرج بشعارين', fr: 'Mémoire à deux logos', en: 'Thesis, two logos' } },
    { id: 'project', cat: ['uni', 'school'], color: '#3A6E8F', font: 4, ex: 'project', name: { ar: 'مشروع دراسي', fr: "Projet d'étude", en: 'Study project' } },
    { id: 'corporate', cat: ['pro'], color: '#0F4C81', font: 1, ex: 'corporate', name: { ar: 'تقرير مؤسسي', fr: 'Rapport institutionnel', en: 'Corporate report' } },
    // --- new designs ---
    { id: 'academic', cat: ['uni'], color: '#14365A', font: 2, name: { ar: 'أكاديمي رسمي', fr: 'Académique officiel', en: 'Formal academic' } },
    { id: 'luxury', cat: ['uni', 'theme'], color: '#A07D2E', font: 2, name: { ar: 'جامعي فاخر', fr: 'Universitaire prestige', en: 'Prestige university' } },
    { id: 'geometric', cat: ['uni', 'pro'], color: '#2B4C7E', font: 5, name: { ar: 'عصري بأشكال هندسية', fr: 'Moderne géométrique', en: 'Modern geometric' } },
    { id: 'sidebar', cat: ['uni', 'pro'], color: '#0F766E', font: 1, name: { ar: 'بشريط جانبي ملوّن', fr: 'Bande latérale', en: 'Coloured side band' } },
    { id: 'gradient', cat: ['uni', 'school'], color: '#4338CA', font: 4, name: { ar: 'بخلفية متدرجة', fr: 'Fond en dégradé', en: 'Gradient header' } },
    { id: 'minimal', cat: ['uni', 'pro'], color: '#111827', font: 1, name: { ar: 'بسيط أنيق', fr: 'Minimal élégant', en: 'Elegant minimal' } },
    { id: 'tech', cat: ['uni', 'pro'], color: '#0B5394', font: 5, ex: 'tech', name: { ar: 'هندسي تقني', fr: 'Ingénierie technique', en: 'Technical engineering' } },
    { id: 'science', cat: ['theme', 'uni'], color: '#0E7490', font: 1, ex: 'science', name: { ar: 'علمي', fr: 'Scientifique', en: 'Scientific' } },
    { id: 'literary', cat: ['theme', 'uni'], color: '#7B2D26', font: 2, ex: 'literary', name: { ar: 'أدبي', fr: 'Littéraire', en: 'Literary' } },
    { id: 'kids', cat: ['school'], color: '#F97316', font: 4, ex: 'kids', name: { ar: 'ابتدائي ملوّن للأطفال', fr: 'Primaire coloré', en: 'Colourful primary school' } },
    { id: 'thesis', cat: ['uni'], color: '#1E40AF', font: 3, jury: true, dual: true, name: { ar: 'مذكرة تخرج', fr: 'Mémoire de fin d’études', en: 'Graduation thesis' } },
    { id: 'internship', cat: ['pro', 'uni'], color: '#B45309', font: 1, ex: 'internship', name: { ar: 'تقرير تربص مهني', fr: 'Rapport de stage', en: 'Internship report' } },
    { id: 'islamic', cat: ['theme'], color: '#0F5132', font: 2, ex: 'islamic', name: { ar: 'ديني بزخارف إسلامية', fr: 'Motifs islamiques', en: 'Islamic patterns' } },
    { id: 'waves', cat: ['uni', 'school'], color: '#0369A1', font: 1, name: { ar: 'بأمواج ناعمة', fr: 'Vagues douces', en: 'Soft waves' } },
    { id: 'dark', cat: ['theme', 'pro'], color: '#D4AF37', font: 2, name: { ar: 'داكن فاخر', fr: 'Sombre prestige', en: 'Dark prestige' } },
  ];

  const FONTS = [
    { id: 1, name: { ar: 'عصري', fr: 'Moderne', en: 'Modern' }, ar: "'Tajawal'", en: "'Inter'" },
    { id: 2, name: { ar: 'كلاسيكي', fr: 'Classique', en: 'Classic' }, ar: "'Amiri'", en: "'Georgia'" },
    { id: 3, name: { ar: 'رسمي تقليدي', fr: 'Officiel', en: 'Formal' }, ar: "'Noto Naskh Arabic'", en: "'Georgia'" },
    { id: 4, name: { ar: 'بسيط', fr: 'Simple', en: 'Simple' }, ar: "'Cairo'", en: "'Roboto', 'Inter'" },
    { id: 5, name: { ar: 'هندسي', fr: 'Géométrique', en: 'Geometric' }, ar: "'Reem Kufi'", en: "'Montserrat'" },
    { id: 6, name: { ar: 'زخرفي', fr: 'Décoratif', en: 'Decorative' }, ar: "'Aref Ruqaa'", en: "'Playfair Display'" },
  ];

  const PALETTE = ['#1F3A5F', '#0F766E', '#1E40AF', '#4338CA', '#7C3AED', '#B91C1C', '#7B2D26', '#B45309', '#A07D2E', '#0E7490', '#15803D', '#111827'];

  // default logo (open book), drawn in the design colour
  function defaultLogo(c) {
    const s = shades(c);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><circle cx="48" cy="48" r="45" fill="#ffffff" stroke="${s.l}" stroke-width="2"/><circle cx="48" cy="48" r="38" fill="none" stroke="${s.xl}" stroke-width="1.5"/><path d="M48 32c-6-4-16-4-22 0v32c6-4 16-4 22 0z" fill="${s.c}"/><path d="M48 32c6-4 16-4 22 0v32c-6-4-16-4-22 0z" fill="${s.m}"/><path d="M48 32v32" stroke="#ffffff" stroke-width="1.5"/></svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
  }

  /* ---------------- shared parts ---------------- */
  function parts(V, X) {
    const L = X.L;
    const ln = (v, cls) => (v ? `<p class="${cls}">${E(v)}</p>` : '');
    const P = {};
    P.head = (cls) => (V.country || V.ministry ? `<div class="p-head ${cls || ''}" data-sec="inst">${ln(V.country, 't-country')}${ln(V.ministry, 't-ministry')}</div>` : '');
    P.inst = (cls) => (V.uni || V.faculty || V.dept ? `<div class="p-inst ${cls || ''}" data-sec="inst">${ln(V.uni, 't-uni')}${ln(V.faculty, 't-fac')}${ln(V.dept, 't-dept')}</div>` : '');
    P.logo = (n, cls) => { const src = n === 2 ? X.logo2 : X.logo1; return src ? `<img class="cv-logo ${cls || ''}" data-sec="inst" src="${src}" alt="">` : ''; };
    P.logos = (cls) => `<div class="p-logos ${cls || ''}">${P.logo(1)}${P.logo(2)}</div>`;
    P.type = (cls) => (V.workType ? `<p class="t-type ${cls || ''}" data-sec="work">${E(V.workType)}</p>` : '');
    P.title = (cls) => `<div class="p-title ${cls || ''}" data-sec="work"><h1 class="t-title">${E(V.title)}</h1>${ln(V.subtitle, 't-sub')}</div>`;
    P.work = (cls) => `<div class="p-work ${cls || ''}" data-sec="work">${ln(V.workType, 't-type')}<h1 class="t-title">${E(V.title)}</h1>${ln(V.subtitle, 't-sub')}</div>`;
    P.level = (cls) => (V.level || V.specialty ? `<div class="p-level ${cls || ''}" data-sec="level">${ln(V.level, 't-level')}${V.specialty ? `<p class="t-spec"><span class="t-lbl">${E(L.l_spec)}</span> ${E(V.specialty)}</p>` : ''}</div>` : '');
    P.teamLabel = () => (X.design.id === 'corporate' ? L.l_prepared : (V.students.length > 1 ? L.l_by_n : L.l_by));
    P.team = (cls) => (V.students.length ? `<div class="p-team ${cls || ''}" data-sec="team"><p class="t-lbl">${E(P.teamLabel())}</p>${V.students.map((n) => `<p class="t-name">${E(n)}</p>`).join('')}</div>` : '');
    P.sup = (cls) => (V.supervisor || V.coSup ? `<div class="p-sup ${cls || ''}" data-sec="sup">${V.supervisor ? `<p class="t-lbl">${E(L.l_sup)}</p><p class="t-name">${E(V.supervisor)}</p>` : ''}${V.coSup ? `<p class="t-cosup"><span class="t-lbl">${E(L.l_cosup)}</span> ${E(V.coSup)}</p>` : ''}</div>` : '');
    P.people = (cls, noSup) => { const a = P.team(), b = noSup ? '' : P.sup(); return a || b ? `<div class="p-people ${a && b ? 'two' : ''} ${cls || ''}">${a}${b}</div>` : ''; };
    P.jury = (cls) => {
      if (!V.juryOn || !V.jury.length) return '';
      const cols = L.l_jcols;
      const rows = V.jury.map((r) => `<tr><td>${E(r.name)}</td><td>${E(r.rank)}</td><td>${E(r.uni)}</td><td>${E(L.roles[r.role] || '')}</td></tr>`).join('');
      return `<div class="p-jury ${cls || ''}" data-sec="sup"><p class="t-jury-h">${E(L.l_jury)}</p><table class="t-jury"><thead><tr>${cols.map((c) => `<th>${E(c)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;
    };
    P.dateLine = () => [V.place, V.date ? `${L.l_defended} ${V.date}` : ''].filter(Boolean).join(' — ');
    P.year = (cls) => (V.year || V.place || V.date ? `<div class="p-year ${cls || ''}" data-sec="year">${ln(V.year, 't-year')}${ln(P.dateLine(), 't-date')}</div>` : '');
    P.host = (cls) => (V.host ? `<p class="t-host ${cls || ''}" data-sec="inst"><span class="t-lbl">${E(L.l_host)}</span> ${E(V.host)}</p>` : '');
    return P;
  }

  const svg = (inner, cls) => `<svg class="${cls || ''}" xmlns="http://www.w3.org/2000/svg" width="794" height="1123" viewBox="0 0 794 1123">${inner}</svg>`;
  const deco = (inner, cls) => `<div class="cv-deco">${svg(inner, cls)}</div>`;
  const body = (inner, cls) => `<div class="cv-body ${cls || ''}">${inner}</div>`;

  /* ---------------- decoration helpers ---------------- */
  const star8 = (cx, cy, r, attrs) => {
    const sq = (rot) => [0, 1, 2, 3].map((i) => { const a = rot + i * Math.PI / 2 + Math.PI / 4; return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
    return `<polygon points="${sq(0)}" ${attrs}/><polygon points="${sq(Math.PI / 4)}" ${attrs}/>`;
  };
  const star5 = (cx, cy, r, fill) => {
    const p = [];
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5; const rr = i % 2 ? r * 0.45 : r; p.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`); }
    return `<polygon points="${p.join(' ')}" fill="${fill}"/>`;
  };
  const hex = (cx, cy, r, attrs) => `<polygon points="${[0, 1, 2, 3, 4, 5].map((i) => { const a = Math.PI / 6 + i * Math.PI / 3; return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`; }).join(' ')}" ${attrs}/>`;
  function corner(x, y, sx, sy, s) {
    return `<g transform="translate(${x} ${y}) scale(${sx} ${sy})" fill="none" stroke="${s.c}">
      <path d="M0 150 V0 H150" stroke-width="2.4"/><path d="M14 112 V14 H112" stroke-width="1"/>
      <path d="M28 70 Q28 28 70 28" stroke-width="1.4"/><path d="M40 52 Q40 40 52 40" stroke-width="1"/>
      <rect x="6" y="6" width="16" height="16" transform="rotate(45 14 14)" fill="${s.c}" stroke="none"/>
      <circle cx="0" cy="150" r="4" fill="${s.c}" stroke="none"/><circle cx="150" cy="0" r="4" fill="${s.c}" stroke="none"/>
      <circle cx="14" cy="112" r="2.5" fill="${s.m}" stroke="none"/><circle cx="112" cy="14" r="2.5" fill="${s.m}" stroke="none"/></g>`;
  }
  function ornament(s, w) {
    w = w || 360;
    return `<svg class="orn" xmlns="http://www.w3.org/2000/svg" width="${w}" height="34" viewBox="0 0 360 34"><g fill="none" stroke="${s.c}" stroke-width="1.6" stroke-linecap="round">
      <path d="M0 17 H120"/><path d="M240 17 H360"/>
      <path d="M120 17 C135 2 150 2 158 12 C162 18 156 24 150 20"/><path d="M240 17 C225 2 210 2 202 12 C198 18 204 24 210 20"/>
      <path d="M120 17 C135 32 150 32 158 22"/><path d="M240 17 C225 32 210 32 202 22"/></g>
      <rect x="171" y="8" width="18" height="18" transform="rotate(45 180 17)" fill="${s.c}"/><circle cx="180" cy="17" r="3" fill="#ffffff"/>
      <circle cx="6" cy="17" r="3" fill="${s.c}"/><circle cx="354" cy="17" r="3" fill="${s.c}"/></svg>`;
  }
  const capIcon = (s) => `<svg class="cap" xmlns="http://www.w3.org/2000/svg" width="74" height="54" viewBox="0 0 74 54"><polygon points="37,2 72,17 37,32 2,17" fill="${s.c}"/><path d="M16 23 V37 C16 44 58 44 58 37 V23 L37 32 Z" fill="${s.d}"/><path d="M64 20 V38" stroke="${s.m}" stroke-width="2.4"/><circle cx="64" cy="41" r="4" fill="${s.m}"/></svg>`;
  const gearIcon = (s) => {
    let teeth = '';
    for (let i = 0; i < 8; i++) teeth += `<rect x="21" y="1" width="8" height="10" rx="1.5" fill="${s.c}" transform="rotate(${i * 45} 25 25)"/>`;
    return `<svg class="gear" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">${teeth}<circle cx="25" cy="25" r="15" fill="${s.c}"/><circle cx="25" cy="25" r="6" fill="#ffffff"/></svg>`;
  };
  const ring = (s) => `<svg class="ring" xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"><circle cx="75" cy="75" r="72" fill="none" stroke="${s.c}" stroke-width="2"/><circle cx="75" cy="75" r="66" fill="none" stroke="${s.l}" stroke-width="1" stroke-dasharray="3 4"/></svg>`;

  /* ---------------- designs ---------------- */
  const R = {};

  // 1 — PhD dissertation (existing layout: centred logo, title box, jury)
  R.phd = (P, V, s) => deco(`<rect x="0" y="0" width="794" height="10" fill="${s.c}"/><rect x="0" y="1113" width="794" height="10" fill="${s.c}"/>`)
    + body(`${P.head()}<div class="rule"></div>${P.inst()}${P.logo(1, 'lg')}
      <div class="mid">${P.work('boxed')}${P.level()}${P.people('', V.juryOn)}${P.jury()}</div>${P.year()}`);

  // 2 — graduation thesis with two logos (existing layout: logos flank the header)
  R.grad = (P, V, s) => deco(`<rect x="0" y="0" width="794" height="6" fill="${s.c}"/><rect x="0" y="1117" width="794" height="6" fill="${s.c}"/>`)
    + body(`<div class="hdr-row">${P.logo(1)}${P.head()}${P.logo(2)}</div><div class="rule"></div>${P.inst()}
      <div class="mid">${P.work('boxed')}${P.level()}${P.people('', V.juryOn)}${P.jury()}</div>${P.year()}`);

  // 3 — study project (existing layout: student and supervisor side by side)
  R.project = (P, V, s) => deco(`<rect x="0" y="0" width="794" height="8" fill="${s.c}"/>`)
    + body(`${P.head()}${P.inst()}${P.logo(1, 'lg')}
      <div class="mid">${P.work('boxed')}${P.level()}${P.people('side')}${P.jury()}</div>${P.year()}`);

  // 4 — corporate report (existing layout: logo + company, title, prepared by, footer)
  R.corporate = (P, V, s) => deco(`<rect x="0" y="1043" width="794" height="80" fill="${s.c}"/><rect x="0" y="1035" width="794" height="4" fill="${s.m}"/>
      <circle cx="700" cy="110" r="160" fill="${s.xxl}"/><circle cx="700" cy="110" r="100" fill="${s.xl}"/>`, 'flipx')
    + body(`<div class="corp-top">${P.logo(1)}<div>${P.inst()}${P.head()}</div></div>
      <div class="mid">${P.type('cat')}${P.title()}<div class="bar"></div>${P.team('prep')}${P.level()}${P.sup()}${P.jury()}</div>
      <div class="corp-foot" data-sec="year"><span>${E(V.website)}</span><span>${E([V.place, V.year].filter(Boolean).join(' · '))}</span></div>`);

  // 5 — formal academic: double rules, logo in a seal ring, centred
  R.academic = (P, V, s) => deco(`<g stroke="${s.c}"><path d="M60 46 H734" stroke-width="2.5"/><path d="M60 53 H734" stroke-width=".8"/>
      <path d="M60 1070 H734" stroke-width=".8"/><path d="M60 1077 H734" stroke-width="2.5"/></g>`)
    + body(`${P.head()}${P.inst()}<div class="seal">${ring(s)}${P.logo(1)}</div>
      <div class="mid"><div class="dbl"></div>${P.work()}<div class="dbl"></div>${P.level()}${P.people()}${P.jury()}</div>${P.year()}`);

  // 6 — prestige university: ivory page, gold filigree corners, medallion divider
  R.luxury = (P, V, s) => deco(`<rect width="794" height="1123" fill="#FBF7EE"/>${corner(26, 26, 1, 1, s)}${corner(768, 26, -1, 1, s)}${corner(26, 1097, 1, -1, s)}${corner(768, 1097, -1, -1, s)}`)
    + body(`${P.head()}${P.logo(1)}${P.inst()}<div class="mid">${ornament(s)}${P.work()}${ornament(s)}${P.level()}${P.people()}${P.jury()}</div>${P.year()}`);

  // 7 — modern geometric: triangles and circles, text aligned to the start
  R.geometric = (P, V, s) => {
    let dots = '';
    for (let i = 0; i < 7; i++) for (let j = 0; j < 5; j++) dots += `<circle cx="${50 + i * 20}" cy="${60 + j * 20}" r="3" fill="${s.l}"/>`;
    return deco(`<polygon points="794,0 794,360 434,0" fill="${s.c}"/><polygon points="794,0 794,210 584,0" fill="${s.d}"/>
      <circle cx="560" cy="250" r="78" fill="${s.l}"/><circle cx="560" cy="250" r="40" fill="#ffffff"/>
      <polygon points="0,1123 0,930 230,1123" fill="${s.xl}"/><polygon points="0,1123 0,1020 120,1123" fill="${s.c}"/>${dots}`, 'flipx')
      + body(`<div class="top">${P.logo(1)}${P.head()}${P.inst()}</div>
        <div class="mid">${P.type('tag')}${P.title()}${P.level()}</div>
        <div class="bottom">${P.people()}${P.jury()}${P.year()}</div>`, 'start');
  };

  // 8 — coloured side band: logos and year in a band on the start side
  R.sidebar = (P, V, s) => {
    let pat = '';
    for (let j = 0; j < 9; j++) pat += `<path d="M0 ${300 + j * 34} L244 ${150 + j * 34}" stroke="${s.m}" stroke-width="1" opacity=".35"/>`;
    return deco(`<rect x="0" y="0" width="244" height="1123" fill="${s.c}"/><rect x="0" y="0" width="244" height="1123" fill="${s.d}" opacity=".18"/>${pat}<rect x="244" y="0" width="8" height="1123" fill="${s.m}"/>`, 'flipx')
      + `<div class="cv-body row"><aside class="band">${P.logo(1)}${P.logo(2)}${P.type('band-type')}<div class="grow"></div>${P.year()}</aside>
        <main class="main">${P.head()}${P.inst()}<div class="mid">${P.title()}${P.level()}</div>${P.people()}${P.jury()}</main></div>`;
  };

  // 9 — gradient header: the upper part in a gradient, details below
  R.gradient = (P, V, s) => body(`<div class="g-top" style="background:linear-gradient(155deg, ${s.c} 0%, ${s.d} 100%)">
      ${svg(`<circle cx="740" cy="40" r="170" fill="#ffffff" fill-opacity=".07"/><circle cx="20" cy="330" r="110" fill="#ffffff" fill-opacity=".05"/><circle cx="760" cy="600" r="80" fill="#ffffff" fill-opacity=".06"/>`, 'g-shapes flipx')}
      ${P.head()}${P.inst()}${P.logo(1)}${P.work()}</div>
      <div class="g-low">${P.level()}${P.people()}${P.jury()}${P.year()}</div>`, 'flush');

  // 10 — elegant minimal: lots of white, one accent bar, start aligned
  R.minimal = (P, V, s) => body(`${P.head('small')}<div class="top">${P.logo(1)}${P.inst()}</div>
      <div class="mid"><div class="bar"></div>${P.type()}${P.title()}${P.level()}</div>
      <div class="bottom">${P.people()}${P.jury()}${P.year()}</div>`, 'start');

  // 11 — technical engineering: blueprint grid, circuit traces, bracketed title
  R.tech = (P, V, s) => {
    let g = '';
    for (let x = 0; x <= 794; x += 28) g += `<path d="M${x} 0 V1123" stroke="${x % 140 === 0 ? s.l : s.xl}" stroke-width="1"/>`;
    for (let y = 0; y <= 1123; y += 28) g += `<path d="M0 ${y} H794" stroke="${y % 140 === 0 ? s.l : s.xl}" stroke-width="1"/>`;
    const trace = `<g fill="none" stroke="${s.m}" stroke-width="2.4"><path d="M794 140 H660 L620 180 V260"/><path d="M794 196 H700 L680 216 V300"/><path d="M0 980 H120 L160 940 V860"/><path d="M0 1036 H90 L110 1016 V930"/></g>
      <g fill="${s.c}"><circle cx="620" cy="264" r="6"/><circle cx="680" cy="304" r="6"/><circle cx="160" cy="856" r="6"/><circle cx="110" cy="926" r="6"/></g>`;
    return deco(`<rect width="794" height="1123" fill="#ffffff"/>${g}${trace}`, 'flipx')
      + body(`${P.head()}${P.inst()}${P.logo(1)}<div class="mid">${P.type('tag')}<div class="bracket">${P.title()}</div></div>
        <div class="spec-grid">${P.level()}${P.people()}</div>${P.jury()}${P.year()}`);
  };

  // 12 — scientific: honeycomb molecule network
  R.science = (P, V, s) => {
    const r = 34, w = r * Math.sqrt(3);
    const mol = (ox, oy) => {
      const cs = [[0, 0], [w, 0], [w / 2, r * 1.5], [w * 1.5, r * 1.5], [w, r * 3]];
      return cs.map(([x, y], i) => hex(ox + x, oy + y, r, `fill="${i % 2 ? s.xl : 'none'}" stroke="${s.c}" stroke-width="2.6"`)).join('')
        + cs.map(([x, y]) => `<circle cx="${(ox + x).toFixed(1)}" cy="${(oy + y - r).toFixed(1)}" r="5" fill="${s.c}"/>`).join('');
    };
    return deco(`${mol(650, 40)}<path d="M610 300 L570 350" stroke="${s.m}" stroke-width="2.4"/><circle cx="566" cy="356" r="9" fill="${s.m}"/>
      ${mol(-20, 1010)}<path d="M150 1040 L200 1006" stroke="${s.m}" stroke-width="2.4"/><circle cx="206" cy="1002" r="9" fill="${s.m}"/>`, 'flipx')
      + body(`${P.head()}${P.inst()}${P.logo(1)}<div class="mid">${P.type()}${P.title('pill')}${P.level()}</div>${P.people()}${P.jury()}${P.year()}`);
  };

  // 13 — literary: classic centred page with ornamental dividers
  R.literary = (P, V, s) => deco(`<rect width="794" height="1123" fill="#FFFDF9"/><rect x="0" y="0" width="794" height="4" fill="${s.c}"/><rect x="0" y="1119" width="794" height="4" fill="${s.c}"/>`)
    + body(`${P.head()}${P.inst()}${P.logo(1)}<div class="mid">${P.type()}${ornament(s)}${P.title()}${ornament(s)}${P.level()}</div>${P.people()}${P.jury()}${P.year()}`);

  // 14 — colourful primary school: confetti, stars, pencils, rounded cards
  R.kids = (P, V, s) => {
    const cols = [s.c, '#3B82F6', '#10B981', '#EC4899', '#8B5CF6', '#FACC15'];
    const dots = [[60, 70, 14], [150, 40, 9], [720, 60, 12], [680, 150, 8], [40, 400, 10], [750, 420, 11], [30, 700, 9], [760, 760, 13], [120, 1080, 10], [700, 1090, 9], [400, 30, 7], [260, 1100, 8]]
      .map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${cols[i % cols.length]}"/>`).join('');
    const stars = [[230, 90, 16], [580, 110, 13], [90, 560, 14], [720, 600, 15], [520, 1060, 14]].map(([x, y, r], i) => star5(x, y, r, cols[(i + 2) % cols.length])).join('');
    const pencil = (x, y, rot, col) => `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="0" y="0" width="120" height="22" rx="3" fill="${col}"/><rect x="0" y="0" width="16" height="22" fill="#F9A8D4"/><rect x="16" y="0" width="6" height="22" fill="#CBD5E1"/><polygon points="120,0 146,11 120,22" fill="#FDE6C4"/><polygon points="138,7 146,11 138,15" fill="#334155"/></g>`;
    const rainbow = `<g fill="none" stroke-width="12"><path d="M-40 260 A190 190 0 0 1 300 60" stroke="#EF4444" opacity=".85"/><path d="M-40 280 A170 170 0 0 1 280 80" stroke="#FACC15" opacity=".85"/><path d="M-40 300 A150 150 0 0 1 260 100" stroke="#10B981" opacity=".85"/></g>`;
    return deco(`<rect width="794" height="1123" fill="#FFFBF2"/>${rainbow}${dots}${stars}${pencil(560, 980, -18, '#3B82F6')}${pencil(600, 1020, -18, s.c)}`, 'flipx')
      + body(`<div class="k-banner" style="background:${s.c}">${P.head()}</div>${P.inst()}${P.logo(1)}
        <div class="k-card" style="border-color:${s.c}">${P.type()}${P.title()}</div>${P.level()}
        <div class="k-people">${P.people()}</div>${P.year()}`);
  };

  // 15 — graduation thesis: coloured top band with two logos, cap icon, jury
  R.thesis = (P, V, s) => body(`<div class="t-band" style="background:${s.c}"><div class="hdr-row">${P.logo(1)}<div>${P.head()}${P.inst()}</div>${P.logo(2)}</div></div>
      <div class="mid">${capIcon(s)}${P.work('ruled')}${P.level()}${P.people('', V.juryOn)}${P.jury()}</div>${P.year()}
      <div class="t-foot" style="background:${s.c}"></div>`, 'flush');

  // 16 — internship report: two logos, ribbon, host organisation card
  R.internship = (P, V, s) => deco(`<rect x="0" y="0" width="14" height="1123" fill="${s.c}"/><rect x="14" y="0" width="5" height="1123" fill="${s.l}"/>`, 'flipx')
    + body(`<div class="hdr-row">${P.logo(1)}<div>${P.head()}${P.inst()}</div>${P.logo(2)}</div>
      <div class="ribbon" style="background:${s.c}" data-sec="work"><span>${E(V.workType || P._L.l_internship)}</span></div>
      ${V.host ? `<div class="host-card" style="border-color:${s.l}" data-sec="inst">${gearIcon(s)}<div><p class="t-lbl">${E(P._L.l_host)}</p><p class="t-host-name">${E(V.host)}</p></div></div>` : ''}
      <div class="mid">${P.title()}${P.level()}</div>${P.people()}${P.jury()}${P.year()}`);

  // 17 — Islamic patterns: bands of eight-point stars and a pointed arch
  R.islamic = (P, V, s) => {
    const gold = '#C9A227';
    const band = (y) => {
      let b = '';
      for (let x = 0; x <= 794 + 66; x += 66) b += star8(x, y, 24, `fill="none" stroke="${gold}" stroke-width="1.6"`) + `<circle cx="${x}" cy="${y}" r="5" fill="${gold}"/>` + star8(x + 33, y, 10, `fill="${s.l}" stroke="none"`);
      return b;
    };
    return deco(`<rect width="794" height="1123" fill="#FFFDF7"/><rect x="0" y="0" width="794" height="96" fill="${s.c}"/>${band(48)}<rect x="0" y="96" width="794" height="4" fill="${gold}"/>
      <rect x="0" y="1027" width="794" height="96" fill="${s.c}"/>${band(1075)}<rect x="0" y="1023" width="794" height="4" fill="${gold}"/>
      <path d="M150 960 V480 Q150 400 260 360 L397 300 L534 360 Q644 400 644 480 V960" fill="none" stroke="${gold}" stroke-width="2.4"/>
      <path d="M162 960 V484 Q162 410 266 372 L397 314 L528 372 Q632 410 632 484 V960" fill="none" stroke="${s.c}" stroke-width="1"/>
      ${star8(397, 300, 14, `fill="${gold}" stroke="none"`)}<circle cx="397" cy="300" r="4" fill="#FFFDF7"/>`)
      + body(`${P.head()}${P.inst()}<div class="mid">${P.logo(1)}${P.work()}${P.level()}${P.people()}${P.jury()}</div>${P.year()}`);
  };

  // 18 — soft waves at the top and bottom
  R.waves = (P, V, s) => deco(`<path d="M0 0 H794 V120 C640 190 470 60 300 110 C190 140 90 150 0 120 Z" fill="${s.xl}"/>
      <path d="M0 0 H794 V80 C620 150 460 30 290 80 C180 112 80 112 0 84 Z" fill="${s.l}"/>
      <path d="M0 0 H794 V44 C610 100 450 10 280 46 C170 70 80 70 0 50 Z" fill="${s.c}"/>
      <path d="M0 1123 H794 V1000 C650 950 500 1060 330 1010 C210 975 100 970 0 1000 Z" fill="${s.xl}"/>
      <path d="M0 1123 H794 V1040 C640 1000 480 1090 320 1050 C200 1022 90 1020 0 1046 Z" fill="${s.l}"/>
      <path d="M0 1123 H794 V1080 C630 1050 470 1110 310 1084 C190 1066 80 1064 0 1084 Z" fill="${s.c}"/>`, 'flipx')
    + body(`${P.head()}${P.inst()}${P.logo(1)}<div class="mid">${P.work()}${P.level()}</div>${P.people()}${P.jury()}${P.year()}`);

  // 19 — dark prestige: deep background, gold lines and diamond motif
  R.dark = (P, V, s) => deco(`<rect width="794" height="1123" fill="#0E1726"/>
      <g stroke="${s.c}" fill="none"><rect x="30" y="30" width="734" height="1063" stroke-width=".8" opacity=".0"/>
      <path d="M60 60 H734" stroke-width="1.2"/><path d="M60 1063 H734" stroke-width="1.2"/>
      <path d="M397 330 L427 360 L397 390 L367 360 Z" stroke-width="1.6"/><path d="M397 342 L415 360 L397 378 L379 360 Z" fill="${s.c}" stroke="none"/>
      <path d="M140 360 H350" stroke-width="1"/><path d="M444 360 H654" stroke-width="1"/></g>
      ${[60, 734].map((x) => `<rect x="${x - 5}" y="55" width="10" height="10" transform="rotate(45 ${x} 60)" fill="${s.c}"/><rect x="${x - 5}" y="1058" width="10" height="10" transform="rotate(45 ${x} 1063)" fill="${s.c}"/>`).join('')}`)
    + body(`${P.head()}${P.logo(1)}${P.inst()}<div class="mid">${P.work()}${P.level()}</div>${P.people()}${P.jury()}${P.year()}`);

  /* ---------------- render ---------------- */
  // X: { design, color, L (labels), logo1, logo2 }
  function render(V, X) {
    const s = shades(X.color);
    const P = parts(V, X);
    P._L = X.L;
    return (R[X.design.id] || R.phd)(P, V, s);
  }

  window.COVER_DESIGNS = DESIGNS;
  window.COVER_FONTS = FONTS;
  window.COVER_PALETTE = PALETTE;
  window.COVER_RENDER = render;
  window.COVER_SHADES = shades;
  window.COVER_DEFAULT_LOGO = defaultLogo;
})();
