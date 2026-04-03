
import { Shield, Lock, Info, Briefcase, CreditCard, Bot, Settings, Users, Box, Activity } from 'lucide-react'
import { Card, Badge, Tooltip, Spinner } from '@/components/ui'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '@/store'
import { useEffect } from 'react'
import { fetchPermissions } from '@/store/slices/rolesPermissions/rolesPermissionsThunk'
import classNames from '@/utils/classNames'

const getCategoryIcon = (category: string) => {
    const c = category.toLowerCase()
    if (c.includes('organization') || c.includes('workspace')) return Briefcase
    if (c.includes('billing') || c.includes('revenue') || c.includes('credit')) return CreditCard
    if (c.includes('copilot') || c.includes('agent')) return Bot
    if (c.includes('settings')) return Settings
    if (c.includes('user') || c.includes('team') || c.includes('role')) return Users
    if (c.includes('model')) return Box
    if (c.includes('analytics') || c.includes('dashboard')) return Activity
    return Shield
}

export default function PermissionsTab({ searchTerm = '' }: { searchTerm?: string }) {
    const dispatch = useAppDispatch()
    const { permissions, loading } = useSelector((state: RootState) => state.rolesPermissions)

    useEffect(() => {
        if (permissions.length === 0) {
            dispatch(fetchPermissions())
        }
    }, [dispatch, permissions.length])

    const filteredPermissions = permissions.map(group => ({
        ...group,
        permissions: group.permissions.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(group => group.permissions.length > 0)

    if (loading && permissions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
                <Spinner size={32} />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">Syncing Permissions Catalog...</p>
            </div>
        )
    }

    if (filteredPermissions.length === 0 && searchTerm) {
        return null
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {filteredPermissions.map((group) => {
                const CategoryIcon = getCategoryIcon(group.category)
                return (
                    <div key={group.id} className="space-y-6">
                        {/* Elegant Category Header */}
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center text-primary transition-transform hover:rotate-6">
                                    <CategoryIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                                        {group.category}
                                    </h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                                        {group.permissions.length} Unified Permissions
                                    </p>
                                </div>
                            </div>
                            <div className="h-px flex-1 mx-8 bg-gradient-to-r from-gray-100 via-gray-50 to-transparent dark:from-gray-800 dark:via-gray-800/50 hidden md:block" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {group.permissions.map((permission) => (
                                <Card
                                    key={permission.id}
                                    className="group relative p-6 bg-white dark:bg-gray-900 border-none shadow-xl shadow-gray-200/50 dark:shadow-none hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-primary/20 rounded-[2rem] overflow-hidden"
                                >
                                    {/* Glossy Overlay Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="space-y-1.5 flex-1 pr-4">
                                                <h4 className="text-base font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors leading-tight">
                                                    {permission.name}
                                                </h4>
                                                <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed line-clamp-2">
                                                    {permission.description}
                                                </p>
                                            </div>
                                            {permission.isSensitive && (
                                                <Tooltip title="Elevated Privilege - Use with caution">
                                                    <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100/50 dark:border-amber-700/30 text-amber-600 shadow-sm">
                                                        <Lock className="w-4 h-4" />
                                                    </div>
                                                </Tooltip>
                                            )}
                                        </div>

                                        <div className="mt-auto pt-5 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-mono font-bold text-gray-400 dark:text-gray-500 tracking-tighter uppercase">
                                                    Ref:
                                                </span>
                                                <span className="text-[10px] font-mono font-black text-gray-400 dark:text-gray-500">
                                                    {permission.id}
                                                </span>
                                            </div>
                                            {permission.isSensitive && (
                                                <span className="text-[9px] font-black text-amber-600/80 dark:text-amber-500/80 uppercase tracking-[0.2em]">
                                                    High Access
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
