# Tesseract4Android: JNI calls back into these classes by name.
-keep class com.googlecode.tesseract.android.** { *; }
# OpenCV Java bindings are called from native code.
-keep class org.opencv.** { *; }
# PdfBox-Android uses reflection for fonts/filters.
-keep class com.tom_roush.pdfbox.** { *; }
-keep class com.tom_roush.fontbox.** { *; }
-dontwarn com.tom_roush.pdfbox.filter.JPXFilter
-dontwarn com.gemalto.jp2.**
-dontwarn org.bouncycastle.**
# Google Play Billing
-keep class com.android.vending.billing.** { *; }
