import classNames from '@/utils/classNames'

export interface CampaignStatusBadgeProps {
    status: string
}

export function CampaignStatusBadge({ status }: CampaignStatusBadgeProps) {
    const statusLower = status.toLowerCase()
    const isActive = statusLower === 'active'
    const isCompleted = statusLower === 'completed'
    const isPlanned = statusLower === 'planned'

    return (
        <div className={classNames(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black capitalize border transition-all duration-300",
            isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/30 shadow-sm" :
                isCompleted ? "bg-primary/5 text-primary border-primary/10" :
                    isPlanned ? "bg-amber-50 text-amber-600 border-amber-100" :
                        "bg-gray-50 text-gray-500 border-gray-100"
        )}>
            <div className={classNames(
                "w-1 h-1 rounded-full",
                isActive ? "bg-emerald-500 animate-pulse" : isCompleted ? "bg-primary" : isPlanned ? "bg-amber-500" : "bg-gray-400"
            )} />
            <span>{status}</span>
        </div>
    )
}
