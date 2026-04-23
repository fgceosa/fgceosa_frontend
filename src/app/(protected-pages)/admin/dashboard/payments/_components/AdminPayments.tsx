'use client'

import React, { useState, useEffect } from 'react'
import PaymentsHeader from './PaymentsHeader'
import AdminPaymentsSummary from './PaymentsSummary'
import CollectionProgress from './CollectionProgress'
import PaymentsTable from './PaymentsTable'
import DuesManagement from './DuesManagement'
import { Card, Button, toast, Dialog } from '@/components/ui'
import { Bell, ShieldCheck, Mail, History, Users, BarChart3, Wallet } from 'lucide-react'
import OfflinePaymentModal from './OfflinePaymentModal'
import InvoiceModal from './InvoiceModal'
import { apiGetPaymentAnalytics, apiGetOutstandingDues, apiSendPaymentReminder, apiDownloadAnnualReport, type PaymentAnalytics } from '@/services/admin/paymentsService'

// Mock data for fallback when API fails
const fallbackAnalytics: PaymentAnalytics = {
    totalCollected: '₦12,450,000',
    pendingPayments: '₦2,100,000',
    totalInvoices: 482,
    overdueMembers: 124,
    targetAmount: 25000000,
    collectedAmount: 12450000,
    percentageAchieved: 49.8
}

