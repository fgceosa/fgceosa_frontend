import type { NextAuthConfig } from 'next-auth'
import { validateUserCredentials, validateSocialLogin } from '../services/AuthValidationService'
import Credentials from 'next-auth/providers/credentials'
import Github from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

import type { SignInCredential } from '@/@types/auth'

// Helper to convert relative avatar path to full URL
const getFullAvatarUrl = (avatarPath: string | null | undefined): string | null => {
    if (!avatarPath) return null
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
        return avatarPath
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    return `${apiUrl}${avatarPath}`
}

export default {
    providers: [
        Github({
            clientId: process.env.GITHUB_AUTH_CLIENT_ID,
            clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET,
        }),
        Google({
            clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                /** validate credentials from backend here */
                try {
                    const user = await validateUserCredentials(
                        credentials as SignInCredential,
                    )

                    if (!user) {
                        throw new Error('Invalid credentials!')
                    }

                    return {
                        id: user.id,
                        name: user.userName,
                        email: user.email,
                        image: getFullAvatarUrl(user.avatar),
                        authority: user.authority, // Include user's authority from database
                        permissions: user.permissions, // Include granular permissions
                        tag_number: user.tagNumber, // Include Qorebit tag
                        accessToken: user.accessToken, // Pass through the access token
                        expiresIn: user.expiresIn,
                        tokenType: user.tokenType,
                    }
                } catch (error) {
                    // Re-throw the error so NextAuth can handle it
                    // This preserves the specific error message from validateCredential
                    console.error('NextAuth Authorize Error:', error)
                    throw error
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account, trigger, session }) {

            // Handle session updates (e.g., when user data changes)
            if (trigger === 'update' && session) {
                // Merge updated session data into token
                return { ...token, ...session }
            }

            // Check for pending avatar update from cookie
            if (!user) {
                try {
                    const { cookies } = await import('next/headers')
                    const cookieStore = await cookies()
                    const pendingAvatar = cookieStore.get('pending-avatar-update')

                    if (pendingAvatar) {
                        const avatarValue = pendingAvatar.value
                        token.picture = avatarValue === 'null' ? null : avatarValue

                        // Clear the cookie after using it
                        cookieStore.delete('pending-avatar-update')
                    }
                } catch (error) {
                    console.error('Failed to check pending avatar update:', error)
                }
            }

            // Include user authority and access token in JWT token
            if (user) {
                // Map standard identity fields
                token.name = user.name
                token.email = user.email
                token.picture = user.image

                if ('authority' in user) {
                    // User from credentials login (has authority from database)
                    token.authority = user.authority
                    if ('permissions' in user) {
                        token.permissions = user.permissions
                    }
                    // Store the Qorebit tag
                    if ('tag_number' in user) {
                        token.tag_number = user.tag_number
                    }
                    // Store the backend JWT access token
                    if ('accessToken' in user) {
                        token.accessToken = user.accessToken
                    }
                } else if (account?.provider === 'google' || account?.provider === 'github') {
                    // Sync with backend to get authority and access token
                    try {
                        const backendUser = await validateSocialLogin({
                            email: (user as any).email as string,
                            full_name: (user as any).name,
                            avatar: (user as any).image,
                            provider: account.provider
                        })

                        if (backendUser) {
                            token.authority = backendUser.authority
                            token.permissions = backendUser.permissions
                            token.tag_number = backendUser.tagNumber
                            token.accessToken = backendUser.accessToken
                            // use backend avatar if available
                            token.picture = getFullAvatarUrl(backendUser.avatar) || (user as any).image
                        } else {
                            // Fallback if backend sync fails
                            const userEmail = user && 'email' in user ? (user as { email?: string | null }).email : null
                            const isAdmin = userEmail === 'admin@fgceosa.org'
                            token.authority = isAdmin ? ['admin'] : ['user']
                        }
                    } catch (error) {
                        console.error('Failed to sync social user with backend:', error)
                        // Emergency fallback
                        token.authority = ['user']
                    }
                }
            }

            return token
        },
        async session({ session, token }) {

            // Include authority and access token in session from JWT token
            const enhancedSession = {
                ...session,
                user: {
                    ...session.user,
                    id: token.sub,
                    name: token.name || session.user?.name,
                    email: token.email || session.user?.email,
                    image: token.picture || session.user?.image,
                    authority: (token.authority && (token.authority as string[]).length > 0)
                        ? (token.authority as string[])
                        : ['member'], // Default to member if no authority
                    permissions: token.permissions || [], // Include granular permissions
                    tag_number: token.tag_number, // Include Qorebit tag in session
                },
                accessToken: token.accessToken, // Include access token in session
            }

            return enhancedSession
        },
        async redirect({ url, baseUrl }) {
            // Always use the canonical app URL, ignoring the Netlify deploy preview URL
            const canonicalBase = process.env.NEXTAUTH_URL || baseUrl

            // If the URL is relative (e.g. /dashboard), build it from the canonical base
            if (url.startsWith('/')) {
                return `${canonicalBase}${url}`
            }

            // If it's an absolute URL on the canonical domain, allow it
            if (url.startsWith(canonicalBase)) {
                return url
            }

            // For any other absolute URL (e.g. Netlify URL), strip the origin
            // and rebuild with the canonical base
            try {
                const parsed = new URL(url)
                return `${canonicalBase}${parsed.pathname}${parsed.search}`
            } catch {
                return canonicalBase
            }
        },
        async signIn({ account }) {
            // Allow all credential logins that pass validation
            if (account?.provider === 'credentials') {
                return true
            }

            // Allow OAuth logins
            if (account?.provider === 'google' || account?.provider === 'github') {
                return true
            }

            return true
        },
    },
    trustHost: true,
} satisfies NextAuthConfig
