package com.sora2nas.app.platform

import android.content.Context
import android.graphics.Bitmap
import android.net.Uri
import com.sora2nas.app.core.ocr.OcrPipeline
import com.sora2nas.app.core.table.TableData
import com.sora2nas.app.core.text.LanguageDetector
import com.sora2nas.app.core.text.TextCleaner
import com.sora2nas.app.imaging.OcrPreprocessor
import com.sora2nas.app.imaging.TableExtractor
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ensureActive
import kotlinx.coroutines.withContext
import org.opencv.core.Mat
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.coroutines.coroutineContext

/** Result of one image/PDF conversion. */
data class TextConversion(
    val text: String,
    val languageTag: String,
    val pageCount: Int,
    val thumbnail: Bitmap?,
)

/**
 * High-level, on-device conversions used by the screens:
 * image -> text, PDF -> text (smart mode), image -> table.
 */
@Singleton
class OcrService @Inject constructor(
    @ApplicationContext private val context: Context,
    private val engine: TesseractOcrEngine,
) {
    private val preprocessor = OcrPreprocessor()
    private val pipeline = OcrPipeline(engine, preprocessor)

    /** Max size of decoded photos for OCR (beyond this Tesseract gains nothing). */
    private val maxSide = 4200

    suspend fun imageToText(uri: Uri): TextConversion = withContext(Dispatchers.Default) {
        val bmp = ImageIO.decode(context, uri, maxSide)
        val mat = ImageIO.bitmapToRgb(bmp)
        try {
            val out = pipeline.run(mat)
            TextConversion(out.text, out.languages.primary.bcp47, 1, bmp)
        } finally {
            mat.release()
        }
    }

    /** OCR of an RGB Mat with word boxes in the same pixel space (searchable PDF). */
    suspend fun wordsForPage(rgb: Mat): OcrPipeline.Output = pipeline.run(rgb, wantWords = true, keepGeometry = true)

    /**
     * PDF -> text. Pages with a real text layer are extracted directly (fast);
     * scanned pages are rendered and OCR'd. [onPage] reports (done, total).
     */
    suspend fun pdfToText(uri: Uri, onPage: (Int, Int) -> Unit): TextConversion = withContext(Dispatchers.Default) {
        PdfPages.open(context, uri).use { pdf ->
            val total = pdf.pageCount
            val parts = ArrayList<String>(total)
            var thumb: Bitmap? = null
            onPage(0, total)
            for (i in 0 until total) {
                coroutineContext.ensureActive()
                val layer = pdf.text(i)
                val text = if (layer != null) {
                    TextCleaner.clean(layer)
                } else {
                    val bmp = pdf.render(i)
                    val mat = ImageIO.bitmapToRgb(bmp)
                    try {
                        pipeline.run(mat).text
                    } finally {
                        mat.release()
                        if (thumb == null) thumb = bmp else bmp.recycle()
                    }
                }
                if (thumb == null) thumb = pdf.render(i, dpi = 40)
                parts += text
                onPage(i + 1, total)
            }
            val full = if (total == 1) parts[0] else parts.mapIndexed { i, t -> "— ${i + 1} —\n$t" }.joinToString("\n\n")
            TextConversion(full, LanguageDetector.detect(full).primary.bcp47, total, thumb)
        }
    }

    /** Image -> table (grid detection + per-cell OCR, or borderless reconstruction). */
    suspend fun imageToTable(uri: Uri, onProgress: (Float) -> Unit): Pair<TableData, Bitmap> = withContext(Dispatchers.Default) {
        val bmp = ImageIO.decode(context, uri, maxSide)
        val mat = ImageIO.bitmapToRgb(bmp)
        try {
            TableExtractor(engine, preprocessor).extract(mat, onProgress) to bmp
        } finally {
            mat.release()
        }
    }

    /** PDF -> one table per page. */
    suspend fun pdfToTables(uri: Uri, onProgress: (Float) -> Unit): Pair<List<TableData>, Bitmap?> = withContext(Dispatchers.Default) {
        PdfPages.open(context, uri).use { pdf ->
            val n = pdf.pageCount
            val tables = ArrayList<TableData>()
            var thumb: Bitmap? = null
            for (i in 0 until n) {
                coroutineContext.ensureActive()
                val bmp = pdf.render(i)
                val mat = ImageIO.bitmapToRgb(bmp)
                try {
                    val t = TableExtractor(engine, preprocessor).extract(mat) { p -> onProgress((i + p) / n) }
                    if (!t.isEmpty()) tables += t
                } finally {
                    mat.release()
                    if (thumb == null) thumb = bmp else bmp.recycle()
                }
            }
            tables to thumb
        }
    }
}
