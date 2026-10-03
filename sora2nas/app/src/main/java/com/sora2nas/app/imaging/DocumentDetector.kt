package com.sora2nas.app.imaging

import org.opencv.core.CvType
import org.opencv.core.Mat
import org.opencv.core.MatOfInt
import org.opencv.core.MatOfPoint
import org.opencv.core.MatOfPoint2f
import org.opencv.core.Point
import org.opencv.core.Size
import org.opencv.imgproc.Imgproc
import kotlin.math.abs
import kotlin.math.hypot

/** A point in image pixels (pure Kotlin, so UI code can use it without OpenCV). */
data class Pt(val x: Double, val y: Double)

/** Document corners, always ordered top-left, top-right, bottom-right, bottom-left. */
data class Quad(val tl: Pt, val tr: Pt, val br: Pt, val bl: Pt) {
    val points: List<Pt> get() = listOf(tl, tr, br, bl)

    fun scaled(sx: Double, sy: Double = sx) = Quad(
        Pt(tl.x * sx, tl.y * sy), Pt(tr.x * sx, tr.y * sy), Pt(br.x * sx, br.y * sy), Pt(bl.x * sx, bl.y * sy),
    )

    /** Shoelace area. */
    fun area(): Double {
        val p = points
        var s = 0.0
        for (i in p.indices) {
            val a = p[i]
            val b = p[(i + 1) % p.size]
            s += a.x * b.y - b.x * a.y
        }
        return abs(s) / 2
    }

    companion object {
        fun fullImage(width: Int, height: Int) = Quad(
            Pt(0.0, 0.0), Pt(width - 1.0, 0.0), Pt(width - 1.0, height - 1.0), Pt(0.0, height - 1.0),
        )

        /** Orders 4 arbitrary points into TL, TR, BR, BL. */
        fun fromUnordered(pts: List<Pt>): Quad {
            require(pts.size == 4)
            val iTl = pts.indices.minBy { pts[it].x + pts[it].y }
            val iBr = pts.indices.filter { it != iTl }.maxBy { pts[it].x + pts[it].y }
            val rest = pts.indices.filter { it != iTl && it != iBr }
            val iTr = rest.minBy { pts[it].y - pts[it].x }
            val iBl = rest.first { it != iTr }
            return Quad(pts[iTl], pts[iTr], pts[iBr], pts[iBl])
        }
    }
}

/**
 * Finds the outline of a paper document in a photo (edge + contour analysis).
 * Works on a downscaled copy for speed; the result is in source coordinates.
 */
object DocumentDetector {

    private const val WORK_SIZE = 500

    /** Detection for a captured photo: [detect] followed by [refine]. */
    fun detectPrecise(src: Mat): Quad? = detect(src)?.let { refine(src, it) }

    /** @return the document corners, or null when no convincing outline is found. */
    fun detect(src: Mat): Quad? {
        val scale = MatUtils.scaleFor(src, WORK_SIZE)
        val small = MatUtils.resizeMax(src, WORK_SIZE)
        val gray = MatUtils.toGray(small)
        small.release()
        Imgproc.GaussianBlur(gray, gray, Size(5.0, 5.0), 0.0)
        val imgArea = gray.total().toDouble()

        var best: Quad? = null
        var bestArea = 0.0
        for (edges in edgeMaps(gray)) {
            val contours = ArrayList<MatOfPoint>()
            val hierarchy = Mat()
            Imgproc.findContours(edges, contours, hierarchy, Imgproc.RETR_LIST, Imgproc.CHAIN_APPROX_SIMPLE)
            hierarchy.release()
            edges.release()
            for (c in contours) {
                val area = Imgproc.contourArea(c)
                if (area < imgArea * 0.12) { c.release(); continue }
                val quad = quadFromContour(c)
                c.release()
                if (quad != null) {
                    val qa = quad.area()
                    if (qa > bestArea && qa < imgArea * 0.985) { best = quad; bestArea = qa }
                }
            }
        }
        gray.release()
        return best?.scaled(1.0 / scale)
    }

    /**
     * Sub-pixel refinement of a coarse outline on a larger copy: along each
     * side the strongest edge is searched across the side, a line is fitted
     * through those points (outliers dropped) and the corners are the line
     * intersections. Lines end up slightly inside the paper so no strip of
     * the table remains after flattening. Returns [coarse] if refinement is
     * not trustworthy.
     */
    fun refine(src: Mat, coarse: Quad): Quad {
        val scale = MatUtils.scaleFor(src, REFINE_SIZE)
        val work = MatUtils.resizeMax(src, REFINE_SIZE)
        val gray = MatUtils.toGray(work)
        work.release()
        Imgproc.GaussianBlur(gray, gray, Size(0.0, 0.0), 1.2)
        val gx = Mat(); val gy = Mat()
        Imgproc.Sobel(gray, gx, CvType.CV_32F, 1, 0, 3)
        Imgproc.Sobel(gray, gy, CvType.CV_32F, 0, 1, 3)
        val w = gray.cols(); val h = gray.rows()
        gray.release()
        val fx = FloatArray(w * h).also { gx.get(0, 0, it) }
        val fy = FloatArray(w * h).also { gy.get(0, 0, it) }
        gx.release(); gy.release()

        val q = coarse.scaled(scale)
        val p = q.points
        val cx = p.sumOf { it.x } / 4; val cy = p.sumOf { it.y } / 4
        val radius = (hypot(w.toDouble(), h.toDouble()) * 0.015).coerceAtLeast(6.0)
        // Each side as (point, direction, inward normal).
        val lines = ArrayList<DoubleArray>(4)
        for (i in 0 until 4) {
            val a = p[i]; val b = p[(i + 1) % 4]
            val len = hypot(b.x - a.x, b.y - a.y)
            if (len < 20) return coarse
            val dx = (b.x - a.x) / len; val dy = (b.y - a.y) / len
            var nx = -dy; var ny = dx
            if ((cx - (a.x + b.x) / 2) * nx + (cy - (a.y + b.y) / 2) * ny < 0) { nx = -nx; ny = -ny }
            val ts = ArrayList<Double>(); val offs = ArrayList<Double>()
            for (k in 0 until SAMPLES) {
                val t = 0.08 + 0.84 * k / (SAMPLES - 1)
                val sx = a.x + (b.x - a.x) * t; val sy = a.y + (b.y - a.y) * t
                var bestO = 0.0; var bestG = 0.0
                var o = -radius
                while (o <= radius) {
                    val x = (sx + o * nx).toInt(); val y = (sy + o * ny).toInt()
                    if (x in 1 until w - 1 && y in 1 until h - 1) {
                        val idx = y * w + x
                        val g = abs(fx[idx] * nx + fy[idx] * ny)
                        if (g > bestG) { bestG = g; bestO = o }
                    }
                    o += 0.5
                }
                if (bestG > MIN_EDGE) { ts += t * len; offs += bestO }
            }
            if (ts.size < SAMPLES / 3) return coarse
            val fit = robustLine(ts, offs) ?: return coarse
            // offset(s) = c0 + c1 * s along the side; push inward by INSET px.
            val c0 = fit.first + INSET; val c1 = fit.second
            val px0 = a.x + nx * c0; val py0 = a.y + ny * c0
            val ddx = dx + nx * c1; val ddy = dy + ny * c1
            lines += doubleArrayOf(px0, py0, ddx, ddy)
        }
        val corners = ArrayList<Pt>(4)
        for (i in 0 until 4) {
            // corner i lies between side i-1 and side i
            val l1 = lines[(i + 3) % 4]; val l2 = lines[i]
            val c = intersect(l1, l2) ?: return coarse
            if (hypot(c.x - p[i].x, c.y - p[i].y) > radius * 1.5) return coarse
            corners += c
        }
        val refined = Quad(corners[0], corners[1], corners[2], corners[3])
        return if (isReasonable(refined)) refined.scaled(1.0 / scale) else coarse
    }

    /** Least squares y = a + b x, refitted without points more than 2 px off. */
    private fun robustLine(xs: List<Double>, ys: List<Double>): Pair<Double, Double>? {
        var idx = xs.indices.toList()
        var fit: Pair<Double, Double>? = null
        repeat(3) {
            if (idx.size < 4) return fit
            val n = idx.size.toDouble()
            val mx = idx.sumOf { xs[it] } / n; val my = idx.sumOf { ys[it] } / n
            var sxx = 0.0; var sxy = 0.0
            for (i in idx) { sxx += (xs[i] - mx) * (xs[i] - mx); sxy += (xs[i] - mx) * (ys[i] - my) }
            val b = if (sxx > 1e-9) sxy / sxx else 0.0
            val a = my - b * mx
            fit = a to b
            val res = idx.map { abs(ys[it] - (a + b * xs[it])) }
            val tol = maxOf(2.0, res.sorted()[res.size / 2] * 2.5)
            idx = idx.filterIndexed { j, _ -> res[j] <= tol }
        }
        return fit
    }

