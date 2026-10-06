package com.sora2nas.app.ui.scanner

import android.graphics.Bitmap
import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.sora2nas.app.data.WorkKind
import com.sora2nas.app.data.WorkQueue
import com.sora2nas.app.data.WorkRequest
import com.sora2nas.app.data.usage.UsageRepository
import com.sora2nas.app.imaging.Pt
import com.sora2nas.app.imaging.Quad
import com.sora2nas.app.imaging.ScanAdjustments
import com.sora2nas.app.platform.ImageIO
import com.sora2nas.app.scan.ScanMode
import com.sora2nas.app.scan.ScanPage
import com.sora2nas.app.scan.ScanProcessor
import com.sora2nas.app.scan.ScanSession
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import javax.inject.Inject

enum class CropOutcome { NEXT_CAPTURE, PAGES, PROCESS, BACK_TO_EDIT, PAYWALL }

data class CropUiState(
    val image: Bitmap? = null,
    /** Corners in [image] pixel coordinates. */
    val quad: Quad? = null,
    val autoDetected: Boolean = false,
    val working: Boolean = false,
    val mode: ScanMode = ScanMode.DOCUMENT,
    val idFrontDone: Boolean = false,
    /** The cleaned page, shown with the scan animation before moving on. */
    val result: Bitmap? = null,
)

@HiltViewModel
class CropViewModel @Inject constructor(
    private val session: ScanSession,
    private val processor: ScanProcessor,
    private val queue: WorkQueue,
    private val usage: UsageRepository,
) : ViewModel() {

    private val _state = MutableStateFlow(CropUiState())
    val state: StateFlow<CropUiState> = _state.asStateFlow()

    /** display pixels -> original pixels */
    private var scaleToOriginal = 1.0
    private var detectedDisplay: Quad? = null

    init {
        viewModelScope.launch {
            val pending = session.pending ?: return@launch
            val bmp = withContext(Dispatchers.IO) { ImageIO.decodeFile(pending.original, DISPLAY_SIDE) }
            scaleToOriginal = pending.width.toDouble() / bmp.width
            detectedDisplay = pending.detected?.scaled(1.0 / scaleToOriginal)
            _state.value = CropUiState(
                image = bmp,
                quad = detectedDisplay ?: defaultQuad(bmp.width, bmp.height),
                autoDetected = detectedDisplay != null,
                mode = session.mode,
                idFrontDone = session.idFront != null,
            )
        }
    }

    fun moveCorner(index: Int, x: Double, y: Double) {
        val s = _state.value
        val img = s.image ?: return
        val q = s.quad ?: return
        val p = Pt(x.coerceIn(0.0, img.width - 1.0), y.coerceIn(0.0, img.height - 1.0))
        val pts = q.points.toMutableList().also { it[index] = p }
        _state.value = s.copy(quad = Quad(pts[0], pts[1], pts[2], pts[3]))
    }

    /** Toggles between the detected outline and the full image. */
    fun toggleFullImage() {
        val s = _state.value
        val img = s.image ?: return
        val full = Quad.fullImage(img.width, img.height)
        _state.value = s.copy(quad = if (s.quad == full) (detectedDisplay ?: defaultQuad(img.width, img.height)) else full)
    }

    private var pendingOutcome: (() -> Unit)? = null

    fun confirm(onOutcome: (CropOutcome) -> Unit) {
        val pending = session.pending ?: return
        val quadDisplay = _state.value.quad ?: return
        _state.value = _state.value.copy(working = true)
        viewModelScope.launch {
            val quad = quadDisplay.scaled(scaleToOriginal)
            var shown: ScanPage? = null
            val outcome = try {
                val editing = pending.pageId?.let(session::page)
                if (editing != null) {
                    val rebuilt = processor.buildPage(pending.original, quad, editing.rotation, editing.adjustments, existing = editing)
                    session.replace(rebuilt)
                    shown = rebuilt
                    CropOutcome.BACK_TO_EDIT
                } else {
                    val page = processor.buildPage(pending.original, quad, 0, ScanAdjustments())
                    shown = page
                    when (session.mode) {
                        ScanMode.DOCUMENT, ScanMode.QR -> { session.add(page); CropOutcome.NEXT_CAPTURE }
                        ScanMode.ID_CARD -> {
                            val front = session.idFront
                            if (front == null) {
                                session.idFront = page
                                CropOutcome.NEXT_CAPTURE
                            } else {
                                val card = processor.composeIdCard(front, page)
                                session.add(card)
                                shown = card
                                session.idFront = null
                                session.mode = ScanMode.DOCUMENT
                                CropOutcome.PAGES
                            }
                        }
                        ScanMode.OCR, ScanMode.TABLE -> {
                            if (!usage.canConvert(1)) {
                                shown = null
                                CropOutcome.PAYWALL
                            } else {
                                val kind = if (session.mode == ScanMode.OCR) WorkKind.IMAGE_TEXT else WorkKind.TABLE_IMAGE
                                queue.request = WorkRequest(kind, listOf(Uri.fromFile(page.processed)))
                                CropOutcome.PROCESS
                            }
                        }
                    }
                }
            } catch (e: Exception) {
                _state.value = _state.value.copy(working = false)
                throw e
            }
            session.pending = null
            val result = shown?.let { p -> runCatching { withContext(Dispatchers.IO) { ImageIO.decodeFile(p.processed, DISPLAY_SIDE) } }.getOrNull() }
            if (result == null) {
                _state.value = _state.value.copy(working = false)
                onOutcome(outcome)
            } else {
                // The screen plays the scan animation over the clean page, then calls finishReveal().
                pendingOutcome = { onOutcome(outcome) }
                _state.value = _state.value.copy(working = false, result = result)
            }
        }
    }

    /** End of the scan animation. */
    fun finishReveal() {
        val next = pendingOutcome ?: return
        pendingOutcome = null
        next()
    }

    fun retake() {
        session.pending?.let { if (it.pageId == null) it.original.delete() }
        session.pending = null
    }

    private fun defaultQuad(w: Int, h: Int): Quad {
        val mx = w * 0.06
        val my = h * 0.06
        return Quad(Pt(mx, my), Pt(w - mx, my), Pt(w - mx, h - my), Pt(mx, h - my))
    }

    companion object { const val DISPLAY_SIDE = 1600 }
}
