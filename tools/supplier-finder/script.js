/* ==========================================================
   دليل الموردين وقطع الغيار — منطق الأداة
   - البيانات تُخزَّن محليًا على جهاز المستخدم (localStorage)
   - قراءة Excel/CSV عبر مكتبة SheetJS
   ========================================================== */

/* ---------------- الحقول ومرادفات الأعمدة ---------------- */
const FIELDS = [
  { k:'part',     req:true, ar:'اسم القطعة',            en:'Part name',
    syn:['part','partname','item','itemname','product','productname','article','designation','description','قطعة','القطعة','اسم القطعة','المنتج','المادة','البيان','الاسم','piece','produit','désignation','libellé','libelle'] },
  { k:'ref',      ar:'المرجع',                          en:'Reference / P/N',
    syn:['ref','reference','référence','partno','partnumber','pn','p/n','sku','code','المرجع','رقم القطعة','الرمز','الكود','n° pièce'] },
  { k:'category', ar:'الصنف',                           en:'Category',
    syn:['category','famille','catégorie','categorie','type','group','الفئة','الصنف','النوع','التصنيف','العائلة'] },
  { k:'brand',    ar:'العلامة التجارية',                en:'Brand',
    syn:['brand','marque','manufacturer','make','العلامة','الماركة','العلامة التجارية','الشركة المصنعة','المصنع'] },
  { k:'supplier', req:true, ar:'المورد',                en:'Supplier',
    syn:['supplier','vendor','fournisseur','company','société','societe','المورد','اسم المورد','الشركة','المزود','مزود الخدمة','المؤسسة'] },
  { k:'contact',  ar:'المسؤول',                         en:'Contact person',
    syn:['contact','contactperson','responsable','person','المسؤول','جهة الاتصال','الشخص','المسؤول التجاري','اسم المسؤول'] },
  { k:'phone',    ar:'الهاتف',                          en:'Phone',
    syn:['phone','tel','telephone','téléphone','mobile','gsm','هاتف','الهاتف','رقم الهاتف','جوال','النقال','الجوال','tél'] },
  { k:'email',    ar:'البريد الإلكتروني',               en:'Email',
    syn:['email','e-mail','mail','courriel','البريد','الايميل','الإيميل','البريد الإلكتروني','البريد الالكتروني'] },
  { k:'city',     ar:'الولاية / المدينة',               en:'City / Wilaya',
    syn:['city','wilaya','ville','address','adresse','location','المدينة','الولاية','العنوان','الموقع','المنطقة'] },
  { k:'price',    ar:'السعر',                           en:'Price',
    syn:['price','prix','unitprice','prixunitaire','prix unitaire','cost','السعر','سعر الوحدة','الثمن','السعر الوحدوي','التكلفة'] },
  { k:'currency', ar:'العملة',                          en:'Currency',
    syn:['currency','devise','monnaie','العملة'] },
  { k:'delivery', ar:'مدة التوصيل (أيام)',              en:'Lead time (days)',
    syn:['delivery','leadtime','lead time','délai','delai','délai de livraison','مدة التوصيل','مدة التسليم','التسليم','الأجل','الاجل','التوصيل'] },
  { k:'moq',      ar:'الحد الأدنى للطلب',               en:'Min. order',
    syn:['moq','minqty','minimum order','min order','quantité minimale','الحد الأدنى','أقل كمية','الحد الادنى للطلب','الكمية الدنيا'] },
  { k:'notes',    ar:'ملاحظات',                         en:'Notes',
    syn:['notes','note','remarque','remarques','comment','comments','ملاحظات','ملاحظة','تعليق'] }
];
const FIELD_ORDER = ['ref','brand','supplier','contact','phone','email','city','price','currency','delivery','moq','notes','category','part'];

