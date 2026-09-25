/* =====================================================================
   أدوات PDF — أكاديمية مرابطي
   كل المعالجة داخل المتصفح، لا يُرفع أي ملف إلى أي خادم.
   تسجيل الدخول اختياري. الأدوات "قريبًا" مقفلة للجميع ما عدا المدير.
===================================================================== */

/* ================= Google Analytics (GA4) ================= */
(function () {
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-6PKBD7XR0M';
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', 'G-6PKBD7XR0M');
})();

if (window.pdfjsLib) pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

/* =====================================================================
   اللغة — 3 لغات. التخطيط لا ينقلب أبدًا، النصوص فقط تتغير.
   الموقع الرئيسي يدعم ar/en فقط، لذلك الفرنسية تُحفظ في pdf_lang
   ولا تُكتب في site_lang حتى لا تتعطل باقي الصفحات.
===================================================================== */
const LANGS = ['ar', 'en', 'fr'];
let LANG = 'ar';
try {
  const p = localStorage.getItem('pdf_lang'), s = localStorage.getItem('site_lang');
  LANG = LANGS.includes(p) ? p : (LANGS.includes(s) ? s : 'ar');
} catch (e) {}
const LI = () => LANGS.indexOf(LANG);

const TX = {
  tools:['الأدوات','Tools','Outils'], root:['أدوات PDF','PDF Tools','Outils PDF'],
  reset:['ملفات جديدة','New files','Nouveaux fichiers'], dl:['تحميل النتيجة','Download','Télécharger'],
  g_org:['تنظيم','Organize','Organiser'], g_mod:['تعديل','Edit','Modifier'], g_conv:['تحويل','Convert','Convertir'], g_soon:['قريبًا','Coming soon','Bientôt'],
  soonT:['هذه الأداة قيد التطوير','This tool is in development','Cet outil est en développement'],
  soonP:['ستتوفر قريبًا ضمن أدوات PDF.','It will be available soon.','Il sera bientôt disponible.'],
  soonAdm:['أنت ترى هذه الأداة بصفتك مديرًا','You are viewing this as admin','Vous voyez ceci en tant qu’admin'],
  ready:['جاهز:','Ready:','Prêt :'], again:['تحميل مرة أخرى','Download again','Télécharger à nouveau'],
  wImgs:['صورك (JPG أو PNG)','your images (JPG or PNG)','vos images (JPG ou PNG)'],
  wPdfs:['ملفات PDF','PDF files','des fichiers PDF'], wPdf:['ملف PDF','a PDF file','un fichier PDF'], wDocx:['ملف Word (.docx)','a Word file (.docx)','un fichier Word (.docx)'],
  dropT:['اسحب {0} إلى هنا','Drop {0} here','Déposez {0} ici'],
  priv:['تتم المعالجة داخل متصفحك، ولا تُرفع ملفاتك إلى أي خادم.','Everything runs in your browser. Your files are never uploaded.','Tout se fait dans votre navigateur. Vos fichiers ne sont jamais envoyés.'],
  pickDev:['اختيار من الجهاز','Choose from device','Choisir sur l’appareil'],
  addImgs:['أضف صورًا أخرى','Add more images','Ajouter des images'], addFiles:['أضف ملفات أخرى','Add more files','Ajouter des fichiers'],
  openOther:['افتح ملفًا آخر','Open another file','Ouvrir un autre fichier'],
  dragOr:['اسحبها إلى هنا أو اخترها من جهازك','Drop here or choose from your device','Déposez ici ou choisissez sur votre appareil'],
  pickImgs:['اختيار صور','Choose images','Choisir des images'], pickFiles:['اختيار ملفات','Choose files','Choisir des fichiers'],
  onlyImg:['اختر صورًا بصيغة JPG أو PNG.','Choose JPG or PNG images.','Choisissez des images JPG ou PNG.'],
  onlyPdf:['اختر ملفات بصيغة PDF.','Choose PDF files.','Choisissez des fichiers PDF.'],
  onlyDocx:['اختر ملف Word بصيغة .docx.','Choose a .docx Word file.','Choisissez un fichier Word .docx.'],
  readImgs:['جاري قراءة الصور','Reading images','Lecture des images'], readFiles:['جاري قراءة الملفات','Reading files','Lecture des fichiers'],
  locked:['الملف «{0}» محمي بكلمة سر.','"{0}" is password protected.','« {0} » est protégé par mot de passe.'],
  cantOpen:['تعذّر فتح الملف «{0}».','Could not open "{0}".','Impossible d’ouvrir « {0} ».'],
  pShort:['ص','p','p'], rmFile:['إزالة الملف','Remove file','Retirer le fichier'],
  processing:['جاري المعالجة','Processing','Traitement en cours'],
  err:['تعذّرت المعالجة. تأكد أن الملف سليم ثم أعد المحاولة.','Processing failed. Check the file and try again.','Échec du traitement. Vérifiez le fichier et réessayez.'],
  outName:['اسم الملف الناتج','Output file name','Nom du fichier'],
  hMerge:['اسحب الصفحات لتغيير ترتيبها، واسحب بطاقات الملفات لترتيب الملفات كاملة.','Drag pages to reorder them, or drag file cards to reorder whole files.','Glissez les pages pour les réordonner, ou les fichiers pour changer leur ordre.'],
  hRotate:['مرّر المؤشر فوق أي صفحة لتدويرها أو حذفها، واسحبها لتغيير ترتيبها.','Hover a page to rotate or delete it, and drag to reorder.','Survolez une page pour la pivoter ou la supprimer, glissez pour réordonner.'],
  hWord:['يتحول المستند إلى PDF بحجم A4 مع الحفاظ على النصوص والجداول والصور قدر الإمكان.','The document is converted to an A4 PDF, keeping text, tables and images as closely as possible.','Le document est converti en PDF A4 en conservant au mieux textes, tableaux et images.'],
  splitMode:['طريقة التقسيم','Split mode','Mode de division'],
  sManual:['بالنقر بين الصفحات','Click between pages','Clic entre les pages'], sEach:['كل صفحة في ملف','Every page','Chaque page'],
  sEvery:['كل عدد من الصفحات','Every N pages','Toutes les N pages'], sRange:['نطاقات محددة','Custom ranges','Plages personnalisées'],
  sN:['عدد الصفحات في كل ملف','Pages per file','Pages par fichier'], sRanges:['النطاقات','Ranges','Plages'],
  sRangePh:['مثال: 1-3, 5, 8-10','e.g. 1-3, 5, 8-10','ex. 1-3, 5, 8-10'],
  hSplit:['انقر على المسافة بين صفحتين لوضع خط القص، وانقر مرة أخرى لإزالته.','Click the gap between two pages to add a cut, click again to remove it.','Cliquez entre deux pages pour couper, recliquez pour annuler.'],
  wmType:['نوع العلامة','Watermark type','Type de filigrane'], wmText:['نص','Text','Texte'], wmImg:['صورة أو شعار','Image or logo','Image ou logo'],
  wmTextL:['النص','Text','Texte'], color:['اللون','Color','Couleur'], logo:['الشعار','Logo','Logo'],
  chooseImg:['اختيار صورة','Choose image','Choisir une image'], changeImg:['تغيير الصورة','Change image','Changer l’image'],
  size:['الحجم','Size','Taille'], opacity:['الشفافية','Opacity','Opacité'], angle:['الزاوية','Angle','Angle'],
  repeat:['التكرار','Repeat','Répétition'], once:['مرة واحدة','Once','Une fois'], tile:['على كامل الصفحة','Tiled','Mosaïque'],
  pos:['الموضع','Position','Position'], wmDefault:['سري','CONFIDENTIAL','CONFIDENTIEL'],
  addText:['إضافة نص','Add text','Ajouter du texte'], addImage:['إضافة صورة','Add image','Ajouter une image'],
  fontSize:['حجم الخط','Font size','Taille du texte'], weight:['السُّمك','Weight','Graisse'],
  normal:['عادي','Normal','Normal'], bold:['عريض','Bold','Gras'], delEl:['حذف العنصر','Delete item','Supprimer l’élément'],
  typeHere:['اكتب هنا','Type here','Écrivez ici'],
  hEdit1:['انقر على العنصر في المعاينة لتحديده، واسحبه من زر التحريك، واكتب مباشرة داخل النص.','Click an item in the preview to select it, drag it with the move button, and type directly in the text.','Cliquez sur un élément de l’aperçu, déplacez-le avec le bouton de déplacement et écrivez directement dans le texte.'],
  hEdit0:['اختر الصفحة من الأسفل، ثم أضف نصًا أو صورة وستظهر في المعاينة.','Pick a page below, then add text or an image and it will appear in the preview.','Choisissez une page ci-dessous, puis ajoutez du texte ou une image.'],
  quality:['الجودة','Quality','Qualité'], qN:['عادية','Normal','Normale'], qH:['عالية','High','Haute'], qX:['عالية جدًا','Very high','Très haute'],
  format:['الصيغة','Format','Format'],
  hJpg:['حدّد صفحات معيّنة بالنقر على المربع، أو اتركها دون تحديد لتحويل كل الصفحات.','Tick specific pages, or leave all unticked to convert every page.','Cochez des pages précises, ou rien pour tout convertir.'],
  pSize:['حجم الصفحة','Page size','Taille de page'], fitImg:['بحجم الصورة','Fit image','Taille de l’image'],
  orient:['الاتجاه','Orientation','Orientation'], auto:['تلقائي','Auto','Auto'], port:['عمودي','Portrait','Portrait'], land:['أفقي','Landscape','Paysage'],
  margin:['الهوامش','Margins','Marges'], mN:['بدون','None','Aucune'], mS:['صغيرة','Small','Petites'], mL:['كبيرة','Large','Grandes'],
  imgs:['{0} صور','{0} images','{0} images'], img1:['صورة واحدة','1 image','1 image'],
  dragImgs:['اسحب الصور لترتيبها','Drag images to reorder','Glissez pour réordonner'],
  pages:['{0} صفحة','{0} pages','{0} pages'], outFiles:['{0} ملفات ناتجة','{0} output files','{0} fichiers en sortie'],
  outFile1:['ملف ناتج واحد','1 output file','1 fichier en sortie'], fromFiles:['من {0} ملفات','from {0} files','de {0} fichiers'],
  fromFile1:['من ملف واحد','from 1 file','d’un seul fichier'], selN:['{0} محددة','{0} selected','{0} sélectionnées'],
  convAll:['سيتم تحويل الكل','All pages will be converted','Toutes les pages seront converties'],
  editsN:['{0} عناصر مضافة','{0} items added','{0} éléments ajoutés'], pickPage:['اختر صفحة لتعديلها','Pick a page to edit','Choisissez une page'],
  docFile:['المستند','Document','Document'],
  clearCuts:['إزالة كل الخطوط','Clear all cuts','Effacer les coupes'], rotAllL:['تدوير الكل يسارًا','Rotate all left','Tout pivoter à gauche'],
  rotAllR:['تدوير الكل يمينًا','Rotate all right','Tout pivoter à droite'], selAll:['تحديد الكل','Select all','Tout sélectionner'],
  selNone:['إلغاء التحديد','Clear selection','Désélectionner'], del:['حذف','Delete','Supprimer'], delPage:['حذف الصفحة','Delete page','Supprimer la page'],
  rotL:['تدوير يسارًا','Rotate left','Pivoter à gauche'], rotR:['تدوير يمينًا','Rotate right','Pivoter à droite'],
  fileN:['ملف {0}','File {0}','Fichier {0}'], cutLine:['خط القص','Cut here','Couper ici'], move:['تحريك','Move','Déplacer'],
  preview:['المعاينة','Preview','Aperçu'], pageOf:['الصفحة {0} من {1}','Page {0} of {1}','Page {0} sur {1}'],
  pvEmpty:['ستظهر هنا معاينة الصفحة المحددة بحجم كبير.','A large preview of the selected page will appear here.','Un grand aperçu de la page sélectionnée apparaîtra ici.'],
  prev:['الصفحة السابقة','Previous page','Page précédente'], next:['الصفحة التالية','Next page','Page suivante'],
  zIn:['تكبير','Zoom in','Zoom avant'], zOut:['تصغير','Zoom out','Zoom arrière'], zFit:['ملاءمة الشاشة','Fit to screen','Ajuster'],
  bPart:['إنشاء الملف {0} من {1}','Creating file {0} of {1}','Création du fichier {0} sur {1}'],
  bConv:['تحويل الصفحة {0} من {1}','Converting page {0} of {1}','Conversion de la page {0} sur {1}'],
  bImg:['إضافة الصورة {0} من {1}','Adding image {0} of {1}','Ajout de l’image {0} sur {1}'],
  /* تسجيل الدخول */
  login:['تسجيل الدخول','Log in','Connexion'], signup:['إنشاء حساب','Sign up','Créer un compte'], logout:['تسجيل الخروج','Log out','Déconnexion'],
  google:['المتابعة عبر Google','Continue with Google','Continuer avec Google'],
  email:['البريد الإلكتروني','Email','E-mail'], password:['كلمة المرور','Password','Mot de passe'], name:['الاسم','Name','Nom'],
  or:['أو','or','ou'], noAcc:['ليس لديك حساب؟','Don’t have an account?','Pas de compte ?'], hasAcc:['لديك حساب بالفعل؟','Already have an account?','Déjà un compte ?'],
  'auth/email-already-in-use':['هذا البريد مستخدم مسبقًا.','This email is already in use.','Cet e-mail est déjà utilisé.'],
  'auth/invalid-email':['صيغة البريد الإلكتروني غير صحيحة.','Invalid email format.','Format d’e-mail invalide.'],
  'auth/weak-password':['كلمة المرور ضعيفة (6 أحرف على الأقل).','Password too weak (min 6 characters).','Mot de passe trop faible (6 caractères min).'],
  'auth/wrong-password':['كلمة المرور غير صحيحة.','Incorrect password.','Mot de passe incorrect.'],
  'auth/user-not-found':['لا يوجد حساب بهذا البريد.','No account found with this email.','Aucun compte avec cet e-mail.'],
  'auth/invalid-credential':['البريد أو كلمة المرور غير صحيحة.','Incorrect email or password.','E-mail ou mot de passe incorrect.'],
  authDefault:['حدث خطأ، حاول مرة أخرى.','Something went wrong, please try again.','Une erreur est survenue, réessayez.']
};
function t(k, ...a){ const v = TX[k]; let s = v ? (v[LI()] || v[0]) : k; a.forEach((x, i) => s = s.replace('{' + i + '}', x)); return s; }

