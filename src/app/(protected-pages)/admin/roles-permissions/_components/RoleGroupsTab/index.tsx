
import { Shield, Users, Lock, ChevronRight, Layers } from 'lucide-react'
import { Card, Badge, Button } from '@/components/ui'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { Role } from '../../types'
import classNames from '@/utils/classNames'

const GROUP_CONFIG = {
    System: {
        icon: Shield,
        color: 'text-amber-600',
        bg: 'bg-amber-50 dark:bg-amber-900/10',
        border: 'border-amber-100 dark:border-amber-800/20',
        description: 'Core system roles that cannot be deleted. These are essential for platform operations.'
    },
    Custom: {
        icon: Lock,
        color: 'text-purple-600',
        bg: 'bg-purple-50 dark:bg-purple-900/10',
        border: 'border-purple-100 dark:border-purple-800/20',
        description: 'Custom roles created to match specific operational requirements.'
    }
}

export default function RoleGroupsTab({ searchTerm = '' }: { searchTerm?: string }) {
    const { roles } = useSelector((state: RootState) => state.rolesPermissions)

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const groups = filteredRoles.reduce((acc, role) => {
        const type = role.type || (role.isSystem ? 'System' : 'Custom')
        if (!acc[type]) acc[type] = []
        acc[type].push(role)
        return acc
    }, {} as Record<string, Role[]>)

    if (filteredRoles.length === 0 && searchTerm) {
        return null // Main page will show no results
    }

    return (
        <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {Object.entries(groups).map(([groupName, groupRoles]) => {
                const config = GROUP_CONFIG[groupName as keyof typeof GROUP_CONFIG] || GROUP_CONFIG.Custom
                const Icon = config.icon

                return (
                    <Card
                        key={groupName}
                        className="p-8 bg-white dark:bg-gray-900 border-none shadow-xl shadow-gray-200/50 dark:shadow-none border border-transparent hover:border-primary/5 transition-all"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                            <div className="flex items-center gap-6">
                                <div className={classNames(
                                    "p-5 rounded-[2rem] border transition-all duration-500",
                                    config.bg,
                                    config.color,
                                    config.border
                                )}>
                                    <Icon className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                                            {groupName} Roles
                                        </h2>
                                        <Badge className={classNames("font-bold text-xs border-none px-3 py-1", config.bg, config.color)}>
                                            {groupRoles.length} Roles
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-xl">
                                        {config.description}
                                    </p>
                                </div>
                            </div>

                            <Button variant="plain" className="h-12 px-6 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-none gap-2 shrink-0">
                                <span className="text-xs font-bold">Manage Group</span>
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {groupRoles.map((role) => (
                                <div
                                    key={role.id}
                                    className="p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                            {role.name}
                                        </h4>
                                        <div className="p-1 px-2 rounded-lg bg-white dark:bg-gray-900 text-gray-400">
                                            <Users className="w-3 h-3" />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-gray-400">
                                            {role.userCount} Users
                                        </span>
                                        <span className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                            Details
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )
            })}
        </div>
    )
}
