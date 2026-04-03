'use client'

import React from 'react'
import { Card } from '@/components/ui'
import { NumericFormat } from 'react-number-format'
import { Cpu, Zap } from 'lucide-react'

// Types
import { ModelRevenue } from '../../types'

interface ModelPerformanceTableProps {
    data: ModelRevenue[]
}

/**
 * ModelPerformanceTable - Highlights the top-performing AI models by earnings generated.
 * Provides granular insights into which models are driving the most value for organizations.
 */
export default function ModelPerformanceTable({ data }: ModelPerformanceTableProps) {
    return (
        <Card className="p-0 border-none shadow-2xl shadow-gray-200/60 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 transition-all h-full flex flex-col overflow-hidden group">
            <header className="p-8 md:p-10 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/20">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/20 flex items-center justify-center">
                        <Cpu className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white">Top Models</h3>
                        <p className="text-[10px] font-black text-gray-400 mt-0.5">Earnings by Model</p>
                    </div>
                </div>
            </header>

            <div className="p-4 md:p-6 flex-1">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-50 dark:border-gray-800">
                                <th className="px-8 py-4 text-left">
                                    <span className="text-[10px] font-black text-gray-400">Model Name</span>
                                </th>
                                <th className="px-6 py-4 text-right">
                                    <span className="text-[10px] font-black text-gray-400">Usage & Profit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                            {data.map((item, idx) => (
                                <tr key={item.id || idx} className="group/row hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-all duration-300">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center group-hover/row:bg-indigo-500/10 group-hover/row:border-indigo-500/20 transition-colors shadow-sm">
                                                <Zap className="w-5 h-5 text-gray-400 group-hover/row:text-indigo-500 transition-colors" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-900 dark:text-gray-100 font-black group-hover/row:text-indigo-500 transition-colors">
                                                    {item.model}
                                                </span>
                                                <span className="text-[9px] font-bold text-gray-400 mt-0.5">{item.provider}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex flex-col items-end gap-1.5">
                                            <div className="flex items-center gap-3">
                                                <span className="font-black text-gray-900 dark:text-white text-sm">
                                                    <NumericFormat
                                                        displayType="text"
                                                        value={item.revenue}
                                                        prefix="₦"
                                                        thousandSeparator={true}
                                                        decimalScale={0}
                                                    />
                                                </span>
                                                <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 group-hover/row:bg-emerald-500 group-hover/row:text-white transition-all duration-500">
                                                    <span className="text-[10px] font-black text-emerald-600 group-hover/row:text-white">
                                                        {Math.ceil(item.growth)}%
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-[9px] font-bold text-gray-400">
                                                <NumericFormat displayType="text" value={item.usage} thousandSeparator decimalScale={0} /> Total Uses
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Card>
    )
}
