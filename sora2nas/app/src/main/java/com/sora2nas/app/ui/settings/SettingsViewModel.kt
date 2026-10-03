package com.sora2nas.app.ui.settings

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.sora2nas.app.billing.BillingEvent
import com.sora2nas.app.billing.BillingRepository
import com.sora2nas.app.data.settings.AppSettings
import com.sora2nas.app.data.settings.ScanQuality
import com.sora2nas.app.data.settings.SettingsRepository
import com.sora2nas.app.data.settings.TableExportFormat
import com.sora2nas.app.data.settings.TextExportFormat
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SettingsViewModel @Inject constructor(
    @ApplicationContext private val context: Context,
    private val repo: SettingsRepository,
    private val billing: BillingRepository,
) : ViewModel() {

    val settings: StateFlow<AppSettings> = repo.settings
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), AppSettings(language = repo.appLanguageBlocking()))
    val isPro: StateFlow<Boolean> = billing.isPro
    val events: StateFlow<BillingEvent?> = billing.events

    fun setLanguage(tag: String) {
        if (tag != repo.appLanguageBlocking()) repo.setAppLanguage(tag)
    }

    fun setQuality(q: ScanQuality) = viewModelScope.launch { repo.setScanQuality(q) }
    fun setTextExport(f: TextExportFormat) = viewModelScope.launch { repo.setTextExport(f) }
    fun setTableExport(f: TableExportFormat) = viewModelScope.launch { repo.setTableExport(f) }

    fun restore() = billing.restore()
    fun consumeEvent() = billing.consumeEvent()

    /** Google Play's own subscription page (cancel / change plan / payment method). */
    fun manageSubscription() {
        val uri = Uri.parse("https://play.google.com/store/account/subscriptions?package=${context.packageName}")
        runCatching { context.startActivity(Intent(Intent.ACTION_VIEW, uri).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)) }
    }

    val versionName: String = runCatching {
        context.packageManager.getPackageInfo(context.packageName, 0).versionName
    }.getOrNull() ?: ""
}
