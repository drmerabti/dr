package com.sora2nas.app.ui.navigation

import android.net.Uri
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DocumentScanner
import androidx.compose.material.icons.filled.PictureAsPdf
import androidx.compose.material.icons.filled.TableChart
import androidx.compose.material.icons.filled.TextFields
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.sora2nas.app.R
import com.sora2nas.app.data.WorkKind
import com.sora2nas.app.scan.ScanMode
import com.sora2nas.app.ui.components.ProgressPanel
import com.sora2nas.app.ui.history.HistoryScreen
import com.sora2nas.app.ui.home.ActionRow
import com.sora2nas.app.ui.home.HomeScreen
import com.sora2nas.app.ui.paywall.PaywallScreen
import com.sora2nas.app.ui.process.ProcessScreen
import com.sora2nas.app.ui.result.ResultScreen
import com.sora2nas.app.ui.scanner.CameraScreen
import com.sora2nas.app.ui.scanner.CropOutcome
import com.sora2nas.app.ui.scanner.CropScreen
import com.sora2nas.app.ui.scanner.PageEditScreen
import com.sora2nas.app.ui.scanner.PagesScreen
import com.sora2nas.app.ui.settings.SettingsScreen
import com.sora2nas.app.ui.table.TableScreen
import com.sora2nas.app.ui.theme.Blue
import com.sora2nas.app.ui.theme.Teal
import com.sora2nas.app.ui.theme.Violet
import com.sora2nas.app.ui.theme.Amber

object Routes {
    const val HOME = "home"
    const val SCANNER = "scanner/{mode}"
    fun scanner(mode: ScanMode) = "scanner/${mode.name}"
    const val CROP = "crop"
    const val PAGES = "pages"
    const val PAGE_EDIT = "pageEdit/{id}"
    fun pageEdit(id: Long) = "pageEdit/$id"
    const val PROCESS = "process"
    const val RESULT = "result/{id}"
    fun result(id: Long) = "result/$id"
    const val TABLE = "table/{id}"
    fun table(id: Long) = "table/$id"
    const val HISTORY = "history"
    const val SETTINGS = "settings"
    const val PAYWALL = "paywall"
}

