/* =========================================================
   مولّد المطويات — Merabti Academy
   Phase 1: tri-fold, 12 templates, flat + 3D preview, print, PDF
   ========================================================= */
(function () {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const PW = 374, PH = 794, SW = 1122;
const STORE_KEY = 'merabti_brochure_v1';
const UI_KEY = 'merabti_brochure_ui';

/* ---------------------------------------------------------
   UI strings
--------------------------------------------------------- */
const UI = {
  ar: {
    tool_name:'مولّد المطويات', gallery:'معرض القوالب', search:'ابحث عن قالب...',
    cat_all:'الكل', cat_edu:'تعليمية', cat_aware:'توعوية', cat_school:'مدرسية', cat_biz:'مؤسسات وشركات',
    cat_promo:'إشهار ومحلات', cat_events:'تظاهرات علمية', cat_occ:'مناسبات ودينية',
    fold3:'ثلاثية الطيّ', fold2:'ثنائية', foldZ:'رباعية (Z)', foldA5:'نصف A5', soon:'قريبًا',
    view_flat:'مسطّحة', view_3d:'ثلاثية الأبعاد', outside:'الوجه الخارجي', inside:'الوجه الداخلي',
    fold:'طيّ', unfold:'فتح', flip:'اقلب', reset:'إعادة', hint3d:'اسحب بالفأرة لتدوير المطوية', fit:'ملاءمة الشاشة',
    fullscreen:'ملء الشاشة', save:'حفظ', print:'طباعة', pdf:'تحميل PDF', toggle_panel:'إظهار / إخفاء حيّز التعبئة',
    sec_style:'التنسيق', sec_style_d:'الألوان، الخط ولغة المطوية',
    sec_cover:'الغلاف', sec_cover_d:'الواجهة الأمامية للمطوية',
    sec_flap:'الطيّة الداخلية', sec_flap_d:'أول ما يظهر عند فتح الغلاف',
    sec_p1:'الصفحة الداخلية 1', sec_p1_d:'بداية المحتوى',
    sec_p2:'الصفحة الداخلية 2', sec_p2_d:'وسط المطوية من الداخل',
    sec_p3:'الصفحة الداخلية 3', sec_p3_d:'قائمة نقاط أو أسعار',
    sec_back:'الواجهة الخلفية', sec_back_d:'الخاتمة ومعلومات الاتصال',
    f_title:'العنوان', f_sub:'العنوان الفرعي', f_org:'الجهة / المؤلف', f_badge:'شارة مميزة (اختياري)', f_badge_h:'مثال: ‎-50%‎ أو جديد',
    f_logo:'الشعار', f_cimg:'صورة الغلاف (اختياري)', f_head:'العنوان', f_text:'النص', f_img:'صورة (اختياري)',
    f_list:'العناصر', f_list_h:'عنصر في كل سطر. لإضافة سعر اكتب: الاسم | السعر',
    f_phone:'الهاتف', f_email:'البريد الإلكتروني', f_addr:'العنوان', f_web:'الموقع الإلكتروني', f_qr:'رمز QR يوجّه إلى الموقع',
    color:'اللون الرئيسي', font:'الخط', font_auto:'خط القالب', blang:'لغة المطوية', reset_txt:'استعادة نصوص القالب',
    add_img:'إضافة صورة', next:'التالي', done:'تم',
    t_saved:'تم الحفظ', t_save_err:'تعذّر الحفظ: الصور كبيرة جدًا', t_pdf:'جاري تجهيز ملف PDF...', t_pdf_ok:'تم تحميل الملف',
    t_pdf_err:'تعذّر إنشاء PDF، استعمل زر الطباعة', t_print:'اطبع على الوجهين مع القلب على الحافة القصيرة',
    t_tpl:'تم تطبيق القالب', t_reset:'تمت استعادة نصوص القالب', no_results:'لا توجد قوالب مطابقة'
  },
  fr: {
    tool_name:'Créateur de dépliants', gallery:'Galerie de modèles', search:'Rechercher un modèle...',
    cat_all:'Tous', cat_edu:'Éducatif', cat_aware:'Sensibilisation', cat_school:'Scolaire', cat_biz:'Entreprises',
    cat_promo:'Publicité & commerces', cat_events:'Événements scientifiques', cat_occ:'Occasions & religion',
    fold3:'Trois volets', fold2:'Deux volets', foldZ:'Pli en Z', foldA5:'Demi A5', soon:'bientôt',
    view_flat:'À plat', view_3d:'En 3D', outside:'Face extérieure', inside:'Face intérieure',
    fold:'Plier', unfold:'Déplier', flip:'Retourner', reset:'Réinitialiser', hint3d:'Faites glisser pour tourner le dépliant', fit:'Ajuster à l’écran',
    fullscreen:'Plein écran', save:'Enregistrer', print:'Imprimer', pdf:'Télécharger PDF', toggle_panel:'Afficher / masquer le panneau',
    sec_style:'Mise en forme', sec_style_d:'Couleurs, police et langue',
    sec_cover:'Couverture', sec_cover_d:'Face avant du dépliant',
    sec_flap:'Volet intérieur', sec_flap_d:'Visible à l’ouverture',
    sec_p1:'Page intérieure 1', sec_p1_d:'Début du contenu',
    sec_p2:'Page intérieure 2', sec_p2_d:'Centre intérieur',
    sec_p3:'Page intérieure 3', sec_p3_d:'Liste de points ou de prix',
    sec_back:'Dos', sec_back_d:'Conclusion et contact',
    f_title:'Titre', f_sub:'Sous-titre', f_org:'Organisme / auteur', f_badge:'Badge (optionnel)', f_badge_h:'Ex. : -50% ou Nouveau',
    f_logo:'Logo', f_cimg:'Image de couverture (optionnel)', f_head:'Titre', f_text:'Texte', f_img:'Image (optionnel)',
    f_list:'Éléments', f_list_h:'Un élément par ligne. Pour un prix : Nom | Prix',
    f_phone:'Téléphone', f_email:'E-mail', f_addr:'Adresse', f_web:'Site web', f_qr:'Code QR vers le site',
    color:'Couleur principale', font:'Police', font_auto:'Police du modèle', blang:'Langue du dépliant', reset_txt:'Rétablir les textes du modèle',
    add_img:'Ajouter une image', next:'Suivant', done:'Terminé',
    t_saved:'Enregistré', t_save_err:'Échec : images trop lourdes', t_pdf:'Préparation du PDF...', t_pdf_ok:'Fichier téléchargé',
    t_pdf_err:'PDF impossible, utilisez Imprimer', t_print:'Imprimez recto verso, retournement sur le bord court',
    t_tpl:'Modèle appliqué', t_reset:'Textes du modèle rétablis', no_results:'Aucun modèle trouvé'
  },
  en: {
    tool_name:'Brochure Maker', gallery:'Template gallery', search:'Search templates...',
    cat_all:'All', cat_edu:'Educational', cat_aware:'Awareness', cat_school:'School', cat_biz:'Business',
    cat_promo:'Ads & shops', cat_events:'Scientific events', cat_occ:'Occasions & religious',
    fold3:'Tri-fold', fold2:'Bi-fold', foldZ:'Z-fold', foldA5:'Half A5', soon:'soon',
    view_flat:'Flat', view_3d:'3D', outside:'Outside', inside:'Inside',
    fold:'Fold', unfold:'Unfold', flip:'Flip', reset:'Reset', hint3d:'Drag to rotate the brochure', fit:'Fit to screen',
    fullscreen:'Full screen', save:'Save', print:'Print', pdf:'Download PDF', toggle_panel:'Show / hide the panel',
    sec_style:'Style', sec_style_d:'Colors, font and language',
    sec_cover:'Cover', sec_cover_d:'Front of the brochure',
    sec_flap:'Inside flap', sec_flap_d:'Seen first when opened',
    sec_p1:'Inside page 1', sec_p1_d:'Start of the content',
    sec_p2:'Inside page 2', sec_p2_d:'Inside centre',
    sec_p3:'Inside page 3', sec_p3_d:'List of points or prices',
    sec_back:'Back', sec_back_d:'Closing words and contact',
    f_title:'Title', f_sub:'Subtitle', f_org:'Organisation / author', f_badge:'Badge (optional)', f_badge_h:'e.g. -50% or New',
    f_logo:'Logo', f_cimg:'Cover image (optional)', f_head:'Heading', f_text:'Text', f_img:'Image (optional)',
    f_list:'Items', f_list_h:'One item per line. For a price: Name | Price',
    f_phone:'Phone', f_email:'Email', f_addr:'Address', f_web:'Website', f_qr:'QR code to the website',
    color:'Main color', font:'Font', font_auto:'Template font', blang:'Brochure language', reset_txt:'Restore template texts',
    add_img:'Add image', next:'Next', done:'Done',
    t_saved:'Saved', t_save_err:'Could not save: images too large', t_pdf:'Preparing PDF...', t_pdf_ok:'File downloaded',
    t_pdf_err:'PDF failed, please use Print', t_print:'Print double-sided, flip on the short edge',
    t_tpl:'Template applied', t_reset:'Template texts restored', no_results:'No matching templates'
  }
};


Object.assign(UI.ar, {
  fold_type:'نوع الطيّ', sec_inner:'الصفحة الداخلية', sec_inner_d:'عنوان، نص وصورة', side_front:'الوجه الأمامي', side_back:'الوجه الخلفي', foldA5:'ورقة A5',
  back_tools:'العودة إلى الأدوات', mine:'مطوياتي', save:'حفظ في حسابي', new_b:'مطوية جديدة', open_b:'فتح', dup_b:'نسخ', del_b:'حذف',
  confirm_del:'حذف هذه المطوية نهائيًا من حسابك؟', login_title:'سجّل دخولك لحفظ مطوياتك',
  login_text:'عملك محفوظ تلقائيًا في هذا الجهاز. سجّل الدخول ليُحفظ في حسابك وتفتحه من أي جهاز.',
  login_google:'الدخول بحساب Google', login_site:'تسجيل الدخول من الموقع', cancel:'إلغاء',
  t_saved_cloud:'تم الحفظ في حسابك', t_too_big:'المطوية كبيرة جدًا للحفظ، صغّر الصور أو احذف بعضها',
  t_cloud_err:'تعذّر الحفظ في الحساب، عملك محفوظ في الجهاز', mine_empty:'لا توجد مطويات محفوظة في حسابك بعد',
  loading:'جاري التحميل...', copy_suffix:' (نسخة)', t_opened:'تم فتح المطوية', t_deleted:'تم الحذف', t_dup:'تم إنشاء نسخة',
  untitled:'بدون عنوان', current:'مفتوحة الآن', t_new:'مطوية جديدة جاهزة'
});
Object.assign(UI.fr, {
  fold_type:'Type de pliage', sec_inner:'Page intérieure', sec_inner_d:'Titre, texte et image', side_front:'Recto', side_back:'Verso', foldA5:'Feuille A5',
  back_tools:'Retour aux outils', mine:'Mes dépliants', save:'Enregistrer dans mon compte', new_b:'Nouveau dépliant', open_b:'Ouvrir', dup_b:'Dupliquer', del_b:'Supprimer',
  confirm_del:'Supprimer définitivement ce dépliant de votre compte ?', login_title:'Connectez-vous pour enregistrer vos dépliants',
  login_text:'Votre travail est enregistré automatiquement sur cet appareil. Connectez-vous pour le garder dans votre compte et l’ouvrir partout.',
  login_google:'Continuer avec Google', login_site:'Se connecter sur le site', cancel:'Annuler',
  t_saved_cloud:'Enregistré dans votre compte', t_too_big:'Dépliant trop lourd, réduisez ou supprimez des images',
  t_cloud_err:'Échec de l’enregistrement en ligne, votre travail reste sur l’appareil', mine_empty:'Aucun dépliant enregistré dans votre compte',
  loading:'Chargement...', copy_suffix:' (copie)', t_opened:'Dépliant ouvert', t_deleted:'Supprimé', t_dup:'Copie créée',
  untitled:'Sans titre', current:'Ouvert', t_new:'Nouveau dépliant prêt'
});
Object.assign(UI.en, {
  fold_type:'Fold type', sec_inner:'Inside page', sec_inner_d:'Heading, text and image', side_front:'Front', side_back:'Back', foldA5:'A5 sheet',
  back_tools:'Back to tools', mine:'My brochures', save:'Save to my account', new_b:'New brochure', open_b:'Open', dup_b:'Duplicate', del_b:'Delete',
  confirm_del:'Delete this brochure from your account for good?', login_title:'Sign in to save your brochures',
  login_text:'Your work is saved automatically on this device. Sign in to keep it in your account and open it anywhere.',
  login_google:'Continue with Google', login_site:'Sign in on the site', cancel:'Cancel',
  t_saved_cloud:'Saved to your account', t_too_big:'Brochure too large, shrink or remove some images',
  t_cloud_err:'Could not save online, your work is kept on this device', mine_empty:'No brochures saved in your account yet',
  loading:'Loading...', copy_suffix:' (copy)', t_opened:'Brochure opened', t_deleted:'Deleted', t_dup:'Copy created',
  untitled:'Untitled', current:'Open now', t_new:'New brochure ready'
});

/* ---------------------------------------------------------
   Templates
--------------------------------------------------------- */
const CONTACT_AR = { phone:'0550 12 34 56', email:'contact@merabti.com', addr:'الجزائر', web:'www.merabti.com' };

const TEMPLATES = [
  { id:'wave', cat:'edu', font:'Tajawal',
    name:{ar:'درس تفاعلي', fr:'Leçon', en:'Lesson'},
    pal:{c1:'#2F6FB0', c2:'#8FD0F5', c3:'#FFC857', c4:'#FFFFFF', bg:'#FFFFFF', ink:'#1E2F40'},
    s:{'cover.title':'الطاقات المتجددة','cover.sub':'درس في العلوم الفيزيائية للسنة الثالثة متوسط','cover.org':'الأستاذ: م. أحمد',
      'flap.title':'هل تعلم؟','flap.text':'تتمتع الجزائر بأكثر من 3000 ساعة من أشعة الشمس سنويًا، مما يجعلها من أغنى بلدان العالم بالطاقة الشمسية.',
      'p1.title':'ما هي الطاقة المتجددة؟','p1.text':'هي طاقة نحصل عليها من مصادر طبيعية لا تنفد، مثل الشمس والرياح والماء.\nتتجدد باستمرار ولا تلوّث البيئة كما تفعل الطاقات الأحفورية.',
      'p2.title':'أنواعها','p2.text':'الطاقة الشمسية: تحويل أشعة الشمس إلى كهرباء بواسطة الألواح الكهروضوئية.\nطاقة الرياح: تدوير التوربينات لإنتاج الكهرباء.\nالطاقة المائية: استغلال حركة المياه في السدود.',
      'p3.title':'تذكّر','p3.list':'الشمس مصدر لا ينفد\nالرياح تحرّك التوربينات\nالطاقة النظيفة تحمي البيئة\nترشيد الاستهلاك مسؤولية الجميع',
      'back.title':'للتواصل','back.text':'لأي استفسار حول الدرس أو للحصول على تمارين إضافية.'} },

  { id:'note', cat:'edu', font:'Almarai', mirror:true,
    name:{ar:'ملخص مراجعة', fr:'Fiche de révision', en:'Revision notes'},
    pal:{c1:'#D64550', c2:'#FFE27A', c3:'#B9D7F2', c4:'#FFFFFF', bg:'#FFFDF4', ink:'#2B2B2B'},
    s:{'cover.title':'ملخص قواعد اللغة العربية','cover.sub':'مراجعة شاملة لامتحان شهادة التعليم المتوسط','cover.org':'إعداد: الأستاذة س. بن علي',
      'flap.title':'أهم القواعد','flap.text':'المبتدأ مرفوع، والفاعل مرفوع، والمفعول به منصوب. احفظ هذه الثلاثة وستتجنب أغلب الأخطاء.',
      'p1.title':'الجملة الاسمية','p1.text':'تتكون من مبتدأ وخبر، وكلاهما مرفوع.\nمثال: العلمُ نورٌ.\nقد يتقدّم الخبر على المبتدأ إذا كان شبه جملة.',
      'p2.title':'الجملة الفعلية','p2.text':'تبدأ بفعل، وتتكون من فعل وفاعل، وقد تحتاج إلى مفعول به.\nمثال: كتبَ التلميذُ الدرسَ.',
      'p3.title':'نصائح للمراجعة','p3.list':'راجع كل يوم قليلًا\nحلّ تمارين متنوعة\nاكتب الأمثلة بيدك\nنم جيدًا قبل الامتحان',
      'back.title':'بالتوفيق للجميع','back.text':'النجاح ثمرة المثابرة، فلا تستسلم.'} },

  { id:'health', cat:'aware', font:'Cairo',
    name:{ar:'توعية صحية', fr:'Santé', en:'Health'},
    pal:{c1:'#1FA38A', c2:'#A8E6D6', c3:'#FF7A7A', c4:'#FFFFFF', bg:'#F3FBF8', ink:'#1D3B36'},
    s:{'cover.title':'صحتك أمانة','cover.sub':'حملة توعوية حول التغذية السليمة ونمط الحياة الصحي','cover.org':'وحدة الكشف والمتابعة المدرسية',
      'flap.title':'هل تعلم؟','flap.text':'شرب كوبين من الماء صباحًا يساعد جسمك على النشاط ويحسّن الهضم.',
      'p1.title':'التغذية المتوازنة','p1.text':'احرص على تناول الخضر والفواكه يوميًا، وقلّل من السكريات والمشروبات الغازية.\nوجبة الفطور هي أهم وجبة في اليوم.',
      'p2.title':'النشاط البدني','p2.text':'ثلاثون دقيقة من المشي أو الرياضة يوميًا تقوّي القلب وتحسّن التركيز وتقلّل التوتر.',
      'p3.title':'عادات يومية','p3.list':'اشرب الماء بانتظام\nاغسل يديك قبل الأكل\nنم ثماني ساعات\nقلّل من الشاشات',
      'back.title':'استشر طبيبك','back.text':'الوقاية خير من العلاج، والكشف المبكر يحمي صحتك.'} },

  { id:'eco', cat:'aware', font:'Cairo', mirror:true,
    name:{ar:'البيئة', fr:'Environnement', en:'Environment'},
    pal:{c1:'#3E7B27', c2:'#A7C957', c3:'#F6C85F', c4:'#FFFFFF', bg:'#FBFAF1', ink:'#253320'},
    s:{'cover.title':'لنحمِ كوكبنا','cover.sub':'دليل صغير للحفاظ على البيئة في المدرسة والبيت','cover.org':'نادي البيئة المدرسي',
      'flap.title':'شعارنا','flap.text':'مدرسة نظيفة، بيئة سليمة، مستقبل أخضر.',
      'p1.title':'لماذا نحمي البيئة؟','p1.text':'البيئة بيتنا المشترك. التلوث يهدد الماء والهواء والتربة، وكل واحد منا قادر على التغيير بخطوات بسيطة.',
      'p2.title':'إعادة التدوير','p2.text':'افصل النفايات: الورق، البلاستيك، الزجاج والمعادن.\nإعادة التدوير توفّر المواد الخام وتقلّل النفايات.',
      'p3.title':'خطوات بسيطة','p3.list':'أطفئ الأضواء غير الضرورية\nأغلق الصنبور جيدًا\nاستعمل كيسًا قابلًا لإعادة الاستعمال\nازرع شجرة',
      'back.title':'انضم إلينا','back.text':'شارك في حملات التشجير والتنظيف مع نادي البيئة كل يوم خميس.'} },

  { id:'event', cat:'school', font:'Tajawal',
    name:{ar:'حفل مدرسي', fr:'Fête scolaire', en:'School party'},
    pal:{c1:'#E4405F', c2:'#3FA7D6', c3:'#FAC05E', c4:'#59CD90', bg:'#FFFFFF', ink:'#2A2340'},
    s:{'cover.title':'حفل نهاية السنة','cover.sub':'يسعدنا دعوتكم لحضور حفل تكريم التلاميذ المتفوقين','cover.org':'إدارة ابتدائية الأمل',
      'flap.title':'كلمة شكر','flap.text':'شكرًا لكل الأساتذة والأولياء على مرافقة أبنائنا طوال هذه السنة الدراسية.',
      'p1.title':'برنامج الحفل','p1.text':'افتتاح بآيات من القرآن الكريم، ثم النشيد الوطني، تليها كلمة السيد المدير.',
      'p2.title':'فقرات فنية','p2.text':'عروض مسرحية وأناشيد من تقديم تلاميذنا، ومعرض لأعمالهم الفنية طوال السنة.',
      'p3.title':'معلومات الحفل','p3.list':'التاريخ: الخميس 25 جوان\nالتوقيت: 14:00\nالمكان: ساحة المدرسة\nالدعوة عامة للأولياء',
      'back.title':'نتشرف بحضوركم','back.text':'حضوركم يُسعد أبناءكم ويشجعهم على مزيد من التفوق.'} },

  { id:'bts', cat:'school', font:'Almarai',
    name:{ar:'الدخول المدرسي', fr:'Rentrée scolaire', en:'Back to school'},
    pal:{c1:'#F6B80C', c2:'#1E3A5F', c3:'#E94F37', c4:'#FFFFFF', bg:'#FFFFFF', ink:'#1E3A5F'},
    s:{'cover.title':'دخول مدرسي سعيد','cover.sub':'دليل التلميذ والولي لسنة دراسية ناجحة','cover.org':'متوسطة ابن خلدون',
      'flap.title':'نصيحة للأولياء','flap.text':'تابعوا كراريس أبنائكم يوميًا، وتواصلوا مع الأساتذة كلما دعت الحاجة.',
      'p1.title':'مرحبًا بكم','p1.text':'نرحب بجميع التلاميذ في سنة دراسية جديدة مليئة بالتعلم والنشاط والنجاح.',
      'p2.title':'التنظيم اليومي','p2.text':'يبدأ الدوام على الساعة الثامنة صباحًا.\nالحضور في الوقت واحترام النظام الداخلي من أسس النجاح.',
      'p3.title':'الأدوات المطلوبة','p3.list':'كراريس 96 صفحة\nأقلام بألوان مختلفة\nمسطرة وكوس ومنقلة\nمئزر نظيف',
      'back.title':'للتواصل مع الإدارة','back.text':'مكتب الاستقبال مفتوح من الأحد إلى الخميس.'} },

  { id:'corp', cat:'biz', font:'Cairo', mirror:true,
    name:{ar:'تعريف بمؤسسة', fr:'Présentation d’entreprise', en:'Company profile'},
    pal:{c1:'#1B2F5B', c2:'#2EC4B6', c3:'#E9EEF5', c4:'#FFFFFF', bg:'#FFFFFF', ink:'#1B2F5B'},
    s:{'cover.title':'حلول هندسية متكاملة','cover.sub':'خبرة في الدراسات والصيانة الصناعية','cover.org':'مكتب الدراسات التقنية',
      'flap.title':'لماذا نحن؟','flap.text':'فريق من المهندسين ذوي الخبرة، والتزام بالجودة واحترام المواعيد.',
      'p1.title':'من نحن','p1.text':'مكتب دراسات متخصص في الهندسة الصناعية والطاقة، نرافق المؤسسات من الدراسة إلى التنفيذ والمتابعة.',
      'p2.title':'رؤيتنا','p2.text':'نسعى لتقديم حلول موثوقة وفعّالة تحسّن أداء المنشآت وتقلّل استهلاك الطاقة وتكاليف الصيانة.',
      'p3.title':'خدماتنا','p3.list':'الدراسات التقنية\nالصيانة الوقائية\nتدقيق الطاقة\nالتكوين والمرافقة',
      'back.title':'اتصل بنا','back.text':'يسعدنا دراسة مشروعكم وتقديم عرض يناسبكم.'} },

  { id:'hex', cat:'biz', font:'Cairo', mirror:true,
    name:{ar:'خدمات', fr:'Services', en:'Services'},
    pal:{c1:'#0F766E', c2:'#7DE3CF', c3:'#F59E0B', c4:'#FFFFFF', bg:'#F6FAF9', ink:'#134E4A'},
    s:{'cover.title':'خدمات الصيانة','cover.sub':'سرعة في التدخل وجودة في العمل','cover.org':'شركة الإتقان للخدمات',
      'flap.title':'عروض المؤسسات','flap.text':'عقود صيانة سنوية بأسعار تفضيلية للمؤسسات والإدارات.',
      'p1.title':'ماذا نقدّم','p1.text':'صيانة التجهيزات الكهربائية والتبريد والتكييف للمنازل والمؤسسات، بفريق مؤهل وقطع غيار أصلية.',
      'p2.title':'كيف نعمل','p2.text':'اتصل بنا، نحدد موعدًا، يتنقل الفني إليك ويقدّم تشخيصًا مجانيًا قبل أي تدخل.',
      'p3.title':'مزايانا','p3.list':'تدخّل خلال 24 ساعة\nضمان على كل الأعمال\nأسعار واضحة\nخدمة ما بعد البيع',
      'back.title':'نحن في خدمتكم','back.text':'من السبت إلى الخميس، من 8 صباحًا إلى 6 مساءً.'} },

  { id:'promo', cat:'promo', font:'Cairo',
    name:{ar:'عروض وتخفيضات', fr:'Promotions', en:'Sale'},
    pal:{c1:'#E63946', c2:'#FFD60A', c3:'#1D1D1D', c4:'#FFFFFF', bg:'#FFFFFF', ink:'#1D1D1D'},
    s:{'cover.title':'تخفيضات كبرى','cover.sub':'على كل المنتجات لمدة أسبوع فقط','cover.org':'متجر النور','cover.badge':'-50%',
      'flap.title':'لا تفوّت الفرصة','flap.text':'العرض ساري حتى نفاد الكمية.',
      'p1.title':'عروض الأسبوع','p1.text':'استفد من تخفيضات تصل إلى 50% على الأجهزة المنزلية والملابس والأدوات المكتبية.',
      'p2.title':'هدايا مجانية','p2.text':'لكل عملية شراء تفوق 5000 دج، احصل على هدية مجانية ومشاركة في السحب.',
      'p3.title':'أبرز الأسعار','p3.list':'خلاط كهربائي | 3900 دج\nمكواة بخار | 2500 دج\nحقيبة مدرسية | 1800 دج\nمصباح مكتبي | 1200 دج',
      'back.title':'زورونا','back.text':'مفتوح كل أيام الأسبوع من 9 صباحًا إلى 10 ليلًا.'} },

  { id:'menu', cat:'promo', font:'Amiri',
    name:{ar:'قائمة مطعم', fr:'Menu de restaurant', en:'Restaurant menu'},
    pal:{c1:'#C9A227', c2:'#8C6D1F', c3:'#3A3630', c4:'#FFFFFF', bg:'#1C1B19', ink:'#EFE6D2'},
    s:{'cover.title':'مطعم الأصالة','cover.sub':'نكهات تقليدية بلمسة عصرية','cover.org':'قائمة الطعام',
      'flap.title':'الحلويات','flap.text':'قلب اللوز، المقروط، والشاي بالنعناع يُقدَّم مع كل وجبة.',
      'p1.title':'المقبلات','p1.text':'شوربة فريك بالدجاج، بوراك باللحم، وسلطة مشوية بزيت الزيتون.',
      'p2.title':'الأطباق الرئيسية','p2.text':'كسكس بالخضر واللحم، طاجين الزيتون، رشتة عاصمية، وشطيطحة دجاج.',
      'p3.title':'الأسعار','p3.list':'شوربة فريك | 250 دج\nكسكس باللحم | 900 دج\nطاجين زيتون | 750 دج\nقلب اللوز | 150 دج',
      'back.title':'احجز طاولتك','back.text':'نستقبلكم يوميًا من 12 ظهرًا إلى 11 ليلًا.'} },

  { id:'conf', cat:'events', font:'Tajawal', mirror:true,
    name:{ar:'ملتقى علمي', fr:'Colloque scientifique', en:'Scientific conference'},
    pal:{c1:'#5B2A86', c2:'#00B4D8', c3:'#F72585', c4:'#FFFFFF', bg:'#FFFFFF', ink:'#2B1B3D'},
    s:{'cover.title':'الملتقى الوطني للطاقة','cover.sub':'الانتقال الطاقوي في القطاع الصناعي: تحديات وآفاق','cover.org':'كلية العلوم والتكنولوجيا',
      'flap.title':'اللجنة العلمية','flap.text':'تضم أساتذة وباحثين من جامعات ومراكز بحث وطنية ودولية.',
      'p1.title':'ديباجة الملتقى','p1.text':'يهدف الملتقى إلى جمع الباحثين والمهنيين لمناقشة سبل تحسين النجاعة الطاقوية في الصناعة ودمج الطاقات المتجددة.',
      'p2.title':'محاور الملتقى','p2.text':'النجاعة الطاقوية في المصانع.\nالطاقات المتجددة وتخزينها.\nالإلكترونيات الطاقوية والشبكات الذكية.',
      'p3.title':'تواريخ مهمة','p3.list':'آخر أجل للملخصات: 15 نوفمبر\nالرد على المشاركين: 30 نوفمبر\nالمقالات الكاملة: 20 ديسمبر\nانعقاد الملتقى: 12 جانفي',
      'back.title':'التسجيل والاستفسار','back.text':'تُرسل الملخصات عبر البريد الإلكتروني وفق النموذج المرفق.'} },

  { id:'ram', cat:'occ', font:'El Messiri',
    name:{ar:'رمضان', fr:'Ramadan', en:'Ramadan'},
    pal:{c1:'#E0B04F', c2:'#0F1E3D', c3:'#1E3563', c4:'#FFFFFF', bg:'#FBF6EA', ink:'#2A2A2A'},
    s:{'cover.title':'رمضان مبارك','cover.sub':'شهر الخير والبركة والتراحم','cover.org':'جمعية البر والإحسان',
      'flap.title':'دعاء','flap.text':'اللهم بلّغنا رمضان، وأعنّا على صيامه وقيامه، وتقبّله منا.',
      'p1.title':'فضل الشهر','p1.text':'شهر رمضان فرصة لتجديد الإيمان وتهذيب النفس، وهو شهر القرآن والصبر والتكافل.',
      'p2.title':'قفة رمضان','p2.text':'تنظم جمعيتنا حملة لتوزيع قفة رمضان على العائلات المعوزة، ونرحب بمساهماتكم.',
      'p3.title':'برنامج الشهر','p3.list':'إفطار صائم يوميًا\nمسابقة حفظ القرآن\nدروس ومحاضرات\nزكاة الفطر',
      'back.title':'ساهم معنا','back.text':'كل مساهمة مهما كانت صغيرة تصنع فرحة في بيت محتاج.'} }
];
const TPL = Object.fromEntries(TEMPLATES.map(t => [t.id, t]));
const CATS = ['edu','aware','school','biz','promo','events','occ'];
const FONTS = ['Tajawal','Cairo','Almarai','El Messiri','Amiri'];
const COLORS = ['#2F6FB0','#1FA38A','#3E7B27','#E4405F','#E63946','#F6B80C','#5B2A86','#1B2F5B','#0F766E','#C9A227'];

/* Full per-template samples for French and English */
const K = ['cover.title','cover.sub','cover.org','flap.title','flap.text','p1.title','p1.text','p2.title','p2.text','p3.title','p3.list','back.title','back.text'];
const S = arr => Object.fromEntries(K.map((k, i) => [k, arr[i]]));
const SAMPLES_I18N = {
  wave: {
    fr: S(['Les énergies renouvelables','Cours de sciences physiques — 3e année moyenne','Professeur : M. Ahmed',
      'Le saviez-vous ?','L’Algérie reçoit plus de 3000 heures d’ensoleillement par an, ce qui en fait l’un des pays les plus riches en énergie solaire.',
      'Qu’est-ce qu’une énergie renouvelable ?','C’est une énergie issue de sources naturelles inépuisables : le soleil, le vent et l’eau.\nElle se renouvelle sans cesse et ne pollue pas comme les énergies fossiles.',
      'Ses types','Solaire : transformer la lumière du soleil en électricité grâce aux panneaux photovoltaïques.\nÉolienne : faire tourner des turbines pour produire de l’électricité.\nHydraulique : exploiter le mouvement de l’eau dans les barrages.',
      'Retiens','Le soleil est une source inépuisable\nLe vent fait tourner les éoliennes\nL’énergie propre protège l’environnement\nÉconomiser l’énergie, c’est l’affaire de tous',
      'Contact','Pour toute question sur le cours ou pour des exercices supplémentaires.']),
    en: S(['Renewable energy','Physics lesson — Year 9','Teacher: Mr. Ahmed',
      'Did you know?','Algeria gets more than 3,000 hours of sunshine a year, making it one of the richest countries in solar energy.',
      'What is renewable energy?','It is energy that comes from natural sources that never run out: the sun, the wind and water.\nIt renews itself constantly and does not pollute like fossil fuels.',
      'Its types','Solar: turning sunlight into electricity with photovoltaic panels.\nWind: spinning turbines to generate electricity.\nHydro: using moving water in dams.',
      'Remember','The sun never runs out\nWind turns the turbines\nClean energy protects nature\nSaving energy is everyone’s job',
      'Contact','For any question about the lesson or for extra exercises.'])
  },
  note: {
    fr: S(['Fiche de révision : la conjugaison','Tout pour réussir l’examen du BEM','Préparé par : Mme S. Benali',
      'Règles clés','Le verbe s’accorde toujours avec son sujet. Retenez cette règle et vous éviterez la plupart des erreurs.',
      'Le présent','Il exprime une action qui se déroule maintenant.\nExemple : Je lis un livre.\nLes verbes du 1er groupe se terminent par -e, -es, -e.',
      'Le passé composé','Il se forme avec l’auxiliaire avoir ou être et le participe passé.\nExemple : Nous avons fini nos devoirs.',
      'Conseils de révision','Révisez un peu chaque jour\nFaites des exercices variés\nÉcrivez les exemples à la main\nDormez bien avant l’examen',
      'Bonne chance à tous','La réussite est le fruit de la persévérance, ne lâchez rien.']),
    en: S(['Grammar revision sheet','Everything you need for the final exam','Prepared by: Mrs. S. Benali',
      'Key rules','A verb always agrees with its subject. Remember this rule and you will avoid most mistakes.',
      'Present simple','Used for habits and general truths.\nExample: She reads every day.\nAdd -s for he, she and it.',
      'Past simple','Used for finished actions in the past.\nExample: We finished our homework yesterday.',
      'Revision tips','Revise a little every day\nSolve different exercises\nWrite examples by hand\nSleep well before the exam',
      'Good luck everyone','Success comes from perseverance, never give up.'])
  },
  health: {
    fr: S(['Votre santé compte','Campagne de sensibilisation pour une alimentation saine et une vie active','Unité de dépistage et de suivi scolaire',
      'Le saviez-vous ?','Boire deux verres d’eau le matin aide votre corps à se réveiller et facilite la digestion.',
      'Une alimentation équilibrée','Mangez des fruits et légumes chaque jour et limitez le sucre et les boissons gazeuses.\nLe petit-déjeuner est le repas le plus important de la journée.',
      'L’activité physique','Trente minutes de marche ou de sport par jour renforcent le cœur, améliorent la concentration et réduisent le stress.',
      'Bonnes habitudes','Buvez de l’eau régulièrement\nLavez-vous les mains avant de manger\nDormez huit heures\nLimitez les écrans',
      'Consultez votre médecin','Mieux vaut prévenir que guérir, et le dépistage précoce protège votre santé.']),
    en: S(['Your health matters','An awareness campaign on healthy eating and an active lifestyle','School health and screening unit',
      'Did you know?','Drinking two glasses of water in the morning wakes your body up and helps digestion.',
      'A balanced diet','Eat fruit and vegetables every day and cut down on sugar and fizzy drinks.\nBreakfast is the most important meal of the day.',
      'Physical activity','Thirty minutes of walking or sport a day strengthens the heart, improves focus and reduces stress.',
      'Daily habits','Drink water regularly\nWash your hands before eating\nSleep eight hours\nSpend less time on screens',
      'See your doctor','Prevention is better than cure, and early screening protects your health.'])
  },
  eco: {
    fr: S(['Protégeons notre planète','Petit guide pour préserver l’environnement à l’école et à la maison','Club environnement de l’école',
      'Notre devise','École propre, environnement sain, avenir vert.',
      'Pourquoi protéger l’environnement ?','L’environnement est notre maison commune. La pollution menace l’eau, l’air et le sol, et chacun peut agir par des gestes simples.',
      'Le recyclage','Triez vos déchets : papier, plastique, verre et métal.\nLe recyclage économise les matières premières et réduit les déchets.',
      'Gestes simples','Éteignez les lumières inutiles\nFermez bien le robinet\nUtilisez un sac réutilisable\nPlantez un arbre',
      'Rejoignez-nous','Participez aux campagnes de plantation et de nettoyage avec le club chaque jeudi.']),
    en: S(['Let’s protect our planet','A small guide to caring for the environment at school and at home','School environment club',
      'Our motto','A clean school, a healthy environment, a green future.',
      'Why protect the environment?','The environment is our shared home. Pollution threatens water, air and soil, and each of us can make a difference with simple steps.',
      'Recycling','Sort your waste: paper, plastic, glass and metal.\nRecycling saves raw materials and reduces waste.',
      'Simple steps','Switch off unneeded lights\nTurn the tap off properly\nUse a reusable bag\nPlant a tree',
      'Join us','Take part in tree-planting and clean-up campaigns with the club every Thursday.'])
  },
  event: {
    fr: S(['Fête de fin d’année','Nous avons le plaisir de vous inviter à la cérémonie de remise des prix','École primaire El Amel',
      'Merci','Merci à tous les enseignants et parents d’avoir accompagné nos enfants tout au long de l’année.',
      'Programme','Ouverture par des versets du Saint Coran, puis l’hymne national, suivis du discours de M. le directeur.',
      'Animations','Pièces de théâtre et chants présentés par nos élèves, et exposition de leurs travaux de l’année.',
      'Infos pratiques','Date : jeudi 25 juin\nHeure : 14h00\nLieu : cour de l’école\nOuvert à tous les parents',
      'Au plaisir de vous voir','Votre présence fera plaisir à vos enfants et les encouragera à exceller.']),
    en: S(['End of year party','We are pleased to invite you to our top pupils’ awards ceremony','El Amel Primary School',
      'Thank you','Thank you to all teachers and parents for supporting our children throughout the year.',
      'Programme','Opening with verses from the Holy Quran, then the national anthem, followed by a speech from the head teacher.',
      'Performances','Plays and songs by our pupils, plus an exhibition of their artwork from the year.',
      'Event details','Date: Thursday 25 June\nTime: 2:00 pm\nPlace: school yard\nAll parents welcome',
      'We look forward to seeing you','Your presence will delight your children and encourage them to keep excelling.'])
  },
  bts: {
    fr: S(['Bonne rentrée !','Guide de l’élève et des parents pour une année réussie','CEM Ibn Khaldoun',
      'Conseil aux parents','Consultez chaque jour les cahiers de vos enfants et contactez les enseignants dès que nécessaire.',
      'Bienvenue','Nous souhaitons la bienvenue à tous les élèves pour une nouvelle année pleine d’apprentissage et de réussite.',
      'Organisation','Les cours commencent à 8h00.\nLa ponctualité et le respect du règlement sont les clés de la réussite.',
      'Fournitures','Cahiers de 96 pages\nStylos de plusieurs couleurs\nRègle, équerre et rapporteur\nBlouse propre',
      'Contacter l’administration','L’accueil est ouvert du dimanche au jeudi.']),
    en: S(['Happy new school year!','A guide for pupils and parents to a successful year','Ibn Khaldoun Middle School',
      'Tip for parents','Check your children’s notebooks every day and contact teachers whenever needed.',
      'Welcome','We welcome all pupils to a new school year full of learning, activity and success.',
      'Daily routine','School starts at 8:00 am.\nBeing on time and respecting the rules are the keys to success.',
      'What you need','96-page notebooks\nPens in different colours\nRuler, set square and protractor\nA clean school smock',
      'Contact the office','The front office is open Sunday to Thursday.'])
  },
  corp: {
    fr: S(['Solutions d’ingénierie intégrées','Expertise en études et maintenance industrielle','Bureau d’études techniques',
      'Pourquoi nous ?','Une équipe d’ingénieurs expérimentés, engagée sur la qualité et le respect des délais.',
      'Qui sommes-nous','Bureau d’études spécialisé en ingénierie industrielle et en énergie, nous accompagnons les entreprises de l’étude à la réalisation et au suivi.',
      'Notre vision','Offrir des solutions fiables et efficaces qui améliorent la performance des installations et réduisent la consommation d’énergie et les coûts de maintenance.',
      'Nos services','Études techniques\nMaintenance préventive\nAudit énergétique\nFormation et accompagnement',
      'Contactez-nous','Nous serons ravis d’étudier votre projet et de vous faire une offre adaptée.']),
    en: S(['Integrated engineering solutions','Expertise in industrial studies and maintenance','Technical Studies Office',
      'Why us?','A team of experienced engineers committed to quality and deadlines.',
      'About us','An engineering office specialised in industrial engineering and energy, supporting companies from study to delivery and follow-up.',
      'Our vision','Delivering reliable, efficient solutions that improve plant performance and cut energy use and maintenance costs.',
      'Our services','Technical studies\nPreventive maintenance\nEnergy audits\nTraining and support',
      'Contact us','We will gladly study your project and send you a tailored offer.'])
  },
  hex: {
    fr: S(['Services de maintenance','Rapidité d’intervention et travail de qualité','Société El Itqane Services',
      'Offres entreprises','Contrats de maintenance annuels à tarifs préférentiels pour les entreprises et administrations.',
      'Ce que nous offrons','Maintenance des équipements électriques, du froid et de la climatisation pour particuliers et entreprises, avec une équipe qualifiée et des pièces d’origine.',
      'Comment ça marche','Appelez-nous, nous fixons un rendez-vous, le technicien se déplace et établit un diagnostic gratuit avant toute intervention.',
      'Nos atouts','Intervention sous 24 heures\nGarantie sur tous les travaux\nPrix transparents\nService après-vente',
      'À votre service','Du samedi au jeudi, de 8h00 à 18h00.']),
    en: S(['Maintenance services','Fast response and quality work','El Itqane Services',
      'Business plans','Annual maintenance contracts at preferential rates for companies and public offices.',
      'What we offer','Maintenance of electrical, refrigeration and air-conditioning equipment for homes and businesses, by a qualified team with original parts.',
      'How it works','Call us, we book a visit, and the technician comes to you with a free diagnosis before any work.',
      'Why choose us','Response within 24 hours\nWarranty on all work\nClear prices\nAfter-sales service',
      'At your service','Saturday to Thursday, 8:00 am to 6:00 pm.'])
  },
  promo: {
    fr: S(['Grandes soldes','Sur tous les produits pendant une semaine seulement','Magasin En-Nour',
      'Ne ratez pas l’occasion','Offre valable dans la limite des stocks disponibles.',
      'Offres de la semaine','Profitez de réductions jusqu’à 50 % sur l’électroménager, les vêtements et les fournitures de bureau.',
      'Cadeaux offerts','Pour tout achat de plus de 5000 DA, recevez un cadeau et participez au tirage au sort.',
      'Prix phares','Mixeur électrique | 3900 DA\nFer à vapeur | 2500 DA\nCartable | 1800 DA\nLampe de bureau | 1200 DA',
      'Rendez-nous visite','Ouvert tous les jours de 9h00 à 22h00.']),
    en: S(['Big sale','On every product for one week only','En-Nour Store',
      'Don’t miss out','Offer valid while stocks last.',
      'This week’s deals','Enjoy up to 50% off home appliances, clothes and office supplies.',
      'Free gifts','Spend over 5,000 DA and get a free gift plus an entry into our prize draw.',
      'Top prices','Electric blender | 3900 DA\nSteam iron | 2500 DA\nSchool bag | 1800 DA\nDesk lamp | 1200 DA',
      'Visit us','Open every day from 9:00 am to 10:00 pm.'])
  },
  menu: {
    fr: S(['Restaurant El Assala','Saveurs traditionnelles, touche moderne','Menu',
      'Desserts','Qalb el louz, makrout et thé à la menthe servi avec chaque repas.',
      'Entrées','Chorba frik au poulet, bourek à la viande et salade mechouia à l’huile d’olive.',
      'Plats principaux','Couscous aux légumes et à la viande, tajine aux olives, rechta algéroise et chtitha de poulet.',
      'Prix','Chorba frik | 250 DA\nCouscous à la viande | 900 DA\nTajine aux olives | 750 DA\nQalb el louz | 150 DA',
      'Réservez votre table','Nous vous accueillons tous les jours de 12h00 à 23h00.']),
    en: S(['El Assala Restaurant','Traditional flavours with a modern touch','Menu',
      'Desserts','Qalb el louz, makrout and mint tea served with every meal.',
      'Starters','Chicken chorba frik, meat bourek and grilled mechouia salad with olive oil.',
      'Main dishes','Couscous with vegetables and meat, olive tajine, rechta and chicken chtitha.',
      'Prices','Chorba frik | 250 DA\nMeat couscous | 900 DA\nOlive tajine | 750 DA\nQalb el louz | 150 DA',
      'Book your table','We welcome you every day from 12:00 pm to 11:00 pm.'])
  },
  conf: {
    fr: S(['Colloque national sur l’énergie','La transition énergétique dans le secteur industriel : défis et perspectives','Faculté des sciences et de la technologie',
      'Comité scientifique','Composé d’enseignants et de chercheurs d’universités et de centres de recherche nationaux et internationaux.',
      'Présentation','Le colloque réunit chercheurs et professionnels pour débattre de l’amélioration de l’efficacité énergétique dans l’industrie et de l’intégration des énergies renouvelables.',
      'Axes du colloque','Efficacité énergétique dans les usines.\nÉnergies renouvelables et stockage.\nÉlectronique de puissance et réseaux intelligents.',
      'Dates importantes','Résumés : 15 novembre\nRéponse aux auteurs : 30 novembre\nArticles complets : 20 décembre\nColloque : 12 janvier',
      'Inscription et contact','Les résumés sont envoyés par e-mail selon le modèle joint.']),
    en: S(['National Energy Conference','Energy transition in industry: challenges and prospects','Faculty of Science and Technology',
      'Scientific committee','Professors and researchers from national and international universities and research centres.',
      'About the conference','The conference brings researchers and professionals together to discuss improving energy efficiency in industry and integrating renewable energy.',
      'Conference topics','Energy efficiency in factories.\nRenewable energy and storage.\nPower electronics and smart grids.',
      'Key dates','Abstracts due: 15 November\nNotification: 30 November\nFull papers: 20 December\nConference: 12 January',
      'Registration and contact','Abstracts are sent by email using the attached template.'])
  },
  ram: {
    fr: S(['Ramadan Moubarak','Le mois du bien, de la bénédiction et de la solidarité','Association El Birr wal Ihsane',
      'Invocation','Ô Allah, fais-nous atteindre Ramadan, aide-nous à le jeûner et à y prier, et accepte-le de notre part.',
      'Les vertus du mois','Ramadan est l’occasion de renouveler sa foi et de purifier son âme ; c’est le mois du Coran, de la patience et de l’entraide.',
      'Couffin du Ramadan','Notre association organise la distribution du couffin du Ramadan aux familles démunies. Vos dons sont les bienvenus.',
      'Programme du mois','Iftar quotidien pour les jeûneurs\nConcours de récitation du Coran\nCours et conférences\nZakat el fitr',
      'Contribuez avec nous','Chaque don, même petit, apporte de la joie dans un foyer dans le besoin.']),
    en: S(['Ramadan Mubarak','A month of goodness, blessing and compassion','El Birr wal Ihsane Association',
      'Supplication','O Allah, let us reach Ramadan, help us fast and pray through it, and accept it from us.',
      'The virtues of the month','Ramadan is a chance to renew faith and refine the soul; it is the month of the Quran, patience and solidarity.',
      'Ramadan food baskets','Our association distributes Ramadan food baskets to families in need, and your donations are welcome.',
      'This month’s programme','Daily iftar for those fasting\nQuran memorisation contest\nTalks and lectures\nZakat al-fitr',
      'Give with us','Every donation, however small, brings joy to a home in need.'])
  }
};
const ADDR = { ar:'الجزائر', fr:'Algérie', en:'Algeria' };
const EXTRA_P = {
  ar:{'p4.title':'معلومات إضافية','p4.text':'أضف هنا معلومات مكمّلة أو صورة توضيحية تدعم محتوى المطوية.','p5.title':'كلمة أخيرة','p5.text':'اختم برسالة قصيرة تبقى في ذهن القارئ.'},
  fr:{'p4.title':'Informations complémentaires','p4.text':'Ajoutez ici des informations utiles ou une image qui illustre votre contenu.','p5.title':'Le mot de la fin','p5.text':'Terminez par un message court qui restera dans l’esprit du lecteur.'},
  en:{'p4.title':'More information','p4.text':'Add useful extra details or an image that illustrates your content.','p5.title':'Final word','p5.text':'End with a short message your reader will remember.'}
};

function sampleFor(id, lang) {
  const t = TPL[id];
  const base = { 'cover.badge': t.s['cover.badge'] || '', ...CONTACT_AR, addr: ADDR[lang] || ADDR.ar, ...(EXTRA_P[lang] || EXTRA_P.ar) };
  if (lang === 'ar' || !SAMPLES_I18N[id] || !SAMPLES_I18N[id][lang]) return { ...base, ...t.s, addr: ADDR.ar };
  return { ...base, ...SAMPLES_I18N[id][lang] };
}

/* ---------------------------------------------------------
   State
--------------------------------------------------------- */
let uiLang = localStorage.getItem(UI_KEY) || localStorage.getItem('site_lang') || 'ar';
if (!UI[uiLang]) uiLang = 'ar';
const T = k => (UI[uiLang] && UI[uiLang][k]) || UI.ar[k] || k;

function freshState() {
  return { tpl:'wave', fmt:'tri', color:null, font:'auto', clang: uiLang, dirty:false, qr:true, c: sampleFor('wave', uiLang), img:{} };
}
const FMT_OK = f => ['tri','bi','z','a5'].includes(f);
function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY));
    if (s && TPL[s.tpl] && s.c) { const f = Object.assign(freshState(), s); f.c = { ...sampleFor(f.tpl, f.clang), ...s.c }; if (!FMT_OK(f.fmt)) f.fmt = 'tri'; return f; }
  } catch (e) {}
  return null;
}
let st = loadState() || freshState();
let openSec = null;
let kmap = {};
let view = 'flat';
let zoom = 'fit';
let rot = { x: 8, y: -16 };
let folded = false;

