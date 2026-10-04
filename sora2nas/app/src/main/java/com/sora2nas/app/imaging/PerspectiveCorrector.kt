package com.sora2nas.app.imaging

import org.opencv.core.Core
import org.opencv.core.Mat
import org.opencv.core.MatOfPoint2f
import org.opencv.core.Point
import org.opencv.core.Size
import org.opencv.imgproc.Imgproc
import kotlin.math.hypot
import kotlin.math.max
import kotlin.math.roundToInt

/** Flattens the document inside [Quad] into a rectangle ("perspective correction"). */
object PerspectiveCorrector {

    fun warp(src: Mat, quad: Quad): Mat {
        val (tl, tr, br, bl) = quad
        val width = max(hypot(tr.x - tl.x, tr.y - tl.y), hypot(br.x - bl.x, br.y - bl.y)).roundToInt().coerceAtLeast(10)
        val height = max(hypot(bl.x - tl.x, bl.y - tl.y), hypot(br.x - tr.x, br.y - tr.y)).roundToInt().coerceAtLeast(10)
        val srcPts = MatOfPoint2f(Point(tl.x, tl.y), Point(tr.x, tr.y), Point(br.x, br.y), Point(bl.x, bl.y))
        val dstPts = MatOfPoint2f(
            Point(0.0, 0.0), Point(width - 1.0, 0.0), Point(width - 1.0, height - 1.0), Point(0.0, height - 1.0),
        )
        val m = Imgproc.getPerspectiveTransform(srcPts, dstPts)
        val dst = Mat()
        Imgproc.warpPerspective(src, dst, m, Size(width.toDouble(), height.toDouble()), Imgproc.INTER_CUBIC, Core.BORDER_REPLICATE)
        srcPts.release(); dstPts.release(); m.release()
        return dst
    }
}
