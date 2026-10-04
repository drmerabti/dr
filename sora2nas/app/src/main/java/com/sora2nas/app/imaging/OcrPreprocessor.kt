package com.sora2nas.app.imaging

import com.sora2nas.app.core.ocr.OcrImageOps
import org.opencv.core.Core
import org.opencv.core.CvType
import org.opencv.core.Mat
import org.opencv.core.Point
import org.opencv.imgproc.Imgproc
import org.opencv.photo.Photo
import kotlin.math.max

/**
 * Prepares an image for Tesseract: grey, sensible resolution, background /
 * shadow normalisation, light denoising, contrast stretch and deskew.
 * Output is a 1-channel 8-bit Mat (Tesseract's LSTM prefers grey over binary).
 */
class OcrPreprocessor : OcrImageOps<Mat> {

    override fun preprocess(image: Mat, keepGeometry: Boolean): Mat {
        var gray = MatUtils.toGray(image)

        if (!keepGeometry) {
            val longest = max(gray.cols(), gray.rows())
            val target = when {
                longest < MIN_SIDE -> MIN_SIDE.toDouble() / longest // small photos/screenshots: upscale
                longest > MAX_SIDE -> MAX_SIDE.toDouble() / longest
                else -> 1.0
            }
            if (target != 1.0) gray = MatUtils.resizeScale(gray, target).also { gray.release() }
        }

        // Light text on dark background -> invert.
        if (Core.mean(gray).`val`[0] < 100) Core.bitwise_not(gray, gray)

        // Denoise first (noise would otherwise be amplified by the shadow removal).
        // Only when the image is actually noisy, so thin strokes and Arabic dots stay intact.
        val noise = noiseLevel(gray)
        if (noise > 5.0) {
            val den = Mat()
            Photo.fastNlMeansDenoising(gray, den, (noise * 1.3).toFloat().coerceAtMost(30f), 7, 21)
            gray.release()
            gray = den
        } else if (noise > 2.5) {
            Imgproc.medianBlur(gray, gray, 3)
        }

        gray = ImageEnhancer.divideByBackground(gray).also { gray.release() }

        ImageEnhancer.stretchContrast(gray)

        if (!keepGeometry) {
            val angle = estimateSkew(gray)
            if (kotlin.math.abs(angle) >= 0.3) gray = MatUtils.rotateExpand(gray, angle).also { gray.release() }
        }
        return gray
    }

    override fun downscaleForProbe(image: Mat): Mat = MatUtils.resizeMax(image, PROBE_SIDE)

    override fun release(image: Mat) = image.release()

    /** Mean absolute difference to a 3x3 median: a cheap noise estimate. */
    private fun noiseLevel(gray: Mat): Double {
        val small = MatUtils.resizeMax(gray, 1000)
        val med = Mat()
        Imgproc.medianBlur(small, med, 3)
        val diff = Mat()
        Core.absdiff(small, med, diff)
        val v = Core.mean(diff).`val`[0]
        small.release(); med.release(); diff.release()
        return v
    }

    /**
     * Skew angle in degrees (positive = rotate counter-clockwise to fix),
     * found by maximising the variance of the horizontal projection profile
     * of the ink. Works for Arabic and Latin text lines alike.
     */
    fun estimateSkew(gray: Mat, maxAngle: Double = 15.0): Double {
        val small = MatUtils.resizeMax(gray, 900)
        val bin = Mat()
        // Adaptive threshold with a high offset: robust to noise and leftover shading.
        Imgproc.adaptiveThreshold(small, bin, 255.0, Imgproc.ADAPTIVE_THRESH_GAUSSIAN_C, Imgproc.THRESH_BINARY_INV, 31, 18.0)
        small.release()
        if (Core.countNonZero(bin) < bin.total() * 0.002) { bin.release(); return 0.0 }

        fun score(angle: Double): Double {
            val m = Imgproc.getRotationMatrix2D(Point(bin.cols() / 2.0, bin.rows() / 2.0), angle, 1.0)
            val rot = Mat()
            Imgproc.warpAffine(bin, rot, m, bin.size(), Imgproc.INTER_NEAREST)
            val sums = Mat()
            Core.reduce(rot, sums, 1, Core.REDUCE_SUM, CvType.CV_32F)
            val mean = org.opencv.core.MatOfDouble()
            val std = org.opencv.core.MatOfDouble()
            Core.meanStdDev(sums, mean, std)
            val v = std.toArray()[0]
            m.release(); rot.release(); sums.release(); mean.release(); std.release()
            return v * v
        }

        var best = 0.0
        var bestScore = score(0.0)
        var a = -maxAngle
        while (a <= maxAngle) {
            val s = score(a)
            if (s > bestScore) { bestScore = s; best = a }
            a += 1.0
        }
        var fine = best - 1.0
        val center = best
        while (fine <= center + 1.0) {
            val s = score(fine)
            if (s > bestScore) { bestScore = s; best = fine }
            fine += 0.2
        }
        bin.release()
        return best
    }

    companion object {
        const val MIN_SIDE = 1800
        const val MAX_SIDE = 4200
        const val PROBE_SIDE = 1400
    }
}
