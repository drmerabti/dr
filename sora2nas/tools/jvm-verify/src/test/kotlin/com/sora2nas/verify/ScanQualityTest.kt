package com.sora2nas.verify

import com.sora2nas.app.imaging.DocumentDetector
import com.sora2nas.app.imaging.ImageEnhancer
import com.sora2nas.app.imaging.MatUtils
import com.sora2nas.app.imaging.PerspectiveCorrector
import com.sora2nas.app.imaging.ScanAdjustments
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test
import org.opencv.core.Core
import org.opencv.core.CvType
import org.opencv.core.Mat
import org.opencv.core.MatOfDouble
import org.opencv.core.MatOfInt
import org.opencv.core.MatOfByte
import org.opencv.core.MatOfPoint
import org.opencv.core.MatOfPoint2f
import org.opencv.core.Point
import org.opencv.core.Scalar
import org.opencv.core.Size
import org.opencv.imgcodecs.Imgcodecs
import org.opencv.imgproc.Imgproc
import java.awt.Color
import java.awt.Font
import java.awt.RenderingHints
import java.awt.image.BufferedImage

/**
 * A hard, realistic phone photo: warm indoor light, vignetting, a hard hand
 * shadow across the page, slight blur, sensor noise and JPEG compression.
 * The "magic" filter must give white paper, dark ink and keep stamp colours.
 */
class ScanQualityTest {
    init { Support.ensureLoaded() }

    private val lines = listOf(
        "Rapport de maintenance du four rotatif",
        "",
        "La ligne de cuisson a fonctionné sans arrêt pendant",
        "la semaine. Les températures sont restées stables et",
        "la consommation d'énergie a baissé de 4 pour cent.",
        "",
        "Le broyeur à ciment numéro 2 doit être révisé avant",
        "la fin du mois. Les pièces de rechange sont commandées.",
    )

