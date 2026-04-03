'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Shield, ShieldCheck, Plus, Edit2, Check, X, ArrowLeft } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store'
import { useRequireAuthority } from '@/utils/hooks/useAuthorization'
import {
    fetchWorkspaceRoles,
    createRole,
    updateRole,
} from '@/store/slices/workspace/workspaceThunk'
import {
    selectWorkspaceRoles,
    selectRolesLoading,
} from '@/store/slices/workspace/workspaceSelectors'
import type { WorkspaceRole, RolePermissions } from '../../types'
import { Card, Button } from '@/components/ui'
import WorkspacePageLayout from '../../_components/WorkspacePageLayout'
import WorkspaceHeader from '../../_components/WorkspaceHeader'
import classNames from '@/utils/classNames'

export default function RolesPage() {
    const params = useParams()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const workspaceId = params.workspaceId as string

    // Require org_super_admin authority
    const hasAuthority = useRequireAuthority(['org_super_admin'])

    const roles = useAppSelector(selectWorkspaceRoles) || []
    const isLoading = useAppSelector(selectRolesLoading)

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [editingRole, setEditingRole] = useState<WorkspaceRole | null>(null)
    const [roleName, setRoleName] = useState('')
    const [roleDescription, setRoleDescription] = useState('')
    const [permissions, setPermissions] = useState<RolePermissions>({
        accessAiCredits: false,
        manageWorkspaces: false,
        createProjects: false,
        manageBilling: false,
        manageIntegrations: false,
        inviteMembers: false,
        manageRoles: false,
        viewReports: false,
        manageMembers: false,
        deleteWorkspace: false,
    })

    useEffect(() => {
        if (workspaceId) {
            dispatch(fetchWorkspaceRoles(workspaceId))
        }
    }, [workspaceId, dispatch])

    const handleCreateRole = async () => {
        if (!roleName.trim()) return

        try {
            await dispatch(
                createRole({
                    workspaceId,
                    name: roleName,
                    description: roleDescription,
                    permissions,
                })
            ).unwrap()

            setIsCreateDialogOpen(false)
            resetForm()
            dispatch(fetchWorkspaceRoles(workspaceId))
        } catch (error) {
            console.error('Failed to create role:', error)
        }
    }

    const handleUpdateRole = async () => {
        if (!editingRole) return

        try {
            await dispatch(
                updateRole({
                    workspaceId,
                    roleId: editingRole.id,
                    data: {
                        name: roleName,
                        description: roleDescription,
                        permissions,
                    },
                })
            ).unwrap()

            setEditingRole(null)
            resetForm()
            dispatch(fetchWorkspaceRoles(workspaceId))
        } catch (error) {
            console.error('Failed to update role:', error)
        }
    }

    const resetForm = () => {
        setRoleName('')
        setRoleDescription('')
        setPermissions({
            accessAiCredits: false,
            manageWorkspaces: false,
            createProjects: false,
            manageBilling: false,
            manageIntegrations: false,
            inviteMembers: false,
            manageRoles: false,
            viewReports: false,
            manageMembers: false,
            deleteWorkspace: false,
        })
    }

    const openEditDialog = (role: WorkspaceRole) => {
        setEditingRole(role)
        setRoleName(role.name)
        setRoleDescription(role.description)
        setPermissions(role.permissions)
    }

    const permissionsList: { key: keyof RolePermissions; label: string; description: string }[] = [
        { key: 'accessAiCredits', label: 'Use AI Credits', description: 'Allow spending the team AI balance on tasks' },
        { key: 'manageWorkspaces', label: 'Workspace Info', description: 'Change the workspace name and profile' },
        { key: 'createProjects', label: 'Create Projects', description: 'Start and manage new team projects' },
        { key: 'manageBilling', label: 'Billing & Pay', description: 'Manage credit cards and view invoices' },
        { key: 'manageIntegrations', label: 'Connect Apps', description: 'Link external tools and applications' },
        { key: 'inviteMembers', label: 'Invite People', description: 'Send email invites to join the team' },
        { key: 'manageRoles', label: 'Manage Rules', description: 'Set what other members are allowed to do' },
        { key: 'viewReports', label: 'View Activity', description: 'See usage stats and team progress' },
        { key: 'manageMembers', label: 'Manage Team', description: 'Remove members or change their details' },
        { key: 'deleteWorkspace', label: 'Delete Workspace', description: 'Permanently remove this whole workspace' },
    ]

    return (
        <div className="min-h-full bg-[#f5f5f5] dark:bg-gray-950/50">
            <WorkspacePageLayout
                fullWidth={true}
                header={
                    <WorkspaceHeader
                        title="Workspace Roles"
                        description="Manage roles and permissions for your workspace members."
                        icon={ShieldCheck}
                        iconBgClass="bg-gradient-to-br from-emerald-600 to-teal-700"
                        tag="Access Control"
                        actions={
                            <Button
                                variant="solid"
                                onClick={() => setIsCreateDialogOpen(true)}
                                className="h-14 px-8 bg-primary hover:bg-primary-deep text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 group w-full lg:w-auto"
                            >
                                <Plus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                Create New Role
                            </Button>
                        }
                    />
                }
            >
                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative z-10 mb-10">
                    {[
                        { title: 'Total Roles', value: roles.length, subtext: 'Defined', color: 'indigo', icon: Shield },
                        { title: 'Custom', value: roles.filter(r => r.isCustom).length, subtext: 'Created', color: 'blue', icon: Edit2 },
                        { title: 'Standard', value: roles.filter(r => !r.isCustom).length, subtext: 'Default', color: 'emerald', icon: Check },
                        { title: 'Total Rules', value: permissionsList.length, subtext: 'Available', color: 'purple', icon: Shield }
                    ].map((stat) => (
                        <Card key={stat.title} className="p-6 border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 group transition-all hover:scale-[1.02]">
                            <div className="flex items-center justify-between mb-4">
                                <div className={classNames(
                                    "w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 shadow-sm",
                                    stat.color === 'indigo' && "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400",
                                    stat.color === 'blue' && "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400",
                                    stat.color === 'emerald' && "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400",
                                    stat.color === 'purple' && "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800 text-purple-600 dark:text-purple-400"
                                )}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.subtext}</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.title}</p>
                                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-none">{stat.value}</h2>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Roles Content */}
                <Card className="p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 relative z-10 transition-all">
                    <div className="p-5 sm:p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between gap-4 bg-gray-50/30 dark:bg-gray-800/20">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center border border-indigo-200/50 dark:border-indigo-800/50">
                                <Shield className="w-4 h-4 text-indigo-600" />
                            </div>
                            <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Team Permissions</h3>
                            <span className="px-2.5 py-1 bg-white dark:bg-gray-800 rounded-lg text-[10px] font-black text-primary border border-gray-100 dark:border-gray-700 shadow-sm uppercase tracking-widest">
                                {roles.length} DEFINED ROLES
                            </span>
                        </div>
                    </div>

                    <div className="p-8">
                        {isLoading ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="bg-gray-50 dark:bg-gray-800/30 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 animate-pulse text-center">
                                        <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-lg w-1/3 mb-4 mx-auto" />
                                        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-lg w-2/3 mb-8 mx-auto" />
                                        <div className="grid grid-cols-2 gap-4">
                                            {[1, 2, 3, 4].map((j) => (
                                                <div key={j} className="h-4 bg-gray-100 dark:bg-gray-800 rounded-lg w-full" />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : roles.length === 0 ? (
                            <div className="py-24 text-center">
                                <div className="w-24 h-24 bg-primary/5 rounded-[40px] flex items-center justify-center mb-8 mx-auto border border-primary/10">
                                    <Shield className="w-12 h-12 text-primary opacity-20" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
                                    No Custom Roles Found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 font-medium mb-10 max-w-sm mx-auto text-base leading-relaxed">
                                    Start by creating a custom permission level to precisely control access for your team operatives.
                                </p>
                                <button
                                    onClick={() => setIsCreateDialogOpen(true)}
                                    className="h-14 px-10 bg-primary hover:bg-primary-deep text-white font-black rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 uppercase tracking-[0.2em] text-[11px]"
                                >
                                    Initialize First Role
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10 transition-all">
                                {roles.map((role) => (
                                    <Card
                                        key={role.id}
                                        className="p-0 border-none shadow-xl shadow-gray-100/50 dark:shadow-none bg-gray-50/50 dark:bg-gray-800/20 rounded-[2.5rem] overflow-hidden group hover:scale-[1.01] transition-all duration-500 border border-gray-100 dark:border-gray-800"
                                    >
                                        <div className="p-8">
                                            <div className="flex items-start justify-between mb-8">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight truncate">
                                                            {role.name}
                                                        </h3>
                                                        {!role.isCustom && (
                                                            <span className="px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 shadow-sm">
                                                                System Standard
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                                        {role.description}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => openEditDialog(role)}
                                                    className="p-3.5 rounded-2xl bg-white dark:bg-gray-900 text-gray-400 hover:text-primary hover:shadow-lg hover:border-primary/20 transition-all border border-gray-100 dark:border-gray-800 shadow-sm group-hover:scale-110"
                                                    title="Configure Role"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="bg-white dark:bg-gray-900 rounded-[1.5rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                                                <div className="flex items-center justify-between mb-5 pb-5 border-b border-gray-50 dark:border-gray-800">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                                        <Shield className="w-3 h-3" />
                                                        Privilege Set
                                                    </span>
                                                    <span className="text-[11px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 rounded-lg">
                                                        {Object.values(role.permissions).filter(Boolean).length} / {permissionsList.length} ACTIVE
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                                    {permissionsList.map((perm) => {
                                                        const isGranted = role.permissions[perm.key as keyof RolePermissions]
                                                        return (
                                                            <div key={perm.key} className="flex items-center gap-3">
                                                                <div className={classNames(
                                                                    "w-2 h-2 rounded-full shadow-sm transition-all duration-500",
                                                                    isGranted
                                                                        ? "bg-emerald-500 shadow-emerald-200 ring-4 ring-emerald-500/10"
                                                                        : "bg-gray-200 dark:bg-gray-800 ring-4 ring-transparent"
                                                                )} />
                                                                <span className={classNames(
                                                                    "text-[13px] font-black uppercase tracking-tight transition-colors truncate",
                                                                    isGranted ? "text-gray-900 dark:text-gray-100" : "text-gray-400 dark:text-gray-500"
                                                                )}>
                                                                    {perm.label}
                                                                </span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>
            </WorkspacePageLayout>

            {/* Create/Edit Dialog - Redesigned to match Create Project Modal */}
            {(isCreateDialogOpen || editingRole) && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl w-full max-w-[720px] max-h-[90vh] overflow-hidden flex flex-col border border-white/20 dark:border-gray-800 animate-in zoom-in-95 duration-200">
                        {/* Custom Header - Exactly matching Create Project modal */}
                        <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                        {editingRole ? 'Update Role' : 'Create Project Role'}
                                    </h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                                        {editingRole ? 'Modify existing permissions' : 'Initialize a new security clearance for your team'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setIsCreateDialogOpen(false)
                                    setEditingRole(null)
                                    resetForm()
                                }}
                                className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group disabled:opacity-50"
                            >
                                <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                            </button>
                        </div>

                        {/* Form Body - Matching Create Project Modal spacing */}
                        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 custom-scrollbar">
                            <div className="space-y-4">
                                {/* Role Name Input */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 pl-1">
                                        <Plus className="w-3.5 h-3.5 text-primary" />
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Role Name</label>
                                    </div>
                                    <input
                                        type="text"
                                        value={roleName}
                                        onChange={(e) => setRoleName(e.target.value)}
                                        className="w-full h-12 px-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:ring-4 focus:ring-primary/10 transition-all"
                                        placeholder="e.g. MISSION_DIRECTOR"
                                    />
                                </div>

                                {/* Role Description */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 pl-1">
                                        <Edit2 className="w-3.5 h-3.5 text-primary" />
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Purpose & Scope</label>
                                    </div>
                                    <textarea
                                        value={roleDescription}
                                        onChange={(e) => setRoleDescription(e.target.value)}
                                        className="w-full p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:ring-4 focus:ring-primary/10 transition-all resize-none h-28"
                                        placeholder="Briefly explain the primary responsibilities for this role..."
                                    />
                                </div>

                                {/* Privilege Matrix */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between pl-1">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-3.5 h-3.5 text-primary" />
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Privilege Matrix</label>
                                        </div>
                                        {Object.values(permissions).some(Boolean) && (
                                            <button
                                                type="button"
                                                onClick={() => setPermissions(Object.keys(permissions).reduce((acc, key) => ({ ...acc, [key]: false }), {} as RolePermissions))}
                                                className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
                                            >
                                                Clear All
                                            </button>
                                        )}
                                    </div>

                                    <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-4 bg-gray-50/30 dark:bg-gray-800/20 max-h-64 overflow-y-auto custom-scrollbar">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {permissionsList.map((perm) => (
                                                <label
                                                    key={perm.key}
                                                    className={classNames(
                                                        "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer shadow-sm group",
                                                        permissions[perm.key as keyof RolePermissions]
                                                            ? "bg-primary/5 border-primary/20 dark:bg-primary/10 dark:border-primary/50"
                                                            : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-primary/10"
                                                    )}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={permissions[perm.key as keyof RolePermissions]}
                                                        onChange={(e) =>
                                                            setPermissions({
                                                                ...permissions,
                                                                [perm.key]: e.target.checked,
                                                            })
                                                        }
                                                        className="hidden"
                                                    />
                                                    <div className={classNames(
                                                        "w-5 h-5 rounded-lg shadow-sm flex items-center justify-center transition-all duration-300",
                                                        permissions[perm.key as keyof RolePermissions]
                                                            ? "bg-primary scale-110"
                                                            : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 group-hover:scale-105"
                                                    )}>
                                                        {permissions[perm.key as keyof RolePermissions] && <Check className="w-3 h-3 text-white stroke-[4px]" />}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-tight truncate">{perm.label}</p>
                                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest truncate">{perm.description}</p>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions - Exactly matching Create Project modal */}
                        <div className="px-8 pb-8 pt-0 flex gap-4 mt-auto">
                            <button
                                onClick={() => {
                                    setIsCreateDialogOpen(false)
                                    setEditingRole(null)
                                    resetForm()
                                }}
                                className="flex-1 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-[11px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-[0.2em] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={editingRole ? handleUpdateRole : handleCreateRole}
                                disabled={!roleName.trim()}
                                className="flex-1 h-14 bg-primary hover:bg-primary-deep text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50"
                            >
                                {editingRole ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        <span>Update Role</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                                        <span>Create Role</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
