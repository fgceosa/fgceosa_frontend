import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetWorkspaces,
    apiGetWorkspace,
    apiCreateWorkspace,
    apiUpdateWorkspace,
    apiDeleteWorkspace,
    apiUploadWorkspaceAvatar,
    apiDeleteWorkspaceAvatar,
    apiGetWorkspaceDashboardStats,
    apiGetWorkspaceMembers,
    apiAddWorkspaceMember,
    apiUpdateWorkspaceMember,
    apiRemoveMember,
    apiSuspendMember,
    apiAssignMemberRoles,
    apiGetWorkspaceRoles,
    apiCreateRole,
    apiUpdateRole,
    apiDeleteRole,
    apiAssignRole,
    apiGetWorkspaceProjects,
    apiCreateProject,
    apiUpdateProject,
    apiDeleteProject,
    apiGetWorkspaceUsageReport,
    apiExportUsageReport,
    apiGetCreditTransactions,
    apiAllocateCredits,
    apiShareWorkspaceCredits,
    apiTopUpCredits,
    apiGetWorkspaceIntegrations,
    apiConnectIntegration,
    apiDisconnectIntegration,
    apiUpdateIntegration,
    type WorkspaceMemberListParams,
    type UsageReportParams,
    type WorkspaceProjectListParams,
    type CreditTransactionListParams,
} from '@/services/workspace/workspaceService'
import type {
    CreateRolePayload,
    CreateProjectPayload,
    AllocateCreditsPayload,
    UpdateWorkspacePayload,
    AddWorkspaceMemberPayload,
    ShareCreditsPayload,
    WorkspaceProject,
} from '@/app/(protected-pages)/workspace/types'

// ===========================
// Workspace Thunks
// ===========================

export const fetchWorkspaces = createAsyncThunk(
    'workspace/fetchWorkspaces',
    async (params: { page?: number, pageSize?: number } | undefined, { rejectWithValue }) => {
        try {
            const response = await apiGetWorkspaces(params?.page, params?.pageSize)
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch workspaces',
            )
        }
    },
)

export const fetchWorkspace = createAsyncThunk(
    'workspace/fetchWorkspace',
    async (workspaceId: string, { rejectWithValue }) => {
        try {
            const response = await apiGetWorkspace(workspaceId)
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch workspace',
            )
        }
    },
)

export const createWorkspace = createAsyncThunk(
    'workspace/createWorkspace',
    async (
        data: { name: string; description: string },
        { rejectWithValue },
    ) => {
        try {
            const response = await apiCreateWorkspace(data)
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || 'Failed to create workspace',
            )
        }
    },
)

export const updateWorkspace = createAsyncThunk(
    'workspace/updateWorkspace',
    async (payload: UpdateWorkspacePayload, { rejectWithValue }) => {
        try {
            const response = await apiUpdateWorkspace(payload)
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || 'Failed to update workspace',
            )
        }
    },
)

export const deleteWorkspace = createAsyncThunk(
    'workspace/deleteWorkspace',
    async (workspaceId: string, { rejectWithValue }) => {
        try {
            await apiDeleteWorkspace(workspaceId)
            return workspaceId
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || 'Failed to delete workspace',
            )
        }
    },
)

export const uploadWorkspaceAvatar = createAsyncThunk(
    'workspace/uploadWorkspaceAvatar',
    async (
        payload: { workspaceId: string; file: File },
        { rejectWithValue },
    ) => {
        try {
            const response = await apiUploadWorkspaceAvatar(
                payload.workspaceId,
                payload.file,
            )
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || 'Failed to upload avatar',
            )
        }
    },
)

export const deleteWorkspaceAvatar = createAsyncThunk(
    'workspace/deleteWorkspaceAvatar',
    async (workspaceId: string, { rejectWithValue },) => {
        try {
            const response = await apiDeleteWorkspaceAvatar(workspaceId)
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || 'Failed to delete avatar',
            )
        }
    },
)

export const fetchDashboardStats = createAsyncThunk(
    'workspace/fetchDashboardStats',
    async (params: string | { workspaceId: string; filterByUser?: boolean }, { rejectWithValue }) => {
        try {
            const workspaceId = typeof params === 'string' ? params : params.workspaceId
            const filterByUser = typeof params === 'string' ? false : !!params.filterByUser

            console.log('Fetching dashboard stats for workspace:', workspaceId, 'filterByUser:', filterByUser)
            const response = await apiGetWorkspaceDashboardStats(workspaceId, filterByUser)
            console.log('Dashboard stats response:', response)
            return response
        } catch (error: any) {
            console.error('Dashboard stats error:', error)
            return rejectWithValue(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                'Failed to fetch dashboard stats',
            )
        }
    },
)

// ===========================
// Members Thunks
// ===========================

export const fetchWorkspaceMembers = createAsyncThunk(
    'workspace/fetchWorkspaceMembers',
    async (params: WorkspaceMemberListParams, { rejectWithValue }) => {
        try {
            const response = await apiGetWorkspaceMembers(params)
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch members',
            )
        }
    },
)


export const addWorkspaceMember = createAsyncThunk(
    'workspace/addWorkspaceMember',
    async (payload: AddWorkspaceMemberPayload, { rejectWithValue }) => {
        try {
            const response = await apiAddWorkspaceMember(payload)
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || 'Failed to add member',
            )
        }
    },
)


export const updateWorkspaceMember = createAsyncThunk(
    'workspace/updateWorkspaceMember',
    async (
        payload: { workspaceId: string; memberId: string; data: any },
        { rejectWithValue },
    ) => {
        try {
            const response = await apiUpdateWorkspaceMember(
                payload.workspaceId,
                payload.memberId,
                payload.data,
            )
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || 'Failed to update member',
            )
        }
    },
)

export const removeMember = createAsyncThunk(
    'workspace/removeMember',
    async (
        payload: { workspaceId: string; memberId: string },
        { rejectWithValue },
    ) => {
        try {
            await apiRemoveMember(payload.workspaceId, payload.memberId)
            return payload.memberId
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || 'Failed to remove member',
            )
        }
    },
)

export const suspendMember = createAsyncThunk(
    'workspace/suspendMember',
    async (
        payload: { workspaceId: string; memberId: string },
        { rejectWithValue },
    ) => {
        try {
            const response = await apiSuspendMember(
                payload.workspaceId,
                payload.memberId,
            )
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                'Failed to suspend member',
            )
        }
    },
)

export const assignMemberRoles = createAsyncThunk(
    'workspace/assignMemberRoles',
    async (
        payload: { workspaceId: string; memberId: string; roleIds: string[] },
        { rejectWithValue },
    ) => {
        try {
            const response = await apiAssignMemberRoles(
                payload.workspaceId,
                payload.memberId,
                payload.roleIds,
            )
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                'Failed to assign roles',
            )
        }
    },
)

// ===========================
// Roles Thunks
// ===========================

export const fetchWorkspaceRoles = createAsyncThunk(
    'workspace/fetchWorkspaceRoles',
    async (workspaceId: string, { rejectWithValue }) => {
        try {
            const response = await apiGetWorkspaceRoles(workspaceId)
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch roles',
            )
        }
    },
)

export const createRole = createAsyncThunk(
    'workspace/createRole',
    async (payload: CreateRolePayload, { rejectWithValue }) => {
        try {
            const response = await apiCreateRole(payload)
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || 'Failed to create role',
            )
        }
    },
)

export const updateRole = createAsyncThunk(
    'workspace/updateRole',
    async (
        payload: {
            workspaceId: string
            roleId: string
            data: Partial<CreateRolePayload>
        },
        { rejectWithValue },
    ) => {
        try {
            const response = await apiUpdateRole(
                payload.workspaceId,
                payload.roleId,
                payload.data,
            )
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || 'Failed to update role',
            )
        }
    },
)

export const deleteRole = createAsyncThunk(
    'workspace/deleteRole',
    async (
        payload: { workspaceId: string; roleId: string },
        { rejectWithValue },
    ) => {
        try {
            await apiDeleteRole(payload.workspaceId, payload.roleId)
            return payload.roleId
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || 'Failed to delete role',
            )
        }
    },
)

export const assignRole = createAsyncThunk(
    'workspace/assignRole',
    async (
        payload: { workspaceId: string; memberId: string; roleId: string },
        { rejectWithValue },
    ) => {
        try {
            const response = await apiAssignRole(
                payload.workspaceId,
                payload.memberId,
                payload.roleId,
            )
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || 'Failed to assign role',
            )
        }
    },
)

// ===========================
// Projects Thunks
// ===========================

export const fetchWorkspaceProjects = createAsyncThunk(
    'workspace/fetchWorkspaceProjects',
    async (params: WorkspaceProjectListParams, { rejectWithValue }) => {
        try {
            const response = await apiGetWorkspaceProjects(params)
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch projects',
            )
        }
    },
)

export const createProject = createAsyncThunk(
    'workspace/createProject',
    async (payload: CreateProjectPayload, { rejectWithValue }) => {
        try {
            const response = await apiCreateProject(payload)
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || 'Failed to create project',
            )
        }
    },
)

