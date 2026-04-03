export const SLICE_BASE_NAME = 'projects'

export const PROJECTS_STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
} as const

export type ProjectsStatus = (typeof PROJECTS_STATUS)[keyof typeof PROJECTS_STATUS]
