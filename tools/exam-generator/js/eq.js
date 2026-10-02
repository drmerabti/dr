/* ================= Equation tool: visual editor (MathLive) + print-quality SVG (MathJax) ================= */

const EQ_GROUPS = [
  { id:'basic', icon:'➗', color:'#2563EB', name:()=>L('أساسيات','Basics','Bases'), items:[
    ['\\frac{#0}{#?}', '\\frac{a}{b}', ()=>L('كسر','Fraction','Fraction')],
    ['\\sqrt{#0}', '\\sqrt{x}', ()=>L('جذر','Root','Racine')],
    ['\\sqrt[#?]{#0}', '\\sqrt[n]{x}', ()=>L('جذر نوني','n-th root','Racine n-ième')],
    ['#@^{#?}', 'x^{n}', ()=>L('أس (قوة)','Power','Puissance')],
    ['#@_{#?}', 'x_{n}', ()=>L('مؤشر (دليل)','Index','Indice')],
    ['#@^{2}', 'x^{2}', ()=>L('مربع','Square','Carré')],
    ['\\left(#0\\right)', '(\\;)', ()=>L('قوسان','Brackets','Parenthèses')],
    ['\\left|#0\\right|', '|x|', ()=>L('قيمة مطلقة','Absolute value','Valeur absolue')],
    ['\\left[#0;#?\\right]', '[a;b]', ()=>L('مجال مغلق','Closed interval','Intervalle fermé')],
    ['\\left]#0;#?\\right[', ']a;b[', ()=>L('مجال مفتوح','Open interval','Intervalle ouvert')],
    ['\\times', '\\times', ()=>L('ضرب','Times','Fois')],
    ['\\div', '\\div', ()=>L('قسمة','Divide','Divisé')],
    ['\\pm', '\\pm', ()=>L('زائد أو ناقص','Plus-minus','Plus ou moins')],
    ['\\neq', '\\neq', ()=>L('لا يساوي','Not equal','Différent')],
    ['\\approx', '\\approx', ()=>L('تقريبًا','Approx.','Environ')],
    ['\\leq', '\\leq', ()=>L('أصغر أو يساوي','≤','≤')],
    ['\\geq', '\\geq', ()=>L('أكبر أو يساوي','≥','≥')],
    ['\\infty', '\\infty', ()=>L('ما لا نهاية','Infinity','Infini')],
    ['\\pi', '\\pi', ()=>L('باي','Pi','Pi')],
    ['#@^{\\circ}', '30^{\\circ}', ()=>L('درجة','Degree','Degré')],
    ['\\Rightarrow', '\\Rightarrow', ()=>L('يستلزم','Implies','Implique')],
    ['\\Leftrightarrow', '\\Leftrightarrow', ()=>L('يكافئ','Equivalent','Équivaut')],
    ['\\%', '\\%', ()=>L('نسبة مئوية','Percent','Pourcent')],
    ['\\cdots', '\\cdots', ()=>L('نقاط','Dots','Points')],
  ]},
  { id:'calc', icon:'∫', color:'#7C3AED', name:()=>L('الدوال والتحليل','Functions & calculus','Fonctions et analyse'), items:[
    ['f\\left(x\\right)=', 'f(x)=', ()=>L('دالة','Function','Fonction')],
    ['\\lim_{x\\to#?}#0', '\\lim_{x\\to a}', ()=>L('نهاية','Limit','Limite')],
    ['\\lim_{x\\to+\\infty}#0', '\\lim_{x\\to+\\infty}', ()=>L('نهاية عند +∞','Limit at +∞','Limite en +∞')],
    ['\\lim_{x\\to-\\infty}#0', '\\lim_{x\\to-\\infty}', ()=>L('نهاية عند −∞','Limit at −∞','Limite en −∞')],
    ["f'\\left(x\\right)", "f'(x)", ()=>L('مشتقة','Derivative','Dérivée')],
    ['\\frac{\\mathrm{d}#0}{\\mathrm{d}#?}', '\\frac{dy}{dx}', ()=>L('مشتقة (تفاضل)','d/dx','d/dx')],
    ['\\int #0\\,\\mathrm{d}x', '\\int f\\,dx', ()=>L('تكامل','Integral','Intégrale')],
    ['\\int_{#?}^{#?}#0\\,\\mathrm{d}x', '\\int_a^b', ()=>L('تكامل محدد','Definite integral','Intégrale définie')],
    ['\\sum_{#?}^{#?}#0', '\\sum_{k=0}^{n}', ()=>L('مجموع','Sum','Somme')],
    ['\\prod_{#?}^{#?}#0', '\\prod', ()=>L('جداء','Product','Produit')],
    ['e^{#?}', 'e^{x}', ()=>L('دالة أسية','Exponential','Exponentielle')],
    ['\\ln\\left(#0\\right)', '\\ln x', ()=>L('لوغاريتم نيبيري','ln','ln')],
    ['\\log\\left(#0\\right)', '\\log x', ()=>L('لوغاريتم عشري','log','log')],
    ['\\sin\\left(#0\\right)', '\\sin', ()=>'sin'],
    ['\\cos\\left(#0\\right)', '\\cos', ()=>'cos'],
    ['\\tan\\left(#0\\right)', '\\tan', ()=>'tan'],
    ['u_{n}', 'u_{n}', ()=>L('متتالية','Sequence','Suite')],
    ['u_{n+1}', 'u_{n+1}', ()=>L('الحد الموالي','Next term','Terme suivant')],
    ['\\binom{#?}{#?}', '\\binom{n}{k}', ()=>L('توفيقة','Combination','Combinaison')],
    ['#@!', 'n!', ()=>L('عاملي','Factorial','Factorielle')],
    ['\\overline{#0}', '\\overline{z}', ()=>L('مرافق','Conjugate','Conjugué')],
    ['\\mapsto', 'x\\mapsto', ()=>L('يرفق','Maps to','Associe')],
  ]},
  { id:'geo', icon:'📐', color:'#D97706', name:()=>L('الهندسة والمجموعات','Geometry & sets','Géométrie et ensembles'), items:[
    ['\\overrightarrow{#0}', '\\overrightarrow{AB}', ()=>L('شعاع','Vector','Vecteur')],
    ['\\vec{#0}', '\\vec{u}', ()=>L('شعاع (حرف)','Vector (letter)','Vecteur (lettre)')],
    ['\\widehat{#0}', '\\widehat{ABC}', ()=>L('زاوية','Angle','Angle')],
    ['\\left[#0\\right]', '[AB]', ()=>L('قطعة','Segment','Segment')],
    ['\\left(#0\\right)', '(AB)', ()=>L('مستقيم','Line','Droite')],
    ['\\parallel', '\\parallel', ()=>L('يوازي','Parallel','Parallèle')],
    ['\\perp', '\\perp', ()=>L('يعامد','Perpendicular','Perpendiculaire')],
    ['\\triangle', '\\triangle', ()=>L('مثلث','Triangle','Triangle')],
    ['\\left(O;\\vec{i},\\vec{j}\\right)', '(O;\\vec i,\\vec j)', ()=>L('معلم','Frame','Repère')],
    ['\\left\\Vert #0\\right\\Vert', '\\|\\vec u\\|', ()=>L('طويلة شعاع','Norm','Norme')],
    ['\\in', '\\in', ()=>L('ينتمي','Belongs','Appartient')],
    ['\\notin', '\\notin', ()=>L('لا ينتمي','Not in','N\u2019appartient pas')],
    ['\\subset', '\\subset', ()=>L('محتواة','Subset','Inclus')],
    ['\\cup', '\\cup', ()=>L('اتحاد','Union','Union')],
    ['\\cap', '\\cap', ()=>L('تقاطع','Intersection','Intersection')],
    ['\\emptyset', '\\emptyset', ()=>L('مجموعة خالية','Empty set','Ensemble vide')],
    ['\\mathbb{R}', '\\mathbb{R}', ()=>'ℝ'],
    ['\\mathbb{N}', '\\mathbb{N}', ()=>'ℕ'],
    ['\\mathbb{Z}', '\\mathbb{Z}', ()=>'ℤ'],
    ['\\mathbb{Q}', '\\mathbb{Q}', ()=>'ℚ'],
    ['\\mathbb{C}', '\\mathbb{C}', ()=>'ℂ'],
    ['\\forall', '\\forall', ()=>L('مهما يكن','For all','Pour tout')],
    ['\\exists', '\\exists', ()=>L('يوجد','Exists','Il existe')],
    ['\\left\\lbrace#0\\right\\rbrace', '\\{a;b\\}', ()=>L('مجموعة','Set','Ensemble')],
  ]},
  { id:'matrix', icon:'▦', color:'#0891B2', name:()=>L('مصفوفات وأنظمة','Matrices & systems','Matrices et systèmes'), items:[
    ['\\begin{cases}#0\\\\#?\\end{cases}', '\\begin{cases}x+y=1\\\\x-y=3\\end{cases}', ()=>L('جملة معادلتين','2 equations','Système 2')],
    ['\\begin{cases}#0\\\\#?\\\\#?\\end{cases}', '\\begin{cases}a\\\\b\\\\c\\end{cases}', ()=>L('جملة 3 معادلات','3 equations','Système 3')],
    ['\\begin{cases}#? & x<#?\\\\#? & x\\geq#?\\end{cases}', '\\begin{cases}1&x<0\\\\x&x\\geq0\\end{cases}', ()=>L('دالة بأجزاء','Piecewise','Par morceaux')],
    ['\\begin{pmatrix}#?&#?\\\\#?&#?\\end{pmatrix}', '\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}', ()=>L('مصفوفة 2×2','2×2 matrix','Matrice 2×2')],
    ['\\begin{pmatrix}#?&#?&#?\\\\#?&#?&#?\\\\#?&#?&#?\\end{pmatrix}', '\\begin{pmatrix}a&b&c\\\\d&e&f\\\\g&h&i\\end{pmatrix}', ()=>L('مصفوفة 3×3','3×3 matrix','Matrice 3×3')],
    ['\\begin{vmatrix}#?&#?\\\\#?&#?\\end{vmatrix}', '\\begin{vmatrix}a&b\\\\c&d\\end{vmatrix}', ()=>L('محدّد','Determinant','Déterminant')],
    ['\\begin{pmatrix}#?\\\\#?\\end{pmatrix}', '\\begin{pmatrix}x\\\\y\\end{pmatrix}', ()=>L('إحداثيات شعاع','Coordinates','Coordonnées')],
    ['\\begin{pmatrix}#?\\\\#?\\\\#?\\end{pmatrix}', '\\begin{pmatrix}x\\\\y\\\\z\\end{pmatrix}', ()=>L('إحداثيات في الفضاء','3D coordinates','Coord. espace')],
  ]},
  { id:'chem', icon:'⚗️', color:'#16A34A', name:()=>L('كيمياء','Chemistry','Chimie'), items:[
    ['\\mathrm{#0}', '\\mathrm{H_2O}', ()=>L('صيغة كيميائية','Formula','Formule')],
    ['\\longrightarrow', '\\longrightarrow', ()=>L('سهم التفاعل','Reaction arrow','Flèche')],
    ['\\rightleftharpoons', '\\rightleftharpoons', ()=>L('تفاعل عكوس','Equilibrium','Équilibre')],
    ['\\xrightarrow{#?}', '\\xrightarrow{\\Delta}', ()=>L('سهم مع شرط','Arrow + condition','Flèche + condition')],
    ['\\uparrow', '\\uparrow', ()=>L('انطلاق غاز','Gas','Gaz')],
    ['\\downarrow', '\\downarrow', ()=>L('راسب','Precipitate','Précipité')],
    ['#@^{+}', '\\mathrm{Na^{+}}', ()=>L('شحنة +','Charge +','Charge +')],
    ['#@^{-}', '\\mathrm{Cl^{-}}', ()=>L('شحنة −','Charge −','Charge −')],
    ['#@^{2+}', '\\mathrm{Cu^{2+}}', ()=>L('شحنة 2+','Charge 2+','Charge 2+')],
    ['#@^{2-}', '\\mathrm{SO_4^{2-}}', ()=>L('شحنة 2−','Charge 2−','Charge 2−')],
    ['#@_{2}', '\\mathrm{O_2}', ()=>L('دليل 2','Index 2','Indice 2')],
    ['#@_{3}', '\\mathrm{O_3}', ()=>L('دليل 3','Index 3','Indice 3')],
    ['_{\\left(\\mathrm{aq}\\right)}', '_{(aq)}', ()=>L('محلول','Aqueous','Aqueux')],
    ['_{\\left(\\mathrm{s}\\right)}', '_{(s)}', ()=>L('صلب','Solid','Solide')],
    ['_{\\left(\\mathrm{l}\\right)}', '_{(l)}', ()=>L('سائل','Liquid','Liquide')],
    ['_{\\left(\\mathrm{g}\\right)}', '_{(g)}', ()=>L('غاز','Gas','Gaz')],
    ['{}_{#?}^{#?}\\mathrm{#0}', '{}^{14}_{6}\\mathrm{C}', ()=>L('نواة (نظير)','Nucleus','Noyau')],
    ['\\mathrm{e^{-}}', '\\mathrm{e^-}', ()=>L('إلكترون','Electron','Électron')],
    ['\\left[#0\\right]', '[\\mathrm{H_3O^+}]', ()=>L('تركيز','Concentration','Concentration')],
    ['\\mathrm{H_3O^{+}}', '\\mathrm{H_3O^+}', ()=>'H₃O⁺'],
    ['\\mathrm{HO^{-}}', '\\mathrm{HO^-}', ()=>'HO⁻'],
    ['\\mathrm{H_2O}', '\\mathrm{H_2O}', ()=>'H₂O'],
    ['\\mathrm{CO_2}', '\\mathrm{CO_2}', ()=>'CO₂'],
    ['\\mathrm{O_2}', '\\mathrm{O_2}', ()=>'O₂'],
  ]},
  { id:'phys', icon:'⚡', color:'#DC2626', name:()=>L('فيزياء ووحدات','Physics & units','Physique et unités'), items:[
    ['\\vec{F}', '\\vec{F}', ()=>L('قوة','Force','Force')],
    ['\\sum\\vec{F}_{ext}', '\\sum\\vec F', ()=>L('مجموع القوى','Sum of forces','Somme des forces')],
    ['\\Delta #0', '\\Delta t', ()=>L('تغيّر (دلتا)','Delta','Delta')],
    ['\\frac{\\mathrm{d}#0}{\\mathrm{d}t}', '\\frac{dx}{dt}', ()=>L('مشتقة زمنية','Time derivative','Dérivée temporelle')],
    ['\\times10^{#?}', '\\times10^{n}', ()=>L('قوة العشرة','×10ⁿ','×10ⁿ')],
    ['\\,\\mathrm{m}', '\\mathrm{m}', ()=>L('متر','metre','mètre')],
    ['\\,\\mathrm{s}', '\\mathrm{s}', ()=>L('ثانية','second','seconde')],
    ['\\,\\mathrm{kg}', '\\mathrm{kg}', ()=>L('كيلوغرام','kilogram','kilogramme')],
    ['\\,\\mathrm{N}', '\\mathrm{N}', ()=>L('نيوتن','newton','newton')],
    ['\\,\\mathrm{J}', '\\mathrm{J}', ()=>L('جول','joule','joule')],
    ['\\,\\mathrm{W}', '\\mathrm{W}', ()=>L('واط','watt','watt')],
    ['\\,\\mathrm{V}', '\\mathrm{V}', ()=>L('فولط','volt','volt')],
    ['\\,\\mathrm{A}', '\\mathrm{A}', ()=>L('أمبير','ampere','ampère')],
    ['\\,\\Omega', '\\Omega', ()=>L('أوم','ohm','ohm')],
    ['\\,\\mathrm{Hz}', '\\mathrm{Hz}', ()=>L('هرتز','hertz','hertz')],
    ['\\,\\mathrm{Pa}', '\\mathrm{Pa}', ()=>L('باسكال','pascal','pascal')],
    ['\\,\\mathrm{F}', '\\mathrm{F}', ()=>L('فاراد','farad','farad')],
    ['\\,\\mathrm{m\\cdot s^{-1}}', '\\mathrm{m\\cdot s^{-1}}', ()=>L('سرعة','speed','vitesse')],
    ['\\,\\mathrm{m\\cdot s^{-2}}', '\\mathrm{m\\cdot s^{-2}}', ()=>L('تسارع','acceleration','accélération')],
    ['\\,\\mathrm{mol\\cdot L^{-1}}', '\\mathrm{mol\\cdot L^{-1}}', ()=>L('تركيز مولي','molarity','concentration')],
    ['\\,\\mathrm{g\\cdot mol^{-1}}', '\\mathrm{g\\cdot mol^{-1}}', ()=>L('كتلة مولية','molar mass','masse molaire')],
    ['\\,^{\\circ}\\mathrm{C}', '^{\\circ}\\mathrm{C}', ()=>L('درجة مئوية','°C','°C')],
    ['\\,\\mathrm{mol}', '\\mathrm{mol}', ()=>L('مول','mole','mole')],
    ['\\,\\mu\\mathrm{F}', '\\mu\\mathrm{F}', ()=>L('ميكروفاراد','µF','µF')],
  ]},
  { id:'greek', icon:'α', color:'#DB2777', name:()=>L('حروف يونانية','Greek letters','Lettres grecques'), items:
    ['alpha','beta','gamma','delta','Delta','epsilon','theta','lambda','mu','nu','pi','rho','sigma','Sigma','tau','varphi','omega','Omega','Phi','Psi','partial','nabla','hbar','ell']
      .map(n => ['\\' + n, '\\' + n, () => n]) },
];

