import type { RootState } from '@/store'

export const selectModelRegistryLoading = (state: RootState) => state.modelRegistry.loading
export const selectRegistryModels = (state: RootState) => state.modelRegistry.models
export const selectRegistryAnalytics = (state: RootState) => state.modelRegistry.analytics
export const selectRegistryProviders = (state: RootState) => state.modelRegistry.providers
export const selectSelectedRegistryModel = (state: RootState) => state.modelRegistry.selectedModel
