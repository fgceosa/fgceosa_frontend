'use client'

import React, { useState } from 'react'
import {
    Dialog,
    Button,
    Input,
    Notification,
    toast,
} from '@/components/ui'
import {
    Send,
    Plus,
    Search,
    Coins,
    Zap,
    ChevronRight,
    Info,
} from 'lucide-react'
import classNames from '@/utils/classNames'
import { useAppDispatch, useAppSelector } from '@/store'
import { shareWorkspaceCredits, fetchWorkspace, fetchCreditTransactions } from '@/store/slices/workspace/workspaceThunk'
import { selectOperationsLoading } from '@/store/slices/workspace/workspaceSelectors'
import { selectOrganizationMembers, selectOrganizationCreditBalance, selectCurrentOrganizationId } from '@/store/slices/organization/organizationSelectors'
import { fetchOrganizationCreditBalance } from '@/store/slices/organization/organizationThunk'
import { triggerWalletRefresh } from '@/hooks/useWalletRedux'
import { fetchOrganizationWalletBalanceAsync } from '@/store/slices/wallet/walletThunks'
import { extractErrorMessage } from '@/utils/errorUtils'
import { NAIRA_TO_USD_RATE } from '@/constants/currency.constant'
import { useEffect } from 'react'

interface ShareCreditsModalProps {
    isOpen: boolean
    onClose: () => void
    workspace: any
}

