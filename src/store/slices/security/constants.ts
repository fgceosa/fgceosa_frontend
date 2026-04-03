export const SLICE_BASE_NAME = 'security'

export const SECURITY_STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
} as const

export type SecurityStatus = (typeof SECURITY_STATUS)[keyof typeof SECURITY_STATUS]
