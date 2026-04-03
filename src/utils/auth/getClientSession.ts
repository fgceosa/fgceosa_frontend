'use client'

/**
 * Get the current session access token on the client side
 * This retrieves the token from the session stored in memory/state
 */
export function getAccessToken(): string | null {
    // The token should be stored in localStorage or a global state
    // after successful login
    if (typeof window !== 'undefined') {
        return sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken')
    }
    return null
}

/**
 * Set the access token after login
 */
export function setAccessToken(token: string, remember: boolean = false): void {
    if (typeof window !== 'undefined') {
        if (remember) {
            localStorage.setItem('accessToken', token)
        } else {
            sessionStorage.setItem('accessToken', token)
        }
    }
}

/**
 * Clear the access token on logout
 */
export function clearAccessToken(): void {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('accessToken')
        localStorage.removeItem('accessToken')
    }
}
