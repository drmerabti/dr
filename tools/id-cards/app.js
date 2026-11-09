/* =========================================================
   مولّد بطاقات الأعمال — Merabti Academy
   30 designs (20 marked NEW), live preview, 3D flip, PNG, PDF, A4 print
   ========================================================= */
(function () {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const W = 340, H = 220;                       // 85 × 55 mm at 4 px/mm
const PRINT_K = 3.7795275591 / 4;             // px/mm at 96 dpi ÷ card px/mm
const STORE_KEY = 'merabti_bizcard_v1';
const UI_KEY = 'merabti_bizcard_ui';

/* ---------------------------------------------------------
   UI strings
--------------------------------------------------------- */
const UI = {
  ar: {
    tool_name:'مولّد بطاقات الأعمال', back_tools:'العودة إلى الأدوات', fullscreen:'ملء الشاشة', mine:'بطاقاتي', save:'حفظ في حسابي',
    print:'طباعة لوحة A4', png:'تنزيل صورة', pdf:'تنزيل PDF', png_d:'صورة PNG عالية الدقة',
    pdf_card:'بطاقة واحدة', pdf_card_d:'85 × 55 مم، بوجهيها', pdf_sheet:'لوحة A4', pdf_sheet_d:'10 بطاقات مع علامات القص',
    view_both:'الوجهان', view_3d:'ثلاثي الأبعاد', flip:'اقلب', front:'الوجه الأمامي', back:'الوجه الخلفي',
    hint3d:'حرّك الفأرة فوق البطاقة، واضغط «اقلب» أو على البطاقة لرؤية الوجه الآخر',
    designs:'التصاميم', count:'{n} تصميمًا', tab_design:'التصميم', tab_info:'المعلومات', tab_preview:'المعاينة',
    cat_all:'الكل', cat_new:'جديد', cat_corp:'شركات', cat_med:'أطباء', cat_eng:'مهندسون', cat_law:'محامون', cat_edu:'تعليم', cat_shop:'محلات', cat_free:'مستقلون',
    sec_lang:'لغة البطاقة', sec_id:'معلوماتك', sec_contact:'التواصل', sec_logo:'الشعار', sec_look:'المظهر',
    f_name:'الاسم الكامل', f_title:'الوظيفة أو الصفة', f_company:'المؤسسة أو النشاط', f_tagline:'وصف قصير', f_phone:'الهاتف', f_phone2:'هاتف ثانٍ',
    f_email:'البريد الإلكتروني', f_web:'الموقع الإلكتروني', f_address:'العنوان', f_social:'حساب التواصل الاجتماعي',
    bi_toggle:'الوجه الخلفي بلغة ثانية', bi_lang:'لغة الوجه الخلفي',
    bi_note:'يتكرر الوجه الأمامي على الخلف باللغة الثانية. أي حقل تتركه فارغًا يأخذ قيمته من اللغة الأولى.',
    logo_up:'رفع شعار', logo_change:'تغيير الشعار', logo_del:'حذف الشعار', logo_hint:'بدون شعار يظهر الحرف الأول من اسم المؤسسة.',
    color:'اللون', color_custom:'لون مخصص', font:'الخط', font_auto:'خط التصميم', qr_toggle:'إظهار رمز QR', qr_mode:'عند مسح الرمز',
    qr_vcard:'يحفظ بيانات الاتصال في الهاتف', qr_web:'يفتح الموقع الإلكتروني',
    sum_empty:'لم تُملأ بعد', sum_ct:'{n} وسائل', sum_logo:'شعار مرفوع', sum_nologo:'الحرف الأول من الاسم',
    btn_sample:'بيانات نموذجية', btn_clear:'مسح الحقول',
    t_saved_cloud:'حُفظت البطاقة في حسابك', t_cloud_err:'تعذّر الاتصال بالحساب، حاول مجددًا', t_png:'جارٍ تجهيز الصورة…', t_pdf:'جارٍ تجهيز ملف PDF…',
    t_done:'تم التنزيل', t_err:'تعذّر إنشاء الملف، حاول مجددًا', t_print:'جارٍ تجهيز لوحة الطباعة…', t_tpl:'تم تطبيق التصميم',
    t_cleared:'مُسحت الحقول', t_sample:'أُعيدت البيانات النموذجية', t_logo_err:'تعذّر قراءة الصورة، جرّب ملفًا آخر',
    t_new:'بطاقة جديدة', t_opened:'فُتحت البطاقة', t_dup:'نُسخت البطاقة', t_deleted:'حُذفت البطاقة', t_too_big:'الشعار كبير جدًا للحفظ، جرّب صورة أصغر',
    login_title:'سجّل دخولك لحفظ بطاقاتك', login_text:'احفظ بطاقاتك في حسابك وعد إليها من أي جهاز.', login_google:'الدخول بحساب Google',
    login_site:'تسجيل الدخول من الموقع', cancel:'إلغاء', loading:'جارٍ التحميل…', mine_empty:'لا توجد بطاقات محفوظة بعد',
    new_b:'بطاقة جديدة', open_b:'فتح', dup_b:'نسخ', del_b:'حذف', confirm_del:'حذف هذه البطاقة نهائيًا؟', current:'الحالية',
    untitled:'بدون اسم', copy_suffix:' (نسخة)'
  },
  fr: {
    tool_name:'Cartes de visite', back_tools:'Retour aux outils', fullscreen:'Plein écran', mine:'Mes cartes', save:'Enregistrer dans mon compte',
    print:'Imprimer une planche A4', png:'Télécharger une image', pdf:'Télécharger en PDF', png_d:'Image PNG haute résolution',
    pdf_card:'Une carte', pdf_card_d:'85 × 55 mm, recto verso', pdf_sheet:'Planche A4', pdf_sheet_d:'10 cartes avec traits de coupe',
    view_both:'Recto verso', view_3d:'Vue 3D', flip:'Retourner', front:'Recto', back:'Verso',
    hint3d:'Survolez la carte avec la souris, puis cliquez sur « Retourner » ou sur la carte pour voir l’autre face',
    designs:'Modèles', count:'{n} modèles', tab_design:'Modèle', tab_info:'Infos', tab_preview:'Aperçu',
    cat_all:'Tous', cat_new:'Nouveaux', cat_corp:'Entreprises', cat_med:'Médecins', cat_eng:'Ingénieurs', cat_law:'Avocats', cat_edu:'Éducation', cat_shop:'Commerces', cat_free:'Indépendants',
    sec_lang:'Langue de la carte', sec_id:'Vos informations', sec_contact:'Coordonnées', sec_logo:'Logo', sec_look:'Apparence',
    f_name:'Nom complet', f_title:'Fonction', f_company:'Entreprise ou activité', f_tagline:'Courte description', f_phone:'Téléphone', f_phone2:'Second téléphone',
    f_email:'E-mail', f_web:'Site web', f_address:'Adresse', f_social:'Réseau social',
    bi_toggle:'Verso dans une autre langue', bi_lang:'Langue du verso',
    bi_note:'Le recto est repris au verso dans la seconde langue. Un champ laissé vide reprend la valeur de la première langue.',
    logo_up:'Ajouter un logo', logo_change:'Changer le logo', logo_del:'Supprimer le logo', logo_hint:'Sans logo, l’initiale de l’entreprise s’affiche.',
    color:'Couleur', color_custom:'Couleur personnalisée', font:'Police', font_auto:'Police du modèle', qr_toggle:'Afficher un QR code', qr_mode:'Au scan du code',
    qr_vcard:'Enregistre le contact dans le téléphone', qr_web:'Ouvre le site web',
    sum_empty:'Pas encore rempli', sum_ct:'{n} coordonnées', sum_logo:'Logo ajouté', sum_nologo:'Initiale du nom',
    btn_sample:'Données d’exemple', btn_clear:'Vider les champs',
    t_saved_cloud:'Carte enregistrée dans votre compte', t_cloud_err:'Connexion au compte impossible, réessayez', t_png:'Préparation de l’image…', t_pdf:'Préparation du PDF…',
    t_done:'Téléchargement terminé', t_err:'Création du fichier impossible, réessayez', t_print:'Préparation de la planche…', t_tpl:'Modèle appliqué',
    t_cleared:'Champs vidés', t_sample:'Données d’exemple restaurées', t_logo_err:'Image illisible, essayez un autre fichier',
    t_new:'Nouvelle carte', t_opened:'Carte ouverte', t_dup:'Carte dupliquée', t_deleted:'Carte supprimée', t_too_big:'Logo trop lourd, essayez une image plus petite',
    login_title:'Connectez-vous pour enregistrer vos cartes', login_text:'Retrouvez vos cartes depuis n’importe quel appareil.', login_google:'Continuer avec Google',
    login_site:'Se connecter depuis le site', cancel:'Annuler', loading:'Chargement…', mine_empty:'Aucune carte enregistrée',
    new_b:'Nouvelle carte', open_b:'Ouvrir', dup_b:'Dupliquer', del_b:'Supprimer', confirm_del:'Supprimer définitivement cette carte ?', current:'Actuelle',
    untitled:'Sans nom', copy_suffix:' (copie)'
  },
  en: {
    tool_name:'Business Card Maker', back_tools:'Back to tools', fullscreen:'Full screen', mine:'My cards', save:'Save to my account',
    print:'Print an A4 sheet', png:'Download image', pdf:'Download PDF', png_d:'High-resolution PNG',
    pdf_card:'Single card', pdf_card_d:'85 × 55 mm, both sides', pdf_sheet:'A4 sheet', pdf_sheet_d:'10 cards with crop marks',
    view_both:'Both sides', view_3d:'3D view', flip:'Flip', front:'Front', back:'Back',
    hint3d:'Move your mouse over the card, then press Flip or tap the card to see the other side',
    designs:'Designs', count:'{n} designs', tab_design:'Design', tab_info:'Details', tab_preview:'Preview',
    cat_all:'All', cat_new:'New', cat_corp:'Business', cat_med:'Doctors', cat_eng:'Engineers', cat_law:'Lawyers', cat_edu:'Education', cat_shop:'Shops', cat_free:'Freelancers',
    sec_lang:'Card language', sec_id:'Your details', sec_contact:'Contact', sec_logo:'Logo', sec_look:'Look',
    f_name:'Full name', f_title:'Job title', f_company:'Company or trade', f_tagline:'Short description', f_phone:'Phone', f_phone2:'Second phone',
    f_email:'Email', f_web:'Website', f_address:'Address', f_social:'Social handle',
    bi_toggle:'Back side in another language', bi_lang:'Back side language',
    bi_note:'The front is repeated on the back in the second language. Any field you leave empty uses the first language’s value.',
    logo_up:'Upload a logo', logo_change:'Change logo', logo_del:'Remove logo', logo_hint:'Without a logo, the company’s initial is shown.',
    color:'Color', color_custom:'Custom color', font:'Font', font_auto:'Design font', qr_toggle:'Show a QR code', qr_mode:'When scanned',
    qr_vcard:'Saves the contact to the phone', qr_web:'Opens the website',
    sum_empty:'Not filled yet', sum_ct:'{n} details', sum_logo:'Logo uploaded', sum_nologo:'Name initial',
    btn_sample:'Sample details', btn_clear:'Clear fields',
    t_saved_cloud:'Card saved to your account', t_cloud_err:'Couldn’t reach your account, try again', t_png:'Preparing the image…', t_pdf:'Preparing the PDF…',
    t_done:'Downloaded', t_err:'Couldn’t create the file, try again', t_print:'Preparing the print sheet…', t_tpl:'Design applied',
    t_cleared:'Fields cleared', t_sample:'Sample details restored', t_logo_err:'Couldn’t read that image, try another file',
    t_new:'New card', t_opened:'Card opened', t_dup:'Card duplicated', t_deleted:'Card deleted', t_too_big:'The logo is too large to save, try a smaller image',
    login_title:'Sign in to save your cards', login_text:'Keep your cards in your account and open them on any device.', login_google:'Continue with Google',
    login_site:'Sign in from the site', cancel:'Cancel', loading:'Loading…', mine_empty:'No saved cards yet',
    new_b:'New card', open_b:'Open', dup_b:'Duplicate', del_b:'Delete', confirm_del:'Delete this card permanently?', current:'Current',
    untitled:'Untitled', copy_suffix:' (copy)'
  }
};
let uiLang = localStorage.getItem(UI_KEY) || localStorage.getItem('site_lang') || 'ar';
if (!UI[uiLang]) uiLang = 'ar';
const T = k => (UI[uiLang] && UI[uiLang][k]) || UI.ar[k] || k;
const LANGS = ['ar', 'fr', 'en'];
const LANG_LABEL = { ar:'العربية', fr:'Français', en:'English' };

/* ---------------------------------------------------------
   Sample content (per category and language)
--------------------------------------------------------- */
const SAMPLE = {
  corp: {
    contact: { phone:'0555 12 34 56', phone2:'036 12 34 56', email:'k.bouzid@atlas-group.dz', web:'www.atlas-group.dz', social:'@atlasgroup' },
    ar: { name:'كريم بوزيد', title:'مدير المبيعات', company:'مجموعة أطلس', tagline:'حلول صناعية متكاملة', address:'حي النصر، سطيف' },
    fr: { name:'Karim Bouzid', title:'Directeur commercial', company:'Groupe Atlas', tagline:'Solutions industrielles intégrées', address:'Cité En-Nasr, Sétif' },
    en: { name:'Karim Bouzid', title:'Sales Director', company:'Atlas Group', tagline:'Integrated industrial solutions', address:'En-Nasr district, Setif' }
  },
  med: {
    contact: { phone:'0661 23 45 67', phone2:'', email:'contact@clinique-elamel.dz', web:'www.clinique-elamel.dz', social:'@clinique.elamel' },
    ar: { name:'د. ليلى منصوري', title:'طبيبة أخصائية في طب الأطفال', company:'عيادة الأمل', tagline:'الاستقبال من الأحد إلى الخميس', address:'شارع الاستقلال، قسنطينة' },
    fr: { name:'Dr Leila Mansouri', title:'Pédiatre', company:'Clinique El Amel', tagline:'Consultations du dimanche au jeudi', address:'Rue de l’Indépendance, Constantine' },
    en: { name:'Dr Leila Mansouri', title:'Pediatrician', company:'El Amel Clinic', tagline:'Open Sunday to Thursday', address:'Independence St., Constantine' }
  },
  eng: {
    contact: { phone:'0770 11 22 33', phone2:'', email:'y.benamar@bet-tech.dz', web:'www.bet-tech.dz', social:'@bet.tech' },
    ar: { name:'م. يوسف بن عمر', title:'مهندس دولة في الكهروتقنية', company:'مكتب الدراسات التقنية', tagline:'دراسات، تصميم ومتابعة المشاريع', address:'المنطقة الصناعية، باتنة' },
    fr: { name:'Youcef Benamar', title:'Ingénieur d’État en électrotechnique', company:'Bureau d’études techniques', tagline:'Études, conception et suivi de projets', address:'Zone industrielle, Batna' },
    en: { name:'Youcef Benamar', title:'Electrical Engineer', company:'Technical Design Office', tagline:'Studies, design and project follow-up', address:'Industrial zone, Batna' }
  },
  law: {
    contact: { phone:'0550 44 55 66', phone2:'', email:'cabinet@kacimi-avocat.dz', web:'www.kacimi-avocat.dz', social:'@kacimi.avocat' },
    ar: { name:'الأستاذ رياض قاسمي', title:'محامٍ معتمد لدى المجلس', company:'مكتب قاسمي للمحاماة', tagline:'استشارات قانونية وتمثيل قضائي', address:'نهج العربي بن مهيدي، الجزائر' },
    fr: { name:'Maître Riad Kacimi', title:'Avocat agréé près la Cour', company:'Cabinet Kacimi', tagline:'Conseil juridique et représentation', address:'Rue Larbi Ben M’hidi, Alger' },
    en: { name:'Riad Kacimi', title:'Attorney at Law', company:'Kacimi Law Office', tagline:'Legal advice and representation', address:'Larbi Ben M’hidi St., Algiers' }
  },
  edu: {
    contact: { phone:'0698 76 54 32', phone2:'', email:'n.saadi@ecole-moustakbal.dz', web:'www.ecole-moustakbal.dz', social:'@ecole.moustakbal' },
    ar: { name:'أ. نادية سعدي', title:'أستاذة الرياضيات', company:'مدرسة المستقبل الخاصة', tagline:'دروس دعم لجميع المستويات', address:'حي 500 مسكن، بجاية' },
    fr: { name:'Nadia Saadi', title:'Professeure de mathématiques', company:'École privée El Moustakbal', tagline:'Cours de soutien tous niveaux', address:'Cité 500 logements, Béjaïa' },
    en: { name:'Nadia Saadi', title:'Mathematics Teacher', company:'El Moustakbal Private School', tagline:'Tutoring for all levels', address:'500 Housing district, Bejaia' }
  },
  shop: {
    contact: { phone:'0541 98 76 54', phone2:'', email:'hello@cafe-yasmine.dz', web:'www.cafe-yasmine.dz', social:'@cafe.yasmine' },
    ar: { name:'سليم عمراني', title:'المالك', company:'مقهى الياسمين', tagline:'قهوة مختصة وحلويات منزلية', address:'ساحة أول نوفمبر، وهران' },
    fr: { name:'Salim Amrani', title:'Gérant', company:'Café Yasmine', tagline:'Café de spécialité et pâtisseries maison', address:'Place du 1er Novembre, Oran' },
    en: { name:'Salim Amrani', title:'Owner', company:'Yasmine Café', tagline:'Specialty coffee and homemade pastries', address:'1st November Square, Oran' }
  },
  beauty: {
    contact: { phone:'0667 12 12 12', phone2:'', email:'rdv@salon-lamsa.dz', web:'www.salon-lamsa.dz', social:'@salon.lamsa' },
    ar: { name:'أمينة زروقي', title:'خبيرة تجميل', company:'صالون لمسة', tagline:'عناية، تجميل وتسريحات', address:'شارع ديدوش مراد، الجزائر' },
    fr: { name:'Amina Zerrouki', title:'Esthéticienne', company:'Salon Lamsa', tagline:'Soins, beauté et coiffure', address:'Rue Didouche Mourad, Alger' },
    en: { name:'Amina Zerrouki', title:'Beauty Specialist', company:'Lamsa Salon', tagline:'Care, beauty and hairstyling', address:'Didouche Mourad St., Algiers' }
  },
  free: {
    contact: { phone:'0772 34 56 78', phone2:'', email:'hello@rania.studio', web:'www.rania.studio', social:'@rania.studio' },
    ar: { name:'رانيا حداد', title:'مصممة هوية بصرية', company:'استوديو رانيا', tagline:'علامات تبقى في الذاكرة', address:'تيزي وزو' },
    fr: { name:'Rania Haddad', title:'Designer d’identité visuelle', company:'Studio Rania', tagline:'Des marques qui restent en mémoire', address:'Tizi Ouzou' },
    en: { name:'Rania Haddad', title:'Brand Identity Designer', company:'Studio Rania', tagline:'Brands people remember', address:'Tizi Ouzou' }
  }
};
const ID_KEYS = ['name', 'title', 'company', 'tagline'];
const CT_KEYS = ['phone', 'phone2', 'email', 'web', 'address', 'social'];
const BI_KEYS = ['name', 'title', 'company', 'tagline', 'address'];
const LTR_KEYS = { phone:1, phone2:1, email:1, web:1, social:1 };

/* ---------------------------------------------------------
   Helpers
--------------------------------------------------------- */
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
function hexRgb(h) { h = String(h || '#000').replace('#', ''); if (h.length === 3) h = h.split('').map(x => x + x).join(''); const n = parseInt(h, 16) || 0; return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function toHex(r, g, b) { return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join(''); }
function shade(hex, amt) { const [r, g, b] = hexRgb(hex); const t = amt < 0 ? 0 : 255, p = Math.abs(amt); return toHex(r + (t - r) * p, g + (t - g) * p, b + (t - b) * p); }
function alpha(hex, a) { const [r, g, b] = hexRgb(hex); return `rgba(${r},${g},${b},${a})`; }
const isArText = s => /[\u0600-\u06FF]/.test(s || '');
const wait = ms => new Promise(r => setTimeout(r, ms));

const SKIP_WORDS = ['مجموعة','مكتب','شركة','مؤسسة','عيادة','مدرسة','مقهى','صالون','استوديو','الأستاذ','الأستاذة','د.','م.','أ.',
  'groupe','group','cabinet','bureau','clinique','clinic','école','ecole','school','café','cafe','salon','studio','the','dr','dr.','maître','me','mr','mrs'];
function initialOf(text) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean);
  const w = words.find(x => !SKIP_WORDS.includes(x.toLowerCase())) || words[0] || '';
  let ch = Array.from(w.replace(/^ال(?=..)/, ''))[0] || '';
  return ch.toUpperCase();
}

/* ---------------------------------------------------------
   Card building blocks (SVGs carry literal colours so exports match)
--------------------------------------------------------- */
const IC = {
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  mail:  '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  web:   '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  pin:   '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  at:    '<circle cx="12" cy="12" r="4"/><path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1"/>'
};
const KEY_IC = { phone:'phone', phone2:'phone', email:'mail', web:'web', address:'pin', social:'at' };
const svgIcon = (name, color, size = 8, sw = 2.2) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${IC[name]}</svg>`;
const deco = inner => `<svg class="deco" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><g stroke="none">${inner}</g></svg>`;

const fit = (cls, text) => text ? `<div class="fit ${cls}">${esc(text)}</div>` : '';
const fitL = (cls, text) => text ? `<div class="fit ${cls}"><span class="ltrx">${esc(text)}</span></div>` : '';
function ctItem(c, k) {
  const v = c.d[k]; if (!v) return '';
  return `<div class="ct"><i>${svgIcon(KEY_IC[k], c.ic)}</i><span${LTR_KEYS[k] ? ' class="ltrx"' : ''}>${esc(v)}</span></div>`;
}
function contacts(c, o = {}) {
  const keys = (o.keys || CT_KEYS).filter(k => c.d[k]).slice(0, o.max || 6);
  if (!keys.length) return '<div class="cts"></div>';
  return `<div class="cts">${keys.map(k => ctItem(c, k)).join('')}</div>`;
}
function mono(c, src) {
  if (c.logo) return `<div class="mono img"><img src="${c.logo}" alt=""></div>`;
  return `<div class="mono">${esc(initialOf(src || c.d.company || c.d.name))}</div>`;
}
const qrBox = c => c.qr ? `<div class="qr"><img src="${c.qr}" alt=""></div>` : '';

/* ---------------------------------------------------------
   Designs — phase 1 (10 of 20)
   front(c): person side · back(c): brand side
--------------------------------------------------------- */
const TEMPLATES = [
  {
    id:'noir', cat:'corp', name:{ ar:'أسود وذهبي', fr:'Noir et or', en:'Noir & Gold' },
    acc:'#C9A45C', swatches:['#C9A45C','#D6D6D6','#C98B7A','#6FB59B','#8FA8D8'],
    fonts:{ ar:['El Messiri','Tajawal'], la:['Playfair Display','Inter'] },
    ic: c => c.acc,
    front: c => `<div class="frame"></div><div class="P">
      <div class="top"><div class="who">${fit('nm', c.d.name)}${fit('ttl', c.d.title)}${fit('co2', c.d.company)}<div class="rule"></div></div>${mono(c)}</div>
      <div class="bot">${contacts(c, { max:4 })}${qrBox(c)}</div></div>`,
    back: c => `<div class="frame"></div><div class="B">${mono(c)}${fit('co', c.d.company)}${fit('tg', c.d.tagline)}<div class="rule"></div>
      ${c.d.web ? `<div class="web"><span class="ltrx">${esc(c.d.web)}</span></div>` : ''}</div>`
  },
  {
    id:'mini', cat:'corp', name:{ ar:'أبيض أنيق', fr:'Blanc épuré', en:'Clean White' },
    acc:'#2F5770', swatches:['#2F5770','#1F7A5C','#8B2E3C','#C27A1E','#4B3F9E'],
    fonts:{ ar:['Tajawal','Tajawal'], la:['Poppins','Inter'] },
    ic: c => c.acc,
    front: c => `<div class="bar"></div><div class="P">
      <div class="top">${mono(c)}${fit('co', c.d.company)}</div>
      <div class="who">${fit('nm', c.d.name)}${fit('ttl', c.d.title)}</div><div class="rule"></div>${contacts(c, { max:4, keys:['phone','email','web','address','phone2','social'] })}</div>`,
    back: c => `<div class="B">${mono(c)}${fit('co', c.d.company)}${fit('tg', c.d.tagline)}${qrBox(c)}
      ${c.d.web ? `<div class="web"><span class="ltrx">${esc(c.d.web)}</span></div>` : ''}</div>`
  },
  {
    id:'geo', cat:'corp', name:{ ar:'هندسي', fr:'Géométrique', en:'Geometric' },
    acc:'#E0A230', swatches:['#E0A230','#2F80C9','#D1495B','#2BA58A','#8E5BD8'],
    fonts:{ ar:['Cairo','Cairo'], la:['Poppins','Poppins'] },
    ic: () => '#FFFFFF',
    front: c => {
      const P = pts => pts.map(([x, y]) => `${c.X(x)},${y}`).join(' ');
      return deco(`<polygon points="${P([[246,0],[340,0],[340,220],[206,220]])}" fill="#1E2A38"/>
        <polygon points="${P([[290,0],[340,0],[340,118]])}" fill="${c.acc}"/>
        <polygon points="${P([[206,220],[340,96],[340,220]])}" fill="${c.acc}" fill-opacity=".92"/>
        <polygon points="${P([[246,0],[270,0],[222,108]])}" fill="${c.accL}" fill-opacity=".45"/>`) +
        `<div class="P">${fit('nm', c.d.name)}${fit('ttl', c.d.title)}${fit('co', c.d.company)}${contacts(c, { max:4 })}</div>${mono(c)}`;
    },
    back: c => {
      const P = pts => pts.map(([x, y]) => `${c.X(x)},${y}`).join(' ');
      return `<div class="B">` + deco(`<polygon points="${P([[340,0],[340,92],[248,0]])}" fill="${c.acc}"/>
        <polygon points="${P([[340,92],[340,142],[300,92]])}" fill="${c.accL}" fill-opacity=".5"/>
        <polygon points="${P([[0,220],[0,148],[72,220]])}" fill="${c.acc}" fill-opacity=".85"/>
        <polygon points="${P([[72,220],[112,220],[72,184]])}" fill="#FFFFFF" fill-opacity=".14"/>`) +
        `<div class="mid">${mono(c)}${fit('co', c.d.company)}${fit('tg', c.d.tagline)}</div>${qrBox(c)}</div>`;
    }
  },
  {
    id:'med', cat:'med', name:{ ar:'طبي هادئ', fr:'Médical', en:'Medical' },
    acc:'#0E8C8C', swatches:['#0E8C8C','#2F80C9','#3C9A5F','#7A5BC7','#D0587E'],
    fonts:{ ar:['Almarai','Almarai'], la:['Poppins','Inter'] },
    ic: c => c.acc,
    front: c => {
      const X = c.X;
      const w1 = `M${X(0)} 176 C ${X(100)} 156, ${X(180)} 206, ${X(260)} 184 S ${X(330)} 168, ${X(340)} 172 L ${X(340)} 220 L ${X(0)} 220 Z`;
      const w2 = `M${X(0)} 188 C ${X(90)} 168, ${X(170)} 214, ${X(250)} 194 S ${X(320)} 180, ${X(340)} 186 L ${X(340)} 220 L ${X(0)} 220 Z`;
      const badge = c.logo ? `<div class="badge"><img src="${c.logo}" alt=""></div>`
        : `<div class="badge"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></div>`;
      return deco(`<path d="${w1}" fill="${c.accL}" fill-opacity=".6"/><path d="${w2}" fill="${c.acc}"/>`) +
        `<div class="P"><div class="top">${badge}<div class="who">${fit('nm', c.d.name)}${fit('ttl', c.d.title)}</div></div>${fit('co', c.d.company)}
        ${contacts(c, { max:4, keys:['phone','phone2','email','address','social'] })}</div>
        ${c.d.web ? `<div class="wv"><span class="ltrx">${esc(c.d.web)}</span></div>` : ''}`;
    },
    back: c => {
      const cx = c.X(292);
      return `<div class="B">` + deco(`<circle cx="${cx}" cy="110" r="42" fill="#FFFFFF" fill-opacity=".07"/>
        <circle cx="${cx}" cy="110" r="64" fill="none" stroke="#FFFFFF" stroke-opacity=".13" stroke-width=".8"/>
        <circle cx="${cx}" cy="110" r="86" fill="none" stroke="#FFFFFF" stroke-opacity=".09" stroke-width=".8"/>
        <circle cx="${cx}" cy="110" r="108" fill="none" stroke="#FFFFFF" stroke-opacity=".05" stroke-width=".8"/>`) +
        `<div class="mid">${mono(c)}${fit('co', c.d.company)}${fit('tg', c.d.tagline)}${c.d.phone ? `<div class="ph"><span class="ltrx">${esc(c.d.phone)}</span></div>` : ''}</div>${qrBox(c)}</div>`;
    }
  },
  {
    id:'bp', cat:'eng', name:{ ar:'مخطط هندسي', fr:'Plan technique', en:'Blueprint' },
    acc:'#133B66', swatches:['#133B66','#1E4F46','#3A2F5E','#23303F','#5A2A2A'],
    fonts:{ ar:['Cairo','Cairo'], la:['Inter','Inter'] },
    ic: () => '#FFFFFF',
    front: c => gridSVG() +
      `<div class="dim"><svg width="296" height="10" viewBox="0 0 296 10" fill="none" stroke="#FFFFFF" stroke-opacity=".6" stroke-width=".8"><path d="M0 5H296M0 1v8M296 1v8M0 5l5-2.5M0 5l5 2.5M296 5l-5-2.5M296 5l-5 2.5"/></svg><b>85 mm</b></div>
      <div class="P">${fit('nm', c.d.name)}${fit('ttl', c.d.title)}${contacts(c, { max:4 })}</div>
      ${(c.d.company || c.d.tagline) ? `<div class="tb">${fit('co', c.d.company)}${fit('', c.d.tagline)}</div>` : ''}`,
    back: c => gridSVG() + `<div class="B"><div class="mid"><div class="ring">${mono(c)}</div>${fit('co', c.d.company)}${fit('tg', c.d.tagline)}</div>${qrBox(c)}</div>`
  },
  {
    id:'law', cat:'law', name:{ ar:'رسمي وقور', fr:'Classique', en:'Classic Law' },
    acc:'#6B1E2B', swatches:['#6B1E2B','#1F3A5F','#2E4A3A','#4A3B2A','#222831'],
    fonts:{ ar:['Amiri','Amiri'], la:['Playfair Display','Playfair Display'] },
    ic: c => c.acc,
    front: c => {
      const r1 = ['phone','email'].map(k => ctItem(c, k)).join('');
      const r2 = ['web','phone2'].map(k => ctItem(c, k)).join('');
      const r3 = ctItem(c, 'address');
      return `<div class="f1"></div><div class="f2"></div><div class="P">${fit('nm', c.d.name)}${fit('ttl', c.d.title)}
        <div class="orn"><span></span><i></i><span></span></div>
        <div class="cts">${r1 ? `<div class="row">${r1}</div>` : ''}${r2 ? `<div class="row">${r2}</div>` : ''}${r3 ? `<div class="row">${r3}</div>` : ''}</div></div>`;
    },
    back: c => `<div class="B"><div class="f1"></div><div class="f2"></div><div class="mid">${mono(c)}${fit('co', c.d.company)}${fit('tg', c.d.tagline)}</div>${qrBox(c)}</div>`
  },
  {
    id:'edu', cat:'edu', name:{ ar:'تعليمي مرح', fr:'Éducatif', en:'Playful Class' },
    acc:'#F0735A', swatches:['#F0735A','#4C7CF0','#9B5DE5','#2BA58A','#E4A11B'],
    fonts:{ ar:['Tajawal','Tajawal'], la:['Poppins','Poppins'] },
    ic: () => '#FFFFFF',
    front: c => {
      const X = c.X;
      return deco(`<circle cx="${X(322)}" cy="206" r="66" fill="#F2B632" fill-opacity=".9"/>
        <circle cx="${X(252)}" cy="190" r="11" fill="#3FB8A0"/>
        <circle cx="${X(299)}" cy="42" r="33" fill="${c.acc}" fill-opacity=".16"/>
        <circle cx="${X(250)}" cy="28" r="4" fill="${c.acc}"/>
        <path d="M${X(236)} 76 Q ${X(244)} 68 ${X(252)} 76 T ${X(268)} 76 T ${X(284)} 76" stroke="#3FB8A0" stroke-width="2" fill="none" stroke-linecap="round"/>`) +
        `<div class="P">${fit('nm', c.d.name)}${fit('ttl', c.d.title)}${fit('co', c.d.company)}${contacts(c, { max:4 })}</div>${mono(c)}`;
    },
    back: c => {
      const X = c.X;
      return `<div class="B">` + deco(`<circle cx="${X(18)}" cy="18" r="52" fill="${c.acc}" fill-opacity=".2"/>
        <circle cx="${X(330)}" cy="212" r="62" fill="#3FB8A0" fill-opacity=".28"/>
        <circle cx="${X(292)}" cy="38" r="9" fill="#F2B632"/>
        <circle cx="${X(86)}" cy="200" r="5" fill="${c.acc}"/>`) +
        `<div class="mid">${mono(c)}${fit('co', c.d.company)}${fit('tg', c.d.tagline)}</div>${qrBox(c)}</div>`;
    }
  },
  {
    id:'cafe', cat:'shop', sample:'shop', name:{ ar:'مقهى', fr:'Café kraft', en:'Kraft Café' },
    acc:'#4A2C1A', swatches:['#4A2C1A','#1F3B2E','#3B2A4A','#2B2B2B','#6B2E1E'],
    fonts:{ ar:['El Messiri','Tajawal'], la:['Playfair Display','Inter'] },
    ic: c => c.acc,
    front: c => {
      const cup = c.logo ? `<img src="${c.logo}" alt="">`
        : `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="${c.acc}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M8 3c-.8 1 .8 2 0 3M12 3c-.8 1 .8 2 0 3"/></svg>`;
      const sep = c.rtl ? '، ' : ', ';
      const own = [c.d.name, c.d.title].filter(Boolean).join(sep);
      const row = ['phone','address','social'].map(k => ctItem(c, k)).join('');
      return `<div class="P"><div class="stamp"><div class="cup">${cup}</div>${fit('co', c.d.company)}${fit('tg', c.d.tagline)}</div>${fit('own', own)}</div>
        <div class="row">${row}</div>`;
    },
    back: c => `<div class="B"><div class="mid">${c.d.tagline ? `<div class="tgb">${esc(c.d.tagline)}</div>` : ''}<div class="rule"></div>
      ${c.d.social ? `<div class="soc"><span class="ltrx">${esc(c.d.social)}</span></div>` : ''}${fit('addr', c.d.address)}</div>${qrBox(c)}</div>`
  },
  {
    id:'beauty', cat:'shop', sample:'beauty', name:{ ar:'تجميل', fr:'Beauté', en:'Blush Beauty' },
    acc:'#A8695C', swatches:['#A8695C','#9C5B7A','#7E6A9E','#B08A4A','#5E7C6E'],
    fonts:{ ar:['El Messiri','Tajawal'], la:['Playfair Display','Poppins'] },
    ic: c => c.accD,
    front: c => {
      const cx = c.X(318);
      return deco(`<circle cx="${cx}" cy="34" r="58" fill="none" stroke="${c.acc}" stroke-opacity=".5" stroke-width=".8"/>
        <circle cx="${cx}" cy="34" r="78" fill="none" stroke="${c.acc}" stroke-opacity=".32" stroke-width=".8"/>
        <circle cx="${cx}" cy="34" r="98" fill="none" stroke="${c.acc}" stroke-opacity=".2" stroke-width=".8"/>
        <circle cx="${c.X(270)}" cy="72" r="3" fill="${c.acc}"/>`) +
        `<div class="P">${fit('co', c.d.company)}${fit('tg', c.d.tagline)}<div class="who">${fit('nm', c.d.name)}${fit('ttl', c.d.title)}</div>
        ${contacts(c, { max:4, keys:['phone','social','address','email','web','phone2'] })}</div>`;
    },
    back: c => {
      const a = c.X(0), b = c.X(340);
      return `<div class="B">` + deco(`<circle cx="${a}" cy="220" r="62" fill="none" stroke="${c.acc}" stroke-opacity=".4" stroke-width=".8"/>
        <circle cx="${a}" cy="220" r="84" fill="none" stroke="${c.acc}" stroke-opacity=".22" stroke-width=".8"/>
        <circle cx="${b}" cy="0" r="52" fill="none" stroke="${c.acc}" stroke-opacity=".4" stroke-width=".8"/>
        <circle cx="${b}" cy="0" r="72" fill="none" stroke="${c.acc}" stroke-opacity=".22" stroke-width=".8"/>`) +
        `<div class="mid">${mono(c)}${fit('co', c.d.company)}${c.d.social ? `<div class="soc"><span class="ltrx">${esc(c.d.social)}</span></div>` : ''}</div>${qrBox(c)}</div>`;
    }
  },
  {
    id:'crea', cat:'free', name:{ ar:'مبدع', fr:'Créatif', en:'Creative Block' },
    acc:'#5B3FD8', swatches:['#5B3FD8','#E4572E','#0F8B8D','#D6336C','#1F1F1F'],
    fonts:{ ar:['Cairo','Tajawal'], la:['Poppins','Inter'] },
    ic: () => '#FFFFFF',
    front: c => `<div class="blk">${c.logo ? `<div class="logo"><div class="mono img" style="width:100%;height:100%"><img src="${c.logo}" alt=""></div></div>` : ''}
      <div class="big">${esc(initialOf(c.d.name || c.d.company))}</div></div>
      <div class="P">${fit('nm', c.d.name)}${fit('ttl', c.d.title)}<div class="sq"></div>${contacts(c, { max:4, keys:['phone','email','web','social','address','phone2'] })}</div>`,
    back: c => {
      const RX = (x, w) => c.rtl ? W - x - w : x;
      return `<div class="B">` + deco(`<rect x="${RX(196,112)}" y="22" width="112" height="112" fill="none" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="1"/>
        <rect x="${RX(214,112)}" y="40" width="112" height="112" fill="none" stroke="#FFFFFF" stroke-opacity=".2" stroke-width="1"/>
        <rect x="${RX(30,14)}" y="30" width="14" height="14" fill="#FFFFFF" fill-opacity=".9"/>`) +
        `<div class="mid">${fitL('soc', c.d.social || c.d.web)}${fit('co', c.d.company)}${(c.d.social && c.d.web) ? `<div class="web"><span class="ltrx">${esc(c.d.web)}</span></div>` : ''}</div>${qrBox(c)}</div>`;
    }
  }
];
/* ---------------------------------------------------------
   NEW designs (10) — Luxury · Minimalist · Corporate · Premium · Elegant
   Free for now (marked NEW in the gallery). SVG ids are unique per card so
   thumbnails, both faces and exports never share a gradient / pattern.
--------------------------------------------------------- */
let SVG_UID = 0;
const uid = p => `${p}${++SVG_UID}`;
const mirror = (c, inner) => c.rtl ? `<g transform="translate(${W} 0) scale(-1 1)">${inner}</g>` : inner;
const CT_LAB = {
  ar: { phone:'هاتف', phone2:'هاتف', email:'بريد', web:'موقع', address:'عنوان', social:'تواصل' },
  fr: { phone:'Tél', phone2:'Tél', email:'Mail', web:'Web', address:'Adr.', social:'Social' },
  en: { phone:'Tel', phone2:'Tel', email:'Mail', web:'Web', address:'Addr', social:'Social' }
};
function labRows(c, keys, max) {
  const L = CT_LAB[c.lang] || CT_LAB.en;
  return keys.filter(k => c.d[k]).slice(0, max).map(k =>
    `<div class="lr"><b>${L[k]}</b><span${LTR_KEYS[k] ? ' class="ltrx"' : ''}>${esc(c.d[k])}</span></div>`).join('');
}
function splitName(name) {
  const w = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (w.length < 2) return [w.join(' '), ''];
  return [w.slice(0, -1).join(' '), w[w.length - 1]];
}
const GOLD = '#C9A86A';
function octSVG(c, s) {
  const r = s / 2 - 1, r2 = r - 3.2, P = rr => Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI / 8) + i * Math.PI / 4;
    return `${(s / 2 + rr * Math.cos(a)).toFixed(2)},${(s / 2 + rr * Math.sin(a)).toFixed(2)}`;
  }).join(' ');
  return `<svg class="oct-svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><polygon points="${P(r)}" fill="none" stroke="${c.acc}" stroke-width=".9"/>
    <polygon points="${P(r2)}" fill="none" stroke="${c.acc}" stroke-width=".45" stroke-opacity=".6"/></svg>`;
}
function decoFrame(c) {
  const id = uid('dg');
  const ch = (i, k) => { const a = i, b = W - i, t = i, u = H - i; return `${a + k},${t} ${b - k},${t} ${b},${t + k} ${b},${u - k} ${b - k},${u} ${a + k},${u} ${a},${u - k} ${a},${t + k}`; };
  return deco(`<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.accD}"/><stop offset=".35" stop-color="${c.accL}"/><stop offset=".6" stop-color="${c.acc}"/><stop offset="1" stop-color="${c.accD}"/></linearGradient></defs>
    <polygon points="${ch(10, 9)}" fill="none" stroke="url(#${id})" stroke-width=".9"/>
    <polygon points="${ch(14, 7)}" fill="none" stroke="${c.acc}" stroke-opacity=".4" stroke-width=".45"/>
    <polygon points="170,6.5 173.5,10 170,13.5 166.5,10" fill="${c.acc}"/><polygon points="170,206.5 173.5,210 170,213.5 166.5,210" fill="${c.acc}"/>`);
}
function sunburst(c) {
  let g = '';
  for (let i = 0; i < 48; i++) {
    const a = i * Math.PI / 24, r1 = i % 2 ? 50 : 42, r2 = 260;
    g += `<path d="M${(170 + r1 * Math.cos(a)).toFixed(1)} ${(78 + r1 * Math.sin(a)).toFixed(1)}L${(170 + r2 * Math.cos(a)).toFixed(1)} ${(78 + r2 * Math.sin(a)).toFixed(1)}"/>`;
  }
  return `<g stroke="${c.acc}" stroke-opacity=".13" stroke-width=".55" fill="none">${g}</g>`;
}
function blobs(c, v) {
  const a = uid('ab'), b = uid('ab'), d = uid('ab');
  const rg = (id, col, o) => `<radialGradient id="${id}"><stop offset="0" stop-color="${col}" stop-opacity="${o}"/><stop offset=".55" stop-color="${col}" stop-opacity="${o * .35}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient>`;
  const pos = v ? [[60, 30, 170], [300, 210, 160], [330, 20, 90]] : [[300, 10, 180], [20, 230, 150], [190, 260, 110]];
  return deco(`<defs>${rg(a, c.acc, .9)}${rg(b, '#16C7D6', .55)}${rg(d, '#FF5FA2', .45)}</defs>` + mirror(c,
    `<circle cx="${pos[0][0]}" cy="${pos[0][1]}" r="${pos[0][2]}" fill="url(#${a})"/>
     <circle cx="${pos[1][0]}" cy="${pos[1][1]}" r="${pos[1][2]}" fill="url(#${b})"/>
     <circle cx="${pos[2][0]}" cy="${pos[2][1]}" r="${pos[2][2]}" fill="url(#${d})"/>`));
}
function veins(c, dark) {
  const g = dark ? '#FFFFFF' : '#B9B2A6', go = dark ? '.08' : '.38';
  const grey = [
    ['M-10 40 C 60 30, 90 70, 150 60 S 260 20, 350 50', .8], ['M-10 150 C 40 140, 80 172, 140 160 S 230 118, 350 140', .6],
    ['M80 -10 C 95 40, 70 90, 110 130 S 120 200, 150 230', .5], ['M232 -10 C 220 50, 262 80, 250 130 S 282 200, 300 230', .7],
    ['M-10 95 C 50 102, 70 80, 122 92', .4], ['M200 230 C 212 190, 262 180, 350 192', .5], ['M150 60 C 170 90, 160 120, 190 140', .35]
  ].map(([d, w]) => `<path d="${d}" stroke="${g}" stroke-opacity="${go}" stroke-width="${w}"/>`).join('');
  const gold = [['M-10 184 C 60 170, 110 202, 170 186 S 280 160, 350 176', .8], ['M252 -10 C 264 30, 240 62, 270 98', .55], ['M30 -10 C 40 20, 22 40, 44 64', .4]]
    .map(([d, w]) => `<path d="${d}" stroke="${c.acc}" stroke-opacity="${dark ? .55 : .6}" stroke-width="${w}"/>`).join('');
  return deco(`<g fill="none" stroke-linecap="round">${mirror(c, grey + gold)}</g>`);
}
function carbon() {
  const id = uid('cb');
  return `<defs><pattern id="${id}" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="#FFFFFF" fill-opacity=".03"/><rect x="3" y="3" width="3" height="3" fill="#FFFFFF" fill-opacity=".03"/></pattern></defs><rect width="${W}" height="${H}" fill="url(#${id})"/>`;
}
const pad = (x, y, c) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#111418" stroke="${c.acc}" stroke-width="1"/>`;
function chipSVG(c, s) {
  const m = s * 0.2, e = s - m; let pins = '';
  [0.35, 0.5, 0.65].forEach(f => {
    const p = (s * f).toFixed(1);
    pins += `<path d="M${p} 0V${m}M${p} ${e}V${s}M0 ${p}H${m}M${e} ${p}H${s}"/>`;
  });
  return `<svg class="cpu-svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><g stroke="${c.acc}" stroke-width="1" fill="none">${pins}
    <rect x="${m}" y="${m}" width="${s - 2 * m}" height="${s - 2 * m}" rx="${s * 0.06}" fill="#15191E"/></g></svg>`;
}
function sprig(color, op) {
  const leaf = (x, y, a, k = 1) => `<path d="M0 0 C3 -5 10 -6 14 -1 C10 3 3 3 0 0Z" transform="translate(${x} ${y}) rotate(${a}) scale(${k})"/>`;
  return `<g fill="${color}" fill-opacity="${op}" stroke="none">${leaf(20, 64, -150)}${leaf(20.5, 60, -32)}${leaf(20.2, 48, -155, .95)}${leaf(20.8, 44, -28, .95)}
    ${leaf(20.6, 32, -158, .85)}${leaf(21.2, 28, -25, .85)}${leaf(21.2, 17, -160, .7)}${leaf(21.8, 13, -22, .7)}${leaf(21.8, 8, -88, .6)}</g>
    <path d="M20 79 C 20 60, 19 38, 22 6" stroke="${color}" stroke-opacity="${Math.min(1, op + .2)}" stroke-width="1" fill="none" stroke-linecap="round"/>`;
}
const corners = (col, i = 10, l = 18) => `<g stroke="${col}" stroke-width=".9" fill="none">
  <path d="M${i} ${i + l}V${i}H${i + l}M${W - i - l} ${i}H${W - i}V${i + l}M${W - i} ${H - i - l}V${H - i}H${W - i - l}M${i + l} ${H - i}H${i}V${H - i - l}"/>
  <path d="M${i + 4} ${i + l - 6}V${i + 4}H${i + l - 6}M${W - i - l + 6} ${i + 4}H${W - i - 4}V${i + l - 6}M${W - i - 4} ${H - i - l + 6}V${H - i - 4}H${W - i - l + 6}M${i + l - 6} ${H - i - 4}H${i + 4}V${H - i - l + 6}" stroke-opacity=".55" stroke-width=".5"/></g>`;
