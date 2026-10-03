package com.sora2nas.app.ui.scanner

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.CropFree
import androidx.compose.material.icons.filled.Replay
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.sora2nas.app.R
import com.sora2nas.app.scan.ScanMode
import com.sora2nas.app.ui.theme.Teal
import kotlin.math.hypot
import kotlin.math.min

/** Manual corner adjustment of the detected document outline. */
@Composable
fun CropScreen(
    onBack: () -> Unit,
    onOutcome: (CropOutcome) -> Unit,
    vm: CropViewModel = hiltViewModel(),
) {
    val state by vm.state.collectAsStateWithLifecycle()

    Column(Modifier.fillMaxSize().background(Color(0xFF101318))) {
        Row(Modifier.fillMaxWidth().statusBarsPadding().padding(horizontal = 8.dp, vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { vm.retake(); onBack() }) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, stringResource(R.string.back), tint = Color.White)
            }
            Text(
                stringResource(if (state.autoDetected) R.string.crop_detected else R.string.crop_adjust),
                color = Color.White,
                style = MaterialTheme.typography.titleMedium,
                modifier = Modifier.weight(1f),
            )
            IconButton(onClick = vm::toggleFullImage) {
                Icon(Icons.Filled.CropFree, stringResource(R.string.crop_full), tint = Color.White)
            }
        }

        Box(Modifier.weight(1f).fillMaxWidth().padding(16.dp), contentAlignment = Alignment.Center) {
            val img = state.image
            val quad = state.quad
            if (img == null || quad == null) {
                CircularProgressIndicator(color = Color.White)
            } else {
                BoxWithConstraints(Modifier.fillMaxSize()) {
                    val density = LocalDensity.current
                    val boxW = with(density) { maxWidth.toPx() }
                    val boxH = with(density) { maxHeight.toPx() }
                    val scale = min(boxW / img.width, boxH / img.height)
                    val offX = (boxW - img.width * scale) / 2
                    val offY = (boxH - img.height * scale) / 2
                    val touchRadius = with(density) { 40.dp.toPx() }
                    var dragging by remember { mutableIntStateOf(-1) }

                    Image(img.asImageBitmap(), null, contentScale = ContentScale.Fit, modifier = Modifier.fillMaxSize())
                    Canvas(
                        Modifier.fillMaxSize().pointerInput(img, scale) {
                            detectDragGestures(
                                onDragStart = { start ->
                                    val pts = vm.state.value.quad?.points ?: return@detectDragGestures
                                    val nearest = pts.indices.minBy { i ->
                                        hypot(pts[i].x * scale + offX - start.x, pts[i].y * scale + offY - start.y)
                                    }
                                    val d = hypot(pts[nearest].x * scale + offX - start.x, pts[nearest].y * scale + offY - start.y)
                                    dragging = if (d < touchRadius * 1.6) nearest else -1
                                },
                                onDragEnd = { dragging = -1 },
                                onDragCancel = { dragging = -1 },
                                onDrag = { change, amount ->
                                    if (dragging >= 0) {
                                        change.consume()
                                        val p = vm.state.value.quad?.points?.get(dragging) ?: return@detectDragGestures
                                        vm.moveCorner(dragging, p.x + amount.x / scale, p.y + amount.y / scale)
                                    }
                                },
                            )
                        },
                    ) {
                        val pts = quad.points.map { Offset((it.x * scale + offX).toFloat(), (it.y * scale + offY).toFloat()) }
                        val path = Path().apply {
                            moveTo(pts[0].x, pts[0].y)
                            pts.drop(1).forEach { lineTo(it.x, it.y) }
                            close()
                        }
                        drawPath(path, Teal.copy(alpha = 0.18f))
                        drawPath(path, Teal, style = Stroke(width = 2.5.dp.toPx()))
                        pts.forEachIndexed { i, p ->
                            drawCircle(Color.White, radius = if (i == dragging) 18.dp.toPx() else 13.dp.toPx(), center = p)
                            drawCircle(Teal, radius = if (i == dragging) 18.dp.toPx() else 13.dp.toPx(), center = p, style = Stroke(3.dp.toPx()))
                        }
                    }
                }
            }
            if (state.working) {
                Box(Modifier.fillMaxSize().background(Color.Black.copy(alpha = 0.5f)), contentAlignment = Alignment.Center) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        CircularProgressIndicator(color = Color.White)
                        Spacer(Modifier.size(12.dp))
                        Text(stringResource(R.string.enhancing), color = Color.White)
                    }
                }
            }
        }

        Row(
            Modifier.fillMaxWidth().navigationBarsPadding().padding(16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            OutlinedButton(onClick = { vm.retake(); onBack() }, modifier = Modifier.weight(1f)) {
                Icon(Icons.Filled.Replay, null, tint = Color.White)
                Spacer(Modifier.size(6.dp))
                Text(stringResource(R.string.retake), color = Color.White)
            }
            Button(
                onClick = { vm.confirm(onOutcome) },
                enabled = state.quad != null && !state.working,
                modifier = Modifier.weight(1.4f),
            ) {
                Icon(Icons.Filled.Check, null)
                Spacer(Modifier.size(6.dp))
                Text(
                    stringResource(
                        when {
                            state.mode == ScanMode.ID_CARD && !state.idFrontDone -> R.string.next_back_side
                            state.mode == ScanMode.OCR || state.mode == ScanMode.TABLE -> R.string.extract
                            else -> R.string.confirm
                        },
                    ),
                )
            }
        }
    }
}
