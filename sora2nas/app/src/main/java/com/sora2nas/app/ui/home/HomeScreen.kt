package com.sora2nas.app.ui.home

import android.net.Uri
import android.text.format.DateUtils
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.DocumentScanner
import androidx.compose.material.icons.filled.PhotoLibrary
import androidx.compose.material.icons.filled.PictureAsPdf
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.TableChart
import androidx.compose.material.icons.filled.TextFields
import androidx.compose.material.icons.filled.WorkspacePremium
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.LifecycleResumeEffect
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil.compose.AsyncImage
import com.sora2nas.app.R
import com.sora2nas.app.data.WorkKind
import com.sora2nas.app.data.history.HistoryEntity
import com.sora2nas.app.data.history.HistoryType
import com.sora2nas.app.scan.ScanMode
import com.sora2nas.app.ui.components.IconBadge
import com.sora2nas.app.ui.components.SectionTitle
import com.sora2nas.app.ui.theme.Amber
import com.sora2nas.app.ui.theme.Blue
import com.sora2nas.app.ui.theme.BlueDark
import com.sora2nas.app.ui.theme.Teal
import com.sora2nas.app.ui.theme.Violet
import java.io.File

/** Which source chooser is open on the home screen. */
private enum class SourceSheet { NONE, IMAGE_TEXT, TABLE }

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onScanner: () -> Unit,
    onCameraFor: (ScanMode) -> Unit,
    onWork: (WorkKind, List<Uri>) -> Unit,
    onOpenItem: (HistoryEntity) -> Unit,
    onSeeAll: () -> Unit,
    onSettings: () -> Unit,
    onUpgrade: () -> Unit,
    vm: HomeViewModel = hiltViewModel(),
) {
    val recent by vm.recent.collectAsStateWithLifecycle()
    val remaining by vm.remaining.collectAsStateWithLifecycle()
    val isPro by vm.isPro.collectAsStateWithLifecycle()
    var sheet by remember { mutableStateOf(SourceSheet.NONE) }

    LifecycleResumeEffect(Unit) {
        vm.refresh()
        onPauseOrDispose { }
    }

    // System pickers (no storage permission needed).
    val pickImagesForText = rememberLauncherForActivityResult(ActivityResultContracts.PickMultipleVisualMedia(50)) { uris ->
        if (uris.isNotEmpty()) onWork(WorkKind.IMAGE_TEXT, uris)
    }
    val pickImageForTable = rememberLauncherForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri ->
        if (uri != null) onWork(WorkKind.TABLE_IMAGE, listOf(uri))
    }
    val pickPdfForText = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { uri ->
        if (uri != null) onWork(WorkKind.PDF_TEXT, listOf(uri))
    }
    val pickPdfForTable = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { uri ->
        if (uri != null) onWork(WorkKind.TABLE_PDF, listOf(uri))
    }
    val imagesOnly = PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)

    LazyColumn(
        Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background),
    ) {
        item {
            Header(remaining = remaining, limit = vm.dailyLimit, isPro = isPro, onSettings = onSettings, onUpgrade = onUpgrade)
        }
        item {
            Column(Modifier.padding(horizontal = 16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    FeatureButton(Icons.Filled.DocumentScanner, Blue, stringResource(R.string.home_scanner), Modifier.weight(1f), onScanner)
                    FeatureButton(Icons.Filled.TextFields, Teal, stringResource(R.string.home_image_text), Modifier.weight(1f)) { sheet = SourceSheet.IMAGE_TEXT }
                }
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    FeatureButton(Icons.Filled.PictureAsPdf, Violet, stringResource(R.string.home_pdf_text), Modifier.weight(1f)) {
                        pickPdfForText.launch(arrayOf("application/pdf"))
                    }
                    FeatureButton(Icons.Filled.TableChart, Amber, stringResource(R.string.home_table), Modifier.weight(1f)) { sheet = SourceSheet.TABLE }
                }
            }
        }
        item {
            Spacer(Modifier.height(20.dp))
            SectionTitle(stringResource(R.string.home_recent)) {
                if (recent.isNotEmpty()) TextButton(onClick = onSeeAll) { Text(stringResource(R.string.home_see_all)) }
            }
        }
        if (recent.isEmpty()) {
            item {
                Text(
                    stringResource(R.string.home_empty_history),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(horizontal = 20.dp, vertical = 12.dp),
                )
            }
        }
        items(recent, key = { it.id }) { item ->
            HistoryRow(item, Modifier.padding(horizontal = 16.dp, vertical = 4.dp)) { onOpenItem(item) }
        }
        item { Spacer(Modifier.navigationBarsPadding().height(24.dp)) }
    }

    if (sheet != SourceSheet.NONE) {
        ModalBottomSheet(onDismissRequest = { sheet = SourceSheet.NONE }) {
            Column(
                Modifier.fillMaxWidth().padding(horizontal = 20.dp).padding(bottom = 24.dp).navigationBarsPadding(),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                Text(stringResource(R.string.choose_source), style = MaterialTheme.typography.titleLarge)
                val forTable = sheet == SourceSheet.TABLE
                ActionRow(Icons.Filled.CameraAlt, Blue, stringResource(R.string.source_camera)) {
                    sheet = SourceSheet.NONE
                    onCameraFor(if (forTable) ScanMode.TABLE else ScanMode.OCR)
                }
                ActionRow(Icons.Filled.PhotoLibrary, Teal, stringResource(if (forTable) R.string.source_gallery else R.string.source_gallery_multi)) {
                    sheet = SourceSheet.NONE
                    if (forTable) pickImageForTable.launch(imagesOnly) else pickImagesForText.launch(imagesOnly)
                }
                if (forTable) {
                    ActionRow(Icons.Filled.PictureAsPdf, Violet, stringResource(R.string.source_pdf)) {
                        sheet = SourceSheet.NONE
                        pickPdfForTable.launch(arrayOf("application/pdf"))
                    }
                }
            }
        }
    }
}

