'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
    Button,
    Card,
    Input,
    Select,
    Tabs,
    Notification,
    toast,
    Dialog,
    Switcher,
    Progress,
    Badge,
    Tooltip,
} from '@/components/ui'
import QorebitLoading from '@/components/shared/QorebitLoading'
import {
    ArrowLeft,
    Save,
    Bot,
    Settings,
    Zap,
    Link2,
    Trash2,
    AlertTriangle,
    Cpu,
    BookOpen,
    Globe,
    Lock,
    Users,
    X,
    Plus,
    Database,
    Upload,
    FileText,
    Shield,
    Loader2,
    RefreshCw,
    Folder,
    MessageSquare,
    Rocket,
} from 'lucide-react'
import { COPILOT_CATEGORIES, COPILOT_MODELS, DOCUMENT_STATUS_LABELS } from '../../types'
import type { Copilot, CopilotCategory, CopilotCapability, CopilotDocument, UpdateCopilotPayload } from '../../types'
import {
    apiGetCopilot,
    apiUpdateCopilot,
    apiDeleteCopilot,
    apiUploadDocument,
    apiListDocuments,
    apiDeleteDocument,
    apiGetDocumentStatus,
} from '@/services/CopilotService'
import {
    apiGetGoogleDriveConnection,
    apiGetGoogleDriveAuthUrl,
    apiGoogleDriveCallback,
    apiDisconnectGoogleDrive,
} from '@/services/GoogleDriveService'
import GoogleDriveFileBrowser from '../../_components/GoogleDriveFileBrowser'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import classNames from '@/utils/classNames'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import CopilotPreviewDrawer from '../../_components/CopilotPreviewDrawer'


const CAPABILITY_OPTIONS: { value: CopilotCapability; label: string; description: string }[] = [
    { value: 'web-search', label: 'Web Search', description: 'Search the internet for information' },
    { value: 'code-execution', label: 'Code Execution', description: 'Run code snippets' },
    { value: 'file-upload', label: 'File Upload', description: 'Accept file uploads' },
    { value: 'image-generation', label: 'Image Generation', description: 'Generate images from text' },
    { value: 'voice-input', label: 'Voice Input', description: 'Accept voice commands' },
    { value: 'api-integration', label: 'API Integration', description: 'Connect to external APIs' },
    { value: 'memory', label: 'Memory', description: 'Remember past conversations' },
    { value: 'function-calling', label: 'Function Calling', description: 'Execute custom functions' },
    { value: 'vision', label: 'Vision', description: 'Analyze and understand uploaded images' },
]


// Data source options
const DATA_SOURCE_OPTIONS = [
    { id: 'postgresql', name: 'PostgreSQL', icon: Database },
    { id: 'mongodb', name: 'MongoDB', icon: Database },
    { id: 'google-drive', name: 'Google Drive', icon: Globe },
    { id: 'dropbox', name: 'Dropbox', icon: Globe },
]

// Role options for permissions
const ROLE_OPTIONS = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'member', label: 'Member' },
    { value: 'viewer', label: 'Viewer' },
]

