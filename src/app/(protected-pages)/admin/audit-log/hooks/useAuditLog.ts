import { useCallback, useEffect } from 'react'
import {
    getAuditLogs,
    getAuditStats,
    setFilterParams,
    resetFilterParams,
    selectAuditLogs,
    selectAuditLogTotal,
    selectAuditLogStats,
    selectAuditLogLoading,
    selectAuditLogStatsLoading,
    selectAuditLogFilterParams,
    selectAuditLogError
} from '@/store/slices/auditLog'
import { useAppDispatch, useAppSelector } from '@/store'
import type { AuditLogFilterParams } from '../types'
import { apiExportAuditLogs } from '@/services/AuditLogService'

/**
 * useAuditLog - Hook for managing audit log data fetching and state via Redux
 */
export function useAuditLog() {
    const dispatch = useAppDispatch()

    const logs = useAppSelector(selectAuditLogs)
    const total = useAppSelector(selectAuditLogTotal)
    const stats = useAppSelector(selectAuditLogStats)
    const loading = useAppSelector(selectAuditLogLoading)
    const statsLoading = useAppSelector(selectAuditLogStatsLoading)
    const filterParams = useAppSelector(selectAuditLogFilterParams)
    const error = useAppSelector(selectAuditLogError)

    const fetchLogs = useCallback(async () => {
        dispatch(getAuditLogs(filterParams))
    }, [dispatch, filterParams])

    const fetchStats = useCallback(async (range = '24h') => {
        dispatch(getAuditStats(range))
    }, [dispatch])

    useEffect(() => {
        fetchLogs()
    }, [fetchLogs])

    useEffect(() => {
        fetchStats()
    }, [fetchStats])

    const updateParams = (newParams: Partial<AuditLogFilterParams>) => {
        dispatch(setFilterParams(newParams))
    }

    const resetFilters = () => {
        dispatch(resetFilterParams())
    }

    const exportLogs = async () => {
        try {
            const blob = await apiExportAuditLogs(filterParams)
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            return true
        } catch (err) {
            console.error('Failed to export logs:', err)
            throw err
        }
    }

    return {
        logs,
        total,
        stats,
        loading,
        statsLoading,
        params: filterParams,
        error,
        updateParams,
        resetFilters,
        refetch: fetchLogs,
        fetchStats,
        exportLogs
    }
}
