import { useState, useEffect } from 'react'
import { Input, Select, Card, Spinner } from '@/components/ui'
import { Send, User, CreditCard, MessageSquare, ShieldCheck, Wallet, Calendar } from 'lucide-react'
import type { SendCreditsTabProps, SendCreditsFormData, RecipientOption } from '../../../types'
import { RECIPIENT_OPTIONS } from '../../../types'
import { NAIRA_TO_USD_RATE } from '@/constants/currency.constant'

export const SendCreditsTab = ({
    openSendModal,
    onRecipientChange,
    initialRecipient = '',
    treasuryType = 'platform'
}: SendCreditsTabProps) => {
    const [recipientType, setRecipientType] = useState<RecipientOption | null>(null)
    const [amount, setAmount] = useState<string>('')
    const [recipient, setRecipient] = useState(initialRecipient)
    const [message, setMessage] = useState('')
    const [expiry, setExpiry] = useState('')
    const [errors, setErrors] = useState<Partial<Record<keyof SendCreditsFormData, string>>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Filter recipient options based on treasury type
    const filteredOptions = RECIPIENT_OPTIONS.filter(option => {
        if (treasuryType === 'organization') {
            // Org admins can only send to individuals or bootcamps (programs), not other orgs
            return option.value !== 'organization'
        }
        if (treasuryType === 'program') {
            // Programs can only send to individuals
            return option.value === 'individual'
        }
        return true
    })

    useEffect(() => {
        setRecipient(initialRecipient)
    }, [initialRecipient])

    useEffect(() => {
        onRecipientChange?.(recipient)
    }, [recipient, onRecipientChange])

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

        if (!message.trim()) {
            newErrors.message = 'Internal memo is required for audit'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSend = () => {
        if (!validateForm()) {
            return
        }

        const formData: Partial<SendCreditsFormData> = {
            recipientType: recipientType?.value,
            amount: parseFloat(amount.replace(/,/g, '')),
            recipient: recipient,
            message: message,
        }

        openSendModal(formData)
    }

    const handleAmountChange = (value: string) => {
        const cleaned = value.replace(/[^0-9.,]/g, '')
        setAmount(cleaned)
        if (errors.amount) {
            setErrors((prev) => ({ ...prev, amount: undefined }))
        }
    }

    return (
        <Card className="p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 transition-all animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="p-6 md:p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Send Credits</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                        Allocate from {treasuryType} account
                    </p>
                </div>
                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-primary" />
                </div>
            </div>

            <div className="p-8 md:p-10 space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 pl-1">
                            <User className="w-3.5 h-3.5 text-primary" />
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Type</label>
                        </div>
                        <Select
                            value={recipientType}
                            onChange={(value) => {
                                setRecipientType(value as RecipientOption)
                                if (errors.recipientType) setErrors((prev) => ({ ...prev, recipientType: undefined }))
                            }}
                            options={filteredOptions}
                            placeholder="Select target type..."
                            className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-sm font-bold"
                        />
                        {errors.recipientType && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-tight pl-1">{errors.recipientType}</p>}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 pl-1">
                            <CreditCard className="w-3.5 h-3.5 text-primary" />
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount (NGN)</label>
                        </div>
                        <Input
                            placeholder="e.g. 50,000"
                            value={amount}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-sm font-bold font-mono"
                        />
                        {amount && !isNaN(parseFloat(amount.replace(/,/g, ''))) && (
                            <p className="text-[10px] font-bold text-primary pl-1">
                                You are sending {(parseFloat(amount.replace(/,/g, '')) / NAIRA_TO_USD_RATE).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Credits
                            </p>
                        )}
                        {errors.amount && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-tight pl-1">{errors.amount}</p>}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 pl-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Identifier (Email / Username / Org Tag)</label>
                        </div>
                        <Input
                            placeholder="@username or organization_tag"
                            value={recipient}
                            onChange={(e) => {
                                setRecipient(e.target.value)
                                if (errors.recipient) setErrors((prev) => ({ ...prev, recipient: undefined }))
                            }}
                            className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-sm font-bold"
                        />
                        {errors.recipient && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-tight pl-1">{errors.recipient}</p>}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 pl-1">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Optional Expiry</label>
                        </div>
                        <Input
                            type="date"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-sm font-bold"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 pl-1">
                        <MessageSquare className="w-3.5 h-3.5 text-primary" />
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Internal Memo (Required for Audit)</label>
                    </div>
                    <Input
                        placeholder="Why are you allocating these credits?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        textArea
                        rows={3}
                        className="rounded-2xl border-gray-100 dark:border-gray-800 text-sm font-bold"
                    />
                    {errors.message && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-tight pl-1">{errors.message}</p>}
                </div>

                <div className="flex justify-center pt-4">
                    <button
                        onClick={handleSend}
                        disabled={isSubmitting}
                        className="w-full sm:w-[320px] h-16 bg-primary hover:bg-primary-deep text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group"
                    >
                        {isSubmitting ? <Spinner size="20px" /> : <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
                        <span>{isSubmitting ? 'Processing...' : 'Send Credits Now'}</span>
                    </button>
                </div>
            </div>
        </Card>
    )
}
