import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@/store/rootReducer'
import { PlatformSettingsState } from './platformSettingsSlice'

const getPlatformSettingsState = (state: RootState): PlatformSettingsState => state.platformSettings

export const selectPlatformSettingsData = createSelector(
    getPlatformSettingsState,
    (state) => state.data
)

export const selectPlatformSettingsLoading = createSelector(
    getPlatformSettingsState,
    (state) => state.loading
)

export const selectPlatformSettingsError = createSelector(
    getPlatformSettingsState,
    (state) => state.error
)

export const selectPlatformSettingsLastFetched = createSelector(
    getPlatformSettingsState,
    (state) => state.lastFetched
)
