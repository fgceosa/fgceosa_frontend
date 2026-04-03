import ApiService from '../ApiService'
import type {
    ApiKey,
    ApiKeysStats,
    CreateApiKeyRequest,
    CreateApiKeyResponse,
} from '@/app/(protected-pages)/dashboard/api-keys/types'

export interface GetApiKeysResponse {
    keys: ApiKey[]
    total: number
}

// Backend response type (matches what the API actually returns)
interface BackendApiKey {
    id: string
    user_id: string
    name: string
    key_prefix: string
    is_active: boolean
    last_used_at: string | null
    created_at: string
    expires_at: string | null
    total_requests: number
    total_cost: string | number
    project_id?: string | null
    project_name?: string | null
    allowed_ips?: string | null
    allowed_domains?: string | null
}

interface BackendApiKeysResponse {
    keys: BackendApiKey[]
    total: number
}

/**
 * Transform backend API key to frontend format
 * Keeps dates as ISO strings for Redux serialization
 */
function transformApiKey(backendKey: BackendApiKey): ApiKey {
    return {
        id: backendKey.id,
        name: backendKey.name,
        maskedKey: `${backendKey.key_prefix}${'*'.repeat(32)}`,
        created: backendKey.created_at, // Keep as ISO string
        lastUsed: backendKey.last_used_at, // Keep as ISO string or null
        requests: backendKey.total_requests,
        status: backendKey.is_active ? 'active' : 'revoked',
        usage: typeof backendKey.total_cost === 'string'
            ? parseFloat(backendKey.total_cost)
            : backendKey.total_cost,
        creditLimit: null, // Not provided by backend yet
        resetPeriod: null, // Not provided by backend yet
        rateLimit: 'No limit', // Not provided by backend yet
        environment: 'production', // Default to production
        expiresAt: backendKey.expires_at, // Keep as ISO string or null
        projectId: backendKey.project_id,
        projectName: backendKey.project_name,
        allowedIps: backendKey.allowed_ips,
        allowedDomains: backendKey.allowed_domains,
    }
}

/**
 * Get all API keys for the current user
 */
export async function apiGetApiKeys() {
    const response = await ApiService.fetchDataWithAxios<BackendApiKeysResponse>({
        url: '/api-keys',
        method: 'get',
    })

    // Transform backend response to frontend format
    return {
        keys: response.keys.map(transformApiKey),
        total: response.total,
    }
}

/**
 * Get API keys statistics
 * Calculate stats from the keys list since backend doesn't have a separate stats endpoint
 */
export async function apiGetApiKeysStats() {
    const response = await apiGetApiKeys()

    const stats: ApiKeysStats = {
        totalKeys: response.total,
        activeKeys: response.keys.filter(k => k.status === 'active').length,
        totalRequests: response.keys.reduce((sum, k) => sum + (k.requests || 0), 0),
        totalUsage: response.keys.reduce((sum, k) => sum + (k.usage || 0), 0),
        rateStatus: 'normal', // Default to normal
    }

    return stats
}

// Backend response when creating an API key
interface BackendCreateApiKeyResponse {
    id: string
    name: string
    key: string
    key_prefix: string
    created_at: string
    expires_at: string | null
}

/**
 * Create a new API key
 */
export async function apiCreateApiKey(data: CreateApiKeyRequest) {
    const response = await ApiService.fetchDataWithAxios<BackendCreateApiKeyResponse>({
        url: '/api-keys',
        method: 'post',
        data: {
            name: data.name,
            expires_in_days: data.expiration ? parseInt(data.expiration) : undefined,
            allowed_ips: data.allowedIps,
            allowed_domains: data.allowedDomains,
        },
    })

    // Transform backend response to frontend format
    // Keep dates as ISO strings for Redux serialization
    return {
        id: response.id,
        key: response.key,
        maskedKey: `${response.key_prefix}${'*'.repeat(32)}`,
        name: response.name,
        created: response.created_at, // Keep as ISO string
        environment: data.environment,
    } as CreateApiKeyResponse
}

/**
 * Delete/Revoke an API key (marks as inactive)
 * Backend uses DELETE to revoke keys
 */
export async function apiDeleteApiKey(id: string) {
    return ApiService.fetchDataWithAxios<void>(
        {
            url: `/api-keys/${id}`,
            method: 'delete',
        },
    )
}

/**
 * Revoke an API key (alias for delete)
 * Both operations do the same thing - mark key as inactive
 */
export async function apiRevokeApiKey(id: string) {
    return apiDeleteApiKey(id)
}

/**
 * Update API key settings
 */
export async function apiUpdateApiKey(
    id: string,
    data: Partial<CreateApiKeyRequest>,
) {
    return ApiService.fetchDataWithAxios<ApiKey>({
        url: `/api-keys/${id}`,
        method: 'patch',
        data,
    })
}
