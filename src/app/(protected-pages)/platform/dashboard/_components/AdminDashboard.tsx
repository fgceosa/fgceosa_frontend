'use client'

import { useState, useMemo, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import {
    fetchDashboardData,
    fetchDashboardMetrics,
    clearDashboardError,
    selectAdminDashboardLoading,
    selectAdminDashboardError,
    selectHasDashboardData,
    selectAdminDashboardData,
    selectTopWorkspaces,
    selectActivities,
    selectModelUsageDistribution,
    selectWeeklyUsageTrends,
    selectActiveProjectsLoading, // Example loading selector
} from '@/store/slices/admindashboard'

import Loading from '@/components/shared/Loading'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import type { PeriodMetrics } from '../types'

// Components
import OverviewMetrics from './OverviewMetrics'
import RevenueUsageChart from './RevenueUsageChart'
import TopWorkspaces from './TopWorkspaces'
import ActivityFeed from './ActivityFeed'
import RevenueBreakdown from './RevenueBreakdown'
import AdminQuickActions from './AdminQuickActions'

type MetricType = 'totalRevenue' | 'systemHealth' | 'activeUsers' | 'tokenUsage'
type PeriodOption = 'weekly' | 'monthly' | 'annually' | 'byModel' | 'byOrg' | 'byCountry'

const periodOptions = [
    { label: 'This Week', value: 'weekly' },
    { label: 'This Month', value: 'monthly' },
    { label: 'This Year', value: 'annually' },
]

const AdminDashboard = () => {
    const dispatch = useAppDispatch()

    // Local State
    const [selectedMetric, setSelectedMetric] = useState<MetricType>('totalRevenue')
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('monthly')

    // Selectors
    const loading = useAppSelector(selectAdminDashboardLoading)
    const error = useAppSelector(selectAdminDashboardError)
    const hasData = useAppSelector(selectHasDashboardData)
    const dashboardData = useAppSelector(selectAdminDashboardData)

    // Feature Selectors
    const topWorkspaces = useAppSelector(selectTopWorkspaces)
    const activities = useAppSelector(selectActivities)
    const modelUsage = useAppSelector(selectModelUsageDistribution)
    const weeklyUsageTrends = useAppSelector(selectWeeklyUsageTrends)

    // Get user session
    const userName = useAppSelector((state) => {
        const user = state.auth.user
        return user?.authority && user.authority.length > 0 ? 'Admin' : user?.userName || 'User'
    })

    // Period metrics
    const currentMetrics = useMemo(() => {
        if (!dashboardData) return undefined

        // Helper to check if it matches PeriodMetrics shape roughly
        const getMetrics = (data: any): PeriodMetrics | undefined => {
            if (!data) return undefined
            return {
                totalRevenue: data.totalRevenue || 0,
                apiRequests: data.apiRequests || 0,
                activeUsers: data.activeUsers || 0,
                avgRevenuePerUser: data.avgRevenuePerUser || 0,
                tokenUsage: data.tokenUsage || 0,
                aiAgents: data.activeProjects || 0 // Mapping projects to this slot
            }
        }

        // Return based on selected period logic
        // Ensuring these match the exact keys returned by backend
        if (selectedPeriod === 'weekly') return getMetrics(dashboardData.weekly)
        if (selectedPeriod === 'monthly') return getMetrics(dashboardData.monthly)
        if (selectedPeriod === 'annually') return getMetrics(dashboardData.annually)

        return getMetrics(dashboardData.monthly) // Default
    }, [selectedPeriod, dashboardData])


    // Fetch data on component mount
    useEffect(() => {
        dispatch(fetchDashboardData())
    }, [dispatch])

    const handleClearError = () => {
        dispatch(clearDashboardError())
    }

    // Loading state (Initial load only)
    if (loading && !hasData) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loading loading type="qorebit" />
            </div>
        )
    }

    // Error state (only if no data is present)
    if (error && !hasData) {
        return (
            <div className="max-w-md mx-auto mt-8 px-4">
                <Alert showIcon type="danger" className="mb-4">
                    <div className="flex flex-col gap-2">
                        <span className="font-semibold">
                            Error loading dashboard data
                        </span>
                        <span className="text-sm">{error}</span>
                        <div className="flex gap-2 mt-2">
                            <Button
                                size="sm"
                                variant="solid"
                                onClick={() => dispatch(fetchDashboardData())}
                            >
                                Retry
                            </Button>
                        </div>
                    </div>
                </Alert>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5] dark:bg-gray-900/50 -m-4 sm:-m-8 p-4 sm:p-8">
            <div className="w-full space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-700">
                {/* 1. Overview Metrics */}
                <div className="w-full">
                    <OverviewMetrics
                        metrics={currentMetrics}
                        selectedMetric={selectedMetric}
                        onSelectMetric={setSelectedMetric}
                        selectedPeriod={selectedPeriod}
                        onSelectPeriod={(period) => {
                            setSelectedPeriod(period)
                            const mapping: Record<string, 'week' | 'month' | 'year'> = {
                                weekly: 'week',
                                monthly: 'month',
                                annually: 'year'
                            }
                            dispatch(fetchDashboardMetrics(mapping[period]))
                        }}
                        periodOptions={periodOptions}
                        userName={userName}
                    />
                </div>

                {/* 1.5. Admin Quick Actions */}
                <div className="w-full">
                    <AdminQuickActions />
                </div>

                {/* 2. Usage & Revenue Row */}
                <div className="w-full">
                    <div className="flex flex-col gap-2 mb-4">
                        <h2 className="text-lg font-black text-gray-900 dark:text-white">Usage & Revenue</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <RevenueUsageChart
                                weeklyUsageTrends={weeklyUsageTrends}
                                metrics={currentMetrics}
                                onPeriodChange={(period: string) => {
                                    // Map chart period to dashboard period and trigger refetch
                                    const periodMap: Record<string, PeriodOption> = {
                                        '7': 'weekly',
                                        '30': 'monthly',
                                        '90': 'annually'
                                    }
                                    setSelectedPeriod(periodMap[period] || 'monthly')
                                    dispatch(fetchDashboardData())
                                }}
                            />
                        </div>
                        <div className="lg:col-span-1">
                            <RevenueBreakdown breakdown={modelUsage} loading={loading && !hasData} />
                        </div>
                    </div>
                </div>

                {/* 3. Bottom Row: Top Workspaces, Activity Feed */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-start">
                    <div className="flex flex-col w-full">
                        <TopWorkspaces workspaces={topWorkspaces} loading={loading && !hasData} />
                    </div>
                    <div className="flex flex-col w-full">
                        <ActivityFeed activities={activities} />
                    </div>
                </div>

                {/* Error Banner (if data exists but update failed) */}
                {error && hasData && (
                    <Alert
                        showIcon
                        type="warning"
                        className="mb-4"
                        closable
                        onClose={handleClearError}
                    >
                        <span className="text-sm">
                            Failed to refresh data: {error}
                        </span>
                    </Alert>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard
