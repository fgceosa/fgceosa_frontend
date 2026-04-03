import ApiService from '../ApiService'
import type {
    Workspace,
    WorkspaceMember,
    WorkspaceRole,
    WorkspaceProject,
    WorkspaceUsageReport,
    WorkspaceIntegration,
    CreditTransaction,
    WorkspaceDashboardStats,
    CreateRolePayload,
    CreateProjectPayload,
    AllocateCreditsPayload,
    UpdateWorkspacePayload,
    AddWorkspaceMemberPayload,
} from '@/app/(protected-pages)/workspace/types'

// ===========================
// Response Types
// ===========================

export interface GetWorkspacesResponse {
    workspaces: Workspace[]
    total: number
}

export interface GetWorkspaceMembersResponse {
    members: WorkspaceMember[]
    total: number
}

export interface GetWorkspaceRolesResponse {
    roles: WorkspaceRole[]
    total: number
}

export interface GetWorkspaceProjectsResponse {
    projects: WorkspaceProject[]
    total: number
}

export interface GetCreditTransactionsResponse {
    transactions: CreditTransaction[]
    total: number
}

export interface GetIntegrationsResponse {
    integrations: WorkspaceIntegration[]
    total: number
}

// ===========================
// Workspace APIs
// ===========================

/**
 * Get all workspaces for the current user
 */
export async function apiGetWorkspaces(page: number = 1, pageSize: number = 20) {
    return ApiService.fetchDataWithAxios<GetWorkspacesResponse>({
        url: `workspaces?page=${page}&page_size=${pageSize}`,
        method: 'get',
    })
}

/**
 * Get total count of all workspaces (Admin only)
 */
export async function apiAdminCountAllWorkspaces() {
    return ApiService.fetchDataWithAxios<{ total: number }>({
        url: 'workspaces/count/all',
        method: 'get',
    })
}

/**
 * Get workspace by ID
 */
export async function apiGetWorkspace(workspaceId: string) {
    return ApiService.fetchDataWithAxios<Workspace>({
        url: `workspaces/${workspaceId}`,
        method: 'get',
    })
}

/**
 * Create a new workspace
 */
export async function apiCreateWorkspace(data: {
    name: string
    description: string
}) {
    return ApiService.fetchDataWithAxios<Workspace>({
        url: 'workspaces',
        method: 'post',
        data,
    })
}

/**
 * Update workspace
 */
export async function apiUpdateWorkspace(payload: UpdateWorkspacePayload) {
    const { id, ...data } = payload
    return ApiService.fetchDataWithAxios<Workspace>({
        url: `workspaces/${id}`,
        method: 'put',
        data,
    })
}

/**
 * Delete workspace
 */
export async function apiDeleteWorkspace(workspaceId: string) {
    return ApiService.fetchDataWithAxios<{ message: string }>({
        url: `workspaces/${workspaceId}`,
        method: 'delete',
    })
}

/**
 * Upload workspace avatar
 */
