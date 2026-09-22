/* ==========================================================
   دليل الموردين وقطع الغيار — منطق الأداة  (v2)
   3 لغات: عربي / Français / English
   - البيانات تُخزَّن محليًا على جهاز المستخدم (localStorage)
   - قراءة Excel/CSV عبر SheetJS، وتصدير المقارنة المنسّق عبر ExcelJS
   ========================================================== */

/* ---------------- الحقول ومرادفات الأعمدة ---------------- */
const FIELDS = [
  { k:'part', req:true, ar:'اسم القطعة', fr:'Désignation', en:'Part name',
    syn:['part','partname','item','itemname','product','productname','article','designation','description','قطعة','القطعة','اسم القطعة','المنتج','المادة','البيان','الاسم','piece','produit','désignation','libellé','libelle'] },
  { k:'ref', ar:'المرجع', fr:'Référence', en:'Reference / P/N',
    syn:['ref','reference','référence','partno','partnumber','pn','p/n','sku','code','المرجع','رقم القطعة','الرمز','الكود','n° pièce'] },
  { k:'category', ar:'الصنف', fr:'Catégorie', en:'Category',
    syn:['category','famille','catégorie','categorie','type','group','الفئة','الصنف','النوع','التصنيف','العائلة'] },
  { k:'brand', ar:'العلامة التجارية', fr:'Marque', en:'Brand',
    syn:['brand','marque','manufacturer','make','العلامة','الماركة','العلامة التجارية','الشركة المصنعة','المصنع'] },
  { k:'supplier', req:true, ar:'المورد', fr:'Fournisseur', en:'Supplier',
    syn:['supplier','vendor','fournisseur','company','société','societe','المورد','اسم المورد','الشركة','المزود','مزود الخدمة','المؤسسة'] },
  { k:'contact', ar:'المسؤول', fr:'Contact', en:'Contact person',
    syn:['contact','contactperson','responsable','person','المسؤول','جهة الاتصال','الشخص','المسؤول التجاري','اسم المسؤول'] },
  { k:'phone', ar:'الهاتف', fr:'Téléphone', en:'Phone',
    syn:['phone','tel','telephone','téléphone','mobile','gsm','هاتف','الهاتف','رقم الهاتف','جوال','النقال','الجوال','tél'] },
  { k:'email', ar:'البريد الإلكتروني', fr:'Email', en:'Email',
    syn:['email','e-mail','mail','courriel','البريد','الايميل','الإيميل','البريد الإلكتروني','البريد الالكتروني'] },
  { k:'city', ar:'الولاية / المدينة', fr:'Ville / Wilaya', en:'City / Wilaya',
    syn:['city','wilaya','ville','address','adresse','location','المدينة','الولاية','العنوان','الموقع','المنطقة'] },
  { k:'country', ar:'بلد التوريد', fr:'Pays d’origine', en:'Supply country',
    syn:['country','pays','pays d’origine','pays d origine','origin','country of origin','بلد','البلد','بلد التوريد','بلد المنشأ','الدولة','المنشأ'] },
  { k:'price', ar:'السعر', fr:'Prix unitaire', en:'Unit price',
    syn:['price','prix','unitprice','prixunitaire','prix unitaire','cost','السعر','سعر الوحدة','الثمن','السعر الوحدوي','التكلفة'] },
  { k:'currency', ar:'العملة', fr:'Devise', en:'Currency',
    syn:['currency','devise','monnaie','العملة'] },
  { k:'delivery', ar:'مدة التوصيل (أيام)', fr:'Délai de livraison (jours)', en:'Lead time (days)',
    syn:['delivery','leadtime','lead time','délai','delai','délai de livraison','مدة التوصيل','مدة التسليم','التسليم','الأجل','الاجل','التوصيل'] },
  { k:'moq', ar:'الحد الأدنى للطلب', fr:'Quantité minimale', en:'Min. order',
    syn:['moq','minqty','minimum order','min order','quantité minimale','الحد الأدنى','أقل كمية','الحد الادنى للطلب','الكمية الدنيا'] },
  { k:'payment', ar:'شروط الدفع', fr:'Conditions de paiement', en:'Payment terms',
    syn:['payment','paymentterms','payment terms','conditions de paiement','paiement','modalités de paiement','شروط الدفع','الدفع','طريقة الدفع'] },
  { k:'warranty', ar:'الضمان', fr:'Garantie', en:'Warranty',
    syn:['warranty','garantie','الضمان','مدة الضمان'] },
  { k:'notes', ar:'ملاحظات', fr:'Remarques', en:'Notes',
    syn:['notes','note','remarque','remarques','comment','comments','ملاحظات','ملاحظة','تعليق'] }
];
const FIELD_ORDER = ['ref','brand','supplier','contact','phone','email','country','city','price','currency','delivery','moq','payment','warranty','notes','category','part'];
const LANGS = ['ar','fr','en'];

