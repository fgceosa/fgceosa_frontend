import { memo, useCallback } from 'react'
import { Input, Button, Badge } from '@/components/ui'
import { Mail, Send } from 'lucide-react'
import type { SettingsCardProps, EmailSettings } from '../types'
import { SettingsSection } from './SettingsSection'

export const EmailSettingsCard = memo(({
    settings,
    onChange,
    saving,
}: SettingsCardProps<EmailSettings>) => {
    const handleSmtpHostChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange('smtpHost', e.target.value)
    }, [onChange])

    const handleSmtpPortChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange('smtpPort', parseInt(e.target.value))
    }, [onChange])

    const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange('username', e.target.value)
    }, [onChange])

    const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange('password', e.target.value)
    }, [onChange])

    const handleFromEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange('fromEmail', e.target.value)
    }, [onChange])

    if (!settings) return null

    return (
        <SettingsSection
            title="Email Configuration"
            description="Configure global SMTP settings for system notifications, reports, and administrative audits."
            updatedAt={settings?.updatedAt}
            icon={<Mail className="w-6 h-6" />}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-1">
                    <label className="text-sm font-black tracking-widest text-gray-900">
                        SMTP Host
                    </label>
                    <Input
                        value={settings.smtpHost}
                        placeholder="e.g. smtp.mailgun.org"
                        onChange={handleSmtpHostChange}
                        className="bg-transparent border-gray-200 dark:border-gray-800 focus:ring-primary rounded-2xl h-12 text-base font-semibold"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black tracking-widest text-gray-900">
                        SMTP Port
                    </label>
                    <Input
                        type="number"
                        value={settings.smtpPort}
                        placeholder="587"
                        onChange={handleSmtpPortChange}
                        className="bg-transparent border-gray-200 dark:border-gray-800 focus:ring-primary rounded-2xl h-12 text-base font-semibold"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black tracking-widest text-gray-900">
                        Username
                    </label>
                    <Input
                        value={settings.username}
                        placeholder="SMTP Username"
                        onChange={handleUsernameChange}
                        className="bg-transparent border-gray-200 dark:border-gray-800 focus:ring-primary rounded-2xl h-12 text-base font-semibold"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black tracking-widest text-gray-900">
                        Password
                    </label>
                    <Input
                        type="password"
                        value={settings.password || ''}
                        placeholder="••••••••••••"
                        onChange={handlePasswordChange}
                        className="bg-transparent border-gray-200 dark:border-gray-800 focus:ring-primary rounded-2xl h-12 text-base font-semibold"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black tracking-widest text-gray-900">
                        From Email Address
                    </label>
                    <Input
                        value={settings.fromEmail}
                        placeholder="noreply@qorebit.ai"
                        onChange={handleFromEmailChange}
                        className="bg-transparent border-gray-200 dark:border-gray-800 focus:ring-primary rounded-2xl h-12 text-base font-semibold"
                    />
                    <p className="text-xs text-gray-500 font-medium">All system emails will originate from this address.</p>
                </div>

                <div className="space-y-2 flex flex-col justify-end">
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-primary">
                                <Mail className="w-4 h-4" />
                            </div>
                            <div>
                                <h5 className="text-[10px] font-black tracking-widest text-gray-400">Delivery Status</h5>
                                <Badge className={`${settings.deliveryStatus === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} text-[9px] px-2 py-0 border-none uppercase font-black`}>
                                    {settings.deliveryStatus}
                                </Badge>
                            </div>
                        </div>
                        <Button
                            variant="default"
                            size="sm"
                            icon={<Send className="w-3 h-3" />}
                            className="rounded-xl h-9 text-[10px] font-black uppercase tracking-tight"
                            disabled={saving}
                        >
                            Test Email
                        </Button>
                    </div>
                </div>
            </div>
        </SettingsSection>
    )
})

EmailSettingsCard.displayName = 'EmailSettingsCard'
