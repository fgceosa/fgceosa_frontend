import classNames from '@/utils/classNames'

export interface TransactionStatusBadgeProps {
    status: string
}

export function TransactionStatusBadge({ status }: TransactionStatusBadgeProps) {
    const safeStatus = status || 'Unknown'
    const statusLower = safeStatus.toLowerCase()
    const isCompleted = statusLower === 'completed' || statusLower === 'success'
    const isProcessing = statusLower === 'processing' || statusLower === 'pending'
    const isFailed = statusLower === 'failed' || statusLower === 'error'

    return (
        <div className={classNames(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border transition-all duration-300",
            isCompleted
                ? "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30 shadow-sm shadow-green-200/20"
                : isProcessing
                    ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/30"
                    : isFailed
                        ? "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/30"
                        : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700/30"
        )}>
            <div className={classNames(
                "w-1.5 h-1.5 rounded-full animate-pulse",
                isCompleted ? "bg-green-600" : isProcessing ? "bg-amber-500" : isFailed ? "bg-rose-600" : "bg-gray-500"
            )} />
            <span>{safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1).toLowerCase()}</span>
        </div>
    )
}
