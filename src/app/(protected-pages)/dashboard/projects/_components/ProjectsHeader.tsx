'use client'

import { useState } from 'react'
import { Plus, BarChart2 } from 'lucide-react'
import { Button } from '@/components/ui'
import CreateProjectModal from './CreateProjectModal'

interface ProjectsHeaderProps {
    onProjectCreated?: () => void
}

export default function ProjectsHeader({ onProjectCreated }: ProjectsHeaderProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    const handleSuccess = () => {
        onProjectCreated?.()
    }

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="space-y-3 lg:space-y-1">
                <div className="flex items-center gap-3 sm:gap-4 mb-2">
                    <span className="text-[9px] sm:text-[10px] font-black text-primary whitespace-nowrap">Administration</span>
                    <div className="h-px w-8 sm:w-12 bg-primary/20" />
                    <span className="text-[9px] sm:text-[10px] font-black text-gray-400 whitespace-nowrap">Projects</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 sm:p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shrink-0">
                        <BarChart2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 dark:text-white">
                        My Projects
                    </h1>
                </div>
                <p className="text-sm sm:text-base lg:text-lg text-gray-500 dark:text-gray-400 lg:pl-14 font-medium max-w-2xl leading-relaxed">
                    Manage your AI projects, track resource usage, and control deployments in one place.
                </p>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
                <Button
                    variant="solid"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="h-12 sm:h-14 px-6 sm:px-8 bg-primary hover:bg-primary-deep text-white font-black text-[10px] sm:text-[11px] rounded-xl sm:rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 sm:gap-3 group overflow-hidden relative w-full sm:w-auto"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        New Project
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Button>
            </div>

            <CreateProjectModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleSuccess}
            />
        </div>
    )
}
