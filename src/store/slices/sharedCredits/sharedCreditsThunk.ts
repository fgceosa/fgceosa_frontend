import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetSharedCreditsStats,
    apiGetCreditTransactions,
    apiTransferCredits,
    TransactionListParams,
    TransferCreditsRequest,
} from '@/services/sharedCredits/sharedCreditsService'
import { SLICE_BASE_NAME } from './constants'

/**
 * Fetch shared credits statistics
 */
export const fetchSharedCreditsStats = createAsyncThunk(
    `${SLICE_BASE_NAME}/fetchStats`,
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiGetSharedCreditsStats()
            // ApiService.fetchDataWithAxios already returns response.data
            return response
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to fetch shared credits stats'
            return rejectWithValue(message)
        }
    },
)

/**
 * Fetch credit transactions with pagination
 */
export const fetchCreditTransactions = createAsyncThunk(
    `${SLICE_BASE_NAME}/fetchTransactions`,
    async (params: TransactionListParams, { rejectWithValue }) => {
        try {
            const response = await apiGetCreditTransactions(params)
            // ApiService.fetchDataWithAxios already returns response.data
            return response
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to fetch credit transactions'
            return rejectWithValue(message)
        }
    },
)

/**
 * Transfer credits to team members
 */
export const transferCredits = createAsyncThunk(
    `${SLICE_BASE_NAME}/transferCredits`,
    async (data: TransferCreditsRequest, { rejectWithValue }) => {
        try {
            const response = await apiTransferCredits(data)
            // ApiService.fetchDataWithAxios already returns response.data
            return response
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to transfer credits'
            return rejectWithValue(message)
        }
    },
)

// Export all thunks as a namespace for convenience
export const sharedCreditsThunks = {
    fetchSharedCreditsStats,
    fetchCreditTransactions,
    transferCredits,
}

