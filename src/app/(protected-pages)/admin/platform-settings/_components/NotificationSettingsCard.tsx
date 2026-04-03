import { memo, useCallback } from 'react'
import { Switcher } from '@/components/ui'
import type { SettingsCardProps, NotificationSettings } from '../types'
import { SettingsSection } from './SettingsSection'
import { Bell } from 'lucide-react'

const NotificationItem = memo(({
    label,
    description,
    checked,
    onChange
}: {
    label: string,
    description: string,
    checked: boolean,
    onChange: (val: boolean) => void
}) => (
    <div className="flex items-center justify-between p-6 bg-white dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-primary/20 transition-all duration-300">
        <div className="space-y-1">
            <h4 className="font-bold text-gray-900 dark:text-gray-100 tracking-tight text-sm">
                {label}
            </h4>
            <p className="text-xs text-muted-foreground font-medium max-w-md">
                {description}
            </p>
        </div>
        <Switcher checked={checked} onChange={onChange} />
    </div>
))

NotificationItem.displayName = 'NotificationItem'

export const NotificationSettingsCard = memo(({
    settings,
    onChange,
}: SettingsCardProps<NotificationSettings>) => {
    const handleEmailNotificationsChange = useCallback((val: boolean) => {
        onChange('emailNotifications', val)
    }, [onChange])

    const handleCriticalSystemAlertsChange = useCallback((val: boolean) => {
        onChange('criticalSystemAlerts', val)
    }, [onChange])

    const handleFraudAlertsChange = useCallback((val: boolean) => {
        onChange('fraudAlerts', val)
    }, [onChange])

    const handleUsageThresholdAlertsChange = useCallback((val: boolean) => {
        onChange('usageThresholdAlerts', val)
    }, [onChange])

    const handleAdminActivityAlertsChange = useCallback((val: boolean) => {
        onChange('adminActivityAlerts', val)
    }, [onChange])

    if (!settings) return null

    return (
        <SettingsSection
            title="Notifications"
            description="Configure system-wide alerts and communication policies for administrators and automated systems."
            updatedAt={settings?.updatedAt}
            icon={<Bell className="w-6 h-6" />}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NotificationItem
                    label="Email Notifications"
                    description="Enable or disable all outbound system-generated emails."
                    checked={settings.emailNotifications}
                    onChange={handleEmailNotificationsChange}
                />
                <NotificationItem
                    label="Critical System Alerts"
                    description="Receive immediate alerts for server failures or downtime."
                    checked={settings.criticalSystemAlerts}
                    onChange={handleCriticalSystemAlertsChange}
                />
                <NotificationItem
                    label="Fraud & Credit Abuse"
                    description="Get notified of suspicious credit transfers or usage patterns."
                    checked={settings.fraudAlerts}
                    onChange={handleFraudAlertsChange}
                />
                <NotificationItem
                    label="Usage Threshold Alerts"
                    description="Notifications when organization credits fall below configured levels."
                    checked={settings.usageThresholdAlerts}
                    onChange={handleUsageThresholdAlertsChange}
                />
                <NotificationItem
                    label="Admin Activity Alerts"
                    description="Track all administrative actions with real-time email audits."
                    checked={settings.adminActivityAlerts}
                    onChange={handleAdminActivityAlertsChange}
                />
            </div>
        </SettingsSection>
    )
})

NotificationSettingsCard.displayName = 'NotificationSettingsCard'
