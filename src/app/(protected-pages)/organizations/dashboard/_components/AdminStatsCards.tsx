'use client'

import React from 'react'
import classNames from '@/utils/classNames'
import {
    Activity,
    Zap,
    Users,
    Building2,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react'
import { NAIRA_TO_USD_RATE, CURRENCY_SYMBOL } from '@/constants/currency.constant'

interface AdminStatsProps {
    workspacesCount: number
    activeMembersCount: number
    totalUsage: number
    aiRequests?: string | number
    isLoading?: boolean
}

function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    colorClass,
    trend,
    status = 'active'
}: any) {
    return (
        <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-[2rem] opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
            <div className="relative flex flex-col p-6 bg-white dark:bg-gray-900 rounded-[1.8rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none overflow-hidden h-full">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-gray-50 dark:bg-gray-800/50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700" />

                <div className="flex items-start justify-between mb-6 relative z-10 w-full">
                    <div className={classNames(
                        "p-3 rounded-2xl border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                        colorClass
                    )}>
                        <Icon className="w-6 h-6" />
                    </div>

                </div>

                <div className="space-y-1 relative z-10 text-left">
                    <span className="text-xs font-black text-gray-900 dark:text-gray-100">{title}</span>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight group-hover:text-primary transition-colors truncate">
                            {value}
                        </h3>
                        {trend && (
                            <span className={classNames(
                                "text-xs font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5",
                                trend.isUp ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" : "text-rose-500 bg-rose-50 dark:bg-rose-500/10"
                            )}>
                                {trend.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {trend.value}
                            </span>
                        )}
                    </div>
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 italic mt-1 opacity-80">
                        {subtitle}
                    </p>
                </div>
            </div>
        </div>
    )
}

function SkeletonCard() {
    return (
        <div className="relative flex flex-col p-6 bg-white dark:bg-gray-900 rounded-[1.8rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 animate-pulse">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-6" />
            <div className="space-y-2">
                <div className="h-2 w-16 bg-gray-100 dark:bg-gray-800 rounded" />
                <div className="h-6 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
                <div className="h-2 w-32 bg-gray-100 dark:bg-gray-800 rounded" />
            </div>
        </div>
    )
}

interface AdminStatsProps {
    workspacesCount: number
    activeMembersCount: number
    totalUsage: number
    aiRequests?: string | number
    isLoading?: boolean
    requestsTrend?: { value: string, isUp: boolean }
    usageTrend?: { value: string, isUp: boolean }
}

export default function AdminStatsCards({
    workspacesCount,
    activeMembersCount,
    totalUsage,
    aiRequests = '0',
    isLoading,
    requestsTrend,
    usageTrend
}: AdminStatsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <StatCard
                title="Workspaces"
                value={workspacesCount}
                subtitle="Active Environments"
                icon={Building2}
                colorClass="bg-blue-50 dark:bg-blue-900/20 text-primary border-blue-100/50 dark:border-blue-800/20"
                status="active"
            />
            <StatCard
                title="Members"
                value={activeMembersCount}
                subtitle="Total active users"
                icon={Users}
                colorClass="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border-indigo-100/50 dark:border-indigo-800/20"
                status="active"
            />
            <StatCard
                title="AI Requests"
                value={aiRequests}
                subtitle="Total API interactions"
                icon={Zap}
                colorClass="bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100/50 dark:border-amber-800/20"
                status="normal"
                trend={requestsTrend}
            />
            <StatCard
                title="Usage (Mo)"
                value={`${CURRENCY_SYMBOL}${new Intl.NumberFormat('en-NG', { notation: "compact", maximumFractionDigits: 1 }).format((totalUsage || 0) * NAIRA_TO_USD_RATE)}`}
                subtitle="Credits consumed"
                icon={Activity}
                colorClass="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100/50 dark:border-emerald-800/20"
                status="active"
                trend={usageTrend}
            />
        </div>
    )
}
