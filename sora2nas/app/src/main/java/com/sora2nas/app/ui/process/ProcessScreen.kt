package com.sora2nas.app.ui.process

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ErrorOutline
import androidx.compose.material.icons.filled.WorkspacePremium
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.sora2nas.app.R
import com.sora2nas.app.ui.components.AppTopBar
import com.sora2nas.app.ui.components.ProgressPanel
import com.sora2nas.app.ui.theme.Amber

@Composable
fun ProcessScreen(
    onBack: () -> Unit,
    onResult: (Long, Boolean) -> Unit,
    onPaywall: () -> Unit,
    vm: ProcessViewModel = hiltViewModel(),
) {
    val state by vm.state.collectAsStateWithLifecycle()
    LaunchedEffect(state) {
        (state as? ProcessUi.Done)?.let { onResult(it.historyId, it.isTable) }
    }
    Scaffold(topBar = { AppTopBar(stringResource(R.string.processing), onBack = { vm.cancel(); onBack() }) }) { padding ->
        Column(Modifier.fillMaxSize().padding(padding)) {
            when (val s = state) {
                is ProcessUi.Running -> {
                    ProgressPanel(stringResource(s.label), s.progress, s.detail, Modifier.weight(1f))
                    Text(
                        stringResource(R.string.on_device_note),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.fillMaxWidth().padding(24.dp),
                    )
                }
                is ProcessUi.Failed -> Message(Icons.Filled.ErrorOutline, MaterialTheme.colorScheme.error, stringResource(s.message)) {
                    Button(onClick = vm::start) { Text(stringResource(R.string.retry)) }
                    TextButton(onClick = onBack) { Text(stringResource(R.string.back)) }
                }
                is ProcessUi.LimitReached -> Message(Icons.Filled.WorkspacePremium, Amber, stringResource(R.string.limit_reached)) {
                    Button(onClick = onPaywall) { Text(stringResource(R.string.upgrade_unlimited)) }
                    if (s.partialId != null) {
                        OutlinedButton(onClick = { onResult(s.partialId, false) }) { Text(stringResource(R.string.see_converted)) }
                    }
                    TextButton(onClick = onBack) { Text(stringResource(R.string.later)) }
                }
                is ProcessUi.Done -> ProgressPanel(stringResource(R.string.done), 1f)
            }
        }
    }
}

@Composable
private fun Message(icon: androidx.compose.ui.graphics.vector.ImageVector, tint: androidx.compose.ui.graphics.Color, text: String, actions: @Composable () -> Unit) {
    Column(
        Modifier.fillMaxSize().padding(32.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Icon(icon, null, tint = tint, modifier = Modifier.size(64.dp))
        Spacer(Modifier.height(16.dp))
        Text(text, style = MaterialTheme.typography.titleMedium, textAlign = TextAlign.Center)
        Spacer(Modifier.height(24.dp))
        Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(8.dp)) { actions() }
    }
}
