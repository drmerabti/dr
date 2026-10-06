package com.sora2nas.app.core.text

/** Languages supported by the bundled OCR models. [tessCode] is the traineddata name. */
enum class OcrLanguage(val tessCode: String, val bcp47: String) {
    ARABIC("ara", "ar"),
    FRENCH("fra", "fr"),
    ENGLISH("eng", "en");

    val isRtl: Boolean get() = this == ARABIC
}

data class DetectedLanguages(val primary: OcrLanguage, val all: List<OcrLanguage>) {
    /** Tesseract language string, primary first, e.g. "ara+fra". */
    val tessCode: String get() = all.joinToString("+") { it.tessCode }
}

/**
 * Automatic language detection, fully offline.
 *
 * Step 1 – script: share of Arabic letters vs Latin letters.
 * Step 2 – for Latin text, French vs English by stop-word frequency and
 *          French accented letters.
 * Mixed documents (common in Algeria/Maghreb: Arabic + French) return both.
 */
object LanguageDetector {

    private val FRENCH_WORDS = setOf(
        "le", "la", "les", "des", "du", "de", "et", "est", "une", "un", "pour", "dans", "que", "qui",
        "sur", "pas", "avec", "au", "aux", "ce", "cette", "sont", "par", "plus", "ou", "en", "il",
        "elle", "nous", "vous", "ils", "leur", "mais", "son", "sa", "ses", "été", "être", "à",
    )
    private val ENGLISH_WORDS = setOf(
        "the", "and", "of", "to", "is", "in", "that", "for", "with", "on", "are", "this", "be", "as",
        "by", "it", "from", "was", "were", "or", "an", "at", "which", "have", "has", "not", "will",
        "can", "you", "your", "we", "our", "they", "their", "all", "been", "would", "there",
    )
    private val LATIN_WORD = Regex("""[A-Za-zÀ-ɏ]{2,}""")
    private const val FRENCH_ACCENTS = "éèêëàâçùûôîïœÉÈÊÀÂÇÙÛÔÎ"

    fun isArabicLetter(c: Char): Boolean =
        c in 'ؠ'..'ي' || c in 'ٱ'..'ۓ' || c in 'ݐ'..'ݿ' ||
            c in 'ﭐ'..'﷿' || c in 'ﹰ'..'ﻼ'

    private fun isLatinLetter(c: Char): Boolean = c in 'a'..'z' || c in 'A'..'Z' || c in 'À'..'ɏ'

    fun detect(text: String, fallback: OcrLanguage = OcrLanguage.ARABIC): DetectedLanguages {
        var arabic = 0
        var latin = 0
        for (c in text) {
            if (isArabicLetter(c)) arabic++ else if (isLatinLetter(c)) latin++
        }
        val letters = arabic + latin
        if (letters < 8) {
            // Too little text to decide: use the broadest useful set.
            return DetectedLanguages(fallback, listOf(fallback) + OcrLanguage.entries.filter { it != fallback })
        }
        val latinLang = latinLanguage(text)
        val arabicShare = arabic.toDouble() / letters
        return when {
            // Arabic text with a few Latin words (Windows, PDF, ABB...): the Latin
            // model is still needed or those words come out as garbage.
            arabicShare >= 0.85 && !LATIN_WORD.containsMatchIn(text) -> DetectedLanguages(OcrLanguage.ARABIC, listOf(OcrLanguage.ARABIC))
            arabicShare >= 0.5 -> DetectedLanguages(OcrLanguage.ARABIC, listOf(OcrLanguage.ARABIC, latinLang))
            arabicShare >= 0.08 -> DetectedLanguages(latinLang, listOf(latinLang, OcrLanguage.ARABIC))
            else -> DetectedLanguages(latinLang, listOf(latinLang))
        }
    }

    /** French or English, from stop words + accented letters. Defaults to French on ties. */
    fun latinLanguage(text: String): OcrLanguage {
        val words = text.lowercase().split(Regex("""[^\p{L}']+""")).filter { it.isNotEmpty() }
            .flatMap { it.split('\'') } // l'eau -> l, eau
        var fr = 0.0
        var en = 0.0
        for (w in words) {
            if (w in FRENCH_WORDS) fr += 1.0
            if (w in ENGLISH_WORDS) en += 1.0
        }
        fr += text.count { it in FRENCH_ACCENTS } * 0.5
        return if (en > fr * 1.2) OcrLanguage.ENGLISH else OcrLanguage.FRENCH
    }
}