/* ---------------- النصوص (3 لغات) ---------------- */
const TX = {
ar:{
  title:'دليل الموردين وقطع الغيار',
  sub:'اكتب اسم القطعة، قارن أسعار الموردين، وتواصل معهم مباشرة — أو ارفع ملف Excel الخاص بموردينك.',
  ph:'اكتب اسم القطعة أو مرجعها أو الماركة أو المورد…',
  upload:'رفع ملف Excel', template:'تحميل القالب', export:'تصدير Excel', print:'طباعة', clear:'مسح البيانات',
  sRecords:'عرض سعر', sParts:'قطعة', sSuppliers:'مورد',
  sample:'أنت تشاهد بيانات تجريبية (أسماء وأرقام وهمية) — ارفع ملف موردينك ليحلّ محلّها.',
  filters:'الفلاتر', fReset:'إعادة ضبط', fParts:'القطع', fPartQ:'ابحث في القطع…', fCat:'الصنف', fBrand:'العلامة التجارية',
  fCity:'الولاية / المدينة', fSupplier:'المورد', fCur:'العملة', fPrice:'السعر', fMin:'من', fMax:'إلى',
  fDel:'أقصى مدة توصيل (أيام)', fEmail:'يتوفر بريد إلكتروني', fPhone:'يتوفر هاتف', fCC:'مفتاح الدولة (لروابط واتساب)', all:'الكل',
  fRating:'تقييم المورد', fRating5:'5 نجوم فقط', fRating4:'4 نجوم فأكثر', fRating3:'3 نجوم فأكثر',
  selAll:'تحديد الكل', group:'تجميع حسب القطعة', results:'نتيجة',
  sPriceAsc:'الأرخص أولًا', sPriceDesc:'الأغلى أولًا', sDelivery:'الأسرع توصيلًا', sRating:'الأعلى تقييمًا', sSupplier:'المورد (أبجدي)', sPart:'القطعة (أبجدي)',
  best:'الأرخص', days:'يوم', instant:'فوري', moq:'أدنى طلب', pay:'الدفع', war:'الضمان', noPrice:'السعر عند الطلب',
  call:'اتصال', wa:'واتساب', copy:'نسخ', mail:'مراسلة', copied:'تم النسخ', nothing:'لا يوجد ما يُنسخ',
  rateTip:'اضغط لتقييم المورد (اضغط على نفس النجمة لإلغاء التقييم)', unrated:'بدون تقييم',
  offers:'عروض', min:'الأدنى', max:'الأعلى', avg:'المتوسط',
  selected:'محدد', rfq:'طلب عرض سعر', compare:'مقارنة العروض', copyEmails:'نسخ البريد', copyPhones:'نسخ الأرقام', exportSel:'تصدير المحدد', clearSel:'إلغاء',
  emptyTitle:'ابدأ برفع ملف الموردين',
  emptySub:'اسحب ملف Excel أو CSV إلى هنا أو اختره من جهازك. بياناتك لا تُرسل إلى أي خادم — تبقى محفوظة على جهازك فقط.',
  emptyPick:'اختيار ملف', emptyDemo:'جرّب ببيانات تجريبية', emptyTpl:'تحميل قالب جاهز',
  emptyCols:'الأعمدة المدعومة: اسم القطعة، المرجع، الصنف، العلامة التجارية، المورد، المسؤول، الهاتف، البريد، الولاية، السعر، العملة، مدة التوصيل، الحد الأدنى للطلب، شروط الدفع، الضمان، ملاحظات — بالعربية أو الفرنسية أو الإنجليزية، ويتعرّف عليها البرنامج تلقائيًا. (القالب المرجعي بالفرنسية)',
  dropHere:'أفلت الملف هنا',
  noRes:'لا توجد نتائج مطابقة', noResSub:'جرّب كلمات أخرى أو خفّف الفلاتر.',
  fTxt:'بحث', fPart:'القطعة', fMinP:'السعر من', fMaxP:'السعر إلى', fDelT:'التوصيل ≤', fRatingT:'التقييم ≥',
  impTitle:'استيراد ملف الموردين', impSub:'تحقّق من ربط الأعمدة (تم التعرّف عليها تلقائيًا) ثم اضغط استيراد.',
  impSheet:'الورقة', impNone:'— بدون —', impReplace:'استبدال البيانات الحالية', impAppend:'إضافة إلى البيانات الحالية',
  impGo:'استيراد', impCancel:'إلغاء', impReady:'سيتم استيراد {n} سجل', impMissing:'حدّد عمودَي «اسم القطعة» و«المورد» على الأقل.',
  impPreview:'معاينة', impDone:'تم استيراد {n} سجل', impFail:'تعذّرت قراءة الملف', xlsxFail:'تعذّر تحميل مكتبة Excel — تأكد من الاتصال بالإنترنت.',
  impEmptyFile:'الملف فارغ أو لا يحتوي جدولًا واضحًا.',
  rfqTitle:'طلب عرض سعر', rfqSub:'سيُرسل الطلب إلى الموردين المحددين في نسخة مخفية (BCC) حتى لا يرى أحدهم الآخر.',
  rfqParts:'القطع والكميات', rfqQty:'الكمية', rfqName:'اسمك', rfqCompany:'المؤسسة / المصلحة', rfqPlace:'مكان التسليم',
  rfqMsg:'نص الرسالة', rfqOpen:'فتح برنامج البريد', rfqCopyMsg:'نسخ الرسالة', rfqCopyMails:'نسخ البريد',
  rfqNoMail:'{n} مورد بدون بريد إلكتروني لن يشملهم الإرسال.', rfqSuppliers:'الموردون المستلمون', rfqNoRecipients:'لا يوجد أي بريد إلكتروني بين المحدّدين.',
  rfqLong:'الرسالة طويلة على رابط البريد — تم نسخها، الصقها في بريدك.',
  subject:'طلب عرض سعر', greet:'السادة المحترمون،', hello:'تحية طيبة،',
  intro:'نرجو منكم موافاتنا بعرض سعر للقطع التالية:', qtyW:'الكمية', refW:'المرجع',
  ask:'نرجو ذكر: السعر الوحدوي، مدة التوصيل، شروط الدفع، وصلاحية العرض.', placeW:'مكان التسليم', thanks:'شكرًا لتعاونكم،',
  // المقارنة
  cmpTitle:'مقارنة العروض', cmpSub:'قارن بين العروض المحددة، اختر المورد الفائز، ثم صدّر المحضر.',
  cmpMin:'اختر عرضين على الأقل للمقارنة.', cmpMax:'الحد الأقصى للمقارنة 4 عروض.',
  cmpDiffParts:'ملاحظة: العروض المحددة بأسماء قطع مختلفة — تأكد أنها متكافئة.',
  cmpQty:'الكمية المطلوبة', cmpVat:'TVA %', cmpName:'أعدّه', cmpDept:'المؤسسة / المصلحة',
  cmpChoose:'اختيار', cmpWinner:'المورد المختار', cmpReason:'سبب الاختيار', cmpReasonPh:'مثال: أفضل سعر مع مدة توصيل مناسبة وضمان سنة…',
  cmpPdf:'محضر PDF', cmpXlsx:'Excel', cmpCopy:'نسخ كنص', cmpDone:'تم إنشاء الملف',
  cmpMixed:'العروض بعملات مختلفة — لا يمكن احتساب الفرق أو تحديد الأرخص.',
  cmpMoqWarn:'الكمية أقل من الحد الأدنى للطلب', cmpNoWinner:'لم يُحدَّد بعد',
  cheapest:'الأرخص', fastest:'الأسرع', topRated:'الأعلى تقييمًا',
  rowPart:'القطعة / المرجع', rowUnit:'السعر الوحدوي', rowTotal:'الإجمالي', rowHT:'الإجمالي HT', rowTTC:'الإجمالي TTC', rowDiff:'الفرق عن الأرخص',
  rowDelivery:'مدة التوصيل', rowMoq:'الحد الأدنى للطلب', rowPay:'شروط الدفع', rowWar:'الضمان', rowRating:'التقييم',
  rowPhone:'الهاتف', rowEmail:'البريد', rowNotes:'ملاحظات',
  repTitle:'محضر مقارنة العروض', repDate:'التاريخ', repQty:'الكمية', repBy:'أعدّه', repDept:'المصلحة', repSigA:'أعدّه', repSigB:'لجنة الشراء', repSigC:'المدير',
  repSign:'الاسم والتوقيع', repFoot:'أُعدّ عبر أداة دليل الموردين — merabti.com',
  popup:'اسمح بالنوافذ المنبثقة لعرض المحضر ثم أعد المحاولة.', cmpSheet:'المقارنة',
  confirmClear:'سيتم مسح كل البيانات المحفوظة على هذا الجهاز. هل تريد المتابعة؟', cleared:'تم مسح البيانات',
  storeFail:'تعذّر حفظ البيانات محليًا (الملف كبير جدًا) — ستبقى متاحة حتى تغلق الصفحة.',
  cloudOff:'السحابة غير متاحة', cloudOut:'سجّل الدخول من الصفحة الرئيسية لحفظ بياناتك في السحابة', cloudLoading:'جارٍ تحميل بياناتك…', cloudSaving:'جارٍ الحفظ…', cloudSaved:'بياناتك محفوظة في السحابة', cloudErr:'تعذّرت المزامنة مع السحابة', cloudRules:'تحقّق من نشر قواعد Firestore',
  cloudNeedLogin:'سجّل الدخول أولًا لاستعمال السجل.', cloudConflict:'توجد بيانات على هذا الجهاز وأخرى مختلفة في السحابة.\n\nموافق = استخدام بيانات السحابة\nإلغاء = رفع بيانات هذا الجهاز واستبدال السحابة',
  hist:'السجل', histTitle:'سجل المحاضر والطلبات', histCmp:'محاضر المقارنة', histRfq:'طلبات عروض الأسعار', histEmpty:'لا يوجد شيء محفوظ بعد.', histDelete:'حذف', histConfirm:'حذف هذا العنصر نهائيًا؟', histSup:'مورد', saveCmp:'حفظ في السجل', cmpSaved:'تم الحفظ في السجل',
  supTip:'اضغط لعرض كل معلومات المورد', supOffer:'تفاصيل العرض', supPart:'القطعة', supContact:'بيانات الاتصال', fMore:'خيارات إضافية',
  country:'بلد التوريد', rowLoc:'الولاية / بلد التوريد',
  tplName:'modele_fournisseurs', expName:'الموردون', cmpFile:'مقارنة_العروض', da:'دج'
},
fr:{
  title:'Annuaire des fournisseurs & pièces de rechange',
  sub:'Tapez le nom d’une pièce, comparez les prix des fournisseurs et contactez-les directement — ou importez votre fichier Excel de fournisseurs.',
  ph:'Nom de la pièce, référence, marque ou fournisseur…',
  upload:'Importer Excel', template:'Télécharger le modèle', export:'Exporter Excel', print:'Imprimer', clear:'Effacer les données',
  sRecords:'offres', sParts:'pièces', sSuppliers:'fournisseurs',
  sample:'Vous consultez des données de démonstration (noms et numéros fictifs) — importez votre fichier pour les remplacer.',
  filters:'Filtres', fReset:'Réinitialiser', fParts:'Pièces', fPartQ:'Rechercher une pièce…', fCat:'Catégorie', fBrand:'Marque',
  fCity:'Ville / Wilaya', fSupplier:'Fournisseur', fCur:'Devise', fPrice:'Prix', fMin:'Min', fMax:'Max',
  fDel:'Délai de livraison max (jours)', fEmail:'Email disponible', fPhone:'Téléphone disponible', fCC:'Indicatif pays (liens WhatsApp)', all:'Tous',
  fRating:'Note du fournisseur', fRating5:'5 étoiles uniquement', fRating4:'4 étoiles et plus', fRating3:'3 étoiles et plus',
  selAll:'Tout sélectionner', group:'Grouper par pièce', results:'résultats',
  sPriceAsc:'Moins cher d’abord', sPriceDesc:'Plus cher d’abord', sDelivery:'Livraison la plus rapide', sRating:'Mieux notés', sSupplier:'Fournisseur (A–Z)', sPart:'Pièce (A–Z)',
  best:'Moins cher', days:'jours', instant:'Immédiat', moq:'Qté min.', pay:'Paiement', war:'Garantie', noPrice:'Prix sur demande',
  call:'Appeler', wa:'WhatsApp', copy:'Copier', mail:'Écrire', copied:'Copié', nothing:'Rien à copier',
  rateTip:'Cliquez pour noter le fournisseur (recliquez sur la même étoile pour annuler)', unrated:'Non noté',
  offers:'offres', min:'Min', max:'Max', avg:'Moy.',
  selected:'sélectionné(s)', rfq:'Demande de prix', compare:'Comparer les offres', copyEmails:'Copier les emails', copyPhones:'Copier les numéros', exportSel:'Exporter la sélection', clearSel:'Annuler',
  emptyTitle:'Commencez par importer votre fichier fournisseurs',
  emptySub:'Glissez un fichier Excel ou CSV ici ou choisissez-le sur votre appareil. Vos données ne sont envoyées à aucun serveur — elles restent sur votre appareil.',
  emptyPick:'Choisir un fichier', emptyDemo:'Essayer avec des données de démo', emptyTpl:'Télécharger le modèle',
  emptyCols:'Colonnes prises en charge : désignation, référence, catégorie, marque, fournisseur, contact, téléphone, email, ville, prix, devise, délai de livraison, quantité minimale, conditions de paiement, garantie, remarques — en arabe, français ou anglais, détectées automatiquement. (Le modèle de référence est en français)',
  dropHere:'Déposez le fichier ici',
  noRes:'Aucun résultat', noResSub:'Essayez d’autres mots ou assouplissez les filtres.',
  fTxt:'Recherche', fPart:'Pièce', fMinP:'Prix min', fMaxP:'Prix max', fDelT:'Délai ≤', fRatingT:'Note ≥',
  impTitle:'Importer le fichier fournisseurs', impSub:'Vérifiez la correspondance des colonnes (détectées automatiquement) puis cliquez sur Importer.',
  impSheet:'Feuille', impNone:'— aucune —', impReplace:'Remplacer les données actuelles', impAppend:'Ajouter aux données actuelles',
  impGo:'Importer', impCancel:'Annuler', impReady:'{n} enregistrements seront importés', impMissing:'Associez au moins « Désignation » et « Fournisseur ».',
  impPreview:'Aperçu', impDone:'{n} enregistrements importés', impFail:'Impossible de lire le fichier', xlsxFail:'Impossible de charger la bibliothèque Excel — vérifiez votre connexion.',
  impEmptyFile:'Le fichier est vide ou ne contient pas de tableau exploitable.',
  rfqTitle:'Demande de prix', rfqSub:'La demande est envoyée aux fournisseurs sélectionnés en copie cachée (Cci) : aucun ne voit les autres.',
  rfqParts:'Pièces et quantités', rfqQty:'Qté', rfqName:'Votre nom', rfqCompany:'Société / service', rfqPlace:'Lieu de livraison',
  rfqMsg:'Message', rfqOpen:'Ouvrir la messagerie', rfqCopyMsg:'Copier le message', rfqCopyMails:'Copier les emails',
  rfqNoMail:'{n} fournisseur(s) sans email ne seront pas inclus.', rfqSuppliers:'Destinataires', rfqNoRecipients:'Aucun email parmi les fournisseurs sélectionnés.',
  rfqLong:'Le message est trop long pour un lien mail — il a été copié, collez-le dans votre email.',
  subject:'Demande de prix', greet:'Madame, Monsieur,', hello:'Bonjour,',
  intro:'Nous vous prions de bien vouloir nous adresser votre meilleure offre pour les articles suivants :', qtyW:'Quantité', refW:'Réf.',
  ask:'Merci de préciser : prix unitaire, délai de livraison, conditions de paiement et validité de l’offre.', placeW:'Lieu de livraison', thanks:'Cordialement,',
  cmpTitle:'Comparaison des offres', cmpSub:'Comparez les offres sélectionnées, choisissez le fournisseur retenu puis exportez le procès-verbal.',
  cmpMin:'Sélectionnez au moins deux offres à comparer.', cmpMax:'Maximum 4 offres à comparer.',
  cmpDiffParts:'Remarque : les offres sélectionnées portent des désignations différentes — vérifiez qu’elles sont équivalentes.',
  cmpQty:'Quantité demandée', cmpVat:'TVA %', cmpName:'Établi par', cmpDept:'Société / service',
  cmpChoose:'Choisir', cmpWinner:'Fournisseur retenu', cmpReason:'Motif du choix', cmpReasonPh:'Ex. : meilleur prix, délai adapté et garantie d’un an…',
  cmpPdf:'PV en PDF', cmpXlsx:'Excel', cmpCopy:'Copier en texte', cmpDone:'Fichier généré',
  cmpMixed:'Offres en devises différentes — écart et moins-disant non calculables.',
  cmpMoqWarn:'Quantité inférieure au minimum de commande', cmpNoWinner:'Non défini',
  cheapest:'Moins cher', fastest:'Plus rapide', topRated:'Mieux noté',
  rowPart:'Pièce / Référence', rowUnit:'Prix unitaire', rowTotal:'Total', rowHT:'Total HT', rowTTC:'Total TTC', rowDiff:'Écart avec le moins cher',
  rowDelivery:'Délai de livraison', rowMoq:'Quantité minimale', rowPay:'Conditions de paiement', rowWar:'Garantie', rowRating:'Note',
  rowPhone:'Téléphone', rowEmail:'Email', rowNotes:'Remarques',
  repTitle:'Procès-verbal de comparaison des offres', repDate:'Date', repQty:'Quantité', repBy:'Établi par', repDept:'Service', repSigA:'Établi par', repSigB:'Commission d’achat', repSigC:'Le Directeur',
  repSign:'Nom et signature', repFoot:'Généré par l’outil Annuaire des fournisseurs — merabti.com',
  popup:'Autorisez les fenêtres pop-up pour afficher le PV puis réessayez.', cmpSheet:'Comparaison',
  confirmClear:'Toutes les données enregistrées sur cet appareil seront effacées. Continuer ?', cleared:'Données effacées',
  storeFail:'Impossible d’enregistrer localement (fichier trop volumineux) — les données restent disponibles jusqu’à la fermeture de la page.',
  cloudOff:'Cloud indisponible', cloudOut:'Connectez-vous depuis la page d’accueil pour sauvegarder vos données dans le cloud', cloudLoading:'Chargement de vos données…', cloudSaving:'Enregistrement…', cloudSaved:'Données sauvegardées dans le cloud', cloudErr:'Échec de la synchronisation', cloudRules:'Vérifiez le déploiement des règles Firestore',
  cloudNeedLogin:'Connectez-vous d’abord pour utiliser l’historique.', cloudConflict:'Des données existent sur cet appareil et d’autres, différentes, dans le cloud.\n\nOK = utiliser les données du cloud\nAnnuler = envoyer les données de cet appareil et remplacer le cloud',
  hist:'Historique', histTitle:'Historique des PV et demandes', histCmp:'PV de comparaison', histRfq:'Demandes de prix', histEmpty:'Rien d’enregistré pour l’instant.', histDelete:'Supprimer', histConfirm:'Supprimer définitivement cet élément ?', histSup:'fournisseur(s)', saveCmp:'Enregistrer dans l’historique', cmpSaved:'Enregistré dans l’historique',
  supTip:'Cliquez pour voir toutes les informations du fournisseur', supOffer:'Détails de l’offre', supPart:'Pièce', supContact:'Coordonnées', fMore:'Options',
  country:'Pays d’origine', rowLoc:'Wilaya / Pays',
  tplName:'modele_fournisseurs', expName:'fournisseurs', cmpFile:'comparaison_offres', da:'DA'
},
en:{
  title:'Suppliers & Spare Parts Finder',
  sub:'Type a part name, compare supplier prices and contact them directly — or upload your own suppliers Excel file.',
  ph:'Type a part name, reference, brand or supplier…',
  upload:'Upload Excel', template:'Download template', export:'Export Excel', print:'Print', clear:'Clear data',
  sRecords:'offers', sParts:'parts', sSuppliers:'suppliers',
  sample:'You are viewing sample data (fictional names and numbers) — upload your suppliers file to replace it.',
  filters:'Filters', fReset:'Reset', fParts:'Parts', fPartQ:'Search parts…', fCat:'Category', fBrand:'Brand',
  fCity:'City / Wilaya', fSupplier:'Supplier', fCur:'Currency', fPrice:'Price', fMin:'From', fMax:'To',
  fDel:'Max lead time (days)', fEmail:'Has email', fPhone:'Has phone', fCC:'Country code (WhatsApp links)', all:'All',
  fRating:'Supplier rating', fRating5:'5 stars only', fRating4:'4 stars & up', fRating3:'3 stars & up',
  selAll:'Select all', group:'Group by part', results:'results',
  sPriceAsc:'Cheapest first', sPriceDesc:'Most expensive first', sDelivery:'Fastest delivery', sRating:'Top rated', sSupplier:'Supplier (A–Z)', sPart:'Part (A–Z)',
  best:'Cheapest', days:'days', instant:'Immediate', moq:'Min. qty', pay:'Payment', war:'Warranty', noPrice:'Price on request',
  call:'Call', wa:'WhatsApp', copy:'Copy', mail:'Email', copied:'Copied', nothing:'Nothing to copy',
  rateTip:'Click to rate this supplier (click the same star again to clear)', unrated:'Not rated',
  offers:'offers', min:'Min', max:'Max', avg:'Avg',
  selected:'selected', rfq:'Request quote', compare:'Compare offers', copyEmails:'Copy emails', copyPhones:'Copy phones', exportSel:'Export selected', clearSel:'Cancel',
  emptyTitle:'Start by uploading your suppliers file',
  emptySub:'Drag an Excel or CSV file here or pick one from your device. Your data is never sent to a server — it stays on your device only.',
  emptyPick:'Choose file', emptyDemo:'Try sample data', emptyTpl:'Download the template',
  emptyCols:'Supported columns: part name, reference, category, brand, supplier, contact, phone, email, city, price, currency, lead time, min. order, payment terms, warranty, notes — in Arabic, French or English, detected automatically. (The reference template is in French)',
  dropHere:'Drop the file here',
  noRes:'No matching results', noResSub:'Try other words or relax the filters.',
  fTxt:'Search', fPart:'Part', fMinP:'Price from', fMaxP:'Price to', fDelT:'Lead time ≤', fRatingT:'Rating ≥',
  impTitle:'Import suppliers file', impSub:'Check the column mapping (auto-detected) then click Import.',
  impSheet:'Sheet', impNone:'— none —', impReplace:'Replace current data', impAppend:'Add to current data',
  impGo:'Import', impCancel:'Cancel', impReady:'{n} records will be imported', impMissing:'Map at least “Part name” and “Supplier”.',
  impPreview:'Preview', impDone:'{n} records imported', impFail:'Could not read the file', xlsxFail:'Could not load the Excel library — check your internet connection.',
  impEmptyFile:'The file is empty or has no clear table.',
  rfqTitle:'Request for quotation', rfqSub:'The request goes to the selected suppliers as BCC so none can see the others.',
  rfqParts:'Parts and quantities', rfqQty:'Qty', rfqName:'Your name', rfqCompany:'Company / department', rfqPlace:'Delivery place',
  rfqMsg:'Message', rfqOpen:'Open mail app', rfqCopyMsg:'Copy message', rfqCopyMails:'Copy emails',
  rfqNoMail:'{n} supplier(s) without email will not be included.', rfqSuppliers:'Recipients', rfqNoRecipients:'None of the selected suppliers has an email.',
  rfqLong:'The message is too long for a mail link — it was copied, paste it into your email.',
  subject:'Request for quotation', greet:'Dear Sir/Madam,', hello:'Good day,',
  intro:'Please send us your best quotation for the following items:', qtyW:'Qty', refW:'Ref',
  ask:'Please include: unit price, lead time, payment terms and offer validity.', placeW:'Delivery place', thanks:'Kind regards,',
  cmpTitle:'Offers comparison', cmpSub:'Compare the selected offers, pick the winning supplier, then export the report.',
  cmpMin:'Select at least two offers to compare.', cmpMax:'You can compare up to 4 offers.',
  cmpDiffParts:'Note: the selected offers have different part names — make sure they are equivalent.',
  cmpQty:'Required quantity', cmpVat:'VAT %', cmpName:'Prepared by', cmpDept:'Company / department',
  cmpChoose:'Choose', cmpWinner:'Selected supplier', cmpReason:'Reason for the choice', cmpReasonPh:'e.g. best price with suitable lead time and a 1-year warranty…',
  cmpPdf:'PDF report', cmpXlsx:'Excel', cmpCopy:'Copy as text', cmpDone:'File generated',
  cmpMixed:'Offers are in different currencies — difference and cheapest cannot be computed.',
  cmpMoqWarn:'Quantity is below the minimum order', cmpNoWinner:'Not decided yet',
  cheapest:'Cheapest', fastest:'Fastest', topRated:'Top rated',
  rowPart:'Part / Reference', rowUnit:'Unit price', rowTotal:'Total', rowHT:'Total excl. VAT', rowTTC:'Total incl. VAT', rowDiff:'Difference vs cheapest',
  rowDelivery:'Lead time', rowMoq:'Minimum order', rowPay:'Payment terms', rowWar:'Warranty', rowRating:'Rating',
  rowPhone:'Phone', rowEmail:'Email', rowNotes:'Notes',
  repTitle:'Offers Comparison Report', repDate:'Date', repQty:'Quantity', repBy:'Prepared by', repDept:'Department', repSigA:'Prepared by', repSigB:'Purchasing committee', repSigC:'Director',
  repSign:'Name and signature', repFoot:'Generated by the Suppliers Finder tool — merabti.com',
  popup:'Allow pop-ups to view the report, then try again.', cmpSheet:'Comparison',
  confirmClear:'All data saved on this device will be erased. Continue?', cleared:'Data cleared',
  storeFail:'Could not save data locally (file too large) — it stays available until you close the page.',
  cloudOff:'Cloud unavailable', cloudOut:'Sign in from the home page to save your data to the cloud', cloudLoading:'Loading your data…', cloudSaving:'Saving…', cloudSaved:'Your data is saved to the cloud', cloudErr:'Cloud sync failed', cloudRules:'Check that the Firestore rules are deployed',
  cloudNeedLogin:'Sign in first to use the history.', cloudConflict:'This device has data and the cloud has different data.\n\nOK = use the cloud data\nCancel = upload this device’s data and replace the cloud',
  hist:'History', histTitle:'Reports & requests history', histCmp:'Comparison reports', histRfq:'Quotation requests', histEmpty:'Nothing saved yet.', histDelete:'Delete', histConfirm:'Delete this item permanently?', histSup:'supplier(s)', saveCmp:'Save to history', cmpSaved:'Saved to history',
  supTip:'Click to see all supplier details', supOffer:'Offer details', supPart:'Part', supContact:'Contact details', fMore:'More options',
  country:'Supply country', rowLoc:'Wilaya / Country',
  tplName:'modele_fournisseurs', expName:'suppliers', cmpFile:'offers_comparison', da:'DZD'
}};

