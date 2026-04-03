'use client'

import { useMemo } from 'react'
import {
    Wallet,
    Zap,
    Bot,
    LayoutDashboard,
} from 'lucide-react'
import type { UserMember } from '@/app/(protected-pages)/admin/users/types'
import AnalyticsCard from '@/app/(protected-pages)/admin/users/_components/UsersAnalytics/AnalyticsCard'

interface UserDetailsAnalyticsProps {
    data: UserMember
}

const UserDetailsAnalytics = ({ data }: UserDetailsAnalyticsProps) => {
    const stats = useMemo(() => {
        const baseStats = [
            {
                title: 'User Credits',
                value: data.credits?.toLocaleString() || '0',
                icon: <Wallet className="w-6 h-6" />,
                bgColor: 'bg-primary/10',
                iconColor: 'text-primary',
                description: 'Personal balance',
                trend: { value: 'Stable', isPositive: true }
            },
            {
                title: 'Total Spending',
                value: `₦${Number(data.totalSpending || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                icon: <Zap className="w-6 h-6" />,
                bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
                iconColor: 'text-indigo-600 dark:text-indigo-400',
                description: 'Money spent on AI tasks',
                trend: { value: 'Stable', isPositive: true }
            },
            {
                title: 'Copilots',
                value: (data.botsCount || 0).toLocaleString(),
                icon: <Bot className="w-6 h-6" />,
                bgColor: 'bg-emerald-50 dark:bg-emerald-900/10',
                iconColor: 'text-emerald-600 dark:text-emerald-400',
                description: 'Active copilots'
            },
            {
                title: 'Projects',
                value: (data.projectsCount || 0).toLocaleString(),
                icon: <LayoutDashboard className="w-6 h-6" />,
                bgColor: 'bg-pink-50 dark:bg-pink-900/10',
                iconColor: 'text-pink-600 dark:text-pink-400',
                description: 'Shared working areas'
            }
        ];

        if (data.orgCredits !== undefined && data.orgCredits > 0) {
            baseStats.splice(1, 0, {
                title: 'Org Credits',
                value: data.orgCredits.toLocaleString(),
                icon: <Wallet className="w-6 h-6" />,
                bgColor: 'bg-orange-50 dark:bg-orange-900/20',
                iconColor: 'text-orange-600 dark:text-orange-400',
                description: `Balance of ${data.organization?.name || 'Organization'}`,
                trend: { value: 'Available', isPositive: true }
            });
        }

        return baseStats;
    }, [data])

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 select-none">
            {stats.map((stat, index) => (
                <AnalyticsCard key={index} {...stat} />
            ))}
        </div>
    )
}

export default UserDetailsAnalytics
