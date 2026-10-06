package com.sora2nas.verify

import com.sora2nas.app.core.ocr.OcrEngine
import com.sora2nas.app.core.ocr.OcrResult
import com.sora2nas.app.core.ocr.PageLayout
import com.sora2nas.app.core.ocr.WordBox
import nu.pattern.OpenCV
import org.opencv.core.CvType
import org.opencv.core.Mat
import org.opencv.imgcodecs.Imgcodecs
import java.awt.Color
import java.awt.Font
import java.awt.RenderingHints
import java.awt.image.BufferedImage
import java.io.File
import java.util.concurrent.TimeUnit

object Support {
    init { OpenCV.loadLocally() }
    fun ensureLoaded() = Unit

    val tessdata = File(System.getProperty("tessdata"))
    val fonts = File(System.getProperty("fonts"))
    val out = File(System.getProperty("out")).apply { mkdirs() }

    val arabicFont: Font by lazy { Font.createFont(Font.TRUETYPE_FONT, File(fonts, "NotoSansArabic-Regular.ttf")) }
    val latinFont: Font by lazy { Font.createFont(Font.TRUETYPE_FONT, File(fonts, "NotoSans-Regular.ttf")) }

    /** Renders paragraphs on a white A4-like page (≈200 dpi). Arabic lines are right-aligned. */
    fun renderPage(lines: List<String>, rtl: Boolean, size: Float = 34f, width: Int = 1654, height: Int = 2339): BufferedImage {
        val img = BufferedImage(width, height, BufferedImage.TYPE_3BYTE_BGR)
        val g = img.createGraphics()
        g.color = Color.WHITE
        g.fillRect(0, 0, width, height)
        g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON)
        g.setRenderingHint(RenderingHints.KEY_FRACTIONALMETRICS, RenderingHints.VALUE_FRACTIONALMETRICS_ON)
        g.font = (if (rtl) arabicFont else latinFont).deriveFont(size)
        g.color = Color(25, 25, 40)
        val fm = g.fontMetrics
        var y = 160
        for (l in lines) {
            if (l.isEmpty()) { y += fm.height; continue }
            val x = if (rtl) width - 140 - fm.stringWidth(l) else 140
            g.drawString(l, x, y)
            y += (fm.height * 1.25).toInt()
        }
        g.dispose()
        return img
    }

    /** BufferedImage (BGR) -> RGB Mat, the app's colour convention. */
    fun toRgbMat(img: BufferedImage): Mat {
        val bgr = BufferedImage(img.width, img.height, BufferedImage.TYPE_3BYTE_BGR).also { it.graphics.drawImage(img, 0, 0, null) }
        val data = (bgr.raster.dataBuffer as java.awt.image.DataBufferByte).data
        val m = Mat(img.height, img.width, CvType.CV_8UC3)
        m.put(0, 0, data)
        org.opencv.imgproc.Imgproc.cvtColor(m, m, org.opencv.imgproc.Imgproc.COLOR_BGR2RGB)
        return m
    }

    fun saveRgb(m: Mat, name: String) {
        val bgr = Mat()
        if (m.channels() == 3) org.opencv.imgproc.Imgproc.cvtColor(m, bgr, org.opencv.imgproc.Imgproc.COLOR_RGB2BGR) else m.copyTo(bgr)
        Imgcodecs.imwrite(File(out, name).absolutePath, bgr)
        bgr.release()
    }

    /** Levenshtein-based character error rate, ignoring whitespace differences. */
    fun cer(expected: String, actual: String): Double {
        val a = expected.replace(Regex("\\s+"), " ").trim()
        val b = actual.replace(Regex("\\s+"), " ").trim()
        val dp = IntArray(b.length + 1) { it }
        for (i in 1..a.length) {
            var prev = dp[0]
            dp[0] = i
            for (j in 1..b.length) {
                val tmp = dp[j]
                dp[j] = minOf(dp[j] + 1, dp[j - 1] + 1, prev + if (a[i - 1] == b[j - 1]) 0 else 1)
                prev = tmp
            }
        }
        return dp[b.length].toDouble() / a.length.coerceAtLeast(1)
    }
}

/**
 * Real Tesseract (same tessdata_best models the app bundles) through the
 * command-line tool, implementing the app's OcrEngine interface.
 */
class CliTesseractEngine : OcrEngine<Mat> {
    var calls = 0
    val log = mutableListOf<String>()
    override suspend fun recognize(image: Mat, languages: String, layout: PageLayout, wantWords: Boolean): OcrResult {
        calls++
        log += "$languages/$layout"
        val dir = kotlin.io.path.createTempDirectory("tess").toFile()
        try {
            val png = File(dir, "in.png")
            val bgr = Mat()
            if (image.channels() == 3) org.opencv.imgproc.Imgproc.cvtColor(image, bgr, org.opencv.imgproc.Imgproc.COLOR_RGB2BGR) else image.copyTo(bgr)
            Imgcodecs.imwrite(png.absolutePath, bgr)
            bgr.release()
            val psm = when (layout) { PageLayout.AUTO -> "3"; PageLayout.SINGLE_BLOCK -> "6"; PageLayout.SINGLE_LINE -> "7"; PageLayout.RAW_LINE -> "13" }
            val p = ProcessBuilder(
                "tesseract", png.absolutePath, File(dir, "out").absolutePath,
                "--tessdata-dir", Support.tessdata.absolutePath, "-l", languages, "--psm", psm, "--oem", "1",
                "-c", "preserve_interword_spaces=1", "-c", "tessedit_create_txt=1", "-c", "tessedit_create_tsv=1",
            ).redirectErrorStream(true).start()
            val log = p.inputStream.bufferedReader().readText()
            check(p.waitFor(300, TimeUnit.SECONDS)) { "tesseract timeout" }
            check(p.exitValue() == 0) { "tesseract failed: $log" }
            val text = File(dir, "out.txt").readText()
            val words = File(dir, "out.tsv").readLines().drop(1).mapNotNull { line ->
                val c = line.split('\t')
                if (c.size < 12 || c[0] != "5") return@mapNotNull null
                val conf = c[10].toFloatOrNull() ?: return@mapNotNull null
                val l = c[6].toInt(); val t = c[7].toInt()
                WordBox(c[11], l, t, l + c[8].toInt(), t + c[9].toInt(), conf)
            }.filter { it.text.isNotBlank() }
            val mean = if (words.isEmpty()) 0f else words.map { it.confidence }.average().toFloat()
            return OcrResult(text, if (wantWords) words else emptyList(), mean)
        } finally {
            dir.deleteRecursively()
        }
    }
}