/* ---------------- النصوص ---------------- */
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
  selAll:'تحديد الكل', group:'تجميع حسب القطعة', results:'نتيجة',
  sPriceAsc:'الأرخص أولًا', sPriceDesc:'الأغلى أولًا', sDelivery:'الأسرع توصيلًا', sSupplier:'المورد (أبجدي)', sPart:'القطعة (أبجدي)',
  best:'الأرخص', days:'يوم', instant:'فوري', moq:'أدنى طلب', noPrice:'السعر عند الطلب',
  call:'اتصال', wa:'واتساب', copy:'نسخ', mail:'مراسلة', copied:'تم النسخ', nothing:'لا يوجد ما يُنسخ',
  offers:'عروض', min:'الأدنى', max:'الأعلى', avg:'المتوسط',
  selected:'محدد', rfq:'طلب عرض سعر', copyEmails:'نسخ البريد', copyPhones:'نسخ الأرقام', exportSel:'تصدير المحدد', clearSel:'إلغاء',
  emptyTitle:'ابدأ برفع ملف الموردين',
  emptySub:'اسحب ملف Excel أو CSV إلى هنا أو اختره من جهازك. بياناتك لا تُرسل إلى أي خادم — تبقى محفوظة على جهازك فقط.',
  emptyPick:'اختيار ملف', emptyDemo:'جرّب ببيانات تجريبية', emptyTpl:'تحميل قالب جاهز',
  emptyCols:'الأعمدة المدعومة: اسم القطعة، المرجع، الصنف، العلامة التجارية، المورد، المسؤول، الهاتف، البريد، الولاية، السعر، العملة، مدة التوصيل، الحد الأدنى للطلب، ملاحظات — بالعربية أو الفرنسية أو الإنجليزية، ويتعرّف عليها البرنامج تلقائيًا.',
  dropHere:'أفلت الملف هنا',
  noRes:'لا توجد نتائج مطابقة', noResSub:'جرّب كلمات أخرى أو خفّف الفلاتر.',
  fTxt:'بحث', fPart:'القطعة', fMinP:'السعر من', fMaxP:'السعر إلى', fDelT:'التوصيل ≤',
  // الاستيراد
  impTitle:'استيراد ملف الموردين', impSub:'تحقّق من ربط الأعمدة (تم التعرّف عليها تلقائيًا) ثم اضغط استيراد.',
  impSheet:'الورقة', impNone:'— بدون —', impReplace:'استبدال البيانات الحالية', impAppend:'إضافة إلى البيانات الحالية',
  impGo:'استيراد', impCancel:'إلغاء', impReady:'سيتم استيراد {n} سجل', impMissing:'حدّد عمودَي «اسم القطعة» و«المورد» على الأقل.',
  impPreview:'معاينة', impDone:'تم استيراد {n} سجل', impFail:'تعذّرت قراءة الملف', xlsxFail:'تعذّر تحميل مكتبة Excel — تأكد من الاتصال بالإنترنت.',
  impEmptyFile:'الملف فارغ أو لا يحتوي جدولًا واضحًا.',
  // طلب عرض السعر
  rfqTitle:'طلب عرض سعر', rfqSub:'سيُرسل الطلب إلى الموردين المحددين في نسخة مخفية (BCC) حتى لا يرى أحدهم الآخر.',
  rfqParts:'القطع والكميات', rfqQty:'الكمية', rfqName:'اسمك', rfqCompany:'المؤسسة / المصلحة', rfqPlace:'مكان التسليم',
  rfqMsg:'نص الرسالة', rfqOpen:'فتح برنامج البريد', rfqCopyMsg:'نسخ الرسالة', rfqCopyMails:'نسخ البريد',
  rfqNoMail:'{n} مورد بدون بريد إلكتروني لن يشملهم الإرسال.', rfqSuppliers:'الموردون المستلمون', rfqNoRecipients:'لا يوجد أي بريد إلكتروني بين المحدّدين.',
  rfqLong:'الرسالة طويلة على رابط البريد — تم نسخها، الصقها في بريدك.',
  subject:'طلب عرض سعر', greet:'السادة المحترمون،', hello:'تحية طيبة،',
  intro:'نرجو منكم موافاتنا بعرض سعر للقطع التالية:', qtyW:'الكمية', refW:'المرجع',
  ask:'نرجو ذكر: السعر الوحدوي، مدة التوصيل، شروط الدفع، وصلاحية العرض.', placeW:'مكان التسليم', thanks:'شكرًا لتعاونكم،',
  // أخرى
  confirmClear:'سيتم مسح كل البيانات المحفوظة على هذا الجهاز. هل تريد المتابعة؟', cleared:'تم مسح البيانات',
  storeFail:'تعذّر حفظ البيانات محليًا (الملف كبير جدًا) — ستبقى متاحة حتى تغلق الصفحة.',
  tplName:'قالب_الموردين', expName:'الموردون', supplierWord:'مورد', unitOffer:'عرض', rows:'صف',
  langBtn:'EN', da:'دج'
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
  selAll:'Select all', group:'Group by part', results:'results',
  sPriceAsc:'Cheapest first', sPriceDesc:'Most expensive first', sDelivery:'Fastest delivery', sSupplier:'Supplier (A–Z)', sPart:'Part (A–Z)',
  best:'Cheapest', days:'days', instant:'Immediate', moq:'Min. order', noPrice:'Price on request',
  call:'Call', wa:'WhatsApp', copy:'Copy', mail:'Email', copied:'Copied', nothing:'Nothing to copy',
  offers:'offers', min:'Min', max:'Max', avg:'Avg',
  selected:'selected', rfq:'Request quote', copyEmails:'Copy emails', copyPhones:'Copy phones', exportSel:'Export selected', clearSel:'Cancel',
  emptyTitle:'Start by uploading your suppliers file',
  emptySub:'Drag an Excel or CSV file here or pick one from your device. Your data is never sent to a server — it stays on your device only.',
  emptyPick:'Choose file', emptyDemo:'Try sample data', emptyTpl:'Download ready template',
  emptyCols:'Supported columns: part name, reference, category, brand, supplier, contact, phone, email, city, price, currency, lead time, min. order, notes — in Arabic, French or English, detected automatically.',
  dropHere:'Drop the file here',
  noRes:'No matching results', noResSub:'Try other words or relax the filters.',
  fTxt:'Search', fPart:'Part', fMinP:'Price from', fMaxP:'Price to', fDelT:'Lead time ≤',
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
  intro:'Please send us a quotation for the following items:', qtyW:'Qty', refW:'Ref',
  ask:'Please include: unit price, lead time, payment terms and offer validity.', placeW:'Delivery place', thanks:'Thank you,',
  confirmClear:'All data saved on this device will be erased. Continue?', cleared:'Data cleared',
  storeFail:'Could not save data locally (file too large) — it stays available until you close the page.',
  tplName:'suppliers_template', expName:'suppliers', supplierWord:'supplier', unitOffer:'offer', rows:'rows',
  langBtn:'AR', da:'DZD'
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
  send:'<path d="M4 12l16-8-6 16-3-7z"/>'
};
function icon(name){ const i=document.createElement('i'); i.setAttribute('data-ic',name); i.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+(IC[name]||'')+'</svg>'; return i; }
function paintIcons(root){ (root||document).querySelectorAll('i[data-ic]').forEach(i=>{ if(!i.firstChild) i.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+(IC[i.getAttribute('data-ic')]||'')+'</svg>'; }); }

/* ---------------- الحالة ---------------- */
const LS = { data:'sf_data_v1', cc:'sf_cc', me:'sf_me' };
const S = {
  lang: localStorage.getItem('site_lang') || 'ar',
  data: [], sample:false,
  q:'', sort:'price-asc', group:true,
  f:{ part:'', cats:new Set(), brands:new Set(), city:'', supplier:'', currency:'', pmin:'', pmax:'', dmax:'', hasEmail:false, hasPhone:false },
  sel:new Set(), partQ:'',
  cc: localStorage.getItem(LS.cc) || '213'
};
if (!TX[S.lang]) S.lang = 'ar';
const T = (k,o) => { let s=(TX[S.lang][k] ?? k); if(o) for(const x in o) s=s.replace('{'+x+'}',o[x]); return s; };
const $ = id => document.getElementById(id);

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
function h(tag, cls, kids){
  const e=document.createElement(tag); if(cls) e.className=cls;
  (Array.isArray(kids)?kids:[kids]).forEach(k=>{ if(k==null||k===false) return; e.append(k.nodeType?k:document.createTextNode(k)); });
  return e;
}
const clone = o => JSON.parse(JSON.stringify(o));

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
  r.part=txt(r.part); r.supplier=txt(r.supplier); r.ref=txt(r.ref); r.category=txt(r.category); r.brand=txt(r.brand);
  r.contact=txt(r.contact); r.city=txt(r.city); r.notes=txt(r.notes); r.moq=txt(r.moq); r.phone=txt(r.phone); r.email=txt(r.email);
  r.price = r.price==null||r.price==='' ? null : Number(r.price);
  r.delivery = r.delivery==null||r.delivery==='' ? null : Number(r.delivery);
  r.currency = r.currency || 'DZD';
  r._pk = nkey(r.part);
  r.phones = r.phone.split(/[\/;،|\n]+|\s-\s|,(?=\s*\+?\d)/).map(x=>x.trim()).filter(x=>x.replace(/\D/g,'').length>=6);
  r.emails = (r.email.match(EMAIL_RE)||[]).map(x=>x.toLowerCase());
  r._h = norm([r.part,r.ref,r.category,r.brand,r.supplier,r.contact,r.city,r.notes].join(' | '));
  return r;
}
function baseOf(r){ const {id,_pk,_h,phones,emails,...b}=r; return b; }

/* ---------------- بيانات تجريبية ---------------- */
function sampleData(){
  const sup=[
    ['الشركة الجزائرية للتوريدات الصناعية','الجزائر العاصمة','أ. كريم','0550 00 00 01','commercial@asi-demo.example'],
    ['SKF Distribution Sétif','سطيف','M. Amine','0660 00 00 02','ventes@skf-setif-demo.example'],
    ['Elec Pro Oran','وهران','Mme Nadia','0770 00 00 03','contact@elecpro-demo.example'],
    ['مؤسسة الأطلس للمعدات','قسنطينة','أ. يوسف','0555 00 00 04','atlas@atlas-demo.example'],
    ['TechnoParts Annaba','عنابة','M. Riad','0661 00 00 05','info@technoparts-demo.example'],
    ['Sahara Industrial Supply','ورقلة','أ. عبد الله','0771 00 00 06','sales@sahara-demo.example'],
    ['Medea Hydraulics','المدية','M. Hakim','0552 00 00 07','hydro@medea-demo.example'],
    ['Batna Réfractaires','باتنة','أ. سمير','0662 00 00 08','ref@batna-demo.example']
  ];
  const parts=[
    ['رولمان 22320 CC/W33','22320-CC-W33','رولمانات','SKF',48000],
    ['رولمان 22222 E','22222-E','رولمانات','FAG',21500],
    ['سير مثلثي SPB 3350','SPB-3350','سيور وسلاسل','Optibelt',6500],
    ['كونتاكتور 80A','LC1D80','كهرباء','Schneider',32000],
    ['قاطع دارة 250A','NSX250','كهرباء','Schneider',78000],
    ['محول تردد 90kW','ACS880-90','كهرباء','ABB',1450000],
    ['حساس حرارة PT100','PT100-L200','أجهزة قياس','WIKA',9500],
    ['حساس تقارب M18','IME18','أجهزة قياس','Sick',7800],
    ['زيت علبة السرعة ISO VG 320 (برميل 208L)','VG320-208','زيوت وشحوم','Mobil',185000],
    ['خرطوم هيدروليكي 2SN 1 بوصة (للمتر)','2SN-1','هيدروليك','Parker',4200],
    ['بكرة ناقل Ø133','IDL-133','ميكانيك','—',14500],
    ['طوب حراري MgO-C (للطن)','MGC-01','مواد حرارية','RHI',390000]
  ];
  const mult=[1,0.94,1.08,1.03,0.97], days=[2,5,7,3,10], moq=['1','1','2','1','5'];
  const out=[];
  parts.forEach((p,i)=>{
    const n = 3 + (i%2);
    for(let j=0;j<n;j++){
      const s=sup[(i+j*2)%sup.length];
      out.push({ part:p[0], ref:p[1], category:p[2], brand:p[3]==='—'?'':p[3], supplier:s[0], contact:s[2], phone:s[3], email:s[4], city:s[1],
        price:Math.round(p[4]*mult[(i+j)%5]/100)*100, currency:'DZD', delivery:days[(i*2+j)%5], moq:moq[(i+j)%5], notes: j===0?'السعر شامل الرسوم — الدفع بعد التسليم':'' });
    }
  });
  out.push({ part:'محول تردد 90kW', ref:'ACS880-90', category:'كهرباء', brand:'ABB', supplier:sup[4][0], contact:sup[4][2], phone:sup[4][3], email:sup[4][4], city:sup[4][1], price:9800, currency:'EUR', delivery:21, moq:'1', notes:'استيراد — السعر باليورو' });
  return out;
}

/* ---------------- التخزين ---------------- */
function persist(){
  try{ localStorage.setItem(LS.data, JSON.stringify({ sample:S.sample, data:S.data.map(baseOf) })); }
  catch(e){ toast(T('storeFail'), 3500); }
}
function loadStored(){
  try{
    const raw=localStorage.getItem(LS.data); if(!raw) return;
    const o=JSON.parse(raw); S.sample=!!o.sample; S.data=(o.data||[]).map(finalize);
  }catch(e){}
}

