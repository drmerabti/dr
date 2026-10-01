/* ================= Drawing tool (geometry + science) built on Fabric.js =================
   Named points drive dependent objects (segments, lines, circles, polygons, angles, equal marks,
   measures): move a point and everything attached follows. Ready shapes come from shapes.js. */

const DRAW_W = 780, DRAW_H = 520, GRID = 30;
const DRAW_COLORS = ['#111827', '#DC2626', '#1D4ED8', '#059669', '#D97706', '#7C3AED', '#DB2777', '#6B7280'];
const DRAW_PROPS = ['egType', 'egId', 'deps', 'egOpts', 'name', 'dx', 'dy', 'owner', 'egShape', 'selectable', 'hasControls', 'hasBorders',
  'lockMovementX', 'lockMovementY', 'lockRotation', 'lockScalingX', 'lockScalingY', 'hoverCursor', 'perPixelTargetFind', 'padding', 'evented', 'visible', 'direction'];
const DERIVED = new Set(['segment', 'line', 'ray', 'circle', 'polygon', 'angle', 'tick', 'measure']);

registerKind('draw', {
  label: () => L('رسم','Drawing','Dessin'), icon: '📐', color: '#D97706',
  render: (obj) => `<span class="g-box">${obj.svg || ''}</span>`,
  edit: openDrawEditor,
});

const DRAW_TOOLS = [
  { m:'select', ic:'🖐️', n:()=>L('تحديد وتحريك','Select & move','Sélection') },
  { m:'point', ic:'•', n:()=>L('نقطة','Point','Point') },
  { m:'segment', ic:'⟋', n:()=>L('قطعة [AB]','Segment [AB]','Segment [AB]') },
  { m:'line', ic:'↔', n:()=>L('مستقيم (AB)','Line (AB)','Droite (AB)') },
  { m:'ray', ic:'↦', n:()=>L('نصف مستقيم','Ray [AB)','Demi-droite') },
  { m:'circle', ic:'◯', n:()=>L('دائرة','Circle','Cercle') },
  { m:'polygon', ic:'⬠', n:()=>L('مضلع','Polygon','Polygone') },
  { m:'angle', ic:'∠', n:()=>L('زاوية وقيسها','Angle & measure','Angle et mesure') },
  { m:'right', ic:'⦜', n:()=>L('علامة التعامد','Right-angle mark','Angle droit') },
  { m:'tick', ic:'⫽', n:()=>L('علامة التساوي','Equal marks','Codage égalité') },
  { m:'measure', ic:'⟷', n:()=>L('قياس طول','Length measure','Cotation') },
  { m:'arrow', ic:'➝', n:()=>L('سهم / شعاع','Arrow / vector','Flèche / vecteur') },
  { m:'text', ic:'T', n:()=>L('نص','Text','Texte') },
  { m:'rect', ic:'▭', n:()=>L('مستطيل حر','Rectangle','Rectangle') },
  { m:'ellipse', ic:'⬭', n:()=>L('شكل بيضوي','Ellipse','Ellipse') },
  { m:'free', ic:'✎', n:()=>L('رسم حر بالقلم','Free pen','Crayon') },
  { m:'eraser', ic:'⌫', n:()=>L('ممحاة','Eraser','Gomme') },
];
const TOOL_HELP = {
  select: () => L('اضغط على أي شكل لتحديده. اسحب النقاط لتحريكها، أو اسحب مربعًا حول عدة أشكال لتحريكها وتدويرها معًا.','Click a shape to select it. Drag points to move them, or drag a box around several shapes to move/rotate them together.','Cliquez sur une forme pour la sélectionner.'),
  point: () => L('اضغط في أي مكان لوضع نقطة. يُعطى لها اسم تلقائيًا (A، B، C...) ويمكنك تغييره.','Click anywhere to place a point (named A, B, C… automatically).','Cliquez pour placer un point.'),
  segment: () => L('اضغط على نقطتين: البداية ثم النهاية.','Click two points: start then end.','Cliquez sur deux points.'),
  line: () => L('اضغط على نقطتين يمر بهما المستقيم.','Click two points on the line.','Cliquez sur deux points de la droite.'),
  ray: () => L('اضغط على المبدأ ثم على نقطة ثانية.','Click the origin then a second point.','Cliquez sur l’origine puis un point.'),
  circle: () => L('اضغط على المركز ثم على نقطة من الدائرة.','Click the centre, then a point on the circle.','Cliquez le centre puis un point du cercle.'),
  polygon: () => L('اضغط على الرؤوس واحدًا بعد الآخر، ثم اضغط على الرأس الأول لإغلاق المضلع.','Click the vertices one by one, then click the first one to close.','Cliquez les sommets puis le premier pour fermer.'),
  angle: () => L('اضغط على 3 نقاط: نقطة من الضلع الأول، ثم الرأس، ثم نقطة من الضلع الثاني.','Click 3 points: one side, the vertex, the other side.','Cliquez 3 points : côté, sommet, côté.'),
  right: () => L('اضغط على 3 نقاط: نقطة، ثم رأس الزاوية القائمة، ثم نقطة.','Click 3 points: point, right-angle vertex, point.','Cliquez 3 points : point, sommet, point.'),
  tick: () => L('اضغط على قطعة لإضافة علامة تساوٍ (اضغط مرة أخرى لعلامتين أو ثلاث).','Click a segment to add an equal mark (click again for 2 or 3).','Cliquez un segment pour le coder.'),
  measure: () => L('اضغط على نقطتين لكتابة الطول بينهما.','Click two points to show their length.','Cliquez deux points pour la cotation.'),
  arrow: () => L('اسحب من البداية إلى النهاية لرسم سهم (شعاع قوة مثلًا).','Drag from start to end to draw an arrow.','Glissez pour tracer une flèche.'),
  text: () => L('اضغط في المكان المطلوب ثم اكتب.','Click where you want the text, then type.','Cliquez puis écrivez.'),
  rect: () => L('اسحب لرسم مستطيل.','Drag to draw a rectangle.','Glissez pour un rectangle.'),
  ellipse: () => L('اسحب لرسم شكل بيضوي.','Drag to draw an ellipse.','Glissez pour une ellipse.'),
  free: () => L('ارسم بالفأرة بحرية.','Draw freely with the mouse.','Dessinez librement.'),
  eraser: () => L('اضغط على أي شكل لحذفه.','Click any shape to delete it.','Cliquez une forme pour la supprimer.'),
};

