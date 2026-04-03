'use client'

import React from 'react'
import {
    Badge,
    Dropdown,
    Button,
    Spinner
} from '@/components/ui'
import {
    MoreHorizontal,
    Eye,
    CreditCard,
    History,
    Slash,
    Flag,
    Building2,
    Database,
    Clock,
    User,
    FileText,
    Activity,
    Zap,
    Users,
    Trash2,
    CheckCircle,
    XCircle,
    PauseCircle,
    Settings,
    MoreVertical
} from 'lucide-react'
import classNames from '@/utils/classNames'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { PlatformOrgListItem } from '../types'

dayjs.extend(relativeTime)

interface PlatformOrgTableProps {
    data: PlatformOrgListItem[]
    loading: boolean
    onView: (id: string) => void
    onAction: (action: string, id: string) => void
}

function StatusBadge({ status }: { status: string }) {
    return (
        <div className={classNames(
            "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black capitalize border transition-all duration-300",
            status === 'active' ? "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30 shadow-sm" :
                status === 'trial' ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30" :
                    status === 'suspended' ? "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30" :
                        status === 'overdue' ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30" :
                            "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
        )}>
            {status === 'active' && <CheckCircle className="w-3.5 h-3.5" />}
            {status === 'suspended' && <XCircle className="w-3.5 h-3.5" />}
            {status === 'overdue' && <PauseCircle className="w-3.5 h-3.5" />}
            <span>{status}</span>
        </div>
    )
}

