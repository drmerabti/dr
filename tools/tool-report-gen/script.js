// ============================================================
// script.js — Professional Report Generator (Firebase-backed)
// ============================================================

(function () {
  "use strict";

  /* ---------------- i18n ---------------- */

  const I18N = {
    en: {
      dir: "ltr",
      appTitle: "Report Generator",
      backToTools: "Tools",
      backToLibrary: "My Reports",
      authTitle: "Sign in to build your reports",
      authSub: "Sign in or create a free account to save and access your reports.",
      continueWithGoogle: "Continue with Google",
      orDivider: "or",
      email: "Email",
      password: "Password",
      signIn: "Sign In",
      createAccount: "Create Account",
      signOut: "Sign out",
      myReports: "My Reports",
      newReport: "New Report",
      libraryEmptyText: "You don't have any saved reports yet. Click \u201cNew Report\u201d to start.",
      loading: "Loading...",
      reportEditor: "Report Editor",
      chooseTemplate: "Apply a Template",
      tplGeneral: "General Work Report",
      tplIncident: "Incident Report",
      tplPerformance: "Periodic Performance Report",
      tplMinutes: "Meeting Minutes",
      reference: "Reference Number",
      referencePlaceholder: "RPT-2026-0001",
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
      pageFrame: "Page Frame",
      frameNone: "No Frame",
      frameSimple: "Simple Frame",
      frameCustom: "Upload My Own",
      uploadFrameText: "Upload Frame Image",
      generatePdf: "Generate PDF",
      print: "Print",
      clear: "Clear",
      livePreview: "Live Report Preview",
      companyLogo: "ORGANIZATION",
      untitledReport: "Untitled Report",
      tableOfContents: "Table of Contents",
      confirmClear: "Clear this report's fields? This cannot be undone.",
      cancel: "Cancel",
      confirmYes: "Clear",
      confirmDeleteReport: "Delete this report permanently? This cannot be undone.",
      emptyReportWarning: "This report has no title or sections yet. Generate the PDF anyway?",
      continueAnyway: "Generate Anyway",
      moveUp: "Move up",
      moveDown: "Move down",
      deleteSection: "Delete section",
      noSectionsYet: "No sections yet — add one below or apply a template above.",
      savedNotice: "Saved",
      untitledSection: "Untitled section",
      demoOrg: "Sunrise Retail Group",
      demoTitle: "Q3 2026 Operations Report",
      demoPreparedBy: "Alex Morgan, Operations Manager",
      demoPreparedFor: "Executive Committee",
      demoSummary: "This report summarizes operational performance for Q3 2026 across all regional branches. Overall, the quarter showed steady growth in revenue and customer satisfaction, with a few supply-chain challenges that were addressed by mid-quarter.",
      demoSec1Title: "Key Achievements",
      demoSec1Content: "- Revenue grew 14% compared to Q2\n- Customer satisfaction score reached 4.6/5\n- Successfully opened two new branches",
      demoSec2Title: "Challenges Faced",
      demoSec2Content: "- Delayed shipments from one supplier in July\n- Higher-than-usual staff turnover in the logistics team\n\nBoth issues were escalated and are now being actively monitored.",
      demoSec3Title: "Next Steps",
      demoSec3Content: "- Finalize the new supplier contract by end of October\n- Launch the staff retention program in Q4\n- Review branch performance metrics monthly",
      demoRecommendations: "Overall, Q3 performance was strong. We recommend continuing the current growth strategy while prioritizing supply-chain resilience and staff retention heading into Q4.\n\n- Approve budget for the retention program\n- Schedule a supplier review meeting",
    },
    fr: {
      dir: "ltr",
      appTitle: "Générateur de Rapports",
      backToTools: "Outils",
      backToLibrary: "Mes Rapports",
      authTitle: "Connectez-vous pour créer vos rapports",
      authSub: "Connectez-vous ou créez un compte gratuit pour enregistrer et retrouver vos rapports.",
      continueWithGoogle: "Continuer avec Google",
      orDivider: "ou",
      email: "E-mail",
      password: "Mot de passe",
      signIn: "Se connecter",
      createAccount: "Créer un compte",
      signOut: "Déconnexion",
      myReports: "Mes Rapports",
      newReport: "Nouveau Rapport",
      libraryEmptyText: "Vous n'avez encore aucun rapport enregistré. Cliquez sur « Nouveau Rapport » pour commencer.",
      loading: "Chargement...",
      reportEditor: "Éditeur de Rapport",
      chooseTemplate: "Appliquer un Modèle",
      tplGeneral: "Rapport de Travail Général",
      tplIncident: "Rapport d'Incident",
      tplPerformance: "Rapport de Performance Périodique",
      tplMinutes: "Compte Rendu de Réunion",
      reference: "Numéro de Référence",
      referencePlaceholder: "RPT-2026-0001",
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
      pageFrame: "Cadre de Page",
      frameNone: "Sans Cadre",
      frameSimple: "Cadre Simple",
      frameCustom: "Importer mon Propre Cadre",
      uploadFrameText: "Importer une Image de Cadre",
      generatePdf: "Générer le PDF",
      print: "Imprimer",
      clear: "Réinitialiser",
      livePreview: "Aperçu du Rapport en Direct",
      companyLogo: "ORGANISATION",
      untitledReport: "Rapport Sans Titre",
      tableOfContents: "Table des Matières",
      confirmClear: "Réinitialiser les champs de ce rapport ? Cette action est irréversible.",
      cancel: "Annuler",
      confirmYes: "Réinitialiser",
      confirmDeleteReport: "Supprimer définitivement ce rapport ? Cette action est irréversible.",
      emptyReportWarning: "Ce rapport n'a ni titre ni sections. Générer le PDF quand même ?",
      continueAnyway: "Générer Quand Même",
      moveUp: "Monter",
      moveDown: "Descendre",
      deleteSection: "Supprimer la section",
      noSectionsYet: "Aucune section pour l'instant — ajoutez-en une ci-dessous ou appliquez un modèle.",
      savedNotice: "Enregistré",
      untitledSection: "Section sans titre",
      demoOrg: "Groupe Commercial Sunrise",
      demoTitle: "Rapport d'Exploitation T3 2026",
      demoPreparedBy: "Alex Morgan, Responsable des Opérations",
      demoPreparedFor: "Comité Exécutif",
      demoSummary: "Ce rapport résume la performance opérationnelle du T3 2026 dans toutes les succursales régionales. Dans l'ensemble, le trimestre a montré une croissance régulière du chiffre d'affaires et de la satisfaction client, avec quelques difficultés logistiques résolues à mi-trimestre.",
      demoSec1Title: "Réalisations Clés",
      demoSec1Content: "- Le chiffre d'affaires a augmenté de 14% par rapport au T2\n- Le score de satisfaction client a atteint 4,6/5\n- Ouverture réussie de deux nouvelles succursales",
      demoSec2Title: "Difficultés Rencontrées",
      demoSec2Content: "- Retards de livraison d'un fournisseur en juillet\n- Rotation du personnel plus élevée que d'habitude dans l'équipe logistique\n\nCes deux problèmes ont été signalés et sont désormais suivis activement.",
      demoSec3Title: "Prochaines Étapes",
      demoSec3Content: "- Finaliser le nouveau contrat fournisseur d'ici fin octobre\n- Lancer le programme de fidélisation du personnel au T4\n- Examiner les indicateurs de performance des succursales chaque mois",
      demoRecommendations: "Dans l'ensemble, la performance du T3 a été solide. Nous recommandons de poursuivre la stratégie de croissance actuelle tout en priorisant la résilience logistique et la fidélisation du personnel pour le T4.\n\n- Approuver le budget du programme de fidélisation\n- Planifier une réunion de revue fournisseur",
    },
    ar: {
      dir: "rtl",
      appTitle: "مولّد التقارير",
      backToTools: "الأدوات",
      backToLibrary: "تقاريري",
      authTitle: "سجّل الدخول لإنشاء تقاريرك",
      authSub: "سجّل الدخول أو أنشئ حسابًا مجانيًا لحفظ تقاريرك والوصول إليها.",
      continueWithGoogle: "المتابعة عبر Google",
      orDivider: "أو",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      signIn: "تسجيل الدخول",
      createAccount: "إنشاء حساب",
      signOut: "تسجيل الخروج",
      myReports: "تقاريري",
      newReport: "تقرير جديد",
      libraryEmptyText: "لا توجد لديك تقارير محفوظة بعد. اضغط «تقرير جديد» للبدء.",
      loading: "جارِ التحميل...",
      reportEditor: "محرر التقرير",
      chooseTemplate: "تطبيق قالب",
      tplGeneral: "تقرير عمل عام",
      tplIncident: "تقرير حادثة",
      tplPerformance: "تقرير أداء دوري",
      tplMinutes: "محضر اجتماع",
      reference: "الرقم المرجعي",
      referencePlaceholder: "RPT-2026-0001",
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
      pageFrame: "إطار الصفحة",
      frameNone: "بدون إطار",
      frameSimple: "إطار بسيط",
      frameCustom: "رفع إطاري الخاص",
      uploadFrameText: "رفع صورة الإطار",
      generatePdf: "توليد PDF",
      print: "طباعة",
      clear: "مسح",
      livePreview: "معاينة مباشرة للتقرير",
      companyLogo: "الجهة",
      untitledReport: "تقرير بدون عنوان",
      tableOfContents: "فهرس المحتويات",
      confirmClear: "هل تريد مسح حقول هذا التقرير؟ لا يمكن التراجع عن هذا الإجراء.",
      cancel: "إلغاء",
      confirmYes: "مسح",
      confirmDeleteReport: "هل تريد حذف هذا التقرير نهائيًا؟ لا يمكن التراجع عن هذا الإجراء.",
      emptyReportWarning: "هذا التقرير لا يحتوي على عنوان أو أقسام بعد. هل تريد توليد PDF على أي حال؟",
      continueAnyway: "توليد على أي حال",
      moveUp: "تحريك للأعلى",
      moveDown: "تحريك للأسفل",
      deleteSection: "حذف القسم",
      noSectionsYet: "لا توجد أقسام بعد — أضف واحدًا أدناه أو طبّق قالبًا أعلاه.",
      savedNotice: "تم الحفظ",
      untitledSection: "قسم بدون عنوان",
      demoOrg: "مجموعة الفجر التجارية",
      demoTitle: "تقرير العمليات - الربع الثالث 2026",
      demoPreparedBy: "أحمد بلحاج، مدير العمليات",
      demoPreparedFor: "اللجنة التنفيذية",
      demoSummary: "يلخّص هذا التقرير الأداء التشغيلي للربع الثالث من 2026 عبر جميع الفروع الإقليمية. بشكل عام، شهد الربع نموًا ثابتًا في الإيرادات ورضا الزبائن، مع بعض التحديات اللوجستية التي تمت معالجتها في منتصف الربع.",
      demoSec1Title: "أبرز الإنجازات",
      demoSec1Content: "- نمو الإيرادات بنسبة 14% مقارنة بالربع الثاني\n- بلوغ مؤشر رضا الزبائن 4.6 من 5\n- افتتاح فرعين جديدين بنجاح",
      demoSec2Title: "التحديات التي واجهتنا",
      demoSec2Content: "- تأخر شحنات من أحد الموردين في شهر يوليو\n- ارتفاع معدل دوران الموظفين في فريق اللوجستيك\n\nتم تصعيد كلتا المشكلتين وهما الآن قيد المتابعة الفعلية.",
      demoSec3Title: "الخطوات القادمة",
      demoSec3Content: "- إنهاء عقد المورد الجديد قبل نهاية أكتوبر\n- إطلاق برنامج الاحتفاظ بالموظفين في الربع الرابع\n- مراجعة مؤشرات أداء الفروع شهريًا",
      demoRecommendations: "بشكل عام، كان أداء الربع الثالث قويًا. نوصي بمواصلة استراتيجية النمو الحالية مع إعطاء الأولوية لمرونة سلسلة التوريد والاحتفاظ بالموظفين استعدادًا للربع الرابع.\n\n- الموافقة على ميزانية برنامج الاحتفاظ بالموظفين\n- جدولة اجتماع لمراجعة الموردين",
    },
  };

  let currentLang = "en";
  function t(key) {
    return (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;
  }

  /* ---------------- Templates ---------------- */

  const TEMPLATES = {
    general: {
      en: [{ title: "Background", content: "" }, { title: "Objectives", content: "" }, { title: "Work Completed", content: "" }, { title: "Challenges", content: "" }],
      fr: [{ title: "Contexte", content: "" }, { title: "Objectifs", content: "" }, { title: "Travail Réalisé", content: "" }, { title: "Difficultés Rencontrées", content: "" }],
      ar: [{ title: "الخلفية", content: "" }, { title: "الأهداف", content: "" }, { title: "الأعمال المنجزة", content: "" }, { title: "الصعوبات", content: "" }],
    },
    incident: {
      en: [{ title: "Date, Time & Location", content: "" }, { title: "Description of Incident", content: "" }, { title: "People Involved", content: "" }, { title: "Immediate Actions Taken", content: "" }, { title: "Root Cause", content: "" }],
      fr: [{ title: "Date, Heure et Lieu", content: "" }, { title: "Description de l'Incident", content: "" }, { title: "Personnes Impliquées", content: "" }, { title: "Actions Immédiates Prises", content: "" }, { title: "Cause Racine", content: "" }],
      ar: [{ title: "التاريخ والوقت والمكان", content: "" }, { title: "وصف الحادثة", content: "" }, { title: "الأشخاص المعنيون", content: "" }, { title: "الإجراءات الفورية المتخذة", content: "" }, { title: "السبب الجذري", content: "" }],
    },
    performance: {
      en: [{ title: "Period Covered", content: "" }, { title: "Key Performance Indicators", content: "" }, { title: "Achievements", content: "" }, { title: "Areas for Improvement", content: "" }],
      fr: [{ title: "Période Couverte", content: "" }, { title: "Indicateurs Clés de Performance", content: "" }, { title: "Réalisations", content: "" }, { title: "Axes d'Amélioration", content: "" }],
      ar: [{ title: "الفترة المشمولة", content: "" }, { title: "مؤشرات الأداء الرئيسية", content: "" }, { title: "الإنجازات", content: "" }, { title: "مجالات التحسين", content: "" }],
    },
    minutes: {
      en: [{ title: "Attendees", content: "" }, { title: "Agenda Items Discussed", content: "" }, { title: "Decisions Made", content: "" }, { title: "Action Items & Owners", content: "" }],
      fr: [{ title: "Participants", content: "" }, { title: "Points à l'Ordre du Jour", content: "" }, { title: "Décisions Prises", content: "" }, { title: "Actions à Suivre et Responsables", content: "" }],
      ar: [{ title: "الحاضرون", content: "" }, { title: "نقاط جدول الأعمال", content: "" }, { title: "القرارات المتخذة", content: "" }, { title: "المهام والمسؤولون عنها", content: "" }],
    },
  };

  /* ---------------- Firebase refs ---------------- */

  const auth = window.fbAuth;
  const db = window.fbDb;
  let currentUser = null;

  /* ---------------- State ---------------- */

  let sectionIdCounter = 0;
  function nextSectionId() { return "sec-" + (++sectionIdCounter); }

  function todayISO() {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  }

  function makeReferenceNumber() {
    const d = new Date();
    const y = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `RPT-${y}${mm}${dd}-${rand}`;
  }

  function emptyState() {
    return {
      id: null,
      reference: "",
      lang: currentLang,
      logoDataUrl: null,
      signatureDataUrl: null,
      frameMode: "none",
      frameDataUrl: null,
      date: todayISO(),
      organization: "",
      reportTitle: "",
      preparedBy: "",
      preparedFor: "",
      execSummary: "",
      sections: [],
      recommendations: "",
    };
  }

  function demoState() {
    const s = emptyState();
    s.reference = makeReferenceNumber();
    s.organization = t("demoOrg");
    s.reportTitle = t("demoTitle");
    s.preparedBy = t("demoPreparedBy");
    s.preparedFor = t("demoPreparedFor");
    s.execSummary = t("demoSummary");
    s.sections = [
      { id: nextSectionId(), title: t("demoSec1Title"), content: t("demoSec1Content") },
      { id: nextSectionId(), title: t("demoSec2Title"), content: t("demoSec2Content") },
      { id: nextSectionId(), title: t("demoSec3Title"), content: t("demoSec3Content") },
    ];
    s.recommendations = t("demoRecommendations");
    return s;
  }

  let state = emptyState();

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

    crumbToTools: $("#crumbToTools"),
    crumbToLibrary: $("#crumbToLibrary"),
    userChip: $("#userChip"),
    userChipEmail: $("#userChipEmail"),

    authScreen: $("#authScreen"),
    googleSignInBtn: $("#googleSignInBtn"),
    authEmail: $("#authEmail"),
    authPassword: $("#authPassword"),
    authError: $("#authError"),
    authSignInBtn: $("#authSignInBtn"),
    authRegisterBtn: $("#authRegisterBtn"),

    libraryScreen: $("#libraryScreen"),
    libraryGrid: $("#libraryGrid"),
    libraryEmpty: $("#libraryEmpty"),
    libraryLoading: $("#libraryLoading"),
    newReportBtn: $("#newReportBtn"),

    editorScreen: $("#editorScreen"),
    templateGrid: $("#templateGrid"),

    referenceNumber: $("#referenceNumber"),
    logoInput: $("#logoInput"),
    logoUploadBox: $("#logoUploadBox"),
    logoPlaceholder: $("#logoPlaceholder"),
    logoPreview: $("#logoPreview"),
    removeLogoBtn: $("#removeLogoBtn"),

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
    removeSignatureBtn: $("#removeSignatureBtn"),

    frameOptions: $("#frameOptions"),
    frameUploadBox: $("#frameUploadBox"),
    frameInput: $("#frameInput"),
    framePlaceholder: $("#framePlaceholder"),
    framePreview: $("#framePreview"),
    removeFrameBtn: $("#removeFrameBtn"),

    generatePdfBtn: $("#generatePdfBtn"),
    printBtn: $("#printBtn"),
    clearBtn: $("#clearBtn"),
    autosaveNote: $("#autosaveNote"),

    reportSheet: $("#reportSheet"),
    frameLayerImg: $("#frameLayerImg"),
    previewLogo: $("#previewLogo"),
    previewLogoPlaceholder: $("#previewLogoPlaceholder"),
    previewOrg: $("#previewOrg"),
    previewDate: $("#previewDate"),
    previewRef: $("#previewRef"),
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

    deleteReportOverlay: $("#deleteReportOverlay"),
    deleteReportCancel: $("#deleteReportCancel"),
    deleteReportOk: $("#deleteReportOk"),
  };

  let pendingDeleteId = null;

  /* ---------------- Helpers ---------------- */

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return String(str == null ? "" : str).replace(/"/g, "&quot;");
  }

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

  /* ---------------- View routing ---------------- */

  function showView(view) {
    els.authScreen.hidden = view !== "auth";
    els.libraryScreen.hidden = view !== "library";
    els.editorScreen.hidden = view !== "editor";

    els.crumbToTools.hidden = view === "editor";
    els.crumbToLibrary.hidden = view !== "editor";
  }

  els.crumbToLibrary.addEventListener("click", () => {
    showView("library");
    loadLibrary();
  });

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

    els.langBtns.forEach((btn) => btn.classList.toggle("active", btn.getAttribute("data-lang") === lang));

    if (!els.editorScreen.hidden) {
      renderSectionsEditor();
      renderPreview();
    }
  }

  els.langBtns.forEach((btn) => {
    btn.addEventListener("click", () => applyLanguage(btn.getAttribute("data-lang")));
  });

  /* ---------------- Auth ---------------- */

  function showAuthError(msg) {
    els.authError.textContent = msg;
    els.authError.hidden = false;
  }
  function clearAuthError() {
    els.authError.hidden = true;
    els.authError.textContent = "";
  }

  els.googleSignInBtn.addEventListener("click", () => {
    clearAuthError();
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch((err) => showAuthError(err.message));
  });

  els.authSignInBtn.addEventListener("click", () => {
    clearAuthError();
    const email = els.authEmail.value.trim();
    const password = els.authPassword.value;
    if (!email || !password) { showAuthError(t("email") + " / " + t("password")); return; }
    auth.signInWithEmailAndPassword(email, password).catch((err) => showAuthError(err.message));
  });

  els.authRegisterBtn.addEventListener("click", () => {
    clearAuthError();
    const email = els.authEmail.value.trim();
    const password = els.authPassword.value;
    if (!email || !password) { showAuthError(t("email") + " / " + t("password")); return; }
    auth.createUserWithEmailAndPassword(email, password).catch((err) => showAuthError(err.message));
  });

  els.userChip.addEventListener("click", () => { auth.signOut(); });

  auth.onAuthStateChanged((user) => {
    currentUser = user;
    if (user) {
      els.userChip.hidden = false;
      els.userChipEmail.textContent = user.email || user.displayName || "";
      showView("library");
      loadLibrary();
    } else {
      els.userChip.hidden = true;
      showView("auth");
    }
  });

  /* ---------------- Library (Firestore) ---------------- */

  function loadLibrary() {
    if (!currentUser) return;
    els.libraryLoading.hidden = false;
    els.libraryEmpty.hidden = true;
    els.libraryGrid.innerHTML = "";

    db.collection("reports")
      .where("owner", "==", currentUser.uid)
      .orderBy("updatedAt", "desc")
      .get()
      .then((snap) => {
        els.libraryLoading.hidden = true;
        if (snap.empty) {
          els.libraryEmpty.hidden = false;
          return;
        }
        snap.forEach((doc) => {
          const data = doc.data();
          renderLibraryCard(doc.id, data);
        });
      })
      .catch((err) => {
        els.libraryLoading.hidden = true;
        els.libraryEmpty.hidden = false;
        els.libraryEmpty.querySelector("p").textContent = err.message;
      });
  }

  function renderLibraryCard(id, data) {
    const card = document.createElement("div");
    card.className = "report-card";
    card.innerHTML = `
      <button type="button" class="report-card-delete" data-id="${escapeAttr(id)}" aria-label="Delete">×</button>
      <div class="report-card-ref">${escapeHtml(data.reference || "")}</div>
      <div class="report-card-title">${escapeHtml(data.reportTitle) || t("untitledReport")}</div>
      <div class="report-card-meta">${escapeHtml(data.organization || "")} · ${formatDateDisplay(data.date)}</div>
    `;
    card.addEventListener("click", (e) => {
      if (e.target.closest(".report-card-delete")) return;
      openReport(id, data);
    });
    card.querySelector(".report-card-delete").addEventListener("click", () => {
      pendingDeleteId = id;
      els.deleteReportOverlay.hidden = false;
    });
    els.libraryGrid.appendChild(card);
  }

  els.deleteReportCancel.addEventListener("click", () => { els.deleteReportOverlay.hidden = true; pendingDeleteId = null; });
  els.deleteReportOk.addEventListener("click", () => {
    els.deleteReportOverlay.hidden = true;
    if (!pendingDeleteId) return;
    db.collection("reports").doc(pendingDeleteId).delete().then(loadLibrary);
    pendingDeleteId = null;
  });

  els.newReportBtn.addEventListener("click", () => {
    const fresh = demoState();
    db.collection("reports").add({
      ...serializeState(fresh),
      owner: currentUser.uid,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }).then((docRef) => {
      fresh.id = docRef.id;
      loadReportIntoEditor(fresh);
      showView("editor");
    });
  });

  function openReport(id, data) {
    const s = emptyState();
    Object.assign(s, data);
    s.id = id;
    if (!Array.isArray(s.sections)) s.sections = [];
    s.sections.forEach((sec) => { if (!sec.id) sec.id = nextSectionId(); });
    loadReportIntoEditor(s);
    showView("editor");
  }

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
      sections: (s.sections || []).map((sec) => ({ title: sec.title || "", content: sec.content || "" })),
      recommendations: s.recommendations || "",
    };
  }

  /* ---------------- Autosave (debounced Firestore write) ---------------- */

  let saveDebounceTimer = null;
  function scheduleSave() {
    clearTimeout(saveDebounceTimer);
    saveDebounceTimer = setTimeout(saveToFirestore, 700);
  }

  function saveToFirestore() {
    if (!state.id || !currentUser) return;
    const payload = serializeState(state);
    payload.owner = currentUser.uid;
    payload.updatedAt = Date.now();
    db.collection("reports").doc(state.id).set(payload, { merge: true })
      .then(flashSavedNotice)
      .catch(() => { /* fail silently — network hiccup, will retry on next edit */ });
  }

  /* ---------------- Load report into editor DOM ---------------- */

  function loadReportIntoEditor(s) {
    state = s;

    els.referenceNumber.value = state.reference || "";
    els.reportDate.value = state.date || todayISO();
    els.organization.value = state.organization || "";
    els.reportTitle.value = state.reportTitle || "";
    els.preparedBy.value = state.preparedBy || "";
    els.preparedFor.value = state.preparedFor || "";
    els.execSummary.value = state.execSummary || "";
    els.recommendations.value = state.recommendations || "";

    setImagePreview(els.logoPreview, els.logoPlaceholder, els.removeLogoBtn, state.logoDataUrl);
    setImagePreview(els.signaturePreview, els.signaturePlaceholder, els.removeSignatureBtn, state.signatureDataUrl);
    setImagePreview(els.framePreview, els.framePlaceholder, els.removeFrameBtn, state.frameDataUrl);

    const radios = els.frameOptions.querySelectorAll('input[name="frameMode"]');
    radios.forEach((r) => { r.checked = r.value === (state.frameMode || "none"); });
    els.frameUploadBox.hidden = state.frameMode !== "custom";

    renderSectionsEditor();
    renderPreview();
  }

  function setImagePreview(imgEl, placeholderEl, removeBtn, dataUrl) {
    if (dataUrl) {
      imgEl.src = dataUrl;
      imgEl.hidden = false;
      placeholderEl.hidden = true;
      removeBtn.hidden = false;
    } else {
      imgEl.hidden = true;
      imgEl.removeAttribute("src");
      placeholderEl.hidden = false;
      removeBtn.hidden = true;
    }
  }

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

  function bindUpload(box, input, placeholder, previewImg, removeBtn, onLoaded, onRemoved) {
    box.addEventListener("click", (e) => { if (!e.target.closest(".remove-img-btn")) input.click(); });
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
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      input.value = "";
      setImagePreview(previewImg, placeholder, removeBtn, null);
      onRemoved();
      renderPreview();
      scheduleSave();
    });

    function handleFile(file) {
      const valid = /\.(png|jpe?g|svg)$/i.test(file.name) || /^image\//.test(file.type);
      if (!valid) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setImagePreview(previewImg, placeholder, removeBtn, dataUrl);
        onLoaded(dataUrl);
        renderPreview();
        scheduleSave();
      };
      reader.readAsDataURL(file);
    }
  }

  bindUpload(els.logoUploadBox, els.logoInput, els.logoPlaceholder, els.logoPreview, els.removeLogoBtn,
    (url) => { state.logoDataUrl = url; }, () => { state.logoDataUrl = null; });

  bindUpload(els.signatureUploadBox, els.signatureInput, els.signaturePlaceholder, els.signaturePreview, els.removeSignatureBtn,
    (url) => { state.signatureDataUrl = url; }, () => { state.signatureDataUrl = null; });

  bindUpload(els.frameUploadBox, els.frameInput, els.framePlaceholder, els.framePreview, els.removeFrameBtn,
    (url) => { state.frameDataUrl = url; }, () => { state.frameDataUrl = null; });

  /* ---------------- Frame mode ---------------- */

  els.frameOptions.addEventListener("change", (e) => {
    if (e.target.name !== "frameMode") return;
    state.frameMode = e.target.value;
    els.frameUploadBox.hidden = state.frameMode !== "custom";
    renderPreview();
    scheduleSave();
  });

  /* ---------------- Basic fields ---------------- */

  function bindTextField(el, stateKey) {
    el.addEventListener("input", () => {
      state[stateKey] = el.value;
      renderPreview();
      scheduleSave();
    });
  }

  bindTextField(els.referenceNumber, "reference");
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
    els.previewRef.textContent = state.reference || "";
    els.previewTitle.textContent = state.reportTitle || t("untitledReport");
    els.previewPreparedBy.textContent = state.preparedBy ? `${t("preparedBy")}: ${state.preparedBy}` : "";
    els.previewPreparedFor.textContent = state.preparedFor ? `${t("preparedFor")}: ${state.preparedFor}` : "";

    const validSections = state.sections.filter((s) => s.title || s.content);
    if (validSections.length > 1) {
      els.previewToc.hidden = false;
      els.previewTocList.innerHTML = validSections.map((s) => `<li>${escapeHtml(s.title) || t("untitledSection")}</li>`).join("");
    } else {
      els.previewToc.hidden = true;
    }

    if (state.execSummary && state.execSummary.trim()) {
      els.previewSummaryBlock.hidden = false;
      els.previewSummary.innerHTML = textToHtml(state.execSummary);
    } else {
      els.previewSummaryBlock.hidden = true;
    }

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

    if (state.recommendations && state.recommendations.trim()) {
      els.previewRecBlock.hidden = false;
      els.previewRec.innerHTML = textToHtml(state.recommendations);
    } else {
      els.previewRecBlock.hidden = true;
    }

    if (state.signatureDataUrl) {
      els.previewSignature.src = state.signatureDataUrl;
      els.previewSignature.hidden = false;
    } else {
      els.previewSignature.hidden = true;
    }

    els.reportSheet.classList.remove("frame-simple", "frame-custom");
    if (state.frameMode === "simple") {
      els.reportSheet.classList.add("frame-simple");
      els.frameLayerImg.hidden = true;
    } else if (state.frameMode === "custom" && state.frameDataUrl) {
      els.reportSheet.classList.add("frame-custom");
      els.frameLayerImg.src = state.frameDataUrl;
      els.frameLayerImg.hidden = false;
    } else {
      els.frameLayerImg.hidden = true;
    }
  }

  /* ---------------- Actions: Print / PDF / Clear ---------------- */

  els.printBtn.addEventListener("click", () => window.print());

  function isReportEmpty() {
    const hasSections = state.sections.some((s) => s.title || s.content);
    return !state.reportTitle && !hasSections && !state.execSummary;
  }

  els.generatePdfBtn.addEventListener("click", () => {
    if (isReportEmpty()) { els.pdfWarnOverlay.hidden = false; return; }
    runGeneratePdf();
  });
  els.pdfWarnCancel.addEventListener("click", () => { els.pdfWarnOverlay.hidden = true; });
  els.pdfWarnOk.addEventListener("click", () => { els.pdfWarnOverlay.hidden = true; runGeneratePdf(); });

  async function runGeneratePdf() {
    const original = els.generatePdfBtn.textContent;
    els.generatePdfBtn.textContent = "…";
    els.generatePdfBtn.disabled = true;
    const sheet = els.reportSheet;
    sheet.classList.add("pdf-capture");
    try {
      const canvas = await html2canvas(sheet, { scale: 2, backgroundColor: "#eef1f6", useCORS: true });
      const imgData = canvas.toDataURL("image/png");

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const footerSpace = 12;
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

      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(9);
        pdf.setTextColor(140);
        pdf.text(`${i}/${totalPages}`, pageWidth / 2, pageHeight - 5, { align: "center" });
      }

      const safeTitle = (state.reportTitle || "report").toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/gi, "-").slice(0, 40);
      pdf.save(`${safeTitle || "report"}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF generation failed. Please try the Print option instead.");
    } finally {
      sheet.classList.remove("pdf-capture");
      els.generatePdfBtn.textContent = original;
      els.generatePdfBtn.disabled = false;
    }
  }

  els.clearBtn.addEventListener("click", () => { els.confirmOverlay.hidden = false; });
  els.confirmCancel.addEventListener("click", () => { els.confirmOverlay.hidden = true; });
  els.confirmOk.addEventListener("click", () => {
    els.confirmOverlay.hidden = true;
    const keepId = state.id;
    const keepRef = state.reference;
    state = emptyState();
    state.id = keepId;
    state.reference = keepRef;
    loadReportIntoEditor(state);
    scheduleSave();
  });

  /* ---------------- Init ---------------- */

  applyLanguage("en");
  showView("auth");
})();
