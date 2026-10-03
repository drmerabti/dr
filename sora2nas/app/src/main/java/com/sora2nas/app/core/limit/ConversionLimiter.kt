package com.sora2nas.app.core.limit

import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId

/**
 * Minimal key/value persistence used by [ConversionLimiter].
 * On Android it is backed by EncryptedSharedPreferences; in tests by a map.
 */
interface LimitStore {
    fun getLong(key: String, default: Long): Long
    fun getInt(key: String, default: Int): Int
    fun getString(key: String): String?
    /** Writes all values atomically. */
    fun write(values: Map<String, Any>)
}

/**
 * Free-tier daily conversion counter.
 *
 * Rules (product spec):
 *  - [dailyLimit] conversions per local calendar day (default 5).
 *  - A conversion is one *completed* operation; a batch of N images counts N.
 *  - Resets at local midnight.
 *  - Basic protection against moving the device clock backwards: the limiter
 *    remembers the latest wall-clock time it has ever seen and never lets the
 *    "current day" go back before it. Setting the clock back therefore cannot
 *    produce a new day. (Without a server, moving the clock *forward* cannot be
 *    detected reliably; it only ever yields one extra day once.)
 *
 * The class is pure Kotlin so it can be unit-tested on the JVM.
 */
class ConversionLimiter(
    private val store: LimitStore,
    private val clock: () -> Long = { System.currentTimeMillis() },
    private val zone: () -> ZoneId = { ZoneId.systemDefault() },
    val dailyLimit: Int = DEFAULT_DAILY_LIMIT,
) {

    data class State(val day: LocalDate, val used: Int, val remaining: Int, val clockRollbackDetected: Boolean)

    @Synchronized
    fun state(): State = refresh()

    /** Remaining free conversions for today (never negative). */
    @Synchronized
    fun remaining(): Int = refresh().remaining

    @Synchronized
    fun canConvert(count: Int = 1): Boolean = refresh().remaining >= count

    /**
     * Records [count] completed conversions. Returns false (and records nothing)
     * when not enough free conversions remain.
     */
    @Synchronized
    fun consume(count: Int = 1): Boolean {
        require(count > 0) { "count must be > 0" }
        val s = refresh()
        if (s.remaining < count) return false
        store.write(mapOf(KEY_USED to s.used + count))
        return true
    }

    /** Reads the stored state, rolling over to a new day when needed. */
    private fun refresh(): State {
        val now = clock()
        val lastSeen = store.getLong(KEY_LAST_SEEN, 0L)
        // A backwards jump bigger than the tolerance is treated as tampering:
        // we keep counting on the latest time we have seen.
        val rollback = lastSeen > 0 && now < lastSeen - ROLLBACK_TOLERANCE_MS
        val effectiveNow = maxOf(now, lastSeen)
        val today = Instant.ofEpochMilli(effectiveNow).atZone(zone()).toLocalDate()

        val storedDay = store.getString(KEY_DAY)?.let { runCatching { LocalDate.parse(it) }.getOrNull() }
        var used = store.getInt(KEY_USED, 0).coerceAtLeast(0)
        val updates = HashMap<String, Any>()
        if (storedDay == null || today.isAfter(storedDay)) {
            used = 0
            updates[KEY_DAY] = today.toString()
            updates[KEY_USED] = 0
        } else if (today.isBefore(storedDay)) {
            // Time-zone change pushed us "back" a day: keep the stored day and its count.
        }
        if (now > lastSeen) updates[KEY_LAST_SEEN] = now
        if (updates.isNotEmpty()) store.write(updates)
        val day = if (storedDay != null && today.isBefore(storedDay)) storedDay else today
        return State(day, used, (dailyLimit - used).coerceAtLeast(0), rollback)
    }

    companion object {
        const val DEFAULT_DAILY_LIMIT = 5
        const val KEY_DAY = "limit_day"
        const val KEY_USED = "limit_used"
        const val KEY_LAST_SEEN = "limit_last_seen"
        /** Small backwards corrections (NTP sync) are tolerated. */
        const val ROLLBACK_TOLERANCE_MS = 10 * 60 * 1000L
    }
}
