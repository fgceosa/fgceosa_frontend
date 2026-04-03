import type { RootState } from '@/store'

export const selectOrgModels = (state: RootState) => state.orgModelLibrary.models
export const selectOrgModelsLoading = (state: RootState) => state.orgModelLibrary.loading
export const selectOrgModelAnalytics = (state: RootState) => state.orgModelLibrary.analytics
export const selectOrgModelSearchQuery = (state: RootState) => state.orgModelLibrary.searchQuery
export const selectOrgModelFilterProvider = (state: RootState) => state.orgModelLibrary.filterProvider
export const selectOrgModelFilterCapability = (state: RootState) => state.orgModelLibrary.filterCapability
export const selectOrgModelFilterStatus = (state: RootState) => state.orgModelLibrary.filterStatus
export const selectOrgModelFilterCategory = (state: RootState) => state.orgModelLibrary.filterCategory
export const selectOrgModelSortBy = (state: RootState) => state.orgModelLibrary.sortBy
