import { memo, useCallback } from 'react'
import { Input, Select, Switcher } from '@/components/ui'
import type { SettingsCardProps, SecuritySettings } from '../types'
import { SettingsSection } from './SettingsSection'
import { ShieldCheck } from 'lucide-react'

const STRENGTH_OPTIONS = [
    { label: 'Basic (Min 8 chars)', value: 'basic' },
    { label: 'Medium (Alpha-numeric)', value: 'medium' },
    { label: 'Strong (Complex)', value: 'strong' },
]

export const SecuritySettingsCard = memo(({
    settings,
    onChange,
}: SettingsCardProps<SecuritySettings>) => {
    const handleRequire2FAChange = useCallback((val: boolean) => {
        onChange('require2FA', val)
    }, [onChange])

    const handlePasswordStrengthChange = useCallback((val: any) => {
        onChange('passwordStrength', val?.value || 'basic')
    }, [onChange])

    const handleSessionTimeoutChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        onChange('sessionTimeout', val === '' ? '' : parseInt(val) || 0)
    }, [onChange])

    const handleMaxLoginAttemptsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        onChange('maxLoginAttempts', val === '' ? '' : parseInt(val) || 0)
    }, [onChange])

    const handleIpAllowlistChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const ips = e.target.value.split(',')
            .map(ip => ip.trim())
            .filter(ip => ip !== '')
        onChange('ipAllowlist', ips)
    }, [onChange])

    if (!settings) return null

    return (
        <SettingsSection
            title="Security & Access Control"
            description="Enforce platform-wide authentication standards and session management policies for all administrators."
            updatedAt={settings?.updatedAt}
            icon={<ShieldCheck className="w-6 h-6" />}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 space-y-4 shadow-sm h-full flex items-center">
                    <div className="flex items-center justify-between w-full">
                        <div className="space-y-1">
                            <h4 className="font-bold text-gray-900 dark:text-gray-100 tracking-tight text-sm">Require 2FA</h4>
                            <p className="text-xs text-muted-foreground font-medium">Mandatory for all admin level accounts.</p>
                        </div>
                        <Switcher
                            checked={settings.require2FA}
                            onChange={handleRequire2FAChange}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black tracking-widest text-gray-900">
                        Password Strength
                    </label>
                    <Select<any>
                        value={STRENGTH_OPTIONS.find(o => o.value === settings.passwordStrength) || null}
                        options={[...STRENGTH_OPTIONS]}
                        onChange={handlePasswordStrengthChange}
                        className="rounded-2xl h-12"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black tracking-widest text-gray-900">
                        Session Timeout
                    </label>
                    <div className="relative">
                        <Input
                            type="number"
                            value={settings.sessionTimeout}
                            onChange={handleSessionTimeoutChange}
                            className="bg-transparent border-gray-200 dark:border-gray-800 focus:ring-primary rounded-2xl h-12 text-base font-semibold pr-20"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-gray-400 text-[10px] uppercase tracking-widest">Minutes</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Auto logout after period of inactivity.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black tracking-widest text-gray-900">
                        Max Login Attempts
                    </label>
                    <Input
                        type="number"
                        value={settings.maxLoginAttempts}
                        onChange={handleMaxLoginAttemptsChange}
                        className="bg-transparent border-gray-200 dark:border-gray-800 focus:ring-primary rounded-2xl h-12 text-base font-semibold"
                    />
                    <p className="text-xs text-gray-500 font-medium">Accounts will be locked after unsuccessful attempts.</p>
                </div>

                <div className="space-y-2 col-span-1 md:col-span-2">
                    <label className="text-sm font-black tracking-widest text-gray-900">
                        IP Allowlist
                    </label>
                    <Input
                        value={settings.ipAllowlist?.join(', ') || ''}
                        placeholder="e.g. 192.168.1.1, 10.0.0.0/24"
                        onChange={handleIpAllowlistChange}
                        className="bg-transparent border-gray-200 dark:border-gray-800 focus:ring-primary rounded-2xl h-12 text-base font-semibold"
                    />
                    <p className="text-xs text-gray-500 font-medium">Restrict admin panel access to these IP addresses or CIDR ranges. Leave empty for global access.</p>
                </div>
            </div>
        </SettingsSection>
    )
})

SecuritySettingsCard.displayName = 'SecuritySettingsCard'
