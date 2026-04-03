import { createSlice } from '@reduxjs/toolkit'
import {
    fetchOrganizationTeam,
    inviteOrganizationMember,
    updateOrganizationMember,
    removeOrganizationMember,
    fetchOrganizationRoles,
    createOrganizationRole,
    updateOrganizationRole,
    deleteOrganizationRole,
    fetchOrganizationCreditBalance,
    fetchOrganizationCreditTransactions,
    fetchOrganizationUsageSummary,
    fetchOrganizationActivity,
    fetchMyOrganization,
    updateOrganization
} from './organizationThunk'
import type {
    OrganizationMember,
    OrganizationRole,
    OrganizationCreditBalance,
    OrganizationCreditTransaction,
    OrganizationUsageSummary,
    OrganizationProfile
} from '@/app/(protected-pages)/organizations/types'

export interface OrganizationState {
    currentOrganization: OrganizationProfile | null
    members: OrganizationMember[]
    membersTotal: number
    roles: OrganizationRole[]
    rolesTotal: number
    loading: boolean
    error: string | null
    lastFetched: number | null
    userRole: string | null
    organizationId: string | null
    roleFetched: boolean
    credits: {
        balance: OrganizationCreditBalance | null
        transactions: OrganizationCreditTransaction[]
        transactionsTotal: number
        usageSummary: OrganizationUsageSummary | null
        loading: boolean
    }
    activities: any[]
    activitiesTotal: number
    activityLoading: boolean
}

const initialState: OrganizationState = {
    currentOrganization: null,
    members: [],
    membersTotal: 0,
    roles: [],
    rolesTotal: 0,
    loading: false,
    error: null,
    lastFetched: null,
    userRole: null,
    organizationId: null,
    roleFetched: false,
    credits: {
        balance: null,
        transactions: [],
        transactionsTotal: 0,
        usageSummary: null,
        loading: false
    },
    activities: [],
    activitiesTotal: 0,
    activityLoading: false
}

const organizationSlice = createSlice({
    name: 'organization',
    initialState,
    reducers: {
        clearError(state) {
            state.error = null
        },
        setUserRole(state, action: { payload: string | null }) {
            state.userRole = action.payload
            state.roleFetched = true
        },
        setCurrentOrganization(state, action: { payload: { id: string, role: string } | null }) {
            if (action.payload) {
                state.organizationId = action.payload.id
                state.userRole = action.payload.role
                state.roleFetched = true
            } else {
                state.organizationId = null
                state.userRole = null
                state.roleFetched = false
            }
        },
        resetOrganizationState: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrganizationTeam.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchOrganizationTeam.fulfilled, (state, action) => {
                state.loading = false
                state.members = action.payload.list
                state.membersTotal = action.payload.total
                state.lastFetched = Date.now()
            })
            .addCase(fetchOrganizationTeam.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch team'
                state.lastFetched = Date.now()
            })

            .addCase(inviteOrganizationMember.fulfilled, (state, action) => {
                state.members.unshift(action.payload)
                state.membersTotal += 1
            })

            .addCase(updateOrganizationMember.fulfilled, (state, action) => {
                const index = state.members.findIndex(m => m.id === action.payload.id)
                if (index !== -1) {
                    state.members[index] = action.payload
                }
            })

            .addCase(removeOrganizationMember.fulfilled, (state, action) => {
                state.members = state.members.filter(m => m.id !== action.payload)
                state.membersTotal -= 1
            })

            .addCase(fetchOrganizationRoles.fulfilled, (state, action) => {
                state.roles = action.payload.roles
                state.rolesTotal = action.payload.roles.length
            })

            .addCase(createOrganizationRole.fulfilled, (state, action) => {
                state.roles.push(action.payload)
                state.rolesTotal += 1
            })

            .addCase(updateOrganizationRole.fulfilled, (state, action) => {
                const index = state.roles.findIndex(r => r.id === action.payload.id)
                if (index !== -1) {
                    state.roles[index] = action.payload
                }
            })

            .addCase(deleteOrganizationRole.fulfilled, (state, action) => {
                state.roles = state.roles.filter(r => r.id !== action.payload)
                state.rolesTotal -= 1
            })

            // Credit Reducers
            .addCase(fetchOrganizationCreditBalance.fulfilled, (state, action) => {
                state.credits.balance = action.payload
            })

            .addCase(fetchOrganizationCreditTransactions.pending, (state) => {
                state.credits.loading = true
            })
            .addCase(fetchOrganizationCreditTransactions.fulfilled, (state, action) => {
                state.credits.loading = false
                state.credits.transactions = action.payload.transactions
                state.credits.transactionsTotal = action.payload.total
            })
            .addCase(fetchOrganizationCreditTransactions.rejected, (state) => {
                state.credits.loading = false
            })

            .addCase(fetchOrganizationUsageSummary.pending, (state) => {
                state.credits.loading = true
            })
            .addCase(fetchOrganizationUsageSummary.fulfilled, (state, action) => {
                state.credits.loading = false
                state.credits.usageSummary = action.payload
            })
            .addCase(fetchOrganizationUsageSummary.rejected, (state) => {
                state.credits.loading = false
            })
            .addCase(fetchOrganizationActivity.pending, (state) => {
                state.activityLoading = true
            })
            .addCase(fetchOrganizationActivity.fulfilled, (state, action) => {
                state.activityLoading = false
                state.activities = action.payload.logs
                state.activitiesTotal = action.payload.total
            })
            .addCase(fetchOrganizationActivity.rejected, (state) => {
                state.activityLoading = false
            })

            // Organization Profile Reducers
            .addCase(fetchMyOrganization.fulfilled, (state, action) => {
                state.currentOrganization = action.payload
                state.organizationId = action.payload.id
                state.userRole = action.payload.userRole
            })
            .addCase(updateOrganization.pending, (state) => {
                state.loading = true
            })
            .addCase(updateOrganization.fulfilled, (state, action) => {
                state.loading = false
                state.currentOrganization = action.payload
            })
            .addCase(updateOrganization.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to update organization'
            })
    }
})

export const { clearError, setUserRole, setCurrentOrganization, resetOrganizationState } = organizationSlice.actions
export default organizationSlice.reducer
