'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchRegistryModels, fetchRegistryAnalytics, fetchRegistryProviders } from '@/store/slices/modelRegistry/modelRegistryThunk'
import { selectRegistryModels, selectRegistryAnalytics, selectModelRegistryLoading, selectRegistryProviders } from '@/store/slices/modelRegistry/modelRegistrySelectors'
import AnalyticsCards from './_components/AnalyticsCards'
import RegistryTable from './_components/RegistryTable'
import { Button, Input, Select, toast, Notification, Pagination } from '@/components/ui'
import { VscAdd, VscSearch, VscFilter, VscServer, VscCloudDownload } from 'react-icons/vsc'
import RegisterModelModal from './_components/RegisterModelModal'
import { apiSyncRequestyModels } from '@/services/modelRegistry/modelRegistryService'
import type { RegistryModel } from './types'

const ModelRegistryPage = () => {
    const dispatch = useAppDispatch()
    const models = useAppSelector(selectRegistryModels)
    const analytics = useAppSelector(selectRegistryAnalytics)
    const providers = useAppSelector(selectRegistryProviders)
    const loading = useAppSelector(selectModelRegistryLoading)

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
    const [isSyncing, setIsSyncing] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10

    useEffect(() => {
        dispatch(fetchRegistryModels())
        dispatch(fetchRegistryAnalytics())
        dispatch(fetchRegistryProviders())
    }, [dispatch])

    const handleRegisterSuccess = () => {
        dispatch(fetchRegistryModels())
        dispatch(fetchRegistryAnalytics())
    }

    const handleSyncRequesty = async () => {
        setIsSyncing(true)
        try {
            const resp = await apiSyncRequestyModels()
            toast.push(
                <Notification title="Sync Successful" type="success">
                    Imported {resp.created} new models and updated {resp.updated} from RequestyAI.
                </Notification>
            )
            dispatch(fetchRegistryModels())
            dispatch(fetchRegistryAnalytics())
            dispatch(fetchRegistryProviders())
        } catch (error) {
            toast.push(
                <Notification title="Sync Failed" type="danger">
                    Failed to synchronize with RequestyAI catalog.
                </Notification>
            )
        } finally {
            setIsSyncing(false)
        }
    }

    const filteredModels = models.filter(m => {
        const matchesSearch = !searchTerm ||
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (m.provider && m.provider.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesProvider = !selectedProvider || m.providerSlug?.toLowerCase() === selectedProvider.toLowerCase()
        const matchesStatus = !selectedStatus || m.status?.toLowerCase() === selectedStatus.toLowerCase()

        return matchesSearch && matchesProvider && matchesStatus
    })

    const paginatedModels = filteredModels.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    )

    const onPaginationChange = (page: number) => {
        setCurrentPage(page)
    }

    const providerOptions = [
        { value: '', label: 'All Providers' },
        ...providers.map(p => ({ value: p.slug, label: p.name }))
    ]

    const statusOptions = [
        { value: '', label: 'All Statuses' },
        { value: 'approved', label: 'Approved' },
        { value: 'experimental', label: 'Experimental' },
        { value: 'deprecated', label: 'Deprecated' }
    ]

    return (
        <div className="min-h-screen bg-[#f5f5f5] dark:bg-gray-900/50 -m-4 sm:-m-8 p-4 sm:p-8">
            <div className="max-w-full mx-auto space-y-10 animate-in fade-in duration-700">
                {/* Enterprise Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-2">
                    <div className="space-y-4 lg:space-y-1">
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-[10px] font-black text-primary whitespace-nowrap">Platform Control</span>
                            <div className="h-px w-12 bg-primary/20" />
                            <span className="text-[10px] font-black text-gray-400 whitespace-nowrap">AI Library</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shrink-0">
                                <VscServer className="h-6 w-6 text-primary" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
                                Model Registry
                            </h1>
                        </div>
                        <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 lg:pl-14 font-medium max-w-2xl leading-relaxed">
                            Central hub for all AI models. Manage pricing, safety rules, and availability across your organization.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <Button
                            variant="default"
                            onClick={handleSyncRequesty}
                            loading={isSyncing}
                            className="h-12 sm:h-14 px-8 border-2 border-primary/20 hover:border-primary/40 text-primary font-black text-[10px] sm:text-[11px] rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 w-full sm:w-auto overflow-hidden group relative"
                        >
                            <VscCloudDownload className={`w-5 h-5 ${isSyncing ? 'animate-bounce' : 'group-hover:-translate-y-1'} transition-transform`} />
                            <span>Sync Models</span>
                            <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform" />
                        </Button>
                        <Button
                            variant="solid"
                            onClick={() => setIsRegisterModalOpen(true)}
                            className="h-12 sm:h-14 px-8 bg-primary hover:bg-primary-deep text-white font-black text-[10px] sm:text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group w-full sm:w-auto"
                        >
                            <VscAdd className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            <span>Add New Model</span>
                        </Button>
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="relative">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
                    <div className="absolute top-40 -right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl opacity-50 pointer-events-none" />

                    <div className="relative z-10 space-y-10">
                        {/* Analytics */}
                        <AnalyticsCards data={analytics} loading={loading} />

                        {/* Search Bar Container */}
                        <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-6 relative group">
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]" />
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-4">
                                <div className="relative w-full flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <VscSearch className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Input
                                        placeholder="Search by name, provider, or features..."
                                        className="pl-11 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-primary/20 focus:border-primary text-sm shadow-inner transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-750"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-3 w-full lg:w-auto">
                                    <div className="w-full lg:w-48">
                                        <Select
                                            placeholder="Provider"
                                            size="md"
                                            menuPosition="fixed"
                                            options={providerOptions}
                                            value={providerOptions.find(o => o.value === selectedProvider)}
                                            onChange={(val) => {
                                                setSelectedProvider(val?.value || null)
                                                setCurrentPage(1)
                                            }}
                                        />
                                    </div>
                                    <div className="w-full lg:w-48">
                                        <Select
                                            placeholder="Status"
                                            size="md"
                                            menuPosition="fixed"
                                            options={statusOptions}
                                            value={statusOptions.find(o => o.value === selectedStatus)}
                                            onChange={(val) => {
                                                setSelectedStatus(val?.value || null)
                                                setCurrentPage(1)
                                            }}
                                        />
                                    </div>
                                    <div className="px-4 py-2 bg-primary/5 rounded-xl border border-primary/10 shrink-0">
                                        <span className="text-[10px] font-black text-primary">
                                            {filteredModels.length} Models
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="space-y-6">
                            <RegistryTable
                                data={paginatedModels}
                                loading={loading}
                            />

                            <div className="flex items-center justify-between bg-white dark:bg-gray-900 px-8 py-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20">
                                <span className="text-[10px] font-black text-gray-400">
                                    Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredModels.length)} of {filteredModels.length} models
                                </span>
                                <Pagination
                                    total={filteredModels.length}
                                    pageSize={pageSize}
                                    currentPage={currentPage}
                                    onChange={onPaginationChange}
                                />
                            </div>
                        </div>

                        <RegisterModelModal
                            isOpen={isRegisterModalOpen}
                            onClose={() => setIsRegisterModalOpen(false)}
                            onSuccess={handleRegisterSuccess}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModelRegistryPage
