'use client'

import { useState, useCallback, useEffect } from 'react'
import { toast } from '@/components/ui'
import { apiGetSystemSettings, apiUpdateSystemSettings, type SystemSettings } from '@/services/SystemSettingsService'

const DEFAULT_SETTINGS: SystemSettings = {
    association_name: 'FGCEOSA',
    association_logo: null,
    contact_email: 'admin@fgceosa.org',
    contact_phone: '+234 800 000 0000',
    currency: 'NGN',
    payment_enabled: true,
    paystack_public_key: null,
    paystack_secret_key: null,
    tax_percentage: 0,
    invoice_footer_note: 'Thank you for your tireless support of the FGCEOSA community.',
    default_member_status: 'active',
    allow_self_registration: true,
    enable_email_notifications: true,
    timezone: 'WAT',
    date_format: 'DD/MM/YYYY',
}

export default function useSystemSettings() {
    const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS)
    const [loading, setLoading] = useState(true)

    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true)
            const response = await apiGetSystemSettings()
            if (response) {
                setSettings(response)
            }
        } catch (error) {
            console.error('Failed to fetch system settings:', error)
            toast.error('Failed to load system settings')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchSettings()
    }, [fetchSettings])

    const updateSettings = useCallback(async (newSettings: Partial<SystemSettings>) => {
        try {
            const response = await apiUpdateSystemSettings(newSettings)
            if (response) {
                setSettings(response)
                toast.success('Settings updated successfully')
                return true
            }
        } catch (error) {
            console.error('Failed to update system settings:', error)
            toast.error('Failed to save settings')
            return false
        }
        return false
    }, [])

    // For backward compatibility with existing components that might use camelCase
    // We can provide a mapped version if needed, but it's better to update them.
    // However, Logo.tsx uses settings.associationName
    const legacySettings = {
        ...settings,
        associationName: settings.association_name,
        associationLogo: settings.association_logo,
        contactEmail: settings.contact_email,
        contactPhone: settings.contact_phone,
        paymentEnabled: settings.payment_enabled,
        dateFormat: settings.date_format,
        defaultMemberStatus: settings.default_member_status
    }

    return {
        settings: legacySettings,
        rawSettings: settings,
        loading,
        updateSettings,
        refreshSettings: fetchSettings
    }
}
