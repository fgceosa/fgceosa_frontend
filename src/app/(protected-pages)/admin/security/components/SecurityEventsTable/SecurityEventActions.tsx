import { ShieldCheck, Ban, Search, ZapOff } from 'lucide-react'
import type { SecurityEvent } from '../../types'

interface SecurityEventActionsProps {
    event: SecurityEvent
    onAction: (action: 'block' | 'investigate' | 'verify' | 'limit', event: SecurityEvent) => void
}

/**
 * SecurityEventActions - Action buttons for security events
 * Provides quick actions: investigate, verify, limit, and block
 */
export default function SecurityEventActions({ event, onAction }: SecurityEventActionsProps) {
    const actions = [
        {
            type: 'investigate' as const,
            icon: Search,
            title: 'Investigate',
            colorClass: 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border-blue-100 dark:bg-blue-900/20 dark:border-blue-800'
        },
        {
            type: 'verify' as const,
            icon: ShieldCheck,
            title: 'Require Verification',
            colorClass: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800'
        },
        {
            type: 'limit' as const,
            icon: ZapOff,
            title: 'Enforce Limits',
            colorClass: 'bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white border-amber-100 dark:bg-amber-900/20 dark:border-amber-800'
        },
        {
            type: 'block' as const,
            icon: Ban,
            title: 'Block User',
            colorClass: 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border-rose-100 dark:bg-rose-900/20 dark:border-rose-800'
        }
    ]

    return (
        <div className="flex gap-2 justify-center">
            {actions.map(({ type, icon: Icon, title, colorClass }) => (
                <button
                    key={type}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-300 shadow-sm ${colorClass}`}
                    onClick={() => onAction(type, event)}
                    title={title}
                    aria-label={title}
                >
                    <Icon size={16} />
                </button>
            ))}
        </div>
    )
}
