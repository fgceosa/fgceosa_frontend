import { Input, Select, Switcher } from '@/components/ui'
import { EXPIRY_OPTIONS } from '../types'
import type { SettingsCardProps, PaymentSettings } from '../types'
import { SettingsSection } from './SettingsSection'
import { CreditCard } from 'lucide-react'

export function PaymentSettingsCard({
    settings,
    onChange,
}: SettingsCardProps<PaymentSettings>) {
    if (!settings) return null
    return (
        <SettingsSection
            title="Global Payment Rules"
            description="Manage pricing markups, purchase limits, and credit validity policies across the entire platform."
            updatedAt={settings?.updatedAt}
            icon={<CreditCard className="w-6 h-6" />}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-sm font-black tracking-widest text-gray-900">
                        Default Markup (%)
                    </label>
                    <div className="relative">
                        <Input
                            type="number"
                            value={settings.defaultMarkup}
                            onChange={(e) => {
                                const val = e.target.value;
                                onChange('defaultMarkup', val === '' ? '' : parseFloat(val) || 0);
                            }}
                            className="bg-transparent border-gray-200 dark:border-gray-800 focus:ring-primary rounded-2xl h-12 text-base font-semibold pr-12"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-gray-400">%</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Applied to base token costs for all organizations.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black tracking-widest text-gray-900">
                        Min. Credit Purchase
                    </label>
                    <div className="relative">
                        <Input
                            type="number"
                            value={settings.minCreditAmount}
                            onChange={(e) => {
                                const val = e.target.value;
                                onChange('minCreditAmount', val === '' ? '' : parseFloat(val) || 0);
                            }}
                            className="bg-transparent border-gray-200 dark:border-gray-800 focus:ring-primary rounded-2xl h-12 text-base font-semibold pl-12"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">₦</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">The lowest amount a user can pay per transaction.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black tracking-widest text-gray-900">
                        Credit Expiry Policy
                    </label>
                    <Select<any>
                        value={EXPIRY_OPTIONS.find(o => o.value === settings.creditExpiryPolicy) || null}
                        options={[...EXPIRY_OPTIONS]}
                        onChange={(val: any) => onChange('creditExpiryPolicy', val?.value || 'none')}
                        className="rounded-2xl h-12"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black tracking-widest text-gray-900">
                        Exchange Rate (₦/Credit)
                    </label>
                    <div className="relative">
                        <Input
                            type="number"
                            value={settings.nairaToCreditRate}
                            onChange={(e) => {
                                const val = e.target.value;
                                onChange('nairaToCreditRate', val === '' ? '' : parseFloat(val) || 0);
                            }}
                            className="bg-transparent border-gray-200 dark:border-gray-800 focus:ring-primary rounded-2xl h-12 text-base font-semibold pl-12"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">₦</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Used to convert Naira payments into AI credits.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black tracking-widest text-gray-900">
                        Transfer Limit (Daily)
                    </label>
                    <Input
                        type="number"
                        value={settings.creditTransferLimits}
                        onChange={(e) => {
                            const val = e.target.value;
                            onChange('creditTransferLimits', val === '' ? '' : parseFloat(val) || 0);
                        }}
                        className="bg-transparent border-gray-200 dark:border-gray-800 focus:ring-primary rounded-2xl h-12 text-base font-semibold"
                    />
                    <p className="text-xs text-gray-500 font-medium">Maximum credits a user can transfer to others daily.</p>
                </div>
            </div>

            <div className="p-6 bg-primary/5 dark:bg-primary/10 rounded-[2rem] border border-primary/10 flex items-center justify-between gap-6">
                <div className="space-y-1">
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 tracking-tight text-sm">
                        Enable Payments
                    </h4>
                    <p className="text-xs text-muted-foreground font-medium">
                        Toggling this off will disable all credit purchases platform-wide. Useful for migration or internal-only usage.
                    </p>
                </div>
                <Switcher
                    checked={settings.enablePayments}
                    onChange={(val) => onChange('enablePayments', val)}
                />
            </div>
        </SettingsSection>
    )
}
