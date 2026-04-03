'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchApiKeys, fetchApiKeysStats } from '@/store/slices/apiKeys'
import { Key, History, LayoutGrid, Info, Zap, ShieldCheck } from 'lucide-react'
import ApiKeysSummary from "./_components/ApiKeysSummary"
import ApiKeysList from "./_components/ApiKeysList"
import ApiKeysSecurity from "./_components/ApiKeysSecurity"
import ApiIntegrationGuide from "./_components/ApiIntegrationGuide"
import CreateApiKeyButton from "./_components/CreateApiKeyButton"
import { Tabs, Card } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabContent from '@/components/ui/Tabs/TabContent'

export default function Page() {
    const dispatch = useDispatch()
    const [activeTab, setActiveTab] = useState('registry')

    useEffect(() => {
        // Fetch API keys and stats on mount
        dispatch(fetchApiKeys() as any)
        dispatch(fetchApiKeysStats() as any)
    }, [dispatch])

    const handleKeyCreated = () => {
        // Refresh data after creating new key
        dispatch(fetchApiKeys() as any)
        dispatch(fetchApiKeysStats() as any)
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5] dark:bg-gray-900/50 p-4 sm:p-8 overflow-x-hidden">
            <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-700">
                {/* Header Section - Enterprise Grade */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
                    <div className="space-y-3 lg:space-y-1">
                        <div className="flex items-center gap-3 sm:gap-4 mb-2">
                            <span className="text-[9px] sm:text-[10px] font-black text-primary whitespace-nowrap">Security & Access</span>
                            <div className="h-px w-8 sm:w-12 bg-primary/20" />
                            <span className="text-[9px] sm:text-[10px] font-black text-gray-400 whitespace-nowrap">Keys</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-2 sm:p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shrink-0">
                                <Key className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                            </div>
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 dark:text-white">
                                Key Registry
                            </h1>
                        </div>
                        <p className="text-sm sm:text-base lg:text-lg text-gray-500 dark:text-gray-400 lg:pl-14 font-medium max-w-2xl leading-relaxed">
                            A centralized hub to monitor, manage, and secure your API credentials across all projects.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <CreateApiKeyButton
                            onSuccess={handleKeyCreated}
                            className="h-12 sm:h-14 px-6 sm:px-8 bg-primary hover:bg-primary-deep text-white font-black text-[10px] sm:text-[11px] rounded-xl sm:rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 sm:gap-3 group w-full sm:w-auto"
                        />
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="relative">
                    <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full opacity-50 pointer-events-none" />

                    {/* Stats Overview */}
                    <div className="relative z-10 mb-10">
                        <ApiKeysSummary />
                    </div>

                    {/* Main Content Areas */}
                    <div className="relative z-10">
                        <Tabs defaultValue="registry" className="w-full">
                            <div className="flex flex-col lg:items-start gap-6 mb-8">
                                <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                                    <TabList className="bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-2xl w-fit min-w-max border border-gray-100 dark:border-gray-800 shadow-sm">
                                        <TabNav value="registry" className="px-4 sm:px-6 py-2.5 rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-primary transition-all font-black text-[10px] sm:text-xs whitespace-nowrap">
                                            <History className="w-4 h-4" />
                                            <span>Keys</span>
                                        </TabNav>
                                        <TabNav value="guide" className="px-4 sm:px-6 py-2.5 rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-primary transition-all font-black text-[10px] sm:text-xs whitespace-nowrap">
                                            <Info className="w-4 h-4" />
                                            <span className="hidden sm:inline">How to Use</span>
                                            <span className="sm:hidden">Guide</span>
                                        </TabNav>
                                        <TabNav value="security" className="px-4 sm:px-6 py-2.5 rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-primary transition-all font-black text-[10px] sm:text-xs whitespace-nowrap">
                                            <ShieldCheck className="w-4 h-4" />
                                            <span>Security</span>
                                        </TabNav>
                                    </TabList>
                                </div>


                            </div>

                            <TabContent value="registry" className="mt-0">
                                <ApiKeysList />
                            </TabContent>

                            <TabContent value="guide" className="mt-0">
                                <ApiIntegrationGuide />
                            </TabContent>

                            <TabContent value="security" className="mt-0">
                                <ApiKeysSecurity />
                            </TabContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}
