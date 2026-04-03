'use client'

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getOrgModels, getOrgAnalytics } from '@/store/slices/orgModelLibrary'
import { injectReducer } from '@/store'
import reducer from '@/store/slices/orgModelLibrary'
import ModelLibraryHeader from './_components/ModelLibraryHeader'
import ModelStats from './_components/ModelStats'
import ModelFilters from './_components/ModelFilters'
import ModelLibraryToolbar from './_components/ModelLibraryToolbar'
import ModelList from './_components/ModelList'

// Inject reducer manually if not in static reducers, but we added it to static.
// However, the pattern in this repo seems to vary. Since I added it to staticReducers in rootReducer, 
// I don't technically need injectReducer unless it's lazy loaded. 
// Given the import in rootReducer, it's static.

export default function OrgModelLibraryPage() {
    const dispatch = useDispatch()

    useEffect(() => {
        // Fetch models and analytics on mount
        dispatch(getOrgModels() as any)
        dispatch(getOrgAnalytics() as any)
    }, [dispatch])

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-col gap-10 h-full py-6">
            <ModelLibraryHeader />
            <div className="flex flex-col gap-8 animate-in fade-in duration-500">
                <ModelStats />
                <div className="flex flex-col gap-6">
                    <ModelLibraryToolbar />
                    <ModelFilters />
                    <ModelList />
                </div>
            </div>
        </div>
    )
}
