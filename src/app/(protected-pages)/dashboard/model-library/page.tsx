'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Tabs, Input, Select, Badge, Card } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabContent from '@/components/ui/Tabs/TabContent'
import classNames from '@/utils/classNames'
import {
    Search,
    Grid3X3,
    List,
    Cpu,
    Sparkles,
    LayoutGrid,
    Database,
    ArrowUpDown,
    Filter as FilterIcon,
    Settings2,
    ChevronDown,
    Activity
} from 'lucide-react'
import Loading from '@/components/shared/Loading'
import ModelCard from './_components/ModelCard'
import {
    fetchModels,
    fetchModelLibraryStats,
    fetchProviders,
    selectModels,
    selectProviders,
    selectModelLibraryLoading
} from '@/store/slices/modelLibrary'
import { useAppDispatch, useAppSelector } from '@/store/hook'

export default function ModelLibrary() {
    const dispatch = useAppDispatch()
    const router = useRouter()

    // Redux State
    const models = useAppSelector(selectModels)
    const providers = useAppSelector(selectProviders)
    const isLoading = useAppSelector(selectModelLibraryLoading)

    // Local UI State
    const [category, setCategory] = useState<'Text' | 'Embedding'>('Text')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'Approved' | 'All'>('Approved')
    const [groupingFilter, setGroupingFilter] = useState<'Grouped' | 'Individual'>('Grouped')
    const [selectedProvider, setSelectedProvider] = useState<string>('all')
    const [sortKey, setSortKey] = useState<string>('name')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

    useEffect(() => {
        dispatch(fetchModels() as any)
        dispatch(fetchProviders() as any)
        dispatch(fetchModelLibraryStats() as any)
    }, [dispatch])

    // Memoized counts for performance
    const { textModelsCount, embeddingModelsCount } = useMemo(() => ({
        textModelsCount: models.filter(m => m.category === 'Text').length,
        embeddingModelsCount: models.filter(m => m.category === 'Embedding').length
    }), [models])

    // Filtered and Sorted models
    const filteredModels = useMemo(() => {
        let result = models.filter(model => {
            const matchesCategory = model.category === category
            const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesStatus = statusFilter === 'All' || model.status === statusFilter
            const matchesProvider = selectedProvider === 'all' || model.providerId === selectedProvider
            return matchesCategory && matchesSearch && matchesStatus && matchesProvider
        })

        if (groupingFilter === 'Grouped') {
            // Group by name
            const grouped: Record<string, typeof models[0]> = {}
            result.forEach(model => {
                if (!grouped[model.name]) {
                    grouped[model.name] = { ...model }
                }
            })
            result = Object.values(grouped)
        }

        // Sorting
        return result.sort((a, b) => {
            const factor = sortOrder === 'asc' ? 1 : -1
            if (sortKey === 'name') {
                return a.name.localeCompare(b.name) * factor
            }
            return 0
        })
    }, [models, category, searchQuery, statusFilter, selectedProvider, groupingFilter, sortKey, sortOrder])

    const categoryOptions = [
        { value: 'all', label: 'All Providers' },
        ...providers.map(p => ({ value: p.id, label: p.name })),
    ]

    return (
        <div className="py-8 px-4 sm:px-6 space-y-8 w-full min-h-screen bg-[#f5f5f5] dark:bg-gray-900">
            {/* Promotion Bar */}


            {/* Background Decoration */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            {/* Enterprise Header Section */}
            <div className="flex flex-col gap-6 pb-2">
                <div className="space-y-3 lg:space-y-1">
                    <div className="flex items-center gap-3 sm:gap-4 mb-2">
                        <span className="text-[9px] sm:text-[10px] font-black text-primary whitespace-nowrap">Intelligence</span>
                        <div className="h-px w-8 sm:w-12 bg-primary/20" />
                        <span className="text-[9px] sm:text-[10px] font-black text-gray-400 whitespace-nowrap">Model Registry</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 sm:p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shrink-0">
                            <Cpu className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 dark:text-white leading-none">
                                Model Library
                            </h1>

                        </div>
                    </div>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-500 dark:text-gray-400 lg:pl-14 font-medium max-w-2xl leading-relaxed">
                        Explore global AI models, manage your environments, and track usage in one hub.
                    </p>
                </div>
            </div>


            {/* Navigation Tabs */}
            <Tabs
                value={category}
                onChange={(val) => setCategory(val as 'Text' | 'Embedding')}
                className="w-full"
            >
                <div className="flex flex-col gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                        <TabList className="flex gap-2 p-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 w-fit min-w-max">
                            <TabNav
                                value="Text"
                                className={classNames(
                                    "flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-[9px] sm:text-[10px] font-black transition-all duration-300 whitespace-nowrap",
                                    category === 'Text'
                                        ? "bg-white dark:bg-gray-900 text-primary shadow-sm"
                                        : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                )}
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Text Models</span>
                                <span className="sm:hidden">Text</span>
                                <Badge content={textModelsCount.toString()} className="ml-1 opacity-50" />
                            </TabNav>
                            <TabNav
                                value="Embedding"
                                className={classNames(
                                    "flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-[9px] sm:text-[10px] font-black transition-all duration-300 whitespace-nowrap",
                                    category === 'Embedding'
                                        ? "bg-white dark:bg-gray-900 text-primary shadow-sm"
                                        : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                )}
                            >
                                <Database className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Embeddings</span>
                                <span className="sm:hidden">Embed</span>
                                <Badge content={embeddingModelsCount.toString()} className="ml-1 opacity-50" />
                            </TabNav>
                        </TabList>
                    </div>

                    <div className="flex items-center gap-3 justify-end">
                        <div className="bg-gray-50/50 dark:bg-gray-800/50 p-1.5 rounded-2xl flex items-center border border-gray-100 dark:border-gray-800 shadow-sm">
                            <button
                                className={classNames(
                                    "p-2 sm:p-3 rounded-xl transition-all",
                                    viewMode === 'grid' ? "bg-white dark:bg-gray-700 text-primary shadow-sm" : "text-gray-400 hover:text-gray-600"
                                )}
                                onClick={() => setViewMode('grid')}
                            >
                                <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                                className={classNames(
                                    "p-2 sm:p-3 rounded-xl transition-all",
                                    viewMode === 'list' ? "bg-white dark:bg-gray-700 text-primary shadow-sm" : "text-gray-400 hover:text-gray-600"
                                )}
                                onClick={() => setViewMode('list')}
                            >
                                <List className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    {/* Premium Search & Filter Toolbar */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-4 sm:p-6 relative group mb-10">
                        {/* Hover Accent */}
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl sm:rounded-[2.5rem]" />

                        <div className="relative z-10 flex flex-col gap-4 sm:gap-6">
                            <div className="flex flex-col sm:flex-row items-center gap-4 flex-1 w-full">
                                <div className="relative w-full lg:flex-1 group/search">
                                    <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within/search:text-primary transition-colors" />
                                    <Input
                                        placeholder="Search models by name, provider or technology..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="h-12 sm:h-14 pl-10 sm:pl-12 bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 rounded-xl sm:rounded-2xl focus:ring-primary/20 focus:border-primary text-xs sm:text-sm shadow-inner transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-750 font-bold"
                                    />
                                </div>
                                <div className="w-full sm:w-64">
                                    <Select
                                        options={categoryOptions}
                                        value={categoryOptions.find(o => o.value === selectedProvider)}
                                        onChange={(option) => setSelectedProvider(option?.value || 'all')}
                                        className="h-12 sm:h-14 shadow-sm rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm"
                                        placeholder="All Providers"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                                <button
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="h-12 sm:h-14 px-4 sm:px-6 flex items-center justify-center gap-2 sm:gap-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95 whitespace-nowrap"
                                >
                                    <ArrowUpDown className="w-4 h-4" />
                                    {sortKey === 'name' ? `${sortOrder === 'asc' ? 'A-Z' : 'Z-A'}` : 'Sort'}
                                </button>

                                <div className="flex p-1.5 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm w-full sm:w-auto">
                                    <button
                                        onClick={() => setStatusFilter('Approved')}
                                        className={classNames(
                                            "flex-1 sm:flex-none px-4 sm:px-6 py-2.5 text-[9px] sm:text-[10px] font-black rounded-lg sm:rounded-xl transition-all",
                                            statusFilter === 'Approved' ? "bg-white dark:bg-gray-700 text-primary shadow-sm" : "text-gray-400 hover:text-gray-600"
                                        )}
                                    >
                                        Approved
                                    </button>
                                    <button
                                        onClick={() => setStatusFilter('All')}
                                        className={classNames(
                                            "flex-1 sm:flex-none px-4 sm:px-6 py-2.5 text-[9px] sm:text-[10px] font-black rounded-lg sm:rounded-xl transition-all",
                                            statusFilter === 'All' ? "bg-white dark:bg-gray-700 text-primary shadow-sm" : "text-gray-400 hover:text-gray-600"
                                        )}
                                    >
                                        All Catalog
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <TabContent value="Text">
                        {isLoading ? (
                            <Loading loading={isLoading} />
                        ) : filteredModels.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <div className="relative mb-8">
                                    <div className="w-24 h-24 rounded-[2rem] bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center border border-dashed border-gray-200 dark:border-gray-700">
                                        <Search className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-gray-900 rounded-xl shadow-lg flex items-center justify-center border border-gray-100 dark:border-gray-800">
                                        <Activity className="w-5 h-5 text-primary opacity-50" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                                    No models found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm font-medium">
                                    We couldn't find any models matching your criteria. Try adjusting your filters or search query.
                                </p>
                            </div>
                        ) : viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-12">
                                {filteredModels.map((model: any) => (
                                    <ModelCard key={model.id} model={model} />
                                ))}
                            </div>
                        ) : (
                            <Card className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden mb-12">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                            <tr>
                                                <th className="px-8 py-5 text-[10px] font-black text-gray-400">Model Name</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-gray-400">Provider</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-gray-400">Context</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-gray-400">Pricing (1M)</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {filteredModels.map((model: any) => (
                                                <tr key={model.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group cursor-pointer">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                                <Cpu className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <div className="font-black text-[13px] text-gray-900 dark:text-white group-hover:text-primary transition-colors">{model.name}</div>
                                                                <div className="text-[9px] font-black text-gray-400">{model.provider}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className="text-[10px] font-black text-gray-500 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md">{model.provider}</span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className="text-[11px] font-black text-gray-900 dark:text-gray-300">{model.context}</span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex flex-col gap-0.5">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                                                                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">{model.inputPrice}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="w-1 h-1 bg-blue-500 rounded-full" />
                                                                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400">{model.outputPrice}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <span className={classNames(
                                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black",
                                                            model.status === 'Approved' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                                        )}>
                                                            <div className={classNames("w-1.5 h-1.5 rounded-full mr-1.5", model.status === 'Approved' ? "bg-emerald-500" : "bg-amber-500")} />
                                                            {model.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        )}
                    </TabContent>

                    <TabContent value="Embedding">
                        {isLoading ? (
                            <Loading loading={isLoading} />
                        ) : filteredModels.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <div className="relative mb-8">
                                    <div className="w-24 h-24 rounded-[2rem] bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center border border-dashed border-gray-200 dark:border-gray-700">
                                        <Search className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-gray-900 rounded-xl shadow-lg flex items-center justify-center border border-gray-100 dark:border-gray-800">
                                        <Database className="w-5 h-5 text-primary opacity-50" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                                    No embeddings found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm font-medium">
                                    No embedding models match your search criteria.
                                </p>
                            </div>
                        ) : viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-12">
                                {filteredModels.map((model: any) => (
                                    <ModelCard key={model.id} model={model} />
                                ))}
                            </div>
                        ) : (
                            <Card className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden mb-12">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                            <tr>
                                                <th className="px-8 py-5 text-[10px] font-black text-gray-400">Model Name</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-gray-400">Provider</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-gray-400">Context</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-gray-400">Pricing (1M)</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {filteredModels.map((model: any) => (
                                                <tr
                                                    key={model.id}
                                                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group cursor-pointer"
                                                    onClick={() => router.push(`/dashboard/model-library/${model.id}`)}
                                                >
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                                <Database className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <div className="font-black text-[13px] text-gray-900 dark:text-white group-hover:text-primary transition-colors">{model.name}</div>
                                                                <div className="text-[9px] font-black text-gray-400">{model.provider}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className="text-[10px] font-black text-gray-500 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md">{model.provider}</span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className="text-[11px] font-black text-gray-900 dark:text-gray-300">{model.context}</span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex flex-col gap-0.5">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                                                                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">{model.inputPrice}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="w-1 h-1 bg-blue-500 rounded-full" />
                                                                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400">{model.outputPrice}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <span className={classNames(
                                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black",
                                                            model.status === 'Approved' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                                        )}>
                                                            <div className={classNames("w-1.5 h-1.5 rounded-full mr-1.5", model.status === 'Approved' ? "bg-emerald-500" : "bg-amber-500")} />
                                                            {model.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        )}
                    </TabContent>
                </div>
            </Tabs>
        </div>
    )
}
