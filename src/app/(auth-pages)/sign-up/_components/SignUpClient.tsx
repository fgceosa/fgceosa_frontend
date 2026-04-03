'use client'

import { useEffect, useState } from 'react'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import SignUp from '@/components/auth/SignUp'
import { signUpAsync, signInAsync } from '@/store/slices/auth'
import { useAppDispatch } from '@/store/hook'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiVerifyOrganizationInvitation } from '@/services/OrganizationService'
import type { OnSignUpPayload } from '@/components/auth/SignUp'

const SignUpClient = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const searchParams = useSearchParams()
    const isPostLogout = searchParams.get('logout') === 'true'
    const signInUrl = isPostLogout ? '/sign-in?logout=true' : '/sign-in'

    const [invitationInfo, setInvitationInfo] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const invitationToken = searchParams.get('invitation_token')

    useEffect(() => {
        if (invitationToken) {
            localStorage.setItem('invitation_token', invitationToken)
            const fetchInvite = async () => {
                try {
                    setLoading(true)
                    const data = await apiVerifyOrganizationInvitation(invitationToken)
                    setInvitationInfo(data)
                } catch (error) {
                    console.error('Failed to verify invitation on signup page:', error)
                } finally {
                    setLoading(false)
                }
            }
            fetchInvite()
        }
    }, [invitationToken])

    const handlSignUp = async ({
        values,
        setSubmitting,
        setMessage,
    }: OnSignUpPayload) => {
        try {
            setSubmitting(true)
            const signUpValues = invitationToken
                ? { ...values, invitationToken }
                : values

            await dispatch(signUpAsync(signUpValues)).unwrap()

            if (invitationToken) {
                // Auto login for invited users.
                // Pass the invitation accept page as callbackUrl so that after
                // NextAuth completes authentication, it redirects there for acceptance.
                try {
                    await dispatch(
                        signInAsync({
                            credentials: {
                                email: values.email,
                                password: values.password,
                            },
                            callbackUrl: `/invitation/accept?token=${encodeURIComponent(invitationToken)}`,
                        })
                    ).unwrap()
                } catch (signinError: any) {
                    const errorStr = (typeof signinError === 'string')
                        ? signinError
                        : (signinError?.message || '')

                    const isRedirect = errorStr.includes('NEXT_REDIRECT') ||
                        (signinError && typeof signinError === 'object' && 'isRedirect' in signinError)

                    if (isRedirect) {
                        // Extract URL from sentinel if possible (format: NEXT_REDIRECT;...;/url)
                        const parts = errorStr.split(';')
                        const redirectUrl = parts.find((p: string) => p.startsWith('/') || p.startsWith('http'))
                            || parts[parts.length - 1]

                        if (redirectUrl && (redirectUrl.startsWith('/') || redirectUrl.startsWith('http'))) {
                            router.push(redirectUrl)
                            return
                        }
                        // Default fallback for invited users
                        router.push(`/invitation/accept?token=${encodeURIComponent(invitationToken)}`)
                        return
                    }

                    console.error('Auto-login after signup failed:', signinError)
                    // If a real sign-in error occurs, redirect to sign-in with pre-filled token
                    router.push(`/sign-in?email=${encodeURIComponent(values.email)}&invitation_token=${encodeURIComponent(invitationToken)}`)
                    return
                }
                // If unwrap() succeeded without redirect, push manually
                router.push(`/invitation/accept?token=${encodeURIComponent(invitationToken)}`)
                return
            }

            toast.push(
                <Notification title="Account created!" type="success">
                    Your account has been created successfully.
                </Notification>,
            )

            // Redirect to check-email page for normal users
            router.push(`/check-email?email=${encodeURIComponent(values.email)}&logout=true`)
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

    if (loading) {
        return <div className="flex items-center justify-center p-10 font-bold text-sm text-gray-500">Loading invitation details...</div>
    }

    const emailParam = searchParams.get('email')

    const defaultValues = invitationInfo ? {
        email: invitationInfo.email,
        organizationName: invitationInfo.organization_name,
        accountType: 'individual' as const
    } : (emailParam ? {
        email: emailParam,
        accountType: 'individual' as const
    } : undefined)

    return (
        <SignUp
            onSignUp={handlSignUp}
            defaultValues={defaultValues}
            isInvitation={!!invitationToken}
            signInUrl={signInUrl}
        />
    )
}

export default SignUpClient
