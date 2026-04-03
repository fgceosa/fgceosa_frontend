/**
 * Workspace Credit Sharing Service
 *
 * Handles API calls for sharing AI credits from workspace to team members
 */

import ApiService from './ApiService'

export interface RecipientInput {
    email?: string
    tag_number?: string
    amount?: number
}

export interface CreditShareRequest {
    recipients: RecipientInput[]
    amount_per_user?: number
    total_amount?: number
    message?: string
}

export interface CreditShareResult {
    recipient_identifier: string
    recipient_id?: string
    recipient_name?: string
    amount: number
    status: 'success' | 'failed'
    error?: string
}

export interface CreditShareResponse {
    success_count: number
    failed_count: number
    total_amount: number
    results: CreditShareResult[]
    workspace_balance_before: number
    workspace_balance_after: number
}

export interface PreviewCreditShareParams {
    total_amount?: number
    amount_per_user?: number
    recipient_count?: number
}

export interface PreviewCreditShareResponse {
    workspace_id: string
    current_balance: number
    total_to_distribute: number
    amount_per_user: number
    recipient_count: number
    balance_after: number
    sufficient_balance: boolean
}

/**
 * Share credits from workspace to team members
 */
export async function apiShareWorkspaceCredits(
    workspaceId: string,
    request: CreditShareRequest
): Promise<CreditShareResponse> {
    return ApiService.fetchDataWithAxios<CreditShareResponse>({
        url: `workspaces/${workspaceId}/share-credits`,
        method: 'post',
        data: request,
    })
}

/**
 * Preview credit sharing calculation
 */
export async function apiPreviewCreditShare(
    workspaceId: string,
    params: PreviewCreditShareParams
): Promise<PreviewCreditShareResponse> {
    const queryParams = new URLSearchParams()

    if (params.total_amount !== undefined) {
        queryParams.append('total_amount', params.total_amount.toString())
    }
    if (params.amount_per_user !== undefined) {
        queryParams.append('amount_per_user', params.amount_per_user.toString())
    }
    if (params.recipient_count !== undefined) {
        queryParams.append('recipient_count', params.recipient_count.toString())
    }

    const url = `workspaces/${workspaceId}/share-credits/preview?${queryParams.toString()}`

    return ApiService.fetchDataWithAxios<PreviewCreditShareResponse>({
        url,
        method: 'get',
    })
}

export default {
    apiShareWorkspaceCredits,
    apiPreviewCreditShare,
}
