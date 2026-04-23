import ApiService from './ApiService'

export interface PaymentInitializationData {
    amount: number
    description: string
    callback_url: string
}

export interface PaymentInitializationResponse {
    status: string
    payment_url: string
    transaction_reference: string
}

export interface PaymentVerificationResponse {
    id: string
    status: string
    amount: number
    transaction_reference: string
    // ... other fields
}

export async function apiInitializePayment(data: PaymentInitializationData) {
    return ApiService.fetchDataWithAxios<PaymentInitializationResponse>({
        url: 'payments/initialize',
        method: 'post',
        data,
    })
}

export async function apiVerifyPayment(transactionId: string) {
    return ApiService.fetchDataWithAxios<PaymentVerificationResponse>({
        url: `payments/verify?transaction_id=${transactionId}`,
        method: 'get',
    })
}

export async function apiSubmitPaymentProof(data: {
    purpose: string
    amount: number
    payment_date: string
    receipt_url?: string
}) {
    return ApiService.fetchDataWithAxios<PaymentVerificationResponse>({
        url: 'payments/submit-proof',
        method: 'post',
        data,
    })
}
