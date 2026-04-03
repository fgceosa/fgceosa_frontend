import { createSlice } from '@reduxjs/toolkit'
import {
    fetchBulkCreditsStats,
    fetchBulkTransactions,
    fetchCampaigns,
    sendCredits,
    bulkDistribution,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    fetchCampaignAnalytics,
} from './bulkCreditsThunk'
import { SLICE_BASE_NAME, BULK_CREDITS_STATUS } from './constants'
import type { BulkCreditsStatus } from './constants'
import type { Transaction, Campaign } from '@/app/(protected-pages)/admin/credits/bulk/types'
import type { BulkCreditsStats, TransactionListParams, CampaignListParams } from '@/services/bulkCredits/bulkCreditsService'

// Define the state interface
export interface BulkCreditsState {
    // Statistics
    stats: BulkCreditsStats

    // Transactions list
    transactions: Transaction[]
    transactionsTotal: number

    // Campaigns list
    campaigns: Campaign[]
    campaignsTotal: number

    // Current query params
    currentTransactionParams: TransactionListParams | null
    currentCampaignParams: CampaignListParams | null

    // Loading states
    loading: boolean
    status: BulkCreditsStatus

    // Error handling
    error: string | null

    // Cache management
    lastFetched: number | null

    // Individual component loading states
    componentLoading: {
        stats: boolean
        transactions: boolean
        campaigns: boolean
        sendCredits: boolean
        bulkDistribution: boolean
        campaignAction: boolean
    }
}

// Initial state
const initialState: BulkCreditsState = {
    stats: {
        totalBalance: 0,
        sentCredits: 0,
        totalUsers: 0,
        activeEvents: 0,
    },
    transactions: [],
    transactionsTotal: 0,
    campaigns: [],
    campaignsTotal: 0,
    currentTransactionParams: null,
    currentCampaignParams: null,
    loading: false,
    status: BULK_CREDITS_STATUS.IDLE,
    error: null,
    lastFetched: null,
    componentLoading: {
        stats: false,
        transactions: false,
        campaigns: false,
        sendCredits: false,
        bulkDistribution: false,
        campaignAction: false,
    },
}

