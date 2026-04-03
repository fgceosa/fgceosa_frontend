'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
    Search,
    RefreshCw,
    Plus,
    Building2,
    CreditCard,
    X,
    Coins,
    Zap,
    Info,
    Slash,
    CheckCircle,
    AlertTriangle
} from 'lucide-react'
import {
    Button,
    Input,
    toast,
    Notification,
    Dialog,
    Card,
    Pagination,
    Select
} from '@/components/ui'
import PlatformOrgMetrics from './_components/PlatformOrgMetrics'
import PlatformOrgTable from './_components/PlatformOrgTable'
import AllocateOrgCreditsModal from './_components/AllocateOrgCreditsModal'
import CreateOrganizationModal from './_components/CreateOrganizationModal'
import {
    apiUpdatePlatformOrg,
    apiAllocateOrgCredits,
    apiDeleteOrganization
} from '@/services/PlatformOrganizationService'
import { useRouter } from 'next/navigation'
import classNames from '@/utils/classNames'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

// Redux
import { useAppDispatch, useAppSelector } from '@/store/hook'
import {
    getPlatformOrgAnalytics,
    getPlatformOrganizations,
    setFilter,
    selectPlatformOrgsList,
    selectPlatformOrgsAnalytics,
    selectPlatformOrgsTotal,
    selectPlatformOrgsAnalyticsLoading,
    selectPlatformOrgsLoading,
    selectPlatformOrgsFilter,
    cleanupPlatformOrganizationsState
} from '@/store/slices/platformOrganizations'

