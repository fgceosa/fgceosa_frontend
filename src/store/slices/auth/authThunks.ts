import { createAsyncThunk } from '@reduxjs/toolkit'
import { onSignInWithCredentials } from '@/server/actions/auth/handleSignIn'
import { signOut as nextAuthSignOut } from '@/auth'
import { apiSignUp } from '@/services/AuthService'
import type { Session } from './sessionSlice'

interface SignInCredentials {
    email: string
    password: string
}

interface SignUpCredentials {
    firstName: string
    lastName: string
    nickname?: string
    email: string
    alternativeEmail?: string
    phoneNumber?: string
    gender: string
    password: string
    confirmPassword?: string
    fgceSet: string
    fgceHouse: string
    city: string
    country: string
    acceptTerms: boolean
    accountType?: 'individual' | 'platform'
    invitationToken?: string
}

interface ApiError {
    response?: {
        status?: number
        data?: {
            detail?: string | ValidationError[]
        }
    }
    message?: string
}

interface ValidationError {
    msg: string
    type?: string
    loc?: (string | number)[]
}

// Sign in with credentials
export const signInAsync = createAsyncThunk<
    { session: Session | null },
    { credentials: SignInCredentials; callbackUrl?: string },
    { rejectValue: string }
>(
    'auth/signIn',
    async ({ credentials, callbackUrl }, { rejectWithValue }) => {
        try {
            const result = await onSignInWithCredentials(credentials, callbackUrl || '')

            if (result?.error) {
                return rejectWithValue(result.error as string)
            }

            // We don't return a mock session here because it can conflict 
            // with the real session fetched from the server after redirect.
            return {
                session: null
            }
        } catch (error: any) {
            // In Next.js 15, redirects from Server Actions (signIn with redirectTo)
            // are thrown as special NEXT_REDIRECT errors. We MUST re-throw them
            // so Next.js can handle the navigation. Calling rejectWithValue would
            // swallow the redirect and leave the user stuck on the signup page.
            if (
                (error instanceof Error && error.message.includes('NEXT_REDIRECT')) ||
                (error && typeof error === 'object' && 'digest' in error && String(error.digest).includes('NEXT_REDIRECT'))
            ) {
                const sentinel = (error && typeof error === 'object' && 'digest' in error)
                    ? String(error.digest)
                    : error.message || 'NEXT_REDIRECT'
                
                // Extract the URL from the Next.js 15 redirect string
                const parts = sentinel.split(';')
                const url = parts.find(p => p.startsWith('/') || p.startsWith('http')) 
                    || parts[parts.length - 1] 
                    || '/'

                return { 
                    session: null,
                    redirect: url 
                } as any
            }

            const errorMessage = (error as any)?.response?.data?.detail
                || (error as any)?.response?.data?.message
                || (error instanceof Error ? error.message : 'Sign in failed')
            return rejectWithValue(errorMessage)
        }
    }
)

// Sign up
export const signUpAsync = createAsyncThunk<
    any,
    SignUpCredentials,
    { rejectValue: string }
>(
    'auth/signUp',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await apiSignUp(credentials)
            return response
        } catch (error: unknown) {
            const apiError = error as ApiError
            console.error('=== SignUp API Error ===')
            console.error('Full error object:', JSON.stringify(error, null, 2))
            console.error('Error response status:', apiError?.response?.status)
            console.error('Error response data:', JSON.stringify(apiError?.response?.data, null, 2))
            console.error('========================')

            // Handle different types of errors
            if (apiError?.response?.status === 400) {
                // Handle existing email or other 400 errors
                const detail = apiError.response.data?.detail
                let errorMessage: string

                if (typeof detail === 'string') {
                    errorMessage = detail
                } else if (Array.isArray(detail)) {
                    // Handle array of validation errors
                    errorMessage = detail.map((err: any) => err.msg || err.message || String(err)).join(', ')
                } else if (detail && typeof detail === 'object') {
                    // Handle object with error details
                    errorMessage = JSON.stringify(detail)
                } else {
                    errorMessage = 'Registration failed. Please check your information and try again.'
                }

                console.log('Returning 400 error:', errorMessage)
                return rejectWithValue(errorMessage)
            } else if (apiError?.response?.status === 422) {
                // Handle validation errors
                const details = apiError.response.data?.detail
                if (details && Array.isArray(details)) {
                    const messages = details.map((detail: ValidationError) => detail.msg)
                    const errorMessage = messages.join(', ')
                    console.log('Returning 422 error:', errorMessage)
                    return rejectWithValue(errorMessage)
                }
                console.log('Returning generic validation error')
                return rejectWithValue('Validation failed')
            } else if (apiError?.response?.data?.detail) {
                // Handle other API errors with detail
                const errorMessage = typeof apiError.response.data.detail === 'string' ? apiError.response.data.detail : 'API error'
                console.log('Returning other API error:', errorMessage)
                return rejectWithValue(errorMessage)
            } else if (apiError?.message) {
                console.log('Returning error message:', apiError.message)
                return rejectWithValue(apiError.message)
            } else {
                console.log('Returning generic signup failed error')
                return rejectWithValue('Sign up failed')
            }
        }
    }
)

// Sign out
export const signOutAsync = createAsyncThunk<
    void,
    void,
    { rejectValue: string }
>(
    'auth/signOut',
    async (_, { rejectWithValue }) => {
        try {
            const { persistor } = await import('@/store/storeSetup')
            await nextAuthSignOut()
            await persistor.purge()
        } catch (error) {
            const errorMessage = (error as any)?.response?.data?.detail
                || (error as any)?.response?.data?.message
                || (error instanceof Error ? error.message : 'Sign out failed')
            return rejectWithValue(errorMessage)
        }
    }
)
