/* =====================================================================
   محوّل المستندات — أكاديمية مرابطي (ماسح، صورة إلى نص، PDF إلى نص، جدول إلى Excel/Word)
   كل المعالجة داخل المتصفح، لا يُرفع أي ملف إلى أي خادم:
   - Tesseract.js  : التعرف الضوئي على النص (عربي/فرنسي/إنجليزي)
   - OpenCV.js     : كشف حواف المستند، تصحيح المنظور، التحسين، كشف خطوط الجدول
   - pdf.js        : قراءة طبقة النص في PDF وعرض الصفحات الممسوحة
   - jsPDF/pdf-lib : إنشاء PDF متعدد الصفحات و PDF قابل للبحث
   - SheetJS/docx  : تصدير Excel و Word
   تُحمَّل المكتبات عند الحاجة فقط (أول استعمال لكل خدمة).
===================================================================== */
'use strict';

/* ================= المكتبات (تُحمّل عند الطلب) ================= */
const CDN = {
  tess: 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js',
  tessWorker: 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/worker.min.js',
  tessCore: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5.1.1',
  cv: 'https://cdn.jsdelivr.net/npm/@techstark/opencv-js@4.10.0-release.1/dist/opencv.js',
  pdfjs: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  pdfjsWorker: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  jspdf: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  pdflib: 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
  xlsx: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  docx: 'https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.js',
  jsqr: 'https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.min.js',
};
const FREE_LIMIT = 5;
const QMAX = { n: 1600, h: 2400, x: 3508 }; // أطول ضلع للصفحة الممسوحة (Max = A4 بدقة 300dpi)

/* ================= اللغة ================= */
const LANGS = ['ar', 'fr', 'en'];
let LANG = 'ar';
try {
  const a = localStorage.getItem('s2n_lang'), s = localStorage.getItem('site_lang');
  LANG = LANGS.includes(a) ? a : (LANGS.includes(s) ? s : 'ar');
} catch (e) {}
const LI = () => ({ ar: 0, en: 1, fr: 2 })[LANG];

const TX = {
  appName: ['محوّل المستندات', 'Document Converter', 'Convertisseur de documents'],
  brandSub: ['ماسح • نص • جداول', 'Scan • Text • Tables', 'Scan • Texte • Tableaux'],
  heroT: ['حوّل صورك وملفاتك إلى نص قابل للنسخ', 'Turn your photos and files into editable text', 'Transformez vos photos et fichiers en texte modifiable'],
  heroP: ['عربي، فرنسي وإنجليزي. نقوّم الورقة المصوّرة ونزيل الظل تلقائيًا قبل القراءة.', 'Arabic, French and English. Photographed pages are straightened and cleaned automatically before reading.', 'Arabe, français et anglais. Les pages photographiées sont redressées et nettoyées automatiquement.'],
  privShort: ['ملفاتك لا تغادر جهازك', 'Your files never leave your device', 'Vos fichiers restent sur votre appareil'],
  quickT: ['اسحب صورة أو ملف PDF إلى هنا', 'Drop an image or a PDF here', 'Déposez une image ou un PDF ici'],
  quickP: ['نستخرج النص منه مباشرة، أو اختر خدمة من الأسفل', 'We extract its text right away, or pick a service below', 'Nous en extrayons le texte, ou choisissez un service ci-dessous'],
  chooseFile: ['اختيار ملف', 'Choose a file', 'Choisir un fichier'],
  dropT: ['اسحب الملف إلى هنا', 'Drop your file here', 'Déposez votre fichier ici'],
  st1: ['اختر الملف', 'Choose', 'Choisir'], st2: ['راجِع', 'Review', 'Vérifier'], st3: ['احفظ', 'Save', 'Enregistrer'],
  services: ['الخدمات', 'Services', 'Services'],
  scan: ['ماسح المستندات', 'Document scanner', 'Scanner de documents'],
  scanD: ['صوّر مستنداتك واحفظها PDF', 'Scan documents to PDF', 'Numérisez vos documents en PDF'],
  ocr: ['تحويل الصورة إلى نص', 'Image to text', 'Image en texte'],
  ocrD: ['استخرج النص من الصور', 'Extract text from images', 'Extraire le texte des images'],
  pdf: ['تحويل PDF إلى نص', 'PDF to text', 'PDF en texte'],
  pdfD: ['نص قابل للنسخ من أي PDF', 'Copyable text from any PDF', 'Texte copiable depuis un PDF'],
  table: ['تحويل الجدول إلى Excel/Word', 'Table to Excel/Word', 'Tableau vers Excel/Word'],
  tableD: ['حوّل صورة الجدول إلى ملف', 'Turn a table image into a file', 'Convertir un tableau en fichier'],
  history: ['السجل', 'History', 'Historique'],
  seeAll: ['عرض الكل', 'See all', 'Tout voir'],
  noHist: ['لا توجد عناصر بعد. ابدأ بأي خدمة من الأعلى.', 'Nothing here yet. Start with any service above.', 'Rien pour l’instant. Commencez par un service ci-dessus.'],
  pill: ['متبقٍ اليوم: {0}/{1}', 'Left today: {0}/{1}', 'Reste aujourd’hui : {0}/{1}'],
  proPill: ['Pro ✓ غير محدود', 'Pro ✓ unlimited', 'Pro ✓ illimité'],
  camera: ['الكاميرا', 'Camera', 'Caméra'],
  gallery: ['من المعرض', 'From gallery', 'Depuis la galerie'],
  choosePdf: ['اختيار ملف PDF', 'Choose a PDF', 'Choisir un PDF'],
  chooseAny: ['صورة أو PDF', 'Image or PDF', 'Image ou PDF'],
  dropHint: ['يمكنك أيضًا سحب الملفات إلى هنا أو لصق صورة (Ctrl+V).', 'You can also drop files here or paste an image (Ctrl+V).', 'Vous pouvez aussi déposer des fichiers ici ou coller une image (Ctrl+V).'],
  batchHint: ['اختر عدة صور دفعة واحدة لتحويلها كلها. كل صورة تُحتسب تحويلًا.', 'Pick several images at once to convert them all. Each image counts as one conversion.', 'Choisissez plusieurs images d’un coup. Chaque image compte pour une conversion.'],
  privacy: ['تتم كل المعالجة داخل متصفحك، ولا تُرفع ملفاتك إلى أي خادم. © 2026 د. سفيان مرابطي', 'Everything runs in your browser; your files are never uploaded. © 2026 Dr Soufiane Merabti', 'Tout fonctionne dans votre navigateur ; vos fichiers ne sont jamais envoyés. © 2026 Dr Soufiane Merabti'],
  loadEngine: ['تجهيز محرك قراءة النص', 'Preparing the OCR engine', 'Préparation du moteur OCR'],
  loadLangs: ['تحميل نماذج العربية والفرنسية والإنجليزية (مرة واحدة فقط)', 'Downloading Arabic, French and English models (first time only)', 'Téléchargement des modèles arabe, français et anglais (première fois seulement)'],
  loadCv: ['تحميل محرك المسح (مرة واحدة فقط)', 'Loading the scan engine (first time only)', 'Chargement du moteur de numérisation (première fois seulement)'],
  loadLib: ['تجهيز الأدوات', 'Preparing tools', 'Préparation des outils'],
  reading: ['جاري قراءة النص', 'Reading text', 'Lecture du texte'],
  prep: ['تحسين الصورة قبل القراءة', 'Enhancing the image', 'Amélioration de l’image'],
  imgN: ['الصورة {0} من {1}', 'Image {0} of {1}', 'Image {0} sur {1}'],
  pageN: ['الصفحة {0} من {1}', 'Page {0} of {1}', 'Page {0} sur {1}'],
  pageTxt: ['الصفحة {0} من {1}: نص مباشر', 'Page {0} of {1}: text layer', 'Page {0} sur {1} : couche texte'],
  pageOcr: ['الصفحة {0} من {1}: قراءة ضوئية', 'Page {0} of {1}: OCR', 'Page {0} sur {1} : OCR'],
  copyAll: ['نسخ كل النص', 'Copy all', 'Tout copier'],
  copied: ['تم نسخ النص ✓', 'Text copied ✓', 'Texte copié ✓'],
  share: ['مشاركة', 'Share', 'Partager'],
  txt: ['ملف TXT', 'TXT file', 'Fichier TXT'],
  word: ['ملف Word', 'Word file', 'Fichier Word'],
  read: ['قراءة بصوت', 'Read aloud', 'Lire à voix haute'],
  stop: ['إيقاف القراءة', 'Stop reading', 'Arrêter la lecture'],
  noVoice: ['لا يتوفر صوت لهذه اللغة في متصفحك.', 'No voice is available for this language in your browser.', 'Aucune voix disponible pour cette langue dans votre navigateur.'],
  translate: ['ترجمة', 'Translate', 'Traduire'],
  detected: ['اللغة:', 'Language:', 'Langue :'],
  l_ar: ['العربية', 'Arabic', 'Arabe'], l_fr: ['الفرنسية', 'French', 'Français'], l_en: ['الإنجليزية', 'English', 'Anglais'],
  emptyText: ['لم يُعثر على نص واضح. جرّب صورة أوضح أو بإضاءة أفضل.', 'No clear text was found. Try a sharper or better-lit image.', 'Aucun texte net trouvé. Essayez une image plus nette ou mieux éclairée.'],
  trTo: ['ترجمة إلى', 'Translate to', 'Traduire vers'],
  trGo: ['ترجم الآن', 'Translate now', 'Traduire'],
  trNo: ['الترجمة داخل المتصفح غير متوفرة هنا (تعمل في Google Chrome الحديث على الحاسوب). يمكنك فتح النص في ترجمة Google، وعندها يُرسَل النص إلى Google.', 'In-browser translation isn’t available here (it works in recent Google Chrome on desktop). You can open the text in Google Translate, which sends it to Google.', 'La traduction dans le navigateur n’est pas disponible ici (elle fonctionne dans Google Chrome récent sur ordinateur). Vous pouvez ouvrir le texte dans Google Traduction, qui l’envoie à Google.'],
  openGT: ['فتح في ترجمة Google', 'Open in Google Translate', 'Ouvrir dans Google Traduction'],
  trDl: ['تحميل نموذج الترجمة (مرة واحدة)', 'Downloading the translation model (one time)', 'Téléchargement du modèle de traduction (une fois)'],
  translating: ['جاري الترجمة', 'Translating', 'Traduction en cours'],
  trSame: ['اختر لغة مختلفة عن لغة النص.', 'Pick a language different from the text.', 'Choisissez une langue différente du texte.'],
  trResult: ['الترجمة', 'Translation', 'Traduction'],
  newConv: ['تحويل جديد', 'New conversion', 'Nouvelle conversion'],
  home: ['الرئيسية', 'Home', 'Accueil'],
  /* الماسح */
  mDoc: ['مستند', 'Document', 'Document'], mId: ['بطاقة هوية', 'ID card', 'Carte d’identité'], mQr: ['قارئ QR', 'QR reader', 'Lecteur QR'],
  quality: ['الجودة', 'Quality', 'Qualité'], qN: ['عادية', 'Normal', 'Normale'], qH: ['عالية', 'High', 'Haute'], qX: ['قصوى', 'Max', 'Max'],
  adjust: ['اسحب الزوايا الأربع لضبط حدود المستند.', 'Drag the four corners to fit the document.', 'Faites glisser les quatre coins pour ajuster le document.'],
  filter: ['المعالجة', 'Enhancement', 'Amélioration'],
  fEnh: ['ألوان محسّنة', 'Enhanced color', 'Couleur améliorée'], fOrig: ['الأصلية', 'Original', 'Originale'], fGray: ['رمادي', 'Grayscale', 'Gris'], fBw: ['أبيض وأسود', 'Black & white', 'Noir et blanc'],
  bri: ['السطوع', 'Brightness', 'Luminosité'], con: ['التباين', 'Contrast', 'Contraste'], sharp: ['الحدّة', 'Sharpness', 'Netteté'],
  rotate: ['تدوير', 'Rotate', 'Pivoter'], autoDetect: ['كشف تلقائي', 'Auto detect', 'Détection auto'], fullImg: ['الصورة كاملة', 'Whole image', 'Image entière'],
  addPage: ['إضافة الصفحة', 'Add page', 'Ajouter la page'], saveEdit: ['حفظ التعديل', 'Save changes', 'Enregistrer'], cancel: ['إلغاء', 'Cancel', 'Annuler'],
  pagesT: ['الصفحات', 'Pages', 'Pages'], newPage: ['صفحة جديدة', 'New page', 'Nouvelle page'],
  exportPdf: ['حفظ PDF', 'Save PDF', 'Enregistrer en PDF'], exportSearch: ['PDF قابل للبحث', 'Searchable PDF', 'PDF interrogeable'],
  exportImgs: ['حفظ الصور', 'Save images', 'Enregistrer les images'], toText: ['استخراج النص', 'Extract text', 'Extraire le texte'],
  clearAll: ['مسح الكل', 'Clear all', 'Tout effacer'],
  noPages: ['لا توجد صفحات بعد. صوّر مستندًا أو اختر صورة.', 'No pages yet. Take a photo of a document or pick an image.', 'Aucune page. Prenez une photo d’un document ou choisissez une image.'],
  idFront: ['صوّر الوجه الأمامي للبطاقة.', 'Scan the front of the card.', 'Numérisez le recto de la carte.'],
  idBack: ['تم الوجه الأمامي. الآن صوّر الوجه الخلفي.', 'Front done. Now scan the back.', 'Recto fait. Numérisez maintenant le verso.'],
  idDone: ['وُضع الوجهان على صفحة واحدة.', 'Both sides were placed on one page.', 'Les deux faces sont sur une seule page.'],
  qrHint: ['صوّر رمز QR أو اختر صورة تحتوي عليه.', 'Photograph a QR code or pick an image containing one.', 'Photographiez un QR code ou choisissez une image qui en contient un.'],
  qrNone: ['لم يُعثر على رمز في الصورة. اقترب أكثر وحاول مجددًا.', 'No code was found. Move closer and try again.', 'Aucun code trouvé. Rapprochez-vous et réessayez.'],
  qrRes: ['محتوى الرمز', 'Code content', 'Contenu du code'], openLink: ['فتح الرابط', 'Open link', 'Ouvrir le lien'], copy: ['نسخ', 'Copy', 'Copier'],
  del: ['حذف', 'Delete', 'Supprimer'], edit: ['تعديل', 'Edit', 'Modifier'], earlier: ['تقديم', 'Move earlier', 'Avancer'], later: ['تأخير', 'Move later', 'Reculer'],
  scanFree: ['المسح والحفظ مجاني وغير محدود. PDF القابل للبحث واستخراج النص يُحتسبان تحويلًا.', 'Scanning and saving are free and unlimited. A searchable PDF or text extraction counts as a conversion.', 'La numérisation est gratuite et illimitée. Un PDF interrogeable ou l’extraction du texte compte pour une conversion.'],
  detecting: ['كشف حدود المستند', 'Detecting document edges', 'Détection des bords'],
  processing: ['جاري المعالجة', 'Processing', 'Traitement en cours'],
  building: ['إنشاء الملف', 'Building the file', 'Création du fichier'],
  pdfSaved: ['تم حفظ ملف PDF ✓', 'PDF saved ✓', 'PDF enregistré ✓'],
  /* الجدول */
  tblGrid: ['كشف خطوط الجدول', 'Detecting the table grid', 'Détection de la grille'],
  cellN: ['قراءة الخلية {0} من {1}', 'Reading cell {0} of {1}', 'Lecture de la cellule {0} sur {1}'],
  noGrid: ['لم تظهر خطوط واضحة للجدول، فرُتّبت الأعمدة حسب المسافات بين الكلمات. راجع الخلايا قبل التصدير.', 'No clear grid lines were found, so columns were built from the spacing between words. Check the cells before exporting.', 'Aucune grille nette : les colonnes ont été construites d’après l’espacement des mots. Vérifiez avant l’export.'],
  tblEdit: ['انقر على أي خلية لتعديلها، ثم صدّر الملف.', 'Click any cell to edit it, then export.', 'Cliquez sur une cellule pour la modifier, puis exportez.'],
  toXlsx: ['تحميل Excel', 'Download Excel', 'Télécharger Excel'], toDocx: ['تحميل Word', 'Download Word', 'Télécharger Word'],
  pdfPage: ['صفحة الجدول في PDF', 'Table page in the PDF', 'Page du tableau dans le PDF'],
  addRow: ['إضافة صف', 'Add row', 'Ajouter une ligne'], delRow: ['حذف آخر صف', 'Remove last row', 'Supprimer la dernière ligne'],
  tblEmpty: ['لم يُعثر على جدول في الصورة.', 'No table was found in the image.', 'Aucun tableau trouvé dans l’image.'],
  rowsCols: ['{0} صفوف × {1} أعمدة', '{0} rows × {1} columns', '{0} lignes × {1} colonnes'],
  /* الدفع */
  pwT: ['انتهت تحويلاتك المجانية لهذا اليوم', 'You’ve used today’s free conversions', 'Vos conversions gratuites du jour sont épuisées'],
  pwNeed: ['تحتاج {0} تحويلات وبقي لك {1} اليوم.', 'You need {0} conversions and have {1} left today.', 'Il vous faut {0} conversions, il vous en reste {1} aujourd’hui.'],
  pwP: ['لديك 5 تحويلات مجانية كل يوم تتجدد عند منتصف الليل. المسح الضوئي يبقى مجانيًا دائمًا.', 'You get 5 free conversions every day, renewed at midnight. Scanning always stays free.', 'Vous avez 5 conversions gratuites par jour, renouvelées à minuit. La numérisation reste toujours gratuite.'],
  pw1: ['تحويلات غير محدودة كل يوم', 'Unlimited conversions every day', 'Conversions illimitées chaque jour'],
  pw2: ['دفعات كبيرة من الصور وملفات PDF طويلة', 'Large image batches and long PDFs', 'Grands lots d’images et longs PDF'],
  pw3: ['كل أدوات Pro في موقع مرابطي', 'Every Pro tool on merabti.com', 'Tous les outils Pro de merabti.com'],
  pwBtn: ['اشترك في Pro', 'Get Pro', 'Passer à Pro'],
  pwLogin: ['لديك اشتراك؟ سجّل الدخول من صفحة الأدوات ثم عد إلى هنا.', 'Already subscribed? Log in on the tools page, then come back.', 'Déjà abonné ? Connectez-vous sur la page des outils puis revenez.'],
  pwTools: ['صفحة الأدوات', 'Tools page', 'Page des outils'],
  proOn: ['اشتراك Pro مفعّل: تحويلات غير محدودة.', 'Pro is active: unlimited conversions.', 'Pro actif : conversions illimitées.'],
  /* السجل */
  searchPh: ['ابحث داخل النصوص المحفوظة', 'Search saved texts', 'Rechercher dans les textes enregistrés'],
  rename: ['إعادة تسمية', 'Rename', 'Renommer'], newName: ['الاسم الجديد:', 'New name:', 'Nouveau nom :'],
  confirmDel: ['حذف هذا العنصر من السجل؟', 'Delete this item from history?', 'Supprimer cet élément de l’historique ?'],
  open: ['فتح', 'Open', 'Ouvrir'], download: ['تحميل', 'Download', 'Télécharger'],
  noMatch: ['لا توجد نتائج.', 'No results.', 'Aucun résultat.'],
  imgs: ['{0} صور', '{0} images', '{0} images'],
  /* أخطاء */
  errGen: ['حدث خطأ أثناء المعالجة. حاول مرة أخرى.', 'Something went wrong. Please try again.', 'Une erreur est survenue. Réessayez.'],
  errLoad: ['تعذّر تحميل المكتبات. تحقق من اتصال الإنترنت ثم أعد المحاولة.', 'Could not load the libraries. Check your connection and try again.', 'Impossible de charger les bibliothèques. Vérifiez votre connexion.'],
  errPdf: ['تعذّر فتح ملف PDF (قد يكون محميًا بكلمة سر أو تالفًا).', 'Could not open the PDF (it may be password protected or damaged).', 'Impossible d’ouvrir le PDF (protégé par mot de passe ou endommagé).'],
  onlyImg: ['اختر صورة (JPG أو PNG).', 'Choose an image (JPG or PNG).', 'Choisissez une image (JPG ou PNG).'],
  onlyPdf: ['اختر ملف PDF.', 'Choose a PDF file.', 'Choisissez un fichier PDF.'],
};
function t(k, ...a) {
  const v = TX[k]; let s = v ? v[LI()] : k;
  a.forEach((x, i) => { s = s.split('{' + i + '}').join(x); });
  return s;
}
/** نص للعرض داخل HTML: المقاطع اللاتينية (PDF، Excel/Word…) تُعزل بـ <bdi> فلا تختلط بالعربية */
const tb = (k, ...a) => esc(t(k, ...a)).replace(/[A-Za-z][A-Za-z0-9/&.+\-]*(?: [A-Za-z0-9][A-Za-z0-9/&.+\-]*)*/g, m => `<bdi dir="ltr">${m}</bdi>`);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ================= أيقونات ================= */
const IC = {
  scan: '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M4 12h16"/>',
  ocr: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 8h8M12 8v9"/>',
  pdf: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
  table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16M15 4v16"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.5"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 17l-5-5-9 8"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
  dl: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  speak: '<path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  chevS: '<path d="M15 6l-6 6 6 6"/>', chevE: '<path d="M9 6l6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  rot: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
  crown: '<path d="M3 8l4 3 5-6 5 6 4-3-2 11H5z"/>',
  qr: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
};
const svg = (n, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24">${IC[n]}</svg>`;

/* ================= أدوات عامة ================= */
const loaded = {};
function loadScript(url) {
  if (!loaded[url]) {
    loaded[url] = new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = url; s.async = true; s.crossOrigin = 'anonymous';
      s.onload = () => res(); s.onerror = () => { delete loaded[url]; rej(new Error('load ' + url)); };
      document.head.appendChild(s);
    });
  }
  return loaded[url];
}
async function need(...keys) {
  try { await Promise.all(keys.map(k => loadScript(CDN[k]))); }
  catch (e) { throw Object.assign(new Error('libs'), { userMsg: t('errLoad') }); }
  if (keys.includes('pdfjs') && window.pdfjsLib) pdfjsLib.GlobalWorkerOptions.workerSrc = CDN.pdfjsWorker;
}

let cvReady = null;
function loadCV() {
  if (!cvReady) {
    cvReady = (async () => {
      await need('cv');
      // opencv.js يصبح جاهزًا بعد تهيئة WebAssembly
      await new Promise((res, rej) => {
        const t0 = Date.now();
        (function poll() {
          if (window.cv && window.cv.Mat && window.cv.imread) return res();
          if (Date.now() - t0 > 90000) return rej(new Error('cv timeout'));
          setTimeout(poll, 60);
        })();
      });
    })().catch(e => { cvReady = null; throw Object.assign(e, { userMsg: t('errLoad') }); });
  }
  return cvReady;
}

/* ---- شاشة الانتظار ---- */
const busy = {
  show(txt, sub = '') { $('#busy').hidden = false; this.set(txt, sub, 0); this.indet(true); },
  set(txt, sub, p) {
    if (txt != null) $('#busyTxt').textContent = txt;
    if (sub != null) $('#busySub').textContent = sub;
    if (p != null) { this.indet(false); $('#busyBar').style.width = Math.round(Math.max(0, Math.min(1, p)) * 100) + '%'; }
  },
  indet(on) { $('#busyBar').parentElement.style.visibility = on ? 'hidden' : 'visible'; },
  hide() { $('#busy').hidden = true; },
};
let toastTimer;
function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}
function fail(e) {
  console.error(e); busy.hide();
  toast((e && e.userMsg) || t('errGen'));
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
const nextFrame = () => new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));

function saveBlob(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
function stamp() {
  const d = new Date(), p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch (e) {
    const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch (x) {}
    ta.remove(); return ok;
  }
}

/* ---- الصور ---- */
function fileToCanvas(file, maxSide = 4000) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => {
      const s = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
      const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
      g.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url); res(c);
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(Object.assign(new Error('img'), { userMsg: t('onlyImg') })); };
    img.src = url;
  });
}
function scaleCanvas(src, s) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(src.width * s)); c.height = Math.max(1, Math.round(src.height * s));
  const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(src, 0, 0, c.width, c.height);
  return c;
}
function thumbOf(canvas, side = 160) {
  return scaleCanvas(canvas, Math.min(1, side / Math.max(canvas.width, canvas.height))).toDataURL('image/jpeg', 0.7);
}
const isImg = f => f && /^image\//.test(f.type);
const isPdf = f => f && (f.type === 'application/pdf' || /\.pdf$/i.test(f.name || ''));

/* ================= الحصة اليومية + Pro ================= */
let PRO = false;
function today() {
  const d = new Date(), p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
function readQuota() {
  let q = null;
  try { q = JSON.parse(localStorage.getItem('s2n_quota')); } catch (e) {}
  if (!q || typeof q.used !== 'number') q = { day: today(), used: 0, seen: Date.now() };
  const now = Date.now(), d = today();
  // حماية بسيطة: إذا رجعت ساعة الجهاز إلى الوراء لا يُعاد ضبط العداد
  const clockBack = now + 3600e3 < q.seen || d < q.day;
  if (!clockBack && d !== q.day) { q.day = d; q.used = 0; }
  q.seen = Math.max(q.seen || 0, now);
  return q;
}
function writeQuota(q) { try { localStorage.setItem('s2n_quota', JSON.stringify(q)); } catch (e) {} }
function remaining() { return Math.max(0, FREE_LIMIT - readQuota().used); }
/** يتحقق قبل التحويل. يُرجع false ويفتح شاشة Pro إذا لم يكفِ الرصيد. */
function canConvert(n = 1) {
  if (PRO) return true;
  const r = remaining();
  if (r >= n) return true;
  PAYWALL_NEED = { n, r }; location.hash = '#pro';
  return false;
}
function consume(n = 1) {
  if (PRO) return;
  const q = readQuota(); q.used += n; writeQuota(q); updatePill();
}
function updatePill() {
  const el = $('#quotaPill'); if (!el) return;
  if (PRO) { el.textContent = t('proPill'); el.className = 'quota-pill pro'; return; }
  const r = remaining();
  el.textContent = t('pill', r, FREE_LIMIT);
  el.className = 'quota-pill' + (r <= 1 ? ' low' : '');
}
function initPro() {
  try {
    const u = JSON.parse(localStorage.getItem('site_user')), s = JSON.parse(localStorage.getItem('site_sub'));
    PRO = !!(u && s && s.uid === u.uid && s.subscribed);
  } catch (e) {}
  updatePill();
  // نفس منطق الموقع: الاشتراك الفعّال في Firestore، والمدير له كل الصلاحيات
  try {
    if (!window.fbAuth || !window.fbDb) return;
    fbAuth.onAuthStateChanged(async u => {
      if (!u) { PRO = false; updatePill(); return; }
      try {
        const doc = await fbDb.collection('users').doc(u.uid).get();
        const x = doc.exists ? doc.data() : {};
        const sub = x.subscription;
        PRO = x.isAdmin === true || !!(sub && sub.active && sub.expiresAt && sub.expiresAt.toMillis() > Date.now());
      } catch (e) {}
      updatePill();
      if (PRO && location.hash === '#pro') render();
    });
  } catch (e) {}
}

/* ================= السجل (IndexedDB) ================= */
const DB = {
  _db: null,
  open() {
    if (this._db) return this._db;
    this._db = new Promise((res, rej) => {
      const r = indexedDB.open('sora2nas', 1); // اسم داخلي قديم: نبقيه حتى لا يضيع سجل المستخدمين
      r.onupgradeneeded = () => { const s = r.result.createObjectStore('items', { keyPath: 'id' }); s.createIndex('date', 'date'); };
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    });
    return this._db;
  },
  async tx(mode, fn) {
    const db = await this.open();
    return new Promise((res, rej) => {
      const tr = db.transaction('items', mode), st = tr.objectStore('items');
      const out = fn(st);
      tr.oncomplete = () => res(out && out.result !== undefined ? out.result : out);
      tr.onerror = () => rej(tr.error);
    });
  },
  put(item) { return this.tx('readwrite', s => s.put(item)).catch(() => {}); },
  get(id) { return this.tx('readonly', s => s.get(id)).catch(() => null); },
  del(id) { return this.tx('readwrite', s => s.delete(id)).catch(() => {}); },
  async all() {
    try { const list = await this.tx('readonly', s => s.getAll()); return (list || []).sort((a, b) => b.date - a.date); }
    catch (e) { return []; }
  },
};
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/* ================= تنظيف النص وكشف اللغة ================= */
function cleanText(raw) {
  if (!raw) return '';
  let s = raw.normalize('NFKC').replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, '').replace(/\r/g, '').replace(/[\t  ]+/g, ' ');
  s = s.replace(/(\p{L})[-‐]\n(\p{Ll})/gu, '$1$2');                // كلمة مقسومة بشرطة في آخر السطر
  s = s.replace(/(^|\s)\|\s?(?=ل[\u0621-\u064A])/gm, '$1ا');            // «ا» في «ال» تُقرأ أحيانًا «|»
  s = s.replace(/ +([,.;:!?،؛؟)\]»])/g, '$1').replace(/([(\[«]) +/g, '$1');
  const paras = s.split(/\n\s*\n+/).map(p => {
    const lines = p.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return lines.join('');
    const maxLen = Math.max(...lines.map(l => l.length));
    let out = lines[0];
    for (let i = 1; i < lines.length; i++) {
      const prev = lines[i - 1], cur = lines[i];
      const isList = /^([-•*–▪●]|\d{1,3}[.)\-]|[a-zA-Z][.)]|[٠-٩]+[.)\-])\s*/.test(cur);
      const prevEnds = /[.!?؟:؛…»"”]$/.test(prev);
      const shortPrev = prev.length < maxLen * 0.6;
      out += (isList || (prevEnds && shortPrev) || prev.length < 4) ? '\n' + cur : ' ' + cur;
    }
    return out;
  }).filter(Boolean);
  // فقرة قطعها المحرك في منتصف جملة (السطر التالي يبدأ بحرف صغير): نعيد وصلها
  const merged = [];
  paras.forEach(p => {
    const last = merged[merged.length - 1];
    if (last && !/[.!?؟:؛…»"”]$/.test(last) && /^\p{Ll}/u.test(p)) merged[merged.length - 1] = last + ' ' + p;
    else merged.push(p);
  });
  return merged.join('\n\n').replace(/ {2,}/g, ' ')
    // علامات الترقيم العربية التي يقرؤها المحرك بصيغتها اللاتينية
    .replace(/([\u0600-\u06FF]) ?,(?= ?[\u0600-\u06FF])/g, '$1،')
    .replace(/([\u0600-\u06FF]) ?;(?= ?[\u0600-\u06FF])/g, '$1؛')
    .replace(/([\u0600-\u06FF]) ?\?/g, '$1؟')
    .trim();
}
const FR_W = new Set(['le', 'la', 'les', 'des', 'est', 'et', 'une', 'un', 'du', 'pour', 'dans', 'que', 'qui', 'avec', 'sur', 'pas', 'au', 'aux', 'ce', 'cette', 'sont', 'par', 'nous', 'vous', 'il', 'elle', 'ne', 'en', 'de', 'à', 'été', 'mais', 'ou', 'son', 'ses', 'leur']);
const EN_W = new Set(['the', 'and', 'of', 'to', 'is', 'in', 'that', 'for', 'with', 'on', 'this', 'are', 'be', 'it', 'as', 'was', 'by', 'from', 'at', 'an', 'or', 'have', 'has', 'not', 'which', 'you', 'we', 'they', 'will', 'can', 'your']);
function detectLang(text) {
  const ar = (text.match(/[؀-ۿ]/g) || []).length;
  const lat = (text.match(/[A-Za-zÀ-ÿ]/g) || []).length;
  if (ar + lat === 0) return { main: null, parts: [], arRatio: 0 };
  const words = text.toLowerCase().match(/[a-zà-ÿ]+/g) || [];
  let fr = (text.match(/[éèêàçùâîôûœë]/gi) || []).length * 0.6, en = 0;
  words.forEach(w => { if (FR_W.has(w)) fr++; if (EN_W.has(w)) en++; });
  const latLang = fr >= en ? 'fr' : 'en';
  const arRatio = ar / (ar + lat);
  const parts = [];
  if (arRatio > 0.15) parts.push('ar');
  if (arRatio < 0.85) parts.push(latLang);
  return { main: arRatio >= 0.5 ? 'ar' : latLang, parts, arRatio };
}
const isRtlText = s => { const d = detectLang(s || ''); return d.main === 'ar'; };

/* ---- النص المختلط عربي/لاتيني (منقول من تطبيق أندرويد) ---- */
const RLM = '\u200F', LRM = '\u200E';
const isRtlCh = c => /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFC]/.test(c);
const isLtrCh = c => /[A-Za-z\u00C0-\u024F]/.test(c);
function lineIsRtl(s) { let r = 0, l = 0; for (const c of s) { if (isRtlCh(c)) r++; else if (isLtrCh(c)) l++; } return r > 0 && r >= l; }
function firstStrongRtl(s) { for (const c of s) { if (isRtlCh(c)) return true; if (isLtrCh(c)) return false; } return null; }
/** علامة اتجاه غير مرئية أمام كل سطر يبدأ بحرف من الاتجاه المعاكس (سطر عربي يبدأ بـ Windows مثلًا) */
function markLines(text) {
  if (![...text].some(isRtlCh)) return text;
  return text.split('\n').map(line => {
    const clean = line.replace(/[\u200E\u200F]/g, '');
    const first = firstStrongRtl(clean);
    if (first === null) return clean;
    const rtl = lineIsRtl(clean);
    return rtl && !first ? RLM + clean : (!rtl && first ? LRM + clean : clean);
  }).join('\n');
}
const stripMarks = s => (s || '').replace(/[\u200E\u200F]/g, '');
const UNITS = new Set('V kV mV A mA kA W kW MW GW VA kVA MVA var kvar Wh kWh MWh Hz kHz MHz rpm bar mbar Pa kPa MPa K m cm mm km µm kg g t s ms min h l L Nm N kN dB F µF mF DA DZD EUR USD %'.split(' '));
/** المحرك يضع الرقم قبل الكلمة اللاتينية داخل السطر العربي («نظام 11 Windows»): نعيده بعدها، إلا مع الوحدات («250 kW») */
function fixNumberOrder(text) {
  const isNum = t => /\d/.test(t) && !/\p{L}/u.test(t);
  const isLat = t => [...t].some(isLtrCh) && ![...t].some(isRtlCh);
  return text.split('\n').map(line => {
    if (!lineIsRtl(line)) return line;
    const k = line.split(' ');
    for (let i = 0; i < k.length - 1; i++) {
      if (isNum(k[i]) && isLat(k[i + 1]) && !UNITS.has(k[i + 1].replace(/[^\p{L}%µ]/gu, ''))) {
        let j = i + 1;
        while (j + 1 < k.length && isLat(k[j + 1])) j++;
        k.splice(j, 0, k.splice(i, 1)[0]);
        i = j;
      }
    }
    return k.join(' ');
  }).join('\n');
}

/* ================= محرك OCR (Tesseract.js) ================= */
const OCR = {
  workers: {},
  onProgress: null,
  async get(kind = 'all') {
    if (!this.workers[kind]) {
      this.workers[kind] = (async () => {
        await need('tess');
        const langs = { all: ['ara', 'fra', 'eng'], lat: ['fra', 'eng'] }[kind];
        const w = await Tesseract.createWorker(langs, 1, {
          workerPath: CDN.tessWorker, corePath: CDN.tessCore,
          logger: m => {
            if (/loading language|loading tesseract|initializ/i.test(m.status)) busy.set(t('loadLangs'), null, m.progress);
            else if (m.status === 'recognizing text' && this.onProgress) this.onProgress(m.progress);
          },
        });
        // ملاحظة: preserve_interword_spaces=1 يحذف المسافات بين الكلمات العربية، لذلك يبقى 0
        await w.setParameters({ preserve_interword_spaces: '0', user_defined_dpi: '300' });
        return w;
      })().catch(e => { delete this.workers[kind]; throw Object.assign(e, { userMsg: t('errLoad') }); });
    }
    return this.workers[kind];
  },
  /** يقرأ نص صورة (canvas بعد المعالجة) مع كشف اللغة تلقائيًا */
  async read(canvas, onP) {
    const w = await this.get('all');
    this.onProgress = onP;
    await w.setParameters({ tessedit_pageseg_mode: '3' });
    let { data } = await w.recognize(canvas);
    let text = data.text || '';
    let lang = detectLang(text);
    // نص لاتيني فقط: إعادة القراءة بنموذج الفرنسية + الإنجليزية وحده تعطي دقة أعلى
    if (lang.arRatio < 0.03 && text.replace(/\s/g, '').length > 15) {
      const wl = await this.get('lat');
      this.onProgress = onP;
      await wl.setParameters({ tessedit_pageseg_mode: '3' });
      const r2 = await wl.recognize(canvas);
      if ((r2.data.confidence || 0) >= (data.confidence || 0) - 2) { data = r2.data; text = data.text || ''; lang = detectLang(text); }
    } else if (lang.arRatio > 0.3) text = await this.fixStrayLatin(w, canvas, data, text);
    this.onProgress = null;
    return { text: markLines(cleanText(fixNumberOrder(text))), lang, conf: data.confidence };
  },
  /** كلمة لاتينية قصيرة ضعيفة الثقة بين كلمتين عربيتين غالبًا كلمة عربية قُرئت خطأ (مثل «لذلك» ← WI): نعيد قراءتها وحدها */
  async fixStrayLatin(w, canvas, data, text) {
    const bare = s => s.replace(/[‎‏؜]/g, '');
    const isAr = s => /[؀-ۿ]/.test(s);
    const jobs = [];
    for (const L of data.lines || []) {
      const ws = L.words || [];
      for (let i = 1; i < ws.length - 1; i++) {
        const tx = bare(ws[i].text);
        if (/^[A-Za-z]{1,3}$/.test(tx) && ws[i].confidence < 85 && isAr(ws[i - 1].text) && isAr(ws[i + 1].text)) jobs.push({ L, wd: ws[i] });
      }
    }
    if (!jobs.length || jobs.length > 20) return text;
    await w.setParameters({ tessedit_pageseg_mode: '8' });
    for (const { L, wd } of jobs) {
      const b = wd.bbox, pad = Math.round((b.y1 - b.y0) * 0.3);
      const rect = { left: Math.max(0, b.x0 - pad), top: Math.max(0, b.y0 - pad), width: b.x1 - b.x0 + 2 * pad, height: b.y1 - b.y0 + 2 * pad };
      const r = (await w.recognize(canvas, { rectangle: rect })).data;
      const nt = bare(r.text || '').trim();
      if (nt && isAr(nt) && !/[A-Za-z]/.test(nt) && !/\s/.test(nt)) {
        const nl = L.text.replace(wd.text, nt);
        if (nl !== L.text) { text = text.replace(L.text, nl); L.text = nl; }
      }
    }
    await w.setParameters({ tessedit_pageseg_mode: '3' });
    return text;
  },
};

/** تحسين الصورة قبل OCR: تكبير الصغير، رمادي، شد التباين، إزالة التشويش (median)، تبييض الحواف، تصحيح الميلان */
function preprocess(src) {
  const long = Math.max(src.width, src.height);
  let s = 1;
  if (long < 1600) s = Math.min(3, 2200 / long);
  else if (long > 3600) s = 3600 / long;
  let c = s === 1 ? scaleCanvas(src, 1) : scaleCanvas(src, s);
  const g = c.getContext('2d', { willReadFrequently: true });
  const W = c.width, H = c.height;
  const id = g.getImageData(0, 0, W, H), d = id.data;
  const gray = new Uint8ClampedArray(W * H);
  const hist = new Uint32Array(256);
  for (let i = 0, j = 0; j < gray.length; i += 4, j++) {
    const v = (d[i] * 299 + d[i + 1] * 587 + d[i + 2] * 114) / 1000 | 0; gray[j] = v; hist[v]++;
  }
  // شد التباين بين 1% و 99%
  const total = W * H; let acc = 0, lo = 0, hi = 255;
  for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc > total * 0.01) { lo = v; break; } }
  acc = 0; for (let v = 255; v >= 0; v--) { acc += hist[v]; if (acc > total * 0.01) { hi = v; break; } }
  const span = Math.max(30, hi - lo);
  for (let j = 0; j < gray.length; j++) gray[j] = (gray[j] - lo) * 255 / span;
  // median 3x3 لإزالة النقاط الصغيرة
  const med = new Uint8ClampedArray(gray), a = new Array(9);
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    let k = 0;
    for (let dy = -1; dy <= 1; dy++) { const o = (y + dy) * W + x; a[k++] = gray[o - 1]; a[k++] = gray[o]; a[k++] = gray[o + 1]; }
    a.sort((p, q) => p - q); med[y * W + x] = a[4];
  }
  // تبييض شريط رفيع على الحواف: بقايا حافة الورقة أو إطار الصورة تربك تحليل التخطيط
  const mx = Math.max(4, Math.round(W * 0.008)), my = Math.max(4, Math.round(H * 0.008));
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (x < mx || x >= W - mx || y < my || y >= H - my) med[y * W + x] = 255;
  for (let i = 0, j = 0; j < med.length; i += 4, j++) { d[i] = d[i + 1] = d[i + 2] = med[j]; d[i + 3] = 255; }
  g.putImageData(id, 0, 0);
  const ang = estimateSkew(med, W, H);
  if (Math.abs(ang) >= 0.4) c = rotateCanvas(c, -ang);
  return c;
}
/** تقدير زاوية الميلان (درجات) بطريقة إسقاط الصفوف على صورة مصغرة */
function estimateSkew(gray, W, H) {
  const s = Math.min(1, 700 / W), w = Math.max(1, Math.round(W * s)), h = Math.max(1, Math.round(H * s));
  const pts = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (gray[Math.min(H - 1, Math.round(y / s)) * W + Math.min(W - 1, Math.round(x / s))] < 110) pts.push(x, y);
  }
  if (pts.length < 200 || pts.length > w * h * 0.6) return 0;
  let best = 0, bestScore = -1;
  const bins = new Float64Array(h * 2 + 10);
  for (let ang = -8; ang <= 8.001; ang += 0.5) {
    const r = ang * Math.PI / 180, sn = Math.sin(r), cs = Math.cos(r);
    bins.fill(0);
    for (let i = 0; i < pts.length; i += 2) {
      const yy = Math.round(pts[i + 1] * cs - pts[i] * sn) + h / 2 | 0;
      if (yy >= 0 && yy < bins.length) bins[yy]++;
    }
    let sc = 0; for (let i = 1; i < bins.length; i++) { const df = bins[i] - bins[i - 1]; sc += df * df; }
    if (sc > bestScore) { bestScore = sc; best = ang; }
  }
  return best;
}
function rotateCanvas(src, deg) {
  const r = deg * Math.PI / 180, cs = Math.abs(Math.cos(r)), sn = Math.abs(Math.sin(r));
  const c = document.createElement('canvas');
  c.width = Math.round(src.width * cs + src.height * sn); c.height = Math.round(src.width * sn + src.height * cs);
  const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
  g.translate(c.width / 2, c.height / 2); g.rotate(r); g.drawImage(src, -src.width / 2, -src.height / 2);
  return c;
}

