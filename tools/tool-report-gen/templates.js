// ============================================================
// templates.js — 12 report designs (cover, page header/footer, decorations)
// Every SVG uses literal colors so html2canvas / PDF render them exactly.
// The matching page styles live in report.css (.T-<id>).
// ============================================================

const REPORT_FONTS = [
  { id: "cairo", name: "Cairo", head: "'Cairo', sans-serif", body: "'Cairo', sans-serif" },
  { id: "tajawal", name: "Tajawal", head: "'Tajawal', sans-serif", body: "'Tajawal', sans-serif" },
  { id: "almarai", name: "Almarai", head: "'Almarai', sans-serif", body: "'Almarai', sans-serif" },
  { id: "plex", name: "IBM Plex Sans Arabic", head: "'IBM Plex Sans Arabic', sans-serif", body: "'IBM Plex Sans Arabic', sans-serif" },
  { id: "readex", name: "Readex Pro", head: "'Readex Pro', sans-serif", body: "'Readex Pro', sans-serif" },
  { id: "messiri", name: "El Messiri + Tajawal", head: "'El Messiri', 'Tajawal', sans-serif", body: "'Tajawal', sans-serif" },
  { id: "amiri", name: "Amiri", head: "'Amiri', serif", body: "'Amiri', serif" },
  { id: "naskh", name: "Noto Naskh Arabic", head: "'Noto Naskh Arabic', serif", body: "'Noto Naskh Arabic', serif" },
  { id: "montserrat", name: "Montserrat + Cairo", head: "'Montserrat', 'Cairo', sans-serif", body: "'Cairo', sans-serif" },
  { id: "playfair", name: "Playfair + Amiri", head: "'Playfair Display', 'Amiri', serif", body: "'Merriweather', 'Amiri', serif" },
  { id: "slab", name: "Roboto Slab + Cairo", head: "'Roboto Slab', 'Cairo', serif", body: "'IBM Plex Sans Arabic', sans-serif" },
];
const REPORT_FONT = Object.fromEntries(REPORT_FONTS.map((f) => [f.id, f]));

/* ---------- small helpers ---------- */

function rgEsc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function rgMix(hex, other, weight) {
  const p = (h) => { h = String(h || "#000").replace("#", ""); if (h.length === 3) h = h.split("").map((c) => c + c).join(""); return [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16) || 0); };
  const a = p(hex), b = p(other);
  return "#" + a.map((v, i) => Math.round(v * weight + b[i] * (1 - weight)).toString(16).padStart(2, "0")).join("");
}
function rgPalette(ac) {
  return {
    ac,
    soft: rgMix(ac, "#ffffff", 0.1),
    soft2: rgMix(ac, "#ffffff", 0.22),
    mid: rgMix(ac, "#ffffff", 0.55),
    dark: rgMix(ac, "#000000", 0.62),
    deep: rgMix(ac, "#000000", 0.4),
  };
}

// logo: either the uploaded image or a neutral placeholder with the organization initials
function rgLogo(c, cls) {
  if (c.logo) return `<div class="cv-logo ${cls || ""}"><img src="${c.logo}" alt=""></div>`;
  // neutral placeholder: a small building mark in the accent color
  const col = c.P.ac;
  return `<div class="cv-logo cv-logo-ph ${cls || ""}"><svg viewBox="0 0 48 48" width="44" height="44"><rect x="10" y="8" width="18" height="32" rx="2" fill="none" stroke="${col}" stroke-width="3"/><rect x="28" y="18" width="12" height="22" rx="2" fill="none" stroke="${col}" stroke-width="3"/><path d="M15 15h8M15 22h8M15 29h8M33 25h3M33 31h3" stroke="${col}" stroke-width="3" stroke-linecap="round"/><path d="M6 40h36" stroke="${col}" stroke-width="3" stroke-linecap="round"/></svg></div>`;
}
function rgMeta(c, cls) {
  const rows = [];
  if (c.by) rows.push([c.L.preparedBy, c.by]);
  if (c.for) rows.push([c.L.preparedFor, c.for]);
  if (c.date) rows.push([c.L.reportDate, c.date]);
  if (c.ref) rows.push([c.L.reference, c.ref]);
  return `<div class="cv-meta ${cls || ""}">${rows.map((r) => `<div class="cv-row"><span class="cv-k">${rgEsc(r[0])}</span><span class="cv-v">${rgEsc(r[1])}</span></div>`).join("")}</div>`;
}
const rgTitle = (c, cls) => `<h1 class="cv-title ${cls || ""}">${rgEsc(c.title)}</h1>`;
const rgOrg = (c, cls) => (c.org ? `<div class="cv-org ${cls || ""}">${rgEsc(c.org)}</div>` : "");
const rgNum = `<span class="pn-cur"></span><span class="pn-sep"> / </span><span class="pn-tot"></span>`;

