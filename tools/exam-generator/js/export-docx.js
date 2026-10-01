/* ================= Word (.docx) export =================
   Builds a real Word document with docx.js. Text stays editable text; equations, curves and drawings are
   embedded as high-resolution PNG images (rendered from their SVG at 4× scale); tables become Word tables. */

async function exportWord(ex){
  ex = ex || exam;
  const busy = openModal({ size:'small', icon:'📝', title:L('تحضير ملف Word','Preparing Word file','Préparation du fichier Word'),
    body:`<div class="eg-busy"><div class="spinner"></div><p>${L('لحظة من فضلك... نحضّر الامتحان بالمعادلات والرسومات بجودة عالية','Please wait… preparing the exam with high-quality equations and drawings','Veuillez patienter…')}</p></div>` });
  let host;
  try{
    await loadDocx();
    const D = window.docx;
    host = document.createElement('div');
    host.className = 'export-host';
    host.setAttribute('dir', document.documentElement.dir);
    host.innerHTML = staticPageHTML(ex);
    document.body.appendChild(host);
    hydrateObjects(host, ex.objects);
    await new Promise(r => setTimeout(r, 30));

    const rtl = document.documentElement.dir === 'rtl';
    const FONT = { ascii: 'Calibri', hAnsi: 'Calibri', cs: 'Arial', eastAsia: 'Calibri' };
    const baseSize = { sm: 22, md: 24, lg: 28 }[(ex.tpl && ex.tpl.fontSize) || 'md'];
    const TR = (text, f) => new D.TextRun({ text, bold: !!(f && f.bold), italics: !!(f && f.italic), underline: (f && f.underline) ? {} : undefined,
      superScript: !!(f && f.sup), subScript: !!(f && f.sub), rightToLeft: rtl && /[\u0590-\u08FF]/.test(text), font: FONT, size: (f && f.size) || baseSize, sizeComplexScript: (f && f.size) || baseSize,
      color: f && f.color });
    const P = (children, o) => new D.Paragraph(Object.assign({ children, bidirectional: rtl, spacing: { after: 80, line: 312 } }, o || {}));
    const ALIGN = { center: D.AlignmentType.CENTER, left: D.AlignmentType.LEFT, right: D.AlignmentType.RIGHT };
    const NOB = { style: D.BorderStyle.NONE, size: 0, color: 'FFFFFF' };
    const noBorders = { top: NOB, bottom: NOB, left: NOB, right: NOB, insideHorizontal: NOB, insideVertical: NOB };
    const line = (c) => ({ style: D.BorderStyle.SINGLE, size: 6, color: c || '555555' });
    const allBorders = (c) => ({ top: line(c), bottom: line(c), left: line(c), right: line(c), insideHorizontal: line(c), insideVertical: line(c) });

    /* ---- images ---- */
    async function objImage(span, obj){
      let el = span.querySelector('svg') || span.querySelector('img') || span;
      const r = el.getBoundingClientRect();
      let w = Math.max(4, r.width), h = Math.max(4, r.height);
      if(obj.kind === 'image'){
        const src = obj.data.src;
        let bytes, type = 'png';
        if(/^data:image\/(jpeg|jpg)/.test(src)){ bytes = dataUrlToBytes(src); type = 'jpg'; }
        else if(/^data:image\/png/.test(src)){ bytes = dataUrlToBytes(src); }
        else { bytes = await imgToPng(src); }
        return new D.ImageRun({ type, data: bytes, transformation: { width: Math.round(w), height: Math.round(h) } });
      }
      const svg = el.tagName.toLowerCase() === 'svg' ? el.outerHTML : obj.svg;
      const bytes = await svgToPng(svg, w, h, 4);
      return new D.ImageRun({ type: 'png', data: bytes, transformation: { width: Math.round(w), height: Math.round(h) } });
    }
    async function imgToPng(src){
      return new Promise(res => {
        const img = new Image(); img.onload = () => { const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
          c.getContext('2d').drawImage(img, 0, 0); res(dataUrlToBytes(c.toDataURL('image/png'))); }; img.src = src; });
    }

    /* ---- rich html -> paragraphs ---- */
    async function richBlocks(el, pOpts, prefixRuns){
      const out = []; let runs = prefixRuns ? prefixRuns.slice() : [];
      const flush = (force) => { if(runs.length || force){ out.push(P(runs, pOpts)); } runs = []; };
      async function walk(node, f){
        for(const ch of [...node.childNodes]){
          if(ch.nodeType === 3){ const tx = ch.textContent.replace(/ /g, ' '); if(tx) runs.push(TR(tx, f)); continue; }
          if(ch.nodeType !== 1) continue;
          if(ch.classList.contains('eobj')){
            const obj = ex.objects[ch.dataset.oid]; if(!obj) continue;
            if(obj.kind === 'table'){ flush(); out.push(await tableObjToDocxAsync(ch, { D, TR, P, allBorders, rtl })); out.push(P([])); continue; }
            const img = await objImage(ch, obj);
            if((obj.display || 'inline') === 'inline') runs.push(img);
            else { flush(); out.push(P([img], { alignment: ALIGN[obj.align || 'center'] || D.AlignmentType.CENTER })); }
            continue;
          }
          const tag = ch.tagName;
          if(tag === 'BR'){ flush(true); continue; }
          if(tag === 'DIV' || tag === 'P'){ flush(); await walk(ch, f); flush(); continue; }
          const nf = Object.assign({}, f);
          if(tag === 'B' || tag === 'STRONG') nf.bold = true;
          if(tag === 'I' || tag === 'EM') nf.italic = true;
          if(tag === 'U') nf.underline = true;
          if(tag === 'SUP') nf.sup = true;
          if(tag === 'SUB') nf.sub = true;
          await walk(ch, nf);
        }
      }
      await walk(el, {});
      flush();
      return out;
    }

    /* ---- header ---- */
    const h = ex.header;
    const hd = [];
    const tplId = (ex.tpl && ex.tpl.header) || 'classic';
    const cellP = (text, o) => P([TR(text, o)], { alignment: (o && o.align) || undefined, spacing: { after: 20 } });
    const twoCol = (a, b) => new D.Table({ width: { size: 100, type: D.WidthType.PERCENTAGE }, borders: noBorders,
      rows: [ new D.TableRow({ children: [ new D.TableCell({ children: a, borders: noBorders }), new D.TableCell({ children: b, borders: noBorders }) ] }) ] });
    const lbl = (k, v) => `${k} ${v || '..........'}`;
    if(tplId !== 'minimal' && tplId !== 'band'){
      hd.push(cellP(t('repLine1'), { bold: true, align: D.AlignmentType.CENTER }));
      hd.push(cellP(t('repLine2'), { align: D.AlignmentType.CENTER }));
    }
    if(tplId === 'table'){
      const C = (txt, o) => new D.TableCell({ children: [cellP(txt, o)], verticalAlign: D.VerticalAlign.CENTER });
      hd.push(new D.Table({ width: { size: 100, type: D.WidthType.PERCENTAGE }, borders: allBorders('333333'), rows: [
        new D.TableRow({ children: [ C(h.institution || '..........'), new D.TableCell({ rowSpan: 2, verticalAlign: D.VerticalAlign.CENTER, children: [cellP(h.title || '', { bold: true, size: baseSize + 8, align: D.AlignmentType.CENTER })] }), C(lbl(HL.year(), h.year)) ] }),
        new D.TableRow({ children: [ C(lbl(HL.grade(), h.grade)), C(lbl(HL.duration(), h.duration)) ] }),
        new D.TableRow({ children: [ new D.TableCell({ columnSpan: 3, children: [cellP(`${lbl(HL.subject(), h.subject)}     ${lbl(HL.teacher(), h.teacher)}`)] }) ] }),
      ] }));
    } else {
      if(tplId === 'official'){
        hd.push(twoCol(
          [cellP(lbl(HL.dir(), h.directorate)), cellP(h.institution || ''), cellP(lbl(HL.grade(), h.grade))],
          [cellP(lbl(HL.year(), h.year)), cellP(lbl(HL.subject(), h.subject)), cellP(lbl(HL.duration(), h.duration))]));
      } else if(tplId === 'minimal'){
        hd.push(cellP([h.institution, h.subject, h.grade, h.duration && (HL.duration() + ' ' + h.duration)].filter(Boolean).join('   |   '), { align: D.AlignmentType.CENTER }));
      } else {
        hd.push(twoCol([cellP(h.institution || '')], [cellP(lbl(HL.year(), h.year))]));
      }
      if(tplId === 'band'){
        hd.push(new D.Paragraph({ children: [TR(h.title || '', { bold: true, size: baseSize + 10, color: 'FFFFFF' })], alignment: D.AlignmentType.CENTER, bidirectional: rtl,
          shading: { type: D.ShadingType.CLEAR, fill: '1F6F63', color: 'auto' }, spacing: { before: 120, after: 120 } }));
      } else {
        hd.push(P([TR(h.title || '', { bold: true, size: baseSize + 10 })], { alignment: D.AlignmentType.CENTER, spacing: { before: 160, after: 100 } }));
      }
      if(tplId !== 'official' && tplId !== 'minimal'){
        hd.push(P([TR(`${lbl(HL.subject(), h.subject)}      ${lbl(HL.grade(), h.grade)}      ${lbl(HL.duration(), h.duration)}`)], { alignment: D.AlignmentType.CENTER }));
      }
      if(tplId === 'student'){
        hd.push(new D.Table({ width: { size: 100, type: D.WidthType.PERCENTAGE }, borders: allBorders('333333'), rows: [ new D.TableRow({ children: [
          new D.TableCell({ children: [cellP(HL.student() + ' ..............................')] }),
          new D.TableCell({ children: [cellP(HL.cls() + ' ..........')] }),
          new D.TableCell({ children: [cellP(`${HL.mark()} ....... / ${ex.maxPoints}`)] }) ] }) ] }));
      }
    }
    hd.push(new D.Paragraph({ children: [], border: { bottom: { style: D.BorderStyle.SINGLE, size: 8, color: '888888', space: 4 } }, spacing: { after: 200 } }));

    /* ---- questions ---- */
    const body = [];
    const qEls = host.querySelectorAll('.questions-static .question');
    const style = (ex.tpl && ex.tpl.style) || 'classic';
    for(let i = 0; i < ex.questions.length; i++){
      const q = ex.questions[i], qEl = qEls[i];
      const blocks = [];
      blocks.push(P([TR(questionLabel(i), { bold: true, size: baseSize + 4, underline: style === 'underline' }), TR(`   (${q.points} ${L('ن','pts','pts')})`, { size: baseSize - 2, color: '555555' })], { spacing: { after: 100 } }));
      blocks.push(...await richBlocks(qEl.querySelector('.rich[data-rich="text"]')));
      if(q.type === 'mcq'){
        const opts = qEl.querySelectorAll('.rich[data-rich="opt"]');
        for(const o of opts) blocks.push(...await richBlocks(o, { indent: rtl ? { right: 500 } : { left: 500 } }, [TR('☐  ')]));
      } else if(q.type === 'tf'){
        const rows = [ new D.TableRow({ tableHeader: true, children: [
          new D.TableCell({ children: [P([TR('')])], width: { size: 76, type: D.WidthType.PERCENTAGE } }),
          new D.TableCell({ children: [P([TR(t('trueLabel'), { bold: true })], { alignment: D.AlignmentType.CENTER })], width: { size: 12, type: D.WidthType.PERCENTAGE } }),
          new D.TableCell({ children: [P([TR(t('falseLabel'), { bold: true })], { alignment: D.AlignmentType.CENTER })], width: { size: 12, type: D.WidthType.PERCENTAGE } }) ] }) ];
        const sEls = qEl.querySelectorAll('.tf-row');
        for(let k = 0; k < q.statements.length; k++){
          const r = sEls[k] && sEls[k].querySelector('.rich');
          const content = r ? await richBlocks(r) : [P([TR(q.statements[k].text || '')])];
          rows.push(new D.TableRow({ children: [ new D.TableCell({ children: content.length ? content : [P([])] }), new D.TableCell({ children: [P([TR('')])] }), new D.TableCell({ children: [P([TR('')])] }) ] }));
        }
        blocks.push(new D.Table({ width: { size: 100, type: D.WidthType.PERCENTAGE }, borders: allBorders('777777'), rows }));
        blocks.push(P([]));
      } else if(q.type === 'table' && q.grid){
        const rows = q.grid.map(row => new D.TableRow({ children: row.filter(c => !c.merged).map(c =>
          new D.TableCell({ children: [P([TR(c.value || '')])], rowSpan: c.rowspan > 1 ? c.rowspan : undefined, columnSpan: c.colspan > 1 ? c.colspan : undefined })) }));
        blocks.push(new D.Table({ width: { size: 100, type: D.WidthType.PERCENTAGE }, borders: allBorders('555555'), rows }));
        blocks.push(P([]));
      }
      if(q.images && q.images.length){
        const imgs = [];
        for(const im of q.images){
          let bytes, type = 'png';
          if(/^data:image\/(jpeg|jpg)/.test(im.src)){ bytes = dataUrlToBytes(im.src); type = 'jpg'; }
          else if(/^data:image\/png/.test(im.src)) bytes = dataUrlToBytes(im.src);
          else bytes = await imgToPng(im.src);
          imgs.push(new D.ImageRun({ type, data: bytes, transformation: { width: Math.round(im.w), height: Math.round(im.h) } }));
          imgs.push(TR('   '));
        }
        blocks.push(P(imgs, { alignment: D.AlignmentType.CENTER }));
      }
      const framed = !q.frameOff && style !== 'compact';
      if(framed){
        body.push(new D.Table({ width: { size: 100, type: D.WidthType.PERCENTAGE }, borders: allBorders('AAAAAA'),
          rows: [ new D.TableRow({ cantSplit: false, children: [ new D.TableCell({ children: blocks, margins: { top: 100, bottom: 100, left: 140, right: 140 } }) ] }) ] }));
        body.push(P([], { spacing: { after: 120 } }));
      } else {
        body.push(...blocks);
        body.push(P([], { spacing: { after: 120 } }));
      }
    }

    const doc = new D.Document({
      creator: h.teacher || 'Exam Generator', title: h.title || 'Exam',
      styles: { default: { document: { run: { font: FONT, size: baseSize } } } },
      sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 680, bottom: 680, left: 720, right: 720 } } }, children: [...hd, ...body] }]
    });
    const blob = await D.Packer.toBlob(doc);
    const name = ((h.title || 'exam') + (h.subject ? ' - ' + h.subject : '')).replace(/[\\/:*?"<>|]+/g, ' ').trim() + '.docx';
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    window.__lastDocx = blob;
    busy.close();
    toast(L('تم تحميل ملف Word ✓','Word file downloaded ✓','Fichier Word téléchargé ✓'), 'ok');
  }catch(err){
    console.error(err);
    busy.close();
    toast(L('تعذّر إنشاء ملف Word: ','Could not create the Word file: ','Échec de création Word : ') + err.message, 'warn');
  }finally{
    if(host) host.remove();
  }
}
