import { ShieldAlert, Clock } from 'lucide-react'
import classNames from '@/utils/classNames'
import type { SecurityEvent } from '../../types'
import { SEVERITY_CONFIG, STATUS_CONFIG } from '../../constants'
import StatusBadge from '../shared/StatusBadge'
import SecurityEventActions from './SecurityEventActions'

interface SecurityEventRowProps {
    event: SecurityEvent
    onAction: (action: 'block' | 'investigate' | 'verify' | 'limit', event: SecurityEvent) => void
}

/**
 * SecurityEventRow - Individual row in the security events table
 * Displays event details and available actions
 */
export default function SecurityEventRow({ event, onAction }: SecurityEventRowProps) {
    const getSeverityIconStyle = (severity: string) => {
        switch (severity) {
            case 'critical':
                return 'bg-rose-50 border-rose-100 text-rose-500'
            case 'high':
                return 'bg-orange-50 border-orange-100 text-orange-500'
            default:
                return 'bg-gray-50 border-gray-100 text-gray-500'
        }
    }

    return (
        <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
            {/* Event Type */}
            <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                    <div className={classNames(
                        "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 border",
                        getSeverityIconStyle(event.severity)
                    )}>
                        <ShieldAlert size={18} />
                    </div>
                    <div>
                        <div className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-tight">
                            {event.type.replace('_', ' ')}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 font-medium">
                            <Clock size={12} className="text-gray-500" />
                            {event.timestamp}
                        </div>
                    </div>
                </div>
            </td>

            {/* User */}
            <td className="px-8 py-5">
                {event.user ? (
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-tight">
                            {event.user.name}
                        </span>
                        <code className="text-xs text-gray-700 dark:text-gray-300 font-mono">
                            {event.user.email}
                        </code>
                    </div>
                ) : (
                    <span className="text-xs text-gray-600 italic">System / Unknown</span>
                )}
            </td>

            {/* Location / IP */}
            <td className="px-8 py-5">
                <div className="flex flex-col">
                    <span className="font-mono text-xs font-bold text-gray-700 dark:text-gray-300">
                        {event.sourceIp}
                    </span>
                    <span className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                        {event.location}
                    </span>
                </div>
            </td>

            {/* Assigned To */}
            <td className="px-8 py-5">
                {event.assignedTo ? (
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black border border-primary/20">
                            {event.assignedTo.name.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                            {event.assignedTo.name}
                        </span>
                    </div>
                ) : (
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide bg-gray-50 px-2 py-1 rounded-md">
                        Unassigned
                    </span>
                )}
            </td>

            {/* Severity */}
            <td className="px-8 py-5">
                <StatusBadge status={event.severity} config={SEVERITY_CONFIG} />
            </td>

            {/* Status */}
            <td className="px-8 py-5">
                <StatusBadge status={event.status} config={STATUS_CONFIG} />
            </td>

            {/* Actions */}
            <td className="px-8 py-5">
                <SecurityEventActions event={event} onAction={onAction} />
            </td>
        </tr>
    )
}
