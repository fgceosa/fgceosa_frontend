'use client'

import { useState } from 'react'
import { Avatar, Button, Card, Notification, toast, Dialog, Dropdown } from '@/components/ui'
import {
    MoreHorizontal,
    Mail,
    UserX,
    UserMinus,
    Edit,
    Shield,
    Users,
    Clock,
    Zap,
    Calendar,
    Activity,
    User
} from 'lucide-react'
import type { WorkspaceMember } from '../types'
import type { OrganizationMember } from '../../organizations/types'

type Member = WorkspaceMember | OrganizationMember
import classNames from '@/utils/classNames'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

function StatusBadge({ status }: { status: string }) {
    const statusLower = status.toLowerCase()
    const isActive = statusLower === 'active'
    const isPending = statusLower === 'pending'
    const isSuspended = statusLower === 'suspended'

    return (
        <div className={classNames(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300",
            isActive
                ? "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30 shadow-sm shadow-green-200/20"
                : isPending
                    ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/30 shadow-sm shadow-amber-200/20"
                    : "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30 shadow-sm shadow-red-200/20"
        )}>
            <div className={classNames(
                "w-1.5 h-1.5 rounded-full animate-pulse",
                isActive ? "bg-green-600" : isPending ? "bg-amber-500" : "bg-red-600"
            )} />
            <span>{status}</span>
        </div>
    )
}

function RoleBadge({ role }: { role: string }) {
    return (
        <div className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-gray-50 text-gray-600 border border-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 shadow-sm">
            {role}
        </div>
    )
}

interface MembersTableProps {
    members: (WorkspaceMember | OrganizationMember)[]
    isLoading?: boolean
    context?: 'workspace' | 'organization'
    onRemoveMember?: (memberId: string) => void
    onSuspendMember?: (memberId: string) => void
    onEditMember?: (member: Member) => void
    onAssignRole?: (memberId: string) => void
    onAddMember?: () => void
}

