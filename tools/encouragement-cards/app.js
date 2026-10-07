/* =========================================================
   بطاقات التشجيع — Merabti Academy
   Encouragement cards for children: 30 templates (10 landscape), 3 sizes,
   batch names, print sheets, PDF, PNG, account saving.
   No living beings are drawn in any design.
   ========================================================= */
(function () {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const MM = 96 / 25.4;
const STORE_KEY = 'merabti_cards_v1';
const UI_KEY = 'merabti_cards_ui';

/* ---------------------------------------------------------
   UI strings
--------------------------------------------------------- */
const UI = {
  ar: {
    tool_name:'بطاقات التشجيع', gallery:'معرض القوالب', search:'ابحث عن قالب...', back_tools:'العودة إلى الأدوات',
    fullscreen:'ملء الشاشة', mine:'بطاقاتي', save:'حفظ في حسابي', print:'طباعة', pdf:'تحميل PDF', png:'تحميل صورة PNG', lang:'اللغة',
    toggle_panel:'إظهار / إخفاء حيّز التعبئة', fit:'ملاءمة الشاشة', view_card:'البطاقة', view_sheet:'ورقة الطباعة',
    cat_all:'الكل', cat_excel:'التفوّق', cat_study:'القراءة والدراسة', cat_behave:'السلوك والأخلاق', cat_improve:'التحسّن والمشاركة',
    cat_thanks:'الشكر', cat_clean:'النظافة والبيئة', cat_religion:'ديني ومناسبات',
    sec_style:'التنسيق', sec_style_d:'المقاس، الألوان، الخط واللغة',
    sec_text:'نص البطاقة', sec_text_d:'العنوان، الرمز وعبارة التشجيع',
    sec_child:'الطفل', sec_child_d:'الاسم أو قائمة أسماء',
    sec_sign:'التوقيع', sec_sign_d:'المانح، المؤسسة والتاريخ',
    sec_print:'الطباعة', sec_print_d:'ترتيب البطاقات في ورقة A4',
    size:'المقاس', orient:'الاتجاه', or_all:'كل الاتجاهات', o_p:'عمودي', o_l:'أفقي', sz_a6:'A6', sz_sm:'صغيرة', sz_a5:'A5',
    color:'اللون الرئيسي', font:'الخط', font_auto:'خط القالب', clang:'لغة البطاقة', reset_txt:'استعادة نصوص القالب',
    f_title:'العنوان', f_emblem:'الرمز', f_msg:'عبارة التشجيع', f_phrase:'اختر عبارة جاهزة...', none:'بدون',
    f_name:'اسم الطفل', f_names:'قائمة أسماء (اختياري)', f_names_h:'اسم في كل سطر، فتُنشأ بطاقة لكل طفل', names_n:'بطاقة',
    f_stars:'إظهار النجوم', f_stars_n:'عدد النجوم',
    f_from:'المانح', f_school:'المؤسسة / العائلة', f_date:'التاريخ', today:'اليوم', f_logo:'الشعار (اختياري)', add_img:'إضافة صورة',
    f_fill:'ملء الورقة بنسخ من البطاقة', f_fill_h:'عند عدم إدخال قائمة أسماء', f_cut:'خطوط القصّ', per_page:'بطاقات في كل ورقة A4',
    pages:'عدد الأوراق', next:'التالي', done:'تم', awarded:'مُهداة إلى',
    t_saved:'تم الحفظ', t_save_err:'تعذّر الحفظ: الصور كبيرة جدًا', t_pdf:'جاري تجهيز ملف PDF...', t_pdf_ok:'تم تحميل الملف',
    t_pdf_err:'تعذّر إنشاء الملف، استعمل زر الطباعة', t_png:'جاري تجهيز الصورة...', t_tpl:'تم تطبيق القالب', t_reset:'تمت استعادة نصوص القالب',
    no_results:'لا توجد قوالب مطابقة', page:'ورقة',
    new_b:'بطاقة جديدة', open_b:'فتح', dup_b:'نسخ', del_b:'حذف', confirm_del:'حذف هذه البطاقة نهائيًا من حسابك؟',
    login_title:'سجّل دخولك لحفظ بطاقاتك', login_text:'عملك محفوظ تلقائيًا في هذا الجهاز. سجّل الدخول ليُحفظ في حسابك وتفتحه من أي جهاز.',
    login_google:'الدخول بحساب Google', login_site:'تسجيل الدخول من الموقع', cancel:'إلغاء',
    t_saved_cloud:'تم الحفظ في حسابك', t_too_big:'البطاقة كبيرة جدًا للحفظ، صغّر الشعار', t_cloud_err:'تعذّر الحفظ في الحساب، عملك محفوظ في الجهاز',
    mine_empty:'لا توجد بطاقات محفوظة في حسابك بعد', loading:'جاري التحميل...', copy_suffix:' (نسخة)', t_opened:'تم فتح البطاقة',
    t_deleted:'تم الحذف', t_dup:'تم إنشاء نسخة', untitled:'بدون عنوان', current:'مفتوحة الآن', t_new:'بطاقة جديدة جاهزة'
  },
  fr: {
    tool_name:'Cartes d’encouragement', gallery:'Galerie de modèles', search:'Rechercher un modèle...', back_tools:'Retour aux outils',
    fullscreen:'Plein écran', mine:'Mes cartes', save:'Enregistrer dans mon compte', print:'Imprimer', pdf:'Télécharger PDF', png:'Télécharger en PNG', lang:'Langue',
    toggle_panel:'Afficher / masquer le panneau', fit:'Ajuster à l’écran', view_card:'Carte', view_sheet:'Feuille d’impression',
    cat_all:'Tous', cat_excel:'Excellence', cat_study:'Lecture & études', cat_behave:'Comportement', cat_improve:'Progrès & participation',
    cat_thanks:'Remerciements', cat_clean:'Propreté & nature', cat_religion:'Religion & fêtes',
    sec_style:'Mise en forme', sec_style_d:'Format, couleurs, police et langue',
    sec_text:'Texte de la carte', sec_text_d:'Titre, symbole et message',
    sec_child:'L’enfant', sec_child_d:'Un nom ou une liste de noms',
    sec_sign:'Signature', sec_sign_d:'Donateur, établissement et date',
    sec_print:'Impression', sec_print_d:'Disposition sur une feuille A4',
    size:'Format', orient:'Orientation', or_all:'Toutes', o_p:'Portrait', o_l:'Paysage', sz_a6:'A6', sz_sm:'Petite', sz_a5:'A5',
    color:'Couleur principale', font:'Police', font_auto:'Police du modèle', clang:'Langue de la carte', reset_txt:'Rétablir les textes du modèle',
    f_title:'Titre', f_emblem:'Symbole', f_msg:'Message d’encouragement', f_phrase:'Choisir un message prêt...', none:'Aucun',
    f_name:'Prénom de l’enfant', f_names:'Liste de noms (optionnel)', f_names_h:'Un nom par ligne : une carte par enfant', names_n:'cartes',
    f_stars:'Afficher les étoiles', f_stars_n:'Nombre d’étoiles',
    f_from:'Offerte par', f_school:'Établissement / famille', f_date:'Date', today:'Aujourd’hui', f_logo:'Logo (optionnel)', add_img:'Ajouter une image',
    f_fill:'Remplir la feuille avec des copies', f_fill_h:'Si aucune liste de noms', f_cut:'Traits de coupe', per_page:'cartes par feuille A4',
    pages:'Nombre de feuilles', next:'Suivant', done:'Terminé', awarded:'Décernée à',
    t_saved:'Enregistré', t_save_err:'Échec : images trop lourdes', t_pdf:'Préparation du PDF...', t_pdf_ok:'Fichier téléchargé',
    t_pdf_err:'Échec, utilisez Imprimer', t_png:'Préparation de l’image...', t_tpl:'Modèle appliqué', t_reset:'Textes du modèle rétablis',
    no_results:'Aucun modèle trouvé', page:'Feuille',
    new_b:'Nouvelle carte', open_b:'Ouvrir', dup_b:'Dupliquer', del_b:'Supprimer', confirm_del:'Supprimer définitivement cette carte ?',
    login_title:'Connectez-vous pour enregistrer vos cartes', login_text:'Votre travail est enregistré automatiquement sur cet appareil. Connectez-vous pour le garder dans votre compte.',
    login_google:'Continuer avec Google', login_site:'Se connecter sur le site', cancel:'Annuler',
    t_saved_cloud:'Enregistré dans votre compte', t_too_big:'Carte trop lourde, réduisez le logo', t_cloud_err:'Échec en ligne, votre travail reste sur l’appareil',
    mine_empty:'Aucune carte enregistrée', loading:'Chargement...', copy_suffix:' (copie)', t_opened:'Carte ouverte',
    t_deleted:'Supprimé', t_dup:'Copie créée', untitled:'Sans titre', current:'Ouverte', t_new:'Nouvelle carte prête'
  },
  en: {
    tool_name:'Encouragement Cards', gallery:'Template gallery', search:'Search templates...', back_tools:'Back to tools',
    fullscreen:'Full screen', mine:'My cards', save:'Save to my account', print:'Print', pdf:'Download PDF', png:'Download PNG image', lang:'Language',
    toggle_panel:'Show / hide the panel', fit:'Fit to screen', view_card:'Card', view_sheet:'Print sheet',
    cat_all:'All', cat_excel:'Excellence', cat_study:'Reading & study', cat_behave:'Behaviour', cat_improve:'Progress & participation',
    cat_thanks:'Thank you', cat_clean:'Tidiness & nature', cat_religion:'Religious & occasions',
    sec_style:'Style', sec_style_d:'Size, colors, font and language',
    sec_text:'Card text', sec_text_d:'Title, symbol and message',
    sec_child:'The child', sec_child_d:'One name or a list of names',
    sec_sign:'Signature', sec_sign_d:'Giver, school and date',
    sec_print:'Printing', sec_print_d:'Layout on an A4 sheet',
    size:'Size', orient:'Orientation', or_all:'All', o_p:'Portrait', o_l:'Landscape', sz_a6:'A6', sz_sm:'Small', sz_a5:'A5',
    color:'Main color', font:'Font', font_auto:'Template font', clang:'Card language', reset_txt:'Restore template texts',
    f_title:'Title', f_emblem:'Symbol', f_msg:'Encouraging message', f_phrase:'Pick a ready message...', none:'None',
    f_name:'Child’s name', f_names:'List of names (optional)', f_names_h:'One name per line: one card per child', names_n:'cards',
    f_stars:'Show stars', f_stars_n:'Number of stars',
    f_from:'Given by', f_school:'School / family', f_date:'Date', today:'Today', f_logo:'Logo (optional)', add_img:'Add image',
    f_fill:'Fill the sheet with copies', f_fill_h:'When no list of names is given', f_cut:'Cut lines', per_page:'cards per A4 sheet',
    pages:'Sheets', next:'Next', done:'Done', awarded:'Awarded to',
    t_saved:'Saved', t_save_err:'Could not save: images too large', t_pdf:'Preparing PDF...', t_pdf_ok:'File downloaded',
    t_pdf_err:'Export failed, please use Print', t_png:'Preparing image...', t_tpl:'Template applied', t_reset:'Template texts restored',
    no_results:'No matching templates', page:'Sheet',
    new_b:'New card', open_b:'Open', dup_b:'Duplicate', del_b:'Delete', confirm_del:'Delete this card from your account for good?',
    login_title:'Sign in to save your cards', login_text:'Your work is saved automatically on this device. Sign in to keep it in your account and open it anywhere.',
    login_google:'Continue with Google', login_site:'Sign in on the site', cancel:'Cancel',
    t_saved_cloud:'Saved to your account', t_too_big:'Card too large, use a smaller logo', t_cloud_err:'Could not save online, your work is kept on this device',
    mine_empty:'No cards saved in your account yet', loading:'Loading...', copy_suffix:' (copy)', t_opened:'Card opened',
    t_deleted:'Deleted', t_dup:'Copy created', untitled:'Untitled', current:'Open now', t_new:'New card ready'
  }
};

/* ---------------------------------------------------------
   Ready messages (same order in every language)
--------------------------------------------------------- */
const PHRASES = {
  ar: ['أنت نجم متألق، استمر في التميّز!','فخورون بك وبما حققته من تقدّم رائع.','اجتهادك يصنع مستقبلك المشرق.','شكرًا لأخلاقك الطيبة وسلوكك الجميل.',
    'قراءتك رائعة، واصل حبّ الكتب!','أحسنت في حلّ المسائل، أنت عبقري صغير!','بارك الله فيك على حفظك لكتاب الله.','نظافتك وترتيبك مثال يُحتذى به.',
    'مشاركتك في القسم تسعدنا دائمًا.','لاحظنا تحسّنك الكبير، نحن فخورون بك!','شكرًا لأنك ساعدت زملاءك.','أنت قدوة لزملائك في الانضباط.',
    'خطّك جميل ومرتّب، أحسنت!','فضولك العلمي رائع، واصل الاكتشاف!','سلوكك الجميل يزرع الفرح من حولك.','شكرًا لحفاظك على البيئة ونظافة المكان.',
    'بارك الله في صيامك وجعلك من الصالحين.','أفكارك المبدعة تدهشنا دائمًا!','أتممت عملك بإتقان، أحسنت!'],
  fr: ['Tu es une étoile qui brille, continue ainsi !','Nous sommes fiers de toi et de tes beaux progrès.','Tes efforts construisent ton bel avenir.','Merci pour ta gentillesse et ton beau comportement.',
    'Tu lis merveilleusement bien, continue d’aimer les livres !','Bravo pour tes calculs, tu es un petit génie !','Qu’Allah te bénisse pour ta mémorisation du Coran.','Ta propreté et ton ordre sont un exemple.',
    'Ta participation en classe nous fait toujours plaisir.','Nous avons remarqué tes grands progrès, bravo !','Merci d’avoir aidé tes camarades.','Tu es un exemple de discipline pour tes camarades.',
    'Ton écriture est belle et soignée, bravo !','Ta curiosité scientifique est formidable, continue d’explorer !','Ton beau comportement répand la joie autour de toi.','Merci de prendre soin de l’environnement.',
    'Qu’Allah bénisse ton jeûne et fasse de toi un vertueux.','Tes idées créatives nous étonnent toujours !','Tu as terminé ton travail avec soin, bravo !'],
  en: ['You are a shining star, keep it up!','We are proud of you and your wonderful progress.','Your hard work is building a bright future.','Thank you for your kindness and lovely behaviour.',
    'Your reading is wonderful, keep loving books!','Great job with your sums, you are a little genius!','May Allah bless you for memorising the Quran.','Your neatness and tidiness set a great example.',
    'Your participation in class always makes us happy.','We noticed your big improvement, well done!','Thank you for helping your classmates.','You are a role model of good discipline.',
    'Your handwriting is neat and beautiful, well done!','Your scientific curiosity is amazing, keep exploring!','Your good behaviour spreads joy all around you.','Thank you for caring for the environment.',
    'May Allah bless your fasting and make you among the righteous.','Your creative ideas always amaze us!','You finished your work perfectly, well done!']
};

/* ---------------------------------------------------------
   Emblems (viewBox 0 0 100 100) — objects only, no faces
--------------------------------------------------------- */
function starPts(cx, cy, r1, r2, n) {
  const p = [];
  for (let i = 0; i < n * 2; i++) { const r = i % 2 ? r2 : r1; const a = Math.PI * i / n - Math.PI / 2; p.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1)); }
  return p.join(' ');
}
const spark = (x, y, r, c) => `<path d="M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z" fill="${c}"/>`;
const EMBLEMS = {
  star: P => `<circle cx="50" cy="52" r="44" fill="${P.c3}" opacity=".18"/><polygon points="${starPts(50, 52, 40, 17, 5)}" fill="${P.c3}"/>
    <polygon points="${starPts(50, 52, 24, 10, 5)}" fill="#fff" opacity=".35"/>${spark(86, 16, 7, P.c1)}${spark(14, 26, 5, P.c2)}${spark(84, 84, 4, P.c2)}`,
  medal: P => `<path d="M30 4h16l8 34H38z" fill="${P.c1}"/><path d="M70 4H54l-8 34h16z" fill="${P.c2}"/>
    <circle cx="50" cy="64" r="30" fill="${P.c3}"/><circle cx="50" cy="64" r="23" fill="none" stroke="#fff" stroke-width="2.5" opacity=".7"/>
    <polygon points="${starPts(50, 64, 15, 6.5, 5)}" fill="#fff"/>`,
  trophy: P => `<path d="M26 14h48v18c0 16-10 28-24 30C36 60 26 48 26 32z" fill="${P.c3}"/>
    <path d="M26 20H14c0 14 6 22 14 24M74 20h12c0 14-6 22-14 24" fill="none" stroke="${P.c3}" stroke-width="6" stroke-linecap="round"/>
    <rect x="44" y="60" width="12" height="14" fill="${P.c3}"/><rect x="30" y="74" width="40" height="8" rx="3" fill="${P.c1}"/><rect x="24" y="82" width="52" height="10" rx="3" fill="${P.c1}"/>
    <polygon points="${starPts(50, 34, 11, 4.5, 5)}" fill="#fff"/><path d="M34 20v12" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/>`,
  crown: P => `<path d="M12 72L6 26l24 20L50 14l20 32 24-20-6 46z" fill="${P.c3}"/><rect x="12" y="72" width="76" height="14" rx="4" fill="${P.c1}"/>
    <circle cx="6" cy="26" r="5" fill="${P.c3}"/><circle cx="50" cy="14" r="6" fill="${P.c3}"/><circle cx="94" cy="26" r="5" fill="${P.c3}"/>
    <circle cx="30" cy="79" r="3.5" fill="${P.c2}"/><circle cx="50" cy="79" r="3.5" fill="#fff"/><circle cx="70" cy="79" r="3.5" fill="${P.c2}"/>
    <polygon points="${starPts(50, 52, 9, 4, 5)}" fill="#fff" opacity=".85"/>`,
  rocket: P => `<path d="M50 4C66 16 72 36 70 62H30C28 36 34 16 50 4z" fill="#fff" stroke="${P.c1}" stroke-width="3"/>
    <circle cx="50" cy="34" r="10" fill="${P.c2}" stroke="${P.c1}" stroke-width="3"/><path d="M30 46L16 66l14-2zM70 46l14 20-14-2z" fill="${P.c1}"/>
    <path d="M38 62h24l-4 8H42z" fill="${P.c1}"/><path d="M42 70c0 12 8 24 8 24s8-12 8-24z" fill="${P.c3}"/><path d="M46 70c0 7 4 14 4 14s4-7 4-14z" fill="#fff" opacity=".7"/>
    ${spark(16, 20, 5, P.c3)}${spark(86, 30, 4, P.c3)}`,
  book: P => `<path d="M50 24C38 16 22 16 8 20v58c14-4 30-4 42 4z" fill="#fff" stroke="${P.c1}" stroke-width="3"/>
    <path d="M50 24c12-8 28-8 42-4v58c-14-4-30-4-42 4z" fill="#fff" stroke="${P.c1}" stroke-width="3"/>
    <path d="M16 34c9-2 18-2 26 2M16 44c9-2 18-2 26 2M16 54c9-2 18-2 26 2M58 36c8-4 17-4 26-2M58 46c8-4 17-4 26-2M58 56c8-4 17-4 26-2" stroke="${P.c2}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M50 24v58" stroke="${P.c1}" stroke-width="3"/>${spark(50, 8, 6, P.c3)}${spark(84, 10, 4, P.c3)}`,
  pencil: P => `<g transform="rotate(-40 50 50)"><rect x="40" y="6" width="20" height="62" fill="${P.c3}"/><rect x="40" y="6" width="7" height="62" fill="#fff" opacity=".3"/>
    <rect x="40" y="2" width="20" height="10" rx="3" fill="${P.c1}"/><rect x="40" y="10" width="20" height="5" fill="#B8C2CC"/>
    <path d="M40 68h20L50 92z" fill="#F4D3A8"/><path d="M46 84h8L50 92z" fill="#333"/></g>
    <path d="M14 88c10-6 20 4 30-2" stroke="${P.c1}" stroke-width="3" fill="none" stroke-linecap="round"/>${spark(82, 76, 6, P.c2)}`,
  math: P => `<rect x="10" y="10" width="80" height="80" rx="18" fill="${P.c1}"/><path d="M50 10v80M10 50h80" stroke="#fff" stroke-width="2" opacity=".35"/>
    <path d="M30 22v16M22 30h16" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M62 30h16" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
    <path d="M24 64l12 12M36 64L24 76" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M62 70h16" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
    <circle cx="70" cy="62" r="3.5" fill="#fff"/><circle cx="70" cy="78" r="3.5" fill="#fff"/>${spark(92, 8, 6, P.c3)}`,
  atom: P => `<g fill="none" stroke="${P.c2}" stroke-width="4"><ellipse cx="50" cy="50" rx="42" ry="16"/><ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(60 50 50)"/><ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(-60 50 50)"/></g>
    <circle cx="50" cy="50" r="10" fill="${P.c3}"/><circle cx="92" cy="50" r="4.5" fill="${P.c3}"/><circle cx="29" cy="14" r="4.5" fill="${P.c3}"/><circle cx="29" cy="86" r="4.5" fill="${P.c3}"/>`,
  bulb: P => `<g stroke="${P.c3}" stroke-width="4" stroke-linecap="round"><path d="M50 4v8M18 16l6 6M82 16l-6 6M8 44h8M84 44h8"/></g>
    <path d="M50 18c-16 0-26 12-26 26 0 10 6 16 10 22 2 3 3 6 3 10h26c0-4 1-7 3-10 4-6 10-12 10-22 0-14-10-26-26-26z" fill="${P.c3}"/>
    <path d="M40 38c2-6 6-9 12-10" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>
    <rect x="37" y="78" width="26" height="6" rx="2" fill="${P.c1}"/><rect x="39" y="86" width="22" height="6" rx="2" fill="${P.c1}"/><rect x="44" y="93" width="12" height="4" rx="2" fill="${P.c1}"/>`,
  rainbow: P => `<g fill="none" stroke-width="7"><path d="M8 72a42 42 0 0 1 84 0" stroke="#FF6B6B"/><path d="M15 72a35 35 0 0 1 70 0" stroke="#FFA94D"/><path d="M22 72a28 28 0 0 1 56 0" stroke="#FFD93D"/>
    <path d="M29 72a21 21 0 0 1 42 0" stroke="#6BCB77"/><path d="M36 72a14 14 0 0 1 28 0" stroke="#4D96FF"/></g>
    <g fill="#fff" stroke="#DCE7F2" stroke-width="1.5"><path d="M2 80a10 10 0 0 1 12-10 12 12 0 0 1 22 4 8 8 0 0 1-2 16H8a7 7 0 0 1-6-10z"/><path d="M64 80a10 10 0 0 1 12-10 12 12 0 0 1 22 4 8 8 0 0 1-2 16H70a7 7 0 0 1-6-10z"/></g>`,
  balloons: P => `<g fill="none" stroke="#8A94A6" stroke-width="1.5"><path d="M30 58c4 12-4 20 10 36"/><path d="M52 50c-2 14 2 26-2 44"/><path d="M74 60c-6 12 2 20-14 34"/></g>
    <ellipse cx="30" cy="36" rx="17" ry="21" fill="${P.c1}"/><ellipse cx="52" cy="28" rx="18" ry="22" fill="${P.c3}"/><ellipse cx="74" cy="40" rx="16" ry="20" fill="${P.c2}"/>
    <path d="M27 57l3-4 3 4zM49 50l3-4 3 4zM71 60l3-4 3 4z" fill="#8A94A6"/>
    <ellipse cx="24" cy="28" rx="4" ry="7" fill="#fff" opacity=".45"/><ellipse cx="46" cy="20" rx="4" ry="7" fill="#fff" opacity=".45"/><ellipse cx="68" cy="32" rx="4" ry="7" fill="#fff" opacity=".45"/>`,
  heart: P => `<path d="M50 88C20 66 6 50 6 32 6 18 17 8 30 8c9 0 16 5 20 12 4-7 11-12 20-12 13 0 24 10 24 24 0 18-14 34-44 56z" fill="${P.c1}"/>
    <path d="M24 22c-6 2-9 8-8 14" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>${spark(88, 76, 6, P.c3)}${spark(12, 70, 4, P.c3)}`,
  flower: P => `<path d="M50 60v36" stroke="#4CAF50" stroke-width="5" stroke-linecap="round"/><path d="M50 82c-10-2-16-10-16-18 10 0 16 8 16 18zM50 76c10-2 16-10 16-18-10 0-16 8-16 18z" fill="#66BB6A"/>
    ${[0,60,120,180,240,300].map(a => `<ellipse cx="50" cy="16" rx="11" ry="16" fill="${P.c1}" transform="rotate(${a} 50 36)"/>`).join('')}
    <circle cx="50" cy="36" r="11" fill="${P.c3}"/><circle cx="46" cy="32" r="3" fill="#fff" opacity=".6"/>`,
  tree: P => `<rect x="44" y="60" width="12" height="32" rx="3" fill="#8D6E63"/><path d="M36 94h28" stroke="#6D4C41" stroke-width="4" stroke-linecap="round"/>
    <circle cx="50" cy="34" r="26" fill="#43A047"/><circle cx="30" cy="48" r="18" fill="#66BB6A"/><circle cx="70" cy="48" r="18" fill="#2E7D32"/><circle cx="50" cy="54" r="16" fill="#4CAF50"/>
    <circle cx="36" cy="34" r="4.5" fill="${P.c3}"/><circle cx="62" cy="28" r="4.5" fill="${P.c3}"/><circle cx="58" cy="52" r="4.5" fill="${P.c3}"/><circle cx="40" cy="56" r="4.5" fill="${P.c3}"/>`,
  mushaf: P => `<path d="M16 86l34-20 34 20" stroke="#8D6E63" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M20 70l30 18 30-18" stroke="#A1887F" stroke-width="5" fill="none" stroke-linecap="round"/>
    <rect x="22" y="8" width="56" height="62" rx="5" fill="${P.c2}" stroke="${P.c3}" stroke-width="3"/><rect x="29" y="15" width="42" height="48" rx="3" fill="none" stroke="${P.c3}" stroke-width="1.8"/>
    <polygon points="${starPts(50, 39, 14, 9, 8)}" fill="${P.c3}"/><circle cx="50" cy="39" r="5" fill="${P.c2}"/>`,
  lantern: P => `<path d="M50 2v8" stroke="${P.c3}" stroke-width="3"/><circle cx="50" cy="12" r="4" fill="none" stroke="${P.c3}" stroke-width="3"/>
    <path d="M36 16h28l6 10H30z" fill="${P.c3}"/><path d="M28 26h44l6 44-28 16-28-16z" fill="${P.c3}"/>
    <path d="M38 34h24l3 32-15 9-15-9z" fill="#FFF3C4"/><path d="M50 34v41M38 50h27" stroke="${P.c3}" stroke-width="2"/>
    <circle cx="50" cy="92" r="4" fill="${P.c3}"/>${spark(84, 30, 6, P.c3)}${spark(14, 60, 4, P.c3)}`,
  crescent: P => `<path d="M58 8a42 42 0 1 0 30 70A34 34 0 1 1 58 8z" fill="${P.c3}"/><polygon points="${starPts(70, 38, 13, 5.5, 5)}" fill="${P.c3}"/>${spark(20, 16, 5, P.c3)}`,
  bubble: P => `<path d="M14 14h72a8 8 0 0 1 8 8v42a8 8 0 0 1-8 8H44L24 90V72H14a8 8 0 0 1-8-8V22a8 8 0 0 1 8-8z" fill="${P.c1}"/>
    <circle cx="30" cy="43" r="6" fill="#fff"/><circle cx="50" cy="43" r="6" fill="#fff"/><circle cx="70" cy="43" r="6" fill="#fff"/>${spark(92, 88, 6, P.c3)}`,
  check: P => `<polygon points="${starPts(50, 50, 46, 38, 16)}" fill="${P.c1}"/><circle cx="50" cy="50" r="32" fill="#fff" opacity=".2"/>
    <path d="M32 51l12 12 24-26" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  sparkle: P => `${spark(50, 46, 34, P.c1)}${spark(20, 20, 12, P.c3)}${spark(82, 80, 14, P.c3)}${spark(84, 18, 8, P.c2)}${spark(16, 80, 8, P.c2)}
    <circle cx="50" cy="46" r="6" fill="#fff" opacity=".8"/>`,
  sun: P => `${Array.from({ length: 12 }, (_, i) => `<rect x="47" y="2" width="6" height="16" rx="3" fill="${P.c3}" transform="rotate(${i * 30} 50 50)"/>`).join('')}
    <circle cx="50" cy="50" r="26" fill="${P.c3}"/><circle cx="50" cy="50" r="18" fill="#fff" opacity=".25"/>`,
  seal: P => `<path d="M36 56L26 94l11-5 8 10 9-36z" fill="${P.c1}"/><path d="M64 56l10 38-11-5-8 10-9-36z" fill="${P.c2}"/>
    <polygon points="${starPts(50, 42, 40, 34, 24)}" fill="${P.c3}"/><circle cx="50" cy="42" r="29" fill="${P.c1}"/>
    <circle cx="50" cy="42" r="24" fill="none" stroke="${P.c3}" stroke-width="2" stroke-dasharray="3 2.4"/>
    <polygon points="${starPts(50, 42, 16, 7, 5)}" fill="${P.c3}"/>${spark(90, 12, 6, P.c3)}`,
  puzzle: P => `<rect x="10" y="10" width="38" height="38" rx="6" fill="${P.c1}"/><rect x="52" y="10" width="38" height="38" rx="6" fill="${P.c3}"/>
    <rect x="52" y="52" width="38" height="38" rx="6" fill="${P.c2}"/><rect x="10" y="52" width="38" height="38" rx="6" fill="${P.c4 || shade(P.c1, .45)}"/>
    <circle cx="50" cy="29" r="7" fill="${P.c1}"/><circle cx="71" cy="50" r="7" fill="${P.c3}"/><circle cx="50" cy="71" r="7" fill="${P.c2}"/><circle cx="29" cy="50" r="7" fill="${P.c4 || shade(P.c1, .45)}"/>
    <path d="M18 20h10M62 20h10" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".55"/>${spark(94, 6, 6, P.c3)}`,
  boat: P => `<path d="M49 8v58" stroke="${P.c1}" stroke-width="3.5" stroke-linecap="round"/><path d="M51 8l14 5-14 5z" fill="${P.c2}"/>
    <path d="M53 18c16 10 26 26 30 44H53z" fill="${P.c3}"/><path d="M45 24C34 34 24 48 20 62h25z" fill="#fff" stroke="${P.c1}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M12 68h76l-10 18H22z" fill="${P.c1}"/><circle cx="36" cy="76" r="2.6" fill="#fff"/><circle cx="50" cy="76" r="2.6" fill="#fff"/><circle cx="64" cy="76" r="2.6" fill="#fff"/>
    <path d="M6 93q7-5 14 0t14 0 14 0 14 0 14 0 14 0" stroke="${P.c2}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
  sprout: P => `<path d="M50 60V28" stroke="#4CAF50" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M50 48C38 48 26 42 24 28c12 0 24 6 26 20z" fill="#66BB6A"/><path d="M50 40c12 0 24-6 26-20-12 0-24 6-26 20z" fill="#43A047"/>
    <path d="M33 34c5 2 10 6 13 10M67 26c-5 2-10 6-13 10" stroke="#fff" stroke-width="1.6" fill="none" opacity=".55" stroke-linecap="round"/>
    ${[0, 72, 144, 216, 288].map(a => `<ellipse cx="50" cy="12" rx="5" ry="7" fill="${P.c1}" transform="rotate(${a} 50 19)"/>`).join('')}<circle cx="50" cy="19" r="4.5" fill="${P.c3}"/>
    <path d="M30 64h40l-6 30H36z" fill="#D9825B"/><rect x="25" y="56" width="50" height="11" rx="3" fill="#C06C47"/>
    <path d="${heartPath(50, 79, 5)}" fill="#fff" opacity=".85"/>`,
  gift: P => `<rect x="16" y="46" width="68" height="46" rx="4" fill="${P.c1}"/><rect x="10" y="32" width="80" height="16" rx="4" fill="${shade(P.c1, -.12)}"/>
    <circle cx="28" cy="62" r="3" fill="#fff" opacity=".35"/><circle cx="70" cy="80" r="3" fill="#fff" opacity=".35"/><circle cx="30" cy="84" r="2.4" fill="#fff" opacity=".35"/><circle cx="72" cy="58" r="2.4" fill="#fff" opacity=".35"/>
    <rect x="44" y="32" width="12" height="60" fill="${P.c3}"/>
    <path d="M50 32C40 14 22 16 26 26c3 7 16 6 24 6zM50 32c10-18 28-16 24-6-3 7-16 6-24 6z" fill="${P.c3}" stroke="${shade(P.c3, -.2)}" stroke-width="1.5"/>
    <circle cx="50" cy="31" r="5" fill="${shade(P.c3, -.15)}"/>${spark(88, 14, 6, P.c3)}${spark(10, 16, 4, P.c1)}`,
  mosque: P => `<rect x="8" y="34" width="8" height="58" fill="${P.c3}"/><path d="M6 34l6-16 6 16z" fill="${P.c3}"/><rect x="84" y="34" width="8" height="58" fill="${P.c3}"/><path d="M82 34l6-16 6 16z" fill="${P.c3}"/>
    <rect x="22" y="56" width="56" height="36" fill="${P.c3}"/><path d="M26 58c0-16 12-24 24-30 12 6 24 14 24 30z" fill="${P.c3}"/>
    <path d="M50 28v-12" stroke="${P.c3}" stroke-width="2.5"/><path d="M53 6a6 6 0 1 0 0 10 5 5 0 1 1 0-10z" fill="${P.c3}"/>
    <path d="M42 92V78a8 8 0 0 1 16 0v14z" fill="${P.c2}"/><path d="M28 74v-6a3.5 3.5 0 0 1 7 0v6zM65 74v-6a3.5 3.5 0 0 1 7 0v6z" fill="${P.c2}"/>
    <rect x="10.5" y="44" width="3" height="6" rx="1.5" fill="${P.c2}"/><rect x="86.5" y="44" width="3" height="6" rx="1.5" fill="${P.c2}"/>
    <path d="M4 92h92" stroke="${P.c3}" stroke-width="3" stroke-linecap="round"/>`,
  recycle: P => {
    const pt = (a, r) => [(50 + r * Math.cos(a * Math.PI / 180)).toFixed(1), (50 + r * Math.sin(a * Math.PI / 180)).toFixed(1)];
    const arrow = (a1, a2) => { const [x1, y1] = pt(a1, 36), [x2, y2] = pt(a2, 36), [tx, ty] = pt(a2 + 18, 36), [bx, by] = pt(a2, 46), [cx, cy] = pt(a2, 26);
      return `<path d="M${x1} ${y1}A36 36 0 0 1 ${x2} ${y2}" stroke="${P.c1}" stroke-width="8" fill="none" stroke-linecap="round"/><polygon points="${tx},${ty} ${bx},${by} ${cx},${cy}" fill="${P.c1}" stroke="${P.c1}" stroke-width="2" stroke-linejoin="round"/>`; };
    return `${arrow(200, 318)}${arrow(20, 138)}<path d="M50 70C34 64 32 44 50 30c18 14 16 34 0 40z" fill="#4CAF50"/><path d="M50 36v34" stroke="#fff" stroke-width="2" opacity=".7"/>${spark(88, 10, 6, P.c3)}`;
  }
};
const EMBLEM_KEYS = Object.keys(EMBLEMS);
const emblemSVG = (key, P) => EMBLEMS[key] ? `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${EMBLEMS[key](P)}</svg>` : '';

