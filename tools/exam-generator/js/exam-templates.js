/* ================= Complete exam templates (subject × level) =================
   Each template builds questions + objects from data; SVG/HTML is generated when the template is used. */

const EO = id => `<span class="eobj" data-oid="${id}" contenteditable="false"></span>`;
function TQ(type, points, html, extra){ return Object.assign({ id: uid('q_'), type, points, html, frameOff: false, images: [] }, extra || {}); }
const EQ = (latex, block) => ({ kind: 'eq', data: { latex, size: 1 }, display: block ? 'block' : 'inline', align: 'center' });
const PL = (over, w, display) => ({ kind: 'plot', data: Object.assign(plotDefaults(), over), display: display || 'block', align: 'center', w: w || 380 });
const DR = (key, w, display) => ({ kind: 'draw', data: { presets: [key] }, display: display || 'block', align: 'center', w: w || 240 });
const TB = (rows, opts) => ({ kind: 'table', data: Object.assign({ rows: rows.map((r, i) => r.map(v => tcell(v, false))), headRow: true, headCol: false, tall: false, align: 'center' }, opts || {}), display: 'block', align: 'center' });
const VT = (data, w) => ({ kind: 'vartab', data, display: 'block', align: 'center', w: w || 480 });

const EXAM_TEMPLATES = [
  { id: 'math-4am', subject: 'الرياضيات', level: 'السنة الرابعة متوسط', cycle: 'm', lang: 'ar', title: 'اختبار الفصل الأول في مادة الرياضيات', duration: 'ساعتان', tpl: { header: 'official', style: 'boxed' },
    build: () => {
      const c1 = plotC('50x', PLOT_COLORS[0], '(d_1)'), c2 = plotC('25x+200', PLOT_COLORS[1], '(d_2)');
      const o = {
        a: EQ('A=\\sqrt{50}-3\\sqrt{8}+\\sqrt{18}\\qquad;\\qquad B=\\left(2\\sqrt{3}-1\\right)^2', true), b: EQ('a\\sqrt{2}'), c: EQ('\\frac{A}{\\sqrt{2}}'),
        d: EQ('\\left(2x-3\\right)\\left(x+5\\right)=0'), e: EQ('3x-7\\leq2x+1'),
        f: DR('thales', 210, 'float-left'), g: EQ('\\frac{AM}{AB}=\\frac{AN}{AC}'),
        h: DR('tri-right', 190, 'float-left'), i: EQ('\\cos\\widehat{ABC}'),
        j: TB([['عدد الساعات', '2', '6', '10'], ['العرض الأول (DA)', '', '', ''], ['العرض الثاني (DA)', '', '', '']], { headCol: true, tall: true }),
        k: PL({ curves: [c1, c2], xmin: 0, xmax: 12, ymin: 0, ymax: 600, xstep: 1, ystep: 50, grid: 'mm', xlabel: 'x', ylabel: 'y', points: [{ x: 8, y: 400, label: 'I', proj: true, projLabels: true, color: '#111' }] }, 400),
      };
      return { objects: o, questions: [
        TQ('normal', 3, `إليك العددين A و B حيث: ${EO('a')}1) اكتب العدد A على الشكل ${EO('b')} حيث a عدد طبيعي.<br>2) انشر ثم بسّط العبارة B.<br>3) بيّن أن ${EO('c')} عدد طبيعي.`),
        TQ('normal', 3, `1) حل المعادلة: ${EO('d')}<br>2) حل المتراجحة: ${EO('e')} ثم مثّل مجموعة حلولها على مستقيم مدرّج.`),
        TQ('normal', 3, `${EO('f')}في الشكل المقابل (الوحدة هي السنتيمتر): المستقيمان (MN) و (BC) متوازيان، حيث: AM = 3 ، AB = 6 ، BC = 7 .<br>1) باستعمال ${EO('g')} احسب الطول MN.<br>2) إذا علمت أن AN = 4 ، احسب AC.`),
        TQ('normal', 3, `${EO('h')}ABC مثلث قائم في A حيث: AB = 6 cm و AC = 4 cm.<br>1) احسب الطول BC (تُدوّر النتيجة إلى 0,1).<br>2) احسب ${EO('i')} ثم استنتج قيس الزاوية بالتدوير إلى الدرجة.`),
        TQ('normal', 8, `<b>الوضعية الإدماجية:</b> يقترح محل لكراء الدراجات على زبائنه عرضين:<br>• العرض الأول: 50 DA للساعة الواحدة.<br>• العرض الثاني: اشتراك قدره 200 DA زائد 25 DA للساعة.<br>1) أكمل الجدول التالي:${EO('j')}2) نسمي x عدد الساعات. عبّر بدلالة x عن المبلغ المدفوع في كل عرض.<br>3) التمثيل البياني للدالتين معطى في المعلم التالي:${EO('k')}4) حدّد بيانيًا عدد الساعات التي يكون من أجلها العرض الثاني أفضل. علّل.`),
      ] };
    } },
  { id: 'math-3as', subject: 'الرياضيات', level: 'السنة الثالثة ثانوي علوم تجريبية', cycle: 's', lang: 'ar', title: 'اختبار الفصل الأول في مادة الرياضيات', duration: 'ثلاث ساعات', tpl: { header: 'table', style: 'classic' },
    build: () => {
      const cf = plotC('(x+1)e^(-x)+1', PLOT_COLORS[0], '(C_f)');
      const o = {
        a: EQ('u_{n+1}=\\frac{2u_n+3}{u_n+4}', true), b: EQ('v_n=\\frac{u_n-1}{u_n+3}'), c: EQ('\\lim_{n\\to+\\infty}u_n'),
        p1: EQ('\\frac{3}{10}'), p2: EQ('\\frac{3}{5}'), p3: EQ('\\frac{1}{2}'),
        q1: EQ('\\frac{6}{25}'), q2: EQ('\\frac{12}{25}'), q3: EQ('\\frac{3}{5}'),
        f: EQ('f\\left(x\\right)=\\left(x+1\\right)e^{-x}+1', true), g: EQ("f'\\left(x\\right)=-xe^{-x}"),
        vt: VT({ mode: 'var', xname: 'x', xs: ['−∞', '0', '+∞'], rows: [{ label: "f'(x)", marks: ['', '0', ''], signs: ['+', '−'] }], vrow: { label: 'f(x)', pts: [{ v: '−∞', lvl: 'bot' }, { v: '2', lvl: 'top' }, { v: '1', lvl: 'bot' }] } }),
        cf: PL({ curves: [cf], xmin: -2, xmax: 6, ymin: -2, ymax: 3, xstep: 1, ystep: 1, grid: 'main', equal: true, lines: [{ kind: 'h', a: 1, color: '#6B7280', dash: true, label: '(Δ)' }] }, 400),
        h: EQ('\\int_{0}^{2}\\left(f\\left(x\\right)-1\\right)\\mathrm{d}x'),
      };
      return { objects: o, questions: [
        TQ('normal', 5, `(u<sub>n</sub>) متتالية معرّفة بحدها الأول u<sub>0</sub> = 1 ومن أجل كل عدد طبيعي n: ${EO('a')}1) احسب u<sub>1</sub> و u<sub>2</sub>.<br>2) نضع من أجل كل عدد طبيعي n: ${EO('b')}. بيّن أن (v<sub>n</sub>) متتالية هندسية يطلب تعيين أساسها وحدها الأول.<br>3) اكتب v<sub>n</sub> ثم u<sub>n</sub> بدلالة n، واستنتج ${EO('c')}.`),
        TQ('mcq', 2, `يحتوي كيس على 3 كرات حمراء و 2 خضراء لا نفرق بينها باللمس. نسحب عشوائيًا كرتين في آن واحد. احتمال سحب كرتين حمراوين هو:`, { options: [EO('p1'), EO('p2'), EO('p3')], optHtml: true }),
        TQ('mcq', 2, `نسحب الآن كرتين على التوالي مع الإرجاع. احتمال الحصول على كرتين من لونين مختلفين هو:`, { options: [EO('q1'), EO('q2'), EO('q3')], optHtml: true }),
        TQ('normal', 11, `نعتبر الدالة f المعرّفة على ℝ بـ: ${EO('f')}و (C<sub>f</sub>) تمثيلها البياني في معلم متعامد ومتجانس.<br>1) احسب نهايتي الدالة f عند −∞ وعند +∞ ثم فسّر النتيجة الثانية بيانيًا.<br>2) بيّن أن ${EO('g')} ثم تحقق من جدول التغيرات التالي:${EO('vt')}3) المنحنى (C<sub>f</sub>) والمستقيم (Δ) ذو المعادلة y = 1 ممثلان في الشكل:${EO('cf')}4) احسب بالتكامل بالتجزئة: ${EO('h')} ثم فسّر النتيجة هندسيًا.`),
      ] };
    } },
  { id: 'math-5ap', subject: 'الرياضيات', level: 'السنة الخامسة ابتدائي', cycle: 'p', lang: 'ar', title: 'اختبار الفصل الأول في الرياضيات', duration: 'ساعة ونصف', tpl: { header: 'student', style: 'modern' },
    build: () => {
      const o = {
        a: EQ('\\frac{3}{4}'), b: EQ('\\frac{5}{8}'), c: EQ('\\frac{1}{2}+\\frac{1}{4}=\\ldots'),
        t: TB([['km', 'hm', 'dam', 'm', 'dm', 'cm'], ['', '', '', '', '', ''], ['', '', '', '', '', '']], { tall: true, student: true, dir: 'ltr' }),
        r: DR('rect', 230),
      };
      return { objects: o, questions: [
        TQ('normal', 4, `أنجز العمليات التالية عموديًا:<br>3487 + 2569 = .......... &nbsp;&nbsp;&nbsp; 9012 − 4578 = ..........<br>345 × 26 = .......... &nbsp;&nbsp;&nbsp; 1236 ÷ 4 = ..........`),
        TQ('normal', 4, `1) قارن بين الكسرين ${EO('a')} و ${EO('b')} مستعملًا الرمز المناسب (&lt; ، &gt; ، =).<br>2) أكمل: ${EO('c')}`),
        TQ('normal', 4, `حوّل باستعمال جدول التحويل: 3 km = ........ m &nbsp;&nbsp; 450 cm = ........ m${EO('t')}`),
        TQ('normal', 4, `${EO('r')}ABCD مستطيل طوله 6 cm وعرضه 3 cm.<br>1) احسب محيطه.<br>2) احسب مساحته.`),
        TQ('normal', 4, `<b>الوضعية الإدماجية:</b> اشترى أحمد 3 كراريس بـ 45 DA للكراس الواحد وقلمين بـ 30 DA للقلم. دفع للبائع ورقة نقدية من فئة 500 DA. كم يرجع له البائع؟`),
      ] };
    } },
  { id: 'phys-4am', subject: 'العلوم الفيزيائية والتكنولوجيا', level: 'السنة الرابعة متوسط', cycle: 'm', lang: 'ar', title: 'اختبار الفصل الأول في العلوم الفيزيائية والتكنولوجيا', duration: 'ساعة ونصف', tpl: { header: 'classic', style: 'blue' },
    build: () => {
      const tbl = plotT([[0, 0], [0.1, 2.2], [0.2, 4.4], [0.3, 6.6], [0.4, 8.8]], PLOT_COLORS[0], '', 'line');
      const o = {
        c: DR('circuit-series', 260),
        u: EQ('U=R\\times I'),
        t: TB([['I (A)', '0', '0,1', '0,2', '0,3', '0,4'], ['U (V)', '0', '2,2', '4,4', '6,6', '8,8']], { headCol: true, dir: 'ltr' }),
        p: PL({ curves: [tbl], xmin: 0, xmax: 0.5, ymin: 0, ymax: 10, xstep: 0.1, ystep: 1, grid: 'mm', xlabel: 'I (A)', ylabel: 'U (V)' }, 360),
        r: EQ('\\mathrm{CH_4}+2\\mathrm{O_2}\\longrightarrow\\mathrm{CO_2}+2\\mathrm{H_2O}', true),
      };
      return { objects: o, questions: [
        TQ('normal', 6, `لاحظ الدارة الكهربائية التالية:${EO('c')}1) سمّ عناصر هذه الدارة.<br>2) ما نوع ربط عناصرها؟<br>3) أعد رسم الدارة مع إضافة جهاز لقياس شدة التيار وآخر لقياس التوتر بين طرفي المصباح.`),
        TQ('normal', 7, `لدراسة قانون أوم ${EO('u')} قمنا بقياس التوتر U بين طرفي ناقل أومي وشدة التيار I المارّ فيه فتحصلنا على:${EO('t')}1) مثّل المنحنى البياني U = f(I).${EO('p')}2) ما طبيعة المنحنى؟ استنتج قيمة المقاومة R.`),
        TQ('tf', 3, `أجب بصحيح أو خطأ:`, { statements: [
          { id: uid('s_'), html: 'يتناسب التوتر بين طرفي ناقل أومي طرديًا مع شدة التيار.', showCorrection: false },
          { id: uid('s_'), html: 'وحدة المقاومة الكهربائية هي الأمبير.', showCorrection: false },
          { id: uid('s_'), html: 'يُربط جهاز الفولطمتر على التفرع.', showCorrection: false } ] }),
        TQ('normal', 4, `يحترق غاز الميثان في الهواء وفق المعادلة الكيميائية التالية:${EO('r')}1) سمّ المتفاعلات والنواتج.<br>2) تحقّق من أن المعادلة موزونة.`),
      ] };
    } },
  { id: 'phys-3as', subject: 'العلوم الفيزيائية', level: 'السنة الثالثة ثانوي علوم تجريبية', cycle: 's', lang: 'ar', title: 'اختبار الفصل الأول في العلوم الفيزيائية', duration: 'ثلاث ساعات', tpl: { header: 'official', style: 'classic' },
    build: () => {
      const c = plotC('12(1-e^(-t/2))', PLOT_COLORS[0], '');
      const o = {
        k: DR('circuit-rc', 260),
        e: EQ('\\frac{\\mathrm{d}u_C}{\\mathrm{d}t}+\\frac{1}{RC}u_C=\\frac{E}{RC}', true),
        s: EQ('u_C\\left(t\\right)=E\\left(1-e^{-\\frac{t}{\\tau}}\\right)'),
        p: PL({ curves: [c], xmin: 0, xmax: 12, ymin: 0, ymax: 14, xstep: 1, ystep: 2, grid: 'mm', xlabel: 't (ms)', ylabel: 'u_C (V)', tangents: [{ curve: c.id, x0: 0, color: '#DC2626', len: 5 }], lines: [{ kind: 'h', a: 12, color: '#6B7280', dash: true, label: 'E' }] }, 380),
        n: EQ('N\\left(t\\right)=N_{0}e^{-\\lambda t}', true),
        m1: EQ('t_{1/2}=\\frac{\\ln2}{\\lambda}'), m2: EQ('t_{1/2}=\\lambda\\ln2'), m3: EQ('t_{1/2}=\\frac{\\lambda}{\\ln2}'),
      };
      return { objects: o, questions: [
        TQ('normal', 10, `نحقق الدارة الكهربائية الممثلة في الشكل والمكوّنة من مولد توتره ثابت E ، ناقل أومي مقاومته R ، مكثفة سعتها C غير مشحونة وقاطعة K:${EO('k')}1) بتطبيق قانون جمع التوترات، بيّن أن المعادلة التفاضلية لتطور u<sub>C</sub> هي:${EO('e')}2) تحقق أن ${EO('s')} حل لهذه المعادلة حيث τ = RC.<br>3) يمثل الشكل التالي تطور u<sub>C</sub>(t):${EO('p')}أ) استنتج قيمة E.<br>ب) عيّن بيانيًا قيمة ثابت الزمن τ ثم احسب C إذا علمت أن R = 1 kΩ.`),
        TQ('normal', 6, `يخضع تناقص عدد أنوية عينة مشعة للقانون:${EO('n')}1) عرّف زمن نصف العمر t<sub>1/2</sub>.<br>2) استخرج عبارته بدلالة ثابت النشاط الإشعاعي λ.`),
        TQ('mcq', 4, `العبارة الصحيحة لزمن نصف العمر هي:`, { options: [EO('m1'), EO('m2'), EO('m3')], optHtml: true }),
      ] };
    } },
  { id: 'svt-3as', subject: 'علوم الطبيعة والحياة', level: 'السنة الثالثة ثانوي علوم تجريبية', cycle: 's', lang: 'ar', title: 'اختبار الفصل الأول في علوم الطبيعة والحياة', duration: 'ساعتان ونصف', tpl: { header: 'band', style: 'modern' },
    build: () => {
      const o = {
        p: PL({ curves: [plotC('100*e^(-((t-37)/11)^2)', PLOT_COLORS[2], '', { from: 0, to: 70 })], xmin: 0, xmax: 70, ymin: 0, ymax: 110, xstep: 10, ystep: 10, xlabel: 'T (°C)', ylabel: 'النشاط %', grid: 'main' }, 380),
        t: TB([['درجة الحرارة (°C)', '0', '20', '37', '50', '70'], ['سرعة التفاعل (وحدة اصطلاحية)', '2', '45', '100', '40', '0']], { headCol: true }),
        e: EQ('E+S\\rightleftharpoons ES\\longrightarrow E+P', true),
        c: DR('animal-cell', 260),
      };
      return { objects: o, questions: [
        TQ('normal', 12, `لدراسة تأثير درجة الحرارة على النشاط الإنزيمي، نقترح الوثيقتين التاليتين:<br><b>الوثيقة 1:</b>${EO('p')}<b>الوثيقة 2:</b>${EO('t')}1) حلّل منحنى الوثيقة 1.<br>2) فسّر النتائج المحصل عليها في الوثيقة 2 عند 0°C وعند 70°C.<br>3) يتم التفاعل الإنزيمي وفق المعادلة:${EO('e')}اشرح دور المعقد ES في عمل الإنزيم.`),
        TQ('normal', 8, `يمثل الشكل التالي رسمًا تخطيطيًا لخلية حيوانية:${EO('c')}1) ضع البيانات المناسبة للعناصر المشار إليها.<br>2) حدّد العضيات المسؤولة عن تركيب البروتين.`),
      ] };
    } },
  { id: 'arab-4am', subject: 'اللغة العربية', level: 'السنة الرابعة متوسط', cycle: 'm', lang: 'ar', title: 'اختبار الفصل الأول في مادة اللغة العربية', duration: 'ساعتان', tpl: { header: 'classic', style: 'underline' },
    build: () => ({ objects: {}, questions: [
      TQ('normal', 0, `في صباح يوم ربيعي جميل، خرج سليم مع جدّه إلى الحقل. كانت الأشجار قد اكتست حلّة خضراء، والطيور تملأ المكان بتغريدها العذب. توقف الجدّ عند شجرة زيتون عتيقة وقال: «يا بنيّ، هذه الشجرة غرسها أبي منذ زمن بعيد، وما زالت تعطينا من خيرها كل عام. إن الأرض لا تخون من يخدمها بإخلاص». تأمّل سليم الشجرة طويلًا، ثم عاهد نفسه أن يغرس في كل ربيع شجرة جديدة، حتى يترك لمن بعده ما يذكّرهم به.`, { title: 'النص' }),
      TQ('normal', 6, `<b>البناء الفكري:</b><br>1) أين خرج سليم مع جدّه؟ ومتى؟<br>2) ماذا قصد الجدّ بقوله: «إن الأرض لا تخون من يخدمها بإخلاص»؟<br>3) بماذا عاهد سليم نفسه؟ وما القيمة التي يدعو إليها النص؟<br>4) ضع عنوانًا مناسبًا للنص.`),
      TQ('blank', 4, `<b>البناء اللغوي:</b><br>1) أعرب ما تحته خط: خرج <u>سليم</u> مع جدّه إلى <u>الحقل</u>.<br>2) استخرج من النص: فعلًا مضارعًا ......... ، اسمًا مجرورًا ......... ، جملة اسمية .........`),
      TQ('mcq', 2, `كلمة «عتيقة» في النص تعني:`, { options: ['جديدة', 'قديمة', 'صغيرة'], optHtml: true }),
      TQ('normal', 8, `<b>الوضعية الإدماجية:</b> اكتب فقرة من ثمانية إلى عشرة أسطر تتحدث فيها عن أهمية المحافظة على البيئة وغرس الأشجار، موظّفًا جملة اسمية وأسلوب نداء.`),
    ] }) },
  { id: 'fr-4am', subject: 'اللغة الفرنسية', level: 'السنة الرابعة متوسط', cycle: 'm', lang: 'fr', title: 'Composition du premier trimestre', duration: '1h30', tpl: { header: 'table', style: 'classic' },
    build: () => ({ objects: {}, questions: [
      TQ('normal', 0, `Chaque année, des milliers de tonnes de plastique finissent dans les océans. Les tortues et les poissons les confondent avec de la nourriture. Pour protéger la mer, chacun peut agir : utiliser un sac en tissu, trier ses déchets et participer au nettoyage des plages. Ces petits gestes, répétés par tous, peuvent changer beaucoup de choses.`, { title: 'Texte' }),
      TQ('normal', 5, `<b>Compréhension :</b><br>1) De quoi parle le texte ?<br>2) Pourquoi le plastique est-il dangereux pour les animaux marins ?<br>3) Relevez deux gestes qui protègent la mer.`),
      TQ('tf', 3, `Vrai ou faux ?`, { statements: [
        { id: uid('s_'), html: 'Le plastique ne pollue pas les océans.', showCorrection: false },
        { id: uid('s_'), html: 'Trier ses déchets aide à protéger la mer.', showCorrection: false },
        { id: uid('s_'), html: 'Les tortues confondent le plastique avec de la nourriture.', showCorrection: false } ] }),
      TQ('mcq', 2, `Le texte est :`, { options: ['narratif', 'argumentatif', 'descriptif'], optHtml: true }),
      TQ('blank', 4, `<b>Langue :</b> Conjuguez les verbes entre parenthèses au présent de l'indicatif :<br>Nous (protéger) ......... la nature. Les enfants (ramasser) ......... les déchets.`),
      TQ('normal', 6, `<b>Production écrite :</b> Rédigez un court texte (8 à 10 lignes) pour convaincre vos camarades de protéger l'environnement.`),
    ] }) },
  { id: 'en-4am', subject: 'اللغة الإنجليزية', level: 'السنة الرابعة متوسط', cycle: 'm', lang: 'en', title: 'First Term Examination', duration: '1h30', tpl: { header: 'minimal', style: 'blue' },
    build: () => ({ objects: {}, questions: [
      TQ('normal', 0, `Ibn Battuta was a famous traveller born in Tangier in 1304. He travelled for almost thirty years and visited North Africa, the Middle East, India and China. When he came back home, he told his stories to a writer who put them in a book called "Rihla". Today, his journeys are still studied by students all over the world.`, { title: 'Reading' }),
      TQ('tf', 3, `Read the text and write "True" or "False":`, { statements: [
        { id: uid('s_'), html: 'Ibn Battuta was born in Tangier.', showCorrection: false },
        { id: uid('s_'), html: 'He travelled for ten years.', showCorrection: false },
        { id: uid('s_'), html: 'He wrote the book himself.', showCorrection: false } ] }),
      TQ('normal', 4, `Answer the questions:<br>1) Which countries did Ibn Battuta visit?<br>2) What is the name of his book?`),
      TQ('mcq', 2, `"journeys" in the text means:`, { options: ['trips', 'books', 'students'], optHtml: true }),
      TQ('blank', 5, `<b>Mastery of language:</b> Put the verbs in brackets in the past simple:<br>He (travel) ......... a lot. He (visit) ......... China. He (come) ......... back home.`),
      TQ('normal', 6, `<b>Written expression:</b> Write a short paragraph (6–8 lines) about a famous person you admire.`),
    ] }) },
  { id: 'hist-4am', subject: 'التاريخ والجغرافيا', level: 'السنة الرابعة متوسط', cycle: 'm', lang: 'ar', title: 'اختبار الفصل الأول في التاريخ والجغرافيا', duration: 'ساعتان', tpl: { header: 'logo', style: 'elegant' },
    build: () => {
      const o = { t: TB([['الحدث', 'التاريخ'], ['اندلاع الثورة التحريرية', ''], ['مؤتمر الصومام', ''], ['استرجاع السيادة الوطنية', '']], { tall: true, student: true }) };
      return { objects: o, questions: [
        TQ('normal', 6, `<b>الجزء الأول (التاريخ):</b><br>1) عرّف المصطلحات التالية: الثورة التحريرية، الاستعمار.<br>2) أكمل الجدول التالي بالتواريخ المناسبة:${EO('t')}`),
        TQ('tf', 3, `صحّح العبارات الخاطئة:`, { statements: [
          { id: uid('s_'), html: 'اندلعت الثورة التحريرية في الفاتح من نوفمبر 1954.', showCorrection: true, correction: '' },
          { id: uid('s_'), html: 'انعقد مؤتمر الصومام سنة 1962.', showCorrection: true, correction: '' } ] }),
        TQ('normal', 5, `<b>الجزء الثاني (الجغرافيا):</b><br>1) ما المقصود بالتنمية المستدامة؟<br>2) اذكر ثلاثة موارد طبيعية تزخر بها الجزائر.`),
        TQ('normal', 6, `<b>الوضعية الإدماجية:</b> في إطار الاحتفال بعيد الاستقلال، طُلب منك كتابة مقال قصير تبرز فيه تضحيات الشعب الجزائري من أجل الحرية.`),
      ] };
    } },
];

