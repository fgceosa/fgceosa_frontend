'use client'

import { useState, useEffect } from 'react'
import { Dialog, Input, Select, Button } from '@/components/ui'
import { Mail, ShieldCheck, UserPlus, X, MessageSquare, Layout, Building2 } from 'lucide-react'
import type { OrganizationRole, OrganizationWorkspace } from '../../types'
import { apiGetOrganizationWorkspaces } from '@/services/OrganizationService'

interface InviteOrgMemberDialogProps {
    isOpen: boolean
    onClose: () => void
    roles: OrganizationRole[]
    organizationId?: string
    onInvite: (data: { email: string; role: string; note?: string; workspace_ids?: string[] }) => Promise<void>
}

export default function InviteOrgMemberDialog({
    isOpen,
    onClose,
    roles,
    organizationId,
    onInvite
}: InviteOrgMemberDialogProps) {
    const [email, setEmail] = useState('')
    const [selectedRole, setSelectedRole] = useState<string>('')
    const [note, setNote] = useState('')
    const [selectedWorkspaceIds, setSelectedWorkspaceIds] = useState<string[]>([])
    const [availableWorkspaces, setAvailableWorkspaces] = useState<OrganizationWorkspace[]>([])
    const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Filter out viewer roles
    const filteredRoles = roles.filter(role => !role.name.toLowerCase().includes('viewer'))

    // Set default role to 'member' if available
    useEffect(() => {
        if (isOpen && !selectedRole && filteredRoles.length > 0) {
            const defaultRole = filteredRoles.find(r => r.name === 'member' || r.name === 'org_member') || filteredRoles[0]
            setSelectedRole(defaultRole.name)
        }
    }, [isOpen, filteredRoles, selectedRole])

    // Load organization workspaces when dialog opens
    useEffect(() => {
        if (isOpen && organizationId) {
            setIsLoadingWorkspaces(true)
            apiGetOrganizationWorkspaces(organizationId)
                .then((res: any) => {
                    const workspaces = res?.workspaces || []
                    setAvailableWorkspaces(workspaces)
                })
                .catch(() => setAvailableWorkspaces([]))
                .finally(() => setIsLoadingWorkspaces(false))
        }
    }, [isOpen, organizationId])

    const handleWorkspaceToggle = (workspaceId: string) => {
        setSelectedWorkspaceIds(prev =>
            prev.includes(workspaceId)
                ? prev.filter(id => id !== workspaceId)
                : [...prev, workspaceId]
        )
    }

    const handleSubmit = async () => {
        if (!email || !selectedRole) return

        setIsSubmitting(true)
        try {
            await onInvite({
                email,
                role: selectedRole,
                note: note || undefined,
                workspace_ids: selectedWorkspaceIds.length > 0 ? selectedWorkspaceIds : undefined
            })
            handleClose()
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        setEmail('')
        setSelectedRole('')
        setNote('')
        setSelectedWorkspaceIds([])
        onClose()
    }

    // Helper function to format role names for display
    const formatRoleName = (roleName: string): string => {
        return roleName
            .replace('org_super_admin', 'Super Admin')
            .replace('org_admin', 'Admin')
            .replace('org_', '')
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
    }

    const roleOptions = filteredRoles.map(role => ({
        label: formatRoleName(role.name),
        value: role.name
    }))

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            width={600}
            closable={false}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
            contentClassName="!shadow-none"
        >
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <UserPlus className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white leading-none">
                            Invite Team Member
                        </h3>
                        <p className="text-[10px] font-bold text-gray-400 mt-2">
                            Add a new user to your organization
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleClose}
                    className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group"
                >
                    <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                </button>
            </div>

            <div className="px-8 py-8 space-y-6">
                {/* Email Input */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 pl-1">
                        <Mail className="w-3.5 h-3.5 text-primary" />
                        <label className="text-[10px] font-black text-gray-400">Email Address</label>
                    </div>
                    <Input
                        type="email"
                        placeholder="colleague@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-sm font-bold"
                    />
                </div>

                {/* Role Selection */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 pl-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        <label className="text-[10px] font-black text-gray-400">Assign Identity Role</label>
                    </div>
                    <Select
                        options={roleOptions}
                        value={roleOptions.find(opt => opt.value === selectedRole)}
                        onChange={(opt) => setSelectedRole(opt?.value || '')}
                        className="rounded-xl"
                        placeholder="Select Role"
                    />
                    <p className="text-[10px] text-gray-400 px-1">
                        This role defines their permissions across the entire organization.
                    </p>
                </div>

                {/* Optional Workspace Assignment */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 pl-1">
                        <Layout className="w-3.5 h-3.5 text-primary" />
                        <label className="text-[10px] font-black text-gray-400">Assign to Workspace(s) <span className="font-medium text-gray-300">(Optional)</span></label>
                    </div>

                    {isLoadingWorkspaces ? (
                        <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 text-center">
                            <p className="text-[11px] text-gray-400 animate-pulse">Loading workspaces...</p>
                        </div>
                    ) : availableWorkspaces.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-100 dark:border-gray-800 p-4 text-center">
                            <Building2 className="w-5 h-5 text-gray-300 mx-auto mb-1.5" />
                            <p className="text-[11px] text-gray-400">No workspaces found. The member can be assigned to a workspace after joining.</p>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <div className="max-h-36 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
                                {availableWorkspaces.map((ws) => {
                                    const isSelected = selectedWorkspaceIds.includes(ws.id)
                                    return (
                                        <button
                                            key={ws.id}
                                            type="button"
                                            onClick={() => handleWorkspaceToggle(ws.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${isSelected
                                                    ? 'bg-primary/5 dark:bg-primary/10'
                                                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                                }`}
                                        >
                                            {/* Checkbox indicator */}
                                            <div className={`w-4 h-4 rounded-md flex-shrink-0 border-2 flex items-center justify-center transition-all ${isSelected
                                                    ? 'bg-primary border-primary'
                                                    : 'border-gray-200 dark:border-gray-600'
                                                }`}>
                                                {isSelected && (
                                                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
                                                        <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                )}
                                            </div>

                                            {/* Workspace avatar */}
                                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center flex-shrink-0">
                                                <span className="text-[10px] font-black text-white">
                                                    {ws.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-[12px] font-bold text-gray-900 dark:text-white truncate">{ws.name}</p>
                                                {ws.description && (
                                                    <p className="text-[10px] text-gray-400 truncate">{ws.description}</p>
                                                )}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {selectedWorkspaceIds.length > 0 && (
                        <p className="text-[10px] text-primary font-semibold px-1">
                            ✓ {selectedWorkspaceIds.length} workspace{selectedWorkspaceIds.length > 1 ? 's' : ''} selected — the member will get access automatically when they accept.
                        </p>
                    )}

                    {availableWorkspaces.length > 0 && selectedWorkspaceIds.length === 0 && (
                        <p className="text-[10px] text-gray-400 px-1">
                            If none selected, the member joins the organization only and can be assigned to workspaces later.
                        </p>
                    )}
                </div>

                {/* Optional Note */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 pl-1">
                        <MessageSquare className="w-3.5 h-3.5 text-primary" />
                        <label className="text-[10px] font-black text-gray-400">Personal Note (Optional)</label>
                    </div>
                    <textarea
                        placeholder="Hey! Join our team on Qorebit AI..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 text-sm font-medium min-h-[80px] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="px-8 pb-8 pt-0 flex gap-4">
                <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-[11px] font-black text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
                >
                    Cancel
                </button>
                <Button
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    disabled={!email || !selectedRole}
                    variant="solid"
                    className="flex-1 h-14 bg-primary hover:bg-primary-deep text-white font-black text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50"
                >
                    <UserPlus className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    <span>Send Invitation</span>
                </Button>
            </div>
        </Dialog>
    )
}
