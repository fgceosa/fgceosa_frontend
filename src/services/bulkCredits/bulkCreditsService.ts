import ApiService from '../ApiService'
import type {
    Transaction,
    Campaign,
    SendCreditsFormData,
    BulkDistributionFormData,
    SendCreditsResponse,
    BulkDistributionResponse,
} from '@/app/(protected-pages)/admin/credits/bulk/types'

export interface SendCreditsRequest extends SendCreditsFormData {
    organizationId?: string
}

export interface BulkDistributionRequest extends BulkDistributionFormData {
    organizationId?: string
}

// ========== Statistics Types ==========
export interface BulkCreditsStats {
    totalBalance: number
    sentCredits: number
    totalUsers: number
    activeEvents: number
}

// ========== API Request/Response Types ==========
export interface TransactionListParams {
    pageIndex?: number
    pageSize?: number
    query?: string
    type?: string
    status?: string
    startDate?: string
    endDate?: string
    organizationId?: string
}

export interface GetTransactionsResponse {
    transactions: Transaction[]
    total: number
}

export interface GetCampaignsResponse {
    campaigns: Campaign[]
    total: number
}

export interface CampaignListParams {
    pageIndex?: number
    pageSize?: number
    query?: string
    status?: string
    organizationId?: string
}

// ========== API Functions ==========

/**
 * Get bulk credits statistics
 */
export async function apiGetBulkCreditsStats(organizationId?: string) {
    return ApiService.fetchDataWithAxios<BulkCreditsStats>({
        url: organizationId ? `bulk-credits/stats?organization_id=${organizationId}` : 'bulk-credits/stats',
        method: 'get',
    })
}

/**
 * Get credit transactions list with pagination
 */
export async function apiGetBulkTransactions(
    params?: TransactionListParams,
) {
    const queryParams = new URLSearchParams()

    if (params?.pageIndex) {
        queryParams.append('page', params.pageIndex.toString())
    }
    if (params?.pageSize) {
        queryParams.append('page_size', params.pageSize.toString())
    }
    if (params?.query) {
        queryParams.append('search', params.query)
    }
    if (params?.type) {
        queryParams.append('type', params.type)
    }
    if (params?.status) {
        queryParams.append('status', params.status)
    }
    if (params?.startDate) {
        queryParams.append('start_date', params.startDate)
    }
    if (params?.endDate) {
        queryParams.append('end_date', params.endDate)
    }
    if (params?.organizationId) {
        queryParams.append('organization_id', params.organizationId)
    }

    const queryString = queryParams.toString()
    const url = queryString
        ? `bulk-credits/transactions?${queryString}`
        : 'bulk-credits/transactions'

    return ApiService.fetchDataWithAxios<GetTransactionsResponse>({
        url,
        method: 'get',
    })
}

/**
 * Get campaigns list with pagination
 */
export async function apiGetCampaigns(params?: CampaignListParams) {
    const queryParams = new URLSearchParams()

    if (params?.pageIndex) {
        queryParams.append('page', params.pageIndex.toString())
    }
    if (params?.pageSize) {
        queryParams.append('page_size', params.pageSize.toString())
    }
    if (params?.query) {
        queryParams.append('search', params.query)
    }
    if (params?.status) {
        queryParams.append('status', params.status)
    }

    if (params?.organizationId) {
        queryParams.append('organization_id', params.organizationId)
    }

    const queryString = queryParams.toString()
    const url = queryString
        ? `bulk-credits/campaigns?${queryString}`
        : 'bulk-credits/campaigns'

    return ApiService.fetchDataWithAxios<GetCampaignsResponse>({
        url,
        method: 'get',
    })
}

/**
 * Send credits to a single recipient or multiple recipients
 */
export async function apiSendCredits(data: SendCreditsRequest) {
    return ApiService.fetchDataWithAxios<SendCreditsResponse>({
        url: 'bulk-credits/send',
        method: 'post',
        data,
    })
}

/**
 * Bulk distribution of credits
 */
export async function apiBulkDistribution(data: BulkDistributionRequest) {
    return ApiService.fetchDataWithAxios<BulkDistributionResponse>({
        url: 'bulk-credits/bulk-distribution',
        method: 'post',
        data,
    })
}

/**
 * Create a new campaign
 */
export async function apiCreateCampaign(data: Partial<Campaign>) {
    return ApiService.fetchDataWithAxios<Campaign>({
        url: 'bulk-credits/campaigns',
        method: 'post',
        data,
    })
}

/**
 * Update an existing campaign
 */
export async function apiUpdateCampaign(id: string, data: Partial<Campaign>) {
    return ApiService.fetchDataWithAxios<Campaign>({
        url: `bulk-credits/campaigns/${id}`,
        method: 'put',
        data,
    })
}

/**
 * Delete a campaign
 */
export async function apiDeleteCampaign(id: string) {
    return ApiService.fetchDataWithAxios<{ success: boolean; message: string }>({
        url: `bulk-credits/campaigns/${id}`,
        method: 'delete',
    })
}

/**
 * Get campaign analytics
 */
export async function apiGetCampaignAnalytics(id: string) {
    return ApiService.fetchDataWithAxios<any>({
        url: `bulk-credits/campaigns/${id}/analytics`,
        method: 'get',
    })
}
/**
 * Get aggregated analytics across all campaigns
 */
export async function apiGetAggregatedAnalytics(organizationId?: string) {
    return ApiService.fetchDataWithAxios<any>({
        url: organizationId ? `bulk-credits/aggregated-analytics?organization_id=${organizationId}` : 'bulk-credits/aggregated-analytics',
        method: 'get',
    })
}
