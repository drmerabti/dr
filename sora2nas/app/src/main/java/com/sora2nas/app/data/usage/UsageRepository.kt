package com.sora2nas.app.data.usage

import android.content.Context
import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import com.sora2nas.app.billing.BillingRepository
import com.sora2nas.app.core.limit.ConversionLimiter
import com.sora2nas.app.core.limit.LimitStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

/** [LimitStore] on EncryptedSharedPreferences (AES-256, key in the Android Keystore). */
class EncryptedLimitStore(context: Context) : LimitStore {

    private val prefs: SharedPreferences = create(context)

    private fun create(context: Context): SharedPreferences = try {
        val key = MasterKey.Builder(context).setKeyScheme(MasterKey.KeyScheme.AES256_GCM).build()
        EncryptedSharedPreferences.create(
            context,
            FILE,
            key,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM,
        )
    } catch (e: Exception) {
        // Keystore corruption (rare, some devices after restore): start a fresh encrypted file.
        context.deleteSharedPreferences(FILE)
        val key = MasterKey.Builder(context).setKeyScheme(MasterKey.KeyScheme.AES256_GCM).build()
        EncryptedSharedPreferences.create(
            context, FILE, key,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM,
        )
    }

    override fun getLong(key: String, default: Long) = prefs.getLong(key, default)
    override fun getInt(key: String, default: Int) = prefs.getInt(key, default)
    override fun getString(key: String): String? = prefs.getString(key, null)
    override fun write(values: Map<String, Any>) {
        val e = prefs.edit()
        for ((k, v) in values) when (v) {
            is Int -> e.putInt(k, v)
            is Long -> e.putLong(k, v)
            is String -> e.putString(k, v)
            is Boolean -> e.putBoolean(k, v)
        }
        e.commit()
    }

    fun getBoolean(key: String, default: Boolean) = prefs.getBoolean(key, default)

    companion object {
        const val FILE = "usage_secure"
    }
}

/**
 * Free-tier quota as seen by the UI: remaining conversions today, or
 * unlimited when the user has an active Pro subscription.
 */
@Singleton
class UsageRepository @Inject constructor(
    @ApplicationContext context: Context,
    private val billing: BillingRepository,
) {
    private val store = EncryptedLimitStore(context)
    private val limiter = ConversionLimiter(store)

    private val _remaining = MutableStateFlow(limiter.remaining())
    /** Remaining free conversions today (meaningless when Pro). */
    val remaining: StateFlow<Int> = _remaining.asStateFlow()

    val dailyLimit: Int get() = limiter.dailyLimit

    val isPro: StateFlow<Boolean> get() = billing.isPro

    /** Call when the screen becomes visible (the day may have changed). */
    fun refresh() { _remaining.value = limiter.remaining() }

    /** True when [count] conversions can start now. */
    fun canConvert(count: Int = 1): Boolean = billing.isPro.value || limiter.canConvert(count)

    /**
     * Records one completed conversion. Returns false when the free quota is
     * exhausted (the caller then shows the paywall).
     */
    fun recordConversion(): Boolean {
        if (billing.isPro.value) return true
        val ok = limiter.consume(1)
        refresh()
        return ok
    }
}
