/**
 * AI Engine Redux Slice
 *
 * Manages state for AI credits, usage, top-ups, and health status
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
    AIEngineState,
    AICredits,
    OrganizationCredits,
    PendingTopUp,
    CreditTransaction,
    APIUsageRecord,
    AIHealthStatus,
    APIKey,
    AIEngineError,
} from '@/@types/aiEngine'

const initialState: AIEngineState = {
    credits: null,
    organizationCredits: null,
    pendingTopUps: [],
    creditTransactions: [],
    usageHistory: {
        records: [],
        totalRequests: 0,
        totalCost: 0,
        totalTokens: 0,
    },
    healthStatus: null,
    apiKeys: [],
    isLoading: false,
    error: null,
    lastSyncTimestamp: null,
}

const aiEngineSlice = createSlice({
    name: 'aiEngine',
    initialState,
    reducers: {
        // ==================== Credits ====================

        setCredits: (state, action: PayloadAction<AICredits>) => {
            state.credits = action.payload
            state.lastSyncTimestamp = new Date().toISOString()
        },

        setOrganizationCredits: (state, action: PayloadAction<OrganizationCredits>) => {
            state.organizationCredits = action.payload
            state.lastSyncTimestamp = new Date().toISOString()
        },

        updateCredits: (
            state,
            action: PayloadAction<{ nairaBalance?: number; aiCredits?: number }>,
        ) => {
            if (state.credits) {
                if (action.payload.nairaBalance !== undefined) {
                    state.credits.nairaBalance = action.payload.nairaBalance
                }
                if (action.payload.aiCredits !== undefined) {
                    state.credits.aiCredits = action.payload.aiCredits
                }
                state.credits.lastUpdated = new Date().toISOString()
                state.lastSyncTimestamp = new Date().toISOString()
            }
        },

        deductCredits: (state, action: PayloadAction<number>) => {
            if (state.credits) {
                const deductionAmount = action.payload
                state.credits.aiCredits = Math.max(
                    0,
                    state.credits.aiCredits - deductionAmount,
                )
                state.credits.lastUpdated = new Date().toISOString()
                state.lastSyncTimestamp = new Date().toISOString()
            }
        },

        // ==================== Top-Ups ====================

        addPendingTopUp: (state, action: PayloadAction<PendingTopUp>) => {
            state.pendingTopUps.unshift(action.payload)
        },

        updateTopUpStatus: (
            state,
            action: PayloadAction<{
                id: string
                status: PendingTopUp['status']
                updatedAt?: string
            }>,
        ) => {
            const topUp = state.pendingTopUps.find(
                (t) => t.id === action.payload.id,
            )
            if (topUp) {
                topUp.status = action.payload.status
                topUp.updatedAt =
                    action.payload.updatedAt || new Date().toISOString()
            }
        },

        removeTopUp: (state, action: PayloadAction<string>) => {
            state.pendingTopUps = state.pendingTopUps.filter(
                (t) => t.id !== action.payload,
            )
        },

        clearCompletedTopUps: (state) => {
            state.pendingTopUps = state.pendingTopUps.filter(
                (t) => t.status !== 'COMPLETED',
            )
        },

        // ==================== Transactions ====================

        addTransaction: (state, action: PayloadAction<CreditTransaction>) => {
            state.creditTransactions.unshift(action.payload)
            // Keep only last 100 transactions in memory
            if (state.creditTransactions.length > 100) {
                state.creditTransactions = state.creditTransactions.slice(0, 100)
            }
        },

        setTransactions: (
            state,
            action: PayloadAction<CreditTransaction[]>,
        ) => {
            state.creditTransactions = action.payload
        },

        // ==================== Usage ====================

        addUsageRecord: (state, action: PayloadAction<APIUsageRecord>) => {
            state.usageHistory.records.unshift(action.payload)
            state.usageHistory.totalRequests += 1
            state.usageHistory.totalCost += action.payload.cost
            state.usageHistory.totalTokens += action.payload.totalTokens

            // Keep only last 100 records in memory
            if (state.usageHistory.records.length > 100) {
                state.usageHistory.records = state.usageHistory.records.slice(
                    0,
                    100,
                )
            }
        },

        setUsageHistory: (
            state,
            action: PayloadAction<{
                records: APIUsageRecord[]
                totalRequests: number
                totalCost: number
                totalTokens: number
            }>,
        ) => {
            state.usageHistory = action.payload
        },

        clearUsageHistory: (state) => {
            state.usageHistory = {
                records: [],
                totalRequests: 0,
                totalCost: 0,
                totalTokens: 0,
            }
        },

        // ==================== Health ====================

        setHealthStatus: (state, action: PayloadAction<AIHealthStatus>) => {
            state.healthStatus = action.payload
        },

        updateHealthStatus: (
            state,
            action: PayloadAction<Partial<AIHealthStatus>>,
        ) => {
            if (state.healthStatus) {
                state.healthStatus = {
                    ...state.healthStatus,
                    ...action.payload,
                    lastChecked: new Date().toISOString(),
                }
            }
        },

        // ==================== API Keys ====================

        setAPIKeys: (state, action: PayloadAction<APIKey[]>) => {
            state.apiKeys = action.payload
        },

        addAPIKey: (state, action: PayloadAction<APIKey>) => {
            state.apiKeys.unshift(action.payload)
        },

        updateAPIKey: (
            state,
            action: PayloadAction<{
                id: string
                updates: Partial<APIKey>
            }>,
        ) => {
            const key = state.apiKeys.find((k) => k.id === action.payload.id)
            if (key) {
                Object.assign(key, action.payload.updates)
            }
        },

        removeAPIKey: (state, action: PayloadAction<string>) => {
            state.apiKeys = state.apiKeys.filter(
                (k) => k.id !== action.payload,
            )
        },

        // ==================== Loading & Errors ====================

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },

        setError: (state, action: PayloadAction<AIEngineError | null>) => {
            state.error = action.payload
        },

        clearError: (state) => {
            state.error = null
        },

        // ==================== Multi-Tab Sync ====================

        syncFromStorage: (state, action: PayloadAction<Partial<AIEngineState>>) => {
            // Merge external updates (from another tab)
            if (action.payload.credits) {
                state.credits = action.payload.credits
            }
            if (action.payload.pendingTopUps) {
                state.pendingTopUps = action.payload.pendingTopUps
            }
            if (action.payload.healthStatus) {
                state.healthStatus = action.payload.healthStatus
            }
            state.lastSyncTimestamp = new Date().toISOString()
        },

        // ==================== Reset ====================

        resetAIEngine: () => initialState,
    },
})

export const {
    setCredits,
    setOrganizationCredits,
    updateCredits,
    deductCredits,
    addPendingTopUp,
    updateTopUpStatus,
    removeTopUp,
    clearCompletedTopUps,
    addTransaction,
    setTransactions,
    addUsageRecord,
    setUsageHistory,
    clearUsageHistory,
    setHealthStatus,
    updateHealthStatus,
    setAPIKeys,
    addAPIKey,
    updateAPIKey,
    removeAPIKey,
    setLoading,
    setError,
    clearError,
    syncFromStorage,
    resetAIEngine,
} = aiEngineSlice.actions

export default aiEngineSlice.reducer
