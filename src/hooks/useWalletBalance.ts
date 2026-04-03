/**
 * useWalletBalance Hook
 *
 * Custom React hook for managing wallet balance with automatic refresh
 * Features:
 * - Auto-fetch on mount
 * - Manual refresh capability
 * - Loading and error states
 * - Automatic retry on error
 */

import { useState, useEffect, useCallback } from 'react'
import { AIEngineService } from '@/services/AIEngineService'

interface WalletBalance {
    ai_credits: number
    naira_equivalent: number
    conversion_rate: number
    last_updated: string
}

interface UseWalletBalanceReturn {
    balance: WalletBalance | null
    isLoading: boolean
    error: string | null
    refresh: () => Promise<void>
    testTopUp: (amount?: number) => Promise<void>
}

export const useWalletBalance = (autoRefresh = false, refreshInterval = 30000): UseWalletBalanceReturn => {
    const [balance, setBalance] = useState<WalletBalance | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const fetchBalance = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)
            const data = await AIEngineService.getCreditBalance()
            setBalance(data)
        } catch (err: any) {
            const errorMessage = err?.response?.data?.detail || err?.message || 'Failed to fetch wallet balance'
            setError(errorMessage)
            console.error('Error fetching wallet balance:', err)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const refresh = useCallback(async () => {
        await fetchBalance()
    }, [fetchBalance])

    const testTopUp = useCallback(async (amount = 5000) => {
        try {
            setIsLoading(true)
            setError(null)
            const result = await AIEngineService.testTopUp(amount)

            // Update balance with new balance from response
            if (result.new_balance) {
                setBalance({
                    ai_credits: result.new_balance.ai_credits,
                    naira_equivalent: result.new_balance.naira_equivalent,
                    conversion_rate: result.new_balance.conversion_rate,
                    last_updated: new Date().toISOString(),
                })
            } else {
                // Fallback: refresh balance
                await fetchBalance()
            }
        } catch (err: any) {
            const errorMessage = err?.response?.data?.detail || err?.message || 'Test top-up failed'
            setError(errorMessage)
            console.error('Error during test top-up:', err)
        } finally {
            setIsLoading(false)
        }
    }, [fetchBalance])

    // Initial fetch on mount
    useEffect(() => {
        fetchBalance()
    }, [fetchBalance])

    // Auto-refresh if enabled
    useEffect(() => {
        if (!autoRefresh) return

        const interval = setInterval(() => {
            if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
                fetchBalance()
            }
        }, refreshInterval)

        return () => clearInterval(interval)
    }, [autoRefresh, refreshInterval, fetchBalance])

    return {
        balance,
        isLoading,
        error,
        refresh,
        testTopUp,
    }
}
