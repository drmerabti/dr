package com.sora2nas.app.ui.scanner

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Image
import androidx.compose.material.icons.filled.PictureAsPdf
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil.compose.AsyncImage
import coil.request.ImageRequest
import androidx.compose.ui.platform.LocalContext
import com.sora2nas.app.R
import com.sora2nas.app.data.settings.ScanQuality
import com.sora2nas.app.scan.ScanPage
import com.sora2nas.app.ui.components.AppTopBar
import com.sora2nas.app.ui.components.ProgressPanel
import com.sora2nas.app.ui.components.SavedShareSheet

/** Multi-page editor: reorder, delete, edit, then save ONE PDF or the images. */
@Composable
fun PagesScreen(
    onBack: () -> Unit,
    onAddPage: () -> Unit,
    onEditPage: (Long) -> Unit,
    onFinished: () -> Unit,
    vm: PagesViewModel = hiltViewModel(),
) {
    val pages by vm.pages.collectAsStateWithLifecycle()
    val quality by vm.quality.collectAsStateWithLifecycle()
    val searchable by vm.searchable.collectAsStateWithLifecycle()
    val export by vm.export.collectAsStateWithLifecycle()

    Scaffold(
        topBar = {
            AppTopBar(stringResource(R.string.pages_title, pages.size), onBack = onBack) {
                IconButton(onClick = onAddPage) { Icon(Icons.Filled.Add, stringResource(R.string.add_page)) }
            }
        },
        bottomBar = {
            if (pages.isNotEmpty()) {
                Surface(shadowElevation = 8.dp) {
                    Column(Modifier.fillMaxWidth().navigationBarsPadding().padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(stringResource(R.string.quality), style = MaterialTheme.typography.titleSmall, modifier = Modifier.weight(1f))
                            QualityChip(stringResource(R.string.quality_normal), quality == ScanQuality.NORMAL) { vm.setQuality(ScanQuality.NORMAL) }
                            QualityChip(stringResource(R.string.quality_high), quality == ScanQuality.HIGH) { vm.setQuality(ScanQuality.HIGH) }
                            QualityChip(stringResource(R.string.quality_max), quality == ScanQuality.MAX) { vm.setQuality(ScanQuality.MAX) }
                        }
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Column(Modifier.weight(1f)) {
                                Text(stringResource(R.string.searchable_pdf), style = MaterialTheme.typography.titleSmall)
                                Text(stringResource(R.string.searchable_pdf_desc), style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                            Switch(checked = searchable, onCheckedChange = vm::setSearchable)
                        }
                        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            OutlinedButton(onClick = vm::saveImages, modifier = Modifier.weight(1f).height(52.dp)) {
                                Icon(Icons.Filled.Image, null); Spacer(Modifier.size(6.dp)); Text(stringResource(R.string.save_images))
                            }
                            Button(onClick = vm::savePdf, modifier = Modifier.weight(1.3f).height(52.dp)) {
                                Icon(Icons.Filled.PictureAsPdf, null); Spacer(Modifier.size(6.dp)); Text(stringResource(R.string.save_pdf))
                            }
                        }
                    }
                }
            }
        },
    ) { padding ->
        if (pages.isEmpty()) {
            Column(Modifier.fillMaxSize().padding(padding).padding(32.dp), verticalArrangement = Arrangement.Center, horizontalAlignment = Alignment.CenterHorizontally) {
                Text(stringResource(R.string.no_pages), style = MaterialTheme.typography.bodyLarge)
                Spacer(Modifier.height(16.dp))
                Button(onClick = onAddPage) { Icon(Icons.Filled.Add, null); Spacer(Modifier.size(6.dp)); Text(stringResource(R.string.add_page)) }
            }
        } else {
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                contentPadding = PaddingValues(12.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxSize().padding(padding),
            ) {
                itemsIndexed(pages, key = { _, p -> p.id }) { index, page ->
                    PageCard(
                        page = page,
                        number = index + 1,
                        canMoveBack = index > 0,
                        canMoveForward = index < pages.lastIndex,
                        onEdit = { onEditPage(page.id) },
                        onDelete = { vm.delete(page.id) },
                        onMoveBack = { vm.move(page.id, -1) },
                        onMoveForward = { vm.move(page.id, +1) },
                    )
                }
            }
        }
    }

    if (export.running) {
        AlertDialog(onDismissRequest = {}, confirmButton = {}, text = {
            val p = export.progress
            ProgressPanel(
                stringResource(if (searchable) R.string.saving_searchable else R.string.saving),
                p?.let { it.first.toFloat() / it.second.coerceAtLeast(1) },
                p?.let { stringResource(R.string.page_x_of_y, it.first, it.second) },
                Modifier.height(260.dp),
            )
        })
    }
    export.savedPath?.let { path ->
        // Straight after the scan is saved: one tap to e-mail, WhatsApp, Messenger, Telegram.
        SavedShareSheet(
            path = stringResource(R.string.saved_to, path),
            uris = export.savedUris.ifEmpty { listOfNotNull(export.savedUri) },
            mime = export.savedMime ?: "application/pdf",
            subject = export.savedTitle,
            onOpen = vm::openSaved,
            onDone = { vm.finish(); onFinished() },
        )
    }
    if (export.error) {
        AlertDialog(
            onDismissRequest = vm::dismissError,
            confirmButton = { TextButton(onClick = vm::dismissError) { Text(stringResource(R.string.ok)) } },
            text = { Text(stringResource(R.string.error_save)) },
        )
    }
}

@Composable
private fun QualityChip(label: String, selected: Boolean, onClick: () -> Unit) {
    FilterChip(selected = selected, onClick = onClick, label = { Text(label) }, modifier = Modifier.padding(start = 6.dp))
}

@Composable
private fun PageCard(
    page: ScanPage,
    number: Int,
    canMoveBack: Boolean,
    canMoveForward: Boolean,
    onEdit: () -> Unit,
    onDelete: () -> Unit,
    onMoveBack: () -> Unit,
    onMoveForward: () -> Unit,
) {
    Card(
        onClick = onEdit,
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
    ) {
        Box {
            AsyncImage(
                model = ImageRequest.Builder(LocalContext.current).data(page.thumb).memoryCacheKey("${page.id}_${page.version}").build(),
                contentDescription = null,
                contentScale = ContentScale.Fit,
                modifier = Modifier.fillMaxWidth().aspectRatio(0.75f).padding(8.dp).clip(RoundedCornerShape(10.dp)).background(MaterialTheme.colorScheme.surfaceVariant),
            )
            Surface(shape = CircleShape, color = MaterialTheme.colorScheme.primary, modifier = Modifier.padding(12.dp).size(30.dp)) {
                Box(contentAlignment = Alignment.Center) {
                    Text("$number", color = MaterialTheme.colorScheme.onPrimary, fontWeight = FontWeight.Bold)
                }
            }
        }
        Row(Modifier.fillMaxWidth().padding(horizontal = 4.dp), horizontalArrangement = Arrangement.SpaceBetween) {
            IconButton(onClick = onMoveBack, enabled = canMoveBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, stringResource(R.string.move_before)) }
            IconButton(onClick = onEdit) { Icon(Icons.Filled.Edit, stringResource(R.string.edit)) }
            IconButton(onClick = onDelete) { Icon(Icons.Filled.Delete, stringResource(R.string.delete), tint = MaterialTheme.colorScheme.error) }
            IconButton(onClick = onMoveForward, enabled = canMoveForward) { Icon(Icons.AutoMirrored.Filled.ArrowForward, stringResource(R.string.move_after)) }
        }
    }
}
