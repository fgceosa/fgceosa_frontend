'use client'

import ResetPassword from '../../../../components/auth/ResetPassword'
import { apiResetPassword } from '../../../../services/AuthService'
import { useSearchParams } from 'next/navigation'
import type { OnResetPasswordSubmitPayload } from '../../../../components/auth/ResetPassword'

const ResetPasswordClient = () => {
    const searchParams = useSearchParams()

    const isPostLogout = searchParams.get('logout') === 'true'
    const signInUrl = isPostLogout ? '/sign-in?logout=true' : '/sign-in'
    const token = searchParams.get('token')

    const handleResetPassword = async (
        payload: OnResetPasswordSubmitPayload,
    ) => {
        const { values, setSubmitting, setMessage, setResetComplete } = payload
        try {
            setSubmitting(true)
            await apiResetPassword({
                ...values,
                token: token as string,
            })
            setResetComplete?.(true)
        } catch (error: any) {
            let errorMessage = 'Failed to reset password. Please try again.'

            if (typeof error === 'string') {
                errorMessage = error
            } else if (error && typeof error === 'object') {
                errorMessage = error.response?.data?.detail || error.message || errorMessage
            }

            setMessage(errorMessage)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <ResetPassword
            onResetPasswordSubmit={handleResetPassword}
            signInUrl={signInUrl}
        />
    )
}

export default ResetPasswordClient
