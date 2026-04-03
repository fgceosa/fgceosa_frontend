'use client'

import { useEffect, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import Link from 'next/link'
import forceLogout from '@/utils/auth/forceLogout'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import checkAuthState from '@/utils/debug/checkAuthState'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { fetchUserProfile, selectUserProfile } from '@/store/slices/userSettings'
import { config } from '@/configs/env'
import {
    PiUserDuotone,
    PiSignOutDuotone,
    PiGearDuotone,
    PiPulseDuotone,
} from 'react-icons/pi'
import type { JSX } from 'react'
import { User } from '@/@types/auth'

type DropdownList = {
    label: string
    path: string
    icon: JSX.Element
}

// Helper to get full avatar URL
const getAvatarUrl = (avatarPath: string | null | undefined): string | null => {
    if (!avatarPath) return null
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
        return avatarPath
    }
    const apiUrl = config.apiUrl || ''
    return `${apiUrl}${avatarPath}`
}

const _UserDropdown = () => {
    const dispatch = useAppDispatch()
    const { session } = useCurrentSession()
    const userProfile = useAppSelector(selectUserProfile)

    // Fetch user profile on mount
    useEffect(() => {
        dispatch(fetchUserProfile())
    }, [dispatch])

    const auth = (session?.user as User)?.authority || []
    const profileSettingsPath = auth.includes('platform_super_admin')
        ? '/admin/platform-settings?tab=account'
        : '/dashboard/user-settings'

    const dropdownItemList: DropdownList[] = [
        {
            label: 'Profile Setting',
            path: profileSettingsPath,
            icon: <PiGearDuotone />,
        },
        {
            label: 'Help Center',
            path: '/dashboard/help-center',
            icon: <PiPulseDuotone />, // Reusing icon for help center
        },
    ]

    const handleSignOut = () => {
        forceLogout()
    }

    // Use profile data from Redux instead of session
    const userImage = getAvatarUrl(userProfile?.avatar)

    const profileEmail = userProfile?.email
    const sessionEmail = (session?.user as any)?.email
    const sessionName = (session?.user as any)?.name || (session?.user as any)?.userName

    const userName = (userProfile?.firstName && userProfile?.lastName)
        ? `${userProfile.firstName} ${userProfile.lastName}`
        : (userProfile?.accountType === 'organization' && userProfile?.organizationName)
            ? userProfile.organizationName
            : (userProfile?.username)
                ? userProfile.username
                : sessionName || (profileEmail || sessionEmail)?.split('@')[0] || 'User'

    const userEmail = userProfile?.email || sessionEmail || 'No email available'

    const avatarProps = {
        ...(userImage ? { src: userImage } : { icon: <PiUserDuotone /> }),
    }

    return (
        <Dropdown
            className="flex"
            toggleClassName="flex items-center"
            menuClass="p-0 overflow-hidden rounded-2xl border-none shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-white dark:bg-gray-900 min-w-[240px]"
            renderTitle={
                <div className="flex items-center gap-2 p-1 pr-3 rounded-full border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-800/20 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 group cursor-pointer shadow-sm">
                    <Avatar
                        size={32}
                        className="shadow-sm group-hover:scale-105 transition-transform ring-2 ring-white dark:ring-gray-900"
                        {...avatarProps}
                    />
                    <div className="hidden md:block text-left">
                        <div className="text-[13px] font-bold text-gray-900 dark:text-gray-100 line-clamp-1">
                            {userName}
                        </div>
                    </div>
                </div>
            }
            placement="bottom-end"
        >
            <Dropdown.Item variant="header" className="p-0">
                <div className="relative overflow-hidden p-6 bg-gradient-to-br from-[#0055BA] to-blue-700">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-20 h-20 bg-blue-400/20 rounded-full blur-xl" />

                    <div className="relative flex items-center gap-4">
                        <Avatar
                            size={56}
                            className="ring-4 ring-white/20 shadow-xl"
                            {...avatarProps}
                        />
                        <div className="flex flex-col">
                            <h4 className="text-base font-bold text-white mb-0.5">
                                {userName}
                            </h4>
                            <p className="text-xs text-blue-100 font-medium opacity-90 truncate max-w-[140px]">
                                {userEmail}
                            </p>
                        </div>
                    </div>
                </div>
            </Dropdown.Item>

            <div className="p-2 space-y-1">
                {dropdownItemList.map((item) => (
                    <Dropdown.Item
                        key={item.label}
                        eventKey={item.label}
                        className="p-0 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                    >
                        <Link
                            className="flex items-center gap-3 w-full px-4 py-3"
                            href={item.path}
                        >
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:bg-[#0055BA]/10 group-hover:text-[#0055BA] transition-all">
                                <span className="text-xl">{item.icon}</span>
                            </span>
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                {item.label}
                            </span>
                        </Link>
                    </Dropdown.Item>
                ))}

                <div className="my-2 border-t border-gray-100 dark:border-gray-800" />

                <Dropdown.Item
                    eventKey="Sign Out"
                    className="p-0 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
                    onClick={handleSignOut}
                >
                    <div className="flex items-center gap-3 w-full px-4 py-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-400 group-hover:bg-red-500 group-hover:text-white transition-all shadow-sm group-hover:shadow-red-200">
                            <span className="text-xl">
                                <PiSignOutDuotone />
                            </span>
                        </span>
                        <span className="text-sm font-bold text-red-600 dark:text-red-400">
                            Sign Out
                        </span>
                    </div>
                </Dropdown.Item>
            </div>
        </Dropdown>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown
