import { Users, Sparkles, PieChart, Landmark } from 'lucide-react'
import { NumericFormat } from 'react-number-format'
import { StatCard } from './StatCard'
import type { BulkCreditsStats } from '@/services/bulkCredits/bulkCreditsService'
import { NAIRA_TO_CREDIT_RATE } from '@/constants/currency.constant'

interface BulkStatsCardsProps {
    stats: BulkCreditsStats
}

export default function BulkStatsCards({ stats }: BulkStatsCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <StatCard
                title="Total Balance"
                value={
                    <span className="flex items-baseline gap-2">
                        <NumericFormat displayType="text" value={stats.totalBalance / NAIRA_TO_CREDIT_RATE} suffix=" Credits" thousandSeparator decimalScale={0} />
                        <span className="text-[10px] text-gray-400 font-medium tracking-wide">
                            (<NumericFormat displayType="text" value={stats.totalBalance} prefix="₦" thousandSeparator decimalScale={2} fixedDecimalScale />)
                        </span>
                    </span>
                }
                subtitle="Available for allocation"
                icon={Landmark}
                colorClass="bg-blue-50 dark:bg-blue-900/20 text-primary border-blue-100/50 dark:border-blue-800/20"
            />

            <StatCard
                title="Total Distributed"
                value={
                    <span className="flex items-baseline gap-2">
                        <NumericFormat displayType="text" value={stats.sentCredits / NAIRA_TO_CREDIT_RATE} suffix=" Credits" thousandSeparator decimalScale={0} />
                        <span className="text-[10px] text-gray-400 font-medium tracking-wide">
                            (<NumericFormat displayType="text" value={stats.sentCredits} prefix="₦" thousandSeparator decimalScale={2} fixedDecimalScale />)
                        </span>
                    </span>
                }
                subtitle="Cumulative distribution"
                icon={PieChart}
                colorClass="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border-indigo-100/50 dark:border-indigo-800/20"
            />

            <StatCard
                title="Verified Recipients"
                value={<NumericFormat displayType="text" value={stats.totalUsers} thousandSeparator />}
                subtitle="Total successful transfers"
                icon={Users}
                colorClass="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100/50 dark:border-emerald-800/20"
            />

            <StatCard
                title="Active Events"
                value={<NumericFormat displayType="text" value={stats.activeEvents} thousandSeparator />}
                subtitle="Ongoing programs"
                icon={Sparkles}
                colorClass="bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100/50 dark:border-amber-800/20"
            />
        </div>
    )
}
