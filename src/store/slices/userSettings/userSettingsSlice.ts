import { createSlice } from '@reduxjs/toolkit'
import {
    fetchUserProfile,
    updateUserProfile,
    changePassword,
    uploadAvatar,
    deleteAvatar,
} from './userSettingsThunk'
import { SLICE_BASE_NAME } from './constants'
import type { UserProfile } from '@/app/(protected-pages)/dashboard/user-settings/types'

export interface UserSettingsState {
    profile: UserProfile | null
    loading: {
        profile: boolean
        update: boolean
        password: boolean
        avatar: boolean
    }
    error: string | null
    lastFetched: number | null
    passwordChangeSuccess: boolean
}

const initialState: UserSettingsState = {
    profile: null,
    loading: {
        profile: false,
        update: false,
        password: false,
        avatar: false,
    },
    error: null,
    lastFetched: null,
    passwordChangeSuccess: false,
}

const userSettingsSlice = createSlice({
    name: SLICE_BASE_NAME,
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        resetPasswordSuccess: (state) => {
            state.passwordChangeSuccess = false
        },
        clearUserProfile: (state) => {
            state.profile = null
            state.lastFetched = null
        },
    },
    extraReducers: (builder) => {
        // Fetch user profile
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading.profile = true
                state.error = null
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading.profile = false
                state.profile = action.payload
                state.lastFetched = Date.now()
                state.error = null
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading.profile = false
                state.error = action.payload as string
            })

        // Update user profile
        builder
            .addCase(updateUserProfile.pending, (state) => {
                state.loading.update = true
                state.error = null
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading.update = false
                state.profile = action.payload
                state.lastFetched = Date.now()
                state.error = null
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading.update = false
                state.error = action.payload as string
            })

        // Change password
        builder
            .addCase(changePassword.pending, (state) => {
                state.loading.password = true
                state.error = null
                state.passwordChangeSuccess = false
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.loading.password = false
                state.passwordChangeSuccess = true
                state.error = null
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading.password = false
                state.passwordChangeSuccess = false
                state.error = action.payload as string
            })

        // Upload avatar
        builder
            .addCase(uploadAvatar.pending, (state) => {
                state.loading.avatar = true
                state.error = null
            })
            .addCase(uploadAvatar.fulfilled, (state, action) => {
                state.loading.avatar = false
                state.profile = action.payload
                state.lastFetched = Date.now()
                state.error = null
            })
            .addCase(uploadAvatar.rejected, (state, action) => {
                state.loading.avatar = false
                state.error = action.payload as string
            })

        // Delete avatar
        builder
            .addCase(deleteAvatar.pending, (state) => {
                state.loading.avatar = true
                state.error = null
            })
            .addCase(deleteAvatar.fulfilled, (state, action) => {
                state.loading.avatar = false
                state.profile = action.payload
                state.lastFetched = Date.now()
                state.error = null
            })
            .addCase(deleteAvatar.rejected, (state, action) => {
                state.loading.avatar = false
                state.error = action.payload as string
            })
    },
})

export const { clearError, resetPasswordSuccess, clearUserProfile } = userSettingsSlice.actions

export default userSettingsSlice.reducer
