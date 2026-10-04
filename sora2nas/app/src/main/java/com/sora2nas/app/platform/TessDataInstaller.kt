package com.sora2nas.app.platform

import android.content.Context
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import java.io.File
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Tesseract reads models from the file system: the bundled tessdata_best
 * models (assets/tessdata) are copied once to internal storage.
 */
@Singleton
class TessDataInstaller @Inject constructor(@ApplicationContext private val context: Context) {

    private val mutex = Mutex()

    /** Parent directory of "tessdata" (what TessBaseAPI.init expects). */
    val dataPath: File get() = File(context.filesDir, "tesseract")

    suspend fun ensureInstalled(): File = mutex.withLock {
        val dir = File(dataPath, "tessdata").apply { mkdirs() }
        val assets = context.assets
        for (name in assets.list("tessdata").orEmpty().filter { it.endsWith(".traineddata") }) {
            val target = File(dir, name)
            val expected = assets.openFd("tessdata/$name").use { it.length }
            if (target.exists() && target.length() == expected) continue
            val tmp = File(dir, "$name.tmp")
            assets.open("tessdata/$name").use { input -> tmp.outputStream().use { input.copyTo(it, 1 shl 16) } }
            tmp.renameTo(target)
        }
        dataPath
    }
}
