'use client'

import classNames from '@/utils/classNames'
import ScrollBar from '@/components/ui/ScrollBar'
import Logo from '@/components/template/Logo'
import VerticalMenuContent from '@/components/template/VerticalMenuContent'
import VerticalMenuIcon from '@/components/template/VerticalMenuContent/VerticalMenuIcon'
import useTheme from '@/utils/hooks/useTheme'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import useNavigation from '@/utils/hooks/useNavigation'
import type { User } from '@/@types/auth'
import queryRoute from '@/utils/queryRoute'
import appConfig from '@/configs/app.config'
import { usePathname, useRouter } from 'next/navigation'
import useSystemSettings from '@/utils/hooks/useSystemSettings'
import Link from 'next/link'
import { useUserAuthorities, useHasPermission } from '@/utils/hooks/useAuthorization'
import { getRoleBasedRedirectUrl, UserRole } from '@/utils/roleBasedRouting'
import { selectUserProfile } from '@/store/slices/userSettings/userSettingsSelectors'
import { getAvatarUrl } from '@/utils/imageUrl'

import {
    SIDE_NAV_WIDTH,
    SIDE_NAV_COLLAPSED_WIDTH,
    SIDE_NAV_CONTENT_GUTTER,
    HEADER_HEIGHT,
    LOGO_X_GUTTER,
} from '@/constants/theme.constant'
import type { Mode } from '@/@types/theme'
import { useState, useEffect } from 'react'
import { BiCreditCard, BiLogOut, BiChevronDown, BiWalletAlt } from 'react-icons/bi'
import { Plus } from 'lucide-react'
import { Button, Dropdown } from '../ui'
import Avatar from '@/components/ui/Avatar'
import forceLogout from '@/utils/auth/forceLogout'
import { useAppSelector, useAppDispatch } from '@/store'

type SideNavProps = {
    background?: boolean
    className?: string
    contentClass?: string
    currentRouteKey?: string
    mode?: Mode
}

const sideNavStyle = {
    width: SIDE_NAV_WIDTH,
    minWidth: SIDE_NAV_WIDTH,
}

const sideNavCollapseStyle = {
    width: SIDE_NAV_COLLAPSED_WIDTH,
    minWidth: SIDE_NAV_COLLAPSED_WIDTH,
}

