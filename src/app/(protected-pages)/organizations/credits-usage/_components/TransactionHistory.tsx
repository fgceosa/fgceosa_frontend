'use client'

import { Button, Tag, Card, Pagination, Select } from '@/components/ui'
import { CreditTransaction } from '../types'
import { Download, History, Database, ArrowUpRight, ArrowDownLeft, FileText, Clock } from 'lucide-react'
import DataTable, { ColumnDef } from '@/components/shared/DataTable'
import { useMemo, useState, useEffect } from 'react'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import dayjs from 'dayjs'
import { CSVLink } from 'react-csv'
import { AIEngineService } from '@/services/AIEngineService'
import classNames from '@/utils/classNames'

type Props = {
    data?: CreditTransaction[]
    organizationId?: string
    isReadOnly?: boolean
}

const statusColor: Record<string, string> = {
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
}

const TransactionHistory = ({ data: initialData, organizationId, isReadOnly = false }: Props) => {
    const { onAppendQueryParams } = useAppendQueryParams()
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [transactions, setTransactions] = useState<CreditTransaction[]>(initialData || [])
    const [total, setTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const formatActivityType = (type: string) => {
        if (!type) return ''
        return type
            .toLowerCase()
            .replace(/_/g, ' ')
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setIsLoading(true)
                const skip = (pageIndex - 1) * pageSize
                const response = organizationId
                    ? await AIEngineService.getOrganizationCreditTransactions(organizationId, skip, pageSize)
                    : await AIEngineService.getCreditTransactions(skip, pageSize)

                const mappedTransactions: CreditTransaction[] = response.transactions.map((t: any) => {
                    return {
                        id: t.id,
                        date: t.created_at,
                        type: t.transaction_type,
                        amount: t.amount,
                        balance_after: t.balance_after,
                        status: 'Completed',
                        description: t.description || '',
                        user_name: t.user_name,
                        workspace_name: t.workspace_name,
                    }
                })

                setTransactions(mappedTransactions)
                setTotal(response.total)
            } catch (error) {
                console.error('Failed to fetch transactions:', error)
                if (initialData) setTransactions(initialData)
            } finally {
                setIsLoading(false)
            }
        }
        fetchTransactions()
    }, [pageIndex, pageSize, initialData, organizationId])

    const columns: ColumnDef<CreditTransaction>[] = useMemo(
        () => [
            {
                header: 'Timestamp',
                accessorKey: 'date',
                cell: (props) => {
                    const date = dayjs(props.row.original.date)
                    return (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700">
                                <Clock className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-900 dark:text-gray-100 font-bold text-xs tracking-tight">
                                    {date.format('MMM D, YYYY')}
                                </span>
                                <span className="text-[10px] text-gray-600 dark:text-gray-400 font-black leading-none">
                                    {date.format('h:mm a')}
                                </span>
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'Reference',
                accessorKey: 'id',
                cell: (props) => {
                    const id = props.row.original.id
                    return (
                        <code className="px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded text-xs font-black text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700">
                            TX-{id.slice(0, 8).toUpperCase()}
                        </code>
                    )
                }
            },
            {
                header: 'Activity',
                accessorKey: 'description',
                cell: (props) => {
                    const type = props.row.original.type
                    return (
                        <div className="flex flex-col gap-1 py-1">
                            <span className="text-xs font-black text-primary">
                                {formatActivityType(type)}
                            </span>
                            <span className="text-xs text-gray-900 dark:text-gray-100 font-bold tracking-tight truncate max-w-[200px]">
                                {props.row.original.description || 'System Event'}
                            </span>
                            {props.row.original.user_name && (
                                <span className="text-[10px] text-gray-500 font-medium">
                                    By: {props.row.original.user_name}
                                </span>
                            )}
                        </div>
                    )
                }
            },
            {
                header: 'Credits',
                accessorKey: 'amount',
                cell: (props) => {
                    const amount = Number(props.row.original.amount)
                    const isDebit = amount < 0
                    return (
                        <div className="flex items-center gap-2">
                            <div className={classNames(
                                "flex items-center justify-center w-6 h-6 rounded-lg",
                                isDebit ? "bg-rose-50 text-rose-500 dark:bg-rose-900/10" : "bg-emerald-50 text-emerald-500 dark:bg-emerald-900/10"
                            )}>
                                {isDebit ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                            </div>
                            <span className={classNames(
                                "font-black text-sm tracking-tighter",
                                isDebit ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                            )}>
                                {isDebit ? '' : '+'}{amount.toLocaleString()}
                            </span>
                        </div>
                    )
                },
            },
            {
                header: 'New Balance',
                accessorKey: 'balance_after',
                cell: (props) => {
                    const balance = props.row.original.balance_after
                    return (
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-black text-gray-900 dark:text-white tracking-tighter">
                                {balance !== undefined ? balance.toLocaleString() : '-'}
                            </span>
                            <span className="text-[10px] font-black text-gray-600 dark:text-gray-400 italic leading-none">Resource Pool</span>
                        </div>
                    )
                }
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const status = props.row.original.status
                    return (
                        <div className={classNames(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border transition-all duration-300",
                            statusColor[status]
                        )}>
                            <div className={classNames(
                                "w-1.5 h-1.5 rounded-full animate-pulse",
                                status === 'Completed' ? "bg-emerald-500" : "bg-blue-500"
                            )} />
                            <span>{status}</span>
                        </div>
                    )
                },
            },
        ],
        [],
    )

    return (
        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 overflow-hidden">
            <div className="p-10 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-8 bg-primary rounded-full" />
                    <div className="space-y-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Transaction History</h3>
                        <p className="text-[11px] font-bold text-gray-400 leading-none">
                            {total} Total Transactions
                        </p>
                    </div>
                </div>

                {!isReadOnly && (
                    <div className="flex items-center gap-3">
                        <CSVLink filename="usage-history.csv" data={transactions}>
                            <Button
                                variant="plain"
                                className="h-12 px-8 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 font-bold text-xs rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary/20 transition-all flex items-center gap-3 group"
                            >
                                <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Download Records
                            </Button>
                        </CSVLink>
                    </div>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-50 dark:border-gray-800">
                            {columns.map((col, idx) => (
                                <th key={idx} className={classNames(
                                    "px-10 py-5 text-xs font-black text-gray-900 dark:text-gray-100",
                                    (col.header === 'Status' || col.header === 'New Balance') && "text-right"
                                )}>
                                    {col.header as string}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                        {isLoading ? (
                            <tr>
                                <td colSpan={columns.length} className="px-10 py-20 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-10 h-10 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                                        <span className="text-xs font-bold text-gray-900 dark:text-gray-100">Loading ledger...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : transactions.length > 0 ? (
                            transactions.map((tx) => (
                                <tr key={tx.id} className="group hover:bg-gray-50/30 dark:hover:bg-gray-800/10 transition-all duration-300">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center group-hover:border-primary/20 transition-colors">
                                                <Clock className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-950 dark:text-white">
                                                    {dayjs(tx.date).format('MMM D, YYYY')}
                                                </span>
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 leading-none mt-1">
                                                    {dayjs(tx.date).format('h:mm a')}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 font-mono text-xs font-black text-gray-700 dark:text-gray-300">
                                        <span className="px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700">
                                            TX-{tx.id.slice(0, 8).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-black text-primary leading-none">
                                                {formatActivityType(tx.type)}
                                            </span>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tight truncate max-w-[200px]">
                                                {tx.description || 'System Event'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-3">
                                            <div className={classNames(
                                                "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300",
                                                Number(tx.amount) < 0 ? "bg-rose-50 text-rose-500 dark:bg-rose-900/20" : "bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20"
                                            )}>
                                                {Number(tx.amount) < 0 ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                            </div>
                                            <span className={classNames(
                                                "text-base font-bold tracking-tighter",
                                                Number(tx.amount) < 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
                                            )}>
                                                {Number(tx.amount) < 0 ? '' : '+'}{Number(tx.amount).toLocaleString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-base font-bold text-gray-950 dark:text-white tracking-tighter">
                                                {tx.balance_after?.toLocaleString() || '-'}
                                            </span>
                                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 leading-none mt-1">Pool Balance</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className={classNames(
                                            "inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border transition-all",
                                            statusColor[tx.status]
                                        )}>
                                            <div className={classNames(
                                                "w-1.5 h-1.5 rounded-full mr-2",
                                                tx.status === 'Completed' ? "bg-emerald-500 animate-pulse" : "bg-blue-500"
                                            )} />
                                            {tx.status}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-10 py-20 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-[2rem] flex items-center justify-center mb-4">
                                            <History className="w-8 h-8 text-gray-200" />
                                        </div>
                                        <p className="text-xs font-bold text-gray-900 dark:text-gray-100">No activity found in ledger</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {transactions.length > 0 && (
                <div className="p-10 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Select
                            size="sm"
                            className="w-20"
                            options={[
                                { value: 10, label: '10' },
                                { value: 20, label: '20' },
                                { value: 50, label: '50' },
                                { value: 100, label: '100' },
                            ]}
                            value={{ value: pageSize, label: String(pageSize) }}
                            onChange={(option) => {
                                setPageSize((option as any).value)
                                setPageIndex(1)
                            }}
                        />
                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400">
                            Showing {((pageIndex - 1) * pageSize) + 1} to {Math.min(pageIndex * pageSize, total)} of {total} records
                        </p>
                    </div>
                    <Pagination
                        currentPage={pageIndex}
                        pageSize={pageSize}
                        total={total}
                        onChange={setPageIndex}
                    />
                </div>
            )}
        </Card>
    )
}

export default TransactionHistory

