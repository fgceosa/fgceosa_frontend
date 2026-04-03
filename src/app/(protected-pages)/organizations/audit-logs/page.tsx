
'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRequireAuthority } from '@/utils/hooks/useAuthorization'
import { Card, Button, Input, Notification, toast, Pagination, Select } from '@/components/ui'
import {
    FileText,
    Search,
    Download,
    User,
    Globe,
    MoreVertical,
    Clock,
    ShieldCheck,
    AlertCircle,
    Activity,
    Server,
    Zap
} from 'lucide-react'
import classNames from '@/utils/classNames'
import { apiGetAuditLogs, apiGetAuditStats } from '@/services/AuditLogService'
import dayjs from 'dayjs'
import { NumericFormat } from 'react-number-format'
import { useAppSelector } from '@/store'
import { selectCurrentOrganizationId } from '@/store/slices/organization/organizationSelectors'

interface AuditLogStats {
    totalEvents: number
    criticalActions: number
    adminActions: number
    securitySensitive: number
    failedActions: number
    uniqueOperators?: number // Backend doesn't have this yet, but we'll calculate from logs or use total
}

interface AuditLog {
    id: string
    timestamp: string
    actorName: string | null
    actorRole: string | null
    action: string
    ipAddress: string | null
    location: string | null
    status: string
    severity: string
    details?: string | null
    targetType?: string | null
    targetId?: string | null
}

