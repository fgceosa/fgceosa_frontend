'use client'

import React, { useEffect, useState, useCallback } from 'react'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft,
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
    MessageSquare,
    Save,
    Activity,
    Shield,
    FileText,
    History as HistoryIcon,
    BarChart3,
    CheckCircle,
    PauseCircle,
    XCircle,
    Search,
    Database,
    Upload,
    Plus,
    X,
    Loader2,
    RefreshCw,
    Folder
} from 'lucide-react'
import {
    Button,
    Card,
    Input,
    Select,
    Tabs,
    Switcher,
    Badge,
    Spinner,
    Notification,
    toast,
    Dialog
} from '@/components/ui'
import {
    apiGetCopilot,
    apiUpdateCopilot,
    apiDeleteCopilot,
    apiUploadDocument,
    apiListDocuments,
    apiDeleteDocument,
    apiGetDocumentStatus,
    apiGetCopilotAnalytics,
    apiGetCopilotActivity
} from '@/services/CopilotService'
import {
    apiGetGoogleDriveConnection,
    apiGetGoogleDriveAuthUrl,
    apiDisconnectGoogleDrive
} from '@/services/GoogleDriveService'
import GoogleDriveFileBrowser from '@/app/(protected-pages)/dashboard/copilot-hub/_components/GoogleDriveFileBrowser'
import QorebitLoading from '@/components/shared/QorebitLoading'
import {
    Copilot,
    CopilotStatus,
    CopilotVisibility,
    CopilotCategory,
    CopilotDocument,
    UpdateCopilotPayload,
    COPILOT_CATEGORIES,
    COPILOT_MODELS,
    DOCUMENT_STATUS_LABELS
} from '@/app/(protected-pages)/dashboard/copilot-hub/types'
import classNames from '@/utils/classNames'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import CopilotPreviewDrawer from '../_components/CopilotPreviewDrawer'

dayjs.extend(relativeTime)

