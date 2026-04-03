'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Bot, Sparkles, LayoutGrid, Users } from 'lucide-react'
import { Tabs, Button, Notification, toast } from '@/components/ui'
import QorebitLoading from '@/components/shared/QorebitLoading'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabContent from '@/components/ui/Tabs/TabContent'
import classNames from '@/utils/classNames'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import { useAppSelector } from '@/store/hook'

// Types
import { Copilot, CopilotCategory, TabKey, ViewMode } from './types'

// Components
import CopilotHubHeader from './_components/CopilotHubHeader'
import CopilotControls from './_components/CopilotControls'
import CategoryFilters from './_components/CategoryFilters'
import CopilotCatalog from './_components/CopilotCatalog'
import PrebuiltTemplates from './_components/PrebuiltTemplates'
import CreateCopilotModal from './_components/CreateCopilotModal'
import CopilotDetailsDrawer from './_components/CopilotDetailsDrawer'
import DeleteCopilotDialog from './_components/DeleteCopilotDialog'
import ShareCopilotDialog from './_components/ShareCopilotDialog'
import AssignToWorkspaceDialog from './_components/AssignToWorkspaceDialog'


// Hooks
import { useCopilots } from './hooks/useCopilots'
import { useCopilotFilters } from './hooks/useCopilotFilters'
import { useCopilotActions } from './hooks/useCopilotActions'