/* Turn a template into a ready exam (generates SVG / HTML for every object) */
async function materializeTemplate(tp){
  await Promise.all([loadMathJax(), loadMathjs()]);
  const built = tp.build();
  const objects = {};
  for(const [id, o] of Object.entries(built.objects)){
    const obj = JSON.parse(JSON.stringify(o)); obj.id = id;
    if(obj.kind === 'eq'){ const r = await latexToSvg('\\displaystyle ' + obj.data.latex, false); obj.svg = r.svg; }
    else if(obj.kind === 'plot') obj.svg = plotSvg(obj.data);
    else if(obj.kind === 'draw') obj.svg = presetDrawingSvg(obj.data.presets);
    else if(obj.kind === 'table') obj.html = await tableHtml(obj.data);
    else if(obj.kind === 'vartab') obj.svg = vartabSvg(obj.data);
    objects[id] = obj;
  }
  const s = getSettings();
  const ex = {
    id: 'tpl_' + tp.id, lang: tp.lang,
    header: { institution: s.institution || '', teacher: s.teacher || '', title: tp.title, subject: tp.subject, grade: tp.level, duration: tp.duration,
      year: s.year || defaultSchoolYear(), directorate: s.directorate || '', logo: s.logo || '' },
    tpl: Object.assign({ fontSize: s.fontSize || 'md' }, tp.tpl),
    questions: built.questions, objects, maxPoints: 20, createdAt: Date.now(), updatedAt: Date.now()
  };
  normalizeExam(ex);
  return ex;
}
