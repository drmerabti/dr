/* =========================================================
   مولّد الشهادات — Merabti Academy
   Phase 1: 12 templates, AR / FR / EN, batch issuing, QR, PDF
   ========================================================= */
(function () {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const STORE_KEY = 'merabti_certificate_v1';
const UI_KEY = 'merabti_certificate_ui';
const SIZE = { l: [1123, 794], p: [794, 1123] };
const XLSX_URL = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';

/* ---------------------------------------------------------
   UI strings
--------------------------------------------------------- */
const UI = {
  ar: {
    tool_name:'مولّد الشهادات', gallery:'معرض القوالب', search:'ابحث عن قالب...', back_tools:'العودة إلى الأدوات',
    cat_all:'الكل', cat_honor:'تكريم', cat_part:'مشاركة', cat_train:'تكوين وتدريب', cat_success:'نجاح وتفوّق', cat_work:'عمل وخبرة', cat_school:'مدرسية',
    or_all:'كل الاتجاهات', or_l:'أفقية', or_p:'عمودية',
    fullscreen:'ملء الشاشة', mine:'شهاداتي', save:'حفظ في حسابي', pdf:'تحميل PDF', toggle_panel:'إظهار / إخفاء حيّز التعبئة', fit:'ملاءمة الشاشة',
    prev:'الشهادة السابقة', nextr:'الشهادة التالية',
    sec_style:'التنسيق', sec_style_d:'اللغة، الألوان والخط',
    sec_org:'الجهة المانحة', sec_org_d:'اسم المؤسسة وشعارها',
    sec_text:'نص الشهادة', sec_text_d:'النوع، المستفيد والنص',
    sec_rec:'المستفيدون', sec_rec_single:'شهادة واحدة', sec_rec_batch:'إصدار جماعي: {n} شهادة',
    sec_sign:'التوقيع والتحقق', sec_sign_d:'التاريخ، التوقيع، الختم ورمز QR',
    f_org:'اسم المؤسسة', f_orgSub:'سطر إضافي (مديرية، قسم...)', f_logo:'الشعار',
    f_title:'نوع الشهادة', f_intro:'عبارة التقديم', f_name:'اسم المستفيد', f_detail:'الصفة / التفاصيل (اختياري)', f_body:'نص الشهادة',
    f_place:'المكان', f_date:'التاريخ', f_signer:'اسم الموقّع', f_signerTitle:'صفة الموقّع', f_sig:'التوقيع', f_stamp:'الختم',
    f_no:'رقم الشهادة', f_no_h:'في الإصدار الجماعي يزداد الرقم تلقائيًا لكل شهادة',
    sh_logo:'إظهار الشعار', sh_sig:'إظهار التوقيع', sh_stamp:'إظهار الختم', sh_qr:'إظهار رمز QR', sh_no:'إظهار رقم الشهادة',
    def_note:'صورة نموذجية تظهر حتى ترفع صورتك', def_stamp:'ختم نموذجي باسم المؤسسة يظهر حتى ترفع ختمك',
    mode_single:'شهادة واحدة', mode_batch:'إصدار جماعي',
    single_h:'اكتب اسم المستفيد في قسم «نص الشهادة». اختر «إصدار جماعي» لتوليد شهادة لكل اسم في قائمة.',
    f_names:'قائمة الأسماء', f_names_h:'اسم في كل سطر. لتفاصيل خاصة بشخص اكتب: الاسم | التفاصيل',
    up_xl:'استيراد من Excel', xl_h:'العمود الأول: الاسم — العمود الثاني (اختياري): التفاصيل',
    count:'عدد الشهادات: {n}', batch_name_h:'في الإصدار الجماعي تُؤخذ الأسماء من قسم «المستفيدون»',
    color:'اللون الرئيسي', font:'خط العنوان والاسم', font_auto:'خط القالب', clang:'لغة الشهادة', reset_txt:'استعادة نصوص القالب',
    add_img:'رفع صورة', next:'التالي', done:'تم',
    t_saved:'تم الحفظ', t_saved_cloud:'تم الحفظ في حسابك', t_save_err:'تعذّر الحفظ: الصور كبيرة جدًا', t_too_big:'الصور كبيرة جدًا للحفظ في الحساب',
    t_pdf:'جاري تجهيز ملف PDF...', t_pdf_prog:'جاري تجهيز الشهادة {i} من {n}...', t_pdf_ok:'تم تحميل الملف', t_pdf_err:'تعذّر إنشاء ملف PDF',
    t_tpl:'تم تطبيق القالب', t_reset:'تمت استعادة نصوص القالب', no_results:'لا توجد قوالب مطابقة',
    t_xl_ok:'تم استيراد {n} اسمًا', t_xl_err:'تعذّر قراءة الملف', t_xl_empty:'لم يُعثر على أسماء في الملف', t_no_names:'أضف قائمة الأسماء أولًا',
    login_title:'سجّل دخولك لحفظ شهاداتك', login_text:'احفظ شهاداتك في حسابك وافتحها من أي جهاز.', login_google:'الدخول بحساب Google', login_site:'تسجيل الدخول من الموقع', cancel:'إلغاء',
    t_cloud_err:'تعذّر الاتصال بالحساب، حاول لاحقًا', loading:'جاري التحميل...', mine_empty:'لا توجد شهادات محفوظة بعد', current:'الحالية', untitled:'بدون عنوان',
    open_b:'فتح', dup_b:'نسخ', del_b:'حذف', new_b:'شهادة جديدة', copy_suffix:' (نسخة)', confirm_del:'حذف هذه الشهادة نهائيًا؟',
    t_new:'شهادة جديدة', t_opened:'تم فتح الشهادة', t_dup:'تم النسخ', t_deleted:'تم الحذف'
  },
  fr: {
    tool_name:'Créateur de certificats', gallery:'Galerie de modèles', search:'Rechercher un modèle...', back_tools:'Retour aux outils',
    cat_all:'Tous', cat_honor:'Honneur', cat_part:'Participation', cat_train:'Formation', cat_success:'Réussite & excellence', cat_work:'Travail & expérience', cat_school:'Scolaire',
    or_all:'Toutes orientations', or_l:'Paysage', or_p:'Portrait',
    fullscreen:'Plein écran', mine:'Mes certificats', save:'Enregistrer dans mon compte', pdf:'Télécharger PDF', toggle_panel:'Afficher / masquer le panneau', fit:'Ajuster à l’écran',
    prev:'Certificat précédent', nextr:'Certificat suivant',
    sec_style:'Mise en forme', sec_style_d:'Langue, couleurs et police',
    sec_org:'Organisme émetteur', sec_org_d:'Nom et logo de l’organisme',
    sec_text:'Texte du certificat', sec_text_d:'Type, bénéficiaire et texte',
    sec_rec:'Bénéficiaires', sec_rec_single:'Un seul certificat', sec_rec_batch:'Émission groupée : {n} certificats',
    sec_sign:'Signature et vérification', sec_sign_d:'Date, signature, cachet et QR',
    f_org:'Nom de l’organisme', f_orgSub:'Ligne supplémentaire (direction, service...)', f_logo:'Logo',
    f_title:'Type de certificat', f_intro:'Formule d’introduction', f_name:'Nom du bénéficiaire', f_detail:'Qualité / détails (optionnel)', f_body:'Texte du certificat',
    f_place:'Lieu', f_date:'Date', f_signer:'Nom du signataire', f_signerTitle:'Qualité du signataire', f_sig:'Signature', f_stamp:'Cachet',
    f_no:'Numéro du certificat', f_no_h:'En émission groupée, le numéro augmente automatiquement',
    sh_logo:'Afficher le logo', sh_sig:'Afficher la signature', sh_stamp:'Afficher le cachet', sh_qr:'Afficher le code QR', sh_no:'Afficher le numéro',
    def_note:'Image d’exemple affichée jusqu’à l’ajout de la vôtre', def_stamp:'Cachet d’exemple au nom de l’organisme, jusqu’à l’ajout du vôtre',
    mode_single:'Un certificat', mode_batch:'Émission groupée',
    single_h:'Saisissez le nom dans « Texte du certificat ». Choisissez « Émission groupée » pour un certificat par nom d’une liste.',
    f_names:'Liste des noms', f_names_h:'Un nom par ligne. Pour des détails propres à une personne : Nom | Détails',
    up_xl:'Importer depuis Excel', xl_h:'Colonne 1 : nom — Colonne 2 (optionnelle) : détails',
    count:'Nombre de certificats : {n}', batch_name_h:'En émission groupée, les noms viennent de la section « Bénéficiaires »',
    color:'Couleur principale', font:'Police du titre et du nom', font_auto:'Police du modèle', clang:'Langue du certificat', reset_txt:'Restaurer les textes du modèle',
    add_img:'Ajouter une image', next:'Suivant', done:'Terminé',
    t_saved:'Enregistré', t_saved_cloud:'Enregistré dans votre compte', t_save_err:'Échec : images trop lourdes', t_too_big:'Images trop lourdes pour le compte',
    t_pdf:'Préparation du PDF...', t_pdf_prog:'Préparation du certificat {i} sur {n}...', t_pdf_ok:'Fichier téléchargé', t_pdf_err:'Impossible de créer le PDF',
    t_tpl:'Modèle appliqué', t_reset:'Textes du modèle restaurés', no_results:'Aucun modèle correspondant',
    t_xl_ok:'{n} noms importés', t_xl_err:'Impossible de lire le fichier', t_xl_empty:'Aucun nom trouvé dans le fichier', t_no_names:'Ajoutez d’abord la liste des noms',
    login_title:'Connectez-vous pour enregistrer vos certificats', login_text:'Enregistrez vos certificats dans votre compte et ouvrez-les sur tous vos appareils.', login_google:'Se connecter avec Google', login_site:'Se connecter depuis le site', cancel:'Annuler',
    t_cloud_err:'Connexion au compte impossible, réessayez plus tard', loading:'Chargement...', mine_empty:'Aucun certificat enregistré', current:'Actuel', untitled:'Sans titre',
    open_b:'Ouvrir', dup_b:'Dupliquer', del_b:'Supprimer', new_b:'Nouveau certificat', copy_suffix:' (copie)', confirm_del:'Supprimer définitivement ce certificat ?',
    t_new:'Nouveau certificat', t_opened:'Certificat ouvert', t_dup:'Dupliqué', t_deleted:'Supprimé'
  },
  en: {
    tool_name:'Certificate Maker', gallery:'Template gallery', search:'Search templates...', back_tools:'Back to tools',
    cat_all:'All', cat_honor:'Honor', cat_part:'Participation', cat_train:'Training', cat_success:'Success & excellence', cat_work:'Employment', cat_school:'School',
    or_all:'Any orientation', or_l:'Landscape', or_p:'Portrait',
    fullscreen:'Full screen', mine:'My certificates', save:'Save to my account', pdf:'Download PDF', toggle_panel:'Show / hide panel', fit:'Fit to screen',
    prev:'Previous certificate', nextr:'Next certificate',
    sec_style:'Style', sec_style_d:'Language, colors and font',
    sec_org:'Issuing organization', sec_org_d:'Organization name and logo',
    sec_text:'Certificate text', sec_text_d:'Type, recipient and text',
    sec_rec:'Recipients', sec_rec_single:'Single certificate', sec_rec_batch:'Batch: {n} certificates',
    sec_sign:'Signature & verification', sec_sign_d:'Date, signature, stamp and QR',
    f_org:'Organization name', f_orgSub:'Extra line (department, unit...)', f_logo:'Logo',
    f_title:'Certificate type', f_intro:'Opening line', f_name:'Recipient name', f_detail:'Role / details (optional)', f_body:'Certificate text',
    f_place:'Place', f_date:'Date', f_signer:'Signer name', f_signerTitle:'Signer title', f_sig:'Signature', f_stamp:'Stamp',
    f_no:'Certificate number', f_no_h:'In batch mode the number increases for each certificate',
    sh_logo:'Show logo', sh_sig:'Show signature', sh_stamp:'Show stamp', sh_qr:'Show QR code', sh_no:'Show certificate number',
    def_note:'A sample image shows until you upload yours', def_stamp:'A sample stamp with the organization name shows until you upload yours',
    mode_single:'Single', mode_batch:'Batch',
    single_h:'Type the recipient name in “Certificate text”. Choose “Batch” to create one certificate for each name in a list.',
    f_names:'Names list', f_names_h:'One name per line. For person-specific details: Name | Details',
    up_xl:'Import from Excel', xl_h:'Column 1: name — Column 2 (optional): details',
    count:'Certificates: {n}', batch_name_h:'In batch mode, names come from the “Recipients” section',
    color:'Main color', font:'Title & name font', font_auto:'Template font', clang:'Certificate language', reset_txt:'Restore template texts',
    add_img:'Upload image', next:'Next', done:'Done',
    t_saved:'Saved', t_saved_cloud:'Saved to your account', t_save_err:'Could not save: images are too large', t_too_big:'Images are too large for your account',
    t_pdf:'Preparing PDF...', t_pdf_prog:'Preparing certificate {i} of {n}...', t_pdf_ok:'File downloaded', t_pdf_err:'Could not create the PDF',
    t_tpl:'Template applied', t_reset:'Template texts restored', no_results:'No matching templates',
    t_xl_ok:'{n} names imported', t_xl_err:'Could not read the file', t_xl_empty:'No names found in the file', t_no_names:'Add the names list first',
    login_title:'Sign in to save your certificates', login_text:'Save certificates to your account and open them on any device.', login_google:'Sign in with Google', login_site:'Sign in from the site', cancel:'Cancel',
    t_cloud_err:'Could not reach your account, try again later', loading:'Loading...', mine_empty:'No saved certificates yet', current:'Current', untitled:'Untitled',
    open_b:'Open', dup_b:'Duplicate', del_b:'Delete', new_b:'New certificate', copy_suffix:' (copy)', confirm_del:'Delete this certificate permanently?',
    t_new:'New certificate', t_opened:'Certificate opened', t_dup:'Duplicated', t_deleted:'Deleted'
  }
};

/* labels printed on the certificate itself */
const CL = {
  ar: { issued:'حُرّرت في', no:'رقم:', sep:'، ' },
  fr: { issued:'Fait à', no:'N° :', sep:', le ' },
  en: { issued:'Issued in', no:'No.', sep:', ' }
};

/* ---------------------------------------------------------
   Sample content (per category and language)
--------------------------------------------------------- */
const COMMON = {
  ar: { name:'أحمد بن علي', signer:'كريم منصوري', place:'الجزائر' },
  fr: { name:'Ahmed Benali', signer:'Karim Mansouri', place:'Alger' },
  en: { name:'Ahmed Benali', signer:'Karim Mansouri', place:'Algiers' }
};
const SAMPLE = {
  honor: {
    ar: { org:'مؤسسة الأطلس للصناعات', orgSub:'مديرية الموارد البشرية', title:'شهادة تكريم', intro:'تتشرّف إدارة المؤسسة بمنح هذه الشهادة إلى', detail:'رئيس مصلحة الصيانة',
      body:'تقديرًا لجهوده المتميّزة وتفانيه في العمل، وإسهامه الفعّال في تحقيق أهداف المؤسسة، مع خالص التمنيات بدوام التوفيق والنجاح.', signerTitle:'المدير العام' },
    fr: { org:'Groupe Atlas Industries', orgSub:'Direction des ressources humaines', title:'Certificat d’honneur', intro:'La direction a l’honneur de décerner ce certificat à', detail:'Chef du service maintenance',
      body:'En reconnaissance de ses efforts remarquables, de son dévouement et de sa précieuse contribution à la réussite de l’entreprise, avec nos meilleurs vœux de succès.', signerTitle:'Directeur général' },
    en: { org:'Atlas Industries Group', orgSub:'Human Resources Department', title:'Certificate of Honor', intro:'This certificate is proudly presented to', detail:'Head of Maintenance',
      body:'In recognition of outstanding effort, dedication and a valuable contribution to the company’s achievements, with best wishes for continued success.', signerTitle:'General Manager' }
  },
  part: {
    ar: { org:'جامعة العلوم والتكنولوجيا', orgSub:'كلية الهندسة الكهربائية', title:'شهادة مشاركة', intro:'تشهد اللجنة المنظمة بأن', detail:'',
      body:'قد شارك بمداخلة علمية في الملتقى الوطني حول الطاقات المتجددة والتحوّل الطاقوي، المنعقد يومي 12 و13 أكتوبر 2026.', signerTitle:'رئيس اللجنة المنظمة' },
    fr: { org:'Université des Sciences et de la Technologie', orgSub:'Faculté de génie électrique', title:'Attestation de participation', intro:'Le comité d’organisation atteste que', detail:'',
      body:'a participé par une communication scientifique au Séminaire national sur les énergies renouvelables et la transition énergétique, tenu les 12 et 13 octobre 2026.', signerTitle:'Président du comité d’organisation' },
    en: { org:'University of Science and Technology', orgSub:'Faculty of Electrical Engineering', title:'Certificate of Participation', intro:'The organizing committee certifies that', detail:'',
      body:'has participated with a scientific paper in the National Seminar on Renewable Energy and Energy Transition, held on October 12–13, 2026.', signerTitle:'Chair of the Organizing Committee' }
  },
  train: {
    ar: { org:'مركز الأفق للتكوين المهني', orgSub:'معتمد من وزارة التكوين والتعليم المهنيين', title:'شهادة تكوين', intro:'يشهد مدير المركز بأن المتربّص', detail:'',
      body:'قد تابع بنجاح الدورة التكوينية «برمجة المتحكمات المنطقية PLC» بحجم ساعي قدره 40 ساعة، خلال الفترة الممتدة من 01 إلى 30 سبتمبر 2026.', signerTitle:'مدير المركز' },
    fr: { org:'Centre de formation Horizon', orgSub:'Agréé par le ministère de la Formation professionnelle', title:'Attestation de formation', intro:'Le directeur du centre atteste que le stagiaire', detail:'',
      body:'a suivi avec succès la formation « Programmation des automates PLC » d’une durée de 40 heures, du 01 au 30 septembre 2026.', signerTitle:'Directeur du centre' },
    en: { org:'Horizon Training Center', orgSub:'Accredited vocational training center', title:'Certificate of Training', intro:'The director of the center certifies that', detail:'',
      body:'has successfully completed the training course “PLC Programming” (40 hours), from September 1 to 30, 2026.', signerTitle:'Center Director' }
  },
  success: {
    ar: { org:'متوسطة الشهيد العربي بن مهيدي', orgSub:'مديرية التربية', title:'شهادة تفوّق', intro:'تُمنح هذه الشهادة للتلميذ', detail:'السنة الرابعة متوسط',
      body:'لحصوله على المرتبة الأولى في الفصل الأول بمعدل 18.75 من 20، تشجيعًا له على الاجتهاد والمثابرة ومواصلة التميّز.', signerTitle:'مدير المتوسطة' },
    fr: { org:'CEM Larbi Ben M’hidi', orgSub:'Direction de l’éducation', title:'Certificat d’excellence', intro:'Ce certificat est décerné à l’élève', detail:'4e année moyenne',
      body:'pour avoir obtenu la première place au premier trimestre avec une moyenne de 18,75/20, en encouragement à poursuivre ses efforts.', signerTitle:'Directeur de l’établissement' },
    en: { org:'Larbi Ben M’hidi Middle School', orgSub:'Directorate of Education', title:'Certificate of Excellence', intro:'This certificate is awarded to', detail:'Grade 9',
      body:'for ranking first in the first term with an average of 18.75/20, in encouragement to keep up the hard work.', signerTitle:'Principal' }
  },
  work: {
    ar: { org:'مؤسسة الأطلس للصناعات', orgSub:'المديرية العامة', title:'شهادة عمل', intro:'يشهد المدير العام الموقّع أدناه بأن السيد', detail:'رقم التسجيل: 2018/047',
      body:'يعمل لدى مؤسستنا بصفة مهندس دولة في الصيانة الصناعية منذ 01 مارس 2018 إلى يومنا هذا.\nسُلّمت هذه الشهادة بطلب من المعني لاستعمالها في حدود ما يسمح به القانون.', signerTitle:'المدير العام' },
    fr: { org:'Groupe Atlas Industries', orgSub:'Direction générale', title:'Attestation de travail', intro:'Le directeur général soussigné atteste que M.', detail:'Matricule : 2018/047',
      body:'est employé au sein de notre entreprise en qualité d’ingénieur d’État en maintenance industrielle depuis le 01 mars 2018 à ce jour.\nLa présente attestation est délivrée à l’intéressé pour servir et valoir ce que de droit.', signerTitle:'Directeur général' },
    en: { org:'Atlas Industries Group', orgSub:'General Management', title:'Employment Certificate', intro:'The undersigned General Manager certifies that Mr.', detail:'Employee ID: 2018/047',
      body:'has been employed by our company as a State Engineer in Industrial Maintenance since March 1, 2018, to date.\nThis certificate is issued at the employee’s request for whatever legal purpose it may serve.', signerTitle:'General Manager' }
  },
  school: {
    ar: { org:'مدرسة الأمل الابتدائية', orgSub:'', title:'شهادة شكر وتقدير', intro:'تُهدى هذه الشهادة إلى التلميذ المتميّز', detail:'السنة الخامسة ابتدائي',
      body:'تقديرًا لانضباطه وحسن سلوكه وتميّزه في الأنشطة المدرسية، متمنّين له مزيدًا من التألّق والنجاح.', signerTitle:'مدير المدرسة' },
    fr: { org:'École primaire El Amel', orgSub:'', title:'Certificat de félicitations', intro:'Ce certificat est offert à l’élève exemplaire', detail:'5e année primaire',
      body:'pour sa discipline, son excellent comportement et sa brillante participation aux activités scolaires. Nous lui souhaitons encore plus de réussite.', signerTitle:'Directeur de l’école' },
    en: { org:'El Amel Primary School', orgSub:'', title:'Certificate of Appreciation', intro:'This certificate is presented to our outstanding student', detail:'Grade 5',
      body:'for excellent discipline, good behavior and brilliant participation in school activities. We wish them continued success.', signerTitle:'School Principal' }
  }
};
const CATS = ['honor', 'part', 'train', 'success', 'work', 'school'];
const LOCALE = { ar:'ar-DZ-u-nu-latn', fr:'fr-FR', en:'en-US' };
function today(lang) {
  try { return new Date().toLocaleDateString(LOCALE[lang], { day:'numeric', month:'long', year:'numeric' }); }
  catch (e) { return new Date().toLocaleDateString(); }
}

/* ---------------------------------------------------------
   SVG helpers
--------------------------------------------------------- */
let uidN = 0;
const nid = p => (p || 'g') + (++uidN) + Math.random().toString(36).slice(2, 6);
function rng(seed) { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = s * 16807 % 2147483647) / 2147483647; }
function shade(hex, amt) {
  let h = hex.replace('#', ''); if (h.length === 3) h = h.split('').map(x => x + x).join('');
  const n = parseInt(h, 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = v => Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt)));
  return '#' + [f(r), f(g), f(b)].map(v => v.toString(16).padStart(2, '0')).join('');
}
function starPts(cx, cy, r1, r2, n, rot = -90) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (rot + i * 180 / n) * Math.PI / 180, r = i % 2 ? r2 : r1;
    pts.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1));
  }
  return pts.join(' ');
}
const star8 = (cx, cy, r) => starPts(cx, cy, r, r * 0.7654, 8, -90);
const star5 = (cx, cy, r) => starPts(cx, cy, r, r * 0.45, 5, -90);
const frame = (W, H, i, attrs) => `<rect x="${i}" y="${i}" width="${W - 2 * i}" height="${H - 2 * i}" fill="none" ${attrs}/>`;
const ring = (W, H, a, b) => `M${a} ${a}H${W - a}V${H - a}H${a}Z M${b} ${b}V${H - b}H${W - b}V${b}Z`;
function corners(W, H, i, g) {
  return [`translate(${i} ${i})`, `translate(${W - i} ${i}) scale(-1 1)`, `translate(${i} ${H - i}) scale(1 -1)`, `translate(${W - i} ${H - i}) scale(-1 -1)`]
    .map(t => `<g transform="${t}">${g}</g>`).join('');
}
function alongEdges(W, H, inset, step, fn) {
  let s = '';
  const nx = Math.max(1, Math.round((W - 2 * inset) / step)), ny = Math.max(1, Math.round((H - 2 * inset) / step));
  const sx = (W - 2 * inset) / nx, sy = (H - 2 * inset) / ny;
  for (let i = 0; i <= nx; i++) { s += fn(inset + i * sx, inset, i); s += fn(inset + i * sx, H - inset, i + 1); }
  for (let j = 1; j < ny; j++) { s += fn(inset, inset + j * sy, j + 1); s += fn(W - inset, inset + j * sy, j); }
  return s;
}

