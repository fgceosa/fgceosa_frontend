'use client'

import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store'
import {
    fetchDashboardStats,
    fetchWorkspace,
    fetchCreditTransactions,
    fetchWorkspaceMembers,
    fetchWorkspaceRoles,
    fetchWorkspaces,
    addWorkspaceMember,
} from '@/store/slices/workspace/workspaceThunk'
import {
    selectDashboardStats,
    selectDashboardStatsLoading,
    selectCurrentWorkspace,
    selectWorkspaceRoles,
    selectOperationsLoading,
    selectWorkspaces,
    selectWorkspaceMembers,
    selectLastFetched,
    selectWorkspacesLoading,
} from '@/store/slices/workspace/workspaceSelectors'
import {
    selectOrganizationMembers,
} from '@/store/slices/organization/organizationSelectors'
import { fetchOrganizationTeam } from '@/store/slices/organization/organizationThunk'
import { Card, Button, Notification, toast } from '@/components/ui'
import {
    Building2,
    CheckCircle2,
    MessageSquare,
    Users,
    ChevronRight,
    Activity,
    Shield,
    Zap,
    Plus,
    Send,
} from 'lucide-react'
import { useOrganization } from '../layout'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import type { User } from '@/@types/auth'
import classNames from '@/utils/classNames'
import { extractErrorMessage } from '@/utils/errorUtils'
import { setCurrentWorkspace } from '@/store/slices/workspace'

import MemberStatsCards from '../../workspace/_components/MemberStatsCards'
import MemberUsageSummary from '../../workspace/_components/MemberUsageSummary'
import QuickActions from '../../workspace/_components/QuickActions'
import WorkspaceSwitcher from '../../workspace/_components/WorkspaceSwitcher'
import CreateWorkspaceDialog from '../../workspace/_components/CreateWorkspaceDialog'
import TopUpModal from '@/components/template/Topup/TopUpModal'
import ShareCreditsModal from './_components/ShareCreditsModal'
import InviteMemberDialog from '../../workspace/_components/InviteMemberDialog'
import type { Workspace } from '../../workspace/types'

import { apiListMyCopilots } from '@/services/CopilotService'
import type { Copilot } from '@/app/(protected-pages)/dashboard/copilot-hub/types'

function TrendingUpIcon(props: any) {
    return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
}

