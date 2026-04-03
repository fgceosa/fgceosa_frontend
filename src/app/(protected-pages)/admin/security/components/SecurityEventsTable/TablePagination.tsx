import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import { PAGE_SIZE_OPTIONS } from '../../constants'

interface TablePaginationProps {
    currentPage: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
}

/**
 * TablePagination - Pagination controls for the security events table
 */
export default function TablePagination({
    currentPage,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange
}: TablePaginationProps) {
    return (
        <div className="p-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gray-50/30 dark:bg-gray-900/50">
            <div className="flex items-center gap-3">
                <span className="text-xs items-center gap-2 font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest flex shrink-0">
                    Show
                    <div className="w-16">
                        <Select
                            size="sm"
                            menuPlacement="top"
                            isSearchable={false}
                            value={PAGE_SIZE_OPTIONS.find(opt => opt.value === pageSize)}
                            options={PAGE_SIZE_OPTIONS as any}
                            onChange={(opt: any) => onPageSizeChange(opt?.value || 10)}
                        />
                    </div>
                    Per Page
                </span>
                <div className="w-px h-4 bg-gray-100 dark:bg-gray-800" />
                <p className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                    Total <span className="text-gray-900 dark:text-white">{total}</span> Events
                </p>
            </div>
            <Pagination
                pageSize={pageSize}
                currentPage={currentPage}
                total={total}
                onChange={onPageChange}
            />
        </div>
    )
}
