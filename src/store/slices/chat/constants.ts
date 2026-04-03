export const SLICE_BASE_NAME = 'chat'

// Chat state status
export const CHAT_STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
} as const

export type ChatStatus = typeof CHAT_STATUS[keyof typeof CHAT_STATUS]
