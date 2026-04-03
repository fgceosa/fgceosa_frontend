'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import Loading from '@/components/shared/Loading'
import { BarChart3, Info, Check } from 'lucide-react'
import { Tooltip } from '@/components/ui'
import classNames from 'classnames'

const Chart = dynamic(() => import('@/components/shared/Chart'), {
    ssr: false,
    loading: () => <Loading loading />,
})

// Types
import { RevenueChartData } from '../../types'

interface RevenuePerformanceChartProps {
    data: RevenueChartData[]
}

/**
 * RevenuePerformanceChart - Redesigned to match the high-fidelity screenshot exactly.
 * Features custom pill toggles, unified summary section, and premium typography.
 * Includes defensive checks to prevent 'length' errors if data is unexpectedly null/undefined.
 */
export default function RevenuePerformanceChart({ data: rawData = [] }: RevenuePerformanceChartProps) {
    const data = Array.isArray(rawData) ? rawData : []
    const [visibility, setVisibility] = useState({
        revenue: true,
        costs: true,
        trend: true
    })

    // Ensure we always have valid data arrays
    const categories = data.map(d => d.month || '')
    const revenues = data.map(d => {
        const n = parseFloat(d.revenue as any)
        return isNaN(n) ? 0 : n
    })
    const costs = data.map(d => {
        const n = parseFloat(d.costs as any)
        return isNaN(n) ? 0 : n
    })
    const trends = data.map(d => {
        const n = parseFloat(d.trend as any)
        return isNaN(n) ? 0 : n
    })

    const totalEarnings = revenues.reduce((a, b) => a + b, 0)
    const totalCosts = costs.reduce((a, b) => a + b, 0)
    const profitMargin = totalEarnings > 0 ? ((totalEarnings - totalCosts) / totalEarnings) * 100 : 0

    // Reconstruct series and style arrays dynamically based on visibility to prevent mismatch/crash
    const series = []
    const strokeWidths = []
    const strokeColors = []
    const fillOpacities = []
    const markerSizes = []

    if (visibility.revenue) {
        series.push({
            name: 'Revenue',
            type: 'bar',
            data: revenues,
            color: '#0055BA' // Enterprise Blue
        })
        strokeWidths.push(0)
        strokeColors.push('transparent')
        fillOpacities.push(1)
        markerSizes.push(0)
    }

    if (visibility.costs) {
        series.push({
            name: 'Costs',
            type: 'bar',
            data: costs,
            color: '#E5E7EB' // Professional Light Gray
        })
        strokeWidths.push(0)
        strokeColors.push('transparent')
        fillOpacities.push(1)
        markerSizes.push(0)
    }

    if (visibility.trend) {
        series.push({
            name: 'Trend',
            type: 'line',
            data: trends,
            color: '#10B981' // Success Green
        })
        strokeWidths.push(3)
        strokeColors.push('#10B981')
        fillOpacities.push(1)
        markerSizes.push(0)
    }

    const toggleVisibility = (key: keyof typeof visibility) => {
        setVisibility(prev => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/40 dark:shadow-none overflow-hidden h-full flex flex-col group transition-all duration-500">
            {/* Enterprise Header Section */}
            <header className="p-8 pb-6 flex flex-col xl:flex-row xl:items-start justify-between gap-8 border-b border-gray-50/50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20">
                <div className="flex items-start gap-5">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm shadow-blue-100/50">
                        <BarChart3 className="w-6 h-6 text-[#0055BA]" />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white">Financial Performance</h3>
                            <Tooltip title="View monthly distribution of revenue vs operational costs">
                                <Info className="w-4 h-4 text-gray-300 hover:text-primary transition-colors cursor-help" />
                            </Tooltip>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400">Monthly Earnings and Costs Analysis</p>
                    </div>
                </div>

                {/* Interactive Toggles & KPI Badges */}
                <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Custom Pill Toggles */}
                    <div className="flex items-center gap-2.5">
                        <TogglePill
                            active={visibility.revenue}
                            onClick={() => toggleVisibility('revenue')}
                            label="Revenue"
                        />
                        <TogglePill
                            active={visibility.costs}
                            onClick={() => toggleVisibility('costs')}
                            label="Costs"
                        />
                        <TogglePill
                            active={visibility.trend}
                            onClick={() => toggleVisibility('trend')}
                            label="Trend"
                        />
                    </div>

                    {/* Integrated Summary Component */}
                    <div className="flex items-center divide-x divide-gray-100 dark:divide-gray-800 border border-gray-100 dark:border-gray-800 rounded-[1.25rem] bg-white dark:bg-gray-800 px-2 py-2 shadow-xl shadow-gray-200/50 dark:shadow-none min-w-[360px]">
                        <div className="flex-1 px-5 py-1">
                            <span className="text-[8px] font-black text-gray-400 block mb-1">Total Earnings</span>
                            <span className="text-sm font-black text-gray-900 dark:text-white whitespace-nowrap">
                                ₦{Math.ceil(totalEarnings / 1000000)}M
                            </span>
                        </div>
                        <div className="flex-1 px-5 py-1">
                            <span className="text-[8px] font-black text-gray-400 block mb-1">Total Costs</span>
                            <span className="text-sm font-black text-gray-900 dark:text-white whitespace-nowrap">
                                ₦{Math.ceil(totalCosts / 1000000)}M
                            </span>
                        </div>
                        <div className="flex-1 px-5 py-1">
                            <span className="text-[8px] font-black text-gray-400 block mb-1">Profit Margin</span>
                            <span className="text-sm font-black text-emerald-500 whitespace-nowrap">
                                +{Math.ceil(profitMargin)}%
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Chart Area - Reduced bottom padding further */}
            <div className="flex-1 px-8 pt-6 pb-2">
                <Chart
                    type="bar"
                    series={series}
                    height={380}
                    xAxis={categories}
                    customOptions={{
                        chart: {
                            toolbar: { show: false },
                            zoom: { enabled: false },
                            stacked: false,
                        },
                        plotOptions: {
                            bar: {
                                horizontal: false,
                                columnWidth: '70%', // More compact bars
                                borderRadius: 6,
                                borderRadiusApplication: 'end',
                            },
                        },
                        dataLabels: { enabled: false },
                        stroke: {
                            show: true,
                            width: strokeWidths.length > 0 ? strokeWidths : 2,
                            curve: 'smooth',
                            colors: strokeColors.length > 0 ? strokeColors : ['#10B981']
                        },
                        legend: { show: false },
                        fill: {
                            opacity: fillOpacities.length > 0 ? fillOpacities : 1,
                            type: series.length > 0 ? series.map(() => 'solid') : 'solid'
                        },
                        xaxis: {
                            axisBorder: { show: false },
                            axisTicks: { show: false },
                            labels: {
                                style: {
                                    colors: '#94A3B8',
                                    fontWeight: 900,
                                    fontSize: '11px',
                                    fontFamily: 'inherit'
                                }
                            }
                        },
                        yaxis: {
                            tickAmount: 4,
                            labels: {
                                style: {
                                    colors: '#94A3B8',
                                    fontWeight: 900,
                                    fontSize: '11px',
                                    fontFamily: 'inherit'
                                },
                                formatter: (val: number) => {
                                    if (val === 0) return '0'
                                    if (val >= 1000000) return `${(val / 1000000).toFixed(0)}M`
                                    return val.toLocaleString()
                                }
                            }
                        },
                        grid: {
                            borderColor: '#F1F5F9',
                            strokeDashArray: 4,
                            padding: { left: 20, right: 20, bottom: -10 },
                            yaxis: { lines: { show: true } }
                        },
                        tooltip: {
                            x: { show: true },
                            theme: 'light',
                            y: { formatter: (val: number) => `₦${Math.ceil(val).toLocaleString()}` }
                        },
                        markers: {
                            size: markerSizes.length > 0 ? markerSizes : 0
                        }
                    }}
                />
            </div>
        </div>
    )
}

/**
 * TogglePill - Visual component that matches the checkmark pill buttons in the design.
 */
function TogglePill({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
    return (
        <button
            onClick={onClick}
            className={classNames(
                "flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 font-black text-[10px] border",
                active
                    ? "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-[#0055BA] shadow-lg shadow-blue-500/10"
                    : "bg-gray-50/50 dark:bg-gray-900/50 border-transparent text-gray-400 grayscale hover:grayscale-0"
            )}
        >
            <div className={classNames(
                "w-4 h-4 rounded-md flex items-center justify-center transition-colors",
                active ? "bg-[#0055BA] text-white" : "bg-gray-200 dark:bg-gray-700 text-transparent"
            )}>
                <Check className="w-2.5 h-2.5 stroke-[4px]" />
            </div>
            {label}
        </button>
    )
}
