import ApiService from './ApiService'
import type { InviteOrganizationMemberPayload, UpdateOrganizationMemberPayload } from '@/app/(protected-pages)/organizations/types'

export async function apiGetOrganizationTeam(organizationId: string, page = 1, search = '') {
    return ApiService.fetchDataWithAxios<any>({
        url: `organizations/${organizationId}/team`,
        method: 'get',
        params: { page, search, _t: Date.now() } // Add cache buster
    })
}

export async function apiGetOrganizationWorkspaces(organizationId: string) {
    // Fetches all workspaces the current user can see; then filters by org on the frontend
    // (Backend already filters by org for org_super_admin via list_workspaces)
    return ApiService.fetchDataWithAxios<any>({
        url: `workspaces`,
        method: 'get',
        params: { page: 1, page_size: 100 }
    })
}

export async function apiInviteOrganizationMember(data: InviteOrganizationMemberPayload) {
    return ApiService.fetchDataWithAxios<any>({
        url: `organizations/${data.organizationId}/team/invite`,
        method: 'post',
        data
    })
}

export async function apiUpdateOrganizationMember(data: UpdateOrganizationMemberPayload) {
    return ApiService.fetchDataWithAxios<any>({
        url: `organizations/${data.organizationId}/team/${data.memberId}`,
        method: 'put',
        data: { role: data.role }
    })
}

export async function apiRemoveOrganizationMember(organizationId: string, memberId: string) {
    return ApiService.fetchDataWithAxios<any>({
        url: `organizations/${organizationId}/team/${memberId}`,
        method: 'delete'
    })
}

export async function apiGetOrganizationRoles(organizationId: string) {
    return ApiService.fetchDataWithAxios<any>({
        url: `organizations/${organizationId}/roles`,
        method: 'get'
    })
}

export async function apiCreateOrganizationRole(organizationId: string, data: any) {
    return ApiService.fetchDataWithAxios<any>({
        url: `organizations/${organizationId}/roles`,
        method: 'post',
        data
    })
}

export async function apiUpdateOrganizationRole(organizationId: string, roleId: string, data: any) {
    return ApiService.fetchDataWithAxios<any>({
        url: `organizations/${organizationId}/roles/${roleId}`,
        method: 'put',
        data
    })
}

export async function apiDeleteOrganizationRole(organizationId: string, roleId: string) {
    return ApiService.fetchDataWithAxios<any>({
        url: `organizations/${organizationId}/roles/${roleId}`,
        method: 'delete'
    })
}

export async function apiGetMyOrganization() {
    return ApiService.fetchDataWithAxios<any>({
        url: 'organizations/me',
        method: 'get'
    })
}

export async function apiAcceptOrganizationInvitation(token: string) {
    return ApiService.fetchDataWithAxios<any>({
        url: 'organizations/invitation/accept',
        method: 'post',
        data: { token }
    })
}

export async function apiVerifyOrganizationInvitation(token: string) {
    return ApiService.fetchDataWithAxios<any>({
        url: 'organizations/invitation/verify',
        method: 'get',
        params: { token }
    })
}

export async function apiGetOrganizationCreditBalance(organizationId: string) {
    return ApiService.fetchDataWithAxios<any>({
        url: `organizations/${organizationId}/credits/balance`,
        method: 'get'
    })
}

export async function apiGetOrganizationCreditTransactions(organizationId: string, page = 1) {
    return ApiService.fetchDataWithAxios<any>({
        url: `organizations/${organizationId}/credits/transactions`,
        method: 'get',
        params: { page }
    })
}

export async function apiGetOrganizationUsageSummary(organizationId: string, days = 30) {
    const url = `organizations/${organizationId}/credits/usage-summary`
    console.log('📡 [apiGetOrganizationUsageSummary] Calling:', {
        url,
        params: { days },
        fullUrl: `${ApiService.fetchDataWithAxios.name === 'fetchDataWithAxios' ? '???' : ''}${url}`
    })
    return ApiService.fetchDataWithAxios<any>({
        url,
        method: 'get',
        params: { days }
    })
}
export async function apiGetOrganizationActivity(organizationId: string, page = 1, page_size = 50) {
    return ApiService.fetchDataWithAxios<any>({
        url: 'audit-logs',
        method: 'get',
        params: {
            organization_id: organizationId,
            page,
            page_size,
            _t: Date.now()
        }
    })
}

export async function apiUpdateOrganization(data: any) {
    return ApiService.fetchDataWithAxios<any>({
        url: 'organizations/me',
        method: 'patch',
        data
    })
}
