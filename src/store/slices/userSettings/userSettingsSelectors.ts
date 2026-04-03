import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store/rootReducer'

// Base selector
const selectUserSettingsState = (state: RootState) => state.userSettings

// Profile selectors
export const selectUserProfile = createSelector(
    selectUserSettingsState,
    (userSettings) => userSettings?.profile
)

export const selectUserEmail = createSelector(
    selectUserProfile,
    (profile) => profile?.email
)

export const selectUserFullName = createSelector(
    selectUserProfile,
    (profile) => {
        if (!profile) return ''
        const firstName = profile.firstName || ''
        const lastName = profile.lastName || ''
        return `${firstName} ${lastName}`.trim() || 'User'
    }
)

export const selectUserAvatar = createSelector(
    selectUserProfile,
    (profile) => profile?.avatar
)

// Loading selectors
export const selectProfileLoading = createSelector(
    selectUserSettingsState,
    (userSettings) => userSettings?.loading.profile
)

export const selectUpdateLoading = createSelector(
    selectUserSettingsState,
    (userSettings) => userSettings?.loading.update
)

export const selectPasswordLoading = createSelector(
    selectUserSettingsState,
    (userSettings) => userSettings?.loading.password
)

export const selectAvatarLoading = createSelector(
    selectUserSettingsState,
    (userSettings) => userSettings?.loading.avatar
)

export const selectAnyLoading = createSelector(
    selectUserSettingsState,
    (userSettings) => {
        if (!userSettings) return false
        return Object.values(userSettings.loading).some(Boolean)
    }
)

// Error selector
export const selectUserSettingsError = createSelector(
    selectUserSettingsState,
    (userSettings) => userSettings?.error
)

// Password change success selector
export const selectPasswordChangeSuccess = createSelector(
    selectUserSettingsState,
    (userSettings) => userSettings?.passwordChangeSuccess
)

// Last fetched selector
export const selectLastFetched = createSelector(
    selectUserSettingsState,
    (userSettings) => userSettings?.lastFetched
)

// Profile completion percentage
export const selectProfileCompletionPercentage = createSelector(
    selectUserProfile,
    (profile) => {
        if (!profile) return 0

        const fields = [
            profile.email,
            profile.firstName,
            profile.lastName,
            profile.phone,
            profile.address,
            profile.state,
            profile.avatar,
        ]

        const filledFields = fields.filter(Boolean).length
        return Math.round((filledFields / fields.length) * 100)
    }
)
