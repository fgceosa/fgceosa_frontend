'use client'

import { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dialog, Button, Input, Select } from '@/components/ui'
import { LayoutGrid, ScrollText, Globe, Key, BarChart2, AlertCircle, Sparkles, Edit, X, Save } from 'lucide-react'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { updateProject, selectUpdateLoading } from '@/store/slices/projects'
import type { Project, ProjectType, ProjectStatus } from '../types'
import {
    PROJECT_TYPE_OPTIONS,
    PROJECT_STATUS_OPTIONS,
} from '../constants'

interface EditProjectModalProps {
    open: boolean
    onClose: () => void
    onSuccess?: () => void
    project: Project | null
}

export default function EditProjectModal({
    open,
    onClose,
    onSuccess,
    project,
}: EditProjectModalProps) {
    const dispatch = useDispatch()
    const isUpdating = useSelector(selectUpdateLoading)

    // Form state
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [type, setType] = useState<ProjectType | ''>('')
    const [status, setStatus] = useState<ProjectStatus | ''>('')
    const [projectUrl, setProjectUrl] = useState('')

    // Initialize form with project data when modal opens
    useEffect(() => {
        if (open && project) {
            setName(project.name)
            setDescription(project.description || '')
            setType(project.type)
            setStatus(project.status)
            setProjectUrl(project.projectUrl || '')
        }
    }, [open, project])

    // Validation
    const validation = useMemo(() => {
        const errors: string[] = []

        if (!name.trim()) {
            errors.push('Name is required')
        }

        if (!type) {
            errors.push('Project type is required')
        }

        if (!status) {
            errors.push('Project status is required')
        }

        // Validate project URL if provided
        if (projectUrl.trim()) {
            const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
            const url = projectUrl.trim()

            // Check if it's a localhost URL
            if (url.includes('localhost') || url.includes('127.0.0.1')) {
                errors.push('Project URL cannot be a localhost address.')
            }
            // Check if it's a valid URL format
            else if (!urlPattern.test(url)) {
                errors.push('Please enter a valid URL (e.g., https://example.com)')
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
        }
    }, [name, type, status, projectUrl])

    const handleUpdate = async () => {
        if (!validation.isValid || !project) {
            toast.push(
                <Notification type="danger">
                    {validation.errors[0]}
                </Notification>,
                { placement: 'top-center' }
            )
            return
        }

        try {
            await dispatch(
                updateProject({
                    id: project.id,
                    data: {
                        name: name.trim(),
                        description: description.trim() || undefined,
                        type: type as ProjectType,
                        status: status as ProjectStatus,
                        projectUrl: projectUrl.trim() || undefined,
                    },
                }) as any,
            ).unwrap()

            toast.push(
                <Notification type="success">
                    Project updated successfully
                </Notification>,
                { placement: 'top-center' }
            )

            handleClose()
            onSuccess?.()
        } catch (error: any) {
            let errorMessage = 'Failed to update project'
            if (typeof error === 'string') {
                errorMessage = error
            } else if (error.detail) {
                errorMessage = error.detail
            }

            toast.push(
                <Notification type="danger">
                    {errorMessage}
                </Notification>,
                { placement: 'top-center' }
            )
        }
    }

    const handleClose = () => {
        setName('')
        setDescription('')
        setType('')
        setStatus('')
        setProjectUrl('')
        onClose()
    }

    if (!project) return null

    return (
        <Dialog
            isOpen={open}
            onClose={handleClose}
            closable={false}
            width={720}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
            contentClassName="!shadow-none"
        >
            <div className="relative">
                {/* Custom Header */}
                <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center border border-primary/20 shadow-sm">
                            <Edit className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">Edit Project</h3>
                            <p className="text-[10px] font-black text-gray-400 mt-0.5">Modify project details and configuration</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group shrink-0"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                    </button>
                </div>

                {/* Form Body */}
                <div className="px-5 sm:px-8 py-5 sm:py-6 space-y-5 sm:space-y-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                        {/* Name Field */}
                        <div className="md:col-span-2 space-y-2">
                            <div className="flex items-center gap-2 pl-1">
                                <LayoutGrid className="w-3.5 h-3.5 text-primary" />
                                <label className="text-[10px] font-black text-gray-900 dark:text-gray-200">Project Name</label>
                            </div>
                            <Input
                                placeholder="e.g. Production Application"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-12 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 focus:bg-white transition-all text-[13px] sm:text-sm font-bold shadow-sm"
                            />
                        </div>

                        {/* Description Field */}
                        <div className="md:col-span-2 space-y-2">
                            <div className="flex items-center gap-2 pl-1">
                                <ScrollText className="w-3.5 h-3.5 text-primary" />
                                <label className="text-[10px] font-black text-gray-900 dark:text-gray-200">Description</label>
                            </div>
                            <Input
                                placeholder="Brief summary of project objectives..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="h-12 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 focus:bg-white transition-all text-sm font-bold shadow-sm"
                            />
                        </div>

                        {/* Type and Status */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 pl-1">
                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                                <label className="text-[10px] font-black text-gray-900 dark:text-gray-200">Project Type</label>
                            </div>
                            <Select
                                placeholder="Select category"
                                className="h-12 bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold"
                                value={PROJECT_TYPE_OPTIONS.find((o) => o.value === type) || null}
                                onChange={(option: any) => setType(option?.value as ProjectType || '')}
                                options={[...PROJECT_TYPE_OPTIONS]}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 pl-1">
                                <AlertCircle className="w-3.5 h-3.5 text-primary" />
                                <label className="text-[10px] font-black text-gray-900 dark:text-gray-200">Status</label>
                            </div>
                            <Select
                                placeholder="Select state"
                                className="h-12 bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold"
                                value={PROJECT_STATUS_OPTIONS.find((o) => o.value === status) || null}
                                onChange={(option: any) => setStatus(option?.value as ProjectStatus || '')}
                                options={[...PROJECT_STATUS_OPTIONS]}
                            />
                        </div>

                        {/* URL Field */}
                        <div className="md:col-span-2 space-y-2">
                            <div className="flex items-center gap-2 pl-1">
                                <Globe className="w-3.5 h-3.5 text-primary" />
                                <label className="text-[10px] font-black text-gray-900 dark:text-gray-200">Website URL (Optional)</label>
                            </div>
                            <Input
                                placeholder="https://app.yourproject.com"
                                value={projectUrl}
                                onChange={(e) => setProjectUrl(e.target.value)}
                                className="h-12 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 focus:bg-white transition-all text-sm font-bold shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Notice */}
                    <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl">
                        <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-[10px] font-bold text-blue-900/70 dark:text-blue-300/70 leading-relaxed">
                            Note: Status updates will reflect across your projects immediately.
                        </p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-5 sm:px-8 pb-5 sm:pb-8 pt-0 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 z-10 relative">
                    <button
                        onClick={handleClose}
                        disabled={isUpdating}
                        className="w-full sm:flex-1 h-14 sm:h-16 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-800 text-sm sm:text-base font-black text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50 shrink-0"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={!validation.isValid || isUpdating}
                        className="w-full sm:flex-[2.5] h-16 sm:h-20 bg-primary hover:bg-primary-deep text-white font-black text-lg sm:text-xl rounded-xl sm:rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 sm:gap-4 group disabled:opacity-50"
                    >
                        {isUpdating ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Updating...</span>
                            </div>
                        ) : (
                            <>
                                <Save className="w-4 h-4 transition-transform group-hover:scale-110" />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Dialog>
    )
}
