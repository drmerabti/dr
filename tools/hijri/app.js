/* ============ محوّل ميلادي ⇄ هجري (أم القرى عبر Intl) ============ */
(function(){
  const HIJRI_MONTHS = ['محرم','صفر','ربيع الأول','ربيع الآخر','جمادى الأولى','جمادى الآخرة','رجب','شعبان','رمضان','شوال','ذو القعدة','ذو الحجة'];
  const GREG_FMT_AR = new Intl.DateTimeFormat('ar', { weekday:'long', day:'numeric', month:'long', year:'numeric', timeZone:'UTC' });
  const HIJRI_FMT   = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day:'numeric', month:'numeric', year:'numeric', timeZone:'UTC' });

  const gregInput = document.getElementById('gregInput');
  const hDay   = document.getElementById('hijriDay');
  const hMonth = document.getElementById('hijriMonth');
  const hYear  = document.getElementById('hijriYear');
  const gregReadable  = document.getElementById('gregReadable');
  const hijriReadable = document.getElementById('hijriReadable');
  const swapBtn = document.getElementById('swapBtn');
  const card = document.getElementById('converterCard');

  HIJRI_MONTHS.forEach((name, i) => {
    const opt = document.createElement('option');
    opt.value = i + 1;
    opt.textContent = name;
    hMonth.appendChild(opt);
  });

  function gToH(dateUTC){
    const parts = HIJRI_FMT.formatToParts(dateUTC);
    const get = t => +parts.find(p => p.type === t).value;
    return { y: get('year'), m: get('month'), d: get('day') };
  }

  function hToG(hy, hm, hd){
    const jd = Math.floor((11*hy + 3)/30) + 354*hy + 30*hm - Math.floor((hm-1)/2) + hd + 1948440 - 385;
    const approx = new Date((jd - 2440587.5) * 86400000);
    const base = Date.UTC(approx.getUTCFullYear(), approx.getUTCMonth(), approx.getUTCDate());
    for (let i = -4; i <= 4; i++){
      const cand = new Date(base + i * 86400000);
      const h = gToH(cand);
      if (h.y === hy && h.m === hm && h.d === hd) return cand;
    }
    return null;
  }

  function showGreg(dateUTC){
    gregInput.value = dateUTC.toISOString().slice(0, 10);
    gregReadable.textContent = GREG_FMT_AR.format(dateUTC);
  }
  function showHijri(h){
    hDay.value = h.d;
    hMonth.value = h.m;
    hYear.value = h.y;
    hijriReadable.textContent = `${h.d} ${HIJRI_MONTHS[h.m-1]} ${h.y} هـ`;
  }

  gregInput.addEventListener('change', () => {
    if (!gregInput.value) return;
    const [y, m, d] = gregInput.value.split('-').map(Number);
    const dateUTC = new Date(Date.UTC(y, m - 1, d));
    showGreg(dateUTC);
    showHijri(gToH(dateUTC));
  });

  function onHijriChange(){
    const hy = +hYear.value, hm = +hMonth.value, hd = +hDay.value;
    if (!hy || !hm || !hd || hd < 1 || hd > 30) return;
    const g = hToG(hy, hm, hd);
    if (!g){
      hijriReadable.textContent = 'تاريخ هجري غير صالح';
      gregReadable.textContent = '';
      return;
    }
    hijriReadable.textContent = `${hd} ${HIJRI_MONTHS[hm-1]} ${hy} هـ`;
    showGreg(g);
  }
  [hDay, hMonth, hYear].forEach(el => el.addEventListener('change', onHijriChange));

  swapBtn.addEventListener('click', () => card.classList.toggle('swapped'));

  const now = new Date();
  const todayUTC = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  showGreg(todayUTC);
  showHijri(gToH(todayUTC));
})();
