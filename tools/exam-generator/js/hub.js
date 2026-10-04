/* ================= Home hub wiring: My tools, Library, Settings, Templates ================= */

const TOOL_TILES = [
  { kind:'eq', icon:'∑', color:'#2563EB', name:()=>L('المعادلات','Equations','Équations'), desc:()=>L('كسور، جذور، تكامل، أنظمة، كيمياء ووحدات — بالأزرار','Fractions, roots, integrals, systems, chemistry — with buttons','Fractions, racines, intégrales, chimie — avec des boutons') },
  { kind:'plot', icon:'📈', color:'#059669', name:()=>L('المنحنيات','Curves','Courbes'), desc:()=>L('ارسم دالة بكتابتها، أو من جدول قيم، أو أعمدة بيانية','Plot a function, a table of values, or a bar chart','Tracez une fonction, un tableau de valeurs ou un diagramme') },
  { kind:'draw', icon:'📐', color:'#D97706', name:()=>L('الرسومات','Drawings','Dessins'), desc:()=>L('هندسة، دارات كهربائية، أدوات مخبرية وأشكال جاهزة','Geometry, circuits, lab equipment and ready shapes','Géométrie, circuits, matériel de labo') },
  { kind:'table', icon:'▦', color:'#7C3AED', name:()=>L('الجداول','Tables','Tableaux'), desc:()=>L('جدول عادي، جدول قيم، جدول تغيرات، جدول يملؤه التلميذ','Regular, values, variations, student table','Tableau simple, de valeurs, de variations') },
];

function openToolsHub(){
  const m = openModal({ size:'medium', icon:'🧰', color:'#8B5CF6', title:L('أدواتي','My tools','Mes outils'),
    body:`<p class="hub-note">${L('أنشئ ما تريد هنا، وسيُحفظ تلقائيًا في <b>مكتبتي</b> لتدرجه لاحقًا في أي امتحان.','Create anything here — it is saved automatically to <b>My library</b> to insert into any exam later.','Créez ici : tout est enregistré dans <b>Ma bibliothèque</b>.')}</p>
      <div class="tool-tiles">${TOOL_TILES.map(tl => `
        <button class="tool-tile" data-k="${tl.kind}" style="--c:${tl.color}">
          <span class="tt-ic">${tl.icon}</span><span class="tt-name">${tl.name()}</span><span class="tt-desc">${tl.desc()}</span>
        </button>`).join('')}</div>`,
    footer:`<button class="big-btn ghost" data-close>${L('إغلاق','Close','Fermer')}</button><button class="big-btn primary" id="hubToLib">📚 ${L('افتح مكتبتي','Open my library','Ouvrir la bibliothèque')}</button>` });
  m.body.querySelectorAll('.tool-tile').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.k;
    if(!ObjKinds[k]){ toast(L('هذه الأداة قيد الإنجاز','Coming soon','Bientôt'), 'warn'); return; }
    m.close();
    ObjKinds[k].edit(null, obj => {
      obj.kind = obj.kind || k;
      if(typeof libraryAutoSave === 'function') libraryAutoSave(obj, true);
    }, { mode:'library' });
  }));
  m.foot.querySelector('#hubToLib').onclick = () => { m.close(); goLibrary(); };
}
function goLibrary(){ if(typeof renderLibraryView === 'function'){ showView('libraryView'); renderLibraryView(); } else toast(L('قيد الإنجاز','Coming soon','Bientôt'), 'warn'); }
function goSettings(){ if(typeof renderSettingsView === 'function'){ showView('settingsView'); renderSettingsView(); } else toast(L('قيد الإنجاز','Coming soon','Bientôt'), 'warn'); }
function goTemplates(){ if(typeof renderTemplatesView === 'function'){ showView('templatesView'); renderTemplatesView(); } else toast(L('قيد الإنجاز','Coming soon','Bientôt'), 'warn'); }

$('goTools').addEventListener('click', openToolsHub);
$('goLibrary').addEventListener('click', goLibrary);
$('goSettings').addEventListener('click', goSettings);
$('goTemplates').addEventListener('click', goTemplates);
$('designBtn').addEventListener('click', openDesignPicker);
$('libBtn').addEventListener('click', () => {
  if(typeof openLibraryPicker === 'function') openLibraryPicker();
  else toast(L('قيد الإنجاز','Coming soon','Bientôt'), 'warn');
});

/* Back-to-home button used by the secondary views */
function backHomeBar(){
  return `<div class="view-bar"><button class="btn btn-ghost btn-back" data-home>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M15 18l-6-6 6-6"/></svg>
    <span>${L('الصفحة الرئيسية للأداة','Tool home','Accueil de l’outil')}</span></button></div>`;
}
document.addEventListener('click', e => { if(e.target.closest('[data-home]')) showList(); });
