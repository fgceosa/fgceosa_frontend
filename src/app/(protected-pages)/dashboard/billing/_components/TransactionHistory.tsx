'use client'

import { Button, Tag, Card } from '@/components/ui'
import { CreditTransaction } from '../types'
import { Download, History, Database, ArrowUpRight, ArrowDownLeft, FileText } from 'lucide-react'
import DataTable, { ColumnDef } from '@/components/shared/DataTable'
import { useMemo, useState, useEffect } from 'react'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import dayjs from 'dayjs'
import { CSVLink } from 'react-csv'
import { AIEngineService } from '@/services/AIEngineService'
import classNames from '@/utils/classNames'

type Props = {
    data?: CreditTransaction[]
}

const statusColor: Record<string, string> = {
    Completed: 'bg-green-50 text-green-700 border-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20',
    Processed: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
}

const TransactionHistory = ({ data: initialData }: Props) => {
    const { onAppendQueryParams } = useAppendQueryParams()
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [transactions, setTransactions] = useState<CreditTransaction[]>(initialData || [])
    const [total, setTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setIsLoading(true)
                const skip = (pageIndex - 1) * pageSize
                const response = await AIEngineService.getCreditTransactions(skip, pageSize)

                const mappedTransactions: CreditTransaction[] = response.transactions.map((t: any) => {
                    const isDebit = t.amount < 0
                    const absAmount = Math.abs(t.amount)

                    return {
                        id: t.id,
                        date: t.created_at,
                        type: t.transaction_type,
                        amount: `${isDebit ? '-' : '+'}${absAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                        credits: `${isDebit ? '-' : '+'}${absAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                        status: t.transaction_type === 'purchase' ? 'Completed' : 'Processed',
                        description: t.description || '',
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
    }, [pageIndex, pageSize, initialData])

    const columns: ColumnDef<CreditTransaction>[] = useMemo(
        () => [
            {
                header: 'Date & Time',
                accessorKey: 'date',
                cell: (props) => {
                    const date = dayjs(props.row.original.date)
                    return (
                        <div className="flex flex-col gap-0.5">
                            <span className="text-gray-900 dark:text-gray-100 font-black text-sm">
                                {date.format('MMM D, YYYY')}
                            </span>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black">
                                {date.format('HH:mm:ss')}
                            </span>
                        </div>
                    )
                },
            },
            {
                header: 'Activity',
                accessorKey: 'description',
                cell: (props) => {
                    const type = props.row.original.type
                    return (
                        <div className="flex flex-col gap-1 py-1">
                            <div className="flex items-center gap-2">
                                <span className="capitalize font-black text-primary text-[10px] px-2 py-0.5 bg-primary/5 rounded border border-primary/10">
                                    {type}
                                </span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-[400px] truncate block">
                                {props.row.original.description || 'System generated event'}
                            </span>
                        </div>
                    )
                }
            },
            {
                header: 'Credits',
                accessorKey: 'credits',
                cell: (props) => {
                    const isDebit = props.row.original.credits.startsWith('-')
                    return (
                        <div className="flex items-center gap-3">
                            <div className={classNames(
                                "flex items-center justify-center w-8 h-8 rounded-xl border transition-all duration-300",
                                isDebit ? "bg-red-50 text-red-500 border-red-100 dark:bg-red-900/10 dark:border-red-800" : "bg-green-50 text-green-500 border-green-100 dark:bg-green-900/10 dark:border-green-800"
                            )}>
                                {isDebit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                            </div>
                            <div className="flex flex-col">
                                <span className={classNames(
                                    "font-black text-sm",
                                    isDebit ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                                )}>
                                    {props.row.original.credits}
                                </span>
                                <span className="text-[9px] font-black text-gray-400">Credits</span>
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const status = props.row.original.status
                    return (
                        <div className={classNames(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border transition-all duration-300",
                            statusColor[status]
                        )}>
                            <div className={classNames(
                                "w-1.5 h-1.5 rounded-full",
                                status === 'Completed' ? "bg-green-500" : "bg-blue-500"
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
        <Card className="p-0 border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-transparent to-gray-50/30 dark:to-gray-800/10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-primary/5 rounded-[22px] flex items-center justify-center border border-primary/10 shadow-inner">
                            <Database className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none mb-2">Transaction History</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                A complete list of all your credit purchases and usage.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <CSVLink filename="usage-history.csv" data={transactions}>
                            <button className="h-11 px-6 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-black rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all flex items-center gap-2 text-[10px]">
                                <Download className="w-4 h-4" />
                                Download History
                            </button>
                        </CSVLink>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <DataTable
                    columns={columns}
                    data={transactions}
                    noData={transactions?.length === 0}
                    loading={isLoading}
                    pagingData={{ total, pageIndex, pageSize }}
                    onPaginationChange={setPageIndex}
                    onSelectChange={setPageSize}
                />
            </div>
        </Card>
    )
}

export default TransactionHistory

