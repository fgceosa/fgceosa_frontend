import { Key, AlertTriangle } from 'lucide-react'
import classNames from '@/utils/classNames'
import type { ApiKey } from '../../types'
import { API_KEY_STATUS_CONFIG } from '../../constants'
import StatusBadge from '../shared/StatusBadge'
import ApiKeyActions from './ApiKeyActions'

interface ApiKeyRowProps {
    apiKey: ApiKey
    onAction: (action: 'revoke' | 'monitor' | 'lock_account' | 'enforce_limit' | 'require_verification', apiKey: ApiKey) => void
}

/**
 * ApiKeyRow - Individual row in the API key monitoring table
 * Displays API key details and available actions
 */
export default function ApiKeyRow({ apiKey, onAction }: ApiKeyRowProps) {
    const getAbuseScoreColor = (score: number) => {
        if (score >= 70) return 'text-rose-600 bg-rose-50 border-rose-200'
        if (score >= 40) return 'text-amber-600 bg-amber-50 border-amber-200'
        return 'text-emerald-600 bg-emerald-50 border-emerald-200'
    }

    const getUsagePercentage = (used: number, limit: number) => {
        return Math.round((used / limit) * 100)
    }

    const usagePercent = getUsagePercentage(apiKey.requestCount, apiKey.dailyLimit)

    return (
        <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
            {/* API Key */}
            <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-500 flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                        <Key size={18} />
                    </div>
                    <div>
                        <div className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-tight">
                            {apiKey.keyName}
                        </div>
                        <code className="text-xs text-gray-700 dark:text-gray-300 font-mono">
                            {apiKey.keyPrefix}
                        </code>
                    </div>
                </div>
            </td>

            {/* Owner */}
            <td className="px-8 py-5">
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-tight">
                        {apiKey.owner}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        Last used: {apiKey.lastUsed}
                    </span>
                </div>
            </td>

            {/* Usage */}
            <td className="px-8 py-5">
                <div className="flex flex-col gap-2">
                    <div className="flex items-baseline gap-2">
                        <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                            {apiKey.requestCount.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                            / {apiKey.dailyLimit.toLocaleString()}
                        </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                        <div
                            className={classNames(
                                "h-1.5 rounded-full transition-all",
                                usagePercent >= 90 ? "bg-rose-500" :
                                    usagePercent >= 70 ? "bg-amber-500" :
                                        "bg-emerald-500"
                            )}
                            style={{ width: `${Math.min(usagePercent, 100)}%` }}
                        />
                    </div>
                </div>
            </td>

            {/* Abuse Score */}
            <td className="px-8 py-5">
                <div className="flex items-center gap-2">
                    <span className={classNames(
                        "px-3 py-1.5 rounded-lg text-xs font-black border",
                        getAbuseScoreColor(apiKey.abuseScore)
                    )}>
                        {apiKey.abuseScore}/100
                    </span>
                    {apiKey.abuseScore >= 70 && (
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                    )}
                </div>
            </td>

            {/* Status */}
            <td className="px-8 py-5">
                <StatusBadge status={apiKey.status} config={API_KEY_STATUS_CONFIG} />
            </td>

            {/* Actions */}
            <td className="px-8 py-5">
                <ApiKeyActions apiKey={apiKey} onAction={onAction} />
            </td>
        </tr>
    )
}
