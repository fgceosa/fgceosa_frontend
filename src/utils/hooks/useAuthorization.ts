import { useAppSelector } from '@/store'
import { useRouter } from 'next/navigation'
import { useEffect, useContext } from 'react'
import { OrganizationContext } from '@/app/(protected-pages)/organizations/OrganizationContext'

/**
 * Hook to check if the current user has the required authority/role
 * Checks multiple sources: Redux state, Session, and OrganizationContext
 */
/**
 * Hook to get all combined authorities from multiple sources
 */
export const useUserAuthorities = (): string[] => {
    const user = useAppSelector((state) => state.auth.user)
    const sessionUser = useAppSelector((state) => state.auth.session.session?.user)
    const reduxOrgRole = useAppSelector((state: any) => state.organization?.userRole)
    const orgContext = useContext(OrganizationContext)

    // Redux authorities
    const userAuthority = user.authority || []

    // Session authorities
    const sessionAuthority = (sessionUser as any)?.authority || []
    const sessionRole = (sessionUser as any)?.role || ''

    // Organization context authorities (from /organizations layout)
    const orgUserRole = orgContext?.userRole

    // Combine all unique authorities found
    return Array.from(new Set([
        ...userAuthority,
        ...sessionAuthority,
        ...(sessionRole ? [sessionRole] : []),
        ...(orgUserRole ? [orgUserRole] : []),
        ...(reduxOrgRole ? [reduxOrgRole] : [])
    ]))
}

/**
 * Hook to check if the current user has the required authority/role
 * Checks multiple sources: Redux state, Session, and OrganizationContext
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
    fallbackUrl: string = '/organizations/dashboard'
) => {
    const router = useRouter()
    const hasAuthority = useHasAuthority(requiredAuthority)
    const roleFetched = useAppSelector((state: any) => state.organization?.roleFetched)

    useEffect(() => {
        // Only redirect if we are sure authority check failed AND roles are fetched
        // This avoids premature redirects before data is loaded
        if (!hasAuthority && roleFetched) {
            router.replace(fallbackUrl)
        }
    }, [hasAuthority, roleFetched, router, fallbackUrl])

    return hasAuthority
}

/**
 * Check if user is org_member (lowest level org role)
 */
export const useIsOrgMember = (): boolean => {
    const hasAuthority = useHasAuthority(['org_member'])
    const hasAdminAccess = useHasAuthority(['org_admin', 'org_super_admin'])

    return hasAuthority && !hasAdminAccess
}

/**
 * Hook to check if current user has a specific permission
 */
export const useHasPermission = (permission: string): boolean => {
    const user = useAppSelector((state) => (state.auth as any).user)
    const combinedAuthority = useUserAuthorities()

    // Platform super admins and Org super admins get all permissions by default
    if (combinedAuthority.includes('platform_super_admin') || combinedAuthority.includes('org_super_admin')) {
        return true
    }

    const permissions = user?.permissions || []
    return permissions.includes(permission) ||
        permissions.includes(`credit:${permission}`) ||
        permissions.includes(`system:${permission}`)
}
