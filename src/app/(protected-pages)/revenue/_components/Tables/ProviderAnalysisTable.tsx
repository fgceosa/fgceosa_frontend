'use client'

import React from 'react'
import { Table, Tooltip } from '@/components/ui'
import { NumericFormat } from 'react-number-format'
import { Cpu, Zap, Info } from 'lucide-react'
import classNames from '@/utils/classNames'

const { THead, TBody, Tr, Th, Td } = Table

interface ProviderAnalysisTableProps {
    data: {
        provider: string
        creditsConsumed: number
        cost: number
        revenue: number
        margin: number
    }[]
}

/**
 * ProviderAnalysisTable - Analyzes the profitability of different AI model providers.
 * Compares the cost of tokens/requests against platform revenue to monitor margins.
 */
export default function ProviderAnalysisTable({ data }: ProviderAnalysisTableProps) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none overflow-hidden h-full flex flex-col">
            <header className="p-8 pb-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/10 rounded-2xl">
                        <Cpu className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-gray-900 dark:text-white">Provider Analysis</h3>
                        <p className="text-[10px] font-bold text-gray-400 mt-0.5">Model level profitability</p>
                    </div>
                </div>
            </header>

            <div className="overflow-x-auto flex-get-1">
                <Table className="w-full">
                    <THead>
                        <Tr className="border-b-0">
                            <Th className="text-[10px] font-black px-8 py-5 text-gray-400">Provider</Th>
                            <Th className="text-[10px] font-black px-6 py-5 text-gray-400 text-right">Consumption</Th>
                            <Th className="text-[10px] font-black px-6 py-5 text-gray-400 text-right">Net Margin</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {data.map((row, index) => (
                            <Tr key={index} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group/row">
                                <Td className="px-8 py-5">
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-sm text-gray-900 dark:text-white">{row.provider}</span>
                                    </div>
                                </Td>
                                <Td className="px-6 py-5 text-right">
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center justify-end gap-1.5 font-black text-sm text-gray-900 dark:text-white tabular-nums">
                                            <NumericFormat displayType="text" value={row.revenue} prefix="₦" thousandSeparator decimalScale={0} />
                                        </div>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <Zap className="w-3 h-3 text-orange-500" />
                                            <span className="text-[9px] font-bold text-gray-400">
                                                <NumericFormat displayType="text" value={row.creditsConsumed} thousandSeparator decimalScale={0} /> Credits
                                            </span>
                                        </div>
                                    </div>
                                </Td>
                                <Td className="px-6 py-5">
                                    <div className="flex flex-col items-end gap-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className={classNames(
                                                "text-[10px] font-black",
                                                row.margin > 50 ? "text-emerald-500" : "text-amber-500"
                                            )}>
                                                {Math.ceil(row.margin)}% Profit
                                            </span>
                                        </div>
                                        <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className={classNames(
                                                    "h-full rounded-full transition-all duration-1000",
                                                    row.margin > 50 ? "bg-emerald-500" : "bg-primary"
                                                )}
                                                style={{ width: `${Math.ceil(row.margin)}%` }}
                                            />
                                        </div>
                                    </div>
                                </Td>
                            </Tr>
                        ))}
                    </TBody>
                </Table>
            </div>
        </div>
    )
}
