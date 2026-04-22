import ApiService from '@/services/ApiService'

export interface PaymentTransaction {
    id: string
    invoiceId: string
    member: string
    email: string
    amount: string
    paid: string
    status: 'Paid' | 'Pending' | 'Overdue'
    date: string
    ref: string
    method: string
}

export interface OutstandingDue {
    id: string
    member: string
    email: string
    type: string
    amount: string
    dueDate: string
    overdue: string
}

export interface PaymentAnalytics {
    totalCollected: string
    pendingPayments: string
    totalInvoices: number
    overdueMembers: number
    targetAmount: number
    collectedAmount: number
    percentageAchieved: number
}

export interface RecordPaymentRequest {
    memberId: string
    amount: number
    date: string
    paymentMethod: string
    category: string
    description?: string
    sendReceipt: boolean
}

export async function apiGetPaymentTransactions(params?: any) {
    return ApiService.fetchDataWithAxios<PaymentTransaction[]>({
        url: 'financials/transactions',
        method: 'get',
        params
    })
}

export async function apiGetOutstandingDues(params?: any) {
    return ApiService.fetchDataWithAxios<OutstandingDue[]>({
        url: 'financials/outstanding',
        method: 'get',
        params
    })
}

export async function apiGetPaymentAnalytics() {
    return ApiService.fetchDataWithAxios<PaymentAnalytics>({
        url: 'financials/analytics',
        method: 'get',
    })
}

export async function apiRecordOfflinePayment(data: RecordPaymentRequest) {
    return ApiService.fetchDataWithAxios<PaymentTransaction>({
        url: 'financials/record-payment',
        method: 'post',
        data
    })
}

export async function apiSendPaymentReminder(data: { user_ids?: string[] }) {
    return ApiService.fetchDataWithAxios<{ success: boolean; message: string }>({
        url: 'financials/send-reminder',
        method: 'post',
        data
    })
}

export async function apiSubmitPaymentProof(data: {
    purpose: string
    amount: number
    payment_date: string
    receipt_url?: string
}) {
    return ApiService.fetchDataWithAxios<any>({
        url: 'payments/submit-proof',
        method: 'post',
        data
    })
}
export async function apiDownloadAnnualReport(year?: number) {
    const params = year ? { year } : {}
    return ApiService.fetchDataWithAxios<any>({
        url: 'financials/export-report',
        method: 'get',
        params,
        responseType: 'blob'
    })
}