// Create the slice
const bulkCreditsSlice = createSlice({
    name: SLICE_BASE_NAME,
    initialState,
    reducers: {
        // Clear error
        clearError: (state) => {
            state.error = null
            if (state.status === BULK_CREDITS_STATUS.FAILED) {
                state.status = BULK_CREDITS_STATUS.IDLE
            }
        },

        // Reset state
        resetBulkCreditsState: () => initialState,

        // Clear transactions
        clearTransactions: (state) => {
            state.transactions = []
            state.transactionsTotal = 0
            state.currentTransactionParams = null
        },

        // Clear campaigns
        clearCampaigns: (state) => {
            state.campaigns = []
            state.campaignsTotal = 0
            state.currentCampaignParams = null
        },
    },
    extraReducers: (builder) => {
        // ========== Fetch Stats ==========
        builder
            .addCase(fetchBulkCreditsStats.pending, (state) => {
                state.componentLoading.stats = true
                state.loading = true
                state.status = BULK_CREDITS_STATUS.LOADING
                state.error = null
            })
            .addCase(fetchBulkCreditsStats.fulfilled, (state, action) => {
                state.componentLoading.stats = false
                state.loading = false
                state.status = BULK_CREDITS_STATUS.SUCCEEDED
                state.stats = action.payload
                state.lastFetched = Date.now()
            })
            .addCase(fetchBulkCreditsStats.rejected, (state, action) => {
                state.componentLoading.stats = false
                state.loading = false
                state.status = BULK_CREDITS_STATUS.FAILED
                state.error = action.payload as string
            })

        // ========== Fetch Transactions ==========
        builder
            .addCase(fetchBulkTransactions.pending, (state, action) => {
                state.componentLoading.transactions = true
                state.loading = true
                state.status = BULK_CREDITS_STATUS.LOADING
                state.error = null
                state.currentTransactionParams = action.meta.arg
            })
            .addCase(fetchBulkTransactions.fulfilled, (state, action) => {
                state.componentLoading.transactions = false
                state.loading = false
                state.status = BULK_CREDITS_STATUS.SUCCEEDED
                state.transactions = action.payload?.transactions || []
                state.transactionsTotal = action.payload?.total || 0
                state.lastFetched = Date.now()
            })
            .addCase(fetchBulkTransactions.rejected, (state, action) => {
                state.componentLoading.transactions = false
                state.loading = false
                state.status = BULK_CREDITS_STATUS.FAILED
                state.error = action.payload as string
            })

        // ========== Fetch Campaigns ==========
        builder
            .addCase(fetchCampaigns.pending, (state, action) => {
                state.componentLoading.campaigns = true
                state.loading = true
                state.status = BULK_CREDITS_STATUS.LOADING
                state.error = null
                state.currentCampaignParams = action.meta.arg
            })
            .addCase(fetchCampaigns.fulfilled, (state, action) => {
                state.componentLoading.campaigns = false
                state.loading = false
                state.status = BULK_CREDITS_STATUS.SUCCEEDED
                state.campaigns = action.payload?.campaigns || []
                state.campaignsTotal = action.payload?.total || 0
                state.lastFetched = Date.now()
            })
            .addCase(fetchCampaigns.rejected, (state, action) => {
                state.componentLoading.campaigns = false
                state.loading = false
                state.status = BULK_CREDITS_STATUS.FAILED
                state.error = action.payload as string
            })

        // ========== Send Credits ==========
        builder
            .addCase(sendCredits.pending, (state) => {
                state.componentLoading.sendCredits = true
                state.loading = true
                state.status = BULK_CREDITS_STATUS.LOADING
                state.error = null
            })
            .addCase(sendCredits.fulfilled, (state) => {
                state.componentLoading.sendCredits = false
                state.loading = false
                state.status = BULK_CREDITS_STATUS.SUCCEEDED
            })
            .addCase(sendCredits.rejected, (state, action) => {
                state.componentLoading.sendCredits = false
                state.loading = false
                state.status = BULK_CREDITS_STATUS.FAILED
                state.error = action.payload as string
            })

        // ========== Bulk Distribution ==========
        builder
            .addCase(bulkDistribution.pending, (state) => {
                state.componentLoading.bulkDistribution = true
                state.loading = true
                state.status = BULK_CREDITS_STATUS.LOADING
                state.error = null
            })
            .addCase(bulkDistribution.fulfilled, (state) => {
                state.componentLoading.bulkDistribution = false
                state.loading = false
                state.status = BULK_CREDITS_STATUS.SUCCEEDED
            })
            .addCase(bulkDistribution.rejected, (state, action) => {
                state.componentLoading.bulkDistribution = false
                state.loading = false
                state.status = BULK_CREDITS_STATUS.FAILED
                state.error = action.payload as string
            })

        // ========== Create Campaign ==========
        builder
            .addCase(createCampaign.pending, (state) => {
                state.componentLoading.campaignAction = true
                state.loading = true
                state.status = BULK_CREDITS_STATUS.LOADING
                state.error = null
            })
            .addCase(createCampaign.fulfilled, (state, action) => {
                state.componentLoading.campaignAction = false
                state.loading = false
                state.status = BULK_CREDITS_STATUS.SUCCEEDED
                // Add new campaign to the list
                state.campaigns.unshift(action.payload)
                state.campaignsTotal += 1
            })
            .addCase(createCampaign.rejected, (state, action) => {
                state.componentLoading.campaignAction = false
                state.loading = false
                state.status = BULK_CREDITS_STATUS.FAILED
                state.error = action.payload as string
            })

        // ========== Update Campaign ==========
        builder
            .addCase(updateCampaign.pending, (state) => {
                state.componentLoading.campaignAction = true
                state.loading = true
                state.status = BULK_CREDITS_STATUS.LOADING
                state.error = null
            })
            .addCase(updateCampaign.fulfilled, (state, action) => {
                state.componentLoading.campaignAction = false
                state.loading = false
                state.status = BULK_CREDITS_STATUS.SUCCEEDED
                // Update campaign in the list
                const index = state.campaigns.findIndex(c => c.id === action.payload.id)
                if (index !== -1) {
                    state.campaigns[index] = action.payload
                }
            })
            .addCase(updateCampaign.rejected, (state, action) => {
                state.componentLoading.campaignAction = false
                state.loading = false
                state.status = BULK_CREDITS_STATUS.FAILED
                state.error = action.payload as string
            })

        // ========== Delete Campaign ==========
        builder
            .addCase(deleteCampaign.pending, (state) => {
                state.componentLoading.campaignAction = true
                state.loading = true
                state.status = BULK_CREDITS_STATUS.LOADING
                state.error = null
            })
            .addCase(deleteCampaign.fulfilled, (state, action) => {
                state.componentLoading.campaignAction = false
                state.loading = false
                state.status = BULK_CREDITS_STATUS.SUCCEEDED
                // Remove campaign from the list
                state.campaigns = state.campaigns.filter(c => c.id !== action.payload.id)
                state.campaignsTotal -= 1
            })
            .addCase(deleteCampaign.rejected, (state, action) => {
                state.componentLoading.campaignAction = false
                state.loading = false
                state.status = BULK_CREDITS_STATUS.FAILED
                state.error = action.payload as string
            })

        // ========== Fetch Analytics ==========
        builder
            .addCase(fetchCampaignAnalytics.pending, (state) => {
                state.status = BULK_CREDITS_STATUS.LOADING
                state.error = null
            })
            .addCase(fetchCampaignAnalytics.rejected, (state, action) => {
                state.status = BULK_CREDITS_STATUS.FAILED
                state.error = action.payload as string
            })
    },
})

// Export actions
export const {
    clearError,
    resetBulkCreditsState,
    clearTransactions,
    clearCampaigns,
} = bulkCreditsSlice.actions

// Export slice
export { bulkCreditsSlice }

// Export reducer as default
export default bulkCreditsSlice.reducer
