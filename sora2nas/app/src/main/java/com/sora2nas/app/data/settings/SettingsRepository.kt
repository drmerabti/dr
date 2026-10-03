package com.sora2nas.app.data.settings

import android.content.Context
import androidx.appcompat.app.AppCompatDelegate
import androidx.core.os.LocaleListCompat
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

/** Scan resolution. Max keeps the full camera resolution (default). */
enum class ScanQuality(val maxSide: Int, val jpegQuality: Int) {
    NORMAL(1600, 75),
    HIGH(2800, 85),
    MAX(4200, 92),
}

enum class TextExportFormat { DOCX, TXT }
enum class TableExportFormat { XLSX, DOCX }

data class AppSettings(
    val language: String = SettingsRepository.LANG_AR,
    val scanQuality: ScanQuality = ScanQuality.MAX,
    val textExport: TextExportFormat = TextExportFormat.DOCX,
    val tableExport: TableExportFormat = TableExportFormat.XLSX,
)

private val Context.dataStore by preferencesDataStore(name = "settings")

@Singleton
class SettingsRepository @Inject constructor(@ApplicationContext private val context: Context) {

    private val kQuality = stringPreferencesKey("scan_quality")
    private val kTextExport = stringPreferencesKey("text_export")
    private val kTableExport = stringPreferencesKey("table_export")

    /** The language lives in plain SharedPreferences: it is needed synchronously at start-up. */
    private val langPrefs = context.getSharedPreferences("app_lang", Context.MODE_PRIVATE)

    val settings: Flow<AppSettings> = context.dataStore.data.map { p ->
        AppSettings(
            language = appLanguageBlocking(),
            scanQuality = p[kQuality]?.let { runCatching { ScanQuality.valueOf(it) }.getOrNull() } ?: ScanQuality.MAX,
            textExport = p[kTextExport]?.let { runCatching { TextExportFormat.valueOf(it) }.getOrNull() } ?: TextExportFormat.DOCX,
            tableExport = p[kTableExport]?.let { runCatching { TableExportFormat.valueOf(it) }.getOrNull() } ?: TableExportFormat.XLSX,
        )
    }

    fun appLanguageBlocking(): String = langPrefs.getString(KEY_LANG, LANG_AR) ?: LANG_AR

    /** Saves and applies the UI language (the activity is recreated by AppCompat). */
    fun setAppLanguage(tag: String) {
        langPrefs.edit().putString(KEY_LANG, tag).apply()
        AppCompatDelegate.setApplicationLocales(LocaleListCompat.forLanguageTags(tag))
    }

    suspend fun setScanQuality(q: ScanQuality) = context.dataStore.edit { it[kQuality] = q.name }
    suspend fun setTextExport(f: TextExportFormat) = context.dataStore.edit { it[kTextExport] = f.name }
    suspend fun setTableExport(f: TableExportFormat) = context.dataStore.edit { it[kTableExport] = f.name }

    companion object {
        const val LANG_AR = "ar"
        const val LANG_FR = "fr"
        private const val KEY_LANG = "lang"
    }
}
