package com.sora2nas.app.core.text

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class TextCleanerTest {

    @Test
    fun `joins lines broken by the layout and keeps paragraphs`() {
        val raw = "Le rapport annuel de l'usine montre une\nhausse de la production de ciment\ncette année.\n\nDeuxième paragraphe   ici."
        val out = TextCleaner.clean(raw)
        assertEquals(
            "Le rapport annuel de l'usine montre une hausse de la production de ciment cette année.\n\nDeuxième paragraphe ici.",
            out,
        )
    }

    @Test
    fun `removes extra spaces and invisible characters`() {
        assertEquals("Hello world, test.", TextCleaner.clean("  Hello​   world ,  test .  "))
    }

    @Test
    fun `rejoins hyphenated latin words`() {
        assertEquals("the information system works well and fast", TextCleaner.clean("the infor-\nmation system works well and fast"))
    }

    @Test
    fun `keeps list items on their own lines`() {
        val out = TextCleaner.clean("Liste des tâches à faire aujourd'hui:\n- maintenance du four\n- contrôle qualité\n1) rapport")
        assertEquals(4, out.lines().size)
    }

    @Test
    fun `arabic presentation forms are folded to base letters`() {
        // "سلام" written with presentation forms
        val presentation = "ﺳﻼﻡ"
        val out = TextCleaner.clean(presentation)
        assertFalse(out.any { it in 'ﹰ'..'﻿' })
        assertTrue(out.contains('س'))
    }

    @Test
    fun `joins arabic lines`() {
        val raw = "تقوم الوحدة بإنتاج الإسمنت وفق المعايير\nالدولية المعتمدة في الجزائر.\n\nفقرة ثانية."
        assertEquals("تقوم الوحدة بإنتاج الإسمنت وفق المعايير الدولية المعتمدة في الجزائر.\n\nفقرة ثانية.", TextCleaner.clean(raw))
    }

    @Test
    fun `drops pure noise lines`() {
        assertEquals("Texte utile.", TextCleaner.clean("|\nTexte utile.\n_ _"))
    }

    @Test
    fun `blank input gives empty output`() {
        assertEquals("", TextCleaner.clean("  \n \n"))
    }
}
