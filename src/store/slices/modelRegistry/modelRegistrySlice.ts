import { createSlice } from '@reduxjs/toolkit'
import {
    fetchRegistryModels,
    fetchRegistryAnalytics,
    fetchRegistryProviders,
    updateModelRegistry,
} from './modelRegistryThunk'
import type {
    RegistryModel,
    RegistryAnalytics,
    RegistryProvider
} from '@/app/(protected-pages)/hq/model-registry/types'

export interface ModelRegistryState {
    loading: boolean
    models: RegistryModel[]
    totalModels: number
    analytics: RegistryAnalytics | null
    providers: RegistryProvider[]
    selectedModel: RegistryModel | null
    error: string | null
}

const initialState: ModelRegistryState = {
    loading: false,
    models: [],
    totalModels: 0,
    analytics: null,
    providers: [],
    selectedModel: null,
    error: null,
}

const modelRegistrySlice = createSlice({
    name: 'modelRegistry',
    initialState,
    reducers: {
        setSelectedModel: (state, action) => {
            state.selectedModel = action.payload
        },
        clearSelectedModel: (state) => {
            state.selectedModel = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRegistryModels.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchRegistryModels.fulfilled, (state, action) => {
                state.loading = false
                state.models = action.payload.models
                state.totalModels = action.payload.total
            })
            .addCase(fetchRegistryModels.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch models'
            })
            .addCase(fetchRegistryAnalytics.fulfilled, (state, action) => {
                state.analytics = action.payload
            })
            .addCase(fetchRegistryProviders.fulfilled, (state, action) => {
                state.providers = action.payload.providers
            })
            .addCase(updateModelRegistry.fulfilled, (state, action) => {
                // Update the model in the list
                const updatedModel = action.payload
                const index = state.models.findIndex(m => m.id === updatedModel.id)
                if (index !== -1) {
                    state.models[index] = updatedModel
                }
                if (state.selectedModel?.id === updatedModel.id) {
                    state.selectedModel = updatedModel
                }
            })
    },
})

export const { setSelectedModel, clearSelectedModel } = modelRegistrySlice.actions

export default modelRegistrySlice.reducer
