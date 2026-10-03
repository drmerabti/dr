package com.sora2nas.app.core.export

import com.sora2nas.app.core.export.OoxmlUtil.XML_HEADER
import com.sora2nas.app.core.export.OoxmlUtil.esc
import com.sora2nas.app.core.table.TableData
import java.io.OutputStream

/**
 * Minimal, dependency-free .docx writer (WordprocessingML).
 * Paragraph direction is chosen per paragraph (Arabic -> right-to-left),
 * tables get borders, a bold header row, merges and RTL layout.
 */
object DocxWriter {

    sealed interface Block
    data class Paragraph(val text: String, val bold: Boolean = false, val sizePt: Int = 12) : Block
    data class Table(val data: TableData) : Block

    /** Plain text -> one paragraph per line (blank lines kept as empty paragraphs). */
    fun writeText(text: String, out: OutputStream, title: String? = null) {
        val blocks = mutableListOf<Block>()
        if (!title.isNullOrBlank()) blocks += Paragraph(title, bold = true, sizePt = 16)
        text.replace("\r\n", "\n").split('\n').forEach { blocks += Paragraph(it) }
        write(blocks, out)
    }

    fun write(blocks: List<Block>, out: OutputStream) {
        val body = StringBuilder()
        for (b in blocks) when (b) {
            is Paragraph -> body.append(paragraph(b.text, b.bold, b.sizePt))
            is Table -> body.append(table(b.data)).append(paragraph("", false, 6))
        }
        val document = XML_HEADER +
            """<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>""" +
            body +
            """<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr>""" +
            "</w:body></w:document>"
        OoxmlUtil.zip(
            out,
            listOf(
                "[Content_Types].xml" to CONTENT_TYPES,
                "_rels/.rels" to ROOT_RELS,
                "word/document.xml" to document,
                "word/_rels/document.xml.rels" to DOC_RELS,
                "word/styles.xml" to STYLES,
            ),
        )
    }

    private fun paragraph(text: String, bold: Boolean, sizePt: Int, centered: Boolean = false): String {
        val rtl = OoxmlUtil.startsRtl(text)
        val sb = StringBuilder("<w:p><w:pPr>")
        if (rtl) sb.append("<w:bidi/>")
        if (centered) sb.append("<w:jc w:val=\"center\"/>")
        sb.append("<w:spacing w:after=\"80\"/></w:pPr>")
        if (text.isNotEmpty()) {
            sb.append("<w:r><w:rPr><w:rFonts w:ascii=\"Arial\" w:hAnsi=\"Arial\" w:cs=\"Arial\"/>")
            if (bold) sb.append("<w:b/><w:bCs/>")
            if (rtl) sb.append("<w:rtl/>")
            sb.append("<w:sz w:val=\"${sizePt * 2}\"/><w:szCs w:val=\"${sizePt * 2}\"/></w:rPr>")
            sb.append("<w:t xml:space=\"preserve\">").append(esc(text)).append("</w:t></w:r>")
        }
        sb.append("</w:p>")
        return sb.toString()
    }

    private fun table(data: TableData): String {
        val t = data.normalized()
        if (t.colCount == 0) return ""
        val totalTwips = 9638 // page width minus margins
        val colW = totalTwips / t.colCount
        val border = "w:val=\"single\" w:sz=\"4\" w:space=\"0\" w:color=\"9AA5B1\""
        val sb = StringBuilder("<w:tbl><w:tblPr>")
        if (t.rightToLeft) sb.append("<w:bidiVisual/>")
        sb.append("<w:tblW w:w=\"5000\" w:type=\"pct\"/>")
        sb.append("<w:tblBorders><w:top $border/><w:left $border/><w:bottom $border/><w:right $border/><w:insideH $border/><w:insideV $border/></w:tblBorders>")
        sb.append("<w:tblLayout w:type=\"fixed\"/></w:tblPr><w:tblGrid>")
        repeat(t.colCount) { sb.append("<w:gridCol w:w=\"$colW\"/>") }
        sb.append("</w:tblGrid>")
        val mergeAt = t.merges.associateBy { it.row to it.col }
        t.cells.forEachIndexed { r, row ->
            sb.append("<w:tr>")
            var c = 0
            while (c < t.colCount) {
                val span = (mergeAt[r to c]?.colSpan ?: 1).coerceAtMost(t.colCount - c)
                sb.append("<w:tc><w:tcPr><w:tcW w:w=\"${colW * span}\" w:type=\"dxa\"/>")
                if (span > 1) sb.append("<w:gridSpan w:val=\"$span\"/>")
                if (r == 0) sb.append("<w:shd w:val=\"clear\" w:color=\"auto\" w:fill=\"E8EEFB\"/>")
                sb.append("</w:tcPr>")
                val lines = row[c].split('\n')
                lines.forEach { sb.append(paragraph(it, bold = r == 0, sizePt = 10)) }
                sb.append("</w:tc>")
                c += span
            }
            sb.append("</w:tr>")
        }
        sb.append("</w:tbl>")
        return sb.toString()
    }

    private const val CONTENT_TYPES = XML_HEADER +
        """<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">""" +
        """<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>""" +
        """<Default Extension="xml" ContentType="application/xml"/>""" +
        """<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>""" +
        """<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>""" +
        "</Types>"

    private const val ROOT_RELS = XML_HEADER +
        """<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>"""

    private const val DOC_RELS = XML_HEADER +
        """<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>"""

    private const val STYLES = XML_HEADER +
        """<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">""" +
        """<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" w:eastAsia="Arial"/>""" +
        """<w:sz w:val="24"/><w:szCs w:val="24"/><w:lang w:val="fr-FR" w:bidi="ar-DZ"/></w:rPr></w:rPrDefault>""" +
        """<w:pPrDefault><w:pPr><w:spacing w:after="80" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>""" +
        """<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>""" +
        "</w:styles>"
}
