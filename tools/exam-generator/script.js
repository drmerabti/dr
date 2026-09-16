(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  let currentLang = "ar";
  function t(key) { return (I18N[currentLang] && I18N[currentLang][key]) || key; }

  /* ---------------- State ---------------- */
  const header = {
    showRepublic: true,
    school: "",
    year: "",
    stage: "ثانوي",
    section: "",
    subject: "",
    examType: "اختبار فصلي",
    duration: "",
    teacher: "",
    showInstructions: true,
    instructions: "",
  };

  let exercises = []; // { id, type, points, ...typeSpecificFields }
  let exIdCounter = 0;
  function nextExId() { return "ex-" + (++exIdCounter); }

  let selectedType = "mcq";

  /* ---------------- Academic year options ---------------- */
  function populateYearOptions() {
    const sel = $("#fYear");
    const now = new Date();
    const startY = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1;
    sel.innerHTML = "";
    for (let i = 0; i < 5; i++) {
      const y1 = startY + i, y2 = y1 + 1;
      const opt = document.createElement("option");
      opt.value = `${y1}/${y2}`;
      opt.textContent = `${y1}/${y2}`;
      sel.appendChild(opt);
    }
    header.year = sel.value;
  }

  /* ---------------- Accordion ---------------- */
  $$(".card-head").forEach((head) => {
    head.addEventListener("click", () => {
      const card = head.parentElement;
      card.classList.toggle("open");
      head.nextElementSibling.classList.toggle("open");
    });
  });

  /* ---------------- Header field wiring ---------------- */
  function bindHeaderField(id, key, onchange) {
    const el = $(id);
    el.addEventListener("input", () => {
      header[key] = el.value;
      renderPaperHeader();
      if (onchange) onchange();
    });
  }
  bindHeaderField("#fSchool", "school");
  bindHeaderField("#fSection", "section");
  bindHeaderField("#fSubject", "subject");
  bindHeaderField("#fDuration", "duration");
  bindHeaderField("#fTeacher", "teacher");
  bindHeaderField("#fInstructions", "instructions");

  $("#fYear").addEventListener("change", () => { header.year = $("#fYear").value; renderPaperHeader(); });
  $("#fStage").addEventListener("change", () => { header.stage = $("#fStage").value; renderPaperHeader(); });
  $("#fExamType").addEventListener("change", () => { header.examType = $("#fExamType").value; renderPaperHeader(); });

  $("#toggleRepublic").addEventListener("click", function () {
    this.classList.toggle("on");
    header.showRepublic = this.classList.contains("on");
    renderPaperHeader();
  });
  $("#toggleInstructions").addEventListener("click", function () {
    this.classList.toggle("on");
    header.showInstructions = this.classList.contains("on");
    renderPaperHeader();
  });
  $("#toggleAutoGrade").addEventListener("click", function () {
    this.classList.toggle("on");
    renderTotal();
  });

  function renderPaperHeader() {
    $("#pvRepublic").classList.toggle("hidden-el", !header.showRepublic);
    $("#pvYear").textContent = header.year || "—";
    $("#pvSchoolLine").textContent = header.school ? header.school : "....................";
    $("#pvExamType").textContent = header.examType || "—";
    $("#pvSubjectLine").textContent = `${t("subject")}: ${header.subject || "—"}${header.section ? " — " + header.section : ""}`;
    $("#pvDuration").textContent = header.duration || "—";
    $("#pvTeacher").textContent = header.teacher || "—";

    const instrEl = $("#pvInstructions");
    if (header.showInstructions && header.instructions.trim()) {
      instrEl.textContent = header.instructions;
      instrEl.classList.remove("hidden-el");
    } else {
      instrEl.classList.add("hidden-el");
    }
  }

  /* ---------------- Exercise type selection ---------------- */
  $$(".ex-type-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedType = btn.dataset.type;
      $$(".ex-type-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderExerciseFormFields();
    });
  });

  /* ---------------- Dynamic "add exercise" form fields per type ---------------- */
  function renderExerciseFormFields() {
    const wrap = $("#exerciseFormFields");
    let html = "";
    if (selectedType === "mcq") {
      html = `
        <div><label>${t("questionLabel")}</label><textarea id="fldQuestion" rows="2"></textarea></div>
        <div id="mcqOptionsWrap">
          <label>${t("mcqOption")} 1</label><div class="mcq-opt-row"><input type="text" class="mcq-opt-input"></div>
          <label>${t("mcqOption")} 2</label><div class="mcq-opt-row"><input type="text" class="mcq-opt-input"></div>
        </div>
        <button type="button" class="btn-secondary-sm" id="addMcqOptBtn">${t("addOption")}</button>
      `;
    } else if (selectedType === "tf") {
      html = `<div><label>${t("statementLabel")}</label><textarea id="fldQuestion" rows="2"></textarea></div>`;
    } else if (selectedType === "blank") {
      html = `<div><label>${t("blankTextLabel")}</label><textarea id="fldQuestion" rows="2" placeholder="مثال: عاصمة الجزائر هي ___"></textarea></div>`;
    } else if (selectedType === "essay") {
      html = `<div><label>${t("questionLabel")}</label><textarea id="fldQuestion" rows="2"></textarea></div>`;
    } else if (selectedType === "image") {
      html = `<div><label>${t("questionLabel")}</label><textarea id="fldQuestion" rows="2"></textarea></div>`;
    } else if (selectedType === "table") {
      html = `
        <div><label>${t("questionLabel")}</label><textarea id="fldQuestion" rows="2"></textarea></div>
        <div id="tableDimsWrap"></div>
      `;
    } else if (selectedType === "reading") {
      html = `
        <div><label>${t("passageLabel")}</label><textarea id="fldPassage" rows="4"></textarea></div>
        <div><label>${t("questionLabel")}</label><textarea id="fldQuestion" rows="2"></textarea></div>
      `;
    } else if (selectedType === "poetry") {
      html = `<div id="poetryLinesWrap">
        <label>${t("poetryLine")} 1</label>
        <div class="mcq-opt-row"><input type="text" class="poetry-sadr" placeholder="${t("sadr")}"><input type="text" class="poetry-ajz" placeholder="${t("ajz")}"></div>
      </div>
      <button type="button" class="btn-secondary-sm" id="addPoetryLineBtn">${t("addLine")}</button>`;
    }
    wrap.innerHTML = html;

    if (selectedType === "mcq") {
      $("#addMcqOptBtn").addEventListener("click", () => {
        const n = $$(".mcq-opt-input").length + 1;
        const div = document.createElement("div");
        div.innerHTML = `<label>${t("mcqOption")} ${n}</label><div class="mcq-opt-row"><input type="text" class="mcq-opt-input"><button type="button" class="rm-opt">×</button></div>`;
        $("#mcqOptionsWrap").appendChild(div);
        div.querySelector(".rm-opt").addEventListener("click", () => div.remove());
      });
    }
    if (selectedType === "table") {
      renderTableDims(4, 3);
    }
    if (selectedType === "poetry") {
      $("#addPoetryLineBtn").addEventListener("click", () => {
        const n = $$(".poetry-sadr").length + 1;
        const div = document.createElement("div");
        div.innerHTML = `<label>${t("poetryLine")} ${n}</label><div class="mcq-opt-row"><input type="text" class="poetry-sadr" placeholder="${t("sadr")}"><input type="text" class="poetry-ajz" placeholder="${t("ajz")}"></div>`;
        $("#poetryLinesWrap").appendChild(div);
      });
    }
  }

  function renderTableDims(cols, rows) {
    const wrap = $("#tableDimsWrap");
    if (!wrap) return;
    wrap.innerHTML = `
      <div class="mcq-opt-row">
        <label style="margin:0;">${t("columnsLabel")}: <span id="colsVal">${cols}</span></label>
        <button type="button" class="btn-secondary-sm" id="colsMinus">−</button>
        <button type="button" class="btn-secondary-sm" id="colsPlus">+</button>
      </div>
      <div class="mcq-opt-row">
        <label style="margin:0;">${t("rowsLabel")}: <span id="rowsVal">${rows}</span></label>
        <button type="button" class="btn-secondary-sm" id="rowsMinus">−</button>
        <button type="button" class="btn-secondary-sm" id="rowsPlus">+</button>
      </div>
    `;
    wrap.dataset.cols = cols;
    wrap.dataset.rows = rows;
    $("#colsPlus").addEventListener("click", () => { renderTableDims(Math.min(8, +wrap.dataset.cols + 1), +wrap.dataset.rows); });
    $("#colsMinus").addEventListener("click", () => { renderTableDims(Math.max(2, +wrap.dataset.cols - 1), +wrap.dataset.rows); });
    $("#rowsPlus").addEventListener("click", () => { renderTableDims(+wrap.dataset.cols, Math.min(10, +wrap.dataset.rows + 1)); });
    $("#rowsMinus").addEventListener("click", () => { renderTableDims(+wrap.dataset.cols, Math.max(1, +wrap.dataset.rows - 1)); });
  }

  /* ---------------- Add exercise ---------------- */
  $("#addExerciseBtn").addEventListener("click", () => {
    const ex = { id: nextExId(), type: selectedType, points: 5 };
    const qEl = $("#fldQuestion");
    ex.question = qEl ? qEl.value : "";

    if (selectedType === "mcq") {
      ex.options = $$(".mcq-opt-input").map((i) => i.value).filter((v) => v.trim());
    } else if (selectedType === "essay") {
      ex.lines = parseInt($("#essayLinesSelect").value, 10);
    } else if (selectedType === "image") {
      ex.imageDataUrl = null;
    } else if (selectedType === "table") {
      const wrap = $("#tableDimsWrap");
      ex.cols = wrap ? +wrap.dataset.cols : 4;
      ex.rows = wrap ? +wrap.dataset.rows : 3;
      ex.subtype = $("#tableSubSelect").value;
      ex.headers = Array.from({ length: ex.cols }, () => "");
      ex.cells = Array.from({ length: ex.rows }, () => Array.from({ length: ex.cols }, () => ""));
      if (ex.subtype === "variation") {
        ex.varCols = 3;
        ex.xVals = ["-∞", "", "+∞"];
        ex.signs = ["+", "-"];
        ex.fVals = ["", "", ""];
        ex.arrows = ["up", "down"];
      }
    } else if (selectedType === "reading") {
      ex.passage = $("#fldPassage") ? $("#fldPassage").value : "";
    } else if (selectedType === "poetry") {
      ex.lines = $$(".poetry-sadr").map((s, i) => ({
        sadr: s.value,
        ajz: $$(".poetry-ajz")[i] ? $$(".poetry-ajz")[i].value : "",
      }));
    }

    exercises.push(ex);
    renderExercises();
    renderExerciseFormFields(); // reset the form for the next one
  });

  /* ---------------- Render exercises on paper ---------------- */
  const ordinals = ["الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس", "السابع", "الثامن", "التاسع", "العاشر"];

  function renderExercises() {
    const container = $("#exercisesContainer");
    if (exercises.length === 0) {
      container.innerHTML = `<div class="empty-state">${t("empty")}</div>`;
      renderTotal();
      return;
    }
    container.innerHTML = "";
    exercises.forEach((ex, idx) => {
      const wrap = document.createElement("div");
      wrap.className = "exercise";
      wrap.dataset.id = ex.id;
      wrap.innerHTML = `
        <div class="exercise-head">
          <span class="num">${t("exercise")} ${ordinals[idx] || idx + 1}</span>
          <div class="head-actions">
            <div class="pts-inline">${t("points")}: <input type="text" class="pts-input" value="${ex.points}"></div>
            <button type="button" class="exercise-del" title="Delete">✕</button>
          </div>
        </div>
        <div class="exercise-body">${renderExerciseBody(ex)}</div>
      `;
      container.appendChild(wrap);

      wrap.querySelector(".pts-input").addEventListener("input", (e) => {
        const v = parseFloat(e.target.value) || 0;
        ex.points = v;
        renderTotal();
      });
      wrap.querySelector(".exercise-del").addEventListener("click", () => {
        exercises = exercises.filter((x) => x.id !== ex.id);
        renderExercises();
      });

      wireExerciseBodyInteractions(wrap, ex);
    });
    renderTotal();
  }

  function renderVariationTable(ex) {
    if (!ex.varCols) ex.varCols = 3;
    if (!ex.xVals) ex.xVals = ["-∞", "", "+∞"];
    if (!ex.signs) ex.signs = ["+", "-"];
    if (!ex.fVals) ex.fVals = ["", "", ""];
    if (!ex.arrows) ex.arrows = ["up", "down"];

    const n = ex.varCols;
    // Every row must have the SAME number of cells for the columns to line up in the
    // table grid (label + one cell per x-value + one narrow "gap" cell between each pair).
    let xRow = `<tr><th>x</th>`;
    let signRow = `<tr><th>f'(x)</th>`;
    let fRow = `<tr><th>f(x)</th>`;
    for (let i = 0; i < n; i++) {
      xRow += `<td><input type="text" class="var-x-input" data-i="${i}" value="${escapeHtml(ex.xVals[i] || "")}"></td>`;
      fRow += `<td><input type="text" class="var-f-input" data-i="${i}" value="${escapeHtml(ex.fVals[i] || "")}"></td>`;
      signRow += `<td class="var-gap-cell"></td>`;
      if (i < n - 1) {
        xRow += `<td class="var-gap-cell"></td>`;
        signRow += `<td><button type="button" class="var-sign-btn" data-i="${i}">${ex.signs[i] || "+"}</button></td>`;
        const arrow = ex.arrows[i] === "down" ? "↘" : "↗";
        fRow += `<td class="var-arrow-cell"><button type="button" class="var-arrow-btn" data-i="${i}">${arrow}</button></td>`;
      }
    }
    xRow += "</tr>"; signRow += "</tr>"; fRow += "</tr>";

    return `<table class="exam-table variation-table"><tbody>${xRow}${signRow}${fRow}</tbody></table>`;
  }

  function renderExerciseBody(ex) {
    if (ex.type === "mcq") {
      return `${escapeHtml(ex.question)}` +
        ex.options.map((o) => `<div class="mcq-opt"><span class="box"></span> ${escapeHtml(o)}</div>`).join("");
    }
    if (ex.type === "tf") {
      return `<div class="mcq-opt">${escapeHtml(ex.question)} <span style="margin-inline-start:14px;">☐ صح &nbsp; ☐ خطأ</span></div>`;
    }
    if (ex.type === "blank") {
      return escapeHtml(ex.question).replace(/___+/g, '<span style="display:inline-block; min-width:80px; border-bottom:1.3px solid var(--ink);">&nbsp;</span>');
    }
    if (ex.type === "essay") {
      const lines = ex.lines > 0 ? `<div class="answer-lines">${Array.from({ length: ex.lines }).map(() => `<div class="ln"></div>`).join("")}</div>` : "";
      return `${escapeHtml(ex.question)}${lines}`;
    }
    if (ex.type === "image") {
      const imgContent = ex.imageDataUrl
        ? `<img src="${ex.imageDataUrl}"><span class="del" data-action="del-img">×</span>`
        : t("uploadImage");
      return `${escapeHtml(ex.question)}<div class="img-slot" data-action="upload-img" style="height:150px;">${imgContent}</div>`;
    }
    if (ex.type === "table" && ex.subtype === "variation") {
      return `${escapeHtml(ex.question)}${renderVariationTable(ex)}`;
    }
    if (ex.type === "table") {
      let thead = "<tr>";
      for (let c = 0; c < ex.cols; c++) {
        thead += `<th><input type="text" class="th-input" data-col="${c}" value="${escapeHtml(ex.headers[c] || "")}"></th>`;
      }
      thead += "</tr>";
      let tbody = "";
      for (let r = 0; r < ex.rows; r++) {
        tbody += "<tr>" + Array.from({ length: ex.cols }).map((_, c) =>
          `<td><input type="text" class="td-input" data-row="${r}" data-col="${c}" value="${escapeHtml((ex.cells && ex.cells[r] && ex.cells[r][c]) || "")}"></td>`
        ).join("") + "</tr>";
      }
      return `${escapeHtml(ex.question)}<table class="exam-table"><thead>${thead}</thead><tbody>${tbody}</tbody></table>`;
    }
    if (ex.type === "reading") {
      return `<div class="reading-passage">${escapeHtml(ex.passage)}</div>${escapeHtml(ex.question)}`;
    }
    if (ex.type === "poetry") {
      return ex.lines.map((l) => `<div class="poem-line"><span>${escapeHtml(l.sadr)}</span><span>${escapeHtml(l.ajz)}</span></div>`).join("");
    }
    return "";
  }

  function wireExerciseBodyInteractions(wrap, ex) {
    if (ex.type === "image") {
      const slot = wrap.querySelector('[data-action="upload-img"]');
      if (slot) {
        slot.addEventListener("click", (e) => {
          if (e.target.dataset.action === "del-img") return;
          pendingImageExerciseId = ex.id;
          $("#imageFileInput").click();
        });
      }
      const delBtn = wrap.querySelector('[data-action="del-img"]');
      if (delBtn) {
        delBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          ex.imageDataUrl = null;
          renderExercises();
        });
      }
    }
    if (ex.type === "table" && ex.subtype !== "variation") {
      wrap.querySelectorAll(".th-input").forEach((inp) => {
        inp.addEventListener("input", () => {
          ex.headers[+inp.dataset.col] = inp.value;
        });
      });
      wrap.querySelectorAll(".td-input").forEach((inp) => {
        inp.addEventListener("input", () => {
          ex.cells[+inp.dataset.row][+inp.dataset.col] = inp.value;
        });
      });
    }
    if (ex.type === "table" && ex.subtype === "variation") {
      wrap.querySelectorAll(".var-x-input").forEach((inp) => {
        inp.addEventListener("input", () => { ex.xVals[+inp.dataset.i] = inp.value; });
      });
      wrap.querySelectorAll(".var-f-input").forEach((inp) => {
        inp.addEventListener("input", () => { ex.fVals[+inp.dataset.i] = inp.value; });
      });
      wrap.querySelectorAll(".var-sign-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const i = +btn.dataset.i;
          const order = ["+", "-", "0"];
          const next = order[(order.indexOf(ex.signs[i]) + 1) % order.length];
          ex.signs[i] = next;
          renderExercises();
        });
      });
      wrap.querySelectorAll(".var-arrow-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const i = +btn.dataset.i;
          ex.arrows[i] = ex.arrows[i] === "down" ? "up" : "down";
          renderExercises();
        });
      });
    }
  }

  let pendingImageExerciseId = null;
  $("#imageFileInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file || !pendingImageExerciseId) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ex = exercises.find((x) => x.id === pendingImageExerciseId);
      if (ex) { ex.imageDataUrl = reader.result; renderExercises(); }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  });

  function renderTotal() {
    const totalEl = $("#pvTotal");
    const autoGrade = $("#toggleAutoGrade").classList.contains("on");
    if (!autoGrade || exercises.length === 0) {
      totalEl.classList.add("hidden-el");
      return;
    }
    const sum = exercises.reduce((s, e) => s + (parseFloat(e.points) || 0), 0);
    totalEl.textContent = `${t("total")}: ${sum}`;
    totalEl.classList.remove("hidden-el");
  }

  /* ---------------- Language switching ---------------- */
  function applyLanguage(lang) {
    currentLang = lang;
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", I18N[lang].dir);
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      if (I18N[lang][key] !== undefined) node.textContent = I18N[lang][key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      const key = node.getAttribute("data-i18n-placeholder");
      if (I18N[lang][key] !== undefined) node.setAttribute("placeholder", I18N[lang][key]);
    });
    $$(".lang-btn").forEach((b) => b.classList.toggle("active", b.dataset.lang === lang));
    renderPaperHeader();
    renderExerciseFormFields();
    renderExercises();
  }
  $$(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => applyLanguage(btn.dataset.lang));
  });

  /* ---------------- Save (local draft) ---------------- */
  function saveDraft() {
    try {
      localStorage.setItem("examTool:draft", JSON.stringify({ header, exercises }));
    } catch (e) { /* ignore */ }
  }
  function loadDraft() {
    try {
      const raw = localStorage.getItem("examTool:draft");
      if (!raw) return false;
      const data = JSON.parse(raw);
      Object.assign(header, data.header || {});
      exercises = data.exercises || [];
      exIdCounter = exercises.reduce((m, e) => Math.max(m, parseInt((e.id || "ex-0").split("-")[1], 10) || 0), 0);
      return true;
    } catch (e) { return false; }
  }
  $("#saveBtn").addEventListener("click", () => {
    saveDraft();
    const badge = document.createElement("div");
    badge.textContent = t("savedBadge");
    badge.style.cssText = "position:fixed;bottom:24px;left:24px;background:var(--accent-dark);color:#fff;padding:10px 18px;border-radius:999px;font-weight:700;font-size:.85rem;z-index:999;";
    document.body.appendChild(badge);
    setTimeout(() => badge.remove(), 1600);
  });

  /* ---------------- PDF export ---------------- */
  $("#exportPdfBtn").addEventListener("click", async () => {
    const btn = $("#exportPdfBtn");
    const originalHtml = btn.innerHTML;
    btn.innerHTML = `<span>${t("exportingPdf")}</span>`;
    btn.disabled = true;
    try {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      const sheet = $("#paperSheet");
      const canvas = await html2canvas(sheet, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let heightLeft = imgHeight, position = 0;
      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save("exam.pdf");
    } catch (e) {
      console.error("PDF export failed:", e);
      alert("PDF export failed. Please try again.");
    }
    btn.innerHTML = originalHtml;
    btn.disabled = false;
  });

  /* ---------------- Init ---------------- */
  function init() {
    populateYearOptions();
    loadDraft();

    $("#fSchool").value = header.school;
    $("#fSection").value = header.section;
    $("#fSubject").value = header.subject;
    $("#fDuration").value = header.duration;
    $("#fTeacher").value = header.teacher;
    $("#fInstructions").value = header.instructions;
    if (header.year) $("#fYear").value = header.year;
    $("#fStage").value = header.stage;
    $("#fExamType").value = header.examType;
    $("#toggleRepublic").classList.toggle("on", header.showRepublic);
    $("#toggleInstructions").classList.toggle("on", header.showInstructions);

    applyLanguage("ar");
    renderExerciseFormFields();
    renderExercises();
  }

  init();
})();
