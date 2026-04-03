// Project types and interfaces

export type ProjectType = 'web' | 'mobile' | 'backend' | 'desktop' | 'iot' | 'other'
export type ProjectStatus = 'active' | 'in_development' | 'archived'

export interface Project {
    id: string
    name: string
    description: string | null
    type: ProjectType
    status: ProjectStatus
    projectUrl: string | null
    ownerUserId: string
    orgId: string | null
    apiKeyId: string | null
    apiKeyName?: string
    apiKeyMasked?: string
    isDeleted: boolean
    deletedAt: string | null
    created: string
    updated: string
    usageThisMonth?: number
    totalRequests?: number
    totalTokens?: number
    totalCost?: number
}

export interface CreateProjectRequest {
    name: string
    description?: string
    type: ProjectType
    status: ProjectStatus
    projectUrl?: string
    apiKeyId?: string
}

export interface UpdateProjectRequest {
    name?: string
    description?: string
    type?: ProjectType
    status?: ProjectStatus
    projectUrl?: string
}

export interface UsageMetrics {
    totalCalls: number
    totalTokens: number
    totalCost: string
    avgResponseTimeMs: number
    successRate: number
}

export interface UsageTrend {
    date: string
    apiCalls: number
    tokensConsumed: number
    cost: string
}

export interface RecentApiCall {
    id: string
    timestamp: string
    model: string
    endpoint: string
    totalTokens: number
    cost: string
    status: string
    responseTimeMs: number
}

export interface ProjectUsage {
    project: Project
    dateRange: {
        start: string
        end: string
    }
    metricsSummary: UsageMetrics
    usageTrends: UsageTrend[]
    recentCalls: RecentApiCall[]
    totalRecentCalls: number
    page?: number
    pageSize?: number
}

export interface ProjectsListResponse {
    projects: Project[]
    total: number
}

export interface CreateProjectResponse extends Project {
    plain_api_key?: string
}
