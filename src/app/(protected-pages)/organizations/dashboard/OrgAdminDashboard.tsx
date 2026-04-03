'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store'
import {
    fetchWorkspaces,
} from '@/store/slices/workspace/workspaceThunk'
import {
    fetchOrganizationTeam,
    fetchOrganizationUsageSummary,
    fetchOrganizationActivity
} from '@/store/slices/organization/organizationThunk'
import {
    selectWorkspaces,
    selectCurrentWorkspace,
    selectWorkspacesLoading,
    selectLastFetched,
    selectWorkspaceRoles,
    selectOperationsLoading,
    selectDashboardStats,
    selectDashboardStatsLoading,
    selectWorkspaceMembers,
} from '@/store/slices/workspace/workspaceSelectors'
import {
    selectOrganizationMembers,
    selectOrganizationUsageSummary,
    selectOrganizationUsageLoading
} from '@/store/slices/organization/organizationSelectors'
import { Card, Button } from '@/components/ui'
import {
    Building2,
    CheckCircle2,
    Plus,
    Users,
    Send,
} from 'lucide-react'
import { useOrganization } from '../layout'
import useCurrentSession from '@/utils/hooks/useCurrentSession'

import AdminStatsCards from './_components/AdminStatsCards'
import AdminUsageSummary from './_components/AdminUsageSummary'
import TeamActivitySnapshot from './_components/TeamActivitySnapshot'
import CopilotOperations from './_components/CopilotOperations'
import ShareCreditsModal from './_components/ShareCreditsModal'
import InviteMemberDialog from '../../workspace/_components/InviteMemberDialog'
import WorkspaceSwitcher from '../../workspace/_components/WorkspaceSwitcher'
import CreateWorkspaceDialog from '../../workspace/_components/CreateWorkspaceDialog'
import QuickActions from '../../workspace/_components/QuickActions'
import {
    fetchWorkspaceRoles,
    addWorkspaceMember,
    fetchWorkspaceMembers,
    fetchDashboardStats,
} from '@/store/slices/workspace/workspaceThunk'
import { setCurrentWorkspace, fetchWorkspace } from '@/store/slices/workspace'
import {
    Notification,
    toast,
} from '@/components/ui'
import { extractErrorMessage } from '@/utils/errorUtils'
import TopUpModal from '@/components/template/Topup/TopUpModal'
import type { Workspace } from '../../workspace/types'