export async function apiUploadWorkspaceAvatar(workspaceId: string, file: File) {
    const formData = new FormData()
    formData.append('file', file)

    return ApiService.fetchDataWithAxios<Workspace>({
        url: `workspaces/${workspaceId}/avatar`,
        method: 'post',
        data: formData as unknown as Record<string, unknown>,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

/**
 * Delete workspace avatar
 */
export async function apiDeleteWorkspaceAvatar(workspaceId: string) {
    return ApiService.fetchDataWithAxios<Workspace>({
        url: `workspaces/${workspaceId}/avatar`,
        method: 'delete',
    })
}

/**
 * Get workspace dashboard stats
 */
export async function apiGetWorkspaceDashboardStats(workspaceId: string, filterByUser: boolean = false) {
    const url = filterByUser
        ? `workspaces/${workspaceId}/dashboard-stats?filter_by_user=true`
        : `workspaces/${workspaceId}/dashboard-stats`
    return ApiService.fetchDataWithAxios<WorkspaceDashboardStats>({
        url,
        method: 'get',
    })
}

/**
 * Get workspace activities
 */
export async function apiGetWorkspaceActivities(
    workspaceId: string,
    page: number = 1,
    pageSize: number = 10
) {
    return ApiService.fetchDataWithAxios<{ activities: any[], total: number }>({
        url: `workspaces/${workspaceId}/activities?page=${page}&page_size=${pageSize}`,
        method: 'get',
    })
}

// ===========================
// Members APIs
// ===========================

export interface WorkspaceMemberListParams {
    workspaceId: string
    pageIndex?: number
    pageSize?: number
    sortKey?: string
    order?: 'asc' | 'desc'
    query?: string
    status?: string
    role?: string
}

/**
 * Get workspace members with pagination and filters
 */
export async function apiGetWorkspaceMembers(
    params: WorkspaceMemberListParams,
) {
    const { workspaceId, ...rest } = params
    const queryParams = new URLSearchParams()

    if (rest.pageIndex) {
        queryParams.append('page', rest.pageIndex.toString())
    }
    if (rest.pageSize) {
        queryParams.append('page_size', rest.pageSize.toString())
    }
    if (rest.sortKey) {
        queryParams.append('sort_by', rest.sortKey)
    }
    if (rest.order) {
        queryParams.append('order', rest.order)
    }
    if (rest.query) {
        queryParams.append('search', rest.query)
    }
    if (rest.status) {
        queryParams.append('status', rest.status)
    }
    if (rest.role) {
        queryParams.append('role', rest.role)
    }

    const queryString = queryParams.toString()
    const url = queryString
        ? `workspaces/${workspaceId}/members?${queryString}`
        : `workspaces/${workspaceId}/members`

    return ApiService.fetchDataWithAxios<GetWorkspaceMembersResponse>({
        url,
        method: 'get',
    })
}

/**
 * Add an existing organization member to a workspace
 */
export async function apiAddWorkspaceMember(payload: AddWorkspaceMemberPayload) {
    const { workspaceId, userId, roles, credits_to_allocate } = payload
    return ApiService.fetchDataWithAxios<WorkspaceMember>({
        url: `workspaces/${workspaceId}/members/add`,
        method: 'post',
        data: {
            user_id: userId,
            roles,
            credits_to_allocate
        },
    })
}

/**
 * Update workspace member
 */
export async function apiUpdateWorkspaceMember(
    workspaceId: string,
    memberId: string,
    data: Partial<WorkspaceMember>,
) {
    return ApiService.fetchDataWithAxios<WorkspaceMember>({
        url: `workspaces/${workspaceId}/members/${memberId}`,
        method: 'put',
        data,
    })
}

/**
 * Remove member from workspace
 */
export async function apiRemoveMember(workspaceId: string, memberId: string) {
    return ApiService.fetchDataWithAxios<{ message: string }>({
        url: `workspaces/${workspaceId}/members/${memberId}`,
        method: 'delete',
    })
}

/**
 * Suspend workspace member
 */
export async function apiSuspendMember(workspaceId: string, memberId: string) {
    return ApiService.fetchDataWithAxios<WorkspaceMember>({
        url: `workspaces/${workspaceId}/members/${memberId}/suspend`,
        method: 'post',
    })
}

/**
 * Assign roles to a member
 */
export async function apiAssignMemberRoles(
    workspaceId: string,
    memberId: string,
    roleIds: string[],
) {
    return ApiService.fetchDataWithAxios<WorkspaceMember>({
        url: `workspaces/${workspaceId}/members/${memberId}/roles`,
        method: 'put',
        data: { role_ids: roleIds },
    })
}

// ===========================
// Roles & Permissions APIs
// ===========================

/**
 * Get workspace roles
 */
export async function apiGetWorkspaceRoles(workspaceId: string) {
    return ApiService.fetchDataWithAxios<GetWorkspaceRolesResponse>({
        url: `/workspaces/${workspaceId}/roles`,
        method: 'get',
    })
}

/**
 * Create custom role
 */
export async function apiCreateRole(payload: CreateRolePayload) {
    const { workspaceId, ...data } = payload
    return ApiService.fetchDataWithAxios<WorkspaceRole>({
        url: `/workspaces/${workspaceId}/roles`,
        method: 'post',
        data,
    })
}

/**
 * Update role
 */
export async function apiUpdateRole(
    workspaceId: string,
    roleId: string,
    data: Partial<CreateRolePayload>,
) {
    return ApiService.fetchDataWithAxios<WorkspaceRole>({
        url: `/workspaces/${workspaceId}/roles/${roleId}`,
        method: 'put',
        data,
    })
}

/**
 * Delete role
 */
export async function apiDeleteRole(workspaceId: string, roleId: string) {
    return ApiService.fetchDataWithAxios<{ message: string }>({
        url: `/workspaces/${workspaceId}/roles/${roleId}`,
        method: 'delete',
    })
}

/**
 * Assign role to member
 */
export async function apiAssignRole(
    workspaceId: string,
    memberId: string,
    roleId: string,
) {
    return ApiService.fetchDataWithAxios<WorkspaceMember>({
        url: `workspaces/${workspaceId}/members/${memberId}/roles`,
        method: 'post',
        data: { roleId },
    })
}

// ===========================
// Projects APIs
// ===========================

export interface WorkspaceProjectListParams {
    workspaceId: string
    pageIndex?: number
    pageSize?: number
    status?: string
}

/**
 * Get workspace projects
 */
export async function apiGetWorkspaceProjects(
    params: WorkspaceProjectListParams,
) {
    const { workspaceId, ...rest } = params
    const queryParams = new URLSearchParams()

    if (rest.pageIndex) {
        queryParams.append('page', rest.pageIndex.toString())
    }
    if (rest.pageSize) {
        queryParams.append('page_size', rest.pageSize.toString())
    }
    if (rest.status) {
        queryParams.append('status', rest.status)
    }

    const queryString = queryParams.toString()
    const url = queryString
        ? `workspaces/${workspaceId}/projects?${queryString}`
        : `workspaces/${workspaceId}/projects`

    return ApiService.fetchDataWithAxios<GetWorkspaceProjectsResponse>({
        url,
        method: 'get',
    })
}

/**
 * Create workspace project
 */
export async function apiCreateProject(payload: CreateProjectPayload) {
    const { workspaceId, ...data } = payload
    return ApiService.fetchDataWithAxios<WorkspaceProject>({
        url: `workspaces/${workspaceId}/projects`,
        method: 'post',
        data,
    })
}

/**
 * Update project
 */
export async function apiUpdateProject(
    workspaceId: string,
    projectId: string,
    data: Partial<WorkspaceProject>,
) {
    return ApiService.fetchDataWithAxios<WorkspaceProject>({
        url: `workspaces/${workspaceId}/projects/${projectId}`,
        method: 'put',
        data,
    })
}

/**
 * Delete project
 */
export async function apiDeleteProject(workspaceId: string, projectId: string) {
    return ApiService.fetchDataWithAxios<{ message: string }>({
        url: `workspaces/${workspaceId}/projects/${projectId}`,
        method: 'delete',
    })
}

// ===========================
// Usage Reports APIs
// ===========================

export interface UsageReportParams {
    workspaceId: string
    period: 'day' | 'week' | 'month' | 'custom'
    startDate?: string
    endDate?: string
}

/**
 * Get workspace usage report
 */
export async function apiGetWorkspaceUsageReport(params: UsageReportParams) {
    const { workspaceId, ...rest } = params
    const queryParams = new URLSearchParams()

    queryParams.append('period', rest.period)
    if (rest.startDate) {
        queryParams.append('start_date', rest.startDate)
    }
    if (rest.endDate) {
        queryParams.append('end_date', rest.endDate)
    }

    const queryString = queryParams.toString()
    const url = `workspaces/${workspaceId}/usage-report?${queryString}`

    return ApiService.fetchDataWithAxios<WorkspaceUsageReport>({
        url,
        method: 'get',
    })
}

/**
 * Export usage report to CSV
 */
export async function apiExportUsageReport(params: UsageReportParams) {
    const { workspaceId, ...rest } = params
    const queryParams = new URLSearchParams()

    queryParams.append('period', rest.period)
    if (rest.startDate) {
        queryParams.append('start_date', rest.startDate)
    }
    if (rest.endDate) {
        queryParams.append('end_date', rest.endDate)
    }

    const queryString = queryParams.toString()
    const url = `workspaces/${workspaceId}/usage-report/export?${queryString}`

    return ApiService.fetchDataWithAxios<Blob>({
        url,
        method: 'get',
        responseType: 'blob',
    })
}

// ===========================
// Credit Management APIs
// ===========================

export interface CreditTransactionListParams {
    workspaceId: string
    pageIndex?: number
    pageSize?: number
    type?: string
}

/**
 * Get credit transactions
 */
export async function apiGetCreditTransactions(
    params: CreditTransactionListParams,
) {
    const { workspaceId, ...rest } = params
    const queryParams = new URLSearchParams()

    if (rest.pageIndex) {
        queryParams.append('page', rest.pageIndex.toString())
    }
    if (rest.pageSize) {
        queryParams.append('page_size', rest.pageSize.toString())
    }
    if (rest.type) {
        queryParams.append('type', rest.type)
    }

    const queryString = queryParams.toString()
    const url = queryString
        ? `workspaces/${workspaceId}/credit-transactions?${queryString}`
        : `workspaces/${workspaceId}/credit-transactions`

    return ApiService.fetchDataWithAxios<GetCreditTransactionsResponse>({
        url,
        method: 'get',
    })
}

/**
 * Allocate credits to member
 */
export async function apiAllocateCredits(payload: AllocateCreditsPayload) {
    const { workspaceId, memberId, ...data } = payload
    return ApiService.fetchDataWithAxios<CreditTransaction>({
        url: `workspaces/${workspaceId}/members/${memberId}/allocate-credits`,
        method: 'post',
        data,
    })
}

/**
 * Top up workspace credits
 */
export async function apiTopUpCredits(workspaceId: string, amount: number) {
    return ApiService.fetchDataWithAxios<CreditTransaction>({
        url: `workspaces/${workspaceId}/credits/top-up`,
        method: 'post',
        data: { amount },
    })
}

/**
 * Share credits from workspace to multiple recipients
 */
export async function apiShareWorkspaceCredits(payload: {
    workspaceId: string
    recipients: any[]
    total_amount?: number
    amount_per_user?: number
    message?: string
    draw_from_organization?: boolean
}) {
    const { workspaceId, ...data } = payload
    return ApiService.fetchDataWithAxios<any>({
        url: `workspaces/${workspaceId}/share-credits`,
        method: 'post',
        data,
    })
}

// ===========================
// Integrations APIs
// ===========================

/**
 * Get workspace integrations
 */
export async function apiGetWorkspaceIntegrations(workspaceId: string) {
    return ApiService.fetchDataWithAxios<GetIntegrationsResponse>({
        url: `workspaces/${workspaceId}/integrations`,
        method: 'get',
    })
}

/**
 * Connect integration
 */
export async function apiConnectIntegration(
    workspaceId: string,
    integrationType: string,
    config: Record<string, any>,
) {
    return ApiService.fetchDataWithAxios<WorkspaceIntegration>({
        url: `workspaces/${workspaceId}/integrations/connect`,
        method: 'post',
        data: { type: integrationType, config },
    })
}

/**
 * Disconnect integration
 */
export async function apiDisconnectIntegration(
    workspaceId: string,
    integrationId: string,
) {
    return ApiService.fetchDataWithAxios<{ message: string }>({
        url: `workspaces/${workspaceId}/integrations/${integrationId}/disconnect`,
        method: 'post',
    })
}

/**
 * Update integration config
 */
export async function apiUpdateIntegration(
    workspaceId: string,
    integrationId: string,
    config: Record<string, any>,
) {
    return ApiService.fetchDataWithAxios<WorkspaceIntegration>({
        url: `workspaces/${workspaceId}/integrations/${integrationId}`,
        method: 'put',
        data: { config },
    })
}
