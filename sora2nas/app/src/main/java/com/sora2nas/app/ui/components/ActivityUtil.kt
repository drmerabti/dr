package com.sora2nas.app.ui.components

import android.app.Activity
import android.content.Context
import android.content.ContextWrapper

/** The Activity behind a Compose [Context] (needed by Play Billing). */
tailrec fun Context.findActivity(): Activity? = when (this) {
    is Activity -> this
    is ContextWrapper -> baseContext.findActivity()
    else -> null
}
