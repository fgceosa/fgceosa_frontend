export interface UserPublic {
    id: string
    email: string
    tagNumber: string | null
    firstName: string | null
    lastName: string | null
    fullName?: string
}

export type MetricType =
    | 'availableCredits'
    | 'totalRecipients'
    | 'creditsShared'
    | 'totalTransfers'
    | 'costNaira'

export interface CreditTransaction {
    id: string
    senderId: string
    recipientId: string
    amount: number
    message: string | null
    status: string
    createdAt: string
    updatedAt: string
    recipientName: string | null
    recipientEmail: string | null
}

export interface SharedCreditsStats {
    availableCredits: number
    totalRecipients: number
    creditsShared: number
    totalTransfers: number
    costNaira: number
}