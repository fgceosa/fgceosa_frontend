import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
    fetchUsers,
    fetchUsersAnalytics,
    fetchUserDetails,
    createUser,
    updateUser,
    deleteUser,
    resendUserInvitation,
} from './userThunk'
import { SLICE_BASE_NAME, USERS_STATUS } from './userConstants'
import type { UserMember, GetUserListResponse } from '@/app/(protected-pages)/admin/users/types'
import type { UsersAnalytics } from '@/services/admin/users/userService'
import type { UsersStatus } from './userConstants'

// Define the state interface
export interface UsersState {
    members: UserMember[]
    total: number
    currentParams: {
        pageIndex: number
        pageSize: number
        sortKey?: string
        order?: 'asc' | 'desc'
        query?: string
        status?: string
        role?: string
    } | null

    analytics: UsersAnalytics | null
    selectedMember: UserMember | null
    loading: boolean
    status: UsersStatus
    error: string | null
    lastFetched: number | null

    componentLoading: {
        members: boolean
        analytics: boolean
        memberDetails: boolean
        create: boolean
        update: boolean
        delete: boolean
    }
}

// Initial state
const initialState: UsersState = {
    members: [],
    total: 0,
    currentParams: null,
    analytics: null,
    selectedMember: null,
    loading: false,
    status: USERS_STATUS.IDLE,
    error: null,
    lastFetched: null,
    componentLoading: {
        members: false,
        analytics: false,
        memberDetails: false,
        create: false,
        update: false,
        delete: false,
    },
}

// Create the slice
const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearUsersData: (state) => {
            state.members = []
            state.total = 0
            state.currentParams = null
            state.error = null
            state.lastFetched = null
            state.status = USERS_STATUS.IDLE
        },

        clearUsersError: (state) => {
            state.error = null
            if (state.status === USERS_STATUS.FAILED) {
                state.status = USERS_STATUS.IDLE
            }
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
            state.status = action.payload ? USERS_STATUS.LOADING : USERS_STATUS.IDLE
        },

        clearSelectedMember: (state) => {
            state.selectedMember = null
        },

        resetUsersState: () => initialState,
    },
    extraReducers: (builder) => {
        // Handle fetchUsers
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.componentLoading.members = true
                state.loading = true
                state.status = USERS_STATUS.LOADING
                state.error = null
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                const responseData = action.payload.data as any
                state.componentLoading.members = false
                state.loading = false
                state.status = USERS_STATUS.SUCCEEDED

                if (responseData && (responseData.list || responseData.data)) {
                    state.members = responseData.list || responseData.data
                    state.total = responseData.total ?? responseData.count ?? responseData.data?.length ?? 0
                } else if (Array.isArray(responseData)) {
                    state.members = responseData
                    state.total = responseData.length
                } else {
                    state.members = []
                    state.total = 0
                }
                state.currentParams = action.payload.params as any
                state.error = null
                state.lastFetched = Date.now()
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.componentLoading.members = false
                state.loading = false
                state.status = USERS_STATUS.FAILED
                state.error = action.payload as string
            })

        // Handle fetchUsersAnalytics
        builder
            .addCase(fetchUsersAnalytics.pending, (state) => {
                state.componentLoading.analytics = true
            })
            .addCase(fetchUsersAnalytics.fulfilled, (state, action) => {
                const responseData = action.payload as any
                // Handle various response formats (direct, wrapped in .data, or wrapped in .analytics)
                const payload = responseData?.data || responseData?.analytics || responseData || {}

                state.componentLoading.analytics = false
                state.analytics = {
                    ...payload,
                    totalUsers: payload.totalUsers ?? payload.total_users ?? payload.total_registry ?? payload.totalRegistry ?? 0,
                    activeUsers: payload.activeUsers ?? payload.active_users ?? payload.total_active ?? 0,
                    usersUsage: payload.usersUsage ?? payload.users_usage ?? payload.total_expenditure ?? payload.totalExpenditure ?? payload.total_spending ?? 0,
                    pendingInvites: payload.pendingInvites ?? payload.pending_invites ?? payload.total_pending ?? 0
                }
                state.lastFetched = Date.now()
            })
            .addCase(fetchUsersAnalytics.rejected, (state, action) => {
                state.componentLoading.analytics = false
                state.error = action.payload as string
            })

        // Handle fetchUserDetails
        builder
            .addCase(fetchUserDetails.pending, (state) => {
                state.componentLoading.memberDetails = true
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.componentLoading.memberDetails = false
                state.selectedMember = action.payload
                state.lastFetched = Date.now()
            })
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.componentLoading.memberDetails = false
                state.error = action.payload as string
            })

        // Handle createUser
        builder
            .addCase(createUser.pending, (state) => {
                state.componentLoading.create = true
            })
            .addCase(createUser.fulfilled, (state) => {
                state.componentLoading.create = false
                state.lastFetched = Date.now()
            })
            .addCase(createUser.rejected, (state, action) => {
                state.componentLoading.create = false
                state.error = action.payload as string
            })

        // Handle updateUser
        builder
            .addCase(updateUser.pending, (state) => {
                state.componentLoading.update = true
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.componentLoading.update = false
                const index = state.members.findIndex(m => m.id === action.payload.id)
                if (index !== -1) {
                    state.members[index] = action.payload
                }
                if (state.selectedMember?.id === action.payload.id) {
                    state.selectedMember = action.payload
                }
                state.lastFetched = Date.now()
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.componentLoading.update = false
                state.error = action.payload as string
            })

        // Handle deleteUser
        builder
            .addCase(deleteUser.pending, (state) => {
                state.componentLoading.delete = true
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.componentLoading.delete = false
                state.members = state.members.filter(m => m.id !== action.payload.id)
                state.total = Math.max(0, state.total - 1)
                if (state.selectedMember?.id === action.payload.id) {
                    state.selectedMember = null
                }
                state.lastFetched = Date.now()
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.componentLoading.delete = false
                state.error = action.payload as string
            })

        // Handle resendUserInvitation
        builder
            .addCase(resendUserInvitation.pending, (state) => {
            })
            .addCase(resendUserInvitation.fulfilled, (state) => {
                state.lastFetched = Date.now()
            })
            .addCase(resendUserInvitation.rejected, (state, action) => {
                state.error = action.payload as string
            })
    },
})

// Export actions
export const {
    clearUsersData,
    clearUsersError,
    setLoading,
    clearSelectedMember,
    resetUsersState,
} = usersSlice.actions

// Export reducer
export default usersSlice.reducer

// Export the slice for testing purposes
export { usersSlice }

