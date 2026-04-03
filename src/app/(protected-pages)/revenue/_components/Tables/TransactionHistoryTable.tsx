'use client'

import React from 'react'
import { Card, Table, Tag, Button } from '@/components/ui'
import { NumericFormat } from 'react-number-format'
import { History, ArrowUpRight, ArrowDownRight, Search, Filter } from 'lucide-react'
import classNames from '@/utils/classNames'

// Types
import { Transaction } from '../../types'

const { THead, TBody, Tr, Th, Td } = Table

interface TransactionHistoryTableProps {
    data: Transaction[]
}

/**
 * TransactionHistoryTable - An exhaustive log of all financial activities on the platform.
 * Supports auditing, tracking payment statuses, and deep-linking to transaction details.
 */
export default function TransactionHistoryTable({ data }: TransactionHistoryTableProps) {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
            case 'pending': return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
            case 'failed': return 'bg-rose-500/10 text-rose-600 border-rose-500/20'
            default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
        }
    }

    const getTypeIcon = (type: string) => {
        if (type.toLowerCase() === 'credit_purchase') return <ArrowUpRight className="w-4 h-4 text-emerald-500" />
        return <ArrowDownRight className="w-4 h-4 text-rose-500" />
    }

    return (
        <Card className="p-0 border-none shadow-2xl shadow-gray-200/60 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 transition-all overflow-hidden group">
            <header className="p-8 md:p-10 border-b border-gray-50 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-50/30 dark:bg-gray-800/20">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/20 flex items-center justify-center">
                        <History className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white">Financial History</h3>
                        <p className="text-[10px] font-black text-gray-400 mt-0.5">Comprehensive audit log</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="pl-11 pr-6 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs font-bold w-64 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>
                    <Button variant="default" size="sm" className="flex items-center gap-2 px-6 border-2">
                        <Filter className="w-4 h-4" />
                        <span className="text-[10px] font-black">Filters</span>
                    </Button>
                </div>
            </header>

            <div className="overflow-x-auto">
                <Table className="w-full">
                    <THead>
                        <Tr className="border-b border-gray-50 dark:border-gray-800">
                            <Th className="text-[10px] font-black text-gray-400 px-8 py-6">Reference & Date</Th>
                            <Th className="text-[10px] font-black text-gray-400 px-6 py-6">Organization</Th>
                            <Th className="text-[10px] font-black text-gray-400 px-6 py-6">Type</Th>
                            <Th className="text-[10px] font-black text-gray-400 px-6 py-6 text-right">Amount</Th>
                            <Th className="text-[10px] font-black text-gray-400 px-8 py-6 text-center">Status</Th>
                        </Tr>
                    </THead>
                    <TBody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                        {data.map((tx) => (
                            <Tr key={tx.id} className="group/row hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-all duration-300">
                                <Td className="px-8 py-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-gray-900 dark:text-gray-100 group-hover/row:text-primary transition-colors">
                                            {tx.id.substring(0, 12)}...
                                        </span>
                                        <span className="text-[9px] font-bold text-gray-400 mt-1">
                                            {tx.date}
                                        </span>
                                    </div>
                                </Td>
                                <Td className="px-6 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-black text-[10px] text-gray-500">
                                            {tx.organization.charAt(0)}
                                        </div>
                                        <span className="text-sm font-black text-gray-700 dark:text-gray-300">
                                            {tx.organization}
                                        </span>
                                    </div>
                                </Td>
                                <Td className="px-6 py-6 font-black text-[10px] text-gray-400">
                                    <div className="flex items-center gap-2">
                                        {getTypeIcon(tx.type)}
                                        {tx.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                                    </div>
                                </Td>
                                <Td className="px-6 py-6 text-right">
                                    <span className="text-sm font-black text-gray-900 dark:text-white tabular-nums">
                                        <NumericFormat
                                            displayType="text"
                                            value={tx.amount}
                                            prefix="₦"
                                            thousandSeparator
                                            decimalScale={0}
                                        />
                                    </span>
                                </Td>
                                <Td className="px-8 py-6">
                                    <div className="flex justify-center">
                                        <div className={classNames(
                                            "px-4 py-1.5 rounded-full border text-[9px] font-black transition-all group-hover/row:scale-105",
                                            getStatusColor(tx.status)
                                        )}>
                                            {tx.status}
                                        </div>
                                    </div>
                                </Td>
                            </Tr>
                        ))}
                    </TBody>
                </Table>
            </div>
        </Card>
    )
}
