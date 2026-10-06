package com.sora2nas.app.data.storage

import android.content.ActivityNotFoundException
import android.content.ClipData
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.drawable.Drawable
import android.net.Uri

/** Apps offered as one-tap share buttons right after a scan or export. */
enum class ShareApp(val packages: List<String>) {
    EMAIL(emptyList()),
    WHATSAPP(listOf("com.whatsapp", "com.whatsapp.w4b")),
    MESSENGER(listOf("com.facebook.orca", "com.facebook.mlite")),
    TELEGRAM(listOf("org.telegram.messenger", "org.telegram.messenger.web", "org.thunderdog.challegram")),
}

/** A share button: the app, the installed package to target, and its launcher icon. */
data class ShareTarget(val app: ShareApp, val packageName: String?, val icon: Drawable?)

/**
 * Sends saved files straight to e-mail, WhatsApp, Messenger or Telegram,
 * or to the system share sheet for anything else.
 */
object QuickShare {

    /** Targets available on this phone, in a fixed order. E-mail is always offered. */
    fun targets(context: Context): List<ShareTarget> {
        val pm = context.packageManager
        val list = ArrayList<ShareTarget>()
        list += ShareTarget(ShareApp.EMAIL, null, null)
        for (app in listOf(ShareApp.WHATSAPP, ShareApp.MESSENGER, ShareApp.TELEGRAM)) {
            val pkg = app.packages.firstOrNull { installed(pm, it) } ?: continue
            list += ShareTarget(app, pkg, runCatching { pm.getApplicationIcon(pkg) }.getOrNull())
        }
        return list
    }

    private fun installed(pm: PackageManager, pkg: String): Boolean =
        runCatching { pm.getApplicationInfo(pkg, 0); true }.getOrDefault(false)

    private fun sendIntent(uris: List<Uri>, mime: String, subject: String?): Intent {
        val intent = if (uris.size == 1) {
            Intent(Intent.ACTION_SEND).putExtra(Intent.EXTRA_STREAM, uris.first())
        } else {
            Intent(Intent.ACTION_SEND_MULTIPLE).putParcelableArrayListExtra(Intent.EXTRA_STREAM, ArrayList(uris))
        }
        intent.type = mime
        if (subject != null) intent.putExtra(Intent.EXTRA_SUBJECT, subject)
        // ClipData so the read permission reaches the receiving app for every file.
        intent.clipData = ClipData.newRawUri(null, uris.first()).apply { uris.drop(1).forEach { addItem(ClipData.Item(it)) } }
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        return intent
    }

    /** @return false when no app could take the files. */
    fun share(context: Context, target: ShareTarget, uris: List<Uri>, mime: String, subject: String?): Boolean {
        if (uris.isEmpty()) return false
        val intent = sendIntent(uris, mime, subject)
        when (target.app) {
            // Only e-mail apps: a mailto selector filters the chooser to them.
            ShareApp.EMAIL -> {
                intent.selector = Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:"))
                return start(context, Intent.createChooser(intent, null)) || start(context, Intent.createChooser(sendIntent(uris, mime, subject), null))
            }
            else -> intent.setPackage(target.packageName)
        }
        return start(context, intent)
    }

    /** System share sheet with every compatible app. */
    fun shareAny(context: Context, uris: List<Uri>, mime: String, subject: String?): Boolean =
        start(context, Intent.createChooser(sendIntent(uris, mime, subject), null))

    private fun start(context: Context, intent: Intent): Boolean = try {
        context.startActivity(intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
        true
    } catch (e: ActivityNotFoundException) {
        false
    }
}
