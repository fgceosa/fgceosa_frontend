'use client'

import React from 'react'
import { Users, UserCheck, ShieldAlert, Zap } from 'lucide-react'
import { useAppSelector } from '@/store/hook'
import { selectUsersAnalytics } from '@/store/slices/admin/users'
import AnalyticsCard from './UsersAnalytics/AnalyticsCard'

/**
 * UsersAnalytics - Displays KPI cards for user management
 */
export default function UsersAnalytics() {
    const analytics = useAppSelector(selectUsersAnalytics)

    if (!analytics) return null

    const stats = [
        {
            title: 'Total Users',
            value: analytics.totalUsers?.toLocaleString() || '0',
            icon: <Users className="w-6 h-6" />,
            trend: analytics.totalUsersTrend || { value: '0%', isPositive: true },
            bgColor: 'bg-primary/10',
            iconColor: 'text-primary',
            description: 'Total team members'
        },
        {
            title: 'Active Users',
            value: analytics.activeUsers?.toLocaleString() || '0',
            icon: <UserCheck className="w-6 h-6" />,
            trend: analytics.activeUsersTrend || { value: '0%', isPositive: true },
            bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
            description: 'Users active now'
        },
        {
            title: 'Total Spending',
            value: `₦${analytics.usersUsage?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`,
            icon: <Zap className="w-6 h-6" />,
            trend: analytics.usersUsageTrend || { value: '0%', isPositive: true },
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            iconColor: 'text-blue-600 dark:text-blue-400',
            description: 'Total money spent'
        },
        {
            title: 'Pending Invites',
            value: analytics.pendingInvites?.toLocaleString() || '0',
            icon: <ShieldAlert className="w-6 h-6" />,
            bgColor: 'bg-amber-50 dark:bg-amber-900/20',
            iconColor: 'text-amber-600 dark:text-amber-400',
            description: 'Users invited'
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
            {stats.map((stat) => (
                <AnalyticsCard key={stat.title} {...stat} />
            ))}
        </div>
    )
}
