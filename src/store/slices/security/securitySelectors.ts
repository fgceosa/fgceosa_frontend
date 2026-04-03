import type { RootState } from '@/store'

export const selectSecurityStats = (state: RootState) => state.security.stats
export const selectSecurityEvents = (state: RootState) => state.security.events
export const selectSecurityEventsTotal = (state: RootState) => state.security.eventsTotal
export const selectCurrentEventsParams = (state: RootState) => state.security.currentEventsParams
export const selectSecurityLoading = (state: RootState) => state.security.loading || state.security.statsLoading || state.security.eventsLoading
export const selectSecurityActionLoading = (state: RootState) => state.security.actionLoading
export const selectSecurityError = (state: RootState) => state.security.error
export const selectMonitoredApiKeys = (state: RootState) => state.security.monitoredApiKeys
export const selectMonitoredApiKeysTotal = (state: RootState) => state.security.monitoredApiKeysTotal
export const selectMonitoredApiKeysLoading = (state: RootState) => state.security.keysLoading