/* ================= المسار والعرض ================= */
let CUR = null;           // النتيجة الحالية {id,type,title,text,lang,...}
let PAYWALL_NEED = null;
const SCAN = { pages: [], mode: 'doc', quality: lsGet('s2n_q', 'x'), idFront: null, editing: null };
function lsGet(k, d) { try { return localStorage.getItem(k) || d; } catch (e) { return d; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

function applyLang() {
  const h = document.documentElement;
  h.lang = LANG; h.dir = LANG === 'ar' ? 'rtl' : 'ltr';
  $$('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === LANG));
  $('#brandSub').textContent = t('brandSub');
  $('#brandName').textContent = t('appName');
  $('#privacyNote').textContent = t('privacy');
  document.title = `${t('appName')} | ${LANG === 'ar' ? 'د. سفيان مرابطي' : 'Dr Soufiane Merabti'}`;
  updatePill();
}

function route() { const h = location.hash.replace(/^#/, ''); const [name, arg] = h.split('/'); return { name: name || 'home', arg }; }
async function render() {
  if (window.speechSynthesis) speechSynthesis.cancel();
  const { name, arg } = route();
  $('#backBtn').href = name === 'home' ? '../../tools.html' : '#home';
  const v = $('#view');
  v.onpaste = null; document.onpaste = null;
  window.scrollTo(0, 0);
  switch (name) {
    case 'scan': return viewScan(v);
    case 'edit': return viewEditor(v);
    case 'ocr': return viewOcr(v);
    case 'pdf': return viewPdf(v);
    case 'table': return viewTable(v, arg);
    case 'result': return viewResult(v, arg);
    case 'history': return viewHistory(v);
    case 'pro': return viewPaywall(v);
    default: return viewHome(v);
  }
}

/* ---------------- الرئيسية ---------------- */
async function viewHome(v) {
  const tile = (k, c) => `<a class="tile ${c}" href="#${k}"><span class="ic">${svg(k)}</span><span class="tx"><b>${tb(k)}</b><small>${tb(k + 'D')}</small></span><span class="go">${svg('chevE', 'i flip')}</span></a>`;
  v.innerHTML = `
    <section class="hero">
      <span class="hero-badge">${svg('lock')}${t('privShort')}</span>
      <h1>${tb('heroT')}</h1>
      <p>${tb('heroP')}</p>
      <div class="quick-drop" id="qd">
        <span class="qd-ic">${svg('upload')}</span>
        <b>${tb('quickT')}</b><small>${tb('quickP')}</small>
        <button class="btn primary lg" id="qPick">${svg('plus')}${t('chooseFile')}</button>
      </div>
    </section>
    <h2 class="sec-title">${t('services')}</h2>
    <div class="home-grid">${tile('scan', 'c1')}${tile('ocr', 'c2')}${tile('pdf', 'c3')}${tile('table', 'c4')}</div>
    <section class="card">
      <div class="section-h"><h2>${t('history')}</h2><a class="link-btn" href="#history">${t('seeAll')}</a></div>
      <div class="hist-list" id="hl"></div>
    </section>`;
  const go = files => {
    const pdf = files.find(isPdf), imgs = files.filter(isImg);
    if (imgs.length) runOcr(imgs); else if (pdf) runPdf(pdf); else toast(t('onlyImg'));
  };
  $('#qPick').onclick = e => { e.stopPropagation(); pick('anyIn', go); };
  $('#qd').onclick = () => pick('anyIn', go);
  enableDrop($('#qd'), go);
  const items = (await DB.all()).slice(0, 5);
  if ($('#hl')) renderHistList($('#hl'), items);
}

function typeIcon(type) { return ({ ocr: 'ocr', pdf: 'pdf', table: 'table', scan: 'scan' })[type] || 'doc'; }
function renderHistList(box, items) {
  if (!items.length) { box.innerHTML = `<div class="empty">${t('noHist')}</div>`; return; }
  box.innerHTML = items.map(it => `
    <div class="hist-item" data-id="${esc(it.id)}">
      ${it.thumb ? `<img src="${it.thumb}" alt="">` : `<span class="ph">${svg(typeIcon(it.type))}</span>`}
      <div class="meta"><b>${esc(it.title)}</b>
        <small>${esc(t(it.type === 'ocr' ? 'ocr' : it.type))} · ${new Date(it.date).toLocaleString(LANG === 'ar' ? 'ar-DZ' : LANG)}</small>
        ${it.text ? `<small dir="auto">${esc(it.text.slice(0, 90))}</small>` : ''}</div>
      <div class="acts">
        <button class="mini" data-act="ren" title="${t('rename')}">${svg('pen')}</button>
        <button class="mini danger" data-act="del" title="${t('del')}">${svg('trash')}</button>
      </div>
    </div>`).join('');
  $$('.hist-item', box).forEach(el => {
    el.addEventListener('click', async e => {
      const id = el.dataset.id, act = e.target.closest('[data-act]');
      const it = items.find(x => x.id === id);
      if (act && act.dataset.act === 'del') {
        e.stopPropagation();
        if (confirm(t('confirmDel'))) { await DB.del(id); render(); }
        return;
      }
      if (act && act.dataset.act === 'ren') {
        e.stopPropagation();
        const n = prompt(t('newName'), it.title);
        if (n && n.trim()) { it.title = n.trim(); await DB.put(it); render(); }
        return;
      }
      openItem(it);
    });
  });
}
function openItem(it) {
  if (it.type === 'table') { TABLE = { rows: it.rows, rtl: it.rtl, id: it.id, title: it.title, noGrid: false }; location.hash = '#table/view'; return; }
  if (it.type === 'scan') { if (it.file) saveBlob(it.file, it.fname || 'document.pdf'); return; }
  CUR = it; location.hash = '#result/' + it.id;
}

/* ---------------- السجل ---------------- */
async function viewHistory(v) {
  v.innerHTML = `
    <div class="page-title"><span class="ic c1" style="background:var(--accent-soft);color:var(--accent)">${svg('doc')}</span><div><h1>${t('history')}</h1></div></div>
    <input class="search" id="q" type="search" placeholder="${t('searchPh')}" dir="auto">
    <div class="hist-list" id="hl"></div>`;
  const all = await DB.all();
  if (!$('#q')) return;
  const norm = s => (s || '').toLowerCase().normalize('NFKD').replace(/[ً-ٕـ̀-ͯ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
  const draw = () => {
    const q = norm($('#q').value.trim());
    const list = q ? all.filter(it => norm(it.title + ' ' + (it.text || '') + ' ' + (it.rows ? it.rows.flat().join(' ') : '')).includes(q)) : all;
    if (q && !list.length) $('#hl').innerHTML = `<div class="empty">${t('noMatch')}</div>`;
    else renderHistList($('#hl'), list);
  };
  $('#q').addEventListener('input', draw);
  draw();
}

/* ---------------- إدخال الملفات ---------------- */
function pick(inputId, cb) {
  const inp = $('#' + inputId);
  inp.value = '';
  inp.onchange = () => { const files = [...inp.files]; if (files.length) cb(files); };
  inp.click();
}
function enableDrop(el, cb) {
  el.addEventListener('dragover', e => { e.preventDefault(); el.classList.add('drop-on'); });
  el.addEventListener('dragleave', () => el.classList.remove('drop-on'));
  el.addEventListener('drop', e => { e.preventDefault(); el.classList.remove('drop-on'); const f = [...e.dataTransfer.files]; if (f.length) cb(f); });
  document.onpaste = e => {
    const f = [...(e.clipboardData || {}).items || []].filter(i => i.kind === 'file').map(i => i.getAsFile()).filter(Boolean);
    if (f.length) cb(f);
  };
}
function titleBlock(key, color, step = 1) {
  const st = [1, 2, 3].map(i => `<li class="${i < step ? 'done' : i === step ? 'on' : ''}"><span>${i}</span>${t('st' + i)}</li>`).join('');
  return `<div class="tool-head">
    <div class="th"><span class="ic" style="background:${color[0]};color:${color[1]}">${svg(key)}</span><div><h1>${tb(key)}</h1><p>${tb(key + 'D')}</p></div></div>
    <ol class="steps">${st}</ol></div>`;
}

/* ---------------- صورة إلى نص ---------------- */
function viewOcr(v) {
  v.innerHTML = `
    ${titleBlock('ocr', ['#DDF3E4', '#2E8A5B'])}
    <div class="panel dropzone" id="dz">
      <div class="dz-art"><span class="qd-ic">${svg('upload')}</span><b>${tb('dropT')}</b></div>
      <div class="src-row">
        <button class="src-btn primary" id="bCam">${svg('camera')}${t('camera')}</button>
        <button class="src-btn" id="bGal">${svg('image')}${t('gallery')}</button>
      </div>
      <p class="drop-hint">${t('batchHint')}<br>${t('dropHint')}</p>
    </div>`;
  const go = files => runOcr(files.filter(isImg));
  $('#bCam').onclick = () => pick('camIn', go);
  $('#bGal').onclick = () => pick('galIn', go);
  enableDrop($('#dz'), files => {
    const pdf = files.find(isPdf);
    if (pdf && !files.some(isImg)) { runPdf(pdf); return; }
    go(files);
  });
}
async function runOcr(files) {
  if (!files.length) { toast(t('onlyImg')); return; }
  if (!canConvert(files.length)) return;
  busy.show(t('loadEngine'));
  try {
    await OCR.get('all');
    const parts = []; let thumb = null; const langs = new Set();
    for (let i = 0; i < files.length; i++) {
      const sub = files.length > 1 ? t('imgN', i + 1, files.length) : '';
      busy.set(t('prep'), sub, i / files.length);
      await nextFrame();
      const c = await flattenIfDocument(await fileToCanvas(files[i]));
      if (!thumb) thumb = thumbOf(c);
      const pc = preprocess(c);
      busy.set(t('reading'), sub, i / files.length);
      const r = await OCR.read(pc, p => busy.set(null, null, (i + p) / files.length));
      r.lang.parts.forEach(l => langs.add(l));
      parts.push(files.length > 1 ? `— ${t('imgN', i + 1, files.length)} —\n\n${r.text}` : r.text);
      consume(1);
    }
    const text = parts.join('\n\n').trim();
    const lang = detectLang(text);
    CUR = {
      id: newId(), type: 'ocr', date: Date.now(), thumb,
      title: files.length > 1 ? t('imgs', files.length) : (files[0].name || t('ocr')).replace(/\.[a-z0-9]+$/i, ''),
      text, lang: lang.main, langs: [...langs],
    };
    await DB.put(CUR);
    busy.hide();
    location.hash = '#result/' + CUR.id;
  } catch (e) { fail(e); }
}

/* ---------------- PDF إلى نص ---------------- */
function viewPdf(v) {
  v.innerHTML = `
    ${titleBlock('pdf', ['#FBEAEA', '#C0392B'])}
    <div class="panel dropzone" id="dz">
      <div class="dz-art"><span class="qd-ic">${svg('upload')}</span><b>${tb('dropT')}</b></div>
      <div class="src-row"><button class="src-btn primary" id="bPdf">${svg('pdf')}${t('choosePdf')}</button></div>
      <p class="drop-hint">${t('dropHint')}</p>
    </div>`;
  $('#bPdf').onclick = () => pick('pdfIn', f => runPdf(f[0]));
  enableDrop($('#dz'), f => { const p = f.find(isPdf); p ? runPdf(p) : toast(t('onlyPdf')); });
}
async function openPdf(file) {
  await need('pdfjs');
  try { return await pdfjsLib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise; }
  catch (e) { throw Object.assign(e, { userMsg: t('errPdf') }); }
}
async function renderPdfPage(doc, n, scale = 2.4) {
  const page = await doc.getPage(n);
  let vp = page.getViewport({ scale });
  const maxSide = 4200;
  if (Math.max(vp.width, vp.height) > maxSide) vp = page.getViewport({ scale: scale * maxSide / Math.max(vp.width, vp.height) });
  const c = document.createElement('canvas'); c.width = Math.round(vp.width); c.height = Math.round(vp.height);
  const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
  await page.render({ canvasContext: g, viewport: vp }).promise;
  return c;
}
/** نص الصفحة من طبقة النص، بترتيب المحتوى، مع فواصل الأسطر */
async function pageText(page) {
  const tc = await page.getTextContent();
  let out = '', lastY = null;
  for (const it of tc.items) {
    if (!('str' in it)) continue;
    const y = it.transform ? it.transform[5] : null;
    if (lastY !== null && y !== null && Math.abs(y - lastY) > Math.max(2, (it.height || 10) * 0.6) && !out.endsWith('\n')) out += '\n';
    out += it.str;
    if (it.hasEOL) out += '\n';
    if (y !== null) lastY = y;
  }
  return out.normalize('NFKC');
}
function looksUsable(s) {
  const clean = s.replace(/\s/g, '');
  if (clean.length < 20) return false;
  const bad = (clean.match(/[�-]/g) || []).length;
  if (bad / clean.length >= 0.05) return false;
  // بعض برامج إنشاء PDF تكتب العربية بترتيب بصري معكوس (مثل «ةقاطلا» بدل «الطاقة»)،
  // عندها تكون القراءة الضوئية أدق من طبقة النص
  const w = s.match(/[\u0621-\u064A]{3,}/g) || [];
  if (w.length >= 4) {
    const logical = w.filter(x => /^ال/.test(x) || /ة$/.test(x)).length;
    const reversed = w.filter(x => /لا$/.test(x) || /^ة/.test(x)).length;
    if (reversed > logical) return false;
  }
  return true;
}
async function runPdf(file) {
  if (!file) return;
  if (!canConvert(1)) return;
  busy.show(t('loadLib'));
  try {
    const doc = await openPdf(file);
    const N = doc.numPages, parts = [];
    let thumb = null;
    for (let n = 1; n <= N; n++) {
      const page = await doc.getPage(n);
      let txt = await pageText(page);
      if (n === 1) { const c = await renderPdfPage(doc, 1, 0.6); thumb = thumbOf(c); }
      if (looksUsable(txt)) {
        busy.set(t('pageTxt', n, N), '', (n - 1) / N);
        txt = cleanText(txt);
      } else {
        busy.set(t('pageOcr', n, N), t('reading'), (n - 1) / N);
        await OCR.get('all');
        busy.set(t('pageOcr', n, N), t('reading'), (n - 1) / N);
        const c = await renderPdfPage(doc, n, 2.4);
        const r = await OCR.read(preprocess(c), p => busy.set(null, null, (n - 1 + p) / N));
        txt = r.text;
      }
      parts.push(N > 1 ? `— ${t('pageN', n, N)} —\n\n${txt}` : txt);
      await nextFrame();
    }
    const text = parts.join('\n\n').trim();
    consume(1);
    CUR = { id: newId(), type: 'pdf', date: Date.now(), thumb, title: (file.name || 'PDF').replace(/\.pdf$/i, ''), text, lang: detectLang(text).main };
    await DB.put(CUR);
    busy.hide();
    location.hash = '#result/' + CUR.id;
  } catch (e) { fail(e); }
}

/* ---------------- شاشة النتيجة ---------------- */
async function viewResult(v, id) {
  if (!CUR || CUR.id !== id) CUR = await DB.get(id);
  if (!CUR) { location.hash = '#home'; return; }
  const lang = detectLang(CUR.text || '');
  const tag = lang.parts.length ? lang.parts.map(l => t('l_' + l)).join(' + ') : '—';
  const others = ['ar', 'fr', 'en'].filter(l => l !== lang.main);
  v.innerHTML = `
    ${CUR.type === 'pdf' ? titleBlock('pdf', ['#FBEAEA', '#C0392B'], 3) : titleBlock('ocr', ['#DDF3E4', '#2E8A5B'], 3)}
    <div class="panel">
      <div class="res-head">
        <div><b style="font-size:1.15rem" dir="auto">${esc(CUR.title)}</b><br><span class="lang-tag">${t('detected')} ${tag}</span></div>
        <a class="btn" href="#${CUR.type === 'pdf' ? 'pdf' : 'ocr'}">${svg('plus')}${t('newConv')}</a>
      </div>
      <button class="copy-all" id="bCopy">${svg('copy')}${t('copyAll')}</button>
      ${CUR.text ? '' : `<div class="note">${t('emptyText')}</div>`}
      <textarea class="result-text" id="txt" dir="auto" spellcheck="false">${esc(CUR.text)}</textarea>
      <div class="tools-row">
        <button class="btn" id="bShare">${svg('share')}${t('share')}</button>
        <button class="btn" id="bTxt">${svg('dl')}${t('txt')}</button>
        <button class="btn" id="bDocx">${svg('doc')}${t('word')}</button>
        <button class="btn" id="bSpeak">${svg('speak')}<span>${t('read')}</span></button>
        <button class="btn" id="bTr">${svg('globe')}${t('translate')}</button>
      </div>
      <div class="tr-box" id="trBox" hidden>
        <label for="trTo">${t('trTo')}</label>
        <select id="trTo">${others.map(l => `<option value="${l}">${t('l_' + l)}</option>`).join('')}</select>
        <button class="btn primary" id="bTrGo">${t('trGo')}</button>
      </div>
      <div id="trOut"></div>
    </div>`;
  const ta = $('#txt');
  const getText = () => ta.value;
  let saveT;
  ta.addEventListener('input', () => { clearTimeout(saveT); saveT = setTimeout(() => { CUR.text = ta.value; DB.put(CUR); }, 600); });
  $('#bCopy').onclick = async () => { if (await copyText(getText())) toast(t('copied')); };
  $('#bShare').onclick = async () => {
    if (navigator.share) { try { await navigator.share({ title: CUR.title, text: getText() }); } catch (e) {} }
    else if (await copyText(getText())) toast(t('copied'));
  };
  $('#bTxt').onclick = () => saveBlob(new Blob(['﻿' + getText().replace(/\n/g, '\r\n')], { type: 'text/plain;charset=utf-8' }), `${CUR.title || 'document'}.txt`);
  $('#bDocx').onclick = async () => {
    try { busy.show(t('building')); saveBlob(await textToDocx(getText()), `${CUR.title || 'document'}.docx`); busy.hide(); }
    catch (e) { fail(e); }
  };
  $('#bSpeak').onclick = () => speak(getText(), $('#bSpeak span'));
  $('#bTr').onclick = () => { $('#trBox').hidden = !$('#trBox').hidden; };
  $('#bTrGo').onclick = () => doTranslate(getText(), lang.main || 'ar', $('#trTo').value);
}

/* ---- القراءة بصوت ---- */
function speak(text, label) {
  if (!('speechSynthesis' in window)) { toast(t('noVoice')); return; }
  if (speechSynthesis.speaking) { speechSynthesis.cancel(); label.textContent = t('read'); return; }
  const lang = detectLang(text).main || 'ar';
  const code = { ar: 'ar', fr: 'fr', en: 'en' }[lang];
  const voices = speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(code));
  if (voices.length && !voice) { toast(t('noVoice')); return; }
  // تقسيم النص إلى جمل حتى لا يتوقف المتصفح في النصوص الطويلة
  const chunks = text.match(/[^.!?؟\n]+[.!?؟\n]*/g) || [text];
  chunks.forEach((c, i) => {
    if (!c.trim()) return;
    const u = new SpeechSynthesisUtterance(c.trim());
    u.lang = { ar: 'ar-SA', fr: 'fr-FR', en: 'en-US' }[lang];
    if (voice) u.voice = voice;
    if (i === chunks.length - 1) u.onend = () => { label.textContent = t('read'); };
    speechSynthesis.speak(u);
  });
  label.textContent = t('stop');
}

/* ---- الترجمة على الجهاز (Translator API في Chrome) ---- */
async function doTranslate(text, from, to) {
  const out = $('#trOut');
  if (from === to) { toast(t('trSame')); return; }
  if (!('Translator' in self)) {
    const url = `https://translate.google.com/?sl=${from}&tl=${to}&op=translate&text=${encodeURIComponent(text.slice(0, 4800))}`;
    out.innerHTML = `<div class="note">${t('trNo')}</div><a class="btn" href="${url}" target="_blank" rel="noopener">${svg('globe')}${t('openGT')}</a>`;
    return;
  }
  busy.show(t('trDl'));
  try {
    const tr = await self.Translator.create({
      sourceLanguage: from, targetLanguage: to,
      monitor(m) { m.addEventListener('downloadprogress', e => busy.set(t('trDl'), null, e.loaded)); },
    });
    const paras = text.split(/\n{2,}/), res = [];
    for (let i = 0; i < paras.length; i++) {
      busy.set(t('translating'), '', i / paras.length);
      res.push(paras[i].trim() ? await tr.translate(paras[i]) : '');
    }
    busy.hide();
    const tt = res.join('\n\n');
    out.innerHTML = `<h3>${t('trResult')} (${t('l_' + to)})</h3>
      <button class="copy-all" id="bCopyTr">${svg('copy')}${t('copyAll')}</button>
      <textarea class="result-text" id="trTxt" dir="auto">${esc(tt)}</textarea>`;
    $('#bCopyTr').onclick = async () => { if (await copyText($('#trTxt').value)) toast(t('copied')); };
  } catch (e) {
    busy.hide(); console.error(e);
    const url = `https://translate.google.com/?sl=${from}&tl=${to}&op=translate&text=${encodeURIComponent(text.slice(0, 4800))}`;
    out.innerHTML = `<div class="note">${t('trNo')}</div><a class="btn" href="${url}" target="_blank" rel="noopener">${svg('globe')}${t('openGT')}</a>`;
  }
}

/* ---- Word ---- */
async function textToDocx(text) {
  await need('docx');
  const D = window.docx;
  const paras = text.split('\n').map(line => {
    const rtl = isRtlText(line);
    return new D.Paragraph({
      bidirectional: rtl, alignment: rtl ? D.AlignmentType.RIGHT : D.AlignmentType.LEFT,
      children: [new D.TextRun({ text: line, rightToLeft: rtl, font: rtl ? 'Arial' : 'Calibri', size: 24 })],
    });
  });
  const doc = new D.Document({ creator: 'merabti.com', sections: [{ children: paras }] });
  return D.Packer.toBlob(doc);
}

/* =====================================================================
   الماسح الضوئي
===================================================================== */
function viewScan(v) {
  const m = SCAN.mode;
  const seg = (k, val, cur) => `<button data-v="${val}" class="${cur === val ? 'on' : ''}">${t(k)}</button>`;
  const hint = m === 'qr' ? t('qrHint') : m === 'id' ? (SCAN.idFront ? t('idBack') : t('idFront')) : '';
  v.innerHTML = `
    ${titleBlock('scan', ['#E3EEF4', '#2F5770'])}
    <div class="panel dropzone" id="dz">
      <div class="btn-row scan-opts">
        <div class="seg" id="segMode">${seg('mDoc', 'doc', m)}${seg('mId', 'id', m)}${seg('mQr', 'qr', m)}</div>
        ${m !== 'qr' ? `<div class="btn-row"><b style="font-size:.9rem">${t('quality')}</b><div class="seg" id="segQ">${seg('qN', 'n', SCAN.quality)}${seg('qH', 'h', SCAN.quality)}${seg('qX', 'x', SCAN.quality)}</div></div>` : ''}
      </div>
      ${hint ? `<div class="note">${hint}</div>` : ''}
      <div class="dz-art"><span class="qd-ic">${svg(m === 'qr' ? 'qr' : 'camera')}</span><b>${tb('dropT')}</b></div>
      <div class="src-row">
        <button class="src-btn primary" id="bCam">${svg(m === 'qr' ? 'qr' : 'camera')}${t('camera')}</button>
        <button class="src-btn" id="bGal">${svg('image')}${t('gallery')}</button>
      </div>
      <p class="drop-hint">${t('dropHint')}</p>
      <div id="qrOut"></div>
    </div>
    ${m !== 'qr' ? `
    <div class="panel">
      <div class="res-head"><b style="font-size:1.1rem">${t('pagesT')} (${SCAN.pages.length})</b>
        ${SCAN.pages.length ? `<button class="btn ghost" id="bClear">${svg('trash')}${t('clearAll')}</button>` : ''}</div>
      ${SCAN.pages.length ? `<div class="pages-grid" id="pg"></div>
      <div class="btn-row" style="margin-top:16px">
        <button class="btn primary" id="bPdf">${svg('pdf')}${t('exportPdf')}</button>
        <button class="btn" id="bSearch">${svg('ocr')}${t('exportSearch')}</button>
        <button class="btn" id="bImgs">${svg('image')}${t('exportImgs')}</button>
        <button class="btn" id="bText">${svg('copy')}${t('toText')}</button>
      </div>` : `<div class="empty">${t('noPages')}</div>`}
      <p class="drop-hint">${t('scanFree')}</p>
    </div>` : ''}`;
  $$('#segMode button').forEach(b => b.onclick = () => { SCAN.mode = b.dataset.v; SCAN.idFront = null; viewScan(v); });
  $$('#segQ button').forEach(b => b.onclick = () => { SCAN.quality = b.dataset.v; lsSet('s2n_q', b.dataset.v); viewScan(v); });
  const go = files => {
    const imgs = files.filter(isImg);
    if (!imgs.length) { toast(t('onlyImg')); return; }
    if (SCAN.mode === 'qr') readQr(imgs[0]);
    else startEdit(imgs);
  };
  $('#bCam').onclick = () => pick('camIn', go);
  $('#bGal').onclick = () => pick('galIn', go);
  enableDrop($('#dz'), go);
  if (SCAN.mode === 'qr') return;
  if (SCAN.pages.length) {
    drawPages();
    $('#bClear').onclick = () => { SCAN.pages = []; viewScan(v); };
    $('#bPdf').onclick = () => exportScanPdf(false);
    $('#bSearch').onclick = () => exportScanPdf(true);
    $('#bImgs').onclick = async () => {
      for (let i = 0; i < SCAN.pages.length; i++) {
        saveBlob(await (await fetch(SCAN.pages[i].out)).blob(), `scan-${stamp()}-${i + 1}.jpg`);
        await sleep(350);
      }
    };
    $('#bText').onclick = () => scanToText();
  }
}
function drawPages() {
  const box = $('#pg');
  box.innerHTML = SCAN.pages.map((p, i) => `
    <div class="pg"><span class="num">${i + 1}</span><img src="${p.out}" alt="" data-i="${i}" data-a="edit">
      <div class="acts">
        <button class="mini" data-i="${i}" data-a="up" title="${t('earlier')}" ${i === 0 ? 'disabled' : ''}>${svg('chevS')}</button>
        <button class="mini" data-i="${i}" data-a="edit" title="${t('edit')}">${svg('pen')}</button>
        <button class="mini danger" data-i="${i}" data-a="del" title="${t('del')}">${svg('trash')}</button>
        <button class="mini" data-i="${i}" data-a="down" title="${t('later')}" ${i === SCAN.pages.length - 1 ? 'disabled' : ''}>${svg('chevE')}</button>
      </div></div>`).join('');
  box.onclick = e => {
    const b = e.target.closest('[data-a]'); if (!b || b.disabled) return;
    const i = +b.dataset.i, P = SCAN.pages;
    if (b.dataset.a === 'del') P.splice(i, 1);
    else if (b.dataset.a === 'up' && i > 0) [P[i - 1], P[i]] = [P[i], P[i - 1]];
    else if (b.dataset.a === 'down' && i < P.length - 1) [P[i + 1], P[i]] = [P[i], P[i + 1]];
    else if (b.dataset.a === 'edit') {
      if (P[i].composite) return; // صفحة بطاقة الهوية المركبة
      SCAN.editing = { page: P[i], index: i, queue: [] }; location.hash = '#edit'; return;
    }
    viewScan($('#view'));
  };
}

/* ---- كشف حواف المستند (OpenCV) ---- */
function orderQuad(pts) {
  const s = pts.map(p => p.x + p.y), d = pts.map(p => p.y - p.x);
  const tl = pts[s.indexOf(Math.min(...s))], br = pts[s.indexOf(Math.max(...s))];
  const tr = pts[d.indexOf(Math.min(...d))], bl = pts[d.indexOf(Math.max(...d))];
  const out = [tl, tr, br, bl];
  return new Set(out).size === 4 ? out : null;
}
function defaultQuad(w, h, inset = 0.04) {
  return [{ x: w * inset, y: h * inset }, { x: w * (1 - inset), y: h * inset }, { x: w * (1 - inset), y: h * (1 - inset) }, { x: w * inset, y: h * (1 - inset) }];
}
function detectQuad(canvas) {
  const W = canvas.width, H = canvas.height;
  const s = Math.min(1, 720 / Math.max(W, H));
  const small = scaleCanvas(canvas, s);
  const src = cv.imread(small), gray = new cv.Mat(), edges = new cv.Mat(), tmp = new cv.Mat();
  const area = small.width * small.height;
  let quad = null;
  try {
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    cv.GaussianBlur(gray, gray, new cv.Size(5, 5), 0);
    const tryMask = mask => {
      const contours = new cv.MatVector(), hier = new cv.Mat();
      cv.findContours(mask, contours, hier, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
      const cands = [];
      for (let i = 0; i < contours.size(); i++) { const c = contours.get(i); cands.push({ c, a: cv.contourArea(c) }); }
      cands.sort((a, b) => b.a - a.a);
      let found = null;
      for (const { c, a } of cands.slice(0, 12)) {
        if (a < area * 0.12) break;
        const approx = new cv.Mat();
        cv.approxPolyDP(c, approx, 0.02 * cv.arcLength(c, true), true);
        if (approx.rows === 4 && cv.isContourConvex(approx)) {
          const pts = []; for (let k = 0; k < 4; k++) pts.push({ x: approx.data32S[k * 2], y: approx.data32S[k * 2 + 1] });
          found = orderQuad(pts);
        }
        approx.delete();
        if (found) break;
      }
      if (!found && cands.length && cands[0].a > area * 0.25) {
        const r = cv.minAreaRect(cands[0].c);
        found = orderQuad(cv.RotatedRect.points(r).map(p => ({ x: p.x, y: p.y })));
      }
      cands.forEach(o => o.c.delete()); contours.delete(); hier.delete();
      return found;
    };
    // 1) حواف Canny
    cv.Canny(gray, edges, 40, 130);
    const k = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5));
    cv.morphologyEx(edges, edges, cv.MORPH_CLOSE, k);
    cv.dilate(edges, edges, k);
    quad = tryMask(edges);
    // 2) عتبة Otsu (ورقة فاتحة على خلفية داكنة)
    if (!quad) {
      cv.threshold(gray, tmp, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);
      cv.morphologyEx(tmp, tmp, cv.MORPH_CLOSE, k);
      quad = tryMask(tmp);
    }
    k.delete();
  } finally { src.delete(); gray.delete(); edges.delete(); tmp.delete(); }
  if (!quad) return { quad: defaultQuad(W, H), found: false };
  const full = quad.map(p => ({ x: p.x / s, y: p.y / s }));
  const ref = refineQuad(canvas, full);
  if (ref) return { quad: ref.map(p => ({ x: Math.min(W, Math.max(0, p.x)), y: Math.min(H, Math.max(0, p.y)) })), found: true };
  // إزاحة الزوايا قليلًا نحو الداخل حتى لا تظهر حافة الخلفية في الصفحة
  const cx = quad.reduce((a, p) => a + p.x, 0) / 4, cy = quad.reduce((a, p) => a + p.y, 0) / 4;
  return { quad: quad.map(p => ({ x: Math.min(W, Math.max(0, (p.x + (cx - p.x) * 0.012) / s)), y: Math.min(H, Math.max(0, (p.y + (cy - p.y) * 0.012) / s)) })), found: true };
}
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/**
 * ضبط الحواف بدقة أقل من بكسل (منقول من تطبيق أندرويد): على نسخة 2000 بكسل نبحث على امتداد كل ضلع
 * عن أقوى حافة متعامدة عليه، ونمرر خطًا عبر هذه النقاط (مع إسقاط الشاذة)، والزوايا تقاطعات الخطوط.
 * الخطوط تُزاح قليلًا للداخل حتى لا يبقى شريط من الطاولة. يُرجع null إذا لم تكن النتيجة موثوقة.
 */
function refineQuad(canvas, coarse) {
  const sc = Math.min(1, 2000 / Math.max(canvas.width, canvas.height));
  const m = cv.imread(sc === 1 ? canvas : scaleCanvas(canvas, sc)), g = new cv.Mat();
  cv.cvtColor(m, g, cv.COLOR_RGBA2GRAY); m.delete();
  cv.GaussianBlur(g, g, new cv.Size(0, 0), 1.2);
  const gx = new cv.Mat(), gy = new cv.Mat();
  cv.Sobel(g, gx, cv.CV_32F, 1, 0, 3); cv.Sobel(g, gy, cv.CV_32F, 0, 1, 3);
  const w = g.cols, h = g.rows; g.delete();
  const fx = gx.data32F.slice(), fy = gy.data32F.slice(); gx.delete(); gy.delete();
  const p = coarse.map(q => ({ x: q.x * sc, y: q.y * sc }));
  const cx = p.reduce((a, q) => a + q.x, 0) / 4, cy = p.reduce((a, q) => a + q.y, 0) / 4;
  const radius = Math.max(6, Math.hypot(w, h) * 0.015), SAMPLES = 40, MIN_EDGE = 40, INSET = 2;
  const lines = [];
  for (let i = 0; i < 4; i++) {
    const a = p[i], b = p[(i + 1) % 4], len = Math.hypot(b.x - a.x, b.y - a.y);
    if (len < 20) return null;
    const dx = (b.x - a.x) / len, dy = (b.y - a.y) / len;
    let nx = -dy, ny = dx;
    if ((cx - (a.x + b.x) / 2) * nx + (cy - (a.y + b.y) / 2) * ny < 0) { nx = -nx; ny = -ny; }
    const ts = [], offs = [];
    for (let k = 0; k < SAMPLES; k++) {
      const tt = 0.08 + 0.84 * k / (SAMPLES - 1), sx = a.x + (b.x - a.x) * tt, sy = a.y + (b.y - a.y) * tt;
      let bestO = 0, bestG = 0;
      for (let o = -radius; o <= radius; o += 0.5) {
        const x = (sx + o * nx) | 0, y = (sy + o * ny) | 0;
        if (x > 0 && x < w - 1 && y > 0 && y < h - 1) { const id = y * w + x, gg = Math.abs(fx[id] * nx + fy[id] * ny); if (gg > bestG) { bestG = gg; bestO = o; } }
      }
      if (bestG > MIN_EDGE) { ts.push(tt * len); offs.push(bestO); }
    }
    if (ts.length < SAMPLES / 3) return null;
    const fit = robustLine(ts, offs); if (!fit) return null;
    const c0 = fit[0] + INSET, c1 = fit[1];
    lines.push([a.x + nx * c0, a.y + ny * c0, dx + nx * c1, dy + ny * c1]);
  }
  const out = [];
  for (let i = 0; i < 4; i++) {
    const l1 = lines[(i + 3) % 4], l2 = lines[i], det = l1[2] * l2[3] - l1[3] * l2[2];
    if (Math.abs(det) < 1e-9) return null;
    const tt = ((l2[0] - l1[0]) * l2[3] - (l2[1] - l1[1]) * l2[2]) / det;
    const c = { x: l1[0] + l1[2] * tt, y: l1[1] + l1[3] * tt };
    if (Math.hypot(c.x - p[i].x, c.y - p[i].y) > radius * 1.5) return null;
    out.push(c);
  }
  return out.map(q => ({ x: q.x / sc, y: q.y / sc }));
}
/** خط بالمربعات الصغرى y = a + b·x، يُعاد حسابه بعد حذف النقاط البعيدة */
function robustLine(xs, ys) {
  let idx = xs.map((_, i) => i), fit = null;
  for (let r = 0; r < 3; r++) {
    if (idx.length < 4) return fit;
    const n = idx.length, mx = idx.reduce((a, i) => a + xs[i], 0) / n, my = idx.reduce((a, i) => a + ys[i], 0) / n;
    let sxx = 0, sxy = 0; idx.forEach(i => { sxx += (xs[i] - mx) ** 2; sxy += (xs[i] - mx) * (ys[i] - my); });
    const b = sxx > 1e-9 ? sxy / sxx : 0, a = my - b * mx; fit = [a, b];
    const res = idx.map(i => Math.abs(ys[i] - (a + b * xs[i])));
    const tol = Math.max(2, [...res].sort((u, v) => u - v)[res.length >> 1] * 2.5);
    idx = idx.filter((_, j) => res[j] <= tol);
  }
  return fit;
}

/** صورة هاتف لورقة: نقص الورقة ونقوّمها قبل القراءة (أكبر فرق في الدقة). غير ذلك تُرجع كما هي */
async function flattenIfDocument(c) {
  await loadCV();
  const q = detectQuad(c);
  if (!q.found) return c;
  const [a, b, d, e] = q.quad;
  const area = Math.abs((a.x * b.y - b.x * a.y) + (b.x * d.y - d.x * b.y) + (d.x * e.y - e.x * d.y) + (e.x * a.y - a.x * e.y)) / 2;
  if (area > c.width * c.height * 0.9) return c; // الصورة هي الورقة أصلًا (لقطة شاشة أو مسح)
  return processPage({ src: c, quad: q.quad, filter: 'orig', bri: 0, con: 0, sharp: 0, quality: 'x' });
}

/**
 * «الصفحة البيضاء النظيفة» (منقول من تطبيق أندرويد)، في مكانه على صورة RGB:
 * 1) تقدير لون الورقة تحت الإضاءة الفعلية لكل قناة (closing يزيل النص والأختام ويُبقي حواف الظل)
 * 2) قسمة كل قناة عليه: تختفي الظلال والتظليل والصفرة الناتجة عن إضاءة الغرفة
 * 3) منحنى درجات يجعل الورقة بيضاء تمامًا ويعمّق الحبر
 * 4) رفع التشبع حتى تبقى الأختام والتوقيعات الملونة واضحة
 */
function magicColor(rgb, saturation = 1.3) {
  const bg = estimateColorBackground(rgb);
  cv.divide(rgb, bg, rgb, 255); bg.delete();
  const d = rgb.data, n = d.length / 3;
  // نقطة السواد: 0.3% من أغمق البكسلات
  const hist = new Uint32Array(256);
  for (let i = 0; i < d.length; i += 3) hist[(d[i] * 299 + d[i + 1] * 587 + d[i + 2] * 114) / 1000 | 0]++;
  let acc = 0, black = 0;
  for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc >= n * 0.003) { black = v; break; } }
  black = Math.min(0.45, black / 255);
  const WHITE = 0.86, GAMMA = 1.35, lut = new Uint8Array(256);
  for (let v = 0; v < 256; v++) { const x = Math.min(1, Math.max(0, (v / 255 - black) / (WHITE - black))); lut[v] = Math.round(Math.pow(x, GAMMA) * 255); }
  for (let i = 0; i < d.length; i++) d[i] = lut[d[i]];
  if (saturation !== 1) {
    const hsv = new cv.Mat(); cv.cvtColor(rgb, hsv, cv.COLOR_RGB2HSV);
    const h = hsv.data; for (let i = 1; i < h.length; i += 3) h[i] = Math.min(255, h[i] * saturation);
    cv.cvtColor(hsv, rgb, cv.COLOR_HSV2RGB); hsv.delete();
  }
}
function resizeMax(m, side) {
  const r = Math.min(1, side / Math.max(m.cols, m.rows)), o = new cv.Mat();
  cv.resize(m, o, new cv.Size(Math.max(2, Math.round(m.cols * r)), Math.max(2, Math.round(m.rows * r))), 0, 0, cv.INTER_AREA);
  return o;
}
/** لون الورقة لكل قناة: تقدير دقيق (يحفظ حافة الظل) وتقدير خشن (يمحو الشعارات والكتل الملونة)، ونختار بينهما لكل منطقة */
function estimateColorBackground(rgb) {
  const fine = resizeMax(rgb, 1000);
  const k = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(15, 15));
  cv.morphologyEx(fine, fine, cv.MORPH_CLOSE, k); k.delete();
  cv.medianBlur(fine, fine, 15);
  const coarse = resizeMax(rgb, 250);
  const kc = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(31, 31));
  cv.morphologyEx(coarse, coarse, cv.MORPH_CLOSE, kc); kc.delete();
  cv.GaussianBlur(coarse, coarse, new cv.Size(0, 0), 3);
  const cu = new cv.Mat(); cv.resize(coarse, cu, new cv.Size(fine.cols, fine.rows), 0, 0, cv.INTER_LINEAR); coarse.delete();
  const w = fine.cols, h = fine.rows, f = fine.data, c = cu.data;
  const wt = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const fr = f[3 * i], fg = f[3 * i + 1], fb = f[3 * i + 2], cr = c[3 * i], cg = c[3 * i + 1], cb = c[3 * i + 2];
    const fs = fr + fg + fb + 0.03, cs = cr + cg + cb + 0.03;
    const chroma = Math.max(Math.abs(fr / fs - cr / cs), Math.abs(fg / fs - cg / cs), Math.abs(fb / fs - cb / cs));
    const colourOk = Math.min(1, Math.max(0, (0.06 - chroma) / 0.03));
    const darkOk = Math.min(1, Math.max(0, (fs / cs - 0.25) / 0.15));
    wt[i] = Math.min(colourOk, darkOk);
  }
  const wm = cv.matFromArray(h, w, cv.CV_32FC1, wt);
  cv.GaussianBlur(wm, wm, new cv.Size(0, 0), 4);
  const ww = wm.data32F, small = new cv.Mat(h, w, cv.CV_8UC3), sd = small.data;
  for (let i = 0; i < w * h; i++) for (let ch = 0; ch < 3; ch++) {
    const j = 3 * i + ch; sd[j] = Math.max(10, Math.round(c[j] + ww[i] * (f[j] - c[j])));
  }
  wm.delete(); fine.delete(); cu.delete();
  cv.GaussianBlur(small, small, new cv.Size(0, 0), 2);
  const bg = new cv.Mat(); cv.resize(small, bg, new cv.Size(rgb.cols, rgb.rows), 0, 0, cv.INTER_LINEAR); small.delete();
  return bg;
}

