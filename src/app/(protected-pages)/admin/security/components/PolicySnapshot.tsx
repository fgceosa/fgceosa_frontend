import { Card } from '@/components/ui'
import { ShieldCheck, Server, Globe2, Gauge } from 'lucide-react'
import classNames from '@/utils/classNames'
import type { PolicySnapshotData } from '../types'
import { useSecurityStats } from '../hooks'

interface PolicySnapshotProps {
    data?: PolicySnapshotData
}

export default function PolicySnapshot({ data }: PolicySnapshotProps) {
    const { stats } = useSecurityStats()

    // Use data from backend stats, fallback to prop or defaults
    const policy = data || stats?.policySnapshot || {
        mfaStatus: 'enforced' as const,
        apiAbuseProtection: 'active' as const,
        geoRestrictions: ['US', 'EU', 'UK'],
        rateLimitPolicy: '1000 req/hour'
    }

    const items = [
        {
            label: 'MFA Policy',
            value: policy.mfaStatus,
            icon: ShieldCheck,
            color: policy.mfaStatus === 'enforced' ? 'text-emerald-500' : 'text-amber-500',
            bg: policy.mfaStatus === 'enforced' ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-amber-50 dark:bg-amber-900/20'
        },
        {
            label: 'API Protection',
            value: policy.apiAbuseProtection,
            icon: Server,
            color: 'text-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            label: 'Rate Limiting',
            value: policy.rateLimitPolicy,
            icon: Gauge,
            color: 'text-purple-500',
            bg: 'bg-purple-50 dark:bg-purple-900/20'
        }
    ]

    return (
        <Card className="rounded-[1.8rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none bg-white dark:bg-gray-900 overflow-hidden h-full">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    Policy Snapshot
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mt-1">Current security posture</p>
            </div>

            <div className="p-6 space-y-4">
                {items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className={classNames("p-2 rounded-lg", item.bg, item.color)}>
                                <item.icon className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{item.label}</span>
                        </div>
                        <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                            {item.value}
                        </span>
                    </div>
                ))}

                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500">
                            <Globe2 className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Geo-Restrictions</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {policy.geoRestrictions.map((geo, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-100 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300">
                                {geo}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    )
}