/* ---------------------------------------------------------
   Helpers
--------------------------------------------------------- */
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function rng(seed) { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = s * 16807 % 2147483647) / 2147483647; }
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const f = v => Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt)));
  return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(f).map(v => v.toString(16).padStart(2, '0')).join('');
}
let uid = 0;
const heartPath = (x, y, s) => `M${x} ${y + s * .9}C${x - s * 1.2} ${y + s * .1} ${x - s * .9} ${y - s * .9} ${x} ${y - s * .3}C${x + s * .9} ${y - s * .9} ${x + s * 1.2} ${y + s * .1} ${x} ${y + s * .9}Z`;
/* random points on an edge band, keeping the centre clear */
function edgePts(W, H, n, band, seed) {
  const r = rng(seed), pts = [];
  while (pts.length < n) {
    const x = r() * W, y = r() * H;
    const inCenter = x > W * band && x < W * (1 - band) && y > H * band && y < H * (1 - band);
    if (!inCenter) pts.push([x, y, r()]);
  }
  return pts;
}
/* landscape templates: the emblem sits on a start panel, 27u from the edge (matches .ct in style.css).
   Drawn left-to-right; cardHTML mirrors the whole drawing for right-to-left cards. */
const f1 = v => +(+v).toFixed(1);
const isLand = (W, H) => W >= H;
const emCenter = (W, H, u) => isLand(W, H) ? [u * 27, H / 2] : [W / 2, u * 25];
function emDisc(W, H, u, ring, dash) {
  const [x, y] = emCenter(W, H, u);
  return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(u * 21)}" fill="#fff"/>` +
    (ring ? `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(u * 23.5)}" fill="none" stroke="${ring}" stroke-width="${f1(u * .8)}"${dash ? ` stroke-dasharray="${f1(u * 1.6)} ${f1(u * 1.2)}"` : ''}/>` : '');
}
const wavePath = (x0, x1, y, a, p) => { let d = `M${f1(x0)} ${f1(y)}q${f1(p / 4)} ${f1(-a)} ${f1(p / 2)} 0`; for (let x = x0 + p / 2; x < x1; x += p / 2) d += `t${f1(p / 2)} 0`; return d; };
const leafShape = (x, y, a, len, c, op = 1) => `<path d="M0 0C${f1(len * .3)} ${f1(-len * .32)} ${f1(len * .75)} ${f1(-len * .32)} ${f1(len)} 0C${f1(len * .75)} ${f1(len * .32)} ${f1(len * .3)} ${f1(len * .32)} 0 0Z" fill="${c}"${op < 1 ? ` opacity="${op}"` : ''} transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(a)})"/>`;
const bloom = (x, y, r, c, mid) => `<g transform="translate(${f1(x)} ${f1(y)})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="${f1(-r * .62)}" rx="${f1(r * .42)}" ry="${f1(r * .62)}" fill="${c}" transform="rotate(${a})"/>`).join('')}<circle r="${f1(r * .38)}" fill="${mid}"/></g>`;
const bez = (p, t) => { const m = 1 - t; return [0, 1].map(i => m * m * m * p[0][i] + 3 * m * m * t * p[1][i] + 3 * m * t * t * p[2][i] + t * t * t * p[3][i]); };
function lantern(x, top, len, u, c) {
  const y = top + len, k = u * .9;
  return `<path d="M${f1(x)} ${f1(top)}V${f1(y)}" stroke="${c}" stroke-width="${f1(u * .25)}"/>
    <path d="M${f1(x - k * 2.2)} ${f1(y + k * 1.6)}L${f1(x)} ${f1(y)}L${f1(x + k * 2.2)} ${f1(y + k * 1.6)}Z" fill="${c}"/>
    <path d="M${f1(x - k * 3)} ${f1(y + k * 1.6)}h${f1(k * 6)}l${f1(-k * .6)} ${f1(k * 6)}l${f1(-k * 2.4)} ${f1(k * 1.4)}l${f1(-k * 2.4)} ${f1(-k * 1.4)}Z" fill="${c}"/>
    <path d="M${f1(x - k * 1.8)} ${f1(y + k * 2.6)}h${f1(k * 3.6)}l${f1(-k * .4)} ${f1(k * 4.2)}l${f1(-k * 1.4)} ${f1(k * .8)}l${f1(-k * 1.4)} ${f1(-k * .8)}Z" fill="#FFF3C4"/>
    <circle cx="${f1(x)}" cy="${f1(y + k * 10)}" r="${f1(k * .8)}" fill="${c}"/>`;
}

/* ---------------------------------------------------------
   Card decorations (W × H px, literal colors for PDF/PNG)
--------------------------------------------------------- */
const DECO = {
  rays(W, H, P, u) {
    const cx = W / 2, cy = H / 2, R = Math.hypot(W, H);
    let s = `<rect width="${W}" height="${H}" fill="${P.bg}"/>`;
    for (let i = 0; i < 24; i += 2) {
      const a1 = i * Math.PI / 12, a2 = (i + 1) * Math.PI / 12;
      s += `<path d="M${cx} ${cy}L${(cx + R * Math.cos(a1)).toFixed(1)} ${(cy + R * Math.sin(a1)).toFixed(1)}L${(cx + R * Math.cos(a2)).toFixed(1)} ${(cy + R * Math.sin(a2)).toFixed(1)}Z" fill="${P.c2}" opacity=".22"/>`;
    }
    s += `<rect x="${u * 3}" y="${u * 3}" width="${W - u * 6}" height="${H - u * 6}" rx="${u * 5}" fill="none" stroke="${P.c1}" stroke-width="${u * 1.2}"/>`;
    edgePts(W, H, 14, .14, 5).forEach(([x, y, k]) => s += spark(+x.toFixed(1), +y.toFixed(1), +(u * (1.5 + k * 2)).toFixed(1), k > .5 ? P.c3 : P.c1));
    return s;
  },
  ribbon(W, H, P, u) {
    return `<rect width="${W}" height="${H}" fill="${P.bg}"/>
      <rect x="${u * 2.5}" y="${u * 2.5}" width="${W - u * 5}" height="${H - u * 5}" fill="none" stroke="${P.c1}" stroke-width="${u * 2.2}"/>
      <rect x="${u * 5.5}" y="${u * 5.5}" width="${W - u * 11}" height="${H - u * 11}" fill="none" stroke="${P.c3}" stroke-width="${u * .6}"/>
      ${[[0, 0, 1, 1], [W, 0, -1, 1], [0, H, 1, -1], [W, H, -1, -1]].map(([x, y, dx, dy]) => `<path d="M${x} ${y}h${dx * u * 16}L${x} ${y + dy * u * 16}Z" fill="${P.c3}"/><path d="M${x} ${y}h${dx * u * 10}L${x} ${y + dy * u * 10}Z" fill="${P.c1}"/>`).join('')}
      <circle cx="${W / 2}" cy="${u * 2.5}" r="${u * 2}" fill="${P.c3}"/><circle cx="${W / 2}" cy="${H - u * 2.5}" r="${u * 2}" fill="${P.c3}"/>`;
  },
  confetti(W, H, P, u, seed) {
    const cols = [P.c1, P.c2, P.c3, P.c4 || P.c1];
    let s = `<rect width="${W}" height="${H}" fill="${P.bg}"/>`;
    const r = rng(seed + 3);
    edgePts(W, H, 60, .17, seed).forEach(([x, y, k], i) => {
      const c = cols[i % 4], sz = u * (1.6 + k * 2.4);
      if (k < .35) s += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(sz * .8).toFixed(1)}" height="${(sz * 1.8).toFixed(1)}" rx="${(u * .4).toFixed(1)}" fill="${c}" transform="rotate(${(r() * 180).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
      else if (k < .7) s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(sz * .6).toFixed(1)}" fill="${c}"/>`;
      else s += `<polygon points="${starPts(x, y, sz, sz * .45, 5)}" fill="${c}"/>`;
    });
    s += `<path d="M${-u * 2} ${u * 8}C${W * .25} ${u * 18} ${W * .5} ${-u * 2} ${W * .75} ${u * 10}S${W + u * 4} ${u * 4} ${W + u * 4} ${u * 12}" stroke="${P.c2}" stroke-width="${u * 1.2}" fill="none" stroke-linecap="round"/>
          <path d="M${-u * 2} ${H - u * 8}C${W * .25} ${H - u * 18} ${W * .5} ${H + u * 2} ${W * .75} ${H - u * 10}S${W + u * 4} ${H - u * 4} ${W + u * 4} ${H - u * 12}" stroke="${P.c1}" stroke-width="${u * 1.2}" fill="none" stroke-linecap="round"/>`;
    return s;
  },
  scallop(W, H, P, u) {
    const r = u * 4.2;
    let s = `<rect width="${W}" height="${H}" fill="${P.c2}"/>`;
    const inset = u * 5;
    s += `<rect x="${inset}" y="${inset}" width="${W - inset * 2}" height="${H - inset * 2}" rx="${u * 3}" fill="${P.bg}"/>`;
    for (let x = inset + r; x < W - inset; x += r * 2) s += `<circle cx="${x.toFixed(1)}" cy="${inset}" r="${r}" fill="${P.bg}"/><circle cx="${x.toFixed(1)}" cy="${H - inset}" r="${r}" fill="${P.bg}"/>`;
    for (let y = inset + r; y < H - inset; y += r * 2) s += `<circle cx="${inset}" cy="${y.toFixed(1)}" r="${r}" fill="${P.bg}"/><circle cx="${W - inset}" cy="${y.toFixed(1)}" r="${r}" fill="${P.bg}"/>`;
    s += `<rect x="${inset + u * 4}" y="${inset + u * 4}" width="${W - inset * 2 - u * 8}" height="${H - inset * 2 - u * 8}" rx="${u * 2}" fill="none" stroke="${P.c1}" stroke-width="${u * .5}" stroke-dasharray="${u * 2} ${u * 1.4}"/>`;
    return s;
  },
  notebook(W, H, P, u) {
    let s = `<rect width="${W}" height="${H}" fill="${P.bg}"/>`;
    for (let y = u * 14; y < H - u * 3; y += u * 6.5) s += `<line x1="0" y1="${y.toFixed(1)}" x2="${W}" y2="${y.toFixed(1)}" stroke="${P.c3}" stroke-width="${u * .35}" opacity=".55"/>`;
    s += `<line x1="${u * 11}" y1="0" x2="${u * 11}" y2="${H}" stroke="${P.c1}" stroke-width="${u * .5}" opacity=".6"/>`;
    for (let y = u * 10; y < H; y += u * 16) s += `<circle cx="${u * 5}" cy="${y.toFixed(1)}" r="${u * 1.8}" fill="#fff" stroke="${shade(P.bg, -.12)}" stroke-width="${u * .4}"/>`;
    s += `<rect x="${W / 2 - u * 12}" y="${-u * 1}" width="${u * 24}" height="${u * 7}" fill="${P.c2}" opacity=".85" transform="rotate(-3 ${W / 2} 0)"/>`;
    s += `<path d="M${W - u * 22} ${H - u * 8}c${u * 4} ${u * 3} ${u * 8} ${-u * 3} ${u * 12} 0s${u * 8} ${-u * 3} ${u * 12} 0" stroke="${P.c1}" stroke-width="${u * .8}" fill="none" stroke-linecap="round" opacity=".6"/>`;
    return s;
  },
  grid(W, H, P, u) {
    let s = `<rect width="${W}" height="${H}" fill="${P.bg}"/>`;
    for (let x = 0; x < W; x += u * 5) s += `<line x1="${x.toFixed(1)}" y1="0" x2="${x.toFixed(1)}" y2="${H}" stroke="${P.c1}" stroke-width="${u * .15}" opacity=".18"/>`;
    for (let y = 0; y < H; y += u * 5) s += `<line x1="0" y1="${y.toFixed(1)}" x2="${W}" y2="${y.toFixed(1)}" stroke="${P.c1}" stroke-width="${u * .15}" opacity=".18"/>`;
    const sym = ['+', '−', '×', '÷', '=', '%', '1', '2', '3', '7'];
    edgePts(W, H, 22, .16, 9).forEach(([x, y, k], i) => s += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-family="Inter, Arial, sans-serif" font-weight="800" font-size="${(u * (5 + k * 5)).toFixed(1)}" fill="${[P.c1, P.c2, P.c3][i % 3]}" opacity=".5" text-anchor="middle">${sym[i % sym.length]}</text>`);
    s += `<rect x="${u * 3}" y="${u * 3}" width="${W - u * 6}" height="${H - u * 6}" rx="${u * 4}" fill="none" stroke="${P.c1}" stroke-width="${u * .8}"/>`;
    return s;
  },
  space(W, H, P, u) {
    const g = 'g' + (++uid);
    let s = `<defs><radialGradient id="${g}" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="${shade(P.bg, .12)}"/><stop offset="1" stop-color="${shade(P.bg, -.3)}"/></radialGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#${g})"/>`;
    const r = rng(17);
    for (let i = 0; i < 70; i++) s += `<circle cx="${(r() * W).toFixed(1)}" cy="${(r() * H).toFixed(1)}" r="${(u * (.2 + r() * .5)).toFixed(2)}" fill="#fff" opacity="${(.4 + r() * .6).toFixed(2)}"/>`;
    s += `<circle cx="${W - u * 10}" cy="${u * 12}" r="${u * 9}" fill="${P.c2}"/><ellipse cx="${W - u * 10}" cy="${u * 12}" rx="${u * 15}" ry="${u * 3.5}" fill="none" stroke="${P.c3}" stroke-width="${u * 1}" transform="rotate(-20 ${W - u * 10} ${u * 12})"/>
          <circle cx="${u * 10}" cy="${H - u * 12}" r="${u * 6}" fill="${P.c3}" opacity=".9"/><circle cx="${u * 7.5}" cy="${H - u * 13.5}" r="${u * 1.4}" fill="#fff" opacity=".35"/>
          <ellipse cx="${W / 2}" cy="${H / 2}" rx="${W * .56}" ry="${H * .44}" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="${u * .4}"/>`;
    edgePts(W, H, 8, .14, 4).forEach(([x, y, k]) => s += spark(+x.toFixed(1), +y.toFixed(1), +(u * (1.2 + k * 1.6)).toFixed(1), P.c3));
    return s;
  },
  rainbow(W, H, P, u) {
    const cols = ['#FF6B6B', '#FFA94D', '#FFD93D', '#6BCB77', '#4D96FF'];
    let s = `<rect width="${W}" height="${H}" fill="${P.bg}"/>`;
    cols.forEach((c, i) => { const R = u * (34 - i * 5); s += `<path d="M${W - R} ${H} a${R} ${R} 0 0 1 ${R * 2} 0" fill="none" stroke="${c}" stroke-width="${u * 5}" transform="translate(${u * 6} 0)"/>`; });
    const cloud = (x, y, k) => `<g fill="#fff" transform="translate(${x} ${y}) scale(${k})"><circle cx="0" cy="0" r="${u * 5}"/><circle cx="${u * 6}" cy="${-u * 3}" r="${u * 6.5}"/><circle cx="${u * 13}" cy="0" r="${u * 5}"/><rect x="0" y="0" width="${u * 13}" height="${u * 5}"/></g>`;
    s += cloud(u * 8, u * 12, 1) + cloud(W - u * 34, u * 20, .7) + cloud(W - u * 26, H - u * 6, 1.1);
    edgePts(W, H, 10, .15, 12).forEach(([x, y, k], i) => s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(u * (.8 + k)).toFixed(1)}" fill="${[P.c1, P.c2, P.c3][i % 3]}" opacity=".7"/>`);
    return s;
  },
  balloons(W, H, P, u) {
    const cols = [P.c1, P.c2, P.c3, P.c4 || P.c1];
    let s = `<rect width="${W}" height="${H}" fill="${P.bg}"/>`;
    const b = (x, y, k, c) => `<path d="M${x} ${y + u * 7 * k}c${u * 2} ${u * 6} ${-u * 2} ${u * 10} ${u * 1} ${u * 16}" stroke="#9AA5B1" stroke-width="${u * .3}" fill="none"/>
      <ellipse cx="${x}" cy="${y}" rx="${u * 5 * k}" ry="${u * 6.5 * k}" fill="${c}"/><path d="M${x - u} ${y + u * 7 * k}h${u * 2}l${-u} ${-u * 1.2}z" fill="${c}"/>
      <ellipse cx="${x - u * 1.6 * k}" cy="${y - u * 2.4 * k}" rx="${u * 1.1 * k}" ry="${u * 2 * k}" fill="#fff" opacity=".45"/>`;
    s += b(u * 9, u * 12, 1, cols[0]) + b(u * 19, u * 9, .8, cols[1]) + b(W - u * 10, u * 13, 1, cols[2]) + b(W - u * 20, u * 8, .75, cols[3]);
    s += b(u * 10, H - u * 26, .7, cols[2]) + b(W - u * 11, H - u * 24, .8, cols[0]);
    for (let x = 0; x < W; x += u * 8) s += `<path d="M${x.toFixed(1)} ${H}l${u * 4} ${-u * 5}l${u * 4} ${u * 5}z" fill="${cols[Math.round(x / (u * 8)) % 4]}" opacity=".85"/>`;
    return s;
  },
  hearts(W, H, P, u) {
    let s = `<rect width="${W}" height="${H}" fill="${P.bg}"/>`;
    edgePts(W, H, 26, .15, 21).forEach(([x, y, k], i) => s += `<path d="${heartPath(x, y, u * (1.8 + k * 3))}" fill="${[P.c1, P.c2, P.c3][i % 3]}" opacity="${(.5 + k * .5).toFixed(2)}"/>`);
    s += `<rect x="${u * 3}" y="${u * 3}" width="${W - u * 6}" height="${H - u * 6}" rx="${u * 6}" fill="none" stroke="${P.c1}" stroke-width="${u * .7}" stroke-dasharray="${u * .1} ${u * 2.2}" stroke-linecap="round"/>`;
    return s;
  },
  nature(W, H, P, u) {
    let s = `<rect width="${W}" height="${H}" fill="${P.bg}"/>
      <path d="M0 ${H - u * 12}C${W * .3} ${H - u * 22} ${W * .6} ${H - u * 4} ${W} ${H - u * 16}V${H}H0Z" fill="${P.c2}"/>
      <path d="M0 ${H - u * 5}C${W * .35} ${H - u * 12} ${W * .7} ${H} ${W} ${H - u * 8}V${H}H0Z" fill="${shade(P.c2, -.2)}"/>`;
    const leaf = (x, y, a, k, c) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${k})"><path d="M0 0C${u * 4} ${-u * 5} ${u * 12} ${-u * 5} ${u * 16} 0C${u * 12} ${u * 5} ${u * 4} ${u * 5} 0 0Z" fill="${c}"/><path d="M${u} 0H${u * 14}" stroke="#fff" stroke-opacity=".5" stroke-width="${u * .4}"/></g>`;
    s += leaf(0, u * 4, 30, 1, P.c2) + leaf(u * 4, 0, 70, .8, shade(P.c2, -.2)) + leaf(W, u * 4, 150, 1, P.c2) + leaf(W - u * 4, 0, 110, .8, shade(P.c2, -.2));
    const flower = (x, y, k, c) => `<g transform="translate(${x} ${y}) scale(${k})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="${-u * 2.6}" rx="${u * 1.8}" ry="${u * 2.6}" fill="${c}" transform="rotate(${a})"/>`).join('')}<circle r="${u * 1.6}" fill="${P.c3}"/></g>`;
    [[.12, 9, 1, P.c1], [.3, 5, .7, P.c3 === P.c1 ? '#fff' : '#fff'], [.72, 6, .9, P.c1], [.9, 11, .75, '#fff']].forEach(([fx, fy, k, c]) => s += flower(W * fx, H - u * fy, k, c));
    return s;
  },
  arab(W, H, P, u) {
    let s = `<rect width="${W}" height="${H}" fill="${P.bg}"/>`;
    const step = u * 14;
    for (let y = step / 2; y < H; y += step) for (let x = step / 2; x < W; x += step)
      s += `<polygon points="${starPts(x, y, u * 4.5, u * 3, 8)}" fill="none" stroke="${P.c3}" stroke-width="${u * .3}" opacity=".16"/>`;
    s += `<rect x="${u * 3}" y="${u * 3}" width="${W - u * 6}" height="${H - u * 6}" fill="none" stroke="${P.c3}" stroke-width="${u * .9}"/>
          <rect x="${u * 5}" y="${u * 5}" width="${W - u * 10}" height="${H - u * 10}" fill="none" stroke="${P.c3}" stroke-width="${u * .35}" opacity=".7"/>`;
    [[u * 3, u * 3], [W - u * 3, u * 3], [u * 3, H - u * 3], [W - u * 3, H - u * 3]].forEach(([x, y]) => s += `<polygon points="${starPts(x, y, u * 4, u * 2.4, 8)}" fill="${P.c3}"/>`);
    return s;
  },
  bubbles(W, H, P, u) {
    let s = `<rect width="${W}" height="${H}" fill="${P.bg}"/>`;
    edgePts(W, H, 22, .16, 31).forEach(([x, y, k], i) => {
      const r = u * (1.5 + k * 5);
      s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${P.c2}" fill-opacity=".35" stroke="${P.c1}" stroke-opacity=".5" stroke-width="${u * .3}"/>
            <circle cx="${(x - r * .35).toFixed(1)}" cy="${(y - r * .35).toFixed(1)}" r="${(r * .22).toFixed(1)}" fill="#fff" opacity=".8"/>`;
      if (i % 4 === 0) s += spark(+(x + r * 1.4).toFixed(1), +(y - r).toFixed(1), +(u * 1.6).toFixed(1), P.c3);
    });
    s += `<rect x="${u * 3}" y="${u * 3}" width="${W - u * 6}" height="${H - u * 6}" rx="${u * 6}" fill="none" stroke="${P.c1}" stroke-width="${u * .8}"/>`;
    return s;
  },

  /* ----- landscape designs (orient:'l') ----- */
  certif(W, H, P, u) {
    const land = isLand(W, H), p = u * 6;
    let s = `<rect width="${W}" height="${H}" fill="${P.bg}"/>`;
    for (let y = u * 9; y < H - u * 8; y += u * 3.2) s += `<path d="${wavePath(u * 8, W - u * 8 - p / 2, y, u * .9, p)}" stroke="${P.c3}" stroke-opacity=".16" stroke-width="${f1(u * .18)}" fill="none"/>`;
    s += `<rect x="${u * 2.5}" y="${u * 2.5}" width="${f1(W - u * 5)}" height="${f1(H - u * 5)}" fill="none" stroke="${P.c1}" stroke-width="${f1(u * 2.2)}"/>
      <rect x="${f1(u * 5.2)}" y="${f1(u * 5.2)}" width="${f1(W - u * 10.4)}" height="${f1(H - u * 10.4)}" fill="none" stroke="${P.c3}" stroke-width="${f1(u * .6)}"/>
      <rect x="${f1(u * 6.6)}" y="${f1(u * 6.6)}" width="${f1(W - u * 13.2)}" height="${f1(H - u * 13.2)}" fill="none" stroke="${P.c3}" stroke-width="${f1(u * .25)}"/>`;
    const k = u * 5.9;
    [[k, k], [W - k, k], [k, H - k], [W - k, H - k]].forEach(([x, y]) => s += `<polygon points="${starPts(x, y, u * 3.6, u * 1.7, 8)}" fill="${P.c3}"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(u * 1.1)}" fill="${P.c1}"/>`);
    const dia = (x, y, r) => `<polygon points="${f1(x)},${f1(y - r)} ${f1(x + r * 1.6)},${f1(y)} ${f1(x)},${f1(y + r)} ${f1(x - r * 1.6)},${f1(y)}" fill="${P.c3}"/>`;
    s += dia(W / 2, k, u * 1.4) + dia(W / 2, H - k, u * 1.4);
    if (land) {
      /* laurel around the seal and a divider before the text */
      const [cx, cy0] = emCenter(W, H, u), cy = cy0 - u * 2.4, R = u * 17.5;
      s += `<path d="M${f1(cx + R * Math.cos(2))} ${f1(cy + R * Math.sin(2))}A${f1(R)} ${f1(R)} 0 0 1 ${f1(cx + R * Math.cos(4.3))} ${f1(cy + R * Math.sin(4.3))}M${f1(cx + R * Math.cos(1.14))} ${f1(cy + R * Math.sin(1.14))}A${f1(R)} ${f1(R)} 0 0 0 ${f1(cx + R * Math.cos(-1.16))} ${f1(cy + R * Math.sin(-1.16))}" stroke="${P.c3}" stroke-width="${f1(u * .5)}" fill="none" opacity=".8"/>`;
      for (let a = 118; a <= 244; a += 14) { const t = a * Math.PI / 180; s += leafShape(cx + R * Math.cos(t), cy + R * Math.sin(t), a + 90 + ((a / 14) % 2 ? 28 : -28), u * 4.6, P.c3, .85); }
      for (let a = 62; a >= -64; a -= 14) { const t = a * Math.PI / 180; s += leafShape(cx + R * Math.cos(t), cy + R * Math.sin(t), a - 90 + ((a / 14) % 2 ? 28 : -28), u * 4.6, P.c3, .85); }
      const dx = u * 49;
      s += `<path d="M${f1(dx)} ${f1(u * 18)}V${f1(H - u * 18)}" stroke="${P.c3}" stroke-width="${f1(u * .35)}"/>${dia(dx, u * 17, u * 1)}${dia(dx, H - u * 17, u * 1)}
        <polygon points="${starPts(dx, H / 2, u * 2.2, u * 1, 8)}" fill="${P.c3}"/>`;
    }
    return s;
  },
  diagonal(W, H, P, u, seed) {
    const land = isLand(W, H), g = 'dg' + (++uid);
    const pts = a => a.map(([x, y]) => f1(x) + ',' + f1(y)).join(' ');
    const band = land ? [[0, 0], [u * 56, 0], [u * 44, H], [0, H]] : [[0, 0], [W, 0], [W, u * 40], [0, u * 52]];
    const st1 = land ? [[u * 56, 0], [u * 60.5, 0], [u * 48.5, H], [u * 44, H]] : [[0, u * 52], [W, u * 40], [W, u * 44.5], [0, u * 56.5]];
    const st2 = land ? [[u * 62.5, 0], [u * 63.8, 0], [u * 51.8, H], [u * 50.5, H]] : [[0, u * 58.5], [W, u * 46.5], [W, u * 47.8], [0, u * 59.8]];
    const [cx, cy] = emCenter(W, H, u);
    let s = `<rect width="${W}" height="${H}" fill="${P.bg}"/><defs><clipPath id="${g}"><polygon points="${pts(band)}"/></clipPath></defs>
      <polygon points="${pts(band)}" fill="${P.c1}"/><g clip-path="url(#${g})">`;
    for (let r = u * 27; r < u * 90; r += u * 6) s += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}" fill="none" stroke="#fff" stroke-opacity=".17" stroke-width="${f1(u * .7)}"/>`;
    s += `</g><polygon points="${pts(st1)}" fill="${P.c3}"/><polygon points="${pts(st2)}" fill="${P.c1}" opacity=".5"/>` + emDisc(W, H, u, P.c3);
    const r = rng(seed + 11), cols = [P.c1, P.c3, P.c4 || P.c2];
    for (let n = 0, guard = 0; n < 22 && guard < 800; guard++) {
      const x = r() * W, y = r() * H, k = r();
      const free = land ? x > u * 74 : y > u * 68;
      if (!free || !(y < u * 7 || y > H - u * 6.5)) continue;
      const c = cols[n % 3], sz = u * (1 + k * 1.4);
      if (k < .35) s += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(sz * .7)}" height="${f1(sz * 1.7)}" rx="${f1(u * .3)}" fill="${c}" transform="rotate(${Math.round(r() * 180)} ${f1(x)} ${f1(y)})"/>`;
      else if (k < .7) s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(sz * .55)}" fill="${c}"/>`;
      else s += `<polygon points="${starPts(x, y, sz, sz * .45, 5)}" fill="${c}"/>`;
      n++;
    }
    return s;
  },
  shelf(W, H, P, u, seed) {
    const land = isLand(W, H), r = rng(seed + 5), soft = P.c4 || P.c2;
    const cols = [P.c1, P.c3, soft, shade(P.c1, .35), shade(P.c3, -.15)];
    const books = (x0, x1, base, hMin, hMax) => {
      let o = '', x = x0, i = 0;
      for (;;) {
        const w = u * (3.4 + r() * 2.2), h = u * (hMin + r() * (hMax - hMin)), c = cols[i++ % cols.length];
        if (x + w > x1) break;
        o += `<rect x="${f1(x)}" y="${f1(base - h)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(u * .5)}" fill="${c}"/>
          <rect x="${f1(x)}" y="${f1(base - h + u * 1.6)}" width="${f1(w)}" height="${f1(u * .6)}" fill="#fff" opacity=".5"/><rect x="${f1(x)}" y="${f1(base - u * 2.4)}" width="${f1(w)}" height="${f1(u * .6)}" fill="#fff" opacity=".5"/>`;
        x += w + u * .35;
      }
      return o;
    };
    const plank = (x, y, w) => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(u * 2.4)}" rx="${f1(u * .6)}" fill="#B07D52"/><rect x="${f1(x + u)}" y="${f1(y + u * 2.4)}" width="${f1(w - u * 2)}" height="${f1(u * .9)}" fill="#000" opacity=".1"/>`;
    let s = `<rect width="${W}" height="${H}" fill="${P.bg}"/>`;
    if (land) {
      const pw = u * 52;
      s += `<rect width="${f1(pw)}" height="${H}" fill="${shade(soft, .62)}"/><rect x="${f1(pw - u * .6)}" width="${f1(u * .6)}" height="${H}" fill="${shade(soft, .2)}"/>`;
      for (let y = u * 4, j = 0; y < H; y += u * 6, j++) for (let x = u * (j % 2 ? 6 : 3); x < pw - u * 2; x += u * 6) s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(u * .5)}" fill="#fff" opacity=".7"/>`;
      s += books(u * 4, u * 30, u * 17, 8, 12);
      const px = u * 40, py = u * 17;
      s += leafShape(px, py - u * 5.5, -60, u * 6, '#4CAF50') + leafShape(px, py - u * 5.5, -120, u * 6, '#66BB6A') + leafShape(px, py - u * 5.5, -90, u * 7, '#43A047') +
        `<path d="M${f1(px - u * 3.5)} ${f1(py - u * 5.5)}h${f1(u * 7)}l${f1(-u)} ${f1(u * 5.5)}h${f1(-u * 5)}z" fill="#D9825B"/>`;
      s += plank(u, u * 17, u * 50) + books(u * 3, u * 49, H - u * 7, 12, 17) + plank(u, H - u * 7, u * 50);
    } else {
      s += books(u * 6, W - u * 6, H - u * 6, 10, 15) + plank(u * 3, H - u * 6, W - u * 6);
    }
    const bx = W - u * 14;
    s += `<path d="M${f1(bx)} 0h${f1(u * 6)}v${f1(u * 16)}l${f1(-u * 3)} ${f1(-u * 3)}l${f1(-u * 3)} ${f1(u * 3)}z" fill="${P.c3}"/>`;
    return s;
  },
  blocks(W, H, P, u, seed) {
    const land = isLand(W, H), r = rng(seed + 29), cols = [P.c1, P.c2, P.c3, P.c4 || shade(P.c1, .45)];
    const t = u * 13, nx = land ? 4 : Math.ceil(W / t), ny = land ? Math.ceil(H / t) : 4;
    let s = `<rect width="${W}" height="${H}" fill="${P.bg}"/>`;
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const x = f1(i * t), y = f1(j * t), T = f1(t), a = Math.floor(r() * 4), c = cols[(a + 1 + Math.floor(r() * 3)) % 4], kind = Math.floor(r() * 6);
      s += `<rect x="${x}" y="${y}" width="${T}" height="${T}" fill="${cols[a]}"/>`;
      if (kind === 0) s += `<path d="M${x} ${y}h${T}A${T} ${T} 0 0 1 ${x} ${f1(y + t)}Z" fill="${c}"/>`;
      else if (kind === 1) s += `<path d="M${x} ${f1(y + t)}A${f1(t / 2)} ${f1(t / 2)} 0 0 1 ${f1(x + t)} ${f1(y + t)}Z" fill="${c}"/>`;
      else if (kind === 2) s += `<circle cx="${f1(x + t / 2)}" cy="${f1(y + t / 2)}" r="${f1(t * .34)}" fill="${c}"/>`;
      else if (kind === 3) s += `<polygon points="${x},${y} ${f1(x + t)},${y} ${x},${f1(y + t)}" fill="${c}"/>`;
      else if (kind === 4) s += `<polygon points="${f1(x + t / 2)},${f1(y + t * .14)} ${f1(x + t * .86)},${f1(y + t / 2)} ${f1(x + t / 2)},${f1(y + t * .86)} ${f1(x + t * .14)},${f1(y + t / 2)}" fill="${c}"/>`;
      else s += `<circle cx="${f1(x + t / 2)}" cy="${f1(y + t / 2)}" r="${f1(t * .28)}" fill="none" stroke="${c}" stroke-width="${f1(t * .14)}"/>`;
    }
    s += land ? `<rect x="${f1(t * 4)}" width="${f1(u * .8)}" height="${H}" fill="#fff"/>` : `<rect y="${f1(t * 4)}" width="${W}" height="${f1(u * .8)}" fill="#fff"/>`;
    s += emDisc(W, H, u, '#fff');
    const sw = f1(u * .7);
    if (land) {
      s += `<polygon points="${f1(W - u * 6)},${f1(u * 4)} ${f1(W - u * 3.8)},${f1(u * 8)} ${f1(W - u * 8.2)},${f1(u * 8)}" fill="none" stroke="${cols[3]}" stroke-width="${sw}" stroke-linejoin="round"/>`;
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) s += `<circle cx="${f1(W - u * 26 + i * u * 2.4)}" cy="${f1(u * 4 + j * u * 2.4)}" r="${f1(u * .5)}" fill="${P.c1}" opacity=".4"/>`;
    }
    s += `<circle cx="${f1(W - u * 5)}" cy="${f1(H * .58)}" r="${f1(u * 2)}" fill="none" stroke="${P.c2}" stroke-width="${sw}"/>
      <rect x="${f1(W - u * 6.8)}" y="${f1(H * .72)}" width="${f1(u * 3.2)}" height="${f1(u * 3.2)}" fill="none" stroke="${P.c3}" stroke-width="${sw}" transform="rotate(20 ${f1(W - u * 5.2)} ${f1(H * .72 + u * 1.6)})"/>`;
    if (!land) s += `<polygon points="${f1(u * 10)},${f1(H - u * 11)} ${f1(u * 12.2)},${f1(H - u * 7)} ${f1(u * 7.8)},${f1(H - u * 7)}" fill="none" stroke="${cols[3]}" stroke-width="${sw}" stroke-linejoin="round"/>`;
    return s;
  },
  waves(W, H, P, u) {
    const g = 'wv' + (++uid);
    let s = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(P.bg, .55)}"/><stop offset="1" stop-color="${P.bg}"/></linearGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#${g})"/>`;
    const sx = u * 12, sy = u * 12;
    s += `<circle cx="${f1(sx)}" cy="${f1(sy)}" r="${f1(u * 11)}" fill="${P.c3}" opacity=".18"/>`;
    for (let i = 0; i < 10; i++) s += `<rect x="${f1(sx - u * .6)}" y="${f1(sy - u * 10.2)}" width="${f1(u * 1.2)}" height="${f1(u * 2.4)}" rx="${f1(u * .6)}" fill="${P.c3}" transform="rotate(${i * 36} ${f1(sx)} ${f1(sy)})"/>`;
    s += `<circle cx="${f1(sx)}" cy="${f1(sy)}" r="${f1(u * 6.4)}" fill="${P.c3}"/>`;
    const cloud = (x, y, k) => `<g fill="#fff" transform="translate(${f1(x)} ${f1(y)}) scale(${k})"><circle r="${f1(u * 3.2)}"/><circle cx="${f1(u * 4)}" cy="${f1(-u * 2)}" r="${f1(u * 4.2)}"/><circle cx="${f1(u * 8.5)}" r="${f1(u * 3.2)}"/><rect width="${f1(u * 8.5)}" height="${f1(u * 3.2)}"/></g>`;
    s += cloud(u * 26, u * 10, .8) + cloud(W - u * 20, u * 7, .6);
    const layer = (y, a, p, off, c, op) => `<path d="${wavePath(-off, W + p, y, a, p)}V${H}H${f1(-off)}Z" fill="${c}"${op ? ` opacity="${op}"` : ''}/>`;
    s += layer(H - u * 15, u * 2, u * 22, u * 6, P.c2, .5) + layer(H - u * 10.5, u * 2.2, u * 18, 0, P.c2) + layer(H - u * 6, u * 2, u * 24, u * 9, P.c1);
    for (let x = u * 4.5, i = 0; x < W; x += u * 18, i++) s += `<ellipse cx="${f1(x)}" cy="${f1(H - u * 10.9)}" rx="${f1(u * 1.8)}" ry="${f1(u * .45)}" fill="#fff" opacity=".8"/>` + (i % 2 ? spark(f1(x + u * 9), f1(H - u * 3.5), f1(u * 1.1), '#fff') : '');
    return s;
  },
  ticket(W, H, P, u) {
    const land = isLand(W, H), m = u * 3, cut = land ? u * 52 : u * 46, [cx, cy] = emCenter(W, H, u);
    let s = `<rect width="${W}" height="${H}" fill="${P.c1}"/><rect x="${m}" y="${m}" width="${f1(W - m * 2)}" height="${f1(H - m * 2)}" rx="${f1(u * 3)}" fill="${P.bg}"/>`;
    if (land) for (let y = u * 8; y < H - u * 6; y += u * 3.4) s += `<path d="${wavePath(cut + u * 4, W - u * 10, y, u, u * 7)}" stroke="${P.c1}" stroke-opacity=".08" stroke-width="${f1(u * .25)}" fill="none"/>`;
    else for (let y = cut + u * 6; y < H - u * 6; y += u * 3.4) s += `<path d="${wavePath(u * 6, W - u * 10, y, u, u * 7)}" stroke="${P.c1}" stroke-opacity=".08" stroke-width="${f1(u * .25)}" fill="none"/>`;
    s += land ? `<rect x="${m}" y="${m}" width="${f1(cut - m)}" height="${f1(H - m * 2)}" rx="${f1(u * 3)}" fill="${P.c2}"/><rect x="${f1(cut - u * 4)}" y="${m}" width="${f1(u * 4)}" height="${f1(H - m * 2)}" fill="${P.c2}"/>`
              : `<rect x="${m}" y="${m}" width="${f1(W - m * 2)}" height="${f1(cut - m)}" rx="${f1(u * 3)}" fill="${P.c2}"/><rect x="${m}" y="${f1(cut - u * 4)}" width="${f1(W - m * 2)}" height="${f1(u * 4)}" fill="${P.c2}"/>`;
    s += `<polygon points="${starPts(cx, cy, u * 22, u * 17, 16)}" fill="#fff" opacity=".16"/><circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(u * 15)}" fill="#fff" opacity=".14"/>`;
    const sx0 = m + u * 5.5, sx1 = land ? cut - u * 5.5 : W - m - u * 5.5, sy1 = land ? H - m - u * 5.5 : cut - u * 5.5;
    [[sx0, sx0], [sx1, sx0], [sx0, sy1], [sx1, sy1]].forEach(([x, y]) => s += `<polygon points="${starPts(x, y, u * 2, u * .85, 5)}" fill="${P.c3}"/>`);
    const dash = `stroke="${P.c1}" stroke-width="${f1(u * .6)}" stroke-dasharray="${f1(u * 1.2)} ${f1(u * 1.4)}" stroke-linecap="round"`;
    if (land) {
      s += `<circle cx="${f1(cut)}" cy="${m}" r="${f1(u * 4)}" fill="${P.c1}"/><circle cx="${f1(cut)}" cy="${f1(H - m)}" r="${f1(u * 4)}" fill="${P.c1}"/><path d="M${f1(cut)} ${f1(m + u * 5)}V${f1(H - m - u * 5)}" ${dash}/>`;
      for (let y = u * 9; y < H - u * 8; y += u * 6) s += `<circle cx="${f1(W - m)}" cy="${f1(y)}" r="${f1(u * 1.5)}" fill="${P.c1}"/>`;
      s += `<rect x="${f1(cut + u * 3)}" y="${f1(m + u * 3)}" width="${f1(W - cut - m - u * 6)}" height="${f1(H - m * 2 - u * 6)}" rx="${f1(u * 2)}" fill="none" stroke="${P.c3}" stroke-width="${f1(u * .5)}"/>`;
    } else {
      s += `<circle cx="${m}" cy="${f1(cut)}" r="${f1(u * 4)}" fill="${P.c1}"/><circle cx="${f1(W - m)}" cy="${f1(cut)}" r="${f1(u * 4)}" fill="${P.c1}"/><path d="M${f1(m + u * 5)} ${f1(cut)}H${f1(W - m - u * 5)}" ${dash}/>`;
      for (let x = u * 9; x < W - u * 8; x += u * 6) s += `<circle cx="${f1(x)}" cy="${f1(H - m)}" r="${f1(u * 1.5)}" fill="${P.c1}"/>`;
      s += `<rect x="${f1(m + u * 3)}" y="${f1(cut + u * 3)}" width="${f1(W - m * 2 - u * 6)}" height="${f1(H - cut - m - u * 6)}" rx="${f1(u * 2)}" fill="none" stroke="${P.c3}" stroke-width="${f1(u * .5)}"/>`;
    }
    return s;
  },
  garden(W, H, P, u) {
    const land = isLand(W, H), leafC = shade(P.c2, -.3), leafD = shade(P.c2, -.45);
    let s = `<rect width="${W}" height="${H}" fill="${P.bg}"/>`;
    s += land ? `<path d="M0 0H${f1(u * 50)}C${f1(u * 60)} ${f1(H * .3)} ${f1(u * 44)} ${f1(H * .62)} ${f1(u * 54)} ${H}H0Z" fill="${shade(P.c2, .35)}"/>`
              : `<path d="M0 0H${W}V${f1(u * 44)}C${f1(W * .68)} ${f1(u * 54)} ${f1(W * .32)} ${f1(u * 36)} 0 ${f1(u * 47)}Z" fill="${shade(P.c2, .35)}"/>`;
    const vine = land ? [[u * 53, 0], [u * 63, H * .3], [u * 47, H * .62], [u * 57, H]] : [[W, u * 47], [W * .68, u * 57], [W * .32, u * 39], [0, u * 50]];
    s += `<path d="M${f1(vine[0][0])} ${f1(vine[0][1])}C${vine.slice(1).map(p => f1(p[0]) + ' ' + f1(p[1])).join(' ')}" stroke="${leafD}" stroke-width="${f1(u * .5)}" fill="none"/>`;
    for (let i = 0, tt = .05; tt < .97; tt += .09, i++) {
      const [x, y] = bez(vine, tt), a = land ? (i % 2 ? -140 : -40) : (i % 2 ? -60 : 60);
      s += leafShape(x, y, a, u * 4.2, i % 2 ? leafC : leafD);
    }
    const spray = (x, y, a, r, c, mid) => leafShape(x, y, a, r * 1.9, leafC) + leafShape(x, y, a + 70, r * 1.6, leafD) + bloom(x, y, r, c, mid);
    if (land) s += spray(u * 11, u * 11, 20, u * 4.2, P.c1, P.c3) + bloom(u * 38, u * 7, u * 2.8, P.c3, '#fff') + spray(u * 9, H - u * 11, -60, u * 3.4, P.c3, P.c1) + spray(u * 36, H - u * 8, 200, u * 4, P.c1, P.c3) +
      `<circle cx="${f1(u * 24)}" cy="${f1(u * 6)}" r="${f1(u)}" fill="${P.c1}"/><circle cx="${f1(u * 22)}" cy="${f1(H - u * 5)}" r="${f1(u)}" fill="${P.c3}"/>`;
    else s += spray(u * 9, u * 9, 20, u * 4, P.c1, P.c3) + spray(W - u * 9, u * 10, 160, u * 3.4, P.c3, P.c1) + bloom(u * 16, u * 36, u * 2.4, P.c3, '#fff');
    s += emDisc(W, H, u, P.c1, true);
    const corner = (x, y, a, c, mid) => leafShape(x, y, a, u * 5, leafC) + leafShape(x, y, a - 50, u * 4, leafD) + bloom(x, y, u * 2, c, mid);
    s += land ? corner(W - u * 7, u * 6.5, 160, P.c1, P.c3) : corner(W - u * 7, H - u * 6.5, 250, P.c1, P.c3);
    s += `<rect x="${u * 3}" y="${u * 3}" width="${f1(W - u * 6)}" height="${f1(H - u * 6)}" rx="${f1(u * 4)}" fill="none" stroke="${leafC}" stroke-width="${f1(u * .5)}" stroke-dasharray="${f1(u * .1)} ${f1(u * 1.6)}" stroke-linecap="round"/>`;
    return s;
  },
  sunrise(W, H, P, u) {
    const [cx, cy] = emCenter(W, H, u), g = 'sr' + (++uid), R = Math.hypot(W, H) * 1.1;
    let s = `<defs><radialGradient id="${g}" gradientUnits="userSpaceOnUse" cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(Math.max(W, H) * .95)}"><stop offset="0" stop-color="${P.c2}" stop-opacity=".95"/><stop offset="1" stop-color="${P.c2}" stop-opacity="0"/></radialGradient></defs>
      <rect width="${W}" height="${H}" fill="${P.bg}"/>`;
    for (let i = 0; i < 32; i += 2) {
      const a1 = i * Math.PI / 16, a2 = (i + 1) * Math.PI / 16;
      s += `<path d="M${f1(cx)} ${f1(cy)}L${f1(cx + R * Math.cos(a1))} ${f1(cy + R * Math.sin(a1))}L${f1(cx + R * Math.cos(a2))} ${f1(cy + R * Math.sin(a2))}Z" fill="url(#${g})"/>`;
    }
    s += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(u * 34)}" fill="none" stroke="${P.c1}" stroke-width="${f1(u * .7)}" stroke-dasharray="${f1(u * .1)} ${f1(u * 2)}" stroke-linecap="round"/>
      <circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(u * 29)}" fill="${P.c3}" opacity=".22"/><circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(u * 25.5)}" fill="${P.c3}" opacity=".35"/>` + emDisc(W, H, u, P.c3);
    const ht = (x, y, k, c) => `<path d="${heartPath(f1(x), f1(y), f1(u * k))}" fill="${c}"/>`;
    s += ht(W - u * 10, u * 10, 2.2, P.c1) + ht(W - u * 18, u * 6.5, 1.3, P.c3) + spark(f1(W - u * 6), f1(u * 18), f1(u * 1.6), P.c3) +
      ht(W - u * 5.5, H * .62, 1.5, P.c4 || P.c1) + spark(f1(u * 6.5), f1(u * 8), f1(u * 1.4), P.c1) + ht(u * 8, H - u * 8, 1.5, P.c1);
    s += `<rect x="${u * 3}" y="${u * 3}" width="${f1(W - u * 6)}" height="${f1(H - u * 6)}" rx="${f1(u * 5)}" fill="none" stroke="${P.c1}" stroke-width="${f1(u * .6)}" opacity=".7"/>`;
    return s;
  },
  nightsky(W, H, P, u, seed) {
    const land = isLand(W, H), g = 'ns' + (++uid), r = rng(seed + 41);
    let s = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(P.bg, .14)}"/><stop offset="1" stop-color="${shade(P.bg, -.35)}"/></linearGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#${g})"/>`;
    for (let i = 0; i < 90; i++) {
      const x = r() * W, y = r() * H, k = r(), o = r();
      if (x > u * 6 && x < W - u * 6 && y > u * 6 && y < H - u * 6 && (land ? x > u * 54 : y > u * 44)) continue; /* keep the text area clear */
      s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(u * (.15 + k * .4))}" fill="#fff" opacity="${(.35 + o * .6).toFixed(2)}"/>`;
    }
    (land ? [[8, 38], [46, 64], [9, 80], [44, 88], [W / u - 5, H / u * .5]] : [[8, 50], [W / u - 8, 60], [W / u - 5, H / u * .8]]).forEach(([x, y], i) => s += spark(f1(x * u), f1(y * u), f1(u * (1 + (i % 2) * .7)), P.c3));
    s += `<rect x="${u * 3}" y="${u * 3}" width="${f1(W - u * 6)}" height="${f1(H - u * 6)}" fill="none" stroke="${P.c3}" stroke-width="${f1(u * .5)}"/>
      <rect x="${f1(u * 4.4)}" y="${f1(u * 4.4)}" width="${f1(W - u * 8.8)}" height="${f1(H - u * 8.8)}" fill="none" stroke="${P.c3}" stroke-width="${f1(u * .2)}" opacity=".6"/>`;
    [[u * 3, u * 3], [W - u * 3, u * 3], [u * 3, H - u * 3], [W - u * 3, H - u * 3]].forEach(([x, y]) => s += `<polygon points="${starPts(x, y, u * 2.8, u * 1.7, 8)}" fill="${P.c3}"/>`);
    const moon = (x, y) => `<path d="M58 8a42 42 0 1 0 30 70A34 34 0 1 1 58 8z" fill="${P.c3}" transform="translate(${f1(x - u * 7)} ${f1(y - u * 7)}) scale(${(u * .14).toFixed(4)})"/>`;
    if (land) {
      s += moon(u * 27, u * 14) + spark(f1(u * 35), f1(u * 9), f1(u * 1.2), P.c3) + lantern(u * 11, u * 3, u * 6, u, P.c3) + lantern(u * 43, u * 3, u * 9, u, P.c3);
      for (let y = u * 16; y <= H - u * 16; y += u * 3) if (Math.abs(y - H / 2) > u * 3) s += `<circle cx="${f1(u * 52)}" cy="${f1(y)}" r="${f1(u * .35)}" fill="${P.c3}" opacity=".75"/>`;
      s += `<polygon points="${starPts(u * 52, H / 2, u * 1.8, u * .9, 8)}" fill="${P.c3}"/>`;
    } else {
      s += moon(u * 14, u * 15) + lantern(W - u * 12, u * 3, u * 5, u, P.c3) + lantern(W - u * 22, u * 3, u * 1.5, u, P.c3);
    }
    return s;
  },
  ecoband(W, H, P, u) {
    const land = isLand(W, H), g = 'eb' + (++uid);
    const d = land ? `M0 0H${f1(u * 44)}Q${f1(u * 64)} ${f1(H / 2)} ${f1(u * 44)} ${H}H0Z` : `M0 0H${W}V${f1(u * 42)}Q${f1(W / 2)} ${f1(u * 62)} 0 ${f1(u * 42)}Z`;
    let s = `<rect width="${W}" height="${H}" fill="${P.bg}"/><defs><clipPath id="${g}"><path d="${d}"/></clipPath></defs><path d="${d}" fill="${P.c1}"/><g clip-path="url(#${g})">`;
    for (let y = u * 4, j = 0; y < (land ? H + u * 4 : u * 62); y += u * 8, j++)
      for (let x = u * (j % 2 ? 7 : 3); x < (land ? u * 62 : W + u * 4); x += u * 8) s += leafShape(x, y, j % 2 ? -30 : -150, u * 4, '#fff', .13);
    s += `</g>`;
    const drop = (x, y, k) => `<path d="M0 -3C1.8 -.5 2.4 .6 2.4 1.4a2.4 2.4 0 0 1-4.8 0C-2.4 .6-1.8-.5 0-3Z" fill="#fff" opacity=".6" transform="translate(${f1(x)} ${f1(y)}) scale(${(u * k).toFixed(3)})"/>`;
    if (land) {
      const q = t => [(1 - t) * (1 - t) * u * 44 + 2 * (1 - t) * t * u * 64 + t * t * u * 44, 2 * (1 - t) * t * H / 2 + t * t * H];
      const [x1, y1] = q(.16), [x2, y2] = q(.84);
      s += leafShape(x1, y1, -60, u * 7, P.c2) + leafShape(x1, y1, -110, u * 5, shade(P.c2, .3)) + leafShape(x2, y2, 60, u * 7, P.c2) + leafShape(x2, y2, 110, u * 5, shade(P.c2, .3));
      s += drop(u * 10, u * 12, 1.1) + drop(u * 40, u * 9, .8) + drop(u * 12, H - u * 12, .9);
    } else {
      s += drop(u * 12, u * 12, 1.1) + drop(W - u * 12, u * 14, .9);
    }
    s += emDisc(W, H, u, P.c2);
    const sprig = (x, y, a) => leafShape(x, y, a, u * 6, P.c1, .85) + leafShape(x, y, a + 35, u * 5, P.c2);
    if (land) {
      for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) s += `<circle cx="${f1(W - u * 16 + i * u * 3)}" cy="${f1(u * 6 + j * u * 3)}" r="${f1(u * .6)}" fill="${P.c2}"/>`;
    } else s += sprig(u * 6, H - u * 5, -65);
    s += `<rect x="${u * 3}" y="${u * 3}" width="${f1(W - u * 6)}" height="${f1(H - u * 6)}" rx="${f1(u * 4)}" fill="none" stroke="${P.c2}" stroke-width="${f1(u * .5)}"/>`;
    return s;
  }
};

