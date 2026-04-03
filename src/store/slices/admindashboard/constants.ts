export const SLICE_BASE_NAME = 'adminDashboard'

// Dashboard state status
export const DASHBOARD_STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
} as const

export type DashboardStatus = typeof DASHBOARD_STATUS[keyof typeof DASHBOARD_STATUS]
