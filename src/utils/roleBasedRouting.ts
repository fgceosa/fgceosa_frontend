import appConfig from '@/configs/app.config'

export type UserRole = 'super_admin' | 'admin' | 'member'

export interface UserWithAuthority {
    authority: UserRole[]
}

export interface UserSession {
    authority?: UserRole[]
}

/**
 * Determines the appropriate redirect URL based on user's role
 * @param user - User object with authority array
 * @param callbackUrl - Optional callback URL to override role-based routing
 * @returns The appropriate redirect URL
 */
export const getRoleBasedRedirectUrl = (
    user: UserWithAuthority | null,
    callbackUrl?: string
): string => {
    // If there's a specific callback URL, use it
    if (callbackUrl && callbackUrl !== '/') {
        return callbackUrl
    }

    // If no user, redirect to sign-in
    if (!user) {
        return appConfig.unAuthenticatedEntryPath
    }

    // Default fallback for authenticated users with no roles or explicitly 'member' role
    const fallbackPath = appConfig.userEntryPath

    // If no authority array, fallback to user path
    if (!user.authority || user.authority.length === 0) {
        return fallbackPath
    }

    // Check user roles in hierarchy order
    if (user.authority.includes('super_admin')) {
        return appConfig.adminEntryPath
    }

    if (user.authority.includes('admin')) {
        return appConfig.adminEntryPath
    }

    // Default fallback
    return appConfig.userEntryPath
}

/**
 * Checks if user has a specific role
 * @param user - User object with optional authority array
 * @param role - Role to check for
 * @returns Boolean indicating if user has the role
 */
export const hasRole = (user: UserSession | null, role: UserRole): boolean => {
    return user?.authority?.includes(role) ?? false
}

/**
 * Checks if user has admin privileges
 * @param user - User object with optional authority array
 * @returns Boolean indicating if user has admin privileges
 */
export const isAdmin = (user: UserSession | null): boolean => {
    return user?.authority?.some(role =>
        ['super_admin', 'admin'].includes(role)
    ) ?? false
}

/**
 * Checks if user has any valid role (can access user features)
 * @param user - User object with optional authority array
 * @returns Boolean indicating if user has any valid role
 */
export const isUser = (user: UserSession | null): boolean => {
    return (user?.authority && user.authority.length > 0) ?? false
}

/**
 * Checks if user has management privileges
 * @param user - User object with optional authority array
 * @returns Boolean indicating if user can manage content
 */
export const isOrgAdmin = (user: UserSession | null): boolean => {
    return isAdmin(user)
}
