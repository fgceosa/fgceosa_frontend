import { Search, ListFilter, ArrowUpDown, UserPlus, Check } from 'lucide-react'
import { Input, Button, Dropdown } from '@/components/ui'

interface OrgTeamToolbarProps {
    onSearch: (query: string) => void
    searchQuery: string
    statusFilter: string
    onStatusFilterChange: (status: string) => void
    totalMembers: number
    onInviteClick: () => void
}

const STATUS_OPTIONS = [
    { label: 'All Status', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Invited', value: 'invited' },
    { label: 'Suspended', value: 'suspended' },
]

export default function OrgTeamToolbar({
    onSearch,
    searchQuery,
    statusFilter,
    onStatusFilterChange,
    totalMembers,
    onInviteClick
}: OrgTeamToolbarProps) {
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
                        placeholder="Search team members by name or email..."
                        value={searchQuery}
                        className="pl-12 h-14 bg-gray-50/50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-primary/20 focus:border-primary text-sm shadow-inner transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-750 font-medium"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    {/* Filter Group */}
                    <div className="flex items-center gap-2 p-1 bg-gray-50/80 dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm w-full sm:w-auto">
                        <Dropdown
                            renderTitle={
                                <Button
                                    variant="plain"
                                    size="sm"
                                    className="h-10 px-4 gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    <ListFilter className="w-4 h-4" />
                                    <span className="text-[10px] font-black whitespace-nowrap">
                                        {STATUS_OPTIONS.find(o => o.value === statusFilter)?.label || 'Filter'}
                                    </span>
                                </Button>
                            }
                        >
                            {STATUS_OPTIONS.map(opt => (
                                <Dropdown.Item
                                    key={opt.value}
                                    onClick={() => onStatusFilterChange(opt.value)}
                                    className="flex items-center justify-between gap-8 h-10"
                                >
                                    <span className="text-xs font-bold">{opt.label}</span>
                                    {statusFilter === opt.value && <Check size={14} className="text-primary" />}
                                </Dropdown.Item>
                            ))}
                        </Dropdown>
                    </div>

                    <div className="text-xs font-black text-gray-900 dark:text-gray-100 bg-gray-50/80 dark:bg-gray-800/80 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm whitespace-nowrap h-12 flex items-center">
                        {totalMembers} Members
                    </div>

                    <Button
                        variant="solid"
                        onClick={onInviteClick}
                        className="h-14 px-8 bg-primary hover:bg-primary-deep text-white font-black text-[10px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 group w-full sm:w-auto"
                    >
                        <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Invite Member
                    </Button>
                </div>
            </div>
        </div>
    )
}
