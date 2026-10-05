package com.sora2nas.app.imaging

import org.opencv.core.Core
import org.opencv.core.Mat
import org.opencv.core.Point
import org.opencv.core.Scalar
import org.opencv.core.Size
import org.opencv.imgproc.Imgproc
import kotlin.math.abs
import kotlin.math.cos
import kotlin.math.max
import kotlin.math.sin

/**
 * Small OpenCV helpers. Convention for the whole imaging package:
 * colour images are 3-channel **RGB** 8-bit Mats (Android bitmaps are converted
 * from RGBA at the platform boundary), grey images are 1-channel 8-bit.
 */
object MatUtils {

    fun toGray(src: Mat): Mat {
        val gray = Mat()
        when (src.channels()) {
            4 -> Imgproc.cvtColor(src, gray, Imgproc.COLOR_RGBA2GRAY)
            3 -> Imgproc.cvtColor(src, gray, Imgproc.COLOR_RGB2GRAY)
            else -> src.copyTo(gray)
        }
        return gray
    }

    fun toRgb(src: Mat): Mat {
        val rgb = Mat()
        when (src.channels()) {
            4 -> Imgproc.cvtColor(src, rgb, Imgproc.COLOR_RGBA2RGB)
            1 -> Imgproc.cvtColor(src, rgb, Imgproc.COLOR_GRAY2RGB)
            else -> src.copyTo(rgb)
        }
        return rgb
    }

    /** Scale factor that brings the longest side to [maxSide] (never enlarges). */
    fun scaleFor(src: Mat, maxSide: Int): Double {
        val longest = max(src.cols(), src.rows())
        return if (longest <= maxSide) 1.0 else maxSide.toDouble() / longest
    }

    /** Returns a copy whose longest side is at most [maxSide]. */
    fun resizeMax(src: Mat, maxSide: Int): Mat {
        val s = scaleFor(src, maxSide)
        val dst = Mat()
        if (s >= 1.0) src.copyTo(dst)
        else Imgproc.resize(src, dst, Size(src.cols() * s, src.rows() * s), 0.0, 0.0, Imgproc.INTER_AREA)
        return dst
    }

    fun resizeScale(src: Mat, scale: Double): Mat {
        val dst = Mat()
        val interp = if (scale > 1.0) Imgproc.INTER_CUBIC else Imgproc.INTER_AREA
        Imgproc.resize(src, dst, Size(maxOf(1.0, src.cols() * scale), maxOf(1.0, src.rows() * scale)), 0.0, 0.0, interp)
        return dst
    }

    /**
     * Rotates by [degrees] (positive = counter-clockwise) around the centre,
     * enlarging the canvas so nothing is cut, filling with white.
     */
    fun rotateExpand(src: Mat, degrees: Double): Mat {
        val w = src.cols().toDouble()
        val h = src.rows().toDouble()
        val rad = Math.toRadians(degrees)
        val newW = abs(w * cos(rad)) + abs(h * sin(rad))
        val newH = abs(w * sin(rad)) + abs(h * cos(rad))
        val m = Imgproc.getRotationMatrix2D(Point(w / 2, h / 2), degrees, 1.0)
        m.put(0, 2, m.get(0, 2)[0] + (newW - w) / 2)
        m.put(1, 2, m.get(1, 2)[0] + (newH - h) / 2)
        val dst = Mat()
        val white = if (src.channels() == 1) Scalar(255.0) else Scalar(255.0, 255.0, 255.0, 255.0)
        Imgproc.warpAffine(src, dst, m, Size(newW, newH), Imgproc.INTER_CUBIC, Core.BORDER_CONSTANT, white)
        m.release()
        return dst
    }

    /** Rotates by a multiple of 90° clockwise (0, 90, 180, 270). */
    fun rotate90(src: Mat, clockwiseDegrees: Int): Mat {
        val dst = Mat()
        when (((clockwiseDegrees % 360) + 360) % 360) {
            90 -> Core.rotate(src, dst, Core.ROTATE_90_CLOCKWISE)
            180 -> Core.rotate(src, dst, Core.ROTATE_180)
            270 -> Core.rotate(src, dst, Core.ROTATE_90_COUNTERCLOCKWISE)
            else -> src.copyTo(dst)
        }
        return dst
    }

    /** Value at the given percentile (0..100) of an 8-bit grey image. */
    fun percentile(gray: Mat, p: Double): Int {
        val hist = IntArray(256)
        val small = resizeMax(gray, 800)
        val data = ByteArray((small.total() * small.channels()).toInt())
        small.get(0, 0, data)
        small.release()
        for (b in data) hist[b.toInt() and 0xFF]++
        val target = data.size * p / 100.0
        var acc = 0L
        for (i in 0 until 256) {
            acc += hist[i]
            if (acc >= target) return i
        }
        return 255
    }
}
