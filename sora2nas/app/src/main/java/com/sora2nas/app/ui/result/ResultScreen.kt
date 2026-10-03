package com.sora2nas.app.ui.result

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.widget.Toast
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.VolumeUp
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Save
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material.icons.filled.Translate
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.sora2nas.app.R
import com.sora2nas.app.core.text.OcrLanguage
import com.sora2nas.app.data.settings.TextExportFormat
import com.sora2nas.app.ui.components.AppTopBar
import com.sora2nas.app.ui.components.MessageDialog
import com.sora2nas.app.ui.components.ProgressPanel
import com.sora2nas.app.ui.components.SavedShareSheet

/** Label of a language in the current UI language. */
@Composable
fun languageName(lang: OcrLanguage): String = stringResource(
    when (lang) {
        OcrLanguage.ARABIC -> R.string.lang_arabic
        OcrLanguage.FRENCH -> R.string.lang_french
        OcrLanguage.ENGLISH -> R.string.lang_english
    },
)

fun copyToClipboard(context: Context, text: String) {
    val cm = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
    cm.setPrimaryClip(ClipData.newPlainText("sora2nas", text))
    Toast.makeText(context, R.string.copied, Toast.LENGTH_SHORT).show()
}

@Composable
fun ResultScreen(historyId: Long, onBack: () -> Unit, vm: ResultViewModel = hiltViewModel()) {
    val ui by vm.ui.collectAsStateWithLifecycle()
    val speaking by vm.speaking.collectAsStateWithLifecycle()
    val context = LocalContext.current

    Scaffold(
        topBar = {
            AppTopBar(ui.item?.title ?: stringResource(R.string.result_title), onBack) {
                IconButton(onClick = vm::shareText, enabled = ui.text.isNotBlank()) {
                    Icon(Icons.Filled.Share, contentDescription = stringResource(R.string.share))
                }
            }
        },
        containerColor = MaterialTheme.colorScheme.background,
    ) { padding ->
        if (ui.loading) {
            ProgressPanel(stringResource(R.string.preparing), null, modifier = Modifier.padding(padding))
            return@Scaffold
        }
        if (ui.item == null) {
            Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                Text(stringResource(R.string.item_not_found))
            }
            return@Scaffold
        }
        Column(
            Modifier.fillMaxSize().padding(padding).imePadding().navigationBarsPadding().padding(horizontal = 16.dp),
        ) {
            // Original / translation switch (only once a translation exists).
            if (ui.translation != null && ui.translationTarget != null) {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.padding(bottom = 8.dp)) {
                    FilterChip(selected = !ui.showTranslation, onClick = { vm.setShowTranslation(false) }, label = { Text(stringResource(R.string.show_original)) })
                    FilterChip(
                        selected = ui.showTranslation,
                        onClick = { vm.setShowTranslation(true) },
                        label = { Text(stringResource(R.string.translation_to, languageName(ui.translationTarget!!))) },
                    )
                }
            }
            if (ui.translating) {
                Text(
                    stringResource(if (ui.downloadingModel) R.string.downloading_language else R.string.translating),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                LinearProgressIndicator(Modifier.fillMaxWidth().padding(vertical = 6.dp))
            }

            val shown = if (ui.showTranslation && ui.translation != null) ui.translation!! else ui.text
            OutlinedTextField(
                value = shown,
                onValueChange = vm::onTextChange,
                modifier = Modifier.fillMaxWidth().weight(1f),
                // Content direction: Arabic paragraphs flow RTL, French/English LTR, whatever the UI language.
                textStyle = MaterialTheme.typography.bodyLarge.copy(fontSize = 17.sp, lineHeight = 27.sp, textDirection = TextDirection.Content),
                shape = RoundedCornerShape(16.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    unfocusedContainerColor = MaterialTheme.colorScheme.surface,
                    focusedContainerColor = MaterialTheme.colorScheme.surface,
                ),
                placeholder = { Text(stringResource(R.string.error_no_text)) },
            )
            Spacer(Modifier.height(12.dp))

            // The main action: one big "Copy all" button.
            Button(
                onClick = { copyToClipboard(context, vm.visibleText()) },
                enabled = shown.isNotBlank(),
                modifier = Modifier.fillMaxWidth().height(58.dp),
                shape = RoundedCornerShape(16.dp),
            ) {
                Icon(Icons.Filled.ContentCopy, null)
                Spacer(Modifier.size(10.dp))
                Text(stringResource(R.string.copy_all), fontSize = 18.sp, fontWeight = FontWeight.Bold)
            }
            Spacer(Modifier.height(10.dp))

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.padding(bottom = 12.dp)) {
                OutlinedButton(onClick = vm::toggleSpeak, enabled = shown.isNotBlank(), modifier = Modifier.weight(1f), contentPadding = ButtonDefaults.TextButtonContentPadding) {
                    Icon(if (speaking) Icons.Filled.Stop else Icons.AutoMirrored.Filled.VolumeUp, null, Modifier.size(20.dp))
                    Spacer(Modifier.size(4.dp))
                    Text(stringResource(if (speaking) R.string.stop_reading else R.string.read_aloud), maxLines = 1)
                }
                TranslateButton(enabled = ui.text.isNotBlank() && !ui.translating, source = vm.sourceLanguage(), onPick = vm::translate, modifier = Modifier.weight(1f))
                ExportButton(enabled = shown.isNotBlank() && !ui.saving, default = ui.defaultFormat, onPick = vm::export, modifier = Modifier.weight(1f))
            }
        }
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