/* ---------------------------------------------------------
   Decorations (every element carries explicit fill/stroke,
   so html2canvas renders them exactly)
--------------------------------------------------------- */
const DECO = {
  royal(W, H, p) {
    let s = `<rect width="${W}" height="${H}" fill="${p.c1}"/><rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="${p.c3}"/>`;
    const cx = W / 2, cy = H / 2, R = Math.min(W, H);
    for (let i = 0; i < 24; i++) s += `<ellipse cx="${cx}" cy="${cy}" rx="${R * .33}" ry="${R * .12}" fill="none" stroke="${p.c2}" stroke-opacity=".08" stroke-width="1.2" transform="rotate(${i * 7.5} ${cx} ${cy})"/>`;
    s += frame(W, H, 38, `stroke="${p.c2}" stroke-width="3"`) + frame(W, H, 47, `stroke="${p.c2}" stroke-width="1"`);
    s += corners(W, H, 38, `<path d="M0 0H92Q56 10 42 42Q10 56 0 92Z" fill="${p.c2}"/><path d="M16 120Q16 16 120 16" fill="none" stroke="${p.c2}" stroke-width="1.6"/><path d="M26 76Q26 26 76 26" fill="none" stroke="${p.c1}" stroke-width="1.4"/><circle cx="36" cy="36" r="7" fill="${p.c1}" stroke="${p.c3}" stroke-width="2"/>`);
    [38, H - 38].forEach(y => { s += `<g transform="translate(${W / 2} ${y})"><path d="M-80 0H-18M18 0H80" fill="none" stroke="${p.c2}" stroke-width="2"/><path d="M0 -13L13 0L0 13L-13 0Z" fill="${p.c2}"/><circle r="4" fill="${p.c3}"/></g>`; });
    return s;
  },
  classic(W, H, p) {
    const id = nid('pt');
    let s = `<defs><pattern id="${id}" width="16" height="16" patternUnits="userSpaceOnUse">` +
      [[8, 8, p.c1, .55], [0, 0, p.c2, .5], [16, 0, p.c2, .5], [0, 16, p.c2, .5], [16, 16, p.c2, .5]].map(([x, y, c, o]) => `<circle cx="${x}" cy="${y}" r="8" fill="none" stroke="${c}" stroke-opacity="${o}" stroke-width=".8"/>`).join('') + `</pattern></defs>`;
    s += `<rect width="${W}" height="${H}" fill="${p.c3}"/><path fill-rule="evenodd" d="${ring(W, H, 24, 64)}" fill="url(#${id})"/>`;
    s += frame(W, H, 24, `stroke="${p.c1}" stroke-width="3"`) + frame(W, H, 64, `stroke="${p.c1}" stroke-width="1.5"`) + frame(W, H, 72, `stroke="${p.c2}" stroke-width=".8"`);
    s += corners(W, H, 24, `<rect width="40" height="40" fill="${p.c1}"/><polygon points="${star8(20, 20, 14)}" fill="${p.c2}"/><circle cx="20" cy="20" r="4.5" fill="${p.c3}"/>`);
    [[W / 2, 44], [W / 2, H - 44], [44, H / 2], [W - 44, H / 2]].forEach(([x, y]) => {
      s += `<circle cx="${x}" cy="${y}" r="23" fill="${p.c3}" stroke="${p.c1}" stroke-width="2"/><polygon points="${star8(x, y, 14)}" fill="${p.c1}"/><circle cx="${x}" cy="${y}" r="4" fill="${p.c2}"/>`;
    });
    return s;
  },
  islamic(W, H, p) {
    let s = `<rect width="${W}" height="${H}" fill="${p.c3}"/>`;
    const cx = W / 2, cy = H / 2, R = Math.min(W, H) * .4;
    [0, 22.5].forEach(r => { s += `<polygon points="${starPts(cx, cy, R, R * .7654, 8, -90 + r)}" fill="none" stroke="${p.c1}" stroke-opacity=".06" stroke-width="2"/>`; });
    s += `<circle cx="${cx}" cy="${cy}" r="${R * .55}" fill="none" stroke="${p.c1}" stroke-opacity=".05" stroke-width="2"/>`;
    s += `<path fill-rule="evenodd" d="${ring(W, H, 22, 70)}" fill="${p.c1}"/>`;
    s += alongEdges(W, H, 46, 48, (x, y) => `<polygon points="${star8(x, y, 12)}" fill="${p.c2}"/><circle cx="${x}" cy="${y}" r="3.2" fill="${p.c1}"/>`);
    s += frame(W, H, 80, `stroke="${p.c2}" stroke-width="1.6"`) + frame(W, H, 86, `stroke="${p.c1}" stroke-width=".7"`);
    s += corners(W, H, 46, `<polygon points="${star8(0, 0, 26)}" fill="${p.c2}"/><circle r="10" fill="${p.c1}"/><circle r="4" fill="${p.c2}"/>`);
    s += `<g transform="translate(${W / 2} 94)"><path d="M-60 0H60" fill="none" stroke="${p.c2}" stroke-width="1"/><polygon points="${star8(0, 0, 9)}" fill="${p.c2}"/></g>`;
    return s;
  },
  modern(W, H, p) {
    let s = `<rect width="${W}" height="${H}" fill="#FFFFFF"/>`;
    s += `<polygon points="0,0 262,0 172,${H} 0,${H}" fill="${p.c1}"/>`;
    s += `<polygon points="262,0 300,0 210,${H} 172,${H}" fill="${p.c2}"/>`;
    s += `<polygon points="318,0 326,0 236,${H} 228,${H}" fill="${p.c3}"/>`;
    for (let y = 30; y < H; y += 22) for (let x = 22; x < 240; x += 22) {
      if (x < 262 - 90 * y / H - 24) s += `<circle cx="${x}" cy="${y}" r="1.6" fill="#FFFFFF" fill-opacity=".16"/>`;
    }
    s += `<polygon points="${W},0 ${W - 130},0 ${W},130" fill="${p.c2}"/><polygon points="${W},0 ${W - 62},0 ${W},62" fill="${p.c1}"/>`;
    s += `<polygon points="${W},${H} ${W - 86},${H} ${W},${H - 86}" fill="${p.c3}"/>`;
    return s;
  },
  training(W, H, p) {
    const A = 280, B = 210;
    let g = `<polygon points="${W - A},0 ${W},0 ${W},${B}" fill="${p.c1}"/><polygon points="${W - A * .6},0 ${W},0 ${W},${B * .6}" fill="${p.c2}" fill-opacity=".9"/>`;
    for (let i = 0; i < 5; i++) {
      const y = 18 + i * 30, len = Math.max(26, (B - y) * A / B - 56 - (i % 2) * 34);
      const x2 = W - len;
      g += `<path d="M${W} ${y}H${x2 + 18}L${x2} ${y + 18}" fill="none" stroke="#FFFFFF" stroke-opacity=".45" stroke-width="2"/><circle cx="${x2}" cy="${y + 18}" r="3.6" fill="${p.c1}" stroke="#FFFFFF" stroke-opacity=".8" stroke-width="2"/>`;
    }
    let s = `<rect width="${W}" height="${H}" fill="#FFFFFF"/>` + g + `<g transform="rotate(180 ${W / 2} ${H / 2})">${g}</g>`;
    s += frame(W, H, 32, `stroke="${p.c1}" stroke-opacity=".22" stroke-width="1.2"`);
    const r = rng(7);
    for (let i = 0; i < 26; i++) {
      const x = 60 + r() * (W - 120), y = r() < .5 ? 48 + r() * 26 : H - 48 - r() * 26;
      if ((x > W - A - 40 && y < B) || (x < A + 40 && y > H - B)) continue;
      s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(1.5 + r() * 2).toFixed(1)}" fill="${p.c2}" fill-opacity=".45"/>`;
    }
    return s;
  },
  minimal(W, H, p) {
    let s = `<rect width="${W}" height="${H}" fill="#FFFFFF"/>`;
    [150, 195, 240].forEach((r, i) => {
      s += `<circle cx="${W}" cy="0" r="${r}" fill="none" stroke="${p.c2}" stroke-opacity="${.5 - i * .12}" stroke-width="1.3"/>`;
      s += `<circle cx="0" cy="${H}" r="${r}" fill="none" stroke="${p.c2}" stroke-opacity="${.5 - i * .12}" stroke-width="1.3"/>`;
    });
    s += `<circle cx="${W}" cy="0" r="90" fill="${p.c1}"/><circle cx="0" cy="${H}" r="90" fill="${p.c1}"/>`;
    s += frame(W, H, 34, `stroke="${p.c1}" stroke-width="1.4"`) + frame(W, H, 42, `stroke="${p.c2}" stroke-width=".8"`);
    return s;
  },
  participation(W, H, p) {
    const g1 = nid('lg'), g2 = nid('lg');
    let s = `<defs><linearGradient id="${g1}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${p.c1}"/><stop offset="1" stop-color="${p.c2}"/></linearGradient>` +
      `<linearGradient id="${g2}" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="${p.c1}"/><stop offset="1" stop-color="${p.c2}"/></linearGradient></defs>`;
    s += `<rect width="${W}" height="${H}" fill="#FBF8FF"/>`;
    const wave = (h, a) => `M0 0H${W}V${h}C${W * .78} ${h + a} ${W * .6} ${h - a} ${W * .4} ${h + a * .4}S${W * .12} ${h + a * .9} 0 ${h - a * .3}Z`;
    s += `<path d="${wave(118, 40)}" fill="url(#${g1})" fill-opacity=".25"/><path d="${wave(84, 34)}" fill="url(#${g1})"/>`;
    s += `<g transform="translate(${W} ${H}) scale(-1 -1)"><path d="${wave(110, 38)}" fill="url(#${g2})" fill-opacity=".25"/><path d="${wave(76, 30)}" fill="url(#${g2})"/></g>`;
    for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) {
      s += `<circle cx="${W - 70 - i * 16}" cy="${150 + j * 16}" r="3" fill="${p.c3}" fill-opacity=".8"/>`;
      s += `<circle cx="${70 + i * 16}" cy="${H - 150 - j * 16}" r="3" fill="${p.c3}" fill-opacity=".8"/>`;
    }
    return s;
  },
  academic(W, H, p) {
    let s = `<rect width="${W}" height="${H}" fill="${p.c3}"/>`;
    s += frame(W, H, 30, `stroke="${p.c1}" stroke-width="16"`) + frame(W, H, 46, `stroke="${p.c2}" stroke-width="2"`) + frame(W, H, 52, `stroke="${p.c1}" stroke-width=".8"`);
    s += corners(W, H, 30, `<rect x="-9" y="-9" width="18" height="18" fill="${p.c2}" transform="rotate(45)"/>`);
    const x = 158, y = 150;
    s += `<path d="M${x - 22} ${y + 20}L${x - 44} ${y + 108}L${x - 26} ${y + 96}L${x - 14} ${y + 114}L${x} ${y + 26}Z" fill="${p.c1}"/>`;
    s += `<path d="M${x + 22} ${y + 20}L${x + 44} ${y + 108}L${x + 26} ${y + 96}L${x + 14} ${y + 114}L${x} ${y + 26}Z" fill="${shade(p.c1, -.25)}"/>`;
    s += `<polygon points="${starPts(x, y, 60, 53, 30)}" fill="${p.c2}"/><circle cx="${x}" cy="${y}" r="46" fill="${shade(p.c2, -.12)}"/>`;
    s += `<circle cx="${x}" cy="${y}" r="39" fill="none" stroke="${p.c3}" stroke-width="1.5" stroke-dasharray="3 3"/><polygon points="${star5(x, y, 22)}" fill="${p.c3}"/>`;
    return s;
  },
  excellence(W, H, p) {
    let s = `<rect width="${W}" height="${H}" fill="#FFFFFF"/>`;
    const band = `<polygon points="0,0 196,0 0,196" fill="${p.c1}"/><polygon points="196,0 232,0 0,232 0,196" fill="${p.c2}"/><polygon points="248,0 254,0 0,254 0,248" fill="${p.c2}"/>`;
    s += band + `<g transform="rotate(180 ${W / 2} ${H / 2})">${band}</g>`;
    s += frame(W, H, 26, `stroke="${p.c2}" stroke-width="1.2"`);
    const x = W - 168;
    s += `<polygon points="${x - 44},0 ${x - 16},0 ${x + 6},118 ${x - 20},118" fill="${p.c1}"/><polygon points="${x + 44},0 ${x + 16},0 ${x - 6},118 ${x + 20},118" fill="${shade(p.c1, .25)}"/>`;
    s += `<polygon points="${starPts(x, 150, 52, 46, 24)}" fill="${p.c2}"/><circle cx="${x}" cy="150" r="38" fill="${shade(p.c2, .18)}"/>`;
    s += `<circle cx="${x}" cy="150" r="31" fill="none" stroke="${p.c1}" stroke-width="1.5"/><polygon points="${star5(x, 150, 18)}" fill="${p.c1}"/>`;
    return s;
  },
  kids(W, H, p) {
    const cols = [p.c1, p.c2, p.c3, p.c4];
    let s = `<rect width="${W}" height="${H}" fill="${p.bg}"/>`;
    s += alongEdges(W, H, 24, 36, (x, y, i) => `<circle cx="${x}" cy="${y}" r="17" fill="${cols[i % 4]}"/>`);
    s += `<rect x="54" y="54" width="${W - 108}" height="${H - 108}" rx="30" fill="#FFFFFF" fill-opacity=".75" stroke="${p.c4}" stroke-width="3" stroke-dasharray="12 9"/>`;
    const r = rng(11);
    for (let i = 0; i < 46; i++) {
      const side = Math.floor(r() * 4), t = r();
      let x, y;
      if (side === 0) { x = 80 + t * (W - 160); y = 70 + r() * 40; }
      else if (side === 1) { x = 80 + t * (W - 160); y = H - 70 - r() * 40; }
      else if (side === 2) { x = 70 + r() * 40; y = 110 + t * (H - 220); }
      else { x = W - 70 - r() * 40; y = 110 + t * (H - 220); }
      const c = cols[i % 4], k = r();
      if (k < .35) s += `<rect x="${(x - 4).toFixed(0)}" y="${(y - 7).toFixed(0)}" width="8" height="14" rx="2" fill="${c}" transform="rotate(${(r() * 180).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`;
      else if (k < .7) s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(3 + r() * 3).toFixed(1)}" fill="${c}"/>`;
      else s += `<polygon points="${star5(x, y, 7 + r() * 5)}" fill="${c}"/>`;
    }
    s += corners(W, H, 100, `<polygon points="${star5(0, 0, 32)}" fill="${p.c3}" stroke="#FFFFFF" stroke-width="3"/>`);
    return s;
  },
  corporate(W, H, p) {
    let s = `<rect width="${W}" height="${H}" fill="#FFFFFF"/>`;
    s += `<path d="M0 0H${W}V176L0 236Z" fill="${p.c1}"/><path d="M0 236L${W} 176V190L0 250Z" fill="${p.c2}"/>`;
    for (let y = 20; y < 160; y += 18) for (let x = W - 200; x < W - 20; x += 18) s += `<circle cx="${x}" cy="${y}" r="1.6" fill="#FFFFFF" fill-opacity=".14"/>`;
    s += `<path d="M0 ${H - 56}L${W} ${H - 96}V${H}H0Z" fill="${p.c1}"/><path d="M0 ${H - 70}L${W} ${H - 110}V${H - 102}L0 ${H - 62}Z" fill="${p.c2}"/>`;
    return s;
  },
  official(W, H, p) {
    let s = `<rect width="${W}" height="${H}" fill="#FFFFFF"/>`;
    const cx = W / 2, cy = H / 2 + 40, R = 250;
    [0, 22.5].forEach(r => { s += `<polygon points="${starPts(cx, cy, R, R * .7654, 8, -90 + r)}" fill="none" stroke="${p.c1}" stroke-opacity=".05" stroke-width="2"/>`; });
    s += `<circle cx="${cx}" cy="${cy}" r="${R + 20}" fill="none" stroke="${p.c1}" stroke-opacity=".05" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="${R * .6}" fill="none" stroke="${p.c1}" stroke-opacity=".05" stroke-width="2"/>`;
    s += frame(W, H, 28, `stroke="${p.c1}" stroke-width="2"`) + frame(W, H, 35, `stroke="${p.c1}" stroke-width=".7"`);
    return s;
  }
};

