'use client'

import React, { useState } from 'react'
import AuditLogHeader from './components/AuditLogHeader'
import AuditLogStats from './components/AuditLogStats'
import AuditLogFilters from './components/AuditLogFilters'
import AuditLogTable from './components/AuditLogTable'
import AuditLogDetailsDrawer from './components/AuditLogDetailsDrawer'
import AdvancedFilterDrawer from './components/AdvancedFilterDrawer'
import { useAuditLog } from './hooks/useAuditLog'
import type { AuditLogEntry } from './types'
import { Pagination, toast, Notification, Select } from '@/components/ui'
import { ShieldCheck } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const PAGE_SIZE_OPTIONS = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]

/**
 * AuditLogPage - Platform Super Admin Audit Command Center
 * 
 * Provides a high-fidelity, immutable history of all platform operations.
 */
export default function AuditLogPage() {
    const searchParams = useSearchParams()
    const orgId = searchParams.get('organization_id')

    const {
        logs,
        total,
        stats,
        loading,
        params,
        updateParams,
        resetFilters,
        exportLogs
    } = useAuditLog()

    useEffect(() => {
        if (orgId) {
            updateParams({ organization_id: orgId })
        }
    }, [orgId])

    const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [isExporting, setIsExporting] = useState(false)

    const handleViewDetails = (log: AuditLogEntry) => {
        setSelectedLog(log)
        setIsDetailsOpen(true)
    }

    const handleResetFilters = () => {
        resetFilters()
    }

    const handleExport = async () => {
        if (isExporting) return

        setIsExporting(true)
        toast.push(
            <Notification type="info" title="Exporting Data">
                Generating audit log CSV for {total} entries. Please wait...
            </Notification>
        )

        try {
            await exportLogs()
            toast.push(
                <Notification type="success" title="Export Complete">
                    Audit logs have been exported successfully.
                </Notification>
            )
        } catch (err) {
            toast.push(
                <Notification type="danger" title="Export Failed">
                    There was an error generating the export. Please try again.
                </Notification>
            )
        } finally {
            setIsExporting(false)
        }
    }

    const handlePageChange = (page: number) => {
        updateParams({ page })
    }

    const handlePageSizeChange = (size: number) => {
        updateParams({ page_size: size, page: 1 })
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5] dark:bg-gray-900/50 -m-4 sm:-m-8 p-4 sm:p-8">
            <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700 font-sans">

                {/* Header Section */}
                <AuditLogHeader
                    onExport={handleExport}
                    onOpenFilters={() => setIsFilterOpen(true)}
                />

                {/* Insight Summary Cards */}
                <AuditLogStats stats={stats || undefined} />

                {/* Filter & Search Bar */}
                <AuditLogFilters
                    params={params}
                    onParamChange={updateParams}
                />

                {/* Main Data Table */}
                <div className="space-y-6">
                    <AuditLogTable
                        logs={logs}
                        loading={loading}
                        onViewDetails={handleViewDetails}
                    />

                    {/* Pagination */}
                    {total > 0 && (
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-lg shadow-gray-200/40">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] items-center gap-2 font-black text-gray-400 flex shrink-0">
                                    Show
                                    <div className="w-20">
                                        <Select
                                            size="sm"
                                            menuPlacement="top"
                                            isSearchable={false}
                                            value={PAGE_SIZE_OPTIONS.find(opt => opt.value === (params.page_size || 10))}
                                            options={PAGE_SIZE_OPTIONS}
                                            onChange={(opt: any) => handlePageSizeChange(opt?.value)}
                                        />
                                    </div>
                                    Per Page
                                </span>
                                <div className="w-px h-4 bg-gray-100 dark:bg-gray-800" />
                                <p className="text-[10px] font-black text-gray-400">
                                    Total <span className="text-gray-900 dark:text-white">{total}</span> Records
                                </p>
                            </div>
                            <Pagination
                                currentPage={params.page || 1}
                                total={total}
                                pageSize={params.page_size || 10}
                                onChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>

                {/* Compliance & Retention Footer */}
                <div className="pt-8 pb-12 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 opacity-60">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Retention Policy</p>
                        <p className="text-xs font-medium text-gray-400">All management operations are retained for 24 months for SOC2/ISO compliance.</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Time Protocol</span>
                            <span className="text-xs font-bold text-gray-400">Precision UTC (ISO-8601)</span>
                        </div>
                        <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-800" />
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center grayscale">
                                <span className="text-[10px] font-black">SOC2</span>
                            </div>
                            <div className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center grayscale">
                                <span className="text-[10px] font-black">ISO</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details View Drawer */}
            <AuditLogDetailsDrawer
                log={selectedLog}
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
            />

            {/* Advanced Filters Drawer */}
            <AdvancedFilterDrawer
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                params={params}
                onParamChange={updateParams}
                onReset={handleResetFilters}
            />
        </div>
    )
}
