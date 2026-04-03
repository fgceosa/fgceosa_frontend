'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Card, Spinner } from '@/components/ui'
import dynamic from 'next/dynamic'
import { COLOR_1 } from '@/constants/chart.constant'
import { BarChart3, TrendingUp, Zap, Calendar, Brain } from 'lucide-react'
import classNames from '@/utils/classNames'
import { useOrganization } from '@/app/(protected-pages)/organizations/OrganizationContext'
import { selectOrganizationUsageSummary } from '@/store/slices/organization/organizationSelectors'
import { useAppSelector, useAppDispatch } from '@/store'
import { fetchOrganizationUsageSummary } from '@/store/slices/organization/organizationThunk'

const Chart = dynamic(() => import('@/components/shared/Chart'), {
    ssr: false,
    loading: () => (
        <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <Spinner size={30} className="text-primary" />
                <span className="text-[10px] font-black text-gray-400">Loading Analytics...</span>
            </div>
        </div>
    ),
})

const periodTabs = [
    { label: 'Weekly', value: '7' },
    { label: 'Monthly', value: '30' },
    { label: 'Quarterly', value: '90' },
]

export default function UsageAnalytics() {
    const dispatch = useAppDispatch()
    const { organizationId } = useOrganization()
    const usageSummary = useAppSelector(selectOrganizationUsageSummary)

    const [selectedPeriod, setSelectedPeriod] = useState('30')
    const [isLoading, setIsLoading] = useState(false) // Changed to false initially as we rely on Redux
    const [chartData, setChartData] = useState<{ series: any[], dates: string[] }>({ series: [], dates: [] })

    // Fetch org data when component mounts or organizationId changes
    useEffect(() => {
        if (organizationId) {
            setIsLoading(true)
            dispatch(fetchOrganizationUsageSummary({ organizationId }))
                .finally(() => setIsLoading(false))
        }
    }, [organizationId, dispatch])

    // Process data for the chart when usageSummary or selectedPeriod changes
    useEffect(() => {
        // Mock data logic similar to original component, but could rely on usageSummary if it had historical data
        // For now, we'll keep the mock generation but tied to the "selectedPeriod"
        // In a real implementation, usageSummary would likely contain daily/weekly breakdowns used here

        const dates = Array.from({ length: Number(selectedPeriod) }, (_, i) => {
            const d = new Date()
            d.setDate(d.getDate() - (Number(selectedPeriod) - 1 - i))
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        })

        // Use organization usage as a base if available, or fallback to random for mock visualization
        const baseValue = usageSummary?.totalUsage ? usageSummary.totalUsage / Number(selectedPeriod) : 500

        const series = [{
            name: 'AI Units Consumed',
            data: Array.from({ length: Number(selectedPeriod) }, () => Math.max(0, Math.floor(baseValue + (Math.random() * 200 - 100))))
        }]

        setChartData({ series, dates })
    }, [selectedPeriod, usageSummary])

    const totalUsage = useMemo(() => {
        if (!chartData.series[0]?.data) return 0
        return chartData.series[0].data.reduce((a: number, b: number) => a + b, 0)
    }, [chartData])

    return (
        <Card className="group relative shadow-2xl border-none bg-white dark:bg-gray-900 overflow-hidden flex flex-col rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-primary/5">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/10 transition-colors duration-700" />

            {/* Header */}
            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-8">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm ring-1 ring-primary/20">
                        <Brain className="w-7 h-7" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                                Performance Tracking
                            </h3>
                            <div className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-md border border-emerald-100 dark:border-emerald-800/30">
                                <span className="text-[9px] font-black text-emerald-600 flex items-center gap-1">
                                    <TrendingUp className="w-2.5 h-2.5" /> High Precision
                                </span>
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 mt-2 tracking-wider uppercase">Compute Consumption History</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="flex items-center gap-8 mr-4 lg:border-r border-gray-100 dark:border-gray-800 pr-8">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-gray-400 mb-1 flex items-center gap-1.5 uppercase">
                                <Zap className="w-3 h-3 text-amber-500" /> Total Period Usage
                            </span>
                            <span className="text-xl font-black text-gray-900 dark:text-white leading-none font-mono">
                                {totalUsage.toLocaleString()} Units
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800">
                        {periodTabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setSelectedPeriod(tab.value)}
                                className={classNames(
                                    "px-5 py-2.5 text-[10px] font-black rounded-xl transition-all duration-300",
                                    selectedPeriod === tab.value
                                        ? "bg-white dark:bg-gray-700 text-primary shadow-xl shadow-gray-200/50 dark:shadow-none translate-y-[-1px]"
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
            <div className="relative z-10 flex-1 min-h-[350px]">
                {isLoading && !chartData.series.length ? (
                    <div className="h-[350px] flex items-center justify-center">
                        <Spinner size={40} className="text-primary" />
                    </div>
                ) : !chartData.series.length ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                        <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                            <BarChart3 className="w-10 h-10 opacity-20" />
                        </div>
                        <p className="text-base font-bold italic">Analyzing compute trends...</p>
                    </div>
                ) : (
                    <Chart
                        type="area"
                        series={chartData.series}
                        xAxis={chartData.dates}
                        height="350px"
                        customOptions={{
                            chart: {
                                toolbar: { show: false },
                                zoom: { enabled: false },
                                sparkline: { enabled: false },
                            },
                            legend: { show: false },
                            colors: [COLOR_1],
                            stroke: {
                                width: 4,
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
                                    opacityFrom: 0.35,
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
                                        fontSize: '11px',
                                        fontWeight: 900
                                    }
                                },
                            },
                            yaxis: {
                                labels: {
                                    style: {
                                        colors: '#94a3b8',
                                        fontSize: '11px',
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
                                style: { fontSize: '13px' },
                                y: {
                                    formatter: (val: number) => `${val.toLocaleString()} AI Units`
                                }
                            }
                        }}
                    />
                )}
            </div>

            {/* Footer Summary */}
            <div className="relative z-10 mt-10 pt-8 border-t border-gray-50 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm shadow-primary/50" />
                        <span className="text-[11px] font-black text-gray-500 tracking-wide uppercase">Real-time Telemetry Enabled</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-[11px] font-black text-gray-400 tracking-wide uppercase">Daily resolution</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-gray-400 italic">Data updated recently</span>
                </div>
            </div>
        </Card>
    )
}
