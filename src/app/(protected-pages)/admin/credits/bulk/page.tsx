'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import {
    fetchBulkCreditsStats,
    fetchBulkTransactions,
    sendCredits,
    selectBulkCreditsStats,
    selectSendCreditsLoading,
    selectBulkCreditsError,
} from '@/store/slices/bulkCredits'
import BulkStatsCards from './_components/Stats/BulkStatsCards'
import BulkTabs from './_components/BulkTabs'
import { selectCurrentOrganization } from '@/store/slices/organization/organizationSelectors'
import { selectOrganizationCredits } from '@/store/slices/wallet'
import { fetchOrganizationWalletBalanceAsync } from '@/store/slices/wallet'
import SendCreditsModal from './_components/Modals/SendCreditsModal'
import type { SendCreditsFormData, Treasury } from './types'
import { toast, Notification } from '@/components/ui'
import { Send, Wallet, ShieldAlert } from 'lucide-react'

// Mock Treasuries


/**
 * BulkCreditsPage - Redesigned to match the enterprise layout of Revenue Dashboard.
 *
 * Updated Terminology:
 * - "Treasury" (Internal) -> "Source Account" (User Facing)
 * - "Bulk Credits" -> "Distribute Credit"
 */
export default function BulkCreditsPage() {
    const dispatch = useAppDispatch()
    const [isSendModalOpen, setIsSendModalOpen] = useState(false)

    // Redux selectors
    const stats = useAppSelector(selectBulkCreditsStats)
    const organization = useAppSelector(selectCurrentOrganization)
    const orgCredits = useAppSelector(selectOrganizationCredits)
    const isSending = useAppSelector(selectSendCreditsLoading)
    const error = useAppSelector(selectBulkCreditsError)

    // Build Treasuries List
    const treasuries = useMemo(() => {
        const list: Treasury[] = []

        if (organization) {
            list.push({
                id: organization.id,
                name: `${organization.name} Treasury`,
                type: 'organization',
                balance: orgCredits?.balance || 0,
                owner: organization.name,
                scope: 'Organization-wide budget',
                limits: {
                    maxPerAllocation: 25000000,
                    approvalThreshold: 10000000
                }
            })
        }

        // Add personal as fallback or secondary
        list.push({
            id: 'personal',
            name: 'Personal Wallet',
            type: 'platform',
            balance: stats.totalBalance || 0,
            owner: 'Me',
            scope: 'Personal allocation',
            limits: {
                maxPerAllocation: 10000000,
                approvalThreshold: 5000000
            }
        })

        return list
    }, [stats.totalBalance, organization, orgCredits?.balance])

    // Default to organization treasury if it exists, otherwise personal
    const [selectedTreasury, setSelectedTreasury] = useState<Treasury>(treasuries[0])

    // Update selected treasury when the list is populated (e.g. when organization loads)
    useEffect(() => {
        if (treasuries.length > 0) {
            const orgTreasury = treasuries.find(t => t.type === 'organization')
            if (orgTreasury && selectedTreasury.id === 'personal' && selectedTreasury.id !== orgTreasury.id) {
                setSelectedTreasury(orgTreasury)
            } else if (!selectedTreasury.id || (selectedTreasury.id === 'personal' && !orgTreasury)) {
                setSelectedTreasury(treasuries[0])
            }
        }
    }, [treasuries, selectedTreasury.id])


    const [modalInitialData, setModalInitialData] = useState<Partial<SendCreditsFormData>>({})

    useEffect(() => {
        const orgId = selectedTreasury.id !== 'personal' ? selectedTreasury.id : undefined
        dispatch(fetchBulkCreditsStats(orgId))
            .unwrap()
            .catch((err) => {
                // If org credits fails, it might be because the user doesn't have permission 
                // but the UI should still handle it gracefully.
                console.error("fetchBulkCreditsStats failed", err)
            })

        if (organization) {
            dispatch(fetchOrganizationWalletBalanceAsync({ organizationId: organization.id, silent: true }))
        }
    }, [dispatch, organization?.id, selectedTreasury.id])

    // Update selected treasury if treasuries list changes (to keep balance in sync)
    useEffect(() => {
        const current = treasuries.find(t => t.id === selectedTreasury.id)
        if (current && (current.balance !== selectedTreasury.balance || current.name !== selectedTreasury.name)) {
            setSelectedTreasury(current)
        }
    }, [treasuries, selectedTreasury.id, selectedTreasury.balance, selectedTreasury.name])

    // Sync selected treasury balance with global stats
    // useEffect(() => {
    //     if (selectedTreasury.id === 'personal' && stats.totalBalance !== undefined) {
    //         setSelectedTreasury(prev => ({
    //             ...prev,
    //             balance: stats.totalBalance
    //         }))
    //     }
    // }, [stats.totalBalance, selectedTreasury.id])

    const handleOpenSendModal = (data?: Partial<SendCreditsFormData>) => {
        setModalInitialData(data || {})
        setIsSendModalOpen(true)
    }

    const handleSendSuccess = async (data: SendCreditsFormData) => {
        try {
            // Append organizationId if using org treasury
            const payload = {
                ...data,
                organizationId: selectedTreasury.id !== 'personal' ? selectedTreasury.id : undefined
            }
            const result = await dispatch(sendCredits(payload)).unwrap()

            toast.push(
                <Notification type="success" className="border-none p-0 bg-transparent">
                    <div className="flex flex-col gap-1">
                        <p className="font-black text-xs text-emerald-600">Sent Successfully</p>
                        <p className="text-sm font-bold">
                            ₦{data.amount.toLocaleString()} sent to {data.recipient}
                        </p>
                    </div>
                </Notification>,
                { placement: 'top-center' },
            )

            setIsSendModalOpen(false)
            setModalInitialData({})
            const orgId = selectedTreasury.id !== 'personal' ? selectedTreasury.id : undefined
            dispatch(fetchBulkCreditsStats(orgId))
            dispatch(fetchBulkTransactions({ pageIndex: 0, pageSize: 10, organizationId: orgId }))
            window.dispatchEvent(new CustomEvent('wallet-updated'))
        } catch (error: any) {
            console.error('Failed to send credits:', error)

            toast.push(
                <Notification type="danger" className="border-none p-0 bg-transparent">
                    <div className="flex flex-col gap-1">
                        <p className="font-black text-xs text-rose-600">Failed to Send</p>
                        <p className="text-sm font-bold">
                            {error || 'Please check recipient details and try again'}
                        </p>
                    </div>
                </Notification>,
                { placement: 'top-center' },
            )
        }
    }

    const activeStats = useMemo(() => {
        return {
            ...stats,
            totalBalance: selectedTreasury.id === 'personal' ? stats.totalBalance : selectedTreasury.balance
        }
    }, [stats, selectedTreasury])

    return (
        <div className="min-h-screen bg-[#f5f5f5] dark:bg-gray-900/50 p-4 sm:p-8 overflow-x-hidden">
            <div className="max-w-full mx-auto space-y-10 animate-in fade-in duration-700">
                {/* Enterprise Header Section - Matches RevenuePage */}
                <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-2">
                    <div className="space-y-4 lg:space-y-1">
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-xs font-black text-primary whitespace-nowrap">Finance</span>
                            <div className="h-px w-12 bg-primary/20" />
                            <span className="text-xs font-black text-gray-900 dark:text-gray-100 whitespace-nowrap">Distribute</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shrink-0">
                                <Wallet className="h-6 w-6 text-primary" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-none">
                                Distribute Credit
                            </h1>
                        </div>
                        <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 lg:pl-14 font-medium max-w-2xl leading-relaxed">
                            Send, track, and manage credit allocations across your ecosystem.
                        </p>
                    </div>

                </header>


                <div className="relative">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
                    <div className="absolute top-40 -right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl opacity-50 pointer-events-none" />

                    <div className="relative z-10 mb-10">
                        <BulkStatsCards stats={activeStats} />
                    </div>

                    <div className="relative z-10">
                        <BulkTabs
                            openSendModal={handleOpenSendModal}
                            treasuryType={selectedTreasury.type}
                            organizationId={selectedTreasury.id !== 'personal' ? selectedTreasury.id : undefined}
                        />
                    </div>
                </div>

                {isSendModalOpen && (
                    <SendCreditsModal
                        isOpen={isSendModalOpen}
                        onClose={() => setIsSendModalOpen(false)}
                        onSuccess={handleSendSuccess}
                        initialData={modalInitialData}
                    />
                )}
            </div>
        </div>
    )
}
