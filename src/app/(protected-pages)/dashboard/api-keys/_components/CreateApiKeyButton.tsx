'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import classNames from '@/utils/classNames'
import { Button } from '@/components/ui'
import ApiKeyCreationFlow from './ApiKeyCreationFlow'

interface CreateApiKeyButtonProps {
    onSuccess?: () => void
    className?: string
    size?: 'sm' | 'md' | 'lg'
}

export default function CreateApiKeyButton({
    onSuccess,
    className,
    size = 'sm',
}: CreateApiKeyButtonProps) {
    const [isCreationFlowOpen, setIsCreationFlowOpen] = useState(false)

    const handleSuccess = () => {
        onSuccess?.()
    }

    return (
        <>
            <Button
                variant="solid"
                className={classNames(
                    "flex items-center justify-center gap-2 rounded-xl transition-all duration-300",
                    "bg-primary hover:bg-primary-deep text-white shadow-xl shadow-primary/25",
                    "font-bold text-[10px] h-11 px-6",
                    className
                )}
                onClick={() => setIsCreationFlowOpen(true)}
            >
                <Plus className="w-4 h-4" />
                <span>Create API Key</span>
            </Button>

            <ApiKeyCreationFlow
                open={isCreationFlowOpen}
                onClose={() => setIsCreationFlowOpen(false)}
                onSuccess={handleSuccess}
            />
        </>
    )
}
