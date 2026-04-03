import type { RootState } from '../../rootReducer'
import { SHARED_CREDITS_STATUS } from './constants'

// Basic selectors
export const selectSharedCreditsStats = (state: RootState) =>
    state.sharedCredits?.stats ?? {
        availableCredits: 0,
        teamMembers: 0,
        creditsShared: 0,
        totalTransfers: 0,
    }

export const selectAvailableCredits = (state: RootState) =>
    state.sharedCredits?.stats?.availableCredits ?? 0

export const selectCreditTransactions = (state: RootState) =>
    state.sharedCredits?.transactions ?? []

export const selectTransactionsTotal = (state: RootState) =>
    state.sharedCredits?.transactionsTotal ?? 0

export const selectCurrentTransactionParams = (state: RootState) =>
    state.sharedCredits?.currentTransactionParams ?? null

export const selectSharedCreditsLoading = (state: RootState) =>
    state.sharedCredits?.loading ?? false

export const selectSharedCreditsStatus = (state: RootState) =>
    state.sharedCredits?.status ?? SHARED_CREDITS_STATUS.IDLE

export const selectSharedCreditsError = (state: RootState) =>
    state.sharedCredits?.error ?? null

export const selectSharedCreditsLastFetched = (state: RootState) =>
    state.sharedCredits?.lastFetched ?? null

// Component loading selectors
export const selectComponentLoading = (state: RootState) =>
    state.sharedCredits?.componentLoading ?? {
        stats: false,
        transactions: false,
        transfer: false,
    }

export const selectStatsLoading = (state: RootState) =>
    state.sharedCredits?.componentLoading?.stats ?? false

export const selectTransactionsLoading = (state: RootState) =>
    state.sharedCredits?.componentLoading?.transactions ?? false

export const selectTransferLoading = (state: RootState) =>
    state.sharedCredits?.componentLoading?.transfer ?? false

// Computed selectors
export const selectAnyComponentLoading = (state: RootState) => {
    const { stats, transactions, transfer } =
        state.sharedCredits?.componentLoading ?? {
            stats: false,
            transactions: false,
            transfer: false,
        }
    return stats || transactions || transfer
}

export const selectHasTransactions = (state: RootState) =>
    (state.sharedCredits?.transactions?.length ?? 0) > 0

export const selectHasError = (state: RootState) =>
    state.sharedCredits?.error !== null

export const selectIsSuccessful = (state: RootState) =>
    state.sharedCredits?.status === SHARED_CREDITS_STATUS.SUCCEEDED

export const selectIsFailed = (state: RootState) =>
    state.sharedCredits?.status === SHARED_CREDITS_STATUS.FAILED

export const selectIsIdle = (state: RootState) =>
    state.sharedCredits?.status === SHARED_CREDITS_STATUS.IDLE

export const selectSharedCreditsReady = (state: RootState) =>
    !(state.sharedCredits?.loading ?? true) &&
    state.sharedCredits?.lastFetched !== null

// Export default selectors object
export default {
    selectSharedCreditsStats,
    selectAvailableCredits,
    selectCreditTransactions,
    selectTransactionsTotal,
    selectCurrentTransactionParams,
    selectSharedCreditsLoading,
    selectSharedCreditsStatus,
    selectSharedCreditsError,
    selectSharedCreditsLastFetched,
    selectComponentLoading,
    selectStatsLoading,
    selectTransactionsLoading,
    selectTransferLoading,
    selectAnyComponentLoading,
    selectHasTransactions,
    selectHasError,
    selectIsSuccessful,
    selectIsFailed,
    selectIsIdle,
    selectSharedCreditsReady,
}
