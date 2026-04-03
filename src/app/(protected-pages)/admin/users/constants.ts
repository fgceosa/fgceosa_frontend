import type { PermissionKey } from './types'

/**
 * Team member status color mapping for UI
 */
export const TEAM_STATUS_COLORS: Record<string, string> = {
    active: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    blocked: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
}

/**
 * Human-readable labels for permission keys
 */
export const PERMISSION_LABELS: Record<PermissionKey, string> = {
    manageUsers: 'Manage Users',
    manageRoles: 'Manage Roles',
    manageSettings: 'Manage Settings',
    viewAnalytics: 'View Analytics',
    manageBilling: 'Manage Billing',
    manageCredits: 'Manage Credits',
    deleteContent: 'Delete Content',
    exportData: 'Export Data',
}

/**
 * Default permission template for new roles
 */
export const DEFAULT_PERMISSIONS: Record<PermissionKey, boolean> = {
    manageUsers: false,
    manageRoles: false,
    manageSettings: false,
    viewAnalytics: false,
    manageBilling: false,
    manageCredits: false,
    deleteContent: false,
    exportData: false,
}
