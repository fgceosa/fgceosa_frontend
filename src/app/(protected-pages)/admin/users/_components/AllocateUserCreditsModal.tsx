'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
    Dialog,
    Input,
    Checkbox,
    Notification,
    toast
} from '@/components/ui'
import {
    X,
    TrendingUp,
    TrendingDown,
    User,
    Shield,
    Gift,
    ArrowUpCircle,
    RotateCcw,
    FileCheck,
    AlertOctagon,
    Receipt,
    Settings,
    HelpCircle,
    Check,
    Zap,
    Scale,
    Sparkles,
    Wallet
} from 'lucide-react'
import classNames from '@/utils/classNames'
import { apiAllocateUserCredits } from '@/services/admin/users/userService'
import { NAIRA_TO_USD_RATE, CURRENCY_SYMBOL } from '@/constants/currency.constant'
import { useAppDispatch } from '@/store/hook'
import { useAppSelector } from '@/store'
import { fetchUsers, fetchUsersAnalytics } from '@/store/slices/admin/users'
import { selectUsersParams } from '@/store/slices/admin/users/userSelectors'
import type { UserMember } from '../types'

interface AllocateUserCreditsModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    user: UserMember | null
}

const REASON_CATEGORIES = [
    { value: 'Promotional Grant', label: 'Promotional Grant', icon: Gift, color: 'text-purple-500', bg: 'bg-purple-50', darkBg: 'dark:bg-purple-500/10' },
    { value: 'Manual Top-Up', label: 'Manual Top-Up', icon: ArrowUpCircle, color: 'text-blue-500', bg: 'bg-blue-50', darkBg: 'dark:bg-blue-500/10' },
    { value: 'Refund / Reversal', label: 'Refund / Reversal', icon: RotateCcw, color: 'text-emerald-500', bg: 'bg-emerald-50', darkBg: 'dark:bg-emerald-500/10' },
    { value: 'SLA Compensation', label: 'SLA Compensation', icon: FileCheck, color: 'text-amber-500', bg: 'bg-amber-50', darkBg: 'dark:bg-amber-500/10' },
    { value: 'Abuse / Penalty', label: 'Abuse / Penalty', icon: AlertOctagon, color: 'text-rose-500', bg: 'bg-rose-50', darkBg: 'dark:bg-rose-500/10' },
    { value: 'Billing Correction', label: 'Billing Correction', icon: Receipt, color: 'text-indigo-500', bg: 'bg-indigo-50', darkBg: 'dark:bg-indigo-500/10' },
    { value: 'Internal Adjustment', label: 'Internal Adjustment', icon: Settings, color: 'text-gray-500', bg: 'bg-gray-50', darkBg: 'dark:bg-gray-500/10' },
    { value: 'Other', label: 'Other', icon: HelpCircle, color: 'text-gray-400', bg: 'bg-gray-50', darkBg: 'dark:bg-gray-500/10' }
]

