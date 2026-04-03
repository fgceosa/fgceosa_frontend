'use client'

import { useState } from 'react'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import ActionLink from '@/components/shared/ActionLink'
import ResetPasswordForm from './ResetPasswordForm'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useRouter } from 'next/navigation'
import type { OnResetPasswordSubmit } from './ResetPasswordForm'
import { KeyRound, ShieldCheck, ChevronRight, HelpCircle } from 'lucide-react'

type ResetPasswordProps = {
    signInUrl?: string
    onResetPasswordSubmit?: OnResetPasswordSubmit
}

export const ResetPassword = ({
    signInUrl = '/sign-in',
    onResetPasswordSubmit,
}: ResetPasswordProps) => {
    const [resetComplete, setResetComplete] = useState(false)
    const [message, setMessage] = useTimeOutMessage()

    const router = useRouter()

    const handleContinue = () => {
        router.push(signInUrl)
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-10">
                {resetComplete ? (
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500 to-green-300 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
                            <div className="relative w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-emerald-600 shadow-sm border border-gray-100 dark:border-gray-800">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black uppercase text-emerald-600 tracking-[0.1em] mb-0.5">
                                Account Secured
                            </span>
                            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                                Password Reset Successfully
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
                                Security Protocol
                            </span>
                            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                                Set New Password
                            </span>
                        </div>
                    </div>
                )}
                <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed">
                    {resetComplete 
                        ? "Your password has been successfully updated. You can now access your account with your new credentials."
                        : "Choose a strong, unique password to ensure your account remains secure."
                    }
                </p>
            </div>

            {message && (
                <Alert showIcon className="mb-6 rounded-2xl border-rose-100 bg-rose-50/50" type="danger">
                    <span className="break-all font-bold text-xs tracking-tight">{message}</span>
                </Alert>
            )}

            <ResetPasswordForm
                resetComplete={resetComplete}
                setMessage={setMessage}
                setResetComplete={setResetComplete}
                onResetPasswordSubmit={onResetPasswordSubmit}
            >
                <Button
                    block
                    variant="solid"
                    type="button"
                    className="h-14 bg-primary hover:bg-primary-deep text-white font-bold text-sm rounded-[1.2rem] shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    onClick={handleContinue}
                >
                    Sign In
                </Button>
            </ResetPasswordForm>

            <div className="mt-10 flex justify-center">
                <div className="group flex items-center gap-3 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-100/50 dark:border-gray-800/50 hover:bg-white dark:hover:bg-gray-800/50 transition-all duration-500">
                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                        <HelpCircle className="w-3 h-3" /> Need help?
                    </span>
                    <ActionLink
                        href="/support"
                        className="text-xs font-black text-primary hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
                        themeColor={false}
                    >
                        Contact Support
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </ActionLink>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
