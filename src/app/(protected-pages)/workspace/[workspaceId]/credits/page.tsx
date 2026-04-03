'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store'
import { useRequireAuthority } from '@/utils/hooks/useAuthorization'
import {
    fetchWorkspace,
    fetchCreditTransactions,
    allocateCredits,
    fetchWorkspaceMembers,
} from '@/store/slices/workspace/workspaceThunk'
import {
    selectCurrentWorkspace,
    selectCreditTransactions,
    selectWorkspaceMembers,
    selectCurrentWorkspaceLoading,
    selectCreditTransactionsLoading,
    selectOperationsLoading,
    selectWorkspaceError,
} from '@/store/slices/workspace/workspaceSelectors'
import {
    Button,
    Card,
    Input,
    Notification,
    toast,
    Table,
    Badge,
    Dialog,
} from '@/components/ui'
import QorebitLoading from '@/components/shared/QorebitLoading'
import {
    Zap,
    Activity,
    TrendingUp,
    RefreshCw,
    Coins,
    Plus,
    Send,
    Database,
    Shield,
    Clock,
    User,
    ArrowLeft
} from 'lucide-react'
import TopUpModal from '@/components/template/Topup/TopUpModal'
import WorkspacePageLayout from '../../_components/WorkspacePageLayout'
import WorkspaceHeader from '../../_components/WorkspaceHeader'
import classNames from '@/utils/classNames'

const { Tr, Th, Td, THead, TBody } = Table