export default function ShareCreditsModal({ isOpen, onClose, workspace }: ShareCreditsModalProps) {
    const dispatch = useAppDispatch()
    const loading = useAppSelector(selectOperationsLoading)
    const organizationMembers = useAppSelector(selectOrganizationMembers) || []
    const organizationBalance = useAppSelector(selectOrganizationCreditBalance)
    const organizationId = useAppSelector(selectCurrentOrganizationId)

    const [shareCreditAmount, setShareCreditAmount] = useState('')
    const [shareCreditMessage, setShareCreditMessage] = useState('')
    const [selectedRecipients, setSelectedRecipients] = useState<any[]>([])
    const [isConfirmShareOpen, setIsConfirmShareOpen] = useState(false)
    const [memberSearchQuery, setMemberSearchQuery] = useState('')
    const [isSharing, setIsSharing] = useState(false)

    useEffect(() => {
        if (isOpen && organizationId) {
            dispatch(fetchOrganizationCreditBalance(organizationId))
        }
    }, [isOpen, organizationId, dispatch])

    const handleShareCredits = async () => {
        if (selectedRecipients.length === 0) {
            toast.push(<Notification type="warning" duration={2000}>Please select at least one member</Notification>)
            return
        }

        const creditAmount = parseFloat(shareCreditAmount)
        if (isNaN(creditAmount) || creditAmount <= 0) {
            toast.push(<Notification type="warning" duration={2000}>Please enter a valid amount of credits</Notification>)
            return
        }

        if (!workspace?.id) return

        const availableCredits = organizationBalance?.balance || 0

        // Check if we have enough credits in organization
        if (availableCredits < creditAmount) {
            const errorMsg = `Insufficient credits in organization treasury (Required: ${creditAmount.toLocaleString()})`
            toast.push(<Notification type="danger" duration={3000}>{errorMsg}</Notification>)
            return
        }

        setIsSharing(true)

        try {
            const response = await dispatch(
                shareWorkspaceCredits({
                    workspaceId: workspace.id,
                    recipients: selectedRecipients.map(r => ({ user_id: r.userId })),
                    total_amount: Number(parseFloat(shareCreditAmount).toFixed(2)),
                    message: shareCreditMessage || undefined,
                    draw_from_organization: true // Always draw from Org treasury
                }),
            ).unwrap()

            if (response.failed_count > 0) {
                const errorMsg = response.results.find((r: any) => r.status === 'failed')?.error || 'Failed to share credits with some members'
                toast.push(<Notification type="danger" duration={4000}>{errorMsg}</Notification>)
                if (response.success_count === 0) {
                    return // Stop execution if all failed
                }
            } else {
                toast.push(<Notification type="success" title="Success" duration={2000}>Credits shared successfully</Notification>)
            }

            dispatch(fetchWorkspace(workspace.id))
            dispatch(fetchCreditTransactions({ workspaceId: workspace.id }))
            onClose()
            setIsConfirmShareOpen(false)
            setSelectedRecipients([])
            setShareCreditAmount('')
            setShareCreditMessage('')
            if (organizationId) {
                dispatch(fetchOrganizationCreditBalance(organizationId))
                dispatch(fetchOrganizationWalletBalanceAsync({ organizationId }))
            }
            triggerWalletRefresh()
        } catch (err: any) {
            toast.push(<Notification type="danger" duration={3000}>{extractErrorMessage(err, 'Failed to share credits')}</Notification>)
        } finally {
            setIsSharing(false)
        }
    }

    if (!workspace) return null

    return (
        <>
            <Dialog
                isOpen={isOpen}
                onClose={onClose}
                width={900}
                closable={false}
                className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
                contentClassName="!shadow-none"
            >
                <div className="relative">
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                                <Send className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Share Credits</h2>
                                <p className="text-[10px] text-gray-400 font-black">Distribution via <span className="text-primary">{workspace.name}</span></p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group"
                        >
                            <Plus className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors rotate-45" />
                        </button>
                    </div>

                    <div className="flex flex-col lg:flex-row h-[600px]">
                        {/* Left Column: Team Member Selector */}
                        <div className="w-full lg:w-1/2 p-6 border-b lg:border-b-0 lg:border-r border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/5 flex flex-col">
                            <div className="mb-4">
                                <label className="text-[10px] font-black text-gray-900 tracking-widest pl-1 mb-2 block">Select Recipients</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search organization team..."
                                        value={memberSearchQuery}
                                        onChange={(e) => setMemberSearchQuery(e.target.value)}
                                        className="w-full h-11 pl-9 pr-4 rounded-xl border-none bg-white dark:bg-gray-900 shadow-sm text-sm font-bold placeholder:font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                                {organizationMembers
                                    .filter(m =>
                                        !memberSearchQuery ||
                                        m.name?.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
                                        m.email?.toLowerCase().includes(memberSearchQuery.toLowerCase())
                                    )
                                    .map((member) => {
                                        const isSelected = selectedRecipients.some(r => r.id === member.id)
                                        return (
                                            <button
                                                key={member.id}
                                                onClick={() => {
                                                    if (isSelected) {
                                                        setSelectedRecipients(prev => prev.filter(r => r.id !== member.id))
                                                    } else {
                                                        setSelectedRecipients(prev => [...prev, member])
                                                    }
                                                }}
                                                className={classNames(
                                                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all border",
                                                    isSelected
                                                        ? "bg-white dark:bg-gray-800 border-primary shadow-lg shadow-primary/10 ring-1 ring-primary"
                                                        : "bg-transparent border-transparent hover:bg-white dark:hover:bg-gray-800 hover:border-gray-100 dark:hover:border-gray-700"
                                                )}
                                            >
                                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-black text-gray-400">
                                                    {member.name ? member.name.charAt(0).toUpperCase() : '?'}
                                                </div>
                                                <div className="text-left overflow-hidden flex-1">
                                                    <div className={classNames("text-sm font-black truncate", isSelected ? "text-primary" : "text-gray-700 dark:text-gray-300")}>
                                                        {member.name}
                                                    </div>
                                                    <div className="text-[10px] font-medium text-gray-400 truncate">
                                                        {member.email}
                                                    </div>
                                                </div>
                                                {isSelected && (
                                                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                                        <Plus className="w-3.5 h-3.5 text-white rotate-45" />
                                                    </div>
                                                )}
                                            </button>
                                        )
                                    })}
                            </div>
                        </div>

                        {/* Right Column: Allocation Details */}
                        <div className="w-full lg:w-1/2 p-8 flex flex-col overflow-hidden">
                            <div className="flex-1 space-y-8 overflow-y-auto custom-scrollbar pr-2">


                                {/* Organization Treasury Status */}
                                {organizationId && (
                                    <div className="p-4 rounded-2xl border bg-primary/5 border-primary/10 flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center border border-primary/20">
                                            <Zap className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-[9px] font-black text-gray-400 block">Central Org Treasury Wallet</span>
                                            <div className="text-lg font-black text-gray-900 dark:text-white">
                                                {(organizationBalance?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-gray-400">Credits</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Recipients List (Summary) */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-900 tracking-widest pl-1 block">Selected Recipients ({selectedRecipients.length})</label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedRecipients.length === 0 ? (
                                            <p className="text-xs text-gray-400 italic py-2">No recipients selected yet...</p>
                                        ) : (
                                            selectedRecipients.map(m => (
                                                <div
                                                    key={m.id}
                                                    onClick={() => setSelectedRecipients(prev => prev.filter(r => r.id !== m.id))}
                                                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all group"
                                                >
                                                    <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 group-hover:text-rose-500 transition-colors">{m.name.split(' ')[0]}</span>
                                                    <button className="text-gray-400 group-hover:text-rose-500 transition-colors">
                                                        <Plus className="w-3 h-3 rotate-45" />
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Amount Input */}
                                <div className="space-y-4 p-6 bg-primary/[0.02] dark:bg-primary/[0.03] rounded-[2rem] border border-primary/10 transition-all duration-300 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                        <Zap className="w-16 h-16 text-primary" />
                                    </div>

                                    <div className="flex items-center justify-between pl-1">
                                        <div className="flex items-center gap-2">
                                            <label className="text-[10px] font-black text-gray-900 dark:text-gray-100 tracking-[0.2em]">Transfer Credits</label>
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        <Input
                                            type="text"
                                            placeholder="0.00"
                                            value={shareCreditAmount}
                                            onChange={(e) => {
                                                const val = e.target.value
                                                if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                                                    setShareCreditAmount(val)
                                                }
                                            }}
                                            className={classNames(
                                                "h-20 rounded-2xl font-black text-3xl border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm focus:shadow-primary/5 focus:border-primary/30 transition-all pl-6 pr-24",
                                                (parseFloat(shareCreditAmount) > (organizationBalance?.balance || 0)) ? "text-primary bg-primary/5" : ""
                                            )}
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-end pointer-events-none">
                                            <span className="font-black text-[10px] text-primary tracking-widest">Credits</span>
                                            <span className="text-[8px] font-bold text-gray-400 italic">Target</span>
                                        </div>
                                    </div>
                                    {selectedRecipients.length > 0 && shareCreditAmount && !isNaN(parseFloat(shareCreditAmount)) && (
                                        <div className="flex flex-col gap-3 px-5 py-4 bg-white dark:bg-gray-800/80 rounded-2xl border border-primary/10 shadow-sm relative">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] font-black text-gray-600 dark:text-gray-400 tracking-widest leading-none">
                                                    Transfer Summary
                                                </span>
                                            </div>
                                            <div className="space-y-2 pl-4 border-l-2 border-primary/20 ml-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] font-bold text-gray-400">Total Credits:</span>
                                                    <span className="text-sm font-black text-emerald-600">{(parseFloat(shareCreditAmount)).toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] font-bold text-gray-400">Each Recipient ({selectedRecipients.length}):</span>
                                                    <span className="text-xs font-black text-primary">{(parseFloat(shareCreditAmount) / selectedRecipients.length).toLocaleString()} <span className="text-[8px] opacity-60 tracking-tighter">Credits</span></span>
                                                </div>
                                                <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-800 pt-2 mt-2">
                                                    <span className="text-[9px] font-bold text-gray-400 tracking-tighter">Current Conversion Rate</span>
                                                    <span className="text-[9px] font-black text-gray-900 dark:text-gray-200">1 AI Credit = ₦{NAIRA_TO_USD_RATE.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {shareCreditAmount && !isNaN(parseFloat(shareCreditAmount)) && (parseFloat(shareCreditAmount)) > (organizationBalance?.balance || 0) && (
                                        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                            <p className="text-[10px] font-black text-red-600 tracking-widest pl-2">Insufficient credits in treasury</p>
                                        </div>
                                    )}
                                </div>

                                {/* Optional Message */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-900 tracking-widest pl-1 block">Message (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="What's this for?"
                                        value={shareCreditMessage}
                                        onChange={(e) => setShareCreditMessage(e.target.value)}
                                        className="w-full h-12 px-5 rounded-xl border-none bg-gray-50/50 dark:bg-gray-800/30 font-bold text-sm focus:ring-4 focus:ring-primary/5 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-8 flex gap-4 mt-auto">
                                <button
                                    onClick={onClose}
                                    className="flex-1 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-[11px] font-black text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                                >
                                    Cancel
                                </button>
                                <Button
                                    variant="solid"
                                    disabled={!shareCreditAmount || isNaN(parseFloat(shareCreditAmount)) || selectedRecipients.length === 0 || (parseFloat(shareCreditAmount)) > (organizationBalance?.balance || 0)}
                                    onClick={() => setIsConfirmShareOpen(true)}
                                    className="flex-[2] h-14 bg-primary hover:bg-primary-deep text-white font-black text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group"
                                >
                                    Next Step
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog
                isOpen={isConfirmShareOpen}
                onClose={() => setIsConfirmShareOpen(false)}
                width={450}
                className="rounded-[2.5rem] bg-white dark:bg-gray-900 border-none overflow-hidden"
            >
                <div className="p-8 space-y-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                        <Send className="w-10 h-10 text-primary" />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Confirm Sharing</h3>
                        <p className="text-sm text-gray-500 font-medium italic">You are about to share <span className="font-black text-emerald-500 italic">{(Number(shareCreditAmount)).toLocaleString()} Credits</span> with <span className="font-black text-gray-900 dark:text-white tracking-tighter italic">{selectedRecipients.length} team members</span>.</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black text-gray-400 tracking-widest">
                            <span>Source Account</span>
                            <span className="font-black px-2 py-0.5 rounded text-[9px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                Central Org Treasury
                            </span>
                        </div>
                        <div className="h-px bg-gray-100 dark:bg-gray-800" />
                        <div className="flex justify-between items-center text-[10px] font-black text-gray-400 tracking-widest">
                            <span>Credits Per Member</span>
                            <span className="text-gray-900 dark:text-white font-black italic">{(Number(shareCreditAmount) / selectedRecipients.length).toLocaleString()} <span className="text-[8px] opacity-40">Credits</span></span>
                        </div>
                        <div className="h-px bg-gray-100 dark:bg-gray-800" />
                        <div className="flex justify-between items-center text-[10px] font-black text-gray-100 tracking-[0.2em] p-3 bg-primary rounded-xl">
                            <span className="text-white">Total Transfer</span>
                            <span className="text-xl text-white font-black italic">{(Number(shareCreditAmount)).toLocaleString()} Credits</span>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button
                            variant="plain"
                            onClick={() => setIsConfirmShareOpen(false)}
                            className="flex-1 h-14 rounded-2xl font-black text-[11px]"
                        >
                            Review
                        </Button>
                        <Button
                            variant="solid"
                            onClick={handleShareCredits}
                            loading={loading || isSharing}
                            className="flex-[2] h-14 bg-primary text-white font-black text-[11px] rounded-2xl shadow-xl shadow-primary/20"
                        >
                            Confirm & Share
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}
