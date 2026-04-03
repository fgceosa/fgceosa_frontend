'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store'
import { useRequireAuthority } from '@/utils/hooks/useAuthorization'
import {
    fetchWorkspace,
    fetchWorkspaceMembers,
    fetchWorkspaceRoles,
    addWorkspaceMember,
    removeMember,
    suspendMember,
    updateWorkspaceMember,
    assignMemberRoles,
} from '@/store/slices/workspace/workspaceThunk'
import {
    fetchOrganizationTeam
} from '@/store/slices/organization/organizationThunk'
import {
    selectWorkspaceMembers,
    selectMembersTotal,
    selectWorkspaceRoles,
    selectMembersLoading,
    selectRolesLoading,
    selectOperationsLoading,
    selectWorkspaceError,
    selectCurrentWorkspace,
} from '@/store/slices/workspace/workspaceSelectors'
import {
    selectOrganizationMembers,
} from '@/store/slices/organization/organizationSelectors'
import {
    Button,
    Card,
    Input,
    Notification,
    toast,
    Dropdown,
} from '@/components/ui'
import QorebitLoading from '@/components/shared/QorebitLoading'
import { UserPlus, Search, Users, Filter, Settings } from 'lucide-react'
import MembersTable from '../../_components/MembersTable'
import InviteMemberDialog from '../../_components/InviteMemberDialog'
import EditMemberDialog from '../../_components/EditMemberDialog'
import AssignRoleDialog from '../../_components/AssignRoleDialog'
import WorkspacePageLayout from '../../_components/WorkspacePageLayout'
import WorkspaceHeader from '../../_components/WorkspaceHeader'
import type { WorkspaceMember } from '../../types'
import classNames from '@/utils/classNames'
import { extractErrorMessage } from '@/utils/errorUtils'

