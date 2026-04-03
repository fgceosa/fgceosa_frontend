import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
    fetchWorkspaces,
    fetchWorkspace,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    fetchDashboardStats,
    fetchWorkspaceMembers,
    addWorkspaceMember,
    updateWorkspaceMember,
    removeMember,
    suspendMember,
    fetchWorkspaceRoles,
    createRole,
    updateRole,
    deleteRole,
    assignRole,
    fetchWorkspaceProjects,
    createProject,
    updateProject,
    deleteProject,
    fetchUsageReport,
    exportUsageReport,
    fetchCreditTransactions,
    allocateCredits,
    topUpCredits,
    shareWorkspaceCredits,
    fetchWorkspaceIntegrations,
    connectIntegration,
    disconnectIntegration,
    updateIntegration,
    uploadWorkspaceAvatar,
    deleteWorkspaceAvatar,
} from './workspaceThunk'
import { WORKSPACE_STATUS, type WorkspaceStatus } from './constants'
import type {
    Workspace,
    WorkspaceMember,
    WorkspaceRole,
    WorkspaceProject,
    WorkspaceUsageReport,
    WorkspaceIntegration,
    CreditTransaction,
    WorkspaceDashboardStats,
} from '@/app/(protected-pages)/workspace/types'

export interface WorkspaceState {
    // Workspaces
    workspaces: Workspace[]
    currentWorkspace: Workspace | null
    workspacesTotal: number

    // Dashboard
    dashboardStats: WorkspaceDashboardStats | null

    // Members
    members: WorkspaceMember[]
    membersTotal: number

    // Roles
    roles: WorkspaceRole[]
    rolesTotal: number

    // Projects
    projects: WorkspaceProject[]
    projectsTotal: number

    // Usage Report
    usageReport: WorkspaceUsageReport | null

    // Credit Transactions
    creditTransactions: CreditTransaction[]
    creditTransactionsTotal: number

    // Integrations
    integrations: WorkspaceIntegration[]
    integrationsTotal: number

    // Loading states
    status: WorkspaceStatus
    loading: boolean

    // Component-specific loading states
    componentLoading: {
        workspaces: boolean
        currentWorkspace: boolean
        dashboardStats: boolean
        members: boolean
        roles: boolean
        projects: boolean
        usageReport: boolean
        creditTransactions: boolean
        integrations: boolean
        operations: boolean
    }

    // Error handling
    error: string | null

    // Cache management
    lastFetched: number | null
}

const initialState: WorkspaceState = {
    workspaces: [],
    currentWorkspace: null,
    workspacesTotal: 0,

    dashboardStats: null,

    members: [],
    membersTotal: 0,

    roles: [],
    rolesTotal: 0,

    projects: [],
    projectsTotal: 0,

    usageReport: null,

    creditTransactions: [],
    creditTransactionsTotal: 0,

    integrations: [],
    integrationsTotal: 0,

    status: WORKSPACE_STATUS.IDLE,
    loading: false,

    componentLoading: {
        workspaces: false,
        currentWorkspace: false,
        dashboardStats: false,
        members: false,
        roles: false,
        projects: false,
        usageReport: false,
        creditTransactions: false,
        integrations: false,
        operations: false,
    },

    error: null,
    lastFetched: null,
}

