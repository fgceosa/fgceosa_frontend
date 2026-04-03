import { useState, useEffect } from 'react'
import { Dialog, Select, Button } from '@/components/ui'
import { UserCog, ShieldCheck, X } from 'lucide-react'
import type { OrganizationRole, OrganizationMember } from '../../types'

interface UpdateOrgRoleDialogProps {
    isOpen: boolean
    onClose: () => void
    member: OrganizationMember | null
    roles: OrganizationRole[]
    onUpdate: (data: { memberId: string; role: string }) => Promise<void>
}

export default function UpdateOrgRoleDialog({
    isOpen,
    onClose,
    member,
    roles,
    onUpdate
}: UpdateOrgRoleDialogProps) {
    const [selectedRole, setSelectedRole] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (isOpen && member) {
            setSelectedRole(member.role)
        }
    }, [isOpen, member])

    const handleSubmit = async () => {
        if (!member || !selectedRole) return

        setIsSubmitting(true)
        try {
            await onUpdate({ memberId: member.id, role: selectedRole })
            onClose()
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Helper function to format role names for display
    const formatRoleName = (roleName: string): string => {
        return roleName
            .replace('org_super_admin', 'Super Admin')
            .replace('org_admin', 'Admin')
            .replace('org_', '')  // Remove org_ prefix from other roles
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
    }

    const roleOptions = roles
        .filter(role => !role.name.toLowerCase().includes('viewer'))
        .map(role => ({
            label: formatRoleName(role.name),
            value: role.name
        }))

    if (!member) return null

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={500}
            closable={false}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
            contentClassName="!shadow-none"
        >
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <UserCog className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white leading-none">
                            Update Role
                        </h3>
                        <p className="text-[10px] font-bold text-gray-400 mt-2">
                            Change permissions for {member.name}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group"
                >
                    <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                </button>
            </div>

            <div className="px-8 py-8 space-y-6">
                {/* Role Selection */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 pl-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        <label className="text-[10px] font-black text-gray-400">Select New Identity Role</label>
                    </div>
                    <Select
                        options={roleOptions}
                        value={roleOptions.find(opt => opt.value === selectedRole)}
                        onChange={(opt) => setSelectedRole(opt?.value || '')}
                        className="rounded-xl"
                        placeholder="Select Role"
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="px-8 pb-8 pt-0 flex gap-4">
                <button
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="flex-1 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-[11px] font-black text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
                >
                    Cancel
                </button>
                <Button
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    disabled={!selectedRole || selectedRole === member.role}
                    variant="solid"
                    className="flex-1 h-14 bg-primary hover:bg-primary-deep text-white font-black text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50"
                >
                    <UserCog className="w-4 h-4 transition-transform group-hover:rotate-12" />
                    <span>Update Role</span>
                </Button>
            </div>
        </Dialog>
    )
}