const SideNav = ({
    background = true,
    className,
    contentClass,
    mode,
}: SideNavProps) => {
    const pathname = usePathname()
    const router = useRouter()

    const route = queryRoute(pathname)

    const { navigationTree } = useNavigation()

    const defaultMode = useTheme((state) => state.mode)
    const direction = useTheme((state) => state.direction)
    const sideNavCollapse = useTheme((state) => state.layout.sideNavCollapse)

    const currentRouteKey = route?.key || ''
    const { session } = useCurrentSession()

    // Redux State
    const dispatch = useAppDispatch()
    const combinedAuthorities = useUserAuthorities()



    const role = (): UserRole => {
        if (combinedAuthorities.includes('super_admin')) return 'super_admin'
        if (combinedAuthorities.includes('admin')) return 'admin'
        return 'member'
    }

    const { settings } = useSystemSettings()
    const platformName = settings.associationName

    const user = session?.user as User
    const userName = (user as any)?.name || user?.userName || 'User'
    const userEmail = user?.email || ''
    const userProfile = useAppSelector(selectUserProfile)
    const firstName = userProfile?.firstName || (session?.user as any)?.firstName || userName.split(' ')[0]
    const userInitials = userName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    const getRoleLabel = (authorities: string[]) => {
        if (authorities.includes('super_admin')) return 'Super Admin'
        if (authorities.includes('admin')) return 'Admin'
        return 'Member'
    }

    const handleSignOut = () => {
        forceLogout()
    }

    const isUserDashboard = role() === 'member'

    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => {
        setIsMounted(true)
    }, [])

    return (
        <div
            style={sideNavCollapse ? sideNavCollapseStyle : sideNavStyle}
            className={classNames(
                'side-nav hidden lg:flex flex-col border-r border-gray-200 dark:border-gray-700 sticky top-0 h-screen z-20 overflow-hidden relative',
                isMounted && 'transition-all duration-300',
                !sideNavCollapse && 'side-nav-expand',
                className,
            )}
        >
            {/* FGCEOSA Branded Background Overlay */}
            <div 
                className="absolute inset-0 z-[-1] pointer-events-none transition-opacity duration-700"
                style={{
                    background: `linear-gradient(180deg, rgba(139, 0, 0, 0.75) 0%, rgba(80, 0, 0, 0.85) 100%), url('/img/others/welcome-bg.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: background ? 1 : 0
                }}
            />
            <div className="relative z-20 bg-white border-b border-gray-100 dark:border-gray-800 transition-all duration-300">
                <Link
                    href={getRoleBasedRedirectUrl({ authority: combinedAuthorities as UserRole[] })}
                    className="flex flex-col items-center justify-center transition-all duration-300"
                    style={{
                        padding: sideNavCollapse ? '4px 10px' : '4px 12px'
                    }}
                >
                    <Logo
                        type={sideNavCollapse ? 'streamline' : 'full'}
                        mode="dark"
                        logoWidth={sideNavCollapse ? 24 : 70}
                        logoHeight={sideNavCollapse ? 24 : 24}
                        className="transition-transform duration-500 hover:scale-105"
                    />
                </Link>
            </div>


            {/* Original Logo - Commented out as requested */}
            {/* <Link
                href={appConfig.authenticatedEntryPath}
                className="side-nav-header flex flex-col justify-center"
                style={{ height: HEADER_HEIGHT }}
            >
                <div
                    className={classNames(
                        'border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900',
                        sideNavCollapse
                            ? SIDE_NAV_CONTENT_GUTTER
                            : LOGO_X_GUTTER,
                    )}
                >
                    <Logo
                        imgClass="max-h-10"
                        mode={mode || defaultMode}
                        type={sideNavCollapse ? 'streamline' : 'full'}
                        className={classNames(
                            sideNavCollapse &&
                                'ltr:ml-[11.5px] ltr:mr-[11.5px]',
                            sideNavCollapse
                                ? SIDE_NAV_CONTENT_GUTTER
                                : LOGO_X_GUTTER,
                        )}
                    />
                </div>
            </Link> */}




            <div className="px-4 mb-2">
                <div className="h-px bg-white/5"></div>
            </div>

            {/* Menu Content */}
            <div className={classNames('side-nav-content flex-1 overflow-hidden', contentClass)}>
                <ScrollBar style={{ height: '100%' }} direction={direction}>
                    <VerticalMenuContent
                        collapsed={sideNavCollapse}
                        navigationTree={navigationTree}
                        routeKey={currentRouteKey}
                        direction={direction}
                        userAuthority={combinedAuthorities}
                        userPermissions={(session?.user as any)?.permissions || []}
                    />
                </ScrollBar>
            </div>

            {/* User Profile Section - Compact Vertical Card */}
            {!sideNavCollapse && (
                <div className="px-4 mb-6 mt-auto pt-4 flex-shrink-0 relative">
                    {/* Top Demarcation Line */}
                    <div className="h-px bg-white/10 mx-4 mb-4"></div>

                    <div className="bg-black/20 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/5 shadow-xl transition-all hover:bg-black/30 group/profile">
                        <div className="p-5 flex flex-col items-center text-center">
                            {/* Avatar */}
                            <Avatar 
                                size={64} 
                                className="bg-gradient-to-br from-white/30 to-white/10 text-white shadow-xl ring-3 ring-white/10 mb-3 transition-transform group-hover/profile:scale-105 duration-500 font-black text-lg"
                                src={getAvatarUrl(userProfile?.avatar) ? `${getAvatarUrl(userProfile?.avatar)}${getAvatarUrl(userProfile?.avatar)?.includes('?') ? '&' : '?'}v=${new Date(userProfile?.updatedAt || Date.now()).getTime()}` : undefined}
                            >
                                {userInitials}
                            </Avatar>

                            {/* Name & Class */}
                            <div className="space-y-1 mb-3 w-full">
                                <h4 className="text-sm font-bold text-white tracking-tight leading-snug break-words whitespace-normal">
                                    {firstName}
                                </h4>
                                <p className="text-white/70 font-medium text-xs">
                                    Class of 2007
                                </p>
                            </div>

                            {/* Role Badge */}
                            <div className="px-4 py-1.5 bg-burgundy/80 rounded-xl border border-white/10 text-white text-[9px] font-black uppercase tracking-widest shadow-md">
                                {getRoleLabel(combinedAuthorities)}
                            </div>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-white/5">
                            <button 
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-6 py-3.5 hover:bg-white/5 text-white/70 hover:text-white transition-all group/logout"
                            >
                                <BiLogOut className="text-[18px] transition-transform group-hover/logout:-translate-x-1" />
                                <span className="text-xs font-bold">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {sideNavCollapse && (
                <div className="border-t border-white/5 p-3 flex justify-center bg-black/5">
                    <Dropdown
                        placement="top-start"
                        renderTitle={
                            <div className="flex items-center justify-center w-12 h-12 rounded-2xl hover:bg-white dark:hover:bg-gray-900 cursor-pointer transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-gray-800 shadow-sm hover:shadow-lg">
                                <Avatar size={36} className="bg-gradient-to-br from-primary to-primary-deep text-white shadow-md">
                                    {userInitials}
                                </Avatar>
                            </div>
                        }
                    >
                        <Dropdown.Item
                            eventKey="sign-out"
                            onClick={handleSignOut}
                            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                        >
                            <div className="flex items-center gap-2 px-1 py-1">
                                <BiLogOut size={18} />
                                <span className="text-[11px] font-bold">Sign out</span>
                            </div>
                        </Dropdown.Item>
                    </Dropdown>
                </div>
            )}

        </div>
    )
}

export default SideNav
