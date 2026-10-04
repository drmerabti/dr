package com.sora2nas.app.data

import android.content.Context
import android.net.Uri
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.io.File
import javax.inject.Inject
import javax.inject.Singleton

enum class WorkKind { IMAGE_TEXT, PDF_TEXT, TABLE_IMAGE, TABLE_PDF }

/** A conversion requested by the user, consumed by the processing screen. */
data class WorkRequest(val kind: WorkKind, val uris: List<Uri>)

@Singleton
class WorkQueue @Inject constructor() {
    @Volatile var request: WorkRequest? = null
}

/** Files shared into the app (WhatsApp, Gallery, Files...). */
data class SharedInput(val uris: List<Uri>, val isPdf: Boolean)

/**
 * Receives shared/opened files. They are copied into the app cache right away
 * because the read permission granted by the sending app is temporary.
 */
@Singleton
class IncomingShare @Inject constructor(@ApplicationContext private val context: Context) {

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    private val _input = MutableStateFlow<SharedInput?>(null)
    val input: StateFlow<SharedInput?> = _input.asStateFlow()

    fun receive(uris: List<Uri>, mimeHint: String?) {
        if (uris.isEmpty()) return
        scope.launch {
            val dir = File(context.cacheDir, "incoming").apply { mkdirs() }
            var pdf = mimeHint == "application/pdf"
            val copies = uris.mapIndexedNotNull { i, uri ->
                runCatching {
                    val type = context.contentResolver.getType(uri) ?: mimeHint
                    if (type == "application/pdf") pdf = true
                    val f = File(dir, "in_${System.nanoTime()}_$i" + if (type == "application/pdf") ".pdf" else ".img")
                    context.contentResolver.openInputStream(uri)?.use { input -> f.outputStream().use { input.copyTo(it) } }
                    Uri.fromFile(f)
                }.getOrNull()
            }
            if (copies.isNotEmpty()) _input.value = SharedInput(if (pdf) copies.take(1) else copies, pdf)
        }
    }

    fun consume() { _input.value = null }
}
