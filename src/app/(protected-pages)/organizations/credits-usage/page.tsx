'use client'

import { useState } from 'react'
import { Plus, Sparkles, CreditCard, History, Settings2, Activity, Building } from 'lucide-react'
import { Button, Tabs, Card } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabContent from '@/components/ui/Tabs/TabContent'
import TopUpModal from '@/components/template/Topup/TopUpModal'
import PurchaseTab from './_components/PurchaseTab'
import { creditPlans } from '@/mock/billing'
import TransactionHistory from './_components/TransactionHistory'
import PaymentTab from './_components/PaymentTab'
import CreditBalanceCardNew from './_components/CreditBalanceCardNew'
import WorkspaceHeader from '../../workspace/_components/WorkspaceHeader'
import type { TopUpConfig } from './types'
import classNames from '@/utils/classNames'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchOrganizationUsageSummary } from '@/store/slices/organization/organizationThunk'
import { selectOrganizationUsageSummary } from '@/store/slices/organization/organizationSelectors'
import { useOrganization } from '../layout'
import { useHasPermission } from '@/utils/hooks/useAuthorization'

export default function Credits() {
    const dispatch = useAppDispatch()
    const { organizationId } = useOrganization()
    const usageSummary = useAppSelector(selectOrganizationUsageSummary)
    const canTopUp = useHasPermission('can_top_up_org_wallet')

    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('purchase')
    const [presetPlanId, setPresetPlanId] = useState<string | undefined>()
    const [presetAmount, setPresetAmount] = useState<number | undefined>()
    const [topUpConfig, setTopUpConfig] = useState<TopUpConfig>({})

    useEffect(() => {
        if (organizationId) {
            dispatch(fetchOrganizationUsageSummary({ organizationId }))
        }
    }, [organizationId, dispatch])

    const formatNumber = (num: number | undefined) => {
        return new Intl.NumberFormat('en-US').format(num || 0)
    }

    const openTopUpModal = (config?: {
        initialStep?: TopUpConfig['initialStep']
        presetPlanId?: string
        presetAmount?: number
    }) => {
        if (config) {
            setTopUpConfig(config)
            setPresetPlanId(config.presetPlanId)
            setPresetAmount(config.presetAmount)
        }
        setIsTopUpModalOpen(true)
    }

    const closeTopUpModal = () => {
        setIsTopUpModalOpen(false)
        setTopUpConfig({})
    }

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-700 w-full max-w-[1440px] mx-auto">
            {/* Header Section */}
            <WorkspaceHeader
                title="Credits & Usage"
                tag="Administration"
                description="Manage your organization's AI credits, monitor usage breakdown across workspaces, and top up your account."
                icon={CreditCard}
                actions={
                    canTopUp && (
                        <button
                            onClick={() => openTopUpModal({ initialStep: 'select' })}
                            className="h-12 sm:h-14 px-8 bg-primary hover:bg-primary-deep text-white font-black text-xs rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group w-full sm:w-auto"
                        >
                            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                            <span className="text-xs">Add Credits Now</span>
                        </button>
                    )
                }
            />

            {/* Balance Overview section with background decoration */}
            <div className="relative">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <CreditBalanceCardNew />
            </div>

            {/* Usage Breakdown Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-primary rounded-full" />
                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Usage Overview</h3>
                </div>

                <Card className="p-8 rounded-[2.5rem] bg-white dark:bg-gray-900 border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-900 dark:to-gray-900/50">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Usage Breakdown</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-3 py-1 rounded-full text-xs font-black text-gray-700 dark:text-gray-300">
                                This Month
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {usageSummary?.workspacesUsage?.length ? (
                            usageSummary.workspacesUsage.map((ws: any) => (
                                <div key={ws.workspaceId} className="group">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-50 dark:border-gray-700">
                                                <Building className="w-4 h-4 text-gray-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{ws.workspaceName}</p>
                                                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{formatNumber(ws.totalUsage)} Credits Used</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-gray-900 dark:text-white">{ws.usagePercentage.toFixed(1)}%</p>
                                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">of org usage</p>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out group-hover:bg-primary-deep"
                                            style={{ width: `${ws.usagePercentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10 text-gray-400 font-medium">
                                <p>No usage data available for this month</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Navigation Tabs */}
            <Tabs
                value={activeTab}
                onChange={setActiveTab}
                className="w-full"
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                        <TabList className="flex gap-2 p-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 w-fit min-w-max">
                            <TabNav
                            value="purchase"
                            className={classNames(
                                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all duration-300",
                                activeTab === 'purchase'
                                    ? "bg-white dark:bg-gray-900 text-primary shadow-sm"
                                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                            )}
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            Packages
                        </TabNav>
                        <TabNav
                            value="history"
                            className={classNames(
                                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all duration-300",
                                activeTab === 'history'
                                    ? "bg-white dark:bg-gray-900 text-primary shadow-sm"
                                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                            )}
                        >
                            <History className="w-3.5 h-3.5" />
                            Transactions
                        </TabNav>
                        <TabNav
                            value="settings"
                            className={classNames(
                                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all duration-300",
                                activeTab === 'settings'
                                    ? "bg-white dark:bg-gray-900 text-primary shadow-sm"
                                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                            )}
                        >
                            <Settings2 className="w-3.5 h-3.5" />
                            Settings
                        </TabNav>
                    </TabList>
                    </div>

                </div>

                <div className="mt-8">
                    <TabContent value="purchase" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <PurchaseTab
                            data={creditPlans}
                            onPurchaseClick={(plan) =>
                                openTopUpModal({
                                    initialStep: 'payment',
                                    presetPlanId: plan?.id,
                                    presetAmount: plan?.amount ? Number(plan.amount) : undefined,
                                })
                            }
                        />
                    </TabContent>

                    <TabContent value="history" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <TransactionHistory organizationId={organizationId || undefined} />
                    </TabContent>

                    <TabContent value="settings" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <PaymentTab
                            onPurchaseClick={() => openTopUpModal({ initialStep: 'select' })}
                        />
                    </TabContent>
                </div>
            </Tabs>

            <TopUpModal
                isOpen={isTopUpModalOpen}
                onClose={closeTopUpModal}
                presetPlanId={presetPlanId}
                presetAmount={presetAmount}
                initialStep={topUpConfig.initialStep}
                organizationId={organizationId || undefined}
            />
        </div>
    )
}