/* ---------------- التصفية والترتيب ---------------- */
const num = v => (v===''||v==null||isNaN(Number(v))) ? null : Number(v);
function baseQ(){ const t=tokens(S.q); return t.length ? S.data.filter(r=>t.every(x=>r._h.includes(x))) : S.data; }
function results(){
  const f=S.f, t=tokens(S.q), pmin=num(f.pmin), pmax=num(f.pmax), dmax=num(f.dmax);
  let arr=S.data.filter(r=>{
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
    if(f.hasEmail && !r.emails.length) return false;
    if(f.hasPhone && !r.phones.length) return false;
    return true;
  });
  const nullLast=(a,b,dir)=> (a==null && b==null)?0 : a==null?1 : b==null?-1 : dir*(a-b);
  const loc=S.lang==='ar'?'ar':'en';
  const sorters={
    'price-asc':(a,b)=>nullLast(a.price,b.price,1),
    'price-desc':(a,b)=>nullLast(a.price,b.price,-1),
    'delivery':(a,b)=>nullLast(a.delivery,b.delivery,1) || nullLast(a.price,b.price,1),
    'supplier':(a,b)=>a.supplier.localeCompare(b.supplier,loc),
    'part':(a,b)=>a.part.localeCompare(b.part,loc)
  };
  return arr.sort(sorters[S.sort]);
}

/* ---------------- التنسيق ---------------- */
const curLabel = c => c==='DZD' ? T('da') : c==='EUR' ? '€' : c==='USD' ? '$' : c;
function fmtNum(n){ return Number(n).toLocaleString('fr-FR',{maximumFractionDigits:2}).replace(/\u202f|\u00a0/g,' '); }
const fmtPrice = r => r.price==null ? null : fmtNum(r.price)+' '+curLabel(r.currency);
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

function rowEl(r, isBest, grouped){
  const row=h('div','sf-row'+(S.sel.has(r.id)?' sel':'')+(isBest?' best':''));
  // تحديد
  const chk=h('input'); chk.type='checkbox'; chk.checked=S.sel.has(r.id);
  chk.addEventListener('change',()=>{ chk.checked ? S.sel.add(r.id) : S.sel.delete(r.id); row.classList.toggle('sel',chk.checked); renderBar(); syncAll(); });
  row.append(h('div','sf-rchk',chk));

  // القطعة
  const tags=[]; if(r.ref) tags.push(h('span','sf-tag ref',r.ref)); if(r.brand) tags.push(h('span','sf-tag brand',r.brand)); if(r.category) tags.push(h('span','sf-tag',r.category));
  row.append(h('div','',[ grouped?null:h('div','sf-part',r.part), tags.length?h('div','sf-tags'+(grouped?' sf-tags-top':''),tags):null, r.notes?h('div','sf-note',r.notes):null ]));

  // المورد
  const sub=[]; if(r.contact) sub.push(h('span','',r.contact)); if(r.city) sub.push(h('span','',r.city));
  row.append(h('div','',[ h('div','sf-sup',r.supplier), sub.length?h('div','sf-sub',sub):null ]));

  // الاتصال
  const c=h('div','sf-contact');
  r.phones.slice(0,2).forEach(p=>{
    const ln=h('a','sf-ln',[icon('phone'),p]); ln.href=telHref(p); ln.title=T('call');
    c.append(h('div','sf-line',[ ln, iconBtn('wa',T('wa'),null,waLink(p),'wa'), iconBtn('copy',T('copy'),()=>copyText(p)) ]));
  });
  if(!r.phones.length) c.append(h('span','sf-none','— '+T('fPhone')));
  if(r.emails.length){
    const e=r.emails[0];
    c.append(h('div','sf-line',[ Object.assign(h('a','sf-ln',[icon('mail'),e]),{href:'mailto:'+e,title:e}), iconBtn('copy',T('copy'),()=>copyText(r.emails.join(', '))) ]));
  }
  row.append(c);

  // السعر
  const pb=h('div','sf-pricebox');
  const ps=fmtPrice(r);
  pb.append(ps ? h('div','sf-price',ps) : h('div','sf-price none',T('noPrice')));
  if(isBest) pb.append(h('span','sf-best','★ '+T('best')));
  const metas=[]; const dd=fmtDays(r.delivery); if(dd) metas.push(dd); if(r.moq) metas.push(T('moq')+': '+r.moq);
  if(metas.length) pb.append(h('div','sf-meta',metas.join(' • ')));
  row.append(pb);
  return row;
}

/* ---------------- العرض ---------------- */
function render(){
  const has=S.data.length>0;
  $('sfEmpty').hidden=has; $('sfMain').hidden=!has; $('sfStats').hidden=!has;
  $('sfSample').hidden=!(has&&S.sample); $('sfSample').textContent=T('sample');
  renderStats(); renderSelects(); renderFacets(); renderResults();
}

function renderStats(){
  const st=$('sfStats'); st.innerHTML='';
  const parts=new Set(S.data.map(r=>r._pk)).size, sups=new Set(S.data.map(r=>norm(r.supplier))).size;
  [[S.data.length,'sRecords'],[parts,'sParts'],[sups,'sSuppliers']].forEach(([n,k])=>st.append(h('span','sf-stat',[h('b','',fmtNum(n)),T(k)])));
}

function fillSelect(sel, values, cur){
  sel.innerHTML=''; const o=h('option','',T('all')); o.value=''; sel.append(o);
  values.forEach(v=>{ const x=h('option','',v.label||v); x.value=v.value||v; sel.append(x); });
  sel.value = values.some(v=>(v.value||v)===cur) ? cur : '';
}
function renderSelects(){
  const uniq=(fn)=>[...new Set(S.data.map(fn).filter(Boolean))].sort((a,b)=>a.localeCompare(b,S.lang==='ar'?'ar':'en'));
  fillSelect($('sfCity'), uniq(r=>r.city), S.f.city);
  fillSelect($('sfSupplier'), uniq(r=>r.supplier), S.f.supplier);
  fillSelect($('sfCurrency'), uniq(r=>r.currency).map(c=>({value:c,label:curLabel(c)+' ('+c+')'})), S.f.currency);
  S.f.city=$('sfCity').value; S.f.supplier=$('sfSupplier').value; S.f.currency=$('sfCurrency').value;
  // الترتيب
  const so=$('sfSort'); const cur=S.sort; so.innerHTML='';
  [['price-asc','sPriceAsc'],['price-desc','sPriceDesc'],['delivery','sDelivery'],['supplier','sSupplier'],['part','sPart']].forEach(([v,k])=>{ const o=h('option','',T(k)); o.value=v; so.append(o); });
  so.value=cur;
}

