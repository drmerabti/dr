package com.sora2nas.app.platform

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Matrix
import android.net.Uri
import androidx.exifinterface.media.ExifInterface
import org.opencv.android.Utils
import org.opencv.core.Mat
import org.opencv.imgproc.Imgproc
import java.io.File
import java.io.OutputStream

/** Bitmap <-> OpenCV conversions and memory-safe image decoding. */
object ImageIO {

    /** ARGB bitmap -> 3-channel RGB Mat (the imaging package convention). */
    fun bitmapToRgb(bmp: Bitmap): Mat {
        val src = if (bmp.config == Bitmap.Config.ARGB_8888) bmp else bmp.copy(Bitmap.Config.ARGB_8888, false)
        val rgba = Mat()
        Utils.bitmapToMat(src, rgba)
        if (src !== bmp) src.recycle()
        val rgb = Mat()
        Imgproc.cvtColor(rgba, rgb, Imgproc.COLOR_RGBA2RGB)
        rgba.release()
        return rgb
    }

    /** RGB or grey Mat -> ARGB_8888 bitmap. */
    fun matToBitmap(mat: Mat): Bitmap {
        val rgba = Mat()
        when (mat.channels()) {
            1 -> Imgproc.cvtColor(mat, rgba, Imgproc.COLOR_GRAY2RGBA)
            3 -> Imgproc.cvtColor(mat, rgba, Imgproc.COLOR_RGB2RGBA)
            else -> mat.copyTo(rgba)
        }
        val bmp = Bitmap.createBitmap(rgba.cols(), rgba.rows(), Bitmap.Config.ARGB_8888)
        Utils.matToBitmap(rgba, bmp)
        rgba.release()
        return bmp
    }

    /**
     * Decodes [uri] with the longest side <= [maxSide] (sub-sampling + exact
     * resize) and applies the EXIF rotation, so photos are always upright.
     */
    fun decode(context: Context, uri: Uri, maxSide: Int): Bitmap {
        val resolver = context.contentResolver
        val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
        resolver.openInputStream(uri)?.use { BitmapFactory.decodeStream(it, null, bounds) }
        if (bounds.outWidth <= 0 || bounds.outHeight <= 0) error("Unsupported image")
        var sample = 1
        while (maxOf(bounds.outWidth, bounds.outHeight) / (sample * 2) >= maxSide) sample *= 2
        val opts = BitmapFactory.Options().apply {
            inSampleSize = sample
            inPreferredConfig = Bitmap.Config.ARGB_8888
        }
        var bmp = resolver.openInputStream(uri)?.use { BitmapFactory.decodeStream(it, null, opts) }
            ?: error("Cannot decode image")
        val rotation = resolver.openInputStream(uri)?.use { exifRotation(ExifInterface(it)) } ?: 0
        bmp = scaleDown(bmp, maxSide)
        return rotate(bmp, rotation)
    }

    /** Stored pixel size (width, height) of an image file, without decoding it. */
    fun size(file: File): Pair<Int, Int> {
        val o = BitmapFactory.Options().apply { inJustDecodeBounds = true }
        BitmapFactory.decodeFile(file.absolutePath, o)
        return o.outWidth to o.outHeight
    }

    /** Same as [decode] for a local file. */
    fun decodeFile(file: File, maxSide: Int): Bitmap {
        val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
        BitmapFactory.decodeFile(file.absolutePath, bounds)
        var sample = 1
        while (maxOf(bounds.outWidth, bounds.outHeight) / (sample * 2) >= maxSide) sample *= 2
        var bmp = BitmapFactory.decodeFile(file.absolutePath, BitmapFactory.Options().apply { inSampleSize = sample })
            ?: error("Cannot decode ${file.name}")
        val rotation = exifRotation(ExifInterface(file.absolutePath))
        bmp = scaleDown(bmp, maxSide)
        return rotate(bmp, rotation)
    }

    private fun exifRotation(exif: ExifInterface): Int = when (exif.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL)) {
        ExifInterface.ORIENTATION_ROTATE_90 -> 90
        ExifInterface.ORIENTATION_ROTATE_180 -> 180
        ExifInterface.ORIENTATION_ROTATE_270 -> 270
        else -> 0
    }

    /** Scaled copy for thumbnails; the source bitmap is left untouched. */
    fun thumbnail(bmp: Bitmap, maxSide: Int): Bitmap {
        val s = maxSide.toFloat() / maxOf(bmp.width, bmp.height)
        if (s >= 1f) return bmp.copy(Bitmap.Config.ARGB_8888, false)
        return Bitmap.createScaledBitmap(bmp, (bmp.width * s).toInt().coerceAtLeast(1), (bmp.height * s).toInt().coerceAtLeast(1), true)
    }

    /** Scales down to [maxSide]; the source bitmap is recycled when a new one is created. */
    fun scaleDown(bmp: Bitmap, maxSide: Int): Bitmap {
        val longest = maxOf(bmp.width, bmp.height)
        if (longest <= maxSide) return bmp
        val s = maxSide.toFloat() / longest
        val out = Bitmap.createScaledBitmap(bmp, (bmp.width * s).toInt().coerceAtLeast(1), (bmp.height * s).toInt().coerceAtLeast(1), true)
        if (out !== bmp) bmp.recycle()
        return out
    }

    fun rotate(bmp: Bitmap, degrees: Int): Bitmap {
        if (degrees % 360 == 0) return bmp
        val m = Matrix().apply { postRotate(degrees.toFloat()) }
        val out = Bitmap.createBitmap(bmp, 0, 0, bmp.width, bmp.height, m, true)
        if (out !== bmp) bmp.recycle()
        return out
    }

    fun writeJpeg(bmp: Bitmap, quality: Int, out: OutputStream) {
        bmp.compress(Bitmap.CompressFormat.JPEG, quality, out)
    }

    fun jpegBytes(bmp: Bitmap, quality: Int): ByteArray =
        java.io.ByteArrayOutputStream().use { bmp.compress(Bitmap.CompressFormat.JPEG, quality, it); it.toByteArray() }

    /** Decodes a file into an RGB Mat with max side [maxSide]. */
    fun fileToRgb(file: File, maxSide: Int): Mat {
        val bmp = decodeFile(file, maxSide)
        return bitmapToRgb(bmp).also { bmp.recycle() }
    }
}
