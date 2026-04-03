'use client'

import { useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card } from '@/components/ui'
import { BarChart2 } from 'lucide-react'
import {
    selectProjects,
    selectListLoading,
    fetchProjects,
} from '@/store/slices/projects'
import ProjectCard from './ProjectCard'
import DeleteProjectModal from './DeleteProjectModal'
import EditProjectModal from './EditProjectModal'
import ProjectsSummary from './ProjectsSummary'
import SearchTableTools from '@/components/shared/TableTools/SearchTableTools'
import type { Project } from '../types'

export default function ProjectsList() {
    const dispatch = useDispatch()
    const projects = useSelector(selectProjects)
    const isLoading = useSelector(selectListLoading)

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleEdit = useCallback((project: Project) => {
        setSelectedProject(project)
        setEditModalOpen(true)
    }, [])

    const handleDelete = useCallback((project: Project) => {
        setSelectedProject(project)
        setDeleteConfirmationOpen(true)
    }, [])

    const handleCancelDelete = useCallback(() => {
        if (isDeleting) return
        setDeleteConfirmationOpen(false)
        setSelectedProject(null)
    }, [isDeleting])

    const handleConfirmDelete = useCallback(async () => {
        if (!selectedProject) return
        setIsDeleting(true)
        // Deletion handled by DeleteProjectModal
    }, [selectedProject])

    const setDeletingState = (state: boolean) => {
        setIsDeleting(state)
        if (!state) {
            setDeleteConfirmationOpen(false)
            setSelectedProject(null)
        }
    }

    const handleEditSuccess = () => {
        setEditModalOpen(false)
        setSelectedProject(null)
        // Refresh projects list
        dispatch(fetchProjects({}) as any)
    }

    const handleCloseEdit = () => {
        setEditModalOpen(false)
        setSelectedProject(null)
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse space-y-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-[2rem]" />
                <div className="h-6 w-32 bg-gray-100 dark:bg-gray-800 rounded-full" />
                <div className="h-4 w-48 bg-gray-50 dark:bg-gray-900 rounded-full" />
            </div>
        )
    }

    return (
        <div className="space-y-12">
            <ProjectsSummary />

            <div className="relative z-10 space-y-8">
                {/* Search & Filters */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-4 sm:p-6">
                    <SearchTableTools placeholder="Search projects by name, description, or type..." />
                </div>

                {projects.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-100 dark:border-gray-800 bg-transparent shadow-none rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        <div className="w-24 h-24 bg-primary/5 rounded-[32px] flex items-center justify-center mb-6 relative">
                            <BarChart2 className="w-12 h-12 text-primary opacity-20" />
                            <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full opacity-20 animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">No Projects Found</h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm text-center leading-relaxed italic">
                            Your project list is empty. Add your first project to start organizing your work.
                        </p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onEdit={() => handleEdit(project)}
                                onDelete={() => handleDelete(project)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <EditProjectModal
                open={editModalOpen}
                project={selectedProject}
                onClose={handleCloseEdit}
                onSuccess={handleEditSuccess}
            />

            <DeleteProjectModal
                isOpen={deleteConfirmationOpen}
                project={selectedProject}
                onClose={handleCancelDelete}
                setIsDeleting={setDeletingState}
                isDeleting={isDeleting}
            />
        </div>
    )
}