    private fun page(): Mat {
        val img = Support.renderPage(lines, rtl = false)
        val g = img.createGraphics()
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON)
        g.color = Color(200, 30, 40) // red stamp
        g.stroke = java.awt.BasicStroke(8f)
        g.drawOval(1050, 1500, 380, 380)
        g.font = Support.latinFont.deriveFont(Font.BOLD, 46f)
        g.drawString("APPROUVÉ", 1105, 1705)
        g.color = Color(30, 60, 170) // blue signature line
        g.stroke = java.awt.BasicStroke(5f)
        g.drawLine(200, 1750, 700, 1700)
        g.dispose()
        return Support.toRgbMat(img)
    }

    /** Page photographed on a dark desk with bad light. Returns (photo, true corners). */
    fun hardPhoto(): Pair<Mat, List<Point>> {
        val corners = listOf(Point(520.0, 260.0), Point(2460.0, 380.0), Point(2620.0, 2830.0), Point(330.0, 2700.0))
        val p = page()
        val bg = Mat(3000, 3000, CvType.CV_8UC3, Scalar(70.0, 52.0, 40.0))
        val n = Mat(bg.size(), CvType.CV_8UC3); Core.randn(n, 0.0, 10.0); Core.add(bg, n, bg)
        val src = MatOfPoint2f(Point(0.0, 0.0), Point(p.cols() - 1.0, 0.0), Point(p.cols() - 1.0, p.rows() - 1.0), Point(0.0, p.rows() - 1.0))
        val m = Imgproc.getPerspectiveTransform(src, MatOfPoint2f(*corners.toTypedArray()))
        val warped = Mat(); val mask = Mat()
        Imgproc.warpPerspective(p, warped, m, bg.size(), Imgproc.INTER_LINEAR)
        Imgproc.warpPerspective(Mat(p.size(), CvType.CV_8UC1, Scalar(255.0)), mask, m, bg.size())
        warped.copyTo(bg, mask)

        // Light: warm tint x vignette x hard hand shadow (soft edge).
        val light = Mat(bg.size(), CvType.CV_32FC1, Scalar(1.0))
        val vig = Mat(bg.size(), CvType.CV_32FC1)
        for (y in 0 until bg.rows() step 10) for (x in 0 until bg.cols() step 10) {
            val dx = (x - 1300.0) / 1900; val dy = (y - 1200.0) / 1900
            val v = (1.0 - 0.55 * (dx * dx + dy * dy)).toFloat()
            Imgproc.rectangle(vig, Point(x.toDouble(), y.toDouble()), Point(x + 9.0, y + 9.0), Scalar(v.toDouble()), -1)
        }
        Imgproc.GaussianBlur(vig, vig, Size(0.0, 0.0), 8.0)
        Core.multiply(light, vig, light)
        val shadow = Mat(bg.size(), CvType.CV_32FC1, Scalar(1.0))
        Imgproc.fillPoly(shadow, listOf(MatOfPoint(Point(1700.0, 3000.0), Point(2100.0, 1500.0), Point(2500.0, 1300.0), Point(3000.0, 1400.0), Point(3000.0, 3000.0))), Scalar(0.5))
        Imgproc.GaussianBlur(shadow, shadow, Size(0.0, 0.0), 18.0)
        Core.multiply(light, shadow, light)
        val l3 = Mat(); Core.merge(listOf(light, light, light), l3)
        val f = Mat(); bg.convertTo(f, CvType.CV_32FC3)
        Core.multiply(f, l3, f)
        Core.multiply(f, Scalar(0.92, 0.80, 0.62), f) // tungsten
        f.convertTo(bg, CvType.CV_8UC3)
        Imgproc.GaussianBlur(bg, bg, Size(0.0, 0.0), 1.3)
        val noise = Mat(bg.size(), CvType.CV_16SC3); Core.randn(noise, 0.0, 6.0)
        val b16 = Mat(); bg.convertTo(b16, CvType.CV_16SC3); Core.add(b16, noise, b16); b16.convertTo(bg, CvType.CV_8UC3)
        // JPEG round-trip like a camera
        val buf = MatOfByte()
        val bgr = Mat(); Imgproc.cvtColor(bg, bgr, Imgproc.COLOR_RGB2BGR)
        Imgcodecs.imencode(".jpg", bgr, buf, MatOfInt(Imgcodecs.IMWRITE_JPEG_QUALITY, 85))
        val dec = Imgcodecs.imdecode(buf, Imgcodecs.IMREAD_COLOR)
        Imgproc.cvtColor(dec, dec, Imgproc.COLOR_BGR2RGB)
        return dec to corners
    }

    private fun stats(gray: Mat, x0: Int, y0: Int, x1: Int, y1: Int): Pair<Double, Double> {
        val mu = MatOfDouble(); val sd = MatOfDouble()
        Core.meanStdDev(gray.submat(y0, y1, x0, x1), mu, sd)
        return mu.toArray()[0] to sd.toArray()[0]
    }

    @Test
    fun `hard photo becomes a clean white scan`() {
        val (photo, corners) = hardPhoto()
        Support.saveRgb(photo, "hard_photo.jpg")
        val coarse = DocumentDetector.detect(photo)
        println("coarse=${coarse?.points}")
        val quad = DocumentDetector.detectPrecise(photo)
        assertNotNull("document not found", quad)
        val errs = quad!!.points.zip(corners).map { (p, c) -> kotlin.math.hypot(p.x - c.x, p.y - c.y) }
        println("corner errors px=${errs.map { "%.1f".format(it) }}")
        assertTrue("corners off: $errs", errs.all { it < 6.0 })
        // No dark desk sliver along the borders of the flattened page.
        val flat = PerspectiveCorrector.warp(photo, quad!!)
        val out = ImageEnhancer.apply(flat, ScanAdjustments())
        Support.saveRgb(out, "hard_scan.jpg")
        // Measure on a page-sized copy (1654 x 2339 like the original render).
        val norm = Mat(); Imgproc.resize(out, norm, Size(1654.0, 2339.0), 0.0, 0.0, Imgproc.INTER_AREA)
        val g = MatUtils.toGray(norm)
        val lit = stats(g, 150, 1950, 650, 2200)     // blank paper, normal light
        val shade = stats(g, 1250, 1950, 1550, 2250) // blank paper under the hand shadow
        val top = stats(g, 150, 30, 1500, 100)       // blank top margin (vignetted)
        println("paper lit=$lit shadow=$shade top=$top")
        assertTrue("paper not white: $lit", lit.first > 245 && lit.second < 6)
        assertTrue("shadow left: $shade", shade.first > 240 && shade.second < 8)
        assertTrue("top margin: $top", top.first > 240)
        // Ink stays dark: darkest 1% of a text line region.
        val textBand = g.submat(120, 420, 120, 1500)
        val ink = MatUtils.percentile(textBand, 1.0)
        println("ink p1=$ink")
        for ((name, band) in listOf("top" to g.submat(0, 6, 0, g.cols()), "bottom" to g.submat(g.rows() - 6, g.rows(), 0, g.cols()),
                "left" to g.submat(0, g.rows(), 0, 6), "right" to g.submat(0, g.rows(), g.cols() - 6, g.cols()))) {
            val mean = Core.mean(band).`val`[0]
            println("border $name mean=$mean")
            assertTrue("dark border $name: $mean", mean > 235)
        }
        assertTrue("ink too light: $ink", ink < 90)
        // Paper colour neutral (no yellow cast) and red stamp still red.
        val paper = Core.mean(norm.submat(1950, 2200, 150, 650)).`val`
        println("paper rgb=${paper.take(3)}")
        assertTrue("colour cast: ${paper.take(3)}", paper[0] - paper[2] < 8)
        val stampMask = Mat()
        Core.inRange(norm, Scalar(120.0, 0.0, 0.0), Scalar(255.0, 110.0, 120.0), stampMask)
        val redPixels = Core.countNonZero(stampMask.submat(1480, 1900, 1030, 1450))
        println("red stamp pixels=$redPixels")
        assertTrue("stamp lost colour", redPixels > 4000)

        // The cleaned page still reads perfectly (camera -> image-to-text path).
        val ocr = kotlinx.coroutines.runBlocking {
            com.sora2nas.app.core.ocr.OcrPipeline(CliTesseractEngine(), com.sora2nas.app.imaging.OcrPreprocessor()).run(out)
        }
        val expected = lines.filter { it.isNotEmpty() }.joinToString("\n")
        val cer = Support.cer(expected, ocr.text.substringBefore("APPROUV").trim())
        println("ocr cer=$cer\n${ocr.text}")
        assertTrue("OCR worse after cleaning: $cer", cer < 0.02)
    }
}
