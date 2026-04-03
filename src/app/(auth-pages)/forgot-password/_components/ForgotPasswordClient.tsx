'use client'

import { apiForgotPassword } from '@/services/AuthService'
import ForgotPassword from '@/components/auth/ForgotPassword'
import { toast, Notification } from '@/components/ui'
import type { OnForgotPasswordSubmitPayload } from '@/components/auth/ForgotPassword'

import { useSearchParams } from 'next/navigation'

const ForgotPasswordClient = () => {
    const searchParams = useSearchParams()
    const isPostLogout = searchParams.get('logout') === 'true'
    const signInUrl = isPostLogout ? '/sign-in?logout=true' : '/sign-in'

    const handleForgotPasswordSubmit = async ({
        values,
        setSubmitting,
        setMessage,
        setEmailSent,
    }: OnForgotPasswordSubmitPayload) => {
        try {
            setSubmitting(true)
            await apiForgotPassword(values)
            toast.push(
                <Notification title="Email sent!" type="success">
                    We have sent you an email to reset your password
                </Notification>,
            )
            setEmailSent(true)
        } catch (error: any) {
            let errorMessage = 'Failed to send reset link. Please try again.'

            if (typeof error === 'string') {
                errorMessage = error
            } else if (error && typeof error === 'object') {
                // Handle AxiosError or standard Error
                errorMessage = error.response?.data?.detail || error.message || errorMessage
            }

            setMessage(errorMessage)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <ForgotPassword
            onForgotPasswordSubmit={handleForgotPasswordSubmit}
            signInUrl={signInUrl}
        />
    )
}

export default ForgotPasswordClient