/* ---------- الأيقونات ---------- */
const I = {
  merge:'<path d="M7 3v5a5 5 0 0 0 10 0V3"/><path d="M12 13v8M9 18l3 3 3-3"/>',
  split:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/>',
  rotR:'<path d="M21 12a9 9 0 1 1-2.64-6.36L21 8"/><path d="M21 3v5h-5"/>',
  rotL:'<path d="M3 12a9 9 0 1 0 2.64-6.36L3 8"/><path d="M3 3v5h5"/>',
  compress:'<path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/>',
  edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  stamp:'<path d="M5 21h14M5 17h14v-2a2 2 0 0 0-2-2h-3V9.7a3 3 0 1 0-4 0V13H7a2 2 0 0 0-2 2z"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  imgpdf:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="m8 17 3-3 2 2 3-3"/>',
  lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  unlock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.6-1.8"/>',
  upload:'<path d="M12 15V4M7 9l5-5 5 5"/><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>',
  download:'<path d="M12 4v11M7 10l5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
  x:'<path d="M6 6l12 12M18 6 6 18"/>',
  trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  reset:'<path d="M12 5v14M5 12h14"/>',
  prev:'<path d="m9 18 6-6-6-6"/>', next:'<path d="m15 18-6-6 6-6"/>',
  plus:'<circle cx="11" cy="11" r="7"/><path d="M11 8v6M8 11h6M20 20l-4-4"/>',
  minus:'<circle cx="11" cy="11" r="7"/><path d="M8 11h6M20 20l-4-4"/>',
  fit:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  check:'<path d="m5 12 5 5 9-10"/>',
  text:'<path d="M5 7V5h14v2M12 5v14M9 19h6"/>',
  move:'<path d="M12 3v18M3 12h18M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  user:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  out:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>'
};
const svg = n => `<svg class="i" viewBox="0 0 24 24">${I[n]}</svg>`;
const GOOGLE_SVG = '<svg viewBox="0 0 48 48" width="18" height="18"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 15.6 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3c-7.6 0-14.1 4.3-17.7 10.7z"/><path fill="#4CAF50" d="M24 45c5.3 0 10.2-2 13.9-5.3l-6.4-5.4C29.3 36 26.8 37 24 37c-5.2 0-9.6-3.1-11.4-7.6l-6.6 5.1C9.8 40.6 16.3 45 24 45z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.4 5.4C40.5 36.6 43 30.8 43 24c0-1.2-.1-2.4-.4-3.5z"/></svg>';

