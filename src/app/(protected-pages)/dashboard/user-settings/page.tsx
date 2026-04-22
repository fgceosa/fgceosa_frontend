'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserProfileForm from './_components/UserProfileForm'
import {
    fetchUserProfile,
    selectProfileLoading,
    selectUserSettingsError,
} from '@/store/slices/userSettings'
import Loading from '@/components/shared/Loading'
import { Settings } from 'lucide-react'

export default function SettingsPage() {
    const dispatch = useDispatch()
    const isLoading = useSelector(selectProfileLoading)
    const error = useSelector(selectUserSettingsError)

    // Fetch user profile on mount
    useEffect(() => {
        dispatch(fetchUserProfile() as any)
    }, [dispatch])

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loading loading type="association" />
            </div>
        )
    }

    // Show error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-3xl border border-red-100 dark:border-red-900/30 shadow-xl">
                    <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <p className="text-2xl font-bold text-red-600">!</p>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xs mx-auto">{error}</p>
                    <button
                        onClick={() => dispatch(fetchUserProfile() as any)}
                        className="px-6 py-2.5 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg"
                        style={{ backgroundColor: '#8B0000' }}
                    >
                        Retry Loading
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5] dark:bg-gray-900/50 p-4 sm:p-8 overflow-x-hidden">
            <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-700">
                {/* Header Section */}
                <div className="flex flex-col gap-6 pb-2">
                    <div className="space-y-3 lg:space-y-1">
                        <div className="flex items-center gap-3 sm:gap-4 mb-2">
                            <span className="text-[9px] sm:text-xs font-black whitespace-nowrap" style={{ color: '#8B0000' }}>Account Center</span>
                            <div className="h-px w-8 sm:w-12" style={{ backgroundColor: 'rgba(139, 0, 0, 0.2)' }} />
                            <span className="text-[9px] sm:text-xs font-black text-gray-900 dark:text-gray-100 whitespace-nowrap">Preferences</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-2 sm:p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shrink-0">
                                <Settings className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: '#8B0000' }} />
                            </div>
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
                                My Profile
                            </h1>
                        </div>
                        <p className="text-sm sm:text-base lg:text-lg text-gray-500 dark:text-gray-400 lg:pl-14 font-medium max-w-2xl leading-relaxed">
                            Manage your identity and security settings in one central hub.
                        </p>
                    </div>
                </div>


                {/* Background Decoration */}
                <div className="relative">
                    <div className="absolute -inset-4 blur-3xl rounded-full opacity-50 pointer-events-none" style={{ backgroundColor: 'rgba(139, 0, 0, 0.05)' }} />

                    {/* Main Content Areas */}
                    <div className="relative z-10">
                        <UserProfileForm />
                    </div>
                </div>
            </div>
        </div>
    )
}
