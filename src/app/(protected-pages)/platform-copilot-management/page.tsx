'use client'

import React, { useEffect, useState, useMemo } from 'react'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import {
    Bot,
    Search,
    Plus,
    MoreVertical,
    ExternalLink,
    MessageSquare,
    Shield,
    Building2,
    Activity,
    Cpu,
    FileText,
    Zap,
    Trash2,
    LayoutGrid,
    CheckCircle,
    PauseCircle,
    XCircle,
    Settings,
    Eye
} from 'lucide-react'
import classNames from '@/utils/classNames'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import CreateCopilotModal from '@/app/(protected-pages)/dashboard/copilot-hub/_components/CreateCopilotModal'
import { COPILOT_MODELS, CopilotStatus, Copilot } from '@/app/(protected-pages)/dashboard/copilot-hub/types'
import CopilotPreviewDrawer from './_components/CopilotPreviewDrawer'
import {
    Button,
    Input,
    Card,
    Spinner,
    Notification,
    toast,
    Dialog,
    Pagination,
    Select
} from '@/components/ui'
import { apiAdminListCopilots, apiDeleteCopilot } from '@/services/CopilotService'
import {
    selectCopilotList,
    selectCopilotLoading,
    selectCopilotTotal,
    selectCopilotFilter,
} from '@/store/slices/platformCopilotManagement/platformCopilotSelectors'
import {
    compAdminGetCopilots,
    setFilter,
} from '@/store/slices/platformCopilotManagement'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { apiAdminCountAllWorkspaces } from '@/services/workspace/workspaceService'
import QorebitLoading from '@/components/shared/QorebitLoading'

dayjs.extend(relativeTime)

function AccessBadge({ access }: { access: string }) {
    const accessLower = access?.toLowerCase() || 'private'
    const isPublic = accessLower === 'public'
    const isWorkspace = accessLower === 'workspace'

    return (
        <div className={classNames(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border transition-all duration-300",
            isPublic
                ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30 shadow-md shadow-blue-500/10"
                : isWorkspace
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30 shadow-md shadow-emerald-500/10"
                    : "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30 shadow-md shadow-amber-500/10"
        )}>
            <div className={classNames(
                "w-1.5 h-1.5 rounded-full animate-pulse",
                isPublic ? "bg-blue-600" : isWorkspace ? "bg-emerald-600" : "bg-amber-600"
            )} />
            <span>{access}</span>
        </div>
    )
}

function StatusBadge({ status }: { status: CopilotStatus | string }) {
    return (
        <div className={classNames(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border transition-all duration-300",
            status === 'active' ? "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30 shadow-sm" :
                status === 'draft' ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30" :
                    status === 'inactive' ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30" :
                        status === 'disabled' ? "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30" :
                            "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
        )}>
            {status === 'active' && <CheckCircle className="w-3 h-3" />}
            {status === 'draft' && <FileText className="w-3 h-3" />}
            {status === 'inactive' && <PauseCircle className="w-3 h-3" />}
            {status === 'disabled' && <XCircle className="w-3 h-3" />}
            <span>{status === 'inactive' ? 'Paused' : status}</span>
        </div>
    )
}

function WorkspaceBadge({ workspaceId }: { workspaceId?: string | null }) {
    const isGlobal = !workspaceId || workspaceId === 'GLOBAL'

    return (
        <div className={classNames(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black border transition-all duration-300",
            isGlobal
                ? "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800/30"
                : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700/30"
        )}>
            <Building2 className="w-3 h-3 opacity-70" />
            <span className="truncate max-w-[150px]">{isGlobal ? 'Global Registry' : workspaceId}</span>
        </div>
    )
}

function getModelInfo(modelKey: string) {
    const found = COPILOT_MODELS.find(m => m.value === modelKey)
    if (found) return { name: found.label, provider: found.company, color: found.color }
    // Fallback parsing
    const parts = modelKey.split('/')
    if (parts.length > 1) {
        return { name: parts[1], provider: parts[0], color: '#888' }
    }
    return { name: modelKey, provider: 'Unknown', color: '#888' }
}

