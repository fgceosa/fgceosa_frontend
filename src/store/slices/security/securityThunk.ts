import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetSecurityStats,
    apiGetSecurityEvents,
    apiUpdateEventStatus,
    apiPerformAdminAction,
    apiGetMonitoredApiKeys,
    apiUpdateSecurityConfig,
    apiTerminateAllSessions,
    apiRunSecurityScan,
} from '@/services/security/securityService'
import { SLICE_BASE_NAME } from './constants'
import type { SecurityEventListParams, AdminActionParams } from '@/app/(protected-pages)/admin/security/types'

export const fetchSecurityStats = createAsyncThunk(
    `${SLICE_BASE_NAME}/fetchStats`,
    async (_, { rejectWithValue }) => {
        try {
            return await apiGetSecurityStats()
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch security stats')
        }
    }
)

export const fetchSecurityEvents = createAsyncThunk(
    `${SLICE_BASE_NAME}/fetchEvents`,
    async (params: SecurityEventListParams, { rejectWithValue }) => {
        try {
            return await apiGetSecurityEvents(params)
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch security events')
        }
    }
)

export const updateSecurityEventStatus = createAsyncThunk(
    `${SLICE_BASE_NAME}/updateEventStatus`,
    async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
        try {
            return await apiUpdateEventStatus(id, status)
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update status')
        }
    }
)

export const performAdminAction = createAsyncThunk(
    `${SLICE_BASE_NAME}/performAdminAction`,
    async (data: AdminActionParams, { rejectWithValue }) => {
        try {
            return await apiPerformAdminAction(data)
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to perform admin action')
        }
    }
)

export const fetchMonitoredApiKeys = createAsyncThunk(
    `${SLICE_BASE_NAME}/fetchMonitoredApiKeys`,
    async (params: { page: number; limit: number; search?: string }, { rejectWithValue }) => {
        try {
            return await apiGetMonitoredApiKeys(params)
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch API keys')
        }
    }
)

export const updateSecurityConfig = createAsyncThunk(
    `${SLICE_BASE_NAME}/updateConfig`,
    async (data: any, { rejectWithValue, dispatch }) => {
        try {
            const response = await apiUpdateSecurityConfig(data)
            dispatch(fetchSecurityStats())
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update security config')
        }
    }
)

export const terminateAllSessions = createAsyncThunk(
    `${SLICE_BASE_NAME}/terminateAllSessions`,
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await apiTerminateAllSessions()
            dispatch(fetchSecurityStats())
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to terminate sessions')
        }
    }
)

export const runSecurityScan = createAsyncThunk(
    `${SLICE_BASE_NAME}/runScan`,
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await apiRunSecurityScan()
            dispatch(fetchSecurityStats())
            dispatch(fetchSecurityEvents({ pageIndex: 1, pageSize: 10 }))
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Scan failed')
        }
    }
)