/* ---------------------------------------------------------
   Templates
--------------------------------------------------------- */
const F_AR = ['Amiri', 'Aref Ruqaa', 'El Messiri', 'Reem Kufi', 'Cairo', 'Tajawal', 'Lalezar'];
const F_LAT = ['Cinzel', 'Playfair Display', 'Cormorant Garamond', 'Great Vibes', 'Pinyon Script', 'Montserrat', 'Fredoka'];
const TEMPLATES = [
  { id:'royal', cat:'honor', o:'l', name:{ ar:'ملكي ذهبي', fr:'Royal doré', en:'Royal Gold' },
    pal:{ c1:'#1B2A4A', c2:'#B8913A', c3:'#FBF6EA' }, f:{ ar:['Aref Ruqaa', 'Aref Ruqaa', 'Amiri'], lat:['Cinzel', 'Great Vibes', 'Cormorant Garamond'] }, caps:true },
  { id:'classic', cat:'honor', o:'l', name:{ ar:'كلاسيكي عاجي', fr:'Classique ivoire', en:'Classic Ivory' },
    pal:{ c1:'#7A1F2B', c2:'#B8913A', c3:'#FFFDF6' }, f:{ ar:['Amiri', 'Aref Ruqaa', 'Amiri'], lat:['Cormorant Garamond', 'Pinyon Script', 'Cormorant Garamond'] } },
  { id:'islamic', cat:'honor', o:'l', name:{ ar:'زخرفة إسلامية', fr:'Motifs islamiques', en:'Islamic Pattern' },
    pal:{ c1:'#0E5E6F', c2:'#C9A24A', c3:'#FCFAF4' }, f:{ ar:['El Messiri', 'Aref Ruqaa', 'Amiri'], lat:['Cinzel', 'Cormorant Garamond', 'Cormorant Garamond'] }, caps:true },
  { id:'modern', cat:'train', o:'l', name:{ ar:'عصري هندسي', fr:'Moderne géométrique', en:'Modern Geometric' },
    pal:{ c1:'#0F3D5E', c2:'#F2A541', c3:'#2BB3A3' }, f:{ ar:['Cairo', 'Cairo', 'Tajawal'], lat:['Montserrat', 'Montserrat', 'Montserrat'] } },
  { id:'training', cat:'train', o:'l', name:{ ar:'تكوين تقني', fr:'Formation technique', en:'Technical Training' },
    pal:{ c1:'#1565C0', c2:'#00ACC1', c3:'#FFFFFF' }, f:{ ar:['Cairo', 'Cairo', 'Tajawal'], lat:['Montserrat', 'Montserrat', 'Montserrat'] } },
  { id:'minimal', cat:'part', o:'l', name:{ ar:'بسيط أنيق', fr:'Minimal élégant', en:'Elegant Minimal' },
    pal:{ c1:'#22313F', c2:'#C8A04B', c3:'#FFFFFF' }, f:{ ar:['El Messiri', 'El Messiri', 'Tajawal'], lat:['Playfair Display', 'Playfair Display', 'Montserrat'] } },
  { id:'participation', cat:'part', o:'l', name:{ ar:'أمواج', fr:'Vagues', en:'Waves' },
    pal:{ c1:'#5B2A86', c2:'#C13584', c3:'#F7B32B' }, f:{ ar:['Reem Kufi', 'El Messiri', 'Tajawal'], lat:['Playfair Display', 'Playfair Display', 'Montserrat'] } },
  { id:'academic', cat:'success', o:'l', name:{ ar:'أكاديمي', fr:'Académique', en:'Academic' },
    pal:{ c1:'#1F4D3A', c2:'#B8913A', c3:'#FBFAF3' }, f:{ ar:['Amiri', 'Aref Ruqaa', 'Amiri'], lat:['Cinzel', 'Great Vibes', 'Cormorant Garamond'] }, caps:true },
  { id:'excellence', cat:'success', o:'l', name:{ ar:'وسام التفوّق', fr:'Médaille d’excellence', en:'Excellence Medal' },
    pal:{ c1:'#1E1E24', c2:'#C9A227', c3:'#FFFFFF' }, f:{ ar:['Reem Kufi', 'Aref Ruqaa', 'Tajawal'], lat:['Cinzel', 'Great Vibes', 'Montserrat'] }, caps:true },
  { id:'kids', cat:'school', o:'l', name:{ ar:'أطفال مرح', fr:'Enfants joyeux', en:'Happy Kids' },
    pal:{ c1:'#FF6B6B', c2:'#4ECDC4', c3:'#FFD93D', c4:'#6C5CE7', bg:'#FFFBEF' }, f:{ ar:['Lalezar', 'Cairo', 'Cairo'], lat:['Fredoka', 'Fredoka', 'Fredoka'] } },
  { id:'corporate', cat:'work', o:'p', name:{ ar:'مؤسسات', fr:'Entreprise', en:'Corporate' },
    pal:{ c1:'#243B55', c2:'#E0A526', c3:'#FFFFFF' }, f:{ ar:['Cairo', 'Cairo', 'Tajawal'], lat:['Montserrat', 'Montserrat', 'Montserrat'] } },
  { id:'official', cat:'work', o:'p', name:{ ar:'إداري رسمي', fr:'Administratif officiel', en:'Official' },
    pal:{ c1:'#1F3A5F', c2:'#1F3A5F', c3:'#FFFFFF' }, f:{ ar:['Amiri', 'Amiri', 'Amiri'], lat:['Cormorant Garamond', 'Cormorant Garamond', 'Cormorant Garamond'] } }
];
const TPL = Object.fromEntries(TEMPLATES.map(t => [t.id, t]));
const COLORS = ['#1B2A4A', '#7A1F2B', '#0E5E6F', '#1F4D3A', '#5B2A86', '#1565C0', '#B03A2E', '#1E1E24'];

