package com.sora2nas.verify

import com.sora2nas.app.core.export.DocxWriter
import com.sora2nas.app.core.export.XlsxWriter
import com.sora2nas.app.core.table.TableData
import com.sora2nas.app.imaging.MatUtils
import com.sora2nas.app.imaging.TableExtractor
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.awt.BasicStroke
import java.awt.Color
import java.awt.RenderingHints
import java.awt.image.BufferedImage
import java.io.File

/** Table image -> grid detection -> per-cell OCR (real Tesseract) -> xlsx/docx. */
class TableIntegrationTest {
    init { Support.ensureLoaded() }

    private val french = listOf(
        listOf("Équipement", "Quantité", "Prix", "Statut"),
        listOf("Moteur broyeur", "2", "1250", "Remplacé"),
        listOf("Roulement", "14", "85,5", "En stock"),
        listOf("Courroie", "6", "40", "Commandé"),
    )
    private val arabic = listOf(
        listOf("المعدات", "الكمية", "الحالة"),
        listOf("محرك", "2", "جديد"),
        listOf("مضخة", "5", "مستعمل"),
    )

    /** Draws a table; Arabic tables are laid out right-to-left like on paper. */
    private fun render(rows: List<List<String>>, rtl: Boolean, ruled: Boolean): BufferedImage {
        val colW = 360; val rowH = 90; val x0 = 120; val y0 = 150
        val cols = rows[0].size
        val img = BufferedImage(x0 * 2 + colW * cols, y0 * 2 + rowH * rows.size, BufferedImage.TYPE_3BYTE_BGR)
        val g = img.createGraphics()
        g.color = Color.WHITE; g.fillRect(0, 0, img.width, img.height)
        g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON)
        g.font = (if (rtl) Support.arabicFont else Support.latinFont).deriveFont(36f)
        g.color = Color(20, 20, 30)
        val fm = g.fontMetrics
        rows.forEachIndexed { r, row ->
            row.forEachIndexed { c, text ->
                val visualCol = if (rtl) cols - 1 - c else c
                val cx = x0 + visualCol * colW
                val tx = if (rtl) cx + colW - 20 - fm.stringWidth(text) else cx + 20
                g.drawString(text, tx, y0 + r * rowH + 58)
            }
        }
        if (ruled) {
            g.stroke = BasicStroke(3f)
            for (r in 0..rows.size) g.drawLine(x0, y0 + r * rowH, x0 + cols * colW, y0 + r * rowH)
            for (c in 0..cols) g.drawLine(x0 + c * colW, y0, x0 + c * colW, y0 + rows.size * rowH)
        }
        g.dispose()
        return img
    }

    private fun extract(rows: List<List<String>>, rtl: Boolean, ruled: Boolean, name: String, angle: Double = 0.0): TableData = runBlocking {
        var img = Support.toRgbMat(render(rows, rtl, ruled))
        if (angle != 0.0) img = MatUtils.rotateExpand(img, angle)
        Support.saveRgb(img, "$name.png")
        val engine = CliTesseractEngine()
        val t0 = System.currentTimeMillis()
        val table = TableExtractor(engine).extract(img)
        println("engine calls: ${engine.log.groupingBy { it }.eachCount()}")
        println("[$name] ${table.rowCount}x${table.colCount} rtl=${table.rightToLeft} ocrCalls=${engine.calls} ${System.currentTimeMillis() - t0}ms")
        table.cells.forEach { println("   " + it.joinToString(" | ")) }
        table
    }

    private fun cellAccuracy(expected: List<List<String>>, t: TableData): Double {
        var ok = 0; var n = 0
        expected.forEachIndexed { r, row -> row.forEachIndexed { c, v -> n++; if (t.cell(r, c).trim() == v) ok++ } }
        return ok.toDouble() / n
    }

    @Test
    fun `ruled french table`() {
        val t = extract(french, rtl = false, ruled = true, name = "table_fr", angle = 1.5)
        assertEquals(4, t.rowCount); assertEquals(4, t.colCount)
        val acc = cellAccuracy(french, t)
        println("cell accuracy = $acc")
        assertTrue(acc >= 0.9)
        val dir = Support.out
        File(dir, "table_fr.xlsx").outputStream().use { XlsxWriter.write(listOf("Tableau" to t), it) }
        File(dir, "table_fr.docx").outputStream().use { DocxWriter.write(listOf(DocxWriter.Paragraph("Tableau extrait", bold = true), DocxWriter.Table(t)), it) }
    }

    @Test
    fun `ruled arabic table is right to left`() {
        val t = extract(arabic, rtl = true, ruled = true, name = "table_ar")
        assertTrue(t.rightToLeft)
        assertEquals(3, t.rowCount); assertEquals(3, t.colCount)
        val acc = cellAccuracy(arabic, t)
        println("cell accuracy = $acc")
        assertTrue(acc >= 0.8)
        File(Support.out, "table_ar.xlsx").outputStream().use { XlsxWriter.write(listOf("جدول" to t), it) }
        File(Support.out, "table_ar.docx").outputStream().use { DocxWriter.write(listOf(DocxWriter.Table(t)), it) }
    }

    @Test
    fun `borderless table`() {
        val t = extract(french, rtl = false, ruled = false, name = "table_borderless")
        assertEquals(4, t.rowCount); assertEquals(4, t.colCount)
        val acc = cellAccuracy(french, t)
        println("cell accuracy = $acc")
        assertTrue(acc >= 0.85)
    }

    @Test
    fun `text export files`() {
        File(Support.out, "text.docx").outputStream().use {
            DocxWriter.writeText("تقرير الصيانة الشهري\n\nRapport mensuel de maintenance & énergie.", it, title = "sora2nas")
        }
    }
}
