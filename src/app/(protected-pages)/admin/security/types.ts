export interface SecurityStats {
    securityScore: number
    activeThreats: number
    blockedAttacks: number
    activeMonitoring: number
    scoreTrend: string
    threatsTrend: string
    blockedTrend: string
    monitoringTrend: string
    // Session monitoring metrics
    activeSessions: number
    failedLogins24h: number
    suspiciousPatterns: number
    // Analytics card metrics
    highPriority: number
    apiAbuseAttempts: number
    fraudIncidents: number
    // Security configuration
    securityConfig: SecurityControlConfig
    policySnapshot: PolicySnapshotData
}

export type SecurityEventType = 'api_abuse' | 'token_spike' | 'fraud' | 'ip_anomaly' | 'role_violation' | 'login_attempt' | 'policy_violation'
export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical'
export type SecurityStatus = 'open' | 'investigating' | 'resolved' | 'dismissed'

export interface SecurityEvent {
    id: string
    type: SecurityEventType
    severity: SecuritySeverity
    description: string
    sourceIp: string
    location: string
    timestamp: string
    status: SecurityStatus
    user?: {
        name: string
        email: string
        id: string
        avatar?: string
    }
    metadata?: Record<string, any>
    assignedTo?: {
        id: string
        name: string
        avatar?: string
    } // New: Incident ownership
    notes?: string // New: Internal notes
}

export interface ApiKeyUsage {
    id: string
    keyName: string
    keyPrefix: string
    owner: string
    ownerId: string
    lastUsed: string
    requestCount: number
    status: 'active' | 'revoked' | 'leaked' | 'suspended'
    abuseScore: number // 0-100
    dailyLimit: number
}

export type ApiKey = ApiKeyUsage

export interface SecurityEventListParams {
    pageIndex?: number
    pageSize?: number
    query?: string
    severity?: string
    type?: string
    status?: string
}

export interface SecurityEventsResponse {
    events: SecurityEvent[]
    total: number
}

export interface AdminActionParams {
    userId: string
    action: 'lock_account' | 'enforce_limit' | 'require_verification' | 'reset_api_keys'
    reason: string
}

// New Types for Security Command Center

export interface SecurityControlConfig {
    mfaEnforced: boolean
    sessionTimeoutMins: number
    passwordStrength: 'standard' | 'strong' | 'complex'
    ipAllowlistEnabled: boolean
}

export interface SessionMetrics {
    activeSessions: number
    failedLogins24h: number
    suspiciousPatterns: number
}

export interface PolicySnapshotData {
    mfaStatus: 'enabled' | 'enforced' | 'optional'
    apiAbuseProtection: 'active' | 'learning' | 'disabled'
    geoRestrictions: string[]
    rateLimitPolicy: string
}

