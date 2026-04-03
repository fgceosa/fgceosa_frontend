import { Ban, Eye, Lock, ZapOff, ShieldAlert } from 'lucide-react'
import type { ApiKey } from '../../types'

interface ApiKeyActionsProps {
    apiKey: ApiKey
    onAction: (action: 'revoke' | 'monitor' | 'lock_account' | 'enforce_limit' | 'require_verification', apiKey: ApiKey) => void
}

/**
 * ApiKeyActions - Action buttons for API keys
 * Provides quick actions: monitor, revoke, lock account, enforce limits, require verification
 */
export default function ApiKeyActions({ apiKey, onAction }: ApiKeyActionsProps) {
    const actions = [
        {
            type: 'monitor' as const,
            icon: Eye,
            title: 'Monitor',
            colorClass: 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border-blue-100 dark:bg-blue-900/20 dark:border-blue-800'
        },
        {
            type: 'revoke' as const,
            icon: Ban,
            title: 'Revoke Key',
            colorClass: 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border-rose-100 dark:bg-rose-900/20 dark:border-rose-800'
        },
        {
            type: 'lock_account' as const,
            icon: Lock,
            title: 'Lock Account',
            colorClass: 'bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white border-orange-100 dark:bg-orange-900/20 dark:border-orange-800'
        },
        {
            type: 'enforce_limit' as const,
            icon: ZapOff,
            title: 'Enforce Limits',
            colorClass: 'bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white border-amber-100 dark:bg-amber-900/20 dark:border-amber-800'
        },
        {
            type: 'require_verification' as const,
            icon: ShieldAlert,
            title: 'Require Verification',
            colorClass: 'bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white border-purple-100 dark:bg-purple-900/20 dark:border-purple-800'
        }
    ]

    return (
        <div className="flex gap-2 justify-center">
            {actions.map(({ type, icon: Icon, title, colorClass }) => (
                <button
                    key={type}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-300 shadow-sm ${colorClass}`}
                    onClick={() => onAction(type, apiKey)}
                    title={title}
                    aria-label={title}
                >
                    <Icon size={16} />
                </button>
            ))}
        </div>
    )
}
