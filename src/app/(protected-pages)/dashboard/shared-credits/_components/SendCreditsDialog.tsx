'use client'

import { useState, useMemo } from 'react'
import { Button, Card, Input, Dialog, toast, Notification, Avatar } from '@/components/ui'
import { Send, AlertCircle, UserPlus, X, Search, Zap, Info, ShieldCheck, CreditCard, Wallet } from 'lucide-react'
import { apiResolveTag } from '@/services/sharedCredits/sharedCreditsService'
import type { UserPublic } from '../types'
import classNames from '@/utils/classNames'

interface SendCreditsDialogProps {
    isOpen: boolean
    onClose: () => void
    availableCredits: number
    walletBalance?: number
    onConfirm: (data: { recipientIds?: string[]; recipientTags?: string[]; amount: number; message: string }) => void
    isTransferring?: boolean
}

export default function SendCreditsDialog({
    isOpen,
    onClose,
    availableCredits,
    walletBalance,
    onConfirm,
    isTransferring = false,
}: SendCreditsDialogProps) {
    const [tagInput, setTagInput] = useState('')
    const [recipients, setRecipients] = useState<UserPublic[]>([])
    const [transferAmount, setTransferAmount] = useState('')
    const [transferMessage, setTransferMessage] = useState('')
    const [isResolving, setIsResolving] = useState(false)

    const reset = () => {
        setTagInput('')
        setRecipients([])
        setTransferAmount('')
        setTransferMessage('')
    }

    const handleClose = () => {
        if (!isTransferring) {
            reset()
            onClose()
        }
    }

    const handleResolveTag = async () => {
        if (!tagInput.trim()) return

        // Normalize tag input (ensure it starts with @ if only tag number is provided, or handle as is)
        let processedTag = tagInput.trim()
        if (!processedTag.startsWith('@')) {
            processedTag = `@${processedTag}`
        }

        setIsResolving(true)
        try {
            const user = await apiResolveTag(processedTag)

            if (recipients.some(r => r.id === user.id)) {
                toast.push(
                    <Notification type="warning" duration={3000}>
                        Operative already identified in transaction queue.
                    </Notification>
                )
            } else {
                setRecipients(prev => [...prev, user])
                setTagInput('')
                toast.push(
                    <Notification type="success" duration={3000}>
                        Identified {user.firstName || user.email}
                    </Notification>
                )
            }
        } catch (error: any) {
            toast.push(
                <Notification type="danger" duration={3000}>
                    {error?.response?.data?.detail || 'Operative not found. Verify Qorebit Tag.'}
                </Notification>
            )
        } finally {
            setIsResolving(false)
        }
    }

    const removeRecipient = (id: string) => {
        setRecipients(prev => prev.filter(r => r.id !== id))
    }

    const totalDistribution = useMemo(() => {
        const amount = parseFloat(transferAmount)
        if (isNaN(amount) || amount <= 0) return 0
        return amount * recipients.length
    }, [transferAmount, recipients])

    const validation = useMemo(() => {
        const creditAmount = Number(transferAmount)

        if (recipients.length === 0) {
            return { isValid: false, error: 'Please select at least one recipient' }
        }

        if (!transferAmount || transferAmount.trim() === '') {
            return { isValid: false, error: null }
        }

        if (isNaN(creditAmount) || creditAmount <= 0) {
            return { isValid: false, error: 'Enter a valid distribution amount' }
        }

        if (totalDistribution > availableCredits) {
            return {
                isValid: false,
                error: `Insufficient distribution balance. You need ${(totalDistribution - availableCredits).toLocaleString()} more credits.`,
            }
        }

        return { isValid: true, error: null }
    }, [transferAmount, availableCredits, recipients, totalDistribution])

    const handleConfirm = () => {
        if (!validation.isValid) return

        onConfirm({
            recipientIds: recipients.map(r => r.id),
            amount: Number(transferAmount),
            message: transferMessage,
        })
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            width={640}
            closable={false}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
            contentClassName="!shadow-none"
        >
            <div className="relative">
                {/* Custom Header */}
                <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center">
                            <Send className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">Send Credits</h3>
                            <p className="text-[10px] font-black text-gray-400 mt-0.5">Instant Distribution</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group shrink-0"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                    </button>
                </div>

                {/* Form Body */}
                <div className="px-5 sm:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar pb-32 sm:pb-40">
                    {/* Source Wallet Context */}
                    <div className="p-4 sm:p-6 bg-primary/[0.03] dark:bg-primary/[0.02] rounded-xl sm:rounded-2xl border border-primary/10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-primary/10 flex items-center justify-center shadow-sm">
                                    <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                </div>
                                <div>
                                    <span className="text-[8px] sm:text-[9px] font-black text-gray-400 block">Funding Source</span>
                                    <div className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">
                                        Personal Wallet
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[8px] sm:text-[9px] font-black text-gray-400 block">Available Credits</span>
                                <div className="text-sm sm:text-base font-black text-emerald-600">
                                    {availableCredits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[9px] sm:text-[10px] opacity-70">CR</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 1: Recipient Identity */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pl-1">
                            <Search className="w-3.5 h-3.5 text-primary" />
                            <label className="text-[10px] font-black text-gray-900">Recipient Identification</label>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="relative flex-1">
                                <Input
                                    placeholder="Search by Tag (e.g. @qor123)"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleResolveTag()}
                                    className="h-12 sm:h-14 pl-4 bg-gray-50/50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-800 rounded-xl sm:rounded-2xl focus:bg-white dark:focus:bg-gray-900 transition-all text-[13px] sm:text-base font-bold w-full"
                                    disabled={isResolving || isTransferring}
                                />
                            </div>
                            <Button
                                variant="solid"
                                onClick={handleResolveTag}
                                loading={isResolving}
                                disabled={!tagInput.trim() || isTransferring}
                                className="h-12 sm:h-14 w-full sm:w-auto px-8 rounded-xl sm:rounded-2xl bg-primary hover:bg-primary-deep text-white font-black text-[10px] shadow-xl shadow-primary/20 shrink-0 flex items-center justify-center"
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Add
                            </Button>
                        </div>

                        {/* Recipient Queue */}
                        {recipients.length > 0 && (
                            <div className="max-h-32 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                                {recipients.map((recipient) => (
                                    <div
                                        key={recipient.id}
                                        className="flex items-center justify-between bg-white dark:bg-gray-900 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <Avatar
                                                size={32}
                                                alt={recipient.firstName || recipient.email}
                                                className="ring-2 ring-gray-50 dark:ring-gray-800"
                                            >
                                                {(recipient.firstName || recipient.email).charAt(0).toUpperCase()}
                                            </Avatar>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[11px] font-black text-gray-900 dark:text-white truncate">
                                                    {recipient.firstName || 'User'}
                                                </span>
                                                <span className="text-[9px] font-bold text-gray-400 truncate">
                                                    {recipient.tagNumber ? `@${recipient.tagNumber}` : recipient.email}
                                                </span>
                                            </div>
                                        </div>
                                        {!isTransferring && (
                                            <button
                                                onClick={() => removeRecipient(recipient.id)}
                                                className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all shrink-0"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Step 2: Distribution Quantities */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        <div className="md:col-span-3 space-y-2">
                            <div className="flex items-center gap-2 pl-1 mb-2">
                                <Zap className="w-3.5 h-3.5 text-primary" />
                                <label className="text-[10px] font-black text-gray-900">Amount Per Person (Credits)</label>
                            </div>
                            <div className="relative">
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={transferAmount}
                                    onChange={(e) => setTransferAmount(e.target.value)}
                                    onWheel={(e) => e.currentTarget.blur()}
                                    className="text-xl font-black h-14 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-900 transition-all pl-5 pr-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    disabled={isTransferring}
                                />
                                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-[10px] text-gray-400 pointer-events-none">Credits</span>
                            </div>
                            {(Number(transferAmount) > availableCredits || totalDistribution > availableCredits) && (
                                <p className="text-[10px] font-bold text-red-600 pl-1 animate-pulse">
                                    {Number(transferAmount) > availableCredits
                                        ? 'Amount per person exceeds available balance.'
                                        : `Insufficient total balance for ${recipients.length} ${recipients.length === 1 ? 'recipient' : 'recipients'}.`}
                                </p>
                            )}
                        </div>

                        <div className="md:col-span-2 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col justify-center gap-1">
                            <span className="text-[9px] font-black text-primary/60">Total Distribution</span>
                            <div className="text-2xl font-black text-primary leading-none">
                                {totalDistribution.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                <span className="text-xs ml-1 opacity-60">CR</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[8px] font-black text-primary/40 mt-1">
                                <span className="text-gray-400">Recipient Count: {recipients.length}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[8px] font-black text-primary/40 mt-0.5">
                                <ShieldCheck className="w-3 h-3" />
                                Pending Auth
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Distribution Notes */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 pl-1 mb-2">
                            <Info className="w-3.5 h-3.5 text-primary" />
                            <label className="text-[10px] font-black text-gray-900">Message (Optional)</label>
                        </div>
                        <Input
                            placeholder="Specify distribution objective..."
                            value={transferMessage}
                            onChange={(e) => setTransferMessage(e.target.value)}
                            textArea
                            rows={2}
                            className="bg-gray-50/50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-base font-bold focus:bg-white dark:focus:bg-gray-900 resize-none"
                            disabled={isTransferring}
                        />
                    </div>

                    {validation.error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-start gap-3 text-red-600 dark:text-red-400 text-[11px] font-bold leading-tight">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{validation.error}</span>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="px-5 sm:px-8 pb-5 sm:pb-8 pt-4 sm:pt-6 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-t border-gray-50 dark:border-gray-800 z-10 relative shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
                    <button
                        onClick={handleClose}
                        disabled={isTransferring}
                        className="w-full sm:flex-1 h-14 sm:h-16 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-800 text-sm sm:text-base font-black text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50 shrink-0"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!validation.isValid || isTransferring}
                        className="w-full sm:flex-[2.5] h-16 sm:h-20 bg-primary hover:bg-primary-deep text-white font-black text-lg sm:text-xl rounded-xl sm:rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 sm:gap-4 group disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {isTransferring ? (
                            <span>Sending...</span>
                        ) : (
                            <>
                                <Send className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                <span>Send Credits Now</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Dialog>
    )
}
