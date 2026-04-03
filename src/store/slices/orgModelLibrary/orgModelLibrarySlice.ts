import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import {
    apiGetOrgLibraryModels,
    apiToggleOrgModelStatus,
    apiSetOrgModelDefault,
    apiGetOrgModelAnalytics
} from '@/services/modelRegistry/modelRegistryService'
import type { OrgLibraryModel, OrgModelLibraryState } from './types'

export const SLICE_NAME = 'orgModelLibrary'

export const getOrgModels = createAsyncThunk(
    `${SLICE_NAME}/getOrgModels`,
    async (search?: string) => {
        const response = await apiGetOrgLibraryModels(search)
        return response.models as OrgLibraryModel[]
    }
)

export const getOrgAnalytics = createAsyncThunk(
    `${SLICE_NAME}/getOrgAnalytics`,
    async () => {
        const response = await apiGetOrgModelAnalytics()
        return response
    }
)

export const toggleModelEnabled = createAsyncThunk(
    `${SLICE_NAME}/toggleModelEnabled`,
    async (modelId: string, { getState }) => {
        const state = getState() as any // Avoid circular dependency
        const model = state.orgModelLibrary.models.find((m: OrgLibraryModel) => m.id === modelId)
        if (!model) throw new Error('Model not found')

        const newStatus = !model.isEnabled
        // Optimistic update could happen here, but we wait for server confirmation
        await apiToggleOrgModelStatus(modelId, newStatus)
        return { modelId, isEnabled: newStatus }
    }
)

export const setWorkspaceDefault = createAsyncThunk(
    `${SLICE_NAME}/setWorkspaceDefault`,
    async (modelId: string) => {
        await apiSetOrgModelDefault(modelId)
        return modelId
    }
)

const initialState: OrgModelLibraryState = {
    models: [],
    analytics: null, // Initialized as null
    loading: false,
    searchQuery: '',
    filterProvider: null,
    filterCapability: null,
    filterStatus: null,
    filterCategory: 'text',
    sortBy: 'recommended'
}

const orgModelLibrarySlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload
        },
        setFilterProvider: (state, action: PayloadAction<string | null>) => {
            state.filterProvider = action.payload
        },
        setFilterCapability: (state, action: PayloadAction<string | null>) => {
            state.filterCapability = action.payload
        },
        setFilterStatus: (state, action: PayloadAction<string | null>) => {
            state.filterStatus = action.payload
        },
        setFilterCategory: (state, action: PayloadAction<OrgModelLibraryState['filterCategory']>) => {
            state.filterCategory = action.payload
        },
        setSortBy: (state, action: PayloadAction<OrgModelLibraryState['sortBy']>) => {
            state.sortBy = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOrgModels.pending, (state) => {
                state.loading = true
            })
            .addCase(getOrgModels.fulfilled, (state, action) => {
                state.models = action.payload
                state.loading = false
            })
            .addCase(getOrgModels.rejected, (state) => {
                state.loading = false
            })
            // Handle Analytics
            .addCase(getOrgAnalytics.fulfilled, (state, action) => {
                state.analytics = action.payload
            })
            // Handle Toggle
            .addCase(toggleModelEnabled.fulfilled, (state, action) => {
                const model = state.models.find(m => m.id === action.payload.modelId)
                if (model) {
                    model.isEnabled = action.payload.isEnabled
                }
            })
            // Handle Default
            .addCase(setWorkspaceDefault.fulfilled, (state, action) => {
                state.models.forEach(model => {
                    const isNewDefault = model.id === action.payload
                    model.isDefault = isNewDefault
                    model.isWorkspaceDefault = isNewDefault
                })
            })
    }
})

export const {
    setSearchQuery,
    setFilterProvider,
    setFilterCapability,
    setFilterStatus,
    setFilterCategory,
    setSortBy
} = orgModelLibrarySlice.actions

export default orgModelLibrarySlice.reducer
