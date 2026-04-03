'use client'

import React from 'react'
import classNames from '@/utils/classNames'
import { Filter, Users } from 'lucide-react'
import { VscSearch } from 'react-icons/vsc'
import { Input, Select } from '@/components/ui'
import DebouceInput from '@/components/shared/DebouceInput'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { useSearchParams } from 'next/navigation'
import { useUserFilters } from '../hooks/useUserFilters'

/**
 * UserManagementTabs - Handles tabbed filtering and search for the user directory
 */
export default function UserManagementTabs() {
    const { activeTab, handleTabChange, tabs, activeRole, activeDate, handleRoleChange, handleDateChange, total } = useUserFilters()
    const { onAppendQueryParams } = useAppendQueryParams()
    const searchParams = useSearchParams()
    const query = searchParams.get('query') || ''

    const handleSearchChange = (val: string) => {
        onAppendQueryParams({
            query: val,
            pageIndex: 1,
        })
    }

    return (
        <div className="space-y-8 mb-10">
            {/* Tabs Row */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center overflow-x-auto no-scrollbar -mb-[1px]">
                    {tabs.map((tab: { label: string; value: string; count: number }) => (
                        <button
                            key={tab.value}
                            onClick={() => handleTabChange(tab.value)}
                            className={classNames(
                                "flex items-center gap-2 px-6 py-4 text-[13px] font-black transition-all duration-300 border-b-2",
                                activeTab === tab.value
                                    ? "text-primary border-primary"
                                    : "text-gray-400 border-transparent hover:text-gray-600 dark:hover:text-gray-200"
                            )}
                        >
                            {tab.label}
                            <span className={classNames(
                                "px-2 py-0.5 rounded-lg text-[10px] font-black",
                                activeTab === tab.value
                                    ? "bg-primary/10 text-primary"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                            )}>
                                {tab.count.toLocaleString()}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Redesigned Search and Filter Container */}
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-6 relative group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]" />
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-4">
                    {/* Search Input */}
                    <div className="relative w-full flex-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <VscSearch className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        </div>
                        <DebouceInput
                            placeholder="Search by name, email, or role..."
                            className="pl-11 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-primary/20 focus:border-primary text-sm shadow-inner transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-750"
                            value={query}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>

                    {/* Filters Group */}
                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <div className="w-full sm:w-44">
                            <Select
                                size="md"
                                placeholder="User Role"
                                isSearchable={false}
                                menuPosition="fixed"
                                value={[
                                    { label: 'Admin', value: 'admin' },
                                    { label: 'Member', value: 'member' },
                                ].find(opt => opt.value === activeRole)}
                                options={[
                                    { label: 'All Roles', value: 'all' },
                                    { label: 'Admin', value: 'admin' },
                                    { label: 'Member', value: 'member' },
                                ]}
                                onChange={(opt) => handleRoleChange(opt?.value || 'all')}
                            />
                        </div>
                        <div className="w-full sm:w-44">
                            <Select
                                size="md"
                                placeholder="Activity"
                                isSearchable={false}
                                menuPosition="fixed"
                                value={[
                                    { label: 'Last 24h', value: 'today' },
                                    { label: 'Last 7d', value: 'week' },
                                    { label: 'Last 30d', value: 'month' },
                                ].find(opt => opt.value === activeDate)}
                                options={[
                                    { label: 'Anytime', value: 'all' },
                                    { label: 'Last 24h', value: 'today' },
                                    { label: 'Last 7d', value: 'week' },
                                    { label: 'Last 30d', value: 'month' },
                                ]}
                                onChange={(opt) => handleDateChange(opt?.value || 'all')}
                            />
                        </div>

                        <div className="hidden sm:flex px-4 py-2 bg-primary/5 rounded-xl border border-primary/10 shrink-0 items-center gap-2">
                            <Users size={14} className="text-primary" />
                            <span className="text-[10px] font-black text-primary whitespace-nowrap">
                                {total || 0} Total
                            </span>
                        </div>

                        <button className="flex items-center justify-center p-3 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all border border-gray-200 dark:border-gray-800 lg:shrink-0">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
