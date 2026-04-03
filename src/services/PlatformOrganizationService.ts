import ApiService from './ApiService'
import type {
    PlatformOrgAnalytics,
    PlatformOrgListResponse,
    PlatformOrgDetail
} from '../app/(protected-pages)/platform/organizations/types'

export async function apiGetPlatformOrgAnalytics() {
    return ApiService.fetchDataWithAxios<PlatformOrgAnalytics>({
        url: '/admin/organizations/analytics',
        method: 'get',
    })
}

export async function apiGetPlatformOrganizations(params: {
    page?: number
    page_size?: number
    search?: string
    status?: string
}) {
    return ApiService.fetchDataWithAxios<PlatformOrgListResponse>({
        url: '/admin/organizations',
        method: 'get',
        params,
    })
}

export async function apiGetPlatformOrgDetail(orgId: string) {
    return ApiService.fetchDataWithAxios<PlatformOrgDetail>({
        url: `/admin/organizations/${orgId}`,
        method: 'get',
    })
}

export async function apiUpdatePlatformOrg(orgId: string, data: any) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/admin/organizations/${orgId}`,
        method: 'patch',
        data,
    })
}

export async function apiAllocateOrgCredits(orgId: string, data: {
    adjustment_type: 'add' | 'deduct'
    amount: number
    reason_category: string
    reason_description: string
    notify_organization: boolean
}) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/admin/organizations/${orgId}/credits/allocate`,
        method: 'post',
        data,
    })
}

export async function apiCreateOrganizationWithAdmin(data: {
    name: string
    description?: string
    admin_email: string
    admin_name: string
}) {
    return ApiService.fetchDataWithAxios<any>({
        url: '/admin/organizations/create-with-admin',
        method: 'post',
        data,
    })
}

export async function apiDeleteOrganization(orgId: string) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/admin/organizations/${orgId}`,
        method: 'delete',
    })
}

