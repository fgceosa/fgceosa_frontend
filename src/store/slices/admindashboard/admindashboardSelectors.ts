import { createSelector } from '@reduxjs/toolkit'
import { DASHBOARD_STATUS } from './constants'
import type { RootState } from '@/store/rootReducer'

// Local constants for selectors (keep simple)
const AUTO_REFRESH_THRESHOLD = 5 * 60 * 1000 // 5 minutes

// Base selector for admin dashboard state
const selectAdminDashboardState = (state: RootState) => state.adminDashboard

// Basic state selectors
export const selectAdminDashboardData = createSelector(
    selectAdminDashboardState,
    (adminDashboard) => adminDashboard.data
)

export const selectAdminDashboardLoading = createSelector(
    selectAdminDashboardState,
    (adminDashboard) => adminDashboard.loading
)

export const selectAdminDashboardStatus = createSelector(
    selectAdminDashboardState,
    (adminDashboard) => adminDashboard.status
)

export const selectAdminDashboardError = createSelector(
    selectAdminDashboardState,
    (adminDashboard) => adminDashboard.error
)

export const selectAdminDashboardLastFetched = createSelector(
    selectAdminDashboardState,
    (adminDashboard) => adminDashboard.lastFetched
)

// Auto-refresh selectors
export const selectAutoRefreshEnabled = createSelector(
    selectAdminDashboardState,
    (adminDashboard) => adminDashboard.autoRefreshEnabled
)

export const selectRefreshInterval = createSelector(
    selectAdminDashboardState,
    (adminDashboard) => adminDashboard.refreshInterval
)

// Component loading selectors
export const selectComponentLoading = createSelector(
    selectAdminDashboardState,
    (adminDashboard) => adminDashboard.componentLoading
)

export const selectMetricsLoading = createSelector(
    selectComponentLoading,
    (componentLoading) => componentLoading.metrics
)

export const selectWeeklyTrendsLoading = createSelector(
    selectComponentLoading,
    (componentLoading) => componentLoading.weeklyTrends
)

export const selectModelUsageLoading = createSelector(
    selectComponentLoading,
    (componentLoading) => componentLoading.modelUsage
)

export const selectCreditBalanceLoading = createSelector(
    selectComponentLoading,
    (componentLoading) => componentLoading.creditBalance
)

export const selectActiveProjectsLoading = createSelector(
    selectComponentLoading,
    (componentLoading) => componentLoading.activeProjects
)

export const selectCreditHistoryLoading = createSelector(
    selectComponentLoading,
    (componentLoading) => componentLoading.creditHistory
)

export const selectRecentRequestsLoading = createSelector(
    selectComponentLoading,
    (componentLoading) => componentLoading.recentRequests
)

// Data-specific selectors for the new structure
export const selectWeeklyMetrics = createSelector(
    selectAdminDashboardData,
    (data) => data?.weekly
)

export const selectMonthlyMetrics = createSelector(
    selectAdminDashboardData,
    (data) => data?.monthly
)

export const selectAnnualMetrics = createSelector(
    selectAdminDashboardData,
    (data) => data?.annually
)

export const selectWeeklyUsageTrends = createSelector(
    selectAdminDashboardData,
    (data) => data?.weeklyUsageTrends
)

export const selectModelUsageDistribution = createSelector(
    selectAdminDashboardData,
    (data) => data?.modelUsageDistribution
)

export const selectTopWorkspaces = createSelector(
    selectAdminDashboardData,
    (data) => data?.topWorkspaces
)

export const selectActivities = createSelector(
    selectAdminDashboardData,
    (data) => data?.activities
)

export const selectSystemHealth = createSelector(
    selectAdminDashboardData,
    (data) => data?.systemHealth
)

// Computed selectors
export const selectHasDashboardData = createSelector(
    selectAdminDashboardData,
    (data) => data !== null
)

export const selectIsInitialLoading = createSelector(
    [selectAdminDashboardLoading, selectHasDashboardData],
    (loading, hasData) => loading && !hasData
)

export const selectIsRefreshing = createSelector(
    [selectAdminDashboardLoading, selectHasDashboardData],
    (loading, hasData) => loading && hasData
)

export const selectHasError = createSelector(
    selectAdminDashboardError,
    (error) => error !== null
)

export const selectIsSuccessful = createSelector(
    selectAdminDashboardStatus,
    (status) => status === DASHBOARD_STATUS.SUCCEEDED
)

export const selectIsFailed = createSelector(
    selectAdminDashboardStatus,
    (status) => status === DASHBOARD_STATUS.FAILED
)

export const selectIsIdle = createSelector(
    selectAdminDashboardStatus,
    (status) => status === DASHBOARD_STATUS.IDLE
)

// Cache and refresh selectors
export const selectDataAge = createSelector(
    selectAdminDashboardLastFetched,
    (lastFetched) => {
        if (!lastFetched) return null
        return Date.now() - lastFetched
    }
)

export const selectShouldRefreshData = createSelector(
    [selectDataAge, selectAutoRefreshEnabled, selectAdminDashboardLoading],
    (dataAge, autoRefreshEnabled, loading) => {
        if (loading || !autoRefreshEnabled || !dataAge) return false
        return dataAge > AUTO_REFRESH_THRESHOLD
    }
)

export const selectIsDataStale = createSelector(
    selectDataAge,
    (dataAge) => {
        if (!dataAge) return false
        return dataAge > AUTO_REFRESH_THRESHOLD
    }
)

export const selectDataFreshnessPercentage = createSelector(
    selectDataAge,
    (dataAge) => {
        if (!dataAge) return 100
        const maxAge = AUTO_REFRESH_THRESHOLD
        const freshness = Math.max(0, 100 - (dataAge / maxAge) * 100)
        return Math.round(freshness)
    }
)

// Any component loading
export const selectAnyComponentLoading = createSelector(
    selectComponentLoading,
    (componentLoading) => Object.values(componentLoading).some(Boolean)
)

// Dashboard readiness selector
export const selectDashboardReady = createSelector(
    [selectHasDashboardData, selectAdminDashboardError, selectAdminDashboardLoading],
    (hasData, error, loading) => hasData && !error && !loading
)

// Export all selectors as a group for convenience
const adminDashboardSelectors = {
    // Basic selectors
    selectAdminDashboardData,
    selectAdminDashboardLoading,
    selectAdminDashboardStatus,
    selectAdminDashboardError,
    selectAdminDashboardLastFetched,

    // Auto-refresh selectors
    selectAutoRefreshEnabled,
    selectRefreshInterval,

    // Component loading selectors
    selectComponentLoading,
    selectMetricsLoading,
    selectWeeklyTrendsLoading,
    selectModelUsageLoading,
    selectCreditBalanceLoading,
    selectActiveProjectsLoading,
    selectCreditHistoryLoading,
    selectRecentRequestsLoading,
    selectAnyComponentLoading,

    // Data-specific selectors
    selectWeeklyMetrics,
    selectMonthlyMetrics,
    selectAnnualMetrics,
    selectWeeklyUsageTrends,
    selectModelUsageDistribution,

    // Computed selectors
    selectHasDashboardData,
    selectIsInitialLoading,
    selectIsRefreshing,
    selectHasError,
    selectIsSuccessful,
    selectIsFailed,
    selectIsIdle,
    selectDashboardReady,

    // Cache and refresh selectors
    selectDataAge,
    selectShouldRefreshData,
    selectIsDataStale,
    selectDataFreshnessPercentage,
}

export default adminDashboardSelectors
