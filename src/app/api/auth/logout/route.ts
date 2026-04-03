import { NextRequest, NextResponse } from 'next/server'
import appConfig from '@/configs/app.config'

/**
 * Standard server-side logout route optimized for SPEED.
 * Instantly invalidates cookies and redirects.
 */
export async function GET(request: NextRequest) {
    // Derive the base URL from the incoming request so that:
    //   - localhost dev  → http://localhost:3000/sign-in
    //   - production     → https://app.qorebit.ai/sign-in
    // Avoids using NEXT_PUBLIC_APP_URL which is hardcoded to the production domain.
    const requestOrigin = `${request.nextUrl.protocol}//${request.nextUrl.host}`
    const redirectUrl = new URL(`${appConfig.unAuthenticatedEntryPath}?logout=true&ts=${Date.now()}`, requestOrigin)
    const response = NextResponse.redirect(redirectUrl)

    // List of cookies to kill instantly
    const cookiesToClear = [
        'qorebit.session-token', '__Secure-qorebit.session-token',
        'qorebit.csrf-token', '__Host-qorebit.csrf-token',
        'qorebit.callback-url', 'next-auth.session-token',
        '__Secure-next-auth.session-token', 'authjs.session-token',
        '__Secure-authjs.session-token'
    ]

    // Fast cookie death loop
    cookiesToClear.forEach(name => {
        response.cookies.set(name, '', {
            expires: new Date(0),
            path: '/',
            maxAge: 0
        })
        // Segmented cookies
        for (let i = 0; i < 3; i++) {
            response.cookies.set(`${name}.${i}`, '', {
                expires: new Date(0),
                path: '/',
                maxAge: 0
            })
        }
    })

    // Atomic wipe headers
    response.headers.set('Clear-Site-Data', '"cookies", "storage"')
    response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate')

    return response
}

export async function POST(request: NextRequest) {
    return GET(request)
}
