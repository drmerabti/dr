// ============================================================
// script.js — Professional Report Generator
// ============================================================

(function () {
  "use strict";

  /* ---------------- i18n ---------------- */

  const I18N = {
    en: {
      dir: "ltr",
      appTitle: "Report Generator",
      reportEditor: "Report Editor",
      chooseTemplate: "Start from a Template",
      tplGeneral: "General Work Report",
      tplIncident: "Incident Report",
      tplPerformance: "Periodic Performance Report",
      tplMinutes: "Meeting Minutes",
      coverInfo: "Cover Information",
      uploadLogo: "Logo / Letterhead",
      uploadLogoText: "Upload Logo",
      reportDate: "Date",
      organization: "Organization",
      organizationPlaceholder: "Organization name",
      reportTitle: "Report Title",
      reportTitlePlaceholder: "Report title",
      preparedBy: "Prepared By",
      preparedByPlaceholder: "Your name",
      preparedFor: "Prepared For",
      preparedForPlaceholder: "Recipient (optional)",
      execSummary: "Executive Summary",
      execSummaryPlaceholder: "A short overview of the report's purpose and key findings...",
      sections: "Report Sections",
      addSection: "Add Section",
      sectionTitlePlaceholder: "Section title",
      sectionContentPlaceholder: "Section content... (start a line with \"- \" for a bullet point)",
      recommendations: "Conclusion & Recommendations",
      recommendationsPlaceholder: "Final conclusions and recommended next steps...",
      uploadSignature: "Signature / Approval",
      uploadSignatureText: "Upload Signature",
      signature: "Signature",
      generatePdf: "Generate PDF",
      print: "Print",
      clear: "Clear",
      livePreview: "Live Report Preview",
      companyLogo: "ORGANIZATION",
      untitledReport: "Untitled Report",
      tableOfContents: "Table of Contents",
      confirmClear: "Clear the whole report? This cannot be undone.",
      cancel: "Cancel",
      confirmYes: "Clear",
      emptyReportWarning: "This report has no title or sections yet. Generate the PDF anyway?",
      continueAnyway: "Generate Anyway",
      moveUp: "Move up",
      moveDown: "Move down",
      deleteSection: "Delete section",
      noSectionsYet: "No sections yet — add one below or pick a template above.",
      savedNotice: "Draft saved",
      untitledSection: "Untitled section",
    },
    fr: {
      dir: "ltr",
      appTitle: "Générateur de Rapports",
      reportEditor: "Éditeur de Rapport",
      chooseTemplate: "Démarrer avec un Modèle",
      tplGeneral: "Rapport de Travail Général",
      tplIncident: "Rapport d'Incident",
      tplPerformance: "Rapport de Performance Périodique",
      tplMinutes: "Compte Rendu de Réunion",
      coverInfo: "Informations de Couverture",
      uploadLogo: "Logo / En-tête",
      uploadLogoText: "Importer le Logo",
      reportDate: "Date",
      organization: "Organisation",
      organizationPlaceholder: "Nom de l'organisation",
      reportTitle: "Titre du Rapport",
      reportTitlePlaceholder: "Titre du rapport",
      preparedBy: "Préparé Par",
      preparedByPlaceholder: "Votre nom",
      preparedFor: "Préparé Pour",
      preparedForPlaceholder: "Destinataire (optionnel)",
      execSummary: "Résumé Exécutif",
      execSummaryPlaceholder: "Un bref aperçu de l'objectif du rapport et des principales conclusions...",
      sections: "Sections du Rapport",
      addSection: "Ajouter une Section",
      sectionTitlePlaceholder: "Titre de la section",
      sectionContentPlaceholder: "Contenu de la section... (commencez une ligne par « - » pour une puce)",
      recommendations: "Conclusion et Recommandations",
      recommendationsPlaceholder: "Conclusions finales et prochaines étapes recommandées...",
      uploadSignature: "Signature / Approbation",
      uploadSignatureText: "Importer la Signature",
      signature: "Signature",
      generatePdf: "Générer le PDF",
      print: "Imprimer",
      clear: "Réinitialiser",
      livePreview: "Aperçu du Rapport en Direct",
      companyLogo: "ORGANISATION",
      untitledReport: "Rapport Sans Titre",
      tableOfContents: "Table des Matières",
      confirmClear: "Réinitialiser tout le rapport ? Cette action est irréversible.",
      cancel: "Annuler",
      confirmYes: "Réinitialiser",
      emptyReportWarning: "Ce rapport n'a ni titre ni sections. Générer le PDF quand même ?",
      continueAnyway: "Générer Quand Même",
      moveUp: "Monter",
      moveDown: "Descendre",
      deleteSection: "Supprimer la section",
      noSectionsYet: "Aucune section pour l'instant — ajoutez-en une ci-dessous ou choisissez un modèle.",
      savedNotice: "Brouillon enregistré",
      untitledSection: "Section sans titre",
    },
    ar: {
      dir: "rtl",
      appTitle: "مولّد التقارير",
      reportEditor: "محرر التقرير",
      chooseTemplate: "ابدأ من قالب",
      tplGeneral: "تقرير عمل عام",
      tplIncident: "تقرير حادثة",
      tplPerformance: "تقرير أداء دوري",
      tplMinutes: "محضر اجتماع",
      coverInfo: "معلومات الغلاف",
      uploadLogo: "الشعار / الترويسة",
      uploadLogoText: "رفع الشعار",
      reportDate: "التاريخ",
      organization: "الجهة",
      organizationPlaceholder: "اسم الجهة",
      reportTitle: "عنوان التقرير",
      reportTitlePlaceholder: "عنوان التقرير",
      preparedBy: "إعداد",
      preparedByPlaceholder: "اسمك",
      preparedFor: "موجّه إلى",
      preparedForPlaceholder: "الجهة المستلمة (اختياري)",
      execSummary: "الملخص التنفيذي",
      execSummaryPlaceholder: "نظرة عامة موجزة عن هدف التقرير وأهم النتائج...",
      sections: "أقسام التقرير",
      addSection: "إضافة قسم",
      sectionTitlePlaceholder: "عنوان القسم",
      sectionContentPlaceholder: "محتوى القسم... (ابدأ السطر بـ «- » لإنشاء نقطة)",
      recommendations: "الخاتمة والتوصيات",
      recommendationsPlaceholder: "الاستنتاجات النهائية والخطوات التالية الموصى بها...",
      uploadSignature: "التوقيع / الاعتماد",
      uploadSignatureText: "رفع التوقيع",
      signature: "التوقيع",
      generatePdf: "توليد PDF",
      print: "طباعة",
      clear: "مسح",
      livePreview: "معاينة مباشرة للتقرير",
      companyLogo: "الجهة",
      untitledReport: "تقرير بدون عنوان",
      tableOfContents: "فهرس المحتويات",
      confirmClear: "هل تريد مسح التقرير بالكامل؟ لا يمكن التراجع عن هذا الإجراء.",
      cancel: "إلغاء",
      confirmYes: "مسح",
      emptyReportWarning: "هذا التقرير لا يحتوي على عنوان أو أقسام بعد. هل تريد توليد PDF على أي حال؟",
      continueAnyway: "توليد على أي حال",
      moveUp: "تحريك للأعلى",
      moveDown: "تحريك للأسفل",
      deleteSection: "حذف القسم",
      noSectionsYet: "لا توجد أقسام بعد — أضف واحدًا أدناه أو اختر قالبًا أعلاه.",
      savedNotice: "تم حفظ المسودة",
      untitledSection: "قسم بدون عنوان",
    },
  };

  let currentLang = "en";
  function t(key) {
    return (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;
  }

  /* ---------------- Templates ---------------- */

  const TEMPLATES = {
    general: {
      en: [
        { title: "Background", content: "" },
        { title: "Objectives", content: "" },
        { title: "Work Completed", content: "" },
        { title: "Challenges", content: "" },
      ],
      fr: [
        { title: "Contexte", content: "" },
        { title: "Objectifs", content: "" },
        { title: "Travail Réalisé", content: "" },
        { title: "Difficultés Rencontrées", content: "" },
      ],
      ar: [
        { title: "الخلفية", content: "" },
        { title: "الأهداف", content: "" },
        { title: "الأعمال المنجزة", content: "" },
        { title: "الصعوبات", content: "" },
      ],
    },
    incident: {
      en: [
        { title: "Date, Time & Location", content: "" },
        { title: "Description of Incident", content: "" },
        { title: "People Involved", content: "" },
        { title: "Immediate Actions Taken", content: "" },
        { title: "Root Cause", content: "" },
      ],
      fr: [
        { title: "Date, Heure et Lieu", content: "" },
        { title: "Description de l'Incident", content: "" },
        { title: "Personnes Impliquées", content: "" },
        { title: "Actions Immédiates Prises", content: "" },
        { title: "Cause Racine", content: "" },
      ],
      ar: [
        { title: "التاريخ والوقت والمكان", content: "" },
        { title: "وصف الحادثة", content: "" },
        { title: "الأشخاص المعنيون", content: "" },
        { title: "الإجراءات الفورية المتخذة", content: "" },
        { title: "السبب الجذري", content: "" },
      ],
    },
    performance: {
      en: [
        { title: "Period Covered", content: "" },
        { title: "Key Performance Indicators", content: "" },
        { title: "Achievements", content: "" },
        { title: "Areas for Improvement", content: "" },
      ],
      fr: [
        { title: "Période Couverte", content: "" },
        { title: "Indicateurs Clés de Performance", content: "" },
        { title: "Réalisations", content: "" },
        { title: "Axes d'Amélioration", content: "" },
      ],
      ar: [
        { title: "الفترة المشمولة", content: "" },
        { title: "مؤشرات الأداء الرئيسية", content: "" },
        { title: "الإنجازات", content: "" },
        { title: "مجالات التحسين", content: "" },
      ],
    },
    minutes: {
      en: [
        { title: "Attendees", content: "" },
        { title: "Agenda Items Discussed", content: "" },
        { title: "Decisions Made", content: "" },
        { title: "Action Items & Owners", content: "" },
      ],
      fr: [
        { title: "Participants", content: "" },
        { title: "Points à l'Ordre du Jour", content: "" },
        { title: "Décisions Prises", content: "" },
        { title: "Actions à Suivre et Responsables", content: "" },
      ],
      ar: [
        { title: "الحاضرون", content: "" },
        { title: "نقاط جدول الأعمال", content: "" },
        { title: "القرارات المتخذة", content: "" },
        { title: "المهام والمسؤولون عنها", content: "" },
      ],
    },
  };

  /* ---------------- State ---------------- */

  let sectionIdCounter = 0;
  function nextSectionId() { return "sec-" + (++sectionIdCounter); }

  function todayISO() {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  }

  const STORAGE_KEY = "reportGeneratorDraft_v1";

  const state = {
    lang: "en",
    logoDataUrl: null,
    signatureDataUrl: null,
    date: todayISO(),
    organization: "",
    reportTitle: "",
    preparedBy: "",
    preparedFor: "",
    execSummary: "",
    sections: [],
    recommendations: "",
  };

  function formatDateDisplay(iso) {
    if (!iso) return "—";
    const [y, m, d] = iso.split("-");
    if (!y || !m || !d) return iso;
    return `${d}/${m}/${y}`;
  }

  /* ---------------- DOM refs ---------------- */

  const $ = (sel) => document.querySelector(sel);
  const els = {
    htmlRoot: $("#htmlRoot"),
    langBtns: document.querySelectorAll(".lang-btn"),
    templateGrid: $("#templateGrid"),

    logoInput: $("#logoInput"),
    logoUploadBox: $("#logoUploadBox"),
    logoPlaceholder: $("#logoPlaceholder"),
    logoPreview: $("#logoPreview"),

    reportDate: $("#reportDate"),
    organization: $("#organization"),
    reportTitle: $("#reportTitle"),
    preparedBy: $("#preparedBy"),
    preparedFor: $("#preparedFor"),
    execSummary: $("#execSummary"),

    sectionsList: $("#sectionsList"),
    sectionCountBadge: $("#sectionCountBadge"),
    addSectionBtn: $("#addSectionBtn"),

    recommendations: $("#recommendations"),

    signatureInput: $("#signatureInput"),
    signatureUploadBox: $("#signatureUploadBox"),
    signaturePlaceholder: $("#signaturePlaceholder"),
    signaturePreview: $("#signaturePreview"),

    generatePdfBtn: $("#generatePdfBtn"),
    printBtn: $("#printBtn"),
    clearBtn: $("#clearBtn"),
    autosaveNote: $("#autosaveNote"),

    previewLogo: $("#previewLogo"),
    previewLogoPlaceholder: $("#previewLogoPlaceholder"),
    previewOrg: $("#previewOrg"),
    previewDate: $("#previewDate"),
    previewTitle: $("#previewTitle"),
    previewPreparedBy: $("#previewPreparedBy"),
    previewPreparedFor: $("#previewPreparedFor"),
    previewToc: $("#previewToc"),
    previewTocList: $("#previewTocList"),
    previewSummaryBlock: $("#previewSummaryBlock"),
    previewSummary: $("#previewSummary"),
    previewSections: $("#previewSections"),
    previewRecBlock: $("#previewRecBlock"),
    previewRec: $("#previewRec"),
    previewSignature: $("#previewSignature"),

    confirmOverlay: $("#confirmOverlay"),
    confirmCancel: $("#confirmCancel"),
    confirmOk: $("#confirmOk"),

    pdfWarnOverlay: $("#pdfWarnOverlay"),
    pdfWarnCancel: $("#pdfWarnCancel"),
    pdfWarnOk: $("#pdfWarnOk"),
  };

  /* ---------------- Helpers ---------------- */

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : str;
    return div.innerHTML;
  }

  // Turns free text into paragraphs / bullet lists.
  // Lines starting with "- " or "• " become a <ul>; blank lines separate paragraphs.
  function textToHtml(text) {
    if (!text || !text.trim()) return "";
    const blocks = text.split(/\n{2,}/);
    let html = "";
    blocks.forEach((block) => {
      const lines = block.split("\n").filter((l) => l.trim() !== "");
      if (lines.length === 0) return;
      const isList = lines.every((l) => /^[-•]\s+/.test(l.trim()));
      if (isList) {
        html += "<ul>" + lines.map((l) => `<li>${escapeHtml(l.trim().replace(/^[-•]\s+/, ""))}</li>`).join("") + "</ul>";
      } else {
        html += "<p>" + lines.map(escapeHtml).join("<br>") + "</p>";
      }
    });
    return html;
  }

  let saveNoticeTimer = null;
  function flashSavedNotice() {
    els.autosaveNote.textContent = t("savedNotice");
    clearTimeout(saveNoticeTimer);
    saveNoticeTimer = setTimeout(() => { els.autosaveNote.textContent = ""; }, 1600);
  }

  /* ---------------- Persistence (localStorage) ---------------- */

  let saveDebounceTimer = null;
  function scheduleSave() {
    clearTimeout(saveDebounceTimer);
    saveDebounceTimer = setTimeout(saveToStorage, 400);
  }

  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      flashSavedNotice();
    } catch (e) {
      // storage unavailable or full — fail silently, app still works without persistence
    }
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const saved = JSON.parse(raw);
      if (!saved || typeof saved !== "object") return false;
      Object.assign(state, saved);
      if (!Array.isArray(state.sections)) state.sections = [];
      state.sections.forEach((s) => {
        if (!s.id) s.id = nextSectionId();
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ---------------- i18n application ---------------- */

  function applyLanguage(lang) {
    currentLang = lang;
    state.lang = lang;
    const dict = I18N[lang];
    els.htmlRoot.setAttribute("lang", lang);
    els.htmlRoot.setAttribute("dir", dict.dir);

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      if (dict[key] !== undefined) node.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      const key = node.getAttribute("data-i18n-placeholder");
      if (dict[key] !== undefined) node.setAttribute("placeholder", dict[key]);
    });

    els.langBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });

    renderSectionsEditor();
    renderPreview();
    scheduleSave();
  }

  els.langBtns.forEach((btn) => {
    btn.addEventListener("click", () => applyLanguage(btn.getAttribute("data-lang")));
  });

  /* ---------------- Templates ---------------- */

  els.templateGrid.addEventListener("click", (e) => {
    const btn = e.target.closest(".template-btn");
    if (!btn) return;
    const key = btn.getAttribute("data-template");
    const preset = TEMPLATES[key] && (TEMPLATES[key][currentLang] || TEMPLATES[key].en);
    if (!preset) return;
    state.sections = preset.map((s) => ({ id: nextSectionId(), title: s.title, content: s.content }));
    renderSectionsEditor();
    renderPreview();
    scheduleSave();
  });

  /* ---------------- Uploads ---------------- */

  function bindUpload(box, input, placeholder, previewImg, onLoaded) {
    box.addEventListener("click", () => input.click());
    box.addEventListener("dragover", (e) => { e.preventDefault(); box.style.borderColor = "var(--blue)"; });
    box.addEventListener("dragleave", () => { box.style.borderColor = ""; });
    box.addEventListener("drop", (e) => {
      e.preventDefault();
      box.style.borderColor = "";
      if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    });
    input.addEventListener("change", () => {
      if (input.files && input.files[0]) handleFile(input.files[0]);
    });

    function handleFile(file) {
      const valid = /\.(png|jpe?g|svg)$/i.test(file.name) || /^image\//.test(file.type);
      if (!valid) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        placeholder.hidden = true;
        previewImg.hidden = false;
        previewImg.src = dataUrl;
        onLoaded(dataUrl);
        renderPreview();
        scheduleSave();
      };
      reader.readAsDataURL(file);
    }
  }

  bindUpload(els.logoUploadBox, els.logoInput, els.logoPlaceholder, els.logoPreview, (url) => { state.logoDataUrl = url; });
  bindUpload(els.signatureUploadBox, els.signatureInput, els.signaturePlaceholder, els.signaturePreview, (url) => { state.signatureDataUrl = url; });

  /* ---------------- Basic fields ---------------- */

  function bindTextField(el, stateKey) {
    el.addEventListener("input", () => {
      state[stateKey] = el.value;
      renderPreview();
      scheduleSave();
    });
  }

  bindTextField(els.reportDate, "date");
  bindTextField(els.organization, "organization");
  bindTextField(els.reportTitle, "reportTitle");
  bindTextField(els.preparedBy, "preparedBy");
  bindTextField(els.preparedFor, "preparedFor");
  bindTextField(els.execSummary, "execSummary");
  bindTextField(els.recommendations, "recommendations");

  /* ---------------- Sections editor ---------------- */

  function renderSectionsEditor() {
    els.sectionsList.innerHTML = "";
    els.sectionCountBadge.textContent = state.sections.length;

    if (state.sections.length === 0) {
      const empty = document.createElement("p");
      empty.className = "rp-empty-note";
      empty.style.padding = "6px 2px";
      empty.textContent = t("noSectionsYet");
      els.sectionsList.appendChild(empty);
      return;
    }

    state.sections.forEach((sec, idx) => {
      const wrap = document.createElement("div");
      wrap.className = "section-item";
      wrap.dataset.id = sec.id;
      wrap.innerHTML = `
        <div class="section-item-head">
          <span class="section-number-tag">${idx + 1}</span>
          <input type="text" class="input section-title-input" data-field="title" value="${escapeAttr(sec.title)}" placeholder="${t("sectionTitlePlaceholder")}">
          <div class="section-controls">
            <button type="button" class="icon-btn" data-action="up" title="${t("moveUp")}" ${idx === 0 ? "disabled" : ""}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
            </button>
            <button type="button" class="icon-btn" data-action="down" title="${t("moveDown")}" ${idx === state.sections.length - 1 ? "disabled" : ""}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
            </button>
            <button type="button" class="icon-btn icon-btn-danger" data-action="delete" title="${t("deleteSection")}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
            </button>
          </div>
        </div>
        <textarea class="textarea section-content-textarea" data-field="content" placeholder="${t("sectionContentPlaceholder")}">${escapeHtml(sec.content)}</textarea>
      `;
      els.sectionsList.appendChild(wrap);
    });
  }

  function escapeAttr(str) {
    return String(str == null ? "" : str).replace(/"/g, "&quot;");
  }

  els.sectionsList.addEventListener("input", (e) => {
    const field = e.target.getAttribute("data-field");
    if (!field) return;
    const wrap = e.target.closest(".section-item");
    const sec = state.sections.find((s) => s.id === wrap.dataset.id);
    if (!sec) return;
    sec[field] = e.target.value;
    renderPreview();
    scheduleSave();
  });

  els.sectionsList.addEventListener("click", (e) => {
    const btn = e.target.closest(".icon-btn");
    if (!btn) return;
    const wrap = btn.closest(".section-item");
    const id = wrap.dataset.id;
    const idx = state.sections.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const action = btn.getAttribute("data-action");

    if (action === "delete") {
      state.sections.splice(idx, 1);
    } else if (action === "up" && idx > 0) {
      [state.sections[idx - 1], state.sections[idx]] = [state.sections[idx], state.sections[idx - 1]];
    } else if (action === "down" && idx < state.sections.length - 1) {
      [state.sections[idx + 1], state.sections[idx]] = [state.sections[idx], state.sections[idx + 1]];
    }
    renderSectionsEditor();
    renderPreview();
    scheduleSave();
  });

  els.addSectionBtn.addEventListener("click", () => {
    state.sections.push({ id: nextSectionId(), title: "", content: "" });
    renderSectionsEditor();
    renderPreview();
    scheduleSave();
    const inputs = els.sectionsList.querySelectorAll(".section-title-input");
    if (inputs.length) inputs[inputs.length - 1].focus();
  });

  /* ---------------- Preview rendering ---------------- */

  function renderPreview() {
    // Logo
    if (state.logoDataUrl) {
      els.previewLogo.src = state.logoDataUrl;
      els.previewLogo.hidden = false;
      els.previewLogoPlaceholder.hidden = true;
    } else {
      els.previewLogo.hidden = true;
      els.previewLogoPlaceholder.hidden = false;
    }

    els.previewOrg.textContent = state.organization || "—";
    els.previewDate.textContent = formatDateDisplay(state.date);
    els.previewTitle.textContent = state.reportTitle || t("untitledReport");
    els.previewPreparedBy.textContent = state.preparedBy ? `${t("preparedBy")}: ${state.preparedBy}` : "";
    els.previewPreparedFor.textContent = state.preparedFor ? `${t("preparedFor")}: ${state.preparedFor}` : "";

    // Table of contents
    const validSections = state.sections.filter((s) => s.title || s.content);
    if (validSections.length > 1) {
      els.previewToc.hidden = false;
      els.previewTocList.innerHTML = validSections
        .map((s) => `<li>${escapeHtml(s.title) || t("untitledSection")}</li>`)
        .join("");
    } else {
      els.previewToc.hidden = true;
    }

    // Executive summary
    if (state.execSummary && state.execSummary.trim()) {
      els.previewSummaryBlock.hidden = false;
      els.previewSummary.innerHTML = textToHtml(state.execSummary);
    } else {
      els.previewSummaryBlock.hidden = true;
    }

    // Sections
    els.previewSections.innerHTML = "";
    if (validSections.length === 0) {
      const empty = document.createElement("div");
      empty.className = "rp-empty-note";
      empty.textContent = t("noSectionsYet");
      els.previewSections.appendChild(empty);
    } else {
      validSections.forEach((sec, idx) => {
        const div = document.createElement("div");
        div.className = "rp-section";
        div.innerHTML = `
          <div class="rp-section-heading">
            <span class="rp-section-number">${idx + 1}.</span>
            <span>${escapeHtml(sec.title) || t("untitledSection")}</span>
          </div>
          <div class="rp-block-text">${textToHtml(sec.content) || ""}</div>
        `;
        els.previewSections.appendChild(div);
      });
    }

    // Recommendations
    if (state.recommendations && state.recommendations.trim()) {
      els.previewRecBlock.hidden = false;
      els.previewRec.innerHTML = textToHtml(state.recommendations);
    } else {
      els.previewRecBlock.hidden = true;
    }

    // Signature
    if (state.signatureDataUrl) {
      els.previewSignature.src = state.signatureDataUrl;
      els.previewSignature.hidden = false;
    } else {
      els.previewSignature.hidden = true;
    }
  }

  /* ---------------- Actions: Print / PDF / Clear ---------------- */

  els.printBtn.addEventListener("click", () => window.print());

  function isReportEmpty() {
    const hasSections = state.sections.some((s) => s.title || s.content);
    return !state.reportTitle && !hasSections && !state.execSummary;
  }

  els.generatePdfBtn.addEventListener("click", () => {
    if (isReportEmpty()) {
      els.pdfWarnOverlay.hidden = false;
      return;
    }
    runGeneratePdf();
  });

  els.pdfWarnCancel.addEventListener("click", () => { els.pdfWarnOverlay.hidden = true; });
  els.pdfWarnOk.addEventListener("click", () => {
    els.pdfWarnOverlay.hidden = true;
    runGeneratePdf();
  });

  async function runGeneratePdf() {
    const original = els.generatePdfBtn.textContent;
    els.generatePdfBtn.textContent = "…";
    els.generatePdfBtn.disabled = true;
    try {
      const sheet = document.getElementById("reportSheet");
      const canvas = await html2canvas(sheet, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
      const imgData = canvas.toDataURL("image/png");

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const footerSpace = 10; // mm reserved at the bottom for page numbers
      const usableHeight = pageHeight - footerSpace;

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= usableHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= usableHeight;
      }

      // Footer: page numbers + organization name
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        const footerText = `${state.organization || ""}`.trim();
        const pageLabel = `${i} / ${totalPages}`;
        pdf.text(footerText, 10, pageHeight - 5);
        pdf.text(pageLabel, pageWidth - 10, pageHeight - 5, { align: "right" });
      }

      const safeTitle = (state.reportTitle || "report").toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/gi, "-").slice(0, 40);
      pdf.save(`${safeTitle || "report"}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF generation failed. Please try the Print option instead.");
    } finally {
      els.generatePdfBtn.textContent = original;
      els.generatePdfBtn.disabled = false;
    }
  }

  els.clearBtn.addEventListener("click", () => { els.confirmOverlay.hidden = false; });
  els.confirmCancel.addEventListener("click", () => { els.confirmOverlay.hidden = true; });
  els.confirmOk.addEventListener("click", () => {
    els.confirmOverlay.hidden = true;
    resetState();
  });

  function resetState() {
    state.logoDataUrl = null;
    state.signatureDataUrl = null;
    state.date = todayISO();
    state.organization = "";
    state.reportTitle = "";
    state.preparedBy = "";
    state.preparedFor = "";
    state.execSummary = "";
    state.sections = [];
    state.recommendations = "";

    els.logoPreview.hidden = true;
    els.logoPreview.removeAttribute("src");
    els.logoPlaceholder.hidden = false;
    els.logoInput.value = "";

    els.signaturePreview.hidden = true;
    els.signaturePreview.removeAttribute("src");
    els.signaturePlaceholder.hidden = false;
    els.signatureInput.value = "";

    els.reportDate.value = state.date;
    els.organization.value = "";
    els.reportTitle.value = "";
    els.preparedBy.value = "";
    els.preparedFor.value = "";
    els.execSummary.value = "";
    els.recommendations.value = "";

    renderSectionsEditor();
    renderPreview();
    saveToStorage();
  }

  /* ---------------- Init ---------------- */

  function init() {
    const hadSavedDraft = loadFromStorage();

    els.reportDate.value = state.date || todayISO();
    els.organization.value = state.organization || "";
    els.reportTitle.value = state.reportTitle || "";
    els.preparedBy.value = state.preparedBy || "";
    els.preparedFor.value = state.preparedFor || "";
    els.execSummary.value = state.execSummary || "";
    els.recommendations.value = state.recommendations || "";

    if (state.logoDataUrl) {
      els.logoPreview.src = state.logoDataUrl;
      els.logoPreview.hidden = false;
      els.logoPlaceholder.hidden = true;
    }
    if (state.signatureDataUrl) {
      els.signaturePreview.src = state.signatureDataUrl;
      els.signaturePreview.hidden = false;
      els.signaturePlaceholder.hidden = true;
    }

    applyLanguage(state.lang && I18N[state.lang] ? state.lang : "en");
    renderSectionsEditor();
    renderPreview();

    if (hadSavedDraft) flashSavedNotice();
  }

  init();
})();
