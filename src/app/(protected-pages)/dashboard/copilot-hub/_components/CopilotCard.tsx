'use client'

import { Card, Button, Dropdown, Tooltip } from '@/components/ui'
import classNames from '@/utils/classNames'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import {
    MessageSquare,
    MoreVertical,
    Play,
    Settings,
    Copy,
    Trash2,
    Share2,
    Eye,
    EyeOff,
    ChevronRight,
    FileText,
    BarChart3,
    Users,
    Headphones,
    Briefcase,
    Megaphone,
    Scale,
    UserCircle,
    Sparkles,
    Code,
    Search,
    PenTool,
    Star,
    Layout,

} from 'lucide-react'
import type { Copilot } from '../types'

interface CopilotCardProps {
    copilot: Copilot
    viewMode: 'grid' | 'list'
    currentUserId?: string
    onClick: () => void
    onStartChat: () => void
    onEdit?: () => void
    onDuplicate?: () => void
    onDelete?: () => void
    onShare?: () => void
    onToggleVisibility?: () => void
    onAssignToWorkspace?: () => void

}

export default function CopilotCard({
    copilot,
    viewMode,
    currentUserId,
    onClick,
    onStartChat,
    onEdit,
    onDuplicate,
    onDelete,
    onShare,
    onToggleVisibility,
    onAssignToWorkspace,

}: CopilotCardProps) {
    const { session } = useCurrentSession()
    const userRole = (session?.user as any)?.role
    const userAuthority = (session?.user as any)?.authority || []
    const isSuperadmin = userAuthority.includes('platform_super_admin') || userRole === 'platform_super_admin'
    const isOrgAdmin = userAuthority.includes('org_admin') || userRole === 'org_admin'
    const isOrgSuperAdmin = userAuthority.includes('org_super_admin') || userRole === 'org_super_admin'
    const canManage = isSuperadmin || isOrgAdmin || isOrgSuperAdmin

    const isOwner = currentUserId ? copilot.createdBy === currentUserId : true
    const isOfficial = copilot.isOfficial || (copilot as any).is_official
    const isShared = !isOwner && !isOfficial && !copilot.isFeatured

    const isInactive = copilot.status === 'inactive'
    const isDisabled = copilot.status === 'disabled'
    const isDraft = copilot.status === 'draft'

    // Disable chat logic:
    // - Disabled status: Only superadmin can use (for preview)
    // - Inactive status: Only owner or superadmin can use
    // - Draft status: Only owner or superadmin can use
    const chatDisabled = isDisabled
        ? !isSuperadmin
        : isInactive
            ? !(isOwner || isSuperadmin)
            : isDraft
                ? true // Standard chat is disabled for drafts to enforce the 'Publish' workflow
                : false

    const chatTooltip = isDisabled
        ? "This copilot has been disabled by HQ."
        : isInactive
            ? "This copilot is currently paused by the organization admin."
            : isDraft
                ? isOwner
                    ? "This copilot is a draft. Please complete configuration and publish it from the settings."
                    : "This copilot is currently a draft and not yet available for usage."
                : ""

    const formatUsageCount = (count: number) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M uses`
        }
        if (count >= 1000) {
            return `${(count / 1000).toFixed(0).toLocaleString()},${(count % 1000).toString().padStart(3, '0')} uses`
        }
        return `${count.toLocaleString()} uses`
    }

    const getCategoryBadgeStyle = (category: string) => {
        const styles: Record<string, string> = {
            coding: 'bg-blue-50 text-blue-600 border border-blue-200 rounded-md',
            writing: 'bg-purple-50 text-purple-600 border border-purple-200 rounded-md',
            research: 'bg-green-50 text-green-600 border border-green-200 rounded-md',
            'data-analysis': 'bg-orange-50 text-orange-600 border border-orange-200 rounded-md',
            'customer-support': 'bg-pink-50 text-pink-600 border border-pink-200 rounded-md',
            sales: 'bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-md',
            marketing: 'bg-rose-50 text-rose-600 border border-rose-200 rounded-md',
            legal: 'bg-slate-50 text-slate-600 border border-slate-200 rounded-md',
            hr: 'bg-teal-50 text-teal-600 border border-teal-200 rounded-md',
            general: 'bg-gray-50 text-gray-600 border border-gray-200 rounded-md',
        }
        return styles[category] || styles.general
    }

    const getCategoryLabel = (category: string) => {
        const labels: Record<string, string> = {
            coding: 'Coding',
            writing: 'Writing',
            research: 'Research',
            'data-analysis': 'Data Analysis',
            'customer-support': 'Support',
            sales: 'Sales',
            marketing: 'Marketing',
            legal: 'Legal',
            hr: 'HR',
            general: 'General',
        }
        return labels[category] || 'General'
    }

    const getCategoryIcon = (category: string) => {
        const icons: Record<string, React.ReactNode> = {
            coding: <Code className="w-5 h-5" />,
            writing: <PenTool className="w-5 h-5" />,
            research: <Search className="w-5 h-5" />,
            'data-analysis': <BarChart3 className="w-5 h-5" />,
            'customer-support': <Headphones className="w-5 h-5" />,
            sales: <Briefcase className="w-5 h-5" />,
            marketing: <Megaphone className="w-5 h-5" />,
            legal: <Scale className="w-5 h-5" />,
            hr: <Users className="w-5 h-5" />,
            general: <Sparkles className="w-5 h-5" />,
        }
        return icons[category] || icons.general
    }

    const getIconBgColor = (category: string) => {
        const colors: Record<string, string> = {
            coding: 'bg-blue-50 text-blue-600',
            writing: 'bg-purple-50 text-purple-600',
            research: 'bg-green-50 text-green-600',
            'data-analysis': 'bg-orange-50 text-orange-600',
            'customer-support': 'bg-pink-50 text-pink-600',
            sales: 'bg-indigo-50 text-indigo-600',
            marketing: 'bg-rose-50 text-rose-600',
            legal: 'bg-slate-50 text-slate-600',
            hr: 'bg-teal-50 text-teal-600',
            general: 'bg-gray-50 text-gray-600',
        }
        return colors[category] || colors.general
    }

    const dropdownItems = [
        { key: 'chat', label: 'Start Chat', icon: <Play className="w-4 h-4" />, onClick: onStartChat },
        // Management options: Only for admins or owners
        ...(canManage || isOwner ? [
            { key: 'edit', label: 'Edit Settings', icon: <Settings className="w-4 h-4" />, onClick: onEdit },

            { key: 'share', label: 'Share', icon: <Share2 className="w-4 h-4" />, onClick: onShare },
            { key: 'visibility', label: copilot.visibility === 'public' ? 'Make Private' : 'Make Public', icon: copilot.visibility === 'public' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />, onClick: onToggleVisibility },
            // Assign to Workspace: Only for organization admins (not regular users)
            ...(canManage ? [
                { key: 'assign-workspace', label: 'Assign to Workspace', icon: <Layout className="w-4 h-4" />, onClick: onAssignToWorkspace },
            ] : []),
            { key: 'delete', label: 'Delete', icon: <Trash2 className="w-4 h-4 text-red-500" />, onClick: onDelete, className: 'text-red-500' },
        ] : []),
        { key: 'duplicate', label: 'Duplicate', icon: <Copy className="w-4 h-4" />, onClick: onDuplicate },
    ].filter(item => item.onClick)

    if (viewMode === 'list') {
        return (
            <Card
                className="group relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer rounded-2xl"
                onClick={onClick}
            >
                <div className="flex items-center gap-6 p-4 sm:p-5">
                    {/* Icon with Premium Container */}
                    <div className={classNames(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm",
                        getIconBgColor(copilot.category)
                    )}>
                        <div className="bg-white/20 p-2.5 rounded-xl border border-white/30">
                            {getCategoryIcon(copilot.category)}
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-1.5">
                            <h3 className="text-base font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                {copilot.name}
                            </h3>
                            <span className={classNames(
                                "px-2 py-0.5 text-[9px] font-black rounded-md border",
                                getCategoryBadgeStyle(copilot.category)
                            )}>
                                {getCategoryLabel(copilot.category)}
                            </span>
                            {((copilot as any).isFeatured || (copilot as any).is_featured || (copilot as any).isOfficial || (copilot as any).is_official) && (
                                <span className="bg-amber-100 text-amber-700 border-amber-200 px-2 py-0.5 text-[8px] font-black rounded-md flex items-center gap-1 shadow-sm shrink-0">
                                    <Star className="w-2.5 h-2.5 fill-current" />
                                    Official
                                </span>
                            )}
                            {copilot.status !== 'active' && (
                                <span className={classNames(
                                    "px-2 py-0.5 text-[8px] font-black rounded-md shrink-0",
                                    copilot.status === 'inactive' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                        copilot.status === 'draft' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                            'bg-gray-100 text-gray-700 border-gray-200'
                                )}>
                                    {copilot.status === 'inactive' ? 'Paused' : copilot.status}
                                </span>
                            )}
                            {isShared && (
                                <span className="bg-blue-100 text-blue-700 border-blue-200 px-2 py-0.5 text-[8px] font-black rounded-md flex items-center gap-1 shadow-sm shrink-0">
                                    <Users className="w-2.5 h-2.5" />
                                    Shared
                                </span>
                            )}
                        </div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 line-clamp-1 max-w-2xl">
                            {copilot.description}
                        </p>
                    </div>

                    {/* Stats Display */}
                    <div className="hidden lg:flex flex-col items-end gap-1 px-6 border-x border-gray-50 dark:border-gray-800">
                        <span className="text-[10px] font-black text-gray-400 leading-none">Usage Index</span>
                        <span className="text-sm font-black text-gray-900 dark:text-white">
                            {formatUsageCount(copilot.usageCount).split(' ')[0]}
                            <span className="text-[9px] ml-1 text-gray-400">Uses</span>
                        </span>
                    </div>

                    {/* Actions Panel */}
                    <div className="flex items-center gap-3 pl-2" onClick={(e) => e.stopPropagation()}>
                        <Tooltip
                            title={chatDisabled ? chatTooltip : ""}
                            placement="top"
                            disabled={!chatDisabled}
                        >
                            <Button
                                variant={isDraft && isOwner ? "solid" : "solid"}
                                size="sm"
                                disabled={chatDisabled && !(isDraft && isOwner)}
                                className={classNames(
                                    "h-10 px-5 rounded-xl font-black text-[9px] shadow-lg flex items-center gap-2 border-none transition-all",
                                    isDraft && isOwner
                                        ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
                                        : "bg-primary hover:bg-primary-deep text-white shadow-primary/10",
                                    chatDisabled && !(isDraft && isOwner) && "opacity-50 grayscale cursor-not-allowed"
                                )}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (isDraft && isOwner) {
                                        onEdit?.()
                                    } else if (isOfficial && !isSuperadmin) {
                                        onDuplicate?.()
                                    } else if (!chatDisabled) {
                                        onStartChat()
                                    }
                                }}
                            >
                                {isDraft && isOwner ? (
                                    <>
                                        <span>Configure & Publish</span>
                                        <Settings className="w-3.5 h-3.5" strokeWidth={2.5} />
                                    </>
                                ) : isOfficial && !isSuperadmin ? (
                                    <>
                                        <span>Use Template</span>
                                        <Copy className="w-3.5 h-3.5" strokeWidth={2.5} />
                                    </>
                                ) : (
                                    <>
                                        <span>Start Chat</span>
                                        <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                                    </>
                                )}
                            </Button>
                        </Tooltip>
                        {(canManage || isOwner) && (
                            <Dropdown
                                placement="bottom-end"
                                renderTitle={
                                    <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 transition-all border border-gray-100 dark:border-gray-800">
                                        <MoreVertical className="w-7 h-7" strokeWidth={3} />
                                    </button>
                                }
                            >
                                {dropdownItems.map((item) => (
                                    <Dropdown.Item
                                        key={item.key}
                                        eventKey={item.key}
                                        onClick={item.onClick}
                                        className={classNames(item.className, "font-bold text-sm p-4")}
                                    >
                                        <span className="w-5 h-5 flex items-center justify-center mr-2 opacity-70">
                                            {item.icon}
                                        </span>
                                        <span>{item.label}</span>
                                    </Dropdown.Item>
                                ))}
                            </Dropdown>
                        )}
                    </div>
                </div>
            </Card>
        )
    }

    // Premium Grid View
    return (
        <Card
            className="group relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer rounded-[2rem] flex flex-col h-full"
            onClick={onClick}
        >
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

            <div className="p-6 flex flex-col flex-1 h-full">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-6">
                    <div className={classNames(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
                        getIconBgColor(copilot.category)
                    )}>
                        <div className="bg-white/20 p-2 rounded-xl border border-white/20">
                            {getCategoryIcon(copilot.category)}
                        </div>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {((copilot as any).isFeatured || (copilot as any).is_featured || (copilot as any).isOfficial || (copilot as any).is_official) && (
                            <span className="bg-amber-100 text-amber-700 border-amber-200 text-[8px] font-black px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                Official
                            </span>
                        )}
                        {isShared && (
                            <span className="bg-blue-100 text-blue-700 border-blue-200 text-[8px] font-black px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                                <Users className="w-2.5 h-2.5" />
                                Shared
                            </span>
                        )}
                        {copilot.status !== 'active' && (
                            <span className={classNames(
                                "text-[8px] font-black px-2 py-0.5 rounded-md shadow-sm",
                                copilot.status === 'inactive' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                    copilot.status === 'draft' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                        'bg-gray-100 text-gray-700 border-gray-200'
                            )}>
                                {copilot.status === 'inactive' ? 'Paused' : copilot.status}
                            </span>
                        )}
                        {(canManage || isOwner) && (
                            <Dropdown
                                placement="bottom-end"
                                renderTitle={
                                    <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                                        <MoreVertical className="w-7 h-7" strokeWidth={3} />
                                    </button>
                                }
                            >
                                {dropdownItems.map((item) => (
                                    <Dropdown.Item
                                        key={item.key}
                                        eventKey={item.key}
                                        onClick={item.onClick}
                                        className={classNames(item.className, "font-bold text-sm p-4")}
                                    >
                                        <span className="w-4 h-4 flex items-center justify-center mr-2 opacity-70">
                                            {item.icon}
                                        </span>
                                        <span>{item.label}</span>
                                    </Dropdown.Item>
                                ))}
                            </Dropdown>
                        )}
                    </div>
                </div>

                {/* Visual Accent */}
                <div className="h-0.5 w-12 bg-primary/20 mb-4 group-hover:w-20 transition-all duration-500 rounded-full" />

                {/* Title & Metadata */}
                <div className="space-y-1.5 mb-4 min-h-[4rem]">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight group-hover:text-primary transition-colors">
                        {copilot.name}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className={classNames(
                            "px-2 py-0.5 text-[8px] font-black rounded-md border",
                            getCategoryBadgeStyle(copilot.category)
                        )}>
                            {getCategoryLabel(copilot.category)}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                        <span className="text-[8px] font-black text-gray-400">
                            {formatUsageCount(copilot.usageCount)}
                        </span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 line-clamp-3 mb-8 leading-relaxed flex-1">
                    {copilot.description}
                </p>

                {/* Actions Button */}
                <div className="mt-auto pt-4 border-t border-gray-50 dark:border-gray-800">
                    <Tooltip
                        title={chatDisabled ? (isDraft && isOwner ? "" : chatTooltip) : ""}
                        placement="top"
                        disabled={!chatDisabled || (isDraft && isOwner)}
                    >
                        <Button
                            variant="solid"
                            size="md"
                            disabled={chatDisabled && !(isDraft && isOwner)}
                            className={classNames(
                                "w-full h-11 rounded-xl font-black text-[10px] shadow-lg flex items-center justify-center gap-2 border-none transition-all group-hover:translate-y-[-2px]",
                                isDraft && isOwner
                                    ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
                                    : "bg-primary hover:bg-primary-deep text-white shadow-primary/20",
                                chatDisabled && !(isDraft && isOwner) && "opacity-50 grayscale cursor-not-allowed"
                            )}
                            onClick={(e) => {
                                e.stopPropagation()
                                if (isDraft && isOwner) {
                                    onEdit?.()
                                } else if (isOfficial && !isSuperadmin) {
                                    onDuplicate?.()
                                } else if (!chatDisabled) {
                                    onStartChat()
                                }
                            }}
                        >
                            {isDraft && isOwner ? (
                                <>
                                    <Settings className="w-3.5 h-3.5" />
                                    <span>Configure & Publish</span>
                                </>
                            ) : isOfficial && !isSuperadmin ? (
                                <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Use Template</span>
                                </>
                            ) : (
                                <>
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                    <span>Start Chat</span>
                                </>
                            )}
                        </Button>
                    </Tooltip>
                </div>
            </div>

            {/* Subtle Hover Gradient */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Card>
    )
}
