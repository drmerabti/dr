/* =========================================================
   مولّد المطويات — Premium templates ($1.99 each, one permanent purchase per template)
   Designs, sample texts (ar / fr / en) and SVG decorations. Loaded before app.js, which merges them.
   Decorations use literal colours (PDF export) and are drawn for any panel width W.
   Sale rules: app.js ("Premium templates") + Worker /api/brochure/*.
   ========================================================= */
window.BROCHURE_PREMIUM = (function () {
'use strict';

const templates = [
  { id:'lux', cat:'biz', premium:true, font:'Tajawal', fontH:'El Messiri',
    name:{ar:'هوية فاخرة', fr:'Prestige', en:'Prestige'},
    pal:{c1:'#C8A45C', c2:'#0E1A2B', c3:'#1C2D45', c4:'#FFFFFF', bg:'#FBF8F2', ink:'#1A2230'},
    s:{'cover.title':'التميّز عنوان عملنا','cover.sub':'استشارات وحلول متكاملة لإدارة المشاريع الكبرى','cover.org':'مجموعة الريادة القابضة',
      'flap.title':'رسالتنا','flap.text':'نصنع قيمة مستدامة لشركائنا عبر خبرة دقيقة، والتزام صارم بالجودة، وشفافية في كل خطوة.',
      'p1.title':'من نحن','p1.text':'مجموعة رائدة تأسست سنة 2005، تضم نخبة من الخبراء في الهندسة والمالية والتسيير.\nرافقنا أكثر من 300 مؤسسة في تطوير أعمالها داخل الوطن وخارجه.\nنعمل وفق أعلى المعايير الدولية، ونضع خبرتنا في خدمة رؤيتكم من الفكرة إلى التسليم.',
      'p2.title':'قيمنا','p2.text':'الدقة في التنفيذ، والأمانة في التعامل، والابتكار في الحلول.\nنؤمن أن الثقة تُبنى بالنتائج، لا بالوعود.\nكل مشروع نتولاه هو التزام شخصي بالتميّز، ومسؤولية نحملها حتى آخر تفصيل.',
      'p3.title':'خدماتنا','p3.list':'الاستشارات الاستراتيجية\nإدارة المشاريع الكبرى\nالتدقيق والرقابة المالية\nالتحول الرقمي للمؤسسات\nتكوين الإطارات القيادية\nالمرافقة القانونية والإدارية',
      'back.title':'لنبنِ المستقبل معًا','back.text':'يسعدنا استقبالكم في مقرّنا أو التواصل معكم لدراسة مشروعكم القادم.'} },

  { id:'clinic', cat:'aware', premium:true, mirror:true, font:'Cairo', fontH:'Cairo',
    name:{ar:'عيادة طبية', fr:'Clinique', en:'Medical clinic'},
    pal:{c1:'#0E7C86', c2:'#7FD1C7', c3:'#FF8A65', c4:'#FFFFFF', bg:'#F4FAFB', ink:'#17323A'},
    s:{'cover.title':'عيادة الشفاء المتخصصة','cover.sub':'رعاية طبية متكاملة بأحدث التجهيزات وأمهر الأطباء','cover.org':'طب عام · أمراض القلب · طب الأطفال',
      'flap.title':'مواعيد الاستقبال','flap.text':'من السبت إلى الخميس: 8:00 – 18:00\nالجمعة: الاستعجالات فقط.',
      'p1.title':'خدماتنا الطبية','p1.text':'فحوصات عامة ومتابعة الأمراض المزمنة كالسكري وارتفاع ضغط الدم.\nتخطيط القلب والفحص بالصدى في نفس اليوم.\nاستشارات التغذية والمتابعة الصحية للحوامل والأطفال، مع ملف طبي إلكتروني لكل مريض.',
      'p2.title':'لماذا نحن؟','p2.text':'فريق طبي ذو خبرة، وتجهيزات حديثة، وتحاليل سريعة النتائج في جو مريح وآمن لكل أفراد العائلة.\nنستقبلكم بمواعيد دقيقة دون انتظار طويل، ونرافقكم بالنصيحة بعد كل فحص.',
      'p3.title':'التخصصات','p3.list':'طب عام\nأمراض القلب والشرايين\nطب الأطفال\nالتحاليل الطبية\nتخطيط القلب والفحص بالصدى\nالتلقيح ومتابعة الحوامل',
      'back.title':'احجز موعدك','back.text':'اتصل بنا أو احجز عبر الموقع، ونحن نتكفل بالباقي.'} },

  { id:'academy', cat:'edu', premium:true, font:'Tajawal', fontH:'El Messiri',
    name:{ar:'دورة تكوينية', fr:'Formation', en:'Training course'},
    pal:{c1:'#7A1F3D', c2:'#D2A85E', c3:'#2E3A59', c4:'#FFFFFF', bg:'#FBF7F0', ink:'#2A2326'},
    s:{'cover.title':'دورة إدارة المشاريع الاحترافية','cover.sub':'برنامج تكويني معتمد يؤهلك لاجتياز شهادة PMP','cover.org':'مركز النخبة للتكوين والاستشارات',
      'flap.title':'لمن هذه الدورة؟','flap.text':'للمهندسين، والإطارات، وأصحاب المشاريع، وكل من يطمح لقيادة الفرق بكفاءة.',
      'p1.title':'عن البرنامج','p1.text':'40 ساعة تكوين حضوري مع مدرب معتمد، ودراسات حالة واقعية من بيئة العمل.\nتمارين تطبيقية وامتحانات تجريبية بعد كل وحدة.\nيُختتم البرنامج بمشروع تطبيقي يعرضه كل مشارك أمام لجنة من الخبراء.',
      'p2.title':'ماذا ستتعلم؟','p2.text':'تخطيط المشروع وتقدير التكاليف والآجال.\nإدارة المخاطر والجودة والفريق.\nأدوات المتابعة وإعداد التقارير.\nستحصل على حقيبة تدريبية كاملة ونماذج جاهزة للاستعمال في عملك اليومي.',
      'p3.title':'معلومات الدورة','p3.list':'المدة: 5 أسابيع\nالتوقيت: كل سبت 9:00 – 16:00\nشهادة معتمدة في نهاية الدورة\nالمقاعد محدودة: 20 مشاركًا\nحقيبة تدريبية ونماذج جاهزة\nمتابعة بعد الدورة لمدة 3 أشهر',
      'back.title':'سجّل الآن','back.text':'التسجيلات مفتوحة إلى غاية 30 من الشهر، مع تخفيض 15% للطلبة.'} },

  { id:'tech', cat:'biz', premium:true, mirror:true, font:'Cairo', fontH:'Changa',
    name:{ar:'شركة تقنية', fr:'Tech', en:'Tech company'},
    pal:{c1:'#22D3EE', c2:'#0B1020', c3:'#8B5CF6', c4:'#FFFFFF', bg:'#0F1629', ink:'#E6ECF5'},
    s:{'cover.title':'نحوّل أفكارك إلى حلول رقمية','cover.sub':'تطوير التطبيقات، الأتمتة الصناعية، والذكاء الاصطناعي','cover.org':'Nova Tech',
      'flap.title':'بالأرقام','flap.text':'أكثر من 120 مشروعًا منجزًا، و40 مؤسسة تثق بنا، و99% نسبة رضا العملاء.',
      'p1.title':'من نحن','p1.text':'فريق شاب من المهندسين والمطوّرين، نصمّم أنظمة ذكية تجعل عمل مؤسستك أسرع وأدق وأقل تكلفة.\nنجمع بين خبرة الميدان الصناعي وأحدث تقنيات البرمجة لنقدّم حلولًا عملية قابلة للتطوير.',
      'p2.title':'كيف نعمل','p2.text':'نحلل احتياجك، نصمّم النموذج الأولي، نطوّر ونختبر، ثم نرافقك بعد التسليم بالصيانة والتحديث.\nنعتمد منهجية مرنة بتسليمات أسبوعية، لتتابع تقدّم مشروعك خطوة بخطوة.',
      'p3.title':'خدماتنا','p3.list':'تطبيقات الويب والهاتف\nأنظمة SCADA ومراقبة المصانع\nتحليل البيانات ولوحات القيادة\nحلول الذكاء الاصطناعي\nالأمن السيبراني وحماية البيانات\nالصيانة والدعم التقني',
      'back.title':'لنبدأ مشروعك','back.text':'استشارة أولى مجانية لدراسة فكرتك واقتراح الحل الأنسب.'} },

  { id:'solar', cat:'biz', premium:true, mirror:true, font:'Cairo', fontH:'Cairo',
    name:{ar:'طاقة شمسية', fr:'Énergie solaire', en:'Solar energy'},
    pal:{c1:'#F59E0B', c2:'#0B3B66', c3:'#38BDF8', c4:'#FFFFFF', bg:'#F7FAFC', ink:'#0F2740'},
    s:{'cover.title':'طاقة الشمس لبيتك ومؤسستك','cover.sub':'ألواح شمسية بضمان 25 سنة ووفر يصل إلى 70% من فاتورة الكهرباء','cover.org':'شركة ضياء للطاقات المتجددة',
      'flap.title':'هل تعلم؟','flap.text':'تتلقى الجزائر أكثر من 3000 ساعة شمس سنويًا، وهي من أعلى النسب في العالم.',
      'p1.title':'لماذا الطاقة الشمسية؟','p1.text':'طاقة نظيفة ومجانية لا تنفد، تحميك من ارتفاع الأسعار وانقطاع التيار، وتزيد من قيمة عقارك.\nتسترجع تكلفة تركيب نظامك خلال سنوات قليلة، ثم تستفيد من كهرباء شبه مجانية لعقود.',
      'p2.title':'حلولنا','p2.text':'أنظمة متصلة بالشبكة للمنازل والمحلات.\nأنظمة مستقلة بالبطاريات للمناطق المعزولة.\nضخ المياه بالطاقة الشمسية للفلاحين.\nنستعمل ألواحًا ومحولات من علامات عالمية معتمدة، مع ضمان على التركيب والتجهيزات.',
      'p3.title':'مراحل المشروع','p3.list':'دراسة مجانية للاستهلاك\nتصميم النظام وعرض السعر\nالتركيب في 48 ساعة\nالمتابعة والصيانة الدورية\nمراقبة الإنتاج عبر الهاتف\nضمان 25 سنة على الألواح',
      'back.title':'اطلب دراستك المجانية','back.text':'يتنقل مهندسونا إليك لتقييم سطحك واستهلاكك دون أي التزام.'} },

  { id:'realty', cat:'promo', premium:true, mirror:true, font:'Tajawal', fontH:'Cairo',
    name:{ar:'مشروع عقاري', fr:'Immobilier', en:'Real estate'},
    badge:{ar:'جديد', fr:'Nouveau', en:'New'},
    pal:{c1:'#B87333', c2:'#1F2933', c3:'#ECE6DC', c4:'#FFFFFF', bg:'#FAF8F5', ink:'#1F2933'},
    s:{'cover.title':'إقامة الياسمين','cover.sub':'شقق راقية بإطلالة مميزة في قلب المدينة','cover.org':'مرقّي عقاري معتمد',
      'flap.title':'موقع استراتيجي','flap.text':'على بعد دقائق من الجامعة، والمستشفى، والمراكز التجارية، ومحطة الترامواي.',
      'p1.title':'عن المشروع','p1.text':'إقامة مغلقة ومحروسة من 6 عمارات، بمواد بناء عالية الجودة وتشطيبات عصرية.\nمساحات خضراء، وموقف سيارات تحت أرضي، ومصاعد في كل عمارة.\nتسليم المفاتيح مضمون في الآجال، مع عقود موثقة ودفتر شروط واضح.',
      'p2.title':'مزايا الإقامة','p2.text':'حراسة على مدار الساعة وكاميرات مراقبة.\nتدفئة مركزية وعزل حراري وصوتي.\nفضاء لعب للأطفال وقاعة رياضة.\nواجهات عصرية ونوافذ بزجاج مزدوج، ومداخل فخمة تستقبلكم كل يوم.',
      'p3.title':'الأسعار','p3.list':'شقة F2 · 68 م² | 9 800 000 دج\nشقة F3 · 92 م² | 13 500 000 دج\nشقة F4 · 118 م² | 17 200 000 دج\nمحل تجاري · 45 م² | 8 000 000 دج\nشقة F5 · 140 م² | 21 000 000 دج',
      'back.title':'زوروا الشقة النموذجية','back.text':'مكتب المبيعات مفتوح يوميًا، مع إمكانية الدفع بالتقسيط والتمويل البنكي.'} },

  { id:'kids', cat:'school', premium:true, mirror:true, font:'Almarai', fontH:'Lalezar',
    name:{ar:'روضة أطفال', fr:'Crèche', en:'Kindergarten'},
    pal:{c1:'#FF6B6B', c2:'#2BB5AA', c3:'#FFC93C', c4:'#6C5CE7', bg:'#FFFBF0', ink:'#2D3047'},
    s:{'cover.title':'روضة البراعم','cover.sub':'نتعلم ونلعب ونكبر معًا في جو آمن ومحب','cover.org':'التسجيلات مفتوحة للموسم الجديد',
      'flap.title':'رسالتنا','flap.text':'نؤمن أن كل طفل موهوب، ونرافقه ليكتشف قدراته بفرح وثقة.',
      'p1.title':'برنامجنا','p1.text':'تعليم الحروف والأرقام بطرق ممتعة، وحفظ القرآن الكريم، وأنشطة فنية ورياضية يومية.\nنعلّم الأطفال اللغات بالأناشيد والقصص، وننمّي مهاراتهم بالرسم والتلوين والتركيب.',
      'p2.title':'يومنا في الروضة','p2.text':'استقبال وفطور صحي، ثم ورشات التعلم واللعب، ووجبة غداء متوازنة، وقيلولة هادئة.\nفي نهاية اليوم يعود طفلك سعيدًا، ومعه ما تعلّمه ليشاركه معك.',
      'p3.title':'لماذا روضتنا؟','p3.list':'مربيات مؤهلات\nأقسام مكيّفة ومجهزة\nنقل مدرسي آمن\nمتابعة يومية للأولياء\nحديقة ألعاب آمنة\nوجبات صحية متوازنة',
      'back.title':'سجّل طفلك الآن','back.text':'الأماكن محدودة، زورونا للتعرف على فضاءاتنا وفريقنا.'} },

  { id:'wedding', cat:'occ', premium:true, mirror:true, font:'Amiri', fontH:'Aref Ruqaa',
    name:{ar:'دعوة زفاف', fr:'Faire-part de mariage', en:'Wedding invitation'},
    pal:{c1:'#B08D57', c2:'#E8C4C4', c3:'#7D8F69', c4:'#FFFFFF', bg:'#FFFBF7', ink:'#4A3B35'},
    s:{'cover.title':'أمين & سارة','cover.sub':'بكل الحب والفرح ندعوكم لمشاركتنا حفل زفافنا','cover.org':'الخميس 12 جوان 2027',
      'flap.title':'بسم الله الرحمن الرحيم','flap.text':'﴿ومن آياته أن خلق لكم من أنفسكم أزواجًا لتسكنوا إليها وجعل بينكم مودة ورحمة﴾',
      'p1.title':'قصتنا','p1.text':'بدأت حكايتنا بلقاء بسيط، وكبرت بالمودة والاحترام، واليوم نتوّجها بميثاق غليظ أمام الله وأمامكم.\nنشكر عائلتينا على دعمهما ومحبتهما، ويسعدنا أن تكونوا شهودًا على فرحتنا.',
      'p2.title':'مكان الحفل','p2.text':'قاعة الأفراح «القصر الذهبي»، الطريق الوطني رقم 5.\nتتوفر مواقف للسيارات أمام القاعة.\nيُرجى من الضيوف الحضور قبل الموعد بقليل، وستُقدَّم القهوة والحلويات التقليدية عند الاستقبال.',
      'p3.title':'برنامج الحفل','p3.list':'استقبال المدعوين | 18:00\nالعشاء | 19:30\nقطع الكعكة | 21:00\nالسهرة | 21:30\nالتصوير التذكاري | 22:30\nختام الحفل | 23:30',
      'back.title':'حضوركم يسعدنا','back.text':'نرجو تأكيد حضوركم قبل 1 جوان. دمتم بسعادة.'} },

  { id:'travel', cat:'promo', premium:true, mirror:true, font:'Tajawal', fontH:'Cairo',
    name:{ar:'وكالة سياحة', fr:'Agence de voyages', en:'Travel agency'},
    pal:{c1:'#0EA5A4', c2:'#F4A261', c3:'#264653', c4:'#FFFFFF', bg:'#FFFDF8', ink:'#1D3540'},
    s:{'cover.title':'اكتشف العالم معنا','cover.sub':'رحلات منظمة، فنادق مختارة، وأسعار تناسب الجميع','cover.org':'وكالة الأفق للسياحة والأسفار',
      'flap.title':'عروض الصيف','flap.text':'احجز قبل 31 ماي واستفد من تخفيض 10% على كل الرحلات العائلية.',
      'p1.title':'وجهاتنا','p1.text':'إسطنبول، كوالالمبور، القاهرة، تونس ودبي، إضافة إلى أجمل وجهات الجنوب الجزائري: تمنراست، جانت وتاغيت.\nبرامج متكاملة تشمل الطيران والإقامة والجولات السياحية مع مرشد يتحدث العربية.',
      'p2.title':'خدماتنا','p2.text':'حجز تذاكر الطيران والفنادق.\nملفات التأشيرة والتأمين.\nرحلات العمرة المنظمة مع مرافقين ذوي خبرة.\nفريقنا متاح على مدار الساعة طوال رحلتك، لتسافر بقلب مطمئن.',
      'p3.title':'أسعار مختارة','p3.list':'إسطنبول · 7 أيام | 145 000 دج\nتونس · 5 أيام | 68 000 دج\nتاغيت · 4 أيام | 42 000 دج\nالعمرة · 15 يومًا | 320 000 دج\nدبي · 6 أيام | 189 000 دج',
      'back.title':'رحلتك تبدأ هنا','back.text':'زورونا في مقر الوكالة أو اتصلوا بنا لتصميم رحلتكم على المقاس.'} },

  { id:'islamic', cat:'occ', premium:true, font:'Amiri', fontH:'Reem Kufi',
    name:{ar:'زخرفة إسلامية', fr:'Arabesque', en:'Arabesque'},
    pal:{c1:'#C9A44C', c2:'#0F4C3A', c3:'#1B6B54', c4:'#FFFFFF', bg:'#F8F5EC', ink:'#1E2A24'},
    s:{'cover.title':'المسابقة الولائية لحفظ القرآن الكريم','cover.sub':'الطبعة العاشرة — تحت شعار: القرآن نور وهداية','cover.org':'مسجد النور · الجمعية الدينية',
      'flap.title':'قال رسول الله ﷺ','flap.text':'«خيركم من تعلّم القرآن وعلّمه»\nرواه البخاري',
      'p1.title':'عن المسابقة','p1.text':'مسابقة سنوية تهدف إلى تشجيع الناشئة على حفظ كتاب الله وتجويده، وتكريم حفظته من مختلف الأعمار.\nتُختتم المسابقة بحفل تكريم كبير تُوزَّع فيه جوائز قيّمة على الفائزين وشهادات تقدير لكل المشاركين.',
      'p2.title':'فئات المسابقة','p2.text':'الفئة الأولى: حفظ القرآن كاملًا.\nالفئة الثانية: حفظ 30 حزبًا.\nالفئة الثالثة: حفظ 10 أحزاب للأطفال دون 12 سنة.\nيتولى التحكيم نخبة من المقرئين والأساتذة المجازين، وفق معايير الحفظ وأحكام التجويد.',
      'p3.title':'شروط المشاركة','p3.list':'ملء استمارة التسجيل\nصورتان شمسيتان\nنسخة من شهادة الميلاد\nآخر أجل: 15 رمضان\nموافقة الولي للقُصّر\nحضور الاختبار التمهيدي',
      'back.title':'للتسجيل والاستفسار','back.text':'تُستقبل الملفات بمكتب المسجد بعد صلاة العصر يوميًا.'} }
];

/* French and English samples, in the order of app.js K: cover.title, cover.sub, cover.org, flap.title, flap.text,
   p1.title, p1.text, p2.title, p2.text, p3.title, p3.list, back.title, back.text */
const samples = {
  lux: {
    fr: ['L’excellence, notre signature','Conseil et solutions intégrées pour les grands projets','Groupe Er-Riada Holding',
      'Notre mission','Créer une valeur durable pour nos partenaires grâce à une expertise pointue, une exigence de qualité et une transparence totale.',
      'Qui sommes-nous','Un groupe fondé en 2005 qui réunit des experts en ingénierie, en finance et en management.\nNous avons accompagné plus de 300 entreprises en Algérie et à l’étranger.\nNous appliquons les meilleurs standards internationaux et mettons notre savoir-faire au service de votre vision, de l’idée à la livraison.',
      'Nos valeurs','Rigueur dans l’exécution, intégrité dans la relation, innovation dans les solutions.\nLa confiance se gagne par les résultats, pas par les promesses.\nChaque projet que nous menons est un engagement personnel envers l’excellence, jusqu’au moindre détail.',
      'Nos services','Conseil stratégique\nGestion de grands projets\nAudit et contrôle financier\nTransformation numérique\nFormation des dirigeants\nAccompagnement juridique et administratif',
      'Construisons l’avenir ensemble','Nous serons heureux de vous recevoir ou d’étudier avec vous votre prochain projet.'],
    en: ['Excellence is our signature','Consulting and integrated solutions for major projects','Er-Riada Holding Group',
      'Our mission','We create lasting value for our partners through sharp expertise, a strict commitment to quality and full transparency.',
      'Who we are','A group founded in 2005 that brings together experts in engineering, finance and management.\nWe have supported more than 300 companies at home and abroad.\nWe work to the highest international standards and put our expertise at the service of your vision, from idea to delivery.',
      'Our values','Precision in delivery, integrity in every relationship, innovation in every solution.\nTrust is built on results, not promises.\nEvery project we take on is a personal commitment to excellence, down to the last detail.',
      'Our services','Strategic consulting\nMajor project management\nAudit and financial control\nDigital transformation\nLeadership training\nLegal and administrative support',
      'Let’s build the future together','We would be glad to welcome you or to study your next project with you.']
  },
  clinic: {
    fr: ['Clinique Ech-Chifa','Des soins complets avec des équipements modernes et des médecins expérimentés','Médecine générale · Cardiologie · Pédiatrie',
      'Horaires','Du samedi au jeudi : 8h00 – 18h00\nVendredi : urgences uniquement.',
      'Nos soins','Bilans de santé et suivi des maladies chroniques comme le diabète et l’hypertension.\nÉlectrocardiogramme et échographie le jour même.\nConseils en nutrition, suivi des femmes enceintes et des enfants, avec un dossier médical électronique pour chaque patient.',
      'Pourquoi nous ?','Une équipe expérimentée, des équipements récents et des analyses aux résultats rapides, dans un cadre calme et sûr pour toute la famille.\nDes rendez-vous ponctuels sans longue attente, et des conseils après chaque consultation.',
      'Spécialités','Médecine générale\nCardiologie\nPédiatrie\nAnalyses médicales\nÉchographie et ECG\nVaccination et suivi de grossesse',
      'Prenez rendez-vous','Appelez-nous ou réservez en ligne, nous nous occupons du reste.'],
    en: ['Ech-Chifa Clinic','Complete medical care with modern equipment and experienced doctors','General practice · Cardiology · Paediatrics',
      'Opening hours','Saturday to Thursday: 8:00 am – 6:00 pm\nFriday: emergencies only.',
      'Our care','Check-ups and follow-up of chronic conditions such as diabetes and high blood pressure.\nECG and ultrasound on the same day.\nNutrition advice, pregnancy and child follow-up, with an electronic medical record for every patient.',
      'Why choose us?','An experienced team, up-to-date equipment and fast lab results, in a calm and safe setting for the whole family.\nOn-time appointments without long waits, and advice after every visit.',
      'Specialities','General practice\nCardiology\nPaediatrics\nLab tests\nUltrasound and ECG\nVaccination and pregnancy care',
      'Book an appointment','Call us or book online, and we take care of the rest.']
  },
  academy: {
    fr: ['Formation en gestion de projet','Un programme certifiant qui vous prépare au PMP','Centre En-Nokhba de formation',
      'Pour qui ?','Ingénieurs, cadres, porteurs de projets et toute personne qui veut diriger une équipe avec efficacité.',
      'Le programme','40 heures en présentiel avec un formateur certifié et des études de cas réelles.\nExercices pratiques et examens blancs après chaque module.\nLe programme se termine par un projet pratique présenté devant un jury d’experts.',
      'Vous apprendrez','Planifier un projet, estimer coûts et délais.\nGérer les risques, la qualité et l’équipe.\nSuivre l’avancement et rédiger les rapports.\nVous recevrez un kit de formation complet et des modèles prêts à l’emploi pour votre travail quotidien.',
      'Infos pratiques','Durée : 5 semaines\nChaque samedi de 9h00 à 16h00\nAttestation certifiée en fin de formation\nPlaces limitées : 20 participants\nKit de formation et modèles prêts\nSuivi de 3 mois après la formation',
      'Inscrivez-vous','Inscriptions ouvertes jusqu’au 30 du mois, 15 % de réduction pour les étudiants.'],
    en: ['Professional Project Management','A certified programme that prepares you for the PMP exam','En-Nokhba Training Centre',
      'Who is it for?','Engineers, managers, entrepreneurs and anyone who wants to lead a team with confidence.',
      'The programme','40 hours in class with a certified trainer and real case studies.\nPractical exercises and mock exams after each module.\nThe programme ends with a practical project that each participant presents to a panel of experts.',
      'What you will learn','Planning a project and estimating cost and time.\nManaging risk, quality and the team.\nTracking progress and writing reports.\nYou will receive a full training kit and ready-to-use templates for your daily work.',
      'Course details','Length: 5 weeks\nEvery Saturday, 9:00 am – 4:00 pm\nCertified diploma at the end\nLimited to 20 participants\nTraining kit and ready templates\n3 months of follow-up after the course',
      'Register now','Registration is open until the 30th, with 15% off for students.']
  },
  tech: {
    fr: ['Vos idées en solutions numériques','Applications, automatisation industrielle et intelligence artificielle','Nova Tech',
      'En chiffres','Plus de 120 projets livrés, 40 entreprises qui nous font confiance et 99 % de clients satisfaits.',
      'Qui sommes-nous','Une jeune équipe d’ingénieurs et de développeurs qui conçoit des systèmes intelligents pour rendre votre entreprise plus rapide, plus précise et moins coûteuse.\nNous allions l’expérience du terrain industriel aux technologies logicielles les plus récentes pour des solutions pratiques et évolutives.',
      'Notre méthode','Nous analysons votre besoin, concevons le prototype, développons et testons, puis assurons maintenance et mises à jour après la livraison.\nUne méthode agile avec des livraisons chaque semaine, pour suivre votre projet pas à pas.',
      'Nos services','Applications web et mobiles\nSCADA et supervision d’usine\nAnalyse de données et tableaux de bord\nSolutions d’IA\nCybersécurité et protection des données\nMaintenance et support technique',
      'Lançons votre projet','Première consultation gratuite pour étudier votre idée et proposer la meilleure solution.'],
    en: ['We turn your ideas into digital solutions','Apps, industrial automation and artificial intelligence','Nova Tech',
      'In numbers','More than 120 projects delivered, 40 companies that trust us and 99% customer satisfaction.',
      'Who we are','A young team of engineers and developers building smart systems that make your business faster, more accurate and less costly.\nWe combine hands-on industrial experience with the latest software technology to deliver practical, scalable solutions.',
      'How we work','We study your needs, design a prototype, build and test, then stay with you after delivery for maintenance and updates.\nAn agile method with weekly deliveries, so you can follow your project step by step.',
      'Our services','Web and mobile apps\nSCADA and plant monitoring\nData analysis and dashboards\nAI solutions\nCybersecurity and data protection\nMaintenance and technical support',
      'Let’s start your project','A free first consultation to study your idea and suggest the best solution.']
  },
  solar: {
    fr: ['L’énergie du soleil chez vous','Panneaux solaires garantis 25 ans, jusqu’à 70 % d’économie sur l’électricité','Diaa Énergies Renouvelables',
      'Le saviez-vous ?','L’Algérie reçoit plus de 3000 heures de soleil par an, l’un des taux les plus élevés au monde.',
      'Pourquoi le solaire ?','Une énergie propre, gratuite et inépuisable qui vous protège des hausses de prix et des coupures, et valorise votre bien.\nVotre installation est amortie en quelques années, puis vous profitez d’une électricité quasi gratuite pendant des décennies.',
      'Nos solutions','Systèmes raccordés au réseau pour maisons et commerces.\nSystèmes autonomes avec batteries pour les zones isolées.\nPompage solaire pour les agriculteurs.\nPanneaux et onduleurs de marques internationales certifiées, avec garantie sur l’installation et le matériel.',
      'Étapes du projet','Étude gratuite de la consommation\nConception et devis\nInstallation en 48 heures\nSuivi et maintenance\nSuivi de la production sur mobile\nPanneaux garantis 25 ans',
      'Demandez votre étude gratuite','Nos ingénieurs se déplacent pour évaluer votre toit et votre consommation, sans engagement.'],
    en: ['Solar power for your home and business','Solar panels with a 25-year warranty and up to 70% off your power bill','Diaa Renewable Energy',
      'Did you know?','Algeria gets more than 3,000 hours of sunshine a year, one of the highest rates in the world.',
      'Why solar?','Clean, free and endless energy that protects you from price rises and power cuts, and adds value to your property.\nYour system pays for itself in a few years, then gives you almost free electricity for decades.',
      'Our solutions','Grid-tied systems for homes and shops.\nOff-grid battery systems for remote areas.\nSolar water pumping for farmers.\nWe use certified panels and inverters from global brands, with a warranty on installation and equipment.',
      'Project steps','Free energy-use study\nSystem design and quote\nInstallation in 48 hours\nFollow-up and maintenance\nProduction monitoring on your phone\n25-year panel warranty',
      'Ask for your free study','Our engineers come to you to assess your roof and your usage, with no obligation.']
  },
  realty: {
    fr: ['Résidence El Yasmine','Des appartements haut de gamme au cœur de la ville','Promoteur immobilier agréé',
      'Emplacement idéal','À quelques minutes de l’université, de l’hôpital, des centres commerciaux et du tramway.',
      'Le projet','Résidence fermée et gardée de 6 immeubles, matériaux de qualité et finitions modernes.\nEspaces verts, parking souterrain et ascenseurs dans chaque immeuble.\nRemise des clés garantie dans les délais, contrats notariés et cahier des charges clair.',
      'Les atouts','Gardiennage 24h/24 et vidéosurveillance.\nChauffage central, isolation thermique et phonique.\nAire de jeux et salle de sport.\nFaçades modernes, double vitrage et halls d’entrée élégants pour vous accueillir chaque jour.',
      'Les prix','F2 · 68 m² | 9 800 000 DA\nF3 · 92 m² | 13 500 000 DA\nF4 · 118 m² | 17 200 000 DA\nLocal commercial · 45 m² | 8 000 000 DA\nF5 · 140 m² | 21 000 000 DA',
      'Visitez l’appartement témoin','Bureau de vente ouvert tous les jours, paiement échelonné et financement bancaire possibles.'],
    en: ['El Yasmine Residence','Premium apartments in the heart of the city','Licensed property developer',
      'Prime location','Minutes from the university, the hospital, shopping centres and the tram.',
      'The project','A gated, guarded residence of 6 buildings with quality materials and modern finishes.\nGreen spaces, underground parking and lifts in every building.\nKeys handed over on time, with notarised contracts and clear specifications.',
      'Highlights','24/7 security and CCTV.\nCentral heating with heat and sound insulation.\nPlayground and gym.\nModern façades, double glazing and elegant entrance halls to welcome you every day.',
      'Prices','2-room flat · 68 m² | 9,800,000 DA\n3-room flat · 92 m² | 13,500,000 DA\n4-room flat · 118 m² | 17,200,000 DA\nShop · 45 m² | 8,000,000 DA\n5-room flat · 140 m² | 21,000,000 DA',
      'Visit the show flat','The sales office is open every day; instalments and bank financing available.']
  },
  kids: {
    fr: ['Crèche Les Bourgeons','Apprendre, jouer et grandir ensemble dans un cadre sûr et bienveillant','Inscriptions ouvertes pour la nouvelle saison',
      'Notre mission','Chaque enfant a un talent : nous l’aidons à découvrir ses capacités avec joie et confiance.',
      'Notre programme','Lettres et chiffres par le jeu, apprentissage du Coran, activités artistiques et sportives chaque jour.\nLes langues s’apprennent avec des chansons et des histoires, et la créativité grandit avec le dessin, le coloriage et les jeux de construction.',
      'Une journée chez nous','Accueil et petit-déjeuner sain, ateliers d’éveil et de jeu, déjeuner équilibré et sieste au calme.\nEn fin de journée, votre enfant rentre heureux, avec plein de choses à vous raconter.',
      'Pourquoi nous ?','Éducatrices qualifiées\nSalles climatisées et équipées\nTransport scolaire sûr\nSuivi quotidien des parents\nAire de jeux sécurisée\nRepas sains et équilibrés',
      'Inscrivez votre enfant','Places limitées : venez découvrir nos espaces et notre équipe.'],
    en: ['Little Buds Kindergarten','Learning, playing and growing together in a safe and caring place','Registration open for the new season',
      'Our mission','Every child has a gift, and we help them discover it with joy and confidence.',
      'Our programme','Letters and numbers through play, Quran lessons, and art and sport activities every day.\nChildren learn languages through songs and stories, and grow their skills with drawing, colouring and building games.',
      'A day with us','Welcome and a healthy breakfast, learning and play workshops, a balanced lunch and a quiet nap.\nAt the end of the day, your child comes home happy, with plenty to share with you.',
      'Why choose us?','Qualified teachers\nAir-conditioned, well-equipped rooms\nSafe school transport\nDaily updates for parents\nSafe playground\nHealthy, balanced meals',
      'Enrol your child','Places are limited, come and meet our team and see our spaces.']
  },
  wedding: {
    fr: ['Amine & Sara','Avec tout notre amour, nous vous invitons à célébrer notre mariage','Jeudi 12 juin 2027',
      'Au nom de Dieu','« Et parmi Ses signes, Il a créé de vous, pour vous, des épouses afin que vous trouviez auprès d’elles la tranquillité, et Il a mis entre vous affection et bonté. »',
      'Notre histoire','Tout a commencé par une simple rencontre, puis l’affection et le respect ont grandi. Aujourd’hui, nous la couronnons devant Dieu et devant vous.\nMerci à nos deux familles pour leur soutien et leur amour ; nous serions heureux que vous soyez témoins de notre joie.',
      'Le lieu','Salle des fêtes « Le Palais d’Or », route nationale n° 5.\nParking disponible devant la salle.\nMerci d’arriver un peu en avance ; café et gâteaux traditionnels seront servis à l’accueil.',
      'Programme','Accueil des invités | 18h00\nDîner | 19h30\nGâteau | 21h00\nSoirée | 21h30\nPhotos souvenirs | 22h30\nFin de la soirée | 23h30',
      'Votre présence nous honore','Merci de confirmer votre présence avant le 1er juin.'],
    en: ['Amine & Sara','With love and joy, we invite you to celebrate our wedding','Thursday, 12 June 2027',
      'In the name of God','“And among His signs is that He created for you spouses from among yourselves so that you may find comfort in them, and He placed between you affection and mercy.”',
      'Our story','It began with a simple meeting and grew with affection and respect. Today we crown it before God and before you.\nWe thank both our families for their love and support, and we would be happy to share our joy with you.',
      'The venue','“The Golden Palace” reception hall, National Road 5.\nParking available in front of the hall.\nPlease arrive a little early; coffee and traditional sweets will be served on arrival.',
      'Programme','Guests welcome | 6:00 pm\nDinner | 7:30 pm\nCake cutting | 9:00 pm\nEvening party | 9:30 pm\nPhotos | 10:30 pm\nEnd of the evening | 11:30 pm',
      'We hope to see you','Kindly confirm your attendance before 1 June.']
  },
  travel: {
    fr: ['Découvrez le monde avec nous','Voyages organisés, hôtels sélectionnés et prix pour tous','Agence El Ofok Voyages',
      'Offres d’été','Réservez avant le 31 mai et profitez de 10 % de réduction sur tous les voyages en famille.',
      'Nos destinations','Istanbul, Kuala Lumpur, Le Caire, Tunis et Dubaï, sans oublier les plus beaux sites du Sud algérien : Tamanrasset, Djanet et Taghit.\nDes formules complètes avec vol, hébergement et visites menées par un guide arabophone.',
      'Nos services','Billets d’avion et réservations d’hôtels.\nDossiers de visa et assurance.\nOmra organisée avec des accompagnateurs expérimentés.\nNotre équipe est joignable jour et nuit pendant votre voyage, pour partir l’esprit tranquille.',
      'Prix choisis','Istanbul · 7 jours | 145 000 DA\nTunis · 5 jours | 68 000 DA\nTaghit · 4 jours | 42 000 DA\nOmra · 15 jours | 320 000 DA\nDubaï · 6 jours | 189 000 DA',
      'Votre voyage commence ici','Passez à l’agence ou appelez-nous pour un voyage sur mesure.'],
    en: ['Discover the world with us','Organised trips, hand-picked hotels and prices for everyone','El Ofok Travel Agency',
      'Summer deals','Book before 31 May and get 10% off every family trip.',
      'Our destinations','Istanbul, Kuala Lumpur, Cairo, Tunis and Dubai, plus the finest places of the Algerian south: Tamanrasset, Djanet and Taghit.\nComplete packages with flights, hotels and tours led by an Arabic-speaking guide.',
      'Our services','Flight tickets and hotel bookings.\nVisa files and travel insurance.\nOrganised Umrah trips with experienced guides.\nOur team is on call around the clock during your trip, so you can travel with peace of mind.',
      'Featured prices','Istanbul · 7 days | 145,000 DA\nTunis · 5 days | 68,000 DA\nTaghit · 4 days | 42,000 DA\nUmrah · 15 days | 320,000 DA\nDubai · 6 days | 189,000 DA',
      'Your journey starts here','Visit our agency or call us for a trip made to measure.']
  },
  islamic: {
    fr: ['Concours de mémorisation du Coran','10e édition — Le Coran, lumière et guidée','Mosquée En-Nour · Association religieuse',
      'Le Prophète ﷺ a dit','« Le meilleur d’entre vous est celui qui apprend le Coran et l’enseigne. »\nRapporté par Al-Boukhari',
      'Le concours','Un concours annuel qui encourage les jeunes à mémoriser et réciter le Livre d’Allah, et qui honore ceux qui le portent, à tout âge.\nLe concours se termine par une grande cérémonie où de beaux prix sont remis aux lauréats et une attestation à chaque participant.',
      'Catégories','1re catégorie : le Coran en entier.\n2e catégorie : 30 hizb.\n3e catégorie : 10 hizb pour les enfants de moins de 12 ans.\nLe jury réunit des récitateurs et enseignants diplômés, selon des critères de mémorisation et de tajwid.',
      'Conditions','Remplir le formulaire d’inscription\nDeux photos d’identité\nUne copie de l’acte de naissance\nDate limite : 15 Ramadan\nAccord du tuteur pour les mineurs\nPrésence à l’épreuve préliminaire',
      'Inscription et renseignements','Les dossiers sont reçus au bureau de la mosquée chaque jour après la prière du Asr.'],
    en: ['Quran Memorisation Contest','10th edition — The Quran, light and guidance','En-Nour Mosque · Religious association',
      'The Prophet ﷺ said','“The best of you are those who learn the Quran and teach it.”\nNarrated by Al-Bukhari',
      'The contest','A yearly contest that encourages young people to memorise and recite the Book of Allah, and honours those who carry it, at every age.\nThe contest ends with a grand ceremony where valuable prizes go to the winners and a certificate to every participant.',
      'Categories','Category 1: the whole Quran.\nCategory 2: 30 hizb.\nCategory 3: 10 hizb for children under 12.\nThe jury is made up of certified reciters and teachers, judging memorisation and tajwid.',
      'How to take part','Fill in the entry form\nTwo passport photos\nA copy of the birth certificate\nDeadline: 15 Ramadan\nGuardian’s consent for minors\nAttend the preliminary test',
      'Registration and information','Entries are received at the mosque office every day after Asr prayer.']
  }
};

/* ---------------------------------------------------------
   Decorations: one function per template, (kind, P, seed) → SVG inside a W × 794 panel.
   kind = cover | flap | back | inner. h = helpers from app.js.
--------------------------------------------------------- */
function deco(W, h) {
  const { X, sp, f, rng, shade, starPts } = h;
  const H = 794, cx = W / 2;
  const n1 = v => +v.toFixed(1);
  const nid = p => p + h.uid();
  const lin = (id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c, op]) =>
    `<stop offset="${o}" stop-color="${c}"${op != null ? ` stop-opacity="${op}"` : ''}/>`).join('')}</linearGradient>`;
  const rad = (id, c, op) => `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${op}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
  const full = fill => `<rect width="${W}" height="${H}" fill="${fill}"/>`;
  const dia = (x, y, s, fill, op = 1) => `<polygon points="${n1(x)},${n1(y - s)} ${n1(x + s)},${n1(y)} ${n1(x)},${n1(y + s)} ${n1(x - s)},${n1(y)}" fill="${fill}" opacity="${op}"/>`;
  const pt = (x, y, r, a) => n1(x + r * Math.cos(a)) + ',' + n1(y + r * Math.sin(a));

  /* ---------- shared motifs ---------- */
  const star8 = (x, y, r, stroke, w, op, fill = 'none') =>
    `<g opacity="${op}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"><rect x="${n1(x - r)}" y="${n1(y - r)}" width="${n1(2 * r)}" height="${n1(2 * r)}"/>` +
    `<rect x="${n1(x - r)}" y="${n1(y - r)}" width="${n1(2 * r)}" height="${n1(2 * r)}" transform="rotate(45 ${n1(x)} ${n1(y)})"/></g>`;

  return {
    /* ===== 1. Prestige: night blue, gold art-deco fans and frames ===== */
    lux(kind, P) {
      const gold = P.c1, g = nid('lxg'), d = nid('lxd');
      const defs = `<defs>${lin(g, [[0, shade(gold, .35)], [.5, gold], [1, shade(gold, -.3)]], 1, 1)}${lin(d, [[0, shade(P.c2, .16)], [1, P.c2]], .4, 1)}</defs>`;
      const frame = (o, w, op) => `<rect x="${o}" y="${o}" width="${n1(W - 2 * o)}" height="${H - 2 * o}" fill="none" stroke="${gold}" stroke-width="${w}" opacity="${op}"/>`;
      const fan = (x, y, r0, r1, n, down, op = 1) => {
        let s = `<g fill="none" stroke="${gold}" opacity="${op}">`;
        for (let i = 0; i < n; i++) {
          const r = r0 + (r1 - r0) * i / (n - 1);
          s += `<path d="M${n1(x - r)} ${y}A${n1(r)} ${n1(r)} 0 0 ${down ? 0 : 1} ${n1(x + r)} ${y}" stroke-width="${i === n - 1 ? 1.6 : .8}"/>`;
        }
        for (let a = 15; a < 180; a += 15) {
          const t = a * Math.PI / 180, sg = down ? 1 : -1;
          s += `<line x1="${n1(x + r0 * .4 * Math.cos(t))}" y1="${n1(y + sg * r0 * .4 * Math.sin(t))}" x2="${n1(x + r1 * Math.cos(t))}" y2="${n1(y + sg * r1 * Math.sin(t))}" stroke-width=".7" opacity=".55"/>`;
        }
        return s + `<path d="M${n1(x - r0 * .4)} ${y}A${n1(r0 * .4)} ${n1(r0 * .4)} 0 0 ${down ? 0 : 1} ${n1(x + r0 * .4)} ${y}Z" fill="url(#${g})" stroke="none"/></g>`;
      };
      const corners = o => [[o, o, 1, 1], [W - o, o, -1, 1], [o, H - o, 1, -1], [W - o, H - o, -1, -1]].map(([x, y, sx, sy]) =>
        [0, 7, 14].map(k => `<path d="M${n1(x + sx * (8 + k))} ${n1(y + sy * (44 - k))}V${n1(y + sy * (8 + k))}H${n1(x + sx * (44 - k))}" fill="none" stroke="${gold}" stroke-width="${k ? .8 : 1.4}"/>`).join('')).join('');
      const lattice = op => {
        let s = `<g stroke="${gold}" stroke-width=".6" opacity="${op}">`;
        for (let x = -H; x < W + H; x += 46) s += `<line x1="${x}" y1="0" x2="${x + H}" y2="${H}"/><line x1="${x}" y1="${H}" x2="${x + H}" y2="0"/>`;
        return s + '</g>';
      };
      if (kind === 'cover') return defs + full(`url(#${d})`) + lattice(.05) + frame(18, 1.4, 1) + frame(25, .7, .6) + corners(25) +
        fan(cx, 25, 40, Math.min(176, W * .44), 6, true) + fan(cx, H - 25, 30, Math.min(110, W * .3), 4, false, .8) +
        dia(cx, 25, 6, `url(#${g})`) + dia(cx, H - 25, 5, `url(#${g})`);
      if (kind === 'flap') return defs + full(`url(#${d})`) + lattice(.04) + frame(18, 1.2, 1) + frame(25, .6, .5) + corners(25) +
        fan(cx, 25, 30, Math.min(110, W * .3), 4, true) + fan(cx, H - 25, 30, Math.min(110, W * .3), 4, false);
      if (kind === 'back') return defs + full(P.bg) + `<rect y="${H - 250}" width="${W}" height="250" fill="url(#${d})"/>` +
        `<rect y="${H - 256}" width="${W}" height="1.6" fill="${gold}"/><rect y="${H - 251}" width="${W}" height=".7" fill="${gold}" opacity=".7"/>` +
        frame(18, 1, .9) + frame(23, .5, .5) + dia(cx, H - 253, 5, `url(#${g})`);
      return defs + full(P.bg) + frame(18, 1, .9) + frame(23, .5, .5) +
        [0, 1, 2, 3].map(i => { const r = 22 + i * 20; return `<path d="M${n1(W - 23 - r)} 23A${r} ${r} 0 0 0 ${n1(W - 23)} ${23 + r}" fill="none" stroke="${gold}" stroke-width="${i === 3 ? 1.2 : .7}" opacity=".7"/>` +
          `<path d="M${23 + r} ${H - 23}A${r} ${r} 0 0 0 23 ${H - 23 - r}" fill="none" stroke="${gold}" stroke-width="${i === 3 ? 1.2 : .7}" opacity=".7"/>`; }).join('') +
        dia(W - 23, 23, 5, `url(#${g})`) + dia(23, H - 23, 5, `url(#${g})`) + fan(cx, H - 23, 26, Math.min(150, W * .4), 5, false, .35);
    },

    /* ===== 2. Clinic: teal gradient wave, crosses and heartbeat line ===== */
    clinic(kind, P) {
      const g = nid('clg');
      const defs = `<defs>${lin(g, [[0, shade(P.c1, .16)], [1, shade(P.c1, -.3)]], 1, 1)}</defs>`;
      const cross = (x, y, s, fill, op) => { const a = s / 3, b = s / 2, c = s / 6;
        return `<path d="M${n1(x - c)} ${n1(y - b)}h${n1(a)}v${n1(a)}h${n1(a)}v${n1(a)}h${n1(-a)}v${n1(a)}h${n1(-a)}v${n1(-a)}h${n1(-a)}v${n1(-a)}h${n1(a)}z" fill="${fill}" opacity="${op}"/>`; };
      const ecg = (y, col, w, op) => `<path d="${sp(`M0 ${y}H118L130 ${y - 24}L144 ${y + 32}L158 ${y - 46}L172 ${y + 18}L182 ${y}H374`)}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round" opacity="${op}"/>`;
      const dots = (x0, y0, nx, ny, col, op) => { let s = ''; for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) s += `<circle cx="${x0 + i * 16}" cy="${y0 + j * 16}" r="1.8" fill="${col}" opacity="${op}"/>`; return s; };
      if (kind === 'cover') return defs + full(P.bg) +
        `<path d="${sp('M0 0H374V436C312 476 250 418 178 446C110 472 52 476 0 452Z')}" fill="url(#${g})"/>` +
        `<path d="${sp('M0 452C52 476 110 472 178 446C250 418 312 476 374 436V454C312 494 250 436 178 464C110 490 52 494 0 470Z')}" fill="${P.c2}" opacity=".6"/>` +
        dots(W - 130, 36, 7, 6, '#fff', .28) + `<circle cx="${n1(W - 40)}" cy="60" r="140" fill="none" stroke="#fff" stroke-width="24" opacity=".07"/>` +
        cross(W * .78, 300, 70, '#fff', .13) + ecg(372, '#fff', 3, .8) +
        `<circle cx="${W + 30}" cy="${H + 20}" r="170" fill="${P.c2}" opacity=".3"/><circle cx="${n1(W - 52)}" cy="${H - 64}" r="10" fill="${P.c3}"/>` +
        cross(40, H - 46, 20, P.c1, .25);
      if (kind === 'flap') return defs + full(`url(#${g})`) + dots(28, 34, 6, 5, '#fff', .25) +
        `<circle cx="${n1(W - 20)}" cy="${H - 120}" r="150" fill="none" stroke="#fff" stroke-width="22" opacity=".07"/>` +
        cross(cx, 150, 64, '#fff', .16) + ecg(H - 90, '#fff', 2.5, .55);
      if (kind === 'back') return defs + full(P.bg) +
        `<circle cx="${n1(W - 10)}" cy="-10" r="120" fill="${P.c2}" opacity=".28"/>` + cross(W - 56, 46, 22, P.c1, .45) +
        `<path d="${sp('M0 794V600C70 570 150 620 230 590C300 565 340 580 374 570V794Z')}" fill="url(#${g})"/>` +
        `<path d="${sp('M0 600C70 570 150 620 230 590C300 565 340 580 374 570V584C340 594 300 579 230 604C150 634 70 584 0 614Z')}" fill="${P.c2}" opacity=".6"/>` +
        ecg(H - 34, '#fff', 2, .35);
      return defs + full(P.bg) +
        `<circle cx="${n1(W - 10)}" cy="-10" r="124" fill="${P.c2}" opacity=".28"/><circle cx="${n1(W - 64)}" cy="44" r="48" fill="${P.c1}" opacity=".08"/>` +
        cross(W - 56, 46, 22, P.c1, .45) + dots(30, H - 120, 5, 4, P.c1, .18) +
        `<g transform="translate(${n1(W - 96)} ${H - 230}) scale(1.5)" fill="none" stroke="${P.c1}" stroke-width="2.4" opacity=".1"><path d="M0 18C-16 4 -34 -4 -34 -22C-34 -34 -24 -42 -14 -42C-7 -42 -2 -38 0 -32C2 -38 7 -42 14 -42C24 -42 34 -34 34 -22C34 -4 16 4 0 18Z"/><path d="M-30 -14H-12L-6 -26L2 -2L8 -14H30"/></g>` +
        `<path d="${sp('M0 794V736C60 716 120 756 190 740C260 724 320 756 374 742V794Z')}" fill="${P.c2}" opacity=".3"/>` + ecg(H - 34, P.c1, 2, .35);
    },

    /* ===== 3. Training course: burgundy, cream arch, gold laurel ===== */
    academy(kind, P) {
      const g = nid('acg'), gold = P.c2;
      const defs = `<defs>${lin(g, [[0, shade(P.c1, .12)], [1, shade(P.c1, -.4)]], 0, 1)}</defs>`;
      const m = Math.max(24, W * .08);
      const arch = (mm, top, bottom) => { const r = (W - 2 * mm) / 2; return `M${n1(mm)} ${bottom}V${n1(top + r)}A${n1(r)} ${n1(r)} 0 0 1 ${n1(W - mm)} ${n1(top + r)}V${bottom}Z`; };
      const laurel = (x, y, R, col, n = 8) => {
        let s = `<g fill="${col}">`;
        [1, -1].forEach(side => {
          for (let i = 0; i < n; i++) {
            const a = (100 + i * 140 / (n - 1)) * Math.PI / 180;
            const px = x + side * R * Math.cos(a), py = y + R * Math.sin(a);
            const rot = side * (a * 180 / Math.PI + 90) + (side > 0 ? 0 : 180) - side * 28;
            s += `<ellipse cx="${n1(px)}" cy="${n1(py)}" rx="8.5" ry="3.4" transform="rotate(${n1(rot)} ${n1(px)} ${n1(py)})"/>`;
          }
          const a0 = 100 * Math.PI / 180, a1 = 245 * Math.PI / 180;
          s += `<path d="M${n1(x + side * R * Math.cos(a0))} ${n1(y + R * Math.sin(a0))}A${R} ${R} 0 0 ${side > 0 ? 1 : 0} ${n1(x + side * R * Math.cos(a1))} ${n1(y + R * Math.sin(a1))}" fill="none" stroke="${col}" stroke-width="1.2"/>`;
        });
        return s + '</g>';
      };
      const stripes = op => { let s = `<g stroke="${gold}" stroke-width=".6" opacity="${op}">`; for (let x = -H; x < W; x += 18) s += `<line x1="${x}" y1="${H}" x2="${x + H}" y2="0"/>`; return s + '</g>'; };
      if (kind === 'cover') return defs + full(`url(#${g})`) + stripes(.06) +
        `<path d="${arch(m - 10, 170, 712)}" fill="none" stroke="${gold}" stroke-width="1.5"/>` +
        `<path d="${arch(m, 180, 700)}" fill="${P.bg}"/>` +
        `<path d="${arch(m + 8, 188, 692)}" fill="none" stroke="${gold}" stroke-width=".8" opacity=".75"/>` +
        dia(cx, 170, 7, gold) + laurel(cx, 92, 40, gold) + `<polygon points="${starPts(cx, 90, 11, 4.5, 5)}" fill="${gold}"/>`;
      if (kind === 'flap') return defs + full(`url(#${g})`) + stripes(.05) +
        `<rect x="16" y="16" width="${n1(W - 32)}" height="${H - 32}" fill="none" stroke="${gold}" stroke-width="1.2"/>` +
        `<rect x="22" y="22" width="${n1(W - 44)}" height="${H - 44}" fill="none" stroke="${gold}" stroke-width=".6" opacity=".6"/>` +
        laurel(cx, 150, 46, gold, 9) + `<polygon points="${starPts(cx, 148, 13, 5.2, 5)}" fill="${gold}"/>` +
        dia(cx, H - 60, 6, gold) + `<path d="M${n1(cx - 70)} ${H - 60}H${n1(cx - 14)}M${n1(cx + 14)} ${H - 60}H${n1(cx + 70)}" stroke="${gold}" stroke-width="1"/>`;
      const frame = `<rect x="16" y="16" width="${n1(W - 32)}" height="${H - 32}" fill="none" stroke="${P.c1}" stroke-width="1.2"/>` +
        `<rect x="21" y="21" width="${n1(W - 42)}" height="${H - 42}" fill="none" stroke="${gold}" stroke-width=".7"/>`;
      const emblem = `<path d="M${n1(cx - 13)} 62V46A13 13 0 0 1 ${n1(cx + 13)} 46V62Z" fill="none" stroke="${gold}" stroke-width="1.2"/>` +
        dia(cx, 50, 3, P.c1) + `<path d="M${n1(cx - 74)} 56H${n1(cx - 22)}M${n1(cx + 22)} 56H${n1(cx + 74)}" stroke="${gold}" stroke-width="1"/>`;
      if (kind === 'back') {
        let arc = `<rect y="${H - 96}" width="${W}" height="96" fill="url(#${g})"/>`;
        for (let x = 8; x < W; x += 44) arc += `<path d="M${x} ${H}V${H - 40}A14 14 0 0 1 ${x + 28} ${H - 40}V${H}Z" fill="${shade(P.c1, -.45)}"/>`;
        return defs + full(P.bg) + emblem + arc + `<rect y="${H - 100}" width="${W}" height="1.6" fill="${gold}"/><rect y="${H - 95}" width="${W}" height=".7" fill="${gold}"/>` +
          `<rect x="16" y="16" width="${n1(W - 32)}" height="${H - 32}" fill="none" stroke="${P.c1}" stroke-width="1.2"/>`;
      }
      return defs + full(P.bg) + frame + emblem + `<g opacity=".16">${laurel(cx, H - 150, 62, P.c1, 9)}<polygon points="${starPts(cx, H - 152, 18, 7.5, 5)}" fill="${P.c1}"/></g>` + dia(cx, H - 38, 5, P.c1) +
        `<path d="M${n1(cx - 60)} ${H - 38}H${n1(cx - 12)}M${n1(cx + 12)} ${H - 38}H${n1(cx + 60)}" stroke="${gold}" stroke-width="1"/>`;
    },

    /* ===== 4. Tech: dark navy, glowing orbs, circuit traces ===== */
    tech(kind, P) {
      const g = nid('tg'), o1 = nid('to'), o2 = nid('to'), bar = nid('tb');
      const defs = `<defs>${lin(g, [[0, P.c2], [1, shade(P.c2, .14)]], 1, 1)}${rad(o1, P.c3, .55)}${rad(o2, P.c1, .3)}${lin(bar, [[0, P.c1], [1, P.c3]], 1, 0)}</defs>`;
      const grid = op => { let s = `<g stroke="#fff" stroke-opacity="${op}" stroke-width="1">`; for (let x = 0; x <= W; x += 34) s += `<line x1="${x}" y1="0" x2="${x}" y2="${H}"/>`; for (let y = 0; y <= H; y += 34) s += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`; return s + '</g>'; };
      const trace = (d, e, op = .6) => `<path d="${sp(d)}" fill="none" stroke="${P.c1}" stroke-width="2" stroke-linejoin="round" opacity="${op}"/><circle cx="${X(e[0])}" cy="${e[1]}" r="4.2" fill="${P.c2}" stroke="${P.c1}" stroke-width="2" opacity="${Math.min(1, op + .3)}"/>`;
      const rings = (x, y, r) => `<circle cx="${n1(x)}" cy="${y}" r="${r}" fill="none" stroke="${P.c1}" stroke-width="1.5" stroke-dasharray="3 7" opacity=".4"/>` +
        `<circle cx="${n1(x)}" cy="${y}" r="${r + 46}" fill="none" stroke="${P.c1}" stroke-width="1" opacity=".14"/>` +
        `<circle cx="${n1(x + r * Math.cos(2.3))}" cy="${n1(y + r * Math.sin(2.3))}" r="5" fill="${P.c1}"/>`;
      const traces = y => trace(`M374 ${y}H318L290 ${y + 28}H214`, [214, y + 28]) + trace(`M374 ${y + 30}H334L306 ${y + 58}H262L246 ${y + 74}H172`, [172, y + 74]) +
        trace(`M374 ${y + 62}H346L324 ${y + 84}H294`, [294, y + 84], .45) + trace(`M0 ${y + 100}H54L80 ${y + 126}H150`, [150, y + 126]) + trace(`M0 ${y + 130}H34L56 ${y + 152}H96`, [96, y + 152], .45);
      if (kind === 'cover') return defs + full(`url(#${g})`) + grid(.045) +
        `<circle cx="${n1(W * .86)}" cy="110" r="240" fill="url(#${o1})"/><circle cx="${n1(W * .06)}" cy="700" r="230" fill="url(#${o2})"/>` +
        rings(W * .86, 110, 96) + traces(586) + `<rect y="${H - 6}" width="${W}" height="6" fill="url(#${bar})"/>`;
      if (kind === 'flap') return defs + full(`url(#${g})`) + grid(.04) +
        `<circle cx="${n1(cx)}" cy="190" r="220" fill="url(#${o1})"/>` + rings(cx, 190, 70) + `<rect y="${H - 6}" width="${W}" height="6" fill="url(#${bar})"/>`;
      if (kind === 'back') return defs + full(P.bg) + grid(.035) + `<circle cx="${n1(W)}" cy="${H}" r="260" fill="url(#${o1})"/>` +
        trace('M374 36H330L306 60H256', [256, 60]) + trace('M374 64H346L332 78H300', [300, 78], .45) + `<rect y="${H - 6}" width="${W}" height="6" fill="url(#${bar})"/>`;
      return defs + full(P.bg) + grid(.035) + `<circle cx="0" cy="${H}" r="250" fill="url(#${o1})"/>` + rings(W * .78, H - 150, 70) +
        trace('M374 36H330L306 60H256', [256, 60]) + trace('M374 64H346L332 78H300', [300, 78], .45);
    },

    /* ===== 5. Solar: blue sky, radiant sun, panel rows ===== */
    solar(kind, P) {
      const g = nid('sg'), gl = nid('sl');
      const defs = `<defs>${lin(g, [[0, P.c2], [.62, shade(P.c2, .38)], [1, shade(P.c3, .5)]], 0, 1)}${rad(gl, P.c1, .55)}</defs>`;
      const sun = (x, y, r, rays = 12, len = 24) => {
        let s = `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r * 2.3)}" fill="url(#${gl})"/>`;
        for (let i = 0; i < rays; i++) {
          const a = i * 2 * Math.PI / rays, r1 = r + 9, r2 = r + 9 + len;
          s += `<polygon points="${pt(x, y, r1, a - .085)} ${pt(x, y, r2, a)} ${pt(x, y, r1, a + .085)}" fill="${P.c1}"/>`;
        }
        return s + `<circle cx="${n1(x)}" cy="${n1(y)}" r="${r}" fill="${P.c1}"/><circle cx="${n1(x - r * .28)}" cy="${n1(y - r * .28)}" r="${n1(r * .5)}" fill="#fff" opacity=".2"/>`;
      };
      const panels = (y, ph, pw, gap, skew, legs = 22) => {
        let s = '';
        const n = Math.ceil(W / (pw + gap)) + 2;
        for (let i = 0; i < n; i++) {
          const x = i * (pw + gap) - pw * .6;
          s += `<line x1="${n1(x + pw * .22)}" y1="${y + ph - 2}" x2="${n1(x + pw * .22)}" y2="${y + ph + legs}" stroke="#7D8A96" stroke-width="3"/>` +
            `<line x1="${n1(x + pw * .78)}" y1="${y + ph - 2}" x2="${n1(x + pw * .78)}" y2="${y + ph + legs}" stroke="#7D8A96" stroke-width="3"/>` +
            `<polygon points="${n1(x + skew)},${y} ${n1(x + skew + pw)},${y} ${n1(x + pw)},${y + ph} ${n1(x)},${y + ph}" fill="#123F6E" stroke="#A8D8F7" stroke-width="1.4"/>`;
          for (let j = 1; j < 4; j++) s += `<line x1="${n1(x + skew + pw * j / 4)}" y1="${y}" x2="${n1(x + pw * j / 4)}" y2="${y + ph}" stroke="#A8D8F7" stroke-width=".8" opacity=".75"/>`;
          for (let j = 1; j < 3; j++) { const t = j / 3; s += `<line x1="${n1(x + skew * (1 - t))}" y1="${n1(y + ph * t)}" x2="${n1(x + skew * (1 - t) + pw)}" y2="${n1(y + ph * t)}" stroke="#A8D8F7" stroke-width=".8" opacity=".75"/>`; }
          s += `<polygon points="${n1(x + skew + pw * .55)},${y} ${n1(x + skew + pw * .72)},${y} ${n1(x + pw * .42)},${y + ph} ${n1(x + pw * .25)},${y + ph}" fill="#fff" opacity=".1"/>`;
        }
        return s;
      };
      if (kind === 'cover') return defs + full(`url(#${g})`) + sun(W * .76, 150, 40) +
        `<path d="${sp('M0 572C70 548 150 560 220 540C290 522 336 536 374 528V794H0Z')}" fill="${shade(P.c2, -.15)}" opacity=".85"/>` +
        `<rect y="604" width="${W}" height="${H - 604}" fill="${shade(P.c2, -.45)}"/>` +
        panels(596, 56, 80, 8, 22) + panels(688, 70, 100, 10, 30, 40);
      if (kind === 'flap') return defs + full(`url(#${g})`) + sun(cx, 150, 36, 14, 20) +
        `<path d="${sp('M0 700C70 680 150 690 220 672C290 656 336 668 374 662V794H0Z')}" fill="${shade(P.c2, -.2)}" opacity=".7"/>`;
      if (kind === 'back') return defs + full(P.bg) +
        `<rect y="${H - 206}" width="${W}" height="206" fill="url(#${g})"/>` + sun(W * .8, H - 160, 22, 12, 14) +
        `<rect y="${H - 70}" width="${W}" height="70" fill="${shade(P.c2, -.45)}"/>` + panels(H - 124, 52, 78, 8, 20) + panels(H - 62, 56, 96, 10, 26, 30) +
        `<rect width="${W}" height="7" fill="${P.c1}"/>`;
      return defs + full(P.bg) + `<rect width="${W}" height="7" fill="${P.c1}"/>` + sun(W - 6, 6, 34, 14, 20) +
        `<rect y="${H - 96}" width="${W}" height="96" fill="${shade(P.c3, .78)}"/>` + `<rect y="${H - 26}" width="${W}" height="26" fill="${shade(P.c2, -.2)}"/>` +
        panels(H - 78, 40, 60, 6, 16, 26);
    },

    /* ===== 6. Real estate: charcoal, copper lines, night skyline ===== */
    realty(kind, P, seed) {
      const g = nid('rg');
      const defs = `<defs>${lin(g, [[0, shade(P.c2, .1)], [1, shade(P.c2, -.42)]], 0, 1)}</defs>`;
      const skyline = (base, hMin, hMax, wMin, wMax, fill, win, sd, op = 1) => {
        const r = rng(sd); let s = `<g opacity="${op}">`, x = -6;
        while (x < W) {
          const w = wMin + r() * (wMax - wMin), hh = hMin + r() * (hMax - hMin), top = base - hh;
          s += `<rect x="${n1(x)}" y="${n1(top)}" width="${n1(w + .6)}" height="${n1(hh)}" fill="${fill}"/>`;
          if (r() < .3) s += `<rect x="${n1(x + w / 2 - 1)}" y="${n1(top - 18)}" width="2" height="18" fill="${fill}"/>`;
          if (win) for (let wy = top + 12; wy < base - 16; wy += 16) for (let wx = x + 7; wx < x + w - 10; wx += 11) if (r() < .5) s += `<rect x="${n1(wx)}" y="${n1(wy)}" width="5" height="8" fill="${win}" opacity="${(.3 + r() * .6).toFixed(2)}"/>`;
          x += w + 2 + r() * 5;
        }
        return s + '</g>';
      };
      const blue = op => { let s = `<g stroke="${P.c1}" stroke-width=".7" opacity="${op}">`; for (let x = -H; x < W; x += 34) s += `<line x1="${x}" y1="${H}" x2="${x + H}" y2="0"/>`; return s + '</g>'; };
      const house = (x, y, s, col, op) => `<g transform="translate(${n1(x)} ${y}) scale(${s})" fill="none" stroke="${col}" stroke-width="${n1(2 / s)}" opacity="${op}" stroke-linejoin="round"><path d="M-60 0L0 -52L60 0"/><path d="M-46 -12V56H46V-12"/><path d="M-14 56V20H14V56"/><rect x="18" y="0" width="16" height="16"/><path d="M30 -38V-62H42V-28"/></g>`;
      if (kind === 'cover') return defs + full(`url(#${g})`) + blue(.07) +
        `<path d="M28 150V28H150" fill="none" stroke="${P.c1}" stroke-width="2"/><rect x="36" y="36" width="9" height="9" fill="${P.c1}"/>` +
        skyline(H, 140, 300, 30, 58, '#2C3946', '#E8B07A', 3) + skyline(H, 50, 150, 40, 80, '#121920', '#F3C79B', 9) +
        `<rect y="${H - 4}" width="${W}" height="4" fill="${P.c1}"/>`;
      if (kind === 'flap') return defs + full(P.c3) + house(cx, 220, 1.6 * Math.min(1, f), P.c1, .3) +
        `<rect x="18" y="18" width="${n1(W - 36)}" height="${H - 36}" fill="none" stroke="${P.c1}" stroke-width="1" opacity=".6"/>`;
      const band = `<rect width="${W}" height="70" fill="${P.c2}"/>` +
        `<rect y="70" width="${W}" height="3" fill="${P.c1}"/><path d="M${n1(W - 34)} 20V50H${n1(W - 64)}" fill="none" stroke="${P.c1}" stroke-width="1.6"/>`;
      if (kind === 'back') return defs + full(P.bg) + band +
        skyline(H, 100, 220, 30, 58, '#3A4754', '#E8B07A', 5) + skyline(H, 40, 120, 40, 80, P.c2, '#F3C79B', 13) +
        `<rect y="${H - 4}" width="${W}" height="4" fill="${P.c1}"/>`;
      return defs + full(P.bg) + `<rect width="${W}" height="70" fill="${P.c3}"/><rect y="70" width="${W}" height="3" fill="${P.c1}"/>` +
        `<path d="M${n1(W - 34)} 20V50H${n1(W - 64)}" fill="none" stroke="${P.c1}" stroke-width="1.6"/><rect x="${n1(W - 40)}" y="14" width="7" height="7" fill="${P.c1}"/>` +
        skyline(H, 60, 190, 24, 48, P.c2, null, (seed || 7) + 4, .09) + skyline(H, 30, 90, 30, 56, P.c1, null, (seed || 7) + 9, .1);
    },

    /* ===== 7. Kindergarten: rainbow, clouds, balloons, hills ===== */
    kids(kind, P, seed) {
      const g = nid('kg');
      const defs = `<defs>${lin(g, [[0, '#D6F1FF'], [.7, '#F2FBFF'], [1, P.bg]], 0, 1)}</defs>`;
      const s1 = Math.min(1, f * 1.1);
      const cloud = (x, y, s, op = 1) => `<g transform="translate(${n1(x)} ${y}) scale(${s})" fill="#fff" opacity="${op}"><circle cx="0" cy="0" r="18"/><circle cx="22" cy="-11" r="23"/><circle cx="46" cy="0" r="17"/><rect x="0" y="0" width="46" height="17"/></g>`;
      const balloon = (x, y, col, s = 1) => `<g transform="translate(${n1(x)} ${y}) scale(${s})"><path d="M0 31C-6 46 7 58 -2 82" fill="none" stroke="#8E97AB" stroke-width="1.4"/><ellipse cx="0" cy="0" rx="20" ry="25" fill="${col}"/><path d="M-4 24L4 24L0 31Z" fill="${col}"/><ellipse cx="-7" cy="-9" rx="5" ry="8" fill="#fff" opacity=".4"/></g>`;
      const flower = (x, y, col) => `<g transform="translate(${n1(x)} ${y})"><line x1="0" y1="0" x2="0" y2="18" stroke="#3E9B47" stroke-width="2"/>${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-6" rx="3.6" ry="6" fill="${col}" transform="rotate(${a})"/>`).join('')}<circle r="3.4" fill="#FFE066"/></g>`;
      const sun = (x, y, r) => `<g stroke="${P.c3}" stroke-width="4" stroke-linecap="round">${[0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * Math.PI / 4; return `<line x1="${pt(x, y, r + 8, a).split(',')[0]}" y1="${pt(x, y, r + 8, a).split(',')[1]}" x2="${pt(x, y, r + 18, a).split(',')[0]}" y2="${pt(x, y, r + 18, a).split(',')[1]}"/>`; }).join('')}</g><circle cx="${n1(x)}" cy="${y}" r="${r}" fill="${P.c3}"/>`;
      const hills = y => `<path d="${sp(`M0 ${y}C80 ${y - 40} 160 ${y - 28} 220 ${y + 12}C280 ${y - 32} 330 ${y - 38} 374 ${y - 20}V794H0Z`)}" fill="#86D07A"/>` +
        `<path d="${sp(`M0 ${y + 52}C90 ${y + 22} 200 ${y + 70} 290 ${y + 40}C330 ${y + 28} 356 ${y + 34} 374 ${y + 38}V794H0Z`)}" fill="#63BC5E"/>`;
      const confetti = (n, y0, y1, sd) => { const r = rng(sd); const cols = [P.c1, P.c2, P.c3, P.c4]; let s = ''; for (let i = 0; i < n; i++) { const x = r() * W, y = y0 + r() * (y1 - y0), c = cols[i % 4]; s += r() < .5 ? `<circle cx="${n1(x)}" cy="${n1(y)}" r="${(2.5 + r() * 3).toFixed(1)}" fill="${c}" opacity=".7"/>` : `<polygon points="${starPts(x, y, 6, 2.6, 5)}" fill="${c}" opacity=".75"/>`; } return s; };
      const rainbow = (x, y, R) => [P.c1, P.c3, P.c2, P.c4].map((c, i) => { const r = n1((R - i * 18) * s1); return `<path d="M${n1(x - r)} ${y}A${r} ${r} 0 0 1 ${n1(x + r)} ${y}" fill="none" stroke="${c}" stroke-width="${n1(18 * s1)}"/>`; }).join('');
      if (kind === 'cover') return defs + full(`url(#${g})`) + cloud(24, 70, 1) + cloud(W * .55, 120, .75, .95) + sun(W - 56, 64, 26) +
        balloon(X(52), 120, P.c1) + balloon(X(92), 98, P.c4, .8) + balloon(X(334), 470, P.c2, .75) + confetti(18, 20, 520, 5) +
        rainbow(cx, 712, 176) + cloud(cx - 170 * s1 - 18, 700, .9) + cloud(cx + 170 * s1 - 30, 704, .8) + hills(690) +
        flower(X(40), 744, P.c1) + flower(X(76), 756, P.c4) + flower(X(310), 750, P.c3) + flower(X(342), 762, P.c1);
      if (kind === 'flap') {
        let rays = '';
        for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; rays += `<polygon points="${n1(cx)},380 ${pt(cx, 380, 900, a)} ${pt(cx, 380, 900, a + Math.PI / 16)}" fill="#fff" opacity=".16"/>`; }
        return full(P.c3) + rays + cloud(20, 90, .9) + cloud(W - 90, 150, .7) + confetti(14, 600, 780, 9);
      }
      const scallop = () => { let s = `<rect width="${W}" height="30" fill="${P.c2}"/>`; for (let x = 0; x < W + 24; x += 24) s += `<circle cx="${x}" cy="30" r="12" fill="${P.c2}"/>`; return s; };
      const dots = sd => { const r = rng(sd); let s = ''; for (let i = 0; i < 26; i++) s += `<circle cx="${n1(r() * W)}" cy="${n1(60 + r() * 640)}" r="${(3 + r() * 5).toFixed(1)}" fill="${[P.c1, P.c2, P.c3, P.c4][i % 4]}" opacity=".1"/>`; return s; };
      if (kind === 'back') return defs + full(`url(#${g})`) + scallop() + cloud(W - 110, 110, .8) + rainbow(X(74), H - 96, 110) + hills(H - 104) +
        flower(X(220), H - 50, P.c1) + flower(X(262), H - 40, P.c4) + flower(X(300), H - 48, P.c3);
      return defs + full(P.bg) + dots((seed || 3) * 7) + scallop() +
        balloon(X(300), H - 250, P.c1, .8) + balloon(X(336), H - 280, P.c3, .7) + balloon(X(262), H - 220, P.c4, .62) +
        `<path d="${sp('M0 794V752C90 728 180 770 270 744C320 730 352 738 374 742V794Z')}" fill="#86D07A"/>` + flower(X(40), H - 40, P.c1) + flower(X(70), H - 34, P.c4);
    },

    /* ===== 8. Wedding: ivory, gold frame and flourishes, botanical branches ===== */
    wedding(kind, P) {
      const g = nid('wg'), gold = P.c1;
      const defs = `<defs>${rad(g, P.c2, .6)}</defs>`;
      const frame = `<rect x="20" y="20" width="${n1(W - 40)}" height="${H - 40}" fill="none" stroke="${gold}" stroke-width="1.1"/>` +
        `<rect x="27" y="27" width="${n1(W - 54)}" height="${H - 54}" fill="none" stroke="${gold}" stroke-width=".6" opacity=".7"/>`;
      const curl = (x, y, sx, sy) => `<g transform="translate(${n1(x)} ${y}) scale(${sx} ${sy})" fill="none" stroke="${gold}" stroke-width="1.3" stroke-linecap="round">` +
        `<path d="M0 70C0 30 30 0 70 0"/><path d="M12 12C32 4 48 14 43 30C39 41 25 41 23 32C21 25 29 22 32 27"/><path d="M6 40C14 36 20 40 18 46M40 6C36 14 40 20 46 18"/>` +
        `<circle cx="70" cy="0" r="2.2" fill="${gold}" stroke="none"/><circle cx="0" cy="70" r="2.2" fill="${gold}" stroke="none"/></g>`;
      const curls = o => curl(o, o, 1, 1) + curl(W - o, o, -1, 1) + curl(o, H - o, 1, -1) + curl(W - o, H - o, -1, -1);
      const leafP = 'M0 0C6 -8 18 -8 24 0C18 8 6 8 0 0Z';
      const flower = (x, y, r, col) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="${-r * .62}" rx="${n1(r * .45)}" ry="${n1(r * .68)}" fill="${col}" transform="rotate(${a})"/>`).join('')}<circle r="${n1(r * .3)}" fill="${gold}"/></g>`;
      const branch = (x, y, rot, s) => `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${rot}) scale(${s})">` +
        `<path d="M0 0C30 18 72 28 126 24" fill="none" stroke="${P.c3}" stroke-width="1.6" stroke-linecap="round"/>` +
        [[16, 9, -40], [30, 15, 30], [46, 19, -30], [62, 23, 35], [80, 25, -25], [96, 26, 30], [110, 25, -20]].map(([lx, ly, a]) =>
          `<path d="${leafP}" fill="${P.c3}" opacity=".85" transform="translate(${lx} ${ly}) rotate(${a})"/>`).join('') +
        flower(128, 24, 15, shade(P.c2, -.08)) + flower(70, 24, 9, P.c2) + `<circle cx="104" cy="12" r="3.4" fill="${P.c2}"/><circle cx="40" cy="28" r="2.8" fill="${shade(P.c2, -.1)}"/></g>`;
      const s1 = Math.min(1, f);
      if (kind === 'cover') return defs + full(P.bg) + `<circle cx="${n1(W - 10)}" cy="40" r="190" fill="url(#${g})"/><circle cx="10" cy="${H - 40}" r="200" fill="url(#${g})"/>` +
        frame + curls(27) + branch(W - 36, 44, 128, .95 * s1) + branch(36, H - 44, -52, .95 * s1) +
        `<circle cx="${n1(cx)}" cy="205" r="44" fill="none" stroke="${gold}" stroke-width="1"/><circle cx="${n1(cx)}" cy="205" r="50" fill="none" stroke="${gold}" stroke-width=".5"/>` +
        `<circle cx="${n1(cx - 8)}" cy="207" r="13" fill="none" stroke="${gold}" stroke-width="1.8"/><circle cx="${n1(cx + 8)}" cy="207" r="13" fill="none" stroke="${gold}" stroke-width="1.8"/>` +
        dia(cx, 190, 3.4, gold);
      if (kind === 'flap') return defs + full(shade(P.c2, .55)) + `<circle cx="${n1(cx)}" cy="380" r="300" fill="url(#${g})"/>` + frame + curls(27) +
        flower(n1(cx), 150, 18, shade(P.c2, -.15)) + `<path d="M${n1(cx - 70)} 150H${n1(cx - 26)}M${n1(cx + 26)} 150H${n1(cx + 70)}" stroke="${gold}" stroke-width="1"/>` +
        dia(cx, H - 90, 4, gold) + `<path d="M${n1(cx - 60)} ${H - 90}H${n1(cx - 12)}M${n1(cx + 12)} ${H - 90}H${n1(cx + 60)}" stroke="${gold}" stroke-width="1"/>`;
      if (kind === 'back') return defs + full(P.bg) + `<circle cx="${n1(W)}" cy="0" r="170" fill="url(#${g})"/><circle cx="0" cy="${H}" r="190" fill="url(#${g})"/>` +
        frame + curls(27) + branch(36, H - 44, -52, .8 * s1) + branch(W - 36, 44, 128, .7 * s1);
      return defs + full(P.bg) + `<circle cx="${n1(W)}" cy="0" r="160" fill="url(#${g})"/><circle cx="0" cy="${H}" r="150" fill="url(#${g})"/>` +
        frame + curls(27) + branch(W - 36, 44, 128, .62 * s1) + branch(36, H - 44, -52, .7 * s1);
    },

    /* ===== 9. Travel: sunset sky, sea, beach and palm, flight path ===== */
    travel(kind, P) {
      const g = nid('tvs'), sea = nid('tvw');
      const defs = `<defs>${lin(g, [[0, shade(P.c2, .8)], [1, shade(P.c2, .28)]], 0, 1)}${lin(sea, [[0, P.c1], [1, shade(P.c1, -.4)]], 0, 1)}</defs>`;
      const plane = (x, y, a, s, col) => `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${a}) scale(${s})"><path d="M-18 -2.4H6L16 -15H21.5L15.5 -2.4H24L28 -8H31L28.6 0L31 8H28L24 2.4H15.5L21.5 15H16L6 2.4H-18C-21.5 2.4 -21.5 -2.4 -18 -2.4Z" fill="${col}"/></g>`;
      const birds = (x, y, s) => `<g fill="none" stroke="${P.c3}" stroke-width="1.6" stroke-linecap="round" opacity=".7"><path d="M${n1(x)} ${y}q6 -6 12 0q6 -6 12 0"/><path d="M${n1(x + 30 * s)} ${y - 16}q5 -5 10 0q5 -5 10 0"/><path d="M${n1(x + 14 * s)} ${y - 30}q4 -4 8 0q4 -4 8 0"/></g>`;
      const palm = (x, y, s) => `<g transform="translate(${n1(x)} ${y}) scale(${s})"><path d="M0 0C8 -40 4 -92 20 -134" fill="none" stroke="#6B4F3A" stroke-width="8" stroke-linecap="round"/>` +
        [[-10, 1], [20, 1], [-60, .9], [60, .85], [-120, .8], [150, .75]].map(([a, k]) => `<path d="M0 0C22 -20 52 -18 70 4C50 -8 24 -8 0 0Z" fill="${shade(P.c3, .1)}" transform="translate(20 -134) rotate(${a}) scale(${k})"/>`).join('') +
        `<circle cx="16" cy="-128" r="5" fill="#6B4F3A"/><circle cx="25" cy="-126" r="4.5" fill="#6B4F3A"/></g>`;
      const reflect = (x, y0) => { let s = ''; for (let i = 0; i < 7; i++) { const w = 120 - i * 15; s += `<rect x="${n1(x - w / 2)}" y="${y0 + 10 + i * 13}" width="${w}" height="3" rx="1.5" fill="#fff" opacity="${(.55 - i * .06).toFixed(2)}"/>`; } return s; };
      const stamp = (x, y) => `<g fill="none" stroke="${P.c1}" opacity=".55"><circle cx="${n1(x)}" cy="${y}" r="40" stroke-width="1.6" stroke-dasharray="3 4"/><circle cx="${n1(x)}" cy="${y}" r="31" stroke-width="1"/>` +
        [-10, 0, 10].map(d => `<path d="M${n1(x - 76)} ${y + d}q8 -6 16 0t16 0t16 0t16 0t16 0t16 0t16 0" stroke-width="1.2"/>`).join('') + '</g>';
      if (kind === 'cover') return defs + full(`url(#${g})`) +
        `<circle cx="${n1(W * .68)}" cy="468" r="104" fill="#fff" opacity=".22"/><circle cx="${n1(W * .68)}" cy="468" r="66" fill="#FFF6E5"/>` +
        `<path d="${sp('M0 470C30 444 66 432 104 452C134 440 166 444 196 470Z')}" fill="${P.c3}" opacity=".32"/>` +
        `<rect y="468" width="${W}" height="${H - 468}" fill="url(#${sea})"/>` + reflect(W * .68, 468) +
        `<path d="${sp('M20 540q20 -8 40 0t40 0M200 584q20 -8 40 0t40 0M70 620q20 -8 40 0t40 0')}" fill="none" stroke="#fff" stroke-width="2" opacity=".35"/>` +
        `<path d="${sp('M0 690C110 650 230 712 374 664V794H0Z')}" fill="${shade(P.c2, .55)}"/>` + palm(X(52), 706, .95) +
        `<path d="M${X(14)} 446C${X(90)} 372 ${X(170)} 428 ${n1(W * .78 - 34)} 392" fill="none" stroke="${P.c3}" stroke-width="1.8" stroke-dasharray="5 7" opacity=".55"/>` +
        plane(W * .78, 384, 165, 1, P.c3) + birds(X(150), 330, 1);
      if (kind === 'flap') return defs + full(`url(#${sea})`) +
        `<path d="${sp('M0 140q30 -12 60 0t60 0t60 0t60 0t60 0t60 0t60 0M0 660q30 -12 60 0t60 0t60 0t60 0t60 0t60 0t60 0M0 690q30 -12 60 0t60 0t60 0t60 0t60 0t60 0t60 0')}" fill="none" stroke="#fff" stroke-width="2" opacity=".18"/>` +
        `<path d="M${n1(cx - 90)} 112C${n1(cx - 40)} 60 ${n1(cx + 30)} 100 ${n1(cx + 70)} 66" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="5 7" opacity=".6"/>` + plane(cx + 84, 60, 150, .9, '#fff');
      if (kind === 'back') return defs + full(P.bg) + stamp(W - 64, 74) +
        `<rect y="${H - 210}" width="${W}" height="210" fill="url(#${sea})"/>` +
        `<circle cx="${n1(W * .7)}" cy="${H - 210}" r="44" fill="#FFF6E5"/><rect y="${H - 260}" width="${W}" height="50" fill="${P.bg}"/>` + reflect(W * .7, H - 210) +
        `<path d="${sp('M0 760C110 724 230 776 374 736V794H0Z')}" fill="${shade(P.c2, .55)}"/>` + palm(X(46), 772, .7);
      return defs + full(P.bg) + stamp(W - 64, 74) +
        `<path d="M-10 ${H - 34}C${X(80)} ${H - 120} ${X(150)} ${H - 24} ${X(226)} ${H - 84}" fill="none" stroke="${P.c2}" stroke-width="1.8" stroke-dasharray="5 7" opacity=".7"/>` +
        plane(X(240), H - 92, 150, .7, P.c2) +
        `<g transform="translate(${n1(W - 70)} ${H - 230})" fill="none" stroke="${P.c1}" stroke-width="1.6" opacity=".16"><circle r="72"/><ellipse rx="30" ry="72"/><ellipse rx="58" ry="72"/><path d="M-72 0H72M-64 -34H64M-64 34H64M0 -72V72"/></g>` +
        `<path d="${sp('M0 794V770C100 752 220 784 374 760V794Z')}" fill="${shade(P.c2, .6)}"/>`;
    },

    /* ===== 10. Arabesque: emerald, gold eight-point stars, mihrab arch, lantern ===== */
    islamic(kind, P) {
      const g = nid('ig'), gold = P.c1;
      const defs = `<defs>${lin(g, [[0, P.c3], [1, P.c2]], 0, 1)}</defs>`;
      const pattern = (y0, y1, step, r, op) => { let s = ''; let row = 0;
        for (let y = y0; y <= y1; y += step, row++) for (let x = (row % 2) * step / 2; x <= W + step; x += step) s += star8(x, y, r, gold, 1, op);
        return s; };
      const m = Math.max(28, W * .09);
      const arch = (mm, top, bottom) => { const s = top + 200 * Math.min(1.2, (W - 2 * mm) / 300);
        return `M${n1(mm)} ${bottom}V${n1(s)}C${n1(mm)} ${n1(s - 90)} ${n1(cx - (cx - mm) * .3)} ${n1(top + 46)} ${n1(cx)} ${top}C${n1(cx + (cx - mm) * .3)} ${n1(top + 46)} ${n1(W - mm)} ${n1(s - 90)} ${n1(W - mm)} ${n1(s)}V${bottom}Z`; };
      const lamp = (x, top, len, s) => `<line x1="${n1(x)}" y1="${top}" x2="${n1(x)}" y2="${top + len}" stroke="${gold}" stroke-width="1.2"/>` +
        `<g transform="translate(${n1(x)} ${top + len}) scale(${s})" fill="${gold}"><path d="M-6 0H6L9 6H-9Z"/><path d="M-14 6H14L18 30Q18 44 0 52Q-18 44 -18 30Z" opacity=".95"/>` +
        `<path d="M-7 14H7L9 30Q9 38 0 43Q-9 38 -9 30Z" fill="${P.c2}" opacity=".55"/><path d="M-4 52H4L0 62Z"/><circle cx="0" cy="66" r="3"/></g>`;
      if (kind === 'cover') return defs + full(`url(#${g})`) + pattern(0, H, 56, 15, .17) +
        `<path d="${arch(m - 9, 140, 730)}" fill="none" stroke="${gold}" stroke-width="2"/>` +
        `<path d="${arch(m, 152, 720)}" fill="${P.bg}"/>` +
        `<path d="${arch(m + 8, 164, 712)}" fill="none" stroke="${gold}" stroke-width=".8" opacity=".8"/>` +
        lamp(cx, 0, 52, 1) + star8(cx, 690, 10, gold, 1, .7, gold);
      if (kind === 'flap') return defs + full(`url(#${g})`) + pattern(0, H, 56, 15, .14) +
        `<rect x="18" y="18" width="${n1(W - 36)}" height="${H - 36}" fill="none" stroke="${gold}" stroke-width="1.2"/>` +
        star8(cx, 150, 36, gold, 1.4, .9) + star8(cx, 150, 24, gold, 1, .9, gold) + star8(cx, 150, 9, P.c2, 1, 1, P.c2);
      const band = (y, hgt) => `<rect y="${y}" width="${W}" height="${hgt}" fill="url(#${g})"/>`;
      if (kind === 'back') return defs + full(P.bg) + band(0, 60) + pattern(30, 30, 46, 11, .75) + `<rect y="62" width="${W}" height="2" fill="${gold}"/>` +
        band(H - 190, 190) + pattern(H - 150, H, 46, 11, .25) + `<rect y="${H - 194}" width="${W}" height="2" fill="${gold}"/><rect y="${H - 190}" width="${W}" height=".8" fill="${gold}"/>`;
      return defs + full(P.bg) + band(0, 60) + pattern(30, 30, 46, 11, .75) +
        `<rect y="62" width="${W}" height="2" fill="${gold}"/><rect y="67" width="${W}" height=".8" fill="${gold}"/>` +
        star8(W - 6, H - 6, 130, P.c2, 1, .07, P.c2) + star8(W - 6, H - 6, 96, gold, 1.2, .4) + star8(W - 6, H - 6, 60, gold, 1, .3) +
        star8(30, H - 150, 22, gold, 1, .3) + star8(70, H - 100, 12, gold, 1, .25);
    }
  };
}

return { templates, samples, deco };
})();
