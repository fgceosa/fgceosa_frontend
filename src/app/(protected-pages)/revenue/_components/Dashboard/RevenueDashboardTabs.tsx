'use client'

import React from 'react'
import { Tabs } from '@/components/ui'
import TabContent from '@/components/ui/Tabs/TabContent'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { Layout, Cpu, History, BarChart3, TrendingUp } from 'lucide-react'

// Components
import RevenuePerformanceChart from '../Charts/RevenuePerformanceChart'
import WorkspacePerformanceTable from '../Tables/WorkspacePerformanceTable'
import ModelPerformanceTable from '../Tables/ModelPerformanceTable'
import TransactionHistoryTable from '../Tables/TransactionHistoryTable'
import RevenueFilters from './RevenueFilters'
import CreditFlowSummary from '../KPI/CreditFlowSummary'
import RevenueSourceAnalysis from '../Charts/RevenueSourceAnalysis'
import ProviderAnalysisTable from '../Tables/ProviderAnalysisTable'
import TopOrganizationsTable from '../Tables/TopOrganizationsTable'

// Types
import { RevenuePageData } from '../../types'

interface RevenueDashboardTabsProps {
    data: RevenuePageData
    onPeriodChange: (period: string) => void
}

/**
 * RevenueDashboardTabs - Navigation tabs for switching between different revenue perspectives.
 * Includes Insights (Overview), Earnings Breakdown, and Transaction History.
 */
export default function RevenueDashboardTabs({ data, onPeriodChange }: RevenueDashboardTabsProps) {
    return (
        <Tabs defaultValue="performance" className="w-full">
            <TabList className="bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-2xl w-fit mb-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-wrap gap-1">
                <TabNav value="performance" className="px-6 py-2.5 rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-primary transition-all font-black text-[10px] whitespace-nowrap">
                    <TrendingUp className="w-4 h-4" />
                    <span>Insights</span>
                </TabNav>
                <TabNav value="breakdown" className="px-6 py-2.5 rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-primary transition-all font-black text-[10px] whitespace-nowrap">
                    <BarChart3 className="w-4 h-4" />
                    <span>Earnings Breakdown</span>
                </TabNav>
                <TabNav value="transactions" className="px-6 py-2.5 rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-primary transition-all font-black text-[10px] whitespace-nowrap">
                    <History className="w-4 h-4" />
                    <span>History</span>
                </TabNav>
            </TabList>

            {/* Performance & Insights Tab */}
            <TabContent value="performance" className="mt-0 space-y-12">
                <div className="relative z-10">
                    <RevenueFilters onPeriodChange={onPeriodChange} />
                </div>

                {/* Credit Flow Section - Primary Visibility */}
                <div className="relative z-10">
                    <CreditFlowSummary data={data.creditFlow} />
                </div>

                {/* Main Performance Chart - Compact Height */}
                <div className="relative z-10 h-[460px]">
                    <RevenuePerformanceChart data={data.chartData || []} />
                </div>

                {/* Secondary Metrics Section */}
                <div className="relative z-10">
                    <RevenueSourceAnalysis data={data.revenueBySource} />
                </div>
            </TabContent>

            {/* Earnings Breakdown Tab */}
            <TabContent value="breakdown" className="mt-0 space-y-12">
                {/* Team & Workspace Earnings Section */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-500/10 rounded-lg">
                            <Layout className="w-4 h-4 text-rose-500" />
                        </div>
                        <h3 className="text-sm font-black text-gray-900 dark:text-white">Team & Workspace Performance</h3>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                        <TopOrganizationsTable data={data.topSpenders} />
                        <WorkspacePerformanceTable data={data.revenueByWorkspace} />
                    </div>
                </section>

                {/* Model & Provider Performance Section */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <Cpu className="w-4 h-4 text-indigo-500" />
                        </div>
                        <h3 className="text-sm font-black text-gray-900 dark:text-white">AI Model & Provider Analysis</h3>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <ProviderAnalysisTable data={data.costByProvider} />
                        <ModelPerformanceTable data={data.topModels} />
                    </div>
                </section>
            </TabContent>

            {/* Transaction History Tab */}
            <TabContent value="transactions" className="mt-0">
                <TransactionHistoryTable data={data.recentTransactions} />
            </TabContent>
        </Tabs>
    )
}
