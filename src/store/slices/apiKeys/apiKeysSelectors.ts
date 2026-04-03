import { RootState } from '@/store'
import { API_KEYS_STATUS } from './constants'

// Basic selectors
export const selectApiKeys = (state: RootState) => state.apiKeys.keys

export const selectApiKeysTotal = (state: RootState) => state.apiKeys.total

export const selectApiKeysStats = (state: RootState) => state.apiKeys.stats

export const selectApiKeysLoading = (state: RootState) => state.apiKeys.loading

export const selectApiKeysStatus = (state: RootState) => state.apiKeys.status

export const selectApiKeysError = (state: RootState) => state.apiKeys.error

export const selectApiKeysLastFetched = (state: RootState) =>
    state.apiKeys.lastFetched

// Component loading selectors
export const selectComponentLoading = (state: RootState) =>
    state.apiKeys.componentLoading

export const selectKeysLoading = (state: RootState) =>
    state.apiKeys.componentLoading.keys

export const selectStatsLoading = (state: RootState) =>
    state.apiKeys.componentLoading.stats

export const selectCreateLoading = (state: RootState) =>
    state.apiKeys.componentLoading.create

export const selectDeleteLoading = (state: RootState) =>
    state.apiKeys.componentLoading.delete

export const selectRevokeLoading = (state: RootState) =>
    state.apiKeys.componentLoading.revoke

// Computed selectors
export const selectAnyComponentLoading = (state: RootState) => {
    const { keys, stats, create, deleteKey, revoke } =
        state.apiKeys.componentLoading
    return keys || stats || create || deleteKey || revoke
}

export const selectHasApiKeys = (state: RootState) =>
    state.apiKeys.keys.length > 0

export const selectActiveKeys = (state: RootState) =>
    state.apiKeys.keys.filter((key) => key.status === 'active')

export const selectHasError = (state: RootState) => state.apiKeys.error !== null

export const selectIsSuccessful = (state: RootState) =>
    state.apiKeys.status === API_KEYS_STATUS.SUCCEEDED

export const selectIsFailed = (state: RootState) =>
    state.apiKeys.status === API_KEYS_STATUS.FAILED

export const selectIsIdle = (state: RootState) =>
    state.apiKeys.status === API_KEYS_STATUS.IDLE

export const selectApiKeysReady = (state: RootState) =>
    !state.apiKeys.loading && state.apiKeys.lastFetched !== null

// Export default selectors object
export default {
    selectApiKeys,
    selectApiKeysTotal,
    selectApiKeysStats,
    selectApiKeysLoading,
    selectApiKeysStatus,
    selectApiKeysError,
    selectApiKeysLastFetched,
    selectComponentLoading,
    selectKeysLoading,
    selectStatsLoading,
    selectCreateLoading,
    selectDeleteLoading,
    selectRevokeLoading,
    selectAnyComponentLoading,
    selectHasApiKeys,
    selectActiveKeys,
    selectHasError,
    selectIsSuccessful,
    selectIsFailed,
    selectIsIdle,
    selectApiKeysReady,
}
