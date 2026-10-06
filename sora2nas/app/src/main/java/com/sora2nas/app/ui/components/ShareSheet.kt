package com.sora2nas.app.ui.components

import android.net.Uri
import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.MoreHoriz
import androidx.compose.material.icons.filled.OpenInNew
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.core.graphics.drawable.toBitmap
import com.sora2nas.app.R
import com.sora2nas.app.data.storage.QuickShare
import com.sora2nas.app.data.storage.ShareApp
import com.sora2nas.app.data.storage.ShareTarget
import com.sora2nas.app.ui.theme.Teal

/**
 * Shown right after a file is saved: where it went, then one-tap sharing to
 * e-mail, WhatsApp, Messenger and Telegram (when installed) or any other app.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SavedShareSheet(
    path: String,
    uris: List<Uri>,
    mime: String,
    subject: String?,
    onOpen: () -> Unit,
    onDone: () -> Unit,
) {
    val context = LocalContext.current
    val targets = remember { QuickShare.targets(context) }
    val sheet = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    fun failed() = Toast.makeText(context, R.string.share_failed, Toast.LENGTH_SHORT).show()

    ModalBottomSheet(onDismissRequest = onDone, sheetState = sheet) {
        Column(
            Modifier.fillMaxWidth().navigationBarsPadding().padding(horizontal = 20.dp).padding(bottom = 20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Icon(Icons.Filled.CheckCircle, null, tint = Teal, modifier = Modifier.size(44.dp))
            Spacer(Modifier.height(6.dp))
            Text(stringResource(R.string.saved_title), style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            Text(
                path,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center,
            )
            Spacer(Modifier.height(18.dp))
            Text(stringResource(R.string.share_via), style = MaterialTheme.typography.titleMedium, modifier = Modifier.fillMaxWidth())
            Spacer(Modifier.height(12.dp))
            Row(
                Modifier.fillMaxWidth().horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.SpaceEvenly,
            ) {
                targets.forEach { t ->
                    ShareButton(t) { if (!QuickShare.share(context, t, uris, mime, subject)) failed() }
                }
                ShareButton(label = stringResource(R.string.share_more), icon = Icons.Filled.MoreHoriz, color = Color(0xFF5B6475)) {
                    if (!QuickShare.shareAny(context, uris, mime, subject)) failed()
                }
            }
            Spacer(Modifier.height(20.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                OutlinedButton(onClick = onOpen, modifier = Modifier.weight(1f).height(50.dp)) {
                    Icon(Icons.Filled.OpenInNew, null, Modifier.size(18.dp))
                    Spacer(Modifier.width(6.dp))
                    Text(stringResource(R.string.open))
                }
                Button(onClick = onDone, modifier = Modifier.weight(1f).height(50.dp)) { Text(stringResource(R.string.done)) }
            }
        }
    }
}

@Composable
private fun ShareButton(target: ShareTarget, onClick: () -> Unit) {
    val label = stringResource(
        when (target.app) {
            ShareApp.EMAIL -> R.string.share_email
            ShareApp.WHATSAPP -> R.string.share_whatsapp
            ShareApp.MESSENGER -> R.string.share_messenger
            ShareApp.TELEGRAM -> R.string.share_telegram
        },
    )
    val icon = target.icon
    if (icon == null) {
        ShareButton(label, Icons.Filled.Email, Color(0xFFE5486B), onClick)
        return
    }
    val bmp = remember(target.packageName) { icon.toBitmap(144, 144).asImageBitmap() }
    ShareTile(label, onClick) { Image(bmp, null, Modifier.size(56.dp).clip(CircleShape)) }
}

@Composable
private fun ShareButton(label: String, icon: ImageVector, color: Color, onClick: () -> Unit) {
    ShareTile(label, onClick) {
        Surface(shape = CircleShape, color = color, modifier = Modifier.size(56.dp)) {
            Box(contentAlignment = Alignment.Center) { Icon(icon, null, tint = Color.White, modifier = Modifier.size(28.dp)) }
        }
    }
}

@Composable
private fun ShareTile(label: String, onClick: () -> Unit, icon: @Composable () -> Unit) {
    Column(
        Modifier.width(76.dp).clip(RoundedCornerShape(14.dp)).clickable(onClick = onClick).padding(vertical = 6.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        icon()
        Spacer(Modifier.height(6.dp))
        Text(label, style = MaterialTheme.typography.labelMedium, maxLines = 1, textAlign = TextAlign.Center)
    }
}
