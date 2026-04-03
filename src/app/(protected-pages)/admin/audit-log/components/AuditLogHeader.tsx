'use client'

import { Button } from '@/components/ui'
import { Download, Filter, ShieldCheck } from 'lucide-react'

interface AuditLogHeaderProps {
    onExport: () => void
    onOpenFilters: () => void
}

/**
 * AuditLogHeader - Functional, high-fidelity header for Audit Logs
 */
export default function AuditLogHeader({ onExport, onOpenFilters }: AuditLogHeaderProps) {
    return (
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-2 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="space-y-4 lg:space-y-1">
                {/* Breadcrumb Info */}
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-[9px] sm:text-[10px] font-black text-primary whitespace-nowrap uppercase tracking-widest">Administration</span>
                    <div className="h-px w-8 sm:w-12 bg-primary/20" />
                    <span className="text-[9px] sm:text-[10px] font-black text-gray-400 whitespace-nowrap uppercase tracking-widest">Activity History</span>
                </div>

                {/* Title & Icon */}
                <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shrink-0">
                        <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 dark:text-white leading-none">
                        Audit Logs
                    </h1>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base lg:text-lg text-gray-500 dark:text-gray-400 lg:pl-14 font-medium max-w-2xl leading-relaxed italic">
                    Complete history of all platform operations and administrative actions.
                </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                <Button
                    variant="plain"
                    onClick={onExport}
                    className="h-12 sm:h-14 px-6 sm:px-8 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-black text-[10px] sm:text-[11px] rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/20 transition-all flex items-center justify-center gap-3 group"
                >
                    <Download className="w-4 h-4 transition-transform group-hover:-translate-y-1" />
                    Export CSV
                </Button>

                <Button
                    variant="solid"
                    onClick={onOpenFilters}
                    className="h-12 sm:h-14 px-6 sm:px-8 bg-primary hover:bg-primary-deep text-white font-black text-[10px] sm:text-[11px] rounded-xl sm:rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group"
                >
                    <Filter className="w-4 h-4 transition-transform group-hover:rotate-12" />
                    Advanced Filters
                </Button>
            </div>
        </div>
    )
}
