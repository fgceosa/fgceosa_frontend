'use client'

import React from 'react'
import classNames from '@/utils/classNames'
import { Tooltip } from '@/components/ui'
import { Info, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface KPIStatCardProps {
    title: string
    value: React.ReactNode
    subtitle: string
    icon: any
    colorClass: string
    trend?: {
        value: number
        direction: 'up' | 'down' | 'neutral'
    }
    status?: 'active' | 'warning' | 'normal'
    tooltipContent: string
}

/**
 * KPIStatCard - A reusable card for displaying key performance indicators.
 * Features trend indicators, status pulses, and educational tooltips.
 */
export const KPIStatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    colorClass,
    trend,
    status = 'normal',
    tooltipContent
}: KPIStatCardProps) => {
    return (
        <div className="group relative">
            {/* Decorative background gradient */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-[2rem] opacity-20 group-hover:opacity-40 transition duration-500 blur" />

            <div className="relative flex flex-col p-6 bg-white dark:bg-gray-900 rounded-[1.8rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none overflow-hidden h-full">
                {/* Decorative floating orb */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-gray-50 dark:bg-gray-800/50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700" />

                <header className="flex items-start justify-between mb-6 relative z-10">
                    <div className={classNames(
                        "p-3 rounded-2xl border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                        colorClass
                    )}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-end gap-2 text-right">
                        {status && status !== 'normal' && (
                            <div className="flex items-center gap-1.5 mt-0.5 relative z-10">
                                <div className={classNames(
                                    "w-1.5 h-1.5 rounded-full animate-pulse",
                                    status === 'active' ? "bg-emerald-500" : status === 'warning' ? "bg-rose-500" : "bg-blue-500"
                                )} />
                                <span className="text-[10px] font-black text-gray-400 whitespace-nowrap">
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </span>
                            </div>
                        )}
                        <Tooltip title={tooltipContent}>
                            <Info className="w-3.5 h-3.5 text-gray-300 hover:text-primary cursor-help transition-colors" />
                        </Tooltip>
                    </div>
                </header>

                <div className="space-y-1 relative z-10">
                    <span className="text-[10px] font-black text-gray-400">{title}</span>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                            {value}
                        </h3>
                        {trend && trend.direction !== 'neutral' && (
                            <span className={classNames(
                                "text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5",
                                trend.direction === 'up' ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" : "text-rose-500 bg-rose-50 dark:bg-rose-500/10"
                            )}>
                                {trend.direction === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {Math.abs(trend.value)}%
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
