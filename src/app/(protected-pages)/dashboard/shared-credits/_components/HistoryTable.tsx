'use client'

import { useMemo } from 'react'
import { Button, Tag, toast, Notification, Avatar } from '@/components/ui'
import { Download, ExternalLink, User, Clock, Zap, Activity, ArrowUpRight } from 'lucide-react'
import DataTable, { ColumnDef } from '@/components/shared/DataTable'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import type { CreditTransaction } from '../types'
import classNames from '@/utils/classNames'
import { NAIRA_TO_USD_RATE, CURRENCY_SYMBOL } from '@/constants/currency.constant'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'

dayjs.extend(relativeTime)
dayjs.extend(utc)

/**
 * Safely parse a server timestamp as UTC and convert to local time.
 * Handles both 'Z'-suffixed and bare ISO strings from the backend.
 */
const parseTs = (ts: string | undefined) => {
    if (!ts) return dayjs()
    // If the string already has a timezone offset/Z, parse directly.
    // Otherwise, treat it as UTC (append Z) so dayjs doesn't misread it as local.
    const normalized = /[Zz]$|[+-]\d{2}:?\d{2}$/.test(ts) ? ts : `${ts}Z`
    return dayjs.utc(normalized).local()
}

function TransactionStatusBadge({ status }: { status: string }) {
    const statusLower = status.toLowerCase()
    const isCompleted = statusLower === 'completed'
    const isPending = statusLower === 'pending'

    return (
        <div className={classNames(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border transition-all duration-300",
            isCompleted
                ? "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30 shadow-sm shadow-green-200/20"
                : isPending
                    ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/30 shadow-sm shadow-amber-200/20"
                    : "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30 shadow-sm shadow-red-200/20"
        )}>
            <div className={classNames(
                "w-1.5 h-1.5 rounded-full animate-pulse",
                isCompleted ? "bg-green-600" : isPending ? "bg-amber-500" : "bg-red-600"
            )} />
            <span>{status}</span>
        </div>
    )
}

interface HistoryTableProps {
    transactions: CreditTransaction[]
    total: number
    isLoading: boolean
    pageIndex: number
    pageSize: number
}

export default function HistoryTable({
    transactions,
    total,
    isLoading,
    pageIndex,
    pageSize,
}: HistoryTableProps) {
    const { onAppendQueryParams } = useAppendQueryParams()

    const handleDownloadInvoice = (transactionId: string) => {
        toast.push(
            <Notification type="info">
                Invoice generation initiated for transaction: {transactionId.slice(0, 8)}
            </Notification>,
            { placement: 'top-center' }
        )
    }

    const columns = useMemo<ColumnDef<CreditTransaction>[]>(
        () => [
            {
                header: () => (
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-900 dark:text-gray-100">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Date & Time</span>
                    </div>
                ),
                accessorKey: 'createdAt',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm text-gray-900 dark:text-gray-100 font-bold">
                            {parseTs(row.original.createdAt).fromNow()}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                            {parseTs(row.original.createdAt).format('MMM D, HH:mm:ss')}
                        </span>
                    </div>
                ),
            },
            {
                header: () => (
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-900 dark:text-gray-100">
                        <User className="w-3.5 h-3.5" />
                        <span>Recipient</span>
                    </div>
                ),
                accessorKey: 'recipientName',
                cell: ({ row }) => (
                    <div className="flex items-center gap-3">
                        <Avatar
                            size={36}
                            alt={row.original.recipientName || 'U'}
                            className="shrink-0 ring-2 ring-gray-100 dark:ring-gray-800"
                        >
                            {(row.original.recipientName || 'U').charAt(0).toUpperCase()}
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-primary transition-colors truncate">
                                {row.original.recipientName || 'Anonymous Agent'}
                            </span>
                            <span className="text-[11px] font-bold text-gray-400 truncate">
                                {row.original.recipientEmail}
                            </span>
                        </div>
                    </div>
                ),
            },
            {
                header: () => (
                    <div className="flex items-center justify-end gap-2 text-[10px] font-black text-gray-900 dark:text-gray-100">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Amount</span>
                    </div>
                ),
                accessorKey: 'amount',
                cell: ({ row }) => (
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1.5">
                            <ArrowUpRight className="w-3.5 h-3.5 text-red-500" />
                            <span className="text-sm font-black text-red-600 dark:text-red-400">
                                -{row.original.amount.toLocaleString()}
                            </span>
                        </div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            {CURRENCY_SYMBOL}{(row.original.amount * NAIRA_TO_USD_RATE).toLocaleString()} NGN
                        </span>
                    </div>
                ),
            },
            {
                header: () => (
                    <div className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-900 dark:text-gray-100">
                        <Activity className="w-3.5 h-3.5" />
                        <span>Status</span>
                    </div>
                ),
                accessorKey: 'status',
                cell: ({ row }) => (
                    <div className="flex justify-center">
                        <TransactionStatusBadge status={row.original.status} />
                    </div>
                ),
            },
            {
                header: () => (
                    <div className="text-center text-[10px] font-black text-gray-900 dark:text-gray-100">
                        <span>Action</span>
                    </div>
                ),
                id: 'action',
                cell: ({ row }) => (
                    <div className="flex items-center justify-center gap-2">
                        <button
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white border border-primary/10 transition-all duration-300"
                            onClick={() => handleDownloadInvoice(row.original.id)}
                            title="Download Invoice"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                        <button
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-800 transition-all duration-300"
                            title="Analytics"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </button>
                    </div>
                ),
            },
        ],
        [],
    )

    const handlePaginationChange = (page: number) => {
        onAppendQueryParams({
            pageIndex: String(page),
        })
    }

    const handleSelectChange = (value: number) => {
        onAppendQueryParams({
            pageSize: String(value),
            pageIndex: '1',
        })
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
                <thead>
                    <tr className="bg-gray-50/50 dark:bg-gray-800/30">
                        {columns.map((col, i) => (
                            <th
                                key={i}
                                className={classNames(
                                    "py-5",
                                    i === 0 ? "px-8 text-left w-[20%]" :
                                        i === 1 ? "px-6 text-left w-[30%]" :
                                            i === 2 ? "px-6 text-right w-[20%]" :
                                                i === 3 ? "px-6 text-center w-[15%]" :
                                                    "px-8 text-center w-[15%]"
                                )}
                            >
                                {typeof col.header === 'function' ? col.header({} as any) : col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {isLoading ? (
                        <tr>
                            <td colSpan={5} className="py-20 text-center text-gray-400 font-bold text-[10px]">
                                Synchronizing Ledger...
                            </td>
                        </tr>
                    ) : transactions.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="py-20 text-center text-gray-400 font-bold text-[10px]">
                                No Transactions Found
                            </td>
                        </tr>
                    ) : (
                        transactions.map((transaction) => (
                            <tr
                                key={transaction.id}
                                className="group hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-all duration-200"
                            >
                                <td className="px-8 py-6">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm text-gray-900 dark:text-gray-100 font-bold">
                                            {parseTs(transaction.createdAt).fromNow()}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-black">
                                            {parseTs(transaction.createdAt).format('MMM D, HH:mm:ss')}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <div className="flex items-center gap-3">
                                        <Avatar
                                            size={36}
                                            alt={transaction.recipientName || 'U'}
                                            className="shrink-0 ring-2 ring-gray-100 dark:ring-gray-800"
                                        >
                                            {(transaction.recipientName || 'U').charAt(0).toUpperCase()}
                                        </Avatar>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">
                                                {transaction.recipientName || 'Anonymous Agent'}
                                            </span>
                                            <span className="text-[11px] font-bold text-gray-400 truncate">
                                                {transaction.recipientEmail}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6 text-right">
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-1.5">
                                            <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
                                            <span className="text-sm font-black text-gray-900 dark:text-white">
                                                {transaction.amount.toLocaleString()}
                                            </span>
                                        </div>
                                        <span className="text-[9px] font-black text-gray-400">
                                            {CURRENCY_SYMBOL}{(transaction.amount * NAIRA_TO_USD_RATE).toLocaleString()} NGN
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-6 text-center">
                                    <TransactionStatusBadge status={transaction.status} />
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white border border-primary/10 transition-all duration-300"
                                            onClick={() => handleDownloadInvoice(transaction.id)}
                                            title="Download Invoice"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-800 transition-all duration-300"
                                            title="Analytics"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}
