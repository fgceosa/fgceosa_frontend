'use client'

import { Card, Button } from '@/components/ui'
import { Clock, CheckCircle2, XCircle, AlertCircle, Zap, TrendingUp, Cpu, Globe, ChevronLeft, ChevronRight } from 'lucide-react'
import type { RecentApiCall } from '@/app/(protected-pages)/dashboard/projects/types'

interface RecentCallsProps {
    calls: RecentApiCall[]
    page?: number
    pageSize?: number
    totalItems?: number
    onPageChange?: (page: number) => void
}

export default function RecentCalls({
    calls,
    page = 1,
    pageSize = 50,
    totalItems = 0,
    onPageChange
}: RecentCallsProps) {
    const hasData = calls && calls.length > 0
    const totalPages = Math.ceil(totalItems / pageSize)

    return (
        <Card className="p-0 border-none bg-white dark:bg-gray-950 rounded-[2rem] overflow-hidden shadow-md overflow-x-auto">
            <div className="p-8 md:p-10">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10 shadow-sm shrink-0">
                            <Clock className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-black text-primary opacity-80">History</span>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">Recent Activity</h3>
                        </div>
                    </div>
                </div>

                {/* Main Table Content */}
                {!hasData ? (
                    <div className="py-16 text-center flex flex-col items-center">
                        <div className="w-20 h-20 rounded-[2rem] bg-gray-50 dark:bg-gray-900 flex items-center justify-center mb-6 border border-gray-100 dark:border-gray-800">
                            <Globe className="w-8 h-8 text-gray-200" />
                        </div>
                        <h4 className="text-gray-900 dark:text-white font-black text-lg">Registry Empty</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[280px] mt-2 italic font-medium">
                            Interaction logs will appear here once usage begins.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="min-w-[900px]">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl overflow-hidden">
                                        <th className="text-left py-4 px-6 rounded-tl-xl text-[9px] font-black text-gray-400">Time</th>
                                        <th className="text-left py-4 px-6 text-[9px] font-black text-gray-400">AI Model</th>
                                        <th className="text-right py-4 px-6 text-[9px] font-black text-gray-400">Usage</th>
                                        <th className="text-right py-4 px-6 text-[9px] font-black text-gray-400">Cost</th>
                                        <th className="text-center py-4 px-6 text-[9px] font-black text-gray-400">Status</th>
                                        <th className="text-right py-4 px-6 rounded-tr-xl text-[9px] font-black text-gray-400">Speed</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {calls.map((call) => (
                                        <tr key={call.id} className="group hover:bg-gray-50/30 dark:hover:bg-gray-900/30 transition-all duration-300">
                                            <td className="py-5 px-6">
                                                <div className="space-y-0.5">
                                                    <div className="text-sm font-black text-gray-900 dark:text-white">
                                                        {formatTimestamp(call.timestamp)}
                                                    </div>
                                                    <div className="text-[9px] font-bold text-gray-400 tabular-nums">
                                                        {new Date(/[Zz]$|[+-]\d{2}:?\d{2}$/.test(call.timestamp) ? call.timestamp : `${call.timestamp}Z`).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: false
                                                        })}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                                            <Cpu className="w-2.5 h-2.5 text-purple-600" />
                                                        </div>
                                                        <span className="text-[10px] font-black text-gray-900 dark:text-white">
                                                            {call.model.split('/').pop() || call.model}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6 text-right">
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800 shadow-sm">
                                                    <Zap className="w-2.5 h-2.5 text-amber-500" />
                                                    <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 tabular-nums">
                                                        {call.totalTokens.toLocaleString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6 text-right">
                                                <div className="space-y-0.5">
                                                    <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                                                        {parseFloat(call.cost).toFixed(4)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6 text-center">
                                                <StatusBadge status={call.status} />
                                            </td>
                                            <td className="py-5 px-6 text-right">
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 shadow-sm">
                                                    <TrendingUp className="w-2.5 h-2.5 text-blue-500" />
                                                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 tabular-nums">
                                                        {call.responseTimeMs}ms
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        {onPageChange && totalItems > 0 && (
                            <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
                                <div className="text-xs text-gray-500 font-medium">
                                    Showing <span className="font-bold text-gray-900 dark:text-white">{(page - 1) * pageSize + 1}</span> to <span className="font-bold text-gray-900 dark:text-white">{Math.min(page * pageSize, totalItems)}</span> of <span className="font-bold text-gray-900 dark:text-white">{totalItems}</span> results
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="plain"
                                        size="sm"
                                        onClick={() => onPageChange(page - 1)}
                                        disabled={page <= 1}
                                        className="h-8 w-8 p-0 rounded-lg border border-gray-200 dark:border-gray-800"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <div className="text-xs font-black px-2">
                                        Page {page} of {totalPages}
                                    </div>
                                    <Button
                                        variant="plain"
                                        size="sm"
                                        onClick={() => onPageChange(page + 1)}
                                        disabled={page >= totalPages}
                                        className="h-8 w-8 p-0 rounded-lg border border-gray-200 dark:border-gray-800"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    )
}

function StatusBadge({ status }: { status: string }) {
    const statusLower = status.toLowerCase()

    if (statusLower === 'success') {
        return (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
                <CheckCircle2 className="w-3 h-3" strokeWidth={3} />
                <span>Success</span>
            </div>
        )
    }

    if (statusLower === 'error') {
        return (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800">
                <XCircle className="w-3 h-3" strokeWidth={3} />
                <span>Failed</span>
            </div>
        )
    }

    if (statusLower === 'timeout') {
        return (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                <AlertCircle className="w-3 h-3" strokeWidth={3} />
                <span>Timeout</span>
            </div>
        )
    }

    return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black bg-gray-50 text-gray-600 border border-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
            <span>{status}</span>
        </div>
    )
}

function formatTimestamp(timestamp: string): string {
    // Backend returns bare ISO strings without a timezone suffix (no 'Z').
    // Appending 'Z' forces UTC parsing so the diff is always accurate.
    const normalized = /[Zz]$|[+-]\d{2}:?\d{2}$/.test(timestamp) ? timestamp : `${timestamp}Z`
    const date = new Date(normalized)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    })
}
