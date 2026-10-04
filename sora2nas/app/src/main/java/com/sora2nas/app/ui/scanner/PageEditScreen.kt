package com.sora2nas.app.ui.scanner

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Crop
import androidx.compose.material.icons.filled.RestartAlt
import androidx.compose.material.icons.filled.RotateRight
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Slider
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.LifecycleResumeEffect
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.sora2nas.app.R
import com.sora2nas.app.imaging.ScanFilter
import com.sora2nas.app.ui.components.AppTopBar

/** Filters + brightness / contrast / sharpness sliders, rotate, re-crop. */
@Composable
fun PageEditScreen(
    pageId: Long,
    onBack: () -> Unit,
    onRecrop: () -> Unit,
    vm: PageEditViewModel = hiltViewModel(),
) {
    val state by vm.state.collectAsStateWithLifecycle()
    LifecycleResumeEffect(pageId) {
        vm.onResume()
        onPauseOrDispose { }
    }

    Scaffold(
        topBar = {
            AppTopBar(stringResource(R.string.edit_page), onBack = onBack) {
                IconButton(onClick = vm::reset) { Icon(Icons.Filled.RestartAlt, stringResource(R.string.reset)) }
            }
        },
        bottomBar = {
            Surface(shadowElevation = 8.dp) {
                Column(Modifier.fillMaxWidth().navigationBarsPadding().padding(16.dp)) {
                    Row(Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        FilterOption(stringResource(R.string.filter_color), state.adjustments.filter == ScanFilter.ENHANCED_COLOR) { vm.setFilter(ScanFilter.ENHANCED_COLOR) }
                        FilterOption(stringResource(R.string.filter_original), state.adjustments.filter == ScanFilter.ORIGINAL) { vm.setFilter(ScanFilter.ORIGINAL) }
                        FilterOption(stringResource(R.string.filter_gray), state.adjustments.filter == ScanFilter.GRAYSCALE) { vm.setFilter(ScanFilter.GRAYSCALE) }
                        FilterOption(stringResource(R.string.filter_bw), state.adjustments.filter == ScanFilter.BLACK_WHITE) { vm.setFilter(ScanFilter.BLACK_WHITE) }
                    }
                    Spacer(Modifier.height(8.dp))
                    LabeledSlider(stringResource(R.string.brightness), state.adjustments.brightness, -0.6f..0.6f, vm::setBrightness)
                    LabeledSlider(stringResource(R.string.contrast), state.adjustments.contrast, 0.5f..1.8f, vm::setContrast)
                    LabeledSlider(stringResource(R.string.sharpness), state.adjustments.sharpness, 0f..1f, vm::setSharpness)
                    Spacer(Modifier.height(8.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                        IconButton(onClick = vm::rotate) { Icon(Icons.Filled.RotateRight, stringResource(R.string.rotate)) }
                        if (state.canRecrop) {
                            IconButton(onClick = { if (vm.startRecrop()) onRecrop() }) { Icon(Icons.Filled.Crop, stringResource(R.string.recrop)) }
                        }
                        Spacer(Modifier.weight(1f))
                        Button(onClick = { vm.apply(onBack) }, enabled = !state.saving, modifier = Modifier.height(50.dp)) {
                            Icon(Icons.Filled.Check, null); Spacer(Modifier.size(6.dp)); Text(stringResource(R.string.apply))
                        }
                    }
                }
            }
        },
    ) { padding ->
        Box(
            Modifier.fillMaxSize().padding(padding).background(MaterialTheme.colorScheme.surfaceVariant).padding(12.dp),
            contentAlignment = Alignment.Center,
        ) {
            val bmp = state.preview
            if (bmp != null) {
                Image(bmp.asImageBitmap(), null, contentScale = ContentScale.Fit, modifier = Modifier.fillMaxSize())
            }
            if (bmp == null || state.saving) CircularProgressIndicator()
        }
    }
}

@Composable
private fun FilterOption(label: String, selected: Boolean, onClick: () -> Unit) =
    FilterChip(selected = selected, onClick = onClick, label = { Text(label) })

@Composable
private fun LabeledSlider(label: String, value: Float, range: ClosedFloatingPointRange<Float>, onChange: (Float) -> Unit) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Text(label, style = MaterialTheme.typography.labelMedium, modifier = Modifier.width(90.dp))
        Slider(value = value.coerceIn(range), onValueChange = onChange, valueRange = range, modifier = Modifier.weight(1f))
    }
}
