package com.sora2nas.app.scan

import android.content.Context
import com.sora2nas.app.imaging.Quad
import com.sora2nas.app.imaging.ScanAdjustments
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import java.io.File
import javax.inject.Inject
import javax.inject.Singleton

/** What the camera is used for. */
enum class ScanMode {
    /** Multi-page document -> PDF / images. */
    DOCUMENT,
    /** ID card: front + back on one page. */
    ID_CARD,
    /** QR code / barcode reader. */
    QR,
    /** One capture sent to "Image to text". */
    OCR,
    /** One capture sent to "Table to Excel/Word". */
    TABLE,
}

/** One scanned page. Files live in cache/scan until exported. */
data class ScanPage(
    val id: Long,
    /** Upright full-resolution capture. */
    val original: File,
    /** Document corners in [original] pixels; null = whole image. */
    val quad: Quad?,
    /** Extra clockwise rotation after flattening (0/90/180/270). */
    val rotation: Int = 0,
    val adjustments: ScanAdjustments = ScanAdjustments(),
    /** Final page image (JPEG). */
    val processed: File,
    val thumb: File,
    /** Composite pages (ID card) cannot be re-cropped. */
    val composite: Boolean = false,
    /** Bumped on every re-process so image caches refresh. */
    val version: Int = 0,
)

/** A capture waiting in the crop screen. */
data class PendingCapture(
    val original: File,
    val width: Int,
    val height: Int,
    val detected: Quad?,
    /** When re-cropping an existing page. */
    val pageId: Long? = null,
)

/**
 * In-memory state of the current scanning session, shared by the camera,
 * crop, pages and edit screens.
 */
@Singleton
class ScanSession @Inject constructor(@ApplicationContext context: Context) {

    val workDir: File = File(context.cacheDir, "scan").apply { mkdirs() }

    private val _pages = MutableStateFlow<List<ScanPage>>(emptyList())
    val pages: StateFlow<List<ScanPage>> = _pages.asStateFlow()

    var mode: ScanMode = ScanMode.DOCUMENT
    var pending: PendingCapture? = null

    /** ID card mode: the processed front side, waiting for the back. */
    var idFront: ScanPage? = null

    fun newFile(prefix: String, ext: String = "jpg") = File(workDir, "${prefix}_${System.nanoTime()}.$ext")

    fun add(page: ScanPage) = _pages.update { it + page }

    fun replace(page: ScanPage) = _pages.update { list -> list.map { if (it.id == page.id) page else it } }

    fun page(id: Long): ScanPage? = _pages.value.firstOrNull { it.id == id }

    fun remove(id: Long) = _pages.update { list ->
        list.filter { it.id != id }.also { list.firstOrNull { p -> p.id == id }?.let(::deleteFiles) }
    }

    /** Moves a page by [delta] positions (-1 = earlier, +1 = later). */
    fun move(id: Long, delta: Int) = _pages.update { list ->
        val i = list.indexOfFirst { it.id == id }
        val j = i + delta
        if (i < 0 || j !in list.indices) list else list.toMutableList().apply { add(j, removeAt(i)) }
    }

    /** Starts a new session (after export or when the user discards). */
    fun clear() {
        _pages.value.forEach(::deleteFiles)
        _pages.value = emptyList()
        idFront = null
        pending = null
        workDir.listFiles()?.forEach { it.delete() }
    }

    private fun deleteFiles(p: ScanPage) {
        p.processed.delete(); p.thumb.delete()
        if (p.original != p.processed) p.original.delete()
    }
}
