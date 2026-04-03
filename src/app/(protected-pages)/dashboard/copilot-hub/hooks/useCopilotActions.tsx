import { useCallback, Dispatch, SetStateAction } from 'react'
import { toast, Notification } from '@/components/ui'
import { Copilot } from '../types'
import {
    apiDeleteCopilot,
    apiDuplicateCopilot,
    apiToggleCopilotVisibility,
    apiShareCopilot,
} from '@/services/CopilotService'

interface UseCopilotActionsProps {
    refreshAll: () => void
    setCopilots: Dispatch<SetStateAction<Copilot[]>>
    setMyCopilots: Dispatch<SetStateAction<Copilot[]>>
}

export function useCopilotActions({ refreshAll, setCopilots, setMyCopilots }: UseCopilotActionsProps): {
    deleteCopilot: (copilot: Copilot) => Promise<boolean>;
    duplicateCopilot: (copilot: Copilot) => Promise<boolean>;
    toggleVisibility: (copilot: Copilot) => Promise<boolean>;
    shareCopilot: (copilot: Copilot, emails: string[], message: string) => Promise<boolean>;
} {

    const deleteCopilot = useCallback(async (copilot: Copilot) => {
        try {
            await apiDeleteCopilot(copilot.id)
            toast.push(
                <Notification title="Success" type="success" >
                    Copilot "{copilot.name}" deleted successfully.
                </Notification>
            )
            refreshAll()
            return true
        } catch (err: any) {
            console.error('Failed to delete copilot:', err)
            let errorMessage = err?.response?.data?.message || err?.response?.data?.detail || err?.message || 'Please try again.'

            if (err?.response?.status === 403 && !err?.response?.data?.message && !err?.response?.data?.detail) {
                errorMessage = "You do not have administrative clearance to decommission this copilot. Only the platform super admin can perform this action."
            }

            toast.push(
                <Notification title="Error" type="danger" >
                    Failed to delete copilot. {errorMessage}
                </Notification>
            )
            return false
        }
    }, [refreshAll])

    const duplicateCopilot = useCallback(async (copilot: Copilot) => {
        try {
            const duplicatedCopilot = await apiDuplicateCopilot(copilot.id)
            toast.push(
                <Notification title="Success" type="success" >
                    Copilot "{copilot.name}" duplicated successfully as "{duplicatedCopilot.name}".
                </Notification>
            )
            refreshAll()
            return true
        } catch (err: any) {
            console.error('Failed to duplicate copilot:', err)
            const errorMessage = err?.response?.data?.message || err?.response?.data?.detail || err?.message || 'Please try again.'
            toast.push(
                <Notification title="Error" type="danger" >
                    Failed to duplicate copilot. {errorMessage}
                </Notification>
            )
            return false
        }
    }, [refreshAll])

    const toggleVisibility = useCallback(async (copilot: Copilot) => {
        try {
            const newVisibility = copilot.visibility === 'public' ? 'private' : 'public'
            const updatedCopilot = await apiToggleCopilotVisibility(copilot.id, newVisibility)

            toast.push(
                <Notification title="Success" type="success" >
                    Copilot visibility changed to {newVisibility}.
                </Notification>
            )

            // Optimistic update
            setCopilots(prev => prev.map(c => c.id === copilot.id ? updatedCopilot : c))
            setMyCopilots(prev => prev.map(c => c.id === copilot.id ? updatedCopilot : c))
            return true
        } catch (err: any) {
            console.error('Failed to toggle visibility:', err)
            const errorMessage = err?.response?.data?.message || err?.response?.data?.detail || err?.message || 'Please try again.'
            toast.push(
                <Notification title="Error" type="danger" >
                    Failed to change visibility. {errorMessage}
                </Notification>
            )
            return false
        }
    }, [setCopilots, setMyCopilots])

    const shareCopilot = useCallback(async (copilot: Copilot, emails: string[], message: string) => {
        try {
            console.log('Attempting to share copilot:', {
                copilotId: copilot.id,
                emails,
                message,
            })

            const result = await apiShareCopilot(copilot.id, {
                emails,
                message,
            })

            console.log('Share successful:', result)

            toast.push(
                <Notification title="Success" type="success" >
                    Copilot "{copilot.name}" shared successfully.
                </Notification>
            )
            return true
        } catch (err: any) {
            console.error('Failed to share copilot - Full error:', err)

            const errorMessage =
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                err?.message ||
                'Please try again.'

            toast.push(
                <Notification title="Error" type="danger" >
                    Failed to share copilot. {errorMessage}
                </Notification>
            )
            return false
        }
    }, [])

    return {
        deleteCopilot,
        duplicateCopilot,
        toggleVisibility,
        shareCopilot
    }
}