/** قص + تصحيح منظور + تحسين الألوان + السطوع/التباين/الحدة */
function processPage(p) {
  const [tl, tr, br, bl] = p.quad;
  let w = Math.max(dist(tl, tr), dist(bl, br)), h = Math.max(dist(tl, bl), dist(tr, br));
  const lim = QMAX[p.quality || SCAN.quality] || QMAX.x;
  // نحافظ على دقة الصورة الأصلية، ونصغّر فقط إذا تجاوزت الحد
  const s = Math.min(1.6, lim / Math.max(w, h));
  w = Math.max(10, Math.round(w * s)); h = Math.max(10, Math.round(h * s));
  const src = cv.imread(p.src), dst = new cv.Mat();
  const from = cv.matFromArray(4, 1, cv.CV_32FC2, [tl.x, tl.y, tr.x, tr.y, br.x, br.y, bl.x, bl.y]);
  const to = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, w, 0, w, h, 0, h]);
  const M = cv.getPerspectiveTransform(from, to);
  cv.warpPerspective(src, dst, M, new cv.Size(w, h), cv.INTER_LINEAR, cv.BORDER_REPLICATE, new cv.Scalar());
  src.delete(); from.delete(); to.delete(); M.delete();
  cv.cvtColor(dst, dst, cv.COLOR_RGBA2RGB);
  const f = p.filter || 'enh';
  if (f === 'enh') {
    magicColor(dst, 1.3);
  } else if (f === 'gray' || f === 'bw') {
    if (f === 'gray') magicColor(dst, 1.0);
    const g = new cv.Mat(); cv.cvtColor(dst, g, cv.COLOR_RGB2GRAY);
    if (f === 'bw') cv.adaptiveThreshold(g, g, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 31, 12);
    cv.cvtColor(g, dst, cv.COLOR_GRAY2RGB); g.delete();
  }
  const bri = +p.bri || 0, con = +p.con || 0, sh = +p.sharp || 0;
  if (bri || con) { const a = 1 + con / 100; dst.convertTo(dst, -1, a, 128 * (1 - a) + bri * 1.2); }
  if (sh > 0) {
    const b = new cv.Mat();
    cv.GaussianBlur(dst, b, new cv.Size(0, 0), 1.6);
    cv.addWeighted(dst, 1 + sh / 50, b, -sh / 50, 0, dst); b.delete();
  }
  const c = document.createElement('canvas');
  cv.imshow(c, dst); dst.delete();
  return c;
}

