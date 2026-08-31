/* ============ حاسبة الراتب الجزائرية (IRG 2022 + CNAS) ============ */
(function(){
  const $ = id => document.getElementById(id);
  const fmt = n => new Intl.NumberFormat('fr-DZ', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(n) + ' دج';

  /* ---- صفوف ديناميكية (منح / اقتطاعات) ---- */
  function addRow(listId, name, amount){
    const row = document.createElement('div');
    row.className = 'dyn-row';
    row.innerHTML = `
      <input type="text" placeholder="الاسم" value="${name || ''}">
      <input type="number" min="0" placeholder="المبلغ" value="${amount || ''}">
      <button type="button" class="del-btn" title="حذف">×</button>`;
    row.querySelector('.del-btn').addEventListener('click', () => { row.remove(); calc(); });
    row.querySelectorAll('input').forEach(i => i.addEventListener('input', calc));
    $(listId).appendChild(row);
  }
  function sumList(listId){
    let items = [];
    $(listId).querySelectorAll('.dyn-row').forEach(r => {
      const name = r.children[0].value.trim();
      const amt = +r.children[1].value || 0;
      if (amt > 0) items.push({ name: name || 'بدون اسم', amt });
    });
    return items;
  }

  /* ---- IRG: الجدول الشهري الرسمي 2022 ---- */
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
    if (mode === 'exempt' || base <= 30000) return 0;
    let ab = bareme(base) * 0.4;
    ab = Math.min(Math.max(ab, 1000), 1500);
    let t = Math.max(bareme(base) - ab, 0);
    if (mode === 'special'){                       // معاق / متقاعد
      if (base < 42500) t = Math.max(t * (93/61) - 81213/41, 0);
    } else {
      if (base < 35000) t = Math.max(t * (137/51) - 27925/8, 0);
    }
    return Math.floor(t / 10) * 10;               // تقريب للعشرة الدنيا
  }

  /* ---- الرقم بالحروف (عربي) ---- */
  const ONES = ['','واحد','اثنان','ثلاثة','أربعة','خمسة','ستة','سبعة','ثمانية','تسعة','عشرة','أحد عشر','اثنا عشر','ثلاثة عشر','أربعة عشر','خمسة عشر','ستة عشر','سبعة عشر','ثمانية عشر','تسعة عشر'];
  const TENS = ['','','عشرون','ثلاثون','أربعون','خمسون','ستون','سبعون','ثمانون','تسعون'];
  const HUNDS = ['','مائة','مائتان','ثلاثمائة','أربعمائة','خمسمائة','ستمائة','سبعمائة','ثمانمائة','تسعمائة'];
  function under1000(n){
    const parts = [];
    if (n >= 100){ parts.push(HUNDS[Math.floor(n/100)]); n %= 100; }
    if (n >= 20){ const u = n % 10; parts.push(u ? ONES[u] + ' و' + TENS[Math.floor(n/10)] : TENS[Math.floor(n/10)]); }
    else if (n > 0){ parts.push(ONES[n]); }
    return parts.join(' و');
  }
  function toWords(n){
    n = Math.floor(n);
    if (n === 0) return 'صفر';
    const groups = [];
    const millions = Math.floor(n / 1000000);
    const thousands = Math.floor((n % 1000000) / 1000);
    const rest = n % 1000;
    if (millions) groups.push(millions === 1 ? 'مليون' : millions === 2 ? 'مليونان' : under1000(millions) + ' ملايين');
    if (thousands) groups.push(thousands === 1 ? 'ألف' : thousands === 2 ? 'ألفان' : thousands <= 10 ? under1000(thousands) + ' آلاف' : under1000(thousands) + ' ألف');
    if (rest) groups.push(under1000(rest));
    return groups.join(' و');
  }

  /* ---- الحساب الرئيسي ---- */
  function calc(){
    const days = Math.min(Math.max(+$('workDays').value || 0, 0), 30);
    const base = (+$('baseSalary').value || 0) * days / 30;
    const iep = base * (+$('iepRate').value || 0) / 100;
    const zone = base * (+$('zoneRate').value || 0) / 100;
    const list1 = sumList('allowList1');
    const list2 = sumList('allowList2');
    const deds = sumList('dedList');

    const sum1 = list1.reduce((s, i) => s + i.amt, 0);
    const sum2 = list2.reduce((s, i) => s + i.amt, 0);
    const kids = (+$('childCount').value || 0) * (+$('childAmount').value || 0);
    const single = +$('singleSalary').value || 0;

    const postePay = base + iep + zone + sum1;                 // وعاء CNAS
    const cnas = postePay * (+$('cnasRate').value || 0) / 100;
    const taxBase = postePay - cnas + sum2;                    // الوعاء الضريبي
    const irgVal = irg(taxBase, $('irgMode').value);
    const otherDeds = deds.reduce((s, i) => s + i.amt, 0);
    const net = taxBase - irgVal + kids + single - otherDeds;

    /* ---- بناء الكشف ---- */
    let rows = '';
    const R = (label, val, neg) => `<tr class="${neg ? 'ps-neg' : ''}"><td>${label}</td><td>${neg ? '−' : ''}${fmt(val)}</td></tr>`;
    if (base) rows += R(`الأجر القاعدي (${days}/30 يوم)`, base);
    if (iep) rows += R('تعويض الخبرة المهنية IEP', iep);
    if (zone) rows += R('منحة المنطقة', zone);
    list1.forEach(i => rows += R(i.name, i.amt));
    list2.forEach(i => rows += R(i.name, i.amt));
    if (kids) rows += R(`منحة الأولاد (× ${$('childCount').value})`, kids);
    if (single) rows += R('الأجر الوحيد', single);
    rows += `<tr class="ps-sub"><td>مجموع المستحقات</td><td>${fmt(postePay + sum2 + kids + single)}</td></tr>`;
    if (cnas) rows += R(`الضمان الاجتماعي CNAS (${$('cnasRate').value}%)`, cnas, true);
    rows += R('الضريبة على الدخل IRG', irgVal, true);
    deds.forEach(i => rows += R(i.name, i.amt, true));
    rows += `<tr class="ps-sub ps-neg"><td>مجموع الاقتطاعات</td><td>−${fmt(cnas + irgVal + otherDeds)}</td></tr>`;

    const name = $('empName').value.trim();
    const job = $('empJob').value.trim();
    const month = $('empMonth').value;

    $('payslip').innerHTML = `
      <div class="ps-head">
        <h3>كشف الراتب</h3>
        ${name ? `<p><strong>${name}</strong></p>` : ''}
        ${job ? `<p>${job} — قطاع ${$('empSector').value}</p>` : `<p>قطاع ${$('empSector').value}</p>`}
        ${month ? `<p>شهر: ${month}</p>` : ''}
      </div>
      <table class="ps-table">
        <tr><th>البيان</th><th>المبلغ</th></tr>
        ${rows}
      </table>
      <div class="ps-net">
        <div class="lbl">الصافي للدفع</div>
        <div class="val">${fmt(net)}</div>
      </div>
      <p class="ps-words">${net > 0 ? toWords(net) + ' دينار جزائري' : ''}</p>`;
  }

  /* ---- تهيئة ---- */
  document.querySelectorAll('.add-btn').forEach(b =>
    b.addEventListener('click', () => addRow(b.dataset.list)));
  addRow('allowList2', 'منحة السلة', '');
  addRow('allowList2', 'منحة النقل', '');
  document.querySelectorAll('.salary-form input, .salary-form select')
    .forEach(el => el.addEventListener('input', calc));
  $('printBtn').addEventListener('click', () => window.print());
  const now = new Date();
  $('empMonth').value = now.toISOString().slice(0, 7);
  calc();
})();
