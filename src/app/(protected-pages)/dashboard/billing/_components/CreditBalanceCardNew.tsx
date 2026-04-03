'use client'

import { useEffect, useState } from 'react'
import { Zap, History, RefreshCw, TrendingUp, Clock, Info } from 'lucide-react'
import { Card, Progress, Button, Spinner } from '@/components/ui'
import { AIEngineService } from '@/services/AIEngineService'
import { apiGetDashboardMetrics } from '@/services/admindashboard/dashboardService'
import classNames from '@/utils/classNames'

interface CreditBalance {
    ai_credits: number
    naira_equivalent: number
    conversion_rate: number
    last_updated: string
}

const CreditBalanceCard = () => {
    const [balance, setBalance] = useState<CreditBalance | null>(null)
    const [monthlySpending, setMonthlySpending] = useState<number>(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [balanceData, metricsData] = await Promise.all([
                AIEngineService.getCreditBalance(),
                apiGetDashboardMetrics('month')
            ])
            setBalance(balanceData)
            setMonthlySpending((metricsData as any).spending || (metricsData as any).totalRevenue || 0)
        } catch (error) {
            console.error('Error fetching billing data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await fetchData()
        setIsRefreshing(false)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50">
                <Spinner size={40} className="text-primary" />
            </div>
        )
    }

    const usagePercent = balance?.ai_credits ? Math.min(100, (monthlySpending / (monthlySpending + balance.ai_credits)) * 100) : 0

    return (
        <div className="space-y-6">


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI Credits Core Balance */}
                <Card className="p-0 border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-gradient-to-br from-[#0055BA] to-[#003d85] rounded-3xl overflow-hidden group">
                    <div className="p-5 relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <Zap className="w-24 h-24 text-white" />
                        </div>

                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black text-white border border-white/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Active
                            </div>
                            <Zap className="w-5 h-5 text-amber-300 animate-pulse" />
                        </div>

                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-white/60">Your Credits</p>
                            <div className="flex items-baseline gap-2">
                                <h2 className="text-3xl font-black text-white">
                                    {balance?.ai_credits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                </h2>
                                <span className="text-xs font-bold text-white/60">Credits</span>
                            </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-white/40">Total Value</span>
                                <span className="text-sm font-bold text-white">₦{balance?.naira_equivalent.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</span>
                            </div>
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-5 h-5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md" />
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Monthly Utilization */}
                <Card className="p-0 border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-9 h-9 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center border border-indigo-100 dark:border-indigo-800/50">
                                <History className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-full text-[10px] font-black text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50">
                                Usage Stats
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400">This Month</p>
                                <div className="flex items-baseline gap-2">
                                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                                        {monthlySpending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </h2>
                                    <span className="text-xs font-bold text-gray-400">Used</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-black text-gray-400">
                                    <span>Usage Balance</span>
                                    <span>{usagePercent.toFixed(1)}%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${usagePercent}%` }}
                                    />
                                </div>
                            </div>

                            <p className="text-[10px] font-bold text-gray-400 flex items-center gap-2">
                                <Info className="w-3 h-3" />
                                Resetting in {30 - new Date().getDate()} days
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Usage Velocity */}
                <Card className="p-0 border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-9 h-9 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center border border-amber-100 dark:border-amber-800/50">
                                <TrendingUp className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className={classNames(
                                "px-3 py-1 rounded-full text-[10px] font-black border",
                                (balance?.ai_credits || 0) / (monthlySpending / (new Date().getDate()) || 1) < 7
                                    ? "bg-rose-50 dark:bg-rose-900/20 text-rose-600 border-rose-100"
                                    : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100"
                            )}>
                                {(balance?.ai_credits || 0) / (monthlySpending / (new Date().getDate()) || 1) < 7 ? 'Low Balance' : 'Usage Trends'}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-0">
                                <p className="text-[10px] font-black text-gray-400">Avg. Daily Burn</p>
                                <div className="flex items-baseline gap-2">
                                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                                        {(monthlySpending / (new Date().getDate())).toLocaleString(undefined, { maximumFractionDigits: 1 })}
                                    </h2>
                                    <span className="text-xs font-bold text-gray-400">Credits / Day</span>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[9px] font-black text-gray-400">Time Left</span>
                                    <span className="text-[10px] font-black text-primary whitespace-nowrap">
                                        {Math.floor((balance?.ai_credits || 0) / (monthlySpending / (new Date().getDate()) || 1))} Days Left
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={classNames(
                                            "h-full rounded-full transition-all duration-1000",
                                            (balance?.ai_credits || 0) / (monthlySpending / (new Date().getDate()) || 1) < 7 ? "bg-rose-500" : "bg-primary"
                                        )}
                                        style={{ width: `${Math.min(100, ((balance?.ai_credits || 0) / (monthlySpending / (new Date().getDate()) || 1)) / 30 * 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default CreditBalanceCard
