'use client'

import { CreditCard, Download } from 'lucide-react'

export default function PaymentsHeader({ onRecordPayment }: { onRecordPayment?: () => void }) {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 pb-4 animate-in fade-in slide-in-from-top-6 duration-1000 ease-out">
            <div className="space-y-4 lg:space-y-2">
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 dark:bg-primary/10 rounded-full border border-primary/10">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Financial Control</span>
                    </div>
                    <div className="h-px w-8 bg-gray-200 dark:bg-gray-800" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payments & Dues</span>
                </div>
                
                <div className="flex items-center gap-5">
                    <div className="relative group">
                        <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative p-3.5 bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 shrink-0 transform group-hover:scale-105 transition-transform duration-500">
                            <CreditCard className="h-7 w-7 text-primary" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white leading-none mb-1">
                            Payments & Dues Management
                        </h1>
                        <p className="text-base text-gray-500 dark:text-gray-400 font-medium max-w-2xl leading-relaxed">
                            Track member payments, dues status, and community financial activity.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0">
                <button 
                    onClick={onRecordPayment}
                    className="w-full sm:w-auto h-12 px-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-2xl font-black text-[10px] sm:text-[11px] capitalize hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                    + Record Offline
                </button>
                <div className="h-12 w-[1px] bg-gray-100 dark:bg-gray-800 hidden lg:block mx-2" />
                <button className="w-full sm:w-auto h-12 px-6 bg-[#8B0000] text-white rounded-2xl font-black text-[10px] sm:text-[11px] capitalize shadow-lg shadow-[#8B0000]/20 dark:shadow-none hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Report
                </button>
            </div>
        </div>
    )
}
