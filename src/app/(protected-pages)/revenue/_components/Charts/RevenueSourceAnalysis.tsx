'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import Loading from '@/components/shared/Loading'
import { PieChart } from 'lucide-react'
import { NumericFormat } from 'react-number-format'

const Chart = dynamic(() => import('@/components/shared/Chart'), {
    ssr: false,
    loading: () => <Loading loading />,
})

interface RevenueSourceAnalysisProps {
    data: {
        source: string
        amount: number
        percentage: number
    }[]
}

/**
 * RevenueSourceAnalysis - Donut chart visualizing the distribution of revenue across different sources.
 * Helps identify the most profitable payment types or platforms.
 */
export default function RevenueSourceAnalysis({ data }: RevenueSourceAnalysisProps) {
    const series = (data || []).map(d => {
        const n = parseFloat(d.amount as any)
        return isNaN(n) ? 0 : n
    })
    const labels = (data || []).map(d => d.source)
    const colors = ['#0055BA', '#6366F1', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899']

    return (
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none overflow-hidden h-full flex flex-col">
            <header className="p-8 pb-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-2xl">
                        <PieChart className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-gray-900 dark:text-white">Revenue by Source</h3>
                        <p className="text-[10px] font-bold text-gray-400 mt-0.5">Distribution of income streams</p>
                    </div>
                </div>
            </header>

            <div className="p-8 flex-1 flex flex-col lg:flex-row items-center gap-10">
                {/* Visual Chart Area */}
                <div className="relative w-full lg:w-1/2">
                    <Chart
                        type="donut"
                        series={series}
                        height={280}
                        customOptions={{
                            labels: labels,
                            colors: colors,
                            stroke: { show: false },
                            dataLabels: { enabled: false },
                            legend: { show: false },
                            plotOptions: {
                                pie: {
                                    donut: {
                                        size: '75%',
                                        labels: {
                                            show: true,
                                            name: {
                                                show: true,
                                                fontSize: '11px',
                                                fontWeight: 900,
                                                color: '#94A3B8',
                                                offsetY: -5
                                            },
                                            value: {
                                                show: true,
                                                fontSize: '20px',
                                                fontWeight: 900,
                                                color: '#1E293B',
                                                offsetY: 5,
                                                formatter: (val: string) => `₦${Math.ceil(parseFloat(val) / 1000000)}M`
                                            },
                                            total: {
                                                show: true,
                                                label: 'Total',
                                                fontSize: '10px',
                                                fontWeight: 900,
                                                color: '#94A3B8',
                                                formatter: function (w: any) {
                                                    const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0)
                                                    return `₦${Math.ceil(total / 1000000)}M`
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                        }}
                    />
                </div>

                {/* Legend & Details List */}
                <div className="w-full lg:w-1/2 space-y-4">
                    {data.map((item, index) => (
                        <div key={item.source} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100/50 dark:border-gray-700/30 group/item transition-all hover:bg-white dark:hover:bg-gray-800 hover:shadow-md">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                                <span className="text-[10px] font-black text-gray-400 group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">{item.source}</span>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-black text-gray-900 dark:text-white">
                                    <NumericFormat displayType="text" value={item.amount} prefix="₦" thousandSeparator decimalScale={0} />
                                </div>
                                <div className="text-[10px] font-black text-emerald-500">{Math.ceil(item.percentage)}% Share</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
