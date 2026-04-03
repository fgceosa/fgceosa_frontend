'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Drawer, Button, Input, Select, Switcher, Tooltip } from '@/components/ui'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import {
    Play,
    Settings,
    Cpu,
    Globe,
    Users,
    X,
    Zap,
    Code,
    Search,
    PenTool,
    BarChart3,
    Headphones,
    Briefcase,
    Megaphone,
    Scale,
    Sparkles,
    ArrowLeft,
    Upload,
    FileText,
    Database,
    HardDrive,
    Cloud,
    Shield,
    UserCheck,
    Calendar,
    Star,
    ChevronLeft,
    Monitor,
    ShieldCheck,
    Bot,
    Share2,
    Layers,
} from 'lucide-react'
import classNames from 'classnames'
import type { Copilot } from '../types'
import { COPILOT_MODELS } from '../types'

interface CopilotDetailsDrawerProps {
    isOpen: boolean
    copilot: Copilot | null
    onClose: () => void
    onStartChat: (copilot: Copilot) => void
    onEditCopilot?: (copilot: Copilot) => void
    onShare?: (copilot: Copilot) => void
}

type DrawerView = 'details' | 'configure'

// Integration options
const INTEGRATION_OPTIONS = [
    { id: 'google-drive', name: 'Google Drive', icon: Cloud, connected: false },
    { id: 'dropbox', name: 'Dropbox', icon: HardDrive, connected: false },
    { id: 'postgresql', name: 'PostgreSQL', icon: Database, connected: false },
    { id: 'mongodb', name: 'MongoDB', icon: Database, connected: false },
    { id: 'rest-api', name: 'REST API', icon: Globe, connected: true },
    { id: 'graphql', name: 'GraphQL', icon: Globe, connected: false },
]

// Role options
const ROLE_OPTIONS = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'member', label: 'Member' },
    { value: 'viewer', label: 'Viewer' },
]

// Capability labels
const CAPABILITY_LABELS: Record<string, string> = {
    'web-search': 'Web Search',
    'code-execution': 'Code Execution',
    'file-upload': 'File Upload',
    'image-generation': 'Image Generation',
    'voice-input': 'Voice Input',
    'api-integration': 'API Integration',
    'memory': 'Memory',
    'function-calling': 'Function Calling',
}

