package com.sora2nas.app.core.table

import com.sora2nas.app.core.ocr.WordBox
import com.sora2nas.app.core.text.LanguageDetector

/**
 * Rebuilds a table without ruling lines from OCR word boxes:
 * rows = words whose vertical centres line up, columns = x-ranges that stay
 * empty between words across all rows (whitespace "rivers").
 */
object BorderlessTableBuilder {

    private data class Phrase(val words: List<WordBox>) {
        val left = words.minOf { it.left }
        val right = words.maxOf { it.right }
    }

    fun build(words: List<WordBox>): TableData {
        val clean = words.filter { it.text.isNotBlank() && it.width > 0 && it.height > 0 }
        if (clean.isEmpty()) return TableData(emptyList())
        val h = median(clean.map { it.height })
        val rtl = isMostlyArabic(clean)

        // 1. rows
        val rows = mutableListOf<MutableList<WordBox>>()
        for (w in clean.sortedBy { it.centerY }) {
            val row = rows.lastOrNull()
            if (row != null && kotlin.math.abs(w.centerY - row.map { it.centerY }.average()) < h * 0.6) row += w
            else rows += mutableListOf(w)
        }

        // 2. words -> phrases (words of one cell are separated by a normal space)
        val phraseRows = rows.map { row ->
            val sorted = row.sortedBy { it.left }
            val phrases = mutableListOf<MutableList<WordBox>>()
            for (w in sorted) {
                val last = phrases.lastOrNull()
                if (last != null && w.left - last.maxOf { it.right } < h * 0.9) last += w else phrases += mutableListOf(w)
            }
            phrases.map { Phrase(it) }
        }

        // 3. column bands from the union of phrase x-ranges (wide spanning phrases ignored)
        val tableLeft = clean.minOf { it.left }
        val tableWidth = (clean.maxOf { it.right } - tableLeft).coerceAtLeast(1)
        val bandSource = phraseRows.flatten().filter { phraseRows.size < 3 || (it.right - it.left) < tableWidth * 0.5 }
        val bands = mutableListOf<IntArray>()
        for (p in bandSource.sortedBy { it.left }) {
            val last = bands.lastOrNull()
            if (last != null && p.left <= last[1] + h * 0.3) last[1] = maxOf(last[1], p.right)
            else bands += intArrayOf(p.left, p.right)
        }
        if (bands.size < 2 || rows.size < 2) {
            // Not a table: one column with one line per row.
            return TableData(phraseRows.map { r -> listOf(r.joinToString(" ") { phraseText(it, rtl) }) }, rightToLeft = rtl)
        }

        // 4. assign phrases to the band they overlap most
        val cols = bands.size
        val grid = phraseRows.map { row ->
            val cells = Array(cols) { mutableListOf<Phrase>() }
            for (p in row) {
                var best = 0
                var bestOverlap = Int.MIN_VALUE
                bands.forEachIndexed { i, b ->
                    val overlap = minOf(p.right, b[1]) - maxOf(p.left, b[0])
                    if (overlap > bestOverlap) { bestOverlap = overlap; best = i }
                }
                cells[best] += p
            }
            cells.map { ps -> ps.sortedBy { it.left }.let { if (rtl) it.reversed() else it }.joinToString(" ") { phraseText(it, rtl) } }
        }
        val ordered = if (rtl) grid.map { it.reversed() } else grid
        return TableData(ordered, rightToLeft = rtl)
    }

    private fun phraseText(p: Phrase, rtl: Boolean): String {
        val sorted = p.words.sortedBy { it.left }
        return (if (rtl) sorted.reversed() else sorted).joinToString(" ") { it.text.trim() }
    }

    private fun isMostlyArabic(words: List<WordBox>): Boolean {
        var ar = 0
        var other = 0
        for (w in words) for (c in w.text) {
            if (LanguageDetector.isArabicLetter(c)) ar++ else if (c.isLetter()) other++
        }
        return ar > other
    }

    private fun median(values: List<Int>): Int = values.sorted()[values.size / 2].coerceAtLeast(1)
}
