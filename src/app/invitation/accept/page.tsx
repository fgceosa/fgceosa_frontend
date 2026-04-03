'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast, Notification, Spinner, Button, Card } from '@/components/ui'
import { apiAcceptOrganizationInvitation, apiVerifyOrganizationInvitation } from '@/services/OrganizationService'
import { useAppSelector, useAppDispatch } from '@/store'
import { fetchOrganizationTeam } from '@/store/slices/organization/organizationThunk'
import { HiOutlineOfficeBuilding, HiOutlineCheckCircle } from 'react-icons/hi'

export default function InvitationAcceptPage() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const searchParams = useSearchParams()
    const { signedIn } = useAppSelector((state) => state.auth.session)
    const [loading, setLoading] = useState(true)
    const [accepting, setAccepting] = useState(false)
    const [accepted, setAccepted] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [sessionChecked, setSessionChecked] = useState(false)
    const [invitationInfo, setInvitationInfo] = useState<{
        organization_name: string
        organization_id: string
        email: string
    } | null>(null)

    const token = searchParams.get('token')

    // Give Next.js a moment to hydrate the session before checking signedIn.
    // This prevents a false redirect when the user just signed in and was redirected here.
    useEffect(() => {
        const timer = setTimeout(() => setSessionChecked(true), 800)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (!sessionChecked) return

        if (!signedIn && token) {
            // User is not authenticated — send them to the invitation landing page
            // so they can sign in first, then return here.
            router.push(`/invitation?token=${encodeURIComponent(token)}`)
            return
        }

        if (!token) {
            setError('Missing invitation token')
            setLoading(false)
            return
        }

        async function verifyAndAccept() {
            try {
                setLoading(true)
                const data = await apiVerifyOrganizationInvitation(token!)
                setInvitationInfo(data)

                // Auto-accept the invitation now that we know the user is signed in.
                await doAcceptInvitation(token!, data)
            } catch (err: any) {
                console.error('Failed to verify/accept invitation:', err)
                let message = 'Invalid or expired invitation link'
                if (err?.response?.data?.detail) {
                    message = err.response.data.detail
                }
                setError(message)
            } finally {
                setLoading(false)
            }
        }

        verifyAndAccept()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionChecked, signedIn, token])

    const doAcceptInvitation = async (
        tok: string,
        info?: { organization_name: string; organization_id: string; email: string } | null,
    ) => {
        try {
            setAccepting(true)
            await apiAcceptOrganizationInvitation(tok)
            setAccepted(true)

            const orgName = info?.organization_name || invitationInfo?.organization_name || 'the organization'
            const orgId = info?.organization_id || invitationInfo?.organization_id

            toast.push(
                <Notification type="success" title="Welcome!" duration={4000}>
                    You have successfully joined {orgName}
                </Notification>,
            )

            // Refresh organization team data
            if (orgId) {
                dispatch(fetchOrganizationTeam({ organizationId: orgId }))
            }

            // Small delay so the toast is visible, then redirect to dashboard
            setTimeout(() => router.push('/organizations/dashboard'), 1200)
        } catch (err: any) {
            console.error('Failed to accept invitation:', err)
            let message = 'Failed to join organization. Please try again.'
            if (err?.response?.data?.detail) {
                message = err.response.data.detail
            }
            setError(message)
        } finally {
            setAccepting(false)
        }
    }

    const handleManualRetry = () => {
        if (token) {
            setError(null)
            doAcceptInvitation(token)
        }
    }

    if (!sessionChecked || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <Spinner size={48} className="text-indigo-600" />
                    <div className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
                        Processing your invitation…
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
                <Card className="max-w-md w-full text-center p-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Invitation Error</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                    <div className="space-y-3">
                        {token && (
                            <Button variant="solid" onClick={handleManualRetry} loading={accepting} block>
                                Try Again
                            </Button>
                        )}
                        <Button variant="plain" onClick={() => router.push('/organizations/dashboard')} block>
                            Go to Dashboard
                        </Button>
                    </div>
                </Card>
            </div>
        )
    }

    // Show accepting/accepted state
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <Card className="max-w-lg w-full p-8 shadow-xl">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-6 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        {accepted ? <HiOutlineCheckCircle size={48} /> : <HiOutlineOfficeBuilding size={48} />}
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
                        {accepted ? "You're in! 🎉" : 'Joining Organization…'}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        {accepted
                            ? `You have joined ${invitationInfo?.organization_name}. Redirecting to dashboard…`
                            : (
                                <>
                                    Accepting your invitation to{' '}
                                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                        {invitationInfo?.organization_name}
                                    </span>
                                </>
                            )
                        }
                    </p>
                </div>
                <div className="flex justify-center">
                    <Spinner size={32} className="text-indigo-600" />
                </div>
            </Card>
        </div>
    )
}