function sampleFor(tplId, lang) {
  const cat = TPL[tplId].cat;
  return { ...COMMON[lang], ...SAMPLE[cat][lang], date: today(lang), no:'2026/001' };
}

/* ---------------------------------------------------------
   State
--------------------------------------------------------- */
let uiLang = localStorage.getItem(UI_KEY) || localStorage.getItem('site_lang') || 'ar';
if (!UI[uiLang]) uiLang = 'ar';
const T = (k, vars) => {
  let s = (UI[uiLang] && UI[uiLang][k]) || UI.ar[k] || k;
  if (vars) Object.keys(vars).forEach(v => { s = s.replace('{' + v + '}', vars[v]); });
  return s;
};
const SHOW0 = { logo:true, sig:true, stamp:true, qr:true, no:true };
function freshState() {
  return { tpl:'royal', color:null, font:'auto', clang: uiLang, dirty:false, c: sampleFor('royal', uiLang), img:{}, show:{ ...SHOW0 }, batch:{ on:false, text:'' } };
}
function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY));
    if (s && TPL[s.tpl] && s.c) return normalize(s);
  } catch (e) {}
  return null;
}
function normalize(s) {
  const f = Object.assign(freshState(), s);
  if (!UI[f.clang]) f.clang = 'ar';
  f.c = { ...sampleFor(f.tpl, f.clang), ...s.c };
  f.show = { ...SHOW0, ...(s.show || {}) };
  f.batch = { on:false, text:'', ...(s.batch || {}) };
  f.img = s.img || {};
  return f;
}
let st = loadState() || freshState();
let openSec = null;
let zoom = 'fit';
let pv = 0;

