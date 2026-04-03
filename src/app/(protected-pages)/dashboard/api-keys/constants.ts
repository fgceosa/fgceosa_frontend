export const RESET_LIMIT_OPTIONS = [
    { value: 'none', label: 'N/A' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
] as const

export const EXPIRATION_OPTIONS = [
    { value: 'never', label: 'No expiration' },
    { value: '1d', label: '1 day' },
    { value: '7d', label: '7 days' },
    { value: '30d', label: '30 days' },
    { value: '90d', label: '90 days' },
] as const

export const ENVIRONMENT_OPTIONS = [
    { value: 'production', label: 'Production' },
    { value: 'development', label: 'Development' },
    { value: 'testing', label: 'Testing' },
] as const

export const API_KEY_STATUS_COLORS: Record<string, string> = {
    active: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    revoked: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
    expired: 'bg-yellow-200 dark:bg-yellow-200 text-gray-900 dark:text-gray-900',
}
