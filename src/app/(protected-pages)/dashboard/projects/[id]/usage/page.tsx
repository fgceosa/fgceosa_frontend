'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeft, BarChart2, Activity, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui'
import {
    fetchProjectUsage,
    selectCurrentProjectUsage,
    selectUsageLoading,
    clearCurrentProject,
} from '@/store/slices/projects'
import UsageFilters from './_components/UsageFilters'
import UsageMetrics from './_components/UsageMetrics'
import UsageTrends from './_components/UsageTrends'
import RecentCalls from './_components/RecentCalls'

export default function Page() {
    const params = useParams()
    const router = useRouter()
    const dispatch = useDispatch()
    const projectId = params.id as string

    const projectUsage = useSelector(selectCurrentProjectUsage)
    const isLoading = useSelector(selectUsageLoading)

    const [dateRange, setDateRange] = useState<{
        startDate?: string
        endDate?: string
    }>({})

    const [page, setPage] = useState(1)

    useEffect(() => {
        if (projectId) {
            dispatch(
                fetchProjectUsage({
                    id: projectId,
                    ...dateRange,
                    page,
                    pageSize: 50,
                }) as any
            )
        }
    }, [dispatch, projectId, dateRange, page])

    // Cleanup only on unmount (project change)
    useEffect(() => {
        return () => {
            dispatch(clearCurrentProject())
        }
    }, [dispatch])

    const handleDateRangeChange = (start?: string, end?: string) => {
        setDateRange({ startDate: start, endDate: end })
        setPage(1) // Reset to page 1 on filter change
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }

    const handleRefresh = () => {
        if (projectId && !isLoading) {
            dispatch(
                fetchProjectUsage({
                    id: projectId,
                    ...dateRange,
                    page,
                    pageSize: 50,
                }) as any
            )
        }
    }

    const handleBack = () => {
        router.push('/dashboard/projects')
    }

    if (isLoading && !projectUsage) {
        return (
            <div className="w-full py-8 px-4 sm:px-6 lg:px-8 space-y-10 animate-pulse">
                <div className="h-10 w-32 bg-gray-100 dark:bg-gray-800 rounded-xl" />
                <div className="space-y-4">
                    <div className="h-12 w-64 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
                    <div className="h-6 w-96 bg-gray-50 dark:bg-gray-900 rounded-xl" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-[2rem]" />
                    ))}
                </div>
                <div className="h-[400px] bg-gray-50 dark:bg-gray-900 rounded-[2.5rem]" />
            </div>
        )
    }

    return (
        <div className="w-full py-8 px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="relative">
                {/* Background Decoration */}
                <div className="absolute -inset-24 bg-primary/5 blur-3xl rounded-full opacity-50 pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-2">
                    <div className="space-y-6 lg:space-y-2">
                        <Button
                            variant="default"
                            onClick={handleBack}
                            className="h-10 px-4 rounded-xl font-black text-[10px] bg-white dark:bg-gray-800 border-none shadow-sm hover:translate-x-[-4px] transition-transform flex items-center gap-2 group"
                        >
                            <ArrowLeft className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                            Back to Projects
                        </Button>

                        <div className="space-y-4 lg:space-y-1">
                            <div className="flex items-center gap-4 mb-2">
                                <span className="text-[10px] font-black text-primary whitespace-nowrap">Usage Analytics</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shrink-0">
                                    <Activity className="h-6 w-6 text-primary" />
                                </div>
                                <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white">
                                    {projectUsage?.project.name || 'Project Stats'}
                                </h1>
                            </div>
                            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 lg:pl-14 font-medium max-w-2xl leading-relaxed">
                                Track usage, tokens, and API performance for this project.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <Button
                            variant="plain"
                            onClick={handleRefresh}
                            disabled={isLoading}
                            className="h-10 px-4 rounded-xl font-black text-xs bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:translate-y-[-2px] transition-transform flex items-center gap-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh Stats
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="space-y-12">
                {/* Filters */}
                <UsageFilters onDateRangeChange={handleDateRangeChange} />

                {/* Metrics Grid */}
                {projectUsage && (
                    <UsageMetrics metrics={projectUsage.metricsSummary} />
                )}

                {/* Usage Trends */}
                {projectUsage && (
                    <UsageTrends trends={projectUsage.usageTrends} />
                )}

                {/* Recent API Calls */}
                {projectUsage && (
                    <RecentCalls
                        calls={projectUsage.recentCalls}
                        page={projectUsage.page || page}
                        pageSize={projectUsage.pageSize || 50}
                        totalItems={projectUsage.totalRecentCalls}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    )
}
