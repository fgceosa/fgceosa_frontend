'use client'

import { useMemo } from 'react'
import Select from '@/components/ui/Select'
import { Card } from '@/components/ui'
import { TrendingUp } from 'lucide-react'
import dynamic from 'next/dynamic'
import Loading from '@/components/shared/Loading'
import { COLOR_1, COLOR_2, COLOR_4, COLOR_5 } from '@/constants/chart.constant'
import type { WeeklyUsageTrends as WeeklyUsageTrendsType } from '../types'
import classNames from '@/utils/classNames'

const Chart = dynamic(() => import('@/components/shared/Chart'), {
    ssr: false,
    loading: () => (
        <div className="h-[425px] flex items-center justify-center">
            <Loading loading />
        </div>
    ),
})

type MetricType = 'creditBalance' | 'apiRequests' | 'spending' | 'activeProjects' | 'mostUsedModel'

type Props = {
    data?: WeeklyUsageTrendsType
    trend?: string
    selectedMetric?: MetricType
    onPeriodChange?: (period: string) => void
}

const chartColors: Record<string, string[]> = {
    default: [COLOR_1, '#00CED1'],
    creditBalance: [COLOR_1, '#00CED1'],
    apiRequests: [COLOR_2, '#FF4500'],
    activeProjects: [COLOR_4, '#9ACD32'],
    spending: [COLOR_5, '#F0E68C'],
    mostUsedModel: [COLOR_1, '#00CED1'],
}

const periodOptions = [
    { label: 'This Week', value: 'weekly' },
    { label: 'This Month', value: 'monthly' },
    { label: 'This Year', value: 'annually' },
]

export default function WeeklyUsageTrends({ data, trend, selectedMetric = 'creditBalance' }: Props) {
    const chartData = useMemo(() => {
        if (!data || !data.series || data.series.length === 0) {
            return { series: [], date: [], totalCost: 0, avgDailyCost: 0 }
        }

        const costSeries = data.series?.find(s => s.name?.includes('Cost'))
        const rawCosts = (costSeries?.data || []) as any[]
        const costs = rawCosts.map(c => {
            const n = typeof c === 'number' ? c : parseFloat(c as string)
            return isNaN(n) ? 0 : n
        })

        const totalCost = costs.reduce((sum, val) => sum + val, 0)
        const avgDailyCost = costs.length > 0 ? totalCost / costs.length : 0

        return {
            series: data.series.map(s => ({
                ...s,
                data: (s.data || []).map(v => {
                    const n = typeof v === 'number' ? v : parseFloat(v as string)
                    return isNaN(n) ? 0 : n
                })
            })),
            date: data.dates || [],
            totalCost: isNaN(totalCost) ? 0 : totalCost,
            avgDailyCost: isNaN(avgDailyCost) ? 0 : avgDailyCost
        }
    }, [data])

    // Use trend from props if available
    const isPositive = trend ? !trend.startsWith('-') : true
    const cleanTrendValue = trend ? trend.replace(/[+%-]/g, '') : '0'

    return (
        <Card className="shadow-lg border-none bg-white dark:bg-gray-900 overflow-hidden h-full flex flex-col">
            <div className="p-4 sm:p-6 pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#0055BA]/10 flex items-center justify-center text-[#0055BA] shadow-sm shrink-0">
                            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                Usage Trends
                                <span className={classNames(
                                    "text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1",
                                    isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                                )}>
                                    {isPositive ? '↑' : '↓'} {cleanTrendValue}%
                                </span>
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                                Growth analysis for the selected period
                            </p>
                        </div>
                    </div>
                    <Select
                        instanceId="trends-period"
                        className="w-full sm:w-[140px]"
                        size="sm"
                        placeholder="This Week"
                        options={periodOptions}
                        isSearchable={false}
                        defaultValue={periodOptions[0]}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400">Total Usage</span>
                        <span className="text-base sm:text-lg font-black text-gray-900 dark:text-white">₦{chartData.totalCost.toFixed(2)}</span>
                    </div>
                    <div className="w-px h-8 bg-gray-100 dark:bg-gray-800" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400">Avg daily</span>
                        <span className="text-base sm:text-lg font-black text-gray-900 dark:text-white">₦{chartData.avgDailyCost.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 px-2 pb-2">
                <div className="h-[250px] sm:h-[350px] relative">
                    <Chart
                        type="area"
                        series={chartData.series}
                        xAxis={chartData.date}
                        height={350}
                        customOptions={{
                            legend: {
                                show: true,
                                position: 'top',
                                horizontalAlign: 'right',
                                fontFamily: 'inherit',
                                fontWeight: 600,
                                markers: { size: 8 }
                            },
                            colors: chartColors[selectedMetric] || chartColors.default,
                            stroke: {
                                width: 4,
                                curve: 'smooth',
                            },
                            grid: {
                                borderColor: 'rgba(0,0,0,0.02)',
                                strokeDashArray: 4,
                                padding: { left: 10, right: 10, bottom: 0 },
                                yaxis: { lines: { show: true } },
                                xaxis: { lines: { show: false } }
                            },
                            dataLabels: { enabled: false },
                            markers: {
                                size: 0,
                                hover: { size: 6 }
                            },
                            xaxis: {
                                labels: {
                                    style: {
                                        colors: '#94a3b8',
                                        fontWeight: 600,
                                        fontSize: '11px'
                                    }
                                },
                                axisBorder: { show: false },
                                axisTicks: { show: false }
                            },
                            yaxis: {
                                labels: {
                                    style: {
                                        colors: '#94a3b8',
                                        fontWeight: 600,
                                        fontSize: '11px'
                                    }
                                }
                            },
                            tooltip: {
                                theme: 'dark',
                                x: { show: true },
                                y: {
                                    formatter: (val) => val.toLocaleString()
                                }
                            },
                            fill: {
                                type: 'gradient',
                                gradient: {
                                    shadeIntensity: 1,
                                    opacityFrom: 0.3,
                                    opacityTo: 0,
                                    stops: [0, 90, 100]
                                }
                            }
                        }}
                    />
                </div>
            </div>

            <div className="p-4 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 mt-auto">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-400">Values are updated every hour</span>
                    <button className="text-[11px] font-bold text-[#0055BA] hover:underline">
                        View breakdown
                    </button>
                </div>
            </div>
        </Card>
    )
}