@Composable
fun AppNavHost(nav: NavHostController = rememberNavController()) {
    val main: MainViewModel = hiltViewModel()

    /** Starts a conversion, or shows the paywall when the free quota is used up. */
    fun startWork(kind: WorkKind, uris: List<Uri>) {
        if (uris.isEmpty()) return
        if (main.requestWork(kind, uris)) nav.navigate(Routes.PROCESS) else nav.navigate(Routes.PAYWALL)
    }

    NavHost(navController = nav, startDestination = Routes.HOME) {
        composable(Routes.HOME) {
            HomeScreen(
                onScanner = { nav.navigate(Routes.scanner(ScanMode.DOCUMENT)) },
                onCameraFor = { mode ->
                    if (main.canConvert()) nav.navigate(Routes.scanner(mode)) else nav.navigate(Routes.PAYWALL)
                },
                onWork = ::startWork,
                onOpenItem = { item -> main.openHistoryItem(item, nav) },
                onSeeAll = { nav.navigate(Routes.HISTORY) },
                onSettings = { nav.navigate(Routes.SETTINGS) },
                onUpgrade = { nav.navigate(Routes.PAYWALL) },
            )
        }
        composable(Routes.SCANNER, arguments = listOf(navArgument("mode") { type = NavType.StringType })) { entry ->
            val mode = runCatching { ScanMode.valueOf(entry.arguments?.getString("mode") ?: "") }.getOrDefault(ScanMode.DOCUMENT)
            CameraScreen(
                initialMode = mode,
                onCaptured = { nav.navigate(Routes.CROP) },
                onDone = { nav.navigate(Routes.PAGES) { popUpTo(Routes.HOME) } },
                onBack = { nav.popBackStack() },
            )
        }
        composable(Routes.CROP) {
            CropScreen(
                onBack = { nav.popBackStack() },
                onOutcome = { outcome ->
                    when (outcome) {
                        CropOutcome.NEXT_CAPTURE -> nav.popBackStack()
                        CropOutcome.PAGES -> nav.navigate(Routes.PAGES) { popUpTo(Routes.HOME) }
                        CropOutcome.BACK_TO_EDIT -> nav.popBackStack()
                        CropOutcome.PROCESS -> nav.navigate(Routes.PROCESS) { popUpTo(Routes.HOME) }
                        CropOutcome.PAYWALL -> nav.navigate(Routes.PAYWALL) { popUpTo(Routes.HOME) }
                    }
                },
            )
        }
        composable(Routes.PAGES) {
            PagesScreen(
                onBack = { nav.popBackStack(Routes.HOME, inclusive = false) },
                onAddPage = { nav.navigate(Routes.scanner(ScanMode.DOCUMENT)) },
                onEditPage = { id -> nav.navigate(Routes.pageEdit(id)) },
                onFinished = { nav.popBackStack(Routes.HOME, inclusive = false) },
            )
        }
        composable(Routes.PAGE_EDIT, arguments = listOf(navArgument("id") { type = NavType.LongType })) { entry ->
            PageEditScreen(
                pageId = entry.arguments?.getLong("id") ?: 0L,
                onBack = { nav.popBackStack() },
                onRecrop = { nav.navigate(Routes.CROP) },
            )
        }
        composable(Routes.PROCESS) {
            ProcessScreen(
                onBack = { nav.popBackStack() },
                onResult = { id, isTable ->
                    nav.navigate(if (isTable) Routes.table(id) else Routes.result(id)) { popUpTo(Routes.HOME) }
                },
                onPaywall = { nav.navigate(Routes.PAYWALL) },
            )
        }
        composable(Routes.RESULT, arguments = listOf(navArgument("id") { type = NavType.LongType })) { entry ->
            ResultScreen(historyId = entry.arguments?.getLong("id") ?: 0L, onBack = { nav.popBackStack() })
        }
        composable(Routes.TABLE, arguments = listOf(navArgument("id") { type = NavType.LongType })) { entry ->
            TableScreen(historyId = entry.arguments?.getLong("id") ?: 0L, onBack = { nav.popBackStack() })
        }
        composable(Routes.HISTORY) {
            HistoryScreen(onBack = { nav.popBackStack() }, onOpen = { item -> main.openHistoryItem(item, nav) })
        }
        composable(Routes.SETTINGS) {
            SettingsScreen(onBack = { nav.popBackStack() }, onUpgrade = { nav.navigate(Routes.PAYWALL) })
        }
        composable(Routes.PAYWALL) {
            PaywallScreen(onClose = { nav.popBackStack() })
        }
    }

    // Files shared into the app: ask what to do (1 tap).
    val shared by main.incoming.input.collectAsStateWithLifecycle()
    shared?.let { input ->
        ShareActionSheet(
            isPdf = input.isPdf,
            count = input.uris.size,
            onDismiss = { main.incoming.consume() },
            onChoose = { kind ->
                main.incoming.consume()
                if (kind == null) {
                    main.addImagesToScan(input.uris) { nav.navigate(Routes.PAGES) { popUpTo(Routes.HOME) } }
                } else {
                    startWork(kind, input.uris)
                }
            },
        )
    }
    val importing by main.importing.collectAsStateWithLifecycle()
    if (importing) {
        AlertDialog(onDismissRequest = {}, confirmButton = {}, text = { ProgressPanel(stringResource(R.string.preparing_pages), null) })
    }
    val openError by main.openError.collectAsStateWithLifecycle()
    if (openError) {
        AlertDialog(
            onDismissRequest = { main.clearOpenError() },
            confirmButton = { TextButton(onClick = { main.clearOpenError() }) { Text(stringResource(R.string.ok)) } },
            text = { Text(stringResource(R.string.file_not_found)) },
        )
    }
}

/** Bottom sheet shown when images/PDFs are shared to the app. null kind = add to scan. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun ShareActionSheet(isPdf: Boolean, count: Int, onDismiss: () -> Unit, onChoose: (WorkKind?) -> Unit) {
    ModalBottomSheet(onDismissRequest = onDismiss) {
        Column(
            Modifier.fillMaxWidth().padding(horizontal = 20.dp).padding(bottom = 24.dp).navigationBarsPadding(),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Text(stringResource(R.string.share_what_to_do, count), style = MaterialTheme.typography.titleLarge)
            if (isPdf) {
                ActionRow(Icons.Filled.PictureAsPdf, Violet, stringResource(R.string.home_pdf_text)) { onChoose(WorkKind.PDF_TEXT) }
                ActionRow(Icons.Filled.TableChart, Amber, stringResource(R.string.home_table)) { onChoose(WorkKind.TABLE_PDF) }
            } else {
                ActionRow(Icons.Filled.TextFields, Teal, stringResource(R.string.home_image_text)) { onChoose(WorkKind.IMAGE_TEXT) }
                if (count == 1) ActionRow(Icons.Filled.TableChart, Amber, stringResource(R.string.home_table)) { onChoose(WorkKind.TABLE_IMAGE) }
                ActionRow(Icons.Filled.DocumentScanner, Blue, stringResource(R.string.share_make_pdf)) { onChoose(null) }
            }
        }
    }
}