const webSoc = (c, cls = 'ws') => {
  const v = [c.d.web, c.d.social].filter(Boolean);
  return v.length ? `<div class="${cls}">${v.map(x => `<span class="ltrx">${esc(x)}</span>`).join('<i></i>')}</div>` : '';
};

const NEW_TEMPLATES = [
  /* 1 · Luxury — Art Deco gold on black */
  {
    id:'deco', cat:'corp', name:{ ar:'آرت ديكو ذهبي', fr:'Art déco doré', en:'Art Deco Gold' },
    acc:'#D4AF37', swatches:['#D4AF37','#C9CED6','#E0A98C','#8FC9A9','#B9A6E8'],
    fonts:{ ar:['Reem Kufi','IBM Plex Sans Arabic'], la:['Cormorant Garamond','Montserrat'] },
    ic: c => c.acc,
    front: c => decoFrame(c) + `<div class="vl"></div>
      <div class="P"><div class="who">${fit('co2 caps', c.d.company)}${fit('nm', c.d.name)}${fit('ttl caps', c.d.title)}<div class="foil"><i></i></div></div>
      ${contacts(c, { max:4 })}</div>
      <div class="side"><div class="oct">${octSVG(c, 50)}${mono(c)}</div>${qrBox(c)}</div>`,
    back: c => `<div class="B">` + deco(sunburst(c)) + decoFrame(c) +
      `<div class="mid"><div class="oct">${octSVG(c, 62)}${mono(c)}</div>${fit('co caps', c.d.company)}${fit('tg', c.d.tagline)}<div class="foil"><i></i></div></div>
      ${webSoc(c)}</div>`
  },
  /* 2 · Minimalist — Swiss grid */
  {
    id:'swiss', cat:'free', name:{ ar:'سويسري بسيط', fr:'Suisse minimal', en:'Swiss Minimal' },
    acc:'#E63B2E', swatches:['#E63B2E','#111111','#1F4FD6','#0E9F6E','#F2A900'],
    fonts:{ ar:['IBM Plex Sans Arabic','IBM Plex Sans Arabic'], la:['Inter','Inter'] },
    ic: c => c.acc,
    front: c => `<div class="dot"></div><div class="P">
      <div class="top">${mono(c)}${fit('co caps', c.d.company)}</div>
      <div class="who">${fit('nm', c.d.name)}${fit('ttl', c.d.title)}</div>
      <div class="ln"></div>
      <div class="bot"><div class="lab">${labRows(c, ['phone','email','web','address','phone2','social'], 4)}</div>${qrBox(c)}</div></div>`,
    back: c => `<div class="B"><div class="top">${mono(c)}${c.d.web ? `<span class="wb ltrx">${esc(c.d.web)}</span>` : ''}</div>
      <div class="bt"><div class="ln"></div>${fit('co', c.d.company)}${fit('tg', c.d.tagline)}${fitL('soc', c.d.social)}</div></div>`
  },
  /* 3 · Corporate — Executive navy & gold band */
  {
    id:'exec', cat:'corp', name:{ ar:'تنفيذي كحلي', fr:'Exécutif marine', en:'Executive Navy' },
    acc:'#14284B', swatches:['#14284B','#1D3B2F','#4A1E2C','#2B2D33','#0E4A5C'],
    fonts:{ ar:['Cairo','IBM Plex Sans Arabic'], la:['Montserrat','Montserrat'] },
    ic: () => '#D9B873',
    front: c => `<div class="top"><div class="who">${fit('nm', c.d.name)}${fit('ttl caps', c.d.title)}${fit('co2', c.d.company)}</div>${mono(c)}</div>
      <div class="band"><div class="gl"></div>${contacts(c, { max:6, keys:['phone','email','phone2','web','address','social'] })}</div>`,
    back: c => {
      let s = ''; for (let x = -220; x < W + 220; x += 9) s += `<path d="M${x} 0L${x + 220} ${H}"/>`;
      return `<div class="B">` + deco(`<g stroke="#FFFFFF" stroke-opacity=".05" stroke-width=".6" fill="none">${s}</g>`) +
        `<div class="mid"><div class="ring">${mono(c)}</div>${fit('co caps', c.d.company)}${fit('tg', c.d.tagline)}</div>
        ${c.d.web ? `<div class="wb"><span class="ltrx">${esc(c.d.web)}</span></div>` : ''}${qrBox(c)}</div>`;
    }
  },
  /* 4 · Elegant — Emerald arch on ivory */
  {
    id:'arch', cat:'shop', sample:'shop', name:{ ar:'قوس زمردي', fr:'Arche émeraude', en:'Emerald Arch' },
    acc:'#0F4D3A', swatches:['#0F4D3A','#1B2A4A','#5A1F2E','#3D2B56','#1F1F1F'],
    fonts:{ ar:['El Messiri','Almarai'], la:['Marcellus','Montserrat'] },
    ic: c => c.acc,
    front: c => `<div class="arch"><div class="in"></div>${mono(c)}<i class="st"></i></div>
      <div class="P">${fit('co2 caps', c.d.company)}${fit('nm', c.d.name)}${fit('ttl', c.d.title)}<div class="rule"></div>
      ${contacts(c, { max:4, keys:['phone','address','email','web','social','phone2'] })}</div>`,
    back: c => `<div class="B"><div class="arch"><div class="in"></div></div>
      <div class="mid">${mono(c)}${fit('co', c.d.company)}${fit('tg', c.d.tagline)}</div>
      <div class="side">${fitL('wb', c.d.web)}${fitL('wb', c.d.social)}</div>${qrBox(c)}</div>`
  },
  /* 5 · Premium — Aurora glass */
  {
    id:'aurora', cat:'free', name:{ ar:'شفق زجاجي', fr:'Aurore verre', en:'Aurora Glass' },
    acc:'#7B5CFF', swatches:['#7B5CFF','#00B3A4','#FF5C8A','#2F7BFF','#FF8A3D'],
    fonts:{ ar:['Cairo','Tajawal'], la:['Space Grotesk','Inter'] },
    ic: () => '#FFFFFF',
    front: c => blobs(c, 0) + `<div class="P">
      <div class="top"><div class="who">${fit('nm', c.d.name)}${fit('ttl', c.d.title)}${fit('co2', c.d.company)}</div><div class="gm">${mono(c)}</div></div>
      <div class="glass">${contacts(c, { max:4, keys:['phone','email','web','address','social','phone2'] })}${qrBox(c)}</div></div>`,
    back: c => `<div class="B">` + blobs(c, 1) + `<div class="mid"><div class="gm">${mono(c)}</div>${fit('co', c.d.company)}${fit('tg', c.d.tagline)}
      ${c.d.web ? `<div class="pill"><span class="ltrx">${esc(c.d.web)}</span></div>` : ''}${fitL('soc', c.d.social)}</div></div>`
  },
  /* 6 · Elegant / Luxury — Marble & gold */
  {
    id:'marble', cat:'shop', sample:'beauty', name:{ ar:'رخام وذهب', fr:'Marbre et or', en:'Marble & Gold' },
    acc:'#B8934A', swatches:['#B8934A','#9EA3A8','#B76E79','#5E7C6E','#3A3A3A'],
    fonts:{ ar:['Amiri','Almarai'], la:['Playfair Display','Montserrat'] },
    ic: () => '#FFFFFF',
    front: c => veins(c, false) + `<div class="seal">${mono(c)}</div>
      <div class="P">${fit('nm', c.d.name)}${fit('ttl caps', c.d.title)}<div class="rl"><span></span><i></i></div>${fit('co2', c.d.company)}
      ${contacts(c, { max:4, keys:['phone','social','email','address','web','phone2'] })}</div>`,
    back: c => `<div class="B">` + veins(c, true) + `<div class="mid">${mono(c)}${fit('co caps', c.d.company)}${fit('tg', c.d.tagline)}<div class="rl"><span></span><i></i><span></span></div>
      ${fitL('soc', c.d.social)}</div>${c.d.web ? `<div class="wb"><span class="ltrx">${esc(c.d.web)}</span></div>` : ''}${qrBox(c)}</div>`
  },
  /* 7 · Editorial — magazine masthead */
  {
    id:'edit', cat:'edu', name:{ ar:'تحريري', fr:'Éditorial', en:'Editorial' },
    acc:'#B23A48', swatches:['#B23A48','#1A1A1A','#2E5E8C','#3F6B4E','#9C6B30'],
    fonts:{ ar:['Amiri','IBM Plex Sans Arabic'], la:['Playfair Display','Inter'] },
    ic: c => c.acc,
    front: c => {
      const [n1, n2] = splitName(c.d.name);
      const LB = { ar:['الهاتف','على الإنترنت','العنوان'], fr:['Téléphone','En ligne','Adresse'], en:['Phone','Online','Address'] }[c.lang] || ['Phone','Online','Address'];
      const col = (lab, keys) => {
        const v = keys.filter(k => c.d[k]); if (!v.length) return '';
        return `<div class="col"><b>${lab}</b>${v.map(k => LTR_KEYS[k] ? fitL('v', c.d[k]) : fit('v', c.d[k])).join('')}</div>`;
      };
      return `<div class="P"><div class="mast">${fit('co caps', c.d.company)}${c.d.tagline ? fit('tgm', c.d.tagline) : ''}</div><div class="dbl"></div>
        <div class="nmw">${fit('nm n1', n1)}${fit('nm n2', n2)}</div>${fit('ttl caps', c.d.title)}
        <div class="cols">${col(LB[0], ['phone','phone2'])}${col(LB[1], ['email','web'])}${col(LB[2], ['address','social'])}</div></div>`;
    },
    back: c => `<div class="B"><div class="q mir">“</div><div class="qt">${esc(c.d.tagline || c.d.company)}</div><div class="rl"></div>
      ${fit('co caps', c.d.company)}${fit('nmb', c.d.name)}${mono(c)}${qrBox(c)}</div>`
  },
  /* 8 · Premium tech — Circuit carbon */
  {
    id:'circuit', cat:'eng', name:{ ar:'دارة كربونية', fr:'Circuit carbone', en:'Circuit Carbon' },
    acc:'#22D3EE', swatches:['#22D3EE','#A3E635','#F59E0B','#F472B6','#60A5FA'],
    fonts:{ ar:['Reem Kufi','Cairo'], la:['Space Grotesk','Space Grotesk'] },
    ic: c => c.acc,
    front: c => deco(carbon() + mirror(c, `<g stroke="${c.acc}" stroke-opacity=".55" stroke-width="1" fill="none" stroke-linejoin="round">
        <path d="M340 30H306L292 44H262"/><path d="M340 54H316L302 68H282L270 80H246"/><path d="M340 98H300L288 110H268"/><path d="M340 122H324L314 132"/></g>
        ${pad(262, 44, c)}${pad(246, 80, c)}${pad(268, 110, c)}${pad(314, 132, c)}`)) +
      `<div class="bar"></div><div class="P"><div class="top"><div class="cpu">${chipSVG(c, 28)}${mono(c)}</div>${fit('co caps', c.d.company)}</div>
      ${fit('nm', c.d.name)}${fit('ttl', c.d.title)}${contacts(c, { max:4 })}</div>
      ${c.qr ? `<div class="qrw"><i class="k1"></i><i class="k2"></i><i class="k3"></i><i class="k4"></i>${qrBox(c)}</div>` : ''}`,
    back: c => {
      const L = `<path d="M136 70H100L86 56H22"/><path d="M136 86H62"/><path d="M136 102H104L90 116H36"/><path d="M156 52V32L146 22H122"/>`;
      const R = `<g transform="translate(${W} 0) scale(-1 1)">${L}</g>`;
      const pads = [[22, 56], [62, 86], [36, 116], [122, 22]].map(([x, y]) => pad(x, y, c) + pad(W - x, y, c)).join('');
      return `<div class="B">` + deco(carbon() + `<g stroke="${c.acc}" stroke-opacity=".5" stroke-width="1" fill="none" stroke-linejoin="round">${L}${R}</g>${pads}`) +
        `<div class="cpu">${chipSVG(c, 68)}${mono(c)}</div><div class="mid">${fit('co caps', c.d.company)}${fit('tg', c.d.tagline)}</div>${webSoc(c)}</div>`;
    }
  },
  /* 9 · Elegant medical — Sage botanical */
  {
    id:'sage', cat:'med', name:{ ar:'مريمية هادئة', fr:'Sauge', en:'Sage Clinic' },
    acc:'#5E7D6A', swatches:['#5E7D6A','#4F7CA8','#8A6FA8','#C07A6A','#3E8E8A'],
    fonts:{ ar:['El Messiri','IBM Plex Sans Arabic'], la:['Cormorant Garamond','Poppins'] },
    ic: c => c.acc,
    front: c => `<div class="pill">${mono(c)}<svg class="spr" width="40" height="80" viewBox="0 0 40 80">${sprig(c.accD, .6)}</svg></div>
      <div class="P">${fit('nm', c.d.name)}${fit('ttl', c.d.title)}${fit('co2', c.d.company)}<div class="rule"></div>
      ${contacts(c, { max:4, keys:['phone','email','address','web','phone2','social'] })}</div>`,
    back: c => `<div class="B">` + deco(mirror(c, `<g transform="translate(250 64) scale(1.9)">${sprig('#FFFFFF', .14)}</g>`)) +
      `<div class="mid">${mono(c)}${fit('co', c.d.company)}${fit('tg', c.d.tagline)}
      ${(c.d.phone || c.d.phone2) ? `<div class="ph"><span class="ltrx">${esc([c.d.phone, c.d.phone2].filter(Boolean).join('  ·  '))}</span></div>` : ''}${fitL('soc', c.d.social)}</div>${qrBox(c)}</div>`
  },
  /* 10 · Luxury — Royal ribbon */
  {
    id:'ribbon', cat:'law', name:{ ar:'وشاح ملكي', fr:'Ruban royal', en:'Royal Ribbon' },
    acc:'#6E1423', swatches:['#6E1423','#13294B','#1E3D2F','#3A2E5C','#222222'],
    fonts:{ ar:['Amiri','Tajawal'], la:['Playfair Display','Poppins'] },
    ic: c => c.acc,
    front: c => deco(corners(GOLD) + mirror(c, `<polygon points="252,0 300,0 300,98 276,84 252,98" fill="${c.acc}"/>
        <path d="M256.5 0V90.5L276 79.3L295.5 90.5V0" stroke="${GOLD}" stroke-width=".6" fill="none"/>`)) +
      `<div class="rb">${mono(c)}</div>
      <div class="P">${fit('co2 caps', c.d.company)}${fit('nm', c.d.name)}${fit('ttl', c.d.title)}<div class="orn"><span></span><i></i><span></span></div></div>
      ${contacts(c, { max:4, keys:['phone','email','web','address','phone2','social'] })}`,
    back: c => `<div class="B">` + deco(corners(GOLD)) + `<div class="mid">${mono(c)}${fit('co', c.d.company)}${fit('tg', c.d.tagline)}
      <div class="orn"><span></span><i></i><span></span></div>${fit('addr', c.d.address)}</div>${webSoc(c)}${qrBox(c)}</div>`
  }
];
NEW_TEMPLATES.forEach(t => { t.isNew = true; TEMPLATES.push(t); });