export default function PlatformOrganizationsPage() {
    const router = useRouter()
    const dispatch = useAppDispatch()

    // Redux State
    const orgs = useAppSelector(selectPlatformOrgsList)
    const analytics = useAppSelector(selectPlatformOrgsAnalytics)
    const totalCount = useAppSelector(selectPlatformOrgsTotal)
    const loading = useAppSelector(selectPlatformOrgsLoading)
    const analyticsLoading = useAppSelector(selectPlatformOrgsAnalyticsLoading)
    const filter = useAppSelector(selectPlatformOrgsFilter)

    const { page, page_size, search, status } = filter

    // Local State for UI
    const [searchQuery, setSearchQuery] = useState(search)

    // Sync searchQuery if filter.search changes (e.g. on reset)
    useEffect(() => {
        setSearchQuery(search)
    }, [search])
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null)
    const [allocateModalOpen, setAllocateModalOpen] = useState(false)
    const [createOrgModalOpen, setCreateOrgModalOpen] = useState(false)
    const [creditAmount, setCreditAmount] = useState('')

    // Status update confirm modal
    const [statusConfirmOpen, setStatusConfirmOpen] = useState(false)
    const [pendingStatusChange, setPendingStatusChange] = useState<{ id: string; status: string } | null>(null)

    // Delete confirm modal
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const firstRender = useRef(true)

    const fetchData = useCallback(async (refreshAnalytics = false) => {
        if (refreshAnalytics) {
            dispatch(getPlatformOrgAnalytics())
        }
        dispatch(getPlatformOrganizations({
            page,
            page_size,
            search,
            status
        }))
        setIsRefreshing(false)
    }, [dispatch, page, page_size, search, status])

    // Initial load
    useEffect(() => {
        dispatch(getPlatformOrgAnalytics())
    }, [dispatch])

    useEffect(() => {
        fetchData()
        return () => {
            if (firstRender.current) {
                firstRender.current = false
            } else {
                dispatch(cleanupPlatformOrganizationsState())
            }
        }
    }, [fetchData, dispatch])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== search) {
                dispatch(setFilter({ search: searchQuery, page: 1 }))
            }
        }, 600) // Slightly longer debounce for better stability
        return () => clearTimeout(timer)
    }, [searchQuery, search, dispatch])

    const handleRefresh = () => {
        setIsRefreshing(true)
        fetchData(true)
    }

    const handleViewOrg = (id: string) => {
        router.push(`/platform/organizations/${id}`)
    }

    const handleAction = async (action: string, id: string) => {
        if (action === 'status') {
            const org = orgs.find(o => o.id === id)
            if (!org) return

            const newStatus = org.status === 'suspended' ? 'active' : 'suspended'
            setPendingStatusChange({ id, status: newStatus })
            setStatusConfirmOpen(true)
        } else if (action === 'credits') {
            setSelectedOrgId(id)
            setAllocateModalOpen(true)
        } else if (action === 'delete') {
            const org = orgs.find(o => o.id === id)
            if (!org) return

            setPendingDelete({ id, name: org.name })
            setDeleteConfirmOpen(true)
        }
    }

    const handleConfirmStatusChange = async () => {
        if (!pendingStatusChange) return
        const { id, status } = pendingStatusChange

        try {
            await apiUpdatePlatformOrg(id, { is_active: status === 'active' })
            toast.push(
                <Notification title="Success" type="success">
                    Organization {status === 'active' ? 'reactivated' : 'suspended'} successfully.
                </Notification>
            )
            fetchData()
        } catch (err) {
            toast.push(
                <Notification title="Error" type="danger">
                    Failed to update organization status. Please try again.
                </Notification>
            )
        } finally {
            setStatusConfirmOpen(false)
            setPendingStatusChange(null)
        }
    }

    const handleConfirmDelete = async () => {
        if (!pendingDelete) return

        setDeleteLoading(true)
        try {
            await apiDeleteOrganization(pendingDelete.id)
            toast.push(
                <Notification title="Success" type="success">
                    Organization "{pendingDelete.name}" deleted successfully.
                </Notification>
            )
            fetchData(true) // Refresh both analytics and list
        } catch (err: any) {
            toast.push(
                <Notification title="Error" type="danger">
                    {err.response?.data?.detail || 'Failed to delete organization. Please try again.'}
                </Notification>
            )
        } finally {
            setDeleteLoading(false)
            setDeleteConfirmOpen(false)
            setPendingDelete(null)
        }
    }



    return (
        <div className="min-h-screen bg-[#f5f5f5] dark:bg-gray-900/50 -m-4 sm:-m-8 p-4 sm:p-8">
            <div className="max-w-full mx-auto space-y-10 animate-in fade-in duration-700">
                {/* Enterprise Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-2">
                    <div className="space-y-4 lg:space-y-1">
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-[10px] font-black text-primary whitespace-nowrap">Platform Admin</span>
                            <div className="h-px w-12 bg-primary/20" />
                            <span className="text-[10px] font-black text-gray-400 whitespace-nowrap">Organizations</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shrink-0">
                                <Building2 className="h-6 w-6 text-primary" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
                                Organizations
                            </h1>
                        </div>
                        <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 lg:pl-14 font-medium max-w-2xl leading-relaxed">
                            Central management hub to monitor organization health, usage limits, and credit balances.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <Button
                            variant="plain"
                            onClick={handleRefresh}
                            className={classNames(
                                "h-12 w-12 p-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl flex items-center justify-center text-gray-400 hover:text-primary transition-all shadow-sm",
                                isRefreshing && "animate-spin text-primary border-primary/20 bg-primary/5"
                            )}
                        >
                            <RefreshCw className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="solid"
                            onClick={() => setCreateOrgModalOpen(true)}
                            className="h-12 sm:h-14 px-8 bg-primary hover:bg-primary-deep text-white font-black text-[10px] sm:text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group w-full sm:w-auto"
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            <span>New Organization</span>
                        </Button>
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="relative">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
                    <div className="absolute top-40 -right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl opacity-50 pointer-events-none" />

                    <div className="relative z-10 space-y-10">
                        {/* KPI Summary Cards */}
                        <PlatformOrgMetrics analytics={analytics} loading={analyticsLoading} />

                        {/* Search Bar Container */}
                        <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-6 relative group overflow-hidden">
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-4">
                                <div className="relative w-full flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="Search by ID, Name or Owner..."
                                        className="pl-11 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-primary/20 focus:border-primary text-sm shadow-inner transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-750"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 p-1 rounded-xl border border-gray-100 dark:border-gray-700">
                                        {['all', 'active', 'suspended'].map((filterItem) => (
                                            <button
                                                key={filterItem}
                                                onClick={() => dispatch(setFilter({ status: filterItem, page: 1 }))}
                                                className={classNames(
                                                    "px-4 py-1.5 rounded-lg text-[10px] font-black transition-all",
                                                    status === filterItem
                                                        ? "bg-white dark:bg-gray-700 text-primary shadow-sm ring-1 ring-gray-100/50"
                                                        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                                )}
                                            >
                                                {filterItem.charAt(0).toUpperCase() + filterItem.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="px-4 py-2 bg-primary/5 rounded-xl border border-primary/10">
                                        <span className="text-[10px] font-black text-primary leading-none">
                                            {totalCount} Organizations
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inventory Table Card */}
                        <Card className="p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 transition-all">
                            <div className="p-6 md:p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white">Organizational List</h3>
                                    <p className="text-sm font-bold text-gray-400 mt-1">All organizations registered on the platform</p>
                                </div>
                                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-primary" />
                                </div>
                            </div>

                            <div className="p-6 md:p-8">
                                <PlatformOrgTable
                                    data={orgs}
                                    loading={loading}
                                    onView={handleViewOrg}
                                    onAction={handleAction}
                                />

                                {/* Pagination Controls */}
                                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 flex shrink-0">
                                            Show
                                            <div className="w-16">
                                                <Select
                                                    size="sm"
                                                    value={[
                                                        { value: 10, label: '10' },
                                                        { value: 25, label: '25' },
                                                        { value: 50, label: '50' }
                                                    ].find(opt => opt.value === page_size)}
                                                    options={[
                                                        { value: 10, label: '10' },
                                                        { value: 25, label: '25' },
                                                        { value: 50, label: '50' }
                                                    ]}
                                                    onChange={(opt: any) => dispatch(setFilter({ page_size: opt?.value, page: 1 }))}
                                                />
                                            </div>
                                            Per Page
                                        </div>
                                        <div className="w-px h-4 bg-gray-100 dark:bg-gray-800" />
                                        <p className="text-[10px] font-black text-gray-400">
                                            Total <span className="text-gray-900 dark:text-white">{totalCount}</span> Organizations
                                        </p>
                                    </div>
                                    <Pagination
                                        currentPage={page}
                                        total={totalCount}
                                        pageSize={page_size}
                                        onChange={(p) => dispatch(setFilter({ page: p }))}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Organization Status Confirm Modal */}
            <Dialog
                isOpen={statusConfirmOpen}
                onClose={() => setStatusConfirmOpen(false)}
                closable={false}
                width={500}
                className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
                contentClassName="!shadow-none"
            >
                <div className="relative">
                    {/* Dynamic Header */}
                    <div className={classNames(
                        "px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between",
                        pendingStatusChange?.status === 'suspended' ? "bg-rose-50/30 dark:bg-rose-500/5" : "bg-emerald-50/30 dark:bg-emerald-500/5"
                    )}>
                        <div className="flex items-center gap-4">
                            <div className={classNames(
                                "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all",
                                pendingStatusChange?.status === 'suspended'
                                    ? "bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400"
                                    : "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                            )}>
                                {pendingStatusChange?.status === 'suspended' ? <Slash className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight">
                                    {pendingStatusChange?.status === 'suspended' ? 'Suspend Account' : 'Reactivate Account'}
                                </h3>
                                <p className="text-[10px] text-gray-400 font-black mt-0.5">Confirm Identity State Mutation</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setStatusConfirmOpen(false)}
                            className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group"
                        >
                            <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                        </button>
                    </div>

                    <div className="p-8 space-y-8">
                        <div className="space-y-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                                {pendingStatusChange?.status === 'suspended'
                                    ? "Are you sure you want to suspend this organization? This critical action will immediately revoke platform access for all associated users and halt active workspace processes until manually reactivated."
                                    : "Are you sure you want to reactivate this organization? This will restore full platform capabilities and workspace access for all associated members immediately."
                                }
                            </p>

                            {pendingStatusChange?.status === 'suspended' && (
                                <div className="p-4 bg-rose-50/50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center text-rose-600">
                                            <AlertTriangle className="w-4 h-4" />
                                        </div>
                                        <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 leading-tight">
                                            Caution: High Impact Action impacts all org members
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStatusConfirmOpen(false)}
                                className="flex-1 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-[11px] font-black text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-inter"
                            >
                                Dismiss
                            </button>
                            <Button
                                variant="solid"
                                className={classNames(
                                    "flex-[2] h-14 text-white rounded-2xl font-black text-[11px] shadow-xl transition-all border-none active:scale-95",
                                    pendingStatusChange?.status === 'suspended'
                                        ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
                                        : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                                )}
                                onClick={handleConfirmStatusChange}
                            >
                                {pendingStatusChange?.status === 'suspended' ? 'Confirm Suspension' : 'Confirm Activation'}
                            </Button>
                        </div>
                    </div>
                </div>
            </Dialog>

            {/* Delete Organization Confirm Modal */}
            <Dialog
                isOpen={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                closable={false}
                width={500}
                className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
                contentClassName="!shadow-none"
            >
                <div className="relative">
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-rose-50/30 dark:bg-rose-500/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center border transition-all bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight">
                                    Delete Organization
                                </h3>
                                <p className="text-[10px] text-gray-400 font-black mt-0.5">Permanent destructive action</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setDeleteConfirmOpen(false)}
                            className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group"
                        >
                            <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                        </button>
                    </div>

                    <div className="p-8 space-y-8">
                        <div className="space-y-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                                Are you sure you want to permanently delete <strong className="text-gray-900 dark:text-white">"{pendingDelete?.name}"</strong>?
                            </p>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                                This action will immediately and permanently remove:
                            </p>

                            <div className="p-4 bg-rose-50/50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/20 space-y-2">
                                <div className="flex items-center gap-3 text-rose-700 dark:text-rose-400">
                                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                                    <span className="text-xs font-bold">All organization members and their access</span>
                                </div>
                                <div className="flex items-center gap-3 text-rose-700 dark:text-rose-400">
                                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                                    <span className="text-xs font-bold">All workspaces and projects</span>
                                </div>
                                <div className="flex items-center gap-3 text-rose-700 dark:text-rose-400">
                                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                                    <span className="text-xs font-bold">All associated data and history</span>
                                </div>
                            </div>

                            <div className="p-4 bg-amber-50/50 dark:bg-amber-500/5 rounded-2xl border border-amber-100 dark:border-amber-500/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-600">
                                        <AlertTriangle className="w-4 h-4" />
                                    </div>
                                    <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 leading-tight">
                                        Warning: This action cannot be undone
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setDeleteConfirmOpen(false)}
                                className="flex-1 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-[11px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-[0.2em] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-inter"
                            >
                                Cancel
                            </button>
                            <Button
                                variant="solid"
                                loading={deleteLoading}
                                className="flex-[2] h-14 text-white rounded-2xl font-black text-[11px] shadow-xl transition-all border-none active:scale-95 bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
                                onClick={handleConfirmDelete}
                            >
                                Delete Permanently
                            </Button>
                        </div>
                    </div>
                </div>
            </Dialog>

            <AllocateOrgCreditsModal
                isOpen={allocateModalOpen}
                onClose={() => setAllocateModalOpen(false)}
                onSuccess={() => fetchData(true)}
                organization={orgs.find(o => o.id === selectedOrgId) || null}
            />

            <CreateOrganizationModal
                isOpen={createOrgModalOpen}
                onClose={() => setCreateOrgModalOpen(false)}
                onSuccess={() => fetchData(true)}
            />
        </div>
    )
}
