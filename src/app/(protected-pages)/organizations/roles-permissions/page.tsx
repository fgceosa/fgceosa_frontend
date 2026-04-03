'use client'

import { useEffect, useState, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { useRequireAuthority } from '@/utils/hooks/useAuthorization'
import {
    fetchOrganizationRoles,
    createOrganizationRole,
    updateOrganizationRole,
    deleteOrganizationRole,
} from '@/store/slices/organization/organizationThunk'
import {
    selectOrganizationRoles,
    selectOrganizationLoading,
} from '@/store/slices/organization/organizationSelectors'
import { Spinner, Notification, toast } from '@/components/ui'
import QorebitLoading from '@/components/shared/QorebitLoading'
import { useOrganization } from '../layout'
import OrgRolesHeader from './_components/OrgRolesHeader'
import OrgRolesToolbar from './_components/OrgRolesToolbar'
import OrgRolesTabs from './_components/OrgRolesTabs'
import OrgRoleCard from './_components/OrgRoleCard'
import OrgRoleDetailsModal from './_components/OrgRoleDetailsModal'
import OrgPermissionsTab from './_components/OrgPermissionsTab'
import OrgRoleModal from './_components/OrgRoleModal'
import DeleteOrgRoleModal from './_components/DeleteOrgRoleModal'
import type { OrganizationRole } from '../types'

export default function OrganizationRolesPermissionsPage() {
    const dispatch = useAppDispatch()
    const { organizationId } = useOrganization()

    // Require org_super_admin authority
    useRequireAuthority(['org_super_admin'])

    const roles = useAppSelector(selectOrganizationRoles)
    const isLoading = useAppSelector(selectOrganizationLoading)

    const [activeTab, setActiveTab] = useState('roles')
    const [searchTerm, setSearchTerm] = useState('')
    const [currentFilter, setCurrentFilter] = useState('all')
    const [currentSort, setCurrentSort] = useState('az')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    // Role Details Modal State
    // Role Details Modal State
    const [selectedRole, setSelectedRole] = useState<OrganizationRole | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [roleModalMode, setRoleModalMode] = useState<'create' | 'edit'>('create')
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        if (organizationId) {
            dispatch(fetchOrganizationRoles(organizationId))
        }
    }, [organizationId, dispatch])

    const filteredAndSortedRoles = useMemo(() => {
        if (!roles) return []

        let result = [...roles]

        // Filter
        if (currentFilter !== 'all') {
            if (currentFilter === 'system') {
                result = result.filter(r => r.isSystem)
            } else if (currentFilter === 'custom') {
                result = result.filter(r => !r.isSystem)
            }
        }

        // Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase()
            result = result.filter(r =>
                r.name.toLowerCase().includes(lowerTerm) ||
                r.description.toLowerCase().includes(lowerTerm) ||
                r.permissions.some(p => p.toLowerCase().includes(lowerTerm))
            )
        }

        // Sort
        result.sort((a, b) => {
            if (currentSort === 'az') return a.name.localeCompare(b.name)
            if (currentSort === 'za') return b.name.localeCompare(a.name)
            return 0
        })

        return result
    }, [roles, currentFilter, searchTerm, currentSort])

    const handleViewRole = (role: OrganizationRole) => {
        setSelectedRole(role)
        setIsDetailsOpen(true)
    }

    const handleCreateRole = () => {
        setRoleModalMode('create')
        setSelectedRole(null) // Clear selected role for create
        setIsEditOpen(true)
    }

    const handleEditRole = (role: OrganizationRole) => {
        setRoleModalMode('edit')
        setSelectedRole(role)
        setIsEditOpen(true)
    }

    const handleDeleteRole = (role: OrganizationRole) => {
        setSelectedRole(role)
        setIsDeleteOpen(true)
    }

    const handleSaveRole = async (roleData: any) => {
        if (!organizationId) return

        setIsSaving(true)
        try {
            if (roleModalMode === 'create') {
                await dispatch(createOrganizationRole({
                    organizationId,
                    data: roleData
                })).unwrap()
                toast.push(<Notification type="success" title="Success">Role created successfully</Notification>)
            } else {
                if (!selectedRole) return
                await dispatch(updateOrganizationRole({
                    organizationId,
                    roleId: selectedRole.id,
                    data: roleData
                })).unwrap()
                toast.push(<Notification type="success" title="Success">Role updated successfully</Notification>)
            }

            setIsEditOpen(false)
        } catch (error: any) {
            console.error("Failed to save role:", error)
            toast.push(<Notification type="danger" title="Error">{error.message || "Failed to save role"}</Notification>)
        } finally {
            setIsSaving(false)
        }
    }

    const handleConfirmDeleteRole = async () => {
        if (!selectedRole || !organizationId) return
        setIsDeleting(true)
        try {
            await dispatch(deleteOrganizationRole({
                organizationId,
                roleId: selectedRole.id
            })).unwrap()
            toast.push(<Notification type="success" title="Success">Role deleted successfully</Notification>)
            setIsDeleteOpen(false)
        } catch (error: any) {
            console.error("Failed to delete role:", error)
            toast.push(<Notification type="danger" title="Error">{error.message || "Failed to delete role"}</Notification>)
        } finally {
            setIsDeleting(false)
        }
    }

    if (!organizationId) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-gray-500">No applicable organization found for the current context.</p>
            </div>
        )
    }

    if (isLoading && roles.length === 0) {
        return <QorebitLoading />
    }

    return (
        <div className="max-w-[1440px] mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <OrgRolesHeader
                activeTab={activeTab}
                onCreateRole={handleCreateRole}
            />

            {/* Navigation Tabs */}
            <OrgRolesTabs activeTab={activeTab} onChange={setActiveTab} />

            {/* Toolbar */}
            <OrgRolesToolbar
                onSearch={setSearchTerm}
                filter={currentFilter}
                onFilterChange={setCurrentFilter}
                sortBy={currentSort}
                onSortChange={setCurrentSort}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
            />

            {/* Content Based on Active Tab */}
            {activeTab === 'roles' && (
                <div className={viewMode === 'grid'
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700"
                    : "flex flex-col gap-4 animate-in fade-in duration-700"
                }>
                    {filteredAndSortedRoles.map((role: OrganizationRole) => (
                        <OrgRoleCard
                            key={role.id}
                            role={role}
                            onView={handleViewRole}
                            onEdit={handleEditRole}
                            onDelete={handleDeleteRole}
                            compact={viewMode === 'list'}
                        />
                    ))}

                    {filteredAndSortedRoles.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 rounded-3xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center text-gray-400 mb-4 border border-gray-100 dark:border-gray-800">
                                <span className="text-2xl">?</span>
                            </div>
                            <h3 className="text-sm font-black text-gray-900 dark:text-white">No matching roles found</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Try adjusting your search criteria</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'permissions' && <OrgPermissionsTab searchTerm={searchTerm} />}

            {/* Modals */}
            <OrgRoleDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                role={selectedRole}
            />

            <OrgRoleModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                role={selectedRole}
                mode={roleModalMode}
                onSave={handleSaveRole}
                isSaving={isSaving}
            />

            <DeleteOrgRoleModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                role={selectedRole}
                onConfirm={handleConfirmDeleteRole}
                isDeleting={isDeleting}
            />
        </div>
    )
}
