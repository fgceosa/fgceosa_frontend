import { useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import {
    createRole,
    updateRole,
    deleteRole as apiDeleteRole,
} from '@/store/slices/rolesPermissions'
import { selectRoles, selectRolesLoading } from '@/store/slices/rolesPermissions'
import { Role } from '../types'
import { Notification, toast } from '@/components/ui'

export function useRolesManagement() {
    const dispatch = useAppDispatch()
    const roles = useAppSelector(selectRoles)
    const isLoading = useAppSelector(selectRolesLoading)

    const [modalState, setModalState] = useState<{
        isOpen: boolean
        mode: 'create' | 'edit' | 'view'
        selectedRole: Role | null
    }>({
        isOpen: false,
        mode: 'view',
        selectedRole: null
    })

    const [deleteModalState, setDeleteModalState] = useState<{
        isOpen: boolean
        selectedRole: Role | null
        isDeleting: boolean
    }>({
        isOpen: false,
        selectedRole: null,
        isDeleting: false
    })

    const [isSaving, setIsSaving] = useState(false)

    const handleCreateRole = useCallback(() => {
        setModalState({
            isOpen: true,
            mode: 'create',
            selectedRole: null
        })
    }, [])

    const handleEditRole = useCallback((role: Role) => {
        setModalState({
            isOpen: true,
            mode: 'edit',
            selectedRole: role
        })
    }, [])

    const handleViewRole = useCallback((role: Role) => {
        setModalState({
            isOpen: true,
            mode: 'view',
            selectedRole: role
        })
    }, [])

    const handleDeleteRole = useCallback((role: Role) => {
        setDeleteModalState({
            isOpen: true,
            selectedRole: role,
            isDeleting: false
        })
    }, [])

    const closeRoleModal = useCallback(() => {
        setModalState(prev => ({ ...prev, isOpen: false }))
    }, [])

    const closeDeleteModal = useCallback(() => {
        setDeleteModalState(prev => ({ ...prev, isOpen: false }))
    }, [])

    const saveRole = async (roleData: Partial<Role>) => {
        setIsSaving(true)
        try {
            if (modalState.mode === 'create') {
                await dispatch(createRole(roleData)).unwrap()
                toast.push(
                    <Notification type="success" title="Role Created" className="border-none bg-transparent">
                        <p className="text-sm font-bold">New role has been successfully created.</p>
                    </Notification>,
                    { placement: 'top-center' }
                )
            } else if (modalState.mode === 'edit' && modalState.selectedRole) {
                await dispatch(updateRole({
                    id: modalState.selectedRole.id,
                    data: roleData
                })).unwrap()
                toast.push(
                    <Notification type="success" title="Role Updated" className="border-none bg-transparent">
                        <p className="text-sm font-bold">Role permissions have been updated.</p>
                    </Notification>,
                    { placement: 'top-center' }
                )
            }
            closeRoleModal()
        } catch (error) {
            toast.push(
                <Notification type="danger" title="Operation Failed" className="border-none bg-transparent">
                    <p className="text-sm font-bold">{String(error) || 'Failed to save role changes'}</p>
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsSaving(false)
        }
    }

    const confirmDeleteRole = async () => {
        if (!deleteModalState.selectedRole) return

        setDeleteModalState(prev => ({ ...prev, isDeleting: true }))
        try {
            await dispatch(apiDeleteRole(deleteModalState.selectedRole.id)).unwrap()
            toast.push(
                <Notification type="success" title="Role Deleted" className="border-none bg-transparent">
                    <p className="text-sm font-bold">Role has been permanently removed.</p>
                </Notification>,
                { placement: 'top-center' }
            )
            closeDeleteModal()
        } catch (error) {
            toast.push(
                <Notification type="danger" title="Delete Failed" className="border-none bg-transparent">
                    <p className="text-sm font-bold">{String(error) || 'Failed to delete role'}</p>
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setDeleteModalState(prev => ({ ...prev, isDeleting: false }))
        }
    }

    return {
        roles,
        isLoading,
        isSaving,
        modalState,
        deleteModalState,
        handleCreateRole,
        handleEditRole,
        handleViewRole,
        handleDeleteRole,
        closeRoleModal,
        closeDeleteModal,
        saveRole,
        confirmDeleteRole
    }
}
