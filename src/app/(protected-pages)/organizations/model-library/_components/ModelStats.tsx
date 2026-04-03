'use client'

import React from 'react'
import { useSelector } from 'react-redux'
import {
    Box,
    Zap,
    Banknote,
    Star
} from 'lucide-react'
import { selectOrgModelAnalytics } from '@/store/slices/orgModelLibrary/selectors'
import { NAIRA_TO_USD_RATE, CURRENCY_SYMBOL } from '@/constants/currency.constant'
import classNames from '@/utils/classNames'

const AnalyticsCard = ({
    title,
    value,
    icon: Icon,
    colorClass,
    subtext,
}: {
    title: string;
    value: string | number;
    icon: any;
    colorClass: string;
    subtext: string;
}) => (
    <div className="group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-[2rem] opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
        <div className="relative flex flex-col p-6 bg-white dark:bg-gray-900 rounded-[1.8rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none overflow-hidden h-full">
            <div className="flex items-start justify-between mb-6 relative z-10">
                <div className={classNames(
                    "p-3 rounded-2xl border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 flex items-center justify-center bg-opacity-10",
                    colorClass.replace('bg-', 'text-'),
                    colorClass.replace('bg-', 'bg-').replace('-600', '-50'),
                    "border-" + colorClass.split('-')[1] + "-100/50"
                )}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <div className="space-y-1 relative z-10">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{title}</span>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                    {value}
                </h3>
                <p className="text-xs font-bold text-gray-400 italic mt-1">{subtext}</p>
            </div>
        </div>
    </div>
)

const ModelStats = () => {
    const analytics = useSelector(selectOrgModelAnalytics)

    // Formatting helper
    const formatCurrency = (amountInUsd: number) => {
        const amountInNaira = amountInUsd * NAIRA_TO_USD_RATE
        return `${CURRENCY_SYMBOL}${new Intl.NumberFormat('en-NG', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amountInNaira)}`
    }

    const stats = [
        {
            title: "Enabled Models",
            value: analytics?.enabledCount ?? 0,
            icon: Box,
            colorClass: "bg-blue-600",
            subtext: "total approved"
        },
        {
            title: "Active in Workspace",
            value: analytics?.activeCount ?? 0,
            icon: Zap,
            colorClass: "bg-emerald-600",
            subtext: "Used in last 30 days"
        },
        {
            title: "Est. Monthly Spend",
            value: analytics ? formatCurrency(analytics.totalSpend) : `${CURRENCY_SYMBOL}0`,
            icon: Banknote,
            colorClass: "bg-amber-600",
            subtext: analytics ? `${analytics.spendChangePercentage > 0 ? '+' : ''}${analytics.spendChangePercentage}% from last month` : "Calculated monthly"
        },
        {
            title: "Most Popular",
            value: analytics?.mostPopularModelName ?? "-",
            icon: Star,
            colorClass: "bg-purple-600",
            subtext: "Top copilot choice"
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <AnalyticsCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    colorClass={stat.colorClass}
                    subtext={stat.subtext}
                />
            ))}
        </div>
    )
}

export default ModelStats
