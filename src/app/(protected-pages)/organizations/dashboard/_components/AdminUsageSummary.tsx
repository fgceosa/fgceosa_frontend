'use client'

import React from 'react'
import { Card } from '@/components/ui'
import {
    TrendingUp,
    BarChart3,
    Zap,
    Activity,
    ArrowUpRight,
    Info,
    Clock,
    Cpu,
    MousePointer2,
    Sparkles,
    Users
} from 'lucide-react'
import classNames from '@/utils/classNames'

interface AdminUsageSummaryProps {
    totalTokens?: number
    totalMembers?: number
    workspacesCount?: number
    successRate?: number
    avgLatency?: number
    dailyUsage?: { date: string, tokens: number, requests: number }[]
    usageTrend?: { value: string, isUp: boolean }
}

export default function AdminUsageSummary({
    totalTokens,
    totalMembers,
    workspacesCount,
    successRate,
    avgLatency,
    dailyUsage,
    usageTrend
}: AdminUsageSummaryProps) {
    const metrics = [
        { label: 'Avg Latency', value: avgLatency ? `${Math.round(avgLatency)}ms` : '340ms', change: '-12%', icon: Clock, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
        { label: 'Success Rate', value: successRate ? `${successRate.toFixed(1)}%` : '98.2%', change: '+0.4%', icon: Cpu, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
        { label: 'Total Members', value: totalMembers?.toString() || '0', change: '+2', icon: Users, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    ]

    const historicalData = dailyUsage ? dailyUsage.map(d => d.tokens) : [32, 45, 38, 52, 60, 48, 75, 68, 82, 95, 88, 110]

    return (
        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 p-8 h-full relative overflow-hidden group/main">
            {/* Background Aesthetic Blur */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mt-32 blur-3xl opacity-50 group-hover/main:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary" />
                            <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                                Usage Analytics
                            </h3>
                        </div>
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-400 ml-7">Enterprise Resource Pulse</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-primary/40" />
                                </div>
                            ))}
                        </div>
                        <span className="text-xs font-black text-gray-900 dark:text-white">+{workspacesCount || 0} Active Workspaces</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Primary Chart Area */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="p-8 bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-[2rem] relative overflow-hidden transition-all hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none">
                            <div className="flex items-end justify-between mb-8">
                                <div className="space-y-2">
                                    <div className={classNames(
                                        "flex items-center gap-2 px-2 py-1 rounded-lg w-fit",
                                        usageTrend?.isUp ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                                    )}>
                                        <TrendingUp className={classNames("w-3 h-3", !usageTrend?.isUp && "rotate-180")} />
                                        <span className="text-xs font-black">
                                            Growth {usageTrend?.isUp ? '+' : '-'}{usageTrend?.value || '0%'}
                                        </span>
                                    </div>
                                    <div className="flex items-baseline gap-3">
                                        <h4 className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tighter">
                                            {totalTokens
                                                ? new Intl.NumberFormat('en-US').format(totalTokens)
                                                : '1.24M'}
                                        </h4>
                                        <span className="text-sm font-bold text-gray-400 dark:text-gray-500">Tokens</span>
                                    </div>
                                    <p className="text-xs font-black text-gray-400 dark:text-gray-500">Total Consumption Period: 30 Days</p>
                                </div>
                                <div className="hidden sm:block">
                                    <div className="flex items-center gap-4 text-right">
                                        <div>
                                            <p className="text-xs font-black text-gray-400 dark:text-gray-500 mb-1">Peak Demand</p>
                                            <p className="text-sm font-black text-gray-900 dark:text-white">124.5K/day</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Advanced Trend Visualizer */}
                            <div className="flex items-end gap-2 h-40 pt-4 relative group">
                                {(() => {
                                    const maxVal = Math.max(...historicalData, 1)
                                    return historicalData.map((val, i) => {
                                        const heightPercent = (val / maxVal) * 100
                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                                                <div
                                                    className={classNames(
                                                        "w-full rounded-t-xl transition-all duration-500 cursor-pointer relative group/bar flex flex-col justify-end overflow-hidden",
                                                        i === historicalData.length - 1 ? "bg-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]" : "bg-primary/20 hover:bg-primary/40"
                                                    )}
                                                    style={{ height: `${heightPercent}%` }}
                                                >
                                                    <div className="w-full h-1 bg-white/40 mb-auto opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                                                    {/* Tooltip */}
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-gray-900 dark:bg-black text-white text-[10px] font-black rounded-xl opacity-0 scale-90 group-hover/bar:opacity-100 group-hover/bar:scale-100 transition-all pointer-events-none whitespace-nowrap shadow-xl z-20">
                                                        {dailyUsage?.[i]?.date || `Day ${i + 1}`}: {new Intl.NumberFormat('en-US').format(val)} Tokens
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-black rotate-45 -mt-1" />
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 opacity-50">
                                                    {dailyUsage?.[i]
                                                        ? new Date(dailyUsage[i].date).getDate()
                                                        : i % 2 === 0 ? `D${i + 1}` : ''}
                                                </span>
                                            </div>
                                        )
                                    })
                                })()}
                            </div>
                        </div>
                    </div>

                    {/* Meta Stats Panel */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        {metrics.map((m) => {
                            const Icon = m.icon
                            return (
                                <div key={m.label} className="p-5 bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-3xl group/item hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={classNames("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm", m.bg, m.color)}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30">
                                            <ArrowUpRight className="w-2.5 h-2.5 text-emerald-600" />
                                            <span className="text-xs font-black text-emerald-600 tracking-tight">{m.change}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-400 dark:text-gray-500 mb-1">{m.label}</p>
                                        <div className="flex items-center justify-between">
                                            <h5 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{m.value}</h5>
                                            <MousePointer2 className="w-3 h-3 text-gray-300 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        {/* Insights Card */}
                        <div className="flex-1 p-5 bg-primary/5 border border-primary/10 rounded-3xl relative overflow-hidden group/insight">
                            <Sparkles className="absolute top-4 right-4 w-4 h-4 text-primary animate-pulse" />
                            <div className="space-y-2 relative z-10">
                                <h6 className="text-[10px] font-black text-primary">Usage Tip</h6>
                                <p className="text-xs font-bold text-gray-700 dark:text-gray-300 leading-tight">
                                    Based on recent usage, you might need a few more credits next month.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-[10px] font-black text-gray-900 dark:text-white leading-none">Input Tokens</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary/30" />
                            <span className="text-[10px] font-black text-gray-900 dark:text-white leading-none">Output Tokens</span>
                        </div>
                    </div>


                </div>
            </div>
        </Card>
    )
}
