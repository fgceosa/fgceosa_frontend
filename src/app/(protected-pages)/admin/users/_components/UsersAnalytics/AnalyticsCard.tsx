import React, { ReactNode } from 'react'
import classNames from '@/utils/classNames'

interface AnalyticsCardProps {
    title: string
    value: string | number
    icon: ReactNode
    trend?: {
        value: string
        isPositive: boolean
    }
    bgColor: string
    iconColor: string
    description?: string
    className?: string
}

export default function AnalyticsCard({
    title,
    value,
    icon,
    trend,
    bgColor,
    iconColor,
    description,
    className
}: AnalyticsCardProps) {
    return (
        <div className={classNames("relative group bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none hover:shadow-2xl transition-all duration-500 overflow-hidden", className)}>
            <div className={classNames(
                "absolute -top-10 -right-10 w-32 h-32 blur-3xl rounded-full opacity-20 transition-all duration-700 group-hover:scale-150",
                bgColor
            )} />

            <div className="relative z-10 flex items-start justify-between">
                <div className="space-y-4">
                    <div className={classNames(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3",
                        bgColor,
                        iconColor
                    )}>
                        {icon}
                    </div>
                    <div>
                        <div className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
                            {title}
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h4 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
                                {value}
                            </h4>
                            {trend && (
                                <span className={classNames(
                                    "text-[10px] font-black",
                                    trend.isPositive ? "text-emerald-500" : "text-rose-500"
                                )}>
                                    {trend.isPositive ? '↑' : '↓'} {trend.value}
                                </span>
                            )}
                        </div>
                        {description && (
                            <p className="text-[10px] font-medium text-gray-400 mt-1 italic">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
