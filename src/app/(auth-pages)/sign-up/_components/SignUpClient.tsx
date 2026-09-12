'use client'

import { useState } from 'react'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import SignUp from '@/components/auth/SignUp'
import Button from '@/components/ui/Button'
import { Clock } from 'lucide-react'
import { signUpAsync } from '@/store/slices/auth'
import { useAppDispatch } from '@/store/hook'
import { useRouter, useSearchParams } from 'next/navigation'
import type { OnSignUpPayload } from '@/components/auth/SignUp'

const SignUpClient = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isSuccess, setIsSuccess] = useState(false)
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

            // Show the success UI instead of logging in
            setIsSuccess(true)
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

    if (isSuccess) {
        return (
            <div className="animate-in fade-in zoom-in duration-500 py-10 px-6 sm:px-10 text-center max-w-md mx-auto">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center border-[6px] border-amber-100 shadow-sm">
                        <Clock className="w-10 h-10" />
                    </div>
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Registration Under Review</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed text-sm">
                    Thank you for registering with the FGC Enugu Old Students Association portal.
                    <br /><br />
                    Your account is currently being reviewed by our administrators. Once your membership is verified and approved, you will receive an email notification with instructions to log in.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 mt-8">
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                        Questions? Reach out to us at <a href="mailto:hello@allfgcealumni.org" className="text-[#8B0000] hover:underline font-bold">hello@allfgcealumni.org</a>
                    </p>
                </div>
                <Button
                    className="mt-8 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-bold"
                    variant="solid"
                    onClick={() => router.push(signInUrl)}
                    block
                >
                    Return to Sign In
                </Button>
            </div>
        )
    }

    return (
        <SignUp
            onSignUp={handlSignUp}
            defaultValues={defaultValues}
            signInUrl={signInUrl}
        />
    )
}

export default SignUpClient
