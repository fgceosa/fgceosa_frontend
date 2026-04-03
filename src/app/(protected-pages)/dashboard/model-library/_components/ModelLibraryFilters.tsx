import { Search, LayoutGrid, List, ArrowUpDown, Filter as FilterIcon, Settings2, ChevronDown } from 'lucide-react'
import { Input, Card } from '@/components/ui'
import classNames from '@/utils/classNames'
import type { Provider } from '../types'

interface ModelLibraryFiltersProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
    viewType: 'Cards' | 'List'
    setViewType: (type: 'Cards' | 'List') => void
    statusFilter: 'Approved' | 'All'
    setStatusFilter: (status: 'Approved' | 'All') => void
    groupingFilter: 'Grouped' | 'Individual'
    setGroupingFilter: (grouping: 'Grouped' | 'Individual') => void
    selectedProvider: string
    setSelectedProvider: (provider: string) => void
    sortKey: string
    setSortKey: (key: string) => void
    sortOrder: 'asc' | 'desc'
    setSortOrder: (order: 'asc' | 'desc') => void
    providers: Provider[]
    totalModels: number
}

export default function ModelLibraryFilters({
    searchQuery,
    setSearchQuery,
    viewType,
    setViewType,
    statusFilter,
    setStatusFilter,
    groupingFilter,
    setGroupingFilter,
    selectedProvider,
    setSelectedProvider,
    sortKey,
    setSortKey,
    sortOrder,
    setSortOrder,
    providers,
    totalModels
}: ModelLibraryFiltersProps) {
    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row items-center gap-6 flex-1">
                    <div className="relative w-full sm:w-[680px] group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors z-10" />
                        <Input
                            placeholder="Search models (e.g. gpt-4, claude-3)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-14 pl-12 pr-20 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 focus:bg-white dark:focus:bg-gray-900 transition-all text-sm font-bold shadow-sm group-hover:border-gray-200 group-hover:shadow-md"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-lg pointer-events-none z-10">
                            <span className="text-[10px] font-black text-gray-400">⌘</span>
                            <span className="text-[10px] font-black text-gray-400">K</span>
                        </div>
                    </div>
                    <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800 flex shadow-sm">
                        <button
                            onClick={() => setViewType('Cards')}
                            className={classNames(
                                "flex items-center gap-2.5 px-6 py-2.5 rounded-xl transition-all duration-300",
                                viewType === 'Cards' ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            <span className="text-[10px] font-black">Cards</span>
                        </button>
                        <button
                            onClick={() => setViewType('List')}
                            className={classNames(
                                "flex items-center gap-2.5 px-6 py-2.5 rounded-xl transition-all duration-300",
                                viewType === 'List' ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <List className="w-4 h-4" />
                            <span className="text-[10px] font-black">List</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters Row */}
            <Card className="p-6 bg-white dark:bg-gray-900 rounded-[2.5rem] border-none shadow-2xl shadow-gray-200/50 dark:shadow-none overflow-visible">
                <div className="flex flex-wrap items-center gap-6">
                    {/* Status Toggle */}
                    <div className="flex p-1 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                        <button
                            onClick={() => setStatusFilter('Approved')}
                            className={classNames(
                                "px-6 py-2 text-[10px] font-black rounded-lg shadow-sm transform active:scale-95 transition-all outline-none",
                                statusFilter === 'Approved' ? "bg-primary text-white shadow-md shadow-primary/20" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            Approved
                        </button>
                        <button
                            onClick={() => setStatusFilter('All')}
                            className={classNames(
                                "px-6 py-2 text-[10px] font-black rounded-lg transform active:scale-95 transition-all outline-none",
                                statusFilter === 'All' ? "bg-primary text-white shadow-md shadow-primary/20" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            All
                        </button>
                    </div>

                    {/* Grouping Toggle */}
                    <div className="flex p-1 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                        <button
                            onClick={() => setGroupingFilter('Grouped')}
                            className={classNames(
                                "px-6 py-2 text-[10px] font-black rounded-lg shadow-sm transform active:scale-95 transition-all outline-none",
                                groupingFilter === 'Grouped' ? "bg-primary text-white shadow-md shadow-primary/20" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            Grouped
                        </button>
                        <button
                            onClick={() => setGroupingFilter('Individual')}
                            className={classNames(
                                "px-6 py-2 text-[10px] font-black rounded-lg transform active:scale-95 transition-all outline-none",
                                groupingFilter === 'Individual' ? "bg-primary text-white shadow-md shadow-primary/20" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            Individual
                        </button>
                    </div>

                    <div className="flex-1" />

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="h-12 px-6 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-[10px] font-black text-gray-600 dark:text-gray-300 hover:bg-white transition-all shadow-sm"
                        >
                            <ArrowUpDown className="w-3.5 h-3.5" />
                            {sortKey === 'name' ? `Name (${sortOrder === 'asc' ? 'A-Z' : 'Z-A'})` : 'Sort'}
                        </button>

                        <button className="h-12 px-6 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-[10px] font-black text-gray-600 dark:text-gray-300 hover:bg-white transition-all shadow-sm">
                            <FilterIcon className="w-3.5 h-3.5" />
                            Filters
                        </button>

                        <button className="h-12 px-6 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-[10px] font-black text-gray-600 dark:text-gray-300 hover:bg-white transition-all shadow-sm">
                            <Settings2 className="w-3.5 h-3.5" />
                            Display
                        </button>
                    </div>
                </div>

                {/* Providers Row */}
                <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-800 flex flex-wrap items-center gap-3">
                    <span className="text-[10px] font-black text-gray-400 mr-4 flex items-center gap-1.5 min-w-max">
                        Providers
                        <span className="text-gray-900 dark:text-white ml-2">{providers.length} / {providers.length}</span>
                        <span className="text-gray-500 font-medium">({totalModels} models)</span>
                    </span>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => setSelectedProvider('all')}
                            className={classNames(
                                "px-6 py-2.5 rounded-xl border text-[10px] font-black flex items-center gap-2 transition-all duration-300",
                                selectedProvider === 'all'
                                    ? "border-primary/20 bg-primary/5 text-primary shadow-sm"
                                    : "border-gray-100 dark:border-gray-800 bg-gray-50/30 text-gray-500 hover:border-gray-300"
                            )}
                        >
                            All <span className={classNames("px-2 py-0.5 rounded-md text-[8px]", selectedProvider === 'all' ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-400")}>{providers.length}</span>
                        </button>

                        {providers.slice(0, 6).map((provider) => (
                            <button
                                key={provider.id}
                                onClick={() => setSelectedProvider(provider.id)}
                                className={classNames(
                                    "px-6 py-2.5 rounded-xl border text-[10px] font-black flex items-center gap-2 transition-all duration-300",
                                    selectedProvider === provider.id
                                        ? "border-primary/20 bg-primary/5 text-primary shadow-sm scale-105"
                                        : "border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800 text-gray-500 hover:border-primary/20 hover:text-primary"
                                )}
                            >
                                {provider.name}
                                <span className={classNames(
                                    "px-1.5 py-0.5 rounded-md text-[8px]",
                                    selectedProvider === provider.id ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                                )}>
                                    {provider.models.length}
                                </span>
                            </button>
                        ))}

                        {providers.length > 6 && (
                            <button className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 hover:text-primary transition-colors pl-2">
                                <ChevronDown className="w-3.5 h-3.5" />
                                +{providers.length - 6} More
                            </button>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    )
}
