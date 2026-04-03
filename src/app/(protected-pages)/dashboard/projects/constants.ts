import type { ProjectType, ProjectStatus } from './types'

// Status badge colors
export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
    active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    in_development: 'bg-blue-100 text-blue-700 border-blue-200',
    archived: 'bg-gray-100 text-gray-700 border-gray-200',
}

// Project type options for dropdown
export const PROJECT_TYPE_OPTIONS = [
    { value: 'web', label: 'Web Application' },
    { value: 'mobile', label: 'Mobile App' },
    { value: 'backend', label: 'Backend Service' },
    { value: 'desktop', label: 'Desktop App' },
    { value: 'iot', label: 'IoT Device' },
    { value: 'other', label: 'Other' },
] as const

// Project status options for dropdown
export const PROJECT_STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'in_development', label: 'In Development' },
    { value: 'archived', label: 'Archived' },
] as const

// Default values
export const DEFAULT_PROJECT_TYPE: ProjectType = 'web'
export const DEFAULT_PROJECT_STATUS: ProjectStatus = 'active'
