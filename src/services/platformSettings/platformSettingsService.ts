import ApiService from '../ApiService'
import type { PlatformSettingsData } from '@/app/(protected-pages)/admin/platform-settings/types'

/**
 * Get platform settings
 */
export async function apiGetPlatformSettings() {
    return ApiService.fetchDataWithAxios<PlatformSettingsData>({
        url: '/admin/platform-settings',
        method: 'get',
    })
}

/**
 * Get public platform settings (unauth)
 */
export async function apiGetPublicPlatformSettings() {
    return ApiService.fetchDataWithAxios<Partial<PlatformSettingsData>>({
        url: '/admin/platform-settings/public',
        method: 'get',
    })
}

/**
 * Update platform settings
 */
export async function apiUpdatePlatformSettings(data: PlatformSettingsData) {
    return ApiService.fetchDataWithAxios<PlatformSettingsData>({
        url: '/admin/platform-settings',
        method: 'patch',
        data: data as unknown as Record<string, unknown>,
    })
}
