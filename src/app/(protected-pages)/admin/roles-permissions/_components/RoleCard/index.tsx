import { Crown, Shield, Settings, Eye, Users, MoreVertical, Edit, Trash2, Lock, Bot, CreditCard } from 'lucide-react'
import { Card, Button, Dropdown } from '@/components/ui'
import type { Role } from '../../types'
import classNames from '@/utils/classNames'

interface RoleCardProps {
    role: Role
    onEdit: (role: Role) => void
    onDelete: (role: Role) => void
    onView: (role: Role) => void
    compact?: boolean
}

const getIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
        case 'crown': return Crown
        case 'shield': return Shield
        case 'settings': return Settings
        case 'eye': return Eye
        case 'bot': return Bot
        case 'credit-card':
        case 'creditcard': return CreditCard
        case 'users': return Users
        default: return Shield
    }
}

const getRoleConfig = (role: Role) => {
    // Determine badge type
    let badgeType = role.type || (role.isSystem ? 'System' : 'Custom')

    // Icon Configuration
    let iconColor = 'text-primary'
    let iconBg = 'bg-primary/5 border-primary/10'

    if (role.name.toLowerCase().includes('billing') || role.icon === 'creditCard') {
        iconColor = 'text-emerald-500'
        iconBg = 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800'
    }

    return { badgeType, iconColor, iconBg }
}

export default function RoleCard({ role, onEdit, onDelete, onView, compact = false }: RoleCardProps) {
    const Icon = getIcon(role.icon)
    const { badgeType, iconColor, iconBg } = getRoleConfig(role)

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
                                {role.name}
                            </h3>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20 rounded-md shrink-0">
                                {badgeType === 'System' ? (
                                    <Shield className="w-2.5 h-2.5 text-amber-500" />
                                ) : (
                                    <Lock className="w-2.5 h-2.5 text-amber-500" />
                                )}
                                <span className="text-[9px] font-bold text-amber-600 dark:text-amber-500">
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
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-xs font-bold text-gray-400">
                            {role.userCount}
                        </span>
                    </div>

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
                        {role.type !== 'System' && !role.isSystem && (
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
                        {badgeType === 'System' ? (
                            <Shield className="w-3 h-3 text-amber-500" />
                        ) : (
                            <Lock className="w-3 h-3 text-amber-500" />
                        )}
                        <span className="text-[9px] font-bold text-amber-600 dark:text-amber-500 top-px relative">
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
                            <span className="text-xs font-bold">View</span>
                        </div>
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="edit" onClick={() => onEdit(role)}>
                        <div className="flex items-center gap-2">
                            <Edit className="w-4 h-4" />
                            <span className="text-xs font-bold">Edit</span>
                        </div>
                    </Dropdown.Item>
                    {role.type !== 'System' && !role.isSystem && (
                        <Dropdown.Item eventKey="delete" onClick={() => onDelete(role)}>
                            <div className="flex items-center gap-2 text-red-600">
                                <Trash2 className="w-4 h-4" />
                                <span className="text-xs font-bold">Delete</span>
                            </div>
                        </Dropdown.Item>
                    )}
                </Dropdown>
            </div>

            <div className="flex-1 space-y-4">
                <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight leading-tight group-hover:text-primary transition-colors">
                        {role.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed mt-2 line-clamp-2">
                        {role.description}
                    </p>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                        <Users className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-gray-400">
                        {role.userCount} Users
                    </span>
                </div>

                <button
                    onClick={() => onView(role)}
                    className="text-xs font-bold text-primary hover:underline"
                >
                    View Details
                </button>
            </div>
        </Card>
    )
}
