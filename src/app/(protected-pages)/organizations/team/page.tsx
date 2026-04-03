'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { useRequireAuthority } from '@/utils/hooks/useAuthorization'
import {
    fetchOrganizationTeam,
    fetchOrganizationRoles,
    inviteOrganizationMember,
    updateOrganizationMember,
    removeOrganizationMember
} from '@/store/slices/organization/organizationThunk'
import {
    selectOrganizationMembers,
    selectOrganizationRoles,
    selectOrganizationLoading,
} from '@/store/slices/organization/organizationSelectors'
import { useOrganization } from '../layout'
import { Card, Button, Input, Notification, toast, Spinner } from '@/components/ui'
import { Users, UserPlus, Search } from 'lucide-react'
import WorkspaceHeader from '../../workspace/_components/WorkspaceHeader' // Reuse generic header layout
import OrgTeamTable from './_components/OrgTeamTable'
import OrgTeamToolbar from './_components/OrgTeamToolbar'
import InviteOrgMemberDialog from './_components/InviteOrgMemberDialog'
import UpdateOrgRoleDialog from './_components/UpdateOrgRoleDialog'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import type { OrganizationMember } from '../types'

export default function OrganizationTeamPage() {
    const dispatch = useAppDispatch()
    const { organizationId, organizationName } = useOrganization()

    // Require org_admin or org_super_admin authority
    useRequireAuthority(['org_admin', 'org_super_admin'])

    const members = useAppSelector(selectOrganizationMembers) || []
    const roles = useAppSelector(selectOrganizationRoles) || []
    const isLoading = useAppSelector(selectOrganizationLoading)

    const [isInviteOpen, setIsInviteOpen] = useState(false)
    const [updater, setUpdater] = useState<{ isOpen: boolean; member: OrganizationMember | null }>({ isOpen: false, member: null })
    const [removeConfirm, setRemoveConfirm] = useState<{ isOpen: boolean; member: OrganizationMember | null }>({ isOpen: false, member: null })
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    useEffect(() => {
        if (organizationId) {
            dispatch(fetchOrganizationTeam({ organizationId }))
            dispatch(fetchOrganizationRoles(organizationId))
        }
    }, [organizationId, dispatch])

    // Force re-fetch on mount to ensure fresh data
    useEffect(() => {
        if (organizationId) {
            dispatch(fetchOrganizationTeam({ organizationId }))
        }
    }, [])

    const handleInvite = async (data: { email: string; role: string; note?: string; workspace_ids?: string[] }) => {
        if (!organizationId) return
        try {
            await dispatch(inviteOrganizationMember({
                organizationId,
                email: data.email,
                role: data.role,
                note: data.note,
                workspace_ids: data.workspace_ids
            })).unwrap()

            toast.push(
                <Notification type="success" title="Invitation Sent" duration={3000}>
                    User has been invited to the organization{data.workspace_ids?.length ? ` and pre-assigned to ${data.workspace_ids.length} workspace(s).` : '.'}
                </Notification>
            )
        } catch (error: any) {
            toast.push(
                <Notification type="danger" title="Invitation Failed" duration={5000}>
                    {error.message || 'Failed to invite user.'}
                </Notification>
            )
            throw error
        }
    }

    const handleUpdateRole = async (data: { memberId: string; role: string }) => {
        if (!organizationId) return
        try {
            await dispatch(updateOrganizationMember({
                organizationId,
                memberId: data.memberId,
                role: data.role
            })).unwrap()

            toast.push(
                <Notification type="success" title="Role Updated" duration={3000}>
                    User role has been updated.
                </Notification>
            )
        } catch (error: any) {
            toast.push(
                <Notification type="danger" title="Update Failed" duration={5000}>
                    {error.message || 'Failed to update user role.'}
                </Notification>
            )
            throw error
        }
    }

    const handleRemoveMember = (member: OrganizationMember) => {
        setRemoveConfirm({ isOpen: true, member })
    }

    const confirmRemoveMember = async () => {
        const member = removeConfirm.member
        if (!organizationId || !member) return

        try {
            await dispatch(removeOrganizationMember({
                organizationId,
                memberId: member.id
            })).unwrap()

            toast.push(
                <Notification type="success" title="User Removed" duration={3000}>
                    User has been removed from the organization.
                </Notification>
            )
        } catch (error: any) {
            toast.push(
                <Notification type="danger" title="Removal Failed" duration={5000}>
                    {error.message || 'Failed to remove user.'}
                </Notification>
            )
        } finally {
            setRemoveConfirm({ isOpen: false, member: null })
        }
    }

    const filteredMembers = members.filter(member => {
        const matchesSearch = (member.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (member.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'all' || member.status === statusFilter

        return matchesSearch && matchesStatus
    })

    if (!organizationId) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-gray-500">No organization context found.</p>
            </div>
        )
    }

    return (
        <div className="max-w-[1440px] mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-700">
            <WorkspaceHeader
                title="Organization Team"
                label=""
                description=""
                tag="Identity Management"
            />

            <OrgTeamToolbar
                searchQuery={searchQuery}
                onSearch={setSearchQuery}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                totalMembers={filteredMembers.length}
                onInviteClick={() => setIsInviteOpen(true)}
            />

            <Card className="rounded-[2rem] border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 overflow-hidden">

                <div className="p-2 sm:p-4">
                    <OrgTeamTable
                        members={filteredMembers}
                        isLoading={isLoading}
                        onUpdateRole={(member) => setUpdater({ isOpen: true, member })}
                        onRemove={handleRemoveMember}
                    />
                </div>
            </Card>

            <InviteOrgMemberDialog
                isOpen={isInviteOpen}
                onClose={() => setIsInviteOpen(false)}
                roles={roles}
                organizationId={organizationId || undefined}
                onInvite={handleInvite}
            />

            <UpdateOrgRoleDialog
                isOpen={updater.isOpen}
                member={updater.member}
                roles={roles}
                onClose={() => setUpdater({ isOpen: false, member: null })}
                onUpdate={handleUpdateRole}
            />

            <ConfirmDialog
                isOpen={removeConfirm.isOpen}
                type="danger"
                title="Remove Member"
                confirmButtonProps={{ color: 'red-600' }}
                onClose={() => setRemoveConfirm({ isOpen: false, member: null })}
                onCancel={() => setRemoveConfirm({ isOpen: false, member: null })}
                onConfirm={confirmRemoveMember}
            >
                <p>
                    Are you sure you want to remove{' '}
                    <span className="font-black text-gray-900 dark:text-white">
                        {removeConfirm.member?.name}
                    </span>{' '}
                    from the organization? They will lose access to all workspaces.
                </p>
            </ConfirmDialog>
        </div>
    )
}
