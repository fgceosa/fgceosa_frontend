'use client'

import { useState } from 'react'
import { History, BarChart3, Wallet, Lock } from 'lucide-react'
import { Tabs } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabContent from '@/components/ui/Tabs/TabContent'
import TransactionHistory from '../credits-usage/_components/TransactionHistory'
import CreditBalanceCardNew from './_components/CreditBalanceCardNew'
import UsageAnalytics from './_components/UsageAnalytics'
import classNames from '@/utils/classNames'
import { useOrganization } from '../OrganizationContext'
import { useAppSelector } from '@/store'
import { selectCurrentUserRole } from '@/store/slices/organization/organizationSelectors'

export default function OrganizationBilling() {
    const { organizationId } = useOrganization()
    const userRole = useAppSelector(selectCurrentUserRole)
    const isSuperAdmin = userRole === 'org_super_admin'

    const [activeTab, setActiveTab] = useState(isSuperAdmin ? 'usage' : 'history')

    const tabs = [
        ...(isSuperAdmin ? [{ id: 'usage', icon: BarChart3, label: 'Analytics' }] : []),
        { id: 'history', icon: History, label: 'History' },
    ]

    return (
        <div className="py-8 px-4 sm:px-6 space-y-10 w-full max-w-[1600px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 pb-4 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 sm:gap-4 mb-2">
                        <span className="text-[9px] sm:text-[10px] font-black text-primary uppercase tracking-[0.2em]">Organization</span>
                        <div className="h-px w-8 sm:w-12 bg-primary/20" />
                        <span className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Compute & Billing</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700">
                                <Wallet className="h-6 w-6 text-primary" />
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white leading-none">
                                Credits & Usage
                            </h1>
                        </div>
                        <p className="text-base lg:text-lg text-gray-500 dark:text-gray-400 font-medium max-w-2xl leading-relaxed">
                            Monitor resource consumption, manage payment infrastructure, and analyze historical spend.
                        </p>
                    </div>
                </div>

            </div>

            {/* Quick Metrics section */}
            <div className="relative z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1/2 bg-primary/5 rounded-full blur-[120px] pointer-events-none opacity-50" />
                <CreditBalanceCardNew />
            </div>

            {/* Main Content Sections */}
            <div className="space-y-8 relative z-10">
                <Tabs value={activeTab} onChange={setActiveTab} className="w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                        <TabList className="flex p-1.5 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-800 w-full sm:w-fit">
                            {tabs.map((tab) => (
                                <TabNav
                                    key={tab.id}
                                    value={tab.id}
                                    className={classNames(
                                        "flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-[10px] font-black transition-all duration-300 whitespace-nowrap",
                                        activeTab === tab.id
                                            ? "bg-white dark:bg-gray-900 text-primary shadow-xl shadow-gray-200/50 dark:shadow-none translate-y-[-1px]"
                                            : "text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    )}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </TabNav>
                            ))}
                        </TabList>

                        <div className="flex items-center gap-3 px-4 py-2.5 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800/20 whitespace-nowrap">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">Payments Online</span>
                        </div>
                    </div>

                    <div className="mt-12 group-data-[state=inactive]:hidden">
                        {isSuperAdmin && (
                            <TabContent value="usage" className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                                <div className="space-y-10">
                                    <UsageAnalytics />
                                </div>
                            </TabContent>
                        )}

                        <TabContent value="history" className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                            <TransactionHistory
                                organizationId={isSuperAdmin ? (organizationId || undefined) : undefined}
                                isReadOnly
                            />
                        </TabContent>
                    </div>
                </Tabs>
            </div>
        </div>
    )
}
