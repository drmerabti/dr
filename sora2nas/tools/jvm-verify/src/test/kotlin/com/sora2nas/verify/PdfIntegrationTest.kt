package com.sora2nas.verify

import com.sora2nas.app.core.ocr.OcrPipeline
import com.sora2nas.app.imaging.MatUtils
import com.sora2nas.app.imaging.OcrPreprocessor
import com.sora2nas.app.pdf.PdfBuilder
import com.sora2nas.app.pdf.PdfPageInput
import com.sora2nas.app.pdf.PdfTextLayer
import kotlinx.coroutines.runBlocking
import org.apache.pdfbox.pdmodel.PDDocument
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import org.opencv.core.Mat
import org.opencv.core.MatOfByte
import org.opencv.core.MatOfInt
import org.opencv.imgcodecs.Imgcodecs
import org.opencv.imgproc.Imgproc
import java.io.File

/** Searchable PDF (image + invisible OCR text) and PDF text-layer extraction. */
class PdfIntegrationTest {
    init { Support.ensureLoaded() }

    private val fr = listOf("Rapport de production du mois", "", "Le broyeur à ciment numéro deux a été révisé.")
    private val ar = listOf("تقرير الإنتاج الشهري", "", "تمت صيانة مطحنة الإسمنت رقم اثنين.")

    private fun jpeg(rgb: Mat, quality: Int = 80): ByteArray {
        val bgr = Mat(); Imgproc.cvtColor(rgb, bgr, Imgproc.COLOR_RGB2BGR)
        val buf = MatOfByte()
        Imgcodecs.imencode(".jpg", bgr, buf, MatOfInt(Imgcodecs.IMWRITE_JPEG_QUALITY, quality))
        return buf.toArray()
    }

    private fun page(lines: List<String>, rtl: Boolean): PdfPageInput = runBlocking {
        val rgb = Support.toRgbMat(Support.renderPage(lines, rtl))
        val out = OcrPipeline(CliTesseractEngine(), OcrPreprocessor()).run(rgb, wantWords = true, keepGeometry = true)
        PdfPageInput(jpeg(rgb), rgb.cols(), rgb.rows(), out.words)
    }

    private fun pdftotext(f: File): String {
        val p = ProcessBuilder("pdftotext", "-layout", f.absolutePath, "-").redirectErrorStream(true).start()
        return p.inputStream.bufferedReader().readText().also { p.waitFor() }
    }

    @Test
    fun `searchable pdf contains the ocr text`() {
        val builder = PdfBuilder { name -> File(Support.fonts, name).inputStream() }
        val f = File(Support.out, "searchable.pdf")
        f.outputStream().use { builder.write(listOf(page(fr, false), page(ar, true)), it, "test") }
        println("searchable.pdf size = ${f.length() / 1024} KB")
        PDDocument.load(f).use { doc ->
            assertEquals(2, doc.numberOfPages)
            val layer = PdfTextLayer(doc)
            val p1 = layer.pageText(0)!!
            println("PDFBox page 1: $p1")
            assertTrue(p1.contains("broyeur à ciment"))
            val p2 = layer.pageText(1)
            println("PDFBox page 2: $p2")
        }
        val poppler = pdftotext(f)
        println("pdftotext:\n$poppler")
        assertTrue(poppler.contains("Rapport de production"))
        assertTrue("arabic text not searchable", poppler.contains("الإنتاج") || poppler.contains("الشهري"))
    }

    @Test
    fun `image only pdf has no text layer and is compressed`() {
        val builder = PdfBuilder { name -> File(Support.fonts, name).inputStream() }
        val rgb = Support.toRgbMat(Support.renderPage(fr, false))
        val f = File(Support.out, "scan.pdf")
        f.outputStream().use { builder.write(listOf(PdfPageInput(jpeg(rgb, 75), rgb.cols(), rgb.rows())), it) }
        println("scan.pdf (1654x2339 page) size = ${f.length() / 1024} KB")
        assertTrue(f.length() < 600 * 1024)
        PDDocument.load(f).use { assertNull(PdfTextLayer(it).pageText(0)) }
        @Suppress("UNUSED_VARIABLE") val x = MatUtils
    }
}
