'use client'

import Logo from '@/components/template/Logo'
import Alert from '@/components/ui/Alert'
import SignInForm from './SignInForm'
import OauthSignIn from './OauthSignIn'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useTheme from '@/utils/hooks/useTheme'
import type { OnSignIn } from './SignInForm'
import type { OnOauthSignIn } from './OauthSignIn'
import { ShieldCheck, ChevronRight } from 'lucide-react'

type SignInProps = {
    signUpUrl?: string
    forgetPasswordUrl?: string
    onSignIn?: OnSignIn
    onOauthSignIn?: OnOauthSignIn
}

const SignIn = ({
    signUpUrl = '/sign-up',
    forgetPasswordUrl = '/forgot-password',
    onSignIn,
    onOauthSignIn,
}: SignInProps) => {
    const [message, setMessage] = useTimeOutMessage()
    const mode = useTheme((state) => state.mode)

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-10">
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-[#0055BA] to-blue-300 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
                        <div className="relative w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-primary shadow-sm border border-gray-100 dark:border-gray-800">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[11px] font-black uppercase text-primary tracking-[0.1em] mb-0.5">
                            Secure Access
                        </span>
                    </div>
                </div>
                <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed">
                    AI-grade intelligence at your fingertips. Sign in to continue.
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
                            className="text-xs font-bold text-primary hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            themeColor={false}
                        >
                            Forgot password?
                        </ActionLink>
                    </div>
                }
                onSignIn={onSignIn}
            />

            <div className="mt-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-gray-100 dark:bg-gray-800 flex-1" />
                    <span className="text-xs font-bold text-gray-400 whitespace-nowrap">Or sign in with</span>
                    <div className="h-px bg-gray-100 dark:bg-gray-800 flex-1" />
                </div>
                <OauthSignIn
                    setMessage={setMessage}
                    onOauthSignIn={onOauthSignIn}
                />
            </div>

            <div className="mt-10 flex justify-center">
                <div className="group flex items-center gap-3 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-100/50 dark:border-gray-800/50 hover:bg-white dark:hover:bg-gray-800/50 transition-all duration-500">
                    <span className="text-xs font-bold text-gray-400">
                        New to the platform?
                    </span>
                    <ActionLink
                        href={signUpUrl}
                        className="text-xs font-black text-primary hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
                        themeColor={false}
                    >
                        Sign up here
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </ActionLink>
                </div>
            </div>
        </div>
    )
}

export default SignIn
