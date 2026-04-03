'use client'

import { useEffect, useState, createContext, useContext } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store'
import {
    fetchWorkspaces,
    fetchWorkspace,
    updateWorkspace
} from '@/store/slices/workspace/workspaceThunk'
import {
    selectWorkspaces,
    selectCurrentWorkspace,
    selectWorkspacesLoading,
    selectOperationsLoading,
    selectLastFetched
} from '@/store/slices/workspace/workspaceSelectors'
import { setCurrentWorkspace } from '@/store/slices/workspace/workspaceSlice'
import { setNavigationTree } from '@/store/slices/navigation/navigationSlice'
import { setCurrentOrganization } from '@/store/slices/organization/organizationSlice'
import organizationsNavigationConfig from '@/configs/navigation.config/organizations-navigation.config'
import { Button, Notification, toast, Spinner } from '@/components/ui'
import { Building2, CheckCircle2, Plus, Edit3, Settings, ShieldCheck } from 'lucide-react'
import QorebitLoading from '@/components/shared/QorebitLoading'
import WorkspaceSwitcher from '../workspace/_components/WorkspaceSwitcher'
import EditWorkspaceDialog from '../workspace/_components/EditWorkspaceDialog'
import CreateWorkspaceDialog from '@/app/(protected-pages)/workspace/_components/CreateWorkspaceDialog'
import type { Workspace } from '../workspace/types'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import type { User } from '@/@types/auth'
import ApiService from '@/services/ApiService'
import { apiGetMyOrganization } from '@/services/OrganizationService'
import classNames from '@/utils/classNames'


import { OrganizationContext, useOrganization } from './OrganizationContext'
export { useOrganization }
import type { OrganizationContextType } from './types'

