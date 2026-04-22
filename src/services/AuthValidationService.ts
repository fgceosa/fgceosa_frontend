
import type { SignInCredential } from '@/@types/auth'

/**
 * Validates user credentials against the backend API.
 * This is a plain function (Edge compatible) that can be used in both 
 * Server Actions and NextAuth configuration/Middleware.
 */
export const validateUserCredentials = async (values: SignInCredential) => {
    const { email, password } = values

    try {
        // Call the backend login endpoint
        const formData = new FormData()
        formData.append('username', email) // FastAPI OAuth2PasswordRequestForm expects 'username' field
        formData.append('password', password)

        const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const apiUrl = `${rawApiUrl.replace(/\/$/, '').replace(/\/api\/v1$/, '')}/api/v1`

        const response = await fetch(`${apiUrl}/login/access-token?ts=${Date.now()}`, {
            method: 'POST',
            body: formData,
            cache: 'no-store',
            headers: {
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache'
            }
        })

        if (!response.ok) {
            // Parse error response to get specific error message
            let errorMessage = 'we couldn\'t sign you in, please try again'

            try {
                const errorData = await response.json()
                if (errorData.detail) {
                    errorMessage = errorData.detail
                }
            } catch (parseError) {
                // If we can't parse the error, use status-based messages
                if (response.status === 401) {
                    errorMessage = 'the email or password you entered is incorrect, please check your credentials and try again'
                } else if (response.status === 403) {
                    errorMessage = 'your account is not active, please contact our support team for help'
                } else if (response.status === 500) {
                    errorMessage = 'we\'re having trouble signing you in right now, please try again in a few moments'
                } else if (response.status === 0) {
                    errorMessage = 'the sign-in request failed, please check your network connection and try again'
                }
            }

            // Throw error with specific message
            throw new Error(errorMessage)
        }

        const tokenData = await response.json()

        // Use the user data directly from login response (includes RBAC authority)
        if (tokenData.user) {
            const userData = {
                id: tokenData.user.userId,
                userName: tokenData.user.userName,
                email: tokenData.user.email,
                avatar: tokenData.user.avatar || '',
                authority: (tokenData.user.authority && tokenData.user.authority.length > 0)
                    ? tokenData.user.authority
                    : ['member'], // Use RBAC roles from backend, fallback to 'member'
                permissions: tokenData.user.permissions || [], // Include granular permissions
                tagNumber: tokenData.user.tag_number || tokenData.user.tagNumber, // Include Qorebit tag
                accessToken: tokenData.access_token, // Store the JWT token
                expiresIn: tokenData.expires_in, // Optional: expiry seconds
                tokenType: tokenData.token_type, // Optional: token type
            }
            return userData
        }

        return null
    } catch (error) {
        console.error('Authentication validation error:', error)

        if (error instanceof Error) {
            throw error
        }

        if (typeof error === 'object' && error !== null && 'message' in error) {
            const errorMessage = String(error.message)
            if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
                throw new Error('the sign-in request failed, please check your network connection and try again')
            }
        }

        throw new Error('we couldn\'t sign you in, please try again or contact support if this continues')
    }
}

/**
 * Validates social login (OAuth) against the backend API.
 * Syncs the OAuth user with the backend database.
 */
export const validateSocialLogin = async (data: {
    email: string
    full_name?: string | null
    avatar?: string | null
    provider: string
}) => {
    try {
        const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const apiUrl = `${rawApiUrl.replace(/\/$/, '')}/api/v1`

        const response = await fetch(`${apiUrl}/login/social`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            cache: 'no-store',
        })

        if (!response.ok) {
            let errorMessage = 'Failed to sync with backend'
            try {
                const errorData = await response.json()
                if (errorData.detail) errorMessage = errorData.detail
            } catch {
                /* ignore */
            }
            throw new Error(errorMessage)
        }

        const tokenData = await response.json()

        if (tokenData.user) {
            return {
                id: tokenData.user.userId,
                userName: tokenData.user.userName,
                email: tokenData.user.email,
                avatar: tokenData.user.avatar || '',
                authority: tokenData.user.authority || ['member'],
                permissions: tokenData.user.permissions || [],
                tagNumber: tokenData.user.tag_number || tokenData.user.tagNumber,
                accessToken: tokenData.access_token,
                tokenType: tokenData.token_type,
            }
        }

        return null
    } catch (error) {
        console.error('Social login validation error:', error)
        throw error
    }
}