/* ---------------------------------------------------------
   Templates (30) — orient:'l' marks a landscape design: choosing it
   from the gallery switches the card to landscape.
--------------------------------------------------------- */
const TEMPLATES = [
  { id:'star',    cat:'excel',   style:'rays',     emblem:'star',    font:'Baloo Bhaijaan 2', msg:0,  pal:{c1:'#F08A24', c2:'#FFD166', c3:'#FFB703', bg:'#FFF8E7', ink:'#3A2A12'},
    t:{ar:'نجمة الأسبوع', fr:'Étoile de la semaine', en:'Star of the week'} },
  { id:'medal',   cat:'excel',   style:'ribbon',   emblem:'medal',   font:'Cairo', msg:11, pal:{c1:'#1D3557', c2:'#457B9D', c3:'#E9C46A', bg:'#FFFFFF', ink:'#1D3557'},
    t:{ar:'تلميذ مثالي', fr:'Élève modèle', en:'Model student'} },
  { id:'trophy',  cat:'excel',   style:'confetti', emblem:'trophy',  font:'Baloo Bhaijaan 2', msg:2, pal:{c1:'#E63946', c2:'#1D8FE1', c3:'#FFBE0B', c4:'#2EC4B6', bg:'#FFFFFF', ink:'#22223B'},
    t:{ar:'بطل الأسبوع', fr:'Champion de la semaine', en:'Champion of the week'} },
  { id:'crown',   cat:'excel',   style:'scallop',  emblem:'crown',   font:'Changa', msg:1, pal:{c1:'#7B2CBF', c2:'#E0AAFF', c3:'#F4A300', bg:'#FDF8FF', ink:'#3C096C'},
    t:{ar:'أحسنت يا بطل', fr:'Bravo champion !', en:'Well done, champ!'} },
  { id:'book',    cat:'study',   style:'notebook', emblem:'book',    font:'Almarai', msg:4, pal:{c1:'#E76F51', c2:'#FFE08A', c3:'#8ECAE6', bg:'#FFFDF5', ink:'#264653'},
    t:{ar:'قارئ متميّز', fr:'Super lecteur', en:'Super reader'} },
  { id:'pencil',  cat:'study',   style:'notebook', emblem:'pencil',  font:'Baloo Bhaijaan 2', msg:12, pal:{c1:'#2A9D8F', c2:'#FFD6A5', c3:'#F4A261', bg:'#FFFCF2', ink:'#1B4332'},
    t:{ar:'خطّ جميل', fr:'Belle écriture', en:'Beautiful handwriting'} },
  { id:'math',    cat:'study',   style:'grid',     emblem:'math',    font:'Baloo Bhaijaan 2', msg:5, pal:{c1:'#3A86FF', c2:'#FF006E', c3:'#FFBE0B', bg:'#F7FBFF', ink:'#14213D'},
    t:{ar:'عبقري الحساب', fr:'Génie des maths', en:'Math genius'} },
  { id:'atom',    cat:'study',   style:'space',    emblem:'atom',    font:'Changa', msg:13, dark:true, pal:{c1:'#7B2CBF', c2:'#48CAE4', c3:'#FFD60A', bg:'#1B0A3C', ink:'#F5EFE0'},
    t:{ar:'عالِم صغير', fr:'Petit scientifique', en:'Little scientist'} },
  { id:'rocket',  cat:'improve', style:'space',    emblem:'rocket',  font:'Baloo Bhaijaan 2', msg:9, dark:true, pal:{c1:'#1D4E89', c2:'#FF7B00', c3:'#FFD166', bg:'#0B2545', ink:'#F5EFE0'},
    t:{ar:'تحسّن ملحوظ', fr:'Beaux progrès', en:'Great progress'} },
  { id:'rainbow', cat:'improve', style:'rainbow',  emblem:'rainbow', font:'Baloo Bhaijaan 2', msg:2, pal:{c1:'#FF6B6B', c2:'#4ECDC4', c3:'#FFD93D', bg:'#EAF7FF', ink:'#2D3047'},
    t:{ar:'أحسنت!', fr:'Bravo !', en:'Well done!'} },
  { id:'balloons',cat:'thanks',  style:'balloons', emblem:'balloons',font:'Baloo Bhaijaan 2', msg:10, pal:{c1:'#EF476F', c2:'#06D6A0', c3:'#FFD166', c4:'#118AB2', bg:'#FFF5F7', ink:'#3D2C3E'},
    t:{ar:'شكرًا لك', fr:'Merci !', en:'Thank you!'} },
  { id:'heart',   cat:'behave',  style:'hearts',   emblem:'heart',   font:'Cairo', msg:3, pal:{c1:'#E5383B', c2:'#FFB3C1', c3:'#FF8FA3', bg:'#FFF0F3', ink:'#590D22'},
    t:{ar:'أخلاق عالية', fr:'Belles manières', en:'Kind heart'} },
  { id:'flower',  cat:'behave',  style:'nature',   emblem:'flower',  font:'Almarai', msg:14, pal:{c1:'#D63384', c2:'#95D5B2', c3:'#FFB703', bg:'#F4FBF6', ink:'#2D3A2E'},
    t:{ar:'سلوك رائع', fr:'Comportement exemplaire', en:'Great behaviour'} },
  { id:'tree',    cat:'clean',   style:'nature',   emblem:'tree',    font:'Cairo', msg:15, pal:{c1:'#2D6A4F', c2:'#95D5B2', c3:'#F4A261', bg:'#F1FAEE', ink:'#1B4332'},
    t:{ar:'صديق البيئة', fr:'Ami de la nature', en:'Friend of nature'} },
  { id:'sparkle', cat:'clean',   style:'bubbles',  emblem:'sparkle', font:'Baloo Bhaijaan 2', msg:7, pal:{c1:'#00A6FB', c2:'#9BF6FF', c3:'#FFD60A', bg:'#EFFAFF', ink:'#023047'},
    t:{ar:'نظافة وترتيب', fr:'Propre et organisé', en:'Neat and tidy'} },
  { id:'mushaf',  cat:'religion',style:'arab',     emblem:'mushaf',  font:'El Messiri', msg:6, dark:true, pal:{c1:'#2D6A4F', c2:'#1B4332', c3:'#E9C46A', bg:'#0F2A1E', ink:'#F5EFE0'},
    t:{ar:'حافظ كتاب الله', fr:'Mémorisation du Coran', en:'Quran memorizer'} },
  { id:'lantern', cat:'religion',style:'arab',     emblem:'lantern', font:'El Messiri', msg:16, dark:true, pal:{c1:'#14213D', c2:'#1F3A68', c3:'#FCA311', bg:'#0B1630', ink:'#F5EFE0'},
    t:{ar:'صائم صغير', fr:'Petit jeûneur', en:'Little faster'} },
  { id:'bulb',    cat:'improve', style:'rays',     emblem:'bulb',    font:'Changa', msg:17, pal:{c1:'#0FA3B1', c2:'#B5E2FA', c3:'#F7A072', bg:'#F2FBFC', ink:'#0B3C49'},
    t:{ar:'فكرة رائعة', fr:'Excellente idée', en:'Brilliant idea'} },
  { id:'bubble',  cat:'improve', style:'confetti', emblem:'bubble',  font:'Baloo Bhaijaan 2', msg:8, pal:{c1:'#8338EC', c2:'#3A86FF', c3:'#FB5607', c4:'#FFBE0B', bg:'#FFFFFF', ink:'#240046'},
    t:{ar:'مشاركة فعّالة', fr:'Participation active', en:'Active participation'} },
  { id:'check',   cat:'excel',   style:'scallop',  emblem:'check',   font:'Changa', msg:18, pal:{c1:'#2B9348', c2:'#B7E4C7', c3:'#F9A620', bg:'#F6FCF7', ink:'#1B4332'},
    t:{ar:'إنجاز رائع', fr:'Travail accompli', en:'Great achievement'} },
  /* ----- landscape ----- */
  { id:'cert',    cat:'excel',   style:'certif',   emblem:'seal',    font:'Cairo', msg:2, orient:'l', pal:{c1:'#1F4E79', c2:'#2E86AB', c3:'#D4A62A', bg:'#FFFBF0', ink:'#1F2D3D'},
    t:{ar:'شهادة تفوّق', fr:'Certificat d’excellence', en:'Certificate of excellence'} },
  { id:'first',   cat:'excel',   style:'diagonal', emblem:'trophy',  font:'Baloo Bhaijaan 2', msg:0, orient:'l', pal:{c1:'#FF5A5F', c2:'#FFB4B6', c3:'#FFC93C', c4:'#3DB2FF', bg:'#FFFFFF', ink:'#2B2D42'},
    t:{ar:'المركز الأول', fr:'Première place', en:'First place'} },
  { id:'shelf',   cat:'study',   style:'shelf',    emblem:'book',    font:'Almarai', msg:4, orient:'l', pal:{c1:'#3D5A80', c2:'#98C1D9', c3:'#EE6C4D', c4:'#7FB7BE', bg:'#FFFDF7', ink:'#293241'},
    t:{ar:'بطل القراءة', fr:'Champion de lecture', en:'Reading champion'} },
  { id:'puzzle',  cat:'study',   style:'blocks',   emblem:'puzzle',  font:'Changa', msg:17, orient:'l', pal:{c1:'#118AB2', c2:'#06D6A0', c3:'#FFD166', c4:'#EF476F', bg:'#FFFFFF', ink:'#073B4C'},
    t:{ar:'عقل ذكي', fr:'Esprit brillant', en:'Clever mind'} },
  { id:'sail',    cat:'improve', style:'waves',    emblem:'boat',    font:'Baloo Bhaijaan 2', msg:9, orient:'l', pal:{c1:'#0077B6', c2:'#48CAE4', c3:'#FFB703', bg:'#E3F5FF', ink:'#023E8A'},
    t:{ar:'نحو النجاح', fr:'Cap sur la réussite', en:'Sailing to success'} },
  { id:'ticket',  cat:'improve', style:'ticket',   emblem:'star',    font:'Changa', msg:18, orient:'l', pal:{c1:'#6A2C70', c2:'#B83B5E', c3:'#F9C74F', bg:'#FFF8E1', ink:'#3B1F41'},
    t:{ar:'تذكرة ذهبية', fr:'Ticket d’or', en:'Golden ticket'} },
  { id:'garden',  cat:'behave',  style:'garden',   emblem:'sprout',  font:'Almarai', msg:14, orient:'l', pal:{c1:'#E56B6F', c2:'#A7D98B', c3:'#FFB703', bg:'#FBFFF5', ink:'#2F3E2E'},
    t:{ar:'طيبة تُزهر', fr:'La gentillesse fleurit', en:'Kindness in bloom'} },
  { id:'thanks',  cat:'thanks',  style:'sunrise',  emblem:'gift',    font:'Baloo Bhaijaan 2', msg:10, orient:'l', pal:{c1:'#F3722C', c2:'#FFD6A5', c3:'#F9C74F', c4:'#43AA8B', bg:'#FFFAF0', ink:'#5A2E0C'},
    t:{ar:'شكرًا جزيلًا', fr:'Merci beaucoup', en:'Thank you so much'} },
  { id:'ramadan', cat:'religion',style:'nightsky', emblem:'mosque',  font:'El Messiri', msg:16, orient:'l', dark:true, pal:{c1:'#1B263B', c2:'#274472', c3:'#F4C95D', bg:'#0D1B2A', ink:'#F5EFE0'},
    t:{ar:'نجم رمضان', fr:'Étoile du Ramadan', en:'Ramadan star'} },
  { id:'eco',     cat:'clean',   style:'ecoband',  emblem:'recycle', font:'Cairo', msg:15, orient:'l', pal:{c1:'#2A9D8F', c2:'#8AD7C1', c3:'#E9C46A', bg:'#F4FBF9', ink:'#1D3A35'},
    t:{ar:'بطل البيئة', fr:'Héros de la planète', en:'Planet hero'} }
];
const TPL = Object.fromEntries(TEMPLATES.map(t => [t.id, t]));
const CATS = ['excel','study','behave','improve','thanks','clean','religion'];
const FONTS = ['Baloo Bhaijaan 2','Changa','Cairo','Almarai','Tajawal','El Messiri','Lalezar'];
const COLORS = ['#F08A24','#E63946','#EF476F','#7B2CBF','#3A86FF','#00A6FB','#2A9D8F','#2B9348','#1D3557','#0B2545'];

