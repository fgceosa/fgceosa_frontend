'use client'

import { useSecurityStats, useSecurityEvents } from './hooks'
import SecurityHeader from './components/SecurityHeader'
import SecurityAnalytics from './components/SecurityAnalytics'
import SecurityEventsTable from './components/SecurityEventsTable'
import ApiKeyMonitoringTable from './components/ApiKeyMonitoringTable'
import SecurityControlsPanel from './components/SecurityControlsPanel'
import SessionMonitoring from './components/SessionMonitoring'
import SearchTableTools from '@/components/shared/TableTools/SearchTableTools'

/**
 * SecurityDashboard - Platform Super Admin Security Command Center
 * 
 * Provides comprehensive security monitoring and management capabilities including:
 * - Real-time security statistics and analytics
 * - Security event tracking and investigation
 * - API key monitoring and abuse detection
 * - Security controls and policy management
 * - Session monitoring and management
 */
export default function SecurityDashboard() {
    // Initialize data hooks
    const { stats } = useSecurityStats()
    useSecurityEvents()

    // Extract session metrics from stats
    const sessionMetrics = stats ? {
        activeSessions: stats.activeSessions,
        failedLogins24h: stats.failedLogins24h,
        suspiciousPatterns: stats.suspiciousPatterns
    } : undefined

    return (
        <div className="min-h-screen bg-[#f5f5f5] dark:bg-gray-950/50 -m-4 sm:-m-8 p-4 sm:p-8">
            <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700 font-sans">
                {/* Enterprise Header */}
                <SecurityHeader />

                {/* Background Decoration */}
                <div className="relative">
                    <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full opacity-50 pointer-events-none" />

                    {/* Stats Overview */}
                    <div className="relative z-10 mb-8 text-pretty">
                        <SecurityAnalytics />
                    </div>

                    {/* Security Command Center Controls */}
                    <div className="relative z-10 mb-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <div className="xl:col-span-2">
                            <SecurityControlsPanel />
                        </div>
                        <div className="h-full">
                            <SessionMonitoring metrics={sessionMetrics} />
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="relative z-10 space-y-8">
                        {/* Search & Filters */}
                        <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-6">
                            <SearchTableTools placeholder="Search security logs, users, or IP addresses..." />
                        </div>

                        {/* Security Events Table */}
                        <SecurityEventsTable />

                        {/* API Security Monitoring */}
                        <ApiKeyMonitoringTable />
                    </div>
                </div>
            </div>
        </div>
    )
}
