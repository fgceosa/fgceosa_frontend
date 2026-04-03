import { Input, Select, Switcher } from '@/components/ui'
import { REGION_OPTIONS, TIMEZONE_OPTIONS, LANGUAGE_OPTIONS } from '../types'
import type { SettingsCardProps, GeneralSettings } from '../types'
import { SettingsSection } from './SettingsSection'
import { Settings2 } from 'lucide-react'

export function GeneralSettingsCard({
    settings,
    onChange,
}: SettingsCardProps<GeneralSettings>) {
    if (!settings) return null
    return (
        <SettingsSection
            title="General Settings"
            description="Fundamental platform configuration including naming, regional presets, and system-wide visibility."
            updatedAt={settings?.updatedAt}
            icon={<Settings2 className="w-6 h-6" />}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-sm font-black text-gray-900">
                        Platform Name
                    </label>
                    <Input
                        value={settings.platformName}
                        placeholder="e.g. Qorebit HQ"
                        onChange={(e) => onChange('platformName', e.target.value)}
                        className="bg-transparent border-gray-200 dark:border-gray-800 focus:ring-primary rounded-2xl h-12 text-base font-semibold"
                    />
                    <p className="text-xs text-gray-500 font-medium">This name appears in emails and platform headers.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black text-gray-900">
                        Default Region
                    </label>
                    <Select<any>
                        value={REGION_OPTIONS.find(o => o.value === settings.defaultRegion) || null}
                        options={[...REGION_OPTIONS]}
                        onChange={(val: any) => onChange('defaultRegion', val?.value || '')}
                        className="rounded-2xl h-12"
                    />
                    <p className="text-xs text-gray-500 font-medium">Primary data residency and deployment zone.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black text-gray-900">
                        System Timezone
                    </label>
                    <Select<any>
                        value={TIMEZONE_OPTIONS.find(o => o.value === settings.timezone) || null}
                        options={[...TIMEZONE_OPTIONS]}
                        onChange={(val: any) => onChange('timezone', val?.value || '')}
                        className="rounded-2xl h-12"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black text-gray-900">
                        Default Language
                    </label>
                    <Select<any>
                        value={LANGUAGE_OPTIONS.find(o => o.value === settings.language) || null}
                        options={[...LANGUAGE_OPTIONS]}
                        onChange={(val: any) => onChange('language', val?.value || '')}
                        className="rounded-2xl h-12"
                    />
                </div>
            </div>

            <div className="p-6 bg-primary/5 dark:bg-primary/10 rounded-[2rem] border border-primary/10 flex items-center justify-between gap-6">
                <div className="space-y-1">
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 tracking-tight">
                        Maintenance Mode
                    </h4>
                    <p className="text-sm text-muted-foreground font-medium">
                        When Maintenance Mode is active, all non-admin users will be blocked from accessing the platform.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <span className={`text-[10px] font-black ${settings.systemStatus === 'active' ? 'text-green-500' : 'text-amber-500'}`}>
                        {settings.systemStatus === 'active' ? 'Live & Active' : 'Under Maintenance'}
                    </span>
                    <Switcher
                        checked={settings.systemStatus === 'maintenance'}
                        onChange={(val) => onChange('systemStatus', val ? 'maintenance' : 'active')}
                    />
                </div>
            </div>
        </SettingsSection>
    )
}
