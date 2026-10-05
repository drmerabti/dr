package com.sora2nas.app.data.history

import androidx.room.ColumnInfo
import androidx.room.Dao
import androidx.room.Database
import androidx.room.Entity
import androidx.room.Fts4
import androidx.room.FtsOptions
import androidx.room.Insert
import androidx.room.PrimaryKey
import androidx.room.Query
import androidx.room.RoomDatabase
import androidx.room.Update
import kotlinx.coroutines.flow.Flow

enum class HistoryType { SCAN, IMAGE_TEXT, PDF_TEXT, TABLE }

/**
 * One saved scan or conversion.
 * - [text]: OCR text (IMAGE_TEXT / PDF_TEXT), or the table(s) as TSV (TABLE,
 *   tables separated by a form feed), or null for scans.
 * - [fileUri]: the saved output (PDF / image) in MediaStore, when any.
 */
@Entity(tableName = "history")
data class HistoryEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val type: HistoryType,
    val title: String,
    val text: String? = null,
    @ColumnInfo(name = "created_at") val createdAt: Long = System.currentTimeMillis(),
    @ColumnInfo(name = "thumbnail_path") val thumbnailPath: String? = null,
    @ColumnInfo(name = "file_uri") val fileUri: String? = null,
    @ColumnInfo(name = "page_count") val pageCount: Int = 1,
    /** Detected language (bcp47) for text, or "rtl" for right-to-left tables. */
    val lang: String? = null,
)

/** Full-text index over title + text (unicode61 tokenizer handles Arabic and accents). */
@Fts4(contentEntity = HistoryEntity::class, tokenizer = FtsOptions.TOKENIZER_UNICODE61)
@Entity(tableName = "history_fts")
data class HistoryFts(
    val title: String,
    val text: String?,
)

@Dao
interface HistoryDao {
    @Insert
    suspend fun insert(item: HistoryEntity): Long

    @Update
    suspend fun update(item: HistoryEntity)

    @Query("DELETE FROM history WHERE id = :id")
    suspend fun delete(id: Long)

    @Query("SELECT * FROM history WHERE id = :id")
    suspend fun get(id: Long): HistoryEntity?

    @Query("SELECT * FROM history WHERE id = :id")
    fun observe(id: Long): Flow<HistoryEntity?>

    @Query("SELECT * FROM history ORDER BY created_at DESC LIMIT :limit")
    fun recent(limit: Int): Flow<List<HistoryEntity>>

    @Query("SELECT * FROM history ORDER BY created_at DESC")
    fun all(): Flow<List<HistoryEntity>>

    @Query(
        """SELECT history.* FROM history JOIN history_fts ON history.id = history_fts.rowid
           WHERE history_fts MATCH :query ORDER BY history.created_at DESC""",
    )
    fun search(query: String): Flow<List<HistoryEntity>>

    @Query("UPDATE history SET title = :title WHERE id = :id")
    suspend fun rename(id: Long, title: String)

    @Query("UPDATE history SET text = :text WHERE id = :id")
    suspend fun updateText(id: Long, text: String)
}

@Database(entities = [HistoryEntity::class, HistoryFts::class], version = 1, exportSchema = true)
abstract class AppDatabase : RoomDatabase() {
    abstract fun historyDao(): HistoryDao
}
