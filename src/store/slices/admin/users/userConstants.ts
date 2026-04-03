export const SLICE_BASE_NAME = 'users'

// User management state status
export const USERS_STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
} as const

export type UsersStatus = typeof USERS_STATUS[keyof typeof USERS_STATUS]

