import ApiService from './ApiService'

import type { NotificationsResponse, NotificationRemote } from '@/@types/notifications'

export async function apiGetNotifications(params?: { skip?: number, limit?: number, unread_only?: boolean }): Promise<NotificationsResponse> {
    return ApiService.fetchDataWithAxios<NotificationsResponse>({
        url: 'notifications',
        method: 'get',
        params,
    })
}

export async function apiMarkNotificationRead(id: string) {
    return ApiService.fetchDataWithAxios<{ id: string }>({
        url: `notifications/${id}/read`,
        method: 'patch',
    })
}

export async function apiMarkAllNotificationsRead() {
    return ApiService.fetchDataWithAxios<{ message: string }>({
        url: 'notifications/read-all',
        method: 'patch',
    })
}

export async function apiDeleteNotification(id: string) {
    return ApiService.fetchDataWithAxios<{ message: string }>({
        url: `notifications/${id}`,
        method: 'delete',
    })
}


export async function apiGetSearchResult<T>(params: { query: string }) {
    return ApiService.fetchDataWithAxios<T>({
        url: 'search',
        method: 'get',
        params,
    })
}
