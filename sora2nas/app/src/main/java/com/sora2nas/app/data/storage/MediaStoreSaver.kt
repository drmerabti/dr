package com.sora2nas.app.data.storage

import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.media.MediaScannerConnection
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import androidx.core.content.FileProvider
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.io.OutputStream
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Saves outputs where users find them instantly:
 *  - images -> Pictures/sora2nas (visible in the Gallery as an album)
 *  - PDF, DOCX, XLSX, TXT -> Documents/sora2nas
 * Android 10+: MediaStore, no storage permission. Android 7–9: public folders
 * (WRITE_EXTERNAL_STORAGE, maxSdkVersion 28) + media scan.
 */
@Singleton
class MediaStoreSaver @Inject constructor(@ApplicationContext private val context: Context) {

    data class Saved(val uri: Uri, val displayPath: String)

    fun timestampName(prefix: String): String =
        "${prefix}_${SimpleDateFormat("yyyyMMdd_HHmmss", Locale.US).format(Date())}"

    suspend fun saveImage(name: String, write: (OutputStream) -> Unit): Saved =
        save(name, "jpg", "image/jpeg", Environment.DIRECTORY_PICTURES, isImage = true, write)

    suspend fun saveDocument(name: String, extension: String, mime: String, write: (OutputStream) -> Unit): Saved =
        save(name, extension, mime, Environment.DIRECTORY_DOCUMENTS, isImage = false, write)

    private suspend fun save(
        baseName: String,
        ext: String,
        mime: String,
        rootDir: String,
        isImage: Boolean,
        write: (OutputStream) -> Unit,
    ): Saved = withContext(Dispatchers.IO) {
        val fileName = "${sanitize(baseName)}.$ext"
        val relative = "$rootDir/$ALBUM"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val resolver = context.contentResolver
            val collection = if (isImage) MediaStore.Images.Media.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)
            else MediaStore.Files.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)
            val values = ContentValues().apply {
                put(MediaStore.MediaColumns.DISPLAY_NAME, fileName)
                put(MediaStore.MediaColumns.MIME_TYPE, mime)
                put(MediaStore.MediaColumns.RELATIVE_PATH, relative)
                put(MediaStore.MediaColumns.IS_PENDING, 1)
            }
            val uri = resolver.insert(collection, values) ?: error("MediaStore insert failed")
            try {
                resolver.openOutputStream(uri)?.use(write) ?: error("cannot open output")
                values.clear()
                values.put(MediaStore.MediaColumns.IS_PENDING, 0)
                resolver.update(uri, values, null, null)
            } catch (e: Exception) {
                resolver.delete(uri, null, null)
                throw e
            }
            Saved(uri, "$relative/$fileName")
        } else {
            @Suppress("DEPRECATION")
            val dir = File(Environment.getExternalStoragePublicDirectory(rootDir), ALBUM).apply { mkdirs() }
            var file = File(dir, fileName)
            var i = 1
            while (file.exists()) file = File(dir, "${sanitize(baseName)} ($i).$ext").also { i++ }
            file.outputStream().use(write)
            MediaScannerConnection.scanFile(context, arrayOf(file.absolutePath), arrayOf(mime), null)
            // content:// URI (file:// URIs cannot be shared on Android 7+).
            Saved(FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", file), "$relative/${file.name}")
        }
    }

    private fun sanitize(name: String): String =
        name.replace(Regex("""[\\/:*?"<>|\n\r\t]"""), "_").trim().take(80).ifEmpty { "sora2nas" }

    companion object {
        const val ALBUM = "sora2nas"
    }
}

/** Temporary files shared with other apps through the FileProvider (cache/share). */
@Singleton
class ShareFiles @Inject constructor(@ApplicationContext private val context: Context) {

    private val dir get() = File(context.cacheDir, "share").apply { mkdirs() }

    fun newFile(name: String): File = File(dir, name.replace(Regex("""[\\/:*?"<>|]"""), "_"))

    fun uriFor(file: File): Uri = FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", file)

    fun shareIntent(uri: Uri, mime: String): Intent =
        Intent.createChooser(
            Intent(Intent.ACTION_SEND).apply {
                type = mime
                putExtra(Intent.EXTRA_STREAM, uri)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            },
            null,
        ).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

    fun viewIntent(uri: Uri, mime: String): Intent =
        Intent(Intent.ACTION_VIEW).apply {
            setDataAndType(uri, mime)
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_ACTIVITY_NEW_TASK)
        }

    fun shareText(text: String): Intent =
        Intent.createChooser(
            Intent(Intent.ACTION_SEND).apply {
                type = "text/plain"
                putExtra(Intent.EXTRA_TEXT, text)
            },
            null,
        ).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

    /** Removes share files older than a day. */
    fun cleanup() {
        val limit = System.currentTimeMillis() - 24 * 3600 * 1000L
        dir.listFiles()?.filter { it.lastModified() < limit }?.forEach { it.delete() }
    }
}
