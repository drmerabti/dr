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
    fold3:'ثلاثية الطيّ', fold2:'ثنائية', foldZ:'رباعية Z', foldA5:'نصف A5', soon:'قريبًا',
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

/* ---------------------------------------------------------
   Templates
--------------------------------------------------------- */
const CONTACT_AR = { phone:'0550 12 34 56', email:'contact@merabti.com', addr:'الجزائر', web:'www.merabti.com' };

const TEMPLATES = [
  { id:'wave', cat:'edu', font:'Tajawal',
    name:{ar:'درس تفاعلي', fr:'Leçon', en:'Lesson'},
    pal:{c1:'#2F6FB0', c2:'#8FD0F5', c3:'#FFC857', c4:'#FFFFFF', bg:'#FFFFFF', ink:'#1E2F40'},
    t:{fr:['Les énergies renouvelables','Cours de sciences physiques — 3e année'], en:['Renewable energy','Physics lesson for grade 9']},
    s:{'cover.title':'الطاقات المتجددة','cover.sub':'درس في العلوم الفيزيائية للسنة الثالثة متوسط','cover.org':'الأستاذ: م. أحمد',
      'flap.title':'هل تعلم؟','flap.text':'تتمتع الجزائر بأكثر من 3000 ساعة من أشعة الشمس سنويًا، مما يجعلها من أغنى بلدان العالم بالطاقة الشمسية.',
      'p1.title':'ما هي الطاقة المتجددة؟','p1.text':'هي طاقة نحصل عليها من مصادر طبيعية لا تنفد، مثل الشمس والرياح والماء.\nتتجدد باستمرار ولا تلوّث البيئة كما تفعل الطاقات الأحفورية.',
      'p2.title':'أنواعها','p2.text':'الطاقة الشمسية: تحويل أشعة الشمس إلى كهرباء بواسطة الألواح الكهروضوئية.\nطاقة الرياح: تدوير التوربينات لإنتاج الكهرباء.\nالطاقة المائية: استغلال حركة المياه في السدود.',
      'p3.title':'تذكّر','p3.list':'الشمس مصدر لا ينفد\nالرياح تحرّك التوربينات\nالطاقة النظيفة تحمي البيئة\nترشيد الاستهلاك مسؤولية الجميع',
      'back.title':'للتواصل','back.text':'لأي استفسار حول الدرس أو للحصول على تمارين إضافية.'} },

  { id:'note', cat:'edu', font:'Almarai', mirror:true,
    name:{ar:'ملخص مراجعة', fr:'Fiche de révision', en:'Revision notes'},
    pal:{c1:'#D64550', c2:'#FFE27A', c3:'#B9D7F2', c4:'#FFFFFF', bg:'#FFFDF4', ink:'#2B2B2B'},
    t:{fr:['Fiche de révision','Les règles essentielles avant l’examen'], en:['Revision sheet','The key rules before the exam']},
    s:{'cover.title':'ملخص قواعد اللغة العربية','cover.sub':'مراجعة شاملة لامتحان شهادة التعليم المتوسط','cover.org':'إعداد: الأستاذة س. بن علي',
      'flap.title':'أهم القواعد','flap.text':'المبتدأ مرفوع، والفاعل مرفوع، والمفعول به منصوب. احفظ هذه الثلاثة وستتجنب أغلب الأخطاء.',
      'p1.title':'الجملة الاسمية','p1.text':'تتكون من مبتدأ وخبر، وكلاهما مرفوع.\nمثال: العلمُ نورٌ.\nقد يتقدّم الخبر على المبتدأ إذا كان شبه جملة.',
      'p2.title':'الجملة الفعلية','p2.text':'تبدأ بفعل، وتتكون من فعل وفاعل، وقد تحتاج إلى مفعول به.\nمثال: كتبَ التلميذُ الدرسَ.',
      'p3.title':'نصائح للمراجعة','p3.list':'راجع كل يوم قليلًا\nحلّ تمارين متنوعة\nاكتب الأمثلة بيدك\nنم جيدًا قبل الامتحان',
      'back.title':'بالتوفيق للجميع','back.text':'النجاح ثمرة المثابرة، فلا تستسلم.'} },

  { id:'health', cat:'aware', font:'Cairo',
    name:{ar:'توعية صحية', fr:'Santé', en:'Health'},
    pal:{c1:'#1FA38A', c2:'#A8E6D6', c3:'#FF7A7A', c4:'#FFFFFF', bg:'#F3FBF8', ink:'#1D3B36'},
    t:{fr:['Votre santé compte','Campagne pour une alimentation saine'], en:['Your health matters','A campaign for healthy living']},
    s:{'cover.title':'صحتك أمانة','cover.sub':'حملة توعوية حول التغذية السليمة ونمط الحياة الصحي','cover.org':'وحدة الكشف والمتابعة المدرسية',
      'flap.title':'هل تعلم؟','flap.text':'شرب كوبين من الماء صباحًا يساعد جسمك على النشاط ويحسّن الهضم.',
      'p1.title':'التغذية المتوازنة','p1.text':'احرص على تناول الخضر والفواكه يوميًا، وقلّل من السكريات والمشروبات الغازية.\nوجبة الفطور هي أهم وجبة في اليوم.',
      'p2.title':'النشاط البدني','p2.text':'ثلاثون دقيقة من المشي أو الرياضة يوميًا تقوّي القلب وتحسّن التركيز وتقلّل التوتر.',
      'p3.title':'عادات يومية','p3.list':'اشرب الماء بانتظام\nاغسل يديك قبل الأكل\nنم ثماني ساعات\nقلّل من الشاشات',
      'back.title':'استشر طبيبك','back.text':'الوقاية خير من العلاج، والكشف المبكر يحمي صحتك.'} },

  { id:'eco', cat:'aware', font:'Cairo', mirror:true,
    name:{ar:'البيئة', fr:'Environnement', en:'Environment'},
    pal:{c1:'#3E7B27', c2:'#A7C957', c3:'#F6C85F', c4:'#FFFFFF', bg:'#FBFAF1', ink:'#253320'},
    t:{fr:['Protégeons notre planète','Petit guide éco-citoyen'], en:['Protect our planet','A small guide to green habits']},
    s:{'cover.title':'لنحمِ كوكبنا','cover.sub':'دليل صغير للحفاظ على البيئة في المدرسة والبيت','cover.org':'نادي البيئة المدرسي',
      'flap.title':'شعارنا','flap.text':'مدرسة نظيفة، بيئة سليمة، مستقبل أخضر.',
      'p1.title':'لماذا نحمي البيئة؟','p1.text':'البيئة بيتنا المشترك. التلوث يهدد الماء والهواء والتربة، وكل واحد منا قادر على التغيير بخطوات بسيطة.',
      'p2.title':'إعادة التدوير','p2.text':'افصل النفايات: الورق، البلاستيك، الزجاج والمعادن.\nإعادة التدوير توفّر المواد الخام وتقلّل النفايات.',
      'p3.title':'خطوات بسيطة','p3.list':'أطفئ الأضواء غير الضرورية\nأغلق الصنبور جيدًا\nاستعمل كيسًا قابلًا لإعادة الاستعمال\nازرع شجرة',
      'back.title':'انضم إلينا','back.text':'شارك في حملات التشجير والتنظيف مع نادي البيئة كل يوم خميس.'} },

  { id:'event', cat:'school', font:'Tajawal',
    name:{ar:'حفل مدرسي', fr:'Fête scolaire', en:'School party'},
    pal:{c1:'#E4405F', c2:'#3FA7D6', c3:'#FAC05E', c4:'#59CD90', bg:'#FFFFFF', ink:'#2A2340'},
    t:{fr:['Fête de fin d’année','Cérémonie de remise des prix'], en:['End of year party','Awards ceremony for our pupils']},
    s:{'cover.title':'حفل نهاية السنة','cover.sub':'يسعدنا دعوتكم لحضور حفل تكريم التلاميذ المتفوقين','cover.org':'إدارة ابتدائية الأمل',
      'flap.title':'كلمة شكر','flap.text':'شكرًا لكل الأساتذة والأولياء على مرافقة أبنائنا طوال هذه السنة الدراسية.',
      'p1.title':'برنامج الحفل','p1.text':'افتتاح بآيات من القرآن الكريم، ثم النشيد الوطني، تليها كلمة السيد المدير.',
      'p2.title':'فقرات فنية','p2.text':'عروض مسرحية وأناشيد من تقديم تلاميذنا، ومعرض لأعمالهم الفنية طوال السنة.',
      'p3.title':'معلومات الحفل','p3.list':'التاريخ: الخميس 25 جوان\nالتوقيت: 14:00\nالمكان: ساحة المدرسة\nالدعوة عامة للأولياء',
      'back.title':'نتشرف بحضوركم','back.text':'حضوركم يُسعد أبناءكم ويشجعهم على مزيد من التفوق.'} },

  { id:'bts', cat:'school', font:'Almarai',
    name:{ar:'الدخول المدرسي', fr:'Rentrée scolaire', en:'Back to school'},
    pal:{c1:'#F6B80C', c2:'#1E3A5F', c3:'#E94F37', c4:'#FFFFFF', bg:'#FFFFFF', ink:'#1E3A5F'},
    t:{fr:['Bonne rentrée !','Guide de l’élève et des parents'], en:['Happy new school year!','A guide for pupils and parents']},
    s:{'cover.title':'دخول مدرسي سعيد','cover.sub':'دليل التلميذ والولي لسنة دراسية ناجحة','cover.org':'متوسطة ابن خلدون',
      'flap.title':'نصيحة للأولياء','flap.text':'تابعوا كراريس أبنائكم يوميًا، وتواصلوا مع الأساتذة كلما دعت الحاجة.',
      'p1.title':'مرحبًا بكم','p1.text':'نرحب بجميع التلاميذ في سنة دراسية جديدة مليئة بالتعلم والنشاط والنجاح.',
      'p2.title':'التنظيم اليومي','p2.text':'يبدأ الدوام على الساعة الثامنة صباحًا.\nالحضور في الوقت واحترام النظام الداخلي من أسس النجاح.',
      'p3.title':'الأدوات المطلوبة','p3.list':'كراريس 96 صفحة\nأقلام بألوان مختلفة\nمسطرة وكوس ومنقلة\nمئزر نظيف',
      'back.title':'للتواصل مع الإدارة','back.text':'مكتب الاستقبال مفتوح من الأحد إلى الخميس.'} },

  { id:'corp', cat:'biz', font:'Cairo', mirror:true,
    name:{ar:'تعريف بمؤسسة', fr:'Présentation d’entreprise', en:'Company profile'},
    pal:{c1:'#1B2F5B', c2:'#2EC4B6', c3:'#E9EEF5', c4:'#FFFFFF', bg:'#FFFFFF', ink:'#1B2F5B'},
    t:{fr:['Solutions d’ingénierie','Études et maintenance industrielle'], en:['Engineering solutions','Industrial studies and maintenance']},
    s:{'cover.title':'حلول هندسية متكاملة','cover.sub':'خبرة في الدراسات والصيانة الصناعية','cover.org':'مكتب الدراسات التقنية',
      'flap.title':'لماذا نحن؟','flap.text':'فريق من المهندسين ذوي الخبرة، والتزام بالجودة واحترام المواعيد.',
      'p1.title':'من نحن','p1.text':'مكتب دراسات متخصص في الهندسة الصناعية والطاقة، نرافق المؤسسات من الدراسة إلى التنفيذ والمتابعة.',
      'p2.title':'رؤيتنا','p2.text':'نسعى لتقديم حلول موثوقة وفعّالة تحسّن أداء المنشآت وتقلّل استهلاك الطاقة وتكاليف الصيانة.',
      'p3.title':'خدماتنا','p3.list':'الدراسات التقنية\nالصيانة الوقائية\nتدقيق الطاقة\nالتكوين والمرافقة',
      'back.title':'اتصل بنا','back.text':'يسعدنا دراسة مشروعكم وتقديم عرض يناسبكم.'} },

  { id:'hex', cat:'biz', font:'Cairo', mirror:true,
    name:{ar:'خدمات', fr:'Services', en:'Services'},
    pal:{c1:'#0F766E', c2:'#7DE3CF', c3:'#F59E0B', c4:'#FFFFFF', bg:'#F6FAF9', ink:'#134E4A'},
    t:{fr:['Services de maintenance','Rapidité et qualité'], en:['Maintenance services','Fast response, quality work']},
    s:{'cover.title':'خدمات الصيانة','cover.sub':'سرعة في التدخل وجودة في العمل','cover.org':'شركة الإتقان للخدمات',
      'flap.title':'عروض المؤسسات','flap.text':'عقود صيانة سنوية بأسعار تفضيلية للمؤسسات والإدارات.',
      'p1.title':'ماذا نقدّم','p1.text':'صيانة التجهيزات الكهربائية والتبريد والتكييف للمنازل والمؤسسات، بفريق مؤهل وقطع غيار أصلية.',
      'p2.title':'كيف نعمل','p2.text':'اتصل بنا، نحدد موعدًا، يتنقل الفني إليك ويقدّم تشخيصًا مجانيًا قبل أي تدخل.',
      'p3.title':'مزايانا','p3.list':'تدخّل خلال 24 ساعة\nضمان على كل الأعمال\nأسعار واضحة\nخدمة ما بعد البيع',
      'back.title':'نحن في خدمتكم','back.text':'من السبت إلى الخميس، من 8 صباحًا إلى 6 مساءً.'} },

  { id:'promo', cat:'promo', font:'Cairo',
    name:{ar:'عروض وتخفيضات', fr:'Promotions', en:'Sale'},
    pal:{c1:'#E63946', c2:'#FFD60A', c3:'#1D1D1D', c4:'#FFFFFF', bg:'#FFFFFF', ink:'#1D1D1D'},
    t:{fr:['Grandes soldes','Sur tous les produits, une semaine seulement'], en:['Big sale','On every product, one week only']},
    s:{'cover.title':'تخفيضات كبرى','cover.sub':'على كل المنتجات لمدة أسبوع فقط','cover.org':'متجر النور','cover.badge':'-50%',
      'flap.title':'لا تفوّت الفرصة','flap.text':'العرض ساري حتى نفاد الكمية.',
      'p1.title':'عروض الأسبوع','p1.text':'استفد من تخفيضات تصل إلى 50% على الأجهزة المنزلية والملابس والأدوات المكتبية.',
      'p2.title':'هدايا مجانية','p2.text':'لكل عملية شراء تفوق 5000 دج، احصل على هدية مجانية ومشاركة في السحب.',
      'p3.title':'أبرز الأسعار','p3.list':'خلاط كهربائي | 3900 دج\nمكواة بخار | 2500 دج\nحقيبة مدرسية | 1800 دج\nمصباح مكتبي | 1200 دج',
      'back.title':'زورونا','back.text':'مفتوح كل أيام الأسبوع من 9 صباحًا إلى 10 ليلًا.'} },

  { id:'menu', cat:'promo', font:'Amiri',
    name:{ar:'قائمة مطعم', fr:'Menu de restaurant', en:'Restaurant menu'},
    pal:{c1:'#C9A227', c2:'#8C6D1F', c3:'#3A3630', c4:'#FFFFFF', bg:'#1C1B19', ink:'#EFE6D2'},
    t:{fr:['Restaurant El Assala','Saveurs traditionnelles, touche moderne'], en:['El Assala Restaurant','Traditional flavours, modern touch']},
    s:{'cover.title':'مطعم الأصالة','cover.sub':'نكهات تقليدية بلمسة عصرية','cover.org':'قائمة الطعام',
      'flap.title':'الحلويات','flap.text':'قلب اللوز، المقروط، والشاي بالنعناع يُقدَّم مع كل وجبة.',
      'p1.title':'المقبلات','p1.text':'شوربة فريك بالدجاج، بوراك باللحم، وسلطة مشوية بزيت الزيتون.',
      'p2.title':'الأطباق الرئيسية','p2.text':'كسكس بالخضر واللحم، طاجين الزيتون، رشتة عاصمية، وشطيطحة دجاج.',
      'p3.title':'الأسعار','p3.list':'شوربة فريك | 250 دج\nكسكس باللحم | 900 دج\nطاجين زيتون | 750 دج\nقلب اللوز | 150 دج',
      'back.title':'احجز طاولتك','back.text':'نستقبلكم يوميًا من 12 ظهرًا إلى 11 ليلًا.'} },

  { id:'conf', cat:'events', font:'Tajawal', mirror:true,
    name:{ar:'ملتقى علمي', fr:'Colloque scientifique', en:'Scientific conference'},
    pal:{c1:'#5B2A86', c2:'#00B4D8', c3:'#F72585', c4:'#FFFFFF', bg:'#FFFFFF', ink:'#2B1B3D'},
    t:{fr:['Colloque national sur l’énergie','La transition énergétique dans l’industrie'], en:['National Energy Conference','Energy transition in industry']},
    s:{'cover.title':'الملتقى الوطني للطاقة','cover.sub':'الانتقال الطاقوي في القطاع الصناعي: تحديات وآفاق','cover.org':'كلية العلوم والتكنولوجيا',
      'flap.title':'اللجنة العلمية','flap.text':'تضم أساتذة وباحثين من جامعات ومراكز بحث وطنية ودولية.',
      'p1.title':'ديباجة الملتقى','p1.text':'يهدف الملتقى إلى جمع الباحثين والمهنيين لمناقشة سبل تحسين النجاعة الطاقوية في الصناعة ودمج الطاقات المتجددة.',
      'p2.title':'محاور الملتقى','p2.text':'النجاعة الطاقوية في المصانع.\nالطاقات المتجددة وتخزينها.\nالإلكترونيات الطاقوية والشبكات الذكية.',
      'p3.title':'تواريخ مهمة','p3.list':'آخر أجل للملخصات: 15 نوفمبر\nالرد على المشاركين: 30 نوفمبر\nالمقالات الكاملة: 20 ديسمبر\nانعقاد الملتقى: 12 جانفي',
      'back.title':'التسجيل والاستفسار','back.text':'تُرسل الملخصات عبر البريد الإلكتروني وفق النموذج المرفق.'} },

  { id:'ram', cat:'occ', font:'El Messiri',
    name:{ar:'رمضان', fr:'Ramadan', en:'Ramadan'},
    pal:{c1:'#E0B04F', c2:'#0F1E3D', c3:'#1E3563', c4:'#FFFFFF', bg:'#FBF6EA', ink:'#2A2A2A'},
    t:{fr:['Ramadan Karim','Le mois du partage et de la solidarité'], en:['Ramadan Kareem','A month of giving and compassion']},
    s:{'cover.title':'رمضان كريم','cover.sub':'شهر الخير والبركة والتراحم','cover.org':'جمعية البر والإحسان',
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

const GENERIC = {
  fr: {'cover.org':'Merabti Academy','flap.title':'Le saviez-vous ?','flap.text':'Ajoutez une information surprenante ou un conseil pratique pour capter l’attention du lecteur.',
    'p1.title':'Présentation','p1.text':'Présentez votre sujet en quelques phrases claires.\nUne bonne introduction donne envie de lire la suite.',
    'p2.title':'L’essentiel','p2.text':'Développez l’idée principale avec des exemples concrets. Restez simple et précis.',
    'p3.title':'À retenir','p3.list':'Premier point important\nDeuxième point important\nTroisième point important\nQuatrième point important',
    'back.title':'Contact','back.text':'Pour toute information, n’hésitez pas à nous contacter.', addr:'Algérie'},
  en: {'cover.org':'Merabti Academy','flap.title':'Did you know?','flap.text':'Add a surprising fact or a practical tip to catch the reader’s attention.',
    'p1.title':'Introduction','p1.text':'Introduce your topic in a few clear sentences.\nA good opening makes people want to read on.',
    'p2.title':'The essentials','p2.text':'Develop the main idea with concrete examples. Keep it simple and precise.',
    'p3.title':'Key points','p3.list':'First key point\nSecond key point\nThird key point\nFourth key point',
    'back.title':'Contact us','back.text':'For any information, feel free to get in touch.', addr:'Algeria'}
};

function sampleFor(id, lang) {
  const t = TPL[id];
  const base = { 'cover.badge':'', ...CONTACT_AR };
  if (lang === 'ar') return { ...base, ...t.s };
  const g = GENERIC[lang] || GENERIC.en;
  const tt = t.t[lang] || t.t.en;
  return { ...base, ...g, 'cover.title':tt[0], 'cover.sub':tt[1], 'cover.badge': t.s['cover.badge'] || '' };
}

/* ---------------------------------------------------------
   State
--------------------------------------------------------- */
let uiLang = localStorage.getItem(UI_KEY) || localStorage.getItem('site_lang') || 'ar';
if (!UI[uiLang]) uiLang = 'ar';
const T = k => (UI[uiLang] && UI[uiLang][k]) || UI.ar[k] || k;

function freshState() {
  return { tpl:'wave', color:null, font:'auto', clang: uiLang, dirty:false, qr:true, c: sampleFor('wave', uiLang), img:{} };
}
function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY));
    if (s && TPL[s.tpl] && s.c) return Object.assign(freshState(), s);
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
const DECO = {
  wave(kind, P) {
    let s = `<rect width="374" height="794" fill="${P.bg}"/>`;
    if (kind === 'cover') s += `
      <path d="M0 0H374V372C318 410 262 356 196 384C128 413 64 396 0 424Z" fill="${P.c2}"/>
      <path d="M0 0H374V340C314 380 256 322 188 352C122 381 58 366 0 392Z" fill="${P.c1}"/>
      <circle cx="312" cy="92" r="52" fill="#fff" opacity=".10"/><circle cx="52" cy="262" r="24" fill="#fff" opacity=".13"/>
      <circle cx="330" cy="292" r="11" fill="${P.c3}"/><circle cx="84" cy="120" r="6" fill="${P.c3}"/>
      <path d="M0 794V744C70 726 132 766 202 748C272 730 322 748 374 736V794Z" fill="${P.c2}"/>
      <path d="M0 794V768C80 750 150 788 230 770C300 755 340 770 374 762V794Z" fill="${P.c1}"/>`;
    else if (kind === 'back') s += `
      <path d="M0 0H374V40C300 62 240 26 170 44C100 62 50 50 0 60Z" fill="${P.c2}"/>
      <path d="M0 794V690C70 664 140 712 214 688C286 664 330 684 374 670V794Z" fill="${P.c1}"/>
      <circle cx="320" cy="740" r="22" fill="#fff" opacity=".14"/><circle cx="60" cy="760" r="9" fill="${P.c3}"/>`;
    else if (kind === 'flap') s += `
      <circle cx="360" cy="30" r="120" fill="${P.c2}" opacity=".45"/><circle cx="20" cy="770" r="90" fill="${P.c2}" opacity=".35"/>
      <circle cx="300" cy="150" r="10" fill="${P.c3}"/><circle cx="60" cy="640" r="16" fill="${P.c1}" opacity=".18"/>`;
    else s += `
      <path d="M0 0H374V64C310 92 250 52 186 74C120 96 60 78 0 96Z" fill="${P.c1}"/>
      <path d="M0 96C60 78 120 96 186 74C250 52 310 92 374 64V76C310 104 250 64 186 86C120 108 60 90 0 108Z" fill="${P.c2}"/>
      <circle cx="340" cy="760" r="36" fill="${P.c2}" opacity=".35"/><circle cx="300" cy="770" r="8" fill="${P.c3}"/>`;
    return s;
  },

  note(kind, P) {
    let s = `<rect width="374" height="794" fill="${P.bg}"/>`;
    for (let y = 96; y < 780; y += 32) s += `<line x1="0" y1="${y}" x2="374" y2="${y}" stroke="${P.c3}" stroke-width="1.2"/>`;
    s += `<line x1="62" y1="0" x2="62" y2="794" stroke="${P.c1}" stroke-width="2"/><line x1="67" y1="0" x2="67" y2="794" stroke="${P.c1}" stroke-width="1" opacity=".4"/>`;
    if (kind === 'cover') {
      for (let y = 60; y < 794; y += 90) s += `<circle cx="30" cy="${y}" r="9" fill="#E9E4D6"/><circle cx="30" cy="${y}" r="9" fill="none" stroke="#D5CFBE"/>`;
      s += `<path d="M300 690l8 16 18 3-13 12 3 18-16-9-16 9 3-18-13-12 18-3z" fill="none" stroke="${P.c1}" stroke-width="2.4" opacity=".7"/>
            <path d="M100 120c30-18 70-18 100 0" stroke="${P.c1}" stroke-width="2.4" fill="none" opacity=".5"/>`;
    } else if (kind === 'flap' || kind === 'back') {
      s += `<path d="M110 730c20 10 40-10 60 0s40-10 60 0 40-10 60 0" stroke="${P.c1}" stroke-width="2.4" fill="none" opacity=".45"/>`;
    }
    return s;
  },

  health(kind, P) {
    let s = `<rect width="374" height="794" fill="${P.bg}"/>`;
    if (kind === 'cover') s += `
      <circle cx="360" cy="60" r="232" fill="none" stroke="${P.c2}" stroke-width="10"/>
      <circle cx="360" cy="60" r="200" fill="${P.c1}"/>
      <g transform="translate(286 108)" fill="#fff" opacity=".9"><rect x="-12" y="-36" width="24" height="72" rx="6"/><rect x="-36" y="-12" width="72" height="24" rx="6"/></g>
      <circle cx="0" cy="770" r="160" fill="${P.c2}" opacity=".7"/><circle cx="64" cy="640" r="16" fill="${P.c3}"/>
      <circle cx="330" cy="700" r="40" fill="${P.c1}" opacity=".12"/>`;
    else if (kind === 'back' || kind === 'flap') s += `
      <circle cx="374" cy="794" r="190" fill="${P.c1}" opacity=".14"/><circle cx="0" cy="0" r="110" fill="${P.c2}" opacity=".6"/>
      <circle cx="320" cy="120" r="10" fill="${P.c3}"/>`;
    else s += `
      <circle cx="380" cy="-10" r="100" fill="${P.c2}" opacity=".55"/><circle cx="-20" cy="810" r="120" fill="${P.c1}" opacity=".12"/>
      <circle cx="320" cy="120" r="7" fill="${P.c3}"/>`;
    return s;
  },

  eco(kind, P) {
    let s = `<rect width="374" height="794" fill="${P.bg}"/>`;
    if (kind === 'cover') s += `
      <circle cx="300" cy="520" r="62" fill="${P.c3}" opacity=".9"/>
      <path d="M0 590C80 548 150 580 222 548C292 518 342 548 374 532V794H0Z" fill="${P.c2}"/>
      <path d="M0 660C90 618 170 680 262 638C322 612 352 628 374 618V794H0Z" fill="${P.c1}"/>
      ${leaf(330, 20, 120, 1.3, P.c2)}${leaf(360, 70, 150, 1, P.c1)}${leaf(20, 30, 40, .9, P.c2)}`;
    else if (kind === 'back' || kind === 'flap') s += `
      <path d="M0 690C90 660 170 700 262 672C322 654 352 664 374 656V794H0Z" fill="${P.c2}"/>
      <path d="M0 734C100 708 180 750 280 720C330 706 356 712 374 708V794H0Z" fill="${P.c1}"/>
      ${leaf(340, 30, 130, 1, P.c2)}`;
    else s += `
      ${leaf(350, 18, 128, 1.1, P.c2)}${leaf(372, 70, 160, .8, P.c1)}
      <path d="M0 754C100 734 180 766 280 742C330 730 356 736 374 732V794H0Z" fill="${P.c2}" opacity=".7"/>`;
    return s;
  },

  event(kind, P, seed) {
    const cols = [P.c1, P.c2, P.c3, P.c4];
    const r = rng(seed || 7);
    let s = `<rect width="374" height="794" fill="${P.bg}"/>`;
    const n = kind === 'cover' ? 56 : 22;
    for (let i = 0; i < n; i++) {
      const x = r() * 374; let y = r() * 794;
      if (kind === 'cover') { if (y > 230 && y < 560) y = y < 395 ? y - 170 : y + 170; }
      else { y = r() < .5 ? r() * 60 : 740 + r() * 54; }
      const c = cols[Math.floor(r() * cols.length)];
      const t = r();
      if (t < .4) s += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${(6 + r() * 8).toFixed(0)}" height="${(12 + r() * 10).toFixed(0)}" rx="2" fill="${c}" transform="rotate(${(r() * 180).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`;
      else if (t < .75) s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(3 + r() * 6).toFixed(1)}" fill="${c}"/>`;
      else s += `<polygon points="${starPts(x, y, 9, 4, 5)}" fill="${c}"/>`;
    }
    if (kind === 'cover') s += `
      <path d="M-10 40C60 90 120 10 190 60S320 20 390 70" stroke="${P.c2}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M-10 740C60 700 130 770 200 730S320 760 390 720" stroke="${P.c1}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    return s;
  },

  bts(kind, P) {
    let s = `<rect width="374" height="794" fill="${P.bg}"/>`;
    const ruler = (y, h) => {
      let r = `<rect x="0" y="${y}" width="374" height="${h}" fill="#fff"/><rect x="0" y="${y}" width="374" height="${h}" fill="${P.c1}" opacity=".18"/>`;
      for (let x = 8, i = 0; x < 374; x += 12, i++) r += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + (i % 5 === 0 ? h * .6 : h * .32)}" stroke="${P.c2}" stroke-width="1.6"/>`;
      return r;
    };
    if (kind === 'cover') {
      s += `<rect width="374" height="480" fill="${P.c1}"/>`;
      for (let i = -10; i < 30; i++) s += `<line x1="${i * 26}" y1="480" x2="${i * 26 + 480}" y2="0" stroke="#fff" stroke-opacity=".12" stroke-width="7"/>`;
      s += `<g transform="translate(20 610) rotate(-10)">
          <rect x="40" y="0" width="230" height="34" fill="${P.c1}"/><rect x="40" y="0" width="230" height="11" fill="#fff" opacity=".35"/>
          <polygon points="270,0 318,17 270,34" fill="#F1C68A"/><polygon points="302,11 318,17 302,23" fill="${P.c2}"/>
          <rect x="18" y="0" width="22" height="34" fill="#B9C2CC"/><rect x="0" y="0" width="20" height="34" rx="6" fill="${P.c3}"/></g>
        ${ruler(744, 50)}`;
    } else if (kind === 'back' || kind === 'flap') {
      s += `${ruler(0, 34)}<circle cx="330" cy="730" r="60" fill="${P.c1}" opacity=".25"/><circle cx="40" cy="700" r="14" fill="${P.c3}" opacity=".8"/>`;
    } else {
      s += `${ruler(0, 34)}<rect x="0" y="770" width="374" height="24" fill="${P.c1}"/>`;
    }
    return s;
  },

  corp(kind, P) {
    let s = `<rect width="374" height="794" fill="${P.bg}"/>`;
    if (kind === 'cover') {
      s += `<path d="M0 0H374V500L0 590Z" fill="${P.c1}"/><path d="M0 590L374 500V516L0 606Z" fill="${P.c2}"/>`;
      for (let i = 0; i < 9; i++) s += `<line x1="${-40 + i * 60}" y1="0" x2="${160 + i * 60}" y2="560" stroke="#fff" stroke-opacity=".05" stroke-width="18"/>`;
      for (let x = 0; x < 4; x++) for (let y = 0; y < 3; y++) s += `<rect x="${270 + x * 22}" y="${700 + y * 22}" width="10" height="10" fill="${P.c1}" opacity=".12"/>`;
    } else if (kind === 'back') {
      s += `<rect width="374" height="126" fill="${P.c1}"/><rect y="126" width="374" height="6" fill="${P.c2}"/>
            <rect x="0" y="760" width="374" height="34" fill="${P.c3}"/>`;
    } else {
      s += `<rect x="0" y="0" width="14" height="794" fill="${P.c1}"/><rect x="0" y="60" width="14" height="70" fill="${P.c2}"/>
            <rect x="0" y="760" width="374" height="34" fill="${P.c3}"/>`;
    }
    return s;
  },

  hex(kind, P) {
    let s = `<rect width="374" height="794" fill="${P.bg}"/>`;
    const hx = (cx, cy, r, fill, op = 1, line) => line
      ? `<polygon points="${hexPts(cx, cy, r)}" fill="none" stroke="${fill}" stroke-width="3" opacity="${op}"/>`
      : `<polygon points="${hexPts(cx, cy, r)}" fill="${fill}" opacity="${op}"/>`;
    if (kind === 'cover') {
      const R = 40, w = R * Math.sqrt(3);
      const map = [[0,0,'c1'],[1,0,'c2'],[2,0,'l'],[3,0,'c1'],[0,1,'c2'],[1,1,'c1'],[2,1,'c3'],[3,1,'c2'],[1,2,'l'],[2,2,'c1'],[3,2,'c2'],[2,3,'l'],[3,3,'c1'],[3,4,'c2']];
      map.forEach(([c, r, k]) => {
        const cx = 60 + c * w + (r % 2 ? w / 2 : 0), cy = 30 + r * R * 1.5;
        s += k === 'l' ? hx(cx, cy, R - 4, P.c1, .5, true) : hx(cx, cy, R - 4, P[k], k === 'c2' ? .8 : 1);
      });
      s += hx(40, 760, 60, P.c2, .35) + hx(100, 790, 30, P.c1, .6, true);
    } else {
      s += hx(350, 20, 60, P.c2, .6) + hx(300, 70, 26, P.c1, .9) + hx(356, 118, 22, P.c3, .9);
      s += hx(20, 770, 50, P.c1, .12) + hx(80, 780, 24, P.c1, .4, true);
    }
    return s;
  },

  promo(kind, P) {
    let s = '';
    if (kind === 'cover') {
      s += `<rect width="374" height="794" fill="${P.c1}"/>`;
      for (let i = 0; i < 24; i++) { const a = i * 15 * Math.PI / 180; s += `<line x1="187" y1="397" x2="${(187 + 700 * Math.cos(a)).toFixed(0)}" y2="${(397 + 700 * Math.sin(a)).toFixed(0)}" stroke="#fff" stroke-opacity=".06" stroke-width="30"/>`; }
      s += `<path d="M0 640L374 520V600L0 720Z" fill="${P.c2}"/><path d="M0 734L374 614V630L0 750Z" fill="${P.c3}"/>
            <path d="M0 0L150 0L0 90Z" fill="${P.c2}" opacity=".9"/>`;
      const r = rng(11);
      for (let i = 0; i < 26; i++) s += `<circle cx="${(r() * 374).toFixed(0)}" cy="${(r() * 794).toFixed(0)}" r="${(2 + r() * 4).toFixed(1)}" fill="#fff" opacity=".35"/>`;
    } else if (kind === 'flap') {
      s += `<rect width="374" height="794" fill="${P.c2}"/>`;
      for (let i = -4; i < 20; i++) s += `<path d="M${i * 30} 0l20 0l-60 60l-20 0z" fill="${P.c1}"/><path d="M${i * 30} 734l20 0l-60 60l-20 0z" fill="${P.c3}"/>`;
    } else {
      s += `<rect width="374" height="794" fill="${P.bg}"/><path d="M0 0H190L0 110Z" fill="${P.c1}"/><path d="M0 110L190 0H220L0 128Z" fill="${P.c2}"/>
            <path d="M374 794V700L270 794Z" fill="${P.c2}"/>`;
      if (kind === 'back') s += `<rect y="760" width="374" height="34" fill="${P.c1}"/>`;
    }
    return s;
  },

  menu(kind, P) {
    let s = `<rect width="374" height="794" fill="${P.bg}"/>
      <rect x="16" y="16" width="342" height="762" fill="none" stroke="${P.c1}" stroke-width="1.6"/>
      <rect x="24" y="24" width="326" height="746" fill="none" stroke="${P.c1}" stroke-width=".7" opacity=".6"/>`;
    [[16,16],[358,16],[16,778],[358,778]].forEach(([x, y]) => s += `<rect x="${x - 6}" y="${y - 6}" width="12" height="12" fill="${P.c1}" transform="rotate(45 ${x} ${y})"/>`);
    if (kind === 'cover') s += `
      <g fill="none" stroke="${P.c1}" stroke-width="1.4">
        <path d="M100 150H160M214 150H274"/><path d="M100 650H160M214 650H274"/></g>
      <polygon points="${starPts(187, 150, 16, 6, 4)}" fill="${P.c1}"/><polygon points="${starPts(187, 650, 16, 6, 4)}" fill="${P.c1}"/>
      <circle cx="187" cy="150" r="26" fill="none" stroke="${P.c1}" stroke-width=".8" opacity=".6"/><circle cx="187" cy="650" r="26" fill="none" stroke="${P.c1}" stroke-width=".8" opacity=".6"/>`;
    else s += `<polygon points="${starPts(187, 740, 10, 4, 4)}" fill="${P.c1}" opacity=".8"/><path d="M130 740H170M204 740H244" stroke="${P.c1}" stroke-width="1"/>`;
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
    if (kind === 'cover') return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${P.c1}"/><stop offset="1" stop-color="${shade(P.c1, -.55)}"/></linearGradient></defs>
      <rect width="374" height="794" fill="url(#${id})"/>${net(0, 360, 374, 440, 34, P.c2, .35, 5)}
      <circle cx="330" cy="70" r="120" fill="${P.c2}" opacity=".10"/>`;
    if (kind === 'back') return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${P.c1}"/><stop offset="1" stop-color="${shade(P.c1, -.5)}"/></linearGradient></defs>
      <rect width="374" height="794" fill="${P.bg}"/><rect y="640" width="374" height="154" fill="url(#${id})"/>${net(0, 650, 374, 140, 16, P.c2, .35, 9)}`;
    return `<rect width="374" height="794" fill="${P.bg}"/>${net(200, 0, 174, 150, 14, P.c1, .22, (seed || 3) + 2)}`;
  },

  ram(kind, P, seed) {
    const r = rng(seed || 21);
    const lantern = (x, len, sc) => `<line x1="${x}" y1="0" x2="${x}" y2="${len}" stroke="${P.c1}" stroke-width="1.2"/>
      <g transform="translate(${x} ${len}) scale(${sc})" fill="${P.c1}">
        <path d="M-10 0H10L14 8H-14Z"/><path d="M-16 8H16L20 48L0 64L-20 48Z" fill-opacity=".92"/>
        <path d="M-9 16H9L11 44L0 54L-11 44Z" fill="${P.c2}" fill-opacity=".55"/><circle cx="0" cy="70" r="4"/></g>`;
    const stars = (n, y0, y1, col) => { let o = ''; for (let i = 0; i < n; i++) o += `<circle cx="${(r() * 374).toFixed(0)}" cy="${(y0 + r() * (y1 - y0)).toFixed(0)}" r="${(0.8 + r() * 1.8).toFixed(1)}" fill="${col}" opacity="${(.5 + r() * .5).toFixed(2)}"/>`; return o; };
    if (kind === 'cover') {
      const g = 'g' + (++uid), m = 'm' + uid;
      return `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.c2}"/><stop offset="1" stop-color="${P.c3}"/></linearGradient>
        <mask id="${m}"><rect width="374" height="794" fill="#fff"/><circle cx="209" cy="118" r="50" fill="#000"/></mask></defs>
        <rect width="374" height="794" fill="url(#${g})"/>${stars(60, 0, 620, '#fff')}
        <circle cx="187" cy="130" r="56" fill="${P.c1}" mask="url(#${m})"/>
        <polygon points="${starPts(250, 90, 9, 3.5, 5)}" fill="${P.c1}"/>
        ${lantern(56, 150, 1)}${lantern(318, 110, .85)}
        <path d="M0 794V720H40V700C40 680 60 668 70 660C80 668 100 680 100 700V720H140V690C140 650 187 620 187 620C187 620 234 650 234 690V720H274V700C274 680 294 668 304 660C314 668 334 680 334 700V720H374V794Z" fill="${shade(P.c2, -.35)}" opacity=".9"/>
        <rect x="183" y="592" width="8" height="28" fill="${shade(P.c2, -.35)}"/>`;
    }
    if (kind === 'back') return `<rect width="374" height="794" fill="${P.bg}"/><rect y="640" width="374" height="154" fill="${P.c2}"/>${stars(24, 650, 790, P.c1)}
      <polygon points="${starPts(187, 20, 30, 12, 8)}" fill="${P.c1}" opacity=".25"/>`;
    return `<rect width="374" height="794" fill="${P.bg}"/>${lantern(40, 60, .7)}${lantern(334, 40, .6)}
      <polygon points="${starPts(187, 794, 120, 56, 8)}" fill="${P.c1}" opacity=".10"/>
      <polygon points="${starPts(187, 794, 70, 34, 8)}" fill="none" stroke="${P.c1}" stroke-opacity=".35" stroke-width="1.5"/>`;
  }
};

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

const KIND_CLASS = { cover:'cv', flap:'fl', p1:'in', p2:'in', p3:'in', back:'bk' };

function ctxFor(tplId, content, imgs, opts = {}) {
  const t = TPL[tplId];
  const P = palette(t, opts.color);
  const font = (opts.font && opts.font !== 'auto') ? opts.font : t.font;
  return { t, P, font, c: content, img: imgs || {}, rtl: (opts.clang || 'ar') === 'ar', lang: opts.clang || 'ar', qr: opts.qr };
}

function panelHTML(kind, ctx) {
  const { t, P, c, img } = ctx;
  const cls = `pn T-${t.id} ${KIND_CLASS[kind]}`;
  const seed = { cover:3, flap:5, p1:7, p2:11, p3:13, back:17 }[kind];
  const decoKind = (kind === 'p1' || kind === 'p2' || kind === 'p3') ? 'inner' : kind;
  let svg = DECO[t.id](decoKind, P, seed);
  if (t.mirror && ctx.rtl) svg = `<g transform="translate(374 0) scale(-1 1)">${svg}</g>`;
  const style = `--c1:${P.c1};--c2:${P.c2};--c3:${P.c3};--c4:${P.c4};--bg-p:${P.bg};--ink-p:${P.ink};--f:'${ctx.font}','Tajawal',sans-serif;`;
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
  return `<div class="${cls}" data-kind="${kind}" style="${style}"><div class="deco"><svg viewBox="0 0 374 794" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">${svg}</svg></div><div class="ct">${body}</div></div>`;
}

function sheetHTML(side, ctx) {
  const kinds = side === 'out' ? ['flap', 'back', 'cover'] : ['p1', 'p2', 'p3'];
  return `<div class="sheet" dir="${ctx.rtl ? 'rtl' : 'ltr'}" lang="${ctx.lang}">${kinds.map(k => panelHTML(k, ctx)).join('')}</div>`;
}

function fitPanel(pn, fixedK) {
  if (fixedK) { pn.style.setProperty('--k', fixedK); return +fixedK; }
  const ct = pn.querySelector('.ct');
  let k = 1;
  pn.style.setProperty('--k', '1');
  while (ct.scrollHeight > ct.clientHeight + 1 && k > 0.5) { k -= 0.04; pn.style.setProperty('--k', k.toFixed(2)); }
  return +k.toFixed(2);
}
function fitAll(root, useMap) {
  $$('.pn', root).forEach(pn => {
    const kind = pn.dataset.kind;
    const k = fitPanel(pn, useMap ? kmap[kind] : null);
    if (!useMap) kmap[kind] = k;
  });
}
function fitThumbs(root) { $$('.pn', root).forEach(pn => fitPanel(pn)); }

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
  return ctxFor(st.tpl, st.c, st.img, { color: st.color, font: st.font, clang: st.clang, qr: qrData() });
}

/* ---------------------------------------------------------
   Flat view
--------------------------------------------------------- */
const holderOut = $('#holderOut'), holderIn = $('#holderIn');
function renderFlat() {
  const ctx = currentCtx();
  const lines = `<span class="fold-line" style="left:${PW}px"></span><span class="fold-line" style="left:${PW * 2}px"></span>`;
  holderOut.innerHTML = sheetHTML('out', ctx);
  holderIn.innerHTML = sheetHTML('in', ctx);
  $$('.sheet', holderOut).concat($$('.sheet', holderIn)).forEach(sh => sh.insertAdjacentHTML('beforeend', lines));
  fitAll(holderOut); fitAll(holderIn);
  applyZoom();
  highlight();
}
function stageFitScale() {
  const stage = $('#stage');
  const w = stage.clientWidth - 60, h = stage.clientHeight - 150;
  return Math.max(0.2, Math.min(w / SW, h / PH, 1.4));
}
function applyZoom() {
  const s = zoom === 'fit' ? stageFitScale() : zoom;
  [holderOut, holderIn].forEach(h => {
    h.style.width = (SW * s) + 'px'; h.style.height = (PH * s) + 'px';
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
  $$('.sheet-holder .pn').forEach(p => p.classList.toggle('hl', !!openSec && p.dataset.kind === openSec));
}

/* ---------------------------------------------------------
   3D view
--------------------------------------------------------- */
const rig = $('#rig'), scene = $('#scene');
function render3d() {
  const ctx = currentCtx();
  const P = k => panelHTML(k, ctx);
  const inV = ctx.rtl ? ['p3', 'p2', 'p1'] : ['p1', 'p2', 'p3'];
  const lBack = ctx.rtl ? 'flap' : 'cover';
  const rBack = ctx.rtl ? 'cover' : 'flap';
  const coverLeft = !ctx.rtl;
  rig.innerHTML =
    `<div class="p3 l ${coverLeft ? 'coverw' : 'first'}"><div class="face front">${P(inV[0])}</div><div class="face back">${P(lBack)}</div></div>` +
    `<div class="p3 c"><div class="face front">${P(inV[1])}</div><div class="face back">${P('back')}</div></div>` +
    `<div class="p3 r ${coverLeft ? 'first' : 'coverw'}"><div class="face front">${P(inV[2])}</div><div class="face back">${P(rBack)}</div></div>`;
  fitAll(rig, true);
  applyFold(false);
  apply3dScale();
  applyRot();
}
function applyFold(animate = true) {
  const L = rig.querySelector('.p3.l'), R = rig.querySelector('.p3.r');
  if (!L || !R) return;
  if (!animate) { L.style.transition = R.style.transition = 'none'; }
  const zL = L.classList.contains('coverw') ? 2 : 1, zR = R.classList.contains('coverw') ? 2 : 1;
  if (folded) {
    L.style.transform = `translateZ(${zL}px) rotateY(180deg)`;
    R.style.transform = `translateZ(${zR}px) rotateY(-180deg)`;
  } else {
    L.style.transform = 'rotateY(14deg)';
    R.style.transform = 'rotateY(-14deg)';
  }
  rig.classList.toggle('folded', folded);
  rig.classList.toggle('half', !folded);
  if (!animate) { void rig.offsetWidth; L.style.transition = R.style.transition = ''; }
  $('#btnFold span').textContent = folded ? T('unfold') : T('fold');
}
function apply3dScale() {
  const w = scene.clientWidth, h = scene.clientHeight;
  const s = Math.max(0.2, Math.min(w / 1560, h / 1080));
  $('#rigScale').style.transform = `scale(${s})`;
}
function applyRot() { rig.style.transform = `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`; }

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
const SECTIONS = [
  { id:'style' },
  { id:'cover', fields:[['cover.title','text','f_title'],['cover.sub','area','f_sub'],['cover.org','text','f_org'],['cover.badge','text','f_badge','f_badge_h'],['logo','img','f_logo'],['cover','img','f_cimg']] },
  { id:'flap', fields:[['flap.title','text','f_head'],['flap.text','area','f_text']] },
  { id:'p1', fields:[['p1.title','text','f_head'],['p1.text','area','f_text'],['p1','img','f_img']] },
  { id:'p2', fields:[['p2.title','text','f_head'],['p2.text','area','f_text'],['p2','img','f_img']] },
  { id:'p3', fields:[['p3.title','text','f_head'],['p3.list','area','f_list','f_list_h']] },
  { id:'back', fields:[['back.title','text','f_head'],['back.text','area','f_text'],['phone','text','f_phone'],['email','text','f_email'],['addr','text','f_addr'],['web','text','f_web'],['qr','toggle','f_qr']] }
];
const CHEV = '<svg class="acc-chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>';
const PLUS_IMG = '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/></svg>';
const XICON = '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>';
const NEXT = '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>';

function styleSectionHTML() {
  const t = TPL[st.tpl];
  const sw = COLORS.map(c => `<button type="button" class="sw ${st.color === c ? 'on' : ''}" data-color="${c}" style="background:${c}" aria-label="${c}"></button>`).join('');
  const custom = st.color && !COLORS.includes(st.color) ? st.color : '#888888';
  return `
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
  acc.innerHTML = SECTIONS.map((sec, i) => {
    const content = sec.id === 'style' ? styleSectionHTML() : sec.fields.map(fieldHTML).join('');
    const last = i === SECTIONS.length - 1;
    return `<section class="acc ${openSec === sec.id ? 'open' : ''}" data-sec="${sec.id}">
      <button type="button" class="acc-head"><span class="acc-ico">${SEC_ICONS[sec.id]}</span>
        <span class="acc-title"><b>${T('sec_' + sec.id)}</b><small>${T('sec_' + sec.id + '_d')}</small></span>
        ${sec.id !== 'style' ? '<span class="acc-state"></span>' : ''}${CHEV}</button>
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

function updateStates() {
  SECTIONS.forEach(sec => {
    if (!sec.fields) return;
    const keys = sec.fields.filter(f => f[1] === 'text' || f[1] === 'area').filter(f => f[0] !== 'cover.badge').map(f => f[0]);
    const n = keys.filter(k => (st.c[k] || '').trim()).length;
    const dot = $(`.acc[data-sec="${sec.id}"] .acc-state`);
    if (dot) dot.className = 'acc-state' + (n === 0 ? '' : n === keys.length ? ' full' : ' part');
  });
}

/* events: sidebar */
$('#accordion').addEventListener('click', e => {
  const head = e.target.closest('.acc-head');
  if (head) { toggleSec(head.closest('.acc').dataset.sec); return; }
  const nx = e.target.closest('[data-next]');
  if (nx) {
    const i = +nx.dataset.next;
    const nextSec = SECTIONS[i + 1];
    toggleSec(nextSec ? nextSec.id : null, !!nextSec);
    if (nextSec) setTimeout(() => $(`.acc[data-sec="${nextSec.id}"]`).scrollIntoView({ behavior:'smooth', block:'nearest' }), 280);
    return;
  }
  const sw = e.target.closest('.sw[data-color]');
  if (sw) { st.color = sw.dataset.color || null; refreshStyleSection(); scheduleRender(); return; }
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
let gCat = 'all';
function miniOutside(tplId, forCard) {
  const useUser = st.dirty;
  const lang = st.clang;
  const content = useUser ? st.c : sampleFor(tplId, lang);
  const imgs = useUser ? st.img : {};
  const color = tplId === st.tpl ? st.color : null;
  const ctx = ctxFor(tplId, content, imgs, { color, font: tplId === st.tpl ? st.font : 'auto', clang: lang, qr: useUser ? qrData() : '' });
  return `<div class="mini">${sheetHTML('out', ctx)}</div>`;
}
function buildGallery() {
  $('#gCats').innerHTML = ['all', ...CATS].map(c => `<button type="button" class="chip ${gCat === c ? 'on' : ''}" data-cat="${c}">${T('cat_' + c)}</button>`).join('');
  $('#gFolds').innerHTML = `<button type="button" class="chip on">${T('fold3')}</button>` +
    ['fold2', 'foldZ', 'foldA5'].map(f => `<button type="button" class="chip" disabled>${T(f)}<span class="soon">· ${T('soon')}</span></button>`).join('');
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
      mini.style.transform = `scale(${th.clientWidth / SW})`;
    });
  });
}
function openGallery() { $('#gallery').classList.remove('hidden'); buildGallery(); $('#gSearch').focus(); }
function closeGallery() { $('#gallery').classList.add('hidden'); }
$('#btnGallery').addEventListener('click', openGallery);
$('#gClose').addEventListener('click', closeGallery);
$('#gallery').addEventListener('click', e => {
  if (e.target.id === 'gallery') { closeGallery(); return; }
  const c = e.target.closest('[data-cat]');
  if (c) { gCat = c.dataset.cat; $$('#gCats .chip').forEach(x => x.classList.toggle('on', x === c)); renderGrid(); return; }
  const card = e.target.closest('[data-tpl]');
  if (card) {
    st.tpl = card.dataset.tpl;
    st.color = null; st.font = 'auto';
    if (!st.dirty) st.c = sampleFor(st.tpl, st.clang);
    closeGallery(); rebuildKeepOpen(); renderAll(); toast(T('t_tpl'));
  }
});
$('#gSearch').addEventListener('input', renderGrid);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#gallery').classList.contains('hidden')) closeGallery(); });

function renderCurrentThumb() {
  const box = $('#currentThumb');
  const ctx = currentCtx();
  box.innerHTML = `<div class="mini">${sheetHTML('out', ctx)}</div>`;
  const mini = box.querySelector('.mini');
  fitAll(mini, true);
  mini.style.transform = `scale(${84 / SW})`;
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
    const pdf = new jsPDF({ orientation:'landscape', unit:'mm', format:'a4' });
    const sides = ['out', 'in'];
    for (let i = 0; i < sides.length; i++) {
      const root = buildPrint([sides[i]]);
      const sheet = root.querySelector('.sheet');
      await new Promise(r => setTimeout(r, 60));
      const canvas = await html2canvas(sheet, { scale: 2.5, backgroundColor:'#ffffff', useCORS:true, logging:false, width: SW, height: PH, windowWidth: SW, windowHeight: PH, scrollX: 0, scrollY: 0 });
      if (i > 0) pdf.addPage('a4', 'landscape');
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.93), 'JPEG', 0, 0, 297, 210);
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
  applyUiLang();
});
document.addEventListener('click', e => { if (!e.target.closest('.lang-wrap')) $('#langMenu').classList.add('hidden'); });

/* ---------------------------------------------------------
   Toolbar wiring
--------------------------------------------------------- */
$('#btnSave').addEventListener('click', () => saveNow(true));
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
