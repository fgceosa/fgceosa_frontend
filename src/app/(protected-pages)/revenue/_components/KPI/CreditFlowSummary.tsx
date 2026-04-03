'use client'

import React from 'react'
import { Landmark, ArrowRight, Zap, Wallet, Info } from 'lucide-react'
import { NumericFormat } from 'react-number-format'
import classNames from '@/utils/classNames'
import { Tooltip } from '@/components/ui'

interface CreditFlowSummaryProps {
    data: {
        issued: number
        transferred: number
        consumed: number
        remaining: number
    }
}

/**
 * FlowStat - Individual metric card within the CreditFlowSummary.
 */
const FlowStat = ({ title, value, icon: Icon, colorClass, tooltip }: any) => (
    <div className="flex items-center gap-4 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all hover:scale-[1.02] shadow-sm hover:shadow-xl shadow-gray-200/50 dark:shadow-none group">
        <div className={classNames("p-2.5 rounded-xl transition-transform group-hover:scale-110 group-hover:rotate-3", colorClass)}>
            <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[9px] font-black text-gray-400">{title}</span>
                <Tooltip title={tooltip}>
                    <Info className="w-3 h-3 text-gray-300 cursor-help" />
                </Tooltip>
            </div>
            <h4 className="text-base font-black text-gray-900 dark:text-white truncate">
                <NumericFormat displayType="text" value={Math.ceil(value)} thousandSeparator decimalScale={0} />
            </h4>
        </div>
    </div>
)

/**
 * CreditFlowSummary - Provides visibility into the flow of AI credits across the platform.
 * Tracks issuance, transfers, consumption, and remaining liquidity.
 */
export default function CreditFlowSummary({ data }: CreditFlowSummaryProps) {
    return (
        <div className="space-y-6">
            <header className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Wallet className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white">Credit Flow Visibility</h3>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <FlowStat
                    title="Issued"
                    value={data.issued}
                    icon={Landmark}
                    colorClass="bg-blue-500/10 text-blue-500"
                    tooltip="Total credits ever minted or issued on the platform"
                />
                <FlowStat
                    title="Transferred"
                    value={data.transferred}
                    icon={ArrowRight}
                    colorClass="bg-indigo-500/10 text-indigo-500"
                    tooltip="Credits transferred between workspaces or entities"
                />
                <FlowStat
                    title="Consumed"
                    value={data.consumed}
                    icon={Zap}
                    colorClass="bg-orange-500/10 text-orange-500"
                    tooltip="Total credits actually used for AI requests"
                />
                <FlowStat
                    title="Remaining"
                    value={data.remaining}
                    icon={Wallet}
                    colorClass="bg-emerald-500/10 text-emerald-500"
                    tooltip="Active credit balance available across all organizations"
                />
            </div>
        </div>
    )
}
