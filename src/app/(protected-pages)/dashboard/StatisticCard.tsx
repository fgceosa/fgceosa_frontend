/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react'
import classNames from '@/utils/classNames'

export type MetricType =
    | 'creditBalance'
    | 'apiRequests'
    | 'spending'
    | 'activeProjects'
    | 'totalMembers'
    | 'teamUsage'
    | 'sharedCredits'
    | 'invites'

type StatisticCardProps = {
    title: string
    value: number | ReactNode
    icon?: any
    iconClass?: string
    subtitle?: string
    label: any
    active?: boolean
    onClick: (label: any) => void
    className?: string
    trend?: string
}

export const StatisticCard = (props: StatisticCardProps) => {
    const { title, value, label, icon: Icon, iconClass, active, subtitle, onClick, className, trend } = props

    return (
        <button
            className={classNames(
                'group relative cursor-default outline-none transition-all duration-500 hover:-translate-y-1 h-full w-full',
                className
            )}
            onClick={() => onClick(label)}
        >
            {/* Background Gradient Glow */}
            <div className={classNames(
                "absolute -inset-0.5 rounded-[2rem] opacity-20 group-hover:opacity-40 transition duration-500 blur-xl",
                active ? "bg-[#0055BA]" : "bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900"
            )} />

            <div className={classNames(
                "relative flex flex-col p-6 bg-white dark:bg-gray-900 rounded-[1.8rem] border shadow-xl transition-all duration-500 overflow-hidden h-full",
                active
                    ? "border-primary/20 shadow-primary/10 dark:shadow-primary/5"
                    : "border-gray-100 dark:border-gray-800 shadow-gray-200/40 dark:shadow-none group-hover:shadow-2xl group-hover:shadow-primary/10"
            )}>
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-gray-50 dark:bg-gray-800/50 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-700" />

                <div className="flex items-start justify-between mb-6 relative z-10 w-full">
                    <div className={classNames(
                        "p-3 rounded-2xl border transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm",
                        active
                            ? "bg-primary text-white border-transparent"
                            : classNames("bg-blue-50 dark:bg-blue-900/20 text-primary border-blue-100/50 dark:border-blue-800/20", iconClass)
                    )}>
                        {Icon && (() => {
                            if (typeof Icon === 'function' || (typeof Icon === 'object' && Icon.$$typeof)) {
                                const IconComponent = Icon
                                return <IconComponent className="w-6 h-6" />
                            }
                            return Icon
                        })()}
                    </div>
                    {active && (
                        <div className="flex items-center gap-1.5 mt-0.5 relative z-10">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500">
                                Active
                            </span>
                        </div>
                    )}
                </div>

                <div className="space-y-1 relative z-10 text-left mt-auto">
                    <span className="text-[10px] font-black text-gray-900 dark:text-gray-100">{title}</span>
                    <div className="flex items-baseline gap-2">
                        <h3 className={classNames(
                            "text-xl sm:text-2xl font-black transition-colors duration-300",
                            active ? "text-primary" : "text-gray-900 dark:text-white group-hover:text-primary whitespace-nowrap"
                        )}>
                            {value}
                        </h3>
                        {trend && (
                            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                                {trend}
                            </span>
                        )}
                    </div>
                    {subtitle && (
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 italic mt-1">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Blue Brand Color Line (Always present as requested) */}
                <div className={classNames(
                    "absolute bottom-0 left-0 right-0 h-1 transition-all duration-500",
                    active ? "bg-primary opacity-100 shadow-[0_-4px_12px_rgba(0,85,186,0.4)]" : "bg-primary/20 opacity-0 group-hover:opacity-100"
                )} />
            </div>
        </button>
    )
}
