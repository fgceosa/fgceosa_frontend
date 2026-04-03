'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Spinner, Button, Card } from '@/components/ui'
import { apiVerifyOrganizationInvitation } from '@/services/OrganizationService'
import { useAppSelector } from '@/store/hook'
import { HiOutlineOfficeBuilding, HiOutlineUserAdd, HiOutlineLogin, HiOutlineArrowRight } from 'react-icons/hi'

export default function InvitationLandingPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { signedIn, session } = useAppSelector((state) => state.auth.session)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [invitationInfo, setInvitationInfo] = useState<{
        organization_name: string
        organization_id: string
        email: string
    } | null>(null)

    const token = searchParams.get('token')

    useEffect(() => {
        if (!token) {
            setError('Missing invitation token')
            setLoading(false)
            return
        }

        async function verify() {
            try {
                setLoading(true)
                const data = await apiVerifyOrganizationInvitation(token!)
                setInvitationInfo(data)
            } catch (err: any) {
                console.error('Failed to verify invitation:', err)
                let message = 'Invalid or expired invitation link'
                if (err?.response?.data?.detail) {
                    message = err.response.data.detail
                }
                setError(message)
            } finally {
                setLoading(false)
            }
        }

        verify()
    }, [token])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <Spinner size={48} className="text-indigo-600" />
                    <div className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Verifying invitation...</div>
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
                    <Button variant="solid" onClick={() => router.push('/')} block>
                        Go to Homepage
                    </Button>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <Card className="max-w-lg w-full p-8 shadow-xl">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-6 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <HiOutlineOfficeBuilding size={48} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
                        Welcome to Qorebit
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                        You've been invited to join <span className="font-bold text-indigo-600 dark:text-indigo-400">{invitationInfo?.organization_name}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                        To accept this invitation and join your team, please choose an option below.
                    </p>
                </div>

                <div className="space-y-4">
                    {signedIn && (
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl mb-6">
                            <div className="flex flex-col items-center gap-3">
                                <p className="text-sm text-indigo-900 dark:text-indigo-200">
                                    Currently signed in as: <strong>{session?.user?.email}</strong>
                                </p>
                                <Button
                                    variant="solid"
                                    block
                                    onClick={() => router.push(`/invitation/accept?token=${encodeURIComponent(token || '')}`)}
                                    icon={<HiOutlineArrowRight />}
                                >
                                    Continue to Accept
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-3">
                        <Button
                            variant={signedIn ? 'default' : 'solid'}
                            size="lg"
                            block
                            onClick={() => router.push(`/sign-up?invitation_token=${encodeURIComponent(token || '')}`)}
                            icon={<HiOutlineUserAdd />}
                        >
                            {signedIn ? 'Create different account' : 'Create Account to Join'}
                        </Button>
                        <Button
                            variant="default"
                            size="lg"
                            block
                            onClick={() => router.push(`/sign-in?invitation_token=${encodeURIComponent(token || '')}`)}
                            icon={<HiOutlineLogin />}
                        >
                            {signedIn ? 'Login with another account' : 'Sign In to Join'}
                        </Button>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-500 mt-8">
                    © {new Date().getFullYear()} Qorebit AI. All rights reserved.
                </p>
            </Card>
        </div>
    )
}
