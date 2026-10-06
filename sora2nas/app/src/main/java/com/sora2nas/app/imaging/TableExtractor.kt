package com.sora2nas.app.imaging

import com.sora2nas.app.core.ocr.OcrEngine
import com.sora2nas.app.core.ocr.OcrPipeline
import com.sora2nas.app.core.ocr.PageLayout
import com.sora2nas.app.core.table.BorderlessTableBuilder
import com.sora2nas.app.core.table.CellRegion
import com.sora2nas.app.core.table.GridTableBuilder
import com.sora2nas.app.core.table.TableData
import com.sora2nas.app.core.text.DetectedLanguages
import com.sora2nas.app.core.text.LanguageDetector
import kotlinx.coroutines.ensureActive
import kotlin.coroutines.coroutineContext
import org.opencv.core.Core
import org.opencv.core.Mat
import org.opencv.core.Point
import org.opencv.core.Rect
import org.opencv.core.Scalar
import org.opencv.imgproc.Imgproc
import kotlin.math.abs

/**
 * Image -> [TableData]:
 *  1. grey + resolution + deskew
 *  2. language detection on the whole image
 *  3. ruled grid found -> OCR every cell separately (one block each)
 *     no grid           -> OCR the page with word boxes and rebuild rows/columns
 */
class TableExtractor(
    private val engine: OcrEngine<Mat>,
    private val preprocessor: OcrPreprocessor = OcrPreprocessor(),
) {

    suspend fun extract(image: Mat, onProgress: (Float) -> Unit = {}): TableData {
        var gray = MatUtils.toGray(image)
        val longest = maxOf(gray.cols(), gray.rows())
        if (longest < 1800) gray = MatUtils.resizeScale(gray, 1800.0 / longest).also { gray.release() }
        if (longest > 4200) gray = MatUtils.resizeScale(gray, 4200.0 / longest).also { gray.release() }
        val angle = preprocessor.estimateSkew(gray)
        if (abs(angle) >= 0.3) gray = MatUtils.rotateExpand(gray, angle).also { gray.release() }
        onProgress(0.05f)

        try {
            val pipeline = OcrPipeline(engine, preprocessor)
            val grid = TableDetector.detectGrid(gray)
            if (grid != null && grid.cells.size >= 2) {
                val clean = eraseLines(gray, grid)
                try {
                    // Detect the language on the line-free image: ruling lines confuse the probe.
                    val langs = pipeline.detectLanguages(clean)
                    onProgress(0.15f)
                    return ocrGrid(clean, grid, langs, onProgress)
                } finally {
                    clean.release()
                }
            }
            // Borderless table: rebuild rows/columns from word positions.
            val langs: DetectedLanguages = pipeline.detectLanguages(gray)
            onProgress(0.3f)
            val prepared = preprocessor.preprocess(gray, keepGeometry = true)
            val words = try {
                engine.recognize(prepared, langs.tessCode, PageLayout.AUTO, wantWords = true).words
            } finally {
                prepared.release()
            }
            onProgress(1f)
            return BorderlessTableBuilder.build(words)
        } finally {
            gray.release()
        }
    }

    /** Copy of [gray] with the ruling lines painted white (else read as "|" or "_"). */
    private fun eraseLines(gray: Mat, grid: TableDetector.Grid): Mat {
        val clean = gray.clone()
        val half = grid.lineThickness / 2 + 3
        val white = Scalar(255.0)
        for (x in grid.xs) Imgproc.rectangle(clean, Point((x - half).toDouble(), 0.0), Point((x + half).toDouble(), clean.rows().toDouble()), white, -1)
        for (y in grid.ys) Imgproc.rectangle(clean, Point(0.0, (y - half).toDouble()), Point(clean.cols().toDouble(), (y + half).toDouble()), white, -1)
        return clean
    }

    private suspend fun ocrGrid(clean: Mat, grid: TableDetector.Grid, langs: DetectedLanguages, onProgress: (Float) -> Unit): TableData {
        val results = ArrayList<Pair<CellRegion, String>>(grid.cells.size)
        grid.cells.forEachIndexed { i, cell ->
            coroutineContext.ensureActive()
            results += cell to ocrCell(clean, cell, langs)
            onProgress(0.15f + 0.85f * (i + 1) / grid.cells.size)
        }
        val rtl = langs.primary.isRtl || results.count { (_, t) -> t.any(LanguageDetector::isArabicLetter) } > results.size / 2
        return GridTableBuilder.assemble(grid.rows, grid.cols, results, rtl)
    }

    private suspend fun ocrCell(clean: Mat, cell: CellRegion, langs: DetectedLanguages): String {
        val inset = 3
        val r = cell.rect
        val w = r.width - 2 * inset
        val h = r.height - 2 * inset
        if (w < 6 || h < 6) return ""
        val roi = clean.submat(Rect(r.left + inset, r.top + inset, w, h))
        // Ink mask; empty cell when there is almost no ink.
        val ink = Mat()
        Core.compare(roi, Scalar(140.0), ink, Core.CMP_LT)
        if (Core.countNonZero(ink) < w * h * 0.002 + 4) { ink.release(); return "" }
        // Tight crop around the ink, then a white margin (Tesseract needs one).
        val box = Imgproc.boundingRect(ink)
        val lines = countTextLines(ink.submat(box))
        ink.release()
        // Margin ≈ 22 % of the line height: measured best for Tesseract on short cells.
        val pad = (box.height / lines.coerceAtLeast(1) * 0.22).toInt().coerceIn(5, 16)
        val padded = Mat()
        Core.copyMakeBorder(roi.submat(box), padded, pad, pad, pad, pad, Core.BORDER_CONSTANT, Scalar(255.0))
        return try {
            if (lines <= 1) {
                // One line: raw-line mode, then the same at 2x (Tesseract is sensitive to
                // glyph size on very short lines), then block mode as a last resort.
                firstNonEmpty(
                    { recognize(padded, langs, PageLayout.RAW_LINE) },
                    { val big = MatUtils.resizeScale(padded, 2.0); try { recognize(big, langs, PageLayout.RAW_LINE) } finally { big.release() } },
                    { recognize(padded, langs, PageLayout.SINGLE_BLOCK) },
                )
            } else {
                firstNonEmpty(
                    { recognize(padded, langs, PageLayout.SINGLE_BLOCK) },
                    { recognize(padded, langs, PageLayout.AUTO) },
                )
            }
        } finally {
            padded.release()
        }
    }

    private suspend fun recognize(img: Mat, langs: DetectedLanguages, layout: PageLayout): String =
        clean(engine.recognize(img, langs.tessCode, layout, false).text)

    private suspend fun firstNonEmpty(vararg attempts: suspend () -> String): String {
        for (a in attempts) {
            val t = a()
            if (t.any { it.isLetterOrDigit() }) return t
        }
        return ""
    }

    private fun clean(s: String) = s.replace('\n', ' ').replace(Regex("\\s+"), " ").trim().trim('|', '_')

    /**
     * Number of text lines = runs of ink rows separated by blank rows. Small
     * runs (Arabic dots above/below the letters, accents) are not lines.
     */
    private fun countTextLines(ink: Mat): Int {
        val rows = Mat()
        Core.reduce(ink, rows, 1, Core.REDUCE_MAX)
        val v = ByteArray(rows.rows())
        rows.get(0, 0, v)
        rows.release()
        val runs = mutableListOf<Int>() // heights
        var start = -1
        var gap = 0
        for (i in v.indices) {
            if (v[i].toInt() != 0) {
                if (start < 0) start = i
                gap = 0
            } else if (start >= 0) {
                gap++
                if (gap >= 3) { runs += i - gap + 1 - start; start = -1; gap = 0 }
            }
        }
        if (start >= 0) runs += v.size - gap - start
        val tallest = runs.maxOrNull() ?: return 0
        return runs.count { it >= tallest * 0.45 }
    }
}
