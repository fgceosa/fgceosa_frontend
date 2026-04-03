/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useCallback, useEffect } from 'react'
import { Send, History, LayoutGrid, Info, ArrowUpRight, Zap, Search, CreditCard } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useRouter } from 'next/navigation'
import SummaryCards from './_components/SummaryCards'
import { Button, Card, Tabs, toast, Notification } from '@/components/ui'
import classNames from '@/utils/classNames'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabContent from '@/components/ui/Tabs/TabContent'
import SendCreditsDialog from './_components/SendCreditsDialog'
import {
    fetchSharedCreditsStats,
    fetchCreditTransactions,
    transferCredits,
    selectSharedCreditsStats,
    selectAvailableCredits,
    selectCreditTransactions,
    selectTransactionsTotal,
    selectTransactionsLoading,
    selectTransferLoading,
    selectStatsLoading,
} from '@/store/slices/sharedCredits'
import HistoryTable from './_components/HistoryTable'

export default function ShareCreditsPage() {
    const dispatch = useDispatch()
    const router = useRouter()
    const searchParams = useSearchParams()

    // Redux selectors
    const stats = useSelector(selectSharedCreditsStats)
    const availableCredits = useSelector(selectAvailableCredits)
    const transactions = useSelector(selectCreditTransactions)
    const transactionsTotal = useSelector(selectTransactionsTotal)
    const isTransactionsLoading = useSelector(selectTransactionsLoading)
    const isTransferring = useSelector(selectTransferLoading)
    const isStatsLoading = useSelector(selectStatsLoading)

    // Pagination state for transactions
    const pageIndex = parseInt(searchParams.get('pageIndex') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')

    // Local state
    const [isSendModalOpen, setIsSendModalOpen] = useState(false)

    // Fetch data on mount
    useEffect(() => {
        dispatch(fetchSharedCreditsStats() as any)
    }, [dispatch])

    // Fetch transactions when pagination changes
    useEffect(() => {
        dispatch(
            fetchCreditTransactions({
                pageIndex,
                pageSize,
            }) as any,
        )
    }, [dispatch, pageIndex, pageSize])

    const handleConfirmTransfer = async (data: { recipientIds?: string[]; recipientTags?: string[]; amount: number; message: string }) => {
        try {
            await dispatch(
                transferCredits(data) as any,
            ).unwrap()

            toast.push(
                <Notification type="success" title="Success" duration={3000}>
                    Credits shared successfully!
                </Notification>
            )

            // Refresh stats and transactions
            dispatch(fetchSharedCreditsStats() as any)
            dispatch(
                fetchCreditTransactions({
                    pageIndex: 1,
                    pageSize,
                }) as any,
            )

            // Close modal
            setIsSendModalOpen(false)
        } catch (error: any) {
            toast.push(
                <Notification type="danger" title="Error" duration={3000}>
                    {error || 'Failed to share credits'}
                </Notification>
            )
        }
    }

    return (
        <div className="max-w-[1400px] mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-700">
            {/* Header Section - Enterprise Grade */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
                <div className="space-y-3 lg:space-y-1">
                    <div className="flex items-center gap-3 sm:gap-4 mb-2">
                        <span className="text-[9px] sm:text-[10px] font-black text-primary whitespace-nowrap">Credit Hub</span>
                        <div className="h-px w-8 sm:w-12 bg-primary/20" />
                        <span className="text-[9px] sm:text-[10px] font-black text-gray-400 whitespace-nowrap">Asset Distribution</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 sm:p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shrink-0">
                            <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 dark:text-white leading-none">
                            Share Credits
                        </h1>
                    </div>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-500 dark:text-gray-400 lg:pl-14 font-medium max-w-2xl leading-relaxed">
                        Share your credits with friends and colleagues instantly using their unique Qorebit @tags.
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <Button
                        variant="solid"
                        onClick={() => setIsSendModalOpen(true)}
                        className="h-12 sm:h-14 px-6 sm:px-8 bg-primary hover:bg-primary-deep text-white font-black text-[10px] sm:text-[11px] rounded-xl sm:rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 sm:gap-3 group w-full sm:w-auto"
                    >
                        <Send className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                        Share Credits Now
                    </Button>
                </div>
            </div>

            {/* Background Decoration */}
            <div className="relative">
                <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full opacity-50 pointer-events-none" />

                {/* Stats Overview */}
                <div className="relative z-10 mb-10">
                    <SummaryCards stats={stats} />
                </div>

                {/* Main Content Areas */}
                <div className="relative z-10">
                    <Tabs defaultValue="history" className="w-full">
                        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-8">
                            <TabList className="bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-2xl w-fit min-w-max border border-gray-100 dark:border-gray-800 shadow-sm">
                                <TabNav value="history" className="px-4 sm:px-6 py-2.5 rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-primary transition-all font-black text-[9px] sm:text-[10px] whitespace-nowrap">
                                    <History className="w-4 h-4" />
                                    <span>History</span>
                                </TabNav>
                                <TabNav value="info" className="px-4 sm:px-6 py-2.5 rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-primary transition-all font-black text-[9px] sm:text-[10px] whitespace-nowrap">
                                    <Info className="w-4 h-4" />
                                    <span className="hidden sm:inline">How it Works</span>
                                    <span className="sm:hidden">Info</span>
                                </TabNav>
                            </TabList>
                        </div>

                        <TabContent value="history" className="mt-0">
                            <Card className="p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl sm:rounded-[1.5rem] lg:rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 transition-all">
                                <div className="p-4 sm:p-6 md:p-8 border-b border-gray-50 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/30 dark:bg-gray-800/10">
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">Recent Transactions</h3>
                                        <p className="text-xs font-bold text-gray-400 mt-1">Real-time distribution analytics</p>
                                    </div>
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center shrink-0">
                                        <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                    </div>
                                </div>
                                <div className="p-4 sm:p-6 md:p-8">
                                    <HistoryTable
                                        transactions={transactions}
                                        total={transactionsTotal}
                                        isLoading={isTransactionsLoading}
                                        pageIndex={pageIndex}
                                        pageSize={pageSize}
                                    />
                                </div>
                            </Card>
                        </TabContent>

                        <TabContent value="info" className="mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    {
                                        title: 'Search by Tag',
                                        desc: "Find friends and colleagues instantly using their unique Qorebit @tags.",
                                        icon: <Search className="w-6 h-6" />,
                                        color: 'text-blue-600 bg-blue-50',
                                    },
                                    {
                                        title: 'Send to Multiple',
                                        desc: 'Share credits with several people at once to save time.',
                                        icon: <Zap className="w-6 h-6" />,
                                        color: 'text-indigo-600 bg-indigo-50',
                                    },
                                    {
                                        title: 'Instant Transfers',
                                        desc: 'Credits are delivered to the recipient immediately and securely.',
                                        icon: <CreditCard className="w-6 h-6" />,
                                        color: 'text-emerald-600 bg-emerald-50',
                                    },
                                ].map((step, i) => (
                                    <Card key={i} className="p-6 sm:p-8 border-gray-100 dark:border-gray-800 hover:border-primary/20 transition-all bg-white dark:bg-gray-900 rounded-2xl sm:rounded-[2rem] shadow-xl shadow-gray-200/40 dark:shadow-none group">
                                        <div className={classNames("w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3", step.color)}>
                                            {step.icon}
                                        </div>
                                        <h4 className="text-base sm:text-lg font-black mb-2 sm:mb-3">{step.title}</h4>
                                        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium leading-relaxed">{step.desc}</p>
                                    </Card>
                                ))}
                            </div>
                        </TabContent>
                    </Tabs>
                </div>
            </div>

            <SendCreditsDialog
                isOpen={isSendModalOpen}
                onClose={() => setIsSendModalOpen(false)}
                availableCredits={availableCredits}
                onConfirm={handleConfirmTransfer}
                isTransferring={isTransferring}
            />
        </div>
    )
}
