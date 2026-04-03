import { useState, useMemo, useEffect } from 'react'
import { Dialog, Input, Checkbox, Notification, toast, Avatar, Select } from '@/components/ui'
import { UserPlus, X, ShieldCheck, Search, Users } from 'lucide-react'
import type { WorkspaceRole } from '../types'
import type { OrganizationMember } from '@/app/(protected-pages)/organizations/types'

interface InviteMemberDialogProps {
    isOpen: boolean
    onClose: () => void
    onInvite: (data: { userId: string; roles: string[] }) => Promise<void>
    roles: WorkspaceRole[]
    eligibleMembers: OrganizationMember[]
    workspaceName?: string
    isLoading?: boolean
}

export default function InviteMemberDialog({
    isOpen,
    onClose,
    onInvite,
    roles,
    eligibleMembers,
    workspaceName,
    isLoading,
}: InviteMemberDialogProps) {
    const [selectedMemberId, setSelectedMemberId] = useState<string>('')
    const [selectedRoles, setSelectedRoles] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const handleRoleToggle = (roleName: string) => {
        // Enforce single role selection
        setSelectedRoles([roleName])
    }

    // Auto-select a default role when modal opens or roles are loaded
    useEffect(() => {
        if (isOpen && roles.length > 0 && selectedRoles.length === 0) {
            // Try to find a role named 'Member' (case-insensitive)
            const memberRole = roles.find(r => r.name.toLowerCase() === 'member')
            if (memberRole) {
                setSelectedRoles([memberRole.name])
            } else {
                // Otherwise select the first available role
                setSelectedRoles([roles[0].name])
            }
        }
    }, [isOpen, roles, selectedRoles.length])

    const handleSubmit = async () => {
        const selectedMember = eligibleMembers.find(m => m.id === selectedMemberId)

        if (!selectedMember) {
            toast.push(
                <Notification type="warning" duration={2000}>
                    Please select a team member
                </Notification>,
            )
            return
        }

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
            await onInvite({
                userId: selectedMember.userId,
                roles: selectedRoles,
            })

            // Reset form
            setSelectedMemberId('')
            setSelectedRoles([])
            onClose()
        } catch (error) {
            // Error is handled by the parent component
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        if (!isSubmitting) {
            setSelectedMemberId('')
            setSelectedRoles([])
            onClose()
        }
    }

    const filteredMembers = useMemo(() => {
        if (!searchQuery) return eligibleMembers
        const lowerQ = searchQuery.toLowerCase()
        return eligibleMembers.filter(m =>
            m.name.toLowerCase().includes(lowerQ) ||
            m.email.toLowerCase().includes(lowerQ)
        )
    }, [eligibleMembers, searchQuery])

    const selectedMember = eligibleMembers.find(m => m.id === selectedMemberId)

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            closable={false}
            width={800}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
            contentClassName="!shadow-none"
        >
            <div className="relative">
                {/* Custom Header */}
                <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <UserPlus className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Add Team Member</h3>
                            <p className="text-[10px] font-black text-gray-400 mt-0.5">
                                Adding to <span className="text-primary">{workspaceName || 'Workspace'}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group disabled:opacity-50"
                    >
                        <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row h-[550px]">
                    {/* Left Column: Member Selector */}
                    <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/5 flex flex-col">
                        <div className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search team..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-10 pl-9 pr-4 rounded-xl border-none bg-white dark:bg-gray-900 shadow-sm text-sm font-bold placeholder:font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                            {filteredMembers.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                    <Users className="w-8 h-8 text-gray-300 mb-2" />
                                    <p className="text-xs text-gray-500 font-medium">No team members found.</p>
                                    <p className="text-[10px] text-gray-400 mt-1">Make sure they are added to the Organization Team first.</p>
                                </div>
                            ) : (
                                filteredMembers.map(member => (
                                    <button
                                        key={member.id}
                                        onClick={() => setSelectedMemberId(member.id)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${selectedMemberId === member.id
                                            ? 'bg-white dark:bg-gray-800 border-primary shadow-lg shadow-primary/10 ring-1 ring-primary'
                                            : 'bg-transparent border-transparent hover:bg-white dark:hover:bg-gray-800 hover:border-gray-100 dark:hover:border-gray-700'
                                            }`}
                                    >
                                        <Avatar shape="circle" size="sm" src={member.avatar || ''} className="border border-gray-100 dark:border-gray-700 shrink-0">
                                            {member.name ? member.name.charAt(0) : '?'}
                                        </Avatar>
                                        <div className="text-left overflow-hidden">
                                            <div className={`text-sm font-black truncate ${selectedMemberId === member.id ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                                                {member.name}
                                            </div>
                                            <div className="text-[10px] font-medium text-gray-400 truncate">
                                                {member.email}
                                            </div>
                                        </div>
                                        {selectedMemberId === member.id && (
                                            <div className="ml-auto">
                                                <div className="w-2 h-2 rounded-full bg-primary" />
                                            </div>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Column: Settings */}
                    <div className="w-full md:w-1/2 p-6 flex flex-col">
                        <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-1">
                            {/* Selected Member Summary */}
                            {selectedMember && (
                                <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
                                    <Avatar shape="circle" size="md" src={selectedMember.avatar || ''} className="border-2 border-white dark:border-gray-900">
                                        {selectedMember.name ? selectedMember.name.charAt(0) : '?'}
                                    </Avatar>
                                    <div>
                                        <div className="text-sm font-black text-gray-900 dark:text-white">{selectedMember.name}</div>
                                        <div className="text-xs text-primary font-bold">{selectedMember.email}</div>
                                    </div>
                                </div>
                            )}

                            {/* Roles Selection */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 pl-1">
                                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                                    <label className="text-[10px] font-black text-gray-400">Workspace Role</label>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {roles
                                        .filter(role => !role.name.toLowerCase().includes('viewer'))
                                        .map((role) => (
                                            <div
                                                key={role.id}
                                                className={`
                                                 flex items-center p-3 rounded-xl border cursor-pointer transition-all
                                                 ${selectedRoles.includes(role.name)
                                                        ? 'bg-white dark:bg-gray-800 border-primary shadow-sm'
                                                        : 'bg-gray-50/50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                                                    }
                                             `}
                                                onClick={() => handleRoleToggle(role.name)}
                                            >
                                                <Checkbox
                                                    checked={selectedRoles.includes(role.name)}
                                                    onChange={() => handleRoleToggle(role.name)}
                                                    className="mt-0.5"
                                                />
                                                <div className="ml-3">
                                                    <div className="text-xs font-black text-gray-900 dark:text-white tracking-tight">
                                                        {role.name}
                                                    </div>
                                                    {role.description && (
                                                        <div className="text-[10px] text-gray-400 font-medium leading-tight mt-0.5">
                                                            {role.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>


                        </div>

                        {/* Footer Actions */}
                        <div className="pt-6 flex gap-3 mt-auto">
                            <button
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="flex-1 h-12 rounded-xl border border-gray-100 dark:border-gray-800 text-[11px] font-black text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || isLoading || !selectedMemberId || selectedRoles.length === 0}
                                className="flex-[2] h-12 bg-primary hover:bg-primary-deep text-white font-black text-[11px] rounded-xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Adding...</span>
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4" />
                                        <span>Add to Workspace</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
