'use client'

import { useState } from 'react'
import { Plus, CreditCard, History, BarChart3, TrendingUp, Wallet } from 'lucide-react'
import { Button, Tabs, Card } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabContent from '@/components/ui/Tabs/TabContent'
import TransactionHistory from './_components/TransactionHistory'
import PaymentTab from './_components/PaymentTab'
import CreditBalanceCardNew from './_components/CreditBalanceCardNew'
import UsageAnalytics from './_components/UsageAnalytics'
import classNames from '@/utils/classNames'
import Link from 'next/link'

export default function Credits() {
    const [activeTab, setActiveTab] = useState('usage')

    return (
        <div className="py-8 px-4 sm:px-6 space-y-10 w-full max-w-[1600px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 pb-4 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 sm:gap-4 mb-2">
                        <span className="text-[9px] sm:text-[10px] font-black text-primary uppercase tracking-[0.2em]">Dashboard</span>
                        <div className="h-px w-8 sm:w-12 bg-primary/20" />
                        <span className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Billing & Credits</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700">
                                <Wallet className="h-6 w-6 text-primary" />
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white leading-none">
                                Billing
                            </h1>
                        </div>
                        <p className="text-base lg:text-lg text-gray-500 dark:text-gray-400 font-medium max-w-2xl leading-relaxed">
                            Track your usage, manage payments, and view your billing history.
                        </p>
                    </div>
                </div>

                <Link
                    href="/dashboard/billing/top-up"
                    className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 bg-primary hover:bg-primary-deep text-white font-black text-[12px] rounded-xl sm:rounded-2xl shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-3 group whitespace-nowrap"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    Add Credits
                </Link>
            </div>

            {/* Quick Metrics section */}
            <div className="relative z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1/2 bg-primary/5 rounded-full blur-[120px] pointer-events-none opacity-50" />
                <CreditBalanceCardNew />
            </div>

            {/* Main Content Sections */}
            <div className="space-y-8 relative z-10">
                <Tabs value={activeTab} onChange={setActiveTab} className="w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
                        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                            <TabList className="flex p-1.5 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-800 w-fit min-w-max">
                                {[
                                    { id: 'usage', icon: BarChart3, label: 'Analytics' },
                                    { id: 'history', icon: History, label: 'History' },
                                    { id: 'methods', icon: CreditCard, label: 'Payments' },
                                ].map((tab) => (
                                    <TabNav
                                        key={tab.id}
                                        value={tab.id}
                                        className={classNames(
                                            "flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-[10px] font-black transition-all duration-300 whitespace-nowrap",
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
                        </div>

                        <div className="flex items-center gap-3 px-4 py-2.5 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800/20 whitespace-nowrap self-start sm:self-auto">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">Payments Online</span>
                        </div>
                    </div>

                    <div className="mt-12 group-data-[state=inactive]:hidden">
                        <TabContent value="usage" className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                            <div className="space-y-10">
                                <UsageAnalytics />
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <Card className="p-8 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                                                    <TrendingUp className="w-5 h-5" />
                                                </div>
                                                <h4 className="text-xl font-black text-gray-900 dark:text-white">Usage Forecast</h4>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                                Based on your current consumption of <span className="text-primary font-black italic">642 units/day</span>, your current balance will likely last for approximately <span className="text-primary font-black">22 days</span>.
                                            </p>
                                        </div>
                                    </Card>
                                    <Link href="/dashboard/billing/top-up" className="group/promo block">
                                        <Card className="p-8 border-none bg-gradient-to-br from-primary via-primary-deep to-blue-900 rounded-[2.5rem] shadow-2xl shadow-primary/20 h-full flex flex-col justify-center gap-4">
                                            <div className="flex items-center gap-3 text-white/60 mb-2">
                                                <TrendingUp className="w-5 h-5" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Growth Plan</span>
                                            </div>
                                            <h4 className="text-2xl font-black text-white group-hover/promo:translate-x-2 transition-transform">Get 20% Bonus Credits</h4>
                                            <p className="text-white/70 text-sm font-medium">Refill with 50,000 credits or more to unlock exclusive compute bonuses.</p>
                                        </Card>
                                    </Link>
                                </div>
                            </div>
                        </TabContent>

                        <TabContent value="history" className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                            <TransactionHistory />
                        </TabContent>

                        <TabContent value="methods" className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                            <PaymentTab onPurchaseClick={() => { }} />
                        </TabContent>
                    </div>
                </Tabs>
            </div>
        </div>
    )
}


