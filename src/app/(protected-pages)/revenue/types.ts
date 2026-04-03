export interface KPI {
    label: string
    amount: number
    change: number
    trend: 'up' | 'down' | 'neutral'
    type: 'positive' | 'neutral' | 'negative' | 'warning'
}

export interface RevenueChartData {
    month: string
    revenue: number
    costs: number
    trend: number
}

export interface WorkspaceRevenue {
    id: string
    name: string
    revenue: number
    share: number
}

export interface ModelRevenue {
    id: string
    model: string
    provider: string
    revenue: number
    usage: number
    growth: number
}

export interface Transaction {
    id: string
    date: string
    organization: string
    organizationAvatar?: string
    amount: number
    type: 'credit_purchase' | 'usage_billing' | 'refund'
    status: 'Completed' | 'Pending' | 'Failed'
}

export interface RevenuePageData {
    kpi: {
        totalRevenue: KPI
        modelCosts: KPI
        netProfit: KPI
        outstandingPayments: KPI
        creditsSold: KPI
        creditsConsumed: KPI
        grossMargin: KPI
        activeOrganizations: KPI
    }
    chartData: RevenueChartData[]
    revenueByWorkspace: WorkspaceRevenue[]
    topModels: ModelRevenue[]
    recentTransactions: Transaction[]
    revenueBySource: {
        source: string
        amount: number
        percentage: number
    }[]
    costByProvider: {
        provider: string
        creditsConsumed: number
        cost: number
        revenue: number
        margin: number
    }[]
    topSpenders: {
        organization: string
        spend: number
        creditsUsed: number
        lastActivity: string
        status: 'Active' | 'At Risk' | 'Inactive'
    }[]
    creditFlow: {
        issued: number
        transferred: number
        consumed: number
        remaining: number
    }
}

export type RevenuePeriod = 'weekly' | 'monthly' | 'annually'