export const updateProject = createAsyncThunk(
    'workspace/updateProject',
    async (
        payload: {
            workspaceId: string
            projectId: string
            data: Partial<WorkspaceProject>
        },
        { rejectWithValue },
    ) => {
        try {
            const response = await apiUpdateProject(
                payload.workspaceId,
                payload.projectId,
                payload.data,
            )
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || 'Failed to update project',
            )
        }
    },
)

export const deleteProject = createAsyncThunk(
    'workspace/deleteProject',
    async (
        payload: { workspaceId: string; projectId: string },
        { rejectWithValue },
    ) => {
        try {
            await apiDeleteProject(payload.workspaceId, payload.projectId)
            return payload.projectId
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || 'Failed to delete project',
            )
        }
    },
)

// ===========================
// Usage Reports Thunks
// ===========================

export const fetchUsageReport = createAsyncThunk(
    'workspace/fetchUsageReport',
    async (params: UsageReportParams, { rejectWithValue }) => {
        try {
            const response = await apiGetWorkspaceUsageReport(params)
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch usage report',
            )
        }
    },
)

export const exportUsageReport = createAsyncThunk(
    'workspace/exportUsageReport',
    async (params: UsageReportParams, { rejectWithValue }) => {
        try {
            const response = await apiExportUsageReport(params)
            // Create a download link for the blob
            const url = window.URL.createObjectURL(response as any)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `usage-report-${params.period}.csv`)
            document.body.appendChild(link)
            link.click()
            link.parentNode?.removeChild(link)
            return { success: true }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message ||
                'Failed to export usage report',
            )
        }
    },
)

// ===========================
// Credit Management Thunks
// ===========================

export const fetchCreditTransactions = createAsyncThunk(
    'workspace/fetchCreditTransactions',
    async (params: CreditTransactionListParams, { rejectWithValue }) => {
        try {
            const response = await apiGetCreditTransactions(params)
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message ||
                'Failed to fetch credit transactions',
            )
        }
    },
)

export const allocateCredits = createAsyncThunk(
    'workspace/allocateCredits',
    async (payload: AllocateCreditsPayload, { rejectWithValue }) => {
        try {
            const response = await apiAllocateCredits(payload)
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || 'Failed to allocate credits',
            )
        }
    },
)

export const shareWorkspaceCredits = createAsyncThunk(
    'workspace/shareWorkspaceCredits',
    async (payload: ShareCreditsPayload, { rejectWithValue }) => {
        try {
            const response = await apiShareWorkspaceCredits(payload)
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || 'Failed to share credits',
            )
        }
    },
)

export const topUpCredits = createAsyncThunk(
    'workspace/topUpCredits',
    async (
        payload: { workspaceId: string; amount: number },
        { rejectWithValue },
    ) => {
        try {
            const response = await apiTopUpCredits(
                payload.workspaceId,
                payload.amount,
            )
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || 'Failed to top up credits',
            )
        }
    },
)

// ===========================
// Integrations Thunks
// ===========================

export const fetchWorkspaceIntegrations = createAsyncThunk(
    'workspace/fetchWorkspaceIntegrations',
    async (workspaceId: string, { rejectWithValue }) => {
        try {
            const response = await apiGetWorkspaceIntegrations(workspaceId)
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch integrations',
            )
        }
    },
)

export const connectIntegration = createAsyncThunk(
    'workspace/connectIntegration',
    async (
        payload: {
            workspaceId: string
            integrationType: string
            config: Record<string, any>
        },
        { rejectWithValue },
    ) => {
        try {
            const response = await apiConnectIntegration(
                payload.workspaceId,
                payload.integrationType,
                payload.config,
            )
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message ||
                'Failed to connect integration',
            )
        }
    },
)

export const disconnectIntegration = createAsyncThunk(
    'workspace/disconnectIntegration',
    async (
        payload: { workspaceId: string; integrationId: string },
        { rejectWithValue },
    ) => {
        try {
            await apiDisconnectIntegration(
                payload.workspaceId,
                payload.integrationId,
            )
            return payload.integrationId
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message ||
                'Failed to disconnect integration',
            )
        }
    },
)

export const updateIntegration = createAsyncThunk(
    'workspace/updateIntegration',
    async (
        payload: {
            workspaceId: string
            integrationId: string
            config: Record<string, any>
        },
        { rejectWithValue },
    ) => {
        try {
            const response = await apiUpdateIntegration(
                payload.workspaceId,
                payload.integrationId,
                payload.config,
            )
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || error.response?.data?.message || 'Failed to update integration',
            )
        }
    },
)
