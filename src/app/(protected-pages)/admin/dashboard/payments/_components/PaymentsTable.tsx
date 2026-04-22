import React, { useState, useEffect } from 'react'
import { Card, Input, Select, Button, DatePicker } from '@/components/ui'
import { VscSearch } from 'react-icons/vsc'
import { Filter, Download, Eye, History, Bell, AlertCircle, CreditCard, Send, Calendar, Building, Banknote, FileText } from 'lucide-react'
import dayjs from 'dayjs'
import classNames from '@/utils/classNames'
import { toast } from '@/components/ui'
import useSystemSettings from '@/utils/hooks/useSystemSettings'
import { generateInvoicePDF } from '@/utils/generateInvoicePDF'

const statusColors = {
    Paid: 'bg-emerald-50 text-emerald-600 ring-emerald-500/10',
    Pending: 'bg-amber-50 text-amber-600 ring-amber-500/10',
    Overdue: 'bg-rose-50 text-rose-600 ring-rose-500/10',
}

import { apiGetPaymentTransactions, apiGetOutstandingDues, apiSendPaymentReminder, type PaymentTransaction, type OutstandingDue } from '@/services/admin/paymentsService'
import Spinner from '@/components/ui/Spinner'

export default function PaymentsTable({ onViewInvoice, onRecordPayment, refreshTrigger }: { 
    onViewInvoice?: (invoice: any) => void
    onRecordPayment?: (member: any) => void 
    refreshTrigger?: number
}) {
    const { settings } = useSystemSettings()
    const [activeTab, setActiveTab] = useState<'history' | 'outstanding'>('history')
    const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
    const [outstanding, setOutstanding] = useState<OutstandingDue[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])

    useEffect(() => {
        fetchData()
    }, [activeTab, searchTerm, dateRange, refreshTrigger])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const params = {
                search: searchTerm,
                startDate: dateRange[0] ? dayjs(dateRange[0]).format('YYYY-MM-DD') : undefined,
                endDate: dateRange[1] ? dayjs(dateRange[1]).format('YYYY-MM-DD') : undefined,
            }

            if (activeTab === 'history') {
                const data = await apiGetPaymentTransactions(params)
                setTransactions(data)
            } else {
                const data = await apiGetOutstandingDues(params)
                setOutstanding(data)
            }
        } catch (error) {
            console.error(`Failed to load ${activeTab} data:`, error)
            // Silently fail or use dummy data if needed, for now we just keep the empty state
            // and show a console error to avoid annoying toasts
            if (activeTab === 'history') setTransactions([])
            else setOutstanding([])
        } finally {
            setIsLoading(false)
        }
    }

    const handleSendReminder = async (item?: any, bulk = false) => {
        try {
            await apiSendPaymentReminder({ memberId: item?.id, bulk })
            toast.success(bulk ? 'Bulk reminders sent successfully' : `Reminder sent to ${item?.member}`)
        } catch (error) {
            toast.error('Failed to send reminder')
        }
    }

    const handleDownload = async (item: any) => {
        await generateInvoicePDF(item, { associationName: settings.associationName })
        toast.success('Professional PDF receipt downloaded')
    }

    return (
        <div className="space-y-6">
            {/* Tabs Row */}
            <div className="flex items-center gap-1 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-2xl w-max border border-gray-100 dark:border-gray-800">
                <button
                    onClick={() => setActiveTab('history')}
                    className={classNames(
                        "flex items-center gap-2 px-6 py-2.5 text-[14px] font-bold capitalize tracking-tight transition-all duration-300 rounded-xl",
                        activeTab === 'history'
                            ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    )}
                >
                    <CreditCard className="w-3.5 h-3.5" />
                    Payment History
                </button>
                <button
                    onClick={() => setActiveTab('outstanding')}
                    className={classNames(
                        "flex items-center gap-2 px-6 py-2.5 text-[14px] font-bold capitalize tracking-tight transition-all duration-300 rounded-xl",
                        activeTab === 'outstanding'
                            ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    )}
                >
                    <AlertCircle className="w-3.5 h-3.5" />
                    Outstanding Dues
                </button>
            </div>

            <Card className="rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none overflow-hidden bg-white dark:bg-gray-900">
                {/* Header Section */}
                <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">
                            {activeTab === 'history' ? 'Recent Transactions' : 'Outstanding Dues'}
                        </h3>
                        <p className="text-[12px] font-bold text-gray-400 mt-1 capitalize tracking-tight">
                            {activeTab === 'history' ? 'Complete history of all payments' : 'Members with overdue payments'}
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="w-full sm:w-60">
                            <DatePicker.DatePickerRange
                                placeholder="Select range"
                                size="md"
                                value={dateRange}
                                onChange={(val) => setDateRange(val as [Date | null, Date | null])}
                            />
                        </div>
                        {activeTab === 'outstanding' && (
                             <Button 
                                onClick={() => handleSendReminder(undefined, true)}
                                size="sm" variant="plain" className="bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-2 text-[10px] font-black capitalize  flex items-center gap-2 hover:bg-red-100 transition-all"
                             >
                                <Send className="w-3 h-3" />
                                Send Bulk Reminder
                             </Button>
                        )}
                        <div className="relative flex-1 md:w-[400px] lg:w-[480px]">
                            <VscSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input 
                                placeholder="Search by name, email or transaction ID..." 
                                className="pl-11 h-11 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Table Area */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-medium">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                <th className="px-8 py-5 text-[12px] font-bold text-gray-900 dark:text-gray-100 capitalize tracking-tight">Member</th>
                                {activeTab === 'history' ? (
                                    <>
                                        <th className="px-8 py-5 text-[12px] font-bold text-gray-900 dark:text-gray-100 capitalize tracking-tight">Amount due / paid</th>
                                        <th className="px-8 py-5 text-[12px] font-bold text-gray-900 dark:text-gray-100 capitalize tracking-tight">Status</th>
                                        <th className="px-8 py-5 text-[12px] font-bold text-gray-900 dark:text-gray-100 capitalize tracking-tight">Method</th>
                                        <th className="px-8 py-5 text-[12px] font-bold text-gray-900 dark:text-gray-100 capitalize tracking-tight">Date</th>
                                        <th className="px-8 py-5 text-[12px] font-bold text-gray-900 dark:text-gray-100 capitalize tracking-tight">Invoice</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="px-8 py-5 text-[12px] font-bold text-gray-900 dark:text-gray-100 capitalize tracking-tight">Due type</th>
                                        <th className="px-8 py-5 text-[12px] font-bold text-gray-900 dark:text-gray-100 capitalize tracking-tight">Amount</th>
                                        <th className="px-8 py-5 text-[12px] font-bold text-gray-900 dark:text-gray-100 capitalize tracking-tight">Due date</th>
                                        <th className="px-8 py-5 text-[12px] font-bold text-gray-900 dark:text-gray-100 capitalize tracking-tight">Overdue</th>
                                    </>
                                )}
                                <th className="px-8 py-5 text-[12px] font-bold text-gray-900 dark:text-gray-100 capitalize tracking-tight text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="py-20 text-center">
                                        <div className="flex justify-center"><Spinner size={40} /></div>
                                        <p className="text-gray-400 mt-4 font-bold text-xs uppercase tracking-widest">Loading Records...</p>
                                    </td>
                                </tr>
                            ) : (activeTab === 'history' ? transactions : outstanding).length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-20 text-center">
                                        <div className="flex justify-center mb-4"><div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center"><Calendar className="w-8 h-8 text-gray-300" /></div></div>
                                        <p className="text-gray-900 dark:text-white font-black text-lg">No records found</p>
                                        <p className="text-gray-400 text-sm font-medium mt-1">Try adjusting your filters or search term</p>
                                    </td>
                                </tr>
                            ) : (activeTab === 'history' ? transactions : outstanding).map((item: any) => (
                                <tr key={item.id} className="group hover:bg-gray-50/80 dark:hover:hover:bg-gray-800/40 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3.5">
                                            <div className="w-10 h-10 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center font-black text-primary text-[11px]">
                                                {item.member[0]}
                                            </div>
                                            <div>
                                                <p className="text-[14px] font-bold text-gray-900 dark:text-white leading-tight">{item.member}</p>
                                                <p className="text-[11px] font-medium text-gray-400 mt-0.5">{item.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    {activeTab === 'history' ? (
                                        <>
                                            <td className="px-8 py-5">
                                                <div className="space-y-1">
                                                    <p className="text-[13px] font-black text-gray-900 dark:text-white">{item.due} Due</p>
                                                    <p className="text-[11px] font-bold text-emerald-600">{item.paid} Paid</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold capitalize tracking-tight ring-1 ring-inset ${statusColors[item.status as keyof typeof statusColors]}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    {item.method === 'Paystack' && <CreditCard className="w-4 h-4 text-blue-500" />}
                                                    {item.method === 'Bank Transfer' && <Building className="w-4 h-4 text-emerald-500" />}
                                                    {item.method === 'Cash' && <Banknote className="w-4 h-4 text-amber-500" />}
                                                    <span className="text-[12px] font-bold text-gray-600 dark:text-gray-300">{item.method}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <p className="text-[12px] font-bold text-gray-600 dark:text-gray-300">
                                                    {item.date !== '-' ? dayjs(item.date).format('MMM D, YYYY') : '-'}
                                                </p>
                                            </td>
                                            <td className="px-8 py-5">
                                                {item.invoiceId ? (
                                                    <div className="space-y-1">
                                                        <span 
                                                            className="text-[11px] font-black text-primary flex items-center gap-1.5 cursor-pointer hover:underline transition-all" 
                                                            onClick={onViewInvoice ? () => onViewInvoice(item) : undefined}
                                                        >
                                                          <FileText className="w-3.5 h-3.5" /> {item.invoiceId}
                                                        </span>
                                                        <span className="text-[9px] text-gray-400 font-bold block tracking-tight pl-5">{item.ref}</span>
                                                    </div>
                                                ) : <span className="text-[12px] font-bold text-gray-400">-</span>}
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-8 py-5">
                                                <span className="text-[11px] font-bold text-gray-400 capitalize tracking-tight">{item.type}</span>
                                            </td>
                                            <td className="px-8 py-5 font-black text-gray-900 dark:text-white">{item.amount}</td>
                                            <td className="px-8 py-5 text-[12px] font-bold text-gray-600">{item.dueDate}</td>
                                            <td className="px-8 py-5">
                                                <span className={classNames(
                                                    "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black",
                                                    parseInt(item.overdue) > 50 ? "bg-red-50 text-red-600" : parseInt(item.overdue) > 30 ? "bg-amber-50 text-amber-600" : "bg-gray-50 text-gray-600"
                                                )}>
                                                    {item.overdue}
                                                </span>
                                            </td>
                                        </>
                                    )}
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {activeTab === 'outstanding' ? (
                                                <>

                                                    <button 
                                                        className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all border border-amber-100 group/remind" 
                                                        title="Send Reminder"
                                                        onClick={() => handleSendReminder(item)}
                                                    >
                                                        <Send className="w-3.5 h-3.5 transition-transform group-hover/remind:-translate-y-0.5 group-hover/remind:translate-x-0.5" />
                                                        <span className="capitalize">Remind</span>
                                                    </button>
                                                    <button 
                                                        className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all border border-emerald-100 group/pay" 
                                                        title="Record Payment"
                                                        onClick={() => onRecordPayment?.(item)}
                                                    >
                                                        <CreditCard className="w-3.5 h-3.5 transition-transform group-hover/pay:scale-110" />
                                                        <span className="capitalize">Record</span>
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    {item.invoiceId && (
                                                        <button 
                                                            onClick={() => handleDownload(item)}
                                                            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" 
                                                            title="Download PDF"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button 
                                                        className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-xl transition-all border border-primary/10 group/view" 
                                                        title="View Details"
                                                        onClick={() => {
                                                            if (activeTab === 'history' && item.invoiceId && onViewInvoice) {
                                                                onViewInvoice(item)
                                                            }
                                                        }}
                                                    >
                                                        <Eye className="w-3.5 h-3.5 transition-transform group-hover/view:scale-110" />
                                                        <span className="capitalize">Details</span>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Section */}
                <div className="p-8 border-t border-gray-100 dark:border-gray-800 bg-gray-50/20 dark:bg-gray-900/10 flex items-center justify-between">
                    <p className="text-[12px] font-bold text-gray-400 capitalize tracking-tight">
                        Showing {(activeTab === 'history' ? transactions : outstanding).length} transactions
                    </p>
                    <div className="flex gap-2">
                    <Button variant="plain" size="sm" className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 font-black shadow-sm h-10 text-[10px] capitalize ">Previous</Button>
                    <Button variant="plain" size="sm" className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 font-black shadow-sm h-10 text-[10px] capitalize ">Next</Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
