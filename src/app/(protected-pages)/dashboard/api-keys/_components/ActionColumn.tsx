'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui'

interface ActionColumnProps {
    onDelete: () => void
}

export const ActionColumn = ({ onDelete }: ActionColumnProps) => {
    return (
        <div className="flex items-center justify-end gap-2">
            <Button
                size="xs"
                variant="plain"
                onClick={onDelete}
                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                title="Revoke API key"
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
    )
}

export default ActionColumn
