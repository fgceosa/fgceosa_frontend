'use client'

import { useState, useEffect } from 'react'
import { Dialog, Button, Notification, toast, Spinner } from '@/components/ui'
import { apiGetWorkspaces } from '@/services/workspace/workspaceService'
import { apiAssignCopilotToWorkspaces } from '@/services/CopilotService'
import { Building2, Check, Layout, Search, X, Sparkles } from 'lucide-react'
import classNames from '@/utils/classNames'
import type { Copilot } from '../types'
import type { Workspace } from '@/app/(protected-pages)/workspace/types'

interface AssignToWorkspaceDialogProps {
    isOpen: boolean
    onClose: () => void
    copilot: Copilot | null
    onSuccess?: (updatedCopilot: Copilot) => void
}

export default function AssignToWorkspaceDialog({
    isOpen,
    onClose,
    copilot,
    onSuccess
}: AssignToWorkspaceDialogProps) {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([])
    const [selectedWorkspaceIds, setSelectedWorkspaceIds] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isAssigning, setIsAssigning] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    // Fetch workspaces when dialog opens
    useEffect(() => {
        if (isOpen) {
            fetchWorkspaces()
            if (copilot?.assignedWorkspacesIds) {
                setSelectedWorkspaceIds(copilot.assignedWorkspacesIds)
            } else {
                setSelectedWorkspaceIds([])
            }
        }
    }, [isOpen, copilot])

    const fetchWorkspaces = async () => {
        try {
            setIsLoading(true)
            // Fetch first 100 workspaces for simplicity in selection
            const response = await apiGetWorkspaces(1, 100)
            setWorkspaces(response.workspaces)
        } catch (error) {
            console.error('Failed to fetch workspaces:', error)
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to load workspaces.
                </Notification>
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleToggleWorkspace = (id: string) => {
        const isOriginallyAssigned = copilot?.assignedWorkspacesIds?.includes(id)
        const isCurrentlySelected = selectedWorkspaceIds.includes(id)

        if (!isCurrentlySelected && isOriginallyAssigned) {
            toast.push(
                <Notification
                    type="info"
                    title="Assignment status"
                    duration={3000}
                >
                    Note: This copilot is already assigned to "{workspaces.find(w => w.id === id)?.name}".
                </Notification>
            )
        }

        setSelectedWorkspaceIds(prev =>
            prev.includes(id)
                ? prev.filter(wId => wId !== id)
                : [...prev, id]
        )
    }

    const handleAssign = async () => {
        if (!copilot) return

        try {
            setIsAssigning(true)
            const updatedCopilot = await apiAssignCopilotToWorkspaces(copilot.id, selectedWorkspaceIds)

            toast.push(
                <Notification type="success" title="Success">
                    Copilot assigned to workspaces successfully.
                </Notification>
            )

            if (onSuccess) onSuccess(updatedCopilot)
            onClose()
        } catch (error) {
            console.error('Failed to assign copilot:', error)
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to assign copilot to workspaces.
                </Notification>
            )
        } finally {
            setIsAssigning(false)
        }
    }

    const filteredWorkspaces = workspaces.filter(w =>
        w.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (!copilot) return null

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            closable={false}
            width={640}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
            contentClassName="!shadow-none"
        >
            <div className="relative">
                {/* Custom Header */}
                <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <Layout className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">Assign to Workspace</h3>
                            <p className="text-[11px] font-bold text-gray-400 mt-0.5">
                                Set target workspaces for <span className="text-primary">"{copilot.name}"</span>
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

                {/* Body Content */}
                <div className="px-8 py-8 space-y-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search workspaces by name..."
                            className="w-full h-14 pl-12 pr-4 bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-gray-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="max-h-[350px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <Spinner size={32} />
                                <span className="mt-4 text-[11px] font-black uppercase tracking-wider">Loading workspaces...</span>
                            </div>
                        ) : filteredWorkspaces.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <Building2 className="w-12 h-12 text-gray-200 dark:text-gray-800 mb-4" />
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No workspaces matched</p>
                            </div>
                        ) : (
                            filteredWorkspaces.map(workspace => {
                                const isSelected = selectedWorkspaceIds.includes(workspace.id)
                                return (
                                    <div
                                        key={workspace.id}
                                        onClick={() => handleToggleWorkspace(workspace.id)}
                                        className={classNames(
                                            "flex items-center justify-between p-5 rounded-[1.5rem] border-2 transition-all duration-300 cursor-pointer group",
                                            isSelected
                                                ? 'border-primary bg-primary/[0.02] shadow-sm ring-4 ring-primary/5'
                                                : 'border-gray-50 dark:border-gray-800 hover:border-primary/20 bg-white dark:bg-gray-900/50'
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={classNames(
                                                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 border",
                                                isSelected
                                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-400 border-gray-50 dark:border-gray-700 group-hover:bg-gray-100 dark:group-hover:bg-gray-700 group-hover:text-primary group-hover:border-primary/20'
                                            )}>
                                                <Building2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-[13px] font-black text-gray-900 dark:text-white leading-none mb-1.5">{workspace.name}</h4>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">ID: {workspace.id.slice(0, 8)}</p>
                                            </div>
                                        </div>
                                        <div className={classNames(
                                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                                            isSelected
                                                ? 'bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/30'
                                                : 'border-gray-200 dark:border-gray-700 group-hover:border-primary/40'
                                        )}>
                                            {isSelected && <Check className="w-3.5 h-3.5" strokeWidth={4} />}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-8 pb-8 pt-4 flex gap-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    <button
                        onClick={onClose}
                        className="flex-1 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-[13px] font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAssign}
                        disabled={isAssigning || isLoading}
                        className="flex-1 h-14 bg-primary hover:bg-primary-deep text-white font-bold text-[13px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:hover:scale-100"
                    >
                        <span>{isAssigning ? 'Applying Changes...' : 'Save Assignment'}</span>
                        {!isAssigning && <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />}
                        {isAssigning && <Spinner size={16} className="text-white" />}
                    </button>
                </div>
            </div>
        </Dialog>
    )
}