/* ---- محرر الصفحة (زوايا + معالجة) ---- */
async function startEdit(files) {
  busy.show(t('loadCv'));
  try {
    await loadCV();
    busy.set(t('detecting'), '', null);
    const c = await fileToCanvas(files[0], 4000);
    const { quad } = detectQuad(c);
    busy.hide();
    SCAN.editing = { page: { src: c, quad, filter: 'enh', bri: 0, con: 0, sharp: 20, quality: SCAN.quality }, index: -1, queue: files.slice(1) };
    if (location.hash === '#edit') render(); else location.hash = '#edit';
  } catch (e) { fail(e); }
}
function viewEditor(v) {
  const E = SCAN.editing;
  if (!E || !window.cv || !window.cv.Mat) { location.hash = '#scan'; return; }
  const p = E.page;
  const seg = (k, val) => `<button data-v="${val}" class="${p.filter === val ? 'on' : ''}">${t(k)}</button>`;
  const sl = (k, min, max) => `<div class="slider"><label for="s_${k}">${t(k)}</label><input id="s_${k}" type="range" min="${min}" max="${max}" value="${k === 'sharp' ? p.sharp : p[k]}"><output id="o_${k}">${k === 'sharp' ? p.sharp : p[k]}</output></div>`;
  v.innerHTML = `
    ${titleBlock('scan', ['#E3EEF4', '#2F5770'], 2)}
    <div class="editor">
      <div class="panel">
        <p style="margin:0 0 10px;color:var(--ink-soft)">${t('adjust')}</p>
        <div class="stage" id="stage"><canvas id="cvs"></canvas><svg class="quad" id="qsvg"><polygon id="poly" fill="rgba(47,87,112,.18)" stroke="#7FD1FF" stroke-width="2.5"/></svg></div>
        <div class="btn-row" style="margin-top:12px">
          <button class="btn" id="bRot">${svg('rot')}${t('rotate')}</button>
          <button class="btn" id="bAuto">${svg('scan')}${t('autoDetect')}</button>
          <button class="btn" id="bFull">${svg('image')}${t('fullImg')}</button>
        </div>
      </div>
      <div class="panel">
        <div class="field"><label>${t('filter')}</label><div class="seg" id="segF">${seg('fEnh', 'enh')}${seg('fOrig', 'orig')}${seg('fGray', 'gray')}${seg('fBw', 'bw')}</div></div>
        ${sl('bri', -60, 60)}${sl('con', -50, 80)}${sl('sharp', 0, 100)}
        <canvas class="out-preview" id="prev"></canvas>
        <div class="btn-row" style="margin-top:14px">
          <button class="btn primary" id="bOk">${svg(E.index >= 0 ? 'pen' : 'plus')}${E.index >= 0 ? t('saveEdit') : t('addPage')}</button>
          <a class="btn ghost" href="#scan">${t('cancel')}</a>
        </div>
      </div>
    </div>`;
  const cvs = $('#cvs'), stage = $('#stage');
  // نسخة عرض مصغرة من الصورة
  const fit = () => {
    const maxW = stage.clientWidth || 600, maxH = Math.min(window.innerHeight * 0.62, 760);
    const s = Math.min(maxW / p.src.width, maxH / p.src.height, 1);
    cvs.width = Math.round(p.src.width * s); cvs.height = Math.round(p.src.height * s);
    cvs.getContext('2d').drawImage(p.src, 0, 0, cvs.width, cvs.height);
    return s;
  };
  let S = fit();
  const handles = [0, 1, 2, 3].map(i => { const h = document.createElement('div'); h.className = 'handle'; h.dataset.i = i; stage.appendChild(h); return h; });
  const place = () => {
    const ox = cvs.offsetLeft, oy = cvs.offsetTop;
    handles.forEach((h, i) => { h.style.left = (ox + p.quad[i].x * S) + 'px'; h.style.top = (oy + p.quad[i].y * S) + 'px'; });
    $('#poly').setAttribute('points', p.quad.map(q => `${ox + q.x * S},${oy + q.y * S}`).join(' '));
  };
  place();
  let prevT;
  const preview = () => {
    clearTimeout(prevT);
    prevT = setTimeout(() => {
      try {
        const sp = Object.assign({}, p, { quality: 'n' });
        // المعاينة على نسخة مصغرة لتكون سريعة
        const s2 = Math.min(1, 900 / Math.max(p.src.width, p.src.height));
        sp.src = scaleCanvas(p.src, s2); sp.quad = p.quad.map(q => ({ x: q.x * s2, y: q.y * s2 }));
        const out = processPage(sp), pv = $('#prev');
        if (!pv) return;
        pv.width = out.width; pv.height = out.height; pv.getContext('2d').drawImage(out, 0, 0);
      } catch (e) { console.error(e); }
    }, 120);
  };
  preview();
  handles.forEach((h, i) => {
    h.addEventListener('pointerdown', e => {
      e.preventDefault(); h.setPointerCapture(e.pointerId);
      const move = ev => {
        const r = cvs.getBoundingClientRect();
        p.quad[i] = { x: Math.min(p.src.width, Math.max(0, (ev.clientX - r.left) / S)), y: Math.min(p.src.height, Math.max(0, (ev.clientY - r.top) / S)) };
        place();
      };
      const up = () => { h.removeEventListener('pointermove', move); h.removeEventListener('pointerup', up); preview(); };
      h.addEventListener('pointermove', move); h.addEventListener('pointerup', up);
    });
  });
  window.onresize = () => { if (route().name === 'edit') { S = fit(); place(); } };
  $('#bRot').onclick = () => {
    const c = document.createElement('canvas'); c.width = p.src.height; c.height = p.src.width;
    const g = c.getContext('2d'); g.translate(c.width, 0); g.rotate(Math.PI / 2); g.drawImage(p.src, 0, 0);
    const H0 = p.src.height;
    p.quad = orderQuad(p.quad.map(q => ({ x: H0 - q.y, y: q.x }))) || defaultQuad(c.width, c.height);
    p.src = c; S = fit(); place(); preview();
  };
  $('#bAuto').onclick = () => { p.quad = detectQuad(p.src).quad; place(); preview(); };
  $('#bFull').onclick = () => { p.quad = defaultQuad(p.src.width, p.src.height, 0); place(); preview(); };
  $$('#segF button').forEach(b => b.onclick = () => { p.filter = b.dataset.v; $$('#segF button').forEach(x => x.classList.toggle('on', x === b)); preview(); });
  ['bri', 'con', 'sharp'].forEach(k => {
    $('#s_' + k).oninput = e => { p[k] = +e.target.value; $('#o_' + k).textContent = e.target.value; preview(); };
  });
  $('#bOk').onclick = async () => {
    busy.show(t('processing'));
    await nextFrame();
    try {
      p.quality = SCAN.quality;
      const out = processPage(p);
      p.out = out.toDataURL('image/jpeg', 0.88); p.w = out.width; p.h = out.height;
      // نسخة PNG بلا فقد للقراءة الضوئية: ضغط JPEG يضعف دقة قراءة الخط العربي الرفيع
      p.png = await new Promise(r => out.toBlob(r, 'image/png'));
      if (E.index >= 0) SCAN.pages[E.index] = p;
      else if (SCAN.mode === 'id') {
        if (!SCAN.idFront) { SCAN.idFront = out; busy.hide(); SCAN.editing = null; location.hash = '#scan'; toast(t('idBack')); return; }
        SCAN.pages.push(composeId(SCAN.idFront, out)); SCAN.idFront = null; toast(t('idDone'));
      } else SCAN.pages.push(p);
      busy.hide();
      SCAN.editing = null;
      if (E.queue && E.queue.length) { startEdit(E.queue); return; }
      location.hash = '#scan';
    } catch (e) { fail(e); }
  };
}
/** وضع وجهي بطاقة الهوية على صفحة A4 واحدة بالحجم الحقيقي (85.6×54 مم) */
function composeId(front, back) {
  const W = 2480, H = 3508, mm = W / 210;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, W, H);
  const cw = 85.6 * mm * 1.25, ch = 54 * mm * 1.25; // أكبر قليلًا من الحجم الحقيقي لتكون أوضح
  [front, back].forEach((img, i) => {
    const s = Math.min(cw / img.width, ch / img.height);
    const w = img.width * s, h = img.height * s;
    const x = (W - w) / 2, y = H * (i === 0 ? 0.12 : 0.52);
    g.drawImage(img, x, y, w, h);
    g.strokeStyle = '#d0d7de'; g.lineWidth = 2; g.strokeRect(x, y, w, h);
  });
  return { composite: true, out: c.toDataURL('image/jpeg', 0.9), w: W, h: H };
}