/* ---------------------------------------------------------
   NEW designs — batch 3 (10): silk waves, data flow, pulse, arabesque,
   contour lines, zen sun, line bloom, code editor, halftone, gold leaf
--------------------------------------------------------- */
function rng(seed) { let s = seed >>> 0; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }
const stopsOf = st => st.map(([o, col, op = 1]) => `<stop offset="${o}" stop-color="${col}" stop-opacity="${op}"/>`).join('');
const linG = (id, st, x1, y1, x2, y2) => `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stopsOf(st)}</linearGradient>`;
const radG = (id, st) => `<radialGradient id="${id}">${stopsOf(st)}</radialGradient>`;
const bez = (a, b, c2, d, u) => { const v = 1 - u; return v * v * v * a + 3 * v * v * u * b + 3 * v * u * u * c2 + u * u * u * d; };

/* A · silk waves */
function silkTop(c) {
  const g = uid('sk');
  return deco(`<defs>${linG(g, [[0, c.accL], [1, c.acc]], 0, 0, 340, 0)}</defs>` + mirror(c,
    `<path d="M0 0H340V62C280 80 220 44 150 62S40 82 0 64Z" fill="${c.accL}" fill-opacity=".5"/>
     <path d="M0 0H340V47C270 65 200 31 130 49S30 63 0 49Z" fill="url(#${g})" fill-opacity=".75"/>
     <path d="M0 0H340V30C262 46 190 16 120 32S30 42 0 32Z" fill="${c.accD}" fill-opacity=".92"/>
     <path d="M0 49C30 63 80 67 130 49S270 65 340 47" fill="none" stroke="#FFFFFF" stroke-opacity=".8" stroke-width=".8"/>
     <path d="M0 64C40 82 100 80 150 62S280 80 340 62" fill="none" stroke="${c.acc}" stroke-opacity=".55" stroke-width=".5"/>`));
}
function silkBack(c) {
  const g = uid('sk');
  return deco(`<defs>${linG(g, [[0, '#FFFFFF', 0], [.5, '#FFFFFF', .55], [1, '#FFFFFF', 0]], 0, 0, 340, 0)}</defs>` + mirror(c,
    `<path d="M0 158C70 128 140 188 220 158S320 128 340 138V220H0Z" fill="#FFFFFF" fill-opacity=".07"/>
     <path d="M0 180C80 155 160 210 240 180S320 165 340 172V220H0Z" fill="#FFFFFF" fill-opacity=".09"/>
     <path d="M0 158C70 128 140 188 220 158S320 128 340 138" fill="none" stroke="url(#${g})" stroke-width="1"/>
     <path d="M0 180C80 155 160 210 240 180S320 165 340 172" fill="none" stroke="url(#${g})" stroke-width=".6"/>
     <path d="M0 40C80 70 150 10 230 40S320 60 340 50V0H0Z" fill="#FFFFFF" fill-opacity=".07"/>
     <path d="M0 40C80 70 150 10 230 40S320 60 340 50" fill="none" stroke="url(#${g})" stroke-width=".8"/>`));
}
/* B · data flow: a twisted ribbon of fine lines */
function flowLines(c, back) {
  const g = uid('fl'), N = 26; let s = '', dots = '';
  const P = t => back
    ? [[-10, 70 + 32 * t], [90, 36 + 118 * t], [250, 172 - 116 * t], [350, 88 + 44 * t]]
    : [[168 + 104 * t, 238], [214 + 24 * t, 214 - 150 * t], [262 - 26 * t, 30 + 130 * t], [352, 6 + 118 * t]];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1), p = P(t), op = (.1 + .6 * Math.sin(Math.PI * t)).toFixed(2);
    s += `<path d="M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}C${p[1][0].toFixed(1)} ${p[1][1].toFixed(1)} ${p[2][0].toFixed(1)} ${p[2][1].toFixed(1)} ${p[3][0].toFixed(1)} ${p[3][1].toFixed(1)}" stroke-opacity="${op}"/>`;
  }
  [[6, .38], [13, .72], [19, .52], [9, .9]].forEach(([i, u]) => {
    const p = P(i / (N - 1)), x = bez(p[0][0], p[1][0], p[2][0], p[3][0], u), y = bez(p[0][1], p[1][1], p[2][1], p[3][1], u);
    dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="${c.acc}" fill-opacity=".16"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.7" fill="#FFFFFF"/>`;
  });
  return deco(`<defs>${linG(g, [[0, c.acc], [.55, '#A78BFA'], [1, c.acc]], 0, 0, 340, 0)}</defs>` +
    mirror(c, `<g fill="none" stroke="url(#${g})" stroke-width=".7">${s}</g>${dots}`));
}
/* C · pulse: heartbeat line, no medical cross */
const ecgD = (y, x0, x1, at) => `M${x0} ${y}H${at}L${at + 7} ${y}L${at + 13} ${y - 14}L${at + 20} ${y + 14}L${at + 28} ${y - 26}L${at + 36} ${y + 8}L${at + 41} ${y}H${x1}`;
/* D · arabesque: 8-point star lattice */
function starTile(id, col, op) {
  const s = 28, h = 14, r = 8.5, q = r * Math.SQRT1_2;
  return `<pattern id="${id}" width="${s}" height="${s}" patternUnits="userSpaceOnUse"><g fill="none" stroke="${col}" stroke-opacity="${op}" stroke-width=".6">
    <polygon points="${h - q},${h - q} ${h + q},${h - q} ${h + q},${h + q} ${h - q},${h + q}"/>
    <polygon points="${h},${h - r} ${h + r},${h} ${h},${h + r} ${h - r},${h}"/><circle cx="${h}" cy="${h}" r="2.2"/>
    <path d="M0 0L${h - q} ${h - q}M${s} 0L${h + q} ${h - q}M${s} ${s}L${h + q} ${h + q}M0 ${s}L${h - q} ${h + q}"/></g></pattern>`;
}
function star8SVG(c, s, col) {
  const h = s / 2, r = h - 1.5, q = r * Math.SQRT1_2, r2 = r - 4, q2 = r2 * Math.SQRT1_2;
  const two = (rr, qq) => `<polygon points="${h - qq},${h - qq} ${h + qq},${h - qq} ${h + qq},${h + qq} ${h - qq},${h + qq}"/><polygon points="${h},${h - rr} ${h + rr},${h} ${h},${h + rr} ${h - rr},${h}"/>`;
  return `<svg class="st8" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><g fill="${c.acc}" stroke="${col}" stroke-width="1">${two(r, q)}</g>
    <g fill="none" stroke="${col}" stroke-width=".5" stroke-opacity=".7">${two(r2, q2)}</g></svg>`;
}
/* E · contour lines */
function contours(cx, cy, n, step, col, op, seed) {
  let s = '';
  for (let k = 1; k <= n; k++) {
    const r0 = k * step, pts = [];
    for (let a = 0; a < 120; a++) {
      const th = a / 120 * Math.PI * 2;
      const r = r0 * (1 + .13 * Math.sin(3 * th + seed + k * .22) + .06 * Math.cos(5 * th - seed * 1.3 + k * .37));
      pts.push(`${(cx + r * Math.cos(th)).toFixed(1)} ${(cy + r * Math.sin(th) * .8).toFixed(1)}`);
    }
    s += `<path d="M${pts.join('L')}Z"${k % 5 === 0 ? ` stroke-width="1.1" stroke-opacity="${Math.min(1, op * 1.9).toFixed(2)}"` : ''}/>`;
  }
  return `<g fill="none" stroke="${col}" stroke-opacity="${op}" stroke-width=".55" stroke-linejoin="round">${s}</g>`;
}
/* G · line bloom */
function flower(x, y, k, rot, col, op, fillOp) {
  const p1 = 'M0 0C-9 -12 -9 -30 0 -38C9 -30 9 -12 0 0Z', p2 = 'M0 0C-6 -9 -6 -22 0 -27C6 -22 6 -9 0 0Z';
  let g = '';
  for (let i = 0; i < 6; i++) g += `<path d="${p1}" transform="rotate(${i * 60})"/>`;
  for (let i = 0; i < 6; i++) g += `<path d="${p2}" transform="rotate(${i * 60 + 30})"/>`;
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${k})" fill="${col}" fill-opacity="${fillOp}" stroke="${col}" stroke-opacity="${op}" stroke-width="${(.8 / k).toFixed(2)}">${g}
    <circle r="4.5" fill-opacity="${Math.min(1, fillOp * 4)}"/><circle r="8" fill="none" stroke-dasharray="1 2.2"/></g>`;
}
const leafL = (x, y, k, rot, col, op) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${k})" fill="${col}" fill-opacity=".08" stroke="${col}" stroke-opacity="${op}" stroke-width="${(.8 / k).toFixed(2)}">
  <path d="M0 0C10 -11 30 -11 40 0C30 11 10 11 0 0Z"/><path d="M2 0H36" fill="none"/></g>`;
