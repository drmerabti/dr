package com.sora2nas.app.platform

import android.graphics.Bitmap
import com.googlecode.tesseract.android.TessBaseAPI
import com.sora2nas.app.core.ocr.OcrEngine
import com.sora2nas.app.core.ocr.OcrResult
import com.sora2nas.app.core.ocr.PageLayout
import com.sora2nas.app.core.ocr.WordBox
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import org.opencv.core.Mat
import java.io.File
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Tesseract4Android (Tesseract 5, LSTM) with the bundled tessdata_best models.
 * One native instance is kept and re-initialised only when the language set
 * changes. Calls are serialised (Tesseract is not thread-safe).
 */
@Singleton
class TesseractOcrEngine @Inject constructor(
    private val installer: TessDataInstaller,
) : OcrEngine<Mat> {

    private val mutex = Mutex()
    private var api: TessBaseAPI? = null
    private var currentLangs: String? = null

    override suspend fun recognize(image: Mat, languages: String, layout: PageLayout, wantWords: Boolean): OcrResult =
        withContext(Dispatchers.Default) {
            val dataPath = installer.ensureInstalled()
            mutex.withLock {
                val tess = ensureApi(dataPath, languages)
                tess.pageSegMode = when (layout) {
                    PageLayout.AUTO -> TessBaseAPI.PageSegMode.PSM_AUTO
                    PageLayout.SINGLE_BLOCK -> TessBaseAPI.PageSegMode.PSM_SINGLE_BLOCK
                    PageLayout.SINGLE_LINE -> TessBaseAPI.PageSegMode.PSM_SINGLE_LINE
                    PageLayout.RAW_LINE -> TessBaseAPI.PageSegMode.PSM_RAW_LINE
                }
                val bmp: Bitmap = ImageIO.matToBitmap(image)
                try {
                    tess.setImage(bmp)
                    val text = tess.getUTF8Text() ?: ""
                    val conf = tess.meanConfidence().toFloat()
                    val words = if (wantWords) readWords(tess) else emptyList()
                    tess.clear()
                    OcrResult(text, words, conf)
                } finally {
                    bmp.recycle()
                }
            }
        }

    private fun readWords(tess: TessBaseAPI): List<WordBox> {
        val words = ArrayList<WordBox>()
        val it = tess.resultIterator ?: return words
        try {
            it.begin()
            val level = TessBaseAPI.PageIteratorLevel.RIL_WORD
            do {
                val text = it.getUTF8Text(level) ?: continue
                val r = it.getBoundingRect(level)
                words += WordBox(text, r.left, r.top, r.right, r.bottom, it.confidence(level))
            } while (it.next(level))
        } finally {
            it.delete()
        }
        return words
    }

    private fun ensureApi(dataPath: File, langs: String): TessBaseAPI {
        val existing = api
        if (existing != null && currentLangs == langs) return existing
        existing?.recycle()
        val tess = TessBaseAPI()
        val ok = tess.init(dataPath.absolutePath + File.separator, langs, TessBaseAPI.OEM_LSTM_ONLY)
        check(ok) { "Tesseract init failed for $langs" }
        tess.setVariable("preserve_interword_spaces", "1")
        api = tess
        currentLangs = langs
        return tess
    }

    /** Frees native memory (e.g. on low memory). */
    suspend fun release() = mutex.withLock {
        api?.recycle()
        api = null
        currentLangs = null
    }
}
