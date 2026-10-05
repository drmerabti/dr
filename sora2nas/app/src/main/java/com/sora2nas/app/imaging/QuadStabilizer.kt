package com.sora2nas.app.imaging

import kotlin.math.hypot

/**
 * Turns noisy per-frame document detections into a calm live outline:
 * - small frame-to-frame jitter is smoothed (exponential moving average),
 * - a single wrong detection is ignored; the outline only jumps to a new
 *   position after it has been seen on [confirmFrames] consecutive frames,
 * - a few missed frames do not make the outline flicker away ([holdMs]).
 * Coordinates are normalised (0..1). Pure Kotlin, not thread-safe: call it
 * from the camera analysis thread only.
 */
class QuadStabilizer(
    private val holdMs: Long = 700,
    private val jumpThreshold: Double = 0.07,
    private val confirmFrames: Int = 2,
) {
    private var current: Quad? = null
    private var lastSeen = 0L
    private var candidate: Quad? = null
    private var candidateCount = 0
    private var steadyFrames = 0

    /** True when the outline has barely moved for several frames (good moment to shoot). */
    val isSteady: Boolean get() = current != null && steadyFrames >= STEADY_FRAMES

    fun reset() {
        current = null; candidate = null; candidateCount = 0; steadyFrames = 0
    }

    /** Feeds one frame's detection ([detected] may be null); returns the outline to draw. */
    fun update(detected: Quad?, nowMs: Long): Quad? {
        val cur = current
        if (detected == null) {
            if (cur != null && nowMs - lastSeen <= holdMs) return cur
            reset()
            return null
        }
        if (cur == null) {
            if (confirm(detected)) { current = detected; lastSeen = nowMs; steadyFrames = 0 }
            return current
        }
        val d = distance(cur, detected)
        if (d < jumpThreshold) {
            candidate = null; candidateCount = 0
            // Calm small jitter strongly, follow real movement quickly.
            val alpha = if (d < 0.012) 0.3 else 0.65
            current = lerp(cur, detected, alpha)
            lastSeen = nowMs
            steadyFrames = if (d < STEADY_DISTANCE) steadyFrames + 1 else 0
        } else if (confirm(detected)) {
            current = detected
            lastSeen = nowMs
            steadyFrames = 0
        }
        return current
    }

    private fun confirm(q: Quad): Boolean {
        val c = candidate
        if (c != null && distance(c, q) < jumpThreshold) candidateCount++ else { candidate = q; candidateCount = 1 }
        if (candidateCount >= confirmFrames) { candidate = null; candidateCount = 0; return true }
        return false
    }

    companion object {
        private const val STEADY_FRAMES = 4
        private const val STEADY_DISTANCE = 0.01

        /** Mean corner distance. */
        fun distance(a: Quad, b: Quad): Double =
            a.points.zip(b.points).sumOf { (p, q) -> hypot(p.x - q.x, p.y - q.y) } / 4

        fun lerp(a: Quad, b: Quad, t: Double): Quad {
            val p = a.points.zip(b.points).map { (u, v) -> Pt(u.x + (v.x - u.x) * t, u.y + (v.y - u.y) * t) }
            return Quad(p[0], p[1], p[2], p[3])
        }
    }
}
