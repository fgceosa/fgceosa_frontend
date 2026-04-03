'use client'

import { useEffect, useState } from 'react'
import { apiVerifyEmail, apiResendVerification } from '@/services/AuthService'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, Alert } from '@/components/ui'
import { HiMailOpen, HiCheckCircle, HiXCircle, HiArrowRight } from 'react-icons/hi'
import Logo from '@/components/template/Logo'

const VerifyEmailClient = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')

    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
    const [message, setMessage] = useState('Verifying your email...')
    const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success'>('idle')

    useEffect(() => {
        if (!token) {
            setStatus('failed')
            setMessage('Invalid verification link. Missing token.')
            return
        }

        const verify = async () => {
            try {
                await apiVerifyEmail(token)
                setStatus('success')
                setMessage('Your email has been successfully verified!')
            } catch (error: any) {
                setStatus('failed')
                const errorMsg = error.response?.data?.detail || 'Verification failed or link expired.'
                setMessage(errorMsg)
            }
        }

        verify()
    }, [token])

    const handleResend = async () => {
        // Since we don't have the user's email here easily without them entering it,
        // we might want to redirect them to a resend page or just suggest login.
        router.push('/sign-in')
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
            <div className="mb-8">
                <Logo />
            </div>

            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                            <HiMailOpen className="text-4xl text-blue-500 animate-bounce" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verifying...</h2>
                        <p className="text-gray-500 dark:text-gray-400">Please wait while we verify your email address.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                            <HiCheckCircle className="text-4xl text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Email Verified!</h2>
                        <p className="text-gray-500 dark:text-gray-400">{message}</p>
                        <Link href="/sign-in?logout=true" className="w-full mt-6">
                            <Button block variant="solid" icon={<HiArrowRight />}>
                                Go to Sign In
                            </Button>
                        </Link>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                            <HiXCircle className="text-4xl text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verification Failed</h2>
                        <Alert type="danger" className="w-full text-left mt-2">
                            {message}
                        </Alert>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            The link may have expired or is already used.
                        </p>
                        <Link href="/sign-in?logout=true" className="w-full mt-6">
                            <Button block variant="default">
                                Back to Login
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                Need help? <Link href="/help" className="text-blue-600 font-bold hover:underline">Contact Support</Link>
            </p>
        </div>
    )
}

export default VerifyEmailClient
