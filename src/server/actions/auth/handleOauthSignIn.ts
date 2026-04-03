'use server'

import { signIn } from '@/auth'
import appConfig from '@/configs/app.config'
import { AuthError } from 'next-auth'

const handleOauthSignIn = async (
    signInMethod: string,
    callbackUrl?: string,
) => {
    try {
        // console.log(`🔐 Starting ${signInMethod} OAuth sign-in...`)

        // Validate provider
        if (!['google', 'github'].includes(signInMethod)) {
            throw new Error(`Unsupported OAuth provider: ${signInMethod}`)
        }

        // Check credentials in development
        if (process.env.NODE_ENV === 'development') {
            if (signInMethod === 'google') {
                if (!process.env.GOOGLE_AUTH_CLIENT_ID || process.env.GOOGLE_AUTH_CLIENT_ID === 'your-google-client-id-here') {
                    throw new Error('Google OAuth credentials not configured. Please check your .env file.')
                }
            }
            if (signInMethod === 'github') {
                if (!process.env.GITHUB_AUTH_CLIENT_ID || process.env.GITHUB_AUTH_CLIENT_ID === 'your-github-client-id-here') {
                    throw new Error('GitHub OAuth credentials not configured. Please check your .env file.')
                }
            }
        }

        await signIn(signInMethod, {
            redirectTo: callbackUrl || appConfig.userEntryPath, // Default OAuth users to user dashboard
        })

        console.log(`✅ ${signInMethod} OAuth sign-in initiated successfully`)
    } catch (error: any) {
        // If it's a redirect error, re-throw it so Next.js can handle it
        if (
            (error instanceof Error && error.message.includes('NEXT_REDIRECT')) ||
            (error && typeof error === 'object' && 'digest' in error && String(error.digest).includes('NEXT_REDIRECT'))
        ) {
            throw error
        }

        console.error(`❌ ${signInMethod} OAuth sign-in error:`, error)

        if (error instanceof AuthError) {
            switch (error.type) {
                case 'OAuthAccountNotLinked':
                    throw new Error('This account is already linked to another provider. Please sign in with the original provider.')
                case 'OAuthCallbackError':
                    throw new Error(`OAuth callback error. Please check your ${signInMethod} OAuth configuration.`)
                default:
                    throw new Error(`OAuth error: ${error.message}`)
            }
        }

        throw error
    }
}

export default handleOauthSignIn