function bloomSet(c, col, op, fo) {
  return `<g fill="none" stroke="${col}" stroke-opacity="${op}" stroke-width=".8"><path d="M300 172C292 196 280 214 262 236"/><path d="M252 206C246 220 238 230 226 240"/><path d="M322 108C318 126 310 142 300 160"/></g>` +
    leafL(282, 206, .62, 130, col, op) + leafL(296, 192, .55, -150 + 180, col, op) + leafL(240, 224, .5, 150, col, op) + leafL(314, 136, .45, 200, col, op) +
    flower(300, 172, 1.2, 8, col, op, fo) + flower(252, 206, .72, 24, col, op, fo) + flower(322, 108, .42, -10, col, op, fo);
}
/* I · halftone */
function halftone(cx, cy, R, step, rmax, fill, op) {
  let s = '', row = 0;
  for (let y = cy - R; y <= cy + R; y += step * .866, row++) {
    for (let x = cx - R + (row % 2 ? step / 2 : 0); x <= cx + R; x += step) {
      const d = Math.hypot(x - cx, y - cy); if (d > R || x < -4 || x > W + 4 || y < -4 || y > H + 4) continue;
      const r = rmax * Math.pow(1 - d / R, .9); if (r < .3) continue;
      s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}"/>`;
    }
  }
  return `<g fill="${fill}" fill-opacity="${op}">${s}</g>`;
}
/* J · gold leaf flakes */
function flakes(cx, cy, R, n, seed, fill) {
  const rnd = rng(seed); let s = '';
  for (let i = 0; i < n; i++) {
    const a = rnd() * Math.PI * 2, d = Math.pow(rnd(), 2) * R;
    const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * .85;
    const size = (1 - d / R) * 8 + .8 + rnd() * 2.2, k = 5 + Math.floor(rnd() * 3), pts = [];
    for (let j = 0; j < k; j++) { const t = j / k * Math.PI * 2 + rnd() * .7, rr = size * (.5 + rnd() * .6); pts.push(`${(x + Math.cos(t) * rr).toFixed(1)},${(y + Math.sin(t) * rr).toFixed(1)}`); }
    s += `<polygon points="${pts.join(' ')}" fill-opacity="${(.78 + rnd() * .22).toFixed(2)}"/>`;
  }
  for (let i = 0; i < n * .6; i++) {
    const a = rnd() * Math.PI * 2, d = R * (.35 + rnd() * .75);
    s += `<circle cx="${(cx + Math.cos(a) * d).toFixed(1)}" cy="${(cy + Math.sin(a) * d * .85).toFixed(1)}" r="${(.4 + rnd() * .9).toFixed(2)}" fill-opacity="${(.4 + rnd() * .5).toFixed(2)}"/>`;
  }
  return `<g fill="${fill}">${s}</g>`;
}
const goldFoil = (c, id, x1, y1, x2, y2) => linG(id, [[0, c.accD], [.3, c.accL], [.5, c.acc], [.72, c.accL], [1, c.accD]], x1, y1, x2, y2);
const bidiVal = v => isArText(v) ? `<span class="ar" dir="rtl">${esc(v)}</span>` : esc(v);

