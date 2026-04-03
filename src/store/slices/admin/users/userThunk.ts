import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetUsers,
    apiGetUsersAnalytics,
    apiGetUserDetails,
    apiCreateUser,
    apiUpdateUser,
    apiUpdateUserIdentityRole,
    apiDeleteUser,
    apiResendUserInvitation,
    apiVerifyUserEmail,
    type UserListParams,
    type CreateUserRequest,
    type UpdateUserRequest,
} from '@/services/admin/users/userService'

// Async thunk for fetching users list
export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (params: UserListParams | undefined, { rejectWithValue }) => {
        try {
            const data = await apiGetUsers(params)
            return { data, params }
        } catch (error) {
            const errorMessage = (error as any)?.response?.data?.detail
                || (error as any)?.response?.data?.message
                || (error instanceof Error ? error.message : 'Failed to fetch users')
            return rejectWithValue(errorMessage)
        }
    }
)

// Async thunk for fetching users analytics
export const fetchUsersAnalytics = createAsyncThunk(
    'users/fetchUsersAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            const data = await apiGetUsersAnalytics()
            return data
        } catch (error) {
            const errorMessage = (error as any)?.response?.data?.detail
                || (error as any)?.response?.data?.message
                || (error instanceof Error ? error.message : 'Failed to fetch users analytics')
            return rejectWithValue(errorMessage)
        }
    }
)

// Async thunk for fetching user details
export const fetchUserDetails = createAsyncThunk(
    'users/fetchUserDetails',
    async (id: string, { rejectWithValue }) => {
        try {
            const data = await apiGetUserDetails(id)
            return data
        } catch (error) {
            const errorMessage = (error as any)?.response?.data?.detail
                || (error as any)?.response?.data?.message
                || (error instanceof Error ? error.message : 'Failed to fetch user details')
            return rejectWithValue(errorMessage)
        }
    }
)

// Async thunk for creating/inviting user
export const createUser = createAsyncThunk(
    'users/createUser',
    async (data: CreateUserRequest, { rejectWithValue }) => {
        try {
            const response = await apiCreateUser(data)
            return response
        } catch (error) {
            const errorMessage = (error as any)?.response?.data?.detail
                || (error as any)?.response?.data?.message
                || (error instanceof Error ? error.message : 'Failed to create user')
            return rejectWithValue(errorMessage)
        }
    }
)

// Async thunk for updating user
export const updateUser = createAsyncThunk(
    'users/updateUser',
    async ({ id, data }: { id: string; data: UpdateUserRequest }, { rejectWithValue }) => {
        try {
            const response = await apiUpdateUser(id, data)
            return response
        } catch (error) {
            const errorMessage = (error as any)?.response?.data?.detail
                || (error as any)?.response?.data?.message
                || (error instanceof Error ? error.message : 'Failed to update user')
            return rejectWithValue(errorMessage)
        }
    }
)

// Async thunk for deleting user
export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (args: string | { id: string; force?: boolean }, { rejectWithValue }) => {
        const id = typeof args === 'string' ? args : args.id
        const force = typeof args === 'string' ? false : !!args.force

        try {
            const response = await apiDeleteUser(id, force)
            return { id, response }
        } catch (error) {
            const errorMessage = (error as any)?.response?.data?.detail
                || (error as any)?.response?.data?.message
                || (error instanceof Error ? error.message : 'Failed to delete user')
            return rejectWithValue(errorMessage)
        }
    }
)

// Async thunk for resending invitation
export const resendUserInvitation = createAsyncThunk(
    'users/resendUserInvitation',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiResendUserInvitation(id)
            return { id, response }
        } catch (error) {
            const errorMessage = (error as any)?.response?.data?.detail
                || (error as any)?.response?.data?.message
                || (error instanceof Error ? error.message : 'Failed to resend invitation')
            return rejectWithValue(errorMessage)
        }
    }
)

// Async thunk for updating user identity role
export const updateUserIdentityRole = createAsyncThunk(
    'users/updateUserIdentityRole',
    async ({ id, identityRole }: { id: string; identityRole: string }, { rejectWithValue }) => {
        try {
            const response = await apiUpdateUserIdentityRole(id, identityRole)
            return response
        } catch (error: any) {
            const errorMessage = (error as any)?.response?.data?.detail
                || (error as any)?.response?.data?.message
                || (error instanceof Error ? error.message : 'Failed to update identity role')
            return rejectWithValue(errorMessage)
        }
    }
)

// Async thunk for verifying user email
export const verifyUserEmail = createAsyncThunk(
    'users/verifyUserEmail',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiVerifyUserEmail(id)
            return response
        } catch (error) {
            const errorMessage = (error as any)?.response?.data?.detail
                || (error as any)?.response?.data?.message
                || (error instanceof Error ? error.message : 'Failed to verify user email')
            return rejectWithValue(errorMessage)
        }
    }
)

// Export all thunks
export const userThunks = {
    fetchUsers,
    fetchUsersAnalytics,
    fetchUserDetails,
    createUser,
    updateUser,
    updateUserIdentityRole,
    deleteUser,
    resendUserInvitation,
    verifyUserEmail,
}

export default userThunks

