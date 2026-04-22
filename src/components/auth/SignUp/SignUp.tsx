'use client'

import Alert from '@/components/ui/Alert'
import SignUpForm from './SignUpForm'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
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

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 py-4 px-4 sm:px-8">
            <div className="mb-10 text-center pt-2">
                <div className="flex flex-col items-center gap-3">
                    <div className="relative group mb-4">
                        <div className="absolute -inset-1 bg-[#8B0000] rounded-xl blur opacity-10 group-hover:opacity-20 transition-opacity" />
                        <div className="relative w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-[#8B0000] shadow-sm border border-gray-100 dark:border-gray-700">
                            <Sparkles className="w-6 h-6 animate-pulse" />
                        </div>
                    </div>
                    <div className="flex flex-col text-center">
                        <span className="text-[10px] font-black uppercase text-[#8B0000] tracking-[0.2em] mb-1">
                            Alumni Registration
                        </span>
                    </div>
                </div>
                <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed max-w-xs mx-auto">
                    {isInvitation
                        ? "You've been invited to join. Secure your account below."
                        : "Create your verified alumni account and reconnect with classmates."
                    }
                </p>

                <div className="flex items-center justify-center gap-2 mt-5 px-5 py-2.5 bg-[#8B0000]/5 border border-[#8B0000]/10 rounded-full mx-auto w-fit">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8B0000] animate-pulse shrink-0" />
                    <p className="text-[11px] font-bold text-[#8B0000] dark:text-red-400 tracking-wide text-center">
                        Membership is open to all alumni of FGCE
                    </p>
                </div>
            </div>

            {message && (
                <Alert showIcon className="mb-6 rounded-2xl border-rose-100 bg-rose-50/50" type="danger">
                    <span className="break-all font-bold text-xs tracking-tight">{message}</span>
                </Alert>
            )}

            <SignUpForm onSignUp={onSignUp} setMessage={setMessage} defaultValues={defaultValues} />

            <div className="mt-10 flex justify-center border-t border-gray-100 dark:border-gray-700 pt-8">
                <div className="flex flex-col items-center gap-4">
                     <span className="text-xs font-bold text-gray-400">
                        Already have an account?
                    </span>
                    <ActionLink
                        href={signInUrl}
                        className="px-8 py-3 rounded-xl border-2 border-[#8B0000]/20 text-xs font-black text-[#8B0000] hover:bg-[#8B0000]/5 dark:hover:bg-[#8B0000]/10 flex items-center gap-2 transition-all active:scale-95"
                        themeColor={false}
                    >
                        Sign in here
                        <ChevronRight className="w-3 h-3" />
                    </ActionLink>
                </div>
            </div>
        </div>
    )
}

export default SignUp
