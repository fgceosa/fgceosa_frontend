'use client'

import { useState } from 'react'
import { Button, Card, Input, Badge } from '@/components/ui'
import { Plus, Trash2, Send, Users, Mail, Tag, Coins, AlertCircle } from 'lucide-react'
import type { RecipientInput } from '@/services/WorkspaceCreditSharingService'

type DistributionMode = 'equal_split' | 'per_user' | 'custom'

interface ShareCreditsFormProps {
    workspaceBalance: number
    onSubmit: (recipients: RecipientInput[], totalAmount: number, amountPerUser: number | null, message: string) => void
    onCancel?: () => void
    isLoading?: boolean
}

export default function ShareCreditsForm({
    workspaceBalance,
    onSubmit,
    onCancel,
    isLoading = false,
}: ShareCreditsFormProps) {
    const [distributionMode, setDistributionMode] = useState<DistributionMode>('equal_split')
    const [recipients, setRecipients] = useState<RecipientInput[]>([
        { email: '', tag_number: '', amount: undefined }
    ])
    const [totalAmount, setTotalAmount] = useState<string>('')
    const [amountPerUser, setAmountPerUser] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [errors, setErrors] = useState<Record<string, string>>({})

    const addRecipient = () => {
        setRecipients([...recipients, { email: '', tag_number: '', amount: undefined }])
    }

    const removeRecipient = (index: number) => {
        if (recipients.length > 1) {
            setRecipients(recipients.filter((_, i) => i !== index))
        }
    }

    const updateRecipient = (index: number, field: keyof RecipientInput, value: string | number) => {
        const updated = [...recipients]
        if (field === 'email') {
            updated[index] = { ...updated[index], email: value as string, tag_number: '' }
        } else if (field === 'tag_number') {
            updated[index] = { ...updated[index], tag_number: value as string, email: '' }
        } else if (field === 'amount') {
            updated[index] = { ...updated[index], amount: value as number }
        }
        setRecipients(updated)
    }

    const calculateTotal = (): number => {
        if (distributionMode === 'equal_split') {
            return parseFloat(totalAmount) || 0
        } else if (distributionMode === 'per_user') {
            return (parseFloat(amountPerUser) || 0) * recipients.length
        } else {
            return recipients.reduce((sum, r) => sum + (r.amount || 0), 0)
        }
    }

    const calculatePerRecipient = (): number => {
        if (distributionMode === 'equal_split') {
            const total = parseFloat(totalAmount) || 0
            return recipients.length > 0 ? total / recipients.length : 0
        } else if (distributionMode === 'per_user') {
            return parseFloat(amountPerUser) || 0
        }
        return 0
    }

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        // Validate recipients
        recipients.forEach((recipient, index) => {
            if (!recipient.email && !recipient.tag_number) {
                newErrors[`recipient_${index}`] = 'Email or tag number is required'
            }
            if (distributionMode === 'custom' && !recipient.amount) {
                newErrors[`amount_${index}`] = 'Amount is required'
            }
        })

        // Validate amounts
        const total = calculateTotal()
        if (total <= 0) {
            newErrors.amount = 'Total amount must be greater than 0'
        }

        if (total > workspaceBalance) {
            newErrors.amount = `Insufficient balance. Available: ${workspaceBalance.toFixed(2)} credits`
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        if (!validateForm()) return

        const validRecipients = recipients.filter(r => r.email || r.tag_number)
        const total = calculateTotal()
        const perUser = distributionMode === 'per_user' ? parseFloat(amountPerUser) : null

        onSubmit(validRecipients, total, perUser, message)
    }

    const total = calculateTotal()
    const perRecipient = calculatePerRecipient()
    const balanceAfter = workspaceBalance - total
    const hasSufficientBalance = balanceAfter >= 0

    return (
        <div className="space-y-6">
            {/* Distribution Mode Selector */}
            <Card>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Distribution Mode
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                        onClick={() => setDistributionMode('equal_split')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                            distributionMode === 'equal_split'
                                ? 'border-[#0055BA] bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <div className="text-center">
                            <Users className={`w-6 h-6 mx-auto mb-2 ${
                                distributionMode === 'equal_split' ? 'text-[#0055BA]' : 'text-gray-500'
                            }`} />
                            <p className="font-semibold text-sm">Equal Split</p>
                            <p className="text-xs text-gray-500 mt-1">Divide total equally</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setDistributionMode('per_user')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                            distributionMode === 'per_user'
                                ? 'border-[#0055BA] bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <div className="text-center">
                            <Coins className={`w-6 h-6 mx-auto mb-2 ${
                                distributionMode === 'per_user' ? 'text-[#0055BA]' : 'text-gray-500'
                            }`} />
                            <p className="font-semibold text-sm">Fixed Per User</p>
                            <p className="text-xs text-gray-500 mt-1">Same amount each</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setDistributionMode('custom')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                            distributionMode === 'custom'
                                ? 'border-[#0055BA] bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <div className="text-center">
                            <Tag className={`w-6 h-6 mx-auto mb-2 ${
                                distributionMode === 'custom' ? 'text-[#0055BA]' : 'text-gray-500'
                            }`} />
                            <p className="font-semibold text-sm">Custom Amounts</p>
                            <p className="text-xs text-gray-500 mt-1">Set per recipient</p>
                        </div>
                    </button>
                </div>
            </Card>

            {/* Amount Input (for equal_split and per_user modes) */}
            {distributionMode !== 'custom' && (
                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        {distributionMode === 'equal_split' ? 'Total Amount' : 'Amount Per User'}
                    </h3>
                    <Input
                        type="number"
                        placeholder="0.00"
                        value={distributionMode === 'equal_split' ? totalAmount : amountPerUser}
                        onChange={(e) =>
                            distributionMode === 'equal_split'
                                ? setTotalAmount(e.target.value)
                                : setAmountPerUser(e.target.value)
                        }
                        min="0"
                        step="0.01"
                        prefix={<Coins className="w-4 h-4" />}
                    />
                    {errors.amount && (
                        <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.amount}
                        </p>
                    )}
                </Card>
            )}

            {/* Recipients List */}
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Recipients ({recipients.length})
                    </h3>
                    <Button
                        variant="solid"
                        size="sm"
                        icon={<Plus />}
                        onClick={addRecipient}
                        className="bg-[#0055BA] hover:bg-[#003d85]"
                    >
                        Add Recipient
                    </Button>
                </div>

                <div className="space-y-3">
                    {recipients.map((recipient, index) => (
                        <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                                {/* Email/Tag Input */}
                                <div className="md:col-span-6">
                                    <label className="block text-sm font-medium mb-2">
                                        Email or Tag Number <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="email@example.com"
                                            value={recipient.email || ''}
                                            onChange={(e) => updateRecipient(index, 'email', e.target.value)}
                                            prefix={<Mail className="w-4 h-4" />}
                                            disabled={!!recipient.tag_number}
                                        />
                                        <span className="text-gray-500 self-center">or</span>
                                        <Input
                                            placeholder="@qor123456"
                                            value={recipient.tag_number || ''}
                                            onChange={(e) => updateRecipient(index, 'tag_number', e.target.value)}
                                            prefix={<Tag className="w-4 h-4" />}
                                            disabled={!!recipient.email}
                                        />
                                    </div>
                                    {errors[`recipient_${index}`] && (
                                        <p className="text-sm text-red-600 mt-1">{errors[`recipient_${index}`]}</p>
                                    )}
                                </div>

                                {/* Amount (for custom mode) */}
                                {distributionMode === 'custom' && (
                                    <div className="md:col-span-5">
                                        <label className="block text-sm font-medium mb-2">
                                            Amount <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            value={recipient.amount || ''}
                                            onChange={(e) => updateRecipient(index, 'amount', parseFloat(e.target.value))}
                                            min="0"
                                            step="0.01"
                                            prefix={<Coins className="w-4 h-4" />}
                                        />
                                        {errors[`amount_${index}`] && (
                                            <p className="text-sm text-red-600 mt-1">{errors[`amount_${index}`]}</p>
                                        )}
                                    </div>
                                )}

                                {/* Remove Button */}
                                <div className={distributionMode === 'custom' ? 'md:col-span-1' : 'md:col-span-6'}>
                                    <label className="block text-sm font-medium mb-2 invisible">Remove</label>
                                    <Button
                                        variant="plain"
                                        size="sm"
                                        icon={<Trash2 />}
                                        onClick={() => removeRecipient(index)}
                                        disabled={recipients.length === 1}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Optional Message */}
            <Card>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Message (Optional)
                </h3>
                <Input
                    textArea
                    rows={3}
                    placeholder="Add a note about this credit allocation..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-2">{message.length}/500 characters</p>
            </Card>

            {/* Summary */}
            <Card className={`${hasSufficientBalance ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${hasSufficientBalance ? 'border-blue-200' : 'border-red-200'}`}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Transfer Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Recipients</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {recipients.length}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Per Recipient</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {perRecipient.toFixed(2)}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {total.toFixed(2)}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Balance After</p>
                        <p className={`text-2xl font-bold ${hasSufficientBalance ? 'text-green-600' : 'text-red-600'}`}>
                            {balanceAfter.toFixed(2)}
                        </p>
                    </div>
                </div>
                {!hasSufficientBalance && (
                    <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                            Insufficient balance. You need {Math.abs(balanceAfter).toFixed(2)} more credits.
                        </p>
                    </div>
                )}
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
                {onCancel && (
                    <Button
                        variant="plain"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    variant="solid"
                    icon={<Send />}
                    onClick={handleSubmit}
                    loading={isLoading}
                    disabled={!hasSufficientBalance || isLoading}
                    className="bg-[#0055BA] hover:bg-[#003d85]"
                >
                    Share {total.toFixed(2)} Credits
                </Button>
            </div>
        </div>
    )
}