    /** Intersection of two lines given as (x, y, dx, dy). */
    private fun intersect(l1: DoubleArray, l2: DoubleArray): Pt? {
        val det = l1[2] * l2[3] - l1[3] * l2[2]
        if (abs(det) < 1e-9) return null
        val t = ((l2[0] - l1[0]) * l2[3] - (l2[1] - l1[1]) * l2[2]) / det
        return Pt(l1[0] + l1[2] * t, l1[1] + l1[3] * t)
    }

    private const val REFINE_SIZE = 2000
    private const val SAMPLES = 40
    private const val MIN_EDGE = 40f
    /** Work pixels the refined sides are moved into the page. */
    private const val INSET = 2.0

    /** Several edge maps make detection robust to low-contrast backgrounds. */
    private fun edgeMaps(gray: Mat): List<Mat> {
        val kernel = Imgproc.getStructuringElement(Imgproc.MORPH_RECT, Size(5.0, 5.0))
        val canny = Mat()
        Imgproc.Canny(gray, canny, 30.0, 90.0)
        Imgproc.morphologyEx(canny, canny, Imgproc.MORPH_CLOSE, kernel)
        Imgproc.dilate(canny, canny, Imgproc.getStructuringElement(Imgproc.MORPH_RECT, Size(3.0, 3.0)))

        val otsu = Mat()
        Imgproc.threshold(gray, otsu, 0.0, 255.0, Imgproc.THRESH_BINARY + Imgproc.THRESH_OTSU)
        Imgproc.morphologyEx(otsu, otsu, Imgproc.MORPH_CLOSE, Imgproc.getStructuringElement(Imgproc.MORPH_RECT, Size(9.0, 9.0)))
        Imgproc.morphologyEx(otsu, otsu, Imgproc.MORPH_OPEN, Imgproc.getStructuringElement(Imgproc.MORPH_RECT, Size(9.0, 9.0)))
        kernel.release()
        return listOf(canny, otsu)
    }

    private fun quadFromContour(contour: MatOfPoint): Quad? {
        val hullIdx = MatOfInt()
        Imgproc.convexHull(contour, hullIdx)
        val pts = contour.toArray()
        val hullPts = hullIdx.toArray().map { pts[it] }
        hullIdx.release()
        if (hullPts.size < 4) return null
        val hull2f = MatOfPoint2f(*hullPts.toTypedArray())
        val peri = Imgproc.arcLength(hull2f, true)
        var result: Quad? = null
        // Try increasing tolerance until the hull collapses to 4 corners.
        for (eps in doubleArrayOf(0.02, 0.03, 0.04, 0.05)) {
            val approx = MatOfPoint2f()
            Imgproc.approxPolyDP(hull2f, approx, eps * peri, true)
            val ap = approx.toArray()
            approx.release()
            if (ap.size == 4) {
                val mp = MatOfPoint(*ap)
                val convex = Imgproc.isContourConvex(mp)
                mp.release()
                if (convex) { result = Quad.fromUnordered(ap.map { Pt(it.x, it.y) }); break }
            }
        }
        if (result == null) {
            // Rounded/occluded corners: fall back to the min-area rectangle if it fits well.
            val rect = Imgproc.minAreaRect(hull2f)
            val rectArea = rect.size.area()
            if (rectArea > 0 && Imgproc.contourArea(hull2f) / rectArea > 0.9) {
                val box = arrayOfNulls<Point>(4)
                rect.points(box)
                result = Quad.fromUnordered(box.map { Pt(it!!.x, it.y) })
            }
        }
        hull2f.release()
        return result?.takeIf { isReasonable(it) }
    }

    /** Rejects degenerate shapes (very sharp angles, extreme aspect ratios). */
    private fun isReasonable(q: Quad): Boolean {
        val p = q.points
        for (i in 0 until 4) {
            val a = p[(i + 3) % 4]; val b = p[i]; val c = p[(i + 1) % 4]
            val v1x = a.x - b.x; val v1y = a.y - b.y
            val v2x = c.x - b.x; val v2y = c.y - b.y
            val cos = (v1x * v2x + v1y * v2y) / (hypot(v1x, v1y) * hypot(v2x, v2y) + 1e-9)
            if (abs(cos) > 0.75) return false // angle outside ~41°..139°
        }
        return true
    }
}