export default function OrgMemberDashboard() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { session } = useCurrentSession()
    const user = session?.user as any
    const { organizationId, organizationName, userRole } = useOrganization()

    const currentWorkspace = useAppSelector(selectCurrentWorkspace)
    const workspaces = useAppSelector(selectWorkspaces)
    const workspacesLoading = useAppSelector(selectWorkspacesLoading)
    const lastFetched = useAppSelector(selectLastFetched)
    const dashboardStats = useAppSelector(selectDashboardStats)
    const dashboardStatsLoading = useAppSelector(selectDashboardStatsLoading)
    const orgMembers = useAppSelector(selectOrganizationMembers)
    const roles = useAppSelector(selectWorkspaceRoles) || []
    const operationsLoading = useAppSelector(selectOperationsLoading)
    const workspaceMembers = useAppSelector(selectWorkspaceMembers)

    const [isShareCreditsOpen, setIsShareCreditsOpen] = useState(false)
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
    const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false)
    const [isTopUpOpen, setIsTopUpOpen] = useState(false)
    const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null)
    const [wsMembers, setWsMembers] = useState<any[]>([])
    const [copilots, setCopilots] = useState<Copilot[]>([])
    const [copilotsLoading, setCopilotsLoading] = useState(false)

    useEffect(() => {
        if (currentWorkspace?.id) {
            dispatch(fetchDashboardStats({ workspaceId: currentWorkspace.id, filterByUser: userRole === 'org_member' }))
            dispatch(fetchWorkspace(currentWorkspace.id))
            dispatch(fetchWorkspaceMembers({ workspaceId: currentWorkspace.id }))
        }
    }, [currentWorkspace?.id, dispatch, userRole])

    useEffect(() => {
        const fetchCopilots = async () => {
            setCopilotsLoading(true)
            try {
                const response = await apiListMyCopilots({ limit: 4 })
                setCopilots(response.copilots || [])
            } catch (err) {
                console.error('Failed to fetch copilots:', err)
            } finally {
                setCopilotsLoading(false)
            }
        }
        fetchCopilots()
    }, [])

    useEffect(() => {
        if (organizationId) {
            dispatch(fetchOrganizationTeam({ organizationId }))
        }
    }, [organizationId, dispatch])

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && !workspacesLoading) {
                dispatch(fetchWorkspaces())
            }
        }
        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
    }, [dispatch, workspacesLoading])

    useEffect(() => {
        if (!lastFetched && !workspacesLoading) {
            dispatch(fetchWorkspaces())
        }
    }, [dispatch, lastFetched, workspacesLoading])
    const handleShareCredits = (workspace: Workspace) => {
        setSelectedWorkspace(workspace)
        setIsShareCreditsOpen(true)
    }

    const handleAddMember = async (workspace: Workspace) => {
        setSelectedWorkspace(workspace)
        dispatch(fetchWorkspaceRoles(workspace.id))
        const response = await dispatch(fetchWorkspaceMembers({ workspaceId: workspace.id })).unwrap()
        setWsMembers(response.members || [])
        setIsAddMemberOpen(true)
    }

    const handleAddWorkspaceMember = async (data: {
        userId: string
        roles: string[]
        credits_to_allocate?: number
    }) => {
        if (!selectedWorkspace?.id) return

        try {
            await dispatch(
                addWorkspaceMember({
                    workspaceId: selectedWorkspace.id,
                    ...data,
                }),
            ).unwrap()

            toast.push(
                <Notification type="success" title="Success" duration={2000}>
                    Member added to workspace successfully
                </Notification>,
            )
            setIsAddMemberOpen(false)
            dispatch(fetchWorkspaces())
        } catch (err: any) {
            toast.push(
                <Notification type="danger" title="Error" duration={3000}>
                    {extractErrorMessage(err, 'Failed to add member to workspace')}
                </Notification>,
            )
        }
    }

    const eligibleMembers = orgMembers.filter(
        orgMember => !wsMembers.some(
            wsMember => wsMember.email.toLowerCase() === orgMember.email.toLowerCase()
        )
    )

    const recentActivity = [
        { id: '1', name: 'You', action: 'generated Monthly Report', time: '10 mins ago', icon: <Zap className="w-4 h-4" />, color: 'bg-blue-50 text-blue-600' },
        { id: '2', name: 'You', action: 'queried Customer Support Bot', time: '2 hours ago', icon: <MessageSquare className="w-4 h-4" />, color: 'bg-purple-50 text-purple-600' },
        { id: '3', name: 'System', action: 'processed your batch request', time: 'Yesterday', icon: <Activity className="w-4 h-4" />, color: 'bg-indigo-50 text-indigo-600' },
    ]

    const myMemberInfo = (workspaceMembers as any[]).find(m => m.userId === (user as any)?.id)
    const personalCredits = myMemberInfo?.creditsAllocated || 0

    if (!currentWorkspace) {
        return (
            <div className="max-w-[1400px] mx-auto p-8 flex flex-col items-center justify-center min-h-[50vh]">
                <Building2 className="w-16 h-16 text-gray-200 mb-6" />
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                    No Active Workspace
                </h3>
                <p className="text-gray-500 max-w-sm text-center mt-2 px-10">
                    You are not assigned to any workspace. Please contact your administrator.
                </p>
            </div>
        )
    }

    const getGreetingDetails = () => {
        const hour = new Date().getHours()
        const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'
        const Icon = hour < 12 || hour < 17
            ? () => <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
            : () => <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
        return { greeting, Icon }
    }

    const { greeting, Icon } = getGreetingDetails()

    return (
        <div className="max-w-[1400px] mx-auto p-4 sm:p-8 space-y-12 animate-in fade-in duration-700 overflow-x-hidden">
            {/* Greeting Header */}
            <div className="animate-in fade-in slide-in-from-top-4 duration-1000 delay-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 shrink-0 transition-transform hover:scale-105">
                            <Icon />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                                {greeting}, <span className="text-primary">{user?.userName || user?.name || 'User'}</span>
                            </h1>
                            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                                Welcome to your organization. Workspace activities and resources overview.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg shadow-gray-200/50 dark:shadow-none transition-all hover:border-primary/30 group">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <div className="flex flex-col">
                            <span className="text-[10px] sm:text-xs font-black text-gray-400 dark:text-gray-400 leading-none mb-1">Organization</span>
                            <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                {organizationName}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Header Section */}
            <div className="space-y-6">
                <Card className="rounded-3xl border-none bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-950/50 shadow-2xl shadow-gray-200/50 dark:shadow-none overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl transition-all group-hover:bg-primary/10" />

                    <div className="relative p-6 sm:p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-primary/10 dark:bg-primary/20 rounded-[2rem] border border-primary/20 dark:border-primary/30 shrink-0 shadow-lg shadow-primary/5">
                                    <Building2 className="w-8 h-8 text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-black text-gray-900 dark:text-gray-100 pl-1">Workspace Name:</span>
                                        <div className="flex items-center gap-3">
                                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                                {currentWorkspace.name}
                                            </h1>
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/30 font-black text-[8px]">VERIFIED</span>
                                    </div>
                                </div>
                            </div>

                            {/* Workspace Switcher */}
                            <div className="flex items-center gap-4">
                                <WorkspaceSwitcher
                                    workspaces={workspaces || []}
                                    currentWorkspace={currentWorkspace}
                                    onWorkspaceChange={(ws) => {
                                        dispatch(setCurrentWorkspace(ws))
                                        dispatch(fetchWorkspace(ws.id))
                                    }}
                                    onCreateNew={undefined}
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Quick Actions for Current Workspace */}
                {currentWorkspace && userRole !== 'org_member' && (
                    <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3 sm:gap-4 px-2">
                        <Button
                            variant="solid"
                            onClick={() => setIsTopUpOpen(true)}
                            className="w-full sm:w-auto h-14 px-6 sm:px-10 bg-primary hover:bg-primary-deep text-white font-black text-sm sm:text-xs rounded-[1.25rem] shadow-xl shadow-primary/20 transition-all sm:hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group"
                        >
                            <Plus className="w-5 h-5 sm:w-4 sm:h-4 group-hover:rotate-90 transition-transform duration-300" />
                            Top Up Credits
                        </Button>
                        <Button
                            variant="plain"
                            onClick={() => handleAddMember(currentWorkspace)}
                            className="w-full sm:w-auto h-14 px-6 sm:px-10 bg-white dark:bg-gray-900 text-gray-700 border border-gray-200 dark:border-gray-800 hover:border-primary/40 font-black text-sm sm:text-xs rounded-[1.25rem] shadow-lg shadow-gray-200/50 dark:shadow-none transition-all sm:hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group"
                        >
                            <Users className="w-5 h-5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
                            Add Member to Workspace
                        </Button>
                        <Button
                            variant="plain"
                            onClick={() => handleShareCredits(currentWorkspace)}
                            className="w-full sm:w-auto h-14 px-6 sm:px-10 bg-white dark:bg-gray-900 text-primary border border-primary/20 hover:border-primary/40 font-black text-sm sm:text-xs rounded-[1.25rem] shadow-lg shadow-gray-200/50 dark:shadow-none transition-all sm:hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group"
                        >
                            <Send className="w-5 h-5 sm:w-4 sm:h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            Share Credits
                        </Button>
                    </div>
                )}
            </div>

            {/* Quick Actions grid Component */}
            {userRole !== 'org_member' && (
                <div className="space-y-6">
                    <div className="flex items-center gap-4 px-2">
                        <h2 className="text-xs font-black text-gray-900 dark:text-gray-100">Quick Actions</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-gray-100 dark:from-gray-800 to-transparent"></div>
                    </div>
                    <QuickActions
                        onInvite={() => router.push('/organizations/team')}
                        onManageRoles={() => router.push('/organizations/roles-permissions')}
                        onCopilotHub={() => router.push('/dashboard/copilot-hub')}
                    />
                </div>
            )}

            {/* Metrics Cards */}
            <MemberStatsCards
                stats={dashboardStats}
                isLoading={dashboardStatsLoading}
                personalMode={userRole === 'org_member'}
                personalCredits={personalCredits}
                totalMembers={userRole !== 'org_member' ? workspaceMembers.length : undefined}
            />

            {/* Usage & Copilots */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Usage Summary (8) */}
                <div className="lg:col-span-8">
                    <MemberUsageSummary
                        tokensUsed={dashboardStats?.tokensUsedThisMonth}
                        totalRequests={dashboardStats?.totalApiCalls}
                        isLoading={dashboardStatsLoading}
                    />
                </div>
                {/* Copilot Activity (4) */}
                <div className="lg:col-span-4">
                    <Card className="rounded-[2.5rem] border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-8 h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                                My Copilots
                            </h3>
                        </div>
                        <div className="space-y-6">
                            {copilotsLoading ? (
                                <div className="space-y-4 animate-pulse">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800" />
                                            <div className="space-y-2 flex-1">
                                                <div className="h-2.5 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
                                                <div className="h-2 w-16 bg-gray-100 dark:bg-gray-800 rounded" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : copilots.length > 0 ? (
                                copilots.map((copilot) => (
                                    <div key={copilot.id} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className={classNames(
                                                "w-8 h-8 rounded-lg flex items-center justify-center border",
                                                copilot.category === 'sales' ? "bg-emerald-50 text-emerald-600" :
                                                    copilot.category === 'customer-support' ? "bg-blue-50 text-blue-600" :
                                                        "bg-indigo-50 text-indigo-600"
                                            )}>
                                                {copilot.category === 'sales' ? <TrendingUpIcon className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                                            </div>
                                            <div className="space-y-0.5">
                                                <span className="text-xs font-black text-gray-900 dark:text-white tracking-tight group-hover:text-primary transition-colors cursor-pointer line-clamp-1">
                                                    {copilot.name}
                                                </span>
                                                <p className="text-[10px] font-bold text-gray-700 dark:text-gray-300">
                                                    {copilot.model}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            size="xs"
                                            variant="plain"
                                            className="text-[10px] font-black text-primary hover:bg-primary/5"
                                            onClick={() => router.push(`/dashboard/copilot-hub/chat/${copilot.id}`)}
                                        >
                                            Open
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-xs text-gray-500">No copilots found</p>
                                    <Button
                                        size="xs"
                                        variant="plain"
                                        className="mt-2 text-[10px]"
                                        onClick={() => router.push('/dashboard/copilot-hub')}
                                    >
                                        Explore Hub
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 gap-8 pb-10">
                <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 p-6 sm:p-10 overflow-hidden relative">
                    {/* Background Decorative Element */}
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                        <Activity className="w-32 h-32" />
                    </div>

                    <div className="flex items-center justify-between mb-8 sm:mb-12 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-primary rounded-full hidden sm:block" />
                            <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                                Workspace Timeline
                            </h3>
                        </div>
                        <div className="px-4 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-100 dark:border-emerald-800/30">
                            <span className="text-xs font-black text-emerald-600">Active Monitoring</span>
                        </div>
                    </div>

                    <div className="space-y-0 relative z-10">
                        {(!dashboardStats?.recentRequests || dashboardStats.recentRequests.length === 0) ? (
                            <div className="text-center py-6 text-gray-500 text-xs">No recent activity found.</div>
                        ) : (
                            dashboardStats.recentRequests.map((request, index) => (
                                <div
                                    key={request.id}
                                    className="group relative flex items-start gap-6"
                                >
                                    {/* Timeline Line */}
                                    {index !== dashboardStats.recentRequests!.length - 1 && (
                                        <div className="absolute left-[21px] top-12 bottom-0 w-px bg-gradient-to-b from-gray-100 to-transparent dark:from-gray-800" />
                                    )}

                                    {/* Icon Container */}
                                    <div className={classNames(
                                        "relative z-10 w-11 h-11 shrink-0 flex items-center justify-center rounded-2xl border-2 border-white dark:border-gray-900 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
                                        "bg-blue-50 text-blue-600"
                                    )}>
                                        <Zap className="w-4 h-4" />
                                    </div>

                                    {/* Content */}
                                    <div className={classNames(
                                        "flex-1 pb-10 transition-all duration-300",
                                        index !== dashboardStats.recentRequests!.length - 1 && "border-b border-gray-50 dark:border-gray-800/50"
                                    )}>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                            <div className="flex-1">
                                                <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                                                    <span className="font-black text-gray-950 dark:text-gray-100">You</span> asked Copilot: "{request.description || 'Processed request'}"
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <span className="text-xs font-black text-gray-900 dark:text-gray-100 whitespace-nowrap px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                                                    {dayjs(request.created_at).fromNow()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Sub-info */}
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 rounded-md bg-primary/5 text-[9px] font-black text-primary border border-primary/10">
                                                {request.tokens} TOKENS USED
                                            </span>
                                            {request.amount > 0 && (
                                                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-[9px] font-black text-amber-600 border border-amber-100">
                                                    {request.amount} CREDITS
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>

            {/* Dialogs and Modals */}
            <CreateWorkspaceDialog
                isOpen={isCreateWorkspaceOpen}
                onClose={() => setIsCreateWorkspaceOpen(false)}
            />
            {currentWorkspace && (
                <>
                    <TopUpModal
                        isOpen={isTopUpOpen}
                        onClose={() => setIsTopUpOpen(false)}
                        workspaceId={currentWorkspace.id}
                        organizationId={organizationId || undefined}
                    />
                    <ShareCreditsModal
                        isOpen={isShareCreditsOpen}
                        onClose={() => setIsShareCreditsOpen(false)}
                        workspace={currentWorkspace}
                    />
                    <InviteMemberDialog
                        isOpen={isAddMemberOpen}
                        onClose={() => setIsAddMemberOpen(false)}
                        onInvite={handleAddWorkspaceMember}
                        roles={roles}
                        eligibleMembers={eligibleMembers}
                        workspaceName={currentWorkspace?.name}
                        isLoading={operationsLoading}
                    />
                </>
            )}
        </div>
    )
}
