'use client'

import React from 'react'
import { Dropdown } from '@/components/ui'
import { Server, Users, Zap, Sun, Moon, Check } from 'lucide-react'
import { PiCurrencyNgn } from 'react-icons/pi'
import { NumericFormat } from 'react-number-format'
import classNames from '@/utils/classNames'
import type { PeriodMetrics } from '../types'
import StatisticCard from './StatisticCard'

type MetricType = 'totalRevenue' | 'systemHealth' | 'activeUsers' | 'tokenUsage'
type PeriodOption = 'weekly' | 'monthly' | 'annually' | 'byModel' | 'byOrg' | 'byCountry'

interface OverviewMetricsProps {
    metrics?: PeriodMetrics
    selectedMetric: MetricType
    onSelectMetric: (metric: MetricType) => void
    selectedPeriod: PeriodOption
    onSelectPeriod: (period: PeriodOption) => void
    periodOptions: { label: string; value: string }[]
    userName?: string
}

export default function OverviewMetrics({
    metrics,
    selectedMetric,
    onSelectMetric,
    selectedPeriod,
    onSelectPeriod,
    periodOptions,
    userName = 'User',
}: OverviewMetricsProps) {
    if (!metrics) return null

    const getGreetingObj = () => {
        const hour = new Date().getHours()
        if (hour < 12) return { text: 'Good Morning', icon: Sun }
        if (hour < 18) return { text: 'Good Afternoon', icon: Sun }
        return { text: 'Good Evening', icon: Moon }
    }

    const { text: greetingText, icon: GreetingIcon } = getGreetingObj()

    return (
        <div className="space-y-6">
            {/* Header and Select */}
            <div className="flex flex-col sm:flex-row items-end sm:items-end justify-between gap-6 pb-2">
                <div className="flex items-center gap-6 group">
                    <div className="relative">
                        <div className="absolute -inset-2 bg-gradient-to-r from-primary to-blue-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition duration-1000"></div>
                        <div className="relative w-16 h-16 rounded-2xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 flex items-center justify-center text-primary shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
                            <GreetingIcon className="w-8 h-8" strokeWidth={2.5} />
                        </div>
                    </div>
                    <div className="space-y-4 lg:space-y-1">
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-[10px] font-black text-primary whitespace-nowrap">Administration</span>
                            <div className="h-px w-12 bg-primary/20" />
                            <span className="text-[10px] font-black text-gray-400 whitespace-nowrap">Dashboard</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-none">
                                {greetingText}, <span className="text-primary">{userName}</span>
                            </h3>
                            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-100/50 dark:border-blue-800/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                <span className="text-[9px] font-black text-primary">Real-time</span>
                            </div>
                        </div>
                        <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 font-medium max-w-2xl leading-relaxed italic">
                            Executive Overview
                        </p>
                    </div>
                </div>

                <Dropdown
                    placement="bottom-end"
                    renderTitle={
                        <button
                            className="w-full min-w-[180px] h-10 flex items-center justify-between px-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
                        >
                            <div className="flex flex-col items-start overflow-hidden">
                                <span className="text-xs font-black text-gray-900 dark:text-gray-100 leading-none mb-1">Report Period</span>
                                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 truncate">
                                    {periodOptions.find(p => p.value === selectedPeriod)?.label || 'Select Period'}
                                </span>
                            </div>
                            <div className="w-5 h-5 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700">
                                <Check className="w-3 h-3 text-gray-400" strokeWidth={3} />
                            </div>
                        </button>
                    }
                >
                    <div className="py-2 w-[220px] bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-4 py-2 border-b border-gray-50 dark:border-gray-900/50 mb-1">
                            <span className="text-[9px] font-black text-gray-400">Select Timeline</span>
                        </div>
                        <div className="p-1 space-y-1">
                            {periodOptions.map((option) => (
                                <Dropdown.Item
                                    key={option.value}
                                    eventKey={option.value}
                                    onClick={() => onSelectPeriod(option.value as PeriodOption)}
                                    className={classNames(
                                        "flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full text-left",
                                        selectedPeriod === option.value
                                            ? "bg-[#0055BA]/5 text-[#0055BA]"
                                            : "hover:bg-gray-50 dark:hover:bg-gray-900"
                                    )}
                                >
                                    <span className="text-[10px] font-black">{option.label}</span>
                                    {selectedPeriod === option.value && <Check className="w-3 h-3 text-[#0055BA]" strokeWidth={3} />}
                                </Dropdown.Item>
                            ))}
                        </div>
                    </div>
                </Dropdown>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatisticCard
                    title="Total Revenue"
                    value={
                        <NumericFormat
                            displayType="text"
                            value={metrics.totalRevenue}
                            prefix={'₦'}
                            thousandSeparator={true}
                            decimalScale={0}
                        />
                    }
                    icon={PiCurrencyNgn}
                    active={selectedMetric === 'totalRevenue'}
                    onClick={() => onSelectMetric('totalRevenue')}
                    trend="↑ 12% vs last month"
                    subtitle="Global revenue stream"
                    iconClass="bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-100/50 dark:border-blue-800/20"
                />

                <StatisticCard
                    title="Total Workspaces"
                    value={
                        <NumericFormat
                            displayType="text"
                            value={metrics.activeUsers}
                            thousandSeparator={true}
                        />
                    }
                    icon={Users}
                    active={selectedMetric === 'activeUsers'}
                    onClick={() => onSelectMetric('activeUsers')}
                    trend="↑ 8% week-over-week"
                    subtitle="Active across platform"
                    iconClass="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border-indigo-100/50 dark:border-indigo-800/20"
                />

                <StatisticCard
                    title="Total API Requests"
                    value={
                        <NumericFormat
                            displayType="text"
                            value={metrics.apiRequests}
                            thousandSeparator={true}
                        />
                    }
                    icon={Server}
                    active={selectedMetric === 'systemHealth'}
                    onClick={() => onSelectMetric('systemHealth')}
                    trend=""
                    subtitle="Platform API requests"
                    iconClass="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100/50 dark:border-emerald-800/20"
                />

                <StatisticCard
                    title="Token Usage"
                    value={
                        <NumericFormat
                            displayType="text"
                            value={metrics.tokenUsage || 0}
                            thousandSeparator={true}
                        />
                    }
                    icon={Zap}
                    active={selectedMetric === 'tokenUsage'}
                    onClick={() => onSelectMetric('tokenUsage')}
                    trend="Below expected usage"
                    trendType="warning"
                    subtitle="Aggregated tokens"
                    iconClass="bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100/50 dark:border-amber-800/20"
                />
            </div>
        </div>
    )
}
