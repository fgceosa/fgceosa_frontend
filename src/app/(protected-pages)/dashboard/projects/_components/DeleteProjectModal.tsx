'use client'

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Dialog, Button } from '@/components/ui'
import { AlertCircle, Trash2 } from 'lucide-react'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { deleteProject, fetchProjects } from '@/store/slices/projects'
import type { Project } from '../types'

interface DeleteProjectModalProps {
    isOpen: boolean
    project: Project | null
    onClose: () => void
    setIsDeleting: (state: boolean) => void
    isDeleting: boolean
}

export default function DeleteProjectModal({
    isOpen,
    project,
    onClose,
    setIsDeleting,
    isDeleting,
}: DeleteProjectModalProps) {
    const dispatch = useDispatch()

    const handleConfirmDelete = useCallback(async () => {
        if (!project) return

        setIsDeleting(true)
        try {
            await dispatch(
                deleteProject({ id: project.id, hardDelete: false }) as any
            ).unwrap()

            // Refetch the projects list to ensure UI is in sync
            await dispatch(fetchProjects({}) as any).unwrap()

            toast.push(
                <Notification type="success">
                    Project deleted successfully
                </Notification>,
                { placement: 'top-center' }
            )
        } catch (error: any) {
            toast.push(
                <Notification type="danger">
                    {error || 'Failed to revoke project'}
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsDeleting(false)
        }
    }, [dispatch, project, setIsDeleting])

    if (!project) return null

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
                <div className="relative p-6 sm:p-10 overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 text-center">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl" />

                    <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-rose-50 dark:bg-rose-950 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center border border-rose-100 dark:border-rose-900 shadow-sm sm:scale-110">
                            <Trash2 className="h-8 w-8 sm:h-10 sm:w-10 text-rose-500" />
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-rose-600 opacity-80 whitespace-nowrap">Danger Zone</span>
                            <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">Delete Project</h3>
                        </div>
                    </div>
                </div>

                <div className="p-5 sm:p-10 space-y-6 sm:space-y-8">
                    {/* Confirmation Message */}
                    <div className="text-center space-y-4">
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                            Are you absolutely sure you want to delete the project <span className="font-black text-gray-900 dark:text-white">"{project.name}"</span>?
                        </p>

                        <div className="p-4 sm:p-5 bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-100/50 dark:border-amber-800/30 rounded-xl sm:rounded-2xl flex items-start gap-4">
                            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-[10px] sm:text-[11px] font-bold text-amber-800 dark:text-amber-300/80 leading-relaxed text-left italic">
                                This project will be removed from your active list and archived. You can restore it later if needed.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse sm:flex-row items-center gap-3 sm:gap-4 pt-2">
                        <Button
                            variant="default"
                            onClick={onClose}
                            disabled={isDeleting}
                            className="h-12 w-full sm:h-14 flex-1 rounded-xl sm:rounded-2xl font-black text-[10px] bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 border-none transition-all"
                        >
                            Keep Project
                        </Button>

                        <Button
                            variant="solid"
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            loading={isDeleting}
                            className="h-12 w-full sm:h-14 flex-1 rounded-xl sm:rounded-2xl font-black text-[10px] bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-200/50 dark:shadow-none transition-all group overflow-hidden relative"
                        >
                            <span className="relative z-10">{isDeleting ? 'Deleting...' : 'Confirm Delete'}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </Button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
