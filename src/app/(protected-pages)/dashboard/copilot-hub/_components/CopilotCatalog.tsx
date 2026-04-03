'use client'

import { Search } from 'lucide-react'
import CopilotCard from './CopilotCard'
import type { Copilot } from '../types'
import QorebitLoading from '@/components/shared/QorebitLoading'

interface CopilotCatalogProps {
    copilots: Copilot[]
    viewMode: 'grid' | 'list'
    currentUserId?: string
    isLoading?: boolean
    onCopilotClick: (copilot: Copilot) => void
    onStartChat: (copilot: Copilot) => void
    onEditCopilot?: (copilot: Copilot) => void
    onDeleteCopilot?: (copilot: Copilot) => void
    onDuplicateCopilot?: (copilot: Copilot) => void
    onShareCopilot?: (copilot: Copilot) => void
    onToggleVisibility?: (copilot: Copilot) => void
    onAssignToWorkspace?: (copilot: Copilot) => void

}

export default function CopilotCatalog({
    copilots,
    viewMode,
    currentUserId,
    isLoading,
    onCopilotClick,
    onStartChat,
    onEditCopilot,
    onDeleteCopilot,
    onDuplicateCopilot,
    onShareCopilot,
    onToggleVisibility,
    onAssignToWorkspace,

}: CopilotCatalogProps) {
    if (isLoading) {
        return <QorebitLoading />
    }

    if (copilots.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                    <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No copilots found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                    Try adjusting your search or filters to find what you're looking for, or create a new copilot.
                </p>
            </div>
        )
    }

    if (viewMode === 'list') {
        return (
            <div className="space-y-3">
                {copilots.map((copilot) => (
                    <CopilotCard
                        key={copilot.id}
                        copilot={copilot}
                        viewMode={viewMode}
                        currentUserId={currentUserId}
                        onClick={() => onCopilotClick(copilot)}
                        onStartChat={() => onStartChat(copilot)}
                        onEdit={onEditCopilot ? () => onEditCopilot(copilot) : undefined}
                        onDuplicate={() => onDuplicateCopilot?.(copilot)}
                        onDelete={() => onDeleteCopilot?.(copilot)}
                        onShare={() => onShareCopilot?.(copilot)}
                        onToggleVisibility={() => onToggleVisibility?.(copilot)}
                        onAssignToWorkspace={() => onAssignToWorkspace?.(copilot)}

                    />
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {copilots.map((copilot) => (
                <CopilotCard
                    key={copilot.id}
                    copilot={copilot}
                    viewMode={viewMode}
                    currentUserId={currentUserId}
                    onClick={() => onCopilotClick(copilot)}
                    onStartChat={() => onStartChat(copilot)}
                    onEdit={onEditCopilot ? () => onEditCopilot(copilot) : undefined}
                    onDuplicate={() => onDuplicateCopilot?.(copilot)}
                    onDelete={() => onDeleteCopilot?.(copilot)}
                    onShare={() => onShareCopilot?.(copilot)}
                    onToggleVisibility={() => onToggleVisibility?.(copilot)}
                    onAssignToWorkspace={() => onAssignToWorkspace?.(copilot)}

                />
            ))}
        </div>
    )
}
