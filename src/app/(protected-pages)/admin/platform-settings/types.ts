/**
 * Platform Settings Types
 */

// General Settings
export interface GeneralSettings {
    platformName: string
    defaultRegion: string
    timezone: string
    language: string
    systemStatus: 'active' | 'maintenance'
    updatedAt?: string
}

// Notification Settings
export interface NotificationSettings {
    emailNotifications: boolean
    criticalSystemAlerts: boolean
    fraudAlerts: boolean
    usageThresholdAlerts: boolean
    adminActivityAlerts: boolean
    updatedAt?: string
}

// Payment/Credit Settings
export interface PaymentSettings {
    defaultMarkup: number
    minCreditAmount: number
    nairaToCreditRate: number
    creditExpiryPolicy: 'none' | '30days' | '90days' | '180days' | '365days'
    creditTransferLimits: number
    enablePayments: boolean
    updatedAt?: string
}

// Gateway Configuration
export interface GatewayConfig {
    enabled: boolean
    publicKey: string
    secretKey: string
    webhookStatus: 'active' | 'inactive' | 'pending'
}

export interface GatewaySettings {
    monnify: GatewayConfig
    flutterwave: GatewayConfig
    updatedAt?: string
}

// Email Configuration
export interface EmailSettings {
    smtpHost: string
    smtpPort: number
    username: string
    password?: string
    fromEmail: string
    deliveryStatus: 'active' | 'inactive' | 'error'
    updatedAt?: string
}

// Security Settings
export interface SecuritySettings {
    require2FA: boolean
    sessionTimeout: number
    maxLoginAttempts: number
    passwordStrength: 'basic' | 'medium' | 'strong'
    ipAllowlist: string[]
    updatedAt?: string
}

// API & Rate Limiting
export interface RateLimitSettings {
    globalRateLimit: number
    burstLimit: number
    adminRateLimit: number
    enableRateLimiting: boolean
    updatedAt?: string
}

// Integration Configuration
export interface IntegrationConfig {
    enabled: boolean
    apiKey: string
    secretKey?: string
    webhookUrl?: string
    status: 'active' | 'inactive' | 'error'
    lastSync?: string
}

export interface WebhookConfig {
    id: string
    name: string
    url: string
    events: string[]
    enabled: boolean
    secret: string
}

export interface IntegrationSettings {
    mono: IntegrationConfig
    postmark: IntegrationConfig
    webhooks: WebhookConfig[]
    eventStreams: {
        enabled: boolean
        provider: 'kafka' | 'redpanda' | 'internal'
        endpoint: string
        status: 'active' | 'inactive'
    }
    updatedAt?: string
}

export interface ComplianceSettings {
    dataResidency: 'ng' | 'us' | 'eu' | 'global'
    retentionPolicy: {
        auditLogs: number // days
        modelLogs: number // days
        userActivity: number // days
    }
    allowExports: boolean
    autoArchiving: boolean
    updatedAt?: string
}

// Complete Platform Settings
export interface PlatformSettingsData {
    general: GeneralSettings
    notifications: NotificationSettings
    payments: PaymentSettings
    gateways: GatewaySettings
    email: EmailSettings
    security: SecuritySettings
    rateLimiting: RateLimitSettings
    integrations: IntegrationSettings
    compliance: ComplianceSettings
    updatedAt?: string
}

// Component Props
export interface SettingsCardProps<T> {
    settings: T
    onChange: (key: keyof T, value: any) => void
    saving?: boolean
}

// API Response
export interface PlatformSettingsResponse {
    success: boolean
    message: string
    data?: PlatformSettingsData
}

// Options
export const REGION_OPTIONS = [
    { label: 'Nigeria (Lagos)', value: 'ng-lagos' },
    { label: 'US East (N. Virginia)', value: 'us-east-1' },
    { label: 'Europe (Frankfurt)', value: 'eu-central-1' },
    { label: 'Asia Pacific (Singapore)', value: 'ap-southeast-1' },
]

export const TIMEZONE_OPTIONS = [
    { label: 'Africa/Lagos (WAT)', value: 'africa/lagos' },
    { label: 'UTC', value: 'utc' },
    { label: 'America/New_York (EST)', value: 'america/new_york' },
    { label: 'Europe/London (GMT)', value: 'europe/london' },
]

export const LANGUAGE_OPTIONS = [
    { label: 'English (US)', value: 'en-us' },
    { label: 'English (UK)', value: 'en-gb' },
    { label: 'French', value: 'fr' },
]

export const EXPIRY_OPTIONS = [
    { label: 'No Expiry', value: 'none' },
    { label: '30 Days', value: '30days' },
    { label: '90 Days', value: '90days' },
    { label: '180 Days', value: '180days' },
    { label: '1 Year', value: '365days' },
]
