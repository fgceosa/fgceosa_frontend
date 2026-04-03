export const SLICE_BASE_NAME = 'modelLibrary'

// Model library state status
export const MODEL_LIBRARY_STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
} as const

export type ModelLibraryStatus =
    typeof MODEL_LIBRARY_STATUS[keyof typeof MODEL_LIBRARY_STATUS]