export default function CreditManagementPage() {
    const params = useParams()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const workspaceId = params.workspaceId as string

    // Require org_super_admin authority
    const hasAuthority = useRequireAuthority(['org_super_admin'])

    const currentWorkspace = useAppSelector(selectCurrentWorkspace)
    const creditTransactions = useAppSelector(selectCreditTransactions) || []
    const members = useAppSelector(selectWorkspaceMembers) || []
    const workspaceLoading = useAppSelector(selectCurrentWorkspaceLoading)
    const transactionsLoading = useAppSelector(selectCreditTransactionsLoading)
    const operationsLoading = useAppSelector(selectOperationsLoading)
    const error = useAppSelector(selectWorkspaceError)

    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false)
    const [isShareCreditDialogOpen, setIsShareCreditDialogOpen] = useState(false)
    const [selectedMemberId, setSelectedMemberId] = useState('')
    const [shareCreditAmount, setShareCreditAmount] = useState('')
    const [shareCreditMessage, setShareCreditMessage] = useState('')
    // Fetch workspace details and transactions on mount
    useEffect(() => {
        if (workspaceId) {
            dispatch(fetchWorkspace(workspaceId))
            dispatch(fetchCreditTransactions({ workspaceId }))
            dispatch(fetchWorkspaceMembers({ workspaceId }))
        }
    }, [workspaceId, dispatch])

    // Show error notification
    useEffect(() => {
        if (error) {
            toast.push(
                <Notification type="danger" duration={3000}>
                    {error}
                </Notification>,
            )
        }
    }, [error])

    const handleShareCredits = async () => {
        const amount = parseFloat(shareCreditAmount)

        if (!selectedMemberId) {
            toast.push(
                <Notification type="warning" duration={2000}>
                    Please select a member
                </Notification>,
            )
            return
        }

        if (isNaN(amount) || amount <= 0) {
            toast.push(
                <Notification type="warning" duration={2000}>
                    Please enter a valid amount
                </Notification>,
            )
            return
        }

        try {
            await dispatch(
                allocateCredits({
                    workspaceId,
                    memberId: selectedMemberId,
                    amount,
                    message: shareCreditMessage || undefined,
                }),
            ).unwrap()

            toast.push(
                <Notification type="success" duration={2000}>
                    Credits shared successfully
                </Notification>,
            )

            // Auto-refresh data after allocation
            dispatch(fetchWorkspace(workspaceId))
            dispatch(fetchCreditTransactions({ workspaceId }))

            setIsShareCreditDialogOpen(false)
            setSelectedMemberId('')
            setShareCreditAmount('')
            setShareCreditMessage('')
        } catch (err: any) {
            toast.push(
                <Notification type="danger" duration={3000}>
                    {err || 'Failed to share credits'}
                </Notification>,
            )
        }
    }

    const getTransactionTypeBadge = (type: string) => {
        const config = {
            purchase: { label: 'Settlement', className: 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800/30' },
            allocation: { label: 'Distribution', className: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30' },
            usage: { label: 'Consumption', className: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/30' },
            refund: { label: 'Reversal', className: 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/30' },
        }
        const typeConfig = config[type as keyof typeof config] || config.usage
        return (
            <div className={classNames(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
                typeConfig.className
            )}>
                {typeConfig.label}
            </div>
        )
    }

    const getStatusBadge = (status: string) => {
        const statusLower = status.toLowerCase()
        const isCompleted = statusLower === 'completed' || statusLower === 'success'
        const isPending = statusLower === 'pending'
        const isFailed = statusLower === 'failed'

        return (
            <div className={classNames(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300",
                isCompleted
                    ? "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-light dark:border-primary/30 shadow-sm shadow-primary/20"
                    : isPending
                        ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/30 shadow-sm shadow-amber-200/20"
                        : "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30 shadow-sm shadow-red-200/20"
            )}>
                <div className={classNames(
                    "w-1.5 h-1.5 rounded-full animate-pulse",
                    isCompleted ? "bg-primary" : isPending ? "bg-amber-500" : "bg-red-600"
                )} />
                <span>{status}</span>
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return '-'
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return '-'
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    if (workspaceLoading && !currentWorkspace) {
        return <QorebitLoading />
    }

    return (
        <div className="min-h-full bg-[#f5f5f5] dark:bg-gray-950/50">
            <WorkspacePageLayout
                fullWidth={true}
                header={
                    <WorkspaceHeader
                        title="Wallet"
                        description="Manage your workspace funds and track transaction history."
                        icon={Coins}
                        iconBgClass="bg-gradient-to-br from-primary to-indigo-700"
                        tag="Funds"
                        actions={
                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                                <Button
                                    variant="solid"
                                    onClick={() => setIsTopUpModalOpen(true)}
                                    className="h-14 px-8 bg-primary hover:bg-primary-deep text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 group w-full sm:w-auto justify-center"
                                >
                                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                    Top Up
                                </Button>
                                <Button
                                    variant="solid"
                                    onClick={() => setIsShareCreditDialogOpen(true)}
                                    className="h-14 px-8 bg-white dark:bg-gray-900 text-primary border border-primary/20 hover:bg-primary/5 font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none transition-all hover:scale-105 active:scale-95 flex items-center gap-3 group w-full sm:w-auto justify-center"
                                >
                                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    Transfer
                                </Button>
                            </div>
                        }
                    />
                }
            >
                {/* Credit Balance - Premium Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    <Card className="md:col-span-1 p-0 border-none shadow-2xl shadow-primary/20 dark:shadow-none bg-[#0055BA] rounded-[2rem] overflow-hidden relative group transition-all hover:scale-[1.02]">
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Coins className="w-24 h-24 text-white" />
                        </div>

                        <div className="relative p-8 sm:p-10 h-full flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-light animate-pulse"></div>
                                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Global Reservoir</span>
                                </div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight opacity-80 leading-tight">Total Available<br />Balance</h3>
                            </div>

                            <div className="mt-12">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-5xl sm:text-6xl font-black text-white tracking-tighter">
                                        {currentWorkspace
                                            ? Number(currentWorkspace.creditsBalance ?? (currentWorkspace as any).credits_balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                            : '0.00'
                                        }
                                    </span>
                                    <span className="text-xl font-black text-indigo-100 uppercase tracking-widest opacity-60">CREDITS</span>
                                </div>
                                <p className="text-indigo-100/60 font-bold mt-6 text-xs uppercase tracking-widest italic">Synchronized in real-time</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="md:col-span-2 p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 transition-all">
                        <div className="p-5 sm:p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <RefreshCw className="w-4 h-4 text-primary" />
                                </div>
                                <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Recent Activity</h3>
                            </div>
                            <span className="px-2.5 py-1 bg-white dark:bg-gray-800 rounded-lg text-[10px] font-black text-primary border border-gray-100 dark:border-gray-700 shadow-sm uppercase tracking-widest">
                                Audit Stream
                            </span>
                        </div>

                        <div className="p-0 overflow-x-auto no-scrollbar">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/50 dark:bg-gray-800/30">
                                        <th className="px-6 py-4 text-left border-b border-gray-100 dark:border-gray-800">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                                <RefreshCw className="w-3.5 h-3.5" />
                                                <span>Timestamp</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left border-b border-gray-100 dark:border-gray-800">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                                <ArrowLeft className="w-3.5 h-3.5" />
                                                <span>Operation</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-right border-b border-gray-100 dark:border-gray-800">
                                            <div className="flex items-center justify-end gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                                <Coins className="w-3.5 h-3.5" />
                                                <span>Delta</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-center border-b border-gray-100 dark:border-gray-800">
                                            <div className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                                <Badge className="w-3.5 h-3.5 opacity-0" />
                                                <span>Status</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {transactionsLoading ? (
                                        <tr><td colSpan={4} className="py-12"><div className="flex items-center justify-center gap-2"><div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div><span className="text-sm font-bold text-gray-400">Loading...</span></div></td></tr>
                                    ) : creditTransactions.length === 0 ? (
                                        <tr><td colSpan={4} className="py-12 text-center text-sm font-bold text-gray-400 uppercase tracking-widest italic">No Ledger Entries Initialized</td></tr>
                                    ) : (
                                        creditTransactions.slice(0, 5).map((transaction) => {
                                            const amount = Number(transaction.amount ?? (transaction as any).amount ?? 0)
                                            return (
                                                <tr key={transaction.id} className="group hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-all duration-200">
                                                    <td className="px-6 py-5">
                                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{formatDate(transaction.createdAt || (transaction as any).created_at)}</span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-primary transition-colors">{transaction.type}</span>
                                                            <span className="text-[10px] text-gray-400 font-bold truncate max-w-[200px] uppercase tracking-wider">{transaction.description}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <div className="inline-flex flex-col items-end gap-0.5">
                                                            <span className={classNames(
                                                                "text-sm font-black",
                                                                transaction.type === 'usage' ? 'text-rose-600' : 'text-primary'
                                                            )}>
                                                                {transaction.type === 'usage' ? '-' : '+'}{amount.toFixed(2)}
                                                            </span>
                                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Credits</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-center">
                                                        {getStatusBadge(transaction.status)}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Full Transaction History */}
                <div className="mt-12 mb-8 space-y-6 relative z-10 transition-all duration-1000 animate-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-4 px-2">
                        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] px-4 py-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm">Transaction History</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-gray-100 dark:from-gray-800 to-transparent"></div>
                    </div>

                    <Card className="p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 relative z-10 transition-all">
                        <div className="p-5 sm:p-8 border-b border-gray-50 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/30 dark:bg-gray-800/20">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <Coins className="w-4 h-4 text-primary" />
                                </div>
                                <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Recent Activity</h3>
                                <span className="px-2.5 py-1 bg-white dark:bg-gray-800 rounded-lg text-[10px] font-black text-primary border border-gray-100 dark:border-gray-700 shadow-sm uppercase tracking-widest">
                                    {creditTransactions.length} RECORDS
                                </span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/50 dark:bg-gray-800/30">
                                        <th className="px-6 py-5 text-left rounded-l-2xl">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                                <Shield className="w-3.5 h-3.5" />
                                                <span>ID</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-5 text-left">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>Time</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-5 text-left">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                                <User className="w-3.5 h-3.5" />
                                                <span>Recipient</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-5 text-left">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                                <Activity className="w-3.5 h-3.5" />
                                                <span>Description</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                                <TrendingUp className="w-3.5 h-3.5" />
                                                <span>Amount</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-5 text-right rounded-r-2xl">
                                            <div className="flex items-center justify-end gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                                <Database className="w-3.5 h-3.5" />
                                                <span>New Balance</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="">
                                    {creditTransactions.map((transaction, idx) => {
                                        const amount = Number(transaction.amount ?? (transaction as any).amount ?? 0)
                                        const balance = Number(transaction.balance ?? (transaction as any).balance ?? 0)
                                        return (
                                            <tr key={transaction.id || idx} className="group hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-all duration-200 border-b border-gray-50 dark:border-gray-800 last:border-none">
                                                <td className="px-6 py-6">
                                                    <code className="px-2.5 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 dark:border-gray-700">
                                                        TX-{transaction.id.slice(0, 8).toUpperCase()}
                                                    </code>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700">
                                                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                        </div>
                                                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">{formatDate(transaction.createdAt || (transaction as any).created_at)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-black text-xs">
                                                            {(transaction.recipientName || (transaction as any).recipient_name || 'N')[0].toUpperCase()}
                                                        </div>
                                                        <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-primary transition-colors">
                                                            {transaction.recipientName || (transaction as any).recipient_name || 'Network Core'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.1em]">{transaction.description}</span>
                                                </td>
                                                <td className="px-6 py-6 text-right">
                                                    <div className="inline-flex flex-col items-end">
                                                        <span className={classNames(
                                                            "text-sm font-black tracking-tight",
                                                            transaction.type === 'usage' ? 'text-rose-600' : 'text-primary'
                                                        )}>
                                                            {transaction.type === 'usage' ? '-' : '+'}{amount.toFixed(4)}
                                                        </span>
                                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic leading-none">Change</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 text-right">
                                                    <div className="inline-flex flex-col items-end">
                                                        <span className="text-sm font-black text-gray-900 dark:text-white tracking-tight">
                                                            {balance.toFixed(2)}
                                                        </span>
                                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic leading-none">Pool</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                <TopUpModal
                    isOpen={isTopUpModalOpen}
                    onClose={() => setIsTopUpModalOpen(false)}
                    workspaceId={workspaceId}
                />

                <Dialog isOpen={isShareCreditDialogOpen} onClose={() => setIsShareCreditDialogOpen(false)} width={550}>
                    <div className="p-2">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                                <Send className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Share Credits</h2>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Send credits to team member</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Target Member</label>
                                <select
                                    value={selectedMemberId}
                                    onChange={(e) => setSelectedMemberId(e.target.value)}
                                    className="w-full h-12 px-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary/10 uppercase tracking-widest appearance-none cursor-pointer"
                                >
                                    <option value="">Select Member</option>
                                    {members
                                        .filter((m) => m.status === 'active')
                                        .map((member) => (
                                            <option key={member.id} value={member.id}>
                                                {member.name.toUpperCase()} ({member.email})
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Amount</label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={shareCreditAmount}
                                        onChange={(e) => setShareCreditAmount(e.target.value)}
                                        min="0"
                                        step="0.01"
                                        className="h-14 pl-12 rounded-xl border-gray-200 font-black text-xl tracking-tighter"
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                                        <Coins className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Message (Optional)</label>
                                <Input
                                    textArea
                                    rows={2}
                                    placeholder="Purpose of allocation..."
                                    value={shareCreditMessage}
                                    onChange={(e) => setShareCreditMessage(e.target.value)}
                                    className="rounded-xl border-gray-200 font-medium text-sm p-4 resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-6">
                                <button onClick={() => setIsShareCreditDialogOpen(false)} className="h-12 px-6 font-black uppercase text-[10px] tracking-widest text-gray-400 hover:text-gray-950 transition-colors">Cancel</button>
                                <Button
                                    variant="solid"
                                    onClick={handleShareCredits}
                                    loading={operationsLoading}
                                    className="h-12 px-8 bg-primary hover:bg-primary-deep text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-xl shadow-primary/20"
                                >
                                    Share Credit
                                </Button>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </WorkspacePageLayout>
        </div>
    )
}