export default function AllocateUserCreditsModal({
    isOpen,
    onClose,
    onSuccess,
    user
}: AllocateUserCreditsModalProps) {
    const dispatch = useAppDispatch()
    const currentParams = useAppSelector(selectUsersParams)
    const [allocationType, setAllocationType] = useState<'add' | 'deduct' | null>(null)
    const [amount, setAmount] = useState<string>('')
    const [reasonCategory, setReasonCategory] = useState<string | null>(null)
    const [reasonDescription, setReasonDescription] = useState<string>('')
    const [notifyUser, setNotifyUser] = useState<boolean>(true)
    const [confirmationText, setConfirmationText] = useState<string>('')
    const [loading, setLoading] = useState(false)

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setAllocationType(null)
            setAmount('')
            setReasonCategory(null)
            setReasonDescription('')
            setNotifyUser(true)
            setConfirmationText('')
        }
    }, [isOpen])

    const currentBalance = Number(user?.credits || 0)

    const calculatedNewBalance = useMemo(() => {
        if (!allocationType) return currentBalance
        const creditAmount = parseFloat(amount) || 0
        return allocationType === 'add' ? currentBalance + creditAmount : currentBalance - creditAmount
    }, [currentBalance, amount, allocationType])

    const isValid = useMemo(() => {
        if (!allocationType) return false
        const creditAmount = parseFloat(amount) || 0
        if (creditAmount <= 0) return false
        if (!reasonCategory) return false
        if (confirmationText.toLowerCase() !== 'allocate credits') return false
        return true
    }, [allocationType, amount, reasonCategory, confirmationText])

    const handleAllocate = async () => {
        if (!user || !isValid || !allocationType) return

        setLoading(true)
        try {
            await apiAllocateUserCredits(user.id, {
                adjustment_type: allocationType,
                amount: parseFloat(amount),
                reason_category: reasonCategory!,
                reason_description: reasonDescription,
                notify_user: notifyUser
            })

            // Re-fetch users with the SAME params active (preserves search/pagination)
            dispatch(fetchUsers(currentParams ?? undefined))
            dispatch(fetchUsersAnalytics())

            // Trigger wallet refresh event for real-time balance update
            window.dispatchEvent(new Event('wallet-updated'))

            toast.push(
                <Notification title="Success" type="success">
                    Credits allocated successfully.
                </Notification>
            )
            onSuccess()
            onClose()
        } catch (err: any) {
            toast.push(
                <Notification title="Allocation Failed" type="danger">
                    {err.response?.data?.detail || 'An error occurred during allocation.'}
                </Notification>
            )
        } finally {
            setLoading(false)
        }
    }

    if (!user) return null

    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || 'User'

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={640}
            closable={false}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
            contentClassName="!shadow-none"
        >
            <div className="relative">
                {/* Custom Header - Redesigned to match CreateCopilotModal */}
                <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Allocate Credits</h3>
                            <p className="text-[10px] font-black text-gray-400 tracking-widest mt-0.5">
                                Manual balance allocation for users
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
                <div className="px-6 py-6 space-y-6 max-h-[65vh] overflow-y-auto custom-scrollbar">
                    {/* User Context */}
                    <div className="p-5 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <span className="text-[9px] font-black text-gray-900 tracking-widest block">Target User</span>
                                    <div className="text-base font-black text-gray-900 dark:text-white tracking-tight">
                                        {fullName}
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-bold">{user.email}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[9px] font-black text-gray-900 tracking-widest block">Available Balance</span>
                                <div className="text-2xl font-black text-emerald-600 tracking-tight">
                                    {currentBalance.toLocaleString()} <span className="text-xs opacity-60">Credits</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Allocation Selection */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pl-1">
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                            <label className="text-[10px] font-black text-gray-900 tracking-widest">Select Allocation Action</label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setAllocationType('add')}
                                className={classNames(
                                    "group relative p-4 rounded-2xl border-2 text-left transition-all duration-300",
                                    allocationType === 'add'
                                        ? "border-emerald-500 bg-emerald-500/[0.02] shadow-sm ring-4 ring-emerald-500/5"
                                        : "bg-white dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 hover:border-emerald-500/30 hover:bg-gray-50 dark:hover:bg-gray-800"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={classNames(
                                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 border",
                                        allocationType === 'add'
                                            ? "bg-emerald-500 text-white border-emerald-500"
                                            : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 border-emerald-100 dark:border-emerald-500/20 group-hover:text-emerald-600 group-hover:border-emerald-500/20"
                                    )}>
                                        <TrendingUp className="w-5 h-5" strokeWidth={2.5} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-black tracking-tight text-gray-900 dark:text-white leading-none">
                                            Top-Up
                                        </p>
                                        <p className="text-[10px] font-bold text-gray-400 mt-1">Add Credits</p>
                                    </div>
                                    {allocationType === 'add' && (
                                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm shadow-emerald-500/30">
                                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                        </div>
                                    )}
                                </div>
                            </button>
                            <button
                                onClick={() => setAllocationType('deduct')}
                                className={classNames(
                                    "group relative p-4 rounded-2xl border-2 text-left transition-all duration-300",
                                    allocationType === 'deduct'
                                        ? "border-rose-500 bg-rose-500/[0.02] shadow-sm ring-4 ring-rose-500/5"
                                        : "bg-white dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 hover:border-rose-500/30 hover:bg-gray-50 dark:hover:bg-gray-800"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={classNames(
                                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 border",
                                        allocationType === 'deduct'
                                            ? "bg-rose-500 text-white border-rose-500"
                                            : "bg-rose-50 dark:bg-rose-500/10 text-rose-500 border-rose-100 dark:border-rose-500/20 group-hover:text-rose-600 group-hover:border-rose-500/20"
                                    )}>
                                        <TrendingDown className="w-5 h-5" strokeWidth={2.5} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-black tracking-tight text-gray-900 dark:text-white leading-none">
                                            Deduct
                                        </p>
                                        <p className="text-[10px] font-bold text-gray-400 mt-1">Remove Credits</p>
                                    </div>
                                    {allocationType === 'deduct' && (
                                        <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center shadow-sm shadow-rose-500/30">
                                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                        </div>
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-3 p-5 bg-primary/[0.02] dark:bg-primary/[0.03] rounded-[1.5rem] border border-primary/10 transition-all duration-300">
                        <div className="flex items-center justify-between pl-1">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-primary" />
                                <label className="text-[10px] font-black text-gray-900 dark:text-gray-100 tracking-[0.2em]">Allocate Credits</label>
                            </div>
                            <div className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-700">
                                <span className="text-[9px] font-black text-primary tracking-tighter italic">1 AI Credit = ₦{NAIRA_TO_USD_RATE.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 items-center">
                            <div className="relative group">
                                <Input
                                    type="text"
                                    placeholder="0.00"
                                    className="h-16 rounded-2xl border-gray-100 dark:border-gray-800 text-2xl font-black pl-6 pr-24 shadow-sm focus:shadow-primary/5 focus:border-primary/30 transition-all"
                                    value={amount}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                            setAmount(val);
                                        }
                                    }}
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-end pointer-events-none">
                                    <span className="font-black text-[10px] text-primary tracking-widest">Credits</span>
                                    <span className="text-[8px] font-bold text-gray-400">AI Resource</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {allocationType && parseFloat(amount) > 0 ? (
                                    <div className="p-4 bg-white dark:bg-gray-800/50 rounded-2xl border border-emerald-100 dark:border-emerald-500/10 flex flex-col justify-center animate-in zoom-in-95 duration-300 shadow-sm overflow-hidden relative">
                                        <div className="absolute top-0 right-0 p-2 opacity-10">
                                            <TrendingUp className="w-8 h-8 text-emerald-500" />
                                        </div>
                                        <span className="text-[9px] font-black text-emerald-600 tracking-widest mb-1">New Balance After Adjust</span>
                                        <div className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                                            {calculatedNewBalance.toLocaleString()} <span className="text-[10px]">Credits</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-gray-100/50 dark:bg-gray-800/20 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 flex flex-col justify-center gap-1">
                                        <span className="text-[9px] font-black text-gray-400 tracking-widest">Enter Amount</span>
                                        <div className="text-sm font-bold text-gray-300 italic">Waiting for input...</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Reason Selection */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pl-1">
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-primary" />
                            <label className="text-[10px] font-black text-gray-900 tracking-widest">Reason Category</label>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {REASON_CATEGORIES.map((cat) => {
                                const isSelected = reasonCategory === cat.value
                                const Icon = cat.icon

                                return (
                                    <button
                                        key={cat.value}
                                        onClick={() => setReasonCategory(cat.value)}
                                        className={classNames(
                                            "group relative p-4 rounded-2xl border-2 text-left transition-all duration-300",
                                            isSelected
                                                ? "border-primary bg-primary/[0.02] shadow-sm ring-4 ring-primary/5"
                                                : "bg-white dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 hover:border-primary/30 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={classNames(
                                                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 border",
                                                isSelected
                                                    ? "bg-primary text-white border-primary"
                                                    : `${cat.bg} ${cat.darkBg} ${cat.color} border-gray-100 dark:border-gray-700 group-hover:border-primary/20`
                                            )}>
                                                <Icon className="w-5 h-5" strokeWidth={2.5} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-black tracking-tight text-gray-900 dark:text-white truncate">
                                                    {cat.label}
                                                </p>
                                            </div>
                                            {isSelected && (
                                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm shadow-primary/30">
                                                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Documentation */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pl-1">
                            <FileCheck className="w-3.5 h-3.5 text-primary" />
                            <label className="text-[10px] font-black text-gray-900 tracking-widest">Explanatory Note (Optional)</label>
                        </div>
                        <Input
                            textArea
                            placeholder="Describe why this allocation is being made..."
                            value={reasonDescription}
                            onChange={(e) => setReasonDescription(e.target.value)}
                            rows={3}
                            className="rounded-2xl border-gray-100 dark:border-gray-800 text-base font-bold shadow-sm focus:shadow-primary/5"
                        />
                        <div className="flex items-center justify-end px-2">
                            <div className="flex items-center gap-2">
                                <Checkbox checked={notifyUser} onChange={(val) => setNotifyUser(val as boolean)} />
                                <span className="text-[9px] font-black text-gray-500 tracking-widest cursor-pointer select-none" onClick={() => setNotifyUser(!notifyUser)}>Notify User</span>
                            </div>
                        </div>
                    </div>

                    {/* Security & Verification */}
                    <div className="space-y-6">
                        <div className="p-4 bg-amber-50/50 dark:bg-amber-500/5 rounded-2xl border border-amber-100 dark:border-amber-500/10 flex items-start gap-4 shadow-sm">
                            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs font-black text-amber-700 dark:text-amber-500 tracking-tight block">Audit Verification</span>
                                <p className="text-[10px] font-bold text-amber-600/70 leading-relaxed">
                                    All allocations are permanent and logged for compliance auditing. Please verify totals before proceeding.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 pl-1">
                                <Shield className="w-3.5 h-3.5 text-primary" />
                                <label className="text-[10px] font-black text-gray-900 tracking-widest">
                                    Type <span className="text-gray-900 dark:text-white">allocate credits</span> to confirm
                                </label>
                            </div>
                            <Input
                                placeholder="allocate credits"
                                className="h-14 rounded-2xl border-gray-100 dark:border-gray-800 text-center font-black tracking-[0.1em] text-base shadow-sm focus:shadow-primary/5"
                                value={confirmationText}
                                onChange={(e) => setConfirmationText(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 pb-6 pt-2 flex gap-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    <button
                        onClick={onClose}
                        className="flex-1 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-[11px] font-black text-gray-600 dark:text-gray-300 tracking-[0.2em] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all hover:scale-105 active:scale-95"
                    >
                        Cancel
                    </button>
                    <div className="flex flex-col gap-3 flex-[1.5]">
                        <button
                            onClick={handleAllocate}
                            disabled={loading || !isValid}
                            className="h-14 bg-primary hover:bg-primary-deep text-white font-black tracking-[0.2em] text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50"
                        >
                            <Zap className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
                            <span>{loading ? 'Allocating...' : 'Complete Allocation'}</span>
                        </button>
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-[9px] font-black text-gray-400 tracking-widest text-center">
                                1 AI Credit = ₦{NAIRA_TO_USD_RATE.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
