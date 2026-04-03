'use client'

import React from 'react'
import { Drawer, Button, Select, Input, Badge } from '@/components/ui'
import {
    Filter,
    AlertCircle,
    CheckCircle2,
    User,
    Building2,
    Calendar,
    RotateCcw,
    Check,
    X
} from 'lucide-react'
import type { AuditLogFilterParams } from '../types'

interface AdvancedFilterDrawerProps {
    isOpen: boolean
    onClose: () => void
    params: AuditLogFilterParams
    onParamChange: (newParams: Partial<AuditLogFilterParams>) => void
    onReset: () => void
}

const severityOptions = [
    { label: 'All Levels', value: '' },
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Critical', value: 'critical' },
]

const statusOptions = [
    { label: 'All Statuses', value: '' },
    { label: 'Success', value: 'success' },
    { label: 'Failed', value: 'failed' },
    { label: 'Partially Completed', value: 'partially_completed' },
]

const actionTypeOptions = [
    { label: 'All Actions', value: '' },
    { label: 'Create', value: 'create' },
    { label: 'Update', value: 'update' },
    { label: 'Delete', value: 'delete' },
    { label: 'Assign', value: 'assign' },
    { label: 'Revoke', value: 'revoke' },
    { label: 'Login', value: 'login' },
    { label: 'Permission Change', value: 'permission_change' },
]

export default function AdvancedFilterDrawer({
    isOpen,
    onClose,
    params,
    onParamChange,
    onReset
}: AdvancedFilterDrawerProps) {
    const activeFilterCount = Object.values(params).filter(v => v !== undefined && v !== '' && v !== 1 && v !== 25).length

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            width={480}
            placement="right"
        >
            <div className="flex flex-col h-full relative p-4 pb-6">
                <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">

                    {/* Content Scroll Area */}
                    <div className="flex-1 overflow-y-auto no-scrollbar">

                        {/* Premium Header */}
                        <div className="relative pt-12 pb-8 px-8 overflow-hidden">
                            {/* Visual Blur Elements */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
                            <div className="absolute top-0 left-0 -ml-16 -mt-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />

                            <div className="relative z-10 flex flex-col items-center text-center">
                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute -top-4 -right-2 p-2.5 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-bold"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="space-y-3 pt-4">
                                    <div className="flex flex-col items-center gap-2">
                                        <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-1">
                                            Search Filters
                                        </h3>
                                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight px-4">
                                            Refine History
                                        </h2>
                                        {activeFilterCount > 0 && (
                                            <div className="mt-2 flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/40 rounded-full border border-indigo-100 dark:border-indigo-800 shadow-sm">
                                                <div className="w-4 h-4 rounded-full bg-indigo-600 text-[9px] font-black text-white flex items-center justify-center">
                                                    {activeFilterCount}
                                                </div>
                                                <span className="text-[9px] font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">Active Filters</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Grid Content */}
                        <div className="px-8 pb-10 space-y-8">

                            {/* Status & Level Card */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                    <h3 className="text-[12px] font-bold text-gray-900 dark:text-white tracking-tight uppercase tracking-widest">Status & Level</h3>
                                </div>
                                <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-3xl p-6 border border-gray-100 dark:border-gray-800/50 space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Level</label>
                                        </div>
                                        <Select
                                            options={severityOptions}
                                            value={severityOptions.find(o => o.value === params.severity)}
                                            onChange={(opt) => onParamChange({ severity: opt?.value })}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</label>
                                        </div>
                                        <Select
                                            options={statusOptions}
                                            value={statusOptions.find(o => o.value === params.status)}
                                            onChange={(opt) => onParamChange({ status: opt?.value })}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Filter className="w-3.5 h-3.5 text-gray-400" />
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Action Type</label>
                                        </div>
                                        <Select
                                            options={actionTypeOptions}
                                            value={actionTypeOptions.find(o => o.value === params.action_type)}
                                            onChange={(opt) => onParamChange({ action_type: opt?.value })}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* User Context Card */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <h3 className="text-[12px] font-bold text-gray-900 dark:text-white tracking-tight uppercase tracking-widest">User Details</h3>
                                </div>
                                <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-3xl p-6 border border-gray-100 dark:border-gray-800/50 space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <User className="w-3.5 h-3.5 text-gray-400" />
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">User ID</label>
                                        </div>
                                        <Input
                                            placeholder="Enter user ID..."
                                            value={params.actor_id || ''}
                                            onChange={(e) => onParamChange({ actor_id: e.target.value })}
                                            className="h-12 bg-white dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-indigo-500/20 focus:border-indigo-500 text-sm shadow-inner"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-3.5 h-3.5 text-gray-400" />
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Team ID</label>
                                        </div>
                                        <Input
                                            placeholder="Enter Team ID..."
                                            value={params.organization_id || ''}
                                            onChange={(e) => onParamChange({ organization_id: e.target.value })}
                                            className="h-12 bg-white dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-indigo-500/20 focus:border-indigo-500 text-sm shadow-inner"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Card */}
                            <div className="space-y-4 pb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                    <h3 className="text-[12px] font-bold text-gray-900 dark:text-white tracking-tight uppercase tracking-widest">Time Range</h3>
                                </div>
                                <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-3xl p-6 border border-gray-100 dark:border-gray-800/50 space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Choose Window</label>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <span className="text-[8px] font-black uppercase tracking-tighter text-gray-400 ml-1">From</span>
                                            <Input
                                                type="date"
                                                value={params.start_date || ''}
                                                onChange={(e) => onParamChange({ start_date: e.target.value })}
                                                className="h-11 bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 rounded-xl text-xs"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <span className="text-[8px] font-black uppercase tracking-tighter text-gray-400 ml-1">To</span>
                                            <Input
                                                type="date"
                                                value={params.end_date || ''}
                                                onChange={(e) => onParamChange({ end_date: e.target.value })}
                                                className="h-11 bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 rounded-xl text-xs"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400/80 font-medium italic mt-2">
                                        * All times are in UTC.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Premium Sticky Footer */}
                    <div className="p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 relative z-20">
                        <div className="flex flex-col gap-3">
                            <Button
                                variant="solid"
                                onClick={onClose}
                                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary-deep text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 group"
                            >
                                <Check className="w-4 h-4 transition-transform group-hover:scale-125" />
                                <span>Apply Filters</span>
                            </Button>

                            <Button
                                variant="plain"
                                onClick={onReset}
                                className="w-full h-12 rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Reset All</span>
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </Drawer>
    )
}
