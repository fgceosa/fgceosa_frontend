import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
    fetchRoles,
    fetchPermissions,
    createRole,
    updateRole,
    deleteRole,
    createPermission
} from './rolesPermissionsThunk'
import { SLICE_BASE_NAME, ROLES_PERMISSIONS_STATUS, RolesPermissionsStatus } from './constants'
import { Role, PermissionGroup } from '@/app/(protected-pages)/admin/roles-permissions/types'

export interface RolesPermissionsState {
    roles: Role[]
    permissions: PermissionGroup[]
    status: RolesPermissionsStatus
    error: string | null
    loading: boolean
    lastFetched: number | null
}

const initialState: RolesPermissionsState = {
    roles: [],
    permissions: [],
    status: ROLES_PERMISSIONS_STATUS.IDLE,
    error: null,
    loading: false,
    lastFetched: null,
}

const rolesPermissionsSlice = createSlice({
    name: SLICE_BASE_NAME,
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        resetState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Fetch Roles
            .addCase(fetchRoles.pending, (state) => {
                state.loading = true
                state.status = ROLES_PERMISSIONS_STATUS.LOADING
            })
            .addCase(fetchRoles.fulfilled, (state, action: PayloadAction<Role[]>) => {
                state.loading = false
                state.status = ROLES_PERMISSIONS_STATUS.SUCCEEDED
                state.roles = action.payload
                state.lastFetched = Date.now()
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.loading = false
                state.status = ROLES_PERMISSIONS_STATUS.FAILED
                state.error = action.payload as string
            })

            // Fetch Permissions
            .addCase(fetchPermissions.pending, (state) => {
                // We don't necessarily need to trigger global loading for permissions if roles is main view
                // But let's keep it consistent
            })
            .addCase(fetchPermissions.fulfilled, (state, action: PayloadAction<PermissionGroup[]>) => {
                state.permissions = action.payload
            })
            .addCase(fetchPermissions.rejected, (state, action) => {
                console.error('Failed to fetch permissions', action.payload)
            })

            // Create Role
            .addCase(createRole.fulfilled, (state, action: PayloadAction<Role>) => {
                state.roles.push(action.payload)
            })

            // Update Role
            .addCase(updateRole.fulfilled, (state, action: PayloadAction<Role>) => {
                const index = state.roles.findIndex(r => r.id === action.payload.id)
                if (index !== -1) {
                    state.roles[index] = action.payload
                }
            })

            // Delete Role
            .addCase(deleteRole.fulfilled, (state, action: PayloadAction<string>) => {
                state.roles = state.roles.filter(r => r.id !== action.payload)
            })

            // Create Permission
            .addCase(createPermission.fulfilled, (state) => {
                // We'll let the component re-fetch or we could manually inject it
                // For now, setting status to idle so it can be re-fetched if needed
                state.lastFetched = null
            })
    },
})

export const { clearError, resetState } = rolesPermissionsSlice.actions
export default rolesPermissionsSlice.reducer
