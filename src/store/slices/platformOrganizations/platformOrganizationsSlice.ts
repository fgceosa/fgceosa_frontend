import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'
import {
    getPlatformOrgAnalytics,
    getPlatformOrganizations
} from './platformOrganizationsThunk'
import {
    PlatformOrganizationsState,
    initialFilterState
} from './types'

const initialState: PlatformOrganizationsState = {
    loading: false,
    analyticsLoading: false,
    organizations: [],
    analytics: undefined,
    total: 0,
    filter: initialFilterState
}

export const platformOrganizationsSlice = createSlice({
    name: SLICE_BASE_NAME,
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<Partial<PlatformOrganizationsState['filter']>>) => {
            state.filter = { ...state.filter, ...action.payload }
        },
        resetFilter: (state) => {
            state.filter = initialFilterState
        },
        cleanupPlatformOrganizationsState: () => initialState
    },
    extraReducers: (builder) => {
        builder
            // Analytics
            .addCase(getPlatformOrgAnalytics.pending, (state) => {
                state.analyticsLoading = true
            })
            .addCase(getPlatformOrgAnalytics.fulfilled, (state, action) => {
                state.analyticsLoading = false
                state.analytics = action.payload
            })
            .addCase(getPlatformOrgAnalytics.rejected, (state) => {
                state.analyticsLoading = false
            })
            // Organizations List
            .addCase(getPlatformOrganizations.pending, (state) => {
                state.loading = true
            })
            .addCase(getPlatformOrganizations.fulfilled, (state, action) => {
                state.loading = false
                state.organizations = action.payload.list
                state.total = action.payload.total
            })
            .addCase(getPlatformOrganizations.rejected, (state) => {
                state.loading = false
            })
    }
})

export const {
    setFilter,
    resetFilter,
    cleanupPlatformOrganizationsState
} = platformOrganizationsSlice.actions

export default platformOrganizationsSlice.reducer
