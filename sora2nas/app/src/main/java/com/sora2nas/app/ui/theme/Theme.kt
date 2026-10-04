package com.sora2nas.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.Typography
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.shape.RoundedCornerShape
import com.sora2nas.app.R

// Brand palette (light theme only).
val Blue = Color(0xFF1E4FD8)
val BlueDark = Color(0xFF163BA6)
val Teal = Color(0xFF12B5A6)
val Amber = Color(0xFFF59E0B)
val Rose = Color(0xFFE5486B)
val Violet = Color(0xFF7C4DFF)
val Ink = Color(0xFF1B2333)
val InkSoft = Color(0xFF5B6475)
val Canvas = Color(0xFFF6F8FC)

private val colors = lightColorScheme(
    primary = Blue,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFE3EAFF),
    onPrimaryContainer = BlueDark,
    secondary = Teal,
    onSecondary = Color.White,
    secondaryContainer = Color(0xFFD7F5F1),
    onSecondaryContainer = Color(0xFF0B5E57),
    tertiary = Amber,
    background = Canvas,
    onBackground = Ink,
    surface = Color.White,
    onSurface = Ink,
    surfaceVariant = Color(0xFFEEF1F7),
    onSurfaceVariant = InkSoft,
    surfaceContainer = Color.White,
    surfaceContainerHigh = Color.White,
    surfaceContainerLow = Color(0xFFF9FAFD),
    outline = Color(0xFFD5DAE3),
    outlineVariant = Color(0xFFE6E9F0),
    error = Color(0xFFD93A3A),
)

/** Tajawal: clean, very legible in Arabic and Latin (SIL OFL). */
val AppFont = FontFamily(
    Font(R.font.tajawal_regular, FontWeight.Normal),
    Font(R.font.tajawal_medium, FontWeight.Medium),
    Font(R.font.tajawal_bold, FontWeight.Bold),
)

private fun style(size: Int, weight: FontWeight, line: Int = (size * 1.4).toInt()) =
    TextStyle(fontFamily = AppFont, fontSize = size.sp, fontWeight = weight, lineHeight = line.sp)

private val typography = Typography(
    displaySmall = style(32, FontWeight.Bold),
    headlineMedium = style(26, FontWeight.Bold),
    headlineSmall = style(22, FontWeight.Bold),
    titleLarge = style(20, FontWeight.Bold),
    titleMedium = style(17, FontWeight.Medium),
    titleSmall = style(15, FontWeight.Medium),
    bodyLarge = style(17, FontWeight.Normal, 26),
    bodyMedium = style(15, FontWeight.Normal),
    bodySmall = style(13, FontWeight.Normal),
    labelLarge = style(16, FontWeight.Bold),
    labelMedium = style(14, FontWeight.Medium),
    labelSmall = style(12, FontWeight.Medium),
)

private val shapes = Shapes(
    small = RoundedCornerShape(10.dp),
    medium = RoundedCornerShape(16.dp),
    large = RoundedCornerShape(24.dp),
)

@Composable
fun Sora2nasTheme(content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = colors, typography = typography, shapes = shapes, content = content)
}