export default function OrganizationsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const pathname = usePathname()
    const { session } = useCurrentSession()
    const user = session?.user as User

    const workspaces = useAppSelector(selectWorkspaces) || []
    const currentWorkspace = useAppSelector(selectCurrentWorkspace)
    const workspacesLoading = useAppSelector(selectWorkspacesLoading)
    const lastFetched = useAppSelector(selectLastFetched)

    const [isEditWorkspaceOpen, setIsEditWorkspaceOpen] = useState(false)
    const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false)
    const [organization, setOrganization] = useState<OrganizationContextType>({
        organizationId: null,
        organizationName: null,
        userRole: null
    })
    const [orgLoading, setOrgLoading] = useState(true)

    const isUserLoaded = !!user?.email;
    const isPlatformAdmin = user?.authority?.some((role: string) => role.startsWith('platform_'));
    const isAccessDenied = isUserLoaded &&
        !user?.authority?.includes('org_super_admin') &&
        !user?.authority?.includes('org_admin') &&
        !user?.authority?.includes('org_member') &&
        !user?.authority?.includes('user') &&
        !isPlatformAdmin;

    // Access Control: Guard for org_super_admin
    useEffect(() => {
        if (!isUserLoaded) return;

        if (isAccessDenied) {
            // If user is not an org admin, redirect to personal dashboard
            toast.push(
                <Notification type="danger" duration={5000}>
                    Access Denied: Organization privileges required.
                </Notification>
            )
            router.push('/dashboard')
        }
    }, [user, isUserLoaded, isAccessDenied, router])

    // Fetch user's organization
    useEffect(() => {
        const fetchOrganization = async () => {
            try {
                setOrgLoading(true)
                const response = await apiGetMyOrganization()

                if (response) {
                    setOrganization({
                        organizationId: response.id,
                        organizationName: response.name,
                        userRole: response.userRole
                    })
                    dispatch(setCurrentOrganization({
                        id: response.id,
                        role: response.userRole
                    }))
                }
            } catch (error: any) {
                // If it's a 404, the user might not have an organization yet (legacy user or race condition)
                // We don't want to show a scary error in this specific case, just leave it null
                if (error?.response?.status !== 404) {
                    console.error('Failed to fetch organization:', error)
                    // Only show toast for non-404 errors
                    if (error?.response?.status >= 500) {
                        toast.push(
                            <Notification type="danger" duration={5000}>
                                Failed to load organization details. Please contact support.
                            </Notification>
                        )
                    }
                }
            } finally {
                setOrgLoading(false)
            }
        }

        if (isUserLoaded && !isAccessDenied) {
            fetchOrganization()
        } else if (isUserLoaded && isAccessDenied) {
            setOrgLoading(false)
        }
    }, [user, isUserLoaded, isAccessDenied])

    // Load workspaces if not already loaded
    useEffect(() => {
        if (!lastFetched && !workspacesLoading && isUserLoaded && !isAccessDenied) {
            dispatch(fetchWorkspaces())
        }
    }, [dispatch, lastFetched, workspacesLoading, isUserLoaded, isAccessDenied])

    // Set default workspace if none selected
    useEffect(() => {
        if (!currentWorkspace && workspaces.length > 0 && isUserLoaded && !isAccessDenied) {
            dispatch(setCurrentWorkspace(workspaces[0]))
        }
    }, [currentWorkspace, workspaces, dispatch, isUserLoaded, isAccessDenied])

    // Update Sidebar Navigation
    useEffect(() => {
        dispatch(setNavigationTree(organizationsNavigationConfig))
    }, [dispatch])

    const handleWorkspaceChange = (workspace: Workspace) => {
        dispatch(setCurrentWorkspace(workspace))
        // Optionally refresh page or data
    }

    // Instead of returning null/loading for the whole layout, 
    // we render the shell and handle loading inside.
    if (isAccessDenied) {
        return null;
    }

    if (!isUserLoaded) {
        return <QorebitLoading />;
    }

    const isLoading = (workspacesLoading && !lastFetched) || orgLoading;

    const isChatPage = pathname.startsWith('/organizations/chat')
    const grayBgPaths = [
        '/organizations/dashboard',
        '/organizations/team',
        '/organizations/workspaces',
        '/organizations/roles-permissions',
        '/organizations/credits-usage',
        '/organizations/ai-playground',
        '/organizations/model-library'
    ]
    const hasGrayBg = grayBgPaths.includes(pathname) || isChatPage

    return (
        <OrganizationContext.Provider value={organization}>
            <div className={classNames("flex flex-col min-h-full transition-colors duration-300", hasGrayBg ? "bg-[#f5f5f5] dark:bg-gray-900" : "bg-white dark:bg-gray-900")}>
                {/* Workspace Context Header - Hidden on Dashboard and Chat as they have their own headers */}
                {pathname !== '/organizations/dashboard' && !isChatPage && currentWorkspace && (
                    <div className={classNames(
                        "sticky top-0 z-30 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 sm:px-8 py-4",
                        hasGrayBg ? "bg-[#f5f5f5]/80 dark:bg-gray-900/80" : "bg-white/80 dark:bg-gray-900/80"
                    )}>
                        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shrink-0">
                                    <Building2 className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                                            {currentWorkspace.name}
                                        </h1>
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 lg:hidden">
                                <WorkspaceSwitcher
                                    workspaces={workspaces}
                                    currentWorkspace={currentWorkspace}
                                    onWorkspaceChange={handleWorkspaceChange}
                                    onCreateNew={organization.userRole === 'org_super_admin' ? () => setIsCreateWorkspaceOpen(true) : undefined}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Page Content */}
                <div className={classNames("flex-1", !isChatPage && "pb-16")}>
                    {isLoading ? (
                        <div className={classNames(
                            "animate-pulse space-y-8",
                            isChatPage ? "h-screen w-full" : "max-w-[1400px] mx-auto p-4 sm:p-8"
                        )}>
                            <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                            <div className="h-40 w-full bg-gray-100 dark:bg-gray-800/50 rounded-[2.5rem]"></div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="h-32 bg-gray-100 dark:bg-gray-800/50 rounded-2xl"></div>
                                <div className="h-32 bg-gray-100 dark:bg-gray-800/50 rounded-2xl"></div>
                                <div className="h-32 bg-gray-100 dark:bg-gray-800/50 rounded-2xl"></div>
                            </div>
                        </div>
                    ) : (
                        children
                    )}
                </div>

                {/* Shared Dialogs */}
                {currentWorkspace && (
                    <EditWorkspaceDialog
                        workspace={currentWorkspace}
                        isOpen={isEditWorkspaceOpen}
                        onClose={() => setIsEditWorkspaceOpen(false)}
                    />
                )}

                {/* Create Workspace Dialog */}
                <CreateWorkspaceDialog
                    isOpen={isCreateWorkspaceOpen}
                    onClose={() => setIsCreateWorkspaceOpen(false)}
                />
            </div>
        </OrganizationContext.Provider>
    )
}
