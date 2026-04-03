'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { HiMail, HiArrowLeft } from 'react-icons/hi'
import Logo from '@/components/template/Logo'
import { apiResendVerification } from '@/services/AuthService'
import { useState } from 'react'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

const CheckEmailPage = () => {
    const searchParams = useSearchParams()
    const email = searchParams.get('email')
    const [resending, setResending] = useState(false)

    const handleResend = async () => {
        if (!email) return

        try {
            setResending(true)
            await apiResendVerification(email)
            toast.push(
                <Notification title="Email sent!" type="success">
                    A new verification link has been sent to your email.
                </Notification>
            )
        } catch (error) {
            toast.push(
                <Notification title="Failed to resend" type="danger">
                    Please try again in a few moments.
                </Notification>
            )
        } finally {
            setResending(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-8">
                <Logo />
            </div>

            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                        <HiMail className="text-4xl text-blue-500 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Check your email</h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        We've sent a verification link to <br />
                        <span className="font-bold text-gray-900 dark:text-white">{email}</span>
                    </p>

                    <div className="w-full space-y-3 mt-6">
                        <Link href="/sign-in?logout=true" className="block w-full">
                            <Button block variant="solid">
                                Go to Sign In
                            </Button>
                        </Link>

                        <Button
                            block
                            variant="plain"
                            loading={resending}
                            onClick={handleResend}
                            className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-primary"
                        >
                            Didn't receive email? Resend link
                        </Button>
                    </div>
                </div>
            </div>

            <Link href="/sign-up" className="mt-8 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors font-bold">
                <HiArrowLeft />
                Back to Sign Up
            </Link>
        </div>
    )
}

export default CheckEmailPage
