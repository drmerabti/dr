package com.sora2nas.app.ui.paywall

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AllInclusive
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Layers
import androidx.compose.material.icons.filled.TableChart
import androidx.compose.material.icons.filled.WifiOff
import androidx.compose.material.icons.filled.WorkspacePremium
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.sora2nas.app.R
import com.sora2nas.app.billing.BillingEvent
import com.sora2nas.app.billing.BillingRepository
import com.sora2nas.app.billing.ProPlan
import com.sora2nas.app.ui.components.MessageDialog
import com.sora2nas.app.ui.components.findActivity
import com.sora2nas.app.ui.theme.Amber
import com.sora2nas.app.ui.theme.Blue
import com.sora2nas.app.ui.theme.BlueDark
import com.sora2nas.app.ui.theme.Teal
import com.sora2nas.app.ui.theme.Violet
import kotlinx.coroutines.delay

@Composable
fun PaywallScreen(onClose: () -> Unit, vm: PaywallViewModel = hiltViewModel()) {
    val plans by vm.plans.collectAsStateWithLifecycle()
    val isPro by vm.isPro.collectAsStateWithLifecycle()
    val event by vm.events.collectAsStateWithLifecycle()
    val remaining by vm.remaining.collectAsStateWithLifecycle()
    val context = LocalContext.current

    // Yearly is pre-selected (best value) once the plans are loaded.
    var selectedId by remember { mutableStateOf(BillingRepository.PRODUCT_YEARLY) }
    // Plans that never load (no Play Store / offline) -> explain instead of spinning forever.
    var timedOut by remember { mutableStateOf(false) }
    LaunchedEffect(Unit) { delay(8_000); timedOut = true }

    val monthly = plans.firstOrNull { it.productId == BillingRepository.PRODUCT_MONTHLY }
    val yearly = plans.firstOrNull { it.productId == BillingRepository.PRODUCT_YEARLY }
    val saving = if (monthly != null && yearly != null && monthly.currencyCode == yearly.currencyCode) {
        BillingRepository.yearlySavingPercent(monthly.priceMicros, yearly.priceMicros)
    } else 0

    Column(
        Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background).verticalScroll(rememberScrollState()),
    ) {
        Box(
            Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(bottomStart = 32.dp, bottomEnd = 32.dp))
                .background(Brush.linearGradient(listOf(BlueDark, Blue, Violet)))
                .statusBarsPadding()
                .padding(20.dp),
        ) {
            IconButton(onClick = onClose, modifier = Modifier.align(Alignment.TopEnd)) {
                Icon(Icons.Filled.Close, stringResource(R.string.close), tint = Color.White)
            }
            Column(Modifier.fillMaxWidth().padding(top = 28.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                Surface(shape = CircleShape, color = Color.White.copy(alpha = 0.18f)) {
                    Icon(Icons.Filled.WorkspacePremium, null, tint = Amber, modifier = Modifier.padding(16.dp).size(44.dp))
                }
                Spacer(Modifier.height(14.dp))
                Text(stringResource(R.string.paywall_title), style = MaterialTheme.typography.headlineSmall, color = Color.White, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
                Spacer(Modifier.height(6.dp))
                Text(
                    if (isPro) stringResource(R.string.pro_active) else stringResource(R.string.remaining_today, remaining, vm.dailyLimit),
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color.White.copy(alpha = 0.9f),
                    textAlign = TextAlign.Center,
                )
            }
        }

        Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Benefit(Icons.Filled.AllInclusive, Blue, stringResource(R.string.benefit_unlimited))
            Benefit(Icons.Filled.Layers, Teal, stringResource(R.string.benefit_batch))
            Benefit(Icons.Filled.TableChart, Amber, stringResource(R.string.benefit_tables))
            Benefit(Icons.Filled.WifiOff, Violet, stringResource(R.string.benefit_offline))
        }

        Column(Modifier.padding(horizontal = 20.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            when {
                isPro -> {
                    Card(colors = CardDefaults.cardColors(containerColor = Teal.copy(alpha = 0.12f)), modifier = Modifier.fillMaxWidth()) {
                        Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Filled.CheckCircle, null, tint = Teal)
                            Spacer(Modifier.size(10.dp))
                            Text(stringResource(R.string.pro_active), style = MaterialTheme.typography.titleMedium)
                        }
                    }
                }
                plans.isEmpty() && !timedOut -> Box(Modifier.fillMaxWidth().padding(24.dp), contentAlignment = Alignment.Center) { CircularProgressIndicator() }
                plans.isEmpty() -> Text(
                    stringResource(R.string.plans_unavailable),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth(),
                )
                else -> {
                    yearly?.let { PlanCard(it, selectedId == it.productId, saving) { selectedId = it.productId } }
                    monthly?.let { PlanCard(it, selectedId == it.productId, 0) { selectedId = it.productId } }
                    Spacer(Modifier.height(4.dp))
                    Button(
                        onClick = {
                            val plan = plans.firstOrNull { it.productId == selectedId } ?: plans.first()
                            context.findActivity()?.let { vm.buy(it, plan) }
                        },
                        modifier = Modifier.fillMaxWidth().height(56.dp),
                        shape = RoundedCornerShape(16.dp),
                    ) {
                        Text(stringResource(R.string.subscribe), style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                    }
                }
            }
            TextButton(onClick = vm::restore, modifier = Modifier.fillMaxWidth()) { Text(stringResource(R.string.restore_purchases)) }
            Text(
                stringResource(R.string.subscription_terms),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth().navigationBarsPadding().padding(bottom = 20.dp),
            )
        }
    }

    event?.let { e ->
        val msg = when (e) {
            BillingEvent.Purchased -> stringResource(R.string.purchase_success)
            BillingEvent.Restored -> stringResource(R.string.restore_success)
            BillingEvent.NothingToRestore -> stringResource(R.string.restore_nothing)
            is BillingEvent.Error -> stringResource(R.string.purchase_error)
        }
        MessageDialog(msg) {
            vm.consumeEvent()
            if (e == BillingEvent.Purchased || e == BillingEvent.Restored) onClose()
        }
    }
}

@Composable
private fun Benefit(icon: ImageVector, color: Color, text: String) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Surface(shape = CircleShape, color = color.copy(alpha = 0.14f)) {
            Icon(icon, null, tint = color, modifier = Modifier.padding(8.dp).size(22.dp))
        }
        Spacer(Modifier.size(12.dp))
        Text(text, style = MaterialTheme.typography.bodyLarge)
    }
}

@Composable
private fun PlanCard(plan: ProPlan, selected: Boolean, savingPercent: Int, onClick: () -> Unit) {
    val yearly = plan.billingPeriod.endsWith("Y")
    Card(
        onClick = onClick,
        shape = RoundedCornerShape(18.dp),
        border = BorderStroke(if (selected) 2.dp else 1.dp, if (selected) Blue else MaterialTheme.colorScheme.outlineVariant),
        colors = CardDefaults.cardColors(containerColor = if (selected) Blue.copy(alpha = 0.06f) else MaterialTheme.colorScheme.surface),
        modifier = Modifier.fillMaxWidth(),
    ) {
        Row(Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
            RadioButton(selected = selected, onClick = onClick)
            Column(Modifier.weight(1f)) {
                Text(stringResource(if (yearly) R.string.plan_yearly else R.string.plan_monthly), style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                Text(
                    stringResource(if (yearly) R.string.price_per_year else R.string.price_per_month, plan.formattedPrice),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            if (savingPercent > 0) {
                Surface(shape = RoundedCornerShape(10.dp), color = Teal) {
                    Text(
                        stringResource(R.string.save_percent, savingPercent),
                        color = Color.White,
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                    )
                }
            }
        }
    }
}
