'use client'

import { useState, useEffect } from 'react'
import { Dialog, Button, Checkbox, Notification, toast, Avatar } from '@/components/ui'
import { Shield, X, User, CheckCircle2 } from 'lucide-react'
import type { WorkspaceMember, WorkspaceRole } from '../types'
import classNames from '@/utils/classNames'

interface AssignRoleDialogProps {
    isOpen: boolean
    onClose: () => void
    member: WorkspaceMember | null
    roles: WorkspaceRole[]
    onSave: (memberId: string, roles: string[]) => Promise<void>
    isLoading?: boolean
}

export default function AssignRoleDialog({
    isOpen,
    onClose,
    member,
    roles,
    onSave,
    isLoading,
}: AssignRoleDialogProps) {
    const [selectedRoles, setSelectedRoles] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (member && member.roles) {
            // Find role IDs from role names
            const roleIds = roles
                .filter((r) => member.roles.includes(r.name))
                .map((r) => r.id)
            setSelectedRoles(roleIds)
        } else {
            setSelectedRoles([])
        }
    }, [member, roles])

    const handleRoleToggle = (roleId: string) => {
        setSelectedRoles((prev) =>
            prev.includes(roleId)
                ? prev.filter((r) => r !== roleId)
                : [...prev, roleId],
        )
    }

    const handleSubmit = async () => {
        if (!member) return

        if (selectedRoles.length === 0) {
            toast.push(
                <Notification type="warning" duration={2000}>
                    Please select at least one role
                </Notification>,
            )
            return
        }

        setIsSubmitting(true)
        try {
            await onSave(member.id, selectedRoles)
            toast.push(
                <Notification type="success" duration={2000}>
                    Roles updated successfully
                </Notification>,
            )
            onClose()
        } catch (error) {
            // Error handled by parent
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!member) return null

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={640}
            closable={false}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
            contentClassName="!shadow-none"
        >
            <div className="relative">
                {/* Custom Header */}
                <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Manage Access</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Control roles and permissions for team members</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group"
                    >
                        <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* User Profile Summary */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl opacity-50 blur shadow-sm" />
                        <div className="relative flex items-center gap-4 p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
                            <Avatar
                                size={48}
                                src={member.avatar}
                                alt={member.name}
                                shape="circle"
                                className="ring-4 ring-gray-50 dark:ring-gray-800 shadow-inner"
                            />
                            <div className="flex-1 min-w-0">
                                <h4 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight truncate">{member.name}</h4>
                                <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 truncate">{member.email}</p>
                            </div>
                            <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Active Member</span>
                            </div>
                        </div>
                    </div>

                    {/* Roles Selection Area */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pl-1">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available Role Definitions</label>
                            </div>
                            <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 rounded">
                                {selectedRoles.length} Selected
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                            {roles.length === 0 ? (
                                <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">No roles defined for this workspace</p>
                                </div>
                            ) : (
                                roles
                                    .filter(role => role.name.toLowerCase() !== 'viewer')
                                    .map(role => ({
                                        ...role,
                                        name: role.name.toLowerCase() === 'viewer' ? 'Super Admin' : role.name
                                    }))
                                    .concat(roles.find(r => r.name.toLowerCase() === 'viewer') ? [{
                                        ...roles.find(r => r.name.toLowerCase() === 'viewer')!,
                                        name: 'Super Admin',
                                        description: 'Full workspace control and administrative access.'
                                    }] : [])
                                    .map((role) => (
                                        <label
                                            key={role.id}
                                            className={classNames(
                                                "flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer group",
                                                selectedRoles.includes(role.id)
                                                    ? "bg-primary/5 border-primary shadow-sm"
                                                    : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-primary/50"
                                            )}
                                        >
                                            <div className="mt-1">
                                                <Checkbox
                                                    checked={selectedRoles.includes(role.id)}
                                                    onChange={() => handleRoleToggle(role.id)}
                                                    className="!rounded-md"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={classNames(
                                                        "text-xs font-black uppercase tracking-tight",
                                                        selectedRoles.includes(role.id) ? "text-primary" : "text-gray-900 dark:text-white"
                                                    )}>
                                                        {role.name}
                                                    </span>
                                                    {role.isCustom && (
                                                        <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded">Custom</span>
                                                    )}
                                                </div>
                                                {role.description && (
                                                    <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 leading-relaxed">
                                                        {role.description}
                                                    </p>
                                                )}
                                            </div>
                                        </label>
                                    ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-8 pb-10 pt-0 flex gap-4 bg-white dark:bg-gray-900">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex-1 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-[11px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-[0.2em] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || isLoading || roles.length === 0}
                        className="flex-1 h-14 bg-primary hover:bg-primary-deep text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Updating...</span>
                            </div>
                        ) : (
                            <>
                                <Shield className="w-4 h-4 transition-transform group-hover:scale-110" />
                                <span>Apply Changes</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Dialog>
    )
}
