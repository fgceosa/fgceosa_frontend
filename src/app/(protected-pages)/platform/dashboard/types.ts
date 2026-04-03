// Period types for time-based metrics
export type Period = 'weekly' | 'monthly' | 'annually'

// Dashboard metrics for a specific period (Overview Cards)
export interface PeriodMetrics {
    totalRevenue?: number
    apiRequests: number
    activeUsers?: number
    avgRevenuePerUser?: number
    tokenUsage?: number
    aiAgents?: number
    creditBalance?: number
    spending?: number
    activeProjects?: number
    spendingTrend?: string
}

// Weekly usage trends data for charts
export interface WeeklyUsageTrends {
    series: Array<{
        name: string
        data: number[]
    }>
    dates: string[]
}

// Model usage distribution (Revenue Breakdown)
export interface ModelUsage {
    model: string
    count: number // or value for breakdown
    percentage: number
    color?: string
}

// Top Workspace Data
export interface TopWorkspace {
    id: string
    name: string
    revenue: number
    tokens: string | number
    icon?: string
}

// Activity Feed Item
export interface ActivityItem {
    id: string | number
    type: 'key' | 'user' | 'contract' | 'system'
    content: string
    time: string
    icon?: any // Lucide icon name or component
    color?: string
    bg?: string
}

// System Health Data
export interface SystemHealthData {
    uptime: number
    status: 'ONLINE' | 'OFFLINE' | 'DEGRADED'
    latency: number
    successRate: number
}

// Main dashboard response from API
export interface DashboardData {
    weekly: PeriodMetrics
    monthly: PeriodMetrics
    annually: PeriodMetrics
    weeklyUsageTrends: WeeklyUsageTrends
    modelUsageDistribution: ModelUsage[]
    topWorkspaces: TopWorkspace[]
    activities: ActivityItem[]
    systemHealth: SystemHealthData
}

// Project model
export interface Project {
    id: string
    name: string
    description: string | null
    user_id: string
    is_active: boolean
    created_at: string
    updated_at: string
}

// API Request model
export interface APIRequest {
    id: string
    project_id: string
    user_id: string
    model: string
    endpoint: string
    request_tokens: number
    response_tokens: number
    total_tokens: number
    cost: number
    status: string
    response_time_ms: number | null
    created_at: string
}

// Credit Transaction model
export interface CreditTransaction {
    id: string
    user_id: string
    amount: number
    balance_after: number
    transaction_type: string
    description: string | null
    reference_id: string | null
    created_at: string
}

// Credit balance response
export interface CreditBalanceResponse {
    balance: number
}
