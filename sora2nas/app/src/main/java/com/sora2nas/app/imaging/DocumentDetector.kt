package com.sora2nas.app.imaging

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
