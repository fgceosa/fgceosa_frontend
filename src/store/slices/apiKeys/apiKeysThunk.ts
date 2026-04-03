import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetApiKeys,
    apiGetApiKeysStats,
    apiCreateApiKey,
    apiDeleteApiKey,
    apiRevokeApiKey,
    type GetApiKeysResponse,
} from '@/services/apiKeys/apiKeysService'
import type {
    ApiKeysStats,
    CreateApiKeyRequest,
    CreateApiKeyResponse,
} from '@/app/(protected-pages)/dashboard/api-keys/types'
import { SLICE_BASE_NAME } from './constants'

interface ApiError {
    response?: {
        data?: {
            message?: string
        }
    }
    message?: string
}

/**
 * Fetch all API keys
 */
export const fetchApiKeys = createAsyncThunk<GetApiKeysResponse>(
    `${SLICE_BASE_NAME}/fetchKeys`,
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiGetApiKeys()
            return response
        } catch (error) {
            const apiError = error as ApiError
            return rejectWithValue(
                (apiError as any)?.response?.data?.detail || apiError.response?.data?.message || 'Failed to fetch API keys',
            )
        }
    },
)

/**
 * Fetch API keys statistics
 */
export const fetchApiKeysStats = createAsyncThunk<ApiKeysStats>(
    `${SLICE_BASE_NAME}/fetchStats`,
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiGetApiKeysStats()
            return response
        } catch (error) {
            const apiError = error as ApiError
            return rejectWithValue(
                (apiError as any)?.response?.data?.detail || apiError.response?.data?.message ||
                'Failed to fetch statistics',
            )
        }
    },
)

/**
 * Create a new API key
 */
export const createApiKey = createAsyncThunk<
    CreateApiKeyResponse,
    CreateApiKeyRequest
>(`${SLICE_BASE_NAME}/create`, async (data, { rejectWithValue }) => {
    try {
        const response = await apiCreateApiKey(data)
        return response
    } catch (error) {
        const apiError = error as ApiError
        return rejectWithValue(
            (apiError as any)?.response?.data?.detail || apiError.response?.data?.message || 'Failed to create API key',
        )
    }
})

/**
 * Delete an API key
 */
export const deleteApiKey = createAsyncThunk<{ id: string }, string>(
    `${SLICE_BASE_NAME}/delete`,
    async (id, { rejectWithValue }) => {
        try {
            await apiDeleteApiKey(id)
            return { id }
        } catch (error) {
            const apiError = error as ApiError
            return rejectWithValue(
                (apiError as any)?.response?.data?.detail || apiError.response?.data?.message || 'Failed to delete API key',
            )
        }
    },
)

/**
 * Revoke an API key
 */
export const revokeApiKey = createAsyncThunk<{ id: string }, string>(
    `${SLICE_BASE_NAME}/revoke`,
    async (id, { rejectWithValue }) => {
        try {
            await apiRevokeApiKey(id)
            return { id }
        } catch (error) {
            const apiError = error as ApiError
            return rejectWithValue(
                (apiError as any)?.response?.data?.detail || apiError.response?.data?.message || 'Failed to revoke API key',
            )
        }
    },
)

// Export all thunks as a named export for easier imports
export const apiKeysThunks = {
    fetchApiKeys,
    fetchApiKeysStats,
    createApiKey,
    deleteApiKey,
    revokeApiKey,
}
