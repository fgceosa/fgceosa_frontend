'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { useRequireAuthority } from '@/utils/hooks/useAuthorization'
import {
    fetchWorkspaces,
    fetchWorkspaceRoles,
    addWorkspaceMember,
    fetchWorkspaceMembers,
} from '@/store/slices/workspace/workspaceThunk'
import { fetchOrganizationUsageSummary, fetchOrganizationTeam } from '@/store/slices/organization/organizationThunk'
import {
    selectWorkspaces,
    selectCurrentWorkspace,
    selectWorkspaceRoles,
    selectOperationsLoading,
    selectWorkspacesTotal
} from '@/store/slices/workspace/workspaceSelectors'
import {
    selectOrganizationUsageSummary,
    selectOrganizationMembers
} from '@/store/slices/organization/organizationSelectors'
import { useOrganization } from '../layout'
import AdminWorkspaceList from '../dashboard/_components/AdminWorkspaceList'
import CreateWorkspaceDialog from '../../workspace/_components/CreateWorkspaceDialog'
import ShareCreditsModal from '../dashboard/_components/ShareCreditsModal'
import InviteMemberDialog from '../../workspace/_components/InviteMemberDialog'
import TopUpModal from '@/components/template/Topup/TopUpModal'
import { Button, Notification, toast } from '@/components/ui'
import { Plus, Users, Send, Building2 } from 'lucide-react'
import WorkspaceHeader from '../../workspace/_components/WorkspaceHeader'
import { extractErrorMessage } from '@/utils/errorUtils'
import type { Workspace } from '../../workspace/types'

export default function OrgWorkspacesPage() {
    const dispatch = useAppDispatch()
    const { organizationId } = useOrganization()

    // Require org_admin or org_super_admin authority
    useRequireAuthority(['org_admin', 'org_super_admin'])

    const workspaces = useAppSelector(selectWorkspaces)
    const workspacesTotal = useAppSelector(selectWorkspacesTotal)
    const currentWorkspace = useAppSelector(selectCurrentWorkspace)
    const usageSummary = useAppSelector(selectOrganizationUsageSummary)
    const orgMembers = useAppSelector(selectOrganizationMembers)
    const roles = useAppSelector(selectWorkspaceRoles) || []
    const operationsLoading = useAppSelector(selectOperationsLoading)

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isTopUpOpen, setIsTopUpOpen] = useState(false)
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
    const [isShareCreditsOpen, setIsShareCreditsOpen] = useState(false)

    const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null)
    const [wsMembers, setWsMembers] = useState<any[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(10)

    useEffect(() => {
        dispatch(fetchWorkspaces({ page: currentPage, pageSize }))
        if (organizationId) {
            dispatch(fetchOrganizationUsageSummary({ organizationId }))
            dispatch(fetchOrganizationTeam({ organizationId }))
        }
    }, [organizationId, dispatch, currentPage, pageSize])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleAddMember = async (workspace: Workspace) => {
        setSelectedWorkspace(workspace)
        dispatch(fetchWorkspaceRoles(workspace.id))
        const response = await dispatch(fetchWorkspaceMembers({ workspaceId: workspace.id })).unwrap()
        setWsMembers(response.members || [])
        setIsAddMemberOpen(true)
    }

    const handleShareCredits = (workspace: Workspace) => {
        setSelectedWorkspace(workspace)
        setIsShareCreditsOpen(true)
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
                </Notification>
            )
            setIsAddMemberOpen(false)
            dispatch(fetchWorkspaces({ page: currentPage, pageSize }))
        } catch (err: any) {
            toast.push(
                <Notification type="danger" title="Error" duration={3000}>
                    {extractErrorMessage(err, 'Failed to add member to workspace')}
                </Notification>
            )
        }
    }

    const eligibleMembers = orgMembers.filter(
        orgMember => !wsMembers.some(
            wsMember => wsMember.email.toLowerCase() === orgMember.email.toLowerCase()
        )
    )

    const usageMap: Record<string, number> = {}
    if (usageSummary?.workspacesUsage) {
        usageSummary.workspacesUsage.forEach((w: any) => {
            usageMap[w.workspaceId] = w.totalUsage
        })
    }

    return (
        <div className="max-w-[1400px] mx-auto p-4 sm:p-8 space-y-12 animate-in fade-in duration-700">
            {/* Header Section */}
            <WorkspaceHeader
                title="Workspaces"
                tag="Organization Management"
                description="Manage all workspaces within your organization, monitor their resource usage, and control access permissions."
                icon={Building2}
                label=""
            />

            <div className="flex justify-end pr-2 w-full">
                {workspaces.length > 0 && (
                    <Button
                        variant="solid"
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="w-full sm:w-auto h-14 px-10 bg-primary hover:bg-primary-deep text-white font-black text-sm sm:text-[10px] rounded-[1.25rem] shadow-xl shadow-primary/20 transition-all sm:hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group"
                    >
                        <Plus className="w-5 h-5 sm:w-4 sm:h-4 group-hover:rotate-90 transition-transform duration-300" />
                        Create workspace
                    </Button>
                )}
            </div>

            <AdminWorkspaceList
                workspaces={workspaces}
                usageMap={usageMap}
                currentPage={currentPage}
                pageSize={pageSize}
                totalCount={workspacesTotal}
                onPageChange={handlePageChange}
                onAddMember={handleAddMember}
                onShareCredits={handleShareCredits}
                onCreate={() => setIsCreateDialogOpen(true)}
                isAdminUser={true}
            />

            <CreateWorkspaceDialog
                isOpen={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
            />

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

            {currentWorkspace && (
                <TopUpModal
                    isOpen={isTopUpOpen}
                    onClose={() => setIsTopUpOpen(false)}
                    workspaceId={currentWorkspace.id}
                    organizationId={organizationId || undefined}
                />
            )}
        </div>
    )
}
