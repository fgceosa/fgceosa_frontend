import { useState, useEffect } from 'react'
import { Dialog, Input, Select, Spinner } from '@/components/ui'
import { Send, User, CreditCard, MessageSquare, ShieldCheck, Wallet, X } from 'lucide-react'
import type { SendCreditsModalProps, SendCreditsFormData, RecipientOption } from '../../types'
import { RECIPIENT_OPTIONS } from '../../types'
import { NAIRA_TO_USD_RATE } from '@/constants/currency.constant'

export default function SendCreditsModal({
    isOpen,
    onClose,
    onSuccess,
    initialData
}: SendCreditsModalProps) {
    const [recipientType, setRecipientType] = useState<RecipientOption | null>(null)
    const [amount, setAmount] = useState<string>('')
    const [recipient, setRecipient] = useState('')
    const [message, setMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Partial<Record<keyof SendCreditsFormData, string>>>({})

    // Initialize form with passed data
    useEffect(() => {
        if (isOpen && initialData) {
            if (initialData.recipientType) {
                const option = RECIPIENT_OPTIONS.find(o => o.value === initialData.recipientType)
                setRecipientType(option || null)
            }
            if (initialData.amount) setAmount(initialData.amount.toLocaleString())
            if (initialData.recipient) setRecipient(initialData.recipient)
            if (initialData.message) setMessage(initialData.message)
        } else if (!isOpen) {
            // Reset on close
            setRecipientType(null)
            setAmount('')
            setRecipient('')
            setMessage('')
            setErrors({})
        }
    }, [isOpen, initialData])

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof SendCreditsFormData, string>> = {}

        if (!recipientType) {
            newErrors.recipientType = 'Please select a recipient type'
        }

        const numAmount = parseFloat(amount.replace(/,/g, ''))
        if (!amount || isNaN(numAmount) || numAmount <= 0) {
            newErrors.amount = 'Please enter a valid amount'
        } else if (numAmount < 100) {
            newErrors.amount = 'Minimum amount is ₦100'
        }

        if (!recipient.trim()) {
            newErrors.recipient = 'Please enter recipient details'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSend = async () => {
        if (!validateForm()) {
            return
        }

        const formData: SendCreditsFormData = {
            recipientType: recipientType?.value || null,
            amount: parseFloat(amount.replace(/,/g, '')),
            recipient: recipient.trim(),
            message: message.trim() || undefined,
        }

        setIsSubmitting(true)

        try {
            if (onSuccess) {
                await onSuccess(formData)
            }
            onClose()
        } catch (error) {
            console.error('Error sending credits:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleAmountChange = (value: string) => {
        const cleaned = value.replace(/[^0-9.,]/g, '')
        setAmount(cleaned)
        if (errors.amount) {
            setErrors((prev) => ({ ...prev, amount: undefined }))
        }
    }

    // Determine if we are in "Confirmation Mode" (all fields filled) or "Edit Mode"
    const isConfirmationMode = !!initialData && !!initialData.recipient && !!initialData.amount

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            closable={false}
            width={640}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
            contentClassName="!shadow-none"
        >
            <div className="relative">
                {/* Custom Header */}
                <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                                {isConfirmationMode ? 'Confirm Allocation' : 'Send Credits'}
                            </h3>
                            <p className="text-[10px] font-black text-gray-400 mt-0.5">
                                {isConfirmationMode ? 'Review details before sending' : 'Send credits to a user or group'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group"
                    >
                        <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                    </button>
                </div>

                {/* Form Body */}
                <div className="px-8 py-6 space-y-6">
                    {isConfirmationMode ? (
                        <div className="p-6 bg-primary/[0.03] border border-primary/10 rounded-3xl space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-400">Recipient</span>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">{recipient}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-400">Amount</span>
                                <div className="text-right">
                                    <span className="text-xl font-black text-primary block">₦{amount}</span>
                                    <span className="text-[10px] font-black text-emerald-500 tracking-tight">
                                        You are sending {(parseFloat(amount.replace(/,/g, '')) / NAIRA_TO_USD_RATE).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Credits
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-400">Type</span>
                                <span className="text-xs font-bold bg-white dark:bg-gray-800 px-3 py-1 rounded-lg border border-gray-100 dark:border-gray-700 capitalize tracking-tight">{recipientType?.label}</span>
                            </div>
                            {message && (
                                <div className="pt-4 border-t border-primary/10">
                                    <span className="text-[10px] font-black text-gray-400 block mb-1">Memo</span>
                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 italic">&quot;{message}&quot;</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* ... existing edit fields ... */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 pl-1">
                                    <User className="w-3.5 h-3.5 text-primary" />
                                    <label className="text-[10px] font-black text-gray-900 tracking-widest">Recipient Type</label>
                                </div>
                                <Select
                                    value={recipientType}
                                    onChange={(value) => {
                                        setRecipientType(value as RecipientOption)
                                        if (errors.recipientType) setErrors((prev) => ({ ...prev, recipientType: undefined }))
                                    }}
                                    options={RECIPIENT_OPTIONS}
                                    placeholder="Select target..."
                                    className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-base font-bold"
                                />
                                {errors.recipientType && <p className="text-[10px] text-rose-500 font-bold tracking-tight pl-1">{errors.recipientType}</p>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 pl-1">
                                    <CreditCard className="w-3.5 h-3.5 text-primary" />
                                    <label className="text-[10px] font-black text-gray-900 tracking-widest">Amount (NGN)</label>
                                </div>
                                <Input
                                    placeholder="e.g. 50,000"
                                    value={amount}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '' || /^[0-9,.]*$/.test(val)) {
                                            handleAmountChange(val);
                                        }
                                    }}
                                    className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-base font-bold font-mono"
                                />
                                {amount && !isNaN(parseFloat(amount.replace(/,/g, ''))) && (
                                    <p className="text-[10px] font-bold text-primary pl-1">
                                        You are sending {(parseFloat(amount.replace(/,/g, '')) / NAIRA_TO_USD_RATE).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Credits
                                    </p>
                                )}
                                {errors.amount && <p className="text-[10px] text-rose-500 font-bold tracking-tight pl-1">{errors.amount}</p>}
                            </div>
                        </div>
                    )}

                    {!isConfirmationMode && (
                        <>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 pl-1">
                                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                                    <label className="text-[10px] font-black text-gray-900 tracking-widest">Qorebit Tag / Identifier</label>
                                </div>
                                <Input
                                    placeholder="e.g. @organization_alpha or enterprise_tag"
                                    value={recipient}
                                    onChange={(e) => {
                                        setRecipient(e.target.value)
                                        if (errors.recipient) setErrors((prev) => ({ ...prev, recipient: undefined }))
                                    }}
                                    className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-base font-bold"
                                />
                                {errors.recipient && <p className="text-[10px] text-rose-500 font-bold tracking-tight pl-1">{errors.recipient}</p>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 pl-1">
                                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                                    <label className="text-[10px] font-black text-gray-900 tracking-widest">Memo / Note (Optional)</label>
                                </div>
                                <Input
                                    placeholder="Purpose of this allocation..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    textArea
                                    rows={3}
                                    className="rounded-2xl border-gray-100 dark:border-gray-800 text-base font-bold"
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 sm:p-8 pt-0 flex flex-row gap-4">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex-1 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-sm font-black text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50 shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={isSubmitting}
                        className="flex-1 h-14 bg-primary hover:bg-primary-deep text-white font-black text-sm rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:grayscale disabled:scale-100"
                    >
                        {isSubmitting ? <Spinner size="20px" customColorClass="text-white" /> : <Send className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
                        <span>{isSubmitting ? 'Sending...' : 'Confirm & Send'}</span>
                    </button>
                </div>
            </div>
        </Dialog>
    )
}
