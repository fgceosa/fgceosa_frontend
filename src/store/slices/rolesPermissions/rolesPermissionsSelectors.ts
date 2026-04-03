import { RootState } from '@/store'

export const selectRoles = (state: RootState) => state.rolesPermissions.roles
export const selectRolesStatus = (state: RootState) => state.rolesPermissions.status
export const selectRolesError = (state: RootState) => state.rolesPermissions.error
export const selectRolesLoading = (state: RootState) => state.rolesPermissions.loading
export const selectRolesLastFetched = (state: RootState) => state.rolesPermissions.lastFetched