/* ---------------------------------------------------------
   Helpers
--------------------------------------------------------- */
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
let uid = 0;
function rng(seed) { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = s * 16807 % 2147483647) / 2147483647; }
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = v => Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt)));
  return '#' + [f(r), f(g), f(b)].map(v => v.toString(16).padStart(2, '0')).join('');
}
function palette(t, colorOverride) {
  const P = { ...t.pal };
  if (colorOverride) P.c1 = colorOverride;
  return P;
}
function hexPts(cx, cy, r) {
  const p = [];
  for (let i = 0; i < 6; i++) { const a = Math.PI / 180 * (60 * i - 90); p.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1)); }
  return p.join(' ');
}
function starPts(cx, cy, r1, r2, n) {
  const p = [];
  for (let i = 0; i < n * 2; i++) { const r = i % 2 ? r2 : r1; const a = Math.PI * i / n - Math.PI / 2; p.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1)); }
  return p.join(' ');
}
const leaf = (x, y, a, s, fill) =>
  `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path d="M0 0C18 -26 58 -26 76 0C58 26 18 26 0 0Z" fill="${fill}"/><path d="M4 0H70" stroke="#fff" stroke-opacity=".45" stroke-width="2" fill="none"/></g>`;

/* ---------------------------------------------------------
   Decorations (SVG, literal colors so PDF export keeps them)
--------------------------------------------------------- */
/* ---------------------------------------------------------
   Fold formats
--------------------------------------------------------- */
const FORMATS = {
  tri: { type:'tri', pw:374,   sw:1122, out:['flap','back','cover'], in:['p1','p2','p3'], face3d:'in',
         order:['cover','flap','p1','p2','p3','back'], k0:1,    mm:[297,210], pdf:['landscape','a4'], page:'A4 landscape', label:'fold3' },
  bi:  { type:'bi',  pw:561,   sw:1122, out:['back','cover'], in:['p1','p3'], face3d:'in',
         order:['cover','p1','p3','back'], k0:1.08, mm:[297,210], pdf:['landscape','a4'], page:'A4 landscape', label:'fold2' },
  z:   { type:'z',   pw:280.5, sw:1122, out:['cover','flap','p1','p2'], in:['p3','p4','p5','back'], face3d:'out',
         order:['cover','flap','p1','p2','p3','p4','p5','back'], k0:.86, mm:[297,210], pdf:['landscape','a4'], page:'A4 landscape', label:'foldZ' },
  a5:  { type:'a5',  pw:559,   sw:559,  out:['cover'], in:['back'], face3d:'out',
         order:['cover','back'], k0:1.1, mm:[148,210], pdf:['portrait','a5'], page:'A5 portrait', label:'foldA5' }
};
const FMT_KEYS = ['tri','bi','z','a5'];
const fmtNow = () => FORMATS[st.fmt] || FORMATS.tri;

