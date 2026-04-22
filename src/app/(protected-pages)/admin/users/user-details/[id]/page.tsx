'use client'

import { useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
    const router = useRouter()
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

    // Ensure we don't flash "Not Found" during initial fetch on refresh
    const isProcessing = loading || (!data && !error)

    if (isProcessing) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4 animate-in fade-in duration-700">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase">Retrieving Profile...</p>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in duration-500">
                <NoUserFound height={280} width={280} />
                <h2 className="mt-8 text-3xl font-black text-gray-900 dark:text-white tracking-tight capitalize">Member Not Found</h2>
                <p className="mt-3 text-gray-500 max-w-md font-medium leading-relaxed">The member identity requested does not exist in the alumni registry or has been decommissioned from the system.</p>
                
                {error && (
                    <div className="mt-8 p-5 bg-rose-50 dark:bg-rose-900/10 rounded-[2rem] border border-rose-100 dark:border-rose-800/30 text-rose-600 text-[11px] font-bold tracking-tight max-w-sm flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                        <span>System Error: {error}</span>
                    </div>
                )}

                <div className="mt-10 flex items-center gap-4">
                    <button 
                        onClick={() => router.push('/admin/users')}
                        className="px-6 h-12 rounded-2xl border border-gray-100 dark:border-gray-800 text-[11px] font-black tracking-widest uppercase hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                        Back to Directory
                    </button>
                    <button 
                        onClick={() => id && dispatch(fetchUserDetails(id))}
                        className="px-8 h-12 rounded-2xl bg-primary text-white text-[11px] font-black tracking-widest uppercase shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        Retry Load
                    </button>
                </div>
            </div>
        )
    }

    return <UserDetails data={data} />
}
