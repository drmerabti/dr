package com.sora2nas.app.ui.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.sora2nas.app.data.history.HistoryRepository
import com.sora2nas.app.data.usage.UsageRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.stateIn
import javax.inject.Inject

@HiltViewModel
class HomeViewModel @Inject constructor(
    history: HistoryRepository,
    private val usage: UsageRepository,
) : ViewModel() {
    val recent = history.recent(5).stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val remaining = usage.remaining
    val isPro = usage.isPro
    val dailyLimit: Int get() = usage.dailyLimit

    fun refresh() = usage.refresh()
}
