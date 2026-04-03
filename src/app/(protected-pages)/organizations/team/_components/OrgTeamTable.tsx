import { Table, Avatar, Dropdown, Button } from '@/components/ui'
import { MoreHorizontal, Shield, Trash2, UserCog, Building2 } from 'lucide-react'
import classNames from '@/utils/classNames'
import type { OrganizationMember } from '../../types'
import dayjs from 'dayjs'

const { Tr, Th, Td, THead, TBody } = Table

interface OrgTeamTableProps {
    members: OrganizationMember[]
    isLoading: boolean
    onUpdateRole: (member: OrganizationMember) => void
    onRemove: (member: OrganizationMember) => void
}

export default function OrgTeamTable({ members, isLoading, onUpdateRole, onRemove }: OrgTeamTableProps) {
    const formatRoleName = (roleName: string): string => {
        // Normalize
        const role = roleName ? roleName.toLowerCase() : '';

        if (role === 'org_super_admin') return 'Super Admin'
        if (role === 'org_admin') return 'Admin'
        if (role === 'admin') return 'Admin' // Handle pure admin case

        return role
            .replace('org_', '')
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
    }

    if (isLoading && members.length === 0) {
        return (
            <div className="flex justify-center p-12">
                <span className="text-gray-400 font-bold text-xs">Loading team environment...</span>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20">
                        <th className="px-8 py-4 text-xs font-black text-gray-900 dark:text-gray-100 w-1/3">User Identity</th>
                        <th className="px-8 py-4 text-xs font-black text-gray-900 dark:text-gray-100">Identity Role</th>
                        <th className="px-8 py-4 text-xs font-black text-gray-900 dark:text-gray-100">Status</th>
                        <th className="px-8 py-4 text-xs font-black text-gray-900 dark:text-gray-100">Workspaces</th>
                        <th className="px-8 py-4 text-xs font-black text-gray-900 dark:text-gray-100">Joined</th>
                        <th className="px-8 py-4 text-xs font-black text-gray-900 dark:text-gray-100 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {members.map((member) => (
                        <tr key={member.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/10 transition-colors">
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                    <Avatar
                                        src={member.avatar}
                                        size="md"
                                        shape="circle"
                                        className="ring-4 ring-gray-100 dark:ring-gray-800 shadow-inner group-hover:ring-primary/10 transition-all shrink-0"
                                    >
                                        {member.name ? member.name.charAt(0) : '?'}
                                    </Avatar>
                                    <div>
                                        <h4 className="text-sm font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors cursor-pointer capitalize">
                                            {member.name}
                                        </h4>
                                        <p className="text-xs text-gray-900 dark:text-gray-100 font-medium truncate">
                                            {member.email}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 w-fit">
                                    <Shield className="w-3.5 h-3.5 text-indigo-500" />
                                    <span className="text-[11px] font-black text-gray-700 dark:text-gray-300">
                                        {formatRoleName(member.role)}
                                    </span>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <span className={classNames(
                                    "inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black border capitalize",
                                    member.status === 'active' ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20" :
                                        member.status === 'invited' ? "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20" :
                                            "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20"
                                )}>
                                    {member.status}
                                </span>
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Building2 className="w-4 h-4" />
                                    <span className="text-xs font-bold">{member.workspacesCount || 0}</span>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <span className="text-xs font-bold text-gray-500">
                                    {member.joinedAt && dayjs(member.joinedAt).isValid()
                                        ? dayjs(member.joinedAt).format('DD MMM YYYY')
                                        : 'N/A'}
                                </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                                <div className="flex items-center justify-end">
                                    <Dropdown
                                        renderTitle={
                                            <Button
                                                variant="plain"
                                                size="xs"
                                                className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                                            >
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        }
                                        placement="bottom-end"
                                    >
                                        <Dropdown.Item onClick={() => onUpdateRole(member)}>
                                            <div className="flex items-center gap-2 p-2">
                                                <UserCog className="w-4 h-4 text-primary" />
                                                <span className="text-sm font-bold">Change Role</span>
                                            </div>
                                        </Dropdown.Item>
                                        {/* Only show remove option for non-super-admin users */}
                                        {member.role !== 'org_super_admin' && (
                                            <Dropdown.Item onClick={() => onRemove(member)}>
                                                <div className="flex items-center gap-2 p-2 text-rose-600">
                                                    <Trash2 className="w-4 h-4" />
                                                    <span className="text-sm font-bold text-rose-600">Remove User</span>
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
    )
}
