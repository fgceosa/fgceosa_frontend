import { Input, Switcher, Badge } from '@/components/ui'
import type { SettingsCardProps, GatewaySettings, GatewayConfig } from '../types'
import { SettingsSection } from './SettingsSection'
import { Activity } from 'lucide-react'

const GatewayItem = ({
    name,
    config,
    onChange
}: {
    name: string,
    config: GatewayConfig,
    onChange: (key: keyof GatewayConfig, val: any) => void
}) => {
    return (
        <div className="p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 space-y-8 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center font-black text-primary">
                        {name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">{name}</h4>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Webhook Status:</span>
                            <Badge className={`${config.webhookStatus === 'active' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'} text-[9px] px-2 py-0 border-none uppercase font-black`}>
                                {config.webhookStatus}
                            </Badge>
                        </div>
                    </div>
                </div>
                <Switcher
                    checked={config.enabled}
                    onChange={(val) => onChange('enabled', val)}
                />
            </div>

            <div className={`space-y-6 transition-opacity duration-300 ${config.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                <div className="space-y-2">
                    <label className="text-xs font-black tracking-widest text-gray-400 uppercase">
                        Public Key
                    </label>
                    <Input
                        type="password"
                        value={config.publicKey}
                        placeholder={`Enter ${name} Public Key`}
                        onChange={(e) => onChange('publicKey', e.target.value)}
                        className="bg-transparent border-gray-100 dark:border-gray-800 focus:ring-primary rounded-xl h-11 text-sm font-medium"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black tracking-widest text-gray-400 uppercase">
                        Secret Key
                    </label>
                    <Input
                        type="password"
                        value={config.secretKey}
                        placeholder={`Enter ${name} Secret Key`}
                        onChange={(e) => onChange('secretKey', e.target.value)}
                        className="bg-transparent border-gray-100 dark:border-gray-800 focus:ring-primary rounded-xl h-11 text-sm font-medium"
                    />
                </div>
            </div>
        </div>
    )
}

export function GatewaySettingsCard({
    settings,
    onChange,
}: SettingsCardProps<GatewaySettings>) {
    if (!settings) return null
    return (
        <SettingsSection
            title="Payment Gateways"
            description="Securely manage your API integrations with regional payment providers and webhook configurations."
            updatedAt={settings?.updatedAt}
            icon={<Activity className="w-6 h-6" />}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GatewayItem
                    name="Monnify"
                    config={settings.monnify}
                    onChange={(key, val) => {
                        const newConfig = { ...settings.monnify, [key]: val }
                        onChange('monnify', newConfig)
                    }}
                />
                <GatewayItem
                    name="Flutterwave"
                    config={settings.flutterwave}
                    onChange={(key, val) => {
                        const newConfig = { ...settings.flutterwave, [key]: val }
                        onChange('flutterwave', newConfig)
                    }}
                />
            </div>
        </SettingsSection>
    )
}
