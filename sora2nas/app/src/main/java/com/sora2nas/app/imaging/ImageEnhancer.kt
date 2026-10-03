package com.sora2nas.app.imaging

import org.opencv.core.Core
import org.opencv.core.CvType
import org.opencv.core.Mat
import org.opencv.core.Scalar
import org.opencv.core.Size
import org.opencv.imgproc.Imgproc

/** Scan look. Colour is the default; black & white is never forced. */
enum class ScanFilter { ENHANCED_COLOR, ORIGINAL, GRAYSCALE, BLACK_WHITE }

/**
 * User adjustments from the edit screen.
 * @param brightness -1..1 (0 = unchanged)
 * @param contrast   0.5..2 (1 = unchanged)
 * @param sharpness  0..1   (0 = none)
 */
data class ScanAdjustments(
    val filter: ScanFilter = ScanFilter.ENHANCED_COLOR,
    val brightness: Float = 0f,
    val contrast: Float = 1f,
    val sharpness: Float = 0.25f,
)

/**
 * Colour document enhancement: shadow removal (background division),
 * local contrast on the luminance channel, mild saturation boost, then the
 * user's brightness / contrast / sharpness.
 */
object ImageEnhancer {

    /** @param rgb 3-channel RGB. Returns a new 3-channel RGB Mat. */
    fun apply(rgb: Mat, adj: ScanAdjustments): Mat {
        val base: Mat = when (adj.filter) {
            ScanFilter.ORIGINAL -> rgb.clone()
            ScanFilter.ENHANCED_COLOR -> {
                val flat = removeShadows(rgb)
                enhanceColor(flat).also { flat.release() }
            }
            ScanFilter.GRAYSCALE -> {
                val flat = removeShadows(rgb)
                val g = MatUtils.toGray(flat)
                flat.release()
                stretchContrast(g)
                MatUtils.toRgb(g).also { g.release() }
            }
            ScanFilter.BLACK_WHITE -> {
                val g = MatUtils.toGray(rgb)
                val bw = Mat()
                val block = (maxOf(g.cols(), g.rows()) / 40) or 1
                Imgproc.adaptiveThreshold(g, bw, 255.0, Imgproc.ADAPTIVE_THRESH_GAUSSIAN_C, Imgproc.THRESH_BINARY, maxOf(block, 15), 12.0)
                g.release()
                MatUtils.toRgb(bw).also { bw.release() }
            }
        }
        adjust(base, adj.brightness, adj.contrast)
        if (adj.sharpness > 0.01f) sharpen(base, adj.sharpness)
        return base
    }

    /**
     * Removes shadows and uneven lighting while keeping ink and stamp colours:
     * the paper brightness (a smooth "background" image) is estimated from the
     * luminance, then every channel is divided by it. Since all channels get
     * the same factor, hues and saturation are preserved.
     */
    fun removeShadows(rgb: Mat): Mat {
        val gray = MatUtils.toGray(rgb)
        val bg = estimateBackground(gray)
        gray.release()
        val bg32 = Mat()
        bg.convertTo(bg32, CvType.CV_32F, 1.0 / 255.0)
        bg.release()
        Core.max(bg32, Scalar(0.05), bg32)
        val bg3 = Mat()
        Core.merge(listOf(bg32, bg32, bg32), bg3)
        bg32.release()
        val src32 = Mat()
        rgb.convertTo(src32, CvType.CV_32FC3)
        val res32 = Mat()
        Core.divide(src32, bg3, res32)
        val res = Mat()
        res32.convertTo(res, CvType.CV_8UC3)
        src32.release(); bg3.release(); res32.release()
        return res
    }

    /** Single-channel background normalisation (used for OCR). */
    fun divideByBackground(plane: Mat): Mat {
        val bg = estimateBackground(plane)
        val p32 = Mat(); val bg32 = Mat()
        plane.convertTo(p32, CvType.CV_32F)
        bg.convertTo(bg32, CvType.CV_32F)
        Core.max(bg32, Scalar(1.0), bg32)
        val res32 = Mat()
        Core.divide(p32, bg32, res32, 255.0)
        val res = Mat()
        res32.convertTo(res, CvType.CV_8U)
        p32.release(); bg32.release(); res32.release(); bg.release()
        return res
    }