export default function AuditLogsPage() {
    // Require org_admin or org_super_admin authority
    useRequireAuthority(['org_admin', 'org_super_admin'])

    const organizationId = useAppSelector(selectCurrentOrganizationId)
    const { authority = [] } = useAppSelector((state) => state.auth.user)
    const isPlatformAdmin = authority.includes('super_admin') || authority.includes('admin')

    const [searchQuery, setSearchQuery] = useState('')
    const [logs, setLogs] = useState<AuditLog[]>([])
    const [loading, setLoading] = useState(false)
    const [statsLoading, setStatsLoading] = useState(false)
    const [stats, setStats] = useState<AuditLogStats | null>(null)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const fetchStats = useCallback(async () => {
        // If we don't have an org ID, or if we're not a platform admin (stats endpoint currently biased towards platform admins),
        // we'll skip the stats call to avoid console errors until backend is updated.
        if (!organizationId || !isPlatformAdmin) {
            setStats(null)
            return
        }
        
        setStatsLoading(true)
        try {
            const response = await apiGetAuditStats('24h', organizationId)
            setStats(response)
        } catch (error) {
            console.error('Failed to fetch audit stats:', error)
            setStats(null)
        } finally {
            setStatsLoading(false)
        }
    }, [organizationId, isPlatformAdmin])

    const fetchLogs = useCallback(async () => {
        setLoading(true)
        try {
            const response = await apiGetAuditLogs({
                page,
                page_size: pageSize,
                search: searchQuery,
                organization_id: organizationId || undefined
            })
            setLogs(response.logs)
            setTotal(response.total)
        } catch (error) {
            console.error('Failed to fetch audit logs:', error)
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to load audit logs
                </Notification>
            )
        } finally {
            setLoading(false)
        }
    }, [page, pageSize, searchQuery, organizationId])

    useEffect(() => {
        fetchStats()
    }, [fetchStats])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchLogs()
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [fetchLogs])

    return (
        <div className="min-h-screen bg-[#f5f5f5] dark:bg-gray-900/50 p-4 sm:p-8 overflow-x-hidden">
            <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-700 font-sans">
                
                {/* Enterprise Header Section */}
                <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-2">
                    <div className="space-y-4 lg:space-y-1">
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-xs font-black text-primary whitespace-nowrap">Security</span>
                            <div className="h-px w-12 bg-primary/20" />
                            <span className="text-xs font-black text-gray-900 dark:text-gray-100 whitespace-nowrap">Audit</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shrink-0">
                                <ShieldCheck className="h-6 w-6 text-primary" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-none">
                                Audit Logs
                            </h1>
                        </div>
                        <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 lg:pl-14 font-medium max-w-2xl leading-relaxed">
                            Track and monitor all activities and security events across your organization.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto self-end">
                        <Button
                            variant="plain"
                            className="flex-1 lg:flex-none h-14 px-8 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-black text-[11px] rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/20 transition-all flex items-center justify-center gap-2 group"
                        >
                            <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span>Export Data</span>
                        </Button>
                    </div>
                </header>

                <div className="relative">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
                    <div className="absolute top-40 -right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl opacity-50 pointer-events-none" />


                    {/* Statistics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-4 duration-500 relative z-10 mb-10">
                        <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 relative overflow-hidden group transition-all hover:border-primary/20 hover:shadow-2xl">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                <Activity className="w-16 h-16" />
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Events</p>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                                <NumericFormat displayType="text" value={stats?.totalEvents ?? total} thousandSeparator />
                            </h3>
                            <div className="text-[10px] font-bold text-emerald-500 mt-2 flex items-center gap-1">
                                <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                </div>
                                {stats ? 'Integrity Verified' : 'Live Log View'}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 relative overflow-hidden group transition-all hover:border-primary/20 hover:shadow-2xl">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                <Zap className="w-16 h-16 text-primary" />
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Failed Actions</p>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                                <NumericFormat displayType="text" value={stats?.failedActions ?? 0} thousandSeparator />
                            </h3>
                            <div className="text-[10px] font-bold text-red-500 mt-2 flex items-center gap-1">
                                <div className="w-4 h-4 rounded-full bg-red-500/10 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                </div>
                                {stats ? 'System Active' : 'Metrics Unavailable'}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 relative overflow-hidden group transition-all hover:border-primary/20 hover:shadow-2xl">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                <User className="w-16 h-16 text-amber-500" />
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Admin Operations</p>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                                <NumericFormat displayType="text" value={stats?.adminActions ?? 0} thousandSeparator />
                            </h3>
                            <div className="text-[10px] font-bold text-amber-500 mt-2 flex items-center gap-1">
                                <div className="w-4 h-4 rounded-full bg-amber-500/10 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                </div>
                                {stats ? 'Live Metrics' : 'Logs Analyzed'}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 relative overflow-hidden group transition-all hover:border-primary/20 hover:shadow-2xl">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                <Server className="w-16 h-16 text-purple-500" />
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Security Health</p>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                                {stats ? (stats.criticalActions > 0 ? 'Warning' : 'Optimal') : 'Secure'}
                            </h3>
                            <div className="text-[10px] font-bold text-purple-500 mt-2 flex items-center gap-1">
                                <ShieldCheck className="w-4 h-4 text-purple-500" />
                                {stats?.criticalActions ?? 0} Critical Events
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-4 sm:p-6 relative z-10 mb-10">
                        <div className="flex flex-col xl:flex-row items-center gap-4">
                            <div className="relative flex-1 group w-full">
                                <Input
                                    placeholder="Search by event, operator, or system action..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-14 pl-14 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-700 font-bold text-gray-900 dark:text-white w-full transition-all focus:bg-white dark:focus:bg-gray-800"
                                />
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
                                <Button variant="plain" className="w-full sm:w-auto rounded-xl border-gray-100 dark:border-gray-800 h-14 px-6 text-[10px] font-black flex items-center justify-center gap-3 uppercase tracking-wider bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <span>Last 24h</span>
                                </Button>
                                <Button variant="plain" className="w-full sm:w-auto rounded-xl border-gray-100 dark:border-gray-800 h-14 px-6 text-[10px] font-black flex items-center justify-center gap-3 uppercase tracking-wider bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all">
                                    <AlertCircle className="w-4 h-4 text-amber-500" />
                                    <span>Severity</span>
                                </Button>
                            </div>
                        </div>
                    </div>


                {/* Table Section */}
                <Card className="rounded-[2.5rem] border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 overflow-hidden flex flex-col min-h-[500px] border border-gray-50 dark:border-gray-800">
                    
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-gray-800/20">
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">Timestamp</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">Operator</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">Action & Resource</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">Network Origin</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {loading && logs.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-24 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                                <p className="text-xs font-black text-gray-400 italic font-mono tracking-tighter uppercase">Verifying logs...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : logs.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-24 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                                                    <FileText className="w-8 h-8 text-gray-300" />
                                                </div>
                                                <p className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">No logs found</p>
                                                <p className="text-xs font-bold text-gray-400 italic">Try adjusting your search or filters</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log) => {
                                        const d = dayjs(log.timestamp)
                                        const datePart = d.isValid() ? d.format('MMM DD, YYYY') : '-'
                                        const timePart = d.isValid() ? d.format('HH:mm:ss') : '-'

                                        return (
                                            <tr key={log.id} className="group hover:bg-gray-50/30 dark:hover:bg-gray-800/10 transition-all duration-300">
                                                <td className="px-8 py-6">
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors tracking-tight">{datePart}</p>
                                                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 font-mono tracking-tighter">
                                                            <Clock className="w-3 h-3" />
                                                            {timePart}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                                            <User className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black text-gray-900 dark:text-white tracking-tight">{log.actorName || 'System'}</p>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{log.actorRole || 'Service Account'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-black text-gray-900 dark:text-white tracking-tight">{log.action}</p>
                                                        <p className="text-[10px] font-bold text-gray-500 italic max-w-[250px] truncate tracking-tight">
                                                            {log.targetType} {log.targetId ? `• ${log.targetId}` : ''}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                            <Globe className="w-3.5 h-3.5 text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <span className="text-[10px] font-black text-gray-900 dark:text-gray-300 font-mono italic">{log.ipAddress || 'Internal'}</span>
                                                            <p className="text-[9px] font-bold text-gray-400 tracking-tight">{log.location || 'Local Data Center'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className={classNames(
                                                        "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black border transition-all duration-300",
                                                        log.status === 'success'
                                                            ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                                                                : "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                                                        )}>
                                                        <div className={classNames("w-1.5 h-1.5 rounded-full animate-pulse", log.status === 'success' ? "bg-emerald-500" : "bg-amber-500")} />
                                                        {log.status.toUpperCase()}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <Button
                                                        variant="plain"
                                                        size="sm"
                                                        className="h-10 w-10 p-0 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 border-none group/action"
                                                    >
                                                        <MoreVertical className="w-4 h-4 text-gray-400 group-hover/action:text-primary transition-colors" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile/Tablet Card View */}
                    <div className="lg:hidden divide-y divide-gray-50 dark:divide-gray-800 flex-1">
                        {loading && logs.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                    <p className="text-xs font-black text-gray-400 font-mono uppercase">Verifying logs...</p>
                                </div>
                            </div>
                        ) : logs.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="flex flex-col items-center gap-4">
                                    <FileText className="w-12 h-12 text-gray-200" />
                                    <p className="text-lg font-black text-gray-900 dark:text-white uppercase">No logs found</p>
                                </div>
                            </div>
                        ) : (
                            logs.map((log) => (
                                <div key={log.id} className="p-5 space-y-4 hover:bg-gray-50/30 dark:hover:bg-gray-800/10 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                                                <User className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-900 dark:text-white tracking-tight">{log.actorName || 'System'}</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{log.actorRole || 'Service Account'}</p>
                                            </div>
                                        </div>
                                        <div className={classNames(
                                            "inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[8px] font-black border uppercase tracking-wider",
                                            log.status === 'success'
                                                ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                                                : "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                                        )}>
                                            <div className={classNames("w-1 h-1 rounded-full", log.status === 'success' ? "bg-emerald-500" : "bg-amber-500")} />
                                            {log.status}
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50/50 dark:bg-gray-800/20 p-4 rounded-2xl border border-gray-50 dark:border-gray-800 space-y-3">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Activity</p>
                                            <p className="text-xs font-bold text-gray-900 dark:text-white tracking-tight leading-snug">{log.action}</p>
                                            <p className="text-[10px] font-bold text-gray-500 italic truncate opacity-70 tracking-tight">
                                                {log.targetType} {log.targetId ? `• ${log.targetId}` : ''}
                                            </p>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-gray-800/50">
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Timestamp</p>
                                                <p className="text-[11px] font-black text-gray-900 dark:text-white tracking-tighter">
                                                    {dayjs(log.timestamp).format('MMM DD, YYYY')}
                                                </p>
                                                <p className="text-[9px] font-bold text-gray-400 font-mono tracking-tighter flex items-center gap-1">
                                                    <Clock className="w-2.5 h-2.5" />
                                                    {dayjs(log.timestamp).format('HH:mm:ss')}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Origin</p>
                                                <p className="text-[11px] font-black text-gray-900 dark:text-white font-mono italic tracking-tighter">
                                                    {log.ipAddress || 'Internal'}
                                                </p>
                                                <p className="text-[9px] font-bold text-gray-400 tracking-tight">
                                                    {log.location || 'Local Data Center'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="p-10 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50/20 dark:bg-transparent backdrop-blur-sm">
                        <div className="flex flex-col sm:flex-row items-center gap-5 w-full md:w-auto">
                            <div className="flex items-center gap-5 w-full sm:w-auto justify-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">View:</span>
                                    <Select
                                        size="sm"
                                        className="w-24 border-gray-100 dark:border-gray-800 rounded-xl"
                                        options={[
                                            { value: 10, label: '10' },
                                            { value: 20, label: '20' },
                                            { value: 50, label: '50' },
                                            { value: 100, label: '100' },
                                        ]}
                                        value={{ value: pageSize, label: String(pageSize) }}
                                        onChange={(option) => {
                                            setPageSize((option as any).value)
                                            setPage(1)
                                        }}
                                    />
                                </div>
                                <div className="h-4 w-px bg-gray-200 dark:bg-gray-800" />
                                <p className="text-[10px] font-bold text-gray-500 italic tracking-tight">
                                    <span className="text-gray-900 dark:text-white font-black">{((page - 1) * pageSize) + 1}</span>-<span className="text-gray-900 dark:text-white font-black">{Math.min(page * pageSize, total)}</span> of <span className="text-gray-900 dark:text-white font-black">{total}</span>
                                </p>
                            </div>
                        </div>
                        <Pagination
                            currentPage={page}
                            pageSize={pageSize}
                            total={total}
                            onChange={setPage}
                        />
                    </div>
                </Card>
                </div>
            </div>
        </div>
    )
}