/* ---- قارئ QR ---- */
async function readQr(file) {
  busy.show(t('processing'));
  try {
    const c = await fileToCanvas(file, 2000);
    let val = null;
    if ('BarcodeDetector' in window) {
      try { const r = await new BarcodeDetector().detect(c); if (r.length) val = r[0].rawValue; } catch (e) {}
    }
    if (!val) {
      await need('jsqr');
      for (const s of [1, 0.6, 0.35]) {
        const sc = s === 1 ? c : scaleCanvas(c, s);
        const d = sc.getContext('2d').getImageData(0, 0, sc.width, sc.height);
        const r = jsQR(d.data, sc.width, sc.height, { inversionAttempts: 'attemptBoth' });
        if (r && r.data) { val = r.data; break; }
      }
    }
    busy.hide();
    const box = $('#qrOut');
    if (!val) { box.innerHTML = `<div class="note">${t('qrNone')}</div>`; return; }
    const isUrl = /^https?:\/\//i.test(val);
    box.innerHTML = `<h3>${t('qrRes')}</h3><div class="qr-out">${esc(val)}</div>
      <div class="btn-row" style="margin-top:10px"><button class="btn primary" id="qCopy">${svg('copy')}${t('copy')}</button>
      ${isUrl ? `<a class="btn" href="${esc(val)}" target="_blank" rel="noopener noreferrer">${svg('globe')}${t('openLink')}</a>` : ''}</div>`;
    $('#qCopy').onclick = async () => { if (await copyText(val)) toast(t('copied')); };
  } catch (e) { fail(e); }
}

/* ---- تصدير PDF من الصفحات الممسوحة ---- */
/** أفضل نسخة من الصفحة للقراءة الضوئية: الورقة المقوّمة بألوانها الأصلية (أدق للقراءة من نسخة التحسين) */
function pageCanvas(p) {
  if (p.src && p.quad && window.cv && cv.Mat) {
    try { return Promise.resolve(processPage(Object.assign({}, p, { filter: 'orig', bri: 0, con: 0, sharp: 0 }))); } catch (e) { console.error(e); }
  }
  return dataUrlToCanvas(p.png ? URL.createObjectURL(p.png) : p.out);
}
function dataUrlToCanvas(url) {
  return new Promise((res, rej) => { const i = new Image(); i.onload = () => { const c = document.createElement('canvas'); c.width = i.naturalWidth; c.height = i.naturalHeight; c.getContext('2d').drawImage(i, 0, 0); res(c); }; i.onerror = rej; i.src = url; });
}
async function exportScanPdf(searchable) {
  if (!SCAN.pages.length) return;
  if (searchable && !canConvert(1)) return;
  busy.show(t('building'));
  try {
    const name = `scan-${stamp()}.pdf`;
    let blob;
    const A4 = [595.28, 841.89];
    const pageSize = p => {
      if (p.composite) return A4;
      // صفحة A4 بنفس اتجاه الصورة، والصورة تملأ الصفحة مع الحفاظ على النسبة
      return p.w > p.h ? [A4[1], A4[0]] : A4;
    };
    if (!searchable) {
      await need('jspdf');
      const { jsPDF } = window.jspdf;
      let doc = null;
      SCAN.pages.forEach((p, i) => {
        const [pw, ph] = pageSize(p);
        if (!doc) doc = new jsPDF({ unit: 'pt', format: [pw, ph], orientation: pw > ph ? 'l' : 'p', compress: true });
        else doc.addPage([pw, ph], pw > ph ? 'l' : 'p');
        const s = Math.min(pw / p.w, ph / p.h), w = p.w * s, h = p.h * s;
        doc.addImage(p.out, 'JPEG', (pw - w) / 2, (ph - h) / 2, w, h, undefined, 'FAST');
        busy.set(null, t('pageN', i + 1, SCAN.pages.length), (i + 1) / SCAN.pages.length);
      });
      blob = doc.output('blob');
    } else {
      await need('pdflib');
      const w = await OCR.get('all');
      const out = await PDFLib.PDFDocument.create();
      for (let i = 0; i < SCAN.pages.length; i++) {
        const p = SCAN.pages[i];
        busy.set(t('reading'), t('pageN', i + 1, SCAN.pages.length), i / SCAN.pages.length);
        const [pw, ph] = pageSize(p);
        const page = out.addPage([pw, ph]);
        const jpg = await out.embedJpg(await (await fetch(p.out)).arrayBuffer());
        const s = Math.min(pw / p.w, ph / p.h), iw = p.w * s, ih = p.h * s, x = (pw - iw) / 2, y = (ph - ih) / 2;
        page.drawImage(jpg, { x, y, width: iw, height: ih });
        // طبقة نص غير مرئية من Tesseract فوق الصورة
        OCR.onProgress = pr => busy.set(null, null, (i + pr) / SCAN.pages.length);
        await w.setParameters({ tessedit_pageseg_mode: '3' });
        const c = await pageCanvas(p);
        const r = await w.recognize(c, { pdfTitle: 'scan', pdfTextOnly: true }, { pdf: true, text: false, blocks: false, hocr: false, tsv: false });
        OCR.onProgress = null;
        if (r.data.pdf) {
          const tdoc = await PDFLib.PDFDocument.load(new Uint8Array(r.data.pdf));
          const [emb] = await out.embedPdf(tdoc, [0]);
          page.drawPage(emb, { x, y, width: iw, height: ih });
        }
      }
      blob = new Blob([await out.save()], { type: 'application/pdf' });
      consume(1);
    }
    saveBlob(blob, name);
    const thumbC = await dataUrlToCanvas(SCAN.pages[0].out);
    await DB.put({ id: newId(), type: 'scan', date: Date.now(), title: `${t('scan')} · ${SCAN.pages.length} ${LANG === 'ar' ? 'صفحة' : 'p.'}`, thumb: thumbOf(thumbC), file: blob, fname: name });
    busy.hide();
    toast(t('pdfSaved'));
  } catch (e) { fail(e); }
}
async function scanToText() {
  if (!canConvert(1)) return;
  busy.show(t('loadEngine'));
  try {
    await OCR.get('all');
    const parts = [], N = SCAN.pages.length;
    for (let i = 0; i < N; i++) {
      busy.set(t('reading'), t('pageN', i + 1, N), i / N);
      const c = await pageCanvas(SCAN.pages[i]);
      const r = await OCR.read(preprocess(c), p => busy.set(null, null, (i + p) / N));
      parts.push(N > 1 ? `— ${t('pageN', i + 1, N)} —\n\n${r.text}` : r.text);
    }
    consume(1);
    const text = parts.join('\n\n').trim();
    CUR = { id: newId(), type: 'ocr', date: Date.now(), title: `${t('scan')} ${stamp()}`, text, lang: detectLang(text).main, thumb: thumbOf(await dataUrlToCanvas(SCAN.pages[0].out)) };
    await DB.put(CUR);
    busy.hide();
    location.hash = '#result/' + CUR.id;
  } catch (e) { fail(e); }
}

