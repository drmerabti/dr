package com.sora2nas.app.platform

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Color
import android.graphics.pdf.PdfRenderer
import android.net.Uri
import android.os.ParcelFileDescriptor
import com.sora2nas.app.pdf.PdfTextLayer
import com.tom_roush.pdfbox.pdmodel.PDDocument
import com.tom_roush.pdfbox.pdmodel.encryption.InvalidPasswordException
import java.io.Closeable
import java.io.File

class PdfPasswordException : Exception("PDF is password protected")

/**
 * Opens a PDF for "smart" text extraction: the text layer via PDFBox, and
 * page images via Android's PdfRenderer for pages that need OCR.
 * The PDF is first copied to cache so both readers can seek freely.
 */
class PdfPages private constructor(
    private val file: File,
    private val doc: PDDocument,
) : Closeable {

    private val pfd: ParcelFileDescriptor = ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY)
    private val renderer: PdfRenderer = try {
        PdfRenderer(pfd)
    } catch (e: SecurityException) {
        pfd.close(); doc.close()
        throw PdfPasswordException()
    }
    private val textLayer = PdfTextLayer(doc)

    val pageCount: Int get() = renderer.pageCount

    /** Embedded text of the page, or null when the page is a scanned image. */
    fun text(index: Int): String? = if (index < textLayer.pageCount) textLayer.pageText(index) else null

    /** Renders a page at ~[dpi] (longest side capped) on a white background. */
    fun render(index: Int, dpi: Int = 300, maxSide: Int = 3600): Bitmap {
        renderer.openPage(index).use { page ->
            var scale = dpi / 72f
            val longest = maxOf(page.width, page.height) * scale
            if (longest > maxSide) scale *= maxSide / longest
            val w = (page.width * scale).toInt().coerceAtLeast(1)
            val h = (page.height * scale).toInt().coerceAtLeast(1)
            val bmp = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888)
            bmp.eraseColor(Color.WHITE) // PdfRenderer draws on transparent pixels
            page.render(bmp, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)
            return bmp
        }
    }

    override fun close() {
        runCatching { renderer.close() }
        runCatching { pfd.close() }
        runCatching { doc.close() }
        file.delete()
    }

    companion object {
        fun open(context: Context, uri: Uri): PdfPages {
            val file = File(context.cacheDir, "pdf_${System.nanoTime()}.pdf")
            context.contentResolver.openInputStream(uri)?.use { input -> file.outputStream().use { input.copyTo(it) } }
                ?: error("Cannot open PDF")
            val doc = try {
                PDDocument.load(file)
            } catch (e: InvalidPasswordException) {
                file.delete()
                throw PdfPasswordException()
            }
            return PdfPages(file, doc)
        }
    }
}
