/* ============ حاسبة الراتب — 3 لغات + حفظ تلقائي + Google ============ */
(function(){
  const $ = id => document.getElementById(id);
  const SAVE_KEY = 'salary_calc_v1';
  let toolLang = 'ar';

  /* ---------- الترجمات ---------- */
  const T = {
    ar: { dir:'rtl', locale:'fr-DZ',
      title:'حاسبة الراتب', emp:'معلومات الموظف', name:'الاسم الكامل', job:'المنصب',
      sector:'القطاع', pub:'عمومي', priv:'خاص', month:'الشهر', currency:'العملة',
      base_t:'الأجر الأساسي', base:'الأجر القاعدي', days:'أيام العمل',
      iep:'الخبرة المهنية IEP (%)', zone:'منحة المنطقة (%)',
      a1:'منح خاضعة للاشتراك والضريبة', a2:'منح خاضعة للضريبة فقط (سلة / نقل...)',
      add_a:'+ إضافة منحة', fam:'المنح العائلية (معفاة)', kids:'عدد الأبناء',
      kid_amt:'المبلغ لكل طفل', single:'الأجر الوحيد — زوجة غير عاملة',
      ded:'الاقتطاعات', cnas:'الضمان الاجتماعي CNAS (%)', irg:'وضعية IRG',
      irg_n:'عادي (الجدول الجزائري 2022)', irg_s:'معاق / متقاعد', irg_e:'معفى', irg_m:'إدخال يدوي',
      irg_type:'طريقة الإدخال اليدوي', irg_t_amt:'مبلغ ثابت', irg_t_pct:'نسبة % من الوعاء',
      irg_amt:'قيمة الضريبة', add_d:'+ إضافة اقتطاع (تعاضدية، سلفة...)',
      slip:'كشف الراتب', sec_pub:'قطاع عمومي', sec_priv:'قطاع خاص', mon:'شهر',
      item:'البيان', amount:'المبلغ',
      base_line:d=>`الأجر القاعدي (${d}/30 يوم)`, iep_line:'تعويض الخبرة المهنية IEP',
      zone_line:'منحة المنطقة', kids_line:c=>`منحة الأولاد (× ${c})`, single_line:'الأجر الوحيد',
      tot_e:'مجموع المستحقات', cnas_line:r=>`الضمان الاجتماعي CNAS (${r}%)`,
      irg_line:'الضريبة على الدخل IRG', tot_d:'مجموع الاقتطاعات', net:'الصافي للدفع',
      print:'🖨️ طباعة الكشف', noname:'بدون اسم', ph_name:'الاسم', ph_amt:'المبلغ',
      basket:'منحة السلة', transport:'منحة النقل' },
    fr: { dir:'ltr', locale:'fr-FR',
      title:'Calculateur de salaire', emp:'Informations de l’employé', name:'Nom complet',
      job:'Poste', sector:'Secteur', pub:'Public', priv:'Privé', month:'Mois', currency:'Devise',
      base_t:'Salaire de base', base:'Salaire de base', days:'Jours travaillés',
      iep:'Expérience prof. IEP (%)', zone:'Prime de zone (%)',
      a1:'Primes soumises à cotisation et impôt', a2:'Primes soumises à l’impôt seulement (panier / transport...)',
      add_a:'+ Ajouter une prime', fam:'Allocations familiales (exonérées)', kids:'Nombre d’enfants',
      kid_amt:'Montant par enfant', single:'Salaire unique — conjoint sans emploi',
      ded:'Retenues', cnas:'Sécurité sociale CNAS (%)', irg:'Mode IRG',
      irg_n:'Normal (barème algérien 2022)', irg_s:'Handicapé / retraité', irg_e:'Exonéré', irg_m:'Saisie manuelle',
      irg_type:'Mode de saisie manuelle', irg_t_amt:'Montant fixe', irg_t_pct:'% de la base imposable',
      irg_amt:'Valeur de l’impôt', add_d:'+ Ajouter une retenue (mutuelle, avance...)',
      slip:'Bulletin de paie', sec_pub:'Secteur public', sec_priv:'Secteur privé', mon:'Mois',
      item:'Désignation', amount:'Montant',
      base_line:d=>`Salaire de base (${d}/30 jours)`, iep_line:'Indemnité d’expérience IEP',
      zone_line:'Prime de zone', kids_line:c=>`Allocation enfants (× ${c})`, single_line:'Salaire unique',
      tot_e:'Total des gains', cnas_line:r=>`CNAS (${r}%)`,
      irg_line:'Impôt sur le revenu IRG', tot_d:'Total des retenues', net:'Net à payer',
      print:'🖨️ Imprimer', noname:'Sans nom', ph_name:'Nom', ph_amt:'Montant',
      basket:'Prime de panier', transport:'Prime de transport' },
    en: { dir:'ltr', locale:'en-US',
      title:'Salary Calculator', emp:'Employee Information', name:'Full Name',
      job:'Job Title', sector:'Sector', pub:'Public', priv:'Private', month:'Month', currency:'Currency',
      base_t:'Base Salary', base:'Base Salary', days:'Working Days',
      iep:'Prof. Experience IEP (%)', zone:'Zone Allowance (%)',
      a1:'Allowances subject to contribution and tax', a2:'Allowances subject to tax only (meal / transport...)',
      add_a:'+ Add allowance', fam:'Family Allowances (exempt)', kids:'Number of Children',
      kid_amt:'Amount per Child', single:'Single Salary — non-working spouse',
      ded:'Deductions', cnas:'Social Security CNAS (%)', irg:'IRG Mode',
      irg_n:'Normal (Algerian 2022 scale)', irg_s:'Disabled / Retired', irg_e:'Exempt', irg_m:'Manual Entry',
      irg_type:'Manual entry type', irg_t_amt:'Fixed amount', irg_t_pct:'% of tax base',
      irg_amt:'Tax value', add_d:'+ Add deduction (insurance, advance...)',
      slip:'Payslip', sec_pub:'Public sector', sec_priv:'Private sector', mon:'Month',
      item:'Description', amount:'Amount',
      base_line:d=>`Base salary (${d}/30 days)`, iep_line:'Experience allowance IEP',
      zone_line:'Zone allowance', kids_line:c=>`Children allowance (× ${c})`, single_line:'Single salary',
      tot_e:'Total earnings', cnas_line:r=>`CNAS (${r}%)`,
      irg_line:'Income tax IRG', tot_d:'Total deductions', net:'Net Pay',
      print:'🖨️ Print', noname:'Unnamed', ph_name:'Name', ph_amt:'Amount',
      basket:'Meal allowance', transport:'Transport allowance' },
  };

  function fmt(n){
    const cur = $('curInput').value.trim();
    const num = new Intl.NumberFormat(T[toolLang].locale, {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(n);
    return cur ? `${num} ${cur}` : num;
  }

  /* ---------- الرقم بالحروف (3 لغات) ---------- */
  const AR1 = ['','واحد','اثنان','ثلاثة','أربعة','خمسة','ستة','سبعة','ثمانية','تسعة','عشرة','أحد عشر','اثنا عشر','ثلاثة عشر','أربعة عشر','خمسة عشر','ستة عشر','سبعة عشر','ثمانية عشر','تسعة عشر'];
  const AR10 = ['','','عشرون','ثلاثون','أربعون','خمسون','ستون','سبعون','ثمانون','تسعون'];
  const AR100 = ['','مائة','مائتان','ثلاثمائة','أربعمائة','خمسمائة','ستمائة','سبعمائة','ثمانمائة','تسعمائة'];
  function ar999(n){
    const p = [];
    if (n >= 100){ p.push(AR100[Math.floor(n/100)]); n %= 100; }
    if (n >= 20){ const u = n % 10; p.push(u ? AR1[u] + ' و' + AR10[Math.floor(n/10)] : AR10[Math.floor(n/10)]); }
    else if (n > 0) p.push(AR1[n]);
    return p.join(' و');
  }
  function wordsAr(n){
    if (!n) return 'صفر';
    const g = [], M = Math.floor(n/1e6), K = Math.floor(n%1e6/1e3), R = n%1e3;
    if (M) g.push(M === 1 ? 'مليون' : M === 2 ? 'مليونان' : ar999(M) + (M <= 10 ? ' ملايين' : ' مليون'));
    if (K) g.push(K === 1 ? 'ألف' : K === 2 ? 'ألفان' : K <= 10 ? ar999(K) + ' آلاف' : ar999(K) + ' ألف');
    if (R) g.push(ar999(R));
    return g.join(' و');
  }
  const FR1 = ['zéro','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze','treize','quatorze','quinze','seize','dix-sept','dix-huit','dix-neuf'];
  const FR10 = ['','dix','vingt','trente','quarante','cinquante','soixante','soixante','quatre-vingt','quatre-vingt'];
  function fr99(n){
    if (n < 20) return FR1[n];
    let t = Math.floor(n/10), r = n%10;
    if (t === 7 || t === 9){ r += 10; t--; }
    let s = FR10[t];
    if (t === 8 && r === 0) s += 's';
    if ((r === 1 || r === 11) && t < 8) s += ' et ' + FR1[r];
    else if (r) s += '-' + FR1[r];
    return s;
  }
  function fr999(n){
    if (n < 100) return fr99(n);
    const h = Math.floor(n/100), r = n%100;
    let s = h > 1 ? fr99(h) + ' cent' : 'cent';
    if (h > 1 && !r) s += 's';
    return r ? s + ' ' + fr99(r) : s;
  }
  function wordsFr(n){
    if (!n) return 'zéro';
    const g = [], M = Math.floor(n/1e6), K = Math.floor(n%1e6/1e3), R = n%1e3;
    if (M) g.push(fr999(M) + (M > 1 ? ' millions' : ' million'));
    if (K) g.push(K === 1 ? 'mille' : fr999(K) + ' mille');
    if (R) g.push(fr999(R));
    return g.join(' ');
  }
  const EN1 = ['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  const EN10 = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  function en99(n){ return n < 20 ? EN1[n] : EN10[Math.floor(n/10)] + (n%10 ? '-' + EN1[n%10] : ''); }
  function en999(n){ return n < 100 ? en99(n) : EN1[Math.floor(n/100)] + ' hundred' + (n%100 ? ' ' + en99(n%100) : ''); }
  function wordsEn(n){
    if (!n) return 'zero';
    const g = [], M = Math.floor(n/1e6), K = Math.floor(n%1e6/1e3), R = n%1e3;
    if (M) g.push(en999(M) + ' million');
    if (K) g.push(en999(K) + ' thousand');
    if (R) g.push(en999(R));
    return g.join(' ');
  }
  function toWords(n){
    n = Math.floor(Math.max(n, 0));
    return toolLang === 'ar' ? wordsAr(n) : toolLang === 'fr' ? wordsFr(n) : wordsEn(n);
  }

  /* ---------- صفوف ديناميكية ---------- */
  function addRow(listId, name, amount){
    const t = T[toolLang];
    const row = document.createElement('div');
    row.className = 'dyn-row';
    row.innerHTML = `
      <input type="text" placeholder="${t.ph_name}">
      <input type="number" min="0" placeholder="${t.ph_amt}">
      <button type="button" class="del-btn">×</button>`;
    row.children[0].value = name || '';
    row.children[1].value = amount || '';
    row.querySelector('.del-btn').addEventListener('click', () => { row.remove(); calc(); });
    row.querySelectorAll('input').forEach(i => i.addEventListener('input', calc));
    $(listId).appendChild(row);
  }
  function sumList(listId){
    const items = [];
    $(listId).querySelectorAll('.dyn-row').forEach(r => {
      const amt = +r.children[1].value || 0;
      if (amt > 0) items.push({ name: r.children[0].value.trim() || T[toolLang].noname, amt });
    });
    return items;
  }

  /* ---------- IRG ---------- */
  function bareme(base){
    const br = [[20000,0],[40000,.23],[80000,.27],[160000,.30],[320000,.33],[Infinity,.35]];
    let tax = 0, prev = 0;
    for (const [cap, rate] of br){
      if (base <= prev) break;
      tax += (Math.min(base, cap) - prev) * rate;
      prev = cap;
    }
    return tax;
  }
  function irg(base, mode){
    if (mode === 'manual'){
      const v = +$('irgManual').value || 0;
      return $('irgManualType').value === 'percent' ? base * v / 100 : v;
    }
    if (mode === 'exempt' || base <= 30000) return 0;
    let ab = Math.min(Math.max(bareme(base) * 0.4, 1000), 1500);
    let t = Math.max(bareme(base) - ab, 0);
    if (mode === 'special'){ if (base < 42500) t = Math.max(t * (93/61) - 81213/41, 0); }
    else { if (base < 35000) t = Math.max(t * (137/51) - 27925/8, 0); }
    return Math.floor(t / 10) * 10;
  }

  /* ---------- الحفظ التلقائي ---------- */
  const FIELD_IDS = ['empName','empJob','empSector','empMonth','curInput','baseSalary','workDays',
    'iepRate','zoneRate','childCount','childAmount','singleSalary','cnasRate','irgMode','irgManualType','irgManual'];
  function saveState(){
    const state = { lang: toolLang, fields: {}, lists: {} };
    FIELD_IDS.forEach(id => { if ($(id)) state.fields[id] = $(id).value; });
    ['allowList1','allowList2','dedList'].forEach(id => {
      state.lists[id] = [...$(id).querySelectorAll('.dyn-row')].map(r => [r.children[0].value, r.children[1].value]);
    });
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch(e){}
  }
  function loadState(){
    try { return JSON.parse(localStorage.getItem(SAVE_KEY)); } catch(e){ return null; }
  }

  /* ---------- جلب الاسم من حساب Google ---------- */
  function autofillName(){
    if ($('empName').value.trim()) return;
    try {
      const u = JSON.parse(localStorage.getItem('site_user'));
      if (u && u.name){ $('empName').value = u.name; }
    } catch(e){}
  }

  /* ---------- الحساب الرئيسي ---------- */
  function calc(){
    const t = T[toolLang];
    const days = Math.min(Math.max(+$('workDays').value || 0, 0), 30);
    const base = (+$('baseSalary').value || 0) * days / 30;
    const iep = base * (+$('iepRate').value || 0) / 100;
    const zone = base * (+$('zoneRate').value || 0) / 100;
    const list1 = sumList('allowList1'), list2 = sumList('allowList2'), deds = sumList('dedList');
    const sum1 = list1.reduce((s, i) => s + i.amt, 0);
    const sum2 = list2.reduce((s, i) => s + i.amt, 0);
    const kids = (+$('childCount').value || 0) * (+$('childAmount').value || 0);
    const single = +$('singleSalary').value || 0;

    const postePay = base + iep + zone + sum1;
    const cnas = postePay * (+$('cnasRate').value || 0) / 100;
    const taxBase = postePay - cnas + sum2;
    const irgVal = irg(taxBase, $('irgMode').value);
    const otherDeds = deds.reduce((s, i) => s + i.amt, 0);
    const net = taxBase - irgVal + kids + single - otherDeds;

    let rows = '';
    const R = (label, val, neg) => `<tr class="${neg ? 'ps-neg' : ''}"><td>${label}</td><td class="amt">${neg ? '−' : ''}${fmt(val)}</td></tr>`;
    if (base) rows += R(t.base_line(days), base);
    if (iep) rows += R(t.iep_line, iep);
    if (zone) rows += R(t.zone_line, zone);
    list1.forEach(i => rows += R(i.name, i.amt));
    list2.forEach(i => rows += R(i.name, i.amt));
    if (kids) rows += R(t.kids_line($('childCount').value), kids);
    if (single) rows += R(t.single_line, single);
    rows += `<tr class="ps-sub"><td>${t.tot_e}</td><td class="amt">${fmt(postePay + sum2 + kids + single)}</td></tr>`;
    if (cnas) rows += R(t.cnas_line($('cnasRate').value), cnas, true);
    rows += R(t.irg_line, irgVal, true);
    deds.forEach(i => rows += R(i.name, i.amt, true));
    rows += `<tr class="ps-sub ps-neg"><td>${t.tot_d}</td><td class="amt">−${fmt(cnas + irgVal + otherDeds)}</td></tr>`;

    const name = $('empName').value.trim();
    const job = $('empJob').value.trim();
    const month = $('empMonth').value;
    const secTxt = $('empSector').value === 'public' ? t.sec_pub : t.sec_priv;
    const cur = $('curInput').value.trim();

    $('payslip').innerHTML = `
      <div class="ps-head">
        <h3>${t.slip}</h3>
        ${name ? `<p><strong>${name}</strong></p>` : ''}
        <p>${job ? job + ' — ' : ''}${secTxt}</p>
        ${month ? `<p>${t.mon}: ${month}</p>` : ''}
      </div>
      <table class="ps-table">
        <tr><th>${t.item}</th><th>${t.amount}</th></tr>
        ${rows}
      </table>
      <div class="ps-net">
        <div class="lbl">${t.net}</div>
        <div class="val">${fmt(net)}</div>
      </div>
      <p class="ps-words">${net > 0 ? toWords(net) + (cur ? ' ' + cur : '') : ''}</p>`;

    saveState();
  }

  /* ---------- تبديل اللغة ---------- */
  function setLang(l){
    toolLang = l;
    const t = T[l];
    document.documentElement.setAttribute('dir', t.dir);
    document.documentElement.setAttribute('lang', l);
    document.querySelectorAll('[data-k]').forEach(el => {
      const v = t[el.dataset.k];
      if (typeof v === 'string') el.textContent = v;
    });
    document.querySelectorAll('.lang-bar button').forEach(b =>
      b.classList.toggle('active', b.dataset.lang === l));
    document.querySelectorAll('.dyn-row').forEach(r => {
      r.children[0].placeholder = t.ph_name;
      r.children[1].placeholder = t.ph_amt;
    });
    calc();
  }

  function toggleManual(){
    const show = $('irgMode').value === 'manual';
    $('irgManualWrap').classList.toggle('hidden', !show);
    $('irgManualTypeWrap').classList.toggle('hidden', !show);
  }

  /* ---------- تهيئة ---------- */
  document.querySelectorAll('.add-btn').forEach(b =>
    b.addEventListener('click', () => addRow(b.dataset.list)));
  document.querySelectorAll('.lang-bar button').forEach(b =>
    b.addEventListener('click', () => setLang(b.dataset.lang)));

  const saved = loadState();
  if (saved){
    Object.entries(saved.fields || {}).forEach(([id, v]) => { if ($(id)) $(id).value = v; });
    Object.entries(saved.lists || {}).forEach(([id, rows]) =>
      (rows || []).forEach(([n, a]) => addRow(id, n, a)));
  } else {
    addRow('allowList2', T.ar.basket, '');
    addRow('allowList2', T.ar.transport, '');
  }

  $('irgMode').addEventListener('change', () => { toggleManual(); calc(); });
  toggleManual();
  document.querySelectorAll('.salary-form input, .salary-form select')
    .forEach(el => el.addEventListener('input', calc));
  $('printBtn').addEventListener('click', () => window.print());
  if (!$('empMonth').value) $('empMonth').value = new Date().toISOString().slice(0, 7);

  autofillName();
  if (window.fbAuth){
    window.fbAuth.onAuthStateChanged(u => {
      if (u && u.displayName && !$('empName').value.trim()){
        $('empName').value = u.displayName;
        calc();
      }
    });
  }

  setLang(saved && saved.lang ? saved.lang : 'ar');
})();
