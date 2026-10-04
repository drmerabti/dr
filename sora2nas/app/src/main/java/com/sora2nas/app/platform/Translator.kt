package com.sora2nas.app.platform

import com.google.mlkit.common.model.DownloadConditions
import com.google.mlkit.nl.translate.TranslateLanguage
import com.google.mlkit.nl.translate.Translation
import com.google.mlkit.nl.translate.TranslatorOptions
import com.sora2nas.app.core.text.OcrLanguage
import kotlinx.coroutines.tasks.await
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Offline translation (ML Kit on-device). Each language model (~30 MB) is
 * downloaded once over the internet, then translation works offline.
 */
@Singleton
class OfflineTranslator @Inject constructor() {

    private fun code(lang: OcrLanguage) = when (lang) {
        OcrLanguage.ARABIC -> TranslateLanguage.ARABIC
        OcrLanguage.FRENCH -> TranslateLanguage.FRENCH
        OcrLanguage.ENGLISH -> TranslateLanguage.ENGLISH
    }

    /**
     * Translates paragraph by paragraph (keeps the layout and stays under ML
     * Kit's input size limits). [onModelDownload] is called before a
     * potentially long first-time download.
     */
    suspend fun translate(text: String, from: OcrLanguage, to: OcrLanguage, onModelDownload: () -> Unit = {}): String {
        if (from == to) return text
        val options = TranslatorOptions.Builder()
            .setSourceLanguage(code(from))
            .setTargetLanguage(code(to))
            .build()
        val translator = Translation.getClient(options)
        try {
            onModelDownload()
            translator.downloadModelIfNeeded(DownloadConditions.Builder().build()).await()
            val out = StringBuilder()
            for ((i, para) in text.split("\n").withIndex()) {
                if (i > 0) out.append('\n')
                if (para.isBlank()) continue
                out.append(translator.translate(para).await())
            }
            return out.toString()
        } finally {
            translator.close()
        }
    }
}
