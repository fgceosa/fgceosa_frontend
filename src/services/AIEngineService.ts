/**
 * AI Engine API Service
 *
 * Handles all API calls to the AI Engine endpoints with:
 * - Automatic retry logic with exponential backoff
 * - JWT token refresh
 * - Network error handling
 * - Credit validation
 * - Timeout management
 */

import ApiService from './ApiService'
import type {
    ChatCompletionRequest,
    ChatCompletionResponse,
    EmbeddingRequest,
    EmbeddingResponse,
    ModerationRequest,
    ModerationResponse,
    AICredits,
    CreditTopUpRequest,
    PendingTopUp,
    AIHealthStatus,
    APIKey,
    APIKeyCreateRequest,
    ModelsListResponse,
} from '@/@types/aiEngine'
import { NAIRA_TO_USD_RATE } from '@/constants/currency.constant'

// ==================== Custom Errors ====================

export class InsufficientCreditsError extends Error {
    constructor(message: string, public currentBalance: number, public required: number) {
        super(message)
        this.name = 'InsufficientCreditsError'
    }
}

export class RetryableError extends Error {
    constructor(message: string, public retryAfter?: number) {
        super(message)
        this.name = 'RetryableError'
    }
}

export class ServiceUnavailableError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'ServiceUnavailableError'
    }
}

// ==================== Retry Logic ====================

interface RetryConfig {
    maxRetries: number
    baseDelay: number
    maxDelay: number
    timeout: number
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000, // 1 second
    maxDelay: 10000, // 10 seconds
    timeout: 60000, // 60 seconds
}

async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

function calculateBackoff(attempt: number, baseDelay: number, maxDelay: number): number {
    const exponentialDelay = baseDelay * Math.pow(2, attempt)
    const jitter = Math.random() * 0.3 * exponentialDelay // Add 0-30% jitter
    return Math.min(exponentialDelay + jitter, maxDelay)
}

async function retryableRequest<T>(
    requestFn: () => Promise<T>,
    config: Partial<RetryConfig> = {},
): Promise<T> {
    const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config }
    let lastError: Error

    for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
        try {
            // Create abort controller for timeout
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), finalConfig.timeout)

            const promise = requestFn()

            // Wait for request to complete or timeout
            const result = await Promise.race([
                promise,
                new Promise<never>((_, reject) => {
                    controller.signal.addEventListener('abort', () => {
                        reject(new RetryableError('Request timed out'))
                    })
                }),
            ])

            clearTimeout(timeoutId)
            return result
        } catch (error: any) {
            lastError = error

            // Don't retry certain errors
            if (
                error instanceof InsufficientCreditsError ||
                error.response?.status === 400 || // Bad request
                error.response?.status === 401 || // Unauthorized
                error.response?.status === 403 // Forbidden
            ) {
                throw error
            }

            // Check if we should retry
            const isRetryable =
                error instanceof RetryableError ||
                error.response?.status === 429 || // Rate limit
                error.response?.status >= 500 || // Server errors
                error.code === 'ECONNABORTED' || // Timeout
                error.code === 'ERR_NETWORK' // Network error

            if (!isRetryable || attempt === finalConfig.maxRetries) {
                throw error
            }

            // Calculate delay and retry
            const delay = calculateBackoff(attempt, finalConfig.baseDelay, finalConfig.maxDelay)

            console.log(
                `Request failed (attempt ${attempt + 1}/${finalConfig.maxRetries + 1}). ` +
                `Retrying in ${delay}ms...`,
            )

            await sleep(delay)
        }
    }

    throw lastError!
}

// ==================== AI Engine Service ====================