/* ---------- the 12 templates ---------- */

const REPORT_TEMPLATES = [
  /* 1 — Classic corporate */
  {
    id: "corporate", cat: "corporate", color: "#1F3A5F", font: "montserrat",
    cover(c) {
      const P = c.P;
      const lines = Array.from({ length: 16 }, (_, i) => `<line x1="${i * 60 - 200}" y1="0" x2="${i * 60 + 200}" y2="470" stroke="#ffffff" stroke-opacity="0.07" stroke-width="18"/>`).join("");
      return `
        <div class="cv-band"><svg class="cv-svg" viewBox="0 0 794 470" preserveAspectRatio="none" width="794" height="470"><rect width="794" height="470" fill="${P.ac}"/>${lines}<rect y="462" width="794" height="8" fill="${P.dark}"/></svg></div>
        ${rgLogo(c, "on-band")}
        <div class="cv-band-text">${rgOrg(c)}${rgTitle(c)}</div>
        <div class="cv-lower">${rgMeta(c)}</div>
        <div class="cv-year"><span>${rgEsc(c.year)}</span></div>`;
    },
    head: (c) => `<div class="ph-org">${rgEsc(c.org)}</div><div class="ph-title">${rgEsc(c.title)}</div>`,
    foot: (c) => `<div class="pf-bar"></div><div class="pf-ref">${rgEsc(c.ref)}</div><div class="pf-num">${rgNum}</div>`,
  },

  /* 2 — Modern geometric */
  {
    id: "geometric", cat: "creative", color: "#6D28D9", font: "readex",
    cover(c) {
      const P = c.P, A = "#F59E0B";
      return `
        <svg class="cv-geo flip" viewBox="0 0 520 520" width="520" height="520">
          <polygon points="520,0 520,300 250,0" fill="${P.ac}"/>
          <polygon points="520,300 520,520 330,410" fill="${P.dark}"/>
          <polygon points="250,0 400,150 120,150" fill="${P.mid}"/>
          <polygon points="400,150 520,300 330,410 250,240" fill="${P.soft2}"/>
          <polygon points="120,150 250,240 140,320" fill="${A}"/>
          <polygon points="330,410 400,520 260,520" fill="${P.ac}" fill-opacity="0.55"/>
          <circle cx="90" cy="60" r="18" fill="${A}"/>
        </svg>
        <svg class="cv-geo2 flip" viewBox="0 0 260 260" width="260" height="260">
          <polygon points="0,260 0,60 200,260" fill="${P.soft2}"/>
          <polygon points="0,260 0,160 100,260" fill="${P.ac}"/>
        </svg>
        ${rgLogo(c)}
        <div class="cv-main"><div class="cv-bar"></div>${rgOrg(c)}${rgTitle(c)}</div>
        ${rgMeta(c, "grid2")}`;
    },
    head: (c) => `<svg class="ph-geo flip" viewBox="0 0 120 60" width="120" height="60"><polygon points="120,0 120,60 50,0" fill="${c.P.ac}"/><polygon points="50,0 90,30 20,30" fill="${c.P.mid}"/></svg><div class="ph-title">${rgEsc(c.title)}</div>`,
    foot: (c) => `<div class="pf-org">${rgEsc(c.org)}</div><div class="pf-num"><span class="pf-tri"></span>${rgNum}</div>`,
  },

  /* 3 — Engineering / technical blueprint */
  {
    id: "technical", cat: "technical", color: "#0E5A8A", font: "plex",
    cover(c) {
      const P = c.P;
      let grid = "";
      for (let x = 0; x <= 794; x += 22) grid += `<line x1="${x}" y1="0" x2="${x}" y2="1123" stroke="#ffffff" stroke-opacity="${x % 110 === 0 ? 0.22 : 0.08}" stroke-width="1"/>`;
      for (let y = 0; y <= 1123; y += 22) grid += `<line x1="0" y1="${y}" x2="794" y2="${y}" stroke="#ffffff" stroke-opacity="${y % 110 === 0 ? 0.22 : 0.08}" stroke-width="1"/>`;
      const bg = rgMix(P.ac, "#06121c", 0.55);
      return `
        <svg class="cv-full flip" viewBox="0 0 794 1123" width="794" height="1123"><rect width="794" height="1123" fill="${bg}"/>${grid}
          <circle cx="600" cy="300" r="150" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="1.5"/>
          <circle cx="600" cy="300" r="95" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="1" stroke-dasharray="6 5"/>
          <line x1="430" y1="300" x2="770" y2="300" stroke="#ffffff" stroke-opacity="0.35"/><line x1="600" y1="130" x2="600" y2="470" stroke="#ffffff" stroke-opacity="0.35"/>
          <rect x="36" y="36" width="722" height="1051" fill="none" stroke="#ffffff" stroke-opacity="0.6" stroke-width="2"/>
        </svg>
        ${rgLogo(c, "on-dark")}
        <div class="cv-main">${rgOrg(c)}${rgTitle(c)}</div>
        <div class="cv-cartouche">
          <div class="ct-cell ct-wide"><span>${rgEsc(c.L.reportTitle)}</span><b>${rgEsc(c.title)}</b></div>
          <div class="ct-cell"><span>${rgEsc(c.L.preparedBy)}</span><b>${rgEsc(c.by || "—")}</b></div>
          <div class="ct-cell"><span>${rgEsc(c.L.preparedFor)}</span><b>${rgEsc(c.for || "—")}</b></div>
          <div class="ct-cell"><span>${rgEsc(c.L.reportDate)}</span><b>${rgEsc(c.date || "—")}</b></div>
          <div class="ct-cell"><span>${rgEsc(c.L.reference)}</span><b>${rgEsc(c.ref || "—")}</b></div>
        </div>`;
    },
    head: (c) => `<div class="ph-ref">${rgEsc(c.ref)}</div><div class="ph-title">${rgEsc(c.title)}</div>`,
    foot: (c) => `<div class="pf-box"><span>${rgEsc(c.org)}</span></div><div class="pf-box pf-num"><span>${rgEsc(c.L.page)}</span> ${rgNum}</div>`,
  },

  /* 4 — Industrial */
  {
    id: "industrial", cat: "technical", color: "#F2A900", font: "slab",
    cover(c) {
      const P = c.P, K = "#23272E";
      let stripes = "";
      for (let x = -60; x < 860; x += 44) stripes += `<polygon points="${x},0 ${x + 22},0 ${x + 62},40 ${x + 40},40" fill="${K}"/>`;
      const gear = (cx, cy, r, n) => {
        let d = "";
        for (let i = 0; i < n; i++) {
          const a0 = (i / n) * Math.PI * 2, a1 = a0 + Math.PI / n * 0.9, a2 = a0 + Math.PI / n * 1.1, a3 = a0 + (2 * Math.PI) / n;
          const R = r + 22;
          d += `${i ? "L" : "M"}${cx + r * Math.cos(a0)},${cy + r * Math.sin(a0)} L${cx + R * Math.cos(a0 + 0.08)},${cy + R * Math.sin(a0 + 0.08)} L${cx + R * Math.cos(a1)},${cy + R * Math.sin(a1)} L${cx + r * Math.cos(a1 + 0.08)},${cy + r * Math.sin(a1 + 0.08)} L${cx + r * Math.cos(a2)},${cy + r * Math.sin(a2)} L${cx + r * Math.cos(a3)},${cy + r * Math.sin(a3)} `;
        }
        return `<path d="${d}Z" fill="none" stroke="${P.ac}" stroke-opacity="0.55" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="${r * 0.42}" fill="none" stroke="${P.ac}" stroke-opacity="0.55" stroke-width="3"/>`;
      };
      return `
        <svg class="cv-full flip" viewBox="0 0 794 1123" width="794" height="1123">
          <rect width="794" height="700" fill="${K}"/>
          ${gear(640, 170, 120, 12)}${gear(470, 330, 62, 9)}
          <rect y="700" width="794" height="423" fill="#ffffff"/>
          <g transform="translate(0,660)"><rect width="794" height="40" fill="${P.ac}"/>${stripes}</g>
          <rect x="0" y="1103" width="794" height="20" fill="${K}"/>
        </svg>
        ${rgLogo(c, "on-dark")}
        <div class="cv-main">${rgOrg(c)}${rgTitle(c)}<div class="cv-rule"></div></div>
        ${rgMeta(c)}`;
    },
    head: (c) => `<div class="ph-block"></div><div class="ph-org">${rgEsc(c.org)}</div><div class="ph-title">${rgEsc(c.title)}</div>`,
    foot: (c) => {
      let s = "";
      for (let x = -20; x < 180; x += 20) s += `<polygon points="${x},0 ${x + 10},0 ${x + 24},14 ${x + 14},14" fill="#23272E"/>`;
      return `<svg class="pf-stripes flip" viewBox="0 0 160 14" width="160" height="14"><rect width="160" height="14" fill="${c.P.ac}"/>${s}</svg><div class="pf-ref">${rgEsc(c.ref)}</div><div class="pf-num">${rgNum}</div>`;
    },
  },

  /* 5 — Academic */
  {
    id: "academic", cat: "academic", color: "#7A1F2B", font: "playfair",
    cover(c) {
      const P = c.P;
      const orn = `<svg class="cv-orn" viewBox="0 0 300 24" width="300" height="24"><line x1="0" y1="12" x2="128" y2="12" stroke="${P.ac}" stroke-width="1.2"/><line x1="172" y1="12" x2="300" y2="12" stroke="${P.ac}" stroke-width="1.2"/><polygon points="150,2 160,12 150,22 140,12" fill="${P.ac}"/><circle cx="134" cy="12" r="2.5" fill="${P.ac}"/><circle cx="166" cy="12" r="2.5" fill="${P.ac}"/></svg>`;
      return `
        <div class="cv-frame"></div>
        ${rgLogo(c, "center")}
        ${rgOrg(c, "caps")}
        <div class="cv-dbl"></div>
        ${rgTitle(c)}
        ${orn}
        <div class="cv-authors">${c.by ? `<div><i>${rgEsc(c.L.preparedBy)}</i><b>${rgEsc(c.by)}</b></div>` : ""}${c.for ? `<div><i>${rgEsc(c.L.preparedFor)}</i><b>${rgEsc(c.for)}</b></div>` : ""}</div>
        <div class="cv-foot">${rgEsc(c.date)}${c.ref ? ` · ${rgEsc(c.ref)}` : ""}</div>`;
    },
    head: (c) => `<div class="ph-title">${rgEsc(c.title)}</div>`,
    foot: () => `<div class="pf-num">— ${rgNum} —</div>`,
  },

  /* 6 — Financial */
  {
    id: "finance", cat: "finance", color: "#0F5B4A", font: "almarai",
    cover(c) {
      const P = c.P, G = "#C9A227";
      const bars = [120, 170, 150, 230, 210, 290, 340].map((h, i) => `<rect x="${40 + i * 70}" y="${380 - h}" width="42" height="${h}" rx="4" fill="${i === 6 ? G : P.ac}" fill-opacity="${i === 6 ? 1 : 0.18 + i * 0.1}"/>`).join("");
      return `
        <svg class="cv-chart flip" viewBox="0 0 540 400" width="540" height="400">${bars}
          <polyline points="61,250 131,215 201,228 271,160 341,172 411,110 481,62" fill="none" stroke="${G}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
          <circle cx="481" cy="62" r="9" fill="#ffffff" stroke="${G}" stroke-width="4"/>
          <line x1="20" y1="382" x2="530" y2="382" stroke="${P.ac}" stroke-opacity="0.4" stroke-width="2"/>
        </svg>
        ${rgLogo(c)}
        <div class="cv-main">${rgOrg(c)}${rgTitle(c)}<div class="cv-gold"></div></div>
        <div class="cv-block"><svg class="cv-svg" viewBox="0 0 794 330" width="794" height="330" preserveAspectRatio="none"><rect width="794" height="330" fill="${P.dark}"/><rect width="794" height="6" fill="${G}"/></svg>${rgMeta(c, "light")}</div>`;
    },
    head: (c) => `<div class="ph-org">${rgEsc(c.org)}</div><div class="ph-title">${rgEsc(c.title)}</div>`,
    foot: (c) => `<div class="pf-ref">${rgEsc(c.ref)}</div><div class="pf-num"><span class="pf-circle">${rgNum}</span></div>`,
  },

  /* 7 — Green energy */
  {
    id: "energy", cat: "technical", color: "#2E9E48", font: "tajawal",
    cover(c) {
      const P = c.P, S = "#F4B400";
      const turbine = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})"><polygon points="-4,0 4,0 2,-150 -2,-150" fill="#ffffff"/><circle cx="0" cy="-150" r="6" fill="#ffffff"/><polygon points="0,-150 -4,-150 -8,-240 0,-236" fill="#ffffff"/><polygon points="0,-150 3,-146 80,-110 76,-104" fill="#ffffff"/><polygon points="0,-150 -3,-146 -74,-100 -70,-94" fill="#ffffff"/></g>`;
      return `
        <svg class="cv-full flip" viewBox="0 0 794 1123" width="794" height="1123">
          <rect width="794" height="1123" fill="#F4FAF5"/>
          <circle cx="640" cy="210" r="96" fill="${S}"/>
          <circle cx="640" cy="210" r="130" fill="${S}" fill-opacity="0.15"/>
          <path d="M0,760 C180,690 330,720 470,760 C610,800 700,760 794,720 L794,1123 L0,1123 Z" fill="${P.mid}"/>
          ${turbine(560, 760, 1)}${turbine(690, 745, 0.75)}
          <path d="M0,850 C200,790 380,850 540,870 C660,885 740,850 794,830 L794,1123 L0,1123 Z" fill="${P.ac}"/>
          <path d="M0,960 C220,910 420,980 794,930 L794,1123 L0,1123 Z" fill="${P.dark}"/>
        </svg>
        ${rgLogo(c)}
        <div class="cv-main">${rgOrg(c)}${rgTitle(c)}</div>
        ${rgMeta(c, "light")}`;
    },
    head: (c) => `<svg class="ph-leaf" viewBox="0 0 24 24" width="22" height="22"><path d="M4 20C4 10 10 4 20 4c0 10-6 16-16 16z" fill="${c.P.ac}"/><path d="M4 20L14 10" stroke="#ffffff" stroke-width="1.5"/></svg><div class="ph-org">${rgEsc(c.org)}</div><div class="ph-title">${rgEsc(c.title)}</div>`,
    foot: (c) => `<svg class="pf-wave" viewBox="0 0 794 40" width="794" height="40" preserveAspectRatio="none"><path d="M0,22 C200,4 400,36 794,12 L794,40 L0,40 Z" fill="${c.P.soft2}"/><path d="M0,30 C250,16 500,40 794,24 L794,40 L0,40 Z" fill="${c.P.ac}"/></svg><div class="pf-num">${rgNum}</div>`,
  },

  /* 8 — Elegant minimal */
  {
    id: "minimal", cat: "minimal", color: "#1F2937", font: "plex",
    cover(c) {
      return `
        <div class="cv-dot"></div>
        ${rgOrg(c)}
        ${rgTitle(c)}
        <div class="cv-hair"></div>
        ${rgMeta(c)}
        ${rgLogo(c)}`;
    },
    head: (c) => `<div class="ph-title">${rgEsc(c.title)}</div>`,
    foot: () => `<div class="pf-num">${rgNum}</div>`,
  },

  /* 9 — Official administrative */
  {
    id: "official", cat: "corporate", color: "#1E3A8A", font: "naskh",
    cover(c) {
      return `
        <div class="cv-border"></div>
        <div class="cv-top">${rgLogo(c, "center")}${rgOrg(c)}<div class="cv-dline"></div>
          <div class="cv-refline"><span>${rgEsc(c.L.reference)}: ${rgEsc(c.ref || "—")}</span><span>${rgEsc(c.L.reportDate)}: ${rgEsc(c.date || "—")}</span></div></div>
        <div class="cv-titlebox">${rgTitle(c)}</div>
        <div class="cv-authors">${c.by ? `<div><span>${rgEsc(c.L.preparedBy)}:</span> <b>${rgEsc(c.by)}</b></div>` : ""}${c.for ? `<div><span>${rgEsc(c.L.preparedFor)}:</span> <b>${rgEsc(c.for)}</b></div>` : ""}</div>
        <svg class="cv-seal" viewBox="0 0 120 120" width="120" height="120"><circle cx="60" cy="60" r="56" fill="none" stroke="${c.P.ac}" stroke-width="2"/><circle cx="60" cy="60" r="46" fill="none" stroke="${c.P.ac}" stroke-width="1" stroke-dasharray="3 4"/><polygon points="60,30 67,52 90,52 71,65 78,88 60,74 42,88 49,65 30,52 53,52" fill="${c.P.ac}" fill-opacity="0.85"/></svg>`;
    },
    head: (c) => `<div class="ph-org">${rgEsc(c.org)}</div>`,
    foot: (c) => `<div class="pf-num"><span>${rgEsc(c.L.page)}</span> ${rgNum}</div>`,
  },

  /* 10 — Dark luxury */
  {
    id: "luxury", cat: "creative", color: "#C8A24A", font: "messiri",
    cover(c) {
      const G = c.P.ac, D = "#121418";
      const corner = (tr) => `<g transform="${tr}"><path d="M0,90 L0,0 L90,0" fill="none" stroke="${G}" stroke-width="2"/><path d="M14,90 L14,14 L90,14" fill="none" stroke="${G}" stroke-width="1"/><polygon points="14,14 26,20 20,26" fill="${G}"/><circle cx="0" cy="0" r="5" fill="${G}"/></g>`;
      return `
        <svg class="cv-full" viewBox="0 0 794 1123" width="794" height="1123"><rect width="794" height="1123" fill="${D}"/>
          <rect x="46" y="46" width="702" height="1031" fill="none" stroke="${G}" stroke-opacity="0.5" stroke-width="1"/>
          ${corner("translate(40,40)")}${corner("translate(754,40) scale(-1,1)")}${corner("translate(40,1083) scale(1,-1)")}${corner("translate(754,1083) scale(-1,-1)")}
          <g transform="translate(397,700)">${[0, 1, 2].map((i) => `<polygon points="0,${-10 - i * 0} 10,0 0,10 -10,0" transform="translate(${(i - 1) * 34},0)" fill="${G}" fill-opacity="${i === 1 ? 1 : 0.6}"/>`).join("")}
            <line x1="-200" y1="0" x2="-60" y2="0" stroke="${G}" stroke-width="1"/><line x1="60" y1="0" x2="200" y2="0" stroke="${G}" stroke-width="1"/></g>
        </svg>
        ${rgLogo(c, "center on-dark")}
        ${rgOrg(c, "caps")}
        ${rgTitle(c)}
        ${rgMeta(c, "center")}`;
    },
    head: (c) => `<div class="ph-org">${rgEsc(c.org)}</div><div class="ph-title">${rgEsc(c.title)}</div>`,
    foot: (c) => `<svg class="pf-orn" viewBox="0 0 120 12" width="120" height="12"><line x1="0" y1="6" x2="48" y2="6" stroke="${c.P.ac}"/><line x1="72" y1="6" x2="120" y2="6" stroke="${c.P.ac}"/><polygon points="60,0 66,6 60,12 54,6" fill="${c.P.ac}"/></svg><div class="pf-num">${rgNum}</div>`,
  },

  /* 11 — Colored sidebar */
  {
    id: "sidebar", cat: "creative", color: "#E4572E", font: "cairo",
    cover(c) {
      const P = c.P;
      return `
        <div class="cv-side"><svg class="cv-svg" viewBox="0 0 300 1123" width="300" height="1123" preserveAspectRatio="none"><rect width="300" height="1123" fill="${P.ac}"/><circle cx="300" cy="960" r="170" fill="${P.dark}" fill-opacity="0.35"/><circle cx="40" cy="1080" r="90" fill="#ffffff" fill-opacity="0.12"/></svg>
          ${rgLogo(c, "on-side")}${rgMeta(c, "light")}</div>
        <svg class="cv-circles flip" viewBox="0 0 300 300" width="300" height="300"><circle cx="220" cy="80" r="80" fill="${P.soft2}"/><circle cx="120" cy="130" r="40" fill="${P.ac}" fill-opacity="0.8"/><circle cx="250" cy="220" r="24" fill="${P.dark}"/></svg>
        <div class="cv-main">${rgOrg(c)}${rgTitle(c)}<div class="cv-bar"></div></div>`;
    },
    head: (c) => `<div class="ph-title">${rgEsc(c.title)}</div><div class="ph-org">${rgEsc(c.org)}</div>`,
    foot: (c) => `<div class="pf-ref">${rgEsc(c.ref)}</div><div class="pf-num">${rgNum}</div>`,
  },

  /* 12 — Full photo cover */
  {
    id: "photo", cat: "creative", color: "#0B4F6C", font: "montserrat",
    cover(c) {
      const P = c.P;
      const bg = c.coverImg
        ? `<div class="cv-photo" style="background-image:url('${c.coverImg}')"></div>`
        : `<svg class="cv-full" viewBox="0 0 794 1123" width="794" height="1123" preserveAspectRatio="none">
            <rect width="794" height="1123" fill="${P.deep}"/>
            <circle cx="560" cy="330" r="120" fill="${P.mid}" fill-opacity="0.5"/>
            <path d="M0,700 L180,470 L330,640 L470,430 L794,760 L794,1123 L0,1123 Z" fill="${P.ac}"/>
            <path d="M0,820 L220,610 L420,800 L600,640 L794,840 L794,1123 L0,1123 Z" fill="${P.dark}"/>
          </svg>`;
      return `${bg}
        <div class="cv-shade"></div>
        ${rgLogo(c, "on-photo")}
        <div class="cv-main">${rgOrg(c)}${rgTitle(c)}<div class="cv-bar"></div>${rgMeta(c, "light inline")}</div>`;
    },
    head: (c) => `<div class="ph-band"></div><div class="ph-org">${rgEsc(c.org)}</div><div class="ph-title">${rgEsc(c.title)}</div>`,
    foot: (c) => `<div class="pf-ref">${rgEsc(c.ref)}</div><div class="pf-num">${rgNum}</div>`,
  },
];
const REPORT_TPL = Object.fromEntries(REPORT_TEMPLATES.map((x) => [x.id, x]));
