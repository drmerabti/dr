package com.sora2nas.app.ui.scanner

import android.graphics.Bitmap
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.sora2nas.app.imaging.ScanAdjustments
import com.sora2nas.app.imaging.ScanFilter
import com.sora2nas.app.platform.ImageIO
import com.sora2nas.app.scan.PendingCapture
import com.sora2nas.app.scan.ScanProcessor
import com.sora2nas.app.scan.ScanSession
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class PageEditUi(
    val preview: Bitmap? = null,
    val adjustments: ScanAdjustments = ScanAdjustments(),
    val rotation: Int = 0,
    val canRecrop: Boolean = true,
    val saving: Boolean = false,
)

@HiltViewModel
class PageEditViewModel @Inject constructor(
    savedState: SavedStateHandle,
    private val session: ScanSession,
    private val processor: ScanProcessor,
) : ViewModel() {

    private val pageId: Long = savedState.get<Long>("id") ?: 0L
    private val _state = MutableStateFlow(PageEditUi())
    val state: StateFlow<PageEditUi> = _state.asStateFlow()
    private var renderJob: Job? = null
    private var reloadOnResume = false

    init { reload() }

    /** (Re)loads the page, e.g. after coming back from re-cropping. */
    fun reload() {
        val page = session.page(pageId) ?: return
        _state.value = _state.value.copy(adjustments = page.adjustments, rotation = page.rotation, canRecrop = !page.composite)
        render(immediate = true)
    }

    fun setFilter(f: ScanFilter) = update(_state.value.adjustments.copy(filter = f))
    fun setBrightness(v: Float) = update(_state.value.adjustments.copy(brightness = v))
    fun setContrast(v: Float) = update(_state.value.adjustments.copy(contrast = v))
    fun setSharpness(v: Float) = update(_state.value.adjustments.copy(sharpness = v))
    fun rotate() {
        _state.value = _state.value.copy(rotation = (_state.value.rotation + 90) % 360)
        render(immediate = true)
    }
    fun reset() = update(ScanAdjustments())

    private fun update(adj: ScanAdjustments) {
        _state.value = _state.value.copy(adjustments = adj)
        render(immediate = false)
    }

    /** Debounced low-resolution preview while the sliders move. */
    private fun render(immediate: Boolean) {
        val page = session.page(pageId) ?: return
        renderJob?.cancel()
        renderJob = viewModelScope.launch {
            if (!immediate) delay(120)
            val s = _state.value
            val bmp = processor.preview(page, s.adjustments, s.rotation)
            // The previous bitmap is left to the GC: Compose may still be drawing it.
            _state.value = _state.value.copy(preview = bmp)
        }
    }

    fun onResume() {
        if (reloadOnResume) { reloadOnResume = false; reload() }
    }

    /** Prepares the crop screen to re-edit this page's corners. */
    fun startRecrop(): Boolean {
        val page = session.page(pageId) ?: return false
        if (page.composite) return false
        val (w, h) = ImageIO.size(page.original)
        session.pending = PendingCapture(page.original, w, h, page.quad, pageId = page.id)
        reloadOnResume = true
        return true
    }

    fun apply(onDone: () -> Unit) {
        val page = session.page(pageId) ?: return onDone()
        val s = _state.value
        _state.value = s.copy(saving = true)
        viewModelScope.launch {
            val updated = if (page.composite) processor.rebuildComposite(page, s.adjustments, s.rotation)
            else processor.buildPage(page.original, page.quad, s.rotation, s.adjustments, existing = page)
            session.replace(updated)
            _state.value = _state.value.copy(saving = false)
            onDone()
        }
    }
}
