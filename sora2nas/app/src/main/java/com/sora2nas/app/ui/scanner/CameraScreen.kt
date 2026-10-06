package com.sora2nas.app.ui.scanner

import android.Manifest
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.Camera
import androidx.camera.core.CameraSelector
import androidx.camera.core.FocusMeteringAction
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageCapture
import androidx.camera.core.ImageCaptureException
import androidx.camera.core.Preview
import androidx.camera.core.resolutionselector.AspectRatioStrategy
import androidx.camera.core.resolutionselector.ResolutionSelector
import androidx.camera.core.resolutionselector.ResolutionStrategy
import android.util.Size
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTapGestures
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.FlashAuto
import androidx.compose.material.icons.filled.FlashOff
import androidx.compose.material.icons.filled.FlashOn
import androidx.compose.material.icons.filled.OpenInBrowser
import androidx.compose.material.icons.filled.PhotoLibrary
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.sora2nas.app.R
import com.sora2nas.app.scan.ScanMode
import com.sora2nas.app.ui.theme.Teal
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

/**
 * CameraX scanner: live edge detection, tap-to-focus, flash, multi-page,
 * ID card (front + back) and QR / barcode modes.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CameraScreen(
    initialMode: ScanMode,
    onCaptured: () -> Unit,
    onDone: () -> Unit,
    onBack: () -> Unit,
    vm: CameraViewModel = hiltViewModel(),
) {
    val context = LocalContext.current
    val state by vm.state.collectAsStateWithLifecycle()
    LaunchedEffect(Unit) { vm.start(initialMode) }

    var granted by remember {
        mutableStateOf(ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED)
    }
    val askPermission = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted = it }
    LaunchedEffect(Unit) { if (!granted) askPermission.launch(Manifest.permission.CAMERA) }

    val pickImage = rememberLauncherForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri ->
        if (uri != null) vm.importFromGallery(uri, onCaptured)
    }

    // CameraX use cases. 4:3 everywhere so preview, analysis and photo share the same field of view.
    val ratio43 = remember {
        ResolutionSelector.Builder().setAspectRatioStrategy(AspectRatioStrategy.RATIO_4_3_FALLBACK_AUTO_STRATEGY).build()
    }
    // Photo: the sensor's full resolution, best quality JPEG.
    val imageCapture = remember {
        ImageCapture.Builder()
            .setCaptureMode(ImageCapture.CAPTURE_MODE_MAXIMIZE_QUALITY)
            .setJpegQuality(98)
            .setResolutionSelector(
                ResolutionSelector.Builder()
                    .setAspectRatioStrategy(AspectRatioStrategy.RATIO_4_3_FALLBACK_AUTO_STRATEGY)
                    .setResolutionStrategy(ResolutionStrategy.HIGHEST_AVAILABLE_STRATEGY)
                    .build(),
            )
            .build()
    }
    // Live edge tracking: ~1280x960 frames (sharper outline than the 640x480 default).
    val analysis = remember {
        ImageAnalysis.Builder()
            .setResolutionSelector(
                ResolutionSelector.Builder()
                    .setAspectRatioStrategy(AspectRatioStrategy.RATIO_4_3_FALLBACK_AUTO_STRATEGY)
                    .setResolutionStrategy(ResolutionStrategy(Size(1280, 960), ResolutionStrategy.FALLBACK_RULE_CLOSEST_LOWER_THEN_HIGHER))
                    .build(),
            )
            .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
            .build()
    }
    LaunchedEffect(state.flash) {
        imageCapture.flashMode = when (state.flash) {
            FlashSetting.OFF -> ImageCapture.FLASH_MODE_OFF
            FlashSetting.AUTO -> ImageCapture.FLASH_MODE_AUTO
            FlashSetting.ON -> ImageCapture.FLASH_MODE_ON
        }
    }
    fun capture() {
        vm.beginCapture()
        val file = vm.newCaptureFile()
        imageCapture.takePicture(
            ImageCapture.OutputFileOptions.Builder(file).build(),
            ContextCompat.getMainExecutor(context),
            object : ImageCapture.OnImageSavedCallback {
                override fun onImageSaved(output: ImageCapture.OutputFileResults) = vm.onPhotoSaved(file, onCaptured)
                override fun onError(exception: ImageCaptureException) = vm.onCaptureFailed()
            },
        )
    }

    Box(Modifier.fillMaxSize().background(Color.Black)) {
        Column(Modifier.fillMaxSize()) {
            // Top bar
            Row(
                Modifier.fillMaxWidth().statusBarsPadding().padding(horizontal = 8.dp, vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                IconButton(onClick = onBack) {
                    Icon(Icons.AutoMirrored.Filled.ArrowBack, stringResource(R.string.back), tint = Color.White)
                }
                Text(
                    text = hintFor(state),
                    color = Color.White,
                    style = MaterialTheme.typography.titleMedium,
                    modifier = Modifier.weight(1f),
                )
                if (state.mode != ScanMode.QR) {
                    IconButton(onClick = vm::cycleFlash) {
                        val icon = when (state.flash) {
                            FlashSetting.OFF -> Icons.Filled.FlashOff
                            FlashSetting.AUTO -> Icons.Filled.FlashAuto
                            FlashSetting.ON -> Icons.Filled.FlashOn
                        }
                        Icon(icon, stringResource(R.string.flash), tint = Color.White)
                    }
                }
            }

            // Preview (3:4, same aspect as the analysed frames so the outline lines up)
            Box(Modifier.weight(1f).fillMaxWidth(), contentAlignment = Alignment.Center) {
                if (granted) {
                    CameraPreview(state = state, vm = vm, imageCapture = imageCapture, analysis = analysis, ratio43 = ratio43)
                } else {
                    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(32.dp)) {
                        Text(stringResource(R.string.camera_permission_needed), color = Color.White, style = MaterialTheme.typography.bodyLarge)
                        Spacer(Modifier.height(16.dp))
                        Button(onClick = { askPermission.launch(Manifest.permission.CAMERA) }) { Text(stringResource(R.string.allow_camera)) }
                    }
                }
            }

            // Mode chips (only for the scanner entry; OCR/table captures are single-purpose)
            if (initialMode == ScanMode.DOCUMENT || initialMode == ScanMode.ID_CARD || initialMode == ScanMode.QR) {
                Row(
                    Modifier.fillMaxWidth().padding(top = 10.dp),
                    horizontalArrangement = Arrangement.Center,
                ) {
                    ModeChip(stringResource(R.string.mode_document), state.mode == ScanMode.DOCUMENT) { vm.setMode(ScanMode.DOCUMENT) }
                    ModeChip(stringResource(R.string.mode_id_card), state.mode == ScanMode.ID_CARD) { vm.setMode(ScanMode.ID_CARD) }
                    ModeChip(stringResource(R.string.mode_qr), state.mode == ScanMode.QR) { vm.setMode(ScanMode.QR) }
                }
            }

            // Bottom controls: gallery import, shutter, done (page counter).
            Row(
                Modifier.fillMaxWidth().navigationBarsPadding().padding(horizontal = 24.dp, vertical = 14.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                if (state.mode != ScanMode.QR) {
                    IconButton(onClick = {
                        pickImage.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly))
                    }, modifier = Modifier.size(56.dp)) {
                        Icon(Icons.Filled.PhotoLibrary, stringResource(R.string.source_gallery), tint = Color.White, modifier = Modifier.size(30.dp))
                    }
                } else Spacer(Modifier.size(56.dp))
                Spacer(Modifier.weight(1f))
                if (state.mode != ScanMode.QR) Shutter(enabled = granted && !state.busy, onClick = ::capture)
                else Spacer(Modifier.size(76.dp))
                Spacer(Modifier.weight(1f))
                if (state.mode == ScanMode.DOCUMENT && state.pageCount > 0) {
                    BadgedBox(badge = { Badge { Text("${state.pageCount}") } }) {
                        FilledTonalButton(onClick = onDone, shape = CircleShape, modifier = Modifier.size(56.dp), contentPadding = androidx.compose.foundation.layout.PaddingValues(0.dp)) {
                            Icon(Icons.Filled.Check, stringResource(R.string.done))
                        }
                    }
                } else Spacer(Modifier.size(56.dp))
            }
        }

        if (state.busy) {
            Box(Modifier.fillMaxSize().background(Color.Black.copy(alpha = 0.45f)), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = Color.White)
            }
        }
    }

    state.barcode?.let { value ->
        ModalBottomSheet(onDismissRequest = vm::dismissBarcode) {
            BarcodeResult(value = value, context = context, onClose = vm::dismissBarcode)
        }
    }
    if (state.error) {
        AlertDialog(
            onDismissRequest = vm::clearError,
            confirmButton = { TextButton(onClick = vm::clearError) { Text(stringResource(R.string.ok)) } },
            text = { Text(stringResource(R.string.error_capture)) },
        )
    }
}

@Composable
private fun Shutter(enabled: Boolean, onClick: () -> Unit) {
    val scale by animateFloatAsState(if (enabled) 1f else 0.88f, label = "shutter")
    Box(
        Modifier
            .size((76 * scale).dp)
            .clip(CircleShape)
            .border(4.dp, Color.White, CircleShape)
            .padding(6.dp)
            .clip(CircleShape)
            .background(Color.White)
            .clickable(enabled = enabled, onClickLabel = stringResource(R.string.capture), onClick = onClick),
    )
}

@Composable
private fun hintFor(state: CameraUiState): String = when (state.mode) {
    ScanMode.DOCUMENT -> stringResource(
        when {
            state.liveQuad == null -> R.string.hint_document
            state.liveSteady -> R.string.hint_ready
            else -> R.string.hint_hold
        },
    )
    ScanMode.ID_CARD -> stringResource(if (state.idFrontDone) R.string.hint_id_back else R.string.hint_id_front)
    ScanMode.QR -> stringResource(R.string.hint_qr)
    ScanMode.OCR -> stringResource(R.string.home_image_text)
    ScanMode.TABLE -> stringResource(R.string.home_table)
}

@Composable
private fun ModeChip(label: String, selected: Boolean, onClick: () -> Unit) {
    Surface(
        shape = CircleShape,
        color = if (selected) Color.White else Color.White.copy(alpha = 0.12f),
        modifier = Modifier.padding(horizontal = 4.dp).clip(CircleShape).clickable(onClick = onClick),
    ) {
        Text(
            label,
            color = if (selected) Color.Black else Color.White,
            fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal,
            style = MaterialTheme.typography.labelLarge,
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
        )
    }
}

@Composable
private fun CameraPreview(
    state: CameraUiState,
    vm: CameraViewModel,
    imageCapture: ImageCapture,
    analysis: ImageAnalysis,
    ratio43: ResolutionSelector,
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    val previewView = remember {
        PreviewView(context).apply {
            scaleType = PreviewView.ScaleType.FIT_CENTER
            implementationMode = PreviewView.ImplementationMode.COMPATIBLE
        }
    }
    val executor = remember { Executors.newSingleThreadExecutor() }
    var camera by remember { mutableStateOf<Camera?>(null) }
    var focusPoint by remember { mutableStateOf<Offset?>(null) }

    DisposableEffect(lifecycleOwner) {
        val future = ProcessCameraProvider.getInstance(context)
        var provider: ProcessCameraProvider? = null
        future.addListener({
            provider = future.get().also { p ->
                val preview = Preview.Builder().setResolutionSelector(ratio43).build().also { it.setSurfaceProvider(previewView.surfaceProvider) }
                runCatching {
                    p.unbindAll()
                    camera = p.bindToLifecycle(lifecycleOwner, CameraSelector.DEFAULT_BACK_CAMERA, preview, imageCapture, analysis)
                }
            }
        }, ContextCompat.getMainExecutor(context))
        onDispose {
            provider?.unbindAll()
            analysis.clearAnalyzer()
        }
    }
    DisposableEffect(Unit) { onDispose { executor.shutdown() } }

    // Switch analyzer with the mode: edge detection for documents, ML Kit for QR.
    DisposableEffect(state.mode) {
        val barcode = if (state.mode == ScanMode.QR) BarcodeAnalyzer { vm.onBarcode(it) } else null
        analysis.setAnalyzer(executor, barcode ?: DocumentAnalyzer { q, steady -> vm.onLiveQuad(q, steady) })
        onDispose {
            analysis.clearAnalyzer()
            barcode?.close()
        }
    }
    // The outline glides between detections instead of jumping, and fades in/out.
    val target = state.liveQuad
    var lastTarget by remember { mutableStateOf<com.sora2nas.app.imaging.Quad?>(null) }
    if (target != null) lastTarget = target
    val shownQuad = target ?: lastTarget
    val animCorners = (0 until 4).map { i ->
        val p = shownQuad?.points?.get(i)
        val x by animateFloatAsState((p?.x ?: 0.5).toFloat(), tween(110, easing = LinearEasing), label = "x$i")
        val y by animateFloatAsState((p?.y ?: 0.5).toFloat(), tween(110, easing = LinearEasing), label = "y$i")
        Offset(x, y)
    }
    val outlineAlpha by animateFloatAsState(if (target != null) 1f else 0f, tween(220), label = "outline")
    Box(Modifier.fillMaxSize()) {
        Box(Modifier.align(Alignment.Center).fillMaxWidth().aspectRatio(3f / 4f)) {
            AndroidView(factory = { previewView }, modifier = Modifier.fillMaxSize())
            // Overlay: live outline + tap-to-focus.
            androidx.compose.foundation.Canvas(
                Modifier.fillMaxSize().pointerInput(Unit) {
                    detectTapGestures { offset ->
                        focusPoint = offset
                        val point = previewView.meteringPointFactory.createPoint(offset.x, offset.y)
                        camera?.cameraControl?.startFocusAndMetering(
                            FocusMeteringAction.Builder(point).setAutoCancelDuration(3, TimeUnit.SECONDS).build(),
                        )
                    }
                },
            ) {
                if (outlineAlpha > 0.01f && state.mode != ScanMode.QR) {
                    val pts = animCorners.map { Offset(it.x * size.width, it.y * size.height) }
                    val path = Path().apply {
                        moveTo(pts[0].x, pts[0].y)
                        pts.drop(1).forEach { lineTo(it.x, it.y) }
                        close()
                    }
                    // White while searching, brand colour once the page is held still.
                    val color = if (state.liveSteady) Teal else Color.White
                    drawPath(path, color.copy(alpha = 0.20f * outlineAlpha))
                    drawPath(path, color.copy(alpha = outlineAlpha), style = Stroke(width = 3.dp.toPx()))
                    pts.forEach { drawCircle(color.copy(alpha = outlineAlpha), radius = 6.dp.toPx(), center = it) }
                }
                if (state.mode == ScanMode.QR) {
                    val s = size.minDimension * 0.62f
                    val left = (size.width - s) / 2
                    val top = (size.height - s) / 2
                    drawRoundRect(
                        Color.White,
                        topLeft = Offset(left, top),
                        size = androidx.compose.ui.geometry.Size(s, s),
                        cornerRadius = androidx.compose.ui.geometry.CornerRadius(24.dp.toPx()),
                        style = Stroke(width = 3.dp.toPx()),
                    )
                }
                focusPoint?.let { drawCircle(Color.White, radius = 34.dp.toPx(), center = it, style = Stroke(2.dp.toPx())) }
            }
        }
        LaunchedEffect(focusPoint) {
            if (focusPoint != null) { kotlinx.coroutines.delay(1200); focusPoint = null }
        }

    }
}

@Composable
private fun BarcodeResult(value: String, context: Context, onClose: () -> Unit) {
    val isUrl = value.startsWith("http://", true) || value.startsWith("https://", true)
    Column(Modifier.fillMaxWidth().padding(20.dp).navigationBarsPadding()) {
        Text(stringResource(R.string.qr_result), style = MaterialTheme.typography.titleLarge)
        Spacer(Modifier.height(12.dp))
        Surface(shape = RoundedCornerShape(14.dp), color = MaterialTheme.colorScheme.surfaceVariant, modifier = Modifier.fillMaxWidth()) {
            Text(value, style = MaterialTheme.typography.bodyLarge, modifier = Modifier.padding(14.dp))
        }
        Spacer(Modifier.height(16.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                val cm = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                cm.setPrimaryClip(ClipData.newPlainText("sora2nas", value))
                Toast.makeText(context, R.string.copied, Toast.LENGTH_SHORT).show()
            }) {
                Icon(Icons.Filled.ContentCopy, null); Spacer(Modifier.size(6.dp)); Text(stringResource(R.string.copy))
            }
            if (isUrl) {
                OutlinedButton(onClick = {
                    runCatching { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(value)).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)) }
                }) { Icon(Icons.Filled.OpenInBrowser, null); Spacer(Modifier.size(6.dp)); Text(stringResource(R.string.open)) }
            }
            OutlinedButton(onClick = {
                context.startActivity(
                    Intent.createChooser(Intent(Intent.ACTION_SEND).setType("text/plain").putExtra(Intent.EXTRA_TEXT, value), null)
                        .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK),
                )
            }) { Icon(Icons.Filled.Share, null) }
        }
        Spacer(Modifier.height(8.dp))
        TextButton(onClick = onClose, modifier = Modifier.align(Alignment.End)) { Text(stringResource(R.string.scan_again)) }
    }
}