function facetList(container, items, set){
  container.innerHTML='';
  items.forEach(([name,count])=>{
    const cb=h('input'); cb.type='checkbox'; cb.checked=set.has(name);
    cb.addEventListener('change',()=>{ cb.checked?set.add(name):set.delete(name); renderResults(); });
    container.append(h('label','sf-check',[cb,h('span','',name==='—'?'—':name),h('em','',String(count))]));
  });
}
function renderFacets(){
  const base=baseQ();
  const count=(fn)=>{ const m=new Map(); base.forEach(r=>{ const k=fn(r); m.set(k,(m.get(k)||0)+1); }); return [...m.entries()].sort((a,b)=>b[1]-a[1]||String(a[0]).localeCompare(String(b[0]))); };
  facetList($('sfCats'), count(r=>r.category||'—'), S.f.cats);
  facetList($('sfBrands'), count(r=>r.brand||'—'), S.f.brands);

  // قائمة القطع
  const pm=new Map(); base.forEach(r=>{ const e=pm.get(r._pk)||{name:r.part,sups:new Set()}; e.sups.add(norm(r.supplier)); pm.set(r._pk,e); });
  const pq=tokens(S.partQ);
  let list=[...pm.entries()].filter(([k,e])=>!pq.length || pq.every(t=>norm(e.name).includes(t))).sort((a,b)=>b[1].sups.size-a[1].sups.size||a[1].name.localeCompare(b[1].name)).slice(0,300);
  const box=$('sfParts'); box.innerHTML='';
  list.forEach(([k,e])=>{
    const b=h('button','sf-pitem'+(S.f.part===k?' on':''),[h('span','',e.name),h('em','',String(e.sups.size))]); b.type='button'; b.title=e.name;
    b.addEventListener('click',()=>{ S.f.part = S.f.part===k ? '' : k; renderFacets(); renderResults(); });
    box.append(b);
  });
}

function groupBestKey(r){ return r._pk+'|'+r.currency; }
function renderResults(){
  const list=$('sfList'); list.innerHTML='';
  const res=results();
  $('sfCount').textContent=fmtNum(res.length)+' '+T('results');
  renderChips();

  // أرخص سعر لكل (قطعة+عملة)
  const minMap=new Map(), cnt=new Map();
  res.forEach(r=>{ const k=groupBestKey(r); cnt.set(k,(cnt.get(k)||0)+1); if(r.price!=null && (!minMap.has(k)||r.price<minMap.get(k))) minMap.set(k,r.price); });
  const isBest=r=> r.price!=null && cnt.get(groupBestKey(r))>1 && minMap.get(groupBestKey(r))===r.price;

  if(!res.length){ list.append(h('div','sf-noresult',[h('h3','',T('noRes')),h('div','',T('noResSub'))])); renderBar(); syncAll(res); return; }

  if(S.group){
    const groups=new Map(); res.forEach(r=>{ if(!groups.has(r._pk)) groups.set(r._pk,[]); groups.get(r._pk).push(r); });
    const arr=[...groups.values()].sort((a,b)=>a[0].part.localeCompare(b[0].part,S.lang==='ar'?'ar':'en'));
    arr.forEach(rows=>{
      const prices=rows.filter(r=>r.price!=null); const curs=new Set(prices.map(r=>r.currency));
      const pills=[ h('span','sf-gpill',rows.length+' '+T('offers')) ];
      if(prices.length && curs.size===1){
        const c=curLabel(prices[0].currency), ps=prices.map(r=>r.price);
        pills.push(h('span','sf-gpill',T('min')+': '+fmtNum(Math.min(...ps))+' '+c));
        if(prices.length>1){ pills.push(h('span','sf-gpill',T('max')+': '+fmtNum(Math.max(...ps))+' '+c)); pills.push(h('span','sf-gpill',T('avg')+': '+fmtNum(ps.reduce((a,b)=>a+b,0)/ps.length)+' '+c)); }
      }
      list.append(h('div','sf-group',[ h('div','sf-ghead',[h('h2','',rows[0].part),h('div','sf-gmeta',pills)]), h('div','sf-rows',rows.map(r=>rowEl(r,isBest(r),true))) ]));
    });
  } else {
    list.append(h('div','sf-rows',res.map(r=>rowEl(r,isBest(r)))));
  }
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
  if(f.pmin!=='') add(T('fMinP')+': '+f.pmin,()=>{ f.pmin=''; });
  if(f.pmax!=='') add(T('fMaxP')+': '+f.pmax,()=>{ f.pmax=''; });
  if(f.dmax!=='') add(T('fDelT')+' '+f.dmax,()=>{ f.dmax=''; });
  if(f.hasEmail) add(T('fEmail'),()=>{ f.hasEmail=false; });
  if(f.hasPhone) add(T('fPhone'),()=>{ f.hasPhone=false; });
}
function syncInputs(){
  const f=S.f;
  $('sfCity').value=f.city; $('sfSupplier').value=f.supplier; $('sfCurrency').value=f.currency;
  $('sfPmin').value=f.pmin; $('sfPmax').value=f.pmax; $('sfDmax').value=f.dmax;
  $('sfHasEmail').checked=f.hasEmail; $('sfHasPhone').checked=f.hasPhone;
}
function resetFilters(){
  const f=S.f; f.part=''; f.cats.clear(); f.brands.clear(); f.city=f.supplier=f.currency=''; f.pmin=f.pmax=f.dmax=''; f.hasEmail=f.hasPhone=false;
  S.q=''; $('sfQ').value=''; $('sfQClear').classList.remove('show'); S.partQ=''; $('sfPartQ').value='';
  syncInputs(); renderFacets(); renderResults();
}

