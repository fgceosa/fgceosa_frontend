'use client'

import React, { useState, useEffect } from 'react'
import {
    Dialog,
    Button,
    Input,
    Notification,
    toast,
} from '@/components/ui'
import { Building2 } from 'lucide-react'
import { useAppDispatch, useAppSelector, type RootState } from '@/store'
import {
    updateWorkspace,
} from '@/store/slices/workspace/workspaceThunk'
import type { Workspace } from '../types'
import { config } from '@/configs/env'

interface EditWorkspaceDialogProps {
    workspace: Workspace | null
    isOpen: boolean
    onClose: () => void
}


export default function EditWorkspaceDialog({
    workspace,
    isOpen,
    onClose,
}: EditWorkspaceDialogProps) {
    const dispatch = useAppDispatch()
    const loading = useAppSelector((state: RootState) => state.workspace.componentLoading.operations)

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    useEffect(() => {
        if (workspace) {
            setName(workspace.name)
            setDescription(workspace.description || '')
        }
    }, [workspace])

    const handleSave = async () => {
        if (!workspace) return

        const formattedName = name.trim()

        try {
            await dispatch(
                updateWorkspace({
                    id: workspace.id,
                    name: formattedName,
                    description,
                })
            ).unwrap()

            toast.push(
                <Notification type="success">
                    Workspace updated successfully
                </Notification>,
                { placement: 'top-center' }
            )
            onClose()
        } catch (error: any) {
            toast.push(
                <Notification type="danger">
                    {error || 'Failed to update workspace'}
                </Notification>,
                { placement: 'top-center' }
            )
        }
    }


    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={400}
            contentClassName="rounded-3xl p-6"
        >
            <div className="space-y-4 pt-1">
                <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                        Edit Workspace
                    </h3>
                    <p className="text-sm text-gray-400 font-medium">
                        Update your workspace details.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">
                            Workspace Name
                        </label>
                        <Input
                            placeholder="Enter workspace name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="rounded-xl h-10 border-gray-100 dark:border-gray-800 focus:ring-primary/20"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">
                            Description
                        </label>
                        <Input
                            placeholder="Enter workspace description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="rounded-xl h-10 border-gray-100 dark:border-gray-800 focus:ring-primary/20"
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <Button
                        variant="plain"
                        className="flex-1 h-11 rounded-xl font-bold bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="flex-1 h-11 rounded-xl font-bold shadow-lg shadow-primary/20"
                        onClick={handleSave}
                        loading={loading}
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}
