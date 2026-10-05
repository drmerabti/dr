package com.sora2nas.app.ui.table

import android.content.Context
import androidx.annotation.StringRes
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.sora2nas.app.R
import com.sora2nas.app.core.export.DocxWriter
import com.sora2nas.app.core.export.XlsxWriter
import com.sora2nas.app.core.table.TableData
import com.sora2nas.app.data.history.HistoryEntity
import com.sora2nas.app.data.history.HistoryRepository
import com.sora2nas.app.data.settings.SettingsRepository
import com.sora2nas.app.data.settings.TableExportFormat
import com.sora2nas.app.data.storage.MediaStoreSaver
import com.sora2nas.app.data.storage.ShareFiles
import com.sora2nas.app.ui.process.ProcessViewModel.Companion.TABLE_SEPARATOR
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class TableUi(
    val item: HistoryEntity? = null,
    val loading: Boolean = true,
    /** One table per PDF page (a single one for an image). */
    val tables: List<TableData> = emptyList(),
    val selected: Int = 0,
    val defaultFormat: TableExportFormat = TableExportFormat.XLSX,
    val saving: Boolean = false,
    val saved: MediaStoreSaver.Saved? = null,
    val savedMime: String = "",
    @StringRes val message: Int? = null,
) {
    val current: TableData? get() = tables.getOrNull(selected)
}

/** Table preview: edit cells, delete rows/columns, export .xlsx / .docx, copy as TSV. */
@HiltViewModel
class TableViewModel @Inject constructor(
    savedState: SavedStateHandle,
    @ApplicationContext private val context: Context,
    private val history: HistoryRepository,
    private val settings: SettingsRepository,
    private val saver: MediaStoreSaver,
    private val share: ShareFiles,
) : ViewModel() {

    private val id: Long = savedState.get<Long>("id") ?: 0L
    private val _ui = MutableStateFlow(TableUi())
    val ui: StateFlow<TableUi> = _ui.asStateFlow()

    init {
        viewModelScope.launch {
            val item = history.get(id)
            val rtl = item?.lang == "rtl"
            val tables = item?.text.orEmpty()
                .split(TABLE_SEPARATOR)
                .filter { it.isNotBlank() }
                .map { TableData.fromTsv(it, rightToLeft = rtl) }
            val format = settings.settings.first().tableExport
            _ui.update { it.copy(item = item, loading = false, tables = tables, defaultFormat = format) }
        }
    }

    fun select(index: Int) = _ui.update { it.copy(selected = index.coerceIn(0, (it.tables.size - 1).coerceAtLeast(0))) }

    fun editCell(row: Int, col: Int, text: String) = mutate { it.withCell(row, col, text.replace('\t', ' ')) }

    fun deleteRow(row: Int) = mutate { t ->
        if (t.rowCount <= 1) t else t.copy(cells = t.cells.filterIndexed { r, _ -> r != row }, merges = emptyList())
    }

    fun deleteColumn(col: Int) = mutate { t ->
        if (t.colCount <= 1) t else t.copy(cells = t.cells.map { r -> r.filterIndexed { c, _ -> c != col } }, merges = emptyList())
    }

    /** Applies [change] to the selected table and saves all tables to history. */
    private fun mutate(change: (TableData) -> TableData) {
        val s = _ui.value
        val cur = s.current ?: return
        val updated = s.tables.toMutableList().also { it[s.selected] = change(cur).normalized() }
        _ui.update { it.copy(tables = updated) }
        viewModelScope.launch { history.updateText(id, updated.joinToString(TABLE_SEPARATOR) { it.toTsv() }) }
    }

    fun tsv(): String = _ui.value.current?.toTsv().orEmpty()

    fun export(format: TableExportFormat) {
        val s = _ui.value
        if (s.tables.isEmpty()) return
        val title = s.item?.title ?: saver.timestampName("sora2nas_table")
        viewModelScope.launch {
            _ui.update { it.copy(saving = true) }
            try {
                val (saved, mime) = when (format) {
                    TableExportFormat.XLSX -> saver.saveDocument(title, "xlsx", MIME_XLSX) { out ->
                        val sheets = s.tables.mapIndexed { i, t -> context.getString(R.string.sheet_name, i + 1) to t }
                        XlsxWriter.write(sheets, out)
                    } to MIME_XLSX
                    TableExportFormat.DOCX -> saver.saveDocument(title, "docx", MIME_DOCX) { out ->
                        DocxWriter.write(s.tables.map { DocxWriter.Table(it) }, out)
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

    companion object {
        const val MIME_XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        const val MIME_DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }
}
