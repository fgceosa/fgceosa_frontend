'use client'

import React from 'react'
import { Card, Button, Avatar } from '@/components/ui'
import { Pencil, Building2 } from 'lucide-react'
import type { Workspace } from '../types'
import { config } from '@/configs/env'

interface WorkspaceInfoCardProps {
    workspace: Workspace
    onEdit: () => void
}

const getAvatarUrl = (avatarPath: string | null | undefined): string | null => {
    if (!avatarPath) return null
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
        return avatarPath
    }
    const apiUrl = config.apiUrl || ''
    return `${apiUrl}${avatarPath}`
}

export default function WorkspaceInfoCard({ workspace, onEdit }: WorkspaceInfoCardProps) {
    const avatarUrl = getAvatarUrl(workspace.avatar)

    return (
        <Card className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-gray-200/50 dark:shadow-none animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <Avatar
                            size={72}
                            className="ring-4 ring-primary/10 shadow-lg"
                            src={avatarUrl || undefined}
                            icon={<Building2 className="w-8 h-8" />}
                        />
                        <button
                            onClick={onEdit}
                            className="absolute -right-1 -bottom-1 p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 hover:scale-110 transition-transform text-primary"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100">
                                {workspace.name}
                            </h2>
                            <button
                                onClick={onEdit}
                                className="text-gray-400 hover:text-primary transition-colors"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-gray-400">
                                Workspace ID:
                            </span>
                            <code className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-md">
                                {workspace.id.split('-')[0]}-{workspace.id.split('-')[1] || '0000'}
                            </code>
                        </div>
                    </div>
                </div>

                <Button
                    variant="plain"
                    onClick={onEdit}
                    icon={<Pencil className="w-4 h-4" />}
                    className="h-12 px-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-700 dark:text-gray-300 font-bold text-sm shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-750 transition-all flex items-center gap-2"
                >
                    Edit Workspace
                </Button>
            </div>
        </Card>
    )
}
