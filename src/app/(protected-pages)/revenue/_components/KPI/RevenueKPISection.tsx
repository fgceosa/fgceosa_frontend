'use client'

import React from 'react'
import { NumericFormat } from 'react-number-format'
import {
    Landmark,
    CreditCard,
    PieChart,
    Activity,
    Coins,
    Zap,
    Percent,
    Users
} from 'lucide-react'
import { KPIStatCard } from './KPIStatCard'
import { KPI } from '../../types'

interface RevenueKPISectionProps {
    data: {
        totalRevenue: KPI
        modelCosts: KPI
        netProfit: KPI
        outstandingPayments: KPI
        creditsSold: KPI
        creditsConsumed: KPI
        grossMargin: KPI
        activeOrganizations: KPI
    }
}

/**
 * RevenueKPISection - Displays a grid of key revenue and usage metrics.
 * Provides a high-level summary of the platform's financial health.
 */
export default function RevenueKPISection({ data }: RevenueKPISectionProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPIStatCard
                title="Revenue"
                value={<NumericFormat displayType="text" value={data.totalRevenue.amount} prefix="₦" thousandSeparator decimalScale={2} fixedDecimalScale />}
                subtitle="Total income"
                icon={Landmark}
                colorClass="bg-blue-50 dark:bg-blue-900/20 text-primary border-blue-100/50 dark:border-blue-800/20"
                status="active"
                trend={{ value: data.totalRevenue.change, direction: data.totalRevenue.trend }}
                tooltipContent="Revenue = actual cash collected from all sources"
            />

            <KPIStatCard
                title="Costs"
                value={<NumericFormat displayType="text" value={data.modelCosts.amount} prefix="₦" thousandSeparator decimalScale={2} fixedDecimalScale />}
                subtitle="Total expenses"
                icon={Activity}
                colorClass="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border-indigo-100/50 dark:border-indigo-800/20"
                status="normal"
                trend={{ value: data.modelCosts.change, direction: data.modelCosts.trend }}
                tooltipContent="Total operational costs including AI provider charges"
            />

            <KPIStatCard
                title="Profit"
                value={<NumericFormat displayType="text" value={data.netProfit.amount} prefix="₦" thousandSeparator decimalScale={2} fixedDecimalScale />}
                subtitle="Net profit"
                icon={PieChart}
                colorClass="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100/50 dark:border-emerald-800/20"
                status="active"
                trend={{ value: data.netProfit.change, direction: data.netProfit.trend }}
                tooltipContent="Net Profit = Earnings - Costs"
            />

            <KPIStatCard
                title="Pending"
                value={<NumericFormat displayType="text" value={data.outstandingPayments.amount} prefix="₦" thousandSeparator decimalScale={2} fixedDecimalScale />}
                subtitle="Unpaid amount"
                icon={CreditCard}
                colorClass="bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100/50 dark:border-amber-800/20"
                status={data.outstandingPayments.amount > 0 ? 'warning' : 'normal'}
                trend={{ value: data.outstandingPayments.change, direction: data.outstandingPayments.trend }}
                tooltipContent="Total revenue currently pending or unpaid"
            />

            <KPIStatCard
                title="Credits Sold"
                value={<NumericFormat displayType="text" value={data.creditsSold.amount} thousandSeparator decimalScale={0} />}
                subtitle="Total credits purchased"
                icon={Coins}
                colorClass="bg-purple-50 dark:bg-purple-900/20 text-purple-600 border-purple-100/50 dark:border-purple-800/20"
                status="normal"
                trend={{ value: data.creditsSold.change, direction: data.creditsSold.trend }}
                tooltipContent="Total volume of AI credits sold to organizations"
            />

            <KPIStatCard
                title="Consumed"
                value={<NumericFormat displayType="text" value={data.creditsConsumed.amount} thousandSeparator decimalScale={0} />}
                subtitle="Credits used by users"
                icon={Zap}
                colorClass="bg-orange-50 dark:bg-orange-900/20 text-orange-600 border-orange-100/50 dark:border-orange-800/20"
                status="normal"
                trend={{ value: data.creditsConsumed.change, direction: data.creditsConsumed.trend }}
                tooltipContent="Credits actually consumed through AI usage"
            />

            <KPIStatCard
                title="Gross Margin"
                value={<NumericFormat displayType="text" value={data.grossMargin.amount} suffix="%" decimalScale={0} />}
                subtitle="Profitability ratio"
                icon={Percent}
                colorClass="bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 border-cyan-100/50 dark:border-cyan-800/20"
                status="active"
                trend={{ value: data.grossMargin.change, direction: data.grossMargin.trend }}
                tooltipContent="Gross Margin = (Earnings - Vendor Costs) / Earnings"
            />

            <KPIStatCard
                title="Active Orgs"
                value={<NumericFormat displayType="text" value={data.activeOrganizations.amount} thousandSeparator decimalScale={0} />}
                subtitle="Paying customers"
                icon={Users}
                colorClass="bg-rose-50 dark:bg-rose-900/20 text-rose-600 border-rose-100/50 dark:border-rose-800/20"
                status="active"
                trend={{ value: data.activeOrganizations.change, direction: data.activeOrganizations.trend }}
                tooltipContent="Total number of paying organizations with active usage"
            />
        </div>
    )
}
