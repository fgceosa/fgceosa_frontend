'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store'
import { useRequireAuthority } from '@/utils/hooks/useAuthorization'
import { fetchUsageReport, exportUsageReport } from '@/store/slices/workspace/workspaceThunk'
import {
    selectUsageReport,
    selectUsageReportLoading,
    selectOperationsLoading,
    selectWorkspaceError,
} from '@/store/slices/workspace/workspaceSelectors'
import { Button, Card, Notification, toast, Spinner, Table } from '@/components/ui'
import QorebitLoading from '@/components/shared/QorebitLoading'
import { ArrowLeft, Download, TrendingUp, Activity, Zap, Users } from 'lucide-react'
import WorkspacePageLayout from '../../_components/WorkspacePageLayout'
import WorkspaceHeader from '../../_components/WorkspaceHeader'
import classNames from '@/utils/classNames'
import type { UsageReportParams } from '@/services/workspace/workspaceService'

const { Tr, Th, Td, THead, TBody } = Table

export default function WorkspaceUsagePage() {
    const params = useParams()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const workspaceId = params.workspaceId as string

    // Require org_super_admin authority
    const hasAuthority = useRequireAuthority(['org_super_admin'])

    const usageReport = useAppSelector(selectUsageReport)
    const usageReportLoading = useAppSelector(selectUsageReportLoading)
    const operationsLoading = useAppSelector(selectOperationsLoading)
    const error = useAppSelector(selectWorkspaceError)

    const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'custom'>('month')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    // Fetch usage report on mount and when period changes
    useEffect(() => {
        if (workspaceId) {
            const params: UsageReportParams = {
                workspaceId,
                period,
            }

            if (period === 'custom' && startDate && endDate) {
                params.startDate = startDate
                params.endDate = endDate
            }

            dispatch(fetchUsageReport(params))
        }
    }, [workspaceId, period, startDate, endDate, dispatch])

    // Show error notification
    useEffect(() => {
        if (error) {
            toast.push(
                <Notification type="danger" duration={3000}>
                    {error}
                </Notification>,
            )
        }
    }, [error])

    const handleExportReport = async () => {
        try {
            const params: UsageReportParams = {
                workspaceId,
                period,
            }

            if (period === 'custom' && startDate && endDate) {
                params.startDate = startDate
                params.endDate = endDate
            }

            await dispatch(exportUsageReport(params)).unwrap()

            toast.push(
                <Notification type="success" duration={2000}>
                    Usage report exported successfully
                </Notification>,
            )
        } catch (err: any) {
            toast.push(
                <Notification type="danger" duration={3000}>
                    {err || 'Failed to export usage report'}
                </Notification>,
            )
        }
    }

    if (usageReportLoading && !usageReport) {
        return <QorebitLoading />
    }

    return (
        <div className="min-h-full bg-[#f5f5f5] dark:bg-gray-950/50">
            <WorkspacePageLayout
                fullWidth={true}
                header={
                    <WorkspaceHeader
                        title="Workspace Activity"
                        description="See how your workspace is using AI resources."
                        icon={Activity}
                        iconBgClass="bg-gradient-to-br from-indigo-500 to-purple-600"
                        tag="Usage Analytics"
                        actions={
                            <Button
                                variant="solid"
                                onClick={handleExportReport}
                                loading={operationsLoading}
                                className="h-14 px-8 bg-primary hover:bg-primary-deep text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 group w-full lg:w-auto"
                            >
                                <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                                Export Analytics
                            </Button>
                        }
                    />
                }
            >
                {/* Period Selector - Refined Card with Margin Fix */}
                <div className="relative mb-10">
                    <Card className="p-8 border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end">
                            <div className="md:col-span-1 space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Analysis Period</label>
                                <div className="relative group">
                                    <select
                                        value={period}
                                        onChange={(e) =>
                                            setPeriod(e.target.value as 'day' | 'week' | 'month' | 'custom')
                                        }
                                        className="w-full h-12 px-5 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary/10 appearance-none cursor-pointer transition-all uppercase tracking-widest group-hover:bg-white dark:group-hover:bg-gray-800"
                                    >
                                        <option value="day">Past 24 Hours</option>
                                        <option value="week">Past Week</option>
                                        <option value="month">Past Month</option>
                                        <option value="custom">Custom Range</option>
                                    </select>
                                    <Activity className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-primary transition-colors" />
                                </div>
                            </div>

                            {period === 'custom' && (
                                <>
                                    <div className="space-y-3 animate-in fade-in slide-in-from-left-2 duration-300">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Start Date</label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full h-12 px-5 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all focus:bg-white dark:focus:bg-gray-900"
                                        />
                                    </div>
                                    <div className="space-y-3 animate-in fade-in slide-in-from-left-2 duration-300">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">End Date</label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full h-12 px-5 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all focus:bg-white dark:focus:bg-gray-900"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </Card>
                </div>

                {usageReport && (
                    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-1000 transition-all">
                        {/* Summary Stats - Premium Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 mb-10">
                            {[
                                { title: 'Credits Spent', value: usageReport?.totalCreditsConsumed?.toFixed(2) || '0.00', icon: Zap, color: 'emerald', subtext: 'Total Usage' },
                                { title: 'AI Requests', value: usageReport?.totalApiCalls?.toLocaleString() || '0', icon: Activity, color: 'blue', subtext: 'Interactions' },
                                { title: 'Tokens Used', value: usageReport?.totalTokens?.toLocaleString() || '0', icon: TrendingUp, color: 'purple', subtext: 'Context units' },
                                { title: 'Active Team', value: usageReport?.perMemberUsage?.length || 0, icon: Users, color: 'orange', subtext: 'Operatives' }
                            ].map((stat) => (
                                <Card key={stat.title} className="p-6 border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 group transition-all hover:scale-[1.02]">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={classNames(
                                            "w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 shadow-sm",
                                            stat.color === 'emerald' && "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400",
                                            stat.color === 'blue' && "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400",
                                            stat.color === 'purple' && "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800 text-purple-600 dark:text-purple-400",
                                            stat.color === 'orange' && "bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800 text-orange-600 dark:text-orange-400"
                                        )}>
                                            <stat.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.subtext}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.title}</p>
                                        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-none">{stat.value}</h2>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Breakdown Tables - Modern Layout */}
                        <div className="grid grid-cols-1 gap-10">
                            {/* Usage by Member */}
                            <Card className="p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 relative z-10">
                                <div className="p-5 sm:p-8 border-b border-gray-50 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/30 dark:bg-gray-800/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                                            <Users className="w-4 h-4 text-orange-600" />
                                        </div>
                                        <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Activity by Person</h3>
                                        <span className="px-2.5 py-1 bg-white dark:bg-gray-800 rounded-lg text-[10px] font-black text-primary border border-gray-100 dark:border-gray-700 shadow-sm uppercase tracking-widest">
                                            {usageReport?.perMemberUsage?.length || 0} PEOPLE
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <THead>
                                            <Tr className="bg-gray-50/50 dark:bg-gray-800/30 border-none">
                                                <Th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Operative</Th>
                                                <Th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Identifier</Th>
                                                <Th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Credits</Th>
                                                <Th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Requests</Th>
                                                <Th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Tokens</Th>
                                            </Tr>
                                        </THead>
                                        <TBody>
                                            {usageReport?.perMemberUsage?.map((member) => (
                                                <Tr key={member.memberId} className="border-t border-gray-100 dark:border-gray-800/50 hover:bg-gray-50/30 dark:hover:bg-gray-800/30 transition-colors group">
                                                    <Td className="p-6 font-black text-sm text-gray-900 dark:text-white uppercase tracking-tight italic">{member.memberName}</Td>
                                                    <Td className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{member.memberEmail}</Td>
                                                    <Td className="p-6 text-right font-black text-sm text-emerald-500">
                                                        {member.creditsUsed ? member.creditsUsed.toFixed(2) : '0.00'}
                                                    </Td>
                                                    <Td className="p-6 text-right font-bold text-sm text-gray-900 dark:text-white">
                                                        {member.apiCalls ? member.apiCalls.toLocaleString() : '0'}
                                                    </Td>
                                                    <Td className="p-6 text-right font-bold text-sm text-gray-900 dark:text-white">
                                                        {member.tokens ? member.tokens.toLocaleString() : '0'}
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </TBody>
                                    </Table>
                                </div>
                            </Card>

                            {/* Usage by Project */}
                            <Card className="p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 relative z-10">
                                <div className="p-5 sm:p-8 border-b border-gray-50 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/30 dark:bg-gray-800/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                            <Zap className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Activity by Project</h3>
                                        <span className="px-2.5 py-1 bg-white dark:bg-gray-800 rounded-lg text-[10px] font-black text-primary border border-gray-100 dark:border-gray-700 shadow-sm uppercase tracking-widest">
                                            {usageReport?.perProjectUsage?.length || 0} PROJECTS
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <THead>
                                            <Tr className="bg-gray-50/50 dark:bg-gray-800/30 border-none">
                                                <Th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Project Name</Th>
                                                <Th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Credits</Th>
                                                <Th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Requests</Th>
                                                <Th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Tokens</Th>
                                            </Tr>
                                        </THead>
                                        <TBody>
                                            {usageReport?.perProjectUsage?.map((project) => (
                                                <Tr key={project.projectId} className="border-t border-gray-100 dark:border-gray-800/50 hover:bg-gray-50/30 dark:hover:bg-gray-800/30 transition-colors group">
                                                    <Td className="p-6 font-black text-sm text-gray-900 dark:text-white uppercase tracking-tight italic">{project.projectName}</Td>
                                                    <Td className="p-6 text-right font-black text-sm text-emerald-500">
                                                        {project.creditsUsed ? project.creditsUsed.toFixed(2) : '0.00'}
                                                    </Td>
                                                    <Td className="p-6 text-right font-bold text-sm text-gray-900 dark:text-white">
                                                        {project.apiCalls ? project.apiCalls.toLocaleString() : '0'}
                                                    </Td>
                                                    <Td className="p-6 text-right font-bold text-sm text-gray-900 dark:text-white">
                                                        {project.tokens ? project.tokens.toLocaleString() : '0'}
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </TBody>
                                    </Table>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </WorkspacePageLayout>
        </div>
    )
}
