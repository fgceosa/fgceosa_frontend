'use client'

import React, { useState } from 'react'
import { Card, Select, Button, toast, Notification } from '@/components/ui'
import ExportMembersButton from './ExportMembersButton'
import Pagination from '@/components/ui/Pagination'
import { Trash2, Ban, CheckCircle, Users } from 'lucide-react'
import { useUserTable } from '../hooks/useUserTable'
import UserTableHeader from './UserTable/UserTableHeader'
import UserTableRow from './UserTable/UserTableRow'
import UserTableEmptyState from './UserTable/UserTableEmptyState'
import UserTableLoadingState from './UserTable/UserTableLoadingState'
import RoleAssignmentDrawer from './RoleAssignmentDrawer'
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



    const isAllSelected = users.length > 0 && selectedRows.length === users.length

    return (
        <Card className="relative rounded-[2rem] border-none overflow-hidden p-0 bg-transparent shadow-none">


            {/* Header Section */}
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-gray-800 shadow-sm">
                        <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-none">Members List</h3>
                        <p className="text-[13px] font-black text-gray-400 mt-1.5 tracking-widest leading-none">Manage members and permissions</p>
                    </div>
                </div>
                <div className="flex justify-end pt-2 sm:pt-0">
                    <ExportMembersButton />
                </div>
            </div>

            {/* Table Area */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <UserTableHeader />
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
                            Total <span className="text-gray-900 dark:text-white">{totalItems}</span> Members
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

            <RoleAssignmentDrawer
                isOpen={!!assignRoleUser}
                onClose={() => setAssignRoleUser(null)}
                user={assignRoleUser}
            />
        </Card>
    )
}
