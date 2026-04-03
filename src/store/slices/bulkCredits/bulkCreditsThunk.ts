import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetBulkCreditsStats,
    apiGetBulkTransactions,
    apiGetCampaigns,
    apiSendCredits,
    apiBulkDistribution,
    apiCreateCampaign,
    apiUpdateCampaign,
    apiDeleteCampaign,
    apiGetCampaignAnalytics,
    apiGetAggregatedAnalytics,
    TransactionListParams,
    CampaignListParams,
} from '@/services/bulkCredits/bulkCreditsService'
import type {
    SendCreditsFormData,
    BulkDistributionFormData,
    Campaign,
} from '@/app/(protected-pages)/admin/credits/bulk/types'
import { SLICE_BASE_NAME } from './constants'

/**
 * Fetch bulk credits statistics
 */
export const fetchBulkCreditsStats = createAsyncThunk(
    `${SLICE_BASE_NAME}/fetchStats`,
    async (organizationId: string | undefined, { rejectWithValue }) => {
        try {
            const response = await apiGetBulkCreditsStats(organizationId)
            return response
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to fetch bulk credits stats'
            return rejectWithValue(message)
        }
    },
)

/**
 * Fetch bulk credit transactions with pagination
 */
export const fetchBulkTransactions = createAsyncThunk(
    `${SLICE_BASE_NAME}/fetchTransactions`,
    async (params: TransactionListParams, { rejectWithValue }) => {
        try {
            const response = await apiGetBulkTransactions(params)
            return response
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to fetch bulk transactions'
            return rejectWithValue(message)
        }
    },
)

/**
 * Fetch campaigns with pagination
 */
export const fetchCampaigns = createAsyncThunk(
    `${SLICE_BASE_NAME}/fetchCampaigns`,
    async (params: CampaignListParams, { rejectWithValue }) => {
        try {
            const response = await apiGetCampaigns(params)
            return response
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to fetch campaigns'
            return rejectWithValue(message)
        }
    },
)

/**
 * Send credits to recipient(s)
 */
export const sendCredits = createAsyncThunk(
    `${SLICE_BASE_NAME}/sendCredits`,
    async (data: SendCreditsFormData, { rejectWithValue }) => {
        try {
            const response = await apiSendCredits(data)
            return response
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to send credits'
            return rejectWithValue(message)
        }
    },
)

/**
 * Bulk distribution of credits
 */
export const bulkDistribution = createAsyncThunk(
    `${SLICE_BASE_NAME}/bulkDistribution`,
    async (data: BulkDistributionFormData, { rejectWithValue }) => {
        try {
            const response = await apiBulkDistribution(data)
            return response
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to distribute credits'
            return rejectWithValue(message)
        }
    },
)

/**
 * Create a new campaign
 */
export const createCampaign = createAsyncThunk(
    `${SLICE_BASE_NAME}/createCampaign`,
    async (data: Partial<Campaign>, { rejectWithValue }) => {
        try {
            const response = await apiCreateCampaign(data)
            return response
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to create campaign'
            return rejectWithValue(message)
        }
    },
)

/**
 * Update an existing campaign
 */
export const updateCampaign = createAsyncThunk(
    `${SLICE_BASE_NAME}/updateCampaign`,
    async ({ id, data }: { id: string; data: Partial<Campaign> }, { rejectWithValue }) => {
        try {
            const response = await apiUpdateCampaign(id, data)
            return response
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to update campaign'
            return rejectWithValue(message)
        }
    },
)

/**
 * Delete a campaign
 */
export const deleteCampaign = createAsyncThunk(
    `${SLICE_BASE_NAME}/deleteCampaign`,
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiDeleteCampaign(id)
            return { ...response, id }
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to delete campaign'
            return rejectWithValue(message)
        }
    },
)

/**
 * Fetch campaign analytics
 */
export const fetchCampaignAnalytics = createAsyncThunk(
    `${SLICE_BASE_NAME}/fetchAnalytics`,
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiGetCampaignAnalytics(id)
            return response
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to fetch campaign analytics'
            return rejectWithValue(message)
        }
    },
)

/**
 * Fetch aggregated analytics across all campaigns
 */
export const fetchAggregatedAnalytics = createAsyncThunk(
    `${SLICE_BASE_NAME}/fetchAggregatedAnalytics`,
    async (organizationId: string | undefined, { rejectWithValue }) => {
        try {
            const response = await apiGetAggregatedAnalytics(organizationId)
            return response
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to fetch aggregated analytics'
            return rejectWithValue(message)
        }
    },
)

// Export all thunks as a namespace for convenience
export const bulkCreditsThunks = {
    fetchBulkCreditsStats,
    fetchBulkTransactions,
    fetchCampaigns,
    sendCredits,
    bulkDistribution,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    fetchCampaignAnalytics,
    fetchAggregatedAnalytics,
}
