'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import {
    fetchBulkTransactions,
    selectBulkTransactions,
    selectTransactionsTotal,
    selectTransactionsLoading,
    selectBulkCreditsError,
} from '@/store/slices/bulkCredits'
import { Card } from '@/components/ui'
import QorebitLoading from '@/components/shared/QorebitLoading'
import { History, Clock, ArrowRightLeft, Activity, Globe, Database, Download, Calendar, Filter, CheckCircle2 } from 'lucide-react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import classNames from '@/utils/classNames'
import { TransactionStatusBadge } from './TransactionStatusBadge'
import type { TreasuryType } from '../../../types'

dayjs.extend(relativeTime)

interface TransactionsTabProps {
    treasuryType?: TreasuryType
    organizationId?: string
}

export default function TransactionsTab({ treasuryType = 'platform', organizationId }: TransactionsTabProps) {
    const dispatch = useAppDispatch()
    const [pageIndex, setPageIndex] = useState(0)
    const [pageSize] = useState(10)

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    // Reset to first page when filters change
    useEffect(() => {
        setPageIndex(0)
    }, [startDate, endDate, organizationId])

    const transactions = useAppSelector(selectBulkTransactions)
    const total = useAppSelector(selectTransactionsTotal)
    const loading = useAppSelector(selectTransactionsLoading)
    const error = useAppSelector(selectBulkCreditsError)

    useEffect(() => {
        // Pass treasuryType and organizationId to filter transactions on the backend
        dispatch(fetchBulkTransactions({ pageIndex, pageSize, startDate, endDate, organizationId }))
            .unwrap()
            .catch((err) => {
                if (err?.response?.status === 404 || err?.message?.includes('404')) {
                    console.log('Bulk credits transactions endpoint not available yet')
                }
            })
    }, [dispatch, pageIndex, pageSize, treasuryType, startDate, endDate, organizationId])

    const totalPages = Math.ceil(total / pageSize)

    // Filter transactions client-side if needed (mock logic)
    // In production, the API would handle this based on the authenticated user's scope and the treasury ID
    const displayTransactions = transactions
    // .filter(t => ... ) 

    const handleExport = () => {
        if (transactions.length === 0) return

        const headers = ['Date', 'Type', 'Amount (NGN)', 'Credits', 'Recipient', 'Status']
        const rows = transactions.map(tx => [
            dayjs(tx.date).format('YYYY-MM-DD HH:mm:ss'),
            tx.type || 'Transfer',
            tx.amount || 0,
            tx.credits || 0,
            tx.recipient || 'Internal',
            tx.status
        ])

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', `qorebit-statement-${dayjs().format('YYYY-MM-DD')}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <Card className="p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 transition-all">
                <div className="p-6 md:p-8 border-b border-gray-50 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-50/30 dark:bg-gray-800/10">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Transaction History</h3>
                        <p className="text-xs font-bold text-gray-500 mt-1">
                            Platform allocation history {total > 0 && `(${total} total)`}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-[1.25rem] p-1.5 shadow-inner group transition-all duration-300">
                            <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-900 rounded-[1rem] shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:border-primary/30">
                                <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <Calendar className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-gray-900 dark:text-gray-100 leading-none mb-1">Start Date</span>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="bg-transparent text-[11px] font-bold text-gray-700 dark:text-gray-200 focus:outline-none cursor-pointer appearance-none"
                                    />
                                </div>
                            </div>

                            <div className="px-3 flex items-center justify-center">
                                <div className="w-4 h-[1px] bg-gray-300 dark:bg-gray-700" />
                            </div>

                            <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-900 rounded-[1rem] shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:border-primary/30">
                                <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-gray-900 dark:text-gray-100 leading-none mb-1">End Date</span>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="bg-transparent text-[11px] font-bold text-gray-700 dark:text-gray-200 focus:outline-none cursor-pointer appearance-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {(startDate || endDate) && (
                            <button
                                className="h-12 px-5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-800/50 rounded-2xl flex items-center gap-2 text-xs font-black hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all animate-in zoom-in duration-300 shadow-sm"
                                onClick={() => { setStartDate(''); setEndDate(''); }}
                            >
                                <Filter className="w-3.5 h-3.5" />
                                <span>Reset Filter</span>
                            </button>
                        )}

                        <button
                            onClick={handleExport}
                            disabled={transactions.length === 0}
                            className="h-14 px-8 bg-primary text-white border border-primary rounded-[1.25rem] flex items-center gap-3 text-xs font-black hover:bg-primary-deep transition-all shadow-xl shadow-primary/20 active:scale-95 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download className="w-4 h-4" />
                            <span>Export Statement</span>
                        </button>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    {loading && transactions.length === 0 ? (
                        <div className="flex items-center justify-center py-20">
                            <QorebitLoading />
                        </div>
                    ) : error && !error.includes('404') && !error.includes('Not Found') ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <p className="text-rose-500 font-bold text-sm mb-2">Failed to load transactions</p>
                            <p className="text-gray-500 text-xs">{error}</p>
                            <button
                                onClick={() => dispatch(fetchBulkTransactions({ pageIndex, pageSize }))}
                                className="mt-4 px-6 py-2 bg-primary text-white rounded-xl text-xs font-black hover:bg-primary-deep transition-all shadow-lg shadow-primary/20"
                            >
                                Retry Sync
                            </button>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <History className="w-16 h-16 text-gray-200 dark:text-gray-800 mb-4" />
                            <p className="text-gray-500 font-black text-sm capitalize tracking-tight">No activity recorded</p>
                            <p className="text-gray-400 text-xs mt-1 italic">Distributed credits will appear here</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[1000px]">
                                    <thead>
                                        <tr className="bg-gray-50/50 dark:bg-gray-800/30">
                                            <TableHead icon={Clock} label="Timestamp" />
                                            <TableHead icon={ArrowRightLeft} label="Category" />
                                            <TableHead icon={Activity} label="Amount" />
                                            <TableHead icon={Database} label="Credits" />
                                            <TableHead icon={Globe} label="Entity / Recipient" />
                                            <TableHead icon={CheckCircle2} label="Status" centered />
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {transactions.map((tx, idx) => (
                                            <tr key={tx.id || idx} className="group hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-all duration-200">
                                                <td className="px-6 py-6">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-sm text-gray-900 dark:text-gray-100 font-bold tracking-tight">
                                                            {dayjs(tx.date).format('MMM D, YYYY')}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 font-medium">
                                                            {dayjs(tx.date).format('h:mm A')}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 font-medium text-gray-600 dark:text-gray-400 text-sm">
                                                    {tx.type || 'Transfer'}
                                                </td>
                                                <td className="px-6 py-6 font-black text-emerald-600 dark:text-emerald-400 text-sm tracking-tight">
                                                    ₦{tx.amount?.toLocaleString() || '0'}
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                                                            {tx.credits?.toLocaleString() || '0'}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-primary">Credits</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 font-bold text-gray-700 dark:text-gray-300 text-sm">
                                                    {tx.recipient || 'Internal'}
                                                </td>
                                                <td className="px-6 py-6 text-center">
                                                    <TransactionStatusBadge status={tx.status} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <Pagination
                                    pageIndex={pageIndex}
                                    pageSize={pageSize}
                                    total={total}
                                    totalPages={totalPages}
                                    loading={loading}
                                    onPageChange={setPageIndex}
                                />
                            )}
                        </>
                    )}
                </div>
            </Card>
        </div>
    )
}

