'use client'

import { useMemo } from 'react'
import {
    Wallet,
    Zap,
    LayoutDashboard,
    AlertCircle
} from 'lucide-react'
import type { PlatformOrgDetail } from '../../types'
import AnalyticsCard from '@/app/(protected-pages)/admin/users/_components/UsersAnalytics/AnalyticsCard'

interface OrgDetailsAnalyticsProps {
    data: PlatformOrgDetail
}

const OrgDetailsAnalytics = ({ data }: OrgDetailsAnalyticsProps) => {
    const { billing } = data

    const stats = useMemo(() => [
        {
            title: 'Available Credits',
            value: billing.credits.toLocaleString(),
            icon: <Wallet className="w-6 h-6" />,
            bgColor: 'bg-emerald-50 dark:bg-emerald-900/10',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
            description: 'Organization balance (QOR)',
            trend: { value: 'Stable', isPositive: true }
        },
        {
            title: 'Monthly Usage',
            value: `₦${billing.monthlyUsage.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            icon: <Zap className="w-6 h-6" />,
            bgColor: 'bg-primary/10',
            iconColor: 'text-primary',
            description: 'Burn rate (30 days)',
            trend: { value: 'Active', isPositive: true }
        },
        {
            title: 'Total Overages',
            value: `₦${billing.overages.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            icon: <AlertCircle className="w-6 h-6" />,
            bgColor: 'bg-rose-50 dark:bg-rose-900/10',
            iconColor: 'text-rose-600 dark:text-rose-400',
            description: 'Unsettled settlements'
        },
        {
            title: 'Growth Margin',
            value: 'Healthy',
            icon: <LayoutDashboard className="w-6 h-6" />,
            bgColor: 'bg-indigo-50 dark:bg-indigo-900/10',
            iconColor: 'text-indigo-600 dark:text-indigo-400',
            description: 'Account health status',
            className: 'min-h-[210px]'
        }
    ], [billing])

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none animate-in slide-in-from-bottom-4 duration-1000">
            {stats.map((stat, index) => (
                <AnalyticsCard key={index} {...stat} />
            ))}
        </div>
    )
}

export default OrgDetailsAnalytics
