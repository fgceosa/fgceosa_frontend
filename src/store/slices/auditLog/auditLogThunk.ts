import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetAuditLogs, apiGetAuditStats } from '@/services/AuditLogService'
import type { AuditLogFilterParams, AuditLogListResponse, AuditLogStats } from '@/app/(protected-pages)/admin/audit-log/types'
import { SLICE_BASE_NAME } from './constants'

export const getAuditLogs = createAsyncThunk(
    `${SLICE_BASE_NAME}/getAuditLogs`,
    async (params: AuditLogFilterParams, { rejectWithValue }) => {
        try {
            const response = await apiGetAuditLogs(params)
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch audit logs')
        }
    }
)

export const getAuditStats = createAsyncThunk(
    `${SLICE_BASE_NAME}/getAuditStats`,
    async (range: string | undefined, { rejectWithValue }) => {
        try {
            const response = await apiGetAuditStats(range)
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch audit stats')
        }
    }
)
