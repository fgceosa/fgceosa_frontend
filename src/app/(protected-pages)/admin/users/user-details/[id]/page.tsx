'use client'

import { useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import UserDetails from './_components/UserDetails'
import type { UserMember } from '@/app/(protected-pages)/admin/users/types'
import NoUserFound from '@/assets/svg/NoUserFound'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import {
    fetchUserDetails,
    clearSelectedMember,
    selectSelectedUserDetails,
    selectUserDetailsLoading,
    selectUsersList,
    selectUsersError
} from '@/store/slices/admin/users'

export default function UserDetailsPage() {
    const params = useParams() as { id?: string }
    const id = params?.id as string
    const dispatch = useAppDispatch()

    const selectedUser = useAppSelector(selectSelectedUserDetails)
    const usersList = useAppSelector(selectUsersList)
    const loading = useAppSelector(selectUserDetailsLoading)
    const error = useAppSelector(selectUsersError)

    // Fallback logic
    const data = useMemo(() => {
        if (selectedUser) return selectedUser as UserMember
        return usersList.find(u => u.id === id) as UserMember | undefined
    }, [selectedUser, usersList, id])

    useEffect(() => {
        if (id) {
            dispatch(fetchUserDetails(id))
        }

        return () => {
            dispatch(clearSelectedMember())
        }
    }, [dispatch, id])

    if (loading && !data) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase">Retrieving Profile...</p>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <NoUserFound height={280} width={280} />
                <h2 className="mt-6 text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase">User Not Found</h2>
                <p className="mt-2 text-gray-500 max-w-md font-medium">The user identity requested does not exist in the current registry or has been decommissioned.</p>
                {error && (
                    <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-800/30 text-red-600 text-[10px] font-mono">
                        Error Registry: {error}
                    </div>
                )}
            </div>
        )
    }

    return <UserDetails data={data} />
}
