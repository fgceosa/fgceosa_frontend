'use client'

import { useState } from 'react'
import { Card, Badge, Button, Dropdown, Dialog, Notification, toast } from '@/components/ui'
import { FolderKanban, MoreVertical, Edit, Trash2, Archive, Users, Activity, Coins } from 'lucide-react'
import type { WorkspaceProject } from '../types'

interface ProjectsGridProps {
    projects: WorkspaceProject[]
    isLoading?: boolean
    onEditProject?: (project: WorkspaceProject) => void
    onDeleteProject?: (projectId: string) => void
    onArchiveProject?: (projectId: string) => void
}

export default function ProjectsGrid({
    projects,
    isLoading,
    onEditProject,
    onDeleteProject,
    onArchiveProject,
}: ProjectsGridProps) {
    const [selectedProject, setSelectedProject] = useState<WorkspaceProject | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const handleDeleteClick = (project: WorkspaceProject) => {
        setSelectedProject(project)
        setIsDeleteDialogOpen(true)
    }

    const confirmDelete = () => {
        if (selectedProject && onDeleteProject) {
            onDeleteProject(selectedProject.id)
            setIsDeleteDialogOpen(false)
            setSelectedProject(null)
        }
    }

    const getStatusBadge = (status: string) => {
        return status === 'active' ? (
            <Badge className="bg-green-100 text-green-800">Active</Badge>
        ) : (
            <Badge className="bg-gray-100 text-gray-800">Archived</Badge>
        )
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="h-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"
                    />
                ))}
            </div>
        )
    }

    if (!projects || projects.length === 0) {
        return (
            <div className="text-center py-12">
                <FolderKanban className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No projects yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Create your first project to get started
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                    <Card key={project.id} className="relative hover:shadow-lg transition-shadow">
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">{getStatusBadge(project.status)}</div>

                        {/* Project Icon */}
                        <div className="mb-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center">
                                <FolderKanban className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>

                        {/* Project Info */}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 pr-20">
                            {project.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {project.description}
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Users className="w-3 h-3 text-gray-500" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        Members
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {project.members?.length || 0}
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Activity className="w-3 h-3 text-gray-500" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        API Calls
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {(project.apiCallsCount || 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Coins className="w-3 h-3 text-gray-500" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        Credits
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                    {parseFloat(project.creditsUsed || '0').toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {project.lastActivity ? (
                                    <>Last active: {formatDate(project.lastActivity)}</>
                                ) : (
                                    <>Created: {formatDate(project.createdAt)}</>
                                )}
                            </div>

                            <Dropdown
                                placement="bottom-end"
                                renderTitle={
                                    <Button size="xs" variant="plain" icon={<MoreVertical />} />
                                }
                            >
                                <Dropdown.Item
                                    eventKey="edit"
                                    onClick={() => onEditProject && onEditProject(project)}
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Project
                                </Dropdown.Item>
                                {project.status === 'active' && (
                                    <Dropdown.Item
                                        eventKey="archive"
                                        onClick={() =>
                                            onArchiveProject && onArchiveProject(project.id)
                                        }
                                    >
                                        <Archive className="w-4 h-4 mr-2" />
                                        Archive Project
                                    </Dropdown.Item>
                                )}
                                <Dropdown.Item
                                    eventKey="delete"
                                    onClick={() => handleDeleteClick(project)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                                    <span className="text-red-600">Delete Project</span>
                                </Dropdown.Item>
                            </Dropdown>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Delete Project Confirmation Dialog */}
            <Dialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                width={400}
            >
                <h5 className="mb-4 text-xl font-semibold">Delete Project</h5>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Are you sure you want to delete <strong>{selectedProject?.name}</strong>? This
                    action cannot be undone and all project data will be permanently removed.
                </p>
                <div className="flex justify-end gap-2">
                    <Button variant="plain" onClick={() => setIsDeleteDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        onClick={confirmDelete}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Delete Project
                    </Button>
                </div>
            </Dialog>
        </>
    )
}
