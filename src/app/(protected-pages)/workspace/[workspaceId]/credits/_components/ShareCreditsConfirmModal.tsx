'use client'

import { Dialog, Button } from '@/components/ui'
import { Send, AlertTriangle, Users, Coins, ArrowRight } from 'lucide-react'
import type { RecipientInput } from '@/services/WorkspaceCreditSharingService'

interface ShareCreditsConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    recipients: RecipientInput[]
    totalAmount: number
    amountPerUser: number
    balanceBefore: number
    balanceAfter: number
    message?: string
    isLoading?: boolean
}

export default function ShareCreditsConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    recipients,
    totalAmount,
    amountPerUser,
    balanceBefore,
    balanceAfter,
    message,
    isLoading = false,
}: ShareCreditsConfirmModalProps) {
    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={600}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/40">
                        <Send className="w-6 h-6 text-[#0055BA]" />
                    </div>
                    <div>
                        <h5 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            Confirm Credit Transfer
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Review the details before sharing credits
                        </p>
                    </div>
                </div>

                {/* Warning */}
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            This action cannot be undone
                        </p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                            Credits will be immediately transferred to the selected recipients
                        </p>
                    </div>
                </div>

                {/* Recipients List */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Users className="w-5 h-5 text-gray-600" />
                        <h6 className="font-semibold text-gray-900 dark:text-gray-100">
                            Recipients ({recipients.length})
                        </h6>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {recipients.map((recipient, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                            >
                                <span className="text-sm text-gray-900 dark:text-gray-100">
                                    {recipient.email || recipient.tag_number}
                                </span>
                                <span className="text-sm font-semibold text-[#0055BA]">
                                    {recipient.amount ? recipient.amount.toFixed(2) : amountPerUser.toFixed(2)} credits
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Balance Summary */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Coins className="w-5 h-5 text-gray-600" />
                        <h6 className="font-semibold text-gray-900 dark:text-gray-100">
                            Balance Summary
                        </h6>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Current Balance</span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {balanceBefore.toFixed(2)} credits
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Total to Transfer</span>
                            <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                                -{totalAmount.toFixed(2)} credits
                            </span>
                        </div>
                        <div className="h-px bg-gray-200 dark:bg-gray-700" />
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                Balance After
                                <ArrowRight className="w-4 h-4" />
                            </span>
                            <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                {balanceAfter.toFixed(2)} credits
                            </span>
                        </div>
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h6 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Message
                        </h6>
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                            "{message}"
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        variant="plain"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        icon={<Send />}
                        onClick={onConfirm}
                        loading={isLoading}
                        className="bg-[#0055BA] hover:bg-[#003d85]"
                    >
                        Confirm & Share Credits
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}