/* ---------------------------------------------------------
   Helpers
--------------------------------------------------------- */
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
const paras = t => String(t || '').split(/\n+/).map(x => x.trim()).filter(Boolean).map(x => `<p>${esc(x)}</p>`).join('');
/* SVG images need explicit width/height, otherwise html2canvas draws them empty in the PDF */
const svgUrl = svg => {
  if (!/<svg[^>]*\swidth=/.test(svg)) {
    const m = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg);
    if (m) svg = svg.replace('<svg ', `<svg width="${+m[1] * 4}" height="${+m[2] * 4}" `);
  }
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
};
function defLogo(p) {
  const acc = p.c2 && p.c2.toLowerCase() !== p.c1.toLowerCase() ? p.c2 : '#FFFFFF';
  return svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="${p.c1}"/><circle cx="50" cy="50" r="40" fill="none" stroke="${acc}" stroke-width="2" stroke-dasharray="2 3"/><polygon points="${star8(50, 50, 27)}" fill="${acc}"/><circle cx="50" cy="50" r="10" fill="${p.c1}"/><circle cx="50" cy="50" r="4" fill="${acc}"/></svg>`);
}
const DEF_SIG = svgUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 90"><path d="M14 58C22 30 30 18 36 22C44 28 30 60 26 70C24 76 30 74 36 62C44 44 52 36 58 40C64 46 54 62 60 64C66 66 72 46 80 44C88 42 84 60 92 60C100 60 104 40 112 42C120 44 112 62 122 62C132 62 140 36 150 30C158 26 160 40 154 52C150 60 162 60 174 50C186 40 196 36 206 38" fill="none" stroke="#1D2C6B" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 78C80 71 140 67 212 60" fill="none" stroke="#1D2C6B" stroke-width="1.8" stroke-linecap="round"/></svg>');
function defStamp(org) {
  const o = String(org || '').trim();
  const short = o.length > 46 ? o.slice(0, 44) + '…' : o;
  return `<div class="c-stamp def"><div class="st-ring"><b>★</b><span>${esc(short)}</span><b>★</b></div></div>`;
}
const ORN = p => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 18"><path d="M4 9H100M140 9H236" fill="none" stroke="${p.c2}" stroke-width="1.6"/><path d="M120 1L128 9L120 17L112 9Z" fill="${p.c2}"/><circle cx="104" cy="9" r="2.2" fill="${p.c2}"/><circle cx="136" cy="9" r="2.2" fill="${p.c2}"/></svg>`;

function incNo(base, i) {
  base = String(base || '');
  if (!i) return base;
  const m = /(\d+)(?!.*\d)/.exec(base);
  if (!m) return base + '-' + (i + 1);
  const n = String(parseInt(m[1], 10) + i).padStart(m[1].length, '0');
  return base.slice(0, m.index) + n + base.slice(m.index + m[1].length);
}
function parseNames(text) {
  return String(text || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean).map(l => {
    const i = l.indexOf('|');
    return i < 0 ? { name: l } : { name: l.slice(0, i).trim(), detail: l.slice(i + 1).trim() };
  }).filter(r => r.name);
}
function recipients() {
  if (st.batch.on) {
    const list = parseNames(st.batch.text);
    if (list.length) return list.map((r, i) => ({ name: r.name, detail: r.detail ? r.detail : st.c.detail, no: incNo(st.c.no, i) }));
  }
  return [{ name: st.c.name, detail: st.c.detail, no: st.c.no }];
}
function placeDate(c, lang) {
  const L = CL[lang];
  return [c.place, c.date].map(x => (x || '').trim()).filter(Boolean).join(L.sep);
}

/* QR */
const qrCache = new Map();
function qrUrl(text, color) {
  if (typeof qrcode === 'undefined' || !text) return '';
  const key = color + '|' + text;
  if (qrCache.has(key)) return qrCache.get(key);
  let url = '';
  try {
    if (qrcode.stringToBytesFuncs && qrcode.stringToBytesFuncs['UTF-8']) qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
    const qr = qrcode(0, 'M');
    qr.addData(text, 'Byte');
    qr.make();
    const n = qr.getModuleCount(), cell = 8, pad = 2;
    const cv = document.createElement('canvas');
    cv.width = cv.height = (n + pad * 2) * cell;
    const g = cv.getContext('2d');
    g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, cv.width, cv.height);
    g.fillStyle = color;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) g.fillRect((c + pad) * cell, (r + pad) * cell, cell, cell);
    url = cv.toDataURL('image/png');
  } catch (e) { console.error(e); url = ''; }
  if (qrCache.size > 400) qrCache.clear();
  qrCache.set(key, url);
  return url;
}
function withQr(ctx, r) {
  if (!ctx.show.qr) return r;
  const L = CL[ctx.lang], c = ctx.c;
  const text = [c.title, r.name, r.detail, r.no ? L.no + ' ' + r.no : '', c.org, placeDate(c, ctx.lang)].map(x => (x || '').trim()).filter(Boolean).join('\n');
  return { ...r, qr: qrUrl(text, shade(ctx.p.c1, -.35)) };
}

/* ---------------------------------------------------------
   Rendering
--------------------------------------------------------- */
function fontsFor(t, lang, font) {
  const lat = lang !== 'ar';
  const f = t.f[lat ? 'lat' : 'ar'].slice();
  if (font && font !== 'auto' && (lat ? F_LAT : F_AR).includes(font)) { f[0] = font; f[1] = font; }
  return f;
}
function ctxFor(tplId, c, img, opts) {
  const t = TPL[tplId];
  const p = { ...t.pal };
  if (!p.bg) p.bg = p.c3;
  if (opts.color) p.c1 = opts.color;
  const [W, H] = SIZE[t.o];
  const lang = opts.clang || 'ar';
  return { t, p, W, H, lang, rtl: lang === 'ar', f: fontsFor(t, lang, opts.font), c, img: img || {}, show: opts.show || SHOW0 };
}
function currentCtx() { return ctxFor(st.tpl, st.c, st.img, { color: st.color, font: st.font, clang: st.clang, show: st.show }); }

function certHTML(ctx, r) {
  const { t, p, W, H, c, img, show, f } = ctx;
  const q = s => `'${s}'`;
  const fb = ctx.lang === 'ar' ? `${q(f[2])}, 'Tajawal', serif` : `${q(f[2])}, 'Inter', serif`;
  const style = `width:${W}px;height:${H}px;--c1:${p.c1};--c2:${p.c2};--c3:${p.c3};--c4:${p.c4 || p.c2};--bg:${p.bg};` +
    `--ft:${q(f[0])}, serif;--fn:${q(f[1])}, serif;--fb:${fb};`;
  const logo = show.logo ? `<img class="c-logo" src="${img.logo || defLogo(p)}" alt="">` : '';
  const org = (c.org || c.orgSub) ? `<div class="c-org">${c.org ? `<b>${esc(c.org)}</b>` : ''}${c.orgSub ? `<small>${esc(c.orgSub)}</small>` : ''}</div>` : '';
  const stamp = show.stamp ? (img.stamp ? `<img class="c-stamp" src="${img.stamp}" alt="">` : defStamp(c.org)) : '';
  const sig = show.sig ? `<img class="c-sig" src="${img.sig || DEF_SIG}" alt="">` : '';
  const qr = show.qr && r.qr ? `<img class="c-qr" src="${r.qr}" alt="">` : '';
  const no = show.no && r.no ? `<span class="c-no">${esc(CL[ctx.lang].no)} ${esc(r.no)}</span>` : '';
  const pd = placeDate(c, ctx.lang);
  return `<div class="cert T-${t.id} ${t.o}" dir="${ctx.rtl ? 'rtl' : 'ltr'}" lang="${ctx.lang}" style="${style}">
    <div class="deco"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${DECO[t.id](W, H, p)}</svg></div>
    <div class="ct">
      ${logo || org ? `<div class="c-head" data-sec="org">${logo}${org}</div>` : ''}
      <h1 class="c-title${t.caps ? ' caps' : ''}" data-sec="text">${esc(c.title)}</h1>
      <div class="c-orn">${ORN(p)}</div>
      ${c.intro ? `<p class="c-intro" data-sec="text">${esc(c.intro)}</p>` : ''}
      <div class="c-name" data-sec="${st.batch.on ? 'rec' : 'text'}"><span>${esc(r.name)}</span></div>
      <div class="c-line"></div>
      ${r.detail ? `<p class="c-detail" data-sec="text">${esc(r.detail)}</p>` : ''}
      <div class="c-body" data-sec="text">${paras(c.body)}</div>
      <div class="c-foot" data-sec="sign">
        <div class="c-date">${pd ? `<small>${esc(CL[ctx.lang].issued)}</small><b>${esc(pd)}</b>` : ''}</div>
        <div class="c-mid">${qr}${no}</div>
        <div class="c-sign"><div class="c-sig-area">${stamp}${sig}</div>
          ${c.signer || c.signerTitle ? `<b class="c-signer">${esc(c.signer)}</b>${c.signerTitle ? `<small>${esc(c.signerTitle)}</small>` : ''}` : ''}</div>
      </div>
    </div>
  </div>`;
}

