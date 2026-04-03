'use client'

import React from 'react'
import { Card, Button } from '@/components/ui'
import { Eye, Clock, User, Info, MapPin, Globe, MoreVertical, FileText } from 'lucide-react'
import classNames from '@/utils/classNames'
import dayjs from 'dayjs'
import type { AuditLogEntry } from '../types'

interface AuditLogTableProps {
    logs: AuditLogEntry[]
    loading: boolean
    onViewDetails: (log: AuditLogEntry) => void
}

const severityColors: Record<AuditLogEntry['severity'], string> = {
    low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    critical: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
}

export default function AuditLogTable({ logs, loading, onViewDetails }: AuditLogTableProps) {
    if (loading && logs.length === 0) {
        return (
            <Card className="rounded-[2.5rem] p-8 border-none bg-white dark:bg-gray-900">
                <div className="flex flex-col items-center gap-4 py-24">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-xs font-black text-gray-400 italic">Verifying logs...</p>
                </div>
            </Card>
        )
    }

    return (
        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 overflow-hidden flex flex-col min-h-[500px] border border-gray-50 dark:border-gray-800">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 dark:bg-gray-800/20">
                            <th className="px-8 py-6 text-[10px] font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">Timestamp</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">Operator</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">Action & Resource</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">Network Origin</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 text-center">Status</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-8 py-24 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                                            <FileText className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <p className="text-lg font-black text-gray-900 dark:text-white">No logs found</p>
                                        <p className="text-xs font-bold text-gray-400 italic">Try adjusting your search or filters</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => {
                                const d = dayjs(log.timestamp)
                                const datePart = d.isValid() ? d.format('MMM DD, YYYY') : '-'
                                const timePart = d.isValid() ? d.format('HH:mm:ss') : '-'

                                return (
                                    <tr key={log.id} className="group hover:bg-gray-50/30 dark:hover:bg-gray-800/10 transition-all duration-300">
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <p className="text-xs font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">{datePart}</p>
                                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400">
                                                    <Clock className="w-3 h-3" />
                                                    {timePart}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                                    <User className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-gray-900 dark:text-white tracking-tight">{log.actorName || 'System'}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{log.actorRole || 'Service Account'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <p className="text-xs font-black text-gray-900 dark:text-white tracking-tight">{log.action}</p>
                                                <p className="text-[10px] font-bold text-gray-500 italic max-w-[250px] truncate">
                                                    {log.targetType} {log.targetId ? `• ${log.targetId}` : ''}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                    <Globe className="w-3.5 h-3.5 text-gray-400" />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-black text-gray-900 dark:text-gray-300 font-mono italic">{log.ipAddress || 'Internal'}</span>
                                                    <p className="text-[9px] font-bold text-gray-400">{log.location || 'Local Data Center'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className={classNames(
                                                "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black border transition-all duration-300",
                                                log.status === 'success'
                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                                                    : "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                                            )}>
                                                <div className={classNames("w-1.5 h-1.5 rounded-full animate-pulse", log.status === 'success' ? "bg-emerald-500" : "bg-amber-500")} />
                                                {log.status.toUpperCase()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Button
                                                variant="plain"
                                                size="sm"
                                                onClick={() => onViewDetails(log)}
                                                className="h-10 w-10 p-0 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 border-none group/action"
                                            >
                                                <Eye className="w-4 h-4 text-gray-400 group-hover/action:text-primary transition-colors" />
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}
