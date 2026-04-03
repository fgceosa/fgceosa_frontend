/**
 * Bulk Credit Types
 */

import { ReactNode } from 'react'

// Treasury Types
export type TreasuryType = 'platform' | 'organization' | 'program'

export interface Treasury {
    id: string
    name: string
    type: TreasuryType
    balance: number
    owner: string
    scope: string
    limits?: {
        maxPerAllocation: number
        approvalThreshold: number
    }
}

// Transaction Types
export interface Transaction {
    id?: string
    date: string
    type: 'Sent' | 'Bulk Send' | 'Sponsored' | 'Gift'
    amount: number
    credits?: number
    recipient: string
    status: 'Completed' | 'Processing' | 'Failed' | 'Pending'
    badgeType: 'success' | 'secondary' | 'outline' | 'error'
}

// Campaign Types
export interface Campaign {
    id?: string
    name: string
    description?: string
    type: string
    amount: number
    recipients: number
    status: 'active' | 'completed' | 'planned' | 'cancelled' | 'draft' | 'paused' | 'Active' | 'Completed' | 'Planned' | 'Cancelled'
    progress: number
    total_distributed?: number
    spent_naira?: number
    badgeType?: string
}

// Recipient Types
export type RecipientType = 'individual' | 'bulk' | 'organization' | 'bootcamp'

export interface RecipientOption {
    label: string
    value: RecipientType
}

// Send Credits Form Data
export interface SendCreditsFormData {
    recipientType: RecipientType | null
    amount: number
    recipient: string
    message?: string
    [key: string]: any
}

// Component Props
export interface SendCreditsTabProps {
    openSendModal: (data?: Partial<SendCreditsFormData>) => void
    showIcon?: boolean
    onRecipientChange?: (recipient: string) => void
    initialRecipient?: string
    treasuryType?: TreasuryType
}

export interface RecipientPreview {
    name: string
    username: string
    avatar?: string
    role?: string
    credits?: number | string
    status?: 'active' | 'inactive' | 'pending'
    id?: string
    tag?: string
}

export interface MemberProfileCardProps {
    data?: RecipientPreview | null
    loading?: boolean
    error?: string | null
    onViewProfile?: () => void
}

export interface QuickSendItem {
    icon: ReactNode
    label: string
    amount: string | number
}

export interface QuickSendCardProps {
    items: QuickSendItem[]
    onSend: () => void
}

export interface BulkTabsProps {
    openSendModal: (data?: Partial<SendCreditsFormData>) => void
    openBulkModal?: () => void
    treasuryType?: TreasuryType
    organizationId?: string
}

export interface SendCreditsModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: (data: SendCreditsFormData) => Promise<void>
    initialData?: Partial<SendCreditsFormData>
}

export interface BulkDistributionTabProps {
    openBulkModal?: () => void
    treasuryType?: TreasuryType
    organizationId?: string
}

// Stats Types
export type MetricType = 'aiCredits' | 'activeUsers' | 'revenue' | 'balance'

export interface MetricData {
    value: number
    growShrink: number
    comparePeriod: string
}

export type MetricsRecord = Record<MetricType, MetricData>

// Bulk Distribution Types
export type DistributionType = 'equal' | 'custom' | 'percentage'

export interface BulkDistributionFormData {
    totalAmount: number
    perUserAmount?: number
    distributionType: DistributionType
    recipients: Array<{
        identifier: string
        amount: number
        message?: string
    }>
    groupName?: string
    purpose?: string
    [key: string]: any
}

// API Response Types
export interface SendCreditsResponse {
    success: boolean
    message: string
    transactionId?: string
    remainingBalance?: number
}

export interface BulkDistributionResponse {
    success: boolean
    message: string
    totalSent: number
    successfulRecipients: number
    failedRecipients: number
    failures?: Array<{ identifier: string; error: string }>
}

// Constants
export const RECIPIENT_OPTIONS: RecipientOption[] = [
    { label: 'Individual User', value: 'individual' },
    { label: 'Bulk Recipients', value: 'bulk' },
    { label: 'Organization', value: 'organization' },
    { label: 'Bootcamp/School', value: 'bootcamp' },
]

export const DISTRIBUTION_TYPE_OPTIONS = [
    { label: 'Equal Distribution', value: 'equal' as const },
    { label: 'Custom Amounts', value: 'custom' as const },
    { label: 'Percentage Based', value: 'percentage' as const },
]
