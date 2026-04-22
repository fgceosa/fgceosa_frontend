'use client'

import { useState } from 'react'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import SignUp from '@/components/auth/SignUp'
import { signUpAsync, signInAsync } from '@/store/slices/auth'
import { useAppDispatch } from '@/store/hook'
import { useRouter, useSearchParams } from 'next/navigation'
import type { OnSignUpPayload } from '@/components/auth/SignUp'

const SignUpClient = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const searchParams = useSearchParams()
    const isPostLogout = searchParams.get('logout') === 'true'
    const signInUrl = isPostLogout ? '/sign-in?logout=true' : '/sign-in'

    const handlSignUp = async ({
        values,
        setSubmitting,
        setMessage,
    }: OnSignUpPayload) => {
        try {
            setSubmitting(true)
            await dispatch(signUpAsync({
                ...values,
                accountType: 'individual'
            })).unwrap()

            toast.push(
                <Notification title="Account created!" type="success">
                    Your account has been created successfully.
                </Notification>,
            )

            // Auto-login newly registered user
            await dispatch(
                signInAsync({
                    credentials: {
                        email: values.email,
                        password: values.password,
                    },
                })
            ).unwrap()

            // Redirect to dashboard (commented out check-email for now)
            // router.push(`/check-email?email=${encodeURIComponent(values.email)}&logout=true`)
            router.push('/dashboard')
        } catch (error: any) {
            const errorStr = (typeof error === 'string')
                ? error
                : (error?.message || error?.payload || '')

            const isRedirect = errorStr.includes('NEXT_REDIRECT') ||
                (error && typeof error === 'object' && ('digest' in error || 'isRedirect' in error))

            if (isRedirect) {
                const parts = errorStr.split(';')
                const redirectUrl = parts.find((p: string) => p.startsWith('/') || p.startsWith('http'))
                    || parts[parts.length - 1]

                if (redirectUrl && (redirectUrl.startsWith('/') || redirectUrl.startsWith('http'))) {
                    router.push(redirectUrl)
                }
                return
            }

            let errorMessage = 'Registration failed. Please try again.'

            if (typeof error === 'string') {
                errorMessage = error
            } else if (error && typeof error === 'object') {
                const errorObj = error as Record<string, any>
                if (typeof errorObj.message === 'string' && !errorObj.message.includes('NEXT_REDIRECT')) {
                    errorMessage = errorObj.message
                } else if (typeof errorObj.payload === 'string') {
                    errorMessage = errorObj.payload
                } else if (typeof errorObj.error === 'string') {
                    errorMessage = errorObj.error
                }
            }

            setMessage(errorMessage)
        } finally {
            setSubmitting(false)
        }
    }

    const emailParam = searchParams.get('email')
    const defaultValues = emailParam ? {
        email: emailParam,
        accountType: 'individual' as const
    } : undefined

    return (
        <SignUp
            onSignUp={handlSignUp}
            defaultValues={defaultValues}
            signInUrl={signInUrl}
        />
    )
}

export default SignUpClient
