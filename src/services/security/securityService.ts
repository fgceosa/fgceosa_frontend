import ApiService from '../ApiService'
import type {
    SecurityStats,
    SecurityEventsResponse,
    SecurityEventListParams,
    AdminActionParams,
    SecurityEvent,
    ApiKey,
} from '@/app/(protected-pages)/admin/security/types'

export async function apiGetSecurityStats() {
    return ApiService.fetchDataWithAxios<SecurityStats>({
        url: '/security/stats',
        method: 'get',
    })
}

export async function apiGetSecurityEvents(params?: SecurityEventListParams) {
    const queryParams = new URLSearchParams()
    if (params?.pageIndex) queryParams.append('page', params.pageIndex.toString())
    if (params?.pageSize) queryParams.append('limit', params.pageSize.toString())
    if (params?.query) queryParams.append('search', params.query)
    if (params?.severity) queryParams.append('severity', params.severity)
    if (params?.type) queryParams.append('type', params.type)
    if (params?.status) queryParams.append('status', params.status)

    const queryString = queryParams.toString()
    const url = queryString ? `/security/events?${queryString}` : '/security/events'

    return ApiService.fetchDataWithAxios<SecurityEventsResponse>({
        url,
        method: 'get',
    })
}

export async function apiUpdateEventStatus(id: string, status: string) {
    // Basic mapping of status to action
    // Currently only 'investigating' is widely used in frontend logic to trigger status update
    let action = 'investigate'
    if (status === 'resolved') action = 'block'

    return ApiService.fetchDataWithAxios<SecurityEvent>({
        url: `/security/events/${id}/action`,
        method: 'post',
        data: { action },
    })
}

export async function apiPerformAdminAction(data: AdminActionParams) {
    return ApiService.fetchDataWithAxios<{ success: boolean; message: string }>({
        url: '/security/admin-action',
        method: 'post',
        data: data as any,
    })
}

export interface SecurityApiKeysResponse {
    keys: ApiKey[]
    total: number
}

export async function apiGetMonitoredApiKeys(params: { page: number; limit: number; search?: string }) {
    const queryParams = new URLSearchParams({
        page: params.page.toString(),
        limit: params.limit.toString(),
    })
    if (params.search) queryParams.append('search', params.search)

    return ApiService.fetchDataWithAxios<SecurityApiKeysResponse>({
        url: `/security/keys?${queryParams.toString()}`,
        method: 'get',
    })
}
export async function apiUpdateSecurityConfig(data: any) {
    return ApiService.fetchDataWithAxios<{ success: boolean; message: string }>({
        url: '/security/config',
        method: 'patch',
        data,
    })
}

export async function apiTerminateAllSessions() {
    return ApiService.fetchDataWithAxios<{ success: boolean; message: string }>({
        url: '/security/sessions/terminate-all',
        method: 'post',
    })
}

export async function apiRunSecurityScan() {
    return ApiService.fetchDataWithAxios<{ success: boolean; message: string }>({
        url: '/security/scan',
        method: 'post',
    })
}
