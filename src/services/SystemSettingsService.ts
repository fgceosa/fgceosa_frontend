import ApiService from './ApiService'

export interface SystemSettings {
    association_name: string
    association_logo: string | null
    contact_email: string
    contact_phone: string
    address: string | null
    currency: string
    payment_enabled: boolean
    flutterwave_public_key: string | null
    flutterwave_secret_key: string | null
    tax_percentage: number
    invoice_footer_note: string | null
    default_member_status: string
    allow_self_registration: bool
    enable_email_notifications: bool
    timezone: string
    date_format: string
}

export async function apiGetSystemSettings() {
    return ApiService.fetchDataWithAxios<SystemSettings>({
        url: 'settings/system',
        method: 'get',
    })
}

export async function apiUpdateSystemSettings(data: Partial<SystemSettings>) {
    return ApiService.fetchDataWithAxios<SystemSettings>({
        url: 'settings/system',
        method: 'put',
        data,
    })
}
