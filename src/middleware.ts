import {
    authRoutes as _authRoutes,
    publicRoutes as _publicRoutes,
    protectedRoutes,
} from '@/configs/routes.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import appConfig from '@/configs/app.config'

import { auth } from './auth'
const useSecureCookies = process.env.NODE_ENV === 'production'
const cookiePrefix = 'qorebit'

const authRoutes = Object.entries(_authRoutes).map(([key]) => key)
const publicRoutes = Object.entries(_publicRoutes).map(([key]) => key)

const apiAuthPrefix = `${appConfig.apiPrefix}/auth`

export default auth(async (req) => {
    const { nextUrl } = req
    const isSignedIn = !!req.auth

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)
    const isInvitationRoute = nextUrl.pathname.startsWith('/invitation')

    // Skip auth middleware for NextAuth API routes (including signout)
    if (isApiAuthRoute || nextUrl.pathname.startsWith('/api/auth')) return

    // Skip middleware for invitation routes (allow non-authenticated users)
    if (isInvitationRoute) return

    // Skip middleware during signout process
    if (nextUrl.pathname === appConfig.unAuthenticatedEntryPath) {
        return
    }

    // Skip middleware if going to sign-in or sign-up page
    if (nextUrl.pathname === '/sign-in' || nextUrl.pathname === '/sign-up') {
        return
    }

    // CRITICAL FIX: If the user just logged out (logout=true param) and is visiting
    // an auth page (forgot-password, reset-password, etc.), allow it even if the
    // session cookie hasn't been fully cleared yet on the server.
    // This handles the production race condition where the HttpOnly cookie
    // takes a moment to be invalidated after the server-side logout call.
    const isPostLogout = nextUrl.searchParams.get('logout') === 'true'
    if (isAuthRoute && isPostLogout) {
        return
    }

    const getRedirectUrl = (authority: string[]) => {
        if (authority.includes('platform_super_admin')) {
            return appConfig.adminEntryPath
        }
        if (authority.includes('platform_admin')) {
            return appConfig.platformAdminEntryPath
        }
        if (
            authority.includes('org_super_admin') ||
            authority.includes('org_admin') ||
            authority.includes('org_member')
        ) {
            return '/organizations/dashboard'
        }
        return appConfig.userEntryPath
    }

    if (isAuthRoute) {
        if (isSignedIn) {
            const userAuthority =
                (req.auth?.user as { authority?: string[] })?.authority || []
            return Response.redirect(new URL(getRedirectUrl(userAuthority), nextUrl))
        }
        return
    }

    /** Redirect to unauthenticated entry path if not signed in & path is not public route */
    if (!isSignedIn && !isPublicRoute) {
        let callbackUrl = nextUrl.pathname
        if (nextUrl.search) {
            callbackUrl += nextUrl.search
        }

        return Response.redirect(
            new URL(
                `${appConfig.unAuthenticatedEntryPath}?${REDIRECT_URL_KEY}=${callbackUrl}`,
                nextUrl,
            ),
        )
    }

    /** Role-based access control */
    if (isSignedIn && nextUrl.pathname !== '/access-denied') {
        const routeMeta = protectedRoutes[nextUrl.pathname]
        if (routeMeta) {
            const userAuthority =
                (req.auth?.user as { authority?: string[] })?.authority || []
            const userPermissions =
                (req.auth?.user as { permissions?: string[] })?.permissions || []

            const hasRequiredRole = routeMeta.authority.some((role) =>
                userAuthority.includes(role),
            )

            const hasRequiredPermission = routeMeta.permission
                ? userPermissions.includes(routeMeta.permission)
                : true

            if (!hasRequiredRole || !hasRequiredPermission) {
                const redirectUrl = getRedirectUrl(userAuthority)
                const currentPath = nextUrl.pathname

                // Block redirect loops: If the calculated redirect is the current page,
                // we've exhausted our options. Send them to the unauthenticated entry path.
                if (redirectUrl === currentPath) {
                    console.error('Redirect loop detected in middleware for path:', currentPath)
                    return Response.redirect(new URL(appConfig.unAuthenticatedEntryPath, nextUrl))
                }

                return Response.redirect(new URL(redirectUrl, nextUrl))
            }
        }
    }
})

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api)(.*)'],
}
