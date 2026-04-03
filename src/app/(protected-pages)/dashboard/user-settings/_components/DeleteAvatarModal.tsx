'use client'

import { Dialog, Button } from '@/components/ui'
import { AlertCircle } from 'lucide-react'

interface DeleteAvatarModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    isDeleting: boolean
}

export default function DeleteAvatarModal({
    isOpen,
    onClose,
    onConfirm,
    isDeleting,
}: DeleteAvatarModalProps) {
    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={480}
            closable={!isDeleting}
        >
            <div className="bg-white dark:bg-neutral-900 rounded-xl w-full space-y-4">
                {/* Alert Icon */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>

                {/* Title and Message */}
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Remove Profile Picture</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Are you sure you want to remove your profile picture?
                        You can upload a new one anytime.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 mt-6">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="solid"
                        size="sm"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        loading={isDeleting}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isDeleting ? 'Removing...' : 'Remove Picture'}
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}
