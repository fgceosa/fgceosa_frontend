import { useState, useEffect } from 'react'
import { Dialog, Input, Button } from '@/components/ui'
import { Shield, X, Users, ShieldCheck, Sparkles, ArrowRight, ArrowLeft, Lock, ShieldAlert } from 'lucide-react'
import type { OrganizationRole } from '../../../types'
import { ORG_PERMISSIONS, PermissionGroup } from '../../constants'
import PermissionGroupList, { PermissionGroupUI } from './PermissionGroupList'
import classNames from '@/utils/classNames'

interface OrgRoleModalProps {
    isOpen: boolean
    onClose: () => void
    role: OrganizationRole | null
    mode: 'create' | 'edit'
    isSaving?: boolean
    onSave: (roleData: any) => void
}

export default function OrgRoleModal({ isOpen, onClose, role, mode, isSaving, onSave }: OrgRoleModalProps) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<{
        name: string
        description: string
        permissions: PermissionGroupUI[]
    }>({
        name: '',
        description: '',
        permissions: []
    })

    useEffect(() => {
        if (!isOpen) return

        setStep(1)

        // Initialize permissions with disabled state by default
        const initPermissions = (assignedPermissions: string[]) => {
            return ORG_PERMISSIONS.map(group => ({
                ...group,
                permissions: group.permissions.map(p => ({
                    ...p,
                    enabled: assignedPermissions.includes(p.id)
                }))
            }))
        }

        if (mode === 'edit' && role) {
            setFormData({
                name: role.name,
                description: role.description,
                permissions: initPermissions(role.permissions || [])
            })
        } else {
            setFormData({
                name: '',
                description: '',
                permissions: initPermissions([])
            })
        }
    }, [role, isOpen, mode])

    const handleTogglePermission = (groupId: string, permissionId: string) => {
        const newPermissions = formData.permissions.map(group => {
            if (group.id === groupId) {
                return {
                    ...group,
                    permissions: group.permissions.map(p => {
                        if (p.id === permissionId) {
                            return { ...p, enabled: !p.enabled }
                        }
                        return p
                    })
                }
            }
            return group
        })

        setFormData({ ...formData, permissions: newPermissions })
    }

    const handleNext = () => setStep(step + 1)
    const handleBack = () => setStep(step - 1)

    const handleSave = () => {
        // Extract enabled permission IDs
        const enabledPermissions: string[] = []
        formData.permissions.forEach(group => {
            group.permissions.forEach(p => {
                if (p.enabled) enabledPermissions.push(p.id)
            })
        })

        onSave({
            name: formData.name,
            description: formData.description,
            permissions: enabledPermissions
        })
    }

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
                {/* Premium Header */}
                <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
                                {mode === 'create' ? 'Create Role' : 'Edit Role'}
                            </h3>
                            <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mt-2">
                                Step {step} of 2: {step === 1 ? 'Basic Info' : 'Permissions'}
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

                {/* Progress Bar */}
                <div className="flex h-1 bg-gray-50/50 dark:bg-gray-800/20">
                    {[1, 2].map((s) => (
                        <div
                            key={s}
                            className={classNames(
                                "flex-1 transition-all duration-700",
                                s <= step ? "bg-primary" : "bg-transparent"
                            )}
                        />
                    ))}
                </div>

                {/* Form Body */}
                <div className="px-8 py-8 md:py-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <div className="space-y-10">
                        {/* Step 1: Identity Info */}
                        {step === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">

                                {role?.isSystem && (
                                    <div className="p-6 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/50 rounded-[2rem] flex items-start gap-5">
                                        <div className="p-3 bg-amber-100 dark:bg-amber-800 rounded-2xl shrink-0">
                                            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <h4 className="text-xs font-black text-amber-900 dark:text-amber-200 tracking-tight flex items-center gap-2">
                                                <Lock className="w-3.5 h-3.5" />
                                                System Protected
                                            </h4>
                                            <p className="text-[12px] text-amber-800/70 dark:text-amber-300/60 font-medium leading-relaxed italic">
                                                This role is system-defined. You can modify permissions but cannot rename it.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2.5">
                                    <div className="flex items-center gap-2 pl-1">
                                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                                        <label className="text-xs font-black text-gray-900 dark:text-gray-100 leading-none">
                                            Name
                                        </label>
                                    </div>
                                    <Input
                                        placeholder="e.g. Finance Manager"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        disabled={role?.isSystem}
                                        className="h-14 rounded-2xl border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-900 bg-gray-50/50 dark:bg-gray-800/30 font-bold text-base transition-all"
                                    />
                                </div>

                                <div className="space-y-2.5">
                                    <div className="flex items-center gap-2 pl-1">
                                        <Users className="w-3.5 h-3.5 text-primary" />
                                        <label className="text-xs font-black text-gray-900 dark:text-gray-100 leading-none">Description</label>
                                    </div>
                                    <Input
                                        placeholder="What is this role for?"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        textArea
                                        rows={3}
                                        className="rounded-[1.5rem] border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-900 bg-gray-50/50 dark:bg-gray-800/30 font-bold text-base resize-none transition-all leading-relaxed"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Permissions */}
                        {step === 2 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <PermissionGroupList
                                    permissions={formData.permissions}
                                    onTogglePermission={handleTogglePermission}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 pb-8 pt-6 bg-white dark:bg-gray-900 border-t border-gray-50 dark:border-gray-800">
                    <div className="flex gap-4">
                        {step === 2 ? (
                            <button
                                onClick={handleBack}
                                className="flex-1 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-xs font-black text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-mono flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </button>
                        ) : (
                            <button
                                onClick={onClose}
                                className="flex-1 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-xs font-black text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-mono"
                            >
                                Cancel
                            </button>
                        )}

                        {step === 1 ? (
                            <button
                                onClick={handleNext}
                                disabled={!formData.name}
                                className="flex-[1.5] h-14 bg-primary hover:bg-primary-deep disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 text-white font-black text-xs rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-3 group relative overflow-hidden border-none"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Next
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        ) : (
                            <Button
                                block
                                variant="solid"
                                loading={isSaving}
                                onClick={handleSave}
                                className="flex-[1.5] h-14 bg-primary hover:bg-primary-deep text-white font-black text-xs rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-3 group relative overflow-hidden border-none"
                            >
                                <Sparkles className={classNames("w-4 h-4", isSaving ? 'animate-spin' : 'group-hover:rotate-12 transition-transform')} />
                                <span className="relative z-10">{mode === 'create' ? 'Create Role' : 'Save Changes'}</span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
