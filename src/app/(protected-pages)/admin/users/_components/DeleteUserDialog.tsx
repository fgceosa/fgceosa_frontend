
import React from 'react'
import { Dialog, Button } from '@/components/ui'
import { Trash2, AlertTriangle, User } from 'lucide-react'
import type { UserMember } from '../types'

interface DeleteUserDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (force?: boolean) => void
    user: UserMember
    isDeleting?: boolean
    dependencyError?: string | null
    mustForce?: boolean
}

export default function DeleteUserDialog({
    isOpen,
    onClose,
    onConfirm,
    user,
    isDeleting = false,
    dependencyError = null,
    mustForce = false,
}: DeleteUserDialogProps) {
    return (
        <Dialog
            isOpen={isOpen}
            onClose={() => !isDeleting && onClose()}
            width={440}
            className="p-0 overflow-hidden"
            closable={!isDeleting}
        >
            <div className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                    <div className={`w-16 h-16 ${mustForce ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600'} dark:text-rose-400 rounded-full flex items-center justify-center mb-4`}>
                        {mustForce ? <AlertTriangle className="w-8 h-8" /> : <Trash2 className="w-8 h-8" />}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {mustForce ? 'Confirm Force Deletion' : 'Delete User'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                        {mustForce
                            ? 'This user has active records (projects, transactions, etc.) linked to them. Do you want to continue?'
                            : 'Are you sure you want to delete this user? This action cannot be undone.'}
                    </p>
                </div>

                {/* User Card */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-600">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <User className="w-6 h-6 text-gray-400" />
                        )}
                    </div>
                    <div className="text-left overflow-hidden">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">
                            {user.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                        </p>
                    </div>
                </div>

                {/* Dependency Warning */}
                {mustForce && dependencyError && (
                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-lg p-3 mb-6">
                        <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed text-left font-medium">
                            {dependencyError}
                        </p>
                    </div>
                )}

                <div className={`bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800 rounded-lg p-3 flex gap-3 items-start mb-6 ${mustForce ? 'opacity-50' : ''}`}>
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed text-left">
                        This will permanently remove the user and revoke their access to all workspaces and organization resources.
                    </p>
                </div>

                <div className="flex gap-3 justify-center">
                    <Button
                        variant="plain"
                        className="w-full"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        className={`w-full ${mustForce ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'} text-white border-none shadow-lg`}
                        onClick={() => onConfirm(mustForce)}
                        loading={isDeleting}
                        icon={mustForce ? <AlertTriangle className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                    >
                        {mustForce ? 'Force Delete User' : 'Delete User'}
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}
