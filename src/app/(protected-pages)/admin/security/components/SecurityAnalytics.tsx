'use client'

import { Shield, AlertTriangle, Lock, Activity } from 'lucide-react'
import classNames from '@/utils/classNames'
import { useSecurityStats } from '../hooks'

/**
 * Props for the StatCard component
 */
interface StatCardProps {
    title: string
    value: string | number
    subtitle: string
    icon: React.ComponentType<{ className?: string }>
    colorClass: string
    hoverGradient: string
    trend?: string
}

/**
 * StatCard - Individual security statistic card with hover effects
 */
function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    colorClass,
    hoverGradient,
    trend
}: StatCardProps) {
    return (
        <div className="group relative cursor-pointer h-full transition-all duration-300 hover:-translate-y-1">
            {/* Hover Gradient Glow */}
            <div className={classNames(
                "absolute -inset-0.5 rounded-[2rem] opacity-0 group-hover:opacity-30 transition duration-500 blur-xl",
                hoverGradient
            )} />

            <div className="relative flex flex-col p-6 bg-white dark:bg-gray-900 rounded-[1.8rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none group-hover:shadow-2xl group-hover:shadow-primary/10 dark:group-hover:shadow-primary/5 transition-all duration-500 overflow-hidden h-full">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-gray-50 dark:bg-gray-800/50 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-700" />

                <div className="flex items-start justify-between mb-6 relative z-10">
                    <div className={classNames(
                        "p-3 rounded-2xl border transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm",
                        colorClass
                    )}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>

                <div className="space-y-1 relative z-10 mt-auto">
                    <span className="text-xs font-black text-gray-600 dark:text-gray-400">{title}</span>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight group-hover:text-primary transition-colors duration-300">
                            {value}
                        </h3>
                        {trend && (
                            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                                {trend}
                            </span>
                        )}
                    </div>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 italic">
                        {subtitle}
                    </p>
                </div>
            </div>
        </div>
    )
}

/**
 * SecurityAnalytics - Dashboard overview cards showing key security metrics
 */
export default function SecurityAnalytics() {
    const { stats, loading } = useSecurityStats()

    if (loading && !stats) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-40 bg-gray-100 dark:bg-gray-800 rounded-[2rem]" />
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Active Threats"
                value={stats?.activeThreats || 0}
                subtitle="Requires immediate action"
                icon={AlertTriangle}
                colorClass="bg-rose-50 dark:bg-rose-900/20 text-rose-500 border-rose-100/50 dark:border-rose-800/20"
                hoverGradient="bg-gradient-to-r from-rose-400 to-pink-300"
                trend="DANGER"
            />

            <StatCard
                title="High Priority"
                value={stats?.highPriority || 0}
                subtitle="Critical incidents"
                icon={Shield}
                colorClass="bg-orange-50 dark:bg-orange-900/20 text-orange-500 border-orange-100/50 dark:border-orange-800/20"
                hoverGradient="bg-gradient-to-r from-orange-400 to-amber-300"
            />

            <StatCard
                title="API Abuse"
                value={stats?.apiAbuseAttempts || 0}
                subtitle="Blocked attempts today"
                icon={Lock}
                colorClass="bg-amber-50 dark:bg-amber-900/20 text-amber-500 border-amber-100/50 dark:border-amber-800/20"
                hoverGradient="bg-gradient-to-r from-amber-400 to-yellow-300"
            />

            <StatCard
                title="Fraud Patterns"
                value={stats?.fraudIncidents || 0}
                subtitle="Detected anomalies"
                icon={Activity}
                colorClass="bg-blue-50 dark:bg-blue-900/20 text-blue-500 border-blue-100/50 dark:border-blue-800/20"
                hoverGradient="bg-gradient-to-r from-blue-400 to-cyan-300"
                trend="MONITORED"
            />
        </div>
    )
}
