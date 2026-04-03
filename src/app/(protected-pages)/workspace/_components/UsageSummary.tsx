'use client'

import React from 'react'
import { Card } from '@/components/ui'
import { TrendingUp, Coins } from 'lucide-react'

export default function UsageSummary() {
    return (
        <Card className="rounded-[2.5rem] border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-8">
            <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 italic tracking-tight mb-8">
                Usage Summary
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tokens Card */}
                <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-blue-600">Tokens Used</span>
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">385K</h4>
                        <p className="text-[10px] font-bold text-gray-400">This Month</p>
                    </div>
                    {/* Mini Bar Chart Mockup */}
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

                {/* Credit Allocation Card */}
                <div className="p-6 bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-orange-600">Credit Allocation</span>
                        <Coins className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">7,500</h4>
                        <p className="text-[10px] font-bold text-gray-400">Credits To Week</p>
                    </div>
                    {/* Mini Bar Chart Mockup */}
                    <div className="flex items-end gap-1 h-12 pt-2">
                        {[30, 50, 40, 70, 60, 40, 55].map((h, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-orange-600/20 rounded-t-sm hover:bg-orange-600 transition-colors cursor-pointer"
                                style={{ height: `${h}%` }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    )
}
