package com.sora2nas.verify

import com.sora2nas.app.core.export.DocxWriter
import com.sora2nas.app.core.text.Bidi
import org.junit.Assert.assertTrue
import org.junit.Test
import java.awt.Color
import java.awt.Font
import java.awt.RenderingHints
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import java.io.File
import java.util.zip.ZipInputStream

/**
 * Arabic lines mixed with English words and numbers: the OCR text must come
 * out in reading order, and lines that start with a Latin word must still be
 * shown right to left (phone, TXT, Word).
 */
class MixedDirectionTest {
    init { Support.ensureLoaded() }

    private val lines = listOf(
        "يعمل نظام Windows 11 على هذا الحاسوب منذ سنة 2024.",
        "PDF هو صيغة لحفظ المستندات ومشاركتها.",
        "نستعمل برنامج Microsoft Word 2016 و Excel لحساب الطاقة.",
    )

    @Test
    fun `mixed arabic and english lines read in the right order`() {
        // Tajawal has both Arabic and Latin glyphs; Java2D lays the lines out with the bidi algorithm.
        val font = Font.createFont(Font.TRUETYPE_FONT, File("../../app/src/main/res/font/tajawal_regular.ttf")).deriveFont(40f)
        val img = BufferedImage(1654, 1000, BufferedImage.TYPE_3BYTE_BGR)
        val g = img.createGraphics()
        g.color = Color.WHITE; g.fillRect(0, 0, img.width, img.height)
        g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON)
        g.font = font; g.color = Color(25, 25, 40)
        var y = 160
        for (l in lines) {
            if (l.startsWith("PDF")) y += 110 // its own paragraph, so the line starts with a Latin word
            val tl = java.awt.font.TextLayout(Bidi.RLM + l, font, g.fontRenderContext)
            tl.draw(g, (img.width - 140 - tl.advance), y.toFloat())
            y += 110
        }
        g.dispose()
        Support.saveRgb(Support.toRgbMat(img), "mixed_lines.jpg")

        val ocr = kotlinx.coroutines.runBlocking {
            com.sora2nas.app.core.ocr.OcrPipeline(CliTesseractEngine(), com.sora2nas.app.imaging.OcrPreprocessor()).run(Support.toRgbMat(img))
        }
        println("ocr:\n${ocr.text}")
        val got = Bidi.stripMarks(ocr.text).split('\n').filter { it.isNotBlank() }
        // Word order: the Latin word sits between the same Arabic words as in the original.
        assertTrue("order line 1: ${got.getOrNull(0)}", Regex("نظام\\s+Windows\\s+11\\s+على").containsMatchIn(got.joinToString(" ")))
        assertTrue("order line 3: $got", Regex("برنامج\\s+Microsoft\\s+Word\\s+2016\\s+و\\s+Excel").containsMatchIn(got.joinToString(" ")))
        val cer = Support.cer(lines.joinToString("\n"), got.joinToString("\n"))
        println("mixed cer=$cer")
        assertTrue("mixed CER $cer", cer < 0.05)
        // The line that starts with "PDF" is marked right to left for display/TXT.
        val pdfLine = ocr.text.split('\n').first { it.contains("PDF") }
        assertTrue("PDF line not marked RTL", pdfLine.startsWith(Bidi.RLM + "PDF"))
    }

    @Test
    fun `word paragraphs follow the majority direction`() {
        val out = ByteArrayOutputStream()
        DocxWriter.writeText(lines.joinToString("\n"), out)
        val xml = ZipInputStream(out.toByteArray().inputStream()).use { z ->
            generateSequence { z.nextEntry }.first { it.name == "word/document.xml" }
            z.readBytes().toString(Charsets.UTF_8)
        }
        val paras = Regex("<w:p>.*?</w:p>").findAll(xml).map { it.value }.filter { "<w:t" in it }.toList()
        val pdfPara = paras.first { "PDF" in it }
        assertTrue("PDF paragraph must be RTL", "<w:bidi/>" in pdfPara)
        // Latin runs are not marked rtl, Arabic runs are.
        assertTrue(Regex("<w:r><w:rPr>(?:(?!<w:rtl/>).)*?</w:rPr><w:t xml:space=\"preserve\">PDF ").containsMatchIn(pdfPara))
        assertTrue(Regex("<w:rtl/>.*?</w:rPr><w:t xml:space=\"preserve\">هو").containsMatchIn(pdfPara))
    }
}