const workspaceSlice = createSlice({
    name: 'workspace',
    initialState,
    reducers: {
        clearError(state) {
            state.error = null
        },
        setCurrentWorkspace(state, action: PayloadAction<Workspace>) {
            state.currentWorkspace = action.payload
        },
        clearCurrentWorkspace(state) {
            state.currentWorkspace = null
        },
        resetWorkspaceState(state) {
            return initialState
        },
    },
    extraReducers: (builder) => {
        // ===========================
        // Fetch Workspaces
        // ===========================
        builder
            .addCase(fetchWorkspaces.pending, (state) => {
                state.componentLoading.workspaces = true
                state.error = null
            })
            .addCase(fetchWorkspaces.fulfilled, (state, action) => {
                state.componentLoading.workspaces = false
                state.workspaces = action.payload.workspaces
                state.workspacesTotal = action.payload.total
                state.lastFetched = Date.now()
            })
            .addCase(fetchWorkspaces.rejected, (state, action) => {
                state.componentLoading.workspaces = false
                state.error = action.payload as string
                state.lastFetched = Date.now() // Set this even on error to prevent infinite loop in components
                // Ensure workspaces is always an array even on error
                if (!state.workspaces) {
                    state.workspaces = []
                }
            })

        // ===========================
        // Fetch Workspace
        // ===========================
        builder
            .addCase(fetchWorkspace.pending, (state) => {
                state.componentLoading.currentWorkspace = true
                state.error = null
            })
            .addCase(fetchWorkspace.fulfilled, (state, action) => {
                state.componentLoading.currentWorkspace = false
                state.currentWorkspace = action.payload
            })
            .addCase(fetchWorkspace.rejected, (state, action) => {
                state.componentLoading.currentWorkspace = false
                state.error = action.payload as string
            })

        // ===========================
        // Create Workspace
        // ===========================
        builder
            .addCase(createWorkspace.pending, (state) => {
                state.componentLoading.operations = true
                state.error = null
            })
            .addCase(createWorkspace.fulfilled, (state, action) => {
                state.componentLoading.operations = false
                // Ensure workspaces array exists
                if (!state.workspaces) {
                    state.workspaces = []
                }
                state.workspaces.unshift(action.payload)
                state.workspacesTotal += 1
            })
            .addCase(createWorkspace.rejected, (state, action) => {
                state.componentLoading.operations = false
                state.error = action.payload as string
            })

        // ===========================
        // Update Workspace
        // ===========================
        builder
            .addCase(updateWorkspace.pending, (state) => {
                state.componentLoading.operations = true
                state.error = null
            })
            .addCase(updateWorkspace.fulfilled, (state, action) => {
                state.componentLoading.operations = false
                const index = state.workspaces.findIndex((w) => w.id === action.payload.id)
                if (index !== -1) {
                    state.workspaces[index] = action.payload
                }
                if (state.currentWorkspace?.id === action.payload.id) {
                    state.currentWorkspace = action.payload
                }
            })
            .addCase(updateWorkspace.rejected, (state, action) => {
                state.componentLoading.operations = false
                state.error = action.payload as string
            })

        // ===========================
        // Delete Workspace
        // ===========================
        builder
            .addCase(deleteWorkspace.pending, (state) => {
                state.componentLoading.operations = true
                state.error = null
            })
            .addCase(deleteWorkspace.fulfilled, (state, action) => {
                state.componentLoading.operations = false
                state.workspaces = state.workspaces.filter((w) => w.id !== action.payload)
                state.workspacesTotal -= 1
                if (state.currentWorkspace?.id === action.payload) {
                    state.currentWorkspace = null
                }
            })
            .addCase(deleteWorkspace.rejected, (state, action) => {
                state.componentLoading.operations = false
                state.error = action.payload as string
            })

        // ===========================
        // Fetch Dashboard Stats
        // ===========================
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.componentLoading.dashboardStats = true
                state.error = null
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.componentLoading.dashboardStats = false
                state.dashboardStats = action.payload
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.componentLoading.dashboardStats = false
                state.error = action.payload as string
            })

        // ===========================
        // Fetch Workspace Members
        // ===========================
        builder
            .addCase(fetchWorkspaceMembers.pending, (state) => {
                state.componentLoading.members = true
                state.error = null
            })
            .addCase(fetchWorkspaceMembers.fulfilled, (state, action) => {
                state.componentLoading.members = false
                state.members = action.payload.members
                state.membersTotal = action.payload.total
            })
            .addCase(fetchWorkspaceMembers.rejected, (state, action) => {
                state.componentLoading.members = false
                state.error = action.payload as string
            })

        // ===========================
        // Add Member
        // ===========================
        builder
            .addCase(addWorkspaceMember.pending, (state) => {
                state.componentLoading.operations = true
                state.error = null
            })
            .addCase(addWorkspaceMember.fulfilled, (state, action) => {
                state.componentLoading.operations = false
                state.members.unshift(action.payload)
                state.membersTotal += 1
            })
            .addCase(addWorkspaceMember.rejected, (state, action) => {
                state.componentLoading.operations = false
                state.error = action.payload as string
            })


        // ===========================
        // Update Member
        // ===========================
        builder
            .addCase(updateWorkspaceMember.pending, (state) => {
                state.componentLoading.operations = true
                state.error = null
            })
            .addCase(updateWorkspaceMember.fulfilled, (state, action) => {
                state.componentLoading.operations = false
                const index = state.members.findIndex((m) => m.id === action.payload.id)
                if (index !== -1) {
                    state.members[index] = action.payload
                }
            })
            .addCase(updateWorkspaceMember.rejected, (state, action) => {
                state.componentLoading.operations = false
                state.error = action.payload as string
            })

        // ===========================
        // Remove Member
        // ===========================
        builder
            .addCase(removeMember.pending, (state) => {
                state.componentLoading.operations = true
                state.error = null
            })
            .addCase(removeMember.fulfilled, (state, action) => {
                state.componentLoading.operations = false
                state.members = state.members.filter((m) => m.id !== action.payload)
                state.membersTotal -= 1
            })
            .addCase(removeMember.rejected, (state, action) => {
                state.componentLoading.operations = false
                state.error = action.payload as string
            })

        // ===========================
        // Suspend Member
        // ===========================
        builder
            .addCase(suspendMember.pending, (state) => {
                state.componentLoading.operations = true
                state.error = null
            })
            .addCase(suspendMember.fulfilled, (state, action) => {
                state.componentLoading.operations = false
                const index = state.members.findIndex((m) => m.id === action.payload.id)
                if (index !== -1) {
                    state.members[index] = action.payload
                }
            })
            .addCase(suspendMember.rejected, (state, action) => {
                state.componentLoading.operations = false
                state.error = action.payload as string
            })

        // ===========================
        // Fetch Workspace Roles
        // ===========================
        builder
            .addCase(fetchWorkspaceRoles.pending, (state) => {
                state.componentLoading.roles = true
                state.error = null
            })
            .addCase(fetchWorkspaceRoles.fulfilled, (state, action) => {
                state.componentLoading.roles = false
                state.roles = action.payload.roles
                state.rolesTotal = action.payload.total
            })
            .addCase(fetchWorkspaceRoles.rejected, (state, action) => {
                state.componentLoading.roles = false
                state.error = action.payload as string
            })

        // ===========================
        // Create Role
        // ===========================
        builder
            .addCase(createRole.pending, (state) => {
                state.componentLoading.operations = true
                state.error = null
            })
            .addCase(createRole.fulfilled, (state, action) => {
                state.componentLoading.operations = false
                state.roles.push(action.payload)
                state.rolesTotal += 1
            })
            .addCase(createRole.rejected, (state, action) => {
                state.componentLoading.operations = false
                state.error = action.payload as string
            })

        // ===========================
        // Update Role
        // ===========================
        builder
            .addCase(updateRole.pending, (state) => {
                state.componentLoading.operations = true
                state.error = null
            })
            .addCase(updateRole.fulfilled, (state, action) => {
                state.componentLoading.operations = false
                const index = state.roles.findIndex((r) => r.id === action.payload.id)
                if (index !== -1) {
                    state.roles[index] = action.payload
                }
            })
            .addCase(updateRole.rejected, (state, action) => {
                state.componentLoading.operations = false
                state.error = action.payload as string
            })

        // ===========================
        // Delete Role
        // ===========================
        builder
            .addCase(deleteRole.pending, (state) => {
                state.componentLoading.operations = true
                state.error = null
            })
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.componentLoading.operations = false
                state.roles = state.roles.filter((r) => r.id !== action.payload)
                state.rolesTotal -= 1
            })
            .addCase(deleteRole.rejected, (state, action) => {
                state.componentLoading.operations = false
                state.error = action.payload as string
            })

        // ===========================
        // Assign Role
        // ===========================
        builder
            .addCase(assignRole.pending, (state) => {
                state.componentLoading.operations = true
                state.error = null
            })
            .addCase(assignRole.fulfilled, (state, action) => {
                state.componentLoading.operations = false
                const index = state.members.findIndex((m) => m.id === action.payload.id)
                if (index !== -1) {
                    state.members[index] = action.payload
                }
            })
            .addCase(assignRole.rejected, (state, action) => {
                state.componentLoading.operations = false
                state.error = action.payload as string
            })

        // ===========================
        // Fetch Workspace Projects
        // ===========================
        builder
            .addCase(fetchWorkspaceProjects.pending, (state) => {
                state.componentLoading.projects = true
                state.error = null
            })
            .addCase(fetchWorkspaceProjects.fulfilled, (state, action) => {
                state.componentLoading.projects = false
                state.projects = action.payload.projects
                state.projectsTotal = action.payload.total
            })
            .addCase(fetchWorkspaceProjects.rejected, (state, action) => {
                state.componentLoading.projects = false
                state.error = action.payload as string
            })

        // ===========================
        // Create Project
        // ===========================
        builder
            .addCase(createProject.pending, (state) => {
                state.componentLoading.operations = true
                state.error = null
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.componentLoading.operations = false
                state.projects.unshift(action.payload)
                state.projectsTotal += 1
            })
            .addCase(createProject.rejected, (state, action) => {
                state.componentLoading.operations = false
                state.error = action.payload as string
            })

        // ===========================
        // Update Project
        // ===========================
        builder
            .addCase(updateProject.pending, (state) => {
                state.componentLoading.operations = true
                state.error = null
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                state.componentLoading.operations = false
                const index = state.projects.findIndex((p) => p.id === action.payload.id)
                if (index !== -1) {
                    state.projects[index] = action.payload
                }
            })
            .addCase(updateProject.rejected, (state, action) => {
                state.componentLoading.operations = false
                state.error = action.payload as string
            })

        // ===========================
        // Delete Project
        // ===========================
        builder
            .addCase(deleteProject.pending, (state) => {
                state.componentLoading.operations = true
                state.error = null
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.componentLoading.operations = false
                state.projects = state.projects.filter((p) => p.id !== action.payload)
                state.projectsTotal -= 1
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.componentLoading.operations = false
                state.error = action.payload as string
            })

        // ===========================
        // Fetch Usage Report
        // ===========================
        builder
            .addCase(fetchUsageReport.pending, (state) => {
                state.componentLoading.usageReport = true
                state.error = null
            })
            .addCase(fetchUsageReport.fulfilled, (state, action) => {
                state.componentLoading.usageReport = false
                state.usageReport = action.payload
            })
            .addCase(fetchUsageReport.rejected, (state, action) => {
                state.componentLoading.usageReport = false
                state.error = action.payload as string
            })

        // ===========================
        // Export Usage Report
        // ===========================
        builder
            .addCase(exportUsageReport.pending, (state) => {
                state.componentLoading.operations = true
                state.error = null
            })
            .addCase(exportUsageReport.fulfilled, (state) => {
                state.componentLoading.operations = false
            })
            .addCase(exportUsageReport.rejected, (state, action) => {
                state.componentLoading.operations = false
                state.error = action.payload as string
            })

        // ===========================
        // Fetch Credit Transactions
        // ===========================
        builder
            .addCase(fetchCreditTransactions.pending, (state) => {
                state.componentLoading.creditTransactions = true
                state.error = null
            })
            .addCase(fetchCreditTransactions.fulfilled, (state, action) => {
                state.componentLoading.creditTransactions = false
                state.creditTransactions = action.payload.transactions
                state.creditTransactionsTotal = action.payload.total
            })
            .addCase(fetchCreditTransactions.rejected, (state, action) => {
                state.componentLoading.creditTransactions = false
                state.error = action.payload as string
            })

        // ===========================
        // Allocate Credits
        // ===========================
        builder
            .addCase(allocateCredits.pending, (state) => {
                state.componentLoading.operations = true
                state.error = null
            })
            .addCase(allocateCredits.fulfilled, (state, action) => {
                state.componentLoading.operations = false
                state.creditTransactions.unshift(action.payload)
                state.creditTransactionsTotal += 1
            })
            .addCase(allocateCredits.rejected, (state, action) => {
                state.componentLoading.operations = false
                state.error = action.payload as string
            })

        // ===========================
        // Share Credits
        // ===========================
        builder
            .addCase(shareWorkspaceCredits.pending, (state) => {
                state.componentLoading.operations = true
                state.error = null
            })
            .addCase(shareWorkspaceCredits.fulfilled, (state) => {
                state.componentLoading.operations = false
            })
            .addCase(shareWorkspaceCredits.rejected, (state, action) => {
                state.componentLoading.operations = false
                state.error = action.payload as string
            })

        // ===========================
        // Top Up Credits
        // ===========================
        builder
            .addCase(topUpCredits.pending, (state) => {
                state.componentLoading.operations = true
                state.error = null
            })
            .addCase(topUpCredits.fulfilled, (state, action) => {
                state.componentLoading.operations = false
                state.creditTransactions.unshift(action.payload)
                state.creditTransactionsTotal += 1
            })
            .addCase(topUpCredits.rejected, (state, action) => {
                state.componentLoading.operations = false
                state.error = action.payload as string
            })

        // ===========================
        // Fetch Workspace Integrations
        // ===========================
        builder
            .addCase(fetchWorkspaceIntegrations.pending, (state) => {
                state.componentLoading.integrations = true
                state.error = null
            })
            .addCase(fetchWorkspaceIntegrations.fulfilled, (state, action) => {
                state.componentLoading.integrations = false
                state.integrations = action.payload.integrations
                state.integrationsTotal = action.payload.total
            })
            .addCase(fetchWorkspaceIntegrations.rejected, (state, action) => {
                state.componentLoading.integrations = false
                state.error = action.payload as string
            })

        // ===========================
        // Connect Integration
        // ===========================
        builder
            .addCase(connectIntegration.pending, (state) => {
                state.componentLoading.operations = true
                state.error = null
            })
            .addCase(connectIntegration.fulfilled, (state, action) => {
                state.componentLoading.operations = false
                state.integrations.push(action.payload)
                state.integrationsTotal += 1
            })
            .addCase(connectIntegration.rejected, (state, action) => {
                state.componentLoading.operations = false
                state.error = action.payload as string
            })

        // ===========================
        // Disconnect Integration
        // ===========================
        builder
            .addCase(disconnectIntegration.pending, (state) => {
                state.componentLoading.operations = true
                state.error = null
            })
            .addCase(disconnectIntegration.fulfilled, (state, action) => {
                state.componentLoading.operations = false
                state.integrations = state.integrations.filter((i) => i.id !== action.payload)
                state.integrationsTotal -= 1
            })
            .addCase(disconnectIntegration.rejected, (state, action) => {
                state.componentLoading.operations = false
                state.error = action.payload as string
            })

        // ===========================
        // Update Integration
        // ===========================
        builder
            .addCase(updateIntegration.pending, (state) => {
                state.componentLoading.operations = true
                state.error = null
            })
            .addCase(updateIntegration.fulfilled, (state, action) => {
                state.componentLoading.operations = false
                const index = state.integrations.findIndex((i) => i.id === action.payload.id)
                if (index !== -1) {
                    state.integrations[index] = action.payload
                }
            })
            .addCase(updateIntegration.rejected, (state, action) => {
                state.componentLoading.operations = false
                state.error = action.payload as string
            })

        // ===========================
        // Upload Workspace Avatar
        // ===========================
        builder
            .addCase(uploadWorkspaceAvatar.pending, (state) => {
                state.componentLoading.operations = true
                state.error = null
            })
            .addCase(uploadWorkspaceAvatar.fulfilled, (state, action) => {
                state.componentLoading.operations = false
                const index = state.workspaces.findIndex((w) => w.id === action.payload.id)
                if (index !== -1) {
                    state.workspaces[index] = action.payload
                }
                if (state.currentWorkspace?.id === action.payload.id) {
                    state.currentWorkspace = action.payload
                }
            })
            .addCase(uploadWorkspaceAvatar.rejected, (state, action) => {
                state.componentLoading.operations = false
                state.error = action.payload as string
            })

        // ===========================
        // Delete Workspace Avatar
        // ===========================
        builder
            .addCase(deleteWorkspaceAvatar.pending, (state) => {
                state.componentLoading.operations = true
                state.error = null
            })
            .addCase(deleteWorkspaceAvatar.fulfilled, (state, action) => {
                state.componentLoading.operations = false
                const index = state.workspaces.findIndex((w) => w.id === action.payload.id)
                if (index !== -1) {
                    state.workspaces[index] = action.payload
                }
                if (state.currentWorkspace?.id === action.payload.id) {
                    state.currentWorkspace = action.payload
                }
            })
            .addCase(deleteWorkspaceAvatar.rejected, (state, action) => {
                state.componentLoading.operations = false
                state.error = action.payload as string
            })
    },
})

export const { clearError, setCurrentWorkspace, clearCurrentWorkspace, resetWorkspaceState } =
    workspaceSlice.actions

export default workspaceSlice.reducer
