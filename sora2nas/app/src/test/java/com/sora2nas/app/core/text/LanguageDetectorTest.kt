package com.sora2nas.app.core.text

import org.junit.Assert.assertEquals
import org.junit.Test

class LanguageDetectorTest {

    @Test
    fun arabic() {
        val d = LanguageDetector.detect("تقوم الوحدة بإنتاج الإسمنت وفق المعايير الدولية المعتمدة")
        assertEquals(OcrLanguage.ARABIC, d.primary)
        assertEquals("ara", d.tessCode)
    }

    @Test
    fun french() {
        val d = LanguageDetector.detect("Le rapport de la maintenance est prêt pour la réunion de demain avec les équipes.")
        assertEquals(listOf(OcrLanguage.FRENCH), d.all)
    }

    @Test
    fun english() {
        val d = LanguageDetector.detect("The maintenance report is ready for the meeting with the team and it will be shared.")
        assertEquals(listOf(OcrLanguage.ENGLISH), d.all)
    }

    @Test
    fun `mixed arabic and french`() {
        val d = LanguageDetector.detect("الجمهورية الجزائرية الديمقراطية الشعبية وزارة الصناعة République algérienne")
        assertEquals(OcrLanguage.ARABIC, d.primary)
        assertEquals("ara+fra", d.tessCode)
    }

    @Test
    fun `mostly french with some arabic`() {
        val d = LanguageDetector.detect("Facture numéro 125 pour la société de ciment du client, montant total des travaux: الشركة")
        assertEquals(OcrLanguage.FRENCH, d.primary)
        assertEquals("fra+ara", d.tessCode)
    }

    @Test
    fun `too little text falls back to all models`() {
        assertEquals("ara+fra+eng", LanguageDetector.detect("12 ab").tessCode)
    }
}
