import ApiService from './ApiService'
import type {
    AuditLogListResponse,
    AuditLogStats,
    AuditLogFilterParams
} from '@/app/(protected-pages)/admin/audit-log/types'

export async function apiGetAuditLogs(params: AuditLogFilterParams) {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.page_size) queryParams.append('page_size', params.page_size.toString())
    if (params.search) queryParams.append('search', params.search)
    if (params.actor_id) queryParams.append('actor_id', params.actor_id)
    if (params.organization_id) queryParams.append('organization_id', params.organization_id)
    if (params.action_type) queryParams.append('action_type', params.action_type)
    if (params.severity) queryParams.append('severity', params.severity)
    if (params.status) queryParams.append('status', params.status)
    if (params.start_date) queryParams.append('start_date', params.start_date)
    if (params.end_date) queryParams.append('end_date', params.end_date)

    const queryString = queryParams.toString()
    const url = queryString ? `audit-logs?${queryString}` : 'audit-logs'

    return ApiService.fetchDataWithAxios<AuditLogListResponse>({
        url,
        method: 'get',
    })
}

export async function apiGetAuditStats(range: string = '24h', organizationId?: string) {
    const queryParams = new URLSearchParams()
    if (range) queryParams.append('range', range)
    if (organizationId) queryParams.append('organization_id', organizationId)

    const queryString = queryParams.toString()
    const url = queryString ? `audit-logs/stats?${queryString}` : 'audit-logs/stats'

    return ApiService.fetchDataWithAxios<AuditLogStats>({
        url,
        method: 'get',
    })
}

export async function apiExportAuditLogs(params: AuditLogFilterParams) {
    const queryParams = new URLSearchParams()
    if (params.search) queryParams.append('search', params.search)
    if (params.actor_id) queryParams.append('actor_id', params.actor_id)
    if (params.organization_id) queryParams.append('organization_id', params.organization_id)
    if (params.action_type) queryParams.append('action_type', params.action_type)
    if (params.severity) queryParams.append('severity', params.severity)
    if (params.status) queryParams.append('status', params.status)
    if (params.start_date) queryParams.append('start_date', params.start_date)
    if (params.end_date) queryParams.append('end_date', params.end_date)

    const queryString = queryParams.toString()
    const url = queryString ? `audit-logs/export?${queryString}` : 'audit-logs/export'

    return ApiService.fetchDataWithAxios<Blob>({
        url,
        method: 'get',
        responseType: 'blob',
    })
}
