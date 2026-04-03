import ApiService from '../ApiService'
import type {
    Project,
    CreateProjectRequest,
    CreateProjectResponse,
    UpdateProjectRequest,
    ProjectsListResponse,
    ProjectUsage,
} from '@/app/(protected-pages)/dashboard/projects/types'

// Backend response type (matches what the API actually returns)
interface BackendProject {
    id: string
    name: string
    description: string | null
    type: string
    status: string
    project_url: string | null
    owner_user_id: string
    org_id: string | null
    api_key_id: string | null
    is_deleted: boolean
    deleted_at: string | null
    created_at: string
    updated_at: string
    total_requests?: number
    total_tokens?: number
    total_cost?: number
    plain_api_key?: string
}

interface BackendProjectsResponse {
    data: BackendProject[]
    count: number
}

/**
 * Transform backend project to frontend format
 */
function transformProject(backendProject: BackendProject): Project {
    return {
        id: backendProject.id,
        name: backendProject.name,
        description: backendProject.description,
        type: backendProject.type as any,
        status: backendProject.status as any,
        projectUrl: backendProject.project_url,
        ownerUserId: backendProject.owner_user_id,
        orgId: backendProject.org_id,
        apiKeyId: backendProject.api_key_id,
        isDeleted: backendProject.is_deleted,
        deletedAt: backendProject.deleted_at,
        created: backendProject.created_at,
        updated: backendProject.updated_at,
        totalRequests: backendProject.total_requests,
        totalTokens: backendProject.total_tokens,
        totalCost: backendProject.total_cost,
    }
}

/**
 * Get all projects for the current user
 */
export async function apiGetProjects(params?: {
    skip?: number
    limit?: number
    includeOrg?: boolean
}) {
    const queryParams = new URLSearchParams()
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString())
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString())
    if (params?.includeOrg !== undefined) queryParams.append('include_org', params.includeOrg.toString())

    const url = `/projects${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    console.log('Fetching projects from:', url)

    const response = await ApiService.fetchDataWithAxios<BackendProjectsResponse>({
        url,
        method: 'get',
    })

    console.log('Projects response:', response)

    // Transform backend response to frontend format
    // Backend returns { data: [], count: number }
    const transformed = {
        projects: response.data.map(transformProject),
        total: response.count,
    }

    console.log('Transformed projects:', transformed)

    return transformed
}

/**
 * Get a single project by ID
 */
export async function apiGetProject(id: string) {
    const response = await ApiService.fetchDataWithAxios<BackendProject>({
        url: `/projects/${id}`,
        method: 'get',
    })

    return transformProject(response)
}

/**
 * Create a new project
 */
export async function apiCreateProject(data: CreateProjectRequest) {
    const requestData = {
        name: data.name,
        description: data.description,
        type: data.type,
        status: data.status,
        project_url: data.projectUrl,
        api_key_id: data.apiKeyId,
    }

    // Log request data for debugging
    console.log('Creating project with data:', requestData)

    const response = await ApiService.fetchDataWithAxios<BackendProject>({
        url: '/projects',
        method: 'post',
        data: requestData,
    })

    const transformed = transformProject(response) as CreateProjectResponse
    if (response.plain_api_key) {
        transformed.plain_api_key = response.plain_api_key
    }

    return transformed
}

/**
 * Update a project
 */
export async function apiUpdateProject(
    id: string,
    data: UpdateProjectRequest,
) {
    const response = await ApiService.fetchDataWithAxios<BackendProject>({
        url: `/projects/${id}`,
        method: 'patch',
        data: {
            name: data.name,
            description: data.description,
            type: data.type,
            status: data.status,
            project_url: data.projectUrl,
        },
    })

    return transformProject(response)
}

/**
 * Delete a project (soft delete by default)
 */
export async function apiDeleteProject(id: string, hardDelete: boolean = false) {
    const queryParams = hardDelete ? '?hard_delete=true' : ''

    return ApiService.fetchDataWithAxios<void>({
        url: `/projects/${id}${queryParams}`,
        method: 'delete',
    })
}

/**
 * Get project usage analytics
 */
export async function apiGetProjectUsage(
    id: string,
    params?: {
        startDate?: string
        endDate?: string
        page?: number
        pageSize?: number
    }
) {
    const queryParams = new URLSearchParams()
    if (params?.startDate) queryParams.append('start_date', params.startDate)
    if (params?.endDate) queryParams.append('end_date', params.endDate)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.pageSize) queryParams.append('page_size', params.pageSize.toString())

    const response = await ApiService.fetchDataWithAxios<any>({
        url: `/projects/${id}/usage?${queryParams.toString()}`,
        method: 'get',
    })

    // Transform the response
    return {
        project: transformProject(response.project),
        dateRange: response.date_range,
        metricsSummary: {
            totalCalls: response.metrics_summary.total_calls,
            totalTokens: response.metrics_summary.total_tokens,
            totalCost: response.metrics_summary.total_cost,
            avgResponseTimeMs: response.metrics_summary.avg_response_time_ms,
            successRate: response.metrics_summary.success_rate,
        },
        usageTrends: response.usage_trends.map((trend: any) => ({
            date: trend.date,
            apiCalls: trend.api_calls,
            tokensConsumed: trend.tokens_consumed,
            cost: trend.cost,
        })),
        recentCalls: response.recent_calls.map((call: any) => ({
            id: call.id,
            timestamp: call.timestamp,
            model: call.model,
            endpoint: call.endpoint,
            totalTokens: call.total_tokens,
            cost: call.cost,
            status: call.status,
            responseTimeMs: call.response_time_ms,
        })),
        totalRecentCalls: response.total_recent_calls,
        page: response.page,
        pageSize: response.page_size,
    } as ProjectUsage
}
