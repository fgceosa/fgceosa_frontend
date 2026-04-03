'use client'

import { Dialog, Button, Badge } from '@/components/ui'
import { CheckCircle, XCircle, AlertCircle, Coins, TrendingDown, TrendingUp } from 'lucide-react'
import type { CreditShareResponse } from '@/services/WorkspaceCreditSharingService'

interface ShareCreditsResultsModalProps {
    isOpen: boolean
    onClose: () => void
    results: CreditShareResponse | null
}

export default function ShareCreditsResultsModal({
    isOpen,
    onClose,
    results,
}: ShareCreditsResultsModalProps) {
    if (!results) return null

    const allSuccess = results.failed_count === 0
    const allFailed = results.success_count === 0
    const partialSuccess = results.success_count > 0 && results.failed_count > 0

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={700}
        >
            <div className="space-y-6">
                {/* Header with Status */}
                <div className="flex items-center gap-3">
                    {allSuccess && (
                        <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/40">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    )}
                    {allFailed && (
                        <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/40">
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                    )}
                    {partialSuccess && (
                        <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/40">
                            <AlertCircle className="w-6 h-6 text-yellow-600" />
                        </div>
                    )}
                    <div>
                        <h5 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            {allSuccess && 'Credits Shared Successfully'}
                            {allFailed && 'Credit Transfer Failed'}
                            {partialSuccess && 'Partial Transfer Completed'}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {results.success_count} successful • {results.failed_count} failed
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                Successful
                            </p>
                        </div>
                        <p className="text-2xl font-bold text-green-600">
                            {results.success_count}
                        </p>
                    </div>

                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <XCircle className="w-5 h-5 text-red-600" />
                            <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                Failed
                            </p>
                        </div>
                        <p className="text-2xl font-bold text-red-600">
                            {results.failed_count}
                        </p>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Coins className="w-5 h-5 text-[#0055BA]" />
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                Total Shared
                            </p>
                        </div>
                        <p className="text-2xl font-bold text-[#0055BA]">
                            {results.total_amount.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Balance Change */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <TrendingDown className="w-5 h-5 text-gray-600" />
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Balance Before</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {results.workspace_balance_before.toFixed(2)} credits
                                </p>
                            </div>
                        </div>
                        <div className="text-center px-4">
                            <p className="text-xs text-gray-500">transferred</p>
                            <p className="text-lg font-bold text-red-600">
                                -{results.total_amount.toFixed(2)}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Balance After</p>
                                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                                    {results.workspace_balance_after.toFixed(2)} credits
                                </p>
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                </div>

                {/* Results List */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h6 className="font-semibold text-gray-900 dark:text-gray-100">
                            Transfer Details
                        </h6>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {results.results.map((result, index) => (
                            <div
                                key={index}
                                className={`p-4 flex items-center justify-between ${
                                    index !== results.results.length - 1
                                        ? 'border-b border-gray-200 dark:border-gray-700'
                                        : ''
                                }`}
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    {result.status === 'success' ? (
                                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                    )}
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {result.recipient_name || result.recipient_identifier}
                                        </p>
                                        {result.recipient_name && (
                                            <p className="text-xs text-gray-500">
                                                {result.recipient_identifier}
                                            </p>
                                        )}
                                        {result.error && (
                                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                                {result.error}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge
                                        className={
                                            result.status === 'success'
                                                ? 'bg-green-100 text-green-800 border-green-200'
                                                : 'bg-red-100 text-red-800 border-red-200'
                                        }
                                    >
                                        {result.status}
                                    </Badge>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 min-w-[80px] text-right">
                                        {result.amount.toFixed(2)} credits
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        variant="solid"
                        onClick={onClose}
                        className="bg-[#0055BA] hover:bg-[#003d85]"
                    >
                        Done
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}
