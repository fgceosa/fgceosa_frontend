import { RootState } from '@/store'

// Workspace selectors
export const selectWorkspaces = (state: RootState) => state.workspace.workspaces
export const selectCurrentWorkspace = (state: RootState) => state.workspace.currentWorkspace
export const selectWorkspacesTotal = (state: RootState) => state.workspace.workspacesTotal

// Dashboard selectors
export const selectDashboardStats = (state: RootState) => state.workspace.dashboardStats

// Members selectors
export const selectWorkspaceMembers = (state: RootState) => state.workspace.members
export const selectMembersTotal = (state: RootState) => state.workspace.membersTotal

// Roles selectors
export const selectWorkspaceRoles = (state: RootState) => state.workspace.roles
export const selectRolesTotal = (state: RootState) => state.workspace.rolesTotal

// Projects selectors
export const selectWorkspaceProjects = (state: RootState) => state.workspace.projects
export const selectProjectsTotal = (state: RootState) => state.workspace.projectsTotal

// Usage Report selectors
export const selectUsageReport = (state: RootState) => state.workspace.usageReport

// Credit Transactions selectors
export const selectCreditTransactions = (state: RootState) => state.workspace.creditTransactions
export const selectCreditTransactionsTotal = (state: RootState) =>
    state.workspace.creditTransactionsTotal

// Integrations selectors
export const selectWorkspaceIntegrations = (state: RootState) => state.workspace.integrations
export const selectIntegrationsTotal = (state: RootState) => state.workspace.integrationsTotal

// Loading state selectors
export const selectWorkspaceStatus = (state: RootState) => state.workspace.status
export const selectWorkspaceLoading = (state: RootState) => state.workspace.loading
export const selectWorkspacesLoading = (state: RootState) =>
    state.workspace.componentLoading.workspaces
export const selectCurrentWorkspaceLoading = (state: RootState) =>
    state.workspace.componentLoading.currentWorkspace
export const selectDashboardStatsLoading = (state: RootState) =>
    state.workspace.componentLoading.dashboardStats
export const selectMembersLoading = (state: RootState) => state.workspace.componentLoading.members
export const selectRolesLoading = (state: RootState) => state.workspace.componentLoading.roles
export const selectProjectsLoading = (state: RootState) => state.workspace.componentLoading.projects
export const selectUsageReportLoading = (state: RootState) =>
    state.workspace.componentLoading.usageReport
export const selectCreditTransactionsLoading = (state: RootState) =>
    state.workspace.componentLoading.creditTransactions
export const selectIntegrationsLoading = (state: RootState) =>
    state.workspace.componentLoading.integrations
export const selectOperationsLoading = (state: RootState) =>
    state.workspace.componentLoading.operations

// Error selector
export const selectWorkspaceError = (state: RootState) => state.workspace.error

// Last fetched selector
export const selectLastFetched = (state: RootState) => state.workspace.lastFetched
