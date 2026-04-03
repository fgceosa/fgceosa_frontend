'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hook'
import { fetchProjects } from '@/store/slices/projects'
import ProjectsHeader from './_components/ProjectsHeader'
import ProjectsList from './_components/ProjectsList'

export default function Page() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        // Fetch projects on mount
        dispatch(fetchProjects({}))
    }, [dispatch])

    const handleProjectCreated = () => {
        // Refresh data after creating new project
        dispatch(fetchProjects({}))
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5] dark:bg-gray-900/50 p-4 sm:p-8 overflow-x-hidden">
            <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-700 font-sans">
                {/* Enterprise Header */}
                <ProjectsHeader onProjectCreated={handleProjectCreated} />

                {/* Background Decoration */}
                <div className="relative">
                    <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full opacity-50 pointer-events-none" />

                    <ProjectsList />
                </div>
            </div>
        </div>
    )
}
