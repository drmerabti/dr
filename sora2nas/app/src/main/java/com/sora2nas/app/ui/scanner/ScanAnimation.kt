package com.sora2nas.app.ui.scanner

import android.graphics.Bitmap
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.clipRect
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.dp
import com.sora2nas.app.ui.theme.Teal
import kotlinx.coroutines.delay
import kotlin.math.min

/** Glowing scanner bar at height [y]; the glow trails behind the direction of travel. */
private fun DrawScope.scanBar(left: Float, right: Float, y: Float, downwards: Boolean) {
    val glow = 56.dp.toPx()
    val top = if (downwards) y - glow else y
    val colors = if (downwards) listOf(Color.Transparent, Teal.copy(alpha = 0.35f)) else listOf(Teal.copy(alpha = 0.35f), Color.Transparent)
    drawRect(Brush.verticalGradient(colors, startY = top, endY = top + glow), Offset(left, top), Size(right - left, glow))
    drawRect(Color.White, Offset(left, y - 1.5.dp.toPx()), Size(right - left, 3.dp.toPx()))
    drawRect(Teal.copy(alpha = 0.9f), Offset(left, y - 0.75.dp.toPx()), Size(right - left, 1.5.dp.toPx()))
}

/** Looping scan bar shown over the photo while the page is being cleaned. */
@Composable
fun ScanningOverlay(modifier: Modifier = Modifier) {
    val t = rememberInfiniteTransition(label = "scan")
    val p by t.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(tween(1300, easing = LinearEasing), RepeatMode.Reverse),
        label = "scanPos",
    )
    val lastP = remember { floatArrayOf(0f) }
    Canvas(modifier.fillMaxSize()) {
        drawRect(Color.Black.copy(alpha = 0.25f))
        val downwards = p >= lastP[0]
        lastP[0] = p
        scanBar(0f, size.width, p * size.height, downwards)
    }
}

/**
 * The "scanner" moment: the clean page appears line by line under a moving
 * light bar, like a sheet coming out of a flatbed scanner, then [onFinished].
 */
@Composable
fun ScanReveal(page: Bitmap, onFinished: () -> Unit, modifier: Modifier = Modifier) {
    val image = remember(page) { page.asImageBitmap() }
    val progress = remember(page) { Animatable(0f) }
    LaunchedEffect(page) {
        progress.animateTo(1f, tween(1100, easing = FastOutSlowInEasing))
        delay(450)
        onFinished()
    }
    Canvas(modifier.fillMaxSize()) {
        val s = min(size.width / image.width, size.height / image.height)
        val w = image.width * s
        val h = image.height * s
        val left = (size.width - w) / 2
        val top = (size.height - h) / 2
        val y = top + h * progress.value
        // Paper outline already in place, filled as the bar passes.
        drawRect(Color.White.copy(alpha = 0.08f), Offset(left, top), Size(w, h))
        clipRect(left, top, left + w, y) {
            drawImage(
                image,
                dstOffset = IntOffset(left.toInt(), top.toInt()),
                dstSize = IntSize(w.toInt(), h.toInt()),
            )
        }
        if (progress.value < 1f) scanBar(left, left + w, y, downwards = true)
    }
}
