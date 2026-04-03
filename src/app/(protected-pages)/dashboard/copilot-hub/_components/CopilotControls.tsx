import { Search, LayoutGrid, List } from 'lucide-react'
import { Input } from '@/components/ui'
import { ViewMode } from '../types'

interface CopilotControlsProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
    viewMode: ViewMode
    setViewMode: (mode: ViewMode) => void
}

export default function CopilotControls({
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
}: CopilotControlsProps) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-4 sm:p-6 relative group mb-8 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
            {/* Hover Accent */}
            <div className="absolute inset-0 bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl sm:rounded-[2rem]" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
                {/* Search Implementation */}
                <div className="relative w-full lg:flex-1 group/search">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within/search:text-primary transition-all duration-300" />
                    </div>
                    <Input
                        placeholder="Search copilots by name, tag or capability..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 sm:pl-12 h-12 sm:h-14 bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs sm:text-sm font-bold shadow-inner"
                    />
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto justify-end">
                    {/* Layout Toggles */}
                    <div className="flex items-center gap-1.5 p-1 bg-gray-50/80 dark:bg-gray-800/80 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-300 ${viewMode === 'grid'
                                ? 'bg-white dark:bg-gray-700 text-primary shadow-md scale-105'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                        >
                            <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-300 ${viewMode === 'list'
                                ? 'bg-white dark:bg-gray-700 text-primary shadow-md scale-105'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                        >
                            <List className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
