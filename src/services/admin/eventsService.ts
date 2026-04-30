import ApiService from '../ApiService'

export async function apiGetEvents(): Promise<any[]> {
    return ApiService.fetchDataWithAxios({
        url: 'events',
        method: 'get'
    })
}

export async function apiCreateEvent(data: any): Promise<any> {
    return ApiService.fetchDataWithAxios({
        url: 'events',
        method: 'post',
        data
    })
}

export async function apiUpdateEvent(id: string, data: any): Promise<any> {
    return ApiService.fetchDataWithAxios({
        url: `events/${id}`,
        method: 'put',
        data
    })
}

export async function apiDeleteEvent(id: string): Promise<any> {
    return ApiService.fetchDataWithAxios({
        url: `events/${id}`,
        method: 'delete'
    })
}

export async function apiRegisterForEvent(eventId: string, data?: { notes?: string, attendees_count?: number }): Promise<any> {
    return ApiService.fetchDataWithAxios({
        url: `events/${eventId}/register`,
        method: 'post',
        data
    })
}

export async function apiGetEventRegistrants(eventId: string): Promise<any[]> {
    return ApiService.fetchDataWithAxios({
        url: `events/${eventId}/registrants`,
        method: 'get'
    })
}

export async function apiGetMyRegistrations(): Promise<any[]> {
    return ApiService.fetchDataWithAxios({
        url: 'events/my-registrations',
        method: 'get'
    })
}
