package com.sora2nas.app.ui.table

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.GridOn
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDirection
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.sora2nas.app.R
import com.sora2nas.app.core.table.TableData
import com.sora2nas.app.data.settings.TableExportFormat
import com.sora2nas.app.ui.components.AppTopBar
import com.sora2nas.app.ui.components.MessageDialog
import com.sora2nas.app.ui.components.ProgressPanel
import com.sora2nas.app.ui.components.SavedShareSheet
import com.sora2nas.app.ui.result.copyToClipboard
import com.sora2nas.app.ui.theme.Amber

private data class EditTarget(val row: Int, val col: Int, val text: String)

@Composable
fun TableScreen(historyId: Long, onBack: () -> Unit, vm: TableViewModel = hiltViewModel()) {
    val ui by vm.ui.collectAsStateWithLifecycle()
    val context = LocalContext.current
    var editing by remember { mutableStateOf<EditTarget?>(null) }

    Scaffold(
        topBar = {
            AppTopBar(ui.item?.title ?: stringResource(R.string.home_table), onBack) {
                IconButton(onClick = { copyToClipboard(context, vm.tsv()) }, enabled = ui.current != null) {
                    Icon(Icons.Filled.ContentCopy, contentDescription = stringResource(R.string.copy_table))
                }
            }
        },
        containerColor = MaterialTheme.colorScheme.background,
    ) { padding ->
        if (ui.loading) {
            ProgressPanel(stringResource(R.string.preparing), null, modifier = Modifier.padding(padding))
            return@Scaffold
        }
        val table = ui.current
        if (table == null) {
            Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) { Text(stringResource(R.string.error_no_table)) }
            return@Scaffold
        }
        Column(Modifier.fillMaxSize().padding(padding).navigationBarsPadding()) {
            if (ui.tables.size > 1) {
                Row(Modifier.horizontalScroll(rememberScrollState()).padding(horizontal = 12.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    ui.tables.indices.forEach { i ->
                        FilterChip(selected = i == ui.selected, onClick = { vm.select(i) }, label = { Text(stringResource(R.string.table_n, i + 1)) })
                    }
                }
            }
            Text(
                stringResource(R.string.table_edit_hint, table.rowCount, table.colCount),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp),
            )
            Surface(
                shape = RoundedCornerShape(14.dp),
                color = MaterialTheme.colorScheme.surface,
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                modifier = Modifier.weight(1f).fillMaxWidth().padding(horizontal = 12.dp),
            ) {
                TableGrid(table) { r, c -> editing = EditTarget(r, c, table.cell(r, c)) }
            }
            Row(Modifier.padding(12.dp), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                val primary = ui.defaultFormat
                val secondary = if (primary == TableExportFormat.XLSX) TableExportFormat.DOCX else TableExportFormat.XLSX
                Button(onClick = { vm.export(primary) }, enabled = !ui.saving, modifier = Modifier.weight(1f).height(54.dp), shape = RoundedCornerShape(16.dp)) {
                    Icon(if (primary == TableExportFormat.XLSX) Icons.Filled.GridOn else Icons.Filled.Description, null)
                    Spacer(Modifier.size(8.dp))
                    Text(stringResource(formatLabel(primary)), fontWeight = FontWeight.Bold)
                }
                OutlinedButton(onClick = { vm.export(secondary) }, enabled = !ui.saving, modifier = Modifier.weight(1f).height(54.dp), shape = RoundedCornerShape(16.dp)) {
                    Icon(if (secondary == TableExportFormat.XLSX) Icons.Filled.GridOn else Icons.Filled.Description, null)
                    Spacer(Modifier.size(8.dp))
                    Text(stringResource(formatLabel(secondary)))
                }
            }
        }
    }

    editing?.let { target ->
        CellEditDialog(
            target = target,
            onSave = { vm.editCell(target.row, target.col, it); editing = null },
            onDeleteRow = { vm.deleteRow(target.row); editing = null },
            onDeleteColumn = { vm.deleteColumn(target.col); editing = null },
            onDismiss = { editing = null },
        )
    }
    ui.saved?.let { saved ->
        SavedShareSheet(
            path = stringResource(R.string.saved_to, saved.displayPath),
            uris = listOf(saved.uri),
            mime = ui.savedMime,
            subject = ui.item?.title,
            onOpen = vm::openSaved,
            onDone = vm::dismissSaved,
        )
    }
    ui.message?.let { MessageDialog(stringResource(it), vm::dismissMessage) }
}

private fun formatLabel(f: TableExportFormat) = if (f == TableExportFormat.XLSX) R.string.export_xlsx else R.string.export_docx

/**
 * Scrollable grid. Column 0 is the first column in reading order, so Arabic
 * tables are laid out right-to-left whatever the UI language.
 */
@Composable
private fun TableGrid(table: TableData, onCell: (Int, Int) -> Unit) {
    val widths: List<Dp> = remember(table) {
        (0 until table.colCount).map { c ->
            val longest = (0 until table.rowCount).maxOfOrNull { r -> table.cell(r, c).lines().maxOfOrNull { it.length } ?: 0 } ?: 0
            (longest * 9 + 24).coerceIn(72, 260).dp
        }
    }
    val direction = if (table.rightToLeft) LayoutDirection.Rtl else LayoutDirection.Ltr
    CompositionLocalProvider(LocalLayoutDirection provides direction) {
        Box(Modifier.fillMaxSize().clip(RoundedCornerShape(14.dp)).verticalScroll(rememberScrollState()).horizontalScroll(rememberScrollState())) {
            Column {
                for (r in 0 until table.rowCount) {
                    Row {
                        for (c in 0 until table.colCount) {
                            val header = r == 0
                            Box(
                                Modifier
                                    .width(widths[c])
                                    .heightIn(min = 44.dp)
                                    .background(if (header) Amber.copy(alpha = 0.14f) else MaterialTheme.colorScheme.surface)
                                    .border(0.5.dp, MaterialTheme.colorScheme.outlineVariant)
                                    .clickable { onCell(r, c) }
                                    .padding(horizontal = 8.dp, vertical = 8.dp),
                                contentAlignment = Alignment.CenterStart,
                            ) {
                                Text(
                                    table.cell(r, c),
                                    style = MaterialTheme.typography.bodyMedium.copy(textDirection = TextDirection.Content),
                                    fontWeight = if (header) FontWeight.Bold else FontWeight.Normal,
                                    maxLines = 4,
                                    overflow = TextOverflow.Ellipsis,
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun CellEditDialog(
    target: EditTarget,
    onSave: (String) -> Unit,
    onDeleteRow: () -> Unit,
    onDeleteColumn: () -> Unit,
    onDismiss: () -> Unit,
) {
    var value by remember(target) { mutableStateOf(target.text) }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(stringResource(R.string.edit_cell, target.row + 1, target.col + 1)) },
        text = {
            Column {
                OutlinedTextField(
                    value = value,
                    onValueChange = { value = it },
                    modifier = Modifier.fillMaxWidth(),
                    textStyle = MaterialTheme.typography.bodyLarge.copy(textDirection = TextDirection.Content),
                    minLines = 2,
                )
                Spacer(Modifier.height(8.dp))
                Row {
                    TextButton(onClick = onDeleteRow) { Text(stringResource(R.string.delete_row)) }
                    TextButton(onClick = onDeleteColumn) { Text(stringResource(R.string.delete_column)) }
                }
            }
        },
        confirmButton = { TextButton(onClick = { onSave(value) }) { Text(stringResource(R.string.ok)) } },
        dismissButton = { TextButton(onClick = onDismiss) { Text(stringResource(R.string.back)) } },
    )
}