const EQ_EXAMPLES = [
  { g:()=>L('رياضيات','Maths','Maths'), items:[
    ['ax^2+bx+c=0', ()=>L('معادلة من الدرجة الثانية','Quadratic equation','Équation du 2nd degré')],
    ['\\Delta=b^2-4ac', ()=>L('المميز','Discriminant','Discriminant')],
    ['x_{1}=\\frac{-b-\\sqrt{\\Delta}}{2a}\\quad;\\quad x_{2}=\\frac{-b+\\sqrt{\\Delta}}{2a}', ()=>L('حلول المعادلة','Roots','Solutions')],
    ['\\left(a+b\\right)^2=a^2+2ab+b^2', ()=>L('متطابقة شهيرة','Identity','Identité remarquable')],
    ['f\\left(x\\right)=\\frac{2x-1}{x+3}', ()=>L('دالة تناظرية','Rational function','Fonction homographique')],
    ['\\lim_{x\\to+\\infty}\\frac{2x^2+1}{x^2-3}=2', ()=>L('نهاية','Limit','Limite')],
    ["\\left(\\frac{u}{v}\\right)'=\\frac{u'v-uv'}{v^2}", ()=>L('مشتقة حاصل قسمة','Quotient rule','Dérivée d\u2019un quotient')],
    ['\\int_{0}^{1}e^{x}\\,\\mathrm{d}x=e-1', ()=>L('تكامل','Integral','Intégrale')],
    ['u_{n}=u_{0}\\times q^{n}', ()=>L('متتالية هندسية','Geometric sequence','Suite géométrique')],
    ['u_{n}=u_{0}+nr', ()=>L('متتالية حسابية','Arithmetic sequence','Suite arithmétique')],
    ['\\begin{cases}2x+y=5\\\\x-y=1\\end{cases}', ()=>L('جملة معادلتين','System','Système')],
    ['AC^2=AB^2+BC^2', ()=>L('مبرهنة فيثاغورس','Pythagoras','Pythagore')],
    ['\\frac{AM}{AB}=\\frac{AN}{AC}=\\frac{MN}{BC}', ()=>L('مبرهنة طالس','Thales','Thalès')],
    ['AB=\\sqrt{\\left(x_B-x_A\\right)^2+\\left(y_B-y_A\\right)^2}', ()=>L('المسافة بين نقطتين','Distance','Distance')],
    ['P\\left(A\\cup B\\right)=P\\left(A\\right)+P\\left(B\\right)-P\\left(A\\cap B\\right)', ()=>L('الاحتمالات','Probability','Probabilités')],
    ['z=a+ib', ()=>L('عدد مركب','Complex number','Nombre complexe')],
    ['\\frac{3}{4}+\\frac{1}{4}=1', ()=>L('جمع كسور','Adding fractions','Somme de fractions')],
    ['3\\times\\left(4+5\\right)=27', ()=>L('عمليات (ابتدائي)','Operations','Opérations')],
  ]},
  { g:()=>L('فيزياء','Physics','Physique'), items:[
    ['\\sum\\vec{F}_{ext}=m\\vec{a}', ()=>L('قانون نيوتن الثاني','Newton\u2019s 2nd law','2e loi de Newton')],
    ['E_{c}=\\frac{1}{2}mv^2', ()=>L('الطاقة الحركية','Kinetic energy','Énergie cinétique')],
    ['E_{pp}=mgh', ()=>L('الطاقة الكامنة الثقالية','Potential energy','Énergie potentielle')],
    ['U=R\\times I', ()=>L('قانون أوم','Ohm\u2019s law','Loi d\u2019Ohm')],
    ['P=U\\times I', ()=>L('الاستطاعة الكهربائية','Electric power','Puissance')],
    ['u_{C}\\left(t\\right)=E\\left(1-e^{-\\frac{t}{\\tau}}\\right)', ()=>L('شحن مكثفة','Capacitor charging','Charge du condensateur')],
    ['\\tau=RC', ()=>L('ثابت الزمن','Time constant','Constante de temps')],
    ['x\\left(t\\right)=\\frac{1}{2}at^2+v_{0}t+x_{0}', ()=>L('معادلة الحركة','Equation of motion','Équation horaire')],
    ['N\\left(t\\right)=N_{0}e^{-\\lambda t}', ()=>L('التناقص الإشعاعي','Radioactive decay','Décroissance radioactive')],
    ['F=G\\frac{m_{A}m_{B}}{d^2}', ()=>L('قانون الجذب العام','Gravitation','Gravitation')],
    ['T_{0}=2\\pi\\sqrt{\\frac{l}{g}}', ()=>L('دور النواس البسيط','Pendulum period','Période du pendule')],
    ['\\rho=\\frac{m}{V}', ()=>L('الكتلة الحجمية','Density','Masse volumique')],
  ]},
  { g:()=>L('كيمياء','Chemistry','Chimie'), items:[
    ['2\\mathrm{H_2}+\\mathrm{O_2}\\longrightarrow2\\mathrm{H_2O}', ()=>L('معادلة كيميائية موزونة','Balanced equation','Équation équilibrée')],
    ['\\mathrm{CH_4}+2\\mathrm{O_2}\\longrightarrow\\mathrm{CO_2}+2\\mathrm{H_2O}', ()=>L('احتراق الميثان','Methane combustion','Combustion du méthane')],
    ['\\mathrm{H_3O^{+}}+\\mathrm{HO^{-}}\\longrightarrow2\\mathrm{H_2O}', ()=>L('حمض + أساس','Acid + base','Acide + base')],
    ['\\mathrm{Cu^{2+}}+\\mathrm{Zn}\\longrightarrow\\mathrm{Cu}+\\mathrm{Zn^{2+}}', ()=>L('أكسدة وإرجاع','Redox','Oxydoréduction')],
    ['\\mathrm{CH_3COOH}+\\mathrm{H_2O}\\rightleftharpoons\\mathrm{CH_3COO^{-}}+\\mathrm{H_3O^{+}}', ()=>L('توازن كيميائي','Equilibrium','Équilibre')],
    ['n=\\frac{m}{M}', ()=>L('كمية المادة','Amount of substance','Quantité de matière')],
    ['C=\\frac{n}{V}', ()=>L('التركيز المولي','Concentration','Concentration')],
    ['\\mathrm{pH}=-\\log\\left[\\mathrm{H_3O^{+}}\\right]', ()=>'pH'],
    ['{}_{6}^{14}\\mathrm{C}\\longrightarrow{}_{7}^{14}\\mathrm{N}+{}_{-1}^{0}\\mathrm{e}', ()=>L('تفكك نووي','Nuclear decay','Désintégration')],
  ]},
  { g:()=>L('علوم طبيعية','Biology','SVT'), items:[
    ['6\\mathrm{CO_2}+6\\mathrm{H_2O}\\xrightarrow{\\text{ضوء}}\\mathrm{C_6H_{12}O_6}+6\\mathrm{O_2}', ()=>L('التركيب الضوئي','Photosynthesis','Photosynthèse')],
    ['\\mathrm{C_6H_{12}O_6}+6\\mathrm{O_2}\\longrightarrow6\\mathrm{CO_2}+6\\mathrm{H_2O}+\\text{طاقة}', ()=>L('التنفس الخلوي','Respiration','Respiration')],
    ['\\mathrm{C_6H_{12}O_6}\\longrightarrow2\\mathrm{C_2H_5OH}+2\\mathrm{CO_2}', ()=>L('التخمر الكحولي','Fermentation','Fermentation')],
    ['E+S\\rightleftharpoons ES\\longrightarrow E+P', ()=>L('التفاعل الإنزيمي','Enzyme reaction','Réaction enzymatique')],
  ]},
];

