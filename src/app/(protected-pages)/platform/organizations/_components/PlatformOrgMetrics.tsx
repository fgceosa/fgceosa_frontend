'use client'

import React from 'react'
import { Card } from '@/components/ui'
import {
    Users,
    CheckCircle2,
    AlertCircle,
    Ban,
    TrendingUp,
    Building2,
    Activity
} from 'lucide-react'
import classNames from '@/utils/classNames'
import type { PlatformOrgAnalytics } from '../types'

interface PlatformOrgMetricsProps {
    analytics?: PlatformOrgAnalytics
    loading: boolean
}

export default function PlatformOrgMetrics({ analytics, loading }: PlatformOrgMetricsProps) {
    const metrics = [
        {
            label: 'Total Organizations',
            value: analytics?.totalOrganizations || 0,
            icon: Building2,
            color: 'text-blue-600',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            borderColor: 'border-blue-100/50 dark:border-blue-800/20',
            status: 'all',
            subtitle: 'Platform-wide count'
        },
        {
            label: 'Active Organizations',
            value: analytics?.activeOrganizations || 0,
            icon: Activity,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            borderColor: 'border-emerald-100/50 dark:border-emerald-800/20',
            status: 'active',
            subtitle: 'Currently operational'
        },
        {
            label: 'Over-Limit Usage',
            value: analytics?.overLimitOrganizations || 0,
            icon: AlertCircle,
            color: 'text-amber-600',
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            borderColor: 'border-amber-100/50 dark:border-amber-800/20',
            status: 'paused',
            subtitle: 'Exceeding limits'
        },
        {
            label: 'Suspended',
            value: analytics?.suspendedOrganizations || 0,
            icon: Ban,
            color: 'text-rose-600',
            bg: 'bg-rose-50 dark:bg-rose-900/20',
            borderColor: 'border-rose-100/50 dark:border-rose-800/20',
            status: 'disabled',
            subtitle: 'Access restricted'
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((stat) => (
                <div key={stat.label} className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-[2rem] opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                    <div className="relative flex flex-col p-6 bg-white dark:bg-gray-900 rounded-[1.8rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none overflow-hidden h-full">
                        <div className="flex items-start justify-between mb-6 relative z-10">
                            <div className={classNames(
                                "p-3 rounded-2xl border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                                stat.bg, stat.color, stat.borderColor
                            )}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5 relative z-10">
                                <div className={classNames(
                                    "w-1.5 h-1.5 rounded-full animate-pulse",
                                    stat.status === 'active' ? "bg-emerald-500" :
                                        stat.status === 'paused' ? "bg-amber-500" :
                                            stat.status === 'disabled' ? "bg-rose-500" : "bg-gray-500"
                                )} />
                                <span className="text-[10px] font-black text-gray-400 capitalize">
                                    {stat.status}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-1 relative z-10">
                            <span className="text-[10px] font-black text-gray-900 dark:text-white">{stat.label}</span>
                            {loading ? (
                                <div className="h-8 w-20 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
                            ) : (
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                                    {stat.value.toLocaleString()}
                                </h3>
                            )}
                            <p className="text-xs font-bold text-gray-400 italic">{stat.subtitle}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
