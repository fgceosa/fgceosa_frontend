import ApiService from '../ApiService'
import type {
    SharedCreditsStats,
    CreditTransaction,
    UserPublic,
} from '@/app/(protected-pages)/dashboard/shared-credits/types'

export interface TransactionListParams {
    pageIndex?: number
    pageSize?: number
    query?: string
}

export interface TransferCreditsRequest {
    recipientIds?: string[]
    recipientTags?: string[]
    amount: number
    message?: string
    [key: string]: any | undefined
}

export interface GetTransactionsResponse {
    transactions: CreditTransaction[]
    total: number
}

/**
 * Get shared credits statistics
 */
export async function apiGetSharedCreditsStats() {
    return ApiService.fetchDataWithAxios<SharedCreditsStats>({
        url: 'shared-credits/stats',
        method: 'get',
    })
}

/**
 * Get credit transactions list with pagination
 */
export async function apiGetCreditTransactions(
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

    const queryString = queryParams.toString()
    const url = queryString
        ? `shared-credits/transactions?${queryString}`
        : 'shared-credits/transactions'

    return ApiService.fetchDataWithAxios<GetTransactionsResponse>({
        url,
        method: 'get',
    })
}

/**
 * Transfer credits
 */
export async function apiTransferCredits(data: TransferCreditsRequest) {
    return ApiService.fetchDataWithAxios<{ success: boolean; message: string }>({
        url: 'shared-credits/transfer',
        method: 'post',
        data,
    })
}

/**
 * Resolve a user tag number to user info
 */
export async function apiResolveTag(tag: string) {
    const trimmedTag = tag.trim()
    const cleanTag = (trimmedTag.startsWith('@') ? trimmedTag.slice(1) : trimmedTag).trim()
    return ApiService.fetchDataWithAxios<UserPublic>({
        url: `shared-credits/resolve-tag/${cleanTag}`,
        method: 'get',
    })
}

/**
 * Download invoice for a transaction
 */
export async function apiDownloadInvoice(transactionId: string) {
    return ApiService.fetchDataWithAxios<Blob>({
        url: `shared-credits/transactions/${transactionId}/invoice`,
        method: 'get',
        responseType: 'blob',
    })
}
