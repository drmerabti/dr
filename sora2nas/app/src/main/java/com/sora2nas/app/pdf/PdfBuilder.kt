package com.sora2nas.app.pdf

import com.sora2nas.app.core.ocr.WordBox
import com.sora2nas.app.core.text.LanguageDetector
import com.tom_roush.pdfbox.pdmodel.PDDocument
import com.tom_roush.pdfbox.pdmodel.PDPage
import com.tom_roush.pdfbox.pdmodel.PDPageContentStream
import com.tom_roush.pdfbox.pdmodel.common.PDRectangle
import com.tom_roush.pdfbox.pdmodel.font.PDFont
import com.tom_roush.pdfbox.pdmodel.font.PDType0Font
import com.tom_roush.pdfbox.pdmodel.graphics.image.JPEGFactory
import com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingMode
import com.tom_roush.pdfbox.util.Matrix
import java.io.InputStream
import java.io.OutputStream

/**
 * One page: an already-compressed JPEG plus (for a searchable PDF) the OCR
 * words in that image's pixel coordinates.
 */
class PdfPageInput(
    val jpeg: ByteArray,
    val widthPx: Int,
    val heightPx: Int,
    val words: List<WordBox>? = null,
)

/**
 * Builds image PDFs. Pages keep the image aspect ratio on an A4 width.
 * With OCR words it adds an invisible text layer (rendering mode "neither")
 * exactly over each word, so the PDF can be searched and text copied.
 *
 * Uses only PDFBox APIs shared by PdfBox-Android and desktop PDFBox, so it is
 * also verified on the JVM.
 */
class PdfBuilder(
    /** Opens a bundled font by file name (NotoSans / NotoSansArabic). */
    private val fontSource: (String) -> InputStream,
) {

    fun write(pages: List<PdfPageInput>, out: OutputStream, title: String? = null) {
        require(pages.isNotEmpty()) { "no pages" }
        PDDocument().use { doc ->
            if (title != null) doc.documentInformation.title = title
            doc.documentInformation.creator = "sora2nas"
            var latin: PDFont? = null
            var arabic: PDFont? = null
            for (p in pages) {
                val pageW = A4_WIDTH
                val pageH = pageW * p.heightPx / p.widthPx
                val page = PDPage(PDRectangle(pageW, pageH))
                doc.addPage(page)
                val image = JPEGFactory.createFromByteArray(doc, p.jpeg)
                PDPageContentStream(doc, page).use { cs ->
                    cs.drawImage(image, 0f, 0f, pageW, pageH)
                    val words = p.words
                    if (!words.isNullOrEmpty()) {
                        val scale = pageW / p.widthPx
                        for (w in words) {
                            val text = w.text.trim()
                            if (text.isEmpty() || w.width <= 0 || w.height <= 0) continue
                            val isArabic = text.any(LanguageDetector::isArabicLetter)
                            val font = if (isArabic) {
                                arabic ?: PDType0Font.load(doc, fontSource(ARABIC_FONT), true).also { arabic = it }
                            } else {
                                latin ?: PDType0Font.load(doc, fontSource(LATIN_FONT), true).also { latin = it }
                            }
                            // PDF text is stored in visual order: viewers re-apply the bidi
                            // algorithm when searching/copying, so RTL words are written reversed.
                            drawInvisibleWord(cs, font, if (isArabic) visualOrder(text) else text, w, scale, pageH)
                        }
                    }
                }
            }
            doc.save(out)
        }
    }

    private fun drawInvisibleWord(cs: PDPageContentStream, font: PDFont, text: String, w: WordBox, scale: Float, pageH: Float) {
        val boxW = w.width * scale
        val boxH = w.height * scale
        val fontSize = (boxH * 0.9f).coerceAtLeast(1f)
        val textW = try {
            font.getStringWidth(text) / 1000f * fontSize
        } catch (e: Exception) {
            return // a glyph missing from the font: skip this word
        }
        if (textW <= 0f) return
        try {
            cs.beginText()
            cs.setRenderingMode(RenderingMode.NEITHER)
            cs.setFont(font, fontSize)
            cs.setHorizontalScaling(100f * boxW / textW)
            // Baseline ≈ 20 % above the bottom of the word box.
            val x = w.left * scale
            val y = pageH - w.bottom * scale + boxH * 0.2f
            cs.setTextMatrix(Matrix.getTranslateInstance(x, y))
            cs.showText(text)
        } catch (e: Exception) {
            // ignore single-word failures; the image is still there
        } finally {
            try { cs.endText() } catch (_: Exception) { }
        }
    }

    companion object {
        /** Reverses a right-to-left word, keeping combining marks (harakat) after their letter. */
        fun visualOrder(word: String): String {
            val clusters = ArrayList<String>()
            val sb = StringBuilder()
            for (ch in word) {
                if (sb.isNotEmpty() && Character.getType(ch) == Character.NON_SPACING_MARK.toInt()) {
                    sb.append(ch)
                } else {
                    if (sb.isNotEmpty()) clusters += sb.toString()
                    sb.setLength(0)
                    sb.append(ch)
                }
            }
            if (sb.isNotEmpty()) clusters += sb.toString()
            return clusters.asReversed().joinToString("")
        }

        const val A4_WIDTH = 595.28f
        const val LATIN_FONT = "NotoSans-Regular.ttf"
        const val ARABIC_FONT = "NotoSansArabic-Regular.ttf"
    }
}
