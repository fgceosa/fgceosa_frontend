import React from 'react'

const COLUMNS = [
    { label: 'Member', align: 'left' },
    { label: 'Role', align: 'left' },
    { label: 'FGCE Set', align: 'left' },
    { label: 'Status', align: 'left' },
    { label: 'Dues', align: 'left' },
    { label: 'Actions', align: 'center' },
] as const

interface UserTableHeaderProps {
    onSelectAll?: (checked: boolean) => void
    isAllSelected?: boolean
}

export default function UserTableHeader({ onSelectAll, isAllSelected }: UserTableHeaderProps) {
    return (
        <thead className="bg-gray-50/50 dark:bg-gray-950/50 border-b border-gray-100 dark:border-gray-800">
            <tr>
                <th className="pl-8 py-5 text-left w-10">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">#</span>
                </th>
                {COLUMNS.map((col) => (
                    <th
                        key={col.label}
                        className={`px-8 py-5 text-${col.align} text-sm font-black text-gray-900`}
                    >
                        {col.label}
                    </th>
                ))}
            </tr>
        </thead>
    )
}
