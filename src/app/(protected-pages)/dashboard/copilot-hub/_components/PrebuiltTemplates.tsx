'use client'

import React from 'react'
import CopilotCard from './CopilotCard'
import type { Copilot } from '../types'

interface PrebuiltTemplatesProps {
    copilots: Copilot[]
    onCopilotClick: (copilot: Copilot) => void
    onStartChat: (copilot: Copilot) => void
    onDuplicateCopilot?: (copilot: Copilot) => void
}

export default function PrebuiltTemplates({
    copilots,
    onCopilotClick,
    onStartChat,
    onDuplicateCopilot,
}: PrebuiltTemplatesProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {copilots.map((copilot) => (
                <CopilotCard
                    key={copilot.id}
                    copilot={copilot}
                    viewMode="grid"
                    onClick={() => onCopilotClick(copilot)}
                    onStartChat={() => onStartChat(copilot)}
                    onDuplicate={() => onDuplicateCopilot?.(copilot)}
                    onEdit={() => { }} // Prebuilt templates shouldn't show edit for all users typically
                />
            ))}
        </div>
    )
}