/* ---------------- الأيقونات ---------------- */
const IC = {
  upload:'<path d="M12 16V4"/><path d="M7 9l5-5 5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
  download:'<path d="M12 4v12"/><path d="M7 11l5 5 5-5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
  file:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>',
  print:'<path d="M7 9V3h10v6"/><rect x="4" y="9" width="16" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
  trash:'<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  close:'<path d="M6 6l12 12M18 6L6 18"/>',
  filter:'<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
  phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  wa:'<path d="M21 12a8.5 8.5 0 0 1-12.3 7.6L3 21l1.5-5.5A8.5 8.5 0 1 1 21 12z"/><path d="M9 9.5c.5 2.5 3 5 5.5 5.5l1.2-1.4-2-1-1 .7c-1-.5-1.9-1.4-2.4-2.4l.7-1-1-2z"/>',
  copy:'<rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15"/>',
  spark:'<path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z"/>',
  send:'<path d="M4 12l16-8-6 16-3-7z"/>',
  check:'<path d="M5 12l5 5 9-10"/>',
  pin:'<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  cols:'<rect x="3" y="4" width="7" height="16" rx="1.5"/><rect x="14" y="4" width="7" height="16" rx="1.5"/>'
};
function icon(name){ const i=document.createElement('i'); i.setAttribute('data-ic',name); i.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+(IC[name]||'')+'</svg>'; return i; }
function paintIcons(root){ (root||document).querySelectorAll('i[data-ic]').forEach(i=>{ if(!i.firstChild) i.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+(IC[i.getAttribute('data-ic')]||'')+'</svg>'; }); }

/* ---------------- الحالة ---------------- */
const LS = { data:'sf_data_v2', cc:'sf_cc', me:'sf_me', lang:'sf_lang', rate:'sf_ratings', unsynced:'sf_unsynced' };
const CL = { uid:null, state:'out', timers:{} };
function initialLang(){
  const own=localStorage.getItem(LS.lang); if(LANGS.includes(own)) return own;
  const site=localStorage.getItem('site_lang'); return LANGS.includes(site) ? site : 'ar';
}
const S = {
  lang: initialLang(),
  data: [], sample:false, ratings:{},
  q:'', sort:'price-asc', group:true,
  f:{ part:'', cats:new Set(), brands:new Set(), city:'', supplier:'', currency:'', pmin:'', pmax:'', dmax:'', rmin:'', hasEmail:false, hasPhone:false },
  sel:new Set(), partQ:'',
  cc: localStorage.getItem(LS.cc) || '213'
};
const T = (k,o) => { let s=(TX[S.lang][k] ?? TX.en[k] ?? k); if(o) for(const x in o) s=s.replace('{'+x+'}',o[x]); return s; };
const $ = id => document.getElementById(id);
const locale = () => S.lang==='ar' ? 'ar' : S.lang==='fr' ? 'fr' : 'en';

/* ---------------- أدوات نصية ---------------- */
function norm(s){
  return String(s==null?'':s).toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'').replace(/[\u064B-\u065F\u0670\u0640]/g,'')
    .replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/ؤ/g,'و').replace(/ئ/g,'ي')
    .replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/\s+/g,' ').trim();
}
const nkey = s => norm(s).replace(/[^a-z0-9\u0600-\u06FF]/g,'');
const tokens = s => norm(s).split(' ').filter(Boolean);
const txt = v => v==null ? '' : String(v).trim();
const esc = s => String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function h(tag, cls, kids){
  const e=document.createElement(tag); if(cls) e.className=cls;
  (Array.isArray(kids)?kids:[kids]).forEach(k=>{ if(k==null||k===false) return; e.append(k.nodeType?k:document.createTextNode(k)); });
  return e;
}

/* ---------------- تحليل القيم ---------------- */
function parsePrice(v){
  if (typeof v==='number') return isFinite(v)&&v>=0 ? v : null;
  let s=String(v==null?'':v).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[٫]/g,',').replace(/[^\d.,]/g,'');
  if(!s) return null;
  const lc=s.lastIndexOf(','), ld=s.lastIndexOf('.');
  if(lc>-1 && ld>-1){ s = lc>ld ? s.replace(/\./g,'').replace(',','.') : s.replace(/,/g,''); }
  else if(lc>-1){ const after=s.length-lc-1; s = (after===3 && s.indexOf(',')===lc) ? s.replace(',','') : s.replace(/,/g,'.'); }
  else if(ld>-1){ const p=s.split('.'); if(p.length>2) s=s.replace(/\./g,''); else if(p[1].length===3 && p[0].length<=3 && p[0]!=='0') s=s.replace('.',''); }
  const n=parseFloat(s); return isNaN(n)?null:n;
}
function normCur(s){
  const raw=txt(s); if(!raw) return '';
  if(/€/.test(raw)) return 'EUR'; if(/\$/.test(raw)) return 'USD';
  const k=nkey(raw);
  if(['dzd','da','دج','دينار','dinar','dinars','دينارجزائري','دينارجزايري'].includes(k)) return 'DZD';
  if(['eur','euro','euros','يورو','اورو'].includes(k)) return 'EUR';
  if(['usd','dollar','dollars','دولار'].includes(k)) return 'USD';
  return raw.toUpperCase();
}
function curFromPriceCell(v){ if(typeof v==='number') return ''; const s=String(v||''); if(/€|eur|euro|يورو|أورو/i.test(s)) return 'EUR'; if(/\$|usd|dollar|دولار/i.test(s)) return 'USD'; if(/دج|dzd|\bda\b|دينار/i.test(s)) return 'DZD'; return ''; }
function parseDays(v){
  if(typeof v==='number') return isFinite(v)&&v>=0 ? Math.round(v) : null;
  const s=String(v==null?'':v); if(!s.trim()) return null;
  if(/فوري|stock|imm[eé]diat|disponible|متوفر/i.test(s)) return 0;
  const m=s.replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).match(/\d+/); if(!m) return null;
  let n=parseInt(m[0],10); if(/أسبوع|semaine|week/i.test(s)) n*=7; else if(/شهر|mois|month/i.test(s)) n*=30; return n;
}
function cleanPhone(v){
  if(typeof v==='number'){ const d=String(Math.round(v)); return (d.length===9 ? '0'+d : d); }
  return txt(v);
}
const EMAIL_RE=/[^\s;,<>()\[\]"']+@[^\s;,<>()\[\]"']+\.[^\s;,<>()\[\]"']+/g;

/* ---------------- تجهيز السجلات ---------------- */
let _id=0;
function finalize(r){
  r.id = ++_id;
  ['part','supplier','ref','category','brand','contact','city','country','notes','moq','phone','email','payment','warranty'].forEach(k=>r[k]=txt(r[k]));
  r.price = r.price==null||r.price==='' ? null : Number(r.price);
  r.delivery = r.delivery==null||r.delivery==='' ? null : Number(r.delivery);
  r.currency = r.currency || 'DZD';
  r._pk = nkey(r.part);
  r._sk = r.sid || norm(r.supplier);
  r.phones = r.phone.split(/[\/;،|\n]+|\s-\s|,(?=\s*\+?\d)/).map(x=>x.trim()).filter(x=>x.replace(/\D/g,'').length>=6);
  r.emails = (r.email.match(EMAIL_RE)||[]).map(x=>x.toLowerCase());
  r._h = norm([r.part,r.ref,r.category,r.brand,r.supplier,r.contact,r.city,r.country,r.notes,r.payment,r.warranty].join(' | '));
  return r;
}
function baseOf(r){ const {id,_pk,_sk,_h,phones,emails,...b}=r; return b; }

/* ---------------- بيانات تجريبية (3 لغات) ---------------- */
const L3 = (ar,fr,en)=>({ar,fr,en});
function sampleData(lang){
  const g = o => o[lang] ?? o.en;
  const SUP=[
    { sid:'d1', name:L3('الشركة الجزائرية للتوريدات الصناعية','Sté Algérienne de Fournitures Industrielles','Algerian Industrial Supplies Co.'), city:L3('الجزائر العاصمة','Alger','Algiers'), contact:L3('أ. كريم','M. Karim','Mr. Karim'), phone:'0550 00 00 01', email:'commercial@asi-demo.example', seed:5 },
    { sid:'d2', name:L3('SKF Distribution Sétif','SKF Distribution Sétif','SKF Distribution Setif'), city:L3('سطيف','Sétif','Setif'), contact:L3('أ. أمين','M. Amine','Mr. Amine'), phone:'0660 00 00 02', email:'ventes@skf-setif-demo.example', seed:4 },
    { sid:'d3', name:L3('Elec Pro Oran','Elec Pro Oran','Elec Pro Oran'), city:L3('وهران','Oran','Oran'), contact:L3('السيدة نادية','Mme Nadia','Ms. Nadia'), phone:'0770 00 00 03', email:'contact@elecpro-demo.example', seed:3 },
    { sid:'d4', name:L3('مؤسسة الأطلس للمعدات','Ets Atlas Équipements','Atlas Equipment Est.'), city:L3('قسنطينة','Constantine','Constantine'), contact:L3('أ. يوسف','M. Youcef','Mr. Youcef'), phone:'0555 00 00 04', email:'atlas@atlas-demo.example', seed:4 },
    { sid:'d5', name:L3('TechnoParts Annaba','TechnoParts Annaba','TechnoParts Annaba'), city:L3('عنابة','Annaba','Annaba'), contact:L3('أ. رياض','M. Riad','Mr. Riad'), phone:'0661 00 00 05', email:'info@technoparts-demo.example', seed:3 },
    { sid:'d6', name:L3('Sahara Industrial Supply','Sahara Industrial Supply','Sahara Industrial Supply'), city:L3('ورقلة','Ouargla','Ouargla'), contact:L3('أ. عبد الله','M. Abdallah','Mr. Abdallah'), phone:'0771 00 00 06', email:'sales@sahara-demo.example', seed:5 },
    { sid:'d7', name:L3('Medea Hydraulics','Medea Hydraulics','Medea Hydraulics'), city:L3('المدية','Médéa','Medea'), contact:L3('أ. حكيم','M. Hakim','Mr. Hakim'), phone:'0552 00 00 07', email:'hydro@medea-demo.example', seed:2 },
    { sid:'d8', name:L3('باتنة للمواد الحرارية','Batna Réfractaires','Batna Refractories'), city:L3('باتنة','Batna','Batna'), contact:L3('أ. سمير','M. Samir','Mr. Samir'), phone:'0662 00 00 08', email:'ref@batna-demo.example', seed:4 }
  ];
  const PARTS=[
    [L3('رولمان 22320 CC/W33','Roulement 22320 CC/W33','Bearing 22320 CC/W33'),'22320-CC-W33',L3('رولمانات','Roulements','Bearings'),'SKF',48000],
    [L3('رولمان 22222 E','Roulement 22222 E','Bearing 22222 E'),'22222-E',L3('رولمانات','Roulements','Bearings'),'FAG',21500],
    [L3('سير مثلثي SPB 3350','Courroie trapézoïdale SPB 3350','V-belt SPB 3350'),'SPB-3350',L3('سيور وسلاسل','Courroies et chaînes','Belts & chains'),'Optibelt',6500],
    [L3('كونتاكتور 80A','Contacteur 80 A','Contactor 80 A'),'LC1D80',L3('كهرباء','Électricité','Electrical'),'Schneider',32000],
    [L3('قاطع دارة 250A','Disjoncteur 250 A','Circuit breaker 250 A'),'NSX250',L3('كهرباء','Électricité','Electrical'),'Schneider',78000],
    [L3('محول تردد 90 kW','Variateur de fréquence 90 kW','Frequency drive 90 kW'),'ACS880-90',L3('كهرباء','Électricité','Electrical'),'ABB',1450000],
    [L3('حساس حرارة PT100','Sonde de température PT100','PT100 temperature sensor'),'PT100-L200',L3('أجهزة قياس','Instrumentation','Instruments'),'WIKA',9500],
    [L3('حساس تقارب M18','Capteur de proximité M18','Proximity sensor M18'),'IME18',L3('أجهزة قياس','Instrumentation','Instruments'),'Sick',7800],
    [L3('زيت علبة السرعة ISO VG 320 (برميل 208 L)','Huile réducteur ISO VG 320 (fût 208 L)','Gear oil ISO VG 320 (208 L drum)'),'VG320-208',L3('زيوت وشحوم','Huiles et graisses','Oils & greases'),'Mobil',185000],
    [L3('خرطوم هيدروليكي 2SN 1 بوصة (للمتر)','Flexible hydraulique 2SN 1" (au mètre)','Hydraulic hose 2SN 1" (per meter)'),'2SN-1',L3('هيدروليك','Hydraulique','Hydraulics'),'Parker',4200],
    [L3('بكرة ناقل Ø133','Rouleau de convoyeur Ø133','Conveyor idler Ø133'),'IDL-133',L3('ميكانيك','Mécanique','Mechanical'),'',14500],
    [L3('طوب حراري MgO-C (للطن)','Briques réfractaires MgO-C (la tonne)','MgO-C refractory bricks (per ton)'),'MGC-01',L3('مواد حرارية','Réfractaires','Refractories'),'RHI',390000]
  ];
  const PAY=[L3('الدفع بعد 30 يومًا','Paiement à 30 jours','Payment within 30 days'),L3('الدفع عند التسليم','Paiement à la livraison','Cash on delivery'),L3('50% مسبقًا والباقي عند التسليم','50 % à la commande, solde à la livraison','50% upfront, balance on delivery'),L3('الدفع بعد 60 يومًا','Paiement à 60 jours','Payment within 60 days'),L3('تحويل مسبق','Virement anticipé','Prepayment by transfer')];
  const WAR=[L3('سنة','1 an','1 year'),L3('6 أشهر','6 mois','6 months'),L3('سنتان','2 ans','2 years'),L3('بدون ضمان','Sans garantie','No warranty'),L3('3 أشهر','3 mois','3 months')];
  const CTRY_DZ=L3('الجزائر','Algérie','Algeria'), CTRY_DE=L3('ألمانيا','Allemagne','Germany');
  const NOTE_TAX=L3('السعر شامل الرسوم','Prix toutes taxes comprises','Price includes taxes');
  const NOTE_IMP=L3('استيراد — السعر باليورو','Import — prix en euros','Import — price in euros');
  const mult=[1,0.94,1.08,1.03,0.97], days=[2,5,7,3,10], moq=['1','1','2','1','5'];
  const mk=(s,p,price,cur,delivery,m,pay,war,notes,ctry)=>({ sid:s.sid, seed:s.seed, part:g(p[0]), ref:p[1], category:g(p[2]), brand:p[3], supplier:g(s.name), contact:g(s.contact), phone:s.phone, email:s.email, city:g(s.city), country:g(ctry||CTRY_DZ), price, currency:cur, delivery, moq:m, payment:g(pay), warranty:g(war), notes:notes?g(notes):'' });
  const out=[];
  PARTS.forEach((p,i)=>{
    const n=3+(i%2);
    for(let j=0;j<n;j++){
      const s=SUP[(i+j*2)%SUP.length];
      out.push(mk(s,p,Math.round(p[4]*mult[(i+j)%5]/100)*100,'DZD',days[(i*2+j)%5],moq[(i+j)%5],PAY[(i+j)%5],WAR[(i*2+j)%5], j===0?NOTE_TAX:null));
    }
  });
  out.push(mk(SUP[4],PARTS[5],9800,'EUR',21,'1',PAY[4],WAR[0],NOTE_IMP,CTRY_DE));
  return out;
}

