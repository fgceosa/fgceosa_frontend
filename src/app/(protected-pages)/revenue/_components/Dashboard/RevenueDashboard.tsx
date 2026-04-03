'use client'

import React from 'react'
import { TrendingUp } from 'lucide-react'
import { useRevenueDashboard } from '../../hooks/useRevenueDashboard'
import RevenueKPISection from '../KPI/RevenueKPISection'
import RevenueDashboardTabs from './RevenueDashboardTabs'
import QorebitLoading from '@/components/shared/QorebitLoading'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'

/**
 * RevenueDashboard - Main container for the revenue oversight page.
 * Displays KPI summaries, interactive charts, and detailed performance tables.
 */
export default function RevenueDashboard() {
    const {
        data,
        loading,
        error,
        handlePeriodChange,
        handleRetry,
        handleClearError
    } = useRevenueDashboard()

    // Move these checks inside the return

    return (
        <div className="min-h-screen bg-[#f5f5f5] dark:bg-gray-900/50 p-4 sm:p-8 overflow-x-hidden">
            <div className="max-w-full mx-auto space-y-10 animate-in fade-in duration-700">
                {/* Enterprise Header Section */}
                <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-2">
                    <div className="space-y-4 lg:space-y-1">
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-[10px] font-black text-primary whitespace-nowrap">Revenue</span>
                            <div className="h-px w-12 bg-primary/20" />
                            <span className="text-[10px] font-black text-gray-400 whitespace-nowrap">Insights</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shrink-0">
                                <TrendingUp className="h-6 w-6 text-primary" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                                Revenue Overview
                            </h1>
                        </div>
                        <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 lg:pl-14 font-medium max-w-2xl leading-relaxed">
                            Track your revenue, costs, and overall profit in real-time.
                        </p>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="relative">
                    {/* Background Visual Decorations */}
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
                    <div className="absolute top-40 -right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl opacity-50 pointer-events-none" />

                    <div className="relative z-10 space-y-10">
                        {loading && !data ? (
                            <div className="space-y-10">
                                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="h-40 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-800" />
                                    ))}
                                </section>
                                <section className="h-[600px] bg-white dark:bg-gray-800 rounded-[2.5rem] animate-pulse border border-gray-100 dark:border-gray-800" />
                            </div>
                        ) : error && !data ? (
                            <div className="max-w-md mx-auto py-20">
                                <Alert showIcon type="danger" className="mb-4 rounded-2xl">
                                    <div className="flex flex-col gap-2 text-left">
                                        <span className="font-semibold">Error loading revenue analytics</span>
                                        <span className="text-sm">{String(error)}</span>
                                        <div className="flex gap-2 mt-4">
                                            <Button size="sm" variant="solid" onClick={handleRetry}>Retry</Button>
                                            <Button size="sm" variant="default" onClick={handleClearError}>Dismiss</Button>
                                        </div>
                                    </div>
                                </Alert>
                            </div>
                        ) : !data ? (
                            <div className="flex items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-700">
                                <div className="text-center">
                                    <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">No revenue data available</p>
                                    <Button variant="solid" onClick={handleRetry}>Load Data</Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* High-level performance metrics */}
                                <section className="relative z-10">
                                    <RevenueKPISection data={data.kpi} />
                                </section>

                                {/* Detailed analytics and reports */}
                                <section className="relative z-10">
                                    <RevenueDashboardTabs
                                        data={data}
                                        onPeriodChange={handlePeriodChange}
                                    />
                                </section>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}
