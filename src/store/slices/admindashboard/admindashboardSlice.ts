import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
    fetchDashboardData,
    fetchDashboardMetrics,
    fetchWeeklyTrends,
    fetchModelUsage,
    fetchCreditBalance,
    fetchActiveProjects,
    fetchCreditHistory,
    fetchRecentRequests,
} from './admindashboardThunk'
import { SLICE_BASE_NAME, DASHBOARD_STATUS } from './constants'
import type { DashboardData } from '@/app/(protected-pages)/admin-dashboard/types'
import type { DashboardStatus } from './constants'

// Define the state interface
export interface AdminDashboardState {
    // Main dashboard data
    data: DashboardData | null

    // Loading states
    loading: boolean
    status: DashboardStatus

    // Error handling
    error: string | null

    // Cache management
    lastFetched: number | null

    // Individual component loading states (for granular loading indicators)
    componentLoading: {
        metrics: boolean
        weeklyTrends: boolean
        modelUsage: boolean
        creditBalance: boolean
        activeProjects: boolean
        creditHistory: boolean
        recentRequests: boolean
    }

    // Auto-refresh settings
    autoRefreshEnabled: boolean
    refreshInterval: number | null
}

// Initial state
const initialState: AdminDashboardState = {
    data: null,
    loading: false,
    status: DASHBOARD_STATUS.IDLE,
    error: null,
    lastFetched: null,
    componentLoading: {
        metrics: false,
        weeklyTrends: false,
        modelUsage: false,
        creditBalance: false,
        activeProjects: false,
        creditHistory: false,
        recentRequests: false,
    },
    autoRefreshEnabled: true,
    refreshInterval: null,
}

// Create the slice
const adminDashboardSlice = createSlice({
    name: SLICE_BASE_NAME,
    initialState,
    reducers: {
        // Clear all dashboard data
        clearDashboardData: (state) => {
            state.data = null
            state.error = null
            state.lastFetched = null
            state.status = DASHBOARD_STATUS.IDLE
        },

        // Clear dashboard error
        clearDashboardError: (state) => {
            state.error = null
            if (state.status === DASHBOARD_STATUS.FAILED) {
                state.status = DASHBOARD_STATUS.IDLE
            }
        },

        // Set loading state manually
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
            state.status = action.payload ? DASHBOARD_STATUS.LOADING : DASHBOARD_STATUS.IDLE
        },

        // Toggle auto-refresh
        toggleAutoRefresh: (state, action: PayloadAction<boolean>) => {
            state.autoRefreshEnabled = action.payload
        },

        // Set refresh interval
        setRefreshInterval: (state, action: PayloadAction<number | null>) => {
            state.refreshInterval = action.payload
        },

        // Reset dashboard state to initial
        resetDashboardState: () => initialState,
    },
    extraReducers: (builder) => {
        // Handle fetchDashboardData (main dashboard endpoint)
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.loading = true
                state.status = DASHBOARD_STATUS.LOADING
                state.error = null
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.loading = false
                state.status = DASHBOARD_STATUS.SUCCEEDED
                state.data = action.payload
                state.error = null
                state.lastFetched = Date.now()
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.loading = false
                state.status = DASHBOARD_STATUS.FAILED
                state.error = action.payload as string
            })

        // Handle fetchDashboardMetrics
        builder
            .addCase(fetchDashboardMetrics.pending, (state) => {
                state.componentLoading.metrics = true
            })
            .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
                state.componentLoading.metrics = false
                if (state.data) {
                    const period = action.meta.arg // 'week' | 'month' | 'year'
                    if (period === 'week') state.data.weekly = action.payload
                    if (period === 'month') state.data.monthly = action.payload
                    if (period === 'year') state.data.annually = action.payload
                }
                state.lastFetched = Date.now()
            })
            .addCase(fetchDashboardMetrics.rejected, (state, action) => {
                state.componentLoading.metrics = false
                state.error = action.payload as string
            })

        // Handle fetchWeeklyTrends
        builder
            .addCase(fetchWeeklyTrends.pending, (state) => {
                state.componentLoading.weeklyTrends = true
            })
            .addCase(fetchWeeklyTrends.fulfilled, (state, action) => {
                state.componentLoading.weeklyTrends = false
                if (state.data) {
                    state.data.weeklyUsageTrends = action.payload
                }
                state.lastFetched = Date.now()
            })
            .addCase(fetchWeeklyTrends.rejected, (state, action) => {
                state.componentLoading.weeklyTrends = false
                state.error = action.payload as string
            })

        // Handle fetchModelUsage
        builder
            .addCase(fetchModelUsage.pending, (state) => {
                state.componentLoading.modelUsage = true
            })
            .addCase(fetchModelUsage.fulfilled, (state, action) => {
                state.componentLoading.modelUsage = false
                if (state.data) {
                    state.data.modelUsageDistribution = action.payload
                }
                state.lastFetched = Date.now()
            })
            .addCase(fetchModelUsage.rejected, (state, action) => {
                state.componentLoading.modelUsage = false
                state.error = action.payload as string
            })

        // Handle fetchCreditBalance
        builder
            .addCase(fetchCreditBalance.pending, (state) => {
                state.componentLoading.creditBalance = true
            })
            .addCase(fetchCreditBalance.fulfilled, (state) => {
                state.componentLoading.creditBalance = false
                state.lastFetched = Date.now()
            })
            .addCase(fetchCreditBalance.rejected, (state, action) => {
                state.componentLoading.creditBalance = false
                state.error = action.payload as string
            })

        // Handle fetchActiveProjects
        builder
            .addCase(fetchActiveProjects.pending, (state) => {
                state.componentLoading.activeProjects = true
            })
            .addCase(fetchActiveProjects.fulfilled, (state) => {
                state.componentLoading.activeProjects = false
                state.lastFetched = Date.now()
            })
            .addCase(fetchActiveProjects.rejected, (state, action) => {
                state.componentLoading.activeProjects = false
                state.error = action.payload as string
            })

        // Handle fetchCreditHistory
        builder
            .addCase(fetchCreditHistory.pending, (state) => {
                state.componentLoading.creditHistory = true
            })
            .addCase(fetchCreditHistory.fulfilled, (state) => {
                state.componentLoading.creditHistory = false
                state.lastFetched = Date.now()
            })
            .addCase(fetchCreditHistory.rejected, (state, action) => {
                state.componentLoading.creditHistory = false
                state.error = action.payload as string
            })

        // Handle fetchRecentRequests
        builder
            .addCase(fetchRecentRequests.pending, (state) => {
                state.componentLoading.recentRequests = true
            })
            .addCase(fetchRecentRequests.fulfilled, (state) => {
                state.componentLoading.recentRequests = false
                state.lastFetched = Date.now()
            })
            .addCase(fetchRecentRequests.rejected, (state, action) => {
                state.componentLoading.recentRequests = false
                state.error = action.payload as string
            })
    },
})

// Export actions
export const {
    clearDashboardData,
    clearDashboardError,
    setLoading,
    toggleAutoRefresh,
    setRefreshInterval,
    resetDashboardState,
} = adminDashboardSlice.actions

// Export reducer
export default adminDashboardSlice.reducer

// Export the slice for testing purposes
export { adminDashboardSlice }