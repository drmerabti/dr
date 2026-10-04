package com.sora2nas.app.core.table

/** A horizontal merge: the cell at ([row],[col]) spans [colSpan] columns. */
data class CellMerge(val row: Int, val col: Int, val colSpan: Int)

/**
 * Rectangular table model used for preview, editing and export.
 * Cells covered by a merge (other than its first cell) hold "".
 * Column 0 is the *first* column in reading order (the right-most one for
 * Arabic tables, in which case [rightToLeft] is true).
 */
data class TableData(
    val cells: List<List<String>>,
    val merges: List<CellMerge> = emptyList(),
    val rightToLeft: Boolean = false,
) {
    val rowCount: Int get() = cells.size
    val colCount: Int get() = cells.maxOfOrNull { it.size } ?: 0

    fun cell(row: Int, col: Int): String = cells.getOrNull(row)?.getOrNull(col) ?: ""

    fun withCell(row: Int, col: Int, text: String): TableData =
        copy(cells = cells.mapIndexed { r, line ->
            if (r != row) line else List(maxOf(line.size, col + 1)) { c -> if (c == col) text else line.getOrElse(c) { "" } }
        })

    /** Pads every row to the same width. */
    fun normalized(): TableData {
        val w = colCount
        return copy(cells = cells.map { r -> if (r.size == w) r else r + List(w - r.size) { "" } })
    }

    fun isEmpty(): Boolean = cells.all { row -> row.all { it.isBlank() } }

    /** Tab-separated text, used for history storage, search and copy. */
    fun toTsv(): String = normalized().cells.joinToString("\n") { row ->
        row.joinToString("\t") { it.replace('\t', ' ').replace('\n', ' ') }
    }

    companion object {
        fun fromTsv(tsv: String, rightToLeft: Boolean = false): TableData =
            TableData(tsv.split('\n').filter { it.isNotEmpty() }.map { it.split('\t') }, rightToLeft = rightToLeft).normalized()
    }
}
