'use client'

import { Tabs } from '@/components/ui'
import TabContent from '@/components/ui/Tabs/TabContent'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import BulkDistributionTab from './Tabs/Distribution/BulkDistributionTab'
import CampaignsTab from './Tabs/Events/CampaignsTab'
import TransactionsTab from './Tabs/History/TransactionsTab'
import AnalyticsTab from './Tabs/Analytics/AnalyticsTab'

// Types
import type { BulkTabsProps } from '../types'
import { Layers, Zap, History, Lock, BarChart3 } from 'lucide-react'

export default function BulkTabs({
    openSendModal,
    openBulkModal,
    treasuryType = 'platform',
    organizationId,
}: BulkTabsProps) {
    // Capability logic based on treasury type
    const capabilities = {
        canManagePrograms: treasuryType === 'platform' || treasuryType === 'organization',
        canBulkDistribute: true,
        canSendToOrgs: treasuryType === 'platform',
        isSuperAdmin: treasuryType === 'platform'
    }

    return (
        <Tabs defaultValue="bulk" className="w-full">
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-8 pt-1 no-scrollbar">
                <TabList className="bg-gray-50/50 dark:bg-gray-800/30 p-1.5 rounded-2xl w-fit border border-gray-100 dark:border-gray-800 shadow-sm flex flex-nowrap min-w-max gap-1">
                    <TabNav value="bulk" className="px-6 py-2.5 rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-primary transition-all font-black text-xs whitespace-nowrap">
                        <Layers className="w-4 h-4 shrink-0" />
                        <span>Bulk Send</span>
                    </TabNav>

                    <TabNav
                        value="campaigns"
                        disabled={!capabilities.canManagePrograms}
                        className="px-6 py-2.5 rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-primary transition-all font-black text-xs whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed group relative"
                    >
                        <Zap className="w-4 h-4 shrink-0" />
                        <span>Programs</span>
                        {!capabilities.canManagePrograms && (
                            <div className="absolute -top-1 -right-1">
                                <Lock className="w-3 h-3 text-gray-400 shrink-0" />
                            </div>
                        )}
                    </TabNav>

                    <TabNav value="transactions" className="px-6 py-2.5 rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-primary transition-all font-black text-xs whitespace-nowrap">
                        <History className="w-4 h-4 shrink-0" />
                        <span>Transaction History</span>
                    </TabNav>

                    <TabNav value="analytics" className="px-6 py-2.5 rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-primary transition-all font-black text-xs whitespace-nowrap">
                        <BarChart3 className="w-4 h-4 shrink-0" />
                        <span>Analytics</span>
                    </TabNav>
                </TabList>
            </div>

            <TabContent value="bulk" className="mt-0 font-bold">
                <BulkDistributionTab treasuryType={treasuryType} organizationId={organizationId} />
            </TabContent>

            <TabContent value="campaigns" className="mt-0 font-bold">
                <CampaignsTab treasuryType={treasuryType} organizationId={organizationId} />
            </TabContent>

            <TabContent value="transactions" className="mt-0">
                <TransactionsTab treasuryType={treasuryType} organizationId={organizationId} />
            </TabContent>

            <TabContent value="analytics" className="mt-0">
                <AnalyticsTab organizationId={organizationId} />
            </TabContent>
        </Tabs>
    )
}
