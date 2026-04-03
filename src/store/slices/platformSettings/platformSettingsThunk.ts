import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetPlatformSettings,
    apiGetPublicPlatformSettings,
    apiUpdatePlatformSettings,
} from '@/services/platformSettings/platformSettingsService'
import type { PlatformSettingsData } from '@/app/(protected-pages)/admin/platform-settings/types'
import { SLICE_BASE_NAME } from './constants'

/**
 * Fetch platform settings
 */
export const fetchPlatformSettings = createAsyncThunk(
    `${SLICE_BASE_NAME}/fetchPlatformSettings`,
    async (_, { rejectWithValue }) => {
        try {
            return await apiGetPlatformSettings()
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.message ||
                'Failed to fetch platform settings'
            return rejectWithValue(errorMessage)
        }
    }
)

/**
 * Fetch public platform settings
 */
export const fetchPublicPlatformSettings = createAsyncThunk(
    `${SLICE_BASE_NAME}/fetchPublicPlatformSettings`,
    async (_, { rejectWithValue }) => {
        try {
            return await apiGetPublicPlatformSettings()
        } catch (error: any) {
            // Silently fail or return distinct error
            const errorMessage =
                error?.response?.data?.detail ||
                'Failed to fetch public settings'
            return rejectWithValue(errorMessage)
        }
    }
)

/**
 * Update platform settings
 */
export const updatePlatformSettings = createAsyncThunk(
    `${SLICE_BASE_NAME}/updatePlatformSettings`,
    async (data: PlatformSettingsData, { rejectWithValue }) => {
        try {
            return await apiUpdatePlatformSettings(data)
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.message ||
                'Failed to update platform settings'
            return rejectWithValue(errorMessage)
        }
    }
)
