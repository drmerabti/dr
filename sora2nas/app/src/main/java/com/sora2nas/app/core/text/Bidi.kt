package com.sora2nas.app.core.text

/**
 * Direction of mixed Arabic / Latin text.
 *
 * Phones, Word and Excel pick a line's direction from its FIRST strong letter,
 * so an Arabic line that starts with "Windows" or "PDF" is laid out left to
 * right and reads back to front. Here a line's direction is decided by the
 * majority of its letters instead, and an invisible mark (RLM / LRM) is put in
 * front of lines whose first letter disagrees, so every app shows them right.
 */
object Bidi {
    const val RLM = '‏'
    const val LRM = '‎'

    fun isRtlChar(c: Char): Boolean =
        c in '֐'..'ࣿ' || c in 'יִ'..'﷿' || c in 'ﹰ'..'ﻼ' || c == RLM

    private fun isLtrStrong(c: Char): Boolean = c == LRM || (c.isLetter() && !isRtlChar(c))

    /** True when most letters of [s] are right-to-left (Arabic/Hebrew). */
    fun isRtl(s: String): Boolean {
        var rtl = 0
        var ltr = 0
        for (c in s) {
            if (isRtlChar(c)) rtl++ else if (isLtrStrong(c)) ltr++
        }
        return rtl > 0 && rtl >= ltr
    }

    /** Direction of the first strong character, or null when there is none. */
    fun firstStrongIsRtl(s: String): Boolean? {
        for (c in s) {
            if (isRtlChar(c)) return true
            if (isLtrStrong(c)) return false
        }
        return null
    }

    /** Adds a direction mark to each line whose first letter would give it the wrong direction. Idempotent. */
    fun markLines(text: String): String {
        if (text.none { isRtlChar(it) }) return text
        return text.split('\n').joinToString("\n") { line ->
            val first = firstStrongIsRtl(line) ?: return@joinToString line
            val rtl = isRtl(line)
            when {
                rtl && !first -> RLM + line
                !rtl && first -> LRM + line
                else -> line
            }
        }
    }

    /** Removes the marks added by [markLines] (for comparisons and search). */
    fun stripMarks(text: String): String = text.replace(RLM.toString(), "").replace(LRM.toString(), "")

    /** Units written after a number ("250 kW", "50 Hz"): the number stays first. */
    private val UNITS = setOf(
        "V", "kV", "mV", "A", "mA", "kA", "W", "kW", "MW", "GW", "VA", "kVA", "MVA", "var", "kvar", "Wh", "kWh", "MWh",
        "Hz", "kHz", "MHz", "rpm", "bar", "mbar", "Pa", "kPa", "MPa", "K", "m", "cm", "mm", "km", "µm", "kg", "g", "t",
        "s", "ms", "min", "h", "l", "L", "Nm", "N", "kN", "dB", "F", "µF", "mF", "DA", "DZD", "EUR", "USD",
    )

    private fun isNumberToken(t: String) = t.any { it.isDigit() } && t.none { it.isLetter() }
    private fun isLatinToken(t: String) = t.any { isLtrStrong(it) } && t.none { isRtlChar(it) }

    /**
     * Tesseract puts a number in front of the Latin word it belongs to inside
     * Arabic lines ("نظام 11 Windows" instead of "نظام Windows 11"). Moves the
     * number back after the Latin words, except before units ("250 kW").
     */
    fun fixOcrNumberOrder(text: String): String = text.split('\n').joinToString("\n") { raw ->
        val line = stripMarks(raw)
        if (!isRtl(line)) return@joinToString line
        val toks = line.split(' ').toMutableList()
        var i = 0
        while (i < toks.size - 1) {
            val next = toks[i + 1]
            if (isNumberToken(toks[i]) && isLatinToken(next) && next.trim { !it.isLetterOrDigit() } !in UNITS) {
                var j = i + 1
                while (j + 1 < toks.size && isLatinToken(toks[j + 1])) j++
                toks.add(j, toks.removeAt(i))
                i = j + 1
            } else {
                i++
            }
        }
        toks.joinToString(" ")
    }

    /** Splits [s] into runs of one direction; spaces and punctuation stay with the run they are in. */
    fun runs(s: String): List<Pair<String, Boolean>> {
        val out = mutableListOf<Pair<String, Boolean>>()
        val sb = StringBuilder()
        var dir: Boolean? = null
        for (c in s) {
            val d = when {
                isRtlChar(c) -> true
                isLtrStrong(c) || c.isDigit() -> false
                else -> null
            }
            if (d != null && dir != null && d != dir) {
                out += sb.toString() to dir
                sb.setLength(0)
            }
            if (d != null) dir = d
            sb.append(c)
        }
        if (sb.isNotEmpty()) out += sb.toString() to (dir ?: false)
        return out
    }
}
