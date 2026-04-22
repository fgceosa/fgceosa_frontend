import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getAdminStats, getMemberSummary } from './dashboardThunk'
import type { AdminStats, MemberSummary } from '@/services/dashboard/dashboardService'

export interface DashboardState {
    loading: boolean
    error: string | null
    adminStats: AdminStats | null
    memberSummary: MemberSummary | null
}

const initialState: DashboardState = {
    loading: false,
    error: null,
    adminStats: null,
    memberSummary: null,
}

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        clearDashboardError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Admin Stats
            .addCase(getAdminStats.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getAdminStats.fulfilled, (state, action) => {
                state.loading = false
                state.adminStats = action.payload as AdminStats
            })
            .addCase(getAdminStats.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Member Summary
            .addCase(getMemberSummary.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getMemberSummary.fulfilled, (state, action) => {
                state.loading = false
                state.memberSummary = action.payload as MemberSummary
            })
            .addCase(getMemberSummary.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const { clearDashboardError } = dashboardSlice.actions

export default dashboardSlice.reducer