export default function MembersTable({
    members,
    isLoading,
    context = 'workspace',
    onRemoveMember,
    onSuspendMember,
    onEditMember,
    onAssignRole,
    onAddMember,
}: MembersTableProps) {
    const [selectedMember, setSelectedMember] = useState<Member | null>(null)
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)
    const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false)

    const handleRemoveClick = (member: WorkspaceMember) => {
        setSelectedMember(member)
        setIsRemoveDialogOpen(true)
    }

    const handleSuspendClick = (member: WorkspaceMember) => {
        setSelectedMember(member)
        setIsSuspendDialogOpen(true)
    }

    const confirmRemove = () => {
        if (selectedMember && onRemoveMember) {
            onRemoveMember(selectedMember.id)
            setIsRemoveDialogOpen(false)
            setSelectedMember(null)
        }
    }

    const confirmSuspend = () => {
        if (selectedMember && onSuspendMember) {
            onSuspendMember(selectedMember.id)
            setIsSuspendDialogOpen(false)
            setSelectedMember(null)
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-20 bg-gray-50/50 dark:bg-gray-800/30 animate-pulse rounded-2xl border border-gray-100 dark:border-gray-800" />
                ))}
            </div>
        )
    }

    if (!members || members.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 px-8 text-center bg-gray-50/30 dark:bg-gray-800/10">
                <div className="w-24 h-24 bg-primary/5 rounded-[40px] flex items-center justify-center mb-8 border border-primary/10 relative">
                    <Users className="w-12 h-12 text-primary opacity-20" />
                    <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full opacity-20 animate-pulse" />
                </div>
                <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-3 uppercase tracking-tight italic">No Members Found</h4>
                <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm text-lg leading-relaxed mb-8">
                    {context === 'workspace'
                        ? "You haven't added any team members to this workspace yet. Add people to start collaborating."
                        : "No members found in this organization. Invite people to get started."
                    }
                </p>
                {context === 'workspace' && onAddMember && (
                    <Button
                        variant="solid"
                        onClick={onAddMember}
                        className="h-14 px-10 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-primary/20"
                    >
                        Add Your First Member
                    </Button>
                )}
            </div>
        )
    }

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20">
                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-1/3">Member</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Roles</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Credits</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Activity</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                        {members.map((member) => (
                            <tr
                                key={member.id}
                                className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/10 transition-colors"
                            >
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <Avatar
                                            size={40}
                                            src={member.avatar}
                                            alt={member.name}
                                            shape="circle"
                                            className="ring-4 ring-gray-100 dark:ring-gray-800 shadow-inner group-hover:ring-primary/10 transition-all shrink-0"
                                        />
                                        <div className="flex flex-col">
                                            <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-primary transition-colors cursor-pointer">
                                                {member.name}
                                            </h4>
                                            <p className="text-[10px] text-gray-400 font-medium truncate">
                                                {member.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-wrap gap-1.5">
                                        {((member as WorkspaceMember).roles && (member as WorkspaceMember).roles.length > 0) ? (
                                            (member as WorkspaceMember).roles.slice(0, 2).map((role, index) => (
                                                <RoleBadge key={index} role={role} />
                                            ))
                                        ) : (member as OrganizationMember).role ? (
                                            <RoleBadge role={(member as OrganizationMember).role} />
                                        ) : (
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">None</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-emerald-500" />
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                                            {context === 'workspace'
                                                ? Number((member as WorkspaceMember).creditsAllocated || 0).toFixed(0)
                                                : Number((member as OrganizationMember).workspacesCount || 0)
                                            }
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <StatusBadge status={member.status} />
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm text-gray-900 dark:text-gray-100 font-bold whitespace-nowrap">
                                            {member.joinedAt && dayjs(member.joinedAt).isValid()
                                                ? dayjs(member.joinedAt).format('MMM D, YYYY')
                                                : 'N/A'
                                            }
                                        </span>
                                        <div className="flex items-center gap-1 text-gray-400">
                                            <Clock className="w-2.5 h-2.5" />
                                            <span className="text-[9px] uppercase font-black tracking-widest leading-none">
                                                {(member as WorkspaceMember).lastActive ? dayjs((member as WorkspaceMember).lastActive).fromNow() : 'Never'}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end">
                                        <Dropdown
                                            placement="bottom-end"
                                            renderTitle={
                                                <Button
                                                    size="xs"
                                                    variant="plain"
                                                    className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                                                >
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            }
                                        >
                                            {onAssignRole && (
                                                <Dropdown.Item onClick={() => onAssignRole(member.id)}>
                                                    <div className="flex items-center gap-2 p-1 text-emerald-600">
                                                        <Shield className="w-4 h-4" />
                                                        <span className="text-xs font-bold text-emerald-600">Manage Access</span>
                                                    </div>
                                                </Dropdown.Item>
                                            )}
                                            {onRemoveMember && (
                                                <Dropdown.Item
                                                    className="text-rose-600"
                                                    onClick={() => handleRemoveClick(member as WorkspaceMember)}
                                                >
                                                    <div className="flex items-center gap-2 p-1">
                                                        <UserX className="w-4 h-4" />
                                                        <span className="text-xs font-bold text-rose-600">Remove from Team</span>
                                                    </div>
                                                </Dropdown.Item>
                                            )}
                                        </Dropdown>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View - Card Based */}
            <div className="md:hidden grid grid-cols-1 gap-4">
                {members.map((member) => (
                    <div
                        key={member.id}
                        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-5"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar
                                    size={48}
                                    src={member.avatar}
                                    alt={member.name}
                                    shape="circle"
                                    className="ring-2 ring-gray-100 dark:ring-gray-800"
                                />
                                <div>
                                    <h4 className="font-black text-gray-900 dark:text-white text-base leading-none mb-1 uppercase tracking-tight">
                                        {member.name}
                                    </h4>
                                    <p className="text-xs text-gray-400 font-bold">{member.email}</p>
                                </div>
                            </div>
                            <StatusBadge status={member.status} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Access Roles</span>
                                <div className="flex flex-wrap gap-1">
                                    {context === 'workspace' && (member as WorkspaceMember).roles && (member as WorkspaceMember).roles.length > 0 ? (
                                        (member as WorkspaceMember).roles.map((role: string, idx: number) => (
                                            <RoleBadge key={idx} role={role} />
                                        ))
                                    ) : context === 'organization' && (member as OrganizationMember).role ? (
                                        <RoleBadge role={(member as OrganizationMember).role} />
                                    ) : (
                                        <span className="text-[10px] text-gray-400 italic">Unassigned</span>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-1 text-right">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Available Credits</span>
                                <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                                    {context === 'workspace'
                                        ? `${Number((member as WorkspaceMember).creditsAllocated || 0).toFixed(2)}`
                                        : `${Number((member as OrganizationMember).workspacesCount || 0)}`
                                    } <span className="text-[10px] text-gray-400 uppercase">
                                        {context === 'workspace' ? 'AQC' : 'Workspaces'}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Last Activity</span>
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                    {(member as WorkspaceMember).lastActive ? dayjs((member as WorkspaceMember).lastActive).fromNow() : 'Never'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onAssignRole && onAssignRole(member.id)}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-100"
                                >
                                    <Shield className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleRemoveClick(member as WorkspaceMember)}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100"
                                >
                                    <UserX className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Remove Member Confirmation Dialog */}
            <Dialog
                isOpen={isRemoveDialogOpen}
                onClose={() => setIsRemoveDialogOpen(false)}
                width={400}
            >
                <h5 className="mb-4 text-xl font-semibold">Remove Member</h5>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Are you sure you want to remove <strong>{selectedMember?.name}</strong> from this
                    workspace? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-2">
                    <Button variant="plain" onClick={() => setIsRemoveDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={confirmRemove} className="bg-red-600 hover:bg-red-700">
                        Remove Member
                    </Button>
                </div>
            </Dialog>

            {/* Suspend Member Confirmation Dialog */}
            <Dialog
                isOpen={isSuspendDialogOpen}
                onClose={() => setIsSuspendDialogOpen(false)}
                width={400}
            >
                <h5 className="mb-4 text-xl font-semibold">Suspend Member</h5>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Are you sure you want to suspend <strong>{selectedMember?.name}</strong>? They will
                    lose access to this workspace until reactivated.
                </p>
                <div className="flex justify-end gap-2">
                    <Button variant="plain" onClick={() => setIsSuspendDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={confirmSuspend} className="bg-orange-600 hover:bg-orange-700">
                        Suspend Member
                    </Button>
                </div>
            </Dialog>
        </>
    )
}
