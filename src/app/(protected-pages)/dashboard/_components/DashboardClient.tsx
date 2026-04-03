'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import {
    fetchDashboardData,
    clearDashboardError,
} from '@/store/slices/admindashboard'
import {
    selectAdminDashboardLoading,
    selectAdminDashboardError,
    selectHasDashboardData,
    selectAdminDashboardData,
    selectWeeklyMetrics,
    selectMonthlyMetrics,
    selectAnnualMetrics,
} from '@/store/slices/admindashboard'

import Overview from './Overview'
import WeeklyUsageTrends from './WeeklyUsageTrends'
import Loading from '@/components/shared/Loading'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import QuickActionsCard from './QuickActionsCard'
import ModelDonutChart from './ModelUsage'
import TransactionHistory from './TransactionHistory'
// import DateRangeFilter from './DateRangeFilter'

const DashboardClient = () => {
    const dispatch = useAppDispatch()

    // Selectors
    const loading = useAppSelector(selectAdminDashboardLoading)
    const error = useAppSelector(selectAdminDashboardError)
    const hasData = useAppSelector(selectHasDashboardData)
    const dashboardData = useAppSelector(selectAdminDashboardData)

    // Get user session
    const session = useAppSelector((state) => state.auth.session.session)
    const userName = session?.user?.name || 'User'

    // Period metrics
    const weeklyMetrics = useAppSelector(selectWeeklyMetrics)
    const monthlyMetrics = useAppSelector(selectMonthlyMetrics)
    const annualMetrics = useAppSelector(selectAnnualMetrics)

    // Fetch data on component mount
    useEffect(() => {
        dispatch(fetchDashboardData())
    }, [dispatch])

    // Debug: Log dashboard data
    useEffect(() => {
        if (dashboardData) {
            console.log('Dashboard Data:', dashboardData)
            console.log('Weekly Metrics:', weeklyMetrics)
            console.log('Monthly Metrics:', monthlyMetrics)
            console.log('Annual Metrics:', annualMetrics)
        }
    }, [dashboardData, weeklyMetrics, monthlyMetrics, annualMetrics])



    const handleClearError = () => {
        dispatch(clearDashboardError())
    }

    // Move these checks inside the return

    // Move this logic inside the return below the header

    return (
        <div className="min-h-screen bg-[#f5f5f5] dark:bg-gray-900/50 p-4 sm:p-8 overflow-x-hidden">
            <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-700">
                {/* Enterprise Header Section */}
                <div className="flex flex-col gap-6 pb-2">
                    <div className="space-y-3 lg:space-y-1">
                        <div className="flex items-center gap-3 sm:gap-4 mb-2">
                            <span className="text-[9px] sm:text-[10px] font-black text-primary whitespace-nowrap">Dashboard & Analytics</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-2 sm:p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shrink-0">
                                {(() => {
                                    const hour = new Date().getHours()
                                    if (hour < 12) return <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                                    if (hour < 18) return <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                                    return <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                                })()}
                            </div>
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 dark:text-white break-words">
                                {(() => {
                                    const hour = new Date().getHours()
                                    if (hour < 12) return 'Good Morning'
                                    if (hour < 18) return 'Good Afternoon'
                                    return 'Good Evening'
                                })()}, <span className="text-primary">
                                    {userName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                                </span>
                            </h1>
                        </div>
                        <p className="text-sm sm:text-base lg:text-lg text-gray-500 dark:text-gray-400 lg:pl-14 font-medium max-w-2xl leading-relaxed">
                            Monitor your credit usage, track API performance, and manage your AI resources
                        </p>
                    </div>

                </div>

                {/* Background Decoration */}
                <div className="relative">
                    <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full opacity-50 pointer-events-none" />

                    {/* Error Banner */}
                    {error && hasData && (
                        <div className="relative z-20 mb-6">
                            <Alert
                                showIcon
                                type="warning"
                                className="shadow-sm rounded-2xl border-amber-100 dark:border-amber-900/30"
                                closable
                                onClose={handleClearError}
                            >
                                <span className="text-sm font-medium">
                                    Failed to refresh data: {error}
                                </span>
                            </Alert>
                        </div>
                    )}

                    {/* Main Content Areas */}
                    <div className="relative z-10 space-y-10">
                        {loading && !hasData ? (
                            <div className="space-y-10">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="h-40 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-800" />
                                    ))}
                                </div>
                                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                                    <div className="xl:col-span-8 h-[400px] bg-white dark:bg-gray-800 rounded-[2.5rem] animate-pulse border border-gray-100 dark:border-gray-800" />
                                    <div className="xl:col-span-4 h-[400px] bg-white dark:bg-gray-800 rounded-[2.5rem] animate-pulse border border-gray-100 dark:border-gray-800" />
                                </div>
                            </div>
                        ) : error && !hasData ? (
                            <div className="max-w-md mx-auto py-20">
                                <Alert showIcon type="danger" className="mb-4 rounded-2xl">
                                    <div className="flex flex-col gap-2 text-left">
                                        <span className="font-semibold">Error loading dashboard data</span>
                                        <span className="text-sm">{error}</span>
                                        <div className="flex gap-2 mt-4">
                                            <Button size="sm" variant="solid" onClick={() => dispatch(fetchDashboardData())}>Retry</Button>
                                            <Button size="sm" variant="default" onClick={handleClearError}>Dismiss</Button>
                                        </div>
                                    </div>
                                </Alert>
                            </div>
                        ) : !dashboardData ? (
                            <div className="flex items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-700">
                                <div className="text-center">
                                    <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">No dashboard data available</p>
                                    <Button variant="solid" onClick={() => dispatch(fetchDashboardData())}>Load Data</Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Stats Cards Section */}
                                <Overview
                                    weeklyMetrics={weeklyMetrics}
                                    monthlyMetrics={monthlyMetrics}
                                    annualMetrics={annualMetrics}
                                />

                                {/* Charts Section */}
                                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8">
                                    {/* Usage Trends */}
                                    <div className="xl:col-span-8">
                                        <WeeklyUsageTrends
                                            data={dashboardData.weeklyUsageTrends}
                                            trend={weeklyMetrics?.spendingTrend}
                                        />
                                    </div>

                                    {/* Model Usage */}
                                    <div className="xl:col-span-4">
                                        <ModelDonutChart />
                                    </div>
                                </div>

                                {/* Transaction History and Quick Actions Row */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                                    <TransactionHistory />
                                    <QuickActionsCard />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardClient
