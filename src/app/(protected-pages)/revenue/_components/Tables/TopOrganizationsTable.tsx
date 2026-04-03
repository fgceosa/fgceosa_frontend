import React, { useState } from 'react'
import { Table, Button, Pagination } from '@/components/ui'
import { NumericFormat } from 'react-number-format'
import { Users, ArrowRight, Activity, Calendar } from 'lucide-react'
import classNames from '@/utils/classNames'

const { THead, TBody, Tr, Th, Td } = Table

interface TopOrganizationsTableProps {
    data: {
        organization: string
        spend: number
        creditsUsed: number
        lastActivity: string
        status: 'Active' | 'At Risk' | 'Inactive'
    }[]
}

/**
 * TopOrganizationsTable - Highlights the organizations with the highest credit consumption and spend.
 * Useful for identifying key enterprise clients and monitoring account health.
 */
export default function TopOrganizationsTable({ data }: TopOrganizationsTableProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 5

    const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-emerald-500/10 text-emerald-600'
            case 'At Risk': return 'bg-amber-500/10 text-amber-600'
            default: return 'bg-gray-500/10 text-gray-600'
        }
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none overflow-hidden group flex flex-col h-full">
            <header className="p-8 pb-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-rose-500/10 rounded-2xl">
                        <Users className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-gray-900 dark:text-white">Top Spenders</h3>
                        <p className="text-[10px] font-bold text-gray-400 mt-0.5">High-value organizations</p>
                    </div>
                </div>
                <Button size="sm" variant="default" className="text-[10px] font-black px-4 border-2">View All</Button>
            </header>

            <div className="overflow-x-auto flex-1">
                <Table className="w-full">
                    <THead>
                        <Tr className="border-b-0">
                            <Th className="text-[10px] font-black px-8 py-5 text-gray-400">Organization</Th>
                            <Th className="text-[10px] font-black px-6 py-5 text-gray-400">Total Spend</Th>
                            <Th className="text-[10px] font-black px-6 py-5 text-gray-400 text-center">Status</Th>
                            <Th className="px-8 py-5 text-right font-black text-[10px]" />
                        </Tr>
                    </THead>
                    <TBody>
                        {paginatedData.map((row, index) => (
                            <Tr key={index} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group/row cursor-pointer">
                                <Td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-black text-xs text-gray-500">
                                            {row.organization.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-sm text-gray-900 dark:text-white">{row.organization}</span>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <Activity className="w-3 h-3 text-gray-300" />
                                                <span className="text-[9px] font-bold text-gray-400">
                                                    <NumericFormat displayType="text" value={row.creditsUsed} thousandSeparator decimalScale={0} /> Credits
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Td>
                                <Td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="font-black text-sm text-gray-900 dark:text-white">
                                            <NumericFormat displayType="text" value={row.spend} prefix="₦" thousandSeparator decimalScale={0} />
                                        </span>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <Calendar className="w-3 h-3 text-gray-300" />
                                            <span className="text-[9px] font-bold text-gray-400">Last Active: {row.lastActivity}</span>
                                        </div>
                                    </div>
                                </Td>
                                <Td className="px-6 py-5">
                                    <div className="flex justify-center">
                                        <div className={classNames("px-3 py-1 rounded-full text-[9px] font-black", getStatusColor(row.status))}>
                                            {row.status}
                                        </div>
                                    </div>
                                </Td>
                                <Td className="px-8 py-5 text-right">
                                    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg group-hover/row:bg-primary/10 group-hover/row:text-primary transition-all inline-block opacity-0 group-hover/row:opacity-100">
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover/row:translate-x-1" />
                                    </div>
                                </Td>
                            </Tr>
                        ))}
                    </TBody>
                </Table>
            </div>

            <div className="p-4 border-t border-gray-50 dark:border-gray-800 flex justify-end">
                <Pagination
                    currentPage={currentPage}
                    total={data.length}
                    pageSize={pageSize}
                    onChange={setCurrentPage}
                />
            </div>
        </div>
    )
}
