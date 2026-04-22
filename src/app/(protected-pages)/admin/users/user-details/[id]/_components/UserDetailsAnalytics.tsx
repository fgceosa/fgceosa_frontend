'use client'

import { useMemo } from 'react'
import {
    Wallet,
    Calendar,
    Building2,
    Shield
} from 'lucide-react'
import type { UserMember } from '@/app/(protected-pages)/admin/users/types'
import StatCard from '@/components/shared/StatCard'

interface UserDetailsAnalyticsProps {
    data: UserMember
}

const UserDetailsAnalytics = ({ data }: UserDetailsAnalyticsProps) => {
    const stats = useMemo(() => {
        return [
            {
                title: 'Dues Status',
                value: (data.dues || 'unpaid').toUpperCase(),
                icon: <Wallet className="w-6 h-6" />,
                color: data.dues === 'paid' ? 'emerald' : 'burgundy' as const,
                subtext: 'Financial standing',
                trend: { value: data.dues === 'paid' ? 'Up to date' : 'Overdue', isPositive: data.dues === 'paid' }
            },
            {
                title: 'FGCE Set',
                value: data.fgceSet || 'N/A',
                icon: <Calendar className="w-6 h-6" />,
                color: 'blue' as const,
                subtext: 'Graduation Year',
            },
            {
                title: 'FGCE House',
                value: data.fgceHouse || 'N/A',
                icon: <Building2 className="w-6 h-6" />,
                color: 'indigo' as const,
                subtext: 'School House'
            },
            {
                title: 'Member Rank',
                value: data.role || 'Member',
                icon: <Shield className="w-6 h-6" />,
                color: 'amber' as const,
                subtext: 'Platform authority'
            }
        ];
    }, [data])

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} isFirst={index === 0} />
            ))}
        </div>
    )
}

export default UserDetailsAnalytics
