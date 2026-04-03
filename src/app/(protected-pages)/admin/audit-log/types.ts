export interface AuditLogEntry {
    id: string
    timestamp: string
    actorName: string | null
    actorRole: string | null
    actorType: 'human' | 'system' | 'automation'
    action: string
    targetType: string | null
    targetId: string | null
    ipAddress: string | null
    location: string | null
    severity: 'low' | 'medium' | 'high' | 'critical'
    status: 'success' | 'failed' | 'partially_completed'
    organizationId: string | null
    metaData: Record<string, any>
    authMethod: string | null
    requestSource: 'ui' | 'api' | 'job'
    correlationId: string | null
}

export interface AuditLogStats {
    totalEvents: number
    criticalActions: number
    adminActions: number
    securitySensitive: number
    failedActions: number
}

export interface AuditLogListResponse {
    logs: AuditLogEntry[]
    total: number
}

export interface AuditLogFilterParams {
    page?: number
    page_size?: number
    search?: string
    actor_id?: string
    organization_id?: string
    action_type?: string
    severity?: string
    status?: string
    start_date?: string
    end_date?: string
}
