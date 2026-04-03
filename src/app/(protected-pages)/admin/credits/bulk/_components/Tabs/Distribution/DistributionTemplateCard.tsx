import { Badge, Card } from '@/components/ui'
import classNames from '@/utils/classNames'

export interface DistributionTemplateCardProps {
    icon: any
    title: string
    description: string
    stats: string
    badgeText: string
    badgeType: 'success' | 'primary' | 'secondary'
    isActive?: boolean
    onClick?: () => void
    onEdit?: (e: React.MouseEvent) => void
    onDelete?: (e: React.MouseEvent) => void
    amount?: string
}

import { Edit3, Trash2 } from 'lucide-react'

export function DistributionTemplateCard({
    icon: Icon,
    title,
    description,
    stats,
    badgeText,
    badgeType,
    isActive,
    onClick,
    onEdit,
    onDelete,
    amount
}: DistributionTemplateCardProps) {
    return (
        <Card
            onClick={onClick}
            className={classNames(
                "group p-6 bg-white dark:bg-gray-900 border rounded-[1.8rem] transition-all duration-300 cursor-pointer shadow-lg shadow-gray-200/20 dark:shadow-none",
                isActive
                    ? "border-primary ring-2 ring-primary/10 bg-primary/[0.02]"
                    : "border-gray-100 dark:border-gray-800 hover:border-primary/30 hover:shadow-primary/5"
            )}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={classNames(
                    "p-3 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                    isActive ? "bg-primary text-white" : "bg-gray-50 dark:bg-gray-800 text-primary"
                )}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col items-end gap-2">
                    <Badge
                        content={badgeText}
                        innerClass={classNames(
                            "text-[9px] font-black px-2 py-0.5 rounded-full border",
                            badgeType === 'success' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                badgeType === 'primary' ? "bg-primary/5 text-primary border-primary/10" :
                                    "bg-gray-50 text-gray-500 border-gray-100"
                        )}
                    />
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onEdit && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(e); }}
                                className="p-1.5 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-primary rounded-lg transition-colors border border-gray-100 dark:border-gray-700"
                            >
                                <Edit3 className="w-3 h-3" />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(e); }}
                                className="p-1.5 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-rose-500 rounded-lg transition-colors border border-gray-100 dark:border-gray-700"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <h4 className="text-sm font-black text-gray-900 dark:text-white mb-2">{title}</h4>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                {description}
            </p>

            {amount && (
                <div className="mb-4">
                    <p className="text-xs font-black text-gray-900 dark:text-gray-100 mb-1">Default Allocation</p>
                    <p className="text-xl font-black text-primary tracking-tight">{amount}</p>
                </div>
            )}

            <div className="pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                <span className="text-xs font-black text-gray-900 dark:text-gray-100">Pricing Model</span>
                <span className="text-xs font-black text-primary">{stats}</span>
            </div>
        </Card>
    )
}
