import { useState } from 'react'
import { Dialog, Input, Checkbox, Notification, toast } from '@/components/ui'
import { FolderKanban, X, Users, MessageSquare, Plus } from 'lucide-react'
import type { WorkspaceMember } from '../types'

interface CreateProjectDialogProps {
    isOpen: boolean
    onClose: () => void
    onCreate: (data: { name: string; description: string; members: string[] }) => Promise<void>
    members: WorkspaceMember[]
    isLoading?: boolean
}

export default function CreateProjectDialog({
    isOpen,
    onClose,
    onCreate,
    members,
    isLoading,
}: CreateProjectDialogProps) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [selectedMembers, setSelectedMembers] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleMemberToggle = (memberId: string) => {
        setSelectedMembers((prev) =>
            prev.includes(memberId)
                ? prev.filter((m) => m !== memberId)
                : [...prev, memberId],
        )
    }

    const handleSelectAll = () => {
        if (selectedMembers.length === members.length) {
            setSelectedMembers([])
        } else {
            setSelectedMembers(members.map((m) => m.id))
        }
    }

    const handleSubmit = async () => {
        // Validation
        if (!name.trim()) {
            toast.push(
                <Notification type="warning" duration={2000}>
                    Please enter a project name
                </Notification>,
            )
            return
        }

        if (!description.trim()) {
            toast.push(
                <Notification type="warning" duration={2000}>
                    Please enter a project description
                </Notification>,
            )
            return
        }

        setIsSubmitting(true)
        try {
            await onCreate({
                name,
                description,
                members: selectedMembers,
            })

            // Reset form
            setName('')
            setDescription('')
            setSelectedMembers([])
            onClose()
        } catch (error) {
            // Error is handled by the parent component
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        if (!isSubmitting) {
            setName('')
            setDescription('')
            setSelectedMembers([])
            onClose()
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
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
                            <FolderKanban className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Create Project</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Initialize a new venture for your team</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group disabled:opacity-50"
                    >
                        <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                    </button>
                </div>

                {/* Form Body */}
                <div className="px-8 py-6 space-y-6">
                    <div className="space-y-4">
                        {/* Project Name */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 pl-1">
                                <FolderKanban className="w-3.5 h-3.5 text-primary" />
                                <label className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Project Name</label>
                            </div>
                            <Input
                                placeholder="e.g. OPERATION_MARS_ROVER"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-base font-bold"
                            />
                        </div>

                        {/* Project Description */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 pl-1">
                                <MessageSquare className="w-3.5 h-3.5 text-primary" />
                                <label className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Purpose & Scope</label>
                            </div>
                            <Input
                                textArea
                                rows={3}
                                placeholder="Describe the strategic objectives of this project..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="rounded-2xl border-gray-100 dark:border-gray-800 text-base font-bold"
                            />
                        </div>

                        {/* Team Members Selection */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between pl-1">
                                <div className="flex items-center gap-2">
                                    <Users className="w-3.5 h-3.5 text-primary" />
                                    <label className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Assemble Team</label>
                                </div>
                                {members.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleSelectAll}
                                        className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
                                    >
                                        {selectedMembers.length === members.length
                                            ? 'Clear Selection'
                                            : 'Select Entire Team'}
                                    </button>
                                )}
                            </div>
                            <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-4 bg-gray-50/30 dark:bg-gray-800/20 max-h-48 overflow-y-auto custom-scrollbar">
                                {members.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400">
                                        <Users className="w-10 h-10 mb-2 opacity-20" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">No operatives available</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {members
                                            .filter((member) => member.status === 'active')
                                            .map((member) => (
                                                <div
                                                    key={member.id}
                                                    className="flex items-center bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm"
                                                >
                                                    <Checkbox
                                                        checked={selectedMembers.includes(member.id)}
                                                        onChange={() => handleMemberToggle(member.id)}
                                                    >
                                                        <div className="ml-2 flex flex-col min-w-0">
                                                            <div className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-tight truncate">
                                                                {member.name}
                                                            </div>
                                                            <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest truncate">
                                                                {member.email}
                                                            </div>
                                                        </div>
                                                    </Checkbox>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-8 pb-8 pt-0 flex gap-4">
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="flex-1 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-[11px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-[0.2em] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || isLoading}
                        className="flex-1 h-14 bg-primary hover:bg-primary-deep text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Developing...</span>
                            </div>
                        ) : (
                            <>
                                <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                                <span>Create Project</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Dialog>
    )
}
