'use client'

import classNames from '@/utils/classNames'
import ScrollBar from '@/components/ui/ScrollBar'
import Logo from '@/components/template/Logo'
import VerticalMenuContent from '@/components/template/VerticalMenuContent'
import useTheme from '@/utils/hooks/useTheme'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import useNavigation from '@/utils/hooks/useNavigation'
import type { User } from '@/@types/auth'
import queryRoute from '@/utils/queryRoute'
import appConfig from '@/configs/app.config'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUserAuthorities } from '@/utils/hooks/useAuthorization'
import { getRoleBasedRedirectUrl, UserRole } from '@/utils/roleBasedRouting'
import { useHasPermission } from '@/utils/hooks/useAuthorization'

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
import TopUpModal from './Topup/TopUpModal'
import Wallet from './Wallet'
import Avatar from '@/components/ui/Avatar'
import forceLogout from '@/utils/auth/forceLogout'
import { useAppSelector, useAppDispatch } from '@/store'
import {
    selectWorkspaces,
    selectCurrentWorkspace,
} from '@/store/slices/workspace/workspaceSelectors'
import { setCurrentWorkspace, fetchWorkspace } from '@/store/slices/workspace'
import { fetchWorkspaces } from '@/store/slices/workspace/workspaceThunk'
import { selectPlatformSettingsData, fetchPlatformSettings, fetchPublicPlatformSettings } from '@/store/slices/platformSettings'
import { selectLastFetched, selectWorkspacesLoading } from '@/store/slices/workspace/workspaceSelectors'
import { selectCurrentOrganizationId } from '@/store/slices/organization/organizationSelectors'
import WorkspaceSwitcher from '@/app/(protected-pages)/workspace/_components/WorkspaceSwitcher'
import CreateWorkspaceDialog from '@/app/(protected-pages)/workspace/_components/CreateWorkspaceDialog'

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
    const workspaces = useAppSelector(selectWorkspaces)
    const currentWorkspace = useAppSelector(selectCurrentWorkspace)
    const platformSettings = useAppSelector(selectPlatformSettingsData)
    const lastFetched = useAppSelector(selectLastFetched)
    const workspacesLoading = useAppSelector(selectWorkspacesLoading)
    const organizationId = useAppSelector(selectCurrentOrganizationId)
    const combinedAuthorities = useUserAuthorities()
    const canTopUp = useHasPermission('can_top_up_org_wallet') || combinedAuthorities.includes('user')

    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false)
    const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false)

    // Fetch platform settings on mount if not available
    // Use public endpoint for non-platform admins to avoid 403 errors
    useEffect(() => {
        if (!platformSettings) {
            const auth = (session?.user as User)?.authority || []
            const isPlatformAdmin = auth.includes('platform_super_admin') || auth.includes('platform_admin')

            if (isPlatformAdmin) {
                dispatch(fetchPlatformSettings())
            } else {
                dispatch(fetchPublicPlatformSettings())
            }
        }
    }, [dispatch, platformSettings, session])

    // Fetch workspaces if not available and user has org roles
    // Fetch workspaces if not available and user has org roles
    // Fetch workspaces if not available and user has org roles
    // Fetch workspaces if not available and user has org roles
    useEffect(() => {
        if (session.user && (session.user as any).email && (!workspaces || workspaces.length === 0) && !lastFetched && !workspacesLoading) {
            const hasOrgRole = combinedAuthorities.some(a => a.startsWith('org_'))
            const isPlatformAdmin = combinedAuthorities.includes('platform_super_admin') || combinedAuthorities.includes('platform_admin')
            if (hasOrgRole || isPlatformAdmin) {
                dispatch(fetchWorkspaces())
            }
        }
    }, [dispatch, session.user, workspaces, combinedAuthorities, lastFetched, workspacesLoading])

    const role = () => {
        if (combinedAuthorities.includes('platform_super_admin'))
            return 'Platform Admin Dashboard'
        if (combinedAuthorities.includes('admin') || combinedAuthorities.includes('org_admin') || combinedAuthorities.includes('org_super_admin')) return 'Admin Dashboard'
        return 'User Dashboard'
    }

    const platformName = platformSettings?.general.platformName || 'QOREBIT'

    const user = session?.user as User
    const userName = user?.userName || user?.email || 'User'
    const userEmail = user?.email || ''
    const userInitials = userName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    const handleSignOut = () => {
        forceLogout()
    }

    const isUserDashboard = role() === 'User Dashboard'

    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => {
        setIsMounted(true)
    }, [])

    return (
        <div
            style={sideNavCollapse ? sideNavCollapseStyle : sideNavStyle}
            className={classNames(
                'side-nav hidden lg:flex flex-col border-r border-gray-200 dark:border-gray-700 sticky top-0 h-screen z-20',
                isMounted && 'transition-all duration-300',
                background && 'bg-white dark:bg-gray-900',
                !sideNavCollapse && 'side-nav-expand',
                className,
            )}
        >
            <div className="relative group">
                <Link
                    href={getRoleBasedRedirectUrl({ authority: combinedAuthorities as UserRole[] })}
                    className="flex items-center"
                    style={{
                        height: HEADER_HEIGHT,
                        padding: sideNavCollapse ? '0 16px' : '0 24px'
                    }}
                >
                    <Logo
                        type={sideNavCollapse ? 'streamline' : 'full'}
                        mode={mode || defaultMode}
                        logoWidth={sideNavCollapse ? 32 : 120}
                        logoHeight={sideNavCollapse ? 32 : 40}
                    />
                </Link>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
            </div>

            {/* Workspace Context Selector */}
            {workspaces && !isUserDashboard && !combinedAuthorities.includes('platform_super_admin') && (
                <div className={classNames(sideNavCollapse ? "px-2 pb-2" : "px-5 pb-6 pt-4")}>
                    <WorkspaceSwitcher
                        collapsed={sideNavCollapse}
                        workspaces={workspaces}
                        currentWorkspace={currentWorkspace}
                        onWorkspaceChange={(ws) => {
                            dispatch(setCurrentWorkspace(ws))
                            dispatch(fetchWorkspace(ws.id))
                        }}
                        onCreateNew={(combinedAuthorities.includes('org_super_admin') || combinedAuthorities.includes('platform_super_admin')) ? () => setIsCreateWorkspaceOpen(true) : undefined}
                    />
                </div>
            )}

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

            {/* Balance & Top Up Section - Premium Card */}
            {!sideNavCollapse && (
                <div className="px-5 py-6">
                    <div className="relative group bg-blue-50/50 dark:bg-primary/5 rounded-[1.5rem] p-5 border border-blue-100/50 dark:border-primary/10 transition-all duration-300 hover:bg-blue-50 dark:hover:bg-primary/10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <BiWalletAlt className="text-primary w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                                    Balance
                                </span>
                            </div>

                            <Wallet compact variant="default" showIcon={false} />

                            {canTopUp && (
                                <Button
                                    variant="solid"
                                    size="sm"
                                    className="w-full h-12 bg-primary hover:bg-primary-deep text-white font-black text-[10px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group/btn"
                                    onClick={() => setIsTopUpModalOpen(true)}
                                >
                                    <Plus className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                    Top Up Credit
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {sideNavCollapse && canTopUp && (
                <div className="px-3 py-6 flex justify-center">
                    <button
                        className="w-12 h-12 bg-gradient-to-br from-[#0055BA] to-[#003d85] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 text-white transition-all hover:scale-110 active:scale-95 group"
                        onClick={() => setIsTopUpModalOpen(true)}
                    >
                        <BiCreditCard size={20} className="group-hover:rotate-12 transition-transform" />
                    </button>
                </div>
            )}



            <div className="px-4 mb-2">
                <div className="h-px bg-gray-100 dark:bg-gray-800/60"></div>
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

            {/* User Profile Section */}
            {/* User Profile Section - Enterprise Style */}
            {!sideNavCollapse && (
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30">
                    <Dropdown
                        placement="top-start"
                        renderTitle={
                            <div className="flex items-center gap-3 px-3 py-3 rounded-[1.5rem] hover:bg-white dark:hover:bg-gray-900 cursor-pointer transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-gray-800 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none group">
                                <Avatar className="bg-gradient-to-br from-primary to-primary-deep text-white shadow-md ring-2 ring-white dark:ring-gray-800">
                                    {userInitials}
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[12px] font-bold tracking-tight text-gray-900 dark:text-gray-100 truncate">
                                        {userName}
                                    </div>
                                    <div className="text-[10px] font-medium text-gray-400 dark:text-gray-500 truncate opacity-80">
                                        {userEmail}
                                    </div>
                                </div>
                                <BiChevronDown className="text-gray-400 group-hover:text-primary transition-colors" size={20} />
                            </div>
                        }
                    >
                        <Dropdown.Item
                            eventKey="sign-out"
                            onClick={handleSignOut}
                            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                        >
                            <div className="flex items-center gap-3 px-1 py-1">
                                <BiLogOut size={18} />
                                <span className="text-[11px] font-bold">Sign out</span>
                            </div>
                        </Dropdown.Item>
                    </Dropdown>
                </div>
            )}

            {sideNavCollapse && (
                <div className="border-t border-gray-100 dark:border-gray-800 p-3 flex justify-center bg-gray-50/30 dark:bg-gray-900/30">
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

            <TopUpModal
                isOpen={isTopUpModalOpen}
                onClose={() => setIsTopUpModalOpen(false)}
                organizationId={organizationId || undefined}
                workspaceId={combinedAuthorities.includes('org_super_admin') ? undefined : currentWorkspace?.id}
            />

            <CreateWorkspaceDialog
                isOpen={isCreateWorkspaceOpen}
                onClose={() => setIsCreateWorkspaceOpen(false)}
            />
        </div>
    )
}

export default SideNav
