import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME, AUDIT_LOG_STATUS } from './constants'
import { getAuditLogs, getAuditStats } from './auditLogThunk'
import type { AuditLogEntry, AuditLogStats, AuditLogFilterParams } from '@/app/(protected-pages)/admin/audit-log/types'

export interface AuditLogState {
    logs: AuditLogEntry[]
    total: number
    stats: AuditLogStats | null
    loading: boolean
    statsLoading: boolean
    filterParams: AuditLogFilterParams
    error: string | null
    status: string
}

const initialState: AuditLogState = {
    logs: [],
    total: 0,
    stats: null,
    loading: false,
    statsLoading: false,
    filterParams: {
        page: 1,
        page_size: 10,
    },
    error: null,
    status: AUDIT_LOG_STATUS.IDLE,
}

const auditLogSlice = createSlice({
    name: SLICE_BASE_NAME,
    initialState,
    reducers: {
        setFilterParams: (state, action: PayloadAction<Partial<AuditLogFilterParams>>) => {
            state.filterParams = { ...state.filterParams, ...action.payload }
        },
        resetFilterParams: (state) => {
            state.filterParams = initialState.filterParams
        },
        clearAuditLogError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        // Fetch Logs
        builder
            .addCase(getAuditLogs.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getAuditLogs.fulfilled, (state, action) => {
                state.loading = false
                state.logs = action.payload.logs
                state.total = action.payload.total
                state.status = AUDIT_LOG_STATUS.SUCCEEDED
            })
            .addCase(getAuditLogs.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
                state.status = AUDIT_LOG_STATUS.FAILED
            })

        // Fetch Stats
        builder
            .addCase(getAuditStats.pending, (state) => {
                state.statsLoading = true
                state.error = null
            })
            .addCase(getAuditStats.fulfilled, (state, action) => {
                state.statsLoading = false
                state.stats = action.payload
            })
            .addCase(getAuditStats.rejected, (state, action) => {
                state.statsLoading = false
                state.error = action.payload as string
            })
    },
})

export const { setFilterParams, resetFilterParams, clearAuditLogError } = auditLogSlice.actions
export default auditLogSlice.reducer
