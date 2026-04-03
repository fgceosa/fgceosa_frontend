/**
 * Wallet Async Thunks
 *
 * Handles async operations for wallet balance and top-ups
 * with auto-refresh functionality
 */

import { createAsyncThunk } from '@reduxjs/toolkit'
import { AIEngineService } from '@/services/AIEngineService'
import { setCredits, setOrganizationCredits, setError, setLoading, clearError } from '../aiEngine/aiEngineSlice'
import type { AIEngineError } from '@/@types/aiEngine'

// ==================== Wallet Balance ====================

/**
 * Fetch current wallet balance
 * Maps new balance API format to existing credits state
 */
export const fetchWalletBalanceAsync = createAsyncThunk(
    'wallet/fetchBalance',
    async (options: { silent?: boolean } | undefined, { dispatch, rejectWithValue }) => {
        const silent = options?.silent || false
        try {
            if (!silent) {
                dispatch(setLoading(true))
                dispatch(clearError())
            }
            const balance = await AIEngineService.getCreditBalance()

            // Map to existing credits format
            dispatch(setCredits({
                aiCredits: balance.ai_credits,
                nairaBalance: balance.naira_equivalent,
                lastUpdated: balance.last_updated,
            }))

            if (!silent) {
                dispatch(setLoading(false))
            }
            return balance
        } catch (error: any) {
            const aiError: AIEngineError = {
                code: 'NETWORK_ERROR',
                message: error?.response?.data?.detail || error?.message || 'Failed to fetch wallet balance',
                retryable: true,
            }
            if (!silent) {
                dispatch(setError(aiError))
                dispatch(setLoading(false))
            }
            return rejectWithValue(aiError)
        }
    },
    {
        condition: (_, { getState }) => {
            const state = getState() as any
            const lastSync = state.aiEngine.credits?.lastUpdated
            if (lastSync) {
                const diff = new Date().getTime() - new Date(lastSync).getTime()
                if (diff < 2000) return false
            }
            return true
        }
    }
)

/**
 * Fetch organization wallet balance
 */
export const fetchOrganizationWalletBalanceAsync = createAsyncThunk(
    'wallet/fetchOrganizationBalance',
    async ({ organizationId, silent = false }: { organizationId: string, silent?: boolean }, { dispatch, rejectWithValue }) => {
        if (!organizationId || organizationId === 'null' || organizationId === 'undefined') {
            return rejectWithValue('Invalid organization ID')
        }
        try {
            if (!silent) {
                dispatch(setLoading(true))
                dispatch(clearError())
            }
            const balance = await AIEngineService.getOrganizationCreditBalance(organizationId)

            dispatch(setOrganizationCredits({
                balance: balance.balance,
                monthlyUsage: balance.monthly_usage,
                remainingCredits: balance.remaining_credits,
                lastUpdated: new Date().toISOString(),
            }))

            if (!silent) {
                dispatch(setLoading(false))
            }
            return balance
        } catch (error: any) {
            const aiError: AIEngineError = {
                code: 'NETWORK_ERROR',
                message: error?.response?.data?.detail || error?.message || 'Failed to fetch organization wallet balance',
                retryable: true,
            }
            if (!silent) {
                dispatch(setError(aiError))
                dispatch(setLoading(false))
            }
            return rejectWithValue(aiError)
        }
    },
    {
        condition: ({ organizationId }, { getState }) => {
            const state = getState() as any
            const orgCredits = state.aiEngine.organizationCredits
            if (orgCredits && orgCredits.lastUpdated) {
                const diff = new Date().getTime() - new Date(orgCredits.lastUpdated).getTime()
                if (diff < 2000) return false
            }
            return true
        }
    }
)

/**
 * Test top-up (development only)
 * Instantly adds credits for local testing
 */
export const testTopUpAsync = createAsyncThunk(
    'wallet/testTopUp',
    async (amount: number = 5000, { dispatch, rejectWithValue }) => {
        try {
            dispatch(setLoading(true))
            const result = await AIEngineService.testTopUp(amount)

            // Update credits immediately with new balance
            if (result.new_balance) {
                dispatch(setCredits({
                    aiCredits: result.new_balance.ai_credits,
                    nairaBalance: result.new_balance.naira_equivalent,
                    lastUpdated: new Date().toISOString(),
                }))
            } else {
                // Fallback: refresh balance
                dispatch(fetchWalletBalanceAsync())
            }

            dispatch(setLoading(false))
            return result
        } catch (error: any) {
            const aiError: AIEngineError = {
                code: 'NETWORK_ERROR',
                message: error?.response?.data?.detail || error?.message || 'Test top-up failed',
                retryable: false,
            }
            dispatch(setError(aiError))
            dispatch(setLoading(false))
            return rejectWithValue(aiError)
        }
    },
)

/**
 * Refresh wallet balance silently (for auto-refresh)
 * Doesn't set loading state to avoid UI flickering
 */
export const refreshWalletBalanceSilentAsync = createAsyncThunk(
    'wallet/refreshBalanceSilent',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const balance = await AIEngineService.getCreditBalance()

            dispatch(setCredits({
                aiCredits: balance.ai_credits,
                nairaBalance: balance.naira_equivalent,
                lastUpdated: balance.last_updated,
            }))

            return balance
        } catch (error: any) {
            // Silent refresh - don't show error to user
            console.error('Silent wallet refresh failed:', error)
            return rejectWithValue(error)
        }
    },
)