export default function WorkspaceMembersPage() {
    const params = useParams()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const workspaceId = params.workspaceId as string

    // Require org_admin or org_super_admin authority
    const hasAuthority = useRequireAuthority(['org_admin', 'org_super_admin'])

    const currentWorkspace = useAppSelector(selectCurrentWorkspace)
    const organizationMembers = useAppSelector(selectOrganizationMembers) || []

    const members = useAppSelector(selectWorkspaceMembers) || []
    const membersTotal = useAppSelector(selectMembersTotal)
    const roles = useAppSelector(selectWorkspaceRoles) || []
    const membersLoading = useAppSelector(selectMembersLoading)
    const rolesLoading = useAppSelector(selectRolesLoading)
    const operationsLoading = useAppSelector(selectOperationsLoading)
    const error = useAppSelector(selectWorkspaceError)

    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isAssignRoleDialogOpen, setIsAssignRoleDialogOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState<WorkspaceMember | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [roleFilter, setRoleFilter] = useState<string>('all')

    // Fetch members and roles on mount
    useEffect(() => {
        if (workspaceId) {
            dispatch(fetchWorkspaceMembers({ workspaceId }))
            dispatch(fetchWorkspaceRoles(workspaceId))
        }
    }, [workspaceId, dispatch])

    // Fetch organization members if we have context
    useEffect(() => {
        if (currentWorkspace?.organizationId) {
            dispatch(fetchOrganizationTeam({ organizationId: currentWorkspace.organizationId }))
        }
    }, [currentWorkspace?.organizationId, dispatch])

    // Filter members who are NOT already in the workspace
    const eligibleMembers = organizationMembers.filter(
        orgMember => !members.some(
            wsMember => wsMember.email.toLowerCase() === orgMember.email.toLowerCase()
        )
    )

    // Show error notification
    useEffect(() => {
        if (error) {
            toast.push(
                <Notification type="danger" duration={3000}>
                    {extractErrorMessage(error)}
                </Notification>,
            )
        }
    }, [error])

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
            // Refresh members list
            dispatch(fetchWorkspaceMembers({ workspaceId }))
        } catch (err: any) {
            console.error('handleAddMember error:', err)
            toast.push(
                <Notification type="danger" duration={5000}>
                    {extractErrorMessage(err, 'Failed to add member')}
                </Notification>,
            )
            throw err
        }
    }

    const handleRemoveMember = async (memberId: string) => {
        try {
            await dispatch(removeMember({ workspaceId, memberId })).unwrap()

            toast.push(
                <Notification type="success" duration={2000}>
                    Member removed successfully
                </Notification>,
            )
        } catch (err: any) {
            toast.push(
                <Notification type="danger" duration={3000}>
                    {extractErrorMessage(err, 'Failed to remove member')}
                </Notification>,
            )
        }
    }

    const handleSuspendMember = async (memberId: string) => {
        try {
            await dispatch(suspendMember({ workspaceId, memberId })).unwrap()

            toast.push(
                <Notification type="success" duration={2000}>
                    Member suspended successfully
                </Notification>,
            )
        } catch (err: any) {
            toast.push(
                <Notification type="danger" duration={3000}>
                    {extractErrorMessage(err, 'Failed to suspend member')}
                </Notification>,
            )
        }
    }

    const handleEditMember = (member: WorkspaceMember | any) => {
        setSelectedMember(member as WorkspaceMember)
        setIsEditDialogOpen(true)
    }

    const handleSaveEditMember = async (memberId: string, data: { creditsAllocated: number }) => {
        try {
            await dispatch(
                updateWorkspaceMember({
                    workspaceId,
                    memberId,
                    data: { credits_allocated: data.creditsAllocated },
                }),
            ).unwrap()
            // Refresh members list
            dispatch(fetchWorkspaceMembers({ workspaceId }))
        } catch (err: any) {
            toast.push(
                <Notification type="danger" duration={3000}>
                    {extractErrorMessage(err, 'Failed to update member')}
                </Notification>,
            )
            throw err
        }
    }

    const handleAssignRole = (memberId: string) => {
        const member = members.find((m) => m.id === memberId)
        if (member) {
            setSelectedMember(member)
            setIsAssignRoleDialogOpen(true)
        }
    }

    const handleSaveRoles = async (memberId: string, roleIds: string[]) => {
        try {
            await dispatch(
                assignMemberRoles({
                    workspaceId,
                    memberId,
                    roleIds,
                }),
            ).unwrap()
            // Refresh members list
            dispatch(fetchWorkspaceMembers({ workspaceId }))
        } catch (err: any) {
            toast.push(
                <Notification type="danger" duration={3000}>
                    {extractErrorMessage(err, 'Failed to assign roles')}
                </Notification>,
            )
            throw err
        }
    }

    const handleSearch = () => {
        dispatch(
            fetchWorkspaceMembers({
                workspaceId,
                query: searchQuery,
                status: statusFilter !== 'all' ? statusFilter : undefined,
                role: roleFilter !== 'all' ? roleFilter : undefined,
            }),
        )
    }

    const filteredMembers = members.filter((member) => {
        const matchesSearch =
            searchQuery === '' ||
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus =
            statusFilter === 'all' || member.status === statusFilter

        const matchesRole =
            roleFilter === 'all' ||
            member.roles.some((role) => role === roleFilter)

        return matchesSearch && matchesStatus && matchesRole
    })

    if (membersLoading && members.length === 0) {
        return <QorebitLoading />
    }

    return (
        <div className="min-h-full bg-[#f5f5f5] dark:bg-gray-950/50">
            <WorkspacePageLayout
                fullWidth={true}
                header={
                    <WorkspaceHeader
                        title="Workspace Members"
                        description="View and manage the people who have access to this workspace."
                        icon={Users}
                        iconBgClass="bg-gradient-to-br from-blue-600 to-indigo-700"
                        tag="Member Management"
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
                {/* Premium Toolbar Implementation */}
                <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-6 relative group mb-8">
                    {/* Hover Accent */}
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                        {/* Search Implementation */}
                        <div className="relative w-full lg:flex-1">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <Input
                                placeholder="Search members by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-14 bg-gray-50/50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-primary/20 focus:border-primary text-sm shadow-inner transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-750 font-medium"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                            {/* Status Filter */}
                            <div className="flex items-center gap-2 p-1 bg-gray-50/80 dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm w-full sm:w-auto">
                                <Dropdown
                                    renderTitle={
                                        <Button
                                            variant="plain"
                                            size="sm"
                                            className="h-10 px-4 gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                                        >
                                            <Filter className="w-4 h-4" />
                                            <span className="text-[10px] uppercase font-black tracking-widest whitespace-nowrap">
                                                {statusFilter === 'all' ? 'Status' : statusFilter}
                                            </span>
                                        </Button>
                                    }
                                >
                                    <Dropdown.Item onClick={() => setStatusFilter('all')} className="text-xs font-bold h-10">All Statuses</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setStatusFilter('active')} className="text-xs font-bold h-10">Active Only</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setStatusFilter('suspended')} className="text-xs font-bold h-10">Suspended</Dropdown.Item>
                                </Dropdown>

                                <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

                                <Dropdown
                                    renderTitle={
                                        <Button
                                            variant="plain"
                                            size="sm"
                                            className="h-10 px-4 gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                                        >
                                            <Settings className="w-4 h-4" />
                                            <span className="text-[10px] uppercase font-black tracking-widest whitespace-nowrap truncate max-w-[80px]">
                                                {roleFilter === 'all' ? 'Role' : roleFilter}
                                            </span>
                                        </Button>
                                    }
                                >
                                    <Dropdown.Item onClick={() => setRoleFilter('all')} className="text-xs font-bold h-10">All Roles</Dropdown.Item>
                                    {roles.map(role => (
                                        <Dropdown.Item key={role.id} onClick={() => setRoleFilter(role.name)} className="text-xs font-bold h-10">
                                            {role.name}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown>
                            </div>

                            {/* Member Count Badge */}
                            <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/80 dark:bg-gray-800/80 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm whitespace-nowrap h-12 flex items-center">
                                {members.length} Members
                            </div>
                        </div>
                    </div>
                </div>

                {/* Members Content */}
                <Card className="p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 relative z-10 transition-all">
                    <div className="p-5 sm:p-8 border-b border-gray-50 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/30 dark:bg-gray-800/20">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Users className="w-4 h-4 text-primary" />
                            </div>
                            <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Everyone</h3>
                            <span className="px-2.5 py-1 bg-white dark:bg-gray-800 rounded-lg text-[10px] font-black text-primary border border-gray-100 dark:border-gray-700 shadow-sm">
                                {filteredMembers.length} PEOPLE
                            </span>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6">
                        <MembersTable
                            members={filteredMembers}
                            isLoading={membersLoading}
                            onRemoveMember={handleRemoveMember}
                            onSuspendMember={handleSuspendMember}
                            onEditMember={handleEditMember}
                            onAssignRole={handleAssignRole}
                            onAddMember={() => setIsInviteDialogOpen(true)}
                        />
                    </div>
                </Card>

                {/* Dialogs - Consistent Redesign */}
                <InviteMemberDialog
                    isOpen={isInviteDialogOpen}
                    onClose={() => setIsInviteDialogOpen(false)}
                    onInvite={handleAddMember}
                    roles={roles}
                    eligibleMembers={eligibleMembers}
                    workspaceName={currentWorkspace?.name}
                    isLoading={operationsLoading}
                />

                <EditMemberDialog
                    isOpen={isEditDialogOpen}
                    onClose={() => {
                        setIsEditDialogOpen(false)
                        setSelectedMember(null)
                    }}
                    member={selectedMember}
                    onSave={handleSaveEditMember}
                    isLoading={operationsLoading}
                />

                <AssignRoleDialog
                    isOpen={isAssignRoleDialogOpen}
                    onClose={() => {
                        setIsAssignRoleDialogOpen(false)
                        setSelectedMember(null)
                    }}
                    member={selectedMember}
                    roles={roles}
                    onSave={handleSaveRoles}
                    isLoading={operationsLoading}
                />
            </WorkspacePageLayout>
        </div>
    )
}
