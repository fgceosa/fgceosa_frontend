import { createSelector } from '@reduxjs/toolkit'
import { USERS_STATUS } from './userConstants'
import type { RootState } from '@/store/rootReducer'

// Base selector for users state
const selectUsersState = (state: RootState) => state.users

// Basic state selectors
export const selectUsersList = createSelector(
    selectUsersState,
    (users) => users.members
)

export const selectUsersTotal = createSelector(
    selectUsersState,
    (users) => users.total
)

export const selectUsersParams = createSelector(
    selectUsersState,
    (users) => users.currentParams
)

export const selectUsersAnalytics = createSelector(
    selectUsersState,
    (users) => users.analytics
)

export const selectSelectedUserDetails = createSelector(
    selectUsersState,
    (users) => users.selectedMember
)

export const selectUsersLoading = createSelector(
    selectUsersState,
    (users) => users.loading
)

export const selectUsersStatus = createSelector(
    selectUsersState,
    (users) => users.status
)

export const selectUsersError = createSelector(
    selectUsersState,
    (users) => users.error
)

export const selectUsersLastFetched = createSelector(
    selectUsersState,
    (users) => users.lastFetched
)

// Component loading selectors
export const selectUsersComponentLoading = createSelector(
    selectUsersState,
    (users) => users.componentLoading
)

export const selectUsersMembersLoading = createSelector(
    selectUsersComponentLoading,
    (componentLoading) => componentLoading.members
)

export const selectUsersAnalyticsLoading = createSelector(
    selectUsersComponentLoading,
    (componentLoading) => componentLoading.analytics
)

export const selectUserDetailsLoading = createSelector(
    selectUsersComponentLoading,
    (componentLoading) => componentLoading.memberDetails
)

export const selectUserCreateLoading = createSelector(
    selectUsersComponentLoading,
    (componentLoading) => componentLoading.create
)

export const selectUserUpdateLoading = createSelector(
    selectUsersComponentLoading,
    (componentLoading) => componentLoading.update
)

export const selectUserDeleteLoading = createSelector(
    selectUsersComponentLoading,
    (componentLoading) => componentLoading.delete
)

// Computed selectors
export const selectHasUsers = createSelector(
    selectUsersList,
    (members) => members.length > 0
)

export const selectIsUsersInitialLoading = createSelector(
    [selectUsersLoading, selectHasUsers],
    (loading, hasUsers) => loading && !hasUsers
)

export const selectIsUsersRefreshing = createSelector(
    [selectUsersLoading, selectHasUsers],
    (loading, hasUsers) => loading && hasUsers
)

export const selectHasUsersError = createSelector(
    selectUsersError,
    (error) => error !== null
)

export const selectIsUsersSuccessful = createSelector(
    selectUsersStatus,
    (status) => status === USERS_STATUS.SUCCEEDED
)

export const selectIsUsersFailed = createSelector(
    selectUsersStatus,
    (status) => status === USERS_STATUS.FAILED
)

export const selectIsUsersIdle = createSelector(
    selectUsersStatus,
    (status) => status === USERS_STATUS.IDLE
)

export const selectUsersReady = createSelector(
    [selectHasUsers, selectUsersError, selectUsersLoading],
    (hasUsers, error, loading) => hasUsers && !error && !loading
)

// Any component loading
export const selectAnyUserComponentLoading = createSelector(
    selectUsersComponentLoading,
    (componentLoading) => Object.values(componentLoading).some(Boolean)
)

// Export all selectors as a group for convenience
const userSelectors = {
    // Basic selectors
    selectUsersList,
    selectUsersTotal,
    selectUsersParams,
    selectUsersAnalytics,
    selectSelectedUserDetails,
    selectUsersLoading,
    selectUsersStatus,
    selectUsersError,
    selectUsersLastFetched,

    // Component loading selectors
    selectUsersComponentLoading,
    selectUsersMembersLoading,
    selectUsersAnalyticsLoading,
    selectUserDetailsLoading,
    selectUserCreateLoading,
    selectUserUpdateLoading,
    selectUserDeleteLoading,
    selectAnyUserComponentLoading,

    // Computed selectors
    selectHasUsers,
    selectIsUsersInitialLoading,
    selectIsUsersRefreshing,
    selectHasUsersError,
    selectIsUsersSuccessful,
    selectIsUsersFailed,
    selectIsUsersIdle,
    selectUsersReady,
}

export default userSelectors

