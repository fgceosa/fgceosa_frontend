'use client'

import React from 'react'
import { Select, Tabs } from '@/components/ui'
import { HiOutlineFilter } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import {
    setFilterProvider,
    setFilterCapability,
    setFilterCategory,
    setSortBy
} from '@/store/slices/orgModelLibrary'
import {
    selectOrgModelSortBy,
    selectOrgModelFilterCategory
} from '@/store/slices/orgModelLibrary/selectors'

const { TabNav, TabList } = Tabs

const ModelFilters = () => {
    const dispatch = useDispatch()
    const sortBy = useSelector(selectOrgModelSortBy)
    const filterCategory = useSelector(selectOrgModelFilterCategory)

    const sortOptions = [
        { value: 'recommended', label: 'Recommended' },
        { value: 'cost_asc', label: 'Lowest Cost' },
        { value: 'popularity', label: 'Most Popular' },
    ]

    return (
        <div className="flex flex-col gap-4 bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <Tabs
                    value={filterCategory}
                    className="w-full md:w-auto"
                    onChange={(val) => dispatch(setFilterCategory(val as any))}
                >
                    <TabList>
                        <TabNav value="text">Text Models</TabNav>
                        <TabNav value="embeddings">Embeddings</TabNav>
                    </TabList>
                </Tabs>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Select
                        className="w-40"
                        placeholder="Sort by"
                        options={sortOptions}
                        value={sortOptions.find(o => o.value === sortBy)}
                        onChange={(opt) => dispatch(setSortBy(opt?.value as any))}
                    />
                </div>
            </div>

            {/* Extended filters could go here */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <HiOutlineFilter />
                <span>Filters: </span>
                <span className="cursor-pointer hover:text-primary transition-colors">All Providers</span>
                <span>•</span>
                <span className="cursor-pointer hover:text-primary transition-colors">Any Capability</span>
            </div>
        </div>
    )
}

export default ModelFilters
