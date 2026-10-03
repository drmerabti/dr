package com.sora2nas.app.core.export

import java.io.OutputStream
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

/** Shared helpers for the tiny Office Open XML (xlsx/docx) writers. */
internal object OoxmlUtil {

    const val XML_HEADER = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>"""

    /** Escapes XML special characters and drops characters that are illegal in XML 1.0. */
    fun esc(s: String): String {
        val sb = StringBuilder(s.length + 16)
        for (ch in s) {
            when {
                ch == '&' -> sb.append("&amp;")
                ch == '<' -> sb.append("&lt;")
                ch == '>' -> sb.append("&gt;")
                ch == '"' -> sb.append("&quot;")
                ch == '\t' || ch == '\n' || ch == '\r' -> sb.append(ch)
                ch.code < 0x20 || ch == '￾' || ch == '￿' -> Unit
                else -> sb.append(ch)
            }
        }
        return sb.toString()
    }

    fun zip(out: OutputStream, entries: List<Pair<String, String>>) {
        ZipOutputStream(out).use { zos ->
            for ((name, content) in entries) {
                zos.putNextEntry(ZipEntry(name))
                zos.write(content.toByteArray(Charsets.UTF_8))
                zos.closeEntry()
            }
        }
    }

    fun hasArabic(s: String): Boolean = s.any { it in '؀'..'ۿ' || it in 'ݐ'..'ݿ' }

    /** True when the first strong character is right-to-left. */
    fun startsRtl(s: String): Boolean {
        for (c in s) {
            if (c in '֐'..'ࣿ' || c in 'יִ'..'ﻼ') return true
            if (c.isLetter()) return false
        }
        return false
    }
}
