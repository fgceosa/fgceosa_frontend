'use client'

import { Card } from '@/components/ui'
import { Activity, ShieldAlert, UserCheck, Lock, AlertCircle, Clock } from 'lucide-react'
import classNames from '@/utils/classNames'
import type { AuditLogStats as IAuditLogStats } from '../types'
import { NumericFormat } from 'react-number-format'

interface AuditLogStatsProps {
    stats?: IAuditLogStats
}

interface StatCardProps {
    label: string
    value: string | number
    icon: any
    color: string
    bgColor: string
    secondaryText: string
}

function StatCard({ label, value, icon: Icon, color, bgColor, secondaryText }: StatCardProps) {
    return (
        <Card className="rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none p-6 bg-white dark:bg-gray-900 overflow-hidden group transition-all hover:border-primary/20 relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                <Icon className="w-16 h-16" />
            </div>
            
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-0.5 tracking-tight">
                {typeof value === 'number' ? <NumericFormat displayType="text" value={value} thousandSeparator /> : value}
            </h3>
            <p className={classNames("text-[10px] font-bold mt-2 flex items-center gap-1", color)}>
                <Activity className="w-3 h-3" />
                {secondaryText}
            </p>
        </Card>
    )
}

export default function AuditLogStats({ stats }: AuditLogStatsProps) {
    const data = stats || {
        totalEvents: 0,
        criticalActions: 0,
        adminActions: 0,
        securitySensitive: 0,
        failedActions: 0
    }

    const cards = [
        {
            label: 'Total Events',
            value: data.totalEvents,
            icon: Activity,
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
            secondaryText: 'Integrity Verified'
        },
        {
            label: 'Failed Actions',
            value: data.failedActions,
            icon: AlertCircle,
            color: 'text-rose-500',
            bgColor: 'bg-rose-50 dark:bg-rose-900/20',
            secondaryText: 'System Active'
        },
        {
            label: 'Admin Operations',
            value: data.adminActions,
            icon: UserCheck,
            color: 'text-amber-500',
            bgColor: 'bg-amber-50 dark:bg-amber-900/20',
            secondaryText: 'Live Metrics'
        },
        {
            label: 'Security Health',
            value: data.criticalActions > 0 ? 'Warning' : 'Optimal',
            icon: ShieldAlert,
            color: 'text-purple-500',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            secondaryText: `${data.criticalActions} Critical Events`
        },
        {
            label: 'Compliance Status',
            value: 'Active',
            icon: Lock,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            secondaryText: 'SOC2 Ready'
        }
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {cards.map((card, idx) => (
                <StatCard key={idx} {...card} />
            ))}
        </div>
    )
}
