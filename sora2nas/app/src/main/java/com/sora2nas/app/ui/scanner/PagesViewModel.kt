package com.sora2nas.app.ui.scanner

import android.content.Context
import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.sora2nas.app.R
import com.sora2nas.app.data.history.HistoryEntity
import com.sora2nas.app.data.history.HistoryRepository
import com.sora2nas.app.data.history.HistoryType
import com.sora2nas.app.data.settings.ScanQuality
import com.sora2nas.app.data.settings.SettingsRepository
import com.sora2nas.app.data.storage.MediaStoreSaver
import com.sora2nas.app.data.storage.ShareFiles
import com.sora2nas.app.platform.ImageIO
import com.sora2nas.app.scan.ScanProcessor
import com.sora2nas.app.scan.ScanSession
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ExportUi(
    val running: Boolean = false,
    val progress: Pair<Int, Int>? = null,
    /** Where the file(s) went, e.g. "Documents/sora2nas/scan_2026.pdf". */
    val savedPath: String? = null,
    val savedUri: Uri? = null,
    val savedMime: String? = null,
    val error: Boolean = false,
)

@HiltViewModel
class PagesViewModel @Inject constructor(
    @ApplicationContext private val context: Context,
    private val session: ScanSession,
    private val processor: ScanProcessor,
    private val settings: SettingsRepository,
    private val history: HistoryRepository,
    private val saver: MediaStoreSaver,
    private val share: ShareFiles,
) : ViewModel() {

    val pages = session.pages
    val quality: StateFlow<ScanQuality> = settings.settings.map { it.scanQuality }
        .stateIn(viewModelScope, SharingStarted.Eagerly, ScanQuality.MAX)

    private val _searchable = MutableStateFlow(false)
    val searchable: StateFlow<Boolean> = _searchable.asStateFlow()

    private val _export = MutableStateFlow(ExportUi())
    val export: StateFlow<ExportUi> = _export.asStateFlow()

    fun setSearchable(v: Boolean) { _searchable.value = v }
    fun setQuality(q: ScanQuality) = viewModelScope.launch { settings.setScanQuality(q) }
    fun move(id: Long, delta: Int) = session.move(id, delta)
    fun delete(id: Long) = session.remove(id)

    fun savePdf() = run(pdf = true)
    fun saveImages() = run(pdf = false)

    private fun run(pdf: Boolean) {
        val list = pages.value
        if (list.isEmpty() || _export.value.running) return
        _export.value = ExportUi(running = true, progress = 0 to list.size)
        viewModelScope.launch {
            try {
                val title = saver.timestampName("scan")
                val q = settings.settings.first().scanQuality
                val saved: MediaStoreSaver.Saved
                val mime: String
                if (pdf) {
                    saved = processor.exportPdf(list, q, _searchable.value, title) { done, total ->
                        _export.value = _export.value.copy(progress = done to total)
                    }
                    mime = "application/pdf"
                } else {
                    saved = processor.exportImages(list, title).first()
                    mime = "image/jpeg"
                }
                val thumb = ImageIO.decodeFile(list.first().thumb, 480)
                history.add(
                    HistoryEntity(
                        type = HistoryType.SCAN,
                        title = if (pdf) title else context.getString(R.string.title_scan_images, list.size),
                        fileUri = saved.uri.toString(),
                        pageCount = list.size,
                    ),
                    thumb,
                )
                thumb.recycle()
                val shownPath = if (pdf || list.size == 1) saved.displayPath else saved.displayPath.substringBeforeLast('/')
                _export.value = ExportUi(savedPath = shownPath, savedUri = saved.uri, savedMime = mime)
            } catch (e: Exception) {
                _export.value = ExportUi(error = true)
            }
        }
    }

    fun shareSaved() {
        val e = _export.value
        val uri = e.savedUri ?: return
        context.startActivity(share.shareIntent(uri, e.savedMime ?: "application/pdf"))
    }

    fun openSaved() {
        val e = _export.value
        val uri = e.savedUri ?: return
        runCatching { context.startActivity(share.viewIntent(uri, e.savedMime ?: "application/pdf")) }
    }

    /** After a successful export the session is cleared (a new scan starts fresh). */
    fun finish() {
        session.clear()
        _export.value = ExportUi()
    }

    fun dismissError() { _export.value = ExportUi() }
}
