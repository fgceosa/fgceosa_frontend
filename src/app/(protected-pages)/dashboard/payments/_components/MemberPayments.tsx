'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { getMemberSummary } from '@/store/slices/dashboard'
import Loading from '@/components/shared/Loading'
import useSystemSettings from '@/utils/hooks/useSystemSettings'
import { Card, Button, Table, Badge, Tag, Pagination, toast } from '@/components/ui'
import PaymentModal from './PaymentModal'
import InvoiceModal from './InvoiceModal'
import PaymentProofModal from './PaymentProofModal'
import { generateInvoicePDF } from '@/utils/generateInvoicePDF'
import { 
    CreditCard, 
    Calendar as CalendarIcon, 
    Clock, 
    ArrowRight, 
    CheckCircle2, 
    AlertCircle, 
    XCircle,
    Download,
    ExternalLink,
    ShieldCheck,
    Landmark,
    Eye,
    FileText,
    Copy
} from 'lucide-react'
import StatCard from '@/components/shared/StatCard'

const { TBody, THead, Td, Th, Tr } = Table

const MemberPayments = () => {
    const dispatch = useAppDispatch()
    const { memberSummary, loading } = useAppSelector((state) => state.dashboard)
    const { settings } = useSystemSettings()
    
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
    const [isProofModalOpen, setIsProofModalOpen] = useState(false)
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
    const [isCopied, setIsCopied] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 4

    const { user } = useAppSelector((state) => state.auth.session.session) || {}
    const outstandingAmount = memberSummary?.outstandingAmount || 0
    const status = memberSummary?.duesStatus === 'overdue' ? 'Unpaid' : 'Paid'
    const dueDate = memberSummary?.outstandingDueDate || 'N/A'
    const duesTitle = memberSummary?.outstandingTitle || 'Annual Dues'
    const paymentHistory = memberSummary?.paymentHistory || []

    const handleDownloadReport = () => {
        // Simple CSV generation
        const headers = ['Date', 'Description', 'Amount', 'Status', 'Reference']
        const csvContent = [
            headers.join(','),
            ...paymentHistory.map(p => {
                const amount = p.amount?.toString().replace(/,/g, '') || '0'
                return `"${p.date}","${p.description || p.title || 'Payment'}","${amount}","${p.status}","${p.ref || ''}"`
            })
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `FGCEOSA_Payment_Report_${new Date().getFullYear()}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleDownloadInvoice = async (payment: any) => {
        try {
            const invoiceData = {
                invoiceId: payment.ref || `INV-P${payment.id}`,
                date: payment.date,
                status: payment.status,
                member: (user as any)?.userName || memberSummary?.fullName || 'Member',
                email: (user as any)?.email || 'N/A',
                method: payment.method || 'Online Payment',
                paid: payment.amount?.toLocaleString() || '0',
                ref: payment.ref || `REF-${payment.id}`
            }
            
            await generateInvoicePDF(invoiceData, { 
                associationName: settings.associationName 
            })
            toast.success('Professional receipt downloaded')
        } catch (error) {
            console.error('Failed to download invoice:', error)
            toast.error('Failed to generate receipt')
        }
    }

    useEffect(() => {
        dispatch(getMemberSummary())
    }, [dispatch])

    if (loading && !memberSummary) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loading loading type="cover" />
            </div>
        )
    }

    const paginatedHistory = paymentHistory.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    const hasPendingPayments = paymentHistory.some((p: any) => p.status === 'Pending' || p.status === 'Under Review' || p.status === 'Pending Verification')

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-10 pt-4">
            <PaymentModal 
                isOpen={isPaymentModalOpen} 
                onClose={() => setIsPaymentModalOpen(false)} 
                amount={outstandingAmount}
                unpaidDues={memberSummary?.unpaidDues}
                onViewInvoice={() => {
                    setIsPaymentModalOpen(false)
                    setSelectedInvoice(paymentHistory[0]) // mock recent invoice
                    setIsInvoiceModalOpen(true)
                }}
            />
            <InvoiceModal 
                isOpen={isInvoiceModalOpen} 
                onClose={() => setIsInvoiceModalOpen(false)} 
                data={selectedInvoice} 
            />
            <PaymentProofModal 
                isOpen={isProofModalOpen}
                onClose={() => setIsProofModalOpen(false)}
            />
            {/* 1. Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-none">Payments & Dues</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                        View your dues, make payments, and track your history
                    </p>
                </div>
            </div>

            {/* Verification Alert */}
            {hasPendingPayments && (
                <div className="mx-2 p-5 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-800/30 rounded-[1.5rem] flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-700 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 dark:bg-amber-800/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="w-11 h-11 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg shadow-amber-200/20 shrink-0 border border-amber-100 dark:border-amber-700/50">
                        <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="relative z-10">
                        <h4 className="text-[14px] font-black text-amber-900 dark:text-amber-200 leading-tight">Payment Under Review</h4>
                        <p className="text-[12px] font-semibold text-amber-700/80 dark:text-amber-400/80 mt-1 max-w-2xl leading-relaxed">
                            Your recent offline payment proof is currently being reviewed by the association's administrators. Your status and history will be updated automatically as soon as verification is complete.
                        </p>
                    </div>
                </div>
            )}

            {/* 2. Dues Status Overview */}
            <Card className="rounded-[2.5rem] border border-[#8B0000]/10 dark:border-[#8B0000]/20 shadow-2xl shadow-[#8B0000]/5 relative overflow-hidden group bg-white dark:bg-gray-900">
                {/* Touches of Brand Color Background Effects */}
                <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[90px] opacity-[0.06] dark:opacity-[0.1] transition-opacity duration-1000 pointer-events-none bg-[#8B0000] -translate-y-1/3 translate-x-1/3 group-hover:opacity-[0.12]`}></div>
                <div className={`absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[70px] opacity-[0.04] dark:opacity-[0.05] transition-opacity duration-1000 pointer-events-none bg-[#8B0000] translate-y-1/2 -translate-x-1/3`}></div>
                
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#8B0000] to-red-400"></div>

                <div className="p-3 sm:p-4 pl-8 sm:pl-10 relative z-10 backdrop-blur-[2px]">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-8">
                        <div className="space-y-2 flex-1">
                            <div>
                                <h2 className="text-[10px] font-bold text-[#8B0000] dark:text-red-400 capitalize tracking-tight mb-1 flex items-center gap-2 drop-shadow-sm">
                                    {status === 'Paid' ? <CheckCircle2 className="w-4 h-4" /> : outstandingAmount === 0 ? <AlertCircle className="w-4 h-4" /> : <Landmark className="w-4 h-4" />}
                                    {status === 'Paid' ? 'Payment Complete' : outstandingAmount === 0 ? 'No Dues Found' : 'Unpaid Dues'}
                                </h2>
                                <p className="text-xl sm:text-2xl font-black tracking-tighter text-gray-900 dark:text-white font-mono drop-shadow-sm">
                                    ₦{outstandingAmount.toLocaleString()}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 pt-1">
                                <Tag className={`${status === 'Paid' || (outstandingAmount === 0 && status !== 'Overdue') ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30' : 'bg-[#8B0000]/10 text-[#8B0000] dark:bg-[#8B0000]/20 dark:text-red-400 border-[#8B0000]/20 dark:border-[#8B0000]/30'} px-4 py-1.5 rounded-xl text-[10px] font-bold capitalize tracking-tight flex items-center gap-2 border shadow-sm`}>
                                    {outstandingAmount === 0 && status !== 'Paid' ? 'Up to Date' : status}
                                </Tag>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-[#8B0000]/80 dark:text-red-300 font-mono bg-[#8B0000]/5 dark:bg-[#8B0000]/10 px-3 py-1 rounded-xl border border-[#8B0000]/10">
                                    <CalendarIcon className="w-3 h-3" /> Due Date: {dueDate}
                                </div>
                            </div>
                        </div>

                        <div className="shrink-0 w-full lg:w-auto flex flex-col items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-[1.5rem] border border-gray-100 dark:border-gray-700/50 shadow-sm backdrop-blur-xl group-hover:border-[#8B0000]/20 transition-colors">
                            {status === 'Paid' || outstandingAmount === 0 ? (
                                <Button 
                                    variant="plain" 
                                    className="w-full lg:w-auto border-2 border-emerald-100 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 font-bold rounded-2xl px-8 h-12 text-[13px] capitalize flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5 group/btn shadow-sm"
                                    onClick={() => {
                                        setSelectedInvoice(paymentHistory[0])
                                        setIsInvoiceModalOpen(true)
                                    }}
                                >
                                    <FileText className="w-4 h-4" />
                                    {outstandingAmount === 0 && status !== 'Paid' ? 'View Last Payment' : 'View Last Invoice'}
                                </Button>
                            ) : (
                                <>
                                    {settings.paymentEnabled ? (
                                        <Button 
                                            variant="solid" 
                                            className="w-full lg:w-auto bg-[#8B0000] hover:bg-[#700000] text-white hover:text-white font-bold rounded-2xl px-10 h-12 text-[14px] capitalize tracking-tight flex items-center justify-center gap-3 shadow-[0_10px_20px_-10px_rgba(139,0,0,0.5)] hover:-translate-y-0.5 transition-all group/btn border-none"
                                            onClick={() => setIsPaymentModalOpen(true)}
                                        >
                                            Pay Now
                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                    ) : (
                                        <div className="text-center p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                                            <p className="text-[11px] font-bold text-red-600 dark:text-red-400 capitalize tracking-tight leading-relaxed">
                                                Online payment is currently unavailable.<br/>Please contact the secretariat Office.
                                            </p>
                                        </div>
                                    )}
                                    <p className="text-[10px] font-bold text-[#8B0000]/70 dark:text-red-400/70 mt-3 text-center capitalize tracking-tight flex items-center justify-center gap-1.5 mb-0.5">
                                        <ShieldCheck className="w-3 h-3 text-[#8B0000]/70 dark:text-red-400/70" /> Secured connection
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            {/* 3. Payment Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard 
                    title="Total Paid"
                    value={`₦${(memberSummary?.totalPaid || 0).toLocaleString()}`}
                    icon={CheckCircle2}
                    color="emerald"
                    subtext="Lifetime Contributions"
                    isFirst
                />
                <StatCard 
                    title="Last Payment"
                    value={`₦${(memberSummary?.lastPaymentAmount || 0).toLocaleString()}`}
                    icon={CreditCard}
                    color="blue"
                    subtext={memberSummary?.lastPaymentDate || 'No record'}
                />
                <StatCard 
                    title="Payment Status"
                    value={memberSummary?.duesStatus === 'overdue' ? 'Overdue' : 'Paid'}
                    icon={Clock}
                    color={memberSummary?.duesStatus === 'overdue' ? 'amber' : 'emerald'}
                    subtext={memberSummary?.duesStatus === 'overdue' ? 'Action Required' : 'Up to Date'}
                />
                <StatCard 
                    title="Verification"
                    value={memberSummary?.verified ? 'Verified' : 'Pending'}
                    icon={ShieldCheck}
                    color={memberSummary?.verified ? 'blue' : 'amber'}
                    subtext="Account Security"
                />
            </div>
            
            {/* 4. Bank Transfer Instructions (New) */}
            <Card className="bg-[#8B0000]/[0.02] dark:bg-gray-800/20 border-dashed border-[#8B0000]/20 dark:border-gray-700 rounded-[2rem] p-6 sm:p-8 overflow-hidden relative group">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B0000] opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8B0000]/5 rounded-full border border-[#8B0000]/10">
                            <Landmark className="w-3.5 h-3.5 text-[#8B0000]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#8B0000]">Direct Bank Transfer</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Prefer manual transfer?</h3>
                            <p className="text-sm font-medium text-gray-500 max-w-md">Payments made via bank transfer will be verified manually by the secretariat within 24-48 hours.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:items-center gap-4 sm:gap-10 p-5 bg-white dark:bg-gray-900 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="space-y-1.5">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Bank Name</p>
                            <p className="text-[13px] font-black text-gray-900 dark:text-white capitalize">{settings.bank_name || 'N/A'}</p>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Account Number</p>
                            <div className="flex items-center gap-3 group/copy cursor-pointer" onClick={() => {
                                navigator.clipboard.writeText(settings.account_number || '')
                                toast.success('Account number copied!')
                            }}>
                                <p className="text-[15px] font-black text-[#8B0000] dark:text-red-400 tracking-tighter">{settings.account_number || '----------'}</p>
                                <Copy className="w-3.5 h-3.5 text-gray-300 group-hover/copy:text-[#8B0000] transition-colors" />
                            </div>
                        </div>
                        <div className="space-y-1.5 pr-4">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Account Name</p>
                            <p className="text-[13px] font-black text-gray-900 dark:text-white capitalize">{settings.account_name || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* 5. Payment History (Core Section) */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2 sm:px-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-br from-[#8B0000]/10 to-transparent dark:from-[#8B0000]/20 flex items-center justify-center border border-[#8B0000]/10 shadow-sm shrink-0">
                            <Clock className="w-5 h-5 text-[#8B0000] dark:text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">Payment History</h2>
                            <p className="text-[11px] font-bold text-gray-400 capitalize tracking-tight mt-0.5">View your past receipts and bills</p>
                        </div>
                    </div>
                    <Button 
                        variant="plain" 
                        className="border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[#8B0000] hover:border-[#8B0000]/30 hover:bg-[#8B0000]/5 font-bold text-[13px] capitalize flex items-center gap-2 h-10 px-5 rounded-xl transition-all shadow-sm hidden sm:flex"
                        onClick={handleDownloadReport}
                    >
                        <Download className="w-3.5 h-3.5" /> Download report
                    </Button>
                </div>

                <div className="bg-white dark:bg-gray-800/50 rounded-[2rem] border border-gray-100 dark:border-gray-700/50 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden relative group/table">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8B0000]/20 to-transparent opacity-0 group-hover/table:opacity-100 transition-opacity duration-1000"></div>
                    <div className="overflow-x-auto">
                        <Table>
                            <THead className="bg-gray-50/50 dark:bg-gray-800/50">
                                <Tr>
                                    <Th className="text-[11px] font-bold tracking-tight capitalize py-4 px-8 text-gray-900 border-b border-gray-100 dark:border-gray-700/50">Date</Th>
                                    <Th className="text-[11px] font-bold tracking-tight capitalize py-4 px-8 text-gray-900 border-b border-gray-100 dark:border-gray-700/50">Details</Th>
                                    <Th className="text-[11px] font-bold tracking-tight capitalize py-4 px-8 text-gray-900 border-b border-gray-100 dark:border-gray-700/50">Amount</Th>
                                    <Th className="text-[11px] font-bold tracking-tight capitalize py-4 px-8 text-gray-900 border-b border-gray-100 dark:border-gray-700/50">Status</Th>
                                    <Th className="text-[11px] font-bold tracking-tight capitalize py-4 px-8 text-right pr-10 text-gray-900 border-b border-gray-100 dark:border-gray-700/50">Actions</Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {paginatedHistory.length > 0 ? paginatedHistory.map((payment: any, i: number) => (
                                    <Tr key={payment.id || i} className="group hover:bg-[#8B0000]/[0.02] dark:hover:bg-gray-700/40 transition-all border-b border-gray-50 dark:border-gray-800/50 hover:shadow-sm relative">
                                        <Td className="py-4 px-8 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-[12px] bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center shrink-0 shadow-inner group-hover:bg-[#8B0000]/5 group-hover:border-[#8B0000]/20 transition-colors">
                                                    <span className="text-[12px] font-bold text-gray-900 dark:text-white leading-none">{payment.date.split(' ')[0]}</span>
                                                    <span className="text-[9px] font-bold text-gray-500 capitalize tracking-tight mt-0.5">{payment.date.split(' ')[1]?.replace(',', '')}</span>
                                                </div>
                                                <div>
                                                    <p className="text-[12px] font-black text-gray-900 dark:text-gray-100">{payment.date.split(',')[1]?.trim() || '2024'}</p>
                                                    <p className="text-[9px] font-bold text-gray-400 capitalize tracking-tight mt-0.5">Payment Date</p>
                                                </div>
                                            </div>
                                        </Td>
                                        <td className="py-4 px-8">
                                            <div>
                                                <p className="text-[13px] font-bold text-gray-900 dark:text-white group-hover:text-[#8B0000] dark:group-hover:text-red-400 transition-colors capitalize">{payment.title || payment.description || 'Annual Subscription 2024'}</p>
                                                <p className="text-[10px] font-bold text-gray-400 capitalize tracking-tight mt-1 flex items-center gap-1.5 border border-gray-100 dark:border-gray-700 w-max px-2 py-0.5 rounded-lg shadow-sm bg-white dark:bg-gray-800">
                                                    ID: {payment.ref || `FGC-${new Date().getFullYear()}-00${payment.id || i}`}
                                                    {payment.status === 'Paid' && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                                                </p>
                                            </div>
                                        </td>
                                        <Td className="py-4 px-8 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-[15px] font-bold text-gray-900 dark:text-white font-mono tracking-tight">₦{payment.amount?.toLocaleString()}</span>
                                                <span className="text-[9px] font-bold text-gray-400 capitalize tracking-tight mt-0.5">By {payment.method || 'Card'}</span>
                                            </div>
                                        </Td>
                                        <Td className="py-4 px-8 whitespace-nowrap">
                                            <Tag className={`border shadow-sm px-3.5 py-1.5 rounded-xl text-[10px] font-bold capitalize tracking-tight flex items-center gap-1.5 w-max ${
                                                payment.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800/30 dark:text-emerald-400' : 
                                                payment.status === 'Failed' ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/30 dark:border-red-800/30 dark:text-red-400' :
                                                'bg-[#8B0000]/10 border-[#8B0000]/20 text-[#8B0000] dark:bg-[#8B0000]/20 dark:border-[#8B0000]/30 dark:text-red-400'
                                            }`}>
                                                {payment.status}
                                            </Tag>
                                        </Td>
                                        <Td className="py-4 px-8 whitespace-nowrap">
                                            {payment.status === 'Paid' ? (
                                                <div className="flex items-center justify-end gap-3 transition-all duration-300">
                                                    <button 
                                                        onClick={() => { setSelectedInvoice(payment); setIsInvoiceModalOpen(true); }}
                                                        className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-[#8B0000] dark:text-red-400 text-[9px] font-black capitalize tracking-wider rounded-xl border border-red-100/50 dark:border-red-800/20 hover:bg-[#8B0000] hover:text-white transition-all shadow-sm"
                                                    >
                                                        View Details
                                                    </button>
                                                    <button 
                                                        className="h-9 px-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#8B0000]/30 hover:bg-[#8B0000]/5 text-gray-500 hover:text-[#8B0000] text-[10px] font-black transition-all shadow-sm active:scale-95 flex items-center gap-2" 
                                                        onClick={() => handleDownloadInvoice(payment)}
                                                    >
                                                        <Download className="w-3.5 h-3.5" />
                                                        Download
                                                    </button>
                                                </div>
                                            ) : <span className="text-gray-300 dark:text-gray-600 text-[12px] font-black tracking-widest inline-flex items-center justify-end pr-4">-</span>}
                                        </Td>
                                    </Tr>
                                )) : (
                                    <Tr>
                                        <Td colSpan={5} className="py-24 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-30">
                                                <div className="w-20 h-20 rounded-3xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center shadow-inner">
                                                    <CreditCard className="w-10 h-10 text-gray-400" />
                                                </div>
                                                <p className="text-[11px] font-bold text-gray-600 dark:text-gray-400 capitalize tracking-tight">No records found</p>
                                            </div>
                                        </Td>
                                    </Tr>
                                )}
                            </TBody>
                        </Table>
                    </div>
                    {paymentHistory.length > pageSize && (
                        <div className="flex items-center justify-end px-6 py-5 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/30 dark:bg-gray-900/10">
                            <Pagination
                                currentPage={currentPage}
                                total={paymentHistory.length}
                                pageSize={pageSize}
                                onChange={(page) => setCurrentPage(page)}
                            />
                        </div>
                    )}
                </div>
            </div>
            
            {/* 6. Quick Actions Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <Card className="p-5 sm:p-6 bg-gradient-to-br from-[#800000] via-[#8B0000] to-[#500000] rounded-[2.5rem] text-white relative overflow-hidden group shadow-[0_20px_40px_-15px_rgba(139,0,0,0.6)] border-none flex flex-col">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-[0.05] rounded-full blur-3xl group-hover:opacity-[0.1] transition-opacity duration-1000"></div>
                     <div className="relative z-10 flex flex-col h-full">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4 shadow-sm w-max">
                            <ShieldCheck className="w-3.5 h-3.5 text-white" />
                            <span className="text-[9px] font-bold capitalize tracking-tight text-white/90">Bank transfer</span>
                        </div>
                        <h3 className="text-lg font-black leading-tight mb-4 max-w-sm drop-shadow-sm text-white">Paid directly into the association's bank account?</h3>
                        <p className="text-white/80 text-[12px] font-medium mb-6 max-w-md">Upload your transaction receipt for quick verification. The financial secretary will manually reconcile and update your portal status.</p>
                        <Button 
                            className="mt-10 bg-white hover:bg-red-50 text-[#8B0000] border-none font-bold rounded-2xl h-12 px-8 flex items-center justify-center gap-3 text-[14px] transition-all capitalize shadow-lg shadow-black/10 hover:-translate-y-0.5"
                            onClick={() => setIsProofModalOpen(true)}
                        >
                            Upload payment proof
                            <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                     </div>
                </Card>

                <Card className="p-5 sm:p-6 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700/50 shadow-xl shadow-gray-200/10 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute -right-16 -top-16 opacity-[0.02] dark:opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                        <ShieldCheck className="w-64 h-64" />
                    </div>
                    
                    <div className="flex items-center justify-between mb-4 relative z-10 w-full">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Secure & Transparent</h3>
                            <p className="text-[10px] font-bold text-gray-400 capitalize tracking-tight mt-0.5">Your contributions make a difference</p>
                        </div>
                        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shadow-inner shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="space-y-4 relative z-10 w-full">
                        <p className="text-[12px] font-medium text-gray-500 leading-relaxed">
                            All payments are encrypted and processed through our secure gateway. Your dues directly fund student scholarships, infrastructure development, and member welfare programs.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col gap-1 transition-colors hover:border-emerald-200">
                                <span className="text-[11px] font-black text-[#8B0000] dark:text-red-400">100% Secure</span>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">SSL Encrypted</span>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col gap-1 transition-colors hover:border-emerald-200">
                                <span className="text-[11px] font-black text-[#8B0000] dark:text-red-400">Verified</span>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Manual Audit</span>
                            </div>
                        </div>
                        
                        <Button 
                            variant="plain"
                            className="w-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 hover:text-[#8B0000] font-bold text-[12px] rounded-xl h-11 flex items-center justify-center gap-2 transition-all"
                        >
                            <FileText className="w-4 h-4" />
                            View financial report
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default MemberPayments