export default function PlatformCopilotPage() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const copilotList = useAppSelector(selectCopilotList)
    const loading = useAppSelector(selectCopilotLoading)
    const total = useAppSelector(selectCopilotTotal)
    const filter = useAppSelector(selectCopilotFilter)
    const { session } = useCurrentSession()
    const userRole = (session?.user as any)?.role
    const userAuthority = (session?.user as any)?.authority || []
    const isSuperadmin = userAuthority.includes('platform_super_admin') || userRole === 'platform_super_admin'

    const [searchQuery, setSearchQuery] = useState('')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [copilotToDelete, setCopilotToDelete] = useState<{ id: string; name: string } | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [totalWorkspaces, setTotalWorkspaces] = useState(0)
    const [activeCopilotsCount, setActiveCopilotsCount] = useState(0)
    const [inactiveCopilotsCount, setInactiveCopilotsCount] = useState(0)
    const [disabledCopilotsCount, setDisabledCopilotsCount] = useState(0)
    const [draftCopilotsCount, setDraftCopilotsCount] = useState(0)
    const [previewCopilot, setPreviewCopilot] = useState<Copilot | null>(null)
    const [isPreviewDrawerOpen, setIsPreviewDrawerOpen] = useState(false)

    useEffect(() => {
        dispatch(compAdminGetCopilots(filter))

        // Fetch total workspace count only once
        if (totalWorkspaces === 0) {
            apiAdminCountAllWorkspaces().then(res => {
                setTotalWorkspaces(res.total)
            }).catch(err => {
                console.error('Failed to fetch total workspaces', err)
            })
        }

        // Fetch counts only once
        if (activeCopilotsCount === 0 && inactiveCopilotsCount === 0 && disabledCopilotsCount === 0) {
            apiAdminListCopilots({ status: 'active', limit: 1 }).then(res => {
                setActiveCopilotsCount(res.total)
            })
            apiAdminListCopilots({ status: 'inactive', limit: 1 }).then(res => {
                setInactiveCopilotsCount(res.total)
            })
            apiAdminListCopilots({ status: 'disabled', limit: 1 }).then(res => {
                setDisabledCopilotsCount(res.total)
            })
            apiAdminListCopilots({ status: 'draft', limit: 1 }).then(res => {
                setDraftCopilotsCount(res.total)
            })
        }
    }, [dispatch, filter])

    const handlePaginationChange = (page: number) => {
        dispatch(setFilter({ skip: (page - 1) * (filter.limit || 10) }))
    }

    const handlePageSizeChange = (size: number) => {
        dispatch(setFilter({ limit: size, skip: 0 }))
    }

    // Debounced search sync
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery !== filter.search) {
                dispatch(setFilter({ search: searchQuery, skip: 0 }))
            }
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [searchQuery, filter.search, dispatch])

    const handleDelete = (copilot: any) => {
        const isOfficial = copilot.isOfficial === true ||
            copilot.is_official === true ||
            copilot.isFeatured === true ||
            copilot.is_featured === true ||
            copilot.isOfficial === 'true' ||
            copilot.is_official === 'true'

        if (isOfficial && !isSuperadmin) {
            toast.push(
                <Notification type="warning" title="System Protected" duration={7000}>
                    This is a platform-certified prebuilt template and cannot be deleted.
                </Notification>
            )
            return
        }

        setCopilotToDelete({ id: copilot.id, name: copilot.name })
        setIsDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        if (!copilotToDelete) return

        setIsDeleting(true)
        try {
            await apiDeleteCopilot(copilotToDelete.id)
            toast.push(
                <Notification type="success" title="Deleted" duration={3000}>
                    Copilot deleted successfully
                </Notification>
            )
            dispatch(compAdminGetCopilots({ limit: 100 }))
            setIsDeleteModalOpen(false)
        } catch (error: any) {
            console.error('Failed to delete copilot', error)
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
        }
    }

    const totalMessages = copilotList.reduce((acc, curr) => acc + (curr.usageCount || 0), 0)

    // Helper to format large numbers
    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
        return num.toString()
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5] dark:bg-gray-950/50 -m-4 sm:-m-8 p-4 sm:p-8">
            <div className="max-w-full mx-auto space-y-10 animate-in fade-in duration-700">
                {/* Enterprise Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-2">
                    <div className="space-y-4 lg:space-y-1">
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-xs font-black text-primary whitespace-nowrap">Global System</span>
                            <div className="h-px w-12 bg-primary/20" />
                            <span className="text-xs font-black text-gray-900 dark:text-gray-100 whitespace-nowrap">Copilot Management</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shrink-0">
                                <Bot className="h-6 w-6 text-primary" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-none">
                                Platform Copilots
                            </h1>
                        </div>
                        <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 lg:pl-14 font-medium max-w-2xl leading-relaxed">
                            Manage all AI copilots across the system. Monitor health, performance, and global distribution.
                        </p>
                    </div>

                </div>


                {/* Background Decoration */}
                <div className="relative">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
                    <div className="absolute top-40 -right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl opacity-50 pointer-events-none" />

                    <div className="relative z-10 space-y-10">
                        {/* KPI Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Copilots', value: total, icon: Bot, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-100/50 dark:border-blue-800/20', status: 'all' },
                                { label: 'Active Copilots', value: activeCopilotsCount, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', borderColor: 'border-emerald-100/50 dark:border-emerald-800/20', status: 'active' },
                                { label: 'Draft Mode', value: draftCopilotsCount, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-100/50 dark:border-blue-800/20', status: 'draft' },
                                { label: 'Total Requests (Monthly)', value: formatNumber(totalMessages), icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', borderColor: 'border-purple-100/50 dark:border-purple-800/20', status: 'usage' },
                            ].map((stat) => (
                                <div key={stat.label} className="group relative">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-[2rem] opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                                    <div className="relative flex flex-col p-6 bg-white dark:bg-gray-900 rounded-[1.8rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none overflow-hidden h-full">
                                        <div className="flex items-start justify-between mb-6 relative z-10">
                                            <div className={classNames(
                                                "p-3 rounded-2xl border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                                                stat.bg, stat.color, stat.borderColor
                                            )}>
                                                <stat.icon className="w-6 h-6" />
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-0.5 relative z-10">
                                                <div className={classNames(
                                                    "w-1.5 h-1.5 rounded-full animate-pulse",
                                                    stat.status === 'active' ? "bg-emerald-500" :
                                                        stat.status === 'paused' ? "bg-amber-500" :
                                                            stat.status === 'draft' ? "bg-blue-500" : "bg-gray-500"
                                                )} />
                                                <span className="text-xs font-black text-gray-600 dark:text-gray-400">
                                                    {stat.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-1 relative z-10">
                                            <span className="text-xs font-black text-gray-600 dark:text-gray-400">{stat.label}</span>
                                            <h3 className="text-2xl font-black text-gray-900 dark:text-white ">
                                                {stat.value}
                                            </h3>
                                            <p className="text-xs font-bold text-gray-400 italic">Overview</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Search Bar Container - Matching Projects Page Style */}
                        <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-6 relative group overflow-hidden">
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-4">
                                <div className="relative w-full flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="Search by copilot name, model or description..."
                                        className="pl-11 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-primary/20 focus:border-primary text-sm shadow-inner transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-750"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="px-4 py-2 bg-primary/5 rounded-xl border border-primary/10">
                                        <span className="text-xs font-black text-primary">
                                            {copilotList.length} Results
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mb-10 relative z-20 pr-4">
                            {copilotList.length > 0 && (
                                <Button
                                    variant="solid"
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="h-12 sm:h-14 px-8 bg-primary hover:bg-primary-deep text-white font-black text-[10px] sm:text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group w-full sm:w-auto"
                                >
                                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                    <span>Create Global Copilot</span>
                                </Button>
                            )}
                        </div>

                        {/* Main Registry Table */}
                        <Card className="p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 transition-all">
                            <div className="p-6 md:p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white ">Copilot List</h3>
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mt-1">Manage all registered agents</p>
                                </div>
                                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-primary" />
                                </div>
                            </div>

                            <div className="p-6 md:p-8">
                                {loading ? (
                                    <QorebitLoading />
                                ) : copilotList.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
                                        <div className="w-20 h-20 bg-primary/5 rounded-[30px] flex items-center justify-center mb-6 border border-primary/10 relative">
                                            <Zap className="w-10 h-10 text-primary opacity-20" />
                                            <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full opacity-20 animate-pulse" />
                                        </div>
                                        <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2 ">No Copilots Found</h4>
                                        <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm text-sm leading-relaxed mb-6">
                                            The global copilot hub is currently empty. Create your first official agent.
                                        </p>
                                        <Button
                                            variant="solid"
                                            onClick={() => setIsCreateModalOpen(true)}
                                            className="bg-primary hover:bg-primary-deep text-white rounded-xl shadow-lg shadow-primary/20 font-black text-xs px-6 py-3"
                                        >
                                            Create Copilot
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[1200px]">
                                            <thead>
                                                <tr className="bg-gray-50/50 dark:bg-gray-800/30">
                                                    <th className="px-6 py-5 text-left w-[20%] rounded-l-2xl">
                                                        <div className="flex items-center gap-2 text-xs font-black text-gray-900">
                                                            <FileText className="w-3.5 h-3.5" />
                                                            <span>Copilot Name</span>
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-5 text-left w-[12%]">
                                                        <div className="flex items-center gap-2 text-xs font-black text-gray-900">
                                                            <LayoutGrid className="w-3.5 h-3.5" />
                                                            <span>Type</span>
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-5 text-left w-[12%]">
                                                        <div className="flex items-center gap-2 text-xs font-black text-gray-900">
                                                            <Cpu className="w-3.5 h-3.5" />
                                                            <span>Provider</span>
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-5 text-center w-[10%]">
                                                        <div className="flex items-center justify-center gap-2 text-xs font-black text-gray-900">
                                                            <Activity className="w-3.5 h-3.5" />
                                                            <span>Status</span>
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-5 text-right w-[10%]">
                                                        <div className="flex items-center justify-end gap-2 text-xs font-black text-gray-900">
                                                            <Zap className="w-3.5 h-3.5" />
                                                            <span>Requests</span>
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-5 text-center w-[12%]">
                                                        <div className="flex items-center justify-center gap-2 text-xs font-black text-gray-900">
                                                            <Eye className="w-3.5 h-3.5" />
                                                            <span>Visibility</span>
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-5 text-left w-[12%]">
                                                        <div className="flex items-center gap-2 text-xs font-black text-gray-900">
                                                            <Settings className="w-3.5 h-3.5" />
                                                            <span>Updated</span>
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-5 text-center w-[12%] rounded-r-2xl">
                                                        <span className="text-xs font-black text-gray-900">Actions</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                                {copilotList.map((copilot) => {
                                                    const modelInfo = getModelInfo(copilot.model)
                                                    return (
                                                        <tr
                                                            key={copilot.id}
                                                            className="group hover:bg-primary/[0.02] dark:hover:bg-primary/5 transition-all duration-300 cursor-pointer"
                                                            onClick={() => router.push(`/platform-copilot-management/${copilot.id}`)}
                                                        >
                                                            <td className="px-6 py-5">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                                                                        <Bot className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
                                                                    </div>
                                                                    <div className="flex flex-col gap-0.5">
                                                                        <span className="font-black text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors text-sm truncate max-w-[180px]">
                                                                            {copilot.name}
                                                                        </span>
                                                                        <span className="text-xs text-gray-600 dark:text-gray-400 font-bold">{copilot.category}</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5">
                                                                <div className={classNames(
                                                                    "inline-flex items-center px-2 py-1 rounded-md text-xs font-black transition-all",
                                                                    copilot.visibility === 'public' ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20" :
                                                                        copilot.visibility === 'workspace' ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20" :
                                                                            "bg-gray-100 text-gray-700 dark:bg-gray-800"
                                                                )}>
                                                                    {copilot.visibility === 'public' ? 'Public' :
                                                                        copilot.visibility === 'workspace' ? 'Enterprise' : 'Internal'}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: modelInfo.color }}></span>
                                                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{modelInfo.provider}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5 text-center">
                                                                <StatusBadge status={copilot.status} />
                                                            </td>
                                                            <td className="px-6 py-5 text-right font-black text-gray-900 dark:text-white text-sm">
                                                                {formatNumber(copilot.usageCount || 0)}
                                                            </td>
                                                            <td className="px-6 py-5 text-center">
                                                                <div className={classNames(
                                                                    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black border",
                                                                    !copilot.workspaceId || copilot.workspaceId === 'GLOBAL'
                                                                        ? "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20"
                                                                        : "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800"
                                                                )}>
                                                                    {!copilot.workspaceId || copilot.workspaceId === 'GLOBAL' ? 'Global' : 'Org-Only'}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5">
                                                                <div className="flex flex-col">
                                                                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                                                                        {copilot.updatedAt ? dayjs(copilot.updatedAt).fromNow() : 'Never'}
                                                                    </span>
                                                                    <span className="text-xs text-gray-600 dark:text-gray-400 font-black">
                                                                        {copilot.updatedAt ? dayjs(copilot.updatedAt).format('MMM D') : '-'}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5 text-center" onClick={(e) => e.stopPropagation()}>
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <button
                                                                        onClick={() => router.push(`/platform-copilot-management/${copilot.id}`)}
                                                                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-primary hover:text-white border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 transition-all duration-300 shadow-sm"
                                                                        title="View Details"
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                    </button>
                                                                    {isSuperadmin && (
                                                                        <button
                                                                            onClick={() => {
                                                                                setPreviewCopilot(copilot as any)
                                                                                setIsPreviewDrawerOpen(true)
                                                                            }}
                                                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-primary hover:text-white border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 transition-all duration-300 shadow-sm"
                                                                            title="Preview Chat"
                                                                        >
                                                                            <MessageSquare className="w-4 h-4" />
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        onClick={() => handleDelete(copilot)}
                                                                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-red-500 hover:text-white border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 transition-all duration-300 shadow-sm"
                                                                        title="Delete Copilot"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Pagination */}
                                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs items-center gap-2 font-black text-gray-600 dark:text-gray-400 flex shrink-0">
                                            Show
                                            <div className="w-16">
                                                <Select
                                                    size="sm"
                                                    value={[
                                                        { value: 10, label: '10' },
                                                        { value: 25, label: '25' },
                                                        { value: 50, label: '50' }
                                                    ].find(opt => opt.value === filter.limit)}
                                                    options={[
                                                        { value: 10, label: '10' },
                                                        { value: 25, label: '25' },
                                                        { value: 50, label: '50' }
                                                    ]}
                                                    onChange={(opt: any) => handlePageSizeChange(opt?.value)}
                                                />
                                            </div>
                                            Per Page
                                        </span>
                                        <div className="w-px h-4 bg-gray-100 dark:bg-gray-800" />
                                        <p className="text-xs font-black text-gray-600 dark:text-gray-400">
                                            Total <span className="text-gray-900 dark:text-white">{total}</span> Copilots
                                        </p>
                                    </div>
                                    <Pagination
                                        currentPage={Math.floor(filter.skip / filter.limit) + 1}
                                        total={total}
                                        pageSize={filter.limit}
                                        onChange={handlePaginationChange}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Create Copilot Modal Integration */}
            <CreateCopilotModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={(newCopilot) => {
                    dispatch(compAdminGetCopilots({ limit: 100 }))
                    setIsCreateModalOpen(false)
                }}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                width={500}
            >
                <div className="p-2">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center border border-red-100 dark:border-red-800">
                            <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white ">Delete Copilot</h2>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-black">This cannot be undone</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Are you sure you want to delete <span className="font-black text-gray-900 dark:text-white ">"{copilotToDelete?.name}"</span>?
                            This will permanently remove all documents, chat history, and configuration node data.
                        </p>

                        <div className="flex justify-end gap-3 pt-6">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="h-12 px-6 font-black text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 transition-colors"
                            >
                                Cancel
                            </button>
                            <Button
                                variant="solid"
                                onClick={confirmDelete}
                                loading={isDeleting}
                                className="h-12 px-8 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-xl shadow-red-500/20"
                            >
                                Delete Copilot
                            </Button>
                        </div>
                    </div>
                </div>
            </Dialog>

            {/* Preview Drawer */}
            {previewCopilot && (
                <CopilotPreviewDrawer
                    isOpen={isPreviewDrawerOpen}
                    onClose={() => {
                        setIsPreviewDrawerOpen(false)
                        setPreviewCopilot(null)
                    }}
                    copilot={previewCopilot}
                />
            )}
        </div>
    )
}