/* =====================================================================
   الأدوات — ready:1 = جاهزة. بدونها = "قريبًا" (مقفلة إلا للمدير).
   alias = الأسماء القديمة المستعملة في روابط ?tool= من tools.html
===================================================================== */
const TOOLS = [
  {id:'merge',g:'org',ready:1,multi:1,c:'#E5532D',ic:'merge',alias:['mergepdf'],
   name:['دمج PDF','Merge PDF','Fusionner PDF'],
   desc:['اجمع عدة ملفات في ملف واحد بالترتيب الذي تريده.','Combine several PDFs into one, in the order you want.','Combinez plusieurs PDF en un seul, dans l’ordre voulu.'],
   run:['دمج الملفات','Merge files','Fusionner']},
  {id:'split',g:'org',ready:1,c:'#E5532D',ic:'split',alias:['splitpdf'],
   name:['تقسيم PDF','Split PDF','Diviser PDF'],
   desc:['قسّم الملف إلى عدة ملفات بالنقر بين الصفحات أو بتحديد نطاقات.','Split a PDF by clicking between pages or by page ranges.','Divisez un PDF en cliquant entre les pages ou par plages.'],
   run:['تقسيم الملف','Split file','Diviser']},
  {id:'rotate',g:'org',ready:1,c:'#9A4F8F',ic:'rotR',
   name:['تدوير PDF','Rotate PDF','Pivoter PDF'],
   desc:['دوّر صفحة واحدة أو كل الصفحات، ورتّبها بالسحب.','Rotate one page or all pages, and reorder them by dragging.','Pivotez une ou toutes les pages et réordonnez-les.'],
   run:['حفظ التدوير','Save rotation','Enregistrer']},
  {id:'edit',g:'mod',ready:1,c:'#9A4F8F',ic:'edit',
   name:['تعديل PDF','Edit PDF','Modifier PDF'],
   desc:['أضف نصوصًا وصورًا فوق صفحات الملف وحرّكها بحرية.','Add text and images on top of your pages and move them freely.','Ajoutez textes et images sur vos pages et déplacez-les librement.'],
   run:['حفظ التعديلات','Save changes','Enregistrer']},
  {id:'watermark',g:'mod',ready:1,c:'#9A4F8F',ic:'stamp',
   name:['علامة مائية','Watermark','Filigrane'],
   desc:['اختم الملف بنص أو شعار، واختر الحجم والشفافية والموضع.','Stamp text or a logo, and choose its size, opacity and position.','Apposez un texte ou un logo, avec taille, opacité et position.'],
   run:['إضافة العلامة','Add watermark','Ajouter']},
  {id:'word2pdf',g:'conv',ready:1,doc:1,c:'#2B5FC9',L:'W',
   name:['Word إلى PDF','Word to PDF','Word en PDF'],
   desc:['حوّل مستند Word (.docx) إلى ملف PDF بحجم A4.','Convert a Word document (.docx) into an A4 PDF.','Convertissez un document Word (.docx) en PDF A4.'],
   run:['تحويل إلى PDF','Convert to PDF','Convertir']},
  {id:'pdf2jpg',g:'conv',ready:1,c:'#C9A20E',ic:'image',alias:['pdf2img'],
   name:['PDF إلى صور','PDF to JPG','PDF en JPG'],
   desc:['حوّل كل صفحة إلى صورة JPG أو PNG بجودة عالية.','Turn each page into a high quality JPG or PNG image.','Transformez chaque page en image JPG ou PNG de haute qualité.'],
   run:['تحويل إلى صور','Convert to images','Convertir']},
  {id:'jpg2pdf',g:'conv',ready:1,img:1,c:'#C9A20E',ic:'imgpdf',alias:['img2pdf'],
   name:['صور إلى PDF','JPG to PDF','JPG en PDF'],
   desc:['اجمع صورك في ملف PDF واحد مع ضبط الحجم والهوامش.','Put your images into one PDF with page size and margins.','Regroupez vos images dans un PDF avec taille et marges.'],
   run:['إنشاء PDF','Create PDF','Créer le PDF']},
  {id:'compress',c:'#6E9E2F',ic:'compress',name:['ضغط PDF','Compress PDF','Compresser PDF'],desc:['تقليل حجم الملف مع الحفاظ على الجودة.','Reduce file size while keeping quality.','Réduire la taille en gardant la qualité.']},
  {id:'pdf2word',c:'#2B5FC9',L:'W',name:['PDF إلى Word','PDF to Word','PDF en Word'],desc:['تحويل الملف إلى مستند DOCX قابل للتعديل.','Convert to an editable DOCX document.','Convertir en document DOCX modifiable.']},
  {id:'pdf2ppt',c:'#D9532C',L:'P',name:['PDF إلى PowerPoint','PDF to PowerPoint','PDF en PowerPoint'],desc:['تحويل الصفحات إلى شرائح PPTX.','Turn pages into PPTX slides.','Transformer les pages en diapositives PPTX.']},
  {id:'pdf2xls',c:'#1E7B45',L:'X',name:['PDF إلى Excel','PDF to Excel','PDF en Excel'],desc:['استخراج الجداول إلى ملف Excel.','Extract tables into an Excel file.','Extraire les tableaux vers Excel.']},
  {id:'ppt2pdf',c:'#D9532C',L:'P',name:['PowerPoint إلى PDF','PowerPoint to PDF','PowerPoint en PDF'],desc:['تحويل العروض التقديمية إلى PDF.','Convert presentations to PDF.','Convertir des présentations en PDF.']},
  {id:'xls2pdf',c:'#1E7B45',L:'X',name:['Excel إلى PDF','Excel to PDF','Excel en PDF'],desc:['تحويل جداول Excel إلى PDF.','Convert spreadsheets to PDF.','Convertir des classeurs en PDF.']},
  {id:'protect',c:'#3C6FB0',ic:'lock',name:['حماية PDF','Protect PDF','Protéger PDF'],desc:['تشفير الملف بكلمة سر.','Encrypt the file with a password.','Chiffrer le fichier par mot de passe.']},
  {id:'unlock',c:'#3C6FB0',ic:'unlock',name:['فك الحماية','Unlock PDF','Déverrouiller PDF'],desc:['إزالة كلمة السر من ملفك.','Remove the password from your file.','Retirer le mot de passe du fichier.']}
];
const tn = (x, k) => x[k] ? (x[k][LI()] || x[k][0]) : '';
const GROUPS = ['org', 'mod', 'conv', 'soon'];
const PAL = ['#C0392B','#2B6FD6','#2E8A5B','#C78A00','#8A4FC2','#0E9AA7','#D64F9A','#5B6B82'];

/* ---------- الحالة ---------- */
let uid = 0;
const S = {tool:'merge',files:[],active:null,pages:[],images:[],docx:null,sel:0,zoom:1,pv:null,result:null,out:'',
  cuts:new Set(),split:{mode:'manual',n:2,ranges:''},selected:new Set(),
  wm:{type:'text',text:t('wmDefault'),size:64,opacity:.22,angle:-35,color:'#C0392B',pos:'mc',tile:false,img:null},
  edits:[],editSel:null,jpg:{q:'h',fmt:'jpg'},img:{size:'a4',orient:'auto',margin:'s'}};
