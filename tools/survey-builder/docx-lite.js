/* =====================================================================
   docx-lite: مولّد ملفات Word (.docx) حقيقية داخل المتصفح بدون مكتبات خارجية
   يدعم: فقرات عربية (RTL)، عناوين، جداول، صور PNG، فاصل صفحات.
===================================================================== */
(function(){
  // ---------- ZIP (بدون ضغط) ----------
  const CRC_TABLE = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++){ let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  function crc32(bytes){ let c = 0xFFFFFFFF; for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  const enc = new TextEncoder();
  function zip(files){ // files: [{name, data(Uint8Array|string)}]
    const parts = [], central = []; let offset = 0;
    files.forEach(f => {
      const name = enc.encode(f.name);
      const data = typeof f.data === 'string' ? enc.encode(f.data) : f.data;
      const crc = crc32(data);
      const lh = new DataView(new ArrayBuffer(30));
      lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true); lh.setUint16(8, 0, true);
      lh.setUint16(10, 0, true); lh.setUint16(12, 0x21, true); lh.setUint32(14, crc, true);
      lh.setUint32(18, data.length, true); lh.setUint32(22, data.length, true); lh.setUint16(26, name.length, true); lh.setUint16(28, 0, true);
      parts.push(new Uint8Array(lh.buffer), name, data);
      const ch = new DataView(new ArrayBuffer(46));
      ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true); ch.setUint16(10, 0, true);
      ch.setUint16(12, 0, true); ch.setUint16(14, 0x21, true); ch.setUint32(16, crc, true); ch.setUint32(20, data.length, true); ch.setUint32(24, data.length, true);
      ch.setUint16(28, name.length, true); ch.setUint32(42, offset, true);
      central.push(new Uint8Array(ch.buffer), name);
      offset += 30 + name.length + data.length;
    });
    const cdSize = central.reduce((s, a) => s + a.length, 0);
    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true);
    end.setUint32(12, cdSize, true); end.setUint32(16, offset, true);
    return new Blob([...parts, ...central, new Uint8Array(end.buffer)], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  }

  // ---------- عناصر المستند ----------
  const x = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const FONT = 'Arial';
  function run(text, o = {}){
    const sz = Math.round((o.size || 11) * 2);
    return `<w:r><w:rPr><w:rFonts w:ascii="${FONT}" w:hAnsi="${FONT}" w:cs="${FONT}"/>${o.bold ? '<w:b/><w:bCs/>' : ''}${o.color ? `<w:color w:val="${o.color.replace('#','')}"/>` : ''}<w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/><w:rtl/></w:rPr><w:t xml:space="preserve">${x(text)}</w:t></w:r>`;
  }
  function para(content, o = {}){
    const runs = Array.isArray(content) ? content.map(c => typeof c === 'string' ? run(c, o) : run(c.text, { ...o, ...c })).join('') : run(content, o);
    const shd = o.shade ? `<w:shd w:val="clear" w:color="auto" w:fill="${o.shade.replace('#','')}"/>` : '';
    const border = o.borderStart ? `<w:pBdr><w:right w:val="single" w:sz="24" w:space="8" w:color="${o.borderStart.replace('#','')}"/></w:pBdr>` : '';
    return `<w:p><w:pPr>${o.keepNext ? '<w:keepNext/>' : ''}${border}${shd}<w:bidi/><w:spacing w:before="${o.before ?? 0}" w:after="${o.after ?? 120}" w:line="${o.line || 300}" w:lineRule="auto"/>${o.center ? '<w:jc w:val="center"/>' : ''}${o.indent ? `<w:ind w:right="${o.indent}"/>` : ''}</w:pPr>${runs}</w:p>`;
  }

  class Doc {
    constructor(){ this.body = []; this.images = []; }
    title(t){ this.body.push(para(t, { size: 20, bold: true, color: '#2F5770', center: true, after: 120 })); }
    h1(t){ this.body.push(para(t, { size: 15, bold: true, color: '#2F5770', before: 280, after: 120, keepNext: true })); }
    h2(t){ this.body.push(para(t, { size: 12.5, bold: true, color: '#1E2F40', before: 220, after: 80, keepNext: true })); }
    p(t, o){ this.body.push(para(t, o)); }
    note(lines, color = '#2F5770'){ lines.forEach((l, i) => this.body.push(para(l, { size: 10.5, shade: '#EEF4F8', borderStart: color, after: i === lines.length - 1 ? 160 : 0, indent: 0 }))); }
    bullets(items){ items.forEach(t => this.body.push(para('• ' + t, { size: 10.5, after: 40, indent: 200 }))); }
    pageBreak(){ this.body.push('<w:p><w:r><w:br w:type="page"/></w:r></w:p>'); }
    table(rows, o = {}){ // rows: مصفوفة صفوف، الصف الأول عنوان إن كان o.header
      const cols = Math.max(...rows.map(r => r.length));
      const total = 9000, w = o.widths || Array(cols).fill(Math.floor(total / cols));
      const border = `<w:top w:val="single" w:sz="4" w:color="B8C7D3"/><w:bottom w:val="single" w:sz="4" w:color="B8C7D3"/><w:left w:val="single" w:sz="4" w:color="B8C7D3"/><w:right w:val="single" w:sz="4" w:color="B8C7D3"/><w:insideH w:val="single" w:sz="4" w:color="B8C7D3"/><w:insideV w:val="single" w:sz="4" w:color="B8C7D3"/>`;
      let xml = `<w:tbl><w:tblPr><w:bidiVisual/><w:tblW w:w="${total}" w:type="dxa"/><w:jc w:val="center"/><w:tblBorders>${border}</w:tblBorders><w:tblCellMar><w:top w:w="60" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${w.map(v => `<w:gridCol w:w="${v}"/>`).join('')}</w:tblGrid>`;
      rows.forEach((r, ri) => {
        const head = o.header && ri === 0;
        xml += `<w:tr>${head ? '<w:trPr><w:tblHeader/></w:trPr>' : ''}`;
        for (let ci = 0; ci < cols; ci++){
          const v = r[ci] ?? '';
          const firstCol = o.firstColLabel && ci === 0 && !head;
          const fill = head ? '2F5770' : (firstCol ? 'F2F6F9' : (ri % 2 === 0 && o.zebra ? 'F9FBFC' : 'FFFFFF'));
          xml += `<w:tc><w:tcPr><w:tcW w:w="${w[ci]}" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="${fill}"/><w:vAlign w:val="center"/></w:tcPr>${para(String(v), { size: o.size || 10, bold: head || firstCol, color: head ? '#FFFFFF' : '#1E2F40', center: head || !(firstCol || (o.alignStartCols || []).includes(ci)), after: 0, line: 260 })}</w:tc>`;
        }
        xml += `</w:tr>`;
      });
      xml += `</w:tbl>`;
      this.body.push(xml);
      this.body.push(para('', { after: 100 }));
    }
    image(pngBytes, widthPx, heightPx, maxWidthCm = 15){
      const id = this.images.length + 1;
      this.images.push(pngBytes);
      const emuPerPx = 9525;
      let cx = widthPx * emuPerPx, cy = heightPx * emuPerPx;
      const maxCx = maxWidthCm * 360000;
      if (cx > maxCx){ cy = Math.round(cy * maxCx / cx); cx = maxCx; }
      this.body.push(`<w:p><w:pPr><w:bidi/><w:jc w:val="center"/><w:spacing w:after="120"/></w:pPr><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${id}" name="chart${id}"/><wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="${id}" name="chart${id}.png"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rIdImg${id}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`);
    }
    toBlob(){
      const document_xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:body>${this.body.join('')}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1300" w:right="1300" w:bottom="1300" w:left="1300" w:header="600" w:footer="600" w:gutter="0"/><w:bidi/></w:sectPr></w:body></w:document>`;
      const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="${FONT}" w:hAnsi="${FONT}" w:cs="${FONT}" w:eastAsia="${FONT}"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="ar-SA" w:bidi="ar-SA"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:bidi/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style></w:styles>`;
      const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>${this.images.map((_, i) => `<Relationship Id="rIdImg${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image${i+1}.png"/>`).join('')}</Relationships>`;
      const ct = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>`;
      const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
      return zip([
        { name: '[Content_Types].xml', data: ct },
        { name: '_rels/.rels', data: rootRels },
        { name: 'word/document.xml', data: document_xml },
        { name: 'word/styles.xml', data: styles },
        { name: 'word/_rels/document.xml.rels', data: rels },
        ...this.images.map((b, i) => ({ name: `word/media/image${i+1}.png`, data: b })),
      ]);
    }
  }
  window.DocxLite = { Doc };
})();
