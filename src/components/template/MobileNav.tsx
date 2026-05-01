import { useState, Suspense, lazy, useEffect } from 'react'
import classNames from 'classnames'
import Drawer from '@/components/ui/Drawer'
import Logo from '@/components/template/Logo'
import NavToggle from '@/components/shared/NavToggle'
import { DIR_RTL } from '@/constants/theme.constant'
import withHeaderItem, { WithHeaderItemProps } from '@/utils/hoc/withHeaderItem'
import useNavigation from '@/utils/hooks/useNavigation'
import useTheme from '@/utils/hooks/useTheme'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import queryRoute from '@/utils/queryRoute'
import { usePathname, useRouter } from 'next/navigation'
import type { User } from '@/@types/auth'
import { useUserAuthorities, useHasPermission } from '@/utils/hooks/useAuthorization'
import { UserRole } from '@/utils/roleBasedRouting'
import { BiLogOut } from 'react-icons/bi'
import Avatar from '@/components/ui/Avatar'
import forceLogout from '@/utils/auth/forceLogout'
import { useAppDispatch, useAppSelector } from '@/store'
import { selectUserProfile } from '@/store/slices/userSettings/userSettingsSelectors'
import { getAvatarUrl } from '@/utils/imageUrl'

const VerticalMenuContent = lazy(
    () => import('@/components/template/VerticalMenuContent'),
)

type MobileNavToggleProps = {
    toggled?: boolean
}

const MobileNavToggle = withHeaderItem<
    MobileNavToggleProps & WithHeaderItemProps
>(NavToggle)

const MobileNav = () => {
    const [isOpen, setIsOpen] = useState(false)

    const handleOpenDrawer = () => {
        setIsOpen(true)
    }

    const handleDrawerClose = () => {
        setIsOpen(false)
    }

    const pathname = usePathname()
    const route = queryRoute(pathname)
    const currentRouteKey = route?.key || ''
    const direction = useTheme((state) => state.direction)
    const { session } = useCurrentSession()
    const { navigationTree } = useNavigation()

    const combinedAuthorities = useUserAuthorities()
    const dispatch = useAppDispatch()

    const role = (): UserRole => {
        if (combinedAuthorities.includes('super_admin')) return 'super_admin'
        if (combinedAuthorities.includes('admin')) return 'admin'
        return 'member'
    }

    const isUserDashboard = role() === 'member'

    const user = session?.user as any
    const userName = user?.name || user?.userName || 'User'
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

    return (
        <>
            <div
                className="text-2xl block lg:hidden"
                onClick={handleOpenDrawer}
            >
                <MobileNavToggle toggled={isOpen} />
            </div>
            <Drawer
                title={
                    <Logo
                        type="full"
                        mode="dark"
                        logoWidth={100}
                        logoHeight={50}
                        className="mt-4"
                    />
                }
                isOpen={isOpen}
                bodyClass={classNames('p-0 bg-[#8B0000] relative overflow-hidden')}
                width={330}
                placement={direction === DIR_RTL ? 'right' : 'left'}
                onClose={handleDrawerClose}
                onRequestClose={handleDrawerClose}
            >
                <div 
                    className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-overlay"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1523050853064-90ff039ceb2d?q=80&w=2670&auto=format&fit=crop')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                
                <div className="relative z-10 flex flex-col h-full bg-gradient-to-b from-burgundy via-burgundy to-burgundy-deep">
                    <div className="px-4 mb-2">
                        <div className="h-px bg-white/10"></div>
                    </div>

                    <Suspense fallback={<></>}>
                        {isOpen && (
                            <>
                                <div className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                                    {getRoleLabel(combinedAuthorities)}
                                </div>

                                <VerticalMenuContent
                                    collapsed={false}
                                    navigationTree={navigationTree}
                                    routeKey={currentRouteKey}
                                    userAuthority={combinedAuthorities}
                                    direction={direction}
                                    onMenuItemClick={handleDrawerClose}
                                />
                                <div className="mt-auto px-4 py-6">
                                    <div className="h-px bg-white/10 mx-4 mb-4"></div>
                                    <div className="bg-black/20 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/5 shadow-xl transition-all hover:bg-black/30 group/profile">
                                        <div className="p-5 flex flex-col items-center text-center">
                                            <Avatar 
                                                size={64} 
                                                className="bg-gradient-to-br from-white/30 to-white/10 text-white shadow-xl ring-3 ring-white/10 mb-3 font-black text-lg"
                                                src={getAvatarUrl(userProfile?.avatar) ? `${getAvatarUrl(userProfile?.avatar)}${getAvatarUrl(userProfile?.avatar)?.includes('?') ? '&' : '?'}v=${new Date(userProfile?.updatedAt || Date.now()).getTime()}` : undefined}
                                            >
                                                {userInitials}
                                            </Avatar>
                                            <div className="space-y-1 mb-3 w-full">
                                                <h4 className="text-sm font-bold text-white tracking-tight leading-snug break-words whitespace-normal">
                                                    {firstName}
                                                </h4>
                                                <p className="text-white/70 font-medium text-xs">
                                                    Class of 2007
                                                </p>
                                            </div>
                                            <div className="px-4 py-1.5 bg-burgundy/80 rounded-xl border border-white/10 text-white text-[9px] font-black uppercase tracking-widest shadow-md">
                                                {getRoleLabel(combinedAuthorities)}
                                            </div>
                                        </div>
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
                            </>
                        )}
                    </Suspense>
                </div>
            </Drawer>
        </>
    )
}

export default MobileNav