export default function PlatformCopilotDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const copilotId = params.copilotId as string
    const { session } = useCurrentSession()
    const userRole = (session?.user as any)?.role
    const userAuthority = (session?.user as any)?.authority || []
    const isSuperadmin = userAuthority.includes('platform_super_admin') || userRole === 'platform_super_admin'

    const [copilot, setCopilot] = useState<Copilot | null>(null)
    const [formData, setFormData] = useState<Partial<Copilot>>({})
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [activeTab, setActiveTab] = useState('overview')
    const [hasChanges, setHasChanges] = useState(false)
    const [isPreviewDrawerOpen, setIsPreviewDrawerOpen] = useState(false)

    // Analytics & Activity state
    const [analytics, setAnalytics] = useState<any>(null)
    const [activities, setActivities] = useState<any[]>([])
    const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false)
    const [isLoadingActivity, setIsLoadingActivity] = useState(false)

    // Knowledge state
    const [selectedDataSource, setSelectedDataSource] = useState<'local' | 'google-drive' | 'database' | 'api'>('local')
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [isDragOver, setIsDragOver] = useState(false)
    const [documents, setDocuments] = useState<CopilotDocument[]>([])
    const [isUploadingDocuments, setIsUploadingDocuments] = useState(false)
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(false)

    // Google Drive state
    const [googleDriveConnection, setGoogleDriveConnection] = useState<any>(null)
    const [isLoadingGoogleDrive, setIsLoadingGoogleDrive] = useState(false)
    const [showGoogleDriveBrowser, setShowGoogleDriveBrowser] = useState(false)


    const fetchCopilot = useCallback(async () => {
        try {
            setIsLoading(true)
            const data = await apiGetCopilot(copilotId)
            setCopilot(data)
            setFormData(data)
        } catch (error) {
            console.error('Failed to fetch copilot details', error)
            toast.push(
                <Notification type="danger" duration={3000}>
                    Failed to load copilot details
                </Notification>
            )
        } finally {
            setIsLoading(false)
        }
    }, [copilotId])

    const fetchDocuments = useCallback(async () => {
        try {
            setIsLoadingDocuments(true)
            const response = await apiListDocuments(copilotId)
            setDocuments(response.documents)
        } catch (err) {
            console.error('Failed to fetch documents:', err)
        } finally {
            setIsLoadingDocuments(false)
        }
    }, [copilotId])

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

    // Poll documents for status updates
    useEffect(() => {
        const hasProcessingDocs = documents.some(
            doc => doc.status === 'processing' || doc.status === 'pending'
        )

        if (!hasProcessingDocs) return

        const interval = setInterval(() => {
            fetchDocuments()
        }, 3000)

        return () => clearInterval(interval)
    }, [documents, fetchDocuments])

    const handleUploadDocuments = async () => {
        if (uploadedFiles.length === 0) return

        setIsUploadingDocuments(true)
        try {
            for (const file of uploadedFiles) {
                await apiUploadDocument(copilotId, file)
            }
            setUploadedFiles([])
            fetchDocuments()
            toast.push(
                <Notification type="success" title="Knowledge Acquired" duration={3000}>
                    Documents uploaded and processing.
                </Notification>
            )
        } catch (error) {
            console.error('Failed to upload documents:', error)
            toast.push(
                <Notification type="danger" title="Upload Failed" duration={5000}>
                    Failed to upload processing nodes.
                </Notification>
            )
        } finally {
            setIsUploadingDocuments(false)
        }
    }

    const handleDeleteDocument = async (documentId: string) => {
        try {
            await apiDeleteDocument(copilotId, documentId)
            setDocuments(prev => prev.filter(d => d.id !== documentId))
            toast.push(
                <Notification type="success" duration={3000}>
                    Document removed from registry.
                </Notification>
            )
        } catch (error) {
            console.error('Failed to delete document:', error)
            toast.push(
                <Notification type="danger" duration={3000}>
                    Failed to delete document.
                </Notification>
            )
        }
    }

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

    const handleConnectGoogleDrive = async () => {
        try {
            const { authorizationUrl, state } = await apiGetGoogleDriveAuthUrl()
            sessionStorage.setItem('google_drive_oauth_state', state)
            sessionStorage.setItem('google_drive_copilot_id', copilotId)
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

    const handleDisconnectGoogleDrive = async () => {
        try {
            await apiDisconnectGoogleDrive()
            setGoogleDriveConnection(null)
            setShowGoogleDriveBrowser(false)
            toast.push(
                <Notification type="success" title="Node Disconnected" duration={3000}>
                    Google Drive access revoked.
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

    const fetchAnalytics = useCallback(async () => {
        try {
            setIsLoadingAnalytics(true)
            const data = await apiGetCopilotAnalytics(copilotId)
            setAnalytics(data)
        } catch (err) {
            console.error('Failed to fetch analytics:', err)
        } finally {
            setIsLoadingAnalytics(false)
        }
    }, [copilotId])

    const fetchActivity = useCallback(async () => {
        try {
            setIsLoadingActivity(true)
            const data = await apiGetCopilotActivity(copilotId, { skip: 0, limit: 10 })
            setActivities(data.activities || [])
        } catch (err) {
            console.error('Failed to fetch activity:', err)
        } finally {
            setIsLoadingActivity(false)
        }
    }, [copilotId])


    useEffect(() => {
        if (copilotId) {
            fetchCopilot()
            fetchDocuments()
            fetchGoogleDriveConnection()
        }
    }, [copilotId, fetchCopilot, fetchDocuments, fetchGoogleDriveConnection])

    useEffect(() => {
        if (copilot) {
            const changed = JSON.stringify(formData) !== JSON.stringify(copilot)
            setHasChanges(changed)
        }
    }, [formData, copilot])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const updatePayload: UpdateCopilotPayload = {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                status: formData.status,
                visibility: formData.visibility,
                model: formData.model,
                temperature: formData.temperature,
                maxTokens: formData.maxTokens,
                systemPrompt: formData.systemPrompt,
                welcomeMessage: formData.welcomeMessage || undefined,
                suggestedPrompts: formData.suggestedPrompts,
                capabilities: formData.capabilities,
                tags: formData.tags,
            }

            const updated = await apiUpdateCopilot(copilotId, updatePayload)
            setCopilot(updated)
            setFormData(updated)
            toast.push(
                <Notification type="success" duration={3000}>
                    Configuration updated successfully
                </Notification>
            )
        } catch (error) {
            console.error('Failed to save copilot:', error)
            toast.push(
                <Notification type="danger" duration={3000}>
                    Failed to save changes
                </Notification>
            )
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await apiDeleteCopilot(copilotId)
            toast.push(
                <Notification type="success" title="Deleted" duration={3000}>
                    Copilot removed from global registry
                </Notification>
            )
            router.push('/platform-copilot-management')
        } catch (error) {
            console.error('Failed to delete copilot:', error)
            toast.push(
                <Notification type="danger" title="Error" duration={3000}>
                    Failed to delete copilot
                </Notification>
            )
        } finally {
            setIsDeleting(false)
        }
    }

    if (isLoading) {
        return <QorebitLoading />
    }

    if (!copilot) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-6">
                    <AlertTriangle className="w-10 h-10 text-amber-500" />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Copilot Not Found</h3>
                <p className="text-gray-500 mb-6 max-w-sm">The requested copilot could not be found in the system registry.</p>
                <Link href="/platform-copilot-management">
                    <Button variant="solid" className="bg-primary text-white">Return to Registry</Button>
                </Link>
            </div>
        )
    }

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
        { value: 'draft', label: 'Draft' },
        { value: 'inactive', label: 'Paused' },
        { value: 'disabled', label: 'Disabled' },
    ]

    return (
        <div className="py-8 px-4 sm:px-6 space-y-10 w-full animate-in fade-in duration-700">
            {/* Enterprise Header Section */}
            <div className="flex flex-col space-y-8">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="plain"
                            onClick={() => router.push('/platform-copilot-management')}
                            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl h-10 w-10 p-0 flex items-center justify-center transition-all active:scale-95 border border-gray-100 dark:border-gray-700 shadow-sm"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </Button>
                        <div className="h-px w-8 bg-gray-200 dark:bg-gray-800"></div>
                        <span className="text-xs font-black text-primary">Copilot Management Center</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary rounded-2xl blur-xl opacity-20"></div>
                                <div className="relative p-3 bg-gradient-to-br from-primary to-blue-700 rounded-2xl shadow-xl ring-4 ring-white dark:ring-gray-900">
                                    <Bot className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100">
                                    {formData.name || 'Copilot Console'}
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-black text-gray-600 dark:text-gray-400">Status:</span>
                                    <Badge className={classNames(
                                        "px-2 py-0.5 text-[8px] font-black rounded-md",
                                        formData.status === 'active' ? 'bg-green-50 text-green-700 dark:bg-green-900/30' :
                                            formData.status === 'draft' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30' :
                                                formData.status === 'inactive' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30' :
                                                    'bg-red-50 text-red-700 dark:bg-red-900/30'
                                    )}>
                                        {formData.status === 'inactive' ? 'Paused' : formData.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {isSuperadmin && (
                                <Button
                                    variant="default"
                                    onClick={() => setIsPreviewDrawerOpen(true)}
                                    className="h-12 px-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-black text-[10px] rounded-2xl shadow-sm transition-all hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    Preview Chat
                                </Button>
                            )}
                            <Button
                                variant="solid"
                                loading={isSaving}
                                disabled={!hasChanges}
                                onClick={handleSave}
                                className="h-12 px-8 bg-primary hover:bg-primary-deep text-white font-black text-[10px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </Button>
                        </div>
                    </div>

                    <p className="text-base text-gray-500 dark:text-gray-400 font-medium max-w-3xl leading-relaxed lg:pl-20">
                        {formData.description || 'Full control over this copilot’s behavior, security settings, and performance limits.'}
                    </p>
                </div>
            </div>

            {/* Settings Content Tabs Overlay */}
            <div className="w-full">
                <Tabs
                    value={activeTab}
                    onChange={(val) => setActiveTab(val)}
                    className="w-full"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                        <Tabs.TabList className="flex gap-2 p-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 w-full overflow-x-auto">
                            {[
                                { value: 'overview', label: 'Overview', icon: <BarChart3 className="w-3.5 h-3.5" /> },
                                { value: 'general', label: 'General', icon: <Settings className="w-3.5 h-3.5" /> },
                                { value: 'model', label: 'Model', icon: <Cpu className="w-3.5 h-3.5" /> },
                                { value: 'capabilities', label: 'Capabilities', icon: <Zap className="w-3.5 h-3.5" /> },
                                { value: 'knowledge', label: 'Knowledge', icon: <BookOpen className="w-3.5 h-3.5" /> },
                                { value: 'access', label: 'Access', icon: <Shield className="w-3.5 h-3.5" /> },
                                { value: 'danger', label: 'Danger Zone', icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'text-red-500' },
                            ].map((tab) => (
                                <Tabs.TabNav
                                    key={tab.value}
                                    value={tab.value}
                                    className={classNames(
                                        "flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all duration-300 whitespace-nowrap",
                                        activeTab === tab.value
                                            ? "bg-white dark:bg-gray-900 text-primary shadow-sm"
                                            : classNames("text-gray-500 hover:text-gray-900 dark:hover:text-white", tab.color)
                                    )}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </Tabs.TabNav>
                            ))}
                        </Tabs.TabList>
                    </div>

                    <div className="mt-8">
                        {/* OVERVIEW TAB */}
                        <Tabs.TabContent value="overview" className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="p-6 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none rounded-[2rem]">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                            <MessageSquare className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-gray-600 dark:text-gray-400">Total Chats</p>
                                            <h4 className="text-2xl font-black text-gray-900 dark:text-white">
                                                {isLoadingAnalytics ? <span className="animate-pulse">...</span> : (analytics?.totalChats || 0).toLocaleString()}
                                            </h4>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-1 rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-full rounded-full" style={{ width: '45%' }}></div>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-bold">Activity level: {analytics?.totalChats > 100 ? 'High' : 'Normal'}</p>
                                </Card>

                                <Card className="p-6 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none rounded-[2rem]">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                                            <Activity className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-gray-600 dark:text-gray-400">Success Rate</p>
                                            <h4 className="text-2xl font-black text-gray-900 dark:text-white">
                                                {isLoadingAnalytics ? <span className="animate-pulse">...</span> : `${analytics?.successRate ?? 0}%`}
                                            </h4>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-1 rounded-full overflow-hidden">
                                        <div className="bg-purple-500 h-full rounded-full" style={{ width: `${analytics?.successRate ?? 0}%` }}></div>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-bold">System {analytics?.successRate > 95 ? 'Stable' : 'Check Required'}</p>
                                </Card>

                                <Card className="p-6 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none rounded-[2rem]">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                                            <Zap className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-gray-600 dark:text-gray-400">Response Speed</p>
                                            <h4 className="text-2xl font-black text-gray-900 dark:text-white">
                                                {isLoadingAnalytics ? <span className="animate-pulse">...</span> : `${analytics?.avgResponseTime ?? 0}s`}
                                            </h4>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-1 rounded-full overflow-hidden">
                                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }}></div>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-bold">Latency</p>
                                </Card>
                            </div>

                            <Card className="p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden">
                                <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <HistoryIcon className="w-4 h-4 text-primary" />
                                        </div>
                                        <h3 className="text-lg font-black text-gray-900 dark:text-white">Recent Activity</h3>
                                    </div>
                                    <Button variant="plain" size="sm" className="text-xs font-black text-primary">View All History</Button>
                                </div>
                                <div className="p-8 space-y-4">
                                    {isLoadingActivity ? (
                                        <div className="flex justify-center py-8"><Spinner size={24} /></div>
                                    ) : activities.length === 0 ? (
                                        <div className="text-center py-8 text-gray-400 text-sm italic">
                                            No recent activity found for this copilot.
                                        </div>
                                    ) : (
                                        activities.map((activity) => (
                                            <div key={activity.id} className="flex items-center gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 hover:border-primary/20 transition-all cursor-default group">
                                                <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center border border-gray-100 dark:border-gray-700 shadow-sm group-hover:scale-110 transition-transform">
                                                    <Zap className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="text-sm font-black text-gray-900 dark:text-white">{activity.title}</p>
                                                        <span className={classNames(
                                                            "text-xs font-black px-1.5 py-0.5 rounded border",
                                                            activity.activityStatus === 'success' ? "bg-green-50 text-green-600 border-green-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                                        )}>{activity.activityStatus}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 font-bold">
                                                        {dayjs(activity.createdAt).format('MMM D, YYYY • h:mm A')}
                                                        {activity.uniqueId && ` • ID: ${activity.uniqueId.substring(0, 8)}`}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </Card>
                        </Tabs.TabContent>

                        {/* GENERAL TAB */}
                        <Tabs.TabContent value="general" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <Card className="w-full p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-visible">
                                <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Settings className="w-4 h-4 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white">Basic Information</h3>
                                </div>
                                <div className="p-8 space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-gray-600 dark:text-gray-400 pl-1">
                                            Copilot Name <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            placeholder="Enter copilot name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="h-14 rounded-xl border-gray-200 focus:ring-4 focus:ring-primary/10 font-black text-xs"
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
                                            className="rounded-xl border-gray-200 focus:ring-4 focus:ring-primary/10 font-medium text-base resize-none p-4"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 pl-1">
                                                Category
                                            </label>
                                            <Select
                                                options={categoryOptions}
                                                value={categoryOptions.find(o => o.value === formData.category)}
                                                onChange={(option) => setFormData({ ...formData, category: option?.value as CopilotCategory })}
                                                className="rounded-xl font-bold text-xs"
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 pl-1">
                                                Current Status
                                            </label>
                                            <Select
                                                options={statusOptions}
                                                value={statusOptions.find(o => o.value === formData.status)}
                                                onChange={(option) => setFormData({ ...formData, status: option?.value as any })}
                                                className="rounded-xl font-bold text-xs"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Tabs.TabContent>

                        {/* MODEL TAB */}
                        <Tabs.TabContent value="model" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <Card className="w-full p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-visible">
                                <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Cpu className="w-4 h-4 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white">AI Settings</h3>
                                </div>
                                <div className="p-8 space-y-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 pl-1">
                                            AI Model
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
                                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg"
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
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] font-black text-gray-400 pl-1">
                                                    Creativity
                                                </label>
                                                <span className="text-xl font-black text-primary bg-primary/5 px-3 py-1 rounded-lg">
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
                                                className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                            <p className="text-[10px] text-gray-400 font-bold whitespace-nowrap">
                                                Lower: Precise & Factual • Higher: Creative & Random
                                            </p>
                                        </div>

                                        <div className="space-y-6">
                                            <label className="text-[10px] font-black text-gray-400 pl-1">
                                                Max Length
                                            </label>
                                            <Input
                                                type="number"
                                                min={256}
                                                max={32768}
                                                step={256}
                                                value={formData.maxTokens}
                                                onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                                                className="h-14 rounded-xl border-gray-200 focus:ring-4 focus:ring-primary/10 font-black text-xs"
                                            />
                                            <p className="text-xs text-gray-700 dark:text-gray-300 font-bold mb-4">
                                                Sets the maximum number of words or characters in a single response.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-6">
                                        <label className="text-xs font-black text-gray-600 dark:text-gray-400 pl-1">
                                            AI Personality & Instructions
                                        </label>
                                        <div className="relative group">
                                            <Input
                                                textArea
                                                rows={8}
                                                value={formData.systemPrompt}
                                                onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                                                className="rounded-xl border-gray-200 focus:ring-4 focus:ring-primary/10 font-mono text-xs leading-relaxed p-6"
                                                placeholder="Give the AI its personality and rules on how to behave..."
                                            />
                                            <div className="absolute right-4 bottom-4 flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                <span className="text-xs font-black text-gray-600 dark:text-gray-400">Validating...</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Tabs.TabContent>

                        {/* CAPABILITIES TAB */}
                        <Tabs.TabContent value="capabilities" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <Card className="w-full p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-visible">
                                <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Zap className="w-4 h-4 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white">Tools & Features</h3>
                                </div>
                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[
                                        { id: 'web-search', label: 'Web Search', icon: Globe, desc: 'Real-time access to the internet' },
                                        { id: 'code-execution', label: 'Code Interpreter', icon: Cpu, desc: 'Ability to run and test code' },
                                        { id: 'file-upload', label: 'File Access', icon: FileText, desc: 'Process and analyze uploaded documents' },
                                        { id: 'image-generation', label: 'Image Creation', icon: BarChart3, desc: 'Generate images from text prompts' },
                                        { id: 'memory', label: 'Memory', icon: Activity, desc: 'Remember past parts of the conversation' },
                                        { id: 'api-integration', label: 'API Tools', icon: Link2, desc: 'Connect to and use external services' },
                                    ].map((cap) => (
                                        <div
                                            key={cap.id}
                                            className={classNames(
                                                "p-6 rounded-[1.5rem] border-2 transition-all duration-300 group cursor-pointer",
                                                formData.capabilities?.includes(cap.id as any)
                                                    ? 'border-primary bg-primary/[0.02] ring-4 ring-primary/5 shadow-sm'
                                                    : 'border-gray-50 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                                            )}
                                            onClick={() => {
                                                const current = formData.capabilities || []
                                                if (current.includes(cap.id as any)) {
                                                    setFormData({ ...formData, capabilities: current.filter(c => c !== cap.id) })
                                                } else {
                                                    setFormData({ ...formData, capabilities: [...current, cap.id as any] })
                                                }
                                            }}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={classNames(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                                                    formData.capabilities?.includes(cap.id as any) ? 'bg-primary text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:text-primary'
                                                )}>
                                                    <cap.icon className="w-5 h-5" />
                                                </div>
                                                <Switcher
                                                    checked={formData.capabilities?.includes(cap.id as any)}
                                                    onChange={() => { }} // Switcher handles click on label/itself
                                                    className="pointer-events-none"
                                                />
                                            </div>
                                            <p className="font-black text-[10px] text-gray-900 dark:text-gray-100 mb-1 leading-none">{cap.label}</p>
                                            <p className="text-xs text-gray-700 dark:text-gray-300 font-bold leading-relaxed">{cap.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </Tabs.TabContent>

                        {/* ACCESS TAB */}
                        <Tabs.TabContent value="access" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <Card className="w-full p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-visible">
                                <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Shield className="w-4 h-4 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white ">Who Can Access?</h3>
                                </div>
                                <div className="p-8 space-y-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        {[
                                            { value: 'private', label: 'Private Mode', icon: Lock, description: 'Only you and platform admins can access this' },
                                            { value: 'workspace', label: 'Workspace Mode', icon: Users, description: 'Shared with everyone in your current workspace' },
                                            { value: 'public', label: 'Public Mode (Org)', icon: Globe, description: 'Accessible to all users in the organization' },
                                        ].map((option) => (
                                            <div
                                                key={option.value}
                                                className={classNames(
                                                    "p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 group",
                                                    formData.visibility === option.value
                                                        ? 'border-primary bg-primary/[0.02] shadow-sm ring-4 ring-primary/5'
                                                        : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                                                )}
                                                onClick={() => setFormData({ ...formData, visibility: option.value as any })}
                                            >
                                                <div className={classNames(
                                                    "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all shadow-sm",
                                                    formData.visibility === option.value ? 'bg-primary text-white scale-110' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:text-gray-600'
                                                )}>
                                                    <option.icon className="w-6 h-6" />
                                                </div>
                                                <p className="font-black text-xs text-gray-900 dark:text-gray-100 mb-2">
                                                    {option.label}
                                                </p>
                                                <p className="text-xs text-gray-700 dark:text-gray-300 font-bold leading-relaxed">
                                                    {option.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-8 rounded-3xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 flex items-start gap-4">
                                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl mt-1">
                                            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-black text-amber-700 dark:text-amber-400 ">Visibility Warning</p>
                                            <p className="text-[10px] text-amber-600/80 dark:text-amber-500/80 font-bold leading-relaxed">
                                                Changing this will instantly update who can see and talk to this copilot.
                                                Make sure you have permission before making this public.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Tabs.TabContent>

                        {/* OTHER TABS - Consistent placeholders */}
                        {/* KNOWLEDGE TAB */}
                        <Tabs.TabContent value="knowledge" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="space-y-10">
                                <Card className="w-full p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                                    <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Database className="w-4 h-4 text-primary" />
                                        </div>
                                        <h3 className="text-lg font-black text-gray-900 dark:text-white ">Knowledge Base</h3>
                                    </div>
                                    <div className="p-8 space-y-8">
                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-gray-600 dark:text-gray-400 pl-1">
                                                Data Source
                                            </label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                {[
                                                    { id: 'local', name: 'File Upload', description: 'Upload local documents', icon: Upload },
                                                    { id: 'google-drive', name: 'Google Drive', description: 'Sync from cloud', icon: Globe },
                                                    { id: 'database', name: 'Database', description: 'Connect to external data', icon: Database },
                                                    { id: 'api', name: 'Custom API', description: 'Connect via API', icon: Link2 },
                                                ].map((source) => (
                                                    <div
                                                        key={source.id}
                                                        onClick={() => setSelectedDataSource(source.id as any)}
                                                        className={classNames(
                                                            "p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group",
                                                            selectedDataSource === source.id
                                                                ? 'border-primary bg-primary/[0.02] shadow-sm ring-4 ring-primary/5'
                                                                : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                                                        )}
                                                    >
                                                        <div className={classNames(
                                                            "w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors",
                                                            selectedDataSource === source.id ? 'bg-primary text-white ' : 'bg-gray-50 dark:bg-gray-800 text-gray-400'
                                                        )}>
                                                            <source.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                                                        </div>
                                                        <p className="font-black text-xs text-gray-900 dark:text-white mb-1">
                                                            {source.name}
                                                        </p>
                                                        <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed ">
                                                            {source.description}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {selectedDataSource === 'google-drive' && (
                                            <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-[2rem] border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 animate-in slide-in-from-top-2 duration-300">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center p-3">
                                                        <Globe className="w-full h-full text-[#4285F4]" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-3">
                                                            <h4 className="font-black text-xs text-gray-900 dark:text-white">Google Drive</h4>
                                                            {googleDriveConnection ? (
                                                                <Badge className="bg-green-100/50 text-green-600 text-[8px] font-black border border-green-200">Linked</Badge>
                                                            ) : (
                                                                <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-400 text-[8px] font-black ">Offline</Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-700 dark:text-gray-300 font-bold leading-relaxed max-w-xs">Synchornize files directly from your cloud storage</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    {googleDriveConnection ? (
                                                        <>
                                                            <Button
                                                                variant="solid"
                                                                onClick={() => setShowGoogleDriveBrowser(true)}
                                                                className="h-11 px-6 bg-primary hover:bg-primary-deep text-white font-black text-[9px] rounded-xl shadow-lg shadow-primary/20"
                                                            >
                                                                Browse Data
                                                            </Button>
                                                            <Button
                                                                variant="default"
                                                                onClick={handleDisconnectGoogleDrive}
                                                                className="h-11 px-6 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-red-500 hover:bg-red-50 hover:border-red-100 font-black text-[9px] rounded-xl shadow-sm"
                                                            >
                                                                Disconnect
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <Button
                                                            variant="solid"
                                                            onClick={handleConnectGoogleDrive}
                                                            loading={isLoadingGoogleDrive}
                                                            className="h-11 px-8 bg-primary hover:bg-primary-deep text-white font-black text-[9px] rounded-xl shadow-lg shadow-primary/20"
                                                        >
                                                            Link Account
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Card>

                                <Card className="w-full p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                                    <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-primary" />
                                        </div>
                                        <h3 className="text-lg font-black text-gray-900 dark:text-white ">Documents</h3>
                                    </div>

                                    <div className="p-8">
                                        {isLoadingDocuments ? (
                                            <div className="py-20 flex items-center justify-center">
                                                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                            </div>
                                        ) : documents.length > 0 ? (
                                            <div className="space-y-4">
                                                {documents.map((doc) => (
                                                    <div
                                                        key={doc.id}
                                                        className="flex items-center justify-between p-5 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 group transition-all hover:bg-white dark:hover:bg-gray-800"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={classNames(
                                                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm",
                                                                doc.status === 'completed' ? 'bg-green-100/50 text-green-600 border border-green-200' :
                                                                    doc.status === 'failed' ? 'bg-red-100/50 text-red-600 border border-red-200' :
                                                                        'bg-amber-100/50 text-amber-600 border border-amber-200'
                                                            )}>
                                                                <Database className="w-6 h-6" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="font-black text-xs text-gray-900 dark:text-white truncate max-w-[300px]">
                                                                    {doc.title || doc.originalFilename}
                                                                </p>
                                                                <div className="flex items-center gap-3 text-xs font-black text-gray-600 dark:text-gray-400">
                                                                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">{doc.fileSize ? `${(doc.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Size Unknown'}</span>
                                                                    <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                                                                    <span className={classNames(
                                                                        "flex items-center gap-1",
                                                                        doc.status === 'completed' ? 'text-green-500' :
                                                                            doc.status === 'failed' ? 'text-red-500' :
                                                                                'text-amber-500 animate-pulse'
                                                                    )}>
                                                                        <div className={classNames(
                                                                            "w-1 h-1 rounded-full",
                                                                            doc.status === 'completed' ? 'bg-green-500' :
                                                                                doc.status === 'failed' ? 'bg-red-500' :
                                                                                    'bg-amber-500'
                                                                        )} />
                                                                        {DOCUMENT_STATUS_LABELS[doc.status] || doc.status}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteDocument(doc.id)}
                                                            className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100 shadow-sm border border-transparent hover:border-red-100"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
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
                                                    <p className="text-xs text-gray-700 dark:text-gray-300 font-bold ">Upload files to begin knowledge acquisition</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Card>

                                {selectedDataSource === 'local' && (
                                    <Card className="w-full p-0 border-none shadow-xl shadow-gray-200/20 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 font-bold animate-in slide-in-from-top-2 duration-300">
                                        <div className="p-6 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Upload className="w-3.5 h-3.5 text-primary" />
                                            </div>
                                            <h3 className="font-black text-gray-900 dark:text-white text-sm">Upload Nodes</h3>
                                        </div>

                                        <div className="p-6 space-y-6">
                                            <div
                                                className={classNames(
                                                    "relative border-2 border-dashed rounded-[2rem] p-10 transition-all duration-300 flex flex-col items-center justify-center gap-6 text-center group",
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
                                                    <p className="text-xs font-black text-gray-900 dark:text-white">Click or Drag to Upload</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 font-black ">Nodes: PDF, TXT (Max 10MB)</p>
                                                </div>
                                            </div>

                                            {uploadedFiles.length > 0 && (
                                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                    <p className="text-[10px] font-black text-gray-400 pl-1">Ready for Sync</p>
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
                                                        className="w-full h-14 bg-primary hover:bg-primary-deep text-white font-black text-[10px] rounded-2xl shadow-2xl shadow-primary/20 mt-4"
                                                    >
                                                        Initialize Upload
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                )}
                            </div>
                        </Tabs.TabContent>

                        {/* DANGER ZONE TAB */}
                        <Tabs.TabContent value="danger" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <Card className="w-full p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden">
                                <div className="p-8 border-b border-red-50 dark:border-red-900/10 bg-red-50/30 dark:bg-red-900/5 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                    </div>
                                    <h3 className="text-lg font-black text-red-600 dark:text-red-400 ">Danger Zone</h3>
                                </div>
                                <div className="p-8 space-y-10">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-[2rem] bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-black text-gray-900 dark:text-white ">Delete This Copilot</h4>
                                            <p className="text-xs text-gray-700 dark:text-gray-300 font-bold leading-relaxed max-w-sm">
                                                Completely erase this copilot and all its data from the system registry.
                                            </p>
                                        </div>
                                        <Button
                                            variant="solid"
                                            onClick={() => setShowDeleteDialog(true)}
                                            className="h-12 px-8 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] rounded-xl shadow-xl shadow-red-500/20 whitespace-nowrap"
                                        >
                                            Delete Permanently
                                        </Button>
                                    </div>

                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-[2rem] bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 opacity-50">
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-black text-gray-900 dark:text-white ">Transfer Ownership</h4>
                                            <p className="text-[10px] text-gray-500 font-bold leading-relaxed max-w-sm">
                                                Give control of this copilot to someone else.
                                            </p>
                                        </div>
                                        <Button disabled variant="plain" className="h-12 px-8 text-[10px] font-black ">
                                            Locked
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </Tabs.TabContent>
                    </div>
                </Tabs>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                width={500}
            >
                <div className="p-2">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center border border-red-100 dark:border-red-800">
                            <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white ">Delete Copilot</h2>
                            <p className="text-[10px] text-gray-400 font-black ">Confirm Deletion</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Are you sure you want to delete <span className="font-black text-gray-900 dark:text-white ">"{copilot?.name}"</span>?
                            This will permanently delete all files, chat history, and core settings.
                        </p>

                        <div className="flex justify-end gap-3 pt-6">
                            <button
                                onClick={() => setShowDeleteDialog(false)}
                                className="h-12 px-6 font-black text-[10px] text-gray-400 hover:text-gray-900 transition-colors"
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

            {/* Google Drive File Browser Modal */}
            <Dialog
                isOpen={showGoogleDriveBrowser}
                onClose={() => setShowGoogleDriveBrowser(false)}
                width={800}
            >
                <div className="p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                            <Globe className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white ">Google Drive</h2>
                            <p className="text-[10px] text-gray-400 font-black ">Select files to import</p>
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

            {/* Preview Drawer */}
            {copilot && (
                <CopilotPreviewDrawer
                    isOpen={isPreviewDrawerOpen}
                    onClose={() => setIsPreviewDrawerOpen(false)}
                    copilot={copilot}
                />
            )}
        </div >
    )
}