let IS_ADMIN = false;
const $ = s => document.querySelector(s);
const tool = () => TOOLS.find(x => x.id === S.tool);
const file = id => S.files.find(f => f.id === id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function h(tag, cls, html){ const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
function esc(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function toast(m){ const e = $('#toast'); e.textContent = m; e.classList.add('on'); clearTimeout(e._t); e._t = setTimeout(() => e.classList.remove('on'), 2800); }
function busy(m, solid){ $('#busyTxt').textContent = m; $('#busy').classList.toggle('solid', !!solid); $('#busy').classList.add('on'); }
function unbusy(){ $('#busy').classList.remove('on', 'solid'); }
const icoHTML = x => x.L ? `<b>${x.L}</b>` : svg(x.ic);
const fmtSize = b => b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
const FONT = '"Tajawal",Tahoma,sans-serif';

/* =====================================================================
   تطبيق اللغة
===================================================================== */
function applyLang(){
  document.documentElement.lang = LANG;            // الاتجاه يبقى rtl دائمًا
  document.body.classList.toggle('ltr', LANG !== 'ar');
  document.title = t('root') + ' | Dr Soufiane Merabti';
  $('#crumbTools').textContent = t('tools');
  $('#crumbRoot').textContent = t('root');
  $('#btnReset').innerHTML = svg('reset') + `<span class="t">${t('reset')}</span>`; $('#btnReset').title = t('reset');
  $('#btnDl').innerHTML = svg('download') + `<span class="t">${t('dl')}</span>`; $('#btnDl').title = t('dl');
  $('#pvPrev').title = t('prev'); $('#pvNext').title = t('next');
  $('#zIn').title = t('zIn'); $('#zOut').title = t('zOut'); $('#zFit').title = t('zFit');
  $('#pvEmptyTxt').textContent = t('pvEmpty');
  $('#langSelect').value = LANG;
}
$('#langSelect').addEventListener('change', e => {
  const oldDef = t('wmDefault');
  LANG = e.target.value;
  try {
    localStorage.setItem('pdf_lang', LANG);
    if (LANG === 'ar' || LANG === 'en') localStorage.setItem('site_lang', LANG);
  } catch (err) {}
  if (S.wm.text === oldDef) S.wm.text = t('wmDefault');
  applyLang(); renderAuth(); renderAll();
});

/* =====================================================================
   تسجيل الدخول (نفس نمط الموقع الرئيسي) + صلاحية المدير
===================================================================== */
function getCurrentUser(){ try { return JSON.parse(localStorage.getItem('site_user')); } catch (e) { return null; } }
function cacheCurrentUser(u){ try { u ? localStorage.setItem('site_user', JSON.stringify(u)) : localStorage.removeItem('site_user'); } catch (e) {} }
const authErr = code => TX[code] ? t(code) : t('authDefault');

function renderAuthForm(mode, errorMsg){
  const menu = $('#authMenu'); const isLogin = mode === 'login';
  menu.innerHTML = `
    <div class="auth-form">
      <h4>${isLogin ? t('login') : t('signup')}</h4>
      ${errorMsg ? `<p class="auth-error">${esc(errorMsg)}</p>` : ''}
      <form id="authForm">
        ${!isLogin ? `<input type="text" id="authName" placeholder="${t('name')}" required>` : ''}
        <input type="email" id="authEmail" placeholder="${t('email')}" required dir="ltr">
        <input type="password" id="authPassword" placeholder="${t('password')}" required minlength="6" dir="ltr">
        <button type="submit" class="auth-submit" id="authSubmitBtn">${isLogin ? t('login') : t('signup')}</button>
      </form>
      <div class="auth-divider">${t('or')}</div>
      <button type="button" class="auth-google-btn" id="googleAuthBtn">${GOOGLE_SVG}${t('google')}</button>
      <div class="auth-switch">${isLogin ? t('noAcc') : t('hasAcc')} <button type="button" id="authSwitchBtn">${isLogin ? t('signup') : t('login')}</button></div>
    </div>`;
  $('#authForm').addEventListener('submit', async e => {
    e.preventDefault();
    if (!window.fbAuth) return;
    const email = $('#authEmail').value.trim(), pass = $('#authPassword').value, nm = $('#authName');
    const b = $('#authSubmitBtn'); b.disabled = true; b.textContent = '…';
    try {
      if (isLogin) await window.fbAuth.signInWithEmailAndPassword(email, pass);
      else {
        const cred = await window.fbAuth.createUserWithEmailAndPassword(email, pass);
        if (nm && nm.value.trim()) await cred.user.updateProfile({ displayName: nm.value.trim() });
      }
    } catch (err) { renderAuthForm(mode, authErr(err.code)); }
  });
  $('#authSwitchBtn').addEventListener('click', e => { e.stopPropagation(); renderAuthForm(isLogin ? 'signup' : 'login'); });
  $('#googleAuthBtn').addEventListener('click', async () => {
    if (!window.fbAuth || !window.firebase) return;
    try { await window.fbAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()); }
    catch (err) { if (err.code !== 'auth/popup-closed-by-user') renderAuthForm(mode, authErr(err.code)); }
  });
}
function renderAuth(){
  const btn = $('#authBtn'), menu = $('#authMenu'), u = getCurrentUser();
  if (u){
    const initial = (u.name || u.email || '?')[0].toUpperCase();
    btn.innerHTML = (u.picture ? `<img class="auth-avatar-img" src="${esc(u.picture)}" alt="">` : `<span class="auth-avatar">${esc(initial)}</span>`) + `<span>${esc(u.name || u.email)}</span>`;
    menu.innerHTML = `<button type="button" class="auth-menu-item" id="logoutBtn">${svg('out')}${t('logout')}</button>`;
    $('#logoutBtn').addEventListener('click', () => window.fbAuth && window.fbAuth.signOut());
  } else {
    btn.innerHTML = `<span class="auth-avatar">${svg('user')}</span><span>${t('login')}</span>`;
    renderAuthForm('login');
  }
}
async function checkAdmin(){
  const u = getCurrentUser();
  if (!u || !window.firebase || !firebase.firestore) return false;
  try { const d = await firebase.firestore().collection('users').doc(u.uid).get(); return !!(d.exists && d.data().isAdmin === true); }
  catch (e) { return false; }
}
function initAuth(){
  const wrap = $('#authWrap'), btn = $('#authBtn'), menu = $('#authMenu');
  renderAuth();
  if (window.fbAuth){
    window.fbAuth.onAuthStateChanged(async fb => {
      cacheCurrentUser(fb ? { uid: fb.uid, name: fb.displayName || fb.email, email: fb.email, picture: fb.photoURL || null } : null);
      renderAuth(); menu.classList.add('hidden');
      IS_ADMIN = await checkAdmin();
      wrap.classList.remove('auth-pending');
      renderTools(); renderHead();
    });
  } else wrap.classList.remove('auth-pending');
  btn.addEventListener('click', e => { e.stopPropagation(); menu.classList.toggle('hidden'); });
  menu.addEventListener('click', e => e.stopPropagation());
  document.addEventListener('click', () => menu.classList.add('hidden'));
}

/* =====================================================================
   قائمة الأدوات
===================================================================== */
function renderTools(){
  const box = $('#tools'); box.innerHTML = '';
  GROUPS.forEach(g => {
    const list = TOOLS.filter(x => g === 'soon' ? !x.ready : (x.ready && x.g === g));
    const sec = h('div', 'tg'); sec.append(h('h3', '', t('g_' + g)));
    list.forEach(x => {
      const b = h('button', 'ti' + (x.ready ? '' : ' soon') + (x.id === S.tool ? ' on' : ''),
        `<span class="ic" style="--c:${x.c}">${icoHTML(x)}</span><span class="nm">${tn(x, 'name')}</span>${x.ready ? '' : `<span class="lock">${svg(IS_ADMIN ? 'unlock' : 'lock')}</span>`}`);
      b.type = 'button'; b.onclick = () => selectTool(x.id); sec.append(b);
    });
    box.append(sec);
  });
}
function selectTool(id){
  S.tool = id; const x = tool();
  S.result = null; S.out = ''; S.zoom = 1;
  if (!x.img && !x.doc && S.files.length && !file(S.active)) S.active = S.files[0].id;
  rebuildPages(); renderAll();
  $('#pvStage').scrollTop = 0;
  try { const u = new URL(location.href); u.searchParams.set('tool', id); history.replaceState(null, '', u); } catch (e) {}
}
function rebuildPages(){
  const x = tool();
  const src = x.multi ? S.files : S.files.filter(f => f.id === S.active);
  S.pages = []; src.forEach(f => { for (let p = 0; p < f.count; p++) S.pages.push({fid:f.id, p, rot:0, key:f.id + ':' + p}); });
  S.sel = 0; S.cuts.clear(); S.selected.clear(); S.edits = []; S.editSel = null;
  if (x.id === 'split') applySplitMode();
}
function renderAll(){ renderTools(); renderHead(); renderResult(); renderDrop(); renderChips(); renderOptions(); renderPages(); renderPreview(); updateTop(); }

function renderHead(){
  const x = tool();
  $('#crumbTool').textContent = tn(x, 'name');
  const ic = $('#hIcon'); ic.style.setProperty('--c', x.c); ic.innerHTML = icoHTML(x);
  $('#hTitle').textContent = tn(x, 'name'); $('#hDesc').textContent = tn(x, 'desc');
  const r = $('#btnRun'); r.hidden = !x.ready; r.innerHTML = (x.ready ? tn(x, 'run') : '') + svg('download'); r.disabled = !canRun();
  const soon = !x.ready;
  ['#drop','#chips','#opts','#pagesWrap','#result'].forEach(s => $(s).hidden = soon);
  const sb = $('#soonBox'); sb.hidden = !soon;
  if (soon) sb.innerHTML = `<div class="big">${svg('lock')}</div><h2>${t('soonT')}</h2><p>${t('soonP')}</p>${IS_ADMIN ? `<span class="adm">${t('soonAdm')}</span>` : ''}`;
}
function updateTop(){ $('#btnDl').disabled = !S.result; $('#btnRun').disabled = !canRun(); }
function renderResult(){
  const r = $('#result'); r.innerHTML = ''; if (!S.result) return;
  const d = h('div', 'result', `<span class="ok">${svg('check')}</span><span>${t('ready')} <b>${esc(S.result.name)}</b> (${fmtSize(S.result.blob.size)})</span>`);
  const b = h('button', 'lbtn', svg('download') + t('again')); b.type = 'button'; b.onclick = () => saveBlob(S.result.blob, S.result.name);
  d.append(b); r.append(d);
}

/* =====================================================================
   الرفع
===================================================================== */
function renderDrop(){
  const x = tool(), d = $('#drop'); if (!x.ready) return;
  const has = x.img ? S.images.length : x.doc ? !!S.docx : S.files.length;
  d.className = 'drop' + (has ? ' mini' : '');
  const what = x.img ? t('wImgs') : x.doc ? t('wDocx') : (x.multi ? t('wPdfs') : t('wPdf'));
  d.innerHTML = has
    ? `<div class="big">${svg('upload')}</div><div><h2>${x.img ? t('addImgs') : x.multi ? t('addFiles') : t('openOther')}</h2><p>${t('dragOr')}</p></div><button class="pick" type="button">${x.img ? t('pickImgs') : t('pickFiles')}</button>`
    : `<div class="big">${svg('upload')}</div><h2>${t('dropT', what)}</h2><p>${t('priv')}</p><button class="pick" type="button">${t('pickDev')}</button>`;
  d.querySelector('.pick').onclick = () => {
    const i = $('#fileIn');
    i.accept = x.img ? 'image/*' : x.doc ? '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf,.pdf';
    i.multiple = !!(x.multi || x.img); i.value = ''; i.click();
  };
}
$('#fileIn').onchange = e => addFiles(e.target.files);
const work = $('#work');
['dragenter','dragover'].forEach(ev => work.addEventListener(ev, e => { if (e.dataTransfer.types.includes('Files') && tool().ready){ e.preventDefault(); $('#drop').classList.add('hot'); } }));
work.addEventListener('dragleave', e => { if (!work.contains(e.relatedTarget)) $('#drop').classList.remove('hot'); });
work.addEventListener('drop', e => { $('#drop').classList.remove('hot'); if (e.dataTransfer.files.length && tool().ready){ e.preventDefault(); addFiles(e.dataTransfer.files); } });
const loadImg = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
const readDataURL = f => new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(f); });

async function addFiles(list){
  const x = tool(), arr = [...list]; if (!arr.length) return;
  if (x.doc){
    const f = arr.find(f => /\.docx$/i.test(f.name));
    if (!f) return toast(t('onlyDocx'));
    busy(t('readFiles'));
    try { const r = await mammoth.convertToHtml({ arrayBuffer: await f.arrayBuffer() }); S.docx = { name: f.name, html: r.value, size: f.size }; }
    catch (e) { toast(t('cantOpen', f.name)); }
    unbusy(); S.result = null; renderAll(); return;
  }
  if (x.img){
    const imgs = arr.filter(f => f.type.startsWith('image/'));
    if (!imgs.length) return toast(t('onlyImg'));
    busy(t('readImgs'));
    for (const f of imgs){
      const src = await readDataURL(f); const el = await loadImg(src).catch(() => null); if (!el) continue;
      S.images.push({ id: ++uid, name: f.name, src, el, w: el.naturalWidth, h: el.naturalHeight, type: f.type });
    }
    unbusy(); S.result = null; renderAll(); return;
  }
  const pdfs = arr.filter(f => f.type === 'application/pdf' || /\.pdf$/i.test(f.name));
  if (!pdfs.length) return toast(t('onlyPdf'));
  const use = x.multi ? pdfs : [pdfs[0]];
  busy(t('readFiles'));
  for (const f of use){
    const bytes = await f.arrayBuffer(); let doc;
    try { doc = await pdfjsLib.getDocument({ data: new Uint8Array(bytes.slice(0)) }).promise; }
    catch (e) { toast(e && e.name === 'PasswordException' ? t('locked', f.name) : t('cantOpen', f.name)); continue; }
    const nf = { id: ++uid, name: f.name, bytes, doc, count: doc.numPages, color: PAL[S.files.length % PAL.length] };
    S.files.push(nf); if (!x.multi) S.active = nf.id;
  }
  if (!file(S.active) && S.files.length) S.active = S.files[0].id;
  unbusy(); S.result = null;
  if (x.multi){
    const known = new Set(S.pages.map(p => p.fid));
    S.files.filter(f => !known.has(f.id)).forEach(f => { for (let p = 0; p < f.count; p++) S.pages.push({ fid: f.id, p, rot: 0, key: f.id + ':' + p }); });
  } else rebuildPages();
  renderAll();
}

