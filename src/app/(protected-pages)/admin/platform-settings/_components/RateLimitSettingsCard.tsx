import { memo, useCallback } from 'react'
import { Input, Switcher } from '@/components/ui'
import type { SettingsCardProps, RateLimitSettings } from '../types'
import { SettingsSection } from './SettingsSection'
import { Activity } from 'lucide-react'

export const RateLimitSettingsCard = memo(({
    settings,
    onChange,
}: SettingsCardProps<RateLimitSettings>) => {
    const handleGlobalRateLimitChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        onChange('globalRateLimit', val === '' ? '' : parseInt(val) || 0)
    }, [onChange])

    const handleBurstLimitChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        onChange('burstLimit', val === '' ? '' : parseInt(val) || 0)
    }, [onChange])

    const handleAdminRateLimitChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        onChange('adminRateLimit', val === '' ? '' : parseInt(val) || 0)
    }, [onChange])

    const handleEnableRateLimitingChange = useCallback((val: boolean) => {
        onChange('enableRateLimiting', val)
    }, [onChange])

    if (!settings) return null

    return (
        <SettingsSection
            title="API & Rate Limiting"
            description="Manage platform throughput and prevent resource exhaustion through granular traffic control policies."
            updatedAt={settings?.updatedAt}
            icon={<Activity className="w-6 h-6" />}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-sm font-black tracking-widest text-gray-900">
                        Global Rate Limit
                    </label>
                    <div className="relative">
                        <Input
                            type="number"
                            value={settings.globalRateLimit}
                            onChange={handleGlobalRateLimitChange}
                            className="bg-transparent border-gray-200 dark:border-gray-800 focus:ring-primary rounded-2xl h-12 text-base font-semibold pr-24"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-gray-400 text-[10px] uppercase tracking-widest">Req / Min</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black tracking-widest text-gray-900">
                        Burst Limit
                    </label>
                    <div className="relative">
                        <Input
                            type="number"
                            value={settings.burstLimit}
                            onChange={handleBurstLimitChange}
                            className="bg-transparent border-gray-200 dark:border-gray-800 focus:ring-primary rounded-2xl h-12 text-base font-semibold pr-24"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-gray-400 text-[10px] uppercase tracking-widest">Requests</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black tracking-widest text-gray-900">
                        Admin API Limit
                    </label>
                    <div className="relative">
                        <Input
                            type="number"
                            value={settings.adminRateLimit}
                            onChange={handleAdminRateLimitChange}
                            className="bg-transparent border-gray-200 dark:border-gray-800 focus:ring-primary rounded-2xl h-12 text-base font-semibold pr-24"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-gray-400 text-[10px] uppercase tracking-widest">Req / Min</span>
                    </div>
                </div>

                <div className="flex flex-col justify-end">
                    <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10 flex items-center justify-between gap-6 h-12">
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100 tracking-tight">Enable Rate Limiting</span>
                        <Switcher
                            checked={settings.enableRateLimiting}
                            onChange={handleEnableRateLimitingChange}
                        />
                    </div>
                </div>
            </div>
        </SettingsSection>
    )
})

RateLimitSettingsCard.displayName = 'RateLimitSettingsCard'
