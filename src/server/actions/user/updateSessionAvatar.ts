'use server'

/**
 * Update the user's avatar in the NextAuth session
 * This ensures the avatar persists across page refreshes
 *
 * Note: NextAuth v5 updates sessions through the JWT callback.
 * We'll trigger a session refresh by setting a flag in cookies.
 */
export async function updateSessionAvatar(avatarUrl: string | null) {
    try {
        // Store the new avatar URL in a cookie that the JWT callback can read
        // This is a workaround until NextAuth v5 stable provides a proper update mechanism
        const { cookies } = await import('next/headers')
        const cookieStore = await cookies()

        if (avatarUrl) {
            cookieStore.set('pending-avatar-update', avatarUrl, {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 60, // 1 minute - enough time for the session to refresh
            })
        } else {
            cookieStore.set('pending-avatar-update', 'null', {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 60,
            })
        }

        return { success: true }
    } catch (error) {
        console.error('Failed to update session avatar:', error)
        return { success: false, error: 'Failed to update session' }
    }
}
