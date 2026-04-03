// Export the main reducer as default
export { default } from './admindashboardSlice'

// Export all slice actions
export {
    clearDashboardData,
    clearDashboardError,
    setLoading,
    toggleAutoRefresh,
    setRefreshInterval,
    resetDashboardState,
    adminDashboardSlice,
} from './admindashboardSlice'

// Export the state interface
export type { AdminDashboardState } from './admindashboardSlice'

// Export all thunks
export {
    fetchDashboardData,
    fetchDashboardMetrics,
    fetchWeeklyTrends,
    fetchModelUsage,
    fetchCreditBalance,
    fetchActiveProjects,
    fetchCreditHistory,
    fetchRecentRequests,
    adminDashboardThunks,
} from './admindashboardThunk'

// Export all selectors
export {
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
    selectTopWorkspaces,
    selectActivities,
    selectSystemHealth,

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
} from './admindashboardSelectors'

// Export default selectors object
export { default as adminDashboardSelectors } from './admindashboardSelectors'

// Export all constants
export {
    SLICE_BASE_NAME,
    DASHBOARD_STATUS,
} from './constants'

// Export types
export type { DashboardStatus } from './constants'