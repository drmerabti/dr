/* ============ تسيير الميزانية الشهرية — أظرف + SVG + تسجيل دخول ============ */
(function(){
  const $ = id => document.getElementById(id);
  let lang = 'ar', uid = null, S = null, mk = new Date().toISOString().slice(0, 7);

  const T = {
    ar: { dir:'rtl', locale:'fr-DZ', title:'تسيير الميزانية الشهرية',
      gate_t:'هذه الأداة تتطلب تسجيل الدخول', gate_p:'سجّل دخولك من الزر أعلى الصفحة حتى تُحفظ ميزانيتك في حسابك.',
      income:'دخل الشهر', currency:'العملة', dist:'✨ وزّع لي (50/30/20)',
      st_inc:'الدخل', st_exp:'المصروف', st_rem:'المتبقي', st_day:'المتاح لك يومياً',
      q_add:'+ أضف', ph_amt:'المبلغ', ph_note:'ملاحظة (اختياري)', ph_name:'الاسم',
      env_t:'الأظرف', env_add:'+ ظرف جديد', env_prompt:'اسم الظرف الجديد:',
      env_has_exp:'لا يمكن حذف ظرف فيه مصاريف هذا الشهر.', budget:'الميزانية:',
      donut_t:'أين تذهب أموالك؟', spent:'مصروف', of:'من',
      rec_t:'مصاريف ثابتة (تُضاف تلقائياً كل شهر)', log_t:'سجل مصاريف الشهر',
      log_empty:'لا مصاريف بعد هذا الشهر 🎉', cheer_ok:'👏 أحسنت! لا تزال ضمن الميزانية',
      cheer_save:p=>`💰 ادخرت ${p}% من دخلك هذا الشهر`,
      env_food:'غذاء', env_home:'سكن / كراء', env_bills:'فواتير', env_transport:'نقل',
      env_health:'صحة', env_edu:'تعليم', env_fun:'ترفيه', env_save:'ادخار' },
    fr: { dir:'ltr', locale:'fr-FR', title:'Budget mensuel du foyer',
      gate_t:'Cet outil nécessite une connexion', gate_p:'Connectez-vous via le bouton en haut pour sauvegarder votre budget.',
      income:'Revenu du mois', currency:'Devise', dist:'✨ Répartir (50/30/20)',
      st_inc:'Revenu', st_exp:'Dépensé', st_rem:'Restant', st_day:'Disponible par jour',
      q_add:'+ Ajouter', ph_amt:'Montant', ph_note:'Note (optionnel)', ph_name:'Nom',
      env_t:'Enveloppes', env_add:'+ Nouvelle enveloppe', env_prompt:'Nom de la nouvelle enveloppe :',
      env_has_exp:'Impossible de supprimer une enveloppe avec des dépenses ce mois.', budget:'Budget :',
      donut_t:'Où va votre argent ?', spent:'dépensé', of:'sur',
      rec_t:'Dépenses fixes (ajoutées chaque mois)', log_t:'Journal des dépenses',
      log_empty:'Aucune dépense ce mois 🎉', cheer_ok:'👏 Bravo ! Vous êtes dans le budget',
      cheer_save:p=>`💰 Vous avez épargné ${p}% de votre revenu`,
      env_food:'Alimentation', env_home:'Logement / Loyer', env_bills:'Factures', env_transport:'Transport',
      env_health:'Santé', env_edu:'Éducation', env_fun:'Loisirs', env_save:'Épargne' },
    en: { dir:'ltr', locale:'en-US', title:'Monthly Home Budget',
      gate_t:'This tool requires login', gate_p:'Sign in using the button at the top to save your budget to your account.',
      income:'Monthly Income', currency:'Currency', dist:'✨ Auto-split (50/30/20)',
      st_inc:'Income', st_exp:'Spent', st_rem:'Remaining', st_day:'Available per day',
      q_add:'+ Add', ph_amt:'Amount', ph_note:'Note (optional)', ph_name:'Name',
      env_t:'Envelopes', env_add:'+ New envelope', env_prompt:'New envelope name:',
      env_has_exp:'Cannot delete an envelope with expenses this month.', budget:'Budget:',
      donut_t:'Where does your money go?', spent:'spent', of:'of',
      rec_t:'Fixed expenses (added every month)', log_t:'Expense log',
      log_empty:'No expenses yet this month 🎉', cheer_ok:'👏 Well done! You are within budget',
      cheer_save:p=>`💰 You saved ${p}% of your income`,
      env_food:'Food', env_home:'Housing / Rent', env_bills:'Bills', env_transport:'Transport',
      env_health:'Health', env_edu:'Education', env_fun:'Fun', env_save:'Savings' },
  };

  const DEF = [
    { k:'food', icon:'🍞', color:'#E8A33D', pct:18 },
    { k:'home', icon:'🏠', color:'#5B8DEF', pct:15 },
    { k:'bills', icon:'💡', color:'#F2C94C', pct:7 },
    { k:'transport', icon:'🚗', color:'#56CCF2', pct:5 },
    { k:'health', icon:'💊', color:'#EB5757', pct:5 },
    { k:'edu', icon:'📚', color:'#9B51E0', pct:15 },
    { k:'fun', icon:'🎉', color:'#F2994A', pct:15 },
    { k:'save', icon:'💰', color:'#27AE60', pct:20 },
  ];
  const CUSTOM_COLORS = ['#B15C86','#3A5A7D','#1A8A72','#C0561E','#7A3FA8','#2F5CA8'];

  const t = () => T[lang];
  const fmt = n => new Intl.NumberFormat(t().locale, {maximumFractionDigits: 0}).format(n) + ($('curInput').value.trim() ? ' ' + $('curInput').value.trim() : '');
  const envName = e => e.name || t()['env_' + e.k] || e.k;

  /* ---------- حفظ / تحميل ---------- */
  const key = () => 'budget_v1_' + uid;
  function save(){ try { localStorage.setItem(key(), JSON.stringify(S)); } catch(e){} }
  function load(){
    try { S = JSON.parse(localStorage.getItem(key())); } catch(e){ S = null; }
    if (!S) S = { lang: 'ar', cur: 'دج', months: {}, rec: [] };
  }

  function ensureMonth(m){
    if (S.months[m]) return;
    const prev = Object.keys(S.months).sort().filter(x => x < m).pop();
    const envs = prev
      ? S.months[prev].envs.map(e => ({...e}))
      : DEF.map(d => ({ k: d.k, icon: d.icon, color: d.color, budget: 0 }));
    const exps = S.rec.map((r, i) => ({
      id: 'rec' + Date.now() + i, k: r.k, amt: r.amt, note: r.name, d: m + '-01', rec: true
    }));
    S.months[m] = { income: prev ? S.months[prev].income : 0, envs, exps };
  }
  const M = () => S.months[mk];

  /* ---------- العرض ---------- */
  function render(){
    ensureMonth(mk);
    const m = M(), tr = t();
    $('monthInput').value = mk;
    $('incomeInput').value = m.income || '';
    $('curInput').value = S.cur;

    const spentBy = {};
    m.exps.forEach(e => spentBy[e.k] = (spentBy[e.k] || 0) + e.amt);
    const totalSpent = m.exps.reduce((s, e) => s + e.amt, 0);
    const rem = (m.income || 0) - totalSpent;

    /* البطاقات */
    $('statInc').textContent = fmt(m.income || 0);
    $('statExp').textContent = fmt(totalSpent);
    $('statRem').textContent = fmt(rem);
    $('statRem').style.color = rem < 0 ? '#C0392B' : '';
    const now = new Date(), isCur = mk === now.toISOString().slice(0, 7);
    const daysLeft = isCur ? Math.max(new Date(now.getFullYear(), now.getMonth()+1, 0).getDate() - now.getDate() + 1, 1) : 1;
    $('statDaily').textContent = fmt(Math.max(rem, 0) / daysLeft);

    /* قوائم الاختيار */
    const opts = m.envs.map(e => `<option value="${e.k}">${e.icon} ${envName(e)}</option>`).join('');
    $('qEnv').innerHTML = opts; $('recEnv').innerHTML = opts;

    /* الأظرف */
    $('envGrid').innerHTML = '';
    m.envs.forEach(e => {
      const spent = spentBy[e.k] || 0;
      const pct = e.budget > 0 ? Math.min(spent / e.budget * 100, 100) : 0;
      const over = e.budget > 0 && spent > e.budget;
      const barColor = over ? '#C0392B' : pct >= 70 ? '#E8A33D' : '#27AE60';
      const card = document.createElement('div');
      card.className = 'env-card' + (over ? ' over' : '');
      card.innerHTML = `
        <div class="env-head">
          <span class="env-icon">${e.icon}</span>
          <span class="env-name">${envName(e)}</span>
          <button type="button" class="env-del">×</button>
        </div>
        <div class="env-budget">${tr.budget} <input type="number" min="0" value="${e.budget || ''}" placeholder="0"></div>
        <div class="env-bar"><div class="env-fill" style="width:${pct}%;background:${barColor}"></div></div>
        <div class="env-nums"><span>${fmt(spent)} ${tr.spent}</span><span>${tr.of} ${fmt(e.budget || 0)}</span></div>`;
      card.querySelector('input').addEventListener('change', ev => {
        e.budget = +ev.target.value || 0; save(); render();
      });
      card.querySelector('.env-del').addEventListener('click', () => {
        if (m.exps.some(x => x.k === e.k)){ alert(tr.env_has_exp); return; }
        m.envs = m.envs.filter(x => x !== e); save(); render();
      });
      $('envGrid').appendChild(card);
    });

    /* الدائرة SVG */
    const svg = $('donutSvg');
    svg.innerHTML = `<circle cx="21" cy="21" r="15.915" fill="none" stroke="var(--line)" stroke-width="5"></circle>`;
    let offset = 0;
    if (totalSpent > 0){
      m.envs.forEach(e => {
        const v = spentBy[e.k] || 0;
        if (!v) return;
        const p = v / totalSpent * 100;
        svg.innerHTML += `<circle cx="21" cy="21" r="15.915" fill="none" stroke="${e.color}"
          stroke-width="5" stroke-dasharray="${p} ${100 - p}" stroke-dashoffset="${-offset}"
          stroke-linecap="butt"></circle>`;
        offset += p;
      });
    }
    $('donutCenter').innerHTML = `<span>${fmt(totalSpent)}</span>`;
    $('legend').innerHTML = m.envs.filter(e => spentBy[e.k]).map(e =>
      `<span><i style="background:${e.color}"></i>${envName(e)} ${Math.round((spentBy[e.k]) / totalSpent * 100)}%</span>`).join('');

    /* رسالة تشجيع */
    const saveSpent = spentBy['save'] || 0;
    $('cheerMsg').textContent =
      m.income > 0 && saveSpent > 0 ? tr.cheer_save(Math.round(saveSpent / m.income * 100)) :
      m.income > 0 && rem >= 0 && totalSpent > 0 ? tr.cheer_ok : '';

    /* الثابتة */
    $('recList').innerHTML = S.rec.map((r, i) => {
      const env = m.envs.find(e => e.k === r.k);
      return `<div class="rec-row"><span>${env ? env.icon : '📦'}</span>
        <span class="r-name">${r.name}</span><span class="r-amt">${fmt(r.amt)}</span>
        <button type="button" data-i="${i}">×</button></div>`;
    }).join('');
    $('recList').querySelectorAll('button').forEach(b =>
      b.addEventListener('click', () => { S.rec.splice(+b.dataset.i, 1); save(); render(); }));

    /* السجل */
    if (!m.exps.length){
      $('logList').innerHTML = `<div class="log-empty">${tr.log_empty}</div>`;
    } else {
      $('logList').innerHTML = [...m.exps].reverse().map(x => {
        const env = m.envs.find(e => e.k === x.k);
        return `<div class="log-row"><span class="l-icon">${env ? env.icon : '📦'}</span>
          <span class="l-note">${x.note || (env ? envName(env) : '')}${x.rec ? ' 🔁' : ''}</span>
          <span class="l-date">${x.d}</span><span class="l-amt">${fmt(x.amt)}</span>
          <button type="button" data-id="${x.id}">×</button></div>`;
      }).join('');
      $('logList').querySelectorAll('button').forEach(b =>
        b.addEventListener('click', () => {
          m.exps = m.exps.filter(x => x.id !== b.dataset.id); save(); render();
        }));
    }
  }

  /* ---------- اللغة ---------- */
  function setLang(l){
    lang = l; S && (S.lang = l);
    document.documentElement.setAttribute('dir', t().dir);
    document.documentElement.setAttribute('lang', l);
    document.querySelectorAll('[data-k]').forEach(el => {
      const v = t()[el.dataset.k];
      if (typeof v === 'string') el.textContent = v;
    });
    document.querySelectorAll('[data-ph]').forEach(el => el.placeholder = t()[el.dataset.ph] || '');
    document.querySelectorAll('.lang-bar button').forEach(b =>
      b.classList.toggle('active', b.dataset.lang === l));
    if (S){ save(); render(); }
  }

  /* ---------- الأحداث ---------- */
  function initEvents(){
    $('monthInput').addEventListener('change', () => { if ($('monthInput').value){ mk = $('monthInput').value; render(); } });
    $('prevM').addEventListener('click', () => shiftMonth(-1));
    $('nextM').addEventListener('click', () => shiftMonth(1));
    function shiftMonth(d){
      const [y, m] = mk.split('-').map(Number);
      const nd = new Date(y, m - 1 + d, 1);
      mk = nd.toISOString().slice(0, 7); render();
    }
    $('incomeInput').addEventListener('change', () => { M().income = +$('incomeInput').value || 0; save(); render(); });
    $('curInput').addEventListener('change', () => { S.cur = $('curInput').value; save(); render(); });
    $('distBtn').addEventListener('click', () => {
      const inc = M().income || 0;
      if (!inc) return;
      M().envs.forEach(e => {
        const d = DEF.find(x => x.k === e.k);
        e.budget = d ? Math.round(inc * d.pct / 100) : e.budget;
      });
      save(); render();
    });
    $('qAdd').addEventListener('click', () => {
      const amt = +$('qAmt').value || 0;
      if (!amt) return;
      M().exps.push({ id: 'e' + Date.now(), k: $('qEnv').value, amt, note: $('qNote').value.trim(), d: new Date().toISOString().slice(0, 10) });
      $('qAmt').value = ''; $('qNote').value = '';
      save(); render();
    });
    $('addEnvBtn').addEventListener('click', () => {
      const name = prompt(t().env_prompt);
      if (!name || !name.trim()) return;
      M().envs.push({ k: 'c' + Date.now(), name: name.trim(), icon: '📦',
        color: CUSTOM_COLORS[M().envs.length % CUSTOM_COLORS.length], budget: 0 });
      save(); render();
    });
    $('recAdd').addEventListener('click', () => {
      const name = $('recName').value.trim(), amt = +$('recAmt').value || 0;
      if (!name || !amt) return;
      S.rec.push({ name, amt, k: $('recEnv').value });
      M().exps.push({ id: 'e' + Date.now(), k: $('recEnv').value, amt, note: name, d: new Date().toISOString().slice(0, 10), rec: true });
      $('recName').value = ''; $('recAmt').value = '';
      save(); render();
    });
    document.querySelectorAll('.lang-bar button').forEach(b =>
      b.addEventListener('click', () => setLang(b.dataset.lang)));
  }

  /* ---------- قفل الدخول ---------- */
  let started = false;
  function start(user){
    uid = user.uid || user.email || 'user';
    $('loginGate').classList.add('hidden');
    $('budgetApp').classList.remove('hidden');
    load();
    if (!started){ initEvents(); started = true; }
    setLang(S.lang || 'ar');
  }
  function stop(){
    $('loginGate').classList.remove('hidden');
    $('budgetApp').classList.add('hidden');
  }

  if (window.fbAuth){
    window.fbAuth.onAuthStateChanged(u => u ? start({ uid: u.uid, email: u.email }) : stop());
  } else {
    try {
      const u = JSON.parse(localStorage.getItem('site_user'));
      u ? start(u) : stop();
    } catch(e){ stop(); }
  }
  setLang('ar');
})();
