'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchWorkspace, fetchDashboardStats } from '@/store/slices/workspace/workspaceThunk'
import { useRequireAuthority } from '@/utils/hooks/useAuthorization'
import {
    selectDashboardStats,
    selectDashboardStatsLoading,
    selectCurrentWorkspace
} from '@/store/slices/workspace/workspaceSelectors'
import { LayoutDashboard, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Button, toast, Notification } from '@/components/ui'
import WorkspacePageLayout from '../_components/WorkspacePageLayout'
import WorkspaceHeader from '../_components/WorkspaceHeader'
import DashboardStatsCards from '../_components/DashboardStatsCards'
import RecentActivity from '../_components/RecentActivity'
import InviteMemberDialog from '../_components/InviteMemberDialog'
import {
    fetchWorkspaceMembers,
    fetchWorkspaceRoles,
    addWorkspaceMember,
} from '@/store/slices/workspace/workspaceThunk'
import { fetchOrganizationTeam } from '@/store/slices/organization/organizationThunk'
import {
    selectWorkspaceMembers,
    selectWorkspaceRoles,
    selectOperationsLoading,
} from '@/store/slices/workspace/workspaceSelectors'
import { selectOrganizationMembers } from '@/store/slices/organization/organizationSelectors'
import { extractErrorMessage } from '@/utils/errorUtils'

export default function WorkspaceDetailPage() {
    const params = useParams()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const currentWorkspace = useAppSelector(selectCurrentWorkspace)
    const dashboardStats = useAppSelector(selectDashboardStats)
    const statsLoading = useAppSelector(selectDashboardStatsLoading)
    const workspaceId = params.workspaceId as string

    const members = useAppSelector(selectWorkspaceMembers) || []
    const organizationMembers = useAppSelector(selectOrganizationMembers) || []
    const roles = useAppSelector(selectWorkspaceRoles) || []
    const operationsLoading = useAppSelector(selectOperationsLoading)

    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)

    // Require org_admin or org_super_admin authority
    useRequireAuthority(['org_admin', 'org_super_admin'])

    useEffect(() => {
        if (!workspaceId) {
            router.push('/organizations/workspaces')
            return
        }

        dispatch(fetchWorkspace(workspaceId))
        dispatch(fetchDashboardStats(workspaceId))
        dispatch(fetchWorkspaceMembers({ workspaceId }))
        dispatch(fetchWorkspaceRoles(workspaceId))
    }, [workspaceId, dispatch, router])

    useEffect(() => {
        if (currentWorkspace?.organizationId) {
            dispatch(fetchOrganizationTeam({ organizationId: currentWorkspace.organizationId }))
        }
    }, [currentWorkspace?.organizationId, dispatch])

    const eligibleMembers = organizationMembers.filter(
        orgMember => !members.some(
            wsMember => wsMember.email.toLowerCase() === orgMember.email.toLowerCase()
        )
    )

    const handleAddMember = async (data: {
        userId: string
        roles: string[]
        credits_to_allocate?: number
    }) => {
        try {
            await dispatch(
                addWorkspaceMember({
                    workspaceId,
                    ...data,
                }),
            ).unwrap()

            toast.push(
                <Notification type="success" duration={2000}>
                    Member added successfully
                </Notification>,
            )
            dispatch(fetchWorkspaceMembers({ workspaceId }))
            setIsInviteDialogOpen(false)
        } catch (err: any) {
            toast.push(
                <Notification type="danger" duration={5000}>
                    {extractErrorMessage(err, 'Failed to add member')}
                </Notification>,
            )
            throw err
        }
    }

    return (
        <div className="min-h-full bg-[#f5f5f5] dark:bg-gray-900/50">
            <WorkspacePageLayout
                fullWidth={true}
                header={
                    <WorkspaceHeader
                        title={currentWorkspace?.name || 'Workspace Dashboard'}
                        description={currentWorkspace?.description}
                        icon={LayoutDashboard}
                        iconBgClass="bg-gradient-to-br from-blue-600 to-indigo-700"
                        tag="Dashboard"
                        workspaceId={workspaceId}
                        isVerified={currentWorkspace?.status === 'active' || true}
                        actions={
                            <Button
                                variant="solid"
                                onClick={() => setIsInviteDialogOpen(true)}
                                className="h-12 sm:h-14 px-6 sm:px-8 bg-primary hover:bg-primary-deep text-white font-black uppercase tracking-[0.2em] text-[10px] sm:text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group w-full lg:w-auto"
                            >
                                <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                Add Member
                            </Button>
                        }
                    />
                }
            >
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-1000">
                    <DashboardStatsCards stats={dashboardStats} isLoading={statsLoading} />
                    <RecentActivity />
                </div>
            </WorkspacePageLayout>

            <InviteMemberDialog
                isOpen={isInviteDialogOpen}
                onClose={() => setIsInviteDialogOpen(false)}
                onInvite={handleAddMember}
                roles={roles}
                eligibleMembers={eligibleMembers}
                workspaceName={currentWorkspace?.name}
                isLoading={operationsLoading}
            />
        </div>
    )
}