/* ---------------- شريط التحديد ---------------- */
const selected = () => S.data.filter(r=>S.sel.has(r.id));
function renderBar(){
  const bar=$('sfBar'); const n=S.sel.size;
  bar.classList.toggle('show', n>0); if(!n){ bar.innerHTML=''; return; }
  bar.innerHTML='';
  const mk=(ic,label,fn,cls)=>{ const b=h('button','sf-btn '+(cls||''),[icon(ic),h('span','',label)]); b.type='button'; b.addEventListener('click',fn); return b; };
  bar.append(h('b','',n+' '+T('selected')),
    mk('send',T('rfq'),openRFQ,'sf-btn-primary'),
    mk('mail',T('copyEmails'),()=>copyText([...new Set(selected().flatMap(r=>r.emails))].join('; '))),
    mk('phone',T('copyPhones'),()=>copyText([...new Set(selected().flatMap(r=>r.phones))].join('\n'))),
    mk('download',T('exportSel'),()=>exportXlsx(selected())),
    mk('close',T('clearSel'),()=>{ S.sel.clear(); renderResults(); }));
}

/* ---------------- النوافذ ---------------- */
function openModal(node){ const box=$('sfModalBox'); box.innerHTML=''; box.append(node); $('sfModal').classList.add('open'); paintIcons(box); }
function closeModal(){ $('sfModal').classList.remove('open'); $('sfModalBox').innerHTML=''; }
function modalHead(title){ const x=h('button','sf-x',icon('close')); x.type='button'; x.addEventListener('click',closeModal); return h('div','sf-mh',[h('h2','',title),x]); }

/* ---------------- طلب عرض سعر ---------------- */
function openRFQ(){
  const chosen=selected(); if(!chosen.length) return;
  const partMap=new Map(); chosen.forEach(r=>{ if(!partMap.has(r._pk)) partMap.set(r._pk,{name:r.part,ref:r.ref,qty:1}); });
  const parts=[...partMap.values()];
  const supMap=new Map(); chosen.forEach(r=>{ const k=norm(r.supplier); if(!supMap.has(k)) supMap.set(k,{name:r.supplier,emails:new Set()}); r.emails.forEach(e=>supMap.get(k).emails.add(e)); });
  const sups=[...supMap.values()]; const withMail=sups.filter(s=>s.emails.size); const noMail=sups.length-withMail.length;
  const me=(()=>{ try{return JSON.parse(localStorage.getItem(LS.me)||'{}');}catch(e){return {};} })();
  const st={ name:me.name||'', company:me.company||'', place:me.place||'', edited:false };

  const box=h('div','');
  box.append(modalHead(T('rfqTitle')), h('p','sf-msub',T('rfqSub')));

  // الموردون
  const chips=h('div','sf-stats'); withMail.forEach(s=>chips.append(h('span','sf-stat',s.name)));
  box.append(h('h3','',T('rfqSuppliers')+' ('+withMail.length+')'), chips);
  if(noMail) box.append(h('div','sf-warn',T('rfqNoMail',{n:noMail})));
  if(!withMail.length) box.append(h('div','sf-warn',T('rfqNoRecipients')));

  // القطع والكميات
  box.append(h('h3','',T('rfqParts')));
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
  const field=(label,key)=>{ const i=h('input','sf-mini'); i.type='text'; i.value=st[key]; i.addEventListener('input',()=>{ st[key]=i.value; st.edited=false; build(); try{localStorage.setItem(LS.me,JSON.stringify({name:st.name,company:st.company,place:st.place}));}catch(e){} }); return h('div','sf-mf',[h('label','',label),i]); };
  grid.append(field(T('rfqName'),'name'),field(T('rfqCompany'),'company'),field(T('rfqPlace'),'place'));
  box.append(grid, h('h3','',T('rfqMsg')), ta);
  build();

  const allMails=[...new Set(withMail.flatMap(s=>[...s.emails]))];
  const foot=h('div','sf-mfoot');
  const b1=h('button','sf-btn sf-btn-primary',[icon('mail'),h('span','',T('rfqOpen'))]); b1.type='button';
  b1.addEventListener('click',()=>{
    const url='mailto:?bcc='+encodeURIComponent(allMails.join(','))+'&subject='+encodeURIComponent(T('subject'))+'&body='+encodeURIComponent(ta.value);
    if(url.length>1900){ copyText(ta.value,T('rfqLong')); if(allMails.length) location.href='mailto:?bcc='+encodeURIComponent(allMails.join(','))+'&subject='+encodeURIComponent(T('subject')); }
    else location.href=url;
  });
  const b2=h('button','sf-btn',[icon('copy'),h('span','',T('rfqCopyMsg'))]); b2.type='button'; b2.addEventListener('click',()=>copyText(ta.value));
  const b3=h('button','sf-btn',[icon('mail'),h('span','',T('rfqCopyMails'))]); b3.type='button'; b3.addEventListener('click',()=>copyText(allMails.join('; ')));
  foot.append(b1,b2,b3); box.append(foot);
  openModal(box);
  // إظهار نصوص الأزرار داخل النافذة
  box.querySelectorAll('.sf-btn span').forEach(s=>s.style.display='inline');
}

/* ---------------- الاستيراد ---------------- */
const IMP = { wb:null, name:'', sheet:'', rows:[], hIdx:0, headers:[], map:{}, mode:'replace' };

