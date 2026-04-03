'use client'

import { Card } from '@/components/ui'
import { useSecurityActions, usePagination, useMonitoredApiKeys } from '../../hooks'
import ApiKeyRow from './ApiKeyRow'
import TablePagination from '../SecurityEventsTable/TablePagination'
import { useEffect } from 'react'

interface ApiKeyMonitoringTableProps {
    listTotal?: number
}

/**
 * ApiKeyMonitoringTable - Main table component for monitoring API keys
 * 
 * Features:
 * - Displays API keys with usage statistics
 * - Shows abuse scores and status
 * - Provides action buttons for each key
 * - Supports pagination and fetching from backend
 */
export default function ApiKeyMonitoringTable({ listTotal }: ApiKeyMonitoringTableProps) {
    const { handleApiKeyAction } = useSecurityActions()
    const { keys, total, loading, fetchKeys } = useMonitoredApiKeys()

    const {
        currentPage,
        pageSize,
        handlePageChange,
        handlePageSizeChange
    } = usePagination({
        initialPage: 1,
        initialPageSize: 10
    })

    useEffect(() => {
        fetchKeys(currentPage, pageSize)
    }, [currentPage, pageSize, fetchKeys])

    return (
        <Card className="rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-none overflow-hidden p-0 bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="p-8 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                    API Key Monitoring
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 font-medium">
                    Track API usage, detect abuse, and manage access
                </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50/50 dark:bg-gray-950/50 border-b border-gray-100 dark:border-gray-800">
                        <tr>
                            <th className="px-8 py-5 text-left text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                API Key
                            </th>
                            <th className="px-8 py-5 text-left text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Owner
                            </th>
                            <th className="px-8 py-5 text-left text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Usage
                            </th>
                            <th className="px-8 py-5 text-left text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Abuse Score
                            </th>
                            <th className="px-8 py-5 text-left text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-8 py-5 text-center text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {loading && keys.length === 0 ? (
                            Array.from({ length: pageSize }).map((_, idx) => (
                                <tr key={idx} className="animate-pulse">
                                    <td colSpan={6} className="px-8 py-5">
                                        <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl w-full" />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            keys.map((apiKey) => (
                                <ApiKeyRow
                                    key={apiKey.id}
                                    apiKey={apiKey}
                                    onAction={handleApiKeyAction}
                                />
                            ))
                        )}

                        {!loading && keys.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-8 py-10 text-center text-gray-600 dark:text-gray-400 text-sm">
                                    No monitored API keys found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
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
