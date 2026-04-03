'use client'

import { Dialog, Button } from '@/components/ui'
import { AlertCircle, Trash2 } from 'lucide-react'
import type { OrganizationRole } from '../../types'

interface DeleteOrgRoleModalProps {
    isOpen: boolean
    role: OrganizationRole | null
    onClose: () => void
    isDeleting: boolean
    onConfirm: () => void
}

export default function DeleteOrgRoleModal({
    isOpen,
    role,
    onClose,
    isDeleting,
    onConfirm,
}: DeleteOrgRoleModalProps) {
    if (!role) return null

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={520}
            closable={!isDeleting}
            contentClassName="p-0 border-none bg-transparent"
        >
            <div className="bg-white dark:bg-gray-950 rounded-[2.5rem] overflow-hidden shadow-3xl animate-in zoom-in-95 duration-300">
                {/* Header with Danger Icon */}
                <div className="relative p-10 overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 text-center">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl" />

                    <div className="relative z-10 flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950 rounded-[2rem] flex items-center justify-center border border-rose-100 dark:border-rose-900 shadow-sm scale-110">
                            <Trash2 className="h-10 w-10 text-rose-500" />
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs font-black text-rose-600 opacity-80 whitespace-nowrap">Security Alert</span>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Delete Role</h3>
                        </div>
                    </div>
                </div>

                <div className="p-10 space-y-8">
                    {/* Confirmation Message */}
                    <div className="text-center space-y-4">
                        <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                            Are you sure you want to delete the <span className="font-black text-gray-900 dark:text-white tracking-tight">&quot;{role.name}&quot;</span> role?
                        </p>

                        <div className="p-5 bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-100/50 dark:border-amber-800/30 rounded-2xl flex items-start gap-4">
                            <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-[11px] font-bold text-amber-800 dark:text-amber-300/80 leading-relaxed text-left italic">
                                This action will permanently remove this role. Any users currently assigned to this role may lose their permissions until reassigned.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-2">
                        <Button
                            variant="default"
                            onClick={onClose}
                            disabled={isDeleting}
                            className="h-14 flex-1 rounded-2xl font-black text-xs bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 border-none transition-all text-gray-600 dark:text-gray-400"
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="solid"
                            onClick={onConfirm}
                            disabled={isDeleting}
                            loading={isDeleting}
                            className="h-14 flex-1 rounded-2xl font-black text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-200/50 dark:shadow-none transition-all group overflow-hidden relative"
                        >
                            <span className="relative z-10">{isDeleting ? 'Removing...' : 'Delete Role'}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </Button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
