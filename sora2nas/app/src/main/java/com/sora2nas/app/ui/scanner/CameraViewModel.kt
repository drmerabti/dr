package com.sora2nas.app.ui.scanner

import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.sora2nas.app.data.settings.SettingsRepository
import com.sora2nas.app.imaging.Quad
import com.sora2nas.app.scan.ScanMode
import com.sora2nas.app.scan.ScanProcessor
import com.sora2nas.app.scan.ScanSession
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import java.io.File
import javax.inject.Inject

enum class FlashSetting { OFF, AUTO, ON }

data class CameraUiState(
    val mode: ScanMode = ScanMode.DOCUMENT,
    val pageCount: Int = 0,
    val flash: FlashSetting = FlashSetting.OFF,
    val busy: Boolean = false,
    /** Live document outline, corners normalised to 0..1 of the upright frame. */
    val liveQuad: Quad? = null,
    /** The live outline has been still for a moment: good time to shoot. */
    val liveSteady: Boolean = false,
    /** ID card mode: true once the front side has been captured. */
    val idFrontDone: Boolean = false,
    val barcode: String? = null,
    val error: Boolean = false,
)

@HiltViewModel
class CameraViewModel @Inject constructor(
    private val session: ScanSession,
    private val processor: ScanProcessor,
    private val settings: SettingsRepository,
) : ViewModel() {

    private val _state = MutableStateFlow(CameraUiState())
    val state: StateFlow<CameraUiState> = _state.asStateFlow()

    init {
        viewModelScope.launch {
            session.pages.collect { pages -> _state.value = _state.value.copy(pageCount = pages.size) }
        }
    }

    private var started = false

    /** Called when the camera screen is shown (also when coming back from the crop screen). */
    fun start(initial: ScanMode) {
        if (!started) {
            started = true
            // Coming back to the camera with an unfinished ID card keeps ID mode.
            val mode = if (initial == ScanMode.DOCUMENT && session.idFront != null) ScanMode.ID_CARD else initial
            if (mode != ScanMode.ID_CARD) session.idFront = null
            session.mode = mode
        }
        _state.value = _state.value.copy(mode = session.mode, idFrontDone = session.idFront != null, liveQuad = null)
    }

    fun setMode(mode: ScanMode) {
        session.mode = mode
        if (mode != ScanMode.ID_CARD) session.idFront = null
        _state.value = _state.value.copy(mode = mode, liveQuad = null, barcode = null, idFrontDone = session.idFront != null)
    }

    fun cycleFlash() {
        val next = when (_state.value.flash) { FlashSetting.OFF -> FlashSetting.AUTO; FlashSetting.AUTO -> FlashSetting.ON; FlashSetting.ON -> FlashSetting.OFF }
        _state.value = _state.value.copy(flash = next)
    }

    /** Live outline at the moment the shutter was pressed (fallback if detection fails on the photo). */
    private var captureHint: Quad? = null

    fun onLiveQuad(q: Quad?, steady: Boolean) {
        val s = _state.value
        if (s.liveQuad != q || s.liveSteady != steady) _state.value = s.copy(liveQuad = q, liveSteady = steady)
    }

    fun onBarcode(value: String) {
        if (_state.value.barcode == null) _state.value = _state.value.copy(barcode = value)
    }

    fun dismissBarcode() { _state.value = _state.value.copy(barcode = null) }

    fun newCaptureFile(): File = File(session.workDir.parentFile, "camera").apply { mkdirs() }.let { File(it, "cap_${System.nanoTime()}.jpg") }

    /** A photo was taken: normalise it, detect edges, then open the crop screen. */
    fun onPhotoSaved(file: File, onReady: () -> Unit) {
        _state.value = _state.value.copy(busy = true)
        viewModelScope.launch {
            try {
                val quality = settings.settings.first().scanQuality
                session.pending = processor.prepare(file, quality, liveHint = captureHint)
                onReady()
            } catch (e: Exception) {
                _state.value = _state.value.copy(error = true)
            } finally {
                _state.value = _state.value.copy(busy = false)
            }
        }
    }

    fun importFromGallery(uri: Uri, onReady: () -> Unit) {
        _state.value = _state.value.copy(busy = true)
        viewModelScope.launch {
            try {
                val quality = settings.settings.first().scanQuality
                session.pending = processor.prepareFromUri(uri, quality)
                onReady()
            } catch (e: Exception) {
                _state.value = _state.value.copy(error = true)
            } finally {
                _state.value = _state.value.copy(busy = false)
            }
        }
    }

    fun onCaptureFailed() { _state.value = _state.value.copy(busy = false, error = true) }
    fun clearError() { _state.value = _state.value.copy(error = false) }
    fun setBusy(b: Boolean) { _state.value = _state.value.copy(busy = b) }

    /** Shutter pressed: remember the live outline, show the busy state. */
    fun beginCapture() {
        captureHint = _state.value.liveQuad
        setBusy(true)
    }
}