function ensureXLSX(){ return window.XLSX ? Promise.resolve() : new Promise((res,rej)=>{ const s=document.createElement('script'); s.src='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'; s.onload=res; s.onerror=rej; document.head.appendChild(s); }); }

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
  let hIdx=rows.findIndex((r,i)=>i<15 && r.filter(c=>txt(c)!=='').length>=2);
  if(hIdx<0 || rows.length<2){ IMP.rows=[]; showImport(); return; }
  IMP.rows=rows; IMP.hIdx=hIdx; IMP.headers=rows[hIdx].map(c=>txt(c));
  IMP.map=autoMap(IMP.headers);
  showImport();
}

function autoMap(headers){
  const hk=headers.map(nkey), map={}, used=new Set();
  // مرحلة 1: تطابق تام
  FIELD_ORDER.forEach(k=>{
    const f=FIELDS.find(x=>x.k===k), syn=f.syn.map(nkey);
    const i=hk.findIndex((x,idx)=>!used.has(idx) && x && syn.includes(x));
    if(i>-1){ map[k]=i; used.add(i); }
  });
  // مرحلة 2: احتواء
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
      phone:cleanPhone(g('phone')), email:g('email'), city:g('city'),
      price:parsePrice(priceCell), currency:normCur(g('currency'))||curFromPriceCell(priceCell)||'DZD',
      delivery:parseDays(g('delivery')), moq:g('moq'), notes:g('notes')
    });
  }
  return out;
}

function showImport(){
  const box=h('div',''); box.append(modalHead(T('impTitle')), h('p','sf-msub',IMP.name+' — '+T('impSub')));
  if(!IMP.rows.length){ box.append(h('div','sf-warn',T('impEmptyFile'))); const c=h('button','sf-btn',T('impCancel')); c.type='button'; c.addEventListener('click',closeModal); box.append(h('div','sf-mfoot',c)); openModal(box); return; }

  // الورقة
  if(IMP.wb.SheetNames.length>1){
    const sel=h('select','sf-select'); IMP.wb.SheetNames.forEach(n=>{ const o=h('option','',n); o.value=n; sel.append(o); }); sel.value=IMP.sheet;
    sel.addEventListener('change',()=>loadSheet(sel.value));
    box.append(h('div','sf-mf',[h('label','',T('impSheet')),sel]), h('div','',' '));
  }

  // ربط الأعمدة
  const grid=h('div','sf-mgrid'); grid.style.marginTop='12px';
  const status=h('div',''), prev=h('div','sf-prev');
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

  // الوضع
  const radio=h('div','sf-radio');
  [['replace','impReplace'],['append','impAppend']].forEach(([v,k])=>{
    const r=h('input'); r.type='radio'; r.name='impmode'; r.value=v; r.checked=IMP.mode===v; r.addEventListener('change',()=>{ IMP.mode=v; });
    radio.append(h('label','',[r,T(k)]));
  });
  if(!S.data.length || S.sample){ IMP.mode='replace'; } else box.append(radio);

  box.append(status, h('h3','',T('impPreview')), prev);

  const goBtn=h('button','sf-btn sf-btn-primary',[icon('check'),h('span','',T('impGo'))]); goBtn.type='button';
  goBtn.addEventListener('click',()=>{
    const recs=buildRecords().map(finalize);
    if(IMP.mode==='append' && S.data.length && !S.sample){
      const seen=new Set(S.data.map(r=>[r._pk,norm(r.supplier),r.price,norm(r.ref)].join('|')));
      recs.forEach(r=>{ const k=[r._pk,norm(r.supplier),r.price,norm(r.ref)].join('|'); if(!seen.has(k)){ seen.add(k); S.data.push(r); } });
    } else S.data=recs;
    S.sample=false; S.sel.clear(); resetFiltersSilent(); persist(); render(); closeModal(); toast(T('impDone',{n:fmtNum(recs.length)}),2600);
  });
  const cancel=h('button','sf-btn',T('impCancel')); cancel.type='button'; cancel.addEventListener('click',closeModal);
  box.append(h('div','sf-mfoot',[cancel,goBtn]));
  openModal(box);
  box.querySelectorAll('.sf-btn span').forEach(s=>s.style.display='inline');
  refresh();
}
function resetFiltersSilent(){ const f=S.f; f.part=''; f.cats.clear(); f.brands.clear(); f.city=f.supplier=f.currency=''; f.pmin=f.pmax=f.dmax=''; f.hasEmail=f.hasPhone=false; S.q=''; S.partQ=''; $('sfQ').value=''; $('sfPartQ').value=''; $('sfQClear').classList.remove('show'); syncInputs(); }

/* ---------------- التصدير والقالب ---------------- */
function needXLSX(){ if(window.XLSX) return true; toast(T('xlsxFail'),3500); return false; }
function exportXlsx(rows){
  if(!needXLSX()) return;
  rows = rows || results();
  if(!rows.length){ toast(T('nothing')); return; }
  const cols=FIELDS.map(f=>f.k);
  const aoa=[FIELDS.map(f=>f[S.lang])];
  rows.forEach(r=>aoa.push(cols.map(k=> k==='price'||k==='delivery' ? (r[k]==null?'':r[k]) : r[k])));
  const ws=XLSX.utils.aoa_to_sheet(aoa); ws['!cols']=FIELDS.map(f=>({wch:f.k==='part'||f.k==='supplier'||f.k==='email'?32:16}));
  if(S.lang==='ar') ws['!views']=[{rightToLeft:true}];
  const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,T('expName').slice(0,30));
  XLSX.writeFile(wb,T('expName')+'.xlsx');
}
function downloadTemplate(){
  if(!needXLSX()) return;
  const ar=S.lang==='ar';
  const aoa=[FIELDS.map(f=>f[S.lang])];
  aoa.push(ar
    ? ['رولمان 22320','22320-CC-W33','رولمانات','SKF','شركة المثال للتوريد','أ. محمد','0550123456','contact@example.com','سطيف',48000,'DZD',5,'1','السعر شامل الرسوم']
    : ['Bearing 22320','22320-CC-W33','Bearings','SKF','Example Supply Co.','Mr. Ahmed','0550123456','contact@example.com','Setif',48000,'DZD',5,'1','Price includes taxes']);
  aoa.push(ar
    ? ['سير مثلثي SPB 3350','SPB-3350','سيور','Optibelt','مؤسسة النموذج','أ. سعاد','0661234567','sales@example.com','وهران',6500,'DZD',3,'2','']
    : ['V-belt SPB 3350','SPB-3350','Belts','Optibelt','Sample Trading','Ms. Sara','0661234567','sales@example.com','Oran',6500,'DZD',3,'2','']);
  const ws=XLSX.utils.aoa_to_sheet(aoa); ws['!cols']=FIELDS.map(()=>({wch:20}));
  if(ar) ws['!views']=[{rightToLeft:true}];
  const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,ar?'الموردون':'Suppliers');
  XLSX.writeFile(wb,T('tplName')+'.xlsx');
}

