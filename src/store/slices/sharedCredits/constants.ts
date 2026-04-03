export const SLICE_BASE_NAME = 'sharedCredits'

export const SHARED_CREDITS_STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
} as const

export type SharedCreditsStatus =
    (typeof SHARED_CREDITS_STATUS)[keyof typeof SHARED_CREDITS_STATUS]
