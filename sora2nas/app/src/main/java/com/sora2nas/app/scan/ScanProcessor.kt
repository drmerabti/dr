package com.sora2nas.app.scan

import android.content.Context
import android.graphics.Bitmap
import android.net.Uri
import com.sora2nas.app.data.settings.ScanQuality
import com.sora2nas.app.data.storage.MediaStoreSaver
import com.sora2nas.app.imaging.DocumentDetector
import com.sora2nas.app.imaging.IdCardComposer
import com.sora2nas.app.imaging.ImageEnhancer
import com.sora2nas.app.imaging.MatUtils
import com.sora2nas.app.imaging.PerspectiveCorrector
import com.sora2nas.app.imaging.Quad
import com.sora2nas.app.imaging.ScanAdjustments
import com.sora2nas.app.imaging.ScanFilter
import com.sora2nas.app.pdf.PdfBuilder
import com.sora2nas.app.pdf.PdfPageInput
import com.sora2nas.app.platform.ImageIO
import com.sora2nas.app.platform.OcrService
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.opencv.core.Mat
import java.io.File
import javax.inject.Inject
import javax.inject.Singleton

/** Image processing + export for scanned pages (all on-device). */
@Singleton
class ScanProcessor @Inject constructor(
    @ApplicationContext private val context: Context,
    private val session: ScanSession,
    private val saver: MediaStoreSaver,
    private val ocr: OcrService,
) {

    /**
     * Normalises a new capture (EXIF rotation applied, resolution capped by the
     * quality setting) and detects the document edges.
     */
    suspend fun prepare(source: File, quality: ScanQuality, pageId: Long? = null): PendingCapture = withContext(Dispatchers.Default) {
        val bmp = ImageIO.decodeFile(source, quality.maxSide)
        val original = session.newFile("orig")
        original.outputStream().use { ImageIO.writeJpeg(bmp, 95, it) }
        source.delete() // temporary camera/import file, replaced by the normalised original
        val mat = ImageIO.bitmapToRgb(bmp)
        val quad = try { DocumentDetector.detect(mat) } finally { mat.release() }
        val p = PendingCapture(original, bmp.width, bmp.height, quad, pageId)
        bmp.recycle()
        p
    }

    /** Copies a gallery/shared image into the session, then [prepare]. */
    suspend fun prepareFromUri(uri: Uri, quality: ScanQuality): PendingCapture = withContext(Dispatchers.IO) {
        val bmp = ImageIO.decode(context, uri, quality.maxSide)
        val f = session.newFile("import")
        f.outputStream().use { ImageIO.writeJpeg(bmp, 95, it) }
        bmp.recycle()
        prepare(f, quality)
    }

    /** Flatten + enhance a page at full resolution and write its files. */
    suspend fun buildPage(
        original: File,
        quad: Quad?,
        rotation: Int,
        adj: ScanAdjustments,
        existing: ScanPage? = null,
    ): ScanPage = withContext(Dispatchers.Default) {
        val bmp = render(original, quad, rotation, adj, maxSide = Int.MAX_VALUE)
        val processed = session.newFile("page")
        processed.outputStream().use { ImageIO.writeJpeg(bmp, 92, it) }
        val thumb = session.newFile("thumb")
        val small = ImageIO.thumbnail(bmp, 480)
        thumb.outputStream().use { ImageIO.writeJpeg(small, 80, it) }
        small.recycle()
        bmp.recycle()
        existing?.let { it.processed.delete(); it.thumb.delete() }
        ScanPage(
            id = existing?.id ?: System.nanoTime(),
            original = original,
            quad = quad,
            rotation = rotation,
            adjustments = adj,
            processed = processed,
            thumb = thumb,
            version = (existing?.version ?: 0) + 1,
        )
    }

    /** Quick low-resolution render for live slider previews. */
    suspend fun preview(page: ScanPage, adj: ScanAdjustments, rotation: Int): Bitmap = withContext(Dispatchers.Default) {
        if (page.composite) {
            val src = ImageIO.fileToRgb(page.original, PREVIEW_SIDE)
            try { applyAdjust(src, rotation, adj) } finally { src.release() }
        } else {
            render(page.original, page.quad, rotation, adj, PREVIEW_SIDE)
        }
    }

    /** Re-processes a composite (ID card) page with new adjustments. */
    suspend fun rebuildComposite(page: ScanPage, adj: ScanAdjustments, rotation: Int): ScanPage = withContext(Dispatchers.Default) {
        val src = ImageIO.fileToRgb(page.original, Int.MAX_VALUE)
        val bmp = try { applyAdjust(src, rotation, adj) } finally { src.release() }
        page.processed.delete(); page.thumb.delete()
        val processed = session.newFile("page")
        processed.outputStream().use { ImageIO.writeJpeg(bmp, 92, it) }
        val thumb = session.newFile("thumb")
        val small = ImageIO.thumbnail(bmp, 480)
        thumb.outputStream().use { ImageIO.writeJpeg(small, 80, it) }
        small.recycle()
        bmp.recycle()
        page.copy(processed = processed, thumb = thumb, adjustments = adj, rotation = rotation, version = page.version + 1)
    }

    private fun applyAdjust(src: Mat, rotation: Int, adj: ScanAdjustments): Bitmap {
        val rotated = MatUtils.rotate90(src, rotation)
        val enhanced = ImageEnhancer.apply(rotated, adj)
        rotated.release()
        return ImageIO.matToBitmap(enhanced).also { enhanced.release() }
    }

    private fun render(original: File, quad: Quad?, rotation: Int, adj: ScanAdjustments, maxSide: Int): Bitmap {
        // Originals are written upright without EXIF rotation, so the stored size is the pixel size.
        val fullW = ImageIO.size(original).first
        val scaled = ImageIO.decodeFile(original, maxSide)
        val scale = scaled.width.toDouble() / fullW
        val src = ImageIO.bitmapToRgb(scaled)
        scaled.recycle()
        val flat = if (quad != null) PerspectiveCorrector.warp(src, quad.scaled(scale)) else src.clone()
        src.release()
        return applyAdjust(flat, rotation, adj).also { flat.release() }
    }

    /** Front + back of an ID card on one A4 page. */
    suspend fun composeIdCard(front: ScanPage, back: ScanPage): ScanPage = withContext(Dispatchers.Default) {
        val f = ImageIO.fileToRgb(front.processed, 2000)
        val b = ImageIO.fileToRgb(back.processed, 2000)
        val page = IdCardComposer.compose(f, b)
        f.release(); b.release()
        val bmp = ImageIO.matToBitmap(page)
        page.release()
        val file = session.newFile("idcard")
        file.outputStream().use { ImageIO.writeJpeg(bmp, 92, it) }
        val thumb = session.newFile("thumb")
        val small = ImageIO.thumbnail(bmp, 480)
        thumb.outputStream().use { ImageIO.writeJpeg(small, 80, it) }
        small.recycle()
        bmp.recycle()
        listOf(front, back).forEach { it.processed.delete(); it.thumb.delete(); it.original.delete() }
        ScanPage(System.nanoTime(), file, null, 0, ScanAdjustments(filter = ScanFilter.ORIGINAL, sharpness = 0f), file, thumb, composite = true)
    }

    /**
     * Saves all pages as ONE compressed PDF in Documents/sora2nas. With
     * [searchable] an invisible OCR text layer is added to every page.
     */
    suspend fun exportPdf(
        pages: List<ScanPage>,
        quality: ScanQuality,
        searchable: Boolean,
        title: String,
        onProgress: (Int, Int) -> Unit,
    ): MediaStoreSaver.Saved = withContext(Dispatchers.Default) {
        val inputs = pages.mapIndexed { i, p ->
            val bmp = ImageIO.decodeFile(p.processed, quality.maxSide.coerceAtMost(PDF_MAX_SIDE))
            val jpeg = ImageIO.jpegBytes(bmp, quality.jpegQuality)
            val words = if (searchable) {
                val mat = ImageIO.bitmapToRgb(bmp)
                try { ocr.wordsForPage(mat).words } finally { mat.release() }
            } else null
            val input = PdfPageInput(jpeg, bmp.width, bmp.height, words)
            bmp.recycle()
            onProgress(i + 1, pages.size)
            input
        }
        val builder = PdfBuilder { name -> context.assets.open("fonts/$name") }
        saver.saveDocument(title, "pdf", "application/pdf") { out -> builder.write(inputs, out, title) }
    }

    /** Saves every page as a JPEG in Pictures/sora2nas (Gallery album). */
    suspend fun exportImages(pages: List<ScanPage>, title: String): List<MediaStoreSaver.Saved> =
        pages.mapIndexed { i, p ->
            val name = if (pages.size == 1) title else "${title}_${i + 1}"
            saver.saveImage(name) { out -> p.processed.inputStream().use { it.copyTo(out) } }
        }

    companion object {
        const val PREVIEW_SIDE = 1100
        /** PDFs never need more than ~300 dpi on A4. */
        const val PDF_MAX_SIDE = 3500
    }
}
