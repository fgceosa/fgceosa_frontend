'use client'

import { Card } from '@/components/ui'
import { Activity, Zap, Clock, Battery } from 'lucide-react'
import type { UsageMetrics as UsageMetricsType } from '@/app/(protected-pages)/dashboard/projects/types'
import { NumericFormat } from 'react-number-format'
import classNames from '@/utils/classNames'

interface UsageMetricsProps {
    metrics: UsageMetricsType
}

interface StatCardProps {
    title: string
    value: React.ReactNode
    subtitle: string
    icon: any
    colorClass: string
    trend?: string
}

function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    colorClass,
    trend
}: StatCardProps) {
    return (
        <div className="group relative h-full">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-[2.5rem] opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
            <div className="relative flex flex-col p-8 bg-white dark:bg-gray-950 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-md shadow-gray-200/40 dark:shadow-none overflow-hidden h-full transition-all duration-500 hover:scale-[1.02]">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-gray-50 dark:bg-gray-800/50 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-700" />

                {/* Glowing Blur Background */}
                <div className={classNames(
                    "absolute -bottom-24 -left-24 w-48 h-48 blur-3xl rounded-full opacity-5 transition-opacity duration-700 group-hover:opacity-10",
                    colorClass.includes('blue') ? 'bg-primary' :
                        colorClass.includes('amber') ? 'bg-amber-500' :
                            colorClass.includes('emerald') ? 'bg-emerald-500' :
                                colorClass.includes('purple') ? 'bg-purple-500' : 'bg-primary'
                )} />

                <div className="flex items-start justify-between mb-8 relative z-10">
                    <div className={classNames(
                        "p-3.5 rounded-2xl border flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm",
                        colorClass
                    )}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>

                <div className="space-y-2 relative z-10 mt-auto">
                    <span className="text-[10px] font-black text-gray-900 dark:text-gray-200">{title}</span>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                            {value}
                        </h3>
                        {trend && (
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-100/50 dark:border-emerald-500/20">
                                {trend}
                            </span>
                        )}
                    </div>
                    <p className="text-xs font-bold text-gray-400 italic">
                        {subtitle}
                    </p>
                </div>
            </div>
        </div>
    )
}

function CostStatCard({ metrics }: UsageMetricsProps) {
    const totalCost = parseFloat(metrics.totalCost) || 0
    const totalNaira = totalCost * 1500

    return (
        <StatCard
            title="Total Cost"
            value={
                <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black text-emerald-600">₦</span>
                    <NumericFormat displayType="text" value={totalNaira.toFixed(2)} thousandSeparator />
                </div>
            }
            subtitle="Total amount spent"
            icon={Battery}
            colorClass="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100/50 dark:border-emerald-800/20"
        />
    )
}

export default function UsageMetrics({ metrics }: UsageMetricsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Total API Requests"
                value={<NumericFormat displayType="text" value={metrics.totalCalls} thousandSeparator />}
                subtitle="Number of times used"
                icon={Activity}
                colorClass="bg-blue-50 dark:bg-blue-900/20 text-primary border-blue-100/50 dark:border-blue-800/20"
            />

            <StatCard
                title="Total Tokens Used"
                value={<NumericFormat displayType="text" value={metrics.totalTokens} thousandSeparator />}
                subtitle="Total data processed"
                icon={Zap}
                colorClass="bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100/50 dark:border-amber-800/20"
            />

            <CostStatCard metrics={metrics} />

            <StatCard
                title="Response Time"
                value={`${Math.round(metrics.avgResponseTimeMs)}ms`}
                subtitle="Average speed"
                icon={Clock}
                colorClass="bg-purple-50 dark:bg-purple-900/20 text-purple-600 border-purple-100/50 dark:border-purple-800/20"
            />
        </div>
    )
}