/* ---------------- التخزين والتقييمات ---------------- */
function persistLocal(){
  try{ localStorage.setItem(LS.data, JSON.stringify({ sample:S.sample, data: S.sample ? [] : S.data.map(baseOf) })); }
  catch(e){ toast(T('storeFail'), 3500); }
}
function persist(){
  persistLocal();
  if(S.sample) return;
  if(CL.uid) cloudSaveData(); else { try{ localStorage.setItem(LS.unsynced,'1'); }catch(e){} }
}
function loadStored(){
  try{ S.ratings=JSON.parse(localStorage.getItem(LS.rate)||'{}')||{}; }catch(e){ S.ratings={}; }
  try{
    const raw=localStorage.getItem(LS.data); if(!raw) return;
    const o=JSON.parse(raw); S.sample=!!o.sample;
    S.data = S.sample ? sampleData(S.lang).map(finalize) : (o.data||[]).map(finalize);
  }catch(e){}
}
function getRating(r){ const v=S.ratings[r._sk]; return v!==undefined ? v : (r.sid && r.seed ? r.seed : 0); }
function setRating(key, val){
  S.ratings[key]=val;
  try{ localStorage.setItem(LS.rate, JSON.stringify(S.ratings)); }catch(e){}
  cloudSaveRatings();
}
const starText = n => n>0 ? '★'.repeat(n)+'☆'.repeat(5-n) : '—';

/* ---------------- ألوان الأصناف ---------------- */
const PALETTE=[
  { ink:'#2F6FB0', bg:'#DCEAFB', g1:'#4A86C5', g2:'#2F5F96' },
  { ink:'#C2691A', bg:'#FCE9D6', g1:'#E58A3B', g2:'#B8631A' },
  { ink:'#2E8A5B', bg:'#DDF3E4', g1:'#48A878', g2:'#2A7A52' },
  { ink:'#7A4FA3', bg:'#EBE0F5', g1:'#9468BE', g2:'#6A409A' },
  { ink:'#B15C86', bg:'#F6E4EE', g1:'#CC7AA3', g2:'#A04E78' },
  { ink:'#1A8A72', bg:'#D7F1EA', g1:'#3AA890', g2:'#177A65' },
  { ink:'#B8860B', bg:'#FDF0DA', g1:'#D9A030', g2:'#A87608' },
  { ink:'#55636F', bg:'#E7ECEF', g1:'#71808D', g2:'#4E5C68' }
];
const NO_CAT={ ink:'#2F5770', bg:'#E3EEF4', g1:'#3F7392', g2:'#2F5770' };
let catIdx=new Map();
function buildCatMap(){
  const cats=[...new Set(S.data.map(r=>norm(r.category||'')))].filter(Boolean).sort();
  catIdx=new Map(cats.map((c,i)=>[c,i%PALETTE.length]));
}
function catColor(cat){ const k=norm(cat||''); return catIdx.has(k) ? PALETTE[catIdx.get(k)] : NO_CAT; }

/* ---------------- التصفية والترتيب ---------------- */
const num = v => (v===''||v==null||isNaN(Number(v))) ? null : Number(v);
function baseQ(){ const t=tokens(S.q); return t.length ? S.data.filter(r=>t.every(x=>r._h.includes(x))) : S.data; }
function results(){
  const f=S.f, t=tokens(S.q), pmin=num(f.pmin), pmax=num(f.pmax), dmax=num(f.dmax), rmin=num(f.rmin);
  const arr=S.data.filter(r=>{
    if(t.length && !t.every(x=>r._h.includes(x))) return false;
    if(f.part && r._pk!==f.part) return false;
    if(f.cats.size && !f.cats.has(r.category||'—')) return false;
    if(f.brands.size && !f.brands.has(r.brand||'—')) return false;
    if(f.city && r.city!==f.city) return false;
    if(f.supplier && r.supplier!==f.supplier) return false;
    if(f.currency && r.currency!==f.currency) return false;
    if(pmin!=null && (r.price==null || r.price<pmin)) return false;
    if(pmax!=null && (r.price==null || r.price>pmax)) return false;
    if(dmax!=null && (r.delivery==null || r.delivery>dmax)) return false;
    if(rmin!=null && getRating(r)<rmin) return false;
    if(f.hasEmail && !r.emails.length) return false;
    if(f.hasPhone && !r.phones.length) return false;
    return true;
  });
  const nullLast=(a,b,dir)=> (a==null && b==null)?0 : a==null?1 : b==null?-1 : dir*(a-b);
  const loc=locale();
  const sorters={
    'price-asc':(a,b)=>nullLast(a.price,b.price,1),
    'price-desc':(a,b)=>nullLast(a.price,b.price,-1),
    'delivery':(a,b)=>nullLast(a.delivery,b.delivery,1) || nullLast(a.price,b.price,1),
    'rating':(a,b)=>getRating(b)-getRating(a) || nullLast(a.price,b.price,1),
    'supplier':(a,b)=>a.supplier.localeCompare(b.supplier,loc),
    'part':(a,b)=>a.part.localeCompare(b.part,loc)
  };
  return arr.sort(sorters[S.sort]);
}

/* ---------------- التنسيق ---------------- */
const curLabel = c => c==='DZD' ? T('da') : c==='EUR' ? '€' : c==='USD' ? '$' : c;
function fmtNum(n){ return Number(n).toLocaleString('fr-FR',{maximumFractionDigits:2}).replace(/[\u202f\u00a0]/g,'\u00A0'); }
const fmtPrice = r => r.price==null ? null : fmtNum(r.price)+'\u00A0'+curLabel(r.currency);
function fmtDays(d){ return d==null ? null : d===0 ? T('instant') : d+' '+T('days'); }
function waLink(p){
  const raw=String(p).trim(); let d=raw.replace(/\D/g,'');
  if(raw.startsWith('+')) return 'https://wa.me/'+d;
  if(d.startsWith('00')) d=d.slice(2);
  else if(d.startsWith('0')) d=S.cc+d.slice(1);
  else if(d.length<=9) d=S.cc+d;
  return 'https://wa.me/'+d;
}
const telHref = p => 'tel:'+String(p).replace(/[^\d+]/g,'');

/* ---------------- عناصر الواجهة ---------------- */
let toastTimer;
function toast(msg, ms){
  const t=$('sfToast'); t.textContent=msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('show'), ms||1700);
}
function copyText(text, msg){
  if(!text){ toast(T('nothing')); return Promise.resolve(); }
  const done=()=>toast(msg||T('copied'));
  if(navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).then(done).catch(()=>fb(text,done));
  fb(text,done); return Promise.resolve();
}
function fb(text,done){ const ta=document.createElement('textarea'); ta.value=text; ta.style.cssText='position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); try{document.execCommand('copy'); done();}catch(e){} document.body.removeChild(ta); }

function iconBtn(name, title, onclick, href, cls){
  const el = href ? h('a','sf-ic '+(cls||'')) : h('button','sf-ic '+(cls||''));
  if(href){ el.href=href; if(/^https?:/.test(href)){ el.target='_blank'; el.rel='noopener'; } } else el.type='button';
  el.title=title; el.setAttribute('aria-label',title); el.append(icon(name)); if(onclick) el.addEventListener('click',onclick); return el;
}

/* ---- النجوم ---- */
function paintStars(wrap,v){ wrap.querySelectorAll('.sf-star').forEach(b=>b.classList.toggle('on', Number(b.dataset.v)<=v)); }
function paintAllStars(key){
  const rec=S.data.find(x=>x._sk===key); const v=rec?getRating(rec):0;
  document.querySelectorAll('.sf-stars').forEach(w=>{ if(w.dataset.k===key) paintStars(w,v); });
}
function starsEl(r){
  const key=r._sk, wrap=h('span','sf-stars'); wrap.dataset.k=key; wrap.title=T('rateTip');
  for(let i=1;i<=5;i++){
    const b=h('button','sf-star','★'); b.type='button'; b.dataset.v=String(i); b.setAttribute('aria-label',i+'/5');
    b.addEventListener('click',e=>{
      e.stopPropagation();
      const cur=getRating(r); setRating(key, cur===i ? 0 : i); paintAllStars(key);
      if(S.f.rmin!=='' || S.sort==='rating') renderResults();
    });
    wrap.append(b);
  }
  paintStars(wrap,getRating(r)); return wrap;
}

function rowEl(r, isBest, grouped){
  const col=catColor(r.category);
  const row=h('div','sf-row'+(grouped?' grp':'')+(S.sel.has(r.id)?' sel':'')+(isBest?' best':''));
  row.style.setProperty('--cc',col.ink);
  const chk=h('input'); chk.type='checkbox'; chk.checked=S.sel.has(r.id);
  chk.addEventListener('change',()=>{ chk.checked ? S.sel.add(r.id) : S.sel.delete(r.id); row.classList.toggle('sel',chk.checked); renderBar(); syncAll(); });
  row.append(h('div','sf-rchk',chk));

  const tags=[]; if(r.ref) tags.push(h('span','sf-tag ref',r.ref)); if(r.brand) tags.push(h('span','sf-tag brand',r.brand));
  if(r.category){ const t=h('span','sf-tag',r.category); t.style.background=col.bg; t.style.color=col.ink; tags.push(t); }
  row.append(h('div','',[ grouped?null:h('div','sf-part',r.part), tags.length?h('div','sf-tags'+(grouped?' sf-tags-top':''),tags):null, r.notes?h('div','sf-note',r.notes):null ]));

  // خلية المورد: الضغط عليها يفتح نافذة كل المعلومات
  const sub=[]; if(r.contact) sub.push(h('span','',r.contact)); if(r.city) sub.push(h('span','',r.city));
  const supCell=h('div','sf-supcell',[ h('div','sf-sup',r.supplier), starsEl(r), sub.length?h('div','sf-sub',sub):null ]);
  supCell.tabIndex=0; supCell.setAttribute('role','button'); supCell.title=T('supTip');
  supCell.addEventListener('click',()=>openSupplier(r));
  supCell.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openSupplier(r); } });
  row.append(supCell);

  const c=h('div','sf-contact');
  r.phones.slice(0,2).forEach(p=>{
    const ln=h('a','sf-ln',[icon('phone'),p]); ln.href=telHref(p); ln.title=T('call');
    c.append(h('div','sf-line',[ ln, iconBtn('wa',T('wa'),null,waLink(p),'wa'), iconBtn('copy',T('copy'),()=>copyText(p)) ]));
  });
  if(!r.phones.length) c.append(h('span','sf-none','—'));
  if(r.emails.length){
    const e=r.emails[0];
    c.append(h('div','sf-line',[ Object.assign(h('a','sf-ln',[icon('mail'),e]),{href:'mailto:'+e,title:e}), iconBtn('copy',T('copy'),()=>copyText(r.emails.join(', '))) ]));
  }
  row.append(c);

  // السعر فقط (بقية التفاصيل في نافذة المورد)
  const pb=h('div','sf-pricebox');
  const ps=fmtPrice(r);
  pb.append(ps ? h('div','sf-price',ps) : h('div','sf-price none',T('noPrice')));
  if(isBest) pb.append(h('span','sf-best','★ '+T('best')));
  row.append(pb);
  return row;
}

/* ---- نافذة معلومات المورد ---- */
function openSupplier(r){
  const col=catColor(r.category);
  const x=h('button','sf-x sf-x-light',icon('close')); x.type='button'; x.setAttribute('aria-label','close'); x.addEventListener('click',closeModal);
  const sub=[r.city,r.contact].filter(Boolean).join('   •   ');
  const head=h('div','sf-sm-head',[
    h('div','sf-sm-avatar',(r.supplier||'?').trim().charAt(0).toUpperCase()),
    h('div','sf-sm-titles',[ h('h2','',r.supplier), sub?h('div','sf-sm-sub',sub):null, starsEl(r) ]),
    x
  ]);
  head.style.background='linear-gradient(135deg,'+col.g1+','+col.g2+')';

  const ps=fmtPrice(r);
  const priceCard=h('div','sf-sm-price',[ h('span','sf-sm-l',T('rowUnit')), ps?h('b','',ps):h('b','none',T('noPrice')) ]);
  priceCard.style.background=col.bg; priceCard.style.color=col.ink;

  const tile=(label,val)=>h('div','sf-tile',[ h('span','sf-sm-l',label), h('b','',val||'—') ]);
  const tiles=h('div','sf-tiles',[ tile(T('rowDelivery'),fmtDays(r.delivery)), tile(T('rowMoq'),r.moq), tile(T('rowPay'),r.payment), tile(T('rowWar'),r.warranty) ]);

  const body=h('div','sf-sm-body');
  const locTile=(ic,label,val)=>{ const i=h('div','sf-loc-ic',icon(ic)); i.style.color=col.ink; return h('div','sf-loc-tile',[ i, h('div','',[ h('span','sf-sm-l',label), h('b','',val||'—') ]) ]); };
  const loc=h('div','sf-loc',[ locTile('pin',T('fCity'),r.city), locTile('globe',T('country'),r.country) ]);
  body.append(priceCard, loc, h('h3','sf-sm-h',T('supOffer')), tiles);

  // القطعة
  const tags=[]; if(r.ref) tags.push(h('span','sf-tag ref',r.ref)); if(r.brand) tags.push(h('span','sf-tag brand',r.brand));
  if(r.category){ const t=h('span','sf-tag',r.category); t.style.background=col.bg; t.style.color=col.ink; tags.push(t); }
  body.append(h('h3','sf-sm-h',T('supPart')), h('div','sf-sm-part',[ h('div','sf-part',r.part), tags.length?h('div','sf-tags',tags):null ]));

  // الاتصال
  const cont=h('div','sf-sm-contact');
  r.phones.forEach(p=>{
    const ln=h('a','sf-ln sf-ln-lg',[icon('phone'),p]); ln.href=telHref(p);
    cont.append(h('div','sf-line',[ ln, iconBtn('wa',T('wa'),null,waLink(p),'wa'), iconBtn('copy',T('copy'),()=>copyText(p)) ]));
  });
  r.emails.forEach(e=>{
    cont.append(h('div','sf-line',[ Object.assign(h('a','sf-ln sf-ln-lg',[icon('mail'),e]),{href:'mailto:'+e}), iconBtn('copy',T('copy'),()=>copyText(e)) ]));
  });
  if(!r.phones.length && !r.emails.length) cont.append(h('span','sf-none','—'));
  body.append(h('h3','sf-sm-h',T('supContact')), cont);

  if(r.notes) body.append(h('h3','sf-sm-h',T('rowNotes')), h('div','sf-sm-notes',r.notes));

  openModal(h('div','',[head,body]), false, true);
}

