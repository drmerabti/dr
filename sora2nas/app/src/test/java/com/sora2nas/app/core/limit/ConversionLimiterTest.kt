package com.sora2nas.app.core.limit

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import java.time.LocalDateTime
import java.time.ZoneId

class ConversionLimiterTest {

    private class MapStore : LimitStore {
        val map = HashMap<String, Any>()
        override fun getLong(key: String, default: Long) = (map[key] as? Long) ?: default
        override fun getInt(key: String, default: Int) = (map[key] as? Int) ?: default
        override fun getString(key: String) = map[key] as? String
        override fun write(values: Map<String, Any>) { map.putAll(values) }
    }

    private val zone = ZoneId.of("Africa/Algiers")
    private fun at(y: Int, m: Int, d: Int, h: Int, min: Int = 0) =
        LocalDateTime.of(y, m, d, h, min).atZone(zone).toInstant().toEpochMilli()

    private var now = at(2026, 10, 3, 9)
    private val store = MapStore()
    private val limiter = ConversionLimiter(store, clock = { now }, zone = { zone })

    @Test
    fun `starts with five free conversions`() {
        assertEquals(5, limiter.remaining())
        assertTrue(limiter.canConvert())
    }

    @Test
    fun `batch of N counts as N`() {
        assertTrue(limiter.consume(3))
        assertEquals(2, limiter.remaining())
        assertFalse(limiter.canConvert(3))
        assertFalse(limiter.consume(3)) // refused, nothing recorded
        assertEquals(2, limiter.remaining())
        assertTrue(limiter.consume(2))
        assertEquals(0, limiter.remaining())
        assertFalse(limiter.canConvert())
    }

    @Test
    fun `resets at local midnight`() {
        repeat(5) { assertTrue(limiter.consume()) }
        now = at(2026, 10, 3, 23, 59)
        assertEquals(0, limiter.remaining())
        now = at(2026, 10, 4, 0, 1)
        assertEquals(5, limiter.remaining())
    }

    @Test
    fun `moving the clock backwards does not give a new day`() {
        repeat(5) { limiter.consume() }
        now = at(2026, 10, 2, 9) // user sets the date to yesterday
        val s = limiter.state()
        assertEquals(0, s.remaining)
        assertTrue(s.clockRollbackDetected)
        // ... and then to "tomorrow" relative to the fake date (still before the real today).
        now = at(2026, 10, 3, 1)
        assertEquals(0, limiter.remaining())
    }

    @Test
    fun `small backwards NTP corrections are tolerated`() {
        limiter.consume()
        now -= 60_000
        assertFalse(limiter.state().clockRollbackDetected)
        assertEquals(4, limiter.remaining())
    }

    @Test
    fun `state survives a new limiter instance`() {
        limiter.consume(2)
        val again = ConversionLimiter(store, clock = { now }, zone = { zone })
        assertEquals(3, again.remaining())
    }

    @Test
    fun `corrupted stored values are handled`() {
        store.map[ConversionLimiter.KEY_DAY] = "garbage"
        store.map[ConversionLimiter.KEY_USED] = -7
        assertEquals(5, limiter.remaining())
    }
}
