'use client'

import { Card } from '@/components/ui'
import { useSecurityEvents, useSecurityActions, usePagination } from '../../hooks'
import TableHeader from './TableHeader'
import { TableColumns, EmptyState, LoadingRow } from './TableComponents'
import SecurityEventRow from './SecurityEventRow'
import TablePagination from './TablePagination'
import { useEffect } from 'react'

/**
 * SecurityEventsTable - Main table component for displaying security events
 * 
 * Features:
 * - Displays security events with detailed information
 * - Provides action buttons for each event
 * - Supports pagination and filtering via hooks
 * - Shows loading and empty states
 */
export default function SecurityEventsTable() {
    const { events, total, loading, refetchEvents } = useSecurityEvents()
    const { handleSecurityEventAction } = useSecurityActions()
    const {
        currentPage,
        pageSize,
        handlePageChange,
        handlePageSizeChange
    } = usePagination({
        initialPage: 1,
        initialPageSize: 10
    })

    // Sync pagination with data fetching
    useEffect(() => {
        refetchEvents({ pageIndex: currentPage, pageSize: pageSize })
    }, [currentPage, pageSize]) // Removed refetchEvents from deps to avoid loop if it's not stable, though useCallback used in hook

    return (
        <Card className="rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-none overflow-hidden p-0 bg-white dark:bg-gray-900">
            <TableHeader />

            {/* Table Area */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <TableColumns />
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {loading && events.length === 0 ? (
                            Array.from({ length: pageSize }).map((_, idx) => (
                                <LoadingRow key={idx} />
                            ))
                        ) : events.length === 0 ? (
                            <EmptyState />
                        ) : (
                            events.map((event) => (
                                <SecurityEventRow
                                    key={event.id}
                                    event={event}
                                    onAction={handleSecurityEventAction}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Section */}
            {total > 0 && (
                <TablePagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    total={total}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            )}
        </Card>
    )
}