/* ---------------------------------------------------------
   Sizes (mm, portrait) and A4 imposition
--------------------------------------------------------- */
const SIZES = { a6:[105,148], sm:[55,85], a5:[148,210] };
const SIZE_KEYS = ['a6','sm','a5'];
function cardMM(size, orient) { const [a, b] = SIZES[size] || SIZES.a6; return orient === 'l' ? [b, a] : [a, b]; }
function cardPX(size, orient) { const [w, h] = cardMM(size, orient); return [Math.round(w * MM), Math.round(h * MM)]; }
function impose(size, orient) {
  const [cw, ch] = cardMM(size, orient);
  const opts = [[210, 297, 'portrait'], [297, 210, 'landscape']].map(([pw, ph, o]) => {
    const cols = Math.floor(pw / cw), rows = Math.floor(ph / ch);
    return { pw, ph, o, cols, rows, n: cols * rows };
  });
  const best = opts[1].n > opts[0].n ? opts[1] : opts[0];
  return { ...best, cw, ch, ox: (best.pw - best.cols * cw) / 2, oy: (best.ph - best.rows * ch) / 2 };
}

/* ---------------------------------------------------------
   Samples
--------------------------------------------------------- */
const SAMPLE = {
  ar:{ name:'آدم', from:'الأستاذة: مريم', school:'ابتدائية الأمل' },
  fr:{ name:'Adam', from:'La maîtresse : Mariam', school:'École El Amel' },
  en:{ name:'Adam', from:'Teacher: Mariam', school:'El Amel School' }
};
const todayStr = lang => { try { return new Date().toLocaleDateString(lang === 'ar' ? 'ar-DZ' : lang === 'fr' ? 'fr-FR' : 'en-GB'); } catch (e) { return ''; } };
function sampleFor(id, lang) {
  const t = TPL[id], L = SAMPLE[lang] ? lang : 'ar';
  return { title: t.t[L], msg: PHRASES[L][t.msg], name: SAMPLE[L].name, from: SAMPLE[L].from, school: SAMPLE[L].school, date: todayStr(L), names:'' };
}

