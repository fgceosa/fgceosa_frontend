import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetRoles,
    apiCreateRole,
    apiUpdateRole,
    apiDeleteRole,
    apiGetAllPermissions,
    apiCreatePermission
} from '@/services/rolesPermissions/rolesPermissionsService'
import { Role, PermissionGroup } from '@/app/(protected-pages)/admin/roles-permissions/types'

export const fetchRoles = createAsyncThunk(
    'rolesPermissions/fetchRoles',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiGetRoles()
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || error.response?.data?.message || error.message || 'Failed to fetch roles')
        }
    }
)

export const fetchPermissions = createAsyncThunk(
    'rolesPermissions/fetchPermissions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiGetAllPermissions()
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || error.response?.data?.message || error.message || 'Failed to fetch permissions')
        }
    }
)

export const createRole = createAsyncThunk(
    'rolesPermissions/createRole',
    async (role: Partial<Role>, { rejectWithValue }) => {
        try {
            const response = await apiCreateRole(role)
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || error.response?.data?.message || error.message || 'Failed to create role')
        }
    }
)

export const updateRole = createAsyncThunk(
    'rolesPermissions/updateRole',
    async ({ id, data }: { id: string, data: Partial<Role> }, { rejectWithValue }) => {
        try {
            const response = await apiUpdateRole(id, data)
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || error.response?.data?.message || error.message || 'Failed to update role')
        }
    }
)

export const deleteRole = createAsyncThunk(
    'rolesPermissions/deleteRole',
    async (id: string, { rejectWithValue }) => {
        try {
            await apiDeleteRole(id)
            return id
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || error.response?.data?.message || error.message || 'Failed to delete role')
        }
    }
)

export const createPermission = createAsyncThunk(
    'rolesPermissions/createPermission',
    async (data: { name: string, description: string }, { rejectWithValue }) => {
        try {
            const response = await apiCreatePermission(data)
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || error.response?.data?.message || error.message || 'Failed to create permission')
        }
    }
)
