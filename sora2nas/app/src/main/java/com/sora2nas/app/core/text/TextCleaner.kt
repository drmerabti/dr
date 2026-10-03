package com.sora2nas.app.core.text

import java.text.Normalizer

/**
 * Post-OCR text cleanup:
 *  - normalises Unicode (Arabic presentation forms -> base letters, NFC),
 *  - removes invisible characters and repeated spaces,
 *  - joins lines that were broken by the page layout while keeping paragraphs,
 *    list items, headings and lines that end a sentence,
 *  - re-joins Latin words hyphenated across a line break.
 */
object TextCleaner {

    private val SENTENCE_END = setOf('.', '!', '?', ':', ';', '؟', '؛', '…', '»', '"', ')', ']')
    private val LIST_START = Regex("""^(\s*)([-•●▪◦*·–—]|\(?\d{1,3}[.)\-]|\(?[a-zA-Zأ-ي][.)])\s+""")
    private val MULTI_SPACE = Regex("""[ \t  -   　]+""")
    private val INVISIBLE = Regex("""[​‎‏‪-‮⁦-⁩﻿­]""")
    private val SPACE_BEFORE_PUNCT = Regex(""" +([,.،)\]}])""")
    private val SPACE_AFTER_OPEN = Regex("""([(\[{]) +""")

    fun clean(raw: String): String {
        if (raw.isBlank()) return ""
        var text = normalizeUnicode(raw)
            .replace("\r\n", "\n").replace('\r', '\n')
            .replace('\u000C', '\n') // form feed emitted by Tesseract between pages
        text = INVISIBLE.replace(text, "")

        val lines = text.split('\n').map { cleanLine(it) }
        val paragraphs = splitParagraphs(lines)
        return paragraphs.joinToString("\n\n") { joinParagraph(it) }.trim()
    }

    /** NFKC folds Arabic presentation forms (U+FB50–U+FEFF) and ligatures back to letters. */
    fun normalizeUnicode(s: String): String {
        val hasPresentationForms = s.any { it in 'ﭐ'..'﷿' || it in 'ﹰ'..'﻿' }
        val folded = if (hasPresentationForms) {
            buildString {
                for (ch in s) {
                    if (ch in 'ﭐ'..'﷿' || ch in 'ﹰ'..'﻾') append(Normalizer.normalize(ch.toString(), Normalizer.Form.NFKC))
                    else append(ch)
                }
            }
        } else s
        return Normalizer.normalize(folded, Normalizer.Form.NFC)
    }

    private fun cleanLine(line: String): String {
        var l = MULTI_SPACE.replace(line, " ").trim()
        l = SPACE_BEFORE_PUNCT.replace(l, "$1")
        l = SPACE_AFTER_OPEN.replace(l, "$1")
        // Lines made only of OCR noise (|, _, ~, stray dots) are dropped.
        if (l.isNotEmpty() && l.all { it in "|_~-=.,'`^*:;" || it.isWhitespace() } && l.length < 6) return ""
        return l
    }

    private fun splitParagraphs(lines: List<String>): List<List<String>> {
        val result = mutableListOf<List<String>>()
        var current = mutableListOf<String>()
        for (l in lines) {
            if (l.isEmpty()) {
                if (current.isNotEmpty()) { result += current; current = mutableListOf() }
            } else current += l
        }
        if (current.isNotEmpty()) result += current
        return result
    }

    /** Joins the lines of one paragraph, keeping intentional line breaks. */
    private fun joinParagraph(lines: List<String>): String {
        if (lines.size == 1) return lines[0]
        val avgLen = lines.map { it.length }.average()
        val sb = StringBuilder(lines[0])
        for (i in 1 until lines.size) {
            val prev = lines[i - 1]
            val next = lines[i]
            when {
                // "infor-" + "mation" -> "information" (Latin only)
                prev.length > 1 && prev.last() == '-' && prev[prev.length - 2].isLetter() &&
                    prev[prev.length - 2].code < 0x0590 && next.first().isLowerCase() -> {
                    sb.setLength(sb.length - 1)
                    sb.append(next)
                }
                shouldBreak(prev, next, avgLen) -> sb.append('\n').append(next)
                else -> sb.append(' ').append(next)
            }
        }
        return sb.toString()
    }

    private fun shouldBreak(prev: String, next: String, avgLen: Double): Boolean {
        if (LIST_START.containsMatchIn(next)) return true
        val last = prev.last()
        if (last == ':') return true
        val endsSentence = last in SENTENCE_END
        // The last line of a sentence/paragraph is usually shorter than the column width.
        if (endsSentence && prev.length < avgLen * 0.6) return true
        // A very short line not ending with a comma is a title or a standalone line.
        if (prev.length < avgLen * 0.5 && last != ',' && last != '،') return true
        return false
    }
}
