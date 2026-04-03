import { useRef } from 'react'
import {
    CreditCard, Shield, Users, Briefcase, Truck, MoreVertical, ChevronDown
} from 'lucide-react'
import classNames from '@/utils/classNames'
import { CopilotCategory } from '../types'

interface CategoryFiltersProps {
    selectedCategory: CopilotCategory | 'all'
    setSelectedCategory: (category: CopilotCategory | 'all') => void
}

export default function CategoryFilters({
    selectedCategory,
    setSelectedCategory,
}: CategoryFiltersProps) {
    const filters = [
        { label: 'All', value: 'all', icon: null },
        { label: 'Finance & Accounting', value: 'finance', icon: <CreditCard className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" /> },
        { label: 'Legal & Compliance', value: 'legal', icon: <Shield className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" /> },
        { label: 'HR & Payroll', value: 'hr', icon: <Users className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" /> },
        { label: 'Sales & CRM', value: 'sales', icon: <Briefcase className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" /> },
        { label: 'Operations & Logistics', value: 'operations', icon: <Truck className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" /> },
    ]

    return (
        <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-100 dark:border-gray-800 overflow-x-auto no-scrollbar scroll-smooth">
            {filters.map((filter) => (
                <button
                    key={filter.label}
                    onClick={() => setSelectedCategory(filter.value as any)}
                    className={classNames(
                        "h-11 px-4 flex items-center justify-between gap-3 rounded-xl border transition-all duration-300 shadow-sm font-bold text-sm whitespace-nowrap group",
                        selectedCategory === filter.value
                            ? "bg-primary/5 border-primary/20 text-primary shadow-md shadow-primary/5"
                            : "bg-white dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                    )}
                >
                    <div className="flex items-center gap-3">
                        {filter.icon}
                        <span>{filter.label}</span>
                    </div>
                    <ChevronDown className={classNames(
                        "w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-all",
                        selectedCategory === filter.value && "rotate-180 opacity-100"
                    )} />
                </button>
            ))}

            <button className="h-11 px-4 flex items-center justify-between gap-3 rounded-xl border bg-white dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all shadow-sm font-bold text-sm whitespace-nowrap group">
                <div className="flex items-center gap-3">
                    <MoreVertical className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                    <span>More Filters</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
            </button>
        </div>
    )
}