/* shrink the name to one line and the text block to fit the page */
function fitCert(el) {
  if (!el) return;
  el.style.setProperty('--k', '1');
  const nm = el.querySelector('.c-name'), sp = nm && nm.querySelector('span');
  if (sp) {
    sp.style.fontSize = '';
    let fs = parseFloat(getComputedStyle(sp).fontSize) || 50;
    while (sp.offsetWidth > nm.clientWidth && fs > 18) { fs -= 2; sp.style.fontSize = fs + 'px'; }
  }
  const ct = el.querySelector('.ct');
  let k = 1;
  while (ct.scrollHeight > ct.clientHeight + 1 && k > 0.56) { k -= 0.04; el.style.setProperty('--k', k.toFixed(2)); }
}

/* ---------------------------------------------------------
   Stage
--------------------------------------------------------- */
const holder = $('#holder');
function renderStage() {
  const ctx = currentCtx();
  const list = recipients();
  if (pv >= list.length) pv = list.length - 1;
  if (pv < 0) pv = 0;
  holder.innerHTML = certHTML(ctx, withQr(ctx, list[pv]));
  fitCert(holder.firstElementChild);
  applyZoom();
  const nav = $('#recNav');
  nav.classList.toggle('hidden', list.length < 2);
  $('#recVal').textContent = (pv + 1) + ' / ' + list.length;
}
function sheetSize() { return SIZE[TPL[st.tpl].o]; }
function stageFitScale() {
  const stage = $('#stage'), [W, H] = sheetSize();
  const w = stage.clientWidth - 60, h = stage.clientHeight - 130;
  return Math.max(0.15, Math.min(w / W, h / H, 1.4));
}
function applyZoom() {
  const s = zoom === 'fit' ? stageFitScale() : zoom;
  const [W, H] = sheetSize();
  holder.style.width = (W * s) + 'px'; holder.style.height = (H * s) + 'px';
  const el = holder.firstElementChild; if (el) el.style.transform = `scale(${s})`;
  $('#zoomVal').textContent = Math.round(s * 100) + '%';
}
function setZoom(dir) {
  let s = zoom === 'fit' ? stageFitScale() : zoom;
  s = Math.round((s + dir * 0.1) * 10) / 10;
  zoom = Math.max(0.2, Math.min(2, s));
  applyZoom();
}
let rTimer = null, thumbTimer = null;
function scheduleRender() {
  clearTimeout(rTimer);
  rTimer = setTimeout(() => { renderStage(); updateStates(); autosave(); }, 90);
  clearTimeout(thumbTimer);
  thumbTimer = setTimeout(renderCurrentThumb, 500);
}
function renderAll() { renderStage(); renderCurrentThumb(); updateStates(); autosave(); }

/* click on a part of the certificate opens its section */
holder.addEventListener('click', e => {
  const el = e.target.closest('[data-sec]'); if (!el) return;
  const k = el.dataset.sec;
  if ($('#workspace').classList.contains('collapsed')) $('#workspace').classList.remove('collapsed');
  toggleSec(k, true);
  setTimeout(() => { const a = $(`.acc[data-sec="${k}"]`); a && a.scrollIntoView({ behavior:'smooth', block:'nearest' }); }, 280);
});

/* ---------------------------------------------------------
   Accordion (sidebar)
--------------------------------------------------------- */
const SEC_ICONS = {
  style:'<svg viewBox="0 0 24 24"><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4A5.6 5.6 0 0 0 22 10c0-4.4-4.5-8-10-8z"/></svg>'
};
const SEC_COLORS = { style:'#64748B', org:'#16A34A', text:'#7C3AED', rec:'#D97706', sign:'#DB2777' };
const SECS = [
  { id:'style' },
  { id:'org', fields:[['org', 'text', 'f_org'], ['orgSub', 'text', 'f_orgSub'], ['logo', 'img', 'f_logo'], ['logo', 'show', 'sh_logo']] },
  { id:'text', fields:[['title', 'text', 'f_title'], ['intro', 'text', 'f_intro'], ['name', 'text', 'f_name'], ['detail', 'text', 'f_detail'], ['body', 'area', 'f_body']] },
  { id:'rec', custom:true },
  { id:'sign', fields:[['place', 'text', 'f_place'], ['date', 'text', 'f_date'], ['signer', 'text', 'f_signer'], ['signerTitle', 'text', 'f_signerTitle'],
    ['sig', 'img', 'f_sig'], ['sig', 'show', 'sh_sig'], ['stamp', 'img', 'f_stamp'], ['stamp', 'show', 'sh_stamp'],
    ['no', 'text', 'f_no', 'f_no_h'], ['no', 'show', 'sh_no'], ['qr', 'show', 'sh_qr']] }
];
const CHEV = '<svg class="acc-chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>';
const PLUS_IMG = '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/></svg>';
const XL_ICON = '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 8l8 8M16 8l-8 8"/></svg>';
const XICON = '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>';
const NEXT = '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>';
const LANG_NAMES = { ar:'العربية', fr:'Français', en:'English' };

function styleSectionHTML() {
  const t = TPL[st.tpl];
  const sw = COLORS.map(c => `<button type="button" class="sw ${st.color === c ? 'on' : ''}" data-color="${c}" style="background:${c}" aria-label="${c}"></button>`).join('');
  const custom = st.color && !COLORS.includes(st.color) ? st.color : '#888888';
  const list = st.clang === 'ar' ? F_AR : F_LAT;
  const tf = fontsFor(t, st.clang, 'auto')[0];
  return `
    <div class="field"><label>${T('clang')}</label>
      <div class="seg-ui" id="clangSeg">${['ar', 'fr', 'en'].map(l => `<button type="button" data-l="${l}" class="${st.clang === l ? 'on' : ''}">${LANG_NAMES[l]}</button>`).join('')}</div></div>
    <div class="field"><label>${T('color')}</label>
      <div class="swatches">
        <button type="button" class="sw auto ${!st.color ? 'on' : ''}" data-color="" style="--c-a:${t.pal.c1};--c-b:${t.pal.c2}" aria-label="auto"></button>
        ${sw}
        <label class="sw custom ${st.color && !COLORS.includes(st.color) ? 'on' : ''}"><input type="color" id="colorCustom" value="${custom}"></label>
      </div></div>
    <div class="field"><label>${T('font')}</label>
      <select id="fontSel"><option value="auto">${T('font_auto')} (${tf})</option>${list.map(f => `<option value="${f}" ${st.font === f ? 'selected' : ''} style="font-family:'${f}'">${f}</option>`).join('')}</select></div>
    <button type="button" class="chip" id="resetTxt" style="align-self:flex-start">${T('reset_txt')}</button>`;
}
function fieldHTML([key, type, label, hint]) {
  if (type === 'img') {
    const src = st.img[key];
    let prev = '';
    if (src) prev = `<div class="img-prev"><img src="${src}" alt=""><button type="button" data-rmimg="${key}">${XICON}</button></div>`;
    else if (key === 'logo') prev = `<div class="img-prev def"><img src="${defLogo({ ...TPL[st.tpl].pal, ...(st.color ? { c1: st.color } : {}) })}" alt=""></div>`;
    else if (key === 'sig') prev = `<div class="img-prev def"><img src="${DEF_SIG}" alt=""></div>`;
    const note = src ? '' : `<div class="hint">${T(key === 'stamp' ? 'def_stamp' : 'def_note')}</div>`;
    return `<div class="field"><label>${T(label)}</label><div class="img-field">
      <label class="img-drop">${PLUS_IMG}<span>${T('add_img')}</span><input type="file" accept="image/*" hidden data-img="${key}"></label>${prev}</div>${note}</div>`;
  }
  if (type === 'show') {
    return `<label class="switch show-row"><span>${T(label)}</span><input type="checkbox" data-show="${key}" ${st.show[key] ? 'checked' : ''}><i></i></label>`;
  }
  const val = esc(st.c[key] || '');
  const dirAttr = key === 'no' ? ' dir="ltr"' : ` dir="${st.clang === 'ar' ? 'rtl' : 'ltr'}"`;
  const input = type === 'area'
    ? `<textarea data-key="${key}"${dirAttr}>${val}</textarea>`
    : `<input type="text" data-key="${key}" value="${val}"${dirAttr}>`;
  const extra = key === 'name' && st.batch.on ? `<div class="hint">${T('batch_name_h')}</div>` : '';
  return `<div class="field"><label>${T(label)}</label>${input}${hint ? `<div class="hint">${T(hint)}</div>` : ''}${extra}</div>`;
}
function recSectionHTML() {
  const seg = `<div class="seg-ui" id="modeSeg">
    <button type="button" data-mode="single" class="${!st.batch.on ? 'on' : ''}">${T('mode_single')}</button>
    <button type="button" data-mode="batch" class="${st.batch.on ? 'on' : ''}">${T('mode_batch')}</button></div>`;
  if (!st.batch.on) return seg + `<div class="field"><div class="hint">${T('single_h')}</div></div>`;
  const n = parseNames(st.batch.text).length;
  return seg + `
    <div class="field"><label>${T('f_names')}</label>
      <textarea id="namesTa" dir="${st.clang === 'ar' ? 'rtl' : 'ltr'}">${esc(st.batch.text)}</textarea>
      <div class="hint">${T('f_names_h')}</div></div>
    <div class="field"><label class="img-drop xl-drop">${XL_ICON}<span>${T('up_xl')}</span><input type="file" accept=".xlsx,.xls,.csv,.ods" hidden id="xlFile"></label>
      <div class="hint">${T('xl_h')}</div></div>
    <div class="rec-count" id="recCount">${T('count', { n })}</div>`;
}

function buildAccordion() {
  $('#accordion').innerHTML = SECS.map((sec, i) => {
    const content = sec.id === 'style' ? styleSectionHTML() : sec.custom ? recSectionHTML() : sec.fields.map(fieldHTML).join('');
    const last = i === SECS.length - 1;
    const badge = sec.id === 'style' ? `<span class="acc-ico">${SEC_ICONS.style}</span>` : `<span class="acc-num">${i}</span>`;
    return `<section class="acc ${openSec === sec.id ? 'open' : ''}" data-sec="${sec.id}" style="--sc:${SEC_COLORS[sec.id]}">
      <button type="button" class="acc-head">${badge}
        <span class="acc-title"><b>${T('sec_' + sec.id)}</b><small>${esc(secSummary(sec))}</small></span>${CHEV}</button>
      <div class="acc-body"><div class="acc-inner"><div class="acc-content">${content}
        <button type="button" class="acc-next" data-next="${i}">${last ? T('done') : T('next')}${last ? '' : NEXT}</button>
      </div></div></div></section>`;
  }).join('');
}
function toggleSec(id, force) {
  openSec = (force === undefined ? openSec !== id : force) ? id : null;
  $$('.acc').forEach(a => a.classList.toggle('open', a.dataset.sec === openSec));
}
function secSummary(sec) {
  const cut = x => { x = String(x || '').replace(/\s+/g, ' ').trim(); return x.length > 46 ? x.slice(0, 44) + '…' : x; };
  if (sec.id === 'style') { const t = TPL[st.tpl]; return [t.name[uiLang] || t.name.ar, LANG_NAMES[st.clang]].join(' · '); }
  if (sec.id === 'rec') return st.batch.on ? T('sec_rec_batch', { n: parseNames(st.batch.text).length }) : T('sec_rec_single');
  const parts = sec.fields.filter(f => f[1] === 'text' || f[1] === 'area').map(f => st.c[f[0]]).filter(v => (v || '').trim());
  return parts.length ? cut(parts.slice(0, 2).join(' · ')) : T('sec_' + sec.id + '_d');
}
function updateStates() {
  SECS.forEach(sec => { const el = $(`.acc[data-sec="${sec.id}"] .acc-title small`); if (el) el.textContent = secSummary(sec); });
  const rc = $('#recCount'); if (rc) rc.textContent = T('count', { n: parseNames(st.batch.text).length });
}
function refreshSection(id) {
  const box = $(`.acc[data-sec="${id}"] .acc-content`); if (!box) return;
  const btn = box.querySelector('.acc-next').outerHTML;
  const sec = SECS.find(s => s.id === id);
  box.innerHTML = (id === 'style' ? styleSectionHTML() : sec.custom ? recSectionHTML() : sec.fields.map(fieldHTML).join('')) + btn;
}
function rebuildKeepOpen() {
  const scroll = $('#panel').scrollTop;
  buildAccordion();
  $('#panel').scrollTop = scroll;
}

