package com.sora2nas.app

import android.app.Application
import androidx.appcompat.app.AppCompatDelegate
import androidx.core.os.LocaleListCompat
import com.sora2nas.app.billing.BillingRepository
import com.sora2nas.app.data.settings.SettingsRepository
import com.sora2nas.app.platform.TessDataInstaller
import com.tom_roush.pdfbox.android.PDFBoxResourceLoader
import dagger.hilt.android.HiltAndroidApp
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import org.opencv.android.OpenCVLoader
import javax.inject.Inject

@HiltAndroidApp
class Sora2NasApp : Application() {

    @Inject lateinit var settings: SettingsRepository
    @Inject lateinit var billing: BillingRepository
    @Inject lateinit var tessData: TessDataInstaller

    val appScope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

    override fun onCreate() {
        super.onCreate()
        applyAppLanguage()
        OpenCVLoader.initLocal()
        PDFBoxResourceLoader.init(this)
        billing.start()
        // Copy the bundled OCR models to internal storage once (in the background).
        appScope.launch(Dispatchers.IO) { tessData.ensureInstalled() }
    }

    /** Arabic by default; French when chosen in Settings. */
    private fun applyAppLanguage() {
        val wanted = settings.appLanguageBlocking()
        val current = AppCompatDelegate.getApplicationLocales().toLanguageTags()
        if (current != wanted) {
            AppCompatDelegate.setApplicationLocales(LocaleListCompat.forLanguageTags(wanted))
        }
    }
}
