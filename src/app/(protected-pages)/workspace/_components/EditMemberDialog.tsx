'use client'

import { useState, useEffect } from 'react'
import { Dialog, Input, Button, Notification, toast } from '@/components/ui'
import { Edit, CreditCard } from 'lucide-react'
import type { WorkspaceMember } from '../types'

interface EditMemberDialogProps {
    isOpen: boolean
    onClose: () => void
    member: WorkspaceMember | null
    onSave: (memberId: string, data: { creditsAllocated: number }) => Promise<void>
    isLoading?: boolean
}

export default function EditMemberDialog({
    isOpen,
    onClose,
    member,
    onSave,
    isLoading,
}: EditMemberDialogProps) {
    const [creditsAllocated, setCreditsAllocated] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (member) {
            setCreditsAllocated(member.creditsAllocated?.toString() || '0')
        }
    }, [member])

    const handleSubmit = async () => {
        if (!member) return

        const credits = parseFloat(creditsAllocated)
        if (isNaN(credits) || credits < 0) {
            toast.push(
                <Notification type="warning" duration={2000}>
                    Please enter a valid credit amount
                </Notification>,
            )
            return
        }

        setIsSubmitting(true)
        try {
            await onSave(member.id, { creditsAllocated: credits })
            toast.push(
                <Notification type="success" duration={2000}>
                    Member updated successfully
                </Notification>,
            )
            onClose()
        } catch (error) {
            // Error handled by parent
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!member) return null

    return (
        <Dialog isOpen={isOpen} onClose={onClose} width={500}>
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40">
                        <Edit className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h5 className="text-xl font-semibold">Edit Member</h5>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Update member settings for {member.name}
                </p>
            </div>

            <div className="space-y-5">
                {/* Member Info (Read Only) */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                            {member.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                {member.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {member.email}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Credits Allocated */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        <CreditCard className="w-4 h-4 inline mr-2" />
                        Credits Allocated
                    </label>
                    <Input
                        type="number"
                        placeholder="0.00"
                        value={creditsAllocated}
                        onChange={(e) => setCreditsAllocated(e.target.value)}
                        min="0"
                        step="0.01"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        The amount of credits this member can use from the workspace pool
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="plain" onClick={onClose} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button
                    variant="solid"
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    disabled={isLoading}
                >
                    Save Changes
                </Button>
            </div>
        </Dialog>
    )
}
