'use client'

import SignIn from '@/components/auth/SignIn'
import { signInAsync } from '@/store/slices/auth'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import handleOauthSignIn from '@/server/actions/auth/handleOauthSignIn'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import type {
    OnSignInPayload,
} from '@/components/auth/SignIn'

const SignInClient = () => {
    const dispatch = useAppDispatch()
    const { loading, error } = useAppSelector((state) => state.auth.session)
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get(REDIRECT_URL_KEY)

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
            const result = await dispatch(
                signInAsync({
                    credentials: values,
                    callbackUrl: callbackUrl || undefined,
                }),
            ).unwrap()

            // If the thunk returned a redirect URL, handle it silently
            if (result && 'redirect' in result && result.redirect) {
                const url = result.redirect as string
                let path = url
                try {
                    const parsed = new URL(url)
                    path = parsed.pathname + parsed.search
                } catch {
                    // already a relative path, keep as is
                }
                if (!path.startsWith('/')) path = '/' + path
                window.location.href = `${window.location.origin}${path}`
                return
            }
        } catch (error) {
            let message = ''
            if (typeof error === 'string') {
                message = error
            } else if (error instanceof Error) {
                message = error.message
            }

            if (message) {
                setMessage(message)
            }
        } finally {
            setSubmitting(false)
        }
    }

    useEffect(() => {
    }, [loading, error])

    return (
        <SignIn
            onSignIn={handleSignIn}
            forgetPasswordUrl={forgetPasswordUrl}
            signUpUrl={signUpUrl}
        />
    )
}

export default SignInClient
