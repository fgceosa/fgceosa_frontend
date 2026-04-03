import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'
import { compAdminGetCopilots } from './platformCopilotThunk'
import type { Copilot } from '@/app/(protected-pages)/dashboard/copilot-hub/types'

export type PlatformCopilotState = {
    loading: boolean
    copilotList: Copilot[]
    total: number
    filter: {
        skip: number
        limit: number
        search: string
        category: string
        visibility: string
        workspaceId: string
        isFeatured: boolean | undefined
    }
}

export const initialFilterState = {
    skip: 0,
    limit: 25,
    search: '',
    category: '',
    visibility: '',
    workspaceId: '',
    isFeatured: undefined
}

const initialState: PlatformCopilotState = {
    loading: false,
    copilotList: [],
    total: 0,
    filter: initialFilterState
}

export const platformCopilotSlice = createSlice({
    name: SLICE_BASE_NAME,
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<Partial<PlatformCopilotState['filter']>>) => {
            state.filter = { ...state.filter, ...action.payload }
        },
        resetFilter: (state) => {
            state.filter = initialFilterState
        },
        setCopilotList: (state, action: PayloadAction<Copilot[]>) => {
            state.copilotList = action.payload
        },
        cleanupPlatformCopilotState: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(compAdminGetCopilots.pending, (state) => {
                state.loading = true
            })
            .addCase(compAdminGetCopilots.fulfilled, (state, action) => {
                state.loading = false
                state.copilotList = action.payload.copilots
                state.total = action.payload.total
            })
            .addCase(compAdminGetCopilots.rejected, (state) => {
                state.loading = false
                state.copilotList = []
                state.total = 0
            })
    }
})

export const { setFilter, resetFilter, setCopilotList, cleanupPlatformCopilotState } = platformCopilotSlice.actions
export default platformCopilotSlice.reducer
