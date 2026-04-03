import type { RootState } from '@/store/rootReducer'

export const selectPlatformOrgsLoading = (state: RootState) =>
    state.platformOrganizations.loading

export const selectPlatformOrgsAnalyticsLoading = (state: RootState) =>
    state.platformOrganizations.analyticsLoading

export const selectPlatformOrgsList = (state: RootState) =>
    state.platformOrganizations.organizations

export const selectPlatformOrgsAnalytics = (state: RootState) =>
    state.platformOrganizations.analytics

export const selectPlatformOrgsTotal = (state: RootState) =>
    state.platformOrganizations.total

export const selectPlatformOrgsFilter = (state: RootState) =>
    state.platformOrganizations.filter
