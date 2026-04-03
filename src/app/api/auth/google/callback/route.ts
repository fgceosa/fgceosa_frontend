import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Handle OAuth error
    if (error) {
        console.error('Google OAuth error:', error)
        return NextResponse.redirect(
            new URL(`/copilot-hub?error=google_auth_failed&message=${encodeURIComponent(error)}`, request.url)
        )
    }

    // Validate we have code and state
    if (!code || !state) {
        return NextResponse.redirect(
            new URL('/copilot-hub?error=invalid_callback', request.url)
        )
    }

    // Get stored state and copilot ID from session storage
    // Note: We can't access sessionStorage server-side, so we'll pass the data via URL
    // and handle the actual API call client-side

    // Redirect to a client-side page that will complete the OAuth flow
    const callbackUrl = new URL('/auth/google/complete', request.url)
    callbackUrl.searchParams.set('code', code)
    callbackUrl.searchParams.set('state', state)

    return NextResponse.redirect(callbackUrl)
}