/* ---------------------------------------------------------
   Decorations — drawn for any panel width W (literal colors for PDF)
--------------------------------------------------------- */
function scalePath(d, f) {
  if (f === 1) return d;
  let cmd = '', idx = 0;
  return d.replace(/([MLHVCSQTZmlhvcsqtz])|(-?\d*\.?\d+)/g, (m, c, n) => {
    if (c) { cmd = c.toUpperCase(); idx = 0; return c; }
    const isX = cmd === 'H' ? true : cmd === 'V' ? false : idx % 2 === 0;
    idx++;
    return isX ? String(+(parseFloat(n) * f).toFixed(1)) : n;
  });
}
function mkDeco(W) {
  const f = W / 374;
  const X = x => +(x * f).toFixed(1);
  const sp = d => scalePath(d, f);
  const mv = (x, inner) => `<g transform="translate(${(X(x) - x).toFixed(1)} 0)">${inner}</g>`;
  const s1 = Math.min(1, f);
  return {
    wave(kind, P) {
      let s = `<rect width="${W}" height="794" fill="${P.bg}"/>`;
      if (kind === 'cover') s += `
        <path d="${sp('M0 0H374V372C318 410 262 356 196 384C128 413 64 396 0 424Z')}" fill="${P.c2}"/>
        <path d="${sp('M0 0H374V340C314 380 256 322 188 352C122 381 58 366 0 392Z')}" fill="${P.c1}"/>
        <circle cx="${X(312)}" cy="92" r="52" fill="#fff" opacity=".10"/><circle cx="${X(52)}" cy="262" r="24" fill="#fff" opacity=".13"/>
        <circle cx="${X(330)}" cy="292" r="11" fill="${P.c3}"/><circle cx="${X(84)}" cy="120" r="6" fill="${P.c3}"/>
        <path d="${sp('M0 794V744C70 726 132 766 202 748C272 730 322 748 374 736V794Z')}" fill="${P.c2}"/>
        <path d="${sp('M0 794V768C80 750 150 788 230 770C300 755 340 770 374 762V794Z')}" fill="${P.c1}"/>`;
      else if (kind === 'back') s += `
        <path d="${sp('M0 0H374V40C300 62 240 26 170 44C100 62 50 50 0 60Z')}" fill="${P.c2}"/>
        <path d="${sp('M0 794V690C70 664 140 712 214 688C286 664 330 684 374 670V794Z')}" fill="${P.c1}"/>
        <circle cx="${X(320)}" cy="740" r="22" fill="#fff" opacity=".14"/><circle cx="${X(60)}" cy="760" r="9" fill="${P.c3}"/>`;
      else if (kind === 'flap') s += `
        <circle cx="${W - 14}" cy="30" r="120" fill="${P.c2}" opacity=".45"/><circle cx="20" cy="770" r="90" fill="${P.c2}" opacity=".35"/>
        <circle cx="${X(300)}" cy="150" r="10" fill="${P.c3}"/><circle cx="${X(60)}" cy="640" r="16" fill="${P.c1}" opacity=".18"/>`;
      else s += `
        <path d="${sp('M0 0H374V64C310 92 250 52 186 74C120 96 60 78 0 96Z')}" fill="${P.c1}"/>
        <path d="${sp('M0 96C60 78 120 96 186 74C250 52 310 92 374 64V76C310 104 250 64 186 86C120 108 60 90 0 108Z')}" fill="${P.c2}"/>
        <circle cx="${W - 34}" cy="760" r="36" fill="${P.c2}" opacity=".35"/><circle cx="${W - 74}" cy="770" r="8" fill="${P.c3}"/>`;
      return s;
    },
    note(kind, P) {
      let s = `<rect width="${W}" height="794" fill="${P.bg}"/>`;
      for (let y = 96; y < 780; y += 32) s += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${P.c3}" stroke-width="1.2"/>`;
      s += `<line x1="62" y1="0" x2="62" y2="794" stroke="${P.c1}" stroke-width="2"/><line x1="67" y1="0" x2="67" y2="794" stroke="${P.c1}" stroke-width="1" opacity=".4"/>`;
      if (kind === 'cover') {
        for (let y = 60; y < 794; y += 90) s += `<circle cx="30" cy="${y}" r="9" fill="#E9E4D6"/><circle cx="30" cy="${y}" r="9" fill="none" stroke="#D5CFBE"/>`;
        s += mv(300, `<path d="M300 690l8 16 18 3-13 12 3 18-16-9-16 9 3-18-13-12 18-3z" fill="none" stroke="${P.c1}" stroke-width="2.4" opacity=".7"/>`);
      } else if (kind === 'flap' || kind === 'back') {
        s += `<path d="${sp('M110 730c20 10 40-10 60 0s40-10 60 0 40-10 60 0')}" stroke="${P.c1}" stroke-width="2.4" fill="none" opacity=".45"/>`;
      }
      return s;
    },
    health(kind, P) {
      let s = `<rect width="${W}" height="794" fill="${P.bg}"/>`;
      if (kind === 'cover') s += `
        <circle cx="${W - 14}" cy="60" r="232" fill="none" stroke="${P.c2}" stroke-width="10"/>
        <circle cx="${W - 14}" cy="60" r="200" fill="${P.c1}"/>
        <g transform="translate(${W - 88} 108)" fill="#fff" opacity=".9"><rect x="-12" y="-36" width="24" height="72" rx="6"/><rect x="-36" y="-12" width="72" height="24" rx="6"/></g>
        <circle cx="0" cy="770" r="160" fill="${P.c2}" opacity=".7"/><circle cx="64" cy="640" r="16" fill="${P.c3}"/>
        <circle cx="${W - 44}" cy="700" r="40" fill="${P.c1}" opacity=".12"/>`;
      else if (kind === 'back' || kind === 'flap') s += `
        <circle cx="${W}" cy="794" r="190" fill="${P.c1}" opacity=".14"/><circle cx="0" cy="0" r="110" fill="${P.c2}" opacity=".6"/>
        <circle cx="${W - 54}" cy="120" r="10" fill="${P.c3}"/>`;
      else s += `
        <circle cx="${W + 6}" cy="-10" r="100" fill="${P.c2}" opacity=".55"/><circle cx="-20" cy="810" r="120" fill="${P.c1}" opacity=".12"/>
        <circle cx="${W - 54}" cy="120" r="7" fill="${P.c3}"/>`;
      return s;
    },
    eco(kind, P) {
      let s = `<rect width="${W}" height="794" fill="${P.bg}"/>`;
      if (kind === 'cover') s += `
        <circle cx="${X(300)}" cy="520" r="62" fill="${P.c3}" opacity=".9"/>
        <path d="${sp('M0 590C80 548 150 580 222 548C292 518 342 548 374 532V794H0Z')}" fill="${P.c2}"/>
        <path d="${sp('M0 660C90 618 170 680 262 638C322 612 352 628 374 618V794H0Z')}" fill="${P.c1}"/>
        ${leaf(W - 44, 20, 120, 1.3, P.c2)}${leaf(W - 14, 70, 150, 1, P.c1)}${leaf(20, 30, 40, .9, P.c2)}`;
      else if (kind === 'back' || kind === 'flap') s += `
        <path d="${sp('M0 690C90 660 170 700 262 672C322 654 352 664 374 656V794H0Z')}" fill="${P.c2}"/>
        <path d="${sp('M0 734C100 708 180 750 280 720C330 706 356 712 374 708V794H0Z')}" fill="${P.c1}"/>
        ${leaf(W - 34, 30, 130, 1, P.c2)}`;
      else s += `
        ${leaf(W - 24, 18, 128, 1.1, P.c2)}${leaf(W - 2, 70, 160, .8, P.c1)}
        <path d="${sp('M0 754C100 734 180 766 280 742C330 730 356 736 374 732V794H0Z')}" fill="${P.c2}" opacity=".7"/>`;
      return s;
    },
    event(kind, P, seed) {
      const cols = [P.c1, P.c2, P.c3, P.c4];
      const r = rng(seed || 7);
      let s = `<rect width="${W}" height="794" fill="${P.bg}"/>`;
      const n = Math.round((kind === 'cover' ? 56 : 22) * Math.max(.7, f));
      for (let i = 0; i < n; i++) {
        const x = r() * W; let y = r() * 794;
        if (kind === 'cover') { if (y > 230 && y < 560) y = y < 395 ? y - 170 : y + 170; }
        else { y = r() < .5 ? r() * 60 : 740 + r() * 54; }
        const c = cols[Math.floor(r() * cols.length)];
        const t = r();
        if (t < .4) s += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${(6 + r() * 8).toFixed(0)}" height="${(12 + r() * 10).toFixed(0)}" rx="2" fill="${c}" transform="rotate(${(r() * 180).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`;
        else if (t < .75) s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(3 + r() * 6).toFixed(1)}" fill="${c}"/>`;
        else s += `<polygon points="${starPts(x, y, 9, 4, 5)}" fill="${c}"/>`;
      }
      if (kind === 'cover') s += `
        <path d="${sp('M-10 40C60 90 120 10 190 60S320 20 390 70')}" stroke="${P.c2}" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="${sp('M-10 740C60 700 130 770 200 730S320 760 390 720')}" stroke="${P.c1}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
      return s;
    },
    bts(kind, P) {
      let s = `<rect width="${W}" height="794" fill="${P.bg}"/>`;
      const ruler = (y, h) => {
        let r = `<rect x="0" y="${y}" width="${W}" height="${h}" fill="#fff"/><rect x="0" y="${y}" width="${W}" height="${h}" fill="${P.c1}" opacity=".18"/>`;
        for (let x = 8, i = 0; x < W; x += 12, i++) r += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + (i % 5 === 0 ? h * .6 : h * .32)}" stroke="${P.c2}" stroke-width="1.6"/>`;
        return r;
      };
      if (kind === 'cover') {
        s += `<rect width="${W}" height="480" fill="${P.c1}"/>`;
        for (let i = -10; i < 30 * Math.max(1, f); i++) s += `<line x1="${i * 26}" y1="480" x2="${i * 26 + 480}" y2="0" stroke="#fff" stroke-opacity=".12" stroke-width="7"/>`;
        s += `<g transform="translate(${(20 * s1 + (W - 374 * s1) / 2).toFixed(1)} 610) scale(${s1}) rotate(-10)">
            <rect x="40" y="0" width="230" height="34" fill="${P.c1}"/><rect x="40" y="0" width="230" height="11" fill="#fff" opacity=".35"/>
            <polygon points="270,0 318,17 270,34" fill="#F1C68A"/><polygon points="302,11 318,17 302,23" fill="${P.c2}"/>
            <rect x="18" y="0" width="22" height="34" fill="#B9C2CC"/><rect x="0" y="0" width="20" height="34" rx="6" fill="${P.c3}"/></g>
          ${ruler(744, 50)}`;
      } else if (kind === 'back' || kind === 'flap') {
        s += `${ruler(0, 34)}<circle cx="${W - 44}" cy="730" r="60" fill="${P.c1}" opacity=".25"/><circle cx="40" cy="700" r="14" fill="${P.c3}" opacity=".8"/>`;
      } else {
        s += `${ruler(0, 34)}<rect x="0" y="770" width="${W}" height="24" fill="${P.c1}"/>`;
      }
      return s;
    },
    corp(kind, P) {
      let s = `<rect width="${W}" height="794" fill="${P.bg}"/>`;
      if (kind === 'cover') {
        s += `<path d="${sp('M0 0H374V500L0 590Z')}" fill="${P.c1}"/><path d="${sp('M0 590L374 500V516L0 606Z')}" fill="${P.c2}"/>`;
        for (let i = 0; i < 9 * Math.max(1, f); i++) s += `<line x1="${-40 + i * 60}" y1="0" x2="${160 + i * 60}" y2="560" stroke="#fff" stroke-opacity=".05" stroke-width="18"/>`;
        for (let x = 0; x < 4; x++) for (let y = 0; y < 3; y++) s += `<rect x="${W - 104 + x * 22}" y="${700 + y * 22}" width="10" height="10" fill="${P.c1}" opacity=".12"/>`;
      } else if (kind === 'back') {
        s += `<rect width="${W}" height="126" fill="${P.c1}"/><rect y="126" width="${W}" height="6" fill="${P.c2}"/>
              <rect x="0" y="760" width="${W}" height="34" fill="${P.c3}"/>`;
      } else {
        s += `<rect x="0" y="0" width="14" height="794" fill="${P.c1}"/><rect x="0" y="60" width="14" height="70" fill="${P.c2}"/>
              <rect x="0" y="760" width="${W}" height="34" fill="${P.c3}"/>`;
      }
      return s;
    },
    hex(kind, P) {
      let s = `<rect width="${W}" height="794" fill="${P.bg}"/>`;
      const hx = (cx, cy, r, fill, op = 1, line) => line
        ? `<polygon points="${hexPts(cx, cy, r)}" fill="none" stroke="${fill}" stroke-width="3" opacity="${op}"/>`
        : `<polygon points="${hexPts(cx, cy, r)}" fill="${fill}" opacity="${op}"/>`;
      if (kind === 'cover') {
        const R = 40, w = R * Math.sqrt(3);
        const map = [[0,0,'c1'],[1,0,'c2'],[2,0,'l'],[3,0,'c1'],[4,0,'c2'],[0,1,'c2'],[1,1,'c1'],[2,1,'c3'],[3,1,'c2'],[4,1,'l'],[1,2,'l'],[2,2,'c1'],[3,2,'c2'],[4,2,'c1'],[2,3,'l'],[3,3,'c1'],[4,3,'c2'],[3,4,'c2']];
        map.forEach(([c, r, k]) => {
          const cx = 60 + c * w + (r % 2 ? w / 2 : 0), cy = 30 + r * R * 1.5;
          if (cx - R > W) return;
          s += k === 'l' ? hx(cx, cy, R - 4, P.c1, .5, true) : hx(cx, cy, R - 4, P[k], k === 'c2' ? .8 : 1);
        });
        s += hx(40, 760, 60, P.c2, .35) + hx(100, 790, 30, P.c1, .6, true);
      } else {
        s += hx(W - 24, 20, 60, P.c2, .6) + hx(W - 74, 70, 26, P.c1, .9) + hx(W - 18, 118, 22, P.c3, .9);
        s += hx(20, 770, 50, P.c1, .12) + hx(80, 780, 24, P.c1, .4, true);
      }
      return s;
    },
    promo(kind, P) {
      let s = '';
      if (kind === 'cover') {
        s += `<rect width="${W}" height="794" fill="${P.c1}"/>`;
        for (let i = 0; i < 24; i++) { const a = i * 15 * Math.PI / 180; s += `<line x1="${W / 2}" y1="397" x2="${(W / 2 + 900 * Math.cos(a)).toFixed(0)}" y2="${(397 + 900 * Math.sin(a)).toFixed(0)}" stroke="#fff" stroke-opacity=".06" stroke-width="30"/>`; }
        s += `<path d="${sp('M0 640L374 520V600L0 720Z')}" fill="${P.c2}"/><path d="${sp('M0 734L374 614V630L0 750Z')}" fill="${P.c3}"/>
              <path d="M0 0L150 0L0 90Z" fill="${P.c2}" opacity=".9"/>`;
        const r = rng(11);
        for (let i = 0; i < 26 * Math.max(.7, f); i++) s += `<circle cx="${(r() * W).toFixed(0)}" cy="${(r() * 794).toFixed(0)}" r="${(2 + r() * 4).toFixed(1)}" fill="#fff" opacity=".35"/>`;
      } else if (kind === 'flap') {
        s += `<rect width="${W}" height="794" fill="${P.c2}"/>`;
        for (let i = -4; i < W / 30 + 4; i++) s += `<path d="M${i * 30} 0l20 0l-60 60l-20 0z" fill="${P.c1}"/><path d="M${i * 30} 734l20 0l-60 60l-20 0z" fill="${P.c3}"/>`;
      } else {
        s += `<rect width="${W}" height="794" fill="${P.bg}"/><path d="M0 0H190L0 110Z" fill="${P.c1}"/><path d="M0 110L190 0H220L0 128Z" fill="${P.c2}"/>
              <path d="M${W} 794V700L${W - 104} 794Z" fill="${P.c2}"/>`;
        if (kind === 'back') s += `<rect y="760" width="${W}" height="34" fill="${P.c1}"/>`;
      }
      return s;
    },
    menu(kind, P) {
      const cx = W / 2;
      let s = `<rect width="${W}" height="794" fill="${P.bg}"/>
        <rect x="16" y="16" width="${W - 32}" height="762" fill="none" stroke="${P.c1}" stroke-width="1.6"/>
        <rect x="24" y="24" width="${W - 48}" height="746" fill="none" stroke="${P.c1}" stroke-width=".7" opacity=".6"/>`;
      [[16,16],[W - 16,16],[16,778],[W - 16,778]].forEach(([x, y]) => s += `<rect x="${x - 6}" y="${y - 6}" width="12" height="12" fill="${P.c1}" transform="rotate(45 ${x} ${y})"/>`);
      if (kind === 'cover') s += `
        <g fill="none" stroke="${P.c1}" stroke-width="1.4"><path d="M${cx - 87} 150H${cx - 27}M${cx + 27} 150H${cx + 87}"/><path d="M${cx - 87} 650H${cx - 27}M${cx + 27} 650H${cx + 87}"/></g>
        <polygon points="${starPts(cx, 150, 16, 6, 4)}" fill="${P.c1}"/><polygon points="${starPts(cx, 650, 16, 6, 4)}" fill="${P.c1}"/>
        <circle cx="${cx}" cy="150" r="26" fill="none" stroke="${P.c1}" stroke-width=".8" opacity=".6"/><circle cx="${cx}" cy="650" r="26" fill="none" stroke="${P.c1}" stroke-width=".8" opacity=".6"/>`;
      else s += `<polygon points="${starPts(cx, 740, 10, 4, 4)}" fill="${P.c1}" opacity=".8"/><path d="M${cx - 57} 740H${cx - 17}M${cx + 17} 740H${cx + 57}" stroke="${P.c1}" stroke-width="1"/>`;
      return s;
    },
    conf(kind, P, seed) {
      const id = 'g' + (++uid);
      const net = (x0, y0, w, h, n, col, op, sd) => {
        const r = rng(sd); const pts = [];
        for (let i = 0; i < n; i++) pts.push([x0 + r() * w, y0 + r() * h]);
        let o = '';
        pts.forEach((a, i) => pts.slice(i + 1).forEach(b => { const d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (d < 110) o += `<line x1="${a[0].toFixed(0)}" y1="${a[1].toFixed(0)}" x2="${b[0].toFixed(0)}" y2="${b[1].toFixed(0)}" stroke="${col}" stroke-opacity="${op}" stroke-width="1.2"/>`; }));
        pts.forEach((a, i) => o += `<circle cx="${a[0].toFixed(0)}" cy="${a[1].toFixed(0)}" r="${i % 5 === 0 ? 5 : 2.6}" fill="${i % 7 === 0 ? P.c3 : col}" opacity="${i % 5 === 0 ? 1 : .8}"/>`);
        return o;
      };
      const grad = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${P.c1}"/><stop offset="1" stop-color="${shade(P.c1, -.55)}"/></linearGradient></defs>`;
      if (kind === 'cover') return `${grad}<rect width="${W}" height="794" fill="url(#${id})"/>${net(0, 360, W, 440, Math.round(34 * f), P.c2, .35, 5)}
        <circle cx="${W - 44}" cy="70" r="120" fill="${P.c2}" opacity=".10"/>`;
      if (kind === 'back') return `${grad}<rect width="${W}" height="794" fill="${P.bg}"/><rect y="640" width="${W}" height="154" fill="url(#${id})"/>${net(0, 650, W, 140, Math.round(16 * f), P.c2, .35, 9)}`;
      return `<rect width="${W}" height="794" fill="${P.bg}"/>${net(W - 174, 0, 174, 150, 14, P.c1, .22, (seed || 3) + 2)}`;
    },
    ram(kind, P, seed) {
      const r = rng(seed || 21);
      const cx = W / 2;
      const lantern = (x, len, sc) => `<line x1="${x}" y1="0" x2="${x}" y2="${len}" stroke="${P.c1}" stroke-width="1.2"/>
        <g transform="translate(${x} ${len}) scale(${sc})" fill="${P.c1}">
          <path d="M-10 0H10L14 8H-14Z"/><path d="M-16 8H16L20 48L0 64L-20 48Z" fill-opacity=".92"/>
          <path d="M-9 16H9L11 44L0 54L-11 44Z" fill="${P.c2}" fill-opacity=".55"/><circle cx="0" cy="70" r="4"/></g>`;
      const stars = (n, y0, y1, col) => { let o = ''; for (let i = 0; i < n; i++) o += `<circle cx="${(r() * W).toFixed(0)}" cy="${(y0 + r() * (y1 - y0)).toFixed(0)}" r="${(0.8 + r() * 1.8).toFixed(1)}" fill="${col}" opacity="${(.5 + r() * .5).toFixed(2)}"/>`; return o; };
      if (kind === 'cover') {
        const g = 'g' + (++uid), m = 'm' + uid;
        return `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.c2}"/><stop offset="1" stop-color="${P.c3}"/></linearGradient>
          <mask id="${m}"><rect width="${W}" height="794" fill="#fff"/><circle cx="${cx + 22}" cy="118" r="50" fill="#000"/></mask></defs>
          <rect width="${W}" height="794" fill="url(#${g})"/>${stars(Math.round(60 * f), 0, 620, '#fff')}
          <circle cx="${cx}" cy="130" r="56" fill="${P.c1}" mask="url(#${m})"/>
          <polygon points="${starPts(cx + 63, 90, 9, 3.5, 5)}" fill="${P.c1}"/>
          ${lantern(X(56), 150, 1)}${lantern(X(318), 110, .85)}
          <path d="${sp('M0 794V720H40V700C40 680 60 668 70 660C80 668 100 680 100 700V720H140V690C140 650 187 620 187 620C187 620 234 650 234 690V720H274V700C274 680 294 668 304 660C314 668 334 680 334 700V720H374V794Z')}" fill="${shade(P.c2, -.35)}" opacity=".9"/>
          <rect x="${cx - 4}" y="592" width="8" height="28" fill="${shade(P.c2, -.35)}"/>`;
      }
      if (kind === 'back') return `<rect width="${W}" height="794" fill="${P.bg}"/><rect y="640" width="${W}" height="154" fill="${P.c2}"/>${stars(Math.round(24 * f), 650, 790, P.c1)}
        <polygon points="${starPts(cx, 20, 30, 12, 8)}" fill="${P.c1}" opacity=".25"/>`;
      return `<rect width="${W}" height="794" fill="${P.bg}"/>${lantern(40, 60, .7)}${lantern(W - 40, 40, .6)}
        <polygon points="${starPts(cx, 794, 120, 56, 8)}" fill="${P.c1}" opacity=".10"/>
        <polygon points="${starPts(cx, 794, 70, 34, 8)}" fill="none" stroke="${P.c1}" stroke-opacity=".35" stroke-width="1.5"/>`;
    }
  };
}
const decoCache = {};
const decoFor = W => decoCache[W] || (decoCache[W] = mkDeco(W));

/* ---------------------------------------------------------
   Panel & sheet rendering
--------------------------------------------------------- */
const ICONS = {
  phone:'<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
  email:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  addr:'<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  web:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg>'
};
const paras = txt => String(txt || '').split(/\n+/).filter(x => x.trim()).map(p => `<p>${esc(p)}</p>`).join('');
function listHTML(txt) {
  const items = String(txt || '').split(/\n+/).map(x => x.trim()).filter(Boolean);
  return `<ul class="lst">${items.map(it => {
    const i = it.indexOf('|');
    if (i > -1) return `<li class="priced"><span class="nm">${esc(it.slice(0, i).trim())}</span><span class="dots"></span><span class="pr">${esc(it.slice(i + 1).trim())}</span></li>`;
    return `<li>${esc(it)}</li>`;
  }).join('')}</ul>`;
}
const imgTag = (src, cls = 'img') => src ? `<div class="${cls}"><img src="${src}" alt=""></div>` : '';

const KIND_CLASS = { cover:'cv', flap:'fl', p1:'in', p2:'in', p3:'in', p4:'in', p5:'in', back:'bk' };
const KIND_SEED = { cover:3, flap:5, p1:7, p2:11, p3:13, p4:19, p5:23, back:17 };

function ctxFor(tplId, content, imgs, opts = {}) {
  const t = TPL[tplId];
  const P = palette(t, opts.color);
  const font = (opts.font && opts.font !== 'auto') ? opts.font : t.font;
  const F = FORMATS[opts.fmt] || FORMATS.tri;
  return { t, P, font, F, c: content, img: imgs || {}, rtl: (opts.clang || 'ar') === 'ar', lang: opts.clang || 'ar', qr: opts.qr };
}

function panelHTML(kind, ctx) {
  const { t, P, c, img, F } = ctx;
  const W = F.pw;
  const cls = `pn T-${t.id} ${KIND_CLASS[kind]} F-${F.type}`;
  const decoKind = /^p\d$/.test(kind) ? 'inner' : kind;
  let svg = decoFor(W)[t.id](decoKind, P, KIND_SEED[kind]);
  if (t.mirror && ctx.rtl) svg = `<g transform="translate(${W} 0) scale(-1 1)">${svg}</g>`;
  const style = `--pw:${W}px;--c1:${P.c1};--c2:${P.c2};--c3:${P.c3};--c4:${P.c4};--bg-p:${P.bg};--ink-p:${P.ink};--f:'${ctx.font}','Tajawal',sans-serif;`;
  let body = '';
  const v = k => c[k] || '';
  if (kind === 'cover') {
    body = `${v('cover.badge') ? `<div class="badge">${esc(v('cover.badge'))}</div>` : ''}
      ${img.logo ? `<div class="logo"><img src="${img.logo}" alt=""></div>` : ''}
      ${imgTag(img.cover)}
      <div class="cv-text">${v('cover.title') ? `<h1>${esc(v('cover.title'))}</h1>` : ''}${v('cover.sub') ? `<p class="sub">${esc(v('cover.sub'))}</p>` : ''}</div>
      ${v('cover.org') ? `<div class="org">${esc(v('cover.org'))}</div>` : ''}`;
  } else if (kind === 'p3') {
    body = `${v('p3.title') ? `<h2>${esc(v('p3.title'))}</h2>` : ''}${listHTML(v('p3.list'))}`;
  } else if (kind === 'back') {
    const rows = ['phone', 'email', 'addr', 'web'].filter(k => v(k)).map(k => `<div class="ci"><i>${ICONS[k]}</i><span>${esc(v(k))}</span></div>`).join('');
    const foot = (ctx.qr ? `<div class="qr"><img src="${ctx.qr}" alt=""></div>` : '') +
      ((img.logo || v('cover.org')) ? `<div>${img.logo ? `<div class="bk-logo"><img src="${img.logo}" alt=""></div>` : ''}${v('cover.org') ? `<div class="bk-org">${esc(v('cover.org'))}</div>` : ''}</div>` : '');
    body = `${v('back.title') ? `<h2>${esc(v('back.title'))}</h2>` : ''}<div class="txt">${paras(v('back.text'))}</div>
      ${rows ? `<div class="contacts">${rows}</div>` : ''}${foot ? `<div class="bk-foot">${foot}</div>` : ''}`;
  } else {
    const k = kind;
    body = `${v(k + '.title') ? `<h2>${esc(v(k + '.title'))}</h2>` : ''}${imgTag(img[k])}<div class="txt">${paras(v(k + '.text'))}</div>`;
  }
  return `<div class="${cls}" data-kind="${kind}" style="${style}"><div class="deco"><svg viewBox="0 0 ${W} 794" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">${svg}</svg></div><div class="ct">${body}</div></div>`;
}

function sheetHTML(side, ctx) {
  const F = ctx.F;
  return `<div class="sheet" style="width:${F.sw}px" dir="${ctx.rtl ? 'rtl' : 'ltr'}" lang="${ctx.lang}">${F[side].map(k => panelHTML(k, ctx)).join('')}</div>`;
}
/* thumbnail: outside sheet, or both faces side by side for A5 */
function miniHTML(ctx) {
  if (ctx.F.type === 'a5') return `<div class="mini" style="display:flex;width:${ctx.F.sw * 2}px">${sheetHTML('out', ctx)}${sheetHTML('in', ctx)}</div>`;
  return `<div class="mini">${sheetHTML('out', ctx)}</div>`;
}
const miniWidth = ctx => ctx.F.type === 'a5' ? ctx.F.sw * 2 : ctx.F.sw;

function fitPanel(pn, fixedK, k0 = 1) {
  if (fixedK) { pn.style.setProperty('--k', fixedK); return +fixedK; }
  const ct = pn.querySelector('.ct');
  let k = k0;
  pn.style.setProperty('--k', k.toFixed(2));
  while (ct.scrollHeight > ct.clientHeight + 1 && k > 0.45) { k -= 0.04; pn.style.setProperty('--k', k.toFixed(2)); }
  return +k.toFixed(2);
}
const k0Of = pn => { const m = /F-(\w+)/.exec(pn.className); return (FORMATS[m && m[1]] || FORMATS.tri).k0; };
function fitAll(root, useMap) {
  if (!useMap) kmap = {};
  $$('.pn', root).forEach(pn => {
    const kind = pn.dataset.kind;
    const k = fitPanel(pn, useMap ? kmap[kind] : null, k0Of(pn));
    if (!useMap) kmap[kind] = k;
  });
}
function fitThumbs(root) { $$('.pn', root).forEach(pn => fitPanel(pn, null, k0Of(pn))); }

/* ---------------------------------------------------------
   QR
--------------------------------------------------------- */
let qrCache = { text:'', url:'' };
function qrData() {
  if (!st.qr || !st.c.web || typeof QRCode === 'undefined') return '';
  let text = st.c.web.trim();
  if (!/^https?:\/\//i.test(text)) text = 'https://' + text;
  if (qrCache.text === text) return qrCache.url;
  const box = document.createElement('div');
  try {
    new QRCode(box, { text, width: 256, height: 256, correctLevel: QRCode.CorrectLevel.M });
    const cv = box.querySelector('canvas');
    qrCache = { text, url: cv ? cv.toDataURL('image/png') : '' };
  } catch (e) { qrCache = { text, url:'' }; }
  return qrCache.url;
}

function currentCtx() {
  return ctxFor(st.tpl, st.c, st.img, { color: st.color, font: st.font, clang: st.clang, qr: qrData(), fmt: st.fmt });
}

/* ---------------------------------------------------------
   Flat view
--------------------------------------------------------- */
const holderOut = $('#holderOut'), holderIn = $('#holderIn');
function renderFlat() {
  const ctx = currentCtx(), F = ctx.F;
  const n = F.out.length;
  let lines = '';
  for (let i = 1; i < n; i++) lines += `<span class="fold-line" style="left:${F.pw * i}px"></span>`;
  holderOut.innerHTML = sheetHTML('out', ctx);
  holderIn.innerHTML = sheetHTML('in', ctx);
  $$('.sheet', holderOut).concat($$('.sheet', holderIn)).forEach(sh => sh.insertAdjacentHTML('beforeend', lines));
  const capOut = F.type === 'tri' || F.type === 'bi' ? 'outside' : 'side_front';
  const capIn = F.type === 'tri' || F.type === 'bi' ? 'inside' : 'side_back';
  $('#capOut').textContent = T(capOut); $('#capIn').textContent = T(capIn);
  $('#flatView').classList.toggle('side', F.type === 'a5');
  fitAll(holderOut);
  $$('.pn', holderIn).forEach(pn => { const k = fitPanel(pn, null, k0Of(pn)); kmap[pn.dataset.kind] = k; });
  applyZoom();
  highlight();
}
function stageFitScale() {
  const stage = $('#stage'), F = fmtNow();
  const a5 = F.type === 'a5';
  const w = (stage.clientWidth - 60) / (a5 ? 2.08 : 1), h = stage.clientHeight - 150;
  return Math.max(0.2, Math.min(w / F.sw, h / PH, 1.4));
}
function applyZoom() {
  const s = zoom === 'fit' ? stageFitScale() : zoom;
  const F = fmtNow();
  [holderOut, holderIn].forEach(h => {
    h.style.width = (F.sw * s) + 'px'; h.style.height = (PH * s) + 'px';
    const sh = h.querySelector('.sheet'); if (sh) sh.style.transform = `scale(${s})`;
  });
  $('#zoomVal').textContent = Math.round(s * 100) + '%';
}
function setZoom(dir) {
  let s = zoom === 'fit' ? stageFitScale() : zoom;
  s = Math.round((s + dir * 0.1) * 10) / 10;
  zoom = Math.max(0.2, Math.min(2, s));
  applyZoom();
}
function highlight() {
  $$('.sheet-holder .pn').forEach(p => {
    const on = !!openSec && p.dataset.kind === openSec;
    p.classList.toggle('hl', on);
    if (on) p.style.setProperty('--hl', SEC_COLORS[openSec]);
  });
}

/* ---------------------------------------------------------
   3D view — tri-fold, bi-fold, Z (accordion) and single leaf
--------------------------------------------------------- */
const rig = $('#rig'), scene = $('#scene');
let foldInfo = { cx: 561 };
function render3d() {
  const ctx = currentCtx(), F = ctx.F, pw = F.pw, n = F.in.length;
  const faceSide = F[F.face3d], other = F[F.face3d === 'in' ? 'out' : 'in'];
  const vis = arr => ctx.rtl ? [...arr].reverse() : arr;
  const fv = vis(faceSide), ov = vis(other);
  const backOf = i => ov[n - 1 - i];
  const face = (k, cls) => `<div class="face ${cls}">${panelHTML(k, ctx)}</div>`;
  rig.style.width = F.sw + 'px'; $('#rigScale').style.width = F.sw + 'px';
  if (F.type === 'z') {
    const start = fv[0] === 'cover' ? 0 : n - 1, d = start === 0 ? 1 : -1;
    const build = (i, depth) => {
      if (i < 0 || i >= n) return '';
      const pos = depth === 0 ? `left:${i * pw}px;` : `left:${d > 0 ? pw : -pw}px;`;
      const origin = depth === 0 ? '' : (d > 0 ? 'transform-origin:0 50%;' : 'transform-origin:100% 50%;');
      return `<div class="zp" data-depth="${depth}" data-d="${d}" style="width:${pw}px;${pos}${origin}">${face(fv[i], 'front')}${face(backOf(i), 'back')}${build(i + d, depth + 1)}</div>`;
    };
    rig.innerHTML = build(start, 0);
    foldInfo = { cx: start * pw + pw / 2 };
  } else if (n === 1) {
    rig.innerHTML = `<div class="zp" data-depth="0" style="width:${pw}px;left:0">${face(fv[0], 'front')}${face(backOf(0), 'back')}</div>`;
    foldInfo = { cx: pw / 2 };
  } else {
    const coverIdx = [...Array(n).keys()].find(i => backOf(i) === 'cover');
    const base = F.type === 'tri' ? 1 : 1 - coverIdx;
    rig.innerHTML = fv.map((k, i) => {
      const role = i === base ? 'base' : (i === coverIdx ? 'coverw' : 'first');
      const side = i < base ? 'L' : (i > base ? 'R' : '');
      const origin = side === 'L' ? 'transform-origin:100% 50%;' : side === 'R' ? 'transform-origin:0 50%;' : '';
      return `<div class="zp ${role}" data-side="${side}" style="width:${pw}px;left:${i * pw}px;${origin}">${face(k, 'front')}${face(backOf(i), 'back')}</div>`;
    }).join('');
    foldInfo = { cx: base * pw + pw / 2 };
  }
  $('#btnFold').classList.toggle('hidden', F.type === 'a5');
  fitAll(rig, true);
  applyFold(false);
  apply3dScale();
  applyRot();
}
function applyFold(animate = true) {
  const F = fmtNow();
  const els = $$('.zp', rig);
  if (!els.length) return;
  if (!animate) els.forEach(e => e.style.transition = 'none');
  if (F.type === 'z') {
    els.forEach(e => {
      const dep = +e.dataset.depth; if (!dep) { e.style.transform = ''; return; }
      const b = 180 * (+e.dataset.d);
      const odd = dep % 2 === 1;
      if (folded) e.style.transform = `translateZ(${odd ? -1 : 1}px) rotateY(${odd ? b : -b}deg)`;
      else e.style.transform = `rotateY(${(odd ? b : -b) * 0.13}deg)`;
    });
  } else if (F.type !== 'a5') {
    const open = F.type === 'tri' ? 14 : 18;
    els.forEach(e => {
      const sd = e.dataset.side; if (!sd) { e.style.transform = ''; return; }
      const z = e.classList.contains('coverw') ? 2 : 1;
      if (folded) e.style.transform = `translateZ(${z}px) rotateY(${sd === 'L' ? 180 : -180}deg)`;
      else e.style.transform = `rotateY(${sd === 'L' ? open : -open}deg)`;
    });
  }
  rig.classList.toggle('folded', folded);
  if (!animate) { void rig.offsetWidth; els.forEach(e => e.style.transition = ''); }
  $('#btnFold span').textContent = folded ? T('unfold') : T('fold');
  applyRot();
}
function apply3dScale() {
  const F = fmtNow();
  const w = scene.clientWidth, h = scene.clientHeight;
  const s = Math.max(0.2, Math.min(w / (F.sw * 1.39), h / 1080, 1.1));
  $('#rigScale').style.transform = `scale(${s})`;
}
function applyRot() {
  const F = fmtNow();
  const cx = (folded || F.type === 'a5') ? foldInfo.cx : F.sw / 2;
  rig.style.transformOrigin = `${cx}px 50%`;
  rig.style.transform = `translateX(${(F.sw / 2 - cx).toFixed(1)}px) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`;
}

(function initDrag() {
  let drag = null;
  scene.addEventListener('pointerdown', e => {
    drag = { x: e.clientX, y: e.clientY, rx: rot.x, ry: rot.y };
    scene.classList.add('drag'); scene.setPointerCapture(e.pointerId);
  });
  scene.addEventListener('pointermove', e => {
    if (!drag) return;
    rot.y = drag.ry + (e.clientX - drag.x) * 0.4;
    rot.x = Math.max(-60, Math.min(60, drag.rx - (e.clientY - drag.y) * 0.3));
    applyRot();
  });
  const end = () => { drag = null; scene.classList.remove('drag'); };
  scene.addEventListener('pointerup', end);
  scene.addEventListener('pointercancel', end);
})();

function setView(v) {
  view = v;
  $$('#viewSeg button').forEach(b => b.classList.toggle('on', b.dataset.view === v));
  $('#flatView').classList.toggle('hidden', v !== 'flat');
  $('#view3d').classList.toggle('hidden', v !== '3d');
  $('#zoomCtl').classList.toggle('hidden', v !== 'flat');
  $('#ctl3d').classList.toggle('hidden', v !== '3d');
  if (v === '3d') render3d();
}

/* ---------------------------------------------------------
   Rendering orchestration
--------------------------------------------------------- */
let renderTimer = null;
function scheduleRender() {
  clearTimeout(renderTimer);
  renderTimer = setTimeout(renderAll, 120);
}
function renderAll() {
  renderFlat();
  if (view === '3d') render3d();
  renderCurrentThumb();
  updateStates();
  autosave();
}

/* ---------------------------------------------------------
   Accordion (sidebar)
--------------------------------------------------------- */
const SEC_ICONS = {
  style:'<svg viewBox="0 0 24 24"><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4A5.6 5.6 0 0 0 22 10c0-4.4-4.5-8-10-8z"/></svg>',
  cover:'<svg viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="18" rx="1.5"/><path d="M9 8h6M9 11h6"/></svg>',
  flap:'<svg viewBox="0 0 24 24"><path d="M4 5h7v14H4zM11 5l9 2v14l-9-2"/></svg>',
  p1:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M9 4v16M15 4v16"/><rect x="4.5" y="6" width="3" height="12" fill="currentColor" stroke="none"/></svg>',
  p2:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M9 4v16M15 4v16"/><rect x="10.5" y="6" width="3" height="12" fill="currentColor" stroke="none"/></svg>',
  p3:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M9 4v16M15 4v16"/><rect x="16.5" y="6" width="3" height="12" fill="currentColor" stroke="none"/></svg>',
  back:'<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>'
};
const SEC_COLORS = { style:'#64748B', cover:'#16A34A', flap:'#0891B2', p1:'#7C3AED', p2:'#D97706', p3:'#2563EB', p4:'#0D9488', p5:'#9333EA', back:'#DB2777' };
const SECTION_DEFS = [
  { id:'cover', fields:[['cover.title','text','f_title'],['cover.sub','area','f_sub'],['cover.org','text','f_org'],['cover.badge','text','f_badge','f_badge_h'],['logo','img','f_logo'],['cover','img','f_cimg']] },
  { id:'flap', fields:[['flap.title','text','f_head'],['flap.text','area','f_text']] },
  { id:'p1', fields:[['p1.title','text','f_head'],['p1.text','area','f_text'],['p1','img','f_img']] },
  { id:'p2', fields:[['p2.title','text','f_head'],['p2.text','area','f_text'],['p2','img','f_img']] },
  { id:'p3', fields:[['p3.title','text','f_head'],['p3.list','area','f_list','f_list_h']] },
  { id:'p4', fields:[['p4.title','text','f_head'],['p4.text','area','f_text'],['p4','img','f_img']] },
  { id:'p5', fields:[['p5.title','text','f_head'],['p5.text','area','f_text'],['p5','img','f_img']] },
  { id:'back', fields:[['back.title','text','f_head'],['back.text','area','f_text'],['phone','text','f_phone'],['email','text','f_email'],['addr','text','f_addr'],['web','text','f_web'],['qr','toggle','f_qr']] }
];
const SEC_BY_ID = Object.fromEntries(SECTION_DEFS.map(x => [x.id, x]));
function curSections() { return [{ id:'style' }, ...fmtNow().order.map(id => SEC_BY_ID[id])]; }
function secTitle(id) {
  if (!/^p\d$/.test(id)) return T('sec_' + id);
  const idx = fmtNow().order.filter(k => /^p\d$/.test(k)).indexOf(id) + 1;
  return T('sec_inner') + ' ' + idx;
}
function secDesc(id) {
  if (id === 'p3') return T('sec_p3_d');
  if (/^p\d$/.test(id)) return T('sec_inner_d');
  return T('sec_' + id + '_d');
}
const CHEV = '<svg class="acc-chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>';
const PLUS_IMG = '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/></svg>';
const XICON = '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>';
const NEXT = '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>';

const FOLD_ICONS = {
  tri:'<svg viewBox="0 0 24 24"><path d="M3 6l6-2v16l-6 2zM9 4l6 2v16l-6-2zM15 6l6-2v16l-6 2z"/></svg>',
  bi:'<svg viewBox="0 0 24 24"><path d="M3 5l9 2v14l-9-2zM12 7l9-2v14l-9 2z"/></svg>',
  z:'<svg viewBox="0 0 24 24"><path d="M2 6l5-2v16l-5 2zM7 4l5 2v16l-5-2zM12 6l5-2v16l-5 2zM17 4l5 2v16l-5-2z"/></svg>',
  a5:'<svg viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="18" rx="1.5"/><path d="M9 8h6M9 11h6M9 14h4"/></svg>'
};
function setFormat(k) {
  if (!FORMATS[k] || st.fmt === k) return;
  st.fmt = k;
  if (openSec && openSec !== 'style' && !fmtNow().order.includes(openSec)) openSec = null;
  folded = false;
  rebuildKeepOpen(); renderAll();
  if (view === '3d') render3d();
}
function styleSectionHTML() {
  const t = TPL[st.tpl];
  const sw = COLORS.map(c => `<button type="button" class="sw ${st.color === c ? 'on' : ''}" data-color="${c}" style="background:${c}" aria-label="${c}"></button>`).join('');
  const custom = st.color && !COLORS.includes(st.color) ? st.color : '#888888';
  return `
    <div class="field"><label>${T('fold_type')}</label>
      <div class="seg-ui fold-seg" id="fmtSeg">${FMT_KEYS.map(k => `<button type="button" data-fmt="${k}" class="${st.fmt === k ? 'on' : ''}">${FOLD_ICONS[k]}<span>${T(FORMATS[k].label)}</span></button>`).join('')}</div></div>
    <div class="field"><label>${T('color')}</label>
      <div class="swatches">
        <button type="button" class="sw auto ${!st.color ? 'on' : ''}" data-color="" style="--c-a:${t.pal.c1};--c-b:${t.pal.c2}" aria-label="auto"></button>
        ${sw}
        <label class="sw custom ${st.color && !COLORS.includes(st.color) ? 'on' : ''}"><input type="color" id="colorCustom" value="${custom}"></label>
      </div></div>
    <div class="field"><label>${T('font')}</label>
      <select id="fontSel"><option value="auto">${T('font_auto')} (${t.font})</option>${FONTS.map(f => `<option value="${f}" ${st.font === f ? 'selected' : ''} style="font-family:'${f}'">${f}</option>`).join('')}</select></div>
    <div class="field"><label>${T('blang')}</label>
      <div class="seg-ui" id="clangSeg">${['ar', 'fr', 'en'].map(l => `<button type="button" data-l="${l}" class="${st.clang === l ? 'on' : ''}">${{ar:'العربية', fr:'Français', en:'English'}[l]}</button>`).join('')}</div></div>
    <button type="button" class="chip" id="resetTxt" style="align-self:flex-start">${T('reset_txt')}</button>`;
}

function fieldHTML([key, type, label, hint]) {
  if (type === 'img') {
    const src = st.img[key];
    return `<div class="field"><label>${T(label)}</label><div class="img-field">
      <label class="img-drop">${PLUS_IMG}<span>${T('add_img')}</span><input type="file" accept="image/*" hidden data-img="${key}"></label>
      ${src ? `<div class="img-prev"><img src="${src}" alt=""><button type="button" data-rmimg="${key}">${XICON}</button></div>` : ''}</div></div>`;
  }
  if (type === 'toggle') {
    return `<label class="switch"><span>${T(label)}</span><input type="checkbox" data-toggle="${key}" ${st[key] ? 'checked' : ''}><i></i></label>`;
  }
  const val = esc(st.c[key] || '');
  const dirAttr = ['phone', 'email', 'web'].includes(key) ? ' dir="ltr"' : ` dir="${st.clang === 'ar' ? 'rtl' : 'ltr'}"`;
  const input = type === 'area'
    ? `<textarea data-key="${key}"${dirAttr}>${val}</textarea>`
    : `<input type="text" data-key="${key}" value="${val}"${dirAttr}>`;
  return `<div class="field"><label>${T(label)}</label>${input}${hint ? `<div class="hint">${T(hint)}</div>` : ''}</div>`;
}

function buildAccordion() {
  const acc = $('#accordion');
  const SECS = curSections();
  acc.innerHTML = SECS.map((sec, i) => {
    const content = sec.id === 'style' ? styleSectionHTML() : sec.fields.map(fieldHTML).join('');
    const last = i === SECS.length - 1;
    const badge = sec.id === 'style' ? `<span class="acc-ico">${SEC_ICONS.style}</span>` : `<span class="acc-num">${i}</span>`;
    return `<section class="acc ${openSec === sec.id ? 'open' : ''}" data-sec="${sec.id}" style="--sc:${SEC_COLORS[sec.id]}">
      <button type="button" class="acc-head">${badge}
        <span class="acc-title"><b>${secTitle(sec.id)}</b><small>${esc(secSummary(sec))}</small></span>${CHEV}</button>
      <div class="acc-body"><div class="acc-inner"><div class="acc-content">${content}
        <button type="button" class="acc-next" data-next="${i}">${last ? T('done') : T('next')}${last ? '' : NEXT}</button>
      </div></div></div></section>`;
  }).join('');
  updateStates();
}

function toggleSec(id, force) {
  openSec = (force === undefined ? openSec !== id : force) ? id : null;
  $$('.acc').forEach(a => a.classList.toggle('open', a.dataset.sec === openSec));
  highlight();
}

function secSummary(sec) {
  const cut = x => { x = String(x || '').replace(/\s+/g, ' ').trim(); return x.length > 46 ? x.slice(0, 44) + '…' : x; };
  if (sec.id === 'style') {
    const t = TPL[st.tpl];
    return [t.name[uiLang] || t.name.ar, T(fmtNow().label), {ar:'العربية', fr:'Français', en:'English'}[st.clang]].join(' · ');
  }
  const parts = sec.fields.filter(f => f[1] === 'text' || f[1] === 'area').map(f => st.c[f[0]]).filter(v => (v || '').trim());
  return parts.length ? cut(parts.slice(0, 2).join(' · ')) : secDesc(sec.id);
}
function updateStates() {
  curSections().forEach(sec => {
    const el = $(`.acc[data-sec="${sec.id}"] .acc-title small`);
    if (el) el.textContent = secSummary(sec);
  });
}

/* events: sidebar */
$('#accordion').addEventListener('click', e => {
  const head = e.target.closest('.acc-head');
  if (head) { toggleSec(head.closest('.acc').dataset.sec); return; }
  const nx = e.target.closest('[data-next]');
  if (nx) {
    const i = +nx.dataset.next;
    const nextSec = curSections()[i + 1];
    toggleSec(nextSec ? nextSec.id : null, !!nextSec);
    if (nextSec) setTimeout(() => $(`.acc[data-sec="${nextSec.id}"]`).scrollIntoView({ behavior:'smooth', block:'nearest' }), 280);
    return;
  }
  const sw = e.target.closest('.sw[data-color]');
  if (sw) { st.color = sw.dataset.color || null; refreshStyleSection(); scheduleRender(); return; }
  const fb = e.target.closest('#fmtSeg [data-fmt]');
  if (fb) { setFormat(fb.dataset.fmt); return; }
  const cl = e.target.closest('#clangSeg button');
  if (cl) {
    const l = cl.dataset.l;
    if (l !== st.clang) {
      st.clang = l;
      if (!st.dirty) st.c = sampleFor(st.tpl, l);
      rebuildKeepOpen(); scheduleRender();
    }
    return;
  }
  if (e.target.closest('#resetTxt')) {
    const keep = { phone: st.c.phone, email: st.c.email, addr: st.c.addr, web: st.c.web };
    st.c = { ...sampleFor(st.tpl, st.clang), ...(st.dirty ? keep : {}) };
    st.dirty = false;
    rebuildKeepOpen(); scheduleRender(); toast(T('t_reset'));
    return;
  }
  const rm = e.target.closest('[data-rmimg]');
  if (rm) { e.preventDefault(); delete st.img[rm.dataset.rmimg]; rebuildKeepOpen(); scheduleRender(); }
});
$('#accordion').addEventListener('input', e => {
  const k = e.target.dataset.key;
  if (k) { st.c[k] = e.target.value; st.dirty = true; scheduleRender(); return; }
  if (e.target.id === 'colorCustom') { st.color = e.target.value; scheduleRender(); }
});
$('#accordion').addEventListener('change', e => {
  if (e.target.id === 'fontSel') { st.font = e.target.value; scheduleRender(); return; }
  if (e.target.id === 'colorCustom') { refreshStyleSection(); return; }
  const tg = e.target.dataset.toggle;
  if (tg) { st[tg] = e.target.checked; scheduleRender(); return; }
  const ik = e.target.dataset.img;
  if (ik && e.target.files && e.target.files[0]) {
    readImage(e.target.files[0], ik === 'logo').then(url => { st.img[ik] = url; rebuildKeepOpen(); scheduleRender(); });
  }
});
function refreshStyleSection() {
  const box = $('.acc[data-sec="style"] .acc-content');
  if (!box) return;
  const btn = box.querySelector('.acc-next').outerHTML;
  box.innerHTML = styleSectionHTML() + btn;
}
function rebuildKeepOpen() {
  const scroll = $('#panel').scrollTop;
  buildAccordion();
  $('#panel').scrollTop = scroll;
}

function readImage(file, keepPng) {
  return new Promise(res => {
    const fr = new FileReader();
    fr.onload = () => {
      const im = new Image();
      im.onload = () => {
        const max = keepPng ? 500 : 1400;
        const sc = Math.min(1, max / Math.max(im.width, im.height));
        const cv = document.createElement('canvas');
        cv.width = Math.round(im.width * sc); cv.height = Math.round(im.height * sc);
        cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
        res(keepPng ? cv.toDataURL('image/png') : cv.toDataURL('image/jpeg', 0.86));
      };
      im.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}

/* clicking a panel in the preview opens its section */
$('#flatView').addEventListener('click', e => {
  const pn = e.target.closest('.pn');
  if (!pn) return;
  const k = pn.dataset.kind;
  if ($('#workspace').classList.contains('collapsed')) $('#workspace').classList.remove('collapsed');
  toggleSec(k, true);
  setTimeout(() => { const a = $(`.acc[data-sec="${k}"]`); a && a.scrollIntoView({ behavior:'smooth', block:'nearest' }); }, 280);
});

/* ---------------------------------------------------------
   Gallery
--------------------------------------------------------- */
let gCat = 'all', gFold = null;
function miniOutside(tplId) {
  const useUser = st.dirty;
  const lang = st.clang;
  const content = useUser ? st.c : sampleFor(tplId, lang);
  const imgs = useUser ? st.img : {};
  const color = tplId === st.tpl ? st.color : null;
  const ctx = ctxFor(tplId, content, imgs, { color, font: tplId === st.tpl ? st.font : 'auto', clang: lang, qr: useUser ? qrData() : '', fmt: gFold || st.fmt });
  return miniHTML(ctx);
}
function buildGallery() {
  $('#gCats').innerHTML = ['all', ...CATS].map(c => `<button type="button" class="chip ${gCat === c ? 'on' : ''}" data-cat="${c}">${T('cat_' + c)}</button>`).join('');
  if (!gFold) gFold = st.fmt;
  $('#gFolds').innerHTML = FMT_KEYS.map(k => `<button type="button" class="chip fold-chip ${gFold === k ? 'on' : ''}" data-gfold="${k}">${FOLD_ICONS[k]}${T(FORMATS[k].label)}</button>`).join('');
  renderGrid();
}
function renderGrid() {
  const q = ($('#gSearch').value || '').trim().toLowerCase();
  const list = TEMPLATES.filter(t => (gCat === 'all' || t.cat === gCat) &&
    (!q || Object.values(t.name).concat(Object.keys(UI).map(l => UI[l]['cat_' + t.cat])).some(n => n.toLowerCase().includes(q))));
  const grid = $('#gGrid');
  if (!list.length) { grid.innerHTML = `<div class="g-empty">${T('no_results')}</div>`; return; }
  grid.innerHTML = list.map(t => `<button type="button" class="g-card ${t.id === st.tpl ? 'on' : ''}" data-tpl="${t.id}">
      <div class="g-thumb">${miniOutside(t.id)}</div>
      <div class="g-meta"><b>${esc(t.name[uiLang] || t.name.ar)}</b><span>${T('cat_' + t.cat)}</span></div></button>`).join('');
  requestAnimationFrame(() => {
    $$('.g-thumb', grid).forEach(th => {
      const mini = th.querySelector('.mini');
      fitThumbs(mini);
      mini.style.transform = `scale(${th.clientWidth / mini.offsetWidth})`;
    });
  });
}
function openGallery() { gFold = st.fmt; $('#gallery').classList.remove('hidden'); buildGallery(); $('#gSearch').focus(); }
function closeGallery() { $('#gallery').classList.add('hidden'); }
$('#btnGallery').addEventListener('click', openGallery);
$('#gClose').addEventListener('click', closeGallery);
$('#gallery').addEventListener('click', e => {
  if (e.target.id === 'gallery') { closeGallery(); return; }
  const c = e.target.closest('[data-cat]');
  if (c) { gCat = c.dataset.cat; $$('#gCats .chip').forEach(x => x.classList.toggle('on', x === c)); renderGrid(); return; }
  const gf = e.target.closest('[data-gfold]');
  if (gf) { gFold = gf.dataset.gfold; $$('#gFolds .chip').forEach(x => x.classList.toggle('on', x === gf)); renderGrid(); return; }
  const card = e.target.closest('[data-tpl]');
  if (card) {
    st.tpl = card.dataset.tpl;
    st.color = null; st.font = 'auto';
    if (gFold && gFold !== st.fmt) { st.fmt = gFold; folded = false; if (openSec && openSec !== 'style' && !fmtNow().order.includes(openSec)) openSec = null; }
    if (!st.dirty) st.c = sampleFor(st.tpl, st.clang);
    closeGallery(); rebuildKeepOpen(); renderAll(); if (view === '3d') render3d(); toast(T('t_tpl'));
  }
});
$('#gSearch').addEventListener('input', renderGrid);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#gallery').classList.contains('hidden')) closeGallery(); });

function renderCurrentThumb() {
  const box = $('#currentThumb');
  const ctx = currentCtx();
  box.innerHTML = miniHTML(ctx);
  const mini = box.querySelector('.mini');
  fitAll(mini, true);
  mini.style.transform = `scale(${Math.min(84 / miniWidth(ctx), 60 / PH)})`;
  $('#currentTplName').textContent = TPL[st.tpl].name[uiLang] || TPL[st.tpl].name.ar;
}

/* ---------------------------------------------------------
   Save / print / PDF
--------------------------------------------------------- */
let saveTimer = null;
function saveNow(showToast) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(st)); if (showToast) toast(T('t_saved')); return true; }
  catch (e) { if (showToast) toast(T('t_save_err')); return false; }
}
function autosave() { clearTimeout(saveTimer); saveTimer = setTimeout(() => saveNow(false), 800); }

function buildPrint(sides) {
  const ctx = currentCtx();
  const root = $('#printRoot');
  const F = ctx.F;
  let ps = $('#pageSize');
  if (!ps) { ps = document.createElement('style'); ps.id = 'pageSize'; document.head.appendChild(ps); }
  ps.textContent = `@page{ size: ${F.page}; margin: 0; } @media print{ .print-page{ width:${F.mm[0]}mm !important; height:${F.mm[1]}mm !important; } }`;
  root.innerHTML = sides.map(s => `<div class="print-page">${sheetHTML(s, ctx)}</div>`).join('');
  fitAll(root, true);
  return root;
}
function doPrint() {
  buildPrint(['out', 'in']);
  toast(T('t_print'));
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  fonts.then(() => setTimeout(() => window.print(), 300));
}
async function doPdf() {
  if (typeof html2canvas === 'undefined' || !window.jspdf) { toast(T('t_pdf_err')); return; }
  toast(T('t_pdf'));
  try {
    if (document.fonts) await document.fonts.ready;
    const { jsPDF } = window.jspdf;
    const F = fmtNow();
    const pdf = new jsPDF({ orientation: F.pdf[0], unit:'mm', format: F.pdf[1] });
    const sides = ['out', 'in'];
    for (let i = 0; i < sides.length; i++) {
      const root = buildPrint([sides[i]]);
      const sheet = root.querySelector('.sheet');
      await new Promise(r => setTimeout(r, 60));
      const canvas = await html2canvas(sheet, { scale: 2.5, backgroundColor:'#ffffff', useCORS:true, logging:false, width: F.sw, height: PH, windowWidth: F.sw, windowHeight: PH, scrollX: 0, scrollY: 0 });
      if (i > 0) pdf.addPage(F.pdf[1], F.pdf[0]);
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.93), 'JPEG', 0, 0, F.mm[0], F.mm[1]);
    }
    const name = (st.c['cover.title'] || 'brochure').replace(/[\\/:*?"<>|]+/g, '').trim().slice(0, 60) || 'brochure';
    pdf.save(name + '.pdf');
    $('#printRoot').innerHTML = '';
    toast(T('t_pdf_ok'));
  } catch (err) {
    console.error(err);
    toast(T('t_pdf_err'));
  }
}
window.addEventListener('afterprint', () => { $('#printRoot').innerHTML = ''; });


/* ---------------------------------------------------------
   Account (Firebase): Save button -> users/{uid}/brochures
--------------------------------------------------------- */
const hasFb = () => typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length && firebase.auth && firebase.firestore;
const fbUser = () => (hasFb() ? firebase.auth().currentUser : null);
const brochuresCol = uidv => firebase.firestore().collection('users').doc(uidv).collection('brochures');
let pendingAfterLogin = null;

function openLogin(after) {
  pendingAfterLogin = after || null;
  $('#login').classList.remove('hidden');
}
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
    title: (st.c['cover.title'] || '').slice(0, 200),
    tpl: st.tpl, clang: st.clang,
    state: JSON.stringify(copy),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };
}
async function saveToAccount() {
  saveNow(false);
  const user = fbUser();
  if (!user) { openLogin(saveToAccount); return; }
  try {
    const data = cloudPayload();
    if (data.state.length > 950000) { toast(T('t_too_big')); return; }
    const col = brochuresCol(user.uid);
    if (st.docId) await col.doc(st.docId).set(data, { merge: true });
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
  const user = fbUser();
  if (!user) { openLogin(openMine); return; }
  $('#mine').classList.remove('hidden');
  loadMine();
}
function closeMine() { $('#mine').classList.add('hidden'); }
async function loadMine() {
  const grid = $('#mGrid');
  grid.innerHTML = `<div class="g-empty">${T('loading')}</div>`;
  try {
    const snap = await brochuresCol(fbUser().uid).orderBy('updatedAt', 'desc').get();
    mineDocs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderMine();
  } catch (e) { console.error(e); grid.innerHTML = `<div class="g-empty">${T('t_cloud_err')}</div>`; }
}
function renderMine() {
  const grid = $('#mGrid');
  const fmt = ts => { try { return ts && ts.toDate ? ts.toDate().toLocaleDateString(uiLang === 'ar' ? 'ar-DZ' : uiLang) : ''; } catch (e) { return ''; } };
  const cards = mineDocs.map(d => {
    let parsed = null; try { parsed = JSON.parse(d.state); } catch (e) {}
    if (!parsed || !TPL[parsed.tpl]) return '';
    const ctx = ctxFor(parsed.tpl, { ...sampleFor(parsed.tpl, parsed.clang || 'ar'), ...(parsed.c || {}) }, parsed.img || {}, { color: parsed.color, font: parsed.font, clang: parsed.clang || 'ar', qr: '', fmt: parsed.fmt || 'tri' });
    return `<div class="g-card m-card" data-mid="${d.id}">
      ${d.id === st.docId ? `<span class="m-tag">${T('current')}</span>` : ''}
      <div class="g-thumb">${miniHTML(ctx)}</div>
      <div class="g-meta"><b>${esc(d.title || T('untitled'))}</b><span>${esc(T(ctx.F.label))}</span></div>
      <div class="m-date">${fmt(d.updatedAt)}</div>
      <div class="m-actions">
        <button type="button" class="primary" data-act="open">${IC_OPEN}${T('open_b')}</button>
        <button type="button" data-act="dup">${IC_DUP}${T('dup_b')}</button>
        <button type="button" class="danger icon" data-act="del" title="${T('del_b')}" aria-label="${T('del_b')}">${IC_DEL}</button>
      </div></div>`;
  }).join('');
  grid.innerHTML = `<button type="button" class="g-card m-new" data-act="new">${IC_PLUS}<span>${T('new_b')}</span></button>` +
    (cards || `<div class="g-empty">${T('mine_empty')}</div>`);
  requestAnimationFrame(() => $$('.g-thumb', grid).forEach(th => {
    const mini = th.querySelector('.mini'); fitThumbs(mini); mini.style.transform = `scale(${th.clientWidth / mini.offsetWidth})`;
  }));
}
$('#btnMine').addEventListener('click', openMine);
$('#mClose').addEventListener('click', closeMine);
$('#mine').addEventListener('click', async e => {
  if (e.target.id === 'mine') { closeMine(); return; }
  const btn = e.target.closest('[data-act]'); if (!btn) return;
  const act = btn.dataset.act;
  if (act === 'new') {
    st = freshState(); st.clang = uiLang; st.c = sampleFor(st.tpl, uiLang); folded = false;
    openSec = null; closeMine(); rebuildKeepOpen(); renderAll(); if (view === '3d') render3d(); toast(T('t_new'));
    return;
  }
  const card = btn.closest('[data-mid]'); if (!card) return;
  const id = card.dataset.mid;
  const doc = mineDocs.find(d => d.id === id); if (!doc) return;
  const col = brochuresCol(fbUser().uid);
  try {
    if (act === 'open') {
      const parsed = JSON.parse(doc.state);
      st = Object.assign(freshState(), parsed, { docId: id });
      st.c = { ...sampleFor(st.tpl, st.clang), ...(parsed.c || {}) }; if (!FMT_OK(st.fmt)) st.fmt = 'tri'; folded = false;
      openSec = null; closeMine(); rebuildKeepOpen(); renderAll(); if (view === '3d') render3d(); toast(T('t_opened'));
    } else if (act === 'dup') {
      const parsed = JSON.parse(doc.state);
      parsed.c = { ...(parsed.c || {}), 'cover.title': (parsed.c && parsed.c['cover.title'] || T('untitled')) + T('copy_suffix') };
      await col.add({ title: parsed.c['cover.title'].slice(0, 200), tpl: parsed.tpl, clang: parsed.clang, state: JSON.stringify(parsed),
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
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMine(); closeLogin(); } });

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
  $$('[data-i18n-ph]').forEach(el => el.placeholder = T(el.dataset.i18nPh));
  $$('[data-tip]').forEach(el => el.setAttribute('data-tiptext', T(el.dataset.tip)));
  $('#langToggle').textContent = uiLang.toUpperCase();
  $$('#langMenu button').forEach(b => b.classList.toggle('on', b.dataset.lang === uiLang));
  document.title = T('tool_name') + ' — Merabti Academy';
  buildAccordion();
  renderCurrentThumb();
  if (!$('#gallery').classList.contains('hidden')) buildGallery();
  $('#btnFold span').textContent = folded ? T('unfold') : T('fold');
}
$('#langToggle').addEventListener('click', e => { e.stopPropagation(); $('#langMenu').classList.toggle('hidden'); });
$('#langMenu').addEventListener('click', e => {
  const b = e.target.closest('[data-lang]'); if (!b) return;
  uiLang = b.dataset.lang;
  localStorage.setItem(UI_KEY, uiLang);
  $('#langMenu').classList.add('hidden');
  if (st.clang !== uiLang) {
    st.clang = uiLang;
    if (!st.dirty) st.c = sampleFor(st.tpl, uiLang);
  }
  applyUiLang();
  renderAll();
});
document.addEventListener('click', e => { if (!e.target.closest('.lang-wrap')) $('#langMenu').classList.add('hidden'); });

/* ---------------------------------------------------------
   Toolbar wiring
--------------------------------------------------------- */
$('#btnSave').addEventListener('click', saveToAccount);
$('#btnPrint').addEventListener('click', doPrint);
$('#btnPdf').addEventListener('click', doPdf);
$('#btnFullscreen').addEventListener('click', () => {
  if (!document.fullscreenElement) (document.documentElement.requestFullscreen || function(){}).call(document.documentElement);
  else document.exitFullscreen && document.exitFullscreen();
});
$('#panelToggle').addEventListener('click', () => {
  $('#workspace').classList.toggle('collapsed');
  setTimeout(() => { applyZoom(); if (view === '3d') apply3dScale(); }, 320);
});
$('#viewSeg').addEventListener('click', e => { const b = e.target.closest('[data-view]'); if (b) setView(b.dataset.view); });
$('#zoomIn').addEventListener('click', () => setZoom(1));
$('#zoomOut').addEventListener('click', () => setZoom(-1));
$('#zoomFit').addEventListener('click', () => { zoom = 'fit'; applyZoom(); });
$('#btnFold').addEventListener('click', () => { folded = !folded; applyFold(true); });
$('#btnFlip').addEventListener('click', () => { rot.y += 180; applyRot(); });
$('#btnReset3d').addEventListener('click', () => { rot = { x: 8, y: -16 }; folded = false; applyFold(true); applyRot(); });
window.addEventListener('resize', () => { if (zoom === 'fit') applyZoom(); if (view === '3d') apply3dScale(); });

/* ---------------------------------------------------------
   Init — every section starts collapsed
--------------------------------------------------------- */
applyUiLang();
const start = () => { renderFlat(); renderCurrentThumb(); updateStates(); };
start();
if (document.fonts) document.fonts.ready.then(() => { renderFlat(); renderCurrentThumb(); });

})();
