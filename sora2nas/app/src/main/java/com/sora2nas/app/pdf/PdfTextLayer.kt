package com.sora2nas.app.pdf

import com.sora2nas.app.core.text.TextCleaner
import com.tom_roush.pdfbox.pdmodel.PDDocument
import com.tom_roush.pdfbox.text.PDFTextStripper

/**
 * Reads the embedded text layer of a PDF, page by page ("smart mode": pages
 * with real text are extracted directly; the caller OCRs the others).
 */
class PdfTextLayer(private val doc: PDDocument) {

    val pageCount: Int get() = doc.numberOfPages

    private val stripper = PDFTextStripper().apply {
        sortByPosition = true
        lineSeparator = "\n"
        paragraphEnd = "\n"
    }

    /** Text of page [index] (0-based), or null when the page has no usable text layer. */
    fun pageText(index: Int): String? {
        stripper.startPage = index + 1
        stripper.endPage = index + 1
        val raw = try { stripper.getText(doc) } catch (e: Exception) { return null }
        return if (hasRealText(raw)) raw else null
    }

    companion object {
        /** At least 20 letters/digits: scanned pages often carry a few stray characters. */
        fun hasRealText(s: String?): Boolean {
            if (s == null) return false
            val n = TextCleaner.normalizeUnicode(s).count { it.isLetterOrDigit() }
            return n >= 20
        }
    }
}
