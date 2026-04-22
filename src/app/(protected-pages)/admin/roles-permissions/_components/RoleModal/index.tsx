import { useState, useEffect } from 'react'
import { Dialog, Input, Button, Avatar } from '@/components/ui'
import { Shield, X, Users, ShieldAlert, ShieldCheck, Lock, ArrowRight, ArrowLeft } from 'lucide-react'
import { HiOutlineExclamation } from 'react-icons/hi'
import type { Role } from '../../types'
import PermissionGroupList from './PermissionGroupList'
import { apiGetAllPermissions, apiGetRoleById } from '@/services/rolesPermissions/rolesPermissionsService'
import classNames from '@/utils/classNames'

interface RoleModalProps {
    isOpen: boolean
    onClose: () => void
    role: Role | null
    mode: 'create' | 'edit' | 'view'
    isSaving?: boolean
    onSave: (role: Partial<Role>) => void
}

export default function RoleModal({ isOpen, onClose, role, mode, isSaving, onSave }: RoleModalProps) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<Partial<Role>>({
        name: '',
        description: '',
        permissions: []
    })

    useEffect(() => {
        const loadInitialData = async () => {
            if (isOpen && (mode === 'edit' || mode === 'view') && role?.id) {
                setFormData(role)
                try {
                    const freshRole = await apiGetRoleById(role.id)
                    setFormData(freshRole)
                } catch (error) {
                    console.error('Failed to refresh role details:', error)
                }
            } else if (mode === 'create' && isOpen) {
                try {
                    const allPermissions = await apiGetAllPermissions()
                    setFormData({
                        name: '',
                        description: '',
                        permissions: allPermissions
                    })
                } catch (error) {
                    console.error('Failed to fetch permissions:', error)
                    setFormData({
                        name: '',
                        description: '',
                        permissions: []
                    })
                }
            } else {
                setFormData({
                    name: '',
                    description: '',
                    permissions: []
                })
            }
        }

        if (isOpen) {
            loadInitialData()
            setStep(1)
        }
    }, [role, isOpen, mode])

    const handleTogglePermission = (groupId: string, permissionId: string) => {
        if (mode === 'view') return

        const newPermissions = formData.permissions?.map(group => {
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

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={640}
            closable={false}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl"
            contentClassName="p-0 border-none"
        >
            <div className="p-8 sm:p-10">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center border border-red-100 dark:border-red-900/30">
                            <Shield className="w-6 h-6 text-[#8B0000]" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                                {mode === 'create' ? 'Create Role' : mode === 'edit' ? 'Edit Role' : 'Role Details'}
                            </h3>
                            {mode !== 'view' && (
                                <p className="text-xs font-bold text-gray-400 mt-1">
                                    Step {step} of 2 — {step === 1 ? 'Basic Info' : 'Permissions'}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
                    >
                        <X className="w-5 h-5 text-gray-400 hover:text-gray-900 dark:hover:text-white" />
                    </button>
                </div>

                {/* Progress Bar (Create/Edit only) */}
                {mode !== 'view' && (
                    <div className="flex h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-8">
                        {[1, 2].map((s) => (
                            <div
                                key={s}
                                className={classNames(
                                    "flex-1 transition-all duration-500",
                                    s <= step ? "bg-[#8B0000]" : "bg-transparent"
                                )}
                            />
                        ))}
                    </div>
                )}

                {/* Content */}
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2 -mr-2">
                    {/* Step 1: Basic Info */}
                    {(step === 1 || mode === 'view') && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            {/* System Role Warning */}
                            {role?.isSystem && (
                                <div className="p-5 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-2xl flex items-start gap-4">
                                    <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-xl shrink-0">
                                        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-amber-900 dark:text-amber-200 flex items-center gap-2">
                                            <Lock className="w-3 h-3" />
                                            System Role
                                        </h4>
                                        <p className="text-xs text-amber-800/70 dark:text-amber-300/60 font-medium mt-1">
                                            This is a core system role and cannot be deleted or renamed.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 ml-1">Role Name</label>
                                    <Input
                                        placeholder="Enter role name..."
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        disabled={mode === 'view' || role?.isSystem}
                                        className="h-12 rounded-xl border-gray-200 dark:border-gray-700 font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 ml-1">Icon</label>
                                    <div className="h-12 flex items-center gap-3 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl">
                                        <div className="w-7 h-7 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700 text-[#8B0000]">
                                            <ShieldCheck className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-400">{formData.icon || 'default'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1">Description</label>
                                <Input
                                    placeholder="Describe the role's responsibilities..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    disabled={mode === 'view'}
                                    textArea
                                    rows={3}
                                    className="rounded-xl border-gray-200 dark:border-gray-700 font-bold resize-none p-4"
                                />
                            </div>

                            {mode === 'view' && (
                                <div className="p-6 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800">
                                    <h4 className="text-xs font-bold text-gray-400 mb-4">Assigned Users</h4>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700">
                                            <Users className="w-6 h-6 text-[#8B0000]" />
                                        </div>
                                        <div>
                                            <p className="text-xl font-black text-gray-900 dark:text-white">{role?.userCount || 0} Members</p>
                                            <p className="text-xs text-gray-400 font-medium mt-0.5">Users assigned to this role</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Permissions */}
                    {(step === 2 || mode === 'view') && (
                        <div className="animate-in fade-in duration-300">
                            <PermissionGroupList
                                permissions={formData.permissions || []}
                                onTogglePermission={handleTogglePermission}
                                disabled={mode === 'view'}
                            />
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="pt-8 flex gap-4">
                    {mode === 'view' ? (
                        <Button
                            onClick={onClose}
                            className="w-full h-12 rounded-2xl border-none bg-gray-100 dark:bg-gray-800 font-black text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            Close
                        </Button>
                    ) : (
                        <>
                            {step === 2 ? (
                                <Button
                                    variant="plain"
                                    onClick={handleBack}
                                    className="flex-1 h-12 rounded-2xl font-black text-gray-400 border-none hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back
                                </Button>
                            ) : (
                                <Button
                                    variant="plain"
                                    onClick={onClose}
                                    className="flex-1 h-12 rounded-2xl font-black text-gray-400 border-none hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    Cancel
                                </Button>
                            )}

                            {step === 1 ? (
                                <Button
                                    variant="solid"
                                    onClick={handleNext}
                                    className="flex-[1.5] h-12 bg-[#8B0000] hover:bg-[#700000] text-white font-black rounded-2xl shadow-lg border-none flex items-center justify-center gap-2"
                                >
                                    Next
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            ) : (
                                <Button
                                    variant="solid"
                                    loading={isSaving}
                                    onClick={() => onSave(formData)}
                                    className="flex-[1.5] h-12 bg-[#8B0000] hover:bg-[#700000] text-white font-black rounded-2xl shadow-lg border-none"
                                >
                                    {mode === 'create' ? 'Create Role' : 'Save Changes'}
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Dialog>
    )
}
