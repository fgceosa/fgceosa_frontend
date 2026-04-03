'use client'

import { memo, useCallback, useMemo } from 'react'
import { Input, Select, Switcher, Button, Badge } from '@/components/ui'
import type { SettingsCardProps, ComplianceSettings } from '../types'
import { SettingsSection } from './SettingsSection'
import { ShieldCheck, FileText, Globe, Download, Clock, UserCheck, Bot } from 'lucide-react'

const RESIDENCY_OPTIONS = [
    { label: 'Nigeria (Lagos - Local Cloud)', value: 'ng' },
    { label: 'United States (AWS East)', value: 'us' },
    { label: 'European Union (Frankfurt)', value: 'eu' },
    { label: 'Global (Auto-routing)', value: 'global' },
]

const RETENTION_OPTIONS = [
    { label: '30 Days', value: 30 },
    { label: '90 Days', value: 90 },
    { label: '180 Days', value: 180 },
    { label: '1 Year', value: 365 },
    { label: '7 Years (Standard Compliance)', value: 2555 },
]

const RETENTION_ITEMS = [
    { label: 'Audit Logs', key: 'auditLogs', icon: FileText },
    { label: 'Model Discovery', key: 'modelLogs', icon: Bot },
    { label: 'Access History', key: 'userActivity', icon: UserCheck },
] as const

const AUDIT_LOGS = [
    { time: '2025-12-24 14:10:02', action: 'POLICY_UPDATE', resource: 'PAYMENT_GATEWAY', status: 'success' },
    { time: '2025-12-24 13:45:12', action: 'ADMIN_LOGIN', resource: 'AUTH_SERVICE', status: 'success' },
    { time: '2025-12-24 12:20:55', action: 'KEY_ROTATION', resource: 'MONO_API', status: 'warning' },
] as const

export const ComplianceSettingsCard = memo(({
    settings,
    onChange,
}: SettingsCardProps<ComplianceSettings>) => {
    const handleDataResidencyChange = useCallback((val: any) => {
        onChange('dataResidency', val?.value || 'us')
    }, [onChange])

    const handleAllowExportsChange = useCallback((val: boolean) => {
        onChange('allowExports', val)
    }, [onChange])

    const handleRetentionPolicyChange = useCallback((key: string, val: any) => {
        const currentPolicy = settings.retentionPolicy || {
            auditLogs: 90,
            modelLogs: 90,
            userActivity: 90
        }
        const newPolicy = { ...currentPolicy, [key]: val?.value }
        onChange('retentionPolicy', newPolicy)
    }, [onChange, settings.retentionPolicy])

    if (!settings) return null

    const retentionPolicy = settings.retentionPolicy || {
        auditLogs: 90,
        modelLogs: 90,
        userActivity: 90
    }

    return (
        <SettingsSection
            title="Compliance & Governance"
            description="Manage data residency, document retention policies, and export administrative audit logs for regulatory compliance."
            updatedAt={settings?.updatedAt}
            icon={<ShieldCheck className="w-6 h-6" />}
        >
            <div className="space-y-12">
                {/* Data Residency & Sovereignty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4 p-8 bg-gray-50 dark:bg-gray-900/50 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3 text-primary">
                            <Globe className="w-5 h-5" />
                            <h4 className="font-black text-xs tracking-[0.2em]">Data Residency</h4>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-900 tracking-widest">Storage Region</label>
                            <Select<any>
                                value={RESIDENCY_OPTIONS.find(o => o.value === settings.dataResidency) || null}
                                options={RESIDENCY_OPTIONS}
                                onChange={handleDataResidencyChange}
                                className="rounded-2xl h-12"
                            />
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium">Compliance with local data protection laws (e.g. NDPR, GDPR) requires user data to be stored in specific geographic regions.</p>
                    </div>

                    <div className="space-y-4 p-8 bg-white dark:bg-gray-950/20 border border-gray-100 dark:border-gray-800 rounded-[2.5rem]">
                        <div className="flex items-center gap-3 text-amber-500">
                            <Download className="w-5 h-5" />
                            <h4 className="font-black text-xs tracking-[0.2em]">Administrative Exports</h4>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-gray-900 tracking-widest">Allow Export for Regulators</span>
                                <p className="text-xs font-medium text-gray-500">Enable one-click CSV/PDF exports for compliance audits.</p>
                            </div>
                            <Switcher
                                checked={settings.allowExports}
                                onChange={handleAllowExportsChange}
                            />
                        </div>
                        <Button
                            variant="plain"
                            disabled={!settings.allowExports}
                            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl h-10 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Generate Compliance Report
                        </Button>
                    </div>
                </div>

                {/* Retention Policies */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 px-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <h4 className="font-black text-sm tracking-tight">Retention Policies</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {RETENTION_ITEMS.map((item) => (
                            <RetentionPolicyItem
                                key={item.key}
                                item={item}
                                value={(retentionPolicy as any)[item.key]}
                                onChange={handleRetentionPolicyChange}
                            />
                        ))}
                    </div>
                </div>

                {/* Log Previews (Read-only) */}
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            <h4 className="font-black text-sm tracking-tight">Recent Administrative Events</h4>
                        </div>
                        <Button variant="plain" size="sm" className="text-xs font-black uppercase tracking-widest text-primary">View Full Audit Trail</Button>
                    </div>

                    <div className="overflow-hidden border border-gray-100 dark:border-gray-800 rounded-3xl">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Timestamp</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Action</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Resource</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {AUDIT_LOGS.map((log, i) => (
                                    <tr key={i} className="group hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                                        <td className="px-6 py-4 font-mono text-[10px] text-gray-500">{log.time}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-gray-900 dark:text-gray-100 tracking-tight">{log.action}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-black text-gray-400 tracking-widest">{log.resource}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className={`${log.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'} text-[9px] px-2 py-0 border-none uppercase font-black`}>
                                                {log.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </SettingsSection>
    )
})

ComplianceSettingsCard.displayName = 'ComplianceSettingsCard'

// Memoized sub-component for retention policy items
const RetentionPolicyItem = memo(({
    item,
    value,
    onChange
}: {
    item: typeof RETENTION_ITEMS[number]
    value: number
    onChange: (key: string, val: any) => void
}) => {
    const handleChange = useCallback((val: any) => {
        onChange(item.key, val)
    }, [item.key, onChange])

    const selectedValue = useMemo(() =>
        RETENTION_OPTIONS.find(o => o.value === value) || null,
        [value]
    )

    return (
        <div className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/5 rounded-xl border border-primary/10">
                    <item.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs font-black tracking-widest">{item.label}</span>
            </div>
            <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-900">Retention Period</label>
                <Select<any>
                    value={selectedValue}
                    options={RETENTION_OPTIONS}
                    onChange={handleChange}
                    className="rounded-xl h-10 text-xs"
                />
            </div>
        </div>
    )
})

RetentionPolicyItem.displayName = 'RetentionPolicyItem'