export default function CopilotHubPage() {
    const router = useRouter()
    const { session } = useCurrentSession()
    // Type-safe user ID extraction
    const currentUserId = session?.user && 'id' in session.user ? (session.user.id as string) : undefined

    // Read org role from Redux store (set by RoleSync component)
    const orgRole = useAppSelector((state: any) => state.organization?.userRole)
    const roleFetched = useAppSelector((state: any) => state.organization?.roleFetched)

    // Permission Logic
    const userRole = (session?.user as any)?.role || ''
    const userAuthority = (session?.user as any)?.authority || []
    const isSuperadmin = userAuthority.includes('platform_super_admin') || userRole === 'platform_super_admin'
    const isOrgAdmin = userAuthority.includes('org_admin') || userRole === 'org_admin'
    const isOrgSuperAdmin = userAuthority.includes('org_super_admin') || userRole === 'org_super_admin'

    // isOrgMember is only true once the role has been confirmed via Redux (avoids flash)
    const isOrgMember = roleFetched && orgRole === 'org_member'
    const canManageCopilots = (isSuperadmin || isOrgAdmin || isOrgSuperAdmin || userRole === 'platform_admin' || userAuthority.includes('user')) && !isOrgMember

    // UI State — start with 'shared' as safe default
    const [activeTab, setActiveTab] = useState<TabKey>('shared')
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<CopilotCategory | 'all'>('all')

    // Once the org role is confirmed from Redux, set the correct default tab
    useEffect(() => {
        if (roleFetched) {
            setActiveTab(isOrgMember ? 'shared' : 'all')
        }
    }, [roleFetched, isOrgMember])

    // Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false)
    const [selectedCopilot, setSelectedCopilot] = useState<Copilot | null>(null)

    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [copilotToDelete, setCopilotToDelete] = useState<Copilot | null>(null)

    const [showShareDialog, setShowShareDialog] = useState(false)
    const [copilotToShare, setCopilotToShare] = useState<Copilot | null>(null)

    const [showAssignDialog, setShowAssignDialog] = useState(false)
    const [copilotToAssign, setCopilotToAssign] = useState<Copilot | null>(null)



    // Custom Hooks
    const {
        copilots,
        prebuiltTemplates,
        myCopilots,
        isLoading,
        error,
        setCopilots,
        setMyCopilots,
        refreshAll
    } = useCopilots(searchQuery, selectedCategory)

    const filteredCopilots = useCopilotFilters({
        copilots,
        prebuiltTemplates,
        myCopilots,
        activeTab,
        selectedCategory,
        searchQuery,
        currentUserId,
        session
    })

    const {
        deleteCopilot,
        duplicateCopilot,
        toggleVisibility,
        shareCopilot
    } = useCopilotActions({ refreshAll, setCopilots, setMyCopilots })

    // Handlers
    const handleStartChat = (copilot: Copilot) => {
        router.push(`/dashboard/copilot-hub/chat/${copilot.id}`)
    }

    const handleEditCopilot = (copilot: Copilot) => {
        router.push(`/dashboard/copilot-hub/${copilot.id}/settings`)
    }

    const handleCopilotClick = (copilot: Copilot) => {
        setSelectedCopilot(copilot)
        setIsDetailsDrawerOpen(true)
    }

    // Delete Flow
    const initiateDelete = (copilot: Copilot) => {
        const isOfficial = (copilot as any).isOfficial === true ||
            (copilot as any).is_official === true ||
            (copilot as any).isFeatured === true ||
            (copilot as any).is_featured === true ||
            (copilot as any).isOfficial === 'true' ||
            (copilot as any).is_official === 'true'

        if (isOfficial && !isSuperadmin) {
            toast.push(
                <Notification type="warning" title="System Protected" duration={7000}>
                    This is a platform-certified prebuilt template and cannot be deleted by organizations. You can, however, duplicate it to customize your own version.
                </Notification>
            )
            return
        }

        if (copilot.createdBy !== currentUserId && !canManageCopilots) {
            toast.push(
                <Notification type="warning" title="Access Denied" duration={5000}>
                    You do not have administrative clearance to decommission this copilot. Only the original creator can perform this action.
                </Notification>
            )
            return
        }

        setCopilotToDelete(copilot)
        setShowDeleteDialog(true)
    }

    const confirmDelete = async () => {
        if (!copilotToDelete) return
        const success = await deleteCopilot(copilotToDelete)
        if (success) {
            setShowDeleteDialog(false)
            setCopilotToDelete(null)
        }
    }

    // Share Flow
    const initiateShare = (copilot: Copilot) => {
        if (copilot.createdBy !== currentUserId && !canManageCopilots) {
            toast.push(
                <Notification title="Access Denied" type="warning">
                    Only the copilot owner can share it.
                </Notification>
            )
            return
        }
        setCopilotToShare(copilot)
        setShowShareDialog(true)
    }

    const confirmShare = async (emails: string[], message: string) => {
        if (!copilotToShare) return
        if (emails.length === 0) {
            toast.push(
                <Notification title="Error" type="warning">
                    Please enter at least one email address.
                </Notification>
            )
            return
        }
        const success = await shareCopilot(copilotToShare, emails, message)
        if (success) {
            setShowShareDialog(false)
            setCopilotToShare(null)
        }
    }

    // Assign to Workspace Flow
    const initiateAssign = (copilot: Copilot) => {
        setCopilotToAssign(copilot)
        setShowAssignDialog(true)
    }

    const handleAssignSuccess = (updatedCopilot: Copilot) => {
        // Update local state if needed
        setCopilots(prev => prev.map(c => c.id === updatedCopilot.id ? updatedCopilot : c))
        setMyCopilots(prev => prev.map(c => c.id === updatedCopilot.id ? updatedCopilot : c))
    }

    // Create Flow
    const handleCopilotCreated = (newCopilot: Copilot) => {
        setIsCreateModalOpen(false)
        setCopilots(prev => [newCopilot, ...prev])
        setMyCopilots(prev => [newCopilot, ...prev])
        refreshAll()
    }



    return (
        <div className="py-8 px-4 sm:px-6 space-y-8 w-full">
            <CopilotHubHeader
                onCreateClick={() => setIsCreateModalOpen(true)}
                allowCreate={canManageCopilots}
            />

            <Tabs
                value={activeTab}
                onChange={(val) => setActiveTab(val as TabKey)}
                className="w-full"
            >
                <div className="flex flex-col gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                        <TabList className="flex gap-2 p-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 w-fit min-w-max">
                            {(isSuperadmin || isOrgAdmin || isOrgSuperAdmin) && (
                                <TabNav value="all" className={getTabClass(activeTab === 'all')}>
                                    <LayoutGrid className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">All Copilots</span>
                                    <span className="sm:hidden">All</span>
                                </TabNav>
                            )}
                            {!isOrgMember && (
                                <TabNav value="templates" className={getTabClass(activeTab === 'templates')}>
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Prebuilt templates</span>
                                    <span className="sm:hidden">Templates</span>
                                </TabNav>
                            )}
                            <TabNav value="my-copilots" className={getTabClass(activeTab === 'my-copilots')}>
                                <Bot className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">My Copilots</span>
                                <span className="sm:hidden">Mine</span>
                            </TabNav>
                            {isOrgMember && (
                                <TabNav value="shared" className={getTabClass(activeTab === 'shared')}>
                                    <Users className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Shared with me</span>
                                    <span className="sm:hidden">Shared</span>
                                </TabNav>
                            )}
                            {(isOrgAdmin || isOrgSuperAdmin || isSuperadmin) && (
                                <TabNav value="workspace" className={getTabClass(activeTab === 'workspace')}>
                                    <Users className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Workspace</span>
                                    <span className="sm:hidden">Team</span>
                                </TabNav>
                            )}
                        </TabList>
                    </div>


                </div>

                <div className="mt-8">
                    {/* All Copilots Tab */}
                    <TabContent value="all" className="w-full">
                        <CopilotControls
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            viewMode={viewMode}
                            setViewMode={setViewMode}
                        />

                        <CategoryFilters
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                        />

                        <CopilotCatalog
                            copilots={filteredCopilots}
                            viewMode={viewMode}
                            currentUserId={currentUserId}
                            onCopilotClick={handleCopilotClick}
                            onStartChat={handleStartChat}
                            onEditCopilot={canManageCopilots ? handleEditCopilot : () => { }}
                            onDeleteCopilot={canManageCopilots ? initiateDelete : undefined}
                            onDuplicateCopilot={canManageCopilots ? duplicateCopilot : undefined}
                            onShareCopilot={initiateShare}
                            onToggleVisibility={toggleVisibility}
                            onAssignToWorkspace={(isOrgAdmin || isOrgSuperAdmin || isSuperadmin) ? initiateAssign : undefined}
                            isLoading={isLoading}
                        />
                    </TabContent>

                    {/* Prebuilt Templates Tab — hidden for org_member */}
                    {!isOrgMember && (
                        <TabContent value="templates" className="w-full">
                            {isLoading ? (
                                <QorebitLoading />
                            ) : prebuiltTemplates.length > 0 && (
                                <PrebuiltTemplates
                                    copilots={prebuiltTemplates}
                                    onCopilotClick={handleCopilotClick}
                                    onStartChat={handleStartChat}
                                    onDuplicateCopilot={duplicateCopilot}
                                />
                            )}
                        </TabContent>
                    )}

                    {/* Shared Content Tabs */}
                    {['my-copilots', 'shared', 'workspace'].map((tab) => (
                        <TabContent key={tab} value={tab} className="w-full">
                            <CopilotCatalog
                                copilots={filteredCopilots}
                                viewMode={viewMode}
                                currentUserId={currentUserId}
                                onCopilotClick={handleCopilotClick}
                                onStartChat={handleStartChat}
                                onEditCopilot={canManageCopilots ? handleEditCopilot : () => { }}
                                onDeleteCopilot={canManageCopilots ? initiateDelete : undefined}
                                onDuplicateCopilot={canManageCopilots ? duplicateCopilot : undefined}
                                onShareCopilot={initiateShare}
                                onToggleVisibility={toggleVisibility}
                                onAssignToWorkspace={(isOrgAdmin || isOrgSuperAdmin || isSuperadmin) ? initiateAssign : undefined}
                                isLoading={isLoading}
                            />
                        </TabContent>
                    ))}
                </div>
            </Tabs>

            {/* Empty State */}
            {!isLoading && !error && filteredCopilots.length === 0 && (
                <EmptyState
                    activeTab={activeTab}
                    onCreateClick={() => setIsCreateModalOpen(true)}
                    canCreate={canManageCopilots}
                />
            )}

            {/* Dialogs and Modals */}
            <CreateCopilotModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCopilotCreated}
            />

            <CopilotDetailsDrawer
                isOpen={isDetailsDrawerOpen}
                copilot={selectedCopilot}
                onClose={() => {
                    setIsDetailsDrawerOpen(false)
                    setSelectedCopilot(null)
                }}
                onStartChat={handleStartChat}
                onEditCopilot={handleEditCopilot}
                onShare={initiateShare}
            />

            <DeleteCopilotDialog
                isOpen={showDeleteDialog}
                copilot={copilotToDelete}
                onClose={() => {
                    setShowDeleteDialog(false)
                    setCopilotToDelete(null)
                }}
                onConfirm={confirmDelete}
            />

            <ShareCopilotDialog
                isOpen={showShareDialog}
                copilot={copilotToShare}
                onClose={() => {
                    setShowShareDialog(false)
                    setCopilotToShare(null)
                }}
                onConfirm={confirmShare}
            />

            <AssignToWorkspaceDialog
                isOpen={showAssignDialog}
                copilot={copilotToAssign}
                onClose={() => {
                    setShowAssignDialog(false)
                    setCopilotToAssign(null)
                }}
                onSuccess={handleAssignSuccess}
            />


        </div>
    )
}