export default function AdminPayments() {
    const [activeTab, setActiveTab] = useState<'overview' | 'dues'>('overview')
    const [isOfflinePaymentOpen, setIsOfflinePaymentOpen] = useState(false)
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)
    const [isConfirmRemindOpen, setIsConfirmRemindOpen] = useState(false)
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
    const [selectedMember, setSelectedMember] = useState<any>(null)
    const [analytics, setAnalytics] = useState<PaymentAnalytics | null>(null)
    const [quickOutstanding, setQuickOutstanding] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isReminding, setIsReminding] = useState(false)
    const [isGeneratingReport, setIsGeneratingReport] = useState(false)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    useEffect(() => {
        fetchInitialData()
    }, [])

    const fetchInitialData = async () => {
        setIsLoading(true)
        try {
            const [analyticsData, outstandingData] = await Promise.all([
                apiGetPaymentAnalytics(),
                apiGetOutstandingDues()
            ])
            setAnalytics(analyticsData)
            setQuickOutstanding(outstandingData.slice(0, 3)) // Show only top 3
        } catch (error) {
            console.error('Failed to fetch initial data:', error)
            setAnalytics(fallbackAnalytics)
            toast.error('Using offline fallback data')
        } finally {
            setIsLoading(false)
        }
    }

    const handleRemindAll = async () => {
        setIsConfirmRemindOpen(false)
        try {
            setIsReminding(true)
            await apiSendPaymentReminder({ user_ids: [] })
            toast.success('Reminders sent to all members with pending payments!')
        } catch (error) {
            console.error('Failed to send reminders:', error)
            toast.error('Failed to send bulk payment reminders')
        } finally {
            setIsReminding(false)
        }
    }

    const handleDownloadReport = async () => {
        try {
            setIsGeneratingReport(true)
            const data = await apiDownloadAnnualReport()
            const url = window.URL.createObjectURL(new Blob([data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `Annual_Report_${new Date().getFullYear()}.csv`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            toast.success('Report generated successfully')
        } catch (error) {
            console.error('Failed to download report:', error)
            toast.error('Failed to generate annual report')
        } finally {
            setIsGeneratingReport(false)
        }
    }

    return (
        <div className="w-full py-8 px-4 sm:px-6 lg:px-10 space-y-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <PaymentsHeader onRecordPayment={() => setIsOfflinePaymentOpen(true)} />

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 p-1.5 bg-gray-100/50 dark:bg-gray-800/50 rounded-[1.5rem] w-fit border border-gray-100 dark:border-gray-800">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[13px] font-black transition-all duration-300 ${
                        activeTab === 'overview'
                            ? 'bg-[#8B0000] text-white shadow-lg shadow-[#8B0000]/20'
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                    <BarChart3 className="w-4 h-4" />
                    Overview & History
                </button>
                <button
                    onClick={() => setActiveTab('dues')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[13px] font-black transition-all duration-300 ${
                        activeTab === 'dues'
                            ? 'bg-[#8B0000] text-white shadow-lg shadow-[#8B0000]/20'
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                    <Wallet className="w-4 h-4" />
                    Dues Management
                </button>
            </div>

            {activeTab === 'overview' ? (
                <>
                    {/* Summary Metrics */}
                    <AdminPaymentsSummary analytics={analytics} isLoading={isLoading} />

                    {/* Goal Progress */}
                    <CollectionProgress analytics={analytics} isLoading={isLoading} />

                    {/* Secondary Actions Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Bulk Actions Card */}
                        <Card className="p-5 bg-gradient-to-br from-[#800000] via-[#8B0000] to-[#500000] rounded-[2rem] border-none shadow-[0_20px_40px_-15px_rgba(139,0,0,0.5)] group relative overflow-hidden">
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity duration-700"></div>
                            <div className="relative z-10 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/5">
                                        <ShieldCheck className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <h3 className="text-[14px] font-bold text-white/90 capitalize tracking-tight">Bulk operations</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    <Button 
                                        onClick={() => setIsConfirmRemindOpen(true)}
                                        disabled={isReminding}
                                        className="bg-white/10 hover:bg-white/20 text-white hover:text-white border-white/10 font-bold h-11 rounded-xl flex items-center justify-center px-4 text-[13px] transition-all backdrop-blur-md gap-2 capitalize">
                                        <Mail className="w-4 h-4 text-red-100" />
                                        {isReminding ? 'Sending...' : 'Remind Unpaid'}
                                    </Button>
                                    <Button 
                                        onClick={handleDownloadReport}
                                        disabled={isGeneratingReport}
                                        className="bg-white/10 hover:bg-white/20 text-white hover:text-white border-white/10 font-bold h-11 rounded-xl flex items-center justify-center px-4 text-[13px] transition-all backdrop-blur-md gap-2 capitalize">
                                        <History className="w-4 h-4 text-red-100" />
                                        {isGeneratingReport ? 'Processing...' : 'Annual Report'}
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* Quick Access Card */}
                        <Card className="p-5 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none">
                                <h4 className="text-[13px] font-bold text-gray-900 dark:text-white capitalize tracking-tight mb-3">Priority Follow-up</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                {isLoading ? (
                                     [1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-50 dark:bg-gray-700/30 rounded-xl animate-pulse" />)
                                ) : quickOutstanding.length > 0 ? (
                                    quickOutstanding.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-gray-50/50 dark:bg-gray-700/30 border border-transparent hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm transition-all group/row">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-black text-gray-500 group-hover/row:bg-primary/5 group-hover/row:text-primary transition-colors">
                                                    {item.member[0]}
                                                </div>
                                                <span className="text-[12px] font-bold text-gray-900 dark:text-white truncate max-w-[100px] leading-tight">{item.member}</span>
                                            </div>
                                            <span className={`text-[10px] font-bold capitalize px-2.5 py-1 rounded-full text-rose-700 bg-rose-50`}>
                                                {item.overdue}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-3 text-center py-4 text-emerald-600 font-bold text-xs bg-emerald-50 rounded-2xl">
                                        ✨ All members are up to date!
                                    </div>
                                )}
                                </div>
                                <Button variant="plain" block className="text-[11px] font-bold text-primary capitalize tracking-tight mt-2 py-0 h-auto">
                                    View full directory
                                </Button>
                        </Card>
                    </div>

                    <div className="space-y-8">
                        <PaymentsTable 
                            onViewInvoice={(inv) => { setSelectedInvoice(inv); setIsInvoiceOpen(true) }} 
                            onRecordPayment={(member) => { setSelectedMember(member); setIsOfflinePaymentOpen(true) }}
                            refreshTrigger={refreshTrigger}
                        />
                    </div>
                </>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <DuesManagement />
                </div>
            )}

            {/* Confirmation Modal */}
            <Dialog 
                isOpen={isConfirmRemindOpen} 
                onClose={() => setIsConfirmRemindOpen(false)}
                width={400}
                className="p-6 bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border-none"
            >
                <div className="text-center space-y-6 pt-4">
                    <div className="w-20 h-20 bg-red-50 dark:bg-red-900/10 rounded-3xl flex items-center justify-center mx-auto border border-red-100 dark:border-red-900/30">
                        <Mail className="w-10 h-10 text-[#8B0000]" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Send Bulk Reminders?</h3>
                        <p className="text-[13px] leading-relaxed font-bold text-gray-500 mt-4 px-4">This will send an email reminder to all members who have outstanding payments. Do you want to proceed?</p>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <Button 
                            variant="plain" 
                            onClick={() => setIsConfirmRemindOpen(false)}
                            className="flex-1 h-14 font-bold rounded-2xl text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleRemindAll}
                            className="flex-1 h-14 bg-[#8B0000] hover:bg-red-800 text-white hover:text-white font-bold rounded-2xl shadow-xl shadow-red-900/20"
                        >
                            Proceed
                        </Button>
                    </div>
                </div>
            </Dialog>

            <OfflinePaymentModal 
                isOpen={isOfflinePaymentOpen} 
                onClose={() => { setIsOfflinePaymentOpen(false); setSelectedMember(null) }} 
                onSuccess={() => {
                    setRefreshTrigger(prev => prev + 1)
                    fetchInitialData()
                }}
                initialData={selectedMember}
            />
            <InvoiceModal isOpen={isInvoiceOpen} onClose={() => setIsInvoiceOpen(false)} data={selectedInvoice} />
        </div>
    )
}
