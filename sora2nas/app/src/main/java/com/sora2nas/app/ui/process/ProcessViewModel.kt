package com.sora2nas.app.ui.process

import android.content.Context
import android.graphics.Bitmap
import android.net.Uri
import android.provider.OpenableColumns
import android.text.format.DateFormat
import androidx.annotation.StringRes
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.sora2nas.app.R
import com.sora2nas.app.core.table.TableData
import com.sora2nas.app.data.WorkKind
import com.sora2nas.app.data.WorkQueue
import com.sora2nas.app.data.history.HistoryEntity
import com.sora2nas.app.data.history.HistoryRepository
import com.sora2nas.app.data.history.HistoryType
import com.sora2nas.app.data.usage.UsageRepository
import com.sora2nas.app.platform.OcrService
import com.sora2nas.app.platform.PdfPasswordException
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.util.Date
import javax.inject.Inject

sealed interface ProcessUi {
    data class Running(@StringRes val label: Int, val progress: Float?, val detail: String?) : ProcessUi
    data class Done(val historyId: Long, val isTable: Boolean) : ProcessUi
    data class Failed(@StringRes val message: Int) : ProcessUi
    /** Free quota used up. [partialId] = results already converted in a batch. */
    data class LimitReached(val partialId: Long?) : ProcessUi
}