    /**
     * Paper brightness: max filter on a tiny copy (removes text, stamps and
     * logos up to ~9 % of the page size) followed by a wide blur, so only the
     * slowly varying lighting/shadow remains.
     */
    private fun estimateBackground(gray: Mat): Mat {
        val small = MatUtils.resizeMax(gray, 160)
        val k = Imgproc.getStructuringElement(Imgproc.MORPH_ELLIPSE, Size(15.0, 15.0))
        Imgproc.dilate(small, small, k)
        k.release()
        Imgproc.GaussianBlur(small, small, Size(0.0, 0.0), 5.0)
        val bg = Mat()
        Imgproc.resize(small, bg, gray.size(), 0.0, 0.0, Imgproc.INTER_CUBIC)
        small.release()
        return bg
    }

    /**
     * "Levels" on L (Lab): the paper (most frequent bright tone) becomes pure
     * white and ink gets deeper, without amplifying noise in flat areas; then
     * saturation x1.2 for vivid but natural colours.
     */
    fun enhanceColor(rgb: Mat): Mat {
        val lab = Mat()
        Imgproc.cvtColor(rgb, lab, Imgproc.COLOR_RGB2Lab)
        val ch = ArrayList<Mat>()
        Core.split(lab, ch)
        val black = MatUtils.percentile(ch[0], 0.5).toDouble()
        val white = MatUtils.percentile(ch[0], 60.0).coerceIn(150, 250).toDouble()
        if (white - black > 40) {
            val alpha = 255.0 / (white - black)
            ch[0].convertTo(ch[0], -1, alpha, -black * alpha)
        }
        Core.merge(ch, lab)
        ch.forEach { it.release() }
        val rgbOut = Mat()
        Imgproc.cvtColor(lab, rgbOut, Imgproc.COLOR_Lab2RGB)
        lab.release()

        val hsv = Mat()
        Imgproc.cvtColor(rgbOut, hsv, Imgproc.COLOR_RGB2HSV)
        val hs = ArrayList<Mat>()
        Core.split(hsv, hs)
        hs[1].convertTo(hs[1], -1, 1.2, 0.0)
        Core.merge(hs, hsv)
        hs.forEach { it.release() }
        Imgproc.cvtColor(hsv, rgbOut, Imgproc.COLOR_HSV2RGB)
        hsv.release()
        return rgbOut
    }

    /**
     * Gentle linear stretch (in place): the paper tone (99th percentile) goes to
     * white and the darkest ink (0.2th percentile) towards black. The gain is
     * capped so that pages with very little text do not get their noise
     * amplified.
     */
    fun stretchContrast(gray: Mat) {
        val lo = MatUtils.percentile(gray, 0.2).coerceAtMost(110)
        val hi = MatUtils.percentile(gray, 99.0)
        if (hi - lo < 40) return
        val alpha = (255.0 / (hi - lo)).coerceAtMost(1.6)
        gray.convertTo(gray, -1, alpha, 255.0 - hi * alpha)
    }

    /** In place: brightness -1..1, contrast 0.5..2 around mid-grey. */
    fun adjust(img: Mat, brightness: Float, contrast: Float) {
        if (brightness == 0f && contrast == 1f) return
        val alpha = contrast.toDouble().coerceIn(0.3, 3.0)
        val beta = brightness.coerceIn(-1f, 1f) * 100.0 + 128.0 * (1 - alpha)
        img.convertTo(img, -1, alpha, beta)
    }

    /** In place unsharp mask; [amount] 0..1. */
    fun sharpen(img: Mat, amount: Float) {
        val blur = Mat()
        Imgproc.GaussianBlur(img, blur, Size(0.0, 0.0), 2.0)
        val a = amount.coerceIn(0f, 1f) * 1.5
        Core.addWeighted(img, 1 + a, blur, -a, 0.0, img)
        blur.release()
    }
}
