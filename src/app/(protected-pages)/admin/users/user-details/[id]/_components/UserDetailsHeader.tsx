'use client'

import { useRouter } from 'next/navigation'
import { Button, toast, Notification } from '@/components/ui'
import { config } from '@/configs/env'
import {
    ChevronLeft,
    User,
    ShieldCheck,
    Calendar,
    MapPin,
    ArrowLeft
} from 'lucide-react'
import type { UserMember } from '@/app/(protected-pages)/admin/users/types'
import classNames from '@/utils/classNames'
import dayjs from 'dayjs'
import { useAppDispatch } from '@/store/hook'
import { updateUser, fetchUserDetails } from '@/store/slices/admin/users/userThunk'
import { useState } from 'react'
import Popconfirm from '@/components/shared/Popconfirm'

interface UserDetailsHeaderProps {
    data: UserMember
}

const getAvatarUrl = (avatarPath: string | null | undefined): string => {
    if (!avatarPath) return ''
    if (avatarPath.startsWith('http') || avatarPath.startsWith('https')) {
        return avatarPath
    }
    return `${config.apiUrl}${avatarPath}`
}

const UserDetailsHeader = ({ data }: UserDetailsHeaderProps) => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false)

    const handleBack = () => {
        router.push('/admin/users')
    }

    const handleStatusChange = async () => {
        const newStatus = data.status === 'active' ? 'inactive' : 'active'
        const action = newStatus === 'active' ? 'activated' : 'deactivated'

        setLoading(true)
        try {
            await dispatch(updateUser({ id: data.id, data: { status: newStatus } })).unwrap()

            toast.push(
                <Notification title={`User ${action}`} type="success">
                    User has been successfully {action}.
                </Notification>
            )

            // Refresh details
            dispatch(fetchUserDetails(data.id))
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Failed to update user status
                </Notification>
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative overflow-hidden mb-6 p-5 md:p-6 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none font-sans">
            {/* Background Decorative Blobs */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none" />

            <div className="relative z-10">
                {/* Top Row: Back Button and Breadcrumbs */}
                <div className="flex items-center gap-4 mb-4">
                    <Button
                        variant="plain"
                        size="sm"
                        onClick={handleBack}
                        className="h-9 w-9 p-0 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-gray-400 tracking-[0.2em]">Users</span>
                        <span className="h-1 w-1 rounded-full bg-gray-300" />
                        <span className="text-[10px] font-black text-primary tracking-[0.2em]">Profile Details</span>
                    </div>
                </div>

                {/* Profile Overview Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-5 text-center sm:text-left">
                        <div className="relative shrink-0">
                            {data.avatar ? (
                                <img
                                    src={getAvatarUrl(data.avatar)}
                                    alt="Profile"
                                    className="w-16 md:w-20 h-16 md:h-20 bg-gray-100 rounded-[22px] md:rounded-[26px] object-cover shadow-xl ring-4 ring-blue-50 dark:ring-blue-900/20"
                                />
                            ) : (
                                <div className="w-16 md:w-20 h-16 md:h-20 bg-primary rounded-[22px] md:rounded-[26px] flex items-center justify-center shadow-xl ring-4 ring-blue-50 dark:ring-blue-900/20 overflow-hidden text-white font-black text-xl md:text-2xl">
                                    {data.name ? data.name.charAt(0).toUpperCase() : (data.firstName ? data.firstName.charAt(0).toUpperCase() : 'U')}
                                </div>
                            )}
                            <div className={classNames(
                                "absolute -bottom-1 -right-1 w-7 h-7 border-4 border-white dark:border-gray-900 rounded-full flex items-center justify-center shadow-lg transition-colors",
                                data.status === 'active' ? "bg-green-500" : "bg-amber-500"
                            )} title={data.status || 'Active'}>
                                <ShieldCheck className="h-3.5 w-3.5 text-white" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <h1 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                                    {data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'User'}
                                </h1>
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30 text-[9px] font-black tracking-widest whitespace-nowrap">
                                    {data.role || 'User'}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-3">
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-bold tracking-tight">
                                    <User className="h-4 w-4 text-primary" />
                                    <span>{data.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-bold tracking-tight">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span>{data.city || data.country || 'Global Account'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-bold tracking-tight">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span>Joined {dayjs(data.createdAt || data.lastOnline).format('MMM D, YYYY')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                        {data.status === 'active' ? (
                            <Popconfirm
                                title="Are you sure you want to deactivate this user? They will lose access to all platform features until reactivated."
                                onConfirm={handleStatusChange}
                                okColorClass="bg-rose-600 hover:bg-rose-700"
                                confirmText="Deactivate"
                            >
                                <Button
                                    variant="plain"
                                    className="h-12 w-full sm:w-auto px-6 border border-gray-200 dark:border-gray-700 rounded-2xl font-black tracking-widest text-[10px] text-gray-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 dark:hover:bg-rose-900/10 transition-all"
                                    loading={loading}
                                >
                                    Deactivate User
                                </Button>
                            </Popconfirm>
                        ) : (
                            <Button
                                variant="plain"
                                className="h-12 w-full sm:w-auto px-6 border border-emerald-200 dark:border-emerald-700 rounded-2xl font-black tracking-widest text-[10px] text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:hover:bg-emerald-900/10 transition-all"
                                onClick={handleStatusChange}
                                loading={loading}
                            >
                                Activate User
                            </Button>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserDetailsHeader
