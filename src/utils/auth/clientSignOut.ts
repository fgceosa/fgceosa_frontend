'use client'

import appConfig from '@/configs/app.config'

const clientSignOut = async () => {
    try {
        // Immediately clear all client-side storage
        if (typeof window !== 'undefined') {
            // Clear all storage
            localStorage.clear()
            sessionStorage.clear()
            
            // Clear all cookies (more aggressive approach)
            document.cookie.split(';').forEach((c) => {
                const eqPos = c.indexOf('=')
                const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim()
                
                // Clear all possible NextAuth cookies
                const cookiesToClear = [
                    'next-auth.session-token',
                    '__Secure-next-auth.session-token',
                    'next-auth.csrf-token', 
                    '__Secure-next-auth.csrf-token',
                    'next-auth.callback-url',
                    '__Secure-next-auth.callback-url',
                    name // Also clear the current cookie
                ]
                
                cookiesToClear.forEach(cookieName => {
                    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
                    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`
                    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`
                })
            })
            
            // Call NextAuth signout API directly
            try {
                await fetch('/api/auth/signout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        csrfToken: await getCsrfToken(),
                        callbackUrl: appConfig.unAuthenticatedEntryPath
                    })
                })
            } catch (fetchError) {
                console.log('Direct signout API call failed:', fetchError)
            }
            
            // Add a flag to prevent middleware from redirecting
            sessionStorage.setItem('signing-out', 'true')
            
            // Force immediate redirect
            window.location.href = appConfig.unAuthenticatedEntryPath
        }
    } catch (error) {
        console.error('Logout error:', error)
        
        // Ultimate fallback - force redirect
        if (typeof window !== 'undefined') {
            window.location.href = appConfig.unAuthenticatedEntryPath
        }
    }
}

// Helper function to get CSRF token
const getCsrfToken = async (): Promise<string> => {
    try {
        const response = await fetch('/api/auth/csrf')
        const data = await response.json()
        return data.csrfToken || ''
    } catch {
        return ''
    }
}

export default clientSignOut
