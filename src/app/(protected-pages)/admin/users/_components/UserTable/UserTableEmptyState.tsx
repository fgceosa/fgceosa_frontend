import { Users } from 'lucide-react'

export default function UserTableEmptyState() {
    return (
        <tr>
            <td colSpan={8} className="px-8 py-20 text-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-400 font-bold text-xs">No members found</p>
                </div>
            </td>
        </tr>
    )
}
