'use client'

import { useState, useEffect } from 'react'
import { Card, Button } from '@/components/ui'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { AIEngineService } from '@/services/AIEngineService'
import Loading from '@/components/shared/Loading'
import classNames from '@/utils/classNames'
import { ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react'

dayjs.extend(relativeTime)

interface Transaction {
    id: string
    transaction_type: string
    amount: number
    balance_after: number
    description: string
    created_at: string
}

export default function TransactionHistory() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [skip, setSkip] = useState(0)
    const limit = 5

    const fetchTransactions = async () => {
        try {
            setIsLoading(true)
            const response = await AIEngineService.getCreditTransactions(skip, limit)
            setTransactions(response?.transactions || [])
            setTotal(response?.total || 0)
        } catch (error) {
            console.error('Failed to fetch transactions:', error)
            setTransactions([])
            setTotal(0)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchTransactions()
    }, [skip])

    const getTransactionStyle = (type: string, amount: number) => {
        const isDebit = type === 'usage' || (type === 'adjustment' && amount < 0)

        if (isDebit) {
            return {
                icon: <ArrowUpRight className="w-4 h-4" />,
                bg: 'bg-red-50 dark:bg-red-500/10',
                text: 'text-red-600 dark:text-red-400',
                iconBg: 'bg-red-100 dark:bg-red-500/20'
            }
        }

        switch (type) {
            case 'purchase':
            case 'bonus':
            case 'refund':
            case 'adjustment':
                return {
                    icon: <ArrowDownRight className="w-4 h-4" />,
                    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
                    text: 'text-emerald-600 dark:text-emerald-400',
                    iconBg: 'bg-emerald-100 dark:bg-emerald-500/20'
                }
            default:
                return {
                    icon: <RefreshCw className="w-4 h-4" />,
                    bg: 'bg-gray-50 dark:bg-gray-800/40',
                    text: 'text-gray-600 dark:text-gray-400',
                    iconBg: 'bg-gray-100 dark:bg-gray-800'
                }
        }
    }

    if (isLoading && transactions.length === 0) {
        return (
            <Card className="shadow-lg border-none bg-white dark:bg-gray-900 overflow-hidden h-full">
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loading loading />
                </div>
            </Card>
        )
    }

    return (
        <Card className="shadow-lg border-none bg-white dark:bg-gray-900 overflow-hidden h-full flex flex-col">
            <div className="p-6 pb-4 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        Transactions
                        {transactions.length > 0 && (
                            <span className="text-[10px] font-bold bg-[#0055BA]/10 text-[#0055BA] px-2 py-0.5 rounded-full">
                                {total} Total
                            </span>
                        )}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Recent activity and credit history
                    </p>
                </div>
                <button
                    onClick={fetchTransactions}
                    disabled={isLoading}
                    className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700 disabled:opacity-50"
                >
                    <RefreshCw className={classNames("w-4 h-4 text-gray-500 transition-transform duration-500", isLoading && "animate-spin")} />
                </button>
            </div>

            <div className="px-6 py-2 flex-1">
                {transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center opacity-60">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-4 border border-gray-100 dark:border-gray-700">
                            <RefreshCw className="w-10 h-10 text-gray-300" />
                        </div>
                        <h4 className="text-gray-900 dark:text-white font-bold">No activity found</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[200px] mt-2 leading-relaxed">
                            Your transaction history will appear here once you start using the platform.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {transactions.map((transaction) => {
                            const style = getTransactionStyle(transaction.transaction_type, transaction.amount)
                            const isIncrease = ['purchase', 'bonus', 'refund'].includes(transaction.transaction_type) || (transaction.transaction_type === 'adjustment' && transaction.amount > 0)

                            return (
                                <div
                                    key={transaction.id}
                                    className={classNames(
                                        "group relative p-4 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-[#0055BA]/20 transition-all duration-300 overflow-hidden",
                                        style.bg,
                                        "hover:bg-white dark:hover:bg-gray-800/60"
                                    )}
                                >
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={classNames(
                                            "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-sm",
                                            style.iconBg,
                                            style.text
                                        )}>
                                            {style.icon}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <h5 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                                    {transaction.description || transaction.transaction_type}
                                                </h5>
                                                <span className={classNames(
                                                    "text-sm font-black whitespace-nowrap",
                                                    style.text
                                                )}>
                                                    {isIncrease ? '+' : '-'}{Math.abs(transaction.amount).toFixed(2)}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between text-[11px]">
                                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium">
                                                    <span className="capitalize">{transaction.transaction_type}</span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                                                    <span>{dayjs(transaction.created_at).fromNow()}</span>
                                                </div>
                                                <span className="hidden sm:inline text-gray-400 dark:text-gray-500 font-bold">
                                                    Bal: {transaction.balance_after.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0055BA]/5 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out pointer-events-none" />
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {transactions.length > 0 && (
                <div className="p-6 pt-2 bg-gray-50/50 dark:bg-gray-800/20 border-t border-gray-100 dark:border-gray-800 mt-auto">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            Page {Math.floor(skip / limit) + 1} of {Math.ceil(total / limit)}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSkip(Math.max(0, skip - limit))}
                                disabled={skip === 0}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm active:scale-95"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setSkip(skip + limit)}
                                disabled={skip + limit >= total}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm active:scale-95"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    )
}
