'use client'

import React from 'react'
import { CreditCard, Clock, CheckCircle2, AlertCircle, TrendingUp, Users, FileText } from 'lucide-react'
import StatCard from '@/components/shared/StatCard'

import { PaymentAnalytics } from '@/services/admin/paymentsService'
import Skeleton from '@/components/ui/Skeleton'

export default function PaymentsSummary({ analytics, isLoading }: { analytics: PaymentAnalytics | null, isLoading: boolean }) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-gray-50 dark:bg-gray-800 rounded-3xl animate-pulse" />
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard 
                icon={CreditCard} 
                title="Total Dues Collected" 
                value={analytics?.totalCollected || '₦0'} 
                subtext="Current period" 
                color="emerald" 
                isFirst
            />
            <StatCard 
                icon={Clock} 
                title="Pending Payments" 
                value={analytics?.pendingPayments || '₦0'} 
                subtext="Action required" 
                color="amber" 
            />
            <StatCard 
                icon={FileText} 
                title="Total Invoices" 
                value={analytics?.totalInvoices?.toString() || '0'} 
                subtext="This year" 
                color="blue" 
            />
            <StatCard 
                icon={AlertCircle} 
                title="Overdue Members" 
                value={analytics?.overdueMembers?.toString() || '0'} 
                subtext="Pending follow-up" 
                color="burgundy" 
            />
        </div>
    )
}
