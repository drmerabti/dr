package com.sora2nas.app.ui.result

import android.content.Context
import androidx.annotation.StringRes
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.sora2nas.app.R
import com.sora2nas.app.core.export.DocxWriter
import com.sora2nas.app.core.text.LanguageDetector
import com.sora2nas.app.core.text.OcrLanguage
import com.sora2nas.app.data.history.HistoryEntity
import com.sora2nas.app.data.history.HistoryRepository
import com.sora2nas.app.data.settings.SettingsRepository
import com.sora2nas.app.data.settings.TextExportFormat
import com.sora2nas.app.data.storage.MediaStoreSaver
import com.sora2nas.app.data.storage.ShareFiles
import com.sora2nas.app.platform.OfflineTranslator
import com.sora2nas.app.platform.Speaker
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ResultUi(
    val item: HistoryEntity? = null,
    val loading: Boolean = true,
    /** The editable (original) text. */
    val text: String = "",
    /** Translation shown instead of [text] while [showTranslation] is true. */
    val translation: String? = null,
    val translationTarget: OcrLanguage? = null,
    val showTranslation: Boolean = false,
    val translating: Boolean = false,
    val downloadingModel: Boolean = false,
    val defaultFormat: TextExportFormat = TextExportFormat.DOCX,
    val saving: Boolean = false,
    val saved: MediaStoreSaver.Saved? = null,
    val savedMime: String = "",
    @StringRes val message: Int? = null,
)

/**
 * OCR result screen: edit (auto-saved to history), copy, share, export
 * TXT/DOCX, read aloud and offline translation (AR/FR/EN).
 */
@HiltViewModel
class ResultViewModel @Inject constructor(
    savedState: SavedStateHandle,
    @ApplicationContext private val context: Context,
    private val history: HistoryRepository,
    private val settings: SettingsRepository,
    private val saver: MediaStoreSaver,
    private val share: ShareFiles,
    private val translator: OfflineTranslator,
    private val speaker: Speaker,
) : ViewModel() {

    private val id: Long = savedState.get<Long>("id") ?: 0L
    private val _ui = MutableStateFlow(ResultUi())
    val ui: StateFlow<ResultUi> = _ui.asStateFlow()
    val speaking: StateFlow<Boolean> = speaker.speaking

    private var saveJob: Job? = null
    private var lastSaved: String = ""

    init {
        viewModelScope.launch {
            val item = history.get(id)
            val format = settings.settings.first().textExport
            lastSaved = item?.text.orEmpty()
            _ui.update { it.copy(item = item, loading = false, text = item?.text.orEmpty(), defaultFormat = format) }
        }
    }

    /** Text the user currently sees (original or translation): used by copy/share/export/speak. */
    fun visibleText(): String = _ui.value.let { if (it.showTranslation && it.translation != null) it.translation else it.text }

    fun onTextChange(value: String) {
        val s = _ui.value
        if (s.showTranslation && s.translation != null) {
            _ui.update { it.copy(translation = value) }
            return
        }
        _ui.update { it.copy(text = value) }
        // Debounced auto-save of the user's corrections into history.
        saveJob?.cancel()
        saveJob = viewModelScope.launch {
            delay(700)
            persist(value)
        }
    }

    private suspend fun persist(value: String) {
        if (value == lastSaved || id == 0L) return
        history.updateText(id, value)
        lastSaved = value
    }

    /** Detected language of the original text (stored in history, else re-detected). */
    fun sourceLanguage(): OcrLanguage {
        val tag = _ui.value.item?.lang
        return OcrLanguage.entries.firstOrNull { it.bcp47 == tag } ?: LanguageDetector.detect(_ui.value.text).primary
    }

    fun translate(target: OcrLanguage) {
        val s = _ui.value
        if (s.text.isBlank()) return
        val from = sourceLanguage()
        if (from == target) {
            _ui.update { it.copy(showTranslation = false) }
            return
        }
        if (s.translation != null && s.translationTarget == target) {
            _ui.update { it.copy(showTranslation = true) }
            return
        }
        speaker.stop()
        viewModelScope.launch {
            _ui.update { it.copy(translating = true) }
            try {
                val out = translator.translate(s.text, from, target) { _ui.update { it.copy(downloadingModel = true) } }
                _ui.update { it.copy(translation = out, translationTarget = target, showTranslation = true) }
            } catch (e: Exception) {
                _ui.update { it.copy(message = R.string.error_translate) }
            } finally {
                _ui.update { it.copy(translating = false, downloadingModel = false) }
            }
        }
    }

    fun setShowTranslation(show: Boolean) = _ui.update { it.copy(showTranslation = show && it.translation != null) }

    fun toggleSpeak() {
        if (speaking.value) {
            speaker.stop()
            return
        }
        val s = _ui.value
        val lang = if (s.showTranslation && s.translationTarget != null) s.translationTarget else sourceLanguage()
        speaker.speak(visibleText(), lang.bcp47) { result ->
            when (result) {
                Speaker.Result.LANGUAGE_MISSING -> _ui.update { it.copy(message = R.string.tts_missing_language) }
                Speaker.Result.ERROR -> _ui.update { it.copy(message = R.string.tts_error) }
                Speaker.Result.STARTED -> Unit
            }
        }
    }

    fun shareText() {
        context.startActivity(share.shareText(visibleText()))
    }

    fun export(format: TextExportFormat) {
        val text = visibleText()
        if (text.isBlank()) return
        val title = _ui.value.item?.title ?: saver.timestampName("sora2nas")
        viewModelScope.launch {
            _ui.update { it.copy(saving = true) }
            try {
                val (saved, mime) = when (format) {
                    TextExportFormat.TXT -> saver.saveDocument(title, "txt", MIME_TXT) { out ->
                        // UTF-8 BOM so old Windows editors open Arabic correctly.
                        out.write(byteArrayOf(0xEF.toByte(), 0xBB.toByte(), 0xBF.toByte()))
                        out.write(text.replace("\n", "\r\n").toByteArray(Charsets.UTF_8))
                    } to MIME_TXT
                    TextExportFormat.DOCX -> saver.saveDocument(title, "docx", MIME_DOCX) { out ->
                        DocxWriter.writeText(text, out, title = null)
                    } to MIME_DOCX
                }
                _ui.update { it.copy(saved = saved, savedMime = mime) }
            } catch (e: Exception) {
                _ui.update { it.copy(message = R.string.error_save) }
            } finally {
                _ui.update { it.copy(saving = false) }
            }
        }
    }

    fun shareSaved() {
        val s = _ui.value.saved ?: return
        context.startActivity(share.shareIntent(s.uri, _ui.value.savedMime))
    }

    fun openSaved() {
        val s = _ui.value.saved ?: return
        try {
            context.startActivity(share.viewIntent(s.uri, _ui.value.savedMime))
        } catch (e: Exception) {
            _ui.update { it.copy(message = R.string.no_app_to_open) }
        }
    }

    fun dismissSaved() = _ui.update { it.copy(saved = null) }
    fun dismissMessage() = _ui.update { it.copy(message = null) }

    override fun onCleared() {
        speaker.stop()
        // Flush a pending edit: viewModelScope is already cancelled here.
        val pending = _ui.value.text
        if (pending != lastSaved && id != 0L) {
            CoroutineScope(SupervisorJob() + Dispatchers.IO).launch { history.updateText(id, pending) }
        }
    }

    companion object {
        const val MIME_TXT = "text/plain"
        const val MIME_DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }
}
