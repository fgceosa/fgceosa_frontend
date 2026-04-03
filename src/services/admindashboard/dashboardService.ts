import ApiService from '../ApiService'
import type {
    DashboardData,
    PeriodMetrics,
    WeeklyUsageTrends,
    ModelUsage,
    CreditBalanceResponse,
    Project,
    APIRequest,
    CreditTransaction,
} from '@/app/(protected-pages)/admin-dashboard/types'

/**
 * Fetch complete dashboard data
 * Returns weekly, monthly, annually metrics, usage trends, and model distribution
 */
export async function apiGetDashboardData() {
    return ApiService.fetchDataWithAxios<DashboardData>({
        url: '/dashboard',
        method: 'get',
    })
}

/**
 * Get dashboard metrics for a specific period
 * @param period - 'week', 'month', or 'year'
 */
export async function apiGetDashboardMetrics(period: 'week' | 'month' | 'year' = 'week') {
    return ApiService.fetchDataWithAxios<PeriodMetrics>({
        url: `/dashboard/metrics?period=${period}`,
        method: 'get',
    })
}

/**
 * Get weekly usage trends - API requests and costs over last 7 days
 * Returns data formatted for chart visualization
 */
export async function apiGetWeeklyTrends() {
    return ApiService.fetchDataWithAxios<WeeklyUsageTrends>({
        url: '/dashboard/weekly-trends',
        method: 'get',
    })
}

/**
 * Get model usage distribution by AI model
 * Returns model name, count, and percentage
 */
export async function apiGetModelUsage() {
    return ApiService.fetchDataWithAxios<ModelUsage[]>({
        url: '/dashboard/model-usage',
        method: 'get',
    })
}

/**
 * Get current credit balance
 */
export async function apiGetCreditBalance() {
    return ApiService.fetchDataWithAxios<CreditBalanceResponse>({
        url: '/dashboard/credit-balance',
        method: 'get',
    })
}

/**
 * Get all active projects
 */
export async function apiGetActiveProjects() {
    return ApiService.fetchDataWithAxios<Project[]>({
        url: '/dashboard/active-projects',
        method: 'get',
    })
}

/**
 * Get recent credit transaction history
 * @param limit - Number of transactions to return (default: 10)
 */
export async function apiGetCreditHistory(limit: number = 10) {
    return ApiService.fetchDataWithAxios<CreditTransaction[]>({
        url: `/dashboard/credit-history?limit=${limit}`,
        method: 'get',
    })
}

/**
 * Get recent API requests
 * @param limit - Number of requests to return (default: 20)
 */
export async function apiGetRecentRequests(limit: number = 20) {
    return ApiService.fetchDataWithAxios<APIRequest[]>({
        url: `/dashboard/recent-requests?limit=${limit}`,
        method: 'get',
    })
}