/* ---------------- العرض ---------------- */
function render(){
  const has=S.data.length>0;
  $('sfEmpty').hidden=has; $('sfMain').hidden=!has; $('sfStats').hidden=!has;
  $('sfSample').hidden=!(has&&S.sample); $('sfSample').textContent=T('sample');
  buildCatMap(); renderStats(); renderSelects(); renderFacets(); renderResults();
}
function renderStats(){
  const st=$('sfStats'); st.innerHTML='';
  const parts=new Set(S.data.map(r=>r._pk)).size, sups=new Set(S.data.map(r=>r._sk)).size;
  [[S.data.length,'sRecords'],[parts,'sParts'],[sups,'sSuppliers']].forEach(([n,k])=>st.append(h('span','sf-stat',[h('b','',fmtNum(n)),T(k)])));
}
function fillSelect(sel, values, cur){
  sel.innerHTML=''; const o=h('option','',T('all')); o.value=''; sel.append(o);
  values.forEach(v=>{ const x=h('option','',v.label||v); x.value=v.value||v; sel.append(x); });
  sel.value = values.some(v=>(v.value||v)===cur) ? cur : '';
}
function renderSelects(){
  const uniq=fn=>[...new Set(S.data.map(fn).filter(Boolean))].sort((a,b)=>a.localeCompare(b,locale()));
  fillSelect($('sfCity'), uniq(r=>r.city), S.f.city);
  fillSelect($('sfSupplier'), uniq(r=>r.supplier), S.f.supplier);
  fillSelect($('sfCurrency'), uniq(r=>r.currency).map(c=>({value:c,label:curLabel(c)+' ('+c+')'})), S.f.currency);
  fillSelect($('sfRating'), [{value:'5',label:'★★★★★  '+T('fRating5')},{value:'4',label:'★★★★☆  '+T('fRating4')},{value:'3',label:'★★★☆☆  '+T('fRating3')}], S.f.rmin);
  S.f.city=$('sfCity').value; S.f.supplier=$('sfSupplier').value; S.f.currency=$('sfCurrency').value; S.f.rmin=$('sfRating').value;
  const so=$('sfSort'); const cur=S.sort; so.innerHTML='';
  [['price-asc','sPriceAsc'],['price-desc','sPriceDesc'],['rating','sRating'],['delivery','sDelivery'],['supplier','sSupplier'],['part','sPart']].forEach(([v,k])=>{ const o=h('option','',T(k)); o.value=v; so.append(o); });
  so.value=cur;
}
function facetList(container, items, set, dotFn){
  container.innerHTML='';
  items.forEach(([name,count])=>{
    const cb=h('input'); cb.type='checkbox'; cb.checked=set.has(name);
    cb.addEventListener('change',()=>{ cb.checked?set.add(name):set.delete(name); renderResults(); });
    const dot=dotFn?h('i','sf-dot'):null; if(dot) dot.style.background=dotFn(name).ink;
    container.append(h('label','sf-check',[cb,dot,h('span','',name),h('em','',String(count))]));
  });
}
function renderFacets(){
  const base=baseQ();
  const count=fn=>{ const m=new Map(); base.forEach(r=>{ const k=fn(r); m.set(k,(m.get(k)||0)+1); }); return [...m.entries()].sort((a,b)=>b[1]-a[1]||String(a[0]).localeCompare(String(b[0]))); };
  facetList($('sfCats'), count(r=>r.category||'—'), S.f.cats, n=>catColor(n==='—'?'':n));
  facetList($('sfBrands'), count(r=>r.brand||'—'), S.f.brands);
  const pm=new Map(); base.forEach(r=>{ const e=pm.get(r._pk)||{name:r.part,cat:r.category,sups:new Set()}; e.sups.add(r._sk); pm.set(r._pk,e); });
  const pq=tokens(S.partQ);
  const list=[...pm.entries()].filter(([k,e])=>!pq.length || pq.every(t=>norm(e.name).includes(t))).sort((a,b)=>b[1].sups.size-a[1].sups.size||a[1].name.localeCompare(b[1].name)).slice(0,300);
  const box=$('sfParts'); box.innerHTML='';
  list.forEach(([k,e])=>{
    const pd=h('i','sf-dot'); pd.style.background=catColor(e.cat).ink;
    const b=h('button','sf-pitem'+(S.f.part===k?' on':''),[pd,h('span','',e.name),h('em','',String(e.sups.size))]); b.type='button'; b.title=e.name;
    b.addEventListener('click',()=>{ S.f.part = S.f.part===k ? '' : k; renderFacets(); renderResults(); });
    box.append(b);
  });
}
const groupBestKey = r => r._pk+'|'+r.currency;
function renderResults(){
  const list=$('sfList'); list.innerHTML='';
  const res=results();
  $('sfCount').textContent=fmtNum(res.length)+' '+T('results');
  renderChips();
  const minMap=new Map(), cnt=new Map();
  res.forEach(r=>{ const k=groupBestKey(r); cnt.set(k,(cnt.get(k)||0)+1); if(r.price!=null && (!minMap.has(k)||r.price<minMap.get(k))) minMap.set(k,r.price); });
  const isBest=r=> r.price!=null && cnt.get(groupBestKey(r))>1 && minMap.get(groupBestKey(r))===r.price;
  if(!res.length){ list.append(h('div','sf-noresult',[h('h3','',T('noRes')),h('div','',T('noResSub'))])); renderBar(); syncAll(res); return; }
  if(S.group){
    const groups=new Map(); res.forEach(r=>{ if(!groups.has(r._pk)) groups.set(r._pk,[]); groups.get(r._pk).push(r); });
    const arr=[...groups.values()].sort((a,b)=>a[0].part.localeCompare(b[0].part,locale()));
    arr.forEach(rows=>{
      const prices=rows.filter(r=>r.price!=null); const curs=new Set(prices.map(r=>r.currency));
      const pills=[ h('span','sf-gpill',rows.length+' '+T('offers')) ];
      if(prices.length && curs.size===1){
        const c=curLabel(prices[0].currency), ps=prices.map(r=>r.price);
        pills.push(h('span','sf-gpill',T('min')+': '+fmtNum(Math.min(...ps))+' '+c));
        if(prices.length>1){ pills.push(h('span','sf-gpill',T('max')+': '+fmtNum(Math.max(...ps))+' '+c)); pills.push(h('span','sf-gpill',T('avg')+': '+fmtNum(ps.reduce((a,b)=>a+b,0)/ps.length)+' '+c)); }
      }
      const gh=h('div','sf-ghead',[h('h2','',rows[0].part),h('div','sf-gmeta',pills)]); const gc=catColor(rows[0].category); gh.style.background='linear-gradient(135deg,'+gc.g1+','+gc.g2+')';
      list.append(h('div','sf-group',[ gh, h('div','sf-rows',rows.map(r=>rowEl(r,isBest(r),true))) ]));
    });
  } else list.append(h('div','sf-rows',res.map(r=>rowEl(r,isBest(r),false))));
  renderBar(); syncAll(res);
}
function syncAll(res){
  res = res || results();
  const all=$('sfAll'); if(!res.length){ all.checked=false; return; }
  all.checked = res.every(r=>S.sel.has(r.id));
}
function renderChips(){
  const box=$('sfChips'); box.innerHTML=''; const f=S.f;
  const add=(label,fn)=>{ const b=h('button','sf-chip',[label,icon('close')]); b.type='button'; b.addEventListener('click',()=>{ fn(); syncInputs(); renderFacets(); renderResults(); }); box.append(b); };
  if(S.q.trim()) add(T('fTxt')+': '+S.q.trim(),()=>{ S.q=''; $('sfQ').value=''; $('sfQClear').classList.remove('show'); });
  if(f.part){ const r=S.data.find(x=>x._pk===f.part); add(T('fPart')+': '+(r?r.part:''),()=>{ f.part=''; }); }
  f.cats.forEach(c=>add(T('fCat')+': '+c,()=>f.cats.delete(c)));
  f.brands.forEach(c=>add(T('fBrand')+': '+c,()=>f.brands.delete(c)));
  if(f.city) add(T('fCity')+': '+f.city,()=>{ f.city=''; });
  if(f.supplier) add(T('fSupplier')+': '+f.supplier,()=>{ f.supplier=''; });
  if(f.currency) add(T('fCur')+': '+f.currency,()=>{ f.currency=''; });
  if(f.rmin!=='') add(T('fRatingT')+' '+f.rmin+' ★',()=>{ f.rmin=''; });
  if(f.pmin!=='') add(T('fMinP')+': '+f.pmin,()=>{ f.pmin=''; });
  if(f.pmax!=='') add(T('fMaxP')+': '+f.pmax,()=>{ f.pmax=''; });
  if(f.dmax!=='') add(T('fDelT')+' '+f.dmax,()=>{ f.dmax=''; });
  if(f.hasEmail) add(T('fEmail'),()=>{ f.hasEmail=false; });
  if(f.hasPhone) add(T('fPhone'),()=>{ f.hasPhone=false; });
}
function syncInputs(){
  const f=S.f;
  $('sfCity').value=f.city; $('sfSupplier').value=f.supplier; $('sfCurrency').value=f.currency; $('sfRating').value=f.rmin;
  $('sfPmin').value=f.pmin; $('sfPmax').value=f.pmax; $('sfDmax').value=f.dmax;
  $('sfHasEmail').checked=f.hasEmail; $('sfHasPhone').checked=f.hasPhone;
}
function resetFiltersSilent(){
  const f=S.f; f.part=''; f.cats.clear(); f.brands.clear(); f.city=f.supplier=f.currency=f.rmin=''; f.pmin=f.pmax=f.dmax=''; f.hasEmail=f.hasPhone=false;
  S.q=''; S.partQ=''; $('sfQ').value=''; $('sfPartQ').value=''; $('sfQClear').classList.remove('show'); syncInputs();
}
function resetFilters(){ resetFiltersSilent(); renderFacets(); renderResults(); }

/* ---------------- شريط التحديد ---------------- */
const selected = () => S.data.filter(r=>S.sel.has(r.id));
function renderBar(){
  const bar=$('sfBar'); const n=S.sel.size;
  bar.classList.toggle('show', n>0); if(!n){ bar.innerHTML=''; return; }
  bar.innerHTML='';
  const mk=(ic,label,fn,cls)=>{ const b=h('button','sf-btn '+(cls||''),[icon(ic),h('span','',label)]); b.type='button'; b.addEventListener('click',fn); return b; };
  bar.append(h('b','',n+' '+T('selected')),
    mk('cols',T('compare'),openCompare,'sf-btn-cmp'),
    mk('send',T('rfq'),openRFQ,'sf-btn-primary'),
    mk('mail',T('copyEmails'),()=>copyText([...new Set(selected().flatMap(r=>r.emails))].join('; '))),
    mk('phone',T('copyPhones'),()=>copyText([...new Set(selected().flatMap(r=>r.phones))].join('\n'))),
    mk('download',T('exportSel'),()=>exportXlsx(selected())),
    mk('close',T('clearSel'),()=>{ S.sel.clear(); renderResults(); }));
}

/* ---------------- النوافذ ---------------- */
function openModal(node, wide, narrow){ const box=$('sfModalBox'); box.classList.toggle('wide',!!wide); box.classList.toggle('narrow',!!narrow); box.innerHTML=''; box.append(node); $('sfModal').classList.add('open'); paintIcons(box); box.querySelectorAll('.sf-btn span').forEach(s=>s.style.display='inline'); }
function closeModal(){ $('sfModal').classList.remove('open'); $('sfModalBox').innerHTML=''; }
function modalHead(title){ const x=h('button','sf-x',icon('close')); x.type='button'; x.addEventListener('click',closeModal); return h('div','sf-mh',[h('h2','',title),x]); }
function meGet(){ try{ return JSON.parse(localStorage.getItem(LS.me)||'{}')||{}; }catch(e){ return {}; } }
function meSet(o){ try{ localStorage.setItem(LS.me, JSON.stringify(Object.assign(meGet(),o))); }catch(e){} cloudSaveSettings(); }

/* ---------------- طلب عرض سعر ---------------- */
function openRFQ(){
  const chosen=selected(); if(!chosen.length) return;
  const partMap=new Map(); chosen.forEach(r=>{ if(!partMap.has(r._pk)) partMap.set(r._pk,{name:r.part,ref:r.ref,qty:1}); });
  const parts=[...partMap.values()];
  const supMap=new Map(); chosen.forEach(r=>{ if(!supMap.has(r._sk)) supMap.set(r._sk,{name:r.supplier,emails:new Set()}); r.emails.forEach(e=>supMap.get(r._sk).emails.add(e)); });
  const sups=[...supMap.values()]; const withMail=sups.filter(s=>s.emails.size); const noMail=sups.length-withMail.length;
  const me=meGet(); const st={ name:me.name||'', company:me.company||'', place:me.place||'', edited:false };

  const box=h('div','');
  box.append(modalHead(T('rfqTitle')), h('p','sf-msub',T('rfqSub')));
  const chips=h('div','sf-stats'); withMail.forEach(s=>chips.append(h('span','sf-stat',s.name)));
  box.append(h('h3','',T('rfqSuppliers')+' ('+withMail.length+')'), chips);
  if(noMail) box.append(h('div','sf-warn',T('rfqNoMail',{n:noMail})));
  if(!withMail.length) box.append(h('div','sf-warn',T('rfqNoRecipients')));
  box.append(h('h3','',T('rfqParts')));
  let logged=false; const logOnce=()=>{ if(logged) return; logged=true; logRfq(parts,withMail,ta.value,st); };
  const ta=h('textarea','sf-ta'); ta.addEventListener('input',()=>{ st.edited=true; });
  const build=()=>{
    const L=[T('greet'),T('hello'),'',T('intro')];
    parts.forEach((p,i)=>L.push((i+1)+'. '+p.name+(p.ref?' ('+T('refW')+': '+p.ref+')':'')+' — '+T('qtyW')+': '+p.qty));
    L.push('',T('ask')); if(st.place) L.push(T('placeW')+': '+st.place);
    L.push('',T('thanks')); if(st.name) L.push(st.name); if(st.company) L.push(st.company);
    if(!st.edited) ta.value=L.join('\n');
  };
  parts.forEach(p=>{
    const q=h('input','sf-mini'); q.type='number'; q.min='1'; q.value='1'; q.addEventListener('input',()=>{ p.qty=q.value||'1'; st.edited=false; build(); });
    box.append(h('div','sf-partq',[h('span','',p.name),h('label','',T('rfqQty')),q]));
  });
  const grid=h('div','sf-mgrid'); grid.style.marginTop='14px';
  const field=(label,key)=>{ const i=h('input','sf-mini'); i.type='text'; i.value=st[key]; i.addEventListener('input',()=>{ st[key]=i.value; st.edited=false; build(); meSet({[key]:i.value}); }); return h('div','sf-mf',[h('label','',label),i]); };
  grid.append(field(T('rfqName'),'name'),field(T('rfqCompany'),'company'),field(T('rfqPlace'),'place'));
  box.append(grid, h('h3','',T('rfqMsg')), ta);
  build();
  const allMails=[...new Set(withMail.flatMap(s=>[...s.emails]))];
  const foot=h('div','sf-mfoot');
  const b1=h('button','sf-btn sf-btn-primary',[icon('mail'),h('span','',T('rfqOpen'))]); b1.type='button';
  b1.addEventListener('click',()=>{
    logOnce();
    const url='mailto:?bcc='+encodeURIComponent(allMails.join(','))+'&subject='+encodeURIComponent(T('subject'))+'&body='+encodeURIComponent(ta.value);
    if(url.length>1900){ copyText(ta.value,T('rfqLong')); if(allMails.length) location.href='mailto:?bcc='+encodeURIComponent(allMails.join(','))+'&subject='+encodeURIComponent(T('subject')); }
    else location.href=url;
  });
  const b2=h('button','sf-btn',[icon('copy'),h('span','',T('rfqCopyMsg'))]); b2.type='button'; b2.addEventListener('click',()=>{ logOnce(); copyText(ta.value); });
  const b3=h('button','sf-btn',[icon('mail'),h('span','',T('rfqCopyMails'))]); b3.type='button'; b3.addEventListener('click',()=>copyText(allMails.join('; ')));
  foot.append(b1,b2,b3); box.append(foot);
  openModal(box);
}

