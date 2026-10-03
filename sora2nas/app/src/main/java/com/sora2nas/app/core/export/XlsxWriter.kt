package com.sora2nas.app.core.export

import com.sora2nas.app.core.export.OoxmlUtil.XML_HEADER
import com.sora2nas.app.core.export.OoxmlUtil.esc
import com.sora2nas.app.core.table.TableData
import java.io.OutputStream

/**
 * Minimal, dependency-free .xlsx writer (SpreadsheetML). Much lighter than
 * Apache POI on Android. Supports several sheets, bordered/wrapped cells, a
 * bold first row, numeric cells, horizontal merges, column widths and
 * right-to-left sheets for Arabic tables.
 */
object XlsxWriter {

    private val NUMBER = Regex("""^-?(0|[1-9]\d{0,14})([.,]\d{1,10})?$""")

    fun write(sheets: List<Pair<String, TableData>>, out: OutputStream) {
        require(sheets.isNotEmpty()) { "at least one sheet" }
        val entries = mutableListOf<Pair<String, String>>()
        entries += "[Content_Types].xml" to contentTypes(sheets.size)
        entries += "_rels/.rels" to ROOT_RELS
        entries += "xl/workbook.xml" to workbook(sheets.map { it.first })
        entries += "xl/_rels/workbook.xml.rels" to workbookRels(sheets.size)
        entries += "xl/styles.xml" to STYLES
        sheets.forEachIndexed { i, (_, table) -> entries += "xl/worksheets/sheet${i + 1}.xml" to sheet(table) }
        OoxmlUtil.zip(out, entries)
    }

    /** "A", "B", ... "Z", "AA", ... */
    fun columnName(index: Int): String {
        var n = index + 1
        val sb = StringBuilder()
        while (n > 0) {
            val rem = (n - 1) % 26
            sb.append('A' + rem)
            n = (n - 1) / 26
        }
        return sb.reverse().toString()
    }

    fun safeSheetName(name: String, index: Int): String {
        val cleaned = name.replace(Regex("""[\[\]:*?/\\]"""), " ").trim().take(31)
        return cleaned.ifEmpty { "Sheet${index + 1}" }
    }

    private fun sheet(table: TableData): String {
        val t = table.normalized()
        val sb = StringBuilder(XML_HEADER)
        sb.append("""<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">""")
        sb.append("<sheetViews><sheetView workbookViewId=\"0\"")
        if (t.rightToLeft) sb.append(" rightToLeft=\"1\"")
        sb.append("/></sheetViews>")
        if (t.colCount > 0) {
            sb.append("<cols>")
            for (c in 0 until t.colCount) {
                val maxLen = t.cells.maxOfOrNull { it[c].lines().maxOfOrNull { l -> l.length } ?: 0 } ?: 0
                val width = (maxLen * 1.15 + 2).coerceIn(8.0, 60.0)
                sb.append("<col min=\"${c + 1}\" max=\"${c + 1}\" width=\"${"%.1f".format(java.util.Locale.US, width)}\" customWidth=\"1\"/>")
            }
            sb.append("</cols>")
        }
        sb.append("<sheetData>")
        t.cells.forEachIndexed { r, row ->
            sb.append("<row r=\"${r + 1}\">")
            row.forEachIndexed { c, value ->
                val ref = "${columnName(c)}${r + 1}"
                val style = if (r == 0) 2 else 1
                val v = value.trim()
                if (v.isEmpty()) {
                    sb.append("<c r=\"$ref\" s=\"$style\"/>")
                } else if (r > 0 && NUMBER.matches(v)) {
                    sb.append("<c r=\"$ref\" s=\"3\"><v>${v.replace(',', '.')}</v></c>")
                } else {
                    sb.append("<c r=\"$ref\" s=\"$style\" t=\"inlineStr\"><is><t xml:space=\"preserve\">${esc(v)}</t></is></c>")
                }
            }
            sb.append("</row>")
        }
        sb.append("</sheetData>")
        val merges = t.merges.filter { it.colSpan > 1 && it.row < t.rowCount && it.col + it.colSpan <= t.colCount }
        if (merges.isNotEmpty()) {
            sb.append("<mergeCells count=\"${merges.size}\">")
            for (m in merges) {
                sb.append("<mergeCell ref=\"${columnName(m.col)}${m.row + 1}:${columnName(m.col + m.colSpan - 1)}${m.row + 1}\"/>")
            }
            sb.append("</mergeCells>")
        }
        sb.append("</worksheet>")
        return sb.toString()
    }

    private fun contentTypes(n: Int) = buildString {
        append(XML_HEADER)
        append("""<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">""")
        append("""<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>""")
        append("""<Default Extension="xml" ContentType="application/xml"/>""")
        append("""<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>""")
        append("""<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>""")
        for (i in 1..n) append("""<Override PartName="/xl/worksheets/sheet$i.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>""")
        append("</Types>")
    }

    private fun workbook(names: List<String>) = buildString {
        append(XML_HEADER)
        append("""<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>""")
        val used = HashSet<String>()
        names.forEachIndexed { i, n ->
            var name = safeSheetName(n, i)
            if (!used.add(name.lowercase())) { name = "${name.take(27)} (${i + 1})"; used += name.lowercase() }
            append("<sheet name=\"${esc(name)}\" sheetId=\"${i + 1}\" r:id=\"rId${i + 1}\"/>")
        }
        append("</sheets></workbook>")
    }

    private fun workbookRels(n: Int) = buildString {
        append(XML_HEADER)
        append("""<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">""")
        for (i in 1..n) append("""<Relationship Id="rId$i" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet$i.xml"/>""")
        append("""<Relationship Id="rId${n + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>""")
        append("</Relationships>")
    }

    private const val ROOT_RELS = XML_HEADER +
        """<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>"""

    // Styles: 0 default, 1 bordered+wrapped text, 2 bold header, 3 bordered number.
    private const val STYLES = XML_HEADER +
        """<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">""" +
        """<fonts count="2"><font><sz val="11"/><name val="Arial"/></font><font><b/><sz val="11"/><name val="Arial"/></font></fonts>""" +
        """<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>""" +
        """<fill><patternFill patternType="solid"><fgColor rgb="FFE8EEFB"/><bgColor indexed="64"/></patternFill></fill></fills>""" +
        """<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border>""" +
        """<border><left style="thin"><color rgb="FF9AA5B1"/></left><right style="thin"><color rgb="FF9AA5B1"/></right>""" +
        """<top style="thin"><color rgb="FF9AA5B1"/></top><bottom style="thin"><color rgb="FF9AA5B1"/></bottom><diagonal/></border></borders>""" +
        """<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>""" +
        """<cellXfs count="4"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>""" +
        """<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>""" +
        """<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>""" +
        """<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1"/></cellXfs>""" +
        """<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>"""
}