const NEW_TEMPLATES_3 = [
  /* A · Feminine — silk waves */
  {
    id:'silk', cat:'shop', sample:'beauty', name:{ ar:'أمواج الحرير', fr:'Vagues de soie', en:'Silk Waves' },
    acc:'#C47A8A', swatches:['#C47A8A','#B08968','#8E7CC3','#5E9C94','#C98A5A'],
    fonts:{ ar:['El Messiri','Tajawal'], la:['Cormorant Garamond','Poppins'] },
    ic: c => c.accD,
    front: c => silkTop(c) + `<div class="seal">${mono(c)}</div>
      <div class="P">${fit('nm', c.d.name)}${fit('ttl caps', c.d.title)}<div class="rl"><span></span><i></i></div>${fit('co2', c.d.company)}</div>
      ${contacts(c, { max:4, keys:['phone','social','email','address','web','phone2'] })}`,
    back: c => `<div class="B">` + silkBack(c) + `<div class="mid">${mono(c)}${fit('co', c.d.company)}${fit('tg', c.d.tagline)}${fitL('soc', c.d.social)}</div>
      ${c.d.web ? `<div class="wb"><span class="ltrx">${esc(c.d.web)}</span></div>` : ''}${qrBox(c)}</div>`
  },
  /* B · Tech — data flow */
  {
    id:'flow', cat:'eng', name:{ ar:'موجة البيانات', fr:'Flux de données', en:'Data Flow' },
    acc:'#38BDF8', swatches:['#38BDF8','#34D399','#F472B6','#FBBF24','#818CF8'],
    fonts:{ ar:['Cairo','IBM Plex Sans Arabic'], la:['Space Grotesk','Inter'] },
    ic: c => c.acc,
    front: c => flowLines(c, false) + `<div class="P"><div class="top"><div class="gm">${mono(c)}</div>${fit('co caps', c.d.company)}</div>
      ${fit('nm', c.d.name)}${fit('ttl', c.d.title)}<div class="sig"><i></i><i></i><i></i></div>${contacts(c, { max:4 })}</div>`,
    back: c => `<div class="B">` + flowLines(c, true) + `<div class="hub">${mono(c)}</div>
      <div class="mid">${fit('co', c.d.company)}${fit('tg', c.d.tagline)}</div>${webSoc(c)}${qrBox(c)}</div>`
  },
  /* C · Medical clean — pulse */
  {
    id:'pulse', cat:'med', name:{ ar:'نبض', fr:'Pulsation', en:'Pulse Care' },
    acc:'#0EA5A4', swatches:['#0EA5A4','#2563EB','#7C3AED','#DB2777','#059669'],
    fonts:{ ar:['Almarai','IBM Plex Sans Arabic'], la:['Poppins','Inter'] },
    ic: c => c.acc,
    front: c => {
      const r = uid('pr'), g = uid('pg');
      return deco(`<defs>${radG(r, [[0, c.acc, .2], [1, c.acc, 0]])}${linG(g, [[0, c.acc, 0], [.45, c.acc, .9], [1, c.acc, .25]], 0, 0, 340, 0)}</defs>` + mirror(c,
        `<circle cx="306" cy="22" r="96" fill="url(#${r})"/><circle cx="306" cy="22" r="58" fill="none" stroke="${c.acc}" stroke-opacity=".16" stroke-width=".7"/>
         <circle cx="306" cy="22" r="80" fill="none" stroke="${c.acc}" stroke-opacity=".1" stroke-width=".7"/>
         <path d="${ecgD(100, 0, 340, 214)}" fill="none" stroke="url(#${g})" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"/>
         <circle cx="242" cy="74" r="2.6" fill="${c.acc}"/><circle cx="242" cy="74" r="6" fill="${c.acc}" fill-opacity=".18"/>`)) +
        `<div class="top">${mono(c)}<div class="who">${fit('nm', c.d.name)}${fit('ttl', c.d.title)}${fit('co2', c.d.company)}</div></div>
        ${contacts(c, { max:6, keys:['phone','email','phone2','web','social','address'] })}`;
    },
    back: c => `<div class="B">` + deco(mirror(c, `<g fill="none" stroke="#FFFFFF"><circle cx="20" cy="210" r="46" stroke-opacity=".14"/><circle cx="20" cy="210" r="72" stroke-opacity=".1"/><circle cx="20" cy="210" r="98" stroke-opacity=".07"/></g>
        <path d="${ecgD(196, 0, 256, 120)}" fill="none" stroke="#FFFFFF" stroke-opacity=".4" stroke-width="1.1" stroke-linejoin="round"/>`)) +
      `<div class="mid">${mono(c)}${fit('co', c.d.company)}${fit('tg', c.d.tagline)}
      ${(c.d.phone || c.d.phone2) ? `<div class="ph"><span class="ltrx">${esc([c.d.phone, c.d.phone2].filter(Boolean).join('  ·  '))}</span></div>` : ''}</div>${qrBox(c)}</div>`
  },
  /* D · Luxury — arabesque star lattice */
  {
    id:'arabesque', cat:'law', name:{ ar:'أرابيسك', fr:'Arabesque', en:'Arabesque' },
    acc:'#123C3A', swatches:['#123C3A','#14213D','#4A1525','#2B1F3A','#1C1C1C'],
    fonts:{ ar:['Amiri','Almarai'], la:['Marcellus','Poppins'] },
    ic: c => c.acc,
    front: c => {
      const p = uid('ar');
      return deco(`<defs>${starTile(p, '#CBA35C', .85)}</defs>` + mirror(c, `<rect width="98" height="220" fill="${c.acc}"/><rect width="98" height="220" fill="url(#${p})" opacity=".6"/>
          <path d="M98.5 0V220M102.5 0V220" stroke="#CBA35C" stroke-width=".7"/>`)) +
        `<div class="medal">${star8SVG(c, 66, '#CBA35C')}${mono(c)}</div>
        <div class="P">${fit('co2 caps', c.d.company)}${fit('nm', c.d.name)}${fit('ttl', c.d.title)}
        <div class="rl"><span></span><svg width="9" height="9" viewBox="0 0 9 9"><g fill="#CBA35C"><rect x="1.8" y="1.8" width="5.4" height="5.4"/><rect x="1.8" y="1.8" width="5.4" height="5.4" transform="rotate(45 4.5 4.5)"/></g></svg><span></span></div>
        ${contacts(c, { max:4 })}</div>`;
    },
    back: c => {
      const p = uid('ar');
      return `<div class="B">` + deco(`<defs>${starTile(p, '#CBA35C', .9)}</defs><rect width="340" height="220" fill="url(#${p})" opacity=".16"/>
          <rect x="10" y="10" width="320" height="200" fill="none" stroke="#CBA35C" stroke-width=".8"/><rect x="14" y="14" width="312" height="192" fill="none" stroke="#CBA35C" stroke-opacity=".5" stroke-width=".4"/>`) +
        `<div class="mid"><div class="medal">${star8SVG(c, 84, '#CBA35C')}${mono(c)}</div>${fit('co', c.d.company)}${fit('tg', c.d.tagline)}</div>
        ${c.d.web ? `<div class="wb"><span class="ltrx">${esc(c.d.web)}</span></div>` : ''}${qrBox(c)}</div>`;
    }
  },
  /* E · Corporate — contour lines */
  {
    id:'contour', cat:'corp', name:{ ar:'خطوط كنتورية', fr:'Courbes de niveau', en:'Contour Lines' },
    acc:'#2B4C7E', swatches:['#2B4C7E','#0F766E','#9A3412','#334155','#6D28D9'],
    fonts:{ ar:['Cairo','Cairo'], la:['Montserrat','Inter'] },
    ic: () => '#FFFFFF',
    front: c => deco(mirror(c, contours(318, 18, 15, 12.5, c.acc, .2, 1.3))) +
      `<div class="P"><div class="top">${mono(c)}${fit('co caps', c.d.company)}</div>
      <div class="who">${fit('nm', c.d.name)}${fit('ttl', c.d.title)}<i class="bar"></i></div>${contacts(c, { max:4 })}</div>${qrBox(c)}`,
    back: c => `<div class="B">` + deco(mirror(c, contours(40, 200, 19, 13, '#FFFFFF', .17, 4.1))) +
      `<div class="top">${mono(c)}${c.d.web ? `<span class="wb ltrx">${esc(c.d.web)}</span>` : ''}</div>
      <div class="bt">${fit('co', c.d.company)}${fit('tg', c.d.tagline)}${fitL('soc', c.d.social)}</div></div>`
  },
  /* F · Minimal — zen sun */
  {
    id:'zen', cat:'free', name:{ ar:'شمس هادئة', fr:'Soleil zen', en:'Zen Sun' },
    acc:'#C0704D', swatches:['#C0704D','#6B7F5E','#3E4A61','#B8954A','#2B2B2B'],
    fonts:{ ar:['Almarai','Almarai'], la:['Cormorant Garamond','Inter'] },
    ic: c => c.acc,
    front: c => deco(mirror(c, `<circle cx="282" cy="76" r="30" fill="${c.acc}"/><rect x="240" y="104.6" width="90" height="12" fill="#F4EFE7"/>
        <circle cx="292" cy="84" r="30" fill="none" stroke="#2B2B2B" stroke-opacity=".55" stroke-width=".5"/>
        <path d="M214 104.4H332" stroke="#2B2B2B" stroke-width=".6"/><path d="M234 110.4H312" stroke="#2B2B2B" stroke-opacity=".35" stroke-width=".5"/>`)) +
      `<div class="sun">${mono(c)}</div>
      <div class="P">${fit('co caps', c.d.company)}<div class="who">${fit('nm', c.d.name)}${fit('ttl', c.d.title)}</div>${contacts(c, { max:4 })}</div>${qrBox(c)}`,
    back: c => `<div class="B"><div class="mid"><div class="sun">${mono(c)}</div><div class="hz"></div>${fit('co caps', c.d.company)}${fit('tg', c.d.tagline)}</div>${webSoc(c)}</div>`
  },
  /* G · Feminine elegant — line bloom */
  {
    id:'bloom', cat:'shop', sample:'beauty', name:{ ar:'زهرة خطية', fr:'Fleur au trait', en:'Line Bloom' },
    acc:'#B76E79', swatches:['#B76E79','#A0826D','#8A6FA8','#5E8C7E','#C08A3E'],
    fonts:{ ar:['El Messiri','Almarai'], la:['Playfair Display','Poppins'] },
    ic: c => c.accD,
    front: c => deco(mirror(c, bloomSet(c, c.acc, .75, .07))) +
      `<div class="P"><div class="top">${mono(c)}</div>${fit('nm', c.d.name)}${fit('ttl caps', c.d.title)}<div class="rl"><span></span><i></i></div>${fit('co2', c.d.company)}
      ${contacts(c, { max:4, keys:['phone','social','email','address','web','phone2'] })}</div>`,
    back: c => `<div class="B">` + deco(mirror(c, bloomSet(c, '#FFFFFF', .38, .05) + `<g transform="translate(340 220) rotate(180)">${bloomSet(c, '#FFFFFF', .3, .04)}</g>`)) +
      `<div class="mid">${mono(c)}${fit('co', c.d.company)}${fit('tg', c.d.tagline)}${webSoc(c)}</div>${qrBox(c)}</div>`
  },
  /* H · Tech / developer — code editor */
  {
    id:'code', cat:'free', name:{ ar:'محرر الكود', fr:'Éditeur de code', en:'Code Editor' },
    acc:'#7AA2F7', swatches:['#7AA2F7','#9ECE6A','#F7768E','#E0AF68','#BB9AF7'],
    fonts:{ ar:['IBM Plex Sans Arabic','IBM Plex Sans Arabic'], la:['Space Grotesk','Inter'] },
    ic: c => c.acc,
    front: c => {
      const keys = ['phone','email','web','address','social','phone2'].filter(k => c.d[k]).slice(0, 5);
      const lines = [`<span class="kw">const</span> <span class="vr">card</span> <span class="pn">= {</span>`,
        ...keys.map(k => `<span class="ind"></span><span class="ky">${k}</span><span class="pn">:</span> <span class="s">"${bidiVal(c.d[k])}"</span><span class="pn">,</span>`),
        `<span class="pn">};</span>`];
      return `<div class="win"><i></i><i></i><i></i><span>card.js</span></div>
        <div class="hd">${fit('nm', c.d.name)}<div class="fit ttl"><span class="cm">//</span> ${esc(c.d.title)}</div></div>${mono(c)}
        <div class="code" dir="ltr">${lines.map((l, i) => `<div class="cl"><b>${i + 1}</b><span>${l}</span></div>`).join('')}</div>${qrBox(c)}`;
    },
    back: c => `<div class="B"><div class="win"><i></i><i></i><i></i><span>index.html</span></div>
      <div class="mid">${mono(c)}<div class="fit co" dir="ltr"><span class="tgx">&lt;</span>${bidiVal(c.d.company)}<span class="tgx"> /&gt;</span></div>
      ${c.d.tagline ? `<div class="fit tg" dir="ltr"><span class="cm">/*</span> ${bidiVal(c.d.tagline)} <span class="cm">*/</span><i class="cur"></i></div>` : ''}</div>${webSoc(c)}</div>`
  },
  /* I · Modern — halftone */
  {
    id:'halftone', cat:'edu', name:{ ar:'نقاط متدرجة', fr:'Trame de points', en:'Halftone' },
    acc:'#4F46E5', swatches:['#4F46E5','#0EA5E9','#E11D48','#16A34A','#EA580C'],
    fonts:{ ar:['Cairo','Tajawal'], la:['Poppins','Poppins'] },
    ic: () => '#FFFFFF',
    front: c => {
      const g = uid('ht');
      return deco(`<defs>${linG(g, [[0, c.acc], [1, c.accL]], 340, 0, 170, 150)}</defs>` + mirror(c, halftone(340, 0, 172, 8.6, 3.7, `url(#${g})`, 1))) +
        `<div class="P"><div class="top">${mono(c)}${fit('co caps', c.d.company)}</div><div class="who">${fit('nm', c.d.name)}${fit('ttl', c.d.title)}</div>
        ${contacts(c, { max:4 })}</div>${qrBox(c)}`;
    },
    back: c => `<div class="B">` + deco(mirror(c, halftone(340, 220, 196, 8.6, 3.8, '#FFFFFF', .22))) +
      `<div class="top">${mono(c)}</div><div class="bt">${fit('co', c.d.company)}${fit('tg', c.d.tagline)}<i class="bar"></i>${webSoc(c)}</div></div>`
  },
  /* J · Luxury — gold leaf */
  {
    id:'goldleaf', cat:'corp', name:{ ar:'ورق الذهب', fr:'Feuille d’or', en:'Gold Leaf' },
    acc:'#C8A050', swatches:['#C8A050','#C9CDD3','#D4A08A','#9CC5A1','#E7C873'],
    fonts:{ ar:['El Messiri','Almarai'], la:['Cormorant Garamond','Inter'] },
    ic: c => c.acc,
    front: c => {
      const g = uid('gl');
      return deco(`<defs>${goldFoil(c, g, 200, 0, 340, 130)}</defs>` + mirror(c, flakes(330, 10, 120, 95, 7, `url(#${g})`))) +
        `<div class="P">${fit('nm', c.d.name)}${fit('ttl caps', c.d.title)}<div class="foil"></div>${fit('co2', c.d.company)}${contacts(c, { max:4 })}</div>${qrBox(c)}`;
    },
    back: c => {
      const g = uid('gl');
      return `<div class="B">` + deco(`<defs>${goldFoil(c, g, 0, 100, 150, 220)}</defs>` + mirror(c, flakes(10, 214, 125, 95, 23, `url(#${g})`))) +
        `<div class="mid"><div class="ring">${mono(c)}</div>${fit('co caps', c.d.company)}${fit('tg', c.d.tagline)}<div class="foil"></div></div>${webSoc(c)}</div>`;
    }
  }
];
NEW_TEMPLATES_3.forEach(t => { t.isNew = true; t.batch = 3; TEMPLATES.push(t); });