function TableHead({ icon: Icon, label, centered }: { icon: any, label: string, centered?: boolean }) {
    return (
        <th className={classNames("px-6 py-5 text-left", centered && "text-center")}>
            <div className={classNames("flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-gray-100", centered && "justify-center")}>
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
            </div>
        </th>
    )
}

function Pagination({
    pageIndex,
    pageSize,
    total,
    totalPages,
    loading,
    onPageChange
}: {
    pageIndex: number,
    pageSize: number,
    total: number,
    totalPages: number,
    loading: boolean,
    onPageChange: (p: number) => void
}) {
    return (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs font-bold text-gray-600 dark:text-gray-400">
                Showing {pageIndex * pageSize + 1} - {Math.min((pageIndex + 1) * pageSize, total)} of {total}
            </p>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(pageIndex - 1)}
                    disabled={pageIndex === 0 || loading}
                    className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                    Previous
                </button>
                <div className="px-3 py-2 bg-primary/5 rounded-xl border border-primary/10">
                    <span className="text-xs font-bold text-primary">
                        {pageIndex + 1} / {totalPages}
                    </span>
                </div>
                <button
                    onClick={() => onPageChange(pageIndex + 1)}
                    disabled={pageIndex >= totalPages - 1 || loading}
                    className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                    Next
                </button>
            </div>
        </div>
    )
}