export default function CopilotDetailsDrawer({
    isOpen,
    copilot,
    onClose,
    onStartChat,
    onShare,
}: CopilotDetailsDrawerProps) {
    const router = useRouter()
    const { session } = useCurrentSession()

    // UI State
    const [currentView, setCurrentView] = useState<DrawerView>('details')
    const [selectedModel, setSelectedModel] = useState(copilot?.model || 'gpt-4o')
    const [customInstructions, setCustomInstructions] = useState(copilot?.systemPrompt || '')
    const [enabledIntegrations, setEnabledIntegrations] = useState<string[]>(['rest-api'])
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [workspaceAccess, setWorkspaceAccess] = useState(true)
    const [selectedRoles, setSelectedRoles] = useState<string[]>(['admin', 'manager'])

    // Extract user info
    const userId = (session?.user as any)?.id
    const userRole = (session?.user as any)?.role
    const userAuthority = (session?.user as any)?.authority || []
    const isSuperadmin = userAuthority.includes('platform_super_admin') || userRole === 'platform_super_admin'
    const isOrgMember = userRole === 'org_member' || userAuthority.includes('org_member')

    if (!copilot) return null

    const isOwner = copilot.createdBy === userId
    const isInactive = copilot.status === 'inactive'
    const isDisabled = copilot.status === 'disabled'
    const isDraft = copilot.status === 'draft'

    // Disable chat logic:
    // - Disabled status: Only superadmin can use (for preview)
    // - Inactive status: Only owner or superadmin can use
    // - Draft status: Only owner or superadmin can use
    const chatDisabled = isDisabled
        ? !isSuperadmin
        : (isInactive || isDraft)
            ? !(isOwner || isSuperadmin)
            : false

    const chatTooltip = isDisabled
        ? "This copilot has been disabled by HQ."
        : isInactive
            ? "This copilot is currently paused by the organization admin."
            : isDraft
                ? "This copilot is currently a draft and only accessible to the owner."
                : ""

    const handleClose = () => {
        setCurrentView('details')
        onClose()
    }

    const handleConfigureCopilot = () => {
        router.push(`/dashboard/copilot-hub/${copilot.id}/settings`)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    const formatUsageCount = (count: number) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`
        }
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`
        }
        return count.toString()
    }

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            coding: 'bg-blue-100 text-blue-700',
            writing: 'bg-purple-100 text-purple-700',
            research: 'bg-green-100 text-green-700',
            'data-analysis': 'bg-orange-100 text-orange-700',
            'customer-support': 'bg-pink-100 text-pink-700',
            sales: 'bg-indigo-100 text-indigo-700',
            marketing: 'bg-rose-100 text-rose-700',
            legal: 'bg-slate-100 text-slate-700',
            hr: 'bg-teal-100 text-teal-700',
            general: 'bg-gray-100 text-gray-700',
        }
        return colors[category] || colors.general
    }

    const getCategoryLabel = (category: string) => {
        return category.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
    }

    const getCategoryIcon = (category: string) => {
        const icons: Record<string, React.ReactNode> = {
            coding: <Code className="w-6 h-6" />,
            writing: <PenTool className="w-6 h-6" />,
            research: <Search className="w-6 h-6" />,
            'data-analysis': <BarChart3 className="w-6 h-6" />,
            'customer-support': <Headphones className="w-6 h-6" />,
            sales: <Briefcase className="w-6 h-6" />,
            marketing: <Megaphone className="w-6 h-6" />,
            legal: <Scale className="w-6 h-6" />,
            hr: <Users className="w-6 h-6" />,
            general: <Sparkles className="w-6 h-6" />,
        }
        return icons[category] || icons.general
    }

    const getIconBgColor = (category: string) => {
        const colors: Record<string, string> = {
            coding: 'bg-blue-100 text-blue-600',
            writing: 'bg-purple-100 text-purple-600',
            research: 'bg-green-100 text-green-600',
            'data-analysis': 'bg-orange-100 text-orange-600',
            'customer-support': 'bg-pink-100 text-pink-600',
            sales: 'bg-indigo-100 text-indigo-600',
            marketing: 'bg-rose-100 text-rose-600',
            legal: 'bg-slate-100 text-slate-600',
            hr: 'bg-teal-100 text-teal-600',
            general: 'bg-gray-100 text-gray-600',
        }
        return colors[category] || colors.general
    }

    const toggleIntegration = (id: string) => {
        setEnabledIntegrations(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const toggleRole = (role: string) => {
        setSelectedRoles(prev =>
            prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
        )
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            setUploadedFiles(prev => [...prev, ...Array.from(files)])
        }
    }

    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    }

    const modelOptions = COPILOT_MODELS.map(m => ({
        value: m.value,
        label: m.label,
        company: (m as any).company,
        description: (m as any).description,
        color: (m as any).color
    }))

    const renderDetailsView = () => (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Premium Header */}
            <div className="relative pt-8 sm:pt-12 pb-6 sm:pb-8 px-4 sm:px-8 overflow-hidden">
                {/* Visual Elements */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#0055BA]/5 rounded-full blur-3xl" />
                <div className="absolute top-0 left-0 -ml-16 -mt-16 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col items-center text-center">
                    {onShare && (
                        <div className="absolute -top-2 sm:-top-4 -right-1 sm:-right-2">
                            <button
                                onClick={() => onShare(copilot)}
                                className="p-2 sm:p-2.5 rounded-xl text-gray-400 hover:text-[#0055BA] dark:hover:text-[#0055BA] hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-800"
                                title="Share copilot"
                            >
                                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    )}

                    <div className={classNames(
                        "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[2rem] flex items-center justify-center shadow-xl mb-4 sm:mb-6 ring-4 sm:ring-8 ring-white dark:ring-gray-900 transform transition-transform duration-500 group-hover:scale-110",
                        getIconBgColor(copilot.category)
                    )}>
                        <div className="bg-white/20 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-white/30 backdrop-blur-sm">
                            {getCategoryIcon(copilot.category)}
                        </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3 px-2 sm:px-4">
                        <div className="flex flex-col items-center gap-2">
                            {((copilot as any).isFeatured || (copilot as any).isOfficial || (copilot as any).is_official) && (
                                <span className="bg-amber-100 text-amber-700 border-amber-200 px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] font-bold rounded-md flex items-center gap-1.5 shadow-sm transform -translate-y-1">
                                    <Star className="w-3 h-3 fill-current" />
                                    Official Agent
                                </span>
                            )}
                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-none">
                                {copilot.name}
                            </h2>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <span className={classNames(
                                "px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] font-bold rounded-lg border",
                                getCategoryColor(copilot.category)
                            )}>
                                {getCategoryLabel(copilot.category)}
                            </span>
                        </div>
                    </div>

                    <p className="mt-4 sm:mt-6 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm px-2">
                        {copilot.description}
                    </p>
                </div>
            </div >

            {/* Content Scroll Area */}
            < div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 space-y-6" >
                {/* Performance Stats Overlay */}
                < div className="grid grid-cols-2 gap-3 sm:gap-4" >
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100 dark:border-gray-800/50 group transition-all hover:border-[#0055BA]/20">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </div>
                            <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 dark:text-gray-500">Global usage</span>
                        </div>
                        <p className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                            {formatUsageCount(copilot.usageCount)}
                            <span className="text-[9px] sm:text-[10px] ml-1 sm:ml-1.5 text-gray-400 font-bold">uses</span>
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100 dark:border-gray-800/50 group transition-all hover:border-[#0055BA]/20">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </div>
                            <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 dark:text-gray-500">Efficiency</span>
                        </div>
                        <p className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                            98.2<span className="text-[9px] sm:text-[10px] ml-0.5 text-gray-400">%</span>
                        </p>
                    </div>
                </div >

                {/* Capabilities Card */}
                {
                    copilot.capabilities && copilot.capabilities.length > 0 && (
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#0055BA]" />
                                <h3 className="text-[11px] sm:text-[12px] font-bold text-gray-900 dark:text-white">Capabilities</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {copilot.capabilities.map((cap) => (
                                    <div
                                        key={cap}
                                        className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-1.5 sm:gap-2 hover:border-[#0055BA]/30 transition-colors cursor-default"
                                    >
                                        <Sparkles className="w-3 h-3 text-[#0055BA]" />
                                        {CAPABILITY_LABELS[cap] || cap}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }

                {/* Agent Identity Details */}
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        <h3 className="text-[11px] sm:text-[12px] font-bold text-gray-900 dark:text-white">Agent details</h3>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-800/50 overflow-hidden">
                        <div className="divide-y divide-gray-100 dark:divide-gray-800/50 font-bold">
                            <div className="flex items-center justify-between p-3 sm:p-4 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200/50">
                                        <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                                    </div>
                                    <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 dark:text-gray-400">Created by</span>
                                </div>
                                <span className="text-[11px] sm:text-[12px] font-bold text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-none">
                                    {copilot.createdByName || copilot.created_by_name || 'Qorebit Team'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 sm:p-4 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200/50">
                                        <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                                    </div>
                                    <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 dark:text-gray-400">Status</span>
                                </div>
                                <span className={classNames(
                                    "text-[11px] sm:text-[12px] font-bold flex items-center gap-1.5",
                                    copilot.status === 'active' ? 'text-emerald-500' :
                                        copilot.status === 'inactive' ? 'text-amber-500' :
                                            copilot.status === 'draft' ? 'text-blue-500' : 'text-red-500'
                                )}>
                                    <div className={classNames(
                                        "w-1.5 h-1.5 rounded-full",
                                        copilot.status === 'active' ? 'bg-emerald-500 animate-pulse' :
                                            copilot.status === 'inactive' ? 'bg-amber-500' :
                                                copilot.status === 'draft' ? 'bg-blue-500' : 'bg-red-500'
                                    )} />
                                    {copilot.status === 'inactive' ? 'Paused' : copilot.status}
                                </span>
                            </div>
                            {copilot.domain && (
                                <div className="flex items-center justify-between p-3 sm:p-4 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center border border-indigo-100/50">
                                            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />
                                        </div>
                                        <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 dark:text-gray-400">Assigned domain</span>
                                    </div>
                                    <span className="text-[11px] sm:text-[12px] font-black text-indigo-600 dark:text-indigo-400 truncate max-w-[150px] sm:max-w-none">
                                        {copilot.domain}
                                    </span>
                                </div>
                            )}
                            {userRole !== 'user' && (
                                <div className="flex items-center justify-between p-3 sm:p-4 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200/50">
                                            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                                        </div>
                                        <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 dark:text-gray-400">Workspace access</span>
                                    </div>
                                    <span className="text-[11px] sm:text-[12px] font-bold text-gray-900 dark:text-white truncate max-w-[120px] sm:max-w-none">
                                        {copilot.assignedWorkspacesIds && copilot.assignedWorkspacesIds.length > 0
                                            ? `${copilot.assignedWorkspacesIds.length} Workspaces`
                                            : copilot.visibility === 'public' ? 'Public' : 'Organization-wide'
                                        }
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center justify-between p-3 sm:p-4 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200/50">
                                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                                    </div>
                                    <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 dark:text-gray-400">Deployed on</span>
                                </div>
                                <span className="text-[11px] sm:text-[12px] font-bold text-gray-900 dark:text-white truncate max-w-[140px] sm:max-w-none">
                                    {formatDate(copilot.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            {/* Premium Sticky Footer */}
            <div className="px-4 py-4 sm:px-8 sm:py-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 relative z-20">
                <div className={classNames(
                    "flex flex-col sm:flex-row items-center gap-3 sm:gap-4",
                    isOrgMember && "sm:justify-center"
                )}>
                    <Tooltip
                        title={chatDisabled ? chatTooltip : ""}
                        placement="top"
                        disabled={!chatDisabled}
                    >
                        <Button
                            variant="solid"
                            disabled={chatDisabled}
                            className={classNames(
                                "w-full sm:flex-[2] h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-[#0055BA] hover:bg-[#0055BA]/90 text-white font-bold text-[13px] sm:text-[14px] shadow-xl shadow-[#0055BA]/20 flex items-center justify-center gap-2 sm:gap-3 border-none transition-all hover:-translate-y-1 active:scale-95 group",
                                chatDisabled && "opacity-50 grayscale cursor-not-allowed",
                                isOrgMember && "sm:flex-none sm:w-full sm:max-w-[340px] px-12"
                            )}
                            onClick={() => !chatDisabled && onStartChat(copilot)}
                        >
                            <Play className="w-4 h-4 fill-current group-hover:rotate-12 transition-transform" />
                            <span>Start chat</span>
                        </Button>
                    </Tooltip>
                    {(() => {
                        const isOrgAdmin = userAuthority.includes('org_admin') || userRole === 'org_admin'
                        const isOrgSuperAdmin = userAuthority.includes('org_super_admin') || userRole === 'org_super_admin'
                        const canManage = isSuperadmin || isOrgAdmin || isOrgSuperAdmin

                        // Only show settings button to admins, not org_members (unless they are the owner)
                        if (!canManage && !isOwner) return null

                        return (
                            <Button
                                variant="default"
                                className="w-full sm:flex-1 h-12 sm:h-14 rounded-xl sm:rounded-2xl border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold text-[13px] sm:text-[14px] flex items-center justify-center gap-2 transition-all hover:border-[#0055BA]/30"
                                onClick={handleConfigureCopilot}
                            >
                                <Settings className="w-4 h-4 opacity-50" />
                                <span>Settings</span>
                            </Button>
                        )
                    })()}
                </div>
            </div>
        </div >
    )

    const renderConfigureView = () => (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="relative pt-12 pb-6 px-8 border-b border-gray-100 dark:border-gray-800">
                <button
                    onClick={() => setCurrentView('details')}
                    className="flex items-center gap-2 text-[12px] font-bold text-gray-400 hover:text-[#0055BA] transition-colors group mb-6"
                >
                    <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Back to details
                </button>

                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#0055BA]/10 flex items-center justify-center ring-4 ring-[#0055BA]/5">
                        <Settings className="w-6 h-6 text-[#0055BA]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white">Configure settings</h2>
                        <p className="text-[11px] font-bold text-gray-400">Manage agent behavior and access</p>
                    </div>
                </div>
            </div>

            {/* Settings Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10">
                {/* AI Neural Model */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-[#0055BA]" />
                        <h3 className="text-[12px] font-bold text-gray-900 dark:text-white">AI model</h3>
                    </div>
                    <div className="relative">
                        <Select
                            options={modelOptions}
                            value={modelOptions.find(o => o.value === selectedModel)}
                            onChange={(option) => setSelectedModel(option?.value || 'gpt-4o')}
                            className="w-full"
                        />
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800/50">
                        <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                            Currently utilizing <span className="font-bold text-[#0055BA]">{modelOptions.find(o => o.value === selectedModel)?.label}</span>. Optimized for high-reasoning tasks and complex command execution.
                        </p>
                    </div>
                </div>

                {/* Behavioral Mapping */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <h3 className="text-[12px] font-bold text-gray-900 dark:text-white">Instructions</h3>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-[#0055BA]/5 rounded-2xl scale-105 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                        <Input
                            textArea
                            rows={6}
                            value={customInstructions}
                            onChange={(e) => setCustomInstructions(e.target.value)}
                            placeholder="Define the agent's core operational logic and persona constraints..."
                            className="w-full relative z-10 !rounded-2xl !bg-white dark:!bg-gray-800/50 !border-gray-200 dark:!border-gray-800 !py-4"
                        />
                    </div>
                </div>

                {/* Data Grid Integrations */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <h3 className="text-[12px] font-bold text-gray-900 dark:text-white">Integrations</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {INTEGRATION_OPTIONS.map((integration) => (
                            <button
                                key={integration.id}
                                onClick={() => toggleIntegration(integration.id)}
                                className={classNames(
                                    "flex flex-col items-center gap-3 p-4 rounded-[1.5rem] border transition-all duration-300 transform active:scale-95 group relative overflow-hidden",
                                    enabledIntegrations.includes(integration.id)
                                        ? 'border-[#0055BA] bg-[#0055BA]/5 shadow-inner'
                                        : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-[#0055BA]/20 hover:bg-gray-50 dark:hover:bg-gray-800'
                                )}
                            >
                                {enabledIntegrations.includes(integration.id) && (
                                    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#0055BA]" />
                                )}
                                <div className={classNames(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                                    enabledIntegrations.includes(integration.id)
                                        ? 'bg-[#0055BA] text-white shadow-lg shadow-[#0055BA]/20'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                                )}>
                                    <integration.icon className="w-5 h-5" />
                                </div>
                                <span className={classNames(
                                    "text-[11px] font-bold",
                                    enabledIntegrations.includes(integration.id)
                                        ? 'text-[#0055BA]'
                                        : 'text-gray-500 dark:text-gray-400'
                                )}>
                                    {integration.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Secure Access Control */}
                {userRole !== 'user' && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-500" />
                            <h3 className="text-[12px] font-bold text-gray-900 dark:text-white">Permissions</h3>
                        </div>
                        <div
                            className={classNames(
                                "flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer",
                                workspaceAccess
                                    ? 'border-[#0055BA] bg-[#0055BA]/5 shadow-inner'
                                    : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900'
                            )}
                            onClick={() => setWorkspaceAccess(!workspaceAccess)}
                        >
                            <div className="space-y-1">
                                <p className="text-[12px] font-bold text-gray-900 dark:text-white">Workspace-wide access</p>
                                <p className="text-[11px] text-gray-400 font-medium">Allow everyone in your workspace to use this copilot</p>
                            </div>
                            <Switcher
                                checked={workspaceAccess}
                                onChange={() => setWorkspaceAccess(!workspaceAccess)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                            {ROLE_OPTIONS.map((role) => (
                                <button
                                    key={role.value}
                                    onClick={() => toggleRole(role.value)}
                                    className={classNames(
                                        "px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all",
                                        selectedRoles.includes(role.value)
                                            ? 'bg-[#0055BA] text-white shadow-lg shadow-[#0055BA]/20'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-transparent'
                                    )}
                                >
                                    {role.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4">
                    <Button
                        variant="solid"
                        className="flex-1 h-14 rounded-2xl bg-[#0055BA] hover:bg-[#0055BA]/90 text-white font-bold text-[14px] shadow-xl shadow-[#0055BA]/20 flex items-center justify-center gap-2"
                        onClick={() => {
                            // Save logic would go here
                            setCurrentView('details')
                        }}
                    >
                        <span>Save changes</span>
                    </Button>
                    <Button
                        variant="default"
                        className="flex-1 h-14 rounded-2xl border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold text-[14px]"
                        onClick={() => setCurrentView('details')}
                    >
                        <span>Cancel</span>
                    </Button>
                </div>
            </div>
        </div>
    )

    return (
        <Drawer
            isOpen={isOpen}
            onClose={handleClose}
            onRequestClose={handleClose}
            shouldCloseOnOverlayClick={true}
            closeTimeoutMS={400}
            width={typeof window !== 'undefined' && window.innerWidth < 640 ? window.innerWidth : 480}
            placement="right"
        >
            <div className="flex flex-col h-full relative">
                <div className="flex flex-col h-full bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
                    {currentView === 'details' ? renderDetailsView() : renderConfigureView()}
                </div>
            </div>
        </Drawer>
    )
}
