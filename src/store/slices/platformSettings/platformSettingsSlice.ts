import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
    fetchPlatformSettings,
    fetchPublicPlatformSettings,
    updatePlatformSettings,
} from './platformSettingsThunk'
import { SLICE_BASE_NAME } from './constants'
import type { PlatformSettingsData } from '@/app/(protected-pages)/admin/platform-settings/types'


export interface PlatformSettingsState {
    data: PlatformSettingsData | null
    loading: {
        fetch: boolean
        update: boolean
    }
    error: string | null
    lastFetched: number | null
}

const initialState: PlatformSettingsState = {
    data: null,
    loading: {
        fetch: false,
        update: false,
    },
    error: null,
    lastFetched: null,
}

const platformSettingsSlice = createSlice({
    name: SLICE_BASE_NAME,
    initialState,
    reducers: {
        clearPlatformSettingsError: (state) => {
            state.error = null
        },
        updateSettingsLocal: (state, action: PayloadAction<Partial<PlatformSettingsData>>) => {
            if (state.data) {
                state.data = { ...state.data, ...action.payload }
            }
        }
    },
    extraReducers: (builder) => {
        // Fetch platform settings
        builder
            .addCase(fetchPlatformSettings.pending, (state) => {
                state.loading.fetch = true
                state.error = null
            })
            .addCase(fetchPlatformSettings.fulfilled, (state, action) => {
                state.loading.fetch = false
                state.data = action.payload
                state.lastFetched = Date.now()
            })
            .addCase(fetchPlatformSettings.rejected, (state, action) => {
                state.loading.fetch = false
                state.error = action.payload as string
            })

        // Fetch public platform settings
        builder
            .addCase(fetchPublicPlatformSettings.pending, (state) => {
                // We might not want to set global loading state for public fetch to avoid blocking UI?
                // But typically okay.
                state.loading.fetch = true
                state.error = null
            })
            .addCase(fetchPublicPlatformSettings.fulfilled, (state, action) => {
                state.loading.fetch = false
                // Merge with existing data properly or just overwrite?
                // Overwrite is safer to avoid stale state mixture
                // Cast to PlatformSettingsData even though it's partial.
                state.data = action.payload as unknown as PlatformSettingsData
            })
            .addCase(fetchPublicPlatformSettings.rejected, (state) => {
                state.loading.fetch = false
                // Don't set global error for public fetch to avoid scary error messages on login page
            })

        // Update platform settings
        builder
            .addCase(updatePlatformSettings.pending, (state) => {
                state.loading.update = true
                state.error = null
            })
            .addCase(updatePlatformSettings.fulfilled, (state, action) => {
                state.loading.update = false
                state.data = action.payload
                state.lastFetched = Date.now()
            })
            .addCase(updatePlatformSettings.rejected, (state, action) => {
                state.loading.update = false
                state.error = action.payload as string
            })
    },
})

export const { clearPlatformSettingsError, updateSettingsLocal } = platformSettingsSlice.actions

export default platformSettingsSlice.reducer
