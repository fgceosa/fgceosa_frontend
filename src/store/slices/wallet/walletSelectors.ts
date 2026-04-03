/**
 * Wallet Selectors
 *
 * Memoized selectors for wallet balance and state
 */

import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../rootReducer'
import { NAIRA_TO_CREDIT_RATE, NAIRA_TO_USD_RATE } from '@/constants/currency.constant'

// Base selector
const selectAIEngine = (state: RootState) => state.aiEngine

/**
 * Select wallet balance
 * Returns balance in both AI credits and Naira equivalent
 */
export const selectWalletBalance = createSelector(
    [selectAIEngine],
    (aiEngine) => {
        if (!aiEngine.credits) {
            return {
                ai_credits: 0,
                naira_equivalent: 0,
                conversion_rate: NAIRA_TO_CREDIT_RATE,
                last_updated: null,
            }
        }

        return {
            ai_credits: aiEngine.credits.aiCredits || 0,
            naira_equivalent: aiEngine.credits.nairaBalance || 0,
            conversion_rate: NAIRA_TO_CREDIT_RATE, // ₦1,650 = 1 credit
            last_updated: aiEngine.credits.lastUpdated || null,
        }
    },
)

/**
 * Select organization wallet balance
 */
export const selectOrganizationCredits = createSelector(
    [selectAIEngine],
    (aiEngine) => aiEngine.organizationCredits
)

/**
 * Select only Naira balance
 */
export const selectNairaBalance = createSelector(
    [selectWalletBalance],
    (balance) => balance.naira_equivalent
)

/**
 * Select only AI credits
 */
export const selectAICredits = createSelector(
    [selectWalletBalance],
    (balance) => balance.ai_credits
)

/**
 * Select wallet loading state
 */
export const selectWalletLoading = createSelector(
    [selectAIEngine],
    (aiEngine) => aiEngine.isLoading
)

/**
 * Select wallet error
 */
export const selectWalletError = createSelector(
    [selectAIEngine],
    (aiEngine) => aiEngine.error
)

/**
 * Select if wallet has sufficient credits
 */
export const selectHasSufficientCredits = (requiredCredits: number) =>
    createSelector([selectAICredits], (credits) => credits >= requiredCredits)

/**
 * Select formatted Naira balance with currency symbol
 */
export const selectFormattedNairaBalance = createSelector(
    [selectNairaBalance],
    (balance) => {
        return new Intl.NumberFormat('en-NG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(balance)
    }
)

/**
 * Select last sync timestamp
 */
export const selectLastSync = createSelector(
    [selectAIEngine],
    (aiEngine) => aiEngine.lastSyncTimestamp
)
