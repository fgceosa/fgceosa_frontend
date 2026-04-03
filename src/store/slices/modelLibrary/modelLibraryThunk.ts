import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetModels,
    apiGetProviders,
    apiGetModelLibraryStats,
    apiGetModelById,
    apiGetProviderById,
    type GetModelsResponse,
    type GetProvidersResponse,
    type ModelLibraryStats,
} from '@/services/modelLibrary/modelLibraryService'
import type { Model, Provider } from '@/app/(protected-pages)/dashboard/model-library/types'
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
 * Fetch all models
 */
export const fetchModels = createAsyncThunk<GetModelsResponse>(
    `${SLICE_BASE_NAME}/fetchModels`,
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiGetModels()
            return response
        } catch (error) {
            const apiError = error as ApiError
            return rejectWithValue(
                apiError.response?.data?.message || 'Failed to fetch models',
            )
        }
    },
)

/**
 * Fetch all providers
 */
export const fetchProviders = createAsyncThunk<GetProvidersResponse>(
    `${SLICE_BASE_NAME}/fetchProviders`,
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiGetProviders()
            return response
        } catch (error) {
            const apiError = error as ApiError
            return rejectWithValue(
                apiError.response?.data?.message || 'Failed to fetch providers',
            )
        }
    },
)

/**
 * Fetch model library statistics
 */
export const fetchModelLibraryStats = createAsyncThunk<ModelLibraryStats>(
    `${SLICE_BASE_NAME}/fetchStats`,
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiGetModelLibraryStats()
            return response
        } catch (error) {
            const apiError = error as ApiError
            return rejectWithValue(
                apiError.response?.data?.message ||
                'Failed to fetch statistics',
            )
        }
    },
)

/**
 * Fetch a single model by ID
 */
export const fetchModelById = createAsyncThunk<Model, string>(
    `${SLICE_BASE_NAME}/fetchModelById`,
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiGetModelById(id)
            return response
        } catch (error) {
            const apiError = error as ApiError
            return rejectWithValue(
                apiError.response?.data?.message || 'Failed to fetch model',
            )
        }
    },
)

/**
 * Fetch a single provider by ID
 */
export const fetchProviderById = createAsyncThunk<Provider, string>(
    `${SLICE_BASE_NAME}/fetchProviderById`,
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiGetProviderById(id)
            return response
        } catch (error) {
            const apiError = error as ApiError
            return rejectWithValue(
                apiError.response?.data?.message || 'Failed to fetch provider',
            )
        }
    },
)

// Export all thunks as a named export for easier imports
export const modelLibraryThunks = {
    fetchModels,
    fetchProviders,
    fetchModelLibraryStats,
    fetchModelById,
    fetchProviderById,
}