/* ---------------------------------------------------------
   State
--------------------------------------------------------- */
let uiLang = localStorage.getItem(UI_KEY) || localStorage.getItem('site_lang') || 'ar';
if (!UI[uiLang]) uiLang = 'ar';
const T = k => (UI[uiLang] && UI[uiLang][k]) || UI.ar[k] || k;
const SIZE_OK = s => SIZE_KEYS.includes(s);

function freshState() {
  return { tpl:'star', size:'a6', orient:'p', color:null, font:'auto', emblem:null, clang: uiLang, dirty:false,
    stars:true, starsN:5, fill:true, cut:true, c: sampleFor('star', uiLang), img:{} };
}
function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY));
    if (s && TPL[s.tpl] && s.c) { const f = Object.assign(freshState(), s); f.c = { ...sampleFor(f.tpl, f.clang), ...s.c }; if (!SIZE_OK(f.size)) f.size = 'a6'; return f; }
  } catch (e) {}
  return null;
}
let st = loadState() || freshState();
let openSec = null, zoom = 'fit', view = 'card', nameIdx = 0;

/* ---------------------------------------------------------
   Card rendering
--------------------------------------------------------- */
const STAR_ON = c => `<svg viewBox="0 0 24 24"><polygon points="${starPts(12, 12.5, 11, 4.8, 5)}" fill="${c}"/></svg>`;
function ctxFor(s) {
  const t = TPL[s.tpl];
  const P = { ...t.pal }; if (s.color) P.c1 = s.color;
  const [W, H] = cardPX(s.size, s.orient);
  return { s, t, P, W, H, u: Math.min(W, H) / 100, font: s.font && s.font !== 'auto' ? s.font : t.font, rtl: s.clang === 'ar' };
}
const namesOf = s => String(s.c.names || '').split(/\n+/).map(x => x.trim()).filter(Boolean);

