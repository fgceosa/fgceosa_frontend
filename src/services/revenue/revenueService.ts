import ApiService from '../ApiService'
import type { RevenuePageData, RevenuePeriod } from '@/app/(protected-pages)/revenue/types'

export async function apiGetRevenueData(period: RevenuePeriod = 'monthly') {
    return ApiService.fetchDataWithAxios<RevenuePageData>({
        url: `/admin/revenue?period=${period}`,
        method: 'get',
    })
}
