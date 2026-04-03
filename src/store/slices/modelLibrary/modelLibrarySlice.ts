import { createSlice } from '@reduxjs/toolkit'
import {
    fetchModels,
    fetchProviders,
    fetchModelLibraryStats,
    fetchModelById,
    fetchProviderById,
} from './modelLibraryThunk'
import { SLICE_BASE_NAME, MODEL_LIBRARY_STATUS } from './constants'
import type { Model, Provider } from '@/app/(protected-pages)/dashboard/model-library/types'
import type { ModelLibraryStats } from '@/services/modelLibrary/modelLibraryService'
import type { ModelLibraryStatus } from './constants'

// Define the state interface
export interface ModelLibraryState {
    // Models list
    models: Model[]
    totalModels: number

    // Providers list
    providers: Provider[]
    totalProviders: number

    // Statistics
    stats: ModelLibraryStats

    // Loading states
    loading: boolean
    status: ModelLibraryStatus

    // Error handling
    error: string | null

    // Cache management
    lastFetched: number | null

    // Individual component loading states
    componentLoading: {
        models: boolean
        providers: boolean
        stats: boolean
        modelDetails: boolean
        providerDetails: boolean
    }

    // Selected items for details view
    selectedModel: Model | null
    selectedProvider: Provider | null
}

// Initial state
const initialState: ModelLibraryState = {
    models: [],
    totalModels: 0,
    providers: [],
    totalProviders: 0,
    stats: {
        totalModels: 0,
        totalProviders: 0,
        textModels: 0,
        embeddingModels: 0,
        approvedModels: 0,
    },
    loading: false,
    status: MODEL_LIBRARY_STATUS.IDLE,
    error: null,
    lastFetched: null,
    componentLoading: {
        models: false,
        providers: false,
        stats: false,
        modelDetails: false,
        providerDetails: false,
    },
    selectedModel: null,
    selectedProvider: null,
}

// Create the slice
const modelLibrarySlice = createSlice({
    name: SLICE_BASE_NAME,
    initialState,
    reducers: {
        // Clear error
        clearError: (state) => {
            state.error = null
            if (state.status === MODEL_LIBRARY_STATUS.FAILED) {
                state.status = MODEL_LIBRARY_STATUS.IDLE
            }
        },

        // Reset state
        resetModelLibraryState: () => initialState,

        // Clear selected model
        clearSelectedModel: (state) => {
            state.selectedModel = null
        },

        // Clear selected provider
        clearSelectedProvider: (state) => {
            state.selectedProvider = null
        },
    },
    extraReducers: (builder) => {
        // Handle fetchModels
        builder
            .addCase(fetchModels.pending, (state) => {
                state.componentLoading.models = true
                state.loading = true
                state.status = MODEL_LIBRARY_STATUS.LOADING
                state.error = null
            })
            .addCase(fetchModels.fulfilled, (state, action) => {
                state.componentLoading.models = false
                state.loading = false
                state.status = MODEL_LIBRARY_STATUS.SUCCEEDED
                state.models = action.payload.models
                state.totalModels = action.payload.total
                state.lastFetched = Date.now()
            })
            .addCase(fetchModels.rejected, (state, action) => {
                state.componentLoading.models = false
                state.loading = false
                state.status = MODEL_LIBRARY_STATUS.FAILED
                state.error = action.payload as string
            })

        // Handle fetchProviders
        builder
            .addCase(fetchProviders.pending, (state) => {
                state.componentLoading.providers = true
                state.error = null
            })
            .addCase(fetchProviders.fulfilled, (state, action) => {
                state.componentLoading.providers = false
                state.providers = action.payload.providers
                state.totalProviders = action.payload.total
                state.lastFetched = Date.now()
            })
            .addCase(fetchProviders.rejected, (state, action) => {
                state.componentLoading.providers = false
                state.error = action.payload as string
                state.status = MODEL_LIBRARY_STATUS.FAILED
            })

        // Handle fetchModelLibraryStats
        builder
            .addCase(fetchModelLibraryStats.pending, (state) => {
                state.componentLoading.stats = true
                state.error = null
            })
            .addCase(fetchModelLibraryStats.fulfilled, (state, action) => {
                state.componentLoading.stats = false
                state.stats = action.payload
                state.lastFetched = Date.now()
            })
            .addCase(fetchModelLibraryStats.rejected, (state, action) => {
                state.componentLoading.stats = false
                state.error = action.payload as string
                state.status = MODEL_LIBRARY_STATUS.FAILED
            })

        // Handle fetchModelById
        builder
            .addCase(fetchModelById.pending, (state) => {
                state.componentLoading.modelDetails = true
                state.error = null
            })
            .addCase(fetchModelById.fulfilled, (state, action) => {
                state.componentLoading.modelDetails = false
                state.selectedModel = action.payload
                state.lastFetched = Date.now()
            })
            .addCase(fetchModelById.rejected, (state, action) => {
                state.componentLoading.modelDetails = false
                state.error = action.payload as string
                state.status = MODEL_LIBRARY_STATUS.FAILED
            })

        // Handle fetchProviderById
        builder
            .addCase(fetchProviderById.pending, (state) => {
                state.componentLoading.providerDetails = true
                state.error = null
            })
            .addCase(fetchProviderById.fulfilled, (state, action) => {
                state.componentLoading.providerDetails = false
                state.selectedProvider = action.payload
                state.lastFetched = Date.now()
            })
            .addCase(fetchProviderById.rejected, (state, action) => {
                state.componentLoading.providerDetails = false
                state.error = action.payload as string
                state.status = MODEL_LIBRARY_STATUS.FAILED
            })
    },
})

// Export actions
export const {
    clearError,
    resetModelLibraryState,
    clearSelectedModel,
    clearSelectedProvider,
} = modelLibrarySlice.actions

// Export reducer
export default modelLibrarySlice.reducer

// Export the slice for testing purposes
export { modelLibrarySlice }
