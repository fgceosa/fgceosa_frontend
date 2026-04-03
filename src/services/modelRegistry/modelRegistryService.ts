import ApiService from '../ApiService'
import type {
    RegistryModel,
    RegistryAnalytics,
    RegistryProvider
} from '@/app/(protected-pages)/hq/model-registry/types'

export async function apiGetRegistryModels() {
    return ApiService.fetchDataWithAxios<{ models: RegistryModel[], total: number }>({
        url: '/registry/models',
        method: 'get'
    })
}

export async function apiGetRegistryModel(id: string) {
    return ApiService.fetchDataWithAxios<RegistryModel>({
        url: `/registry/models/${id}`,
        method: 'get'
    })
}

export async function apiGetRegistryAnalytics() {
    return ApiService.fetchDataWithAxios<RegistryAnalytics>({
        url: '/registry/analytics',
        method: 'get'
    })
}

export async function apiGetRegistryProviders() {
    return ApiService.fetchDataWithAxios<{ providers: RegistryProvider[], total: number }>({
        url: '/registry/providers',
        method: 'get'
    })
}

export async function apiRegisterModel(data: Partial<RegistryModel>) {
    return ApiService.fetchDataWithAxios<RegistryModel>({
        url: '/registry/register',
        method: 'post',
        data
    })
}

export async function apiUpdateModelRegistry(id: string, data: Partial<RegistryModel>) {
    return ApiService.fetchDataWithAxios<RegistryModel>({
        url: `/registry/update/${id}`,
        method: 'patch',
        data
    })
}

export async function apiSyncRequestyModels() {
    return ApiService.fetchDataWithAxios<{ status: string, created: number, updated: number, total_fetched: number }>({
        url: '/registry/sync-requesty',
        method: 'post'
    })
}

export async function apiTestModelConnection(id: string) {
    return ApiService.fetchDataWithAxios<{ status: string, message: string, model: string }>({
        url: `/registry/test-connection/${id}`,
        method: 'post'
    })
}

// Organization Model Library Endpoints

export async function apiGetOrgLibraryModels(search?: string) {
    return ApiService.fetchDataWithAxios<{ models: any[] }>({
        url: '/organizations/models',
        method: 'get',
        params: { search }
    })
}

export async function apiGetOrgLibraryModel(id: string) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/organizations/models/${id}`,
        method: 'get'
    })
}

export async function apiToggleOrgModelStatus(id: string, isEnabled: boolean) {
    return ApiService.fetchDataWithAxios<{ success: boolean, model: any }>({
        url: `/organizations/models/${id}/toggle`,
        method: 'post',
        data: { isEnabled }
    })
}

export async function apiSetOrgModelDefault(id: string) {
    return ApiService.fetchDataWithAxios<{ success: boolean, previousDefaultId?: string }>({
        url: `/organizations/models/${id}/set-default`,
        method: 'post'
    })
}

export async function apiGetOrgModelAnalytics() {
    return ApiService.fetchDataWithAxios<{
        totalSpend: number,
        spendChangePercentage: number,
        enabledCount: number,
        activeCount: number,
        mostPopularModelName: string
    }>({
        url: '/organizations/analytics/models',
        method: 'get'
    })
}
