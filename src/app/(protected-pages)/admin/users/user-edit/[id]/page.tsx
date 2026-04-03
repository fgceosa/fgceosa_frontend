'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import UserEdit from './_components/UserEdit'
import NoUserFound from '@/assets/svg/NoUserFound'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import {
    fetchUserDetails,
    clearSelectedMember,
    selectSelectedUserDetails,
    selectUserDetailsLoading,
} from '@/store/slices/admin/users'
import type { UserMember } from '@/app/(protected-pages)/admin/users/types'

export default function UserEditPage() {
    const params = useParams() as { id?: string }
    const id = params?.id as string
    const dispatch = useAppDispatch()

    const data = useAppSelector(selectSelectedUserDetails) as UserMember | null
    const loading = useAppSelector(selectUserDetailsLoading)

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
                <p className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase">Loading Registry...</p>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <NoUserFound height={280} width={280} />
                <h2 className="mt-6 text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase">User Not Found</h2>
                <p className="mt-2 text-gray-500 max-w-md font-medium">The user identity requested does not exist in the current registry or has been decommissioned.</p>
            </div>
        )
    }

    return <UserEdit data={data} />
}
