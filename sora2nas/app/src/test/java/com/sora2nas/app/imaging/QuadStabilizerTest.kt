package com.sora2nas.app.imaging

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class QuadStabilizerTest {
    private fun quad(dx: Double = 0.0, dy: Double = 0.0) =
        Quad(Pt(0.2 + dx, 0.2 + dy), Pt(0.8 + dx, 0.2 + dy), Pt(0.8 + dx, 0.85 + dy), Pt(0.2 + dx, 0.85 + dy))

    @Test fun `needs two frames before showing an outline`() {
        val s = QuadStabilizer()
        assertNull(s.update(quad(), 0))
        assertNotNull(s.update(quad(0.003), 100))
    }

    @Test fun `jitter is smoothed`() {
        val s = QuadStabilizer()
        s.update(quad(), 0); s.update(quad(), 100)
        val out = s.update(quad(0.01), 200)!!
        // Moves only part of the way towards a jittery detection.
        assertTrue(out.tl.x > 0.2 && out.tl.x < 0.21)
    }

    @Test fun `single outlier is ignored`() {
        val s = QuadStabilizer()
        s.update(quad(), 0); s.update(quad(), 100)
        val out = s.update(quad(0.3, 0.1), 200)!!
        assertEquals(0.2, out.tl.x, 1e-6)
        // ...but a persistent new position is adopted.
        val moved = s.update(quad(0.3, 0.1), 300)!!
        assertEquals(0.5, moved.tl.x, 1e-6)
    }

    @Test fun `short dropouts keep the outline, long ones clear it`() {
        val s = QuadStabilizer(holdMs = 500)
        s.update(quad(), 0); s.update(quad(), 100)
        assertNotNull(s.update(null, 400))
        assertNull(s.update(null, 700))
    }

    @Test fun `steady after several still frames`() {
        val s = QuadStabilizer()
        var t = 0L
        repeat(3) { s.update(quad(), t); t += 100 }
        assertFalse(s.isSteady)
        repeat(4) { s.update(quad(), t); t += 100 }
        assertTrue(s.isSteady)
    }
}