const TPL_BY = Object.fromEntries(TEMPLATES.map(t => [t.id, t]));
const CATS = ['all', 'new', 'corp', 'med', 'eng', 'law', 'edu', 'shop', 'free'];
const CAT_COLOR = { all:'#2F5770', new:'#B8860B', corp:'#2563EB', med:'#16A34A', eng:'#0891B2', law:'#9F1239', edu:'#EA580C', shop:'#DB2777', free:'#7C3AED' };

let GRID = '';
function gridSVG() {
  if (!GRID) {
    let g = '';
    for (let x = 10; x < W; x += 10) g += `<path d="M${x} 0V${H}" stroke-opacity="${x % 50 ? '.07' : '.16'}"/>`;
    for (let y = 10; y < H; y += 10) g += `<path d="M0 ${y}H${W}" stroke-opacity="${y % 50 ? '.07' : '.16'}"/>`;
    GRID = deco(`<g stroke="#FFFFFF" stroke-width=".5" fill="none">${g}</g>`);
  }
  return GRID;
}

function sampleFor(tplId, lang) {
  const t = TPL_BY[tplId];
  const s = SAMPLE[t.sample || t.cat];
  return { ...s.contact, ...s[lang] };
}
function sampleIdent(tplId, lang) {
  const s = sampleFor(tplId, lang);
  return Object.fromEntries(BI_KEYS.map(k => [k, s[k]]));
}

/* ---------------------------------------------------------
   State
--------------------------------------------------------- */
function freshState() {
  const clang = uiLang, blang = clang === 'ar' ? 'fr' : 'ar';
  return { tpl:'noir', clang, bi:false, blang, c: sampleFor('noir', clang), c2: sampleIdent('noir', blang),
    logo:'', color:'', font:'', qrOn:true, qrMode:'vcard', dirty:false, dirty2:false };
}
function loadState() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY));
    if (raw && TPL_BY[raw.tpl]) {
      const s = Object.assign(freshState(), raw);
      s.c = Object.assign({}, sampleFor(s.tpl, s.clang), raw.c || {});
      s.c2 = Object.assign({}, sampleIdent(s.tpl, s.blang), raw.c2 || {});
      return s;
    }
  } catch (e) { /* ignore */ }
  return freshState();
}
let st = loadState();
let view = 'both', flipped = false, activeCat = 'all';

/* ---------------------------------------------------------
   QR (cached per text)
--------------------------------------------------------- */
let qrCache = { text:null, url:'' };
function qrText(S) {
  const c = S.c;
  if (S.qrMode === 'web') {
    if (!c.web) return '';
    return /^https?:\/\//i.test(c.web) ? c.web : 'https://' + c.web.trim();
  }
  if (!c.name && !c.phone && !c.email) return '';
  const L = ['BEGIN:VCARD', 'VERSION:3.0'];
  if (c.name) L.push('FN:' + c.name);
  // kept short on purpose: fewer modules = a QR that still scans at 12 mm
  if (c.company) L.push('ORG:' + c.company);
  if (c.phone) L.push('TEL:' + c.phone.replace(/\s+/g, ''));
  if (c.email) L.push('EMAIL:' + c.email);
  if (c.web) L.push('URL:' + c.web);
  L.push('END:VCARD');
  return L.join('\n');
}
function qrUrlFor(S) {
  if (!S.qrOn || typeof qrcode === 'undefined') return '';
  const text = qrText(S);
  if (!text) return '';
  if (qrCache.text === text) return qrCache.url;
  let url = '';
  try {
    if (qrcode.stringToBytesFuncs && qrcode.stringToBytesFuncs['UTF-8']) qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
    const qr = qrcode(0, 'L');
    qr.addData(text, 'Byte');
    qr.make();
    const n = qr.getModuleCount(), cell = Math.max(3, Math.ceil(240 / n)), size = n * cell;
    const cv = document.createElement('canvas');
    cv.width = cv.height = size;
    const g = cv.getContext('2d');
    g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, size, size);
    g.fillStyle = '#111111';
    for (let r = 0; r < n; r++) for (let q = 0; q < n; q++) if (qr.isDark(r, q)) g.fillRect(q * cell, r * cell, cell, cell);
    url = cv.toDataURL('image/png');
  } catch (e) { console.error(e); url = ''; }
  qrCache = { text, url };
  return url;
}

/* ---------------------------------------------------------
   Card HTML
--------------------------------------------------------- */
function buildCard(S, side, opts = {}) {
  const tpl = TPL_BY[S.tpl] || TEMPLATES[0];
  let lang = S.clang, d = S.c, render = side === 'front' ? tpl.front : tpl.back;
  if (side === 'back' && S.bi) {
    lang = S.blang; render = tpl.front;
    d = { ...S.c };
    BI_KEYS.forEach(k => { if (S.c2 && S.c2[k]) d[k] = S.c2[k]; });
  }
  const rtl = lang === 'ar';
  const acc = S.color || tpl.acc;
  const fam = S.font ? [S.font, S.font] : (rtl ? tpl.fonts.ar : tpl.fonts.la);
  const c = {
    d, lang, rtl, logo: S.logo || '', acc,
    accD: shade(acc, -0.28), accL: shade(acc, 0.55),
    qr: opts.noQR ? '' : qrUrlFor(S),
    X: x => rtl ? W - x : x
  };
  c.ic = tpl.ic(c);
  const style = `--acc:${acc};--acc-d:${c.accD};--acc-l:${c.accL};--acc-t:${alpha(acc, .13)};--fd:'${fam[0]}';--fb:'${fam[1]}'`;
  return `<div class="bc t-${tpl.id}" dir="${rtl ? 'rtl' : 'ltr'}" lang="${lang}" style="${style}">${render(c)}</div>`;
}

function fitText(root) {
  $$('.fit', root).forEach(el => {
    el.style.fontSize = '';
    const base = parseFloat(getComputedStyle(el).fontSize) || 10;
    let s = base, guard = 0;
    while (el.scrollWidth > el.clientWidth + 0.5 && s > base * 0.55 && guard++ < 50) {
      s -= 0.4; el.style.fontSize = s + 'px';
    }
  });
}
function placeCard(slot, html, s) {
  slot.innerHTML = html;
  slot.style.width = (W * s) + 'px';
  slot.style.height = (H * s) + 'px';
  slot.style.setProperty('--s', s);
  const bc = slot.firstElementChild;
  bc.style.transform = `scale(${s})`;
  fitText(slot);
}

/* ---------------------------------------------------------
   Stage
--------------------------------------------------------- */
let stageScale = 1;
function bothScale(bw, bh) {
  const row = Math.min((bw - 40 - 24) / 2 / W, (bh - 40 - 26) / H);
  const col = Math.min((bw - 40) / W, (bh - 40 - 52 - 14) / 2 / H);
  return { s: Math.max(0.3, Math.min(2.3, Math.max(row, col))), col: col > row };
}
function computeScale() {
  const body = $('#stageBody');
  const bw = body.clientWidth, bh = body.clientHeight;
  if (!bw || !bh) return 1;
  if (view === 'both') {
    const r = bothScale(bw, bh);
    $('#bothView').classList.toggle('col', r.col);
    return r.s;
  }
  return Math.max(0.3, Math.min(2.6, (bw - 80) / W, (bh - 110) / H));
}

