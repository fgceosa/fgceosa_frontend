'use client'

import React, { useState } from 'react'
import { Card, Select, Button, toast, Notification } from '@/components/ui'
import Pagination from '@/components/ui/Pagination'
import { Trash2, Ban, CheckCircle } from 'lucide-react'
import { useUserTable } from '../hooks/useUserTable'
import UserTableHeader from './UserTable/UserTableHeader'
import UserTableRow from './UserTable/UserTableRow'
import UserTableEmptyState from './UserTable/UserTableEmptyState'
import UserTableLoadingState from './UserTable/UserTableLoadingState'
import RoleAssignmentDrawer from './RoleAssignmentDrawer'
import AllocateUserCreditsModal from './AllocateUserCreditsModal'
import type { UserMember } from '../types'

interface UsersTableProps {
    totalItems: number
}

/**
 * UsersTable - Main component for displaying the user directory
 */
export default function UsersTable({ totalItems }: UsersTableProps) {
    const {
        users,
        isLoading,
        pageIndex,
        pageSize,
        pageSizeOptions,
        handlePaginationChange,
        handlePageSizeChange,
        selectedRows,
        toggleRow,
        toggleAll,
        clearSelection,
    } = useUserTable()

    const [assignRoleUser, setAssignRoleUser] = useState<UserMember | null>(null)
    const [allocateCreditsUser, setAllocateCreditsUser] = useState<UserMember | null>(null)

    const onBatchDisable = () => {
        toast.push(<Notification type="info" title="Bulk Action">Disabling {selectedRows.length} users...</Notification>)
    }

    const isAllSelected = users.length > 0 && selectedRows.length === users.length

    return (
        <Card className="relative rounded-[2rem] border-none overflow-hidden p-0 bg-transparent shadow-none">
            {/* Bulk Action Bar */}
            {selectedRows.length > 0 && (
                <div className="absolute top-10 right-10 z-50 bg-primary text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-10 animate-in fade-in slide-in-from-right-10 duration-500 border border-white/20">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white/70 mb-0.5">
                            Selection Active
                        </span>
                        <span className="text-sm font-black text-white">
                            {selectedRows.length} {selectedRows.length === 1 ? 'User' : 'Users'} selected
                        </span>
                    </div>

                    <div className="h-10 w-[1px] bg-white/20" />

                    <div className="flex gap-3">
                        <Button
                            size="sm"
                            variant="solid"
                            className="h-11 px-6 text-[11px] font-black bg-white text-primary hover:bg-gray-50 border-none shadow-lg shadow-white/10 rounded-xl"
                            onClick={() => { }}
                        >
                            <CheckCircle size={16} className="mr-2" /> Enable
                        </Button>
                        <Button
                            size="sm"
                            variant="solid"
                            className="h-11 px-6 text-[11px] font-black bg-rose-500 hover:bg-rose-600 border-none shadow-lg shadow-rose-500/20 rounded-xl"
                            onClick={onBatchDisable}
                        >
                            <Ban size={16} className="mr-2" /> Disable
                        </Button>
                        <button
                            className="h-11 px-6 text-[11px] font-black text-white hover:text-white/80 transition-colors"
                            onClick={clearSelection}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">Users List</h3>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Manage your organization's users and their identity roles.</p>
                </div>
            </div>

            {/* Table Area */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <UserTableHeader
                        isAllSelected={isAllSelected}
                        onSelectAll={() => toggleAll(users.map(u => u.id))}
                    />
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {isLoading ? (
                            <UserTableLoadingState rows={pageSize} />
                        ) : users.length === 0 ? (
                            <UserTableEmptyState />
                        ) : (
                            users.map((user) => (
                                <UserTableRow
                                    key={user.id}
                                    user={user}
                                    isSelected={selectedRows.includes(user.id)}
                                    onSelect={toggleRow}
                                    onAssignRole={(u) => setAssignRoleUser(u)}
                                    onAllocateCredits={(u) => setAllocateCreditsUser(u)}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Section */}
            {!isLoading && users.length > 0 && (
                <div className="p-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gray-50/30 dark:bg-gray-900/50">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] items-center gap-2 font-black text-gray-400 flex shrink-0">
                            Show
                            <div className="w-16">
                                <Select
                                    size="sm"
                                    menuPlacement="top"
                                    isSearchable={false}
                                    value={pageSizeOptions.find(opt => opt.value === pageSize)}
                                    options={pageSizeOptions}
                                    onChange={(opt: any) => handlePageSizeChange(opt?.value)}
                                />
                            </div>
                            Per Page
                        </span>
                        <div className="w-px h-4 bg-gray-100 dark:bg-gray-800" />
                        <p className="text-[10px] font-black text-gray-400">
                            Total <span className="text-gray-900 dark:text-white">{totalItems}</span> Users
                        </p>
                    </div>
                    <Pagination
                        pageSize={pageSize}
                        currentPage={pageIndex}
                        total={totalItems}
                        onChange={handlePaginationChange}
                    />
                </div>
            )}

            {/* Role Assignment Drawer */}
            <RoleAssignmentDrawer
                isOpen={!!assignRoleUser}
                onClose={() => setAssignRoleUser(null)}
                user={assignRoleUser}
            />

            {/* Allocate Credits Modal */}
            <AllocateUserCreditsModal
                isOpen={!!allocateCreditsUser}
                onClose={() => setAllocateCreditsUser(null)}
                onSuccess={() => {
                    // Success is handled by toast and refresh in table
                }}
                user={allocateCreditsUser}
            />
        </Card>
    )
}
