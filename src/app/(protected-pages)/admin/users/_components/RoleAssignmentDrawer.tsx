import { useState, useEffect } from 'react'
import { Drawer, Button, Notification, toast, Spinner, Badge } from '@/components/ui'
import { Shield, Check, AlertCircle, User, Mail, ShieldCheck, Zap, Layers, X } from 'lucide-react'
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

            toast.push(<Notification type="success" title="Success">Role updated successfully</Notification>)
            dispatch(fetchUsers())
            onClose()
        } catch (error: any) {
            toast.push(
                <Notification type="danger" title="Update Failed">
                    {typeof error === 'string' ? error : 'Failed to update role'}
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
            closable={false}
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            headerClass="!p-0 !border-0"
            bodyClass="!p-0"
            footerClass="!p-0 !border-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800/50"
            title={null}
            footer={
                <div className="px-8 pb-8 pt-6 flex flex-col gap-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    <div className="flex gap-3 justify-end w-full items-center ml-auto">
                        <button
                            onClick={onClose}
                            disabled={isSaving}
                            className="px-8 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-[14px] font-bold text-gray-500 dark:text-gray-400 capitalize hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || selectedRole?.name === user?.role || (isOwner && selectedRole?.name !== user?.role)}
                            className="min-w-[180px] px-8 h-14 bg-[#8B0000] text-white font-bold capitalize text-[14px] rounded-2xl shadow-[0_12px_24px_-10px_rgba(139,0,0,0.5)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 border-none group disabled:opacity-50"
                        >
                            <ShieldCheck className="w-5 h-5 transition-transform group-hover:scale-110" />
                            <span>{isSaving ? 'Saving...' : 'Apply Role'}</span>
                        </button>
                    </div>
                    {isOwner && (
                        <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest text-center mt-2">
                            Note: Platform Owner role cannot be changed here
                        </p>
                    )}
                </div>
            }
        >
            <div className="flex flex-col h-full bg-white dark:bg-gray-900 pb-8">
                {/* Header */}
                <div className="px-8 pt-8 pb-6 border-b border-gray-100 dark:border-gray-800/50 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-red-50 dark:bg-red-900/10 rounded-2xl flex items-center justify-center border border-red-100 dark:border-red-900/30 shadow-sm">
                            <ShieldCheck className="w-7 h-7 text-[#8B0000]" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-none">Update Role</h3>
                            <div className="flex items-center gap-2 mt-2">
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
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group"
                    >
                        <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 no-scrollbar">
                    {/* Warning Card */}
                    <div className="relative overflow-hidden p-6 rounded-[2rem] bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20 group">
                        <div className="relative z-10 flex gap-4">
                            <div className="mt-0.5 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-amber-100 dark:border-amber-800/30 shrink-0">
                                <AlertCircle className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[12px] font-black text-amber-900 dark:text-amber-400 uppercase tracking-tight">Important</h4>
                                <p className="text-xs text-amber-700/80 dark:text-amber-500/80 font-medium leading-relaxed">
                                    Changing a user's role will update their permissions and dashboard access immediately.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Current Role */}
                    <div className="space-y-3">
                        <label className="text-[13px] font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight leading-none pl-1">Current Role</label>
                        <div className="p-5 rounded-2xl bg-gray-50/50 dark:bg-gray-800/10 border border-gray-100 dark:border-gray-800 shadow-inner flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-[#8B0000]/10">
                                    <ShieldCheck className="w-5 h-5 text-[#8B0000]" />
                                </div>
                                <div>
                                    <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide">
                                        {user?.role || 'Member'}
                                    </div>
                                    <div className="text-[10px] text-gray-400 font-bold capitalize tracking-tight mt-0.5">Active role</div>
                                </div>
                            </div>
                            <Badge content="Current" className="bg-emerald-500/10 text-emerald-500 border-none text-[9px] uppercase font-black px-3 py-1 rounded-full" />
                        </div>
                    </div>

                    {/* Role Selection */}
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <div className="w-12 h-12 border-4 border-[#8B0000]/10 border-t-[#8B0000] rounded-full animate-spin" />
                            <p className="text-[12px] font-black text-[#8B0000] uppercase tracking-widest animate-pulse">Loading roles...</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* System Roles */}
                            {systemRoles.length > 0 && (
                                <div className="space-y-4">
                                    <label className="text-[13px] font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight leading-none pl-1 flex items-center justify-between">
                                        <span className="flex items-center gap-2"><Layers size={14} /> System Roles</span>
                                        <span className="text-[10px] text-gray-400 font-bold">Built-in</span>
                                    </label>
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
                                    <label className="text-[13px] font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight leading-none pl-1 flex items-center justify-between">
                                        <span className="flex items-center gap-2"><Zap size={14} /> Custom Roles</span>
                                        <span className="text-[10px] text-gray-400 font-bold">User-created</span>
                                    </label>
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
            </div>
        </Drawer>
    )
}

function RoleOption({ role, isSelected, onClick }: { role: Role, isSelected: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={classNames(
                "w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 group relative overflow-hidden",
                isSelected
                    ? "bg-[#8B0000]/[0.03] dark:bg-[#8B0000]/[0.05] border-[#8B0000] shadow-lg shadow-[#8B0000]/5"
                    : "bg-gray-50/50 dark:bg-gray-800/10 border-gray-100 dark:border-gray-800 hover:border-[#8B0000]/30 hover:bg-white dark:hover:bg-gray-800 shadow-inner"
            )}
        >
            <div className="flex gap-4 items-start relative z-10">
                <div className={classNames(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                    isSelected
                        ? "bg-[#8B0000] text-white shadow-[0_8px_16px_-6px_rgba(139,0,0,0.4)]"
                        : "bg-white dark:bg-gray-800 text-gray-400 group-hover:text-[#8B0000] border border-gray-100 dark:border-gray-700 shadow-sm"
                )}>
                    {isSelected ? <Check size={20} className="stroke-[3]" /> : <Shield size={18} />}
                </div>

                <div className="space-y-1 pr-8">
                    <div className="flex items-center gap-2">
                        <h5 className={classNames(
                            "text-sm font-black transition-colors",
                            isSelected ? "text-[#8B0000]" : "text-gray-900 dark:text-white"
                        )}>
                            {role.name}
                        </h5>
                        {role.isSystem && (
                            <Badge content="System" className="bg-[#8B0000]/10 text-[#8B0000] border-none text-[8px] font-black uppercase tracking-tighter px-1.5 leading-none h-4" />
                        )}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed line-clamp-2">
                        {role.description}
                    </p>
                </div>
            </div>

            {/* Permission Count */}
            <div className={classNames(
                "absolute top-4 right-4 text-[10px] font-black transition-colors",
                isSelected ? "text-[#8B0000]/30" : "text-gray-300 dark:text-gray-700 group-hover:text-[#8B0000]/20"
            )}>
                {role.permissions.length}P
            </div>

            {/* Selection Background Decor */}
            {isSelected && (
                <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12">
                    <Check size={80} className="text-[#8B0000]" />
                </div>
            )}
        </button>
    )
}
