import { RootState } from '@/store'

export const selectAuditLogs = (state: RootState) => state.auditLog.logs
export const selectAuditLogTotal = (state: RootState) => state.auditLog.total
export const selectAuditLogStats = (state: RootState) => state.auditLog.stats
export const selectAuditLogLoading = (state: RootState) => state.auditLog.loading
export const selectAuditLogStatsLoading = (state: RootState) => state.auditLog.statsLoading
export const selectAuditLogFilterParams = (state: RootState) => state.auditLog.filterParams
export const selectAuditLogError = (state: RootState) => state.auditLog.error
