package com.sora2nas.app.imaging

import com.sora2nas.app.core.table.CellRegion
import com.sora2nas.app.core.table.GridTableBuilder
import org.opencv.core.Core
import org.opencv.core.CvType
import org.opencv.core.Mat
import org.opencv.core.Rect
import org.opencv.core.Size
import org.opencv.imgproc.Imgproc

/**
 * Detects a ruled table grid with morphological line extraction:
 * long horizontal / vertical strokes survive an "open" with a long thin
 * kernel, text does not. Line positions come from projection profiles.
 */
object TableDetector {

    class Grid(
        val xs: List<Int>,
        val ys: List<Int>,
        val cells: List<CellRegion>,
        /** Thickest ruling line found (pixels); used to erase lines before OCR. */
        val lineThickness: Int,
    ) {
        val rows: Int get() = ys.size - 1
        val cols: Int get() = xs.size - 1
    }

    /** @param gray 1-channel image. Returns null when no ruled grid is found. */
    fun detectGrid(gray: Mat): Grid? {
        val bin = Mat()
        Imgproc.adaptiveThreshold(gray, bin, 255.0, Imgproc.ADAPTIVE_THRESH_MEAN_C, Imgproc.THRESH_BINARY_INV, 15, 10.0)

        val horiz = Mat()
        val hLen = maxOf(gray.cols() / 30, 20).toDouble()
        val hKernel = Imgproc.getStructuringElement(Imgproc.MORPH_RECT, Size(hLen, 1.0))
        Imgproc.morphologyEx(bin, horiz, Imgproc.MORPH_OPEN, hKernel)
        Imgproc.dilate(horiz, horiz, Imgproc.getStructuringElement(Imgproc.MORPH_RECT, Size(5.0, 3.0)))

        val vert = Mat()
        val vLen = maxOf(gray.rows() / 30, 40).toDouble()
        val vKernel = Imgproc.getStructuringElement(Imgproc.MORPH_RECT, Size(1.0, vLen))
        Imgproc.morphologyEx(bin, vert, Imgproc.MORPH_OPEN, vKernel)
        Imgproc.dilate(vert, vert, Imgproc.getStructuringElement(Imgproc.MORPH_RECT, Size(3.0, 5.0)))
        bin.release(); hKernel.release(); vKernel.release()

        val yRuns = lineRuns(horiz, horizontal = true)
        val xRuns = lineRuns(vert, horizontal = false)
        val ys = yRuns.map { (it.first + it.last) / 2 }
        val xs = xRuns.map { (it.first + it.last) / 2 }
        if (ys.size < 2 || xs.size < 2) {
            horiz.release(); vert.release()
            return null
        }

        val cells = GridTableBuilder.buildCells(xs, ys) { row, boundary ->
            // Is there a vertical stroke at xs[boundary] between ys[row] and ys[row+1]?
            val x0 = (xs[boundary] - 4).coerceAtLeast(0)
            val x1 = (xs[boundary] + 4).coerceAtMost(vert.cols() - 1)
            val y0 = ys[row] + (ys[row + 1] - ys[row]) / 5
            val y1 = ys[row + 1] - (ys[row + 1] - ys[row]) / 5
            if (y1 <= y0) return@buildCells true
            val roi = vert.submat(Rect(x0, y0, x1 - x0 + 1, y1 - y0))
            val colMax = Mat()
            Core.reduce(roi, colMax, 1, Core.REDUCE_MAX) // per row: any line pixel in the band?
            val covered = Core.countNonZero(colMax).toDouble() / (y1 - y0)
            colMax.release()
            covered > 0.6
        }
        horiz.release(); vert.release()
        val thickness = (xRuns + yRuns).maxOf { it.last - it.first + 1 }
        return Grid(xs, ys, cells, thickness)
    }

    /** Pixel runs of lines: rows (or columns) where the line mask is long enough. */
    private fun lineRuns(mask: Mat, horizontal: Boolean): List<IntRange> {
        val sums = Mat()
        // dim=1 -> one value per row; dim=0 -> one value per column
        Core.reduce(mask, sums, if (horizontal) 1 else 0, Core.REDUCE_SUM, CvType.CV_32S)
        val n = if (horizontal) sums.rows() else sums.cols()
        val values = IntArray(n)
        sums.get(0, 0, values)
        sums.release()
        val counts = values.map { it / 255 }
        val maxCount = counts.maxOrNull() ?: 0
        val span = if (horizontal) mask.cols() else mask.rows()
        if (maxCount < span * 0.15) return emptyList()
        val threshold = maxOf(maxCount * 0.35, span * 0.1)
        val candidates = counts.indices.filter { counts[it] >= threshold }
        return GridTableBuilder.clusterRuns(candidates, minGap = 8)
    }
}
