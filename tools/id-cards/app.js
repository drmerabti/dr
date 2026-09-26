/* =========================================================
   مولّد بطاقات الأعمال — Merabti Academy
   Phase 1: 10 designs, live preview, 3D flip, PNG, PDF, A4 print
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
    designs:'التصاميم', count:'{n} تصاميم', tab_design:'التصميم', tab_info:'المعلومات', tab_preview:'المعاينة',
    cat_all:'الكل', cat_corp:'شركات', cat_med:'أطباء', cat_eng:'مهندسون', cat_law:'محامون', cat_edu:'تعليم', cat_shop:'محلات', cat_free:'مستقلون',
    sec_lang:'لغة البطاقة', sec_id:'معلوماتك', sec_contact:'التواصل', sec_logo:'الشعار', sec_look:'المظهر',
    f_name:'الاسم الكامل', f_title:'الوظيفة أو الصفة', f_company:'المؤسسة أو النشاط', f_tagline:'وصف قصير', f_phone:'الهاتف', f_phone2:'هاتف ثانٍ',
    f_email:'البريد الإلكتروني', f_web:'الموقع الإلكتروني', f_address:'العنوان', f_social:'حساب التواصل الاجتماعي',
    bi_toggle:'الوجه الخلفي بلغة ثانية', bi_lang:'لغة الوجه الخلفي',
    bi_note:'يتكرر الوجه الأمامي على الخلف باللغة الثانية. أي حقل تتركه فارغًا يأخذ قيمته من اللغة الأولى.',
    logo_up:'رفع شعار', logo_change:'تغيير الشعار', logo_del:'حذف الشعار', logo_hint:'بدون شعار يظهر الحرف الأول من اسم المؤسسة.',
    color:'اللون', color_custom:'لون مخصص', font:'الخط', font_auto:'خط التصميم', qr_toggle:'إظهار رمز QR', qr_mode:'عند مسح الرمز',
    qr_vcard:'يحفظ بيانات الاتصال في الهاتف', qr_web:'يفتح الموقع الإلكتروني',
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
    cat_all:'Tous', cat_corp:'Entreprises', cat_med:'Médecins', cat_eng:'Ingénieurs', cat_law:'Avocats', cat_edu:'Éducation', cat_shop:'Commerces', cat_free:'Indépendants',
    sec_lang:'Langue de la carte', sec_id:'Vos informations', sec_contact:'Coordonnées', sec_logo:'Logo', sec_look:'Apparence',
    f_name:'Nom complet', f_title:'Fonction', f_company:'Entreprise ou activité', f_tagline:'Courte description', f_phone:'Téléphone', f_phone2:'Second téléphone',
    f_email:'E-mail', f_web:'Site web', f_address:'Adresse', f_social:'Réseau social',
    bi_toggle:'Verso dans une autre langue', bi_lang:'Langue du verso',
    bi_note:'Le recto est repris au verso dans la seconde langue. Un champ laissé vide reprend la valeur de la première langue.',
    logo_up:'Ajouter un logo', logo_change:'Changer le logo', logo_del:'Supprimer le logo', logo_hint:'Sans logo, l’initiale de l’entreprise s’affiche.',
    color:'Couleur', color_custom:'Couleur personnalisée', font:'Police', font_auto:'Police du modèle', qr_toggle:'Afficher un QR code', qr_mode:'Au scan du code',
    qr_vcard:'Enregistre le contact dans le téléphone', qr_web:'Ouvre le site web',
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
    cat_all:'All', cat_corp:'Business', cat_med:'Doctors', cat_eng:'Engineers', cat_law:'Lawyers', cat_edu:'Education', cat_shop:'Shops', cat_free:'Freelancers',
    sec_lang:'Card language', sec_id:'Your details', sec_contact:'Contact', sec_logo:'Logo', sec_look:'Look',
    f_name:'Full name', f_title:'Job title', f_company:'Company or trade', f_tagline:'Short description', f_phone:'Phone', f_phone2:'Second phone',
    f_email:'Email', f_web:'Website', f_address:'Address', f_social:'Social handle',
    bi_toggle:'Back side in another language', bi_lang:'Back side language',
    bi_note:'The front is repeated on the back in the second language. Any field you leave empty uses the first language’s value.',
    logo_up:'Upload a logo', logo_change:'Change logo', logo_del:'Remove logo', logo_hint:'Without a logo, the company’s initial is shown.',
    color:'Color', color_custom:'Custom color', font:'Font', font_auto:'Design font', qr_toggle:'Show a QR code', qr_mode:'When scanned',
    qr_vcard:'Saves the contact to the phone', qr_web:'Opens the website',
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
      return `<div class="B">` + deco(`<rect x="${cx - 19}" y="34" width="38" height="152" rx="6" fill="#FFFFFF" fill-opacity=".1"/>
        <rect x="${cx - 76}" y="91" width="152" height="38" rx="6" fill="#FFFFFF" fill-opacity=".1"/>`) +
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
const TPL_BY = Object.fromEntries(TEMPLATES.map(t => [t.id, t]));
const CATS = ['all', 'corp', 'med', 'eng', 'law', 'edu', 'shop', 'free'];

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
function computeScale() {
  const body = $('#stageBody');
  const bw = body.clientWidth, bh = body.clientHeight;
  if (!bw || !bh) return 1;
  if (view === 'both') {
    const row = Math.min((bw - 40 - 24) / 2 / W, (bh - 40 - 26) / H);
    const col = Math.min((bw - 40) / W, (bh - 40 - 52 - 14) / 2 / H);
    $('#bothView').classList.toggle('col', col > row);
    return Math.max(0.3, Math.min(2.3, Math.max(row, col)));
  }
  return Math.max(0.3, Math.min(2.6, (bw - 80) / W, (bh - 110) / H));
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
  $('#tplNow').textContent = `${tpl.name[uiLang] || tpl.name.ar} · ${T('cat_' + tpl.cat)}`;
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
  $('#gCats').innerHTML = CATS.map(k => `<button type="button" class="chip${k === activeCat ? ' on' : ''}" data-cat="${k}">${T('cat_' + k)}</button>`).join('');
  const list = TEMPLATES.filter(t => activeCat === 'all' || t.cat === activeCat);
  $('#gCount').textContent = T('count').replace('{n}', TEMPLATES.length);
  $('#gGrid').innerHTML = list.map(t => `<button type="button" class="g-card${t.id === st.tpl ? ' on' : ''}" data-tpl="${t.id}">
      <div class="g-thumb"></div><div class="g-meta"><b>${esc(t.name[uiLang] || t.name.ar)}</b><span>${T('cat_' + t.cat)}</span></div></button>`).join('');
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
const secHead = (icon, key) => `<h3><i><svg viewBox="0 0 24 24">${SI[icon]}</svg></i>${T(key)}</h3>`;
const FTYPE = { phone:'tel', phone2:'tel', email:'email', web:'url' };
function inputHTML(k, val, attr, full) {
  const ltr = LTR_KEYS[k] ? ' ltr' : '';
  return `<div class="fld${full ? ' full' : ''}"><label for="f_${attr}_${k}">${T('f_' + k)}</label>
    <input id="f_${attr}_${k}" class="${ltr.trim()}" type="${FTYPE[k] || 'text'}" data-${attr}="${k}" value="${esc(val || '')}" autocomplete="off"></div>`;
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
  <section class="fsec">${secHead('lang', 'sec_lang')}
    <div class="seg" id="clangSeg">${LANGS.map(l => `<button type="button" data-clang="${l}" class="${l === st.clang ? 'on' : ''}">${LANG_LABEL[l]}</button>`).join('')}</div>
    <label class="switch"><span>${T('bi_toggle')}</span><input type="checkbox" id="biT"${st.bi ? ' checked' : ''}><span class="tg"></span></label>
    ${st.bi ? `<div class="sub-box">
      <p class="note">${T('bi_note')}</p>
      <div class="seg" id="blangSeg" style="margin-bottom:10px">${otherLangs.map(l => `<button type="button" data-blang="${l}" class="${l === st.blang ? 'on' : ''}">${LANG_LABEL[l]}</button>`).join('')}</div>
      <div class="fgrid" dir="${st.blang === 'ar' ? 'rtl' : 'ltr'}">${BI_KEYS.map(k => inputHTML(k, st.c2[k], 'k2', true)).join('')}</div>
    </div>` : ''}
  </section>
  <section class="fsec">${secHead('id', 'sec_id')}
    <div class="fgrid" dir="${st.clang === 'ar' ? 'rtl' : 'ltr'}">${ID_KEYS.map(k => inputHTML(k, st.c[k], 'k', full[k])).join('')}</div>
  </section>
  <section class="fsec">${secHead('ct', 'sec_contact')}
    <div class="fgrid" dir="${st.clang === 'ar' ? 'rtl' : 'ltr'}">${CT_KEYS.map(k => inputHTML(k, st.c[k], 'k', full[k])).join('')}</div>
  </section>
  <section class="fsec">${secHead('logo', 'sec_logo')}
    <div class="logo-row">
      <div class="logo-prev" style="${st.logo ? `background-image:url('${st.logo}')` : ''}">${st.logo ? '' : `<svg viewBox="0 0 24 24">${SI.logo}</svg>`}</div>
      <div class="logo-btns">
        <button type="button" class="btn primary" id="logoUp"><svg viewBox="0 0 24 24"><path d="M12 16V4M7 9l5-5 5 5M4 20h16"/></svg>${st.logo ? T('logo_change') : T('logo_up')}</button>
        ${st.logo ? `<button type="button" class="btn ghost" id="logoDel">${T('logo_del')}</button>` : ''}
      </div>
    </div>
    ${st.logo ? '' : `<p class="hint-s">${T('logo_hint')}</p>`}
  </section>
  <section class="fsec">${secHead('look', 'sec_look')}
    <div class="fld full" style="margin-bottom:12px"><label>${T('color')}</label>
      <div class="swatches">${tpl.swatches.map(c => `<button type="button" class="sw${c.toLowerCase() === acc.toLowerCase() ? ' on' : ''}" data-sw="${c}" style="background:${c}" aria-label="${c}"></button>`).join('')}
        <label class="sw-custom" title="${T('color_custom')}"><input type="color" id="colorIn" value="${acc}"></label></div>
    </div>
    <div class="fld full" style="margin-bottom:6px"><label for="fontSel">${T('font')}</label>
      <select id="fontSel"><option value="">${T('font_auto')}</option>${fonts.map(f => `<option value="${f}"${st.font === f ? ' selected' : ''} style="font-family:'${f}'">${f}</option>`).join('')}</select>
    </div>
    <label class="switch"><span>${T('qr_toggle')}</span><input type="checkbox" id="qrT"${st.qrOn ? ' checked' : ''}><span class="tg"></span></label>
    ${st.qrOn ? `<div class="fld full"><label for="qrSel">${T('qr_mode')}</label>
      <select id="qrSel"><option value="vcard"${st.qrMode === 'vcard' ? ' selected' : ''}>${T('qr_vcard')}</option><option value="web"${st.qrMode === 'web' ? ' selected' : ''}>${T('qr_web')}</option></select></div>` : ''}
  </section>
  <div class="btn-row">
    <button type="button" class="btn" id="btnSample">${T('btn_sample')}</button>
    <button type="button" class="btn" id="btnClear">${T('btn_clear')}</button>
  </div>`;
}

let rafId = 0;
function onData() {
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
  document.title = T('tool_name') + ' — Merabti Academy';
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
window.addEventListener('resize', () => { clearTimeout(rzTimer); rzTimer = setTimeout(() => { renderStage(); $$('#gGrid .g-thumb').forEach(scaleThumb); }, 120); });

/* ---------------------------------------------------------
   Init
--------------------------------------------------------- */
applyUiLang();
buildForm();
renderGallery();
setView('both');
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { renderStage(); fillThumbs(); });

})();