/** Runs the queued conversion (image/PDF -> text, image/PDF -> table) on-device. */
@HiltViewModel
class ProcessViewModel @Inject constructor(
    @ApplicationContext private val context: Context,
    private val queue: WorkQueue,
    private val ocr: OcrService,
    private val history: HistoryRepository,
    private val usage: UsageRepository,
) : ViewModel() {

    private val _state = MutableStateFlow<ProcessUi>(ProcessUi.Running(R.string.preparing, null, null))
    val state: StateFlow<ProcessUi> = _state.asStateFlow()
    private var job: Job? = null

    init { start() }

    fun start() {
        val request = queue.request ?: run { _state.value = ProcessUi.Failed(R.string.error_generic); return }
        job?.cancel()
        job = viewModelScope.launch {
            try {
                when (request.kind) {
                    WorkKind.IMAGE_TEXT -> imagesToText(request.uris)
                    WorkKind.PDF_TEXT -> pdfToText(request.uris.first())
                    WorkKind.TABLE_IMAGE -> imageToTable(request.uris.first())
                    WorkKind.TABLE_PDF -> pdfToTable(request.uris.first())
                }
                queue.request = null
            } catch (e: CancellationException) {
                throw e
            } catch (e: PdfPasswordException) {
                _state.value = ProcessUi.Failed(R.string.error_pdf_password)
            } catch (e: OutOfMemoryError) {
                _state.value = ProcessUi.Failed(R.string.error_too_large)
            } catch (e: Exception) {
                _state.value = ProcessUi.Failed(R.string.error_generic)
            }
        }
    }

    fun cancel() { job?.cancel() }

    private fun now() = DateFormat.getMediumDateFormat(context).format(Date()) + " " + DateFormat.getTimeFormat(context).format(Date())

    /** Batch: every image is one conversion; stops cleanly when the free quota runs out. */
    private suspend fun imagesToText(uris: List<Uri>) {
        val parts = ArrayList<String>()
        var thumb: Bitmap? = null
        var lang = "ar"
        for ((i, uri) in uris.withIndex()) {
            if (!usage.canConvert(1)) {
                val partial = if (parts.isNotEmpty()) saveText(parts, uris.size, thumb, lang) else null
                _state.value = ProcessUi.LimitReached(partial)
                return
            }
            _state.value = ProcessUi.Running(
                R.string.reading_text,
                if (uris.size > 1) i.toFloat() / uris.size else null,
                if (uris.size > 1) context.getString(R.string.image_x_of_y, i + 1, uris.size) else null,
            )
            val r = ocr.imageToText(uri)
            if (r.text.isNotBlank()) {
                usage.recordConversion()
                parts += if (uris.size > 1) "— ${i + 1} —\n${r.text}" else r.text
                lang = r.languageTag
            }
            if (thumb == null) thumb = r.thumbnail else r.thumbnail?.recycle()
        }
        if (parts.isEmpty()) {
            _state.value = ProcessUi.Failed(R.string.error_no_text)
            return
        }
        _state.value = ProcessUi.Done(saveText(parts, uris.size, thumb, lang), false)
    }

    private suspend fun saveText(parts: List<String>, count: Int, thumb: Bitmap?, lang: String): Long {
        val title = if (count > 1) context.getString(R.string.title_batch, count, now()) else context.getString(R.string.title_image_text, now())
        return history.add(
            HistoryEntity(type = HistoryType.IMAGE_TEXT, title = title, text = parts.joinToString("\n\n"), pageCount = parts.size, lang = lang),
            thumb,
        )
    }

    private suspend fun pdfToText(uri: Uri) {
        val r = ocr.pdfToText(uri) { done, total ->
            _state.value = ProcessUi.Running(
                R.string.reading_pdf,
                if (total > 0) done.toFloat() / total else null,
                context.getString(R.string.page_x_of_y, (done + 1).coerceAtMost(total), total),
            )
        }
        if (r.text.isBlank()) { _state.value = ProcessUi.Failed(R.string.error_no_text); return }
        usage.recordConversion() // one PDF = one conversion, whatever its page count
        val id = history.add(
            HistoryEntity(type = HistoryType.PDF_TEXT, title = displayName(uri) ?: context.getString(R.string.title_pdf_text, now()), text = r.text, pageCount = r.pageCount, lang = r.languageTag),
            r.thumbnail,
        )
        _state.value = ProcessUi.Done(id, false)
    }

    private suspend fun imageToTable(uri: Uri) {
        _state.value = ProcessUi.Running(R.string.reading_table, 0f, null)
        val (table, thumb) = ocr.imageToTable(uri) { p -> _state.value = ProcessUi.Running(R.string.reading_table, p, null) }
        saveTables(listOf(table), thumb, null)
    }

    private suspend fun pdfToTable(uri: Uri) {
        _state.value = ProcessUi.Running(R.string.reading_table, 0f, null)
        val (tables, thumb) = ocr.pdfToTables(uri) { p -> _state.value = ProcessUi.Running(R.string.reading_table, p, null) }
        saveTables(tables, thumb, displayName(uri))
    }

    private suspend fun saveTables(tables: List<TableData>, thumb: Bitmap?, name: String?) {
        val nonEmpty = tables.filter { !it.isEmpty() }
        if (nonEmpty.isEmpty()) { _state.value = ProcessUi.Failed(R.string.error_no_table); return }
        usage.recordConversion()
        val id = history.add(
            HistoryEntity(
                type = HistoryType.TABLE,
                title = name ?: context.getString(R.string.title_table, now()),
                text = nonEmpty.joinToString(TABLE_SEPARATOR) { it.toTsv() },
                pageCount = nonEmpty.size,
                lang = if (nonEmpty.first().rightToLeft) "rtl" else "ltr",
            ),
            thumb,
        )
        _state.value = ProcessUi.Done(id, true)
    }

    private fun displayName(uri: Uri): String? = runCatching {
        context.contentResolver.query(uri, arrayOf(OpenableColumns.DISPLAY_NAME), null, null, null)?.use { c ->
            if (c.moveToFirst()) c.getString(0)?.substringBeforeLast('.') else null
        }
    }.getOrNull()?.takeIf { it.isNotBlank() && !it.startsWith("in_") }

    companion object {
        /** Tables of a multi-page PDF are stored as TSV blocks separated by a form feed. */
        const val TABLE_SEPARATOR = "\u000C"
    }
}
