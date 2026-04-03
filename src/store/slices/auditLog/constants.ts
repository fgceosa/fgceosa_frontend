export const SLICE_BASE_NAME = 'auditLog'

export const AUDIT_LOG_STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
} as const

export type AuditLogStatus = (typeof AUDIT_LOG_STATUS)[keyof typeof AUDIT_LOG_STATUS]
