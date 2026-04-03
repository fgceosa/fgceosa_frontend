import { RootState } from '@/store'
import { MODEL_LIBRARY_STATUS } from './constants'

// Basic selectors
export const selectModels = (state: RootState) => state.modelLibrary.models

export const selectTotalModels = (state: RootState) => state.modelLibrary.totalModels

export const selectProviders = (state: RootState) => state.modelLibrary.providers

export const selectTotalProviders = (state: RootState) => state.modelLibrary.totalProviders

export const selectModelLibraryStats = (state: RootState) => state.modelLibrary.stats

export const selectModelLibraryLoading = (state: RootState) => state.modelLibrary.loading

export const selectModelLibraryStatus = (state: RootState) => state.modelLibrary.status

export const selectModelLibraryError = (state: RootState) => state.modelLibrary.error

export const selectModelLibraryLastFetched = (state: RootState) =>
    state.modelLibrary.lastFetched

export const selectSelectedModel = (state: RootState) => state.modelLibrary.selectedModel

export const selectSelectedProvider = (state: RootState) => state.modelLibrary.selectedProvider

// Component loading selectors
export const selectComponentLoading = (state: RootState) =>
    state.modelLibrary.componentLoading

export const selectModelsLoading = (state: RootState) =>
    state.modelLibrary.componentLoading.models

export const selectProvidersLoading = (state: RootState) =>
    state.modelLibrary.componentLoading.providers

export const selectStatsLoading = (state: RootState) =>
    state.modelLibrary.componentLoading.stats

export const selectModelDetailsLoading = (state: RootState) =>
    state.modelLibrary.componentLoading.modelDetails

export const selectProviderDetailsLoading = (state: RootState) =>
    state.modelLibrary.componentLoading.providerDetails

// Computed selectors
export const selectAnyComponentLoading = (state: RootState) => {
    const { models, providers, stats, modelDetails, providerDetails } =
        state.modelLibrary.componentLoading
    return models || providers || stats || modelDetails || providerDetails
}

export const selectHasModels = (state: RootState) =>
    state.modelLibrary.models.length > 0

export const selectHasProviders = (state: RootState) =>
    state.modelLibrary.providers.length > 0

export const selectTextModels = (state: RootState) =>
    state.modelLibrary.models.filter((model) => model.category === 'Text')

export const selectEmbeddingModels = (state: RootState) =>
    state.modelLibrary.models.filter((model) => model.category === 'Embedding')

export const selectApprovedModels = (state: RootState) =>
    state.modelLibrary.models.filter((model) => model.status === 'Approved')

export const selectModelsByProvider = (state: RootState, providerId: string) =>
    state.modelLibrary.models.filter((model) => model.providerId === providerId)

export const selectHasError = (state: RootState) => state.modelLibrary.error !== null

export const selectIsSuccessful = (state: RootState) =>
    state.modelLibrary.status === MODEL_LIBRARY_STATUS.SUCCEEDED

export const selectIsFailed = (state: RootState) =>
    state.modelLibrary.status === MODEL_LIBRARY_STATUS.FAILED

export const selectIsIdle = (state: RootState) =>
    state.modelLibrary.status === MODEL_LIBRARY_STATUS.IDLE

export const selectModelLibraryReady = (state: RootState) =>
    !state.modelLibrary.loading && state.modelLibrary.lastFetched !== null

// Export default selectors object
export default {
    selectModels,
    selectTotalModels,
    selectProviders,
    selectTotalProviders,
    selectModelLibraryStats,
    selectModelLibraryLoading,
    selectModelLibraryStatus,
    selectModelLibraryError,
    selectModelLibraryLastFetched,
    selectSelectedModel,
    selectSelectedProvider,
    selectComponentLoading,
    selectModelsLoading,
    selectProvidersLoading,
    selectStatsLoading,
    selectModelDetailsLoading,
    selectProviderDetailsLoading,
    selectAnyComponentLoading,
    selectHasModels,
    selectHasProviders,
    selectTextModels,
    selectEmbeddingModels,
    selectApprovedModels,
    selectModelsByProvider,
    selectHasError,
    selectIsSuccessful,
    selectIsFailed,
    selectIsIdle,
    selectModelLibraryReady,
}
