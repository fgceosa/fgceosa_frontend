'use client'

import SignIn from '@/components/auth/SignIn'
import { signInAsync } from '@/store/slices/auth'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import handleOauthSignIn from '@/server/actions/auth/handleOauthSignIn'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { apiAcceptOrganizationInvitation } from '@/services/OrganizationService'
import type {
    OnSignInPayload,
    OnOauthSignInPayload,
} from '@/components/auth/SignIn'

const SignInClient = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { loading, error } = useAppSelector((state) => state.auth.session)
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get(REDIRECT_URL_KEY)

    // If user arrived here after logout, carry the logout param to auth links
    // so the middleware bypass works (prevents stale session cookie redirect)
    const isPostLogout = searchParams.get('logout') === 'true'
    const forgetPasswordUrl = isPostLogout
        ? '/forgot-password?logout=true'
        : '/forgot-password'

    const signUpUrl = isPostLogout
        ? '/sign-up?logout=true'
        : '/sign-up'

    const handleSignIn = async ({
        values,
        setSubmitting,
        setMessage,
    }: OnSignInPayload) => {
        try {
            setSubmitting(true)
            await dispatch(
                signInAsync({
                    credentials: values,
                    callbackUrl: callbackUrl || undefined,
                }),
            ).unwrap()

            // Check if there's an invitation token to auto-accept after signin
            const invitationToken =
                searchParams.get('invitation_token') ||
                localStorage.getItem('invitation_token')

            if (invitationToken) {
                toast.push(
                    <Notification title="Signed in!" type="success">
                        Signed in successfully. Please accept the invitation to join.
                    </Notification>,
                )
                router.push(`/invitation/accept?token=${encodeURIComponent(invitationToken)}`)
                return
            }
            // Success - NextAuth will handle the redirect if no invitation token
        } catch (error) {
            // Sometimes Next/NextAuth may surface a runtime redirect sentinel such as
            // "NEXT_REDIRECT" which is not a real user-facing error. Ignore that
            // sentinel so we don't show it in the UI Alert. For all other errors,
            // surface a useful string.
            let message = ''
            if (typeof error === 'string') {
                message = error
            } else if (error instanceof Error) {
                message = error.message
            } else if (
                error &&
                typeof (error as { toString?: () => string }).toString ===
                'function'
            ) {
                message = String(error)
            }

            const sentinel = 'NEXT_REDIRECT'
            if (message && message.includes(sentinel)) {
                // The sentinel may embed the full URL (e.g. https://app.qorebit.ai/dashboard)
                // We ALWAYS want to navigate within the current domain (app.qorebit.ai),
                // so we extract only the pathname and use it with router.push().
                const parts = message.split(';')
                const rawUrl = parts.find(p => p.startsWith('/') || p.startsWith('http'))
                    || parts[parts.length - 1]

                if (rawUrl) {
                    // Extract just the path (ignore any embedded domain)
                    let path = rawUrl
                    try {
                        const parsed = new URL(rawUrl)
                        path = parsed.pathname + parsed.search
                    } catch {
                        // already a relative path, keep as is
                    }

                    // Ensure path starts with /
                    if (!path.startsWith('/')) path = '/' + path

                    console.info('🚀 Redirecting to:', path)

                    // Use window.location.origin so redirect stays on the same host
                    // (localhost in dev, app.qorebit.ai in production)
                    window.location.href = `${window.location.origin}${path}`
                    return
                } else {
                    console.warn('⚠️ Found redirect sentinel but could not parse URL:', message)
                }
            }

            if (message && !message.includes(sentinel)) {
                setMessage(message)
            } else {
                // swallow sentinel-like messages if we couldn't parse a URL
                console.debug('Ignored or handled sentinel sign-in message:', message)
            }
        } finally {
            setSubmitting(false)
        }
    }

    // Update form state based on Redux state
    useEffect(() => {
        // This effect will be triggered by Redux state changes
    }, [loading, error])

    const handleOAuthSignIn = async ({
        type,
        setMessage,
    }: OnOauthSignInPayload) => {
        try {
            if (type === 'google') {
                await handleOauthSignIn('google')
            }
            if (type === 'github') {
                await handleOauthSignIn('github')
            }
        } catch (error) {
            console.error(`${type} OAuth sign in error:`, error)
            if (setMessage) {
                setMessage(`Failed to sign in with ${type}. Please try again.`)
            }
        }
    }

    return (
        <SignIn
            onSignIn={handleSignIn}
            onOauthSignIn={handleOAuthSignIn}
            forgetPasswordUrl={forgetPasswordUrl}
            signUpUrl={signUpUrl}
        />
    )
}

export default SignInClient
