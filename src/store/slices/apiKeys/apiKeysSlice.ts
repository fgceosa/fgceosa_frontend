import { createSlice } from '@reduxjs/toolkit'
import {
    fetchApiKeys,
    fetchApiKeysStats,
    createApiKey,
    deleteApiKey,
    revokeApiKey,
} from './apiKeysThunk'
import { SLICE_BASE_NAME, API_KEYS_STATUS } from './constants'
import type { ApiKey, ApiKeysStats } from '@/app/(protected-pages)/dashboard/api-keys/types'
import type { ApiKeysStatus } from './constants'

// Define the state interface
export interface ApiKeysState {
    // API keys list
    keys: ApiKey[]
    total: number

    // Statistics
    stats: ApiKeysStats

    // Loading states
    loading: boolean
    status: ApiKeysStatus

    // Error handling
    error: string | null

    // Cache management
    lastFetched: number | null

    // Individual component loading states
    componentLoading: {
        keys: boolean
        stats: boolean
        create: boolean
        delete: boolean
        revoke: boolean
    }
}

// Initial state
const initialState: ApiKeysState = {
    keys: [],
    total: 0,
    stats: {
        totalKeys: 0,
        activeKeys: 0,
        totalRequests: 0,
        totalUsage: 0,
        rateStatus: 'normal',
    },
    loading: false,
    status: API_KEYS_STATUS.IDLE,
    error: null,
    lastFetched: null,
    componentLoading: {
        keys: false,
        stats: false,
        create: false,
        delete: false,
        revoke: false,
    },
}

// Create the slice
const apiKeysSlice = createSlice({
    name: SLICE_BASE_NAME,
    initialState,
    reducers: {
        // Clear error
        clearError: (state) => {
            state.error = null
            if (state.status === API_KEYS_STATUS.FAILED) {
                state.status = API_KEYS_STATUS.IDLE
            }
        },

        // Reset state
        resetApiKeysState: () => initialState,
    },
    extraReducers: (builder) => {
        // Handle fetchApiKeys
        builder
            .addCase(fetchApiKeys.pending, (state) => {
                state.componentLoading.keys = true
                state.loading = true
                state.status = API_KEYS_STATUS.LOADING
                state.error = null
            })
            .addCase(fetchApiKeys.fulfilled, (state, action) => {
                state.componentLoading.keys = false
                state.loading = false
                state.status = API_KEYS_STATUS.SUCCEEDED
                state.keys = action.payload.keys
                state.total = action.payload.total
                state.lastFetched = Date.now()
            })
            .addCase(fetchApiKeys.rejected, (state, action) => {
                state.componentLoading.keys = false
                state.loading = false
                state.status = API_KEYS_STATUS.FAILED
                state.error = action.payload as string
            })

        // Handle fetchApiKeysStats
        builder
            .addCase(fetchApiKeysStats.pending, (state) => {
                state.componentLoading.stats = true
                state.error = null
            })
            .addCase(fetchApiKeysStats.fulfilled, (state, action) => {
                state.componentLoading.stats = false
                state.stats = action.payload
                state.lastFetched = Date.now()
            })
            .addCase(fetchApiKeysStats.rejected, (state, action) => {
                state.componentLoading.stats = false
                state.error = action.payload as string
                state.status = API_KEYS_STATUS.FAILED
            })

        // Handle createApiKey
        builder
            .addCase(createApiKey.pending, (state) => {
                state.componentLoading.create = true
                state.error = null
            })
            .addCase(createApiKey.fulfilled, (state, action) => {
                state.componentLoading.create = false
                // Note: Stats and keys list should be refetched after creation
                state.lastFetched = Date.now()
            })
            .addCase(createApiKey.rejected, (state, action) => {
                state.componentLoading.create = false
                state.error = action.payload as string
                state.status = API_KEYS_STATUS.FAILED
            })

        // Handle deleteApiKey
        builder
            .addCase(deleteApiKey.pending, (state) => {
                state.componentLoading.delete = true
                state.error = null
            })
            .addCase(deleteApiKey.fulfilled, (state, action) => {
                state.componentLoading.delete = false
                // Remove key from list
                state.keys = state.keys.filter((k) => k.id !== action.payload.id)
                state.total = Math.max(0, state.total - 1)
                state.lastFetched = Date.now()
            })
            .addCase(deleteApiKey.rejected, (state, action) => {
                state.componentLoading.delete = false
                state.error = action.payload as string
                state.status = API_KEYS_STATUS.FAILED
            })

        // Handle revokeApiKey
        builder
            .addCase(revokeApiKey.pending, (state) => {
                state.componentLoading.revoke = true
                state.error = null
            })
            .addCase(revokeApiKey.fulfilled, (state, action) => {
                state.componentLoading.revoke = false
                // Update key status in list
                const index = state.keys.findIndex(
                    (k) => k.id === action.payload.id,
                )
                if (index !== -1) {
                    state.keys[index].status = 'revoked'
                }
                state.lastFetched = Date.now()
            })
            .addCase(revokeApiKey.rejected, (state, action) => {
                state.componentLoading.revoke = false
                state.error = action.payload as string
                state.status = API_KEYS_STATUS.FAILED
            })
    },
})

// Export actions
export const { clearError, resetApiKeysState } = apiKeysSlice.actions

// Export reducer
export default apiKeysSlice.reducer

// Export the slice for testing purposes
export { apiKeysSlice }