/* Designs pane width (desktop): it only takes the stage's EMPTY width, so the
   card preview keeps exactly the size it had with the original 250px pane.
   Wide enough -> two designs per row; otherwise the original single column. */
const GAL_MIN = 250, GAL_TWO = 340, GAL_MAX = 480;
function layoutPanes() {
  const ws = $('#workspace'), gp = $('#paneGallery'), body = $('#stageBody');
  if (isMobile()) { ws.style.removeProperty('--gal-w'); gp.classList.remove('two'); return; }
  const bh = body.clientHeight, bwBase = body.clientWidth + gp.offsetWidth - GAL_MIN;
  if (!bh || bwBase <= 0) return;
  const target = bothScale(bwBase, bh).s;
  let lo = 0, hi = bwBase;                         // smallest stage width that keeps the same card size
  while (hi - lo > 1) { const m = (lo + hi) / 2; if (bothScale(m, bh).s >= target - 1e-9) hi = m; else lo = m; }
  const need = Math.max(Math.ceil(hi), Math.ceil(W * target + 80)) + 12;   // + room so 3D is never smaller
  let g = Math.min(GAL_MAX, GAL_MIN + Math.max(0, Math.floor(bwBase - need)));
  const two = g >= GAL_TWO;
  if (!two) g = GAL_MIN;
  ws.style.setProperty('--gal-w', g + 'px');
  gp.classList.toggle('two', two);
}
function renderStage() {
  stageScale = computeScale();
  const front = buildCard(st, 'front'), back = buildCard(st, 'back');
  if (view === 'both') {
    placeCard($('#slotFront'), front, stageScale);
    placeCard($('#slotBack'), back, stageScale);
  } else {
    const fl = $('#flip');
    fl.style.width = (W * stageScale) + 'px'; fl.style.height = (H * stageScale) + 'px';
    fl.style.setProperty('--s', stageScale);
    $$('.face', fl).forEach(f => f.style.setProperty('--s', stageScale));
    placeCard($('#faceFront'), front, stageScale);
    placeCard($('#faceBack'), back, stageScale);
    applyFlip();
  }
  const tpl = TPL_BY[st.tpl];
  $('#tplNow').textContent = `${tpl.name[uiLang] || tpl.name.ar} · ${T('cat_' + tpl.cat)}${tpl.isNew ? ' · NEW' : ''}`;
}
function applyFlip(rx = 0, ry = 0) {
  $('#flip').style.transform = `rotateX(${rx}deg) rotateY(${(flipped ? 180 : 0) + ry}deg)`;
}
function setView(v) {
  view = v;
  $$('#viewSeg button').forEach(b => b.classList.toggle('on', b.dataset.view === v));
  $('#bothView').classList.toggle('hidden', v !== 'both');
  $('#tiltView').classList.toggle('hidden', v !== '3d');
  $('#btnFlip').classList.toggle('off', v !== '3d');
  renderStage();
}

/* ---------------------------------------------------------
   Gallery
--------------------------------------------------------- */
function thumbState(id) {
  return { ...st, tpl:id, color:'', font:'', bi:false, c: st.dirty ? st.c : sampleFor(id, st.clang) };
}
function renderGallery() {
  $('#gCats').innerHTML = CATS.map(k => `<button type="button" class="chip${k === activeCat ? ' on' : ''}" data-cat="${k}" style="--cc:${CAT_COLOR[k]}">${T('cat_' + k)}</button>`).join('');
  const ordered = [...TEMPLATES.filter(t => t.isNew).sort((a, b) => (b.batch || 2) - (a.batch || 2)), ...TEMPLATES.filter(t => !t.isNew)];
  const list = ordered.filter(t => activeCat === 'all' || (activeCat === 'new' ? t.isNew : t.cat === activeCat));
  $('#gCount').textContent = T('count').replace('{n}', TEMPLATES.length);
  $('#gGrid').innerHTML = list.map(t => `<button type="button" class="g-card${t.id === st.tpl ? ' on' : ''}" data-tpl="${t.id}">
      ${t.isNew ? '<i class="g-new">NEW</i>' : ''}<div class="g-thumb"></div><div class="g-meta"><b>${esc(t.name[uiLang] || t.name.ar)}</b><span style="--cc:${CAT_COLOR[t.cat]}">${T('cat_' + t.cat)}</span></div></button>`).join('');
  fillThumbs();
}
function fillThumbs() {
  $$('#gGrid .g-card').forEach(card => {
    const th = card.querySelector('.g-thumb');
    th.innerHTML = buildCard(thumbState(card.dataset.tpl), 'front', { noQR:true });
    scaleThumb(th);
  });
}
function scaleThumb(th) {
  const bc = th.firstElementChild; if (!bc) return;
  const s = th.clientWidth / W || 0.6;
  bc.style.transform = `scale(${s})`;
  fitText(th);
}
let thumbTimer = null;
function refreshThumbsSoon() { if (!st.dirty) return; clearTimeout(thumbTimer); thumbTimer = setTimeout(fillThumbs, 280); }

function selectTemplate(id) {
  if (!TPL_BY[id] || id === st.tpl) return;
  st.tpl = id; st.color = ''; st.font = '';
  if (!st.dirty) st.c = sampleFor(id, st.clang);
  if (!st.dirty2) st.c2 = sampleIdent(id, st.blang);
  $$('#gGrid .g-card').forEach(c => c.classList.toggle('on', c.dataset.tpl === id));
  buildForm(); renderStage(); autosave(); toast(T('t_tpl'));
  if (isMobile()) setPane('stage');
}

/* ---------------------------------------------------------
   Form
--------------------------------------------------------- */
const SI = {
  lang: '<path d="M4 5h9M8.5 3v2M6 5c0 4 3 7 6 8M11 5c-1 4-4 7-7 8"/><path d="M13 21l4-10 4 10M14.5 17.5h5"/>',
  id: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  ct: IC.phone,
  logo: '<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/>',
  look: '<circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4A5.6 5.6 0 0 0 22 9.8C22 5.5 17.5 2 12 2z"/>'
};
const SECS = [
  { id:'lang', key:'sec_lang', color:'#16A34A' },
  { id:'id', key:'sec_id', color:'#7C3AED' },
  { id:'ct', key:'sec_contact', color:'#D97706' },
  { id:'logo', key:'sec_logo', color:'#2563EB' },
  { id:'look', key:'sec_look', color:'#0F766E' }
];
let openSec = null;
const CHEV = '<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>';
function secSummary(id) {
  const c = st.c, j = a => a.filter(Boolean).join(' · ');
  if (id === 'lang') return j([LANG_LABEL[st.clang], st.bi ? LANG_LABEL[st.blang] : '']);
  if (id === 'id') return j([c.name, c.title, c.company]) || T('sum_empty');
  if (id === 'ct') { const n = CT_KEYS.filter(k => c[k]).length; return n ? j([c.phone || c.email, T('sum_ct').replace('{n}', n)]) : T('sum_empty'); }
  if (id === 'logo') return st.logo ? T('sum_logo') : T('sum_nologo');
  const tpl = TPL_BY[st.tpl];
  return j([tpl.name[uiLang] || tpl.name.ar, st.font || T('font_auto'), st.qrOn ? 'QR' : '']);
}
function sec(i, body) {
  const S = SECS[i], open = openSec === S.id;
  return `<section class="acc${open ? ' open' : ''}" data-sec="${S.id}" style="--sc:${S.color}">
    <button type="button" class="acc-head" aria-expanded="${open}">
      <span class="acc-num">${i + 1}</span>
      <span class="acc-title"><b>${T(S.key)}</b><small data-sum="${S.id}">${esc(secSummary(S.id))}</small></span>
      <span class="acc-chev">${CHEV}</span>
    </button>
    <div class="acc-body">${body}</div>
  </section>`;
}
function updateSummaries() { $$('[data-sum]').forEach(el => { el.textContent = secSummary(el.dataset.sum); }); }
const FTYPE = { phone:'tel', phone2:'tel', email:'email', web:'url' };
function inputHTML(k, val, attr, full, lang) {
  const dir = LTR_KEYS[k] ? 'ltr' : ((lang || st.clang) === 'ar' ? 'rtl' : 'ltr');
  return `<div class="fld${full ? ' full' : ''}"><label for="f_${attr}_${k}">${T('f_' + k)}</label>
    <input id="f_${attr}_${k}" dir="${dir}" type="${FTYPE[k] || 'text'}" data-${attr}="${k}" value="${esc(val || '')}" autocomplete="off"></div>`;
}
const FONTS = { ar:['Tajawal','Cairo','Almarai','El Messiri','Amiri'], la:['Inter','Poppins','Playfair Display','Cairo','Tajawal'] };

function buildForm() {
  const tpl = TPL_BY[st.tpl];
  const acc = st.color || tpl.acc;
  const otherLangs = LANGS.filter(l => l !== st.clang);
  if (!otherLangs.includes(st.blang)) st.blang = otherLangs[0];
  const fonts = FONTS[st.clang === 'ar' ? 'ar' : 'la'];
  const full = { name:1, company:1, tagline:1, email:1, address:1, title:1 };

  $('#paneForm').innerHTML = `
  ${sec(0, `
    <div class="seg" id="clangSeg">${LANGS.map(l => `<button type="button" data-clang="${l}" class="${l === st.clang ? 'on' : ''}">${LANG_LABEL[l]}</button>`).join('')}</div>
    <label class="switch"><span>${T('bi_toggle')}</span><input type="checkbox" id="biT"${st.bi ? ' checked' : ''}><span class="tg"></span></label>
    ${st.bi ? `<div class="sub-box">
      <p class="note">${T('bi_note')}</p>
      <div class="seg" id="blangSeg" style="margin-bottom:10px">${otherLangs.map(l => `<button type="button" data-blang="${l}" class="${l === st.blang ? 'on' : ''}">${LANG_LABEL[l]}</button>`).join('')}</div>
      <div class="fgrid">${BI_KEYS.map(k => inputHTML(k, st.c2[k], 'k2', true, st.blang)).join('')}</div>
    </div>` : ''}`)}
  ${sec(1, `<div class="fgrid">${ID_KEYS.map(k => inputHTML(k, st.c[k], 'k', full[k])).join('')}</div>`)}
  ${sec(2, `<div class="fgrid">${CT_KEYS.map(k => inputHTML(k, st.c[k], 'k', full[k])).join('')}</div>`)}
  ${sec(3, `
    <div class="logo-row">
      <div class="logo-prev" style="${st.logo ? `background-image:url('${st.logo}')` : ''}">${st.logo ? '' : `<svg viewBox="0 0 24 24">${SI.logo}</svg>`}</div>
      <div class="logo-btns">
        <button type="button" class="btn primary" id="logoUp"><svg viewBox="0 0 24 24"><path d="M12 16V4M7 9l5-5 5 5M4 20h16"/></svg>${st.logo ? T('logo_change') : T('logo_up')}</button>
        ${st.logo ? `<button type="button" class="btn ghost" id="logoDel">${T('logo_del')}</button>` : ''}
      </div>
    </div>
    ${st.logo ? '' : `<p class="hint-s">${T('logo_hint')}</p>`}`)}
  ${sec(4, `
    <div class="fld full" style="margin-bottom:12px"><label>${T('color')}</label>
      <div class="swatches">${tpl.swatches.map(c => `<button type="button" class="sw${c.toLowerCase() === acc.toLowerCase() ? ' on' : ''}" data-sw="${c}" style="background:${c}" aria-label="${c}"></button>`).join('')}
        <label class="sw-custom" title="${T('color_custom')}"><input type="color" id="colorIn" value="${acc}"></label></div>
    </div>
    <div class="fld full" style="margin-bottom:6px"><label for="fontSel">${T('font')}</label>
      <select id="fontSel"><option value="">${T('font_auto')}</option>${fonts.map(f => `<option value="${f}"${st.font === f ? ' selected' : ''} style="font-family:'${f}'">${f}</option>`).join('')}</select>
    </div>
    <label class="switch"><span>${T('qr_toggle')}</span><input type="checkbox" id="qrT"${st.qrOn ? ' checked' : ''}><span class="tg"></span></label>
    ${st.qrOn ? `<div class="fld full"><label for="qrSel">${T('qr_mode')}</label>
      <select id="qrSel"><option value="vcard"${st.qrMode === 'vcard' ? ' selected' : ''}>${T('qr_vcard')}</option><option value="web"${st.qrMode === 'web' ? ' selected' : ''}>${T('qr_web')}</option></select></div>` : ''}`)}
  <div class="btn-row">
    <button type="button" class="btn" id="btnSample">${T('btn_sample')}</button>
    <button type="button" class="btn" id="btnClear">${T('btn_clear')}</button>
  </div>`;
}

let rafId = 0;
function onData() {
  updateSummaries();
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(renderStage);
  refreshThumbsSoon();
  autosave();
}
function setContentLang(l) {
  if (!LANGS.includes(l)) return;
  st.clang = l;
  if (st.blang === l) st.blang = LANGS.find(x => x !== l);
  if (!st.dirty) st.c = sampleFor(st.tpl, l);
  if (!st.dirty2) st.c2 = sampleIdent(st.tpl, st.blang);
  if (st.font && !FONTS[l === 'ar' ? 'ar' : 'la'].includes(st.font)) st.font = '';
  buildForm(); renderStage(); fillThumbs(); autosave();
}

const pane = $('#paneForm');
pane.addEventListener('input', e => {
  const el = e.target;
  if (el.dataset.k) { st.c[el.dataset.k] = el.value; st.dirty = true; onData(); }
  else if (el.dataset.k2) { st.c2[el.dataset.k2] = el.value; st.dirty2 = true; onData(); }
  else if (el.id === 'colorIn') {
    st.color = el.value;
    $$('.sw', pane).forEach(s => s.classList.toggle('on', s.dataset.sw.toLowerCase() === el.value.toLowerCase()));
    onData();
  }
});
pane.addEventListener('change', e => {
  const el = e.target;
  if (el.id === 'biT') {
    st.bi = el.checked;
    if (st.bi && !st.dirty2) st.c2 = sampleIdent(st.tpl, st.blang);
    buildForm(); onData();
  } else if (el.id === 'qrT') { st.qrOn = el.checked; buildForm(); onData(); }
  else if (el.id === 'qrSel') { st.qrMode = el.value; onData(); }
  else if (el.id === 'fontSel') { st.font = el.value; onData(); }
});
pane.addEventListener('click', e => {
  const head = e.target.closest('.acc-head');
  if (head) {
    const id = head.parentElement.dataset.sec;
    openSec = openSec === id ? null : id;
    $$('.acc', pane).forEach(x => { const on = x.dataset.sec === openSec; x.classList.toggle('open', on); x.querySelector('.acc-head').setAttribute('aria-expanded', on); });
    return;
  }
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.clang) { if (b.dataset.clang !== st.clang) setContentLang(b.dataset.clang); }
  else if (b.dataset.blang) {
    st.blang = b.dataset.blang;
    if (!st.dirty2) st.c2 = sampleIdent(st.tpl, st.blang);
    buildForm(); onData();
  }
  else if (b.dataset.sw) {
    const tpl = TPL_BY[st.tpl];
    st.color = b.dataset.sw.toLowerCase() === tpl.acc.toLowerCase() ? '' : b.dataset.sw;
    $$('.sw', pane).forEach(s => s.classList.toggle('on', s === b));
    const ci = $('#colorIn'); if (ci) ci.value = b.dataset.sw;
    onData();
  }
  else if (b.id === 'logoUp') $('#logoFile').click();
  else if (b.id === 'logoDel') { st.logo = ''; buildForm(); onData(); fillThumbs(); }
  else if (b.id === 'btnSample') {
    st.c = sampleFor(st.tpl, st.clang); st.c2 = sampleIdent(st.tpl, st.blang); st.dirty = false; st.dirty2 = false;
    buildForm(); renderStage(); fillThumbs(); autosave(); toast(T('t_sample'));
  }
  else if (b.id === 'btnClear') {
    st.c = Object.fromEntries([...ID_KEYS, ...CT_KEYS].map(k => [k, ''])); st.c2 = Object.fromEntries(BI_KEYS.map(k => [k, '']));
    st.dirty = true; st.dirty2 = true;
    buildForm(); renderStage(); fillThumbs(); autosave(); toast(T('t_cleared'));
    const first = $('input[data-k="name"]', pane); if (first) first.focus();
  }
});

$('#logoFile').addEventListener('change', e => {
  const file = e.target.files && e.target.files[0]; e.target.value = '';
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const max = 520, k = Math.min(1, max / Math.max(img.width, img.height));
      const cv = document.createElement('canvas');
      cv.width = Math.max(1, Math.round(img.width * k)); cv.height = Math.max(1, Math.round(img.height * k));
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
      st.logo = cv.toDataURL('image/png');
      buildForm(); onData(); fillThumbs();
    };
    img.onerror = () => toast(T('t_logo_err'));
    img.src = reader.result;
  };
  reader.onerror = () => toast(T('t_logo_err'));
  reader.readAsDataURL(file);
});

/* ---------------------------------------------------------
   Save (local autosave)
--------------------------------------------------------- */
let saveTimer = null;
function saveNow() { try { localStorage.setItem(STORE_KEY, JSON.stringify(st)); return true; } catch (e) { return false; } }
function autosave() { clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, 700); }

/* ---------------------------------------------------------
   Export: PNG, PDF, print
--------------------------------------------------------- */
async function fontsReady() { if (document.fonts && document.fonts.ready) await document.fonts.ready; }
async function imgsReady(root) {
  await Promise.all($$('img', root).map(im => im.complete ? Promise.resolve() : new Promise(r => { im.onload = im.onerror = r; })));
}
async function snap(side, scale) {
  const root = $('#exportRoot');
  root.innerHTML = buildCard(st, side);
  fitText(root);
  await fontsReady(); await imgsReady(root); await wait(40);
  const canvas = await html2canvas(root.firstElementChild, {
    scale, backgroundColor:'#FFFFFF', useCORS:true, logging:false,
    width:W, height:H, windowWidth:W, windowHeight:H, scrollX:0, scrollY:0
  });
  root.innerHTML = '';
  return canvas;
}
function fileBase() {
  return (st.c.name || st.c.company || 'business-card').replace(/[\\/:*?"<>|]+/g, '').trim().slice(0, 60) || 'business-card';
}
function download(href, name) {
  const a = document.createElement('a'); a.href = href; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
}
let busy = false;
async function doPng(side) {
  if (busy) return;
  if (typeof html2canvas === 'undefined') { toast(T('t_err')); return; }
  busy = true; toast(T('t_png'));
  try {
    const cv = await snap(side, 3.6);
    download(cv.toDataURL('image/png'), `${fileBase()}-${side === 'front' ? T('front') : T('back')}.png`);
    toast(T('t_done'));
  } catch (err) { console.error(err); toast(T('t_err')); }
  busy = false;
}
async function doPdf(kind) {
  if (busy) return;
  if (typeof html2canvas === 'undefined' || !window.jspdf) { toast(T('t_err')); return; }
  busy = true; toast(T('t_pdf'));
  try {
    const { jsPDF } = window.jspdf;
    const f = (await snap('front', 3.6)).toDataURL('image/jpeg', 0.95);
    const b = (await snap('back', 3.6)).toDataURL('image/jpeg', 0.95);
    let pdf;
    if (kind === 'card') {
      pdf = new jsPDF({ orientation:'landscape', unit:'mm', format:[85, 55] });
      pdf.addImage(f, 'JPEG', 0, 0, 85, 55);
      pdf.addPage([85, 55], 'landscape');
      pdf.addImage(b, 'JPEG', 0, 0, 85, 55);
    } else {
      pdf = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
      [f, b].forEach((img, i) => {
        if (i) pdf.addPage('a4', 'portrait');
        SHEET.cells.forEach(([x, y]) => pdf.addImage(img, 'JPEG', x, y, 85, 55));
        pdf.setDrawColor(0); pdf.setLineWidth(0.15);
        SHEET.marks.forEach(([x1, y1, x2, y2]) => pdf.line(x1, y1, x2, y2));
      });
    }
    pdf.save(fileBase() + '.pdf');
    toast(T('t_done'));
  } catch (err) { console.error(err); toast(T('t_err')); }
  busy = false;
}

/* A4 layout: 2 × 5 cards of 85 × 55 mm, centred, with crop marks outside the grid */
const SHEET = (() => {
  const x0 = 20, y0 = 11, cw = 85, ch = 55, cols = 2, rows = 5;
  const cells = [], marks = [];
  for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) cells.push([x0 + q * cw, y0 + r * ch]);
  const xs = [x0, x0 + cw, x0 + 2 * cw], ys = Array.from({ length: rows + 1 }, (_, i) => y0 + i * ch);
  const yEnd = y0 + rows * ch, xEnd = x0 + cols * cw;
  xs.forEach(x => { marks.push([x, 2, x, y0 - 2]); marks.push([x, yEnd + 2, x, 295]); });
  ys.forEach(y => { marks.push([4, y, x0 - 2, y]); marks.push([xEnd + 2, y, 206, y]); });
  return { cells, marks };
})();
function doPrint() {
  toast(T('t_print'));
  const root = $('#printRoot');
  const page = side => {
    const card = buildCard(st, side);
    const cells = SHEET.cells.map(([x, y]) => `<div class="cell" style="left:${x}mm;top:${y}mm">${card}</div>`).join('');
    const marks = SHEET.marks.map(([x1, y1, x2, y2]) => x1 === x2
      ? `<div class="mark" style="left:${x1 - 0.075}mm;top:${y1}mm;width:.15mm;height:${y2 - y1}mm"></div>`
      : `<div class="mark" style="left:${x1}mm;top:${y1 - 0.075}mm;width:${x2 - x1}mm;height:.15mm"></div>`).join('');
    return `<div class="print-page">${cells}${marks}</div>`;
  };
  root.innerHTML = page('front') + page('back');
  $$('.cell > .bc', root).forEach(bc => { bc.style.transform = `scale(${PRINT_K})`; });
  fitText(root);
  fontsReady().then(() => imgsReady(root)).then(() => setTimeout(() => window.print(), 250));
}
window.addEventListener('afterprint', () => { $('#printRoot').innerHTML = ''; });

/* ---------------------------------------------------------
   Account (Firebase): users/{uid}/bizcards
--------------------------------------------------------- */
const hasFb = () => typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length && firebase.auth && firebase.firestore;
const fbUser = () => (hasFb() ? firebase.auth().currentUser : null);
const cardsCol = uid => firebase.firestore().collection('users').doc(uid).collection('bizcards');
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

function cloudPayload() {
  const copy = { ...st }; delete copy.docId;
  return {
    title: (st.c.name || st.c.company || '').slice(0, 200), tpl: st.tpl, clang: st.clang,
    state: JSON.stringify(copy), updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };
}
async function saveToAccount() {
  saveNow();
  const user = fbUser();
  if (!user) { openLogin(saveToAccount); return; }
  try {
    const data = cloudPayload();
    if (data.state.length > 950000) { toast(T('t_too_big')); return; }
    const col = cardsCol(user.uid);
    if (st.docId) await col.doc(st.docId).set(data, { merge:true });
    else { data.createdAt = firebase.firestore.FieldValue.serverTimestamp(); const ref = await col.add(data); st.docId = ref.id; }
    saveNow(); toast(T('t_saved_cloud'));
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
  grid.innerHTML = `<div class="m-empty">${T('loading')}</div>`;
  try {
    const snap = await cardsCol(fbUser().uid).orderBy('updatedAt', 'desc').get();
    mineDocs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderMine();
  } catch (e) { console.error(e); grid.innerHTML = `<div class="m-empty">${T('t_cloud_err')}</div>`; }
}
function parseDoc(doc) {
  try {
    const p = JSON.parse(doc.state);
    if (!p || !TPL_BY[p.tpl]) return null;
    const s = Object.assign(freshState(), p);
    s.c = Object.assign({}, sampleFor(s.tpl, s.clang), p.c || {});
    s.c2 = Object.assign({}, sampleIdent(s.tpl, s.blang), p.c2 || {});
    return s;
  } catch (e) { return null; }
}
function renderMine() {
  const grid = $('#mGrid');
  const fmt = ts => { try { return ts && ts.toDate ? ts.toDate().toLocaleDateString(uiLang === 'ar' ? 'ar-DZ' : uiLang) : ''; } catch (e) { return ''; } };
  const cards = mineDocs.map(d => {
    const s = parseDoc(d); if (!s) return '';
    const tpl = TPL_BY[s.tpl];
    return `<div class="m-card" data-mid="${d.id}">
      ${d.id === st.docId ? `<span class="m-tag">${T('current')}</span>` : ''}
      <div class="g-thumb" data-thumb="${d.id}"></div>
      <div class="g-meta"><b>${esc(d.title || T('untitled'))}</b><span>${esc(tpl.name[uiLang] || tpl.name.ar)}</span></div>
      <div class="m-date">${fmt(d.updatedAt)}</div>
      <div class="m-actions">
        <button type="button" class="primary" data-act="open">${IC_OPEN}${T('open_b')}</button>
        <button type="button" data-act="dup">${IC_DUP}${T('dup_b')}</button>
        <button type="button" class="danger icon" data-act="del" title="${T('del_b')}" aria-label="${T('del_b')}">${IC_DEL}</button>
      </div></div>`;
  }).join('');
  grid.innerHTML = `<button type="button" class="m-new" data-act="new">${IC_PLUS}<span>${T('new_b')}</span></button>` + (cards || `<div class="m-empty">${T('mine_empty')}</div>`);
  requestAnimationFrame(() => $$('[data-thumb]', grid).forEach(th => {
    const s = parseDoc(mineDocs.find(d => d.id === th.dataset.thumb)); if (!s) return;
    th.innerHTML = buildCard(s, 'front', { noQR:true }); scaleThumb(th);
  }));
}
$('#btnMine').addEventListener('click', openMine);
$('#mClose').addEventListener('click', closeMine);
$('#mine').addEventListener('click', async e => {
  if (e.target.id === 'mine') { closeMine(); return; }
  const btn = e.target.closest('[data-act]'); if (!btn) return;
  const act = btn.dataset.act;
  if (act === 'new') {
    st = freshState(); closeMine(); buildForm(); renderStage(); renderGallery(); saveNow(); toast(T('t_new'));
    return;
  }
  const card = btn.closest('[data-mid]'); if (!card) return;
  const id = card.dataset.mid, doc = mineDocs.find(d => d.id === id); if (!doc) return;
  const col = cardsCol(fbUser().uid);
  try {
    if (act === 'open') {
      const s = parseDoc(doc); if (!s) return;
      st = Object.assign(s, { docId: id });
      closeMine(); buildForm(); renderStage(); renderGallery(); saveNow(); toast(T('t_opened'));
    } else if (act === 'dup') {
      const p = JSON.parse(doc.state);
      const title = (doc.title || T('untitled')) + T('copy_suffix');
      await col.add({ title: title.slice(0, 200), tpl: p.tpl, clang: p.clang, state: doc.state,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(), updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
      toast(T('t_dup')); loadMine();
    } else if (act === 'del') {
      if (!confirm(T('confirm_del'))) return;
      await col.doc(id).delete();
      if (st.docId === id) { delete st.docId; saveNow(); }
      toast(T('t_deleted')); loadMine();
    }
  } catch (err) { console.error(err); toast(T('t_cloud_err')); }
});

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
   UI language
--------------------------------------------------------- */
function applyUiLang() {
  document.documentElement.lang = uiLang;
  document.documentElement.dir = uiLang === 'ar' ? 'rtl' : 'ltr';
  $$('[data-i18n]').forEach(el => el.textContent = T(el.dataset.i18n));
  $$('[data-tip]').forEach(el => el.setAttribute('data-tiptext', T(el.dataset.tip)));
  $('#langToggle').textContent = uiLang.toUpperCase();
  $$('#langMenu button').forEach(b => b.classList.toggle('on', b.dataset.lang === uiLang));
  document.title = uiLang === 'ar' ? 'تصميم بطاقة أعمال Business Card أونلاين — أكاديمية مرابطي' : T('tool_name') + ' — Merabti Academy';
}
$('#langToggle').addEventListener('click', e => { e.stopPropagation(); closeDrops(); $('#langMenu').classList.toggle('hidden'); });
$('#langMenu').addEventListener('click', e => {
  const b = e.target.closest('[data-lang]'); if (!b) return;
  uiLang = b.dataset.lang; localStorage.setItem(UI_KEY, uiLang);
  $('#langMenu').classList.add('hidden');
  applyUiLang();
  if (!st.dirty && st.clang !== uiLang) setContentLang(uiLang);
  else { buildForm(); renderStage(); renderGallery(); }
});

/* ---------------------------------------------------------
   Menus, toolbar, stage interactions
--------------------------------------------------------- */
function closeDrops() { $$('.drop').forEach(d => d.classList.add('hidden')); $$('.menu-wrap').forEach(w => w.classList.remove('open')); }
function toggleDrop(id) {
  const d = $(id), open = d.classList.contains('hidden');
  closeDrops(); $('#langMenu').classList.add('hidden');
  if (open) { d.classList.remove('hidden'); d.parentElement.classList.add('open'); }
}
$('#btnPng').addEventListener('click', e => { e.stopPropagation(); toggleDrop('#pngMenu'); });
$('#btnPdf').addEventListener('click', e => { e.stopPropagation(); toggleDrop('#pdfMenu'); });
$('#pngMenu').addEventListener('click', e => { const b = e.target.closest('[data-png]'); if (b) { closeDrops(); doPng(b.dataset.png); } });
$('#pdfMenu').addEventListener('click', e => { const b = e.target.closest('[data-pdf]'); if (b) { closeDrops(); doPdf(b.dataset.pdf); } });
document.addEventListener('click', e => {
  if (!e.target.closest('.lang-wrap')) $('#langMenu').classList.add('hidden');
  if (!e.target.closest('.menu-wrap')) closeDrops();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMine(); closeLogin(); closeDrops(); } });

$('#btnSave').addEventListener('click', saveToAccount);
$('#btnPrint').addEventListener('click', doPrint);
$('#btnFullscreen').addEventListener('click', () => {
  if (!document.fullscreenElement) (document.documentElement.requestFullscreen || function () {}).call(document.documentElement);
  else if (document.exitFullscreen) document.exitFullscreen();
});
$('#viewSeg').addEventListener('click', e => { const b = e.target.closest('[data-view]'); if (b && b.dataset.view !== view) setView(b.dataset.view); });
function doFlip() { flipped = !flipped; const fl = $('#flip'); fl.classList.remove('live'); applyFlip(); }
$('#btnFlip').addEventListener('click', doFlip);
$('#flip').addEventListener('click', doFlip);
$('#tiltScene').addEventListener('mousemove', e => {
  const fl = $('#flip'), r = fl.getBoundingClientRect();
  if (!r.width) return;
  const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
  fl.classList.add('live');
  applyFlip(-(y - 0.5) * 14, (x - 0.5) * 18 * (flipped ? -1 : 1));
  $$('.shine', fl).forEach(s => { s.style.setProperty('--mx', (x * 100) + '%'); s.style.setProperty('--my', (y * 100) + '%'); });
});
$('#tiltScene').addEventListener('mouseleave', () => { $('#flip').classList.remove('live'); applyFlip(); });

$('#gCats').addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (b) { activeCat = b.dataset.cat; renderGallery(); } });
$('#gGrid').addEventListener('click', e => { const b = e.target.closest('[data-tpl]'); if (b) selectTemplate(b.dataset.tpl); });

/* mobile panes */
const isMobile = () => window.matchMedia('(max-width: 900px)').matches;
function setPane(p) {
  $('#workspace').dataset.pane = p;
  $$('#mtabs button').forEach(b => b.classList.toggle('on', b.dataset.pane === p));
  requestAnimationFrame(() => { if (p === 'stage') renderStage(); if (p === 'gallery') fillThumbs(); });
}
$('#mtabs').addEventListener('click', e => { const b = e.target.closest('[data-pane]'); if (b) setPane(b.dataset.pane); });

let rzTimer = null;
window.addEventListener('resize', () => { clearTimeout(rzTimer); rzTimer = setTimeout(() => { layoutPanes(); renderStage(); $$('#gGrid .g-thumb').forEach(scaleThumb); }, 120); });

/* ---------------------------------------------------------
   Init
--------------------------------------------------------- */
applyUiLang();
buildForm();
layoutPanes();
renderGallery();
setView('both');
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { renderStage(); fillThumbs(); });

})();
