package com.sora2nas.app.billing

import android.app.Activity
import android.content.Context
import android.util.Log
import com.android.billingclient.api.AcknowledgePurchaseParams
import com.android.billingclient.api.BillingClient
import com.android.billingclient.api.BillingClientStateListener
import com.android.billingclient.api.BillingFlowParams
import com.android.billingclient.api.BillingResult
import com.android.billingclient.api.PendingPurchasesParams
import com.android.billingclient.api.ProductDetails
import com.android.billingclient.api.Purchase
import com.android.billingclient.api.PurchasesUpdatedListener
import com.android.billingclient.api.QueryProductDetailsParams
import com.android.billingclient.api.QueryPurchasesParams
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.suspendCancellableCoroutine
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.coroutines.resume

/** A subscription plan shown on the paywall. */
data class ProPlan(
    val productId: String,
    val formattedPrice: String,
    val billingPeriod: String, // ISO-8601, e.g. P1M / P1Y
    val priceMicros: Long,
    val currencyCode: String,
    val details: ProductDetails,
    val offerToken: String,
)

/**
 * Google Play Billing (subscriptions): monthly + yearly "Pro".
 * Product IDs are configured in Play Console (see README).
 * The Pro state is cached locally so the app also works offline.
 */
@Singleton
class BillingRepository @Inject constructor(@ApplicationContext private val context: Context) : PurchasesUpdatedListener {

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)
    private val cache = context.getSharedPreferences("billing_cache", Context.MODE_PRIVATE)

    private val _isPro = MutableStateFlow(cachedPro())
    val isPro: StateFlow<Boolean> = _isPro.asStateFlow()

    private val _plans = MutableStateFlow<List<ProPlan>>(emptyList())
    val plans: StateFlow<List<ProPlan>> = _plans.asStateFlow()

    /** One-shot user messages (purchase success / errors), consumed by the UI. */
    private val _events = MutableStateFlow<BillingEvent?>(null)
    val events: StateFlow<BillingEvent?> = _events.asStateFlow()

    private val client: BillingClient = BillingClient.newBuilder(context)
        .setListener(this)
        .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
        .enableAutoServiceReconnection()
        .build()

    fun start() {
        if (client.isReady) return
        client.startConnection(object : BillingClientStateListener {
            override fun onBillingSetupFinished(result: BillingResult) {
                if (result.responseCode == BillingClient.BillingResponseCode.OK) {
                    scope.launch {
                        refreshPurchases()
                        loadPlans()
                    }
                }
            }

            override fun onBillingServiceDisconnected() = Unit // auto reconnection is enabled
        })
    }

    fun consumeEvent() { _events.value = null }

    /** "Restore purchases": re-reads the subscriptions owned by the Play account. */
    fun restore() {
        scope.launch {
            if (!client.isReady) start()
            val active = refreshPurchases()
            _events.value = if (active) BillingEvent.Restored else BillingEvent.NothingToRestore
        }
    }

    fun launchPurchase(activity: Activity, plan: ProPlan) {
        val params = BillingFlowParams.newBuilder()
            .setProductDetailsParamsList(
                listOf(
                    BillingFlowParams.ProductDetailsParams.newBuilder()
                        .setProductDetails(plan.details)
                        .setOfferToken(plan.offerToken)
                        .build(),
                ),
            ).build()
        val result = client.launchBillingFlow(activity, params)
        if (result.responseCode != BillingClient.BillingResponseCode.OK) {
            _events.value = BillingEvent.Error(result.debugMessage)
        }
    }

    override fun onPurchasesUpdated(result: BillingResult, purchases: MutableList<Purchase>?) {
        when (result.responseCode) {
            BillingClient.BillingResponseCode.OK -> scope.launch {
                purchases?.forEach { handlePurchase(it) }
                if (_isPro.value) _events.value = BillingEvent.Purchased
            }
            BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED -> scope.launch { refreshPurchases() }
            BillingClient.BillingResponseCode.USER_CANCELED -> Unit
            else -> _events.value = BillingEvent.Error(result.debugMessage)
        }
    }

    private suspend fun handlePurchase(p: Purchase) {
        if (p.purchaseState != Purchase.PurchaseState.PURCHASED) return
        if (p.products.none { it in PRODUCT_IDS }) return
        if (!p.isAcknowledged) {
            val params = AcknowledgePurchaseParams.newBuilder().setPurchaseToken(p.purchaseToken).build()
            suspendCancellableCoroutine<BillingResult> { cont ->
                client.acknowledgePurchase(params) { cont.resume(it) }
            }
        }
        setPro(true)
    }

    /** @return true when an active Pro subscription exists. */
    private suspend fun refreshPurchases(): Boolean {
        if (!client.isReady) return _isPro.value
        val (result, purchases) = suspendCancellableCoroutine<Pair<BillingResult, List<Purchase>>> { cont ->
            client.queryPurchasesAsync(
                QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.SUBS).build(),
            ) { r, list -> cont.resume(r to list) }
        }
        if (result.responseCode != BillingClient.BillingResponseCode.OK) return _isPro.value
        val active = purchases.filter { it.purchaseState == Purchase.PurchaseState.PURCHASED && it.products.any { id -> id in PRODUCT_IDS } }
        active.forEach { handlePurchase(it) }
        setPro(active.isNotEmpty())
        return active.isNotEmpty()
    }

    private suspend fun loadPlans() {
        val params = QueryProductDetailsParams.newBuilder()
            .setProductList(
                PRODUCT_IDS.map {
                    QueryProductDetailsParams.Product.newBuilder()
                        .setProductId(it)
                        .setProductType(BillingClient.ProductType.SUBS)
                        .build()
                },
            ).build()
        val details: List<ProductDetails> = suspendCancellableCoroutine { cont ->
            client.queryProductDetailsAsync(params) { result, queryResult ->
                if (result.responseCode == BillingClient.BillingResponseCode.OK) cont.resume(queryResult.productDetailsList)
                else cont.resume(emptyList())
            }
        }
        _plans.value = details.mapNotNull { d ->
            val offer = d.subscriptionOfferDetails?.firstOrNull() ?: return@mapNotNull null
            // Last pricing phase = the recurring price (earlier phases may be a free trial).
            val phase = offer.pricingPhases.pricingPhaseList.lastOrNull() ?: return@mapNotNull null
            ProPlan(d.productId, phase.formattedPrice, phase.billingPeriod, phase.priceAmountMicros, phase.priceCurrencyCode, d, offer.offerToken)
        }.sortedBy { if (it.productId == PRODUCT_MONTHLY) 0 else 1 }
        Log.d(TAG, "plans loaded: ${_plans.value.map { it.productId }}")
    }

    private fun setPro(pro: Boolean) {
        _isPro.value = pro
        cache.edit().putBoolean(KEY_PRO, pro).putLong(KEY_CHECKED_AT, System.currentTimeMillis()).apply()
    }

    /** Offline grace: a cached Pro state is trusted for 7 days without a Play check. */
    private fun cachedPro(): Boolean {
        val pro = cache.getBoolean(KEY_PRO, false)
        val checkedAt = cache.getLong(KEY_CHECKED_AT, 0L)
        return pro && System.currentTimeMillis() - checkedAt < 7L * 24 * 3600 * 1000
    }

    companion object {
        /**
         * Yearly saving vs 12 monthly payments, in percent (0 when unknown or
         * when the currencies differ).
         */
        fun yearlySavingPercent(monthlyMicros: Long, yearlyMicros: Long): Int {
            if (monthlyMicros <= 0 || yearlyMicros <= 0) return 0
            val full = monthlyMicros * 12.0
            return ((1.0 - yearlyMicros / full) * 100).toInt().coerceIn(0, 99)
        }

        private const val TAG = "Billing"
        /** Must match the subscription product IDs created in Play Console. */
        const val PRODUCT_MONTHLY = "sora2nas_pro_monthly"
        const val PRODUCT_YEARLY = "sora2nas_pro_yearly"
        val PRODUCT_IDS = listOf(PRODUCT_MONTHLY, PRODUCT_YEARLY)
        private const val KEY_PRO = "pro"
        private const val KEY_CHECKED_AT = "checked_at"
    }
}

sealed interface BillingEvent {
    data object Purchased : BillingEvent
    data object Restored : BillingEvent
    data object NothingToRestore : BillingEvent
    data class Error(val message: String) : BillingEvent
}
