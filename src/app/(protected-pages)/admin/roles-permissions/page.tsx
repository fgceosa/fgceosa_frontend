'use client'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '@/store'
import { fetchRoles } from '@/store/slices/rolesPermissions'
import { Button } from '@/components/ui'
import QorebitLoading from '@/components/shared/QorebitLoading'
import { Search } from 'lucide-react'
import RolesHeader from './_components/RolesHeader'
import RoleCard from './_components/RoleCard'
import RoleModal from './_components/RoleModal'
import DeleteRoleModal from './_components/DeleteRoleModal'
import RolesTabs from './_components/RolesTabs'
import RolesToolbar from './_components/RolesToolbar'
import PermissionsTab from './_components/PermissionsTab'
import CreatePermissionModal from './_components/CreatePermissionModal'
import { useRolesManagement } from './hooks/useRolesManagement'
import type { PermissionGroup, Role } from './types'

const NoResults = ({ searchTerm, onClear }: { searchTerm: string; onClear: () => void }) => (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
        <div className="w-16 h-16 rounded-3xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center text-gray-400 mb-4 border border-gray-100 dark:border-gray-800">
            <Search size={28} />
        </div>
        <h3 className="text-sm font-black text-gray-900 dark:text-white">No matching results</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Try adjusting your search for "{searchTerm}"</p>
        <Button
            variant="plain"
            className="mt-4 text-primary font-black text-[10px] capitalize "
            onClick={onClear}
        >
            Clear Search
        </Button>
    </div>
)

export default function RolesPermissionsPage() {
    const dispatch = useAppDispatch()
    const [activeTab, setActiveTab] = useState('roles')
    const [searchTerm, setSearchTerm] = useState('')
    const [currentFilter, setCurrentFilter] = useState('all')
    const [currentSort, setCurrentSort] = useState('az')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false)

    const {
        roles,
        isLoading,
        modalState,
        deleteModalState,
        handleCreateRole,
        handleEditRole,
        handleViewRole,
        handleDeleteRole,
        closeRoleModal,
        closeDeleteModal,
        saveRole,
        confirmDeleteRole,
        isSaving
    } = useRolesManagement()

    useEffect(() => {
        dispatch(fetchRoles())
    }, [dispatch])

    const { permissions: permissionGroups, error: rolesError } = useSelector((state: RootState) => state.rolesPermissions)

    const filteredAndSortedRoles = roles
        .filter(role => {
            const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                role.description.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesFilter = currentFilter === 'all' ||
                (currentFilter === 'system' && role.isSystem) ||
                (currentFilter === 'custom' && !role.isSystem)

            return matchesSearch && matchesFilter
        })
        .sort((a, b) => {
            switch (currentSort) {
                case 'az': return a.name.localeCompare(b.name)
                case 'za': return b.name.localeCompare(a.name)
                case 'users-desc': return (b.userCount || 0) - (a.userCount || 0)
                case 'users-asc': return (a.userCount || 0) - (b.userCount || 0)
                default: return 0
            }
        })

    const hasMatchingPermissions = permissionGroups.some((group: PermissionGroup) =>
        group.permissions.some((p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    const showNoResults = searchTerm && (
        (activeTab === 'roles' && filteredAndSortedRoles.length === 0) ||
        (activeTab === 'permissions' && !hasMatchingPermissions)
    )

    if (isLoading && roles.length === 0) {
        return <QorebitLoading />
    }

    return (
        <div className="max-w-[1440px] mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <RolesHeader
                onCreateRole={handleCreateRole}
                onCreatePermission={() => setIsPermissionModalOpen(true)}
                activeTab={activeTab}
            />

            {/* Navigation Tabs */}
            <RolesTabs activeTab={activeTab} onChange={setActiveTab} />

            {/* Toolbar */}
            <RolesToolbar
                onSearch={setSearchTerm}
                filter={currentFilter}
                onFilterChange={setCurrentFilter}
                sortBy={currentSort}
                onSortChange={setCurrentSort}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
            />

            {/* Error Display */}
            {rolesError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl animate-in fade-in duration-500">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400">
                            <Search size={18} />
                        </div>
                        <div>
                            <h4 className="text-xs font-black text-red-900 dark:text-red-200">Failed to Load</h4>
                            <p className="text-[10px] text-red-600/80 dark:text-red-400/80 font-bold mt-0.5">{rolesError}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Based on Active Tab */}
            {activeTab === 'roles' && (
                <div className={viewMode === 'grid'
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700"
                    : "flex flex-col gap-4 animate-in fade-in duration-700"
                }>
                    {filteredAndSortedRoles.map((role: Role) => (
                        <RoleCard
                            key={role.id}
                            role={role}
                            onEdit={handleEditRole}
                            onDelete={handleDeleteRole}
                            onView={handleViewRole}
                            compact={viewMode === 'list'}
                        />
                    ))}
                </div>
            )}

            {activeTab === 'permissions' && <PermissionsTab searchTerm={searchTerm} />}

            {showNoResults && (
                <NoResults searchTerm={searchTerm} onClear={() => setSearchTerm('')} />
            )}

            {/* Modals */}
            <RoleModal
                isOpen={modalState.isOpen}
                onClose={closeRoleModal}
                role={modalState.selectedRole}
                mode={modalState.mode}
                isSaving={isSaving}
                onSave={saveRole}
            />

            <DeleteRoleModal
                isOpen={deleteModalState.isOpen}
                role={deleteModalState.selectedRole}
                onClose={closeDeleteModal}
                isDeleting={deleteModalState.isDeleting}
                onConfirm={confirmDeleteRole}
            />

            <CreatePermissionModal
                isOpen={isPermissionModalOpen}
                onClose={() => setIsPermissionModalOpen(false)}
            />
        </div>
    )
}
