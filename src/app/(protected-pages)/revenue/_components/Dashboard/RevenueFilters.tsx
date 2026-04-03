'use client'

import React from 'react'
import Select from '@/components/ui/Select'
import { Card } from '@/components/ui'
import { ListFilter } from 'lucide-react'

interface RevenueFiltersProps {
    onPeriodChange: (period: string) => void
}

/**
 * RevenueFilters - A horizontal filter bar for refining the displayed revenue data.
 * Supports filtering by workspace, AI model, and data period.
 */
export default function RevenueFilters({ onPeriodChange }: RevenueFiltersProps) {
    // Portal target for dropdown menus to prevent clipping
    const portalTarget = typeof document !== 'undefined' ? document.body : null
    const menuStyles = { menuPortal: (base: any) => ({ ...base, zIndex: 9999 }) }

    return (
        <Card className="px-8 py-4 md:py-5 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 transition-all hover:border-primary/10 group mb-4">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                {/* Section Title & Icon */}
                <div className="flex items-center gap-4 mr-auto">
                    <div className="p-3 bg-primary/5 dark:bg-primary/20 rounded-2xl border border-primary/20 shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-700 group-hover:rotate-6">
                        <ListFilter size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-black text-primary">Quick Filters</span>
                        <span className="text-[9px] font-bold text-gray-400 mt-0.5">Refine and sort revenue data</span>
                    </div>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap lg:flex-nowrap gap-5 w-full lg:w-auto">
                    {/* Workspace Filter */}
                    <div className="flex flex-col gap-2 flex-1 md:flex-none md:min-w-[200px]">
                        <div className="flex items-center gap-2 pl-1">
                            <div className="w-1 h-3 bg-primary/40 rounded-full" />
                            <label className="text-[9px] font-black text-gray-400">Workspaces</label>
                        </div>
                        <Select
                            size="sm"
                            className="rounded-xl border-gray-100 dark:border-gray-800 font-bold text-[11px]"
                            placeholder="Select Workspace"
                            defaultValue={{ value: 'all', label: 'All Workspaces' }}
                            menuPortalTarget={portalTarget}
                            styles={menuStyles}
                            options={[
                                { value: 'all', label: 'All Workspaces' },
                                { value: 'techflow', label: 'TechFlow Solutions' },
                                { value: 'globaldata', label: 'Global Data Corp' },
                            ]}
                            onChange={(option: any) => console.log('Filter by workspace:', option?.value)}
                        />
                    </div>

                    {/* AI Model Filter */}
                    <div className="flex flex-col gap-2 flex-1 md:flex-none md:min-w-[200px]">
                        <div className="flex items-center gap-2 pl-1">
                            <div className="w-1 h-3 bg-emerald-400/40 rounded-full" />
                            <label className="text-[9px] font-black text-gray-400">AI Models</label>
                        </div>
                        <Select
                            size="sm"
                            className="rounded-xl border-gray-100 dark:border-gray-800 font-bold text-[11px]"
                            placeholder="Select Model"
                            defaultValue={{ value: 'all', label: 'All Models' }}
                            menuPortalTarget={portalTarget}
                            styles={menuStyles}
                            options={[
                                { value: 'all', label: 'All Models' },
                                { value: 'gpt4', label: 'GPT-4o' },
                                { value: 'claude35', label: 'Claude 3.5' },
                            ]}
                            onChange={(option: any) => console.log('Filter by model:', option?.value)}
                        />
                    </div>

                    {/* Time Period Filter */}
                    <div className="flex flex-col gap-2 flex-1 md:flex-none md:min-w-[200px]">
                        <div className="flex items-center gap-2 pl-1">
                            <div className="w-1 h-3 bg-amber-400/40 rounded-full" />
                            <label className="text-[9px] font-black text-gray-400">Data Period</label>
                        </div>
                        <Select
                            size="sm"
                            className="rounded-xl border-gray-100 dark:border-gray-800 font-bold text-[11px]"
                            placeholder="Select Period"
                            defaultValue={{ value: 'monthly', label: 'Last 30 Days' }}
                            menuPortalTarget={portalTarget}
                            styles={menuStyles}
                            options={[
                                { value: 'weekly', label: 'Last 7 Days' },
                                { value: 'monthly', label: 'Last 30 Days' },
                                { value: 'half-year', label: 'Last 6 Months' },
                                { value: 'annually', label: 'Last Year' },
                            ]}
                            onChange={(option: any) => onPeriodChange(option?.value)}
                        />
                    </div>
                </div>
            </div>
        </Card>
    )
}
