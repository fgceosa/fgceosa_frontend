import { useState, useEffect } from 'react'
import { Dialog, Input, Button } from '@/components/ui'
import { Shield, X, Users, ShieldAlert, ShieldCheck, Sparkles, Lock, ArrowRight, ArrowLeft } from 'lucide-react'
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
                                {mode === 'create' ? 'Create Role' : mode === 'edit' ? 'Edit Role' : 'Role Details'}
                            </h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">
                                {mode === 'view'
                                    ? 'Overview of role permissions'
                                    : `Step ${step} of 2: ${step === 1 ? 'Basic Info' : 'Permissions'}`}
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

                {/* Progress Bar (Only for non-view mode) */}
                {mode !== 'view' && (
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
                )}

                {/* Form Body */}
                <div className="px-8 py-8 md:py-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <div className="space-y-10">
                        {/* Step 1: Identity Info */}
                        {(step === 1 || mode === 'view') && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                {/* System Role Alert */}
                                {role?.isSystem && (
                                    <div className="p-6 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/50 rounded-[2rem] flex items-start gap-5">
                                        <div className="p-3 bg-amber-100 dark:bg-amber-800 rounded-2xl shrink-0">
                                            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <h4 className="text-[11px] font-black text-amber-900 dark:text-amber-200 tracking-wider flex items-center gap-2">
                                                <Lock className="w-3.5 h-3.5" />
                                                SYSTEM PROTECTED
                                            </h4>
                                            <p className="text-[12px] text-amber-800/70 dark:text-amber-300/60 font-medium leading-relaxed italic">
                                                This is a core platform role. Changes should only be made for emergency overrides. Some permissions are locked for stability.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-2 pl-1">
                                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                                                Name
                                            </label>
                                            {!role?.isSystem && <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">Custom</span>}
                                        </div>
                                        <Input
                                            placeholder="e.g. Admin"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            disabled={mode === 'view' || role?.isSystem}
                                            className="h-14 rounded-2xl border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-900 bg-gray-50/50 dark:bg-gray-800/30 font-bold text-base transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-2 pl-1">
                                            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Icon</label>
                                        </div>
                                        <div className="h-14 flex items-center gap-3 px-4 bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-2xl">
                                            <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm">
                                                <ShieldCheck className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">Icon: {formData.icon || 'shield'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <div className="flex items-center gap-2 pl-1">
                                        <Users className="w-3.5 h-3.5 text-primary" />
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Description</label>
                                    </div>
                                    <Input
                                        placeholder="What is this role for?"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        disabled={mode === 'view'}
                                        textArea
                                        rows={3}
                                        className="rounded-[1.5rem] border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-900 bg-gray-50/50 dark:bg-gray-800/30 font-bold text-base resize-none transition-all leading-relaxed"
                                    />
                                </div>

                                {mode === 'view' && (
                                    <div className="p-8 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Users className="w-20 h-20" />
                                        </div>
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 relative z-10">Usage Stats</h4>
                                        <div className="flex items-center gap-5 relative z-10">
                                            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg border border-gray-50 dark:border-gray-700">
                                                <Users className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{role?.userCount || 0} Members</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Assigned Users</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 2: Permissions (Or joined in View mode) */}
                        {(step === 2 || mode === 'view') && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <PermissionGroupList
                                    permissions={formData.permissions || []}
                                    onTogglePermission={handleTogglePermission}
                                    disabled={mode === 'view'}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Technical Audit Footer */}
                <div className="px-8 pb-8 pt-6 bg-white dark:bg-gray-900 border-t border-gray-50 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em]">Changes are recorded for security audit</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        {mode === 'view' ? (
                            <button
                                onClick={onClose}
                                className="w-full h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-[11px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-[0.2em] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-mono"
                            >
                                Close Overview
                            </button>
                        ) : (
                            <>
                                {step === 2 ? (
                                    <button
                                        onClick={handleBack}
                                        className="flex-1 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-[11px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-[0.2em] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-mono flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back
                                    </button>
                                ) : (
                                    <button
                                        onClick={onClose}
                                        className="flex-1 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-[11px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-[0.2em] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-mono"
                                    >
                                        Cancel
                                    </button>
                                )}

                                {step === 1 ? (
                                    <button
                                        onClick={handleNext}
                                        className="flex-[1.5] h-14 bg-primary hover:bg-primary-deep text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-3 group relative overflow-hidden border-none"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            Next
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    </button>
                                ) : (
                                    <Button
                                        block
                                        variant="solid"
                                        loading={isSaving}
                                        onClick={() => onSave(formData)}
                                        className="flex-[1.5] h-14 bg-primary hover:bg-primary-deep text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-3 group relative overflow-hidden border-none"
                                    >
                                        <Sparkles className={classNames("w-4 h-4", isSaving ? 'animate-spin' : 'group-hover:rotate-12 transition-transform')} />
                                        <span className="relative z-10">{mode === 'create' ? 'Create Role' : 'Save Changes'}</span>
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
