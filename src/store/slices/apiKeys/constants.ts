export const SLICE_BASE_NAME = 'apiKeys'

// API keys state status
export const API_KEYS_STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
} as const

export type ApiKeysStatus =
    typeof API_KEYS_STATUS[keyof typeof API_KEYS_STATUS]
