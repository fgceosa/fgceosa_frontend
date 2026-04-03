'use client'

import React from 'react'
import { Search, ListFilter, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { Input, Button, Dropdown } from '@/components/ui'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchQuery, getOrgModels } from '@/store/slices/orgModelLibrary'
import { selectOrgModelSearchQuery, selectOrgModelsLoading } from '@/store/slices/orgModelLibrary/selectors'
import { useAppDispatch } from '@/store'
import debounce from 'lodash/debounce'

export default function ModelLibraryToolbar() {
    const dispatch = useAppDispatch()
    const searchQuery = useSelector(selectOrgModelSearchQuery)
    const isLoading = useSelector(selectOrgModelsLoading)

    // Debounced search to avoid excessive API calls
    const debouncedSearch = React.useCallback(
        debounce((query: string) => {
            dispatch(getOrgModels(query) as any)
        }, 500),
        [dispatch]
    )

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value
        dispatch(setSearchQuery(query))
        debouncedSearch(query)
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-6 relative group">
            {/* Hover Accent */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                {/* Search Implementation */}
                <div className="relative w-full lg:flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                        placeholder="Search models by name, provider or description..."
                        value={searchQuery}
                        className="pl-12 h-14 bg-gray-50/50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-primary/20 focus:border-primary text-sm shadow-inner transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-750 font-medium"
                        onChange={handleSearchChange}
                    />
                    {isLoading && (
                        <div className="absolute inset-y-0 right-4 flex items-center">
                            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    {/* Advanced Filters Trigger */}
                    <Button
                        variant="plain"
                        size="sm"
                        className="h-14 px-6 bg-gray-50/80 dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-all font-bold text-[10px] uppercase tracking-widest w-full sm:w-auto"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        More Filters
                    </Button>

                    <Button
                        variant="solid"
                        className="h-14 px-8 bg-primary hover:bg-primary-deep text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 group w-full sm:w-auto"
                    >
                        <ArrowUpDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                        Sort Settings
                    </Button>
                </div>
            </div>
        </div>
    )
}
