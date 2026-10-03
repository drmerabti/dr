package com.sora2nas.app.ui.settings

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.Restore
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material.icons.filled.WorkspacePremium
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.sora2nas.app.R
import com.sora2nas.app.billing.BillingEvent
import com.sora2nas.app.data.settings.ScanQuality
import com.sora2nas.app.data.settings.SettingsRepository
import com.sora2nas.app.data.settings.TableExportFormat
import com.sora2nas.app.data.settings.TextExportFormat
import com.sora2nas.app.ui.components.AppTopBar
import com.sora2nas.app.ui.components.IconBadge
import com.sora2nas.app.ui.components.MessageDialog
import com.sora2nas.app.ui.theme.Amber
import com.sora2nas.app.ui.theme.Blue
import com.sora2nas.app.ui.theme.InkSoft
import com.sora2nas.app.ui.theme.Teal
import com.sora2nas.app.ui.theme.Violet

@Composable
fun SettingsScreen(onBack: () -> Unit, onUpgrade: () -> Unit, vm: SettingsViewModel = hiltViewModel()) {
    val s by vm.settings.collectAsStateWithLifecycle()
    val isPro by vm.isPro.collectAsStateWithLifecycle()
    val event by vm.events.collectAsStateWithLifecycle()
    var showAbout by remember { mutableStateOf(false) }

    Scaffold(topBar = { AppTopBar(stringResource(R.string.settings), onBack) }, containerColor = MaterialTheme.colorScheme.background) { padding ->
        Column(
            Modifier.fillMaxSize().padding(padding).verticalScroll(rememberScrollState()).padding(horizontal = 16.dp).navigationBarsPadding(),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Section(Icons.Filled.Language, Blue, stringResource(R.string.settings_language)) {
                Chips(
                    // Each language is shown in its own script so it can be found from any UI language.
                    listOf(
                        SettingsRepository.LANG_EN to "English",
                        SettingsRepository.LANG_AR to "العربية",
                        SettingsRepository.LANG_FR to "Français",
                    ),
                    s.language,
                    vm::setLanguage,
                )
            }
            Section(Icons.Filled.Tune, Teal, stringResource(R.string.settings_scan_quality)) {
                Chips(
                    listOf(
                        ScanQuality.NORMAL to stringResource(R.string.quality_normal),
                        ScanQuality.HIGH to stringResource(R.string.quality_high),
                        ScanQuality.MAX to stringResource(R.string.quality_max),
                    ),
                    s.scanQuality,
                ) { vm.setQuality(it) }
                Spacer(Modifier.height(10.dp))
                Label(stringResource(R.string.settings_text_format))
                Chips(
                    listOf(TextExportFormat.DOCX to stringResource(R.string.export_docx), TextExportFormat.TXT to stringResource(R.string.export_txt)),
                    s.textExport,
                ) { vm.setTextExport(it) }
                Spacer(Modifier.height(10.dp))
                Label(stringResource(R.string.settings_table_format))
                Chips(
                    listOf(TableExportFormat.XLSX to stringResource(R.string.export_xlsx), TableExportFormat.DOCX to stringResource(R.string.export_docx)),
                    s.tableExport,
                ) { vm.setTableExport(it) }
            }
            Section(Icons.Filled.WorkspacePremium, Amber, stringResource(R.string.settings_subscription)) {
                Text(
                    stringResource(if (isPro) R.string.pro_active else R.string.free_plan_desc),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Row {
                    if (isPro) TextButton(onClick = vm::manageSubscription) { Text(stringResource(R.string.manage_subscription)) }
                    else TextButton(onClick = onUpgrade) { Text(stringResource(R.string.upgrade)) }
                    TextButton(onClick = vm::restore) {
                        Icon(Icons.Filled.Restore, null, Modifier.size(18.dp))
                        Spacer(Modifier.size(4.dp))
                        Text(stringResource(R.string.restore_purchases))
                    }
                }
            }
            Section(Icons.Filled.Info, Violet, stringResource(R.string.about)) {
                Text(stringResource(R.string.version, vm.versionName), style = MaterialTheme.typography.bodyMedium)
                Text(stringResource(R.string.on_device_note), style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                TextButton(onClick = { showAbout = true }) { Text(stringResource(R.string.licenses)) }
            }
            Spacer(Modifier.height(16.dp))
        }
    }

    if (showAbout) {
        AlertDialog(
            onDismissRequest = { showAbout = false },
            title = { Text(stringResource(R.string.licenses)) },
            text = { Text(stringResource(R.string.licenses_text), style = MaterialTheme.typography.bodySmall) },
            confirmButton = { TextButton(onClick = { showAbout = false }) { Text(stringResource(R.string.ok)) } },
        )
    }
    event?.let { e ->
        val msg = when (e) {
            BillingEvent.Purchased -> stringResource(R.string.purchase_success)
            BillingEvent.Restored -> stringResource(R.string.restore_success)
            BillingEvent.NothingToRestore -> stringResource(R.string.restore_nothing)
            is BillingEvent.Error -> stringResource(R.string.purchase_error)
        }
        MessageDialog(msg, vm::consumeEvent)
    }
}

@Composable
private fun Section(icon: ImageVector, color: Color, title: String, content: @Composable () -> Unit) {
    Card(
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        modifier = Modifier.fillMaxWidth(),
    ) {
        Column(Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconBadge(icon, color, 36)
                Spacer(Modifier.size(10.dp))
                Text(title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            }
            HorizontalDivider(Modifier.padding(vertical = 10.dp), color = MaterialTheme.colorScheme.outlineVariant)
            content()
        }
    }
}

@Composable
private fun Label(text: String) = Text(text, style = MaterialTheme.typography.labelLarge, color = InkSoft)

@Composable
private fun <T> Chips(options: List<Pair<T, String>>, selected: T, onSelect: (T) -> Unit) {
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        options.forEach { (value, label) ->
            FilterChip(selected = value == selected, onClick = { onSelect(value) }, label = { Text(label) })
        }
    }
}
