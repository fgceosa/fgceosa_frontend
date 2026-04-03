'use client'

import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { Badge } from '@/components/ui'
import { Building } from 'lucide-react'

const ModelLibraryHeader = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-2">
            <div className="space-y-4 lg:space-y-1">
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] whitespace-nowrap">Organization</span>
                    <div className="h-px w-12 bg-primary/20" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] whitespace-nowrap">Model library</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shrink-0">
                        <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex items-baseline gap-3">
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
                            Model Library
                        </h1>
                    </div>
                </div>
                <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 lg:pl-[3.75rem] font-medium max-w-2xl leading-relaxed mt-1">
                    Manage and provision approved AI models to empower your team's workflow.
                </p>
            </div>
        </div>
    )
}

export default ModelLibraryHeader