export const AIEngineService = {
    // ==================== Credits ====================

    async getCredits(): Promise<AICredits> {
        return retryableRequest(async () => {
            const response = await ApiService.fetchDataWithAxios<AIHealthStatus>({
                url: 'ai/v1/health',
                method: 'get',
            })

            return {
                nairaBalance: response.creditBalance * NAIRA_TO_USD_RATE, // ₦1,650 = 1 credit
                aiCredits: response.creditBalance,
                lastUpdated: new Date().toISOString(),
            }
        })
    },

    /**
     * Initiate a credit top-up via bank transfer
     *
     * New payment system supports multiple providers (Flutterwave, Monnify, etc.)
     * Returns virtual account details for bank transfer
     */
    async initiateTopUp(request: CreditTopUpRequest): Promise<{
        id: string
        amount_naira: number
        ai_credits: number
        status: string
        payment_reference: string
        account_number: string
        bank_name: string
        account_name: string
        expires_at: string
        provider: string
        message: string
    }> {
        return retryableRequest(async () => {
            const response = await ApiService.fetchDataWithAxios<{
                id: string
                amount_naira: number
                ai_credits: number
                status: string
                payment_reference: string
                account_number: string
                bank_name: string
                account_name: string
                expires_at: string
                provider: string
                message: string
            }>({
                url: 'credits/top-up',
                method: 'post',
                data: {
                    amount: request.amount,
                    payment_method: request.paymentMethod || 'bank_transfer',
                    workspaceId: request.workspaceId,
                    organizationId: request.organizationId,
                },
            })
            return response
        })
    },

    /**
     * Check the status of a top-up transaction
     *
     * Polls the payment provider to check if payment has been received
     */
    async checkTopUpStatus(topUpId: string): Promise<{
        topup_id: string
        reference: string
        status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'EXPIRED'
        amount: number
        ai_credits: number
        account_number?: string
        bank_name?: string
        created_at: string
        paid_at?: string
        expires_at?: string
        provider: string
    }> {
        return retryableRequest(async () => {
            const response = await ApiService.fetchDataWithAxios<{
                topup_id: string
                reference: string
                status: string
                amount: number
                ai_credits: number
                account_number?: string
                bank_name?: string
                created_at: string
                paid_at?: string
                expires_at?: string
                provider: string
            }>({
                url: `credits/top-up/${topUpId}/status`,
                method: 'get',
            })

            return {
                topup_id: response.topup_id,
                reference: response.reference,
                status: response.status.toUpperCase() as 'PENDING' | 'COMPLETED' | 'FAILED' | 'EXPIRED',
                amount: response.amount,
                ai_credits: response.ai_credits,
                account_number: response.account_number,
                bank_name: response.bank_name,
                created_at: response.created_at,
                paid_at: response.paid_at,
                expires_at: response.expires_at,
                provider: response.provider,
            }
        })
    },

    async getCreditBalance(): Promise<{
        ai_credits: number
        naira_equivalent: number
        conversion_rate: number
        last_updated: string
    }> {
        return retryableRequest(async () => {
            const response = await ApiService.fetchDataWithAxios<{
                ai_credits: number
                naira_equivalent: number
                conversion_rate: number
                last_updated: string
            }>({
                url: 'credits/balance',
                method: 'get',
            })
            return response
        })
    },

    async getOrganizationCreditBalance(orgId: string): Promise<{
        balance: number
        monthly_usage: number
        remaining_credits: number
    }> {
        if (!orgId || orgId === 'null' || orgId === 'undefined') {
            return Promise.reject(new Error('Invalid organization ID'))
        }
        return retryableRequest(async () => {
            const response = await ApiService.fetchDataWithAxios<{
                balance: number
                monthly_usage: number
                remaining_credits: number
            }>({
                url: `organizations/${orgId}/credits/balance`,
                method: 'get',
            })
            return response
        })
    },

    async getOrganizationCreditTransactions(orgId: string, skip: number = 0, limit: number = 50): Promise<{
        transactions: Array<{
            id: string
            amount: number
            balance_after: number
            transaction_type: string
            description: string
            created_at: string
        }>
        total: number
        skip: number
        limit: number
    }> {
        if (!orgId || orgId === 'null' || orgId === 'undefined') {
            return Promise.reject(new Error('Invalid organization ID'))
        }
        const page = Math.floor(skip / limit) + 1
        return retryableRequest(async () => {
            const response = await ApiService.fetchDataWithAxios<any>({
                url: `organizations/${orgId}/credits/transactions?page=${page}&page_size=${limit}`,
                method: 'get',
            })
            return {
                transactions: response.transactions,
                total: response.total,
                skip: (response.page - 1) * response.page_size,
                limit: response.page_size
            }
        })
    },

    async getCreditTransactions(skip: number = 0, limit: number = 50): Promise<{
        transactions: Array<{
            id: string
            amount: number
            balance_after: number
            transaction_type: string
            description: string
            created_at: string
        }>
        total: number
        skip: number
        limit: number
    }> {
        return retryableRequest(async () => {
            const response = await ApiService.fetchDataWithAxios<any>({
                url: `credits/transactions?skip=${skip}&limit=${limit}`,
                method: 'get',
            })
            return response
        })
    },

    async getTopUpHistory(skip: number = 0, limit: number = 50): Promise<{
        top_ups: Array<any>
        total: number
        skip: number
        limit: number
    }> {
        return retryableRequest(async () => {
            const response = await ApiService.fetchDataWithAxios<any>({
                url: `credits/top-ups?skip=${skip}&limit=${limit}`,
                method: 'get',
            })
            return response
        })
    },

    /**
     * Verify pending top-ups with Flutterwave and apply credits if paid.
     * Call this when the wallet/credits page loads to catch any payments
     * that completed while the user had the modal closed.
     */
    async verifyPendingTopUps(organizationId?: string): Promise<{
        checked: number
        credited: Array<{ reference: string; amount_naira: number; ai_credits: number }>
        still_pending: string[]
        credits_applied: boolean
    }> {
        const params = organizationId ? `?organization_id=${organizationId}` : ''
        return retryableRequest(async () => {
            const response = await ApiService.fetchDataWithAxios<any>({
                url: `credits/top-up/verify-pending${params}`,
                method: 'post',
            })
            return response
        })
    },

    /**
     * TEST TOP-UP - FOR LOCAL DEVELOPMENT ONLY
     * Instantly add credits without Monnify payment
     * This endpoint is disabled in production
     */
    async testTopUp(amount: number = 5000): Promise<{
        success: boolean
        message: string
        top_up: {
            id: string
            amount_naira: number
            ai_credits: number
            payment_reference: string
        }
        new_balance: {
            ai_credits: number
            naira_equivalent: number
            conversion_rate: number
        }
    }> {
        return retryableRequest(async () => {
            const response = await ApiService.fetchDataWithAxios<any>({
                url: `credits/top-up/test?amount=${amount}`,
                method: 'post',
            })
            return response
        })
    },

    // ==================== Chat Completions ====================

    async chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
        return retryableRequest(
            async () => {
                try {
                    const response = await ApiService.fetchDataWithAxios<ChatCompletionResponse>({
                        url: 'ai/v1/chat/completions',
                        method: 'post',
                        data: {
                            messages: request.messages,
                            model: request.model || 'gpt-3.5-turbo',
                            temperature: request.temperature,
                            max_tokens: request.maxTokens,
                            top_p: request.topP,
                            n: request.n,
                            stream: request.stream,
                            stop: request.stop,
                            presence_penalty: request.presencePenalty,
                            frequency_penalty: request.frequencyPenalty,
                            user: request.user,
                        },
                    })

                    return response
                } catch (error: any) {
                    // Handle insufficient credits
                    if (error.response?.status === 402) {
                        const detail = error.response.data?.detail || ''
                        const match = detail.match(/Current balance: \$(\d+\.?\d*)/)
                        const currentBalance = match ? parseFloat(match[1]) : 0

                        throw new InsufficientCreditsError(
                            error.response.data?.detail ||
                            'Insufficient credits to complete request',
                            currentBalance,
                            0.01,
                        )
                    }

                    throw error
                }
            },
            { timeout: 90000 }, // 90 seconds for chat (can be longer)
        )
    },

    // ==================== Embeddings ====================

    async createEmbeddings(request: EmbeddingRequest): Promise<EmbeddingResponse> {
        return retryableRequest(
            async () => {
                try {
                    const response = await ApiService.fetchDataWithAxios<EmbeddingResponse>({
                        url: 'ai/v1/embeddings',
                        method: 'post',
                        data: {
                            input: request.input,
                            model: request.model || 'text-embedding-ada-002',
                            encoding_format: request.encodingFormat,
                            user: request.user,
                        },
                    })

                    return response
                } catch (error: any) {
                    if (error.response?.status === 402) {
                        const detail = error.response.data?.detail || ''
                        const match = detail.match(/Current balance: \$(\d+\.?\d*)/)
                        const currentBalance = match ? parseFloat(match[1]) : 0

                        throw new InsufficientCreditsError(
                            error.response.data?.detail || 'Insufficient credits',
                            currentBalance,
                            0.01,
                        )
                    }

                    throw error
                }
            },
            { timeout: 60000 },
        )
    },

    // ==================== Moderation ====================

    async moderateContent(request: ModerationRequest): Promise<ModerationResponse> {
        return retryableRequest(
            async () => {
                try {
                    const response = await ApiService.fetchDataWithAxios<ModerationResponse>({
                        url: 'ai/v1/moderations',
                        method: 'post',
                        data: {
                            input: request.input,
                            model: request.model,
                        },
                    })

                    return response
                } catch (error: any) {
                    if (error.response?.status === 402) {
                        throw new InsufficientCreditsError(
                            'Insufficient credits',
                            0,
                            0.001,
                        )
                    }

                    throw error
                }
            },
            { timeout: 30000 }, // 30 seconds for moderation
        )
    },

    // ==================== Health ====================

    async checkHealth(): Promise<AIHealthStatus> {
        // No retry for health checks - fail fast
        try {
            const response = await ApiService.fetchDataWithAxios<AIHealthStatus>({
                url: 'ai/v1/health',
                method: 'get',
            })

            return {
                ...response,
                lastChecked: new Date().toISOString(),
            }
        } catch (error: any) {
            throw new ServiceUnavailableError('AI service is currently unavailable')
        }
    },

    // ==================== Models List ====================

    async getAvailableModels(): Promise<ModelsListResponse> {
        // No retry needed for model list - fail fast
        const response = await ApiService.fetchDataWithAxios<ModelsListResponse>({
            url: 'ai/v1/models',
            method: 'get',
        })
        return response
    },

    // ==================== API Keys ====================

    async getAPIKeys(): Promise<{
        keys: Array<{
            id: string
            user_id: string
            name: string
            key_prefix: string
            is_active: boolean
            last_used_at: string | null
            created_at: string
            expires_at: string | null
            total_requests: number
            total_cost: number
        }>
        total: number
    }> {
        return retryableRequest(async () => {
            const response = await ApiService.fetchDataWithAxios<any>({
                url: 'api-keys',
                method: 'get',
            })
            return response
        })
    },

    async createAPIKey(request: { name: string; expires_in_days?: number }): Promise<{
        id: string
        name: string
        key: string  // Only shown once!
        key_prefix: string
        created_at: string
        expires_at: string | null
    }> {
        return retryableRequest(async () => {
            const response = await ApiService.fetchDataWithAxios<any>({
                url: 'api-keys',
                method: 'post',
                data: request,
            })
            return response
        })
    },

    async getAPIKey(keyId: string): Promise<{
        id: string
        user_id: string
        name: string
        key_prefix: string
        is_active: boolean
        last_used_at: string | null
        created_at: string
        expires_at: string | null
        total_requests: number
        total_cost: number
    }> {
        return retryableRequest(async () => {
            const response = await ApiService.fetchDataWithAxios<any>({
                url: `api-keys/${keyId}`,
                method: 'get',
            })
            return response
        })
    },

    async revokeAPIKey(keyId: string): Promise<void> {
        return retryableRequest(async () => {
            await ApiService.fetchDataWithAxios({
                url: `api-keys/${keyId}`,
                method: 'delete',
            })
        })
    },
}

export default AIEngineService
