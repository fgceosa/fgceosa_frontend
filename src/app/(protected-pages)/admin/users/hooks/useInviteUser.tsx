import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from '@/store/hook'
import { createUser } from '@/store/slices/admin/users'
import { toast, Notification } from '@/components/ui'
import type { InviteUserFormData } from '../types'

export const useInviteUser = (onSuccess?: () => void) => {
    const dispatch = useAppDispatch()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [pendingInvitation, setPendingInvitation] = useState<InviteUserFormData | null>(null)

    const formMethods = useForm<InviteUserFormData>({
        defaultValues: {
            role: null as any,
            email: '',
            name: '',
        },
    })

    const handleFormSubmit = (formData: InviteUserFormData) => {
        setPendingInvitation(formData)
        setIsConfirmDialogOpen(true)
    }

    const handleConfirmInvitation = async () => {
        if (!pendingInvitation) return
        setIsSubmitting(true)

        try {
            const names = pendingInvitation.name.split(' ')
            const firstName = names[0]
            const lastName = names.slice(1).join(' ')

            // Map form data to API request
            const requestData = {
                email: pendingInvitation.email,
                firstName,
                lastName,
                full_name: pendingInvitation.name,
                role: pendingInvitation.role?.value || 'Member',
            }

            // Dispatch Redux action
            await dispatch(createUser(requestData)).unwrap()

            setIsConfirmDialogOpen(false)
            setIsDialogOpen(false)
            setPendingInvitation(null)
            formMethods.reset()

            // Show success toast
            // Show success toast
            toast.push(
                <Notification title="User Invited Successfully" type="success" duration={3000}>
                    Invitation sent to {requestData.email}
                </Notification>
            )

            // Call onSuccess to trigger table/analytics refresh
            onSuccess?.()
        } catch (error: any) {
            console.error('Failed to send invitation:', error)
            setErrorMessage(typeof error === 'string' ? error : (error?.message || 'Failed to send invitation'))
            setIsConfirmDialogOpen(false)
            setIsErrorDialogOpen(true)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCloseDialog = () => {
        setIsDialogOpen(false)
        setIsErrorDialogOpen(false)
        formMethods.reset()
    }

    return {
        formMethods,
        isSubmitting,
        isDialogOpen,
        setIsDialogOpen,
        isConfirmDialogOpen,
        setIsConfirmDialogOpen,
        isErrorDialogOpen,
        setIsErrorDialogOpen,
        errorMessage,
        pendingInvitation,
        handleFormSubmit,
        handleConfirmInvitation,
        handleCloseDialog
    }
}
