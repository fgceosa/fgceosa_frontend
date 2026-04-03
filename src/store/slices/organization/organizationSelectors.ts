import type { RootState } from '@/store'

export const selectOrganizationMembers = (state: RootState) => state.organization.members
export const selectOrganizationRoles = (state: RootState) => state.organization.roles
export const selectOrganizationLoading = (state: RootState) => state.organization.loading
export const selectOrganizationError = (state: RootState) => state.organization.error

export const selectOrganizationCreditBalance = (state: RootState) => state.organization.credits.balance
export const selectOrganizationCreditTransactions = (state: RootState) => state.organization.credits.transactions
export const selectOrganizationUsageSummary = (state: RootState) => state.organization.credits.usageSummary
export const selectOrganizationUsageLoading = (state: RootState) => state.organization.credits.loading

export const selectCurrentOrganizationId = (state: RootState) => state.organization.organizationId
export const selectCurrentUserRole = (state: RootState) => state.organization.userRole
export const selectOrganizationActivities = (state: RootState) => state.organization.activities
export const selectOrganizationActivityLoading = (state: RootState) => state.organization.activityLoading

export const selectCurrentOrganization = (state: RootState) => state.organization.currentOrganization