function cardHTML(ctx, name) {
  const { s, t, P, W, H, u } = ctx;
  const c = s.c;
  const emb = s.emblem === 'none' ? '' : (s.emblem || t.emblem);
  const style = `--w:${W}px;--h:${H}px;--u:${u.toFixed(3)}px;--c1:${P.c1};--c2:${P.c2};--c3:${P.c3};--bg:${P.bg};--ink:${P.ink};--f:'${ctx.font}','Tajawal',sans-serif;`;
  const deco = t.orient === 'l' && ctx.rtl ? `<g transform="matrix(-1 0 0 1 ${W} 0)">${DECO[t.style](W, H, P, u, 7)}</g>` : DECO[t.style](W, H, P, u, 7);
  const stars = s.stars ? `<div class="stars">${Array.from({ length: Math.max(1, Math.min(5, s.starsN || 5)) }, () => STAR_ON(P.c3)).join('')}</div>` : '';
  const nm = name != null ? name : c.name;
  const sig = (c.from || c.school) ? `<div class="sig">${esc(c.from || '')}${c.school ? `<small>${esc(c.school)}</small>` : ''}</div>` : '<div></div>';
  const logo = s.img && s.img.logo ? `<div class="lg"><img src="${s.img.logo}" alt=""></div>` : '';
  const foot = (c.from || c.school || c.date || logo) ? `<div class="ft">${sig}${logo}${c.date ? `<div class="dt">${esc(c.date)}</div>` : '<div></div>'}</div>` : '';
  return `<div class="card S-${t.style} O-${s.orient} Z-${s.size}${t.dark ? ' dark' : ''}" dir="${ctx.rtl ? 'rtl' : 'ltr'}" lang="${s.clang}" style="${style}">
    <div class="deco"><svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${deco}</svg></div>
    <div class="ct">
      ${emb ? `<div class="em">${emblemSVG(emb, P)}</div>` : ''}
      <div class="tx">
        ${c.title ? `<h1 class="ttl">${esc(c.title)}</h1>` : ''}
        ${nm ? `<div class="lbl">${esc(UI[s.clang] ? UI[s.clang].awarded : UI.ar.awarded)}</div><div class="nm">${esc(nm)}</div>` : ''}
        ${c.msg ? `<p class="msg">${esc(c.msg)}</p>` : ''}
        ${stars}
      </div>
      ${foot}
    </div></div>`;
}
function fitCard(card) {
  const ct = card.querySelector('.ct');
  let k = 1; card.style.setProperty('--k', '1');
  while ((ct.scrollHeight > ct.clientHeight + 1 || ct.scrollWidth > ct.clientWidth + 1) && k > 0.45) { k -= 0.04; card.style.setProperty('--k', k.toFixed(2)); }
}
const fitAllCards = root => $$('.card', root).forEach(fitCard);

