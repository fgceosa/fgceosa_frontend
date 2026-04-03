/**
 * useWalletRedux Hook
 *
 * Custom React hook for wallet management using Redux Toolkit
 * Features:
 * - Auto-fetch on mount
 * - Auto-refresh at intervals
 * - Refresh on window focus
 * - Manual refresh capability
 * - Test top-up functionality
 */

import { useEffect, useCallback, useRef } from 'react'
import { AIEngineService } from '@/services/AIEngineService'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import {
    fetchWalletBalanceAsync,
    testTopUpAsync,
    fetchOrganizationWalletBalanceAsync,
} from '@/store/slices/wallet'
import { setLoading } from '@/store/slices/aiEngine/aiEngineSlice'
import {
    selectWalletBalance,
    selectWalletLoading,
    selectWalletError,
    selectFormattedNairaBalance,
    selectOrganizationCredits,
} from '@/store/slices/wallet'

interface UseWalletOptions {
    /**
     * Auto-refresh interval in milliseconds
     * Set to 0 to disable auto-refresh
     * @default 30000 (30 seconds)
     */
    autoRefreshInterval?: number

    /**
     * Refresh when window gains focus
     * @default true
     */
    refreshOnFocus?: boolean

    /**
     * Fetch on mount
     * @default true
     */
    fetchOnMount?: boolean

    /**
     * Organization ID to fetch balance for
     */
    organizationId?: string
}

/**
 * Hook to manage wallet balance with Redux
 *
 * @example
 * ```tsx
 * const { balance, isLoading, refresh, testTopUp } = useWalletRedux()
 *
 * // Display balance
 * <div>₦{balance.naira_equivalent}</div>
 *
 * // Test top-up
 * <button onClick={() => testTopUp(5000)}>Add ₦5,000</button>
 *
 * // Manual refresh
 * <button onClick={refresh}>Refresh</button>
 * ```
 */
export const useWalletRedux = (options: UseWalletOptions = {}) => {
    const {
        autoRefreshInterval = 30000, // 30 seconds
        refreshOnFocus = true,
        fetchOnMount = true,
        organizationId,
    } = options

    const dispatch = useAppDispatch()

    // Selectors
    const balance = useAppSelector(selectWalletBalance)
    const organizationBalance = useAppSelector(selectOrganizationCredits)
    const isLoading = useAppSelector(selectWalletLoading)
    const error = useAppSelector(selectWalletError)
    const formattedBalance = useAppSelector(selectFormattedNairaBalance)

    // Refs for intervals
    const refreshIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)
    const isMountedRef = useRef(true)

    /**
     * Refreshes wallet balance, optionally silently.
     * @param isSilent If true, no loading state is shown.
     */
    const refreshWallet = useCallback(async (isSilent = false) => {
        try {
            if (!isSilent) {
                dispatch(setLoading(true))
            }

            // Fetch personal balance
            // We don't unwrap here for silent refreshes to avoid console clutter from Condition skips
            await dispatch(fetchWalletBalanceAsync({ silent: true }))

            // Fetch organization balance if applicable
            if (organizationId) {
                await dispatch(fetchOrganizationWalletBalanceAsync({
                    organizationId,
                    silent: true,
                }))
            }
        } catch (err: any) {
            // Ignore abort errors from Redux Toolkit condition checks - they are expected
            if (err?.name === 'ConditionError' || err?.message?.includes('Aborted due to condition')) {
                return
            }
            console.error('Failed to refresh wallet:', err)
        } finally {
            if (!isMountedRef.current) return
            if (!isSilent) {
                dispatch(setLoading(false))
            }
        }
    }, [dispatch, organizationId])

    /**
     * Manual refresh (with loading state)
     */
    const refresh = useCallback(() => refreshWallet(false), [refreshWallet])

    /**
     * Silent refresh (no loading state)
     */
    const refreshSilent = useCallback(() => refreshWallet(true), [refreshWallet])

    /**
     * Test top-up
     */
    const testTopUp = useCallback(
        async (amount: number = 5000) => {
            return await dispatch(testTopUpAsync(amount)).unwrap()
        },
        [dispatch],
    )

    // Initial fetch on mount + auto-verify any pending paid topups
    useEffect(() => {
        isMountedRef.current = true
        if (fetchOnMount) {
            refreshWallet(false)

            // Silently check Flutterwave for any completed payments
            // This catches cases where user closed the modal before polling finished
            AIEngineService.verifyPendingTopUps(organizationId)
                .then((result) => {
                    if (result.credits_applied && isMountedRef.current) {
                        console.log(`Auto-applied credits from ${result.credited.length} pending topup(s)`)
                        // Refresh balance now that credits have been applied
                        refreshWallet(true)
                        triggerWalletRefresh()
                    }
                })
                .catch(() => {
                    // Silent failure - this is a background check
                })
        }

        return () => {
            isMountedRef.current = false
        }
    }, [fetchOnMount, refreshWallet, organizationId])

    // Auto-refresh at interval
    useEffect(() => {
        if (!autoRefreshInterval || autoRefreshInterval === 0) return

        // Clear existing interval
        if (refreshIntervalRef.current) {
            clearInterval(refreshIntervalRef.current)
        }

        // Set new interval — only fires when the tab is visible to avoid
        // hammering a sleeping backend during idle time
        refreshIntervalRef.current = setInterval(() => {
            if (isMountedRef.current && typeof document !== 'undefined' && document.visibilityState === 'visible') {
                refreshSilent()
            }
        }, autoRefreshInterval)

        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current)
            }
        }
    }, [autoRefreshInterval, refreshSilent])

    // Refresh on window focus
    useEffect(() => {
        if (!refreshOnFocus) return

        const handleFocus = () => {
            if (isMountedRef.current) {
                refreshSilent()
            }
        }

        window.addEventListener('focus', handleFocus)
        return () => window.removeEventListener('focus', handleFocus)
    }, [refreshOnFocus, refreshSilent])

    // Listen for custom wallet update events
    useEffect(() => {
        const handleWalletUpdate = () => {
            if (isMountedRef.current) {
                refreshSilent()
            }
        }

        window.addEventListener('wallet-updated', handleWalletUpdate)
        return () => window.removeEventListener('wallet-updated', handleWalletUpdate)
    }, [refreshSilent])

    return {
        balance,
        organizationBalance,
        isLoading,
        error,
        formattedBalance,
        refresh,
        testTopUp,
    }
}

/**
 * Trigger wallet refresh from anywhere in the app
 *
 * Usage:
 * ```tsx
 * import { triggerWalletRefresh } from '@/hooks/useWalletRedux'
 *
 * // After adding credits
 * await addCredits()
 * triggerWalletRefresh()
 * ```
 */
export const triggerWalletRefresh = () => {
    window.dispatchEvent(new Event('wallet-updated'))
}
