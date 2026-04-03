'use client'

import { useRouter } from 'next/navigation'
import { Card, Button } from '@/components/ui'
import { BarChart2, Edit, Trash2, Key, Zap } from 'lucide-react'
import type { Project } from '../types'
import { PROJECT_TYPE_OPTIONS } from '../constants'
import classNames from '@/utils/classNames'

interface ProjectCardProps {
    project: Project
    onEdit: () => void
    onDelete: () => void
}

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
    const router = useRouter()

    // Get type label
    const typeLabel = PROJECT_TYPE_OPTIONS.find(
        (opt) => opt.value === project.type
    )?.label || project.type

    // Calculate usage percentage (mock for now, can be replaced with actual data)
    const usagePercentage = project.usageThisMonth
        ? Math.min((project.usageThisMonth / 100000) * 100, 100)
        : 0

    const handleViewUsage = () => {
        router.push(`/dashboard/projects/${project.id}/usage`)
    }

    return (
        <Card className="group relative flex flex-col h-full p-0 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />

            <div className="p-6 flex flex-col flex-1 relative z-10">
                {/* Header Section */}
                <div className="space-y-4 mb-6">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <h4 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                {project.name}
                            </h4>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 rounded-lg bg-gray-50 dark:bg-gray-800 text-[9px] font-black text-gray-400 border border-gray-100 dark:border-gray-700">
                                    {typeLabel}
                                </span>
                                <div className={classNames(
                                    "flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black border transition-all duration-300",
                                    project.status === 'active'
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                                        : "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                                )}>
                                    <div className={classNames("w-1.5 h-1.5 rounded-full animate-pulse", project.status === 'active' ? "bg-emerald-500" : "bg-amber-500")} />
                                    {project.status.replace('_', ' ')}
                                </div>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-primary/5 dark:bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/10 transition-all group-hover:scale-110 group-hover:rotate-3">
                            <BarChart2 className="w-6 h-6 text-primary" />
                        </div>
                    </div>

                    {project.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed line-clamp-2 italic opacity-80">
                            {project.description}
                        </p>
                    )}
                </div>

                {/* Body Content */}
                <div className="space-y-4 flex-1">
                    {/* Linked Asset */}
                    {project.apiKeyId && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-[1.8rem] border border-gray-100 dark:border-gray-800 transition-all group-hover:bg-white dark:group-hover:bg-gray-800 group-hover:shadow-lg group-hover:shadow-gray-200/20">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-400 flex items-center gap-2">
                                    <Key className="w-3.5 h-3.5" />
                                    Linked API Key
                                </span>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700">
                                    <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 font-mono">{project.apiKeyName}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Usage Analytics */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-end justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-black text-gray-900 dark:text-gray-100 block">Project Usage</span>
                                <span className="text-lg font-black text-gray-900 dark:text-white">
                                    {project.usageThisMonth?.toLocaleString() || 0}
                                    <span className="text-xs text-gray-400 ml-1 font-bold">/ 100K</span>
                                </span>
                            </div>
                            <span className="text-xs font-black text-primary bg-primary/5 px-2 py-1 rounded-lg">
                                {usagePercentage.toFixed(1)}%
                            </span>
                        </div>
                        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden border border-gray-50 dark:border-gray-700 p-0.5">
                            <div
                                className="h-full bg-primary transition-all duration-1000 ease-out rounded-full shadow-lg shadow-primary/20"
                                style={{ width: `${usagePercentage}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Interactive Footer */}
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <Button
                        onClick={handleViewUsage}
                        variant="default"
                        className="h-11 px-5 bg-primary/5 hover:bg-primary text-primary hover:text-white font-black text-[10px] rounded-xl border border-primary/10 hover:border-primary transition-all duration-500 flex items-center gap-2.5 group/btn overflow-hidden relative"
                        title="View Analytics"
                    >
                        <div className="relative z-10 flex items-center gap-2.5">
                            <Zap className="w-3.5 h-3.5 transition-transform duration-500 group-hover/btn:rotate-12 group-hover/btn:scale-110" />
                            <span>View Stats</span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-deep/0 via-white/10 to-primary-deep/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                    </Button>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="default"
                            size="sm"
                            className="h-11 w-11 p-0 rounded-xl font-bold bg-gray-50 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300 flex items-center justify-center group/edit"
                            onClick={onEdit}
                            title="Edit Project"
                        >
                            <Edit className="w-4 h-4 text-gray-400 group-hover/edit:text-primary transition-colors" />
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            className="h-11 w-11 p-0 rounded-xl font-bold bg-rose-50/50 dark:bg-rose-900/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-100 dark:border-rose-900/20 hover:border-rose-500 transition-all duration-300 flex items-center justify-center group/del"
                            onClick={onDelete}
                            title="Delete Project"
                        >
                            <Trash2 className="w-4 h-4 transition-transform group-hover/del:scale-110" />
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}
