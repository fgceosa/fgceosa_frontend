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
import { usePathname } from 'next/navigation'
import type { User } from '@/@types/auth'
import TopUpModal from './Topup/TopUpModal'
import { Button } from '../ui'
import { Zap } from 'lucide-react'
import { useAppSelector } from '@/store'
import { selectPlatformSettingsData } from '@/store/slices/platformSettings'
import Wallet from './Wallet'
import { useUserAuthorities, useHasPermission } from '@/utils/hooks/useAuthorization'
import { BiWalletAlt, BiLogOut, BiChevronDown } from 'react-icons/bi'
import Dropdown from '@/components/ui/Dropdown'
import Avatar from '@/components/ui/Avatar'
import forceLogout from '@/utils/auth/forceLogout'
import { selectWorkspaces, selectCurrentWorkspace, selectLastFetched, selectWorkspacesLoading } from '@/store/slices/workspace/workspaceSelectors'
import { setCurrentWorkspace, fetchWorkspace } from '@/store/slices/workspace'
import { fetchWorkspaces } from '@/store/slices/workspace/workspaceThunk'
import WorkspaceSwitcher from '@/app/(protected-pages)/workspace/_components/WorkspaceSwitcher'
import CreateWorkspaceDialog from '@/app/(protected-pages)/workspace/_components/CreateWorkspaceDialog'
import { selectCurrentOrganizationId } from '@/store/slices/organization/organizationSelectors'
import { useAppDispatch } from '@/store'
import { useRouter } from 'next/navigation'

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
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false)

    const platformSettings = useAppSelector(selectPlatformSettingsData)
    const combinedAuthorities = useUserAuthorities()
    const canTopUp = useHasPermission('can_top_up_org_wallet') || combinedAuthorities.includes('user')

    const dispatch = useAppDispatch()
    const router = useRouter()
    const workspaces = useAppSelector(selectWorkspaces)
    const currentWorkspace = useAppSelector(selectCurrentWorkspace)
    const lastFetched = useAppSelector(selectLastFetched)
    const workspacesLoading = useAppSelector(selectWorkspacesLoading)
    const organizationId = useAppSelector(selectCurrentOrganizationId)
    const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false)

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

    const platformName = platformSettings?.general.platformName || 'QOREBIT'

    const role = () => {
        if (combinedAuthorities.includes('platform_super_admin'))
            return 'Platform Admin'
        if (combinedAuthorities.includes('admin') || combinedAuthorities.includes('org_admin') || combinedAuthorities.includes('org_super_admin'))
            return 'Admin Dashboard'
        return 'User Dashboard'
    }

    const isUserDashboard = role() === 'User Dashboard'

    const user = session?.user as any
    const userName = user?.userName || user?.name || user?.email || 'User'
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
                        logoWidth={60}
                        logoHeight={45}
                    />
                }
                isOpen={isOpen}
                bodyClass={classNames('p-0')}
                width={330}
                placement={direction === DIR_RTL ? 'right' : 'left'}
                onClose={handleDrawerClose}
                onRequestClose={handleDrawerClose}
            >
                {/* Balance & Top Up Section */}
                <div className="px-5 py-6">
                    <div className="relative group bg-blue-50/50 dark:bg-primary/5 rounded-[1.5rem] p-5 border border-blue-100/50 dark:border-primary/10 transition-all duration-300">
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
                                    <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                    Top Up Credit
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="px-4 mb-2">
                    <div className="h-px bg-gray-100 dark:bg-gray-800/60"></div>
                </div>

                <Suspense fallback={<></>}>
                    {isOpen && (
                        <>
                            <div className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                {role()}
                            </div>

                            {workspaces && !isUserDashboard && !combinedAuthorities.includes('platform_super_admin') && (
                                <div className="px-5 pb-4">
                                    <WorkspaceSwitcher
                                        workspaces={workspaces}
                                        currentWorkspace={currentWorkspace}
                                        onWorkspaceChange={(ws) => {
                                            dispatch(setCurrentWorkspace(ws))
                                            dispatch(fetchWorkspace(ws.id))
                                            handleDrawerClose()
                                        }}
                                        onCreateNew={(combinedAuthorities.includes('org_super_admin') || combinedAuthorities.includes('platform_super_admin')) ? () => setIsCreateWorkspaceOpen(true) : undefined}
                                    />
                                </div>
                            )}
                            <VerticalMenuContent
                                collapsed={false}
                                navigationTree={navigationTree}
                                routeKey={currentRouteKey}
                                userAuthority={combinedAuthorities}
                                direction={direction}
                                onMenuItemClick={handleDrawerClose}
                            />
                            {/* Prominent User Profile Section */}
                            <div className="mt-auto px-5 py-6 bg-gradient-to-b from-transparent to-blue-50/50 dark:to-gray-900/80">
                                <div className="relative group bg-white dark:bg-gray-800 rounded-[1.5rem] p-4 border border-gray-100 dark:border-gray-700 shadow-xl shadow-[#0055BA]/5 transition-all duration-300">
                                    <div className="flex items-center gap-4">
                                        <Avatar size={48} className="bg-gradient-to-br from-[#0055BA] to-blue-600 text-white shadow-lg ring-4 ring-blue-50 dark:ring-gray-900 flex-shrink-0">
                                            <span className="text-sm font-black tracking-wider">{userInitials}</span>
                                        </Avatar>
                                        <div className="flex-1 min-w-0 pr-2">
                                            <div className="text-[14px] font-black tracking-tight text-gray-900 dark:text-white truncate">
                                                {userName}
                                            </div>
                                            <div className="text-[11px] font-bold text-gray-400 dark:text-gray-500 truncate mt-0.5">
                                                {userEmail}
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleSignOut}
                                            className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all hover:shadow-lg hover:shadow-red-500/20 active:scale-90 flex-shrink-0 group/logout"
                                            title="Sign Out"
                                        >
                                            <BiLogOut size={22} className="group-hover/logout:-translate-x-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </Suspense>
            </Drawer>
            <TopUpModal
                isOpen={isTopUpModalOpen}
                onClose={() => setIsTopUpModalOpen(false)}
                organizationId={organizationId || undefined}
                workspaceId={currentWorkspace?.id}
            />
            <CreateWorkspaceDialog
                isOpen={isCreateWorkspaceOpen}
                onClose={() => setIsCreateWorkspaceOpen(false)}
            />
        </>
    )
}

export default MobileNav
