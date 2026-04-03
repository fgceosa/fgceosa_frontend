import type { SecurityEvent, ApiKey } from '../types'

// Status configurations
export const SEVERITY_CONFIG = {
    low: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-100',
        dot: 'bg-blue-500'
    },
    medium: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-100',
        dot: 'bg-amber-500'
    },
    high: {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-100',
        dot: 'bg-orange-500'
    },
    critical: {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-100',
        dot: 'bg-rose-500'
    }
} as const

export const STATUS_CONFIG = {
    open: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-100',
        dot: 'bg-blue-500'
    },
    investigating: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-100',
        dot: 'bg-amber-500'
    },
    resolved: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-100',
        dot: 'bg-green-500'
    },
    dismissed: {
        bg: 'bg-gray-50',
        text: 'text-gray-600',
        border: 'border-gray-200',
        dot: 'bg-gray-400'
    }
} as const

export const API_KEY_STATUS_CONFIG = {
    active: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-100',
        dot: 'bg-green-500'
    },
    suspended: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-100',
        dot: 'bg-amber-500'
    },
    revoked: {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        border: 'border-gray-200',
        dot: 'bg-gray-400'
    },
    leaked: {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-100',
        dot: 'bg-rose-500'
    }
} as const

// Security scan steps
export const SECURITY_SCAN_STEPS = [
    { id: 1, label: 'Checking login security & account protection', duration: 1500 },
    { id: 2, label: 'Looking for unusual or suspicious activity', duration: 2000 },
    { id: 3, label: 'Scanning for API key abuse or token leaks', duration: 2200 },
    { id: 4, label: 'Verifying access control policies', duration: 1800 },
    { id: 5, label: 'Checking for any strange connection attempts', duration: 2500 },
    { id: 6, label: 'Double-checking your recent activity logs', duration: 1500 }
] as const

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10
export const PAGE_SIZE_OPTIONS = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' }
] as const

// Mock data removed - using backend API
