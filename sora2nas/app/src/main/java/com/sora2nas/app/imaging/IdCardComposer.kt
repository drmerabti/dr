package com.sora2nas.app.imaging

import org.opencv.core.CvType
import org.opencv.core.Mat
import org.opencv.core.Rect
import org.opencv.core.Scalar
import org.opencv.core.Size
import org.opencv.imgproc.Imgproc

/**
 * ID card mode: puts the front and back of a card on one A4 page at real
 * size (ID-1 = 85.6 x 54 mm), front on top, back below, ready to print.
 */
object IdCardComposer {

    private const val DPI = 300.0
    private const val A4_W_MM = 210.0
    private const val A4_H_MM = 297.0
    private const val CARD_W_MM = 85.6

    private fun mm(v: Double) = (v / 25.4 * DPI).toInt()

    /** @param front RGB, @param back RGB. Returns an RGB A4 page (2480 x 3508). */
    fun compose(front: Mat, back: Mat): Mat {
        val page = Mat(mm(A4_H_MM), mm(A4_W_MM), CvType.CV_8UC3, Scalar(255.0, 255.0, 255.0))
        val cardW = mm(CARD_W_MM)
        place(page, front, cardW, page.rows() / 4)
        place(page, back, cardW, page.rows() * 5 / 8)
        return page
    }

    /** Draws [card] scaled to [width] with its centre at ([page] centre x, [centerY]). */
    private fun place(page: Mat, card: Mat, width: Int, centerY: Int) {
        // Landscape cards: a portrait photo of a card is rotated to landscape.
        val src = if (card.rows() > card.cols()) MatUtils.rotate90(card, 270) else card
        val height = (src.rows().toDouble() * width / src.cols()).toInt().coerceAtMost(page.rows() / 3)
        val resized = Mat()
        Imgproc.resize(src, resized, Size(width.toDouble(), height.toDouble()), 0.0, 0.0, Imgproc.INTER_AREA)
        val x = (page.cols() - width) / 2
        val y = (centerY - height / 2).coerceIn(0, page.rows() - height)
        val rgb = MatUtils.toRgb(resized)
        rgb.copyTo(page.submat(Rect(x, y, width, height)))
        // thin grey frame = cutting guide
        Imgproc.rectangle(page, Rect(x - 2, y - 2, width + 4, height + 4), Scalar(200.0, 200.0, 200.0), 2)
        rgb.release(); resized.release()
        if (src !== card) src.release()
    }
}
