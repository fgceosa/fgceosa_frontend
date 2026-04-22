import {
    authRoutes as _authRoutes,
    publicRoutes as _publicRoutes,
    protectedRoutes,
} from '@/configs/routes.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import appConfig from '@/configs/app.config'

import { auth } from './auth'

const authRoutes = Object.entries(_authRoutes).map(([key]) => key)
const publicRoutes = Object.entries(_publicRoutes).map(([key]) => key)

const apiAuthPrefix = `${appConfig.apiPrefix}/auth`

/**
 * NextAuth v5 Middleware wrapper
 * We use a named export 'middleware' as well to satisfy specifically Turbopack and 
 * certain Next.js environments that expect it.
 */
const middlewareFunc = auth(async (req) => {
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

    const isPostLogout = nextUrl.searchParams.get('logout') === 'true'
    if (isAuthRoute && isPostLogout) {
        return
    }

    const getRedirectUrl = (authority: string[]) => {
        if (authority.includes('super_admin') || authority.includes('admin')) {
            return appConfig.adminEntryPath
        }
        if (authority.includes('member')) {
            return appConfig.userEntryPath
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

                // Block redirect loops
                if (redirectUrl === currentPath) {
                    console.error('Redirect loop detected in middleware for path:', currentPath)
                    return Response.redirect(new URL(appConfig.unAuthenticatedEntryPath, nextUrl))
                }

                return Response.redirect(new URL(redirectUrl, nextUrl))
            }
        }
    }
})

export default middlewareFunc

// Named export to fix the Turbopack error
export const middleware = middlewareFunc

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api)(.*)'],
}
