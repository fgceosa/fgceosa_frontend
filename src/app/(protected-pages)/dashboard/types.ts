// Period types for time-based metrics
export type Period = 'weekly' | 'monthly' | 'annually'

// Dashboard metrics for a specific period
export interface PeriodMetrics {
    creditBalance?: number
    apiRequests: number
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

// Model usage distribution
export interface ModelUsage {
    model: string
    count: number
    percentage: number
}

// Main dashboard response from API
export interface DashboardData {
    weekly: PeriodMetrics
    monthly: PeriodMetrics
    annually: PeriodMetrics
    weeklyUsageTrends: WeeklyUsageTrends
    modelUsageDistribution: ModelUsage[]
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

// Keep old types for backward compatibility (will be deprecated)
export type StatisticCategory = 'totalCredit' | 'totalAPIRequest' | 'totalProject' | 'totalSpent'

export type GetEcommerceDashboardResponse = DashboardData

// Activity item for recent activity feed
export type RecentActivityItem = {
    id: string;
    type: string;
    model?: string;
    cost?: string;
    amount?: string;
    user?: string;
    time: string;
    status?: string;
    success: boolean;
};

// Order model for recent orders table
export interface Order {
    id: string;
    status: number;
    date: string;
    customer: string;
    totalAmount: number;
    // If there are more fields needed, add them here
}

// Channel revenue data structure for dashboard
export type ChannelRevenue = {
    [period: string]: {
        value: number;
        growShrink: number;
        percentage: {
            onlineStore: number;
            physicalStore: number;
            socialMedia: number;
        };
    };
};

// Sales target data structure for dashboard
export type SalesTargetData = {
    [period: string]: {
        target: number;
        achieved: number;
        percentage: number;
    };
};

// Top product model
export interface Product {
    id: string;
    name: string;
    productCode: string;
    img: string;
    sales: number;
    growShrink: number;
}
