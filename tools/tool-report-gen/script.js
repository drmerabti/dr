// ============================================================
// script.js — Professional Report Generator
// Shell (topbar, right-hand panel, accordion, gallery, "My reports",
// login, toasts) mirrors tools/brochure-generator.
// Reports: on-device autosave + Firestore "reports" collection (owner field).
// ============================================================

(function () {
  "use strict";

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const show = (el) => el.classList.remove("hidden");
  const hide = (el) => el.classList.add("hidden");

  const SEC_COLORS = { style: "#64748B", cover: "#16A34A", summary: "#0891B2", axes: "#D97706", results: "#2563EB", signs: "#7C3AED", annex: "#DB2777" };
  const SWATCHES = ["#1F3A5F", "#0E5A8A", "#2563EB", "#0F766E", "#2E9E48", "#6D28D9", "#B91C1C", "#E4572E", "#C8A24A", "#1F2937"];
  const PAGE_W = 794, PAGE_H = 1123;
  const DRAFT_KEY = "reportGen:draft";
  const LIB_KEY = "reportGen:library";
  const MAX_LOCAL = 40;
  const IC = {
    up: '<svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
    down: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7"/></svg>',
    del: '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    img: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M3 16l5-5 4 4 3-3 6 6"/></svg>',
    tbl: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16M15 4v16"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    open: '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    dup: '<svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>',
  };

  /* ---------------- Helpers ---------------- */

  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function escapeAttr(str) {
    return String(str == null ? "" : str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }
  function todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  function makeReferenceNumber() {
    const d = new Date();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `RPT-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${rand}`;
  }
  function formatDateDisplay(iso) {
    if (!iso) return "—";
    const [y, m, d] = iso.split("-");
    if (!y || !m || !d) return iso;
    return `${d}/${m}/${y}`;
  }
  const uid = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const cut = (x, n) => { x = String(x || "").replace(/\s+/g, " ").trim(); n = n || 54; return x.length > n ? x.slice(0, n - 2) + "…" : x; };

  let toastTimer = null;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  // Splits free text into blocks: paragraphs, "- " bullets and "> " callouts.
  function parseText(text) {
    const out = [];
    if (!text || !text.trim()) return out;
    text.replace(/\r/g, "").split(/\n{2,}/).forEach((block) => {
      let para = [];
      const flush = () => { if (para.length) { out.push({ t: "p", text: para.join("\n") }); para = []; } };
      block.split("\n").forEach((line) => {
        const l = line.trim();
        if (!l) return;
        if (/^[-•]\s+/.test(l)) { flush(); out.push({ t: "li", text: l.replace(/^[-•]\s+/, "") }); }
        else if (/^>\s?/.test(l)) {
          flush();
          const q = l.replace(/^>\s?/, "");
          const last = out[out.length - 1];
          if (last && last.t === "q" && last._open) last.text += "\n" + q; else out.push({ t: "q", text: q, _open: true });
        } else { para.push(line); }
      });
      flush();
      out.forEach((b) => { delete b._open; });
    });
    return out;
  }

  /* ---------------- State ---------------- */

  let sid = 0;
  const nextSectionId = () => "sec-" + (++sid) + "-" + Math.random().toString(36).slice(2, 5);

  function emptyState() {
    return {
      id: null, localId: null,
      reference: "", lang: currentLang,
      logoDataUrl: null, signatureDataUrl: null, coverDataUrl: null,
      frameMode: "none", frameDataUrl: null,
      date: todayISO(),
      organization: "", reportTitle: "", preparedBy: "", preparedFor: "",
      execSummary: "", sections: [], recommendations: "",
      signers: [], appendices: [],
      tpl: "corporate", color: null, font: null,
    };
  }

  const DEMO_TABLE = {
    ar: [["المؤشر", "الربع الثاني", "الربع الثالث", "التغيّر"], ["الإيرادات (مليون دج)", "41.2", "47.0", "+14%"], ["رضا الزبائن", "4.3", "4.6", "+0.3"], ["عدد الفروع", "12", "14", "+2"]],
    fr: [["Indicateur", "T2", "T3", "Variation"], ["Chiffre d’affaires (M DA)", "41,2", "47,0", "+14 %"], ["Satisfaction client", "4,3", "4,6", "+0,3"], ["Nombre d’agences", "12", "14", "+2"]],
    en: [["Indicator", "Q2", "Q3", "Change"], ["Revenue (M DZD)", "41.2", "47.0", "+14%"], ["Customer satisfaction", "4.3", "4.6", "+0.3"], ["Branches", "12", "14", "+2"]],
  };
  function demoState() {
    const s = emptyState();
    s.localId = uid("L");
    s.reference = makeReferenceNumber();
    s.organization = t("demoOrg");
    s.reportTitle = t("demoTitle");
    s.preparedBy = t("demoPreparedBy");
    s.preparedFor = t("demoPreparedFor");
    s.execSummary = t("demoSummary");
    s.sections = [
      { id: nextSectionId(), title: t("demoSec1Title"), content: t("demoSec1Content"), table: { rows: (DEMO_TABLE[currentLang] || DEMO_TABLE.en).map((r) => r.slice()) } },
      { id: nextSectionId(), title: t("demoSec2Title"), content: t("demoSec2Content") },
      { id: nextSectionId(), title: t("demoSec3Title"), content: t("demoSec3Content") },
    ];
    s.recommendations = t("demoRecommendations");
    s.signers = [{ id: nextSectionId(), name: t("demoPreparedBy").split(",")[0], role: t("preparedBy"), sig: null }];
    return s;
  }

  function normalize(s) {
    const f = Object.assign(emptyState(), s || {});
    f.sections = (Array.isArray(f.sections) ? f.sections : []).map((x) => ({ id: x.id || nextSectionId(), title: x.title || "", content: x.content || "", image: x.image || null, caption: x.caption || "", table: x.table && Array.isArray(x.table.rows) ? { rows: x.table.rows.map((r) => r.map((c) => String(c == null ? "" : c))) } : null }));
    f.signers = (Array.isArray(f.signers) ? f.signers : []).map((x) => ({ id: x.id || nextSectionId(), name: x.name || "", role: x.role || "", sig: x.sig || null }));
    f.appendices = (Array.isArray(f.appendices) ? f.appendices : []).map((x) => ({ id: x.id || nextSectionId(), title: x.title || "", content: x.content || "", image: x.image || null }));
    if (!REPORT_TPL[f.tpl]) f.tpl = "corporate";
    if (f.font && !REPORT_FONT[f.font]) f.font = null;
    return f;
  }

  // What is stored (device + account): the previous fields plus the new ones.
  function serializeState(s) {
    return {
      reference: s.reference || "",
      logoDataUrl: s.logoDataUrl || null,
      signatureDataUrl: s.signatureDataUrl || null,
      frameMode: s.frameMode || "none",
      frameDataUrl: s.frameDataUrl || null,
      date: s.date || "",
      organization: s.organization || "",
      reportTitle: s.reportTitle || "",
      preparedBy: s.preparedBy || "",
      preparedFor: s.preparedFor || "",
      execSummary: s.execSummary || "",
      sections: (s.sections || []).map((sec) => ({ title: sec.title || "", content: sec.content || "", image: sec.image || null, caption: sec.caption || "", table: sec.table || null })),
      recommendations: s.recommendations || "",
      signers: (s.signers || []).map((x) => ({ name: x.name || "", role: x.role || "", sig: x.sig || null })),
      appendices: (s.appendices || []).map((x) => ({ title: x.title || "", content: x.content || "", image: x.image || null })),
      coverDataUrl: s.coverDataUrl || null,
      tpl: s.tpl || "corporate",
      color: s.color || null,
      font: s.font || null,
      lang: s.lang || currentLang,
    };
  }

  let state = null;

  /* ---------------- On-device storage ---------------- */

  function getLibrary() {
    try { return JSON.parse(localStorage.getItem(LIB_KEY)) || []; } catch (e) { return []; }
  }
  function setLibrary(list) {
    try { localStorage.setItem(LIB_KEY, JSON.stringify(list)); return true; } catch (e) { return false; }
  }
  function commitLocal() {
    if (!state) return true;
    if (!state.localId) state.localId = uid("L");
    const entry = { ...serializeState(state), id: state.id || null, localId: state.localId, updatedAt: Date.now() };
    let ok = true;
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(entry)); } catch (e) { ok = false; }
    const lib = getLibrary().filter((x) => x.localId !== state.localId);
    lib.unshift(entry);
    if (lib.length > MAX_LOCAL) lib.length = MAX_LOCAL;
    if (!setLibrary(lib)) ok = false;
    return ok;
  }
  let localTimer = null;
  function scheduleSave() {
    clearTimeout(localTimer);
    localTimer = setTimeout(commitLocal, 500);
    scheduleCloudSave();
  }
  window.addEventListener("pagehide", () => { clearTimeout(localTimer); commitLocal(); });

  /* ---------------- Account (Firebase "reports") ---------------- */

  const hasFb = () => typeof firebase !== "undefined" && firebase.apps && firebase.apps.length && window.fbAuth && window.fbDb;
  const auth = hasFb() ? window.fbAuth : null;
  const db = hasFb() ? window.fbDb : null;
  let currentUser = null;
  let pendingAfterLogin = null;

  function cloudPayload() {
    const payload = serializeState(state);
    payload.owner = currentUser.uid;
    payload.updatedAt = Date.now();
    return payload;
  }

  // Reports already in the account keep saving automatically, as before.
  let cloudTimer = null;
  function scheduleCloudSave() {
    if (!state || !state.id || !currentUser || !db) return;
    clearTimeout(cloudTimer);
    cloudTimer = setTimeout(() => {
      const payload = cloudPayload();
      if (JSON.stringify(payload).length > 950000) return;
      db.collection("reports").doc(state.id).set(payload, { merge: true }).catch(() => { /* retried on next edit */ });
    }, 1200);
  }

  async function saveToAccount() {
    clearTimeout(localTimer);
    const localOk = commitLocal();
    if (!currentUser) {
      toast(localOk ? t("t_saved_local") : t("t_too_big"));
      if (auth) openLogin(saveToAccount);
      return;
    }
    try {
      const payload = cloudPayload();
      if (JSON.stringify(payload).length > 950000) { toast(t("t_too_big")); return; }
      if (state.id) {
        await db.collection("reports").doc(state.id).set(payload, { merge: true });
      } else {
        payload.createdAt = Date.now();
        const ref = await db.collection("reports").add(payload);
        state.id = ref.id;
      }
      commitLocal();
      toast(t("t_saved_cloud"));
    } catch (e) {
      console.error(e);
      toast(t("t_cloud_err"));
    }
  }

  function openLogin(after) {
    pendingAfterLogin = after || null;
    $("#authError").hidden = true;
    show($("#login"));
  }
  function closeLogin() { hide($("#login")); }
  function authError(msg) { const e = $("#authError"); e.textContent = msg; e.hidden = false; }
  function afterLogin() {
    closeLogin();
    const fn = pendingAfterLogin; pendingAfterLogin = null;
    if (fn) fn();
  }
  $("#loginCancel").addEventListener("click", () => { pendingAfterLogin = null; closeLogin(); });
  $("#login").addEventListener("click", (e) => { if (e.target.id === "login") { pendingAfterLogin = null; closeLogin(); } });
  $("#googleSignInBtn").addEventListener("click", () => {
    if (!auth) { toast(t("t_cloud_err")); return; }
    auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(afterLogin).catch((err) => authError(err.message));
  });
  $("#authSignInBtn").addEventListener("click", () => {
    const email = $("#authEmail").value.trim(), password = $("#authPassword").value;
    if (!email || !password) { authError(t("email") + " / " + t("password")); return; }
    if (!auth) { toast(t("t_cloud_err")); return; }
    auth.signInWithEmailAndPassword(email, password).then(afterLogin).catch((err) => authError(err.message));
  });
  $("#authRegisterBtn").addEventListener("click", () => {
    const email = $("#authEmail").value.trim(), password = $("#authPassword").value;
    if (!email || !password) { authError(t("email") + " / " + t("password")); return; }
    if (!auth) { toast(t("t_cloud_err")); return; }
    auth.createUserWithEmailAndPassword(email, password).then(afterLogin).catch((err) => authError(err.message));
  });
  $("#signOutBtn").addEventListener("click", () => { if (auth) auth.signOut().then(() => toast(t("t_signed_out"))); });

  if (auth) {
    auth.onAuthStateChanged((user) => {
      currentUser = user;
      if (!$("#mine").classList.contains("hidden")) loadMine();
    });
  }

  /* ---------------- My reports ---------------- */

  let mineList = [];
  let mineSrc = "all";
  let pendingDelete = null;

  function openMine() { show($("#mine")); loadMine(); }
  function closeMine() { hide($("#mine")); }

  async function loadMine() {
    const logged = !!currentUser;
    $("#mineLogin").classList.toggle("hidden", logged || !auth);
    $("#mineUser").classList.toggle("hidden", !logged);
    if (logged) $("#userChipEmail").textContent = currentUser.email || currentUser.displayName || "";
    let cloud = [];
    if (logged) {
      $("#libraryGrid").innerHTML = `<div class="g-empty">${t("loading")}</div>`;
      try {
        const snap = await db.collection("reports").where("owner", "==", currentUser.uid).get();
        snap.forEach((doc) => cloud.push({ ...doc.data(), _src: "cloud", _id: doc.id }));
      } catch (err) {
        console.error(err);
        toast(t("t_cloud_err"));
      }
    }
    const ids = new Set(cloud.map((c) => c._id));
    const local = getLibrary().filter((x) => !(x.id && ids.has(x.id))).map((x) => ({ ...x, _src: "local" }));
    mineList = [...local, ...cloud].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    renderMine();
  }

  function renderMine() {
    const grid = $("#libraryGrid");
    const fmt = (ms) => { try { return ms ? new Date(ms).toLocaleDateString(currentLang === "ar" ? "ar-DZ" : currentLang) : ""; } catch (e) { return ""; } };
    const list = mineList.map((r, i) => ({ r, i })).filter(({ r }) => mineSrc === "all" || (mineSrc === "local" ? r._src === "local" : r._src === "cloud"));
    const cards = list.map(({ r, i }) => {
      const isCur = (r._src === "local" && r.localId === state.localId) || (r._src === "cloud" && r._id === state.id);
      return `<div class="g-card m-card" data-idx="${i}">
        ${isCur ? `<span class="m-tag">${t("current")}</span>` : ""}
        <div class="g-thumb" style="aspect-ratio:794/1123"></div>
        <div class="m-info"><b>${escapeHtml(r.reportTitle || t("untitledReport"))}</b><small>${escapeHtml(r.organization || "")} · ${formatDateDisplay(r.date)}</small></div>
        <div class="m-row"><span class="m-date">${fmt(r.updatedAt)}</span><span class="m-src ${r._src === "cloud" ? "cloud" : ""}">${r._src === "cloud" ? t("src_cloud") : t("src_local")}</span></div>
        <div class="m-actions">
          <button type="button" class="primary" data-act="open">${IC.open}${t("open_b")}</button>
          <button type="button" data-act="dup">${IC.dup}${t("dup_b")}</button>
          <button type="button" class="danger icon" data-act="del" title="${t("del_b")}" aria-label="${t("del_b")}">${IC.del}</button>
        </div></div>`;
    }).join("");
    grid.innerHTML = `<button type="button" class="g-card m-new" data-act="new">${IC.plus}<span>${t("new_b")}</span></button>` + (cards || `<div class="g-empty">${t("libraryEmptyText")}</div>`);
    requestAnimationFrame(() => {
      $$(".m-card", grid).forEach((card) => {
        const r = mineList[+card.dataset.idx];
        const th = card.querySelector(".g-thumb");
        th.appendChild(miniCover(normalize(r), th.clientWidth));
      });
    });
  }

  function openReport(entry) {
    clearTimeout(localTimer);
    commitLocal();
    const s = normalize(entry);
    s.id = entry._src === "cloud" ? entry._id : (entry.id || null);
    s.localId = entry._src === "local" ? entry.localId : ((getLibrary().find((x) => x.id && x.id === s.id) || {}).localId || uid("L"));
    loadReportIntoEditor(s);
    if (s.lang && I18N[s.lang] && s.lang !== currentLang) applyLanguage(s.lang);
  }

  $("#btnMine").addEventListener("click", openMine);
  $("#mClose").addEventListener("click", closeMine);
  $("#mineLoginBtn").addEventListener("click", () => openLogin(loadMine));
  $("#mineTabs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-src]");
    if (!b) return;
    mineSrc = b.dataset.src;
    $$("#mineTabs .chip").forEach((x) => x.classList.toggle("on", x === b));
    renderMine();
  });
  $("#mine").addEventListener("click", async (e) => {
    if (e.target.id === "mine") { closeMine(); return; }
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const act = btn.dataset.act;
    if (act === "new") {
      clearTimeout(localTimer);
      commitLocal();
      loadReportIntoEditor(demoState());
      closeMine(); toggleSec(null); toast(t("t_new"));
      return;
    }
    const card = btn.closest("[data-idx]");
    const r = card && mineList[+card.dataset.idx];
    if (!r) return;
    if (act === "open") { openReport(r); closeMine(); toggleSec(null); toast(t("t_opened")); return; }
    if (act === "dup") {
      const copy = { ...serializeState(normalize(r)), localId: uid("L"), id: null, updatedAt: Date.now() };
      copy.reportTitle = (copy.reportTitle || t("untitledReport")) + t("copy_suffix");
      const lib = getLibrary(); lib.unshift(copy);
      toast(setLibrary(lib) ? t("t_dup") : t("t_too_big"));
      loadMine();
      return;
    }
    if (act === "del") { pendingDelete = r; show($("#deleteReportOverlay")); }
  });
  $("#deleteReportCancel").addEventListener("click", () => { hide($("#deleteReportOverlay")); pendingDelete = null; });
  $("#deleteReportOk").addEventListener("click", async () => {
    hide($("#deleteReportOverlay"));
    const r = pendingDelete; pendingDelete = null;
    if (!r) return;
    try {
      if (r._src === "cloud") {
        await db.collection("reports").doc(r._id).delete();
        if (state.id === r._id) state.id = null;
        setLibrary(getLibrary().map((x) => (x.id === r._id ? { ...x, id: null } : x)));
      } else {
        setLibrary(getLibrary().filter((x) => x.localId !== r.localId));
        if (state.localId === r.localId) state.localId = null;
      }
      toast(t("t_deleted"));
    } catch (err) { console.error(err); toast(t("t_cloud_err")); }
    loadMine();
  });

  /* ---------------- Language ---------------- */

  function applyLanguage(lang) {
    currentLang = lang;
    if (state) state.lang = lang;
    const dict = I18N[lang];
    const html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", dict.dir);
    $$("[data-i18n]").forEach((n) => { const k = n.getAttribute("data-i18n"); if (dict[k] !== undefined) n.textContent = dict[k]; });
    $$("[data-i18n-placeholder]").forEach((n) => { const k = n.getAttribute("data-i18n-placeholder"); if (dict[k] !== undefined) n.setAttribute("placeholder", dict[k]); });
    $$("[data-tip]").forEach((n) => { n.setAttribute("data-tiptext", t(n.dataset.tip)); n.setAttribute("aria-label", t(n.dataset.tip)); });
    $$(".lang-btn").forEach((b) => b.classList.toggle("on", b.dataset.lang === lang));
    $("#langToggle").textContent = lang.toUpperCase();
    document.title = t("appTitle") + " — Merabti Academy";
    if (state) {
      buildStyleControls();
      renderSectionsEditor();
      renderSignersEditor();
      renderAnnexEditor();
      renderNow();
    }
    if (!$("#mine").classList.contains("hidden")) renderMine();
    if (!$("#gallery").classList.contains("hidden")) buildGallery();
  }
  $("#langToggle").addEventListener("click", (e) => { e.stopPropagation(); $("#langMenu").classList.toggle("hidden"); });
  $$(".lang-btn").forEach((b) => b.addEventListener("click", () => { hide($("#langMenu")); applyLanguage(b.dataset.lang); scheduleSave(); }));
  document.addEventListener("click", (e) => { if (!e.target.closest(".lang-wrap")) hide($("#langMenu")); });

  /* ---------------- Images (resized so reports fit in the account) ---------------- */

  const imgSizes = new Map();
  function imageSize(url) {
    if (!url) return null;
    if (imgSizes.has(url)) return imgSizes.get(url);
    imgSizes.set(url, null);
    const im = new Image();
    im.onload = () => { imgSizes.set(url, { w: im.naturalWidth || 400, h: im.naturalHeight || 300 }); scheduleRender(); };
    im.onerror = () => imgSizes.set(url, { w: 400, h: 300 });
    im.src = url;
    return null;
  }

  function readImage(file, maxSide, cb) {
    const valid = /\.(png|jpe?g|svg|webp|gif)$/i.test(file.name) || /^image\//.test(file.type);
    if (!valid) return;
    const fr = new FileReader();
    fr.onload = () => {
      const src = fr.result;
      if (/svg/i.test(file.type)) { cb(src); return; }
      const im = new Image();
      im.onload = () => {
        const k = Math.min(1, maxSide / Math.max(im.naturalWidth, im.naturalHeight));
        const w = Math.round(im.naturalWidth * k), h = Math.round(im.naturalHeight * k);
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        const g = c.getContext("2d");
        const png = /png|gif|webp/i.test(file.type);
        if (!png) { g.fillStyle = "#fff"; g.fillRect(0, 0, w, h); }
        g.drawImage(im, 0, 0, w, h);
        const out = png ? c.toDataURL("image/png") : c.toDataURL("image/jpeg", 0.85);
        cb(out.length < src.length || k < 1 ? out : src);
      };
      im.onerror = () => cb(src);
      im.src = src;
    };
    fr.readAsDataURL(file);
  }

  function bindUpload(boxId, inputId, phId, imgId, rmId, key, maxSide) {
    const box = $("#" + boxId), input = $("#" + inputId), ph = $("#" + phId), img = $("#" + imgId), rm = $("#" + rmId);
    const set = (url) => {
      state[key] = url || null;
      img.hidden = !url; ph.hidden = !!url; rm.hidden = !url;
      if (url) img.src = url; else img.removeAttribute("src");
    };
    const take = (file) => readImage(file, maxSide, (url) => { set(url); input.value = ""; scheduleRender(); scheduleSave(); });
    box.addEventListener("click", (e) => { if (!e.target.closest(".rm")) input.click(); });
    box.addEventListener("dragover", (e) => { e.preventDefault(); box.style.borderColor = "var(--sc)"; });
    box.addEventListener("dragleave", () => { box.style.borderColor = ""; });
    box.addEventListener("drop", (e) => { e.preventDefault(); box.style.borderColor = ""; if (e.dataTransfer.files[0]) take(e.dataTransfer.files[0]); });
    input.addEventListener("change", () => { if (input.files[0]) take(input.files[0]); });
    rm.addEventListener("click", (e) => { e.stopPropagation(); input.value = ""; set(null); scheduleRender(); scheduleSave(); });
    return set;
  }
  const setLogo = bindUpload("logoUploadBox", "logoInput", "logoPlaceholder", "logoPreview", "removeLogoBtn", "logoDataUrl", 700);
  const setSignature = bindUpload("signatureUploadBox", "signatureInput", "signaturePlaceholder", "signaturePreview", "removeSignatureBtn", "signatureDataUrl", 700);
  const setFrame = bindUpload("frameUploadBox", "frameInput", "framePlaceholder", "framePreview", "removeFrameBtn", "frameDataUrl", 1400);
  const setCover = bindUpload("coverUploadBox", "coverInput", "coverPlaceholder", "coverPreview", "removeCoverBtn", "coverDataUrl", 1400);

  // one hidden input shared by section / signer / appendix images
  let imgTarget = null;
  $("#itemImageInput").addEventListener("change", (e) => {
    const f = e.target.files[0];
    const target = imgTarget; imgTarget = null;
    e.target.value = "";
    if (!f || !target) return;
    readImage(f, target.max || 1400, (url) => { target.obj[target.key] = url; target.after(); scheduleRender(); scheduleSave(); });
  });
  function pickImage(obj, key, after, max) { imgTarget = { obj, key, after, max }; $("#itemImageInput").click(); }

  /* ---------------- Basic fields ---------------- */

  const FIELDS = [["referenceNumber", "reference"], ["reportDate", "date"], ["organization", "organization"], ["reportTitle", "reportTitle"], ["preparedBy", "preparedBy"], ["preparedFor", "preparedFor"], ["execSummary", "execSummary"], ["recommendations", "recommendations"]];
  FIELDS.forEach(([id, key]) => {
    $("#" + id).addEventListener("input", (e) => { state[key] = e.target.value; scheduleRender(); scheduleSave(); });
  });

  /* ---------------- Style controls ---------------- */

  function accent() { return state.color || REPORT_TPL[state.tpl].color; }
  function fontId() { return state.font || REPORT_TPL[state.tpl].font; }

  function buildStyleControls() {
    const cur = state.color;
    $("#swatches").innerHTML =
      `<button type="button" class="sw auto ${!cur ? "on" : ""}" data-color="" style="--c-a:${REPORT_TPL[state.tpl].color}" title="${escapeAttr(t("color_auto"))}"></button>` +
      SWATCHES.map((c) => `<button type="button" class="sw ${cur === c ? "on" : ""}" data-color="${c}" style="background:${c}"></button>`).join("") +
      `<label class="sw custom ${cur && !SWATCHES.includes(cur) ? "on" : ""}"><input type="color" id="customColor" value="${cur || REPORT_TPL[state.tpl].color}"></label>`;
    const fs = $("#fontSel");
    fs.innerHTML = `<option value="">${escapeHtml(t("font_auto"))} (${escapeHtml(REPORT_FONT[REPORT_TPL[state.tpl].font].name)})</option>` +
      REPORT_FONTS.map((f) => `<option value="${f.id}" ${state.font === f.id ? "selected" : ""} style="font-family:${escapeAttr(f.head)}">${escapeHtml(f.name)}</option>`).join("");
    $$("#frameSeg button").forEach((b) => b.classList.toggle("on", b.dataset.frame === (state.frameMode || "none")));
    $("#frameUploadBox").hidden = state.frameMode !== "custom";
    if (openSec === "style") renderTplStrip();
  }
  $("#swatches").addEventListener("click", (e) => {
    const b = e.target.closest(".sw[data-color]");
    if (!b) return;
    state.color = b.dataset.color || null;
    buildStyleControls(); scheduleRender(); scheduleSave();
  });
  $("#swatches").addEventListener("input", (e) => {
    if (e.target.id !== "customColor") return;
    state.color = e.target.value;
    $$("#swatches .sw").forEach((x) => x.classList.toggle("on", x.classList.contains("custom")));
    scheduleRender(); scheduleSave();
  });
  $("#fontSel").addEventListener("change", (e) => { state.font = e.target.value || null; scheduleRender(); scheduleSave(); });
  $("#frameSeg").addEventListener("click", (e) => {
    const b = e.target.closest("[data-frame]");
    if (!b) return;
    state.frameMode = b.dataset.frame;
    buildStyleControls(); scheduleRender(); scheduleSave();
  });
  $("#tplStrip").addEventListener("click", (e) => { const b = e.target.closest("[data-tpl]"); if (b) setTemplate(b.dataset.tpl); });

  function setTemplate(id, fromGallery) {
    state.tpl = id;
    state.color = null;
    state.font = null;
    buildStyleControls();
    renderNow();
    if (fromGallery) toast(t("t_tpl"));
    scheduleSave();
  }

  $("#templateGrid").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-template]");
    if (!btn) return;
    const preset = CONTENT_PRESETS[btn.dataset.template];
    const list = preset && (preset[currentLang] || preset.en);
    if (!list) return;
    state.sections = list.map((s) => ({ id: nextSectionId(), title: s.title, content: s.content, image: null, caption: "", table: null }));
    renderSectionsEditor(); scheduleRender(); scheduleSave();
    toast(t("t_preset"));
  });

  /* ---------------- Sections (axes) editor ---------------- */

  function tableEditor(tb) {
    return `<div class="tbl-edit"><table>${tb.rows.map((r, ri) => `<tr>${r.map((c, ci) => `<td><input type="text" dir="auto" data-r="${ri}" data-c="${ci}" value="${escapeAttr(c)}"></td>`).join("")}</tr>`).join("")}</table></div>
      <div class="tbl-tools">
        <button type="button" class="chip-btn" data-act="row">${IC.plus}${t("addRow")}</button>
        <button type="button" class="chip-btn" data-act="col">${IC.plus}${t("addCol")}</button>
        <button type="button" class="chip-btn" data-act="delrow">${t("delRow")}</button>
        <button type="button" class="chip-btn" data-act="delcol">${t("delCol")}</button>
        <button type="button" class="chip-btn danger" data-act="rmtable">${IC.x}${t("removeTable")}</button>
      </div>`;
  }
  function imageEditor(obj, withCaption) {
    if (!obj.image) return "";
    return `<div class="ic-img"><div class="thumb"><img src="${obj.image}" alt=""><button type="button" data-act="rmimg">${IC.x}</button></div>
      ${withCaption ? `<div class="cap"><input type="text" dir="auto" data-field="caption" value="${escapeAttr(obj.caption)}" placeholder="${escapeAttr(t("imageCaption"))}"></div>` : ""}</div>`;
  }

  function renderSectionsEditor() {
    const list = $("#sectionsList");
    $("#sectionCountBadge").textContent = state.sections.length;
    if (!state.sections.length) {
      list.innerHTML = `<p class="hint-inline" style="margin:0">${escapeHtml(t("noSectionsYet"))}</p>`;
      return;
    }
    list.innerHTML = state.sections.map((sec, i) => `
      <div class="item-card" data-id="${sec.id}">
        <div class="ic-head">
          <span class="ic-num">${i + 1}</span>
          <input type="text" dir="auto" data-field="title" value="${escapeAttr(sec.title)}" placeholder="${escapeAttr(t("sectionTitlePlaceholder"))}">
          <div class="ic-tools">
            <button type="button" data-act="up" title="${escapeAttr(t("moveUp"))}" ${i === 0 ? "disabled" : ""}>${IC.up}</button>
            <button type="button" data-act="down" title="${escapeAttr(t("moveDown"))}" ${i === state.sections.length - 1 ? "disabled" : ""}>${IC.down}</button>
            <button type="button" class="del" data-act="delete" title="${escapeAttr(t("deleteSection"))}">${IC.del}</button>
          </div>
        </div>
        <div class="ic-body">
          <textarea dir="auto" data-field="content" placeholder="${escapeAttr(t("sectionContentPlaceholder"))}">${escapeHtml(sec.content)}</textarea>
          ${imageEditor(sec, true)}
          ${sec.table ? tableEditor(sec.table) : ""}
          <div class="ic-extras">
            ${sec.image ? "" : `<button type="button" class="chip-btn" data-act="img">${IC.img}${t("addImage")}</button>`}
            ${sec.table ? "" : `<button type="button" class="chip-btn" data-act="table">${IC.tbl}${t("addTable")}</button>`}
          </div>
        </div>
      </div>`).join("");
  }

  $("#sectionsList").addEventListener("input", (e) => {
    const card = e.target.closest(".item-card");
    if (!card) return;
    const sec = state.sections.find((s) => s.id === card.dataset.id);
    if (!sec) return;
    if (e.target.dataset.r != null) {
      sec.table.rows[+e.target.dataset.r][+e.target.dataset.c] = e.target.value;
    } else if (e.target.dataset.field) {
      sec[e.target.dataset.field] = e.target.value;
    }
    scheduleRender(); scheduleSave();
  });
  $("#sectionsList").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const card = btn.closest(".item-card");
    const idx = state.sections.findIndex((s) => s.id === card.dataset.id);
    if (idx < 0) return;
    const sec = state.sections[idx];
    const act = btn.dataset.act;
    const tb = sec.table;
    if (act === "delete") state.sections.splice(idx, 1);
    else if (act === "up" && idx > 0) [state.sections[idx - 1], state.sections[idx]] = [state.sections[idx], state.sections[idx - 1]];
    else if (act === "down" && idx < state.sections.length - 1) [state.sections[idx + 1], state.sections[idx]] = [state.sections[idx], state.sections[idx + 1]];
    else if (act === "img") { pickImage(sec, "image", renderSectionsEditor); return; }
    else if (act === "rmimg") { sec.image = null; sec.caption = ""; }
    else if (act === "table") sec.table = { rows: [["", "", ""], ["", "", ""], ["", "", ""]] };
    else if (act === "rmtable") sec.table = null;
    else if (act === "row") tb.rows.push(tb.rows[0].map(() => ""));
    else if (act === "col") { if (tb.rows[0].length < 8) tb.rows.forEach((r) => r.push("")); }
    else if (act === "delrow") { if (tb.rows.length > 1) tb.rows.pop(); }
    else if (act === "delcol") { if (tb.rows[0].length > 1) tb.rows.forEach((r) => r.pop()); }
    renderSectionsEditor(); scheduleRender(); scheduleSave();
  });
  $("#addSectionBtn").addEventListener("click", () => {
    state.sections.push({ id: nextSectionId(), title: "", content: "", image: null, caption: "", table: null });
    renderSectionsEditor(); scheduleRender(); scheduleSave();
    const inputs = $$('#sectionsList [data-field="title"]');
    if (inputs.length) inputs[inputs.length - 1].focus();
  });

  /* ---------------- Signers editor ---------------- */

  function renderSignersEditor() {
    $("#signersList").innerHTML = state.signers.map((s, i) => `
      <div class="item-card" data-id="${s.id}">
        <div class="ic-head">
          <span class="ic-num">${i + 1}</span>
          <input type="text" dir="auto" data-field="name" value="${escapeAttr(s.name)}" placeholder="${escapeAttr(t("signerName"))}">
          <div class="ic-tools"><button type="button" class="del" data-act="delete" title="${escapeAttr(t("del_b"))}">${IC.del}</button></div>
        </div>
        <div class="ic-body">
          <input type="text" dir="auto" data-field="role" value="${escapeAttr(s.role)}" placeholder="${escapeAttr(t("signerRole"))}">
          ${s.sig ? `<div class="ic-img"><div class="thumb"><img src="${s.sig}" alt=""><button type="button" data-act="rmimg">${IC.x}</button></div></div>` : `<div class="ic-extras"><button type="button" class="chip-btn" data-act="img">${IC.img}${t("signerSig")}</button></div>`}
        </div>
      </div>`).join("");
  }
  $("#signersList").addEventListener("input", (e) => {
    const card = e.target.closest(".item-card");
    const s = card && state.signers.find((x) => x.id === card.dataset.id);
    if (!s || !e.target.dataset.field) return;
    s[e.target.dataset.field] = e.target.value;
    scheduleRender(); scheduleSave();
  });
  $("#signersList").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const idx = state.signers.findIndex((x) => x.id === btn.closest(".item-card").dataset.id);
    if (idx < 0) return;
    const s = state.signers[idx];
    if (btn.dataset.act === "delete") state.signers.splice(idx, 1);
    else if (btn.dataset.act === "img") { pickImage(s, "sig", renderSignersEditor, 700); return; }
    else if (btn.dataset.act === "rmimg") s.sig = null;
    renderSignersEditor(); scheduleRender(); scheduleSave();
  });
  $("#addSignerBtn").addEventListener("click", () => {
    state.signers.push({ id: nextSectionId(), name: "", role: "", sig: null });
    renderSignersEditor(); scheduleRender(); scheduleSave();
    const inputs = $$('#signersList [data-field="name"]');
    if (inputs.length) inputs[inputs.length - 1].focus();
  });

  /* ---------------- Appendices editor ---------------- */

  const annexLetter = (i) => (currentLang === "ar" ? ["أ", "ب", "ج", "د", "هـ", "و", "ز", "ح", "ط", "ي"][i] || String(i + 1) : String.fromCharCode(65 + (i % 26)));

  function renderAnnexEditor() {
    $("#annexList").innerHTML = state.appendices.map((a, i) => `
      <div class="item-card" data-id="${a.id}">
        <div class="ic-head">
          <span class="ic-num">${annexLetter(i)}</span>
          <input type="text" dir="auto" data-field="title" value="${escapeAttr(a.title)}" placeholder="${escapeAttr(t("appendixTitle"))}">
          <div class="ic-tools">
            <button type="button" data-act="up" ${i === 0 ? "disabled" : ""}>${IC.up}</button>
            <button type="button" data-act="down" ${i === state.appendices.length - 1 ? "disabled" : ""}>${IC.down}</button>
            <button type="button" class="del" data-act="delete" title="${escapeAttr(t("del_b"))}">${IC.del}</button>
          </div>
        </div>
        <div class="ic-body">
          <textarea dir="auto" data-field="content" placeholder="${escapeAttr(t("appendixText"))}">${escapeHtml(a.content)}</textarea>
          ${imageEditor(a, false)}
          ${a.image ? "" : `<div class="ic-extras"><button type="button" class="chip-btn" data-act="img">${IC.img}${t("addImage")}</button></div>`}
        </div>
      </div>`).join("");
  }
  $("#annexList").addEventListener("input", (e) => {
    const card = e.target.closest(".item-card");
    const a = card && state.appendices.find((x) => x.id === card.dataset.id);
    if (!a || !e.target.dataset.field) return;
    a[e.target.dataset.field] = e.target.value;
    scheduleRender(); scheduleSave();
  });
  $("#annexList").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const L = state.appendices;
    const idx = L.findIndex((x) => x.id === btn.closest(".item-card").dataset.id);
    if (idx < 0) return;
    const act = btn.dataset.act;
    if (act === "delete") L.splice(idx, 1);
    else if (act === "up" && idx > 0) [L[idx - 1], L[idx]] = [L[idx], L[idx - 1]];
    else if (act === "down" && idx < L.length - 1) [L[idx + 1], L[idx]] = [L[idx], L[idx + 1]];
    else if (act === "img") { pickImage(L[idx], "image", renderAnnexEditor); return; }
    else if (act === "rmimg") L[idx].image = null;
    renderAnnexEditor(); scheduleRender(); scheduleSave();
  });
  $("#addAnnexBtn").addEventListener("click", () => {
    state.appendices.push({ id: nextSectionId(), title: "", content: "", image: null });
    renderAnnexEditor(); scheduleRender(); scheduleSave();
    const inputs = $$('#annexList [data-field="title"]');
    if (inputs.length) inputs[inputs.length - 1].focus();
  });

  /* ---------------- Load a report into the form ---------------- */

  function loadReportIntoEditor(s) {
    state = normalize(s);
    if (!state.localId) state.localId = uid("L");
    $("#referenceNumber").value = state.reference || "";
    $("#reportDate").value = state.date || todayISO();
    $("#organization").value = state.organization || "";
    $("#reportTitle").value = state.reportTitle || "";
    $("#preparedBy").value = state.preparedBy || "";
    $("#preparedFor").value = state.preparedFor || "";
    $("#execSummary").value = state.execSummary || "";
    $("#recommendations").value = state.recommendations || "";
    setLogo(state.logoDataUrl); setSignature(state.signatureDataUrl); setFrame(state.frameDataUrl); setCover(state.coverDataUrl);
    buildStyleControls();
    renderSectionsEditor();
    renderSignersEditor();
    renderAnnexEditor();
    renderNow();
    scheduleSave();
  }

  /* =========================================================
     Pagination engine: cover, table of contents, then the flow
     of blocks packed into fixed A4 pages.
     ========================================================= */

  function coverCtx(s) {
    const tpl = REPORT_TPL[s.tpl];
    const ac = s.color || tpl.color;
    const y = (s.date || "").split("-")[0] || String(new Date().getFullYear());
    return {
      P: rgPalette(ac), L: { preparedBy: t("preparedBy"), preparedFor: t("preparedFor"), reportDate: t("reportDate"), reference: t("reference"), reportTitle: t("reportTitle"), page: t("page") },
      title: s.reportTitle || t("untitledReport"), org: s.organization || "", by: s.preparedBy || "", for: s.preparedFor || "",
      date: s.date ? formatDateDisplay(s.date) : "", ref: s.reference || "", year: y, logo: s.logoDataUrl, coverImg: s.coverDataUrl,
    };
  }

  function makeRoot(s) {
    const tpl = REPORT_TPL[s.tpl];
    const P = rgPalette(s.color || tpl.color);
    const F = REPORT_FONT[s.font || tpl.font] || REPORT_FONTS[0];
    const root = document.createElement("div");
    root.className = `rp T-${s.tpl}` + (s.frameMode === "simple" ? " frame-simple" : "");
    root.setAttribute("lang", currentLang);
    root.setAttribute("dir", I18N[currentLang].dir);
    const vars = { "--c-ac": P.ac, "--c-soft": P.soft, "--c-soft2": P.soft2, "--c-mid": P.mid, "--c-dark": P.dark, "--c-deep": P.deep, "--f-head": F.head, "--f-body": F.body };
    Object.keys(vars).forEach((k) => root.style.setProperty(k, vars[k]));
    return root;
  }
  function addFrame(page, s) {
    if (s.frameMode === "custom" && s.frameDataUrl) page.insertAdjacentHTML("beforeend", `<img class="pg-frame" src="${s.frameDataUrl}" alt="">`);
  }
  // shrink long cover titles until they fit the template's title box (max-height)
  function fitCoverTitle(page) {
    const el = page.querySelector(".cv-title");
    if (!el) return;
    const maxH = parseFloat(getComputedStyle(el).maxHeight);
    if (!maxH) return;
    el.style.maxHeight = "none";
    let size = parseFloat(getComputedStyle(el).fontSize);
    let guard = 0;
    while (el.offsetHeight > maxH && size > 18 && guard++ < 30) { size -= 2; el.style.fontSize = size + "px"; }
    el.style.maxHeight = "";
  }
  function buildCoverPage(s, root) {
    const page = document.createElement("section");
    page.className = "pg pg-cover";
    page.dataset.sec = "cover";
    page.innerHTML = REPORT_TPL[s.tpl].cover(coverCtx(s));
    addFrame(page, s);
    root.appendChild(page);
    fitCoverTitle(page);
    return page;
  }

  // Cover-only miniature (gallery, strip, My reports)
  function miniCover(s, width, tplOverride) {
    const copy = Object.assign({}, s, tplOverride ? { tpl: tplOverride, color: null, font: null } : {});
    const root = makeRoot(copy);
    const mr = $("#measureRoot");
    mr.appendChild(root);
    buildCoverPage(copy, root);
    mr.removeChild(root);
    const wrap = document.createElement("div");
    wrap.className = "mini";
    wrap.style.width = PAGE_W + "px";
    wrap.style.transform = `scale(${width / PAGE_W})`;
    wrap.appendChild(root);
    return wrap;
  }

  function flowBlocks(s) {
    const B = [];
    const text = (txt, sec, extra) => parseText(txt).forEach((b, i) => B.push({ ...b, sec, ...(extra || {}), lead: extra && extra.leadFirst && i === 0 }));
    const toc = [];
    const valid = s.sections.filter((x) => x.title || x.content || x.image || x.table);
    if (s.execSummary && s.execSummary.trim()) toc.push({ a: "summary", label: t("execSummary") });
    valid.forEach((x, i) => toc.push({ a: "ax-" + x.id, n: i + 1, label: x.title || t("untitledSection") }));
    if (s.recommendations && s.recommendations.trim()) toc.push({ a: "results", label: t("recommendations") });
    const hasSigns = s.signatureDataUrl || s.signers.some((x) => x.name || x.role || x.sig);
    if (hasSigns) toc.push({ a: "signs", label: t("signaturesHeading") });
    const annex = s.appendices.filter((x) => x.title || x.content || x.image);
    annex.forEach((x, i) => toc.push({ a: "an-" + x.id, sub: true, n: annexLetter(s.appendices.indexOf(x)), label: `${t("appendixLabel")} ${annexLetter(s.appendices.indexOf(x))}${x.title ? " — " + x.title : ""}` }));

    // table of contents
    B.push({ t: "h", sec: "axes", text: t("tableOfContents") });
    if (valid.length) toc.forEach((e) => B.push({ t: "toc", sec: "axes", e }));
    else B.push({ t: "empty", sec: "axes", text: t("tocEmpty") });
    B.push({ t: "break" });

    if (s.execSummary && s.execSummary.trim()) {
      B.push({ t: "h", sec: "summary", a: "summary", text: t("execSummary") });
      text(s.execSummary, "summary", { leadFirst: true });
    }
    if (!valid.length) B.push({ t: "empty", sec: "axes", text: t("noSectionsYet") });
    valid.forEach((x, i) => {
      B.push({ t: "h", sec: "axes", axis: x.id, a: "ax-" + x.id, n: i + 1, text: x.title || t("untitledSection") });
      text(x.content, "axes", { axis: x.id });
      if (x.image) B.push({ t: "fig", sec: "axes", axis: x.id, src: x.image, cap: x.caption });
      if (x.table && x.table.rows.length) B.push({ t: "table", sec: "axes", axis: x.id, rows: x.table.rows });
    });
    if (s.recommendations && s.recommendations.trim()) {
      B.push({ t: "h", sec: "results", a: "results", text: t("recommendations") });
      text(s.recommendations, "results");
    }
    if (hasSigns) {
      B.push({ t: "h", sec: "signs", a: "signs", text: t("signaturesHeading") });
      B.push({ t: "signs", sec: "signs" });
    }
    annex.forEach((x, i) => {
      if (i === 0) B.push({ t: "break" });
      const letter = annexLetter(s.appendices.indexOf(x));
      B.push({ t: "h", sec: "annex", a: "an-" + x.id, text: `${t("appendixLabel")} ${letter}${x.title ? " — " + x.title : ""}` });
      text(x.content, "annex");
      if (x.image) B.push({ t: "fig", sec: "annex", src: x.image, cap: "" });
    });
    return B;
  }

  function el(tag, cls, sec, extra) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (sec) e.dataset.sec = sec;
    if (extra && extra.axis) e.dataset.axis = extra.axis;
    return e;
  }

  function makeBlock(b, s, bodyW) {
    let e;
    switch (b.t) {
      case "h":
        e = el("h2", "b-h1", b.sec, b);
        if (b.a) e.dataset.anchor = b.a;
        e.innerHTML = (b.n != null ? `<span class="h-num">${escapeHtml(String(b.n))}</span>` : "") + `<span class="h-txt">${escapeHtml(b.text)}</span>`;
        break;
      case "p": e = el("p", "b-p" + (b.lead ? " b-lead" : ""), b.sec, b); e.textContent = b.text; break;
      case "li": e = el("div", "b-li" + (b.cont ? " cont" : ""), b.sec, b); e.textContent = b.text; break;
      case "q": e = el("div", "b-q", b.sec, b); e.textContent = b.text; break;
      case "empty": e = el("p", "b-empty", b.sec); e.textContent = b.text; break;
      case "toc":
        e = el("div", "b-toc-row" + (b.e.sub ? " sub" : ""), "axes");
        e.dataset.target = b.e.a;
        e.innerHTML = `${b.e.n != null && !b.e.sub ? `<span class="tc-n">${b.e.n}</span>` : ""}<span class="tc-t">${escapeHtml(b.e.label)}</span><span class="tc-dots"></span><span class="tc-p"></span>`;
        break;
      case "fig": {
        e = el("figure", "b-fig", b.sec, b);
        const sz = imageSize(b.src) || { w: 640, h: 400 };
        const maxH = b.maxH || 400;
        const k = Math.min(1, bodyW / sz.w, maxH / sz.h);
        e.innerHTML = `<img src="${b.src}" alt="" style="width:${Math.round(sz.w * k)}px;height:${Math.round(sz.h * k)}px">` + (b.cap ? `<figcaption>${escapeHtml(b.cap)}</figcaption>` : "");
        break;
      }
      case "table": {
        e = el("table", "b-tbl", b.sec, b);
        const head = b.rows[0];
        e.innerHTML = `<thead><tr>${head.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr></thead><tbody>${b.rows.slice(1).map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`).join("")}</tbody>`;
        break;
      }
      case "signs": {
        e = el("div", "b-signs", "signs");
        const list = [];
        if (s.signatureDataUrl) list.push({ name: s.preparedBy || "", role: s.organization || "", sig: s.signatureDataUrl });
        s.signers.filter((x) => x.name || x.role || x.sig).forEach((x) => list.push(x));
        e.innerHTML = list.map((x) => `<div class="sg"><div class="sg-img">${x.sig ? `<img src="${x.sig}" alt="">` : ""}</div><div class="sg-line"></div><div class="sg-name">${escapeHtml(x.name || "")}</div><div class="sg-role">${escapeHtml(x.role || "")}</div></div>`).join("");
        break;
      }
      default: e = el("div", "b-gap");
    }
    return e;
  }

  function paginate(s, forOutput) {
    const root = makeRoot(s);
    const mr = $("#measureRoot");
    mr.innerHTML = "";
    mr.appendChild(root);
    buildCoverPage(s, root);
    const tpl = REPORT_TPL[s.tpl];
    const cctx = coverCtx(s);
    let body = null;
    const pages = [];
    const newPage = () => {
      const page = document.createElement("section");
      page.className = "pg pg-inner";
      page.innerHTML = `<header class="pg-head">${tpl.head(cctx)}</header><div class="pg-body"></div><footer class="pg-foot">${tpl.foot(cctx)}</footer>`;
      addFrame(page, s);
      root.appendChild(page);
      pages.push(page);
      body = page.querySelector(".pg-body");
      return body;
    };
    const over = () => body.scrollHeight > body.clientHeight + 1;
    newPage();
    const bodyW = body.clientWidth || (PAGE_W - 148);
    const blocks = flowBlocks(s);

    const moveHeadingAlong = () => {
      // keep a heading with the content that follows it
      const last = body.lastElementChild;
      if (last && last.classList.contains("b-h1") && body.children.length > 1) {
        body.removeChild(last);
        newPage();
        body.appendChild(last);
      } else {
        newPage();
      }
    };

    // split a text block (p / li / q) at the last word that still fits
    const placeText = (b, depth) => {
      depth = depth || 0;
      let e = makeBlock(b, s, bodyW);
      body.appendChild(e);
      if (!over()) return;
      const tokens = b.text.split(/(\s+)/);
      let lo = 0, hi = tokens.length;
      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        e.textContent = tokens.slice(0, mid).join("");
        if (over()) hi = mid - 1; else lo = mid;
      }
      if (lo < 2) {
        // nothing useful fits here: start on a fresh page (taking a lonely heading along)
        body.removeChild(e);
        if (depth < 2 && body.children.length) { moveHeadingAlong(); placeText(b, depth + 1); return; }
        e = makeBlock(b, s, bodyW);
        body.appendChild(e);
        return;
      }
      e.textContent = tokens.slice(0, lo).join("");
      const rest = Object.assign({}, b, { text: tokens.slice(lo).join("").replace(/^\s+/, ""), lead: false, cont: b.t === "li" });
      newPage();
      if (rest.text) placeText(rest, 0);
    };

    const placeTable = (b) => {
      let rows = b.rows.slice(1);
      let first = true;
      while (true) {
        const tb = makeBlock(Object.assign({}, b, { rows: [b.rows[0]] }), s, bodyW);
        const tbody = tb.querySelector("tbody");
        body.appendChild(tb);
        if (over()) { body.removeChild(tb); moveHeadingAlong(); continue; }
        let placed = 0;
        for (const r of rows) {
          const tr = document.createElement("tr");
          tr.innerHTML = r.map((c) => `<td>${escapeHtml(c)}</td>`).join("");
          tbody.appendChild(tr);
          if (over()) { tbody.removeChild(tr); break; }
          placed++;
        }
        if (placed === 0 && rows.length) {
          body.removeChild(tb);
          if (body.children.length === 0) { // a single enormous row: place it anyway
            body.appendChild(tb);
            const tr = document.createElement("tr");
            tr.innerHTML = rows[0].map((c) => `<td>${escapeHtml(c)}</td>`).join("");
            tbody.appendChild(tr);
            rows = rows.slice(1);
            newPage();
          } else {
            first ? moveHeadingAlong() : newPage();
          }
          first = false;
          if (!rows.length) return;
          continue;
        }
        rows = rows.slice(placed);
        if (!rows.length) return;
        newPage();
        first = false;
      }
    };

    blocks.forEach((b) => {
      if (b.t === "break") { if (body.children.length) newPage(); return; }
      if (b.t === "p" || b.t === "li" || b.t === "q") { placeText(b); return; }
      if (b.t === "table") { placeTable(b); return; }
      let e = makeBlock(b, s, bodyW);
      body.appendChild(e);
      if (!over()) return;
      body.removeChild(e);
      if (body.children.length) {
        if (b.t === "h") newPage(); else moveHeadingAlong();
      }
      body.appendChild(e);
      if (over() && b.t === "fig") {
        // shrink an image that is taller than a whole page
        body.removeChild(e);
        const avail = body.clientHeight - (b.cap ? 60 : 30);
        e = makeBlock(Object.assign({}, b, { maxH: Math.max(120, avail) }), s, bodyW);
        body.appendChild(e);
      }
    });
    if (!body.children.length && pages.length > 1) root.removeChild(pages.pop());

    // page numbers and table of contents
    const all = $$(".pg", root);
    const total = all.length;
    all.forEach((pg, i) => {
      $$(".pn-cur", pg).forEach((n) => { n.textContent = i + 1; });
      $$(".pn-tot", pg).forEach((n) => { n.textContent = total; });
    });
    const anchorPage = {};
    all.forEach((pg, i) => $$("[data-anchor]", pg).forEach((h) => { if (!(h.dataset.anchor in anchorPage)) anchorPage[h.dataset.anchor] = i + 1; }));
    $$(".b-toc-row", root).forEach((r) => { $(".tc-p", r).textContent = anchorPage[r.dataset.target] || ""; });

    mr.removeChild(root);
    return root;
  }

  /* ---------------- Preview ---------------- */

  let zoom = "fit";
  let renderTimer = null;
  let thumbTimer = null;
  function scheduleRender() {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(renderNow, 160);
    updateSummaries();
  }
  function renderNow() {
    clearTimeout(renderTimer);
    const holder = $("#sheetHolder");
    const scrollBox = $("#flatView");
    const keep = scrollBox.scrollTop;
    const root = paginate(state);
    $$(".pg", root).forEach((pg, i) => {
      const wrap = document.createElement("div");
      wrap.className = "pg-wrap";
      wrap.style.position = "relative";
      root.insertBefore(wrap, pg);
      wrap.appendChild(pg);
      wrap.insertAdjacentHTML("afterbegin", `<span class="pg-label">${i + 1}</span>`);
    });
    holder.innerHTML = "";
    holder.appendChild(root);
    applyZoom();
    scrollBox.scrollTop = keep;
    highlight();
    updateSummaries();
    clearTimeout(thumbTimer);
    thumbTimer = setTimeout(() => { renderCurrentThumb(); if (openSec === "style") renderTplStrip(); }, 400);
  }

  function stageFitScale() {
    const stage = $("#stage");
    return Math.max(0.2, Math.min((stage.clientWidth - 70) / PAGE_W, (stage.clientHeight - 120) / PAGE_H, 1.5));
  }
  function applyZoom() {
    const root = $("#sheetHolder .rp");
    if (!root) return;
    const s = zoom === "fit" ? stageFitScale() : zoom;
    root.style.transform = `scale(${s})`;
    $("#sheetHolder").style.width = PAGE_W * s + "px";
    $("#sheetHolder").style.height = root.offsetHeight * s + "px";
    $("#zoomVal").textContent = Math.round(s * 100) + "%";
  }
  function setZoom(dir) {
    let s = zoom === "fit" ? stageFitScale() : zoom;
    s = Math.round((s + dir * 0.1) * 10) / 10;
    zoom = Math.max(0.2, Math.min(2, s));
    applyZoom();
  }
  $("#zoomIn").addEventListener("click", () => setZoom(1));
  $("#zoomOut").addEventListener("click", () => setZoom(-1));
  $("#zoomFit").addEventListener("click", () => { zoom = "fit"; applyZoom(); });
  window.addEventListener("resize", applyZoom);

  function highlight() {
    const root = $("#sheetHolder .rp");
    if (!root) return;
    $$(".hl", root).forEach((n) => n.classList.remove("hl"));
    $$(".hl-page", root).forEach((n) => n.classList.remove("hl-page"));
    if (!openSec) return;
    const color = SEC_COLORS[openSec];
    if (openSec === "cover") {
      $$(".pg-cover", root).forEach((p) => { p.classList.add("hl-page"); p.style.setProperty("--hl", color); });
      return;
    }
    $$(`.pg-inner [data-sec="${openSec}"]`, root).forEach((n) => { n.classList.add("hl"); n.style.setProperty("--hl", color); });
  }

  // clicking a part of the report opens its section
  $("#sheetHolder").addEventListener("click", (e) => {
    const part = e.target.closest("[data-sec]");
    if (!part) return;
    const k = part.dataset.sec;
    $("#workspace").classList.remove("collapsed");
    toggleSec(k, true);
    let target = $(`.acc[data-sec="${k}"]`);
    if (part.dataset.axis) {
      const card = $(`#sectionsList .item-card[data-id="${part.dataset.axis}"]`);
      if (card) {
        $$("#sectionsList .item-card").forEach((c) => c.classList.toggle("focus", c === card));
        target = card;
      }
    }
    setTimeout(() => { if (target) target.scrollIntoView({ behavior: "smooth", block: "nearest" }); applyZoom(); }, 300);
  });

  /* ---------------- Accordion & summaries ---------------- */

  let openSec = null;
  function toggleSec(id, force) {
    openSec = (force === undefined ? openSec !== id : force) ? id : null;
    $$(".acc").forEach((a) => a.classList.toggle("open", a.dataset.sec === openSec));
    if (openSec !== "axes") $$("#sectionsList .item-card.focus").forEach((c) => c.classList.remove("focus"));
    if (openSec === "style") renderTplStrip();
    highlight();
  }
  $("#accordion").addEventListener("click", (e) => {
    const head = e.target.closest(".acc-head");
    if (head) { toggleSec(head.closest(".acc").dataset.sec); return; }
    const nx = e.target.closest("[data-next]");
    if (nx) {
      const next = nx.closest(".acc").nextElementSibling;
      if (next && next.classList.contains("acc")) {
        toggleSec(next.dataset.sec, true);
        setTimeout(() => next.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
      } else toggleSec(null);
    }
  });

  function updateSummaries() {
    if (!state) return;
    const set = (k, v) => { const n = $(`[data-sum="${k}"]`); if (n) n.textContent = v; };
    const F = REPORT_FONT[fontId()];
    set("style", [t("tpl_" + state.tpl), F ? F.name : "", state.frameMode !== "none" ? t(state.frameMode === "simple" ? "frameSimple" : "frameCustom") : ""].filter(Boolean).join(" · "));
    set("cover", cut([state.reportTitle, state.organization, formatDateDisplay(state.date)].filter((x) => x && x !== "—").join(" · ")) || t("d_cover"));
    set("summary", cut(state.execSummary) || t("d_summary"));
    const titles = state.sections.map((x) => x.title).filter(Boolean);
    set("axes", titles.length ? cut(titles.join(" · ")) : t("d_axes"));
    set("results", cut(state.recommendations) || t("d_results"));
    const names = state.signers.map((x) => x.name).filter(Boolean);
    set("signs", names.length ? cut(names.join(" · ")) : (state.signatureDataUrl ? t("signature") : t("d_signs")));
    const an = state.appendices.map((x, i) => `${annexLetter(i)}${x.title ? " " + x.title : ""}`);
    set("annex", an.length ? cut(an.join(" · ")) : t("d_annex"));
    $("#sectionCountBadge").textContent = state.sections.length;
  }

  /* ---------------- Templates gallery ---------------- */

  const CATS = ["all", "corporate", "technical", "academic", "finance", "minimal", "creative"];
  let gCat = "all";

  function renderCurrentThumb() {
    const box = $("#currentThumb");
    box.innerHTML = "";
    box.appendChild(miniCover(state, 52));
    $("#currentTplName").textContent = t("tpl_" + state.tpl);
  }
  function renderTplStrip() {
    const strip = $("#tplStrip");
    strip.innerHTML = REPORT_TEMPLATES.map((x) => `<button type="button" class="tpl-chip ${x.id === state.tpl ? "on" : ""}" data-tpl="${x.id}"><span class="t-thumb"></span><span>${escapeHtml(t("tpl_" + x.id))}</span></button>`).join("");
    requestAnimationFrame(() => $$(".tpl-chip", strip).forEach((b) => {
      const th = b.querySelector(".t-thumb");
      th.appendChild(miniCover(state, th.clientWidth || 70, b.dataset.tpl === state.tpl ? null : b.dataset.tpl));
    }));
  }
  function buildGallery() {
    $("#gCats").innerHTML = CATS.map((c) => `<button type="button" class="chip ${c === gCat ? "on" : ""}" data-cat="${c}">${escapeHtml(t("cat_" + c))}</button>`).join("");
    renderGrid();
  }
  function renderGrid() {
    const q = ($("#gSearch").value || "").trim().toLowerCase();
    const list = REPORT_TEMPLATES.filter((x) => (gCat === "all" || x.cat === gCat) &&
      (!q || ["ar", "fr", "en"].some((l) => (I18N[l]["tpl_" + x.id] || "").toLowerCase().includes(q) || (I18N[l]["cat_" + x.cat] || "").toLowerCase().includes(q))));
    const grid = $("#gGrid");
    if (!list.length) { grid.innerHTML = `<div class="g-empty">${escapeHtml(t("no_results"))}</div>`; return; }
    grid.innerHTML = list.map((x) => `<button type="button" class="g-card ${x.id === state.tpl ? "on" : ""}" data-tpl="${x.id}"><div class="g-thumb" style="aspect-ratio:794/1123"></div><div class="g-meta"><b>${escapeHtml(t("tpl_" + x.id))}</b><span>${escapeHtml(t("cat_" + x.cat))}</span></div></button>`).join("");
    requestAnimationFrame(() => $$(".g-card", grid).forEach((card) => {
      const th = card.querySelector(".g-thumb");
      th.appendChild(miniCover(state, th.clientWidth, card.dataset.tpl === state.tpl ? null : card.dataset.tpl));
    }));
  }
  function openGallery() { show($("#gallery")); buildGallery(); }
  function closeGallery() { hide($("#gallery")); }
  $("#btnGallery").addEventListener("click", openGallery);
  $("#gClose").addEventListener("click", closeGallery);
  $("#gSearch").addEventListener("input", renderGrid);
  $("#gallery").addEventListener("click", (e) => {
    if (e.target.id === "gallery") { closeGallery(); return; }
    const c = e.target.closest("[data-cat]");
    if (c) { gCat = c.dataset.cat; $$("#gCats .chip").forEach((x) => x.classList.toggle("on", x === c)); renderGrid(); return; }
    const card = e.target.closest("[data-tpl]");
    if (card) { closeGallery(); setTemplate(card.dataset.tpl, true); }
  });

  /* ---------------- Print / PDF / Word / Clear ---------------- */

  function isReportEmpty() {
    const hasSections = state.sections.some((s) => s.title || s.content);
    return !state.reportTitle && !hasSections && !state.execSummary;
  }
  function outputCopy() {
    const root = paginate(state, true);
    const pr = $("#printRoot");
    pr.innerHTML = "";
    pr.appendChild(root);
    return root;
  }
  function safeName() {
    return ((state.reportTitle || "report").toLowerCase().replace(/[^a-z0-9؀-ۿ]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 40)) || "report";
  }

  $("#printBtn").addEventListener("click", () => {
    outputCopy();
    toast(t("t_print"));
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    fonts.then(() => setTimeout(() => window.print(), 300));
  });
  window.addEventListener("afterprint", () => { $("#printRoot").innerHTML = ""; });

  // html2canvas renders a copy of the page in a hidden frame that reloads the web fonts;
  // drawing before they are ready misplaces Arabic word spacing, so wait for them.
  const waitCloneFonts = function (doc) {
      // load, in the hidden copy, every font face the page itself already uses (all weights, Arabic + Latin subsets)
      const loads = [];
      if (document.fonts && doc.fonts) {
        document.fonts.forEach((f) => {
          if (f.status !== "loaded") return;
          const fam = String(f.family).replace(/^["']|["']$/g, "");
          loads.push(doc.fonts.load(`${f.style} ${f.weight} 16px "${fam}"`, "ابتث abc 123").catch(() => {}));
        });
      }
      doc.body && doc.body.getBoundingClientRect();
      const wait = Promise.all(loads).then(() => (doc.fonts && doc.fonts.ready ? doc.fonts.ready : null));
      // never block the export on a slow network: give up waiting after 4 s
      return Promise.race([wait, new Promise((r) => setTimeout(r, 4000))]).then(() => new Promise((r) => setTimeout(r, 80)));
    };

  async function runGeneratePdf() {
    if (typeof html2canvas === "undefined" || !window.jspdf) { toast(t("t_pdf_err")); return; }
    const btn = $("#generatePdfBtn");
    btn.disabled = true;
    toast(t("t_pdf"));
    try {
      if (document.fonts) await document.fonts.ready;
      const root = outputCopy();
      await new Promise((r) => setTimeout(r, 80));
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pages = $$(".pg", root);
      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], { scale: 2, backgroundColor: "#ffffff", useCORS: true, logging: false, width: PAGE_W, height: PAGE_H, windowWidth: PAGE_W, scrollX: 0, scrollY: 0, onclone: waitCloneFonts });
        if (i > 0) pdf.addPage();
        pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 210, 297);
      }
      pdf.save(`${safeName()}.pdf`);
      toast(t("t_pdf_ok"));
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast(t("t_pdf_err"));
    } finally {
      $("#printRoot").innerHTML = "";
      btn.disabled = false;
    }
  }

  async function runWord() {
    toast(t("t_word"));
    try {
      const s = state;
      const tpl = REPORT_TPL[s.tpl];
      const blob = await buildReportDocx({
        lang: currentLang, rtl: I18N[currentLang].dir === "rtl",
        color: s.color || tpl.color, font: REPORT_FONT[s.font || tpl.font] || REPORT_FONTS[0],
        title: s.reportTitle || t("untitledReport"), org: s.organization, by: s.preparedBy, for: s.preparedFor,
        date: s.date ? formatDateDisplay(s.date) : "", ref: s.reference, logo: s.logoDataUrl,
        summary: parseText(s.execSummary),
        sections: s.sections.filter((x) => x.title || x.content || x.image || x.table).map((x) => ({ title: x.title || t("untitledSection"), blocks: parseText(x.content), image: x.image, caption: x.caption, table: x.table })),
        results: parseText(s.recommendations),
        signatures: [
          ...(s.signatureDataUrl ? [{ name: s.preparedBy || "", role: s.organization || "", sig: s.signatureDataUrl }] : []),
          ...s.signers.filter((x) => x.name || x.role || x.sig),
        ],
        appendices: s.appendices.filter((x) => x.title || x.content || x.image).map((x) => ({ label: `${t("appendixLabel")} ${annexLetter(s.appendices.indexOf(x))}`, title: x.title, blocks: parseText(x.content), image: x.image })),
        L: {
          preparedBy: t("preparedBy"), preparedFor: t("preparedFor"), date: t("reportDate"), reference: t("reference"),
          toc: t("tableOfContents"), summary: t("execSummary"), results: t("recommendations"), signatures: t("signaturesHeading"), page: t("page"),
        },
      });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${safeName()}.docx`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
      toast(t("t_word_ok"));
    } catch (err) {
      console.error("Word export failed:", err);
      toast(t("t_word_err"));
    }
  }

  let pendingExport = null;
  function guardedExport(fn) {
    if (isReportEmpty()) { pendingExport = fn; show($("#pdfWarnOverlay")); return; }
    fn();
  }
  $("#generatePdfBtn").addEventListener("click", () => guardedExport(runGeneratePdf));
  $("#wordBtn").addEventListener("click", () => guardedExport(runWord));
  $("#pdfWarnCancel").addEventListener("click", () => { hide($("#pdfWarnOverlay")); pendingExport = null; });
  $("#pdfWarnOk").addEventListener("click", () => { hide($("#pdfWarnOverlay")); const fn = pendingExport; pendingExport = null; if (fn) fn(); });

  $("#clearBtn").addEventListener("click", () => show($("#confirmOverlay")));
  $("#confirmCancel").addEventListener("click", () => hide($("#confirmOverlay")));
  $("#confirmOk").addEventListener("click", () => {
    hide($("#confirmOverlay"));
    const keep = { id: state.id, localId: state.localId, reference: state.reference, tpl: state.tpl, color: state.color, font: state.font };
    loadReportIntoEditor(Object.assign(emptyState(), keep));
    toast(t("t_cleared"));
  });
  [["#confirmOverlay"], ["#pdfWarnOverlay"], ["#deleteReportOverlay"]].forEach(([id]) => {
    $(id).addEventListener("click", (e) => { if (e.target === $(id)) hide($(id)); });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeGallery(); closeMine(); closeLogin();
    ["#confirmOverlay", "#pdfWarnOverlay", "#deleteReportOverlay"].forEach((id) => hide($(id)));
  });

  /* ---------------- Toolbar ---------------- */

  $("#btnSave").addEventListener("click", saveToAccount);
  $("#btnFullscreen").addEventListener("click", () => {
    if (!document.fullscreenElement) (document.documentElement.requestFullscreen || function () {}).call(document.documentElement);
    else if (document.exitFullscreen) document.exitFullscreen();
  });
  $("#panelToggle").addEventListener("click", () => {
    $("#workspace").classList.toggle("collapsed");
    setTimeout(applyZoom, 320);
  });

  /* ---------------- Init ---------------- */

  (function init() {
    let draft = null;
    try { draft = JSON.parse(localStorage.getItem(DRAFT_KEY)); } catch (e) { /* ignore */ }
    let siteLang = null;
    try { siteLang = localStorage.getItem("site_lang"); } catch (e) { /* ignore */ }
    currentLang = (draft && I18N[draft.lang] && draft.lang) || (I18N[siteLang] ? siteLang : "ar");
    applyLanguage(currentLang);
    loadReportIntoEditor(draft ? draft : demoState());
    toggleSec(null); // every section starts collapsed
    if (document.fonts) document.fonts.ready.then(() => { renderNow(); });
  })();
})();
