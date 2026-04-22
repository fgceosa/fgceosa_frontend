'use client'

import React from 'react'
import { Card } from '@/components/ui'
import { TrendingUp } from 'lucide-react'

import { PaymentAnalytics } from '@/services/admin/paymentsService'

export default function CollectionProgress({ analytics, isLoading }: { analytics: PaymentAnalytics | null, isLoading: boolean }) {
    if (isLoading) {
        return <div className="h-28 bg-gray-50 dark:bg-gray-800 rounded-3xl animate-pulse" />
    }

    const target = analytics?.targetAmount || 0
    const collected = analytics?.collectedAmount || 0
    const percentage = target > 0 ? Math.round((collected / target) * 100) : 0
    const shortfall = Math.max(0, target - collected)

    // Helper for formatting large currency
    const formatCurrency = (val: number) => {
        if (val >= 1000000) return `₦${(val / 1000000).toFixed(1)}M`
        if (val >= 1000) return `₦${(val / 1000).toFixed(0)}K`
        return `₦${val}`
    }

    return (
        <div className="p-8 bg-white dark:bg-gray-800 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-48 h-48 bg-[#8B0000]/5 rounded-full blur-3xl group-hover:bg-[#8B0000]/10 transition-all duration-700" />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-20">
                <div className="space-y-3 shrink-0">
                    <h3 className="text-xl font-black text-[#8B0000] flex items-center gap-3 tracking-tight">
                         <div className="p-2 bg-[#8B0000]/5 rounded-xl">
                            <TrendingUp className="w-5 h-5 text-[#8B0000]" />
                         </div>
                         Annual dues progress
                    </h3>
                    <div className="flex items-center gap-2.5">
                        <p className="text-[12px] font-bold text-gray-500 capitalize tracking-tight">
                            Target: <span className="text-gray-900 dark:text-white font-bold ml-1">{formatCurrency(target)}</span>
                        </p>
                        <div className="w-1 h-1 rounded-full bg-gray-200 dark:bg-gray-700" />
                        <span className="text-[10px] font-bold text-emerald-600 capitalize tracking-tight bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-xl border border-emerald-100 dark:border-emerald-800 shadow-sm">
                            {percentage}% achieved
                        </span>
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between text-[11px] capitalize font-bold tracking-tight mb-2 px-1">
                        <span className="text-gray-400">Total collected: <span className="text-emerald-700 font-bold ml-1.5 underline decoration-emerald-100 underline-offset-4">{formatCurrency(collected)}</span></span>
                        <span className="text-gray-400">Shortfall gap: <span className="text-rose-600 font-bold ml-1.5 underline decoration-rose-100 underline-offset-4">{formatCurrency(shortfall)}</span></span>
                    </div>
                    <div className="relative h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex shadow-inner border border-gray-200/20 dark:border-gray-700/50">
                        <div 
                            className="h-full bg-gradient-to-r from-[#8B0000] to-[#B01A1A] rounded-full shadow-[0_4px_12px_rgba(139,0,0,0.3)] transition-all duration-1000 ease-out relative z-10" 
                            style={{ width: `${percentage}%` }}
                        />
                        <div 
                            className="h-full bg-gray-200/50 dark:bg-gray-800" 
                            style={{ width: `${100 - percentage}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
