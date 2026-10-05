package com.sora2nas.verify

import com.sora2nas.app.core.ocr.OcrPipeline
import com.sora2nas.app.core.text.OcrLanguage
import com.sora2nas.app.imaging.MatUtils
import com.sora2nas.app.imaging.OcrPreprocessor
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import org.opencv.core.Core
import org.opencv.core.CvType
import org.opencv.core.Mat
import org.opencv.core.Point
import org.opencv.core.Scalar
import org.opencv.imgproc.Imgproc

/**
 * End-to-end OCR with the real Tesseract engine and the app's bundled
 * tessdata_best models: degraded "photos" (rotation, shadow, noise, low
 * resolution) -> app preprocessing -> automatic language detection -> cleanup.
 */
class OcrIntegrationTest {
    init { Support.ensureLoaded() }

    private val french = listOf(
        "Rapport mensuel de maintenance",
        "",
        "La ligne de cuisson a fonctionné sans arrêt pendant",
        "tout le mois. Les températures du four rotatif sont",
        "restées stables et la consommation d'énergie a baissé.",
        "",
        "Les équipes ont remplacé deux moteurs du broyeur.",
    )
    private val english = listOf(
        "Monthly maintenance report",
        "",
        "The kiln line was running without any stop during",
        "the whole month. The temperatures of the rotary kiln",
        "remained stable and the energy consumption was reduced.",
    )
    private val arabic = listOf(
        "تقرير الصيانة الشهري",
        "",
        "اشتغل خط الطهي دون توقف طوال الشهر وبقيت",
        "درجات حرارة الفرن الدوار مستقرة وانخفض استهلاك",
        "الطاقة بشكل ملحوظ مقارنة بالشهر الماضي.",
    )

    /** Rotation + uneven lighting + gaussian noise. */
    private fun degrade(page: Mat, angle: Double, shadow: Boolean, noise: Double): Mat {
        var img = MatUtils.rotateExpand(page, angle)
        if (shadow) {
            val f = Mat(img.size(), CvType.CV_32FC3)
            for (y in 0 until img.rows() step 2) {
                val k = 1.0 - 0.5 * y / img.rows()
                Imgproc.rectangle(f, Point(0.0, y.toDouble()), Point(img.cols().toDouble(), y + 1.0), Scalar(k, k, k), -1)
            }
            val i32 = Mat(); img.convertTo(i32, CvType.CV_32FC3)
            Core.multiply(i32, f, i32); i32.convertTo(img, CvType.CV_8UC3)
        }
        if (noise > 0) {
            val n = Mat(img.size(), CvType.CV_16SC3); Core.randn(n, 0.0, noise)
            val i16 = Mat(); img.convertTo(i16, CvType.CV_16SC3); Core.add(i16, n, i16); i16.convertTo(img, CvType.CV_8UC3)
        }
        return img
    }

    private fun run(lines: List<String>, rtl: Boolean, angle: Double, shadow: Boolean, noise: Double, scale: Double = 1.0, name: String): Pair<OcrPipeline.Output, Double> = runBlocking {
        var page = Support.toRgbMat(Support.renderPage(lines, rtl))
        if (scale != 1.0) page = MatUtils.resizeScale(page, scale)
        val photo = degrade(page, angle, shadow, noise)
        Support.saveRgb(photo, "$name.jpg")
        val engine = CliTesseractEngine()
        val pipeline = OcrPipeline(engine, OcrPreprocessor())
        val t0 = System.currentTimeMillis()
        val out = pipeline.run(photo)
        val expected = lines.filter { it.isNotEmpty() }.joinToString(" ")
        val cer = Support.cer(expected, out.text)
        println("[$name] langs=${out.languages.tessCode} conf=${"%.1f".format(out.confidence)} CER=${"%.2f".format(cer * 100)}% calls=${engine.calls} ${System.currentTimeMillis() - t0}ms")
        println(out.text)
        out to cer
    }

    @Test
    fun `french photo with skew shadow and noise`() {
        val (out, cer) = run(french, false, 4.0, true, 12.0, name = "ocr_fr")
        assertEquals(OcrLanguage.FRENCH, out.languages.primary)
        assertTrue("CER too high: $cer", cer < 0.03)
        // paragraphs kept, broken lines re-joined
        assertTrue(out.text.contains("pendant tout le mois"))
    }

    @Test
    fun `english photo`() {
        val (out, cer) = run(english, false, -3.0, true, 8.0, name = "ocr_en")
        assertEquals(OcrLanguage.ENGLISH, out.languages.primary)
        assertTrue("CER too high: $cer", cer < 0.03)
    }

    @Test
    fun `arabic photo`() {
        val (out, cer) = run(arabic, true, 2.5, true, 8.0, name = "ocr_ar")
        assertEquals(OcrLanguage.ARABIC, out.languages.primary)
        assertTrue("CER too high: $cer", cer < 0.08)
    }

    @Test
    fun `low resolution screenshot is upscaled`() {
        val (out, cer) = run(french, false, 0.0, false, 0.0, scale = 0.45, name = "ocr_lowres")
        assertEquals(OcrLanguage.FRENCH, out.languages.primary)
        assertTrue("CER too high: $cer", cer < 0.05)
    }
}
