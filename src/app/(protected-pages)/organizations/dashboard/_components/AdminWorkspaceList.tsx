'use client'

import { Card, Button, Dropdown, toast, Notification, Dialog, Pagination } from '@/components/ui'
import { MoreHorizontal, Users, Activity, Settings, ExternalLink, Trash2, Eye, AlertTriangle, Building2, Send, Plus, Search } from 'lucide-react'
import type { Workspace } from '@/app/(protected-pages)/workspace/types'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store'
import { deleteWorkspace, fetchWorkspaces } from '@/store/slices/workspace/workspaceThunk'
import classNames from '@/utils/classNames'
import { useState } from 'react'
import { NAIRA_TO_USD_RATE, CURRENCY_SYMBOL } from '@/constants/currency.constant'

interface AdminWorkspaceListProps {
    workspaces: Workspace[]
    usageMap?: Record<string, number>
    onShareCredits?: (workspace: Workspace) => void
    onAddMember?: (workspace: Workspace) => void
    onCreate?: () => void
    currentPage?: number
    pageSize?: number
    totalCount?: number
    onPageChange?: (page: number) => void
    isAdminUser?: boolean // Whether current user is an admin (affects empty state)
}

export default function AdminWorkspaceList({
    workspaces,
    usageMap = {},
    onShareCredits,
    onAddMember,
    onCreate,
    currentPage = 1,
    pageSize = 20,
    totalCount = 0,
    onPageChange,
    isAdminUser = false
}: AdminWorkspaceListProps) {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [isDeleting, setIsDeleting] = useState(false)
    const [workspaceToDelete, setWorkspaceToDelete] = useState<Workspace | null>(null)

    const handleDelete = async () => {
        if (!workspaceToDelete) return

        setIsDeleting(true)
        try {
            await dispatch(deleteWorkspace(workspaceToDelete.id)).unwrap()
            toast.push(
                <Notification type="success" title="Workspace Deleted" duration={3000}>
                    {workspaceToDelete.name} has been successfully removed.
                </Notification>
            )
            dispatch(fetchWorkspaces({ page: currentPage, pageSize }))
        } catch (error: any) {
            toast.push(
                <Notification type="danger" title="Error" duration={3000}>
                    {error || 'Failed to delete workspace'}
                </Notification>
            )
        } finally {
            setIsDeleting(false)
            setWorkspaceToDelete(null)
        }
    }

    return (
        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 overflow-hidden mx-2 sm:mx-0">
            <div className="p-6 sm:p-10 border-b border-gray-50 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-8 bg-primary rounded-full" />
                    <div className="space-y-1">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Workspaces</h3>
                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400 leading-none">
                            {totalCount > 0 ? totalCount : workspaces.length} {(totalCount || workspaces.length) === 1 ? 'workspace' : 'workspaces'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative group/search hidden md:block">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400 group-focus-within/search:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search workspaces..."
                            className="h-12 w-80 pl-11 pr-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-50 dark:border-gray-800">
                            <th className="px-10 py-5 text-xs font-bold text-gray-600 dark:text-gray-400">Workspace</th>
                            <th className="px-10 py-5 text-xs font-bold text-gray-600 dark:text-gray-400">Team</th>

                            <th className="px-10 py-5 text-xs font-bold text-gray-600 dark:text-gray-400">Status</th>
                            <th className="px-10 py-5 text-xs font-bold text-gray-600 dark:text-gray-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                        {workspaces.map((ws) => (
                            <tr key={ws.id} className="group hover:bg-gray-50/30 dark:hover:bg-gray-800/10 transition-all duration-300 cursor-default">
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-xl font-black text-gray-300 group-hover:text-primary group-hover:border-primary/20 group-hover:shadow-lg group-hover:shadow-primary/5 transition-all duration-500">
                                            {ws.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="space-y-1">
                                            <h4
                                                className="text-base font-bold text-gray-950 dark:text-white group-hover:text-primary transition-colors cursor-pointer flex items-center gap-2"
                                                onClick={() => router.push(`/workspace/${ws.id}`)}
                                            >
                                                {ws.name}
                                            </h4>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600">
                                            <Users className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                                                {ws.totalMembers ?? (ws as any).total_members ?? 0}
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                    {(ws.totalMembers ?? (ws as any).total_members ?? 0) === 1 ? 'member' : 'members'}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-10 py-8">
                                    <div className={classNames(
                                        "inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border transition-all",
                                        ws.status === 'active'
                                            ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/20"
                                            : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                                    )}>
                                        <div className={classNames(
                                            "w-1.5 h-1.5 rounded-full mr-2",
                                            ws.status === 'active' ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
                                        )} />
                                        {ws.status.charAt(0).toUpperCase() + ws.status.slice(1)}
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-right">
                                    <div className="flex items-center justify-end">
                                        <Dropdown
                                            placement="bottom-end"
                                            renderTitle={
                                                <Button
                                                    size="xs"
                                                    variant="plain"
                                                    className="h-10 w-10 p-0 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-all"
                                                >
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </Button>
                                            }
                                        >
                                            <div className="w-[200px] p-2 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl">
                                                <Dropdown.Item onClick={() => router.push(`/workspace/${ws.id}`)}>
                                                    <div className="flex items-center gap-3 p-2 group/item">
                                                        <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 group-hover/item:scale-110 transition-transform">
                                                            <Eye className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">View workspace</span>
                                                    </div>
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => onAddMember?.(ws)}>
                                                    <div className="flex items-center gap-3 p-2 group/item">
                                                        <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 group-hover/item:scale-110 transition-transform">
                                                            <Plus className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Add member</span>
                                                    </div>
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => onShareCredits?.(ws)}>
                                                    <div className="flex items-center gap-3 p-2 group/item">
                                                        <div className="p-1.5 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-500 group-hover/item:scale-110 transition-transform">
                                                            <Send className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Share credits</span>
                                                    </div>
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => router.push(`/workspace/${ws.id}/members`)}>
                                                    <div className="flex items-center gap-3 p-2 group/item">
                                                        <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-primary group-hover/item:scale-110 transition-transform">
                                                            <Users className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Members</span>
                                                    </div>
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => router.push(`/workspace/${ws.id}/settings`)}>
                                                    <div className="flex items-center gap-3 p-2 group/item">
                                                        <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 group-hover/item:scale-110 transition-transform">
                                                            <Settings className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Settings</span>
                                                    </div>
                                                </Dropdown.Item>
                                                <div className="my-2 border-t border-gray-50 dark:border-gray-800" />
                                                <Dropdown.Item
                                                    className="text-rose-600"
                                                    onClick={() => setWorkspaceToDelete(ws)}
                                                >
                                                    <div className="flex items-center gap-3 p-2 group/item">
                                                        <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-500 group-hover/item:scale-110 transition-transform">
                                                            <Trash2 className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-xs font-bold text-rose-600">Delete</span>
                                                    </div>
                                                </Dropdown.Item>
                                            </div>
                                        </Dropdown>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {
                workspaces.length > 0 && (
                    <div className="p-6 sm:p-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400 text-center sm:text-left">
                            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount || workspaces.length)} of {totalCount || workspaces.length} workspaces
                        </p>
                        {(totalCount > pageSize) && (
                            <Pagination
                                currentPage={currentPage}
                                pageSize={pageSize}
                                total={totalCount}
                                onChange={onPageChange}
                            />
                        )}
                    </div>
                )
            }

            {
                workspaces.length === 0 && (
                    <div className="p-8 sm:p-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                            <Building2 className="w-10 h-10 text-gray-200" />
                        </div>
                        {isAdminUser ? (
                            <>
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">No workspaces yet</p>
                                <p className="text-xs text-gray-400 max-w-xs mx-auto">Create your first workspace to start collaborating with your team.</p>
                                <Button
                                    variant="solid"
                                    icon={<Plus className="w-4 h-4" />}
                                    className="bg-primary hover:bg-primary-deep text-white font-black text-[11px] px-10 h-14 rounded-[1.25rem] shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                                    onClick={onCreate}
                                >
                                    Create workspace
                                </Button>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">No workspaces assigned yet</p>
                                <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                                    You're a member of this organization but haven't been assigned to any workspaces yet.
                                    <br />Contact your organization admin to get access.
                                </p>
                            </>
                        )}
                    </div>
                )
            }

            <Dialog
                isOpen={!!workspaceToDelete}
                onClose={() => setWorkspaceToDelete(null)}
                closable={!isDeleting}
            >
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delete workspace</h3>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Confirm deletion</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">This action cannot be undone. All workspace data will be permanently lost.</p>
                        </div>
                    </div>

                    {workspaceToDelete && (
                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 mb-6">
                            <span className="text-xs font-bold text-gray-600 dark:text-gray-400 block mb-1">Deleting</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{workspaceToDelete.name}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-3">
                        <Button
                            variant="plain"
                            size="sm"
                            className="font-bold text-xs"
                            onClick={() => setWorkspaceToDelete(null)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="solid"
                            size="sm"
                            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 shadow-lg shadow-rose-200 dark:shadow-none"
                            onClick={handleDelete}
                            loading={isDeleting}
                        >
                            Delete workspace
                        </Button>
                    </div>
                </div>
            </Dialog>
        </Card >
    )
}
