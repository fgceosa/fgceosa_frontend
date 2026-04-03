'use client'

import { useSelector } from 'react-redux'
import { NumericFormat } from 'react-number-format'
import { Key, Activity, ShieldCheck, AlertCircle, Zap, TrendingUp, Clock } from 'lucide-react'
import classNames from '@/utils/classNames'
import { selectApiKeysStats } from '@/store/slices/apiKeys'
import { NAIRA_TO_USD_RATE } from '@/constants/currency.constant'

interface StatCardProps {
    title: string
    value: React.ReactNode
    subtitle: string
    icon: any
    colorClass: string
    trend?: string
    status?: 'normal' | 'warning' | 'critical'
}

function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    colorClass,
    trend,
    status = 'normal'
}: StatCardProps) {
    return (
        <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-[2rem] opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
            <div className="relative flex flex-col p-6 bg-white dark:bg-gray-900 rounded-[1.8rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none overflow-hidden h-full">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-gray-50 dark:bg-gray-800/50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700" />

                <div className="flex items-start justify-between mb-6 relative z-10">
                    <div className={classNames(
                        "p-3 rounded-2xl border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                        colorClass
                    )}>
                        <Icon className="w-6 h-6" />
                    </div>

                </div>

                <div className="space-y-1 relative z-10">
                    <span className="text-xs font-black text-gray-900 dark:text-gray-200">{title}</span>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                            {value}
                        </h3>
                        {trend && (
                            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                                {trend}
                            </span>
                        )}
                    </div>
                    <p className="text-sm font-bold text-gray-400 italic">
                        {subtitle}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function ApiKeysSummary() {
    const stats = useSelector(selectApiKeysStats)

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
                title="Total Keys"
                value={<NumericFormat displayType="text" value={stats.totalKeys} thousandSeparator />}
                subtitle={`${stats.activeKeys} Keys currently active`}
                icon={Key}
                colorClass="bg-blue-50 dark:bg-blue-900/20 text-primary border-blue-100/50 dark:border-blue-800/20"
                trend="STABLE"
            />

            <StatCard
                title="Total Requests"
                value={<NumericFormat displayType="text" value={stats.totalRequests} thousandSeparator />}
                subtitle="Total API calls made"
                icon={Activity}
                colorClass="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border-indigo-100/50 dark:border-indigo-800/20"
                trend="ACTIVE"
            />

            <StatCard
                title="API Usage"
                value={<NumericFormat displayType="text" value={stats.totalUsage * NAIRA_TO_USD_RATE} thousandSeparator decimalScale={2} prefix="₦" />}
                subtitle="Volume of credits consumed"
                icon={Zap}
                colorClass="bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100/50 dark:border-amber-800/20"
                trend="STABLE"
            />

            <StatCard
                title="Avg Latency"
                value="458ms"
                subtitle="System-wide metrics"
                icon={Clock}
                colorClass="bg-rose-50 dark:bg-rose-900/10 text-rose-600 border-rose-100/50 dark:border-rose-800/10"
                trend="OPTIMAL"
            />
        </div>
    )
}
