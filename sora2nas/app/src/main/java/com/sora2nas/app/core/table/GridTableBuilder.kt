package com.sora2nas.app.core.table

/** Pixel rectangle (right/bottom exclusive). */
data class PixelRect(val left: Int, val top: Int, val right: Int, val bottom: Int) {
    val width: Int get() = right - left
    val height: Int get() = bottom - top
}

/** A cell to OCR: grid position (left-to-right column index) and its pixel area. */
data class CellRegion(val row: Int, val col: Int, val colSpan: Int, val rect: PixelRect)

/**
 * Turns detected ruling-line positions into cells (pure geometry, no OpenCV).
 */
object GridTableBuilder {

    /**
     * Groups nearby positions (the several pixel rows of one thick line) into
     * runs, e.g. [10,11,12,50,51] -> [10..12, 50..51].
     */
    fun clusterRuns(positions: List<Int>, minGap: Int): List<IntRange> {
        if (positions.isEmpty()) return emptyList()
        val sorted = positions.sorted()
        val out = mutableListOf<IntRange>()
        var start = sorted[0]
        var prev = sorted[0]
        for (i in 1 until sorted.size) {
            val p = sorted[i]
            if (p - prev > minGap) {
                out += start..prev
                start = p
            }
            prev = p
        }
        out += start..prev
        return out
    }

    /** Centre of each run of [clusterRuns], e.g. [10,11,12,50,51] -> [11,50]. */
    fun clusterPositions(positions: List<Int>, minGap: Int): List<Int> =
        clusterRuns(positions, minGap).map { (it.first + it.last) / 2 }

    /**
     * @param xs vertical line x positions (sorted, >= 2)
     * @param ys horizontal line y positions (sorted, >= 2)
     * @param hasSeparator returns whether the vertical line [xs] index `boundary`
     *        (1 until xs.size-1) really separates the cells of `row`. When it does
     *        not, the two cells are merged (colspan).
     */
    fun buildCells(
        xs: List<Int>,
        ys: List<Int>,
        hasSeparator: (row: Int, boundary: Int) -> Boolean = { _, _ -> true },
    ): List<CellRegion> {
        require(xs.size >= 2 && ys.size >= 2) { "need at least 2 lines in each direction" }
        val cells = mutableListOf<CellRegion>()
        for (r in 0 until ys.size - 1) {
            var c = 0
            while (c < xs.size - 1) {
                var span = 1
                while (c + span < xs.size - 1 && !hasSeparator(r, c + span)) span++
                cells += CellRegion(r, c, span, PixelRect(xs[c], ys[r], xs[c + span], ys[r + 1]))
                c += span
            }
        }
        return cells
    }

    /**
     * Assembles OCR'd cell texts into a [TableData]. For right-to-left tables the
     * column order is reversed so that column 0 is the right-most column.
     */
    fun assemble(rows: Int, cols: Int, cells: List<Pair<CellRegion, String>>, rightToLeft: Boolean): TableData {
        val grid = Array(rows) { Array(cols) { "" } }
        val merges = mutableListOf<CellMerge>()
        for ((region, text) in cells) {
            val col = if (rightToLeft) cols - region.col - region.colSpan else region.col
            grid[region.row][col] = text
            if (region.colSpan > 1) merges += CellMerge(region.row, col, region.colSpan)
        }
        return TableData(grid.map { it.toList() }, merges, rightToLeft)
    }
}
