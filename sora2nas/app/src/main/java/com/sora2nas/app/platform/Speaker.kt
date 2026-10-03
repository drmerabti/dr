package com.sora2nas.app.platform

import android.content.Context
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.util.Locale
import javax.inject.Inject
import javax.inject.Singleton

/** "Read aloud" with the system TextToSpeech engine. */
@Singleton
class Speaker @Inject constructor(@ApplicationContext private val context: Context) {

    enum class Result { STARTED, LANGUAGE_MISSING, ERROR }

    private var tts: TextToSpeech? = null
    private var ready = false
    private var pending: (() -> Unit)? = null

    private val _speaking = MutableStateFlow(false)
    val speaking: StateFlow<Boolean> = _speaking.asStateFlow()

    private fun ensure(onReady: () -> Unit) {
        if (ready) { onReady(); return }
        pending = onReady
        if (tts == null) {
            tts = TextToSpeech(context) { status ->
                ready = status == TextToSpeech.SUCCESS
                if (ready) {
                    tts?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                        override fun onStart(utteranceId: String?) { _speaking.value = true }
                        override fun onDone(utteranceId: String?) { if (utteranceId == LAST) _speaking.value = false }
                        @Deprecated("Deprecated in Java")
                        override fun onError(utteranceId: String?) { _speaking.value = false }
                    })
                    pending?.invoke()
                }
                pending = null
            }
        }
    }

    /** Speaks [text] in [languageTag] ("ar", "fr", "en"); result is reported via [onResult]. */
    fun speak(text: String, languageTag: String, onResult: (Result) -> Unit) {
        ensure {
            val engine = tts ?: return@ensure onResult(Result.ERROR)
            val locale = Locale.forLanguageTag(languageTag)
            val avail = engine.setLanguage(locale)
            if (avail == TextToSpeech.LANG_MISSING_DATA || avail == TextToSpeech.LANG_NOT_SUPPORTED) {
                onResult(Result.LANGUAGE_MISSING); return@ensure
            }
            engine.stop()
            val max = TextToSpeech.getMaxSpeechInputLength() - 1
            val chunks = chunk(text, max)
            chunks.forEachIndexed { i, c ->
                val id = if (i == chunks.lastIndex) LAST else "c$i"
                engine.speak(c, if (i == 0) TextToSpeech.QUEUE_FLUSH else TextToSpeech.QUEUE_ADD, null, id)
            }
            _speaking.value = true
            onResult(Result.STARTED)
        }
    }

    fun stop() {
        tts?.stop()
        _speaking.value = false
    }

    /** Splits on sentence/paragraph boundaries so every piece fits the engine limit. */
    private fun chunk(text: String, max: Int): List<String> {
        val out = mutableListOf<String>()
        val sb = StringBuilder()
        for (sentence in text.split(Regex("(?<=[.!?؟\\n])"))) {
            if (sb.length + sentence.length > max && sb.isNotEmpty()) { out += sb.toString(); sb.setLength(0) }
            if (sentence.length > max) sentence.chunked(max).forEach { out += it } else sb.append(sentence)
        }
        if (sb.isNotBlank()) out += sb.toString()
        return out
    }

    companion object { private const val LAST = "last" }
}
