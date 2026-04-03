'use client'

import { useSelector } from 'react-redux'
import { NumericFormat } from 'react-number-format'
import { LayoutGrid, Activity, Zap, Clock, ShieldCheck, AlertCircle } from 'lucide-react'
import classNames from '@/utils/classNames'
import { selectProjects } from '@/store/slices/projects'

interface StatCardProps {
    title: string
    value: React.ReactNode
    subtitle: string
    icon: any
    colorClass: string
    hoverGradient: string
    trend?: string
}

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
        <div className="group relative h-full transition-all duration-300 hover:-translate-y-1">
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
                    <span className="text-xs font-black text-gray-900 dark:text-gray-100 tracking-tight">{title}</span>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight group-hover:text-primary transition-colors duration-300">
                            {value}
                        </h3>
                        {trend && (
                            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-100/50 dark:border-emerald-500/20">
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

export default function ProjectsSummary() {
    const projects = useSelector(selectProjects)

    const activeProjectsCount = projects.filter(p => p.status === 'active').length
    const totalRequests = projects.reduce((acc, curr) => acc + (curr.totalRequests || 0), 0)
    const totalTokens = projects.reduce((acc, curr) => acc + (curr.totalTokens || 0), 0)

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
                title="All Projects"
                value={<NumericFormat displayType="text" value={projects.length} thousandSeparator />}
                subtitle="Aggregated initiatives"
                icon={LayoutGrid}
                colorClass="bg-blue-50 dark:bg-blue-900/20 text-blue-500 border-blue-100/50 dark:border-blue-800/20"
                hoverGradient="bg-gradient-to-r from-blue-400 to-cyan-300"
                trend="STABLE"
            />

            <StatCard
                title="Active Projects"
                value={<NumericFormat displayType="text" value={activeProjectsCount} thousandSeparator />}
                subtitle="Currently operational"
                icon={ShieldCheck}
                colorClass="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 border-emerald-100/50 dark:border-emerald-800/20"
                hoverGradient="bg-gradient-to-r from-emerald-400 to-teal-300"
                trend="ACTIVE"
            />

            <StatCard
                title="Total API Calls"
                value={<NumericFormat displayType="text" value={totalRequests} thousandSeparator />}
                subtitle="Request volume"
                icon={Activity}
                colorClass="bg-amber-50 dark:bg-amber-900/20 text-amber-500 border-amber-100/50 dark:border-amber-800/20"
                hoverGradient="bg-gradient-to-r from-amber-400 to-yellow-300"
            />

            <StatCard
                title="Total Tokens"
                value={<NumericFormat displayType="text" value={totalTokens} thousandSeparator />}
                subtitle="Data processed"
                icon={Zap}
                colorClass="bg-purple-50 dark:bg-purple-900/20 text-purple-500 border-purple-100/50 dark:border-purple-800/20"
                hoverGradient="bg-gradient-to-r from-purple-400 to-fuchsia-300"
                trend="VOLUME"
            />
        </div>
    )
}
