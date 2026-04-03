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
    id?: string
    date: string
    type: string
    /** formatted amount string like '+₦50,000' or '-₦12,500' */
    amount: string
    /** formatted credits string like '+6,000' or '-1,250' */
    credits: string
    status: 'Completed' | 'Processed' | string
    description?: string
}

export type TopUpInitialStep = 'select' | 'payment' | 'confirm'

export interface TopUpConfig {
    initialStep?: TopUpInitialStep
    presetPlanId?: string
    /** allow numeric or formatted preset amount */
    presetAmount?: number | string
}
