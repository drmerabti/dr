package com.sora2nas.app.core.ocr

import com.sora2nas.app.core.text.Bidi
import com.sora2nas.app.core.text.DetectedLanguages
import com.sora2nas.app.core.text.LanguageDetector
import com.sora2nas.app.core.text.TextCleaner

/** One recognised word with its bounding box in image pixels. */
data class WordBox(
    val text: String,
    val left: Int,
    val top: Int,
    val right: Int,
    val bottom: Int,
    val confidence: Float,
) {
    val width: Int get() = right - left
    val height: Int get() = bottom - top
    val centerY: Float get() = (top + bottom) / 2f
}

data class OcrResult(val text: String, val words: List<WordBox>, val meanConfidence: Float)

/**
 * Tesseract page segmentation modes used by the app.
 * RAW_LINE (psm 13) is the most reliable mode for one short line, e.g. a
 * single Arabic word in a table cell, where psm 6/7 often return nothing.
 */
enum class PageLayout { AUTO, SINGLE_BLOCK, SINGLE_LINE, RAW_LINE }

/**
 * Abstraction over the OCR engine so the pipeline can be tested without
 * native code. The Android implementation wraps Tesseract4Android; the JVM
 * verification harness wraps the tesseract command-line tool.
 */
interface OcrEngine<I> {
    suspend fun recognize(image: I, languages: String, layout: PageLayout = PageLayout.AUTO, wantWords: Boolean = false): OcrResult
}

/** Image operations needed by the pipeline (implemented with OpenCV). */
interface OcrImageOps<I> {
    /**
     * Deskew, denoise and contrast enhancement. When [keepGeometry] is true the
     * output must have the same size/orientation as the input (used when word
     * boxes are mapped back onto the page, e.g. for a searchable PDF).
     */
    fun preprocess(image: I, keepGeometry: Boolean = false): I

    /** Smaller copy used for the fast language-detection pass. */
    fun downscaleForProbe(image: I): I

    fun release(image: I)
}

/**
 * Image -> text pipeline:
 *   1. preprocess (deskew, denoise, contrast)
 *   2. quick probe OCR on a downscaled image to detect the language(s)
 *   3. full-resolution OCR with only the detected language models (accuracy + speed)
 *   4. text cleanup (broken lines, spaces, paragraphs)
 */
class OcrPipeline<I>(
    private val engine: OcrEngine<I>,
    private val ops: OcrImageOps<I>,
) {
    data class Output(
        val text: String,
        val rawText: String,
        val languages: DetectedLanguages,
        val confidence: Float,
        val words: List<WordBox>,
    )

    suspend fun run(
        image: I,
        languageHint: DetectedLanguages? = null,
        wantWords: Boolean = false,
        keepGeometry: Boolean = false,
    ): Output {
        val pre = ops.preprocess(image, keepGeometry)
        try {
            val langs = languageHint ?: detectLanguages(pre)
            var result = engine.recognize(pre, langs.tessCode, PageLayout.AUTO, wantWords)
            var usedLangs = langs
            // Safety net: if the detected set gave a poor result, the probe was
            // probably misled (e.g. a tiny caption). Retry once with all models.
            if (languageHint == null && result.meanConfidence in 0f..LOW_CONFIDENCE && langs.all.size < 3) {
                val all = LanguageDetector.detect("", langs.primary)
                val retry = engine.recognize(pre, all.tessCode, PageLayout.AUTO, wantWords)
                if (retry.meanConfidence > result.meanConfidence + 5f) {
                    result = retry
                    usedLangs = LanguageDetector.detect(retry.text, langs.primary)
                }
            }
            return Output(
                text = TextCleaner.clean(Bidi.fixOcrNumberOrder(result.text)),
                rawText = result.text,
                languages = usedLangs,
                confidence = result.meanConfidence,
                words = result.words,
            )
        } finally {
            if (pre !== image) ops.release(pre)
        }
    }

    /** Fast pass with the Arabic + Latin models on a small image, then statistics. */
    suspend fun detectLanguages(preprocessed: I): DetectedLanguages {
        val probe = ops.downscaleForProbe(preprocessed)
        try {
            val r = engine.recognize(probe, PROBE_LANGUAGES, PageLayout.AUTO, false)
            return LanguageDetector.detect(r.text)
        } finally {
            if (probe !== preprocessed) ops.release(probe)
        }
    }

    companion object {
        /** The French LSTM model also reads English well enough for detection. */
        const val PROBE_LANGUAGES = "ara+fra"
        const val LOW_CONFIDENCE = 45f
    }
}