/* ---------- MathJax rendering ---------- */
const _faceCache = {};
function cleanLatex(latex){
  return (latex || '')
    .replace(/\\placeholder(\[[^\]]*\])?\{[^}]*\}/g, '\\square')
    .replace(/\\mleft/g, '\\left').replace(/\\mright/g, '\\right')
    .replace(/#[0?@]/g, '\\square')
    .trim();
}
async function latexToSvg(latex, display){
  await loadMathJax();
  const node = await MathJax.tex2svgPromise(cleanLatex(latex) || '\\square', { display: !!display });
  const svg = node.querySelector('svg');
  const err = node.querySelector('[data-mml-node="merror"]');
  return { svg: svg ? ensureSvgNs(svg.outerHTML) : '', error: err ? (err.getAttribute('title') || err.textContent || 'error') : null };
}
async function faceSvg(latex){
  if(_faceCache[latex]) return _faceCache[latex];
  const r = await latexToSvg(latex, false);
  return (_faceCache[latex] = r.svg);
}

registerKind('eq', {
  label: () => L('معادلة','Equation','Équation'), icon: '∑', color: '#2563EB',
  render: (obj) => `<span class="eq-svg">${obj.svg || `<code>${escapeHtml(obj.data && obj.data.latex)}</code>`}</span>`,
  edit: openEquationEditor,
});