// Sub-components
function getTabClass(isActive: boolean) {
    return classNames(
        "flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black transition-all duration-300 whitespace-nowrap",
        isActive
            ? "bg-white dark:bg-gray-900 text-primary shadow-sm"
            : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
    )
}

function EmptyState({ activeTab, onCreateClick, canCreate }: { activeTab: TabKey, onCreateClick: () => void, canCreate: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center py-32 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="relative mb-8">
                <div className="w-24 h-24 rounded-[2rem] bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center border border-dashed border-gray-200 dark:border-gray-700">
                    <Search className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-gray-900 rounded-xl shadow-lg flex items-center justify-center border border-gray-100 dark:border-gray-800">
                    <Bot className="w-5 h-5 text-primary opacity-50" />
                </div>
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                No copilots found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mb-10 font-medium">
                {activeTab === 'my-copilots'
                    ? (canCreate
                        ? "You haven't created any copilots yet. Create your first copilot to get started!"
                        : "You haven't created any copilots yet. Access shared copilots in the 'Shared' or 'All' tabs.")
                    : "No copilots match your search criteria. Try adjusting your filters or search query."}
            </p>
            {activeTab === 'my-copilots' && canCreate && (
                <Button
                    variant="solid"
                    onClick={onCreateClick}
                    className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 rounded-xl sm:rounded-2xl bg-primary hover:bg-primary-deep text-white font-black text-[11px] shadow-xl shadow-primary/20 flex items-center justify-center gap-3 border-none transform hover:scale-[1.05] transition-all"
                >
                    <Plus className="w-6 h-6" />
                    Create Your First Copilot
                </Button>
            )}
        </div>
    )
}
