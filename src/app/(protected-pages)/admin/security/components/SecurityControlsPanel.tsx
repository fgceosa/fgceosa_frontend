import { useState, useEffect } from 'react'
import { Card, Switcher, Select, Notification, toast } from '@/components/ui'
import { Shield, Key, Clock, Globe } from 'lucide-react'
import classNames from '@/utils/classNames'
import type { SecurityControlConfig } from '../types'
import { useSecurityStats } from '../hooks'
import { useAppDispatch } from '@/store/hook'
import { updateSecurityConfig } from '@/store/slices/security'

import PolicySnapshot from './PolicySnapshot'

interface SecurityControlsProps {
    initialConfig?: SecurityControlConfig
}

export default function SecurityControlsPanel({ initialConfig }: SecurityControlsProps) {
    const { stats } = useSecurityStats()
    const dispatch = useAppDispatch()

    // Use config from backend stats, fallback to initialConfig or defaults
    const backendConfig = stats?.securityConfig || initialConfig || {
        mfaEnforced: true,
        sessionTimeoutMins: 30,
        passwordStrength: 'strong' as const,
        ipAllowlistEnabled: false
    }

    const [config, setConfig] = useState<SecurityControlConfig>(backendConfig)

    // Keep internal state in sync with backend config when stats load
    useEffect(() => {
        if (stats?.securityConfig) {
            setConfig(stats.securityConfig)
        }
    }, [stats?.securityConfig])

    const handleToggle = async (key: keyof SecurityControlConfig, value: any) => {
        const previousValue = config[key]
        setConfig(prev => ({ ...prev, [key]: value }))

        try {
            await dispatch(updateSecurityConfig({ [key]: value })).unwrap()
            toast.push(
                <Notification type="success" title="Security Policy Updated">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} has been updated.
                </Notification>
            )
        } catch (error: any) {
            // Revert on error
            setConfig(prev => ({ ...prev, [key]: previousValue }))
            toast.push(
                <Notification type="danger" title="Update Failed">
                    {error || 'Failed to update security setting.'}
                </Notification>
            )
        }
    }

    const controls = [
        {
            key: 'mfaEnforced',
            label: 'Enforce MFA',
            description: 'Require Multi-Factor Authentication',
            icon: Shield,
            type: 'toggle',
            value: config.mfaEnforced,
            color: 'text-emerald-500'
        },
        {
            key: 'sessionTimeoutMins',
            label: 'Session Timeout',
            description: 'Auto-logout inactive users',
            icon: Clock,
            type: 'select',
            value: config.sessionTimeoutMins,
            options: [
                { value: 15, label: '15 Min' },
                { value: 30, label: '30 Min' },
                { value: 60, label: '1 Hour' },
                { value: 240, label: '4 Hrs' }
            ],
            color: 'text-blue-500'
        },
        {
            key: 'passwordStrength',
            label: 'Password Policy',
            description: 'Min complexity requirements',
            icon: Key,
            type: 'select',
            value: config.passwordStrength,
            options: [
                { value: 'standard', label: 'Standard' },
                { value: 'strong', label: 'Strong' },
                { value: 'complex', label: 'Complex' }
            ],
            color: 'text-purple-500'
        },
        {
            key: 'ipAllowlistEnabled',
            label: 'Global IP Allowlist',
            description: 'Restrict to specific IP ranges',
            icon: Globe,
            type: 'toggle',
            value: config.ipAllowlistEnabled,
            color: 'text-orange-500'
        }
    ]

    return (
        <Card className="rounded-[1.8rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none bg-white dark:bg-gray-900 overflow-hidden h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-gray-800">
                {/* Left Side: Controls */}
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            Security Controls
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mt-1">Platform-wide enforcement</p>
                    </div>
                    <div className="p-6 space-y-4 flex-1">
                        {controls.map((control) => (
                            <div key={control.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary/20 transition-all duration-300">
                                <div className="flex items-start gap-3">
                                    <div className={classNames(
                                        "p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm",
                                        control.color
                                    )}>
                                        <control.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{control.label}</h4>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-0.5">{control.description}</p>
                                    </div>
                                </div>

                                <div className="flex-shrink-0 ml-2">
                                    {control.type === 'toggle' ? (
                                        <Switcher
                                            checked={control.value as boolean}
                                            onChange={(checked) => handleToggle(control.key as any, checked)}
                                        />
                                    ) : (
                                        <Select
                                            size="sm"
                                            className="min-w-[100px] text-xs"
                                            options={control.options}
                                            value={control.options?.find(opt => opt.value === control.value)}
                                            onChange={(opt: any) => handleToggle(control.key as any, opt.value)}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Policy Snapshot (Visualization) */}
                <div className="flex flex-col h-full bg-gray-50/30 dark:bg-gray-900/30">
                    <PolicySnapshot />
                </div>
            </div>
        </Card>
    )
}
