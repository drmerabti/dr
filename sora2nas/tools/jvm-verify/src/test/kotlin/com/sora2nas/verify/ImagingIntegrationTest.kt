package com.sora2nas.verify

import com.sora2nas.app.imaging.DocumentDetector
import com.sora2nas.app.imaging.IdCardComposer
import com.sora2nas.app.imaging.ImageEnhancer
import com.sora2nas.app.imaging.MatUtils
import com.sora2nas.app.imaging.OcrPreprocessor
import com.sora2nas.app.imaging.PerspectiveCorrector
import com.sora2nas.app.imaging.Pt
import com.sora2nas.app.imaging.ScanAdjustments
import com.sora2nas.app.imaging.ScanFilter
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test
import org.opencv.core.Core
import org.opencv.core.CvType
import org.opencv.core.Mat
import org.opencv.core.MatOfDouble
import org.opencv.core.MatOfPoint2f
import org.opencv.core.Point
import org.opencv.core.Scalar
import org.opencv.core.Size
import org.opencv.imgproc.Imgproc
import kotlin.math.hypot

class ImagingIntegrationTest {
    init { Support.ensureLoaded() }

    private val text = listOf(
        "Rapport de maintenance du four rotatif",
        "",
        "La ligne de cuisson a fonctionné sans arrêt pendant",
        "la semaine. Les températures sont restées stables et",
        "la consommation d'énergie a baissé de 4 pour cent.",
    )

    /** Simulates a phone photo: page warped onto a textured dark table, with a shadow and noise. */
    private fun photoOfPage(corners: List<Point>): Mat {
        val page = Support.toRgbMat(Support.renderPage(text, rtl = false))
        val bg = Mat(1500, 2000, CvType.CV_8UC3, Scalar(92.0, 70.0, 55.0))
        val noise = Mat(bg.size(), CvType.CV_8UC3)
        Core.randn(noise, 0.0, 12.0)
        Core.add(bg, noise, bg)
        val src = MatOfPoint2f(Point(0.0, 0.0), Point(page.cols() - 1.0, 0.0), Point(page.cols() - 1.0, page.rows() - 1.0), Point(0.0, page.rows() - 1.0))
        val dst = MatOfPoint2f(*corners.toTypedArray())
        val m = Imgproc.getPerspectiveTransform(src, dst)
        val mask = Mat(page.size(), CvType.CV_8UC1, Scalar(255.0))
        val warped = Mat(); val warpedMask = Mat()
        Imgproc.warpPerspective(page, warped, m, bg.size())
        Imgproc.warpPerspective(mask, warpedMask, m, bg.size())
        warped.copyTo(bg, warpedMask)
        // diagonal shadow over half the image
        val shade = Mat(bg.size(), CvType.CV_32FC3)
        for (x in 0 until bg.cols() step 4) {
            val f = 1.0 - 0.45 * (x.toDouble() / bg.cols())
            Imgproc.rectangle(shade, Point(x.toDouble(), 0.0), Point(x + 3.0, bg.rows().toDouble()), Scalar(f, f, f), -1)
        }
        val bg32 = Mat(); bg.convertTo(bg32, CvType.CV_32FC3)
        Core.multiply(bg32, shade, bg32)
        bg32.convertTo(bg, CvType.CV_8UC3)
        return bg
    }

    @Test
    fun `detects document corners in a perspective photo`() {
        val corners = listOf(Point(420.0, 160.0), Point(1530.0, 230.0), Point(1640.0, 1380.0), Point(300.0, 1300.0))
        val photo = photoOfPage(corners)
        Support.saveRgb(photo, "photo.jpg")
        val quad = DocumentDetector.detect(photo)
        assertNotNull("no document found", quad)
        val diag = hypot(2000.0, 1500.0)
        quad!!.points.zip(corners).forEach { (p, c) ->
            val err = hypot(p.x - c.x, p.y - c.y)
            println("corner expected=(${c.x},${c.y}) got=(${"%.0f".format(p.x)},${"%.0f".format(p.y)}) err=${"%.1f".format(err)}px")
            assertTrue("corner error too large: $err", err < diag * 0.02)
        }
        val flat = PerspectiveCorrector.warp(photo, quad)
        println("flattened ${flat.cols()}x${flat.rows()}")
        val expectedW = maxOf(hypot(corners[1].x - corners[0].x, corners[1].y - corners[0].y), hypot(corners[2].x - corners[3].x, corners[2].y - corners[3].y))
        val expectedH = maxOf(hypot(corners[3].x - corners[0].x, corners[3].y - corners[0].y), hypot(corners[2].x - corners[1].x, corners[2].y - corners[1].y))
        assertEquals(expectedW, flat.cols().toDouble(), expectedW * 0.03)
        assertEquals(expectedH, flat.rows().toDouble(), expectedH * 0.03)
        val enhanced = ImageEnhancer.apply(flat, ScanAdjustments())
        Support.saveRgb(enhanced, "scan_enhanced.jpg")
        // Shadow removed: paper brightness is even from left to right.
        val g = MatUtils.toGray(enhanced)
        val left = Core.mean(g.submat(50, g.rows() - 50, 20, 80)).`val`[0]
        val right = Core.mean(g.submat(50, g.rows() - 50, g.cols() - 80, g.cols() - 20)).`val`[0]
        println("paper brightness left=$left right=$right")
        assertTrue(left > 225 && right > 225 && kotlin.math.abs(left - right) < 15)
        // Still colour (3 channels) – never forced to black & white.
        assertEquals(3, enhanced.channels())
    }