$('#accordion').addEventListener('click', e => {
  const head = e.target.closest('.acc-head');
  if (head) { toggleSec(head.closest('.acc').dataset.sec); return; }
  const nx = e.target.closest('[data-next]');
  if (nx) {
    const nextSec = SECS[+nx.dataset.next + 1];
    toggleSec(nextSec ? nextSec.id : null, !!nextSec);
    if (nextSec) setTimeout(() => $(`.acc[data-sec="${nextSec.id}"]`).scrollIntoView({ behavior:'smooth', block:'nearest' }), 280);
    return;
  }
  const sw = e.target.closest('.sw[data-color]');
  if (sw) { st.color = sw.dataset.color || null; refreshSection('style'); refreshSection('org'); renderAll(); return; }
  const cl = e.target.closest('#clangSeg button');
  if (cl) { setCertLang(cl.dataset.l); return; }
  const md = e.target.closest('#modeSeg [data-mode]');
  if (md) {
    st.batch.on = md.dataset.mode === 'batch'; pv = 0;
    refreshSection('rec'); refreshSection('text'); renderAll();
    return;
  }
  if (e.target.closest('#resetTxt')) {
    st.c = sampleFor(st.tpl, st.clang); st.dirty = false;
    rebuildKeepOpen(); renderAll(); toast(T('t_reset'));
    return;
  }
  const rm = e.target.closest('[data-rmimg]');
  if (rm) { e.preventDefault(); delete st.img[rm.dataset.rmimg]; rebuildKeepOpen(); renderAll(); }
});
$('#accordion').addEventListener('input', e => {
  const k = e.target.dataset.key;
  if (k) { st.c[k] = e.target.value; st.dirty = true; scheduleRender(); return; }
  if (e.target.id === 'namesTa') { st.batch.text = e.target.value; scheduleRender(); return; }
  if (e.target.id === 'colorCustom') { st.color = e.target.value; scheduleRender(); }
});
$('#accordion').addEventListener('change', e => {
  if (e.target.id === 'fontSel') { st.font = e.target.value; renderAll(); return; }
  if (e.target.id === 'colorCustom') { refreshSection('style'); refreshSection('org'); return; }
  const sh = e.target.dataset.show;
  if (sh) { st.show[sh] = e.target.checked; renderAll(); return; }
  if (e.target.id === 'xlFile' && e.target.files && e.target.files[0]) { importSheet(e.target.files[0]); e.target.value = ''; return; }
  const ik = e.target.dataset.img;
  if (ik && e.target.files && e.target.files[0]) {
    readImage(e.target.files[0]).then(url => { st.img[ik] = url; rebuildKeepOpen(); renderAll(); });
  }
});
function setCertLang(l) {
  if (!UI[l] || l === st.clang) return;
  st.clang = l;
  if (!(l === 'ar' ? F_AR : F_LAT).includes(st.font)) st.font = 'auto';
  if (!st.dirty) st.c = sampleFor(st.tpl, l);
  rebuildKeepOpen(); renderAll();
}

function readImage(file) {
  return new Promise(res => {
    const fr = new FileReader();
    fr.onload = () => {
      const im = new Image();
      im.onload = () => {
        const sc = Math.min(1, 600 / Math.max(im.width, im.height));
        const cv = document.createElement('canvas');
        cv.width = Math.round(im.width * sc); cv.height = Math.round(im.height * sc);
        cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
        res(cv.toDataURL('image/png'));
      };
      im.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}

/* Excel / CSV import (SheetJS loaded on first use) */
function loadScript(src) {
  return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
}
async function importSheet(file) {
  try {
    if (typeof XLSX === 'undefined') await loadScript(XLSX_URL);
    const wb = XLSX.read(await file.arrayBuffer(), { type:'array' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { header:1, blankrows:false, defval:'' });
    let data = rows.map(r => [String(r[0] == null ? '' : r[0]).trim(), String(r[1] == null ? '' : r[1]).trim()]).filter(r => r[0]);
    if (data.length && /^(ال)?(إ|ا)?سم|اللقب|^name|^nom|^full ?name|^prénom|^prenom/i.test(data[0][0])) data.shift();
    if (!data.length) { toast(T('t_xl_empty')); return; }
    st.batch.text = data.map(r => r[1] ? `${r[0]} | ${r[1]}` : r[0]).join('\n');
    st.batch.on = true; pv = 0;
    refreshSection('rec'); renderAll();
    toast(T('t_xl_ok', { n: data.length }));
  } catch (err) { console.error(err); toast(T('t_xl_err')); }
}

/* ---------------------------------------------------------
   Gallery
--------------------------------------------------------- */
let gCat = 'all', gOr = 'all';
const OR_ICONS = {
  l:'<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="1.5"/></svg>',
  p:'<svg viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="18" rx="1.5"/></svg>'
};
function miniFor(tplId, content, imgs, opts, rec) {
  const ctx = ctxFor(tplId, content, imgs, opts);
  const r = rec || { name: content.name, detail: content.detail, no: content.no };
  return { html: `<div class="mini">${certHTML(ctx, withQr(ctx, r))}</div>`, W: ctx.W, H: ctx.H };
}
function galleryMini(tplId) {
  const useUser = st.dirty;
  const content = useUser ? st.c : sampleFor(tplId, st.clang);
  return miniFor(tplId, content, useUser ? st.img : {}, { color: tplId === st.tpl ? st.color : null, font: tplId === st.tpl ? st.font : 'auto', clang: st.clang, show: st.show }, useUser ? recipients()[0] : null);
}
function placeMini(box, W, H) {
  const mini = box.querySelector('.mini'); if (!mini) return;
  mini.style.position = 'absolute'; mini.style.top = '0'; mini.style.transformOrigin = '0 0';
  fitCert(mini.firstElementChild);
  const s = Math.min(box.clientWidth / W, box.clientHeight / H);
  mini.style.left = ((box.clientWidth - W * s) / 2) + 'px';
  mini.style.top = ((box.clientHeight - H * s) / 2) + 'px';
  mini.style.transform = `scale(${s})`;
}
function buildGallery() {
  $('#gCats').innerHTML = ['all', ...CATS].map(c => `<button type="button" class="chip ${gCat === c ? 'on' : ''}" data-cat="${c}">${T('cat_' + c)}</button>`).join('');
  $('#gOrs').innerHTML = ['all', 'l', 'p'].map(o => `<button type="button" class="chip or-chip ${gOr === o ? 'on' : ''}" data-or="${o}">${OR_ICONS[o] || ''}${T('or_' + o)}</button>`).join('');
  renderGrid();
}
function renderGrid() {
  const q = ($('#gSearch').value || '').trim().toLowerCase();
  const list = TEMPLATES.filter(t => (gCat === 'all' || t.cat === gCat) && (gOr === 'all' || t.o === gOr) &&
    (!q || Object.values(t.name).concat(Object.keys(UI).map(l => UI[l]['cat_' + t.cat])).some(n => n.toLowerCase().includes(q))));
  const grid = $('#gGrid');
  if (!list.length) { grid.innerHTML = `<div class="g-empty">${T('no_results')}</div>`; return; }
  const minis = list.map(t => galleryMini(t.id));
  grid.innerHTML = list.map((t, i) => `<button type="button" class="g-card ${t.id === st.tpl ? 'on' : ''}" data-tpl="${t.id}">
      <div class="g-thumb">${minis[i].html}</div>
      <div class="g-meta"><b>${esc(t.name[uiLang] || t.name.ar)}</b><span>${T('cat_' + t.cat)}</span></div></button>`).join('');
  requestAnimationFrame(() => $$('.g-thumb', grid).forEach((th, i) => placeMini(th, minis[i].W, minis[i].H)));
}
function openGallery() { $('#gallery').classList.remove('hidden'); buildGallery(); $('#gSearch').focus(); }
function closeGallery() { $('#gallery').classList.add('hidden'); }
$('#btnGallery').addEventListener('click', openGallery);
$('#gClose').addEventListener('click', closeGallery);
$('#gallery').addEventListener('click', e => {
  if (e.target.id === 'gallery') { closeGallery(); return; }
  const c = e.target.closest('[data-cat]');
  if (c) { gCat = c.dataset.cat; $$('#gCats .chip').forEach(x => x.classList.toggle('on', x === c)); renderGrid(); return; }
  const o = e.target.closest('[data-or]');
  if (o) { gOr = o.dataset.or; $$('#gOrs .chip').forEach(x => x.classList.toggle('on', x === o)); renderGrid(); return; }
  const card = e.target.closest('[data-tpl]');
  if (card) {
    st.tpl = card.dataset.tpl; st.color = null; st.font = 'auto';
    if (!st.dirty) st.c = sampleFor(st.tpl, st.clang);
    zoom = 'fit';
    closeGallery(); rebuildKeepOpen(); renderAll(); toast(T('t_tpl'));
  }
});
$('#gSearch').addEventListener('input', renderGrid);

function renderCurrentThumb() {
  const box = $('#currentThumb');
  const m = miniFor(st.tpl, st.c, st.img, { color: st.color, font: st.font, clang: st.clang, show: st.show }, recipients()[0]);
  box.innerHTML = m.html;
  placeMini(box, m.W, m.H);
  $('#currentTplName').textContent = TPL[st.tpl].name[uiLang] || TPL[st.tpl].name.ar;
}

/* ---------------------------------------------------------
   Save (local autosave) / PDF
--------------------------------------------------------- */
let saveTimer = null;
function saveNow(showToast) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(st)); if (showToast) toast(T('t_saved')); return true; }
  catch (e) { if (showToast) toast(T('t_save_err')); return false; }
}
function autosave() { clearTimeout(saveTimer); saveTimer = setTimeout(() => saveNow(false), 800); }

const wait = ms => new Promise(r => setTimeout(r, ms));
function imagesReady(el) {
  return Promise.all($$('img', el).map(im => im.complete ? Promise.resolve() : new Promise(r => { im.onload = im.onerror = r; })));
}
let pdfBusy = false;
async function doPdf() {
  if (pdfBusy) return;
  if (typeof html2canvas === 'undefined' || !window.jspdf) { toast(T('t_pdf_err')); return; }
  if (st.batch.on && !parseNames(st.batch.text).length) { toast(T('t_no_names')); return; }
  pdfBusy = true;
  const root = $('#printRoot');
  try {
    if (document.fonts) await document.fonts.ready;
    const ctx = currentCtx();
    const land = ctx.t.o === 'l';
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: land ? 'landscape' : 'portrait', unit:'mm', format:'a4' });
    const list = recipients();
    toast(T('t_pdf'));
    for (let i = 0; i < list.length; i++) {
      if (list.length > 1) toast(T('t_pdf_prog', { i: i + 1, n: list.length }));
      root.innerHTML = certHTML(ctx, withQr(ctx, list[i]));
      const el = root.firstElementChild;
      fitCert(el);
      await imagesReady(el);
      await wait(40);
      const canvas = await html2canvas(el, { scale: 2, backgroundColor:'#ffffff', useCORS:true, logging:false,
        width: ctx.W, height: ctx.H, windowWidth: ctx.W, windowHeight: ctx.H, scrollX: 0, scrollY: 0 });
      if (i > 0) pdf.addPage('a4', land ? 'landscape' : 'portrait');
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, land ? 297 : 210, land ? 210 : 297);
    }
    const base = list.length > 1 ? (st.c.title || 'certificates') + ' (' + list.length + ')' : (st.c.title || 'certificate') + ' - ' + (list[0].name || '');
    const name = base.replace(/[\\/:*?"<>|]+/g, '').trim().slice(0, 80) || 'certificate';
    pdf.save(name + '.pdf');
    toast(T('t_pdf_ok'));
  } catch (err) {
    console.error(err);
    toast(T('t_pdf_err'));
  } finally {
    root.innerHTML = '';
    pdfBusy = false;
  }
}

