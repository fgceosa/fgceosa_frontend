import { Checkbox } from '@/components/ui'

const COLUMNS = [
    { label: 'User', align: 'left' },
    { label: 'Organization', align: 'left' },
    { label: 'Role', align: 'left' },
    { label: 'Last Active', align: 'left' },
    { label: 'Credits', align: 'right' },
    { label: 'Spending', align: 'right' },
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
                    <Checkbox checked={isAllSelected} onChange={onSelectAll} />
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