export default function PlatformOrgTable({ data, loading, onView, onAction }: PlatformOrgTableProps) {
    const hasInitialData = React.useRef(false)

    if (data.length > 0) {
        hasInitialData.current = true
    }

    // Only show big spinner on absolute initial load (no data and loading)
    if (loading && !hasInitialData.current) {
        return (
            <div className="flex flex-col items-center justify-center p-32 space-y-6 bg-white dark:bg-gray-900 rounded-[2.5rem] min-h-[400px]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                    <Building2 className="absolute inset-0 m-auto w-6 h-6 text-primary/40" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-[10px] font-black text-gray-900 dark:text-white animate-pulse">Scanning Intelligence...</p>
                    <p className="text-[8px] font-bold text-gray-400">Synchronizing secure organization records</p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative group/table">
            {/* Subtle Progress Bar for background loading */}
            {loading && data.length > 0 && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary/10 overflow-hidden z-50 rounded-full">
                    <div className="h-full bg-primary animate-progress-fast" />
                </div>
            )}

            {/* Subtle Overlay - only show if loading takes more than a brief moment */}
            {loading && data.length > 0 && (
                <div className="absolute inset-0 bg-white/5 dark:bg-gray-900/5 backdrop-blur-[1px] z-40 flex items-center justify-center transition-opacity duration-300 pointer-events-none">
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-3 animate-in fade-in zoom-in duration-300 delay-150">
                        <Spinner size={18} className="text-primary" />
                        <span className="text-[10px] font-black text-gray-900 dark:text-white leading-none">Updating Intelligence...</span>
                    </div>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px]">
                    <thead>
                        <tr className="bg-gray-50/50 dark:bg-gray-800/30">
                            <th className="px-6 py-5 text-left w-[23%] rounded-l-2xl">
                                <div className="flex items-center gap-2 text-xs font-black text-gray-400">
                                    <Building2 className="w-3.5 h-3.5" />
                                    <span>Organization</span>
                                </div>
                            </th>
                            <th className="px-6 py-5 text-center w-[10%]">
                                <div className="flex items-center justify-center gap-2 text-xs font-black text-gray-400">
                                    <Activity className="w-3.5 h-3.5" />
                                    <span>Status</span>
                                </div>
                            </th>
                            <th className="px-6 py-5 text-left w-[10%]">
                                <div className="flex items-center gap-2 text-xs font-black text-gray-400">
                                    <Database className="w-3.5 h-3.5" />
                                    <span>Workspaces</span>
                                </div>
                            </th>
                            <th className="px-6 py-5 text-left w-[10%]">
                                <div className="flex items-center gap-2 text-xs font-black text-gray-400">
                                    <Users className="w-3.5 h-3.5" />
                                    <span>Members</span>
                                </div>
                            </th>
                            <th className="px-6 py-5 text-right w-[12%]">
                                <div className="flex items-center justify-end gap-2 text-xs font-black text-gray-400">
                                    <Zap className="w-3.5 h-3.5" />
                                    <span>Usage (30d)</span>
                                </div>
                            </th>
                            <th className="px-6 py-5 text-right w-[12%]">
                                <div className="flex items-center justify-end gap-2 text-xs font-black text-gray-400">
                                    <CreditCard className="w-3.5 h-3.5" />
                                    <span>Credits</span>
                                </div>
                            </th>
                            <th className="px-6 py-5 text-left w-[10%]">
                                <div className="flex items-center gap-2 text-xs font-black text-gray-400">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>Activity</span>
                                </div>
                            </th>
                            <th className="px-6 py-5 text-center w-[13%] rounded-r-2xl">
                                <span className="text-xs font-black text-gray-400">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {data.map((org) => (
                            <tr
                                key={org.id}
                                className="group hover:bg-primary/[0.02] dark:hover:bg-primary/5 transition-all duration-300 cursor-pointer"
                                onClick={() => onView(org.id)}
                            >
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                                            <Building2 className="w-6 h-6 text-gray-500 group-hover:text-primary transition-colors" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <h4 className="text-base font-black text-gray-900 dark:text-white capitalize tracking-tight group-hover:text-primary transition-colors leading-none">
                                                {org.name}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                {org.owner && (
                                                    <span className="text-xs font-bold text-primary/70">
                                                        {org.owner}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <StatusBadge status={org.status} />
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2 font-bold text-gray-700 dark:text-gray-300">
                                        <Database className="w-4 h-4 text-primary/60" />
                                        <span className="text-sm">{org.workspaces}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2 font-bold text-gray-700 dark:text-gray-300">
                                        <Users className="w-4 h-4 text-primary/60" />
                                        <span className="text-sm">{org.members}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right font-black text-gray-900 dark:text-white text-base">
                                    ₦{org.monthlyUsage.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="px-6 py-5 text-right font-black text-base">
                                    <span className={classNames(
                                        org.credits < 0 ? "text-rose-500" : "text-emerald-500"
                                    )}>
                                        {org.credits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs uppercase">QOR</span>
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                            {org.lastActivity ? dayjs(org.lastActivity).fromNow() : 'Never'}
                                        </span>
                                        <span className="text-xs text-gray-400 font-black">
                                            {org.lastActivity ? dayjs(org.lastActivity).format('MMM D') : '-'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-center">
                                        <Dropdown
                                            renderTitle={
                                                <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-500 border border-gray-100 dark:border-gray-700 transition-all duration-300">
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                            }
                                            placement="bottom-end"
                                        >
                                            <Dropdown.Item onClick={() => onView(org.id)}>
                                                <div className="flex items-center gap-3 py-1.5">
                                                    <Eye className="w-4.5 h-4.5 text-primary" />
                                                    <span className="text-sm font-semibold">View details</span>
                                                </div>
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => onAction('credits', org.id)}>
                                                <div className="flex items-center gap-3 py-1.5">
                                                    <Zap className="w-4.5 h-4.5 text-primary" />
                                                    <span className="text-sm font-semibold">Allocate credits</span>
                                                </div>
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => onAction('status', org.id)}>
                                                <div className="flex items-center gap-3 py-1.5 text-rose-500">
                                                    <Slash className="w-4.5 h-4.5" />
                                                    <span className="text-sm font-semibold">
                                                        {org.status === 'suspended' ? 'Reactivate' : 'Suspend account'}
                                                    </span>
                                                </div>
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => onAction('delete', org.id)}>
                                                <div className="flex items-center gap-3 py-1.5 text-rose-600">
                                                    <Trash2 className="w-4.5 h-4.5" />
                                                    <span className="text-sm font-semibold">Delete organization</span>
                                                </div>
                                            </Dropdown.Item>
                                        </Dropdown>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && !loading && (
                            <tr>
                                <td colSpan={8} className="py-32">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-gray-700">
                                            <Building2 className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-black text-gray-900 dark:text-white tracking-tight">No Organizations Found</p>
                                            <p className="text-[10px] font-bold text-gray-400 mt-1">Try adjusting your search or filters</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
