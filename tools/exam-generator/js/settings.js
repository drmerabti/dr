/* ================= Settings: filled once, applied automatically to every new exam ================= */

const SETTINGS_KEY = 'examgen_settings_v1';
let _settings = {};
async function loadSettings(){ try{ _settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') || {}; }catch(e){ _settings = {}; } }
function getSettings(){ return _settings; }
function saveSettings(){
  try{ localStorage.setItem(SETTINGS_KEY, JSON.stringify(_settings)); flashSaved(); }
  catch(e){ toast(L('تعذّر الحفظ (الشعار كبير جدًا؟)','Could not save (logo too big?)','Échec (logo trop grand ?)'), 'warn'); }
}
function flashSaved(){ const b = document.getElementById('setSaved'); if(!b) return; b.classList.add('show'); clearTimeout(b._t); b._t = setTimeout(() => b.classList.remove('show'), 1500); }

const LEVEL_GROUPS = [
  { n: () => L('الابتدائي','Primary','Primaire'), items: ['السنة الأولى ابتدائي','السنة الثانية ابتدائي','السنة الثالثة ابتدائي','السنة الرابعة ابتدائي','السنة الخامسة ابتدائي'] },
  { n: () => L('المتوسط','Middle school','Collège'), items: ['السنة الأولى متوسط','السنة الثانية متوسط','السنة الثالثة متوسط','السنة الرابعة متوسط'] },
  { n: () => L('الثانوي','Secondary','Lycée'), items: ['السنة الأولى ثانوي جذع مشترك علوم وتكنولوجيا','السنة الأولى ثانوي جذع مشترك آداب',
    'السنة الثانية ثانوي علوم تجريبية','السنة الثانية ثانوي رياضيات','السنة الثانية ثانوي تقني رياضي','السنة الثانية ثانوي تسيير واقتصاد','السنة الثانية ثانوي آداب وفلسفة','السنة الثانية ثانوي لغات أجنبية',
    'السنة الثالثة ثانوي علوم تجريبية','السنة الثالثة ثانوي رياضيات','السنة الثالثة ثانوي تقني رياضي','السنة الثالثة ثانوي تسيير واقتصاد','السنة الثالثة ثانوي آداب وفلسفة','السنة الثالثة ثانوي لغات أجنبية'] },
];
const SUBJECTS = ['الرياضيات','العلوم الفيزيائية والتكنولوجيا','علوم الطبيعة والحياة','اللغة العربية','اللغة الفرنسية','اللغة الإنجليزية','التاريخ والجغرافيا','التربية الإسلامية','التربية المدنية','الفلسفة','الإعلام الآلي','التكنولوجيا','التسيير المحاسبي والمالي'];

function renderSettingsView(){
  const s = _settings, v = $('settingsView');
  const levels = s.levels || [];
  const langBtns = (key, cur) => ['ar','fr','en'].map(l => `<button data-${key}="${l}" class="${cur === l ? 'on' : ''}">${{ ar:'🇩🇿 العربية', fr:'🇫🇷 Français', en:'🇬🇧 English' }[l]}</button>`).join('');
  v.innerHTML = backHomeBar() + `
  <div class="set-wrap">
    <div class="set-main">
      <div class="set-card"><div class="set-h"><span style="background:#1F6F63">🏫</span>${L('المؤسسة','School','Établissement')}</div>
        <label class="set-f">${L('اسم المؤسسة','School name','Nom de l’établissement')}<input class="big-input" data-s="institution" value="${escAttr(s.institution || '')}" placeholder="${L('مثال: متوسطة الشهيد ...','e.g. ... Middle School','ex : CEM ...')}"></label>
        <label class="set-f">${L('مديرية التربية لولاية','Education directorate (wilaya)','Direction de l’éducation (wilaya)')}<input class="big-input" data-s="directorate" value="${escAttr(s.directorate || '')}" placeholder="${L('مثال: الجزائر وسط','e.g. Algiers','ex : Alger')}"></label>
        <div class="set-f">${L('شعار المؤسسة (اختياري)','School logo (optional)','Logo (facultatif)')}
          <div class="logo-row-set">${s.logo ? `<img src="${s.logo}" class="set-logo">` : `<span class="set-logo ph">🏫</span>`}
            <button class="big-btn ghost" data-a="logo">🖼️ ${s.logo ? L('تغيير الشعار','Change logo','Changer') : L('اختيار صورة الشعار','Choose logo image','Choisir le logo')}</button>
            ${s.logo ? `<button class="big-btn ghost" data-a="nologo">🗑️ ${L('إزالة','Remove','Retirer')}</button>` : ''}</div></div>
      </div>
      <div class="set-card"><div class="set-h"><span style="background:#2563EB">👤</span>${L('الأستاذ والمادة','Teacher & subject','Enseignant et matière')}</div>
        <label class="set-f">${L('اسم الأستاذ(ة)','Teacher name','Nom de l’enseignant')}<input class="big-input" data-s="teacher" value="${escAttr(s.teacher || '')}"></label>
        <label class="set-f">${L('المادة التي أدرّسها','My subject','Ma matière')}<input class="big-input" data-s="subject" list="setSubs" value="${escAttr(s.subject || '')}"><datalist id="setSubs">${SUBJECTS.map(x => `<option value="${x}">`).join('')}</datalist></label>
        <div class="chip-pick">${SUBJECTS.slice(0, 8).map(x => `<button data-subj="${escAttr(x)}" class="${s.subject === x ? 'on' : ''}">${x}</button>`).join('')}</div>
      </div>
      <div class="set-card"><div class="set-h"><span style="background:#7C3AED">🎓</span>${L('المستويات التي أدرّسها','Levels I teach','Niveaux enseignés')}</div>
        <p class="set-note">${L('اضغط على المستويات لاختيارها. المستوى الأول المختار يُكتب تلقائيًا في الامتحانات الجديدة.','Tap levels to select them. The first one is used in new exams.','Touchez pour sélectionner. Le premier est utilisé par défaut.')}</p>
        ${LEVEL_GROUPS.map(g => `<div class="lvl-g">${g.n()}</div><div class="chip-pick">${g.items.map(x => `<button data-lvl="${escAttr(x)}" class="${levels.includes(x) ? 'on' : ''}">${levels.indexOf(x) === 0 ? '⭐ ' : ''}${x.replace('السنة ', '')}</button>`).join('')}</div>`).join('')}
      </div>
      <div class="set-card"><div class="set-h"><span style="background:#D97706">📅</span>${L('السنة الدراسية والامتحان','School year & exam','Année et examen')}</div>
        <div class="set-grid">
          <label class="set-f">${L('السنة الدراسية','School year','Année scolaire')}<input class="big-input" data-s="year" value="${escAttr(s.year || defaultSchoolYear())}" dir="ltr"></label>
          <label class="set-f">${L('المدة المعتادة','Usual duration','Durée habituelle')}<input class="big-input" data-s="duration" list="setDur" value="${escAttr(s.duration || '')}"><datalist id="setDur"><option value="ساعة واحدة"><option value="ساعة ونصف"><option value="ساعتان"><option value="ثلاث ساعات"></datalist></label>
          <label class="set-f">${L('العلامة الكاملة','Full mark','Note maximale')}<select class="big-input" data-s="maxPoints"><option value="20" ${(s.maxPoints || 20) == 20 ? 'selected' : ''}>20</option><option value="10" ${s.maxPoints == 10 ? 'selected' : ''}>10</option><option value="40" ${s.maxPoints == 40 ? 'selected' : ''}>40</option></select></label>
        </div>
      </div>
      <div class="set-card"><div class="set-h"><span style="background:#0891B2">🌐</span>${L('اللغة وحجم الخط','Language & font size','Langue et taille')}</div>
        <div class="set-f">${L('لغة الواجهة','Interface language','Langue de l’interface')}<div class="seg-big">${langBtns('ui', lang)}</div></div>
        <div class="set-f">${L('لغة الامتحانات الجديدة','Language of new exams','Langue des nouveaux examens')}<div class="seg-big">${langBtns('el', s.examLang || 'ar')}</div></div>
        <div class="set-f">${L('حجم الخط في ورقة الامتحان','Font size on the exam paper','Taille du texte')}<div class="seg-big">${['sm','md','lg'].map(f => `<button data-fs="${f}" class="${(s.fontSize || 'md') === f ? 'on' : ''}"><span style="font-size:${{ sm: 13, md: 16, lg: 20 }[f]}px">${{ sm: L('صغير','Small','Petit'), md: L('متوسط','Medium','Moyen'), lg: L('كبير','Large','Grand') }[f]}</span></button>`).join('')}</div></div>
      </div>
      <div class="set-card"><div class="set-h"><span style="background:#E08E3E">🎨</span>${L('الترويسة المفضلة','Preferred header','En-tête préféré')}</div>
        <div class="tpl-grid" id="setHeaders"></div>
        <div class="set-h" style="margin-top:16px"><span style="background:#DB2777">🖌️</span>${L('التصميم المفضل','Preferred design','Style préféré')}</div>
        <div class="tpl-grid" id="setStyles"></div>
      </div>
    </div>
    <aside class="set-side">
      <div class="set-preview-card">
        <div class="set-h">👁️ ${L('هكذا ستبدو امتحاناتك الجديدة','Your new exams will look like this','Aperçu de vos nouveaux examens')}</div>
        <div class="set-preview"><div class="thumb-inner" id="setPrev"></div></div>
        <span id="setSaved" class="set-saved">✓ ${L('تم الحفظ تلقائيًا','Saved automatically','Enregistré')}</span>
        <button class="big-btn primary" data-a="newexam" style="width:100%;justify-content:center;margin-top:10px">📝 ${L('أنشئ امتحانًا جديدًا الآن','Create a new exam now','Créer un examen')}</button>
      </div>
    </aside>
  </div>`;
  const refreshPreview = () => {
    const ex = freshExam();
    ex.questions = sampleExamForThumb().questions;
    const prevLang = lang; lang = ex.lang || lang;
    const html = staticPageHTML(ex);
    lang = prevLang;
    v.querySelector('#setPrev').innerHTML = html;
    const sample = Object.assign(freshExam(), { questions: sampleExamForThumb().questions });
    v.querySelector('#setHeaders').innerHTML = HEADER_TPLS.map(tp => tplThumbCard(Object.assign({}, sample, { tpl: Object.assign({}, sample.tpl, { header: tp.id }) }), tp.name(), (s.headerTpl || 'classic') === tp.id, `data-ht="${tp.id}"`, true)).join('');
    v.querySelector('#setStyles').innerHTML = STYLE_TPLS.map(st => tplThumbCard(Object.assign({}, sample, { tpl: Object.assign({}, sample.tpl, { style: st.id }) }), st.name(), (s.styleTpl || 'classic') === st.id, `data-stl="${st.id}"`, false)).join('');
    v.querySelectorAll('[data-ht]').forEach(c => c.onclick = () => { s.headerTpl = c.dataset.ht; saveSettings(); refreshPreview(); });
    v.querySelectorAll('[data-stl]').forEach(c => c.onclick = () => { s.styleTpl = c.dataset.stl; saveSettings(); refreshPreview(); });
  };
  v.querySelectorAll('[data-s]').forEach(i => i.addEventListener(i.tagName === 'SELECT' ? 'change' : 'input', () => {
    s[i.dataset.s] = i.dataset.s === 'maxPoints' ? +i.value : i.value; saveSettings(); refreshPreview();
    if(i.dataset.s === 'subject') v.querySelectorAll('[data-subj]').forEach(b => b.classList.toggle('on', b.dataset.subj === i.value));
  }));
  v.querySelectorAll('[data-subj]').forEach(b => b.onclick = () => { s.subject = b.dataset.subj; saveSettings(); renderSettingsView(); });
  v.querySelectorAll('[data-lvl]').forEach(b => b.onclick = () => {
    const x = b.dataset.lvl; s.levels = s.levels || [];
    if(s.levels.includes(x)) s.levels = s.levels.filter(y => y !== x); else s.levels.push(x);
    saveSettings(); renderSettingsView();
  });
  v.querySelectorAll('[data-ui]').forEach(b => b.onclick = () => { lang = b.dataset.ui; s.lang = lang; saveSettings(); applyLanguage(); renderSettingsView(); updateHero(); });
  v.querySelectorAll('[data-el]').forEach(b => b.onclick = () => { s.examLang = b.dataset.el; saveSettings(); renderSettingsView(); });
  v.querySelectorAll('[data-fs]').forEach(b => b.onclick = () => { s.fontSize = b.dataset.fs; saveSettings(); renderSettingsView(); });
  v.querySelector('[data-a="logo"]').onclick = () => pickLogo(src => { s.logo = src; if(!s.headerTpl || s.headerTpl === 'classic') s.headerTpl = 'logo'; saveSettings(); renderSettingsView(); });
  const nl = v.querySelector('[data-a="nologo"]'); if(nl) nl.onclick = () => { delete s.logo; saveSettings(); renderSettingsView(); };
  v.querySelector('[data-a="newexam"]').onclick = startNewExam;
  refreshPreview();
}