function openDrawEditor(obj, done, opts){
  opts = opts || {};
  const editing = !!(obj && obj.svg);
  const startData = (obj && obj.data) || {};
  const st = {
    mode: 'select', color: startData.color || '#111827', width: startData.width || 2, dash: false,
    grid: startData.grid || 'squares', snap: startData.snap !== false, printGrid: !!startData.printGrid,
    pending: [], hist: [], hi: -1, restoring: false, libCat: 'geo', side: 'lib'
  };
  const m = openModal({
    icon: '📐', color: '#D97706', title: L('أداة الرسومات','Drawing tool','Outil dessin'), cls: 'draw-modal',
    footer: `<button class="big-btn ghost" data-close>${L('إلغاء','Cancel','Annuler')}</button>
      <button class="big-btn primary" data-save>${opts.mode === 'library' ? '📚 ' + L('حفظ في مكتبتي','Save to my library','Enregistrer') : editing ? '✔ ' + L('حفظ التعديل','Save changes','Enregistrer') : '⬇ ' + L('إدراج في الامتحان','Insert into the exam','Insérer dans l’examen')}</button>`,
    body: `<div class="draw-layout">
      <aside class="draw-tools">${DRAW_TOOLS.map(t => `<button class="dt-btn" data-mode="${t.m}" title="${escAttr(t.n())}"><span class="dt-ic">${t.ic}</span><span class="dt-n">${t.n()}</span></button>`).join('')}</aside>
      <section class="draw-center">
        <div class="draw-top">
          <button class="mini-btn" data-a="undo" title="Ctrl+Z">↶ ${L('تراجع','Undo','Annuler')}</button>
          <button class="mini-btn" data-a="redo" title="Ctrl+Y">↷ ${L('إعادة','Redo','Rétablir')}</button>
          <button class="mini-btn" data-a="del">🗑️ ${L('حذف المحدد','Delete selected','Supprimer')}</button>
          <button class="mini-btn" data-a="clear">🧹 ${L('مسح الكل','Clear all','Tout effacer')}</button>
          <span class="grow"></span>
          <span class="seg" style="--accent:#D97706">
            <span>${L('الشبكة','Grid','Grille')}</span>
            <button data-grid="none">${L('بدون','None','Aucune')}</button>
            <button data-grid="squares">${L('مربعات','Squares','Carreaux')}</button>
            <button data-grid="dots">${L('نقاط','Dots','Points')}</button>
          </span>
          <label class="mini-check"><input type="checkbox" data-a="snap"> 🧲 ${L('التثبيت على الشبكة','Snap to grid','Magnétisme')}</label>
          <label class="mini-check"><input type="checkbox" data-a="printGrid"> 🖨️ ${L('طباعة الشبكة','Print the grid','Imprimer la grille')}</label>
        </div>
        <div class="draw-help"></div>
        <div class="draw-stage-wrap"><div class="draw-stage"><canvas id="drawCanvas" width="${DRAW_W}" height="${DRAW_H}"></canvas></div></div>
      </section>
      <aside class="draw-side">
        <div class="side-tabs"><button data-side="lib">🧩 ${L('أشكال جاهزة','Ready shapes','Formes prêtes')}</button><button data-side="props">🎨 ${L('الألوان والخصائص','Colours & properties','Couleurs et propriétés')}</button></div>
        <div class="side-body"></div>
      </aside>
    </div>`
  });
  const stop = showLoading(m.body, L('جارٍ تحضير أداة الرسم...','Preparing the drawing tool...','Préparation...'));
  let cv = null;
  const helpEl = m.body.querySelector('.draw-help');
  const stage = m.body.querySelector('.draw-stage');
  const side = m.body.querySelector('.side-body');

  loadFabric().then(() => {
    stop();
    cv = new fabric.Canvas(m.body.querySelector('#drawCanvas'), { preserveObjectStacking: true, selection: true, targetFindTolerance: 6, fireRightClick: false });
    window.__drawCanvas = cv;
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = '#D97706';
    fabric.Object.prototype.cornerStyle = 'circle';
    fabric.Object.prototype.borderColor = '#D97706';
    fabric.Object.prototype.cornerSize = 11;
    const ready = () => { bindCanvas(); setMode('select'); drawSide(); syncTop(); commit(true); };
    if(startData.json){
      st.restoring = true;
      cv.loadFromJSON(startData.json, () => { st.restoring = false; cv.renderAll(); ready(); });
    } else ready();
  }).catch(e => { stop(); helpEl.textContent = e.message; });

  /* ---------- helpers ---------- */
  const objs = () => cv.getObjects();
  const byId = id => objs().find(o => o.egId === id);
  const pt = o => ({ x: o.left, y: o.top });
  const snapV = v => st.snap && st.grid !== 'none' ? Math.round(v / GRID) * GRID : v;
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const isArabic = s => /[؀-ۿ]/.test(s || '');
  function nextName(){
    const used = new Set(objs().filter(o => o.egType === 'point').map(o => o.name));
    for(let k = 0; k < 6; k++) for(let i = 0; i < 26; i++){ const n = String.fromCharCode(65 + i) + (k ? k : ''); if(!used.has(n)) return n; }
    return 'P';
  }
  function labelOf(p){ return objs().find(o => o.egType === 'label' && o.owner === p.egId); }
  function nearestPoint(p, tol){
    let best = null, bd = tol || 12;
    objs().forEach(o => { if(o.egType === 'point'){ const d = dist(p, pt(o)); if(d < bd){ bd = d; best = o; } } });
    return best;
  }
  function mkPoint(x, y, name, color){
    const id = uid('p_');
    color = color || '#111827';
    const p = new fabric.Circle({ left: x, top: y, radius: 4, fill: color, stroke: color, strokeWidth: 1, originX: 'center', originY: 'center',
      hasControls: false, hasBorders: false, egType: 'point', egId: id, name, hoverCursor: 'move', padding: 6, egOpts: {} });
    const lab = new fabric.IText(name, { left: x + 7, top: y - 26, fontSize: 19, fontFamily: 'Times New Roman', fontStyle: 'italic', fill: color,
      egType: 'label', owner: id, dx: 7, dy: -26, hasControls: false, hasBorders: true, padding: 2, hoverCursor: 'move' });
    cv.add(p); cv.add(lab);
    return p;
  }
  function baseDerived(type, deps, eo, style){
    return Object.assign({ egType: type, egId: uid('d_'), deps, egOpts: eo || {}, selectable: true, hasControls: false, hasBorders: false,
      lockMovementX: true, lockMovementY: true, hoverCursor: 'pointer', perPixelTargetFind: true, objectCaching: false,
      stroke: st.color, strokeWidth: st.width, strokeDashArray: st.dash ? [7, 5] : null, fill: '' }, style || {});
  }
  function clipLine(a, b, ray){
    const dx = b.x - a.x, dy = b.y - a.y;
    if(!dx && !dy) return [a, b];
    let t0 = ray ? 0 : -1e9, t1 = 1e9;
    const p = [-dx, dx, -dy, dy], q = [a.x, DRAW_W - a.x, a.y, DRAW_H - a.y];
    for(let i = 0; i < 4; i++){
      if(p[i] === 0){ if(q[i] < 0) return [a, b]; continue; }
      const r = q[i] / p[i];
      if(p[i] < 0) t0 = Math.max(t0, r); else t1 = Math.min(t1, r);
    }
    return [{ x: a.x + t0 * dx, y: a.y + t0 * dy }, { x: a.x + t1 * dx, y: a.y + t1 * dy }];
  }
  /* Build the fabric object for a dependent element from its point ids */
  function buildDerived(type, deps, eo, style){
    const P = deps.map(id => byId(id)).map(o => o && pt(o));
    if(P.some(x => !x)) return null;
    const base = baseDerived(type, deps, eo, style);
    const col = base.stroke;
    if(type === 'segment') return new fabric.Line([P[0].x, P[0].y, P[1].x, P[1].y], base);
    if(type === 'line' || type === 'ray'){ const [u, v] = clipLine(P[0], P[1], type === 'ray'); return new fabric.Line([u.x, u.y, v.x, v.y], base); }
    if(type === 'circle'){ const r = eo && eo.r ? eo.r : dist(P[0], P[1]); return new fabric.Circle(Object.assign(base, { left: P[0].x, top: P[0].y, radius: r, originX: 'center', originY: 'center', fill: base.fill || 'rgba(0,0,0,0)' })); }
    if(type === 'polygon') return new fabric.Polygon(P, Object.assign(base, { fill: base.fill || 'rgba(0,0,0,0)', objectCaching: false }));
    if(type === 'tick'){
      const n = (eo && eo.n) || 1, M = { x: (P[0].x + P[1].x) / 2, y: (P[0].y + P[1].y) / 2 };
      const L0 = dist(P[0], P[1]) || 1, d = { x: (P[1].x - P[0].x) / L0, y: (P[1].y - P[0].y) / L0 }, nn = { x: -d.y, y: d.x };
      let path = '';
      for(let i = 0; i < n; i++){ const o = (i - (n - 1) / 2) * 5; const c = { x: M.x + d.x * o, y: M.y + d.y * o };
        path += `M${c.x - nn.x * 7} ${c.y - nn.y * 7}L${c.x + nn.x * 7} ${c.y + nn.y * 7}`; }
      return new fabric.Path(path, Object.assign(base, { strokeDashArray: null, fill: '' }));
    }
    if(type === 'angle'){
      const [A, O, B] = P;
      const a1 = Math.atan2(A.y - O.y, A.x - O.x), a2 = Math.atan2(B.y - O.y, B.x - O.x);
      let diff = a2 - a1; while(diff > Math.PI) diff -= 2 * Math.PI; while(diff <= -Math.PI) diff += 2 * Math.PI;
      const deg = Math.abs(diff) * 180 / Math.PI;
      const R = (eo && eo.r) || 24;
      const u = { x: Math.cos(a1), y: Math.sin(a1) }, v = { x: Math.cos(a2), y: Math.sin(a2) };
      const isRight = eo && (eo.right === true || (eo.right !== false && Math.abs(deg - 90) < 0.8));
      let path = '';
      if(isRight){ const s = 13; path = `M${O.x + u.x * s} ${O.y + u.y * s}L${O.x + (u.x + v.x) * s} ${O.y + (u.y + v.y) * s}L${O.x + v.x * s} ${O.y + v.y * s}`; }
      else for(let k = 0; k < ((eo && eo.arcs) || 1); k++){ const r = R + k * 4;
        path += `M${O.x + u.x * r} ${O.y + u.y * r}A${r} ${r} 0 0 ${diff > 0 ? 1 : 0} ${O.x + v.x * r} ${O.y + v.y * r}`; }
      const items = [new fabric.Path(path, { stroke: col, strokeWidth: Math.max(1.4, base.strokeWidth * 0.8), fill: '', objectCaching: false })];
      const mode = (eo && eo.mode) || 'measure';
      const text = mode === 'measure' ? (isRight ? '' : Math.round(deg) + '°') : mode === 'label' ? (eo.label || 'α') : '';
      if(text){
        const am = a1 + diff / 2, rr = R + 15 + (((eo && eo.arcs) || 1) - 1) * 4;
        items.push(new fabric.Text(text, { left: O.x + Math.cos(am) * rr, top: O.y + Math.sin(am) * rr, originX: 'center', originY: 'center', fontSize: 15,
          fontFamily: mode === 'label' ? 'Times New Roman' : 'Arial', fontStyle: mode === 'label' ? 'italic' : 'normal', fill: col, direction: 'ltr' }));
      }
      return new fabric.Group(items, Object.assign(base, { stroke: col, fill: '', perPixelTargetFind: false, subTargetCheck: false, strokeDashArray: null }));
    }
    if(type === 'measure'){
      const [A, B] = P, L0 = dist(A, B) || 1, d = { x: (B.x - A.x) / L0, y: (B.y - A.y) / L0 };
      const off = (eo && eo.off) || -20, nn = { x: -d.y * off, y: d.x * off }, un = { x: -d.y * Math.sign(off), y: d.x * Math.sign(off) };
      const A2 = { x: A.x + nn.x, y: A.y + nn.y }, B2 = { x: B.x + nn.x, y: B.y + nn.y }, h = 7;
      const path = `M${A.x + un.x * 4} ${A.y + un.y * 4}L${A2.x + un.x * 5} ${A2.y + un.y * 5}M${B.x + un.x * 4} ${B.y + un.y * 4}L${B2.x + un.x * 5} ${B2.y + un.y * 5}` +
        `M${A2.x} ${A2.y}L${B2.x} ${B2.y}` +
        `M${A2.x + d.x * h + un.x * 3.5} ${A2.y + d.y * h + un.y * 3.5}L${A2.x} ${A2.y}L${A2.x + d.x * h - un.x * 3.5} ${A2.y + d.y * h - un.y * 3.5}` +
        `M${B2.x - d.x * h + un.x * 3.5} ${B2.y - d.y * h + un.y * 3.5}L${B2.x} ${B2.y}L${B2.x - d.x * h - un.x * 3.5} ${B2.y - d.y * h - un.y * 3.5}`;
      const label = (eo && eo.text) || (String(Math.round(L0 / GRID * 10) / 10).replace('.', lang === 'en' ? '.' : ',') + ' cm');
      const items = [new fabric.Path(path, { stroke: col, strokeWidth: 1.3, fill: '', objectCaching: false }),
        new fabric.Text(label, { left: (A2.x + B2.x) / 2 + un.x * 12, top: (A2.y + B2.y) / 2 + un.y * 12, originX: 'center', originY: 'center', fontSize: 14, fontFamily: 'Arial', fill: col, direction: isArabic(label) ? 'rtl' : 'ltr' })];
      return new fabric.Group(items, Object.assign(base, { fill: '', perPixelTargetFind: false, strokeDashArray: null }));
    }
    return null;
  }
  function styleOf(o){ return { stroke: o.stroke, strokeWidth: o.strokeWidth, strokeDashArray: o.strokeDashArray, fill: o.fill }; }
  function replaceDerived(o){
    const n = buildDerived(o.egType, o.deps, o.egOpts, styleOf(o));
    const idx = objs().indexOf(o);
    cv.remove(o);
    if(n){ n.egId = o.egId; cv.insertAt(n, Math.max(0, idx)); }
    return n;
  }
  function refreshDeps(pointId){
    objs().slice().forEach(o => { if(DERIVED.has(o.egType) && (!pointId || (o.deps || []).includes(pointId))) replaceDerived(o); });
  }
  function addDerived(type, deps, eo){
    const o = buildDerived(type, deps, eo);
    if(!o) return null;
    // keep geometry under points/labels
    const firstPoint = objs().findIndex(x => x.egType === 'point' || x.egType === 'label');
    if(firstPoint >= 0) cv.insertAt(o, firstPoint); else cv.add(o);
    return o;
  }
  function removeObj(o){
    if(o.egType === 'point'){
      const lab = labelOf(o); if(lab) cv.remove(lab);
      objs().slice().forEach(x => { if(DERIVED.has(x.egType) && (x.deps || []).includes(o.egId)) cv.remove(x); });
    }
    if(o.egType === 'label'){ const p = byId(o.owner); if(p){ removeObj(p); } }
    cv.remove(o);
  }

  /* ---------- history ---------- */
  let commitTimer = null;
  function commit(now){
    if(st.restoring || !cv) return;
    clearTimeout(commitTimer);
    const run = () => {
      const json = JSON.stringify(cv.toJSON(DRAW_PROPS));
      if(st.hist[st.hi] === json) return;
      st.hist = st.hist.slice(0, st.hi + 1); st.hist.push(json); if(st.hist.length > 60) st.hist.shift(); st.hi = st.hist.length - 1;
    };
    if(now) run(); else commitTimer = setTimeout(run, 120);
  }
  function restore(i){
    if(i < 0 || i >= st.hist.length) return;
    st.hi = i; st.restoring = true;
    cv.loadFromJSON(st.hist[i], () => { st.restoring = false; cv.renderAll(); drawSide(); });
  }

  /* ---------- canvas events ---------- */
  let drag = null;
  function bindCanvas(){
    cv.on('object:moving', e => {
      const o = e.target;
      if(o.egType === 'point'){
        o.set({ left: snapV(o.left), top: snapV(o.top) });
        const lab = labelOf(o); if(lab){ lab.set({ left: o.left + (lab.dx || 7), top: o.top + (lab.dy || -26) }); lab.setCoords(); }
        refreshDeps(o.egId);
      }
    });
    cv.on('object:modified', e => {
      const o = e.target;
      if(o.type === 'activeSelection'){
        cv.discardActiveObject();
        objs().forEach(x => {
          if(x.egType === 'point'){ x.set({ scaleX: 1, scaleY: 1, angle: 0 }); x.setCoords(); }
          if(x.egType === 'label'){ x.set({ scaleX: 1, scaleY: 1, angle: 0 }); x.setCoords(); const p = byId(x.owner); if(p){ x.dx = x.left - p.left; x.dy = x.top - p.top; } }
        });
        refreshDeps();
      } else if(o.egType === 'label'){
        const p = byId(o.owner); if(p){ o.dx = o.left - p.left; o.dy = o.top - p.top; }
      }
      cv.requestRenderAll(); commit();
    });
    cv.on('text:changed', e => {
      const o = e.target;
      o.set('direction', isArabic(o.text) ? 'rtl' : 'ltr');
      if(o.egType === 'label'){ const p = byId(o.owner); if(p) p.name = o.text; }
    });
    cv.on('text:editing:exited', () => commit());
    cv.on('selection:created', () => { if(st.mode === 'select'){ st.side = 'props'; drawSide(); } });
    cv.on('selection:updated', () => { if(st.mode === 'select'){ st.side = 'props'; drawSide(); } });
    cv.on('selection:cleared', () => { if(st.side === 'props') drawSide(); });
    cv.on('path:created', e => { e.path.set({ egType: 'free', egId: uid('f_'), stroke: st.color, strokeWidth: st.width, fill: '' }); commit(); });
    cv.on('mouse:down', onDown);
    cv.on('mouse:move', onMove);
    cv.on('mouse:up', onUp);
  }
  function pointerOf(e){ const p = cv.getPointer(e.e); return { x: p.x, y: p.y }; }
  function getOrMakePoint(p){
    const hit = nearestPoint(p, 12);
    if(hit) return hit;
    return mkPoint(snapV(p.x), snapV(p.y), nextName(), st.color);
  }
  function markPending(p){
    const ring = new fabric.Circle({ left: p.left, top: p.top, radius: 9, originX: 'center', originY: 'center', fill: 'rgba(217,119,6,.18)', stroke: '#D97706', strokeWidth: 1.5, selectable: false, evented: false, egType: 'tmp', excludeFromExport: true });
    cv.add(ring);
  }
  function clearPending(){ st.pending = []; objs().slice().forEach(o => { if(o.egType === 'tmp') cv.remove(o); }); }
  const NEED = { segment: 2, line: 2, ray: 2, circle: 2, angle: 3, right: 3, measure: 2 };
  function onDown(e){
    if(!cv) return;
    const mode = st.mode, p = pointerOf(e);
    if(mode === 'select' || mode === 'free') return;
    if(mode === 'eraser'){
      const t = cv.findTarget(e.e, false) || nearestPoint(p, 10);
      if(t){ removeObj(t); cv.requestRenderAll(); commit(); }
      return;
    }
    if(mode === 'text'){
      const it = new fabric.IText(L('نص','Text','Texte'), { left: p.x, top: p.y, fontSize: 20, fontFamily: 'Tajawal, Arial', fill: st.color, egType: 'text', egId: uid('t_'), direction: lang === 'ar' ? 'rtl' : 'ltr', originX: 'center', originY: 'center' });
      cv.add(it); setMode('select'); cv.setActiveObject(it); it.enterEditing(); it.selectAll(); commit();
      return;
    }
    if(mode === 'arrow' || mode === 'rect' || mode === 'ellipse'){
      drag = { start: { x: snapV(p.x), y: snapV(p.y) }, obj: null };
      return;
    }
    if(mode === 'tick'){
      let best = null, bd = 10;
      objs().forEach(o => { if(o.egType === 'segment' || o.egType === 'polygon'){
        const pairs = o.egType === 'segment' ? [o.deps] : o.deps.map((d, i) => [d, o.deps[(i + 1) % o.deps.length]]);
        pairs.forEach(pr => { const a = pt(byId(pr[0])), b = pt(byId(pr[1])); const dd = segDist(p, a, b); if(dd < bd){ bd = dd; best = pr; } });
      }});
      if(!best) { toast(L('اضغط على قطعة مرسومة','Click on a drawn segment','Cliquez sur un segment'), 'warn'); return; }
      const ex = objs().find(o => o.egType === 'tick' && ((o.deps[0] === best[0] && o.deps[1] === best[1]) || (o.deps[0] === best[1] && o.deps[1] === best[0])));
      if(ex){ const n = (ex.egOpts.n || 1) + 1; if(n > 3) cv.remove(ex); else { ex.egOpts = { n }; replaceDerived(ex); } }
      else addDerived('tick', best, { n: 1 });
      cv.requestRenderAll(); commit();
      return;
    }
    // point-based tools
    const ptObj = getOrMakePoint(p);
    if(mode === 'point'){ cv.requestRenderAll(); commit(); return; }
    if(mode === 'polygon'){
      if(st.pending.length >= 3 && ptObj.egId === st.pending[0]){
        addDerived('polygon', st.pending.slice(), {}); clearPending(); commit(); cv.requestRenderAll(); return;
      }
      if(st.pending.length && ptObj.egId === st.pending[st.pending.length - 1]) return;
      if(st.pending.length) addDerived('segment', [st.pending[st.pending.length - 1], ptObj.egId], { tmp: true }).set({ egType: 'tmp' });
      st.pending.push(ptObj.egId); markPending(ptObj); cv.requestRenderAll();
      return;
    }
    if(st.pending.length && st.pending[st.pending.length - 1] === ptObj.egId) return;
    st.pending.push(ptObj.egId); markPending(ptObj);
    if(st.pending.length >= NEED[mode]){
      const deps = st.pending.slice();
      if(mode === 'right') addDerived('angle', deps, { right: true, mode: 'none' });
      else if(mode === 'angle') addDerived('angle', deps, { mode: 'measure', arcs: 1 });
      else addDerived(mode, deps, mode === 'measure' ? { off: -20 } : {});
      clearPending(); commit();
    }
    cv.requestRenderAll();
  }
  function onMove(e){
    if(!drag) return;
    const p = pointerOf(e), a = drag.start, b = { x: snapV(p.x), y: snapV(p.y) };
    if(drag.obj) cv.remove(drag.obj);
    drag.obj = makeDragObj(st.mode, a, b);
    if(drag.obj) cv.add(drag.obj);
    cv.requestRenderAll();
  }
  function onUp(){
    if(!drag) return;
    const o = drag.obj; drag = null;
    if(o && (o.width > 4 || o.height > 4)){ o.set({ evented: true, selectable: true }); o.setCoords(); setMode('select'); cv.setActiveObject(o); commit(); }
    else if(o) cv.remove(o);
    cv.requestRenderAll();
  }
  function makeDragObj(mode, a, b){
    const common = { stroke: st.color, strokeWidth: st.width, strokeDashArray: st.dash ? [7, 5] : null, egId: uid('f_'), evented: false, selectable: false };
    if(mode === 'rect') return new fabric.Rect(Object.assign(common, { left: Math.min(a.x, b.x), top: Math.min(a.y, b.y), width: Math.abs(b.x - a.x), height: Math.abs(b.y - a.y), fill: 'rgba(0,0,0,0)', egType: 'rect' }));
    if(mode === 'ellipse') return new fabric.Ellipse(Object.assign(common, { left: Math.min(a.x, b.x), top: Math.min(a.y, b.y), rx: Math.abs(b.x - a.x) / 2, ry: Math.abs(b.y - a.y) / 2, fill: 'rgba(0,0,0,0)', egType: 'ellipse' }));
    if(mode === 'arrow'){
      const len = dist(a, b); if(len < 3) return null;
      const ang = Math.atan2(b.y - a.y, b.x - a.x), h = 12 + st.width * 2;
      const path = `M${a.x} ${a.y}L${b.x} ${b.y}M${b.x - h * Math.cos(ang - 0.4)} ${b.y - h * Math.sin(ang - 0.4)}L${b.x} ${b.y}L${b.x - h * Math.cos(ang + 0.4)} ${b.y - h * Math.sin(ang + 0.4)}`;
      return new fabric.Path(path, Object.assign(common, { fill: '', egType: 'arrow', strokeLineCap: 'round', strokeLineJoin: 'round' }));
    }
    return null;
  }
  function segDist(p, a, b){
    const dx = b.x - a.x, dy = b.y - a.y, l2 = dx * dx + dy * dy || 1;
    const tt = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2));
    return Math.hypot(p.x - (a.x + tt * dx), p.y - (a.y + tt * dy));
  }

  function setMode(mode){
    st.mode = mode; clearPending();
    m.body.querySelectorAll('.dt-btn').forEach(b => b.classList.toggle('on', b.dataset.mode === mode));
    helpEl.innerHTML = `💡 ${TOOL_HELP[mode] ? TOOL_HELP[mode]() : ''}`;
    if(!cv) return;
    cv.isDrawingMode = mode === 'free';
    if(cv.isDrawingMode){ cv.freeDrawingBrush.color = st.color; cv.freeDrawingBrush.width = st.width; }
    const sel = mode === 'select';
    cv.selection = sel; cv.skipTargetFind = !(sel || mode === 'eraser');
    cv.defaultCursor = sel ? 'default' : 'crosshair';
    if(!sel) cv.discardActiveObject();
    cv.requestRenderAll();
  }
  function syncTop(){
    stage.className = 'draw-stage grid-' + st.grid;
    m.body.querySelectorAll('[data-grid]').forEach(b => b.classList.toggle('on', b.dataset.grid === st.grid));
    m.body.querySelector('[data-a="snap"]').checked = st.snap;
    m.body.querySelector('[data-a="printGrid"]').checked = st.printGrid;
  }

  /* ---------- side panel: shapes library / properties ---------- */
  function drawSide(){
    m.body.querySelectorAll('[data-side]').forEach(b => b.classList.toggle('on', b.dataset.side === st.side));
    if(st.side === 'lib') return drawLib();
    drawProps();
  }
  function drawLib(){
    const cat = SHAPE_LIB.find(c => c.id === st.libCat) || SHAPE_LIB[0];
    side.innerHTML = `<div class="lib-cats">${SHAPE_LIB.map(c => `<button data-cat="${c.id}" class="${c.id === cat.id ? 'on' : ''}"><span>${c.icon}</span>${c.name()}</button>`).join('')}</div>
      <div class="shape-grid">${cat.items.map((it, i) => `<button class="shape-card" data-i="${i}"><span class="sc-thumb">${it.svg ? it.svg() : geoThumb(it.k)}</span><span class="sc-name">${it.n()}</span></button>`).join('')}</div>`;
    side.querySelectorAll('[data-cat]').forEach(b => b.onclick = () => { st.libCat = b.dataset.cat; drawLib(); });
    side.querySelectorAll('.shape-card').forEach(b => b.onclick = () => addShape(cat.items[+b.dataset.i]));
  }
  function geoThumb(k){
    const g = geoPreset(k); if(!g) return '';
    const xs = g.pts.map(p => p.x), ys = g.pts.map(p => p.y);
    let ext = 0;
    g.items.forEach(it => { if(it[0] === 'circle'){ const a = g.pts[it[1]], b = g.pts[it[2]]; ext = Math.max(ext, Math.hypot(a.x - b.x, a.y - b.y) - 3); } });
    const minx = Math.min(...xs) - 1 - ext, miny = Math.min(...ys) - 1 - ext, w = Math.max(...xs) + ext - minx + 1, h = Math.max(...ys) + ext - miny + 1;
    let s = '';
    g.items.forEach(it => {
      const a = g.pts[it[1]], b = g.pts[it[2]];
      if(it[0] === 'segment') s += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`;
      if(it[0] === 'circle') s += `<circle cx="${a.x}" cy="${a.y}" r="${Math.hypot(a.x - b.x, a.y - b.y)}"/>`;
    });
    g.pts.forEach(p => s += `<circle cx="${p.x}" cy="${p.y}" r="0.12" fill="#111"/><text x="${p.x + 0.15}" y="${p.y - 0.2}" font-size="0.7" font-style="italic" font-family="Times New Roman" fill="#111" stroke="none">${p.n}</text>`);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minx} ${miny} ${w} ${h}" fill="none" stroke="#111" stroke-width="0.08">${s}</svg>`;
  }
  function addShape(it){
    if(!cv) return;
    if(it.geo){
      const g = geoPreset(it.k);
      const xs = g.pts.map(p => p.x), ys = g.pts.map(p => p.y);
      const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
      const ox = Math.round(DRAW_W / 2 / GRID) * GRID - cx * GRID, oy = Math.round(DRAW_H / 2 / GRID) * GRID - cy * GRID;
      const used = new Set(objs().filter(o => o.egType === 'point').map(o => o.name));
      const ids = g.pts.map(p => { let n = p.n; let k = 1; while(used.has(n)) n = p.n + (k++); used.add(n); return mkPoint(ox + p.x * GRID, oy + p.y * GRID, n, st.color).egId; });
      g.items.forEach(itm => {
        const [type, ...rest] = itm;
        if(type === 'segment') addDerived('segment', [ids[rest[0]], ids[rest[1]]]);
        if(type === 'circle') addDerived('circle', [ids[rest[0]], ids[rest[1]]]);
        if(type === 'tick') addDerived('tick', [ids[rest[0]], ids[rest[1]]], { n: rest[2] || 1 });
        if(type === 'right') addDerived('angle', [ids[rest[1]], ids[rest[0]], ids[rest[2]]], { right: true, mode: 'none' });
      });
      cv.requestRenderAll(); commit(); setMode('select');
      return;
    }
    fabric.loadSVGFromString(it.svg(), (items, options) => {
      const grp = fabric.util.groupSVGElements(items, options);
      const sc = Math.min(1.6, 220 / Math.max(grp.width, grp.height));
      grp.set({ left: DRAW_W / 2, top: DRAW_H / 2, originX: 'center', originY: 'center', scaleX: sc, scaleY: sc, egType: 'shape', egShape: it.k, egId: uid('s_') });
      cv.add(grp); setMode('select'); cv.setActiveObject(grp); cv.requestRenderAll(); commit();
    });
  }
  function drawProps(){
    const a = cv && cv.getActiveObject();
    const colorRow = (cur) => `<div class="pr-colors">${DRAW_COLORS.map(c => `<button class="cdot big ${c === cur ? 'on' : ''}" data-color="${c}" style="background:${c}"></button>`).join('')}</div>`;
    const widthRow = (cur) => `<div class="seg" style="--accent:#D97706"><button data-w="1.2" class="${cur <= 1.3 ? 'on' : ''}">${L('رفيع','Thin','Fin')}</button><button data-w="2" class="${cur > 1.3 && cur < 3 ? 'on' : ''}">${L('متوسط','Medium','Moyen')}</button><button data-w="3.5" class="${cur >= 3 ? 'on' : ''}">${L('سميك','Thick','Épais')}</button></div>`;
    if(!a){
      side.innerHTML = `<div class="pr-sec"><div class="pr-h">🎨 ${L('لون الرسم الجديد','Colour for new shapes','Couleur des nouveaux tracés')}</div>${colorRow(st.color)}</div>
        <div class="pr-sec"><div class="pr-h">✏️ ${L('سمك الخط','Line width','Épaisseur')}</div>${widthRow(st.width)}</div>
        <div class="pr-sec"><label class="chk"><input type="checkbox" data-dash ${st.dash ? 'checked' : ''}> ${L('خط متقطع','Dashed line','Trait pointillé')}</label></div>
        <p class="pr-note">💡 ${L('اختر شكلًا من اللوحة لتغيير لونه أو سمكه أو اسمه.','Select a shape on the board to change its colour, width or name.','Sélectionnez une forme pour la modifier.')}</p>`;
      side.querySelectorAll('[data-color]').forEach(b => b.onclick = () => { st.color = b.dataset.color; if(cv.isDrawingMode) cv.freeDrawingBrush.color = st.color; drawProps(); });
      side.querySelectorAll('[data-w]').forEach(b => b.onclick = () => { st.width = +b.dataset.w; if(cv.isDrawingMode) cv.freeDrawingBrush.width = st.width; drawProps(); });
      side.querySelector('[data-dash]').onchange = e => { st.dash = e.target.checked; };
      return;
    }
    const multi = a.type === 'activeSelection';
    const t = multi ? 'multi' : a.egType;
    const cur = t === 'point' || t === 'label' || t === 'text' ? a.fill : (a.stroke || st.color);
    let h = `<div class="pr-title">${{ point: '• ' + L('نقطة','Point','Point'), label: '🔤 ' + L('اسم نقطة','Point name','Nom de point'), segment: '⟋ ' + L('قطعة','Segment','Segment'), line: '↔ ' + L('مستقيم','Line','Droite'), ray: '↦ ' + L('نصف مستقيم','Ray','Demi-droite'), circle: '◯ ' + L('دائرة','Circle','Cercle'), polygon: '⬠ ' + L('مضلع','Polygon','Polygone'), angle: '∠ ' + L('زاوية','Angle','Angle'), tick: '⫽ ' + L('علامة تساوٍ','Equal mark','Codage'), measure: '⟷ ' + L('قياس','Measure','Cotation'), text: 'T ' + L('نص','Text','Texte'), shape: '🧩 ' + L('شكل جاهز','Ready shape','Forme'), multi: '▦ ' + L('عدة أشكال','Several shapes','Plusieurs formes') }[t] || L('شكل','Shape','Forme')}</div>`;
    h += `<div class="pr-sec"><div class="pr-h">🎨 ${L('اللون','Colour','Couleur')}</div>${colorRow(cur)}</div>`;
    if(['segment','line','ray','circle','polygon','rect','ellipse','arrow','free','shape','multi'].includes(t)){
      h += `<div class="pr-sec"><div class="pr-h">✏️ ${L('سمك الخط','Line width','Épaisseur')}</div>${widthRow(a.strokeWidth || 2)}</div>`;
      h += `<div class="pr-sec"><label class="chk"><input type="checkbox" data-pdash ${a.strokeDashArray ? 'checked' : ''}> ${L('خط متقطع','Dashed','Pointillé')}</label></div>`;
    }
    if(['circle','polygon','rect','ellipse'].includes(t)){
      const filled = a.fill && a.fill !== 'rgba(0,0,0,0)' && a.fill !== '';
      h += `<div class="pr-sec"><label class="chk"><input type="checkbox" data-fill ${filled ? 'checked' : ''}> ${L('تلوين الداخل (تظليل)','Fill inside (shade)','Remplir')}</label></div>`;
    }
    if(t === 'point'){
      const lab = labelOf(a);
      h += `<div class="pr-sec"><div class="pr-h">🔤 ${L('اسم النقطة','Point name','Nom du point')}</div><input class="big-input" data-name value="${escAttr(a.name || '')}" dir="ltr"></div>
        <label class="chk"><input type="checkbox" data-hidept ${a.egOpts && a.egOpts.hidden ? 'checked' : ''}> ${L('إخفاء النقطة عند الطباعة','Hide the dot when printing','Masquer le point')}</label>
        <label class="chk"><input type="checkbox" data-hidelab ${lab && lab.visible === false ? 'checked' : ''}> ${L('إخفاء الاسم','Hide the name','Masquer le nom')}</label>`;
    }
    if(t === 'angle'){
      const eo = a.egOpts || {};
      h += `<div class="pr-sec"><div class="pr-h">${L('ماذا يُكتب على الزاوية؟','What to write on the angle?','Que noter sur l’angle ?')}</div>
        <div class="seg" style="--accent:#D97706"><button data-amode="measure" class="${(eo.mode||'measure')==='measure'?'on':''}">${L('القيس °','Measure °','Mesure °')}</button><button data-amode="label" class="${eo.mode==='label'?'on':''}">${L('حرف','Letter','Lettre')}</button><button data-amode="none" class="${eo.mode==='none'?'on':''}">${L('لا شيء','Nothing','Rien')}</button></div>
        ${eo.mode === 'label' ? `<input class="big-input" data-alabel value="${escAttr(eo.label || 'α')}" dir="ltr" style="margin-top:8px">` : ''}</div>
        <div class="pr-sec"><div class="pr-h">${L('عدد الأقواس','Number of arcs','Nombre d’arcs')}</div><div class="seg" style="--accent:#D97706">${[1,2,3].map(n => `<button data-arcs="${n}" class="${(eo.arcs||1)===n?'on':''}">${n}</button>`).join('')}</div></div>
        <label class="chk"><input type="checkbox" data-aright ${eo.right === true ? 'checked' : ''}> ${L('زاوية قائمة (مربع صغير)','Right angle (small square)','Angle droit (carré)')}</label>`;
    }
    if(t === 'tick') h += `<div class="pr-sec"><div class="pr-h">${L('عدد العلامات','Number of marks','Nombre de traits')}</div><div class="seg" style="--accent:#D97706">${[1,2,3].map(n => `<button data-ticks="${n}" class="${(a.egOpts.n||1)===n?'on':''}">${'|'.repeat(n)}</button>`).join('')}</div></div>`;
    if(t === 'measure') h += `<div class="pr-sec"><div class="pr-h">${L('النص المكتوب','Written text','Texte affiché')}</div><input class="big-input" data-mtext value="${escAttr((a.egOpts && a.egOpts.text) || '')}" placeholder="${L('تلقائي (مثال: 4 cm أو ?)','Automatic (e.g. 4 cm or ?)','Automatique')}"><button class="mini-btn" data-mflip style="margin-top:8px">⇅ ${L('قلب الجهة','Flip side','Inverser')}</button></div>`;
    if(t === 'text' || t === 'label') h += `<div class="pr-sec"><div class="pr-h">${L('حجم الخط','Font size','Taille')}</div><input type="range" min="10" max="48" value="${a.fontSize}" data-fsize style="width:100%"><label class="chk"><input type="checkbox" data-bold ${a.fontWeight === 'bold' ? 'checked' : ''}> ${L('عريض','Bold','Gras')}</label></div>`;
    h += `<div class="pr-actions">
      ${['shape','text','arrow','rect','ellipse','free'].includes(t) ? `<button class="mini-btn" data-dup>📋 ${L('نسخ','Duplicate','Dupliquer')}</button>` : ''}
      ${!multi && !['point','label'].includes(t) ? `<button class="mini-btn" data-front>⬆ ${L('للأمام','Front','Devant')}</button><button class="mini-btn" data-back>⬇ ${L('للخلف','Back','Derrière')}</button>` : ''}
      <button class="mini-btn danger-btn" data-delsel>🗑️ ${L('حذف','Delete','Supprimer')}</button></div>`;
    side.innerHTML = h;
    const targets = multi ? a.getObjects() : [a];
    const apply = fn => { targets.forEach(fn); if(multi){ /* keep selection */ } refreshDeps(); cv.requestRenderAll(); commit(); };
    side.querySelectorAll('[data-color]').forEach(b => b.onclick = () => { const c = b.dataset.color; apply(o => setColor(o, c)); if(!multi) reselect(a); drawProps(); });
    side.querySelectorAll('[data-w]').forEach(b => b.onclick = () => { const w = +b.dataset.w; apply(o => setWidth(o, w)); if(!multi) reselect(a); drawProps(); });
    const pd = side.querySelector('[data-pdash]'); if(pd) pd.onchange = () => { apply(o => setDash(o, pd.checked)); if(!multi) reselect(a); };
    const fi = side.querySelector('[data-fill]'); if(fi) fi.onchange = () => { apply(o => o.set('fill', fi.checked ? hexA(o.stroke || '#111', 0.22) : 'rgba(0,0,0,0)')); if(!multi) reselect(a); };
    const nm = side.querySelector('[data-name]'); if(nm) nm.oninput = () => { a.name = nm.value; const lab = labelOf(a); if(lab){ lab.set({ text: nm.value }); } cv.requestRenderAll(); commit(); };
    const hp = side.querySelector('[data-hidept]'); if(hp) hp.onchange = () => { a.egOpts = Object.assign({}, a.egOpts, { hidden: hp.checked }); a.set({ opacity: hp.checked ? 0.35 : 1 }); cv.requestRenderAll(); commit(); };
    const hl = side.querySelector('[data-hidelab]'); if(hl) hl.onchange = () => { const lab = labelOf(a); if(lab) lab.set('visible', !hl.checked); cv.requestRenderAll(); commit(); };
    const upd = (patch) => { const n = (a.egOpts = Object.assign({}, a.egOpts, patch), replaceDerived(a)); cv.setActiveObject(n); cv.requestRenderAll(); commit(); drawProps(); };
    side.querySelectorAll('[data-amode]').forEach(b => b.onclick = () => upd({ mode: b.dataset.amode }));
    const al = side.querySelector('[data-alabel]'); if(al) al.onchange = () => upd({ label: al.value });
    side.querySelectorAll('[data-arcs]').forEach(b => b.onclick = () => upd({ arcs: +b.dataset.arcs }));
    const ar = side.querySelector('[data-aright]'); if(ar) ar.onchange = () => upd({ right: ar.checked ? true : undefined });
    side.querySelectorAll('[data-ticks]').forEach(b => b.onclick = () => upd({ n: +b.dataset.ticks }));
    const mt = side.querySelector('[data-mtext]'); if(mt) mt.onchange = () => upd({ text: mt.value });
    const mf = side.querySelector('[data-mflip]'); if(mf) mf.onclick = () => upd({ off: -((a.egOpts && a.egOpts.off) || -20) });
    const fs = side.querySelector('[data-fsize]'); if(fs) fs.oninput = () => { a.set('fontSize', +fs.value); cv.requestRenderAll(); commit(); };
    const bd = side.querySelector('[data-bold]'); if(bd) bd.onchange = () => { a.set('fontWeight', bd.checked ? 'bold' : 'normal'); cv.requestRenderAll(); commit(); };
    const dp = side.querySelector('[data-dup]'); if(dp) dp.onclick = () => a.clone(c => { c.set({ left: a.left + 20, top: a.top + 20, egId: uid('c_') }); DRAW_PROPS.forEach(k => { if(a[k] !== undefined && k !== 'egId') c[k] = a[k]; }); cv.add(c); cv.setActiveObject(c); commit(); }, DRAW_PROPS);
    const fr = side.querySelector('[data-front]'); if(fr) fr.onclick = () => { a.bringToFront(); cv.requestRenderAll(); commit(); };
    const bk = side.querySelector('[data-back]'); if(bk) bk.onclick = () => { a.sendToBack(); cv.requestRenderAll(); commit(); };
    side.querySelector('[data-delsel]').onclick = deleteSelected;
  }
  function reselect(a){ if(DERIVED.has(a.egType)){ const n = byId(a.egId); if(n) cv.setActiveObject(n); } }
  function hexA(hex, al){ const h = hex.replace('#', ''); if(h.length !== 6) return 'rgba(0,0,0,0.15)'; return `rgba(${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)},${al})`; }
  function setColor(o, c){
    if(o.egType === 'point'){ o.set({ fill: c, stroke: c }); const lab = labelOf(o); if(lab) lab.set('fill', c); return; }
    if(o.egType === 'label' || o.egType === 'text' || o.type === 'i-text' || o.type === 'text'){ o.set('fill', c); return; }
    if(o.type === 'group' && !DERIVED.has(o.egType)){ o.getObjects().forEach(ch => { if(ch.stroke && ch.stroke !== 'none') ch.set('stroke', c); if(ch.type === 'text' || ch.type === 'i-text') ch.set('fill', c); }); o.dirty = true; return; }
    const wasFilled = o.fill && o.fill !== 'rgba(0,0,0,0)' && o.fill !== '' && o.type !== 'path' && o.type !== 'line';
    o.set('stroke', c); if(wasFilled) o.set('fill', hexA(c, 0.22));
  }
  function setWidth(o, w){
    if(o.type === 'group' && !DERIVED.has(o.egType)){ o.getObjects().forEach(ch => { if(ch.stroke && ch.stroke !== 'none') ch.set('strokeWidth', w); }); o.dirty = true; return; }
    if(o.egType !== 'point' && o.egType !== 'label') o.set('strokeWidth', w);
  }
  function setDash(o, on){
    if(o.type === 'group' && !DERIVED.has(o.egType)){ o.getObjects().forEach(ch => ch.set('strokeDashArray', on ? [6, 4] : null)); o.dirty = true; return; }
    o.set('strokeDashArray', on ? [7, 5] : null);
  }
  function deleteSelected(){
    const a = cv.getActiveObject(); if(!a) return;
    const list = a.type === 'activeSelection' ? a.getObjects() : [a];
    cv.discardActiveObject();
    list.forEach(o => { if(objs().includes(o)) removeObj(o); });
    cv.requestRenderAll(); commit(); drawSide();
  }

  /* ---------- top bar ---------- */
  m.body.querySelectorAll('.dt-btn').forEach(b => b.onclick = () => setMode(b.dataset.mode));
  m.body.querySelectorAll('[data-side]').forEach(b => b.onclick = () => { st.side = b.dataset.side; drawSide(); });
  m.body.querySelector('[data-a="undo"]').onclick = () => restore(st.hi - 1);
  m.body.querySelector('[data-a="redo"]').onclick = () => restore(st.hi + 1);
  m.body.querySelector('[data-a="del"]').onclick = () => cv && deleteSelected();
  m.body.querySelector('[data-a="clear"]').onclick = async () => { if(!cv) return; if(await askConfirm(L('مسح كل الرسم؟','Clear the whole drawing?','Tout effacer ?'), L('نعم، امسح','Yes, clear','Oui'), true)){ cv.clear(); commit(); drawSide(); } };
  m.body.querySelectorAll('[data-grid]').forEach(b => b.onclick = () => { st.grid = b.dataset.grid; syncTop(); });
  m.body.querySelector('[data-a="snap"]').onchange = e => { st.snap = e.target.checked; };
  m.body.querySelector('[data-a="printGrid"]').onchange = e => { st.printGrid = e.target.checked; };
  const keyH = e => {
    if(!cv || m.closed) return;
    const a = cv.getActiveObject();
    if(a && a.isEditing) return;
    if(document.activeElement && ['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) return;
    if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z'){ e.preventDefault(); restore(st.hi - 1); }
    else if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y'){ e.preventDefault(); restore(st.hi + 1); }
    else if(e.key === 'Delete' || e.key === 'Backspace'){ if(a){ e.preventDefault(); deleteSelected(); } }
    else if(e.key === 'Escape'){ clearPending(); cv.requestRenderAll(); }
  };
  document.addEventListener('keydown', keyH);
  const origClose = m.close; m.close = () => { document.removeEventListener('keydown', keyH); origClose(); };

  /* ---------- export ---------- */
  function exportDrawing(){
    cv.discardActiveObject(); clearPending();
    const hidden = [];
    objs().forEach(o => { if(o.egType === 'point' && o.egOpts && o.egOpts.hidden){ hidden.push([o, o.visible]); o.visible = false; } });
    let minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity;
    objs().forEach(o => { if(!o.visible || o.egType === 'tmp') return; const r = o.getBoundingRect(true, true);
      minx = Math.min(minx, r.left); miny = Math.min(miny, r.top); maxx = Math.max(maxx, r.left + r.width); maxy = Math.max(maxy, r.top + r.height); });
    if(!isFinite(minx)){ minx = 0; miny = 0; maxx = 200; maxy = 100; }
    const pad = 10;
    minx -= pad; miny -= pad; maxx += pad; maxy += pad;
    const w = Math.round(maxx - minx), h = Math.round(maxy - miny);
    let svg = cv.toSVG({ suppressPreamble: true, viewBox: { x: minx, y: miny, width: w, height: h }, width: w, height: h });
    hidden.forEach(([o, v]) => o.visible = v);
    if(st.printGrid && st.grid !== 'none'){
      let g = '';
      const x0 = Math.floor(minx / GRID) * GRID, y0 = Math.floor(miny / GRID) * GRID;
      if(st.grid === 'squares'){
        for(let x = x0; x <= maxx; x += GRID) g += `M${x} ${miny}V${maxy}`;
        for(let y = y0; y <= maxy; y += GRID) g += `M${minx} ${y}H${maxx}`;
        g = `<path d="${g}" stroke="#CBD5E1" stroke-width="0.8" fill="none"/>`;
      } else {
        for(let x = x0; x <= maxx; x += GRID) for(let y = y0; y <= maxy; y += GRID) g += `<circle cx="${x}" cy="${y}" r="1.2" fill="#94A3B8"/>`;
      }
      svg = svg.replace(/(<svg[^>]*>)/, `$1<g>${g}</g>`);
    }
    svg = svg.replace(/<svg\b/, '<svg direction="ltr"');
    return { svg: ensureSvgNs(svg), w, h };
  }
  m.foot.querySelector('[data-save]').onclick = () => {
    if(!cv) return;
    if(!objs().filter(o => o.egType !== 'tmp').length){ toast(L('ارسم شيئًا أولًا','Draw something first','Dessinez d’abord'), 'warn'); return; }
    const ex = exportDrawing();
    const data = { json: cv.toJSON(DRAW_PROPS), grid: st.grid, snap: st.snap, printGrid: st.printGrid, color: st.color, width: st.width };
    m.close();
    done({ kind: 'draw', data, svg: ex.svg, w: (obj && obj.w) || Math.min(560, Math.round(ex.w * 0.85)) });
  };
}

/* Build a drawing object from a list of shape keys / geometry presets without opening the editor (used by templates) */
function buildDrawingSvgFromJson(json){
  return new Promise(res => {
    loadFabric().then(() => {
      const el = document.createElement('canvas'); el.width = DRAW_W; el.height = DRAW_H;
      const sc = new fabric.StaticCanvas(el);
      sc.loadFromJSON(json, () => {
        let minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity;
        sc.getObjects().forEach(o => { const r = o.getBoundingRect(true, true); minx = Math.min(minx, r.left); miny = Math.min(miny, r.top); maxx = Math.max(maxx, r.left + r.width); maxy = Math.max(maxy, r.top + r.height); });
        if(!isFinite(minx)){ res(''); return; }
        minx -= 10; miny -= 10; maxx += 10; maxy += 10;
        const w = Math.round(maxx - minx), h = Math.round(maxy - miny);
        res(ensureSvgNs(sc.toSVG({ suppressPreamble: true, viewBox: { x: minx, y: miny, width: w, height: h }, width: w, height: h }).replace(/<svg\b/, '<svg direction="ltr"')));
        sc.dispose();
      });
    });
  });
}