/* ---------------------------------------------------------
   Stage: single card / print sheets
--------------------------------------------------------- */
const holder = $('#cardHolder');
function currentName() {
  const list = namesOf(st);
  if (!list.length) { nameIdx = 0; return st.c.name; }
  nameIdx = Math.max(0, Math.min(nameIdx, list.length - 1));
  return list[nameIdx];
}
function renderCard() {
  const ctx = ctxFor(st);
  holder.innerHTML = cardHTML(ctx, currentName());
  fitAllCards(holder);
  applyZoom();
  const list = namesOf(st);
  $('#nameNav').classList.toggle('hidden', !list.length);
  if (list.length) $('#nameInfo').textContent = `${list[nameIdx]} · ${nameIdx + 1} / ${list.length}`;
}
function fitScale() {
  const stage = $('#stage'), [W, H] = cardPX(st.size, st.orient);
  const extra = namesOf(st).length ? 200 : 150;
  return Math.max(0.2, Math.min((stage.clientWidth - 60) / W, (stage.clientHeight - extra) / H, 3));
}
function applyZoom() {
  const s = zoom === 'fit' ? fitScale() : zoom;
  const [W, H] = cardPX(st.size, st.orient);
  holder.style.width = (W * s) + 'px'; holder.style.height = (H * s) + 'px';
  const c = holder.querySelector('.card'); if (c) c.style.transform = `scale(${s})`;
  $('#zoomVal').textContent = Math.round(s * 100) + '%';
}
function setZoom(d) { let s = zoom === 'fit' ? fitScale() : zoom; zoom = Math.max(0.2, Math.min(4, Math.round((s + d * 0.1) * 10) / 10)); applyZoom(); }

function cardsForPrint() {
  const list = namesOf(st), L = impose(st.size, st.orient);
  if (list.length) return list;
  return st.fill ? Array(L.n).fill(st.c.name) : [st.c.name];
}
function pagesHTML(unit) {
  const ctx = ctxFor(st), L = impose(st.size, st.orient), all = cardsForPrint();
  const pages = [];
  for (let i = 0; i < all.length; i += L.n) pages.push(all.slice(i, i + L.n));
  const u = unit === 'mm' ? 'mm' : 'px', k = unit === 'mm' ? 1 : MM;
  return { L, html: pages.map(names => `<div class="print-page page" style="width:${L.pw * k}${u};height:${L.ph * k}${u}">${names.map((nm, j) => {
    const col = j % L.cols, row = Math.floor(j / L.cols);
    return `<div class="cell${st.cut ? ' cut' : ''}" style="left:${(L.ox + col * L.cw) * k}${u};top:${(L.oy + row * L.ch) * k}${u};width:${L.cw * k}${u};height:${L.ch * k}${u}">${cardHTML(ctx, nm)}</div>`;
  }).join('')}</div>`), count: pages.length };
}
function renderSheet() {
  const box = $('#sheetView');
  const { L, html } = pagesHTML('px');
  const pw = L.pw * MM, ph = L.ph * MM;
  const s = Math.max(0.2, Math.min(($('#stage').clientWidth - 60) / pw, ($('#stage').clientHeight - 150) / ph, 1));
  box.innerHTML = html.map((p, i) => `<div class="page-cap">${T('page')} ${i + 1} / ${html.length}</div><div class="page-holder" style="width:${pw * s}px;height:${ph * s}px">${p}</div>`).join('');
  $$('.page', box).forEach(pg => { pg.style.transformOrigin = '0 0'; pg.style.transform = `scale(${s})`; });
  fitAllCards(box);
}
function setView(v) {
  view = v;
  $$('#viewSeg button').forEach(b => b.classList.toggle('on', b.dataset.view === v));
  $('#cardView').classList.toggle('hidden', v !== 'card');
  $('#sheetView').classList.toggle('hidden', v !== 'sheet');
  $('#zoomCtl').classList.toggle('hidden', v !== 'card');
  if (v === 'sheet') renderSheet(); else renderCard();
}

let renderTimer = null;
function scheduleRender() { clearTimeout(renderTimer); renderTimer = setTimeout(renderAll, 120); }
function renderAll() {
  if (view === 'sheet') renderSheet(); else renderCard();
  renderCurrentThumb(); updateSummaries(); autosave();
}

/* ---------------------------------------------------------
   Sidebar sections (colored, numbered, all collapsed at start)
--------------------------------------------------------- */
const SEC_COLORS = { style:'#64748B', text:'#16A34A', child:'#7C3AED', sign:'#D97706', print:'#2563EB' };
const SECTIONS = ['style','text','child','sign','print'];
const CHEV = '<svg class="acc-chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>';
const NEXT = '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>';
const PLUS_IMG = '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/></svg>';
const XICON = '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>';
const PALETTE_ICO = '<svg viewBox="0 0 24 24"><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4A5.6 5.6 0 0 0 22 10c0-4.4-4.5-8-10-8z"/></svg>';
const dirAttr = () => ` dir="${st.clang === 'ar' ? 'rtl' : 'ltr'}"`;
const input = (key, label, hint) => `<div class="field"><label>${T(label)}</label><input type="text" data-key="${key}" value="${esc(st.c[key] || '')}"${dirAttr()}>${hint ? `<div class="hint">${T(hint)}</div>` : ''}</div>`;
const area = (key, label, hint, extra = '') => `<div class="field"><label>${T(label)}${extra}</label><textarea data-key="${key}"${dirAttr()}>${esc(st.c[key] || '')}</textarea>${hint ? `<div class="hint">${T(hint)}</div>` : ''}</div>`;
const toggle = (key, label, hint) => `<label class="switch"><span>${T(label)}${hint ? `<div class="hint" style="font-weight:500">${T(hint)}</div>` : ''}</span><input type="checkbox" data-toggle="${key}" ${st[key] ? 'checked' : ''}><i></i></label>`;

function secBody(id) {
  const t = TPL[st.tpl];
  if (id === 'style') {
    const sw = COLORS.map(c => `<button type="button" class="sw ${st.color === c ? 'on' : ''}" data-color="${c}" style="background:${c}" aria-label="${c}"></button>`).join('');
    const custom = st.color && !COLORS.includes(st.color) ? st.color : '#888888';
    return `
      <div class="field"><label>${T('size')}</label><div class="seg-ui size-seg" id="sizeSeg">${SIZE_KEYS.map(k => { const [a, b] = SIZES[k]; return `<button type="button" data-size="${k}" class="${st.size === k ? 'on' : ''}">${T('sz_' + k)}<small>${a / 10}×${b / 10} cm</small></button>`; }).join('')}</div></div>
      <div class="field"><label>${T('orient')}</label><div class="seg-ui" id="orientSeg">${['p', 'l'].map(o => `<button type="button" data-orient="${o}" class="${st.orient === o ? 'on' : ''}">${T('o_' + o)}</button>`).join('')}</div></div>
      <div class="field"><label>${T('color')}</label><div class="swatches">
        <button type="button" class="sw auto ${!st.color ? 'on' : ''}" data-color="" style="--c-a:${t.pal.c1};--c-b:${t.pal.c3}" aria-label="auto"></button>${sw}
        <label class="sw custom ${st.color && !COLORS.includes(st.color) ? 'on' : ''}"><input type="color" id="colorCustom" value="${custom}"></label></div></div>
      <div class="field"><label>${T('font')}</label><select id="fontSel"><option value="auto">${T('font_auto')} (${t.font})</option>${FONTS.map(f => `<option value="${f}" ${st.font === f ? 'selected' : ''}>${f}</option>`).join('')}</select></div>
      <div class="field"><label>${T('clang')}</label><div class="seg-ui" id="clangSeg">${['ar', 'fr', 'en'].map(l => `<button type="button" data-l="${l}" class="${st.clang === l ? 'on' : ''}">${{ ar:'العربية', fr:'Français', en:'English' }[l]}</button>`).join('')}</div></div>
      <button type="button" class="chip" id="resetTxt" style="align-self:flex-start">${T('reset_txt')}</button>`;
  }
  if (id === 'text') {
    const P = { ...t.pal }; if (st.color) P.c1 = st.color;
    const cur = st.emblem || t.emblem;
    const phr = PHRASES[st.clang] || PHRASES.ar;
    return `${input('title', 'f_title')}
      <div class="field"><label>${T('f_emblem')}</label><div class="emblems">
        <button type="button" class="emb none ${st.emblem === 'none' ? 'on' : ''}" data-emb="none">${T('none')}</button>
        ${EMBLEM_KEYS.map(k => `<button type="button" class="emb ${st.emblem !== 'none' && cur === k ? 'on' : ''}" data-emb="${k}" aria-label="${k}">${emblemSVG(k, P)}</button>`).join('')}</div></div>
      ${area('msg', 'f_msg')}
      <div class="field"><select id="phraseSel"${dirAttr()}><option value="">${T('f_phrase')}</option>${phr.map((p, i) => `<option value="${i}">${esc(p)}</option>`).join('')}</select></div>`;
  }
  if (id === 'child') {
    const n = namesOf(st).length;
    return `${input('name', 'f_name')}
      ${area('names', 'f_names', 'f_names_h', n ? `<span class="count-badge">${n} ${T('names_n')}</span>` : '')}
      ${toggle('stars', 'f_stars')}
      ${st.stars ? `<div class="field"><label>${T('f_stars_n')}</label><div class="stars-pick" id="starsPick">${[1, 2, 3, 4, 5].map(i => `<button type="button" data-star="${i}">${STAR_ON(i <= st.starsN ? '#F4B400' : '#D5DEE5')}</button>`).join('')}</div></div>` : ''}`;
  }
  if (id === 'sign') {
    const logo = st.img.logo;
    return `${input('from', 'f_from')}${input('school', 'f_school')}
      <div class="field"><label>${T('f_date')}</label><input type="text" data-key="date" value="${esc(st.c.date || '')}" dir="ltr"><button type="button" class="mini-btn" id="todayBtn">${T('today')}</button></div>
      <div class="field"><label>${T('f_logo')}</label><div class="img-field">
        <label class="img-drop">${PLUS_IMG}<span>${T('add_img')}</span><input type="file" accept="image/*" hidden data-img="logo"></label>
        ${logo ? `<div class="img-prev"><img src="${logo}" alt=""><button type="button" data-rmimg="logo">${XICON}</button></div>` : ''}</div></div>`;
  }
  if (id === 'print') {
    const L = impose(st.size, st.orient), pages = Math.ceil(cardsForPrint().length / L.n);
    return `${toggle('fill', 'f_fill', 'f_fill_h')}${toggle('cut', 'f_cut')}
      <div class="hint" style="font-size:.82rem">${L.n} ${T('per_page')} · ${T('pages')}: ${pages}</div>`;
  }
  return '';
}
function summary(id) {
  const t = TPL[st.tpl];
  const cut = x => { x = String(x || '').replace(/\s+/g, ' ').trim(); return x.length > 44 ? x.slice(0, 42) + '…' : x; };
  if (id === 'style') return [t.t[uiLang] || t.t.ar, T('sz_' + st.size), T('o_' + st.orient)].join(' · ');
  if (id === 'text') return cut([st.c.title, st.c.msg].filter(Boolean).join(' · ')) || T('sec_text_d');
  if (id === 'child') { const n = namesOf(st).length; return n ? `${n} ${T('names_n')}` : (st.c.name || T('sec_child_d')); }
  if (id === 'sign') return cut([st.c.from, st.c.date].filter(Boolean).join(' · ')) || T('sec_sign_d');
  if (id === 'print') { const L = impose(st.size, st.orient); return `${L.n} ${T('per_page')}`; }
  return '';
}
function buildAccordion() {
  $('#accordion').innerHTML = SECTIONS.map((id, i) => {
    const badge = id === 'style' ? `<span class="acc-ico">${PALETTE_ICO}</span>` : `<span class="acc-num">${i}</span>`;
    const last = i === SECTIONS.length - 1;
    return `<section class="acc ${openSec === id ? 'open' : ''}" data-sec="${id}" style="--sc:${SEC_COLORS[id]}">
      <button type="button" class="acc-head">${badge}<span class="acc-title"><b>${T('sec_' + id)}</b><small>${esc(summary(id))}</small></span>${CHEV}</button>
      <div class="acc-body"><div class="acc-inner"><div class="acc-content">${secBody(id)}
        <button type="button" class="acc-next" data-next="${i}">${last ? T('done') : T('next')}${last ? '' : NEXT}</button>
      </div></div></div></section>`;
  }).join('');
}
function refreshSec(id) {
  const box = $(`.acc[data-sec="${id}"] .acc-content`); if (!box) return;
  const btn = box.querySelector('.acc-next').outerHTML;
  box.innerHTML = secBody(id) + btn;
}
function rebuildKeepOpen() { const sc = $('#panel').scrollTop; buildAccordion(); $('#panel').scrollTop = sc; }
function updateSummaries() { SECTIONS.forEach(id => { const el = $(`.acc[data-sec="${id}"] .acc-title small`); if (el) el.textContent = summary(id); }); }
function toggleSec(id, force) {
  openSec = (force === undefined ? openSec !== id : force) ? id : null;
  $$('.acc').forEach(a => a.classList.toggle('open', a.dataset.sec === openSec));
}

$('#accordion').addEventListener('click', e => {
  const head = e.target.closest('.acc-head');
  if (head) { toggleSec(head.closest('.acc').dataset.sec); return; }
  const nx = e.target.closest('[data-next]');
  if (nx) {
    const nextId = SECTIONS[+nx.dataset.next + 1];
    toggleSec(nextId || null, !!nextId);
    if (nextId) setTimeout(() => $(`.acc[data-sec="${nextId}"]`).scrollIntoView({ behavior:'smooth', block:'nearest' }), 280);
    return;
  }
  const sz = e.target.closest('[data-size]');
  if (sz) { st.size = sz.dataset.size; zoom = 'fit'; refreshSec('style'); refreshSec('print'); scheduleRender(); return; }
  const or = e.target.closest('[data-orient]');
  if (or) { st.orient = or.dataset.orient; zoom = 'fit'; refreshSec('style'); refreshSec('print'); scheduleRender(); return; }
  const sw = e.target.closest('.sw[data-color]');
  if (sw) { st.color = sw.dataset.color || null; refreshSec('style'); refreshSec('text'); scheduleRender(); return; }
  const cl = e.target.closest('#clangSeg [data-l]');
  if (cl) { if (cl.dataset.l !== st.clang) { st.clang = cl.dataset.l; if (!st.dirty) st.c = { ...sampleFor(st.tpl, st.clang), names: st.c.names }; rebuildKeepOpen(); scheduleRender(); } return; }
  if (e.target.closest('#resetTxt')) {
    const keep = { names: st.c.names, name: st.c.name, from: st.c.from, school: st.c.school, date: st.c.date };
    st.c = { ...sampleFor(st.tpl, st.clang), ...(st.dirty ? keep : { names: st.c.names }) };
    st.dirty = false; rebuildKeepOpen(); scheduleRender(); toast(T('t_reset')); return;
  }
  const em = e.target.closest('[data-emb]');
  if (em) { const k = em.dataset.emb; st.emblem = k === TPL[st.tpl].emblem ? null : k; refreshSec('text'); scheduleRender(); return; }
  const sp = e.target.closest('[data-star]');
  if (sp) { st.starsN = +sp.dataset.star; refreshSec('child'); scheduleRender(); return; }
  if (e.target.closest('#todayBtn')) { st.c.date = todayStr(st.clang); refreshSec('sign'); scheduleRender(); return; }
  const rm = e.target.closest('[data-rmimg]');
  if (rm) { e.preventDefault(); delete st.img[rm.dataset.rmimg]; refreshSec('sign'); scheduleRender(); }
});
$('#accordion').addEventListener('input', e => {
  const k = e.target.dataset.key;
  if (k) {
    st.c[k] = e.target.value;
    if (k !== 'names' && k !== 'date') st.dirty = true;
    if (k === 'names') { const b = e.target.closest('.field').querySelector('.count-badge'); const n = namesOf(st).length;
      const lab = e.target.closest('.field').querySelector('label');
      if (b) { if (n) b.textContent = `${n} ${T('names_n')}`; else b.remove(); } else if (n) lab.insertAdjacentHTML('beforeend', `<span class="count-badge">${n} ${T('names_n')}</span>`);
      refreshSec('print'); }
    scheduleRender(); return;
  }
  if (e.target.id === 'colorCustom') { st.color = e.target.value; scheduleRender(); }
});
$('#accordion').addEventListener('change', e => {
  if (e.target.id === 'fontSel') { st.font = e.target.value; scheduleRender(); return; }
  if (e.target.id === 'colorCustom') { refreshSec('style'); refreshSec('text'); return; }
  if (e.target.id === 'phraseSel') {
    const i = e.target.value; if (i === '') return;
    st.c.msg = (PHRASES[st.clang] || PHRASES.ar)[+i]; st.dirty = true; refreshSec('text'); scheduleRender(); return;
  }
  const tg = e.target.dataset.toggle;
  if (tg) { st[tg] = e.target.checked; if (tg === 'stars') refreshSec('child'); refreshSec('print'); scheduleRender(); return; }
  const ik = e.target.dataset.img;
  if (ik && e.target.files && e.target.files[0]) readImage(e.target.files[0]).then(url => { st.img[ik] = url; refreshSec('sign'); scheduleRender(); });
});
function readImage(file) {
  return new Promise(res => {
    const fr = new FileReader();
    fr.onload = () => { const im = new Image(); im.onload = () => {
      const sc = Math.min(1, 400 / Math.max(im.width, im.height));
      const cv = document.createElement('canvas'); cv.width = Math.round(im.width * sc); cv.height = Math.round(im.height * sc);
      cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height); res(cv.toDataURL('image/png'));
    }; im.src = fr.result; };
    fr.readAsDataURL(file);
  });
}
holder.addEventListener('click', () => {
  if ($('#workspace').classList.contains('collapsed')) $('#workspace').classList.remove('collapsed');
  toggleSec('text', true);
});
$('#namePrev').addEventListener('click', () => { nameIdx = Math.max(0, nameIdx - 1); renderCard(); });
$('#nameNext').addEventListener('click', () => { nameIdx = Math.min(namesOf(st).length - 1, nameIdx + 1); renderCard(); });