/* =====================================================================
   جدول إلى Excel / Word
===================================================================== */
let TABLE = null; // {rows, rtl, id, title, noGrid}
function viewTable(v, arg) {
  if (arg === 'view' && TABLE) return viewTableEdit(v);
  v.innerHTML = `
    ${titleBlock('table', ['#F0E3F8', '#7A4FA3'])}
    <div class="panel dropzone" id="dz">
      <div class="dz-art"><span class="qd-ic">${svg('upload')}</span><b>${tb('dropT')}</b></div>
      <div class="src-row">
        <button class="src-btn primary" id="bCam">${svg('camera')}${t('camera')}</button>
        <button class="src-btn" id="bGal">${svg('image')}${t('gallery')}</button>
        <button class="src-btn" id="bPdf">${svg('pdf')}${t('choosePdf')}</button>
      </div>
      <p class="drop-hint">${t('dropHint')}</p>
    </div>`;
  const go = f => {
    const file = f.find(x => isImg(x) || isPdf(x));
    if (!file) { toast(t('onlyImg')); return; }
    runTable(file);
  };
  $('#bCam').onclick = () => pick('camIn', go);
  $('#bGal').onclick = () => pick('galIn', go);
  $('#bPdf').onclick = () => pick('pdfIn', go);
  enableDrop($('#dz'), go);
}
async function runTable(file) {
  if (!canConvert(1)) return;
  busy.show(t('loadCv'));
  try {
    let canvas;
    if (isPdf(file)) {
      const doc = await openPdf(file);
      let n = 1;
      if (doc.numPages > 1) {
        busy.hide();
        const a = prompt(`${t('pdfPage')} (1–${doc.numPages})`, '1');
        if (a === null) return;
        n = Math.min(doc.numPages, Math.max(1, parseInt(a, 10) || 1));
        busy.show(t('loadCv'));
      }
      canvas = await renderPdfPage(doc, n, 2.8);
    } else canvas = await flattenIfDocument(await fileToCanvas(file, 4000));
    await Promise.all([loadCV(), OCR.get('all')]);
    busy.set(t('tblGrid'), '', null);
    await nextFrame();
    const res = await extractTable(canvas);
    if (!res.rows.length) { busy.hide(); toast(t('tblEmpty')); return; }
    consume(1);
    TABLE = { id: newId(), rows: res.rows, rtl: res.rtl, noGrid: res.noGrid, title: (file.name || t('table')).replace(/\.[a-z0-9]+$/i, '') };
    await DB.put({ id: TABLE.id, type: 'table', date: Date.now(), title: TABLE.title, rows: TABLE.rows, rtl: TABLE.rtl, thumb: thumbOf(canvas), text: TABLE.rows.map(r => r.join(' | ')).join('\n') });
    busy.hide();
    location.hash = '#table/view';
  } catch (e) { fail(e); }
}
const cellText = s => cleanText(s).replace(/\n+/g, ' ').replace(/^[|\[\]{}_—–-]+\s*|\s*[|\[\]{}_—–-]+$/g, '').trim();
function groupLines(arr, thr, minGap) {
  const out = []; let start = -1;
  for (let i = 0; i <= arr.length; i++) {
    const on = i < arr.length && arr[i] >= thr;
    if (on && start < 0) start = i;
    if (!on && start >= 0) { out.push((start + i - 1) / 2); start = -1; }
  }
  return out.filter((v, i, a) => i === 0 || v - a[i - 1] > minGap);
}
/** كشف شبكة الجدول بخطوط OpenCV ثم OCR لكل خلية؛ وإن لم توجد خطوط نرتب الأعمدة حسب المسافات */
async function extractTable(canvas) {
  const pc = preprocess(canvas); // رمادي ومصحح الميلان
  const W = pc.width, H = pc.height;
  const src = cv.imread(pc), gray = new cv.Mat(), bw = new cv.Mat(), hor = new cv.Mat(), ver = new cv.Mat();
  let xs = [], ys = [];
  try {
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    cv.bitwise_not(gray, gray);
    cv.adaptiveThreshold(gray, bw, 255, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY, 15, -2);
    const hk = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(Math.max(15, Math.round(W / 28)), 1));
    const vk = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(1, Math.max(15, Math.round(H / 28))));
    cv.erode(bw, hor, hk); cv.dilate(hor, hor, hk);
    cv.erode(bw, ver, vk); cv.dilate(ver, ver, vk);
    hk.delete(); vk.delete();
    const rowSum = new Float32Array(H), colSum = new Float32Array(W);
    const hd = hor.data, vd = ver.data;
    for (let y = 0; y < H; y++) { let s = 0; const o = y * W; for (let x = 0; x < W; x++) if (hd[o + x]) s++; rowSum[y] = s; }
    for (let y = 0; y < H; y++) { const o = y * W; for (let x = 0; x < W; x++) if (vd[o + x]) colSum[x]++; }
    const mr = Math.max(...rowSum), mc = Math.max(...colSum);
    if (mr > W * 0.15) ys = groupLines(rowSum, mr * 0.4, 10);
    if (mc > H * 0.1) xs = groupLines(colSum, mc * 0.4, 10);
  } finally { src.delete(); gray.delete(); bw.delete(); hor.delete(); ver.delete(); }

  const worker = await OCR.get('all');
  let rows = [], noGrid = false;
  if (ys.length >= 2 && xs.length >= 2) {
    const R = ys.length - 1, C = xs.length - 1, total = R * C;
    await worker.setParameters({ tessedit_pageseg_mode: '6' });
    const g = pc.getContext('2d', { willReadFrequently: true });
    let k = 0;
    for (let r = 0; r < R; r++) {
      const row = [];
      for (let c = 0; c < C; c++) {
        k++;
        const pad = Math.max(6, Math.round(Math.min(W, H) / 250));
        const left = Math.round(xs[c] + pad), top = Math.round(ys[r] + pad);
        const width = Math.round(xs[c + 1] - xs[c] - 2 * pad), height = Math.round(ys[r + 1] - ys[r] - 2 * pad);
        if (width < 8 || height < 8) { row.push(''); continue; }
        // خلية فارغة؟ لا داعي لقراءتها
        const d = g.getImageData(left, top, width, height).data;
        let dark = 0; for (let i = 0; i < d.length; i += 16) if (d[i] < 120) dark++;
        if (dark / (d.length / 16) < 0.004) { row.push(''); continue; }
        busy.set(t('cellN', k, total), '', k / total);
        let { data } = await worker.recognize(pc, { rectangle: { left, top, width, height } });
        let txt = cellText(data.text);
        if (!txt) {
          // المحرك يرفض أحيانًا كلمة واضحة في وضع الكتلة: نعيد قراءة الخلية منفصلة كسطر ثم ككلمة
          const cell = document.createElement('canvas'), m = 24;
          cell.width = width + 2 * m; cell.height = height + 2 * m;
          const cg = cell.getContext('2d'); cg.fillStyle = '#fff'; cg.fillRect(0, 0, cell.width, cell.height);
          cg.drawImage(pc, left, top, width, height, m, m, width, height);
          for (const psm of ['7', '8']) {
            await worker.setParameters({ tessedit_pageseg_mode: psm });
            ({ data } = await worker.recognize(cell));
            txt = cellText(data.text);
            if (txt) break;
          }
          await worker.setParameters({ tessedit_pageseg_mode: '6' });
        }
        row.push(txt);
      }
      rows.push(row);
    }
    await worker.setParameters({ tessedit_pageseg_mode: '3' });
  } else {
    // بدون خطوط: كل سطر صف، والأعمدة تُفصل عند الفراغات الكبيرة بين الكلمات
    noGrid = true;
    busy.set(t('reading'), '', 0);
    OCR.onProgress = p => busy.set(null, null, p);
    await worker.setParameters({ tessedit_pageseg_mode: '6' });
    const { data } = await worker.recognize(pc);
    await worker.setParameters({ tessedit_pageseg_mode: '3' });
    OCR.onProgress = null;
    const lines = (data.lines || []).filter(l => l.words && l.words.length && l.text.trim());
    const rtlAll = isRtlText(data.text || '');
    lines.forEach(l => {
      const words = l.words.filter(w => w.text.trim()).sort((a, b) => rtlAll ? b.bbox.x1 - a.bbox.x1 : a.bbox.x0 - b.bbox.x0);
      if (!words.length) return;
      const hgt = words.reduce((s, w) => s + (w.bbox.y1 - w.bbox.y0), 0) / words.length;
      const cells = [[words[0].text]];
      for (let i = 1; i < words.length; i++) {
        const gap = rtlAll ? words[i - 1].bbox.x0 - words[i].bbox.x1 : words[i].bbox.x0 - words[i - 1].bbox.x1;
        if (gap > hgt * 1.6) cells.push([words[i].text]); else cells[cells.length - 1].push(words[i].text);
      }
      rows.push(cells.map(c => c.join(' ')));
    });
    const C = Math.max(0, ...rows.map(r => r.length));
    rows = rows.map(r => r.concat(Array(C - r.length).fill('')));
    const rtl = rtlAll;
    return { rows, rtl, noGrid };
  }
  // حذف الصفوف والأعمدة الفارغة تمامًا
  rows = rows.filter(r => r.some(c => c));
  if (rows.length) {
    const keep = rows[0].map((_, c) => rows.some(r => r[c]));
    rows = rows.map(r => r.filter((_, c) => keep[c]));
  }
  const rtl = isRtlText(rows.flat().join(' '));
  // الترتيب المنطقي: العمود الأول هو أول عمود في اتجاه القراءة (اليمين للعربية)
  if (rtl) rows = rows.map(r => r.slice().reverse());
  return { rows, rtl, noGrid };
}
function viewTableEdit(v) {
  const T = TABLE;
  const C = Math.max(0, ...T.rows.map(r => r.length));
  v.innerHTML = `
    ${titleBlock('table', ['#F0E3F8', '#7A4FA3'], 3)}
    <div class="panel">
      <div class="res-head"><div><b style="font-size:1.1rem">${esc(T.title)}</b><br><span class="lang-tag">${t('rowsCols', T.rows.length, C)}</span></div>
        <a class="btn" href="#table">${svg('plus')}${t('newConv')}</a></div>
      ${T.noGrid ? `<div class="note">${t('noGrid')}</div>` : ''}
      <p style="color:var(--ink-soft);margin:0 0 10px">${t('tblEdit')}</p>
      <div class="tbl-wrap"><table class="edit" dir="${T.rtl ? 'rtl' : 'ltr'}" id="tbl">${T.rows.map(r => `<tr>${r.map(c => `<td contenteditable="true" dir="auto">${esc(c)}</td>`).join('')}</tr>`).join('')}</table></div>
      <div class="btn-row" style="margin-top:12px">
        <button class="btn" id="bAddR">${svg('plus')}${t('addRow')}</button>
        <button class="btn ghost" id="bDelR">${svg('trash')}${t('delRow')}</button>
      </div>
      <div class="btn-row" style="margin-top:16px">
        <button class="btn primary" id="bX">${svg('table')}${t('toXlsx')}</button>
        <button class="btn primary" id="bW" style="background:#1857A8;border-color:#1857A8">${svg('doc')}${t('toDocx')}</button>
      </div>
    </div>`;
  const read = () => { T.rows = $$('#tbl tr').map(tr => $$('td', tr).map(td => td.innerText.replace(/\n+/g, ' ').trim())); return T.rows; };
  let saveT;
  $('#tbl').addEventListener('input', () => {
    clearTimeout(saveT);
    saveT = setTimeout(async () => { read(); const it = await DB.get(T.id); if (it) { it.rows = T.rows; it.text = T.rows.map(r => r.join(' | ')).join('\n'); DB.put(it); } }, 600);
  });
  $('#bAddR').onclick = () => { read(); T.rows.push(Array(C || 1).fill('')); viewTableEdit(v); };
  $('#bDelR').onclick = () => { read(); if (T.rows.length > 1) T.rows.pop(); viewTableEdit(v); };
  $('#bX').onclick = async () => {
    try {
      await need('xlsx');
      const rows = read();
      const ws = XLSX.utils.aoa_to_sheet(rows.map(r => r.map(c => (/^-?\d+([.,]\d+)?$/.test(c) ? Number(c.replace(',', '.')) : c))));
      ws['!cols'] = (rows[0] || []).map((_, c) => ({ wch: Math.min(50, Math.max(8, ...rows.map(r => (r[c] || '').length + 2))) }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Table');
      if (T.rtl) wb.Workbook = { Views: [{ RTL: true }] };
      XLSX.writeFile(wb, `${T.title || 'table'}.xlsx`);
      lsSet('s2n_tfmt', 'xlsx');
    } catch (e) { fail(e); }
  };
  $('#bW').onclick = async () => {
    try {
      await need('docx');
      const D = window.docx, rows = read();
      const tbl = new D.Table({
        width: { size: 100, type: D.WidthType.PERCENTAGE }, visuallyRightToLeft: T.rtl,
        rows: rows.map((r, ri) => new D.TableRow({
          children: r.map(c => new D.TableCell({
            children: [new D.Paragraph({ bidirectional: T.rtl, alignment: T.rtl ? D.AlignmentType.RIGHT : D.AlignmentType.LEFT, children: [new D.TextRun({ text: c, rightToLeft: isRtlText(c), bold: ri === 0, font: 'Arial', size: 22 })] })],
          })),
        })),
      });
      const doc = new D.Document({ creator: 'merabti.com', sections: [{ properties: rows[0] && rows[0].length > 6 ? { page: { size: { orientation: D.PageOrientation.LANDSCAPE } } } : {}, children: [tbl] }] });
      saveBlob(await D.Packer.toBlob(doc), `${T.title || 'table'}.docx`);
      lsSet('s2n_tfmt', 'docx');
    } catch (e) { fail(e); }
  };
}

/* =====================================================================
   شاشة Pro
===================================================================== */
function viewPaywall(v) {
  if (PRO) {
    v.innerHTML = `<div class="panel paywall"><div class="crown">${svg('crown')}</div><h1>Pro</h1><p>${t('proOn')}</p><a class="btn primary" href="#home">${t('home')}</a></div>`;
    return;
  }
  const need = PAYWALL_NEED;
  const r = remaining();
  v.innerHTML = `
    <div class="panel paywall">
      <div class="crown">${svg('crown')}</div>
      <h1 style="margin:.2em 0">${r === 0 ? t('pwT') : 'Pro'}</h1>
      ${need && need.n > 1 && r > 0 ? `<p><b>${t('pwNeed', need.n, need.r)}</b></p>` : ''}
      <p style="color:var(--ink-soft)">${t('pwP')}</p>
      <ul><li>${t('pw1')}</li><li>${t('pw2')}</li><li>${t('pw3')}</li></ul>
      <div class="btn-row" style="justify-content:center">
        <a class="btn primary" href="../../pricing.html">${svg('crown')}${t('pwBtn')}</a>
        <a class="btn" href="#home">${t('home')}</a>
      </div>
      <p style="margin-top:18px;color:var(--ink-soft);font-size:.9rem">${t('pwLogin')} <a href="../../tools.html">${t('pwTools')}</a></p>
    </div>`;
}

/* ================= التشغيل ================= */
document.addEventListener('DOMContentLoaded', () => {
  $$('.lang-btn').forEach(b => b.addEventListener('click', () => {
    LANG = b.dataset.lang; lsSet('s2n_lang', LANG);
    if (LANG === 'ar' || LANG === 'en') lsSet('site_lang', LANG);
    applyLang(); render();
  }));
  $('#quotaPill').addEventListener('click', () => { if (!PRO) { PAYWALL_NEED = null; location.hash = '#pro'; } });
  $('#quotaPill').style.cursor = 'pointer';
  applyLang();
  initPro();
  render();
  // تحميل قائمة الأصوات مبكرًا (Chrome يحمّلها بشكل غير متزامن)
  if ('speechSynthesis' in window) speechSynthesis.getVoices();
});
window.addEventListener('hashchange', render);
