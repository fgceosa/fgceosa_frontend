import ApiService from '../ApiService'

export async function apiGetAnnouncements<T, U extends Record<string, unknown>>(params?: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/announcements',
        method: 'get',
        params,
    })
}

export async function apiCreateAnnouncement<T, U extends Record<string, unknown>>(data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/announcements',
        method: 'post',
        data,
    })
}

export async function apiUpdateAnnouncement<T, U extends Record<string, unknown>>(id: string, data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/announcements/${id}`,
        method: 'put',
        data,
    })
}

export async function apiRecordAnnouncementView<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/announcements/${id}/view`,
        method: 'post',
    })
}

export async function apiDeleteAnnouncement<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/announcements/${id}`,
        method: 'delete',
    })
}
