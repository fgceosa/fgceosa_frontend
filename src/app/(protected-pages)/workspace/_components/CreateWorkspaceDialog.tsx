'use client'

import { useState } from 'react'
import { Building2, X, Plus, MessageSquare } from 'lucide-react'
import { Dialog, Input, Notification, toast } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { createWorkspace } from '@/store/slices/workspace/workspaceThunk'
import { selectOperationsLoading } from '@/store/slices/workspace/workspaceSelectors'

interface CreateWorkspaceDialogProps {
    isOpen: boolean
    onClose: () => void
}

export default function CreateWorkspaceDialog({
    isOpen,
    onClose,
}: CreateWorkspaceDialogProps) {
    const dispatch = useAppDispatch()
    const isCreating = useAppSelector(selectOperationsLoading)

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const handleCreate = async () => {
        if (!name.trim()) {
            toast.push(
                <Notification type="warning" duration={2000}>
                    Please enter a workspace name
                </Notification>
            )
            return
        }

        const formattedName = name.trim()

        try {
            await dispatch(
                createWorkspace({
                    name: formattedName,
                    description: description || '',
                })
            ).unwrap()

            toast.push(
                <Notification type="success" duration={2000}>
                    Workspace created successfully
                </Notification>
            )
            onClose()
            setName('')
            setDescription('')
        } catch (err: any) {
            toast.push(
                <Notification type="danger" duration={3000}>
                    {err || 'Failed to create workspace'}
                </Notification>
            )
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            closable={false}
            width={720}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden"
            contentClassName="!shadow-none"
        >
            <div className="relative">
                {/* Custom Header */}
                <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add workspace</h3>
                            <p className="text-[10px] font-bold text-gray-400 mt-0.5">Start a new workspace for your team</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group"
                    >
                        <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                    </button>
                </div>

                {/* Form Body */}
                <div className="px-8 py-6 space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 pl-1">
                            <Building2 className="w-3.5 h-3.5 text-primary" />
                            <label className="text-[10px] font-bold text-gray-900 dark:text-white">Workspace name</label>
                        </div>
                        <Input
                            placeholder="Finance department"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-sm font-bold"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 pl-1">
                            <MessageSquare className="w-3.5 h-3.5 text-primary" />
                            <label className="text-[10px] font-bold text-gray-900 dark:text-white">Description</label>
                        </div>
                        <Input
                            placeholder="Tell us what this workspace is for..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            textArea
                            rows={4}
                            className="rounded-2xl border-gray-100 dark:border-gray-800 text-sm font-bold"
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-8 pb-8 pt-0 flex gap-4">
                    <button
                        onClick={onClose}
                        disabled={isCreating}
                        className="flex-1 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={isCreating}
                        className="flex-1 h-14 bg-primary hover:bg-primary-deep text-white font-bold text-xs rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50"
                    >
                        {isCreating ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Creating...</span>
                            </div>
                        ) : (
                            <>
                                <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                                <span>Add workspace</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Dialog>
    )
}