/* Make sure an equation object has its svg (used by templates / library items stored as LaTeX only) */
async function ensureEqSvg(obj){
  if(obj.kind === 'eq' && !obj.svg){
    const r = await latexToSvg('\\displaystyle ' + obj.data.latex, false);
    obj.svg = r.svg;
  }
  return obj;
}

/* ---------- Editor modal ---------- */
function openEquationEditor(obj, done, opts){
  opts = opts || {};
  const editing = !!(obj && obj.svg);
  const startLatex = (obj && obj.data && obj.data.latex) || '';
  let size = (obj && obj.data && obj.data.size) || 1;
  let curGroup = EQ_GROUPS[0].id;
  const footer = opts.mode === 'library'
    ? `<button class="big-btn ghost" data-close>${L('إلغاء','Cancel','Annuler')}</button>
       <button class="big-btn primary" data-save="lib">📚 ${L('حفظ في مكتبتي','Save to my library','Enregistrer')}</button>`
    : editing
      ? `<button class="big-btn ghost" data-close>${L('إلغاء','Cancel','Annuler')}</button>
         <button class="big-btn primary" data-save="edit">✔ ${L('حفظ التعديل','Save changes','Enregistrer')}</button>`
      : `<button class="big-btn ghost" data-close>${L('إلغاء','Cancel','Annuler')}</button>
         <button class="big-btn secondary" data-save="inline">↩ ${L('إدراج داخل السطر','Insert in the line','Insérer dans la ligne')}</button>
         <button class="big-btn primary" data-save="block">⬇ ${L('إدراج في سطر مستقل','Insert on its own line','Insérer sur une ligne')}</button>`;
  const m = openModal({
    icon: '∑', color: '#2563EB', title: L('أداة المعادلات','Equation tool','Outil équations'), cls: 'eq-modal', footer,
    body: `
      <div class="eq-layout">
        <aside class="eq-examples">
          <div class="side-title">✨ ${L('أمثلة جاهزة — اضغط لاستعمالها','Ready examples — click to use','Exemples prêts — cliquez')}</div>
          <div class="eq-ex-list"></div>
        </aside>
        <section class="eq-main">
          <div class="eq-tabs">${EQ_GROUPS.map(g => `<button class="eq-tab" data-g="${g.id}" style="--c:${g.color}"><span>${g.icon}</span>${g.name()}</button>`).join('')}</div>
          <div class="eq-btns"></div>
          <div class="eq-field-wrap">
            <div class="eq-field-label">✍️ ${L('اكتب أو اضغط على الأزرار أعلاه — المربع الفارغ ▢ هو مكان الكتابة','Type or use the buttons above — the empty box ▢ is where you type','Tapez ou utilisez les boutons — le carré ▢ est l\u2019endroit où écrire')}</div>
            <div class="eq-field-host" dir="ltr"></div>
            <div class="eq-field-tools">
              <button class="mini-btn" data-act="undo">↶ ${L('تراجع','Undo','Annuler')}</button>
              <button class="mini-btn" data-act="redo">↷ ${L('إعادة','Redo','Rétablir')}</button>
              <button class="mini-btn" data-act="clear">🧹 ${L('مسح الكل','Clear all','Tout effacer')}</button>
              <span class="grow"></span>
              <label class="mini-check"><input type="checkbox" data-act="latex"> ${L('الكتابة بـ LaTeX (للمتقدمين)','Write LaTeX (advanced)','Écrire en LaTeX (avancé)')}</label>
            </div>
            <textarea class="eq-latex hidden" dir="ltr" spellcheck="false" placeholder="\\frac{a}{b}"></textarea>
          </div>
          <div class="eq-preview-wrap">
            <div class="eq-preview-label">👁️ ${L('هكذا ستظهر في ورقة الامتحان:','This is how it will look on the paper:','Aperçu sur la feuille :')}</div>
            <div class="eq-preview" dir="ltr"></div>
            <div class="eq-size seg">
              <span>${L('الحجم:','Size:','Taille :')}</span>
              <button data-size="0.85">${L('صغير','Small','Petit')}</button>
              <button data-size="1">${L('عادي','Normal','Normal')}</button>
              <button data-size="1.3">${L('كبير','Large','Grand')}</button>
            </div>
          </div>
        </section>
      </div>`,
  });
  const stopLoad = showLoading(m.body, L('جارٍ تحضير أداة المعادلات...','Preparing the equation tool...','Préparation...'));
  const btnsBox = m.body.querySelector('.eq-btns');
  const preview = m.body.querySelector('.eq-preview');
  const ta = m.body.querySelector('.eq-latex');
  let mf = null, lastRendered = { latex: null, svg: '' }, renderTimer = null;

  Promise.all([loadMathLive(), loadMathJax()]).then(() => {
    stopLoad();
    if(window.MathfieldElement){ try{ MathfieldElement.soundsDirectory = null; }catch(e){} }
    mf = document.createElement('math-field');
    mf.setAttribute('math-virtual-keyboard-policy', 'manual');
    mf.className = 'eq-field';
    m.body.querySelector('.eq-field-host').appendChild(mf);
    try{ mf.smartFence = true; mf.menuItems = []; }catch(e){}
    mf.value = startLatex;
    mf.addEventListener('input', () => { if(document.activeElement !== ta) ta.value = mf.value; schedulePreview(); });
    ta.value = startLatex;
    ta.addEventListener('input', () => { mf.value = ta.value; schedulePreview(); });
    setTimeout(() => mf.focus(), 60);
    drawButtons(); drawExamples(); schedulePreview(0);
  }).catch(err => { stopLoad(); preview.textContent = '⚠ ' + err.message; });

  function currentLatex(){ return mf ? mf.getValue('latex') : ta.value; }
  function schedulePreview(delay){
    clearTimeout(renderTimer);
    renderTimer = setTimeout(async () => {
      const latex = currentLatex();
      if(!latex.trim()){ preview.innerHTML = `<span class="eq-empty">${L('المعاينة تظهر هنا','Preview appears here','L\u2019aperçu apparaît ici')}</span>`; lastRendered = { latex, svg:'' }; return; }
      const r = await latexToSvg('\\displaystyle ' + latex, false);
      lastRendered = { latex, svg: r.svg, error: r.error };
      preview.innerHTML = `<span style="font-size:${size * 1.6}em">${r.svg}</span>` + (r.error ? `<div class="eq-err">⚠ ${L('هناك خطأ في الكتابة','There is a typing error','Erreur de saisie')}: ${escapeHtml(r.error)}</div>` : '');
    }, delay == null ? 220 : delay);
  }
  function drawButtons(){
    m.body.querySelectorAll('.eq-tab').forEach(b => b.classList.toggle('on', b.dataset.g === curGroup));
    const g = EQ_GROUPS.find(x => x.id === curGroup);
    btnsBox.style.setProperty('--c', g.color);
    btnsBox.innerHTML = g.items.map((it, i) => `<button class="eq-btn" data-i="${i}" title="${escAttr(it[2]())}"><span class="eq-face" data-face="${escAttr(it[1])}"></span><span class="eq-lbl">${it[2]()}</span></button>`).join('');
    btnsBox.querySelectorAll('.eq-btn').forEach(b => {
      b.addEventListener('mousedown', e => e.preventDefault());
      b.addEventListener('click', () => {
        const it = g.items[+b.dataset.i];
        if(!mf) return;
        if(ta.classList.contains('hidden') === false && document.activeElement === ta){
          const s = ta.selectionStart; ta.setRangeText(it[0].replace(/#[0?@]/g, ''), s, ta.selectionEnd, 'end'); ta.dispatchEvent(new Event('input')); return;
        }
        mf.executeCommand(['insert', it[0], { selectionMode: 'placeholder', focus: true }]);
        mf.focus();
        ta.value = mf.value; schedulePreview();
      });
    });
    btnsBox.querySelectorAll('.eq-face').forEach(async f => { f.innerHTML = await faceSvg(f.dataset.face); });
  }
  function drawExamples(){
    const list = m.body.querySelector('.eq-ex-list');
    list.innerHTML = EQ_EXAMPLES.map((grp, gi) => `<div class="ex-group">${grp.g()}</div>` + grp.items.map((it, i) =>
      `<button class="ex-card" data-g="${gi}" data-i="${i}"><span class="ex-name">${it[1]()}</span><span class="ex-face" dir="ltr" data-face="${escAttr(it[0])}"></span></button>`).join('')).join('');
    list.querySelectorAll('.ex-card').forEach(b => b.addEventListener('click', () => {
      const it = EQ_EXAMPLES[+b.dataset.g].items[+b.dataset.i];
      mf.value = it[0]; ta.value = it[0]; mf.focus(); schedulePreview(0);
    }));
    list.querySelectorAll('.ex-face').forEach(async f => { f.innerHTML = await faceSvg(f.dataset.face); });
  }
  m.body.querySelectorAll('.eq-tab').forEach(b => b.addEventListener('click', () => { curGroup = b.dataset.g; drawButtons(); }));
  m.body.querySelectorAll('[data-size]').forEach(b => {
    b.classList.toggle('on', +b.dataset.size === size);
    b.addEventListener('click', () => { size = +b.dataset.size; m.body.querySelectorAll('[data-size]').forEach(x => x.classList.toggle('on', x === b)); schedulePreview(0); });
  });
  m.body.querySelector('[data-act="undo"]').onclick = () => { mf && mf.executeCommand('undo'); schedulePreview(); };
  m.body.querySelector('[data-act="redo"]').onclick = () => { mf && mf.executeCommand('redo'); schedulePreview(); };
  m.body.querySelector('[data-act="clear"]').onclick = () => { if(mf){ mf.value = ''; ta.value = ''; mf.focus(); schedulePreview(0); } };
  m.body.querySelector('[data-act="latex"]').onchange = (e) => { ta.classList.toggle('hidden', !e.target.checked); if(e.target.checked) ta.focus(); };

  m.foot.querySelectorAll('[data-save]').forEach(b => b.addEventListener('click', async () => {
    const latex = currentLatex().trim();
    if(!latex){ toast(L('اكتب المعادلة أولًا','Write the equation first','Écrivez d\u2019abord l\u2019équation'), 'warn'); return; }
    const r = (lastRendered.latex === latex && lastRendered.svg) ? lastRendered : await latexToSvg('\\displaystyle ' + latex, false);
    const res = { kind: 'eq', data: { latex, size }, svg: r.svg };
    if(b.dataset.save === 'block') res._wantBlock = true;
    m.close();
    done(res);
  }));
}
