import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store/rootReducer'
import type { Campaign } from '@/app/(protected-pages)/admin/credits/bulk/types'
import { BULK_CREDITS_STATUS } from './constants'

// ========== Base Selectors ==========

const selectBulkCreditsState = (state: RootState) => state.bulkCredits

// ========== Stats Selectors ==========

export const selectBulkCreditsStats = createSelector(
    [selectBulkCreditsState],
    (bulkCredits) => bulkCredits.stats
)

export const selectTotalBalance = createSelector(
    [selectBulkCreditsStats],
    (stats) => stats.totalBalance
)

export const selectSentCredits = createSelector(
    [selectBulkCreditsStats],
    (stats) => stats.sentCredits
)

export const selectTotalUsers = createSelector(
    [selectBulkCreditsStats],
    (stats) => stats.totalUsers
)

export const selectActiveEvents = createSelector(
    [selectBulkCreditsStats],
    (stats) => stats.activeEvents
)

// ========== Transactions Selectors ==========

export const selectBulkTransactions = createSelector(
    [selectBulkCreditsState],
    (bulkCredits) => bulkCredits.transactions
)

export const selectTransactionsTotal = createSelector(
    [selectBulkCreditsState],
    (bulkCredits) => bulkCredits.transactionsTotal
)

export const selectCurrentTransactionParams = createSelector(
    [selectBulkCreditsState],
    (bulkCredits) => bulkCredits.currentTransactionParams
)

export const selectHasTransactions = createSelector(
    [selectBulkTransactions],
    (transactions) => transactions.length > 0
)

// ========== Campaigns Selectors ==========

export const selectCampaigns = createSelector(
    [selectBulkCreditsState],
    (bulkCredits) => bulkCredits.campaigns
)

export const selectCampaignsTotal = createSelector(
    [selectBulkCreditsState],
    (bulkCredits) => bulkCredits.campaignsTotal
)

export const selectCurrentCampaignParams = createSelector(
    [selectBulkCreditsState],
    (bulkCredits) => bulkCredits.currentCampaignParams
)

export const selectHasCampaigns = createSelector(
    [selectCampaigns],
    (campaigns) => campaigns.length > 0
)

export const selectActiveCampaigns = createSelector(
    [selectCampaigns],
    (campaigns) => campaigns.filter((c: Campaign) => (c.status || '').toLowerCase() === 'active')
)

export const selectCompletedCampaigns = createSelector(
    [selectCampaigns],
    (campaigns) => campaigns.filter((c: Campaign) => (c.status || '').toLowerCase() === 'completed')
)

// ========== Loading State Selectors ==========

export const selectBulkCreditsLoading = createSelector(
    [selectBulkCreditsState],
    (bulkCredits) => bulkCredits.loading
)

export const selectBulkCreditsStatus = createSelector(
    [selectBulkCreditsState],
    (bulkCredits) => bulkCredits.status
)

export const selectComponentLoading = createSelector(
    [selectBulkCreditsState],
    (bulkCredits) => bulkCredits.componentLoading
)

export const selectStatsLoading = createSelector(
    [selectComponentLoading],
    (componentLoading) => componentLoading.stats
)

export const selectTransactionsLoading = createSelector(
    [selectComponentLoading],
    (componentLoading) => componentLoading.transactions
)

export const selectCampaignsLoading = createSelector(
    [selectComponentLoading],
    (componentLoading) => componentLoading.campaigns
)

export const selectSendCreditsLoading = createSelector(
    [selectComponentLoading],
    (componentLoading) => componentLoading.sendCredits
)

export const selectBulkDistributionLoading = createSelector(
    [selectComponentLoading],
    (componentLoading) => componentLoading.bulkDistribution
)

export const selectCampaignActionLoading = createSelector(
    [selectComponentLoading],
    (componentLoading) => componentLoading.campaignAction
)

export const selectAnyComponentLoading = createSelector(
    [selectComponentLoading],
    (componentLoading) =>
        Object.values(componentLoading).some((loading) => loading)
)

// ========== Error Selectors ==========

export const selectBulkCreditsError = createSelector(
    [selectBulkCreditsState],
    (bulkCredits) => bulkCredits.error
)

export const selectHasError = createSelector(
    [selectBulkCreditsError],
    (error) => error !== null
)

// ========== Status Selectors ==========

export const selectIsIdle = createSelector(
    [selectBulkCreditsStatus],
    (status) => status === BULK_CREDITS_STATUS.IDLE
)

export const selectIsLoading = createSelector(
    [selectBulkCreditsStatus],
    (status) => status === BULK_CREDITS_STATUS.LOADING
)

export const selectIsSuccessful = createSelector(
    [selectBulkCreditsStatus],
    (status) => status === BULK_CREDITS_STATUS.SUCCEEDED
)

export const selectIsFailed = createSelector(
    [selectBulkCreditsStatus],
    (status) => status === BULK_CREDITS_STATUS.FAILED
)

// ========== Cache Selectors ==========

export const selectBulkCreditsLastFetched = createSelector(
    [selectBulkCreditsState],
    (bulkCredits) => bulkCredits.lastFetched
)

export const selectBulkCreditsReady = createSelector(
    [selectIsSuccessful, selectHasError],
    (isSuccessful, hasError) => isSuccessful && !hasError
)

// ========== Composite Selectors ==========

export const selectBulkCreditsOverview = createSelector(
    [
        selectBulkCreditsStats,
        selectHasTransactions,
        selectHasCampaigns,
        selectBulkCreditsLoading,
        selectHasError,
    ],
    (stats, hasTransactions, hasCampaigns, loading, hasError) => ({
        stats,
        hasTransactions,
        hasCampaigns,
        loading,
        hasError,
    })
)

// Export default selectors object
const bulkCreditsSelectors = {
    selectBulkCreditsStats,
    selectTotalBalance,
    selectSentCredits,
    selectTotalUsers,
    selectActiveEvents,
    selectBulkTransactions,
    selectTransactionsTotal,
    selectCurrentTransactionParams,
    selectHasTransactions,
    selectCampaigns,
    selectCampaignsTotal,
    selectCurrentCampaignParams,
    selectHasCampaigns,
    selectActiveCampaigns,
    selectCompletedCampaigns,
    selectBulkCreditsLoading,
    selectBulkCreditsStatus,
    selectComponentLoading,
    selectStatsLoading,
    selectTransactionsLoading,
    selectCampaignsLoading,
    selectSendCreditsLoading,
    selectBulkDistributionLoading,
    selectCampaignActionLoading,
    selectAnyComponentLoading,
    selectBulkCreditsError,
    selectHasError,
    selectIsIdle,
    selectIsLoading,
    selectIsSuccessful,
    selectIsFailed,
    selectBulkCreditsLastFetched,
    selectBulkCreditsReady,
    selectBulkCreditsOverview,
}

export default bulkCreditsSelectors
