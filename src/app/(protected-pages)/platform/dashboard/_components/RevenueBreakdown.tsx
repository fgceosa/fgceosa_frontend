'use client'

import React from 'react'
import { Card } from '@/components/ui'
import dynamic from 'next/dynamic'
import Loading from '@/components/shared/Loading'
import type { ModelUsage } from '../types'
import { PieChart, ArrowUpRight, Target, MoreHorizontal, ChevronRight } from 'lucide-react'
import classNames from '@/utils/classNames'

const Chart = dynamic(() => import('@/components/shared/Chart'), {
    ssr: false,
    loading: () => <Loading loading />,
})

interface RevenueBreakdownProps {
    breakdown?: ModelUsage[]
    loading?: boolean
}

export default function RevenueBreakdown({ breakdown = [], loading }: RevenueBreakdownProps) {
    const data = breakdown || []
    const series = data.map(d => d.count || 0)
    const labels = data.map(d => d.model || 'Unknown')
    const colors = data.map(d => d.color || '#cccccc')

    const totalRequests = data.reduce((sum, item) => sum + (item.count || 0), 0)

    return (
        <Card className="group relative shadow-xl border-none bg-white dark:bg-gray-900 overflow-hidden flex flex-col rounded-[2.5rem] p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors duration-700" />

            <div className="relative z-10 flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm ring-1 ring-primary/20">
                        <Target className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white leading-none mb-1">
                            Model Distribution
                        </h3>
                        <p className="text-[9px] font-black text-gray-400">Usage across models</p>
                    </div>
                </div>

            </div>

            <div className="relative z-10 flex-1 flex flex-col items-center">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center min-h-[200px]">
                        <Loading loading type="qorebit" />
                    </div>
                ) : data.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4 py-8">
                        <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                            <PieChart className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="text-sm font-medium italic">No distribution data</p>
                    </div>
                ) : (
                    <>
                        <div className="relative w-full flex justify-center mb-4">
                            {/* Centered Total Logic */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                                <span className="text-[10px] font-black text-gray-400 leading-none">Total</span>
                                <span className="text-xl font-black text-gray-900 dark:text-white mt-1">
                                    {(totalRequests / 1000).toFixed(1)}K
                                </span>
                            </div>

                            <Chart
                                type="donut"
                                height={200}
                                series={series}
                                customOptions={{
                                    labels,
                                    colors,
                                    legend: { show: false },
                                    stroke: {
                                        width: 8,
                                        colors: ['transparent']
                                    },
                                    plotOptions: {
                                        pie: {
                                            donut: {
                                                size: '72%',
                                                labels: {
                                                    show: false
                                                }
                                            },
                                        },
                                    },
                                    dataLabels: { enabled: false },
                                    tooltip: {
                                        theme: 'dark',
                                        style: { fontSize: '12px' },
                                    }
                                }}
                            />
                        </div>

                        <div className="w-full max-h-[180px] overflow-y-auto custom-scrollbar pr-2 space-y-2">
                            {data.map((item, index) => (
                                <div
                                    key={item.model || index}
                                    className="group/item flex items-center justify-between p-2.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-gray-800"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-2 h-2 rounded-full shadow-lg"
                                            style={{
                                                backgroundColor: item.color,
                                                boxShadow: `0 0 10px ${item.color}40`
                                            }}
                                        />
                                        <span className="text-xs font-black text-gray-900 dark:text-gray-100 group-hover/item:text-primary transition-colors">
                                            {item.model}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <div className="text-xs font-black text-gray-900 dark:text-white">
                                                {item.percentage}%
                                            </div>
                                            <div className="text-[8px] font-bold text-gray-400">
                                                {Math.round(item.count / 1000)}K req
                                            </div>
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-gray-50 dark:border-gray-800">
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-[10px] font-black hover:bg-primary hover:text-white transition-all duration-300 group shadow-sm hover:shadow-primary/20">
                    View Allocation Details
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
            </div>
        </Card>
    )
}