/* ---------------- اللغة ---------------- */
function applyLang(){
  const html=document.documentElement; html.lang=S.lang; html.dir=S.lang==='ar'?'rtl':'ltr';
  document.title=T('title')+' | Dr Soufiane Merabti';
  document.querySelectorAll('[data-i]').forEach(e=>{ e.textContent=T(e.getAttribute('data-i')); });
  document.querySelectorAll('[data-ip]').forEach(e=>{ e.placeholder=T(e.getAttribute('data-ip')); });
  $('sfLang').textContent=T('langBtn');
  render();
}

/* ---------------- الأحداث ---------------- */
let qTimer;
$('sfQ').addEventListener('input',e=>{
  S.q=e.target.value; $('sfQClear').classList.toggle('show',!!S.q);
  clearTimeout(qTimer); qTimer=setTimeout(()=>{ renderFacets(); renderResults(); },120);
});
$('sfQClear').addEventListener('click',()=>{ S.q=''; $('sfQ').value=''; $('sfQClear').classList.remove('show'); renderFacets(); renderResults(); $('sfQ').focus(); });
$('sfPartQ').addEventListener('input',e=>{ S.partQ=e.target.value; renderFacets(); });
[['sfCity','city'],['sfSupplier','supplier'],['sfCurrency','currency']].forEach(([id,k])=>$(id).addEventListener('change',e=>{ S.f[k]=e.target.value; renderResults(); }));
[['sfPmin','pmin'],['sfPmax','pmax'],['sfDmax','dmax']].forEach(([id,k])=>$(id).addEventListener('input',e=>{ S.f[k]=e.target.value; renderResults(); }));
$('sfHasEmail').addEventListener('change',e=>{ S.f.hasEmail=e.target.checked; renderResults(); });
$('sfHasPhone').addEventListener('change',e=>{ S.f.hasPhone=e.target.checked; renderResults(); });
$('sfResetF').addEventListener('click',resetFilters);
$('sfSort').addEventListener('change',e=>{ S.sort=e.target.value; renderResults(); });
$('sfGroup').addEventListener('change',e=>{ S.group=e.target.checked; renderResults(); });
$('sfAll').addEventListener('change',e=>{ const res=results(); res.forEach(r=>e.target.checked?S.sel.add(r.id):S.sel.delete(r.id)); renderResults(); });
$('sfCC').value=S.cc;
$('sfCC').addEventListener('input',e=>{ S.cc=e.target.value.replace(/\D/g,'')||'213'; try{localStorage.setItem(LS.cc,S.cc);}catch(x){} renderResults(); });

$('sfUpload').addEventListener('click',()=>$('sfFile').click());
$('sfPick').addEventListener('click',()=>$('sfFile').click());
$('sfFile').addEventListener('change',e=>{ handleFile(e.target.files[0]); e.target.value=''; });
$('sfTpl').addEventListener('click',downloadTemplate);
$('sfTpl2').addEventListener('click',downloadTemplate);
$('sfExport').addEventListener('click',()=>exportXlsx());
$('sfPrint').addEventListener('click',()=>window.print());
$('sfDemo').addEventListener('click',()=>{ S.data=sampleData().map(finalize); S.sample=true; persist(); render(); });
$('sfClear').addEventListener('click',()=>{ if(!S.data.length){ return; } if(confirm(T('confirmClear'))){ S.data=[]; S.sample=false; S.sel.clear(); resetFiltersSilent(); try{localStorage.removeItem(LS.data);}catch(e){} render(); toast(T('cleared')); } });
$('sfLang').addEventListener('click',()=>{ S.lang=S.lang==='ar'?'en':'ar'; localStorage.setItem('site_lang',S.lang); applyLang(); renderBar(); });

// الفلاتر على الجوال
$('sfFiltBtn').addEventListener('click',()=>$('sfSide').classList.add('open'));
$('sfSideClose').addEventListener('click',()=>$('sfSide').classList.remove('open'));

// النافذة
$('sfModal').addEventListener('click',e=>{ if(e.target===$('sfModal')) closeModal(); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ closeModal(); $('sfSide').classList.remove('open'); } });

// السحب والإفلات
let dragDepth=0;
const hasFiles=e=>e.dataTransfer && [...(e.dataTransfer.types||[])].includes('Files');
window.addEventListener('dragenter',e=>{ if(!hasFiles(e)) return; dragDepth++; $('sfDrop').classList.add('show'); });
window.addEventListener('dragleave',e=>{ if(!hasFiles(e)) return; dragDepth=Math.max(0,dragDepth-1); if(!dragDepth) $('sfDrop').classList.remove('show'); });
window.addEventListener('dragover',e=>{ if(hasFiles(e)) e.preventDefault(); });
window.addEventListener('drop',e=>{ if(!hasFiles(e)) return; e.preventDefault(); dragDepth=0; $('sfDrop').classList.remove('show'); handleFile(e.dataTransfer.files[0]); });

/* ---------------- البداية ---------------- */
loadStored();
paintIcons();
applyLang();
