'use client'

import Logo from '@/components/template/Logo'
import Alert from '@/components/ui/Alert'
import SignUpForm from './SignUpForm'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useTheme from '@/utils/hooks/useTheme'
import type { OnSignUp } from './SignUpForm'
import { Sparkles, ChevronRight } from 'lucide-react'

type SignUpProps = {
    signInUrl?: string
    onSignUp?: OnSignUp
    defaultValues?: any
    isInvitation?: boolean
}

export const SignUp = ({ onSignUp, signInUrl = '/sign-in', defaultValues, isInvitation }: SignUpProps) => {
    const [message, setMessage] = useTimeOutMessage()
    const mode = useTheme((state) => state.mode)

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-10">
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-blue-400 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
                        <div className="relative w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-primary shadow-sm border border-gray-100 dark:border-gray-800">
                            <Sparkles className="w-5 h-5 animate-pulse" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[11px] font-black uppercase text-primary tracking-[0.1em] mb-0.5">
                            Account Creation
                        </span>
                        <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                            {isInvitation ? 'Organization Invitation' : 'Join Qorebit'}
                        </span>
                    </div>
                </div>
                <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed">
                    {isInvitation
                        ? "You've been invited to collaborate. Secure your account to join the organization."
                        : "Create your account and start building autonomous AI agents today."
                     }
                </p>
            </div>

            {message && (
                <Alert showIcon className="mb-6 rounded-2xl border-rose-100 bg-rose-50/50" type="danger">
                    <span className="break-all font-bold text-xs tracking-tight">{message}</span>
                </Alert>
            )}

            <SignUpForm onSignUp={onSignUp} setMessage={setMessage} defaultValues={defaultValues} />

            <div className="mt-10 flex justify-center">
                <div className="group flex items-center gap-3 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-100/50 dark:border-gray-800/50 hover:bg-white dark:hover:bg-gray-800/50 transition-all duration-500">
                    <span className="text-xs font-bold text-gray-400">
                        Already a member?
                    </span>
                    <ActionLink
                        href={signInUrl}
                        className="text-xs font-black text-primary hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
                        themeColor={false}
                    >
                        Sign in here
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </ActionLink>
                </div>
            </div>
        </div>
    )
}

export default SignUp
