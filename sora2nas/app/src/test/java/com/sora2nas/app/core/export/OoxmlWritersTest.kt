package com.sora2nas.app.core.export

import com.sora2nas.app.core.table.CellMerge
import com.sora2nas.app.core.table.TableData
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.util.zip.ZipInputStream
import javax.xml.parsers.DocumentBuilderFactory

class OoxmlWritersTest {

    private fun unzip(bytes: ByteArray): Map<String, String> {
        val out = LinkedHashMap<String, String>()
        ZipInputStream(ByteArrayInputStream(bytes)).use { z ->
            while (true) {
                val e = z.nextEntry ?: break
                out[e.name] = z.readBytes().toString(Charsets.UTF_8)
            }
        }
        return out
    }

    private fun assertWellFormed(xml: String) {
        DocumentBuilderFactory.newInstance().apply { isNamespaceAware = true }.newDocumentBuilder()
            .parse(ByteArrayInputStream(xml.toByteArray()))
    }

    private val table = TableData(
        listOf(listOf("Produit", "Qté", "Prix"), listOf("Ciment <CEM II>", "120", "12,5"), listOf("Total & taxes", "", "007")),
        merges = listOf(CellMerge(2, 0, 2)),
    )

    @Test
    fun `xlsx has all parts and valid xml`() {
        val bos = ByteArrayOutputStream()
        XlsxWriter.write(listOf("Page 1" to table, "Page:2" to TableData(listOf(listOf("x")), rightToLeft = true)), bos)
        val parts = unzip(bos.toByteArray())
        for (name in listOf("[Content_Types].xml", "_rels/.rels", "xl/workbook.xml", "xl/_rels/workbook.xml.rels", "xl/styles.xml", "xl/worksheets/sheet1.xml", "xl/worksheets/sheet2.xml")) {
            assertTrue("missing $name", parts.containsKey(name))
            assertWellFormed(parts.getValue(name))
        }
        val s1 = parts.getValue("xl/worksheets/sheet1.xml")
        assertTrue(s1.contains("Ciment &lt;CEM II&gt;"))
        assertTrue(s1.contains("<v>12.5</v>")) // French decimal comma -> number
        assertTrue(s1.contains("007")) // leading zero kept as text
        assertTrue(s1.contains("<mergeCell ref=\"A3:B3\"/>"))
        assertTrue(parts.getValue("xl/worksheets/sheet2.xml").contains("rightToLeft=\"1\""))
        assertTrue(parts.getValue("xl/workbook.xml").contains("name=\"Page 2\""))
    }

    @Test
    fun `column names`() {
        assertEquals("A", XlsxWriter.columnName(0))
        assertEquals("Z", XlsxWriter.columnName(25))
        assertEquals("AA", XlsxWriter.columnName(26))
        assertEquals("BA", XlsxWriter.columnName(52))
    }

    @Test
    fun `docx text with arabic paragraph direction`() {
        val bos = ByteArrayOutputStream()
        DocxWriter.writeText("مرحبا بكم\nBonjour & bienvenue\u0001", bos, title = "Titre")
        val parts = unzip(bos.toByteArray())
        val doc = parts.getValue("word/document.xml")
        assertWellFormed(doc)
        assertWellFormed(parts.getValue("word/styles.xml"))
        assertTrue(doc.contains("<w:bidi/>"))
        assertTrue(doc.contains("Bonjour &amp; bienvenue"))
        assertTrue(!doc.contains('\u0001'))
    }

    @Test
    fun `docx table with merge`() {
        val bos = ByteArrayOutputStream()
        DocxWriter.write(listOf(DocxWriter.Table(table.copy(rightToLeft = true))), bos)
        val doc = unzip(bos.toByteArray()).getValue("word/document.xml")
        assertWellFormed(doc)
        assertTrue(doc.contains("<w:gridSpan w:val=\"2\"/>"))
        assertTrue(doc.contains("<w:bidiVisual/>"))
        assertEquals(3, Regex("<w:tr>").findAll(doc).count())
    }
}