/* ---------------- الاستيراد ---------------- */
const IMP = { wb:null, name:'', sheet:'', rows:[], hIdx:0, headers:[], map:{}, mode:'replace' };
const loaded = {};
function loadScript(url){
  if(loaded[url]) return loaded[url];
  return loaded[url]=new Promise((res,rej)=>{ const s=document.createElement('script'); s.src=url; s.onload=res; s.onerror=()=>{ delete loaded[url]; rej(); }; document.head.appendChild(s); });
}
const XLSX_URL='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
const EXCELJS_URL='https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js';
const ensureXLSX = () => window.XLSX ? Promise.resolve() : loadScript(XLSX_URL);

function handleFile(file){
  if(!file) return;
  ensureXLSX().then(()=>{
    const fr=new FileReader();
    fr.onload=e=>{
      try{
        const isCsv=/\.csv$/i.test(file.name);
        const wb = isCsv ? XLSX.read(new TextDecoder('utf-8').decode(e.target.result), {type:'string'}) : XLSX.read(e.target.result,{type:'array'});
        IMP.wb=wb; IMP.name=file.name; IMP.mode='replace';
        loadSheet(wb.SheetNames[0]);
      }catch(err){ console.error(err); toast(T('impFail'),3000); }
    };
    fr.onerror=()=>toast(T('impFail'),3000);
    fr.readAsArrayBuffer(file);
  }).catch(()=>toast(T('xlsxFail'),3500));
}
function loadSheet(name){
  IMP.sheet=name;
  const ws=IMP.wb.Sheets[name];
  const rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:'',raw:true,blankrows:false});
  const hIdx=rows.findIndex((r,i)=>i<15 && r.filter(c=>txt(c)!=='').length>=2);
  if(hIdx<0 || rows.length<2){ IMP.rows=[]; showImport(); return; }
  IMP.rows=rows; IMP.hIdx=hIdx; IMP.headers=rows[hIdx].map(c=>txt(c));
  IMP.map=autoMap(IMP.headers);
  showImport();
}
function autoMap(headers){
  const hk=headers.map(nkey), map={}, used=new Set();
  FIELD_ORDER.forEach(k=>{
    const f=FIELDS.find(x=>x.k===k), syn=f.syn.map(nkey);
    const i=hk.findIndex((x,idx)=>!used.has(idx) && x && syn.includes(x));
    if(i>-1){ map[k]=i; used.add(i); }
  });
  FIELD_ORDER.forEach(k=>{
    if(map[k]!=null) return;
    const f=FIELDS.find(x=>x.k===k), syn=f.syn.map(nkey).filter(s=>s.length>=3);
    const i=hk.findIndex((x,idx)=>!used.has(idx) && x && syn.some(s=>x.includes(s)));
    if(i>-1){ map[k]=i; used.add(i); }
  });
  return map;
}
function buildRecords(){
  const out=[]; const m=IMP.map;
  for(let i=IMP.hIdx+1;i<IMP.rows.length;i++){
    const row=IMP.rows[i]; const g=k=> m[k]!=null ? row[m[k]] : '';
    const part=txt(g('part')), supplier=txt(g('supplier'));
    if(!part || !supplier) continue;
    const priceCell=g('price');
    out.push({
      part, supplier, ref:g('ref'), category:g('category'), brand:g('brand'), contact:g('contact'),
      phone:cleanPhone(g('phone')), email:g('email'), city:g('city'), country:g('country'),
      price:parsePrice(priceCell), currency:normCur(g('currency'))||curFromPriceCell(priceCell)||'DZD',
      delivery:parseDays(g('delivery')), moq:g('moq'), payment:g('payment'), warranty:g('warranty'), notes:g('notes')
    });
  }
  return out;
}
function showImport(){
  const box=h('div',''); box.append(modalHead(T('impTitle')), h('p','sf-msub',IMP.name+' — '+T('impSub')));
  if(!IMP.rows.length){ box.append(h('div','sf-warn',T('impEmptyFile'))); const c=h('button','sf-btn',T('impCancel')); c.type='button'; c.addEventListener('click',closeModal); box.append(h('div','sf-mfoot',c)); openModal(box); return; }
  if(IMP.wb.SheetNames.length>1){
    const sel=h('select','sf-select'); IMP.wb.SheetNames.forEach(n=>{ const o=h('option','',n); o.value=n; sel.append(o); }); sel.value=IMP.sheet;
    sel.addEventListener('change',()=>loadSheet(sel.value));
    box.append(h('div','sf-mf',[h('label','',T('impSheet')),sel]), h('div','',' '));
  }
  const grid=h('div','sf-mgrid'); grid.style.marginTop='12px';
  const status=h('div',''), prev=h('div','sf-prev');
  const goBtn=h('button','sf-btn sf-btn-primary',[icon('check'),h('span','',T('impGo'))]); goBtn.type='button';
  const refresh=()=>{
    const recs=buildRecords(); status.innerHTML='';
    const missing=IMP.map.part==null||IMP.map.supplier==null;
    status.append(missing ? h('div','sf-warn',T('impMissing')) : h('div','sf-ok',T('impReady',{n:fmtNum(recs.length)})));
    goBtn.disabled=missing||!recs.length; goBtn.style.opacity=goBtn.disabled?.5:1;
    prev.innerHTML='';
    if(recs.length){
      const cols=['part','supplier','phone','email','price'];
      const tb=h('table'); tb.append(h('tr','',cols.map(k=>h('th','',FIELDS.find(f=>f.k===k)[S.lang]))));
      recs.slice(0,4).forEach(r=>tb.append(h('tr','',cols.map(k=>h('td','',k==='price'?(r.price==null?'—':fmtNum(r.price)+' '+curLabel(r.currency)):txt(r[k])||'—')))));
      prev.append(tb);
    }
  };
  FIELDS.forEach(f=>{
    const sel=h('select','sf-select'); const none=h('option','',T('impNone')); none.value='-1'; sel.append(none);
    IMP.headers.forEach((hd,i)=>{ if(hd===''&&i>0) return; const o=h('option','',hd||('#'+(i+1))); o.value=String(i); sel.append(o); });
    sel.value = IMP.map[f.k]!=null ? String(IMP.map[f.k]) : '-1';
    sel.addEventListener('change',()=>{ const v=Number(sel.value); if(v<0) delete IMP.map[f.k]; else IMP.map[f.k]=v; refresh(); });
    grid.append(h('div','sf-mf',[h('label','',[f[S.lang],f.req?h('b','',' *'):null]),sel]));
  });
  box.append(grid);
  const radio=h('div','sf-radio');
  [['replace','impReplace'],['append','impAppend']].forEach(([v,k])=>{
    const r=h('input'); r.type='radio'; r.name='impmode'; r.value=v; r.checked=IMP.mode===v; r.addEventListener('change',()=>{ IMP.mode=v; });
    radio.append(h('label','',[r,T(k)]));
  });
  if(!S.data.length || S.sample){ IMP.mode='replace'; } else box.append(radio);
  box.append(status, h('h3','',T('impPreview')), prev);
  goBtn.addEventListener('click',()=>{
    const recs=buildRecords().map(finalize);
    if(IMP.mode==='append' && S.data.length && !S.sample){
      const kf=r=>[r._pk,r._sk,r.price,norm(r.ref)].join('|');
      const seen=new Set(S.data.map(kf));
      recs.forEach(r=>{ const k=kf(r); if(!seen.has(k)){ seen.add(k); S.data.push(r); } });
    } else S.data=recs;
    S.sample=false; S.sel.clear(); resetFiltersSilent(); persist(); render(); closeModal(); toast(T('impDone',{n:fmtNum(recs.length)}),2600);
  });
  const cancel=h('button','sf-btn',T('impCancel')); cancel.type='button'; cancel.addEventListener('click',closeModal);
  box.append(h('div','sf-mfoot',[cancel,goBtn]));
  openModal(box);
  refresh();
}

/* ---------------- مقارنة العروض ---------------- */
function saveBlob(blob, name){
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click();
  setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); },1500);
}
const dateStr = () => new Date().toLocaleDateString(S.lang==='ar'?'ar-DZ':S.lang==='fr'?'fr-FR':'en-GB');

function buildCmp(C){
  const R=C.rows, qty=Math.max(0,Number(C.qty))||1, vat=Math.max(0,Number(C.vat))||0;
  const priced=R.filter(r=>r.price!=null);
  const mixed=new Set(priced.map(r=>r.currency)).size>1;
  const ps=priced.map(r=>r.price);
  const minP=(!mixed && ps.length>1 && Math.min(...ps)!==Math.max(...ps)) ? Math.min(...ps) : null;
  const dl=R.filter(r=>r.delivery!=null).map(r=>r.delivery);
  const minD=(dl.length>1 && Math.min(...dl)!==Math.max(...dl)) ? Math.min(...dl) : null;
  const rt=R.map(getRating), maxR=Math.max(...rt), topR=(maxR>0 && new Set(rt).size>1) ? maxR : null;
  const partsDiffer=new Set(R.map(r=>r._pk)).size>1;
  const isMin=r=>minP!=null && r.price===minP;
  const cell=(t,cls,badge,ltr)=>({ t:(t==null||t==='')?'—':String(t), cls:cls||'', badge:badge||'', ltr:!!ltr });
  const row=(label,fn)=>({ label, cells:R.map(fn) });
  const rows=[];
  rows.push(row(T('rowPart'),r=>cell(r.part+(r.ref?'  ['+r.ref+']':''))));
  rows.push(row(T('rowLoc'),r=>cell([r.city,r.country].filter(Boolean).join('  •  '))));
  rows.push(row(T('rowUnit'),r=>cell(fmtPrice(r)||T('noPrice'), isMin(r)?'best':'', isMin(r)?'★ '+T('cheapest'):'')));
  rows.push(row(vat>0?T('rowHT'):T('rowTotal'),r=>cell(r.price==null?'—':fmtNum(r.price*qty)+' '+curLabel(r.currency), isMin(r)?'best':'')));
  if(vat>0) rows.push(row(T('rowTTC')+' ('+vat+'%)',r=>cell(r.price==null?'—':fmtNum(r.price*qty*(1+vat/100))+' '+curLabel(r.currency), isMin(r)?'best':'')));
  rows.push(row(T('rowDiff'),r=>cell(r.price==null||minP==null||isMin(r)?'—':'+'+((r.price/minP-1)*100).toFixed(1)+' %')));
  rows.push(row(T('rowDelivery'),r=>{ const fast=minD!=null && r.delivery===minD; return cell(fmtDays(r.delivery), fast?'fast':'', fast?'⚡ '+T('fastest'):''); }));
  rows.push(row(T('rowMoq'),r=>{ const m=parseInt((String(r.moq).match(/\d+/)||[])[0],10); const warn=!isNaN(m) && qty<m; return cell(r.moq?(r.moq+(warn?'  ⚠':'')):'', warn?'warn':''); }));
  rows.push(row(T('rowPay'),r=>cell(r.payment)));
  rows.push(row(T('rowWar'),r=>cell(r.warranty)));
  rows.push(row(T('rowRating'),r=>{ const v=getRating(r); const top=topR!=null && v===topR; return cell(starText(v), top?'top':'', top?T('topRated'):''); }));
  rows.push(row(T('rowPhone'),r=>cell(r.phones[0],'','',true)));
  rows.push(row(T('rowEmail'),r=>cell(r.emails[0],'','',true)));
  rows.push(row(T('rowNotes'),r=>cell(r.notes)));
  return { qty, vat, mixed, partsDiffer, moqWarn:rows.some(x=>x.cells.some(c=>c.cls==='warn')),
    head:R.map(r=>({ id:r.id, name:r.supplier, city:r.city, contact:r.contact })), rows };
}
const partTitle = C => [...new Set(C.rows.map(r=>r.part))].join('  /  ');
const winnerName = C => { const r=C.rows.find(x=>x.id===C.winner); return r ? r.supplier : T('cmpNoWinner'); };

function openCompare(){
  const sel=selected();
  if(sel.length<2){ toast(T('cmpMin'),2600); return; }
  if(sel.length>4){ toast(T('cmpMax'),2600); return; }
  const rows=sel.slice().sort((a,b)=>(a.price==null)-(b.price==null) || (a.price-b.price));
  const me=meGet();
  const C={ rows, qty:1, vat:0, name:me.name||'', dept:me.company||'', winner:null, reason:'' };

  const box=h('div','');
  box.append(modalHead(T('cmpTitle')), h('p','sf-msub',T('cmpSub')));

  const grid=h('div','sf-mgrid sf-cmp-inputs');
  const inp=(label,key,type,extra)=>{ const i=h('input','sf-mini'); i.type=type||'text'; i.value=C[key]; if(extra) Object.assign(i,extra);
    i.addEventListener('input',()=>{ C[key]=i.value; if(key==='name') meSet({name:i.value}); if(key==='dept') meSet({company:i.value}); if(key==='qty'||key==='vat') drawTable(); });
    return h('div','sf-mf',[h('label','',label),i]); };
  grid.append(inp(T('cmpQty'),'qty','number',{min:'1'}), inp(T('cmpVat'),'vat','number',{min:'0',step:'any'}), inp(T('cmpName'),'name'), inp(T('cmpDept'),'dept'));
  box.append(grid);

  const notes=h('div',''); box.append(notes);
  const wrap=h('div','sf-cmp-wrap'); box.append(wrap);

  box.append(h('h3','sf-h3',T('cmpWinner')));
  const winEl=h('div','sf-winner'); box.append(winEl);
  box.append(h('h3','sf-h3',T('cmpReason')));
  const ta=h('textarea','sf-ta'); ta.style.minHeight='90px'; ta.placeholder=T('cmpReasonPh'); ta.addEventListener('input',()=>{ C.reason=ta.value; });
  box.append(ta);

  const foot=h('div','sf-mfoot');
  const mkb=(ic,label,fn,cls)=>{ const b=h('button','sf-btn '+(cls||''),[icon(ic),h('span','',label)]); b.type='button'; b.addEventListener('click',fn); return b; };
  foot.append(mkb('copy',T('cmpCopy'),()=>copyText(cmpText(C,buildCmp(C)))), mkb('download',T('cmpXlsx'),()=>cmpXlsx(C,buildCmp(C))), mkb('print',T('cmpPdf'),()=>cmpPdf(C,buildCmp(C)),'sf-btn-primary'));
  box.append(foot);

  function drawTable(){
    const M=buildCmp(C);
    notes.innerHTML='';
    if(M.mixed) notes.append(h('div','sf-warn',T('cmpMixed')));
    if(M.partsDiffer) notes.append(h('div','sf-warn sf-warn-soft',T('cmpDiffParts')));
    if(M.moqWarn) notes.append(h('div','sf-warn',T('cmpMoqWarn')));
    wrap.innerHTML='';
    const tb=h('table','sf-cmp');
    const trh=h('tr','',[h('th','sf-corner','')]);
    M.head.forEach(hd=>{
      const rad=h('input'); rad.type='radio'; rad.name='cmpwin'; rad.checked=C.winner===hd.id;
      rad.addEventListener('change',()=>{ C.winner=hd.id; drawTable(); });
      trh.append(h('th','sf-sup-th'+(C.winner===hd.id?' win':''),[ h('div','sf-th-name',hd.name), hd.city?h('div','sf-th-sub',hd.city):null, h('label','sf-pick',[rad,h('span','',T('cmpChoose'))]) ]));
    });
    tb.append(h('thead','',trh));
    const tbody=h('tbody','');
    M.rows.forEach(r=>tbody.append(h('tr','',[ h('th','sf-lbl',r.label), ...r.cells.map(c=>h('td','sf-c '+c.cls,[ Object.assign(h('span','sf-c-t',c.t), c.ltr?{dir:'ltr'}:{}), c.badge?h('span','sf-badge '+c.cls,c.badge):null ])) ])));
    tb.append(tbody); wrap.append(tb);
    winEl.textContent = C.winner ? '✔ '+winnerName(C) : winnerName(C);
    winEl.classList.toggle('on',!!C.winner);
  }
  drawTable();
  openModal(box,true);
}

