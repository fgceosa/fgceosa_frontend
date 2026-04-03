import { Layout, CreditCard, Bot, Settings, Users, Database, ShieldCheck, BarChart3, Globe } from 'lucide-react'
import PermissionItem, { PermissionUI } from './PermissionItem'
import type { PermissionDef } from '../../constants'

// Extend the Group to use PermissionUI instead of just PermissionDef
export interface PermissionGroupUI {
    id: string
    category: string
    permissions: PermissionUI[]
}

interface PermissionGroupListProps {
    permissions: PermissionGroupUI[]
    onTogglePermission: (groupId: string, permissionId: string) => void
    disabled?: boolean
}

const categoryIcons: Record<string, React.ElementType> = {
    'Organization Management': Globe,
    'Team Management': Users,
    'Workspace Management': Layout,
    'Model Library': Database,
}

export default function PermissionGroupList({ permissions, onTogglePermission, disabled }: PermissionGroupListProps) {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="flex items-center gap-2 pl-1">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <label className="text-xs font-black text-gray-900 dark:text-gray-100">Permissions</label>
            </div>

            <div className="space-y-12">
                {permissions.map((group) => {
                    const CategoryIcon = categoryIcons[group.category] || ShieldCheck
                    return (
                        <div key={group.id} className="group/pg relative">
                            <div className="flex items-center justify-between mb-6 pl-1">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-50 dark:border-gray-700 flex items-center justify-center text-gray-400 group-hover/pg:text-primary group-hover/pg:scale-110 transition-all duration-500">
                                        <CategoryIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-gray-900 dark:text-white tracking-tight leading-none">{group.category}</h4>
                                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mt-1.5">Manage {group.category.toLowerCase()} access</p>
                                    </div>
                                </div>
                                <div className="h-px flex-1 bg-gradient-to-r from-gray-100 via-gray-50/50 to-transparent dark:from-gray-800 dark:via-gray-800/20 ml-8 hidden sm:block"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-1">
                                {group.permissions.map((p) => (
                                    <PermissionItem
                                        key={p.id}
                                        permission={p}
                                        onToggle={() => onTogglePermission(group.id, p.id)}
                                        disabled={disabled}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
