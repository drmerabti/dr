package com.sora2nas.app.ui.scanner

import android.os.SystemClock
import androidx.annotation.OptIn
import androidx.camera.core.ExperimentalGetImage
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.common.InputImage
import com.sora2nas.app.imaging.DocumentDetector
import com.sora2nas.app.imaging.MatUtils
import com.sora2nas.app.imaging.Quad
import com.sora2nas.app.imaging.QuadStabilizer
import org.opencv.core.CvType
import org.opencv.core.Mat

/**
 * Live edge detection on camera frames (luminance plane only, ~10 fps).
 * Detections go through a [QuadStabilizer] so the outline glides instead of
 * jumping or flickering. Reports corners normalised to 0..1 of the upright
 * frame, plus whether the outline is steady.
 */
class DocumentAnalyzer(private val onQuad: (Quad?, Boolean) -> Unit) : ImageAnalysis.Analyzer {
    private var last = 0L
    private val stabilizer = QuadStabilizer()

    override fun analyze(image: ImageProxy) {
        try {
            val now = SystemClock.elapsedRealtime()
            if (now - last < 90) return
            last = now
            val gray = yPlaneToMat(image)
            val upright = MatUtils.rotate90(gray, image.imageInfo.rotationDegrees)
            gray.release()
            val quad = DocumentDetector.detect(upright)
            val w = upright.cols().toDouble()
            val h = upright.rows().toDouble()
            upright.release()
            val shown = stabilizer.update(quad?.scaled(1.0 / w, 1.0 / h), now)
            onQuad(shown, stabilizer.isSteady)
        } catch (_: Throwable) {
            onQuad(null, false)
        } finally {
            image.close()
        }
    }

    private fun yPlaneToMat(image: ImageProxy): Mat {
        val plane = image.planes[0]
        val buffer = plane.buffer
        val w = image.width
        val h = image.height
        val rowStride = plane.rowStride
        val mat = Mat(h, w, CvType.CV_8UC1)
        val row = ByteArray(w)
        for (y in 0 until h) {
            buffer.position(y * rowStride)
            buffer.get(row, 0, w)
            mat.put(y, 0, row)
        }
        return mat
    }
}

/** QR code / barcode reader (ML Kit, on-device). */
class BarcodeAnalyzer(private val onValue: (String) -> Unit) : ImageAnalysis.Analyzer {
    private val scanner = BarcodeScanning.getClient()

    @OptIn(ExperimentalGetImage::class)
    override fun analyze(image: ImageProxy) {
        val media = image.image
        if (media == null) { image.close(); return }
        val input = InputImage.fromMediaImage(media, image.imageInfo.rotationDegrees)
        scanner.process(input)
            .addOnSuccessListener { codes ->
                codes.firstOrNull { !it.rawValue.isNullOrEmpty() }?.rawValue?.let(onValue)
            }
            .addOnCompleteListener { image.close() }
    }

    fun close() = scanner.close()
}
