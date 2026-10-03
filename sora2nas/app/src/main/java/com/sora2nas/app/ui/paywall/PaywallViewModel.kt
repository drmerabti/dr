package com.sora2nas.app.ui.paywall

import android.app.Activity
import androidx.lifecycle.ViewModel
import com.sora2nas.app.billing.BillingEvent
import com.sora2nas.app.billing.BillingRepository
import com.sora2nas.app.billing.ProPlan
import com.sora2nas.app.data.usage.UsageRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.StateFlow
import javax.inject.Inject

@HiltViewModel
class PaywallViewModel @Inject constructor(
    private val billing: BillingRepository,
    usage: UsageRepository,
) : ViewModel() {
    val plans: StateFlow<List<ProPlan>> = billing.plans
    val isPro: StateFlow<Boolean> = billing.isPro
    val events: StateFlow<BillingEvent?> = billing.events
    val remaining: StateFlow<Int> = usage.remaining
    val dailyLimit: Int = usage.dailyLimit

    init { billing.start() }

    fun buy(activity: Activity, plan: ProPlan) = billing.launchPurchase(activity, plan)
    fun restore() = billing.restore()
    fun consumeEvent() = billing.consumeEvent()
}
