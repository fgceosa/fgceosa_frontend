import { Crown, Shield, Eye, Users, Lock, MoreVertical, Edit, Trash2 } from 'lucide-react'
import { Card, Button, Dropdown } from '@/components/ui'
import type { OrganizationRole } from '../../types'
import classNames from '@/utils/classNames'

interface OrgRoleCardProps {
    role: OrganizationRole
    onView: (role: OrganizationRole) => void
    onEdit: (role: OrganizationRole) => void
    onDelete: (role: OrganizationRole) => void
    compact?: boolean
}

const formatRoleName = (name: string) => {
    const map: Record<string, string> = {
        'org_super_admin': 'Super Admin',
        'org_admin': 'Admin',
        'member': 'Member'
    }
    if (map[name]) return map[name]

    // Fallback: replace underscores with spaces and capitalize
    return name
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

const getIcon = (roleName: string) => {
    const lower = roleName.toLowerCase()
    if (lower.includes('super')) return Crown
    if (lower.includes('admin')) return Shield
    if (lower.includes('member')) return Users
    return Shield
}

export default function OrgRoleCard({ role, onView, onEdit, onDelete, compact = false }: OrgRoleCardProps) {
    const Icon = getIcon(role.name)
    const badgeType = role.isSystem ? 'System' : 'Custom'

    // Icon Configuration
    let iconColor = 'text-primary'
    let iconBg = 'bg-primary/5 border-primary/10'

    if (role.name.toLowerCase().includes('super')) {
        iconColor = 'text-purple-600'
        iconBg = 'bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800'
    } else if (role.name.toLowerCase().includes('admin')) {
        iconColor = 'text-indigo-600'
        iconBg = 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800'
    }

    if (compact) {
        return (
            <Card className="p-4 bg-white dark:bg-gray-900 rounded-2xl border-none shadow-lg shadow-gray-200/50 dark:shadow-none transition-all hover:scale-[1.01] border border-transparent hover:border-primary/10 group flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={classNames(
                        "p-3 rounded-xl border shrink-0 transition-all duration-500",
                        iconBg,
                        iconColor
                    )}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white tracking-tight truncate group-hover:text-primary transition-colors">
                                {formatRoleName(role.name)}
                            </h3>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20 rounded-md shrink-0">
                                {role.isSystem ? (
                                    <Shield className="w-2.5 h-2.5 text-amber-500" />
                                ) : (
                                    <Lock className="w-2.5 h-2.5 text-amber-500" />
                                )}
                                <span className="text-xs font-black text-amber-600 dark:text-amber-500">
                                    {badgeType}
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">
                            {role.description}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                    <div className="h-8 w-px bg-gray-100 dark:bg-gray-800 mx-2" />
                    <div className="flex items-center gap-1">
                        <Button
                            variant="plain"
                            size="sm"
                            className="text-gray-400 hover:text-primary"
                            icon={<Eye className="w-4 h-4" />}
                            onClick={() => onView(role)}
                        />
                        <Button
                            variant="plain"
                            size="sm"
                            className="text-gray-400 hover:text-primary"
                            icon={<Edit className="w-4 h-4" />}
                            onClick={() => onEdit(role)}
                        />
                        {!role.isSystem && (
                            <Button
                                variant="plain"
                                size="sm"
                                className="text-gray-400 hover:text-red-500"
                                icon={<Trash2 className="w-4 h-4" />}
                                onClick={() => onDelete(role)}
                            />
                        )}
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <Card className="relative p-6 bg-white dark:bg-gray-900 rounded-[2rem] border-none shadow-xl shadow-gray-200/50 dark:shadow-none transition-all hover:scale-[1.02] hover:shadow-2xl border border-transparent hover:border-primary/10 group h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className={classNames(
                        "p-3.5 rounded-2xl border transition-all duration-500",
                        iconBg,
                        iconColor
                    )}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20 rounded-lg">
                        {role.isSystem ? (
                            <Shield className="w-3 h-3 text-amber-500" />
                        ) : (
                            <Lock className="w-3 h-3 text-amber-500" />
                        )}
                        <span className="text-xs font-black text-amber-600 dark:text-amber-500 top-px relative">
                            {badgeType}
                        </span>
                    </div>
                </div>

                <Dropdown
                    placement="bottom-end"
                    renderTitle={
                        <Button
                            variant="plain"
                            size="sm"
                            className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            icon={<MoreVertical className="w-5 h-5" />}
                        />
                    }
                >
                    <Dropdown.Item eventKey="view" onClick={() => onView(role)}>
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span className="text-xs font-bold">View Permission</span>
                        </div>
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="edit" onClick={() => onEdit(role)}>
                        <div className="flex items-center gap-2">
                            <Edit className="w-4 h-4" />
                            <span className="text-xs font-bold">Edit Role</span>
                        </div>
                    </Dropdown.Item>
                    {!role.isSystem && (
                        <Dropdown.Item eventKey="delete" onClick={() => onDelete(role)}>
                            <div className="flex items-center gap-2 text-red-600">
                                <Trash2 className="w-4 h-4" />
                                <span className="text-xs font-bold text-red-600">Delete Role</span>
                            </div>
                        </Dropdown.Item>
                    )}
                </Dropdown>
            </div>

            <div className="flex-1 space-y-4">
                <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight leading-tight group-hover:text-primary transition-colors">
                        {formatRoleName(role.name)}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed mt-2 line-clamp-3">
                        {role.description}
                    </p>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded text-xs font-black bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {role.userCount || 0} {role.userCount === 1 ? 'Member' : 'Members'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-black bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {role.permissions.length} Permissions
                    </span>
                </div>

                <button
                    onClick={() => onView(role)}
                    className="text-xs font-black text-primary hover:underline"
                >
                    View Permissions
                </button>
            </div>
        </Card>
    )
}
