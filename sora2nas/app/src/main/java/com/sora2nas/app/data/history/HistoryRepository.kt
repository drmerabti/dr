package com.sora2nas.app.data.history

import android.content.Context
import android.graphics.Bitmap
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.withContext
import java.io.File
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class HistoryRepository @Inject constructor(
    @ApplicationContext private val context: Context,
    private val dao: HistoryDao,
) {
    private val thumbDir = File(context.filesDir, "thumbs").apply { mkdirs() }

    fun recent(limit: Int = 5): Flow<List<HistoryEntity>> = dao.recent(limit)

    /** All items, or full-text search results when [query] is not blank. */
    fun search(query: String): Flow<List<HistoryEntity>> {
        val match = toFtsQuery(query)
        return if (match == null) dao.all() else dao.search(match)
    }

    fun observe(id: Long): Flow<HistoryEntity?> = dao.observe(id)
    suspend fun get(id: Long): HistoryEntity? = dao.get(id)

    suspend fun add(item: HistoryEntity, thumbnail: Bitmap?): Long = withContext(Dispatchers.IO) {
        val path = thumbnail?.let { saveThumb(it) }
        dao.insert(item.copy(thumbnailPath = path ?: item.thumbnailPath))
    }

    suspend fun rename(id: Long, title: String) = dao.rename(id, title.trim())
    suspend fun updateText(id: Long, text: String) = dao.updateText(id, text)

    suspend fun delete(item: HistoryEntity) = withContext(Dispatchers.IO) {
        item.thumbnailPath?.let { File(it).delete() }
        dao.delete(item.id)
    }

    private fun saveThumb(bmp: Bitmap): String {
        val scale = THUMB_SIZE.toFloat() / maxOf(bmp.width, bmp.height)
        val small = if (scale < 1f) Bitmap.createScaledBitmap(bmp, (bmp.width * scale).toInt().coerceAtLeast(1), (bmp.height * scale).toInt().coerceAtLeast(1), true) else bmp
        val f = File(thumbDir, "t_${System.currentTimeMillis()}_${(0..9999).random()}.jpg")
        f.outputStream().use { small.compress(Bitmap.CompressFormat.JPEG, 80, it) }
        if (small !== bmp) small.recycle()
        return f.absolutePath
    }

    companion object {
        private const val THUMB_SIZE = 320

        /**
         * User text -> FTS MATCH expression: every word must match as a prefix,
         * quotes and operators are neutralised. Returns null for a blank query.
         */
        fun toFtsQuery(raw: String): String? {
            val words = raw.split(Regex("""[\s\p{Punct}]+""")).map { it.replace("\"", "") }.filter { it.isNotBlank() }
            if (words.isEmpty()) return null
            return words.joinToString(" ") { "\"$it\"*" }
        }
    }
}
