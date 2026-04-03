import { createSlice } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME, SECURITY_STATUS } from './constants'
import {
    fetchSecurityStats,
    fetchSecurityEvents,
    updateSecurityEventStatus,
    performAdminAction,
    fetchMonitoredApiKeys,
} from './securityThunk'
import type { SecurityStats, SecurityEvent, SecurityEventListParams, ApiKey } from '@/app/(protected-pages)/admin/security/types'

export interface SecurityState {
    stats: SecurityStats | null
    events: SecurityEvent[]
    eventsTotal: number
    currentEventsParams: SecurityEventListParams
    loading: boolean
    statsLoading: boolean
    eventsLoading: boolean
    actionLoading: boolean
    error: string | null
    status: string
    monitoredApiKeys: ApiKey[]
    monitoredApiKeysTotal: number
    keysLoading: boolean
}

const initialState: SecurityState = {
    stats: null,
    events: [],
    eventsTotal: 0,
    currentEventsParams: {
        pageIndex: 1,
        pageSize: 10,
    },
    loading: false,
    statsLoading: false,
    eventsLoading: false,
    actionLoading: false,
    error: null,
    status: SECURITY_STATUS.IDLE,
    monitoredApiKeys: [],
    monitoredApiKeysTotal: 0,
    keysLoading: false,
}

const securitySlice = createSlice({
    name: SLICE_BASE_NAME,
    initialState,
    reducers: {
        resetSecurityState: () => initialState,
        clearError: (state) => {
            state.error = null
        },
        setEventsParams: (state, action) => {
            state.currentEventsParams = { ...state.currentEventsParams, ...action.payload }
        },
    },
    extraReducers: (builder) => {
        // Fetch Stats
        builder
            .addCase(fetchSecurityStats.pending, (state) => {
                state.statsLoading = true
                state.error = null
            })
            .addCase(fetchSecurityStats.fulfilled, (state, action) => {
                state.statsLoading = false
                state.stats = action.payload
            })
            .addCase(fetchSecurityStats.rejected, (state, action) => {
                state.statsLoading = false
                state.error = action.payload as string
            })

        // Fetch Events
        builder
            .addCase(fetchSecurityEvents.pending, (state) => {
                state.eventsLoading = true
                state.error = null
            })
            .addCase(fetchSecurityEvents.fulfilled, (state, action) => {
                state.eventsLoading = false
                state.events = action.payload.events
                state.eventsTotal = action.payload.total
            })
            .addCase(fetchSecurityEvents.rejected, (state, action) => {
                state.eventsLoading = false
                state.events = [] // Clear events on error so UI doesn't show stale data
                state.error = action.payload as string
            })

        // Update Event Status
        builder.addCase(updateSecurityEventStatus.pending, (state) => {
            state.actionLoading = true
        }).addCase(updateSecurityEventStatus.fulfilled, (state, action) => {
            state.actionLoading = false
            const index = state.events.findIndex(e => e.id === action.payload.id)
            if (index !== -1) {
                state.events[index] = action.payload
            }
        }).addCase(updateSecurityEventStatus.rejected, (state, action) => {
            state.actionLoading = false
            state.error = action.payload as string
        })

        // Admin Action
        builder.addCase(performAdminAction.pending, (state) => {
            state.actionLoading = true
        }).addCase(performAdminAction.fulfilled, (state) => {
            state.actionLoading = false
        }).addCase(performAdminAction.rejected, (state, action) => {
            state.actionLoading = false
            state.error = action.payload as string
        })

        // Fetch Monitored Keys
        builder.addCase(fetchMonitoredApiKeys.pending, (state) => {
            state.keysLoading = true
            state.error = null
        }).addCase(fetchMonitoredApiKeys.fulfilled, (state, action) => {
            state.keysLoading = false
            state.monitoredApiKeys = action.payload.keys
            state.monitoredApiKeysTotal = action.payload.total
        }).addCase(fetchMonitoredApiKeys.rejected, (state, action) => {
            state.keysLoading = false
            state.monitoredApiKeys = []
            state.error = action.payload as string
        })
    },
})

export const { resetSecurityState, clearError, setEventsParams } = securitySlice.actions
export default securitySlice.reducer