export default function OrgAdminDashboard() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { session } = useCurrentSession()
    const user = session?.user as any
    const { organizationId, organizationName, userRole } = useOrganization()

    // Selectors
    const workspaces = useAppSelector(selectWorkspaces) || []
    const currentWorkspace = useAppSelector(selectCurrentWorkspace)
    const workspacesLoading = useAppSelector(selectWorkspacesLoading)
    const lastFetched = useAppSelector(selectLastFetched)

    const orgMembers = useAppSelector(selectOrganizationMembers)
    const usageSummary = useAppSelector(selectOrganizationUsageSummary)
    const usageLoading = useAppSelector(selectOrganizationUsageLoading)
    const roles = useAppSelector(selectWorkspaceRoles) || []
    const operationsLoading = useAppSelector(selectOperationsLoading)
    const dashboardStats = useAppSelector(selectDashboardStats)
    const dashboardStatsLoading = useAppSelector(selectDashboardStatsLoading)
    const workspaceMembers = useAppSelector(selectWorkspaceMembers)

    const [isShareCreditsOpen, setIsShareCreditsOpen] = React.useState(false)
    const [isAddMemberOpen, setIsAddMemberOpen] = React.useState(false)
    const [selectedWorkspace, setSelectedWorkspace] = React.useState<Workspace | null>(null)
    const [wsMembers, setWsMembers] = React.useState<any[]>([])
    const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = React.useState(false)
    const [isTopUpOpen, setIsTopUpOpen] = React.useState(false)

    // Derived Data
    const workspacesCount = workspaces.length
    const activeMembersCount = orgMembers?.filter((m: any) => m.status === 'active').length || 0
    const totalUsage = usageSummary?.totalUsage || 0

    // Convert array to map for list
    const usageMap: Record<string, number> = {}
    if (usageSummary?.workspacesUsage) {
        usageSummary.workspacesUsage.forEach((w: any) => {
            usageMap[w.workspaceId] = w.totalUsage
        })
    }

    // Trending Calculations
    const calculateTrend = (data: any[], key: string) => {
        if (!data || data.length < 2) return undefined
        const current = data[data.length - 1][key] || 0
        const previous = data[data.length - 2][key] || 0
        if (previous === 0) return current > 0 ? { value: '100%', isUp: true } : undefined
        const diff = ((current - previous) / previous) * 100
        return {
            value: `${Math.abs(Math.round(diff))}%`,
            isUp: diff >= 0
        }
    }

    const requestsTrend = calculateTrend(usageSummary?.dailyUsage || [], 'requests')
    const usageTrend = calculateTrend(usageSummary?.dailyUsage || [], 'tokens')

    // Top Workspace
    const topWorkspace = (usageSummary?.workspacesUsage?.length || 0) > 0
        ? usageSummary!.workspacesUsage.reduce((prev: any, current: any) => (prev.totalUsage > current.totalUsage) ? prev : current)
        : null

    useEffect(() => {
        // Fetch Workspaces list if not already loaded
        if (!lastFetched && !workspacesLoading) {
            dispatch(fetchWorkspaces())
        }
    }, [dispatch, lastFetched, workspacesLoading])

    useEffect(() => {
        // Only fetch if we have a valid session AND valid organizationId
        if (!session || !user) {
            console.log('[OrgAdminDashboard] Waiting for session to be ready...')
            return
        }

        // Only fetch if organizationId is valid (not null, undefined, or 'null' string)
        if (organizationId &&
            organizationId !== 'null' &&
            organizationId !== 'undefined' &&
            organizationId.length > 0) {

            console.log('[OrgAdminDashboard] Fetching organization data for:', {
                organizationId,
                organizationName,
                userRole,
                userId: user?.id
            })

            // Fetch organization team
            dispatch(fetchOrganizationTeam({ organizationId }))
                .unwrap()
                .then(() => {
                    console.log('[OrgAdminDashboard] Successfully fetched organization team')
                })
                .catch((error) => {
                    console.error('[OrgAdminDashboard] Error fetching organization team:', {
                        error,
                        organizationId,
                        message: error?.message,
                        response: error?.response
                    })
                })

            // Fetch organization usage summary
            dispatch(fetchOrganizationUsageSummary({ organizationId }))
                .unwrap()
                .then(() => {
                    console.log('[OrgAdminDashboard] Successfully fetched usage summary')
                })
                .catch((error) => {
                    console.error('[OrgAdminDashboard] Error fetching usage summary:', {
                        error,
                        organizationId,
                        message: error?.message,
                        response: error?.response,
                        code: error?.code
                    })
                    // Don't show error toast for network errors - just log them
                    // The UI will show empty/loading state gracefully
                })

            // Fetch organization activities
            dispatch(fetchOrganizationActivity({ organizationId }))
                .unwrap()
                .then(() => {
                    console.log('[OrgAdminDashboard] Successfully fetched organization activities')
                })
                .catch((error) => {
                    console.error('[OrgAdminDashboard] Error fetching activities:', error)
                })
        } else {
            console.warn('[OrgAdminDashboard] Invalid organizationId, skipping API calls:', organizationId)
        }
    }, [organizationId, dispatch, session, user, organizationName, userRole])

    useEffect(() => {
        if (currentWorkspace?.id) {
            dispatch(fetchDashboardStats(currentWorkspace.id))
            dispatch(fetchWorkspace(currentWorkspace.id))
            dispatch(fetchWorkspaceMembers({ workspaceId: currentWorkspace.id }))
        }
    }, [currentWorkspace?.id, dispatch])

    const handleShareCredits = (workspace: Workspace) => {
        setSelectedWorkspace(workspace)
        setIsShareCreditsOpen(true)
    }

    const handleAddMember = async (workspace: Workspace) => {
        setSelectedWorkspace(workspace)
        // Fetch roles for this specific workspace
        dispatch(fetchWorkspaceRoles(workspace.id))
        // Fetch current members to filter eligible organization members
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
            // Refresh workspaces to update member count
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


    const getGreetingDetails = () => {
        const hour = new Date().getHours()
        const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'
        const Icon = hour < 12 || hour < 17
            ? () => <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
            : () => <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
        return { greeting, Icon }
    }

    const { greeting, Icon } = getGreetingDetails()

    if (workspaces.length === 0) {
        return (
            <div className="max-w-[1400px] mx-auto p-4 sm:p-8 space-y-12 animate-in fade-in duration-700 overflow-x-hidden">
                {/* Greeting Header */}
                <div className="animate-in fade-in slide-in-from-top-4 duration-1000 delay-200">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3 sm:gap-5">
                            <div className="p-2 sm:p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 shrink-0 transition-transform hover:scale-105">
                                <Icon />
                            </div>
                            <div className="space-y-1 min-w-0">
                                <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white break-words">
                                    {greeting}, <span className="text-primary">{user?.userName || user?.name || 'User'}</span>
                                </h1>
                                <p className="text-xs sm:text-sm lg:text-base text-gray-400 dark:text-gray-400 font-medium leading-relaxed">
                                    Welcome to your organization. Management and resources at your fingertips.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg shadow-gray-200/50 dark:shadow-none transition-all hover:border-primary/30 group w-fit">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <div className="flex flex-col">
                                <span className="text-[10px] sm:text-xs font-black text-gray-400 dark:text-gray-400 leading-none mb-1">Organization</span>
                                <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate max-w-[200px] sm:max-w-none">
                                    {organizationName}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Section - Shown immediately, with subtle syncing status if loading */}
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-100/20 w-full relative">
                    {workspacesLoading && (
                        <div className="absolute top-8 right-8 flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full border border-primary/10">
                            <div className="w-2.5 h-2.5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                            <span className="text-[9px] font-black text-primary uppercase tracking-wider">Syncing Data...</span>
                        </div>
                    )}

                    <div className="p-6 bg-primary/5 rounded-[2.5rem] mb-8">
                        <Building2 className="w-16 h-16 text-primary" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight text-center">
                        {userRole === 'org_super_admin' ? 'Initialize Your First Workspace' : 'No Active Workspace'}
                    </h3>
                    <p className="text-gray-500 max-w-sm text-center mt-4 px-10 font-medium leading-relaxed">
                        {userRole === 'org_super_admin'
                            ? 'Create your first workspace to start managing AI credits, copilots, and your team members.'
                            : 'Wait for an administrator to create or assign you to a workspace to access organization resources.'}
                    </p>

                    {userRole === 'org_super_admin' && (
                        <div className="flex flex-col items-center gap-12 w-full mt-10">
                            <Button
                                variant="solid"
                                onClick={() => setIsCreateWorkspaceOpen(true)}
                                className="h-16 px-12 rounded-2xl shadow-2xl shadow-primary/30 bg-primary text-white hover:scale-105 active:scale-95 transition-colors duration-300 text-sm font-black flex items-center gap-3 border-none"
                            >
                                <Plus className="w-5 h-5 shadow-none" />
                                Create My First Workspace
                            </Button>
                        </div>
                    )}

                    <button
                        onClick={() => dispatch(fetchWorkspaces())}
                        className="mt-12 text-xs font-bold text-gray-400 hover:text-primary transition-colors flex items-center gap-2"
                    >
                        <Building2 className="w-3 h-3" />
                        Refresh Connection
                    </button>
                </div>

                <CreateWorkspaceDialog
                    isOpen={isCreateWorkspaceOpen}
                    onClose={() => setIsCreateWorkspaceOpen(false)}
                />
            </div>
        )
    }

    return (
        <div className="max-w-[1400px] mx-auto p-4 sm:p-8 space-y-12 animate-in fade-in duration-700 overflow-x-hidden">
            {/* Greeting Header */}
            <div className="animate-in fade-in slide-in-from-top-4 duration-1000 delay-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-3 sm:gap-5">
                        <div className="p-2 sm:p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 shrink-0 transition-transform hover:scale-105">
                            <Icon />
                        </div>
                        <div className="space-y-1 min-w-0">
                            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white break-words">
                                {greeting}, <span className="text-primary">{user?.userName || user?.name || 'User'}</span>
                            </h1>
                            <p className="text-xs sm:text-sm lg:text-base text-gray-400 dark:text-gray-400 font-medium leading-relaxed">
                                Welcome to your organization. Management and resources at your fingertips.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg shadow-gray-200/50 dark:shadow-none transition-all hover:border-primary/30 group w-fit">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <div className="flex flex-col">
                            <span className="text-[10px] sm:text-xs font-black text-gray-400 dark:text-gray-400 leading-none mb-1">Organization</span>
                            <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate max-w-[200px] sm:max-w-none">
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
                                        <span className="text-xs font-black text-gray-400 dark:text-gray-400 pl-1">Workspace Name:</span>
                                        <div className="flex items-center gap-3">
                                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                                {currentWorkspace?.name || 'No workspace selected'}
                                            </h1>
                                            {organizationId && <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/30 font-black text-[10px]">Verified</span>
                                    </div>
                                </div>
                            </div>

                            {/* Workspace Switcher */}
                            {userRole !== 'org_member' && (
                                <div className="flex items-center gap-4">
                                    <WorkspaceSwitcher
                                        workspaces={workspaces}
                                        currentWorkspace={currentWorkspace}
                                        onWorkspaceChange={(ws) => {
                                            dispatch(setCurrentWorkspace(ws))
                                            dispatch(fetchWorkspace(ws.id))
                                        }}
                                        onCreateNew={userRole === 'org_super_admin' ? () => setIsCreateWorkspaceOpen(true) : undefined}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Quick Actions for Current Workspace */}
                {userRole !== 'org_member' && (
                    <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3 sm:gap-4 px-2">
                        {userRole === 'org_super_admin' && (
                            <Button
                                variant="solid"
                                onClick={() => setIsCreateWorkspaceOpen(true)}
                                className="w-full sm:w-auto h-14 px-6 sm:px-10 bg-primary hover:bg-primary-deep text-white font-bold text-sm sm:text-xs rounded-[1.25rem] shadow-xl shadow-primary/20 transition-colors hover:scale-[1.02] sm:hover:scale-105 active:scale-95 flex items-center justify-center gap-2 sm:gap-3 group border-none"
                            >
                                <Plus className="w-5 h-5 sm:w-4 sm:h-4 group-hover:rotate-90 transition-transform duration-300 shadow-none" />
                                <span className="whitespace-nowrap">Create Workspace</span>
                            </Button>
                        )}
                        {currentWorkspace && (
                            <>
                                <Button
                                    variant="solid"
                                    onClick={() => setIsTopUpOpen(true)}
                                    className="w-full sm:w-auto h-14 rounded-[1.25rem] px-6 sm:px-10 bg-primary hover:bg-primary-deep text-white font-bold text-sm sm:text-xs shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] sm:hover:scale-105 active:scale-95 flex sm:hidden items-center justify-center gap-2 sm:gap-3 group"
                                >
                                    <Plus className="w-5 h-5 sm:w-4 sm:h-4 group-hover:rotate-90 transition-transform duration-300 shadow-none" />
                                    <span className="whitespace-nowrap">Top-up Credits</span>
                                </Button>
                                <Button
                                    variant="plain"
                                    onClick={() => handleShareCredits(currentWorkspace)}
                                    className="w-full sm:w-auto h-14 px-6 sm:px-10 bg-white dark:bg-gray-900 text-primary border border-primary/20 hover:border-primary/40 font-bold text-sm sm:text-xs rounded-[1.25rem] shadow-lg shadow-gray-200/50 dark:shadow-none transition-all hover:scale-[1.02] sm:hover:scale-105 active:scale-95 flex items-center justify-center gap-2 sm:gap-3 group"
                                >
                                    <Send className="w-5 h-5 sm:w-4 sm:h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform shadow-none" />
                                    <span className="whitespace-nowrap">Share Credits</span>
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Quick Actions Component */}
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
                        onCreateWorkspace={userRole === 'org_super_admin' ? () => setIsCreateWorkspaceOpen(true) : undefined}
                    />
                </div>
            )}

            {/* Metrics Cards */}
            <AdminStatsCards
                workspacesCount={workspacesCount}
                activeMembersCount={activeMembersCount}
                totalUsage={usageSummary?.totalUsage || 0}
                aiRequests={usageSummary?.totalApiCalls || 0}
                isLoading={usageLoading}
                requestsTrend={requestsTrend}
                usageTrend={usageTrend}
            />

            {/* Main Content: Usage Trend */}
            <div className="grid grid-cols-1 gap-8">
                <div className="w-full">
                    <AdminUsageSummary
                        totalTokens={usageSummary?.totalUsage || 0}
                        totalMembers={activeMembersCount}
                        workspacesCount={workspacesCount}
                        successRate={usageSummary?.successRate}
                        avgLatency={usageSummary?.avgLatency}
                        dailyUsage={usageSummary?.dailyUsage}
                        usageTrend={usageTrend}
                    />
                </div>
            </div>

            {/* Main Content Grid 2: Team Activity & Copilots */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10">
                {/* Team Activity (8) */}
                <div className="lg:col-span-8">
                    <TeamActivitySnapshot />
                </div>
                {/* Copilots (4) */}
                <div className="lg:col-span-4">
                    <CopilotOperations />
                </div>
            </div>
            {selectedWorkspace && (
                <>
                    <ShareCreditsModal
                        isOpen={isShareCreditsOpen}
                        onClose={() => setIsShareCreditsOpen(false)}
                        workspace={selectedWorkspace}
                    />
                    <InviteMemberDialog
                        isOpen={isAddMemberOpen}
                        onClose={() => setIsAddMemberOpen(false)}
                        onInvite={handleAddWorkspaceMember}
                        roles={roles}
                        eligibleMembers={eligibleMembers}
                        workspaceName={selectedWorkspace.name}
                        isLoading={operationsLoading}
                    />
                </>
            )}
            <CreateWorkspaceDialog
                isOpen={isCreateWorkspaceOpen}
                onClose={() => setIsCreateWorkspaceOpen(false)}
            />
            {currentWorkspace && (
                <TopUpModal
                    isOpen={isTopUpOpen}
                    onClose={() => setIsTopUpOpen(false)}
                    workspaceId={userRole === 'org_super_admin' ? undefined : currentWorkspace.id}
                    organizationId={organizationId || undefined}
                />
            )}
        </div>
    )
}
