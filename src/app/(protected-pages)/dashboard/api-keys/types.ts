export type MetricType = 'totalApiKeys' | 'totalRequests' | 'rateStatus'

export type ApiKeyStatus = 'active' | 'revoked' | 'expired'
export type ResetPeriod = 'none' | 'daily' | 'weekly'
export type Environment = 'production' | 'development' | 'testing'
export type RateStatus = 'normal' | 'warning' | 'critical'

export interface ApiKey {
    id: string
    name: string
    key?: string // Only shown once after creation
    maskedKey: string // For display in lists
    created: string // ISO date string (Redux serializable)
    lastUsed: string | null // ISO date string
    requests: number
    status: ApiKeyStatus
    usage: number // in credits
    creditLimit: number | null
    resetPeriod: ResetPeriod | null
    rateLimit: string
    environment: Environment
    expiresAt: string | null // ISO date string
    projectId?: string | null
    projectName?: string | null
    allowedIps?: string | null
    allowedDomains?: string | null
}

export interface CreateApiKeyRequest {
    name: string
    creditLimit?: number
    resetLimit?: ResetPeriod
    expiration?: string
    environment: Environment
    allowedIps?: string
    allowedDomains?: string
}

export interface CreateApiKeyResponse {
    id: string
    key: string // Full key shown only once
    maskedKey: string
    name: string
    created: string // ISO date string (Redux serializable)
    environment: Environment
}

export interface ApiKeysStats {
    totalKeys: number
    activeKeys: number
    totalRequests: number
    totalUsage: number
    rateStatus: RateStatus
}

export interface CreateApiKeyProps {
    open: boolean
    onClose: () => void
    onSuccess?: () => void
}

export type Step = 'form' | 'generated'

// Legacy type for backward compatibility during migration
export type ApiKeysListType = ApiKey