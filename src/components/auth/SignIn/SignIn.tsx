'use client'

import Alert from '@/components/ui/Alert'
import SignInForm from './SignInForm'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import type { OnSignIn } from './SignInForm'
import { ShieldCheck, ChevronRight } from 'lucide-react'

type SignInProps = {
    signUpUrl?: string
    forgetPasswordUrl?: string
    onSignIn?: OnSignIn
}

const SignIn = ({
    signUpUrl = '/sign-up',
    forgetPasswordUrl = '/forgot-password',
    onSignIn,
}: SignInProps) => {
    const [message, setMessage] = useTimeOutMessage()

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 py-4 px-4 sm:px-8">
            <div className="mb-10 text-center pt-2">
                <div className="flex flex-col items-center gap-3">
                    <div className="relative group mb-4">
                        <div className="absolute -inset-1 bg-[#8B0000] rounded-xl blur opacity-10 group-hover:opacity-20 transition-opacity" />
                        <div className="relative w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-[#8B0000] shadow-sm border border-gray-100 dark:border-gray-700">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="flex flex-col text-center">
                        <span className="text-[10px] font-black uppercase text-[#8B0000] tracking-[0.2em] mb-1">
                            Secure Portal Access
                        </span>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Welcome Back</h2>
                    </div>
                </div>
                <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed max-w-xs mx-auto">
                    Please sign in to access your alumni profile and association services.
                </p>
            </div>

            {message && (
                <Alert showIcon className="mb-6 rounded-2xl border-rose-100 bg-rose-50/50" type="danger">
                    <span className="break-all font-bold text-xs tracking-tight">{message}</span>
                </Alert>
            )}

            <SignInForm
                setMessage={setMessage}
                passwordHint={
                    <div className="mb-8 mt-1 text-right">
                        <ActionLink
                            href={forgetPasswordUrl}
                            className="text-xs font-bold text-[#8B0000] hover:text-[#660000] transition-colors"
                            themeColor={false}
                        >
                            Forgot password?
                        </ActionLink>
                    </div>
                }
                onSignIn={onSignIn}
            />

            <div className="mt-10 flex justify-center border-t border-gray-100 dark:border-gray-700 pt-8">
                <div className="flex flex-col items-center gap-4">
                     <span className="text-xs font-bold text-gray-400">
                        Don't have an account yet?
                    </span>
                    <ActionLink
                        href={signUpUrl}
                        className="px-8 py-3 rounded-xl border-2 border-[#8B0000]/20 text-xs font-black text-[#8B0000] hover:bg-[#8B0000]/5 dark:hover:bg-[#8B0000]/10 flex items-center gap-2 transition-all active:scale-95"
                        themeColor={false}
                    >
                        Register as Alumni
                        <ChevronRight className="w-3 h-3" />
                    </ActionLink>
                </div>
            </div>
        </div>
    )
}

export default SignIn
