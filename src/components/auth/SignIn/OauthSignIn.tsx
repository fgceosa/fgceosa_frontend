'use client'

import Button from '@/components/ui/Button'
import { SiGoogle, SiGithub } from 'react-icons/si'

type OauthSignInType = 'google' | 'github'

export type OnOauthSignInPayload = {
    type: OauthSignInType
    setMessage?: (message: string) => void
}

export type OnOauthSignIn = (payload: OnOauthSignInPayload) => void

type OauthSignInProps = {
    setMessage?: (message: string) => void
    onOauthSignIn?: OnOauthSignIn
}

const OauthSignIn = ({ onOauthSignIn, setMessage }: OauthSignInProps) => {
    const handleGoogleSignIn = async () => {
        onOauthSignIn?.({ type: 'google', setMessage })
    }

    const handleGithubSignIn = async () => {
        onOauthSignIn?.({ type: 'github', setMessage })
    }

    return (
        <div className="grid grid-cols-2 gap-4">
            <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center gap-3 h-14 rounded-[1.2rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 group active:scale-[0.98]"
            >
                <SiGoogle className="text-rose-500 text-xl group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Google</span>
            </button>
            <button
                type="button"
                onClick={handleGithubSignIn}
                className="flex items-center justify-center gap-3 h-14 rounded-[1.2rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 group active:scale-[0.98]"
            >
                <SiGithub className="text-gray-900 dark:text-white text-xl group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Github</span>
            </button>
        </div>
    )
}

export default OauthSignIn
