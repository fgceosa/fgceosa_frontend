'use client'

import { useState } from 'react'
import { Input, Switcher, Badge, Button } from '@/components/ui'
import type { SettingsCardProps, IntegrationSettings, IntegrationConfig, WebhookConfig } from '../types'
import { SettingsSection } from './SettingsSection'
import { Link2, Unplug, RefreshCw, History, Plus, Trash2, Globe, Database } from 'lucide-react'

const IntegrationItem = ({
    name,
    icon: Icon,
    config,
    onChange,
    onRotate
}: {
    name: string,
    icon: any,
    config: IntegrationConfig,
    onChange: (key: keyof IntegrationConfig, val: any) => void,
    onRotate?: () => void
}) => {
    return (
        <div className="p-8 bg-white dark:bg-gray-950/50 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 space-y-6 shadow-sm group hover:border-primary/20 transition-all duration-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10">
                        <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                        <h4 className="font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">{name}</h4>
                        <div className="flex items-center gap-2">
                            <Badge className={`${config.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'} text-[9px] px-2 py-0 border-none uppercase font-black`}>
                                {config.status}
                            </Badge>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                <History className="w-3 h-3" />
                                Updated: {config.lastSync || 'Never'}
                            </span>
                        </div>
                    </div>
                </div>
                <Switcher
                    checked={config.enabled}
                    onChange={(val) => onChange('enabled', val)}
                />
            </div>

            <div className={`space-y-6 transition-all duration-300 ${config.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black tracking-widest text-gray-400 uppercase">API Key</label>
                        <div className="relative">
                            <Input
                                type="password"
                                value={config.apiKey}
                                onChange={(e) => onChange('apiKey', e.target.value)}
                                className="h-11 rounded-xl bg-gray-50 border-none pr-10"
                            />
                            {onRotate && (
                                <button
                                    onClick={onRotate}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                                    title="Rotate Key"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                    {config.secretKey !== undefined && (
                        <div className="space-y-2">
                            <label className="text-xs font-black tracking-widest text-gray-400 uppercase">Secret Key</label>
                            <Input
                                type="password"
                                value={config.secretKey}
                                onChange={(e) => onChange('secretKey', e.target.value)}
                                className="h-11 rounded-xl bg-gray-50 border-none"
                            />
                        </div>
                    )}
                </div>

                {config.webhookUrl !== undefined && (
                    <div className="space-y-2">
                        <label className="text-xs font-black tracking-widest text-gray-400 uppercase">Webhook Callback URL</label>
                        <Input
                            value={config.webhookUrl}
                            readOnly
                            className="h-11 rounded-xl bg-gray-100 border-none cursor-default font-mono text-[11px]"
                        />
                    </div>
                )}

                <div className="flex gap-2">
                    <Button variant="plain" size="sm" className="text-[10px] font-black uppercase tracking-widest text-primary h-9">
                        View Integration Logs
                    </Button>
                </div>
            </div>
        </div>
    )
}

export function IntegrationSettingsCard({
    settings,
    onChange,
}: SettingsCardProps<IntegrationSettings>) {
    // START: Added guard clause
    if (!settings) return null
    // END: Added guard clause

    const handleAddWebhook = () => {
        const newWebhook: WebhookConfig = {
            id: Math.random().toString(36).substr(2, 9),
            name: 'New Webhook',
            url: '',
            events: [],
            enabled: true,
            secret: 'whsec_' + Math.random().toString(36).substr(2, 16)
        }
        onChange('webhooks', [...settings.webhooks, newWebhook])
    }

    return (
        <SettingsSection
            title="External Integrations"
            description="Extend platform functionality by connecting regional banking providers, specialized email servers, and event streaming infrastructure."
            updatedAt={settings?.updatedAt}
            icon={<Link2 className="w-6 h-6" />}
        >
            <div className="space-y-8">
                {/* 3rd Party Connectors */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <IntegrationItem
                        name="Mono (Banking)"
                        icon={Unplug}
                        config={settings.mono}
                        onChange={(key, val) => onChange('mono', { ...settings.mono, [key]: val })}
                        onRotate={() => { }}
                    />
                    <IntegrationItem
                        name="Postmark (Mail)"
                        icon={Globe}
                        config={settings.postmark}
                        onChange={(key, val) => onChange('postmark', { ...settings.postmark, [key]: val })}
                        onRotate={() => { }}
                    />
                </div>

                {/* Internal Event Stream */}
                <div className="p-8 bg-primary/5 dark:bg-primary/10 rounded-[2.5rem] border border-primary/20 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                                <Database className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">Internal Event Streams</h4>
                                <p className="text-xs text-muted-foreground font-medium">Stream platform events to internal infrastructure for real-time processing.</p>
                            </div>
                        </div>
                        <Switcher
                            checked={settings.eventStreams.enabled}
                            onChange={(val) => onChange('eventStreams', { ...settings.eventStreams, enabled: val })}
                        />
                    </div>

                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all ${settings.eventStreams.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                        <div className="space-y-2">
                            <label className="text-xs font-black tracking-widest text-gray-400 uppercase">Stream Provider</label>
                            <Input
                                value={settings.eventStreams.provider}
                                readOnly
                                className="h-11 rounded-xl bg-white border-none uppercase font-bold text-xs"
                            />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <label className="text-xs font-black tracking-widest text-gray-400 uppercase">Endpoint / Broker</label>
                            <Input
                                value={settings.eventStreams.endpoint}
                                placeholder="broker.qorebit.internal:9092"
                                onChange={(e) => onChange('eventStreams', { ...settings.eventStreams, endpoint: e.target.value })}
                                className="h-11 rounded-xl bg-white border-none font-mono text-xs"
                            />
                        </div>
                    </div>
                </div>

                {/* Webhooks Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-4">
                        <div className="space-y-1">
                            <h4 className="font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">Outbound Webhooks</h4>
                            <p className="text-xs text-muted-foreground font-medium">Trigger external actions when specific platform events occur.</p>
                        </div>
                        <Button
                            variant="plain"
                            size="sm"
                            onClick={handleAddWebhook}
                            className="bg-primary/10 text-primary hover:bg-primary/20 rounded-xl px-4 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Hook
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {settings.webhooks.map((hook, index) => (
                            <div key={hook.id} className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl flex flex-col md:flex-row md:items-center gap-6 shadow-sm hover:border-primary/30 transition-all">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center font-black text-xs">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <Input
                                                value={hook.name}
                                                onChange={(e) => {
                                                    const newHooks = [...settings.webhooks]
                                                    newHooks[index].name = e.target.value
                                                    onChange('webhooks', newHooks)
                                                }}
                                                className="h-8 p-0 bg-transparent border-none font-bold text-sm focus:ring-0"
                                            />
                                            <Input
                                                value={hook.url}
                                                placeholder="https://your-api.com/webhooks"
                                                onChange={(e) => {
                                                    const newHooks = [...settings.webhooks]
                                                    newHooks[index].url = e.target.value
                                                    onChange('webhooks', newHooks)
                                                }}
                                                className="h-6 p-0 bg-transparent border-none text-xs text-gray-400 focus:ring-0 font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</span>
                                        <Switcher
                                            checked={hook.enabled}
                                            onChange={(val) => {
                                                const newHooks = [...settings.webhooks]
                                                newHooks[index].enabled = val
                                                onChange('webhooks', newHooks)
                                            }}
                                        />
                                    </div>
                                    <button
                                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                        onClick={() => {
                                            const newHooks = settings.webhooks.filter(h => h.id !== hook.id)
                                            onChange('webhooks', newHooks)
                                        }}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {settings.webhooks.length === 0 && (
                            <div className="p-12 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl text-center">
                                <p className="text-sm font-medium text-gray-400">No outbound webhooks configured. Click "Add Hook" to begin.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SettingsSection>
    )
}
