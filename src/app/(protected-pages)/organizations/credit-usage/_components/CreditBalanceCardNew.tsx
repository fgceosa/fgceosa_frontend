'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, Spinner } from '@/components/ui'
import { Zap, History, TrendingUp, Info } from 'lucide-react'
import classNames from '@/utils/classNames'
import { useOrganization } from '@/app/(protected-pages)/organizations/OrganizationContext'
import { selectOrganizationCreditBalance, selectOrganizationUsageSummary } from '@/store/slices/organization/organizationSelectors'
import { useAppSelector, useAppDispatch } from '@/store'
import { fetchOrganizationCreditBalance, fetchOrganizationUsageSummary } from '@/store/slices/organization/organizationThunk'
import { NAIRA_TO_CREDIT_RATE } from '@/constants/currency.constant'
import { selectWalletBalance } from '@/store/slices/wallet/walletSelectors'
import { fetchWalletBalanceAsync } from '@/store/slices/wallet/walletThunks'
import { useHasAuthority } from '@/utils/hooks/useAuthorization'

const CreditBalanceCardNew = () => {
    const dispatch = useAppDispatch()
    const { organizationId } = useOrganization()
    const orgBalance = useAppSelector(selectOrganizationCreditBalance)
    const personalBalance = useAppSelector(selectWalletBalance)
    const usageSummary = useAppSelector(selectOrganizationUsageSummary)

    const isSuperAdmin = useHasAuthority(['org_super_admin', 'org_admin', 'platform_super_admin', 'platform_admin'])

    const [monthlySpending, setMonthlySpending] = useState<number>(0)
    const [isLoading, setIsLoading] = useState(false)

    const fetchData = useCallback(() => {
        setIsLoading(true)
        const promises = []

        // Always fetch personal wallet balance
        promises.push(dispatch(fetchWalletBalanceAsync()))

        if (isSuperAdmin && organizationId) {
            promises.push(dispatch(fetchOrganizationCreditBalance(organizationId)))
            promises.push(dispatch(fetchOrganizationUsageSummary({ organizationId })))
        }

        Promise.all(promises).finally(() => setIsLoading(false))
    }, [organizationId, dispatch, isSuperAdmin])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Listen for global wallet updates
    useEffect(() => {
        const handleWalletUpdate = () => {
            fetchData()
        }
        window.addEventListener('wallet-updated', handleWalletUpdate)
        return () => window.removeEventListener('wallet-updated', handleWalletUpdate)
    }, [fetchData])

    useEffect(() => {
        if (usageSummary && isSuperAdmin) {
            setMonthlySpending(usageSummary.totalUsage || 0)
        }
    }, [usageSummary, isSuperAdmin])

    const orgCredits = orgBalance?.balance ?? null
    const personalCredits = personalBalance?.ai_credits ?? 0
    const displayCredits = isSuperAdmin ? orgCredits : personalCredits

    if (isLoading && !displayCredits && displayCredits !== 0) {
        return (
            <div className="flex items-center justify-center py-24 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50">
                <Spinner size={40} className="text-primary" />
            </div>
        )
    }

    const usagePercent = displayCredits ? Math.min(100, (monthlySpending / (monthlySpending + displayCredits)) * 100) : 0

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
                            <p className="text-[10px] font-black text-white/60">Available Credits</p>
                            <div className="flex items-baseline gap-2">
                                <h2 className="text-3xl font-black text-white">
                                    {displayCredits != null ? displayCredits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                                </h2>
                                <span className="text-xs font-bold text-white/60">Credits</span>
                            </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-white/40">Naira equivalent</span>
                                <span className="text-sm font-bold text-white">₦{displayCredits != null ? (displayCredits * NAIRA_TO_CREDIT_RATE).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</span>
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
                                Operational Usage
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400">Monthly Spending</p>
                                <div className="flex items-baseline gap-2">
                                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                                        {monthlySpending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </h2>
                                    <span className="text-xs font-bold text-gray-400">Consumed</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-black text-gray-400">
                                    <span>Resource Pool</span>
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
                                (displayCredits || 0) / (monthlySpending / (new Date().getDate()) || 1) < 7
                                    ? "bg-rose-50 dark:bg-rose-900/20 text-rose-600 border-rose-100"
                                    : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100"
                            )}>
                                {(displayCredits || 0) / (monthlySpending / (new Date().getDate()) || 1) < 7 ? 'Review Required' : 'Velocity Stable'}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-0">
                                <p className="text-[10px] font-black text-gray-400">Avg. Daily Burn</p>
                                <div className="flex items-baseline gap-2">
                                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                                        {(monthlySpending / (new Date().getDate())).toLocaleString(undefined, { maximumFractionDigits: 1 })}
                                    </h2>
                                    <span className="text-xs font-bold text-gray-400">Units / Day</span>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[9px] font-black text-gray-400">Forecasted Exhaustion</span>
                                    <span className="text-[10px] font-black text-primary whitespace-nowrap">
                                        {Math.floor((displayCredits || 0) / (monthlySpending / (new Date().getDate()) || 1))} Days Left
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={classNames(
                                            "h-full rounded-full transition-all duration-1000",
                                            (displayCredits || 0) / (monthlySpending / (new Date().getDate()) || 1) < 7 ? "bg-rose-500" : "bg-primary"
                                        )}
                                        style={{ width: `${Math.min(100, ((displayCredits || 0) / (monthlySpending / (new Date().getDate()) || 1)) / 30 * 100)}%` }}
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

export default CreditBalanceCardNew
