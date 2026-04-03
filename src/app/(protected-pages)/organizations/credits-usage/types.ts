export interface CreditPlan {
    id?: string
    name: string
    /** amount can be a formatted string or numeric value */
    amount: number | string
    credits: number
    description: string
    popular?: boolean
    bonus?: number
}

export interface CreditTransaction {
    id: string
    date: string
    type: string
    /** Delta amount (Credits) */
    amount: number | string
    /** Running balance after transaction */
    balance_after?: number
    status: 'Completed' | 'Processed' | string
    description?: string
    user_name?: string
    workspace_name?: string
}

export type TopUpInitialStep = 'select' | 'payment' | 'confirm'

export interface TopUpConfig {
    initialStep?: TopUpInitialStep
    presetPlanId?: string
    /** allow numeric or formatted preset amount */
    presetAmount?: number | string
}
