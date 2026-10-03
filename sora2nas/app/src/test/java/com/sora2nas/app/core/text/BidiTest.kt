package com.sora2nas.app.core.text

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class BidiTest {

    @Test
    fun `arabic line starting with a latin word gets a right-to-left mark`() {
        val line = "PDF هو صيغة لحفظ المستندات"
        assertEquals(Bidi.RLM + line, Bidi.markLines(line))
    }

    @Test
    fun `french line starting with an arabic word gets a left-to-right mark`() {
        val line = "الجزائر est un pays d'Afrique du Nord"
        assertEquals(Bidi.LRM + line, Bidi.markLines(line))
    }

    @Test
    fun `lines whose first letter already gives the right direction are untouched`() {
        val text = "يعمل نظام Windows 11 على الحاسوب\nRapport annuel 2026\n\n12345"
        assertEquals(text, Bidi.markLines(text))
    }

    @Test
    fun `marking is idempotent and reversible`() {
        val text = "PDF هو صيغة لحفظ المستندات\nWord و Excel برنامجان"
        val once = Bidi.markLines(text)
        assertEquals(once, Bidi.markLines(once))
        assertEquals(text, Bidi.stripMarks(once))
    }

    @Test
    fun `direction follows the majority of letters`() {
        assertTrue(Bidi.isRtl("Excel برنامج جداول ممتاز"))
        assertFalse(Bidi.isRtl("Le mot كتاب veut dire livre"))
        assertFalse(Bidi.isRtl("2026 - 12"))
    }

    @Test
    fun `runs split arabic from latin and numbers`() {
        val runs = Bidi.runs("نظام Windows 11 جديد")
        assertEquals(listOf(true, false, true), runs.map { it.second })
        assertEquals("نظام Windows 11 جديد", runs.joinToString("") { it.first })
    }

    @Test
    fun `cleaned OCR text keeps mixed lines right to left`() {
        val out = TextCleaner.clean("PDF هو صيغة لحفظ المستندات.\nوهي تعمل على Android و iOS.")
        assertTrue(out, out.startsWith(Bidi.RLM + "PDF"))
    }

    @Test
    fun `numbers go back after the latin word in arabic OCR lines`() {
        assertEquals("يعمل نظام Windows 11 على الحاسوب", Bidi.fixOcrNumberOrder("يعمل نظام 11 \u200EWindows\u200F على الحاسوب"))
        assertEquals("نستعمل برنامج Microsoft Word 2016 لكتابة التقارير", Bidi.fixOcrNumberOrder("نستعمل برنامج 2016 Microsoft Word لكتابة التقارير"))
    }

    @Test
    fun `units, plain numbers and latin lines are left alone`() {
        val text = "تم تركيب محرك بقدرة 250 kW في الفرن رقم 2\nمنذ سنة 2024\nWindows 11 runs on 2 PCs"
        assertEquals(text, Bidi.fixOcrNumberOrder(text))
    }
}
