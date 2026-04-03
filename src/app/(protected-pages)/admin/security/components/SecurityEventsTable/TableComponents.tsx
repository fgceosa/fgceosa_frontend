import { ShieldAlert } from 'lucide-react'

/**
 * TableHeader - Header section for the security events table
 */
export default function TableHeader() {
    return (
        <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                    Security Events Log
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 font-medium">
                    Recent security incidents and policy violations
                </p>
            </div>
        </div>
    )
}

/**
 * TableColumns - Column headers for the security events table
 */
export function TableColumns() {
    const columns = [
        'Event Type',
        'User',
        'Location / IP',
        'Assigned To',
        'Severity',
        'Status',
        'Actions'
    ]

    return (
        <thead className="bg-gray-50/50 dark:bg-gray-950/50 border-b border-gray-100 dark:border-gray-800">
            <tr>
                {columns.map((column, index) => (
                    <th
                        key={column}
                        className={`px-8 py-5 text-${index === columns.length - 1 ? 'center' : 'left'} text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider`}
                    >
                        {column}
                    </th>
                ))}
            </tr>
        </thead>
    )
}

/**
 * EmptyState - Displayed when no events are found
 */
export function EmptyState() {
    return (
        <tr>
            <td colSpan={7} className="px-8 py-20 text-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <ShieldAlert className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-bold text-xs">
                        No events found
                    </p>
                </div>
            </td>
        </tr>
    )
}

/**
 * LoadingRow - Skeleton loader for table rows
 */
export function LoadingRow() {
    return (
        <tr className="animate-pulse">
            <td colSpan={7} className="px-8 py-5">
                <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl w-full" />
            </td>
        </tr>
    )
}
