export const SLICE_BASE_NAME = 'rolesPermissions'

export const ROLES_PERMISSIONS_STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
} as const

export type RolesPermissionsStatus =
    typeof ROLES_PERMISSIONS_STATUS[keyof typeof ROLES_PERMISSIONS_STATUS]
