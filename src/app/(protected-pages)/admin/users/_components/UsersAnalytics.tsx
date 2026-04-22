'use client'

import React from 'react'
import { Users, UserCheck, ShieldAlert, UserPlus } from 'lucide-react'
import { useAppSelector } from '@/store/hook'
import { selectUsersAnalytics } from '@/store/slices/admin/users'
import StatCard from '@/components/shared/StatCard'

/**
 * UsersAnalytics - Displays KPI cards for user management
 */
export default function UsersAnalytics() {
    const analytics = useAppSelector(selectUsersAnalytics)

    if (!analytics) return null

    const stats = [
        {
            title: 'Total Members',
            value: analytics.totalUsers?.toLocaleString() || '0',
            icon: <Users className="w-6 h-6" />,
            trend: analytics.totalUsersTrend,
            color: 'burgundy' as const,
            subtext: 'Total team members globally'
        },
        {
            title: 'Active Members',
            value: analytics.activeUsers?.toLocaleString() || '0',
            icon: <UserCheck className="w-6 h-6" />,
            trend: analytics.activeUsersTrend,
            color: 'emerald' as const,
            subtext: 'Currently active sessions'
        },
        {
            title: 'Pending Invites',
            value: analytics.pendingInvites?.toLocaleString() || '0',
            icon: <ShieldAlert className="w-6 h-6" />,
            color: 'amber' as const,
            subtext: 'Awaiting registration'
        },
        {
            title: 'New Members',
            value: analytics.newMembers?.toLocaleString() || '0',
            icon: <UserPlus className="w-6 h-6" />,
            trend: analytics.usersUsageTrend, // using a real trend if backend supplies one
            color: 'indigo' as const,
            subtext: 'Joined in last 30 days'
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
            {stats.map((stat, i) => (
                <StatCard 
                    key={stat.title} 
                    {...stat} 
                    isFirst={i === 0}
                />
            ))}
        </div>
    )
}
