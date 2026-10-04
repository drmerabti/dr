package com.sora2nas.app.di

import android.content.Context
import androidx.room.Room
import com.sora2nas.app.data.history.AppDatabase
import com.sora2nas.app.data.history.HistoryDao
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun database(@ApplicationContext context: Context): AppDatabase =
        Room.databaseBuilder(context, AppDatabase::class.java, "sora2nas.db").build()

    @Provides
    fun historyDao(db: AppDatabase): HistoryDao = db.historyDao()
}
