'use client'

import { useState } from 'react'
import { NumericFormat } from 'react-number-format'
import type { PeriodMetrics, WeeklyUsageTrends } from '../types'
import { Card } from '@/components/ui'
import { CreditCard, Activity, Layers, Wallet } from 'lucide-react'
import { StatisticCard } from '../StatisticCard'
import Loading from '@/components/shared/Loading'
import AbbreviateNumber from '@/components/shared/AbbreviateNumber'
import { NAIRA_TO_CREDIT_RATE, CURRENCY_SYMBOL } from '@/constants/currency.constant'

type MetricType = 'creditBalance' | 'apiRequests' | 'spending' | 'activeProjects'

type OverviewProps = {
    weeklyMetrics?: PeriodMetrics
    monthlyMetrics?: PeriodMetrics
    annualMetrics?: PeriodMetrics
    weeklyUsageTrends?: WeeklyUsageTrends
}

const Overview = ({ weeklyMetrics, monthlyMetrics, annualMetrics }: OverviewProps) => {
    // Default to monthly metrics
    const currentMetrics = monthlyMetrics || weeklyMetrics || annualMetrics
    const [selectedMetric, setSelectedMetric] = useState<MetricType>('creditBalance')

    if (!currentMetrics) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-40 bg-gray-100 dark:bg-gray-800 rounded-[2rem]" />
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatisticCard
                title="Credit Balance"
                value={
                    <div className="flex items-baseline gap-1">
                        <NumericFormat
                            displayType="text"
                            value={currentMetrics.creditBalance}
                            thousandSeparator={true}
                            decimalScale={2}
                            fixedDecimalScale
                        />
                        <span className="text-[10px] font-black text-gray-500 dark:text-gray-400">CR</span>
                    </div>
                }
                icon={Wallet}
                label="creditBalance"
                active={selectedMetric === 'creditBalance'}
                onClick={setSelectedMetric}
                trend="STABLE"
                subtitle={`${CURRENCY_SYMBOL}${(Number(currentMetrics?.creditBalance || 0) * NAIRA_TO_CREDIT_RATE).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            />
            <StatisticCard
                title="API Requests"
                value={
                    <NumericFormat
                        displayType="text"
                        value={currentMetrics.apiRequests}
                        thousandSeparator={true}
                    />
                }
                icon={Activity}
                label="apiRequests"
                active={selectedMetric === 'apiRequests'}
                onClick={setSelectedMetric}
                iconClass="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border-indigo-100/50 dark:border-indigo-800/20"
                trend="ACTIVE"
            />
            <StatisticCard
                title="Total Consumed"
                value={
                    <div className="flex items-baseline gap-1">
                        <NumericFormat
                            displayType="text"
                            value={currentMetrics.spending}
                            thousandSeparator={true}
                            decimalScale={2}
                            fixedDecimalScale
                        />
                        <span className="text-[10px] font-black text-gray-500 dark:text-gray-400">CR</span>
                    </div>
                }
                icon={CreditCard}
                label="spending"
                active={selectedMetric === 'spending'}
                onClick={setSelectedMetric}
                subtitle={`${CURRENCY_SYMBOL}${(Number(currentMetrics?.spending || 0) * NAIRA_TO_CREDIT_RATE).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                iconClass="bg-rose-50 dark:bg-rose-900/10 text-rose-600 border-rose-100/50 dark:border-rose-800/20"
                trend={currentMetrics.spendingTrend || "0%"}
            />
            <StatisticCard
                title="Active Projects"
                value={
                    <AbbreviateNumber
                        value={currentMetrics.activeProjects ?? 0}
                    />
                }
                icon={Layers}
                label="activeProjects"
                active={selectedMetric === 'activeProjects'}
                onClick={setSelectedMetric}
                iconClass="bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100/50 dark:border-amber-800/20"
                trend="GROWING"
            />
        </div>
    )
}

export default Overview