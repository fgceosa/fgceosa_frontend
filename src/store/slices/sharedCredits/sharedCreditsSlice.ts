import { createSlice } from '@reduxjs/toolkit'
import {
    fetchSharedCreditsStats,
    fetchCreditTransactions,
    transferCredits,
} from './sharedCreditsThunk'
import { SLICE_BASE_NAME, SHARED_CREDITS_STATUS } from './constants'
import type {
    SharedCreditsStats,
    CreditTransaction,
} from '@/app/(protected-pages)/dashboard/shared-credits/types'
import type { SharedCreditsStatus } from './constants'
import type { TransactionListParams } from '@/services/sharedCredits/sharedCreditsService'

// Define the state interface
export interface SharedCreditsState {
    // Statistics
    stats: SharedCreditsStats

    // Transactions list
    transactions: CreditTransaction[]
    transactionsTotal: number

    // Current query params for transactions
    currentTransactionParams: TransactionListParams | null

    // Loading states
    loading: boolean
    status: SharedCreditsStatus

    // Error handling
    error: string | null

    // Cache management
    lastFetched: number | null

    // Individual component loading states
    componentLoading: {
        stats: boolean
        transactions: boolean
        transfer: boolean
    }
}

// Initial state
const initialState: SharedCreditsState = {
    stats: {
        availableCredits: 0,
        totalRecipients: 0,
        creditsShared: 0,
        totalTransfers: 0,
        costNaira: 0,
    },
    transactions: [],
    transactionsTotal: 0,
    currentTransactionParams: null,
    loading: false,
    status: SHARED_CREDITS_STATUS.IDLE,
    error: null,
    lastFetched: null,
    componentLoading: {
        stats: false,
        transactions: false,
        transfer: false,
    },
}

// Create the slice
const sharedCreditsSlice = createSlice({
    name: SLICE_BASE_NAME,
    initialState,
    reducers: {
        // Clear error
        clearError: (state) => {
            state.error = null
            if (state.status === SHARED_CREDITS_STATUS.FAILED) {
                state.status = SHARED_CREDITS_STATUS.IDLE
            }
        },

        // Reset state
        resetSharedCreditsState: () => initialState,
    },
    extraReducers: (builder) => {
        // ========== Fetch Stats ==========
        builder
            .addCase(fetchSharedCreditsStats.pending, (state) => {
                state.componentLoading.stats = true
                state.loading = true
                state.status = SHARED_CREDITS_STATUS.LOADING
                state.error = null
            })
            .addCase(fetchSharedCreditsStats.fulfilled, (state, action) => {
                state.componentLoading.stats = false
                state.loading = false
                state.status = SHARED_CREDITS_STATUS.SUCCEEDED
                state.stats = action.payload
                state.lastFetched = Date.now()
            })
            .addCase(fetchSharedCreditsStats.rejected, (state, action) => {
                state.componentLoading.stats = false
                state.loading = false
                state.status = SHARED_CREDITS_STATUS.FAILED
                state.error = action.payload as string
            })

        // ========== Fetch Transactions ==========
        builder
            .addCase(fetchCreditTransactions.pending, (state, action) => {
                state.componentLoading.transactions = true
                state.loading = true
                state.status = SHARED_CREDITS_STATUS.LOADING
                state.error = null
                state.currentTransactionParams = action.meta.arg
            })
            .addCase(fetchCreditTransactions.fulfilled, (state, action) => {
                state.componentLoading.transactions = false
                state.loading = false
                state.status = SHARED_CREDITS_STATUS.SUCCEEDED
                state.transactions = action.payload?.transactions || []
                state.transactionsTotal = action.payload?.total || 0
                state.lastFetched = Date.now()
            })
            .addCase(fetchCreditTransactions.rejected, (state, action) => {
                state.componentLoading.transactions = false
                state.loading = false
                state.status = SHARED_CREDITS_STATUS.FAILED
                state.error = action.payload as string
            })

        // ========== Transfer Credits ==========
        builder
            .addCase(transferCredits.pending, (state) => {
                state.componentLoading.transfer = true
                state.loading = true
                state.status = SHARED_CREDITS_STATUS.LOADING
                state.error = null
            })
            .addCase(transferCredits.fulfilled, (state) => {
                state.componentLoading.transfer = false
                state.loading = false
                state.status = SHARED_CREDITS_STATUS.SUCCEEDED
            })
            .addCase(transferCredits.rejected, (state, action) => {
                state.componentLoading.transfer = false
                state.loading = false
                state.status = SHARED_CREDITS_STATUS.FAILED
                state.error = action.payload as string
            })
    },
})

// Export actions
export const { clearError, resetSharedCreditsState } = sharedCreditsSlice.actions

// Export slice
export { sharedCreditsSlice }

// Export reducer as default
export default sharedCreditsSlice.reducer
