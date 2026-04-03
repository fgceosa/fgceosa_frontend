import classNames from '@/utils/classNames'

interface UserStatusBadgeProps {
    status: string
}

export default function UserStatusBadge({ status }: UserStatusBadgeProps) {
    const statusLower = (status || 'unknown').toLowerCase()
    const isActive = statusLower === 'active'
    const isPending = statusLower === 'pending'
    // const isBlocked = statusLower === 'blocked' || statusLower === 'suspended'

    return (
        <span className={classNames(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize",
            isActive
                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-100 dark:border-green-800'
                : isPending
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-100 dark:border-amber-800'
                    : 'bg-rose-50 text-rose-700 dark:bg-red-900/20 dark:text-red-400 border border-rose-100 dark:border-red-800'
        )}>
            {status || 'Unknown'}
        </span>
    )
}
