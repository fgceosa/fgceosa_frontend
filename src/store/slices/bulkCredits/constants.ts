export const SLICE_BASE_NAME = 'bulkCredits'

export const BULK_CREDITS_STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
} as const

export type BulkCreditsStatus =
    (typeof BULK_CREDITS_STATUS)[keyof typeof BULK_CREDITS_STATUS]