@Composable
private fun TranslateButton(enabled: Boolean, source: OcrLanguage, onPick: (OcrLanguage) -> Unit, modifier: Modifier) {
    var open by remember { mutableStateOf(false) }
    Box(modifier) {
        OutlinedButton(onClick = { open = true }, enabled = enabled, modifier = Modifier.fillMaxWidth(), contentPadding = ButtonDefaults.TextButtonContentPadding) {
            Icon(Icons.Filled.Translate, null, Modifier.size(20.dp))
            Spacer(Modifier.size(4.dp))
            Text(stringResource(R.string.translate), maxLines = 1)
        }
        DropdownMenu(expanded = open, onDismissRequest = { open = false }) {
            Text(
                stringResource(R.string.translate_offline_note),
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp),
            )
            OcrLanguage.entries.filter { it != source }.forEach { lang ->
                DropdownMenuItem(text = { Text(languageName(lang)) }, onClick = { open = false; onPick(lang) })
            }
        }
    }
}

@Composable
private fun ExportButton(enabled: Boolean, default: TextExportFormat, onPick: (TextExportFormat) -> Unit, modifier: Modifier) {
    var open by remember { mutableStateOf(false) }
    Box(modifier) {
        OutlinedButton(onClick = { open = true }, enabled = enabled, modifier = Modifier.fillMaxWidth(), contentPadding = ButtonDefaults.TextButtonContentPadding) {
            Icon(Icons.Filled.Save, null, Modifier.size(20.dp))
            Spacer(Modifier.size(4.dp))
            Text(stringResource(R.string.export), maxLines = 1)
        }
        DropdownMenu(expanded = open, onDismissRequest = { open = false }) {
            // The default format from Settings is listed first.
            val order = if (default == TextExportFormat.DOCX) listOf(TextExportFormat.DOCX, TextExportFormat.TXT) else listOf(TextExportFormat.TXT, TextExportFormat.DOCX)
            order.forEach { f ->
                DropdownMenuItem(
                    leadingIcon = { Icon(Icons.Filled.Description, null) },
                    text = { Text(stringResource(if (f == TextExportFormat.DOCX) R.string.export_docx else R.string.export_txt)) },
                    onClick = { open = false; onPick(f) },
                )
            }
        }
    }
}
