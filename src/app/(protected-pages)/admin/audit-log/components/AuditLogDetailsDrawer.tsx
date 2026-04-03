'use client'

import React from 'react'
import { Drawer, Button } from '@/components/ui'
import { Shield, Clock, Globe, Database, Info, X, ShieldCheck, User, MapPin } from 'lucide-react'
import classNames from '@/utils/classNames'
import dayjs from 'dayjs'
import type { AuditLogEntry } from '../types'

interface AuditLogDetailsDrawerProps {
    log: AuditLogEntry | null
    isOpen: boolean
    onClose: () => void
}

export default function AuditLogDetailsDrawer({ log, isOpen, onClose }: AuditLogDetailsDrawerProps) {
    if (!log) return null

    const severityColors: Record<AuditLogEntry['severity'], string> = {
        low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
        medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
        high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
        critical: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
    }

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            width={520}
            placement="right"
        >
            <div className="flex flex-col h-full relative p-4 pb-6">
                <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">

                    {/* Content Scroll Area */}
                    <div className="flex-1 overflow-y-auto no-scrollbar">

                        {/* Premium Header */}
                        <div className="relative pt-12 pb-8 px-8 overflow-hidden">
                            {/* Visual Blur Elements */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                            <div className="absolute top-0 left-0 -ml-16 -mt-16 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />

                            <div className="relative z-10 flex flex-col items-center text-center">
                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute -top-4 -right-2 p-2.5 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-bold"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="space-y-3">
                                    <div className="flex flex-col items-center gap-2">
                                        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">
                                            Activity Details
                                        </h3>
                                        <div className={classNames(
                                            "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5 shadow-sm",
                                            log.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                        )}>
                                            <Shield className="w-3 h-3" />
                                            {log.status === 'success' ? 'Success' : 'Failed'}
                                        </div>
                                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight px-4">
                                            {log.action.split('_').join(' ')}
                                        </h2>
                                    </div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                                        Ref: {log.id.slice(0, 8)}...
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Main Grid Content */}
                        <div className="px-8 pb-10 space-y-8">

                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Level</span>
                                    </div>
                                    <span className={classNames(
                                        "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                                        severityColors[log.severity]
                                    )}>
                                        {log.severity}
                                    </span>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                                            <Clock className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</span>
                                    </div>
                                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                                        {dayjs(log.timestamp).format('HH:mm:ss')}
                                    </p>
                                </div>
                            </div>

                            {/* Entity Context */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    <h3 className="text-[12px] font-bold text-gray-900 dark:text-white tracking-tight">Event Details</h3>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800/50 divide-y divide-gray-100 dark:divide-gray-800/50">
                                    <div className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                                                <User className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <span className="text-[11px] font-bold text-gray-500">By User</span>
                                        </div>
                                        <span className="text-[11px] font-black text-gray-900 dark:text-white uppercase">
                                            {log.actorName || 'System'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                                                <Globe className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <span className="text-[11px] font-bold text-gray-500">IP Address</span>
                                        </div>
                                        <span className="text-[11px] font-black text-gray-900 dark:text-white">
                                            {log.ipAddress || 'Internal'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <span className="text-[11px] font-bold text-gray-500">Location</span>
                                        </div>
                                        <span className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                            {log.location || 'Local'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Extended Metadata */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                        <h3 className="text-[12px] font-bold text-gray-900 dark:text-white tracking-tight">Technical Data</h3>
                                    </div>
                                    <span className="text-[9px] font-black text-gray-400 px-2 py-0.5 border border-gray-100 dark:border-gray-800 rounded-md uppercase">JSON</span>
                                </div>
                                <div className="bg-gray-950 rounded-[1.5rem] p-6 border border-gray-800/50 shadow-inner group">
                                    <pre className="text-[11px] font-mono text-emerald-400/80 whitespace-pre-wrap leading-relaxed max-h-[250px] overflow-y-auto no-scrollbar group-hover:text-emerald-400 transition-colors">
                                        {JSON.stringify(log.metaData || {}, null, 4)}
                                    </pre>
                                </div>
                            </div>

                            {/* Compliance Info */}
                            <div className="flex items-start gap-4 p-5 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl">
                                <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-[12px] font-black text-amber-800 dark:text-amber-500 uppercase tracking-widest">Note</p>
                                    <p className="text-[11px] text-amber-900/60 dark:text-amber-500/60 font-medium leading-relaxed">
                                        This record is secured and cannot be changed or deleted.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Premium Sticky Footer */}
                    <div className="p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 relative z-20">
                        <Button
                            variant="solid"
                            onClick={onClose}
                            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary-deep text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 group"
                        >
                            <X className="w-4 h-4 transition-transform group-hover:rotate-90" />
                            <span>Close Details</span>
                        </Button>
                    </div>

                </div>
            </div>
        </Drawer>
    )
}
