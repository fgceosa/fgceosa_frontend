'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { fetchUsers, fetchUsersAnalytics, selectUsersTotal } from '@/store/slices/admin/users'
import UsersHeader from './_components/UsersHeader'
import UsersTable from './_components/UsersTable'
import UsersAnalytics from './_components/UsersAnalytics'
import UserManagementTabs from './_components/UserManagementTabs'

/**
 * Users Management - Comprehensive user management for admins
 */
export default function UsersManagementPage() {
    const searchParams = useSearchParams()
    const dispatch = useAppDispatch()
    const total = useAppSelector(selectUsersTotal)

    const query = searchParams.get('query') || undefined
    const pageIndex = parseInt(searchParams.get('pageIndex') || '1') || 1
    const pageSize = parseInt(searchParams.get('pageSize') || '10') || 10
    const sortKey = searchParams.get('sortKey') || undefined
    const order = (searchParams.get('order') as 'asc' | 'desc') || undefined

    useEffect(() => {
        const params = {
            pageIndex,
            pageSize,
            query,
            sortKey,
            order,
        }
        dispatch(fetchUsers(params))
        dispatch(fetchUsersAnalytics())
    }, [dispatch, pageIndex, pageSize, query, sortKey, order])

    return (
        <div className="min-h-screen bg-[#f5f5f5] dark:bg-gray-900/50 -m-4 sm:-m-8 p-4 sm:p-8">
            <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-700 font-sans">
                {/* Enterprise Header */}
                <UsersHeader />

                {/* Background Decoration */}
                <div className="relative">
                    <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full opacity-50 pointer-events-none" />

                    {/* Stats Overview */}
                    <div className="relative z-10 mb-10 text-pretty">
                        <UsersAnalytics />
                    </div>

                    {/* Main Content Area */}
                    <div className="relative z-10 space-y-6">
                        {/* Tabs & Search integrated */}
                        <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-4 sm:p-8">
                            <UserManagementTabs />

                            {/* Users Table */}
                            <UsersTable
                                totalItems={total || 0}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
