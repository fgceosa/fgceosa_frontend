'use client'

import { useState } from 'react'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import ActionLink from '@/components/shared/ActionLink'
import ForgotPasswordForm from './ForgotPasswordForm'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useRouter } from 'next/navigation'
import type { OnForgotPasswordSubmit } from './ForgotPasswordForm'
import { KeyRound, MailCheck, ChevronRight } from 'lucide-react'

type ForgotPasswordProps = {
    signInUrl?: string
    onForgotPasswordSubmit?: OnForgotPasswordSubmit
}

export const ForgotPassword = ({
    signInUrl = '/sign-in',
    onForgotPasswordSubmit,
}: ForgotPasswordProps) => {
    const [emailSent, setEmailSent] = useState(false)
    const [message, setMessage] = useTimeOutMessage()

    const router = useRouter()

    const handleContinue = () => {
        router.push(signInUrl)
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-10">
                {emailSent ? (
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500 to-green-300 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
                            <div className="relative w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-emerald-600 shadow-sm border border-gray-100 dark:border-gray-800">
                                <MailCheck className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black uppercase text-emerald-600 tracking-[0.1em] mb-0.5">
                                Identity Verified
                            </span>
                            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                                Email Sent Successfully
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-blue-300 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
                            <div className="relative w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-primary shadow-sm border border-gray-100 dark:border-gray-800">
                                <KeyRound className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black uppercase text-primary tracking-[0.1em] mb-0.5">
                                Recovery Initialized
                            </span>
                            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                                Reset Password
                            </span>
                        </div>
                    </div>
                )}
                {!emailSent && (
                    <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed">
                        Enter your email address and we'll send you a recovery link to restore access.
                    </p>
                )}
            </div>

            {message && (
                <Alert showIcon className="mb-6 rounded-2xl border-rose-100 bg-rose-50/50" type="danger">
                    <span className="break-all font-bold text-xs tracking-tight">{message}</span>
                </Alert>
            )}

            <ForgotPasswordForm
                emailSent={emailSent}
                setMessage={setMessage}
                setEmailSent={setEmailSent}
                onForgotPasswordSubmit={onForgotPasswordSubmit}
            >
                <Button
                    block
                    variant="solid"
                    type="button"
                    className="h-14 bg-primary hover:bg-primary-deep text-white font-bold text-sm rounded-[1.2rem] shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    onClick={handleContinue}
                >
                    Back to Sign In
                </Button>
            </ForgotPasswordForm>

            <div className="mt-10 flex justify-center">
                <div className="group flex items-center gap-3 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-100/50 dark:border-gray-800/50 hover:bg-white dark:hover:bg-gray-800/50 transition-all duration-500">
                    <span className="text-xs font-bold text-gray-400">
                        Remembered your password?
                    </span>
                    <ActionLink
                        href={signInUrl}
                        className="text-xs font-black text-primary hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
                        themeColor={false}
                    >
                        Sign in
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </ActionLink>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
