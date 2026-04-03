import { Dialog } from '@/components/ui'
import { Shield, X, Lock, Check, ShieldAlert } from 'lucide-react'
import type { OrganizationRole } from '../../types'

interface OrgRoleDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    role: OrganizationRole | null
}

export default function OrgRoleDetailsModal({ isOpen, onClose, role }: OrgRoleDetailsModalProps) {
    if (!role) return null

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={640}
            closable={false}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
            contentClassName="!shadow-none"
        >
            {/* Premium Header */}
            <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
                            Role Details
                        </h3>
                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mt-2">
                            Overview of role permissions
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

            <div className="px-8 py-8 md:py-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    {/* Identity Info */}
                    <div className="space-y-6">
                        {role.isSystem && (
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
                                        This is a core platform role. Changes should only be made for emergency overrides. Some permissions are locked for stability.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div>
                            <h4 className="text-xs font-black text-gray-900 dark:text-gray-100 leading-none mb-2">Role Name</h4>
                            <p className="text-lg font-black text-gray-900 dark:text-white">{role.name}</p>
                        </div>

                        <div>
                            <h4 className="text-xs font-black text-gray-900 dark:text-gray-100 leading-none mb-2">Description</h4>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed">{role.description}</p>
                        </div>
                    </div>

                    {/* Permissions List */}
                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-black text-gray-900 dark:text-gray-100">Associated Permissions</h4>
                            <span className="text-[10px] font-bold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-500">{role.permissions.length} Total</span>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {role.permissions.map((perm) => (
                                <div key={perm} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 group hover:border-primary/20 transition-colors">
                                    <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors shadow-sm">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">{perm}</span>
                                </div>
                            ))}
                            {role.permissions.length === 0 && (
                                <div className="p-8 text-center bg-gray-50/30 dark:bg-gray-800/10 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-400 italic">No explicit permissions assigned to this role yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-8 pb-8 pt-6 bg-white dark:bg-gray-900 border-t border-gray-50 dark:border-gray-800">
                <button
                    onClick={onClose}
                    className="w-full h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-xs font-black text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-mono"
                >
                    Close Overview
                </button>
            </div>
        </Dialog>
    )
}
