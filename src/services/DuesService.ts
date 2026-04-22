import ApiService from './ApiService'

export interface Due {
    id: string
    title: string
    amount: string
    due_date: string
    description: string | null
    is_active: boolean
    created_at: string
}

export interface DueCreate {
    title: string
    amount: number
    due_date: string
    description?: string
    is_active?: boolean
}

export interface DueUpdate {
    title?: string
    amount?: number
    due_date?: string
    description?: string
    is_active?: boolean
}

export async function apiGetDues() {
    return ApiService.fetchDataWithAxios<Due[]>({
        url: 'dues',
        method: 'get',
    })
}

export async function apiCreateDue(data: DueCreate) {
    return ApiService.fetchDataWithAxios<Due>({
        url: 'dues',
        method: 'post',
        data,
    })
}

export async function apiUpdateDue(id: string, data: DueUpdate) {
    return ApiService.fetchDataWithAxios<Due>({
        url: `dues/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteDue(id: string) {
    return ApiService.fetchDataWithAxios<{ message: string }>({
        url: `dues/${id}`,
        method: 'delete',
    })
}