export default function CopilotSettingsPage() {
    const params = useParams()
    const router = useRouter()
    const { session } = useCurrentSession()
    const copilotId = params.copilotId as string

    const [activeTab, setActiveTab] = useState('general')
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [formData, setFormData] = useState<Partial<Copilot>>({})
    const [originalData, setOriginalData] = useState<Copilot | null>(null)
    const [suggestedPromptInput, setSuggestedPromptInput] = useState('')
    const [hasChanges, setHasChanges] = useState(false)

    // Connect Data tab state
    const [selectedDataSource, setSelectedDataSource] = useState<string>('local')
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [isDragOver, setIsDragOver] = useState(false)
    const [documents, setDocuments] = useState<CopilotDocument[]>([])
    const [isUploadingDocuments, setIsUploadingDocuments] = useState(false)
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(false)

    // Google Drive state
    const [googleDriveConnection, setGoogleDriveConnection] = useState<any>(null)
    const [isLoadingGoogleDrive, setIsLoadingGoogleDrive] = useState(false)
    const [showGoogleDriveBrowser, setShowGoogleDriveBrowser] = useState(false)

    // Document deletion state
    const [showDeleteDocDialog, setShowDeleteDocDialog] = useState(false)
    const [docToDeleteId, setDocToDeleteId] = useState<string | null>(null)
    const [isDeletingDoc, setIsDeletingDoc] = useState(false)


    // Permissions & Restrictions tab state
    const [workspaceAccess, setWorkspaceAccess] = useState(true)
    const [selectedRoles, setSelectedRoles] = useState<string[]>(['admin', 'manager'])

    // Preview state
    const [showPreview, setShowPreview] = useState(false)
    const [previewConversationId, setPreviewConversationId] = useState<string | null>(null)

    // Fetch copilot data
    const fetchCopilot = useCallback(async () => {
        try {
            setIsLoading(true)
            const data = await apiGetCopilot(copilotId)
            setCopilotData(data)
        } catch (err) {
            console.error('Failed to fetch copilot:', err)
            toast.push(
                <Notification type="danger" duration={3000}>
                    Failed to load copilot settings
                </Notification>
            )
        } finally {
            setIsLoading(false)
        }
    }, [copilotId])

    // Set copilot data helper
    const setCopilotData = (data: Copilot) => {
        setOriginalData(data)
        setFormData({
            name: data.name,
            description: data.description,
            category: data.category,
            status: data.status,
            visibility: data.visibility,
            model: data.model,
            temperature: data.temperature,
            maxTokens: data.maxTokens,
            systemPrompt: data.systemPrompt,
            domain: data.domain || '',
            welcomeMessage: data.welcomeMessage,
            suggestedPrompts: data.suggestedPrompts || [],
            capabilities: data.capabilities || [],
            tags: data.tags || [],
        })
        // Set workspace access based on visibility
        setWorkspaceAccess(data.visibility === 'workspace' || data.visibility === 'public')
    }

    // Fetch documents
    const fetchDocuments = useCallback(async (isSilent = false) => {
        try {
            if (!isSilent) setIsLoadingDocuments(true)
            const response = await apiListDocuments(copilotId)
            setDocuments(response.documents)
        } catch (err) {
            console.error('Failed to fetch documents:', err)
        } finally {
            if (!isSilent) setIsLoadingDocuments(false)
        }
    }, [copilotId])

    const handleRefreshDocuments = async () => {
        await fetchDocuments(true)
    }

    // Auto-refresh documents when they're processing
    useEffect(() => {
        // Check if there are any documents still processing
        const hasProcessingDocs = documents.some(
            doc => doc.status === 'processing' || doc.status === 'pending'
        )

        if (!hasProcessingDocs) return

        // Poll every 3 seconds
        const interval = setInterval(() => {
            fetchDocuments(true)
        }, 3000)

        return () => clearInterval(interval)
    }, [documents, fetchDocuments])

    // Fetch Google Drive connection
    const fetchGoogleDriveConnection = useCallback(async () => {
        try {
            setIsLoadingGoogleDrive(true)
            const connection = await apiGetGoogleDriveConnection()
            setGoogleDriveConnection(connection)
        } catch (err) {
            console.error('Failed to fetch Google Drive connection:', err)
        } finally {
            setIsLoadingGoogleDrive(false)
        }
    }, [])

    // Connect Google Drive
    const handleConnectGoogleDrive = async () => {
        try {
            const { authorizationUrl, state } = await apiGetGoogleDriveAuthUrl()
            // Store state in session storage for verification
            sessionStorage.setItem('google_drive_oauth_state', state)
            sessionStorage.setItem('google_drive_copilot_id', copilotId)
            // Redirect to Google OAuth
            window.location.href = authorizationUrl
        } catch (err) {
            console.error('Failed to get Google Drive auth URL:', err)
            toast.push(
                <Notification type="danger" duration={3000}>
                    Failed to connect Google Drive
                </Notification>
            )
        }
    }

    // Disconnect Google Drive
    const handleDisconnectGoogleDrive = async () => {
        try {
            await apiDisconnectGoogleDrive()
            setGoogleDriveConnection(null)
            setShowGoogleDriveBrowser(false)
            toast.push(
                <Notification type="success" duration={3000}>
                    Google Drive disconnected
                </Notification>
            )
        } catch (err) {
            console.error('Failed to disconnect Google Drive:', err)
            toast.push(
                <Notification type="danger" duration={3000}>
                    Failed to disconnect Google Drive
                </Notification>
            )
        }
    }

    // Track changes
    useEffect(() => {
        if (originalData) {
            const changed = JSON.stringify(formData) !== JSON.stringify({
                name: originalData.name,
                description: originalData.description,
                category: originalData.category,
                status: originalData.status,
                visibility: originalData.visibility,
                model: originalData.model,
                temperature: originalData.temperature,
                maxTokens: originalData.maxTokens,
                systemPrompt: originalData.systemPrompt,
                domain: originalData.domain || '',
                welcomeMessage: originalData.welcomeMessage,
                suggestedPrompts: originalData.suggestedPrompts || [],
                capabilities: originalData.capabilities || [],
                tags: originalData.tags || [],
            })
            setHasChanges(changed)
        }
    }, [formData, originalData])

    // Initial load
    useEffect(() => {
        fetchCopilot()
        fetchDocuments()
        fetchGoogleDriveConnection()
    }, [fetchCopilot, fetchDocuments, fetchGoogleDriveConnection])

    // Safety: Ensure body scroll is unlocked when entering this page
    // This fixes issues where navigating from a Drawer might leave the body locked
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow
        document.body.style.overflow = 'unset'

        return () => {
            // Only restore if we haven't navigated away (though next page should handle itself)
            document.body.style.overflow = ''
        }
    }, [])

    const categoryOptions = COPILOT_CATEGORIES.map(c => ({ value: c.value, label: c.label }))
    const modelOptions = COPILOT_MODELS.map(m => ({
        value: m.value,
        label: m.label,
        company: m.company,
        description: m.description,
        color: m.color
    }))
    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Paused' },
        { value: 'draft', label: 'Draft' },
        { value: 'disabled', label: 'Disabled' },
    ]

    const handleSave = async (shouldPublish = false) => {
        setIsSaving(true)
        try {
            // Build update payload
            const updatePayload: UpdateCopilotPayload = {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                status: shouldPublish ? 'active' : formData.status,
                visibility: formData.visibility,
                model: formData.model,
                temperature: formData.temperature,
                maxTokens: formData.maxTokens,
                systemPrompt: formData.systemPrompt,
                domain: formData.domain || undefined,
                welcomeMessage: formData.welcomeMessage || undefined,
                suggestedPrompts: formData.suggestedPrompts,
                capabilities: formData.capabilities,
                tags: formData.tags,
            }

            const updatedCopilot = await apiUpdateCopilot(copilotId, updatePayload)
            setCopilotData(updatedCopilot)

            const isPublishing = shouldPublish && originalData?.status === 'draft'

            toast.push(
                <Notification type="success" duration={3000} title={isPublishing ? "Published!" : "Saved!"}>
                    {isPublishing ? "Your copilot is now active and ready for use." : "Changes saved successfully!"}
                </Notification>
            )
        } catch (error) {
            console.error('Failed to save copilot:', error)
            toast.push(
                <Notification type="danger" duration={3000}>
                    Failed to save changes. Please try again.
                </Notification>
            )
        } finally {
            setIsSaving(false)
        }
    }



    const handleDelete = async () => {
        const isOfficial = (originalData as any)?.isOfficial === true ||
            (originalData as any)?.is_official === true ||
            (originalData as any)?.isFeatured === true ||
            (originalData as any)?.is_featured === true ||
            (originalData as any)?.isOfficial === 'true' ||
            (originalData as any)?.is_official === 'true'

        const userAuthority = (session?.user as any)?.authority || []
        const userRole = (session?.user as any)?.role || ''
        const isSuperadmin = userAuthority.includes('platform_super_admin') || userRole === 'platform_super_admin'

        if (isOfficial && !isSuperadmin) {
            toast.push(
                <Notification type="warning" title="System Protected" duration={7000}>
                    This is a platform-certified prebuilt template and cannot be deleted by organizations. You can, however, duplicate it to customize your own version.
                </Notification>
            )
            setShowDeleteDialog(false)
            return
        }

        setIsDeleting(true)
        try {
            await apiDeleteCopilot(copilotId)
            toast.push(
                <Notification type="success" duration={3000}>
                    Copilot deleted successfully
                </Notification>
            )
            router.push('/dashboard/copilot-hub')
        } catch (error: any) {
            console.error('Failed to delete copilot:', error)
            let errorMessage = error?.response?.data?.message || error?.response?.data?.detail || error?.message || 'Failed to delete copilot. Please try again.'

            if (error?.response?.status === 403 && !error?.response?.data?.message && !error?.response?.data?.detail) {
                errorMessage = "You do not have administrative clearance to decommission this copilot. Only the platform super admin can perform this action."
            }

            toast.push(
                <Notification type="danger" title="Deletion Error" duration={5000}>
                    {errorMessage}
                </Notification>
            )
        } finally {
            setIsDeleting(false)
            setShowDeleteDialog(false)
        }
    }

    // Upload documents to RAG knowledge base
    const handleUploadDocuments = async () => {
        if (uploadedFiles.length === 0) return

        setIsUploadingDocuments(true)
        try {
            const uploadPromises = uploadedFiles.map(file =>
                apiUploadDocument(copilotId, file, { title: file.name })
            )
            await Promise.all(uploadPromises)

            toast.push(
                <Notification type="success" duration={3000}>
                    {uploadedFiles.length} document(s) uploaded successfully
                </Notification>
            )
            setUploadedFiles([])
            // Refresh documents list
            fetchDocuments()
        } catch (error) {
            console.error('Failed to upload documents:', error)
            toast.push(
                <Notification type="danger" duration={3000}>
                    Failed to upload documents. Please try again.
                </Notification>
            )
        } finally {
            setIsUploadingDocuments(false)
        }
    }

    // Delete a document
    const handleDeleteDocument = (documentId: string) => {
        setDocToDeleteId(documentId)
        setShowDeleteDocDialog(true)
    }

    const confirmDeleteDocument = async () => {
        if (!docToDeleteId) return

        setIsDeletingDoc(true)
        try {
            await apiDeleteDocument(copilotId, docToDeleteId)
            setDocuments(prev => prev.filter(d => d.id !== docToDeleteId))
            toast.push(
                <Notification type="success" duration={3000}>
                    Document deleted successfully
                </Notification>
            )
        } catch (error: any) {
            console.error('Failed to delete document:', error)
            const errorMessage = error?.response?.data?.detail || error?.message || 'Failed to delete document'
            toast.push(
                <Notification type="danger" duration={5000}>
                    {errorMessage}
                </Notification>
            )
        } finally {

            setIsDeletingDoc(false)
            setShowDeleteDocDialog(false)
            setDocToDeleteId(null)
        }
    }


    const toggleCapability = (cap: CopilotCapability) => {
        const current = formData.capabilities || []
        if (current.includes(cap)) {
            setFormData({ ...formData, capabilities: current.filter(c => c !== cap) })
        } else {
            setFormData({ ...formData, capabilities: [...current, cap] })
        }
    }

    const addSuggestedPrompt = () => {
        if (suggestedPromptInput.trim()) {
            setFormData({
                ...formData,
                suggestedPrompts: [...(formData.suggestedPrompts || []), suggestedPromptInput.trim()],
            })
            setSuggestedPromptInput('')
        }
    }

    const removeSuggestedPrompt = (index: number) => {
        setFormData({
            ...formData,
            suggestedPrompts: formData.suggestedPrompts?.filter((_, i) => i !== index),
        })
    }

    // File upload handlers
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            const validFiles = Array.from(files).filter(file => {
                const validTypes = ['.pdf', '.docx', '.txt']
                const extension = '.' + file.name.split('.').pop()?.toLowerCase()
                return validTypes.includes(extension) && file.size <= 10 * 1024 * 1024
            })
            setUploadedFiles(prev => [...prev, ...validFiles])
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        const files = e.dataTransfer.files
        if (files) {
            const validFiles = Array.from(files).filter(file => {
                const validTypes = ['.pdf', '.docx', '.txt']
                const extension = '.' + file.name.split('.').pop()?.toLowerCase()
                return validTypes.includes(extension) && file.size <= 10 * 1024 * 1024
            })
            setUploadedFiles(prev => [...prev, ...validFiles])
        }
    }

    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    }

    // Loading state
    if (isLoading) {
        return <QorebitLoading />
    }

    // Not found state
    if (!originalData) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
                <Bot className="w-16 h-16 text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Copilot not found
                </h2>
                <p className="text-gray-500 mb-4">The copilot you're looking for doesn't exist.</p>
                <button
                    onClick={() => router.push('/dashboard/copilot-hub')}
                    className="text-indigo-600 hover:text-indigo-700"
                >
                    Go back to Copilot Hub
                </button>
            </div>
        )
    }

    return (
        <div className="py-4 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10 w-full max-w-[1600px] mx-auto animate-in fade-in duration-700">
            {/* Enterprise Header Section */}
            <div className="flex flex-col space-y-4 sm:space-y-8">
                <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Button
                            variant="plain"
                            onClick={() => router.push('/dashboard/copilot-hub')}
                            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg sm:rounded-xl h-9 w-9 sm:h-10 sm:w-10 p-0 flex items-center justify-center transition-all active:scale-95 border border-gray-100 dark:border-gray-700 shadow-sm"
                        >
                            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                        </Button>
                        <div className="h-px w-6 sm:w-8 bg-gray-200 dark:bg-gray-800"></div>
                        <span className="text-[10px] sm:text-xs font-black text-primary">Copilot Management Center</span>
                    </div>

                    <div className="flex flex-col gap-4 sm:gap-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="relative">
                                <div className="relative p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                                    <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500 dark:text-gray-400" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 dark:text-gray-100">
                                    {formData.name || 'Copilot Console'}
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] sm:text-xs font-black text-gray-600 dark:text-gray-400">Status:</span>
                                    <span className={classNames(
                                        "px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-black rounded-md",
                                        formData.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' :
                                            formData.status === 'inactive' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' :
                                                formData.status === 'draft' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' :
                                                    'bg-gray-100 text-gray-700 dark:bg-gray-800'
                                    )}>
                                        {formData.status === 'inactive' ? 'Paused' : formData.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                            <Button
                                variant="default"
                                onClick={() => setShowPreview(true)}
                                className="h-11 sm:h-12 px-4 sm:px-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-black text-[11px] sm:text-xs rounded-xl sm:rounded-2xl shadow-sm transition-all hover:bg-gray-100 flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                                <MessageSquare className="w-4 h-4" />
                                <span>Preview</span>
                            </Button>

                            {(() => {
                                const isDraft = originalData?.status === 'draft'
                                const isActive = originalData?.status === 'active'
                                const userRole = (session?.user as any)?.role
                                const userAuthority = (session?.user as any)?.authority || []
                                const isSuperadmin = userAuthority.includes('platform_super_admin') || userRole === 'platform_super_admin'
                                const chatDisabled = originalData?.status === 'disabled' && !isSuperadmin

                                return (
                                    <>
                                        {isDraft && (
                                            <Button
                                                variant="solid"
                                                loading={isSaving}
                                                onClick={() => handleSave(true)}
                                                className="h-11 sm:h-12 px-6 sm:px-8 bg-primary hover:bg-primary-deep text-white font-black text-[11px] sm:text-xs rounded-xl sm:rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 w-full sm:w-auto"
                                            >
                                                <Rocket className="w-4 h-4" />
                                                <span className="hidden sm:inline">Publish</span>
                                                <span className="sm:hidden">Publish</span>
                                            </Button>
                                        )}

                                        {isActive && (
                                            <Button
                                                variant="default"
                                                disabled={chatDisabled}
                                                onClick={() => !chatDisabled && router.push(`/dashboard/copilot-hub/chat/${copilotId}`)}
                                                className={classNames(
                                                    "h-11 sm:h-12 px-5 sm:px-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-black text-[11px] sm:text-xs rounded-xl sm:rounded-2xl shadow-sm transition-all hover:bg-gray-50 flex items-center justify-center gap-2 w-full sm:w-auto",
                                                    chatDisabled && "opacity-50 grayscale cursor-not-allowed"
                                                )}
                                            >
                                                <Rocket className="w-4 h-4" />
                                                <span className="hidden sm:inline">Start Real Chat</span>
                                                <span className="sm:hidden">Chat</span>
                                            </Button>
                                        )}

                                        <Button
                                            variant={isDraft ? "default" : "solid"}
                                            loading={isSaving}
                                            disabled={!hasChanges}
                                            onClick={() => handleSave(false)}
                                            className={classNames(
                                                "h-11 sm:h-12 px-6 sm:px-8 font-black text-[11px] sm:text-xs rounded-xl sm:rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 w-full sm:w-auto",
                                                isDraft
                                                    ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 shadow-sm"
                                                    : "bg-primary hover:bg-primary-deep text-white shadow-xl shadow-primary/20"
                                            )}
                                        >
                                            <Save className="w-4 h-4" />
                                            <span>{isDraft ? 'Save Draft' : 'Save Changes'}</span>
                                        </Button>
                                    </>
                                )
                            })()}
                        </div>
                    </div>

                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium max-w-3xl leading-relaxed lg:pl-20">
                        {formData.description || 'Manage your copilot\'s behavior, files, and access permissions.'}
                    </p>
                </div>
            </div>

            {/* Settings Content */}
            <div className="w-full py-4 sm:py-8">
                {/* Settings Content */}
                <Tabs
                    value={activeTab}
                    onChange={(val) => setActiveTab(val)}
                    className="w-full"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                        <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
                            <Tabs.TabList className="flex gap-1 sm:gap-2 p-1 sm:p-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-800 w-fit min-w-max">
                                {[
                                    { value: 'general', label: 'General', icon: <Settings className="w-3.5 h-3.5" /> },
                                    { value: 'model', label: 'Model', icon: <Cpu className="w-3.5 h-3.5" /> },
                                    { value: 'capabilities', label: 'Capabilities', icon: <Zap className="w-3.5 h-3.5" /> },
                                    { value: 'prompts', label: 'Prompts', icon: <BookOpen className="w-3.5 h-3.5" /> },
                                    /* { value: 'integrations', label: 'Integrations', icon: <Link2 className="w-3.5 h-3.5" /> }, */
                                    { value: 'connect-data', label: 'Knowledge Base', icon: <Database className="w-3.5 h-3.5" /> },
                                    ...((session?.user as any)?.role !== 'user' ? [
                                        { value: 'permissions', label: 'Permissions', icon: <Shield className="w-3.5 h-3.5" /> }
                                    ] : []),
                                    { value: 'danger', label: 'Danger Zone', icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'text-red-500' },
                                ].map((tab) => (
                                    <Tabs.TabNav
                                        key={tab.value}
                                        value={tab.value}
                                        className={classNames(
                                            "flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all duration-300 whitespace-nowrap",
                                            activeTab === tab.value
                                                ? "bg-white dark:bg-gray-900 text-primary shadow-sm"
                                                : classNames("text-gray-500 hover:text-gray-900 dark:hover:text-white", tab.color)
                                        )}
                                    >
                                        <span className="hidden sm:inline">{tab.icon}</span>
                                        <span className="truncate">{tab.label}</span>
                                    </Tabs.TabNav>
                                ))}
                            </Tabs.TabList>
                        </div>
                    </div>

                    <div className="mt-6 sm:mt-8 space-y-6 sm:space-y-10">
                        {/* General Settings */}
                        <Tabs.TabContent value="general">
                            <Card className="w-full p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl sm:rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-visible">
                                <div className="p-4 sm:p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Settings className="w-4 h-4 text-primary" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">Basic Information</h3>
                                </div>
                                <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-gray-600 dark:text-gray-400 pl-1">
                                            Copilot Name <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            placeholder="Enter copilot name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="h-14 rounded-xl border-gray-200 focus:ring-4 focus:ring-primary/10 font-bold"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-gray-600 dark:text-gray-400 pl-1">
                                            Public Description
                                        </label>
                                        <Input
                                            placeholder="What does this copilot do? Describe its main purpose..."
                                            textArea
                                            rows={4}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="rounded-xl border-gray-200 focus:ring-4 focus:ring-primary/10 font-medium text-base resize-none"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-black text-gray-600 dark:text-gray-400 pl-1">
                                                Assigned Domain
                                            </label>
                                            <span className="text-[10px] text-gray-400 font-bold bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-md">Scope Restriction</span>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                                <Globe className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <Input
                                                placeholder="e.g., Qorebit Ecosystem, Finance Department, DevOps"
                                                value={formData.domain || ''}
                                                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                                                className="h-14 rounded-xl border-gray-200 focus:ring-4 focus:ring-primary/10 font-bold pl-12"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium pl-1 italic">
                                            Activating a domain will force the copilot to refuse any requests outside its specific expertise using your custom refusal protocol.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                                        <div className="space-y-2 sm:space-y-4">
                                            <label className="text-xs font-black text-gray-600 dark:text-gray-400 pl-1">
                                                Category
                                            </label>
                                            <Select
                                                options={categoryOptions}
                                                value={categoryOptions.find(o => o.value === formData.category)}
                                                onChange={(option) => setFormData({ ...formData, category: option?.value as CopilotCategory })}
                                                className="rounded-xl"
                                            />
                                        </div>

                                        <div className="space-y-2 sm:space-y-4">
                                            <label className="text-xs font-black text-gray-600 dark:text-gray-400 pl-1">
                                                Status
                                            </label>
                                            <Select
                                                options={statusOptions}
                                                value={statusOptions.find(o => o.value === formData.status)}
                                                onChange={(option) => setFormData({ ...formData, status: option?.value as any })}
                                                className="rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6 pt-4 border-t border-gray-50 dark:border-gray-800">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-gray-400 pl-1">
                                                    Privacy & Access
                                                </label>
                                                <p className="text-[10px] text-gray-400 font-medium pl-1 italic">Who can interact with this copilot?</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                            {[
                                                { value: 'private', label: 'Private Mode', icon: Lock, description: 'Only you and platform admins can access this' },
                                                { value: 'workspace', label: 'Workspace Mode', icon: Users, description: 'Shared with everyone in your current workspace' },
                                                { value: 'public', label: 'Public Mode (Org)', icon: Globe, description: 'Accessible to all users in the organization' },
                                            ].filter(o => {
                                                const userRole = (session?.user as any)?.role
                                                if (userRole === 'user') {
                                                    return o.value !== 'workspace' && o.value !== 'public'
                                                }
                                                return true
                                            }).map((option) => (
                                                <div
                                                    key={option.value}
                                                    className={classNames(
                                                        "p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group",
                                                        formData.visibility === option.value
                                                            ? 'border-primary bg-primary/[0.02] shadow-sm ring-4 ring-primary/5'
                                                            : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                                                    )}
                                                    onClick={() => setFormData({ ...formData, visibility: option.value as any })}
                                                >
                                                    <div className={classNames(
                                                        "w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-3 sm:mb-4 transition-colors",
                                                        formData.visibility === option.value ? 'bg-primary text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:text-gray-600'
                                                    )}>
                                                        <option.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    </div>
                                                    <p className="font-black text-[11px] sm:text-xs text-gray-900 dark:text-gray-100 mb-1">
                                                        {option.label}
                                                    </p>
                                                    <p className="text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                                                        {option.description}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-6 pt-6 border-t border-gray-50 dark:border-gray-800">
                                        <div className="space-y-1">
                                            <label className="text-xs font-black text-gray-600 dark:text-gray-400 pl-1">
                                                Agent Capabilities
                                            </label>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium pl-1 italic">Configure what this autonomous agent is allowed to do.</p>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {CAPABILITY_OPTIONS.filter(cap => ['web-search', 'api-integration', 'function-calling', 'memory', 'vision'].includes(cap.value)).map((cap) => {

                                                const isActive = (formData.capabilities || []).includes(cap.value)
                                                return (
                                                    <div
                                                        key={cap.value}
                                                        className={classNames(
                                                            "p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-start justify-between group",
                                                            isActive
                                                                ? 'border-primary bg-primary/[0.02] shadow-sm ring-4 ring-primary/5'
                                                                : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                                                        )}
                                                        onClick={() => toggleCapability(cap.value)}
                                                    >
                                                        <div className="flex gap-4">
                                                            <div className={classNames(
                                                                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                                                isActive ? 'bg-primary text-white ' : 'bg-gray-50 dark:bg-gray-800 text-gray-400'
                                                            )}>
                                                                <Zap className="w-5 h-5" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="font-black text-[11px] text-gray-900 dark:text-white">
                                                                    {cap.label}
                                                                </p>
                                                                <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed max-w-[150px]">
                                                                    {cap.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Switcher
                                                            checked={isActive}
                                                            onChange={() => { }} // Handle via parent click
                                                            className="pointer-events-none"
                                                        />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div className="mt-2 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-2xl flex gap-3">
                                            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                            <p className="text-xs leading-relaxed font-bold text-amber-700 dark:text-amber-400/80">
                                                Some capabilities like <span className="underline decoration-amber-500/50">Web Search</span> and <span className="underline decoration-amber-500/50">API Integration</span> require additional platform credits for execution. Ensure your workspace balance is sufficient.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Tabs.TabContent>

                        {/* Model Settings */}
                        <Tabs.TabContent value="model">
                            <Card className="w-full p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl sm:rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-visible">
                                <div className="p-4 sm:p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Cpu className="w-4 h-4 text-primary" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">AI Brain Settings</h3>
                                </div>
                                <div className="p-4 sm:p-8 space-y-8 sm:space-y-10">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-gray-600 dark:text-gray-400 pl-1">
                                            Primary AI Model
                                        </label>
                                        <Select
                                            options={modelOptions}
                                            value={modelOptions.find(o => o.value === formData.model)}
                                            onChange={(option) => setFormData({ ...formData, model: option?.value })}
                                            isSearchable
                                            placeholder="Select a model..."
                                            formatOptionLabel={({ label, description, color }: any) => (
                                                <div className="flex items-center gap-4 py-1">
                                                    <div
                                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg transition-transform group-hover:scale-110"
                                                        style={{ backgroundColor: color }}
                                                    >
                                                        {label.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-gray-900 dark:text-gray-100 text-xs leading-none mb-1">
                                                            {label}
                                                        </span>
                                                        <span className="text-xs text-gray-700 dark:text-gray-300 font-bold">
                                                            {description}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            className="rounded-xl"
                                        />
                                        <div className="mt-4 p-5 bg-primary/[0.02] dark:bg-primary/[0.05] rounded-2xl border border-primary/10 flex items-start gap-4">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <Zap className="w-4 h-4 text-primary" />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-xs font-black text-primary">Latest Version Active</span>
                                                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                                                    Utilizing current frontier intelligence. The system automatically switches to the highest performing weights available for the selected provider.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                                        <div className="space-y-4 sm:space-y-6">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-black text-gray-600 dark:text-gray-400 pl-1">
                                                    Creativity Level (Temperature)
                                                </label>
                                                <span className="text-lg font-black text-primary bg-primary/5 px-3 py-1 rounded-lg">
                                                    {formData.temperature}
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="2"
                                                step="0.1"
                                                value={formData.temperature}
                                                onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                                                className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                            <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold italic leading-relaxed">
                                                Lower: Precise & Factual • Higher: Creative & Random
                                            </p>
                                        </div>

                                        <div className="space-y-4 sm:space-y-6">
                                            <label className="text-xs font-black text-gray-600 dark:text-gray-400 pl-1">
                                                Max Tokens (Response Length)
                                            </label>
                                            <Input
                                                type="number"
                                                min={256}
                                                max={32768}
                                                step={256}
                                                value={formData.maxTokens}
                                                onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                                                className="h-12 sm:h-14 rounded-xl border-gray-200 focus:ring-4 focus:ring-primary/10 font-bold"
                                            />
                                            <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold italic leading-relaxed">
                                                Sets the maximum number of words or characters in a single response.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Tabs.TabContent>

                        {/* Capabilities */}
                        <Tabs.TabContent value="capabilities">
                            <Card className="w-full p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl sm:rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                                <div className="p-4 sm:p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Zap className="w-4 h-4 text-primary" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">Capabilities</h3>
                                </div>
                                <div className="p-4 sm:p-8">
                                    <p className="text-xs text-gray-600 dark:text-gray-400 font-black mb-8 pl-1">
                                        Enable features and capabilities for your copilot
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        {CAPABILITY_OPTIONS.map((cap) => {
                                            const isActive = (formData.capabilities || []).includes(cap.value)
                                            return (
                                                <div
                                                    key={cap.value}
                                                    className={classNames(
                                                        "p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-start justify-between group",
                                                        isActive
                                                            ? 'border-primary bg-primary/[0.02] shadow-sm ring-4 ring-primary/5'
                                                            : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                                                    )}
                                                    onClick={() => toggleCapability(cap.value)}
                                                >
                                                    <div className="flex gap-3 sm:gap-4">
                                                        <div className={classNames(
                                                            "w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors",
                                                            isActive ? 'bg-primary text-white ' : 'bg-gray-50 dark:bg-gray-800 text-gray-400'
                                                        )}>
                                                            <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="font-black text-[10px] sm:text-[11px] text-gray-900 dark:text-white">
                                                                {cap.label}
                                                            </p>
                                                            <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium leading-relaxed max-w-[120px] sm:max-w-[180px]">
                                                                {cap.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Switcher
                                                        checked={isActive}
                                                        onChange={() => { }} // Handle via parent click
                                                        className="pointer-events-none scale-75 sm:scale-100"
                                                    />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </Card>
                        </Tabs.TabContent>

                        {/* Prompts */}
                        <Tabs.TabContent value="prompts">
                            <div className="space-y-6 sm:space-y-10">
                                <Card className="w-full p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl sm:rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                                    <div className="p-4 sm:p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <BookOpen className="w-4 h-4 text-primary" />
                                        </div>
                                        <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">Prompts</h3>
                                    </div>
                                    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-black text-gray-600 dark:text-gray-400 pl-1">
                                                    AI Personality & Instructions (System Prompt)
                                                </label>
                                                <span className="bg-primary/5 text-primary text-xs font-black px-2 py-0.5 rounded-md">Instructions</span>
                                            </div>
                                            <Input
                                                textArea
                                                rows={12}
                                                placeholder="Give the AI its personality and rules on how to behave..."
                                                value={formData.systemPrompt}
                                                onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                                                className="font-mono text-sm bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border-gray-200 p-6 focus:ring-primary/10 leading-relaxed resize-none"
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-gray-600 dark:text-gray-400 pl-1">
                                                Welcome Message
                                            </label>
                                            <Input
                                                textArea
                                                rows={3}
                                                placeholder="The message displayed when a user initializes a session..."
                                                value={formData.welcomeMessage ?? ''}
                                                onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                                                className="rounded-xl border-gray-200 focus:ring-4 focus:ring-primary/10 font-medium text-base resize-none"
                                            />
                                        </div>
                                    </div>
                                </Card>

                                <Card className="w-full p-0 border-none shadow-xl shadow-gray-200/20 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl sm:rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                                    <div className="p-4 sm:p-6 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                                            <Zap className="w-3.5 h-3.5 text-amber-600" />
                                        </div>
                                        <h3 className="font-black text-gray-900 dark:text-white text-xs sm:text-sm">Suggested Prompts</h3>
                                    </div>
                                    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Add suggestion..."
                                                value={suggestedPromptInput}
                                                onChange={(e) => setSuggestedPromptInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && addSuggestedPrompt()}
                                                className="h-11 rounded-xl"
                                            />
                                            <Button
                                                variant="solid"
                                                onClick={addSuggestedPrompt}
                                                className="h-11 w-11 p-0 flex items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/10"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </Button>
                                        </div>

                                        <div className="space-y-3">
                                            {(formData.suggestedPrompts || []).map((prompt, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 group"
                                                >
                                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300 leading-relaxed">
                                                        {prompt}
                                                    </span>
                                                    <button
                                                        onClick={() => removeSuggestedPrompt(index)}
                                                        className="text-gray-300 hover:text-red-500 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            {(!formData.suggestedPrompts || formData.suggestedPrompts.length === 0) && (
                                                <div className="py-10 text-center space-y-2">
                                                    <MessageSquare className="w-8 h-8 text-gray-200 mx-auto" />
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 font-bold">No Suggestions</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </Tabs.TabContent>

                        {/* <Tabs.TabContent value="integrations">
                                <div className="space-y-10">
                                    <Card className="w-full p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                                        <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Link2 className="w-4 h-4 text-primary" />
                                            </div>
                                            <h3 className="text-lg font-black text-gray-900 dark:text-white">Integrations</h3>
                                        </div>
                                        <div className="p-8 space-y-8">
                                            <div className="space-y-6">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-[2rem] border border-gray-100 dark:border-gray-800 transition-all hover:bg-white dark:hover:bg-gray-800 group">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center p-3">
                                                            <Globe className="w-full h-full text-[#4285F4]" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-3">
                                                                <h4 className="font-black text-xs text-gray-900 dark:text-white">Google Drive</h4>
                                                                {googleDriveConnection ? (
                                                                    <span className="bg-green-100/50 text-green-600 text-[8px] font-black border border-green-200 px-1.5 py-0.5 rounded-md">Active Node</span>
                                                                ) : (
                                                                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-400 text-[8px] font-black px-1.5 py-0.5 rounded-md">Offline</span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed max-w-xs">Connect and sync files from your Google Drive storage</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        {googleDriveConnection ? (
                                                            <>
                                                                <Button
                                                                    variant="solid"
                                                                    onClick={() => setShowGoogleDriveBrowser(true)}
                                                                    className="h-11 px-6 bg-primary hover:bg-primary-deep text-white font-black text-xs rounded-xl shadow-lg shadow-primary/20"
                                                                >
                                                                    Browse Files
                                                                </Button>
                                                                <Button
                                                                    variant="default"
                                                                    onClick={handleDisconnectGoogleDrive}
                                                                    className="h-11 px-6 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-red-500 hover:bg-red-50 hover:border-red-100 font-black text-xs rounded-xl shadow-sm"
                                                                >
                                                                    Disconnect
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <Button
                                                                variant="solid"
                                                                onClick={handleConnectGoogleDrive}
                                                                loading={isLoadingGoogleDrive}
                                                                className="h-11 px-8 bg-primary hover:bg-primary-deep text-white font-black text-xs rounded-xl shadow-lg shadow-primary/20"
                                                            >
                                                                Connect Google Drive
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-50 pointer-events-none grayscale">
                                                    {[
                                                        { name: 'Slack Integration', icon: Globe, status: 'Restricted' },
                                                        { name: 'Microsoft Teams', icon: Users, status: 'In Core' },
                                                    ].map((item) => (
                                                        <div key={item.name} className="p-5 bg-gray-50/30 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center border border-gray-100 dark:border-gray-800">
                                                                    <item.icon className="w-5 h-5 text-gray-300" />
                                                                </div>
                                                                <span className="font-black text-[10px] text-gray-400">{item.name}</span>
                                                            </div>
                                                            <span className="text-[8px] font-black text-gray-300">{item.status}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </Tabs.TabContent> */}

                        {/* Knowledge Base */}
                        <Tabs.TabContent value="connect-data">
                            <div className="space-y-6 sm:space-y-10">
                                <Card className="w-full p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl sm:rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                                    <div className="p-4 sm:p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Database className="w-4 h-4 text-primary" />
                                        </div>
                                        <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">Knowledge Base</h3>
                                    </div>
                                    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 pl-1">
                                                Data Source
                                            </label>
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                                {[
                                                    { id: 'local', name: 'File Upload', description: 'Upload local documents', icon: Upload },
                                                    { id: 'google-drive', name: 'Google Drive', description: 'Sync from cloud', icon: Globe },
                                                    { id: 'database', name: 'Database', description: 'Connect to external data', icon: Database },
                                                    { id: 'api', name: 'Custom API', description: 'Connect via API', icon: Link2 },
                                                ].filter(s => {
                                                    const userRole = (session?.user as any)?.role
                                                    if (userRole === 'user') {
                                                        return s.id === 'local' || s.id === 'google-drive'
                                                    }
                                                    return true
                                                }).map((source) => (
                                                    <div
                                                        key={source.id}
                                                        onClick={() => {
                                                            setSelectedDataSource(source.id as any)
                                                            if (source.id === 'google-drive') {
                                                                if (!googleDriveConnection) {
                                                                    handleConnectGoogleDrive()
                                                                } else {
                                                                    setShowGoogleDriveBrowser(true)
                                                                }
                                                            }
                                                        }}
                                                        className={classNames(
                                                            "p-3 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group flex flex-col items-center text-center sm:items-start sm:text-left",
                                                            selectedDataSource === source.id
                                                                ? 'border-primary bg-primary/[0.02] shadow-sm ring-4 ring-primary/5'
                                                                : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                                                        )}
                                                    >
                                                        <div className={classNames(
                                                            "w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-2 sm:mb-4 transition-colors",
                                                            selectedDataSource === source.id ? 'bg-primary text-white ' : 'bg-gray-50 dark:bg-gray-800 text-gray-400'
                                                        )}>
                                                            <source.icon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
                                                        </div>
                                                        <p className="font-black text-[10px] sm:text-xs text-gray-900 dark:text-white mb-1">
                                                            {source.name}
                                                        </p>
                                                        <p className="hidden sm:block text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                                                            {source.description}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="w-full p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl sm:rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                                    <div className="p-4 sm:p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-primary" />
                                        </div>
                                        <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">Documents</h3>
                                    </div>

                                    <div className="p-4 sm:p-8">
                                        {isLoadingDocuments ? (
                                            <div className="py-20 flex items-center justify-center">
                                                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                            </div>
                                        ) : documents.length > 0 ? (
                                            <div className="space-y-4">
                                                {documents.map((doc) => (
                                                    <div
                                                        key={doc.id}
                                                        className="flex items-center justify-between p-3 sm:p-5 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 group transition-all hover:bg-white dark:hover:bg-gray-800"
                                                    >
                                                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                                            <div className={classNames(
                                                                "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-colors shadow-sm",
                                                                doc.status === 'completed' ? 'bg-green-100/50 text-green-600 border border-green-200' :
                                                                    doc.status === 'failed' ? 'bg-red-100/50 text-red-600 border border-red-200' :
                                                                        'bg-amber-100/50 text-amber-600 border border-amber-200'
                                                            )}>
                                                                <Database className="w-5 h-5 sm:w-6 sm:h-6" />
                                                            </div>
                                                            <div className="space-y-0.5 sm:space-y-1 min-w-0">
                                                                <p className="font-black text-[10px] sm:text-[11px] text-gray-900 dark:text-white truncate">
                                                                    {doc.title || doc.originalFilename}
                                                                </p>
                                                                <div className="flex items-center gap-2 sm:gap-3 text-[8px] sm:text-[9px] font-black text-gray-400">
                                                                    <span className="bg-gray-100 dark:bg-gray-800 px-1.5 sm:px-2 py-0.5 rounded-md truncate max-w-[60px] sm:max-w-none">{doc.fileSize ? `${(doc.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Size Unknown'}</span>
                                                                    <span className="h-1 w-1 bg-gray-300 rounded-full shrink-0"></span>
                                                                    <span className={classNames(
                                                                        "flex items-center gap-1 min-w-0",
                                                                        doc.status === 'completed' ? 'text-green-500' :
                                                                            doc.status === 'failed' ? 'text-red-500' :
                                                                                'text-amber-500 animate-pulse'
                                                                    )}>
                                                                        <div className={classNames(
                                                                            "w-1 h-1 rounded-full shrink-0",
                                                                            doc.status === 'completed' ? 'bg-green-500' :
                                                                                doc.status === 'failed' ? 'bg-red-500' :
                                                                                    'bg-amber-500'
                                                                        )} />
                                                                        <span className="truncate">{doc.status === 'processing' || doc.status === 'pending' ? 'Syncing...' : (DOCUMENT_STATUS_LABELS[doc.status] || doc.status)}</span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteDocument(doc.id)}
                                                            className="p-2 sm:p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all shadow-sm border border-transparent hover:border-red-100 shrink-0 ml-2"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        </button>

                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-24 text-center space-y-6">
                                                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-[2rem] flex items-center justify-center mx-auto border border-gray-100 dark:border-gray-700">
                                                    <Cpu className="w-10 h-10 text-gray-200" />
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="font-black text-xs text-gray-900 dark:text-white">No Documents Found</p>
                                                    <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">Upload files to get started</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Card>

                                {selectedDataSource === 'local' && (
                                    <Card className="w-full p-0 border-none shadow-xl shadow-gray-200/20 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl sm:rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 font-bold">
                                        <div className="p-4 sm:p-6 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Upload className="w-3.5 h-3.5 text-primary" />
                                            </div>
                                            <h3 className="font-black text-gray-900 dark:text-white text-xs sm:text-sm">Upload</h3>
                                        </div>

                                        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                                            <div
                                                className={classNames(
                                                    "relative border-2 border-dashed rounded-2xl sm:rounded-[2rem] p-6 sm:p-10 transition-all duration-300 flex flex-col items-center justify-center gap-4 sm:gap-6 text-center group",
                                                    isDragOver ? "border-primary bg-primary/[0.02] shadow-sm ring-8 ring-primary/[0.01]" : "border-gray-100 hover:border-primary/30"
                                                )}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                            >
                                                <input
                                                    type="file"
                                                    multiple
                                                    onChange={handleFileUpload}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    accept=".pdf,.docx,.txt"
                                                />
                                                <div className="w-16 h-16 bg-primary/5 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-primary/10">
                                                    <Upload className="w-8 h-8 text-primary" />
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black text-gray-900 dark:text-white">Click or Drag to Upload</p>
                                                    <p className="text-[9px] text-gray-400 font-black">Support: AI-Docs (PDF, TXT)</p>
                                                </div>
                                            </div>

                                            {uploadedFiles.length > 0 && (
                                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                    <p className="text-[10px] font-black text-gray-400 pl-1">Ready to Upload</p>
                                                    <div className="space-y-2">
                                                        {uploadedFiles.map((file, index) => (
                                                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                                                                <span className="text-[10px] font-black text-gray-500 truncate max-w-[140px]">{file.name}</span>
                                                                <button onClick={() => removeFile(index)} className="text-gray-300 hover:text-red-500 transition-colors">
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <Button
                                                        variant="solid"
                                                        onClick={handleUploadDocuments}
                                                        loading={isUploadingDocuments}
                                                        className="w-fit px-8 h-12 bg-primary hover:bg-primary-deep text-white font-black text-xs rounded-2xl shadow-2xl shadow-primary/20 mt-4"
                                                    >
                                                        Upload Documents
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                )}

                                {selectedDataSource === 'google-drive' && (
                                    <Card className="w-full p-0 border-none shadow-xl shadow-gray-200/20 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl sm:rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 font-bold">
                                        <div className="p-4 sm:p-6 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                <Globe className="w-3.5 h-3.5 text-blue-600" />
                                            </div>
                                            <h3 className="font-black text-gray-900 dark:text-white text-xs sm:text-sm">Google Drive Connection</h3>
                                        </div>

                                        <div className="p-4 sm:p-10 space-y-6">
                                            {!googleDriveConnection ? (
                                                <div className="flex flex-col items-center justify-center py-10 text-center space-y-6">
                                                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] flex items-center justify-center border border-blue-100 dark:border-blue-800">
                                                        <Globe className="w-10 h-10 text-blue-500" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] font-black text-gray-900 dark:text-white">Account Not Connected</p>
                                                        <p className="text-[9px] text-gray-400 font-black">Connect your Google account to sync documents</p>
                                                    </div>
                                                    <Button
                                                        variant="solid"
                                                        onClick={handleConnectGoogleDrive}
                                                        loading={isLoadingGoogleDrive}
                                                        className="px-10 h-12 bg-blue-600 hover:bg-blue-700 text-white font-black text-[9px] rounded-xl shadow-xl shadow-blue-500/20 mt-4"
                                                    >
                                                        Connect Google Drive
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="space-y-6">
                                                    <div className="p-6 bg-green-50/30 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-900/20 flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center border border-green-200 dark:border-green-800">
                                                                <RefreshCw className="w-6 h-6 text-green-600 animate-spin-slow" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-[11px] font-black text-gray-900 dark:text-white">
                                                                    Connected: {googleDriveConnection.providerEmail}
                                                                </p>
                                                                <p className="text-[9px] font-bold text-green-600">Account is active and syncing</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={handleDisconnectGoogleDrive}
                                                            className="text-[9px] font-black text-red-500 hover:text-red-600 underline decoration-2 underline-offset-4"
                                                        >
                                                            Disconnect
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <button
                                                            onClick={() => setShowGoogleDriveBrowser(true)}
                                                            className="flex items-center justify-center gap-3 p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-300 hover:bg-white dark:hover:bg-gray-800 transition-all group"
                                                        >
                                                            <Folder className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                                                            <span className="text-[10px] font-black text-gray-600 dark:text-gray-300">Browse Files</span>
                                                        </button>
                                                        <button
                                                            onClick={() => fetchDocuments()}
                                                            className="flex items-center justify-center gap-3 p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-green-300 hover:bg-white dark:hover:bg-gray-800 transition-all group"
                                                        >
                                                            <RefreshCw className="w-5 h-5 text-green-500 group-hover:rotate-180 transition-transform duration-500" />
                                                            <span className="text-[10px] font-black text-gray-600 dark:text-gray-300">Sync Status</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                )}

                                {(selectedDataSource === 'database' || selectedDataSource === 'api') && (
                                    <Card className="w-full p-0 border-none shadow-xl shadow-gray-200/20 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl sm:rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 font-bold">
                                        <div className="p-4 sm:p-6 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                                <Zap className="w-3.5 h-3.5 text-purple-600" />
                                            </div>
                                            <h3 className="font-black text-gray-900 dark:text-white text-xs sm:text-sm">Enterprise Connector</h3>
                                        </div>
                                        <div className="p-10 sm:p-20 text-center space-y-4">
                                            <div className="w-20 h-20 bg-purple-50 dark:bg-purple-900/20 rounded-[2rem] flex items-center justify-center mx-auto border border-purple-100 dark:border-purple-800">
                                                <Lock className="w-10 h-10 text-purple-200" />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="font-black text-[10px] text-gray-900 dark:text-white">Coming Soon</p>
                                                <p className="text-[9px] text-gray-400 font-bold">This connector is being tuned for your organization</p>
                                            </div>
                                        </div>
                                    </Card>
                                )}
                            </div>
                        </Tabs.TabContent>

                        {/* Permissions & Restrictions */}
                        <Tabs.TabContent value="permissions">
                            <div className="space-y-6 sm:space-y-10">
                                <Card className="w-full p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl sm:rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                                    <div className="p-4 sm:p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Shield className="w-4 h-4 text-primary" />
                                        </div>
                                        <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">Permissions</h3>
                                    </div>
                                    <div className="p-4 sm:p-8 space-y-6 sm:space-y-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 pl-1">
                                                Workspace Access
                                            </label>
                                            <div
                                                className={classNames(
                                                    "p-6 rounded-[1.5rem] border-2 cursor-pointer transition-all duration-300",
                                                    workspaceAccess
                                                        ? 'border-primary bg-primary/[0.02] shadow-sm ring-4 ring-primary/5'
                                                        : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                                                )}
                                                onClick={() => setWorkspaceAccess(!workspaceAccess)}
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3 sm:gap-5">
                                                        <div className={classNames(
                                                            "w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors shadow-sm shrink-0",
                                                            workspaceAccess ? 'bg-primary text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 border border-gray-100 dark:border-gray-800'
                                                        )}>
                                                            <Users className="w-5 h-5 sm:w-7 sm:h-7" />
                                                        </div>
                                                        <div className="space-y-0.5 sm:space-y-1">
                                                            <p className="font-black text-[11px] sm:text-xs text-gray-900 dark:text-white">Enable for entire workspace</p>
                                                            <p className="text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed max-w-sm">Allow everyone in the workspace to use this copilot</p>
                                                        </div>
                                                    </div>
                                                    <Switcher
                                                        checked={workspaceAccess}
                                                        onChange={() => setWorkspaceAccess(!workspaceAccess)}
                                                        className="scale-75 sm:scale-100 self-end sm:self-auto"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[10px] font-black text-gray-400 pl-1">
                                                    Access by Role
                                                </label>
                                                <p className="text-[10px] text-gray-500 font-medium pl-1">Limit access to users with specific roles</p>
                                            </div>

                                            <div className="space-y-6">
                                                <Select
                                                    isMulti
                                                    options={ROLE_OPTIONS}
                                                    value={ROLE_OPTIONS.filter(role => selectedRoles.includes(role.value))}
                                                    onChange={(options) => {
                                                        if (Array.isArray(options)) {
                                                            setSelectedRoles(options.map(opt => opt.value))
                                                        }
                                                    }}
                                                    placeholder="Select roles..."
                                                    className="h-14 rounded-xl border-gray-200 focus:ring-4 focus:ring-primary/10"
                                                />

                                                {selectedRoles.length > 0 && (
                                                    <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        {selectedRoles.map((role) => {
                                                            const roleOption = ROLE_OPTIONS.find(r => r.value === role)
                                                            return (
                                                                <div
                                                                    key={role}
                                                                    className="inline-flex items-center gap-3 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl"
                                                                >
                                                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                                                    <span className="text-[10px] font-black text-gray-900 dark:text-white">
                                                                        {roleOption?.label}
                                                                    </span>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            setSelectedRoles(prev => prev.filter(r => r !== role))
                                                                        }}
                                                                        className="ml-1 p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                                    >
                                                                        <X className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </Tabs.TabContent>

                        {/* Danger Zone */}
                        <Tabs.TabContent value="danger">
                            <Card className="w-full p-0 border-none shadow-2xl shadow-red-200/20 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl sm:rounded-[2rem] overflow-hidden border border-red-100 dark:border-red-900/30">
                                <div className="p-4 sm:p-8 border-b border-red-50 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                        <AlertTriangle className="w-4 h-4 text-red-500" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-black text-red-600 dark:text-red-500">Danger Zone</h3>
                                </div>
                                <div className="p-4 sm:p-8">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 p-4 sm:p-8 bg-red-50/50 dark:bg-red-900/5 rounded-2xl sm:rounded-[2rem] border border-red-100 dark:border-red-900/20">
                                        <div className="space-y-1 sm:space-y-2">
                                            <h4 className="font-black text-xs sm:text-sm text-red-600">Delete Copilot</h4>
                                            <p className="text-[10px] sm:text-xs text-gray-500 font-medium leading-relaxed max-w-md">This will permanently delete the copilot and all its data. This action cannot be undone.</p>
                                        </div>
                                        <Button
                                            variant="solid"
                                            onClick={() => setShowDeleteDialog(true)}
                                            className="h-11 sm:h-14 px-6 sm:px-10 bg-red-600 hover:bg-red-700 text-white font-black text-[11px] sm:text-xs rounded-xl sm:rounded-2xl shadow-xl shadow-red-500/20 shrink-0 w-full md:w-auto"
                                        >
                                            Delete Copilot
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </Tabs.TabContent>
                    </div>
                </Tabs>
            </div>

            {/* Google Drive File Browser Modal */}
            <Dialog
                isOpen={showGoogleDriveBrowser}
                onClose={() => setShowGoogleDriveBrowser(false)}
                width={800}
            >
                <div className="p-4 sm:p-8">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-8">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center border border-primary/20">
                            <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white">Google Drive</h2>
                            <p className="text-[8px] sm:text-[10px] text-gray-400 font-black">Select files to import</p>
                        </div>
                    </div>

                    <GoogleDriveFileBrowser
                        copilotId={copilotId}
                        onImportSuccess={() => {
                            setShowGoogleDriveBrowser(false)
                            fetchDocuments()
                        }}
                    />
                </div>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                width={500}
            >
                <div className="p-2 sm:p-4">
                    <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 dark:bg-red-900/20 rounded-xl sm:rounded-2xl flex items-center justify-center border border-red-100 dark:border-red-800">
                            <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white">Delete Copilot</h2>
                            <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 font-black">This cannot be undone</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Are you sure you want to delete this copilot? This will permanently remove all documents, chat history, and settings.
                        </p>

                        <div className="flex justify-end gap-3 pt-6">
                            <button
                                onClick={() => setShowDeleteDialog(false)}
                                className="h-12 px-6 font-black text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 transition-colors"
                            >
                                Cancel
                            </button>
                            <Button
                                variant="solid"
                                onClick={handleDelete}
                                loading={isDeleting}
                                className="h-12 px-8 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-xl shadow-red-500/20"
                            >
                                Delete Copilot
                            </Button>
                        </div>
                    </div>
                </div>
            </Dialog>

            <ConfirmDialog
                isOpen={showDeleteDocDialog}
                type="danger"
                title="Delete Document"
                confirmText="Delete permanently"
                confirmButtonProps={{ loading: isDeletingDoc, className: "bg-red-600 hover:bg-red-700" }}
                onClose={() => setShowDeleteDocDialog(false)}
                onCancel={() => setShowDeleteDocDialog(false)}
                onConfirm={confirmDeleteDocument}
            >
                <p className="text-gray-500 font-medium leading-relaxed">
                    Are you sure you want to delete this document from the knowledge base?
                    This action cannot be undone and the copilot will lose access to this information.
                </p>
            </ConfirmDialog>
            {/* Preview Drawer */}
            {originalData && (
                <CopilotPreviewDrawer
                    isOpen={showPreview}
                    onClose={() => setShowPreview(false)}
                    copilot={originalData}
                />
            )}
        </div>
    )
}

