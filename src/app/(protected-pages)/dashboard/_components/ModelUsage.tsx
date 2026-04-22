'use client'

import { useState } from 'react'
import Chart from '@/components/shared/Chart'
import { Card } from '@/components/ui'
import { Bot } from 'lucide-react'
import { useAppSelector } from '@/store/hook'
import { selectModelUsageDistribution, selectAdminDashboardLoading } from '@/store/slices/admindashboard'
import Loading from '@/components/shared/Loading'

import classNames from '@/utils/classNames'

const modelColors: Record<string, string> = {
    'gpt-4': '#0055BA',
    'claude-sonnet': '#10b981',
    'claude-opus': '#8b5cf6',
    'llama-3': '#f59e0b',
    'gpt-3.5-turbo': '#ec4899',
    'default': '#94a3b8',
}

export default function ModelDonutChart() {
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 3

    const modelUsageData = useAppSelector(selectModelUsageDistribution)
    const isLoading = useAppSelector(selectAdminDashboardLoading)

    if (isLoading && (!modelUsageData || modelUsageData.length === 0)) {
        return (
            <Card className="shadow-lg border-none bg-white dark:bg-gray-900 overflow-hidden h-full">
                <div className="w-full flex items-center justify-center min-h-[400px]">
                    <Loading loading />
                </div>
            </Card>
        )
    }

    if (!modelUsageData || modelUsageData.length === 0) {
        return (
            <Card className="shadow-lg border-none bg-white dark:bg-gray-900 overflow-hidden h-full flex flex-col">
                <div className="p-6 pb-2">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-[#0055BA]/10 flex items-center justify-center text-[#0055BA] shadow-sm">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Model Usage</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                How you use different models
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-4">
                        <Bot className="w-10 h-10 text-gray-300" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">No Usage Data</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[200px] mt-2">
                        Start making API requests to see your model distribution analytics here.
                    </p>
                </div>
            </Card>
        )
    }

    const modelData = modelUsageData.map((item: any) => ({
        name: item.model,
        value: item.percentage,
        count: item.count,
        color: modelColors[item.model.toLowerCase()] || modelColors['default']
    }))

    const series = modelData.map((m: any) => {
        const n = parseFloat(m.value as any)
        return isNaN(n) ? 0 : n
    })
    const labels = modelData.map((m: any) => m.name)
    const colors = modelData.map((m: any) => m.color)

    const totalPages = Math.ceil(modelData.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const currentModels = modelData.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    return (
        <Card className="shadow-2xl shadow-blue-900/5 border-none bg-white dark:bg-gray-900 overflow-hidden h-full flex flex-col relative group">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0055BA]/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
            
            <div className="relative z-10 p-6 pb-4 border-b border-gray-100/50 dark:border-gray-800/50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-[#0055BA] to-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            Model Usage
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            How you use different models
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
                <div className="relative w-full flex justify-center">
                    <Chart
                        type="donut"
                        height={320}
                        series={series}
                        customOptions={{
                            labels,
                            colors,
                            legend: { show: false },
                            stroke: { width: 2, colors: ['transparent'] },
                            plotOptions: {
                                pie: {
                                    donut: {
                                        size: '82%',
                                        labels: {
                                            show: true,
                                            total: {
                                                show: true,
                                                label: 'Models',
                                                formatter: () => 'Active',
                                                fontSize: '12px',
                                                fontWeight: 800,
                                                color: '#94a3b8'
                                            },
                                            value: {
                                                show: true,
                                                fontSize: '24px',
                                                fontWeight: 900,
                                                color: '#1e293b',
                                                offsetY: 4
                                            }
                                        },
                                    },
                                },
                            },
                            tooltip: {
                                theme: 'dark',
                                y: {
                                    formatter: (val: number) => `${val.toFixed(1)}% Usage`,
                                },
                            },
                            dataLabels: { enabled: false },
                        }}
                    />
                </div>

                <div className="w-full space-y-3 mt-8 relative z-10">
                    {currentModels.map((m: any) => (
                        <div
                            key={m.name}
                            className="group/item relative flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-transparent hover:shadow-xl transition-all duration-300 overflow-hidden"
                            style={{ boxShadow: `0 4px 20px ${m.color}08` }}
                        >
                            {/* Inline Progress Track matching model color */}
                            <div 
                                className="absolute left-0 top-0 bottom-0 opacity-10 dark:opacity-20 transition-all duration-1000 ease-out z-0"
                                style={{ backgroundColor: m.color, width: `${m.value}%` }} 
                            />
                            
                            <div className="flex items-center gap-4 min-w-0 z-10">
                                <span
                                    className="w-3 h-3 rounded-full flex-shrink-0 shadow-md border-2 border-white dark:border-gray-800 transition-transform duration-300"
                                    style={{ backgroundColor: m.color }}
                                />
                                <div className="flex flex-col min-w-0">
                                    <p className="text-sm font-black text-gray-900 dark:text-gray-100 truncate flex items-center gap-2">
                                        {m.name}
                                    </p>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                                        {m.count.toLocaleString()} API Calls
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 z-10">
                                <span className="text-lg font-black" style={{ color: m.color }}>
                                    {m.value.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    ))}

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 pb-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-500 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
                            >
                                Previous
                            </button>
                            <span className="text-[10px] font-black text-gray-400 tracking-wider">
                                PAGE {currentPage} OF {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-500 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400">Efficiency metrics</span>
                    <div className="flex gap-1">
                    </div>
                </div>
            </div>
        </Card>
    )
}
