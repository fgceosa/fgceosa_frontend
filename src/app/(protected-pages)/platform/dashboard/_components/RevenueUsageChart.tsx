'use client'

import React, { useMemo, useState } from 'react'
import { Card } from '@/components/ui'
import Loading from '@/components/shared/Loading'
import dynamic from 'next/dynamic'
import type { WeeklyUsageTrends, PeriodMetrics } from '../types'
import { COLOR_1 } from '@/constants/chart.constant'
import { BarChart3, TrendingUp, Zap, Coins, MoreHorizontal, Calendar, Info, ArrowUpRight } from 'lucide-react'
import classNames from '@/utils/classNames'
import { NumericFormat } from 'react-number-format'

const Chart = dynamic(() => import('@/components/shared/Chart'), {
    ssr: false,
    loading: () => (
        <div className="h-[400px] flex items-center justify-center">
            <Loading loading type="qorebit" />
        </div>
    ),
})

interface RevenueUsageChartProps {
    weeklyUsageTrends?: WeeklyUsageTrends
    metrics?: PeriodMetrics
    onPeriodChange?: (period: string) => void
}

const periodTabs = [
    { label: 'Weekly', value: '7' },
    { label: 'Monthly', value: '30' },
    { label: 'Quarterly', value: '90' },
]

export default function RevenueUsageChart({
    weeklyUsageTrends,
    metrics,
    onPeriodChange
}: RevenueUsageChartProps) {
    const [selectedPeriod, setSelectedPeriod] = useState('30')

    const chartData = useMemo(() => {
        if (weeklyUsageTrends && weeklyUsageTrends.series && weeklyUsageTrends.series.length > 0) {
            return {
                series: weeklyUsageTrends.series,
                date: weeklyUsageTrends.dates || []
            }
        }

        return {
            series: [],
            date: [],
        }
    }, [weeklyUsageTrends])

    const handlePeriodChange = (period: string) => {
        setSelectedPeriod(period)
        if (onPeriodChange) {
            onPeriodChange(period)
        }
    }

    const hasData = chartData.series.length > 0

    return (
        <Card className="group relative shadow-xl border-none bg-white dark:bg-gray-900 overflow-hidden flex flex-col rounded-[2.5rem] p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/10 transition-colors duration-700" />

            {/* Header */}
            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm ring-1 ring-primary/20">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white leading-none mb-1">
                                Tokens & Credits
                            </h3>
                            <div className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-md border border-emerald-100 dark:border-emerald-800/30">
                                <span className="text-[8px] font-black text-emerald-600 flex items-center gap-1">
                                    <TrendingUp className="w-2 h-2" /> Live
                                </span>
                            </div>
                        </div>
                        <p className="text-[9px] font-black text-gray-400">Global Resource Consumption</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-6 mr-4 border-r border-gray-100 dark:border-gray-800 pr-8">
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black text-gray-400 mb-1 flex items-center gap-1.5">
                                <Zap className="w-2.5 h-2.5 text-amber-500" /> Avg. Tokens
                            </span>
                            <span className="text-sm font-black text-gray-900 dark:text-white leading-none font-mono">
                                {(() => {
                                    const num = metrics?.tokenUsage || 0
                                    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
                                    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
                                    return num.toLocaleString()
                                })()}
                            </span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black text-gray-400 mb-1 flex items-center gap-1.5">
                                <Coins className="w-2.5 h-2.5 text-blue-500" /> Total Revenue
                            </span>
                            <span className="text-sm font-black text-gray-900 dark:text-white leading-none font-mono">
                                <NumericFormat
                                    displayType="text"
                                    value={metrics?.totalRevenue || 0}
                                    prefix="₦"
                                    thousandSeparator={true}
                                />
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800">
                        {periodTabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => handlePeriodChange(tab.value)}
                                className={classNames(
                                    "px-4 py-2 text-[9px] font-black rounded-xl transition-all duration-300",
                                    selectedPeriod === tab.value
                                        ? "bg-white dark:bg-gray-700 text-primary shadow-lg shadow-gray-200/50 dark:shadow-none translate-y-[-1px]"
                                        : "text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className="relative z-10 flex-1 min-h-[300px]">
                {!hasData ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                            <BarChart3 className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="text-sm font-medium italic">Insufficient trend data for this period</p>
                    </div>
                ) : (
                    <Chart
                        type="area"
                        series={chartData.series}
                        xAxis={chartData.date}
                        height="300px"
                        customOptions={{
                            chart: {
                                toolbar: { show: false },
                                zoom: { enabled: false },
                                sparkline: { enabled: false },
                            },
                            legend: {
                                show: true,
                                position: 'top',
                                horizontalAlign: 'right',
                                offsetY: -30,
                                markers: { size: 4 },
                                itemMargin: { horizontal: 15 },
                                fontFamily: 'inherit',
                                fontWeight: 900,
                            },
                            colors: [COLOR_1, '#F59E0B'],
                            stroke: {
                                width: 3,
                                curve: 'smooth',
                            },
                            grid: {
                                show: true,
                                borderColor: 'rgba(0,0,0,0.03)',
                                strokeDashArray: 8,
                                position: 'back',
                                xaxis: { lines: { show: false } },
                                yaxis: { lines: { show: true } },
                            },
                            fill: {
                                type: 'gradient',
                                gradient: {
                                    shadeIntensity: 1,
                                    opacityFrom: 0.25,
                                    opacityTo: 0.05,
                                    stops: [0, 95]
                                }
                            },
                            xaxis: {
                                axisBorder: { show: false },
                                axisTicks: { show: false },
                                labels: {
                                    style: {
                                        colors: '#94a3b8',
                                        fontSize: '10px',
                                        fontWeight: 900
                                    }
                                },
                            },
                            yaxis: {
                                labels: {
                                    style: {
                                        colors: '#94a3b8',
                                        fontSize: '10px',
                                        fontWeight: 900
                                    },
                                    formatter: (val: number) => {
                                        if (val >= 1000) return `${(val / 1000).toFixed(1)}K`
                                        return val.toString()
                                    }
                                },
                            },
                            tooltip: {
                                theme: 'dark',
                                x: { show: true },
                                style: { fontSize: '12px' },
                                y: {
                                    formatter: (val: number) => {
                                        if (val >= 1000) return `${(val / 1000).toFixed(1)}M`
                                        return `${val}K`
                                    }
                                }
                            }
                        }}
                    />
                )}
            </div>

            {/* Footer Summary */}
            <div className="relative z-10 mt-8 pt-6 border-t border-gray-50 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-[10px] font-black text-gray-500">Real-time resource tracking active</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Info className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-[10px] font-black text-gray-400">Global platform reporting</span>
                    </div>
                </div>
                <button className="flex items-center gap-2 text-[11px] font-black text-[#0055BA] hover:opacity-70 transition-opacity">
                    Detailed Resource Analyzer
                    <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>
        </Card>
    )
}
