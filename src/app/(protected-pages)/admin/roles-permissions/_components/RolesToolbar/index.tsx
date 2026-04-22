import { Search, ListFilter, ArrowUpDown, LayoutGrid, List, MoreHorizontal, Check } from 'lucide-react'
import { Input, Button, Dropdown } from '@/components/ui'

interface RolesToolbarProps {
    onSearch?: (query: string) => void
    viewMode?: 'grid' | 'list'
    onViewModeChange?: (mode: 'grid' | 'list') => void
    filter?: string
    onFilterChange?: (filter: string) => void
    sortBy?: string
    onSortChange?: (sort: string) => void
}

const FILTER_OPTIONS = [
    { label: 'All Roles', value: 'all' },
    { label: 'System Roles', value: 'system' },
    { label: 'Custom Roles', value: 'custom' },
]

const SORT_OPTIONS = [
    { label: 'Alphabetical (A-Z)', value: 'az' },
    { label: 'Alphabetical (Z-A)', value: 'za' },
    { label: 'Most Users', value: 'users-desc' },
    { label: 'Least Users', value: 'users-asc' },
]

export default function RolesToolbar({
    onSearch,
    viewMode = 'grid',
    onViewModeChange,
    filter = 'all',
    onFilterChange,
    sortBy = 'az',
    onSortChange
}: RolesToolbarProps) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-6 relative group mb-8">
            {/* Hover Accent */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                {/* Search Implementation */}
                <div className="relative w-full lg:flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                        placeholder="Search by role name, description or permissions..."
                        className="pl-12 h-14 bg-gray-50/50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-primary/20 focus:border-primary text-sm shadow-inner transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-750 font-medium"
                        onChange={(e) => onSearch?.(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto">
                    {/* Filter & Sort Group */}
                    <div className="flex items-center gap-2 p-1 bg-gray-50/80 dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm w-full sm:w-auto">
                        <Dropdown
                            renderTitle={
                                <Button
                                    variant="plain"
                                    size="sm"
                                    className="h-10 px-4 gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    <ListFilter className="w-4 h-4" />
                                    <span className="text-xs font-bold">
                                        {FILTER_OPTIONS.find(o => o.value === filter)?.label || 'Filter'}
                                    </span>
                                </Button>
                            }
                        >
                            {FILTER_OPTIONS.map(opt => (
                                <Dropdown.Item
                                    key={opt.value}
                                    onClick={() => onFilterChange?.(opt.value)}
                                    className="flex items-center justify-between gap-8 h-10"
                                >
                                    <span className="text-xs font-bold">{opt.label}</span>
                                    {filter === opt.value && <Check size={14} className="text-primary" />}
                                </Dropdown.Item>
                            ))}
                        </Dropdown>

                        <div className="h-4 w-px bg-gray-200 dark:bg-gray-600" />

                        <Dropdown
                            renderTitle={
                                <Button
                                    variant="plain"
                                    size="sm"
                                    className="h-10 px-4 gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    <span className="text-xs font-bold">Sort</span>
                                    <ArrowUpDown className="w-3 h-3" />
                                </Button>
                            }
                        >
                            {SORT_OPTIONS.map(opt => (
                                <Dropdown.Item
                                    key={opt.value}
                                    onClick={() => onSortChange?.(opt.value)}
                                    className="flex items-center justify-between gap-8 h-10"
                                >
                                    <span className="text-xs font-bold">{opt.label}</span>
                                    {sortBy === opt.value && <Check size={14} className="text-primary" />}
                                </Dropdown.Item>
                            ))}
                        </Dropdown>
                    </div>

                    <div className="h-10 w-px bg-gray-100 dark:bg-gray-800 hidden sm:block" />

                    {/* Layout Toggles */}
                    <div className="flex items-center gap-1.5 p-1 bg-gray-50/80 dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <button
                            onClick={() => onViewModeChange?.('grid')}
                            className={`p-2.5 rounded-xl transition-all duration-300 ${viewMode === 'grid'
                                ? 'bg-white dark:bg-gray-700 text-primary shadow-md'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => onViewModeChange?.('list')}
                            className={`p-2.5 rounded-xl transition-all duration-300 ${viewMode === 'list'
                                ? 'bg-white dark:bg-gray-700 text-primary shadow-md'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>


                </div>
            </div>
        </div>
    )
}