/* ---------------------------------------------------------
   Account (Firebase): users/{uid}/certificates
--------------------------------------------------------- */
const hasFb = () => typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length && firebase.auth && firebase.firestore;
const fbUser = () => (hasFb() ? firebase.auth().currentUser : null);
const certCol = uidv => firebase.firestore().collection('users').doc(uidv).collection('certificates');
let pendingAfterLogin = null;

function openLogin(after) { pendingAfterLogin = after || null; $('#login').classList.remove('hidden'); }
function closeLogin() { $('#login').classList.add('hidden'); }
$('#loginCancel').addEventListener('click', () => { pendingAfterLogin = null; closeLogin(); });
$('#login').addEventListener('click', e => { if (e.target.id === 'login') { pendingAfterLogin = null; closeLogin(); } });
$('#loginGoogle').addEventListener('click', async () => {
  if (!hasFb()) { toast(T('t_cloud_err')); return; }
  try {
    await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
    closeLogin();
    const fn = pendingAfterLogin; pendingAfterLogin = null;
    if (fn) fn();
  } catch (e) { console.error(e); }
});

const docTitle = s => [s.c.title, s.batch && s.batch.on ? '(' + parseNames(s.batch.text).length + ')' : s.c.name].filter(Boolean).join(' — ');
function cloudPayload() {
  const copy = { ...st }; delete copy.docId;
  return { title: docTitle(st).slice(0, 200), tpl: st.tpl, clang: st.clang, state: JSON.stringify(copy),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
}
async function saveToAccount() {
  saveNow(false);
  const user = fbUser();
  if (!user) { openLogin(saveToAccount); return; }
  try {
    const data = cloudPayload();
    if (data.state.length > 950000) { toast(T('t_too_big')); return; }
    const col = certCol(user.uid);
    if (st.docId) await col.doc(st.docId).set(data, { merge:true });
    else { data.createdAt = firebase.firestore.FieldValue.serverTimestamp(); const ref = await col.add(data); st.docId = ref.id; }
    saveNow(false);
    toast(T('t_saved_cloud'));
  } catch (e) { console.error(e); toast(T('t_cloud_err')); }
}

const IC_OPEN = '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';
const IC_DUP = '<svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>';
const IC_DEL = '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>';
const IC_PLUS = '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';
let mineDocs = [];

function openMine() {
  if (!fbUser()) { openLogin(openMine); return; }
  $('#mine').classList.remove('hidden');
  loadMine();
}
function closeMine() { $('#mine').classList.add('hidden'); }
async function loadMine() {
  const grid = $('#mGrid');
  grid.innerHTML = `<div class="g-empty">${T('loading')}</div>`;
  try {
    const snap = await certCol(fbUser().uid).orderBy('updatedAt', 'desc').get();
    mineDocs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderMine();
  } catch (e) { console.error(e); grid.innerHTML = `<div class="g-empty">${T('t_cloud_err')}</div>`; }
}
function renderMine() {
  const grid = $('#mGrid');
  const fmt = ts => { try { return ts && ts.toDate ? ts.toDate().toLocaleDateString(LOCALE[uiLang]) : ''; } catch (e) { return ''; } };
  const sizes = [];
  const cards = mineDocs.map(d => {
    let parsed = null; try { parsed = JSON.parse(d.state); } catch (e) {}
    if (!parsed || !TPL[parsed.tpl]) return '';
    const s = normalize(parsed);
    const m = miniFor(s.tpl, s.c, s.img, { color: s.color, font: s.font, clang: s.clang, show: { ...s.show, qr:false } });
    sizes.push(m);
    return `<div class="g-card m-card" data-mid="${d.id}">
      ${d.id === st.docId ? `<span class="m-tag">${T('current')}</span>` : ''}
      <div class="g-thumb">${m.html}</div>
      <div class="g-meta"><b>${esc(d.title || T('untitled'))}</b><span>${esc(TPL[s.tpl].name[uiLang] || TPL[s.tpl].name.ar)}</span></div>
      <div class="m-date">${fmt(d.updatedAt)}</div>
      <div class="m-actions">
        <button type="button" class="primary" data-act="open">${IC_OPEN}${T('open_b')}</button>
        <button type="button" data-act="dup">${IC_DUP}${T('dup_b')}</button>
        <button type="button" class="danger icon" data-act="del" title="${T('del_b')}" aria-label="${T('del_b')}">${IC_DEL}</button>
      </div></div>`;
  }).filter(Boolean).join('');
  grid.innerHTML = `<button type="button" class="g-card m-new" data-act="new">${IC_PLUS}<span>${T('new_b')}</span></button>` +
    (cards || `<div class="g-empty">${T('mine_empty')}</div>`);
  requestAnimationFrame(() => $$('.m-card .g-thumb', grid).forEach((th, i) => sizes[i] && placeMini(th, sizes[i].W, sizes[i].H)));
}
$('#btnMine').addEventListener('click', openMine);
$('#mClose').addEventListener('click', closeMine);
$('#mine').addEventListener('click', async e => {
  if (e.target.id === 'mine') { closeMine(); return; }
  const btn = e.target.closest('[data-act]'); if (!btn) return;
  const act = btn.dataset.act;
  if (act === 'new') {
    st = freshState(); pv = 0; openSec = null; zoom = 'fit';
    closeMine(); rebuildKeepOpen(); renderAll(); toast(T('t_new'));
    return;
  }
  const card = btn.closest('[data-mid]'); if (!card) return;
  const id = card.dataset.mid;
  const doc = mineDocs.find(d => d.id === id); if (!doc) return;
  const col = certCol(fbUser().uid);
  try {
    if (act === 'open') {
      st = normalize(JSON.parse(doc.state)); st.docId = id; pv = 0; openSec = null; zoom = 'fit';
      closeMine(); rebuildKeepOpen(); renderAll(); toast(T('t_opened'));
    } else if (act === 'dup') {
      const parsed = JSON.parse(doc.state);
      const title = (doc.title || T('untitled')) + T('copy_suffix');
      await col.add({ title: title.slice(0, 200), tpl: parsed.tpl, clang: parsed.clang, state: JSON.stringify(parsed),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(), updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
      toast(T('t_dup')); loadMine();
    } else if (act === 'del') {
      if (!confirm(T('confirm_del'))) return;
      await col.doc(id).delete();
      if (st.docId === id) { delete st.docId; saveNow(false); }
      toast(T('t_deleted')); loadMine();
    }
  } catch (err) { console.error(err); toast(T('t_cloud_err')); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeGallery(); closeMine(); closeLogin(); } });

/* ---------------------------------------------------------
   Toast
--------------------------------------------------------- */
let toastTimer = null;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

/* ---------------------------------------------------------
   UI language (topbar order never moves: it is direction:ltr)
--------------------------------------------------------- */
function applyUiLang() {
  document.documentElement.lang = uiLang;
  document.documentElement.dir = uiLang === 'ar' ? 'rtl' : 'ltr';
  $$('[data-i18n]').forEach(el => el.textContent = T(el.dataset.i18n));
  $$('[data-i18n-ph]').forEach(el => el.placeholder = T(el.dataset.i18nPh));
  $$('[data-tip]').forEach(el => el.setAttribute('data-tiptext', T(el.dataset.tip)));
  $('#langToggle').textContent = uiLang.toUpperCase();
  $$('#langMenu button').forEach(b => b.classList.toggle('on', b.dataset.lang === uiLang));
  document.title = T('tool_name') + ' — Merabti Academy';
  buildAccordion();
  if (!$('#gallery').classList.contains('hidden')) buildGallery();
}
$('#langToggle').addEventListener('click', e => { e.stopPropagation(); $('#langMenu').classList.toggle('hidden'); });
$('#langMenu').addEventListener('click', e => {
  const b = e.target.closest('[data-lang]'); if (!b) return;
  uiLang = b.dataset.lang;
  localStorage.setItem(UI_KEY, uiLang);
  $('#langMenu').classList.add('hidden');
  /* untouched samples follow the interface language; edited certificates keep their own language */
  if (!st.dirty && st.clang !== uiLang) {
    st.clang = uiLang; st.c = sampleFor(st.tpl, uiLang);
    if (!(uiLang === 'ar' ? F_AR : F_LAT).includes(st.font)) st.font = 'auto';
  }
  applyUiLang();
  renderAll();
});
document.addEventListener('click', e => { if (!e.target.closest('.lang-wrap')) $('#langMenu').classList.add('hidden'); });

/* ---------------------------------------------------------
   Toolbar wiring
--------------------------------------------------------- */
$('#btnSave').addEventListener('click', saveToAccount);
$('#btnPdf').addEventListener('click', doPdf);
$('#btnFullscreen').addEventListener('click', () => {
  if (!document.fullscreenElement) (document.documentElement.requestFullscreen || function () {}).call(document.documentElement);
  else document.exitFullscreen && document.exitFullscreen();
});
$('#panelToggle').addEventListener('click', () => {
  $('#workspace').classList.toggle('collapsed');
  setTimeout(applyZoom, 320);
});
$('#zoomIn').addEventListener('click', () => setZoom(1));
$('#zoomOut').addEventListener('click', () => setZoom(-1));
$('#zoomFit').addEventListener('click', () => { zoom = 'fit'; applyZoom(); });
$('#recPrev').addEventListener('click', () => { pv = Math.max(0, pv - 1); renderStage(); });
$('#recNext').addEventListener('click', () => { pv = Math.min(recipients().length - 1, pv + 1); renderStage(); });
window.addEventListener('resize', () => { if (zoom === 'fit') applyZoom(); });

/* ---------------------------------------------------------
   Init — every section starts collapsed
--------------------------------------------------------- */
applyUiLang();
renderStage(); renderCurrentThumb(); updateStates();
if (document.fonts) document.fonts.ready.then(() => { renderStage(); renderCurrentThumb(); });

})();
