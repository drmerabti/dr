package com.sora2nas.app.ui.navigation

import android.content.Context
import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.navigation.NavController
import com.sora2nas.app.data.IncomingShare
import com.sora2nas.app.data.WorkKind
import com.sora2nas.app.data.WorkQueue
import com.sora2nas.app.data.WorkRequest
import com.sora2nas.app.data.history.HistoryEntity
import com.sora2nas.app.data.history.HistoryType
import com.sora2nas.app.data.settings.SettingsRepository
import com.sora2nas.app.data.storage.ShareFiles
import com.sora2nas.app.data.usage.UsageRepository
import com.sora2nas.app.imaging.ScanAdjustments
import com.sora2nas.app.scan.ScanProcessor
import com.sora2nas.app.scan.ScanSession
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import javax.inject.Inject

/** App-wide actions used by the navigation graph. */
@HiltViewModel
class MainViewModel @Inject constructor(
    @ApplicationContext private val context: Context,
    val incoming: IncomingShare,
    private val usage: UsageRepository,
    private val queue: WorkQueue,
    private val session: ScanSession,
    private val processor: ScanProcessor,
    private val settings: SettingsRepository,
    private val share: ShareFiles,
) : ViewModel() {

    private val _importing = MutableStateFlow(false)
    val importing: StateFlow<Boolean> = _importing.asStateFlow()

    private val _openError = MutableStateFlow(false)
    val openError: StateFlow<Boolean> = _openError.asStateFlow()

    init { share.cleanup() }

    fun canConvert(): Boolean { usage.refresh(); return usage.canConvert(1) }

    /** Queues a conversion. False = free quota used up (show the paywall). */
    fun requestWork(kind: WorkKind, uris: List<Uri>): Boolean {
        if (!canConvert()) return false
        queue.request = WorkRequest(kind, uris)
        return true
    }

    /** Shared images -> scan pages (auto-crop + colour enhancement), then the pages screen. */
    fun addImagesToScan(uris: List<Uri>, onDone: () -> Unit) {
        viewModelScope.launch {
            _importing.value = true
            try {
                val quality = settings.settings.first().scanQuality
                for (u in uris) {
                    val p = processor.prepareFromUri(u, quality)
                    session.add(processor.buildPage(p.original, p.detected, 0, ScanAdjustments()))
                }
            } finally {
                _importing.value = false
            }
            onDone()
        }
    }

    fun openHistoryItem(item: HistoryEntity, nav: NavController) {
        when (item.type) {
            HistoryType.IMAGE_TEXT, HistoryType.PDF_TEXT -> nav.navigate(Routes.result(item.id))
            HistoryType.TABLE -> nav.navigate(Routes.table(item.id))
            HistoryType.SCAN -> {
                val uri = item.fileUri?.let(Uri::parse) ?: return
                val mime = runCatching { context.contentResolver.getType(uri) }.getOrNull() ?: "application/pdf"
                try {
                    context.startActivity(share.viewIntent(uri, mime))
                } catch (e: Exception) {
                    _openError.value = true
                }
            }
        }
    }

    fun clearOpenError() { _openError.value = false }
}