    @Test
    fun `no false document in a plain image`() {
        val plain = Mat(800, 600, CvType.CV_8UC3, Scalar(120.0, 120.0, 120.0))
        assertEquals(null, DocumentDetector.detect(plain))
    }

    @Test
    fun `colour is preserved by the enhanced filter`() {
        val img = Mat(1600, 1200, CvType.CV_8UC3, Scalar(215.0, 215.0, 210.0))
        Imgproc.rectangle(img, Point(500.0, 700.0), Point(700.0, 820.0), Scalar(200.0, 30.0, 30.0), -1) // red stamp
        Imgproc.rectangle(img, Point(100.0, 100.0), Point(260.0, 240.0), Scalar(30.0, 60.0, 190.0), -1) // blue logo
        val out = ImageEnhancer.apply(img, ScanAdjustments(filter = ScanFilter.ENHANCED_COLOR))
        Support.saveRgb(out, "colour_test.jpg")
        val blue = out.get(170, 180)
        println("blue logo after enhance: ${blue.toList()}  paper: ${out.get(1400, 1000).toList()}")
        assertTrue(blue[2] > blue[0] + 80)
        assertTrue(out.get(1400, 1000).all { it > 235 }) // paper whitened
        val px = out.get(760, 600)
        println("red stamp after enhance: ${px.toList()}")
        assertTrue(px[0] > px[1] + 80 && px[0] > px[2] + 80)
    }

    @Test
    fun `brightness contrast sharpness sliders change the image`() {
        val img = Support.toRgbMat(Support.renderPage(text, rtl = false))
        val bright = ImageEnhancer.apply(img, ScanAdjustments(filter = ScanFilter.ORIGINAL, brightness = -0.3f, sharpness = 0f))
        assertTrue(Core.mean(bright).`val`[0] < Core.mean(img).`val`[0] - 20)
        val sharp = ImageEnhancer.apply(img, ScanAdjustments(filter = ScanFilter.ORIGINAL, sharpness = 1f))
        fun lapVar(m: Mat): Double { val l = Mat(); Imgproc.Laplacian(MatUtils.toGray(m), l, CvType.CV_64F); val mu = MatOfDouble(); val sd = MatOfDouble(); Core.meanStdDev(l, mu, sd); return sd.toArray()[0] }
        assertTrue(lapVar(sharp) > lapVar(img) * 1.2)
    }

    @Test
    fun `deskew estimates the rotation`() {
        val page = Support.toRgbMat(Support.renderPage(text + text, rtl = false))
        val g = MatUtils.toGray(page)
        for (angle in listOf(-6.0, 3.5, 9.0)) {
            val rotated = MatUtils.rotateExpand(g, angle)
            val est = OcrPreprocessor().estimateSkew(rotated)
            println("rotated by $angle -> correction $est")
            assertEquals(-angle, est, 0.6)
        }
    }

    @Test
    fun `id card composition`() {
        val front = Mat(540, 856, CvType.CV_8UC3, Scalar(30.0, 90.0, 200.0))
        val back = Mat(856, 540, CvType.CV_8UC3, Scalar(200.0, 90.0, 30.0)) // portrait photo of card
        val page = IdCardComposer.compose(front, back)
        Support.saveRgb(page, "idcard.jpg")
        assertEquals(Size(2480.0, 3507.0).width, page.size().width, 1.0)
        assertTrue(page.rows() in 3500..3510)
        // front colour near top quarter, back colour near 5/8
        val top = page.get(page.rows() / 4, page.cols() / 2)
        val bottom = page.get(page.rows() * 5 / 8, page.cols() / 2)
        assertTrue(top[2] > 150 && bottom[0] > 150)
        @Suppress("UNUSED_VARIABLE") val unused = Pt(0.0, 0.0)
    }
}
