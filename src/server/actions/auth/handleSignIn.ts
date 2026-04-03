'use server'

import { signIn } from '@/auth'
import { getRoleBasedRedirectUrl } from '@/utils/roleBasedRouting'
import validateCredential from '../user/validateCredential'
import { AuthError } from 'next-auth'
import type { SignInCredential } from '@/@types/auth'

export const onSignInWithCredentials = async (
    { email, password }: SignInCredential,
    callbackUrl?: string,
) => {
    try {
        // First validate the user credentials to get user data
        const user = await validateCredential({ email, password })

        if (!user) {
            return { error: 'we couldn\'t sign you in, please try again' }
        }


        // Store access token client-side for axios
        // We can't directly write to localStorage from a server action,
        // so pass it through the NextAuth JWT and set via client init.

        // Determine redirect URL based on user role
        // Map the basic role to proper UserRole format
        const userWithAuthority = {
            authority: user.authority?.map((role: string) => {
                // Map basic roles to proper UserRole types
                switch (role) {
                    case 'admin':
                        return 'platform_admin' as const
                    case 'platform_super_admin':
                        return 'platform_super_admin' as const
                    case 'org_super_admin':
                        return 'org_super_admin' as const
                    case 'org_admin':
                        return 'org_admin' as const
                    case 'staff':
                        return 'staff' as const
                    case 'user':
                    default:
                        return 'user' as const
                }
            }) || ['user' as const]
        }
        const redirectUrl = getRoleBasedRedirectUrl(userWithAuthority, callbackUrl)

        // Sign in with the determined redirect URL
        await signIn('credentials', {
            email,
            password,
            redirectTo: redirectUrl,
        })
    } catch (error: any) {
        // If it's a redirect error, re-throw it so Next.js can handle it
        // In Next.js 15, redirect errors might have a 'digest' starting with 'NEXT_REDIRECT'
        if (
            (error instanceof Error && error.message.includes('NEXT_REDIRECT')) ||
            (error && typeof error === 'object' && 'digest' in error && String(error.digest).includes('NEXT_REDIRECT'))
        ) {
            throw error
        }

        // Extract specific error message
        let errorMessage = 'we couldn\'t sign you in, please try again'

        if (error instanceof AuthError) {
            /** Customize error message based on AuthError */
            switch (error.type) {
                case 'CredentialsSignin':
                    // Try to extract the actual error message from the cause
                    if (error.cause?.err instanceof Error) {
                        errorMessage = error.cause.err.message
                    } else {
                        errorMessage = 'the email or password you entered is incorrect, please try again'
                    }
                    break
                default:
                    errorMessage = 'we couldn\'t sign you in, please try again'
            }
        } else if (error instanceof Error) {
            // Use the error message directly
            errorMessage = error.message
        } else if (typeof error === 'string') {
            errorMessage = error
        }

        console.error('🔴 Sign-in error:', { error, errorMessage })
        return { error: errorMessage }
    }
}
