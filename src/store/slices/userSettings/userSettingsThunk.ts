import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetUserProfile,
    apiUpdateUserProfile,
    apiChangePassword,
    apiUploadAvatar,
    apiDeleteAvatar,
} from '@/services/userSettings/userSettingsService'
import type {
    UpdateProfileRequest,
    ChangePasswordRequest,
} from '@/app/(protected-pages)/dashboard/user-settings/types'
import { SLICE_BASE_NAME } from './constants'

/**
 * Helper to normalize user profile data from backend
 */
const normalizeProfile = (data: any) => {
    if (!data) return null
    return {
        ...data,
        firstName: data.firstName || data.first_name,
        lastName: data.lastName || data.last_name,
        organizationName: data.organizationName || data.organization_name,
        accountType: data.accountType || data.account_type,
        createdAt: data.createdAt || data.created_at,
        updatedAt: data.updatedAt || data.updated_at,
    }
}

/**
 * Fetch user profile
 */
export const fetchUserProfile = createAsyncThunk(
    `${SLICE_BASE_NAME}/fetchUserProfile`,
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiGetUserProfile()
            return normalizeProfile(response)
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.message ||
                'Failed to fetch user profile'
            return rejectWithValue(errorMessage)
        }
    }
)

/**
 * Update user profile
 */
export const updateUserProfile = createAsyncThunk(
    `${SLICE_BASE_NAME}/updateUserProfile`,
    async (data: UpdateProfileRequest, { rejectWithValue }) => {
        try {
            const response = await apiUpdateUserProfile(data)
            return normalizeProfile(response)
        } catch (error: any) {
            // Extract error message from various formats
            let errorMessage = 'Failed to update profile'

            const detail = error?.response?.data?.detail

            // Handle Pydantic validation errors (array format)
            if (Array.isArray(detail)) {
                errorMessage = detail.map((err: any) => {
                    const location = err.loc ? err.loc.join('.') : ''
                    return `${location}: ${err.msg}`
                }).join(', ')
            }
            // Handle string detail
            else if (typeof detail === 'string') {
                errorMessage = detail
            }
            // Handle other error formats
            else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message
            }
            else if (error?.message) {
                errorMessage = error.message
            }

            return rejectWithValue(errorMessage)
        }
    }
)

/**
 * Change password
 */
export const changePassword = createAsyncThunk(
    `${SLICE_BASE_NAME}/changePassword`,
    async (data: ChangePasswordRequest, { rejectWithValue }) => {
        try {
            return await apiChangePassword(data)
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.message ||
                'Failed to change password'
            return rejectWithValue(errorMessage)
        }
    }
)

/**
 * Upload avatar
 */
export const uploadAvatar = createAsyncThunk(
    `${SLICE_BASE_NAME}/uploadAvatar`,
    async (file: File, { rejectWithValue }) => {
        try {
            const result = await apiUploadAvatar(file)
            return normalizeProfile(result)
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.message ||
                'Failed to upload avatar'
            return rejectWithValue(errorMessage)
        }
    }
)

/**
 * Delete avatar
 */
export const deleteAvatar = createAsyncThunk(
    `${SLICE_BASE_NAME}/deleteAvatar`,
    async (_, { rejectWithValue }) => {
        try {
            const result = await apiDeleteAvatar()
            return normalizeProfile(result)
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.message ||
                'Failed to delete avatar'
            return rejectWithValue(errorMessage)
        }
    }
)
