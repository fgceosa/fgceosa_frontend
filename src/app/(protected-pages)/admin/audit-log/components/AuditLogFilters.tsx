'use client'

import React from 'react'
import { Input } from '@/components/ui'
import { Search } from 'lucide-react'
import type { AuditLogFilterParams } from '../types'

interface AuditLogFiltersProps {
    params: AuditLogFilterParams
    onParamChange: (newParams: Partial<AuditLogFilterParams>) => void
}

/**
 * AuditLogFilters - Search and simple filtering bar for the Audit Log
 */
export default function AuditLogFilters({ params, onParamChange }: AuditLogFiltersProps) {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onParamChange({ search: e.target.value, page: 1 })
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-6 relative group mb-8 overflow-hidden hover:shadow-2xl transition-all duration-500">
            {/* Hover Accent */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                {/* Search Implementation */}
                <div className="relative w-full lg:flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                        placeholder="Search for people, actions, or locations..."
                        className="pl-12 h-14 bg-gray-50/50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-primary/20 focus:border-primary text-sm shadow-inner transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-750 font-medium"
                        value={params.search || ''}
                        onChange={handleSearchChange}
                    />
                </div>

                {/* Optional Status Label */}
                <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Monitoring is live</span>
                </div>
            </div>
        </div>
    )
}
