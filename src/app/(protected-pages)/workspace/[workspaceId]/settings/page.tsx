'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store'
import { useRequireAuthority } from '@/utils/hooks/useAuthorization'
import {
    fetchWorkspace,
    updateWorkspace,
    deleteWorkspace,
} from '@/store/slices/workspace/workspaceThunk'
import {
    selectCurrentWorkspace,
    selectCurrentWorkspaceLoading,
    selectOperationsLoading,
    selectWorkspaceError,
} from '@/store/slices/workspace/workspaceSelectors'
import {
    Button,
    Card,
    Input,
    Notification,
    toast,
    Dialog,
} from '@/components/ui'
import QorebitLoading from '@/components/shared/QorebitLoading'
import { ArrowLeft, Save, Trash2, Settings as SettingsIcon } from 'lucide-react'
import WorkspacePageLayout from '../../_components/WorkspacePageLayout'
import WorkspaceHeader from '../../_components/WorkspaceHeader'
import WorkspaceTabNavigation from '../../_components/WorkspaceTabNavigation'
import classNames from '@/utils/classNames'

export default function WorkspaceSettingsPage() {
    const params = useParams()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const workspaceId = params.workspaceId as string

    // Require org_admin or org_super_admin authority
    useRequireAuthority(['org_admin', 'org_super_admin'])

    const currentWorkspace = useAppSelector(selectCurrentWorkspace)
    const workspaceLoading = useAppSelector(selectCurrentWorkspaceLoading)
    const operationsLoading = useAppSelector(selectOperationsLoading)
    const error = useAppSelector(selectWorkspaceError)

    const [workspaceName, setWorkspaceName] = useState('')
    const [workspaceDescription, setWorkspaceDescription] = useState('')
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    // Fetch workspace details on mount
    useEffect(() => {
        if (workspaceId) {
            dispatch(fetchWorkspace(workspaceId))
        }
    }, [workspaceId, dispatch])

    // Update form when workspace loads
    useEffect(() => {
        if (currentWorkspace) {
            setWorkspaceName(currentWorkspace.name)
            setWorkspaceDescription(currentWorkspace.description)
        }
    }, [currentWorkspace])

    // Show error notification
    useEffect(() => {
        if (error) {
            toast.push(
                <Notification type="danger" duration={3000}>
                    {error}
                </Notification>,
            )
        }
    }, [error])

    const handleUpdateWorkspace = async () => {
        if (!workspaceName.trim()) {
            toast.push(
                <Notification type="warning" duration={2000}>
                    Please enter a workspace name
                </Notification>,
            )
            return
        }

        try {
            await dispatch(
                updateWorkspace({
                    id: workspaceId,
                    name: workspaceName,
                    description: workspaceDescription,
                }),
            ).unwrap()

            toast.push(
                <Notification type="success" duration={2000}>
                    Workspace updated successfully
                </Notification>,
            )
        } catch (err: any) {
            toast.push(
                <Notification type="danger" duration={3000}>
                    {err || 'Failed to update workspace'}
                </Notification>,
            )
        }
    }

    const handleDeleteWorkspace = async () => {
        try {
            await dispatch(deleteWorkspace(workspaceId)).unwrap()

            toast.push(
                <Notification type="success" duration={2000}>
                    Workspace deleted successfully
                </Notification>,
            )

            router.push('/workspace')
        } catch (err: any) {
            toast.push(
                <Notification type="danger" duration={3000}>
                    {err || 'Failed to delete workspace'}
                </Notification>,
            )
        }
    }

    if (workspaceLoading && !currentWorkspace) {
        return <QorebitLoading />
    }

    return (
        <div className="min-h-full bg-[#f5f5f5] dark:bg-gray-950/50">
            <WorkspacePageLayout
                fullWidth={true}
                header={
                    <WorkspaceHeader
                        title="Workspace Settings"
                        description="Update your workspace name and general settings."
                        icon={SettingsIcon}
                        iconBgClass="bg-gradient-to-br from-gray-600 to-gray-800"
                        tag="Workspace setting"
                    />
                }
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 transition-all duration-700 relative z-10">
                    {/* General Settings */}
                    <Card className="lg:col-span-2 p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 transition-all">
                        <div className="p-5 sm:p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Save className="w-4 h-4 text-primary" />
                                </div>
                                <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight">Workspace Details</h3>
                            </div>
                        </div>
                        <div className="p-6 sm:p-10 space-y-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 pl-1">
                                    Workspace Name <span className="text-red-500 font-black">*</span>
                                </label>
                                <Input
                                    placeholder="Enter workspace name"
                                    value={workspaceName}
                                    onChange={(e) => setWorkspaceName(e.target.value)}
                                    className="h-14 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 focus:ring-4 focus:ring-primary/10 font-bold text-sm px-6"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 pl-1">
                                    Description
                                </label>
                                <Input
                                    placeholder="Define the primary focus and scope of this workspace..."
                                    value={workspaceDescription}
                                    onChange={(e) => setWorkspaceDescription(e.target.value)}
                                    textArea
                                    rows={4}
                                    className="rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 focus:ring-4 focus:ring-primary/10 font-medium text-base p-6 resize-none"
                                />
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button
                                    variant="solid"
                                    onClick={handleUpdateWorkspace}
                                    loading={operationsLoading}
                                    className="h-14 px-10 bg-primary hover:bg-primary-deep text-white font-black text-[13px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 group"
                                >
                                    <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Danger Zone */}
                    <div className="space-y-8">
                        <Card className="p-0 border-none shadow-xl shadow-red-200/20 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-red-100 dark:border-red-900/30 transition-all hover:border-red-500/30">
                            <div className="p-8 border-b border-red-50 dark:border-red-900/20 bg-red-50/30 dark:bg-red-900/10 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shadow-inner">
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </div>
                                <h3 className="text-lg font-black text-red-600 dark:text-red-400 tracking-tight">Delete Workspace</h3>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="p-4 bg-red-50/50 dark:bg-red-900/5 rounded-2xl border border-red-100/50 dark:border-red-900/20">
                                    <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed italic">
                                        Deleting this workspace will permanently remove all data, projects, and history. This cannot be undone.
                                    </p>
                                </div>
                                <Button
                                    variant="solid"
                                    onClick={() => setIsDeleteDialogOpen(true)}
                                    className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black text-[13px] rounded-2xl shadow-xl shadow-red-200/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    Delete Workspace
                                </Button>
                            </div>
                        </Card>

                        <Card className="p-8 border-none shadow-sm bg-gray-50/30 dark:bg-gray-800/20 rounded-[2rem] border border-gray-100 dark:border-gray-800/50">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-gray-400">Workspace ID</p>
                                <code className="block p-3 bg-white dark:bg-gray-900 rounded-xl text-[10px] font-black text-gray-500 border border-gray-100 dark:border-gray-800 break-all">
                                    {workspaceId}
                                </code>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Delete Workspace Dialog */}
                <Dialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} width={500}>
                    <div className="p-2">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center border border-red-100 dark:border-red-800">
                                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Delete Workspace</h2>
                                <p className="text-[10px] text-gray-400 font-black">Irreversible Action</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <p className="text-gray-500 font-medium leading-relaxed">
                                Are you sure you want to delete this workspace? This action cannot be undone and all data will be permanently removed from the system.
                            </p>

                            <div className="flex justify-end gap-3 pt-6">
                                <button
                                    onClick={() => setIsDeleteDialogOpen(false)}
                                    className="h-12 px-6 font-black text-[11px] text-gray-400 hover:text-gray-900 transition-colors"
                                >
                                    Cancel
                                </button>
                                <Button
                                    variant="solid"
                                    onClick={handleDeleteWorkspace}
                                    loading={operationsLoading}
                                    className="h-12 px-8 bg-red-600 hover:bg-red-700 text-white font-black text-[11px] rounded-xl shadow-xl shadow-red-500/20"
                                >
                                    Delete Workspace
                                </Button>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </WorkspacePageLayout>
        </div>
    )
}