@Composable
private fun Header(remaining: Int, limit: Int, isPro: Boolean, onSettings: () -> Unit, onUpgrade: () -> Unit) {
    Box(
        Modifier
            .fillMaxWidth()
            .padding(bottom = 16.dp)
            .clip(RoundedCornerShape(bottomStart = 28.dp, bottomEnd = 28.dp))
            .background(Brush.linearGradient(listOf(BlueDark, Blue, Teal)))
            .statusBarsPadding()
            .padding(20.dp),
    ) {
        Column {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(shape = RoundedCornerShape(12.dp), color = Color.White.copy(alpha = 0.18f)) {
                    Icon(Icons.Filled.TextFields, null, tint = Color.White, modifier = Modifier.padding(8.dp).size(24.dp))
                }
                Spacer(Modifier.size(12.dp))
                Column(Modifier.weight(1f)) {
                    Text(stringResource(R.string.app_name), style = MaterialTheme.typography.headlineSmall, color = Color.White)
                    Text(stringResource(R.string.app_tagline), style = MaterialTheme.typography.bodyMedium, color = Color.White.copy(alpha = 0.85f))
                }
                IconButton(onClick = onSettings) {
                    Icon(Icons.Filled.Settings, contentDescription = stringResource(R.string.settings), tint = Color.White)
                }
            }
            Spacer(Modifier.height(18.dp))
            Surface(shape = RoundedCornerShape(16.dp), color = Color.White.copy(alpha = 0.16f), modifier = Modifier.fillMaxWidth()) {
                Row(Modifier.padding(horizontal = 16.dp, vertical = 12.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Filled.WorkspacePremium, null, tint = Color.White)
                    Spacer(Modifier.size(10.dp))
                    Text(
                        if (isPro) stringResource(R.string.pro_active) else stringResource(R.string.remaining_today, remaining, limit),
                        color = Color.White,
                        style = MaterialTheme.typography.titleSmall,
                        modifier = Modifier.weight(1f),
                    )
                    if (!isPro) {
                        Surface(shape = CircleShape, color = Color.White, modifier = Modifier.clickable(onClick = onUpgrade)) {
                            Text(
                                stringResource(R.string.upgrade),
                                color = Blue,
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp),
                            )
                        }
                    }
                }
            }
        }
    }
}

/** One of the 4 big home buttons. */
@Composable
private fun FeatureButton(icon: ImageVector, color: Color, title: String, modifier: Modifier, onClick: () -> Unit) {
    Card(
        onClick = onClick,
        modifier = modifier.aspectRatio(1.05f),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        border = BorderStroke(1.dp, color.copy(alpha = 0.18f)),
    ) {
        // Icon in the middle, only the short name under it.
        Column(
            Modifier.fillMaxSize().padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
        ) {
            IconBadge(icon, color, size = 64)
            Spacer(Modifier.height(12.dp))
            Text(
                title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
            )
        }
    }
}

/** Large tappable row used in bottom sheets. */
@Composable
fun ActionRow(icon: ImageVector, color: Color, label: String, onClick: () -> Unit) {
    Card(
        onClick = onClick,
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = color.copy(alpha = 0.08f)),
        modifier = Modifier.fillMaxWidth(),
    ) {
        Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
            IconBadge(icon, color, 44)
            Spacer(Modifier.size(14.dp))
            Text(label, style = MaterialTheme.typography.titleMedium)
        }
    }
}

@Composable
fun HistoryRow(item: HistoryEntity, modifier: Modifier = Modifier, trailing: @Composable () -> Unit = {}, onClick: () -> Unit) {
    val (icon, color) = typeIcon(item.type)
    Card(
        onClick = onClick,
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
    ) {
        Row(Modifier.padding(10.dp), verticalAlignment = Alignment.CenterVertically) {
            if (item.thumbnailPath != null) {
                AsyncImage(
                    model = File(item.thumbnailPath),
                    contentDescription = null,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.size(56.dp).clip(RoundedCornerShape(12.dp)).background(MaterialTheme.colorScheme.surfaceVariant),
                )
            } else {
                IconBadge(icon, color, 56)
            }
            Spacer(Modifier.size(12.dp))
            Column(Modifier.weight(1f)) {
                Text(item.title, style = MaterialTheme.typography.titleSmall, maxLines = 1, overflow = TextOverflow.Ellipsis)
                Spacer(Modifier.height(2.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(icon, null, tint = color, modifier = Modifier.size(16.dp))
                    Spacer(Modifier.size(4.dp))
                    Text(
                        DateUtils.getRelativeTimeSpanString(item.createdAt).toString(),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
            trailing()
        }
    }
}

fun typeIcon(type: HistoryType): Pair<ImageVector, Color> = when (type) {
    HistoryType.SCAN -> Icons.Filled.DocumentScanner to Blue
    HistoryType.IMAGE_TEXT -> Icons.Filled.TextFields to Teal
    HistoryType.PDF_TEXT -> Icons.Filled.PictureAsPdf to Violet
    HistoryType.TABLE -> Icons.Filled.TableChart to Amber
}
