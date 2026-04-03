import { useState, useEffect } from 'react'
import { Drawer, Button, Radio, Avatar, Notification, toast, Spinner, Alert, Badge } from '@/components/ui'
import { Shield, Check, AlertCircle, Info, User, Mail, ShieldCheck, Zap, Layers } from 'lucide-react'
import type { UserMember } from '../types'
import { apiGetRoles } from '@/services/rolesPermissions/rolesPermissionsService'
import { Role } from '@/app/(protected-pages)/admin/roles-permissions/types'
import { updateUserIdentityRole, fetchUsers } from '@/store/slices/admin/users'
import { useAppDispatch } from '@/store/hook'
import classNames from '@/utils/classNames'

interface UpdateIdentityRoleDrawerProps {
    isOpen: boolean
    onClose: () => void
    user: UserMember | null
}

export default function UpdateIdentityRoleDrawer({ isOpen, onClose, user }: UpdateIdentityRoleDrawerProps) {
    const dispatch = useAppDispatch()
    const [roles, setRoles] = useState<Role[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [selectedRoleId, setSelectedRoleId] = useState<string>('')

    // Fetch all available roles when drawer opens
    useEffect(() => {
        if (isOpen) {
            fetchRoles()
        }
    }, [isOpen])

    // Initialize selected role when user changes or roles load
    useEffect(() => {
        if (isOpen && user && roles.length > 0) {
            const currentRoleName = user.role || 'Member'
            const currentRole = roles.find(r =>
                r.name.toLowerCase().trim() === currentRoleName.toLowerCase().trim()
            )
            if (currentRole) {
                setSelectedRoleId(currentRole.id)
            }
        }
    }, [isOpen, user, roles])

    const fetchRoles = async () => {
        setIsLoading(true)
        try {
            const data = await apiGetRoles()
            setRoles(data)
        } catch (error) {
            toast.push(<Notification type="danger" title="Error">Failed to load roles</Notification>)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        if (!user || !selectedRoleId) return

        const targetRole = roles.find(r => r.id === selectedRoleId)
        if (!targetRole) return

        setIsSaving(true)
        try {
            await dispatch(updateUserIdentityRole({
                id: user.id,
                identityRole: targetRole.name
            })).unwrap()

            toast.push(<Notification type="success" title="Success">Identity role updated successfully</Notification>)
            dispatch(fetchUsers())
            onClose()
        } catch (error: any) {
            toast.push(
                <Notification type="danger" title="Update Failed">
                    {typeof error === 'string' ? error : 'Failed to update identity role'}
                </Notification>
            )
        } finally {
            setIsSaving(false)
        }
    }

    const systemRoles = roles.filter(r => r.isSystem)
    const customRoles = roles.filter(r => !r.isSystem)

    const selectedRole = roles.find(r => r.id === selectedRoleId)
    const isOwner = user?.role === 'Platform Owner' || user?.role === 'Owner'

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            width={520}
            placement="right"
            closable={true}
            headerClass="border-b-0 pb-0"
            title={
                <div className="flex items-center gap-4 py-2">
                    <div className="relative group">
                        <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-black text-lg shadow-lg shadow-primary/20 ring-4 ring-primary/10 transition-transform group-hover:scale-105">
                            {user?.name?.substring(0, 2).toUpperCase() || 'U'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-emerald-500 border-2 border-white dark:border-gray-900 flex items-center justify-center">
                            <Zap size={10} className="text-white fill-white" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                            Update Identity Role
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                <User size={10} /> {user?.name}
                            </span>
                            <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                            <span className="text-[11px] text-gray-400 font-bold tracking-tight lowercase flex items-center gap-1">
                                <Mail size={10} /> {user?.email}
                            </span>
                        </div>
                    </div>
                </div>
            }
            footer={
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex justify-between items-center p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Selected Identity</span>
                            <span className={classNames(
                                "text-sm font-black transition-all",
                                selectedRole?.name === user?.role ? "text-gray-400" : "text-primary"
                            )}>
                                {selectedRole?.name || 'No selection'}
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="plain" size="sm" onClick={onClose} className="h-11 px-6 rounded-xl font-bold">
                                Dismiss
                            </Button>
                            <Button
                                variant="solid"
                                size="sm"
                                onClick={handleSave}
                                loading={isSaving}
                                disabled={selectedRole?.name === user?.role || isOwner && selectedRole?.name !== user?.role}
                                className="h-11 px-8 rounded-xl bg-primary hover:bg-primary-dark text-white font-black shadow-lg shadow-primary/20 border-none"
                            >
                                Apply Role
                            </Button>
                        </div>
                    </div>
                    {isOwner && (
                        <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest text-center">
                            Note: Platform Owner identity cannot be changed via this menu
                        </p>
                    )}
                </div>
            }
        >
            <div className="space-y-8 py-6 px-2 scrollbar-none overflow-y-auto max-h-full">
                {/* Warning Card */}
                <div className="relative overflow-hidden p-6 rounded-[2rem] bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20 group">
                    <div className="relative z-10 flex gap-4">
                        <div className="mt-1 w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-500 shrink-0">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-black text-amber-900 dark:text-amber-400 uppercase tracking-tight">Access Scope Transformation</h4>
                            <p className="text-xs text-amber-700/80 dark:text-amber-500/80 font-medium leading-relaxed">
                                Updating the identity role will shift the user's base permissions and their default dashboard view immediately upon confirmation.
                            </p>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12 transition-transform group-hover:rotate-0">
                        <ShieldCheck size={100} />
                    </div>
                </div>

                {/* Current Role Info */}
                <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                        <Shield size={12} className="text-primary" /> Current Identity Status
                    </h4>
                    <div className="p-4 rounded-[1.5rem] bg-white dark:bg-gray-900 border-2 border-primary/20 dark:border-primary/10 shadow-xl shadow-primary/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide">
                                    {user?.role || 'Member'}
                                </div>
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Active Platform Identity</div>
                            </div>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[9px] uppercase font-black px-3 py-1 rounded-full">
                            Current
                        </Badge>
                    </div>
                </div>

                {/* Role Selection */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <Spinner className="w-8 h-8 text-primary" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">Synchronizing directory roles...</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* System Roles */}
                        {systemRoles.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 flex items-center justify-between">
                                    <span className="flex items-center gap-2"><Layers size={12} /> Priority Roles</span>
                                    <span className="opacity-50">System Level</span>
                                </h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {systemRoles.map(role => (
                                        <RoleOption
                                            key={role.id}
                                            role={role}
                                            isSelected={selectedRoleId === role.id}
                                            onClick={() => setSelectedRoleId(role.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Custom Roles */}
                        {customRoles.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 flex items-center justify-between">
                                    <span className="flex items-center gap-2"><Zap size={12} /> Custom Roles</span>
                                    <span className="opacity-50">Organization Level</span>
                                </h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {customRoles.map(role => (
                                        <RoleOption
                                            key={role.id}
                                            role={role}
                                            isSelected={selectedRoleId === role.id}
                                            onClick={() => setSelectedRoleId(role.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Drawer>
    )
}

function RoleOption({ role, isSelected, onClick }: { role: Role, isSelected: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={classNames(
                "w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 group relative overflow-hidden",
                isSelected
                    ? "bg-primary/[0.03] dark:bg-primary/[0.05] border-primary shadow-lg shadow-primary/5 ring-4 ring-primary/5"
                    : "bg-gray-50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-800 hover:border-primary/30 hover:bg-white dark:hover:bg-gray-800"
            )}
        >
            <div className="flex gap-4 items-start relative z-10">
                <div className={classNames(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                    isSelected
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "bg-white dark:bg-gray-800 text-gray-400 group-hover:text-primary border border-gray-100 dark:border-gray-700"
                )}>
                    {isSelected ? <Check size={20} className="stroke-[3]" /> : <Shield size={18} />}
                </div>

                <div className="space-y-1 pr-8">
                    <div className="flex items-center gap-2">
                        <h5 className={classNames(
                            "text-sm font-black transition-colors",
                            isSelected ? "text-primary" : "text-gray-900 dark:text-white"
                        )}>
                            {role.name}
                        </h5>
                        {role.isSystem && (
                            <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-tighter px-1.5 leading-none h-4">
                                System
                            </Badge>
                        )}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed line-clamp-2">
                        {role.description}
                    </p>
                </div>
            </div>

            {/* Permission Count Badge */}
            <div className="absolute top-4 right-4 text-[10px] font-black text-gray-300 dark:text-gray-700 group-hover:text-primary/30 transition-colors">
                {role.permissions.length}P
            </div>

            {/* Selection Background Decor */}
            {isSelected && (
                <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12">
                    <Check size={80} className="text-primary" />
                </div>
            )}
        </button>
    )
}
