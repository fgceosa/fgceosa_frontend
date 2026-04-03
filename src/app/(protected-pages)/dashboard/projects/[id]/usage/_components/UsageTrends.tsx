'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui'
import { TrendingUp, Eye, EyeOff, Activity, Zap, ShieldCheck } from 'lucide-react'
import type { UsageTrend } from '@/app/(protected-pages)/dashboard/projects/types'
import type { ApexOptions } from 'apexcharts'
import classNames from '@/utils/classNames'
import dayjs from 'dayjs'

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface UsageTrendsProps {
    trends: UsageTrend[]
}

interface SeriesToggle {
    apiCalls: boolean
    tokens: boolean
    cost: boolean
}

export default function UsageTrends({ trends }: UsageTrendsProps) {
    const hasData = trends && trends.length > 0

    // Series visibility toggles
    const [seriesVisibility, setSeriesVisibility] = useState<SeriesToggle>({
        apiCalls: true,
        tokens: true,
        cost: true
    })

    const toggleSeries = (series: keyof SeriesToggle) => {
        setSeriesVisibility(prev => ({
            ...prev,
            [series]: !prev[series]
        }))
    }

    // Prepare chart data
    const chartData = useMemo(() => {
        if (!hasData) return null

        const sortedTrends = [...trends].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        )

        const dates = sortedTrends.map(t => dayjs(t.date).format('MMM D'))
        const apiCalls = sortedTrends.map(t => t.apiCalls)
        const tokens = sortedTrends.map(t => t.tokensConsumed)
        const costs = sortedTrends.map(t => parseFloat(t.cost) * 1500)

        return { dates, apiCalls, tokens, costs }
    }, [trends, hasData])

    // Chart configuration
    const chartOptions: ApexOptions = useMemo(() => ({
        chart: {
            type: 'area',
            height: 320,
            toolbar: { show: false },
            animations: { enabled: true, easing: 'easeinout', speed: 800 },
            fontFamily: 'inherit',
            dropShadow: { enabled: true, top: 4, left: 0, blur: 10, color: '#0055BA', opacity: 0.1 }
        },
        stroke: { curve: 'smooth', width: 4, lineCap: 'round' },
        fill: {
            type: 'gradient',
            gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 90, 100] }
        },
        colors: ['#0055BA', '#F59E0B', '#10B981'],
        xaxis: {
            categories: chartData?.dates || [],
            labels: { style: { colors: '#94a3b8', fontSize: '11px', fontWeight: 700 } },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: [
            {
                title: { text: 'Activity', style: { color: '#0055BA', fontSize: '10px', fontWeight: 900, cssClass: '' } },
                labels: { style: { colors: '#94a3b8', fontSize: '12px', fontWeight: 700 }, formatter: (value) => Math.round(value).toLocaleString() }
            },
            {
                opposite: true,
                title: { text: 'Volume', style: { color: '#F59E0B', fontSize: '10px', fontWeight: 900, cssClass: '' } },
                labels: {
                    style: { colors: '#94a3b8', fontSize: '12px', fontWeight: 700 },
                    formatter: (value) => {
                        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
                        return Math.round(value).toLocaleString()
                    }
                }
            }
        ],
        tooltip: { shared: true, intersect: false, theme: 'dark', x: { show: true }, y: { formatter: (val) => val.toLocaleString() } },
        legend: { show: false },
        grid: { borderColor: 'rgba(241, 245, 249, 0.5)', strokeDashArray: 8, padding: { top: 0, right: 20, bottom: 0, left: 10 } },
        dataLabels: { enabled: false },
        markers: { size: 0, hover: { size: 8, strokeWidth: 4, strokeColors: '#fff' } }
    }), [chartData])

    const chartSeries = useMemo(() => {
        const series = []
        if (seriesVisibility.apiCalls) series.push({ name: 'Activity', data: chartData?.apiCalls || [] })
        if (seriesVisibility.tokens) series.push({ name: 'Volume', data: chartData?.tokens || [] })
        if (seriesVisibility.cost) series.push({ name: 'Spend', data: chartData?.costs || [] })
        return series
    }, [chartData, seriesVisibility])

    return (
        <Card className="p-0 border-none bg-white dark:bg-gray-950 rounded-[2rem] overflow-hidden shadow-md transition-all duration-700">
            <div className="p-6 md:p-8">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-[9px] font-black text-primary opacity-80">Insights</span>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">Usage Trends</h3>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {[
                            { id: 'apiCalls', label: 'Activity', color: 'bg-primary', icon: Activity, active: seriesVisibility.apiCalls },
                            { id: 'tokens', label: 'Volume', color: 'bg-amber-500', icon: Zap, active: seriesVisibility.tokens },
                            { id: 'cost', label: 'Spend', color: 'bg-emerald-500', icon: ShieldCheck, active: seriesVisibility.cost }
                        ].map((btn) => (
                            <button
                                key={btn.id}
                                onClick={() => toggleSeries(btn.id as keyof SeriesToggle)}
                                className={classNames(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black transition-all duration-300 border",
                                    btn.active
                                        ? "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-lg translate-y-[-1px]"
                                        : "bg-gray-50/50 dark:bg-gray-800/30 border-transparent opacity-40 grayscale-[0.5]"
                                )}
                            >
                                <div className={classNames("w-5 h-5 rounded-lg flex items-center justify-center text-white", btn.color)}>
                                    <btn.icon className="w-2.5 h-2.5" />
                                </div>
                                <span className="text-gray-900 dark:text-gray-100">{btn.label}</span>
                                {btn.active ? <Eye className="w-3 h-3 text-gray-300" /> : <EyeOff className="w-3 h-3 text-gray-400" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Visualization */}
                <div className="relative">
                    {!hasData ? (
                        <div className="py-16 text-center flex flex-col items-center">
                            <h4 className="text-gray-900 dark:text-white font-black text-lg">No Activity</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[280px] mt-2 italic font-medium">Trends will materialize here once usage begins.</p>
                        </div>
                    ) : (
                        <div className="w-full bg-gray-50/10 dark:bg-gray-800/10 rounded-[1.5rem] border border-gray-100/50 dark:border-gray-800/50 p-4">
                            <Chart options={chartOptions} series={chartSeries} type="area" height={320} />
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )
}
