'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Spinner } from '@/components/ui'
import { apiGoogleDriveCallback } from '@/services/GoogleDriveService'

export default function GoogleAuthCompletePage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
    const [errorMessage, setErrorMessage] = useState('')
    const hasAttempted = useRef(false)

    useEffect(() => {
        // Prevent double execution in React Strict Mode
        if (hasAttempted.current) {
            return
        }

        const completeAuth = async () => {
            hasAttempted.current = true

            try {
                const code = searchParams.get('code')
                const state = searchParams.get('state')

                if (!code || !state) {
                    setStatus('error')
                    setErrorMessage('Invalid callback parameters')
                    return
                }

                // Get stored state from session storage
                const storedState = sessionStorage.getItem('google_drive_oauth_state')
                const copilotId = sessionStorage.getItem('google_drive_copilot_id')

                // Verify state matches (CSRF protection)
                if (state !== storedState) {
                    setStatus('error')
                    setErrorMessage('Invalid state parameter. Please try connecting again.')
                    return
                }

                // Call backend to exchange code for tokens
                await apiGoogleDriveCallback({ code, state })

                // Clean up session storage
                sessionStorage.removeItem('google_drive_oauth_state')
                sessionStorage.removeItem('google_drive_copilot_id')

                setStatus('success')

                // Redirect back to copilot settings after 2 seconds
                setTimeout(() => {
                    if (copilotId) {
                        router.push(`/dashboard/copilot-hub/${copilotId}/settings?tab=connect-data`)
                    } else {
                        router.push('/dashboard/copilot-hub')
                    }
                }, 2000)
            } catch (error: any) {
                console.error('Failed to complete Google auth:', error)
                setStatus('error')
                setErrorMessage(error.response?.data?.detail || 'Failed to connect Google Drive')
            }
        }

        completeAuth()
    }, [searchParams, router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center">
                {status === 'processing' && (
                    <>
                        <Spinner size={48} className="mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Connecting Google Drive...
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Please wait while we complete the connection
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Google Drive Connected!
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Redirecting you back...
                        </p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Connection Failed
                        </h2>
                        <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                            {errorMessage}
                        </p>
                        <button
                            onClick={() => router.push('/dashboard/copilot-hub')}
                            className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Back to Copilot Hub
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}
