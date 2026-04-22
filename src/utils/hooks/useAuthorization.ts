import { useAppSelector } from '@/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Hook to check if the current user has the required authority/role
 * Checks multiple sources: Redux state, Session, and PlatformContext
 */
/**
 * Hook to get all combined authorities from multiple sources
 */
export const useUserAuthorities = (): string[] => {
    const user = useAppSelector((state) => state.auth.user)
    const sessionUser = useAppSelector((state) => state.auth.session.session?.user)

    // Redux authorities
    const userAuthority = user.authority || []

    // Session authorities
    const sessionAuthority = (sessionUser as any)?.authority || []
    const sessionRole = (sessionUser as any)?.role || ''

    // Combine all unique authorities found
    return Array.from(new Set([
        ...userAuthority,
        ...sessionAuthority,
        ...(sessionRole ? [sessionRole] : [])
    ]))
}

/**
 * Hook to check if the current user has the required authority/role
 * Checks multiple sources: Redux state and Session
 */
export const useHasAuthority = (requiredAuthority: string[]): boolean => {
    const combinedAuthority = useUserAuthorities()

    if (requiredAuthority.length === 0) {
        return true
    }

    return requiredAuthority.some((role) => combinedAuthority.includes(role))
}

/**
 * Hook to protect pages that require specific authority/role
 * Redirects to fallback URL if user doesn't have required authority
 */
export const useRequireAuthority = (
    requiredAuthority: string[],
    fallbackUrl: string = '/dashboard'
) => {
    const router = useRouter()
    const hasAuthority = useHasAuthority(requiredAuthority)

    useEffect(() => {
        if (!hasAuthority) {
            router.replace(fallbackUrl)
        }
    }, [hasAuthority, router, fallbackUrl])

    return hasAuthority
}

/**
 * Check if user is member (lowest level role)
 */
export const useIsMember = (): boolean => {
    const hasAuthority = useHasAuthority(['member'])
    const hasAdminAccess = useHasAuthority(['admin', 'super_admin'])

    return hasAuthority && !hasAdminAccess
}

/**
 * Hook to check if current user has a specific permission
 */
export const useHasPermission = (permission: string): boolean => {
    const user = useAppSelector((state) => (state.auth as any).user)
    const combinedAuthority = useUserAuthorities()

    // Super admins and admins get elevated permissions by default
    if (combinedAuthority.includes('super_admin') || combinedAuthority.includes('admin')) {
        return true
    }

    const permissions = user?.permissions || []
    return permissions.includes(permission) ||
        permissions.includes(`credit:${permission}`) ||
        permissions.includes(`system:${permission}`)
}
