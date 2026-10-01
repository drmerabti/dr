/* ================= Ready-made shapes for the drawing tool =================
   SVG shapes (circuits, lab equipment, solids, mechanics, biology) are inserted as movable/rotatable groups.
   Geometry shapes are built from real points and segments so their names stay editable. */

const S_ = (vb, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const TXT = (x, y, s, size, extra) => `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size || 14}" font-weight="700" fill="#111" stroke="none" text-anchor="middle" ${extra || ''}>${s}</text>`;
const LIQ = '#BFDBFE';

const SHAPE_LIB = [
  { id:'geo', icon:'🔺', name:()=>L('هندسة','Geometry','Géométrie'), items:[
    { k:'tri', n:()=>L('مثلث','Triangle','Triangle'), geo:true },
    { k:'tri-right', n:()=>L('مثلث قائم','Right triangle','Triangle rectangle'), geo:true },
    { k:'tri-iso', n:()=>L('مثلث متساوي الساقين','Isosceles','Isocèle'), geo:true },
    { k:'tri-equi', n:()=>L('مثلث متقايس الأضلاع','Equilateral','Équilatéral'), geo:true },
    { k:'square', n:()=>L('مربع','Square','Carré'), geo:true },
    { k:'rect', n:()=>L('مستطيل','Rectangle','Rectangle'), geo:true },
    { k:'para', n:()=>L('متوازي أضلاع','Parallelogram','Parallélogramme'), geo:true },
    { k:'rhombus', n:()=>L('معين','Rhombus','Losange'), geo:true },
    { k:'trap', n:()=>L('شبه منحرف','Trapezoid','Trapèze'), geo:true },
    { k:'circle', n:()=>L('دائرة ومركزها','Circle & centre','Cercle et centre'), geo:true },
    { k:'circ-tri', n:()=>L('مثلث محاط بدائرة','Inscribed triangle','Triangle inscrit'), geo:true },
    { k:'thales', n:()=>L('وضعية طالس','Thales figure','Configuration de Thalès'), geo:true },
    { k:'axes', n:()=>L('معلم متعامد','Coordinate axes','Repère orthogonal'), svg: () => axesSvg(8, 6) },
  ]},
  { id:'solid', icon:'🧊', name:()=>L('مجسمات','Solids','Solides'), items:[
    { k:'cube', n:()=>L('مكعب','Cube','Cube'), svg:()=>S_('0 0 130 130', `<path d="M10 45h70v75H10zM10 45l35-35h70L80 45M115 10v75l-35 35"/><path d="M45 10v75h70M45 85l-35 35" stroke-dasharray="5 4"/>`) },
    { k:'cuboid', n:()=>L('متوازي مستطيلات','Cuboid','Pavé droit'), svg:()=>S_('0 0 170 120', `<path d="M10 40h110v70H10zM10 40l40-30h110l-40 30M160 10v70l-40 30"/><path d="M50 10v70h110M50 80l-40 30" stroke-dasharray="5 4"/>`) },
    { k:'pyramid', n:()=>L('هرم','Pyramid','Pyramide'), svg:()=>S_('0 0 140 140', `<path d="M10 110l40 20h80M10 110L70 10l60 120M50 130L70 10"/><path d="M10 110h70l50 20M80 110L70 10" stroke-dasharray="5 4"/>`) },
    { k:'cylinder', n:()=>L('أسطوانة','Cylinder','Cylindre'), svg:()=>S_('0 0 110 150', `<ellipse cx="55" cy="20" rx="45" ry="12"/><path d="M10 20v110M100 20v110M10 130a45 12 0 0 0 90 0"/><path d="M10 130a45 12 0 0 1 90 0" stroke-dasharray="5 4"/>`) },
    { k:'cone', n:()=>L('مخروط','Cone','Cône'), svg:()=>S_('0 0 110 150', `<path d="M10 130L55 10l45 120M10 130a45 12 0 0 0 90 0"/><path d="M10 130a45 12 0 0 1 90 0M55 10v120h45" stroke-dasharray="5 4"/>`) },
    { k:'sphere', n:()=>L('كرة','Sphere','Sphère'), svg:()=>S_('0 0 120 120', `<circle cx="60" cy="60" r="50"/><path d="M10 60a50 14 0 0 0 100 0"/><path d="M10 60a50 14 0 0 1 100 0" stroke-dasharray="5 4"/><circle cx="60" cy="60" r="2" fill="#111"/>`) },
    { k:'prism', n:()=>L('موشور قائم','Triangular prism','Prisme droit'), svg:()=>S_('0 0 160 120', `<path d="M10 110L40 30L70 110ZM40 30L120 20L150 100L70 110"/><path d="M10 110L90 100L120 20M90 100H150" stroke-dasharray="5 4"/>`) },
  ]},
  { id:'elec', icon:'⚡', name:()=>L('كهرباء','Electricity','Électricité'), items:[
    { k:'battery', n:()=>L('عمود (مولد)','Cell / battery','Pile'), svg:()=>S_('0 0 80 40', `<path d="M0 20h34M46 20h34"/><path d="M34 5v30"/><path d="M46 12v16" stroke-width="5"/>${TXT(26,11,'+',12)}${TXT(54,11,'−',12)}`) },
    { k:'gen', n:()=>L('مولد','Generator','Générateur'), svg:()=>S_('0 0 80 40', `<path d="M0 20h26M54 20h26"/><circle cx="40" cy="20" r="14"/><path d="M40 10v20"/>${TXT(31,17,'+',11)}${TXT(50,17,'−',11)}`) },
    { k:'gbf', n:()=>L('مولد GBF','Signal generator','GBF'), svg:()=>S_('0 0 80 40', `<path d="M0 20h26M54 20h26"/><circle cx="40" cy="20" r="14"/><path d="M31 20q4.5-9 9 0t9 0"/>`) },
    { k:'resistor', n:()=>L('ناقل أومي (مقاومة)','Resistor','Résistor'), svg:()=>S_('0 0 80 40', `<path d="M0 20h20M60 20h20"/><rect x="20" y="12" width="40" height="16"/>`) },
    { k:'lamp', n:()=>L('مصباح','Lamp','Lampe'), svg:()=>S_('0 0 80 40', `<path d="M0 20h28M52 20h28"/><circle cx="40" cy="20" r="12"/><path d="M31.5 11.5l17 17M48.5 11.5l-17 17"/>`) },
    { k:'sw-open', n:()=>L('قاطعة مفتوحة','Open switch','Interrupteur ouvert'), svg:()=>S_('0 0 80 40', `<path d="M0 26h24M56 26h24M26 26l26-16"/><circle cx="25" cy="26" r="2.5" fill="#111"/><circle cx="55" cy="26" r="2.5" fill="#111"/>`) },
    { k:'sw-closed', n:()=>L('قاطعة مغلقة','Closed switch','Interrupteur fermé'), svg:()=>S_('0 0 80 40', `<path d="M0 26h80"/><circle cx="25" cy="26" r="2.5" fill="#111"/><circle cx="55" cy="26" r="2.5" fill="#111"/>`) },
    { k:'ammeter', n:()=>L('جهاز أمبيرمتر','Ammeter','Ampèremètre'), svg:()=>S_('0 0 80 40', `<path d="M0 20h26M54 20h26"/><circle cx="40" cy="20" r="14"/>${TXT(40,25,'A',15)}`) },
    { k:'voltmeter', n:()=>L('جهاز فولطمتر','Voltmeter','Voltmètre'), svg:()=>S_('0 0 80 40', `<path d="M0 20h26M54 20h26"/><circle cx="40" cy="20" r="14"/>${TXT(40,25,'V',15)}`) },
    { k:'ohmmeter', n:()=>L('أوم متر','Ohmmeter','Ohmmètre'), svg:()=>S_('0 0 80 40', `<path d="M0 20h26M54 20h26"/><circle cx="40" cy="20" r="14"/>${TXT(40,25,'Ω',14)}`) },
    { k:'capacitor', n:()=>L('مكثفة','Capacitor','Condensateur'), svg:()=>S_('0 0 80 40', `<path d="M0 20h35M45 20h35M35 6v28M45 6v28"/>`) },
    { k:'coil', n:()=>L('وشيعة','Coil','Bobine'), svg:()=>S_('0 0 80 40', `<path d="M0 22h16M64 22h16M16 22a6 7 0 0 1 12 0a6 7 0 0 1 12 0a6 7 0 0 1 12 0a6 7 0 0 1 12 0"/>`) },
    { k:'diode', n:()=>L('صمام ثنائي','Diode','Diode'), svg:()=>S_('0 0 80 40', `<path d="M0 20h30M50 20h30M50 8v24"/><path d="M30 8v24l20-12z" fill="#111"/>`) },
    { k:'led', n:()=>L('صمام ضوئي LED','LED','DEL'), svg:()=>S_('0 0 80 44', `<path d="M0 24h30M50 24h30M50 12v24"/><path d="M30 12v24l20-12z" fill="#111"/><path d="M44 8l8-7M50 11l8-7M49 1h3v3M55 4h3v3" stroke-width="1.6"/>`) },
    { k:'motor', n:()=>L('محرك','Motor','Moteur'), svg:()=>S_('0 0 80 40', `<path d="M0 20h26M54 20h26"/><circle cx="40" cy="20" r="14"/>${TXT(40,25,'M',15)}`) },
    { k:'node', n:()=>L('عقدة','Junction','Nœud'), svg:()=>S_('0 0 40 40', `<path d="M0 20h40M20 20v20"/><circle cx="20" cy="20" r="3.5" fill="#111"/>`) },
    { k:'circuit-series', n:()=>L('دارة على التسلسل','Series circuit','Circuit en série'), svg:()=>S_('0 0 240 170', `<path d="M20 20h80M140 20h80v55M220 115v35H140M100 150H20v-35M20 75V20"/><path d="M100 20h14M126 20h14M114 5v30"/><path d="M126 12v16" stroke-width="5"/><circle cx="220" cy="95" r="12"/><path d="M211.5 86.5l17 17M228.5 86.5l-17 17M220 75v8M220 107v8"/><path d="M100 150l30-14M140 150h0"/><circle cx="100" cy="150" r="2.5" fill="#111"/><circle cx="140" cy="150" r="2.5" fill="#111"/><rect x="12" y="75" width="16" height="40"/>`) },
    { k:'circuit-parallel', n:()=>L('دارة على التفرع','Parallel circuit','Circuit en dérivation'), svg:()=>S_('0 0 240 180', `<path d="M20 20h85M135 20h85v140H20V20"/><path d="M105 20h10M125 20h10M115 6v28"/><path d="M125 12v16" stroke-width="5"/><path d="M80 20v42M80 98v62M160 20v42M160 98v62"/><circle cx="80" cy="80" r="12"/><path d="M71.5 71.5l17 17M88.5 71.5l-17 17M80 62v6M80 92v6"/><circle cx="160" cy="80" r="12"/><path d="M151.5 71.5l17 17M168.5 71.5l-17 17M160 62v6M160 92v6"/><circle cx="80" cy="20" r="3" fill="#111"/><circle cx="160" cy="20" r="3" fill="#111"/><circle cx="80" cy="160" r="3" fill="#111"/><circle cx="160" cy="160" r="3" fill="#111"/>`) },
    { k:'circuit-rc', n:()=>L('دارة RC','RC circuit','Circuit RC'), svg:()=>S_('0 0 240 170', `<path d="M20 20h40M100 20h40M180 20h40v55M220 95v55H20V95M20 75V20"/><path d="M60 20l30-14"/><circle cx="60" cy="20" r="2.5" fill="#111"/><circle cx="100" cy="20" r="2.5" fill="#111"/>${TXT(80,40,'K',13)}<rect x="140" y="12" width="40" height="16"/>${TXT(160,48,'R',13)}<path d="M200 75h40M200 95h40" transform="translate(0 0)"/><path d="M220 75v0"/>${TXT(236,90,'C',13)}<path d="M20 75v8M20 95v-12"/><path d="M8 75h24"/><path d="M14 95h12" stroke-width="5"/>${TXT(8,70,'+',12)}${TXT(40,90,'E',13)}`) },
  ]},
  { id:'lab', icon:'⚗️', name:()=>L('أدوات مخبرية','Lab equipment','Matériel de labo'), items:[
    { k:'beaker', n:()=>L('بيشر','Beaker','Bécher'), svg:()=>S_('0 0 90 110', `<path d="M18 50h54v45q0 8-8 8H26q-8 0-8-8z" fill="${LIQ}" stroke="none"/><path d="M12 8l6 4v83q0 8 8 8h38q8 0 8-8V12l6-4"/><path d="M72 30h-10M72 50h-10M72 70h-10" stroke-width="1.5"/>`) },
    { k:'erlen', n:()=>L('إرلنماير','Erlenmeyer flask','Erlenmeyer'), svg:()=>S_('0 0 90 120', `<path d="M24 72h42l16 30q3 10-8 10H16q-11 0-8-10z" fill="${LIQ}" stroke="none"/><path d="M34 6v38L8 102q-3 10 8 10h58q11 0 8-10L56 44V6M30 6h30"/>`) },
    { k:'tube', n:()=>L('أنبوب اختبار','Test tube','Tube à essai'), svg:()=>S_('0 0 50 130', `<path d="M15 70v40a10 10 0 0 0 20 0V70z" fill="${LIQ}" stroke="none"/><path d="M12 6h26M15 6v104a10 10 0 0 0 20 0V6"/>`) },
    { k:'cylinder-grad', n:()=>L('مخبار مدرج','Graduated cylinder','Éprouvette graduée'), svg:()=>S_('0 0 60 150', `<path d="M18 70h24v62H18z" fill="${LIQ}" stroke="none"/><path d="M14 8l4 4v120h24V12l4-4M8 140h44M18 132l-8 8M42 132l8 8"/><path d="M18 30h8M18 50h8M18 70h8M18 90h8M18 110h8" stroke-width="1.5"/>`) },
    { k:'burette', n:()=>L('سحاحة على حامل','Burette on stand','Burette sur support'), svg:()=>S_('0 0 120 200', `<path d="M10 190h70M25 190V10M25 40h40" /><path d="M60 12h10v130h-10z"/><path d="M60 40h10v100h-10z" fill="${LIQ}" stroke="none"/><path d="M60 142l5 12 5-12M58 148h14M65 154v10"/><path d="M60 30h5M60 50h5M60 70h5M60 90h5M60 110h5" stroke-width="1.2"/><path d="M50 172l6 18M80 172l-6 18M50 172h30" /><path d="M54 178h22l2 10H52z" fill="${LIQ}" stroke="none"/>`) },
    { k:'pipette', n:()=>L('ماصة','Pipette','Pipette'), svg:()=>S_('0 0 40 170', `<path d="M17 6v50M23 6v50M17 56q-8 6-8 18t8 18M23 56q8 6 8 18t-8 18M17 92v60l3 12 3-12V92M14 30h12" />`) },
    { k:'funnel', n:()=>L('قمع','Funnel','Entonnoir'), svg:()=>S_('0 0 90 120', `<path d="M8 10h74L50 58v50h-10V58z"/><path d="M14 16l28 30h6l28-30" stroke-width="1.2" stroke-dasharray="3 3"/>`) },
    { k:'flask', n:()=>L('دورق كروي','Round flask','Ballon'), svg:()=>S_('0 0 100 130', `<path d="M14 82a36 36 0 0 0 72 0z" fill="${LIQ}" stroke="none"/><path d="M40 6v42a36 36 0 1 0 20 0V6M36 6h28"/>`) },
    { k:'bunsen', n:()=>L('موقد بنزن','Bunsen burner','Bec Bunsen'), svg:()=>S_('0 0 80 130', `<path d="M10 120h60v6H10zM32 120V50h16v70M24 100h-14"/><path d="M40 48q-14-14 0-40q14 26 0 40z" fill="#FDBA74" stroke="#EA580C"/>`) },
    { k:'thermo', n:()=>L('ميزان حرارة','Thermometer','Thermomètre'), svg:()=>S_('0 0 40 160', `<path d="M14 10a6 6 0 0 1 12 0v110a12 12 0 1 1-12 0z"/><path d="M20 60v70" stroke="#DC2626" stroke-width="5"/><circle cx="20" cy="134" r="7" fill="#DC2626" stroke="none"/><path d="M26 30h6M26 50h6M26 70h6M26 90h6M26 110h6" stroke-width="1.5"/>`) },
    { k:'stand', n:()=>L('حامل مع ملقط','Stand & clamp','Support et pince'), svg:()=>S_('0 0 110 180', `<path d="M10 170h70v6H10zM30 170V10M30 50h50M80 44v12l10 0M80 56v-12"/><circle cx="30" cy="50" r="4"/>`) },
    { k:'scale', n:()=>L('ميزان إلكتروني','Electronic balance','Balance'), svg:()=>S_('0 0 120 80', `<path d="M10 40h100l-8 30H18z"/><path d="M20 30h80v10H20z"/><rect x="40" y="48" width="40" height="14" rx="2"/>${TXT(60,59,'0.00 g',10)}`) },
    { k:'dropper', n:()=>L('قطارة','Dropper','Compte-gouttes'), svg:()=>S_('0 0 40 130', `<path d="M14 40v70l6 12 6-12V40M12 40h16M14 40q-4-30 6-34q10 4 6 34" fill="#FCA5A5"/><path d="M20 126q-3 4 0 6q3-2 0-6" fill="${LIQ}"/>`) },
  ]},
  { id:'mech', icon:'🧲', name:()=>L('ميكانيك وضوء','Mechanics & optics','Mécanique et optique'), items:[
    { k:'incline', n:()=>L('مستوى مائل وجسم','Inclined plane','Plan incliné'), svg:()=>S_('0 0 200 120', `<path d="M10 110h180L10 20z"/><path d="M70 50l26 13-12 24-26-13z" fill="#E5E7EB"/><path d="M160 110a30 30 0 0 0 -5-16"/>${TXT(146,104,'α',14,'font-style="italic"')}`) },
    { k:'pulley', n:()=>L('بكرة','Pulley','Poulie'), svg:()=>S_('0 0 120 170', `<path d="M10 10h100M60 10v26"/><circle cx="60" cy="50" r="18"/><circle cx="60" cy="50" r="3" fill="#111"/><path d="M42 50v80M78 50v50"/><rect x="30" y="130" width="24" height="24" fill="#E5E7EB"/><rect x="68" y="100" width="20" height="20" fill="#E5E7EB"/>`) },
    { k:'spring', n:()=>L('نابض وجسم','Spring & mass','Ressort et masse'), svg:()=>S_('0 0 200 80', `<path d="M10 10v60M10 40h20l8-12 12 24 12-24 12 24 12-24 12 24 12-24 8 12h12"/><rect x="128" y="22" width="36" height="36" fill="#E5E7EB"/><path d="M10 70h180"/><path d="M10 74l6 6M30 74l6 6M50 74l6 6M70 74l6 6M90 74l6 6M110 74l6 6M130 74l6 6M150 74l6 6M170 74l6 6" stroke-width="1.2"/>`) },
    { k:'pendulum', n:()=>L('نواس بسيط','Simple pendulum','Pendule simple'), svg:()=>S_('0 0 140 160', `<path d="M20 10h100M70 10v130" /><path d="M70 10v130" stroke-dasharray="5 4" stroke-width="1.2"/><path d="M70 10L110 120"/><circle cx="112" cy="126" r="10" fill="#E5E7EB"/><path d="M70 50a40 40 0 0 0 14 -3"/>${TXT(80,66,'θ',13,'font-style="italic"')}`) },
    { k:'lens', n:()=>L('عدسة مقرّبة','Converging lens','Lentille convergente'), svg:()=>S_('0 0 200 140', `<path d="M10 70h180" stroke-dasharray="6 4" stroke-width="1.2"/><path d="M100 14v112M92 24l8-10 8 10M92 116l8 10 8-10"/><circle cx="60" cy="70" r="2.5" fill="#111"/><circle cx="140" cy="70" r="2.5" fill="#111"/>${TXT(60,88,'F',12)}${TXT(140,88,"F'",12)}${TXT(104,84,'O',12)}`) },
    { k:'magnet', n:()=>L('مغناطيس','Magnet','Aimant'), svg:()=>S_('0 0 140 50', `<rect x="10" y="10" width="60" height="30" fill="#FCA5A5"/><rect x="70" y="10" width="60" height="30" fill="#93C5FD"/>${TXT(40,31,'N',16)}${TXT(100,31,'S',16)}`) },
    { k:'ground', n:()=>L('سطح أفقي','Ground','Sol'), svg:()=>S_('0 0 200 30', `<path d="M5 8h190"/><path d="M15 10l-8 12M35 10l-8 12M55 10l-8 12M75 10l-8 12M95 10l-8 12M115 10l-8 12M135 10l-8 12M155 10l-8 12M175 10l-8 12M195 10l-8 12" stroke-width="1.2"/>`) },
    { k:'block', n:()=>L('جسم صلب','Solid block','Solide'), svg:()=>S_('0 0 80 60', `<rect x="10" y="10" width="60" height="40" fill="#E5E7EB"/><circle cx="40" cy="30" r="2.5" fill="#111"/>${TXT(48,26,'G',11)}`) },
  ]},
  { id:'bio', icon:'🌿', name:()=>L('علوم طبيعية','Biology','SVT'), items:[
    { k:'animal-cell', n:()=>L('خلية حيوانية','Animal cell','Cellule animale'), svg:()=>S_('0 0 180 130', `<path d="M20 60q0-45 70-50q75 0 75 55t-80 55q-65-5-65-60z" fill="#FEF3C7"/><circle cx="90" cy="65" r="20" fill="#DDD6FE"/><circle cx="94" cy="60" r="6" fill="#7C3AED" stroke="none"/><ellipse cx="45" cy="70" rx="12" ry="6" fill="#FCA5A5" transform="rotate(-20 45 70)"/><ellipse cx="135" cy="85" rx="12" ry="6" fill="#FCA5A5" transform="rotate(25 135 85)"/><circle cx="130" cy="40" r="3" fill="#111"/><circle cx="60" cy="40" r="3" fill="#111"/>`) },
    { k:'plant-cell', n:()=>L('خلية نباتية','Plant cell','Cellule végétale'), svg:()=>S_('0 0 180 130', `<rect x="10" y="10" width="160" height="110" rx="10"/><rect x="18" y="18" width="144" height="94" rx="8" fill="#ECFCCB"/><rect x="60" y="30" width="80" height="60" rx="20" fill="#E0F2FE"/><circle cx="40" cy="80" r="14" fill="#DDD6FE"/><circle cx="42" cy="78" r="4" fill="#7C3AED" stroke="none"/><ellipse cx="40" cy="35" rx="10" ry="5" fill="#4ADE80"/><ellipse cx="150" cy="95" rx="10" ry="5" fill="#4ADE80"/><ellipse cx="150" cy="35" rx="10" ry="5" fill="#4ADE80"/>`) },
    { k:'leaf', n:()=>L('ورقة نبات','Leaf','Feuille'), svg:()=>S_('0 0 160 100', `<path d="M10 50q60-60 140 0q-80 60-140 0z" fill="#BBF7D0"/><path d="M10 50h140M50 50l20-18M50 50l20 18M90 50l20-18M90 50l20 18" stroke-width="1.5"/>`) },
    { k:'flow', n:()=>L('مخطط بسيط (3 خانات)','Simple diagram','Schéma simple'), svg:()=>S_('0 0 300 70', `<rect x="5" y="15" width="70" height="40" rx="8"/><rect x="115" y="15" width="70" height="40" rx="8"/><rect x="225" y="15" width="70" height="40" rx="8"/><path d="M78 35h32M103 28l8 7-8 7M188 35h32M213 28l8 7-8 7"/>`) },
    { k:'cycle', n:()=>L('دورة (4 مراحل)','Cycle (4 steps)','Cycle (4 étapes)'), svg:()=>S_('0 0 220 220', `<rect x="80" y="5" width="60" height="36" rx="8"/><rect x="175" y="92" width="40" height="36" rx="8"/><rect x="80" y="179" width="60" height="36" rx="8"/><rect x="5" y="92" width="40" height="36" rx="8"/><path d="M145 25q45 10 50 62M190 80l5 8 5-8M195 133q-5 52-50 62M152 200l-8-5 8-6M75 195q-45-10-50-62M20 140l5-8 5 8M25 87q5-52 50-62M68 20l8 5-8 6"/>`) },
    { k:'legend', n:()=>L('خطوط البيانات (1،2،3)','Label lines','Légendes'), svg:()=>S_('0 0 140 110', `<path d="M10 20h90M10 55h90M10 90h90" stroke-width="1.4"/><circle cx="115" cy="20" r="11"/><circle cx="115" cy="55" r="11"/><circle cx="115" cy="90" r="11"/>${TXT(115,25,'1',13)}${TXT(115,60,'2',13)}${TXT(115,95,'3',13)}`) },
    { k:'microscope', n:()=>L('مجهر','Microscope','Microscope'), svg:()=>S_('0 0 120 170', `<path d="M20 160h80v-12H20zM60 148V110M40 120h50M50 30l20-20 10 10-20 20zM55 40l15 50M70 90l-10 20M85 100a30 30 0 0 0-20-60"/><rect x="38" y="112" width="44" height="6"/>`) },
  ]},
];

function axesSvg(nx, ny){
  const u = 30, W = (nx + 2) * u, H = (ny + 2) * u, ox = u * 1.5, oy = H - u * 1.5;
  let g = '';
  for(let i = 0; i <= nx; i++) g += `<path d="M${ox + i*u} ${oy - 3}v6" stroke-width="1.4"/>`;
  for(let j = 0; j <= ny; j++) g += `<path d="M${ox - 3} ${oy - j*u}h6" stroke-width="1.4"/>`;
  return S_(`0 0 ${W} ${H}`, `<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#111" stroke="none"/></marker></defs>
    <path d="M${ox - 10} ${oy}H${W - 6}" marker-end="url(#ah)"/><path d="M${ox} ${oy + 10}V6" marker-end="url(#ah)"/>${g}
    <path d="M${ox} ${oy}h${u}" stroke="#DC2626" stroke-width="2.5" marker-end="url(#ah)"/><path d="M${ox} ${oy}v${-u}" stroke="#DC2626" stroke-width="2.5" marker-end="url(#ah)"/>
    ${TXT(ox - 10, oy + 16, 'O', 14, 'font-style="italic" font-family="Times New Roman"')}${TXT(W - 10, oy - 8, 'x', 15, 'font-style="italic" font-family="Times New Roman"')}${TXT(ox + 12, 16, 'y', 15, 'font-style="italic" font-family="Times New Roman"')}
    ${TXT(ox + u/2, oy + 18, 'i', 13, 'font-style="italic" font-family="Times New Roman" fill="#DC2626"')}${TXT(ox - 12, oy - u/2 + 4, 'j', 13, 'font-style="italic" font-family="Times New Roman" fill="#DC2626"')}`);
}

/* Geometry presets: list of points (in grid units, relative) + derived items */
function geoPreset(k){
  const P = (n, x, y) => ({ n, x, y });
  switch(k){
    case 'tri': return { pts: [P('A',0,4), P('B',6,4), P('C',2,0)], items: [['segment',0,1],['segment',1,2],['segment',2,0]] };
    case 'tri-right': return { pts: [P('A',0,4), P('B',6,4), P('C',0,0)], items: [['segment',0,1],['segment',1,2],['segment',2,0],['right',0,1,2]] };
    case 'tri-iso': return { pts: [P('A',0,5), P('B',6,5), P('C',3,0)], items: [['segment',0,1],['segment',1,2],['segment',2,0],['tick',0,2,1],['tick',1,2,1]] };
    case 'tri-equi': return { pts: [P('A',0,5.2), P('B',6,5.2), P('C',3,0)], items: [['segment',0,1],['segment',1,2],['segment',2,0],['tick',0,1,1],['tick',1,2,1],['tick',2,0,1]] };
    case 'square': return { pts: [P('A',0,0), P('B',4,0), P('C',4,4), P('D',0,4)], items: [['segment',0,1],['segment',1,2],['segment',2,3],['segment',3,0],['tick',0,1,1],['tick',1,2,1],['tick',2,3,1],['tick',3,0,1],['right',0,1,3],['right',1,0,2]] };
    case 'rect': return { pts: [P('A',0,0), P('B',6,0), P('C',6,3), P('D',0,3)], items: [['segment',0,1],['segment',1,2],['segment',2,3],['segment',3,0],['right',0,1,3],['right',1,0,2],['right',2,1,3],['right',3,2,0]] };
    case 'para': return { pts: [P('A',0,4), P('B',5,4), P('C',7,0), P('D',2,0)], items: [['segment',0,1],['segment',1,2],['segment',2,3],['segment',3,0]] };
    case 'rhombus': return { pts: [P('A',0,3), P('B',3,6), P('C',6,3), P('D',3,0)], items: [['segment',0,1],['segment',1,2],['segment',2,3],['segment',3,0],['tick',0,1,1],['tick',1,2,1],['tick',2,3,1],['tick',3,0,1]] };
    case 'trap': return { pts: [P('A',0,4), P('B',7,4), P('C',5,0), P('D',2,0)], items: [['segment',0,1],['segment',1,2],['segment',2,3],['segment',3,0]] };
    case 'circle': return { pts: [P('O',3,3), P('M',6,3)], items: [['circle',0,1],['segment',0,1]] };
    case 'circ-tri': return { pts: [P('O',3,3), P('A',0,3), P('B',6,3), P('C',4.8,0.6)], items: [['circle',0,1],['segment',1,2],['segment',2,3],['segment',3,1],['right',3,1,2]] };
    case 'thales': return { pts: [P('A',3,0), P('B',0,6), P('C',7,6), P('M',1.5,3), P('N',5,3)], items: [['segment',0,1],['segment',1,2],['segment',2,0],['segment',3,4]] };
  }
  return null;
}
