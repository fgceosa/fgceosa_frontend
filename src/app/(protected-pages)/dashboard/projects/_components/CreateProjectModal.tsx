'use client'

import { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dialog, Button, Input, Select } from '@/components/ui'
import { LayoutGrid, ScrollText, Globe, Key, BarChart2, AlertCircle, Sparkles, X, Plus, Copy, Check } from 'lucide-react'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { createProject, selectCreateLoading } from '@/store/slices/projects'
import { fetchApiKeys, selectApiKeys, selectKeysLoading } from '@/store/slices/apiKeys'
import type { ProjectType, ProjectStatus } from '../types'
import {
    PROJECT_TYPE_OPTIONS,
    PROJECT_STATUS_OPTIONS,
    DEFAULT_PROJECT_TYPE,
    DEFAULT_PROJECT_STATUS,
} from '../constants'

interface CreateProjectModalProps {
    open: boolean
    onClose: () => void
    onSuccess?: () => void
}

export default function CreateProjectModal({
    open,
    onClose,
    onSuccess,
}: CreateProjectModalProps) {
    const dispatch = useDispatch()
    const isCreating = useSelector(selectCreateLoading)
    const apiKeys = useSelector(selectApiKeys)
    const apiKeysLoading = useSelector(selectKeysLoading)

    // Form state
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [type, setType] = useState<ProjectType | ''>(DEFAULT_PROJECT_TYPE)
    const [status, setStatus] = useState<ProjectStatus | ''>(DEFAULT_PROJECT_STATUS)
    const [projectUrl, setProjectUrl] = useState('')
    const [apiKeyId, setApiKeyId] = useState('')
    const [createdKey, setCreatedKey] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isCopied, setIsCopied] = useState(false)

    // Fetch API keys when modal opens
    useEffect(() => {
        if (open && apiKeys.length === 0) {
            dispatch(fetchApiKeys() as any)
        }
    }, [open, dispatch, apiKeys.length])

    // API keys options for dropdown
    const apiKeyOptions = useMemo(() => {
        const options = apiKeys
            .filter(key => key.status === 'active')
            .map(key => ({
                value: key.id,
                label: `${key.name} (${key.maskedKey})`,
            }))

        return [
            { value: '', label: 'Auto-generate new API key (Recommended)' },
            ...options
        ]
    }, [apiKeys])

    // Validation
    const validation = useMemo(() => {
        const errors: string[] = []
        const fieldErrors: Record<string, string> = {}

        if (!name.trim()) {
            errors.push('Name is required')
            fieldErrors.name = 'Name is required'
        }

        if (!type) {
            errors.push('Project type is required')
            fieldErrors.type = 'Project type is required'
        }

        if (!status) {
            errors.push('Project status is required')
            fieldErrors.status = 'Project status is required'
        }

        // Validate project URL if provided
        if (projectUrl.trim()) {
            const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
            const url = projectUrl.trim()

            // Check if it's a localhost URL
            if (url.includes('localhost') || url.includes('127.0.0.1')) {
                const error = 'Project URL cannot be a localhost address.'
                errors.push(error)
                fieldErrors.projectUrl = error
            }
            // Check if it's a valid URL format
            else if (!urlPattern.test(url)) {
                const error = 'Please enter a valid URL (e.g., https://example.com)'
                errors.push(error)
                fieldErrors.projectUrl = error
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            fieldErrors
        }
    }, [name, type, status, projectUrl])

    const handleCreate = async () => {
        if (!validation.isValid) {
            toast.push(
                <Notification type="danger">
                    {validation.errors[0]}
                </Notification>,
                { placement: 'top-center' }
            )
            return
        }

        try {
            const result = await dispatch(
                createProject({
                    name: name.trim(),
                    description: description.trim() || undefined,
                    type: type as ProjectType,
                    status: status as ProjectStatus,
                    projectUrl: projectUrl.trim() || undefined,
                    apiKeyId: apiKeyId || undefined,
                }) as any,
            ).unwrap()

            if (result.plain_api_key) {
                setCreatedKey(result.plain_api_key)
                setIsSuccess(true)
            } else {
                toast.push(
                    <Notification type="success">
                        Project created successfully
                    </Notification>,
                    { placement: 'top-center' }
                )
                handleClose()
                onSuccess?.()
            }
        } catch (error: any) {
            let errorMessage = 'Failed to create project'

            // Extract message from string or object
            const errorText = typeof error === 'string' ? error : (error?.detail || error?.message || String(error))

            if (errorText.includes('already linked')) {
                const projectNameMatch = errorText.match(/project '([^']+)'/)
                const linkedProjectName = projectNameMatch ? projectNameMatch[1] : 'another project'
                errorMessage = `This API key is already linked to "${linkedProjectName}".`
            } else if (errorText.includes('status code 400')) {
                // If we get a generic 400, it might be the "already linked" error that wasn't parsed
                errorMessage = 'Action failed: This API key might already be linked to another project or is inactive.'
            } else {
                errorMessage = errorText
            }

            toast.push(
                <Notification type="danger" title="Creation Failed">
                    {errorMessage}
                </Notification>,
                { placement: 'top-center' }
            )
        }
    }

    const handleClose = () => {
        setName('')
        setDescription('')
        setType(DEFAULT_PROJECT_TYPE)
        setStatus(DEFAULT_PROJECT_STATUS)
        setProjectUrl('')
        setApiKeyId('')
        setCreatedKey(null)
        setIsSuccess(false)
        setIsCopied(false)
        onClose()
    }

    const copyToClipboard = () => {
        if (createdKey) {
            navigator.clipboard.writeText(createdKey)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
            toast.push(
                <Notification type="success" duration={2000}>
                    Copied to clipboard
                </Notification>
            )
        }
    }

    return (
        <Dialog
            isOpen={open}
            onClose={handleClose}
            closable={false}
            width={720}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
            contentClassName="!shadow-none"
        >
            {isSuccess ? (
                <div className="relative animate-in zoom-in-95 duration-300">
                    <div className="px-5 sm:px-8 py-8 sm:py-10 text-center space-y-6 sm:space-y-8">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800 shadow-lg shadow-emerald-500/10">
                            <Key className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 dark:text-emerald-400" />
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Project Created!</h3>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-200 max-w-sm mx-auto">
                                Your project is ready. Here is your automatically generated API key.
                            </p>
                        </div>

                        <div className="space-y-4 max-w-2xl mx-auto">
                            <div className="flex items-center gap-2 pl-1">
                                <label className="text-[13px] font-black text-gray-900 dark:text-gray-200 tracking-wider">Your API Key</label>
                            </div>

                            <div className="group relative bg-[#F8FAFC] dark:bg-gray-800/40 p-4 rounded-[2rem] border border-gray-100 dark:border-gray-800/50 shadow-sm flex items-center justify-between min-h-[100px] transition-all duration-300 hover:border-primary/20">
                                <div className="flex-1 px-4 flex items-center justify-center">
                                    <span className="font-mono text-base font-black text-[#0066FF] dark:text-blue-400 break-all text-center">
                                        {createdKey}
                                    </span>
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    className="w-16 h-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center group/btn"
                                >
                                    {isCopied ? (
                                        <Check className="w-6 h-6 text-emerald-500" />
                                    ) : (
                                        <Copy className="w-6 h-6 text-gray-900 dark:text-gray-200 group-hover/btn:text-primary transition-colors" />
                                    )}
                                </button>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-2xl text-left">
                                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-[10px] font-bold text-amber-900/70 dark:text-amber-300/70 leading-relaxed">
                                    Important: Store this key safely. You won't be able to see it again. We've automatically linked this key to your new project.
                                </p>
                            </div>
                        </div>

                        <div className="px-4 sm:px-12 w-full">
                            <button
                                onClick={() => {
                                    handleClose()
                                    onSuccess?.()
                                }}
                                className="w-full h-14 bg-primary hover:bg-primary-deep text-white font-black text-[13px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Complete Setup
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative">
                    {/* Custom Header */}
                    <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center border border-primary/20 shadow-sm">
                                <BarChart2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white">Create Project</h3>
                                <p className="text-[11px] sm:text-[13px] font-black text-gray-900 dark:text-gray-200 mt-0.5">Initialize a new project in your ecosystem</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group"
                        >
                            <X className="w-5 h-5 text-gray-900 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                        </button>
                    </div>

                    {/* Form Body */}
                    <div className="px-5 sm:px-8 py-5 sm:py-6 space-y-5 sm:space-y-6 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                            {/* Name Field */}
                            <div className="md:col-span-2 space-y-2">
                                <div className="flex items-center gap-2 pl-1">
                                    <LayoutGrid className="w-3.5 h-3.5 text-primary" />
                                    <label className="text-[13px] font-black text-gray-900 dark:text-gray-200">Project Name</label>
                                </div>
                                <Input
                                    placeholder="e.g. Production Application"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="h-12 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 focus:bg-white transition-all text-sm font-bold shadow-sm"
                                />
                            </div>

                            {/* Description Field */}
                            <div className="md:col-span-2 space-y-2">
                                <div className="flex items-center gap-2 pl-1">
                                    <ScrollText className="w-3.5 h-3.5 text-primary" />
                                    <label className="text-[13px] font-black text-gray-900 dark:text-gray-200">Description</label>
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
                                    <label className="text-[13px] font-black text-gray-900 dark:text-gray-200">Project Type</label>
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
                                    <label className="text-[13px] font-black text-gray-900 dark:text-gray-200">Status</label>
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
                                    <label className="text-[13px] font-black text-gray-900 dark:text-gray-200">Website URL (Optional)</label>
                                </div>
                                <Input
                                    placeholder="https://app.yourproject.com"
                                    value={projectUrl}
                                    onChange={(e) => setProjectUrl(e.target.value)}
                                    invalid={!!validation.fieldErrors.projectUrl}
                                    className="h-12 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 focus:bg-white transition-all text-sm font-bold shadow-sm"
                                />
                                {validation.fieldErrors.projectUrl && (
                                    <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <AlertCircle className="w-3 h-3" />
                                        {validation.fieldErrors.projectUrl}
                                    </p>
                                )}
                            </div>

                            {/* API Key Link */}
                            <div className="md:col-span-2 space-y-2">
                                <div className="flex items-center gap-2 pl-1">
                                    <Key className="w-3.5 h-3.5 text-primary" />
                                    <label className="text-[13px] font-black text-gray-900 dark:text-gray-200">Project API Key</label>
                                </div>
                                <Select
                                    placeholder={apiKeysLoading ? "Synchronizing keys..." : "Select or generate key"}
                                    className="h-12 bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold"
                                    value={apiKeyOptions.find((o) => o.value === apiKeyId) || apiKeyOptions[0]}
                                    onChange={(option: any) => setApiKeyId(option?.value || '')}
                                    options={apiKeyOptions}
                                    isDisabled={apiKeysLoading}
                                />
                            </div>
                        </div>

                        {/* Notice */}
                        <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl">
                            <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <p className="text-[10px] font-bold text-blue-900/70 dark:text-blue-300/70 leading-relaxed">
                                Tip: Leave "Project API Key" as auto-generate to immediately receive a fresh key dedicated to this project.
                            </p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-5 sm:px-8 pb-5 sm:pb-8 pt-0 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 bg-white dark:bg-gray-900 z-10 relative">
                        <button
                            onClick={handleClose}
                            disabled={isCreating}
                            className="w-full sm:flex-1 h-14 sm:h-16 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-800 text-sm sm:text-base font-black text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50 shrink-0"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={!validation.isValid || isCreating}
                            className="w-full sm:flex-[2.5] h-16 sm:h-20 bg-primary hover:bg-primary-deep text-white font-black text-lg sm:text-xl rounded-xl sm:rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 sm:gap-4 group disabled:opacity-50"
                        >
                            {isCreating ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Creating...</span>
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
            )}
        </Dialog>
    )
}