/* ---------- بطاقات الملفات ---------- */
let chipDrag = null;
function renderChips(){
  const x = tool(), box = $('#chips'); box.innerHTML = '';
  if (!x.ready || x.img || x.doc) return;
  S.files.forEach((f, i) => {
    const c = h('div', 'chip' + (!x.multi ? ' click' : '') + (!x.multi && f.id === S.active ? ' on' : ''),
      `<span class="dot" style="--fc:${f.color}"></span><span class="nm" title="${esc(f.name)}">${esc(f.name)}</span><small>${f.count} ${t('pShort')}</small>`);
    const xb = h('button', 'x', svg('x')); xb.type = 'button'; xb.title = t('rmFile');
    xb.onclick = e => { e.stopPropagation(); removeFile(f.id); }; c.append(xb);
    if (!x.multi) c.onclick = () => { if (S.active !== f.id){ S.active = f.id; S.result = null; rebuildPages(); renderAll(); } };
    else {
      c.draggable = true;
      c.ondragstart = e => { chipDrag = i; c.classList.add('drag'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', 'c'); };
      c.ondragend = () => { c.classList.remove('drag'); chipDrag = null; };
      c.ondragover = e => { if (chipDrag != null){ e.preventDefault(); c.classList.add('over'); } };
      c.ondragleave = () => c.classList.remove('over');
      c.ondrop = e => {
        e.preventDefault(); c.classList.remove('over'); if (chipDrag == null || chipDrag === i) return;
        const [m] = S.files.splice(chipDrag, 1); S.files.splice(i, 0, m); chipDrag = null;
        const ord = id => S.files.findIndex(ff => ff.id === id); S.pages.sort((a, b) => ord(a.fid) - ord(b.fid));
        S.sel = 0; renderChips(); renderPages(); renderPreview();
      };
    }
    box.append(c);
  });
}
function removeFile(id){
  S.files = S.files.filter(f => f.id !== id); S.pages = S.pages.filter(p => p.fid !== id);
  if (S.active === id) S.active = S.files[0] ? S.files[0].id : null;
  if (!tool().multi) rebuildPages();
  S.sel = clamp(S.sel, 0, Math.max(0, S.pages.length - 1)); S.result = null; renderAll();
}

/* =====================================================================
   الخيارات — تتغير حسب الأداة
===================================================================== */
function seg(opts, val, on){ const w = h('div', 'seg'); opts.forEach(([v, l]) => { const b = h('button', v === val ? 'on' : '', l); b.type = 'button'; b.onclick = () => on(v); w.append(b); }); return w; }
function fld(label, ctrl, val){ const f = h('div', 'fld'); const l = h('label', '', esc(label) + (val != null ? `<em>${val}</em>` : '')); f.append(l, ctrl); f._em = l.querySelector('em'); return f; }
function range(min, max, step, val, on){ const r = h('input'); r.type = 'range'; r.min = min; r.max = max; r.step = step; r.value = val; r.oninput = () => on(+r.value); return r; }
function inp(val, ph, on, type = 'text'){ const i = h('input', 'inp'); i.type = type; i.value = val; i.placeholder = ph || ''; i.oninput = () => on(i.value); return i; }
function hint(txt){ return h('div', 'hint', svg('info') + `<span>${txt}</span>`); }
function lbtn(icon, txt, on, cls = ''){ const b = h('button', 'lbtn ' + cls, svg(icon) + txt); b.type = 'button'; b.onclick = on; return b; }
function pickImage(cb){ const i = $('#imgIn'); i.value = ''; i.onchange = async () => { const f = i.files[0]; if (f) cb(await readDataURL(f)); }; i.click(); }

function renderOptions(){
  const x = tool(), o = $('#opts'); o.innerHTML = '';
  const has = x.img ? S.images.length : x.doc ? !!S.docx : S.pages.length;
  o.hidden = !x.ready || !has; if (o.hidden) return;
  if (x.id === 'merge') o.append(hint(t('hMerge')));
  if (x.id === 'rotate') o.append(hint(t('hRotate')));
  if (x.id === 'word2pdf') o.append(hint(t('hWord')));
  if (x.id === 'split'){
    o.append(fld(t('splitMode'), seg([['manual', t('sManual')], ['each', t('sEach')], ['every', t('sEvery')], ['range', t('sRange')]], S.split.mode, v => { S.split.mode = v; applySplitMode(); renderOptions(); renderPages(); updateTop(); })));
    if (S.split.mode === 'every'){ const i = inp(S.split.n, '', v => { S.split.n = Math.max(1, parseInt(v) || 1); applySplitMode(); renderPages(); updateTop(); }, 'number'); i.style.width = '110px'; o.append(fld(t('sN'), i)); }
    if (S.split.mode === 'range'){ const i = inp(S.split.ranges, t('sRangePh'), v => { S.split.ranges = v; renderPages(); updateTop(); }); i.style.width = '230px'; i.dir = 'ltr'; o.append(fld(t('sRanges'), i)); }
    if (S.split.mode === 'manual') o.append(hint(t('hSplit')));
  }
  if (x.id === 'watermark'){
    const w = S.wm;
    o.append(fld(t('wmType'), seg([['text', t('wmText')], ['image', t('wmImg')]], w.type, v => { w.type = v; renderOptions(); drawOverlay(); updateTop(); })));
    if (w.type === 'text'){
      const ti = inp(w.text, t('wmText'), v => { w.text = v; wmRedraw(); updateTop(); }); ti.style.width = '190px'; ti.dir = 'auto'; o.append(fld(t('wmTextL'), ti));
      const c = h('input'); c.type = 'color'; c.value = w.color; c.oninput = () => { w.color = c.value; wmRedraw(); }; o.append(fld(t('color'), c));
    } else {
      o.append(fld(t('logo'), lbtn('image', w.img ? t('changeImg') : t('chooseImg'), () => pickImage(async src => { w.img = await loadImg(src); renderOptions(); wmRedraw(); updateTop(); }))));
    }
    const fs = fld(t('size'), range(12, 200, 1, w.size, v => { w.size = v; fs._em.textContent = v; wmRedraw(); }), w.size); o.append(fs);
    const fo = fld(t('opacity'), range(5, 100, 1, Math.round(w.opacity * 100), v => { w.opacity = v / 100; fo._em.textContent = v + '%'; wmRedraw(); }), Math.round(w.opacity * 100) + '%'); o.append(fo);
    const fa = fld(t('angle'), range(-90, 90, 1, w.angle, v => { w.angle = v; fa._em.textContent = v + '°'; wmRedraw(); }), w.angle + '°'); o.append(fa);
    o.append(fld(t('repeat'), seg([['one', t('once')], ['tile', t('tile')]], w.tile ? 'tile' : 'one', v => { w.tile = v === 'tile'; renderOptions(); wmRedraw(); })));
    const g = h('div', 'grid9' + (w.tile ? ' off' : ''));
    ['tl','tc','tr','ml','mc','mr','bl','bc','br'].forEach(p => { const b = h('button', p === w.pos ? 'on' : ''); b.type = 'button'; b.title = t('pos'); b.onclick = () => { w.pos = p; renderOptions(); wmRedraw(); }; g.append(b); });
    o.append(fld(t('pos'), g));
  }
  if (x.id === 'edit'){
    o.append(lbtn('text', t('addText'), addTextEdit), lbtn('image', t('addImage'), () => pickImage(addImageEdit)));
    const e = S.edits.find(y => y.id === S.editSel);
    if (e && e.type === 'text'){
      const fs = fld(t('fontSize'), range(8, 96, 1, e.size, v => { e.size = v; fs._em.textContent = v; drawOverlay(); }), e.size); o.append(fs);
      const c = h('input'); c.type = 'color'; c.value = e.color; c.oninput = () => { e.color = c.value; drawOverlay(); }; o.append(fld(t('color'), c));
      o.append(fld(t('weight'), seg([['n', t('normal')], ['b', t('bold')]], e.bold ? 'b' : 'n', v => { e.bold = v === 'b'; renderOptions(); drawOverlay(); })));
    }
    if (e) o.append(lbtn('trash', t('delEl'), () => { S.edits = S.edits.filter(y => y !== e); S.editSel = null; renderOptions(); drawOverlay(); renderPages(); updateTop(); }, 'danger'));
    o.append(hint(S.edits.length ? t('hEdit1') : t('hEdit0')));
  }
  if (x.id === 'pdf2jpg'){
    o.append(fld(t('quality'), seg([['n', t('qN')], ['h', t('qH')], ['x', t('qX')]], S.jpg.q, v => { S.jpg.q = v; renderOptions(); })));
    o.append(fld(t('format'), seg([['jpg', 'JPG'], ['png', 'PNG']], S.jpg.fmt, v => { S.jpg.fmt = v; renderOptions(); })));
    o.append(hint(t('hJpg')));
  }
  if (x.id === 'jpg2pdf'){
    o.append(fld(t('pSize'), seg([['a4', 'A4'], ['letter', 'Letter'], ['fit', t('fitImg')]], S.img.size, v => { S.img.size = v; renderOptions(); renderPreview(); })));
    o.append(fld(t('orient'), seg([['auto', t('auto')], ['port', t('port')], ['land', t('land')]], S.img.orient, v => { S.img.orient = v; renderOptions(); renderPreview(); })));
    o.append(fld(t('margin'), seg([['n', t('mN')], ['s', t('mS')], ['l', t('mL')]], S.img.margin, v => { S.img.margin = v; renderOptions(); renderPreview(); })));
  }
  const nm = inp(S.out, defaultName(), v => S.out = v); nm.style.width = '200px'; nm.dir = 'auto';
  o.append(fld(t('outName'), nm));
}

/* ---------- التقسيم ---------- */
function applySplitMode(){
  const n = S.pages.length, m = S.split.mode;
  if (m === 'each') S.cuts = new Set([...Array(Math.max(0, n - 1)).keys()]);
  else if (m === 'every'){ S.cuts = new Set(); for (let i = S.split.n - 1; i < n - 1; i += S.split.n) S.cuts.add(i); }
}
function splitGroups(){
  const n = S.pages.length;
  if (S.split.mode === 'range'){
    const g = [];
    S.split.ranges.split(/[,،؛;\s]+/).forEach(part => {
      const m = part.match(/^(\d+)(?:-(\d+))?$/); if (!m) return;
      let a = +m[1], b = m[2] ? +m[2] : a; if (a > b) [a, b] = [b, a]; a = clamp(a, 1, n); b = clamp(b, 1, n);
      const arr = []; for (let i = a; i <= b; i++) arr.push(i - 1); if (arr.length) g.push(arr);
    });
    return g;
  }
  const g = []; let cur = []; for (let i = 0; i < n; i++){ cur.push(i); if (S.cuts.has(i) || i === n - 1){ g.push(cur); cur = []; } } return g;
}

/* ---------- المصغّرات ---------- */
const thumbs = {}, queued = new Set(), queue = []; let pumping = false;
function thumb(key, fid, p){ if (thumbs[key]) return thumbs[key]; if (!queued.has(key)){ queued.add(key); queue.push({ key, fid, p }); pump(); } return ''; }
async function pump(){
  if (pumping) return; pumping = true;
  while (queue.length){
    const { key, fid, p } = queue.shift(); const f = file(fid); if (!f){ queued.delete(key); continue; }
    try {
      const page = await f.doc.getPage(p + 1); const v0 = page.getViewport({ scale: 1 });
      const vp = page.getViewport({ scale: 240 / Math.max(v0.width, v0.height) });
      const c = document.createElement('canvas'); c.width = vp.width; c.height = vp.height;
      await page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
      thumbs[key] = c.toDataURL('image/jpeg', .82);
      document.querySelectorAll(`img[data-key="${key}"]`).forEach(i => i.src = thumbs[key]);
    } catch (e) {}
  }
  pumping = false;
}

let pgDrag = null;
function dnd(el, i, arr, after){
  el.draggable = true;
  el.addEventListener('dragstart', e => { pgDrag = i; el.classList.add('drag'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', 'p'); });
  el.addEventListener('dragend', () => { el.classList.remove('drag'); pgDrag = null; });
  el.addEventListener('dragover', e => { if (pgDrag != null){ e.preventDefault(); el.classList.add('over'); } });
  el.addEventListener('dragleave', () => el.classList.remove('over'));
  el.addEventListener('drop', e => { e.preventDefault(); el.classList.remove('over'); if (pgDrag == null || pgDrag === i) return; const [m] = arr.splice(pgDrag, 1); arr.splice(i, 0, m); pgDrag = null; after(i); });
}
function actBtn(icon, title, on){ const b = h('button', '', svg(icon)); b.type = 'button'; b.title = title; b.onclick = e => { e.stopPropagation(); on(); }; return b; }

function renderPages(){
  const x = tool(), box = $('#pages'), wrap = $('#pagesWrap'), info = $('#pInfo'), acts = $('#pActs');
  box.innerHTML = ''; acts.innerHTML = '';
  const n = x.img ? S.images.length : x.doc ? (S.docx ? 1 : 0) : S.pages.length;
  wrap.hidden = !x.ready || !n; if (wrap.hidden) return;

  if (x.doc){
    info.innerHTML = t('docFile');
    const el = h('div', 'pg cur', `<div class="th"><span class="docic">W</span></div><div class="meta" title="${esc(S.docx.name)}">${esc(S.docx.name)}</div>`);
    const a = h('div', 'act'); a.append(actBtn('x', t('del'), () => { S.docx = null; S.result = null; renderAll(); })); el.querySelector('.th').append(a);
    box.append(el); return;
  }
  if (x.img){
    info.innerHTML = `${n === 1 ? t('img1') : t('imgs', n)}<small>${t('dragImgs')}</small>`;
    S.images.forEach((im, i) => {
      const el = h('div', 'pg' + (i === S.sel ? ' cur' : ''), `<div class="th"><img src="${im.src}" alt=""></div><div class="meta">${i + 1}</div>`);
      const a = h('div', 'act'); a.append(actBtn('x', t('del'), () => { S.images.splice(i, 1); S.sel = clamp(S.sel, 0, Math.max(0, S.images.length - 1)); renderAll(); })); el.querySelector('.th').append(a);
      el.onclick = () => { S.sel = i; markCur(); renderPreview(); };
      dnd(el, i, S.images, j => { S.sel = j; renderPages(); renderPreview(); });
      box.append(el);
    });
    return;
  }

  const groups = x.id === 'split' ? splitGroups() : null, gmap = {};
  if (groups) groups.forEach((g, gi) => g.forEach(i => { if (gmap[i] === undefined) gmap[i] = gi; }));
  const nf = new Set(S.pages.map(p => p.fid)).size;
  let sub = '';
  if (x.id === 'split') sub = groups.length === 1 ? t('outFile1') : t('outFiles', groups.length);
  else if (x.id === 'merge') sub = nf === 1 ? t('fromFile1') : t('fromFiles', nf);
  else if (x.id === 'pdf2jpg') sub = S.selected.size ? t('selN', S.selected.size) : t('convAll');
  else if (x.id === 'edit') sub = S.edits.length ? t('editsN', S.edits.length) : t('pickPage');
  info.innerHTML = t('pages', n) + (sub ? `<small>${sub}</small>` : '');

  if (x.id === 'split' && S.split.mode !== 'range' && S.cuts.size) acts.append(lbtn('x', t('clearCuts'), () => { S.split.mode = 'manual'; S.cuts.clear(); renderOptions(); renderPages(); updateTop(); }));
  if (x.id === 'rotate'){
    acts.append(lbtn('rotL', t('rotAllL'), () => { S.pages.forEach(p => p.rot = (p.rot + 270) % 360); renderPages(); renderPreview(); }));
    acts.append(lbtn('rotR', t('rotAllR'), () => { S.pages.forEach(p => p.rot = (p.rot + 90) % 360); renderPages(); renderPreview(); }));
  }
  if (x.id === 'pdf2jpg') acts.append(S.selected.size === n ? lbtn('x', t('selNone'), () => { S.selected.clear(); renderPages(); }) : lbtn('check', t('selAll'), () => { S.selected = new Set(S.pages.map((_, i) => i)); renderPages(); }));

  S.pages.forEach((pg, i) => {
    const f = file(pg.fid);
    const el = h('div', 'pg' + (i === S.sel ? ' cur' : ''));
    const th = h('div', 'th', `<img data-key="${pg.key}" src="${thumb(pg.key, pg.fid, pg.p)}" alt="" style="transform:rotate(${pg.rot}deg)">`);
    el.append(th);
    const meta = h('div', 'meta', `${i + 1}`); el.append(meta);
    if (x.id === 'merge'){ th.append(h('span', 'band')); th.style.setProperty('--fc', f.color); }
    if (x.id === 'merge' || x.id === 'rotate'){
      const a = h('div', 'act');
      if (x.id === 'rotate') a.append(
        actBtn('rotL', t('rotL'), () => { pg.rot = (pg.rot + 270) % 360; rotThumb(el, pg); if (i === S.sel) renderPreview(); }),
        actBtn('rotR', t('rotR'), () => { pg.rot = (pg.rot + 90) % 360; rotThumb(el, pg); if (i === S.sel) renderPreview(); }));
      a.append(actBtn('x', t('delPage'), () => { S.pages.splice(i, 1); S.sel = clamp(S.sel, 0, Math.max(0, S.pages.length - 1)); renderPages(); renderPreview(); updateTop(); }));
      th.append(a);
      dnd(el, i, S.pages, j => { S.sel = j; renderPages(); renderPreview(); });
    }
    if (x.id === 'split'){
      const gi = gmap[i];
      if (gi === undefined) el.classList.add('out');
      else { el.classList.add('grp'); el.style.setProperty('--gc', PAL[gi % PAL.length]); if (groups.length > 1 || S.split.mode === 'range') meta.innerHTML = `<span class="tag">${t('fileN', gi + 1)}</span>${i + 1}`; }
    }
    if (x.id === 'pdf2jpg'){
      if (S.selected.has(i)) el.classList.add('selx');
      const ck = h('span', 'chk', svg('check')); th.append(ck);
      ck.onclick = e => { e.stopPropagation(); S.selected.has(i) ? S.selected.delete(i) : S.selected.add(i); renderPages(); };
    }
    if (x.id === 'edit'){ const c = S.edits.filter(e => e.page === i).length; if (c) meta.innerHTML = `<span class="tag" style="--gc:var(--accent)">${c}</span>${i + 1}`; }
    el.onclick = () => { S.sel = i; S.editSel = null; markCur(); if (x.id === 'edit') renderOptions(); renderPreview(); };
    box.append(el);
    if (x.id === 'split' && S.split.mode !== 'range' && i < S.pages.length - 1){
      const g = h('div', 'gap' + (S.cuts.has(i) ? ' cut' : ''), `<span class="sc">${svg('split')}</span>`); g.title = t('cutLine');
      g.onclick = () => { S.split.mode = 'manual'; S.cuts.has(i) ? S.cuts.delete(i) : S.cuts.add(i); renderOptions(); renderPages(); updateTop(); };
      box.append(g);
    }
  });
}
function rotThumb(el, pg){ el.querySelector('img').style.transform = `rotate(${pg.rot}deg)`; }
function markCur(){ document.querySelectorAll('#pages .pg').forEach((e, i) => e.classList.toggle('cur', i === S.sel)); }

/* =====================================================================
   المعاينة
===================================================================== */
let rTask = null, pvTok = 0;
function stageFit(w, hh){ const st = $('#pvStage'); return Math.min((st.clientWidth - 48) / w, (st.clientHeight - 48) / hh); }
async function renderPreview(){
  const tok = ++pvTok, x = tool(), cv = $('#pvCanvas'), pgEl = $('#pvPage'), empty = $('#pvEmpty'), docEl = $('#pvDoc');
  const n = x.img ? S.images.length : x.doc ? (S.docx ? 1 : 0) : S.pages.length;
  const show = x.ready && n > 0;
  empty.hidden = show; pgEl.hidden = !show || !!x.doc; docEl.hidden = !show || !x.doc;
  $('#pvPrev').disabled = !show || S.sel <= 0; $('#pvNext').disabled = !show || S.sel >= n - 1;
  $('#zLbl').textContent = Math.round(S.zoom * 100) + '%';
  if (!show){ $('#pvLbl').textContent = t('preview'); S.pv = null; $('#pvOverlay').innerHTML = ''; return; }
  if (x.doc){
    docEl.innerHTML = S.docx.html; docEl.dir = 'auto';
    docEl.style.transform = `scale(${S.zoom})`;
    $('#pvLbl').textContent = S.docx.name; S.pv = null; return;
  }
  S.sel = clamp(S.sel, 0, n - 1);
  const dpr = window.devicePixelRatio || 1;
  if (x.img){
    const im = S.images[S.sel], [pw, ph] = pageDims(im), css = stageFit(pw, ph) * S.zoom;
    cv.width = pw * css * dpr; cv.height = ph * css * dpr; cv.style.width = pw * css + 'px'; cv.style.height = ph * css + 'px';
    const c = cv.getContext('2d'); c.fillStyle = '#fff'; c.fillRect(0, 0, cv.width, cv.height);
    const Lo = layout(im, pw, ph), k = css * dpr; c.drawImage(im.el, Lo.x * k, Lo.y * k, Lo.w * k, Lo.h * k);
    $('#pvLbl').textContent = t('pageOf', S.sel + 1, n); S.pv = null; $('#pvOverlay').innerHTML = ''; return;
  }
  const pg = S.pages[S.sel], f = file(pg.fid);
  const page = await f.doc.getPage(pg.p + 1); if (tok !== pvTok) return;
  const rot = (page.rotate + pg.rot) % 360, v1 = page.getViewport({ scale: 1, rotation: rot });
  const css = stageFit(v1.width, v1.height) * S.zoom, vp = page.getViewport({ scale: css * dpr, rotation: rot });
  if (rTask){ try { rTask.cancel(); } catch (e) {} }
  const off = document.createElement('canvas'); off.width = vp.width; off.height = vp.height;
  rTask = page.render({ canvasContext: off.getContext('2d'), viewport: vp });
  try { await rTask.promise; } catch (e) { return; }
  if (tok !== pvTok) return;
  cv.width = vp.width; cv.height = vp.height; cv.style.width = v1.width * css + 'px'; cv.style.height = v1.height * css + 'px';
  cv.getContext('2d').drawImage(off, 0, 0);
  S.pv = { w: v1.width, h: v1.height, css };
  $('#pvLbl').textContent = (x.multi ? f.name + ' ، ' : '') + t('pageOf', S.sel + 1, n);
  drawOverlay();
}
function go(d){ const x = tool(); const n = x.img ? S.images.length : S.pages.length; const s = clamp(S.sel + d, 0, Math.max(0, n - 1)); if (s !== S.sel){ S.sel = s; S.editSel = null; markCur(); if (S.tool === 'edit') renderOptions(); renderPreview(); } }
$('#pvPrev').onclick = () => go(-1); $('#pvNext').onclick = () => go(1);
$('#zIn').onclick = () => { S.zoom = clamp(S.zoom + .25, .5, 4); renderPreview(); };
$('#zOut').onclick = () => { S.zoom = clamp(S.zoom - .25, .5, 4); renderPreview(); };
$('#zFit').onclick = () => { S.zoom = 1; renderPreview(); };
let rzT; window.addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(renderPreview, 150); });
document.addEventListener('keydown', e => {
  if (e.target.closest('input,textarea,select,[contenteditable]')) return;
  if (e.key === 'ArrowLeft') go(1); if (e.key === 'ArrowRight') go(-1);   // الاتجاه ثابت (RTL)
});

/* ---------- الطبقة فوق المعاينة: العلامة المائية والتعديل ---------- */
function drawOverlay(){
  const ov = $('#pvOverlay'); ov.innerHTML = ''; ov.className = '';
  const x = tool(); if (!S.pv) return;
  const dpr = window.devicePixelRatio || 1;
  if (x.id === 'watermark'){ const c = h('canvas'); c.id = 'wmCanvas'; c.width = Math.round(S.pv.w * S.pv.css * dpr); c.height = Math.round(S.pv.h * S.pv.css * dpr); ov.append(c); wmRedraw(); }
  if (x.id === 'edit'){ ov.classList.add('editing'); renderEditEls(); }
}
function wmRedraw(){ const c = $('#wmCanvas'); if (!c || !S.pv) return; drawWatermark(c.getContext('2d'), c.width, c.height, S.pv.css * (window.devicePixelRatio || 1)); }
function drawWatermark(x, W, H, k){
  const w = S.wm; x.clearRect(0, 0, W, H); x.save(); x.globalAlpha = w.opacity;
  let mw, mh, draw;
  if (w.type === 'text'){
    if (!w.text.trim()){ x.restore(); return; }
    x.font = `700 ${w.size * k}px ${FONT}`; x.fillStyle = w.color; x.textAlign = 'center'; x.textBaseline = 'middle';
    mw = x.measureText(w.text).width; mh = w.size * k; draw = () => x.fillText(w.text, 0, 0);
  } else {
    if (!w.img){ x.restore(); return; }
    mw = w.size * 2.6 * k; mh = mw * w.img.naturalHeight / w.img.naturalWidth; draw = () => x.drawImage(w.img, -mw / 2, -mh / 2, mw, mh);
  }
  const a = w.angle * Math.PI / 180;
  if (w.tile){
    x.translate(W / 2, H / 2); x.rotate(a); const D = Math.hypot(W, H), sx = mw + 90 * k, sy = mh + 110 * k;
    for (let y = -D, r = 0; y < D; y += sy, r++) for (let xx = -D; xx < D; xx += sx){ x.save(); x.translate(xx + (r % 2 ? sx / 2 : 0), y); draw(); x.restore(); }
  } else {
    const m = 36 * k, bw = Math.abs(mw * Math.cos(a)) + Math.abs(mh * Math.sin(a)), bh = Math.abs(mw * Math.sin(a)) + Math.abs(mh * Math.cos(a));
    const col = w.pos[1], row = w.pos[0];
    const cx = col === 'l' ? m + bw / 2 : col === 'r' ? W - m - bw / 2 : W / 2;
    const cy = row === 't' ? m + bh / 2 : row === 'b' ? H - m - bh / 2 : H / 2;
    x.translate(cx, cy); x.rotate(a); draw();
  }
  x.restore();
}

function addTextEdit(){
  if (!S.pages.length) return;
  const e = { id: ++uid, page: S.sel, type: 'text', x: .12, y: .12, text: t('typeHere'), size: 20, color: '#18212F', bold: false };
  S.edits.push(e); S.editSel = e.id; renderOptions(); drawOverlay(); renderPages(); updateTop();
  const el = document.querySelector(`.ed[data-id="${e.id}"] .ed-txt`);
  if (el){ el.focus(); const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
}
async function addImageEdit(src){
  if (!S.pages.length) return;
  const im = await loadImg(src); const sc = Math.min(1, 1600 / Math.max(im.naturalWidth, im.naturalHeight));
  const c = document.createElement('canvas'); c.width = Math.round(im.naturalWidth * sc); c.height = Math.round(im.naturalHeight * sc); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
  const e = { id: ++uid, page: S.sel, type: 'image', x: .3, y: .3, w: .3, ratio: c.width / c.height, png: c.toDataURL('image/png') };
  S.edits.push(e); S.editSel = e.id; renderOptions(); drawOverlay(); renderPages(); updateTop();
}
function renderEditEls(){
  const ov = $('#pvOverlay'), k = S.pv.css;
  ov.onpointerdown = ev => { if (ev.target === ov && S.editSel != null){ S.editSel = null; renderOptions(); selMark(); } };
  S.edits.filter(e => e.page === S.sel).forEach(e => {
    const d = h('div', 'ed' + (e.id === S.editSel ? ' on' : '')); d.dataset.id = e.id;
    d.style.left = e.x * 100 + '%'; d.style.top = e.y * 100 + '%';
    const grip = h('div', 'grip');
    if (e.type === 'text'){
      const tx = h('div', 'ed-txt'); tx.contentEditable = 'true'; tx.dir = 'auto'; tx.textContent = e.text;
      tx.style.fontSize = e.size * k + 'px'; tx.style.color = e.color; tx.style.fontWeight = e.bold ? 700 : 400;
      tx.oninput = () => { e.text = tx.innerText.replace(/\n$/, ''); };
      d.append(tx);
      const mv = h('button', 'mv', svg('move')); mv.type = 'button'; mv.title = t('move'); drag(mv, e, 'move'); grip.append(mv);
    } else {
      d.classList.add('ed-i'); d.style.width = e.w * 100 + '%'; const im = h('img'); im.src = e.png; d.append(im);
      drag(d, e, 'move'); const r = h('span', 'rz'); drag(r, e, 'size'); d.append(r);
    }
    const del = h('button', '', svg('trash')); del.type = 'button'; del.title = t('del');
    del.onpointerdown = ev => ev.stopPropagation();
    del.onclick = () => { S.edits = S.edits.filter(y => y !== e); S.editSel = null; renderOptions(); drawOverlay(); renderPages(); updateTop(); };
    grip.append(del); d.append(grip);
    d.addEventListener('pointerdown', () => { if (S.editSel !== e.id){ S.editSel = e.id; renderOptions(); selMark(); } });
    ov.append(d);
  });
}
function selMark(){ document.querySelectorAll('.ed').forEach(d => d.classList.toggle('on', +d.dataset.id === S.editSel)); }
function drag(handle, e, mode){
  handle.addEventListener('pointerdown', ev => {
    if (ev.target.closest('.grip button:not(.mv)')) return;
    if (mode === 'move' && handle.classList.contains('ed-i') && ev.target.classList.contains('rz')) return;
    ev.preventDefault(); ev.stopPropagation();
    if (S.editSel !== e.id){ S.editSel = e.id; renderOptions(); selMark(); }
    const R = $('#pvOverlay').getBoundingClientRect(), sx = ev.clientX, sy = ev.clientY, ox = e.x, oy = e.y, ow = e.w;
    handle.setPointerCapture(ev.pointerId);
    const el = document.querySelector(`.ed[data-id="${e.id}"]`);
    const mv = m => {
      const dx = (m.clientX - sx) / R.width, dy = (m.clientY - sy) / R.height;
      if (mode === 'move'){ e.x = clamp(ox + dx, -.05, .98); e.y = clamp(oy + dy, 0, .98); el.style.left = e.x * 100 + '%'; el.style.top = e.y * 100 + '%'; }
      else { e.w = clamp(ow - dx, .03, 1); e.x = clamp(ox + dx, -.05, .98); el.style.width = e.w * 100 + '%'; el.style.left = e.x * 100 + '%'; }
    };
    const up = () => { handle.removeEventListener('pointermove', mv); handle.removeEventListener('pointerup', up); };
    handle.addEventListener('pointermove', mv); handle.addEventListener('pointerup', up);
  });
}

/* ---------- صور إلى PDF: التخطيط ---------- */
const MARG = { n: 0, s: 20, l: 40 };
function pageDims(im){
  const m = MARG[S.img.margin];
  if (S.img.size === 'fit') return [im.w * .75 + 2 * m, im.h * .75 + 2 * m];
  const [a, b] = S.img.size === 'a4' ? [595.28, 841.89] : [612, 792];
  const land = S.img.orient === 'land' || (S.img.orient === 'auto' && im.w > im.h); return land ? [b, a] : [a, b];
}
function layout(im, pw, ph){ const m = MARG[S.img.margin], s = Math.min((pw - 2 * m) / im.w, (ph - 2 * m) / im.h), w = im.w * s, hh = im.h * s; return { x: (pw - w) / 2, y: (ph - hh) / 2, w, h: hh }; }

/* =====================================================================
   التنفيذ
===================================================================== */
function canRun(){
  const x = tool(); if (!x.ready) return false;
  if (x.img) return S.images.length > 0;
  if (x.doc) return !!S.docx;
  if (!S.pages.length) return false;
  if (x.id === 'split'){ const g = splitGroups(); return S.split.mode === 'range' ? g.length > 0 : g.length > 1; }
  if (x.id === 'edit') return S.edits.length > 0;
  if (x.id === 'watermark') return S.wm.type === 'text' ? !!S.wm.text.trim() : !!S.wm.img;
  return true;
}
function baseFile(){
  if (tool().doc) return S.docx ? S.docx.name.replace(/\.docx$/i, '') : 'document';
  const f = file(tool().multi ? (S.pages[0] || {}).fid : S.active); return f ? f.name.replace(/\.pdf$/i, '') : 'document';
}
function defaultName(){ const b = baseFile(); return { merge:'merged', split:b + '-part', rotate:b + '-rotated', edit:b + '-edited', watermark:b + '-watermark', pdf2jpg:b, jpg2pdf:'images', word2pdf:b }[S.tool] || b; }
const base = () => (S.out.trim() || defaultName()).replace(/[\\/:*?"<>|]/g, '_');
const pdfBlob = async d => new Blob([await d.save()], { type: 'application/pdf' });
async function zip(files, name){ const z = new JSZip(); files.forEach(f => z.file(f.name, f.blob)); return { blob: await z.generateAsync({ type: 'blob' }), name }; }
function saveBlob(blob, name){ const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000); }

async function buildDoc(list){
  const { PDFDocument, degrees } = PDFLib, out = await PDFDocument.create(), src = {};
  for (const pg of list){
    if (!src[pg.fid]) src[pg.fid] = await PDFDocument.load(file(pg.fid).bytes, { ignoreEncryption: true });
    const [cp] = await out.copyPages(src[pg.fid], [pg.p]);
    if (pg.rot) cp.setRotation(degrees((cp.getRotation().angle + pg.rot) % 360));
    out.addPage(cp);
  }
  return out;
}
function textImage(e){
  const K = 4, fs = e.size * K, lh = e.size * 1.4 * K, lines = e.text.split('\n');
  const c = document.createElement('canvas'), x = c.getContext('2d'), font = `${e.bold ? 700 : 400} ${fs}px ${FONT}`;
  x.font = font; const mw = Math.max(1, ...lines.map(l => x.measureText(l).width));
  c.width = Math.ceil(mw) + 4; c.height = Math.ceil(lh * lines.length);
  const rtl = /[\u0590-\u08FF]/.test(e.text);
  x.font = font; x.fillStyle = e.color; x.textBaseline = 'middle'; x.direction = rtl ? 'rtl' : 'ltr'; x.textAlign = rtl ? 'right' : 'left';
  lines.forEach((l, i) => x.fillText(l, rtl ? c.width - 2 : 2, lh * (i + .5)));
  return { url: c.toDataURL('image/png'), w: c.width / K, h: c.height / K };
}

const RUN = {
  async merge(){ return { blob: await pdfBlob(await buildDoc(S.pages)), name: base() + '.pdf' }; },
  async rotate(){ return { blob: await pdfBlob(await buildDoc(S.pages)), name: base() + '.pdf' }; },
  async split(){
    const gs = splitGroups(), out = [];
    for (let i = 0; i < gs.length; i++){ $('#busyTxt').textContent = t('bPart', i + 1, gs.length); out.push({ name: `${base()}-${i + 1}.pdf`, blob: await pdfBlob(await buildDoc(gs[i].map(j => S.pages[j]))) }); }
    return out.length === 1 ? out[0] : zip(out, base() + '.zip');
  },
  async watermark(){
    await document.fonts.ready;
    const d = await buildDoc(S.pages), cache = {};
    for (const p of d.getPages()){
      const mb = p.getMediaBox(), key = Math.round(mb.width) + 'x' + Math.round(mb.height);
      if (!cache[key]){ const k = 2, c = document.createElement('canvas'); c.width = Math.round(mb.width * k); c.height = Math.round(mb.height * k); drawWatermark(c.getContext('2d'), c.width, c.height, k); cache[key] = await d.embedPng(c.toDataURL('image/png')); }
      p.drawImage(cache[key], { x: mb.x, y: mb.y, width: mb.width, height: mb.height });
    }
    return { blob: await pdfBlob(d), name: base() + '.pdf' };
  },
  async edit(){
    await document.fonts.ready;
    const d = await buildDoc(S.pages), pages = d.getPages();
    for (const e of S.edits){
      const p = pages[e.page]; if (!p) continue; const mb = p.getMediaBox(), pw = mb.width, ph = mb.height;
      if (e.type === 'text'){
        if (!e.text.trim()) continue; const T = textImage(e), img = await d.embedPng(T.url);
        p.drawImage(img, { x: mb.x + e.x * pw, y: mb.y + ph - e.y * ph - T.h, width: T.w, height: T.h });
      } else {
        const img = await d.embedPng(e.png), w = e.w * pw, hh = w / e.ratio;
        p.drawImage(img, { x: mb.x + e.x * pw, y: mb.y + ph - e.y * ph - hh, width: w, height: hh });
      }
    }
    return { blob: await pdfBlob(d), name: base() + '.pdf' };
  },
  async pdf2jpg(){
    const idx = S.selected.size ? [...S.selected].sort((a, b) => a - b) : S.pages.map((_, i) => i);
    const sc = { n: 1.5, h: 2.5, x: 4 }[S.jpg.q], png = S.jpg.fmt === 'png', ext = png ? 'png' : 'jpg', out = [];
    for (let n = 0; n < idx.length; n++){
      $('#busyTxt').textContent = t('bConv', n + 1, idx.length);
      const pg = S.pages[idx[n]], page = await file(pg.fid).doc.getPage(pg.p + 1);
      const vp = page.getViewport({ scale: sc, rotation: (page.rotate + pg.rot) % 360 });
      const c = document.createElement('canvas'); c.width = vp.width; c.height = vp.height; const x = c.getContext('2d');
      x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
      await page.render({ canvasContext: x, viewport: vp }).promise;
      const blob = await new Promise(r => c.toBlob(r, png ? 'image/png' : 'image/jpeg', .92));
      out.push({ name: `${base()}-${idx[n] + 1}.${ext}`, blob });
    }
    return out.length === 1 ? out[0] : zip(out, base() + '-images.zip');
  },
  async jpg2pdf(){
    const d = await PDFLib.PDFDocument.create();
    for (let n = 0; n < S.images.length; n++){
      $('#busyTxt').textContent = t('bImg', n + 1, S.images.length);
      const im = S.images[n], [pw, ph] = pageDims(im), p = d.addPage([pw, ph]), Lo = layout(im, pw, ph);
      let emb;
      if (im.type === 'image/png') emb = await d.embedPng(await (await fetch(im.src)).arrayBuffer());
      else {
        const c = document.createElement('canvas'); c.width = im.w; c.height = im.h; const x = c.getContext('2d');
        x.fillStyle = '#fff'; x.fillRect(0, 0, im.w, im.h); x.drawImage(im.el, 0, 0);
        emb = await d.embedJpg(await (await fetch(c.toDataURL('image/jpeg', .92))).arrayBuffer());
      }
      p.drawImage(emb, { x: Lo.x, y: ph - Lo.y - Lo.h, width: Lo.w, height: Lo.h });
    }
    return { blob: await pdfBlob(d), name: base() + '.pdf' };
  },
  async word2pdf(){
    // html2canvas يحتاج المحتوى ظاهرًا على الشاشة، لذلك نغطيه بشاشة انتظار كاملة
    busy(t('processing'), true);
    const box = document.createElement('div');
    box.innerHTML = S.docx.html; box.dir = 'auto';
    Object.assign(box.style, { position: 'absolute', left: '0', top: '0', width: '780px', padding: '36px', background: '#fff', color: '#1a1a1a', fontFamily: FONT, lineHeight: '1.7', fontSize: '14px', zIndex: '9998' });
    document.body.appendChild(box);
    try {
      if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const blob = await html2pdf().set({ margin: 10, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }).from(box).toPdf().output('blob');
      return { blob, name: base() + '.pdf' };
    } finally { box.remove(); }
  }
};

$('#btnRun').onclick = async () => {
  if (!canRun()) return; busy(t('processing'));
  try { const r = await RUN[S.tool](); S.result = r; saveBlob(r.blob, r.name); if (window.gtag) gtag('event', 'pdf_tool_run', { tool: S.tool }); }
  catch (e) { console.error(e); toast(t('err')); }
  unbusy(); renderResult(); updateTop();
};
$('#btnDl').onclick = () => { if (S.result) saveBlob(S.result.blob, S.result.name); };
$('#btnReset').onclick = () => { S.files = []; S.images = []; S.docx = null; S.active = null; S.result = null; S.out = ''; S.wm.img = null; rebuildPages(); renderAll(); };

/* =====================================================================
   التهيئة
===================================================================== */
function init(){
  $('#pvPrev').innerHTML = svg('prev'); $('#pvNext').innerHTML = svg('next');
  $('#zIn').innerHTML = svg('plus'); $('#zOut').innerHTML = svg('minus'); $('#zFit').innerHTML = svg('fit');
  applyLang();
  initAuth();
  // فتح أداة محددة مباشرة عبر ?tool= (يدعم الأسماء القديمة من tools.html)
  const q = new URLSearchParams(location.search).get('tool');
  const found = q && TOOLS.find(x => x.id === q || (x.alias || []).includes(q));
  selectTool(found ? found.id : 'merge');
  if (document.fonts) document.fonts.load(`700 20px ${FONT}`).then(() => { if (S.tool === 'watermark') wmRedraw(); });
}
document.addEventListener('DOMContentLoaded', init);
