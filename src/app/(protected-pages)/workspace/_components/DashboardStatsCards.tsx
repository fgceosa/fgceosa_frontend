'use client'

import { Card } from '@/components/ui'
import classNames from '@/utils/classNames'
import { useAppSelector } from '@/store'
import { selectPlatformSettingsData } from '@/store/slices/platformSettings'
import {
    NAIRA_TO_CREDIT_RATE,
    CURRENCY_SYMBOL,
} from '@/constants/currency.constant'
import {
    Wallet,
    Users,
    Activity,
    TrendingUp,
    TrendingDown,
    Zap,
    Target,
} from 'lucide-react'
import type { WorkspaceDashboardStats } from '../types'

interface DashboardStatsCardsProps {
    stats: WorkspaceDashboardStats | null
    isLoading?: boolean
}

interface StatCardProps {
    title: string
    value: string | number
    subtext?: string
    icon: React.ReactNode
    iconColor: string
    iconBgColor: string
}

function StatCard({
    title,
    value,
    subtext,
    icon,
    iconColor,
    iconBgColor,
}: StatCardProps) {
    return (
        <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-[2rem] opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
            <div className="relative flex flex-col p-6 bg-white dark:bg-gray-900 rounded-[1.8rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none overflow-hidden h-full">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-gray-50 dark:bg-gray-800/50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700" />

                <div className="flex items-start justify-between mb-6 relative z-10 w-full">
                    <div
                        className={classNames(
                            'p-3 rounded-2xl border transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm',
                            'bg-blue-50 dark:bg-blue-900/20 text-primary border-blue-100/50 dark:border-blue-800/20',
                            iconBgColor,
                            iconColor,
                        )}
                    >
                        {icon}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 relative z-10">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-black text-gray-900 dark:text-gray-100">
                            Active
                        </span>
                    </div>
                </div>

                <div className="space-y-1 relative z-10 text-left">
                    <span className="text-xs font-black text-gray-900 dark:text-gray-100">
                        {title}
                    </span>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight group-hover:text-primary transition-colors">
                            {value}
                        </h3>
                    </div>
                    {subtext && (
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 italic mt-1">
                            {subtext}
                        </p>
                    )}
                </div>

                {/* Blue Brand Color Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20 opacity-0 group-hover:opacity-100 transition-all duration-500" />
            </div>
        </div>
    )
}

function SkeletonCard() {
    return (
        <Card className="p-0 border-none shadow-xl bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="p-4 animate-pulse space-y-3">
                <div className="flex justify-between">
                    <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-xl" />
                    <div className="w-16 h-4 bg-gray-100 dark:bg-gray-800 rounded-full" />
                </div>
                <div className="space-y-1.5">
                    <div className="h-2.5 w-20 bg-gray-100 dark:bg-gray-800 rounded" />
                    <div className="h-6 w-28 bg-gray-100 dark:bg-gray-800 rounded" />
                </div>
                <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />
                <div className="h-2.5 w-36 bg-gray-100 dark:bg-gray-800 rounded" />
            </div>
        </Card>
    )
}

export default function DashboardStatsCards({
    stats,
    isLoading,
}: DashboardStatsCardsProps) {
    // hooks must be called unconditionally at top level
    const platformSettings = useAppSelector(selectPlatformSettingsData)

    if (isLoading || !stats || stats.creditsBalance === undefined) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        )
    }

    // Parse string values to numbers
    const creditsBalance = parseFloat(stats.creditsBalance)
    const creditsUsedToday = parseFloat(stats.creditsUsedToday)
    const creditsUsedThisMonth = parseFloat(stats.creditsUsedThisMonth)
    const creditBurnRate = parseFloat(stats.creditBurnRate)
    const successRate = parseFloat(stats.successRate)
    const minAmount = platformSettings?.payments?.minCreditAmount || 1000
    const exchangeRate =
        platformSettings?.payments?.nairaToCreditRate || NAIRA_TO_CREDIT_RATE

    // Calculate naira equivalent (₦1,650 = 1 AI Credit)
    const creditsInNaira = creditsBalance * NAIRA_TO_CREDIT_RATE

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Members */}
            <StatCard
                title="Active Members"
                value={`${stats.totalMembers}`}
                subtext="Total workspace users"
                icon={<Users className="w-5 h-5" />}
                iconColor="text-blue-600 dark:text-blue-400"
                iconBgColor="bg-blue-50 dark:bg-blue-900/20"
            />

            {/* Current Usage (Monthly) */}
            <StatCard
                title="Current Usage"
                value={`${CURRENCY_SYMBOL}${(creditsUsedThisMonth * NAIRA_TO_CREDIT_RATE).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                subtext="Spent this month"
                icon={<Activity className="w-5 h-5" />}
                iconColor="text-orange-600 dark:text-orange-400"
                iconBgColor="bg-orange-50 dark:bg-orange-900/20"
            />

            {/* AI Requests */}
            <StatCard
                title="AI Requests"
                value={stats.totalApiCalls.toLocaleString()}
                subtext="Total requests"
                icon={<Zap className="w-5 h-5" />}
                iconColor="text-yellow-600 dark:text-yellow-400"
                iconBgColor="bg-yellow-50 dark:bg-yellow-900/20"
            />

            {/* Daily Usage */}
            <StatCard
                title="Used Today"
                value={`${CURRENCY_SYMBOL}${(creditsUsedToday * NAIRA_TO_CREDIT_RATE).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                subtext="Last 24 hours"
                icon={<TrendingUp className="w-5 h-5" />}
                iconColor="text-indigo-600 dark:text-indigo-400"
                iconBgColor="bg-indigo-50 dark:bg-indigo-900/20"
            />
        </div>
    )
}
