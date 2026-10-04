package com.sora2nas.app.core.table

import com.sora2nas.app.core.ocr.WordBox
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class TableBuildersTest {

    @Test
    fun `clusters thick line pixels into one position`() {
        assertEquals(listOf(11, 50, 101), GridTableBuilder.clusterPositions(listOf(10, 11, 12, 49, 50, 51, 100, 102), minGap = 3))
        assertEquals(emptyList<Int>(), GridTableBuilder.clusterPositions(emptyList(), 3))
    }

    @Test
    fun `builds a 2x3 grid`() {
        val cells = GridTableBuilder.buildCells(listOf(0, 100, 200, 300), listOf(0, 50, 100))
        assertEquals(6, cells.size)
        assertEquals(PixelRect(100, 50, 200, 100), cells.first { it.row == 1 && it.col == 1 }.rect)
    }

    @Test
    fun `missing separator merges cells`() {
        // In row 0 the line at boundary 1 (x=100) is absent -> first cell spans 2 columns.
        val cells = GridTableBuilder.buildCells(listOf(0, 100, 200, 300), listOf(0, 50, 100)) { row, b -> !(row == 0 && b == 1) }
        val row0 = cells.filter { it.row == 0 }
        assertEquals(2, row0.size)
        assertEquals(2, row0[0].colSpan)
        assertEquals(PixelRect(0, 0, 200, 50), row0[0].rect)
    }

    @Test
    fun `assemble reverses columns for right-to-left tables`() {
        val cells = GridTableBuilder.buildCells(listOf(0, 100, 200), listOf(0, 50))
        val t = GridTableBuilder.assemble(1, 2, listOf(cells[0] to "يسار", cells[1] to "يمين"), rightToLeft = true)
        assertEquals(listOf("يمين", "يسار"), t.cells[0])
        assertTrue(t.rightToLeft)
    }

    @Test
    fun `assemble records merges`() {
        val cells = GridTableBuilder.buildCells(listOf(0, 100, 200, 300), listOf(0, 50)) { _, b -> b != 1 }
        val t = GridTableBuilder.assemble(1, 3, cells.map { it to "x${it.col}" }, rightToLeft = false)
        assertEquals(listOf(CellMerge(0, 0, 2)), t.merges)
        assertEquals(listOf("x0", "", "x2"), t.cells[0])
    }

    private fun w(text: String, l: Int, t: Int, width: Int = text.length * 18, h: Int = 30) = WordBox(text, l, t, l + width, t + h, 90f)

    @Test
    fun `borderless table from word boxes`() {
        val words = listOf(
            w("Nom", 10, 10), w("Quantité", 300, 12), w("Prix", 600, 10),
            w("Ciment", 10, 60), w("CEM", 130, 61), w("120", 300, 60), w("950", 600, 62),
            w("Sable", 10, 110), w("40", 300, 110), w("300", 600, 109),
        )
        val t = BorderlessTableBuilder.build(words)
        assertEquals(3, t.rowCount)
        assertEquals(3, t.colCount)
        assertEquals("Ciment CEM", t.cell(1, 0))
        assertEquals("950", t.cell(1, 2))
        assertEquals(false, t.rightToLeft)
    }

    @Test
    fun `borderless arabic table is right to left`() {
        val words = listOf(
            w("الاسم", 600, 10), w("الكمية", 10, 10),
            w("إسمنت", 600, 60), w("120", 10, 60),
        )
        val t = BorderlessTableBuilder.build(words)
        assertTrue(t.rightToLeft)
        assertEquals(listOf("الاسم", "الكمية"), t.cells[0])
        assertEquals(listOf("إسمنت", "120"), t.cells[1])
    }

    @Test
    fun `tsv round trip`() {
        val t = TableData(listOf(listOf("a", "b"), listOf("c")))
        val back = TableData.fromTsv(t.toTsv())
        assertEquals(listOf(listOf("a", "b"), listOf("c", "")), back.cells)
        assertEquals("z", t.withCell(1, 1, "z").cell(1, 1))
    }
}
