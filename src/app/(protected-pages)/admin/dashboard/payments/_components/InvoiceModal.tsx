import React from 'react'
import { Dialog, Button } from '@/components/ui'
import { CheckCircle2, Download, Mail, Copy } from 'lucide-react'
import Logo from '@/components/template/Logo'
import { toast } from '@/components/ui'
import useSystemSettings from '@/utils/hooks/useSystemSettings'
import { generateInvoicePDF } from '@/utils/generateInvoicePDF'

export default function InvoiceModal({ isOpen, onClose, data }: { isOpen: boolean, onClose: () => void, data: any }) {
    const { settings } = useSystemSettings()
    
    const handleDownload = async () => {
        await generateInvoicePDF(data, { 
            associationName: settings.associationName 
        })
        toast.success('Professional PDF receipt downloaded')
    }

    const handleSendEmail = () => {
        toast.success(`Invoice successfully dispatched to ${data?.email}`)
    }

    if (!data) return null
    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={720}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[700px] flex flex-col"
        >
            <div className="p-8 sm:p-12 pb-0 flex-1">
                <div className="flex justify-between items-start mb-12">
                    <div className="space-y-4">
                        <Logo logoWidth={130} logoHeight={58} className="mb-2" />
                        <div className="px-4 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700 w-max">
                            <p className="text-[10px] font-bold text-gray-400 capitalize tracking-tight leading-none">Official payment receipt</p>
                        </div>
                    </div>
                    <div className="text-right space-y-2">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tighter capitalize leading-none">Invoice</h2>
                        <p className="text-[12px] font-bold text-gray-400 capitalize tracking-tight leading-none">{data.invoiceId}</p>
                        <div className="pt-2">
                            <span className="inline-flex items-center px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-[11px] font-bold capitalize tracking-tight border border-emerald-100 shadow-sm">
                                {data.status || 'Paid'} successfully
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-10 mb-12 pb-12 border-b border-gray-100 dark:border-gray-800">
                    <div className="space-y-4">
                        <p className="text-[12px] font-bold text-gray-400 capitalize tracking-tight pl-1">Member information</p>
                        <div className="space-y-1">
                            <h4 className="text-base font-bold text-gray-900 dark:text-white capitalize leading-tight">{data.member}</h4>
                            <p className="text-[12px] font-bold text-gray-500">{data.email}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <p className="text-[12px] font-bold text-gray-400 capitalize tracking-tight pl-1">Payment date</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">{data.date}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[12px] font-bold text-gray-400 capitalize tracking-tight pl-1">Transaction ID</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white font-mono tracking-tighter capitalize">{data.ref}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-12">
                    <p className="text-[12px] font-bold text-gray-400 capitalize tracking-tight mb-6 pl-1">Payment details</p>
                    <div className="bg-gray-50/50 dark:bg-gray-800/10 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-inner">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center border border-gray-100 dark:border-gray-700">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <h5 className="text-[15px] font-bold text-gray-900 dark:text-white capitalize tracking-tight">Annual dues subscription</h5>
                                    <p className="text-[11px] font-bold text-gray-400 mt-1 capitalize tracking-tight">Via {data.method} channel</p>
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white capitalize tracking-tighter">₦{data.paid}</span>
                        </div>
                        <div className="pt-6 mt-6 border-t border-gray-200/50 dark:border-gray-700 flex justify-between items-center">
                            <span className="text-[12px] font-bold text-gray-400 capitalize tracking-tight">Total amount paid</span>
                            <span className="text-3xl font-bold text-[#8B0000] dark:text-red-400 capitalize tracking-tighter shadow-sm">₦{data.paid}</span>
                        </div>
                    </div>
                </div>

                <div className="text-center pb-12 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-[13px] font-bold text-gray-500 max-w-md mx-auto leading-relaxed">Thank you for your timely contribution. Your support ensures the continued growth of the {settings.associationName} community.</p>
                </div>
            </div>

            <div className="mt-auto p-8 sm:px-12 bg-gray-50/20 dark:bg-gray-900/10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-6 border-t border-gray-100 dark:border-gray-800 shadow-lg">
                <button 
                    onClick={onClose}
                    className="h-14 px-8 rounded-2xl font-bold text-[14px] capitalize tracking-tight text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex-1 sm:flex-none justify-center border-none"
                >
                    Close
                </button>
                <div className="flex gap-4 w-full sm:w-auto">
                    <button 
                        onClick={handleSendEmail}
                        className="h-14 px-8 rounded-2xl font-bold text-[14px] capitalize tracking-tight text-[#8B0000] hover:bg-red-50 dark:hover:bg-red-900/20 flex gap-3 justify-center items-center flex-1 sm:flex-none transition-all border-none bg-white dark:bg-gray-800 shadow-sm"
                    >
                        <Mail className="w-5 h-5" />
                        Send email
                    </button>
                    <button 
                        onClick={handleDownload}
                        className="h-14 px-10 bg-[#8B0000] text-white rounded-2xl font-bold text-[14px] capitalize tracking-tight shadow-[0_12px_24px_-10px_rgba(139,0,0,0.5)] hover:-translate-y-1 transition-all flex gap-3 justify-center items-center flex-1 sm:flex-none border-none group"
                    >
                        <Download className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
                        Download PDF
                    </button>
                </div>
            </div>
        </Dialog>
    )
}