function cmpText(C,M){
  const L=[T('repTitle'),'',T('rowPart')+': '+partTitle(C),T('repQty')+': '+M.qty,T('repDate')+': '+dateStr(),''];
  L.push([''].concat(M.head.map(h=>h.name)).join(' | '));
  M.rows.forEach(r=>L.push(r.label+': '+r.cells.map(c=>c.t+(c.badge?' ('+c.badge.replace(/^[★⚡]\s*/,'')+')':'')).join(' | ')));
  L.push('',T('cmpWinner')+': '+winnerName(C)); if(C.reason.trim()) L.push(T('cmpReason')+': '+C.reason.trim());
  if(C.name) L.push(T('repBy')+': '+C.name+(C.dept?' — '+C.dept:''));
  return L.join('\n');
}

/* ---- محضر PDF (طباعة → حفظ كـ PDF) ---- */
function reportHTML(C,M){
  const dir=S.lang==='ar'?'rtl':'ltr';
  const th=M.head.map(hd=>'<th class="'+(C.winner===hd.id?'win':'')+'">'+esc(hd.name)+(hd.city?'<small>'+esc(hd.city)+'</small>':'')+(C.winner===hd.id?'<em>✔ '+esc(T('cmpWinner'))+'</em>':'')+'</th>').join('');
  const body=M.rows.map(r=>'<tr><th>'+esc(r.label)+'</th>'+r.cells.map(c=>'<td class="'+c.cls+'">'+(c.ltr?'<span dir="ltr">'+esc(c.t)+'</span>':esc(c.t))+(c.badge?'<b>'+esc(c.badge)+'</b>':'')+'</td>').join('')+'</tr>').join('');
  const sig=[T('repSigA')+(C.name?'<br><span>'+esc(C.name)+'</span>':''),T('repSigB'),T('repSigC')].map(s=>'<div class="sig"><p>'+s+'</p><i>'+esc(T('repSign'))+'</i></div>').join('');
  return '<!DOCTYPE html><html lang="'+S.lang+'" dir="'+dir+'"><head><meta charset="utf-8"><title>'+esc(T('repTitle'))+'</title>'
  +'<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">'
  +'<style>@page{size:A4 landscape;margin:12mm}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}'
  +'body{margin:0;font-family:'+(S.lang==='ar'?"'Tajawal'":"'Inter'")+',sans-serif;color:#1E2F40;font-size:12px}'
  +'.head{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #2F5770;padding-bottom:10px;margin-bottom:14px}'
  +'h1{margin:0;font-size:22px;color:#2F5770}.meta{font-size:12px;color:#64768A;text-align:'+(dir==='rtl'?'left':'right')+';line-height:1.7}'
  +'.info{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px}.info div{background:#E3EEF4;border-radius:8px;padding:8px 12px}.info span{display:block;font-size:10px;color:#64768A;font-weight:700}.info b{font-size:13px}'
  +'table{width:100%;border-collapse:collapse;table-layout:fixed}th,td{border:1px solid #D5DFE8;padding:7px 9px;text-align:center;vertical-align:middle;word-break:break-word}'
  +'thead th{background:#2F5770;color:#fff;font-size:13px}thead th small{display:block;font-weight:500;opacity:.85;font-size:10px}thead th em{display:block;font-style:normal;font-size:10px;margin-top:3px}thead th.win{background:#2E8A5B}'
  +'tbody th{background:#E3EEF4;text-align:'+(dir==='rtl'?'right':'left')+';width:17%;font-size:11px}td.best{background:#DDF3E4;font-weight:800;color:#1E6B45}td.fast{background:#DCEAFB;font-weight:700}td.top{background:#FDF0DA;font-weight:700}td.warn{background:#FBE4E2;color:#B4423C;font-weight:700}'
  +'td b{display:block;font-size:9px;margin-top:2px}.dec{margin-top:14px;display:grid;grid-template-columns:1fr 2fr;gap:8px}.dec div{border:1px solid #D5DFE8;border-radius:8px;padding:9px 12px;min-height:44px}.dec span{display:block;font-size:10px;color:#64768A;font-weight:700;margin-bottom:3px}'
  +'.sigs{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:18px}.sig{border:1px solid #D5DFE8;border-radius:8px;height:92px;padding:8px 12px;position:relative}.sig p{margin:0;font-weight:800;font-size:12px}.sig p span{font-weight:500;color:#64768A}.sig i{position:absolute;bottom:6px;font-size:9px;color:#9AA9B8;font-style:normal}'
  +'.foot{margin-top:10px;font-size:9px;color:#9AA9B8;text-align:center}</style></head><body>'
  +'<div class="head"><h1>'+esc(T('repTitle'))+'</h1><div class="meta">'+esc(T('repDate'))+': '+esc(dateStr())+(C.dept?'<br>'+esc(T('repDept'))+': '+esc(C.dept):'')+'</div></div>'
  +'<div class="info"><div style="grid-column:span 3"><span>'+esc(T('rowPart'))+'</span><b>'+esc(partTitle(C))+'</b></div><div><span>'+esc(T('repQty'))+'</span><b>'+esc(M.qty)+(M.vat>0?'  •  TVA '+esc(M.vat)+'%':'')+'</b></div></div>'
  +'<table><thead><tr><th style="background:#fff;border-color:#fff"></th>'+th+'</tr></thead><tbody>'+body+'</tbody></table>'
  +'<div class="dec"><div><span>'+esc(T('cmpWinner'))+'</span><b>'+esc(winnerName(C))+'</b></div><div><span>'+esc(T('cmpReason'))+'</span>'+esc(C.reason)+'</div></div>'
  +'<div class="sigs">'+sig+'</div><div class="foot">'+esc(T('repFoot'))+'</div>'
  +'<script>window.addEventListener("load",function(){var go=function(){setTimeout(function(){window.print()},250)};if(document.fonts&&document.fonts.ready){document.fonts.ready.then(go)}else{go()}});<\/script></body></html>';
}
function cmpPdf(C,M){
  const w=window.open('','_blank');
  if(!w){ toast(T('popup'),3500); return; }
  w.document.open(); w.document.write(reportHTML(C,M)); w.document.close();
}

/* ---- Excel منسّق ---- */
async function cmpXlsx(C,M){
  try{ await loadScript(EXCELJS_URL); }catch(e){ return cmpXlsxPlain(C,M); }
  try{
    const wb=new ExcelJS.Workbook();
    const ws=wb.addWorksheet(T('cmpSheet'),{ views:[{ rightToLeft:S.lang==='ar', showGridLines:false }] });
    const n=M.head.length+1;
    ws.columns=[{width:28}].concat(M.head.map(()=>({width:32})));
    const thin={style:'thin',color:{argb:'FFD5DFE8'}}, border={top:thin,left:thin,bottom:thin,right:thin};
    const fill=argb=>({type:'pattern',pattern:'solid',fgColor:{argb}});
    const fills={ best:['FFDDF3E4','FF1E6B45'], fast:['FFDCEAFB','FF1F4E86'], top:['FFFDF0DA','FF7A5A08'], warn:['FFFBE4E2','FFB4423C'] };
    let r=1;
    ws.mergeCells(r,1,r,n); const t=ws.getCell(r,1); t.value=T('repTitle'); t.font={bold:true,size:16,color:{argb:'FFFFFFFF'}}; t.fill=fill('FF2F5770'); t.alignment={vertical:'middle',horizontal:'center'}; ws.getRow(r).height=32; r++;
    const info=[[T('repDate'),dateStr()],[T('rowPart'),partTitle(C)],[T('repQty'),M.qty+(M.vat>0?'  •  TVA '+M.vat+'%':'')]];
    if(C.name) info.push([T('repBy'),C.name]); if(C.dept) info.push([T('repDept'),C.dept]);
    info.forEach(([a,b])=>{ const c1=ws.getCell(r,1); c1.value=a; c1.font={bold:true,color:{argb:'FF64768A'}}; c1.fill=fill('FFE3EEF4'); ws.mergeCells(r,2,r,n); const c2=ws.getCell(r,2); c2.value=b; c2.font={bold:true}; r++; });
    r++;
    const hr=r; ws.getCell(hr,1).value='';
    M.head.forEach((hd,i)=>{ const c=ws.getCell(hr,i+2); c.value=hd.name+(hd.city?'\n'+hd.city:'')+(C.winner===hd.id?'\n✔ '+T('cmpWinner'):''); c.font={bold:true,color:{argb:'FFFFFFFF'}}; c.fill=fill(C.winner===hd.id?'FF2E8A5B':'FF2F5770'); c.alignment={wrapText:true,vertical:'middle',horizontal:'center'}; c.border=border; });
    ws.getRow(hr).height=48; r++;
    M.rows.forEach(row=>{
      const l=ws.getCell(r,1); l.value=row.label; l.font={bold:true}; l.fill=fill('FFE3EEF4'); l.border=border; l.alignment={vertical:'middle',wrapText:true,horizontal:S.lang==='ar'?'right':'left'};
      row.cells.forEach((c,i)=>{
        const cell=ws.getCell(r,i+2); cell.value=c.t+(c.badge?'\n'+c.badge:''); cell.border=border; cell.alignment={wrapText:true,vertical:'middle',horizontal:'center'};
        const f=fills[c.cls]; if(f){ cell.fill=fill(f[0]); cell.font={bold:true,color:{argb:f[1]}}; }
      });
      ws.getRow(r).height=row.label===T('rowNotes')?40:26; r++;
    });
    r++;
    ws.getCell(r,1).value=T('cmpWinner'); ws.getCell(r,1).font={bold:true}; ws.mergeCells(r,2,r,n); ws.getCell(r,2).value=winnerName(C); ws.getCell(r,2).font={bold:true,color:{argb:'FF2E8A5B'}}; r++;
    ws.getCell(r,1).value=T('cmpReason'); ws.getCell(r,1).font={bold:true}; ws.mergeCells(r,2,r,n); ws.getCell(r,2).value=C.reason; ws.getCell(r,2).alignment={wrapText:true,vertical:'top'}; ws.getRow(r).height=42;
    const buf=await wb.xlsx.writeBuffer();
    saveBlob(new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),T('cmpFile')+'.xlsx');
    toast(T('cmpDone'));
  }catch(e){ console.error(e); cmpXlsxPlain(C,M); }
}
function cmpXlsxPlain(C,M){
  ensureXLSX().then(()=>{
    const aoa=[[T('repTitle')],[T('repDate'),dateStr()],[T('rowPart'),partTitle(C)],[T('repQty'),M.qty],[],[''].concat(M.head.map(h=>h.name))];
    M.rows.forEach(r=>aoa.push([r.label].concat(r.cells.map(c=>c.t))));
    aoa.push([],[T('cmpWinner'),winnerName(C)],[T('cmpReason'),C.reason]);
    const ws=XLSX.utils.aoa_to_sheet(aoa); ws['!cols']=[{wch:26}].concat(M.head.map(()=>({wch:30})));
    const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,T('cmpSheet')); XLSX.writeFile(wb,T('cmpFile')+'.xlsx');
  }).catch(()=>toast(T('xlsxFail'),3500));
}

/* ---------------- التصدير والقالب ---------------- */
function needXLSX(){ if(window.XLSX) return true; toast(T('xlsxFail'),3500); return false; }
function exportXlsx(rows){
  ensureXLSX().then(()=>{
    rows = rows || results();
    if(!rows.length){ toast(T('nothing')); return; }
    const cols=FIELDS.map(f=>f.k);
    const aoa=[FIELDS.map(f=>f[S.lang]).concat([T('rowRating')])];
    rows.forEach(r=>aoa.push(cols.map(k=> k==='price'||k==='delivery' ? (r[k]==null?'':r[k]) : r[k]).concat([getRating(r)||''])));
    const ws=XLSX.utils.aoa_to_sheet(aoa); ws['!cols']=FIELDS.map(f=>({wch:f.k==='part'||f.k==='supplier'||f.k==='email'?32:16})).concat([{wch:10}]);
    if(S.lang==='ar') ws['!views']=[{rightToLeft:true}];
    const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,T('expName').slice(0,30));
    XLSX.writeFile(wb,T('expName')+'.xlsx');
  }).catch(()=>toast(T('xlsxFail'),3500));
}
/* القالب المرجعي دائمًا بالفرنسية */
function downloadTemplate(){
  ensureXLSX().then(()=>{
    const aoa=[FIELDS.map(f=>f.fr),
      ['Roulement 22320 CC/W33','22320-CC-W33','Roulements','SKF','Société Exemple SARL','M. Ahmed','0550123456','contact@exemple.dz','Sétif','Algérie',48000,'DZD',5,'1','Paiement à 30 jours','1 an','Prix toutes taxes comprises'],
      ['Courroie trapézoïdale SPB 3350','SPB-3350','Courroies et chaînes','Optibelt','Ets Modèle','Mme Sara','0661234567','ventes@modele.dz','Oran','Algérie',6500,'DZD',3,'2','Paiement à la livraison','6 mois',''],
      ['Variateur de fréquence 90 kW','ACS880-90','Électricité','ABB','Import Pro','M. Karim','0770123456','info@importpro.dz','Alger','Allemagne',9800,'EUR',21,'1','50 % à la commande','2 ans','Prix en euros']];
    const ws=XLSX.utils.aoa_to_sheet(aoa); ws['!cols']=FIELDS.map(()=>({wch:24}));
    const help=[['Aide'],['Colonnes obligatoires : Désignation et Fournisseur.'],['Une ligne = une offre (une pièce chez un fournisseur). Un même fournisseur peut apparaître sur plusieurs lignes.'],['Devise : DZD, EUR ou USD (DZD par défaut).'],['Délai de livraison : nombre de jours.'],['Les intitulés de colonnes peuvent être en arabe, français ou anglais : ils sont détectés automatiquement.']];
    const ws2=XLSX.utils.aoa_to_sheet(help); ws2['!cols']=[{wch:110}];
    const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,'Fournisseurs'); XLSX.utils.book_append_sheet(wb,ws2,'Aide');
    XLSX.writeFile(wb,'modele_fournisseurs.xlsx');
  }).catch(()=>toast(T('xlsxFail'),3500));
}

