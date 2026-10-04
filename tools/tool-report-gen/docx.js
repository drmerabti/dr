// ============================================================
// docx.js — dependency-free Word (.docx) export for the report.
// Builds the OOXML parts by hand and packs them in a (stored) ZIP.
// Supports RTL (Arabic), headings, bullets, callouts, images, tables,
// header/footer with page numbers and a table of contents field.
// ============================================================

(function () {
  "use strict";

  /* ---------- ZIP (store, no compression) ---------- */
  const CRC_TABLE = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
    return t;
  })();
  function crc32(buf) {
    let c = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }
  function zip(files) {
    const enc = new TextEncoder();
    const parts = [], central = [];
    let offset = 0;
    const d = new Date();
    const time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
    const date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
    files.forEach((f) => {
      const name = enc.encode(f.name);
      const data = typeof f.data === "string" ? enc.encode(f.data) : f.data;
      const crc = crc32(data);
      const lh = new DataView(new ArrayBuffer(30));
      lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true); lh.setUint16(8, 0, true);
      lh.setUint16(10, time, true); lh.setUint16(12, date, true); lh.setUint32(14, crc, true);
      lh.setUint32(18, data.length, true); lh.setUint32(22, data.length, true); lh.setUint16(26, name.length, true); lh.setUint16(28, 0, true);
      parts.push(new Uint8Array(lh.buffer), name, data);
      const ch = new DataView(new ArrayBuffer(46));
      ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true); ch.setUint16(10, 0, true);
      ch.setUint16(12, time, true); ch.setUint16(14, date, true); ch.setUint32(16, crc, true); ch.setUint32(20, data.length, true); ch.setUint32(24, data.length, true);
      ch.setUint16(28, name.length, true); ch.setUint16(30, 0, true); ch.setUint16(32, 0, true); ch.setUint16(34, 0, true); ch.setUint16(36, 0, true);
      ch.setUint32(38, 0, true); ch.setUint32(42, offset, true);
      central.push(new Uint8Array(ch.buffer), name);
      offset += 30 + name.length + data.length;
    });
    const cdSize = central.reduce((n, p) => n + p.length, 0);
    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true);
    end.setUint32(12, cdSize, true); end.setUint32(16, offset, true);
    return new Blob([...parts, ...central, new Uint8Array(end.buffer)], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  }

  /* ---------- helpers ---------- */
  const x = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
  const hex = (c) => String(c || "#1F3A5F").replace("#", "").toUpperCase();
  function mix(c, other, w) {
    const p = (h) => { h = h.replace("#", ""); return [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16)); };
    const a = p(c), b = p(other);
    return a.map((v, i) => Math.round(v * w + b[i] * (1 - w)).toString(16).padStart(2, "0")).join("").toUpperCase();
  }
  const firstFamily = (stack, i) => {
    const fams = String(stack || "").split(",").map((f) => f.trim().replace(/^['"]|['"]$/g, "")).filter((f) => f && !/^(serif|sans-serif|monospace)$/.test(f));
    return fams[Math.min(i, fams.length - 1)] || "Arial";
  };

  // Converts any data URL to PNG/JPEG bytes and reads its pixel size.
  function loadImage(dataUrl) {
    return new Promise((resolve) => {
      if (!dataUrl) { resolve(null); return; }
      const im = new Image();
      im.onload = () => {
        let w = im.naturalWidth || 400, h = im.naturalHeight || 300;
        const m = /^data:image\/(png|jpeg|jpg);base64,(.*)$/i.exec(dataUrl);
        if (m) {
          const bin = atob(m[2]);
          const bytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
          resolve({ bytes, ext: /png/i.test(m[1]) ? "png" : "jpeg", w, h });
          return;
        }
        if (!w || !h) { w = 600; h = 400; }
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        c.getContext("2d").drawImage(im, 0, 0, w, h);
        const b64 = c.toDataURL("image/png").split(",")[1];
        const bin = atob(b64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        resolve({ bytes, ext: "png", w, h });
      };
      im.onerror = () => resolve(null);
      im.src = dataUrl;
    });
  }

  window.buildReportDocx = async function (m) {
    const rtl = !!m.rtl;
    const AC = hex(m.color), AC_SOFT = mix(m.color, "#ffffff", 0.12), AC_DARK = mix(m.color, "#000000", 0.62);
    const headLatin = firstFamily(m.font.head, 0), headCs = firstFamily(m.font.head, 1);
    const bodyLatin = firstFamily(m.font.body, 0), bodyCs = firstFamily(m.font.body, 1);

    const media = [];
    let docPrId = 1;
    async function addImage(url) {
      const img = await loadImage(url);
      if (!img) return null;
      const n = media.length + 1;
      media.push({ name: `image${n}.${img.ext}`, bytes: img.bytes, rid: `rIdImg${n}`, ext: img.ext });
      return { rid: `rIdImg${n}`, w: img.w, h: img.h };
    }
    function drawing(im, maxW, maxH) {
      const k = Math.min(1, maxW / im.w, maxH / im.h);
      const cx = Math.round(im.w * k * 9525), cy = Math.round(im.h * k * 9525);
      const id = docPrId++;
      return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${id}" name="Picture ${id}"/><wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="${id}" name="img${id}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${im.rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
    }

    const rPrRtl = rtl ? "<w:rtl/>" : "";
    const pPrBidi = rtl ? "<w:bidi/>" : "";
    function run(text, opts) {
      opts = opts || {};
      const props = [
        opts.font ? `<w:rFonts w:ascii="${x(opts.font[0])}" w:hAnsi="${x(opts.font[0])}" w:cs="${x(opts.font[1])}"/>` : "",
        opts.b ? "<w:b/><w:bCs/>" : "", opts.i ? "<w:i/><w:iCs/>" : "",
        opts.color ? `<w:color w:val="${opts.color}"/>` : "",
        opts.sz ? `<w:sz w:val="${opts.sz}"/><w:szCs w:val="${opts.sz}"/>` : "",
        rPrRtl,
      ].join("");
      const lines = String(text == null ? "" : text).split("\n");
      return lines.map((l, i) => `<w:r>${props ? `<w:rPr>${props}</w:rPr>` : ""}${i ? "<w:br/>" : ""}<w:t xml:space="preserve">${x(l)}</w:t></w:r>`).join("");
    }
    function para(inner, o) {
      o = o || {};
      const ppr = [
        o.style ? `<w:pStyle w:val="${o.style}"/>` : "",
        o.keepNext ? "<w:keepNext/>" : "",
        o.pageBreakBefore ? "<w:pageBreakBefore/>" : "",
        o.num ? `<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>` : "",
        o.border ? `<w:pBdr><w:bottom w:val="single" w:sz="${o.border}" w:space="4" w:color="${o.borderColor || AC}"/></w:pBdr>` : "",
        pPrBidi, // schema order: pBdr, bidi, spacing, jc (Word rejects other orders)
        o.spacing ? `<w:spacing ${o.spacing}/>` : "",
        o.jc ? `<w:jc w:val="${o.jc}"/>` : "",
      ].join("");
      return `<w:p>${ppr ? `<w:pPr>${ppr}</w:pPr>` : ""}${inner}</w:p>`;
    }
    const pageBreak = () => `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;

    function blocks(list) {
      return (list || []).map((b) => {
        if (b.t === "li") return para(run(b.text), { style: "ListParagraph", num: true });
        if (b.t === "q") return para(run(b.text), { style: "Callout" });
        return para(run(b.text), { jc: "both" });
      }).join("");
    }
    function table(rows) {
      const cols = Math.max(...rows.map((r) => r.length));
      const W = 9300, cw = Math.floor(W / cols);
      const border = (c) => `<w:top w:val="single" w:sz="4" w:color="${c}"/><w:left w:val="single" w:sz="4" w:color="${c}"/><w:bottom w:val="single" w:sz="4" w:color="${c}"/><w:right w:val="single" w:sz="4" w:color="${c}"/><w:insideH w:val="single" w:sz="4" w:color="${c}"/><w:insideV w:val="single" w:sz="4" w:color="${c}"/>`;
      const trs = rows.map((r, ri) => {
        const head = ri === 0;
        const fill = head ? AC : (ri % 2 === 0 ? "F6F8FA" : "FFFFFF");
        const cells = Array.from({ length: cols }, (_, ci) => `<w:tc><w:tcPr><w:tcW w:w="${cw}" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="${fill}"/></w:tcPr>${para(run(r[ci] || "", head ? { b: true, color: "FFFFFF" } : {}), { spacing: 'w:before="40" w:after="40"' })}</w:tc>`).join("");
        return `<w:tr>${head ? "<w:trPr><w:tblHeader/></w:trPr>" : ""}${cells}</w:tr>`;
      }).join("");
      return `<w:tbl><w:tblPr>${rtl ? "<w:bidiVisual/>" : ""}<w:tblW w:w="${W}" w:type="dxa"/><w:tblBorders>${border("D0D7DE")}</w:tblBorders><w:tblCellMar><w:left w:w="100" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${Array.from({ length: cols }, () => `<w:gridCol w:w="${cw}"/>`).join("")}</w:tblGrid>${trs}</w:tbl>${para("")}`;
    }
    const heading = (text, o) => para(run(text), Object.assign({ style: "Heading1" }, o || {}));

    /* ---------- body ---------- */
    let body = "";

    // cover
    const logo = m.logo ? await addImage(m.logo) : null;
    body += para("", { spacing: 'w:before="600"' });
    if (logo) body += para(drawing(logo, 180, 130), { jc: "center" });
    body += para("", { spacing: 'w:before="900"' });
    if (m.org) body += para(run(m.org, { b: true, color: AC, sz: 30, font: [headLatin, headCs] }), { jc: "center", spacing: 'w:after="240"' });
    body += para(run(m.title, { b: true, color: AC_DARK, sz: 56, font: [headLatin, headCs] }), { jc: "center", border: 24, spacing: 'w:after="600"' });
    const meta = [[m.L.preparedBy, m.by], [m.L.preparedFor, m.for], [m.L.date, m.date], [m.L.reference, m.ref]].filter((r) => r[1]);
    meta.forEach((r) => { body += para(run(r[0] + ": ", { color: "6B7280" }) + run(r[1], { b: true }), { jc: "center", spacing: 'w:after="80"' }); });
    body += pageBreak();

    // table of contents (a real Word field: Word fills the page numbers when the file is opened)
    const tocEntries = [];
    if (m.summary.length) tocEntries.push(m.L.summary);
    m.sections.forEach((s, i) => tocEntries.push(`${i + 1}. ${s.title}`));
    if (m.results.length) tocEntries.push(m.L.results);
    if (m.signatures.length) tocEntries.push(m.L.signatures);
    m.appendices.forEach((a) => tocEntries.push(`${a.label}${a.title ? " — " + a.title : ""}`));
    body += para(run(m.L.toc), { style: "TOCHeading" });
    body += `<w:p><w:pPr>${pPrBidi}</w:pPr><w:r><w:fldChar w:fldCharType="begin" w:dirty="true"/></w:r><w:r><w:instrText xml:space="preserve"> TOC \\o "1-1" \\h \\z \\u </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r></w:p>`;
    tocEntries.forEach((e) => { body += para(run(e), { style: "TOC1" }); });
    body += `<w:p><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>`;
    body += pageBreak();

    if (m.summary.length) { body += heading(m.L.summary); body += blocks(m.summary); }
    for (let i = 0; i < m.sections.length; i++) {
      const s = m.sections[i];
      body += heading(`${i + 1}. ${s.title}`);
      body += blocks(s.blocks);
      if (s.image) {
        const im = await addImage(s.image);
        if (im) {
          body += para(drawing(im, 600, 700), { jc: "center", keepNext: !!s.caption });
          if (s.caption) body += para(run(s.caption, { i: true, color: "6B7280", sz: 18 }), { jc: "center" });
        }
      }
      if (s.table && s.table.rows && s.table.rows.length) body += table(s.table.rows);
    }
    if (m.results.length) { body += heading(m.L.results); body += blocks(m.results); }
    if (m.signatures.length) {
      body += heading(m.L.signatures);
      const cells = [];
      for (const sg of m.signatures) {
        const im = sg.sig ? await addImage(sg.sig) : null;
        cells.push(`<w:tc><w:tcPr><w:tcW w:w="4650" w:type="dxa"/></w:tcPr>${para(im ? drawing(im, 200, 90) : "", { jc: "center", spacing: 'w:before="240"' })}${para(run(sg.name || "", { b: true }), { jc: "center", border: 8, borderColor: "1F2933" })}${para(run(sg.role || "", { color: "6B7280" }), { jc: "center" })}</w:tc>`);
      }
      let rows = "";
      for (let i = 0; i < cells.length; i += 2) rows += `<w:tr>${cells[i]}${cells[i + 1] || `<w:tc><w:tcPr><w:tcW w:w="4650" w:type="dxa"/></w:tcPr>${para("")}</w:tc>`}</w:tr>`;
      body += `<w:tbl><w:tblPr>${rtl ? "<w:bidiVisual/>" : ""}<w:tblW w:w="9300" w:type="dxa"/><w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders></w:tblPr><w:tblGrid><w:gridCol w:w="4650"/><w:gridCol w:w="4650"/></w:tblGrid>${rows}</w:tbl>${para("")}`;
    }
    for (let i = 0; i < m.appendices.length; i++) {
      const a = m.appendices[i];
      body += heading(`${a.label}${a.title ? " — " + a.title : ""}`, { pageBreakBefore: i === 0 });
      body += blocks(a.blocks);
      if (a.image) { const im = await addImage(a.image); if (im) body += para(drawing(im, 600, 760), { jc: "center" }); }
    }

    const sect = `<w:sectPr><w:headerReference w:type="default" r:id="rIdHeader"/><w:footerReference w:type="default" r:id="rIdFooter"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1300" w:right="1300" w:bottom="1300" w:left="1300" w:header="600" w:footer="600" w:gutter="0"/><w:titlePg/>${rtl ? "<w:bidi/>" : ""}</w:sectPr>`;
    const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';
    const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ${NS}><w:body>${body}${sect}</w:body></w:document>`;

    const headerXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr ${NS}>${para(run([m.org, m.title].filter(Boolean).join("  —  "), { color: "6B7280", sz: 16 }), { border: 6 })}</w:hdr>`;
    const footerXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr ${NS}><w:p><w:pPr>${pPrBidi}<w:jc w:val="center"/></w:pPr>${run(m.L.page + " ", { color: AC, sz: 18 })}<w:fldSimple w:instr=" PAGE "><w:r><w:rPr><w:color w:val="${AC}"/><w:sz w:val="18"/></w:rPr><w:t>1</w:t></w:r></w:fldSimple>${run(" / ", { color: AC, sz: 18 })}<w:fldSimple w:instr=" NUMPAGES "><w:r><w:rPr><w:color w:val="${AC}"/><w:sz w:val="18"/></w:rPr><w:t>1</w:t></w:r></w:fldSimple></w:p></w:ftr>`;

    const lang = rtl ? `<w:lang w:val="ar-DZ" w:bidi="ar-DZ"/>` : `<w:lang w:val="${m.lang === "fr" ? "fr-FR" : "en-US"}" w:bidi="ar-DZ"/>`;
    const hFont = `<w:rFonts w:ascii="${x(headLatin)}" w:hAnsi="${x(headLatin)}" w:cs="${x(headCs)}"/>`;
    const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="${x(bodyLatin)}" w:hAnsi="${x(bodyLatin)}" w:cs="${x(bodyCs)}" w:eastAsia="${x(bodyLatin)}"/><w:color w:val="1F2933"/><w:sz w:val="22"/><w:szCs w:val="24"/>${lang}</w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="140" w:line="312" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:keepLines/><w:pBdr><w:bottom w:val="single" w:sz="8" w:space="4" w:color="${AC}"/></w:pBdr><w:spacing w:before="420" w:after="180"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr>${hFont}<w:b/><w:bCs/><w:color w:val="${AC_DARK}"/><w:sz w:val="32"/><w:szCs w:val="34"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="TOCHeading"><w:name w:val="TOC Heading"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:pPr><w:spacing w:after="240"/></w:pPr><w:rPr>${hFont}<w:b/><w:bCs/><w:color w:val="${AC_DARK}"/><w:sz w:val="32"/><w:szCs w:val="34"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="TOC1"><w:name w:val="toc 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:uiPriority w:val="39"/><w:pPr><w:tabs><w:tab w:val="right" w:leader="dot" w:pos="9300"/></w:tabs><w:spacing w:after="100"/></w:pPr><w:rPr><w:sz w:val="24"/><w:szCs w:val="26"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="ListParagraph"><w:name w:val="List Paragraph"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="80"/><w:ind w:left="720" w:hanging="360"/></w:pPr></w:style>
<w:style w:type="paragraph" w:styleId="Callout"><w:name w:val="Callout"/><w:basedOn w:val="Normal"/><w:pPr><w:pBdr><w:left w:val="single" w:sz="24" w:space="8" w:color="${AC}"/></w:pBdr><w:shd w:val="clear" w:color="auto" w:fill="${AC_SOFT}"/><w:spacing w:before="120" w:after="200"/><w:ind w:left="200" w:right="200"/></w:pPr><w:rPr><w:color w:val="${AC_DARK}"/></w:rPr></w:style>
</w:styles>`;

    const numberingXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="singleLevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr><w:rPr><w:color w:val="${AC}"/></w:rPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`;
    const settingsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:defaultTabStop w:val="720"/><w:updateFields w:val="true"/><w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat></w:settings>`;
    const now = new Date().toISOString().replace(/\.\d+Z$/, "Z");
    const coreXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${x(m.title)}</dc:title><dc:creator>${x(m.by || m.org || "")}</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified></cp:coreProperties>`;
    const appXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Merabti Academy — Report Generator</Application></Properties>`;
    const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Default Extension="jpeg" ContentType="image/jpeg"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`;
    const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`;
    const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rIdSettings" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/><Relationship Id="rIdNumbering" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/><Relationship Id="rIdHeader" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/><Relationship Id="rIdFooter" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>${media.map((f) => `<Relationship Id="${f.rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${f.name}"/>`).join("")}</Relationships>`;

    return zip([
      { name: "[Content_Types].xml", data: contentTypes },
      { name: "_rels/.rels", data: rootRels },
      { name: "docProps/core.xml", data: coreXml },
      { name: "docProps/app.xml", data: appXml },
      { name: "word/document.xml", data: documentXml },
      { name: "word/styles.xml", data: stylesXml },
      { name: "word/settings.xml", data: settingsXml },
      { name: "word/numbering.xml", data: numberingXml },
      { name: "word/header1.xml", data: headerXml },
      { name: "word/footer1.xml", data: footerXml },
      { name: "word/_rels/document.xml.rels", data: docRels },
      ...media.map((f) => ({ name: "word/media/" + f.name, data: f.bytes })),
    ]);
  };
})();
