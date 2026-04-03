'use client'

import React from 'react'
import { Card } from '@/components/ui'
import { TrendingUp, BarChart2 } from 'lucide-react'

interface MemberUsageSummaryProps {
    tokensUsed?: number
    totalRequests?: number
    isLoading?: boolean
}

const formatValue = (val: number) => {
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M'
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K'
    return val.toString()
}

export default function MemberUsageSummary({ tokensUsed = 0, totalRequests = 0, isLoading }: MemberUsageSummaryProps) {
    return (
        <Card className="rounded-[2.5rem] border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-8 h-full">
            <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-8">
                Usage Summary
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tokens Card */}
                <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-700 dark:text-blue-400">Tokens Used</span>
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-3xl font-black text-gray-900 dark:text-gray-100">
                            {isLoading ? '...' : formatValue(tokensUsed)}
                        </h4>
                        <p className="text-xs font-bold text-gray-900 dark:text-gray-100">this month</p>
                    </div>
                    {/* Mini Bar Chart Mockup - keeping it for aesthetic unless I have real history */}
                    <div className="flex items-end gap-1 h-12 pt-2">
                        {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-blue-600/20 rounded-t-sm hover:bg-blue-600 transition-colors cursor-pointer"
                                style={{ height: `${h}%` }}
                            />
                        ))}
                    </div>
                </div>

                {/* Request Volume Card */}
                <div className="p-6 bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-purple-700 dark:text-purple-400">Request Volume</span>
                        <BarChart2 className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-3xl font-black text-gray-900 dark:text-gray-100">
                            {isLoading ? '...' : formatValue(totalRequests)}
                        </h4>
                        <p className="text-xs font-bold text-gray-900 dark:text-gray-100">total requests</p>
                    </div>
                    {/* Mini Bar Chart Mockup */}
                    <div className="flex items-end gap-1 h-12 pt-2">
                        {[20, 45, 30, 60, 80, 55, 40].map((h, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-purple-600/20 rounded-t-sm hover:bg-purple-600 transition-colors cursor-pointer"
                                style={{ height: `${h}%` }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    )
}