/* ---------------- اللغة ---------------- */
function applyLang(){
  const html=document.documentElement; html.lang=S.lang; html.dir=S.lang==='ar'?'rtl':'ltr';
  document.title=T('title')+' | Dr Soufiane Merabti';
  document.querySelectorAll('[data-i]').forEach(e=>{ e.textContent=T(e.getAttribute('data-i')); });
  document.querySelectorAll('[data-ip]').forEach(e=>{ e.placeholder=T(e.getAttribute('data-ip')); });
  document.querySelectorAll('#sfLangs button').forEach(b=>b.classList.toggle('on',b.dataset.l===S.lang));
  render(); renderBar(); setCloud(CL.state);
}
function setLang(l){
  if(!LANGS.includes(l)||l===S.lang) return;
  S.lang=l; localStorage.setItem(LS.lang,l);
  closeModal();
  if(S.sample){ S.data=sampleData(l).map(finalize); S.sel.clear(); resetFiltersSilent(); }
  applyLang();
}
function clearAll(){
  if(!S.data.length) return;
  if(confirm(T('confirmClear'))){ S.data=[]; S.sample=false; S.sel.clear(); resetFiltersSilent(); persist(); render(); toast(T('cleared')); }
}

/* ---------------- السحابة (Firebase Firestore) ---------------- */
const CLOUD_CHUNK = 250;                       // عدد العروض في كل وثيقة (لتقليل عدد القراءات)
const fbOK = () => !!(window.fbAuth && window.fbDb && window.firebase);
const userDoc = () => fbDb.collection('users').doc(CL.uid);
const serverTs = () => firebase.firestore.FieldValue.serverTimestamp();
const clean = o => JSON.parse(JSON.stringify(o));
const sigOf = list => list.length+':'+list.reduce((a,r)=>a+(Number(r.price)||0)+String(r.part||'').length+String(r.supplier||'').length,0);
function debounce(key,fn,ms){ clearTimeout(CL.timers[key]); CL.timers[key]=setTimeout(fn,ms||700); }

function setCloud(state, extra){
  CL.state=state;
  const el=$('sfCloud'); if(!el) return;
  const map={ off:'cloudOff', out:'cloudOut', loading:'cloudLoading', saving:'cloudSaving', saved:'cloudSaved', err:'cloudErr' };
  el.className='sf-cloud '+state;
  el.textContent='☁ '+T(map[state])+(extra?' — '+extra:'');
  if(state==='out') el.setAttribute('href','../../'); else el.removeAttribute('href');
}
function cloudFail(e){ console.error(e); setCloud('err', e && e.code==='permission-denied' ? T('cloudRules') : ''); }

async function cloudLoadData(){
  const snap=await userDoc().collection('suppliers').orderBy('i').get();
  const out=[]; snap.forEach(d=>{ (d.data().records||[]).forEach(r=>out.push(r)); }); return out;
}
async function cloudSaveData(){
  if(!fbOK() || !CL.uid || S.sample) return;
  setCloud('saving');
  try{
    const col=userDoc().collection('suppliers');
    const old=await col.get();
    const recs=clean(S.data.map(baseOf));
    const batch=fbDb.batch(); const keep=new Set();
    for(let i=0;i*CLOUD_CHUNK<recs.length;i++){
      const id='c'+String(i).padStart(4,'0'); keep.add(id);
      batch.set(col.doc(id),{ i, n:Math.min(CLOUD_CHUNK,recs.length-i*CLOUD_CHUNK), records:recs.slice(i*CLOUD_CHUNK,(i+1)*CLOUD_CHUNK), updatedAt:serverTs() });
    }
    old.forEach(d=>{ if(!keep.has(d.id)) batch.delete(d.ref); });
    await batch.commit();
    try{ localStorage.removeItem(LS.unsynced); }catch(e){}
    setCloud('saved');
  }catch(e){ cloudFail(e); }
}
async function cloudLoadRatings(){ const d=await userDoc().collection('supplierRatings').doc('all').get(); return d.exists ? (d.data().map||{}) : {}; }
function cloudSaveRatings(){
  if(!fbOK() || !CL.uid) return;
  debounce('rat',async()=>{
    try{ setCloud('saving'); await userDoc().collection('supplierRatings').doc('all').set({ map:clean(S.ratings), updatedAt:serverTs() }); setCloud('saved'); }catch(e){ cloudFail(e); }
  });
}
async function cloudLoadSettings(){ const d=await userDoc().collection('settings').doc('supplierFinder').get(); return d.exists ? d.data() : {}; }
function cloudSaveSettings(){
  if(!fbOK() || !CL.uid) return;
  debounce('set',async()=>{ try{ await userDoc().collection('settings').doc('supplierFinder').set({ me:meGet(), cc:S.cc, updatedAt:serverTs() },{merge:true}); }catch(e){ console.error(e); } });
}

async function cloudSync(){
  setCloud('loading');
  try{
    const [remote, rat, cfg] = await Promise.all([cloudLoadData(), cloudLoadRatings(), cloudLoadSettings()]);
    const localReal = !S.sample && S.data.length>0;
    const unsynced = localStorage.getItem(LS.unsynced)==='1';
    let useRemote = remote.length>0, uploadLocal = false;
    if(remote.length && localReal && unsynced && sigOf(remote)!==sigOf(S.data)){
      if(confirm(T('cloudConflict'))) useRemote=true; else { useRemote=false; uploadLocal=true; }
    } else if(!remote.length && localReal){ uploadLocal=true; }
    if(useRemote){
      S.data=remote.map(r=>finalize(Object.assign({},r))); S.sample=false; S.sel.clear(); resetFiltersSilent();
      persistLocal(); try{ localStorage.removeItem(LS.unsynced); }catch(e){}
    }
    // التقييمات: نجمع المحلي مع السحابي (السحابة تتقدّم عند التعارض)
    const merged=Object.assign({}, S.ratings, rat); S.ratings=merged;
    try{ localStorage.setItem(LS.rate, JSON.stringify(merged)); }catch(e){}
    // الإعدادات (الاسم/المصلحة/مفتاح الدولة)
    if(cfg.me){ try{ localStorage.setItem(LS.me, JSON.stringify(cfg.me)); }catch(e){} }
    if(cfg.cc){ S.cc=String(cfg.cc); $('sfCC').value=S.cc; try{ localStorage.setItem(LS.cc,S.cc); }catch(e){} }
    render();
    if(uploadLocal) await cloudSaveData();
    if(JSON.stringify(clean(rat))!==JSON.stringify(clean(merged))) cloudSaveRatings();
    if(!uploadLocal) setCloud('saved');
  }catch(e){ cloudFail(e); }
}
function initCloud(){
  if(!fbOK()){ setCloud('off'); return; }
  setCloud('out');
  fbAuth.onAuthStateChanged(async u=>{
    CL.uid = u ? u.uid : null;
    if(!u){ setCloud('out'); return; }
    await cloudSync();
  });
}

/* ---- سجل طلبات عروض الأسعار ومحاضر المقارنة ---- */
async function cloudAdd(coll,data){
  try{ await userDoc().collection(coll).add(Object.assign({ createdAt:serverTs(), lang:S.lang }, clean(data))); return true; }
  catch(e){ cloudFail(e); return false; }
}
function logRfq(parts,sups,message,st){
  if(!fbOK() || !CL.uid) return;                 // اختياري: يُسجَّل فقط عند تسجيل الدخول
  cloudAdd('supplierRfqs',{
    title:parts.map(p=>p.name).join(' / ').slice(0,300),
    parts:parts.map(p=>({name:p.name,ref:p.ref||'',qty:String(p.qty)})),
    suppliers:sups.map(s=>({name:s.name,emails:[...s.emails]})),
    message, by:st.name||'', company:st.company||''
  });
}
async function saveComparison(C,M){
  if(!fbOK() || !CL.uid){ toast(T('cloudNeedLogin'),3000); return; }
  const win=C.rows.find(r=>r.id===C.winner);
  const ok=await cloudAdd('supplierComparisons',{
    title:partTitle(C).slice(0,300), qty:M.qty, vat:M.vat, winner:win?win.supplier:'', winnerSk:win?win._sk:'', reason:C.reason||'',
    by:C.name||'', dept:C.dept||'', offers:C.rows.map(r=>Object.assign(baseOf(r),{ sk:r._sk }))
  });
  if(ok){ toast(T('cmpSaved')); setCloud('saved'); }
}
function cmpFromDoc(x){
  const rows=(x.offers||[]).map(o=>{ const b=Object.assign({},o); delete b.sk; return finalize(b); });
  const win=rows.find(r=>r._sk===x.winnerSk);
  return { rows, qty:x.qty||1, vat:x.vat||0, name:x.by||'', dept:x.dept||'', winner:win?win.id:null, reason:x.reason||'' };
}
const fmtTs = ts => (ts && ts.toDate) ? ts.toDate().toLocaleString(S.lang==='ar'?'ar-DZ':S.lang==='fr'?'fr-FR':'en-GB') : '';

function histItem(doc, kind){
  const x=doc.data();
  const box=h('div','sf-hist-item');
  const info=h('div','sf-hist-info',[ h('b','',x.title||'—'), h('div','sf-meta',[fmtTs(x.createdAt), kind==='cmp' ? (x.winner?'  •  ✔ '+x.winner:'') : '  •  '+((x.suppliers||[]).length)+' '+T('histSup')].join('')) ]);
  const acts=h('div','sf-hist-acts');
  const btn=(ic,label,fn,cls)=>{ const b=h('button','sf-btn sf-btn-sm '+(cls||''),[icon(ic),h('span','',label)]); b.type='button'; b.addEventListener('click',fn); b.querySelector('span').style.display='inline'; return b; };
  if(kind==='cmp'){
    acts.append(btn('print','PDF',()=>{ const C=cmpFromDoc(x); cmpPdf(C,buildCmp(C)); }),
                btn('download','Excel',()=>{ const C=cmpFromDoc(x); cmpXlsx(C,buildCmp(C)); }),
                btn('copy',T('cmpCopy'),()=>{ const C=cmpFromDoc(x); copyText(cmpText(C,buildCmp(C))); }));
  } else acts.append(btn('copy',T('rfqCopyMsg'),()=>copyText(x.message||'')));
  acts.append(btn('trash',T('histDelete'),async()=>{ if(!confirm(T('histConfirm'))) return; try{ await doc.ref.delete(); box.remove(); }catch(e){ cloudFail(e); } },'sf-btn-danger'));
  box.append(info,acts); paintIcons(box); return box;
}
async function openHistory(){
  if(!fbOK() || !CL.uid){ toast(T('cloudNeedLogin'),3000); return; }
  const box=h('div',''); box.append(modalHead(T('histTitle')));
  const body=h('div','sf-hist',T('cloudLoading')); box.append(body);
  openModal(box,true);
  try{
    const q=c=>userDoc().collection(c).orderBy('createdAt','desc').limit(30).get();
    const [a,b]=await Promise.all([q('supplierComparisons'),q('supplierRfqs')]);
    body.innerHTML='';
    body.append(h('h3','sf-h3',T('histCmp')+' ('+a.size+')')); a.forEach(d=>body.append(histItem(d,'cmp'))); if(!a.size) body.append(h('div','sf-none',T('histEmpty')));
    body.append(h('h3','sf-h3',T('histRfq')+' ('+b.size+')')); b.forEach(d=>body.append(histItem(d,'rfq'))); if(!b.size) body.append(h('div','sf-none',T('histEmpty')));
  }catch(e){ body.textContent=''; body.append(h('div','sf-warn',T('cloudErr')+(e&&e.code==='permission-denied'?' — '+T('cloudRules'):''))); console.error(e); }
}

/* ---------------- الأحداث ---------------- */
let qTimer;
$('sfQ').addEventListener('input',e=>{
  S.q=e.target.value; $('sfQClear').classList.toggle('show',!!S.q);
  clearTimeout(qTimer); qTimer=setTimeout(()=>{ renderFacets(); renderResults(); },120);
});
$('sfQClear').addEventListener('click',()=>{ S.q=''; $('sfQ').value=''; $('sfQClear').classList.remove('show'); renderFacets(); renderResults(); $('sfQ').focus(); });
$('sfPartQ').addEventListener('input',e=>{ S.partQ=e.target.value; renderFacets(); });
[['sfCity','city'],['sfSupplier','supplier'],['sfCurrency','currency'],['sfRating','rmin']].forEach(([id,k])=>$(id).addEventListener('change',e=>{ S.f[k]=e.target.value; renderResults(); }));
[['sfPmin','pmin'],['sfPmax','pmax'],['sfDmax','dmax']].forEach(([id,k])=>$(id).addEventListener('input',e=>{ S.f[k]=e.target.value; renderResults(); }));
$('sfHasEmail').addEventListener('change',e=>{ S.f.hasEmail=e.target.checked; renderResults(); });
$('sfHasPhone').addEventListener('change',e=>{ S.f.hasPhone=e.target.checked; renderResults(); });
$('sfResetF').addEventListener('click',resetFilters);
$('sfSort').addEventListener('change',e=>{ S.sort=e.target.value; renderResults(); });
$('sfGroup').addEventListener('change',e=>{ S.group=e.target.checked; renderResults(); });
$('sfAll').addEventListener('change',e=>{ const res=results(); res.forEach(r=>e.target.checked?S.sel.add(r.id):S.sel.delete(r.id)); renderResults(); });
$('sfCC').value=S.cc;
$('sfCC').addEventListener('input',e=>{ S.cc=e.target.value.replace(/\D/g,'')||'213'; try{localStorage.setItem(LS.cc,S.cc);}catch(x){} cloudSaveSettings(); renderResults(); });

['sfUpload','sfPick'].forEach(id=>$(id).addEventListener('click',()=>$('sfFile').click()));
$('sfFile').addEventListener('change',e=>{ handleFile(e.target.files[0]); e.target.value=''; });
['sfTpl','sfTpl2','sfTplS'].forEach(id=>$(id).addEventListener('click',downloadTemplate));
$('sfExport').addEventListener('click',()=>exportXlsx());
['sfPrint','sfPrintS'].forEach(id=>$(id).addEventListener('click',()=>window.print()));
$('sfDemo').addEventListener('click',()=>{ S.data=sampleData(S.lang).map(finalize); S.sample=true; persist(); render(); });
['sfClear','sfClearS'].forEach(id=>$(id).addEventListener('click',clearAll));
document.querySelectorAll('#sfLangs button').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.l)));

$('sfFiltBtn').addEventListener('click',()=>$('sfSide').classList.add('open'));
$('sfSideClose').addEventListener('click',()=>$('sfSide').classList.remove('open'));
$('sfModal').addEventListener('click',e=>{ if(e.target===$('sfModal')) closeModal(); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ closeModal(); $('sfSide').classList.remove('open'); } });

let dragDepth=0;
const hasFiles=e=>e.dataTransfer && [...(e.dataTransfer.types||[])].includes('Files');
window.addEventListener('dragenter',e=>{ if(!hasFiles(e)) return; dragDepth++; $('sfDrop').classList.add('show'); });
window.addEventListener('dragleave',e=>{ if(!hasFiles(e)) return; dragDepth=Math.max(0,dragDepth-1); if(!dragDepth) $('sfDrop').classList.remove('show'); });
window.addEventListener('dragover',e=>{ if(hasFiles(e)) e.preventDefault(); });
window.addEventListener('drop',e=>{ if(!hasFiles(e)) return; e.preventDefault(); dragDepth=0; $('sfDrop').classList.remove('show'); handleFile(e.dataTransfer.files[0]); });

/* ---------------- طيّ أقسام الفلاتر ---------------- */
function initFolds(){
  let st={}; try{ st=JSON.parse(localStorage.getItem('sf_fopen')||'{}')||{}; }catch(e){}
  document.querySelectorAll('details.sf-fbox[data-k]').forEach(d=>{
    const k=d.dataset.k; if(k in st) d.open=!!st[k];
    d.addEventListener('toggle',()=>{ st[k]=d.open; try{ localStorage.setItem('sf_fopen',JSON.stringify(st)); }catch(e){} });
  });
}

/* ---------------- البداية ---------------- */
initFolds();
loadStored();
paintIcons();
applyLang();
initCloud();
