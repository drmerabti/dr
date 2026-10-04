package com.sora2nas.app.core.ocr

import com.sora2nas.app.core.text.OcrLanguage
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/** Pipeline orchestration with a fake engine: no native code needed. */
class OcrPipelineTest {

    /** "Images" are just strings: the text printed on them, in the language they are written in. */
    private data class FakeImage(val text: String, val processed: Boolean = false, val small: Boolean = false)

    private class FakeOps : OcrImageOps<FakeImage> {
        var released = 0
        override fun preprocess(image: FakeImage, keepGeometry: Boolean) = image.copy(processed = true)
        override fun downscaleForProbe(image: FakeImage) = image.copy(small = true)
        override fun release(image: FakeImage) { released++ }
    }

    private class FakeEngine(private val confidence: (String) -> Float = { 90f }) : OcrEngine<FakeImage> {
        val calls = mutableListOf<Pair<FakeImage, String>>()
        override suspend fun recognize(image: FakeImage, languages: String, layout: PageLayout, wantWords: Boolean): OcrResult {
            calls += image to languages
            return OcrResult(image.text, emptyList(), confidence(languages))
        }
    }

    @Test
    fun `detects language on a small probe then runs full OCR with detected models`() = runTest {
        val engine = FakeEngine()
        val ops = FakeOps()
        val out = OcrPipeline(engine, ops).run(FakeImage("تقرير الصيانة\nالشهري للمصنع"))
        assertEquals(2, engine.calls.size)
        val (probeImg, probeLangs) = engine.calls[0]
        assertTrue(probeImg.small && probeImg.processed)
        assertEquals(OcrPipeline.PROBE_LANGUAGES, probeLangs)
        val (fullImg, fullLangs) = engine.calls[1]
        assertTrue(fullImg.processed && !fullImg.small)
        assertEquals("ara", fullLangs)
        assertEquals(OcrLanguage.ARABIC, out.languages.primary)
        assertEquals("تقرير الصيانة\nالشهري للمصنع", out.rawText)
        assertEquals(2, ops.released) // probe + preprocessed copies
    }

    @Test
    fun `cleans the recognised text`() = runTest {
        val out = OcrPipeline(FakeEngine(), FakeOps()).run(FakeImage("The   report is\nready for the team today."))
        assertEquals("The report is ready for the team today.", out.text)
        assertEquals(OcrLanguage.ENGLISH, out.languages.primary)
    }

    @Test
    fun `language hint skips the probe`() = runTest {
        val engine = FakeEngine()
        OcrPipeline(engine, FakeOps()).run(FakeImage("x"), languageHint = com.sora2nas.app.core.text.LanguageDetector.detect("bonjour le monde et la vie"))
        assertEquals(1, engine.calls.size)
        assertEquals("fra", engine.calls[0].second)
    }

    @Test
    fun `low confidence triggers one retry with all models`() = runTest {
        val engine = FakeEngine { langs -> if (langs.split("+").size == 3) 80f else 30f }
        val out = OcrPipeline(engine, FakeOps()).run(FakeImage("Le texte de la page est ici pour le test"))
        assertEquals(3, engine.calls.size)
        assertEquals("fra+ara+eng", engine.calls[2].second)
        assertEquals(80f, out.confidence)
    }
}
