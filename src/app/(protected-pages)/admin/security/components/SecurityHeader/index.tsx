'use client'

import { useState } from 'react'
import { ShieldCheck, Radar } from 'lucide-react'
import Button from '@/components/ui/Button'
import SecurityScanModal from './SecurityScanModal'

/**
 * SecurityHeader - Main header component for the security dashboard
 * 
 * Features:
 * - Displays page title and description
 * - Provides access to security scan functionality
 * - Shows visual indicators for security context
 */
export default function SecurityHeader() {
    const [isScanModalOpen, setIsScanModalOpen] = useState(false)

    return (
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-2 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="space-y-4 lg:space-y-1">
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-xs font-black text-primary whitespace-nowrap">
                        Administration
                    </span>
                    <div className="h-px w-12 bg-primary/20" />
                    <span className="text-xs font-black text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        Security & Integrity
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shrink-0">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
                        Security Center
                    </h1>
                </div>
                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 lg:pl-14 font-medium max-w-2xl leading-relaxed">
                    Monitor real-time threats, manage access controls, and enforce security policies across your organization.
                </p>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
                <Button
                    variant="solid"
                    icon={<Radar className="w-4 h-4" />}
                    onClick={() => setIsScanModalOpen(true)}
                    className="shadow-lg shadow-primary/25"
                >
                    Security Scan
                </Button>
            </div>

            <SecurityScanModal
                isOpen={isScanModalOpen}
                onClose={() => setIsScanModalOpen(false)}
            />
        </div>
    )
}