/* ---------------------------------------------------------
   Thumbnails & gallery
--------------------------------------------------------- */
function placeMini(box, s) {
  const card = box.querySelector('.card'); if (!card) return;
  const [W, H] = cardPX(s.size, s.orient);
  const sc = Math.min(box.clientWidth / W, box.clientHeight / H) * .9;
  card.style.position = 'absolute'; card.style.transformOrigin = '0 0';
  card.style.left = ((box.clientWidth - W * sc) / 2) + 'px'; card.style.top = ((box.clientHeight - H * sc) / 2) + 'px';
  card.style.transform = `scale(${sc})`;
  card.style.borderRadius = (4 / sc) + 'px';
  card.style.boxShadow = `0 ${2 / sc}px ${8 / sc}px rgba(0,0,0,.18)`;
}
function renderCurrentThumb() {
  const box = $('#currentThumb');
  box.innerHTML = cardHTML(ctxFor(st));
  fitAllCards(box); placeMini(box, st);
  $('#currentTplName').textContent = TPL[st.tpl].t[uiLang] || TPL[st.tpl].t.ar;
}
let gCat = 'all', gOr = 'all';
/* a landscape template always shows in landscape; leaving one brings the card back to portrait */
const orientFor = id => TPL[id].orient || (id !== st.tpl && TPL[st.tpl].orient ? 'p' : st.orient);
const OR_ICO = { p:'<svg viewBox="0 0 24 24"><rect x="7" y="3" width="10" height="18" rx="2"/></svg>', l:'<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2"/></svg>' };
function previewState(id) {
  return { ...st, tpl:id, orient: id === st.tpl ? st.orient : orientFor(id), color: id === st.tpl ? st.color : null, font: id === st.tpl ? st.font : 'auto', emblem: id === st.tpl ? st.emblem : null,
    c: st.dirty ? st.c : sampleFor(id, st.clang) };
}
function buildGallery() {
  $('#gCats').innerHTML = ['all', ...CATS].map(c => `<button type="button" class="chip ${gCat === c ? 'on' : ''}" data-cat="${c}">${T('cat_' + c)}</button>`).join('');
  $('#gSizes').innerHTML = ['all', 'p', 'l'].map(o => `<button type="button" class="chip ${gOr === o ? 'on' : ''}" data-or="${o}">${OR_ICO[o] || ''}${T(o === 'all' ? 'or_all' : 'o_' + o)}</button>`).join('');
  renderGrid();
}
function renderGrid() {
  const q = ($('#gSearch').value || '').trim().toLowerCase();
  const list = TEMPLATES.filter(t => (gCat === 'all' || t.cat === gCat) && (gOr === 'all' || (t.orient || 'p') === gOr) &&
    (!q || Object.values(t.t).concat(Object.keys(UI).map(l => UI[l]['cat_' + t.cat])).some(n => n.toLowerCase().includes(q))));
  const grid = $('#gGrid');
  if (!list.length) { grid.innerHTML = `<div class="g-empty">${T('no_results')}</div>`; return; }
  grid.innerHTML = list.map(t => `<button type="button" class="g-card ${t.id === st.tpl ? 'on' : ''}" data-tpl="${t.id}">
      <div class="g-thumb" style="background:${shade(t.pal.bg, -.04)}">${cardHTML(ctxFor(previewState(t.id)))}</div>
      <div class="g-meta"><b>${esc(t.t[uiLang] || t.t.ar)}</b><span>${T('cat_' + t.cat)}</span></div></button>`).join('');
  requestAnimationFrame(() => $$('.g-thumb', grid).forEach(th => { fitAllCards(th); placeMini(th, previewState(th.parentElement.dataset.tpl)); }));
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
  if (o) { gOr = o.dataset.or; $$('#gSizes .chip').forEach(x => x.classList.toggle('on', x === o)); renderGrid(); return; }
  const card = e.target.closest('[data-tpl]');
  if (card) {
    const o2 = orientFor(card.dataset.tpl);
    if (o2 !== st.orient) { st.orient = o2; zoom = 'fit'; }
    st.tpl = card.dataset.tpl; st.color = null; st.font = 'auto'; st.emblem = null;
    if (!st.dirty) st.c = { ...sampleFor(st.tpl, st.clang), names: st.c.names, name: st.c.name, from: st.c.from, school: st.c.school, date: st.c.date };
    closeGallery(); rebuildKeepOpen(); renderAll(); toast(T('t_tpl'));
  }
});
$('#gSearch').addEventListener('input', renderGrid);

/* ---------------------------------------------------------
   Local save, print, PDF, PNG
--------------------------------------------------------- */
let saveTimer = null;
function saveNow(show) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(st)); if (show) toast(T('t_saved')); return true; }
  catch (e) { if (show) toast(T('t_save_err')); return false; }
}
function autosave() { clearTimeout(saveTimer); saveTimer = setTimeout(() => saveNow(false), 800); }
function setPageSize(o) {
  let ps = $('#pageSize');
  if (!ps) { ps = document.createElement('style'); ps.id = 'pageSize'; document.head.appendChild(ps); }
  ps.textContent = `@page{ size: A4 ${o}; margin: 0; }`;
}
function doPrint() {
  const { L, html } = pagesHTML('mm');
  setPageSize(L.o);
  $('#printRoot').innerHTML = html.join('');
  fitAllCards($('#printRoot'));
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  fonts.then(() => setTimeout(() => window.print(), 300));
}
window.addEventListener('afterprint', () => { $('#printRoot').innerHTML = ''; });
const fileBase = () => (st.c.title || 'card').replace(/[\\/:*?"<>|]+/g, '').trim().slice(0, 60) || 'card';
async function doPdf() {
  if (typeof html2canvas === 'undefined' || !window.jspdf) { toast(T('t_pdf_err')); return; }
  toast(T('t_pdf'));
  try {
    if (document.fonts) await document.fonts.ready;
    const { L, html } = pagesHTML('px');
    const pdf = new window.jspdf.jsPDF({ orientation: L.o, unit:'mm', format:'a4' });
    const root = $('#printRoot');
    for (let i = 0; i < html.length; i++) {
      root.innerHTML = html[i]; fitAllCards(root);
      await new Promise(r => setTimeout(r, 60));
      const page = root.firstElementChild;
      const canvas = await html2canvas(page, { scale: 2.5, backgroundColor:'#ffffff', useCORS:true, logging:false, width: L.pw * MM, height: L.ph * MM, windowWidth: L.pw * MM, windowHeight: L.ph * MM, scrollX:0, scrollY:0 });
      if (i > 0) pdf.addPage('a4', L.o);
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.93), 'JPEG', 0, 0, L.pw, L.ph);
    }
    pdf.save(fileBase() + '.pdf'); root.innerHTML = ''; toast(T('t_pdf_ok'));
  } catch (err) { console.error(err); toast(T('t_pdf_err')); }
}
async function doPng() {
  if (typeof html2canvas === 'undefined') { toast(T('t_pdf_err')); return; }
  toast(T('t_png'));
  try {
    if (document.fonts) await document.fonts.ready;
    const root = $('#printRoot');
    const nm = currentName();
    root.innerHTML = cardHTML(ctxFor(st), nm); fitAllCards(root);
    await new Promise(r => setTimeout(r, 60));
    const [W, H] = cardPX(st.size, st.orient);
    const canvas = await html2canvas(root.firstElementChild, { scale: 3, backgroundColor: null, useCORS:true, logging:false, width: W, height: H, windowWidth: W, windowHeight: H, scrollX:0, scrollY:0 });
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png'); a.download = (fileBase() + (nm ? ' - ' + nm : '')).slice(0, 80) + '.png';
    document.body.appendChild(a); a.click(); a.remove();
    root.innerHTML = ''; toast(T('t_pdf_ok'));
  } catch (err) { console.error(err); toast(T('t_pdf_err')); }
}

/* ---------------------------------------------------------
   Account (Firebase): users/{uid}/encouragementCards
--------------------------------------------------------- */
const hasFb = () => typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length && firebase.auth && firebase.firestore;
const fbUser = () => (hasFb() ? firebase.auth().currentUser : null);
const cardsCol = u => firebase.firestore().collection('users').doc(u).collection('encouragementCards');
let pendingAfterLogin = null;
function openLogin(after) { pendingAfterLogin = after || null; $('#login').classList.remove('hidden'); }
function closeLogin() { $('#login').classList.add('hidden'); }
$('#loginCancel').addEventListener('click', () => { pendingAfterLogin = null; closeLogin(); });
$('#login').addEventListener('click', e => { if (e.target.id === 'login') { pendingAfterLogin = null; closeLogin(); } });
$('#loginGoogle').addEventListener('click', async () => {
  if (!hasFb()) { toast(T('t_cloud_err')); return; }
  try { await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()); closeLogin(); const fn = pendingAfterLogin; pendingAfterLogin = null; if (fn) fn(); }
  catch (e) { console.error(e); }
});
async function saveToAccount() {
  saveNow(false);
  const user = fbUser();
  if (!user) { openLogin(saveToAccount); return; }
  try {
    const copy = { ...st }; delete copy.docId;
    const data = { title: (st.c.title || '').slice(0, 200), tpl: st.tpl, size: st.size, state: JSON.stringify(copy), updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
    if (data.state.length > 950000) { toast(T('t_too_big')); return; }
    const col = cardsCol(user.uid);
    if (st.docId) await col.doc(st.docId).set(data, { merge: true });
    else { data.createdAt = firebase.firestore.FieldValue.serverTimestamp(); const ref = await col.add(data); st.docId = ref.id; }
    saveNow(false); toast(T('t_saved_cloud'));
  } catch (e) { console.error(e); toast(T('t_cloud_err')); }
}
const IC_OPEN = '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';
const IC_DUP = '<svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>';
const IC_DEL = '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>';
const IC_PLUS = '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';
let mineDocs = [];
function openMine() { if (!fbUser()) { openLogin(openMine); return; } $('#mine').classList.remove('hidden'); loadMine(); }
function closeMine() { $('#mine').classList.add('hidden'); }
async function loadMine() {
  const grid = $('#mGrid'); grid.innerHTML = `<div class="g-empty">${T('loading')}</div>`;
  try { const snap = await cardsCol(fbUser().uid).orderBy('updatedAt', 'desc').get(); mineDocs = snap.docs.map(d => ({ id: d.id, ...d.data() })); renderMine(); }
  catch (e) { console.error(e); grid.innerHTML = `<div class="g-empty">${T('t_cloud_err')}</div>`; }
}
const parseDoc = d => { try { const p = JSON.parse(d.state); if (!p || !TPL[p.tpl]) return null; const f = Object.assign(freshState(), p); f.c = { ...sampleFor(f.tpl, f.clang), ...(p.c || {}) }; if (!SIZE_OK(f.size)) f.size = 'a6'; return f; } catch (e) { return null; } };
function renderMine() {
  const grid = $('#mGrid');
  const fmt = ts => { try { return ts && ts.toDate ? ts.toDate().toLocaleDateString(uiLang === 'ar' ? 'ar-DZ' : uiLang) : ''; } catch (e) { return ''; } };
  const items = mineDocs.map(d => ({ d, s: parseDoc(d) })).filter(x => x.s);
  grid.innerHTML = `<button type="button" class="g-card m-new" data-act="new">${IC_PLUS}<span>${T('new_b')}</span></button>` +
    (items.map(({ d, s }) => `<div class="g-card m-card" data-mid="${d.id}">${d.id === st.docId ? `<span class="m-tag">${T('current')}</span>` : ''}
      <div class="g-thumb" style="background:${shade(TPL[s.tpl].pal.bg, -.04)}">${cardHTML(ctxFor(s))}</div>
      <div class="g-meta"><b>${esc(d.title || T('untitled'))}</b><span>${T('sz_' + s.size)}</span></div>
      <div class="m-date">${fmt(d.updatedAt)}</div>
      <div class="m-actions"><button type="button" class="primary" data-act="open">${IC_OPEN}${T('open_b')}</button>
        <button type="button" data-act="dup">${IC_DUP}${T('dup_b')}</button>
        <button type="button" class="danger icon" data-act="del" title="${T('del_b')}" aria-label="${T('del_b')}">${IC_DEL}</button></div></div>`).join('') || `<div class="g-empty">${T('mine_empty')}</div>`);
  requestAnimationFrame(() => items.forEach(({ d, s }) => { const th = $(`[data-mid="${d.id}"] .g-thumb`, grid); if (th) { fitAllCards(th); placeMini(th, s); } }));
}
$('#btnMine').addEventListener('click', openMine);
$('#mClose').addEventListener('click', closeMine);
$('#mine').addEventListener('click', async e => {
  if (e.target.id === 'mine') { closeMine(); return; }
  const btn = e.target.closest('[data-act]'); if (!btn) return;
  const act = btn.dataset.act;
  if (act === 'new') { st = freshState(); nameIdx = 0; openSec = null; closeMine(); rebuildKeepOpen(); renderAll(); toast(T('t_new')); return; }
  const card = btn.closest('[data-mid]'); if (!card) return;
  const id = card.dataset.mid, doc = mineDocs.find(d => d.id === id); if (!doc) return;
  const col = cardsCol(fbUser().uid);
  try {
    if (act === 'open') { const s = parseDoc(doc); if (!s) return; st = s; st.docId = id; nameIdx = 0; openSec = null; closeMine(); rebuildKeepOpen(); renderAll(); toast(T('t_opened')); }
    else if (act === 'dup') {
      const s = parseDoc(doc); if (!s) return; delete s.docId;
      s.c.title = (s.c.title || T('untitled')) + T('copy_suffix');
      await col.add({ title: s.c.title.slice(0, 200), tpl: s.tpl, size: s.size, state: JSON.stringify(s), createdAt: firebase.firestore.FieldValue.serverTimestamp(), updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
      toast(T('t_dup')); loadMine();
    } else if (act === 'del') {
      if (!confirm(T('confirm_del'))) return;
      await col.doc(id).delete(); if (st.docId === id) { delete st.docId; saveNow(false); }
      toast(T('t_deleted')); loadMine();
    }
  } catch (err) { console.error(err); toast(T('t_cloud_err')); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeGallery(); closeMine(); closeLogin(); } });

/* ---------------------------------------------------------
   Toast & UI language
--------------------------------------------------------- */
let toastTimer = null;
function toast(msg) { const el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2600); }
function applyUiLang() {
  document.documentElement.lang = uiLang;
  document.documentElement.dir = uiLang === 'ar' ? 'rtl' : 'ltr';
  $$('[data-i18n]').forEach(el => el.textContent = T(el.dataset.i18n));
  $$('[data-i18n-ph]').forEach(el => el.placeholder = T(el.dataset.i18nPh));
  $$('[data-tip]').forEach(el => el.setAttribute('data-tiptext', T(el.dataset.tip)));
  $('#langToggle').textContent = uiLang.toUpperCase();
  $$('#langMenu button').forEach(b => b.classList.toggle('on', b.dataset.lang === uiLang));
  document.title = uiLang === 'ar' ? 'بطاقات تشجيع للتلاميذ والأطفال جاهزة للطباعة — أكاديمية مرابطي' : T('tool_name') + ' — Merabti Academy';
  buildAccordion();
  if (!$('#gallery').classList.contains('hidden')) buildGallery();
}
$('#langToggle').addEventListener('click', e => { e.stopPropagation(); $('#langMenu').classList.toggle('hidden'); });
$('#langMenu').addEventListener('click', e => {
  const b = e.target.closest('[data-lang]'); if (!b) return;
  uiLang = b.dataset.lang; localStorage.setItem(UI_KEY, uiLang); $('#langMenu').classList.add('hidden');
  if (st.clang !== uiLang) { st.clang = uiLang; if (!st.dirty) st.c = { ...sampleFor(st.tpl, uiLang), names: st.c.names }; }
  applyUiLang(); renderAll();
});
document.addEventListener('click', e => { if (!e.target.closest('.lang-wrap')) $('#langMenu').classList.add('hidden'); });

/* ---------------------------------------------------------
   Toolbar & init
--------------------------------------------------------- */
$('#btnSave').addEventListener('click', saveToAccount);
$('#btnPrint').addEventListener('click', doPrint);
$('#btnPdf').addEventListener('click', doPdf);
$('#btnPng').addEventListener('click', doPng);
$('#btnFullscreen').addEventListener('click', () => {
  if (!document.fullscreenElement) (document.documentElement.requestFullscreen || function(){}).call(document.documentElement);
  else document.exitFullscreen && document.exitFullscreen();
});
$('#panelToggle').addEventListener('click', () => { $('#workspace').classList.toggle('collapsed'); setTimeout(() => view === 'sheet' ? renderSheet() : applyZoom(), 320); });
$('#viewSeg').addEventListener('click', e => { const b = e.target.closest('[data-view]'); if (b) setView(b.dataset.view); });
$('#zoomIn').addEventListener('click', () => setZoom(1));
$('#zoomOut').addEventListener('click', () => setZoom(-1));
$('#zoomFit').addEventListener('click', () => { zoom = 'fit'; applyZoom(); });
window.addEventListener('resize', () => { if (view === 'sheet') renderSheet(); else if (zoom === 'fit') applyZoom(); });

applyUiLang();
renderCard(); renderCurrentThumb();
if (document.fonts) document.fonts.ready.then(() => { renderCard(); renderCurrentThumb(); });

})();
