import { RevenuePageData } from '@/app/(protected-pages)/revenue/types'

export const mockRevenueData: RevenuePageData = {
    kpi: {
        totalRevenue: {
            label: 'This Month',
            amount: 15420000,
            change: 12.5,
            trend: 'up',
            type: 'positive'
        },
        modelCosts: {
            label: 'Total Cost',
            amount: 4250000,
            change: 5.2,
            trend: 'up',
            type: 'neutral'
        },
        netProfit: {
            label: 'Net Profit',
            amount: 11170000,
            change: 15.8,
            trend: 'up',
            type: 'positive'
        },
        outstandingPayments: {
            label: 'Overdue',
            amount: 850000,
            change: -2.4,
            trend: 'down',
            type: 'warning'
        },
        creditsSold: {
            label: 'Credits Sold',
            amount: 25000000,
            change: 8.4,
            trend: 'up',
            type: 'positive'
        },
        creditsConsumed: {
            label: 'Consumed',
            amount: 18500000,
            change: 10.2,
            trend: 'up',
            type: 'neutral'
        },
        grossMargin: {
            label: 'Gross Margin',
            amount: 72.4,
            change: 2.1,
            trend: 'up',
            type: 'positive'
        },
        activeOrganizations: {
            label: 'Active Orgs',
            amount: 142,
            change: 5.6,
            trend: 'up',
            type: 'positive'
        }
    },
    chartData: [
        { month: 'Jan', revenue: 8500000, costs: 2400000, trend: 8500000 },
        { month: 'Feb', revenue: 9200000, costs: 2600000, trend: 9200000 },
        { month: 'Mar', revenue: 10500000, costs: 3100000, trend: 10500000 },
        { month: 'Apr', revenue: 11200000, costs: 3400000, trend: 11200000 },
        { month: 'May', revenue: 13800000, costs: 4100000, trend: 13800000 },
        { month: 'Jun', revenue: 15420000, costs: 4250000, trend: 15420000 },
    ],
    revenueByWorkspace: [
        { id: '1', name: 'TechFlow Solutions', revenue: 4500000, share: 29.2 },
        { id: '2', name: 'Global Data Corp', revenue: 3200000, share: 20.8 },
        { id: '3', name: 'Nexus AI Research', revenue: 2800000, share: 18.2 },
        { id: '4', name: 'Vertex Systems', revenue: 1900000, share: 12.3 },
        { id: '5', name: 'InnoSpark Labs', revenue: 1500000, share: 9.7 },
        { id: '6', name: 'Others', revenue: 1520000, share: 9.8 },
    ],
    topModels: [
        { id: 'gpt4', model: 'GPT-4o', provider: 'OpenAI', revenue: 6800000, usage: 44.1, growth: 12.5 },
        { id: 'claude35', model: 'Claude 3.5 Sonnet', provider: 'Anthropic', revenue: 4200000, usage: 27.2, growth: 8.4 },
        { id: 'gemini15', model: 'Gemini 1.5 Pro', provider: 'Google', revenue: 2500000, usage: 16.2, growth: 15.6 },
        { id: 'llama3', model: 'Llama 3.1 405B', provider: 'Meta', revenue: 1920000, usage: 12.5, growth: -2.1 },
    ],
    recentTransactions: [
        { id: 'tx-001', date: '2024-06-24 14:30', organization: 'TechFlow Solutions', amount: 450000, type: 'credit_purchase', status: 'Completed' },
        { id: 'tx-002', date: '2024-06-24 11:15', organization: 'Nexus AI Research', amount: 125000, type: 'usage_billing', status: 'Completed' },
        { id: 'tx-003', date: '2024-06-23 16:45', organization: 'Global Data Corp', amount: 850000, type: 'credit_purchase', status: 'Pending' },
        { id: 'tx-004', date: '2024-06-23 09:20', organization: 'Vertex Systems', amount: 230000, type: 'usage_billing', status: 'Failed' },
        { id: 'tx-005', date: '2024-06-22 15:10', organization: 'InnoSpark Labs', amount: 180000, type: 'credit_purchase', status: 'Completed' },
    ],
    revenueBySource: [
        { source: 'Credit Top-ups', amount: 9800000, percentage: 63.5 },
        { source: 'Enterprise Deals', amount: 4200000, percentage: 27.2 },
        { source: 'API Subscriptions', amount: 1420000, percentage: 9.3 },
    ],
    costByProvider: [
        { provider: 'OpenAI', creditsConsumed: 8500000, cost: 2100000, revenue: 6800000, margin: 69.1 },
        { provider: 'Anthropic', creditsConsumed: 5200000, cost: 1350000, revenue: 4200000, margin: 67.8 },
        { provider: 'Google', creditsConsumed: 3100000, cost: 620000, revenue: 2500000, margin: 75.2 },
        { provider: 'Meta', creditsConsumed: 1700000, cost: 180000, revenue: 1920000, margin: 90.6 },
    ],
    topSpenders: [
        { organization: 'TechFlow Solutions', spend: 4500000, creditsUsed: 5200000, lastActivity: '2024-06-24', status: 'Active' },
        { organization: 'Global Data Corp', spend: 3200000, creditsUsed: 3800000, lastActivity: '2024-06-23', status: 'Active' },
        { organization: 'Nexus AI Research', spend: 2800000, creditsUsed: 3100000, lastActivity: '2024-06-24', status: 'Active' },
        { organization: 'Vertex Systems', spend: 1900000, creditsUsed: 2200000, lastActivity: '2024-06-23', status: 'At Risk' },
        { organization: 'InnoSpark Labs', spend: 1500000, creditsUsed: 1700000, lastActivity: '2024-06-22', status: 'Active' },
    ],
    creditFlow: {
        issued: 50000000,
        transferred: 12000000,
        consumed: 18500000,
        remaining: 19500000
    }
}
